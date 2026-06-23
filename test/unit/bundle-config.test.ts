import { describe, expect, it } from 'vitest'
import { DEFAULT_BUNDLE_THEME, readBundleConfig } from '../../shared/build/bundle'

describe('readBundleConfig', () => {
  it('is disabled with sane defaults when no toggles are set', () => {
    expect(readBundleConfig({})).toEqual({
      enabled: false,
      onlySlug: undefined,
      publicDir: undefined,
      theme: DEFAULT_BUNDLE_THEME,
      baseUrl: '/',
    })
  })

  it('enables bundle mode and reads every toggle once', () => {
    const cfg = readBundleConfig({
      BUNDLE_ONLY_SLUG: 'my-deck--standalone',
      BUNDLE_PUBLIC_DIR: '/tmp/bundle-public',
      BUNDLE_THEME: 'dsfr',
      NUXT_APP_BASE_URL: '/frozen/my-deck/',
    })
    expect(cfg).toEqual({
      enabled: true,
      onlySlug: 'my-deck--standalone',
      publicDir: '/tmp/bundle-public',
      theme: 'dsfr',
      baseUrl: '/frozen/my-deck/',
    })
  })

  it('treats empty strings as unset', () => {
    const cfg = readBundleConfig({ BUNDLE_ONLY_SLUG: '', BUNDLE_THEME: '' })
    expect(cfg.enabled).toBe(false)
    expect(cfg.theme).toBe(DEFAULT_BUNDLE_THEME)
  })
})
