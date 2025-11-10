import { BlogPost } from './types';

// Default cover images per category + generic fallback
export const CATEGORY_IMAGES: Record<string, string> = {
  'Learning Tips': 'https://images.unsplash.com/photo-1496306643123-7fed4c627b07?auto=format&fit=crop&w=1600&q=80',
  'Mental Wellness': 'https://wizqo.com/og-image.jpg',
  'Creative Arts': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'
};

export const GENERIC_BLOG_IMAGE = 'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1600&q=80';
