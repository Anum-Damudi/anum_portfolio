import { Router } from 'express';
import {
  getProjects,
  getSkills,
  getAchievements,
  getExperiments,
} from '../controllers/content.controller.js';

const router = Router();

router.get('/projects', getProjects);
router.get('/skills', getSkills);
router.get('/achievements', getAchievements);
router.get('/experiments', getExperiments);

export default router;
