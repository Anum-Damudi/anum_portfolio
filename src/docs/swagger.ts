import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './openapi.js';

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      customSiteTitle: "Anum's Portfolio API Docs",
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );
};
