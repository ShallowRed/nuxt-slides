import { z } from 'zod'

/**
 * Project registry (docs/presentation-metadata.md).
 *
 * `presentations/projects.yml` declares the catalog's grouping axis: each key is
 * a project slug (matched against a deck's frontmatter `project:`), mapping to
 * display metadata. Pure data + zod validation here, à la `shared/deck/schema`;
 * the YAML I/O lives in the server util (`server/utils/projects.ts`).
 */

/** Display metadata for one project (the value side of `projects.yml`). */
export const ProjectMetaSchema = z
  .object({
    /** Human-readable label shown in the catalog (defaults to the slug). */
    title: z.string().optional(),
    /** Sort order among project groups (ascending; unset sorts last). */
    order: z.coerce.number().optional(),
    /** Accent color for the project's badge/group header (CSS color). */
    color: z.string().optional(),
  })
  .catchall(z.unknown())

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>

/** The whole file: slug → metadata. */
export const ProjectsFileSchema = z.record(z.string(), ProjectMetaSchema)
export type ProjectsFile = z.infer<typeof ProjectsFileSchema>

/** A resolved project, slug included (what callers consume). */
export interface Project extends ProjectMeta {
  slug: string
}

/**
 * Parse + validate the raw YAML document into ordered `Project` entries.
 * Non-destructive: an invalid file yields an empty list (logged by the caller),
 * never throws into a request path. Entries are sorted by `order` then `title`.
 */
export function parseProjects(input: unknown): Project[] {
  const result = ProjectsFileSchema.safeParse(input ?? {})
  if (!result.success)
    return []

  return Object.entries(result.data)
    .map(([slug, meta]): Project => ({ slug, ...meta }))
    .sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY
      const bo = b.order ?? Number.POSITIVE_INFINITY
      if (ao !== bo)
        return ao - bo
      return (a.title ?? a.slug).localeCompare(b.title ?? b.slug)
    })
}
