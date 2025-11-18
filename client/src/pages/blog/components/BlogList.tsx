import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { BlogPost } from '../types';
import { getPostImage, getPostRating } from '../utils';
import { CATEGORY_IMAGES, GENERIC_BLOG_IMAGE } from '../constants';
import { BlogPostCard } from './BlogPostCard';
import { BlogFilters } from './BlogFilters';
import { useTranslation } from '@/context/TranslationContext';

interface BlogListProps {
  allPosts: BlogPost[];
  featurePost: BlogPost | null;
  categories: string[];
  filterCategory: string;
  filterQuery: string;
  filteredPosts: BlogPost[];
  isFilteringActive: boolean;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onClearFilters: () => void;
  onPostSelect: (post: BlogPost) => void;
  navigateTo: (path: string) => void;
  newsletterEmail: string;
  isSubscribing: boolean;
  onNewsletterEmailChange: (email: string) => void;
  onNewsletterSubmit: (e: React.FormEvent) => void;
  showBackToTop: boolean;
}

export function BlogList({
  allPosts,
  featurePost,
  categories,
  filterCategory,
  filterQuery,
  filteredPosts,
  isFilteringActive,
  onCategoryChange,
  onQueryChange,
  onClearFilters,
  onPostSelect,
  navigateTo,
  newsletterEmail,
  isSubscribing,
  onNewsletterEmailChange,
  onNewsletterSubmit,
  showBackToTop,
}: BlogListProps) {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  const handleBackToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <UnifiedNavigation currentPage="blog" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 px-2">
            Wizqo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t('pages.blog.title')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            {t('pages.blog.subtitle')}
          </p>
        </div>

        {allPosts.length > 0 ? (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <aside className="hidden md:block md:col-span-3 print:hidden" aria-label={t('pages.blog.popularPosts')}>
              <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-semibold text-slate-500 tracking-wide mb-2">{t('pages.blog.popularPosts')}</div>
                <nav aria-label={t('pages.blog.popularBlogPosts')}>
                  <ul className="mt-1 space-y-1 text-sm">
                    {allPosts.slice(0, 6).map((p) => (
                      <li key={`toc-${p.id}`}>
                        <a
                          href={`/blog/${p.id}`}
                          className="block w-full text-left px-2 py-1 rounded hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 no-underline"
                          onClick={(e) => {
                            // Allow right-click, middle-click, and Ctrl/Cmd+click to work naturally (open in new tab)
                            if (e.button === 1 || e.button === 2 || e.ctrlKey || e.metaKey || e.shiftKey) {
                              return; // Let browser handle it naturally
                            }
                            // For regular left-click, prevent default and use onClick handler
                            e.preventDefault();
                            onPostSelect(p);
                            navigateTo(`/blog/${p.id}`);
                          }}
                          onMouseDown={(e) => {
                            // Allow right-click and middle-click to work naturally
                            if (e.button === 1 || e.button === 2) {
                              e.preventDefault(); // Prevent our onClick from firing
                              return;
                            }
                          }}
                          aria-label={`Read: ${p.title}`}
                        >
                          {p.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            <div className="md:col-span-9 space-y-8">
              {featurePost && (
                <article 
                  className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-slate-900 cursor-pointer border border-slate-200 hover:border-purple-300 transition-all focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
                  role="article"
                  aria-labelledby={`feature-title-${featurePost.id}`}
                >
                  <a
                    href={`/blog/${featurePost.id}`}
                    onClick={(e) => {
                      // Allow right-click, middle-click, and Ctrl/Cmd+click to work naturally (open in new tab)
                      if (e.button === 1 || e.button === 2 || e.ctrlKey || e.metaKey || e.shiftKey) {
                        return; // Let browser handle it naturally
                      }
                      // For regular left-click, prevent default and use onClick handler
                      e.preventDefault();
                      onPostSelect(featurePost);
                      navigateTo(`/blog/${featurePost.id}`);
                    }}
                    onMouseDown={(e) => {
                      // Allow right-click and middle-click to work naturally
                      if (e.button === 1 || e.button === 2) {
                        e.preventDefault(); // Prevent our onClick from firing
                        return;
                      }
                    }}
                    className="block no-underline text-inherit"
                    aria-label={`Read featured article: ${featurePost.title}`}
                  >
                  <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full mb-4 inline-block">
                    {t('pages.blog.readMore')}
                  </span>
                  {(() => {
                    const firstImgMatch = (featurePost.content || '').match(/!\[[^\]]*\]\((\S+?)(?:\s+".*?")?\)/);
                    const firstMdUrl = firstImgMatch ? firstImgMatch[1] : undefined;
                    const cover = firstMdUrl || getPostImage(featurePost);
                    return (
                      <img
                        loading="lazy"
                        src={cover}
                        alt={featurePost.imageAlt || featurePost.title}
                        width={1200}
                        height={540}
                        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg mb-4 border border-slate-200"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const fallbacks = [getPostImage(featurePost), CATEGORY_IMAGES[featurePost.category], GENERIC_BLOG_IMAGE].filter(Boolean) as string[];
                          const tried = parseInt(img.getAttribute('data-errcount') || '0', 10);
                          if (tried < fallbacks.length) {
                            img.setAttribute('data-errcount', String(tried + 1));
                            img.src = fallbacks[tried] as string;
                          }
                        }}
                      />
                    );
                  })()}
                  <h2 id={`feature-title-${featurePost.id}`} className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    {featurePost.title}
                  </h2>
                  <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90 leading-relaxed">
                    {featurePost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm">
                    <span className="flex items-center gap-2" aria-label={`Reading time: ${featurePost.readTime}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {featurePost.readTime}
                    </span>
                    <span className="flex items-center gap-2" aria-label={`Published: ${featurePost.date}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {featurePost.date}
                    </span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs" aria-label={`Category: ${featurePost.category}`}>
                      {featurePost.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-300" role="img" aria-label={`Rating: ${getPostRating(featurePost)} out of 5 stars`}>
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm ml-1">({getPostRating(featurePost)})</span>
                    </div>
                  </div>
                  </a>
                </article>
              )}

              <BlogFilters
                categories={categories}
                filterCategory={filterCategory}
                filterQuery={filterQuery}
                onCategoryChange={onCategoryChange}
                onQueryChange={onQueryChange}
                onClear={onClearFilters}
              />

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 sm:p-8 mb-6">
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-4xl">
                    {t('pages.blog.subtitle')}
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('pages.blog.readMore')}</h2>
                <div id="blog-results" className="grid md:grid-cols-2 gap-6">
                  {(() => {
                    const cards = (isFilteringActive ? filteredPosts : allPosts)
                      .filter(p => (featurePost ? p.id !== featurePost.id : true));
                    if (cards.length === 0) {
                      return (
                        <div className="col-span-2 bg-white rounded-xl p-6 border border-slate-200 text-center text-slate-600" role="status" aria-live="polite">
                          {t('pages.blog.filters.searchPlaceholder')}
                        </div>
                      );
                    }
                    return cards.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        onClick={() => {
                          onPostSelect(post);
                          navigateTo(`/blog/${post.id}`);
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">{t('pages.blog.newsletter.title')}</h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  {t('pages.blog.newsletter.description')}
                </p>
                <form onSubmit={onNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto" aria-label={t('pages.blog.newsletter.title')}>
                  <label htmlFor="newsletter-email" className="sr-only">{t('pages.blog.newsletter.placeholder')}</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => onNewsletterEmailChange(e.target.value)}
                    placeholder={t('pages.blog.newsletter.placeholder')}
                    className="flex-1 px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800 text-white placeholder-slate-400"
                    required
                    aria-label={t('pages.blog.newsletter.placeholder')}
                  />
                  <button 
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label={isSubscribing ? t('pages.blog.newsletter.subscribing') : t('pages.blog.newsletter.subscribe')}
                  >
                    {isSubscribing ? t('pages.blog.newsletter.subscribing') : t('pages.blog.newsletter.subscribe')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-8" aria-hidden="true">📝</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Getting Ready to Share</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're preparing valuable content about hobby learning, AI-powered education, and success strategies. Our blog will soon feature:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4" aria-hidden="true">🎯</div>
                <h3 className="font-bold text-slate-900 mb-2">Learning Guides</h3>
                <p className="text-slate-600 text-sm">Step-by-step tutorials for popular hobbies</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4" aria-hidden="true">✨</div>
                <h3 className="font-bold text-slate-900 mb-2">Success Stories</h3>
                <p className="text-slate-600 text-sm">Real experiences from our learners</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4" aria-hidden="true">🧠</div>
                <h3 className="font-bold text-slate-900 mb-2">AI Insights</h3>
                <p className="text-slate-600 text-sm">How AI enhances personalized learning</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-3">{t('pages.blog.newsletter.title')}</h3>
              <p className="text-slate-600 mb-4">{t('pages.blog.newsletter.description')}</p>
              <form onSubmit={onNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto" aria-label={t('pages.blog.newsletter.title')}>
                <label htmlFor="newsletter-email-empty" className="sr-only">{t('pages.blog.newsletter.placeholder')}</label>
                <input
                  id="newsletter-email-empty"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => onNewsletterEmailChange(e.target.value)}
                  placeholder={t('pages.blog.newsletter.placeholder')}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  aria-label={t('pages.blog.newsletter.placeholder')}
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label={isSubscribing ? t('pages.blog.newsletter.subscribing') : t('pages.blog.newsletter.subscribe')}
                >
                  {isSubscribing ? t('pages.blog.newsletter.subscribing') : t('pages.blog.newsletter.subscribe')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          aria-label={t('pages.blog.backToTop')}
          className="fixed bottom-6 left-6 z-40 print:hidden inline-flex items-center gap-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 px-4 py-3"
        >
          <span aria-hidden="true">↑</span>
          <span className="text-sm">{t('pages.blog.backToTop')}</span>
        </button>
      )}

      <Footer />
    </div>
  );
}
