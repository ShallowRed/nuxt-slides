import type { Role } from '../../shared/access'
import type { AccessAction } from '../../shared/access/decide'
import { describe, expect, it } from 'vitest'
import { canList, decideAccess } from '../../shared/access'
import { PUBLICATION_STATUSES } from '../../shared/access/status'

/**
 * Golden snapshot of the WHOLE access policy (audit §6 "golden" style). A single
 * fixture documents every role × status × action decision and the catalog
 * predicate, so any unintended change to who-can-see-what is caught in review —
 * the access analogue of the deck-core golden tests.
 */

const ROLES: Role[] = ['anonymous', 'viewer', 'editor', 'owner']
const ACTIONS: AccessAction[] = ['view', 'admin', 'edit']

describe('access policy — golden', () => {
  it('view/admin/edit decision for every role × status (no password set)', () => {
    const table: Record<string, string> = {}
    for (const role of ROLES) {
      for (const status of PUBLICATION_STATUSES) {
        for (const action of ACTIONS) {
          const d = decideAccess({ role, status, action, hasPassword: false, passwordGranted: false })
          table[`${role} | ${status} | ${action}`]
            = d.outcome === 'deny' ? `deny:${d.reason}` : d.outcome
        }
      }
    }
    expect(table).toMatchInlineSnapshot(`
      {
        "anonymous | draft | admin": "deny:auth-required",
        "anonymous | draft | edit": "deny:auth-required",
        "anonymous | draft | view": "deny:auth-required",
        "anonymous | private | admin": "deny:auth-required",
        "anonymous | private | edit": "deny:auth-required",
        "anonymous | private | view": "deny:auth-required",
        "anonymous | public | admin": "deny:auth-required",
        "anonymous | public | edit": "deny:auth-required",
        "anonymous | public | view": "allow",
        "anonymous | semi-private | admin": "deny:auth-required",
        "anonymous | semi-private | edit": "deny:auth-required",
        "anonymous | semi-private | view": "deny:auth-required",
        "editor | draft | admin": "allow",
        "editor | draft | edit": "allow",
        "editor | draft | view": "allow",
        "editor | private | admin": "allow",
        "editor | private | edit": "allow",
        "editor | private | view": "allow",
        "editor | public | admin": "allow",
        "editor | public | edit": "allow",
        "editor | public | view": "allow",
        "editor | semi-private | admin": "allow",
        "editor | semi-private | edit": "allow",
        "editor | semi-private | view": "allow",
        "owner | draft | admin": "allow",
        "owner | draft | edit": "allow",
        "owner | draft | view": "allow",
        "owner | private | admin": "allow",
        "owner | private | edit": "allow",
        "owner | private | view": "allow",
        "owner | public | admin": "allow",
        "owner | public | edit": "allow",
        "owner | public | view": "allow",
        "owner | semi-private | admin": "allow",
        "owner | semi-private | edit": "allow",
        "owner | semi-private | view": "allow",
        "viewer | draft | admin": "deny:forbidden",
        "viewer | draft | edit": "deny:forbidden",
        "viewer | draft | view": "deny:forbidden",
        "viewer | private | admin": "deny:forbidden",
        "viewer | private | edit": "deny:forbidden",
        "viewer | private | view": "deny:forbidden",
        "viewer | public | admin": "deny:forbidden",
        "viewer | public | edit": "deny:forbidden",
        "viewer | public | view": "allow",
        "viewer | semi-private | admin": "deny:forbidden",
        "viewer | semi-private | edit": "deny:forbidden",
        "viewer | semi-private | view": "deny:forbidden",
      }
    `)
  })

  it('catalog visibility (canList) for every role × status', () => {
    const table: Record<string, boolean> = {}
    for (const role of ROLES) {
      for (const status of PUBLICATION_STATUSES)
        table[`${role} | ${status}`] = canList({ role, status })
    }
    expect(table).toMatchInlineSnapshot(`
      {
        "anonymous | draft": false,
        "anonymous | private": false,
        "anonymous | public": true,
        "anonymous | semi-private": true,
        "editor | draft": true,
        "editor | private": true,
        "editor | public": true,
        "editor | semi-private": true,
        "owner | draft": true,
        "owner | private": true,
        "owner | public": true,
        "owner | semi-private": true,
        "viewer | draft": false,
        "viewer | private": false,
        "viewer | public": true,
        "viewer | semi-private": true,
      }
    `)
  })
})
