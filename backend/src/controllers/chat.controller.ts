import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListMessagesQuery } from '../validators/chat.validators';

export const chatController = {
  listMessages: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListMessagesQuery;
    const result = await chatService.listMessages(req.user!.sub, req.params.bookingId as string, query);
    sendSuccess(res, result, 'Messages retrieved');
  }),

  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const message = await chatService.sendMessage(
      req.user!.sub,
      req.params.bookingId as string,
      req.body.content
    );
    sendSuccess(res, { message }, 'Message sent', 201);
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    await chatService.markRead(req.user!.sub, req.params.bookingId as string);
    sendSuccess(res, null, 'Messages marked as read');
  }),
};
