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
import { SEOMetaTags } from './components/SEOMetaTags';


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
    console.log('🔧 Navigating to:', path);
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  const [routeKey, routeQuery] = useMemo(() => {
    const path = route.replace(/^\/?/, '');
    const [pathname, queryString] = path.split('?');
    const seg = pathname.split('/')[0] || '';
    const params = new URLSearchParams(queryString || '');
    console.log('🔧 Route parsing:', { route, path, pathname, seg, queryString, params: Object.fromEntries(params) });
    return [seg, params] as const;
  }, [route]);

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
        console.log('🔧 Plan hydration: planId =', planId);
        
        const parseMaybeDouble = (s: string | null) => {
          if (!s) return null;
          try {
            const v = JSON.parse(s);
            if (typeof v === 'string') {
              try { return JSON.parse(v); } catch { return null; }
            }
            return v;
          } catch { return null; }
        };
        
        // First priority: Check if we have plan data from dashboard navigation
        const fromDashboard = parseMaybeDouble(sessionStorage.getItem('currentPlanData')) || 
                             parseMaybeDouble(sessionStorage.getItem('activePlanData'));
        if (fromDashboard && fromDashboard.days) {
          console.log('✅ Plan hydration: Using plan data from dashboard');
          setHydratedPlan(fromDashboard);
          return;
        }
        
        // Second priority: Check localStorage for this specific plan
        if (planId) {
          const fromLocalStorage = parseMaybeDouble(localStorage.getItem(`plan_${planId}`));
          if (fromLocalStorage && fromLocalStorage.days) {
            console.log('✅ Plan hydration: Using plan data from localStorage');
            setHydratedPlan(fromLocalStorage);
            try { 
              sessionStorage.setItem('currentPlanData', JSON.stringify(fromLocalStorage));
              sessionStorage.setItem('activePlanData', JSON.stringify(fromLocalStorage));
            } catch {}
            return;
          }
        }
        
        // Third priority: Check last viewed plan
        const fromLastViewed = parseMaybeDouble(localStorage.getItem('lastViewedPlanData'));
        if (fromLastViewed && fromLastViewed.days) {
          console.log('✅ Plan hydration: Using last viewed plan data');
          setHydratedPlan(fromLastViewed);
          try { 
            sessionStorage.setItem('currentPlanData', JSON.stringify(fromLastViewed));
            sessionStorage.setItem('activePlanData', JSON.stringify(fromLastViewed));
          } catch {}
          return;
        }
        
        // Fourth priority: Fetch from API if we have a plan ID
        if (planId) {
          console.log('🔍 Plan hydration: Fetching plan data from API for planId:', planId);
          try {
            const r = await fetch(`/api/hobby-plans/${planId}?_t=${Date.now()}`, { cache: 'no-cache' });
            if (r.ok) {
              const j = await r.json();
              const payload = j?.plan_data || j?.planData || j;
              if (payload && payload.days) {
                console.log('✅ Plan hydration: Using plan data from API');
                setHydratedPlan(payload);
                try {
                  sessionStorage.setItem('currentPlanData', JSON.stringify(payload));
                  sessionStorage.setItem('activePlanData', JSON.stringify(payload));
                  localStorage.setItem(`plan_${planId}`, JSON.stringify(payload));
                } catch {}
                return;
              }
            }
          } catch (error) {
            console.error('❌ Plan hydration: API fetch error:', error);
          }
          
          // Fifth priority: Try Supabase direct fallback
          try {
            const { data, error } = await supabase
              .from('hobby_plans')
              .select('id, plan_data')
              .eq('id', planId)
              .maybeSingle();
            if (!error && data && (data as any).plan_data?.days) {
              console.log('✅ Plan hydration: Using plan data from Supabase');
              const payload = (data as any).plan_data;
              setHydratedPlan(payload);
              try {
                sessionStorage.setItem('currentPlanData', JSON.stringify(payload));
                sessionStorage.setItem('activePlanData', JSON.stringify(payload));
                localStorage.setItem(`plan_${planId}`, JSON.stringify(payload));
              } catch {}
              return;
            }
          } catch (error) {
            console.error('❌ Plan hydration: Supabase error:', error);
          }
        }
        
        console.log('❌ Plan hydration: No plan data found from any source');
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
                    title="Wizqo - AI-Powered 7-Day Hobby Learning Plans | Learn Any Skill Fast"
                    description="Master any hobby in 7 days with personalized AI learning plans. Get daily video tutorials, practice guides, and progress tracking for cooking, guitar, yoga, and more. Start your learning journey free!"
                    canonicalUrl="https://wizqo.com/"
                  />
                  <LandingPage onNavigateToGenerate={() => navigateTo('/generate')} />
                </>
              );
            case 'generate':
              return (
                <>
                  <SEOMetaTags 
                    title="Generate Your 7-Day Hobby Plan - Wizqo"
                    description="Create a personalized 7-day learning plan for any hobby. Our AI will craft the perfect curriculum with daily videos, practice guides, and progress tracking."
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
                    title="Hobby Learning Blog - Tips, Guides & Inspiration - Wizqo"
                    description="Discover expert tips, comprehensive guides, and inspiring stories to help you master new hobbies. Learn from our community of hobby enthusiasts."
                    canonicalUrl="https://wizqo.com/blog"
                  />
                  <BlogPage />
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
                    title="Contact Wizqo - Get Help & Support"
                    description="Get in touch with the Wizqo team for support, feedback, or questions about our AI-powered hobby learning platform."
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
            default:
              return (
                <>
                  <SEOMetaTags 
                    title="Wizqo - AI-Powered 7-Day Hobby Learning Plans | Learn Any Skill Fast"
                    description="Master any hobby in 7 days with personalized AI learning plans. Get daily video tutorials, practice guides, and progress tracking for cooking, guitar, yoga, and more. Start your learning journey free!"
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