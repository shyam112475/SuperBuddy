import type { CacheProvider } from './CacheProvider';

/**
 * DEVELOPMENT-ONLY cache provider. Stores everything in a plain JS Map with
 * a timer per key instead of a real Redis instance.
 *
 * This is NOT production-ready: it's per-process (no sharing across
 * multiple server instances, which defeats the point of caching read-heavy
 * discovery queries at scale) and vanishes on restart. Set REDIS_URL to use
 * the real provider instead — see redisCacheProvider.ts.
 */
const store = new Map<string, { value: unknown; expiresAt: number }>();

function isExpired(entry: { expiresAt: number }): boolean {
  return Date.now() > entry.expiresAt;
}

export const memoryCacheProvider: CacheProvider = {
  async get<T>(key: string): Promise<T | null> {
    const entry = store.get(key);
    if (!entry || isExpired(entry)) {
      store.delete(key);
      return null;
    }
    return entry.value as T;
  },

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },

  async del(key: string): Promise<void> {
    store.delete(key);
  },

  async delByPrefix(prefix: string): Promise<void> {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) store.delete(key);
    }
  },
};
