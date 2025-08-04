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

export function validateHobby(hobbyInput: string): { 
  isValid: boolean; 
  normalizedHobby: string; 
  category: string | null;
  hasVideoSupport: boolean;
} {
  const input = hobbyInput.toLowerCase().trim();
  
  // Check if hobby is directly supported in video database
  if (videoDatabase[input]) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: input,
      hasVideoSupport: true
    };
  }
  
  // Check against hobby keywords
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    if (keywords.some(keyword => input.includes(keyword) || keyword.includes(input))) {
      // If the category exists in video database, use it
      if (videoDatabase[category]) {
        return {
          isValid: true,
          normalizedHobby: category,
          category: category,
          hasVideoSupport: true
        };
      }
      
      // Valid hobby but no specific video support
      return {
        isValid: true,
        normalizedHobby: input,
        category: category,
        hasVideoSupport: false
      };
    }
  }
  
  // Check if it's a reasonable hobby (basic validation)
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