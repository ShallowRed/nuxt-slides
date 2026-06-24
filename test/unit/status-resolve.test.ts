import { describe, expect, it } from 'vitest'
import { DEFAULT_STATUS, resolveDeckStatus } from '../../shared/deck/status-resolve'

function stub(frontmatter: string): string {
  return `---\n${frontmatter}\n---\n\n# Body\n`
}

describe('resolveDeckStatus — fail-closed status resolution', () => {
  it('reads a valid frontmatter status', () => {
    expect(resolveDeckStatus(stub('status: public'))).toBe('public')
    expect(resolveDeckStatus(stub('status: semi-private'))).toBe('semi-private')
    expect(resolveDeckStatus(stub('status: draft'))).toBe('draft')
  })

  it('accepts the legacy `access:` alias', () => {
    expect(resolveDeckStatus(stub('access: public'))).toBe('public')
  })

  it('prefers `status:` over the legacy `access:`', () => {
    expect(resolveDeckStatus(stub('status: private\naccess: public'))).toBe('private')
  })

  it('falls back to the folder hint when frontmatter omits status', () => {
    expect(resolveDeckStatus(stub('title: x'), 'semi-private')).toBe('semi-private')
  })

  it('frontmatter status wins over a contradicting folder hint', () => {
    expect(resolveDeckStatus(stub('status: private'), 'public')).toBe('private')
  })

  it('fails closed: no status, no hint → private', () => {
    expect(resolveDeckStatus(stub('title: x'))).toBe('private')
    expect(DEFAULT_STATUS).toBe('private')
  })

  it('fails closed: invalid status value → private (never the bad value)', () => {
    expect(resolveDeckStatus(stub('status: world-readable'))).toBe('private')
  })

  it('fails closed: invalid folder hint is ignored → private', () => {
    expect(resolveDeckStatus(stub('title: x'), 'totally-open')).toBe('private')
  })

  it('fails closed: no frontmatter at all → private', () => {
    expect(resolveDeckStatus('# Just a body, no frontmatter')).toBe('private')
  })
})
