import type { NoteSource } from '../../utils/codimd'
import { fetchCollaborativeNote, getEditUrl, stripFrontmatter } from '../../utils/codimd'

/**
 * Dynamic CodiMD presentation endpoint.
 * Fetches any CodiMD note and serves it with a preset's frontmatter.
 *
 * GET /api/codimd/:noteId?preset=dsfr&source=codimd
 */
export default defineEventHandler(async (event) => {
  const noteId = getRouterParam(event, 'noteId')

  if (!noteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'noteId parameter is required',
    })
  }

  const query = getQuery(event)
  const source: NoteSource = (query.source as NoteSource) || 'codimd'
  const preset = (query.preset as string) || 'dsfr'

  // Validate source
  if (source !== 'codimd' && source !== 'hackmd') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid source. Must be "codimd" or "hackmd".',
    })
  }

  // Fetch remote content
  const remoteContent = await fetchCollaborativeNote(source, noteId)

  if (!remoteContent) {
    throw createError({
      statusCode: 502,
      statusMessage: `Could not fetch note "${noteId}" from ${source}`,
    })
  }

  // Strip any frontmatter from the remote note (we'll use preset instead)
  const body = stripFrontmatter(remoteContent)

  // Build frontmatter from preset
  const content = buildContentWithPreset(preset, body)

  return {
    content,
    status: 'public' as const,
    editUrl: getEditUrl(source, noteId),
  }
})

/**
 * Build a full markdown document with frontmatter from a named preset.
 * Preset definitions are duplicated here (server-side) to avoid importing
 * from src/ which is client/universal code.
 */
function buildContentWithPreset(presetName: string, body: string): string {
  const dsfr = {
    lang: 'fr',
    theme: 'dsfr',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/slide-bg-default.png',
      h2: '/backgrounds/slide-bg-contrast.png',
      h3: '/backgrounds/slide-bg-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  }

  const minimal = {
    lang: 'fr',
    theme: 'minimal',
    parser: 'separator',
    reveal: {
      slideNumber: true,
    },
  }

  const presets: Record<string, Record<string, any>> = { dsfr, minimal }
  const preset = (presets[presetName] || dsfr) as Record<string, any>
  const frontmatter = toYaml(preset)

  return `---\n${frontmatter}---\n\n${body}`
}

/**
 * Minimal YAML serializer for flat/nested preset objects.
 */
function toYaml(obj: Record<string, any>, indent = 0): string {
  const pad = '  '.repeat(indent)
  let yaml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null)
      continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      yaml += `${pad}${key}:\n${toYaml(value, indent + 1)}`
    }
    else if (typeof value === 'boolean') {
      yaml += `${pad}${key}: ${value}\n`
    }
    else if (typeof value === 'number') {
      yaml += `${pad}${key}: ${value}\n`
    }
    else {
      yaml += `${pad}${key}: "${value}"\n`
    }
  }

  return yaml
}
