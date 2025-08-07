import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title = "Tutorial Video", className = "" }: YouTubeEmbedProps) {
  // Handle unavailable videos
  if (!videoId || videoId === 'unavailable') {
    const isExplicitlyUnavailable = videoId === 'unavailable';
    
    return (
      <div className={`relative w-full ${className}`}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-xl p-6 text-center border border-slate-600">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Video Tutorial</h3>
          <p className="text-slate-300 text-sm mb-2">
            {isExplicitlyUnavailable 
              ? "Video currently unavailable" 
              : "No video available for this lesson"}
          </p>
          <p className="text-slate-400 text-xs">
            {isExplicitlyUnavailable 
              ? "Our systems couldn't find a suitable tutorial video for this topic at the moment." 
              : "Follow the written instructions above to complete this day's activities."}
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          onError={(e) => {
            console.error('YouTube video failed to load:', videoId, e);
            console.log('Full embed URL:', embedUrl);
          }}
          onLoad={() => {
            console.log('✅ YouTube video loaded successfully:', videoId);
          }}
        />
      </div>
    </div>
  );
}