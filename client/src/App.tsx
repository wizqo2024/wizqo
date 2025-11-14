import React, { useEffect, useMemo, useState } from 'react';
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
import { PrintablesLandingPage } from './pages/PrintablesLandingPage';
import WorksheetsSecondGradePage from './pages/WorksheetsSecondGradePage';
import ReadingComprehensionPage from './pages/ReadingComprehensionPage';
import WorksheetsFirstGradePage from './pages/WorksheetsFirstGradePage';
import HandwritingMakerPage from './pages/HandwritingMakerPage';
import NameTracingGeneratorPage from './pages/NameTracingGeneratorPage';
import InteractiveWorksheetsPage from './pages/InteractiveWorksheetsPage';
import { SEOMetaTags } from './components/SEOMetaTags';
import CertificateMakerPage from './pages/CertificateMakerPage';
import KidsPage from './pages/KidsPage';
import MultiplicationWorksheetsPage from './pages/MultiplicationWorksheetsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initAnalytics, trackPageView } from './utils/analytics';
// (duplicate import removed)


type QuizAnswers = {
  experience: string;
  timeAvailable: string;
  goal: string;
};

export default function App() {
  const [planData, setPlanData] = useState<any | null>(null);
  const [hydratedPlan, setHydratedPlan] = useState<any | null>(null);
  const [hydrating, setHydrating] = useState(false);

  const handleGeneratePlan = async (hobby: string, answers: QuizAnswers) => {
    // Try to include user_id for per-day limit
    let userId: string | undefined;
    try {
      // Accessing context inside same component via hook wrapper
      // Fallback to session user if context not available here
      const s = sessionStorage.getItem('auth_user');
      if (s) userId = JSON.parse(s)?.id;
    } catch {}

    const resp = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby, ...answers, user_id: userId })
    });
    if (resp.status === 429) {
      const j = await resp.json().catch(() => ({}));
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

  // NEW: Use proper URL routing instead of hash routing
  const [route, setRoute] = useState<string>(() => {
    const path = window.location.pathname + window.location.search;
    return path || '/';
  });
  const [isNavigating, setIsNavigating] = useState(false);
  
  // NEW: Navigation function that updates URL properly
  const navigateTo = React.useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  }, []);
  
  useEffect(() => {
    const onPopState = () => {
      setIsNavigating(true);
      setRoute(window.location.pathname + window.location.search || '/');
      // Small delay to ensure smooth transition
      setTimeout(() => setIsNavigating(false), 50);
    };
    const onLocationChange = () => {
      setIsNavigating(true);
      setRoute(window.location.pathname + window.location.search || '/');
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
          console.warn('Navigation intercept error:', err);
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
    const seg = pathname.split('/')[0] || '';
    const params = new URLSearchParams(queryString || '');
    return [seg, params] as const;
  }, [route]);

  const routeSubKey = useMemo(() => {
    const currentRoute = route || window.location.pathname + window.location.search;
    const path = currentRoute.replace(/^\/?/, '');
    const [pathname] = path.split('?');
    const segs = pathname.split('/');
    return segs[1] || '';
  }, [route]);

  // Redirect bare /worksheets to the preferred hub URL to avoid duplicate indexing
  useEffect(() => {
    try {
      if (routeKey === 'worksheets' && !routeSubKey) {
        const target = '/worksheets/2nd-grade-math-worksheets';
        if (window.location.pathname !== target) {
          window.history.replaceState({}, '', target);
          setRoute(target);
        }
      }
    } catch {}
  }, [routeKey, routeSubKey]);

  // Persist plan_id from URL into session for downstream hydration
  useEffect(() => {
    if (routeKey === 'plan' && routeQuery) {
      const planId = routeQuery.get('plan_id');
      if (planId) {
        try { sessionStorage.setItem('activePlanId', planId); } catch {}
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

  // Track page views on route change (doesn't affect SEO)
  useEffect(() => {
    trackPageView(route);
  }, [route]);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className={`min-h-screen bg-slate-50 relative transition-opacity duration-200 ${isNavigating ? 'opacity-95' : 'opacity-100'}`}>
          {/* Loading overlay during navigation */}
          {isNavigating && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] pointer-events-none transition-opacity duration-200" />
          )}
          {(() => {
          switch (routeKey) {
            case '': // home
              return (
                <>
                  <SEOMetaTags 
                    title="Free PDF Math and Multiplication Worksheets for Kindergarten to 5th Grade | Wizqo"
                    description="Free PDF math and multiplication worksheets for Kindergarten to 5th grade. Download kindergarten math worksheets instantly – boost confidence!"
                    keywords="multiplication worksheets, 2nd grade math worksheets, 1st grade math worksheets, 3rd grade math worksheets, kindergarten math worksheets, 4th grade math worksheets, 5th grade math worksheets, free multiplication worksheets for 2nd grade, printable subtraction worksheets for kids, free math worksheets PDF, printable math worksheets with answer keys, grade 1 math worksheets, grade 2 math worksheets, grade 3 math worksheets, grade 4 math worksheets, grade 5 math worksheets, kindergarten printable worksheets free, math practice worksheets, addition worksheets, division worksheets"
                    canonicalUrl="https://wizqo.com/"
                  />
                  <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                </>
              );
            case 'generate':
              return (
                <>
                  <SEOMetaTags 
                    title="My Learning Plan Generator - Free AI-Powered 7-Day Plans | Wizqo"
                    description="Create my learning plan instantly with AI! Generate personalized 7-day learning plans with daily lessons, videos, and practice prompts. Free tool for teachers, students, and hobby learners."
                    keywords="my learning plan, learning plan generator, create learning plan, personalized learning plan, 7-day learning plan, AI learning plan, free learning plan generator"
                    canonicalUrl="https://wizqo.com/generate"
                  />
                  <SplitPlanInterface onGeneratePlan={handleGeneratePlan} onNavigateBack={() => navigateTo('/')} />
                </>
              );
            case 'plan':
              return (
                <>
                  <SEOMetaTags 
                    title="Your Learning Plan - Wizqo"
                    description="Your personalized 7-day learning plan with daily videos, practice guides, and progress tracking."
                    canonicalUrl="https://wizqo.com/plan"
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
                    description="Explore Wizqo's free educational blog — full of printable worksheet ideas, teaching hacks, learning tips, student hobbies, and classroom inspiration for teachers and parents."
                    keywords="free printable worksheets, learning blog, educational tips, teaching ideas, classroom resources, student hobbies, homeschool worksheets"
                    canonicalUrl="https://wizqo.com/blog"
                  />
                  <BlogPage initialSlug={window.location.pathname.replace(/^\/?/, '').split('/')[1]} />
                </>
              );
            case 'kids':
              return (
                <>
                  <SEOMetaTags 
                    title="Kids Hub - Play Games & Download Free Printables"
                    description="Play kid-safe mini-games and download free printables: puzzles, handwriting, and quick math warm-ups."
                    canonicalUrl="https://wizqo.com/kids"
                  />
                  <KidsPage />
                </>
              );
            case 'print':
              return (
                <>
                  <SEOMetaTags 
                    title="Printable Fun Learning Activities for Kids | Free Worksheets & Games"
                    description="Download free printables for kids: word searches, Sudoku, coloring, and spot-the-difference. Print at home in seconds."
                    canonicalUrl="https://wizqo.com/print"
                    noIndex={true}
                  />
                  <PrintablesPage />
                </>
              );
              case 'interactive-worksheets-generator':
                return (
                  <>
                    <SEOMetaTags 
                      title="Free Interactive Worksheets Generator | Create Printable PDF Worksheets Online | Wizqo"
                      description="Generate free interactive worksheets for math, reading, science, and SEL. Create printable PDF worksheets with answer keys for all grades (K-5). Daily refresh with new problems. No sign-up required!"
                      keywords="interactive worksheets generator, free worksheet generator, printable worksheets generator, create worksheets online, math worksheet generator, reading worksheet generator, free worksheet maker, interactive math worksheets, printable PDF worksheets, worksheet generator with answer keys, grade-specific worksheets, K-5 worksheets"
                      canonicalUrl="https://wizqo.com/interactive-worksheets-generator"
                    />
                    <InteractiveWorksheetsPage />
                  </>
                );
            case 'printables':
              if (routeSubKey === 'name-tracing-generator') {
                return (
                  <>
                    <SEOMetaTags 
                      title="Free Name Tracing Generator - Create Personalized Handwriting Sheets"
                      description="Create free personalized name tracing worksheets for kids! Customize font styles, sizes, and patterns. Perfect for teaching handwriting and name recognition. Print instantly!"
                      canonicalUrl="https://wizqo.com/printables/name-tracing-generator"
                    />
                    <NameTracingGeneratorPage />
                  </>
                );
              }
              if (routeSubKey === 'certificate-maker') {
                return (
                  <>
                    <SEOMetaTags 
                      title="How to Make a Certificate Online - Free Certificate Maker"
                      description="Create your own certificate online for free! Learn how to make a certificate with editable names, cute themes, and instant download options."
                      canonicalUrl="https://wizqo.com/printables/certificate-maker"
                    />
                    <CertificateMakerPage />
                  </>
                );
              }
              return (
                <>
                  <SEOMetaTags 
                    title="Printable Fun Learning Activities for Kids | Free Worksheets & Games"
                    description="Download free printable fun learning activities for kids — word searches, Sudoku, coloring pages, and spot-the-difference games. Perfect for home, school, or travel!"
                    canonicalUrl="https://wizqo.com/printables"
                  />
                  <PrintablesLandingPage />
                </>
              );
            case 'worksheets':
              if (routeSubKey === 'multiplication-worksheets') {
                return (
                  <>
                    <SEOMetaTags 
                      title="Free Multiplication Worksheets - Printable PDFs with Answer Keys | Wizqo"
                      description="Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, and beyond! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency. No sign-up required!"
                      keywords="multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"
                      canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
                    />
                    <MultiplicationWorksheetsPage />
                  </>
                );
              }
              if (routeSubKey === '1st-grade-math-worksheets') {
                return (
                  <>
                    <SEOMetaTags 
                      title="1st Grade Math Worksheets – Free Printable PDF"
                      description="Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF."
                      keywords="1st grade math worksheets, first grade math worksheets, free 1st grade math worksheets PDF, printable math worksheets grade 1, addition worksheets first grade, subtraction worksheets grade 1, number sense worksheets, ten frames worksheets, skip counting worksheets"
                      canonicalUrl="https://wizqo.com/worksheets/1st-grade-math-worksheets"
                    />
                    <WorksheetsFirstGradePage />
                  </>
                );
              }
              if (routeSubKey === 'handwriting-worksheet-maker') {
                return (
                  <>
                    <SEOMetaTags 
                      title="Free Handwriting Practice Sheets | Printable Tracing Worksheets"
                      description="Download free printable handwriting practice sheets for kids. Trace letters A–Z, words, and sentences in print and cursive. Perfect for teaching handwriting!"
                      keywords="handwriting worksheets, handwriting practice sheets, printable handwriting worksheets, tracing worksheets, cursive handwriting worksheets, print handwriting worksheets, handwriting practice for kids, free handwriting worksheets PDF"
                      canonicalUrl="https://wizqo.com/worksheets/handwriting-worksheet-maker"
                    />
                    <HandwritingMakerPage />
                  </>
                );
              }
              if (routeSubKey === 'reading-comprehension') {
                return (
                  <>
                    <SEOMetaTags 
                      title="Free Printable Reading Comprehension Worksheets for Kids (PDF)"
                      description="Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3."
                      keywords="reading comprehension worksheets, free reading comprehension worksheets PDF, reading comprehension for kids, reading passages with questions, reading worksheets grade 1, reading worksheets grade 2, reading worksheets grade 3, printable reading comprehension"
                      canonicalUrl="https://wizqo.com/worksheets/reading-comprehension"
                    />
                    <ReadingComprehensionPage />
                  </>
                );
              }
              return (
                <>
                  <SEOMetaTags 
                    title="2nd Grade Math Worksheets – Free Printable PDF"
                    description="Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF."
                    keywords="2nd grade math worksheets, second grade math worksheets, free 2nd grade math worksheets PDF, printable math worksheets grade 2, addition worksheets second grade, subtraction worksheets grade 2, place value worksheets, counting worksheets grade 2"
                    canonicalUrl="https://wizqo.com/worksheets/2nd-grade-math-worksheets"
                  />
                  <WorksheetsSecondGradePage />
                </>
              );
            case 'worksheets-1':
              return (
                <>
                  <SEOMetaTags 
                    title="1st Grade Math Worksheets – Free Printable PDF"
                    description="Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF."
                    canonicalUrl="https://wizqo.com/worksheets/1st-grade-math-worksheets"
                  />
                  <WorksheetsFirstGradePage />
                </>
              );
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
                  <SEOMetaTags 
                    title="About Wizqo - Free Printable Worksheets for Teachers & Parents"
                    description="Learn about Wizqo's mission to provide free printable worksheets for teachers, parents, and homeschoolers. High-quality worksheets for math, reading, writing, and more with answer keys included."
                    keywords="about wizqo, free worksheets, printable worksheets, educational resources, teachers worksheets, homeschool worksheets, free math worksheets"
                    canonicalUrl="https://wizqo.com/about"
                  />
                  <AboutPage />
                </>
              );
            case 'contact':
              return (
                <>
                  <SEOMetaTags 
                    title="Contact Wizqo - Questions & Feedback Welcome"
                    description="Got a question or suggestion about our worksheets or learning tools? Reach out to Wizqo's team - we typically respond within 24 hours."
                    canonicalUrl="https://wizqo.com/contact"
                  />
                  <ContactPage />
                </>
              );
            case 'privacy':
              return (
                <>
                  <SEOMetaTags 
                    title="Privacy Policy - Wizqo"
                    description="Learn how Wizqo protects your privacy and handles your data while providing free printable worksheets and personalized learning experiences."
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
                    description="Read Wizqo's terms of service and understand the rules and guidelines for using our educational platform and worksheet generator."
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
            case 'reset-password':
              return (
                <>
                  <SEOMetaTags 
                    title="Reset Your Password - Wizqo"
                    description="Reset your Wizqo account password securely and continue accessing free printable worksheets and learning resources."
                    canonicalUrl="https://wizqo.com/reset-password"
                    noIndex={true}
                  />
                  <ResetPasswordPage />
                </>
              );
            default:
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
          })()}
          <Toaster />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}