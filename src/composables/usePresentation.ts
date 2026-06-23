/**
 * Composable for loading and managing presentation data
 * Handles fetching, parsing, and providing presentation state
 */

import type { PresentationData } from '~/types/presentation'
import { parserIdFor } from '#shared/deck'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { DEFAULT_METADATA } from '~/config/presentation'
import { PARSERS } from '~/utils/slide-ast'

export function usePresentation(slug: string, apiUrl?: string) {
  const { data, error, status, refresh } = useAsyncData(
    `presentation-${slug}`,
    async (): Promise<PresentationData> => {
      // Fetch markdown content
      const response = await $fetch<{ content: string, editUrl?: string }>(apiUrl || `/api/presentations/${slug}`)

      // Parse MDC
      const ast = await parseMarkdown(response.content)

      // Extract and merge metadata
      const metadata = {
        ...DEFAULT_METADATA,
        ...(ast.data || {}),
      }

      // Parse slides through the shared parser port: the deck's `parser` mode
      // selects the implementation (heading vs separator) — one contract, no
      // ad-hoc branching (audit §5.8). Both take the raw markdown uniformly.
      const parser = PARSERS[parserIdFor(metadata)]
      const slides = await parser.parse(response.content, metadata)

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
    presentationData: data,
    error,
    status,
    refresh,
  }
}
