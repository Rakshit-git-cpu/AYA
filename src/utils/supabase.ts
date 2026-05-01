import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.');
}

export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseAnonKey || 'dummy-key',
  {
    auth: {
      // Disable session persistence — avoids Safari ITP / third-party cookie issues
      persistSession: false,
      autoRefreshToken: false,
      // Prevents Supabase from reading tokens from URL hash (not needed for anon DB access)
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    db: {
      schema: 'public',
    },
  }
);
