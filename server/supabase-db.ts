import { createClient } from '@supabase/supabase-js';

// Use the same Supabase instance as frontend
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; // Prefer service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase environment variables not found. Database operations will fail.');
}

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null as any;

console.log('✅ Supabase backend client initialized');