import type { DeckModel } from '../deck/model'
import type { RevealConfig } from '../deck/schema'
import { mergeRevealConfig } from './reveal'

/**
 * Print / PDF writer (audit §5.8 / §4.5 Pandoc writers, P1bis #14).
 *
 * The audit calls a clean print/PDF output "trivial once the IR + Renderer port
 * exist — without touching the parser". This module is exactly that: a writer
 * that consumes the `DeckModel` and emits everything a caller needs to render the
 * deck for print, reusing reveal.js's native `?print-pdf` mode rather than adding
 * a second rendering engine. No new parser, no Vue — pure and serializable, so it
 * is the same on client, server, and in a future CLI export.
 *
 * It also materializes the `DeckRenderer` port type that §5.8 names but that the
 * P1bis render helpers ({@link mergeRevealConfig}, sandbox, rebasing) had left
 * implicit — `revealLive` / `revealFrozen` / `print` are now writers of one shape.
 */

/** What a renderer produces from a deck model — kept generic over its output. */
export interface RenderOutput<T = unknown> {
  /** Stable id of the renderer that produced this (`reveal-live`, `print`, …). */
  renderer: string
  output: T
}

/**
 * The output port (§5.8): every writer consumes the IR and produces a
 * `RenderOutput`. `revealLive` (Vue), `revealFrozen` (static bundle), and `print`
 * (this module) are implementations; a `pdf`/`marp` writer would be one more,
 * never a new parser.
 */
export interface DeckRenderer<T = unknown> {
  readonly id: string
  render: (model: DeckModel) => RenderOutput<T>
}

/** Reveal.js print-pdf query flag — the native entry into its print stylesheet. */
export const PRINT_PDF_QUERY = 'print-pdf'

export interface PrintOptions {
  /**
   * Base deck URL the print view is derived from (the live or frozen deck URL).
   * The `?print-pdf` flag is appended, preserving any existing query/hash.
   */
  deckUrl: string
  /** Reveal `pdfMaxPagesPerSlide` — caps tall slides spilling across pages. */
  maxPagesPerSlide?: number
  /** Reveal `pdfSeparateFragments` — one page per fragment step when true. */
  separateFragments?: boolean
  /** Show speaker notes on the printed page (maps to Reveal `showNotes`). */
  showNotes?: boolean
}

/**
 * Append reveal.js's `?print-pdf` flag to a deck URL, preserving existing query
 * params and hash. The single definition of "the print entry for this deck".
 *
 * `/slides/x/?foo=1#2` → `/slides/x/?foo=1&print-pdf#2`.
 */
export function buildPrintPdfUrl(deckUrl: string): string {
  const hashIndex = deckUrl.indexOf('#')
  const hash = hashIndex === -1 ? '' : deckUrl.slice(hashIndex)
  const base = hashIndex === -1 ? deckUrl : deckUrl.slice(0, hashIndex)
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}${PRINT_PDF_QUERY}${hash}`
}

/** The print view that a renderer/caller drives reveal.js with. */
export interface PrintView {
  /** The `?print-pdf` URL to open (reveal.js switches to its print layout). */
  url: string
  /** Reveal config for the print pass: the deck's `reveal:` + print-only options. */
  reveal: RevealConfig
}

/**
 * Build the print view for a deck model: the `?print-pdf` URL plus the reveal
 * config the print pass needs, merged over the deck's own `reveal:` frontmatter
 * (one merge rule — {@link mergeRevealConfig}). Print mode forces `embedded:false`
 * and `controls:false` so the layout fills the page with no live-only chrome.
 */
export function buildPrintView(model: DeckModel, options: PrintOptions): PrintView {
  const printOverrides: Partial<RevealConfig> = {
    embedded: false,
    controls: false,
    progress: false,
    showNotes: options.showNotes ?? false,
  }
  if (options.maxPagesPerSlide != null)
    printOverrides.pdfMaxPagesPerSlide = options.maxPagesPerSlide
  if (options.separateFragments != null)
    printOverrides.pdfSeparateFragments = options.separateFragments

  return {
    url: buildPrintPdfUrl(options.deckUrl),
    reveal: mergeRevealConfig({ ...model.meta.reveal, ...printOverrides }),
  }
}

/**
 * The print/PDF renderer (a `DeckRenderer`): given the IR, produces the print
 * view. The `deckUrl` is supplied per call since it depends on where the deck is
 * served (live vs frozen), which the IR deliberately does not encode.
 */
export function createPrintRenderer(
  options: Omit<PrintOptions, 'deckUrl'> & { deckUrl: string },
): DeckRenderer<PrintView> {
  return {
    id: 'print',
    render(model: DeckModel): RenderOutput<PrintView> {
      return { renderer: 'print', output: buildPrintView(model, options) }
    },
  }
}
