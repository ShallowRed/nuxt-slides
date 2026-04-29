import type { PresentationMetadata } from '~/types/presentation'

/**
 * Named presets for CodiMD live presentations.
 * A preset bundles theme, backgrounds, reveal config, and parser mode
 * so that a CodiMD note can be rendered without a local stub file.
 *
 * Usage: /slides/codimd/<noteId>?preset=dsfr
 */
export interface Preset extends Pick<PresentationMetadata, 'theme' | 'backgrounds' | 'reveal' | 'parser' | 'lang'> {
  label: string
}

export const PRESETS: Record<string, Preset> = {
  dsfr: {
    label: 'DSFR',
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
  },
  lee: {
    label: 'LEE',
    lang: 'fr',
    theme: 'dsfr',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/lee-slide-bg-default.png',
      h2: '/backgrounds/lee-slide-bg-contrast.png',
      h3: '/backgrounds/lee-slide-bg-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  },
  minimal: {
    label: 'Minimal',
    lang: 'fr',
    theme: 'minimal',
    parser: 'separator',
    reveal: {
      slideNumber: true,
    },
  },
}

export const DEFAULT_PRESET = 'dsfr'
