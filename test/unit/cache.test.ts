import { describe, expect, it, vi } from 'vitest'
import { createTtlCache, DEFAULT_CACHE_TTL_MS } from '../../shared/deck/cache'

describe('createTtlCache', () => {
  it('memoizes within the TTL window and reloads after it', async () => {
    let calls = 0
    const cache = createTtlCache<number>(1000)
    const loader = async () => ++calls

    vi.useFakeTimers()
    try {
      expect(await cache.get('k', loader)).toBe(1)
      expect(await cache.get('k', loader)).toBe(1) // cached
      vi.advanceTimersByTime(1001)
      expect(await cache.get('k', loader)).toBe(2) // expired → reload
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('does not memoize a thrown loader (failures are not cached → fail-closed)', async () => {
    let calls = 0
    const cache = createTtlCache<number>(10_000)
    const failing = async () => {
      calls++
      throw new Error('boom')
    }
    await expect(cache.get('k', failing)).rejects.toThrow('boom')
    await expect(cache.get('k', failing)).rejects.toThrow('boom')
    expect(calls).toBe(2) // re-attempted, not served from cache
  })

  it('invalidates a single key and the whole cache', async () => {
    const cache = createTtlCache<number>(10_000)
    let n = 0
    const loader = async () => ++n
    expect(await cache.get('a', loader)).toBe(1)
    cache.invalidate('a')
    expect(await cache.get('a', loader)).toBe(2)
    cache.invalidate()
    expect(await cache.get('a', loader)).toBe(3)
  })

  it('exposes a sane default TTL', () => {
    expect(DEFAULT_CACHE_TTL_MS).toBe(10_000)
  })
})
