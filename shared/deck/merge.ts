/**
 * Deep-merge and declared precedence (audit §5.4 / Axe A).
 *
 * A single deep-merge replaces the three divergent strategies (shallow on the
 * client, deep on `/api/codimd`, string-concat on `/p` & `/slides`). Precedence
 * stops being dispersed code and becomes *data*: a list of layers plus a note
 * override whitelist.
 */

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Recursively merge `override` onto `base`. Plain objects merge deeply; scalars
 * and arrays replace. `null`/`undefined` overrides are ignored so a stray empty
 * note key can't wipe a base default. (Faithful to the original `deepMerge` on
 * `/api/codimd`.)
 */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null)
      continue
    const current = out[key]
    if (isPlainObject(current) && isPlainObject(value))
      out[key] = deepMerge(current, value)
    else
      out[key] = value
  }
  return out as T
}

/**
 * Declared policy describing which keys of a note's frontmatter may override the
 * base layer:
 *   - `'all'`  → the note is the author's source of truth (CodiMD preset route).
 *   - `string[]` → only these top-level keys (e.g. `['storybook']` on `/p/<alias>`).
 *   - `[]`/undefined → the note contributes its body only, never its frontmatter.
 */
export type NoteOverridePolicy = 'all' | readonly string[] | undefined

/** Keep only the whitelisted top-level keys of an override object. */
export function applyOverridePolicy(
  noteFrontmatter: Record<string, unknown>,
  policy: NoteOverridePolicy,
): { filtered: Record<string, unknown>, applied: string[] } {
  if (policy === 'all') {
    const applied = Object.keys(noteFrontmatter).filter(
      k => noteFrontmatter[k] !== undefined && noteFrontmatter[k] !== null,
    )
    return { filtered: { ...noteFrontmatter }, applied }
  }
  if (!policy || policy.length === 0)
    return { filtered: {}, applied: [] }

  const filtered: Record<string, unknown> = {}
  const applied: string[] = []
  for (const key of policy) {
    const value = noteFrontmatter[key]
    if (value !== undefined && value !== null) {
      filtered[key] = value
      applied.push(key)
    }
  }
  return { filtered, applied }
}
