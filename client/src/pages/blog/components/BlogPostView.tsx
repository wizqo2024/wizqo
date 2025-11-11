import React, { useEffect } from 'react';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '../types';
import { getPostImage, getPostRating } from '../utils';
import { CATEGORY_IMAGES, GENERIC_BLOG_IMAGE } from '../constants';
import { MarkdownRenderer } from './MarkdownRenderer';
import { trackBlogPostView } from '@/utils/analytics';

interface BlogPostViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  onPostSelect: (post: BlogPost) => void;
  navigateTo: (path: string) => void;
  showBackToTop: boolean;
}

const ALT_GENERIC_IMAGE = 'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0ee?auto=format&fit=crop&w=1600&q=80';

export function BlogPostView({
  post,
  allPosts,
  onBack,
  onPostSelect,
  navigateTo,
  showBackToTop,
}: BlogPostViewProps) {
  const { toast } = useToast();
  const coverUrl = getPostImage(post) || GENERIC_BLOG_IMAGE;
  const usedImageUrls = new Set<string>([coverUrl]);
  const pickFallback = (primaryUrl?: string) => {
    const pool = [primaryUrl, CATEGORY_IMAGES[post.category], GENERIC_BLOG_IMAGE, ALT_GENERIC_IMAGE].filter(Boolean) as string[];
    for (const candidate of pool) {
      if (!usedImageUrls.has(candidate)) {
        usedImageUrls.add(candidate);
        return candidate;
      }
    }
    return pool[pool.length - 1];
  };

  const handleShare = async () => {
    try {
      const url = `https://wizqo.com/blog/${post.id}`;
      const title = post.title;
      const text = post.excerpt || title;
      if (navigator.share) {
        await navigator.share({ title, text, url });
        toast({ title: "Shared", description: "Thanks for sharing!" });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Blog link copied to clipboard." });
      } else {
        window.open(url, '_blank');
      }
    } catch (e) {
      toast({ title: "Share failed", description: "Please try again or copy the link.", variant: "destructive" });
    }
  };

  const canonical = `https://wizqo.com/blog/${post.id}`;
  const image = post.imageUrl || CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE;
  
  // Track blog post view (doesn't affect SEO)
  useEffect(() => {
    trackBlogPostView(post.id, post.title);
  }, [post.id, post.title]);
  
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    author: { "@type": "Organization", name: "Wizqo" },
    publisher: { "@type": "Organization", name: "Wizqo" },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical }
  } as any;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://wizqo.com/blog" },
      { "@type": "ListItem", position: 2, name: post.title, item: canonical }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags 
        title={post.id ? `${post.title}` : post.title}
        description={post.excerpt}
        keywords={post.keywords}
        ogImage={post.imageUrl}
        canonicalUrl={canonical}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <UnifiedNavigation currentPage="blog" />
      
      <div className={`${post.id === 'what-are-cognitive-skills' ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            aria-label="Back to blog"
          >
            ← Back to Blog
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Share this article"
            >
              Share
            </button>
          </div>
        </div>
        
        <nav aria-label="Popular worksheets" className="mb-4">
          <ul className="flex flex-wrap gap-2 text-sm">
            <li><a href="/worksheets/handwriting-worksheet-maker" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">✍️ Handwriting worksheets (PDF)</a></li>
            <li><a href="/worksheets/1st-grade-math-worksheets" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">1st grade math – printable</a></li>
            <li><a href="/worksheets/reading-comprehension" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">Reading comprehension (free PDF)</a></li>
          </ul>
        </nav>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <article className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl md:col-span-12">
            <div className="mb-8">
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium" aria-label={`Category: ${post.category}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1" aria-label={`Published: ${post.date}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {post.date}
                </span>
                <span className="flex items-center gap-1" aria-label={`Reading time: ${post.readTime}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {post.title}
              </h1>
              {(['easy-hobbies-that-make-you-smarter','easy-watercolor-paintings'].includes(post.id)) && (
                <nav aria-label="Quick worksheet links" className="mb-4">
                  <ul className="flex flex-wrap gap-2 text-sm">
                    <li><a href="/worksheets/handwriting-worksheet-maker" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">✍️ Handwriting worksheets (PDF)</a></li>
                    <li><a href="/worksheets/1st-grade-math-worksheets" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">➕ 1st grade math – printable</a></li>
                    <li><a href="/worksheets/reading-comprehension" className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">📖 Reading comprehension (free PDF)</a></li>
                  </ul>
                </nav>
              )}
              <figure className="mb-6">
                <picture>
                  <source srcSet={(coverUrl || '').replace(/(\?|$)/, (m) => (m ? '?': '') + 'auto=format&fit=crop&q=70&w=1600&fm=avif')} type="image/avif" />
                  <source srcSet={(coverUrl || '').replace(/(\?|$)/, (m) => (m ? '?': '') + 'auto=format&fit=crop&q=75&w=1600&fm=webp')} type="image/webp" />
                  <img 
                    src={coverUrl} 
                    alt={post.imageAlt || post.title} 
                    width={1600}
                    height={640}
                    referrerPolicy="no-referrer"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl border border-slate-200"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      const tried = parseInt(img.getAttribute('data-errcount') || '0', 10);
                      const candidates = [
                        CATEGORY_IMAGES[post.category],
                        GENERIC_BLOG_IMAGE,
                        ALT_GENERIC_IMAGE
                      ].filter(Boolean) as string[];
                      let picked: string | undefined;
                      let pickedIndex = tried;
                      for (let i = tried; i < candidates.length; i++) {
                        const c = candidates[i]!;
                        if (!usedImageUrls.has(c)) { picked = c; pickedIndex = i; break; }
                      }
                      if (!picked && candidates.length > 0) {
                        picked = candidates[Math.min(tried, candidates.length - 1)] || candidates[0];
                      }
                      if (picked) {
                        img.setAttribute('data-errcount', String(Math.min(pickedIndex + 1, candidates.length)));
                        if (img.src !== picked) {
                          img.src = picked;
                          usedImageUrls.add(picked);
                        }
                      }
                    }}
                  />
                </picture>
                {post.imageAlt && (
                  <figcaption className="text-sm text-slate-500 mt-2">{post.imageAlt}</figcaption>
                )}
              </figure>
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg text-slate-600">By {post.author || 'Wizqo Team'} • Last updated {post.date}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500" role="img" aria-label={`Rating: ${getPostRating(post)} out of 5 stars`}>
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">({getPostRating(post)})</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-slate-700 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
            
            <MarkdownRenderer post={post} usedImageUrls={usedImageUrls} pickFallback={pickFallback} />
          </article>
        </div>

        <aside className="mt-12" aria-label="Related articles">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Keep Reading</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {allPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => onPostSelect(p)}
                  className="text-left bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label={`Read article: ${p.title}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">{p.category}</span>
                    <span className="text-xs text-slate-500">{p.readTime}</span>
                  </div>
                  <div className="font-semibold text-slate-900 line-clamp-2">{p.title}</div>
                  <div className="text-sm text-slate-600 line-clamp-2 mt-1">{p.excerpt}</div>
                </button>
              ))}
          </div>
        </aside>
      </div>

      {showBackToTop && (
        <button
          onClick={() => {
            try {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {}
          }}
          aria-label="Scroll to top"
          className="fixed bottom-6 left-6 z-40 print:hidden inline-flex items-center gap-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 px-4 py-3"
        >
          <span aria-hidden="true">↑</span>
          <span className="text-sm">Scroll up</span>
        </button>
      )}

      <Footer />
    </div>
  );
}
