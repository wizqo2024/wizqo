import React, { useState, useEffect } from 'react';
import { SplitChatInterface } from './components/SplitChatInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { SplitPlanInterface } from './components/SplitPlanInterface';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { AboutPage } from './pages/AboutPage';

import { BlogPage } from './pages/BlogPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { Toaster } from '@/components/ui/toaster';
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

type Route = 'landing' | 'generate' | 'plan' | 'about' | 'blog' | 'dashboard' | 'contact' | 'privacy' | 'terms' | 'cookies';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [planData, setPlanData] = useState<PlanData | null>(null);

  // SEO meta tag updates based on current route
  useEffect(() => {
    const updateMetaTags = () => {
      const seoData = {
        landing: {
          title: 'What Hobby Means - Discover Your Ideal Hobby with Wizqo AI',
          description: 'Learn what hobbies are and find your perfect hobby with AI-powered 7-day learning plans. Discover creative, physical, cognitive, and social hobbies personalized for you. Start free today!',
          keywords: 'what is a hobby, hobby definition, hobby meaning, creative hobbies, physical hobbies, cognitive hobbies, social hobbies, hobby examples, find your hobby, AI hobby planner, 7-day hobby plan'
        },
        generate: {
          title: 'Create Your 7-Day Hobby Plan - AI-Powered Personalized Learning | Wizqo',
          description: 'Generate a personalized 7-day hobby learning plan with AI. Answer 3 simple questions and get a custom plan tailored to your experience, time, and goals. Start learning today!',
          keywords: 'AI hobby planner, personalized learning plan, 7-day hobby course, custom hobby training, hobby generator, learn new hobby fast'
        },
        blog: {
          title: 'Hobby Learning Blog - Tips, Guides & Success Stories | Wizqo',
          description: 'Discover expert tips, step-by-step guides, and inspiring success stories to help you master any hobby. From watercolor painting to micro journaling - learn effectively with Wizqo.',
          keywords: 'hobby tips, learning guides, hobby success stories, watercolor painting, micro journaling, hobby how-to, learning techniques'
        },
        dashboard: {
          title: 'Your Learning Dashboard - Track Progress & Plans | Wizqo',
          description: 'Track your hobby learning progress, view completed plans, and continue your 7-day learning journey. Access your personalized dashboard and see your achievements.',
          keywords: 'learning dashboard, hobby progress tracking, personal learning stats, hobby achievements, learning analytics'
        },
        about: {
          title: 'About Wizqo - AI-Powered Hobby Learning Platform',
          description: 'Learn about Wizqo mission to make hobby learning accessible through AI-powered personalized plans. Discover how we help millions find and master their perfect hobbies.',
          keywords: 'about wizqo, AI learning platform, hobby education, personalized learning technology, hobby discovery platform'
        },
        plan: {
          title: `${planData?.title || '7-Day Hobby Learning Plan'} | Wizqo`,
          description: `Master ${planData?.hobby || 'your chosen hobby'} with our AI-generated 7-day learning plan. Follow daily tasks, tips, and resources to build skills progressively.`,
          keywords: `${planData?.hobby || 'hobby'} learning plan, 7-day ${planData?.hobby || 'hobby'} course, learn ${planData?.hobby || 'hobby'} fast, ${planData?.hobby || 'hobby'} for beginners`
        },
        contact: {
          title: 'Contact Wizqo - Get Support & Feedback | AI Hobby Learning',
          description: 'Get in touch with Wizqo team for support, feedback, or partnership inquiries. We help you with your hobby learning journey and platform questions.',
          keywords: 'contact wizqo, customer support, hobby learning help, AI platform support, feedback, partnership inquiries'
        },
        privacy: {
          title: 'Privacy Policy - How Wizqo Protects Your Data | Secure AI Learning',
          description: 'Learn how Wizqo protects your personal data and privacy. Comprehensive privacy policy covering data collection, usage, and security for our AI hobby learning platform.',
          keywords: 'wizqo privacy policy, data protection, user privacy, AI platform security, personal data safety, GDPR compliance'
        },
        terms: {
          title: 'Terms of Service - Wizqo AI Hobby Learning Platform Legal Terms',
          description: 'Read Wizqo Terms of Service covering platform usage, user responsibilities, and legal agreements for our AI-powered hobby learning platform.',
          keywords: 'wizqo terms of service, platform terms, user agreement, legal terms, AI learning platform rules, service conditions'
        },
        cookies: {
          title: 'Cookie Policy - How Wizqo Uses Cookies | Transparent Data Practice',
          description: 'Understand how Wizqo uses cookies to enhance your learning experience. Comprehensive cookie policy covering types, purposes, and your control options.',
          keywords: 'wizqo cookie policy, website cookies, data tracking, user experience enhancement, cookie consent, digital privacy'
        }
      };

      const currentSEO = seoData[currentRoute as keyof typeof seoData] || seoData.landing;
      
      document.title = currentSEO.title;
      
      // Update meta description
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', currentSEO.description);
      }
      
      // Update meta keywords
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', currentSEO.keywords);
      }
      
      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', currentSEO.title);
      }
      
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', currentSEO.description);
      }
      
      // Update Twitter tags
      let twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', currentSEO.title);
      }
      
      let twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', currentSEO.description);
      }
    };

    updateMetaTags();
  }, [currentRoute, planData]);

  // Hash-based routing
  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      
      
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
      } else if (route === 'plan') {
        // Check for stored plan data when navigating to plan route
        const sources = [
          'currentPlanData',
          'activePlanData', 
          'tempPlanForNavigation',
          'lastViewedPlanData'
        ];
        
        for (const source of sources) {
          try {
            const storedData = sessionStorage.getItem(source) || localStorage.getItem(source);
            if (storedData) {
              const parsedPlan = JSON.parse(storedData);
              if (parsedPlan && parsedPlan.days && parsedPlan.days.length > 0) {
                        setPlanData(parsedPlan);
                
                // Clear temporary navigation data
                if (source === 'tempPlanForNavigation') {
                  localStorage.removeItem('tempPlanForNavigation');
                }
                break;
              }
            }
          } catch (e) {
          }
        }
        setCurrentRoute('plan');
      } else if (route === 'generate') {
        setCurrentRoute('generate');
        
        // Check if we're returning from dashboard with active plan data
        const activePlanData = sessionStorage.getItem('activePlanData');
        const fromGeneratedPlan = sessionStorage.getItem('fromGeneratedPlan');
        if (activePlanData && fromGeneratedPlan) {
          try {
            const planData = JSON.parse(activePlanData);
            setPlanData(planData);
            sessionStorage.removeItem('fromGeneratedPlan'); // Clear the flag
          } catch (e) {
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

      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  // Navigation helpers
  const navigateTo = (route: Route) => {
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

    }
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
          title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Essential Kit - Day ${i + 1}`,
          link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+kit&tag=wizqohobby-20`,
          price: `$${19 + i * 5}.99`
        }],
        youtubeVideoId: 'rtR63-ecUNo', // FIXED: Replace broken video with working cooking tutorial
        videoTitle: `${hobby} Day ${i + 1} Tutorial`,
        estimatedTime: '30-60 minutes',
        skillLevel: 'beginner'
      }))
    };
  };

  // Plan generation using backend API with duplicate detection
  const generatePlanWithAI = async (hobby: string, answers: QuizAnswers, userId?: string, force?: boolean): Promise<PlanData> => {
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hobby,
          userId, // Pass userId for server-side duplicate detection
          force, // Pass force flag to bypass duplicate detection
          experience: answers.experience,
          timeAvailable: answers.timeAvailable,
          goal: answers.goal
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          // Handle duplicate plan response
          const errorData = await response.json();
          if (errorData.error && errorData.error.includes('duplicate')) {
            // Create a friendly error response that includes the existing plan if available
            throw new Error(`DUPLICATE_PLAN:${JSON.stringify(errorData)}`);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const planData = await response.json();
      
      
      // Convert backend data to frontend format - PRESERVE ALL VIDEO FIELDS
      return {
        hobby: planData.hobby || hobby,
        title: planData.title || `Learn ${planData.hobby || hobby} in 7 Days`,
        overview: planData.overview || planData.description || `Master ${planData.hobby || hobby} in 7 days with this personalized plan.`,
        difficulty: planData.difficulty || 'beginner',
        totalDays: planData.totalDays || 7,
        days: planData.days.map((day: any) => ({
          day: day.day,
          title: day.title,
          mainTask: day.mainTask,
          explanation: day.explanation,
          howTo: day.howTo || [],
          checklist: day.checklist || [],
          tips: day.tips || [],
          mistakesToAvoid: day.mistakesToAvoid || day.commonMistakes || [],
          freeResources: day.freeResources || [],
          affiliateProducts: day.affiliateProducts || [],
          // *** CRITICAL FIX: PRESERVE ALL VIDEO FIELDS FROM BACKEND ***
          youtubeVideoId: day.youtubeVideoId || day.videoId,
          videoId: day.videoId || day.youtubeVideoId,
          videoTitle: day.videoTitle,
          estimatedTime: day.estimatedTime,
          skillLevel: day.skillLevel
        }))
      };
    } catch (error) {
      console.error('Error generating plan:', error);
      
      // Handle duplicate plan errors specially
      if (error instanceof Error && error.message.startsWith('DUPLICATE_PLAN:')) {
        const errorData = JSON.parse(error.message.replace('DUPLICATE_PLAN:', ''));
        // Re-throw with structured data for UI handling
        const duplicateError = new Error('DUPLICATE_PLAN') as any;
        duplicateError.duplicateData = errorData;
        throw duplicateError;
      }
      
      // Return fallback plan if API fails for other reasons
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
          currentPlanData = planData;
        }
        
        // 2. Check sessionStorage (from dashboard navigation)
        if (!currentPlanData) {
          const sessionData = sessionStorage.getItem('currentPlanData');
          if (sessionData) {
            try {
              currentPlanData = JSON.parse(sessionData);
            } catch (e) {
            }
          }
        }
        
        // 3. Check localStorage as backup
        if (!currentPlanData) {
          const lastPlanData = localStorage.getItem('lastViewedPlanData');
          if (lastPlanData) {
            try {
              currentPlanData = JSON.parse(lastPlanData);
            } catch (e) {
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