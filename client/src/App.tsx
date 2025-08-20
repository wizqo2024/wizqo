import React, { useEffect, useMemo, useState } from 'react';
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

type QuizAnswers = {
  experience: string;
  timeAvailable: string;
  goal: string;
};

export default function App() {
  const [planData, setPlanData] = useState<any | null>(null);

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
      throw new Error(j?.error === 'daily_limit_reached' ? 'Maximum daily plan limit reached (5). Try again tomorrow.' : 'Rate limited');
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
    return s ? JSON.parse(s) : null;
  })();

  const [route, setRoute] = useState<string>(() => window.location.hash || '#/');
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const routeKey = useMemo(() => {
    const hash = route.startsWith('#') ? route.slice(1) : route;
    const seg = hash.replace(/^\/?/, '').split('?')[0].split('/')[0];
    return seg || '';
  }, [route]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        {(() => {
          switch (routeKey) {
            case '': // home
              return (
                <LandingPage onNavigateToGenerate={() => { window.location.hash = '#/generate'; }} />
              );
            case 'generate':
              return (
                <SplitPlanInterface onGeneratePlan={handleGeneratePlan} onNavigateBack={() => { window.location.hash = '#/'; }} />
              );
            case 'plan':
              return (
                <>
                  <UnifiedNavigation currentPage="plan" />
                  <div className="max-w-6xl mx-auto p-4">
                    {currentPlan ? (
                      <PlanDisplay planData={currentPlan} user={null} setShowAuthModal={() => {}} />
                    ) : (
                      <div className="text-center text-slate-600">No plan loaded. Go to Generate to create one.</div>
                    )}
                  </div>
                </>
              );
            case 'blog':
              return <BlogPage />;
            case 'dashboard':
              return <Dashboard />;
            case 'about':
              return <AboutPage />;
            case 'contact':
              return <ContactPage />;
            case 'privacy':
              return <PrivacyPage />;
            case 'terms':
              return <TermsPage />;
            default:
              return (
                <LandingPage onNavigateToGenerate={() => { window.location.hash = '#/generate'; }} />
              );
          }
        })()}
        <Toaster />
      </div>
    </AuthProvider>
  );
}

