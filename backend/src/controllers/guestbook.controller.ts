import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { cacheService } from '../services/cache.service.js';
import { FilterService } from '../services/filter.service.js';
import { GuestbookInput } from '../validators/guestbook.validator.js';

export const getGuestbook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:guestbook';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const entries = await prisma.guestbookEntry.findMany({
      where: { status: 'approved' },
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
        approvedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    cacheService.set(cacheKey, entries, 60 * 1000); // 1 minute TTL
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const createGuestbookEntry = async (
  req: Request<{}, {}, GuestbookInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, message } = req.body;

    // 1. Evaluate name and message against profanity / spam filter
    const nameCheck = FilterService.evaluateText(name);
    if (!nameCheck.isClean) {
      res.status(400).json({
        error: {
          code: 'INAPPROPRIATE_CONTENT',
          message: `Name rejected: ${nameCheck.reason}`,
        },
      });
      return;
    }

    const messageCheck = FilterService.evaluateText(message);
    if (!messageCheck.isClean) {
      res.status(400).json({
        error: {
          code: 'INAPPROPRIATE_CONTENT',
          message: `Message rejected: ${messageCheck.reason}`,
        },
      });
      return;
    }

    // 2. Persist with status 'pending'
    const entry = await prisma.guestbookEntry.create({
      data: {
        name,
        message,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for signing the guestbook! Your note is pending moderation by Anum.',
      data: {
        id: entry.id,
        name: entry.name,
        message: entry.message,
        status: entry.status,
        createdAt: entry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
