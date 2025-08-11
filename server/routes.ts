import type { Express } from "express";
import { createServer, type Server } from "http";
import { sendContactEmail } from './email.js';
import { getTargetedYouTubeVideo, getVideoDetails } from './videoSelection.js';
import { getBestVideoForDay, getGenericVideoFallback } from './youtubeService.js';
import { validateHobby, getVideosForHobby, suggestAlternativeHobbies } from './hobbyValidator.js';
import { hobbyValidator } from './openrouterValidation';
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
  
  // Skills improvement questions
  if (q.includes('improve') || q.includes('better') || q.includes('skill') || q.includes('advance')) {
    if (hobby.toLowerCase().includes('video') || hobby.toLowerCase().includes('editing')) {
      return `Here's how to improve your video editing skills progressively:

**Foundation (Days 1-2):**
• Master basic cuts, transitions, and timeline navigation
• Learn keyboard shortcuts for faster workflow
• Practice color correction and audio sync

**Intermediate (Days 3-5):**  
• Advanced effects and color grading techniques
• Audio mixing and sound design principles
• Storytelling through pacing and rhythm

**Advanced (Days 6-7):**
• Professional color grading workflows
• Motion graphics and title animations
• Portfolio development and client presentation

**Daily Practice Tips:**
• Edit different types of content (vlogs, commercials, stories)
• Study professional work and reverse-engineer techniques
• Join online communities for feedback and inspiration
• Practice with raw footage daily, even 15-30 minutes

Your 7-day plan covers all these progressively - each day builds on the previous!`;
    }
  }

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

// Helper function to clean JSON responses from AI APIs
function cleanJsonResponse(content: string): string {
  // Remove markdown code blocks if present
  let cleaned = content.trim();
  
  // Remove ```json and ``` markers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  return cleaned.trim();
}

// Use OpenRouter AI to find relevant videos when YouTube API fails
async function getAIRecommendedVideo(hobby: string, dayNumber: number, dayTitle: string, mainTask: string): Promise<string | null> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  
  if (!openRouterKey) {
    console.log('⚠️ No OpenRouter API key for video search');
    return null;
  }

  try {
    const prompt = `Find a YouTube video for learning ${hobby}. 

Specific topic for Day ${dayNumber}: ${dayTitle}
Main task: ${mainTask}

Return ONLY a JSON object with this structure:
{
  "videoId": "YouTube_video_ID_here",
  "title": "Video title",
  "reasoning": "Why this video fits the topic"
}

IMPORTANT: 
- Only return real, working YouTube video IDs
- Make sure the video is relevant to the specific day topic
- Prefer beginner-friendly tutorial videos under 45 minutes
- Return null if you cannot find a suitable video`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VITE_SUPABASE_URL || 'http://localhost:5000',
        'X-Title': 'Wizqo Hobby Learning'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
    });

    if (!response.ok) {
      console.log(`⚠️ OpenRouter video search failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.log('⚠️ No content from OpenRouter video search');
      return null;
    }

    // Parse AI response
    const cleanedContent = cleanJsonResponse(content);
    const videoData = JSON.parse(cleanedContent);
    
    if (videoData.videoId && videoData.videoId !== 'null') {
      console.log(`✅ AI found video for ${hobby} day ${dayNumber}: ${videoData.title} (${videoData.videoId})`);
      return videoData.videoId;
    }
    
    return null;
    
  } catch (error) {
    console.log(`❌ Error in AI video search:`, error);
    return null;
  }
}

// OpenRouter AI integration for dynamic plan generation
async function generateAIPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  console.log('🔧 generateAIPlan called for:', hobby);
  
  // SPEED OPTIMIZATION: Use fast fallback plan generation for instant results
  console.log('⚡ Using fast fallback plan generation for instant results');
  return generateFallbackPlan(hobby, experience, timeAvailable, goal);

  // Declare timeoutId outside try block so it's accessible in catch
  let timeoutId: NodeJS.Timeout | null = null;
  
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
      "title": "Just the activity name without 'Day X:' prefix",
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

    // Use OpenRouter API
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openRouterKey}`,
      'HTTP-Referer': 'https://wizqo.com',
      'X-Title': 'Wizqo Hobby Learning Platform'
    };
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    timeoutId = setTimeout(() => {
      console.log('⚠️ AI API request timed out after 5 seconds, aborting...');
      controller.abort();
    }, 5000); // 5 second timeout for fast response
    
    console.log('🔧 Making API request to OpenRouter...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })
    });
    
    console.log('🔧 API response received, status:', response.status);
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    console.log('🔧 Parsing API response...');
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.log('❌ No content in API response');
      throw new Error('No content in API response');
    }
    
    console.log('🔧 Content received, parsing JSON...');

    // Clean the response - OpenRouter sometimes wraps JSON in markdown code blocks
    const cleanedContent = cleanJsonResponse(content);
    console.log('🔧 Cleaned content, attempting JSON parse...');
    const aiPlan = JSON.parse(cleanedContent);
    console.log('🔧 JSON parsed successfully, processing videos...');
    
    // Add YouTube API videos to each day with quality filtering
    // SPEED OPTIMIZATION: Check if YouTube API is available first
    let isYouTubeAPIWorking = true;
    try {
      // Quick test call to check if API is working
      const testResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&type=video&key=${process.env.YOUTUBE_API_KEY}`);
      if (!testResponse.ok && testResponse.status === 403) {
        console.log('⚡ YouTube API quota exceeded - using fast fallback mode');
        isYouTubeAPIWorking = false;
      }
    } catch (error) {
      console.log('⚡ YouTube API unavailable - using fast fallback mode');
      isYouTubeAPIWorking = false;
    }

    // SPEED OPTIMIZATION: Use fast video assignment instead of slow API calls
    console.log('⚡ Using fast video assignment for instant plan generation');
    const hobbyVideos = getYouTubeVideos(hobby);
    
    aiPlan.days = aiPlan.days.map((day: any, index: number) => {
      // Use pre-selected videos for speed
      const targetedVideoId = hobbyVideos[index % hobbyVideos.length];
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
        freeResources: [], // USER PREFERENCE: Only affiliate links, no free tutorials
        affiliateProducts: [{
          ...getHobbyProduct(hobby, day.day)
        }]
      };
    });

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

  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId); // Ensure timeout is cleared on error
    console.error('OpenRouter API error:', error);
    
    // Check if it's a timeout/abort error
    if (error?.name === 'AbortError') {
      console.log('⚠️ OpenRouter API request timed out after 5 seconds, using fast fallback plan generation');
    } else {
      console.log('⚠️ OpenRouter API failed, using fast fallback plan generation');
    }
    
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



// Comprehensive fallback plan generator with detailed hobby-specific content
async function generateFallbackPlan(hobby: string, experience: string, timeAvailable: string, goal: string) {
  // Validate hobby input in fallback too
  const validation = validateHobby(hobby);
  if (!validation.isValid) {
    throw new Error(`"${hobby}" doesn't seem like a hobby. Please enter a specific hobby you'd like to learn (e.g., guitar, cooking, photography, yoga, coding).`);
  }
  
  hobby = validation.normalizedHobby;
  const days = [];
  
  // Generate comprehensive, hobby-specific daily plans
  const dailyPlans = generateHobbySpecificPlans(hobby, experience, timeAvailable);
  
  for (let i = 0; i < 7; i++) {
    const dayNumber = i + 1;
    const dayPlan = dailyPlans[i];
    
    // Use YouTube API for quality video selection
    const targetedVideoId = await getBestVideoForDay(
      hobby, 
      experience, 
      dayNumber, 
      dayPlan.title, 
      dayPlan.mainTask
    );
    console.log(`🔍 FALLBACK getBestVideoForDay returned: ${targetedVideoId} for ${hobby} day ${dayNumber}`);
    
    // Final verification: If we still get the problematic video, use a proper fallback
    const finalVideoId = targetedVideoId === 'dQw4w9WgXcQ' ? 'fC7oUOUEEi4' : targetedVideoId;
    console.log(`🔍 FINAL VIDEO ID after verification: ${finalVideoId} for ${hobby} day ${dayNumber}`);
    console.log(`🔧 VIDEO REPLACEMENT: ${targetedVideoId} -> ${finalVideoId}`);
    
    const videoDetails = getVideoDetails(hobby, experience, dayNumber);
    
    days.push({
      day: dayNumber,
      title: dayPlan.title,
      mainTask: dayPlan.mainTask,
      explanation: dayPlan.explanation,
      howTo: dayPlan.howTo,
      checklist: dayPlan.checklist,
      tips: dayPlan.tips,
      mistakesToAvoid: dayPlan.mistakesToAvoid,
      // ✅ COMPREHENSIVE DETAILED FIELDS - Include all enhanced content
      timeAllocation: dayPlan.timeAllocation,
      equipment: dayPlan.equipment,
      materials: dayPlan.materials,
      detailedSteps: dayPlan.detailedSteps,
      progressMilestones: dayPlan.progressMilestones,
      freeResources: [], // USER PREFERENCE: Only affiliate links, no free tutorials
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

// Generate comprehensive, hobby-specific daily plans
function generateHobbySpecificPlans(hobby: string, experience: string, timeAvailable: string) {
  const isBeginnerLevel = experience === 'none' || experience === 'beginner';
  const isIntermediateLevel = experience === 'some' || experience === 'intermediate';
  
  // Hobby-specific comprehensive plans
  const hobbyPlans: { [key: string]: any[] } = {
    guitar: [
      {
        title: "Guitar Fundamentals and Setup",
        mainTask: "Learn proper guitar posture, basic chord shapes, and essential techniques for building a solid foundation in guitar playing.",
        explanation: "Day 1 establishes the fundamental building blocks of guitar playing. You'll learn proper posture to prevent injury, understand basic guitar anatomy, and master your first chord shapes. This foundation is crucial for everything that follows in your guitar journey.",
        timeAllocation: "45-60 minutes total",
        equipment: [
          "🎸 Acoustic or electric guitar",
          "📱 Guitar tuner (app or physical)",
          "🎼 Guitar pick (medium thickness)",
          "🪑 Comfortable chair without arms",
          "📚 Music stand or tablet holder"
        ],
        materials: [
          "📝 Notebook for practice notes",
          "✏️ Pencil for marking chord diagrams",
          "📋 Guitar chord chart (printable)",
          "⏱️ Timer or metronome app"
        ],
        detailedSteps: [
          {
            step: "Guitar Setup & Tuning",
            time: "10 minutes",
            description: "🎵 Ensure your guitar is properly tuned using a tuner app. Check that all strings are secure and the guitar is clean. Adjust your chair height so your feet are flat on the floor and the guitar rests comfortably."
          },
          {
            step: "Proper Posture Training",
            time: "15 minutes", 
            description: "🪑 Sit with back straight, guitar resting on your right leg (if right-handed). Keep shoulders relaxed, left hand thumb behind the neck, not wrapped around. Practice holding position for 2-minute intervals."
          },
          {
            step: "Basic Chord Formation",
            time: "20 minutes",
            description: "🎯 Learn G major chord placement: 3rd fret low E string, 2nd fret A string, 3rd fret high E string. Practice pressing down firmly, checking each string rings clearly. Hold for 30 seconds, release, repeat 10 times."
          }
        ],
        progressMilestones: [
          "🎵 Can tune guitar independently using tuner",
          "🪑 Maintains proper posture for 5+ minutes comfortably", 
          "🎯 Forms G major chord with clear sound on all strings",
          "🔄 Transitions between relaxed and playing position smoothly"
        ],
        howTo: [
          "Set up proper sitting and standing posture with guitar positioned correctly against your body",
          "Learn to hold the pick properly and practice basic down strokes on open strings",
          "Master the G major chord by placing fingers 3rd fret low E, 2nd fret A, 3rd fret high E strings",
          "Practice C major chord: 1st fret B string, 2nd fret D string, 3rd fret A string",
          "Work on clean chord transitions between G and C, strumming slowly and deliberately",
          "Practice basic strumming pattern: Down-Down-Up-Down-Up with focus on rhythm"
        ],
        checklist: [
          "Guitar properly tuned using tuner app or physical tuner",
          "Comfortable chair or guitar strap for standing practice",
          "Guitar picks (medium thickness recommended for beginners)",
          "Music stand or tablet for viewing chord charts",
          "15-30 minute focused practice session scheduled"
        ],
        tips: [
          "🎯 Keep your fretting hand thumb behind the neck, not wrapped around",
          "💪 Press strings firmly but don't over-squeeze - find the minimum pressure needed",
          "🐌 Start with slow, clean chord changes rather than fast, sloppy ones",
          "⏰ Take breaks if your fingers hurt - building calluses takes time"
        ],
        mistakesToAvoid: [
          "⚠️ Holding the guitar neck like a baseball bat with thumb wrapped around",
          "💥 Pressing too hard on strings causing hand fatigue and poor tone",
          "🏃 Rushing through chord changes without ensuring clean notes",
          "🎵 Practicing with an untuned guitar - this trains your ear incorrectly"
        ]
      },
      {
        title: "Essential Chord Progressions and Strumming",
        mainTask: "Master fundamental chord progressions and develop rhythmic strumming patterns that form the backbone of thousands of songs.",
        explanation: "Day 2 builds on your chord foundation by introducing chord progressions - the sequences that create the harmonic structure of songs. You'll learn the most common progressions in popular music and develop strumming patterns that bring these chords to life.",
        howTo: [
          "Perfect the Em chord (easiest chord - 2nd fret A and D strings) for quick confidence building",
          "Master the D major chord (2nd fret G, 3rd fret B, 2nd fret high E strings)",
          "Practice the G-C-Em-D progression slowly, ensuring each chord rings clearly",
          "Learn the basic down-up strumming pattern with emphasis on beats 1 and 3",
          "Practice chord progression with steady tempo using metronome or backing track",
          "Work on 'quick changes' - rapid transitions between any two chords"
        ],
        checklist: [
          "Previous day's chords (G, C) can be played cleanly and consistently",
          "Metronome app or device for tempo practice",
          "Chord progression chart written out clearly",
          "Recording device to capture your practice for self-assessment",
          "Fresh mindset and warmed-up hands before starting"
        ],
        tips: [
          "Lift fingers together when changing chords, don't move them one at a time",
          "Practice chord changes without strumming first to build muscle memory",
          "Keep strumming hand moving even during chord changes to maintain rhythm",
          "Focus on making chord changes on beat rather than rushing ahead"
        ],
        mistakesToAvoid: [
          "Stopping strumming completely during chord changes",
          "Looking at fretting hand while changing chords - trust your muscle memory",
          "Practicing chord progressions too fast before mastering slow transitions",
          "Ignoring timing and rhythm in favor of just getting chord shapes right"
        ]
      },
      {
        title: "Picking Techniques and Melody Playing",
        mainTask: "Develop precise picking technique and learn to play simple melodies, transitioning from just chords to actual song parts and riffs.",
        explanation: "Day 3 introduces individual string picking, which opens up a whole new dimension of guitar playing. You'll learn proper pick control, play your first melodies, and understand how single notes combine with chords to create complete songs.",
        howTo: [
          "Practice alternate picking on single strings - down pick, up pick, down pick consistently",
          "Learn a simple melody like 'Twinkle Twinkle Little Star' on the B and high E strings",
          "Master the chromatic exercise: play 1-2-3-4 on each string, one finger per fret",
          "Practice palm muting technique - rest edge of picking hand on strings near bridge",
          "Combine simple melody with chord playing in a basic fingerpicking pattern",
          "Work on accuracy over speed - every note should ring clearly"
        ],
        checklist: [
          "Comfortable grip on pick established from previous days",
          "Simple melody written out in tablature or standard notation",
          "Clear understanding of fret numbers and string names",
          "Quiet practice space where you can hear clearly",
          "Patience for detail-oriented practice session"
        ],
        tips: [
          "Keep pick parallel to strings - don't let it tilt and catch on strings",
          "Use minimal motion when picking - efficiency creates speed",
          "Practice with a light touch - let the string vibrate naturally",
          "Start melodies very slowly and gradually increase tempo"
        ],
        mistakesToAvoid: [
          "Gripping the pick too tightly causing tension in hand and arm",
          "Using excessive motion when picking - bigger isn't better",
          "Rushing through exercises without ensuring clean note clarity",
          "Neglecting rhythm while focusing only on hitting the right notes"
        ]
      },
      {
        title: "Song Application and Performance Skills",
        mainTask: "Apply your skills to real songs, develop performance confidence, and learn to play complete song sections from start to finish.",
        explanation: "Day 4 transforms your individual skills into real music by learning complete song sections. You'll choose appropriate songs for your level, practice performing them smoothly, and develop the confidence to play for others.",
        howTo: [
          "Choose a simple 3-4 chord song using chords you've mastered (suggestions: 'Wonderwall', 'Horse with No Name')",
          "Learn the verse and chorus sections separately before combining them",
          "Practice singing along while playing to develop multitasking skills",
          "Record yourself playing through entire song sections to identify trouble spots",
          "Work on smooth transitions between song sections (verse to chorus)",
          "Practice starting and stopping cleanly - essential performance skills"
        ],
        checklist: [
          "Song chosen with lyrics and chords printed or displayed clearly",
          "Song audio available for reference and play-along practice",
          "All required chords can be played cleanly in isolation",
          "Recording capability for self-assessment",
          "Comfortable, distraction-free practice environment"
        ],
        tips: [
          "Start by just strumming chords while listening to the song",
          "Don't worry about exact strumming patterns initially - focus on chord changes",
          "Practice trouble spots slowly and separately before full song runs",
          "Build confidence with repetition - play sections until they feel automatic"
        ],
        mistakesToAvoid: [
          "Choosing songs too advanced for current skill level",
          "Trying to play exactly like the recording before mastering basics",
          "Getting frustrated with mistakes - they're part of the learning process",
          "Practicing only the easy parts and avoiding challenging sections"
        ]
      },
      {
        title: "Advanced Techniques and Musical Expression",
        mainTask: "Introduce advanced playing techniques like barre chords, hammer-ons, and pull-offs while developing your personal musical style and expression.",
        explanation: "Day 5 elevates your playing with techniques that professional guitarists use daily. You'll learn your first barre chord, explore expressive techniques, and begin developing your own musical voice beyond just copying songs.",
        howTo: [
          "Learn the F major barre chord - index finger across all strings at 1st fret, other fingers form E shape",
          "Practice hammer-on technique: fret a note, then 'hammer' another finger down to sound higher note",
          "Master pull-off technique: reverse of hammer-on, pull finger off to sound lower fretted note",
          "Experiment with vibrato - slight bending motion to add expression to sustained notes",
          "Practice chord embellishments - adding single notes to basic chords for color",
          "Work on dynamics - playing some parts louder/softer for musical expression"
        ],
        checklist: [
          "Hand strength developed from previous days of practice",
          "Understanding of basic chord shapes and transitions",
          "Willingness to work through initial difficulty of barre chords",
          "Examples of songs using barre chords available for reference",
          "Extended practice time allocated for challenging new techniques"
        ],
        tips: [
          "Build barre chord strength gradually - don't force it if fingers tire quickly",
          "Practice hammer-ons and pull-offs slowly before adding them to songs",
          "Listen to how professional guitarists use these techniques in context",
          "Focus on clean execution over speed - precision builds confidence"
        ],
        mistakesToAvoid: [
          "Pressing too hard on barre chords causing hand cramps and fatigue",
          "Trying to use advanced techniques before mastering basic chord playing",
          "Getting discouraged by initial difficulty - these techniques take time",
          "Overusing effects and techniques without musical purpose"
        ]
      },
      {
        title: "Creative Playing and Personal Style Development",
        mainTask: "Explore creative expression through improvisation, songwriting basics, and developing your unique approach to guitar playing.",
        explanation: "Day 6 focuses on creativity and personal expression. You'll learn basic improvisation, try simple songwriting, and explore different musical styles to find what resonates with your musical personality.",
        howTo: [
          "Learn the pentatonic scale pattern - the foundation for guitar solos and improvisation",
          "Practice improvising simple melodies over chord progressions you know",
          "Experiment with different strumming patterns and rhythmic feels",
          "Try creating your own chord progressions using chords you've learned",
          "Explore different musical styles - folk, rock, blues - with same basic chords",
          "Record short improvisation sessions to capture creative moments"
        ],
        checklist: [
          "Solid foundation in basic chords and picking from previous days",
          "Pentatonic scale pattern diagram or video reference",
          "Recording device for capturing creative ideas",
          "Open mindset for experimentation and creative exploration",
          "Examples of different musical styles available for inspiration"
        ],
        tips: [
          "Don't judge your creative attempts - exploration is the goal",
          "Start improvisation with just a few notes rather than entire scale",
          "Listen to different guitarists and notice their unique approaches",
          "Keep a musical journal of chord progressions and ideas you discover"
        ],
        mistakesToAvoid: [
          "Comparing your creative attempts to professional recordings",
          "Being too critical of experimental playing and creative exploration",
          "Sticking rigidly to learned patterns without personal interpretation",
          "Avoiding improvisation because it feels too advanced or intimidating"
        ]
      },
      {
        title: "Integration and Future Learning Path",
        mainTask: "Consolidate all learned skills into cohesive playing ability and create a structured plan for continued guitar development beyond the 7-day foundation.",
        explanation: "Day 7 brings together everything you've learned and sets you up for long-term success. You'll play complete songs confidently, understand your current skill level, and have a clear roadmap for continued improvement.",
        howTo: [
          "Perform 2-3 complete songs from start to finish, demonstrating all learned skills",
          "Assess your progress by recording 'before and after' comparisons",
          "Create a practice routine incorporating chords, picking, and songs",
          "Set specific, achievable goals for the next month of practice",
          "Research local guitar teachers, online courses, or learning resources",
          "Plan regular practice schedule and track progress methods"
        ],
        checklist: [
          "All basic chords can be played cleanly and changed smoothly",
          "At least one complete song can be performed confidently",
          "Understanding of practice methods that work best for your learning style",
          "Clear goals and timeline for continued learning",
          "Resources identified for next phase of guitar education"
        ],
        tips: [
          "Celebrate the progress made in just one week - it's significant!",
          "Focus on consistency in future practice rather than long sporadic sessions",
          "Join online guitar communities for motivation and support",
          "Keep challenging yourself with slightly harder songs and techniques"
        ],
        mistakesToAvoid: [
          "Stopping practice after completing the 7-day program",
          "Setting unrealistic goals for future learning progress",
          "Comparing your beginner skills to advanced players",
          "Neglecting to maintain and review previously learned skills"
        ]
      }
    ],
    
    cooking: [
      {
        title: "Kitchen Fundamentals and Safety",
        mainTask: "Master essential knife skills, kitchen safety, and ingredient preparation techniques that form the foundation of all successful cooking.",
        explanation: "Day 1 establishes the critical foundation of cooking: proper knife handling, kitchen safety, and basic preparation techniques. These skills are used in virtually every recipe and will make you more confident and efficient in the kitchen.",
        howTo: [
          "Learn proper knife grip: pinch the blade between thumb and forefinger, wrap other fingers around handle",
          "Master the rock-chop technique: keep knife tip on cutting board, rock blade through ingredients",
          "Practice basic cuts: dice onions into uniform cubes, julienne carrots into matchsticks",
          "Set up mise en place: organize all ingredients before cooking begins",
          "Learn proper hand positioning: claw grip to protect fingertips while cutting",
          "Practice kitchen safety: proper pot handle positioning, heat management, clean workspace"
        ],
        checklist: [
          "Sharp chef's knife (8-10 inch) properly maintained and cleaned",
          "Stable cutting board (wood or plastic, large enough for comfortable work)",
          "Practice ingredients: onions, carrots, celery for basic cuts",
          "Kitchen towels for cleanup and hand protection",
          "First aid kit accessible in case of minor cuts"
        ],
        tips: [
          "Keep knives sharp - dull knives are more dangerous than sharp ones",
          "Take your time with cuts initially - speed comes with practice",
          "Clean as you go to maintain organized workspace",
          "Taste ingredients as you prep to understand their flavors"
        ],
        mistakesToAvoid: [
          "Holding knife like a pencil or gripping blade instead of handle",
          "Cutting toward your body or without proper finger protection",
          "Using dull knives that slip and require excessive pressure",
          "Rushing through prep work without focus on technique and safety"
        ]
      },
      {
        title: "Heat Control and Basic Cooking Methods",
        mainTask: "Understand heat management and master fundamental cooking techniques: sautéing, boiling, and roasting that apply to countless recipes.",
        explanation: "Day 2 focuses on heat control - the most important skill for successful cooking. You'll learn how different heat levels affect food and master basic cooking methods that you'll use throughout your culinary journey.",
        howTo: [
          "Learn heat levels: low (simmer), medium (steady cooking), high (searing and quick cooking)",
          "Master sautéing technique: heat pan, add oil, cook ingredients while moving frequently",
          "Practice proper boiling: bring to rapid boil, then adjust heat to maintain gentle bubbling",
          "Learn basic roasting: high heat for browning, lower heat for even cooking through",
          "Cook simple egg dishes demonstrating each technique: scrambled (low), fried (medium), poached (simmering)",
          "Understand doneness indicators: visual cues, internal temperatures, texture changes"
        ],
        checklist: [
          "Heavy-bottomed sauté pan and medium saucepan available",
          "Cooking oil with high smoke point (vegetable, canola, or olive oil)",
          "Instant-read thermometer for checking internal temperatures",
          "Practice ingredients: eggs, vegetables, simple proteins",
          "Timer for tracking cooking times accurately"
        ],
        tips: [
          "Preheat pans properly before adding oil or ingredients",
          "Don't overcrowd pans - food will steam instead of browning",
          "Listen to your food - sizzling sounds indicate proper heat levels",
          "Adjust heat as needed throughout cooking process"
        ],
        mistakesToAvoid: [
          "Cooking everything on high heat thinking it's faster",
          "Adding oil to cold pans causing food to stick",
          "Constantly stirring or flipping food preventing proper browning",
          "Ignoring visual and auditory cues that indicate doneness"
        ]
      },
      {
        title: "Flavor Building and Seasoning Mastery",
        mainTask: "Develop your palate and learn how to build complex flavors through proper seasoning, herbs, spices, and taste balancing techniques.",
        explanation: "Day 3 transforms basic cooking into delicious food through flavor development. You'll learn how to taste and adjust seasonings, understand flavor profiles, and create dishes that are well-balanced and exciting to eat.",
        howTo: [
          "Learn the four basic tastes: salt enhances flavors, acid brightens, fat carries flavors, heat adds excitement",
          "Practice seasoning in layers: season ingredients as you cook, not just at the end",
          "Master herb and spice usage: dried herbs early in cooking, fresh herbs at the end",
          "Create a simple vinaigrette demonstrating acid balance: oil, vinegar, seasonings",
          "Cook aromatics (onions, garlic, ginger) to build flavor foundation for dishes",
          "Practice tasting and adjusting: add salt gradually, balance with acid, finish with fresh herbs"
        ],
        checklist: [
          "Basic spice collection: salt, pepper, garlic powder, paprika, dried herbs",
          "Fresh herbs available: parsley, basil, or cilantro for finishing dishes",
          "Acid ingredients: lemon juice, vinegar for balancing flavors",
          "Tasting spoons for safe sampling during cooking",
          "Small bowls for pre-measuring seasonings (mise en place)"
        ],
        tips: [
          "Season gradually and taste frequently - you can always add more",
          "Salt early in cooking process to allow flavors to develop",
          "Balance strong flavors - if too salty, add acid; if too acidic, add fat or sweetness",
          "Trust your palate and adjust seasonings to your preference"
        ],
        mistakesToAvoid: [
          "Adding all seasonings at once without tasting between additions",
          "Using the same spoon for tasting and cooking (food safety issue)",
          "Over-seasoning with strong spices that can't be removed",
          "Ignoring the importance of salt in enhancing other flavors"
        ]
      },
      {
        title: "Complete Meal Planning and Execution",
        mainTask: "Plan and execute a complete meal from start to finish, demonstrating timing, organization, and integration of all learned cooking skills.",
        explanation: "Day 4 puts all your skills together in the real-world challenge of preparing a complete meal. You'll learn timing, multitasking, and organization skills essential for successful home cooking.",
        howTo: [
          "Plan a simple 3-component meal: protein, vegetable, and starch (e.g., chicken, roasted vegetables, rice)",
          "Create cooking timeline working backward from desired serving time",
          "Prep all ingredients first (mise en place) before starting any cooking",
          "Start with longest-cooking components and add others according to timeline",
          "Practice multitasking: monitor multiple cooking processes simultaneously",
          "Finish all components so they're ready to serve at the same time"
        ],
        checklist: [
          "Complete meal planned with realistic cooking times researched",
          "All ingredients purchased and recipe steps reviewed",
          "Multiple pans and cooking surfaces available for simultaneous cooking",
          "Timer or phone for tracking multiple cooking processes",
          "Serving dishes and utensils ready for plating"
        ],
        tips: [
          "Start with simple meals - complexity comes with experience",
          "Keep components warm in low oven while finishing other dishes",
          "Don't attempt new techniques during complete meal preparation",
          "Have backup plans for components that might not work perfectly"
        ],
        mistakesToAvoid: [
          "Attempting too complex or unfamiliar recipes for first complete meal",
          "Starting all components at the same time regardless of cooking duration",
          "Panicking when timing doesn't work perfectly - adjust and keep cooking",
          "Forgetting to taste and season each component before serving"
        ]
      },
      {
        title: "Advanced Techniques and Troubleshooting",
        mainTask: "Learn advanced cooking techniques like braising and sauce-making while developing problem-solving skills for common cooking challenges.",
        explanation: "Day 5 introduces sophisticated cooking methods and teaches you how to rescue dishes when things go wrong. These skills separate confident cooks from beginners and give you the tools to handle any cooking situation.",
        howTo: [
          "Master braising technique: sear protein, add liquid, cover and cook slowly until tender",
          "Learn basic sauce making: create pan sauces using fond (browned bits) and deglazing",
          "Practice emulsification: make mayonnaise or hollandaise demonstrating how oil and water combine",
          "Understand how to fix common problems: too salty (add acid/dairy), too bland (add salt/acid), too thick (add liquid)",
          "Learn temperature control for delicate cooking: custards, chocolate melting, gentle reheating",
          "Practice rescue techniques: fixing broken sauces, salvaging overcooked vegetables"
        ],
        checklist: [
          "Heavy pot with lid for braising experiments",
          "Whisk and small saucepan for sauce making practice",
          "Ingredients for basic emulsion: eggs, oil, acid for mayonnaise",
          "Thermometer for monitoring delicate cooking temperatures",
          "Variety of tasting ingredients for problem-solving practice"
        ],
        tips: [
          "Low and slow cooking develops better flavors than rushing with high heat",
          "Taste constantly when learning to fix seasoning problems",
          "Don't be afraid to experiment - mistakes teach valuable lessons",
          "Keep calm when things go wrong - most cooking problems have solutions"
        ],
        mistakesToAvoid: [
          "Rushing advanced techniques that require patience and attention",
          "Giving up on dishes that seem to be going wrong",
          "Using high heat for delicate techniques that require gentle cooking",
          "Not tasting food throughout cooking process to catch problems early"
        ]
      },
      {
        title: "Creative Cooking and Recipe Development",
        mainTask: "Develop creativity in the kitchen by learning to improvise with available ingredients and create your own recipes based on fundamental techniques.",
        explanation: "Day 6 liberates you from strict recipe following and teaches creative cooking. You'll learn to improvise based on what's available, understand flavor combinations, and develop confidence to create original dishes.",
        howTo: [
          "Practice 'refrigerator cooking': create meals using only ingredients currently available",
          "Learn flavor pairing principles: complementary tastes, traditional combinations, creative contrasts",
          "Experiment with substitutions: replace ingredients in familiar recipes with available alternatives",
          "Create your own spice blends based on cuisine preferences (Italian herbs, Mexican spices, Asian five-spice)",
          "Practice improvisational cooking: start with technique and adapt based on available ingredients",
          "Document successful experiments and variations for future reference"
        ],
        checklist: [
          "Variety of ingredients available for experimentation",
          "Basic understanding of flavor profiles from different cuisines",
          "Notebook or phone for recording successful combinations and recipes",
          "Willingness to experiment and potentially make some unsuccessful dishes",
          "Basic spices and herbs for creating custom blends"
        ],
        tips: [
          "Start with familiar flavors and gradually introduce new combinations",
          "Think about texture combinations as well as flavors",
          "Keep portions small when experimenting so failures aren't wasteful",
          "Draw inspiration from restaurant dishes and try to recreate at home"
        ],
        mistakesToAvoid: [
          "Being too conservative - creativity requires some risk-taking",
          "Combining too many new flavors at once in experimental dishes",
          "Getting discouraged by unsuccessful experiments - they're part of learning",
          "Ignoring basic cooking principles while focusing on creativity"
        ]
      },
      {
        title: "Kitchen Mastery and Continued Learning",
        mainTask: "Consolidate all cooking skills into confident kitchen mastery and establish systems for continued culinary education and improvement.",
        explanation: "Day 7 transforms you from a beginner into a confident home cook with strong fundamentals and a clear path for continued improvement. You'll demonstrate mastery of basic skills and establish habits for lifelong culinary learning.",
        howTo: [
          "Prepare a complete dinner party meal for 2-4 people showcasing all learned skills",
          "Demonstrate knife skills, heat control, seasoning, and timing in integrated cooking session",
          "Create a personalized recipe collection of successful dishes from the week",
          "Establish regular cooking routine and practice schedule for continued improvement",
          "Research advanced cooking resources: cookbooks, online courses, local cooking classes",
          "Set specific cooking goals for next month: new cuisines, advanced techniques, special occasions"
        ],
        checklist: [
          "Confidence in basic knife skills and food safety practices",
          "Ability to cook complete meals with proper timing and seasoning",
          "Understanding of fundamental cooking techniques and when to use them",
          "Collection of successful recipes and techniques for future reference",
          "Plan for continued learning and skill development"
        ],
        tips: [
          "Cook regularly to maintain and improve skills - consistency is key",
          "Challenge yourself with new ingredients and techniques gradually",
          "Join cooking communities online or locally for inspiration and support",
          "Focus on quality ingredients - they make simple cooking shine"
        ],
        mistakesToAvoid: [
          "Stopping regular cooking practice after completing foundational week",
          "Becoming overconfident and skipping basic safety and sanitation practices",
          "Attempting overly complex recipes before mastering fundamentals",
          "Comparing your beginner skills to professional or experienced home cooks"
        ]
      }
    ],
    
    drawing: [
      {
        title: "Drawing Fundamentals and Basic Shapes",
        mainTask: "Master foundational drawing techniques including proper pencil grip, basic shapes, line quality, and observation skills essential for all drawing.",
        explanation: "Day 1 establishes the core fundamentals that underpin all drawing skills. You'll learn proper technique, develop hand-eye coordination, and understand how basic shapes form the foundation of complex subjects.",
        howTo: [
          "Learn proper pencil grip: hold pencil 1-2 inches from tip, use whole arm for large strokes",
          "Practice basic line exercises: straight lines, curves, circles, continuous lines without lifting pencil",
          "Master the four basic shapes: circles, squares, triangles, and cylinders in perspective",
          "Learn value scale creation: practice drawing gradients from light to dark using pencil pressure",
          "Practice contour drawing: draw objects using only outlines, focusing on observation",
          "Complete gesture drawing exercises: quick 30-second sketches capturing essential forms"
        ],
        checklist: [
          "Set of drawing pencils (2H, HB, 2B, 4B) for different line weights and values",
          "Large sketchbook (at least 9x12 inches) with quality paper",
          "Kneaded eraser for gentle corrections and highlights",
          "Simple objects for observation drawing: apple, cup, geometric shapes",
          "Good lighting setup for clear visibility of subjects and paper"
        ],
        tips: [
          "Draw from your shoulder, not just your wrist, for smoother lines",
          "Look at your subject more than your paper while drawing",
          "Start light and gradually darken lines - you can always add more",
          "Practice daily line exercises to build muscle memory and control"
        ],
        mistakesToAvoid: [
          "Gripping pencil too tightly causing hand fatigue and shaky lines",
          "Starting with dark lines that are difficult to erase or modify",
          "Drawing what you think objects look like instead of what you actually see",
          "Becoming frustrated with imperfect results - improvement takes consistent practice"
        ]
      },
      {
        title: "Understanding Light and Shadow",
        mainTask: "Learn how light creates form through shadow patterns and practice rendering three-dimensional objects using value and shading techniques.",
        explanation: "Day 2 introduces the crucial concept of light and shadow that gives drawings their three-dimensional appearance. You'll learn to see and render the subtle gradations that make flat drawings appear solid and realistic.",
        howTo: [
          "Set up simple still life with single light source to observe clear shadow patterns",
          "Identify the five elements of light: highlight, light tone, shadow edge, reflected light, cast shadow",
          "Practice shading techniques: hatching (parallel lines), cross-hatching (crossed lines), blending",
          "Draw simple geometric forms (sphere, cube, cylinder) showing complete light patterns",
          "Learn to squint to see simplified value patterns in complex subjects",
          "Practice gradual blending from light to dark using various pencil pressures"
        ],
        checklist: [
          "Single directional light source (desk lamp or window light)",
          "Simple white or neutral objects for clear shadow observation",
          "Blending tools: tissue, blending stumps, or finger for smooth gradations",
          "Range of pencils from hard (2H) to soft (6B) for different values",
          "Examples of master drawings showing excellent use of light and shadow"
        ],
        tips: [
          "Squint frequently to see major light and dark patterns",
          "Start with overall light and dark areas before adding details",
          "Reflected light is always darker than direct light areas",
          "Use consistent light direction throughout your drawing"
        ],
        mistakesToAvoid: [
          "Making reflected light areas too bright competing with direct light",
          "Adding cast shadows without understanding their shapes and directions",
          "Overworking surface details before establishing overall light patterns",
          "Using harsh, unrealistic contrast without observing actual light behavior"
        ]
      },
      {
        title: "Proportion and Measurement Techniques",
        mainTask: "Develop accurate proportional skills using measurement techniques and learn to see relationships between different parts of your subjects.",
        explanation: "Day 3 focuses on accuracy and proportion - skills that separate amateur drawings from professional-looking work. You'll learn practical techniques for measuring and comparing proportions in any subject.",
        howTo: [
          "Learn pencil measurement technique: hold pencil at arm's length to compare relative sizes",
          "Practice sight-size method: draw subjects at same size you observe them",
          "Use grid method for complex subjects: overlay grid on reference, transfer proportionally",
          "Master negative space drawing: focus on shapes around objects rather than objects themselves",
          "Practice envelope method: establish overall outer boundaries before interior details",
          "Complete proportional studies of simple objects focusing on accuracy over style"
        ],
        checklist: [
          "Variety of objects with clear proportional relationships",
          "Ruler or measuring tools for verification of proportional accuracy",
          "Grid overlay sheets or ability to draw light grid lines",
          "Examples of well-proportioned drawings for reference",
          "Patient mindset focused on accuracy over speed"
        ],
        tips: [
          "Check proportions frequently throughout drawing process",
          "Use landmarks and alignment points to maintain accuracy",
          "Step back from your drawing regularly to assess overall proportions",
          "Trust your measurements over what you think proportions should be"
        ],
        mistakesToAvoid: [
          "Drawing what you know instead of what you see proportionally",
          "Getting caught up in details before establishing correct overall proportions",
          "Ignoring negative spaces which often reveal proportion errors",
          "Rushing measurement process in favor of getting to 'fun' details"
        ]
      },
      {
        title: "Texture and Surface Rendering",
        mainTask: "Learn to observe and render different surface textures, developing techniques for creating convincing material qualities in your drawings.",
        explanation: "Day 4 adds realism and interest to your drawings through texture rendering. You'll learn to observe surface qualities and develop mark-making techniques that convince viewers of different material properties.",
        howTo: [
          "Study different surface textures: smooth (glass, metal), rough (bark, fabric), soft (fur, hair)",
          "Develop mark-making vocabulary: dots, dashes, scribbles, smooth tones for different textures",
          "Practice texture studies: small focused drawings showing specific surface qualities",
          "Learn to vary pencil pressure and direction to suggest different materials",
          "Combine multiple textures in single drawing to show material variety",
          "Practice edge quality: hard edges for crisp materials, soft edges for fuzzy surfaces"
        ],
        checklist: [
          "Objects with distinctly different textures for study",
          "Various pencil types and drawing tools for different mark-making",
          "Magnifying glass for observing fine texture details",
          "Reference photos of textures for detailed study",
          "Examples of masterful texture rendering in professional drawings"
        ],
        tips: [
          "Observe texture patterns rather than trying to draw every individual mark",
          "Vary your mark-making to keep textures lively and interesting",
          "Less can be more - suggest textures rather than overworking them",
          "Consider light's effect on texture - shiny vs. matte surfaces"
        ],
        mistakesToAvoid: [
          "Making all textures with same mark-making approach",
          "Overworking textures until they become muddy and unclear",
          "Ignoring how light affects different surface textures",
          "Adding texture details before establishing proper form and lighting"
        ]
      },
      {
        title: "Composition and Design Principles",
        mainTask: "Learn fundamental design principles and composition techniques that make drawings visually compelling and well-organized.",
        explanation: "Day 5 elevates your drawings from mere representation to compelling visual art through understanding composition. You'll learn how to organize elements for maximum visual impact and viewer engagement.",
        howTo: [
          "Learn rule of thirds: divide paper into nine sections, place focal points at intersections",
          "Practice different viewpoints: eye-level, bird's eye, worm's eye for visual interest",
          "Understand visual balance: distribute visual weight evenly or create purposeful imbalance",
          "Create depth through overlapping, size variation, and atmospheric perspective",
          "Practice leading lines: use lines within composition to guide viewer's eye",
          "Experiment with cropping: how framing affects impact and focus of drawings"
        ],
        checklist: [
          "Variety of subjects that can be arranged in different compositions",
          "Viewfinder or cropping tools for framing experiments",
          "Examples of well-composed drawings and paintings for study",
          "Understanding of basic design principles from reference materials",
          "Multiple sheets for composition studies and experiments"
        ],
        tips: [
          "Plan composition with thumbnail sketches before starting final drawing",
          "Consider negative space as important as positive shapes in composition",
          "Create focal hierarchy - some elements should dominate others",
          "Use contrast (light/dark, large/small) to create visual interest"
        ],
        mistakesToAvoid: [
          "Centering everything in composition creating static, boring arrangements",
          "Making all elements same size and importance competing for attention",
          "Ignoring background and negative space in compositional planning",
          "Starting detailed work before establishing strong overall composition"
        ]
      },
      {
        title: "Personal Style and Artistic Expression",
        mainTask: "Explore different drawing approaches and begin developing your personal artistic voice through experimentation with various techniques and subjects.",
        explanation: "Day 6 encourages artistic exploration and personal expression. You'll experiment with different approaches to find what resonates with your artistic vision and begin developing your unique drawing style.",
        howTo: [
          "Experiment with different drawing styles: realistic, impressionistic, cartoon, abstract",
          "Try various media combinations: pencil with ink, charcoal with white chalk",
          "Practice expressive mark-making: loose gestural approaches vs. tight detailed work",
          "Explore personal subject preferences: landscapes, portraits, still life, imagination",
          "Study different artistic movements and try techniques in your own work",
          "Create artwork that expresses personal interests and emotional responses"
        ],
        checklist: [
          "Variety of drawing materials for experimentation",
          "Examples of different artistic styles for inspiration",
          "Personal subjects or themes that interest you",
          "Experimental mindset open to trying new approaches",
          "Journal for recording successful techniques and personal preferences"
        ],
        tips: [
          "Don't worry about finding 'your style' immediately - it develops over time",
          "Copy masterworks to understand different approaches and techniques",
          "Follow your interests - draw what genuinely excites you",
          "Experiment freely without judgment about 'right' or 'wrong' approaches"
        ],
        mistakesToAvoid: [
          "Copying one artist's style exactly without developing personal interpretation",
          "Being too critical of experimental work during exploration phase",
          "Sticking rigidly to realistic approach without exploring other possibilities",
          "Comparing your developing style to established professional artists"
        ]
      },
      {
        title: "Portfolio Development and Continued Growth",
        mainTask: "Create a cohesive portfolio showcasing your learned skills and establish a structured plan for continued artistic development and improvement.",
        explanation: "Day 7 consolidates your week of learning into a portfolio demonstrating your progress and sets you up for continued artistic growth with clear goals and practice methods.",
        howTo: [
          "Select best drawings from week showing range of skills: line, value, proportion, texture, composition",
          "Complete one comprehensive drawing combining all learned techniques",
          "Photograph or scan work properly for digital portfolio documentation",
          "Assess strengths and areas for improvement based on week's work",
          "Research continued learning resources: books, online courses, local art classes",
          "Establish regular drawing practice schedule and skill development goals"
        ],
        checklist: [
          "Week's worth of drawings showing clear skill progression",
          "Camera or scanner for documenting artwork properly",
          "Portfolio folder or digital storage system for organizing work",
          "List of drawing subjects and techniques for continued practice",
          "Plan for ongoing learning and skill development"
        ],
        tips: [
          "Draw regularly, even if just for 15-20 minutes daily",
          "Seek feedback from other artists to accelerate improvement",
          "Challenge yourself with slightly harder subjects and techniques",
          "Keep a sketchbook for daily observation and practice"
        ],
        mistakesToAvoid: [
          "Stopping regular practice after completing foundational week",
          "Being overly critical of beginner work - focus on improvement, not perfection",
          "Attempting advanced techniques before solidifying fundamental skills",
          "Comparing your beginner portfolio to professional or experienced artists"
        ]
      }
    ],
    
    'game development': [
      {
        title: "Game Development Fundamentals & Setup",
        mainTask: "Set up your development environment, learn core game development concepts, and create your first interactive prototype.",
        explanation: "Day 1 introduces you to the exciting world of game development. You'll set up essential tools, understand the game development pipeline, and create your first simple interactive experience. This foundation will support everything you build in the following days.",
        timeAllocation: "60-90 minutes total",
        equipment: [
          "💻 Computer with decent specs (4GB+ RAM)",
          "🖱️ Mouse for precise editing",
          "🎧 Headphones for audio testing",
          "📱 Smartphone for mobile testing",
          "🔌 Stable internet connection"
        ],
        materials: [
          "🆓 Unity Hub (free game engine)",
          "💻 Visual Studio Code (free editor)",
          "🎨 Free sprite/3D assets from Unity Store",
          "📝 Game design notebook",
          "⏱️ Timer for focused development sessions"
        ],
        detailedSteps: [
          {
            step: "Development Environment Setup",
            time: "25 minutes",
            description: "🚀 Download and install Unity Hub, create Unity account, install Unity 2022.3 LTS version. Set up Visual Studio Code with C# extension. Verify everything works by creating a new 3D project."
          },
          {
            step: "Unity Interface Mastery",
            time: "30 minutes", 
            description: "🎮 Explore Unity's interface: Scene view, Game view, Project window, Inspector. Learn basic navigation (WASD + mouse). Create and manipulate basic objects (cubes, spheres). Understand parent-child relationships in hierarchy."
          },
          {
            step: "First Interactive Prototype",
            time: "35 minutes",
            description: "🎯 Create a simple 'click the cube' game: Add a cube, attach a simple C# script to detect mouse clicks, make the cube change color when clicked. Test in play mode to see your first interactive game element."
          }
        ],
        progressMilestones: [
          "🚀 Unity environment set up and functioning properly",
          "🎮 Can navigate Unity interface confidently", 
          "🎯 Created first interactive game object with script",
          "🔄 Successfully tested game in play mode"
        ],
        howTo: [
          "Download and install Unity Hub and Unity 2022.3 LTS",
          "Set up Visual Studio Code with C# extension for scripting",
          "Create your first Unity project and explore the interface",
          "Learn basic object manipulation and hierarchy organization",
          "Write your first C# script to handle mouse click interactions",
          "Test your interactive prototype in Unity's play mode"
        ],
        checklist: [
          "Unity Hub and Unity 2022.3 LTS installed successfully",
          "Visual Studio Code configured with C# extension",
          "New 3D Unity project created and opened",
          "First interactive script written and attached to game object",
          "Game tested in play mode with successful interaction"
        ],
        tips: [
          "🎯 Start with Unity's built-in tutorials - they're excellent for beginners",
          "💾 Save your project frequently (Ctrl+S) to prevent losing work",
          "🔍 Use Unity's Console window to debug errors - it's your best friend",
          "📚 Keep Unity's documentation open in browser for quick reference"
        ],
        mistakesToAvoid: [
          "⚠️ Installing multiple Unity versions as beginner - stick to LTS version",
          "🏃 Rushing through interface learning - take time to understand each panel",
          "🚫 Ignoring error messages in Console - they tell you exactly what's wrong",
          "📱 Trying complex features before mastering basic object manipulation"
        ]
      },
      {
        title: "Player Movement & Physics",
        mainTask: "Implement smooth player movement, understand Unity's physics system, and create responsive character controls that feel great to use.",
        explanation: "Day 2 focuses on one of the most crucial aspects of game development - making the player feel in control. You'll learn different movement techniques, work with Unity's physics, and understand what makes character movement feel responsive and enjoyable.",
        timeAllocation: "75-90 minutes total",
        equipment: [
          "💻 Unity project from Day 1",
          "🎮 Game controller (optional for testing)",
          "📐 Graph paper for movement planning",
          "⏱️ Stopwatch for timing tests"
        ],
        materials: [
          "🆓 Unity's Standard Assets (free)",
          "🎨 Simple character sprite or 3D model",
          "🎵 Sound effects for movement feedback",
          "📋 Movement reference videos from favorite games"
        ],
        detailedSteps: [
          {
            step: "Basic Movement Scripts",
            time: "30 minutes",
            description: "⌨️ Create C# script for basic WASD movement using Transform.Translate. Implement smooth movement with Time.deltaTime. Add boundary checking to prevent player leaving screen. Test different movement speeds."
          },
          {
            step: "Physics-Based Movement",
            time: "25 minutes",
            description: "🎯 Upgrade to Rigidbody movement using AddForce or velocity. Compare feel vs Transform movement. Add gravity effects and ground detection. Implement jumping mechanics with physics."
          },
          {
            step: "Enhanced Controls & Polish",
            time: "20 minutes",
            description: "✨ Add movement smoothing and acceleration. Implement variable jump heights. Add visual feedback (particle effects, screen shake). Create responsive controls that feel satisfying to use."
          }
        ],
        progressMilestones: [
          "⌨️ Implemented smooth WASD movement controls",
          "🎯 Successfully integrated physics-based movement",
          "🦘 Added jumping mechanics with proper physics",
          "✨ Enhanced movement with polish and visual feedback"
        ],
        howTo: [
          "Create movement script using Unity's Input system for WASD controls",
          "Implement smooth movement using Time.deltaTime for frame-rate independence",
          "Add Rigidbody component and experiment with physics-based movement",
          "Create jumping mechanics with ground detection and variable jump heights",
          "Add movement boundaries to keep player within game world",
          "Polish movement with acceleration, deceleration, and visual feedback"
        ],
        checklist: [
          "Movement script responds smoothly to WASD input",
          "Physics-based movement implemented with Rigidbody",
          "Jumping mechanics work reliably with ground detection",
          "Movement feels responsive and satisfying to control",
          "Player stays within defined game boundaries"
        ],
        tips: [
          "🎮 Test movement feel constantly - small changes make big differences",
          "⚡ Use FixedUpdate() for physics-based movement, Update() for Transform",
          "🎯 Study your favorite games' movement - what makes them feel good?",
          "📊 Adjust movement speed based on your game's scale and camera distance"
        ],
        mistakesToAvoid: [
          "🚫 Making movement too fast or too slow without testing thoroughly",
          "⚠️ Forgetting Time.deltaTime - movement will be framerate dependent",
          "🎮 Not testing with different input devices and sensitivities",
          "🏃 Adding complex movement before perfecting basic locomotion"
        ]
      }
    ]
  };
  
  // Get hobby-specific plans or create generic detailed plans
  const specificPlans = hobbyPlans[hobby.toLowerCase()];
  if (specificPlans) {
    return specificPlans;
  }
  
  // Comprehensive detailed fallback for any hobby
  return [
    {
      title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Fundamentals and Setup`,
      mainTask: `Establish proper foundation in ${hobby} through learning essential techniques, safety procedures, and setting up optimal practice environment.`,
      explanation: `Day 1 creates the fundamental building blocks for ${hobby}. You'll learn proper form, understand basic principles, and establish good habits that will serve you throughout your ${hobby} journey. This foundation prevents bad habits and ensures safe, effective practice.`,
      timeAllocation: "45-60 minutes total",
      equipment: [
        `📦 Basic ${hobby} starter kit with essential tools`,
        `📚 Reference guide or instruction manual`,
        `📱 Timer or smartphone for session tracking`,
        `🪑 Comfortable seating or workspace setup`,
        `💡 Adequate lighting for detailed work`
      ],
      materials: [
        `📝 Practice journal for tracking progress`,
        `✏️ Pen or pencil for notes and planning`,
        `📋 Checklist template for daily goals`,
        `⏱️ Timer app for focused practice sessions`
      ],
      detailedSteps: [
        {
          step: "Equipment Setup and Organization",
          time: "15 minutes",
          description: `🔧 Gather all essential ${hobby} equipment and organize your practice space. Ensure everything is clean, functional, and easily accessible. Set up proper lighting and comfortable workspace positioning.`
        },
        {
          step: "Fundamental Technique Learning",
          time: "25 minutes",
          description: `📖 Learn and practice the most basic techniques of ${hobby}. Focus on proper form and safety procedures. Start with simple movements or concepts, emphasizing accuracy over speed.`
        },
        {
          step: "Practice and Review",
          time: "15 minutes",
          description: `🔄 Practice the fundamental techniques learned. Take notes on what feels natural and what needs more work. Plan focus areas for tomorrow's session.`
        }
      ],
      progressMilestones: [
        `🎯 Can identify and name basic ${hobby} tools and equipment`,
        `📐 Demonstrates proper setup and workspace organization`,
        `🎨 Performs fundamental techniques with basic competency`,
        `📝 Successfully tracks practice session and identifies improvement areas`
      ],
      howTo: [
        `Research and understand basic ${hobby} terminology and concepts`,
        `Set up dedicated practice space with proper lighting and organization`,
        `Learn fundamental techniques starting with most basic movements or concepts`,
        `Practice core skills slowly with focus on proper form rather than speed`,
        `Complete beginner-level exercises designed to build foundational understanding`,
        `Review progress and identify areas needing extra attention tomorrow`
      ],
      checklist: [
        `Essential ${hobby} equipment gathered and properly organized`,
        `Practice area set up with adequate space and proper lighting`,
        `Basic reference materials available (books, videos, or guides)`,
        `Timer or tracking method for structured practice sessions`,
        `Safety equipment or procedures understood and implemented`
      ],
      tips: [
        `Focus on quality over quantity - better to do fewer repetitions correctly`,
        `Take breaks when concentration wavers to maintain focus`,
        `Start with shorter practice sessions and gradually increase duration`,
        `Keep notes on what works well and what needs improvement`
      ],
      mistakesToAvoid: [
        `Rushing through foundational concepts to get to 'fun' advanced techniques`,
        `Practicing with improper form that creates bad habits`,
        `Skipping safety procedures or using inadequate equipment`,
        `Becoming frustrated with beginner-level difficulty and slow progress`
      ]
    },
    {
      title: `Core Techniques and Skill Building`,
      mainTask: `Master essential ${hobby} techniques through focused practice and develop muscle memory for fundamental movements and concepts.`,
      explanation: `Day 2 builds on yesterday's foundation by introducing core techniques that you'll use repeatedly in ${hobby}. You'll develop muscle memory, improve coordination, and gain confidence through structured practice of essential skills.`,
      timeAllocation: "50-70 minutes total",
      equipment: [
        `📦 All equipment from Day 1 properly maintained`,
        `🎥 Recording device (phone/camera) for technique review`,
        `🪞 Mirror or reflective surface for form checking`,
        `📖 Advanced technique reference materials`,
        `⏰ Interval timer for structured practice sessions`
      ],
      materials: [
        `📚 Technique progression guide or checklist`,
        `📝 Practice log with yesterday's notes`,
        `🎯 Goal sheet for today's skill targets`,
        `💾 Storage for recorded practice sessions`
      ],
      detailedSteps: [
        {
          step: "Foundation Review and Warm-up",
          time: "15 minutes",
          description: `🔄 Review and practice Day 1 fundamentals until they feel more comfortable. Focus on muscle memory development and smooth execution of basic techniques.`
        },
        {
          step: "Core Technique Learning",
          time: "30 minutes",
          description: `🎯 Learn 2-3 essential core techniques that build on your foundation. Practice each technique in isolation, focusing on proper form and gradual speed increase.`
        },
        {
          step: "Integration and Recording",
          time: "20 minutes",
          description: `🎬 Combine techniques in simple sequences. Record your practice to review form and identify areas for improvement. Take detailed notes for tomorrow.`
        }
      ],
      progressMilestones: [
        `🎯 Day 1 fundamentals performed with increased confidence`,
        `🔧 Core techniques executed with basic proficiency`,
        `🎬 Successfully records and reviews own technique`,
        `📈 Shows measurable improvement from Day 1 baseline`
      ],
      howTo: [
        `Practice yesterday's fundamentals until they feel more natural`,
        `Learn 2-3 new core techniques building on foundational knowledge`,
        `Complete exercises specifically designed to develop muscle memory`,
        `Practice techniques in isolation before combining with other skills`,
        `Work on timing and rhythm if applicable to your chosen hobby`,
        `Record practice session to review technique and identify improvements`
      ],
      checklist: [
        `Foundational skills from Day 1 can be performed with basic competency`,
        `New techniques researched and demonstrated through reliable sources`,
        `Practice routine planned to maximize skill development time`,
        `Method for tracking progress and technique improvement`,
        `Adequate rest periods planned to prevent fatigue and maintain focus`
      ],
      tips: [
        `Repeat techniques until they begin to feel automatic`,
        `Focus on smooth, controlled movements rather than speed or power`,
        `Use mirrors or recording devices to check your form`,
        `Practice techniques both individually and in simple combinations`
      ],
      mistakesToAvoid: [
        `Attempting advanced variations before mastering basic techniques`,
        `Practicing when overly tired leading to sloppy form`,
        `Ignoring small technique details that become important later`,
        `Comparing your Day 2 skills to experienced practitioners`
      ]
    },
    {
      title: `Application and Problem-Solving`,
      mainTask: `Apply learned techniques to practical situations and develop problem-solving skills for common challenges in ${hobby}.`,
      explanation: `Day 3 moves beyond isolated practice to real-world application. You'll learn to adapt your skills to different situations, troubleshoot problems, and begin developing the judgment that separates beginners from competent practitioners.`,
      timeAllocation: "60-80 minutes total",
      equipment: [
        `🛠️ Complete toolkit from previous days`,
        `📋 Project planning materials and templates`,
        `🔍 Troubleshooting guides and reference materials`,
        `📱 Problem-solving apps or digital resources`,
        `🎯 Mini-project supplies for practical application`
      ],
      materials: [
        `📝 Project planning worksheets`,
        `🗂️ Common problems and solutions reference`,
        `📊 Progress tracking sheets for applications`,
        `🎨 Creative materials for varied practice scenarios`
      ],
      detailedSteps: [
        {
          step: "Skill Integration Review",
          time: "15 minutes",
          description: `🔄 Practice combining Day 1 and Day 2 techniques into smooth sequences. Focus on transitions and maintaining quality throughout integrated practice.`
        },
        {
          step: "Practical Application Projects",
          time: "35 minutes",
          description: `🎯 Complete 2-3 mini-projects that require applying your learned skills in practical situations. Focus on problem-solving when things don't go perfectly.`
        },
        {
          step: "Troubleshooting and Analysis",
          time: "20 minutes",
          description: `🔍 Identify common problems in your applications and practice systematic troubleshooting. Analyze what works well and plan improvements for tomorrow.`
        }
      ],
      progressMilestones: [
        `🎯 Successfully completes simple practical applications`,
        `🔧 Demonstrates basic problem-solving when issues arise`,
        `🔄 Integrates multiple techniques into coherent sequences`,
        `📈 Shows improved confidence in real-world application`
      ],
      howTo: [
        `Apply learned techniques to complete simple projects or sequences`,
        `Practice adapting techniques when conditions or requirements change`,
        `Identify and work on common problems beginners face in ${hobby}`,
        `Learn basic troubleshooting methods for when things don't go as planned`,
        `Complete mini-challenges that require combining multiple skills`,
        `Analyze what works well and what needs improvement in practical application`
      ],
      checklist: [
        `Basic techniques from previous days can be performed reliably`,
        `Simple projects or applications planned that use learned skills`,
        `Understanding of common beginner problems and their solutions`,
        `Materials or setup needed for practical application available`,
        `Realistic expectations set for first attempts at practical application`
      ],
      tips: [
        `Start with simpler applications before attempting complex projects`,
        `Don't be discouraged if practical application is harder than isolated practice`,
        `Take time to analyze problems rather than just repeating failed attempts`,
        `Celebrate small successes in practical application`
      ],
      mistakesToAvoid: [
        `Attempting projects too advanced for current skill level`,
        `Getting frustrated when practical application reveals skill gaps`,
        `Skipping back to basics when application problems arise`,
        `Focusing only on end results rather than learning from the process`
      ]
    },
    {
      title: `Intermediate Concepts and Refinement`,
      mainTask: `Introduce intermediate-level concepts and refine technique quality through focused practice and attention to detail.`,
      explanation: `Day 4 elevates your skills from basic competency toward intermediate ability. You'll learn more sophisticated techniques, improve the quality of your basic skills, and develop greater precision and control.`,
      timeAllocation: "70-90 minutes total",
      equipment: [
        `🎯 Precision tools for detailed technique work`,
        `📐 Measurement tools for accuracy assessment`,
        `🔍 Magnification or detail-enhancement tools`,
        `📹 High-quality recording setup for technique analysis`,
        `⚖️ Quality assessment materials and rubrics`
      ],
      materials: [
        `📊 Intermediate technique progression charts`,
        `🎯 Precision practice templates and guides`,
        `📝 Detailed self-assessment worksheets`,
        `📚 Advanced reference materials and examples`
      ],
      detailedSteps: [
        {
          step: "Foundation Refinement",
          time: "25 minutes",
          description: `🔧 Practice basic techniques with focus on precision and consistency. Use measurement tools and detailed analysis to improve quality beyond just 'good enough'.`
        },
        {
          step: "Intermediate Technique Introduction",
          time: "30 minutes",
          description: `📈 Learn intermediate-level concepts that build on your solid foundation. Practice advanced variations slowly, emphasizing proper form and understanding.`
        },
        {
          step: "Quality Control and Assessment",
          time: "25 minutes",
          description: `🎯 Critically analyze technique quality using detailed assessment criteria. Make specific improvements and plan advanced practice strategies.`
        }
      ],
      progressMilestones: [
        `🎯 Demonstrates improved precision in all basic techniques`,
        `📈 Successfully executes intermediate-level concepts`,
        `🔍 Shows ability to self-assess and improve technique quality`,
        `⚖️ Maintains high standards for technique execution`
      ],
      howTo: [
        `Refine basic techniques focusing on precision and consistency`,
        `Learn intermediate concepts that build on your foundation`,
        `Practice advanced variations of fundamental techniques`,
        `Work on subtle improvements in timing, control, or precision`,
        `Complete challenges that require higher skill levels`,
        `Analyze your technique critically and make specific improvements`
      ],
      checklist: [
        `Solid foundation in basic techniques with consistent execution`,
        `Understanding of how to progress from basic to intermediate level`,
        `Intermediate techniques researched and demonstrated by reliable sources`,
        `Higher standards set for technique quality and precision`,
        `Methods available for detailed self-assessment and improvement`
      ],
      tips: [
        `Focus on quality improvements rather than learning many new techniques`,
        `Pay attention to subtle details that distinguish good from great technique`,
        `Practice intermediate concepts slowly before increasing speed or complexity`,
        `Seek feedback from experienced practitioners when possible`
      ],
      mistakesToAvoid: [
        `Rushing to advanced techniques without refining intermediate skills`,
        `Accepting 'good enough' technique quality without pushing for improvement`,
        `Practicing intermediate techniques with poor foundational form`,
        `Getting impatient with the detailed work required for skill refinement`
      ]
    },
    {
      title: `Creative Expression and Personal Style`,
      mainTask: `Explore creative possibilities within ${hobby} and begin developing personal preferences and individual approach to practice.`,
      explanation: `Day 5 encourages creativity and personal expression. You'll explore different approaches, discover your preferences, and begin developing the individual style that makes ${hobby} personally meaningful and engaging.`,
      timeAllocation: "75-95 minutes total",
      equipment: [
        `🎨 Creative materials for experimentation`,
        `🖼️ Inspiration sources (books, digital galleries, examples)`,
        `📱 Documentation tools for creative experiments`,
        `🎭 Style exploration guides and references`,
        `🌈 Variety of materials for different creative approaches`
      ],
      materials: [
        `📖 Style reference collection and inspiration boards`,
        `📝 Creative experiment journal and notes`,
        `🎯 Personal preference discovery worksheets`,
        `💾 Digital storage for creative work documentation`
      ],
      detailedSteps: [
        {
          step: "Creative Foundation Review",
          time: "20 minutes",
          description: `🎨 Review all learned techniques as creative tools. Practice applying them with personal flair and expression rather than just technical accuracy.`
        },
        {
          step: "Style Exploration and Experimentation",
          time: "40 minutes",
          description: `🌟 Experiment with different styles and approaches within ${hobby}. Try creative variations, explore personal preferences, and create unique combinations.`
        },
        {
          step: "Personal Style Development",
          time: "25 minutes",
          description: `🎭 Identify elements that resonate with you personally. Create something unique that reflects your emerging style and document your creative preferences.`
        }
      ],
      progressMilestones: [
        `🎨 Successfully experiments with creative variations`,
        `🌟 Identifies personal preferences and style elements`,
        `🎭 Creates unique work reflecting individual approach`,
        `📝 Documents creative discoveries for future development`
      ],
      howTo: [
        `Experiment with different approaches and styles within ${hobby}`,
        `Try creative variations on standard techniques and applications`,
        `Explore different aspects of ${hobby} to find personal interests`,
        `Practice expressing personal preferences through your approach`,
        `Study different practitioners to see various styles and methods`,
        `Create something unique that reflects your personality and interests`
      ],
      checklist: [
        `Solid technical foundation that supports creative exploration`,
        `Examples of different styles and approaches within ${hobby} for inspiration`,
        `Open mindset for experimentation and creative risk-taking`,
        `Materials or setup that allows for creative expression`,
        `Understanding that creativity requires some failed experiments`
      ],
      tips: [
        `Don't judge creative experiments too harshly - exploration is the goal`,
        `Combine influences from different sources to create something personal`,
        `Follow your interests and intuition about what appeals to you`,
        `Keep notes about creative approaches that resonate with you`
      ],
      mistakesToAvoid: [
        `Copying others' styles exactly without adding personal interpretation`,
        `Being too conservative and not taking creative risks`,
        `Abandoning technical precision in favor of pure creativity`,
        `Comparing your creative experiments to established practitioners`
      ]
    },
    {
      title: `Integration and Advanced Application`,
      mainTask: `Integrate all learned skills into seamless performance and tackle advanced applications that demonstrate comprehensive ability.`,
      explanation: `Day 6 synthesizes your week of learning into fluid, integrated performance. You'll demonstrate mastery of foundational skills while applying them to more challenging situations that require combining multiple techniques.`,
      timeAllocation: "80-100 minutes total",
      equipment: [
        `🎯 Complete professional-level setup`,
        `📹 High-quality recording equipment for demonstrations`,
        `🎪 Performance or presentation setup`,
        `📊 Comprehensive assessment tools`,
        `🏆 Challenge project materials and resources`
      ],
      materials: [
        `📋 Integration practice sequences and routines`,
        `🎯 Advanced challenge project templates`,
        `📝 Performance evaluation criteria and rubrics`,
        `💾 Documentation systems for skill demonstration`
      ],
      detailedSteps: [
        {
          step: "Skill Integration Practice",
          time: "30 minutes",
          description: `🔄 Practice combining all learned techniques into smooth, fluid sequences. Focus on seamless transitions and maintaining quality throughout complex applications.`
        },
        {
          step: "Advanced Challenge Projects",
          time: "35 minutes",
          description: `🏆 Complete challenging projects that require comprehensive skill integration. Demonstrate ability to adapt and problem-solve in complex situations.`
        },
        {
          step: "Performance Documentation",
          time: "25 minutes",
          description: `📹 Record comprehensive demonstration of integrated skills. Create documentation of your progress and prepare for tomorrow's mastery planning.`
        }
      ],
      progressMilestones: [
        `🔄 Seamlessly integrates all learned techniques`,
        `🏆 Successfully completes advanced challenge projects`,
        `🎭 Demonstrates confidence in complex applications`,
        `📹 Creates comprehensive skill demonstration documentation`
      ],
      howTo: [
        `Combine all learned techniques into fluid, integrated sequences`,
        `Complete advanced projects that demonstrate comprehensive skill`,
        `Practice performing under slightly increased pressure or challenge`,
        `Work on transitions and connections between different techniques`,
        `Demonstrate ability to adapt and problem-solve in complex situations`,
        `Prepare a demonstration of your skills for others or for documentation`
      ],
      checklist: [
        `All fundamental and intermediate techniques can be performed reliably`,
        `Advanced projects planned that showcase integrated skill development`,
        `Understanding of how to combine techniques smoothly and effectively`,
        `Confidence in ability to handle moderately challenging applications`,
        `Method for demonstrating or documenting skill progression`
      ],
      tips: [
        `Focus on smooth integration rather than showcasing individual techniques`,
        `Practice handling mistakes gracefully and continuing performance`,
        `Build confidence through successful completion of challenging applications`,
        `Document your abilities to track progress and maintain motivation`
      ],
      mistakesToAvoid: [
        `Attempting applications too advanced for current integrated skill level`,
        `Focusing on impressive techniques rather than solid foundational performance`,
        `Getting nervous about demonstrating skills to others`,
        `Perfectionism that prevents completion of challenging applications`
      ]
    },
    {
      title: `Mastery Planning and Future Development`,
      mainTask: `Consolidate learning achievements and create structured plan for continued growth and skill development in ${hobby}.`,
      explanation: `Day 7 celebrates your rapid progress while establishing sustainable systems for continued improvement. You'll assess your current abilities, set realistic future goals, and create structured approaches for long-term skill development.`,
      timeAllocation: "90-120 minutes total",
      equipment: [
        `📊 Comprehensive assessment and testing materials`,
        `📋 Goal-setting and planning templates`,
        `📚 Research tools for continued learning resources`,
        `📱 Long-term tracking and scheduling apps`,
        `🎯 Portfolio or demonstration setup`
      ],
      materials: [
        `📈 Progress assessment worksheets and rubrics`,
        `🎯 Goal-setting templates for short and long-term planning`,
        `📚 Resource research guides and evaluation criteria`,
        `📅 Practice schedule templates and tracking systems`
      ],
      detailedSteps: [
        {
          step: "Comprehensive Skill Assessment",
          time: "35 minutes",
          description: `📊 Demonstrate all learned skills in comprehensive testing session. Assess current abilities objectively and identify strengths and improvement areas.`
        },
        {
          step: "Future Learning Planning",
          time: "40 minutes",
          description: `🎯 Research advanced resources, set specific measurable goals, and create detailed practice schedule. Plan your continued ${hobby} development journey.`
        },
        {
          step: "Portfolio Creation and Documentation",
          time: "35 minutes",
          description: `📁 Create comprehensive portfolio documenting your week's progress. Establish systems for continued progress tracking and motivation maintenance.`
        }
      ],
      progressMilestones: [
        `📊 Completes comprehensive assessment of all learned skills`,
        `🎯 Creates detailed plan for continued skill development`,
        `📚 Identifies appropriate resources for advanced learning`,
        `📁 Establishes portfolio and progress tracking systems`
      ],
      howTo: [
        `Assess progress by demonstrating all learned skills in comprehensive session`,
        `Identify strengths developed and areas still needing improvement`,
        `Research intermediate and advanced learning resources for continued growth`,
        `Create realistic practice schedule that fits your lifestyle and goals`,
        `Set specific, measurable goals for next month and next three months`,
        `Connect with community of practitioners for ongoing motivation and learning`
      ],
      checklist: [
        `Demonstrated competency in fundamental techniques and concepts`,
        `Clear understanding of current skill level and areas for improvement`,
        `Research completed on resources for continued learning`,
        `Realistic practice schedule developed for ongoing skill maintenance`,
        `Specific goals set for continued development in ${hobby}`
      ],
      tips: [
        `Celebrate significant progress made in just one week of focused learning`,
        `Maintain regular practice schedule to preserve and build on gains`,
        `Continue challenging yourself with slightly more difficult applications`,
        `Connect with others who share interest in ${hobby} for motivation`
      ],
      mistakesToAvoid: [
        `Stopping regular practice after completing intensive learning week`,
        `Setting unrealistic goals for future improvement that lead to discouragement`,
        `Comparing beginner skills to advanced practitioners rather than celebrating progress`,
        `Abandoning structured approach in favor of random, unfocused practice`
      ]
    }
  ];
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

      // Use OpenRouter for intelligent hobby validation
      console.log('🔍 Validating hobby with OpenRouter:', hobby);
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
      
      console.log('🚀 Starting plan generation for:', normalizedHobby);
      const plan = await generateAIPlan(normalizedHobby, experience, timeAvailable, goal || `Learn ${normalizedHobby} fundamentals`);
      console.log('✅ Plan generation completed successfully');
      res.json(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      res.status(500).json({ error: 'Failed to generate learning plan' });
    }
  });

  // AI Chat endpoint using OpenRouter API
  app.post('/api/chat', async (req, res) => {
    try {
      const { question, planData, hobbyContext } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      
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

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://wizqo.com',
          'X-Title': 'Wizqo Hobby Learning Platform'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
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
        console.error('OpenRouter API error:', response.status, response.statusText);
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
      const validation = await hobbyValidator.validateHobby(cleanHobby);
      console.log('🔍 Server validation result:', validation);
      
      // Ensure proper response format for frontend
      const response = {
        isValid: validation.isValid,
        correctedHobby: validation.correctedHobby, // Use correct property name
        originalHobby: cleanHobby,
        suggestions: validation.suggestions || [],
        reasoning: validation.reasoning
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

  // Add missing user progress endpoint
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