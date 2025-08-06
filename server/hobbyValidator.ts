// Dynamic hobby validation and support system
import { videoDatabase } from './videoSelection';

// Comprehensive 500+ hobby list from user's complete collection
const validHobbies = [
  // Creative Arts & Crafts (50)
  'painting', 'watercolor', 'acrylic', 'oil painting', 'drawing', 'sketching', 'digital art', 'sculpture', 'pottery', 'ceramics',
  'jewelry making', 'beadwork', 'knitting', 'crocheting', 'embroidery', 'cross-stitch', 'quilting', 'sewing', 'fashion design', 'costume design',
  'woodworking', 'woodcarving', 'furniture making', 'metalworking', 'blacksmithing', 'glassblowing', 'stained glass', 'mosaic art', 'origami', 'paper crafts',
  'scrapbooking', 'card making', 'bookbinding', 'calligraphy', 'hand lettering', 'printmaking', 'screen printing', 'soap making', 'candle making', 'leatherworking',
  'basketweaving', 'macrame', 'tie-dyeing', 'batik', 'fabric painting', 'decoupage', 'resin art', 'wire wrapping', 'stone painting', 'sand art',
  
  // Music & Performance (40)
  'playing piano', 'piano', 'playing guitar', 'guitar', 'playing violin', 'violin', 'playing drums', 'drums', 'playing flute', 'flute',
  'playing saxophone', 'saxophone', 'playing trumpet', 'trumpet', 'playing bass guitar', 'bass guitar', 'playing harmonica', 'harmonica', 'playing ukulele', 'ukulele',
  'playing banjo', 'banjo', 'playing accordion', 'accordion', 'singing', 'songwriting', 'music composition', 'music production', 'dj-ing', 'beatboxing',
  'rapping', 'dancing', 'ballet', 'hip-hop', 'ballroom', 'salsa', 'swing', 'tap', 'acting', 'theater',
  'stand-up comedy', 'improv comedy', 'voice acting', 'puppeteering', 'magic tricks', 'juggling', 'mime', 'storytelling', 'poetry recitation', 'opera singing',
  
  // Sports & Physical Activities (70)
  'running', 'jogging', 'walking', 'hiking', 'rock climbing', 'mountain climbing', 'bouldering', 'swimming', 'diving', 'surfing',
  'skateboarding', 'snowboarding', 'skiing', 'ice skating', 'roller skating', 'cycling', 'mountain biking', 'bmx riding', 'motorcycling', 'tennis',
  'badminton', 'table tennis', 'squash', 'racquetball', 'basketball', 'football', 'soccer', 'baseball', 'softball', 'volleyball',
  'hockey', 'field hockey', 'cricket', 'rugby', 'golf', 'bowling', 'pool', 'billiards', 'darts', 'archery',
  'shooting sports', 'karate', 'taekwondo', 'judo', 'boxing', 'wrestling', 'fencing', 'gymnastics', 'yoga', 'pilates',
  'weightlifting', 'bodybuilding', 'crossfit', 'calisthenics', 'parkour', 'horseback riding', 'polo', 'sailing', 'kayaking', 'canoeing',
  'rowing', 'fishing', 'fly fishing', 'ice fishing', 'hunting', 'camping', 'backpacking', 'geocaching', 'orienteering', 'triathlon',
  
  // Collecting & Hobbies (50)
  'coin collecting', 'stamp collecting', 'postcard collecting', 'book collecting', 'comic book collecting', 'trading card collecting', 'action figure collecting', 'doll collecting', 'toy collecting', 'antique collecting',
  'vintage item collecting', 'record collecting', 'cd collecting', 'movie collecting', 'art collecting', 'jewelry collecting', 'watch collecting', 'mineral collecting', 'rock collecting', 'fossil collecting',
  'seashell collecting', 'butterfly collecting', 'insect collecting', 'plant collecting', 'seed collecting', 'bottle collecting', 'can collecting', 'badge collecting', 'pin collecting', 'patch collecting',
  'magnet collecting', 'spoon collecting', 'thimble collecting', 'keychain collecting', 'snow globe collecting', 'miniature collecting', 'model train collecting', 'car model collecting', 'airplane model collecting', 'ship model collecting',
  'sports memorabilia collecting', 'celebrity memorabilia collecting', 'historical artifact collecting', 'currency collecting', 'ticket stub collecting', 'menu collecting', 'matchbook collecting', 'lighter collecting', 'perfume bottle collecting', 'salt and pepper shaker collecting',
  
  // Games & Puzzles (40)
  'chess', 'checkers', 'backgammon', 'scrabble', 'monopoly', 'risk', 'settlers of catan', 'dungeons & dragons', 'board game collecting', 'poker',
  'bridge', 'blackjack', 'magic: the gathering', 'video gaming', 'retro gaming', 'mobile gaming', 'puzzle solving', 'jigsaw puzzles', 'crossword puzzles', 'sudoku',
  'word searches', 'logic puzzles', 'rubik\'s cube', 'brain teasers', 'trivia', 'quiz competitions', 'escape rooms', 'treasure hunts', 'scavenger hunts', 'riddles',
  'mazes', 'number puzzles', 'pattern puzzles', '3d puzzles', 'mechanical puzzles', 'online gaming', 'game development', 'game design', 'speedcubing', 'puzzle competitions',
  
  // Technology & Digital (30)
  'computer programming', 'coding', 'web development', 'app development', 'game development', '3d modeling', 'animation', 'video editing', 'photo editing', 'graphic design',
  'digital photography', 'drone flying', 'robotics', 'electronics', 'circuit building', 'arduino projects', 'raspberry pi projects', '3d printing', 'virtual reality', 'augmented reality',
  'cryptocurrency', 'blockchain technology', 'artificial intelligence', 'machine learning', 'data science', 'cybersecurity', 'networking', 'system administration', 'tech blogging', 'podcast production',
  
  // Science & Nature (40)
  'astronomy', 'stargazing', 'astrophotography', 'telescope making', 'meteorology', 'weather tracking', 'storm chasing', 'geology', 'mineralogy', 'paleontology',
  'archaeology', 'anthropology', 'biology', 'botany', 'zoology', 'entomology', 'ornithology', 'marine biology', 'ecology', 'environmental science',
  'chemistry experiments', 'physics experiments', 'microscopy', 'laboratory work', 'scientific research', 'nature photography', 'wildlife photography', 'birdwatching', 'animal tracking', 'nature journaling',
  'herbarium making', 'gardening', 'organic gardening', 'hydroponics', 'greenhouse management', 'landscaping', 'tree identification', 'flower arranging', 'beekeeping', 'mushroom hunting',
  
  // Literature & Writing (30)
  'creative writing', 'novel writing', 'short story writing', 'poetry writing', 'screenwriting', 'playwriting', 'journalism', 'blogging', 'technical writing', 'copywriting',
  'content creation', 'editing', 'proofreading', 'translation', 'book reviewing', 'literary criticism', 'reading', 'book clubs', 'library volunteering', 'storytelling',
  'memoir writing', 'biography writing', 'travel writing', 'food writing', 'sports writing', 'science writing', 'historical writing', 'fan fiction', 'letter writing', 'diary keeping',
  
  // Food & Cooking (30)
  'cooking', 'baking', 'pastry making', 'bread making', 'cake decorating', 'chocolate making', 'candy making', 'ice cream making', 'cheese making', 'wine making',
  'beer brewing', 'cocktail mixing', 'coffee roasting', 'tea blending', 'spice grinding', 'preserve making', 'canning', 'smoking meats', 'barbecuing', 'grilling',
  'food photography', 'food styling', 'menu planning', 'restaurant reviewing', 'food blogging', 'nutrition study', 'diet planning', 'foraging', 'urban farming', 'herb gardening',
  
  // Travel & Culture (25)
  'traveling', 'backpacking', 'road trips', 'train travel', 'cruise travel', 'adventure travel', 'cultural immersion', 'language learning', 'cultural exchange', 'photography travel',
  'food tourism', 'wine tourism', 'historical site visiting', 'museum visiting', 'art gallery visiting', 'festival attending', 'concert attending', 'theater attending', 'sports event attending', 'local culture study',
  'traditional craft learning', 'cultural dance learning', 'local music appreciation', 'street art exploration', 'architecture appreciation',
  
  // Health & Wellness (25)
  'meditation', 'mindfulness', 'breathing exercises', 'tai chi', 'qigong', 'reiki', 'massage therapy', 'aromatherapy', 'herbalism', 'nutrition study',
  'fitness training', 'personal training', 'coaching others', 'health coaching', 'life coaching', 'therapy practice', 'counseling', 'support group leading', 'volunteer work', 'community service',
  'charity work', 'fundraising', 'event organizing', 'social activism', 'environmental activism',
  
  // Business & Finance (25)
  'entrepreneurship', 'business planning', 'investing', 'stock trading', 'real estate', 'property management', 'marketing', 'sales', 'public relations', 'event planning',
  'project management', 'leadership development', 'team building', 'networking', 'public speaking', 'presentation skills', 'negotiation', 'consulting', 'coaching', 'mentoring',
  'teaching', 'tutoring', 'training others', 'workshop leading', 'seminar hosting',
  
  // Unique & Unusual (45+)
  'origami', 'balloon twisting', 'face painting', 'henna art', 'nail art', 'hair styling', 'makeup artistry', 'special effects makeup', 'costume making', 'prop making',
  'set design', 'stage management', 'event coordination', 'party planning', 'wedding planning', 'interior design', 'home decorating', 'room organizing', 'journaling', 'bullet journaling',
  'minimalism', 'tiny house building', 'van life', 'off-grid living', 'survival skills', 'bushcraft', 'primitive skills', 'fire making', 'knot tying', 'rope climbing',
  'tree climbing', 'cave exploration', 'metal detecting', 'treasure hunting', 'ghost hunting', 'paranormal investigation', 'urban exploration', 'abandoned place photography', 'street performance', 'busking',
  'flash mob organizing', 'social media influence', 'vlogging', 'streaming', 'podcasting', 'voice over work', 'radio broadcasting'
];

// Common hobby keywords and variations for fuzzy matching
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
  organization: ['organization', 'decluttering', 'minimalism', 'home improvement', 'interior design'],
  // Research & Academic
  research: ['research', 'academic research', 'data research', 'market research', 'science research', 'history research', 'historical research', 'genealogy research', 'archival research', 'history', 'genealogy']
};

// Generic video fallbacks for unsupported hobbies
const genericVideoDatabase = {
  beginner: [
    { videoId: "ewMksAbPdas", title: "Getting Started - Beginner Basics", description: "Fundamental concepts and first steps" },
    { videoId: "EHhHPkb8SXs", title: "Essential Tools and Setup", description: "What you need to get started" },
    { videoId: "lTBoW6iKavc", title: "First Practice Session", description: "Your first hands-on experience" },
    { videoId: "sxJRiYqCkWk", title: "Building Good Habits", description: "Creating a consistent practice routine" },
    { videoId: "5AyOB-LJ7H4", title: "Common Beginner Mistakes", description: "What to avoid as you start" },
    { videoId: "bCerf7NJOlE", title: "Progress Tracking", description: "How to measure your improvement" },
    { videoId: "lDflB-DdiJo", title: "Next Steps Forward", description: "Planning your continued learning" }
  ],
  some: [
    { videoId: "ewMksAbPdas", title: "Intermediate Techniques", description: "Building on your foundation" },
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

// Enhanced hobby validation with comprehensive list
function isValidHobby(input: string): boolean {
  const lowerInput = input.toLowerCase().trim();
  
  // Check against comprehensive hobby list
  return validHobbies.some(hobby => 
    hobby.toLowerCase() === lowerInput ||
    lowerInput.includes(hobby.toLowerCase()) ||
    hobby.toLowerCase().includes(lowerInput)
  );
}

// Smart hobby detection function
function detectBestHobbyMatch(input: string): string | null {
  const lowerInput = input.toLowerCase().trim();
  
  // First check if it's in our comprehensive list
  const exactMatch = validHobbies.find(hobby => hobby.toLowerCase() === lowerInput);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Check for partial matches in comprehensive list
  const partialMatch = validHobbies.find(hobby => 
    hobby.toLowerCase().includes(lowerInput) && lowerInput.length >= 3
  );
  if (partialMatch) {
    return partialMatch;
  }
  
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

// Advanced contextual hobby detection 
function detectContextualHobby(input: string): { hobby: string; category: string } | null {
  const lower = input.toLowerCase().trim();
  
  // Religious and spiritual contexts
  if (lower.includes('quran') || lower.includes('koran') || lower.includes('qoran')) {
    return { hobby: 'quran reading', category: 'religious' };
  }
  
  if (lower.includes('bible') && (lower.includes('read') || lower.includes('study'))) {
    return { hobby: 'bible study', category: 'religious' };
  }
  
  if (lower.includes('meditation') || lower.includes('mindfulness')) {
    return { hobby: 'meditation', category: 'spiritual' };
  }
  
  // Language learning contexts
  if (lower.includes('spanish') && (lower.includes('learn') || lower.includes('study'))) {
    return { hobby: 'spanish language', category: 'languages' };
  }
  
  if (lower.includes('french') && (lower.includes('learn') || lower.includes('study'))) {
    return { hobby: 'french language', category: 'languages' };
  }
  
  // Reading contexts - be specific
  if (lower.includes('reading')) {
    if (lower.includes('quran') || lower.includes('koran')) {
      return { hobby: 'quran reading', category: 'religious' };
    }
    if (lower.includes('books') || lower.includes('novels')) {
      return { hobby: 'book reading', category: 'learning' };
    }
    if (lower.includes('poetry')) {
      return { hobby: 'poetry reading', category: 'art' };
    }
    // Generic reading needs clarification
    return null;
  }
  
  // Cooking contexts
  if (lower.includes('cook') || lower.includes('baking')) {
    if (lower.includes('italian')) return { hobby: 'italian cooking', category: 'cooking' };
    if (lower.includes('indian')) return { hobby: 'indian cooking', category: 'cooking' };
    if (lower.includes('chinese')) return { hobby: 'chinese cooking', category: 'cooking' };
    if (lower.includes('baking')) return { hobby: 'baking', category: 'cooking' };
    return { hobby: 'cooking', category: 'cooking' };
  }
  
  // Music contexts
  if (lower.includes('play') && (lower.includes('guitar') || lower.includes('piano') || lower.includes('violin'))) {
    if (lower.includes('guitar')) return { hobby: 'guitar', category: 'music' };
    if (lower.includes('piano')) return { hobby: 'piano', category: 'music' };
    if (lower.includes('violin')) return { hobby: 'violin', category: 'music' };
  }
  
  // Art contexts
  if (lower.includes('draw') || lower.includes('sketch')) {
    return { hobby: 'drawing', category: 'art' };
  }
  
  if (lower.includes('paint')) {
    return { hobby: 'painting', category: 'art' };
  }
  
  // Photography contexts  
  if (lower.includes('photo')) {
    return { hobby: 'photography', category: 'art' };
  }
  
  // Exercise contexts
  if (lower.includes('yoga')) {
    return { hobby: 'yoga', category: 'fitness' };
  }
  
  if (lower.includes('dance') || lower.includes('dancing')) {
    return { hobby: 'dance', category: 'dance' };
  }
  
  // Swimming contexts
  if (lower.includes('swimming') || lower.includes('swim')) {
    return { hobby: 'swimming', category: 'fitness' };
  }
  
  // Specific hobby detection for common patterns
  if (lower.includes('learn') || lower.includes('study')) {
    // Extract the main subject after learn/study
    const words = lower.split(' ');
    const learnIndex = words.findIndex(w => w.includes('learn') || w.includes('study'));
    if (learnIndex >= 0 && learnIndex < words.length - 1) {
      const subject = words.slice(learnIndex + 1).join(' ');
      if (subject.length > 2) {
        return { hobby: subject, category: 'learning' };
      }
    }
  }
  
  return null;
}

// Helper function to find category for hobby
function findCategoryForHobby(hobby: string): string {
  const lowerHobby = hobby.toLowerCase();
  
  // Creative Arts & Crafts
  const creativeArts = ['knitting', 'crocheting', 'embroidery', 'calligraphy', 'quilling', 'origami', 'macramé', 'upcycling', 'watercolor painting', 'diamond painting', 'pour painting', 'pottery', 'scrapbooking', 'soap making', 'candle making', 'leather crafting', 'jewelry making', 'street art', 'digital art', 'mug painting', 'nail art', 'floral arranging', 'miniature model building', 'bullet journaling', 'creative writing', 'songwriting', 'acting', 'improv comedy', 'urban sketching', 'cosplay', 'vintage collecting'];
  
  // Outdoor & Nature
  const outdoor = ['gardening', 'urban farming', 'foraging', 'bird watching', 'stargazing', 'geocaching', 'hiking', 'camping', 'rock climbing', 'kayaking', 'stand-up paddleboarding', 'wild swimming', 'orienteering', 'beachcombing', 'metal detecting', 'beekeeping', 'aquascaping', 'terrarium building', 'hydroponics', 'urban exploration', 'astrophotography', 'insect collecting', 'mushroom growing'];
  
  // Fitness & Movement
  const fitness = ['parkour', 'rollerblading', 'skateboarding', 'disc golf', 'archery', 'fencing', 'tai chi', 'yoga', 'pilates', 'aerial silks', 'hula hooping', 'jump rope', 'krav maga', 'boxing', 'capoeira', 'dance', 'hip-hop', 'ballroom dancing'];
  
  // Games & Puzzles
  const games = ['chess', 'board gaming', 'puzzle solving', 'escape rooms', 'speedcubing', 'magic tricks', 'larping', 'trivia', 'quiz games', 'debate'];
  
  // Technology
  const tech = ['coding', 'robotics', '3d printing', 'drone flying', 'virtual reality gaming', 'augmented reality exploration', 'podcasting', 'vlogging', 'streaming', 'retro gaming', 'ethical hacking', 'digital nomadism'];
  
  // Culinary
  const culinary = ['cooking', 'baking', 'mixology', 'fermenting', 'cheese making', 'home brewing', 'food photography', 'kombucha brewing'];
  
  // Wellness & Learning
  const wellness = ['astronomy', 'genealogy', 'language learning', 'cryptography', 'philosophy reading', 'book club', 'pen palling', 'journaling', 'meditation', 'sound bathing', 'volunteering', 'letterboxing'];
  
  if (creativeArts.includes(lowerHobby)) return 'Creative Arts';
  if (outdoor.includes(lowerHobby)) return 'Outdoor/Nature';
  if (fitness.includes(lowerHobby)) return 'Fitness';
  if (games.includes(lowerHobby)) return 'Games/Puzzles';
  if (tech.includes(lowerHobby)) return 'Technology';
  if (culinary.includes(lowerHobby)) return 'Culinary';
  if (wellness.includes(lowerHobby)) return 'Wellness';
  
  return 'general';
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
  
  // Check against comprehensive hobby list first
  if (isValidHobby(input)) {
    const exactMatch = validHobbies.find(hobby => hobby.toLowerCase() === input);
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
  
  // Advanced context-aware hobby detection
  const contextualMapping = detectContextualHobby(input);
  if (contextualMapping) {
    console.log('🎯 Contextual mapping found:', contextualMapping);
    return {
      isValid: true,
      normalizedHobby: contextualMapping.hobby,
      category: contextualMapping.category,
      hasVideoSupport: !!videoDatabase[contextualMapping.hobby],
      suggestions: []
    };
  }

  if (['history research', 'historical research', 'research', 'genealogy research', 'archival research', 'history', 'genealogy'].includes(input)) {
    return {
      isValid: true,
      normalizedHobby: 'history research',
      category: 'research',
      hasVideoSupport: false, // Will use generic fallback videos
      suggestions: []
    };
  }
  
  // Only reject completely nonsensical inputs
  const badInputs = ['bye', 'hello', 'hi', 'hey', 'hmm', 'um', 'uh', 'ah', 'ok', 'okay', 'yes', 'no', 'maybe', 'test', 'testing', '', 'null', 'undefined', 'admin', 'root', 'cool', 'nice', 'good', 'bad'];
  if (badInputs.includes(input) || input.length < 2) {
    return { 
      isValid: false, 
      normalizedHobby: '', 
      category: null, 
      hasVideoSupport: false,
      suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance', 'quran reading', 'swimming']
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