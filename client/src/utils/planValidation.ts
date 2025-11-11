// Plan validation utilities
// Extracted from SplitPlanInterface.tsx for better organization

// Constants for hobby validation
const SAFE_HOBBIES = Array.from(new Set([
  'photography','smartphone photography','photo editing','video editing',
  'guitar','piano','ukulele','violin','drums','harmonica','singing','music production','dj mixing','beatboxing',
  'cooking','baking','bread baking','sourdough','coffee brewing','latte art','tea tasting',
  'drawing','sketching','painting','watercolor','acrylic painting','oil painting','calligraphy','hand lettering','graphic design','logo design','animation','3d modeling',
  'origami','paper crafts','pottery','ceramics','woodworking','carpentry','leathercraft','knitting','crochet','sewing','embroidery','quilting','quilling','jewelry making',
  'candle making','soap making','resin art','gardening','indoor plants','succulents','bonsai','terrarium building',
  'yoga','meditation','pilates','calisthenics','weight training','running','cycling','hiking','swimming','jump rope',
  'table tennis','badminton','basketball shooting','football juggling','chess','rubiks cube','speed cubing','sudoku','crossword puzzles',
  'blogging','journaling','creative writing','poetry','public speaking','language learning','spanish language','french language','german language','japanese language','korean language',
  'coding','web development','app development','game development','bird watching','astronomy','stargazing','kite flying','calligraphy practice','reading',
  // Adding missing popular tech/design hobbies
  'robotics','electronics','arduino','raspberry pi','circuit design','soldering','3d printing','laser cutting',
  'canva editing','design','ui design','ux design','web design','mobile design','app design','logo design',
  'prompt engineering','ai art','digital art','digital painting','vector art','illustration','comic art',
  'botanic','botany','plant care','indoor gardening','hydroponics','aquaponics',
  'noodles','pasta making','asian cooking','thai cooking','chinese cooking','japanese cooking',
  'sing','vocal training','voice training','karaoke','music theory','songwriting',
  'tajweed','quran recitation','islamic studies','religious studies','meditation','mindfulness'
]));

const SYNONYMS: Record<string, string> = {
  'art':'drawing', 'sketch':'sketching', 'photos':'photography','camera':'photography','photo':'photography',
  'chef':'cooking','recipes':'cooking','cook':'cooking','dev':'coding','development':'coding','software':'coding',
  'write':'creative writing','blog':'blogging','blogging':'blogging','speak':'public speaking',
  'arabic':'language learning','quran':'quran reading','koran':'quran reading','holy book':'religious reading','holybook':'religious reading',
  // Adding synonyms for new hobbies
  'canva':'canva editing','design tool':'canva editing','graphic tool':'canva editing',
  'robot':'robotics','bot':'robotics','automation':'robotics',
  'electronic':'electronics','circuit':'electronics','arduino project':'arduino',
  'prompt':'prompt engineering','ai prompt':'prompt engineering','chatgpt':'prompt engineering',
  'botanic':'botany','plant':'botany','grow':'gardening',
  'noodle':'noodles','pasta':'noodles','asian food':'asian cooking',
  'singing':'sing','voice':'vocal training','karaoke':'sing',
  'tajweed':'quran recitation','islamic':'islamic studies'
};

const BANNED = [
  'sex','sexual','porn','pornography','nsfw','nude','erotic','fetish','escort','prostitution','blowjob','anal','rape','incest','hentai',
  'drug','cocaine','heroin','meth','weed','marijuana','steroid','mdma','lsd','psychedelic','suicide','self-harm','bomb','weapon','gun','kill','murder'
];

const COMPLEX_HOBBY_SUGGESTIONS: Record<string, string[]> = {
  'tajweed': ['quran reading', 'islamic studies', 'religious reading', 'meditation', 'mindfulness'],
  'robotics': ['electronics', 'arduino', 'circuit design', 'coding', 'web development'],
  'ai art': ['digital art', 'digital painting', 'illustration', 'design', 'canva editing'],
  'prompt engineering': ['coding', 'web development', 'app development', 'digital art'],
  'botany': ['gardening', 'indoor plants', 'succulents', 'plant care', 'terrarium building'],
  'noodles': ['cooking', 'asian cooking', 'pasta making', 'baking', 'coffee brewing'],
  'sing': ['vocal training', 'karaoke', 'music theory', 'piano', 'guitar']
};

const LEGITIMATE_EXCEPTIONS = ['tajweed', 'tajweed practice', 'quran tajweed'];

// Helper functions
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const editDistance = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
};

// AI validation function
export async function validateHobbyWithAI(input: string): Promise<{ isValid: boolean; suggestion?: string; category?: string; confidence?: number }> {
  try {
    const response = await fetch('/api/validate-hobby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby: input })
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      console.error(`❌ AI validation failed:`, response.status);
      return { isValid: false };
    }
  } catch (error) {
    console.error(`❌ AI validation error:`, error);
    return { isValid: false };
  }
}

// Main validation function
export async function validateAndProcessHobby(input: string): Promise<{ isValid: boolean; detectedHobbies?: string[]; suggestions?: string[]; unsafe?: boolean; reason?: string }> {
  const text = normalize(input);

  // Phrase-level normalization for multi-word/double-word inputs BEFORE tokenization
  const phraseMaps: Array<{ pattern: RegExp; to: string }> = [
    // Religious/reading
    { pattern: /\b(reading\s+(quran|koran))\b/g, to: 'quran reading' },
    { pattern: /\breading\s+bible\b/g, to: 'bible reading' },
    { pattern: /\breading\s+(holy\s+book|holybook|religious|sacred)\b/g, to: 'religious reading' },
    // Instruments
    { pattern: /\b(playing|learn(ing)?)\s+guitar\b/g, to: 'guitar' },
    { pattern: /\b(playing|learn(ing)?)\s+piano\b/g, to: 'piano' },
    { pattern: /\b(playing|learn(ing)?)\s+violin\b/g, to: 'violin' },
    { pattern: /\b(playing|learn(ing)?)\s+drum(s)?\b/g, to: 'drums' },
    // Dev/tech
    { pattern: /\b(full\s*stack|fullstack)\b/g, to: 'web development' },
    { pattern: /\b(game\s+dev(elopment)?|gamedev)\b/g, to: 'game development' },
    { pattern: /\b(app\s+dev(elopment)?|appdev)\b/g, to: 'app development' },
    { pattern: /\b(ai|artificial\s+intelligence)\b/g, to: 'coding' },
    { pattern: /\b(machine\s+learning|deep\s+learning)\b/g, to: 'coding' },
    // Photography
    { pattern: /\b(digital\s+photo(graphy)?)\b/g, to: 'digital photography' },
    { pattern: /\b(photo(graphy)?|camera\b)/g, to: 'photography' },
    // Reading variants
    { pattern: /\b(reading\s+novel)\b/g, to: 'novel reading' },
    { pattern: /\b(reading\s+poetry)\b/g, to: 'poetry reading' },
    // Fitness
    { pattern: /\b(workout|gym)\b/g, to: 'fitness' },
    // Cooking
    { pattern: /\b(pastry)\b/g, to: 'baking' }
  ];
  
  let normalizedText = text;
  for (const m of phraseMaps) {
    normalizedText = normalizedText.replace(m.pattern, m.to);
  }

  // Safety check - Check for exact word boundaries, not substrings
  const words = normalizedText.split(' ');
  for (const term of BANNED) {
    if (words.includes(term)) {
      return {
        isValid: false,
        unsafe: true,
        reason: 'unsafe',
        suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding']
      };
    }
  }
  
  // Special exceptions for legitimate hobbies that might contain banned substrings
  if (LEGITIMATE_EXCEPTIONS.includes(normalizedText)) {
    // Skip safety check for legitimate exceptions
  } else {
    // Additional check for banned terms as substrings (but be more careful)
    for (const term of BANNED) {
      if (normalizedText.includes(term) && !LEGITIMATE_EXCEPTIONS.some(exception => normalizedText.includes(exception))) {
        return {
          isValid: false,
          unsafe: true,
          reason: 'unsafe',
          suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding']
        };
      }
    }
  }

  // Extract candidates (split by delimiters and handle multi-words)
  const rawTokens = normalizedText.split(/[,/&]|\band\b|\bwith\b|\bfor\b/).map(t => normalize(t)).filter(Boolean);
  const candidates: string[] = [];
  for (const token of rawTokens) {
    if (!token) continue;
    // direct match
    if (SAFE_HOBBIES.includes(token)) candidates.push(token);
    // synonym map by words
    const words = token.split(' ');
    for (const w of words) {
      if (SYNONYMS[w]) candidates.push(SYNONYMS[w]);
    }
    // generate bigrams/trigrams to catch multi-word hobbies
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(words.length, i + 3); j++) {
        const phrase = words.slice(i, j).join(' ');
        if (SAFE_HOBBIES.includes(phrase)) candidates.push(phrase);
      }
    }
  }

  // Fuzzy match helper
  const fuzzySuggest = (phrase: string): string | null => {
    let best: { h: string; d: number } | null = null;
    for (const h of SAFE_HOBBIES) {
      const d = editDistance(phrase, h);
      if (!best || d < best.d) best = { h, d };
    }
    if (best && best.d <= Math.max(1, Math.floor(best.h.length * 0.25))) return best.h;
    return null;
  };

  // If nothing detected, try fuzzy suggestions
  let detected = Array.from(new Set(candidates));
  if (detected.length === 0) {
    const words = normalizedText.split(' ');
    const phrases = new Set<string>();
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(words.length, i + 3); j++) {
        const p = words.slice(i, j).join(' ');
        if (p.length > 2) phrases.add(p);
      }
    }
    const sug: string[] = [];
    for (const p of phrases) {
      const s = fuzzySuggest(p);
      if (s && !sug.includes(s)) sug.push(s);
      if (sug.length >= 5) break;
    }
    if (sug.length > 0) return { isValid: false, suggestions: sug };
  }

  // Vague input handling
  const vagueTerms = ['fun','interesting','creative','cool','nice','good'];
  if (vagueTerms.some(term => normalizedText.includes(term)) && detected.length === 0) {
    return { isValid: false, suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding'] };
  }
  
  // Check if input matches any complex hobby patterns
  for (const [complexHobby, suggestions] of Object.entries(COMPLEX_HOBBY_SUGGESTIONS)) {
    if (normalizedText.includes(complexHobby) || editDistance(normalizedText, complexHobby) <= 2) {
      console.log(`🎯 Complex hobby detected: "${input}" → suggesting alternatives:`, suggestions);
      return { 
        isValid: false, 
        suggestions: suggestions,
        reason: 'complex_hobby'
      };
    }
  }

  // Block arbitrary alphabetic strings (like "haaa", "test", etc.)
  const isArbitraryString = (str: string) => {
    // Check if it's just repeated characters or random letters
    const uniqueChars = new Set(str.split(''));
    const isRepeated = uniqueChars.size <= 2 && str.length > 3;
    const isRandomLetters = /^[a-z]{3,}$/.test(str) && !SAFE_HOBBIES.some(hobby => 
      hobby.includes(str) || str.includes(hobby) || editDistance(str, hobby) <= 2
    );
    return isRepeated || isRandomLetters;
  };

  if (detected.length === 0 && isArbitraryString(normalizedText)) {
    return { 
      isValid: false, 
      suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding','reading','writing','meditation'] 
    };
  }

  // Final fallback: Try AI validation for unrecognized inputs
  if (detected.length === 0) {
    try {
      const aiResult = await validateHobbyWithAI(input);
      
      if (aiResult.isValid && aiResult.suggestion) {
        return { 
          isValid: true, 
          detectedHobbies: [aiResult.suggestion],
          suggestions: [aiResult.suggestion]
        };
      }
    } catch (aiError) {
      console.error(`❌ AI validation error:`, aiError);
    }
  }

  return { isValid: detected.length > 0, detectedHobbies: detected };
}

// Utility function to highlight hobby names in text
export function highlightHobby(text: string, hobby: string): string {
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escape(hobby)})`, 'gi');
  return text.replace(re, '<span style="background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 0.25rem 0.5rem; border-radius: 0.5rem; font-weight: 600; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">$1</span>');
}
