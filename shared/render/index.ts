/**
 * Render port helpers (audit §5.8) — the "writer" side of the deck hexagon,
 * factored so `revealLive` and `revealFrozen` share one definition of the Reveal
 * config defaults, the iframe sandbox policy, and the asset-URL rebasing pass.
 */
export * from './reveal'
