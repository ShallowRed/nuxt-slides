import type { DeckMeta } from './schema'

/**
 * The Deck intermediate representation (IR) — the "core" of the hexagon
 * (audit §5.8 / Axe G). Pandoc's *readers → AST → writers*: parsers (readers)
 * produce a `DeckModel`, every renderer (writer) consumes it. Materializing one
 * normalized, serializable model is what kills the existing drift (live vs frozen
 * vs CodiMD preview) — each path stops re-deriving "what this deck is".
 *
 * `Slide` keeps MDC AST nodes as `unknown` so this module stays framework-free:
 * the shape is shared and serializable; only the renderers interpret the nodes.
 */

/** A single slide produced by a parser. AST fields are renderer-interpreted. */
export interface Slide {
  header?: unknown
  /** Text shown above the heading (e.g. chapter label, context tag). */
  pretitle?: unknown
  /** Text shown below the heading in an hgroup (section tagline). */
  subtitle?: unknown
  body: unknown
  verticalSlides?: Slide[]
  headingLevel?: string
  backgroundImage?: string
  layout?: string
  /** Extra props for the layout (e.g. media src/type for media-right/left). */
  layoutProps?: Record<string, string>
  /** Quick navigation link pinned to bottom of slide. */
  quicklink?: { text: string, href: string }
}

/** Kinds of external asset a deck references (for centralized rebasing). */
export type AssetKind = 'image' | 'iframe' | 'storybook' | 'video'

/** A reference to an external asset, collected for the renderers' rebasing pass. */
export interface AssetRef {
  kind: AssetKind
  /** The URL as authored (root-absolute or remote). */
  url: string
  /** Where it came from, for debugging (e.g. slide index / layout). */
  origin?: string
}

/**
 * The normalized deck model: validated meta + parsed slides + referenced assets
 * + provenance. This is what the frozen bundle should serialize wholesale,
 * instead of shipping a partial `data-reveal-config` attribute.
 */
export interface DeckModel {
  meta: DeckMeta
  slides: Slide[]
  assets: AssetRef[]
  provenance?: {
    parser: string
    source?: string
  }
}

/** Current on-the-wire schema version for a serialized `DeckModel`. */
export const DECK_MODEL_VERSION = 1

interface SerializedDeckModel {
  version: number
  model: DeckModel
}

/**
 * Serialize a `DeckModel` to a JSON string (audit §5.8: the frozen bundle should
 * ship the full IR, not a partial config attribute). Versioned for forward-compat.
 */
export function serializeDeckModel(model: DeckModel): string {
  const payload: SerializedDeckModel = { version: DECK_MODEL_VERSION, model }
  return JSON.stringify(payload)
}

/** Parse a serialized `DeckModel`, tolerating both the wrapped and bare shapes. */
export function parseDeckModel(json: string): DeckModel {
  const parsed = JSON.parse(json) as SerializedDeckModel | DeckModel
  if (parsed && typeof parsed === 'object' && 'version' in parsed && 'model' in parsed)
    return (parsed as SerializedDeckModel).model
  return parsed as DeckModel
}
