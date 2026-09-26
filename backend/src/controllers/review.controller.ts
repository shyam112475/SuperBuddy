import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListPartnerReviewsQuery } from '../validators/review.validators';

export const reviewController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.createReview(req.user!.sub, req.body);
    sendSuccess(res, { review }, 'Review submitted successfully', 201);
  }),

  listForPartner: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListPartnerReviewsQuery;
    const result = await reviewService.listForPartner(req.params.id as string, query);
    sendSuccess(res, result, 'Reviews retrieved');
  }),
};
