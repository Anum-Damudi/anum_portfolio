import { Router } from 'express';
import {
  login,
  logout,
  getMe,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  updateCurrently,
  getAllNumiLines,
  createNumiLine,
  deleteNumiLine,
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
  getAllGuestbookEntries,
  updateGuestbookStatus,
  deleteGuestbookEntry,
  getStats,
} from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';
import { adminLoginSchema } from '../validators/admin.validator.js';
import {
  projectSchema,
  projectUpdateSchema,
  skillSchema,
  skillUpdateSchema,
  achievementSchema,
  achievementUpdateSchema,
  experimentSchema,
  experimentUpdateSchema,
} from '../validators/content.validator.js';
import { currentlyUpdateSchema } from '../validators/currently.validator.js';
import { numiLineSchema } from '../validators/numi.validator.js';
import { guestbookStatusSchema } from '../validators/guestbook.validator.js';

const router = Router();

// ==========================================
// Authentication Routes
// ==========================================
router.post('/auth/login', authRateLimiter, validate(adminLoginSchema), login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAdmin, getMe);

// ==========================================
// Protected Management Routes
// ==========================================
router.use(requireAdmin);

// Projects
router.post('/projects', validate(projectSchema), createProject);
router.put('/projects/:id', validate(projectUpdateSchema), updateProject);
router.delete('/projects/:id', deleteProject);

// Skills
router.post('/skills', validate(skillSchema), createSkill);
router.put('/skills/:id', validate(skillUpdateSchema), updateSkill);
router.delete('/skills/:id', deleteSkill);

// Achievements
router.post('/achievements', validate(achievementSchema), createAchievement);
router.put('/achievements/:id', validate(achievementUpdateSchema), updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Experiments
router.post('/experiments', validate(experimentSchema), createExperiment);
router.put('/experiments/:id', validate(experimentUpdateSchema), updateExperiment);
router.delete('/experiments/:id', deleteExperiment);

// "Currently" Widget
router.put('/currently', validate(currentlyUpdateSchema), updateCurrently);

// Numi Lines
router.get('/numi/lines', getAllNumiLines);
router.post('/numi/lines', validate(numiLineSchema), createNumiLine);
router.delete('/numi/lines/:id', deleteNumiLine);

// Contact Inquiries
router.get('/contacts', getContactMessages);
router.patch('/contacts/:id/read', markContactAsRead);
router.delete('/contacts/:id', deleteContactMessage);

// Guestbook Moderation
router.get('/guestbook', getAllGuestbookEntries);
router.patch('/guestbook/:id/status', validate(guestbookStatusSchema), updateGuestbookStatus);
router.delete('/guestbook/:id', deleteGuestbookEntry);

// Analytics Stats
router.get('/stats', getStats);

export default router;
