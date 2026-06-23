/**
 * Render port helpers (audit §5.8) — the "writer" side of the deck hexagon,
 * factored so `revealLive` and `revealFrozen` share one definition of the Reveal
 * config defaults, the iframe sandbox policy, the asset-URL rebasing pass, the
 * Storybook embed URL shape, the named transform pipeline, and the `DeckRenderer`
 * output port (`print` being the first standalone writer it materializes).
 */
export * from './embed-storybook'
export * from './print'
export * from './reveal'
export * from './storybook'
export * from './transforms'
