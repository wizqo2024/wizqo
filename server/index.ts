import express, { type Express } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
// Inline affiliate generator to avoid module resolution issues in serverless bundle
type AffiliateProduct = { title: string; link: string; price: string };
const AFFILIATE_TAG = 'wizqohobby-20';
const affiliateMemoryCache = new Map<string, string[]>();
const affiliateGroupKeywords: Record<string, string[]> = {
  music: ['beginner instrument', 'tuner', 'metronome', 'practice book', 'strings'],
  art: ['starter kit', 'brush set', 'canvas', 'sketchbook', 'pencils'],
  gardening: ['pruning shears', 'soil mix', 'watering can', 'tool set'],
  yoga: ['yoga mat', 'yoga blocks', 'yoga strap'],
  photography: ['tripod', 'sd card', 'cleaning kit'],
  coding: ['beginner book', 'arduino kit', 'raspberry pi kit'],
};
const affiliateHobbyToGroup: Array<{ pattern: RegExp; group: keyof typeof affiliateGroupKeywords }> = [
  { pattern: /(guitar|piano|violin|ukulele|drum|singing)/i, group: 'music' },
  { pattern: /(paint|draw|sketch|art|watercolor|acrylic)/i, group: 'art' },
  { pattern: /(garden|bonsai|plant|horticult)/i, group: 'gardening' },
  { pattern: /(yoga|pilates)/i, group: 'yoga' },
  { pattern: /(photo|camera)/i, group: 'photography' },
  { pattern: /(coding|program|javascript|python|arduino|raspberry)/i, group: 'coding' },
];
const affiliateVerbToTool: Array<{ pattern: RegExp; tools: string[] }> = [
  { pattern: /prun|trim|cut/i, tools: ['pruning shears', 'concave cutter'] },
  { pattern: /wire/i, tools: ['training wire'] },
  { pattern: /tune/i, tools: ['clip-on tuner'] },
  { pattern: /practice|exercise/i, tools: ['practice kit', 'beginner kit'] },
  { pattern: /sketch|draw/i, tools: ['graphite pencil set', 'kneaded eraser', 'sketchbook'] },
  { pattern: /paint/i, tools: ['acrylic paint set', 'brush set', 'canvas panels'] },
];
function affiliateGuessGroup(hobby: string): string[] {
  for (const { pattern, group } of affiliateHobbyToGroup) {
    if (pattern.test(hobby)) return affiliateGroupKeywords[group];
  }
  return [`${hobby} starter kit`, `${hobby} tools`, `${hobby} accessories`];
}
function affiliateExtractTools(texts: string[]): string[] {
  const lower = texts.join(' \n ').toLowerCase();
  const tools = new Set<string>();
  for (const { pattern, tools: t } of affiliateVerbToTool) {
    if (pattern.test(lower)) t.forEach(x => tools.add(x));
  }
  return Array.from(tools);
}
function affiliateBuildQueries(hobby: string, base: string[], extracted: string[], extra: string[]): string[] {
  const focus = extra.filter(Boolean);
  const variants = [...extracted, ...base];
  const queries = variants.slice(0, 4).map(v => [hobby, v, ...focus].join(' ').replace(/\s+/g, ' ').trim());
  return Array.from(new Set(queries)).slice(0, 3);
}
async function affiliateLLMSuggestQueries(hobby: string, context: string): Promise<string[] | null> {
  try {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) return null;
    const body = {
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: 'Suggest 3 Amazon search queries as a JSON array of strings. No markdown.' },
        { role: 'user', content: `Hobby: ${hobby}\nContext: ${context}\nRules: Avoid "day" terms. Prefer tools/kits/accessories. Output JSON array only.` }
      ],
      max_tokens: 120,
      temperature: 0.4
    } as any;
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': process.env.WEB_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wizqo.com'),
        'X-Title': 'Wizqo Affiliate Suggestions'
      },
      body: JSON.stringify(body)
    });
    if (!r.ok) return null;
    const j = await r.json();
    let content = j?.choices?.[0]?.message?.content || '';
    content = String(content).trim().replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```$/i, '');
    const arr = JSON.parse(content);
    if (Array.isArray(arr) && arr.every((s: any) => typeof s === 'string')) return arr.slice(0, 3);
    return null;
  } catch { return null; }
}
async function generateAffiliateProducts(hobby: string, objectiveOrTitle: string, steps: string[] = [], dayNumber: number): Promise<AffiliateProduct[]> {
  const cacheKey = `${hobby}::${objectiveOrTitle}::${steps.slice(0, 3).join('|')}`.toLowerCase();
  let queries = affiliateMemoryCache.get(cacheKey) || [];
  if (queries.length === 0) {
    const base = affiliateGuessGroup(hobby);
    const extracted = affiliateExtractTools([objectiveOrTitle, ...steps]);
    const extras: string[] = [];
    if (/beginner|start|intro|fundamental/i.test(objectiveOrTitle)) extras.push('beginner');
    queries = affiliateBuildQueries(hobby, base, extracted, extras);
    if (queries.length === 0) {
      const llm = await affiliateLLMSuggestQueries(hobby, `${objectiveOrTitle}\nSteps: ${steps.slice(0, 3).join(' | ')}`);
      if (llm && llm.length) queries = llm;
    }
    if (queries.length) affiliateMemoryCache.set(cacheKey, queries);
  }
  const products: AffiliateProduct[] = queries.slice(0, 2).map((q, idx) => ({
    title: q,
    link: `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AFFILIATE_TAG}`,
    price: `$${(19 + (dayNumber - 1) * 5 + idx * 3).toFixed(2)}`
  }));
  return products;
}
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

    // Prevent duplicate plan per hobby for this user
    try {
      const existing = await supabaseAdmin
        .from('hobby_plans')
        .select('id,hobby,hobby_name,title,plan_data,created_at')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      const normalize = (s: any) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const target = normalize(hobby || hobby_name || '');
      const dup = (existing.data || []).find((p: any) => {
        const h1 = normalize(p.hobby);
        const h2 = normalize(p.hobby_name);
        const hp = normalize(p.plan_data?.hobby || p.plan_data?.hobby_name || '');
        const m = String(p.title || '').match(/(?:Learn|Master)\s+(.+?)\s+in/i);
        const ht = m ? normalize(m[1]) : '';
        return target && (h1 === target || h2 === target || hp === target || ht === target);
      });
      if (dup) return res.status(409).json({ error: 'duplicate_plan', plan_id: dup.id, message: `You already have a learning plan for ${(hobby||hobby_name) || 'this hobby'}.` });

      // Total cap: max 5 plans per user
      const total = await supabaseAdmin
        .from('hobby_plans')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user_id);
      if ((total.count || 0) >= 5) {
        return res.status(429).json({ error: 'plan_limit_reached' });
      }
    } catch {}

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
  // Super intelligent hobby parsing - understand any user input
     const smartHobby = (() => {
     const lowerHobby = hobby.toLowerCase().trim();
     
     // If the input is too broad/complex for 7 days, map to a beginner-friendly scope first
     const complexityMappings: Array<{ keywords: string[]; target: string }> = [
       { keywords: ['artificial intelligence', 'ai'], target: 'python for machine learning basics' },
       { keywords: ['machine learning', 'deep learning'], target: 'machine learning fundamentals with python' },
       { keywords: ['data science'], target: 'python data analysis basics' },
       { keywords: ['full stack', 'fullstack'], target: 'web development fundamentals (html, css, js)' },
       { keywords: ['cybersecurity', 'ethical hacking'], target: 'cybersecurity basics' },
       { keywords: ['blockchain', 'web3'], target: 'blockchain fundamentals' },
       { keywords: ['robotics'], target: 'arduino basics' },
       { keywords: ['electronics'], target: 'basic electronics projects' },
       { keywords: ['3d modeling'], target: 'blender basics' },
       { keywords: ['animation'], target: '2d animation basics' },
       { keywords: ['trading', 'stock market', 'crypto trading'], target: 'investing basics' },
       { keywords: ['medicine', 'surgery'], target: 'human anatomy basics' },
       { keywords: ['pilot', 'aviation'], target: 'flight theory basics' },
       { keywords: ['architecture'], target: 'sketching buildings basics' },
       { keywords: ['kubernetes'], target: 'docker and containers basics' },
       { keywords: ['devops'], target: 'ci/cd basics' },
       { keywords: ['photography'], target: 'beginner photography' },
     ];
     for (const map of complexityMappings) {
       if (map.keywords.every(k => lowerHobby.includes(k))) {
         return map.target;
       }
       if (map.keywords.some(k => lowerHobby === k)) {
         return map.target;
       }
     }
     
     // Religious/Spiritual reading patterns
    if (lowerHobby.includes('reading') && (lowerHobby.includes('quran') || lowerHobby.includes('koran'))) {
      return 'quran reading';
    }
    if (lowerHobby.includes('reading') && lowerHobby.includes('bible')) {
      return 'bible reading';
    }
    if (lowerHobby.includes('reading') && (lowerHobby.includes('holy') || lowerHobby.includes('religious') || lowerHobby.includes('sacred'))) {
      return 'religious reading';
    }
    
    // General reading patterns
    if (lowerHobby.includes('reading') && lowerHobby.includes('book')) {
      return 'book reading';
    }
    if (lowerHobby.includes('reading') && lowerHobby.includes('novel')) {
      return 'novel reading';
    }
    if (lowerHobby.includes('reading') && lowerHobby.includes('poetry')) {
      return 'poetry reading';
    }
    
    // Music instrument patterns
    if (lowerHobby.includes('playing') && lowerHobby.includes('guitar')) {
      return 'guitar';
    }
    if (lowerHobby.includes('playing') && lowerHobby.includes('piano')) {
      return 'piano';
    }
    if (lowerHobby.includes('playing') && lowerHobby.includes('violin')) {
      return 'violin';
    }
    if (lowerHobby.includes('playing') && lowerHobby.includes('drum')) {
      return 'drums';
    }
    
    // Art patterns
    if (lowerHobby.includes('drawing') || lowerHobby.includes('sketching')) {
      return 'drawing';
    }
    if (lowerHobby.includes('painting') && lowerHobby.includes('watercolor')) {
      return 'watercolor';
    }
    if (lowerHobby.includes('painting') && lowerHobby.includes('acrylic')) {
      return 'acrylic';
    }
    if (lowerHobby.includes('painting') && lowerHobby.includes('oil')) {
      return 'oil painting';
    }
    
    // Cooking patterns
    if (lowerHobby.includes('cooking') || lowerHobby.includes('chef')) {
      return 'cooking';
    }
    if (lowerHobby.includes('baking') || lowerHobby.includes('pastry')) {
      return 'baking';
    }
    
    // Photography patterns
    if (lowerHobby.includes('photo') || lowerHobby.includes('camera')) {
      return 'photography';
    }
    if (lowerHobby.includes('digital') && lowerHobby.includes('photo')) {
      return 'digital photography';
    }
    
    // Language patterns
    if (lowerHobby.includes('learning') && lowerHobby.includes('language')) {
      return 'language learning';
    }
    if (lowerHobby.includes('spanish') || lowerHobby.includes('español')) {
      return 'spanish';
    }
    if (lowerHobby.includes('french') || lowerHobby.includes('français')) {
      return 'french';
    }
    if (lowerHobby.includes('german') || lowerHobby.includes('deutsch')) {
      return 'german';
    }
    if (lowerHobby.includes('japanese') || lowerHobby.includes('nihongo')) {
      return 'japanese';
    }
    if (lowerHobby.includes('chinese') || lowerHobby.includes('mandarin')) {
      return 'mandarin';
    }
    
    // Fitness patterns
    if (lowerHobby.includes('yoga') || lowerHobby.includes('meditation')) {
      return 'yoga';
    }
    if (lowerHobby.includes('gym') || lowerHobby.includes('workout') || lowerHobby.includes('fitness')) {
      return 'fitness';
    }
    if (lowerHobby.includes('running') || lowerHobby.includes('jogging')) {
      return 'running';
    }
    if (lowerHobby.includes('swimming') || lowerHobby.includes('swim')) {
      return 'swimming';
    }
    
    // Technology patterns
    if (lowerHobby.includes('coding') || lowerHobby.includes('programming') || lowerHobby.includes('code')) {
      return 'coding';
    }
    if (lowerHobby.includes('web') && lowerHobby.includes('development')) {
      return 'web development';
    }
    if (lowerHobby.includes('app') && lowerHobby.includes('development')) {
      return 'app development';
    }
    
    // Gardening patterns
    if (lowerHobby.includes('garden') || lowerHobby.includes('plant')) {
      return 'gardening';
    }
    if (lowerHobby.includes('flower') && lowerHobby.includes('growing')) {
      return 'flower gardening';
    }
    
    // Craft patterns
    if (lowerHobby.includes('knitting') || lowerHobby.includes('knit')) {
      return 'knitting';
    }
    if (lowerHobby.includes('crochet') || lowerHobby.includes('crocheting')) {
      return 'crocheting';
    }
    if (lowerHobby.includes('sewing') || lowerHobby.includes('sew')) {
      return 'sewing';
    }
    
    // Writing patterns
    if (lowerHobby.includes('writing') && lowerHobby.includes('poetry')) {
      return 'poetry writing';
    }
    if (lowerHobby.includes('writing') && lowerHobby.includes('story')) {
      return 'creative writing';
    }
    if (lowerHobby.includes('blog') || lowerHobby.includes('blogging')) {
      return 'blogging';
    }
    
    // Gaming patterns
    if (lowerHobby.includes('game') && lowerHobby.includes('development')) {
      return 'game development';
    }
    if (lowerHobby.includes('video') && lowerHobby.includes('game')) {
      return 'video gaming';
    }
    if (lowerHobby.includes('board') && lowerHobby.includes('game')) {
      return 'board games';
    }
    
    // Return original if no pattern matches
    return hobby;
  })();

    const prompt = `Create a comprehensive 7-day learning plan for ${smartHobby}.

IMPORTANT INSTRUCTIONS:
 1. Treat "${hobby}" as a single, unified hobby or activity
 2. Do NOT separate it into multiple activities or skills
 3. Understand the user's intent and create a focused learning plan
 4. If the input is vague, interpret it intelligently and create a structured plan
 5. Focus on practical, achievable learning objectives
 6. If the original input seems too broad or advanced for 7 days, confirm and proceed with the interpreted beginner-friendly scope

 User Input: "${hobby}"
 Interpreted Hobby: "${smartHobby}"
 User Details:
 - Experience level: ${experience}
 - Time available per day: ${timeAvailable}
 - Learning goal: ${goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${smartHobby}",
  "title": "Master ${smartHobby} in 7 Days",
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
      messages: [
        { role: 'system', content: 'You are a helpful planner. Respond with STRICT JSON only. No explanations, no code fences, no prose. Keep within 7 days and include requested keys.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.2
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
  // Remove common code fences
  content = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  // Safe JSON parsing with fallbacks
  const tryParse = (s: string) => {
    try { return JSON.parse(s); } catch { return null; }
  };

  // 1) Try direct parse
  let parsed: any = tryParse(content);

  // 2) Extract the largest {...} block if direct parse failed
  if (!parsed) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) parsed = tryParse(match[0]);
  }

  // 3) Lightweight repair: attempt to balance braces
  if (!parsed) {
    const open = (content.match(/\{/g) || []).length;
    const close = (content.match(/\}/g) || []).length;
    let repaired = content;
    if (open > close) {
      repaired = content + '}'.repeat(open - close);
    } else if (close > open) {
      // Trim extra closing braces at the end
      repaired = content.replace(/\}+$/g, (m) => '}'.repeat(Math.max(0, m.length - (close - open))));
    }
    parsed = tryParse(repaired);
  }

  // 4) Final fallback: synthesize a minimal valid plan if parsing still fails
  if (!parsed || typeof parsed !== 'object') {
    const outline = Array.from({ length: 7 }, (_, i) => ({ day: i + 1, title: `Day ${i + 1}`, goals: [] as string[] }));
    const fallback = {
      hobby: smartHobby,
      title: `Master ${smartHobby} in 7 Days`,
      overview: goal || `Learn ${smartHobby} fundamentals`,
      difficulty: experience,
      totalDays: 7,
      days: [
        {
          day: 1,
          title: `Getting Started with ${smartHobby}`,
          mainTask: `Learn ${smartHobby} fundamentals`,
          explanation: `Day 1 of your ${smartHobby} journey`,
          howTo: ['Step 1: Setup', 'Step 2: Learn basics', 'Step 3: Practice'],
          checklist: ['Complete basics', 'Take notes'],
          tips: ['Stay consistent'],
          mistakesToAvoid: ['Rushing'],
          estimatedTime: timeAvailable,
          skillLevel: experience,
          youtubeVideoId: ''
        }
      ],
      outline
    };
    return fallback as any;
  }

  return parsed;
}

async function getYouTubeVideo(hobby: string, day: number, title: string) {
  const apiKey = process.env.YOUTUBE_API_KEY as string | undefined;
  if (!apiKey) return null as any;
  
  try {
    // Create more specific and varied search queries for each day
    const searchQueries = [
      // Day-specific searches with different approaches
      `${hobby} day ${day} ${title}`,
      `${hobby} lesson ${day} ${title}`,
      `${hobby} tutorial day ${day} ${title}`,
      `${hobby} practice day ${day} ${title}`,
      `${hobby} beginner day ${day} ${title}`,
      `${hobby} step ${day} ${title}`,
      `${hobby} part ${day} ${title}`,
      `${hobby} session ${day} ${title}`,
      // Alternative search strategies
      `${hobby} ${title} day ${day}`,
      `${hobby} ${title} lesson ${day}`,
      `${hobby} ${title} tutorial ${day}`,
      // More specific day-based searches
      `${hobby} fundamentals day ${day}`,
      `${hobby} basics day ${day}`,
      `${hobby} introduction day ${day}`,
      `${hobby} getting started day ${day}`,
      // Skill progression searches
      `${hobby} progress day ${day}`,
      `${hobby} next step day ${day}`,
      `${hobby} continue learning day ${day}`,
      // Time-based searches
      `${hobby} daily practice day ${day}`,
      `${hobby} weekly lesson ${day}`,
      `${hobby} 7 day challenge day ${day}`
    ];

    // Use day number to select different search strategies
    const queryIndex = (day - 1) % searchQueries.length;
    const selectedQuery = searchQueries[queryIndex];
    
    // Add day-specific modifiers to make searches more unique
    const dayModifiers = [
      'beginner', 'intermediate', 'advanced', 'fundamentals', 'practice', 'technique',
      'skill building', 'foundation', 'progression', 'development', 'mastery', 'expertise'
    ];
    const modifierIndex = (day - 1) % dayModifiers.length;
    const dayModifier = dayModifiers[modifierIndex];
    
    // Create final search query with day-specific content
    const finalQuery = `${selectedQuery} ${dayModifier}`;
    
    console.log(`🎥 Video search for Day ${day}: "${finalQuery}"`);
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(finalQuery)}&key=${apiKey}&videoDuration=short&relevanceLanguage=en`;
    
    const r = await fetch(url);
    if (!r.ok) throw new Error(`yt_${r.status}`);
    
    const j = await r.json();
    const items = j.items || [];
    
    if (items.length === 0) return null as any;
    
    // Select video based on day number to ensure variety
    const videoIndex = (day - 1) % Math.min(items.length, 5);
    const selectedVideo = items[videoIndex];
    
    if (!selectedVideo) return null as any;
    
    const result = { 
      id: selectedVideo.id?.videoId as string, 
      title: selectedVideo.snippet?.title as string,
      searchQuery: finalQuery,
      day: day
    };
    
    console.log(`✅ Day ${day} video selected: ${result.title}`);
    return result;
    
  } catch (e) { 
    console.error(`❌ Video search error for Day ${day}:`, e);
    return null as any; 
  }
}

async function getVideoViaOpenRouterFallback(hobby: string, day: number, title: string) {
  try {
    const key = process.env.OPENROUTER_API_KEY as string | undefined;
    if (!key) return null as any;
    
    // Create day-specific prompts for better video variety
    const daySpecificPrompts = [
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: BEGINNER BASICS. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: PRACTICE TECHNIQUES. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: SKILL BUILDING. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: PROGRESSION. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: INTERMEDIATE CONCEPTS. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: ADVANCED TECHNIQUES. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`,
      `Suggest a YouTube video ID for ${hobby} day ${day} titled "${title}". Focus on: MASTERY & REFINEMENT. Reply ONLY with JSON: {"id":"VIDEO_ID","title":"Title"}`
    ];
    
    // Use day number to select different focus areas
    const promptIndex = (day - 1) % daySpecificPrompts.length;
    const selectedPrompt = daySpecificPrompts[promptIndex];
    
    console.log(`🤖 AI Video suggestion for Day ${day}: ${selectedPrompt}`);
    
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${key}` 
      },
      body: JSON.stringify({ 
        model: 'deepseek/deepseek-chat', 
        messages: [{ role: 'user', content: selectedPrompt }], 
        max_tokens: 100,
        temperature: 0.7 // Add some randomness for variety
      })
    });
    
    if (!resp.ok) return null as any;
    
    const data = await resp.json();
    let content = data.choices?.[0]?.message?.content || '';
    content = content.trim().replace(/^```json\s*|^```\s*|\s*```$/g, '');
    
    try {
      const parsed = JSON.parse(content);
      if (parsed?.id && typeof parsed.id === 'string') {
        const result = {
          ...parsed,
          searchQuery: `AI suggested for Day ${day}`,
          day: day
        };
        console.log(`✅ AI suggested Day ${day} video: ${parsed.title}`);
        return result;
      }
    } catch (parseError) {
      console.error(`❌ AI video suggestion parse error for Day ${day}:`, parseError);
    }
    
    return null as any;
  } catch (error) {
    console.error(`❌ AI video suggestion error for Day ${day}:`, error);
    return null as any;
  }
}

// Generate plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const hobby = String(req.body?.hobby || '').trim();
    const experience = String(req.body?.experience || 'beginner');
    const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
    const goal = String(req.body?.goal || (hobby ? `Learn ${hobby} fundamentals` : '')); 
    const userId = String(req.body?.user_id || '').trim();
    if (!hobby) return res.status(400).json({ error: 'missing_hobby' });
    if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });

    // Enforce per-user plan limit (total 5) and prevent duplicate hobby plans (server-side)
    try {
      if (userId && supabaseAdmin) {
        const total = await supabaseAdmin
          .from('hobby_plans')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);
        if ((total.count || 0) >= 5) {
          return res.status(429).json({ error: 'plan_limit_reached' });
        }

        const existing = await supabaseAdmin
          .from('hobby_plans')
          .select('id,hobby,hobby_name,title,plan_data')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        const normalize = (s: any) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const target = normalize(hobby);
        const dup = (existing.data || []).find((p: any) => {
          const h1 = normalize(p.hobby);
          const h2 = normalize(p.hobby_name);
          const hp = normalize(p.plan_data?.hobby || p.plan_data?.hobby_name || '');
          // Try to parse from title e.g., "Learn X in" or "Master X in"
          const m = String(p.title || '').match(/(?:Learn|Master)\s+(.+?)\s+in/i);
          const ht = m ? normalize(m[1]) : '';
          return h1 === target || h2 === target || hp === target || ht === target;
        });
        if (dup) {
          return res.status(409).json({ error: 'duplicate_plan', plan_id: dup.id, message: `You already have a learning plan for ${hobby}.` });
        }
      }
    } catch {}

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
      affiliateProducts: await generateAffiliateProducts(hobby, (d1.mainTask || d1.goal || d1.objective || title), Array.isArray(d1.howTo) ? d1.howTo : [], dayNum),
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

    // Safe JSON parsing with fallbacks
    const tryParse = (s: string) => {
      try { return JSON.parse(s); } catch { return null; }
    };

    // 1) Try direct parse
    let parsed: any = tryParse(cleaned);

    // 2) Extract the largest {...} block if direct parse failed
    if (!parsed) {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) parsed = tryParse(match[0]);
    }

    // 3) Lightweight repair: attempt to balance braces
    if (!parsed) {
      const open = (cleaned.match(/\{/g) || []).length;
      const close = (cleaned.match(/\}/g) || []).length;
      let repaired = cleaned;
      if (open > close) {
        repaired = cleaned + '}'.repeat(open - close);
      } else if (close > open) {
        // Trim extra closing braces at the end
        repaired = cleaned.replace(/\}+$/g, (m) => '}'.repeat(Math.max(0, m.length - (close - open))));
      }
      parsed = tryParse(repaired);
    }

    if (!parsed || typeof parsed !== 'object') {
      const snippet = cleaned.slice(0, 400);
      const err = new Error('bad_ai_json');
      (err as any).upstream = snippet;
      throw err;
    }

    // Normalize into Day structure expected by frontend
    const title = typeof parsed?.title === 'string' && parsed.title.trim() ? parsed.title.trim() : `Day ${dayNumber} - ${hobby}`;
    let video = await getYouTubeVideo(hobby, dayNumber, title);
    if (!video) video = await getVideoViaOpenRouterFallback(hobby, dayNumber, title);

    // Derive helpful extras for UI completeness and uniqueness
    const objectiveList = Array.isArray(parsed?.objectives) ? parsed.objectives : [];
    const primaryObjective = typeof objectiveList[0] === 'string' ? objectiveList[0] : '';
    const stepTexts: string[] = Array.isArray(parsed?.steps)
      ? parsed.steps.map((s: any) => (typeof s === 'string' ? s : (s?.title || s?.what || s?.how || ''))).filter(Boolean)
      : [];

    const generatedTips: string[] = [
      primaryObjective ? `Focus on: ${primaryObjective}` : `Review yesterday briefly, then start fresh.`,
      stepTexts[0] ? `Do this well: ${stepTexts[0]}` : `Split practice into 2×15-minute focused blocks.`,
      `End with a 2-minute recap to reinforce learning.`
    ];

    const generatedMistakes: string[] = [
      `Skipping fundamentals on day ${dayNumber}.`,
      stepTexts[0] ? `Rushing through: ${stepTexts[0]}` : `Going too fast; prioritize accuracy over speed.`,
      `Not reflecting on what improved vs. what didn't.`
    ];

    const parsedFreeResources = Array.isArray(parsed?.resources)
      ? parsed.resources.filter((r: any) => r?.type === 'link' || r?.type === 'article').slice(0, 3).map((r: any) => ({ title: r?.title || 'Resource', link: r?.url || '#' }))
      : [];
    // Per request: no free resources; only Amazon affiliate products
    const freeResources: { title: string; link: string }[] = [];

    const affiliateProducts = await generateAffiliateProducts(hobby, (primaryObjective || title), stepTexts, dayNumber);

    const day = {
      day: dayNumber,
      title,
      mainTask: Array.isArray(parsed?.objectives) && parsed.objectives.length ? parsed.objectives[0] : `Objective for day ${dayNumber}`,
      explanation: parsed?.prerequisites ? `Prerequisites: ${(Array.isArray(parsed.prerequisites) ? parsed.prerequisites.join(', ') : String(parsed.prerequisites))}` : `Focus on building skills from prior days.`,
      howTo: Array.isArray(parsed?.steps) && parsed.steps.length ? parsed.steps.map((s: any) => (typeof s === 'string' ? s : (s?.how || s?.what || 'Step'))) : [`Step ${dayNumber}`],
      checklist: Array.isArray(parsed?.steps) && parsed.steps.length ? parsed.steps.map((s: any, i: number) => (typeof s === 'string' ? s : (s?.title || `Task ${i + 1}`))) : [`Complete day ${dayNumber} tasks`],
      tips: generatedTips,
      mistakesToAvoid: generatedMistakes,
      freeResources,
      affiliateProducts,
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

// Smart hobby validation using AI
app.post('/api/validate-hobby', async (req, res) => {
  try {
    const { hobby } = req.body;
    
    if (!hobby || typeof hobby !== 'string') {
      return res.status(400).json({ 
        isValid: false, 
        error: 'Invalid hobby input' 
      });
    }

    // Basic hobby validation with smart variations
    const cleanHobby = hobby.toLowerCase().trim();
    
    // Hobby categories and mappings
    const hobbyCategories = {
      arts: ['drawing', 'painting', 'photography', 'sketching', 'calligraphy'],
      music: ['guitar', 'piano', 'singing', 'drums', 'violin', 'ukulele'],
      tech: ['coding', 'programming', 'robotics', 'electronics'],
      fitness: ['yoga', 'running', 'swimming', 'cycling', 'dance'],
      nature: ['gardening', 'hiking', 'camping', 'fishing'],
      culinary: ['cooking', 'baking', 'coffee', 'grilling'],
      creative: ['writing', 'journaling', 'crafting', 'knitting']
    };

    // Common variations and synonyms
    const hobbyVariations = {
      'coffee making': 'coffee',
      'coffee brewing': 'coffee',
      'canva editing': 'design',
      'graphic design': 'design',
      'prompt engineering': 'coding',
      'ai prompting': 'coding',
      'botanic': 'gardening',
      'botany': 'gardening',
      'plant care': 'gardening',
      'noodles': 'cooking',
      'pasta making': 'cooking',
      'sing': 'singing',
      'tajweed': 'recitation',
      'quran recitation': 'recitation',
      'robotics': 'robotics',
      'electronics': 'electronics'
    };

    // Check for variations first
    if (hobbyVariations[cleanHobby]) {
      return res.json({
        isValid: true,
        suggestion: hobbyVariations[cleanHobby],
        category: 'variation',
        confidence: 0.9
      });
    }

    // Check if it's a recognized hobby
    for (const [category, hobbies] of Object.entries(hobbyCategories)) {
      if (hobbies.includes(cleanHobby)) {
        return res.json({
          isValid: true,
          suggestion: cleanHobby,
          category: category,
          confidence: 0.95
        });
      }
    }

    // Check for partial matches
    for (const [category, hobbies] of Object.entries(hobbyCategories)) {
      for (const hobbyItem of hobbies) {
        if (hobbyItem.includes(cleanHobby) || cleanHobby.includes(hobbyItem)) {
          return res.json({
            isValid: true,
            suggestion: hobbyItem,
            category: category,
            confidence: 0.8
          });
        }
      }
    }

    // If OpenRouter API key is available, try AI validation
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const aiValidation = await validateHobbyWithAI(hobby);
        if (aiValidation.isValid) {
          return res.json(aiValidation);
        }
      } catch (error) {
        console.error('AI validation error:', error);
      }
    }

    // Not recognized
    return res.json({
      isValid: false,
      suggestion: 'Try a specific hobby like photography, guitar, cooking, or drawing',
      category: 'unknown',
      confidence: 0.3
    });

  } catch (error) {
    console.error('Hobby validation error:', error);
    return res.status(500).json({ 
      isValid: false, 
      error: 'Validation failed' 
    });
  }
});

// AI-powered hobby validation using OpenRouter
async function validateHobbyWithAI(hobby: string) {
  try {
    const prompt = `Analyze this hobby input and provide smart validation:

Input: "${hobby}"

Please determine:
1. Is this a valid hobby that can be learned in 7 days?
2. What category does it belong to?
3. Suggest a corrected/related hobby if needed
4. Provide confidence level (0-1)

Consider:
- Typos and misspellings
- Synonyms and variations
- Related hobbies
- Complexity level for 7-day learning
- Safety and appropriateness

Respond in JSON format:
{
  "isValid": boolean,
  "suggestion": "string",
  "category": "string", 
  "confidence": number,
  "reasoning": "string"
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wizqo.com',
        'X-Title': 'WizQo Hobby App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content from AI');
    }

    // Parse AI response
    try {
      const aiResult = JSON.parse(content);
      return {
        isValid: aiResult.isValid || false,
        suggestion: aiResult.suggestion || hobby,
        category: aiResult.category || 'general',
        confidence: aiResult.confidence || 0.5,
        reasoning: aiResult.reasoning || 'AI analysis completed'
      };
    } catch (parseError) {
      console.error('AI response parse error:', parseError);
      return {
        isValid: false,
        suggestion: hobby,
        category: 'unknown',
        confidence: 0.3
      };
    }

  } catch (error) {
    console.error('AI validation error:', error);
    return {
      isValid: false,
      suggestion: hobby,
      category: 'unknown',
      confidence: 0.3
    };
  }
}

// Export the app for Vercel @vercel/node
export default app;

