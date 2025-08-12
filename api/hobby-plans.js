
import { registerRoutes } from '../server/routes.js';
import express from 'express';

// Create Express app for this specific endpoint
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Register all routes
await registerRoutes(app);

// Export the handler for Vercel
export default async function handler(req, res) {
  // Set CORS headers for live deployment
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle different HTTP methods for hobby-plans
    if (req.method === 'GET') {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const { supabaseStorage } = await import('../server/supabase-storage.js');
      const plans = await supabaseStorage.getHobbyPlansByUserId(user_id);
      return res.json(plans || []);
    }

    if (req.method === 'POST') {
      const { user_id, hobby, title, overview, plan_data } = req.body;
      
      if (!user_id || !hobby || !title || !plan_data) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['user_id', 'hobby', 'title', 'plan_data'],
          received: Object.keys(req.body || {})
        });
      }

      const { supabaseStorage } = await import('../server/supabase-storage.js');
      const { insertHobbyPlanSchema } = await import('../shared/schema.js');

      const validatedData = insertHobbyPlanSchema.parse({
        userId: user_id,
        hobby,
        hobbyName: hobby,
        title,
        overview,
        planData: plan_data
      });

      const plan = await supabaseStorage.createHobbyPlan(validatedData);
      return res.json(plan);
    }

    if (req.method === 'DELETE') {
      const { user_id } = req.query;
      const planId = req.url.split('/').pop();

      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const { supabaseStorage } = await import('../server/supabase-storage.js');
      await supabaseStorage.deleteUserProgress(planId, user_id);
      await supabaseStorage.deleteHobbyPlan(planId, user_id);
      
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
}
