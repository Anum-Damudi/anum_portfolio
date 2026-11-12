import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { cacheService } from '../services/cache.service.js';

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:projects';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    cacheService.set(cacheKey, projects, 5 * 60 * 1000); // 5 min TTL
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:skills';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    cacheService.set(cacheKey, skills, 5 * 60 * 1000);
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:achievements';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    cacheService.set(cacheKey, achievements, 5 * 60 * 1000);
    res.status(200).json(achievements);
  } catch (error) {
    next(error);
  }
};

export const getExperiments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'content:experiments';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const experiments = await prisma.experiment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    cacheService.set(cacheKey, experiments, 5 * 60 * 1000);
    res.status(200).json(experiments);
  } catch (error) {
    next(error);
  }
};
