/**
 * Composable for parsing MDC content into slide structures
 * Handles the logic of splitting content by H1/H2/H3 headings
 */

import type { MDCParserResult } from '@nuxtjs/mdc'
import type { Slide } from '~/types/presentation'

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
   * Checks if a node or its children contain a layout component (e.g., SplitSlide)
   */
  function getSlideLayout(children: any[]): string | undefined {
    for (const node of children) {
      if (node.type === 'element') {
        if (node.tag === 'SplitSlide' || node.tag === 'split-slide') {
          return 'split'
        }
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
   * Creates a slide object from AST nodes
   * Separates the first heading into header, rest into body
   * Detects italic paragraph after heading as subtitle (creates hgroup)
   * Unless the slide has a special layout (then keep all in body)
   */
  function createSlide(children: any[], headingLevel?: string): Slide {
    const level = headingLevel || getHeadingLevel(children)
    const layout = getSlideLayout(children)

    // If the slide has a special layout, keep everything in body
    if (layout) {
      return {
        body: {
          type: 'root',
          children,
        },
        headingLevel: level,
        layout,
      }
    }

    // Find the first heading element
    const firstHeadingIndex = children.findIndex((node: any) =>
      node.type === 'element' && /^h[1-6]$/.test(node.tag),
    )

    // If we have a heading, separate it from the body
    if (firstHeadingIndex !== -1) {
      const headerChildren = [children[firstHeadingIndex]]
      let subtitle: any
      let bodyStartIndex = firstHeadingIndex + 1

      // Check if the next element is an italic paragraph (subtitle)
      const nextElement = children[firstHeadingIndex + 1]
      if (nextElement && isItalicParagraph(nextElement)) {
        subtitle = {
          type: 'root',
          children: [nextElement],
        }
        bodyStartIndex = firstHeadingIndex + 2
      }

      const bodyChildren = [
        ...children.slice(0, firstHeadingIndex),
        ...children.slice(bodyStartIndex),
      ]

      return {
        header: {
          type: 'root',
          children: headerChildren,
        },
        subtitle,
        body: {
          type: 'root',
          children: bodyChildren,
        },
        headingLevel: level,
      }
    }

    // No heading found, just use body
    return {
      body: {
        type: 'root',
        children,
      },
      headingLevel: level,
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

  return {
    parseSlides,
    getHeadingLevel,
  }
}
