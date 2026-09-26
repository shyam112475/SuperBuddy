import { bookingRepository } from '../repositories/booking.repository';
import { messageRepository } from '../repositories/message.repository';
import { blockRepository } from '../repositories/block.repository';
import { toPublicMessage } from '../utils/serializers';
import { ForbiddenError, NotFoundError } from '../utils/AppError';
import { emitToBooking } from '../sockets/emitter';
import { notifyUser } from './notification.service';
import type { ListMessagesQuery } from '../validators/chat.validators';

/**
 * Resolves (and authorizes) who's asking. Returns the other party's user id
 * so callers can address a notification/read-receipt to them, or throws
 * NotFoundError — never Forbidden — if the caller isn't a participant, so an
 * unrelated user can't even confirm a booking id exists via the chat API.
 */
async function requireParticipant(bookingId: string, userId: string) {
  const booking = await bookingRepository.findParticipants(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const isCustomer = booking.userId === userId;
  const isPartner = booking.partnerProfile.userId === userId;
  if (!isCustomer && !isPartner) {
    throw new NotFoundError('Booking not found');
  }

  const otherPartyId = isCustomer ? booking.partnerProfile.userId : booking.userId;
  return { otherPartyId };
}

export const chatService = {
  async listMessages(userId: string, bookingId: string, query: ListMessagesQuery) {
    await requireParticipant(bookingId, userId);

    const { items, total } = await messageRepository.findByBooking(bookingId, query);

    return {
      items: items.map(toPublicMessage),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async sendMessage(userId: string, bookingId: string, content: string) {
    const { otherPartyId } = await requireParticipant(bookingId, userId);

    const isBlocked = await blockRepository.existsEitherDirection(userId, otherPartyId);
    if (isBlocked) {
      throw new ForbiddenError("You can't message this person");
    }

    const message = await messageRepository.create({ bookingId, senderId: userId, content });
    const publicMessage = toPublicMessage(message);

    // Broadcast to anyone currently in the booking's room (both REST-sent
    // and socket-sent messages funnel through here, so this is the single
    // place real-time delivery happens either way).
    emitToBooking(bookingId, 'message:receive', publicMessage);

    await notifyUser({
      userId: otherPartyId,
      type: 'NEW_MESSAGE',
      title: 'New message',
      body: content.length > 140 ? `${content.slice(0, 137)}...` : content,
      data: { bookingId, messageId: message.id },
    });

    return publicMessage;
  },

  async markRead(userId: string, bookingId: string) {
    await requireParticipant(bookingId, userId);

    await messageRepository.markReadForRecipient(bookingId, userId);
    emitToBooking(bookingId, 'message:read', { bookingId, readBy: userId, readAt: new Date() });
  },
};
