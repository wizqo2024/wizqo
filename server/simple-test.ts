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

// Mock generate-plan endpoint
app.post('/api/generate-plan', (req, res) => {
  console.log('POST /api/generate-plan received:', req.body);
  res.json({
    hobby: req.body.hobby || 'test-hobby',
    title: 'Test Learning Plan',
    days: [
      {
        day: 1,
        title: 'Day 1: Introduction',
        content: 'Learn the basics',
        youtubeVideoId: 'test-video-id',
        affiliateProducts: []
      },
      {
        day: 2,
        title: 'Day 2: Practice',
        content: 'Practice what you learned',
        youtubeVideoId: 'test-video-id-2',
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
  console.log(`🚀 Simple test server running on port ${port}`);
});

export default app;