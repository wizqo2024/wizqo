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
  
  return hours * 60 + minutes + (seconds > 30 ? 1 : 0); // Round up if more than 30 seconds
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

// Search YouTube with quality filters
export async function searchYouTubeVideos(
  hobby: string,
  experience: string,
  dayNumber: number,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  
  if (!youtubeApiKey) {
    console.log('⚠️ YouTube API key not found');
    return [];
  }

  try {
    // Create targeted search query
    const searchTerms = [
      hobby,
      experience === 'beginner' ? 'beginner tutorial' : `${experience} tutorial`,
      dayNumber === 1 ? 'basics fundamentals' : `lesson ${dayNumber}`,
      '2024 2023 2022 2021 2020 2019' // Prefer recent videos
    ];
    
    const searchQuery = searchTerms.join(' ');
    const encodedQuery = encodeURIComponent(searchQuery);

    // Search for videos (published after 2018, medium duration)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `maxResults=${maxResults}&` +
      `q=${encodedQuery}&` +
      `type=video&` +
      `key=${youtubeApiKey}&` +
      `order=relevance&` +
      `publishedAfter=2018-01-01T00:00:00Z&` +
      `videoDuration=medium&` +
      `videoEmbeddable=true&` +
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
      const cutoffDate = new Date('2018-01-01');
      const durationMinutes = parseDuration(duration);
      
      // Apply all quality filters
      const isRecentEnough = publishDate >= cutoffDate;
      const isShortEnough = durationMinutes <= 45 && durationMinutes >= 3; // 3-45 minutes
      const isRelevant = title.includes(hobby) || title.includes('tutorial') || title.includes('learn') || title.includes('how to');
      const isNotLive = video.snippet.liveBroadcastContent !== 'live';
      const hasGoodStats = parseInt(video.statistics?.viewCount || '0') >= 5000; // At least 5k views as requested
      
      if (isRecentEnough && isShortEnough && isRelevant && isNotLive && hasGoodStats) {
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
          
          console.log(`✅ Quality video found: ${video.snippet.title} (${durationMinutes}min)`);
        } else {
          console.log(`🚫 Video not working: ${video.snippet.title}`);
        }
      } else {
        console.log(`❌ Filtered out: ${video.snippet.title} (${durationMinutes}min, ${publishDate.getFullYear()})`);
      }
    }

    return qualityVideos;
    
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Reset used video tracking for new plan
export function resetUsedVideos() {
  usedVideoIds.clear();
}

// Get best video for specific day and hobby with content matching
export async function getBestVideoForDay(
  hobby: string,
  experience: string,
  dayNumber: number,
  dayTitle?: string,
  mainTask?: string
): Promise<string> {
  console.log(`🎥 YouTube API: Searching for ${hobby} ${experience} day ${dayNumber} - "${dayTitle}"`);
  
  // First try to get verified video for this hobby and day
  const verifiedVideo = getRandomVerifiedVideo(hobby.toLowerCase(), dayNumber, usedVideoIds);
  if (verifiedVideo && verifiedVideo.verified && parseInt(verifiedVideo.duration) <= 45) {
    console.log(`✅ Using verified video for ${hobby} day ${dayNumber}:`, verifiedVideo.title, `(${verifiedVideo.duration}min)`);
    usedVideoIds.add(verifiedVideo.id);
    return verifiedVideo.id;
  }
  
  // For unsupported hobbies, use generic educational videos
  if (!verifiedVideo) {
    const genericFallbacks = [
      "fC7oUOUEEi4", // Educational content
      "UB1O30fR-EE", // Tutorial video
      "ewMksAbPdas", // Learning guide
      "TMdqJIHb04Y", // Skills video
      "cOzCQSh_-vY", // Practice guide
      "SiJ7rjK5Wdg", // Advanced techniques
      "oKFfSzxJy2Y"  // Mastery content
    ];
    const fallbackId = genericFallbacks[Math.min(dayNumber - 1, genericFallbacks.length - 1)];
    console.log(`📚 Using generic educational video for ${hobby} day ${dayNumber}: ${fallbackId}`);
    return fallbackId;
  }
  
  // For day 1, reset used videos to start fresh
  if (dayNumber === 1) {
    resetUsedVideos();
  }
  
  // If we couldn't get a verified video, continue with API search
  if (!verifiedVideo) {
    console.log(`📚 No verified video for ${hobby}, trying API search for day ${dayNumber}`);
  }
  
  // Create more specific search based on day content
  const searchTerms = [];
  if (dayTitle) {
    // Extract key concepts from day title
    const titleWords = dayTitle.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['day', 'the', 'and', 'for', 'with', 'your'].includes(word)
    );
    searchTerms.push(...titleWords);
  }
  
  if (mainTask) {
    // Extract key concepts from main task
    const taskWords = mainTask.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['learn', 'practice', 'complete', 'exercise', 'technique'].includes(word)
    );
    searchTerms.push(...taskWords);
  }
  
  // Create targeted search query
  const specificQuery = [hobby, experience, 'tutorial', ...searchTerms.slice(0, 3)].join(' ');
  console.log(`🔍 Specific search: "${specificQuery}"`);
  
  const videos = await searchYouTubeVideosWithCustomQuery(specificQuery, 25); // Increase results for better uniqueness
  
  if (videos.length === 0) {
    console.log('🔄 No specific videos found, trying general search');
    const generalVideos = await searchYouTubeVideos(hobby, experience, dayNumber, 25);
    if (generalVideos.length === 0) {
      console.log('🔄 No API videos found, using verified fallback');
      const fallbackVideo = getVerifiedVideo(hobby.toLowerCase(), dayNumber);
      if (fallbackVideo) {
        console.log(`✅ Using verified fallback for ${hobby} day ${dayNumber}:`, fallbackVideo.title);
        return fallbackVideo.id;
      }
      return getFallbackVideo(hobby, dayNumber);
    }
    return selectBestVideo(generalVideos, hobby, dayTitle, mainTask, dayNumber);
  }

  return selectBestVideo(videos, hobby, dayTitle, mainTask, dayNumber);
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
      `publishedAfter=2018-01-01T00:00:00Z&` +
      `videoDuration=medium&` +
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
      
      if (durationMinutes <= 45 && durationMinutes >= 3 && parseInt(video.statistics?.viewCount || '0') >= 5000) {
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
  const fallbackVideos: { [key: string]: string[] } = {
    guitar: ["F5bkQ0MjANs", "BCWKDrPkCg0", "D9ioyEvdggk", "zrJURZbkgPs", "nY7GnAq6Znw", "Vxqr68V1Clo", "VeHdQ6aEbOA"],
    yoga: ["v7AYKMP6rOE", "xQgP8N7jCrE", "AaF2lpO2IHY", "hJbRpHZr_d0", "1vYSFPy2-Z8", "g_tea8ZNk5A", "cUBcS8wWlKI"],
    cooking: ["dQw4w9WgXcQ", "EHhHPkb8SXs", "lTBoW6iKavc", "sxJRiYqCkWk", "5AyOB-LJ7H4", "bCerf7NJOlE", "lDflB-DdiJo"],
    drawing: ["ewMksAbPdas", "TMdqJIHb04Y", "cOzCQSh_-vY", "SiJ7rjK5Wdg", "oKFfSzxJy2Y", "7BDKWT3pI_A", "1umSnh48XQo"],
    coding: ["UB1O30fR-EE", "hdI2bqOjy3c", "zOjov-2OZ0E", "kqtD5dpn9C8", "c8aAYU5m4jM", "9Yf36xdLp2A", "rfscVS0vtbw"],
    photography: ["B9FzVhw8_bY", "DJ_DIYDqWGY", "7ZVyNjVK-fU", "R8MzHddV-Z0", "mKY4gUEjAVs", "L_O-E5F-pSM", "C7ZqMqDb5Fk"],
    painting: ["ZDqpKpqyLIk", "vqbOW8K_bsI", "dWMc3Gz9Zd0", "ewMksAbPdas", "ewMksAbPdas", "S0SxlqltDBo", "wgDNDOKnArk"],
    dance: ["3jWRrafhO7M", "UBMk30rjy0o", "dQw4w9WgXcQ", "bNgEO8JrGnw", "7Qe7wKjH7lA", "xFrGuyw1V8s", "9bZkp7q19f0"]
  };
  
  const videos = fallbackVideos[hobby.toLowerCase()] || fallbackVideos.guitar;
  return videos[Math.min(dayNumber - 1, videos.length - 1)];
}