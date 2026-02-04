/**
 * Password utilities for semi-private presentations
 * Uses scrypt for secure password hashing
 */

import { Buffer } from 'node:buffer'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

/**
 * Hash a password for storage in frontmatter
 * @param password - Plain text password
 * @returns Hashed password string (salt:hash format)
 */
export async function hashAccessPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param storedHash - Stored hash from frontmatter (salt:hash format)
 * @returns true if password matches
 */
export async function verifyAccessPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash)
    return false

  const hashBuffer = Buffer.from(hash, 'hex')
  const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer

  return timingSafeEqual(hashBuffer, derivedHash)
}
