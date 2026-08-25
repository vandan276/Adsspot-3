import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  if (!redisInstance) {
    redisInstance = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 4000,
      lazyConnect: true,
    });

    redisInstance.on('error', (err) => {
      console.warn('[AWS ElastiCache Redis] Cache connection issue:', err.message);
    });
  }

  return redisInstance;
};

/**
 * Cache a key with TTL in seconds
 */
export async function cacheSet(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, serialized);
  } catch (err) {
    console.warn('[Redis cacheSet error]:', err);
  }
}

/**
 * Get cached item by key
 */
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('[Redis cacheGet error]:', err);
    return null;
  }
}

/**
 * Invalidate cache key or pattern
 */
export async function cacheDel(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn('[Redis cacheDel error]:', err);
  }
}
