import { prisma } from '../config/prisma';

export const serviceCategoryRepository = {
  findAllActive() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  },

  findById(id: string) {
    return prisma.serviceCategory.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return prisma.serviceCategory.findUnique({ where: { slug } });
  },
};
