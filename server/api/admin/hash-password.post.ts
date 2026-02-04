/**
 * Generate a password hash for semi-private presentations
 * POST /api/admin/hash-password
 *
 * Usage: Add the generated hash to your presentation's frontmatter:
 * ---
 * accessPassword: "<generated_hash>"
 * ---
 */

import { hashAccessPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event).catch(() => null)
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  // Get password from body
  const body = await readBody(event)
  const password = body?.password

  if (!password || typeof password !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required',
    })
  }

  if (password.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 4 characters',
    })
  }

  // Generate hash
  const hash = await hashAccessPassword(password)

  return {
    hash,
    usage: `Add this to your presentation frontmatter:\n---\naccessPassword: "${hash}"\n---`,
  }
})
