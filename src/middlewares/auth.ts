import { type MiddlewareHandler } from 'hono';
import env from '../env.js';

export const auth: MiddlewareHandler = async (c, next) => {
  if (!env.HONO_INTERNAL_API_KEY) {
    console.error('API key not configured on server. Denying request.');
    return c.json(
      { error: 'Server configuration error: API key missing' },
      500
    );
  }
  const apiKey = c.req.header('X-Internal-API-Key');

  if (!apiKey) {
    return c.json({ error: 'Unauthorized: API key missing' }, 401);
  }
  if (apiKey !== env.HONO_INTERNAL_API_KEY) {
    return c.json({ error: 'Unauthorized: Invalid API key' });
  }

  await next();
};
