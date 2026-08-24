import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { verifyAccessToken } from '../utils/jwt';
import { bookingRepository } from '../repositories/booking.repository';
import { chatService } from '../services/chat.service';
import { attachSocketServer } from './emitter';
import type { AccessTokenPayload } from '../types/auth.types';

interface AuthenticatedSocket extends Socket {
  user?: AccessTokenPayload;
}

// Tracks every open socket per user, so presence is correct across multiple
// tabs/devices — "offline" only fires once the LAST connection for a user
// closes, not on every individual disconnect.
const onlineSockets = new Map<string, Set<string>>();

function markOnline(userId: string, socketId: string) {
  const set = onlineSockets.get(userId) ?? new Set<string>();
  set.add(socketId);
  onlineSockets.set(userId, set);
  return set.size === 1; // true if this is the user's first connection
}

function markOffline(userId: string, socketId: string) {
  const set = onlineSockets.get(userId);
  if (!set) return true;
  set.delete(socketId);
  if (set.size === 0) {
    onlineSockets.delete(userId);
    return true; // true if this was the user's last connection
  }
  return false;
}

export function initializeSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  // Auth happens once at handshake, not per-event — a socket that never
  // presents a valid access token never completes connection at all.
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      socket.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.user!.sub;
    logger.info({ userId, socketId: socket.id }, 'Socket connected');

    // Personal room — this is what notification.service.ts's emitToUser
    // targets, independent of any specific booking.
    socket.join(`user:${userId}`);

    // Auto-join every booking room this user is a participant in, so
    // message:receive / user:online / user:offline reach them without the
    // client having to explicitly subscribe per booking.
    const bookingIds = await bookingRepository.findParticipantBookingIds(userId);
    bookingIds.forEach((id) => socket.join(`booking:${id}`));

    const isFirstConnection = markOnline(userId, socket.id);
    if (isFirstConnection) {
      bookingIds.forEach((id) => socket.to(`booking:${id}`).emit('user:online', { userId }));
    }

    socket.on(
      'message:send',
      async (
        payload: { bookingId: string; content: string },
        ack?: (response: { ok: boolean; message?: unknown; error?: string }) => void
      ) => {
        try {
          const message = await chatService.sendMessage(userId, payload.bookingId, payload.content);
          // chatService already broadcasts 'message:receive' to the room
          // (including back to this socket) — the ack here is just a direct
          // send-confirmation for the sender's own UI, not a duplicate broadcast.
          ack?.({ ok: true, message });
        } catch (err) {
          logger.warn({ err, userId }, 'socket message:send failed');
          ack?.({ ok: false, error: err instanceof Error ? err.message : 'Failed to send message' });
        }
      }
    );

    socket.on('message:read', async (payload: { bookingId: string }) => {
      try {
        await chatService.markRead(userId, payload.bookingId);
      } catch (err) {
        logger.warn({ err, userId }, 'socket message:read failed');
      }
    });

    socket.on('typing:start', (payload: { bookingId: string }) => {
      socket.to(`booking:${payload.bookingId}`).emit('typing:start', { bookingId: payload.bookingId, userId });
    });

    socket.on('typing:stop', (payload: { bookingId: string }) => {
      socket.to(`booking:${payload.bookingId}`).emit('typing:stop', { bookingId: payload.bookingId, userId });
    });

    socket.on('disconnect', () => {
      logger.info({ userId, socketId: socket.id }, 'Socket disconnected');
      const wasLastConnection = markOffline(userId, socket.id);
      if (wasLastConnection) {
        bookingIds.forEach((id) => socket.to(`booking:${id}`).emit('user:offline', { userId }));
      }
    });
  });

  attachSocketServer(io);
  return io;
}
