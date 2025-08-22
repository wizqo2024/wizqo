// YouTube API service for enhanced video search
class YouTubeService {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
  }

  // Search for videos related to a hobby and specific topic
  async searchVideos(hobby: string, topic: string, maxResults: number = 5): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('YouTube API key not found, using fallback video IDs')
      return this.getFallbackVideos(hobby, topic)
    }

    try {
      const query = `${hobby} ${topic} tutorial beginner guide`
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      return data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }))
    } catch (error) {
      console.error('YouTube API search failed:', error)
      return this.getFallbackVideos(hobby, topic)
    }
  }

  // Get video details by ID
  async getVideoDetails(videoId: string): Promise<any> {
    if (!this.apiKey) {
      return this.getFallbackVideoDetails(videoId)
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0]
        return {
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium?.url,
          channelTitle: video.snippet.channelTitle,
          viewCount: video.statistics.viewCount,
          duration: video.contentDetails?.duration
        }
      }
      
      return this.getFallbackVideoDetails(videoId)
    } catch (error) {
      console.error('YouTube API get video details failed:', error)
      return this.getFallbackVideoDetails(videoId)
    }
  }

  // Fallback videos when API is not available
  private getFallbackVideos(hobby: string, topic: string): any[] {
    const fallbackVideos = {
      guitar: [
        { videoId: 'F5bqcsbdKQM', title: 'Guitar Basics for Beginners', description: 'Learn fundamental guitar techniques' },
        { videoId: 'yDlE6qkmYrM', title: 'First Guitar Chords', description: 'Essential chords every guitarist should know' },
        { videoId: 'tQRtSbJKSWg', title: 'Guitar Strumming Patterns', description: 'Master basic strumming techniques' }
      ],
      cooking: [
        { videoId: 'w4d_UqQFRAQ', title: 'Basic Cooking Techniques', description: 'Essential cooking skills for beginners' },
        { videoId: 'dVR4wJ7GFgY', title: 'Knife Skills Basics', description: 'Learn proper knife handling and cutting techniques' },
        { videoId: 'RkGY7MPwvG4', title: 'Kitchen Fundamentals', description: 'Essential kitchen setup and basics' }
      ],
      photography: [
        { videoId: 'LxO-6rlihSg', title: 'Photography Basics', description: 'Understanding camera fundamentals' },
        { videoId: 'v7Jxn2xGL4c', title: 'Composition Techniques', description: 'Learn the rule of thirds and composition' },
        { videoId: 'gWYm4D6bWPE', title: 'Natural Light Photography', description: 'Working with available light' }
      ],
      drawing: [
        { videoId: 'On2LgxqJlMU', title: 'Drawing Fundamentals', description: 'Basic drawing techniques and concepts' },
        { videoId: 'pMC0Cx3Uk84', title: 'Sketching Basics', description: 'Learn essential sketching skills' },
        { videoId: '5kvo5RVkZcE', title: 'Perspective Drawing', description: 'Understanding perspective in art' }
      ]
    }

    const hobbyVideos = fallbackVideos[hobby.toLowerCase() as keyof typeof fallbackVideos] || fallbackVideos.guitar
    return hobbyVideos.map(video => ({
      ...video,
      thumbnail: `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
      channelTitle: 'Educational Channel',
      publishedAt: new Date().toISOString()
    }))
  }

  private getFallbackVideoDetails(videoId: string): any {
    return {
      videoId,
      title: 'Educational Tutorial',
      description: 'Learn new skills with this tutorial',
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      channelTitle: 'Educational Channel',
      viewCount: '1000000',
      duration: 'PT10M'
    }
  }

  // Get curated video for specific hobby day
  async getVideoForHobbyDay(hobby: string, dayNumber: number, topic: string): Promise<any> {
    const searchQuery = `${hobby} day ${dayNumber} ${topic} tutorial`
    const videos = await this.searchVideos(hobby, searchQuery, 1)
    
    return videos.length > 0 ? videos[0] : this.getFallbackVideos(hobby, topic)[0]
  }
}

export const youtubeService = new YouTubeService()