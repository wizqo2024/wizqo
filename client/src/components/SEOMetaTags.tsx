import { useEffect } from 'react';
import { HreflangTags } from './HreflangTags';
import { addLocaleToPath, removeLocaleFromPath, getLocaleFromURL } from '@/utils/locale';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string | string[];
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export function SEOMetaTags({
  title = "Free Printable Worksheets for Teachers & Kids | Wizqo",
  description = "Download free printable worksheets for math, reading, writing, and more. Generate unlimited worksheets with answer keys for grades K-5. No sign-up required!",
  keywords = "free printable worksheets, printable worksheets for teachers, free math worksheets, reading comprehension worksheets, handwriting worksheets, printable worksheets PDF, worksheets for kids, educational worksheets, free worksheets first grade, printable worksheets with answer keys, multiplication worksheets, 1st grade math worksheets, 2nd grade math worksheets, kindergarten math worksheets",
  ogImage = "https://wizqo.com/logo-720x720.png",
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  canonicalUrl,
  noIndex = false,
  ogType,
  twitterCard
}: SEOMetaTagsProps) {
  // Get current locale and build locale-aware canonical URL
  const currentLocale = typeof window !== 'undefined' ? getLocaleFromURL() : 'en'
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const cleanPath = removeLocaleFromPath(currentPath)

  // Build canonical URL with locale (or use provided one)
  const finalCanonicalUrl = canonicalUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}${addLocaleToPath(cleanPath, currentLocale)}`
    : 'https://wizqo.com/')
  useEffect(() => {
    // Default types
    const computedOgType = ogType || (canonicalUrl && canonicalUrl.includes('/blog/') ? 'article' : 'website');
    const computedTwitterCard = twitterCard || 'summary_large_image';

    // Update document title
    document.title = title;

    // Helper to update or create meta tags with deduplication and attribute support
    const updateMeta = (selector: string, attr: 'name' | 'property', attrValue: string, content: string) => {
      // Find all potential duplicates
      const existingTags = document.querySelectorAll(selector);

      if (existingTags.length > 0) {
        // Update the first one and remove the rest
        existingTags[0].setAttribute('content', content);
        for (let i = 1; i < existingTags.length; i++) {
          existingTags[i].remove();
        }
      } else {
        // Create new
        const meta = document.createElement('meta');
        meta.setAttribute(attr, attrValue);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Update Meta Tags
    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    updateMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', computedOgType);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', finalCanonicalUrl);

    // og:image handling (can be multiple)
    document.querySelectorAll('meta[property="og:image"]').forEach(el => el.remove());
    const images = Array.isArray(ogImage) ? ogImage : [ogImage];
    images.forEach(img => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', img);
      document.head.appendChild(meta);
    });

    // Twitter - handle both name and property to avoid duplicates
    updateMeta('meta[name="twitter:card"], meta[property="twitter:card"]', 'name', 'twitter:card', computedTwitterCard);
    updateMeta('meta[name="twitter:title"], meta[property="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"], meta[property="twitter:description"]', 'name', 'twitter:description', description);
    updateMeta('meta[name="twitter:url"], meta[property="twitter:url"]', 'name', 'twitter:url', finalCanonicalUrl);

    // Twitter Image (can be multiple)
    document.querySelectorAll('meta[name="twitter:image"], meta[property="twitter:image"]').forEach(el => el.remove());
    images.forEach(img => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:image');
      meta.setAttribute('content', img);
      document.head.appendChild(meta);
    });

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalCanonicalUrl);

  }, [title, description, keywords, ogImage, finalCanonicalUrl, noIndex, ogType, twitterCard]);


  return (
    <>
      {/* Hreflang tags for SEO - tells Google about alternate language versions */}
      <HreflangTags path={cleanPath} />
    </>
  )
}