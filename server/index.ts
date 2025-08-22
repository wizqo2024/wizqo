import express, { type Express } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
// We inline key API routes here to avoid module resolution issues on Vercel

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
// NOTE: If you see RLS policy errors, you need to either:
// 1) Disable RLS on user_profiles table: ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
// 2) Or create a policy that allows service role: CREATE POLICY "service_role_all" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
app.post('/api/user-profile', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
    const user_id: string = String(req.body?.user_id || '').trim();
    const email: string | null = (req.body?.email ?? null) as any;
    const full_name: string | null = (req.body?.full_name ?? null) as any;
    const avatar_url: string | null = (req.body?.avatar_url ?? null) as any;
    if (!user_id) return res.status(400).json({ error: 'missing_user_id' });

    // Optional: inspect table columns to tailor the write
    let profileColumns: string[] = [];
    try {
      if (supabaseAnon) {
        const cols = await supabaseAnon
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'user_profiles');
        profileColumns = (cols.data as any[] | null)?.map(c => c.column_name) || [];
      }
    } catch {}

    // 1) Try update by id
    const updateById = await supabaseAdmin
      .from('user_profiles')
      .update({ email, full_name, avatar_url, last_active_at: new Date().toISOString() })
      .eq('id', user_id)
      .select()
      .maybeSingle();
    if (updateById.data) return res.json(updateById.data);

    // 2) Try update by user_id
    const updateByUserId = await supabaseAdmin
      .from('user_profiles')
      .update({ email, full_name, avatar_url, last_active_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .select()
      .maybeSingle();
    if (updateByUserId.data) return res.json(updateByUserId.data);

    // 3) Try insert with id column
    const insertWithId = await supabaseAdmin
      .from('user_profiles')
      .insert({ id: user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() })
      .select()
      .single();
    if (!insertWithId.error && insertWithId.data) return res.json(insertWithId.data);

    // 4) Try insert with user_id column
    const insertWithUserId = await supabaseAdmin
      .from('user_profiles')
      .insert({ user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() })
      .select()
      .single();
    if (!insertWithUserId.error && insertWithUserId.data) return res.json(insertWithUserId.data);

    // 5) Final fallback: call Supabase REST API directly (service role)
    try {
      if (supabaseUrl && supabaseServiceRoleKey) {
        const baseHeaders: any = {
          'apikey': supabaseServiceRoleKey,
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'Content-Type': 'application/json'
        };

        // Check existing by id or user_id
        let existing: any = null;
        const checkById = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${encodeURIComponent(user_id)}&select=*`, { headers: baseHeaders });
        if (checkById.ok) {
          const arr = await checkById.json();
          if (Array.isArray(arr) && arr.length > 0) existing = arr[0];
        }
        if (!existing) {
          const checkByUserId = await fetch(`${supabaseUrl}/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(user_id)}&select=*`, { headers: baseHeaders });
          if (checkByUserId.ok) {
            const arr = await checkByUserId.json();
            if (Array.isArray(arr) && arr.length > 0) existing = arr[0];
          }
        }

        if (existing) {
          const patch = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${encodeURIComponent(existing.id || user_id)}&user_id=eq.${encodeURIComponent(existing.user_id || user_id)}`, {
            method: 'PATCH',
            headers: baseHeaders,
            body: JSON.stringify({ email, full_name, avatar_url, last_active_at: new Date().toISOString() })
          });
          const body = await patch.text();
          if (patch.ok) return res.json({ ...(existing || {}), email, full_name, avatar_url });
          console.error('profile_upsert_rest_patch_failed', patch.status, body);
        } else {
          // Insert by id first
          const ins1 = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
            method: 'POST', headers: { ...baseHeaders, Prefer: 'return=representation' },
            body: JSON.stringify({ id: user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() })
          });
          const body1 = await ins1.text();
          if (ins1.ok) return res.json(JSON.parse(body1)[0]);

          // Insert by user_id
          const ins2 = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
            method: 'POST', headers: { ...baseHeaders, Prefer: 'return=representation' },
            body: JSON.stringify({ user_id, email, full_name, avatar_url, last_active_at: new Date().toISOString() })
          });
          const body2 = await ins2.text();
          if (ins2.ok) return res.json(JSON.parse(body2)[0]);

          console.error('profile_upsert_rest_insert_failed', ins1.status, body1, ins2.status, body2);
        }
      }
    } catch (restErr) {
      console.error('profile_upsert_rest_exception', restErr);
    }

    console.error('profile_upsert_failed', { columns: profileColumns, updateByIdErr: updateById.error, updateByUserIdErr: updateByUserId.error, insertWithIdErr: insertWithId.error, insertWithUserIdErr: insertWithUserId.error });
    
    // All attempts failed - return error
    return res.status(500).json({ 
      error: 'profile_upsert_failed', 
      details: { 
        updateByIdErr: updateById.error,
        updateByUserIdErr: updateByUserId.error,
        insertWithIdErr: insertWithId.error,
        insertWithUserIdErr: insertWithUserId.error
      } 
    });
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

    // If plan_id is not a UUID (e.g., stub id), don't attempt DB write; return echo for UI
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(plan_id)) {
      return res.json({ user_id, plan_id, completed_days, current_day, last_accessed_at: new Date().toISOString(), stub: true });
    }

    // Inspect columns to avoid referencing non-existent fields (e.g., last_accessed_at)
    let progressColumns: string[] = [];
    try {
      if (supabaseAnon) {
        const cols = await supabaseAnon
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'user_progress');
        progressColumns = (cols.data as any[] | null)?.map(c => c.column_name) || [];
      }
    } catch {}
    const hasLastAccessed = progressColumns.includes('last_accessed_at');

    // Select then update/insert to avoid depending on composite unique constraint
    const existing = await supabaseAdmin
      .from('user_progress')
      .select('id')
      .eq('user_id', user_id)
      .eq('plan_id', plan_id)
      .maybeSingle();

    if (existing.data) {
      const updatePayload: any = { completed_days, current_day };
      if (hasLastAccessed) updatePayload.last_accessed_at = new Date().toISOString();
      const upd = await supabaseAdmin
        .from('user_progress')
        .update(updatePayload)
        .eq('user_id', user_id)
        .eq('plan_id', plan_id)
        .select()
        .single();
      if (upd.error) {
        console.error('user_progress_update_failed', upd.error);
        return res.status(500).json({ error: 'progress_save_failed', details: { message: String(upd.error.message || '') } });
      }
      return res.json(upd.data);
    } else {
      const insertPayload: any = { user_id, plan_id, completed_days, current_day };
      if (hasLastAccessed) insertPayload.last_accessed_at = new Date().toISOString();
      const ins = await supabaseAdmin
        .from('user_progress')
        .insert(insertPayload)
        .select()
        .single();
      if (ins.error) {
        console.error('user_progress_insert_failed', ins.error);
        return res.status(500).json({ error: 'progress_save_failed', details: { message: String(ins.error.message || '') } });
      }
      return res.json(ins.data);
    }
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
    const difficulty = (plan_data?.difficulty || plan_data?.level || null) as any;
    const total_days = Number(plan_data?.totalDays || (Array.isArray(plan_data?.days) ? plan_data.days.length : null)) || 7;

    const base = { user_id, title, overview, plan_data, difficulty, total_days } as any;
    if (hobby_name || hobby) base.hobby = hobby_name || hobby;

    // Try flexible insert handling both schemas (hobby or hobby_name)
    // Use service role to bypass RLS policies
    const first = await supabaseAdmin.from('hobby_plans').insert(base).select().single();
    if (!first.error && first.data) return res.json(first.data);

    const alt = { user_id, hobby_name: hobby_name || hobby, title, overview, plan_data, difficulty, total_days } as any;
    const second = await supabaseAdmin.from('hobby_plans').insert(alt).select().single();
    if (!second.error && second.data) return res.json(second.data);

    // Final fallback: REST API using service role
    try {
      if (supabaseUrl && supabaseServiceRoleKey) {
        const baseHeaders: any = {
          'apikey': supabaseServiceRoleKey,
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        };
        // Attempt with hobby column
        const r1 = await fetch(`${supabaseUrl}/rest/v1/hobby_plans`, {
          method: 'POST', headers: baseHeaders, body: JSON.stringify(base)
        });
        const t1 = await r1.text();
        if (r1.ok) return res.json(JSON.parse(t1)[0]);
        // Attempt with hobby_name column
        const r2 = await fetch(`${supabaseUrl}/rest/v1/hobby_plans`, {
          method: 'POST', headers: baseHeaders, body: JSON.stringify(alt)
        });
        const t2 = await r2.text();
        if (r2.ok) return res.json(JSON.parse(t2)[0]);
        console.error('hobby_plan_rest_failed', r1.status, t1, r2.status, t2);
      }
    } catch (restErr) {
      console.error('hobby_plan_rest_exception', restErr);
    }

    // Include table columns for debugging
    let planColumns: string[] = [];
    try {
      if (supabaseAnon) {
        const cols = await supabaseAnon
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'hobby_plans');
        planColumns = (cols.data as any[] | null)?.map(c => c.column_name) || [];
      }
    } catch {}

    console.error('hobby_plan_save_failed', { columns: planColumns, first: first.error, second: second.error });
    // Return a stub response so UI can continue; saving can be retried later
    return res.json({ id: `stub_${Date.now()}`, user_id, hobby: hobby || hobby_name, title, overview, plan_data, created_at: new Date().toISOString(), stub: true });
  } catch (e: any) {
    console.error('hobby_plan_exception', e);
    res.status(500).json({ error: 'save_failed', details: { message: String(e?.message || e) } });
  }
});

// Read progress for a user
app.get('/api/user-progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!supabaseAnon) return res.json([]);
    const { data, error } = await supabaseAnon
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) return res.json([]);
    res.json(data || []);
  } catch { res.json([]); }
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

// --- AI Plan Generation and Chat ---
async function generatePlanViaOpenRouter(hobby: string, experience: string, timeAvailable: string, goal: string) {
  const key = process.env.OPENROUTER_API_KEY as string;
  if (!key) throw new Error('missing_openrouter_key');
  // Smart hobby parsing - handle multi-word hobbies like "reading quran"
  const smartHobby = hobby.toLowerCase().includes('reading') && hobby.toLowerCase().includes('quran') 
    ? 'quran reading' 
    : hobby.toLowerCase().includes('reading') && hobby.toLowerCase().includes('book')
    ? 'book reading'
    : hobby.toLowerCase().includes('reading') && hobby.toLowerCase().includes('bible')
    ? 'bible reading'
    : hobby.toLowerCase().includes('reading') && hobby.toLowerCase().includes('holy')
    ? 'religious reading'
    : hobby;

  const prompt = `Create a concise 7-day learning outline and a fully detailed Day 1 for ${smartHobby}.

IMPORTANT: Treat "${hobby}" as a single, unified hobby. Do not separate it into multiple activities.

User Details:
- Experience level: ${experience}
- Time available per day: ${timeAvailable}
- Learning goal: ${goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${hobby}",
  "title": "Master ${hobby} in 7 Days",
  "overview": "Short description of the journey",
  "difficulty": "${experience}",
  "totalDays": 7,
  "days": [
    { "day": 1, "title": "Day 1 title", "mainTask": "...", "explanation": "...",
      "howTo": ["Step 1","Step 2","Step 3"],
      "checklist": ["Item 1","Item 2","Item 3"],
      "tips": ["Tip 1","Tip 2"],
      "mistakesToAvoid": ["Mistake 1","Mistake 2"],
      "estimatedTime": "${timeAvailable}",
      "skillLevel": "${experience}",
      "youtubeVideoId": ""
    }
  ],
  "outline": [
    {"day":1, "title":"...", "goals":["...","..."]},
    {"day":2, "title":"...", "goals":["...","..."]},
    {"day":3, "title":"...", "goals":["...","..."]},
    {"day":4, "title":"...", "goals":["...","..."]},
    {"day":5, "title":"...", "goals":["...","..."]},
    {"day":6, "title":"...", "goals":["...","..."]},
    {"day":7, "title":"...", "goals":["...","..."]}
  ]
}`;
  const vercelUrl = process.env.VERCEL_URL || '';
  const refererUrl = process.env.WEB_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'https://wizqo.com');
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': refererUrl,
      'X-Title': 'Wizqo Hobby Learning Platform'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1400,
      temperature: 0.7
    })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    const err = new Error(`openrouter_${resp.status}`);
    (err as any).upstream = text?.slice(0, 500) || '';
    throw err;
  }
  const data = await resp.json();
  let content = data?.choices?.[0]?.message?.content || '';
  content = String(content).trim();
  content = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const cleaned = jsonMatch ? jsonMatch[0] : content;
  return JSON.parse(cleaned);
}

async function getYouTubeVideo(hobby: string, day: number, title: string) {
  const apiKey = process.env.YOUTUBE_API_KEY as string | undefined;
  if (!apiKey) return null as any;
  try {
    const q = `${hobby} tutorial day ${day} ${title}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`yt_${r.status}`);
    const j = await r.json();
    const it = j.items?.[0];
    if (!it) return null as any;
    return { id: it.id?.videoId as string, title: it.snippet?.title as string };
  } catch (e) { return null as any; }
}

async function getVideoViaOpenRouterFallback(hobby: string, day: number, title: string) {
  try {
    const key = process.env.OPENROUTER_API_KEY as string | undefined;
    if (!key) return null as any;
    const prompt = `Suggest a single YouTube video ID for ${hobby} day ${day} titled "${title}". Reply ONLY with a JSON: {"id":"VIDEO_ID","title":"Title"}`;
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'deepseek/deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 100 })
    });
    if (!resp.ok) return null as any;
    const data = await resp.json();
    let content = data.choices?.[0]?.message?.content || '';
    content = content.trim().replace(/^```json\s*|^```\s*|\s*```$/g, '');
    const parsed = JSON.parse(content);
    if (parsed?.id && typeof parsed.id === 'string') return parsed;
    return null as any;
  } catch { return null as any; }
}

// Generate plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const hobby = String(req.body?.hobby || '').trim();
    const experience = String(req.body?.experience || 'beginner');
    const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
    const goal = String(req.body?.goal || (hobby ? `Learn ${hobby} fundamentals` : '')); 
    if (!hobby) return res.status(400).json({ error: 'missing_hobby' });
    if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });
    const aiPlan = await generatePlanViaOpenRouter(hobby, experience, timeAvailable, goal);
    if (!aiPlan) return res.status(502).json({ error: 'bad_ai_response' });

    // Build a lightweight outline if provided, else derive from any returned days
    const rawDays: any[] = Array.isArray(aiPlan.days) ? aiPlan.days : [];
    // Prefer explicit outline if provided by the model
    const explicitOutline: any[] = Array.isArray((aiPlan as any).outline) ? (aiPlan as any).outline : [];
    const derivedOutline = rawDays.slice(0, 7).map((d: any, idx: number) => ({
      day: (typeof d?.day === 'number' ? d.day : (idx + 1)),
      title: typeof d?.title === 'string' ? d.title : null,
      goals: Array.isArray(d?.checklist) ? d.checklist.slice(0, 3) : (Array.isArray(d?.howTo) ? d.howTo.slice(0, 3) : [])
    }));
    const outline = explicitOutline.length ? explicitOutline.slice(0,7) : derivedOutline;

    // Generate only Day 1 content now to save tokens
    const d1 = rawDays?.[0] || {} as any;
    const dayNum = 1;
    const title = (typeof d1.title === 'string' && d1.title.trim()) ? d1.title : `${hobby} Fundamentals`;
    let video = await getYouTubeVideo(hobby, dayNum, title);
    if (!video) video = await getVideoViaOpenRouterFallback(hobby, dayNum, title);
    const day1 = {
      day: 1,
      title,
      mainTask: d1.mainTask || d1.goal || d1.objective || `Learn ${hobby} fundamentals`,
      explanation: d1.explanation || d1.description || d1.details || `Day ${dayNum} of your ${hobby} journey`,
      howTo: Array.isArray(d1.howTo) && d1.howTo.length ? d1.howTo : [`Step ${dayNum}`],
      checklist: Array.isArray(d1.checklist) && d1.checklist.length ? d1.checklist : [`Complete day ${dayNum} tasks`],
      tips: Array.isArray(d1.tips) && d1.tips.length ? d1.tips : [`Tip for day ${dayNum}`],
      mistakesToAvoid: Array.isArray(d1.mistakesToAvoid) && d1.mistakesToAvoid.length ? d1.mistakesToAvoid : (Array.isArray(d1.commonMistakes) && d1.commonMistakes.length ? d1.commonMistakes : [`Avoid rushing on day ${dayNum}`]),
      freeResources: [],
      affiliateProducts: [{ title: `${hobby} Starter Kit`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+starter+kit&tag=wizqohobby-20`, price: `$${19 + 0 * 5}.99` }],
      youtubeVideoId: video?.id || null,
      videoTitle: video?.title || 'Video not available',
      estimatedTime: d1.estimatedTime || timeAvailable,
      skillLevel: d1.skillLevel || experience
    };

    res.json({
      hobby: aiPlan.hobby || hobby,
      title: aiPlan.title || `Learn ${hobby} in 7 Days`,
      overview: aiPlan.overview || aiPlan.description || `Master ${hobby} with this 7-day plan`,
      difficulty: aiPlan.difficulty || experience,
      totalDays: 7,
      outline,
      days: [day1]
    });
  } catch (e: any) {
    console.error('generate-plan error:', e);
    res.status(500).json({ error: 'failed_to_generate_plan', message: String(e?.message || e), upstream: e?.upstream || '' });
  }
});

// Generate a single day on-demand (Days 2-7)
app.post('/api/generate-day', async (req, res) => {
  try {
    const hobby = String(req.body?.hobby || '').trim();
    const experience = String(req.body?.experience || 'beginner');
    const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
    const goal = String(req.body?.goal || (hobby ? `Learn ${hobby} fundamentals` : ''));
    const dayNumber = Number(req.body?.day_number || 0);
    const outline = Array.isArray(req.body?.outline) ? req.body.outline : [];
    const priorDays = Array.isArray(req.body?.prior_days) ? req.body.prior_days : [];

    if (!hobby) return res.status(400).json({ error: 'missing_hobby' });
    if (!dayNumber || dayNumber < 2 || dayNumber > 7) return res.status(400).json({ error: 'invalid_day_number' });
    if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });

    // Build a concise context from outline and prior days to keep tokens low
    const outlineForDay = outline.find((o: any) => Number(o?.day) === dayNumber) || null;
    const priorSummaries = priorDays
      .filter((d: any) => typeof d?.day === 'number' && d.day < dayNumber)
      .slice(-3)
      .map((d: any) => ({ day: d.day, title: d.title, mainTask: d.mainTask, keySteps: Array.isArray(d.howTo) ? d.howTo.slice(0, 3) : [] }));

    const system = [
      'You are Wizqo, a friendly expert hobby coach.',
      'Output strict JSON only. No markdown.'
    ].join('\n');
    const userPrompt = `Hobby: ${hobby}\nDifficulty: ${experience}\nTime per day: ${timeAvailable}\nGoal: ${goal}\n\nDay requested: ${dayNumber}\nOutline for this day: ${JSON.stringify(outlineForDay || {})}\nPrior day summaries: ${JSON.stringify(priorSummaries)}\n\nConstraints:\n- Build on previous days, no repetition.\n- Progressive difficulty.\n- Be practical and concise.\n- End with a next_day_hint.\n\nReturn ONLY a JSON object with keys: {"title","objectives","steps","resources","estimated_total_min","prerequisites","next_day_hint"}.`;

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.WEB_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wizqo.com'),
        'X-Title': 'Wizqo Hobby Learning Platform'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1200,
        temperature: 0.7
      })
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      const err = new Error(`openrouter_${resp.status}`);
      ;(err as any).upstream = text;
      throw err;
    }
    const data = await resp.json();
    let content = data?.choices?.[0]?.message?.content || '';
    content = String(content).trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const cleaned = jsonMatch ? jsonMatch[0] : content;
    let parsed: any;
    try { parsed = JSON.parse(cleaned); } catch { throw new Error('openrouter_invalid_json'); }

    // Normalize into Day structure expected by frontend
    const title = typeof parsed?.title === 'string' && parsed.title.trim() ? parsed.title.trim() : `Day ${dayNumber} - ${hobby}`;
    let video = await getYouTubeVideo(hobby, dayNumber, title);
    if (!video) video = await getVideoViaOpenRouterFallback(hobby, dayNumber, title);
    const day = {
      day: dayNumber,
      title,
      mainTask: Array.isArray(parsed?.objectives) && parsed.objectives.length ? parsed.objectives[0] : `Objective for day ${dayNumber}`,
      explanation: parsed?.prerequisites ? `Prerequisites: ${(Array.isArray(parsed.prerequisites) ? parsed.prerequisites.join(', ') : String(parsed.prerequisites))}` : `Focus on building skills from prior days.`,
      howTo: Array.isArray(parsed?.steps) && parsed.steps.length ? parsed.steps.map((s: any) => (typeof s === 'string' ? s : (s?.how || s?.what || 'Step'))) : [`Step ${dayNumber}`],
      checklist: Array.isArray(parsed?.steps) && parsed.steps.length ? parsed.steps.map((s: any, i: number) => (typeof s === 'string' ? s : (s?.title || `Task ${i + 1}`))) : [`Complete day ${dayNumber} tasks`],
      tips: [],
      mistakesToAvoid: [],
      freeResources: Array.isArray(parsed?.resources) ? parsed.resources.filter((r: any) => r?.type === 'link' || r?.type === 'article').slice(0, 3).map((r: any) => ({ title: r?.title || 'Resource', link: r?.url || '#' })) : [],
      affiliateProducts: [{ title: `${hobby} Essentials`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+essentials&tag=wizqohobby-20`, price: `$${19 + (dayNumber - 1) * 5}.99` }],
      youtubeVideoId: video?.id || null,
      videoTitle: video?.title || 'Video not available',
      estimatedTime: typeof parsed?.estimated_total_min === 'number' ? `${parsed.estimated_total_min} minutes` : timeAvailable,
      skillLevel: experience
    };

    res.json({ day });
  } catch (e: any) {
    console.error('generate-day error:', e);
    res.status(500).json({ error: 'failed_to_generate_day', message: String(e?.message || e), upstream: e?.upstream || '' });
  }
});

// GET hobby plans (read-only)
app.get('/api/hobby-plans', async (req, res) => {
  try {
    const userId = String(req.query.user_id || '');
    if (!userId || !supabaseAnon) return res.json([]);
    const { data, error } = await supabaseAnon.from('hobby_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return res.json([]);
    res.json(data || []);
  } catch { res.json([]); }
});

// GET single hobby plan by id (read-only)
app.get('/api/hobby-plans/:id', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    if (!id || !supabaseAnon) return res.status(404).json({ error: 'not_found' });
    const { data, error } = await supabaseAnon
      .from('hobby_plans')
      .select('*')
      .eq('id', id)
      .limit(1)
      .maybeSingle();
    if (!error && data) return res.json(data);

    // Fallback: use service role via REST to bypass RLS if available
    try {
      if (supabaseUrl && supabaseServiceRoleKey) {
        const r = await fetch(`${supabaseUrl}/rest/v1/hobby_plans?id=eq.${encodeURIComponent(id)}&select=*`, {
          headers: {
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`
          }
        });
        const t = await r.text();
        if (r.ok) {
          const arr = JSON.parse(t);
          if (Array.isArray(arr) && arr.length > 0) return res.json(arr[0]);
        }
      }
    } catch {}

    return res.status(404).json({ error: 'not_found' });
  } catch {
    res.status(404).json({ error: 'not_found' });
  }
});

// Chat moderation helper
function isUnsafeQuery(text: string): { unsafe: boolean; category?: string } {
  const lowered = text.toLowerCase();
  const banned = [
    'sex', 'sexual', 'porn', 'pornography', 'nsfw', 'nude', 'erotic', 'hentai', 'fetish', 'escort', 'prostitution',
    'blowjob', 'anal', 'rape', 'incest', 'child', 'minor', 'cp',
    'drug', 'cocaine', 'heroin', 'meth', 'marijuana', 'weed', 'steroid', 'mdma', 'lsd', 'psychedelic',
    'suicide', 'self-harm', 'bomb', 'weapon', 'firearm', 'gun', 'explosive', 'kill', 'murder',
    'dox', 'doxx', 'credit card', 'ssn', 'social security', 'hack', 'crack', 'piracy'
  ];
  for (const term of banned) { if (lowered.includes(term)) return { unsafe: true, category: term }; }
  return { unsafe: false };
}

// Hobby Q&A chat endpoint with safety guardrails
app.post('/api/hobby-chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    const hobby = String(req.body?.hobby || '').trim();
    const plan = req.body?.plan || null;
    if (!message) return res.status(400).json({ error: 'missing_message' });

    const moderation = isUnsafeQuery(message);
    if (moderation.unsafe) {
      return res.json({ reply: "I can't assist with adult, illegal, violent, or harmful topics. Please ask hobby-related learning questions." });
    }

    if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });

    const system = [
      'You are Wizqo, a friendly expert hobby coach.',
      'Strict safety: refuse adult/sexual content, illegal drugs, violence, self-harm, doxxing, crime, hacking, or dangerous instructions.',
      'Keep answers PG-13. Redirect to safe, constructive hobby learning advice.',
      'Be concise, practical, and encouraging. If user asks risky activities (e.g., BASE jumping), stress safety, training, and certified guidance.',
      hobby ? `User hobby context: ${hobby}` : ''
    ].filter(Boolean).join('\n');

    let planSummary = '';
    try {
      if (plan && typeof plan === 'object' && Array.isArray(plan.days)) {
        const title = plan.title || '';
        const total = plan.totalDays || plan.days.length;
        const day1 = plan.days[0]?.title || '';
        const dayN = plan.days[Math.min(6, plan.days.length - 1)]?.title || '';
        planSummary = `Plan: ${title} | Days: ${total} | Sample: Day1: ${day1} ... Day${Math.min(7, plan.days.length)}: ${dayN}`;
      }
    } catch {}

    const key = process.env.OPENROUTER_API_KEY as string;
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'https://wizqo.com',
        'X-Title': 'Wizqo Hobby Learning Platform'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: system + (planSummary ? `\n${planSummary}` : '') },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.5
      })
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(502).json({ error: 'chat_upstream_error', detail: text.slice(0, 500) });
    }
    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "I'm here to help. What would you like to know about your hobby?";
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'failed_hobby_chat' });
  }
});

// Export the app for Vercel @vercel/node
export default app;

