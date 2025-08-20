import express, { type Express } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { registerRoutes } from './routes';

// Create Express app
const app: Express = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Supabase clients: anon (reads) and admin (writes)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAnon = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null as any;
const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey) ? createClient(supabaseUrl, supabaseServiceRoleKey) : null as any;

// Diagnostics endpoint
app.get('/api/db-diagnostics', async (_req, res) => {
  try {
    if (!supabaseAnon) return res.status(503).json({ ok: false, error: 'db_unavailable' });
    const checks: any = { url: !!supabaseUrl, anon: !!supabaseAnonKey, service: !!supabaseServiceRoleKey };
    const { data: tables } = await supabaseAnon.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    checks.tables = (tables || []).map((t: any) => t.table_name);
    res.json({ ok: true, checks });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: 'diagnostics_failed', details: String(e?.message || e) });
  }
});

// Admin write: create/update user profile (schema-flexible: id or user_id)
app.post('/api/user-profile', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
    const user_id: string = String(req.body?.user_id || '').trim();
    const email: string | null = (req.body?.email ?? null) as any;
    const full_name: string | null = (req.body?.full_name ?? null) as any;
    const avatar_url: string | null = (req.body?.avatar_url ?? null) as any;
    if (!user_id) return res.status(400).json({ error: 'missing_user_id' });

    // Attempt upsert using id (most common schema)
    const attempt1 = await supabaseAdmin
      .from('user_profiles')
      .upsert({ id: user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() }, { onConflict: 'id' })
      .select()
      .single();
    if (!attempt1.error && attempt1.data) {
      return res.json(attempt1.data);
    }

    // Fallback: upsert using user_id shape
    const attempt2 = await supabaseAdmin
      .from('user_profiles')
      .upsert({ user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();
    if (!attempt2.error && attempt2.data) {
      return res.json(attempt2.data);
    }

    console.error('profile_upsert_failed', { a1: attempt1.error, a2: attempt2.error });
    return res.status(500).json({ error: 'profile_upsert_failed', details: { message: String(attempt2.error?.message || attempt1.error?.message || '') } });
  } catch (e: any) {
    console.error('profile_upsert_exception', e);
    res.status(500).json({ error: 'profile_upsert_failed', details: { message: String(e?.message || e) } });
  }
});

// Admin write: upsert user progress (composite key user_id+plan_id)
app.post('/api/user-progress', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
    const user_id: string = String(req.body?.user_id || '').trim();
    const plan_id: string = String(req.body?.plan_id || '').trim();
    const completed_days: number[] = Array.isArray(req.body?.completed_days) ? req.body.completed_days : [];
    const current_day: number = Number(req.body?.current_day || 1);
    if (!user_id || !plan_id) return res.status(400).json({ error: 'missing_params' });

    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .upsert(
        { user_id, plan_id, completed_days, current_day, last_accessed_at: new Date().toISOString() },
        { onConflict: 'user_id,plan_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('user_progress_upsert_failed', error);
      return res.status(500).json({ error: 'progress_save_failed', details: { message: String(error.message || '') } });
    }
    res.json(data);
  } catch (e: any) {
    console.error('user_progress_exception', e);
    res.status(500).json({ error: 'progress_save_failed', details: { message: String(e?.message || e) } });
  }
});

// Admin write: save hobby plan (support hobby or hobby_name)
app.post('/api/hobby-plans', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
    const { user_id, hobby, hobby_name, title, overview, plan_data } = req.body || {};
    const base = { user_id, title, overview, plan_data } as any;
    if (hobby_name || hobby) base.hobby = hobby_name || hobby;

    // Try flexible insert handling both schemas (hobby or hobby_name)
    let { data, error } = await supabaseAdmin.from('hobby_plans').insert(base).select().single();
    if (error && String(error.message || '').toLowerCase().includes('column') && String(error.message || '').toLowerCase().includes('does not exist')) {
      // Retry with hobby_name column
      const alt = { user_id, hobby_name: hobby_name || hobby, title, overview, plan_data } as any;
      const retry = await supabaseAdmin.from('hobby_plans').insert(alt).select().single();
      data = retry.data; error = retry.error as any;
    }

    if (error) {
      console.error('hobby_plan_save_failed', error);
      return res.status(500).json({ error: 'save_failed', details: { message: String(error.message || '') } });
    }
    res.json(data);
  } catch (e: any) {
    console.error('hobby_plan_exception', e);
    res.status(500).json({ error: 'save_failed', details: { message: String(e?.message || e) } });
  }
});

// Admin delete: hobby plan
app.delete('/api/hobby-plans/:id', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.json({ success: true });
    const id = req.params.id;
    const { error } = await supabaseAdmin.from('hobby_plans').delete().eq('id', id);
    if (error) console.error('hobby_plan_delete_failed', error);
    res.json({ success: !error });
  } catch {
    res.json({ success: true });
  }
});

// Register the rest of the routes (generate-plan, chat, GET plans, etc.)
// Define our admin routes first so they take precedence if duplicates exist.
void registerRoutes(app);

// Export the app for Vercel @vercel/node
export default app;

