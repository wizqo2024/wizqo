import * as React from 'react';
const { useEffect, useLayoutEffect, useMemo, useState, lazy, Suspense } = React;
import { supabase } from './lib/supabase';
import { UnifiedNavigation } from './components/UnifiedNavigation';
import { SplitPlanInterface } from './components/SplitPlanInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { LandingPage } from './components/LandingPage';
import { BlogPage } from './pages/BlogPage';
import Dashboard from './components/Dashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PrintablesPage } from './pages/PrintablesPage';
import DebugSEOPage from './pages/DebugSEOPage';
import { PrintablesLandingPage } from './pages/PrintablesLandingPage';
import WorksheetsSecondGradePage from './pages/WorksheetsSecondGradePage';
import ReadingComprehensionPage from './pages/ReadingComprehensionPage';
import WorksheetsFirstGradePage from './pages/WorksheetsFirstGradePage';
import WorksheetsKindergartenPage from './pages/WorksheetsKindergartenPage';
import WorksheetsThirdGradePage from './pages/WorksheetsThirdGradePage';
import WorksheetsFourthGradePage from './pages/WorksheetsFourthGradePage';
import WorksheetsFifthGradePage from './pages/WorksheetsFifthGradePage';
import HandwritingMakerPage from './pages/HandwritingMakerPage';
import NameTracingGeneratorPage from './pages/NameTracingGeneratorPage';
import InteractiveWorksheetsPage from './pages/InteractiveWorksheetsPage';
import CursiveAlphabetWorksheet from '@/pages/worksheets/cursive/CursiveAlphabetWorksheet';
import CursivePracticeWorksheet from '@/pages/worksheets/cursive/CursivePracticeWorksheet';
import CapitalCursiveWorksheet from '@/pages/worksheets/cursive/CapitalCursiveWorksheet';
import JoiningCursiveWorksheet from '@/pages/worksheets/cursive/JoiningCursiveWorksheet';
import HybridHandwritingWorksheet from '@/pages/worksheets/cursive/HybridHandwritingWorksheet';
import { SEOMetaTags } from './components/SEOMetaTags';
import CertificateMakerPage from './pages/CertificateMakerPage';
import KidsPage from './pages/KidsPage';
import MultiplicationWorksheetsPage from './pages/MultiplicationWorksheetsPage';
import TimesTableMultiplicationWorksheetsPage from './pages/TimesTableMultiplicationWorksheetsPage';
import FractionsToDecimalsWorksheetsPage from './pages/FractionsToDecimalsWorksheetsPage';
import OrderOfOperationsWorksheetsPage from './pages/OrderOfOperationsWorksheetsPage';
import WorksheetPage from './pages/WorksheetPage';
import AllWorksheetsPage from './pages/AllWorksheetsPage';
import ShadowMatchingWorksheetPage from './pages/ShadowMatchingWorksheetPage';
import MatchFeelingWorksheetPage from './pages/MatchFeelingWorksheetPage';
import InteractiveReadingWorksheetPage from './pages/InteractiveReadingWorksheetPage';
import SpellingListGeneratorPage from './pages/SpellingListGeneratorPage';
import ScissorSkillsGeneratorPage from './pages/ScissorSkillsGeneratorPage';




import NotFoundPage from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initAnalytics, trackPageView, trackUserFlow } from './utils/analytics';
import { TranslationProvider } from './context/TranslationContext';
import { parseLocaleFromPath, addLocaleToPath, removeLocaleFromPath, getLocaleFromURL, shouldAddLocale } from './utils/locale';
import { getWorksheetSEOBySlug, HUB_SEO_DATA } from '@shared/worksheetSEO';
import { SkipLink } from './components/SkipLink';


type QuizAnswers = {
  experience?: string;
  timeAvailable?: string;
  goal?: string;
};

export default function App() {
  const [planData, setPlanData] = React.useState<any | null>(null);
  const [hydratedPlan, setHydratedPlan] = React.useState<any | null>(null);
  const [hydrating, setHydrating] = React.useState(false);

  const handleGeneratePlan = async (hobby: string, answers: QuizAnswers) => {
    // Try to include user_id for per-day limit
    let userId: string | undefined;
    try {
      // Accessing context inside same component via hook wrapper
      // Fallback to session user if context not available here
      const s = sessionStorage.getItem('auth_user');
      if (s) userId = JSON.parse(s)?.id;
    } catch { }

    const resp = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby, ...answers, user_id: userId })
    });
    if (resp.status === 429) {
      const j = await resp.json().catch(() => ({} as any));
      throw new Error(j?.error === 'plan_limit_reached' ? 'Plan limit reached (5 per account).' : 'Rate limited');
    }
    if (resp.status === 409) {
      const j = await resp.json().catch(() => ({} as any));
      const pid = j?.plan_id;
      throw new Error(j?.message || (pid ? `Duplicate plan exists (ID ${pid}). Open it from your dashboard.` : 'You already have a plan for this hobby.'));
    }
    if (!resp.ok) throw new Error('Failed to generate plan');
    const data = await resp.json();
    sessionStorage.setItem('currentPlanData', JSON.stringify(data));
    return data;
  };

  const handlePlanGenerated = (plan: any) => {
    setPlanData(plan);
  };

  const handleNavigateBack = () => {
    setPlanData(null);
    sessionStorage.removeItem('currentPlanData');
  };

  const currentPlan = planData || (() => {
    const s = sessionStorage.getItem('currentPlanData');
    if (!s) return null;
    try {
      const first = JSON.parse(s);
      if (typeof first === 'string') {
        try { return JSON.parse(first); } catch { return null; }
      }
      return first;
    } catch {
      return null;
    }
  })();

  // NEW: Use proper URL routing with locale support
  const [route, setRoute] = React.useState<string>(() => {
    const path = window.location.pathname + window.location.search;
    return path || '/';
  });
  const [isNavigating, setIsNavigating] = React.useState(false);

  // NEW: Navigation function that updates URL properly and preserves locale
  const navigateTo = React.useCallback((path: string, options?: { replace?: boolean }) => {
    // Get current locale from URL
    const currentLocale = getLocaleFromURL();

    // Parse the new path
    const url = new URL(path, window.location.origin);
    const newPath = url.pathname;

    // If path already has locale, use it; otherwise preserve current locale
    const { locale: pathLocale } = parseLocaleFromPath(newPath);
    const localeToUse = pathLocale !== 'en' ? pathLocale : currentLocale;

    // Build final path with locale
    const cleanPath = removeLocaleFromPath(newPath);
    const finalPath = shouldAddLocale(cleanPath)
      ? addLocaleToPath(cleanPath, localeToUse)
      : cleanPath;


    const finalUrl = finalPath + url.search;

    if (options?.replace) {
      window.history.replaceState({}, '', finalUrl);
    } else {
      window.history.pushState({}, '', finalUrl);
    }
    setRoute(finalUrl);
  }, [parseLocaleFromPath, addLocaleToPath, removeLocaleFromPath, getLocaleFromURL, shouldAddLocale]);

  // NEW: Redirect component for cleaner declarative redirects
  const Redirect = React.useCallback(({ to, replace = true }: { to: string; replace?: boolean }) => {
    React.useEffect(() => {
      navigateTo(to, { replace });
    }, [to, replace]);
    return null;
  }, [navigateTo]);

  // Track previous route for user flow analysis
  const prevRouteRef = React.useRef<string>('');

  useEffect(() => {
    // Track page view and user flow on route change
    const currentRoute = window.location.pathname + window.location.search;
    if (currentRoute !== prevRouteRef.current) {
      trackPageView(currentRoute);
      if (prevRouteRef.current) {
        trackUserFlow(prevRouteRef.current, currentRoute, 'navigation');
      }
      prevRouteRef.current = currentRoute;
    }
  }, [route]);

  useEffect(() => {
    const onPopState = () => {
      setIsNavigating(true);
      const newRoute = window.location.pathname + window.location.search || '/';
      setRoute(newRoute);
      // Track back/forward navigation
      if (prevRouteRef.current) {
        trackUserFlow(prevRouteRef.current, newRoute, 'browser_back_forward');
      }
      prevRouteRef.current = newRoute;
      // Small delay to ensure smooth transition
      setTimeout(() => setIsNavigating(false), 50);
    };
    const onLocationChange = () => {
      setIsNavigating(true);
      const newRoute = window.location.pathname + window.location.search || '/';
      setRoute(newRoute);
      setTimeout(() => setIsNavigating(false), 50);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('locationchange', onLocationChange);

    // Intercept all link clicks to prevent full page reloads
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;

      if (link && link.href) {
        try {
          // Skip special protocols (mailto:, tel:, javascript:, etc.)
          if (link.protocol && !['http:', 'https:', ''].includes(link.protocol)) {
            return;
          }

          const url = new URL(link.href);
          const currentOrigin = window.location.origin;

          // Only intercept internal links
          if (url.origin === currentOrigin && !link.hasAttribute('data-external')) {
            // Don't intercept if it has target="_blank" or other special attributes
            if (link.target && link.target !== '_self') return;

            // Don't intercept if it's a download link
            if (link.hasAttribute('download')) return;

            // Don't intercept if it's just a hash link (same page anchor)
            if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
              return; // Let browser handle hash navigation
            }

            e.preventDefault();
            e.stopPropagation();

            const newPath = url.pathname + url.search + url.hash;

            // Only navigate if it's a different path
            if (newPath !== (window.location.pathname + window.location.search + window.location.hash)) {
              setIsNavigating(true);
              navigateTo(newPath);
              // Small delay to ensure smooth transition
              setTimeout(() => setIsNavigating(false), 100);
            }
          }
        } catch (err) {
          // If URL parsing fails, let the browser handle it normally
          // Silently fail - navigation will work normally
        }
      }
    };

    document.addEventListener('click', handleClick, true); // Use capture phase

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('locationchange', onLocationChange);
      document.removeEventListener('click', handleClick, true);
    };
  }, [navigateTo]);

  const [routeKey, routeQuery] = useMemo(() => {
    // Ensure we use the actual current URL if route is empty or just '/'
    const currentRoute = route || window.location.pathname + window.location.search;
    const path = currentRoute.replace(/^\/?/, '');
    const [pathname, queryString] = path.split('?');

    // Remove locale prefix from pathname for routing
    const { path: pathWithoutLocale } = parseLocaleFromPath(pathname);
    const cleanPath = pathWithoutLocale.replace(/^\/+/, '');

    // Get first segment (route key) after removing locale
    const seg = (cleanPath.split('/')[0] || '').toLowerCase();
    const params = new URLSearchParams(queryString || '');
    return [seg, params] as const;
  }, [route, parseLocaleFromPath]);

  const routeSubKey = useMemo(() => {
    const currentRoute = route || window.location.pathname + window.location.search;
    const path = currentRoute.replace(/^\/?/, '');
    const [pathname] = path.split('?');

    // Remove locale prefix
    const { path: pathWithoutLocale } = parseLocaleFromPath(pathname);
    const cleanPath = pathWithoutLocale.replace(/^\/+/, '');
    const segs = cleanPath.split('/');
    return (segs[1] || '').toLowerCase();
  }, [route, parseLocaleFromPath]);

  // Redirect bare /worksheets to the preferred hub URL to avoid duplicate indexing
  // Preserve locale when redirecting
  useEffect(() => {
    try {
      if (routeKey === 'worksheets' && !routeSubKey) {
        const currentLocale = getLocaleFromURL();
        const target = addLocaleToPath('/worksheets/2nd-grade-math-worksheets', currentLocale);
        if (window.location.pathname !== target) {
          window.history.replaceState({}, '', target);
          setRoute(target);
        }
      }

      // Fix 404: Redirect legacy /fractions-to-decimals-worksheets to /worksheets/fractions-to-decimals-worksheets
      if (routeKey === 'fractions-to-decimals-worksheets') {
        const currentLocale = getLocaleFromURL();
        const target = addLocaleToPath('/worksheets/fractions-to-decimals-worksheets', currentLocale);
        if (window.location.pathname !== target) {
          window.history.replaceState({}, '', target);
          setRoute(target);
        }
      }
    } catch { }
  }, [routeKey, routeSubKey, getLocaleFromURL, addLocaleToPath]);

  // Persist plan_id from URL into session for downstream hydration
  useEffect(() => {
    if (routeKey === 'plan' && routeQuery) {
      const planId = routeQuery.get('plan_id');
      if (planId) {
        try { sessionStorage.setItem('activePlanId', planId); } catch { }
      }
    }
  }, [routeKey, routeQuery]);

  // Top-level hydration for /plan route so Split receives initialPlanData immediately
  useEffect(() => {
    const hydrate = async () => {
      try {
        setHydrating(true);
        setHydratedPlan(null);
        if (routeKey !== 'plan') return;

        const planId = routeQuery.get('plan_id') || sessionStorage.getItem('activePlanId') || '';

        if (!planId) {
          return;
        }

        // Fetch fresh plan data from the database
        try {
          // First try: Fetch from API
          const r = await fetch(`/api/hobby-plans/${planId}?_t=${Date.now()}`, { cache: 'no-cache' });

          if (r.ok) {
            const j = await r.json();
            const payload = j?.plan_data || j?.planData || j;

            // Handle nested plan_data structure
            let finalPayload = payload;
            if (payload?.plan_data?.days) {
              finalPayload = payload.plan_data;
            } else if (payload?.days) {
              finalPayload = payload;
            }

            if (finalPayload && finalPayload.days) {
              setHydratedPlan(finalPayload);
              return;
            }
          }
        } catch (error) {
          console.error('Plan hydration: API fetch error:', error);
        }

        // Fallback: Try Supabase direct
        try {
          const { data, error } = await supabase
            .from('hobby_plans')
            .select('id, plan_data')
            .eq('id', planId)
            .maybeSingle();

          if (!error && data && (data as any).plan_data?.days) {
            const payload = (data as any).plan_data;
            setHydratedPlan(payload);
            return;
          }

          // Handle nested plan_data structure for Supabase
          if ((data as any)?.plan_data?.plan_data?.days) {
            const nestedPayload = (data as any).plan_data.plan_data;
            setHydratedPlan(nestedPayload);
            return;
          }
        } catch (error) {
          console.error('Plan hydration: Supabase error:', error);
        }
      } finally {
        setHydrating(false);
      }
    };
    hydrate();
  }, [routeKey, routeQuery]);

  // Initialize analytics after component mounts (doesn't affect SEO)
  useEffect(() => {
    initAnalytics();
  }, []);

  // Signal that React has hydrated/mounted to hide the SEO fallback content
  // This replaces the aggressive inline script in index.html to ensure crawlers see content if JS fails
  React.useLayoutEffect(() => {
    document.body.classList.add('react-loaded');
  }, []);

  return (
    <AuthProvider>
      <TranslationProvider>
        <ErrorBoundary>
          <SkipLink />
          <div className={`min-h-screen bg-slate-50 relative transition-opacity duration-200 ${isNavigating ? 'opacity-95' : 'opacity-100'}`}>
            {/* Loading overlay during navigation */}
            {isNavigating && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] pointer-events-none transition-opacity duration-200" />
            )}
            {(() => {
              // Get current locale for canonical URLs
              const currentLocale = getLocaleFromURL();
              const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
              const cleanPath = removeLocaleFromPath(currentPath);
              const baseCanonical = `https://wizqo.com${addLocaleToPath(cleanPath, currentLocale)}`;

              switch (routeKey) {
                case '': // home
                  return (
                    <>
                      {(() => {
                        const seo = HUB_SEO_DATA['home'] || {}
                        return (
                          <SEOMetaTags
                            title={seo.title || "Free Worksheets for Kids (K-5) | Math, Reading & More | Wizqo"}
                            description={seo.metaDescription || "Download free printable worksheets for kids (K-5). Math, reading, writing, tracing, and multiplication worksheets with answer keys—100% free, ready to print."}
                            keywords={seo.keywords || "free printable worksheets, math worksheets, reading worksheets, handwriting worksheets, worksheets for kids, kindergarten worksheets, 1st grade worksheets, 2nd grade worksheets"}
                            canonicalUrl={baseCanonical}
                            ogImage={seo.image || "/images/hero-real.png"}
                          />
                        )
                      })()}
                      <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                    </>
                  );
                case 'generate':
                  return (
                    <>
                      <SEOMetaTags
                        title="My Learning Plan Generator - Free AI-Powered 7-Day Plans | Wizqo"
                        description="Create personalized learning resources with AI! Free educational tools, worksheets, and guides for teachers, students, and parents."
                        keywords="my learning plan, learning plan generator, create learning plan, personalized learning plan, 7-day learning plan, AI learning plan, free learning plan generator"
                        canonicalUrl={`https://wizqo.com${addLocaleToPath('/generate', currentLocale)}`}
                      />
                      <SplitPlanInterface onGeneratePlan={handleGeneratePlan} onNavigateBack={() => navigateTo('/')} />
                    </>
                  );
                case 'debug-seo':
                  return <DebugSEOPage />;
                case 'plan':
                  return (
                    <>
                      <SEOMetaTags
                        title="Your Learning Plan - Wizqo"
                        description="Your personalized 7-day learning plan with daily videos, practice guides, and progress tracking."
                        canonicalUrl={`https://wizqo.com${addLocaleToPath('/plan', currentLocale)}`}
                        noIndex={true}
                      />
                      <SplitPlanInterface
                        onGeneratePlan={handleGeneratePlan}
                        onNavigateBack={() => navigateTo('/dashboard')}
                        initialPlanData={(hydratedPlan || currentPlan) || undefined}
                      />
                    </>
                  );
                case 'blog':
                  return (
                    <>
                      <SEOMetaTags
                        title="Free Printable Worksheet Ideas, Teaching Tips & Learning Blog | Wizqo"
                        description="Explore Wizqo's free educational blog with printable worksheet ideas, teaching tips, learning strategies, and classroom inspiration for teachers and parents."
                        keywords="free printable worksheets, learning blog, educational tips, teaching ideas, classroom resources, student learning, homeschool worksheets"
                        canonicalUrl={`https://wizqo.com${addLocaleToPath('/blog', currentLocale)}`}
                      />
                      <BlogPage initialSlug={window.location.pathname.replace(/^\/?/, '').split('/')[1]} />
                    </>
                  );
                case 'kids':
                  return (
                    <KidsPage />

                  );
                case 'print': {
                  const searchParams = new URLSearchParams(window.location.search);
                  const docId = searchParams.get('doc');


                  return (
                    <>
                      <SEOMetaTags
                        title="Printable Fun Learning Activities for Kids | Free Worksheets & Games"
                        description="Download free printables for kids: word searches, Sudoku, coloring, and spot-the-difference. Print at home in seconds."
                        canonicalUrl={`https://wizqo.com${addLocaleToPath('/print', currentLocale)}`}
                        noIndex={true}
                      />
                      <PrintablesPage />
                    </>
                  );
                }
                case 'interactive-worksheets-generator':
                  return (
                    <>
                      <SEOMetaTags
                        title="Free Interactive Worksheets Generator | Create PDFs | Wizqo"
                        description="Generate free interactive worksheets for math, reading, science, and SEL. Create printable PDFs with answer keys for grades K-5. Daily refresh with new content!"
                        keywords="interactive worksheets generator, free worksheet generator, printable worksheets generator, create worksheets online, math worksheet generator, reading worksheet generator, free worksheet maker, interactive math worksheets, printable PDF worksheets, worksheet generator with answer keys, grade-specific worksheets, K-5 worksheets"
                        canonicalUrl={`https://wizqo.com${addLocaleToPath('/interactive-worksheets-generator', currentLocale)}`}
                      />
                      <InteractiveWorksheetsPage />
                    </>
                  );
                case 'printables':
                  if (routeSubKey === 'name-tracing-generator') {
                    const canonical = addLocaleToPath('/printables/name-tracing-generator', currentLocale);
                    return (
                      <>
                        <SEOMetaTags
                          title="Free Name Tracing Generator - Personalized Handwriting"
                          description="Create free personalized name tracing worksheets for kids! Customize fonts, sizes, and patterns. Perfect for teaching handwriting and name recognition skills."
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <NameTracingGeneratorPage />
                      </>
                    );
                  }
                  if (routeSubKey === 'certificate-maker') {
                    const canonical = addLocaleToPath('/printables/certificate-maker', currentLocale);
                    return (
                      <>
                        <SEOMetaTags
                          title="How to Make a Certificate Online - Free Certificate Maker"
                          description="Create your own certificate online for free! Make certificates with editable names, cute themes, and instant download. Perfect for achievements!"
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <CertificateMakerPage />
                      </>
                    );
                  }
                  // Handle arbitrary printables slugs (e.g. /printables/coloring)
                  if (routeSubKey) {
                    const worksheetSEO = getWorksheetSEOBySlug(routeSubKey);
                    // Point canonical to /worksheets/slug to avoid duplicate content penalties
                    // while keeping this URL working for users
                    const canonical = addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale);
                    return (
                      <>
                        <SEOMetaTags
                          title={worksheetSEO?.title || `${routeSubKey.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Worksheet`}
                          description={worksheetSEO?.metaDescription || `Free printable ${routeSubKey.replace(/-/g, ' ')} worksheet.`}
                          keywords={worksheetSEO?.keywords || `${routeSubKey}, worksheet, printable`}
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <PrintablesPage docId={routeSubKey} />
                      </>
                    );
                  }

                  return (
                    <>
                      <PrintablesLandingPage />

                    </>
                  );
                case 'worksheets':


                  // Specific logic for Shadow Matching Worksheet to ensure direct rendering
                  if (routeSubKey === 'match-object-to-shadow') {
                    return <ShadowMatchingWorksheetPage />;
                  }

                  // Specific logic for Match The Feeling Worksheet
                  if (routeSubKey === 'match-the-feeling') {
                    return <MatchFeelingWorksheetPage />;
                  }

                  // Specific logic for Reading Discovery Interactive Worksheet
                  if (routeSubKey === 'reading-discovery-interactive') {
                    return <InteractiveReadingWorksheetPage />;
                  }

                  // All worksheets master page
                  if (routeSubKey === 'all') {
                    const canonical = addLocaleToPath('/worksheets/all', currentLocale);
                    return (
                      <>
                        <AllWorksheetsPage />
                      </>
                    );
                  }


                  // Check if this is an individual worksheet page (slug-based)
                  // First, check if it's NOT a category page
                  const categoryPages = [
                    'multiplication-worksheets',
                    'times-table-multiplication-worksheets',
                    'fractions-to-decimals-worksheets',
                    'order-of-operations-worksheets',
                    '1st-grade-math-worksheets',
                    '2nd-grade-math-worksheets',
                    'handwriting-worksheet-maker',
                    'spelling-list-generator',
                    'reading-comprehension',
                    'kindergarten-math-worksheets',
                    '3rd-grade-math-worksheets',
                    '4th-grade-math-worksheets',
                    '5th-grade-math-worksheets',
                    'geometry-worksheets',
                    'geography-worksheets',
                    'measurement-worksheets',
                    'logic-worksheets',
                    'decimal-worksheets',
                    'math-maze-worksheets',
                    'data-analysis-worksheets',
                    'scissor-skills-generator',
                    'all'
                  ];

                  if (routeSubKey && !categoryPages.includes(routeSubKey)) {
                    // Try to get worksheet SEO data - if found, it's a worksheet page
                    const worksheetSEO = getWorksheetSEOBySlug(routeSubKey);
                    if (worksheetSEO) {
                      const canonical = addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale);
                      return (
                        <>
                          <SEOMetaTags
                            title={worksheetSEO.title}
                            description={worksheetSEO.metaDescription}
                            keywords={worksheetSEO.keywords}
                            canonicalUrl={`https://wizqo.com${canonical}`}
                            noIndex={false}
                            ogType="article"
                          />
                          <WorksheetPage slug={routeSubKey} />
                        </>
                      );
                    }
                    // If routeSubKey exists but no worksheet found, show 404
                    return <NotFoundPage />;
                  }

                  // Specific routes that should NOT be handled by the generic PrintablesPage
                  if (routeSubKey === '2nd-grade-math-worksheets') {
                    return <WorksheetsSecondGradePage />;

                  }

                  // Explicit routing for Cursive Worksheets to ensure Rich Header
                  if (routeSubKey === 'half-print-half-cursive-writing' ||
                    routeSubKey === 'cursive-writing-alphabet-worksheets' ||
                    routeSubKey === 'cursive-writing-practice-sheets' ||
                    routeSubKey === 'capital-cursive-writing-worksheets' ||
                    routeSubKey === 'joining-cursive-letters-worksheets') {
                    return (
                      <>
                        <SEOMetaTags
                          title={getWorksheetSEOBySlug(routeSubKey)?.title || "Free Cursive Worksheets"}
                          description={getWorksheetSEOBySlug(routeSubKey)?.metaDescription || "Download free cursive writing worksheets."}
                          keywords={getWorksheetSEOBySlug(routeSubKey)?.keywords || "cursive writing, handwriting practice, free worksheets"}
                          canonicalUrl={`https://wizqo.com${addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale)}`}
                        />
                        <WorksheetPage slug={routeSubKey} />
                      </>
                    );
                  }

                  // Existing category page routes
                  if (routeSubKey === 'multiplication-worksheets') {
                    return <MultiplicationWorksheetsPage />;

                  }
                  if (routeSubKey === 'times-table-multiplication-worksheets') {
                    const canonical = addLocaleToPath('/worksheets/times-table-multiplication-worksheets', currentLocale);
                    return (
                      <>
                        <SEOMetaTags
                          title="Free Times Table Worksheets PDF | Math Practice | Wizqo"
                          description="Print free times table multiplication worksheets (PDF) that boost confidence and accuracy. Fun, no-stress practice for grades 1–5. Download instantly!"
                          keywords="times table multiplication worksheets free pdf, printable times table worksheets for kids, 1–12 multiplication table worksheets pdf, free times table practice sheets grade 1–5, multiplication drill worksheets printable, easy times table worksheets for struggling learners, fun multiplication worksheets for kids pdf, basic multiplication worksheets for beginners, multiplication worksheets with answers pdf, confidence-building multiplication worksheets pdf, stress-free times table worksheets for kids, fun and simple worksheets to make multiplication easier, no-tears times table practice sheets, gentle step-by-step multiplication worksheets, worksheets for kids who struggle with multiplication, printable worksheets to help kids overcome math fear, engaging multiplication worksheets that make learning fun, horizontal multiplication worksheets pdf, vertical multiplication worksheets printable, missing number multiplication worksheets, timed multiplication test sheets printable, multiplication color-by-number worksheets, multiplication worksheets for slow learners pdf, blank times table worksheets to fill in, memorize times tables, multiplication fluency, math fact practice, repeated addition worksheets, math confidence building"
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <TimesTableMultiplicationWorksheetsPage />
                      </>
                    );
                  }
                  if (routeSubKey === 'fractions-to-decimals-worksheets') {
                    const canonical = addLocaleToPath('/worksheets/fractions-to-decimals-worksheets', currentLocale);
                    return (
                      <>
                        <SEOMetaTags
                          title="Free Converting Fractions to Decimals Worksheets (PDF + Answer Key)"
                          description="Download free fractions-to-decimals worksheets with answer keys. Easy, clear math PDFs perfect for grades 3–5. Boost confidence with step-by-step practice."
                          keywords="converting fractions to decimals worksheets free printable, free fractions to decimals worksheets PDF, fractions to decimals worksheet with answer key, converting fractions to decimals step by step worksheet, fractions to decimals practice sheet grade 4, grade 5 converting fractions to decimals worksheets, turning fractions into decimals worksheets free, simple fractions to decimals worksheet for beginners, visual fractions to decimals worksheets PDF, fraction decimal conversion worksheet with examples, fractions to decimals worksheets, converting fractions to decimals, fractions to decimals worksheets with answer keys, fractions to decimals worksheets for 3rd grade, fractions to decimals worksheets for 4th grade, fractions to decimals worksheets for 5th grade, printable fractions to decimals worksheets, fractions to decimals practice sheets, fractions and decimals worksheets, decimal conversion worksheets"
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <FractionsToDecimalsWorksheetsPage />
                      </>
                    );
                  }
                  if (routeSubKey === 'order-of-operations-worksheets') {
                    const canonical = addLocaleToPath('/worksheets/order-of-operations-worksheets', currentLocale);
                    return (
                      <>
                        <OrderOfOperationsWorksheetsPage />
                      </>
                    );
                  }
                  if (routeSubKey === '1st-grade-math-worksheets') {
                    return <WorksheetsFirstGradePage />;

                  }
                  if (routeSubKey === 'handwriting-worksheet-maker') {
                    const canonical = addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale);
                    return (
                      <>
                        <HandwritingMakerPage />
                      </>
                    );
                  }
                  if (routeSubKey === 'spelling-list-generator') {
                    const canonical = addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale);
                    return (
                      <>
                        <SpellingListGeneratorPage />
                      </>
                    );
                  }
                  if (routeSubKey === 'scissor-skills-generator') {
                    return <ScissorSkillsGeneratorPage />;
                  }
                  if (routeSubKey === 'reading-comprehension') {
                    return <ReadingComprehensionPage />;

                  }
                  if (routeSubKey === 'kindergarten-math-worksheets') {
                    return <WorksheetsKindergartenPage />;

                  }
                  if (routeSubKey === '3rd-grade-math-worksheets') {
                    return <WorksheetsThirdGradePage />;

                  }
                  if (routeSubKey === '4th-grade-math-worksheets') {
                    return <WorksheetsFourthGradePage />;

                  }
                  if (routeSubKey === '5th-grade-math-worksheets') {
                    return <WorksheetsFifthGradePage />;

                  }

                  // Handle remaining collection categories
                  if (routeSubKey && categoryPages.includes(routeSubKey)) {
                    const canonical = addLocaleToPath(`/worksheets/${routeSubKey}`, currentLocale);
                    const title = routeSubKey.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    return (
                      <>
                        <SEOMetaTags
                          title={`Free Printable ${title} – PDF & Answer Keys | Wizqo`}
                          description={`Download free printable ${title.toLowerCase()}. Perfect for students and teachers! High-quality PDFs with answer keys included.`}
                          keywords={`${title.toLowerCase()}, worksheets, free, printable, pdf`}
                          canonicalUrl={`https://wizqo.com${canonical}`}
                        />
                        <PrintablesPage docId={routeSubKey} />
                      </>
                    );
                  }
                  // Default: 2nd grade worksheets
                  return <WorksheetsSecondGradePage />;

                case 'dashboard':
                  return (
                    <>
                      <SEOMetaTags
                        title="Your Learning Dashboard - Wizqo"
                        description="Track your learning progress, manage your plans, and access your personalized educational resources and worksheets."
                        canonicalUrl="https://wizqo.com/dashboard"
                        noIndex={true}
                      />
                      <Dashboard />
                    </>
                  );
                case 'about':
                  return (
                    <>
                      <AboutPage />
                    </>
                  );
                case 'contact':
                  return (
                    <>
                      <ContactPage />
                    </>
                  );
                case 'privacy':
                  return (
                    <>
                      <SEOMetaTags
                        title="Privacy Policy - Wizqo"
                        description="Learn how Wizqo protects your privacy and handles your data while providing free printable worksheets and personalized learning experiences for all users."
                        canonicalUrl="https://wizqo.com/privacy"
                        noIndex={true}
                      />
                      <PrivacyPage />
                    </>
                  );
                case 'terms':
                  return (
                    <>
                      <SEOMetaTags
                        title="Terms of Service - Wizqo"
                        description="Read Wizqo's terms of service and understand the rules and guidelines for using our educational platform, worksheet generator, and learning resources."
                        canonicalUrl="https://wizqo.com/terms"
                        noIndex={true}
                      />
                      <TermsPage />
                    </>
                  );
                case 'cookies':
                  return (
                    <>
                      <SEOMetaTags
                        title="Cookie Policy - How Wizqo Uses Cookies | Transparent Data Practice"
                        description="Understand how Wizqo uses cookies to enhance your learning experience. Comprehensive cookie policy covering types, purposes, and your control options."
                        canonicalUrl="https://wizqo.com/cookies"
                        noIndex={true}
                      />
                      <CookiesPage />
                    </>
                  );

                case 'shadow-matching-preview':
                  return <ShadowMatchingWorksheetPage />;

                case 'match-object-to-shadow':
                  return <ShadowMatchingWorksheetPage />;

                case 'match-the-feeling':
                  return <MatchFeelingWorksheetPage />;

                default:
                  // Handle individual worksheets at the root (/:slug)
                  if (routeKey) {
                    const worksheetSEO = getWorksheetSEOBySlug(routeKey);
                    if (worksheetSEO) {
                      // REDIRECT: Individual worksheets now live under /worksheets/
                      const target = addLocaleToPath(`/worksheets/${routeKey}`, currentLocale);
                      const search = window.location.search;
                      return <Redirect to={target + search} replace />;
                    }
                  }

                  // Check if this is a truly invalid route (not just empty/home)
                  // If routeKey is empty, it's the homepage - show LandingPage
                  if (!routeKey || routeKey === '') {
                    return (
                      <>
                        <SEOMetaTags
                          title="Free Printable Worksheets for Teachers & Kids | Wizqo"
                          description="Download free printable worksheets for math, reading, writing, and more. Generate unlimited worksheets with answer keys for grades K-5. No sign-up required!"
                          keywords="free printable worksheets, printable worksheets for teachers, free math worksheets, reading comprehension worksheets, handwriting worksheets, printable worksheets PDF, worksheets for kids, educational worksheets, free worksheets first grade, printable worksheets with answer keys, multiplication worksheets, 1st grade math worksheets, 2nd grade math worksheets, kindergarten math worksheets"
                          canonicalUrl="https://wizqo.com/"
                        />
                        <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                      </>
                    );
                  }

                  // For any other unmatched route, show 404
                  return <NotFoundPage />;
              }
            })()}
            <Toaster />
          </div>
        </ErrorBoundary>
      </TranslationProvider>
    </AuthProvider>
  );
}
