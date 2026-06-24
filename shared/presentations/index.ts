/**
 * Presentation catalog domain — the shared wire contract + display config for the
 * listing, consumed by `GET /api/presentations` and the home/admin pages so the
 * shape and the status vocabulary live in one place (they used to be duplicated
 * and out of sync).
 */
export * from './list-item'
export * from './status-config'
