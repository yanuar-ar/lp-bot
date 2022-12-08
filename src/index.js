const dotenv = require('dotenv');
dotenv.config();
const { request } = require('graphql-request');
const { redis, discordWebhook } = require('./clients');
const { EmbedBuilder } = require('discord.js');
const { ethers } = require('ethers');
const { setupSellCache, setupBuyCache } = require('./setup');
const { sellsQuery, buysQuery } = require('./query');
const { getSellCacheKey, getBuyCacheKey } = require('./cache');
const { shortAddress, resolveEnsOrFormatAddress } = require('./utils');
const _ = require('lodash');

// Sell Transaction
async function processSellTick() {
  const sellBlockNumberCache = await redis.get(getSellCacheKey);

  console.log('Check sell transaction after block number:', sellBlockNumberCache);

  let { sells } = await request(process.env.GRAPHQL_API_URL, sellsQuery(sellBlockNumberCache));

  sells = _.orderBy(sells, ['blockNumber'], ['asc']);

  if (sells.length == 0) return;

  for (const sell of sells) {
    const embed = new EmbedBuilder()
      .setTitle('Sell Transaction')
      .setURL(`https://etherscan.io/tx/${sell.id}`)
      .addFields(
        {
          name: 'From',
          value: `[${await resolveEnsOrFormatAddress(sell.from)}](https://etherscan.io/address/${
            sell.from
          })`,
          inline: true,
        },
        {
          name: 'Token Id',
          value: `${sell.tokenId}`,
          inline: true,
        },
      )
      .setTimestamp();

    discordWebhook.send({
      username: 'The LP BOT',
      avatarURL: 'https://prop.house/bulb.png',
      embeds: [embed],
    });
    console.log(
      `New sell transaction from ${shortAddress(sell.from)} with tokenId: ${
        sell.tokenId
      }  at block number: ${sell.blockNumber}`,
    );
  }

  const lastBlockNumber = sells[sells.length - 1].blockNumber;
  await redis.set(getSellCacheKey, lastBlockNumber);
}

// Buy Transaction
async function processBuyTick() {
  const buyBlockNumberCache = await redis.get(getBuyCacheKey);

  console.log('Check buy transaction after block number:', buyBlockNumberCache);

  let { buys } = await request(process.env.GRAPHQL_API_URL, buysQuery(buyBlockNumberCache));

  buys = _.orderBy(buys, ['blockNumber'], ['asc']);

  if (buys.length == 0) return;

  for (const buy of buys) {
    const embed = new EmbedBuilder()
      .setTitle('Buy Transaction')
      .setURL(`https://etherscan.io/tx/${buy.id}`)
      .addFields(
        {
          name: 'From',
          value: `[${await resolveEnsOrFormatAddress(buy.from)}](https://etherscan.io/address/${
            buy.from
          })`,
          inline: true,
        },
        {
          name: 'Token Id',
          value: `${buy.tokenId}`,
          inline: true,
        },
        {
          name: 'Value',
          value: 'Ξ ' + parseFloat(ethers.utils.formatEther(buy.value)).toFixed(3),
          inline: true,
        },
      )
      .setTimestamp();

    discordWebhook.send({
      username: 'The LP BOT',
      avatarURL: 'https://prop.house/bulb.png',
      embeds: [embed],
    });
    console.log(
      `New buy transaction from ${shortAddress(buy.from)} with tokenId: ${
        buy.tokenId
      } at block number: ${buy.blockNumber}`,
    );
  }

  const lastBlockNumber = buys[buys.length - 1].blockNumber;
  await redis.set(getBuyCacheKey, lastBlockNumber);
}

// setup
setupSellCache().then(() => 'setupSellCache');
setupBuyCache().then(() => 'setupBuyCache');

//run first
processSellTick();
processBuyTick();

//schedule
setInterval(async () => processSellTick(), 60000);
setInterval(async () => processBuyTick(), 60000);
