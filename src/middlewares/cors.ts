import { cors } from 'hono/cors';
import env from '../env.js';

const allowedOrigins = [env.FRONTEND_URL];

export const corsMiddleware = cors({
  origin: (origin, c) => {
    if (!origin) {
      return origin;
    }
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    console.warn(`CORS: Origin ${origin} not allowed.`);
    return undefined;
  },
  allowHeaders: ['X-Internal-API-Key', 'Content-Type', 'Authorization'],
  allowMethods: ['POST'],
  credentials: true,
  maxAge: 86400,
});
