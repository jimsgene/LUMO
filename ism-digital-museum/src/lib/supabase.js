import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(url && key);
if (!isSupabaseConfigured) {
  console.error('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing in .env; restart "npm run dev" after adding them.');
}

// A placeholder keeps the app rendering (instead of a blank page) when .env is missing.
export const supabase = createClient(
  isSupabaseConfigured ? url : 'http://supabase-not-configured.invalid',
  isSupabaseConfigured ? key : 'missing-anon-key',
);
