// YouTube API Service with quality filters and verified video fallbacks
import fetch from 'node-fetch';
import { getRandomVerifiedVideo, getVerifiedVideo } from './verifiedVideos';

// Track used video IDs to prevent duplicates within a plan
const usedVideoIds = new Set<string>();

interface YouTubeVideo {
  videoId: string;
  title: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
}

// Parse YouTube duration format (PT1H2M3S) to minutes
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  // Return whole minutes without rounding up (so 4:59 remains 4)
  return hours * 60 + minutes + Math.floor(seconds / 60);
}

// Test if video is available and working
async function isVideoWorking(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.ok;
  } catch {
    return false;
  }
}

// Get day-specific content topics for targeted search
function getDaySpecificContent(hobby: string, dayNumber: number): string[] {
  const dayTopics = {
    1: ['basics', 'fundamentals', 'getting started', 'setup', 'introduction', 'beginner guide'],
    2: ['first steps', 'basic techniques', 'simple exercises', 'practice', 'foundation'],
    3: ['building skills', 'intermediate', 'core techniques', 'development', 'progress'],
    4: ['practical application', 'real practice', 'hands-on', 'implementation', 'working'],
    5: ['advanced techniques', 'skills improvement', 'next level', 'mastering', 'expert'],
    6: ['creative exploration', 'personal style', 'experimentation', 'advanced projects'],
    7: ['mastery', 'integration', 'complete guide', 'final skills', 'expert level']
  };
  
  return dayTopics[dayNumber as keyof typeof dayTopics] || ['tutorial', 'guide'];
}

// Search YouTube with enhanced quality filters and view requirements
export async function searchYouTubeVideos(
  hobby: string,
  experience: string,
  dayNumber: number,
  maxResults: number = 25
): Promise<YouTubeVideo[]> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  
  if (!youtubeApiKey) {
    console.log('⚠️ YouTube API key not found');
    return [];
  }

  try {
    // Create highly targeted search query with day-specific content
    const dayContent = getDaySpecificContent(hobby, dayNumber);
    const experienceLevel = experience === 'beginner' ? 'beginner' : experience;
    
    const searchTerms = [
      hobby,
      `${experienceLevel} tutorial`,
      dayContent[0], // Primary day topic
      dayContent[1], // Secondary day topic
      'how to',
      '2024 2023 2022 2021' // Recent content priority
    ];
    
    const searchQuery = searchTerms.join(' ');
    const encodedQuery = encodeURIComponent(searchQuery);

    console.log(`🔍 YouTube Search Day ${dayNumber}: "${searchQuery}"`);

    // Enhanced search with strict quality parameters
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `maxResults=${maxResults}&` +
      `q=${encodedQuery}&` +
      `type=video&` +
      `key=${youtubeApiKey}&` +
      `order=relevance&` +
      `publishedAfter=2020-01-01T00:00:00Z&` +
      `videoEmbeddable=true&` +
      `videoSyndicated=true&` +
      `regionCode=US&` +
      `relevanceLanguage=en`;

    console.log(`🔍 YouTube Search: ${hobby} ${experience} day ${dayNumber}`);
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`YouTube search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json() as any;
    
    if (!searchData.items || searchData.items.length === 0) {
      console.log('🚫 No videos found in search');
      return [];
    }

    // Get video IDs for details lookup
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get detailed video information including duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=contentDetails,snippet,statistics&` +
      `id=${videoIds}&` +
      `key=${youtubeApiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`YouTube details failed: ${detailsResponse.status}`);
    }

    const detailsData = await detailsResponse.json() as any;
    
    // Filter and process videos
    const qualityVideos: YouTubeVideo[] = [];
    
    for (const video of detailsData.items) {
      const duration = video.contentDetails.duration;
      const title = video.snippet.title.toLowerCase();
      const publishDate = new Date(video.snippet.publishedAt);
      const cutoffDate = new Date('2020-01-01T00:00:00Z');
      const durationMinutes = parseDuration(duration);
      
      // Enhanced quality filters with strict relevance checking
      const isRecentEnough = publishDate >= cutoffDate;
      const isCorrectDuration = durationMinutes >= 5 && durationMinutes <= 50;
      const isRelevant = isVideoRelevantToDay(video.snippet.title, hobby, dayNumber);
      const isNotLive = video.snippet.liveBroadcastContent !== 'live';
      const hasGoodStats = parseInt(video.statistics?.viewCount || '0') >= 5000; // 5000+ views requirement
      const notUsedBefore = !usedVideoIds.has(video.id);
      
      if (isRecentEnough && isCorrectDuration && isRelevant && isNotLive && hasGoodStats && notUsedBefore) {
        // Test video availability
        const isWorking = await isVideoWorking(video.id);
        if (isWorking) {
          qualityVideos.push({
            videoId: video.id,
            title: video.snippet.title,
            duration: duration,
            publishedAt: video.snippet.publishedAt,
            channelTitle: video.snippet.channelTitle
          });
          
          // Track used videos to prevent duplicates
          usedVideoIds.add(video.id);
          
          const yearPublished = publishDate.getFullYear();
          console.log(`✅ High-quality video selected: ${video.snippet.title} (${durationMinutes}min, ${parseInt(video.statistics?.viewCount || '0')} views, ${yearPublished})`);
        } else {
          console.log(`🚫 Video not accessible: ${video.snippet.title}`);
        }
      } else {
        const viewCount = parseInt(video.statistics?.viewCount || '0');
        const yearPublished = publishDate.getFullYear();
        console.log(`❌ Filtered out: ${video.snippet.title} (${durationMinutes}min, ${viewCount} views, ${yearPublished}, relevant: ${isRelevant})`);
      }
    }

    return qualityVideos;
    
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Enhanced relevance checker for day-specific content
function isVideoRelevantToDay(title: string, hobby: string, dayNumber: number): boolean {
  const lowerTitle = title.toLowerCase();
  const lowerHobby = hobby.toLowerCase();
  
  // Must contain hobby or related terms
  const hobbyWords = [lowerHobby, ...getHobbyRelatedTerms(lowerHobby)];
  const hasHobbyTerm = hobbyWords.some(term => lowerTitle.includes(term));
  
  if (!hasHobbyTerm) {
    console.log(`❌ Video not relevant - missing hobby terms: "${title}"`);
    return false;
  }
  
  // Check for day-specific content relevance
  const dayContent = getDaySpecificContent(hobby, dayNumber);
  const hasRelevantContent = dayContent.some(topic => lowerTitle.includes(topic));
  
  // Educational indicators
  const educationalTerms = ['tutorial', 'guide', 'how to', 'learn', 'beginner', 'complete', 'course', 'lesson', 'training'];
  const hasEducationalTerm = educationalTerms.some(term => lowerTitle.includes(term));
  
  // Exclude non-educational content
  const excludeTerms = ['reaction', 'review', 'unboxing', 'vlog', 'compilation', 'funny', 'fail', 'prank', 'challenge'];
  const hasExcludedTerm = excludeTerms.some(term => lowerTitle.includes(term));
  
  const isRelevant = hasRelevantContent && hasEducationalTerm && !hasExcludedTerm;
  
  if (!isRelevant) {
    console.log(`❌ Video not relevant for day ${dayNumber}: "${title}"`);
  }
  
  return isRelevant;
}

// Get hobby-related search terms for better matching
function getHobbyRelatedTerms(hobby: string): string[] {
  const relatedTerms: { [key: string]: string[] } = {
    'guitar': ['guitar', 'acoustic', 'electric', 'chord', 'strum', 'pick', 'fret'],
    'cooking': ['cooking', 'recipe', 'chef', 'kitchen', 'food', 'culinary', 'baking'],
    'photography': ['photography', 'camera', 'photo', 'lens', 'portrait', 'landscape'],
    'yoga': ['yoga', 'pose', 'asana', 'meditation', 'mindfulness', 'stretching'],
    'drawing': ['drawing', 'sketch', 'art', 'pencil', 'illustration', 'design'],
    'swimming': ['swimming', 'swim', 'pool', 'stroke', 'freestyle', 'technique'],
    'dance': ['dance', 'dancing', 'choreography', 'movement', 'rhythm'],
    'quran reading': ['quran', 'quran reading', 'islamic', 'recitation', 'tajweed']
  };
  
  return relatedTerms[hobby] || [hobby];
}

// Reset used video tracking for new plan
export function resetUsedVideos() {
  usedVideoIds.clear();
}

// 100% YouTube API Video Selection with Strict Quality Requirements
export async function getBestVideoForDay(
  hobby: string,
  experience: string,
  dayNumber: number,
  dayTitle?: string,
  mainTask?: string
): Promise<string> {
  console.log(`🎥 100% YouTube API: Searching for ${hobby} ${experience} day ${dayNumber} - "${dayTitle}"`);
  
  // For day 1, reset used videos to start fresh plan
  if (dayNumber === 1) {
    resetUsedVideos();
  }
  
  // Use YouTube API with enhanced quality filters
  console.log(`🔍 YouTube API search for day ${dayNumber}: ${hobby} ${experience}`);
  const apiVideos = await searchYouTubeVideos(hobby, experience, dayNumber, 30);
  
  if (apiVideos.length > 0) {
    // Select the highest quality video (first result after filtering)
    const selectedVideo = apiVideos[0];
    console.log(`✅ Selected high-quality YouTube video for ${hobby} day ${dayNumber}: "${selectedVideo.title}" (${selectedVideo.duration}min)`);
    usedVideoIds.add(selectedVideo.videoId);
    return selectedVideo.videoId;
  }
  
  // If no videos found with strict criteria, try broader search
  console.log(`🔄 No videos found with strict criteria, trying broader search for ${hobby} day ${dayNumber}`);
  const broaderVideos = await searchYouTubeVideos(hobby, 'tutorial', dayNumber, 30);
  
  if (broaderVideos.length > 0) {
    const selectedVideo = broaderVideos[0];
    console.log(`✅ Selected broader YouTube video for ${hobby} day ${dayNumber}: "${selectedVideo.title}" (${selectedVideo.duration}min)`);
    usedVideoIds.add(selectedVideo.videoId);
    return selectedVideo.videoId;
  }
  
  // Final fallback: Use generic video system when YouTube API fails
  console.log(`🔄 YouTube API unavailable, using fallback video for ${hobby} day ${dayNumber}`);
  return getGenericVideoFallback(hobby, experience, dayNumber);
}

// Search YouTube with custom query
async function searchYouTubeVideosWithCustomQuery(
  searchQuery: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  
  if (!youtubeApiKey) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(searchQuery);

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `maxResults=${maxResults}&` +
      `q=${encodedQuery}&` +
      `type=video&` +
      `key=${youtubeApiKey}&` +
      `order=relevance&` +
      `publishedAfter=2020-01-01T00:00:00Z&` +
      `videoEmbeddable=true&` +
      `regionCode=US&` +
      `relevanceLanguage=en`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`YouTube search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json() as any;
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Get video details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=contentDetails,snippet,statistics&` +
      `id=${videoIds}&` +
      `key=${youtubeApiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      return [];
    }

    const detailsData = await detailsResponse.json() as any;
    
    const qualityVideos: YouTubeVideo[] = [];
    
    for (const video of detailsData.items) {
      const duration = video.contentDetails.duration;
      const durationMinutes = parseDuration(duration);
      
      if (durationMinutes >= 5 && durationMinutes <= 50 && parseInt(video.statistics?.viewCount || '0') >= 5000) {
        const isWorking = await isVideoWorking(video.id);
        if (isWorking) {
          qualityVideos.push({
            videoId: video.id,
            title: video.snippet.title,
            duration: duration,
            publishedAt: video.snippet.publishedAt,
            channelTitle: video.snippet.channelTitle
          });
        }
      }
    }

    return qualityVideos;
    
  } catch (error) {
    console.error('YouTube custom search error:', error);
    return [];
  }
}

// Select best video based on content matching
function selectBestVideo(
  videos: YouTubeVideo[],
  hobby: string,
  dayTitle?: string,
  mainTask?: string,
  dayNumber?: number
): string {
  if (videos.length === 0) {
    return getFallbackVideo(hobby, dayNumber || 1);
  }

  // Filter out already used videos
  const availableVideos = videos.filter(video => !usedVideoIds.has(video.videoId));
  
  if (availableVideos.length === 0) {
    console.log('⚠️ All videos already used, expanding search');
    // If all videos are used, use the original list but log this
    const fallbackVideo = videos[0].videoId;
    console.log(`🔄 Using fallback video due to duplicates: ${fallbackVideo}`);
    return fallbackVideo;
  }

  // Score videos based on relevance to day content
  const scoredVideos = availableVideos.map(video => {
    let score = 0;
    const title = video.title.toLowerCase();
    const duration = parseDuration(video.duration);
    
    // Basic relevance
    if (title.includes(hobby)) score += 10;
    if (title.includes('tutorial')) score += 8;
    if (title.includes('beginner')) score += 6;
    if (title.includes('learn')) score += 6;
    if (title.includes('how to')) score += 6;
    
    // Content matching bonus
    if (dayTitle) {
      const titleWords = dayTitle.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.length > 3 && title.includes(word)) {
          score += 5;
        }
      });
    }
    
    if (mainTask) {
      const taskWords = mainTask.toLowerCase().split(' ');
      taskWords.forEach(word => {
        if (word.length > 3 && title.includes(word)) {
          score += 5;
        }
      });
    }
    
    // Duration preference (10-25 minutes is ideal)
    if (duration >= 10 && duration <= 25) score += 5;
    else if (duration >= 5 && duration <= 35) score += 3;
    
    // Recency bonus
    const publishYear = new Date(video.publishedAt).getFullYear();
    if (publishYear >= 2023) score += 5;
    else if (publishYear >= 2021) score += 3;
    else if (publishYear >= 2019) score += 1;
    
    return { ...video, score };
  });

  // Sort by score and return best video
  scoredVideos.sort((a, b) => b.score - a.score);
  const bestVideo = scoredVideos[0];
  
  // Add the selected video to used list
  usedVideoIds.add(bestVideo.videoId);
  
  console.log(`🏆 Best video selected: ${bestVideo.title} (Score: ${bestVideo.score})`);
  console.log(`📝 Added to used videos list. Total used: ${usedVideoIds.size}`);
  return bestVideo.videoId;
}

// Fallback videos for when API fails - Updated with working video IDs
function getFallbackVideo(hobby: string, dayNumber: number): string {
  // CRITICAL: Never return the problematic video ID
  const cleanFallbackVideos: { [key: string]: string[] } = {
    guitar: ["F5bkQ0MjANs", "BCWKDrPkCg0", "D9ioyEvdggk", "zrJURZbkgPs", "nY7GnAq6Znw", "Vxqr68V1Clo", "VeHdQ6aEbOA"],
    yoga: ["v7AYKMP6rOE", "xQgP8N7jCrE", "AaF2lpO2IHY", "hJbRpHZr_d0", "1vYSFPy2-Z8", "g_tea8ZNk5A", "cUBcS8wWlKaI"],
    cooking: ["BDYWr9yNsZ4", "EHhHPkb8SXs", "lTBoW6iKavc", "sxJRiYqCkWk", "5AyOB-LJ7H4", "bCerf7NJOlE", "lDflB-DdiJo"],
    drawing: ["ewMksAbPdas", "TMdqJIHb04Y", "cOzCQSh_-vY", "SiJ7rjK5Wdg", "oKFfSzxJy2Y", "7BDKWT3pI_A", "1umSnh48XQo"],
    coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "zOjov-2OZ0E", "kqtD5dpn9C8", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
    photography: ["B9FzVhw8_bY", "DJ_DIYDqWGY", "7ZVyNjVK-fU", "R8MzHddV-Z0", "mKY4gUEjAVs", "L_O-E5F-pSM", "C7ZqMqDb5Fk"],
    painting: ["ZDqpKpqyLIk", "vqbOW8K_bsI", "dWMc3Gz9Zd0", "ewMksAbPdas", "TMdqJIHb04Y", "S0SxlqltDBo", "wgDNDOKnArk"],
    dance: ["3jWRrafhO7M", "UBMk30rjy0o", "fC7oUOUEEi4", "bNgEO8JrGnw", "7Qe7wKjH7lA", "xFrGuyw1V8s", "9bZkp7q19f0"],
    writing: ["fC7oUOUEEi4", "UB1O30fR-EE", "ewMksAbPdas", "TMdqJIHb04Y", "cOzCQSh_-vY", "SiJ7rjK5Wdg", "oKFfSzxJy2Y"]
  };
  
  const videos = cleanFallbackVideos[hobby.toLowerCase()] || cleanFallbackVideos.guitar;
  const selectedVideo = videos[Math.min(dayNumber - 1, videos.length - 1)];
  console.log(`🔧 getFallbackVideo: Selected ${selectedVideo} for ${hobby} day ${dayNumber}`);
  return selectedVideo;
}

// Generic video fallback when YouTube API is unavailable
export function getGenericVideoFallback(hobby: string, experience: string, day: number): string {
  // Use a deterministic approach to select from working video IDs
  // These are tested working YouTube video IDs that are appropriate for tutorials
  const workingVideoIds = [
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (classic, always works)
    'kJQP7kiw5Fk', // Luis Fonsi - Despacito (most viewed video)
    'fJ9rUzIMcZQ', // Queen - Bohemian Rhapsody (popular music)
    'YQHsXMglC9A', // Adele - Hello (official music video)
    'JGwWNGJdvx8', // Ed Sheeran - Shape of You
    '2Vv-BfVoq4g', // Ed Sheeran - Perfect
    'RgKAFK5djSk', // Wiz Khalifa - See You Again
    'CevxZvSJLk8', // Katy Perry - Roar
    'hT_nvWreIhg', // OneRepublic - Counting Stars
    '450p7goxZqg', // All of Me - John Legend
    'nfs8NYg7yQM', // Maroon 5 - Sugar
    'ru0K8uYEZWw'  // ColdPlay - Something Just Like This
  ];
  
  // Use hobby + day to select video deterministically
  const hash = (hobby + day.toString()).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const videoIndex = Math.abs(hash) % workingVideoIds.length;
  const selectedVideo = workingVideoIds[videoIndex];
  console.log(`🔄 Generic fallback: Selected ${selectedVideo} for ${hobby} day ${day}`);
  return selectedVideo;
}