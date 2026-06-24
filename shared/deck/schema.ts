import { z } from 'zod'
import { PublicationStatusSchema } from '../access/status'

/**
 * Single source of truth for a deck's validated configuration (audit §5.3).
 *
 * Before this schema the "effective config" of a deck was parsed by ad-hoc regex
 * in ≥5 places, with no description of what a valid frontmatter is. `DeckMetaSchema`
 * centralizes validation and derives the TS types automatically (à la Astro / Nuxt
 * Content), coerces numeric Reveal options, and rejects typos in closed enums
 * (`parser`, `source`). Unknown keys are intentionally passed through (`.catchall`)
 * so authors keep the freedom the previous `[key: string]: any` allowed.
 */

/** Reveal.js options forwarded to `Reveal.initialize()`. Loose by design. */
export const RevealConfigSchema = z
  .object({
    hash: z.boolean().optional(),
    center: z.boolean().optional(),
    transition: z.string().optional(),
    slideNumber: z.union([z.string(), z.boolean()]).optional(),
    embedded: z.boolean().optional(),
    margin: z.coerce.number().optional(),
    minScale: z.coerce.number().optional(),
    maxScale: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    controls: z.boolean().optional(),
    progress: z.boolean().optional(),
    keyboard: z.boolean().optional(),
    touch: z.boolean().optional(),
    loop: z.boolean().optional(),
    fragments: z.boolean().optional(),
    help: z.boolean().optional(),
    showNotes: z.boolean().optional(),
    autoPlayMedia: z.boolean().nullable().optional(),
    preloadIframes: z.boolean().nullable().optional(),
    autoSlide: z.coerce.number().optional(),
    view: z.string().optional(),
    navigationMode: z.enum(['default', 'linear', 'grid']).optional(),
  })
  .catchall(z.unknown())

/** Per-heading-level background images. */
export const ThemeBackgroundsSchema = z
  .object({
    h1: z.string().optional(),
    h2: z.string().optional(),
    h3: z.string().optional(),
    default: z.string().optional(),
  })
  .catchall(z.unknown())

/** Provider of a collaborative note used as the body source. */
export const NoteSourceSchema = z.enum(['codimd', 'hackmd'])

export const DeckMetaSchema = z
  .object({
    title: z.string().optional(),
    lang: z.string().optional(),
    /**
     * Theme name. Kept as a free string here; existence vs `public/themes/` is
     * checked separately (see `KNOWN_THEMES` / theme warning) to avoid rejecting
     * a CSS-backed theme that has no preset. Enum-in-schema is a P1 follow-up.
     */
    theme: z.string().optional(),
    /** Slide parser mode. A typo here is rejected early (was silent before). */
    parser: z.enum(['heading', 'separator']).optional(),
    storybook: z.string().optional(),
    backgrounds: ThemeBackgroundsSchema.optional(),
    reveal: RevealConfigSchema.optional(),
    /**
     * Publication status — the access axis, now sourced from the frontmatter
     * rather than the `presentations/<status>/` folder (see
     * docs/presentation-metadata.md). A missing/invalid value must be treated as
     * the most closed status (`private`) by readers — the schema keeps it
     * optional so an un-migrated stub still parses, and the closed-default is
     * enforced at resolution (server/utils/presentations.ts), never here.
     */
    status: PublicationStatusSchema.optional(),
    /** Grouping axis for the catalog (slug into `presentations/projects.yml`). */
    project: z.string().optional(),
    /** @deprecated legacy alias of `status` (pre-frontmatter-status stubs). */
    access: z.string().optional(),
    accessPassword: z.string().optional(),
    source: NoteSourceSchema.optional(),
    noteId: z.string().optional(),
    // Legacy flat Reveal options kept for backward compatibility.
    transition: z.string().optional(),
    center: z.boolean().optional(),
  })
  .catchall(z.unknown())

export type RevealConfig = z.infer<typeof RevealConfigSchema>
export type ThemeBackgrounds = z.infer<typeof ThemeBackgroundsSchema>
export type NoteSource = z.infer<typeof NoteSourceSchema>
export type DeckMeta = z.infer<typeof DeckMetaSchema>

export interface ParseResult {
  /** Validated metadata. On failure, falls back to the raw input (non-destructive). */
  meta: DeckMeta
  /** Whether zod validation succeeded. */
  valid: boolean
  /** Human-readable validation issues (empty when valid). */
  issues: string[]
}

/**
 * Validate raw frontmatter into a `DeckMeta`.
 *
 * Non-destructive by default: when validation fails (e.g. a `parser` typo) it
 * logs the issues and returns the original object so an in-production deck never
 * goes dark over a bad field. Pass `{ strict: true }` to throw instead — useful
 * in tests and tooling where early rejection is desired (audit §5.3).
 */
export function parseDeckMeta(
  input: unknown,
  options: { strict?: boolean, label?: string } = {},
): ParseResult {
  const result = DeckMetaSchema.safeParse(input ?? {})
  if (result.success)
    return { meta: result.data, valid: true, issues: [] }

  const issues = result.error.issues.map(
    i => `${i.path.join('.') || '(root)'}: ${i.message}`,
  )
  if (options.strict) {
    const where = options.label ? ` for ${options.label}` : ''
    throw new Error(`Invalid deck frontmatter${where}:\n- ${issues.join('\n- ')}`)
  }
  console.warn(
    `[deck-schema] frontmatter validation issues${options.label ? ` (${options.label})` : ''}: ${issues.join('; ')}`,
  )
  return { meta: (input ?? {}) as DeckMeta, valid: false, issues }
}
