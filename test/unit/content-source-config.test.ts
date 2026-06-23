import { describe, expect, it } from 'vitest'
import {
  decideFetchAction,
  DEFAULT_CONTENT_FOLDERS,
  readContentSourceConfig,
} from '../../shared/content/source-config'

describe('readContentSourceConfig', () => {
  it('defaults to a submodule source locally (no CI)', () => {
    const cfg = readContentSourceConfig({})
    expect(cfg.kind).toBe('submodule')
    expect(cfg.repo).toBe('ShallowRed/nuxt-slides-content')
    expect(cfg.branch).toBe('main')
    expect(cfg.hasToken).toBe(false)
    expect(cfg.failClosed).toBe(false)
    expect(cfg.folders).toEqual(DEFAULT_CONTENT_FOLDERS)
  })

  it('switches to remote-git + fail-closed on CI', () => {
    const cfg = readContentSourceConfig({ CI: '1', PRESENTATIONS_REPO_TOKEN: 'x' })
    expect(cfg.kind).toBe('remote-git')
    expect(cfg.hasToken).toBe(true)
    expect(cfg.failClosed).toBe(true)
  })

  it('reads repo/branch/folders overrides and treats folders as data', () => {
    const cfg = readContentSourceConfig({
      PRESENTATIONS_REPO: 'me/decks',
      PRESENTATIONS_BRANCH: 'release',
      PRESENTATIONS_FOLDERS: 'public, private',
    })
    expect(cfg.repo).toBe('me/decks')
    expect(cfg.branch).toBe('release')
    expect(cfg.folders).toEqual(['public', 'private'])
  })
})

describe('decideFetchAction (fail-closed policy)', () => {
  const ci = readContentSourceConfig({ CI: '1', PRESENTATIONS_REPO_TOKEN: 'tok' })
  const ciNoToken = readContentSourceConfig({ CI: '1' })
  const local = readContentSourceConfig({})

  it('skips when content is already populated', () => {
    expect(decideFetchAction(ci, true)).toEqual({ action: 'skip', reason: expect.any(String) })
  })

  it('clones with the declared repo/branch on CI with a token', () => {
    expect(decideFetchAction(ci, false)).toEqual({
      action: 'clone',
      repo: 'ShallowRed/nuxt-slides-content',
      branch: 'main',
    })
  })

  it('fAILS (never empty) on CI without a token', () => {
    expect(decideFetchAction(ciNoToken, false).action).toBe('fail')
  })

  it('skips locally without a token (submodule init expected)', () => {
    expect(decideFetchAction(local, false).action).toBe('skip')
  })
})
