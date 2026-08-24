import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../config/logger';
import { isProduction } from '../config/env';

/**
 * Single place all errors flow through. Route handlers should just
 * `throw` (or call `next(err)`) — they should never format an error
 * response themselves.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // Known, expected application errors
  if (err instanceof AppError) {
    if (!isProduction || err.statusCode >= 500) {
      logger.error({ err, path: req.path }, err.message);
    }
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  // Zod validation errors that escape a route's own validation middleware
  if (err instanceof ZodError) {
    return sendError(res, 'Validation failed', 422, err.issues);
  }

  // Multer errors — bad file size/type/field name on upload endpoints
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller' : err.message;
    return sendError(res, message, 400);
  }

  // Prisma errors are handled generically here; specific error codes
  // (e.g. P2002 unique constraint) are mapped closer to the call site
  // in services where the meaning is known (see user.service.ts).

  // Anything else is unexpected — never leak stack traces or internals.
  logger.error({ err, path: req.path }, 'Unhandled error');
  return sendError(
    res,
    isProduction ? 'Something went wrong' : (err as Error)?.message || 'Something went wrong',
    500
  );
}

/**
 * Catches requests to routes that don't exist.
 */
export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}
