import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title = "Tutorial Video", className = "" }: YouTubeEmbedProps) {
  if (!videoId) {
    return (
      <div className={`relative w-full ${className} bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-8 text-center`}>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">No video available</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
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
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center px-2">
        {title}
      </p>
    </div>
  );
}