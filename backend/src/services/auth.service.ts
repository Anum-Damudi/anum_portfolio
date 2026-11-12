import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env.js';
import { AdminPayload } from '../types/index.js';

const COOKIE_NAME = 'admin_token';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static signToken(payload: AdminPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  static verifyToken(token: string): AdminPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    } catch {
      return null;
    }
  }

  static setAuthCookie(res: Response, token: string): void {
    const isProd = env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  static clearAuthCookie(res: Response): void {
    const isProd = env.NODE_ENV === 'production';
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
  }
}
export { COOKIE_NAME };
