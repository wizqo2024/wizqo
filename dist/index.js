var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
function getTargetedYouTubeVideo(hobby, dayTitle, mainTask, skillLevel = "beginner", dayNumber) {
  const normalizedHobby = hobby.toLowerCase().trim();
  const normalizedSkillLevel = skillLevel.toLowerCase().trim();
  let actualDayNumber;
  if (dayNumber) {
    actualDayNumber = dayNumber;
  } else {
    const dayMatch = dayTitle.match(/day\s*(\d+)/i) || mainTask.match(/day\s*(\d+)/i);
    actualDayNumber = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  }
  const hobbyVideos = videoDatabase[normalizedHobby];
  if (!hobbyVideos) {
    console.log(`\u{1F4F9} No targeted videos found for hobby: ${hobby}, using fallback`);
    return "3jWRrafhO7M";
  }
  let skillVideos = hobbyVideos[normalizedSkillLevel];
  if (!skillVideos && normalizedSkillLevel === "some") {
    skillVideos = hobbyVideos["some"] || hobbyVideos["beginner"];
  }
  if (!skillVideos) {
    const beginnerVideos = hobbyVideos["beginner"];
    if (beginnerVideos) {
      const videoIndex2 = Math.min(actualDayNumber - 1, beginnerVideos.length - 1);
      console.log(`\u{1F4F9} Using beginner fallback for ${hobby} ${skillLevel}, day ${actualDayNumber}: ${beginnerVideos[videoIndex2].title}`);
      return beginnerVideos[videoIndex2].videoId;
    }
    return "BCWKDrPkCg0";
  }
  const videoIndex = Math.min(actualDayNumber - 1, skillVideos.length - 1);
  const selectedVideo = skillVideos[videoIndex];
  console.log(`\u{1F4F9} Selected targeted video for ${hobby} ${skillLevel} day ${actualDayNumber}: ${selectedVideo.title}`);
  return selectedVideo.videoId;
}
function getVideoDetails(hobby, skillLevel, dayNumber) {
  const normalizedHobby = hobby.toLowerCase().trim();
  const normalizedSkillLevel = skillLevel.toLowerCase().trim();
  const hobbyVideos = TARGETED_VIDEOS[normalizedHobby];
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

// server/hobbyValidator.ts
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
  // Games & Entertainment
  gaming: ["gaming", "video games", "board games", "chess", "poker", "game development"],
  // Business & Finance
  business: ["business", "entrepreneurship", "marketing", "investing", "finance", "economics"],
  // Home & Lifestyle
  organization: ["organization", "decluttering", "minimalism", "home improvement", "interior design"]
};
var genericVideoDatabase = {
  beginner: [
    { videoId: "dQw4w9WgXcQ", title: "Getting Started - Beginner Basics", description: "Fundamental concepts and first steps" },
    { videoId: "dQw4w9WgXcQ", title: "Essential Tools and Setup", description: "What you need to get started" },
    { videoId: "dQw4w9WgXcQ", title: "First Practice Session", description: "Your first hands-on experience" },
    { videoId: "dQw4w9WgXcQ", title: "Building Good Habits", description: "Creating a consistent practice routine" },
    { videoId: "dQw4w9WgXcQ", title: "Common Beginner Mistakes", description: "What to avoid as you start" },
    { videoId: "dQw4w9WgXcQ", title: "Progress Tracking", description: "How to measure your improvement" },
    { videoId: "dQw4w9WgXcQ", title: "Next Steps Forward", description: "Planning your continued learning" }
  ],
  some: [
    { videoId: "dQw4w9WgXcQ", title: "Intermediate Techniques", description: "Building on your foundation" },
    { videoId: "dQw4w9WgXcQ", title: "Advanced Practice Methods", description: "More challenging exercises" },
    { videoId: "dQw4w9WgXcQ", title: "Problem Solving Skills", description: "Overcoming common challenges" },
    { videoId: "dQw4w9WgXcQ", title: "Creative Applications", description: "Applying skills in new ways" },
    { videoId: "dQw4w9WgXcQ", title: "Performance and Presentation", description: "Sharing your skills with others" },
    { videoId: "dQw4w9WgXcQ", title: "Advanced Projects", description: "Complex, rewarding challenges" },
    { videoId: "dQw4w9WgXcQ", title: "Teaching and Mentoring", description: "Helping others learn" }
  ],
  intermediate: [
    { videoId: "dQw4w9WgXcQ", title: "Advanced Techniques", description: "Professional-level skills" },
    { videoId: "dQw4w9WgXcQ", title: "Mastery Projects", description: "Complex, challenging work" },
    { videoId: "dQw4w9WgXcQ", title: "Innovation and Creativity", description: "Developing your unique style" },
    { videoId: "dQw4w9WgXcQ", title: "Professional Development", description: "Taking skills to the next level" },
    { videoId: "dQw4w9WgXcQ", title: "Community and Networking", description: "Connecting with other practitioners" },
    { videoId: "dQw4w9WgXcQ", title: "Advanced Problem Solving", description: "Tackling complex challenges" },
    { videoId: "dQw4w9WgXcQ", title: "Expertise and Specialization", description: "Becoming an expert" }
  ]
};
function validateHobby(hobbyInput) {
  const input = hobbyInput.toLowerCase().trim();
  if (videoDatabase[input]) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: input,
      hasVideoSupport: true
    };
  }
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    if (keywords.some((keyword) => input.includes(keyword) || keyword.includes(input))) {
      if (videoDatabase[category]) {
        return {
          isValid: true,
          normalizedHobby: category,
          category,
          hasVideoSupport: true
        };
      }
      return {
        isValid: true,
        normalizedHobby: input,
        category,
        hasVideoSupport: false
      };
    }
  }
  const validHobbyPattern = /^[a-zA-Z\s-]{2,30}$/;
  if (validHobbyPattern.test(hobbyInput)) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: null,
      hasVideoSupport: false
    };
  }
  return {
    isValid: false,
    normalizedHobby: input,
    category: null,
    hasVideoSupport: false
  };
}
function getVideosForHobby(hobby, experience) {
  if (videoDatabase[hobby] && videoDatabase[hobby][experience]) {
    return videoDatabase[hobby][experience];
  }
  const validation = validateHobby(hobby);
  if (validation.hasVideoSupport && validation.normalizedHobby !== hobby) {
    if (videoDatabase[validation.normalizedHobby] && videoDatabase[validation.normalizedHobby][experience]) {
      return videoDatabase[validation.normalizedHobby][experience];
    }
  }
  const genericVideos = genericVideoDatabase[experience] || genericVideoDatabase["beginner"];
  return genericVideos.map((video, index) => ({
    ...video,
    title: video.title.replace("Getting Started", `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Basics`).replace("Essential Tools", `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Tools`).replace("Beginner Basics", `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} for Beginners`),
    description: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} - ${video.description}`
  }));
}
function suggestAlternativeHobbies(invalidInput) {
  const suggestions = [];
  const supportedHobbies = Object.keys(videoDatabase);
  for (const hobby of supportedHobbies) {
    if (hobby.includes(invalidInput.toLowerCase()) || invalidInput.toLowerCase().includes(hobby)) {
      suggestions.push(hobby);
    }
  }
  if (suggestions.length === 0) {
    suggestions.push("guitar", "cooking", "drawing", "yoga", "photography", "dance");
  }
  return suggestions.slice(0, 6);
}

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  hobbyPlans: () => hobbyPlans,
  insertHobbyPlanSchema: () => insertHobbyPlanSchema,
  insertUserProfileSchema: () => insertUserProfileSchema,
  insertUserProgressSchema: () => insertUserProgressSchema,
  updateUserProgressSchema: () => updateUserProgressSchema,
  userProfiles: () => userProfiles,
  userProgress: () => userProgress
});
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

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and } from "drizzle-orm";
var DatabaseStorage = class {
  async getUserProfile(id) {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return result[0];
  }
  async getUserProfileByEmail(email) {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.email, email));
    return result[0];
  }
  async createUserProfile(insertUser) {
    const result = await db.insert(userProfiles).values(insertUser).returning();
    return result[0];
  }
  async getHobbyPlans(userId) {
    return await db.select().from(hobbyPlans).where(eq(hobbyPlans.userId, userId));
  }
  async createHobbyPlan(insertPlan) {
    const result = await db.insert(hobbyPlans).values(insertPlan).returning();
    return result[0];
  }
  async getUserProgress(userId) {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }
  async createOrUpdateUserProgress(insertProgress) {
    const existing = await db.select().from(userProgress).where(and(
      eq(userProgress.userId, insertProgress.userId),
      eq(userProgress.planId, insertProgress.planId)
    ));
    if (existing.length > 0) {
      const result = await db.update(userProgress).set({
        ...insertProgress,
        lastAccessedAt: /* @__PURE__ */ new Date()
      }).where(and(
        eq(userProgress.userId, insertProgress.userId),
        eq(userProgress.planId, insertProgress.planId)
      )).returning();
      return result[0];
    } else {
      const result = await db.insert(userProgress).values(insertProgress).returning();
      return result[0];
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
console.log("\u{1F4D6} API: Database storage initialized for all operations");
async function generateAIPlan(hobby, experience, timeAvailable, goal) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log("\u26A0\uFE0F No DeepSeek API key found, using fallback plan generation");
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
  "title": "7-Day ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Learning Journey",
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
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in API response");
    }
    const aiPlan = JSON.parse(content);
    aiPlan.days = aiPlan.days.map((day, index) => {
      const videos = getVideosForHobby(hobby, experience);
      const videoIndex = Math.min(index, videos.length - 1);
      const selectedVideo = videos[videoIndex];
      const targetedVideoId = selectedVideo?.videoId || getTargetedYouTubeVideo(hobby, day.title, day.mainTask, experience, day.day);
      const videoDetails = selectedVideo || getVideoDetails(hobby, experience, day.day);
      return {
        ...day,
        // Ensure commonMistakes field exists (AI may use different field names)
        commonMistakes: day.commonMistakes || day.mistakesToAvoid || [
          `Rushing through exercises without understanding concepts`,
          `Skipping practice time or cutting sessions short`,
          `Not taking notes or tracking your improvement`
        ],
        youtubeVideoId: targetedVideoId,
        videoTitle: videoDetails?.title || `${day.title} - ${hobby} Tutorial`,
        freeResources: [{
          title: videoDetails?.title || `${day.title} Tutorial`,
          link: `https://youtube.com/watch?v=${targetedVideoId}`
        }],
        affiliateProducts: [{
          title: `${hobby} Essential Kit`,
          link: `https://amazon.com/dp/B${index + 1}234?tag=wizqo-20`,
          price: `$${19 + index * 5}.99`
        }]
      };
    });
    aiPlan.hobby = hobby;
    aiPlan.difficulty = experience === "some" ? "intermediate" : experience;
    aiPlan.overview = aiPlan.overview || aiPlan.description || `A comprehensive ${hobby} learning plan tailored for ${experience === "some" ? "intermediate" : experience} learners`;
    return aiPlan;
  } catch (error) {
    console.error("DeepSeek API error:", error);
    console.log("\u26A0\uFE0F DeepSeek API failed, using fallback plan generation");
    return generateFallbackPlan(hobby, experience, timeAvailable, goal);
  }
}
function generateFallbackPlan(hobby, experience, timeAvailable, goal) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayNumber = i + 1;
    const dayTitle = `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Fundamentals - Day ${dayNumber}`;
    const videos = getVideosForHobby(hobby, experience);
    const videoIndex = Math.min(i, videos.length - 1);
    const selectedVideo = videos[videoIndex];
    const targetedVideoId = selectedVideo?.videoId || getTargetedYouTubeVideo(hobby, dayTitle, `Learn essential ${hobby} techniques - Day ${dayNumber}`, experience, dayNumber);
    const videoDetails = selectedVideo || getVideoDetails(hobby, experience, dayNumber);
    days.push({
      day: i + 1,
      title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Fundamentals - Day ${i + 1}`,
      mainTask: `Learn essential ${hobby} techniques and practice hands-on exercises with detailed instruction.`,
      explanation: `Day ${i + 1} focuses on building your foundation in ${hobby} with practical exercises that build on previous learning.`,
      howTo: [
        `Start with basic ${hobby} concepts and terminology`,
        `Practice fundamental techniques with step-by-step guidance`,
        `Complete hands-on exercises designed for ${experience} level`,
        `Review and refine your skills through deliberate practice`,
        `Document your progress and identify areas for improvement`
      ],
      checklist: [
        `All necessary ${hobby} equipment and materials ready`,
        `Comfortable practice space set up appropriately`,
        `Reference materials and guides easily accessible`,
        `Timer for focused practice sessions`,
        `Method to track progress and take notes`
      ],
      tips: [
        `Take your time with each exercise - quality over speed`,
        `Don't be afraid to repeat difficult parts multiple times`,
        `Practice regularly in short sessions rather than long marathons`
      ],
      commonMistakes: [
        `Rushing through exercises without understanding concepts`,
        `Skipping practice time or cutting sessions short`,
        `Not taking notes or tracking your improvement`
      ],
      freeResources: [{
        title: videoDetails?.title || `${hobby} Day ${i + 1} Tutorial`,
        link: `https://youtube.com/watch?v=${targetedVideoId}`
      }],
      affiliateProducts: [{
        title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Essential Kit`,
        link: `https://amazon.com/dp/B${i + 1}234?tag=wizqo-20`,
        price: `$${19 + i * 5}.99`
      }],
      youtubeVideoId: targetedVideoId,
      videoTitle: videoDetails?.title || `${hobby} - Day ${i + 1}`,
      estimatedTime: timeAvailable,
      skillLevel: experience
    });
  }
  const plan = {
    hobby,
    title: `7-Day ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Learning Journey`,
    overview: `A comprehensive ${hobby} learning plan tailored for ${experience === "some" ? "intermediate" : experience} learners`,
    difficulty: experience === "some" ? "intermediate" : experience,
    totalDays: 7,
    days
  };
  console.log("\u{1F50D} FALLBACK PLAN GENERATED - First day commonMistakes:", plan.days[0].commonMistakes);
  console.log("\u{1F50D} FALLBACK PLAN GENERATED - First day youtubeVideoId:", plan.days[0].youtubeVideoId);
  console.log("\u{1F50D} FALLBACK PLAN DIFFICULTY:", plan.difficulty, "EXPERIENCE:", experience);
  return plan;
}
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/generate-plan", async (req, res) => {
    try {
      const { hobby, experience, timeAvailable, goal } = req.body;
      if (!hobby || !experience || !timeAvailable) {
        return res.status(400).json({
          error: "Missing required fields: hobby, experience, timeAvailable"
        });
      }
      const validation = validateHobby(hobby);
      if (!validation.isValid) {
        const suggestions = suggestAlternativeHobbies(hobby);
        return res.status(400).json({
          error: `I didn't quite catch that hobby. Could you be more specific?`,
          suggestions,
          message: `Try something like: ${suggestions.slice(0, 3).join(", ")}`
        });
      }
      const normalizedHobby = validation.normalizedHobby;
      const plan = await generateAIPlan(normalizedHobby, experience, timeAvailable, goal || `Learn ${normalizedHobby} fundamentals`);
      res.json(plan);
    } catch (error) {
      console.error("Error generating plan:", error);
      res.status(500).json({ error: "Failed to generate learning plan" });
    }
  });
  app2.get("/api/hobby-plans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("\u{1F4D6} API: Fetching hobby plans for user:", userId);
      const plans = await storage.getHobbyPlans(userId);
      console.log("\u{1F4D6} API: Found", plans.length, "plans");
      res.json(plans);
    } catch (error) {
      console.error("\u{1F4D6} API: Error fetching hobby plans:", error);
      res.status(500).json({ error: "Failed to fetch hobby plans" });
    }
  });
  app2.post("/api/hobby-plans", async (req, res) => {
    try {
      const { user_id, hobby, title, overview, plan_data } = req.body;
      console.log("\u{1F4DD} DATABASE: Creating hobby plan for user:", user_id, "hobby:", hobby);
      console.log("\u{1F50D} DEBUG: Plan data being saved - first day commonMistakes:", plan_data?.days?.[0]?.commonMistakes);
      console.log("\u{1F50D} DEBUG: Plan data being saved - first day youtubeVideoId:", plan_data?.days?.[0]?.youtubeVideoId);
      const validatedData = insertHobbyPlanSchema.parse({
        userId: user_id,
        hobby,
        title,
        overview,
        planData: plan_data
      });
      const plan = await storage.createHobbyPlan(validatedData);
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
  app2.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("\u{1F4D6} API: Fetching user progress for:", userId);
      const progress = await storage.getUserProgress(userId);
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
      const progress = await storage.createOrUpdateUserProgress(validatedData);
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
