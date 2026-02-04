#!/usr/bin/env node

/**
 * Hash a password for use in presentation frontmatter
 * Usage: node scripts/hash-password.js <password>
 * Or: pnpm hash-password <password>
 */

import { randomBytes, scrypt } from 'node:crypto'
import process from 'node:process'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

async function hashPassword(password) {
  if (!password) {
    console.error('Error: Password is required')
    console.error('Usage: pnpm hash-password "<password>"')
    process.exit(1)
  }

  const salt = randomBytes(16).toString('hex')
  const hash = await scryptAsync(password, salt, 64)
  const hashed = `${salt}:${hash.toString('hex')}`

  console.log('Password hash:')
  console.log(hashed)
  console.log('\nAdd this to your presentation frontmatter:')
  console.log(`accessPassword: "${hashed}"`)
}

const password = process.argv[2]
hashPassword(password).catch((err) => {
  console.error('Error hashing password:', err.message)
  process.exit(1)
})
