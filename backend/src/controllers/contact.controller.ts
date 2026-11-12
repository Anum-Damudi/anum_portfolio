import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service.js';
import { EmailService } from '../services/email.service.js';
import { ContactInput } from '../validators/contact.validator.js';
import { logger } from '../utils/logger.js';

export const handleContact = async (
  req: Request<{}, {}, ContactInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, message, website } = req.body;

    // 1. Honeypot check: If the hidden 'website' field is populated, bot was detected!
    if (website && website.trim().length > 0) {
      logger.warn({ ip: req.ip, website }, 'Honeypot triggered by bot submission. Discarded silently.');
      // Return fake success to confuse the bot
      res.status(200).json({
        success: true,
        message: 'Message sent successfully',
      });
      return;
    }

    // 2. Persist genuine contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    // 3. Dispatch email notification to Anum
    // Run asynchronously without blocking response
    EmailService.sendContactNotification({ name, email, message }).catch((err) => {
      logger.error({ err, contactId: contactMessage.id }, 'Background email notification failed');
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contactMessage.id,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
