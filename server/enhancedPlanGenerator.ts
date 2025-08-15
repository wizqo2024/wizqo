import { supabaseAdmin } from './supabase-db';
import { getTargetedYouTubeVideo, getVideoDetails } from './videoSelection.js';
import { getBestVideoForDay, getGenericVideoFallback } from './youtubeService.js';

interface PlanGenerationRequest {
  hobby: string;
  experience: string;
  timeAvailable: string;
  goal: string;
  userId?: string;
}

interface EnhancedPlan {
  hobby: string;
  title: string;
  overview: string;
  difficulty: string;
  totalDays: number;
  days: Day[];
  userId?: string;
  createdAt?: string;
  id?: string;
}

interface Day {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  howTo: string[];
  checklist: string[];
  tips: string[];
  mistakesToAvoid: string[];
  youtubeVideoId?: string;
  videoTitle?: string;
  estimatedTime: string;
  skillLevel: string;
  freeResources: { title: string; link: string }[];
  affiliateProducts: { title: string; link: string; price: string }[];
}

export class EnhancedPlanGenerator {
  private openRouterApiKey: string;
  private youtubeApiKey: string;

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY || '';
  }

  async generatePlan(request: PlanGenerationRequest): Promise<EnhancedPlan> {
    console.log('🚀 Enhanced Plan Generator: Starting plan generation for', request.hobby);

    try {
      // Step 1: Generate plan with OpenRouter API
      const aiPlan = await this.generateAIPlan(request);
      
      // Step 2: Enhance with YouTube videos
      const planWithVideos = await this.enhanceWithYouTubeVideos(aiPlan, request.hobby);
      
      // Step 3: Add affiliate products and resources
      const enhancedPlan = await this.addAffiliateProducts(planWithVideos, request.hobby);
      
      // Step 4: Save to Supabase if user is logged in
      if (request.userId) {
        const savedPlan = await this.savePlanToSupabase(enhancedPlan, request.userId);
        return savedPlan;
      }

      return enhancedPlan;
    } catch (error) {
      console.error('❌ Enhanced Plan Generator Error:', error);
      return this.generateFallbackPlan(request);
    }
  }

  private async generateAIPlan(request: PlanGenerationRequest): Promise<EnhancedPlan> {
    if (!this.openRouterApiKey) {
      console.log('⚠️ No OpenRouter API key found, using fallback');
      return this.generateFallbackPlan(request);
    }

    try {
      const prompt = this.createOpenRouterPrompt(request);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'HTTP-Referer': 'https://wizqo.com',
          'X-Title': 'Wizqo Hobby Learning Platform'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in OpenRouter response');
      }

      const cleanedContent = this.cleanJsonResponse(content);
      const aiPlan = JSON.parse(cleanedContent);

      // Validate and enhance the plan structure
      return this.validateAndEnhancePlan(aiPlan, request);
    } catch (error) {
      console.error('❌ OpenRouter API Error:', error);
      return this.generateFallbackPlan(request);
    }
  }

  private createOpenRouterPrompt(request: PlanGenerationRequest): string {
    return `Generate a comprehensive 7-day learning plan for learning ${request.hobby}.

User Details:
- Experience level: ${request.experience}
- Time available per day: ${request.timeAvailable}
- Learning goal: ${request.goal}

Return ONLY a JSON object with this exact structure:
{
  "hobby": "${request.hobby}",
  "title": "Master ${request.hobby.charAt(0).toUpperCase() + request.hobby.slice(1)} in 7 Days",
  "overview": "A compelling description of what this 7-day journey will teach you",
  "difficulty": "${request.experience}",
  "totalDays": 7,
  "days": [
    {
      "day": 1,
      "title": "Day title without 'Day X:' prefix",
      "mainTask": "Main learning objective for the day",
      "explanation": "Why this day matters and what you'll accomplish",
      "howTo": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "checklist": ["Action item 1", "Action item 2", "Action item 3", "Action item 4", "Action item 5"],
      "tips": ["Pro tip 1", "Pro tip 2", "Pro tip 3"],
      "mistakesToAvoid": ["Common mistake 1", "Common mistake 2", "Common mistake 3"],
      "estimatedTime": "${request.timeAvailable}",
      "skillLevel": "${request.experience}"
    }
  ]
}

Requirements:
- Make each day build progressively on the previous day
- Include practical, actionable steps
- Focus on hands-on learning and practice
- Ensure the plan is suitable for ${request.experience} level
- Keep explanations clear and motivating
- Make it achievable within ${request.timeAvailable} per day`;
  }

  private async enhanceWithYouTubeVideos(plan: EnhancedPlan, hobby: string): Promise<EnhancedPlan> {
    console.log('🎥 Enhancing plan with YouTube videos for', hobby);

    const enhancedDays = await Promise.all(
      plan.days.map(async (day, index) => {
        try {
          // Try to get targeted video for this specific day
          const videoId = await this.getTargetedVideoForDay(hobby, day.day, day.title);
          
          if (videoId) {
            const videoDetails = await this.getVideoDetails(videoId);
            return {
              ...day,
              youtubeVideoId: videoId,
              videoTitle: videoDetails?.title || `Day ${day.day} Tutorial`
            };
          }
        } catch (error) {
          console.log(`⚠️ Could not get video for day ${day.day}:`, error);
        }

        // Fallback to generic video
        return {
          ...day,
          youtubeVideoId: this.getFallbackVideoId(hobby, index),
          videoTitle: `${hobby} Day ${day.day} Tutorial`
        };
      })
    );

    return {
      ...plan,
      days: enhancedDays
    };
  }

  private async getTargetedVideoForDay(hobby: string, day: number, dayTitle: string): Promise<string | null> {
    if (!this.youtubeApiKey) {
      return null;
    }

    try {
      const searchQuery = `${hobby} tutorial day ${day} ${dayTitle}`;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=1&key=${this.youtubeApiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API failed: ${response.status}`);
      }

      const data = await response.json();
      const video = data.items?.[0];

      if (video) {
        return video.id.videoId;
      }
    } catch (error) {
      console.error('❌ YouTube API Error:', error);
    }

    return null;
  }

  private async getVideoDetails(videoId: string): Promise<{ title: string } | null> {
    if (!this.youtubeApiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.youtubeApiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API failed: ${response.status}`);
      }

      const data = await response.json();
      const video = data.items?.[0];

      if (video) {
        return {
          title: video.snippet.title
        };
      }
    } catch (error) {
      console.error('❌ YouTube API Error:', error);
    }

    return null;
  }

  private getFallbackVideoId(hobby: string, dayIndex: number): string {
    // Fallback video IDs for common hobbies
    const fallbackVideos: { [key: string]: string[] } = {
      guitar: ["3jWRrafhO7M", "F9vWVucRJzo", "7tpQr0Xh6yM", "VJPCkS-wZR4", "kXOcz1_qnXw", "w8L3f3DWlNs", "Qa7GNfwLQJo"],
      cooking: ["dQw4w9WgXcQ", "fBYVFCb1n6s", "L3dDHKjr_P8", "dNGgJa8r_7s", "mGz7d8xB1V8", "K2nV8JGFgh4", "u3JzYrWLJ4E"],
      drawing: ["ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk", "7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0"],
      coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "t_ispmWmdjY", "W6NZfCO5SIk", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
      photography: ["B9FzVhw8_bY", "DJ_DIYDqWGY", "pwmJRx0eJiQ", "R8MzHddV-Z0", "mKY4gUEjAVs", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"],
      painting: ["7BDKWT3pI_A", "vqbOW8K_bsI", "dWMc3Gz9Zd0", "ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk"],
      yoga: ["v7AYKMP6rOE", "xQgP8N7jCrE", "Vg5FeCTzB6w", "h8TKF2_p7qU", "AaF2lpO2IHY", "L9qWnJGJz8Y", "M8Hb2Y5QN3w"]
    };

    const videos = fallbackVideos[hobby.toLowerCase()] || fallbackVideos.cooking;
    return videos[dayIndex % videos.length];
  }

  private async addAffiliateProducts(plan: EnhancedPlan, hobby: string): Promise<EnhancedPlan> {
    console.log('🛒 Adding affiliate products for', hobby);

    // Add affiliate products and free resources to each day
    const enhancedDays = plan.days.map(day => ({
      ...day,
      freeResources: this.getFreeResources(hobby, day.day),
      affiliateProducts: this.getAffiliateProducts(hobby, day.day)
    }));

    return {
      ...plan,
      days: enhancedDays
    };
  }

  private getFreeResources(hobby: string, day: number): { title: string; link: string }[] {
    // Free resources for different hobbies
    const resources: { [key: string]: { title: string; link: string }[] } = {
      guitar: [
        { title: "Guitar Basics - Free Course", link: "https://www.youtube.com/playlist?list=PL3jWRrafhO7M" },
        { title: "Chord Chart Reference", link: "https://www.guitar-chords.org.uk/" },
        { title: "Metronome Practice Tool", link: "https://www.metronomeonline.com/" }
      ],
      cooking: [
        { title: "Cooking Fundamentals", link: "https://www.youtube.com/playlist?list=PLdQw4w9WgXcQ" },
        { title: "Recipe Database", link: "https://www.allrecipes.com/" },
        { title: "Cooking Techniques Guide", link: "https://www.foodnetwork.com/how-to" }
      ],
      drawing: [
        { title: "Drawing Fundamentals", link: "https://www.youtube.com/playlist?list=PLewMksAbPdas" },
        { title: "Reference Images", link: "https://unsplash.com/s/photos/drawing" },
        { title: "Digital Art Tools", link: "https://www.gimp.org/" }
      ]
    };

    return resources[hobby.toLowerCase()] || [
      { title: "Free Learning Resources", link: "https://www.youtube.com" },
      { title: "Community Forums", link: "https://www.reddit.com" }
    ];
  }

  private getAffiliateProducts(hobby: string, day: number): { title: string; link: string; price: string }[] {
    // Placeholder for affiliate products - you can add your Amazon affiliate links here
    const products: { [key: string]: { title: string; link: string; price: string }[] } = {
      guitar: [
        { title: "Beginner Guitar Set", link: "https://amazon.com/dp/B08XXXXXXX", price: "$89.99" },
        { title: "Guitar Tuner", link: "https://amazon.com/dp/B08XXXXXXX", price: "$19.99" },
        { title: "Guitar Stand", link: "https://amazon.com/dp/B08XXXXXXX", price: "$24.99" }
      ],
      cooking: [
        { title: "Chef's Knife Set", link: "https://amazon.com/dp/B08XXXXXXX", price: "$49.99" },
        { title: "Cutting Board", link: "https://amazon.com/dp/B08XXXXXXX", price: "$29.99" },
        { title: "Measuring Cups", link: "https://amazon.com/dp/B08XXXXXXX", price: "$15.99" }
      ],
      drawing: [
        { title: "Sketching Pencil Set", link: "https://amazon.com/dp/B08XXXXXXX", price: "$12.99" },
        { title: "Drawing Paper Pad", link: "https://amazon.com/dp/B08XXXXXXX", price: "$8.99" },
        { title: "Eraser Set", link: "https://amazon.com/dp/B08XXXXXXX", price: "$6.99" }
      ]
    };

    return products[hobby.toLowerCase()] || [
      { title: "Learning Materials", link: "https://amazon.com", price: "$19.99" },
      { title: "Practice Tools", link: "https://amazon.com", price: "$29.99" }
    ];
  }

  private async savePlanToSupabase(plan: EnhancedPlan, userId: string): Promise<EnhancedPlan> {
    try {
      const { data, error } = await supabaseAdmin
        .from('hobby_plans')
        .insert({
          user_id: userId,
          hobby_name: plan.hobby,
          title: plan.title,
          overview: plan.overview,
          plan_data: plan
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase save error:', error);
        return plan; // Return plan without saving if there's an error
      }

      console.log('✅ Plan saved to Supabase with ID:', data.id);
      return {
        ...plan,
        id: data.id,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('❌ Supabase save error:', error);
      return plan;
    }
  }

  private validateAndEnhancePlan(plan: any, request: PlanGenerationRequest): EnhancedPlan {
    // Ensure all required fields are present
    const validatedPlan: EnhancedPlan = {
      hobby: plan.hobby || request.hobby,
      title: plan.title || `Master ${request.hobby} in 7 Days`,
      overview: plan.overview || `A comprehensive 7-day journey to learn ${request.hobby}`,
      difficulty: plan.difficulty || request.experience,
      totalDays: 7,
      days: []
    };

    // Validate and enhance each day
    for (let i = 0; i < 7; i++) {
      const dayData = plan.days?.[i] || {};
      validatedPlan.days.push({
        day: i + 1,
        title: dayData.title || `Day ${i + 1}`,
        mainTask: dayData.mainTask || `Learn ${request.hobby} fundamentals`,
        explanation: dayData.explanation || `Day ${i + 1} of your ${request.hobby} learning journey`,
        howTo: dayData.howTo || [`Step ${i + 1}`],
        checklist: dayData.checklist || [`Complete day ${i + 1} tasks`],
        tips: dayData.tips || [`Tip for day ${i + 1}`],
        mistakesToAvoid: dayData.mistakesToAvoid || [`Avoid rushing on day ${i + 1}`],
        estimatedTime: dayData.estimatedTime || request.timeAvailable,
        skillLevel: dayData.skillLevel || request.experience,
        freeResources: [],
        affiliateProducts: []
      });
    }

    return validatedPlan;
  }

  private generateFallbackPlan(request: PlanGenerationRequest): EnhancedPlan {
    console.log('🔄 Generating fallback plan for', request.hobby);

    const fallbackPlan: EnhancedPlan = {
      hobby: request.hobby,
      title: `Master ${request.hobby.charAt(0).toUpperCase() + request.hobby.slice(1)} in 7 Days`,
      overview: `A structured 7-day journey to learn ${request.hobby} fundamentals and build a solid foundation.`,
      difficulty: request.experience,
      totalDays: 7,
      days: []
    };

    // Generate 7 days of content
    for (let day = 1; day <= 7; day++) {
      fallbackPlan.days.push({
        day,
        title: `Day ${day} - ${this.getDayTitle(request.hobby, day)}`,
        mainTask: `Learn ${this.getDayTask(request.hobby, day)}`,
        explanation: `Day ${day} focuses on ${this.getDayFocus(request.hobby, day)}. This builds on previous days and prepares you for what's next.`,
        howTo: this.getDaySteps(request.hobby, day),
        checklist: this.getDayChecklist(request.hobby, day),
        tips: this.getDayTips(request.hobby, day),
        mistakesToAvoid: this.getDayMistakes(request.hobby, day),
        estimatedTime: request.timeAvailable,
        skillLevel: request.experience,
        youtubeVideoId: this.getFallbackVideoId(request.hobby, day - 1),
        videoTitle: `${request.hobby} Day ${day} Tutorial`,
        freeResources: this.getFreeResources(request.hobby, day),
        affiliateProducts: this.getAffiliateProducts(request.hobby, day)
      });
    }

    return fallbackPlan;
  }

  private getDayTitle(hobby: string, day: number): string {
    const titles: { [key: string]: string[] } = {
      guitar: ["Basic Chords", "Strumming Patterns", "Fingerpicking", "Barre Chords", "Music Theory", "Song Practice", "Performance"],
      cooking: ["Kitchen Basics", "Knife Skills", "Sauces", "Proteins", "Vegetables", "Baking", "Plating"],
      drawing: ["Basic Shapes", "Perspective", "Shading", "Portraits", "Landscapes", "Color Theory", "Composition"],
      coding: ["Variables", "Functions", "Loops", "Arrays", "Objects", "APIs", "Projects"]
    };

    const hobbyTitles = titles[hobby.toLowerCase()] || ["Fundamentals", "Practice", "Techniques", "Advanced", "Mastery", "Refinement", "Perfection"];
    return hobbyTitles[day - 1] || `Day ${day}`;
  }

  private getDayTask(hobby: string, day: number): string {
    return `${this.getDayTitle(hobby, day).toLowerCase()} and practice`;
  }

  private getDayFocus(hobby: string, day: number): string {
    return this.getDayTitle(hobby, day).toLowerCase();
  }

  private getDaySteps(hobby: string, day: number): string[] {
    return [
      `Review day ${day - 1} concepts`,
      `Learn new ${this.getDayTitle(hobby, day).toLowerCase()} techniques`,
      `Practice for ${day * 10} minutes`,
      `Apply what you learned`,
      "Record your progress"
    ];
  }

  private getDayChecklist(hobby: string, day: number): string[] {
    return [
      `Complete day ${day} learning`,
      "Practice for recommended time",
      "Take notes on progress",
      "Prepare for tomorrow",
      "Celebrate small wins"
    ];
  }

  private getDayTips(hobby: string, day: number): string[] {
    return [
      "Take it slow and focus on quality",
      "Practice consistently every day",
      "Don't be afraid to make mistakes",
      "Track your progress regularly"
    ];
  }

  private getDayMistakes(hobby: string, day: number): string[] {
    return [
      "Rushing through exercises",
      "Skipping practice time",
      "Comparing yourself to others",
      "Not taking breaks when needed"
    ];
  }

  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    return cleaned.trim();
  }
}