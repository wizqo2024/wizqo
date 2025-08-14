import { createClient } from '@supabase/supabase-js';

// Use the same Supabase instance as frontend
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Prefer secure service role key in server
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
	|| process.env.VITE_SUPABASE_SERVICE_ROLE_KEY 
	|| process.env.VITE_SUPABASE_ANON_KEY; // fallback only if service key not set

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