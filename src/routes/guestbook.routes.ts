import { Router } from 'express';
import { getGuestbook, createGuestbookEntry } from '../controllers/guestbook.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { guestbookSchema } from '../validators/guestbook.validator.js';
import { guestbookRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.get('/', getGuestbook);
router.post('/', guestbookRateLimiter, validate(guestbookSchema), createGuestbookEntry);

export default router;
