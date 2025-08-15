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
  // For now, return a dynamic plan based on the user's recent activity
  const mockPlans = [
    {
      id: 'mock-plan-1',
      user_id: req.query.user_id,
      hobby: 'programming',
      title: 'Programming Learning Plan',
      progress: 14, // 1 day completed out of 7
      totalDays: 7,
      currentDay: 2,
      category: 'technical',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      expectedEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
      status: 'in_progress',
      created_at: new Date().toISOString(),
      planData: {
        hobby: 'programming',
        title: 'Programming Learning Plan',
        days: [
          { 
            day: 1, 
            title: 'Day 1: Introduction to Programming', 
            content: 'Learn the basics of programming concepts and tools.',
            youtubeVideoId: 'mock-video-id',
            affiliateProducts: []
          },
          { 
            day: 2, 
            title: 'Day 2: Basic Syntax', 
            content: 'Master fundamental programming syntax and structure.',
            youtubeVideoId: 'mock-video-id-2',
            affiliateProducts: []
          },
          { 
            day: 3, 
            title: 'Day 3: Variables and Data Types', 
            content: 'Learn about variables, data types, and memory management.',
            youtubeVideoId: 'mock-video-id-3',
            affiliateProducts: []
          },
          { 
            day: 4, 
            title: 'Day 4: Control Structures', 
            content: 'Master loops, conditionals, and program flow.',
            youtubeVideoId: 'mock-video-id-4',
            affiliateProducts: []
          },
          { 
            day: 5, 
            title: 'Day 5: Functions', 
            content: 'Learn about functions, parameters, and code organization.',
            youtubeVideoId: 'mock-video-id-5',
            affiliateProducts: []
          },
          { 
            day: 6, 
            title: 'Day 6: Object-Oriented Programming', 
            content: 'Introduction to classes, objects, and inheritance.',
            youtubeVideoId: 'mock-video-id-6',
            affiliateProducts: []
          },
          { 
            day: 7, 
            title: 'Day 7: Final Project', 
            content: 'Complete a final programming project.',
            youtubeVideoId: 'mock-video-id-7',
            affiliateProducts: []
          }
        ]
      }
    },
    {
      id: 'mock-plan-2',
      user_id: req.query.user_id,
      hobby: 'game development',
      title: 'Game Development Learning Plan',
      progress: 0,
      totalDays: 7,
      currentDay: 1,
      category: 'creative',
      startDate: new Date().toISOString(),
      expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress',
      created_at: new Date().toISOString(),
      planData: {
        hobby: 'game development',
        title: 'Game Development Learning Plan',
        days: [
          { 
            day: 1, 
            title: 'Day 1: Introduction to Game Development', 
            content: 'Learn the basics of game development and design.',
            youtubeVideoId: 'mock-video-id',
            affiliateProducts: []
          },
          { 
            day: 2, 
            title: 'Day 2: Game Design Principles', 
            content: 'Master fundamental game design concepts.',
            youtubeVideoId: 'mock-video-id-2',
            affiliateProducts: []
          },
          { 
            day: 3, 
            title: 'Day 3: Programming Basics', 
            content: 'Learn basic programming for games.',
            youtubeVideoId: 'mock-video-id-3',
            affiliateProducts: []
          },
          { 
            day: 4, 
            title: 'Day 4: Graphics and Animation', 
            content: 'Master game graphics and animation techniques.',
            youtubeVideoId: 'mock-video-id-4',
            affiliateProducts: []
          },
          { 
            day: 5, 
            title: 'Day 5: Sound and Music', 
            content: 'Learn about game audio and music integration.',
            youtubeVideoId: 'mock-video-id-5',
            affiliateProducts: []
          },
          { 
            day: 6, 
            title: 'Day 6: User Interface', 
            content: 'Design and implement game user interfaces.',
            youtubeVideoId: 'mock-video-id-6',
            affiliateProducts: []
          },
          { 
            day: 7, 
            title: 'Day 7: Final Game Project', 
            content: 'Complete a final game development project.',
            youtubeVideoId: 'mock-video-id-7',
            affiliateProducts: []
          }
        ]
      }
    }
  ];
  
  res.json(mockPlans);
});

app.post('/api/hobby-plans', (req, res) => {
  // Return the created plan with ID and planData
  const planData = {
    hobby: req.body.hobby,
    title: req.body.title || `${req.body.hobby} Learning Plan`,
    days: req.body.days || [
      { 
        day: 1, 
        title: `Day 1: Introduction to ${req.body.hobby}`, 
        content: `Learn the basics of ${req.body.hobby}.`,
        youtubeVideoId: 'mock-video-id',
        affiliateProducts: []
      }
    ]
  };
  
  res.json({
    id: 'mock-plan-' + Date.now(),
    user_id: req.body.user_id,
    hobby: req.body.hobby,
    title: planData.title,
    progress: 0,
    totalDays: 7,
    currentDay: 1,
    category: 'learning',
    startDate: new Date().toISOString(),
    expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    created_at: new Date().toISOString(),
    planData: planData
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