import { blockRepository } from '../repositories/block.repository';
import { userRepository } from '../repositories/user.repository';
import { BadRequestError, NotFoundError } from '../utils/AppError';

export const blockService = {
  async blockUser(blockerId: string, blockedUserId: string) {
    if (blockerId === blockedUserId) {
      throw new BadRequestError("You can't block yourself");
    }

    const target = await userRepository.findById(blockedUserId);
    if (!target || target.deletedAt) {
      throw new NotFoundError('User not found');
    }

    // Idempotent — blocking someone already blocked just succeeds again
    // rather than erroring, since the caller's intent (this person can't
    // reach me) is already satisfied.
    await blockRepository.create(blockerId, blockedUserId).catch((err: unknown) => {
      const isDuplicate = typeof err === 'object' && err && 'code' in err && err.code === 'P2002';
      if (!isDuplicate) throw err;
    });
  },

  async unblockUser(blockerId: string, blockedUserId: string) {
    await blockRepository.delete(blockerId, blockedUserId);
  },

  async listMyBlocks(blockerId: string) {
    const blocks = await blockRepository.findMyBlocks(blockerId);
    return blocks.map((b: (typeof blocks)[number]) => ({
      id: b.id,
      blockedUser: b.blockedUser,
      createdAt: b.createdAt,
    }));
  },
};
