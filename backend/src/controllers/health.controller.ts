import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';

export const getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verify database connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      service: 'anum-portfolio-backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
};
