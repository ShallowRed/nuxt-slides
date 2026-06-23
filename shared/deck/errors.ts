/**
 * Typed source errors (audit §5.7 / §4.1 Astro Live).
 *
 * The content-source layer used to fail *silently* (return `null` / an empty
 * list), which is how an expired token once produced a deploy that was "empty"
 * with every route 404 — the worst failure mode. Typed errors let callers choose
 * an explicit policy: a missing note can degrade to the stub, but a registry that
 * cannot be read should fail *closed*, not pretend the catalog is empty.
 */

/** A source could not be reached (network, auth, mis-config). Fail-closed worthy. */
export class SourceUnreachableError extends Error {
  constructor(
    public readonly source: string,
    public readonly ref: string,
    public readonly cause?: unknown,
  ) {
    super(`[${source}] could not reach "${ref}": ${describeCause(cause)}`)
    this.name = 'SourceUnreachableError'
  }
}

/** A source was reached but the referenced entry does not exist. */
export class SourceNotFoundError extends Error {
  constructor(
    public readonly source: string,
    public readonly ref: string,
  ) {
    super(`[${source}] "${ref}" not found`)
    this.name = 'SourceNotFoundError'
  }
}

function describeCause(cause: unknown): string {
  if (cause == null)
    return 'unknown error'
  if (cause instanceof Error)
    return cause.message
  return String(cause)
}
