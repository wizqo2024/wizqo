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

// Robust mock generate-plan endpoint (returns full 7-day plan with details)
app.post('/api/generate-plan', (req, res) => {
  const hobby = String(req.body?.hobby || 'hobby');
  const experience = String(req.body?.experience || 'beginner');
  const timeAvailable = String(req.body?.timeAvailable || '30-60 minutes');

  const plan = {
    hobby,
    title: `Learn ${hobby} in 7 Days`,
    overview: `A structured 7-day journey to learn ${hobby} fundamentals and build a solid foundation.`,
    difficulty: experience,
    totalDays: 7,
    days: Array.from({ length: 7 }, (_, i) => {
      const day = i + 1;
      return {
        day,
        title: `Day ${day}: ${hobby} Fundamentals`,
        mainTask: `Learn essential ${hobby} techniques and practice hands-on exercises`,
        explanation: `Day ${day} focuses on ${hobby} basics with practical, actionable steps.`,
        howTo: [
          `Start with basic ${hobby} concepts`,
          `Practice fundamental techniques`,
          `Complete hands-on exercises`,
          `Review and refine your skills`,
          `Document your progress`
        ],
        checklist: [
          `Understand today's core concepts`,
          `Complete practice exercises`,
          `Review notes`,
          `Prepare for tomorrow`,
          `Reflect on progress`
        ],
        tips: [
          `Take your time with each exercise`,
          `Repeat difficult parts`,
          `Practice regularly`
        ],
        mistakesToAvoid: [
          `Rushing through exercises`,
          `Skipping practice time`,
          `Not taking notes`
        ],
        freeResources: [{ title: `${hobby} Day ${day} Tutorial`, link: `https://youtube.com` }],
        affiliateProducts: [{ title: `${hobby} Starter Kit`, link: `https://amazon.com`, price: `$${19 + i * 5}.99` }],
        youtubeVideoId: 'dQw4w9WgXcQ',
        videoTitle: `${hobby} Day ${day} Tutorial`,
        estimatedTime: timeAvailable,
        skillLevel: experience
      };
    })
  };

  res.json(plan);
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