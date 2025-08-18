import type { Express } from "express";
import { createServer, type Server } from "http";
import { createClient } from '@supabase/supabase-js';
import { sendContactEmail } from './email.js';
import { getTargetedYouTubeVideo, getVideoDetails } from './videoSelection.js';

// Supabase client for all database operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('📖 API: Supabase client initialized for all database operations');
} else {
  console.error('❌ Supabase configuration missing. Please provide SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Database helper functions using Supabase
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

async function getHobbyPlans(user_id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase
      .from('hobby_plans')
      .select('id, user_id, hobby, title, overview, plan_data, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase select error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Supabase hobby plans fetch error:', error);
    return [];
  }
}

async function createUserProgress(user_id: string, plan_id: number, completed_days: number[], current_day: number, unlocked_days: number[]) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // First try to update existing progress
    const { data: existingProgress, error: selectError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user_id)
      .eq('plan_id', plan_id)
      .single();
    
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          completed_days,
          current_day,
          unlocked_days,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .eq('plan_id', plan_id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase progress update error:', error);
        throw error;
      }
      
      return data;
    } else {
      // Insert new progress
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id,
          plan_id,
          completed_days,
          current_day,
          unlocked_days
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase progress insert error:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Supabase user progress error:', error);
    throw error;
  }
}

async function getUserProgress(user_id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('id, user_id, plan_id, completed_days, current_day, unlocked_days, last_accessed_at')
      .eq('user_id', user_id);
    
    if (error) {
      console.error('Supabase progress select error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Supabase user progress fetch error:', error);
    return [];
  }
}

// Simple YouTube video mapping for each hobby
function getYouTubeVideos(hobby: string): string[] {
  const videoMappings: Record<string, string[]> = {
    guitar: [
      "3jWRrafhO7M", // Basic guitar tutorial
      "F0MEjx8k--c", // First chords
      "qy6YSrML1lk", // Strumming patterns
      "73s6RdLZiow", // First song
      "1EPNYWeEf1U", // More chords
      "4k8hP7RTPEY", // Fingerpicking
      "BW8s8esjFnY"  // Performance
    ],
    cooking: [
      "4nqJiBRNQuw", // Kitchen basics
      "RF5ZzhGQWsc", // Knife skills
      "1sj_XMzbn5M", // Basic techniques
      "ZzaPdXTrSb8", // First meal
      "6QV3ZIdMo1U", // Advanced skills
      "vhX3A8YcNUY", // Complex dishes
      "1aXZQcG2Y6I"  // Menu planning
    ],
    drawing: [
      "ewMksAbgdBI", // Basic shapes and lines
      "8dmVGNBK7_Q", // Perspective drawing
      "V3WmrWUEIJo", // Shading techniques
      "73s6RdLZiow", // Gesture drawing
      "1EPNYWeEf1U", // Drawing faces
      "4k8hP7RTPEY", // Different media
      "BW8s8esjFnY"  // Portrait techniques
    ],
    coding: [
      "zOjov-2OZ0E", // Programming basics - freeCodeCamp
      "rfscVS0vtbw", // Learn Programming - Python
      "8jLOx1hD3_o", // Variables and Data Types
      "AWek49wXGzI", // Conditionals - if/else
      "6iF8Xb7Z3wQ", // Loops - for/while
      "R9I85RhI7Cg", // Functions and Methods
      "8ext9G7xspg"  // First coding project
    ],
    yoga: [
      "v7AYKMP6rOE", // Breathing
      "73s6RdLZiow", // Sun salutations
      "4k8hP7RTPEY", // Standing poses
      "BW8s8esjFnY", // Seated poses
      "FaUIDqpElLs", // Backbends
      "1EPNYWeEf1U", // Inversions
      "V3WmrWUEIJo"  // Personal practice
    ],
    gardening: [
      "LkOv1pUlwkw", // Garden basics
      "0LAfHqZ5g20", // Soil preparation
      "H_bGkbhAKS4", // Planting seeds
      "3EWy_QqAoRw", // Watering techniques
      "YX8mTFLvOOw", // Plant care
      "9j0xm7_Ng2I", // Pest control
      "DqbQzmgKhWA"  // Harvesting
    ],
    painting: [
      "M6NsEDwHHiE", // Basic painting supplies
      "UScm9O2YaMM", // Color theory basics
      "V3WmrWUEIJo", // Brush techniques
      "73s6RdLZiow", // First acrylic painting
      "1EPNYWeEf1U", // Color mixing guide
      "4k8hP7RTPEY", // Composition basics
      "BW8s8esjFnY"  // Finishing techniques
    ]
  };
  return videoMappings[hobby] || ["dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ"];
}

// AI-powered plan generation with DeepSeek
async function generateAIPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.warn('DeepSeek API key not found, using fallback plan');
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }

  try {
    const prompt = `Generate a detailed, motivating, and experience-level-appropriate 7-day learning plan for the hobby: ${hobby}

User Details:
- Experience Level: ${experience}
- Time Available: ${timeAvailable}  
- Specific Goal: ${goal}

Please create a JSON response with exactly this structure:
{
  "title": "7-Day ${hobby} Learning Journey",
  "description": "A personalized plan for ${experience} learners",
  "days": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "mainTask": "Clear, specific task for the day",
      "explanation": "Why this day's focus is important for building skills",
      "howTo": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "checklist": ["Item needed 1", "Item needed 2", "Item needed 3", "Item needed 4", "Item needed 5"],
      "tips": ["Helpful tip 1", "Helpful tip 2", "Helpful tip 3"],
      "commonMistakes": ["Common mistake 1", "Common mistake 2", "Common mistake 3"],
      "estimatedTime": "${timeAvailable}",
      "skillLevel": "${experience}"
    }
  ]
}

Make each day build progressively on the previous day. Include practical, actionable steps.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    const aiPlan = JSON.parse(content);
    
    // Add targeted YouTube videos to each day with precise video matching
    aiPlan.days = aiPlan.days.map((day: any, index: number) => {
      const targetedVideoId = getTargetedYouTubeVideo(hobby, day.title, day.mainTask, experience);
      const videoDetails = getVideoDetails(hobby, experience, day.day);
      
      return {
        ...day,
        // Ensure commonMistakes field exists (AI may use different field names)
        commonMistakes: day.commonMistakes || day.mistakesToAvoid || [
          `Rushing through exercises without understanding concepts`,
          `Skipping practice time or cutting sessions short`,
          `Not taking notes or tracking your improvement`
        ],
        youtubeVideoId: targetedVideoId,
        videoTitle: videoDetails?.title || `${day.title} - ${hobby} Tutorial`,
        freeResources: [{
          title: videoDetails?.title || `${day.title} Tutorial`,
          link: `https://youtube.com/watch?v=${targetedVideoId}`
        }],
        affiliateProducts: [{
          title: `${hobby} Essential Kit`,
          link: `https://amazon.com/dp/B${index + 1}234?tag=wizqo-20`,
          price: `$${19 + index * 5}.99`
        }]
      };
    });

    // Ensure hobby field is included in the response
    aiPlan.hobby = hobby;
    return aiPlan;

  } catch (error) {
    console.error('DeepSeek API error:', error);
    console.log('⚠️ DeepSeek API failed, using fallback plan generation');
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }
}

// Removed stray duplicate targeted videos block that caused syntax errors

// Fallback plan generator
async function generateFallbackPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  
  const plan = {
    hobby: hobby,
    title: `7-Day ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Learning Journey`,
    description: `A comprehensive ${hobby} learning plan tailored for ${experience} learners`,
    days: await Promise.all(Array.from({ length: 7 }, async (_, i) => {
      const dayTitle = `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Fundamentals - Day ${i + 1}`;
      const targetedVideoId = await getTargetedYouTubeVideo(hobby, dayTitle, `Learn essential ${hobby} techniques`, experience);
      
        return {
          day: i + 1,
          title: dayTitle,
          mainTask: `Learn essential ${hobby} techniques and practice hands-on exercises with detailed instruction.`,
          explanation: `Day ${i + 1} focuses on building your foundation in ${hobby} with practical exercises that build on previous learning.`,
          howTo: [
        `Start with basic ${hobby} concepts and terminology`,
        `Practice fundamental techniques with step-by-step guidance`,
        `Complete hands-on exercises designed for ${experience} level`,
        `Review and refine your skills through deliberate practice`,
        `Document your progress and identify areas for improvement`
      ],
          checklist: [
        `All necessary ${hobby} equipment and materials ready`,
        `Comfortable practice space set up appropriately`,
        `Reference materials and guides easily accessible`,
        `Timer for focused practice sessions`,
        `Method to track progress and take notes`
      ],
          tips: [
        `Take your time with each exercise - quality over speed`,
        `Don't be afraid to repeat difficult parts multiple times`,
        `Practice regularly in short sessions rather than long marathons`
      ],
          commonMistakes: [
        `Rushing through exercises without understanding concepts`,
        `Skipping practice time or cutting sessions short`,
        `Not taking notes or tracking your improvement`
      ],
      freeResources: [{
        title: `${dayTitle} Tutorial`,
        link: `https://youtube.com/watch?v=${targetedVideoId}`
      }],
      affiliateProducts: [{
        title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Essential Kit`,
        link: `https://amazon.com/dp/B${i + 1}234?tag=wizqo-20`,
        price: `$${19 + i * 5}.99`
      }],
      youtubeVideoId: targetedVideoId,
      videoTitle: `${dayTitle} - Targeted Tutorial`,
      estimatedTime: timeAvailable,
      skillLevel: experience
    }))
  };
  
  console.log('🔍 FALLBACK PLAN GENERATED - First day commonMistakes:', plan.days[0].commonMistakes);
  console.log('🔍 FALLBACK PLAN GENERATED - First day youtubeVideoId:', plan.days[0].youtubeVideoId);
  
  return plan;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Generate hobby plan endpoint
  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { hobby, experience, timeAvailable, goal } = req.body;
      
      if (!hobby || !experience || !timeAvailable) {
        return res.status(400).json({ 
          error: 'Missing required fields: hobby, experience, timeAvailable' 
        });
      }

      const plan = await generateAIPlan(hobby, experience, timeAvailable, goal || `Learn ${hobby} fundamentals`);
      res.json(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      res.status(500).json({ error: 'Failed to generate learning plan' });
    }
  });

  // Database-backed hobby plans endpoints
  app.get('/api/hobby-plans/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('📖 API: Fetching hobby plans for user:', userId);
      
      const plans = await getHobbyPlans(userId);
      console.log('📖 API: Found', plans.length, 'plans');
      res.json(plans);
    } catch (error) {
      console.error('📖 API: Error fetching hobby plans:', error);
      res.status(500).json({ error: 'Failed to fetch hobby plans' });
    }
  });

  app.post('/api/hobby-plans', async (req, res) => {
    try {
      const { user_id, hobby, title, overview, plan_data } = req.body;
      console.log('📝 SUPABASE: Creating hobby plan for user:', user_id, 'hobby:', hobby);
      console.log('🔍 DEBUG: Plan data being saved - first day commonMistakes:', plan_data?.days?.[0]?.commonMistakes);
      console.log('🔍 DEBUG: Plan data being saved - first day youtubeVideoId:', plan_data?.days?.[0]?.youtubeVideoId);
      
      const plan = await createHobbyPlan(user_id, hobby, title, overview, plan_data);
      console.log('📝 SUPABASE: Created plan with ID:', plan.id);
      res.json(plan);
    } catch (error) {
      console.error('📝 API: Error creating hobby plan:', error);
      res.status(500).json({ error: 'Failed to create hobby plan' });
    }
  });

  // Delete a hobby plan (and dependent progress via FK cascade)
  app.delete('/api/hobby-plans/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.query as any;
      if (!id || !user_id) {
        return res.status(400).json({ error: 'id and user_id are required' });
      }
      if (!supabase) {
        return res.status(500).json({ error: 'Supabase not connected' });
      }
      console.log('🗑️ API: Deleting hobby plan', id, 'for user', user_id);
      const { error } = await supabase.from('hobby_plans').delete().match({ id, user_id });
      if (error) {
        console.error('🗑️ Supabase delete error:', error);
        return res.status(500).json({ error: 'Failed to delete plan' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error('🗑️ API: Error deleting hobby plan:', err);
      res.status(500).json({ error: 'Failed to delete hobby plan' });
    }
  });

  // User progress tracking endpoints
  app.get('/api/user-progress/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('📖 API: Fetching user progress for:', userId);
      
      const progress = await getUserProgress(userId);
      console.log('📖 API: Found', progress.length, 'progress entries');
      res.json(progress);
    } catch (error) {
      console.error('📖 API: Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  });

  app.post('/api/user-progress', async (req, res) => {
    try {
      const { user_id, plan_id, completed_days, current_day, unlocked_days } = req.body;
      console.log('📝 SUPABASE: Creating/updating user progress for:', user_id, 'plan:', plan_id);
      
      const progress = await createUserProgress(user_id, plan_id, completed_days, current_day, unlocked_days);
      console.log('📝 SUPABASE: Updated progress for plan:', plan_id);
      res.json(progress);
    } catch (error) {
      console.error('📝 API: Error updating user progress:', error);
      res.status(500).json({ error: 'Failed to update user progress' });
    }
  });

  // Database setup endpoint - creates tables using PostgreSQL client
  app.post('/api/setup-supabase-tables', async (req, res) => {
    try {
      console.log('🔧 Creating Supabase tables via direct SQL execution...');
      
      if (!supabase) {
        return res.status(500).json({ error: 'Supabase not connected' });
      }

      // Try direct SQL execution using Supabase RPC
      const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS public.hobby_plans (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          hobby TEXT NOT NULL,
          title TEXT NOT NULL,
          overview TEXT NOT NULL,
          plan_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS public.user_progress (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          plan_id INTEGER REFERENCES public.hobby_plans(id) ON DELETE CASCADE,
          completed_days JSONB NOT NULL DEFAULT '[]',
          current_day INTEGER NOT NULL DEFAULT 1,
          unlocked_days JSONB NOT NULL DEFAULT '[1]',
          last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON public.hobby_plans(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON public.user_progress(plan_id);
      `;

      console.log('🔧 Executing table creation SQL...');
      
      // Split SQL into individual statements and execute them one by one
      const statements = createTablesSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      const results = [];
      for (const statement of statements) {
        try {
          console.log(`🔧 Executing: ${statement.substring(0, 50)}...`);
          // Use basic select to verify connection, then attempt table creation
          const { error } = await supabase.rpc('exec', { query: statement });
          
          if (error) {
            console.log(`🔧 Error in statement: ${error.message}`);
            results.push({ 
              statement: statement.substring(0, 100) + '...', 
              success: false, 
              error: error.message 
            });
          } else {
            console.log(`🔧 Statement executed successfully`);
            results.push({ 
              statement: statement.substring(0, 100) + '...', 
              success: true 
            });
          }
        } catch (e) {
          console.log(`🔧 Exception in statement: ${e.message}`);
          results.push({ 
            statement: statement.substring(0, 100) + '...', 
            success: false, 
            error: e.message 
          });
        }
      }

      // Try to verify if tables were created
      try {
        const { data: hobbyPlansTest } = await supabase
          .from('hobby_plans')
          .select('id')
          .limit(1);
        
        const { data: userProgressTest } = await supabase
          .from('user_progress')
          .select('id')
          .limit(1);

        console.log('🔧 Table verification - hobby_plans accessible:', hobbyPlansTest !== null);
        console.log('🔧 Table verification - user_progress accessible:', userProgressTest !== null);
        
        res.json({
          message: 'Database setup completed',
          results,
          verification: {
            hobby_plans_accessible: hobbyPlansTest !== null,
            user_progress_accessible: userProgressTest !== null
          }
        });
      } catch (verificationError) {
        console.log('🔧 Table verification failed:', verificationError);
        res.json({
          message: 'Database setup attempted but verification failed',
          results,
          verification_error: verificationError.message,
          note: 'Tables may need to be created manually in Supabase dashboard'
        });
      }

    } catch (error) {
      console.error('🔧 Database setup error:', error);
      res.status(500).json({ error: 'Failed to setup database', details: error.message });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'All fields (name, email, subject, message) are required' 
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please provide a valid email address' 
        });
      }

      // Send email
      const emailSent = await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      if (emailSent) {
        console.log(`📧 Contact form message sent from: ${email}`);
        res.json({ 
          success: true, 
          message: 'Thank you for your message! We\'ll get back to you soon.' 
        });
      } else {
        console.error('📧 Failed to send contact form email');
        res.status(500).json({ 
          success: false, 
          error: 'Unable to send message. Please try again later or email us directly at wizqo2024@gmail.com' 
        });
      }
    } catch (error) {
      console.error('📧 Contact form error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Server error. Please try again later.' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}