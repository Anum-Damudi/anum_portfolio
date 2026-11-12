import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { AuthService } from '../services/auth.service.js';
import { cacheService } from '../services/cache.service.js';
import { AuthenticatedRequest } from '../types/index.js';

// ==========================================
// 1. Admin Authentication
// ==========================================
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
      return;
    }

    const isValidPassword = await AuthService.comparePassword(password, admin.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
      return;
    }

    const token = AuthService.signToken({ id: admin.id, email: admin.email });
    AuthService.setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token, // Also return in body for mobile or testing convenience
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  AuthService.clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(200).json({
    admin: req.user,
  });
};

// ==========================================
// 2. Projects CRUD
// ==========================================
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    cacheService.del('content:projects');
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    cacheService.del('content:projects');
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    cacheService.del('content:projects');
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. Skills CRUD
// ==========================================
export const createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await prisma.skill.create({
      data: req.body,
    });
    cacheService.del('content:skills');
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await prisma.skill.update({
      where: { id },
      data: req.body,
    });
    cacheService.del('content:skills');
    res.status(200).json(skill);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    cacheService.del('content:skills');
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. Achievements CRUD
// ==========================================
export const createAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const achievement = await prisma.achievement.create({
      data: req.body,
    });
    cacheService.del('content:achievements');
    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const achievement = await prisma.achievement.update({
      where: { id },
      data: req.body,
    });
    cacheService.del('content:achievements');
    res.status(200).json(achievement);
  } catch (error) {
    next(error);
  }
};

export const deleteAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.achievement.delete({ where: { id } });
    cacheService.del('content:achievements');
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. Experiments CRUD
// ==========================================
export const createExperiment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiment = await prisma.experiment.create({
      data: req.body,
    });
    cacheService.del('content:experiments');
    res.status(201).json(experiment);
  } catch (error) {
    next(error);
  }
};

export const updateExperiment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const experiment = await prisma.experiment.update({
      where: { id },
      data: req.body,
    });
    cacheService.del('content:experiments');
    res.status(200).json(experiment);
  } catch (error) {
    next(error);
  }
};

export const deleteExperiment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.experiment.delete({ where: { id } });
    cacheService.del('content:experiments');
    res.status(200).json({ success: true, message: 'Experiment deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. Currently Status
// ==========================================
export const updateCurrently = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currently = await prisma.currently.upsert({
      where: { id: 'current' },
      update: req.body,
      create: {
        id: 'current',
        ...req.body,
      },
    });
    cacheService.del('content:currently');
    res.status(200).json(currently);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. Numi Mascot Lines
// ==========================================
export const getAllNumiLines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lines = await prisma.numiLine.findMany({
      orderBy: [{ section: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json(lines);
  } catch (error) {
    next(error);
  }
};

export const createNumiLine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const line = await prisma.numiLine.create({
      data: {
        section: req.body.section.toLowerCase(),
        line: req.body.line,
      },
    });
    res.status(201).json(line);
  } catch (error) {
    next(error);
  }
};

export const deleteNumiLine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.numiLine.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Numi line deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. Contact Form Inquiries
// ==========================================
export const getContactMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const markContactAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. Guestbook Moderation
// ==========================================
export const getAllGuestbookEntries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const whereClause = status && typeof status === 'string' ? { status: status as any } : {};

    const entries = await prisma.guestbookEntry.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const updateGuestbookStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const entry = await prisma.guestbookEntry.update({
      where: { id },
      data: {
        status,
        approvedAt: status === 'approved' ? new Date() : null,
      },
    });

    cacheService.del('content:guestbook');
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteGuestbookEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.guestbookEntry.delete({ where: { id } });
    cacheService.del('content:guestbook');
    res.status(200).json({ success: true, message: 'Guestbook entry deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 10. Privacy Analytics Stats
// ==========================================
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Overall counts by event type
    const pageViewsCount = await prisma.analyticsEvent.count({
      where: { type: 'page_view' },
    });
    const easterEggCount = await prisma.analyticsEvent.count({
      where: { type: 'easter_egg' },
    });
    const cvDownloadCount = await prisma.analyticsEvent.count({
      where: { type: 'cv_download' },
    });

    // 2. Daily breakdown for the last 30 days
    const eventsByDate = await prisma.analyticsEvent.groupBy({
      by: ['date', 'type'],
      _count: {
        id: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 90,
    });

    // 3. Top paths
    const topPaths = await prisma.analyticsEvent.groupBy({
      by: ['path'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    res.status(200).json({
      totals: {
        pageViews: pageViewsCount,
        easterEggsFound: easterEggCount,
        cvDownloads: cvDownloadCount,
        totalEvents: pageViewsCount + easterEggCount + cvDownloadCount,
      },
      dailyEvents: eventsByDate.map((e) => ({
        date: e.date,
        type: e.type,
        count: e._count.id,
      })),
      topPaths: topPaths.map((p) => ({
        path: p.path,
        count: p._count.id,
      })),
    });
  } catch (error) {
    next(error);
  }
};
