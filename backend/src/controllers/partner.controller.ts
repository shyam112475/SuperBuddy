import { Request, Response } from 'express';
import { partnerService } from '../services/partner.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { DiscoverPartnersQuery } from '../validators/partner.validators';

export const partnerController = {
  createProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.createProfile(req.user!.sub, req.body);
    sendSuccess(res, { profile }, 'Partner profile created successfully', 201);
  }),

  getMyProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.getMyProfile(req.user!.sub);
    sendSuccess(res, { profile }, 'Partner profile retrieved');
  }),

  updateMyProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.updateMyProfile(req.user!.sub, req.body);
    sendSuccess(res, { profile }, 'Partner profile updated successfully');
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as DiscoverPartnersQuery;
    const result = await partnerService.searchPartners(query);
    sendSuccess(res, result, 'Partners retrieved');
  }),

  getPublicProfile: asyncHandler(async (req: Request, res: Response) => {
    // req.params.id is always a plain string for a named `:id` segment —
    // the string[] branch in the type only applies to wildcard (*) routes,
    // which this route isn't.
    const profile = await partnerService.getPublicProfile(req.params.id as string, req.user?.sub);
    sendSuccess(res, { profile }, 'Partner retrieved');
  }),

  addServiceOffering: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.addServiceOffering(req.user!.sub, req.body);
    sendSuccess(res, { profile }, 'Service added successfully', 201);
  }),

  removeServiceOffering: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.removeServiceOffering(
      req.user!.sub,
      req.params.offeringId as string
    );
    sendSuccess(res, { profile }, 'Service removed successfully');
  }),

  setAvailability: asyncHandler(async (req: Request, res: Response) => {
    const profile = await partnerService.setAvailability(req.user!.sub, req.body);
    sendSuccess(res, { profile }, 'Availability updated successfully');
  }),

  listServiceCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await partnerService.listServiceCategories();
    sendSuccess(res, { categories }, 'Service categories retrieved');
  }),
};
