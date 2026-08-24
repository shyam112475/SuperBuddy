import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  update(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id: userId }, data });
  },

  updateProfileImage(userId: string, profileImage: string | null) {
    return prisma.user.update({ where: { id: userId }, data: { profileImage } });
  },

  softDelete(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false, deletedAt: new Date() },
    });
  },

  async findAdminIds(): Promise<string[]> {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });
    return admins.map((a: { id: string }) => a.id);
  },

  async adminSearch(params: {
    page: number;
    limit: number;
    search?: string;
    role?: Prisma.UserWhereInput['role'];
    verificationStatus?: Prisma.UserWhereInput['verificationStatus'];
    isActive?: boolean;
  }) {
    const { page, limit, search, role, verificationStatus, isActive } = params;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(verificationStatus ? { verificationStatus } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async countByRole() {
    const [totalUsers, totalPartners, totalAdmins] = await prisma.$transaction([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'PARTNER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);
    return { totalUsers, totalPartners, totalAdmins };
  },
};
