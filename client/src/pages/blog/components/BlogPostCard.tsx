import React from 'react';
import { BlogPost } from '../types';
import { getPostImage, getPostRating } from '../utils';
import { CATEGORY_IMAGES, GENERIC_BLOG_IMAGE } from '../constants';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: () => void;
}

export function BlogPostCard({ post, onClick }: BlogPostCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article 
      role="article"
      aria-labelledby={`post-title-${post.id}`}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-purple-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <img 
        src={getPostImage(post)} 
        alt={post.imageAlt || post.title} 
        width={1200}
        height={540}
        referrerPolicy="no-referrer"
        className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover rounded-lg mb-4"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          const fallbacks = [CATEGORY_IMAGES[post.category], GENERIC_BLOG_IMAGE].filter(Boolean) as string[];
          const tried = parseInt(img.getAttribute('data-errcount') || '0', 10);
          if (tried < fallbacks.length) {
            img.setAttribute('data-errcount', String(tried + 1));
            img.src = fallbacks[tried] as string;
          }
        }}
      />
      <div className="flex items-center justify-between mb-4">
        <span 
          className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium"
          aria-label={`Category: ${post.category}`}
        >
          {post.category}
        </span>
        <div 
          className="flex items-center gap-1 text-yellow-500"
          role="img"
          aria-label={`Rating: ${getPostRating(post)} out of 5 stars`}
        >
          {[1,2,3,4,5].map(star => (
            <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-slate-500 ml-1 sr-only">({getPostRating(post)})</span>
          <span className="text-xs text-slate-500 ml-1" aria-hidden="true">({getPostRating(post)})</span>
        </div>
      </div>
      
      <h3 
        id={`post-title-${post.id}`}
        className="text-xl font-bold text-slate-900 mb-3 leading-tight"
      >
        {post.title}
      </h3>
      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
        <span className="font-medium" aria-label={`Author: ${post.author}`}>
          {post.author}
        </span>
        <span className="flex items-center gap-1" aria-label={`Reading time: ${post.readTime}`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{post.readTime}</span>
        </span>
      </div>
    </article>
  );
}
