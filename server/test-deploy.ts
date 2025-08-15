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
      progress: 14, // 1 day completed out of 7
      totalDays: 7,
      currentDay: 2,
      category: 'creative',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      expectedEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
      status: 'in_progress',
      created_at: new Date().toISOString(),
      planData: {
        hobby: 'photo editing',
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
          },
          { 
            day: 3, 
            title: 'Day 3: Advanced Techniques', 
            content: 'Learn advanced editing techniques and filters.',
            youtubeVideoId: 'mock-video-id-3',
            affiliateProducts: []
          },
          { 
            day: 4, 
            title: 'Day 4: Color Correction', 
            content: 'Master color correction and white balance.',
            youtubeVideoId: 'mock-video-id-4',
            affiliateProducts: []
          },
          { 
            day: 5, 
            title: 'Day 5: Retouching', 
            content: 'Learn portrait retouching and blemish removal.',
            youtubeVideoId: 'mock-video-id-5',
            affiliateProducts: []
          },
          { 
            day: 6, 
            title: 'Day 6: Special Effects', 
            content: 'Add special effects and creative filters.',
            youtubeVideoId: 'mock-video-id-6',
            affiliateProducts: []
          },
          { 
            day: 7, 
            title: 'Day 7: Final Project', 
            content: 'Complete a final project combining all techniques.',
            youtubeVideoId: 'mock-video-id-7',
            affiliateProducts: []
          }
        ]
      }
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