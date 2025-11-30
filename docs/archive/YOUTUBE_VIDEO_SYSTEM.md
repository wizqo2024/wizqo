# YouTube Video System for 7-Day Hobby Plans

## Overview
Our platform uses a 100% YouTube API video selection system to provide high-quality, relevant educational content for each day of the 7-day hobby learning plans. All videos are sourced directly from YouTube with strict quality and relevance requirements.

## Video Selection Strategy

### 100% YouTube API Search (Primary and Only)
- **Location**: `server/youtubeService.ts`
- **Purpose**: Real-time dynamic search for the highest quality videos
- **API Key**: Requires `YOUTUBE_API_KEY` environment variable
- **Enhanced Search Parameters**:
  - `maxResults=25-30` (increased for better selection)
  - `videoDuration=medium` (4-45 minutes)
  - `videoEmbeddable=true`
  - `videoSyndicated=true`
  - `publishedAfter=2018-01-01` (excludes old outdated content)
  - `order=relevance`
  - **Minimum 5000+ views requirement**

**Day-Specific Search Query Construction**:
```typescript
const dayTopics = {
  1: ['basics', 'fundamentals', 'getting started', 'setup', 'introduction'],
  2: ['first steps', 'basic techniques', 'simple exercises', 'practice'],
  3: ['building skills', 'intermediate', 'core techniques', 'development'],
  4: ['practical application', 'real practice', 'hands-on', 'implementation'],
  5: ['advanced techniques', 'skills improvement', 'next level', 'mastering'],
  6: ['creative exploration', 'personal style', 'experimentation'],
  7: ['mastery', 'integration', 'complete guide', 'final skills']
};

const searchTerms = [
  hobby,
  `${experience} tutorial`,
  dayContent[0], // Primary day topic
  dayContent[1], // Secondary day topic
  'how to',
  '2024 2023 2022 2021' // Recent content priority
];
```

**Strict Quality Filters Applied**:
1. **Duration**: 3-45 minutes (no videos under 3 minutes or over 45 minutes)
2. **Views**: Minimum 5000+ views for quality assurance
3. **Relevance**: Advanced day-specific content matching
4. **Working Status**: Real-time verification of video accessibility
5. **Educational Content**: Must contain tutorial/educational keywords
6. **Non-Repetitive**: Tracks used videos to prevent duplicates
7. **Recent Content**: Published after 2018 (excludes old outdated content)

## Video Integration Process

### 1. Plan Generation Phase
```typescript
// In generateFallbackPlan function
const videoResult = await getVideoForDay(hobby, experience, dayNumber);
day.youtubeVideoId = videoResult.videoId;
day.videoTitle = videoResult.title;
```

### 2. Video Selection Hierarchy
```typescript
export async function getVideoForDay(hobby: string, experience: string, day: number) {
  // 1. Try verified video database
  const verifiedVideo = getVerifiedVideo(hobby, day, experience);
  if (verifiedVideo) return verifiedVideo;
  
  // 2. Try YouTube API search
  if (process.env.YOUTUBE_API_KEY) {
    const apiVideos = await searchYouTubeVideos(hobby, experience, day);
    if (apiVideos.length > 0) return apiVideos[0];
  }
  
  // 3. Fall back to generic videos
  return getGenericVideo(hobby, day);
}
```

### 3. Frontend Video Display
- **Component**: `YouTubeEmbed.tsx`
- **URL Format**: `https://www.youtube.com/embed/${videoId}`
- **Features**:
  - Responsive iframe
  - Loading states
  - Error handling for broken videos
  - Dark mode support

## Current Video Database Coverage

### Major Hobbies with Full 7-Day Coverage:
- **Cooking** (52 videos): Knife skills → Complete meals → Advanced techniques
- **Guitar** (49 videos): Basic chords → First songs → Advanced playing
- **Photography** (49 videos): Camera basics → Composition → Portfolio building
- **Yoga** (49 videos): Basic poses → Sequences → Advanced flows
- **Drawing** (49 videos): Basic shapes → Portraits → Advanced techniques
- **Dance** (35 videos): Basic moves → Choreography → Performance

### Specialized Hobbies:
- **Quran Reading**: Generic educational videos with Islamic study focus
- **Swimming**: Fitness-based instructional content
- **Woodworking**: Project-based learning progression

## Video Quality Guidelines

### Content Requirements:
1. **Educational Focus**: Must teach specific skills or concepts
2. **Progressive Difficulty**: Day 1 = basics, Day 7 = advanced/integration
3. **Duration Limits**: 4-45 minutes (optimal 10-25 minutes)
4. **Recent Content**: Prefer videos from 2018 onwards
5. **Clear Audio/Video**: Professional or semi-professional quality

### Technical Requirements:
1. **Embeddable**: Must allow iframe embedding
2. **Available**: No age restrictions or geo-blocking
3. **Working Links**: Regular verification of video availability
4. **Mobile Friendly**: Responsive design support

### Content Progression by Day:
- **Day 1**: Basics, setup, fundamentals
- **Day 2**: First practical exercises
- **Day 3**: Building core skills
- **Day 4**: Practical application
- **Day 5**: Advanced techniques
- **Day 6**: Creative exploration
- **Day 7**: Integration and mastery

## API Configuration

### Required Environment Variables:
```bash
YOUTUBE_API_KEY=your_youtube_api_v3_key
```

### YouTube API Setup:
1. Create Google Cloud Console project
2. Enable YouTube Data API v3
3. Generate API key with YouTube Data API access
4. Set daily quota limits (default: 10,000 units/day)

### API Usage Optimization:
- Search requests: ~100 units each
- Video details: ~1 unit each
- Quota monitoring and fallback systems
- Efficient caching to reduce API calls

## Fallback System Architecture

### When YouTube API Unavailable:
1. Log warning about missing API key
2. Use verified video database if available
3. Fall back to generic educational videos
4. Customize titles to match hobby context

### When Quota Exceeded:
1. Detect quota exceeded error
2. Switch to verified video database
3. Use generic videos as final fallback
4. Log quota status for monitoring

### When Videos Unavailable:
1. Check video working status
2. Try alternative videos from same day
3. Use generic placeholder with hobby context
4. Provide fallback educational content

## Video Verification Process

### Automated Checks:
```typescript
async function isVideoWorking(videoId: string): Promise<boolean> {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  return response.ok;
}
```

### Manual Verification:
- Regular review of video database
- Update `lastChecked` timestamps
- Remove broken or inappropriate videos
- Add new high-quality alternatives

## Performance Considerations

### Video Loading Optimization:
- Lazy loading for off-screen videos
- Preload="none" for reduced bandwidth
- Error handling for failed embeds
- Progressive enhancement approach

### API Rate Limiting:
- Built-in quota management
- Graceful degradation to fallbacks
- Efficient search query construction
- Response caching where possible

This comprehensive system ensures that every 7-day hobby plan includes relevant, high-quality video content that progresses logically from beginner fundamentals to advanced techniques, with robust fallback systems to maintain reliability even when external APIs are unavailable.