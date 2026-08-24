import { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';

/**
 * Requires a valid Bearer access token. Attaches the decoded payload
 * to req.user for downstream handlers/middleware.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token'));
  }
}

/**
 * Restricts a route to specific roles. Must run after `authenticate`.
 * Usage: router.get('/admin/x', authenticate, authorize('ADMIN'), handler)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}

/**
 * Attaches req.user if a valid access token is present, but never rejects
 * the request if it's missing or invalid. For public endpoints that behave
 * slightly differently for a logged-in owner (e.g. a partner viewing their
 * own not-yet-verified profile) without requiring auth for everyone else.
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }
  try {
    req.user = verifyAccessToken(header.slice('Bearer '.length));
  } catch {
    // Invalid/expired token on an optional-auth route — proceed as anonymous
    // rather than failing the request.
  }
  next();
}
