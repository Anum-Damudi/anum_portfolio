interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private store: Map<string, CacheItem<any>> = new Map();

  /**
   * Retrieve cached value or return null if expired or missing
   */
  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Set cached value with TTL in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Delete specific cache key
   */
  del(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix or pattern
   */
  invalidatePattern(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.store.clear();
  }
}

export const cacheService = new CacheService();
