import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';

interface QuizAnswers {
  experience: string;
  timeAvailable: string;
  goal: string;
}

interface DayPlan {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  howToGuide: string;
  checklist: string[];
  commonMistakes: string[];
  tips: string[];
  freeResource: {
    title: string;
    url: string;
  };
  affiliateLink: {
    title: string;
    url: string;
    store: 'Amazon' | 'Michaels';
  };
}

interface PlanData {
  hobby: string;
  overview: string;
  days: DayPlan[];
}

interface UserProgress {
  completedDays: number[];
  currentDay: number;
  unlockedDays: number[];
}

// Simple router for SPA
type Route = 'landing' | 'generate' | 'plan';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedDays: [],
    currentDay: 1,
    unlockedDays: [1] // Day 1 is always unlocked (free)
  });
  const [showLoginAfterDay1, setShowLoginAfterDay1] = useState(false);

  // Simple routing based on URL hash
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.hash.slice(1) || '/';
      
      if (path === '/' || path === '') {
        setCurrentRoute('landing');
      } else if (path === '/generate') {
        setCurrentRoute('generate');
      } else if (path === '/plan') {
        setCurrentRoute('plan');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange(); // Initial route

    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  // Load user progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('wizqo-user-progress');
    const savedLoginStatus = localStorage.getItem('wizqo-logged-in');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
    
    if (savedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wizqo-user-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Save login status to localStorage
  useEffect(() => {
    localStorage.setItem('wizqo-logged-in', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Navigation helpers
  const navigateTo = (route: Route) => {
    let path = '';
    switch (route) {
      case 'landing':
        path = '/';
        break;
      case 'generate':
        path = '/generate';
        break;
      case 'plan':
        path = '/plan';
        break;
    }
    window.location.hash = path;
    setCurrentRoute(route);
  };

  // Progress tracking functions
  const isDayUnlocked = (dayNumber: number): boolean => {
    return userProgress.unlockedDays.includes(dayNumber);
  };

  const isDayCompleted = (dayNumber: number): boolean => {
    return userProgress.completedDays.includes(dayNumber);
  };

  const completeDay = (dayNumber: number) => {
    // Mark day as completed
    const newCompletedDays = [...userProgress.completedDays];
    if (!newCompletedDays.includes(dayNumber)) {
      newCompletedDays.push(dayNumber);
    }

    // Update progress
    const newProgress = {
      ...userProgress,
      completedDays: newCompletedDays,
      currentDay: Math.min(dayNumber + 1, 7)
    };

    // Handle Day 1 completion logic
    if (dayNumber === 1 && !isLoggedIn) {
      // Show login modal after Day 1 completion
      setShowLoginAfterDay1(true);
      setUserProgress(newProgress);
      return;
    }

    // If user is logged in or it's not Day 1, unlock next day
    if (isLoggedIn && dayNumber < 7) {
      const newUnlockedDays = [...userProgress.unlockedDays];
      if (!newUnlockedDays.includes(dayNumber + 1)) {
        newUnlockedDays.push(dayNumber + 1);
      }
      newProgress.unlockedDays = newUnlockedDays;
    }

    setUserProgress(newProgress);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginAfterDay1(false);
    
    // After login, unlock Day 2 if Day 1 is completed
    if (userProgress.completedDays.includes(1)) {
      const newUnlockedDays = [...userProgress.unlockedDays];
      if (!newUnlockedDays.includes(2)) {
        newUnlockedDays.push(2);
      }
      setUserProgress({
        ...userProgress,
        unlockedDays: newUnlockedDays
      });
    }
  };

  const resetProgress = () => {
    setUserProgress({
      completedDays: [],
      currentDay: 1,
      unlockedDays: [1]
    });
    setIsLoggedIn(false);
    setShowLoginAfterDay1(false);
    localStorage.removeItem('wizqo-user-progress');
    localStorage.removeItem('wizqo-logged-in');
  };

  // AI-powered plan generation with DeepSeek API using enhanced prompt
  const generatePlanWithAI = async (hobby: string, answers: QuizAnswers): Promise<PlanData> => {
    const prompt = `Generate a detailed, motivating, and beginner-level-appropriate 7-day learning plan for the hobby: ${hobby}.

User Details:
- Experience level: ${answers.experience}
- Time commitment per day: ${answers.timeAvailable}
- Goal: ${answers.goal}
- Available tools/resources: Computer with internet access, code editor (if applicable), browser, basic knowledge relevant to the hobby, and access to free online resources

Instructions:

Overview (3–4 sentences):
- Use a warm, beginner-friendly tone
- Highlight what the user will achieve in 7 days
- Encourage confidence and clarity in learning

Daily Mini-Lessons (Day 1 to Day 7):
Each lesson must include ALL the following labeled sections:

🎯 Main Task:
- Step-by-step actionable task suitable for beginners
- Include clear instructions, especially for research/discovery activities

📚 Explanation & Why:
- Explain the importance of the task in their learning journey
- Show how it connects with prior/future days

🔍 How to Find / Do / Use (if applicable):
- Detail exactly how to complete the task
- Mention free tools, platforms, and practical guidance

📋 Detailed Checklist (if applicable):
- List all tools, resources, or setup needs
- Briefly explain each item's role

⚠️ Common Mistakes to Avoid:
- 1 to 3 beginner mistakes with fixes

💡 Tips for Success:
- 2–3 practical and encouraging beginner tips

🔗 Free Resource:
- One active, beginner-friendly link (YouTube tutorial, blog, or free course)
- Must be high-quality and reputable

🛒 Affiliate Link:
- Provide 1 product/tool link relevant to each day's task

**Output Format:**
Return a valid JSON object with this exact structure:

{
  "hobby": "${hobby}",
  "overview": "A compelling 3-4 sentence description of what they'll achieve in 7 days",
  "days": [
    {
      "day": 1,
      "title": "Clear, actionable day title (max 6 words)",
      "mainTask": "Detailed step-by-step task with specific time requirements",
      "explanation": "Why this task is important and how it connects to the learning journey",
      "howToGuide": "Specific instructions on how to complete the task",
      "checklist": ["Item 1 - purpose", "Item 2 - purpose", "Item 3 - purpose"],
      "commonMistakes": ["Mistake 1 and how to fix it", "Mistake 2 and how to fix it"],
      "tips": ["Practical tip 1", "Encouraging tip 2", "Success tip 3"],
      "freeResource": {
        "title": "Descriptive title for a YouTube tutorial or article",
        "url": "https://youtube.com/watch?v=realistic-video-id"
      },
      "affiliateLink": {
        "title": "Realistic beginner tool/supply name",
        "url": "https://amazon.com/dp/PRODUCTID?tag=wizqo-20",
        "store": "Amazon"
      }
    }
  ]
}

**Important Guidelines:**
- Day 1 should be absolute beginner friendly
- Each day should take roughly ${answers.timeAvailable}
- Tasks should be specific and measurable
- All sections must be filled with detailed, actionable content
- Free resource URLs should look realistic (use placeholder video IDs)
- Product links should use realistic Amazon product patterns
- Alternate between "Amazon" and "Michaels" for the store field
- Progressive difficulty: Day 1 = basics, Day 7 = first real project/achievement
- Focus on ${answers.goal} throughout the plan

**Tone:** Encouraging, practical, beginner-friendly, detailed
**Focus:** ${answers.goal} while building real skills step by step

Generate the complete 7-day plan now with all required sections filled.`;

    try {
      // In a real app, you'd make the API call here
      // const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: 'deepseek-chat',
      //     messages: [{ role: 'user', content: prompt }],
      //     response_format: { type: 'json_object' },
      //     temperature: 0.7,
      //     max_tokens: 4000
      //   })
      // });
      // 
      // const data = await response.json();
      // const planData = JSON.parse(data.choices[0].message.content);
      
      // For now, return fallback plan (remove this when you add real API)
      console.log('Enhanced AI Prompt that would be sent:', prompt);
      return getFallbackPlan(hobby, answers);
      
    } catch (error) {
      console.error('Error generating AI plan:', error);
      // Fallback to static plan
      return getFallbackPlan(hobby, answers);
    }
  };

  // Fallback static plans for reliability with enhanced structure
  const getFallbackPlan = (hobby: string, answers: QuizAnswers): PlanData => {
    const hobbyPlans: { [key: string]: Partial<PlanData> } = {
      "youtube api": {
        overview: "Master YouTube API integration and dynamic video embedding in just 7 days! You'll learn to connect to the YouTube Data API, search for videos programmatically, and create interactive video players on your webpage. By the end, you'll have a fully functional video gallery with real-time data from YouTube.",
        days: [
          {
            day: 1,
            title: "YouTube API Setup and Authentication",
            mainTask: "Create a Google Cloud Console project, enable the YouTube Data API v3, and generate your first API key. Then make your first API call to verify everything works correctly.",
            explanation: "Setting up proper API access is the foundation of everything you'll build this week. Without authentication, you can't access YouTube's vast video database. This step ensures you have the proper credentials and understand the authentication flow.",
            howToGuide: "1. Go to console.cloud.google.com and create a new project. 2. Navigate to 'APIs & Services' > 'Library' and search for 'YouTube Data API v3'. 3. Enable the API. 4. Go to 'Credentials' and create an API key. 5. Restrict the key to YouTube Data API for security.",
            checklist: [
              "Google account - needed for Cloud Console access",
              "Web browser - for accessing Google Cloud Console", 
              "Text editor - to store your API key securely",
              "Basic understanding of APIs - you'll learn as you go"
            ],
            commonMistakes: [
              "Forgetting to enable the YouTube Data API after creating the key - always enable first, then create credentials",
              "Sharing your API key publicly - treat it like a password and keep it secret",
              "Not setting up API restrictions - restrict your key to specific APIs for security"
            ],
            tips: [
              "Write down your API key immediately and store it in a secure file",
              "Start with a simple test call using a tool like Postman or your browser",
              "Don't worry if it seems complex - we'll break it down step by step"
            ],
            freeResource: {
              title: "YouTube Data API Getting Started Guide",
              url: "https://youtube.com/watch?v=api-setup-tutorial"
            },
            affiliateLink: {
              title: "Web Development Reference Book",
              url: "https://amazon.com/dp/B08123?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 2,
            title: "Making Your First API Calls",
            mainTask: "Learn the basic structure of YouTube API requests and successfully retrieve video information using the search endpoint. Practice with different search queries and understand the response format.",
            explanation: "Now that you have access, it's time to actually communicate with YouTube's servers. Understanding how to format requests and interpret responses is crucial for everything you'll build later. This is where the magic happens!",
            howToGuide: "Use the URL format: https://www.googleapis.com/youtube/v3/search?part=snippet&q=YOUR_SEARCH&key=YOUR_API_KEY. Replace YOUR_SEARCH with what you want to find and YOUR_API_KEY with your actual key. Test this in your browser first.",
            checklist: [
              "Your API key from Day 1 - the access credential you created",
              "Web browser or API testing tool - to make the requests",
              "Notepad - to save interesting video IDs you find",
              "Curiosity about JSON - the format YouTube uses to send data"
            ],
            commonMistakes: [
              "Forgetting to include the 'part=snippet' parameter - this tells YouTube what data to return",
              "Not URL-encoding search terms with spaces - use %20 instead of spaces in URLs"
            ],
            tips: [
              "Start with simple, single-word searches before trying complex queries",
              "Save examples of successful API responses - they're great references",
              "Each API call uses part of your daily quota, so be mindful but don't worry about running out during learning"
            ],
            freeResource: {
              title: "Understanding YouTube API Responses",
              url: "https://youtube.com/watch?v=api-responses-guide"
            },
            affiliateLink: {
              title: "JSON Parsing and APIs Handbook",
              url: "https://michaels.com/product/api-handbook?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 3,
            title: "Building Basic HTML Video Display",
            mainTask: "Create a simple HTML page that displays YouTube videos using iframe embeds. Learn how to extract video IDs from API responses and convert them into playable embedded videos.",
            explanation: "This is where your API knowledge meets the visual web! You're learning to take the data YouTube gives you and turn it into something users can actually watch. This bridges the gap between raw data and user experience.",
            howToGuide: "Create an HTML file with iframe elements using this format: <iframe src='https://www.youtube.com/embed/VIDEO_ID'></iframe>. Replace VIDEO_ID with IDs you got from yesterday's API calls. Test locally by opening the HTML file in your browser.",
            checklist: [
              "Text editor (VS Code, Notepad++, etc.) - for writing HTML code",
              "Web browser - to test your embedded videos",
              "Video IDs from Day 2 - the unique identifiers you collected",
              "Basic HTML knowledge - you'll learn the specific parts you need"
            ],
            commonMistakes: [
              "Using full YouTube URLs instead of just the video ID in the embed code",
              "Forgetting to set width and height attributes on iframes - videos might appear tiny or huge",
              "Not testing your embeds - always check that videos actually play"
            ],
            tips: [
              "Start with just one video embed before creating multiple ones",
              "Use responsive iframe techniques to make videos look good on different screen sizes",
              "Keep a list of working video IDs - they're great for testing"
            ],
            freeResource: {
              title: "HTML iframe and YouTube Embedding Tutorial",
              url: "https://youtube.com/watch?v=html-iframe-tutorial"
            },
            affiliateLink: {
              title: "HTML & CSS Learning Kit",
              url: "https://amazon.com/dp/B08456?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 4,
            title: "JavaScript API Integration Basics",
            mainTask: "Write JavaScript code to make YouTube API calls directly from your webpage and dynamically display the results. Create a simple search function that fetches videos and shows them on your page.",
            explanation: "This is the turning point where static becomes dynamic! Instead of manually copying video IDs, you'll create a system that can search and display videos automatically. This is the foundation of any interactive video application.",
            howToGuide: "Use JavaScript's fetch() function to call the YouTube API. Create input fields for search terms, use addEventListener for button clicks, and update your HTML dynamically with the results using DOM manipulation.",
            checklist: [
              "JavaScript knowledge - basic functions and variables",
              "Your working HTML page from Day 3 - the foundation to build on",
              "Browser developer tools - press F12 to debug your code",
              "Patience for debugging - coding involves lots of trial and error"
            ],
            commonMistakes: [
              "Putting your API key directly in client-side JavaScript - anyone can see it in the source code",
              "Not handling API errors - always check if your requests succeeded before using the data",
              "Forgetting about CORS issues - YouTube API requires proper request handling"
            ],
            tips: [
              "Start with console.log() to see what data you're getting from the API",
              "Test each piece separately - first the API call, then the display logic",
              "Use browser developer tools to debug - they show you exactly what's going wrong"
            ],
            freeResource: {
              title: "JavaScript Fetch API and DOM Manipulation",
              url: "https://youtube.com/watch?v=javascript-fetch-dom"
            },
            affiliateLink: {
              title: "JavaScript Programming Guide",
              url: "https://michaels.com/product/javascript-guide?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 5,
            title: "Dynamic Search and Filtering Features",
            mainTask: "Enhance your video search with filters like upload date, duration, and video quality. Add pagination to handle multiple pages of results and create a user-friendly search interface.",
            explanation: "Real applications need more than basic search - users want to find exactly what they're looking for. Today you'll learn advanced API parameters that make your video search as powerful as YouTube's own search functionality.",
            howToGuide: "Add URL parameters like &order=date, &videoDuration=short, &videoDefinition=high to your API calls. Implement 'next page' and 'previous page' buttons using pageToken parameters from API responses.",
            checklist: [
              "Working search function from Day 4 - your foundation to enhance",
              "YouTube API documentation - reference for all available parameters",
              "CSS skills (basic) - to make your interface look professional",
              "User experience mindset - think about what searchers actually want"
            ],
            commonMistakes: [
              "Adding too many filter options at once - start simple and add complexity gradually",
              "Not validating user input - check that search terms aren't empty before making API calls",
              "Ignoring loading states - users need feedback when searches are in progress"
            ],
            tips: [
              "Test your filters with different types of searches to see how they work",
              "Add loading indicators so users know something is happening during searches",
              "Consider adding search suggestions or recent searches for better user experience"
            ],
            freeResource: {
              title: "Advanced YouTube API Parameters and Filtering",
              url: "https://youtube.com/watch?v=api-advanced-search"
            },
            affiliateLink: {
              title: "UX Design for Developers Book",
              url: "https://amazon.com/dp/B08789?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 6,
            title: "Error Handling and User Experience",
            mainTask: "Implement comprehensive error handling for API failures, rate limiting, and network issues. Add loading states, error messages, and graceful fallbacks to create a professional user experience.",
            explanation: "Real-world applications must handle things going wrong gracefully. Networks fail, APIs go down, and users make mistakes. Professional error handling is what separates amateur projects from production-ready applications.",
            howToGuide: "Wrap API calls in try-catch blocks, check response status codes, and display meaningful error messages. Add loading spinners during API calls and fallback content when things fail. Test by temporarily using invalid API keys.",
            checklist: [
              "Your working video search from Day 5 - the app you'll make bulletproof",
              "Understanding of HTTP status codes - 200 means success, 4xx means client error, 5xx means server error",
              "Basic CSS for styling error messages - red colors, warning icons, etc.",
              "Empathy for users - imagine what they need when things go wrong"
            ],
            commonMistakes: [
              "Showing technical error messages to users - they don't care about '404 Not Found', they want to know what to do next",
              "Not testing error scenarios - intentionally break things to see how your app responds",
              "Forgetting about slow internet connections - some users don't have fast internet"
            ],
            tips: [
              "Write error messages that tell users what happened and what they can do about it",
              "Test your error handling by temporarily changing your API key to an invalid one",
              "Consider adding retry buttons for failed searches - sometimes trying again works"
            ],
            freeResource: {
              title: "JavaScript Error Handling Best Practices",
              url: "https://youtube.com/watch?v=error-handling-guide"
            },
            affiliateLink: {
              title: "Web Development Testing Tools",
              url: "https://michaels.com/product/testing-tools?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 7,
            title: "Complete Video Gallery Project",
            mainTask: "Combine everything you've learned to create a polished YouTube video gallery application. Add features like favorites, video details, responsive design, and deploy it online for others to use.",
            explanation: "This is your graduation day! You'll take all the pieces you've built and combine them into something impressive that showcases your new skills. This project becomes part of your portfolio and proves you can work with real APIs.",
            howToGuide: "Create a multi-section layout with search, results, and video player areas. Add local storage to remember user preferences and favorites. Use CSS Grid or Flexbox for responsive design. Deploy using GitHub Pages, Netlify, or Vercel.",
            checklist: [
              "All your code from Days 1-6 - the building blocks of your final project",
              "A GitHub account - for version control and deployment",
              "CSS framework knowledge (optional) - Bootstrap or Tailwind can speed up styling",
              "Pride in your progress - you've learned a lot this week!"
            ],
            commonMistakes: [
              "Trying to add too many features at once - start with core functionality, then enhance",
              "Not testing on different devices - your app should work on phones and tablets too",
              "Forgetting to commit your code to version control - always save your progress"
            ],
            tips: [
              "Focus on making something that works well rather than something with every possible feature",
              "Ask friends or family to test your app - fresh eyes catch issues you might miss",
              "Document your code with comments - future you will thank present you"
            ],
            freeResource: {
              title: "Deploying Web Applications for Free",
              url: "https://youtube.com/watch?v=free-deployment-guide"
            },
            affiliateLink: {
              title: "Portfolio Development Masterclass",
              url: "https://amazon.com/dp/B08012?tag=wizqo-20",
              store: 'Amazon' as const
            }
          }
        ]
      },
      painting: {
        overview: "Transform from complete beginner to confident painter in just 7 days. You'll learn essential techniques, color theory, and create your first masterpiece with step-by-step guidance and expert tips!",
        days: [
          {
            day: 1,
            title: "Getting Started with Basic Strokes",
            mainTask: "Practice basic brush strokes on paper - horizontal, vertical, and circular motions for 15 minutes. Focus on controlling pressure and maintaining steady movements.",
            explanation: "Brush control is the foundation of all painting. Today's exercises build the muscle memory you'll need for every technique you learn this week. It's like learning to write before composing poetry.",
            howToGuide: "Hold your brush like a pencil, about 2 inches from the ferrule. Start with light pressure and gradually increase. Make slow, deliberate strokes rather than quick ones.",
            checklist: [
              "Basic acrylic paints - red, blue, yellow, black, white",
              "Round brush #8 - perfect size for beginners",
              "Canvas paper or canvas board - affordable practice surface",
              "Water cup - for cleaning brushes between colors"
            ],
            commonMistakes: [
              "Holding the brush too close to the ferrule - this limits your range of motion",
              "Using too much pressure initially - start light and build up",
              "Not cleaning the brush between strokes - muddy colors result"
            ],
            tips: [
              "Practice makes progress - even professional artists do warm-up strokes",
              "Light pressure creates smoother lines than heavy pressure",
              "Take breaks every 5 minutes to avoid hand fatigue"
            ],
            freeResource: {
              title: "Basic Brush Techniques Tutorial",
              url: "https://youtube.com/watch?v=basic-brushes"
            },
            affiliateLink: {
              title: "Beginner Acrylic Paint Set",
              url: "https://amazon.com/dp/B01234?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 2,
            title: "Understanding Colors",
            mainTask: "Create a color wheel using only red, blue, and yellow paints. Mix secondary colors (orange, green, purple) and practice blending techniques for 20 minutes.",
            explanation: "Color mixing is fundamental to painting. Understanding how colors work together will help you create mood, depth, and realistic scenes. This knowledge is essential for every painting you'll ever create.",
            howToGuide: "Start with small amounts of paint. Mix colors on a palette, not directly on your canvas. Keep a color mixing chart as reference for future paintings.",
            checklist: [
              "Primary colors from Day 1 - red, blue, yellow",
              "Palette or disposable plate - for mixing colors",
              "Palette knife or brush - for mixing paint",
              "Reference color wheel image - to compare your results"
            ],
            commonMistakes: [
              "Adding too much paint at once - start with tiny amounts and add more gradually",
              "Not cleaning your brush between mixes - this creates muddy, unwanted colors"
            ],
            tips: [
              "Mix colors gradually - you can always add more, but you can't take it back",
              "Keep notes about successful color combinations for future reference",
              "Don't worry about perfection - focus on understanding how colors interact"
            ],
            freeResource: {
              title: "Color Theory Basics",
              url: "https://youtube.com/watch?v=color-theory"
            },
            affiliateLink: {
              title: "Canvas Board Pack",
              url: "https://michaels.com/product/canvas-boards?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 3,
            title: "Simple Shapes and Forms",
            mainTask: "Paint basic shapes - circles, squares, triangles using different colors. Practice creating 3D effects with light and shadow for 25 minutes.",
            explanation: "Everything you paint is made up of basic shapes. Learning to see and paint shapes accurately is crucial for realistic painting. Adding light and shadow brings your shapes to life.",
            howToGuide: "Start with flat shapes, then add a light source from one side. Use lighter colors where light hits and darker colors for shadows. Blend the edges where light meets shadow.",
            checklist: [
              "Your color mixes from Day 2 - to practice using them",
              "Reference objects - real spheres, boxes, or photos",
              "Different brush sizes - for details and broad areas",
              "Good lighting - to see your work clearly"
            ],
            commonMistakes: [
              "Making shadows too dark too quickly - build up darkness gradually",
              "Forgetting to choose a consistent light source - shadows should all point the same direction"
            ],
            tips: [
              "Start with light colors and gradually add darker tones for depth",
              "Squint at your reference to see light and dark areas more clearly",
              "Practice with simple objects before attempting complex subjects"
            ],
            freeResource: {
              title: "Shape Painting Exercise",
              url: "https://youtube.com/watch?v=shapes-painting"
            },
            affiliateLink: {
              title: "Round Brush Set",
              url: "https://amazon.com/dp/B56789?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 4,
            title: "Your First Landscape",
            mainTask: "Paint a simple sunset scene with horizon line, sky gradient, and silhouette. Focus on color blending and atmospheric perspective for 30 minutes.",
            explanation: "Landscapes teach you about depth, atmosphere, and mood. This project combines everything you've learned while introducing new concepts like gradients and silhouettes that you'll use in many future paintings.",
            howToGuide: "Start with the lightest color near the horizon and gradually darken toward the top. Work quickly while paint is wet for smooth blending. Add silhouettes last with dark colors.",
            checklist: [
              "Warm colors - reds, oranges, yellows for the sunset",
              "Cool colors - blues, purples for contrast",
              "Large flat brush - for sky gradients",
              "Reference photo or real sunset - for color inspiration"
            ],
            commonMistakes: [
              "Working too slowly - paint dries and becomes harder to blend smoothly",
              "Making the silhouette too detailed - simple shapes are more effective"
            ],
            tips: [
              "Work from light to dark - paint the sky first, then add darker elements",
              "Use horizontal brush strokes for calm skies, vertical for dramatic effects",
              "Don't overthink it - sunsets are forgiving subjects for beginners"
            ],
            freeResource: {
              title: "Easy Sunset Painting Tutorial",
              url: "https://youtube.com/watch?v=sunset-tutorial"
            },
            affiliateLink: {
              title: "Palette Knife Set",
              url: "https://michaels.com/product/palette-knives?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 5,
            title: "Adding Texture and Details",
            mainTask: "Practice different textures - smooth water, rough bark, fluffy clouds. Learn dry brush and stippling techniques for 25 minutes.",
            explanation: "Texture brings paintings to life and makes them interesting to look at. Different brush techniques can simulate almost any surface. These skills will make your paintings more realistic and engaging.",
            howToGuide: "Use different amounts of paint and water for various effects. Dry brush with minimal paint for rough textures. Stippling (dabbing) creates organic textures like foliage or clouds.",
            checklist: [
              "Various brush shapes - flat, round, fan brushes",
              "Paper towels - for controlling paint amount",
              "Reference textures - photos or real objects to study",
              "Patience - texture work requires careful observation"
            ],
            commonMistakes: [
              "Using too much paint for dry brush techniques - less is more",
              "Rushing texture work - take time to observe and replicate patterns"
            ],
            tips: [
              "Use different brush techniques - stippling for texture, smooth strokes for water",
              "Study real textures closely before trying to paint them",
              "Practice on scrap paper before applying to your main painting"
            ],
            freeResource: {
              title: "Texture Techniques Guide",
              url: "https://youtube.com/watch?v=texture-guide"
            },
            affiliateLink: {
              title: "Texture Brushes Set",
              url: "https://amazon.com/dp/B98765?tag=wizqo-20",
              store: 'Amazon' as const
            }
          },
          {
            day: 6,
            title: "Composition and Balance",
            mainTask: "Create a still life painting with 3 objects, focusing on arrangement and balance. Apply the rule of thirds and practice object relationships for 35 minutes.",
            explanation: "Good composition is what separates snapshots from art. Learning to arrange elements thoughtfully will make your paintings more visually appealing and impactful, regardless of your technical skill level.",
            howToGuide: "Divide your canvas into thirds both horizontally and vertically. Place focal points at intersection lines. Vary object sizes and create visual triangles for dynamic composition.",
            checklist: [
              "Three simple objects - fruits, bottles, or household items",
              "Good lighting setup - single light source preferred",
              "Viewfinder or phone camera - to help frame composition",
              "All your skills from previous days - you'll use everything"
            ],
            commonMistakes: [
              "Centering everything - off-center compositions are usually more interesting",
              "Making all objects the same size - vary sizes for visual interest"
            ],
            tips: [
              "Follow the rule of thirds - place focal points at intersection lines",
              "Create visual pathways that lead the eye around your painting",
              "Take photos of your setup from different angles to find the best composition"
            ],
            freeResource: {
              title: "Composition in Art",
              url: "https://youtube.com/watch?v=composition-art"
            },
            affiliateLink: {
              title: "Artist Easel",
              url: "https://michaels.com/product/tabletop-easel?assoc=wizqo",
              store: 'Michaels' as const
            }
          },
          {
            day: 7,
            title: "Your Masterpiece",
            mainTask: "Combine all techniques learned to create your personal masterpiece - any subject you love. Plan, sketch, and paint for 45 minutes, focusing on expressing your unique style.",
            explanation: "This is your graduation project! You'll demonstrate everything you've learned while creating something uniquely yours. This painting represents your journey from beginner to artist and shows your personal artistic voice.",
            howToGuide: "Start with a light pencil sketch, then apply paint in layers from light to dark. Use all the techniques you've learned: color mixing, shape building, texture, and composition. Don't rush - enjoy the process.",
            checklist: [
              "All your paints and brushes - your complete toolkit",
              "Your favorite subject - something that inspires you",
              "Confidence in your abilities - you've learned so much this week",
              "A plan - sketch first, then paint with intention"
            ],
            commonMistakes: [
              "Trying to make it perfect - focus on expressing yourself rather than perfection",
              "Second-guessing your choices - trust your instincts and the skills you've developed"
            ],
            tips: [
              "Don't aim for perfection, aim for expression - your unique style is what makes it special",
              "Use everything you've learned this week in one painting",
              "Sign your work proudly - you've earned the title of artist!"
            ],
            freeResource: {
              title: "Finishing Techniques",
              url: "https://youtube.com/watch?v=finishing-painting"
            },
            affiliateLink: {
              title: "Varnish and Sealers",
              url: "https://amazon.com/dp/B54321?tag=wizqo-20",
              store: 'Amazon' as const
            }
          }
        ]
      }
    };

    const basePlan = hobbyPlans[hobby.toLowerCase()] || {
      overview: `Master ${hobby} in 7 days with this personalized plan tailored to your ${answers.experience.toLowerCase()} level.`,
      days: [
        {
          day: 1,
          title: "Getting Started",
          mainTask: `Begin your ${hobby} journey by learning the fundamentals and setting up your workspace for optimal learning.`,
          explanation: "Starting with proper foundations ensures your success throughout the week and beyond.",
          howToGuide: "Research the basic tools and concepts, set up a dedicated practice space, and complete your first introductory exercise.",
          checklist: ["Basic materials for your hobby", "Dedicated practice space", "Learning resources bookmarked"],
          commonMistakes: ["Rushing through setup", "Skipping fundamental concepts"],
          tips: ["Take your time with the basics", "Set up a consistent practice routine", "Don't be afraid to make mistakes - they're part of learning"],
          freeResource: {
            title: `${hobby} Beginner Tutorial`,
            url: "https://youtube.com/search?q=" + encodeURIComponent(`${hobby} tutorial`)
          },
          affiliateLink: {
            title: `${hobby} Starter Kit`,
            url: "https://amazon.com/s?k=" + encodeURIComponent(`${hobby} beginner kit`) + "&tag=wizqo-20",
            store: 'Amazon' as const
          }
        }
      ]
    };
    
    return {
      hobby: hobby,
      overview: basePlan.overview || `Master ${hobby} in 7 days with this personalized plan tailored to your ${answers.experience.toLowerCase()} level.`,
      days: basePlan.days || []
    };
  };

  // Add video IDs to plans (in real app, this would come from the API)
  const addVideoIds = (days: DayPlan[]): DayPlan[] => {
    const videoIdMap: { [key: string]: string[] } = {
      "youtube api": ['api-setup-tutorial', 'api-responses-guide', 'html-iframe-tutorial', 'javascript-fetch-dom', 'api-advanced-search', 'error-handling-guide', 'free-deployment-guide'],
      painting: ['basic-brushes', 'color-theory', 'shapes-painting', 'sunset-tutorial', 'texture-guide', 'composition-art', 'finishing-painting'],
      gardening: ['gardening-basics', 'seed-planting', 'plant-care', 'germination', 'plant-problems', 'transplanting', 'garden-planning'],
      photography: ['phone-photography', 'composition-rules', 'photography-lighting', 'portrait-tips', 'landscape-guide', 'mobile-editing', 'portfolio-tips'],
      cooking: ['knife-skills', 'sauteing', 'seasoning-guide', 'cooking-protein', 'basic-sauces', 'meal-planning', 'recipe-development'],
      coding: ['programming-basics', 'variables-explained', 'functions-tutorial', 'programming-loops', 'arrays-tutorial', 'first-project', 'programming-career'],
      knitting: ['knitting-basics', 'purl-stitch', 'knitting-patterns', 'fixing-mistakes', 'knitting-shaping', 'binding-off', 'first-knitting-project'],
      chess: ['chess-basics', 'special-moves', 'opening-principles', 'chess-tactics', 'endgame-basics', 'analyze-games', 'chess-improvement'],
      origami: ['origami-crane', 'origami-flowers', 'modular-origami', 'origami-animals', 'origami-box', 'wet-folding', 'origami-display'],
      writing: ['writing-prompts', 'character-creation', 'writing-dialogue', 'writing-settings', 'story-structure', 'first-draft', 'self-editing']
    };

    const hobbyKey = planData?.hobby.toLowerCase() || '';
    const videoIds = videoIdMap[hobbyKey] || [];

    return days.map((day, index) => ({
      ...day,
      videoId: videoIds[index] || 'dQw4w9WgXcQ' // Fallback video ID
    }));
  };

  // Main plan generation function - uses AI first, fallback second
  const generatePlan = async (hobby: string, answers: QuizAnswers): Promise<PlanData> => {
    try {
      // Try AI generation first
      const aiPlan = await generatePlanWithAI(hobby, answers);
      // Add video IDs
      aiPlan.days = addVideoIds(aiPlan.days);
      return aiPlan;
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      // Fallback to static plan
      const fallbackPlan = getFallbackPlan(hobby, answers);
      fallbackPlan.days = addVideoIds(fallbackPlan.days);
      return fallbackPlan;
    }
  };

  const handlePlanGenerate = async (hobby: string, answers: QuizAnswers) => {
    const plan = await generatePlan(hobby, answers);
    setPlanData(plan);
    // Reset progress for new plan
    resetProgress();
    navigateTo('plan');
  };

  const handleBackToChat = () => {
    setPlanData(null);
    navigateTo('generate');
  };

  const handleStartPlan = () => {
    navigateTo('generate');
  };

  // Render based on current route
  return (
    <div className="min-h-screen">
      {currentRoute === 'landing' && (
        <LandingPage onStartPlan={handleStartPlan} />
      )}
      
      {currentRoute === 'generate' && (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto py-8 h-screen">
            <div className="text-center mb-8 space-y-6">
              {/* Colorful animated header */}
              <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-full mb-4 shadow-colorful animate-pulse-slow hover-lift">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-2xl animate-bounce">🎯</span>
                </div>
              </div>
              
              <h1 className="text-colorful-primary max-w-4xl mx-auto mb-4">
                Generate Your Personalized 7-Day Hobby Plan
              </h1>
              
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Discover a hobby you'll love in just 7 days! Wizqo uses AI to build personalized plans with tasks, tips, and tools tailored to your lifestyle.
              </p>
              
              {/* Colorful feature badges */}
              <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-success rounded-full text-white shadow-lg hover-lift">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-warning rounded-full text-white shadow-lg hover-lift">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-secondary rounded-full text-white shadow-lg hover-lift">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>Only 3 Questions</span>
                </div>
              </div>
            </div>
            
            <div className="h-[65vh] glass-effect rounded-3xl border border-white/20 overflow-hidden shadow-colorful hover-lift">
              <ChatInterface onPlanGenerate={handlePlanGenerate} />
            </div>
            
            {/* Bottom colorful accent */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gradient-primary rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-gradient-success rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-3 h-3 bg-gradient-warning rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-3 h-3 bg-gradient-secondary rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentRoute === 'plan' && planData && (
        <>
          <Navigation 
            onBack={handleBackToChat} 
            planTitle={`${planData.hobby} in 7 Days`}
          />
          <PlanDisplay 
            planData={planData} 
            onLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            userProgress={userProgress}
            onCompleteDay={completeDay}
            isDayUnlocked={isDayUnlocked}
            isDayCompleted={isDayCompleted}
            showLoginAfterDay1={showLoginAfterDay1}
            onDismissLoginPrompt={() => setShowLoginAfterDay1(false)}
          />
        </>
      )}
    </div>
  );
}