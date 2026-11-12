import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AuthService, COOKIE_NAME } from '../services/auth.service.js';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  // 1. Check httpOnly cookie
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  // 2. Fallback to Authorization: Bearer <token>
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token missing. Please log in as admin.',
      },
    });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication token. Please log in again.',
      },
    });
    return;
  }

  req.user = payload;
  next();
};
