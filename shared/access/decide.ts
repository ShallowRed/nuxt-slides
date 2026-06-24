import type { Role } from './roles'
import type { Lifecycle, PublicationStatus } from './status'
import { isPrivileged } from './roles'

/**
 * The pure access decision (app-layer core, mirrors `resolveDeck`'s DI style).
 *
 * Who-can-see-what used to be branching code duplicated across the deck routes
 * (and entirely ABSENT from `/p/[alias]`, a security hole). This module is the one
 * place that decides, as a pure function: no I/O, no crypto, no session lookup.
 * The thin server adapter (`server/utils/access.ts`) computes `passwordGranted`
 * (cookie / verified param) and `role` (session), then calls in here.
 *
 * Capability matrix (action `view`):
 *
 *   status         │ anonymous / viewer        │ editor / owner
 *   ───────────────┼───────────────────────────┼────────────────
 *   public         │ allow                     │ allow
 *   semi-private   │ allow iff password granted │ allow
 *                  │ (deny if no hash set)     │
 *   draft          │ deny (auth-required/forbidden) │ allow
 *   private        │ deny (auth-required/forbidden) │ allow
 *
 * Lifecycle and the `unlisted` flag are orthogonal and only affect *listing*
 * (see {@link canList}), never `view` — a frozen/archived deck stays reachable by
 * its stable alias.
 */

export type AccessAction = 'view' | 'list' | 'admin' | 'edit'

export interface AccessInput {
  /** The deck's access-folder visibility. */
  status: PublicationStatus
  /** Registry lifecycle; defaults to `live`. Does not affect `view`. */
  lifecycle?: Lifecycle
  /** The actor's resolved role (`anonymous` when there is no session). */
  role: Role
  /** What the actor is trying to do. Defaults to `view`. */
  action?: AccessAction
  /** Whether the deck declares an `accessPassword` (a gate exists at all). */
  hasPassword: boolean
  /** Whether the caller already validated the password (cookie or verified param). */
  passwordGranted: boolean
}

export type AccessDecision
  = | { outcome: 'allow' }
    | { outcome: 'deny', reason: 'not-found' | 'auth-required' | 'forbidden' }
    | { outcome: 'needs-password' }

/**
 * Decide whether `role` may perform `action` on a deck of `status`. Pure and
 * table-driven; the server maps the decision to HTTP (allow → serve,
 * auth-required → 401, forbidden → 403, needs-password → 401 + requiresPassword).
 */
export function decideAccess(input: AccessInput): AccessDecision {
  const { status, role, hasPassword, passwordGranted } = input
  const action = input.action ?? 'view'

  // admin / edit are privileged-only, regardless of deck status.
  if (action === 'admin' || action === 'edit') {
    return isPrivileged(role) ? { outcome: 'allow' } : denyFor(role)
  }

  // view (and list-as-view fallthrough): privileged sees everything.
  if (isPrivileged(role))
    return { outcome: 'allow' }

  switch (status) {
    case 'public':
      return { outcome: 'allow' }
    case 'semi-private':
      // Fail-closed: a deck deliberately placed in semi-private/ must never be
      // world-readable. With no hash declared there is no way to grant access,
      // so a non-privileged caller is denied (privileged already returned above).
      // (Previously this returned `allow`, silently exposing any semi-private
      // deck whose accessPassword was missing — the bug this branch closes.)
      if (!hasPassword)
        return denyFor(role)
      return passwordGranted ? { outcome: 'allow' } : { outcome: 'needs-password' }
    case 'draft':
    case 'private':
      return denyFor(role)
    default:
      return { outcome: 'deny', reason: 'forbidden' }
  }
}

/** Anonymous → 401 (log in); authenticated-but-unprivileged → 403 (you can't). */
function denyFor(role: Role): AccessDecision {
  return { outcome: 'deny', reason: role === 'anonymous' ? 'auth-required' : 'forbidden' }
}

export interface ListInput {
  status: PublicationStatus
  lifecycle?: Lifecycle
  role: Role
  /** Frontmatter `unlisted` flag — hidden from the catalog for non-privileged. */
  unlisted?: boolean
}

/**
 * Whether a deck appears in the catalog for `role`. Shares the same privilege
 * rule as {@link decideAccess} so "what you can list" and "what you can view"
 * never drift. Privileged sees all; everyone else sees only listable public
 * decks (semi-private is listed too — it's discoverable, then gated on open).
 */
export function canList(input: ListInput): boolean {
  const { status, lifecycle, role, unlisted } = input
  if (isPrivileged(role))
    return true
  // Non-privileged: hide unlisted and archived; hide draft/private outright.
  if (unlisted || lifecycle === 'archived')
    return false
  return status === 'public' || status === 'semi-private'
}
