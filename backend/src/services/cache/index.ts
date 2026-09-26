import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { CacheProvider } from './CacheProvider';
import { redisCacheProvider } from './redisCacheProvider';
import { memoryCacheProvider } from './memoryCacheProvider';

const redisConfigured = Boolean(env.REDIS_URL);

if (!redisConfigured) {
  logger.warn(
    'REDIS_URL not set — using memoryCacheProvider (dev-only, not for production, does not share across instances)'
  );
}

export const cacheProvider: CacheProvider = redisConfigured
  ? redisCacheProvider
  : memoryCacheProvider;
