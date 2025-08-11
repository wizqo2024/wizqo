
import { hobbyValidator } from '../server/openrouterValidation.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { hobby } = req.body;
    
    if (!hobby) {
      return res.status(400).json({ error: 'Hobby is required' });
    }

    const cleanHobby = hobby.replace(/["']/g, '').trim();
    console.log('🔍 Validating hobby:', cleanHobby);
    
    // Use the OpenRouter validation system
    const validation = await hobbyValidator.validateHobby(cleanHobby);
    console.log('🔍 Validation result:', validation);
    
    // Ensure proper response format for frontend
    const response = {
      isValid: validation.isValid,
      correctedHobby: validation.correctedHobby,
      originalHobby: cleanHobby,
      suggestions: validation.suggestions || [],
      reasoning: validation.reasoning
    };
    
    console.log('🔍 Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Hobby validation error:', error);
    res.status(500).json({ error: 'Failed to validate hobby' });
  }
}
