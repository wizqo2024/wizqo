import express from "express";

const app = express();
app.use(express.json());

// Simple test endpoint
app.get('/api/test-deploy', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Test deployment successful',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'not set'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});

// Mock endpoints that the app needs
app.get('/api/hobby-plans', (req, res) => {
  // Return array of plans as expected by frontend
  res.json([
    {
      id: 'mock-plan-1',
      user_id: req.query.user_id,
      hobby: 'photo editing',
      title: 'Photo Editing Learning Plan',
      days: [
        { day: 1, title: 'Day 1', content: 'Mock content' }
      ],
      created_at: new Date().toISOString()
    }
  ]);
});

app.post('/api/hobby-plans', (req, res) => {
  // Return the created plan with ID
  res.json({
    id: 'mock-plan-' + Date.now(),
    user_id: req.body.user_id,
    hobby: req.body.hobby,
    title: req.body.title,
    days: req.body.days,
    created_at: new Date().toISOString()
  });
});

app.get('/api/user-progress/:userId', (req, res) => {
  // Return array of progress as expected by frontend
  res.json([
    {
      id: 'mock-progress-1',
      user_id: req.params.userId,
      plan_id: 'mock-plan-1',
      completed_days: [1],
      created_at: new Date().toISOString()
    }
  ]);
});

app.post('/api/generate-plan', (req, res) => {
  // Return full plan structure as expected by frontend
  res.json({
    title: 'Photo Editing Learning Plan',
    days: [
      { 
        day: 1, 
        title: 'Day 1: Introduction to Photo Editing', 
        content: 'Learn the basics of photo editing software and tools.',
        youtubeVideoId: 'mock-video-id',
        affiliateProducts: []
      },
      { 
        day: 2, 
        title: 'Day 2: Basic Editing Techniques', 
        content: 'Master fundamental editing techniques like cropping and color adjustment.',
        youtubeVideoId: 'mock-video-id-2',
        affiliateProducts: []
      }
    ]
  });
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
  console.log(`🚀 Test server running on port ${port}`);
});

export default app;