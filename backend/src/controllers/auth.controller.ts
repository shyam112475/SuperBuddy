import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookies';
import { UnauthorizedError } from '../utils/AppError';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants/auth.constants';
import { asyncHandler } from '../utils/asyncHandler';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body, req.ip);
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken }, 'Account created successfully', 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body, req.ip);
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken }, 'Logged in successfully');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const incomingToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (!incomingToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    const { user, accessToken, refreshToken } = await authService.refresh(incomingToken, req.ip);
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, { user, accessToken }, 'Token refreshed successfully');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const incomingToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (incomingToken) {
      await authService.logout(incomingToken);
    }
    clearRefreshTokenCookie(res);
    sendSuccess(res, null, 'Logged out successfully');
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    // Deliberately generic message — don't reveal whether the email exists.
    sendSuccess(res, null, 'If an account with that email exists, a reset link has been sent');
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    sendSuccess(res, null, 'Password reset successfully. Please log in with your new password');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.sub);
    sendSuccess(res, { user }, 'Current user retrieved');
  }),
};
