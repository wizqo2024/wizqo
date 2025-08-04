import React, { useState, useEffect } from 'react';
import { SplitChatInterface } from './components/SplitChatInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { SplitPlanInterface } from './components/SplitPlanInterface';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { AboutPage } from './pages/AboutPage';
import { AuthTestPage } from './pages/AuthTestPage';
import { BlogPage } from './pages/BlogPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { Toaster } from '@/components/ui/toaster';
import { AuthDebug } from './components/AuthDebug';
import { AuthProvider } from './context/AuthContext';

interface QuizAnswers {
  experience: string;
  timeAvailable: string;
  goal: string;
}

interface Day {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  howTo: string[];
  checklist: string[];
  tips: string[];
  mistakesToAvoid: string[];
  freeResources: { title: string; link: string }[];
  affiliateProducts: { title: string; link: string; price: string }[];
  youtubeVideoId?: string;
  videoTitle?: string;
  estimatedTime: string;
  skillLevel: string;
}

interface PlanData {
  hobby: string;
  title: string;
  overview: string;
  difficulty: string;
  totalDays: number;
  days: Day[];
}

type Route = 'landing' | 'generate' | 'plan' | 'about' | 'blog' | 'dashboard' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'auth-test';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [planData, setPlanData] = useState<PlanData | null>(null);

  // Hash-based routing
  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      
      console.log('🔧 Route change detected - pathname:', pathname, 'hash:', hash);
      
      // Always prioritize hash-based routing for SPA behavior
      let route = '';
      
      if (hash.startsWith('#/generate')) {
        route = 'generate';
      } else if (hash.startsWith('#/dashboard')) {
        route = 'dashboard';
      } else if (hash.startsWith('#/plan')) {
        route = 'plan';
      } else if (hash.startsWith('#/about')) {
        route = 'about';
      } else if (hash.startsWith('#/blog')) {
        route = 'blog';
      } else if (hash.startsWith('#/contact')) {
        route = 'contact';
      } else if (hash.startsWith('#/privacy')) {
        route = 'privacy';
      } else if (hash.startsWith('#/terms')) {
        route = 'terms';
      } else if (hash.startsWith('#/cookies')) {
        route = 'cookies';
      } else if (hash.startsWith('#/auth-test')) {
        route = 'auth-test';
      } else if (hash === '#/' || hash === '#' || hash === '') {
        route = 'landing';
      } else if (pathname === '/generate' || pathname.startsWith('/generate')) {
        // Fallback for direct /generate access - redirect to hash-based routing
        route = 'generate';
      } else {
        route = 'landing';
      }
      
      if (route === 'landing') {
        setCurrentRoute('landing');
      } else if (route === 'generate') {
        setCurrentRoute('generate');
        
        // Check if we're returning from dashboard with active plan data
        const activePlanData = sessionStorage.getItem('activePlanData');
        const fromGeneratedPlan = sessionStorage.getItem('fromGeneratedPlan');
        if (activePlanData && fromGeneratedPlan) {
          try {
            const planData = JSON.parse(activePlanData);
            console.log('🔄 Restoring active plan from session:', planData.hobby);
            setPlanData(planData);
            sessionStorage.removeItem('fromGeneratedPlan'); // Clear the flag
          } catch (e) {
            console.warn('Failed to parse active plan data');
          }
        }
      } else if (route === 'plan') {
        setCurrentRoute('plan');
        
        // Check if there's plan data in sessionStorage (from dashboard navigation)
        const sessionPlanData = sessionStorage.getItem('currentPlanData');
        if (sessionPlanData) {
          try {
            const planData = JSON.parse(sessionPlanData);
            console.log('📍 Loading plan from session:', planData.hobby || planData.title);
            setPlanData(planData);
            // Don't clear it immediately, keep it for navigation
            // sessionStorage.removeItem('currentPlanData');
          } catch (e) {
            console.warn('Failed to parse session plan data');
          }
        } else {
          // Fallback: Handle plan with ID - load data from localStorage
          const query = window.location.search || window.location.hash.split('?')[1] || '';
          if (query && query.includes('id=')) {
            const planId = new URLSearchParams(query).get('id');
            if (planId) {
              const savedPlanData = localStorage.getItem('lastViewedPlanData');
              if (savedPlanData) {
                try {
                  const planData = JSON.parse(savedPlanData);
                  console.log('📂 Loading plan from localStorage:', planData.hobby);
                  setPlanData(planData);
                } catch (e) {
                  console.warn('Failed to parse saved plan data');
                }
              }
            }
          }
        }
      } else if (route === 'about') {
        setCurrentRoute('about');
      } else if (route === 'blog') {
        setCurrentRoute('blog');
      } else if (route === 'dashboard') {
        setCurrentRoute('dashboard');
      } else if (route === 'contact') {
        setCurrentRoute('contact');
      } else if (route === 'privacy') {
        setCurrentRoute('privacy');
      } else if (route === 'terms') {
        setCurrentRoute('terms');
      } else if (route === 'cookies') {
        setCurrentRoute('cookies');
      } else if (route === 'auth-test') {
        setCurrentRoute('auth-test');
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  // Navigation helpers
  const navigateTo = (route: Route) => {
    console.log('🔧 Navigating to route:', route);
    let path = '';
    switch (route) {
      case 'landing':
        path = '#/';
        break;
      case 'generate':
        path = '#/generate';
        break;
      case 'plan':
        path = '#/plan';
        break;
      case 'about':
        path = '#/about';
        break;
      case 'blog':
        path = '#/blog';
        break;
      case 'dashboard':
        path = '#/dashboard';
        break;
      case 'contact':
        path = '#/contact';
        break;
      case 'privacy':
        path = '#/privacy';
        break;
      case 'terms':
        path = '#/terms';
        break;
      case 'cookies':
        path = '#/cookies';
        break;
      case 'auth-test':
        path = '#/auth-test';
        break;
    }
    console.log('🔧 Setting location to:', path);
    if (path.startsWith('#/')) {
      window.location.hash = path.slice(1);
    } else {
      window.location.href = path;
    }
    setCurrentRoute(route);
  };

  // Simple fallback plan generator
  const getFallbackPlan = (hobby: string, answers: QuizAnswers): PlanData => {
    return {
      hobby: hobby.charAt(0).toUpperCase() + hobby.slice(1),
      title: `Learn ${hobby} in 7 Days`,
      overview: `Master the art of ${hobby} in just 7 days! This AI-powered plan will take you from beginner to confident practitioner with hands-on exercises and expert guidance.`,
      difficulty: 'beginner',
      totalDays: 7,
      days: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${hobby} Fundamentals`,
        mainTask: `Learn essential ${hobby} techniques and practice hands-on exercises.`,
        explanation: `Day ${i + 1} focuses on building your foundation in ${hobby} with practical exercises.`,
        howTo: [
          `Start with basic ${hobby} concepts`,
          `Practice fundamental techniques`,
          `Complete hands-on exercises`,
          `Review and refine your skills`
        ],
        checklist: [
          `Understand today's core concepts`,
          `Complete all practice exercises`,
          `Review progress and notes`,
          `Prepare for tomorrow's lesson`
        ],
        tips: [
          `Take your time with each exercise`,
          `Don't be afraid to repeat difficult parts`,
          `Keep practicing regularly`
        ],
        mistakesToAvoid: [
          `Rushing through exercises`,
          `Skipping practice time`,
          `Not taking notes`
        ],
        freeResources: [{
          title: `${hobby} Day ${i + 1} Tutorial`,
          link: `https://youtube.com/watch?v=${hobby}-day-${i + 1}`
        }],
        affiliateProducts: [{
          title: `${hobby} Beginner Kit`,
          link: `https://amazon.com/dp/B${i + 1}234?tag=wizqo-20`,
          price: `$${19 + i * 5}.99`
        }],
        youtubeVideoId: 'dQw4w9WgXcQ',
        videoTitle: `${hobby} Day ${i + 1} Tutorial`,
        estimatedTime: '30-60 minutes',
        skillLevel: 'beginner'
      }))
    };
  };

  // Plan generation using backend API
  const generatePlanWithAI = async (hobby: string, answers: QuizAnswers): Promise<PlanData> => {
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hobby,
          experience: answers.experience,
          timeAvailable: answers.timeAvailable,
          goal: answers.goal
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const planData = await response.json();
      
      // Convert backend data to frontend format
      return {
        hobby: planData.hobby || hobby,
        title: `Learn ${planData.hobby || hobby} in 7 Days`,
        overview: planData.description || `Master ${planData.hobby || hobby} in 7 days with this personalized plan.`,
        difficulty: 'beginner',
        totalDays: 7,
        days: planData.days.map((day: any) => ({
          day: day.day,
          title: day.title,
          mainTask: day.mainTask,
          explanation: day.explanation,
          howTo: day.howTo || [],
          checklist: day.checklist || [],
          tips: day.tips || [],
          mistakesToAvoid: day.mistakesToAvoid || [],
          freeResources: day.freeResources || [],
          affiliateProducts: day.affiliateProducts || []
        }))
      };
    } catch (error) {
      console.error('Error generating plan:', error);
      // Return fallback plan if API fails
      return getFallbackPlan(hobby, answers);
    }
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage onNavigateToGenerate={() => navigateTo('generate')} />;
      case 'generate':
        return (
          <SplitPlanInterface
            onGeneratePlan={generatePlanWithAI}
            onNavigateBack={() => navigateTo('landing')}
          />
        );
      case 'plan':
        // Try multiple storage sources to find plan data
        let currentPlanData = null;
        
        // 1. Check state first (from previous generation)
        if (planData) {
          console.log('✅ Using plan data from state:', planData.hobby);
          currentPlanData = planData;
        }
        
        // 2. Check sessionStorage (from dashboard navigation)
        if (!currentPlanData) {
          const sessionData = sessionStorage.getItem('currentPlanData');
          if (sessionData) {
            try {
              currentPlanData = JSON.parse(sessionData);
              console.log('✅ Using plan data from session storage:', currentPlanData.hobby);
            } catch (e) {
              console.error('Failed to parse session plan data:', e);
            }
          }
        }
        
        // 3. Check localStorage as backup
        if (!currentPlanData) {
          const lastPlanData = localStorage.getItem('lastViewedPlanData');
          if (lastPlanData) {
            try {
              currentPlanData = JSON.parse(lastPlanData);
              console.log('✅ Using plan data from localStorage:', currentPlanData.hobby);
            } catch (e) {
              console.error('Failed to parse localStorage plan data:', e);
            }
          }
        }
        
        if (currentPlanData) {
          return (
            <SplitPlanInterface
              onGeneratePlan={generatePlanWithAI}
              onNavigateBack={() => navigateTo('dashboard')}
              initialPlanData={currentPlanData}
            />
          );
        }
        
        // Final fallback: No plan data found
        console.log('❌ No plan data found, showing generate interface');
        return (
          <SplitPlanInterface
            onGeneratePlan={generatePlanWithAI}
            onNavigateBack={() => navigateTo('landing')}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'cookies':
        return <CookiesPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'auth-test':
        return <AuthTestPage />;
      default:
        return <LandingPage onNavigateToGenerate={() => navigateTo('generate')} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        {renderCurrentRoute()}
        <Toaster />
  
      </div>
    </AuthProvider>
  );
}