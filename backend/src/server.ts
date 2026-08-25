import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { initializeSocketServer } from './sockets';

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 SuperBuddy API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

initializeSocketServer(server);
logger.info('🔌 Socket.IO server attached');

// Basic graceful shutdown — expanded in Phase 11 with DB/Redis connection draining
function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
