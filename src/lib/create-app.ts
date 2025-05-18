import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { auth } from '../middlewares/auth.js';
import { corsMiddleware } from '../middlewares/cors.js';
import processRoutes from '../routes/process.route.js';

export function createRouter() {
  return new Hono({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use('*', corsMiddleware);
  app.use('*', auth);
  app.use(logger());

  app.route('/api/images', processRoutes);

  app.get('/', (c) => {
    return c.json(
      {
        message: 'Bikini Grad School Image Processing Service is running!',
      },
      200
    );
  });

  app.notFound((c) => {
    return c.json(
      {
        message: `404 Not Found - ${c.req.path}`,
      },
      400
    );
  });

  app.onError((err, c) => {
    console.error('Error: ', err);
    return c.json(
      {
        message: `500 Internal Server Error`,
      },
      500
    );
  });

  return app;
}
