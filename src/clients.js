const { WebhookClient } = require('discord.js');
const Redis = require('ioredis');
const { Contract, providers } = require('ethers');
const LPAbi = require('../abi/TheLP.json');

const discordWebhook = new WebhookClient({
  id: process.env.DISCORD_WEBHOOK_ID,
  token: process.env.DISCORD_WEBHOOK_TOKEN,
});

const redis = new Redis(process.env.REDIS);

const jsonRpcProvider = new providers.JsonRpcProvider(process.env.JSON_RPC_URL);

const lpContract = new Contract(
  '0x38930aae699c4cd99d1d794df9db41111b13092b',
  LPAbi,
  jsonRpcProvider,
);

module.exports = {
  redis,
  discordWebhook,
  lpContract,
};
