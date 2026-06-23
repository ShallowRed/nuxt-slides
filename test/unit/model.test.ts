import type { DeckModel } from '../../shared/deck/model'
import { describe, expect, it } from 'vitest'
import { DECK_MODEL_VERSION, parseDeckModel, serializeDeckModel } from '../../shared/deck/model'
import { parserIdFor } from '../../shared/deck/parser'

describe('deckModel IR serialization (audit §5.8)', () => {
  const model: DeckModel = {
    meta: { theme: 'lee', reveal: { margin: 0.2 } },
    slides: [
      { body: { type: 'root', children: [] }, headingLevel: 'h1' },
      { body: { type: 'root', children: [] }, layout: 'media-right', layoutProps: { src: '/a.png' } },
    ],
    assets: [{ kind: 'storybook', url: 'https://sb.example/iframe.html?id=x' }],
    provenance: { parser: 'separator', source: 'codimd' },
  }

  it('round-trips through serialize → parse', () => {
    expect(parseDeckModel(serializeDeckModel(model))).toEqual(model)
  })

  it('wraps the payload with a version', () => {
    const parsed = JSON.parse(serializeDeckModel(model))
    expect(parsed.version).toBe(DECK_MODEL_VERSION)
    expect(parsed.model.meta.theme).toBe('lee')
  })

  it('tolerates a bare (unwrapped) model for forward-compat', () => {
    expect(parseDeckModel(JSON.stringify(model))).toEqual(model)
  })
})

describe('parserIdFor', () => {
  it('selects the separator parser when requested', () => {
    expect(parserIdFor({ parser: 'separator' })).toBe('separator')
  })

  it('defaults to the heading parser', () => {
    expect(parserIdFor({})).toBe('heading')
    expect(parserIdFor({ parser: undefined })).toBe('heading')
  })
})
