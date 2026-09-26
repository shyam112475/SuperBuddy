import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';
import { clearRefreshTokenCookie } from '../utils/cookies';
import { BadRequestError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const userController = {
  getMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getMe(req.user!.sub);
    sendSuccess(res, { user }, 'Profile retrieved');
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.sub, req.body);
    sendSuccess(res, { user }, 'Profile updated successfully');
  }),

  updateProfileImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }
    const user = await userService.updateProfileImage(req.user!.sub, req.file);
    sendSuccess(res, { user }, 'Profile image updated successfully');
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await userService.changePassword(
      req.user!.sub,
      req.body.currentPassword,
      req.body.newPassword
    );
    // Password change revokes all sessions server-side; clear this
    // browser's cookie too so it doesn't hold a now-dead refresh token.
    clearRefreshTokenCookie(res);
    sendSuccess(res, null, 'Password changed successfully. Please log in again.');
  }),

  deleteMe: asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteAccount(req.user!.sub);
    clearRefreshTokenCookie(res);
    sendSuccess(res, null, 'Account deactivated successfully');
  }),
};
