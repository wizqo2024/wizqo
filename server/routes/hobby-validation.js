const express = require('express');
const router = express.Router();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Smart hobby validation using AI
router.post('/validate-hobby', async (req, res) => {
  try {
    const { hobby } = req.body;
    
    if (!hobby || typeof hobby !== 'string') {
      return res.status(400).json({ 
        isValid: false, 
        error: 'Invalid hobby input' 
      });
    }

    // If no OpenRouter API key, use basic validation
    if (!OPENROUTER_API_KEY) {
      return res.json(await basicHobbyValidation(hobby));
    }

    // Use OpenRouter API for smart validation
    const aiValidation = await validateHobbyWithAI(hobby);
    
    if (aiValidation.isValid) {
      return res.json(aiValidation);
    }

    // Fallback to basic validation
    const basicValidation = await basicHobbyValidation(hobby);
    return res.json(basicValidation);

  } catch (error) {
    console.error('Hobby validation error:', error);
    
    // Fallback to basic validation on error
    const basicValidation = await basicHobbyValidation(req.body.hobby);
    return res.json(basicValidation);
  }
});

// AI-powered hobby validation using OpenRouter
async function validateHobbyWithAI(hobby) {
  try {
    const prompt = `Analyze this hobby input and provide smart validation:

Input: "${hobby}"

Please determine:
1. Is this a valid hobby that can be learned in 7 days?
2. What category does it belong to?
3. Suggest a corrected/related hobby if needed
4. Provide confidence level (0-1)

Consider:
- Typos and misspellings
- Synonyms and variations
- Related hobbies
- Complexity level for 7-day learning
- Safety and appropriateness

Respond in JSON format:
{
  "isValid": boolean,
  "suggestion": "string",
  "category": "string", 
  "confidence": number,
  "reasoning": "string"
}`;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wizqo.com',
        'X-Title': 'WizQo Hobby App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content from AI');
    }

    // Parse AI response
    try {
      const aiResult = JSON.parse(content);
      return {
        isValid: aiResult.isValid || false,
        suggestion: aiResult.suggestion || hobby,
        category: aiResult.category || 'general',
        confidence: aiResult.confidence || 0.5,
        reasoning: aiResult.reasoning || 'AI analysis completed'
      };
    } catch (parseError) {
      console.error('AI response parse error:', parseError);
      return await basicHobbyValidation(hobby);
    }

  } catch (error) {
    console.error('AI validation error:', error);
    return await basicHobbyValidation(hobby);
  }
}

// Basic hobby validation (fallback)
async function basicHobbyValidation(hobby) {
  const cleanHobby = hobby.toLowerCase().trim();
  
  // Hobby categories and mappings
  const hobbyCategories = {
    arts: ['drawing', 'painting', 'photography', 'sketching', 'calligraphy'],
    music: ['guitar', 'piano', 'singing', 'drums', 'violin', 'ukulele'],
    tech: ['coding', 'programming', 'robotics', 'electronics'],
    fitness: ['yoga', 'running', 'swimming', 'cycling', 'dance'],
    nature: ['gardening', 'hiking', 'camping', 'fishing'],
    culinary: ['cooking', 'baking', 'coffee', 'grilling'],
    creative: ['writing', 'journaling', 'crafting', 'knitting']
  };

  // Common variations and synonyms
  const hobbyVariations = {
    'coffee making': 'coffee',
    'coffee brewing': 'coffee',
    'canva editing': 'design',
    'graphic design': 'design',
    'prompt engineering': 'coding',
    'ai prompting': 'coding',
    'botanic': 'gardening',
    'botany': 'gardening',
    'plant care': 'gardening',
    'noodles': 'cooking',
    'pasta making': 'cooking',
    'sing': 'singing',
    'tajweed': 'recitation',
    'quran recitation': 'recitation'
  };

  // Check for variations first
  if (hobbyVariations[cleanHobby]) {
    return {
      isValid: true,
      suggestion: hobbyVariations[cleanHobby],
      category: 'variation',
      confidence: 0.9
    };
  }

  // Check if it's a recognized hobby
  for (const [category, hobbies] of Object.entries(hobbyCategories)) {
    if (hobbies.includes(cleanHobby)) {
      return {
        isValid: true,
        suggestion: cleanHobby,
        category: category,
        confidence: 0.95
      };
    }
  }

  // Check for partial matches
  for (const [category, hobbies] of Object.entries(hobbyCategories)) {
    for (const hobbyItem of hobbies) {
      if (hobbyItem.includes(cleanHobby) || cleanHobby.includes(hobbyItem)) {
        return {
          isValid: true,
          suggestion: hobbyItem,
          category: category,
          confidence: 0.8
        };
      }
    }
  }

  // Not recognized
  return {
    isValid: false,
    suggestion: 'Try a specific hobby like photography, guitar, cooking, or drawing',
    category: 'unknown',
    confidence: 0.3
  };
}

module.exports = router;