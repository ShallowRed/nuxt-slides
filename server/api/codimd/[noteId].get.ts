import type { NoteSource } from '../../utils/codimd'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
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

  // Parse the note's own frontmatter (full, including nested `reveal`/`backgrounds`).
  // Uses the same parser as the rest of the app so nested config is read faithfully.
  const ast = await parseMarkdown(remoteContent)
  const noteFrontmatter = (ast.data || {}) as Record<string, any>

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
 * Build a full markdown document with frontmatter from a named preset, then
 * deep-merge the note's own frontmatter on top (the note is the author's source
 * of truth). Nested blocks like `reveal` (margin/width/height) and `backgrounds`
 * override the preset's, so a deck's `reveal.margin` set in CodiMD is honoured.
 * Preset definitions are duplicated here (server-side) to avoid importing
 * from src/ which is client/universal code.
 */
function buildContentWithPreset(
  presetName: string,
  noteFrontmatter: Record<string, any>,
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
  const noteTheme = typeof noteFrontmatter.theme === 'string' ? noteFrontmatter.theme : undefined
  if (noteTheme && noteTheme !== preset.theme && presets[noteTheme]) {
    const themePreset = presets[noteTheme]!
    if (themePreset.backgrounds)
      preset.backgrounds = themePreset.backgrounds
    if (themePreset.reveal)
      preset.reveal = themePreset.reveal
  }

  // Deep-merge the note's own frontmatter over the preset. The note is the
  // author's source of truth: nested blocks like `reveal` (margin/width/height)
  // and `backgrounds` override the preset's, and scalar keys (theme, lang, title…)
  // win too. This is what makes a deck's `reveal.margin` set in CodiMD apply.
  const merged = deepMerge(preset, noteFrontmatter)

  const frontmatter = toYaml(merged)
  return `---\n${frontmatter}---\n\n${body}`
}

/**
 * Recursively merge `override` onto `base`. Plain objects merge deeply; scalars
 * and arrays replace. `null`/`undefined` overrides are ignored so a stray empty
 * note key can't wipe a preset default.
 */
function deepMerge(base: Record<string, any>, override: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null)
      continue
    const current = out[key]
    if (isPlainObject(current) && isPlainObject(value))
      out[key] = deepMerge(current, value)
    else
      out[key] = value
  }
  return out
}

function isPlainObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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
    else if (Array.isArray(value)) {
      yaml += `${pad}${key}:\n`
      for (const item of value) {
        if (typeof item === 'number' || typeof item === 'boolean')
          yaml += `${pad}  - ${item}\n`
        else
          yaml += `${pad}  - "${item}"\n`
      }
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
