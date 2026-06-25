import type { DeckModel } from '../../shared/deck/model'
import { describe, expect, it } from 'vitest'
import {
  buildPrintPdfUrl,
  buildPrintView,
  createPrintRenderer,
  DEFAULT_PRINT_HEIGHT,
  DEFAULT_PRINT_WIDTH,
  PRINT_PDF_QUERY,
} from '../../shared/render/print'
import { DEFAULT_REVEAL_CONFIG } from '../../shared/render/reveal'

function model(reveal?: DeckModel['meta']['reveal']): DeckModel {
  return { meta: { reveal }, slides: [], assets: [] }
}

describe('buildPrintPdfUrl', () => {
  it('appends ?print-pdf to a bare URL', () => {
    expect(buildPrintPdfUrl('/slides/x/')).toBe('/slides/x/?print-pdf')
  })

  it('appends with & when the URL already has a query', () => {
    expect(buildPrintPdfUrl('/slides/x/?foo=1')).toBe('/slides/x/?foo=1&print-pdf')
  })

  it('preserves a trailing hash, inserting the flag before it', () => {
    expect(buildPrintPdfUrl('/slides/x/#2')).toBe('/slides/x/?print-pdf#2')
    expect(buildPrintPdfUrl('/slides/x/?foo=1#2')).toBe('/slides/x/?foo=1&print-pdf#2')
  })

  it('uses the exported query constant', () => {
    expect(buildPrintPdfUrl('/d/')).toContain(PRINT_PDF_QUERY)
  })
})

describe('buildPrintView', () => {
  it('builds the print URL and forces print-only reveal overrides over the defaults', () => {
    const view = buildPrintView(model(), { deckUrl: '/slides/x/' })
    expect(view.url).toBe('/slides/x/?print-pdf')
    expect(view.reveal.embedded).toBe(false)
    expect(view.reveal.controls).toBe(false)
    expect(view.reveal.progress).toBe(false)
    expect(view.reveal.showNotes).toBe(false)
    // Pins a uniform page size + one page per slide so PDF pages are even.
    expect(view.reveal.width).toBe(DEFAULT_PRINT_WIDTH)
    expect(view.reveal.height).toBe(DEFAULT_PRINT_HEIGHT)
    expect(view.reveal.pdfMaxPagesPerSlide).toBe(1)
    // Untouched defaults still flow through the shared merge.
    expect(view.reveal.hash).toBe(DEFAULT_REVEAL_CONFIG.hash)
  })

  it('keeps the deck\'s own page size when it declares one', () => {
    const view = buildPrintView(model({ width: 1280, height: 720 }), { deckUrl: '/d/' })
    expect(view.reveal.width).toBe(1280)
    expect(view.reveal.height).toBe(720)
  })

  it('merges the deck reveal: frontmatter under the print overrides', () => {
    const view = buildPrintView(model({ transition: 'fade', controls: true }), {
      deckUrl: '/d/',
    })
    // Deck's own option survives…
    expect(view.reveal.transition).toBe('fade')
    // …but print mode wins on the conflicting one.
    expect(view.reveal.controls).toBe(false)
  })

  it('passes through pdf paging options when provided', () => {
    const view = buildPrintView(model(), {
      deckUrl: '/d/',
      maxPagesPerSlide: 3,
      separateFragments: true,
      showNotes: true,
    })
    expect(view.reveal.pdfMaxPagesPerSlide).toBe(3)
    expect(view.reveal.pdfSeparateFragments).toBe(true)
    expect(view.reveal.showNotes).toBe(true)
  })

  it('defaults to one page per slide and omits separateFragments when not given', () => {
    const view = buildPrintView(model(), { deckUrl: '/d/' })
    expect(view.reveal.pdfMaxPagesPerSlide).toBe(1)
    expect(view.reveal.pdfSeparateFragments).toBeUndefined()
  })
})

describe('createPrintRenderer', () => {
  it('is a DeckRenderer that renders the model to a print view', () => {
    const renderer = createPrintRenderer({ deckUrl: '/slides/x/' })
    expect(renderer.id).toBe('print')
    const out = renderer.render(model())
    expect(out.renderer).toBe('print')
    expect(out.output.url).toBe('/slides/x/?print-pdf')
  })
})
