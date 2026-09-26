import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/AppError';

/**
 * Validates req.body / req.query / req.params against a Zod schema shaped
 * like { body?, query?, params? }. On success, replaces req.body etc. with
 * the parsed (and coerced/trimmed) values so downstream code can trust them.
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      // req.query is a getter-only property on some Express versions;
      // only reassign fields that exist rather than the whole object.
      if (parsed.query) Object.assign(req.query, parsed.query);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new ValidationError('Validation failed', err.issues));
      }
      next(err);
    }
  };
}
