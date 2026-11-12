import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../services/prisma.service.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadCv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // 1. Log cv_download event asynchronously
    prisma.analyticsEvent
      .create({
        data: {
          type: 'cv_download',
          path: '/api/cv',
          date: today,
        },
      })
      .catch((err) => {
        logger.error({ err }, 'Failed to record cv_download analytics event');
      });

    // 2. Resolve CV PDF file path
    const cvPath = path.resolve(__dirname, '../../assets/cv.pdf');

    if (fs.existsSync(cvPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Anum_Resume.pdf"');
      res.sendFile(cvPath);
      return;
    }

    // 3. Fallback: If no PDF is yet uploaded, return a valid minimal PDF buffer
    const minimalPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Anum_Resume.pdf"');
    res.send(minimalPdf);
  } catch (error) {
    next(error);
  }
};
