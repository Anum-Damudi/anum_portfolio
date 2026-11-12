import { Router } from 'express';
import healthRoutes from './health.routes.js';
import contentRoutes from './content.routes.js';
import currentlyRoutes from './currently.routes.js';
import numiRoutes from './numi.routes.js';
import contactRoutes from './contact.routes.js';
import guestbookRoutes from './guestbook.routes.js';
import eventsRoutes from './events.routes.js';
import cvRoutes from './cv.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/', contentRoutes); // /projects, /skills, /achievements, /experiments
apiRouter.use('/currently', currentlyRoutes);
apiRouter.use('/numi', numiRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/guestbook', guestbookRoutes);
apiRouter.use('/events', eventsRoutes);
apiRouter.use('/cv', cvRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
