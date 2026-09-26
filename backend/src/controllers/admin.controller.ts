import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type {
  AdminListBookingsQuery,
  AdminListPartnersQuery,
  AdminListPaymentsQuery,
  AdminListReportsQuery,
  AdminListSOSQuery,
  AdminListUsersQuery,
} from '../validators/admin.validators';

export const adminController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats, 'Dashboard stats retrieved');
  }),

  listUsers: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListUsersQuery;
    const result = await adminService.listUsers(query);
    sendSuccess(res, result, 'Users retrieved');
  }),

  listPartners: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListPartnersQuery;
    const result = await adminService.listPartners(query);
    sendSuccess(res, result, 'Partners retrieved');
  }),

  verifyPartner: asyncHandler(async (req: Request, res: Response) => {
    const user = await adminService.verifyPartner(
      req.user!.sub,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, { user }, 'Partner verification updated');
  }),

  listBookings: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListBookingsQuery;
    const result = await adminService.listBookings(req.user!.sub, query);
    sendSuccess(res, result, 'Bookings retrieved');
  }),

  listPayments: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListPaymentsQuery;
    const result = await adminService.listPayments(query);
    sendSuccess(res, result, 'Payments retrieved');
  }),

  listSOSAlerts: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListSOSQuery;
    const result = await adminService.listSOSAlerts(query);
    sendSuccess(res, result, 'SOS alerts retrieved');
  }),

  listReports: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminListReportsQuery;
    const result = await adminService.listReports(query);
    sendSuccess(res, result, 'Reports retrieved');
  }),

  updateReportStatus: asyncHandler(async (req: Request, res: Response) => {
    const report = await adminService.updateReportStatus(
      req.user!.sub,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, { report }, 'Report updated');
  }),
};
