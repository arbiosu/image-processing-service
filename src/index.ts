import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import createApp from './lib/create-app.js';
import env from './env.js';

const PORT = env.PORT;

const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
