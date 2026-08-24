import { Request, Response } from 'express';
import { blockService } from '../services/block.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const blockController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    await blockService.blockUser(req.user!.sub, req.body.blockedUserId);
    sendSuccess(res, null, 'User blocked', 201);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await blockService.unblockUser(req.user!.sub, req.params.userId as string);
    sendSuccess(res, null, 'User unblocked');
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    const blocks = await blockService.listMyBlocks(req.user!.sub);
    sendSuccess(res, { blocks }, 'Blocked users retrieved');
  }),
};
