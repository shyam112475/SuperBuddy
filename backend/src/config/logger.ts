import pino from 'pino';
import { isProduction } from './env';

/**
 * Structured application logger.
 * Pretty-printed in development, structured JSON in production
 * (so it can be shipped to a log aggregator without reformatting).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
});
