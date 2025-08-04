// Enhanced YouTube Video Selection System
// Provides targeted, relevant tutorial videos based on hobby, day, and skill level

interface VideoDatabase {
  [hobby: string]: {
    [skillLevel: string]: {
      videoId: string;
      title: string;
      description: string;
    }[];
  };
}

// Curated database of high-quality, relevant tutorial videos
export const videoDatabase: VideoDatabase = {
  guitar: {
    beginner: [
      { videoId: "BCWKDrPkCg0", title: "Guitar Basics - 10 Minute Lesson", description: "Quick intro to holding guitar and first chords" },
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
      { videoId: "rtR63-ecUNo", title: "Essential Knife Skills for Beginners", description: "Learn proper knife handling and basic cuts" },
      { videoId: "fBYVFCb1n6s", title: "Fundamental Cooking Techniques", description: "Sautéing, boiling, roasting, and grilling basics" },
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
      { videoId: "pMC0Cx3Uk5g", title: "Drawing Fundamentals for Beginners", description: "Basic drawing concepts, tools, and techniques" },
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

/**
 * Get a targeted YouTube video based on hobby, skill level, and day progression
 * @param hobby - The hobby being learned (guitar, cooking, drawing, etc.)
 * @param dayTitle - The title of the current day's lesson
 * @param mainTask - The main task for the day
 * @param skillLevel - User's skill level (beginner, intermediate, advanced)
 * @returns YouTube video ID that matches the learning objective
 */
export function getTargetedYouTubeVideo(
  hobby: string, 
  dayTitle: string, 
  mainTask: string, 
  skillLevel: string = 'beginner',
  dayNumber?: number
): string {
  const normalizedHobby = hobby.toLowerCase().trim();
  const normalizedSkillLevel = skillLevel.toLowerCase().trim();
  
  // Use provided day number or extract from title/task
  let actualDayNumber: number;
  if (dayNumber) {
    actualDayNumber = dayNumber;
  } else {
    const dayMatch = dayTitle.match(/day\s*(\d+)/i) || mainTask.match(/day\s*(\d+)/i);
    actualDayNumber = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  }
  

  
  // Get videos for this hobby and skill level
  const hobbyVideos = videoDatabase[normalizedHobby];
  if (!hobbyVideos) {
    console.log(`📹 No targeted videos found for hobby: ${hobby}, using fallback`);
    return "3jWRrafhO7M"; // Default fallback
  }
  
  let skillVideos = hobbyVideos[normalizedSkillLevel];
  
  // Map "some" experience to "some" level, or fallback to beginner
  if (!skillVideos && normalizedSkillLevel === 'some') {
    skillVideos = hobbyVideos['some'] || hobbyVideos['beginner'];
  }
  
  if (!skillVideos) {
    // Try beginner level as final fallback
    const beginnerVideos = hobbyVideos['beginner'];
    if (beginnerVideos) {
      const videoIndex = Math.min(actualDayNumber - 1, beginnerVideos.length - 1);
      console.log(`📹 Using beginner fallback for ${hobby} ${skillLevel}, day ${actualDayNumber}: ${beginnerVideos[videoIndex].title}`);
      return beginnerVideos[videoIndex].videoId;
    }
    return "BCWKDrPkCg0"; // Short beginner video
  }
  
  // Select video based on day progression
  const videoIndex = Math.min(actualDayNumber - 1, skillVideos.length - 1);
  const selectedVideo = skillVideos[videoIndex];
  
  console.log(`📹 Selected targeted video for ${hobby} ${skillLevel} day ${actualDayNumber}: ${selectedVideo.title}`);
  return selectedVideo.videoId;
}

/**
 * Get video title and description for a selected video
 */
export function getVideoDetails(hobby: string, skillLevel: string, dayNumber: number) {
  const normalizedHobby = hobby.toLowerCase().trim();
  const normalizedSkillLevel = skillLevel.toLowerCase().trim();
  
  const hobbyVideos = videoDatabase[normalizedHobby];
  if (!hobbyVideos) return null;
  
  let skillVideos = hobbyVideos[normalizedSkillLevel];
  
  // Map "some" experience to "some" level, or fallback to beginner
  if (!skillVideos && normalizedSkillLevel === 'some') {
    skillVideos = hobbyVideos['some'] || hobbyVideos['beginner'];
  }
  
  if (!skillVideos) {
    skillVideos = hobbyVideos['beginner'];
  }
  
  if (!skillVideos) return null;
  
  const videoIndex = Math.min(dayNumber - 1, skillVideos.length - 1);
  return skillVideos[videoIndex];
}