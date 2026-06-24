import { KNOWN_THEMES } from './tokens'

/**
 * Theme-source consistency check (audit §7 quick win: "valider le nom de thème au
 * boot — warn si CSS absent dans public/themes/").
 *
 * A theme is declared across three places that can silently drift:
 *   - the TS tokens manifest (`THEME_TOKENS` → {@link KNOWN_THEMES}) — the data side;
 *   - a compiled stylesheet `public/themes/<name>.css` — what the renderer links;
 *   - a SCSS source dir `themes/<name>/` — what produces the stylesheet.
 *
 * When they disagree the failure is quiet and confusing: a deck whose theme has
 * tokens but no CSS links a 404 stylesheet; a CSS-only theme (no tokens) is
 * flagged "unknown" per-deck even though it renders. This pure function takes the
 * three name sets and reports the mismatches, so a boot-time plugin can surface
 * them once at startup instead of leaving each case to be discovered in the wild.
 *
 * Pure and fs-free on purpose: the caller reads the directories; this only
 * compares names, so it is unit-testable without a filesystem.
 */

export interface ThemeConsistencyInput {
  /** Theme names with a tokens-manifest entry (defaults to {@link KNOWN_THEMES}). */
  tokens?: readonly string[]
  /** Base names of the compiled `public/themes/*.css` files. */
  cssFiles: readonly string[]
  /** Names of the SCSS source directories under `themes/` (optional). */
  sourceDirs?: readonly string[]
}

export interface ThemeConsistencyReport {
  /** True when no warnings were found. */
  ok: boolean
  /** Human-readable warning lines (empty when ok). */
  warnings: string[]
  /** Themes that have tokens but no compiled CSS — the dangerous case (404 link). */
  missingCss: string[]
  /** Compiled CSS with no tokens entry — renders, but flagged "unknown" per-deck. */
  missingTokens: string[]
}

/** Names that are infrastructure, not user-selectable themes — never flagged. */
const NON_THEME_DIRS = new Set(['presets', 'shared'])

/**
 * Cross-check the three theme sources and report drift. `missingCss` is the
 * actionable case (a tokens theme whose stylesheet is absent → broken link);
 * `missingTokens` is informational (a CSS theme works but has no data entry).
 */
export function checkThemeConsistency(input: ThemeConsistencyInput): ThemeConsistencyReport {
  const tokens = new Set(input.tokens ?? KNOWN_THEMES)
  const css = new Set(input.cssFiles)
  const warnings: string[] = []

  const missingCss = [...tokens].filter(name => !css.has(name)).sort()
  for (const name of missingCss) {
    warnings.push(
      `theme "${name}" has a tokens entry but no public/themes/${name}.css — decks using it will link a missing stylesheet`,
    )
  }

  const missingTokens = [...css].filter(name => !tokens.has(name)).sort()
  for (const name of missingTokens) {
    warnings.push(
      `theme "${name}" has public/themes/${name}.css but no tokens entry — it renders, but is flagged "unknown" per deck (no backgrounds/dimensions)`,
    )
  }

  // A SCSS source dir with no compiled CSS means `build:themes` didn't emit it.
  if (input.sourceDirs) {
    const orphanSources = input.sourceDirs
      .filter(name => !NON_THEME_DIRS.has(name) && !css.has(name))
      .sort()
    for (const name of orphanSources) {
      warnings.push(
        `theme source themes/${name}/ has no compiled public/themes/${name}.css — run \`pnpm build:themes\``,
      )
    }
  }

  return {
    ok: warnings.length === 0,
    warnings,
    missingCss,
    missingTokens,
  }
}
