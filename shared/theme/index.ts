/**
 * Theme tokens (audit §5.5 / Axe D) — the single source of truth for the data
 * side of a theme (backgrounds, Reveal dimensions), from which `PRESETS`,
 * `THEME_BACKGROUNDS`, and the generated SCSS partial are derived.
 *
 * `consistency` adds the boot-time cross-check (tokens ↔ compiled CSS ↔ source).
 */
export * from './consistency'
export * from './tokens'
