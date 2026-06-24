import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { authRouter } from './routes/auth.js';
import { toolsRouter } from './routes/tools.js';
import { categoriesRouter, tagsRouter } from './routes/categories.js';
import { pocsRouter } from './routes/pocs.js';
import { faqsRouter } from './routes/faqs.js';
import { trainingRouter } from './routes/training.js';
import { uploadsRouter, uploadsDir } from './routes/uploads.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'ai-hub-backend' }));

  app.use('/api/auth', authRouter);
  app.use('/api/tools', toolsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/tags', tagsRouter);
  app.use('/api/pocs', pocsRouter);
  app.use('/api/faqs', faqsRouter);
  app.use('/api/training', trainingRouter);
  app.use('/api/uploads', uploadsRouter);

  // Centralized error handler (e.g. multer errors)
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction
    ) => {
      res.status(400).json({ error: err.message || 'Unexpected error' });
    }
  );

  return app;
}
