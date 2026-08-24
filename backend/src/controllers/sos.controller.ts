import { Request, Response } from 'express';
import { sosService } from '../services/sos.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const sosController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const alert = await sosService.createAlert(req.user!.sub, req.body);
    sendSuccess(res, { alert }, 'SOS alert triggered — help has been notified', 201);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const alert = await sosService.getAlertById(req.user!.sub, req.user!.role, req.params.id as string);
    sendSuccess(res, { alert }, 'SOS alert retrieved');
  }),

  resolve: asyncHandler(async (req: Request, res: Response) => {
    const alert = await sosService.resolveAlert(
      req.user!.sub,
      req.user!.role,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, { alert }, 'SOS alert resolved');
  }),
};
