import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are in your .env file.');
  process.exit(1);
}

// Default client — used for auth verification (middleware)
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Returns a Supabase client that acts on behalf of a specific user.
 * This satisfies RLS policies (auth.uid() = user_id) for INSERT / UPDATE / DELETE.
 *
 * @param accessToken  The user's JWT access token from the Authorization header
 */
export const supabaseAsUser = (accessToken: string) =>
  createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
