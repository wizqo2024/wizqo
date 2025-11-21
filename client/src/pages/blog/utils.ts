import { BlogPost } from './types';
import { CATEGORY_IMAGES, GENERIC_BLOG_IMAGE } from './constants';
import { translations } from '@/translations';

export function getPostImage(post: BlogPost): string {
  return post.imageUrl || CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE;
}

export function getPostRating(post: BlogPost): string {
  const key = (post.id || post.title || '').toString();
  let hash = 0 >>> 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) >>> 0; // djb2 variant
  }
  const choices = [4.6, 4.7, 4.8, 4.9];
  const rating = choices[hash % choices.length];
  return rating.toFixed(1);
}

// Load Markdown posts from content folder (optional, SEO-safe)
export function loadMarkdownPosts(): BlogPost[] {
  try {
    // Try multiple roots so Vercel build always bundles Markdown
    const modsRoot = import.meta.glob('/content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modsClient = import.meta.glob('/client/content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modsRel = import.meta.glob('./content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modsParent = import.meta.glob('../content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modules = { ...modsRoot, ...modsClient, ...modsRel, ...modsParent } as Record<string, string>;
    const posts: BlogPost[] = [];
    for (const [path, raw] of Object.entries(modules)) {
      const fmMatch = raw.match(/^---[\s\S]*?---/);
      const fmBlock = fmMatch ? fmMatch[0].replace(/^---|---$/g, '').trim() : '';
      const body = raw.replace(/^---[\s\S]*?---\s*/m, '');
      const meta: any = {};
      if (fmBlock) {
        for (const line of fmBlock.split('\n')) {
          const idx = line.indexOf(':');
          if (idx > -1) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
            meta[key] = value;
          }
        }
      }
      const fileSlug = path.split('/').pop()?.replace(/\.md$/, '') || `post-${Date.now()}`;
      const id = (meta.slug || fileSlug).toString();
      posts.push({
        id,
        title: meta.title || id,
        excerpt: meta.excerpt || '',
        content: body || '',
        author: meta.author || 'Wizqo Team',
        date: meta.date || new Date().toISOString().slice(0, 10),
        readTime: meta.readTime || '5 min read',
        category: meta.category || 'Learning Tips',
        imageUrl: meta.cover || undefined,
        imageAlt: meta.imageAlt || undefined,
      });
    }
    return posts;
  } catch {
    return [];
  }
}

// Translate blog post category based on current language
export function translateCategory(category: string, language: 'en' | 'es' | 'ar' = 'en'): string {
  try {
    const langTranslations = translations[language];
    if (langTranslations && typeof langTranslations === 'object') {
      const pages = (langTranslations as any).pages;
      if (pages && typeof pages === 'object') {
        const blog = pages.blog;
        if (blog && typeof blog === 'object') {
          const categories = blog.categories;
          if (categories && typeof categories === 'object') {
            const translated = (categories as any)[category];
            if (translated && typeof translated === 'string') {
              return translated;
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Translation failed for category ${category}:`, error);
  }
  return category;
}

// Translate readTime format (e.g., "6-7 min read" -> "6-7 دقيقة قراءة")
export function translateReadTime(readTime: string, language: 'en' | 'es' | 'ar' = 'en'): string {
  if (language === 'en') return readTime;
  
  try {
    const langTranslations = translations[language];
    if (langTranslations && typeof langTranslations === 'object') {
      const pages = (langTranslations as any).pages;
      if (pages && typeof pages === 'object') {
        const blog = pages.blog;
        if (blog && typeof blog === 'object') {
          const format = blog.readTimeFormat;
          if (format && typeof format === 'string') {
            // Extract minutes from "6-7 min read" or "8–9 min read" or "5 min read"
            const match = readTime.match(/(\d+)[–-]?(\d+)?\s*min\s*read/i);
            if (match) {
              const min1 = match[1];
              const min2 = match[2];
              const minutes = min2 ? `${min1}–${min2}` : min1;
              return format.replace('{{minutes}}', minutes);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Translation failed for readTime ${readTime}:`, error);
  }
  return readTime;
}

// Translate blog post title and excerpt based on current language
export function translateBlogPost(post: BlogPost, language: 'en' | 'es' | 'ar' = 'en'): BlogPost {
  try {
    const langTranslations = translations[language];
    if (langTranslations && typeof langTranslations === 'object') {
      const pages = (langTranslations as any).pages;
      if (pages && typeof pages === 'object') {
        const blog = pages.blog;
        if (blog && typeof blog === 'object') {
          const posts = blog.posts;
          if (posts && typeof posts === 'object') {
            const postTranslation = (posts as any)[post.id];
            if (postTranslation && typeof postTranslation === 'object' && 'title' in postTranslation && 'excerpt' in postTranslation) {
              return {
                ...post,
                title: postTranslation.title || post.title,
                excerpt: postTranslation.excerpt || post.excerpt,
                category: translateCategory(post.category, language),
                readTime: translateReadTime(post.readTime, language),
              };
            }
          }
        }
      }
    }
  } catch (error) {
    // If translation fails, return original post
    console.warn(`Translation failed for blog post ${post.id}:`, error);
  }
  
  return {
    ...post,
    category: translateCategory(post.category, language),
    readTime: translateReadTime(post.readTime, language),
  };
}
