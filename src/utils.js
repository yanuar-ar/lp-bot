const { ethers } = require('ethers');

const shortAddress = (address) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const resolveEnsOrFormatAddress = async (address) => {
  return (await ethers.getDefaultProvider().lookupAddress(address)) || shortAddress(address);
};

module.exports = {
  shortAddress,
  resolveEnsOrFormatAddress,
};
