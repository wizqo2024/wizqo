# YouTube Video System for 7-Day Hobby Plans

## Overview
Our platform uses a sophisticated 3-tier video selection system to provide high-quality, relevant educational content for each day of the 7-day hobby learning plans.

## Video Selection Strategy

### Tier 1: Verified Video Database (Primary)
- **Location**: `server/verifiedVideos.ts`
- **Content**: 200+ manually curated and verified videos
- **Organization**: Organized by hobby and day (1-7)
- **Quality Standards**:
  - All videos under 45 minutes
  - Educational focus
  - Working links (regularly verified)
  - Day-specific content progression
  - Non-repetitive across the 7-day plan

**Example Structure**:
```typescript
cooking: {
  1: [
    { id: 'Vp4BFKjWAkk', title: 'Essential Knife Skills for Beginners', duration: '18', verified: true },
    { id: 'BDYWr9yNsZ4', title: 'Basic Kitchen Setup for New Cooks', duration: '12', verified: true }
  ],
  2: [
    { id: 'y6120QOlsfU', title: 'How to Cook Eggs - 5 Ways', duration: '4', verified: true }
  ]
}
```

### Tier 2: YouTube API Search (Secondary)
- **Location**: `server/youtubeService.ts`
- **Purpose**: Dynamic search when verified videos unavailable
- **API Key**: Requires `YOUTUBE_API_KEY` environment variable
- **Search Parameters**:
  - `maxResults=10`
  - `videoDuration=medium` (4-20 minutes)
  - `videoEmbeddable=true`
  - `publishedAfter=2018-01-01` (recent content)
  - `order=relevance`

**Search Query Construction**:
```typescript
const searchTerms = [
  hobby,
  experience === 'beginner' ? 'beginner tutorial' : `${experience} tutorial`,
  dayNumber === 1 ? 'basics fundamentals' : `lesson ${dayNumber}`,
  '2024 2023 2022 2021' // Prefer recent videos
];
```

**Quality Filters Applied**:
1. Duration check (under 45 minutes)
2. Working link verification
3. Duplicate prevention within plan
4. Educational content relevance

### Tier 3: Generic Fallback (Last Resort)
- **Location**: `server/hobbyValidator.ts`
- **Purpose**: Guaranteed video availability
- **Content**: Generic educational videos with hobby-specific titles
- **Usage**: When API quota exceeded or no relevant videos found

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