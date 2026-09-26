import type { Server } from 'socket.io';

/**
 * Services (chat, notifications, bookings) need to push real-time events,
 * but shouldn't import the Socket.IO server module directly — that would
 * create a services → sockets → services import cycle, since the socket
 * connection handler also calls into chat.service.ts. This module is the
 * one place both sides depend on instead.
 *
 * If no socket server is attached yet (or in a context without sockets,
 * like a future background job), emit calls are safely no-ops rather than
 * throwing — real-time delivery is a nice-to-have on top of the persisted
 * DB record, never a requirement for the underlying action to succeed.
 */
let ioInstance: Server | null = null;

export function attachSocketServer(io: Server) {
  ioInstance = io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  ioInstance?.to(`user:${userId}`).emit(event, payload);
}

export function emitToBooking(bookingId: string, event: string, payload: unknown) {
  ioInstance?.to(`booking:${bookingId}`).emit(event, payload);
}
