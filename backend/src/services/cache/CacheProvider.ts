/**
 * Cache abstraction (Phase 11: Redis caching). Services depend on this
 * interface, never on Redis directly — matches the same pattern as
 * StorageProvider, PaymentProvider, PushProvider, and
 * EmergencyNotificationProvider elsewhere in this codebase.
 */
export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  /** Deletes every key matching a prefix — used to invalidate a whole family of cached queries at once. */
  delByPrefix(prefix: string): Promise<void>;
}
