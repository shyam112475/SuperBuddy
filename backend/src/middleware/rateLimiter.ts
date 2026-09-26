import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/apiResponse';

/**
 * Applied to login/register/forgot-password — the endpoints most
 * attractive for credential stuffing / brute force / enumeration.
 * A generous ceiling for legitimate retries, low enough to blunt automation.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many attempts. Please try again later.', 429);
  },
});

/**
 * Baseline limiter applied to every API request (mounted in app.ts). Loose
 * enough that no legitimate user or the frontend's normal polling/query
 * traffic ever notices it — this exists to blunt scripted abuse across the
 * whole surface, not to police individual endpoints (those get their own
 * tighter limiters where it matters, e.g. authRateLimiter).
 *
 * Deliberately NOT applied to /api/sos — throttling a safety feature is
 * always the wrong tradeoff (see sos.routes.ts).
 */
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/sos'),
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please slow down.', 429);
  },
});

/**
 * Tighter limiter for write actions worth throttling beyond the global
 * baseline — report submission, review submission, message sending. High
 * enough that normal use (including a burst of chat messages) never trips
 * it, low enough to blunt spam/flooding.
 */
export const writeActionRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please slow down.', 429);
  },
});
