/**
 * Composable for parsing MDC content into slide structures
 * Handles the logic of splitting content by H1/H2/H3 headings
 * or by --- / ---- separators (opt-in via frontmatter)
 */

import type { MDCParserResult } from '@nuxtjs/mdc'
import type { Slide } from '~/types/presentation'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { FULL_SLIDE_COMPONENTS } from '~/config/presentation'

export function useSlideParser() {
  /**
   * Detects the first heading level in a slide's children
   */
  function getHeadingLevel(children: any[]): string | undefined {
    if (!children || children.length === 0)
      return undefined

    const firstHeading = children.find((node: any) =>
      node.type === 'element' && /^h[1-6]$/.test(node.tag),
    )

    return firstHeading?.tag
  }

  /**
   * Checks if a node or its children contain a full-slide layout component.
   * Full-slide components (listed in FULL_SLIDE_COMPONENTS) bypass the
   * header/body split and keep all children in `body`.
   * Returns the canonical layout name `'full'` when found.
   */
  function getSlideLayout(children: any[]): string | undefined {
    for (const node of children) {
      if (node.type === 'element' && FULL_SLIDE_COMPONENTS.includes(node.tag)) {
        return 'full'
      }
      if (node.children) {
        const childLayout = getSlideLayout(node.children)
        if (childLayout)
          return childLayout
      }
    }
    return undefined
  }

  /**
   * Checks if a paragraph contains only italic text (for subtitle detection)
   */
  function isItalicParagraph(node: any): boolean {
    if (node.type !== 'element' || node.tag !== 'p')
      return false

    const children = node.children || []
    // Check if the paragraph has a single <em> child containing text
    if (children.length === 1 && children[0].type === 'element' && children[0].tag === 'em')
      return true

    return false
  }

  /**
   * Extracts background image override from a <!-- background: url --> comment node.
   * Returns the URL string if found, otherwise undefined.
   */
  function extractBackgroundOverride(children: any[]): string | undefined {
    for (const node of children) {
      if (node.type === 'element' && node.tag === 'slide-background' && node.props?.image) {
        return node.props.image
      }
    }
    return undefined
  }

  /**
   * Removes :slide-background nodes from children so they don't render
   */
  function filterBackgroundNodes(children: any[]): any[] {
    return children.filter(node =>
      !(node.type === 'element' && node.tag === 'slide-background'),
    )
  }

  /**
   * Extracts :pretitle{text="..."} inline component from children.
   * Returns a body AST wrapping the text, or undefined if not found.
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
   * Extracts an explicit :subtitle{text="..."} inline component from children.
   * Returns a body AST wrapping the text, or undefined if not found.
   * Italic-paragraph fallback is handled separately in createSlide().
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
   * Removes :pretitle, :subtitle and :layout annotation nodes from children so they don't render.
   * :slide-background is handled separately by filterBackgroundNodes().
   */
  function filterAnnotationNodes(children: any[]): any[] {
    return children.filter(n =>
      !(n.type === 'element' && (n.tag === 'pretitle' || n.tag === 'subtitle' || n.tag === 'layout')),
    )
  }

  /**
   * Extracts :layout{name="..." ...props} inline annotation from children.
   * Returns the layout name and extra props, or undefined if not found.
   */
  function extractLayout(children: any[]): { name: string, props: Record<string, string> } | undefined {
    const node = children.find(n => n.type === 'element' && n.tag === 'layout' && n.props?.name)
    if (!node)
      return undefined
    const { name, ...rest } = node.props
    return { name, props: rest }
  }

  /**
   * Creates a slide object from AST nodes.
   * Separates the first heading into header, rest into body.
   * Supports explicit :pretitle{text="..."} and :subtitle{text="..."} inline markers.
   * Supports :layout{name="..." ...} for slide-level layouts (e.g. media-right).
   * Falls back to italic paragraph immediately after heading for subtitle (backward compat).
   * Unless the slide has a FULL_SLIDE_COMPONENT layout (then keep all in body).
   */
  function createSlide(children: any[], headingLevel?: string): Slide {
    const level = headingLevel || getHeadingLevel(children)

    const backgroundImage = extractBackgroundOverride(children)
    // Remove :slide-background nodes from rendered output
    const filtered = filterBackgroundNodes(children)

    // Extract explicit layout annotation before filtering
    const layoutInfo = extractLayout(filtered)

    // Extract explicit pretitle / subtitle before filtering their marker nodes
    const pretitle = extractPretitle(filtered)
    const explicitSubtitle = extractExplicitSubtitle(filtered)

    // Remove annotation marker nodes (:pretitle, :subtitle, :layout) from rendered output
    const cleaned = filterAnnotationNodes(filtered)

    // FULL_SLIDE_COMPONENT layout — only when no explicit :layout{} annotation
    if (!layoutInfo) {
      const fullLayout = getSlideLayout(cleaned)
      if (fullLayout) {
        return {
          body: {
            type: 'root',
            children: cleaned,
          },
          headingLevel: level,
          layout: fullLayout,
          backgroundImage,
        }
      }
    }

    // Find the first heading element
    const firstHeadingIndex = cleaned.findIndex((node: any) =>
      node.type === 'element' && /^h[1-6]$/.test(node.tag),
    )

    // If we have a heading, separate it from the body
    if (firstHeadingIndex !== -1) {
      const headerChildren = [cleaned[firstHeadingIndex]]
      let subtitle: any = explicitSubtitle
      let bodyStartIndex = firstHeadingIndex + 1

      // Fallback: italic paragraph immediately after heading (backward compat)
      if (!subtitle) {
        const nextElement = cleaned[firstHeadingIndex + 1]
        if (nextElement && isItalicParagraph(nextElement)) {
          subtitle = {
            type: 'root',
            children: [nextElement],
          }
          bodyStartIndex = firstHeadingIndex + 2
        }
      }

      const bodyChildren = [
        ...cleaned.slice(0, firstHeadingIndex),
        ...cleaned.slice(bodyStartIndex),
      ]

      return {
        header: {
          type: 'root',
          children: headerChildren,
        },
        pretitle,
        subtitle,
        body: {
          type: 'root',
          children: bodyChildren,
        },
        headingLevel: level,
        layout: layoutInfo?.name,
        layoutProps: layoutInfo?.props,
        backgroundImage,
      }
    }

    // No heading found, just use body
    return {
      body: {
        type: 'root',
        children: cleaned,
      },
      headingLevel: level,
      layout: layoutInfo?.name,
      layoutProps: layoutInfo?.props,
      backgroundImage,
    }
  }

  /**
   * Process vertical slides (H3-based) within a horizontal section
   * Takes raw children array, returns a Slide with potential verticalSlides
   */
  function processVerticalSlides(children: any[], sectionHeadingLevel?: string): Slide {
    if (!children || children.length === 0) {
      return createSlide([], sectionHeadingLevel)
    }

    const verticalSlides: Slide[] = []
    let currentSlide: any[] = []

    for (const node of children) {
      const isH3 = node.type === 'element' && node.tag === 'h3'

      if (isH3 && currentSlide.length > 0) {
        verticalSlides.push(createSlide(currentSlide))
        currentSlide = []
      }

      currentSlide.push(node)
    }

    // Add the last slide
    if (currentSlide.length > 0) {
      verticalSlides.push(createSlide(currentSlide))
    }

    // If we have multiple vertical slides, return them
    if (verticalSlides.length > 1) {
      return {
        body: { type: 'root', children },
        verticalSlides,
        headingLevel: sectionHeadingLevel || getHeadingLevel(children),
      }
    }

    // Single slide, just return it normally
    return createSlide(children, sectionHeadingLevel)
  }

  /**
   * Main function to process AST into slides
   * Splits by H1 (title), H2 (horizontal), and HR (divider)
   */
  function parseSlides(ast: MDCParserResult): Slide[] {
    if (!ast.body?.children)
      return []

    const sections: any[][] = []
    let currentSection: any[] = []
    let foundFirstH1 = false
    let inH1Section = false

    for (const node of ast.body.children) {
      const isH1 = node.type === 'element' && node.tag === 'h1'
      const isH2 = node.type === 'element' && node.tag === 'h2'
      const isHR = node.type === 'element' && node.tag === 'hr'

      // First H1 starts the title section
      if (isH1 && !foundFirstH1) {
        foundFirstH1 = true
        inH1Section = true

        if (currentSection.length > 0) {
          sections.push(currentSection)
          currentSection = []
        }

        currentSection.push(node)
        continue
      }

      // First H2 after H1 ends the title section
      if (isH2 && inH1Section) {
        inH1Section = false

        if (currentSection.length > 0) {
          sections.push(currentSection)
          currentSection = []
        }
      }

      // After title, H2 or HR starts a new horizontal section
      if (!inH1Section && (isH2 || isHR)) {
        if (currentSection.length > 0) {
          sections.push(currentSection)
          currentSection = []
        }
      }

      currentSection.push(node)
    }

    // Add the last section
    if (currentSection.length > 0) {
      sections.push(currentSection)
    }

    // Process each section for vertical slides (H3)
    return sections.map(children => processVerticalSlides(children))
  }

  /**
   * Strip YAML frontmatter from raw markdown content
   */
  function stripFrontmatter(content: string): string {
    const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
    return match ? content.slice(match[0].length) : content
  }

  /**
   * Alternative parser: split raw markdown by --- (horizontal) and ---- (vertical) separators.
   * Parses each chunk independently with MDC.
   */
  async function parseSlidesFromSeparators(rawContent: string): Promise<Slide[]> {
    const body = stripFrontmatter(rawContent)

    // Split by horizontal separator: a line that is exactly "---" (3 dashes)
    const horizontalSections = body.split(/^---$/m).filter(s => s.trim().length > 0)

    const slides: Slide[] = []

    for (const section of horizontalSections) {
      // Split by vertical separator: a line that is exactly "----" (4 dashes)
      const verticalParts = section.split(/^----$/m).filter(s => s.trim().length > 0)

      if (verticalParts.length > 1) {
        const verticalSlides: Slide[] = []
        for (const part of verticalParts) {
          const ast = await parseMarkdown(part.trim())
          if (ast.body?.children) {
            verticalSlides.push(createSlide(ast.body.children))
          }
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
        if (ast.body?.children) {
          slides.push(createSlide(ast.body.children))
        }
      }
    }

    return slides
  }

  return {
    parseSlides,
    parseSlidesFromSeparators,
    getHeadingLevel,
  }
}
