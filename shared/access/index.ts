/**
 * App-layer access domain — the pure, framework-free core for "who can see what".
 *
 * The deck core (`shared/deck`) answers "what is this deck?"; this answers "may
 * this actor view/list/admin it?". Same philosophy: zod-validated enums, pure
 * decision functions (no I/O/crypto/session — those stay in `server/utils`
 * adapters), unit-tested like `resolveDeck`.
 *
 *   - `roles`        : `Role` + `isPrivileged`
 *   - `status`       : canonical `PublicationStatus` + `Lifecycle`
 *   - `decide`       : pure `decideAccess` + `canList` (the capability matrix)
 *   - `resolve-role` : env login→role resolution
 */
export * from './decide'
export * from './resolve-role'
export * from './roles'
export * from './status'
