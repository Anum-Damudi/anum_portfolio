import { Router } from 'express';
import { getCurrently } from '../controllers/currently.controller.js';

const router = Router();

router.get('/', getCurrently);

export default router;
