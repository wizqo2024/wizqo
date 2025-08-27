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
        
        if (!planId) {
          console.log('❌ Plan hydration: No plan ID found');
          return;
        }
        
        // Fetch fresh plan data from the database
        console.log('🔍 Plan hydration: Fetching plan data from database for planId:', planId);
        
        try {
          // First try: Fetch from API
          console.log('🔍 Plan hydration: Trying API fetch...');
          const r = await fetch(`/api/hobby-plans/${planId}?_t=${Date.now()}`, { cache: 'no-cache' });
          console.log('🔍 Plan hydration: API response status:', r.status);
          
          if (r.ok) {
            const j = await r.json();
            console.log('🔍 Plan hydration: API response data:', j);
            console.log('🔍 Plan hydration: API response data keys:', Object.keys(j));
            console.log('🔍 Plan hydration: API response data type:', typeof j);
            console.log('🔍 Plan hydration: API response data plan_data keys:', j?.plan_data ? Object.keys(j.plan_data) : 'NO plan_data');
            console.log('🔍 Plan hydration: API response data planData keys:', j?.planData ? Object.keys(j.planData) : 'NO planData');
            
            const payload = j?.plan_data || j?.planData || j;
            console.log('🔍 Plan hydration: Extracted payload:', payload);
            console.log('🔍 Plan hydration: Payload keys:', payload ? Object.keys(payload) : 'NO payload');
            console.log('🔍 Plan hydration: Payload days:', payload?.days);
            console.log('🔍 Plan hydration: Payload days type:', typeof payload?.days);
            console.log('🔍 Plan hydration: Payload days length:', payload?.days?.length);
            
            // Handle nested plan_data structure
            let finalPayload = payload;
            if (payload?.plan_data?.days) {
              console.log('🔍 Plan hydration: Found nested plan_data with days');
              finalPayload = payload.plan_data;
            } else if (payload?.days) {
              console.log('🔍 Plan hydration: Found days directly in payload');
              finalPayload = payload;
            }
            
            console.log('🔍 Plan hydration: Final payload:', finalPayload);
            console.log('🔍 Plan hydration: Final payload days:', finalPayload?.days);
            
            if (finalPayload && finalPayload.days) {
              console.log('✅ Plan hydration: Using plan data from API');
              console.log('✅ Plan hydration: Days found:', finalPayload.days.length);
              console.log('✅ Plan hydration: First day:', finalPayload.days[0]);
              setHydratedPlan(finalPayload);
              return;
            } else {
              console.log('❌ Plan hydration: API payload missing days or invalid structure');
              console.log('❌ Plan hydration: Payload structure analysis:', {
                hasPayload: !!payload,
                payloadType: typeof payload,
                payloadKeys: payload ? Object.keys(payload) : [],
                hasDays: !!(payload?.days),
                daysType: typeof payload?.days,
                daysLength: payload?.days?.length,
                hasNestedPlanData: !!(payload?.plan_data),
                nestedPlanDataKeys: payload?.plan_data ? Object.keys(payload.plan_data) : [],
                nestedPlanDataDays: payload?.plan_data?.days
              });
            }
          } else {
            console.log('❌ Plan hydration: API request failed with status:', r.status);
            const errorText = await r.text();
            console.log('❌ Plan hydration: API error response:', errorText);
          }
        } catch (error) {
          console.error('❌ Plan hydration: API fetch error:', error);
        }
        
        // Fallback: Try Supabase direct
        try {
          console.log('🔍 Plan hydration: Trying Supabase direct fetch...');
          const { data, error } = await supabase
            .from('hobby_plans')
            .select('id, plan_data')
            .eq('id', planId)
            .maybeSingle();
          
          console.log('🔍 Plan hydration: Supabase response:', { data, error });
          
          if (!error && data && (data as any).plan_data?.days) {
            console.log('✅ Plan hydration: Using plan data from Supabase');
            const payload = (data as any).plan_data;
            console.log('✅ Plan hydration: Supabase payload days:', payload.days.length);
            setHydratedPlan(payload);
            return;
          } else {
            console.log('❌ Plan hydration: Supabase data missing or invalid:', { 
              hasData: !!data, 
              hasPlanData: !!(data as any)?.plan_data,
              hasDays: !!(data as any)?.plan_data?.days,
              error: error
            });
            console.log('🔍 Plan hydration: Supabase raw data:', data);
            console.log('🔍 Plan hydration: Supabase data keys:', data ? Object.keys(data) : 'NO data');
            console.log('🔍 Plan hydration: Supabase plan_data keys:', (data as any)?.plan_data ? Object.keys((data as any).plan_data) : 'NO plan_data');
            console.log('🔍 Plan hydration: Supabase plan_data days:', (data as any)?.plan_data?.days);
            
            // Handle nested plan_data structure for Supabase
            if ((data as any)?.plan_data?.plan_data?.days) {
              console.log('🔍 Plan hydration: Found nested plan_data with days in Supabase');
              const nestedPayload = (data as any).plan_data.plan_data;
              console.log('✅ Plan hydration: Using nested plan data from Supabase');
              console.log('✅ Plan hydration: Nested payload days:', nestedPayload.days.length);
              setHydratedPlan(nestedPayload);
              return;
            }
          }
        } catch (error) {
          console.error('❌ Plan hydration: Supabase error:', error);
        }
        
        console.log('❌ Plan hydration: No plan data found from database');
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
                    description="Learn what a hobby really means and find your perfect match with Wizqo’s AI-powered 7-day hobby plans. Start today for free!"
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
                    title="Contact Wizqo – Questions, Feedback, or Hobby Ideas Welcome"
                    description="Got a question or suggestion? Reach out to Wizqo's team — we typically respond within 24 hours. Let’s improve your hobby journey together"
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
                    title="What Hobby Means – Discover Your Ideal Hobby with Wizqo AI"
                    description="Learn what a hobby really means and find your perfect match with Wizqo’s AI-powered 7-day hobby plans. Start today for free!"
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