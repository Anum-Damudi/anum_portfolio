import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { EventInput } from '../validators/events.validator.js';

export const logEvent = async (
  req: Request<{}, {}, EventInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, path } = req.body;
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Privacy-first: no cookies, no user agents, no IP addresses stored
    await prisma.analyticsEvent.create({
      data: {
        type,
        path: path || null,
        date,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Event logged',
    });
  } catch (error) {
    next(error);
  }
};