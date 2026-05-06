/**
 * Pure functions for parsing MDC AST content into slide structures.
 * No Vue reactivity — all functions are stateless and independently testable.
 *
 * Two entry points:
 * - parseSlides(ast)              heading-based parser (H1/H2/H3)
 * - parseSlidesFromSeparators(md) separator-based parser (--- / ----)
 */

import type { MDCParserResult } from '@nuxtjs/mdc'
import type { Slide } from '~/types/presentation'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { FULL_SLIDE_COMPONENTS } from '~/config/presentation'

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

/**
 * Detects the first heading level in a list of AST children.
 */
export function getHeadingLevel(children: any[]): string | undefined {
  if (!children || children.length === 0)
    return undefined
  const firstHeading = children.find((node: any) =>
    node.type === 'element' && /^h[1-6]$/.test(node.tag),
  )
  return firstHeading?.tag
}

/**
 * Checks if a paragraph contains only italic text (for subtitle detection).
 */
function isItalicParagraph(node: any): boolean {
  if (node.type !== 'element' || node.tag !== 'p')
    return false
  const children = node.children || []
  return children.length === 1 && children[0].type === 'element' && children[0].tag === 'em'
}

/**
 * Recursively checks whether any child is a full-slide layout component.
 * Returns the canonical layout name 'full' when found, otherwise undefined.
 */
function getSlideLayout(children: any[]): string | undefined {
  for (const node of children) {
    if (node.type === 'element' && FULL_SLIDE_COMPONENTS.includes(node.tag))
      return 'full'
    if (node.children) {
      const childLayout = getSlideLayout(node.children)
      if (childLayout)
        return childLayout
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Annotation extractors
// ---------------------------------------------------------------------------

/**
 * Extracts :slide-background{image="..."} override.
 */
function extractBackgroundOverride(children: any[]): string | undefined {
  const node = children.find(n => n.type === 'element' && n.tag === 'slide-background' && n.props?.image)
  return node?.props.image
}

/**
 * Removes :slide-background nodes so they don't reach MDCRenderer.
 */
function filterBackgroundNodes(children: any[]): any[] {
  return children.filter(n => !(n.type === 'element' && n.tag === 'slide-background'))
}

/**
 * Extracts :pretitle{text="..."} and wraps it in a root AST node.
 */
function extractPretitle(children: any[]): any | undefined {
  const node = children.find(n => n.type === 'element' && n.tag === 'pretitle' && n.props?.text)
  if (!node)
    return undefined
  return {
    type: 'root',
    children: [{ type: 'element', tag: 'p', props: {}, children: [{ type: 'text', value: node.props.text }] }],
  }
}

/**
 * Extracts :subtitle{text="..."} and wraps it in a root AST node.
 * The italic-paragraph fallback is handled separately in createSlide().
 */
function extractExplicitSubtitle(children: any[]): any | undefined {
  const node = children.find(n => n.type === 'element' && n.tag === 'subtitle' && n.props?.text)
  if (!node)
    return undefined
  return {
    type: 'root',
    children: [{ type: 'element', tag: 'p', props: {}, children: [{ type: 'text', value: node.props.text }] }],
  }
}

/**
 * Extracts :quicklink{text="..." href="..."}.
 */
function extractQuicklink(children: any[]): { text: string, href: string } | undefined {
  const node = children.find(n => n.type === 'element' && n.tag === 'quicklink' && n.props?.text && n.props?.href)
  if (!node)
    return undefined
  return { text: node.props.text, href: node.props.href }
}

/**
 * Extracts :layout{name="..." ...props}.
 */
function extractLayout(children: any[]): { name: string, props: Record<string, string> } | undefined {
  const node = children.find(n => n.type === 'element' && n.tag === 'layout' && n.props?.name)
  if (!node)
    return undefined
  const { name, ...rest } = node.props
  return { name, props: rest }
}

/**
 * Removes :pretitle, :subtitle, :layout, and :quicklink annotation nodes
 * so they don't reach MDCRenderer.
 * :slide-background is handled separately by filterBackgroundNodes().
 */
function filterAnnotationNodes(children: any[]): any[] {
  return children.filter(n =>
    !(n.type === 'element' && ['pretitle', 'subtitle', 'layout', 'quicklink'].includes(n.tag)),
  )
}

// ---------------------------------------------------------------------------
// Slide builders
// ---------------------------------------------------------------------------

/**
 * Builds a Slide from a list of AST nodes.
 *
 * - Separates the first heading into `header`, the rest into `body`.
 * - Supports :pretitle, :subtitle, :layout, :quicklink annotations.
 * - Falls back to italic paragraph immediately after heading for subtitle.
 * - When a FULL_SLIDE_COMPONENT is detected (and no explicit :layout{}),
 *   all children stay in `body` (no header/body split).
 */
export function createSlide(children: any[], headingLevel?: string): Slide {
  const level = headingLevel || getHeadingLevel(children)

  const backgroundImage = extractBackgroundOverride(children)
  const filtered = filterBackgroundNodes(children)

  const layoutInfo = extractLayout(filtered)
  const pretitle = extractPretitle(filtered)
  const explicitSubtitle = extractExplicitSubtitle(filtered)
  const quicklink = extractQuicklink(filtered)
  const cleaned = filterAnnotationNodes(filtered)

  // Full-slide component layout — only when no explicit :layout{} annotation
  if (!layoutInfo) {
    const fullLayout = getSlideLayout(cleaned)
    if (fullLayout) {
      return {
        body: { type: 'root', children: cleaned },
        headingLevel: level,
        layout: fullLayout,
        backgroundImage,
        quicklink,
      }
    }
  }

  const firstHeadingIndex = cleaned.findIndex((node: any) =>
    node.type === 'element' && /^h[1-6]$/.test(node.tag),
  )

  if (firstHeadingIndex !== -1) {
    let subtitle: any = explicitSubtitle
    let bodyStartIndex = firstHeadingIndex + 1

    // Fallback: italic paragraph immediately after heading (backward compat)
    if (!subtitle) {
      const next = cleaned[firstHeadingIndex + 1]
      if (next && isItalicParagraph(next)) {
        subtitle = { type: 'root', children: [next] }
        bodyStartIndex = firstHeadingIndex + 2
      }
    }

    return {
      header: { type: 'root', children: [cleaned[firstHeadingIndex]] },
      pretitle,
      subtitle,
      body: {
        type: 'root',
        children: [
          ...cleaned.slice(0, firstHeadingIndex),
          ...cleaned.slice(bodyStartIndex),
        ],
      },
      headingLevel: level,
      layout: layoutInfo?.name,
      layoutProps: layoutInfo?.props,
      backgroundImage,
      quicklink,
    }
  }

  // No heading found
  return {
    body: { type: 'root', children: cleaned },
    headingLevel: level,
    layout: layoutInfo?.name,
    layoutProps: layoutInfo?.props,
    backgroundImage,
    quicklink,
  }
}

/**
 * Groups a flat list of AST children into vertical slides at each H3 boundary.
 * Returns a Slide with `verticalSlides` when multiple H3 sections are found,
 * or a plain Slide when there is only one.
 */
export function processVerticalSlides(children: any[], sectionHeadingLevel?: string): Slide {
  if (!children || children.length === 0)
    return createSlide([], sectionHeadingLevel)

  const verticalSlides: Slide[] = []
  let current: any[] = []

  for (const node of children) {
    if (node.type === 'element' && node.tag === 'h3' && current.length > 0) {
      verticalSlides.push(createSlide(current))
      current = []
    }
    current.push(node)
  }
  if (current.length > 0)
    verticalSlides.push(createSlide(current))

  if (verticalSlides.length > 1) {
    return {
      body: { type: 'root', children },
      verticalSlides,
      headingLevel: sectionHeadingLevel || getHeadingLevel(children),
    }
  }

  return createSlide(children, sectionHeadingLevel)
}

// ---------------------------------------------------------------------------
// Public parsers
// ---------------------------------------------------------------------------

/**
 * Heading-based parser: splits an MDC AST by H1 (title), H2 (horizontal),
 * and HR (alternative horizontal) boundaries, then handles H3 vertical splits.
 */
export function parseSlides(ast: MDCParserResult): Slide[] {
  if (!ast.body?.children)
    return []

  const sections: any[][] = []
  let current: any[] = []
  let foundFirstH1 = false
  let inH1Section = false

  for (const node of ast.body.children) {
    const isH1 = node.type === 'element' && node.tag === 'h1'
    const isH2 = node.type === 'element' && node.tag === 'h2'
    const isHR = node.type === 'element' && node.tag === 'hr'

    if (isH1 && !foundFirstH1) {
      foundFirstH1 = true
      inH1Section = true
      if (current.length > 0) {
        sections.push(current)
        current = []
      }
      current.push(node)
      continue
    }

    if (isH2 && inH1Section) {
      inH1Section = false
      if (current.length > 0) {
        sections.push(current)
        current = []
      }
    }

    if (!inH1Section && (isH2 || isHR)) {
      if (current.length > 0) {
        sections.push(current)
        current = []
      }
    }

    current.push(node)
  }

  if (current.length > 0)
    sections.push(current)

  return sections.map(children => processVerticalSlides(children))
}

/**
 * Strips YAML frontmatter from raw markdown content.
 */
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  return match ? content.slice(match[0].length) : content
}

/**
 * Separator-based parser: splits raw markdown by --- (horizontal) and
 * ---- (vertical) separators. Parses each chunk independently with MDC.
 */
export async function parseSlidesFromSeparators(rawContent: string): Promise<Slide[]> {
  const body = stripFrontmatter(rawContent)
  const horizontalSections = body.split(/^---$/m).filter(s => s.trim().length > 0)
  const slides: Slide[] = []

  for (const section of horizontalSections) {
    const verticalParts = section.split(/^----$/m).filter(s => s.trim().length > 0)

    if (verticalParts.length > 1) {
      const verticalSlides: Slide[] = []
      for (const part of verticalParts) {
        const ast = await parseMarkdown(part.trim())
        if (ast.body?.children)
          verticalSlides.push(createSlide(ast.body.children))
      }
      if (verticalSlides.length > 0) {
        slides.push({
          body: { type: 'root', children: [] },
          verticalSlides,
          headingLevel: verticalSlides[0]?.headingLevel,
        })
      }
    }
    else {
      const ast = await parseMarkdown(section.trim())
      if (ast.body?.children)
        slides.push(createSlide(ast.body.children))
    }
  }

  return slides
}
