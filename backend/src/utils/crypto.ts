import crypto from 'crypto';

/**
 * Refresh and password-reset tokens are opaque random strings (not JWTs).
 * This lets us revoke/rotate individual tokens server-side by storing only
 * their hash — a stolen DB dump doesn't yield usable tokens, and a stolen
 * token can't be inspected for claims the way a JWT can.
 */
export function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
