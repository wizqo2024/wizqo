import type { Express } from "express";
import { createServer, type Server } from "http";
import { createClient } from '@supabase/supabase-js';

// Supabase service client (server-side)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null as any;

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
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3500,
      temperature: 0.7
    })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    console.error('OpenRouter error status:', resp.status, text?.slice(0, 200));
    throw new Error(`openrouter_${resp.status}`);
  }
  const data = await resp.json();
  let content = data?.choices?.[0]?.message?.content || '';
  content = String(content).trim();
  // Strip markdown fences if present
  content = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  // Try to find the outermost JSON object
  let cleaned = content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse failed. Raw content (first 300 chars):', content.slice(0, 300));
    throw new Error('openrouter_invalid_json');
  }
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
  } catch (e) {
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.post('/api/generate-plan', async (req, res) => {
    try {
      const hobby = String(req.body?.hobby || '').trim();
      const experience = String(req.body?.experience || 'beginner');
      const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
      const goal = String(req.body?.goal || `Learn ${hobby} fundamentals`);

      if (!hobby) return res.status(400).json({ error: 'missing_hobby' });
      if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({ error: 'missing_api_keys', missing: ['OPENROUTER_API_KEY'] });
      const aiPlan = await generatePlanViaOpenRouter(hobby, experience, timeAvailable, goal);
      if (!aiPlan?.days || !Array.isArray(aiPlan.days)) return res.status(502).json({ error: 'bad_ai_response' });

      const days = await Promise.all(Array.from({ length: 7 }, async (_, i) => {
        const d = aiPlan.days?.[i] || {} as any;
        const dayNum = i + 1;
        const title = (typeof d.title === 'string' && d.title.trim()) ? d.title : `${hobby} Fundamentals`;
        let video = await getYouTubeVideo(hobby, dayNum, title);
        if (!video) {
          // try OpenRouter to suggest a video id/title
          video = await getVideoViaOpenRouterFallback(hobby, dayNum, title);
        }
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
      res.status(500).json({ error: 'failed_to_generate_plan', message: String(e?.message || e) });
    }
  });

  app.get('/api/hobby-plans', async (req, res) => {
    try {
      const userId = String(req.query.user_id || '');
      if (!userId || !supabase) return res.json([]);
      const { data, error } = await supabase.from('hobby_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) return res.json([]);
      res.json(data || []);
    } catch { res.json([]); }
  });

  app.post('/api/hobby-plans', async (req, res) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'db_unavailable' });
      const { user_id, hobby, title, overview, plan_data } = req.body || {};
      const { data, error } = await supabase.from('hobby_plans').insert({ user_id, hobby, title, overview, plan_data }).select().single();
      if (error) return res.status(500).json({ error: 'save_failed' });
      res.json(data);
    } catch (e) { res.status(500).json({ error: 'save_failed' }); }
  });

  app.delete('/api/hobby-plans/:id', async (req, res) => {
    try {
      if (!supabase) return res.json({ success: true });
      const id = req.params.id;
      await supabase.from('hobby_plans').delete().eq('id', id);
      res.json({ success: true });
    } catch { res.json({ success: true }); }
  });

  const httpServer = createServer(app);
  return httpServer;
}

