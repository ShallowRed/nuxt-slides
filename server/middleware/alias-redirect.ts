import { resolveAlias } from '../utils/registry'

/**
 * Converge every legacy presentation path on the stable alias (DDR-018).
 *
 * Any `/slides/<x>` whose `<x>` resolves to a registry entry — by canonical alias,
 * by stub slug, or by a historical `aliases:` path (e.g. `/slides/codimd/<id>`) —
 * is 301-redirected to `/p/<alias>`. This guarantees a single source of truth:
 * the legacy `/slides/<slug>` cannot serve a different (stale, un-frozen) copy
 * than `/p/<alias>`. Decks NOT in the registry pass through untouched, and the
 * canonical `/p/<alias>` route is never affected (different path prefix).
 */
export default defineEventHandler(async (event) => {
  const path = event.path || ''

  if (!path.startsWith('/slides/'))
    return

  // Normalise to the form stored in the registry (`<slug>`, `codimd/<id>`…).
  const candidate = path.replace(/^\/slides\//, '').replace(/\/+$/, '').split('?')[0]
  if (!candidate)
    return

  const entry = await resolveAlias(candidate)
  // Any /slides/<x> that maps to a registry entry converges on /p/<alias> — even
  // when the names match (the /slides/ → /p/ prefix change is the whole point).
  if (entry) {
    await sendRedirect(event, `/p/${entry.alias}`, 301)
  }
})
