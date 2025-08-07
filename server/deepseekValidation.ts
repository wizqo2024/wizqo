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
    const apiKey = this.openRouterKey || this.deepSeekKey;
    if (!apiKey) {
      return this.fallbackValidation(userInput);
    }

    try {
      console.log(`🔍 ${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'}: Validating hobby input:`, userInput);

      const prompt = `You are a hobby and activity expert. Analyze this user input and determine if it's a valid hobby or activity that someone can learn in 7 days.

User input: "${userInput}"

Respond with JSON only:
{
  "isValid": boolean,
  "correctedHobby": "string (only if correction needed)",
  "suggestions": ["array of 3 similar valid hobbies if input is invalid"],
  "reasoning": "brief explanation"
}

Valid hobbies are learnable activities like: guitar, cooking, drawing, yoga, photography, knitting, gardening, etc.
Invalid inputs include: nonsense words, inappropriate content, overly complex activities, or things that aren't hobbies.

For misspellings, provide the corrected spelling in correctedHobby.
For completely invalid inputs, suggest 3 similar legitimate hobbies.`;

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
        const result = JSON.parse(content) as ValidationResponse;
        console.log(`✅ ${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'} validation result:`, result);
        return result;
      } catch (parseError) {
        console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'}: Failed to parse JSON response:`, parseError);
        return this.fallbackValidation(userInput);
      }

    } catch (error) {
      console.error(`${this.openRouterKey ? 'OpenRouter' : 'DeepSeek'} validation error:`, error);
      return this.fallbackValidation(userInput);
    }
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

  private getRandomHobbies(count: number): string[] {
    const suggestions = ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'gardening', 'reading', 'painting'];
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

export const hobbyValidator = new OpenRouterHobbyValidator();