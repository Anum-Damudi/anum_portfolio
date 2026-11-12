import { Router } from 'express';
import { logEvent } from '../controllers/events.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { eventSchema } from '../validators/events.validator.js';
import { eventsRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post('/', eventsRateLimiter, validate(eventSchema), logEvent);

export default router;
