import { createClient } from '@supabase/supabase-js';
import env from '../../env.js';

export async function createSupabaseClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
}
