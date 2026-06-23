import process from 'node:process'

/**
 * Typed build/bundle configuration (audit §7 P2 #10 / Axe E).
 *
 * The standalone-bundle build was steered by four env toggles
 * (`BUNDLE_ONLY_SLUG`, `BUNDLE_PUBLIC_DIR`, `BUNDLE_THEME`, `NUXT_APP_BASE_URL`)
 * read ad hoc at several points of `nuxt.config.ts` and again in the frozen-bundle
 * Nitro plugin. This module reads them **once** into one typed object so there is
 * a single point of truth for "are we building a frozen bundle, and with what".
 *
 * Pure and Nuxt-free on purpose: it is imported both by `nuxt.config.ts` (Node
 * config eval, via a relative path) and by the server plugin (via `#shared`),
 * and is unit-testable against an injected `env`.
 */
export interface BundleConfig {
  /** True when building a single-deck standalone bundle (`BUNDLE_ONLY_SLUG`). */
  enabled: boolean
  /** The `<slug>--standalone` prerender target, when in bundle mode. */
  onlySlug?: string
  /** Reduced `public/` dir to build against (avoids aspirating the whole repo). */
  publicDir?: string
  /** Theme whose CSS the bundle links (defaults to `lee`). */
  theme: string
  /** App base URL the bundle is served under (defaults to `/`). */
  baseUrl: string
}

/** Default bundle theme, mirroring the Makefile's `BUNDLE_THEME ?= lee`. */
export const DEFAULT_BUNDLE_THEME = 'lee'

/**
 * Read the bundle configuration from an environment map (defaults to
 * `process.env`). Empty/undefined toggles collapse to `enabled: false`.
 */
export function readBundleConfig(env: NodeJS.ProcessEnv = process.env): BundleConfig {
  const onlySlug = env.BUNDLE_ONLY_SLUG || undefined
  const publicDir = env.BUNDLE_PUBLIC_DIR || undefined
  return {
    enabled: Boolean(onlySlug),
    onlySlug,
    publicDir,
    theme: env.BUNDLE_THEME || DEFAULT_BUNDLE_THEME,
    baseUrl: env.NUXT_APP_BASE_URL || '/',
  }
}
