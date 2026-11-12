import { Router } from 'express';
import { handleContact } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { contactSchema } from '../validators/contact.validator.js';
import { contactRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Strict rate limit: 5 requests / hour / IP
router.post('/', contactRateLimiter, validate(contactSchema), handleContact);

export default router;
