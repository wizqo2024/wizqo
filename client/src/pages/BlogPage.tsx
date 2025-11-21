import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { BlogPost } from './blog/types';
import { basePosts } from './blog/basePosts';
import { loadMarkdownPosts } from './blog/utils';
import { BlogPostView } from './blog/components/BlogPostView';
import { BlogList } from './blog/components/BlogList';

export function BlogPage({ initialSlug, onNavigate }: { initialSlug?: string; onNavigate?: (path: string) => void }) {
  const { t } = useTranslation();
  const routeRefreshKey = () => (typeof window !== 'undefined' ? window.location.pathname : '');
  const mdPosts = useMemo(() => loadMarkdownPosts(), [routeRefreshKey()]);
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  const allPosts: BlogPost[] = useMemo(() => {
    // Prefer authored Markdown; use inline base posts only if missing in MD
    const byId = new Map<string, BlogPost>();
    for (const p of mdPosts) byId.set(p.id, p);
    for (const p of basePosts) if (!byId.has(p.id)) byId.set(p.id, p);
    const merged = Array.from(byId.values());
    merged.sort((a, b) => {
      const da = Date.parse(a.date || '') || 0;
      const db = Date.parse(b.date || '') || 0;
      return db - da;
    });
    return merged;
  }, [mdPosts]);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const featurePost = useMemo(() => {
    if (!allPosts.length) return null;
    // Do not feature the most recent blog post, coloring-pages, or the HWT infographic per request
    const avoidIds = new Set(['handwriting-without-tears-infographic', 'free-kdg-worksheets-pdf', 'free-multiplication-worksheets-pdf']);
    // Skip the first post (most recent) and find a candidate from the rest
    const postsToConsider = allPosts.slice(1); // Skip the most recent post
    const candidate = postsToConsider.find(p => !(p.id || '').includes('printable-coloring-pages') && !avoidIds.has(p.id))
      || postsToConsider.find(p => !avoidIds.has(p.id))
      || (postsToConsider.length > 0 ? postsToConsider[0] : null);
    return candidate;
  }, [allPosts]);

  // Blog filters: category + search query
  const allCategory = t('pages.blog.filters.all');
  const recentCategory = t('pages.blog.filters.recent');
  const [filterCategory, setFilterCategory] = useState<string>(allCategory);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const categories = useMemo(() => {
    const unique = Array.from(new Set(allPosts.map(p => p.category))).sort();
    return [allCategory, recentCategory, ...unique];
  }, [allPosts, allCategory, recentCategory]);
  const filteredPosts = useMemo(() => {
    const activeCategory = filterCategory;
    const q = filterQuery.trim().toLowerCase();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return allPosts.filter(p => {
      const isRecent = (() => {
        const ts = Date.parse(p.date || '');
        return !!ts && (now - ts) <= sevenDaysMs;
      })();
      const matchesCategory = (
        activeCategory === allCategory ||
        (activeCategory === recentCategory ? isRecent : p.category === activeCategory)
      );
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.excerpt} ${p.content}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allPosts, filterCategory, filterQuery, allCategory, recentCategory]);
  const isFilteringActive = filterCategory !== allCategory || (filterQuery.trim().length > 0);
  const visibleFeaturePost = useMemo(() => {
    if (isFilteringActive && filteredPosts.length > 0) {
      return filteredPosts[0];
    }
    return featurePost;
  }, [isFilteringActive, filteredPosts, featurePost]);

  // Ensure we don't feature certain slugs (e.g., 'best-teacher')
  const safeFeaturePost = useMemo(() => {
    if (!allPosts.length) return null;
    const base = visibleFeaturePost || allPosts[0];
    if (base && base.id !== 'best-teacher') return base;
    const alt = allPosts.find(p => p.id !== 'best-teacher');
    return alt || base;
  }, [visibleFeaturePost, allPosts]);
  
  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {}
  };
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      try {
        const y =
          typeof window !== 'undefined'
            ? window.scrollY ||
              (typeof document !== 'undefined'
                ? document.documentElement.scrollTop || document.body.scrollTop || 0
                : 0)
            : 0;
        setShowBackToTop(y > 180);
      } catch {}
    };
    try {
      window.addEventListener('scroll', onScroll, { passive: true } as any);
    } catch {}
    onScroll();
    return () => {
      try { window.removeEventListener('scroll', onScroll); } catch {}
    };
  }, []);

  // Preselect post from URL query (?post=slug)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('post');
      if (!pid) return;
      const found = allPosts.find(p => p.id === pid);
      if (found) setSelectedPost(found);
    } catch {}
  }, [allPosts]);

  // Preselect post from pretty URL slug (/blog/:slug)
  useEffect(() => {
    if (!initialSlug) return;
    const found = allPosts.find(p => p.id === initialSlug);
    if (found) setSelectedPost(found);
  }, [initialSlug, allPosts]);
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: t('pages.blog.newsletter.invalidEmail'),
        description: t('pages.blog.newsletter.invalidEmailDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call - in real implementation, this would integrate with email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('pages.blog.newsletter.success'),
        description: t('pages.blog.newsletter.successDesc'),
        variant: "default"
      });
      
      setNewsletterEmail('');
    } catch (error) {
      toast({
        title: t('pages.blog.newsletter.failed'),
        description: t('pages.blog.newsletter.failedDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (selectedPost) {
    return (
      <BlogPostView
        post={selectedPost}
        allPosts={allPosts}
        onBack={() => {
          setSelectedPost(null);
          navigateTo('/blog');
        }}
        onPostSelect={(post) => {
          setSelectedPost(post);
          navigateTo(`/blog/${post.id}`);
        }}
        navigateTo={navigateTo}
        showBackToTop={showBackToTop}
      />
    );
  }

  return (
    <BlogList
      allPosts={allPosts}
      featurePost={safeFeaturePost}
      categories={categories}
      filterCategory={filterCategory}
      filterQuery={filterQuery}
      filteredPosts={filteredPosts}
      isFilteringActive={isFilteringActive}
      onCategoryChange={setFilterCategory}
      onQueryChange={setFilterQuery}
      onClearFilters={() => {
        setFilterCategory(allCategory);
        setFilterQuery('');
      }}
      onPostSelect={(post) => {
        setSelectedPost(post);
        navigateTo(`/blog/${post.id}`);
      }}
      navigateTo={navigateTo}
      newsletterEmail={newsletterEmail}
      isSubscribing={isSubscribing}
      onNewsletterEmailChange={setNewsletterEmail}
      onNewsletterSubmit={handleNewsletterSubmit}
      showBackToTop={showBackToTop}
    />
  );
}
