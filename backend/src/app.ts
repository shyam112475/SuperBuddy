import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import path from 'path';
import { env } from './config/env';
import { logger } from './config/logger';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — restricted to the configured frontend origin
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );

  // Body parsing with a sane size limit (guards against oversized payload abuse)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Structured request logging
  app.use(pinoHttp({ logger }));

  // Serves files written by localDevStorageProvider (dev-only fallback —
  // see services/storage/localDevProvider.ts). Not used when Cloudinary
  // is configured, since those URLs point at Cloudinary's own CDN instead.
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // API routes
  app.use('/api', apiRoutes);

  // 404 + centralized error handling — always last
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
