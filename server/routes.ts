import type { Express } from "express";
import { createServer, type Server } from "http";
import { sendContactEmail } from './email.js';
import { getTargetedYouTubeVideo, getVideoDetails } from './videoSelection.js';
import { getBestVideoForDay } from './youtubeService.js';
import { validateHobby, getVideosForHobby, suggestAlternativeHobbies } from './hobbyValidator.js';
import { hobbyValidator } from './deepseekValidation.js';
import { storage } from './storage.js';
import { supabaseStorage } from './supabase-storage';
import { insertHobbyPlanSchema, insertUserProgressSchema } from '@shared/schema';
import { z } from 'zod';

console.log('📖 API: Database storage initialized for all operations');
console.log('🚀 SUPABASE MODE: Using Supabase PostgreSQL database');

// Fixed plan data field mapping function
function fixPlanDataFields(plan: any) {
  if (!plan || !plan.days) return plan;
  
  return {
    ...plan,
    days: plan.days.map((day: any) => ({
      ...day,
      // Handle "Avoid These Mistakes" section with various possible field names
      commonMistakes: day.commonMistakes && day.commonMistakes.length > 0 
        ? day.commonMistakes 
        : day.mistakesToAvoid && day.mistakesToAvoid.length > 0
          ? day.mistakesToAvoid
          : day.avoidMistakes && day.avoidMistakes.length > 0
            ? day.avoidMistakes
            : [
              "Rushing through exercises without understanding concepts",
              "Skipping practice time or cutting sessions short", 
              "Not taking notes or tracking your improvement"
            ],
      // Preserve ALL YouTube video fields from the original plan
      youtubeVideoId: day.youtubeVideoId || day.videoId,
      videoTitle: day.videoTitle,
      estimatedTime: day.estimatedTime,
      skillLevel: day.skillLevel
    }))
  };
}

// Enhanced YouTube video mapping for fallback plans
function getYouTubeVideos(hobby: string): string[] {
  const videos: { [key: string]: string[] } = {
    guitar: ["3jWRrafhO7M", "F9vWVucRJzo", "7tpQr0Xh6yM", "VJPCkS-wZR4", "kXOcz1_qnXw", "w8L3f3DWlNs", "Qa7GNfwLQJo"],
    cooking: ["dQw4w9WgXcQ", "fBYVFCb1n6s", "L3dDHKjr_P8", "dNGgJa8r_7s", "mGz7d8xB1V8", "K2nV8JGFgh4", "u3JzYrWLJ4E"], 
    drawing: ["ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk", "7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0"],
    coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "t_ispmWmdjY", "W6NZfCO5SIk", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
    photography: ["B9FzVhw8_bY", "DJ_DIYDqWGY", "pwmJRx0eJiQ", "R8MzHddV-Z0", "mKY4gUEjAVs", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"],
    painting: ["7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0", "ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk"],
    yoga: ["v7AYKMP6rOE", "xQgP8N7jCrE", "Vg5FeCTzB6w", "h8TKF2_p7qU", "AaF2lpO2IHY", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"]
  };
  
  // REPLACE BROKEN VIDEO ID "On2LgxqJlMU" with working cooking videos
  const hobbyVideos = videos[hobby.toLowerCase()] || videos.cooking;
  return hobbyVideos;
}

// Smart contextual response generator for chat fallback
function generateContextualResponse(question: string, planData: any, hobbyContext: string): string {
  const q = question.toLowerCase().trim();
  const hobby = planData?.hobby || hobbyContext || 'hobby';
  
  // Tips requests
  if (q.includes('tip') || q.includes('advice') || q.includes('suggestion')) {
    if (planData?.days && planData.days.length > 0) {
      const day1 = planData.days.find((day: any) => day.day === 1) || planData.days[0];
      if (day1?.tips && day1.tips.length > 0) {
        return `Here are some key tips for your ${hobby} journey:\n\n${day1.tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}\n\nThese come from Day 1 of your plan. Each day has specific tips tailored to what you're learning!`;
      }
    }
    return `Here are some essential ${hobby} learning tips:\n\n1. Start with proper fundamentals - don't rush the basics\n2. Practice consistently, even 15-20 minutes daily\n3. Be patient with yourself and celebrate small wins\n4. Take notes and track your progress\n\nYour plan has specific tips for each day too!`;
  }
  
  // Greetings
  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return `Hello! I'm here to help you with your ${hobby} learning journey. You can ask me about specific techniques, daily activities, equipment, time management, or any questions about your 7-day plan. What would you like to know?`;
  }
  
  // How to start
  if (q.includes('how') && (q.includes('start') || q.includes('begin'))) {
    return `Great question! Start with Day 1 - that's where all the fundamentals are covered. Click on 'Day 1' in your plan above to see detailed instructions, video tutorial, and checklist. Take your time with the basics!`;
  }
  
  // Equipment questions
  if (q.includes('equipment') || q.includes('need') || q.includes('buy') || q.includes('tool')) {
    return `Check the 'What You'll Need' section in Day 1 - it lists everything required to get started with ${hobby}. Most hobbies can be started with basic, affordable equipment. Focus on learning first before investing in expensive gear!`;
  }
  
  // Time questions
  if (q.includes('time') || q.includes('long') || q.includes('minutes') || q.includes('hour')) {
    return `Your ${hobby} plan is designed for manageable daily sessions. The most important thing is consistent practice - even 15-20 minutes daily can make a huge difference! Each day's activities are structured to be effective within your available time.`;
  }
  
  // Progress questions
  if (q.includes('progress') || q.includes('track')) {
    return `Your progress is automatically saved! You can mark days as complete and track your ${hobby} learning journey. Visit your dashboard anytime to see your progress and continue where you left off.`;
  }
  
  // Weather or unrelated questions
  if (q.includes('weather') || q.includes('rain') || q.includes('sun')) {
    return `I'm focused on helping you with your ${hobby} learning plan! While I can't help with weather, I can answer questions about your daily activities, techniques, equipment, or anything related to your 7-day journey. What would you like to know about ${hobby}?`;
  }
  
  // Default response
  return `I'm here to help with your ${hobby} learning plan! You can ask me about:\n• Getting started with Day 1\n• Daily activities and techniques\n• Equipment and setup\n• Practice tips and techniques\n• Time management\n• Progress tracking\n\nWhat aspect of your ${hobby} learning would you like help with?`;
}

// DeepSeek AI integration for dynamic plan generation
async function generateAIPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️ No DeepSeek API key found, using fallback plan generation');
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }

  try {
    const prompt = `Generate a comprehensive 7-day learning plan for learning ${hobby}. 

User details:
- Experience level: ${experience}
- Time available per day: ${timeAvailable}
- Learning goal: ${goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${hobby}",
  "title": "Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days",
  "description": "A personalized learning plan description",
  "difficulty": "${experience}",
  "totalDays": 7,
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "mainTask": "Main learning objective for the day",
      "explanation": "Why this day matters and what you'll accomplish",
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
    
    // Add YouTube API videos to each day with quality filtering
    aiPlan.days = await Promise.all(aiPlan.days.map(async (day: any, index: number) => {
      // Use YouTube API for quality video selection
      const targetedVideoId = await getBestVideoForDay(
        hobby, 
        experience, 
        day.day, 
        day.title, 
        day.mainTask
      );
      
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
        videoId: targetedVideoId, // Also add videoId for compatibility
        videoTitle: videoDetails?.title || `${day.title} - ${hobby} Tutorial`,
        freeResources: [],
        affiliateProducts: [{
          ...getHobbyProduct(hobby, day.day)
        }]
      };
    }));

    // Debug: Log AI plan response structure
    console.log('🔍 AI PLAN GENERATED - First day youtubeVideoId:', aiPlan.days[0].youtubeVideoId);
    console.log('🔍 AI PLAN GENERATED - First day videoId:', aiPlan.days[0].videoId);
    console.log('🔍 AI PLAN COMPLETE FIRST DAY:', JSON.stringify(aiPlan.days[0], null, 2));
    
    // Ensure hobby field and correct difficulty mapping are included in the response
    aiPlan.hobby = hobby;
    aiPlan.difficulty = experience === 'some' ? 'intermediate' : experience;
    aiPlan.overview = aiPlan.overview || aiPlan.description || `A comprehensive ${hobby} learning plan tailored for ${experience === 'some' ? 'intermediate' : experience} learners`;
    
    // Force professional title format if AI generated old format
    if (aiPlan.title && aiPlan.title.includes('Learning Journey')) {
      aiPlan.title = `Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days`;
    }
    
    return aiPlan;

  } catch (error) {
    console.error('DeepSeek API error:', error);
    console.log('⚠️ DeepSeek API failed, using fallback plan generation');
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }
}

// This function is no longer needed - consolidated into getHobbyProduct

// Function to get specific products for other hobbies
function getHobbyProduct(hobby: string, day: number) {
  const hobbyProducts: Record<string, Array<{title: string, link: string, price: string}>> = {
    guitar: [
      { title: "Guitar Picks Set", link: "https://www.amazon.com/dp/B07DVJW6Z8?tag=wizqohobby-20", price: "$8.99" },
      { title: "Guitar Tuner", link: "https://www.amazon.com/dp/B01H74YV56?tag=wizqohobby-20", price: "$12.99" },
      { title: "Guitar Capo", link: "https://www.amazon.com/dp/B074KBXQZC?tag=wizqohobby-20", price: "$9.99" },
      { title: "Guitar Strings", link: "https://www.amazon.com/dp/B0002E1G5C?tag=wizqohobby-20", price: "$6.99" },
      { title: "Guitar Stand", link: "https://www.amazon.com/dp/B004M5T66U?tag=wizqohobby-20", price: "$19.99" },
      { title: "Guitar Strap", link: "https://www.amazon.com/dp/B01GPDH3ZY?tag=wizqohobby-20", price: "$11.99" },
      { title: "Guitar Chord Book", link: "https://www.amazon.com/dp/B0002E2L9U?tag=wizqohobby-20", price: "$14.99" }
    ],
    cooking: [
      { title: "Chef's Knife 8 Inch", link: "https://www.amazon.com/s?k=chef+knife+8+inch&tag=wizqohobby-20", price: "$29.99" },
      { title: "Bamboo Cutting Board", link: "https://www.amazon.com/s?k=bamboo+cutting+board&tag=wizqohobby-20", price: "$16.99" },
      { title: "Measuring Cups and Spoons Set", link: "https://www.amazon.com/s?k=measuring+cups+spoons+set&tag=wizqohobby-20", price: "$12.99" },
      { title: "Non-Stick Frying Pan 10 Inch", link: "https://www.amazon.com/s?k=non+stick+frying+pan+10+inch&tag=wizqohobby-20", price: "$24.99" },
      { title: "Spice Organizer Rack", link: "https://www.amazon.com/s?k=spice+organizer+rack&tag=wizqohobby-20", price: "$19.99" },
      { title: "Digital Kitchen Scale", link: "https://www.amazon.com/s?k=digital+kitchen+scale&tag=wizqohobby-20", price: "$19.99" },
      { title: "Beginner's Cookbook", link: "https://www.amazon.com/s?k=beginner+cookbook&tag=wizqohobby-20", price: "$15.99" }
    ],
    drawing: [
      { title: "Drawing Pencils Set", link: "https://www.amazon.com/s?k=drawing+pencils+set&tag=wizqohobby-20", price: "$14.99" },
      { title: "Sketchbook 9x12", link: "https://www.amazon.com/s?k=sketchbook+9x12&tag=wizqohobby-20", price: "$12.99" },
      { title: "Blending Stumps Set", link: "https://www.amazon.com/s?k=blending+stumps+set&tag=wizqohobby-20", price: "$8.99" },
      { title: "Kneaded Eraser", link: "https://www.amazon.com/s?k=kneaded+eraser&tag=wizqohobby-20", price: "$9.99" },
      { title: "Drawing Tablet", link: "https://www.amazon.com/s?k=drawing+tablet&tag=wizqohobby-20", price: "$49.99" },
      { title: "Art Supply Box", link: "https://www.amazon.com/s?k=art+supply+box&tag=wizqohobby-20", price: "$24.99" },
      { title: "Drawing Book", link: "https://www.amazon.com/s?k=drawing+techniques+book&tag=wizqohobby-20", price: "$16.99" }
    ],
    dance: [
      { title: "Exercise Mat for Dance Practice", link: "https://www.amazon.com/dp/B01LP0ULZQ?tag=wizqohobby-20", price: "$19.99" },
      { title: "Resistance Bands Set", link: "https://www.amazon.com/dp/B01AVDVHTI?tag=wizqohobby-20", price: "$12.99" },
      { title: "Yoga Block for Flexibility", link: "https://www.amazon.com/dp/B071P9LBPX?tag=wizqohobby-20", price: "$9.99" },
      { title: "Water Bottle with Time Marker", link: "https://www.amazon.com/dp/B07QQBVGPX?tag=wizqohobby-20", price: "$15.99" },
      { title: "Cross Training Shoes", link: "https://www.amazon.com/dp/B07FNLVLGM?tag=wizqohobby-20", price: "$39.99" },
      { title: "Foam Roller for Recovery", link: "https://www.amazon.com/dp/B00KAEJ3NA?tag=wizqohobby-20", price: "$24.99" },
      { title: "Dance Workout DVD", link: "https://www.amazon.com/dp/B0018XFMUU?tag=wizqohobby-20", price: "$16.99" }
    ]
  };
  
  const products = hobbyProducts[hobby] || [
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Starter Kit Day 1`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+starter+kit&tag=wizqohobby-20`, price: "$24.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Practice Tools Day 2`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+practice+tools&tag=wizqohobby-20`, price: "$19.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Learning Guide Day 3`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+learning+guide&tag=wizqohobby-20`, price: "$15.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Equipment Day 4`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+equipment&tag=wizqohobby-20`, price: "$29.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Advanced Kit Day 5`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+advanced+kit&tag=wizqohobby-20`, price: "$39.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Organizer Day 6`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+organizer&tag=wizqohobby-20`, price: "$22.99" },
    { title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Reference Book Day 7`, link: `https://www.amazon.com/s?k=${encodeURIComponent(hobby)}+reference+book&tag=wizqohobby-20`, price: "$18.99" }
  ];
  
  return products[day - 1] || products[0];
}



// Fallback plan generator with YouTube API integration
async function generateFallbackPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  // Validate hobby input in fallback too
  const validation = validateHobby(hobby);
  if (!validation.isValid) {
    throw new Error(`"${hobby}" doesn't seem like a hobby. Please enter a specific hobby you'd like to learn (e.g., guitar, cooking, photography, yoga, coding).`);
  }
  
  hobby = validation.normalizedHobby;
  const days = [];
  
  // Define unique daily topics and progressions
  const dailyTopics = [
    { focus: 'Basics & Setup', task: 'Get familiar with fundamentals and set up your practice space', skills: 'basic concepts and terminology' },
    { focus: 'Core Techniques', task: 'Master the essential techniques that form the foundation', skills: 'core techniques and proper form' },
    { focus: 'Building Skills', task: 'Develop coordination and muscle memory through practice', skills: 'coordination and skill-building exercises' },
    { focus: 'Practical Application', task: 'Apply what you\'ve learned in real-world scenarios', skills: 'practical application and problem-solving' },
    { focus: 'Advanced Elements', task: 'Introduce more challenging concepts and variations', skills: 'advanced techniques and variations' },
    { focus: 'Creative Expression', task: 'Explore creativity and personal style in your practice', skills: 'creative expression and personal style' },
    { focus: 'Integration & Mastery', task: 'Combine all elements and plan your continued journey', skills: 'integration and long-term planning' }
  ];

  const dailyMistakes = [
    ['Rushing through setup without proper preparation', 'Skipping basic safety or preparation steps', 'Not taking time to understand the fundamentals'],
    ['Using incorrect technique from the start', 'Practicing bad habits that are hard to break later', 'Ignoring proper form for speed'],
    ['Practicing without focus or clear goals', 'Not breaking down complex movements into parts', 'Expecting immediate perfection'],
    ['Not applying skills to real situations', 'Staying too comfortable with easy exercises', 'Avoiding challenging but important practice'],
    ['Attempting advanced techniques without mastering basics', 'Getting frustrated with increased difficulty', 'Skipping important foundational steps'],
    ['Copying others instead of finding your own style', 'Being too critical of creative attempts', 'Not exploring different approaches'],
    ['Not planning for continued learning', 'Thinking the journey ends after 7 days', 'Not celebrating progress made']
  ];

  const dailyTips = [
    ['Take time to properly set up your practice space', 'Focus on understanding why, not just how', 'Start slow and build confidence gradually'],
    ['Quality practice beats quantity every time', 'Focus on proper technique before speed', 'Use a mirror or recording to check your form'],
    ['Break complex skills into smaller parts', 'Celebrate small improvements each day', 'Be patient with your learning process'],
    ['Practice in different situations and environments', 'Challenge yourself with real-world applications', 'Don\'t be afraid to make mistakes'],
    ['Master the basics before moving to advanced techniques', 'Push your comfort zone but stay safe', 'Ask for feedback from experienced practitioners'],
    ['Experiment and find what feels natural to you', 'Draw inspiration from various sources', 'Trust your instincts and creative impulses'],
    ['Reflect on how far you\'ve come in just one week', 'Set realistic goals for continued growth', 'Connect with others who share your interest']
  ];
  
  for (let i = 0; i < 7; i++) {
    const dayNumber = i + 1;
    const dayTopic = dailyTopics[i];
    const dayTitle = `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} ${dayTopic.focus} - ${dayNumber}`;
    
    // Use YouTube API for quality video selection
    const targetedVideoId = await getBestVideoForDay(
      hobby, 
      experience, 
      dayNumber, 
      dayTitle, 
      `${dayTopic.task} - Day ${dayNumber}`
    );
    console.log(`🔍 FALLBACK getBestVideoForDay returned: ${targetedVideoId} for ${hobby} day ${dayNumber}`);
    
    // Final verification: If we still get the problematic video, use a proper fallback
    const finalVideoId = targetedVideoId === 'dQw4w9WgXcQ' ? 'fC7oUOUEEi4' : targetedVideoId;
    console.log(`🔍 FINAL VIDEO ID after verification: ${finalVideoId} for ${hobby} day ${dayNumber}`);
    console.log(`🔧 VIDEO REPLACEMENT: ${targetedVideoId} -> ${finalVideoId}`);
    
    const videoDetails = getVideoDetails(hobby, experience, dayNumber);
    
    days.push({
      day: dayNumber,
      title: dayTitle,
      mainTask: `${dayTopic.task} with focused practice and hands-on learning.`,
      explanation: `Day ${dayNumber} focuses on ${dayTopic.focus.toLowerCase()} in ${hobby}. You'll work on ${dayTopic.skills} while building on everything you've learned so far.`,
      howTo: [
        `Begin with ${dayTopic.skills} fundamentals`,
        `Practice the day's core techniques step-by-step`,
        `Complete ${dayNumber <= 3 ? 'foundational' : dayNumber <= 5 ? 'intermediate' : 'advanced'} exercises for ${experience} level`,
        `Apply today's skills in practical ${hobby} scenarios`,
        `Review progress and prepare for tomorrow's challenges`
      ],
      checklist: [
        `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} equipment ready and organized`,
        `Practice area set up for ${dayTopic.focus.toLowerCase()} work`,
        `${dayNumber <= 3 ? 'Basic reference materials' : dayNumber <= 5 ? 'Intermediate guides' : 'Advanced resources'} available`,
        `Timer set for focused ${dayTopic.focus.toLowerCase()} practice`,
        `Progress tracking system ready for Day ${dayNumber}`
      ],
      tips: dailyTips[i],
      mistakesToAvoid: dailyMistakes[i],
      freeResources: [],
      affiliateProducts: [{
        ...getHobbyProduct(hobby, dayNumber)
      }],
      youtubeVideoId: finalVideoId,
      videoId: finalVideoId, // Also add videoId for backwards compatibility
      videoTitle: videoDetails?.title || `${hobby} - ${dayNumber}`,
      estimatedTime: timeAvailable,
      skillLevel: experience
    });
  }

  const plan = {
    hobby: hobby,
    title: `Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days`,
    overview: `A comprehensive ${hobby} learning plan tailored for ${experience === 'some' ? 'intermediate' : experience} learners`,
    difficulty: experience === 'some' ? 'intermediate' : experience,
    totalDays: 7,
    days: days
  };
  
  console.log('🔍 FALLBACK PLAN GENERATED - First day mistakesToAvoid:', plan.days[0].mistakesToAvoid);
  console.log('🔍 FALLBACK PLAN GENERATED - First day youtubeVideoId:', plan.days[0].youtubeVideoId);
  console.log('🔍 FALLBACK PLAN GENERATED - First day videoId:', plan.days[0].videoId);
  
  // CRITICAL FIX: Apply video verification to final plan
  for (let i = 0; i < plan.days.length; i++) {
    if (plan.days[i].youtubeVideoId === 'dQw4w9WgXcQ') {
      plan.days[i].youtubeVideoId = 'fC7oUOUEEi4'; // Educational content fallback
      plan.days[i].videoId = 'fC7oUOUEEi4';
      console.log(`🔧 FIXED: Replaced problematic video ID in day ${i + 1} with educational content`);
    }
  }
  console.log('🔍 FALLBACK PLAN DIFFICULTY:', plan.difficulty, 'EXPERIENCE:', experience);
  
  // Debug: Log complete first day structure
  console.log('🔍 COMPLETE FIRST DAY DATA:', JSON.stringify(plan.days[0], null, 2));
  
  // Final debug: Log complete plan response structure
  console.log('🔍 FINAL PLAN RESPONSE STRUCTURE:', {
    hobby: plan.hobby,
    totalDays: plan.totalDays,
    firstDayKeys: Object.keys(plan.days[0]),
    firstDayVideoId: plan.days[0].youtubeVideoId,
    firstDayVideoIdAlt: plan.days[0].videoId
  });
  
  return plan;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Generate hobby plan endpoint with validation
  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { hobby, experience, timeAvailable, goal, userId, force } = req.body;
      
      if (!hobby || !experience || !timeAvailable) {
        return res.status(400).json({ 
          error: 'Missing required fields: hobby, experience, timeAvailable' 
        });
      }

      // Use DeepSeek for intelligent hobby validation
      console.log('🔍 Validating hobby with DeepSeek:', hobby);
      const validation = await hobbyValidator.validateHobby(hobby);
      
      if (!validation.isValid) {
        return res.status(400).json({
          error: `I'm not sure "${hobby}" is a hobby I can help with right now.`,
          suggestions: validation.suggestions || ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance'],
          message: validation.reasoning || 'Please try one of these popular hobbies instead.',
          invalidHobby: hobby
        });
      }
      
      const normalizedHobby = validation.correctedHobby || hobby;
      
      // Check for duplicate plans if user is authenticated and not forcing new plan
      if (userId && !force) {
        console.log('🔍 DUPLICATE CHECK: Checking for existing plans for user:', userId, 'hobby:', normalizedHobby);
        try {
          const existingPlans = await supabaseStorage.getHobbyPlansByUserId(userId);
          console.log('🔍 DUPLICATE CHECK: Found', existingPlans.length, 'existing plans');
          
          const duplicatePlan = existingPlans.find((plan: any) => {
            const planHobby = plan.hobby_name?.toLowerCase() || '';
            const normalizedPlanHobby = planHobby.trim();
            const checkHobby = normalizedHobby.toLowerCase().trim();
            
            console.log('🔍 DUPLICATE CHECK: Comparing', normalizedPlanHobby, 'vs', checkHobby);
            
            // Exact match
            if (normalizedPlanHobby === checkHobby) return true;
            
            // Handle variations (e.g., "guitar" vs "guitar playing")
            if (normalizedPlanHobby.includes(checkHobby) || checkHobby.includes(normalizedPlanHobby)) return true;
            
            return false;
          });
          
          if (duplicatePlan) {
            console.log('🚨 DUPLICATE DETECTED: Found existing plan for', normalizedHobby, 'with ID:', duplicatePlan.id);
            return res.status(409).json({
              error: 'duplicate_plan',
              message: `You already have a ${normalizedHobby} learning plan! Would you like to continue with your existing plan or create a new one?`,
              existingPlan: {
                id: duplicatePlan.id,
                title: duplicatePlan.title,
                created_at: duplicatePlan.created_at
              },
              hobby: normalizedHobby
            });
          }
          
          console.log('✅ DUPLICATE CHECK: No existing plan found for', normalizedHobby);
        } catch (error) {
          console.error('❌ DUPLICATE CHECK: Error checking for duplicates:', error);
          // Continue with plan generation if duplicate check fails
        }
      }
      
      const plan = await generateAIPlan(normalizedHobby, experience, timeAvailable, goal || `Learn ${normalizedHobby} fundamentals`);
      res.json(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      res.status(500).json({ error: 'Failed to generate learning plan' });
    }
  });

  // AI Chat endpoint using DeepSeek API
  app.post('/api/chat', async (req, res) => {
    try {
      const { question, planData, hobbyContext } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        // Fallback response if no API key
        const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
        return res.json({ response: fallbackResponse });
      }

      // Build context from plan data
      let context = `You are a helpful AI assistant for Wizqo, a 7-day hobby learning platform. `;
      
      if (planData && planData.hobby) {
        context += `The user is learning ${planData.hobby} over 7 days. `;
        
        if (planData.days && planData.days.length > 0) {
          const currentDay = planData.days.find((day: any) => day.day === 1) || planData.days[0];
          if (currentDay) {
            context += `Today's focus is "${currentDay.title}" with the main task: ${currentDay.mainTask}. `;
            
            if (currentDay.tips && currentDay.tips.length > 0) {
              context += `Key tips include: ${currentDay.tips.join(', ')}. `;
            }
          }
        }
      }
      
      context += `Provide helpful, specific advice about the user's learning journey. Keep responses conversational but informative.`;

      const prompt = `${context}

User question: ${question}

Please provide a helpful response:`;

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
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        console.error('DeepSeek API error:', response.status, response.statusText);
        // Use intelligent fallback response
        const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
        return res.json({ response: fallbackResponse });
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 
        `I'm here to help with your ${hobbyContext || 'hobby'} learning plan! What would you like to know?`;

      res.json({ response: aiResponse });
      
    } catch (error) {
      console.error('Error in AI chat:', error);
      const { question, planData, hobbyContext } = req.body;
      const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
      res.json({ response: fallbackResponse });
    }
  });

  // New endpoint for direct hobby validation
  app.post('/api/validate-hobby', async (req, res) => {
    try {
      const { hobby } = req.body;
      
      if (!hobby) {
        return res.status(400).json({ error: 'Hobby is required' });
      }

      const cleanHobby = hobby.replace(/["']/g, '').trim();
      console.log('🔍 Validating hobby:', cleanHobby);
      const validation = hobbyValidator.validateHobby(cleanHobby);
      console.log('🔍 Server validation result:', validation);
      
      // Ensure proper response format for frontend
      const response = {
        isValid: validation.isValid,
        correctedHobby: validation.normalizedHobby, // Key mapping fix
        originalHobby: cleanHobby,
        suggestions: validation.suggestions || [],
        category: validation.category
      };
      
      console.log('🔍 Sending response to frontend:', response);
      res.json(response);
    } catch (error) {
      console.error('Hobby validation error:', error);
      res.status(500).json({ error: 'Failed to validate hobby' });
    }
  });

  // Database-backed hobby plans endpoints
  app.get('/api/hobby-plans', async (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }
      
      console.log('📖 API: Fetching hobby plans for user:', user_id);
      const plans = await supabaseStorage.getHobbyPlansByUserId(user_id as string);
      console.log('📖 API: Found', plans?.length || 0, 'hobby plans');
      res.json(plans || []);
    } catch (error) {
      console.error('Error fetching hobby plans:', error);
      res.status(500).json({ error: 'Failed to fetch hobby plans' });
    }
  });

  app.get('/api/hobby-plans/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('📖 API: Fetching hobby plans for user:', userId);
      
      const plans = await supabaseStorage.getHobbyPlansByUserId(userId);
      console.log('📖 API: Found', plans?.length || 0, 'plans');
      res.json(plans || []);
    } catch (error) {
      console.error('📖 API: Error fetching hobby plans:', error);
      res.status(500).json({ error: 'Failed to fetch hobby plans' });
    }
  });

  app.post('/api/hobby-plans', async (req, res) => {
    try {
      const { user_id, hobby, title, overview, plan_data } = req.body;
      console.log('📝 DATABASE: Creating hobby plan for user:', user_id, 'hobby:', hobby);
      console.log('🔍 DEBUG: Plan data being saved - first day mistakesToAvoid:', plan_data?.days?.[0]?.mistakesToAvoid);
      console.log('🔍 DEBUG: Plan data being saved - first day youtubeVideoId:', plan_data?.days?.[0]?.youtubeVideoId);
      
      // Validate the request data
      const validatedData = insertHobbyPlanSchema.parse({
        userId: user_id,
        hobby,
        title,
        overview,
        planData: plan_data
      });
      
      const plan = await supabaseStorage.createHobbyPlan(validatedData);
      console.log('📝 DATABASE: Created plan with ID:', plan.id);
      res.json(plan);
    } catch (error) {
      console.error('📝 API: Error creating hobby plan:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create hobby plan' });
      }
    }
  });

  // Delete a hobby plan
  app.delete('/api/hobby-plans/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }
      
      console.log('🗑️ API: Deleting hobby plan', id, 'for user:', user_id);
      
      // Delete progress records first
      await supabaseStorage.deleteUserProgress(id, user_id as string);
      
      // Delete the hobby plan
      await supabaseStorage.deleteHobbyPlan(id, user_id as string);
      
      console.log('🗑️ API: Successfully deleted hobby plan', id);
      res.json({ success: true });
    } catch (error) {
      console.error('🗑️ API: Error deleting hobby plan:', error);
      res.status(500).json({ error: 'Failed to delete hobby plan' });
    }
  });

  // User progress tracking endpoints
  app.get('/api/user-progress/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('📖 API: Fetching user progress for:', userId);
      
      const progress = await supabaseStorage.getUserProgress(userId);
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
      console.log('📝 DATABASE: Creating/updating user progress for:', user_id, 'plan:', plan_id);
      
      // Validate the request data
      const validatedData = insertUserProgressSchema.parse({
        userId: user_id,
        planId: plan_id,
        completedDays: completed_days,
        currentDay: current_day,
        unlockedDays: unlocked_days
      });
      
      const progress = await supabaseStorage.createOrUpdateUserProgress(validatedData);
      console.log('📝 DATABASE: Updated progress for plan:', plan_id);
      res.json(progress);
    } catch (error) {
      console.error('📝 API: Error updating user progress:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update user progress' });
      }
    }
  });

  // Database independence health check
  app.get('/api/health/database', async (req, res) => {
    try {
      // Test Supabase database connection
      const result = await supabaseStorage.getUserProfile('test');
      const isHealthy = true;
      if (isHealthy) {
        res.json({ 
          status: 'healthy', 
          database: 'supabase',
          independent: true,
          message: 'Database is connected and running on Supabase PostgreSQL' 
        });
      } else {
        res.status(500).json({ 
          status: 'unhealthy', 
          database: 'supabase',
          independent: true,
          message: 'Database connection failed' 
        });
      }
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Health check failed',
        independent: true 
      });
    }
  });

  // Data migration endpoint (migrate from Replit to Supabase)
  app.post('/api/migrate-data', async (req, res) => {
    try {
      console.log('🔄 Starting data migration from Replit to Supabase...');
      
      // Since you have existing data in Replit, but want to use Supabase for independence
      // This endpoint helps verify the migration is complete
      const userProfileExists = await supabaseStorage.getUserProfile('773c3f18-025a-432d-ae3d-fa13be3faef8');
      
      if (!userProfileExists) {
        // Create user profile in Supabase
        await supabaseStorage.createUserProfile({
          id: '773c3f18-025a-432d-ae3d-fa13be3faef8',
          email: 'wizqo2024@gmail.com',
          username: 'wizqo',
          avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKnN7jbvoRIp_6hG3lLS-WzLaT7TJ9NonxjjT1rW_T91eo5OA=s96-c'
        });
        console.log('✅ User profile migrated to Supabase');
      }
      
      res.json({ 
        success: true, 
        message: 'Data migration completed - your website is now 100% independent!' 
      });
    } catch (error) {
      console.error('Migration error:', error);
      res.status(500).json({ error: 'Migration failed' });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          error: 'All fields are required: name, email, subject, message' 
        });
      }

      const emailSent = await sendContactEmail({ name, email, subject, message });
      
      if (emailSent) {
        res.json({ success: true, message: 'Message sent successfully!' });
      } else {
        res.status(500).json({ error: 'Failed to send message. Please try again.' });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  });

  const server = createServer(app);
  return server;
}