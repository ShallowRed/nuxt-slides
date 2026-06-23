import { dump, load } from 'js-yaml'

/**
 * One place to read and write YAML frontmatter (audit §5.3 / Axe C).
 *
 * Replaces the scattered regex helpers (`parseFlatFrontmatter`, `stripFrontmatter`,
 * `setFrontmatterScalar`, the hand-rolled `toYaml`, and merge-by-string-concat).
 * The rule is: **parse → operate on objects → serialize once** via a real YAML
 * library, never by hand. Crucially, the parser reads NESTED blocks (e.g.
 * `reveal.margin`) that the old flat parser silently dropped — the margins bug.
 */

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export interface SplitDocument {
  /** Parsed frontmatter object (full depth). Empty object when none/empty. */
  data: Record<string, unknown>
  /** Markdown body with the leading frontmatter block removed. */
  body: string
  /** Whether a frontmatter block was present. */
  hasFrontmatter: boolean
}

/**
 * Split a markdown document into its parsed frontmatter and its body.
 * Nested keys are preserved (unlike the legacy flat parser).
 */
export function splitFrontmatter(markdown: string): SplitDocument {
  const match = markdown.match(FRONTMATTER_RE)
  if (!match)
    return { data: {}, body: markdown, hasFrontmatter: false }

  const yaml = match[1] ?? ''
  let data: Record<string, unknown> = {}
  try {
    const parsed = load(yaml)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
      data = parsed as Record<string, unknown>
  }
  catch (error: any) {
    console.warn('[frontmatter] failed to parse YAML block:', error?.message || error)
  }
  return { data, body: markdown.slice(match[0].length), hasFrontmatter: true }
}

/**
 * Strip a leading frontmatter block, returning only the body.
 * Mirrors the legacy `stripFrontmatter` (a single trailing newline is consumed).
 */
export function stripFrontmatter(markdown: string): string {
  return splitFrontmatter(markdown).body
}

/** Serialize a frontmatter object to a YAML string (no fences). */
export function serializeFrontmatter(data: Record<string, unknown>): string {
  return dump(data, { lineWidth: -1, noRefs: true, skipInvalid: true })
}

/**
 * Re-assemble a markdown document from a frontmatter object and a body, matching
 * the existing on-the-wire shape: `---\n<yaml>---\n\n<body>`.
 */
export function stringifyDocument(data: Record<string, unknown>, body: string): string {
  const hasKeys = Object.keys(data).length > 0
  if (!hasKeys)
    return body
  return `---\n${serializeFrontmatter(data)}---\n\n${body}`
}
