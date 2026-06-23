/**
 * A tiny TTL cache (audit §3.2 / Axe B, recommendation P1 #6).
 *
 * `CACHE_TTL_MS` was hard-coded and duplicated in `server/utils/codimd.ts` and
 * `server/utils/registry.ts`. This factors the same memoize-with-expiry into one
 * configurable helper so every source shares a single, overridable TTL instead of
 * re-implementing it. Framework-agnostic and synchronous around an async loader.
 */

/** Default freshness window: short, so live collaborative edits propagate fast. */
export const DEFAULT_CACHE_TTL_MS = 10_000

export interface TtlCache<T> {
  /** Return the cached value when fresh, else run `loader`, cache, and return it. */
  get: (key: string, loader: () => Promise<T>) => Promise<T>
  /** Drop one key (or the whole cache when omitted). */
  invalidate: (key?: string) => void
}

interface Entry<T> {
  value: T
  fetchedAt: number
}

/**
 * Create a TTL cache. `ttlMs` defaults to {@link DEFAULT_CACHE_TTL_MS} and can be
 * provided as a number or a getter (so it can read runtime config lazily).
 */
export function createTtlCache<T>(ttlMs: number | (() => number) = DEFAULT_CACHE_TTL_MS): TtlCache<T> {
  const store = new Map<string, Entry<T>>()
  const ttl = () => (typeof ttlMs === 'function' ? ttlMs() : ttlMs)

  return {
    async get(key, loader) {
      const cached = store.get(key)
      if (cached && Date.now() - cached.fetchedAt < ttl())
        return cached.value
      const value = await loader()
      store.set(key, { value, fetchedAt: Date.now() })
      return value
    },
    invalidate(key) {
      if (key === undefined)
        store.clear()
      else
        store.delete(key)
    },
  }
}
