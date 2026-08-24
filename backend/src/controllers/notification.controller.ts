import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListNotificationsQuery } from '../validators/notification.validators';

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListNotificationsQuery;
    const result = await notificationService.list(req.user!.sub, query);
    sendSuccess(res, result, 'Notifications retrieved');
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markRead(req.user!.sub, req.params.id as string);
    sendSuccess(res, null, 'Notification marked as read');
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllRead(req.user!.sub);
    sendSuccess(res, null, 'All notifications marked as read');
  }),
};
