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
  res.json({ 
    status: 'ok',
    message: 'Mock hobby plans endpoint',
    plans: [],
    user_id: req.query.user_id
  });
});

app.post('/api/hobby-plans', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Mock hobby plan created',
    plan: req.body
  });
});

app.get('/api/user-progress/:userId', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Mock user progress endpoint',
    progress: [],
    user_id: req.params.userId
  });
});

app.post('/api/generate-plan', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Mock plan generation endpoint',
    plan: {
      title: 'Mock Plan',
      days: [
        { day: 1, title: 'Day 1', content: 'Mock content' }
      ]
    }
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