/**
 * Composable for loading and managing presentation data
 * Handles fetching, parsing, and providing presentation state
 */

import type { PresentationData } from '~/types/presentation'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { DEFAULT_METADATA } from '~/config/presentation'

export function usePresentation(slug: string) {
  const { parseSlides, parseSlidesFromSeparators } = useSlideParser()

  const { data, error, status, refresh } = useAsyncData(
    `presentation-${slug}`,
    async (): Promise<PresentationData> => {
      // Fetch markdown content
      const response = await $fetch<{ content: string, editUrl?: string }>(`/api/presentations/${slug}`)

      // Parse MDC
      const ast = await parseMarkdown(response.content)

      // Extract and merge metadata
      const metadata = {
        ...DEFAULT_METADATA,
        ...(ast.data || {}),
      }

      // Parse slides: separator mode (--- / ----) or default heading mode (H1/H2/H3)
      const slides = metadata.parser === 'separator'
        ? await parseSlidesFromSeparators(response.content)
        : parseSlides(ast)

      return { slides, metadata, editUrl: response.editUrl }
    },
    {
      default: () => ({
        slides: [],
        metadata: { ...DEFAULT_METADATA },
        editUrl: undefined,
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
