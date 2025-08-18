import express from "express";

const app = express();
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running - TEST VERSION',
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Lightweight hobby validation for chat flow
app.post('/api/validate-hobby', async (req, res) => {
  try {
    const input = String(req.body?.hobby || '').trim();
    if (!input) return res.json({ isValid: false, suggestions: ['guitar','cooking','drawing','yoga','photography','coding'] });

    // Simple normalization and whitelist
    const normalized = input.toLowerCase();
    const whitelist = ['guitar','cooking','drawing','photography','yoga','coding','piano','singing','painting','gardening','dance'];
    const correctedHobby = normalized.replace(/\s+/g, ' ').trim();
    const isValid = whitelist.includes(correctedHobby);

    if (isValid) {
      return res.json({ isValid: true, correctedHobby });
    }

    // Suggest closest matches
    const suggestions = whitelist.filter(h => h.startsWith(correctedHobby[0] || ''))
      .slice(0, 6);
    return res.json({ isValid: false, correctedHobby: undefined, suggestions });
  } catch (e: any) {
    console.error('validate-hobby error:', e);
    res.json({ isValid: false, suggestions: ['guitar','cooking','drawing','yoga','photography','coding'] });
  }
});

// Mock hobby-plans endpoint
app.get('/api/hobby-plans', (req, res) => {
  res.json([
    {
      id: 'test-plan-1',
      user_id: req.query.user_id,
      hobby: 'test-hobby',
      title: 'Test Plan',
      created_at: new Date().toISOString()
    }
  ]);
});

// Mock POST hobby-plans endpoint
app.post('/api/hobby-plans', (req, res) => {
  console.log('POST /api/hobby-plans received:', req.body);
  res.json({
    id: 'test-plan-' + Date.now(),
    user_id: req.body.user_id,
    hobby: req.body.hobby,
    title: req.body.title,
    created_at: new Date().toISOString()
  });
});

// Helpers for AI generation
const getFallbackVideoId = (hobby: string, index: number) => {
  const map: Record<string, string[]> = {
    guitar: ["3jWRrafhO7M", "F9vWVucRJzo", "7tpQr0Xh6yM", "VJPCkS-wZR4", "kXOcz1_qnXw", "w8L3f3DWlNs", "Qa7GNfwLQJo"],
    cooking: ["rtR63-ecUNo", "fBYVFCb1n6s", "L3dDHKjr_P8", "dNGgJa8r_7s", "mGz7d8xB1V8", "K2nV8JGFgh4", "u3JzYrWLJ4E"],
    drawing: ["ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk", "7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0"],
    coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "t_ispmWmdjY", "W6NZfCO5SIk", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
    yoga:  ["v7AYKMP6rOE", "xQgP8N7jCrE", "Vg5FeCTzB6w", "h8TKF2_p7qU", "AaF2lpO2IHY", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"]
  };
  const list = map[hobby.toLowerCase()] || map.cooking;
  return list[index % list.length];
};

const cleanJsonResponse = (content: string) => {
  let text = content.trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '');
  if (text.startsWith('```')) text = text.replace(/^```\s*/, '');
  if (text.endsWith('```')) text = text.replace(/\s*```$/, '');
  const match = text.match(/\{[\s\S]*\}/);
  return (match ? match[0] : text).trim();
};

const buildPrompt = (hobby: string, experience: string, timeAvailable: string, goal: string) => `Generate a comprehensive 7-day learning plan for learning ${hobby}.

User Details:
- Experience level: ${experience}
- Time available per day: ${timeAvailable}
- Learning goal: ${goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${hobby}",
  "title": "Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days",
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

async function generatePlanWithAI(hobby: string, experience: string, timeAvailable: string, goal: string) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'https://wizqo.com',
        'X-Title': 'Wizqo Hobby Learning Platform'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: buildPrompt(hobby, experience, timeAvailable, goal) }],
        max_tokens: 3500,
        temperature: 0.7
      })
    });
    if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty content');
    const parsed = JSON.parse(cleanJsonResponse(content));
    return parsed;
  } catch (e) {
    console.log('OpenRouter error:', e);
    return null;
  }
}

async function getYouTubeVideoId(hobby: string, dayNumber: number, dayTitle: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;
  try {
    const q = `${hobby} tutorial day ${dayNumber} ${dayTitle}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`YouTube ${resp.status}`);
    const data = await resp.json();
    const item = data.items?.[0];
    if (!item) return null;
    return { id: item.id?.videoId as string, title: item.snippet?.title as string };
  } catch (e) {
    console.log('YouTube search error:', e);
    return null;
  }
}

// Generate-plan endpoint (strict: no mock/fallback plan)
app.post('/api/generate-plan', async (req, res) => {
  try {
    const hobby = String(req.body?.hobby || 'hobby');
    const experience = String(req.body?.experience || 'beginner');
    const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');
    const goal = String(req.body?.goal || `Learn ${hobby} fundamentals`);

    // Enforce API keys present
    const missing: string[] = [];
    if (!process.env.OPENROUTER_API_KEY) missing.push('OPENROUTER_API_KEY');
    if (!process.env.YOUTUBE_API_KEY) missing.push('YOUTUBE_API_KEY');
    if (missing.length) {
      return res.status(503).json({ error: 'missing_api_keys', missing });
    }

    // Generate via OpenRouter
    const ai = await generatePlanWithAI(hobby, experience, timeAvailable, goal);
    if (!ai || !Array.isArray(ai.days) || ai.days.length === 0) {
      return res.status(502).json({ error: 'openrouter_failed' });
    }

    // For each day, fetch a real YouTube video (no fallback IDs)
    const enrichedDays = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const d = ai.days?.[i] || {} as any;
        const dayNum = i + 1;
        const title = (typeof d.title === 'string' && d.title.trim()) ? d.title : `${hobby} Fundamentals`;
        const yt = await getYouTubeVideoId(hobby, dayNum, title);
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
          youtubeVideoId: yt?.id,
          videoTitle: yt?.title,
          estimatedTime: d.estimatedTime || timeAvailable,
          skillLevel: d.skillLevel || experience
        };
      })
    );

    res.json({
      hobby: ai.hobby || hobby,
      title: ai.title || `Learn ${hobby} in 7 Days`,
      overview: ai.overview || ai.description || `Master ${hobby} with this 7-day plan`,
      difficulty: ai.difficulty || experience,
      totalDays: 7,
      days: enrichedDays
    });
  } catch (err: any) {
    console.error('generate-plan error:', err);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Simple test server running on port ${port}`);
});

export default app;