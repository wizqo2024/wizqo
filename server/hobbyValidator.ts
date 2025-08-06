// Dynamic hobby validation and support system
import { videoDatabase } from './videoSelection';

// Common hobby keywords and variations
const hobbyKeywords = {
  // Music
  music: ['music', 'guitar', 'piano', 'violin', 'drums', 'singing', 'bass', 'keyboard', 'ukulele'],
  // Art & Creativity  
  art: ['drawing', 'painting', 'sketching', 'art', 'illustration', 'digital art', 'watercolor', 'acrylic'],
  // Movement & Dance
  dance: ['dance', 'dancing', 'ballet', 'hip hop', 'salsa', 'ballroom', 'contemporary', 'jazz dance'],
  // Physical Activities
  fitness: ['yoga', 'pilates', 'workout', 'fitness', 'exercise', 'gym', 'strength training', 'cardio'],
  sports: ['tennis', 'basketball', 'soccer', 'football', 'volleyball', 'swimming', 'running', 'cycling'],
  martial_arts: ['karate', 'taekwondo', 'judo', 'boxing', 'mma', 'kung fu', 'aikido', 'jiu jitsu'],
  // Skills & Crafts
  cooking: ['cooking', 'baking', 'culinary', 'chef', 'cuisine', 'recipes', 'food preparation'],
  crafts: ['knitting', 'sewing', 'crochet', 'embroidery', 'quilting', 'needlework', 'crafting'],
  woodworking: ['woodworking', 'carpentry', 'furniture making', 'wood carving', 'woodcraft'],
  // Technology
  coding: ['coding', 'programming', 'web development', 'app development', 'software', 'javascript', 'python'],
  // Outdoor & Nature
  gardening: ['gardening', 'horticulture', 'plants', 'farming', 'landscaping', 'greenhouse'],
  // Creative Arts
  photography: ['photography', 'photo', 'camera', 'portrait', 'landscape photography', 'digital photography'],
  writing: ['writing', 'creative writing', 'poetry', 'storytelling', 'blogging', 'journalism'],
  // Learning & Academic
  languages: ['language', 'spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'english'],
  // Spiritual & Religious
  religious: ['quran', 'quran recitation', 'quran reading', 'islamic studies', 'arabic', 'tajweed', 'hadith', 'prayer', 'meditation'],
  // Games & Entertainment
  gaming: ['gaming', 'video games', 'board games', 'chess', 'poker', 'game development'],
  // Business & Finance
  business: ['business', 'entrepreneurship', 'marketing', 'investing', 'finance', 'economics'],
  // Home & Lifestyle
  organization: ['organization', 'decluttering', 'minimalism', 'home improvement', 'interior design']
};

// Generic video fallbacks for unsupported hobbies
const genericVideoDatabase = {
  beginner: [
    { videoId: "rtR63-ecUNo", title: "Getting Started - Beginner Basics", description: "Fundamental concepts and first steps" },
    { videoId: "EHhHPkb8SXs", title: "Essential Tools and Setup", description: "What you need to get started" },
    { videoId: "lTBoW6iKavc", title: "First Practice Session", description: "Your first hands-on experience" },
    { videoId: "sxJRiYqCkWk", title: "Building Good Habits", description: "Creating a consistent practice routine" },
    { videoId: "5AyOB-LJ7H4", title: "Common Beginner Mistakes", description: "What to avoid as you start" },
    { videoId: "bCerf7NJOlE", title: "Progress Tracking", description: "How to measure your improvement" },
    { videoId: "lDflB-DdiJo", title: "Next Steps Forward", description: "Planning your continued learning" }
  ],
  some: [
    { videoId: "pMC0Cx3Uk5g", title: "Intermediate Techniques", description: "Building on your foundation" },
    { videoId: "TMdqJIHb04Y", title: "Advanced Practice Methods", description: "More challenging exercises" },
    { videoId: "cOzCQSh_-vY", title: "Problem Solving Skills", description: "Overcoming common challenges" },
    { videoId: "SiJ7rjK5Wdg", title: "Creative Applications", description: "Applying skills in new ways" },
    { videoId: "oKFfSzxJy2Y", title: "Performance and Presentation", description: "Sharing your skills with others" },
    { videoId: "7BDKWT3pI_A", title: "Advanced Projects", description: "Complex, rewarding challenges" },
    { videoId: "1umSnh48XQo", title: "Teaching and Mentoring", description: "Helping others learn" }
  ],
  intermediate: [
    { videoId: "UB1O30fR-EE", title: "Advanced Techniques", description: "Professional-level skills" },
    { videoId: "hdI2bqOjy3c", title: "Mastery Projects", description: "Complex, challenging work" },
    { videoId: "zOjov-2OZ0E", title: "Innovation and Creativity", description: "Developing your unique style" },
    { videoId: "kqtD5dpn9C8", title: "Professional Development", description: "Taking skills to the next level" },
    { videoId: "c8aAYU5m4jM", title: "Community and Networking", description: "Connecting with other practitioners" },
    { videoId: "9Yf36xdLp2A", title: "Advanced Problem Solving", description: "Tackling complex challenges" },
    { videoId: "rfscVS0vtbw", title: "Expertise and Specialization", description: "Becoming an expert" }
  ]
};

// Smart hobby detection function
function detectBestHobbyMatch(input: string): string | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Direct matches first
  if (videoDatabase[lowerInput]) {
    return lowerInput;
  }
  
  // Check for partial matches in hobby keywords
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    for (const keyword of keywords) {
      let score = 0;
      
      // Exact match gets highest score
      if (lowerInput === keyword) {
        score = 100;
      }
      // Input contains keyword
      else if (lowerInput.includes(keyword)) {
        score = 80;
      }
      // Keyword contains input (partial match)
      else if (keyword.includes(lowerInput) && lowerInput.length >= 3) {
        score = 60;
      }
      // Similar words (edit distance)
      else if (calculateSimilarity(lowerInput, keyword) > 0.7) {
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

// Simple string similarity function
function calculateSimilarity(str1: string, str2: string): number {
  if (str1.length === 0 || str2.length === 0) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const commonChars = countCommonChars(shorter, longer);
  return commonChars / longer.length;
}

function countCommonChars(str1: string, str2: string): number {
  let common = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str2.includes(str1[i])) {
      common++;
    }
  }
  return common;
}

export function validateHobby(hobbyInput: string): { 
  isValid: boolean; 
  normalizedHobby: string; 
  category: string | null;
  hasVideoSupport: boolean;
  detectedHobbies?: string[];
  suggestions?: string[];
} {
  const input = hobbyInput.toLowerCase().trim();
  
  // Special validation for Quran and Islamic studies - always accept these
  if (['quran', 'quran recitation', 'quran reading', 'islamic studies', 'tajweed', 'arabic quran', 'koran', 'holy quran'].includes(input)) {
    return {
      isValid: true,
      normalizedHobby: 'quran',
      category: 'religious',
      hasVideoSupport: false, // Will use generic fallback videos
      suggestions: []
    };
  }
  
  // Only reject completely nonsensical inputs
  const badInputs = ['bye', 'hello', 'hi', 'hey', 'hmm', 'um', 'uh', 'ah', 'ok', 'okay', 'yes', 'no', 'maybe', 'test', 'testing', '', 'null', 'undefined', 'admin', 'root'];
  if (badInputs.includes(input) || input.length < 2) {
    return { 
      isValid: false, 
      normalizedHobby: '', 
      category: null, 
      hasVideoSupport: false,
      suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance', 'quran']
    };
  }

  // Try to detect the best hobby match
  const detectedHobby = detectBestHobbyMatch(input);
  
  if (detectedHobby) {
    const hasVideoSupport = !!videoDatabase[detectedHobby];
    const category = hasVideoSupport ? detectedHobby : findCategoryForHobby(detectedHobby);
    
    return {
      isValid: true,
      normalizedHobby: detectedHobby,
      category: category,
      hasVideoSupport: hasVideoSupport,
      detectedHobbies: [detectedHobby]
    };
  }
  
  // If no match found, but input looks reasonable, accept it as a potential hobby
  const reasonablePattern = /^[a-zA-Z\s-]{3,30}$/;
  if (reasonablePattern.test(input)) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: 'general',
      hasVideoSupport: false
    };
  }
  
  // Provide suggestions for unclear inputs
  return {
    isValid: false,
    normalizedHobby: input,
    category: null,
    hasVideoSupport: false,
    suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
  };
}

function findCategoryForHobby(hobby: string): string | null {
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    if (keywords.includes(hobby)) {
      return category;
    }
  }
  return null;
}

export function getVideosForHobby(hobby: string, experience: string): any[] {
  // First check if hobby exists in curated database
  if (videoDatabase[hobby] && videoDatabase[hobby][experience]) {
    return videoDatabase[hobby][experience];
  }
  
  // Check if it maps to a supported category
  const validation = validateHobby(hobby);
  if (validation.hasVideoSupport && validation.normalizedHobby !== hobby) {
    if (videoDatabase[validation.normalizedHobby] && videoDatabase[validation.normalizedHobby][experience]) {
      return videoDatabase[validation.normalizedHobby][experience];
    }
  }
  
  // Fall back to generic videos with hobby-specific titles
  const genericVideos = genericVideoDatabase[experience as keyof typeof genericVideoDatabase] || genericVideoDatabase['beginner'];
  
  return genericVideos.map((video: any, index: number) => ({
    ...video,
    title: video.title.replace('Getting Started', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Basics`)
                    .replace('Essential Tools', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Tools`)
                    .replace('Beginner Basics', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} for Beginners`),
    description: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} - ${video.description}`
  }));
}

export function suggestAlternativeHobbies(invalidInput: string): string[] {
  const suggestions = [];
  
  // Get all supported hobbies from video database
  const supportedHobbies = Object.keys(videoDatabase);
  
  // Add some based on partial matches
  for (const hobby of supportedHobbies) {
    if (hobby.includes(invalidInput.toLowerCase()) || invalidInput.toLowerCase().includes(hobby)) {
      suggestions.push(hobby);
    }
  }
  
  // Add popular hobbies if no matches
  if (suggestions.length === 0) {
    suggestions.push('guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance');
  }
  
  return suggestions.slice(0, 6); // Limit to 6 suggestions
}