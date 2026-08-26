import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { initializeSocketServer } from './sockets';
import { prisma } from './config/prisma';

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 CompanionHub API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

const io = initializeSocketServer(server);
logger.info('🔌 Socket.IO server attached');

// Graceful shutdown: stop accepting new connections, let in-flight requests
// finish, then close the DB pool and socket server — in that order, since
// closing Prisma first would fail any request still being handled. A hard
// timeout forces exit if something hangs (a stuck connection, a slow
// client) rather than leaving the process alive indefinitely.
const SHUTDOWN_TIMEOUT_MS = 10_000;

function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExitTimer.unref();

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await io.close();
      logger.info('Socket.IO server closed');
      await prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
    } finally {
      clearTimeout(forceExitTimer);
      process.exit(0);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  // An uncaught exception means the process is in an unknown state — exit
  // rather than keep serving requests from potentially corrupted state.
  // (A process manager like systemd/PM2/Docker's restart policy should
  // bring it back up.)
  process.exit(1);
});
