import type { Express } from "express";
import { createServer, type Server } from "http";
import { createClient } from '@supabase/supabase-js';
import { sendContactEmail } from './email.js';
import { getTargetedYouTubeVideo, getVideoDetails } from './videoSelection.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('📖 API: Supabase client initialized for all database operations');
} else {
  console.error('❌ Supabase configuration missing. Please provide SUPABASE_URL and SUPABASE_ANON_KEY');
}

async function createHobbyPlan(user_id: string, hobby: string, title: string, overview: string, plan_data: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('hobby_plans')
      .insert({
        user_id,
        hobby,
        title,
        overview,
        plan_data
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Supabase hobby plan creation error:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { hobby, experience, timeAvailable, goal } = req.body;

      if (!hobby || !experience || !timeAvailable) {
        return res.status(400).json({ 
          error: 'Missing required fields: hobby, experience, timeAvailable' 
        });
      }

      const plan = {
        hobby,
        title: `7-Day ${hobby} Learning Journey`,
        overview: `Learn ${hobby} in just 7 days with this comprehensive plan.`,
        difficulty: experience,
        totalDays: 7,
        days: Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1}: ${hobby} Basics`,
          mainTask: `Learn essential ${hobby} skills`,
          explanation: `Build your foundation in ${hobby}`,
          howTo: [`Step 1`, `Step 2`, `Step 3`],
          checklist: [`Item 1`, `Item 2`, `Item 3`],
          tips: [`Tip 1`, `Tip 2`, `Tip 3`],
          mistakesToAvoid: [`Mistake 1`, `Mistake 2`, `Mistake 3`],
          commonMistakes: [`Common mistake 1`, `Common mistake 2`, `Common mistake 3`],
          freeResources: [{ title: 'Tutorial', link: 'https://youtube.com' }],
          affiliateProducts: [{ title: 'Tool', link: 'https://amazon.com', price: '$19.99' }],
          youtubeVideoId: '3jWRrafhO7M',
          videoTitle: `${hobby} Tutorial`,
          estimatedTime: timeAvailable,
          skillLevel: experience
        }))
      };

      res.json(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      res.status(500).json({ error: 'Failed to generate learning plan' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}