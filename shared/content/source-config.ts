import process from 'node:process'
import { z } from 'zod'

/**
 * First-class, declared content source (audit §5.7 / Axe F).
 *
 * The private presentations used to be sourced by an *implicit* tangle: a git
 * submodule, a `PRESENTATIONS_REPO_TOKEN`, and `fetch-presentations.js` reading a
 * handful of env vars ad hoc — with public/private encoded purely as folder names.
 * When the token expired the site shipped empty *in silence* (the worst failure).
 *
 * This module makes the source a single, validated, declared object (à la Nuxt
 * Content `source.repository + authToken` / an Astro loader). The public/private
 * axis becomes data (`folders`), and the fail-closed policy is explicit rather
 * than buried in a script. Pure and framework-free so it is unit-testable and
 * usable from the build script and the server alike.
 */

/** How the presentations content is obtained at build time. */
export const ContentSourceKindSchema = z.enum(['submodule', 'remote-git'])
export type ContentSourceKind = z.infer<typeof ContentSourceKindSchema>

export const ContentSourceConfigSchema = z.object({
  /** `submodule` (local checkout) or `remote-git` (clone with a token on CI). */
  kind: ContentSourceKindSchema,
  /** `owner/repo` of the content repository. */
  repo: z.string(),
  /** Branch to source from. */
  branch: z.string(),
  /** Whether an auth token is available (never store the token itself here). */
  hasToken: z.boolean(),
  /** Access folders that exist in the content repo (public/private as DATA). */
  folders: z.array(z.string()),
  /** When true, an unreachable source must fail the build, never ship empty. */
  failClosed: z.boolean(),
})
export type ContentSourceConfig = z.infer<typeof ContentSourceConfigSchema>

export const DEFAULT_CONTENT_REPO = 'ShallowRed/nuxt-slides-content'
export const DEFAULT_CONTENT_BRANCH = 'main'
export const DEFAULT_CONTENT_FOLDERS = ['public', 'draft', 'private', 'semi-private']

/**
 * Read the declared content-source configuration from an environment map
 * (defaults to `process.env`). The single point that interprets the env, so the
 * fetch script and any future consumer agree on the source definition.
 *
 * `failClosed` is true on CI (`CI`/`VERCEL`): a missing token or an unreachable
 * clone must fail the build rather than deploy a deck-less site.
 */
export function readContentSourceConfig(env: NodeJS.ProcessEnv = process.env): ContentSourceConfig {
  const hasToken = Boolean(env.PRESENTATIONS_REPO_TOKEN)
  const isCI = Boolean(env.CI || env.VERCEL)
  const folders = env.PRESENTATIONS_FOLDERS
    ? env.PRESENTATIONS_FOLDERS.split(',').map(s => s.trim()).filter(Boolean)
    : DEFAULT_CONTENT_FOLDERS

  return ContentSourceConfigSchema.parse({
    // On CI the content is cloned with a token (`remote-git`); locally it is a
    // normal submodule checkout.
    kind: isCI ? 'remote-git' : 'submodule',
    repo: env.PRESENTATIONS_REPO || DEFAULT_CONTENT_REPO,
    branch: env.PRESENTATIONS_BRANCH || DEFAULT_CONTENT_BRANCH,
    hasToken,
    folders,
    failClosed: isCI,
  })
}

/**
 * Decide what the fetch step should do, given the declared config and whether the
 * content is already present locally. Pure (no I/O), so the policy — including the
 * fail-closed branch that prevents silent empty deploys — is directly testable.
 */
export type FetchAction
  = | { action: 'skip', reason: string }
    | { action: 'clone', repo: string, branch: string }
    | { action: 'fail', reason: string }

export function decideFetchAction(
  config: ContentSourceConfig,
  alreadyPopulated: boolean,
): FetchAction {
  if (alreadyPopulated)
    return { action: 'skip', reason: 'content already initialized' }

  if (!config.hasToken) {
    return config.failClosed
      ? { action: 'fail', reason: 'no PRESENTATIONS_REPO_TOKEN on CI — refusing to build an empty site' }
      : { action: 'skip', reason: 'no token — run: git submodule update --init' }
  }

  return { action: 'clone', repo: config.repo, branch: config.branch }
}
