/**
 * Composable for loading and managing presentation data
 * Handles fetching, parsing, and providing presentation state
 */

import type { PresentationData } from '~/types/presentation'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { DEFAULT_METADATA } from '~/config/presentation'

export function usePresentation(slug: string) {
  const { parseSlides } = useSlideParser()

  const { data, error, status, refresh } = useAsyncData(
    `presentation-${slug}`,
    async (): Promise<PresentationData> => {
      // Fetch markdown content
      const response = await $fetch<{ content: string }>(`/api/presentations/${slug}`)

      // Parse MDC
      const ast = await parseMarkdown(response.content)

      // Extract and merge metadata
      const metadata = {
        ...DEFAULT_METADATA,
        ...(ast.data || {}),
      }

      // Parse slides from AST
      const slides = parseSlides(ast)

      return { slides, metadata }
    },
    {
      default: () => ({
        slides: [],
        metadata: { ...DEFAULT_METADATA },
      }),
    },
  )

  return {
    data,
    error,
    status,
    refresh,
  }
}
