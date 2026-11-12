import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(
    {
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    'Request error occurred'
  );

  // 1. AppError custom exceptions
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // 2. Prisma specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `A record with this ${target} already exists.`,
        },
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          code: 'RECORD_NOT_FOUND',
          message: 'The requested record was not found.',
        },
      });
      return;
    }
  }

  // 3. Fallback for unhandled server errors
  const isDev = env.NODE_ENV === 'development';
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? err.message : 'An internal server error occurred',
      ...(isDev && { stack: err.stack }),
    },
  });
};
