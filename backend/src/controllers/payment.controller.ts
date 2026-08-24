import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { PaymentHistoryQuery } from '../validators/payment.validators';

export const paymentController = {
  createOrder: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.createOrder(req.user!.sub, req.body);
    sendSuccess(res, result, 'Payment order created', 201);
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.verifyPayment(req.user!.sub, req.body);
    sendSuccess(res, { payment }, 'Payment verified successfully');
  }),

  history: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as PaymentHistoryQuery;
    const result = await paymentService.listHistory(req.user!.sub, query);
    sendSuccess(res, result, 'Payment history retrieved');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.getPaymentById(req.user!.sub, req.params.id as string);
    sendSuccess(res, { payment }, 'Payment retrieved');
  }),
};
