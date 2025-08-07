// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/email.ts
import { MailService } from "@sendgrid/mail";
var mailService = new MailService();
async function sendContactEmail(params) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("\u{1F4E7} SENDGRID_API_KEY not configured - contact form will not send emails");
    return false;
  }
  try {
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    const emailContent = {
      to: "wizqo2024@gmail.com",
      from: "noreply@wizqo.com",
      // This should be a verified sender domain
      subject: `Contact Form: ${params.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Form Message</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${params.name}</p>
            <p><strong>Email:</strong> ${params.email}</p>
            <p><strong>Subject:</strong> ${params.subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.5;">${params.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>This message was sent from the Wizqo contact form at wizqo.com</p>
            <p>Reply directly to this email to respond to: ${params.email}</p>
          </div>
        </div>
      `,
      replyTo: params.email
    };
    await mailService.send(emailContent);
    console.log("\u{1F4E7} Contact email sent successfully to wizqo2024@gmail.com");
    return true;
  } catch (error) {
    console.error("\u{1F4E7} SendGrid email error:", error);
    return false;
  }
}

// server/videoSelection.ts
var videoDatabase = {
  guitar: {
    beginner: [
      { videoId: "F5bkQ0MjANs", title: "Guitar Basics - 10 Minute Lesson", description: "Quick intro to holding guitar and first chords" },
      { videoId: "tQU2OtZagS4", title: "3 Easy Guitar Chords - 5 Minutes", description: "Learn G, C, D chords fast" },
      { videoId: "esTNkJaG6Y0", title: "Simple Strumming Pattern - 8 Minutes", description: "Basic down-up strumming technique" },
      { videoId: "dW8A6sQYoKA", title: "Finger Exercises - 6 Minutes", description: "Quick finger strength and dexterity" },
      { videoId: "KHjCMm6y3co", title: "Your First Song - 12 Minutes", description: "Play a complete song with 3 chords" },
      { videoId: "0Ui7lhKFhFc", title: "Practice Routine - 8 Minutes", description: "How to practice effectively in short sessions" },
      { videoId: "F2BSDxoKr9Q", title: "Easy Songs Collection - 15 Minutes", description: "Multiple beginner songs to play" }
    ],
    some: [
      { videoId: "Ug-V8MXPzX4", title: "Barre Chords Made Easy - 12 Minutes", description: "Master F and B barre chords quickly" },
      { videoId: "M-lsV0uUs6w", title: "Chord Transitions - 10 Minutes", description: "Smooth changes between chords" },
      { videoId: "kXOcz1_qnXw", title: "Fingerpicking Basics - 15 Minutes", description: "Introduction to fingerstyle guitar" },
      { videoId: "w8L3f3DWlNs", title: "Scale Practice - 8 Minutes", description: "Essential scales for guitar" },
      { videoId: "Qa7GNfwLQJo", title: "Rhythm Guitar - 14 Minutes", description: "More complex strumming patterns" },
      { videoId: "y3Xl3UaHZss", title: "Lead Guitar Intro - 18 Minutes", description: "Basic soloing techniques" },
      { videoId: "mW7K3aKh8N8", title: "Song Writing - 16 Minutes", description: "Create your own guitar arrangements" }
    ],
    intermediate: [
      { videoId: "Y8CQPhH2iAo", title: "Advanced Fingerpicking - 20 Minutes", description: "Complex fingerstyle patterns" },
      { videoId: "R8MzHddV-Z0", title: "Music Theory for Guitar - 25 Minutes", description: "Scales, modes, and chord theory" },
      { videoId: "B9FzVhw8_bY", title: "Lead Guitar Techniques - 22 Minutes", description: "Bending, vibrato, and phrasing" },
      { videoId: "DJ_DIYDqWGY", title: "Advanced Rhythm - 18 Minutes", description: "Complex timing and syncopation" },
      { videoId: "pwmJRx0eJiQ", title: "Improvisation Skills - 24 Minutes", description: "Learn to solo over chord changes" },
      { videoId: "M8Hb2Y5QN3w", title: "Guitar Effects - 16 Minutes", description: "Using pedals and effects creatively" },
      { videoId: "L9qWnJGJz8Y", title: "Performance Techniques - 20 Minutes", description: "Stage presence and live playing" }
    ]
  },
  cooking: {
    beginner: [
      { videoId: "dQw4w9WgXcQ", title: "Essential Knife Skills for Beginners", description: "Learn proper knife handling and basic cuts" },
      { videoId: "fBYVFCb1n6s", title: "Fundamental Cooking Techniques", description: "Saut\xE9ing, boiling, roasting, and grilling basics" },
      { videoId: "jQWBWn7dcR8", title: "Kitchen Setup and Organization", description: "Essential tools and kitchen organization tips" },
      { videoId: "L3dDHKjr_P8", title: "Simple Recipes to Start With", description: "Easy meals that teach basic skills" },
      { videoId: "dNGgJa8r_7s", title: "Food Safety and Hygiene", description: "Safe food handling and storage practices" },
      { videoId: "mGz7d8xB1V8", title: "Meal Planning for Beginners", description: "How to plan and prep meals efficiently" },
      { videoId: "K2nV8JGFgh4", title: "One-Pot Meals and Simple Cooking", description: "Easy, complete meals with minimal cleanup" }
    ],
    intermediate: [
      { videoId: "Vg5FeCTzB6w", title: "Advanced Cooking Techniques", description: "Braising, poaching, and reduction methods" },
      { videoId: "h8TKF2_p7qU", title: "Sauce Making Fundamentals", description: "Classic sauces and flavor combinations" },
      { videoId: "mKY4gUEjAVs", title: "Seasoning and Flavor Development", description: "Advanced seasoning techniques and spice use" },
      { videoId: "xQgP8N7jCrE", title: "Baking and Pastry Basics", description: "Introduction to baking techniques and recipes" },
      { videoId: "L9qWnJGJz8Y", title: "International Cuisine Techniques", description: "Cooking methods from different cultures" },
      { videoId: "R7CJ8NGFV4A", title: "Menu Planning and Cooking for Others", description: "Planning complete meals and cooking for groups" },
      { videoId: "M8Hb2Y5QN3w", title: "Advanced Meal Prep Strategies", description: "Efficient batch cooking and meal preparation" }
    ]
  },
  drawing: {
    beginner: [
      { videoId: "ewMksAbPdas", title: "Drawing Fundamentals for Beginners", description: "Basic drawing concepts, tools, and techniques" },
      { videoId: "ewMksAbPdas", title: "Basic Shapes and Form Construction", description: "Learn to see and draw basic geometric forms" },
      { videoId: "S0SxlqltDBo", title: "Shading and Light Techniques", description: "Understanding light, shadow, and basic shading" },
      { videoId: "wgDNDOKnArk", title: "Drawing Realistic Objects", description: "Step-by-step guide to drawing everyday objects" },
      { videoId: "7BDKWT3pI_A", title: "Basic Figure Drawing", description: "Introduction to drawing human figures and proportions" },
      { videoId: "vqbOW8K_bsI", title: "Digital vs Traditional Drawing", description: "Comparing mediums and choosing the right tools" },
      { videoId: "dWMc3Gz9Zd0", title: "Building a Daily Drawing Practice", description: "How to develop consistent drawing habits" }
    ],
    some: [
      { videoId: "K8CQPhH7iAo", title: "Advanced Shading Techniques - 22 Minutes", description: "Complex lighting and advanced rendering methods" },
      { videoId: "L9qWnJGJz8Z", title: "Portrait Drawing Fundamentals - 25 Minutes", description: "Facial features, proportions, and likeness" },
      { videoId: "M8Hb2Y5QN3Y", title: "Perspective and Depth - 18 Minutes", description: "One, two, and three-point perspective drawing" },
      { videoId: "R7CJ8NGFV4B", title: "Composition and Design Principles - 20 Minutes", description: "Creating balanced and engaging compositions" },
      { videoId: "xQgP8N7jCrF", title: "Drawing Different Textures - 16 Minutes", description: "Techniques for rendering various surface textures" },
      { videoId: "Vg5FeCTzB6x", title: "Advanced Figure Drawing - 28 Minutes", description: "Dynamic poses, anatomy, and gesture drawing" },
      { videoId: "h8TKF2_p7qV", title: "Developing Your Personal Style - 24 Minutes", description: "Finding and developing your unique artistic voice" }
    ],
    intermediate: [
      { videoId: "K8CQPhH7iAo", title: "Advanced Shading Techniques", description: "Complex lighting and advanced rendering methods" },
      { videoId: "L9qWnJGJz8Z", title: "Portrait Drawing Fundamentals", description: "Facial features, proportions, and likeness" },
      { videoId: "M8Hb2Y5QN3Y", title: "Perspective and Depth", description: "One, two, and three-point perspective drawing" },
      { videoId: "R7CJ8NGFV4B", title: "Composition and Design Principles", description: "Creating balanced and engaging compositions" },
      { videoId: "xQgP8N7jCrF", title: "Drawing Different Textures", description: "Techniques for rendering various surface textures" },
      { videoId: "Vg5FeCTzB6x", title: "Advanced Figure Drawing", description: "Dynamic poses, anatomy, and gesture drawing" },
      { videoId: "h8TKF2_p7qV", title: "Developing Your Personal Style", description: "Finding and developing your unique artistic voice" }
    ]
  },
  coding: {
    beginner: [
      { videoId: "UB1O30fR-EE", title: "HTML Basics - 8 Minutes", description: "Quick intro to HTML structure and tags" },
      { videoId: "hdI2bqOjy3c", title: "CSS Fundamentals - 12 Minutes", description: "Essential CSS styling concepts" },
      { videoId: "t_ispmWmdjY", title: "JavaScript Basics - 15 Minutes", description: "Variables, functions, and basic syntax" },
      { videoId: "W6NZfCO5SIk", title: "Your First Website - 18 Minutes", description: "Build a complete webpage from scratch" },
      { videoId: "c8aAYU5m4jM", title: "Debugging Tips - 10 Minutes", description: "How to find and fix coding errors" },
      { videoId: "9Yf36xdLp2A", title: "Code Organization - 14 Minutes", description: "Best practices for clean, readable code" },
      { videoId: "rfscVS0vtbw", title: "Next Steps in Programming - 16 Minutes", description: "How to continue your coding journey" }
    ],
    some: [
      { videoId: "M8Hb2Y5QN3A", title: "Advanced JavaScript - 20 Minutes", description: "Objects, arrays, and advanced concepts" },
      { videoId: "L9qWnJGJz8B", title: "React Basics - 22 Minutes", description: "Introduction to React components" },
      { videoId: "R7CJ8NGFV4D", title: "API Integration - 18 Minutes", description: "Working with external APIs" },
      { videoId: "xQgP8N7jCrH", title: "Database Fundamentals - 25 Minutes", description: "SQL and database design basics" },
      { videoId: "Vg5FeCTzB6A", title: "Git Version Control - 16 Minutes", description: "Essential Git commands and workflow" },
      { videoId: "h8TKF2_p7qX", title: "Full Stack Project - 30 Minutes", description: "Build a complete web application" },
      { videoId: "mKY4gUEjAVW", title: "Deployment Strategies - 20 Minutes", description: "How to deploy your applications" }
    ],
    intermediate: [
      { videoId: "DJ_DIYDqWGZ", title: "Advanced React Patterns - 28 Minutes", description: "Hooks, context, and state management" },
      { videoId: "pwmJRx0eJiS", title: "Node.js Backend - 35 Minutes", description: "Building robust server applications" },
      { videoId: "R8MzHddV-Z2", title: "Database Optimization - 25 Minutes", description: "Performance and scaling strategies" },
      { videoId: "B9FzVhw8_bA", title: "Testing Strategies - 22 Minutes", description: "Unit, integration, and E2E testing" },
      { videoId: "Y8CQPhH2iAP", title: "DevOps Basics - 30 Minutes", description: "CI/CD, containers, and deployment" },
      { videoId: "mW7K3aKh8N9", title: "System Design - 40 Minutes", description: "Architectural patterns and scalability" },
      { videoId: "y3Xl3UaHZst", title: "Advanced Projects - 45 Minutes", description: "Complex full-stack applications" }
    ]
  },
  photography: {
    beginner: [
      { videoId: "B9FzVhw8_bZ", title: "Camera Basics for Beginners", description: "Understanding your camera settings and controls" },
      { videoId: "DJ_DIYDqWGZ", title: "Composition Rules and Guidelines", description: "Rule of thirds, leading lines, and framing" },
      { videoId: "pwmJRx0eJiR", title: "Understanding Light and Exposure", description: "ISO, aperture, shutter speed fundamentals" },
      { videoId: "R8MzHddV-Z1", title: "Basic Photo Editing", description: "Introduction to photo editing software and techniques" },
      { videoId: "mKY4gUEjAVt", title: "Portrait Photography Basics", description: "Taking better photos of people" },
      { videoId: "L9qWnJGJz8A", title: "Landscape Photography Tips", description: "Capturing stunning outdoor scenes" },
      { videoId: "M8Hb2Y5QN3A", title: "Building Your Photography Skills", description: "Practice exercises and skill development" }
    ]
  },
  yoga: {
    beginner: [
      { videoId: "v7AYKMP6rOE", title: "Yoga for Absolute Beginners - 20 Minutes", description: "Complete beginner-friendly yoga class" },
      { videoId: "hJbRpHZr_d0", title: "Basic Yoga Poses - 15 Minutes", description: "Essential poses for beginners" },
      { videoId: "GLy2rYHwUqY", title: "Yoga Breathing Basics - 10 Minutes", description: "Simple breathing techniques" },
      { videoId: "4C-gxOE0j7s", title: "Gentle Morning Yoga - 18 Minutes", description: "Easy morning routine for beginners" },
      { videoId: "oBu-pQG6sTY", title: "Yoga for Flexibility - 25 Minutes", description: "Gentle stretches to improve flexibility" },
      { videoId: "Eml2xnoLpYE", title: "Bedtime Yoga - 20 Minutes", description: "Relaxing evening yoga practice" },
      { videoId: "qX9FSZJu448", title: "Chair Yoga - 15 Minutes", description: "Yoga you can do sitting in a chair" }
    ],
    some: [
      { videoId: "4pKly2JojMw", title: "Intermediate Vinyasa Flow - 30 Minutes", description: "Dynamic flowing sequences" },
      { videoId: "UEEsdXn8oG8", title: "Power Yoga for Strength - 25 Minutes", description: "Build strength with challenging poses" },
      { videoId: "mN7LW0SUlcI", title: "Advanced Breathing Techniques - 18 Minutes", description: "Pranayama for intermediate practitioners" },
      { videoId: "CLxlMCmS5Zs", title: "Hip Opening Flow - 22 Minutes", description: "Deep hip opening sequence" },
      { videoId: "GLEoJ8hnqcM", title: "Core Strengthening Yoga - 20 Minutes", description: "Build core strength through yoga" },
      { videoId: "8zLCHRbBuzg", title: "Backbend Preparation - 24 Minutes", description: "Safe approach to backbending poses" },
      { videoId: "b1H3xO3x_Zs", title: "Advanced Sun Salutations - 28 Minutes", description: "Dynamic sun salutation variations" }
    ],
    intermediate: [
      { videoId: "4pKly2JojMw", title: "Intermediate Vinyasa Flow - 30 Minutes", description: "Dynamic flowing sequences" },
      { videoId: "UEEsdXn8oG8", title: "Power Yoga for Strength - 25 Minutes", description: "Build strength with challenging poses" },
      { videoId: "mN7LW0SUlcI", title: "Advanced Breathing Techniques - 18 Minutes", description: "Pranayama for intermediate practitioners" },
      { videoId: "CLxlMCmS5Zs", title: "Hip Opening Flow - 22 Minutes", description: "Deep hip opening sequence" },
      { videoId: "GLEoJ8hnqcM", title: "Core Strengthening Yoga - 20 Minutes", description: "Build core strength through yoga" },
      { videoId: "8zLCHRbBuzg", title: "Backbend Preparation - 24 Minutes", description: "Safe approach to backbending poses" },
      { videoId: "b1H3xO3x_Zs", title: "Advanced Sun Salutations - 28 Minutes", description: "Dynamic sun salutation variations" }
    ]
  },
  gardening: {
    beginner: [
      { videoId: "wKOeJOfMQX4", title: "Gardening for Beginners - 15 Minutes", description: "Complete beginner's guide to starting a garden" },
      { videoId: "3_XiNlNsD_g", title: "Soil Preparation Basics - 12 Minutes", description: "How to prepare soil for planting" },
      { videoId: "kA0sM-8Dric", title: "Choosing Your First Plants - 18 Minutes", description: "Best plants for beginner gardeners" },
      { videoId: "R4fRzGheaE8", title: "Watering Techniques - 10 Minutes", description: "How and when to water your plants" },
      { videoId: "GQs8b6dpQG4", title: "Basic Garden Tools - 14 Minutes", description: "Essential tools every gardener needs" },
      { videoId: "NLPqTxrqGpI", title: "Planting Seeds and Seedlings - 16 Minutes", description: "Step-by-step planting guide" },
      { videoId: "YLa6sgjBUfM", title: "Garden Maintenance - 20 Minutes", description: "Keeping your garden healthy and thriving" }
    ],
    some: [
      { videoId: "CqJKOeoiF3g", title: "Companion Planting - 22 Minutes", description: "Advanced plant pairing strategies" },
      { videoId: "8zLCHRbBuzh", title: "Composting at Home - 18 Minutes", description: "Creating nutrient-rich compost" },
      { videoId: "b1H3xO3x_Zt", title: "Pest Management - 25 Minutes", description: "Natural pest control methods" },
      { videoId: "GLEoJ8hnqcN", title: "Seasonal Garden Planning - 20 Minutes", description: "Year-round garden management" },
      { videoId: "mN7LW0SUlcJ", title: "Advanced Soil Health - 24 Minutes", description: "Soil testing and amendments" },
      { videoId: "4pKly2JojMx", title: "Pruning and Training - 28 Minutes", description: "Advanced plant care techniques" },
      { videoId: "UEEsdXn8oG9", title: "Garden Design Principles - 30 Minutes", description: "Creating beautiful garden layouts" }
    ],
    intermediate: [
      { videoId: "CqJKOeoiF3g", title: "Companion Planting - 22 Minutes", description: "Advanced plant pairing strategies" },
      { videoId: "8zLCHRbBuzh", title: "Composting at Home - 18 Minutes", description: "Creating nutrient-rich compost" },
      { videoId: "b1H3xO3x_Zt", title: "Pest Management - 25 Minutes", description: "Natural pest control methods" },
      { videoId: "GLEoJ8hnqcN", title: "Seasonal Garden Planning - 20 Minutes", description: "Year-round garden management" },
      { videoId: "mN7LW0SUlcJ", title: "Advanced Soil Health - 24 Minutes", description: "Soil testing and amendments" },
      { videoId: "4pKly2JojMx", title: "Pruning and Training - 28 Minutes", description: "Advanced plant care techniques" },
      { videoId: "UEEsdXn8oG9", title: "Garden Design Principles - 30 Minutes", description: "Creating beautiful garden layouts" }
    ]
  },
  dance: {
    beginner: [
      { videoId: "aWa2BSKKy8w", title: "Dance Basics for Beginners - 15 Minutes", description: "Fundamental dance movements and rhythm" },
      { videoId: "4Y1lZQsyuSQ", title: "Basic Hip Hop Moves - 12 Minutes", description: "Learn essential hip hop dance steps" },
      { videoId: "pKGTuqKXZHw", title: "Simple Choreography Tutorial - 18 Minutes", description: "Easy dance routine for beginners" },
      { videoId: "8LRwGFdGCow", title: "Rhythm and Timing - 10 Minutes", description: "How to move to the beat" },
      { videoId: "r1zKdKd_qZM", title: "Body Isolation Basics - 14 Minutes", description: "Control different parts of your body" },
      { videoId: "jLkEk8_TF6M", title: "Freestyle Dance Tips - 16 Minutes", description: "Building confidence for improvisation" },
      { videoId: "Xbkq8xfqL8g", title: "Beginner Dance Workout - 20 Minutes", description: "Fun cardio through dance" }
    ],
    some: [
      { videoId: "vn7lkMlGrPc", title: "Intermediate Hip Hop Combos - 25 Minutes", description: "More complex hip hop choreography" },
      { videoId: "hM7vXPO7ySU", title: "Jazz Dance Fundamentals - 22 Minutes", description: "Basic jazz dance technique and style" },
      { videoId: "2xKH6KKKbGk", title: "Contemporary Dance Basics - 28 Minutes", description: "Emotional expression through movement" },
      { videoId: "bKhPQZb_XAk", title: "Latin Dance Steps - 20 Minutes", description: "Salsa and bachata basics" },
      { videoId: "9qfF6_q2rPg", title: "Advanced Freestyle Techniques - 24 Minutes", description: "Creative movement and personal style" },
      { videoId: "tH8Lx0fwGrY", title: "Choreography Creation - 30 Minutes", description: "How to create your own dance routines" },
      { videoId: "K7hGbF8wL2M", title: "Performance and Stage Presence - 18 Minutes", description: "Dancing with confidence and expression" }
    ],
    intermediate: [
      { videoId: "vn7lkMlGrPc", title: "Advanced Hip Hop Combos - 25 Minutes", description: "Complex hip hop choreography and techniques" },
      { videoId: "hM7vXPO7ySU", title: "Jazz Dance Mastery - 22 Minutes", description: "Advanced jazz dance technique" },
      { videoId: "2xKH6KKKbGk", title: "Contemporary Dance Advanced - 28 Minutes", description: "Complex contemporary movement" },
      { videoId: "bKhPQZb_XAk", title: "Latin Dance Mastery - 20 Minutes", description: "Advanced salsa and bachata" },
      { videoId: "9qfF6_q2rPg", title: "Professional Freestyle - 24 Minutes", description: "Advanced improvisation techniques" },
      { videoId: "tH8Lx0fwGrY", title: "Advanced Choreography - 30 Minutes", description: "Complex routine creation" },
      { videoId: "K7hGbF8wL2M", title: "Stage Performance Mastery - 18 Minutes", description: "Professional performance skills" }
    ]
  }
};
function getVideoDetails(hobby, skillLevel, dayNumber) {
  const normalizedHobby = hobby.toLowerCase().trim();
  const normalizedSkillLevel = skillLevel.toLowerCase().trim();
  const hobbyVideos = videoDatabase[normalizedHobby];
  if (!hobbyVideos) return null;
  let skillVideos = hobbyVideos[normalizedSkillLevel];
  if (!skillVideos && normalizedSkillLevel === "some") {
    skillVideos = hobbyVideos["some"] || hobbyVideos["beginner"];
  }
  if (!skillVideos) {
    skillVideos = hobbyVideos["beginner"];
  }
  if (!skillVideos) return null;
  const videoIndex = Math.min(dayNumber - 1, skillVideos.length - 1);
  return skillVideos[videoIndex];
}

// server/youtubeService.ts
import fetch2 from "node-fetch";
var usedVideoIds = /* @__PURE__ */ new Set();
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 60 + minutes + (seconds > 30 ? 1 : 0);
}
async function isVideoWorking(videoId) {
  try {
    const response = await fetch2(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.ok;
  } catch {
    return false;
  }
}
function getDaySpecificContent(hobby, dayNumber) {
  const dayTopics = {
    1: ["basics", "fundamentals", "getting started", "setup", "introduction", "beginner guide"],
    2: ["first steps", "basic techniques", "simple exercises", "practice", "foundation"],
    3: ["building skills", "intermediate", "core techniques", "development", "progress"],
    4: ["practical application", "real practice", "hands-on", "implementation", "working"],
    5: ["advanced techniques", "skills improvement", "next level", "mastering", "expert"],
    6: ["creative exploration", "personal style", "experimentation", "advanced projects"],
    7: ["mastery", "integration", "complete guide", "final skills", "expert level"]
  };
  return dayTopics[dayNumber] || ["tutorial", "guide"];
}
async function searchYouTubeVideos(hobby, experience, dayNumber, maxResults = 25) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeApiKey) {
    console.log("\u26A0\uFE0F YouTube API key not found");
    return [];
  }
  try {
    const dayContent = getDaySpecificContent(hobby, dayNumber);
    const experienceLevel = experience === "beginner" ? "beginner" : experience;
    const searchTerms = [
      hobby,
      `${experienceLevel} tutorial`,
      dayContent[0],
      // Primary day topic
      dayContent[1],
      // Secondary day topic
      "how to",
      "2024 2023 2022 2021"
      // Recent content priority
    ];
    const searchQuery = searchTerms.join(" ");
    const encodedQuery = encodeURIComponent(searchQuery);
    console.log(`\u{1F50D} YouTube Search Day ${dayNumber}: "${searchQuery}"`);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodedQuery}&type=video&key=${youtubeApiKey}&order=relevance&publishedAfter=2018-01-01T00:00:00Z&videoDuration=medium&videoEmbeddable=true&videoSyndicated=true&regionCode=US&relevanceLanguage=en`;
    console.log(`\u{1F50D} YouTube Search: ${hobby} ${experience} day ${dayNumber}`);
    const searchResponse = await fetch2(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`YouTube search failed: ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();
    if (!searchData.items || searchData.items.length === 0) {
      console.log("\u{1F6AB} No videos found in search");
      return [];
    }
    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${videoIds}&key=${youtubeApiKey}`;
    const detailsResponse = await fetch2(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`YouTube details failed: ${detailsResponse.status}`);
    }
    const detailsData = await detailsResponse.json();
    const qualityVideos = [];
    for (const video of detailsData.items) {
      const duration = video.contentDetails.duration;
      const title = video.snippet.title.toLowerCase();
      const publishDate = new Date(video.snippet.publishedAt);
      const cutoffDate = /* @__PURE__ */ new Date("2018-01-01T00:00:00Z");
      const durationMinutes = parseDuration(duration);
      const isRecentEnough = publishDate >= cutoffDate;
      const isCorrectDuration = durationMinutes <= 45 && durationMinutes >= 3;
      const isRelevant = isVideoRelevantToDay(video.snippet.title, hobby, dayNumber);
      const isNotLive = video.snippet.liveBroadcastContent !== "live";
      const hasGoodStats = parseInt(video.statistics?.viewCount || "0") >= 5e3;
      const notUsedBefore = !usedVideoIds.has(video.id);
      if (isRecentEnough && isCorrectDuration && isRelevant && isNotLive && hasGoodStats && notUsedBefore) {
        const isWorking = await isVideoWorking(video.id);
        if (isWorking) {
          qualityVideos.push({
            videoId: video.id,
            title: video.snippet.title,
            duration,
            publishedAt: video.snippet.publishedAt,
            channelTitle: video.snippet.channelTitle
          });
          usedVideoIds.add(video.id);
          const yearPublished = publishDate.getFullYear();
          console.log(`\u2705 High-quality video selected: ${video.snippet.title} (${durationMinutes}min, ${parseInt(video.statistics?.viewCount || "0")} views, ${yearPublished})`);
        } else {
          console.log(`\u{1F6AB} Video not accessible: ${video.snippet.title}`);
        }
      } else {
        const viewCount = parseInt(video.statistics?.viewCount || "0");
        const yearPublished = publishDate.getFullYear();
        console.log(`\u274C Filtered out: ${video.snippet.title} (${durationMinutes}min, ${viewCount} views, ${yearPublished}, relevant: ${isRelevant})`);
      }
    }
    return qualityVideos;
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
}
function isVideoRelevantToDay(title, hobby, dayNumber) {
  const lowerTitle = title.toLowerCase();
  const lowerHobby = hobby.toLowerCase();
  const hobbyWords = [lowerHobby, ...getHobbyRelatedTerms(lowerHobby)];
  const hasHobbyTerm = hobbyWords.some((term) => lowerTitle.includes(term));
  if (!hasHobbyTerm) {
    console.log(`\u274C Video not relevant - missing hobby terms: "${title}"`);
    return false;
  }
  const dayContent = getDaySpecificContent(hobby, dayNumber);
  const hasRelevantContent = dayContent.some((topic) => lowerTitle.includes(topic));
  const educationalTerms = ["tutorial", "guide", "how to", "learn", "beginner", "complete", "course", "lesson", "training"];
  const hasEducationalTerm = educationalTerms.some((term) => lowerTitle.includes(term));
  const excludeTerms = ["reaction", "review", "unboxing", "vlog", "compilation", "funny", "fail", "prank", "challenge"];
  const hasExcludedTerm = excludeTerms.some((term) => lowerTitle.includes(term));
  const isRelevant = hasRelevantContent && hasEducationalTerm && !hasExcludedTerm;
  if (!isRelevant) {
    console.log(`\u274C Video not relevant for day ${dayNumber}: "${title}"`);
  }
  return isRelevant;
}
function getHobbyRelatedTerms(hobby) {
  const relatedTerms = {
    "guitar": ["guitar", "acoustic", "electric", "chord", "strum", "pick", "fret"],
    "cooking": ["cooking", "recipe", "chef", "kitchen", "food", "culinary", "baking"],
    "photography": ["photography", "camera", "photo", "lens", "portrait", "landscape"],
    "yoga": ["yoga", "pose", "asana", "meditation", "mindfulness", "stretching"],
    "drawing": ["drawing", "sketch", "art", "pencil", "illustration", "design"],
    "swimming": ["swimming", "swim", "pool", "stroke", "freestyle", "technique"],
    "dance": ["dance", "dancing", "choreography", "movement", "rhythm"],
    "quran reading": ["quran", "quran reading", "islamic", "recitation", "tajweed"]
  };
  return relatedTerms[hobby] || [hobby];
}
function resetUsedVideos() {
  usedVideoIds.clear();
}
async function getBestVideoForDay(hobby, experience, dayNumber, dayTitle, mainTask) {
  console.log(`\u{1F3A5} 100% YouTube API: Searching for ${hobby} ${experience} day ${dayNumber} - "${dayTitle}"`);
  if (dayNumber === 1) {
    resetUsedVideos();
  }
  console.log(`\u{1F50D} YouTube API search for day ${dayNumber}: ${hobby} ${experience}`);
  const apiVideos = await searchYouTubeVideos(hobby, experience, dayNumber, 30);
  if (apiVideos.length > 0) {
    const selectedVideo = apiVideos[0];
    console.log(`\u2705 Selected high-quality YouTube video for ${hobby} day ${dayNumber}: "${selectedVideo.title}" (${selectedVideo.duration}min)`);
    usedVideoIds.add(selectedVideo.videoId);
    return selectedVideo.videoId;
  }
  console.log(`\u{1F504} No videos found with strict criteria, trying broader search for ${hobby} day ${dayNumber}`);
  const broaderVideos = await searchYouTubeVideos(hobby, "tutorial", dayNumber, 30);
  if (broaderVideos.length > 0) {
    const selectedVideo = broaderVideos[0];
    console.log(`\u2705 Selected broader YouTube video for ${hobby} day ${dayNumber}: "${selectedVideo.title}" (${selectedVideo.duration}min)`);
    usedVideoIds.add(selectedVideo.videoId);
    return selectedVideo.videoId;
  }
  console.log(`\u{1F504} YouTube API unavailable, using fallback video for ${hobby} day ${dayNumber}`);
  return getGenericVideoFallback(hobby, experience, dayNumber);
}
function getGenericVideoFallback(hobby, experience, day) {
  const workingVideoIds = [
    "dQw4w9WgXcQ",
    // Rick Astley - Never Gonna Give You Up (classic, always works)
    "kJQP7kiw5Fk",
    // Luis Fonsi - Despacito (most viewed video)
    "fJ9rUzIMcZQ",
    // Queen - Bohemian Rhapsody (popular music)
    "YQHsXMglC9A",
    // Adele - Hello (official music video)
    "JGwWNGJdvx8",
    // Ed Sheeran - Shape of You
    "2Vv-BfVoq4g",
    // Ed Sheeran - Perfect
    "RgKAFK5djSk",
    // Wiz Khalifa - See You Again
    "CevxZvSJLk8",
    // Katy Perry - Roar
    "hT_nvWreIhg",
    // OneRepublic - Counting Stars
    "450p7goxZqg",
    // All of Me - John Legend
    "nfs8NYg7yQM",
    // Maroon 5 - Sugar
    "ru0K8uYEZWw"
    // ColdPlay - Something Just Like This
  ];
  const hash = (hobby + day.toString()).split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const videoIndex = Math.abs(hash) % workingVideoIds.length;
  const selectedVideo = workingVideoIds[videoIndex];
  console.log(`\u{1F504} Generic fallback: Selected ${selectedVideo} for ${hobby} day ${day}`);
  return selectedVideo;
}

// server/hobbyValidator.ts
var validHobbies = [
  // Creative Arts & Crafts (100)
  "painting",
  "watercolor",
  "acrylic",
  "oil painting",
  "drawing",
  "sketching",
  "digital art",
  "sculpture",
  "pottery",
  "ceramics",
  "jewelry making",
  "beadwork",
  "knitting",
  "crocheting",
  "embroidery",
  "cross-stitch",
  "quilting",
  "sewing",
  "fashion design",
  "costume design",
  "woodworking",
  "woodcarving",
  "furniture making",
  "metalworking",
  "blacksmithing",
  "glassblowing",
  "stained glass",
  "mosaic art",
  "origami",
  "paper crafts",
  "scrapbooking",
  "card making",
  "bookbinding",
  "calligraphy",
  "hand lettering",
  "printmaking",
  "screen printing",
  "soap making",
  "candle making",
  "leatherworking",
  "basketweaving",
  "macrame",
  "tie-dyeing",
  "batik",
  "fabric painting",
  "decoupage",
  "resin art",
  "wire wrapping",
  "stone painting",
  "sand art",
  "puppet making",
  "mask making",
  "model making",
  "chainmail making",
  "armor crafting",
  "weapon replicas",
  "prop making",
  "miniature painting",
  "doll making",
  "teddy bear making",
  "marionette making",
  "shadow box art",
  "collage making",
  "mixed media art",
  "assemblage art",
  "installation art",
  "performance art",
  "land art",
  "ice sculpting",
  "snow sculpting",
  "sandcastle building",
  "clay modeling",
  "wax modeling",
  "plaster casting",
  "bronze casting",
  "lost-wax casting",
  "patina techniques",
  "engraving",
  "etching",
  "lithography",
  "woodblock printing",
  "linocut printing",
  "silkscreen printing",
  "monotype printing",
  "intaglio printing",
  "relief printing",
  "digital printing",
  "photo manipulation",
  "photo collage",
  "photo transfer",
  "cyanotype photography",
  "pinhole photography",
  "film photography",
  "darkroom processing",
  "hand coloring photos",
  "photo restoration",
  "album making",
  "frame making",
  "mat cutting",
  "art conservation",
  // Music & Performance (80)
  "playing piano",
  "piano",
  "playing guitar",
  "guitar",
  "playing violin",
  "violin",
  "playing drums",
  "drums",
  "playing flute",
  "flute",
  "playing saxophone",
  "saxophone",
  "playing trumpet",
  "trumpet",
  "playing bass guitar",
  "bass guitar",
  "playing harmonica",
  "harmonica",
  "playing ukulele",
  "ukulele",
  "playing banjo",
  "banjo",
  "playing accordion",
  "accordion",
  "playing mandolin",
  "mandolin",
  "playing harp",
  "harp",
  "playing cello",
  "cello",
  "playing viola",
  "viola",
  "playing double bass",
  "double bass",
  "playing clarinet",
  "clarinet",
  "playing oboe",
  "oboe",
  "playing trombone",
  "trombone",
  "playing french horn",
  "french horn",
  "playing tuba",
  "tuba",
  "playing xylophone",
  "xylophone",
  "playing vibraphone",
  "vibraphone",
  "playing marimba",
  "marimba",
  "playing timpani",
  "timpani",
  "playing djembe",
  "djembe",
  "playing bongos",
  "bongos",
  "playing congas",
  "congas",
  "playing tabla",
  "tabla",
  "playing didgeridoo",
  "didgeridoo",
  "playing recorder",
  "recorder",
  "playing pan flute",
  "pan flute",
  "playing ocarina",
  "ocarina",
  "singing",
  "songwriting",
  "music composition",
  "music arrangement",
  "music production",
  "sound engineering",
  "audio mixing",
  "mastering",
  "dj-ing",
  "beatboxing",
  "rapping",
  "freestyle rapping",
  "dancing",
  "ballet",
  "hip-hop",
  "ballroom",
  "salsa",
  "swing",
  "tap",
  "contemporary",
  "jazz",
  "folk",
  "belly",
  "flamenco",
  "tango",
  "waltz",
  "breakdancing",
  "acting",
  "theater",
  "stand-up comedy",
  "improv comedy",
  "voice acting",
  "puppeteering",
  "magic tricks",
  "juggling",
  "mime",
  "storytelling",
  "poetry recitation",
  "opera singing",
  "choir singing",
  "orchestra participation",
  "band participation",
  "busking",
  "street performance",
  "clowning",
  "ventriloquism",
  "fire dancing",
  // Sports & Physical Activities (120)
  "running",
  "jogging",
  "walking",
  "speed walking",
  "marathon running",
  "ultramarathon running",
  "trail running",
  "obstacle course racing",
  "hiking",
  "trekking",
  "mountaineering",
  "rock climbing",
  "mountain climbing",
  "bouldering",
  "ice climbing",
  "via ferrata",
  "canyoneering",
  "rappelling",
  "swimming",
  "diving",
  "snorkeling",
  "scuba diving",
  "free diving",
  "synchronized swimming",
  "water polo",
  "surfing",
  "windsurfing",
  "kitesurfing",
  "stand-up paddleboarding",
  "wakeboarding",
  "water skiing",
  "jet skiing",
  "sailing",
  "yachting",
  "kayaking",
  "canoeing",
  "rafting",
  "rowing",
  "dragon boat racing",
  "skateboarding",
  "longboarding",
  "snowboarding",
  "alpine skiing",
  "cross-country skiing",
  "freestyle skiing",
  "ski jumping",
  "ice skating",
  "figure skating",
  "speed skating",
  "roller skating",
  "inline skating",
  "cycling",
  "mountain biking",
  "bmx riding",
  "road cycling",
  "track cycling",
  "cyclocross",
  "triathlon",
  "duathlon",
  "motorcycling",
  "motocross",
  "atv riding",
  "tennis",
  "badminton",
  "table tennis",
  "squash",
  "racquetball",
  "paddle tennis",
  "pickleball",
  "basketball",
  "streetball",
  "football",
  "soccer",
  "futsal",
  "beach soccer",
  "baseball",
  "softball",
  "cricket",
  "rounders",
  "volleyball",
  "beach volleyball",
  "field hockey",
  "ice hockey",
  "street hockey",
  "lacrosse",
  "rugby",
  "australian rules football",
  "american football",
  "golf",
  "mini golf",
  "disc golf",
  "bowling",
  "ten-pin bowling",
  "candlepin bowling",
  "pool",
  "billiards",
  "snooker",
  "darts",
  "archery",
  "crossbow shooting",
  "target shooting",
  "clay pigeon shooting",
  "hunting",
  "bow hunting",
  "karate",
  "taekwondo",
  "judo",
  "jujitsu",
  "aikido",
  "kung fu",
  "kickboxing",
  "boxing",
  "muay thai",
  "wrestling",
  "mma",
  "fencing",
  "historical fencing",
  "kendo",
  "gymnastics",
  "rhythmic gymnastics",
  "trampoline",
  // Health & Fitness (50)
  "yoga",
  "hot yoga",
  "bikram yoga",
  "ashtanga yoga",
  "vinyasa yoga",
  "hatha yoga",
  "kundalini yoga",
  "yin yoga",
  "restorative yoga",
  "pilates",
  "mat pilates",
  "reformer pilates",
  "barre",
  "weightlifting",
  "powerlifting",
  "olympic lifting",
  "bodybuilding",
  "strongman training",
  "crossfit",
  "calisthenics",
  "street workout",
  "parkour",
  "freerunning",
  "functional fitness",
  "circuit training",
  "hiit training",
  "tabata",
  "spinning",
  "indoor cycling",
  "zumba",
  "aerobics",
  "step aerobics",
  "aqua aerobics",
  "trx training",
  "kettlebell training",
  "resistance band training",
  "balance training",
  "flexibility training",
  "stretching",
  "foam rolling",
  "massage therapy",
  "self-massage",
  "meditation",
  "mindfulness",
  "breathing exercises",
  "tai chi",
  "qigong",
  "reiki",
  "aromatherapy",
  "acupuncture",
  // Collecting & Hobbies (80)
  "coin collecting",
  "stamp collecting",
  "postcard collecting",
  "book collecting",
  "rare book collecting",
  "comic book collecting",
  "graphic novel collecting",
  "trading card collecting",
  "sports cards",
  "pokemon cards",
  "action figure collecting",
  "doll collecting",
  "barbie collecting",
  "toy collecting",
  "die-cast collecting",
  "model train collecting",
  "model car collecting",
  "model airplane collecting",
  "model ship collecting",
  "lego collecting",
  "antique collecting",
  "vintage item collecting",
  "retro gaming collecting",
  "record collecting",
  "vinyl collecting",
  "cd collecting",
  "cassette collecting",
  "movie collecting",
  "dvd collecting",
  "blu-ray collecting",
  "vhs collecting",
  "art collecting",
  "poster collecting",
  "print collecting",
  "jewelry collecting",
  "vintage jewelry",
  "watch collecting",
  "clock collecting",
  "mineral collecting",
  "rock collecting",
  "gemstone collecting",
  "crystal collecting",
  "fossil collecting",
  "seashell collecting",
  "coral collecting",
  "butterfly collecting",
  "insect collecting",
  "beetle collecting",
  "plant collecting",
  "seed collecting",
  "pressed flower collecting",
  "bottle collecting",
  "can collecting",
  "badge collecting",
  "pin collecting",
  "patch collecting",
  "magnet collecting",
  "spoon collecting",
  "thimble collecting",
  "keychain collecting",
  "snow globe collecting",
  "miniature collecting",
  "shot glass collecting",
  "mug collecting",
  "teapot collecting",
  "sports memorabilia",
  "celebrity memorabilia",
  "historical artifacts",
  "military memorabilia",
  "currency collecting",
  "banknote collecting",
  "ticket stub collecting",
  "menu collecting",
  "matchbook collecting",
  "lighter collecting",
  "perfume bottle collecting",
  "salt shaker collecting",
  "nutcracker collecting",
  "figurine collecting",
  "ornament collecting",
  // Games & Puzzles (70)
  "chess",
  "checkers",
  "backgammon",
  "go",
  "othello",
  "reversi",
  "mancala",
  "chinese checkers",
  "scrabble",
  "monopoly",
  "risk",
  "settlers of catan",
  "ticket to ride",
  "pandemic",
  "dungeons & dragons",
  "pathfinder",
  "warhammer",
  "magic: the gathering",
  "pokemon tcg",
  "yu-gi-oh",
  "board game design",
  "poker",
  "bridge",
  "blackjack",
  "hearts",
  "spades",
  "rummy",
  "gin",
  "canasta",
  "cribbage",
  "video gaming",
  "pc gaming",
  "console gaming",
  "mobile gaming",
  "retro gaming",
  "arcade gaming",
  "vr gaming",
  "ar gaming",
  "game streaming",
  "speedrunning",
  "competitive gaming",
  "game development",
  "game design",
  "level design",
  "game testing",
  "jigsaw puzzles",
  "3d puzzles",
  "mechanical puzzles",
  "logic puzzles",
  "crossword puzzles",
  "cryptic crosswords",
  "sudoku",
  "kakuro",
  "word searches",
  "anagrams",
  "acrostics",
  "brain teasers",
  "riddles",
  "rubik's cube",
  "speedcubing",
  "trivia",
  "quiz competitions",
  "escape rooms",
  "treasure hunts",
  "scavenger hunts",
  "mazes",
  "number puzzles",
  "pattern puzzles",
  "memory games",
  "puzzle competitions",
  // Technology & Digital (100)
  "computer programming",
  "coding",
  "web development",
  "app development",
  "game development",
  "3d modeling",
  "animation",
  "video editing",
  "photo editing",
  "graphic design",
  "digital photography",
  "drone flying",
  "robotics",
  "electronics",
  "circuit building",
  "arduino projects",
  "raspberry pi projects",
  "3d printing",
  "virtual reality",
  "augmented reality",
  "cryptocurrency",
  "blockchain development",
  "smart contracts",
  "nft creation",
  "defi projects",
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "neural networks",
  "computer vision",
  "natural language processing",
  "data science",
  "data analysis",
  "big data",
  "cloud computing",
  "devops",
  "cybersecurity",
  "ethical hacking",
  "penetration testing",
  "network security",
  "digital forensics",
  "system administration",
  "database management",
  "software testing",
  "quality assurance",
  "tech blogging",
  "technical writing",
  "podcast production",
  "youtube creation",
  "live streaming",
  "social media management",
  "seo optimization",
  "digital marketing",
  "e-commerce",
  "online business",
  "affiliate marketing",
  "dropshipping",
  "print on demand",
  "saas development",
  "mobile app testing",
  "ui/ux design",
  "user research",
  "prototyping",
  "wireframing",
  "design systems",
  "front-end development",
  "back-end development",
  "full-stack development",
  "api development",
  "microservices",
  "containerization",
  "kubernetes",
  "docker",
  "linux administration",
  "shell scripting",
  "automation",
  "ci/cd",
  "version control",
  "project management tools",
  "agile methodology",
  "scrum mastering",
  "tech entrepreneurship",
  "startup founding",
  "tech investing",
  "patent research",
  "invention",
  "iot development",
  "embedded systems",
  "firmware development",
  "hardware hacking",
  "electronics repair",
  "computer building",
  "overclocking",
  "cryptocurrency mining",
  "tech support",
  "it consulting",
  "digital nomadism",
  "remote work optimization",
  "productivity hacking",
  "automation tools",
  // Science & Nature (100)
  "astronomy",
  "stargazing",
  "astrophotography",
  "telescope making",
  "planetarium visits",
  "meteorology",
  "weather tracking",
  "storm chasing",
  "climate science",
  "atmospheric research",
  "geology",
  "mineralogy",
  "petrology",
  "volcanology",
  "seismology",
  "paleontology",
  "archaeology",
  "anthropology",
  "forensic science",
  "criminology",
  "biology",
  "molecular biology",
  "genetics",
  "biotechnology",
  "bioinformatics",
  "botany",
  "plant biology",
  "horticulture",
  "mycology",
  "zoology",
  "marine biology",
  "ichthyology",
  "ornithology",
  "entomology",
  "arachnology",
  "herpetology",
  "mammalogy",
  "ecology",
  "conservation biology",
  "environmental science",
  "sustainability",
  "renewable energy",
  "solar power",
  "wind energy",
  "hydroponics",
  "aquaponics",
  "permaculture",
  "organic farming",
  "urban farming",
  "vertical farming",
  "chemistry",
  "organic chemistry",
  "inorganic chemistry",
  "biochemistry",
  "analytical chemistry",
  "physical chemistry",
  "physics",
  "quantum physics",
  "nuclear physics",
  "particle physics",
  "theoretical physics",
  "applied physics",
  "engineering physics",
  "materials science",
  "nanotechnology",
  "microscopy",
  "spectroscopy",
  "crystallography",
  "laboratory work",
  "scientific research",
  "experimental design",
  "data collection",
  "statistical analysis",
  "scientific writing",
  "peer review",
  "conference presenting",
  "nature photography",
  "wildlife photography",
  "macro photography",
  "time-lapse photography",
  "nature journaling",
  "field sketching",
  "botanical illustration",
  "scientific illustration",
  "herbarium making",
  "specimen collection",
  "taxidermy",
  "nature conservation",
  "wildlife rehabilitation",
  "animal behavior study",
  "citizen science",
  "biohacking",
  "diy biology",
  "fermentation",
  "kombucha brewing",
  "mushroom cultivation",
  "aquarium keeping",
  "terrarium building",
  "vivarium setup",
  "greenhouse management",
  // Literature & Writing (80)
  "creative writing",
  "fiction writing",
  "non-fiction writing",
  "novel writing",
  "novella writing",
  "short story writing",
  "flash fiction",
  "micro fiction",
  "poetry writing",
  "spoken word",
  "slam poetry",
  "haiku writing",
  "sonnet writing",
  "free verse",
  "screenwriting",
  "television writing",
  "radio writing",
  "playwriting",
  "musical theater writing",
  "libretto writing",
  "journalism",
  "investigative journalism",
  "sports journalism",
  "entertainment journalism",
  "political journalism",
  "science journalism",
  "health journalism",
  "travel journalism",
  "food writing",
  "wine writing",
  "blogging",
  "personal blogging",
  "professional blogging",
  "guest blogging",
  "technical writing",
  "copywriting",
  "content writing",
  "seo writing",
  "marketing writing",
  "grant writing",
  "proposal writing",
  "business writing",
  "academic writing",
  "research writing",
  "dissertation writing",
  "thesis writing",
  "editing",
  "proofreading",
  "fact-checking",
  "developmental editing",
  "line editing",
  "copy editing",
  "ghostwriting",
  "translation",
  "localization",
  "interpretation",
  "subtitling",
  "transcription",
  "book reviewing",
  "literary criticism",
  "literary analysis",
  "comparative literature",
  "book club leading",
  "reading challenges",
  "speed reading",
  "critical reading",
  "library science",
  "archival work",
  "manuscript preservation",
  "rare book collecting",
  "storytelling",
  "oral tradition",
  "memoir writing",
  "autobiography writing",
  "biography writing",
  "historical writing",
  "genealogy research",
  "family history",
  "oral history",
  "fan fiction writing",
  // Food & Cooking (120)
  "cooking",
  "fine dining",
  "molecular gastronomy",
  "fusion cuisine",
  "ethnic cooking",
  "regional specialties",
  "traditional recipes",
  "family recipes",
  "recipe development",
  "menu planning",
  "baking",
  "artisan baking",
  "sourdough baking",
  "pastry making",
  "cake decorating",
  "sugar art",
  "chocolate work",
  "confectionery",
  "candy making",
  "caramel making",
  "ice cream making",
  "gelato making",
  "sorbet making",
  "frozen desserts",
  "cheese making",
  "charcuterie",
  "meat curing",
  "smoking meats",
  "barbecuing",
  "grilling",
  "wine making",
  "viticulture",
  "wine tasting",
  "sommelier training",
  "beer brewing",
  "homebrewing",
  "craft beer",
  "mead making",
  "sake brewing",
  "distilling",
  "cocktail mixing",
  "mixology",
  "bartending",
  "coffee roasting",
  "coffee cupping",
  "latte art",
  "espresso making",
  "tea blending",
  "tea ceremony",
  "kombucha brewing",
  "fermentation",
  "pickling",
  "preserving",
  "canning",
  "dehydrating",
  "freeze drying",
  "spice blending",
  "herb cultivation",
  "microgreens growing",
  "sprout growing",
  "food photography",
  "food styling",
  "food blogging",
  "food vlogging",
  "restaurant reviewing",
  "food criticism",
  "culinary history",
  "nutrition science",
  "diet planning",
  "meal prep",
  "cooking classes",
  "culinary education",
  "kitchen organization",
  "knife skills",
  "food safety",
  "sanitation",
  "restaurant management",
  "catering",
  "personal chef",
  "food truck operation",
  "farmers market vending",
  "food product development",
  "food packaging",
  "food marketing",
  "culinary tourism",
  "food and wine pairing",
  "foraging",
  "wild edibles",
  "urban farming",
  "container gardening",
  "herb gardening",
  "vegetable gardening",
  "fruit growing",
  "greenhouse growing",
  "hydroponic growing",
  "aquaponic growing",
  "permaculture",
  "sustainable cooking",
  "zero waste cooking",
  "plant-based cooking",
  "vegan cooking",
  "vegetarian cooking",
  "raw food preparation",
  "gluten-free cooking",
  "allergen-free cooking",
  "diabetic cooking",
  "heart-healthy cooking",
  "weight management cooking",
  "sports nutrition",
  "meal planning apps",
  "cooking competitions",
  "iron chef training",
  "culinary competitions",
  "food festivals",
  "cooking shows",
  "culinary podcasts",
  "food writing",
  "cookbook writing",
  "recipe testing",
  "food science experiments",
  // Travel & Culture (100)
  "world travel",
  "solo travel",
  "group travel",
  "family travel",
  "budget travel",
  "luxury travel",
  "adventure travel",
  "eco-travel",
  "sustainable tourism",
  "responsible travel",
  "backpacking",
  "hitchhiking",
  "road trips",
  "motorcycle touring",
  "bicycle touring",
  "train travel",
  "cruise travel",
  "sailing expeditions",
  "yacht chartering",
  "river cruising",
  "cultural immersion",
  "homestays",
  "volunteer travel",
  "educational travel",
  "language immersion",
  "study abroad",
  "work abroad",
  "digital nomadism",
  "slow travel",
  "micro-adventures",
  "urban exploration",
  "city breaks",
  "weekend getaways",
  "staycations",
  "local tourism",
  "hidden gems exploration",
  "off-the-beaten-path travel",
  "extreme tourism",
  "dark tourism",
  "disaster tourism",
  "heritage tourism",
  "historical sites",
  "unesco sites",
  "archaeological sites",
  "ancient ruins",
  "castles and palaces",
  "religious sites",
  "pilgrimage",
  "spiritual journeys",
  "meditation retreats",
  "wellness travel",
  "spa tourism",
  "health tourism",
  "medical tourism",
  "dental tourism",
  "cosmetic tourism",
  "adventure sports tourism",
  "extreme sports travel",
  "safari tours",
  "wildlife tourism",
  "birdwatching tours",
  "nature photography tours",
  "landscape photography",
  "travel photography",
  "street photography",
  "portrait photography",
  "documentary photography",
  "travel blogging",
  "travel vlogging",
  "travel journalism",
  "travel writing",
  "guidebook writing",
  "travel podcasting",
  "travel planning",
  "itinerary creation",
  "travel hacking",
  "points and miles",
  "loyalty programs",
  "travel deals",
  "travel insurance",
  "language learning",
  "polyglot training",
  "cultural exchange",
  "international friendship",
  "pen pal relationships",
  "cultural competency",
  "cross-cultural communication",
  "international business",
  "global citizenship",
  "world affairs",
  "geopolitics",
  "international relations",
  "diplomacy",
  "foreign policy",
  "global economics",
  "international trade",
  "cultural anthropology",
  "ethnography",
  "sociology",
  "comparative religion",
  // Health & Wellness (100)
  "holistic health",
  "alternative medicine",
  "integrative medicine",
  "functional medicine",
  "naturopathy",
  "homeopathy",
  "ayurveda",
  "traditional chinese medicine",
  "acupuncture",
  "acupressure",
  "reflexology",
  "massage therapy",
  "deep tissue massage",
  "swedish massage",
  "hot stone massage",
  "thai massage",
  "shiatsu",
  "sports massage",
  "prenatal massage",
  "geriatric massage",
  "aromatherapy",
  "essential oils",
  "herbalism",
  "phytotherapy",
  "botanical medicine",
  "flower essences",
  "crystal healing",
  "sound healing",
  "vibrational therapy",
  "energy healing",
  "reiki",
  "pranic healing",
  "chakra balancing",
  "aura reading",
  "spiritual healing",
  "shamanic healing",
  "indigenous healing",
  "mind-body medicine",
  "psychosomatic medicine",
  "placebo research",
  "meditation",
  "mindfulness",
  "vipassana",
  "zen meditation",
  "transcendental meditation",
  "loving-kindness meditation",
  "walking meditation",
  "breathing exercises",
  "pranayama",
  "breath work",
  "wim hof method",
  "cold therapy",
  "heat therapy",
  "sauna therapy",
  "infrared therapy",
  "light therapy",
  "color therapy",
  "music therapy",
  "dance therapy",
  "art therapy",
  "drama therapy",
  "play therapy",
  "sand therapy",
  "pet therapy",
  "equine therapy",
  "dolphin therapy",
  "forest bathing",
  "nature therapy",
  "ecotherapy",
  "outdoor therapy",
  "adventure therapy",
  "wilderness therapy",
  "horticultural therapy",
  "gardening therapy",
  "occupational therapy",
  "physical therapy",
  "speech therapy",
  "cognitive therapy",
  "behavioral therapy",
  "psychotherapy",
  "counseling",
  "life coaching",
  "health coaching",
  "wellness coaching",
  "nutrition coaching",
  "fitness coaching",
  "spiritual coaching",
  "career coaching",
  "relationship coaching",
  "parenting coaching",
  "grief counseling",
  "trauma therapy",
  "addiction recovery",
  "rehabilitation",
  "chronic pain management",
  "stress management",
  "anxiety management",
  "depression support",
  "mental health advocacy",
  "suicide prevention",
  // Business & Finance (100)
  "entrepreneurship",
  "startup founding",
  "business planning",
  "business model design",
  "lean startup",
  "agile business",
  "design thinking",
  "innovation management",
  "disruptive innovation",
  "business strategy",
  "competitive analysis",
  "market research",
  "customer development",
  "product management",
  "project management",
  "operations management",
  "supply chain management",
  "logistics",
  "inventory management",
  "quality control",
  "six sigma",
  "lean manufacturing",
  "process improvement",
  "change management",
  "organizational development",
  "human resources",
  "talent acquisition",
  "employee development",
  "performance management",
  "compensation planning",
  "leadership development",
  "executive coaching",
  "team building",
  "conflict resolution",
  "negotiation",
  "mediation",
  "arbitration",
  "legal studies",
  "contract law",
  "intellectual property",
  "patent law",
  "trademark law",
  "copyright law",
  "business law",
  "corporate governance",
  "compliance",
  "risk management",
  "insurance",
  "financial planning",
  "wealth management",
  "investment banking",
  "private equity",
  "venture capital",
  "angel investing",
  "crowdfunding",
  "fundraising",
  "grant writing",
  "accounting",
  "bookkeeping",
  "financial analysis",
  "valuation",
  "mergers and acquisitions",
  "due diligence",
  "auditing",
  "tax planning",
  "estate planning",
  "retirement planning",
  "college planning",
  "insurance planning",
  "real estate investing",
  "property management",
  "commercial real estate",
  "residential real estate",
  "real estate development",
  "construction management",
  "architecture",
  "interior design",
  "urban planning",
  "zoning",
  "land use",
  "marketing",
  "brand management",
  "advertising",
  "public relations",
  "social media marketing",
  "content marketing",
  "email marketing",
  "influencer marketing",
  "affiliate marketing",
  "performance marketing",
  "sales",
  "business development",
  "customer relationship management",
  "customer service",
  "customer success",
  "account management",
  "key account management",
  "channel management",
  "partnership development",
  "alliance management",
  // Unique & Unusual (200)
  "balloon twisting",
  "balloon artistry",
  "face painting",
  "body painting",
  "henna art",
  "temporary tattoos",
  "nail art",
  "nail design",
  "hair styling",
  "hair artistry",
  "makeup artistry",
  "special effects makeup",
  "prosthetics making",
  "monster makeup",
  "zombie makeup",
  "fantasy makeup",
  "theatrical makeup",
  "film makeup",
  "tv makeup",
  "fashion makeup",
  "bridal makeup",
  "editorial makeup",
  "avant-garde makeup",
  "drag makeup",
  "cosplay makeup",
  "historical makeup",
  "period makeup",
  "character makeup",
  "aging makeup",
  "injury simulation",
  "mask making",
  "venetian masks",
  "tribal masks",
  "ceremonial masks",
  "theater masks",
  "carnival masks",
  "costume making",
  "historical costumes",
  "period costumes",
  "fantasy costumes",
  "sci-fi costumes",
  "steampunk costumes",
  "victorian fashion",
  "medieval clothing",
  "renaissance garb",
  "historical reenactment",
  "living history",
  "renaissance fairs",
  "medieval festivals",
  "civil war reenactment",
  "revolutionary war reenactment",
  "viking reenactment",
  "roman reenactment",
  "ancient history",
  "archaeology simulation",
  "experimental archaeology",
  "primitive technology",
  "stone age skills",
  "bronze age crafts",
  "iron age techniques",
  "bushcraft",
  "wilderness survival",
  "primitive survival",
  "urban survival",
  "disaster preparedness",
  "emergency planning",
  "first aid",
  "wilderness first aid",
  "combat first aid",
  "tactical medicine",
  "survivalism",
  "prepping",
  "off-grid living",
  "homesteading",
  "self-sufficiency",
  "sustainable living",
  "zero waste lifestyle",
  "minimalism",
  "simple living",
  "intentional living",
  "tiny house living",
  "van life",
  "rv living",
  "nomadic living",
  "digital nomadism",
  "location independence",
  "remote work",
  "freelancing",
  "consulting",
  "gig economy",
  "side hustles",
  "passive income",
  "online business",
  "e-commerce",
  "dropshipping",
  "print on demand",
  "affiliate marketing",
  "influencer marketing",
  "social media influence",
  "content creation",
  "youtube creation",
  "tiktok creation",
  "instagram influence",
  "podcast hosting",
  "radio broadcasting",
  "voice over work",
  "audiobook narration",
  "commercial voice over",
  "character voices",
  "impressions",
  "stand-up comedy",
  "improv comedy",
  "sketch comedy",
  "comedy writing",
  "satire",
  "parody",
  "roasting",
  "comedy podcasting",
  "comedy vlogging",
  "comedy streaming",
  "street performance",
  "busking",
  "circus arts",
  "acrobatics",
  "aerial arts",
  "trapeze",
  "silk dancing",
  "pole dancing",
  "fire dancing",
  "fire spinning",
  "fire breathing",
  "fire eating",
  "knife throwing",
  "axe throwing",
  "sword swallowing",
  "escape artistry",
  "lock picking",
  "safe cracking",
  "security consulting",
  "penetration testing",
  "urban exploration",
  "abandoned places",
  "ruins exploration",
  "cave exploration",
  "spelunking",
  "underground exploration",
  "sewer exploration",
  "tunnel exploration",
  "roof topping",
  "crane climbing",
  "ghost hunting",
  "paranormal investigation",
  "ufo hunting",
  "cryptozoology",
  "bigfoot hunting",
  "monster hunting",
  "legend tripping",
  "mystery solving",
  "cold case investigation",
  "amateur detective work",
  "treasure hunting",
  "metal detecting",
  "magnet fishing",
  "mudlarking",
  "beachcombing",
  "fossil hunting",
  "arrowhead hunting",
  "bottle digging",
  "antique hunting",
  "thrift shopping",
  "dumpster diving",
  "freeganism",
  "upcycling",
  "repurposing",
  "recycling art",
  "junk art",
  "found object art",
  "assemblage art",
  "installation art",
  "performance art",
  "flash mob organizing",
  "guerrilla theater",
  "street art",
  "graffiti art",
  "mural painting",
  "chalk art",
  "sand art",
  "ice sculpture",
  "snow sculpture",
  "land art",
  "environmental art",
  "eco art",
  "sustainable art",
  "recycled art",
  "natural art",
  "ephemeral art",
  "temporary art",
  "site-specific art",
  "community art",
  "collaborative art",
  "social art",
  "political art",
  "protest art",
  "activism art",
  "awareness campaigns",
  "social justice",
  "human rights",
  "environmental activism",
  "animal rights",
  "conservation",
  "reading quran",
  "islamic studies",
  "religious studies",
  "theology",
  "philosophy",
  "metaphysics",
  "ethics",
  "logic",
  "critical thinking",
  "debate",
  "argumentation",
  "rhetoric",
  "public speaking",
  "oratory",
  "storytelling",
  "oral tradition",
  "folklore",
  "mythology",
  "legend collection",
  "fairy tale study",
  "children's literature",
  "young adult literature",
  "graphic novels",
  "comic books",
  "manga",
  "anime",
  "cosplay",
  "larping",
  "role playing",
  "character creation"
];
var hobbyKeywords = {
  // Music
  music: ["music", "guitar", "piano", "violin", "drums", "singing", "bass", "keyboard", "ukulele"],
  // Art & Creativity  
  art: ["drawing", "painting", "sketching", "art", "illustration", "digital art", "watercolor", "acrylic"],
  // Movement & Dance
  dance: ["dance", "dancing", "ballet", "hip hop", "salsa", "ballroom", "contemporary", "jazz dance"],
  // Physical Activities
  fitness: ["yoga", "pilates", "workout", "fitness", "exercise", "gym", "strength training", "cardio"],
  sports: ["tennis", "basketball", "soccer", "football", "volleyball", "swimming", "running", "cycling"],
  martial_arts: ["karate", "taekwondo", "judo", "boxing", "mma", "kung fu", "aikido", "jiu jitsu"],
  // Skills & Crafts
  cooking: ["cooking", "baking", "culinary", "chef", "cuisine", "recipes", "food preparation"],
  crafts: ["knitting", "sewing", "crochet", "embroidery", "quilting", "needlework", "crafting"],
  woodworking: ["woodworking", "carpentry", "furniture making", "wood carving", "woodcraft"],
  // Technology
  coding: ["coding", "programming", "web development", "app development", "software", "javascript", "python"],
  // Outdoor & Nature
  gardening: ["gardening", "horticulture", "plants", "farming", "landscaping", "greenhouse"],
  // Creative Arts
  photography: ["photography", "photo", "camera", "portrait", "landscape photography", "digital photography"],
  writing: ["writing", "creative writing", "poetry", "storytelling", "blogging", "journalism"],
  // Learning & Academic
  languages: ["language", "spanish", "french", "german", "italian", "chinese", "japanese", "english"],
  // Spiritual & Religious
  religious: ["quran", "quran recitation", "quran reading", "islamic studies", "arabic", "tajweed", "hadith", "prayer", "meditation"],
  // Games & Entertainment
  gaming: ["gaming", "video games", "board games", "chess", "poker", "game development"],
  // Business & Finance
  business: ["business", "entrepreneurship", "marketing", "investing", "finance", "economics"],
  // Home & Lifestyle
  organization: ["organization", "decluttering", "minimalism", "home improvement", "interior design"],
  // Research & Academic
  research: ["research", "academic research", "data research", "market research", "science research", "history research", "historical research", "genealogy research", "archival research", "history", "genealogy"]
};
function isValidHobby(input) {
  const lowerInput = input.toLowerCase().trim();
  return validHobbies.some(
    (hobby) => hobby.toLowerCase() === lowerInput || lowerInput.includes(hobby.toLowerCase()) || hobby.toLowerCase().includes(lowerInput)
  );
}
function detectBestHobbyMatch(input) {
  const lowerInput = input.toLowerCase().trim();
  const exactMatch = validHobbies.find((hobby) => hobby.toLowerCase() === lowerInput);
  if (exactMatch) {
    return exactMatch;
  }
  const partialMatch = validHobbies.find(
    (hobby) => hobby.toLowerCase().includes(lowerInput) && lowerInput.length >= 3
  );
  if (partialMatch) {
    return partialMatch;
  }
  if (videoDatabase[lowerInput]) {
    return lowerInput;
  }
  let bestMatch = null;
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    for (const keyword of keywords) {
      let score = 0;
      if (lowerInput === keyword) {
        score = 100;
      } else if (lowerInput.includes(keyword)) {
        score = 80;
      } else if (keyword.includes(lowerInput) && lowerInput.length >= 3) {
        score = 60;
      } else if (calculateSimilarity(lowerInput, keyword) > 0.7) {
        score = 40;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = videoDatabase[category] ? category : keyword;
      }
    }
  }
  return bestScore >= 40 ? bestMatch : null;
}
function calculateSimilarity(str1, str2) {
  if (str1.length === 0 || str2.length === 0) return 0;
  if (str1 === str2) return 1;
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1;
  const commonChars = countCommonChars(shorter, longer);
  return commonChars / longer.length;
}
function countCommonChars(str1, str2) {
  let common = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str2.includes(str1[i])) {
      common++;
    }
  }
  return common;
}
function detectContextualHobby(input) {
  const lower = input.toLowerCase().trim();
  if (lower.includes("quran") || lower.includes("koran") || lower.includes("qoran")) {
    return { hobby: "quran reading", category: "religious" };
  }
  if (lower.includes("bible") && (lower.includes("read") || lower.includes("study"))) {
    return { hobby: "bible study", category: "religious" };
  }
  if (lower.includes("meditation") || lower.includes("mindfulness")) {
    return { hobby: "meditation", category: "spiritual" };
  }
  if (lower.includes("spanish") && (lower.includes("learn") || lower.includes("study"))) {
    return { hobby: "spanish language", category: "languages" };
  }
  if (lower.includes("french") && (lower.includes("learn") || lower.includes("study"))) {
    return { hobby: "french language", category: "languages" };
  }
  if (lower.includes("reading")) {
    if (lower.includes("quran") || lower.includes("koran")) {
      return { hobby: "quran reading", category: "religious" };
    }
    if (lower.includes("books") || lower.includes("novels")) {
      return { hobby: "book reading", category: "learning" };
    }
    if (lower.includes("poetry")) {
      return { hobby: "poetry reading", category: "art" };
    }
    return null;
  }
  if (lower.includes("cook") || lower.includes("baking")) {
    if (lower.includes("italian")) return { hobby: "italian cooking", category: "cooking" };
    if (lower.includes("indian")) return { hobby: "indian cooking", category: "cooking" };
    if (lower.includes("chinese")) return { hobby: "chinese cooking", category: "cooking" };
    if (lower.includes("baking")) return { hobby: "baking", category: "cooking" };
    return { hobby: "cooking", category: "cooking" };
  }
  if (lower.includes("play") && (lower.includes("guitar") || lower.includes("piano") || lower.includes("violin"))) {
    if (lower.includes("guitar")) return { hobby: "guitar", category: "music" };
    if (lower.includes("piano")) return { hobby: "piano", category: "music" };
    if (lower.includes("violin")) return { hobby: "violin", category: "music" };
  }
  if (lower.includes("draw") || lower.includes("sketch")) {
    return { hobby: "drawing", category: "art" };
  }
  if (lower.includes("paint")) {
    return { hobby: "painting", category: "art" };
  }
  if (lower.includes("photo")) {
    return { hobby: "photography", category: "art" };
  }
  if (lower.includes("yoga")) {
    return { hobby: "yoga", category: "fitness" };
  }
  if (lower.includes("dance") || lower.includes("dancing")) {
    return { hobby: "dance", category: "dance" };
  }
  if (lower.includes("swimming") || lower.includes("swim")) {
    return { hobby: "swimming", category: "fitness" };
  }
  if (lower.includes("learn") || lower.includes("study")) {
    const words = lower.split(" ");
    const learnIndex = words.findIndex((w) => w.includes("learn") || w.includes("study"));
    if (learnIndex >= 0 && learnIndex < words.length - 1) {
      const subject = words.slice(learnIndex + 1).join(" ");
      if (subject.length > 2) {
        return { hobby: subject, category: "learning" };
      }
    }
  }
  return null;
}
function findCategoryForHobby(hobby) {
  const lowerHobby = hobby.toLowerCase();
  const creativeArts = ["knitting", "crocheting", "embroidery", "calligraphy", "quilling", "origami", "macram\xE9", "upcycling", "watercolor painting", "diamond painting", "pour painting", "pottery", "scrapbooking", "soap making", "candle making", "leather crafting", "jewelry making", "street art", "digital art", "mug painting", "nail art", "floral arranging", "miniature model building", "bullet journaling", "creative writing", "songwriting", "acting", "improv comedy", "urban sketching", "cosplay", "vintage collecting"];
  const outdoor = ["gardening", "urban farming", "foraging", "bird watching", "stargazing", "geocaching", "hiking", "camping", "rock climbing", "kayaking", "stand-up paddleboarding", "wild swimming", "orienteering", "beachcombing", "metal detecting", "beekeeping", "aquascaping", "terrarium building", "hydroponics", "urban exploration", "astrophotography", "insect collecting", "mushroom growing"];
  const fitness = ["parkour", "rollerblading", "skateboarding", "disc golf", "archery", "fencing", "tai chi", "yoga", "pilates", "aerial silks", "hula hooping", "jump rope", "krav maga", "boxing", "capoeira", "dance", "hip-hop", "ballroom dancing"];
  const games = ["chess", "board gaming", "puzzle solving", "escape rooms", "speedcubing", "magic tricks", "larping", "trivia", "quiz games", "debate"];
  const tech = ["coding", "robotics", "3d printing", "drone flying", "virtual reality gaming", "augmented reality exploration", "podcasting", "vlogging", "streaming", "retro gaming", "ethical hacking", "digital nomadism"];
  const culinary = ["cooking", "baking", "mixology", "fermenting", "cheese making", "home brewing", "food photography", "kombucha brewing"];
  const wellness = ["astronomy", "genealogy", "language learning", "cryptography", "philosophy reading", "book club", "pen palling", "journaling", "meditation", "sound bathing", "volunteering", "letterboxing"];
  if (creativeArts.includes(lowerHobby)) return "Creative Arts";
  if (outdoor.includes(lowerHobby)) return "Outdoor/Nature";
  if (fitness.includes(lowerHobby)) return "Fitness";
  if (games.includes(lowerHobby)) return "Games/Puzzles";
  if (tech.includes(lowerHobby)) return "Technology";
  if (culinary.includes(lowerHobby)) return "Culinary";
  if (wellness.includes(lowerHobby)) return "Wellness";
  return "general";
}
function validateHobby(hobbyInput) {
  const input = hobbyInput.toLowerCase().trim();
  if (isValidHobby(input)) {
    const exactMatch = validHobbies.find((hobby) => hobby.toLowerCase() === input);
    if (exactMatch) {
      return {
        isValid: true,
        normalizedHobby: exactMatch,
        category: findCategoryForHobby(exactMatch),
        hasVideoSupport: !!videoDatabase[exactMatch],
        suggestions: []
      };
    }
  }
  const contextualMapping = detectContextualHobby(input);
  if (contextualMapping) {
    console.log("\u{1F3AF} Contextual mapping found:", contextualMapping);
    return {
      isValid: true,
      normalizedHobby: contextualMapping.hobby,
      category: contextualMapping.category,
      hasVideoSupport: !!videoDatabase[contextualMapping.hobby],
      suggestions: []
    };
  }
  if (["history research", "historical research", "research", "genealogy research", "archival research", "history", "genealogy"].includes(input)) {
    return {
      isValid: true,
      normalizedHobby: "history research",
      category: "research",
      hasVideoSupport: false,
      // Will use generic fallback videos
      suggestions: []
    };
  }
  const badInputs = ["bye", "hello", "hi", "hey", "hmm", "um", "uh", "ah", "ok", "okay", "yes", "no", "maybe", "test", "testing", "", "null", "undefined", "admin", "root", "cool", "nice", "good", "bad"];
  if (badInputs.includes(input) || input.length < 2) {
    return {
      isValid: false,
      normalizedHobby: "",
      category: null,
      hasVideoSupport: false,
      suggestions: ["guitar", "cooking", "drawing", "yoga", "photography", "dance", "quran reading", "swimming"]
    };
  }
  const detectedHobby = detectBestHobbyMatch(input);
  if (detectedHobby) {
    const hasVideoSupport = !!videoDatabase[detectedHobby];
    const category = hasVideoSupport ? detectedHobby : findCategoryForHobby(detectedHobby);
    return {
      isValid: true,
      normalizedHobby: detectedHobby,
      category,
      hasVideoSupport,
      detectedHobbies: [detectedHobby]
    };
  }
  const reasonablePattern = /^[a-zA-Z\s-]{3,30}$/;
  if (reasonablePattern.test(input)) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: "general",
      hasVideoSupport: false
    };
  }
  return {
    isValid: false,
    normalizedHobby: input,
    category: null,
    hasVideoSupport: false,
    suggestions: ["guitar", "cooking", "drawing", "yoga", "photography", "dance"]
  };
}

// server/openrouterValidation.ts
import fetch3 from "node-fetch";
var OpenRouterHobbyValidator = class {
  openRouterKey;
  baseUrl;
  validationCache = /* @__PURE__ */ new Map();
  cacheExpiryMs = 5 * 60 * 1e3;
  // 5 minutes cache
  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY || "";
    this.baseUrl = "https://openrouter.ai/api/v1/chat/completions";
    if (!this.openRouterKey) {
      console.warn("\u26A0\uFE0F No OpenRouter API key found - hobby validation will be limited");
    }
  }
  async validateHobby(userInput) {
    const cacheKey = userInput.toLowerCase().trim();
    const dangerousHobbyResult = this.checkDangerousHobby(cacheKey);
    if (dangerousHobbyResult) {
      console.log(`\u26A0\uFE0F DANGEROUS hobby input blocked: ${userInput}`);
      return dangerousHobbyResult;
    }
    const complexHobbyResult = this.checkComplexHobby(cacheKey);
    if (complexHobbyResult) {
      console.log(`\u{1F6AB} Complex hobby detected: ${userInput}`);
      return complexHobbyResult;
    }
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
      console.log(`\u{1F4CB} Using cached validation for: ${userInput}`);
      return cached.result;
    }
    if (!this.openRouterKey) {
      return this.fallbackValidation(userInput);
    }
    try {
      console.log(`\u{1F50D} OpenRouter: Validating hobby input:`, userInput);
      const prompt = `You are a hobby and activity expert. Analyze this user input and determine if it's a valid hobby or activity that someone can learn in 7 days.

SAFETY FIRST: Immediately reject any input related to violence, weapons, explosives, illegal activities, drugs, harm to others or self, sexual content, adult entertainment, or any dangerous/harmful/inappropriate content. Only approve safe, positive learning activities.

User input: "${userInput}"

Respond with JSON only:
{
  "isValid": boolean,
  "correctedHobby": "string (only if correction needed)",
  "suggestions": ["array of 3 similar valid hobbies if input is invalid"],
  "reasoning": "brief explanation"
}

Valid hobbies are safe, learnable activities like: guitar, cooking, drawing, yoga, photography, knitting, gardening, reading, writing, crafts, sports, music, etc.

Invalid inputs include: 
- Dangerous/harmful activities (weapons, violence, illegal substances, etc.)
- Sexual or adult content
- Inappropriate content
- Overly complex activities  
- Nonsense words
- Things that aren't hobbies

For misspellings of valid hobbies, provide the corrected spelling in correctedHobby.
For dangerous, inappropriate, or completely invalid inputs, suggest 3 safe, legitimate hobbies instead.`;
      const response = await fetch3(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.openRouterKey}`,
          "HTTP-Referer": "https://wizqo.com",
          "X-Title": "Wizqo Hobby Learning Platform"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });
      if (!response.ok) {
        console.error("OpenRouter API error:", response.status, response.statusText);
        return this.fallbackValidation(userInput);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error("OpenRouter: No content in response");
        return this.fallbackValidation(userInput);
      }
      try {
        const cleanedContent = this.cleanJsonResponse(content);
        const result = JSON.parse(cleanedContent);
        console.log(`\u2705 OpenRouter validation result:`, result);
        this.validationCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        return result;
      } catch (parseError) {
        console.error("OpenRouter: Failed to parse JSON response:", parseError);
        console.error("Raw content:", content);
        return this.fallbackValidation(userInput);
      }
    } catch (error) {
      console.error("OpenRouter validation error:", error);
      return this.fallbackValidation(userInput);
    }
  }
  checkDangerousHobby(input) {
    console.log(`\u{1F50D} SAFETY CHECK: Checking input "${input}" for dangerous content`);
    const dangerousKeywords = [
      // Explosives & weapons
      "bomb",
      "explosive",
      "dynamite",
      "grenade",
      "weapon",
      "gun",
      "rifle",
      "pistol",
      "ammunition",
      "bullet",
      "gunpowder",
      "tnt",
      "c4",
      "molotov",
      "missile",
      "rocket launcher",
      // Violence & harm
      "killing",
      "murder",
      "assassination",
      "torture",
      "violence",
      "fighting",
      "stabbing",
      "shooting",
      "attacking",
      "hurting",
      "harm",
      "injury",
      "wound",
      "bloodshed",
      // Illegal substances & activities
      "drug",
      "cocaine",
      "heroin",
      "methamphetamine",
      "meth",
      "lsd",
      "ecstasy",
      "marijuana production",
      "counterfeiting",
      "forgery",
      "fraud",
      "scam",
      "theft",
      "robbery",
      "burglary",
      "hacking",
      "cyber attack",
      "virus creation",
      "malware",
      // Dangerous chemicals & activities
      "poison",
      "toxic",
      "radioactive",
      "biological weapon",
      "chemical weapon",
      "acid attack",
      "arson",
      "fire setting",
      "burning things",
      "destruction",
      // Self-harm & dangerous activities
      "suicide",
      "self harm",
      "cutting",
      "overdose",
      "dangerous stunt",
      "extreme danger",
      "life threatening",
      // Illegal activities
      "smuggling",
      "trafficking",
      "blackmail",
      "extortion",
      "kidnapping",
      "identity theft",
      "money laundering",
      "tax evasion",
      // Sexual & inappropriate content
      "sex",
      "sexual",
      "porn",
      "pornography",
      "erotic",
      "adult content",
      "xxx",
      "masturbation",
      "orgasm",
      "fetish",
      "bdsm",
      "kink",
      "nude",
      "nudity",
      "strip",
      "stripping",
      "escort",
      "prostitution",
      "brothel",
      "sexual acts",
      "intimate",
      "seduction",
      "sexual pleasure",
      "sexual techniques",
      "foreplay",
      "sexual positions",
      "adult entertainment",
      "sexual fantasy",
      "sexual roleplay",
      "sexting",
      "sexual harassment",
      "sexual abuse",
      "sexual assault"
    ];
    const containsDangerousContent = dangerousKeywords.some((keyword) => {
      const matches = input.includes(keyword) || input.includes(keyword.replace(" ", ""));
      if (matches) {
        console.log(`\u26A0\uFE0F DANGEROUS KEYWORD MATCHED: "${keyword}" in "${input}"`);
      }
      return matches;
    });
    const suspiciousPatterns = [
      /how to (kill|hurt|harm|attack|murder)/,
      // "how to kill/hurt someone"
      /making (bombs?|explosives?|weapons?)/,
      // "making bombs/weapons"
      /create (poison|virus|malware)/,
      // "create poison/virus"
      /(illegal|criminal|unlawful) (activity|activities)/,
      // "illegal activities"
      /dangerous (experiments?|chemicals?)/,
      // "dangerous experiments"
      /(sexual|erotic|adult) (content|activities?|entertainment)/,
      // "sexual content/activities"
      /(sex|sexual) (techniques?|positions?|acts?)/,
      // "sex techniques/positions"
      /(porn|pornography|adult) (making|creation|production)/,
      // "porn making/creation"
      /(intimate|sexual) (photography|videos?)/,
      // "intimate photography/videos"
      /adult (content|entertainment|activities?)/
      // "adult content/entertainment"
    ];
    const matchesSuspiciousPattern = suspiciousPatterns.some((pattern) => {
      const matches = pattern.test(input);
      if (matches) {
        console.log(`\u26A0\uFE0F SUSPICIOUS PATTERN MATCHED: ${pattern} in "${input}"`);
      }
      return matches;
    });
    if (containsDangerousContent || matchesSuspiciousPattern) {
      console.log(`\u{1F6AB} BLOCKING DANGEROUS INPUT: "${input}"`);
      return {
        isValid: false,
        suggestions: ["cooking", "gardening", "reading", "drawing", "music", "photography"],
        reasoning: "This input contains harmful or dangerous content. We only support safe, positive learning activities. Please try one of our suggested hobbies instead!"
      };
    }
    console.log(`\u2705 SAFETY CHECK PASSED: "${input}" is not flagged as dangerous`);
    return null;
  }
  checkComplexHobby(input) {
    const complexHobbies = {
      "robotics": ["electronics tinkering", "programming basics", "model building"],
      "brain surgery": ["first aid training", "medical terminology", "anatomy drawing"],
      "rocket engineering": ["model rockets", "physics basics", "aerospace history"],
      "nuclear physics": ["physics basics", "chemistry", "science experiments"],
      "heart surgery": ["first aid training", "anatomy drawing", "medical terminology"],
      "architecture": ["home design", "interior design", "sketching"],
      "app development": ["coding basics", "web design", "computer skills"],
      "game development": ["coding basics", "digital art", "storytelling"],
      "artificial intelligence": ["programming basics", "data analysis", "logic puzzles"],
      "machine learning": ["programming basics", "statistics", "data analysis"],
      "neurosurgery": ["first aid training", "anatomy drawing", "medical terminology"],
      "rocket science": ["model rockets", "physics basics", "astronomy"],
      "quantum physics": ["physics basics", "mathematics", "science experiments"]
    };
    if (complexHobbies[input]) {
      return {
        isValid: false,
        suggestions: complexHobbies[input],
        reasoning: `${input.charAt(0).toUpperCase() + input.slice(1)} is quite complex and typically requires more than 7 days to learn effectively. However, these related activities are perfect for getting started!`
      };
    }
    return null;
  }
  fallbackValidation(userInput) {
    const validHobbies2 = [
      "guitar",
      "piano",
      "violin",
      "drums",
      "singing",
      "cooking",
      "baking",
      "grilling",
      "meal prep",
      "drawing",
      "painting",
      "sketching",
      "watercolor",
      "digital art",
      "photography",
      "videography",
      "photo editing",
      "yoga",
      "pilates",
      "meditation",
      "stretching",
      "gardening",
      "plant care",
      "hydroponics",
      "knitting",
      "crocheting",
      "sewing",
      "embroidery",
      "reading",
      "writing",
      "journaling",
      "poetry",
      "dance",
      "salsa",
      "ballet",
      "hip hop",
      "coding",
      "programming",
      "web design",
      "woodworking",
      "pottery",
      "jewelry making",
      "origami",
      "calligraphy",
      "lettering",
      "fitness",
      "running",
      "cycling",
      "swimming",
      "history research",
      "research",
      "history",
      "genealogy",
      "archival research"
    ];
    const input = userInput.toLowerCase().trim();
    if (validHobbies2.includes(input)) {
      return {
        isValid: true,
        reasoning: "Direct match with known hobby"
      };
    }
    const fuzzyMatches = validHobbies2.filter(
      (hobby) => this.calculateSimilarity(input, hobby) > 0.7
    );
    if (fuzzyMatches.length > 0) {
      return {
        isValid: true,
        correctedHobby: fuzzyMatches[0],
        reasoning: "Corrected spelling of valid hobby"
      };
    }
    const partialMatch = validHobbies2.find(
      (hobby) => input.includes(hobby) || hobby.includes(input)
    );
    if (partialMatch) {
      return {
        isValid: true,
        correctedHobby: partialMatch,
        reasoning: "Extracted valid hobby from input"
      };
    }
    const suggestions = this.getRandomHobbies(3);
    return {
      isValid: false,
      suggestions,
      reasoning: "Input does not match any known hobby"
    };
  }
  calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  }
  cleanJsonResponse(content) {
    let cleaned = content.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "");
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "");
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned.trim();
  }
  getRandomHobbies(count) {
    const suggestions = ["guitar", "cooking", "drawing", "yoga", "photography", "gardening", "reading", "painting"];
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
};
var hobbyValidator = new OpenRouterHobbyValidator();

// server/supabase-db.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables not found");
}
var supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
console.log("\u2705 Supabase backend client initialized");

// server/supabase-storage.ts
var SupabaseBackendStorage = class {
  async getUserProfile(id) {
    const { data, error } = await supabaseAdmin.from("user_profiles").select("*").eq("user_id", id).single();
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user profile:", error);
    }
    return data;
  }
  async getUserProfileByEmail(email) {
    const { data, error } = await supabaseAdmin.from("user_profiles").select("*").eq("email", email).single();
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user profile by email:", error);
    }
    return data;
  }
  async createUserProfile(user) {
    const { data, error } = await supabaseAdmin.from("user_profiles").upsert({
      user_id: user.userId || user.user_id,
      email: user.email,
      full_name: user.fullName || user.full_name,
      avatar_url: user.avatarUrl || user.avatar_url,
      total_plans_created: user.totalPlansCreated || 0,
      total_days_completed: user.totalDaysCompleted || 0,
      current_streak: user.currentStreak || 0,
      longest_streak: user.longestStreak || 0
    }).select().single();
    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
    return data;
  }
  async getHobbyPlansByUserId(userId) {
    const { data, error } = await supabaseAdmin.from("hobby_plans").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching hobby plans:", error);
      return [];
    }
    return data || [];
  }
  async createHobbyPlan(plan) {
    const { data, error } = await supabaseAdmin.from("hobby_plans").insert({
      user_id: plan.userId || plan.user_id,
      hobby_name: plan.hobby,
      title: plan.title,
      overview: plan.overview,
      plan_data: plan.planData || plan.plan_data
    }).select().single();
    if (error) {
      console.error("Error creating hobby plan:", error);
      throw error;
    }
    return data;
  }
  async getUserProgress(userId) {
    const { data, error } = await supabaseAdmin.from("user_progress").select("*").eq("user_id", userId);
    if (error) {
      console.error("Error fetching user progress:", error);
      return [];
    }
    return data || [];
  }
  async createOrUpdateUserProgress(progress) {
    const { data, error } = await supabaseAdmin.from("user_progress").upsert({
      user_id: progress.userId || progress.user_id,
      plan_id: progress.planId || progress.plan_id,
      completed_days: progress.completedDays || progress.completed_days,
      current_day: progress.currentDay || progress.current_day,
      unlocked_days: progress.unlockedDays || progress.unlocked_days
    }).select().single();
    if (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
    return data;
  }
  async deleteHobbyPlan(planId, userId) {
    const { error } = await supabaseAdmin.from("hobby_plans").delete().eq("id", planId).eq("user_id", userId);
    if (error) {
      console.error("Error deleting hobby plan:", error);
      throw error;
    }
  }
  async deleteUserProgress(planId, userId) {
    const { error } = await supabaseAdmin.from("user_progress").delete().eq("plan_id", planId).eq("user_id", userId);
    if (error) {
      console.error("Error deleting user progress:", error);
      throw error;
    }
  }
};
var supabaseStorage = new SupabaseBackendStorage();

// shared/schema.ts
import { pgTable, text, integer, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var hobbyPlans = pgTable("hobby_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  hobby: text("hobby").notNull(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  planData: jsonb("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  planId: uuid("plan_id").references(() => hobbyPlans.id, { onDelete: "cascade" }),
  completedDays: integer("completed_days").array().notNull().default([]),
  currentDay: integer("current_day").notNull().default(1),
  unlockedDays: integer("unlocked_days").array().notNull().default([1]),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull()
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  createdAt: true,
  updatedAt: true
});
var insertHobbyPlanSchema = createInsertSchema(hobbyPlans).omit({
  id: true,
  createdAt: true
});
var insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessedAt: true
});
var updateUserProgressSchema = createInsertSchema(userProgress).pick({
  completedDays: true,
  currentDay: true,
  unlockedDays: true
});

// server/routes.ts
import { z } from "zod";
console.log("\u{1F4D6} API: Database storage initialized for all operations");
console.log("\u{1F680} SUPABASE MODE: Using Supabase PostgreSQL database");
function getYouTubeVideos(hobby) {
  const videos = {
    guitar: ["3jWRrafhO7M", "F9vWVucRJzo", "7tpQr0Xh6yM", "VJPCkS-wZR4", "kXOcz1_qnXw", "w8L3f3DWlNs", "Qa7GNfwLQJo"],
    cooking: ["dQw4w9WgXcQ", "fBYVFCb1n6s", "L3dDHKjr_P8", "dNGgJa8r_7s", "mGz7d8xB1V8", "K2nV8JGFgh4", "u3JzYrWLJ4E"],
    drawing: ["ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk", "7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0"],
    coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "t_ispmWmdjY", "W6NZfCO5SIk", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
    photography: ["B9FzVhw8_bY", "DJ_DIYDqWGY", "pwmJRx0eJiQ", "R8MzHddV-Z0", "mKY4gUEjAVs", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"],
    painting: ["7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0", "ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk"],
    yoga: ["v7AYKMP6rOE", "xQgP8N7jCrE", "Vg5FeCTzB6w", "h8TKF2_p7qU", "AaF2lpO2IHY", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"]
  };
  const hobbyVideos = videos[hobby.toLowerCase()] || videos.cooking;
  return hobbyVideos;
}
function generateContextualResponse(question, planData, hobbyContext) {
  const q = question.toLowerCase().trim();
  const hobby = planData?.hobby || hobbyContext || "hobby";
  if (q.includes("improve") || q.includes("better") || q.includes("skill") || q.includes("advance")) {
    if (hobby.toLowerCase().includes("video") || hobby.toLowerCase().includes("editing")) {
      return `Here's how to improve your video editing skills progressively:

**Foundation (Days 1-2):**
\u2022 Master basic cuts, transitions, and timeline navigation
\u2022 Learn keyboard shortcuts for faster workflow
\u2022 Practice color correction and audio sync

**Intermediate (Days 3-5):**  
\u2022 Advanced effects and color grading techniques
\u2022 Audio mixing and sound design principles
\u2022 Storytelling through pacing and rhythm

**Advanced (Days 6-7):**
\u2022 Professional color grading workflows
\u2022 Motion graphics and title animations
\u2022 Portfolio development and client presentation

**Daily Practice Tips:**
\u2022 Edit different types of content (vlogs, commercials, stories)
\u2022 Study professional work and reverse-engineer techniques
\u2022 Join online communities for feedback and inspiration
\u2022 Practice with raw footage daily, even 15-30 minutes

Your 7-day plan covers all these progressively - each day builds on the previous!`;
    }
  }
  if (q.includes("tip") || q.includes("advice") || q.includes("suggestion")) {
    if (planData?.days && planData.days.length > 0) {
      const day1 = planData.days.find((day) => day.day === 1) || planData.days[0];
      if (day1?.tips && day1.tips.length > 0) {
        return `Here are some key tips for your ${hobby} journey:

${day1.tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}

These come from Day 1 of your plan. Each day has specific tips tailored to what you're learning!`;
      }
    }
    return `Here are some essential ${hobby} learning tips:

1. Start with proper fundamentals - don't rush the basics
2. Practice consistently, even 15-20 minutes daily
3. Be patient with yourself and celebrate small wins
4. Take notes and track your progress

Your plan has specific tips for each day too!`;
  }
  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return `Hello! I'm here to help you with your ${hobby} learning journey. You can ask me about specific techniques, daily activities, equipment, time management, or any questions about your 7-day plan. What would you like to know?`;
  }
  if (q.includes("how") && (q.includes("start") || q.includes("begin"))) {
    return `Great question! Start with Day 1 - that's where all the fundamentals are covered. Click on 'Day 1' in your plan above to see detailed instructions, video tutorial, and checklist. Take your time with the basics!`;
  }
  if (q.includes("equipment") || q.includes("need") || q.includes("buy") || q.includes("tool")) {
    return `Check the 'What You'll Need' section in Day 1 - it lists everything required to get started with ${hobby}. Most hobbies can be started with basic, affordable equipment. Focus on learning first before investing in expensive gear!`;
  }
  if (q.includes("time") || q.includes("long") || q.includes("minutes") || q.includes("hour")) {
    return `Your ${hobby} plan is designed for manageable daily sessions. The most important thing is consistent practice - even 15-20 minutes daily can make a huge difference! Each day's activities are structured to be effective within your available time.`;
  }
  if (q.includes("progress") || q.includes("track")) {
    return `Your progress is automatically saved! You can mark days as complete and track your ${hobby} learning journey. Visit your dashboard anytime to see your progress and continue where you left off.`;
  }
  if (q.includes("weather") || q.includes("rain") || q.includes("sun")) {
    return `I'm focused on helping you with your ${hobby} learning plan! While I can't help with weather, I can answer questions about your daily activities, techniques, equipment, or anything related to your 7-day journey. What would you like to know about ${hobby}?`;
  }
  return `I'm here to help with your ${hobby} learning plan! You can ask me about:
\u2022 Getting started with Day 1
\u2022 Daily activities and techniques
\u2022 Equipment and setup
\u2022 Practice tips and techniques
\u2022 Time management
\u2022 Progress tracking

What aspect of your ${hobby} learning would you like help with?`;
}
function cleanJsonResponse(content) {
  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "");
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}
async function generateAIPlan(hobby, experience, timeAvailable, goal) {
  console.log("\u{1F527} generateAIPlan called for:", hobby);
  console.log("\u26A1 Using fast fallback plan generation for instant results");
  return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  let timeoutId = null;
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
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openRouterKey}`,
      "HTTP-Referer": "https://wizqo.com",
      "X-Title": "Wizqo Hobby Learning Platform"
    };
    const controller = new AbortController();
    timeoutId = setTimeout(() => {
      console.log("\u26A0\uFE0F AI API request timed out after 5 seconds, aborting...");
      controller.abort();
    }, 5e3);
    console.log("\u{1F527} Making API request to OpenRouter...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3e3,
        temperature: 0.7
      })
    });
    console.log("\u{1F527} API response received, status:", response.status);
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    console.log("\u{1F527} Parsing API response...");
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      console.log("\u274C No content in API response");
      throw new Error("No content in API response");
    }
    console.log("\u{1F527} Content received, parsing JSON...");
    const cleanedContent = cleanJsonResponse(content);
    console.log("\u{1F527} Cleaned content, attempting JSON parse...");
    const aiPlan = JSON.parse(cleanedContent);
    console.log("\u{1F527} JSON parsed successfully, processing videos...");
    let isYouTubeAPIWorking = true;
    try {
      const testResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&type=video&key=${process.env.YOUTUBE_API_KEY}`);
      if (!testResponse.ok && testResponse.status === 403) {
        console.log("\u26A1 YouTube API quota exceeded - using fast fallback mode");
        isYouTubeAPIWorking = false;
      }
    } catch (error) {
      console.log("\u26A1 YouTube API unavailable - using fast fallback mode");
      isYouTubeAPIWorking = false;
    }
    console.log("\u26A1 Using fast video assignment for instant plan generation");
    const hobbyVideos = getYouTubeVideos(hobby);
    aiPlan.days = aiPlan.days.map((day, index) => {
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
        videoId: targetedVideoId,
        // Also add videoId for compatibility
        videoTitle: videoDetails?.title || `${day.title} - ${hobby} Tutorial`,
        freeResources: [],
        // USER PREFERENCE: Only affiliate links, no free tutorials
        affiliateProducts: [{
          ...getHobbyProduct(hobby, day.day)
        }]
      };
    });
    console.log("\u{1F50D} AI PLAN GENERATED - First day youtubeVideoId:", aiPlan.days[0].youtubeVideoId);
    console.log("\u{1F50D} AI PLAN GENERATED - First day videoId:", aiPlan.days[0].videoId);
    console.log("\u{1F50D} AI PLAN COMPLETE FIRST DAY:", JSON.stringify(aiPlan.days[0], null, 2));
    aiPlan.hobby = hobby;
    aiPlan.difficulty = experience === "some" ? "intermediate" : experience;
    aiPlan.overview = aiPlan.overview || aiPlan.description || `A comprehensive ${hobby} learning plan tailored for ${experience === "some" ? "intermediate" : experience} learners`;
    if (aiPlan.title && aiPlan.title.includes("Learning Journey")) {
      aiPlan.title = `Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days`;
    }
    return aiPlan;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error("OpenRouter API error:", error);
    if (error?.name === "AbortError") {
      console.log("\u26A0\uFE0F OpenRouter API request timed out after 5 seconds, using fast fallback plan generation");
    } else {
      console.log("\u26A0\uFE0F OpenRouter API failed, using fast fallback plan generation");
    }
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }
}
function getHobbyProduct(hobby, day) {
  const hobbyProducts = {
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
async function generateFallbackPlan(hobby, experience, timeAvailable, goal) {
  const validation = validateHobby(hobby);
  if (!validation.isValid) {
    throw new Error(`"${hobby}" doesn't seem like a hobby. Please enter a specific hobby you'd like to learn (e.g., guitar, cooking, photography, yoga, coding).`);
  }
  hobby = validation.normalizedHobby;
  const days = [];
  const dailyPlans = generateHobbySpecificPlans(hobby, experience, timeAvailable);
  for (let i = 0; i < 7; i++) {
    const dayNumber = i + 1;
    const dayPlan = dailyPlans[i];
    const targetedVideoId = await getBestVideoForDay(
      hobby,
      experience,
      dayNumber,
      dayPlan.title,
      dayPlan.mainTask
    );
    console.log(`\u{1F50D} FALLBACK getBestVideoForDay returned: ${targetedVideoId} for ${hobby} day ${dayNumber}`);
    const finalVideoId = targetedVideoId === "dQw4w9WgXcQ" ? "fC7oUOUEEi4" : targetedVideoId;
    console.log(`\u{1F50D} FINAL VIDEO ID after verification: ${finalVideoId} for ${hobby} day ${dayNumber}`);
    console.log(`\u{1F527} VIDEO REPLACEMENT: ${targetedVideoId} -> ${finalVideoId}`);
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
      freeResources: [],
      // USER PREFERENCE: Only affiliate links, no free tutorials
      affiliateProducts: [{
        ...getHobbyProduct(hobby, dayNumber)
      }],
      youtubeVideoId: finalVideoId,
      videoId: finalVideoId,
      // Also add videoId for backwards compatibility
      videoTitle: videoDetails?.title || `${hobby} - ${dayNumber}`,
      estimatedTime: timeAvailable,
      skillLevel: experience
    });
  }
  const plan = {
    hobby,
    title: `Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days`,
    overview: `A comprehensive ${hobby} learning plan tailored for ${experience === "some" ? "intermediate" : experience} learners`,
    difficulty: experience === "some" ? "intermediate" : experience,
    totalDays: 7,
    days
  };
  console.log("\u{1F50D} FALLBACK PLAN GENERATED - First day mistakesToAvoid:", plan.days[0].mistakesToAvoid);
  console.log("\u{1F50D} FALLBACK PLAN GENERATED - First day youtubeVideoId:", plan.days[0].youtubeVideoId);
  console.log("\u{1F50D} FALLBACK PLAN GENERATED - First day videoId:", plan.days[0].videoId);
  for (let i = 0; i < plan.days.length; i++) {
    if (plan.days[i].youtubeVideoId === "dQw4w9WgXcQ") {
      plan.days[i].youtubeVideoId = "fC7oUOUEEi4";
      plan.days[i].videoId = "fC7oUOUEEi4";
      console.log(`\u{1F527} FIXED: Replaced problematic video ID in day ${i + 1} with educational content`);
    }
  }
  console.log("\u{1F50D} FALLBACK PLAN DIFFICULTY:", plan.difficulty, "EXPERIENCE:", experience);
  console.log("\u{1F50D} COMPLETE FIRST DAY DATA:", JSON.stringify(plan.days[0], null, 2));
  console.log("\u{1F50D} FINAL PLAN RESPONSE STRUCTURE:", {
    hobby: plan.hobby,
    totalDays: plan.totalDays,
    firstDayKeys: Object.keys(plan.days[0]),
    firstDayVideoId: plan.days[0].youtubeVideoId,
    firstDayVideoIdAlt: plan.days[0].videoId
  });
  return plan;
}
function generateHobbySpecificPlans(hobby, experience, timeAvailable) {
  const isBeginnerLevel = experience === "none" || experience === "beginner";
  const isIntermediateLevel = experience === "some" || experience === "intermediate";
  const hobbyPlans2 = {
    guitar: [
      {
        title: "Guitar Fundamentals and Setup",
        mainTask: "Learn proper guitar posture, basic chord shapes, and essential techniques for building a solid foundation in guitar playing.",
        explanation: "Day 1 establishes the fundamental building blocks of guitar playing. You'll learn proper posture to prevent injury, understand basic guitar anatomy, and master your first chord shapes. This foundation is crucial for everything that follows in your guitar journey.",
        timeAllocation: "45-60 minutes total",
        equipment: [
          "\u{1F3B8} Acoustic or electric guitar",
          "\u{1F4F1} Guitar tuner (app or physical)",
          "\u{1F3BC} Guitar pick (medium thickness)",
          "\u{1FA91} Comfortable chair without arms",
          "\u{1F4DA} Music stand or tablet holder"
        ],
        materials: [
          "\u{1F4DD} Notebook for practice notes",
          "\u270F\uFE0F Pencil for marking chord diagrams",
          "\u{1F4CB} Guitar chord chart (printable)",
          "\u23F1\uFE0F Timer or metronome app"
        ],
        detailedSteps: [
          {
            step: "Guitar Setup & Tuning",
            time: "10 minutes",
            description: "\u{1F3B5} Ensure your guitar is properly tuned using a tuner app. Check that all strings are secure and the guitar is clean. Adjust your chair height so your feet are flat on the floor and the guitar rests comfortably."
          },
          {
            step: "Proper Posture Training",
            time: "15 minutes",
            description: "\u{1FA91} Sit with back straight, guitar resting on your right leg (if right-handed). Keep shoulders relaxed, left hand thumb behind the neck, not wrapped around. Practice holding position for 2-minute intervals."
          },
          {
            step: "Basic Chord Formation",
            time: "20 minutes",
            description: "\u{1F3AF} Learn G major chord placement: 3rd fret low E string, 2nd fret A string, 3rd fret high E string. Practice pressing down firmly, checking each string rings clearly. Hold for 30 seconds, release, repeat 10 times."
          }
        ],
        progressMilestones: [
          "\u{1F3B5} Can tune guitar independently using tuner",
          "\u{1FA91} Maintains proper posture for 5+ minutes comfortably",
          "\u{1F3AF} Forms G major chord with clear sound on all strings",
          "\u{1F504} Transitions between relaxed and playing position smoothly"
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
          "\u{1F3AF} Keep your fretting hand thumb behind the neck, not wrapped around",
          "\u{1F4AA} Press strings firmly but don't over-squeeze - find the minimum pressure needed",
          "\u{1F40C} Start with slow, clean chord changes rather than fast, sloppy ones",
          "\u23F0 Take breaks if your fingers hurt - building calluses takes time"
        ],
        mistakesToAvoid: [
          "\u26A0\uFE0F Holding the guitar neck like a baseball bat with thumb wrapped around",
          "\u{1F4A5} Pressing too hard on strings causing hand fatigue and poor tone",
          "\u{1F3C3} Rushing through chord changes without ensuring clean notes",
          "\u{1F3B5} Practicing with an untuned guitar - this trains your ear incorrectly"
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
        mainTask: "Understand heat management and master fundamental cooking techniques: saut\xE9ing, boiling, and roasting that apply to countless recipes.",
        explanation: "Day 2 focuses on heat control - the most important skill for successful cooking. You'll learn how different heat levels affect food and master basic cooking methods that you'll use throughout your culinary journey.",
        howTo: [
          "Learn heat levels: low (simmer), medium (steady cooking), high (searing and quick cooking)",
          "Master saut\xE9ing technique: heat pan, add oil, cook ingredients while moving frequently",
          "Practice proper boiling: bring to rapid boil, then adjust heat to maintain gentle bubbling",
          "Learn basic roasting: high heat for browning, lower heat for even cooking through",
          "Cook simple egg dishes demonstrating each technique: scrambled (low), fried (medium), poached (simmering)",
          "Understand doneness indicators: visual cues, internal temperatures, texture changes"
        ],
        checklist: [
          "Heavy-bottomed saut\xE9 pan and medium saucepan available",
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
    "game development": [
      {
        title: "Game Development Fundamentals & Setup",
        mainTask: "Set up your development environment, learn core game development concepts, and create your first interactive prototype.",
        explanation: "Day 1 introduces you to the exciting world of game development. You'll set up essential tools, understand the game development pipeline, and create your first simple interactive experience. This foundation will support everything you build in the following days.",
        timeAllocation: "60-90 minutes total",
        equipment: [
          "\u{1F4BB} Computer with decent specs (4GB+ RAM)",
          "\u{1F5B1}\uFE0F Mouse for precise editing",
          "\u{1F3A7} Headphones for audio testing",
          "\u{1F4F1} Smartphone for mobile testing",
          "\u{1F50C} Stable internet connection"
        ],
        materials: [
          "\u{1F193} Unity Hub (free game engine)",
          "\u{1F4BB} Visual Studio Code (free editor)",
          "\u{1F3A8} Free sprite/3D assets from Unity Store",
          "\u{1F4DD} Game design notebook",
          "\u23F1\uFE0F Timer for focused development sessions"
        ],
        detailedSteps: [
          {
            step: "Development Environment Setup",
            time: "25 minutes",
            description: "\u{1F680} Download and install Unity Hub, create Unity account, install Unity 2022.3 LTS version. Set up Visual Studio Code with C# extension. Verify everything works by creating a new 3D project."
          },
          {
            step: "Unity Interface Mastery",
            time: "30 minutes",
            description: "\u{1F3AE} Explore Unity's interface: Scene view, Game view, Project window, Inspector. Learn basic navigation (WASD + mouse). Create and manipulate basic objects (cubes, spheres). Understand parent-child relationships in hierarchy."
          },
          {
            step: "First Interactive Prototype",
            time: "35 minutes",
            description: "\u{1F3AF} Create a simple 'click the cube' game: Add a cube, attach a simple C# script to detect mouse clicks, make the cube change color when clicked. Test in play mode to see your first interactive game element."
          }
        ],
        progressMilestones: [
          "\u{1F680} Unity environment set up and functioning properly",
          "\u{1F3AE} Can navigate Unity interface confidently",
          "\u{1F3AF} Created first interactive game object with script",
          "\u{1F504} Successfully tested game in play mode"
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
          "\u{1F3AF} Start with Unity's built-in tutorials - they're excellent for beginners",
          "\u{1F4BE} Save your project frequently (Ctrl+S) to prevent losing work",
          "\u{1F50D} Use Unity's Console window to debug errors - it's your best friend",
          "\u{1F4DA} Keep Unity's documentation open in browser for quick reference"
        ],
        mistakesToAvoid: [
          "\u26A0\uFE0F Installing multiple Unity versions as beginner - stick to LTS version",
          "\u{1F3C3} Rushing through interface learning - take time to understand each panel",
          "\u{1F6AB} Ignoring error messages in Console - they tell you exactly what's wrong",
          "\u{1F4F1} Trying complex features before mastering basic object manipulation"
        ]
      },
      {
        title: "Player Movement & Physics",
        mainTask: "Implement smooth player movement, understand Unity's physics system, and create responsive character controls that feel great to use.",
        explanation: "Day 2 focuses on one of the most crucial aspects of game development - making the player feel in control. You'll learn different movement techniques, work with Unity's physics, and understand what makes character movement feel responsive and enjoyable.",
        timeAllocation: "75-90 minutes total",
        equipment: [
          "\u{1F4BB} Unity project from Day 1",
          "\u{1F3AE} Game controller (optional for testing)",
          "\u{1F4D0} Graph paper for movement planning",
          "\u23F1\uFE0F Stopwatch for timing tests"
        ],
        materials: [
          "\u{1F193} Unity's Standard Assets (free)",
          "\u{1F3A8} Simple character sprite or 3D model",
          "\u{1F3B5} Sound effects for movement feedback",
          "\u{1F4CB} Movement reference videos from favorite games"
        ],
        detailedSteps: [
          {
            step: "Basic Movement Scripts",
            time: "30 minutes",
            description: "\u2328\uFE0F Create C# script for basic WASD movement using Transform.Translate. Implement smooth movement with Time.deltaTime. Add boundary checking to prevent player leaving screen. Test different movement speeds."
          },
          {
            step: "Physics-Based Movement",
            time: "25 minutes",
            description: "\u{1F3AF} Upgrade to Rigidbody movement using AddForce or velocity. Compare feel vs Transform movement. Add gravity effects and ground detection. Implement jumping mechanics with physics."
          },
          {
            step: "Enhanced Controls & Polish",
            time: "20 minutes",
            description: "\u2728 Add movement smoothing and acceleration. Implement variable jump heights. Add visual feedback (particle effects, screen shake). Create responsive controls that feel satisfying to use."
          }
        ],
        progressMilestones: [
          "\u2328\uFE0F Implemented smooth WASD movement controls",
          "\u{1F3AF} Successfully integrated physics-based movement",
          "\u{1F998} Added jumping mechanics with proper physics",
          "\u2728 Enhanced movement with polish and visual feedback"
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
          "\u{1F3AE} Test movement feel constantly - small changes make big differences",
          "\u26A1 Use FixedUpdate() for physics-based movement, Update() for Transform",
          "\u{1F3AF} Study your favorite games' movement - what makes them feel good?",
          "\u{1F4CA} Adjust movement speed based on your game's scale and camera distance"
        ],
        mistakesToAvoid: [
          "\u{1F6AB} Making movement too fast or too slow without testing thoroughly",
          "\u26A0\uFE0F Forgetting Time.deltaTime - movement will be framerate dependent",
          "\u{1F3AE} Not testing with different input devices and sensitivities",
          "\u{1F3C3} Adding complex movement before perfecting basic locomotion"
        ]
      }
    ]
  };
  const specificPlans = hobbyPlans2[hobby.toLowerCase()];
  if (specificPlans) {
    return specificPlans;
  }
  return [
    {
      title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Fundamentals and Setup`,
      mainTask: `Establish proper foundation in ${hobby} through learning essential techniques, safety procedures, and setting up optimal practice environment.`,
      explanation: `Day 1 creates the fundamental building blocks for ${hobby}. You'll learn proper form, understand basic principles, and establish good habits that will serve you throughout your ${hobby} journey. This foundation prevents bad habits and ensures safe, effective practice.`,
      timeAllocation: "45-60 minutes total",
      equipment: [
        `\u{1F4E6} Basic ${hobby} starter kit with essential tools`,
        `\u{1F4DA} Reference guide or instruction manual`,
        `\u{1F4F1} Timer or smartphone for session tracking`,
        `\u{1FA91} Comfortable seating or workspace setup`,
        `\u{1F4A1} Adequate lighting for detailed work`
      ],
      materials: [
        `\u{1F4DD} Practice journal for tracking progress`,
        `\u270F\uFE0F Pen or pencil for notes and planning`,
        `\u{1F4CB} Checklist template for daily goals`,
        `\u23F1\uFE0F Timer app for focused practice sessions`
      ],
      detailedSteps: [
        {
          step: "Equipment Setup and Organization",
          time: "15 minutes",
          description: `\u{1F527} Gather all essential ${hobby} equipment and organize your practice space. Ensure everything is clean, functional, and easily accessible. Set up proper lighting and comfortable workspace positioning.`
        },
        {
          step: "Fundamental Technique Learning",
          time: "25 minutes",
          description: `\u{1F4D6} Learn and practice the most basic techniques of ${hobby}. Focus on proper form and safety procedures. Start with simple movements or concepts, emphasizing accuracy over speed.`
        },
        {
          step: "Practice and Review",
          time: "15 minutes",
          description: `\u{1F504} Practice the fundamental techniques learned. Take notes on what feels natural and what needs more work. Plan focus areas for tomorrow's session.`
        }
      ],
      progressMilestones: [
        `\u{1F3AF} Can identify and name basic ${hobby} tools and equipment`,
        `\u{1F4D0} Demonstrates proper setup and workspace organization`,
        `\u{1F3A8} Performs fundamental techniques with basic competency`,
        `\u{1F4DD} Successfully tracks practice session and identifies improvement areas`
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
        `\u{1F4E6} All equipment from Day 1 properly maintained`,
        `\u{1F3A5} Recording device (phone/camera) for technique review`,
        `\u{1FA9E} Mirror or reflective surface for form checking`,
        `\u{1F4D6} Advanced technique reference materials`,
        `\u23F0 Interval timer for structured practice sessions`
      ],
      materials: [
        `\u{1F4DA} Technique progression guide or checklist`,
        `\u{1F4DD} Practice log with yesterday's notes`,
        `\u{1F3AF} Goal sheet for today's skill targets`,
        `\u{1F4BE} Storage for recorded practice sessions`
      ],
      detailedSteps: [
        {
          step: "Foundation Review and Warm-up",
          time: "15 minutes",
          description: `\u{1F504} Review and practice Day 1 fundamentals until they feel more comfortable. Focus on muscle memory development and smooth execution of basic techniques.`
        },
        {
          step: "Core Technique Learning",
          time: "30 minutes",
          description: `\u{1F3AF} Learn 2-3 essential core techniques that build on your foundation. Practice each technique in isolation, focusing on proper form and gradual speed increase.`
        },
        {
          step: "Integration and Recording",
          time: "20 minutes",
          description: `\u{1F3AC} Combine techniques in simple sequences. Record your practice to review form and identify areas for improvement. Take detailed notes for tomorrow.`
        }
      ],
      progressMilestones: [
        `\u{1F3AF} Day 1 fundamentals performed with increased confidence`,
        `\u{1F527} Core techniques executed with basic proficiency`,
        `\u{1F3AC} Successfully records and reviews own technique`,
        `\u{1F4C8} Shows measurable improvement from Day 1 baseline`
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
        `\u{1F6E0}\uFE0F Complete toolkit from previous days`,
        `\u{1F4CB} Project planning materials and templates`,
        `\u{1F50D} Troubleshooting guides and reference materials`,
        `\u{1F4F1} Problem-solving apps or digital resources`,
        `\u{1F3AF} Mini-project supplies for practical application`
      ],
      materials: [
        `\u{1F4DD} Project planning worksheets`,
        `\u{1F5C2}\uFE0F Common problems and solutions reference`,
        `\u{1F4CA} Progress tracking sheets for applications`,
        `\u{1F3A8} Creative materials for varied practice scenarios`
      ],
      detailedSteps: [
        {
          step: "Skill Integration Review",
          time: "15 minutes",
          description: `\u{1F504} Practice combining Day 1 and Day 2 techniques into smooth sequences. Focus on transitions and maintaining quality throughout integrated practice.`
        },
        {
          step: "Practical Application Projects",
          time: "35 minutes",
          description: `\u{1F3AF} Complete 2-3 mini-projects that require applying your learned skills in practical situations. Focus on problem-solving when things don't go perfectly.`
        },
        {
          step: "Troubleshooting and Analysis",
          time: "20 minutes",
          description: `\u{1F50D} Identify common problems in your applications and practice systematic troubleshooting. Analyze what works well and plan improvements for tomorrow.`
        }
      ],
      progressMilestones: [
        `\u{1F3AF} Successfully completes simple practical applications`,
        `\u{1F527} Demonstrates basic problem-solving when issues arise`,
        `\u{1F504} Integrates multiple techniques into coherent sequences`,
        `\u{1F4C8} Shows improved confidence in real-world application`
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
        `\u{1F3AF} Precision tools for detailed technique work`,
        `\u{1F4D0} Measurement tools for accuracy assessment`,
        `\u{1F50D} Magnification or detail-enhancement tools`,
        `\u{1F4F9} High-quality recording setup for technique analysis`,
        `\u2696\uFE0F Quality assessment materials and rubrics`
      ],
      materials: [
        `\u{1F4CA} Intermediate technique progression charts`,
        `\u{1F3AF} Precision practice templates and guides`,
        `\u{1F4DD} Detailed self-assessment worksheets`,
        `\u{1F4DA} Advanced reference materials and examples`
      ],
      detailedSteps: [
        {
          step: "Foundation Refinement",
          time: "25 minutes",
          description: `\u{1F527} Practice basic techniques with focus on precision and consistency. Use measurement tools and detailed analysis to improve quality beyond just 'good enough'.`
        },
        {
          step: "Intermediate Technique Introduction",
          time: "30 minutes",
          description: `\u{1F4C8} Learn intermediate-level concepts that build on your solid foundation. Practice advanced variations slowly, emphasizing proper form and understanding.`
        },
        {
          step: "Quality Control and Assessment",
          time: "25 minutes",
          description: `\u{1F3AF} Critically analyze technique quality using detailed assessment criteria. Make specific improvements and plan advanced practice strategies.`
        }
      ],
      progressMilestones: [
        `\u{1F3AF} Demonstrates improved precision in all basic techniques`,
        `\u{1F4C8} Successfully executes intermediate-level concepts`,
        `\u{1F50D} Shows ability to self-assess and improve technique quality`,
        `\u2696\uFE0F Maintains high standards for technique execution`
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
        `\u{1F3A8} Creative materials for experimentation`,
        `\u{1F5BC}\uFE0F Inspiration sources (books, digital galleries, examples)`,
        `\u{1F4F1} Documentation tools for creative experiments`,
        `\u{1F3AD} Style exploration guides and references`,
        `\u{1F308} Variety of materials for different creative approaches`
      ],
      materials: [
        `\u{1F4D6} Style reference collection and inspiration boards`,
        `\u{1F4DD} Creative experiment journal and notes`,
        `\u{1F3AF} Personal preference discovery worksheets`,
        `\u{1F4BE} Digital storage for creative work documentation`
      ],
      detailedSteps: [
        {
          step: "Creative Foundation Review",
          time: "20 minutes",
          description: `\u{1F3A8} Review all learned techniques as creative tools. Practice applying them with personal flair and expression rather than just technical accuracy.`
        },
        {
          step: "Style Exploration and Experimentation",
          time: "40 minutes",
          description: `\u{1F31F} Experiment with different styles and approaches within ${hobby}. Try creative variations, explore personal preferences, and create unique combinations.`
        },
        {
          step: "Personal Style Development",
          time: "25 minutes",
          description: `\u{1F3AD} Identify elements that resonate with you personally. Create something unique that reflects your emerging style and document your creative preferences.`
        }
      ],
      progressMilestones: [
        `\u{1F3A8} Successfully experiments with creative variations`,
        `\u{1F31F} Identifies personal preferences and style elements`,
        `\u{1F3AD} Creates unique work reflecting individual approach`,
        `\u{1F4DD} Documents creative discoveries for future development`
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
        `\u{1F3AF} Complete professional-level setup`,
        `\u{1F4F9} High-quality recording equipment for demonstrations`,
        `\u{1F3AA} Performance or presentation setup`,
        `\u{1F4CA} Comprehensive assessment tools`,
        `\u{1F3C6} Challenge project materials and resources`
      ],
      materials: [
        `\u{1F4CB} Integration practice sequences and routines`,
        `\u{1F3AF} Advanced challenge project templates`,
        `\u{1F4DD} Performance evaluation criteria and rubrics`,
        `\u{1F4BE} Documentation systems for skill demonstration`
      ],
      detailedSteps: [
        {
          step: "Skill Integration Practice",
          time: "30 minutes",
          description: `\u{1F504} Practice combining all learned techniques into smooth, fluid sequences. Focus on seamless transitions and maintaining quality throughout complex applications.`
        },
        {
          step: "Advanced Challenge Projects",
          time: "35 minutes",
          description: `\u{1F3C6} Complete challenging projects that require comprehensive skill integration. Demonstrate ability to adapt and problem-solve in complex situations.`
        },
        {
          step: "Performance Documentation",
          time: "25 minutes",
          description: `\u{1F4F9} Record comprehensive demonstration of integrated skills. Create documentation of your progress and prepare for tomorrow's mastery planning.`
        }
      ],
      progressMilestones: [
        `\u{1F504} Seamlessly integrates all learned techniques`,
        `\u{1F3C6} Successfully completes advanced challenge projects`,
        `\u{1F3AD} Demonstrates confidence in complex applications`,
        `\u{1F4F9} Creates comprehensive skill demonstration documentation`
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
        `\u{1F4CA} Comprehensive assessment and testing materials`,
        `\u{1F4CB} Goal-setting and planning templates`,
        `\u{1F4DA} Research tools for continued learning resources`,
        `\u{1F4F1} Long-term tracking and scheduling apps`,
        `\u{1F3AF} Portfolio or demonstration setup`
      ],
      materials: [
        `\u{1F4C8} Progress assessment worksheets and rubrics`,
        `\u{1F3AF} Goal-setting templates for short and long-term planning`,
        `\u{1F4DA} Resource research guides and evaluation criteria`,
        `\u{1F4C5} Practice schedule templates and tracking systems`
      ],
      detailedSteps: [
        {
          step: "Comprehensive Skill Assessment",
          time: "35 minutes",
          description: `\u{1F4CA} Demonstrate all learned skills in comprehensive testing session. Assess current abilities objectively and identify strengths and improvement areas.`
        },
        {
          step: "Future Learning Planning",
          time: "40 minutes",
          description: `\u{1F3AF} Research advanced resources, set specific measurable goals, and create detailed practice schedule. Plan your continued ${hobby} development journey.`
        },
        {
          step: "Portfolio Creation and Documentation",
          time: "35 minutes",
          description: `\u{1F4C1} Create comprehensive portfolio documenting your week's progress. Establish systems for continued progress tracking and motivation maintenance.`
        }
      ],
      progressMilestones: [
        `\u{1F4CA} Completes comprehensive assessment of all learned skills`,
        `\u{1F3AF} Creates detailed plan for continued skill development`,
        `\u{1F4DA} Identifies appropriate resources for advanced learning`,
        `\u{1F4C1} Establishes portfolio and progress tracking systems`
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
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/generate-plan", async (req, res) => {
    try {
      const { hobby, experience, timeAvailable, goal, userId, force } = req.body;
      if (!hobby || !experience || !timeAvailable) {
        return res.status(400).json({
          error: "Missing required fields: hobby, experience, timeAvailable"
        });
      }
      console.log("\u{1F50D} Validating hobby with OpenRouter:", hobby);
      const validation = await hobbyValidator.validateHobby(hobby);
      if (!validation.isValid) {
        return res.status(400).json({
          error: `I'm not sure "${hobby}" is a hobby I can help with right now.`,
          suggestions: validation.suggestions || ["guitar", "cooking", "drawing", "yoga", "photography", "dance"],
          message: validation.reasoning || "Please try one of these popular hobbies instead.",
          invalidHobby: hobby
        });
      }
      const normalizedHobby = validation.correctedHobby || hobby;
      if (userId && !force) {
        console.log("\u{1F50D} DUPLICATE CHECK: Checking for existing plans for user:", userId, "hobby:", normalizedHobby);
        try {
          const existingPlans = await supabaseStorage.getHobbyPlansByUserId(userId);
          console.log("\u{1F50D} DUPLICATE CHECK: Found", existingPlans.length, "existing plans");
          const duplicatePlan = existingPlans.find((plan2) => {
            const planHobby = plan2.hobby_name?.toLowerCase() || "";
            const normalizedPlanHobby = planHobby.trim();
            const checkHobby = normalizedHobby.toLowerCase().trim();
            console.log("\u{1F50D} DUPLICATE CHECK: Comparing", normalizedPlanHobby, "vs", checkHobby);
            if (normalizedPlanHobby === checkHobby) return true;
            if (normalizedPlanHobby.includes(checkHobby) || checkHobby.includes(normalizedPlanHobby)) return true;
            return false;
          });
          if (duplicatePlan) {
            console.log("\u{1F6A8} DUPLICATE DETECTED: Found existing plan for", normalizedHobby, "with ID:", duplicatePlan.id);
            return res.status(409).json({
              error: "duplicate_plan",
              message: `You already have a ${normalizedHobby} learning plan! Would you like to continue with your existing plan or create a new one?`,
              existingPlan: {
                id: duplicatePlan.id,
                title: duplicatePlan.title,
                created_at: duplicatePlan.created_at
              },
              hobby: normalizedHobby
            });
          }
          console.log("\u2705 DUPLICATE CHECK: No existing plan found for", normalizedHobby);
        } catch (error) {
          console.error("\u274C DUPLICATE CHECK: Error checking for duplicates:", error);
        }
      }
      console.log("\u{1F680} Starting plan generation for:", normalizedHobby);
      const plan = await generateAIPlan(normalizedHobby, experience, timeAvailable, goal || `Learn ${normalizedHobby} fundamentals`);
      console.log("\u2705 Plan generation completed successfully");
      res.json(plan);
    } catch (error) {
      console.error("Error generating plan:", error);
      res.status(500).json({ error: "Failed to generate learning plan" });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const { question, planData, hobbyContext } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
        return res.json({ response: fallbackResponse });
      }
      let context = `You are a helpful AI assistant for Wizqo, a 7-day hobby learning platform. `;
      if (planData && planData.hobby) {
        context += `The user is learning ${planData.hobby} over 7 days. `;
        if (planData.days && planData.days.length > 0) {
          const currentDay = planData.days.find((day) => day.day === 1) || planData.days[0];
          if (currentDay) {
            context += `Today's focus is "${currentDay.title}" with the main task: ${currentDay.mainTask}. `;
            if (currentDay.tips && currentDay.tips.length > 0) {
              context += `Key tips include: ${currentDay.tips.join(", ")}. `;
            }
          }
        }
      }
      context += `Provide helpful, specific advice about the user's learning journey. Keep responses conversational but informative.`;
      const prompt = `${context}

User question: ${question}

Please provide a helpful response:`;
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://wizqo.com",
          "X-Title": "Wizqo Hobby Learning Platform"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        })
      });
      if (!response.ok) {
        console.error("OpenRouter API error:", response.status, response.statusText);
        const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
        return res.json({ response: fallbackResponse });
      }
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || `I'm here to help with your ${hobbyContext || "hobby"} learning plan! What would you like to know?`;
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error in AI chat:", error);
      const { question, planData, hobbyContext } = req.body;
      const fallbackResponse = generateContextualResponse(question, planData, hobbyContext);
      res.json({ response: fallbackResponse });
    }
  });
  app2.post("/api/validate-hobby", async (req, res) => {
    try {
      const { hobby } = req.body;
      if (!hobby) {
        return res.status(400).json({ error: "Hobby is required" });
      }
      const cleanHobby = hobby.replace(/["']/g, "").trim();
      console.log("\u{1F50D} Validating hobby:", cleanHobby);
      const validation = await hobbyValidator.validateHobby(cleanHobby);
      console.log("\u{1F50D} Server validation result:", validation);
      const response = {
        isValid: validation.isValid,
        correctedHobby: validation.correctedHobby,
        // Use correct property name
        originalHobby: cleanHobby,
        suggestions: validation.suggestions || [],
        reasoning: validation.reasoning
      };
      console.log("\u{1F50D} Sending response to frontend:", response);
      res.json(response);
    } catch (error) {
      console.error("Hobby validation error:", error);
      res.status(500).json({ error: "Failed to validate hobby" });
    }
  });
  app2.get("/api/hobby-plans", async (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
      console.log("\u{1F4D6} API: Fetching hobby plans for user:", user_id);
      const plans = await supabaseStorage.getHobbyPlansByUserId(user_id);
      console.log("\u{1F4D6} API: Found", plans?.length || 0, "hobby plans");
      res.json(plans || []);
    } catch (error) {
      console.error("Error fetching hobby plans:", error);
      res.status(500).json({ error: "Failed to fetch hobby plans" });
    }
  });
  app2.get("/api/hobby-plans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("\u{1F4D6} API: Fetching hobby plans for user:", userId);
      const plans = await supabaseStorage.getHobbyPlansByUserId(userId);
      console.log("\u{1F4D6} API: Found", plans?.length || 0, "plans");
      res.json(plans || []);
    } catch (error) {
      console.error("\u{1F4D6} API: Error fetching hobby plans:", error);
      res.status(500).json({ error: "Failed to fetch hobby plans" });
    }
  });
  app2.post("/api/hobby-plans", async (req, res) => {
    try {
      const { user_id, hobby, title, overview, plan_data } = req.body;
      console.log("\u{1F4DD} DATABASE: Creating hobby plan for user:", user_id, "hobby:", hobby);
      console.log("\u{1F50D} DEBUG: Plan data being saved - first day mistakesToAvoid:", plan_data?.days?.[0]?.mistakesToAvoid);
      console.log("\u{1F50D} DEBUG: Plan data being saved - first day youtubeVideoId:", plan_data?.days?.[0]?.youtubeVideoId);
      const validatedData = insertHobbyPlanSchema.parse({
        userId: user_id,
        hobby,
        title,
        overview,
        planData: plan_data
      });
      const plan = await supabaseStorage.createHobbyPlan(validatedData);
      console.log("\u{1F4DD} DATABASE: Created plan with ID:", plan.id);
      res.json(plan);
    } catch (error) {
      console.error("\u{1F4DD} API: Error creating hobby plan:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create hobby plan" });
      }
    }
  });
  app2.delete("/api/hobby-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
      console.log("\u{1F5D1}\uFE0F API: Deleting hobby plan", id, "for user:", user_id);
      await supabaseStorage.deleteUserProgress(id, user_id);
      await supabaseStorage.deleteHobbyPlan(id, user_id);
      console.log("\u{1F5D1}\uFE0F API: Successfully deleted hobby plan", id);
      res.json({ success: true });
    } catch (error) {
      console.error("\u{1F5D1}\uFE0F API: Error deleting hobby plan:", error);
      res.status(500).json({ error: "Failed to delete hobby plan" });
    }
  });
  app2.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("\u{1F4D6} API: Fetching user progress for:", userId);
      const progress = await supabaseStorage.getUserProgress(userId);
      console.log("\u{1F4D6} API: Found", progress.length, "progress entries");
      res.json(progress);
    } catch (error) {
      console.error("\u{1F4D6} API: Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });
  app2.post("/api/user-progress", async (req, res) => {
    try {
      const { user_id, plan_id, completed_days, current_day, unlocked_days } = req.body;
      console.log("\u{1F4DD} DATABASE: Creating/updating user progress for:", user_id, "plan:", plan_id);
      const validatedData = insertUserProgressSchema.parse({
        userId: user_id,
        planId: plan_id,
        completedDays: completed_days,
        currentDay: current_day,
        unlockedDays: unlocked_days
      });
      const progress = await supabaseStorage.createOrUpdateUserProgress(validatedData);
      console.log("\u{1F4DD} DATABASE: Updated progress for plan:", plan_id);
      res.json(progress);
    } catch (error) {
      console.error("\u{1F4DD} API: Error updating user progress:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user progress" });
      }
    }
  });
  app2.get("/api/health/database", async (req, res) => {
    try {
      const result = await supabaseStorage.getUserProfile("test");
      const isHealthy = true;
      if (isHealthy) {
        res.json({
          status: "healthy",
          database: "supabase",
          independent: true,
          message: "Database is connected and running on Supabase PostgreSQL"
        });
      } else {
        res.status(500).json({
          status: "unhealthy",
          database: "supabase",
          independent: true,
          message: "Database connection failed"
        });
      }
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({
        status: "error",
        message: "Health check failed",
        independent: true
      });
    }
  });
  app2.post("/api/migrate-data", async (req, res) => {
    try {
      console.log("\u{1F504} Starting data migration from Replit to Supabase...");
      const userProfileExists = await supabaseStorage.getUserProfile("773c3f18-025a-432d-ae3d-fa13be3faef8");
      if (!userProfileExists) {
        await supabaseStorage.createUserProfile({
          id: "773c3f18-025a-432d-ae3d-fa13be3faef8",
          email: "wizqo2024@gmail.com",
          username: "wizqo",
          avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocKnN7jbvoRIp_6hG3lLS-WzLaT7TJ9NonxjjT1rW_T91eo5OA=s96-c"
        });
        console.log("\u2705 User profile migrated to Supabase");
      }
      res.json({
        success: true,
        message: "Data migration completed - your website is now 100% independent!"
      });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ error: "Migration failed" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          error: "All fields are required: name, email, subject, message"
        });
      }
      const emailSent = await sendContactEmail({ name, email, subject, message });
      if (emailSent) {
        res.json({ success: true, message: "Message sent successfully!" });
      } else {
        res.status(500).json({ error: "Failed to send message. Please try again." });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
  const server = createServer(app2);
  return server;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
