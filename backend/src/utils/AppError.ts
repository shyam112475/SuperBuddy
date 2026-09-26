/**
 * Base class for all expected/handled application errors.
 * Anything thrown as AppError (or a subclass) is treated as "operational" —
 * safe to surface a clean message for. Anything else is treated as an
 * unexpected bug and gets a generic 500 response instead of leaking detail.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;
  public readonly errors: unknown[];

  constructor(message: string, statusCode = 500, errors: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors: unknown[] = []) {
    super(message, 400, errors);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors: unknown[] = []) {
    super(message, 422, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}
