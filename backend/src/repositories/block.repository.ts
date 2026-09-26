import { prisma } from '../config/prisma';

export const blockRepository = {
  create(blockerId: string, blockedUserId: string) {
    return prisma.block.create({ data: { blockerId, blockedUserId } });
  },

  delete(blockerId: string, blockedUserId: string) {
    return prisma.block.deleteMany({ where: { blockerId, blockedUserId } });
  },

  findMyBlocks(blockerId: string) {
    return prisma.block.findMany({
      where: { blockerId },
      include: { blockedUser: { select: { id: true, fullName: true, profileImage: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * True if either user has blocked the other — direction doesn't matter
   * for enforcement purposes (see chat.service.ts / booking.service.ts):
   * if A blocked B, B shouldn't be able to message or book A either.
   */
  async existsEitherDirection(userIdA: string, userIdB: string): Promise<boolean> {
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userIdA, blockedUserId: userIdB },
          { blockerId: userIdB, blockedUserId: userIdA },
        ],
      },
      select: { id: true },
    });
    return Boolean(block);
  },
};
