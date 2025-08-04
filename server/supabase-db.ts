import { createClient } from '@supabase/supabase-js';

// Use the same Supabase instance as frontend
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY; // In production, use service role key

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables not found');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase backend client initialized');