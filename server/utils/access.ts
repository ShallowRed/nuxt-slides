import type { Lifecycle, PublicationStatus } from '#shared/access'
import type { H3Event } from 'h3'
import process from 'node:process'
import { decideAccess } from '#shared/access'
import { getActorRole } from './actor'
import { verifyAccessPassword } from './password'

/**
 * The server-side access gate — the thin adapter around the pure `decideAccess`
 * (audit-style DI: the decision is pure, the I/O lives here). It resolves the
 * actor's role, computes whether the semi-private password is granted (cookie or
 * verified `?password=` param, setting a 24h cookie on success), then maps the
 * pure decision to HTTP.
 *
 * Both deck routes (`/api/presentations/:slug` and `/api/p/:alias`) call this, so
 * the per-status gate is defined ONCE — closing the hole where `/p/:alias` served
 * draft/private/semi-private decks with no check at all.
 */
export interface GateOptions {
  slug: string
  status: PublicationStatus
  lifecycle?: Lifecycle
  /** The deck's `accessPassword` hash from its frontmatter, if any. */
  storedHash?: string
}

/** Throws `createError` on deny/needs-password; returns normally on allow. */
export async function gateDeckAccess(event: H3Event, opts: GateOptions): Promise<void> {
  const { slug, status, lifecycle, storedHash } = opts
  const role = await getActorRole(event)
  const hasPassword = Boolean(storedHash)
  const passwordGranted = hasPassword
    ? await resolvePasswordGrant(event, slug, storedHash!)
    : false

  const decision = decideAccess({ status, lifecycle, role, hasPassword, passwordGranted })

  switch (decision.outcome) {
    case 'allow':
      return
    case 'needs-password':
      throw createError({
        statusCode: 401,
        statusMessage: 'Password required',
        data: { requiresPassword: true },
      })
    case 'deny':
      throw createError({
        statusCode: decision.reason === 'forbidden' ? 403 : 401,
        statusMessage: decision.reason === 'forbidden' ? 'Forbidden' : 'Authentication required',
      })
  }
}

/**
 * Whether the semi-private password is satisfied: a prior `access_<slug>` cookie,
 * or a valid `?password=` param (which then sets the 24h cookie). Mirrors the
 * original per-slug cookie flow.
 */
async function resolvePasswordGrant(event: H3Event, slug: string, storedHash: string): Promise<boolean> {
  if (getCookie(event, `access_${slug}`) === 'granted')
    return true

  const password = getQuery(event).password as string | undefined
  if (!password)
    return false

  const valid = await verifyAccessPassword(password, storedHash)
  if (!valid)
    return false

  setCookie(event, `access_${slug}`, 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
  return true
}
