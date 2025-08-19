import React, { useEffect, useMemo, useState } from 'react';
import { UnifiedNavigation } from './components/UnifiedNavigation';
import { SplitPlanInterface } from './components/SplitPlanInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { AuthProvider } from './context/AuthContext';
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
    try {
      const resp = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hobby, ...answers })
      });
      if (resp.ok) {
        const data = await resp.json();
        sessionStorage.setItem('currentPlanData', JSON.stringify(data));
        return data;
      }
      // Attempt to read error for logging
      try { console.warn('generate-plan failed:', await resp.json()); } catch {}
      throw new Error('server_failed');
    } catch (err) {
      // Client-side fallback plan so the UI still works if the API is unavailable
      console.warn('Using client-side fallback plan due to API failure');
      const totalDays = 7;
      const days = Array.from({ length: totalDays }, (_, i) => {
        const day = i + 1;
        return {
          day,
          title: `${hobby} Day ${day}`,
          mainTask: `Core ${hobby} practice for day ${day}`,
          explanation: `Focus on essential ${hobby} skills on day ${day}.`,
          howTo: [
            'Warm up for 5–10 minutes',
            `Study one focused concept in ${hobby}`,
            'Practice with a small exercise',
            'Write 1–2 takeaways',
            'Plan tomorrow’s focus'
          ],
          checklist: [
            'Warm-up done',
            'Concept studied',
            'Exercise completed',
            'Notes written',
            'Tomorrow planned'
          ],
          tips: [
            'Short, consistent sessions beat marathon sessions',
            'Reflect briefly after practice',
            'Keep it fun to maintain momentum'
          ],
          mistakesToAvoid: [
            'Skipping deliberate practice',
            'Trying to learn too many things at once',
            'Comparing yourself to others'
          ],
          freeResources: [],
          affiliateProducts: [],
          youtubeVideoId: null,
          videoTitle: 'Video not available',
          estimatedTime: answers.timeAvailable,
          skillLevel: answers.experience
        };
      });
      const fallbackPlan = {
        hobby,
        title: `Learn ${hobby} in 7 Days`,
        overview: `A simple, practical ${totalDays}-day plan for a ${answers.experience} with ${answers.timeAvailable} per day to achieve: ${answers.goal}.`,
        difficulty: answers.experience,
        totalDays,
        days
      };
      sessionStorage.setItem('currentPlanData', JSON.stringify(fallbackPlan));
      return fallbackPlan;
    }
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

