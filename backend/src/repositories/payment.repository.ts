import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

export const paymentRepository = {
  create(data: Prisma.PaymentUncheckedCreateInput) {
    return prisma.payment.create({ data });
  },

  findById(id: string) {
    return prisma.payment.findUnique({ where: { id } });
  },

  findByOrderId(razorpayOrderId: string) {
    return prisma.payment.findUnique({ where: { razorpayOrderId } });
  },

  findPaidPaymentForBooking(bookingId: string) {
    return prisma.payment.findFirst({ where: { bookingId, status: 'PAID' } });
  },

  markPaid(id: string, razorpayPaymentId: string, razorpaySignature: string) {
    return prisma.payment.update({
      where: { id },
      data: { status: 'PAID', razorpayPaymentId, razorpaySignature },
    });
  },

  markFailed(id: string, failureReason: string) {
    return prisma.payment.update({
      where: { id },
      data: { status: 'FAILED', failureReason },
    });
  },

  async findMany(params: { userId: string; page: number; limit: number }) {
    const { userId, page, limit } = params;
    const where: Prisma.PaymentWhereInput = { userId };

    const [items, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return { items, total };
  },

  /** Admin monitoring — every payment, not scoped to a single user. */
  async adminList(params: { page: number; limit: number; status?: Prisma.PaymentWhereInput['status'] }) {
    const { page, limit, status } = params;
    const where: Prisma.PaymentWhereInput = status ? { status } : {};

    const [items, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return { items, total };
  },

  async sumPaidAmount(): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  },
};
