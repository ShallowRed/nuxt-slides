import type { NoteSource } from '../../utils/codimd'
import { fetchCollaborativeNote, getEditUrl, parseFlatFrontmatter, stripFrontmatter } from '../../utils/codimd'

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

  // Parse flat keys from the note's own frontmatter (theme, lang, title, …)
  const noteFrontmatter = parseFlatFrontmatter(remoteContent)

  // Strip any frontmatter from the remote note (we'll use preset instead)
  const body = stripFrontmatter(remoteContent)

  // Build frontmatter from preset, with note frontmatter overriding flat keys
  const content = buildContentWithPreset(preset, noteFrontmatter, body)

  return {
    content,
    status: 'public' as const,
    editUrl: getEditUrl(source, noteId),
  }
})

/**
 * Build a full markdown document with frontmatter from a named preset,
 * with flat keys from the note's own frontmatter merged on top (note wins).
 * Preset definitions are duplicated here (server-side) to avoid importing
 * from src/ which is client/universal code.
 */
function buildContentWithPreset(
  presetName: string,
  noteFrontmatter: Record<string, string>,
  body: string,
): string {
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

  const lee = {
    lang: 'fr',
    theme: 'lee',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/lee-slide-contrast.png',
      h2: '/backgrounds/lee-slide-contrast.png',
      h3: '/backgrounds/lee-slide-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  }

  const presets: Record<string, Record<string, any>> = { dsfr, minimal, lee }

  // Start from the named preset (fall back to dsfr)
  const preset = { ...(presets[presetName] || dsfr) } as Record<string, any>

  // Note frontmatter overrides flat keys (theme, lang, title, …).
  // When the theme changes, swap the backgrounds/reveal to match the new preset.
  const noteTheme = noteFrontmatter.theme
  if (noteTheme && noteTheme !== preset.theme && presets[noteTheme]) {
    const themePreset = presets[noteTheme]!
    if (themePreset.backgrounds)
      preset.backgrounds = themePreset.backgrounds
    if (themePreset.reveal)
      preset.reveal = themePreset.reveal
  }

  // Merge flat note keys on top
  for (const [k, v] of Object.entries(noteFrontmatter)) {
    // Don't let nested-object keys from the note accidentally overwrite objects
    if (typeof preset[k] !== 'object')
      preset[k] = v
  }

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
