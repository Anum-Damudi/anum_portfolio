import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const isTest = env.NODE_ENV === 'test';

const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  code: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: isTest ? 1000 : options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: {
          code: options.code,
          message: options.message,
        },
      });
    },
  });
};

// 1. Strict Contact Form Rate Limiting: 5 requests / hour / IP
export const contactRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  code: 'CONTACT_RATE_LIMIT_EXCEEDED',
  message: 'Too many contact messages sent from this IP. Please try again after an hour.',
});

// 2. Guestbook Rate Limiting: 5 requests / hour / IP
export const guestbookRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  code: 'GUESTBOOK_RATE_LIMIT_EXCEEDED',
  message: 'Too many guestbook entries submitted from this IP. Please try again after an hour.',
});

// 3. Admin Login Rate Limiting: 5 attempts / 15 minutes / IP
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'LOGIN_RATE_LIMIT_EXCEEDED',
  message: 'Too many login attempts. Please wait 15 minutes before trying again.',
});

// 4. Analytics Events Rate Limiting: 60 events / minute / IP
export const eventsRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  code: 'EVENTS_RATE_LIMIT_EXCEEDED',
  message: 'Event submission threshold reached.',
});
