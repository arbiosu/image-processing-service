import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z, type ZodError } from 'zod';

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3010),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  HONO_INTERNAL_API_KEY: z.string(),
  FRONTEND_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (err) {
  const error = err as ZodError;
  console.error('Invalid env', error.flatten());
  process.exit(1);
}

export default env;
