const shortAddress = (address) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

module.exports = {
  shortAddress,
};
