const { ethers } = require('ethers');
const { lpContract } = require('./clients');
const sharp = require('sharp');

const shortAddress = (address) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const resolveEnsOrFormatAddress = async (address) => {
  return (await ethers.getDefaultProvider().lookupAddress(address)) || shortAddress(address);
};

const getLPPngBuffer = async (tokenId) => {
  const tokenURI = await lpContract.tokenURI(tokenId);

  const data = JSON.parse(Buffer.from(tokenURI.substring(29), 'base64').toString('ascii'));
  const svg = Buffer.from(data.image.substring(26), 'base64');
  return sharp(svg).png().toBuffer();
};

module.exports = {
  shortAddress,
  resolveEnsOrFormatAddress,
  getLPPngBuffer,
};
