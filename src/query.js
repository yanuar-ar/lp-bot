const { gql } = require('graphql-request');

const sellsQuery = (blockNumber) => gql`
  {
    sells(
      orderBy: blockNumber
      first: 20
      where: {blockNumber_gt: ${blockNumber}}
      orderDirection: desc
    ) {
      from
      id
      tokenId
      blockTimestamp
      blockNumber
    }
  }
`;

const buysQuery = (blockNumber) => gql`
  {
    buys(
      orderBy: blockNumber
      first: 20
      where: {blockNumber_gt: ${blockNumber}}
      orderDirection: desc
    ) {
      from
      id
      tokenId
      value
      blockTimestamp
      blockNumber
    }
  }
`;

module.exports = {
  sellsQuery,
  buysQuery,
};
