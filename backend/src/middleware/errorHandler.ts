import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../config/logger';
import { isProduction } from '../config/env';

/** Narrow, duck-typed check for a Prisma known-request error — avoids an
 * `instanceof` check against the Prisma namespace, which can fail across
 * module boundaries (e.g. multiple @prisma/client instances) even in a
 * normal setup, and sidesteps needing the Prisma type import here at all. */
function isPrismaKnownRequestError(err: unknown): err is { code: string; message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string' &&
    (err as { code: string }).code.startsWith('P')
  );
}

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

  // Prisma errors are mapped closer to the call site where the meaning is
  // known and a message can be more specific (e.g. "that phone number is
  // already in use" in user.service.ts). This is the generic fallback for
  // any Prisma error that reaches here without a service-level catch —
  // never a leaked raw constraint name or SQL detail.
  if (isPrismaKnownRequestError(err)) {
    if (err.code === 'P2002') {
      return sendError(res, 'A record with that value already exists', 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Resource not found', 404);
    }
    if (err.code === 'P2003') {
      return sendError(res, 'This action references something that no longer exists', 400);
    }
    logger.error({ err, path: req.path, prismaCode: err.code }, 'Unhandled Prisma error');
    return sendError(res, isProduction ? 'Something went wrong' : err.message, 500);
  }

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
