import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { cacheService } from '../services/cache.service.js';
import { MusicService } from '../services/music.service.js';

export const getCurrently = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:currently';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    let currently = await prisma.currently.findUnique({
      where: { id: 'current' },
    });

    if (!currently) {
      currently = {
        id: 'current',
        learning: 'Distributed systems & compiler design',
        building: 'Portfolio backend API & Numi mascot',
        listeningTo: 'Lo-Fi Chill Beats',
        updatedAt: new Date(),
      };
    }

    // Optional real-time music integration
    const liveTrack = await MusicService.getCurrentListeningTrack();
    const result = {
      learning: currently.learning,
      building: currently.building,
      listeningTo: liveTrack || currently.listeningTo,
      isLiveMusic: Boolean(liveTrack),
      updatedAt: currently.updatedAt,
    };

    cacheService.set(cacheKey, result, 2 * 60 * 1000); // 2 min TTL
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
