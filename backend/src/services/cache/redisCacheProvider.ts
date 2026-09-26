import { createClient, type RedisClientType } from 'redis';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { CacheProvider } from './CacheProvider';

let client: RedisClientType | null = null;

async function getClient(): Promise<RedisClientType> {
  if (client) return client;

  client = createClient({ url: env.REDIS_URL });
  client.on('error', (err) => logger.error({ err }, 'Redis client error'));
  await client.connect();
  return client;
}

export const redisCacheProvider: CacheProvider = {
  async get<T>(key: string): Promise<T | null> {
    const c = await getClient();
    const raw = await c.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const c = await getClient();
    await c.set(key, JSON.stringify(value), { EX: ttlSeconds });
  },

  async del(key: string): Promise<void> {
    const c = await getClient();
    await c.del(key);
  },

  async delByPrefix(prefix: string): Promise<void> {
    const c = await getClient();
    // SCAN rather than KEYS — KEYS blocks the whole Redis instance on a
    // large keyspace, SCAN doesn't. Fine to iterate for a cache-invalidation
    // path, since it's not latency-critical the way a read is.
    let cursor = 0;
    do {
      const result = await c.scan(cursor, { MATCH: `${prefix}*`, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length > 0) {
        await c.del(result.keys);
      }
    } while (cursor !== 0);
  },
};
