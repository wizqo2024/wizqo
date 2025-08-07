import fetch from 'node-fetch';

interface ValidationResponse {
  isValid: boolean;
  correctedHobby?: string;
  suggestions?: string[];
  reasoning?: string;
}

export class OpenRouterHobbyValidator {
  private openRouterKey: string;
  private deepSeekKey: string;
  private baseUrl: string;
  private validationCache: Map<string, { result: ValidationResponse; timestamp: number }> = new Map();
  private cacheExpiryMs = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY || '';
    this.deepSeekKey = process.env.DEEPSEEK_API_KEY || '';
    
    // Prefer OpenRouter, fallback to DeepSeek
    if (this.openRouterKey) {
      this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    } else {
      this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
    }
    
    if (!this.openRouterKey && !this.deepSeekKey) {
      console.warn('⚠️ No AI API key found - hobby validation will be limited');
    }
  }

  async validateHobby(userInput: string): Promise<ValidationResponse> {
    const cacheKey = userInput.toLowerCase().trim();
    
    // SAFETY CHECK FIRST - Check for dangerous/harmful hobby inputs
    const dangerousHobbyResult = this.checkDangerousHobby(cacheKey);
    if (dangerousHobbyResult) {
      console.log(`⚠️ DANGEROUS hobby input blocked: ${userInput}`);
      return dangerousHobbyResult;
    }
    
    // Check for hardcoded complex hobbies (override AI inconsistency)
    const complexHobbyResult = this.checkComplexHobby(cacheKey);
    if (complexHobbyResult) {
      console.log(`🚫 Complex hobby detected: ${userInput}`);
      return complexHobbyResult;
    }
    
    // Check cache first for consistency
    const cached = this.validationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiryMs) {
      console.log(`📋 Using cached validation for: ${userInput}`);
      return cached.result;
    }
    
    const apiKey = this.openRouterKey || this.deepSeekKey;
    if (!apiKey) {
      return this.fallbackValidation(userInput);
    }

    try {
      console.log(`🔍 ${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'}: Validating hobby input:`, userInput);

      const prompt = `You are a hobby and activity expert. Analyze this user input and determine if it's a valid hobby or activity that someone can learn in 7 days.

SAFETY FIRST: Immediately reject any input related to violence, weapons, explosives, illegal activities, drugs, harm to others or self, or any dangerous/harmful content. Only approve safe, positive learning activities.

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
- Inappropriate content
- Overly complex activities  
- Nonsense words
- Things that aren't hobbies

For misspellings of valid hobbies, provide the corrected spelling in correctedHobby.
For dangerous or completely invalid inputs, suggest 3 safe, legitimate hobbies instead.`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
      
      // Add OpenRouter specific headers if using OpenRouter
      if (this.openRouterKey) {
        headers['HTTP-Referer'] = 'https://wizqo.com';
        headers['X-Title'] = 'Wizqo Hobby Learning Platform';
      }
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.openRouterKey ? 'deepseek/deepseek-chat' : 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'} API error:`, response.status, response.statusText);
        return this.fallbackValidation(userInput);
      }

      const data = await response.json() as any;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'}: No content in response`);
        return this.fallbackValidation(userInput);
      }

      try {
        // Clean the response - OpenRouter sometimes wraps JSON in markdown code blocks
        const cleanedContent = this.cleanJsonResponse(content);
        const result = JSON.parse(cleanedContent) as ValidationResponse;
        console.log(`✅ ${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'} validation result:`, result);
        
        // Cache the result for consistency
        this.validationCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        
        return result;
      } catch (parseError) {
        console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'}: Failed to parse JSON response:`, parseError);
        console.error('Raw content:', content);
        return this.fallbackValidation(userInput);
      }

    } catch (error) {
      console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'} validation error:`, error);
      return this.fallbackValidation(userInput);
    }
  }

  private checkDangerousHobby(input: string): ValidationResponse | null {
    // List of dangerous/harmful activities that should be rejected
    const dangerousKeywords = [
      // Explosives & weapons
      'bomb', 'explosive', 'dynamite', 'grenade', 'weapon', 'gun', 'rifle', 'pistol',
      'ammunition', 'bullet', 'gunpowder', 'tnt', 'c4', 'molotov', 'missile', 'rocket launcher',
      
      // Violence & harm
      'killing', 'murder', 'assassination', 'torture', 'violence', 'fighting', 'stabbing',
      'shooting', 'attacking', 'hurting', 'harm', 'injury', 'wound', 'bloodshed',
      
      // Illegal substances & activities
      'drug', 'cocaine', 'heroin', 'methamphetamine', 'meth', 'lsd', 'ecstasy', 'marijuana production',
      'counterfeiting', 'forgery', 'fraud', 'scam', 'theft', 'robbery', 'burglary',
      'hacking', 'cyber attack', 'virus creation', 'malware',
      
      // Dangerous chemicals & activities
      'poison', 'toxic', 'radioactive', 'biological weapon', 'chemical weapon',
      'acid attack', 'arson', 'fire setting', 'burning things', 'destruction',
      
      // Self-harm & dangerous activities
      'suicide', 'self harm', 'cutting', 'overdose', 'dangerous stunt',
      'extreme danger', 'life threatening',
      
      // Illegal activities
      'smuggling', 'trafficking', 'blackmail', 'extortion', 'kidnapping',
      'identity theft', 'money laundering', 'tax evasion'
    ];
    
    // Check if input contains any dangerous keywords
    const containsDangerousContent = dangerousKeywords.some(keyword => 
      input.includes(keyword) || input.includes(keyword.replace(' ', ''))
    );
    
    // Also check for suspicious patterns
    const suspiciousPatterns = [
      /how to (kill|hurt|harm|attack|murder)/, // "how to kill/hurt someone"
      /making (bombs?|explosives?|weapons?)/, // "making bombs/weapons"
      /create (poison|virus|malware)/, // "create poison/virus"
      /(illegal|criminal|unlawful) (activity|activities)/, // "illegal activities"
      /dangerous (experiments?|chemicals?)/ // "dangerous experiments"
    ];
    
    const matchesSuspiciousPattern = suspiciousPatterns.some(pattern => 
      pattern.test(input)
    );
    
    if (containsDangerousContent || matchesSuspiciousPattern) {
      return {
        isValid: false,
        suggestions: ['cooking', 'gardening', 'reading', 'drawing', 'music', 'photography'],
        reasoning: 'This input contains harmful or dangerous content. We only support safe, positive learning activities. Please try one of our suggested hobbies instead!'
      };
    }
    
    return null;
  }

  private checkComplexHobby(input: string): ValidationResponse | null {
    const complexHobbies: { [key: string]: string[] } = {
      'robotics': ['electronics tinkering', 'programming basics', 'model building'],
      'brain surgery': ['first aid training', 'medical terminology', 'anatomy drawing'],
      'rocket engineering': ['model rockets', 'physics basics', 'aerospace history'],
      'nuclear physics': ['physics basics', 'chemistry', 'science experiments'],
      'heart surgery': ['first aid training', 'anatomy drawing', 'medical terminology'],
      'architecture': ['home design', 'interior design', 'sketching'],
      'app development': ['coding basics', 'web design', 'computer skills'],
      'game development': ['coding basics', 'digital art', 'storytelling'],
      'artificial intelligence': ['programming basics', 'data analysis', 'logic puzzles'],
      'machine learning': ['programming basics', 'statistics', 'data analysis'],
      'neurosurgery': ['first aid training', 'anatomy drawing', 'medical terminology'],
      'rocket science': ['model rockets', 'physics basics', 'astronomy'],
      'quantum physics': ['physics basics', 'mathematics', 'science experiments']
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

  private fallbackValidation(userInput: string): ValidationResponse {
    const validHobbies = [
      'guitar', 'piano', 'violin', 'drums', 'singing',
      'cooking', 'baking', 'grilling', 'meal prep',
      'drawing', 'painting', 'sketching', 'watercolor', 'digital art',
      'photography', 'videography', 'photo editing',
      'yoga', 'pilates', 'meditation', 'stretching',
      'gardening', 'plant care', 'hydroponics',
      'knitting', 'crocheting', 'sewing', 'embroidery',
      'reading', 'writing', 'journaling', 'poetry',
      'dance', 'salsa', 'ballet', 'hip hop',
      'coding', 'programming', 'web design',
      'woodworking', 'pottery', 'jewelry making',
      'origami', 'calligraphy', 'lettering',
      'fitness', 'running', 'cycling', 'swimming',
      'history research', 'research', 'history', 'genealogy', 'archival research'
    ];

    const input = userInput.toLowerCase().trim();
    
    // Direct match
    if (validHobbies.includes(input)) {
      return {
        isValid: true,
        reasoning: 'Direct match with known hobby'
      };
    }

    // Fuzzy matching for common misspellings
    const fuzzyMatches = validHobbies.filter(hobby => 
      this.calculateSimilarity(input, hobby) > 0.7
    );

    if (fuzzyMatches.length > 0) {
      return {
        isValid: true,
        correctedHobby: fuzzyMatches[0],
        reasoning: 'Corrected spelling of valid hobby'
      };
    }

    // Check if it contains a valid hobby word
    const partialMatch = validHobbies.find(hobby => 
      input.includes(hobby) || hobby.includes(input)
    );

    if (partialMatch) {
      return {
        isValid: true,
        correctedHobby: partialMatch,
        reasoning: 'Extracted valid hobby from input'
      };
    }

    // Invalid - suggest alternatives
    const suggestions = this.getRandomHobbies(3);
    return {
      isValid: false,
      suggestions,
      reasoning: 'Input does not match any known hobby'
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
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

  private cleanJsonResponse(content: string): string {
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

  private getRandomHobbies(count: number): string[] {
    const suggestions = ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'gardening', 'reading', 'painting'];
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

export const hobbyValidator = new OpenRouterHobbyValidator();