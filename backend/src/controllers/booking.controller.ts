import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListBookingsQuery } from '../validators/booking.validators';

export const bookingController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking(req.user!.sub, req.body);
    sendSuccess(res, { booking }, 'Booking request sent successfully', 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListBookingsQuery;
    const result = await bookingService.listBookings(req.user!.sub, query);
    sendSuccess(res, result, 'Bookings retrieved');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.getBookingById(req.user!.sub, req.params.id as string);
    sendSuccess(res, { booking }, 'Booking retrieved');
  }),

  accept: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.acceptBooking(req.user!.sub, req.params.id as string);
    sendSuccess(res, { booking }, 'Booking accepted');
  }),

  reject: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.rejectBooking(
      req.user!.sub,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, { booking }, 'Booking rejected');
  }),

  cancel: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.cancelBooking(
      req.user!.sub,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, { booking }, 'Booking cancelled');
  }),

  complete: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.completeBooking(req.user!.sub, req.params.id as string);
    sendSuccess(res, { booking }, 'Booking marked as completed');
  }),
};
