// Automated hobby image generation system
// This system automatically generates unique, hobby-specific images without manual mapping

export interface HobbyImageConfig {
  hobby: string;
  imageUrl: string;
  category: string;
  keywords: string[];
}

// Smart hobby categorization system
const getHobbyCategory = (hobby: string): string => {
  const normalizedHobby = hobby.toLowerCase();
  
  // Technology hobbies
  if (normalizedHobby.includes('coding') || normalizedHobby.includes('programming') || 
      normalizedHobby.includes('development') || normalizedHobby.includes('tech') ||
      normalizedHobby.includes('app') || normalizedHobby.includes('web') ||
      normalizedHobby.includes('software') || normalizedHobby.includes('game')) {
    return 'technology';
  }
  
  // Creative arts
  if (normalizedHobby.includes('art') || normalizedHobby.includes('draw') || 
      normalizedHobby.includes('paint') || normalizedHobby.includes('design') ||
      normalizedHobby.includes('craft') || normalizedHobby.includes('creative') ||
      normalizedHobby.includes('photo') || normalizedHobby.includes('video') ||
      normalizedHobby.includes('editing') || normalizedHobby.includes('music')) {
    return 'creative';
  }
  
  // Physical activities
  if (normalizedHobby.includes('sport') || normalizedHobby.includes('fitness') || 
      normalizedHobby.includes('exercise') || normalizedHobby.includes('yoga') ||
      normalizedHobby.includes('dance') || normalizedHobby.includes('run') ||
      normalizedHobby.includes('bike') || normalizedHobby.includes('swim')) {
    return 'fitness';
  }
  
  // Culinary
  if (normalizedHobby.includes('cook') || normalizedHobby.includes('bak') || 
      normalizedHobby.includes('food') || normalizedHobby.includes('culinary') ||
      normalizedHobby.includes('chef') || normalizedHobby.includes('recipe')) {
    return 'culinary';
  }
  
  // Learning & intellectual
  if (normalizedHobby.includes('read') || normalizedHobby.includes('learn') || 
      normalizedHobby.includes('study') || normalizedHobby.includes('language') ||
      normalizedHobby.includes('research') || normalizedHobby.includes('write')) {
    return 'learning';
  }
  
  return 'general';
};

// Automated image URL generation based on hobby content
const generateHobbyImageUrl = (hobby: string, category: string): string => {
  const baseUrl = 'https://images.unsplash.com/photo-';
  const params = '?w=400&h=240&fit=crop';
  
  // High-quality image IDs categorized by hobby type
  const categoryImages = {
    technology: [
      '1461749280684-dccba630e2f6', // Coding workspace
      '1574717024653-61fd2cf4d44d', // Video editing setup
      '1550745165-9bc0b252726f',     // Game development
      '1512941937669-90a1b58e7e9c',  // App development
      '1498050108023-b2e3316420f9',  // Software engineering
    ],
    creative: [
      '1513475382585-d06e58bcb0e0', // Drawing/sketching
      '1541961017774-22349e4a1262', // Painting studio
      '1502920917128-1aa500764cbd', // Photography
      '1574717024653-61fd2cf4d44d', // Video production
      '1510915361894-db8b60106cb1', // Music/guitar
    ],
    fitness: [
      '1544367567-0f2fcb009e0b',     // Yoga/meditation
      '1571019613540-996a69c42d3f', // Pilates/exercise
      '1558618666-fcd25c85cd64',     // Cycling
      '1530549387789-4c1017266635', // Swimming
      '1508700115892-45ecd05ae2ad', // Dance
    ],
    culinary: [
      '1556909114-f6e7ad7d3136',     // Cooking
      '1571115764595-644a1f56a55c', // Baking
      '1555939594-58d7cb561ad1',     // Grilling
      '1546069901-ba9599a7e63c',     // Food prep
      '1565299624946-b28f40a0ca4b', // Professional kitchen
    ],
    learning: [
      '1481627834876-b7833e8f5570', // Reading/books
      '1434030216411-0b793f4b4173', // Language learning
      '1455390582262-044cdead277a', // Writing/calligraphy
      '1544816155-12df9643f363',     // Study/research
      '1507003211169-0a1dd7a7cc52', // Educational content
    ],
    general: [
      '1434030216411-0b793f4b4173', // General learning
      '1481627834876-b7833e8f5570', // Books/knowledge
      '1507003211169-0a1dd7a7cc52', // Creative workspace
      '1541961017774-22349e4a1262', // Artistic pursuits
      '1544367567-0f2fcb009e0b',     // Wellness/growth
    ]
  };
  
  // Get images for the category
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.general;
  
  // Use hobby name to deterministically select an image (consistent for same hobby)
  const hobbyHash = hobby.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = hobbyHash % images.length;
  const selectedImageId = images[imageIndex];
  
  // Add unique timestamp to ensure cache busting while maintaining consistency
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Changes every hour
  
  return `${baseUrl}${selectedImageId}${params}&t=${timestamp}`;
};

// Main function to get hobby image
export const getAutomatedHobbyImage = (hobby: string): HobbyImageConfig => {
  if (!hobby || hobby.trim() === '') {
    console.log('🚨 Empty hobby provided to image generator');
    return {
      hobby: 'unknown',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop',
      category: 'general',
      keywords: []
    };
  }
  
  const normalizedHobby = hobby.toLowerCase().trim();
  const category = getHobbyCategory(normalizedHobby);
  const imageUrl = generateHobbyImageUrl(normalizedHobby, category);
  
  // Extract keywords for better categorization
  const keywords = normalizedHobby.split(/[\s-]+/).filter(word => word.length > 2);
  
  console.log(`🎨 AUTO-GENERATED: "${hobby}" -> category: ${category} -> unique image`);
  
  return {
    hobby: normalizedHobby,
    imageUrl,
    category,
    keywords
  };
};

// Batch processing for multiple hobbies
export const generateHobbyImageBatch = (hobbies: string[]): HobbyImageConfig[] => {
  return hobbies.map(hobby => getAutomatedHobbyImage(hobby));
};

// Cache management for performance
const imageCache = new Map<string, HobbyImageConfig>();

export const getCachedHobbyImage = (hobby: string): HobbyImageConfig => {
  const cacheKey = hobby.toLowerCase().trim();
  
  if (imageCache.has(cacheKey)) {
    console.log(`🎯 CACHE HIT: "${hobby}" -> using cached image`);
    return imageCache.get(cacheKey)!;
  }
  
  const config = getAutomatedHobbyImage(hobby);
  imageCache.set(cacheKey, config);
  console.log(`💾 CACHE STORE: "${hobby}" -> stored for future use`);
  
  return config;
};