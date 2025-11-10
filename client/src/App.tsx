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
  const [route, setRoute] = useState<string>(() => window.location.pathname + window.location.search || '/');
  
  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname + window.location.search || '/');
    const onLocationChange = () => setRoute(window.location.pathname + window.location.search || '/');
    
    window.addEventListener('popstate', onPopState);
    window.addEventListener('locationchange', onLocationChange);
    
    // Also listen for clicks on links that might change the URL
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        setTimeout(() => {
          setRoute(window.location.pathname + window.location.search || '/');
        }, 100);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('locationchange', onLocationChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // NEW: Navigation function that updates URL properly
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  const [routeKey, routeQuery] = useMemo(() => {
    const path = route.replace(/^\/?/, '');
    const [pathname, queryString] = path.split('?');
    const seg = pathname.split('/')[0] || '';
    const params = new URLSearchParams(queryString || '');
    return [seg, params] as const;
  }, [route]);

  const routeSubKey = useMemo(() => {
    const path = route.replace(/^\/?/, '');
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

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        {(() => {
          switch (routeKey) {
            case '': // home
              return (
                <>
                  <SEOMetaTags 
                    title="What Hobby Means – Discover Your Ideal Hobby with Wizqo AI"
                    description="Learn what a hobby really means and find your perfect match with Wizqo's AI-powered 7-day hobby plans. Start today for free!"
                    canonicalUrl="https://wizqo.com/"
                  />
                  <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                </>
              );
            case 'generate':
              return (
                <>
                  <SEOMetaTags 
                    title="Learn a New Hobby in 7 Days | AI Hobby Plan Generator"
                    description="Ready to learn a new hobby fast? Wizqo's AI hobby plan generator builds a 7-day roadmap with lessons, videos, and daily practice prompts for beginners."
                    canonicalUrl="https://wizqo.com/generate"
                  />
                  <SplitPlanInterface onGeneratePlan={handleGeneratePlan} onNavigateBack={() => navigateTo('/')} />
                </>
              );
            case 'plan':
              return (
                <>
                  <SEOMetaTags 
                    title="Your Hobby Learning Plan - Wizqo"
                    description="Your personalized 7-day hobby learning plan with daily videos, practice guides, and progress tracking."
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
                    title="Hobby Learning Blog ? Tips, Guides & Free Worksheet Ideas | Wizqo"
                    description="Learn faster with practical hobby tips and free worksheet ideas for kids. Actionable guides, gentle methods, and resources you can print today."
                    canonicalUrl="https://wizqo.com/blog"
                  />
                  <BlogPage initialSlug={window.location.pathname.replace(/^\/?/, '').split('/')[1]} />
                </>
              );
            case 'kids':
              return (
                <>
                  <SEOMetaTags 
                    title="Kids Hub ? Play Games & Download Free Printables"
                    description="Play kid?safe mini?games and download free printables: puzzles, handwriting, and quick math warm?ups."
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
                    description="Download free printables for kids: word searches, Sudoku, coloring, and spot?the?difference. Print at home in seconds."
                    canonicalUrl="https://wizqo.com/print"
                    noIndex={true}
                  />
                  <PrintablesPage />
                </>
              );
              case 'interactive-worksheets-generator':
                return (
                  <InteractiveWorksheetsPage />
                );
            case 'printables':
              if (routeSubKey === 'name-tracing-generator') {
                return <NameTracingGeneratorPage />;
              }
              if (routeSubKey === 'certificate-maker') {
                return (
                  <>
                    <SEOMetaTags 
                      title="How to Make a Certificate Online ? Free Certificate Maker"
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
                    description="Download free printable fun learning activities for kids ? word searches, Sudoku, coloring pages, and spot-the-difference games. Perfect for home, school, or travel!"
                    canonicalUrl="https://wizqo.com/printables"
                  />
                  <PrintablesLandingPage />
                </>
              );
            case 'worksheets':
              if (routeSubKey === '1st-grade-math-worksheets') {
                return (
                  <>
                    <SEOMetaTags 
                      title="1st Grade Math Worksheets ? Free Printable PDF"
                      description="Free 1st grade math worksheets?number sense, addition/subtraction within 10, ten?frames, skip counting, and shapes. Print or save as PDF."
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
                      title="Free Handwriting Practice Sheets for Kids | Printable Tracing Worksheets"
                      description="Download free printable handwriting practice sheets for kids. Trace letters A?Z, simple words, and sentences in both print and cursive. Fun and easy handwriting worksheets for young learners!"
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
                      description="Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1?3."
                      canonicalUrl="https://wizqo.com/worksheets/reading-comprehension"
                    />
                    <ReadingComprehensionPage />
                  </>
                );
              }
              return (
                <>
                  <SEOMetaTags 
                    title="2nd Grade Math Worksheets ? Free Printable PDF"
                    description="Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF."
                    canonicalUrl="https://wizqo.com/worksheets/2nd-grade-math-worksheets"
                  />
                  <WorksheetsSecondGradePage />
                </>
              );
            case 'worksheets-1':
              return (
                <>
                  <SEOMetaTags 
                    title="1st Grade Math Worksheets ? Free Printable PDF"
                    description="Free 1st grade math worksheets?number sense, addition/subtraction within 10, ten?frames, skip counting, and shapes. Print or save as PDF."
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
                    description="Track your hobby learning progress, manage your plans, and access your personalized learning resources."
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
                    title="About Wizqo - AI-Powered Hobby Learning Platform"
                    description="Learn about Wizqo's mission to make hobby learning accessible to everyone through AI-powered personalized plans and expert-curated content."
                    canonicalUrl="https://wizqo.com/about"
                  />
                  <AboutPage />
                </>
              );
            case 'contact':
              return (
                <>
                  <SEOMetaTags 
                    title="Contact Wizqo ? Questions, Feedback, or Hobby Ideas Welcome"
                    description="Got a question or suggestion? Reach out to Wizqo's team ? we typically respond within 24 hours. Let?s improve your hobby journey together"
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
                    description="Learn how Wizqo protects your privacy and handles your data while providing personalized hobby learning experiences."
                    canonicalUrl="https://wizqo.com/privacy"
                  />
                  <PrivacyPage />
                </>
              );
            case 'terms':
              return (
                <>
                  <SEOMetaTags 
                    title="Terms of Service - Wizqo"
                    description="Read Wizqo's terms of service and understand the rules and guidelines for using our hobby learning platform."
                    canonicalUrl="https://wizqo.com/terms"
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
                  />
                  <CookiesPage />
                </>
              );
            case 'reset-password':
              return (
                <>
                  <SEOMetaTags 
                    title="Reset Your Password - Wizqo"
                    description="Reset your Wizqo account password securely and continue your hobby learning journey."
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
                    title="What Hobby Means ? Discover Your Ideal Hobby with Wizqo AI"
                    description="Learn what a hobby really means and find your perfect match with Wizqo?s AI-powered 7-day hobby plans. Start today for free!"
                    canonicalUrl="https://wizqo.com/"
                  />
                  <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                </>
              );
          }
        })()}
        <Toaster />
      </div>
    </AuthProvider>
  );
}