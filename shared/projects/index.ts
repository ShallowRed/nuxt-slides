/**
 * Project registry domain — the catalog's grouping axis (slug → display meta),
 * declared in `presentations/projects.yml`. Pure schema + parse here; YAML I/O in
 * `server/utils/projects.ts` (à la `shared/access` vs `server/utils/access`).
 */
export * from './schema'
