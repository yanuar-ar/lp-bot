const { redis } = require('./clients');
const { getSellCacheKey, getBuyCacheKey } = require('./cache');

async function setupSellCache() {
  const exists = await redis.exists(getSellCacheKey);
  if (exists === 0) await redis.set(getSellCacheKey, 0);
}

async function setupBuyCache() {
  const exists = await redis.exists(getBuyCacheKey);
  if (exists === 0) await redis.set(getBuyCacheKey, 0);
}

module.exports = {
  setupSellCache,
  setupBuyCache,
};
