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
