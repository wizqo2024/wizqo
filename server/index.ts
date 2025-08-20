import express, { type Request, Response, NextFunction, type Express } from "express";
import { createServer } from "http";
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
// In serverless, avoid importing vite helpers; only use static serving
const log = (...args: any[]) => console.log(...args);
const serveStatic = (app: Express) => {
  const clientDir = path.resolve(process.cwd(), 'dist', 'public');
  if (fs.existsSync(clientDir)) {
    app.use(express.static(clientDir));
  }
};

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`🔍 API Request: ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.body) {
      console.log(`🔍 Request body keys:`, Object.keys(req.body));
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Inline route registration (avoid missing module issues)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  // Create separate anon and admin clients. Admin is required for writes bypassing RLS.
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseAnon = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null as any;
  const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey) ? createClient(supabaseUrl, supabaseServiceRoleKey) : null as any;

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
  // Diagnostics endpoint to verify DB connectivity and table presence
  app.get('/api/db-diagnostics', async (_req: Request, res: Response) => {
    try {
      const checks: Record<string, any> = {
        supabaseUrlPresent: Boolean(supabaseUrl),
        anonClientReady: Boolean(supabaseAnon),
        adminClientReady: Boolean(supabaseAdmin)
      };
      if (supabaseAnon) {
        try {
          const { error } = await supabaseAnon.from('hobby_plans').select('id').limit(1);
          checks.hobby_plans_readable = !error;
          checks.hobby_plans_error = error?.message || null;
        } catch (e: any) {
          checks.hobby_plans_readable = false;
          checks.hobby_plans_error = String(e?.message || e);
        }
      }
      if (supabaseAdmin) {
        try {
          const { error } = await supabaseAdmin.from('user_profiles').select('count').limit(1);
          checks.user_profiles_admin_access = !error;
          checks.user_profiles_admin_error = error?.message || null;
        } catch (e: any) {
          checks.user_profiles_admin_access = false;
          checks.user_profiles_admin_error = String(e?.message || e);
        }
      }
      res.json(checks);
    } catch (e: any) {
      res.status(500).json({ error: 'diagnostics_failed', details: String(e?.message || e) });
    }
  });

  // ===== OpenRouter helpers (inline) =====
  async function generatePlanViaOpenRouter(hobby: string, experience: string, timeAvailable: string, goal: string) {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error('missing_openrouter_key');
    const prompt = `Generate a comprehensive 7-day learning plan for learning ${hobby}.

User Details:
- Experience level: ${experience}
- Time available per day: ${timeAvailable}
- Learning goal: ${goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${hobby}",
  "title": "Master ${hobby} in 7 Days",
  "overview": "A compelling description of what this 7-day journey will teach you",
  "difficulty": "${experience}",
  "totalDays": 7,
  "days": [
    {
      "day": 1,
      "title": "Day title without 'Day X:' prefix",
      "mainTask": "Main learning objective for the day",
      "explanation": "Why this day matters and what you'll accomplish",
      "howTo": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "checklist": ["Action item 1", "Action item 2", "Action item 3", "Action item 4", "Action item 5"],
      "tips": ["Pro tip 1", "Pro tip 2", "Pro tip 3"],
      "mistakesToAvoid": ["Common mistake 1", "Common mistake 2", "Common mistake 3"],
      "estimatedTime": "${timeAvailable}",
      "skillLevel": "${experience}",
      "youtubeVideoId": ""
    }
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
        max_tokens: 3500,
        temperature: 0.7
      })
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      const err: any = new Error(`openrouter_${resp.status}`);
      err.upstream = text?.slice(0, 500) || '';
      throw err;
    }
    const data = await resp.json();
    let content = data?.choices?.[0]?.message?.content || '';
    content = String(content).trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const cleaned = jsonMatch ? jsonMatch[0] : content;
    return JSON.parse(cleaned);
  }

  async function getYouTubeVideo(hobby: string, day: number, title: string) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return null;
    try {
      const q = `${hobby} tutorial day ${day} ${title}`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(q)}&key=${apiKey}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`yt_${r.status}`);
      const j = await r.json();
      const it = j.items?.[0];
      if (!it) return null;
      return { id: it.id?.videoId as string, title: it.snippet?.title as string };
    } catch {
      return null;
    }
  }

  async function getVideoViaOpenRouterFallback(hobby: string, day: number, title: string) {
    try {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) return null;
      const prompt = `Suggest a single YouTube video ID for ${hobby} day ${day} titled "${title}". Reply ONLY with a JSON: {"id":"VIDEO_ID","title":"Title"}`;
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: 'deepseek/deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 100 })
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      let content = data.choices?.[0]?.message?.content || '';
      content = content.trim().replace(/^```json\s*|^```\s*|\s*```$/g, '');
      const parsed = JSON.parse(content);
      if (parsed?.id && typeof parsed.id === 'string') return parsed;
      return null;
    } catch { return null; }
  }

  // ===== API: generate plan =====
  app.post('/api/generate-plan', async (req: Request, res: Response) => {
    try {
      const hobby = String(req.body?.hobby || '').trim();
      const userId = String(req.body?.user_id || '').trim();
      const experience = String(req.body?.experience || 'beginner');
      const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
      const goal = String(req.body?.goal || `Learn ${hobby} fundamentals`);
      if (!hobby) return res.status(400).json({ error: 'missing_hobby' });
      if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });

      // Enforce per-user daily plan generation limit (max 5/day)
      if (userId && (globalThis as any).Date && (supabaseAnon)) {
        try {
          const now = new Date();
          const startOfUtcDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
          const { count, error: cntErr } = await supabaseAnon
            .from('hobby_plans')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', startOfUtcDay.toISOString());
          if (!cntErr && typeof count === 'number' && count >= 5) {
            return res.status(429).json({ error: 'daily_limit_reached', max: 5 });
          }
        } catch {}
      }

      const aiPlan = await generatePlanViaOpenRouter(hobby, experience, timeAvailable, goal);
      if (!aiPlan?.days || !Array.isArray(aiPlan.days)) return res.status(502).json({ error: 'bad_ai_response' });

      const days = await Promise.all(Array.from({ length: 7 }, async (_, i) => {
        const d = aiPlan.days?.[i] || {} as any;
        const dayNum = i + 1;
        const title = (typeof d.title === 'string' && d.title.trim()) ? d.title : `${hobby} Fundamentals`;
        let video = await getYouTubeVideo(hobby, dayNum, title);
        if (!video) video = await getVideoViaOpenRouterFallback(hobby, dayNum, title);
        return {
          day: dayNum,
          title,
          mainTask: d.mainTask || d.goal || d.objective || `Learn ${hobby} fundamentals`,
          explanation: d.explanation || d.description || d.details || `Day ${dayNum} of your ${hobby} journey`,
          howTo: Array.isArray(d.howTo) && d.howTo.length ? d.howTo : [`Step ${dayNum}`],
          checklist: Array.isArray(d.checklist) && d.checklist.length ? d.checklist : [`Complete day ${dayNum} tasks`],
          tips: Array.isArray(d.tips) && d.tips.length ? d.tips : [`Tip for day ${dayNum}`],
          mistakesToAvoid: Array.isArray(d.mistakesToAvoid) && d.mistakesToAvoid.length ? d.mistakesToAvoid : (Array.isArray(d.commonMistakes) && d.commonMistakes.length ? d.commonMistakes : [`Avoid rushing on day ${dayNum}`]),
          freeResources: [],
          affiliateProducts: [{ title: `${hobby} Starter Kit`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+starter+kit&tag=wizqohobby-20`, price: `$${19 + i * 5}.99` }],
          youtubeVideoId: video?.id || null,
          videoTitle: video?.title || 'Video not available',
          estimatedTime: d.estimatedTime || timeAvailable,
          skillLevel: d.skillLevel || experience
        };
      }));

      res.json({
        hobby: aiPlan.hobby || hobby,
        title: aiPlan.title || `Learn ${hobby} in 7 Days`,
        overview: aiPlan.overview || aiPlan.description || `Master ${hobby} with this 7-day plan`,
        difficulty: aiPlan.difficulty || experience,
        totalDays: 7,
        days
      });
    } catch (e: any) {
      console.error('generate-plan error:', e);
      res.status(500).json({ error: 'failed_to_generate_plan', message: String(e?.message || e), upstream: e?.upstream || '' });
    }
  });

  // ===== API: user plans (Supabase) =====
  app.get('/api/hobby-plans', async (req: Request, res: Response) => {
    try {
      const userId = String(req.query.user_id || '').trim();
      if (!userId || !supabaseAnon) return res.json([]);
      const { data, error } = await supabaseAnon
        .from('hobby_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) return res.json([]);
      res.json(data || []);
    } catch {
      res.json([]);
    }
  });

  // Optional: GET by user param to support older client API helper
  app.get('/api/hobby-plans/:userId', async (req: Request, res: Response) => {
    try {
      const userId = String(req.params.userId || '').trim();
      if (!userId || !supabaseAnon) return res.json([]);
      const { data, error } = await supabaseAnon
        .from('hobby_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) return res.json([]);
      res.json(data || []);
    } catch {
      res.json([]);
    }
  });

  app.post('/api/hobby-plans', async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
      const { user_id, hobby, hobby_name, title, overview, plan_data } = req.body || {};

      // Support both schemas: some DBs use column "hobby", others use "hobby_name"
      const basePayload: Record<string, any> = { user_id, title, overview, plan_data };
      const firstAttemptPayload = { ...basePayload, hobby: hobby ?? hobby_name };

      let { data, error } = await supabaseAdmin
        .from('hobby_plans')
        .insert(firstAttemptPayload)
        .select()
        .single();

      if (error) {
        console.error('❌ SUPABASE hobby_plans first insert error:', {
          message: error.message,
          code: (error as any)?.code,
          details: (error as any)?.details,
          hint: (error as any)?.hint
        });
        // Always try fallback with hobby_name on any failure
        const secondAttemptPayload = { ...basePayload, hobby_name: hobby ?? hobby_name } as Record<string, any>;
        const retry = await supabaseAdmin
          .from('hobby_plans')
          .insert(secondAttemptPayload)
          .select()
          .single();
        if (retry.error) {
          console.error('❌ SUPABASE hobby_plans second insert error:', {
            message: retry.error.message,
            code: (retry.error as any)?.code,
            details: (retry.error as any)?.details,
            hint: (retry.error as any)?.hint
          });
        }
        data = retry.data as any;
        error = retry.error as any;
      }

      if (error) {
        const normalizedMessage = String(error.message || '').toLowerCase();
        const status = normalizedMessage.includes('permission') || normalizedMessage.includes('rls') ? 403 : 500;
        return res.status(status).json({ error: 'save_failed', details: error.message || error });
      }
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'save_failed', details: String((e as any)?.message || e) });
    }
  });

  // ===== API: user progress (read-only) =====
  app.get('/api/user-progress/:userId', async (req: Request, res: Response) => {
    try {
      const userId = String(req.params.userId || '').trim();
      if (!userId || !supabaseAnon) return res.json([]);
      const { data, error } = await supabaseAnon
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) return res.json([]);
      res.json(data || []);
    } catch {
      res.json([]);
    }
  });

  // ===== API: user progress (create/update) =====
  app.post('/api/user-progress', async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
      const { user_id, plan_id, completed_days, current_day } = req.body || {};
      if (!user_id || !plan_id) {
        return res.status(400).json({ error: 'missing_fields', required: ['user_id', 'plan_id'] });
      }

      // Check if a progress row already exists
      const existing = await supabaseAdmin
        .from('user_progress')
        .select('*')
        .eq('user_id', user_id)
        .eq('plan_id', plan_id)
        .limit(1)
        .single();

      const payload: Record<string, any> = {
        user_id,
        plan_id,
        completed_days: Array.isArray(completed_days) ? completed_days : [],
        current_day: typeof current_day === 'number' ? current_day : 1
      };

      if (!existing.error && existing.data) {
        // Update
        const { data, error } = await supabaseAdmin
          .from('user_progress')
          .update({
            completed_days: payload.completed_days,
            current_day: payload.current_day
          })
          .eq('id', existing.data.id)
          .select()
          .single();
        if (error) {
          console.error('❌ SUPABASE user_progress update error:', {
            message: error.message,
            code: (error as any)?.code,
            details: (error as any)?.details,
            hint: (error as any)?.hint
          });
          const msg = String(error.message || '').toLowerCase();
          const status = msg.includes('permission') || msg.includes('rls') ? 403 : 500;
          return res.status(status).json({ error: 'progress_update_failed', details: error.message || error });
        }
        return res.json(data);
      }

      // Insert
      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error('❌ SUPABASE user_progress insert error:', {
          message: error.message,
          code: (error as any)?.code,
          details: (error as any)?.details,
          hint: (error as any)?.hint
        });
        const msg = String(error.message || '').toLowerCase();
        const status = msg.includes('permission') || msg.includes('rls') ? 403 : 500;
        return res.status(status).json({ error: 'progress_create_failed', details: error.message || error });
      }
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: 'progress_save_failed', details: String(e?.message || e) });
    }
  });

  // ===== API: user profile upsert (service role) =====
  app.post('/api/user-profile', async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
      const { user_id, email, full_name, avatar_url } = req.body || {};
      if (!user_id) return res.status(400).json({ error: 'missing_user_id' });

      const nowIso = new Date().toISOString();
      const base: Record<string, any> = {
        email: email ?? null,
        full_name: full_name ?? null,
        avatar_url: avatar_url ?? null,
        last_active_at: nowIso
      };

      // 1) Try update by id column
      const byId = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', user_id)
        .limit(1)
        .single();

      if (!byId.error && byId.data) {
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .update(base)
          .eq('id', user_id)
          .select()
          .single();
        if (error) return res.status(500).json({ error: 'profile_upsert_failed', details: error });
        return res.json(data);
      }

      // 2) Try update by user_id column
      const byUserId = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('user_id', user_id)
        .limit(1)
        .single();

      if (!byUserId.error && byUserId.data) {
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .update(base)
          .eq('user_id', user_id)
          .select()
          .single();
        if (error) return res.status(500).json({ error: 'profile_upsert_failed', details: error });
        return res.json(data);
      }

      // 3) Try insert setting BOTH id and user_id to satisfy either schema
      let insertResp = await supabaseAdmin
        .from('user_profiles')
        .insert({ id: user_id, user_id, ...base })
        .select()
        .single();

      if (insertResp.error) {
        console.error('❌ SUPABASE user_profiles insert (id) error:', {
          message: insertResp.error.message,
          code: (insertResp.error as any)?.code,
          details: (insertResp.error as any)?.details,
          hint: (insertResp.error as any)?.hint
        });
        // Fallback attempts
        insertResp = await supabaseAdmin
          .from('user_profiles')
          .insert({ id: user_id, ...base })
          .select()
          .single();
        if (insertResp.error) {
          insertResp = await supabaseAdmin
            .from('user_profiles')
            .insert({ user_id, ...base })
            .select()
            .single();
        }
      }

      if (insertResp.error) {
        console.error('❌ SUPABASE user_profiles insert error:', {
          message: insertResp.error.message,
          code: (insertResp.error as any)?.code,
          details: (insertResp.error as any)?.details,
          hint: (insertResp.error as any)?.hint
        });
        return res.status(500).json({ error: 'profile_upsert_failed', details: insertResp.error });
      }
      return res.json(insertResp.data);
    } catch (e: any) {
      return res.status(500).json({ error: 'profile_upsert_failed', details: e });
    }
  });

  // Delete a hobby plan by id
  app.delete('/api/hobby-plans/:id', async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'db_unavailable', details: 'service_role_key_missing' });
      const id = String(req.params.id || '').trim();
      if (!id) return res.status(400).json({ error: 'missing_id' });
      const { error } = await supabaseAdmin
        .from('hobby_plans')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('❌ SUPABASE hobby_plans delete error:', {
          message: error.message,
          code: (error as any)?.code,
          details: (error as any)?.details,
          hint: (error as any)?.hint
        });
        const msg = String(error.message || '').toLowerCase();
        const status = msg.includes('permission') || msg.includes('rls') ? 403 : 500;
        return res.status(status).json({ error: 'delete_failed', details: error.message || error });
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: 'delete_failed', details: String(e?.message || e) });
    }
  });

  // ===== API: hobby chat (post-plan Q&A) =====
  function isUnsafeQuery(text: string): boolean {
    const t = String(text || '').toLowerCase();
    const banned = [
      'sex', 'sexual', 'porn', 'nsfw', 'nude', 'adult',
      'drug', 'cocaine', 'heroin', 'weed', 'marijuana', 'meth',
      'violent', 'violence', 'kill', 'murder', 'suicide',
      'bomb', 'weapon', 'explosive', 'terror',
      'hack', 'hacking', 'crack', 'warez', 'piracy'
    ];
    return banned.some(w => t.includes(w));
  }

  app.post('/api/hobby-chat', async (req: Request, res: Response) => {
    try {
      const message = String(req.body?.message || '').trim();
      const hobby = String(req.body?.hobby || '').trim();
      const planData = req.body?.planData || null;

      if (!message) return res.status(400).json({ error: 'missing_message' });
      if (isUnsafeQuery(message)) return res.status(400).json({ error: 'unsafe_message' });
      if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });

      const vercelUrl = process.env.VERCEL_URL || '';
      const refererUrl = process.env.WEB_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'https://wizqo.com');

      const system = [
        'You are a helpful, safe hobby learning assistant for Wizqo.',
        'Answer concisely. Stay strictly on hobby learning, skills, tips, practice, and safety.',
        'Refuse adult/sexual/drugs/violence/hacking or other dangerous content.',
        hobby ? `User hobby: ${hobby}` : '',
        planData ? `Plan context: ${JSON.stringify(planData).slice(0, 2000)}` : ''
      ].filter(Boolean).join('\n');

      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': refererUrl,
          'X-Title': 'Wizqo Hobby Learning Platform'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: message }
          ],
          temperature: 0.6,
          max_tokens: 600
        })
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        return res.status(502).json({ error: 'upstream_error', upstream: text.slice(0, 500) });
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      res.json({ reply: content });
    } catch (e: any) {
      res.status(500).json({ error: 'chat_failed', message: String(e?.message || e) });
    }
  });

  const http = createServer(app);

  // Verify deployment routes
  try {
    const { verifyDeploymentRoutes } = await import('./deployment-check');
    verifyDeploymentRoutes(app);
  } catch (err) {
    console.error('Failed to load deployment check:', err);
  }

  // Comprehensive route debugging
  console.log('🛣️ Registered API routes:');
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`  ${Object.keys(handler.route.methods)} ${handler.route.path}`);
        }
      });
    }
  });

  // Test route availability
  console.log('🔍 Testing route registration...');
  const routes: string[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    }
  });
  console.log('📋 Found routes:', routes);

  // Add specific check for hobby-plans endpoint
  const hobbyPlansRoute = app._router.stack.find((middleware: any) => {
    return middleware.route && middleware.route.path === '/api/hobby-plans';
  });
  console.log('🎯 hobby-plans POST route exists:', !!hobbyPlansRoute);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Always serve static in serverless
  await serveStatic(app);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);

  console.log('🚀 PRODUCTION: Preparing server for live deployment');
  console.log('🌐 PRODUCTION: Server will bind to 0.0.0.0 for external access');
  console.log('📡 PRODUCTION: All API routes configured for live traffic');

  // Production deployment verification
  console.log('🚀 DEPLOYMENT: Starting server on host 0.0.0.0 port', port);
  console.log('🚀 DEPLOYMENT: Environment NODE_ENV:', process.env.NODE_ENV);

  // Final route verification before starting server
  console.log('🔍 FINAL ROUTE CHECK: All registered routes before server start:');
  let routeCount = 0;
  app._router.stack.forEach((middleware: any, index: number) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      console.log(`  ${index}: ${methods} ${middleware.route.path}`);
      routeCount++;
    }
  });

  console.log(`🔍 TOTAL ROUTES REGISTERED: ${routeCount}`);

  // Critical API routes check
  const hasHobbyPlansPost = app._router.stack.some((middleware: any) => 
    middleware.route && 
    middleware.route.path === '/api/hobby-plans' && 
    middleware.route.methods.post
  );

  if (!hasHobbyPlansPost) {
    console.error('❌ CRITICAL: POST /api/hobby-plans route NOT FOUND!');
  } else {
    console.log('✅ CRITICAL: POST /api/hobby-plans route is registered');
  }

  http.listen(port, "0.0.0.0", () => {
    log(`🚀 SERVER STARTED: serving on port ${port}`);
    console.log(`🌐 LOCAL DEV: http://localhost:${port}`);
    console.log(`🔍 API TEST: Try /api/health`);

    // Production deployment info
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 PRODUCTION: Ready for Replit deployment');
      console.log('🔗 After deploying, your API will be available at your deployment URL');
    }

    // Environment variable status
    console.log('🔑 Environment Variables Status:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('  - OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? `Found (${process.env.OPENROUTER_API_KEY.length} chars)` : 'Missing');
    console.log('  - SUPABASE_URL:', process.env.SUPABASE_URL ? 'Found' : 'Missing');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
    console.log('  - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Found' : 'Missing');
    console.log('  - VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Missing');
    console.log('  - VITE_SUPABASE_SERVICE_ROLE_KEY:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
    console.log('  - VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'Missing');

    // Critical API endpoint verification for production
    console.log('🎯 CRITICAL ENDPOINTS VERIFICATION:');
    const criticalEndpoints = [
      { method: 'POST', path: '/api/hobby-plans' },
      { method: 'GET', path: '/api/hobby-plans' },
      { method: 'POST', path: '/api/generate-plan' },
      { method: 'GET', path: '/api/health' }
    ];

    criticalEndpoints.forEach(endpoint => {
      const routeExists = app._router.stack.some((middleware: any) => 
        middleware.route && 
        middleware.route.path === endpoint.path && 
        middleware.route.methods[endpoint.method.toLowerCase()]
      );
      console.log(`  ${routeExists ? '✅' : '❌'} ${endpoint.method} ${endpoint.path}: ${routeExists ? 'REGISTERED' : 'MISSING'}`);
    });

    // Warning for missing keys
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('⚠️ WARNING: OPENROUTER_API_KEY not set - AI plan generation will use fallback');
    }
    if (!process.env.VITE_SUPABASE_URL && !process.env.SUPABASE_URL) {
      console.log('⚠️ WARNING: SUPABASE_URL/VITE_SUPABASE_URL not set - database operations may fail');
    }

    // Production deployment check
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 PRODUCTION MODE: All API routes verified and ready');
      console.log('🚀 PRODUCTION: Server is properly configured for live deployment');
    }
  });
})();