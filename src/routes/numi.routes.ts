import { Router } from 'express';
import { getNumiLine } from '../controllers/numi.controller.js';

const router = Router();

router.get('/lines', getNumiLine);

export default router;
