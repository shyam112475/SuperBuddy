import { Request, Response } from 'express';
import { reportService } from '../services/report.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const reportController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const report = await reportService.createReport(req.user!.sub, req.body);
    sendSuccess(res, { report }, 'Report submitted — thank you for helping keep the community safe', 201);
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    const reports = await reportService.listMyReports(req.user!.sub);
    sendSuccess(res, { reports }, 'Your reports retrieved');
  }),
};
