import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';

export const getNumiLine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { section } = req.query;

    const whereClause = section && typeof section === 'string'
      ? { section: section.toLowerCase() }
      : {};

    const lines = await prisma.numiLine.findMany({
      where: whereClause,
    });

    if (lines.length === 0) {
      // Fallback default witty line if section has no specific line
      res.status(200).json({
        section: (section as string) || 'general',
        line: "Hi there! I'm Numi, Anum's pixel companion. Everything looks good from down here!",
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * lines.length);
    const selected = lines[randomIndex];

    res.status(200).json({
      id: selected.id,
      section: selected.section,
      line: selected.line,
    });
  } catch (error) {
    next(error);
  }
};
