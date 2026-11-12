import { Router } from 'express';
import { downloadCv } from '../controllers/cv.controller.js';

const router = Router();

router.get('/', downloadCv);

export default router;
