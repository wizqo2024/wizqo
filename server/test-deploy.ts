import express from "express";

const app = express();
app.use(express.json());

// Mock data storage
let mockPlans: any[] = [
  {
    id: 'mock-plan-1',
    user_id: '773c3f18-025a-432d-ae3d-fa13be3faef8',
    hobby: 'creative writing',
    title: 'Creative Writing Learning Plan',
    progress: 14,
    totalDays: 7,
    currentDay: 2,
    category: 'creative',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expectedEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    created_at: new Date().toISOString(),
    planData: {
      hobby: 'creative writing',
      title: 'Creative Writing Learning Plan',
      days: [
        { day: 1, title: 'Day 1: Introduction to Creative Writing', content: 'Learn the basics of creative writing and storytelling.', youtubeVideoId: 'mock-video-id', affiliateProducts: [] },
        { day: 2, title: 'Day 2: Character Development', content: 'Master character creation and development techniques.', youtubeVideoId: 'mock-video-id-2', affiliateProducts: [] },
        { day: 3, title: 'Day 3: Plot Structure', content: 'Learn about plot structure and story arcs.', youtubeVideoId: 'mock-video-id-3', affiliateProducts: [] },
        { day: 4, title: 'Day 4: Dialogue Writing', content: 'Master dialogue writing and character voice.', youtubeVideoId: 'mock-video-id-4', affiliateProducts: [] },
        { day: 5, title: 'Day 5: Setting and World Building', content: 'Learn about setting creation and world building.', youtubeVideoId: 'mock-video-id-5', affiliateProducts: [] },
        { day: 6, title: 'Day 6: Editing and Revision', content: 'Master editing and revision techniques.', youtubeVideoId: 'mock-video-id-6', affiliateProducts: [] },
        { day: 7, title: 'Day 7: Final Story Project', content: 'Complete your final creative writing project.', youtubeVideoId: 'mock-video-id-7', affiliateProducts: [] }
      ]
    }
  }
];

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
  console.log('📖 GET /api/hobby-plans - Request for user:', req.query.user_id);
  console.log('📖 GET /api/hobby-plans - Total mock plans in memory:', mockPlans.length);
  console.log('📖 GET /api/hobby-plans - All mock plans:', mockPlans.map(p => ({ id: p.id, user_id: p.user_id, hobby: p.hobby })));
  
  // Filter plans for the specific user from our dynamic mock data
  const userPlans = mockPlans.filter(plan => plan.user_id === req.query.user_id);
  
  console.log('📖 GET /api/hobby-plans - Returning plans:', userPlans.map(p => ({
    id: p.id,
    hobby: p.hobby,
    hasPlanData: !!p.planData,
    planDataHobby: p.planData?.hobby
  })));
  
  res.json(userPlans);

});

app.post('/api/hobby-plans', (req, res) => {
  console.log('📝 POST /api/hobby-plans - Received plan data:', {
    hobby: req.body.hobby,
    title: req.body.title,
    hasDays: !!req.body.days,
    daysCount: req.body.days?.length || 0
  });

  // Create a complete plan structure
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
      },
      { 
        day: 2, 
        title: `Day 2: Basic ${req.body.hobby} Techniques`, 
        content: `Master fundamental ${req.body.hobby} techniques.`,
        youtubeVideoId: 'mock-video-id-2',
        affiliateProducts: []
      },
      { 
        day: 3, 
        title: `Day 3: Intermediate ${req.body.hobby} Skills`, 
        content: `Learn intermediate ${req.body.hobby} skills.`,
        youtubeVideoId: 'mock-video-id-3',
        affiliateProducts: []
      },
      { 
        day: 4, 
        title: `Day 4: Advanced ${req.body.hobby} Concepts`, 
        content: `Explore advanced ${req.body.hobby} concepts.`,
        youtubeVideoId: 'mock-video-id-4',
        affiliateProducts: []
      },
      { 
        day: 5, 
        title: `Day 5: ${req.body.hobby} Practice`, 
        content: `Practice and refine your ${req.body.hobby} skills.`,
        youtubeVideoId: 'mock-video-id-5',
        affiliateProducts: []
      },
      { 
        day: 6, 
        title: `Day 6: ${req.body.hobby} Mastery`, 
        content: `Master advanced ${req.body.hobby} techniques.`,
        youtubeVideoId: 'mock-video-id-6',
        affiliateProducts: []
      },
      { 
        day: 7, 
        title: `Day 7: Final ${req.body.hobby} Project`, 
        content: `Complete your final ${req.body.hobby} project.`,
        youtubeVideoId: 'mock-video-id-7',
        affiliateProducts: []
      }
    ]
  };
  
  const savedPlan = {
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
  };

  // Add the new plan to our dynamic mock data
  mockPlans.push(savedPlan);
  console.log('📝 POST /api/hobby-plans - Added plan to mock data. Total plans now:', mockPlans.length);
  console.log('📝 POST /api/hobby-plans - All plans in memory:', mockPlans.map(p => ({ id: p.id, user_id: p.user_id, hobby: p.hobby })));

  console.log('📝 POST /api/hobby-plans - Returning saved plan:', {
    id: savedPlan.id,
    hobby: savedPlan.hobby,
    hasPlanData: !!savedPlan.planData,
    planDataHobby: savedPlan.planData?.hobby
  });

  res.json(savedPlan);
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

// Add DELETE endpoint for plan deletion
app.delete('/api/hobby-plans/:planId', (req, res) => {
  console.log('🗑️ DELETE /api/hobby-plans - Deleting plan:', req.params.planId);
  
  // Remove the plan from our dynamic mock data
  const planIndex = mockPlans.findIndex(plan => plan.id === req.params.planId);
  if (planIndex !== -1) {
    mockPlans.splice(planIndex, 1);
    console.log('🗑️ Plan removed from mock data. Remaining plans:', mockPlans.length);
  } else {
    console.log('🗑️ Plan not found in mock data:', req.params.planId);
  }
  
  res.json({ 
    status: 'ok',
    message: 'Plan deleted successfully',
    planId: req.params.planId
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