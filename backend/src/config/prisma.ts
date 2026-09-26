import { PrismaClient } from '@prisma/client';
import { isProduction } from './env';

/**
 * Singleton Prisma client. In dev, tsx watch mode can otherwise create
 * multiple clients across hot reloads and exhaust DB connections, so
 * we stash the instance on globalThis outside of production.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error', 'warn'] : ['warn', 'error'],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
