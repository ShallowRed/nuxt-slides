/**
 * Build-time configuration (audit §7 P2 #10 / #9) — a single typed reader for the
 * standalone-bundle env toggles (`./bundle`), and the declarative freeze
 * descriptor (`./freeze`) that turns the multi-target Makefile freeze pipeline
 * into one pure, unit-testable object. Shared by `nuxt.config.ts`, the
 * frozen-bundle Nitro plugin, and the `scripts/freeze.js` driver.
 */
export * from './bundle'
export * from './freeze'
export * from './public-decks'
