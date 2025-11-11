import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { WizqoLogo } from './WizqoLogo';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share,
 BookOpen, Clock, Send, Play } from 'lucide-react';

import { YouTubeEmbed } from './YouTubeEmbed';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { apiService } from '@/lib/api-service';
import { supabase } from '@/lib/supabase';
import Loader from './Loader';
import { Confetti } from './Confetti';

// Import types from centralized location
import type { QuizAnswers, ChatMessage, Day, PlanData, SplitPlanInterfaceProps } from '@/types/plan';

// Import utility functions from centralized locations
import { fixPlanDataFields } from '@/utils/planDataFix';

// Import custom hooks
import { usePlanChat } from '@/hooks/usePlanChat';

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
  const [isPlanRoute, setIsPlanRoute] = useState(false);
  useEffect(() => {
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      setIsPlanRoute(!!hash && hash.includes('#/plan'));
    } catch {}
  }, []);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  
  useEffect(() => { if (user && showAuthModal) setShowAuthModal(false); }, [user]);
  
  // Use chat hook for all chat-related functionality
  const chat = usePlanChat({
    onGeneratePlan,
    initialPlanData,
    planData,
    onPlanGenerated: (plan) => setPlanData(plan),
    onPlanIdSet: (planId) => setCurrentPlanId(planId),
    onShowAuthModal: (show) => setShowAuthModal(show),
    planProgressTimerRef,
  });
  
  // Extract chat state and handlers from hook
  const {
    messages,
    currentInput,
    setCurrentInput,
    selectedHobby,
    quizAnswers,
    currentStep,
    isTyping,
    isGenerating,
    planProgressPercent,
    answeredSteps,
    addUserMessage,
    addAIMessage,
    handleSendMessage,
    handleOptionSelect,
    handleSurpriseMe,
  } = chat;
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    // Try to get initial progress from session storage
    try {
      const hashStr = window.location.hash || '';
      const qs = hashStr.includes('?') ? hashStr.split('?')[1] : '';
      const params = new URLSearchParams(qs);
      const planId = params.get('plan_id');
      if (planId) {
        // Try to get user ID from session storage or wait for it
        const userFromSession = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
        if (userFromSession) {
          const sessionKey = `progress_${userFromSession}_${planId}`;
          const sessionProgress = sessionStorage.getItem(sessionKey);
          if (sessionProgress) {
            const progress = JSON.parse(sessionProgress);
            return progress.completed_days || [];
          }
        }
      }
    } catch {}
    return [];
  });
  
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    // Try to get initial progress from session storage
    try {
      const hashStr = window.location.hash || '';
      const qs = hashStr.includes('?') ? hashStr.split('?')[1] : '';
      const params = new URLSearchParams(qs);
      const planId = params.get('plan_id');
      if (planId) {
        // Try to get user ID from session storage or wait for it
        const userFromSession = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
        if (userFromSession) {
          const sessionKey = `progress_${userFromSession}_${planId}`;
          const sessionProgress = sessionStorage.getItem(sessionKey);
          if (sessionProgress) {
            const progress = JSON.parse(sessionProgress);
            // Show the last completed day from completed_days array
            const lastCompletedDay = progress.completed_days && progress.completed_days.length > 0 
              ? Math.max(...progress.completed_days)
              : 1;
            return lastCompletedDay;
          }
        }
      }
    } catch {}
    return 1;
  });
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [loadingDay, setLoadingDay] = useState<number | null>(null);
  const [dayGenerationError, setDayGenerationError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (planData) {
      // Get the real plan ID from URL or session, don't generate fake ones
      const urlParams = new URLSearchParams(window.location.search);
      const realPlanId = urlParams.get('plan_id') || sessionStorage.getItem('activePlanId') || '';
      
      if (realPlanId) {
        localStorage.setItem('lastViewedPlan', realPlanId);
        localStorage.setItem('lastViewedPlanData', JSON.stringify(planData));
        sessionStorage.setItem('activePlanData', JSON.stringify(planData));
        sessionStorage.setItem('activePlanId', realPlanId);
      }
    }
  }, [planData]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressLoadedRef = useRef(false);
  // Timer refs for staged progress
  const planProgressTimerRef = useRef<number | null>(null);
  const dayProgressTimerRef = useRef<number | null>(null);
  const { savePlan, saving } = usePlanStorage();
  const { user } = useAuth();
  
  // Plan state (not chat-related)
  const [planData, setPlanData] = useState<PlanData | null>(null);
  
  // Store user ID in session storage for initial state loading
  useEffect(() => {
    if (user?.id) {
      try {
        sessionStorage.setItem('user_id', user.id);
        localStorage.setItem('user_id', user.id);
      } catch {}
    }
  }, [user?.id]);

  // Fallback hydration when navigating directly to /#/plan?plan_id=... or from Dashboard without initialPlanData
  useEffect(() => {
    const hydratePlanIfMissing = async () => {
      try {
        if (planData) return;
        // Only hydrate when on the plan route, never on the generate route
        const routeHash = typeof window !== 'undefined' ? window.location.hash : '';
        const onPlanRoute = !!routeHash && routeHash.includes('#/plan');
        if (!onPlanRoute) return;
        // 1) Try session 'activePlanData' first
        try {
          const raw = sessionStorage.getItem('activePlanData') || sessionStorage.getItem('currentPlanData');
          if (raw) {
            const parsed = JSON.parse(raw);
            const fixed = fixPlanDataFields(parsed);
            setPlanData(fixed);
            return;
          }
        } catch {}

        // 1a) Try lastViewedPlanData in localStorage
        try {
          const lastRaw = localStorage.getItem('lastViewedPlanData');
          if (lastRaw) {
            const parsed = JSON.parse(lastRaw);
            const fixed = fixPlanDataFields(parsed);
            setPlanData(fixed);
            return;
          }
        } catch {}

        // 2) Try fetching by active plan id + user id
        const hashStr = window.location.hash || '';
        const qs = hashStr.includes('?') ? hashStr.split('?')[1] : '';
        const params = new URLSearchParams(qs);
        const idFromUrl = params.get('plan_id') || '';
        const idFromSession = sessionStorage.getItem('activePlanId') || '';
        const planId = String(idFromUrl || idFromSession || '');
        if (!planId) return;

        let payload: any = null;
        let match: any = null;
        // Prefer direct plan fetch by id (works even without user context)
        try {
          const r = await fetch(`/api/hobby-plans/${planId}?_t=${Date.now()}`, { cache: 'no-cache' });
          if (r.ok) {
            match = await r.json();
            payload = match?.plan_data || match?.planData || match;
          }
        } catch {}

        // Fallback to list-by-user if we have a user but single fetch failed
        if (!payload && user?.id) {
          const resp = await fetch(`/api/hobby-plans?user_id=${user.id}&_t=${Date.now()}`, { cache: 'no-cache' });
          if (resp.ok) {
            const plans = await resp.json().catch(() => []);
            match = Array.isArray(plans) ? plans.find((p: any) => String(p?.id) === String(planId)) : null;
            payload = match?.plan_data || match?.planData || match || null;
          }
        }

        // Supabase direct fetch (RLS-protected; requires signed-in user)
        if (!payload && planId) {
          try {
            const { data } = await supabase
              .from('hobby_plans')
              .select('id,user_id,plan_data')
              .eq('id', planId)
              .maybeSingle();
            if (data) {
              match = data as any;
              payload = (data as any).plan_data || data;
            }
          } catch {}
        }

        if (!payload) return;
        const fixed = fixPlanDataFields(payload);
        setPlanData(fixed);
        if (match?.id) setCurrentPlanId(String(match.id));
        try {
          sessionStorage.setItem('currentPlanData', JSON.stringify(fixed));
          sessionStorage.setItem('activePlanData', JSON.stringify(fixed));
          if (match?.id) sessionStorage.setItem('activePlanId', String(match.id));
        } catch {}
        // Load progress if available
        try { if (match?.id) await loadProgressFromDatabase(String(match.id)); } catch {}
      } catch {}
    };
    // Only run this fallback if we don't already have initial plan data
    if (!initialPlanData) {
      hydratePlanIfMissing();
    }
  }, [initialPlanData, planData, user]);

  // Chat-related constants and functions are now in usePlanChat hook

  useEffect(() => {
    if (initialPlanData && !progressLoaded) {
      const fixedPlanData = fixPlanDataFields(initialPlanData);
      setPlanData(fixedPlanData);
      setShowQuickReplies(true);
      
      // Load progress when initialPlanData is provided (e.g., from dashboard)
      const loadProgressForInitialPlan = async () => {
        try {
          console.log('🔄 Loading progress for initial plan data');
          
          // Try to get plan ID from URL or session storage
          const hashStr = window.location.hash || '';
          const qs = hashStr.includes('?') ? hashStr.split('?')[1] : '';
          const params = new URLSearchParams(qs);
          const planId = params.get('plan_id') || sessionStorage.getItem('activePlanId');
          
          console.log('📋 Plan ID from URL/session:', planId);
          console.log('👤 User ID:', user?.id);
          
          if (planId && user?.id) {
            setCurrentPlanId(planId);
            await loadProgressFromDatabase(planId);
            setProgressLoaded(true);
          } else if (user?.id) {
            // If no plan ID in URL, try to find the most recent plan for this user
            console.log('🔍 No plan ID found, searching for user plans...');
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc&limit=1`, {
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              }
            });
            
            if (response.ok) {
              const plans = await response.json();
              if (plans && plans.length > 0) {
                const plan = plans[0];
                console.log('✅ Found plan:', plan.id);
                setCurrentPlanId(plan.id.toString());
                await loadProgressFromDatabase(plan.id.toString());
                setProgressLoaded(true);
              }
            }
          }
        } catch (error) {
          console.error('Error loading progress for initial plan:', error);
        }
      };
      
      loadProgressForInitialPlan();
    }
  }, [initialPlanData, user, progressLoaded]);

  // Removed conflicting useEffect that was interfering with progress loading

  useEffect(() => {
    if (initialPlanData && !user) {
      const initializeWithAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const { data: supabasePlans } = await supabase
              .from('hobby_plans')
              .select('id, hobby, created_at, title')
              .eq('user_id', session.user.id)
              .eq('hobby', initialPlanData.hobby)
              .order('created_at', { ascending: false })
              .limit(5);
            if (supabasePlans && supabasePlans.length > 0) {
              const mostRecentPlan = supabasePlans[0];
              setCurrentPlanId(mostRecentPlan.id.toString());
              try {
                const { data: progressData } = await supabase
                  .from('user_progress')
                  .select('*')
                  .eq('plan_id', mostRecentPlan.id)
                  .eq('user_id', session.user.id);
                if (progressData && progressData.length > 0) {
                  const completed = progressData.map((p: any) => p.day_number);
                  setCompletedDays(completed);
                }
              } catch {}
              return;
            }
            const { data: userPlans } = await apiService.getHobbyPlans(session.user.id);
            if (userPlans && userPlans.length > 0) {
              const matchingPlans = userPlans.filter((plan: any) => plan.hobby === initialPlanData.hobby);
              if (matchingPlans.length > 0) {
                const mostRecentPlan = matchingPlans.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                setCurrentPlanId(mostRecentPlan.id.toString());
                try {
                  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${session.user.id}`, {
                    headers: {
                      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                      'Authorization': `Bearer ${session.access_token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  if (response.ok) {
                    const progressData = await response.json();
                    if (progressData && progressData.length > 0) {
                      const progress = progressData[0];
                      setCompletedDays(progress.completed_days || []);
                      setSelectedDay(progress.current_day || 1);
                      return;
                    }
                  }
                } catch {}
              }
            }
          } catch {}
        }
      };
      initializeWithAuth();
    } else if (initialPlanData) {
      const fixedGuestPlanData = fixPlanDataFields(initialPlanData);
      setPlanData(fixedGuestPlanData);
      if (messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          content: `Welcome back to your ${initialPlanData.hobby} learning plan! 🌟\n\nI'm here to help you with any questions about your 7-day journey. Feel free to ask me about:\n\n• Daily tasks and how to complete them\n• Tips for better practice\n• Troubleshooting common challenges\n• Resources and recommendations\n\nHow can I assist you today?`,
          timestamp: new Date()
        };
        chat.setMessages([welcomeMessage]);
      }
      if (user?.id) {
        setTimeout(async () => {
          try {
            const { data: plans } = await supabase
              .from('hobby_plans')
              .select('id')
              .eq('user_id', user.id)
              .eq('hobby', initialPlanData.hobby)
              .order('created_at', { ascending: false })
              .limit(1);
            if (plans && plans.length > 0) {
              setCurrentPlanId(plans[0].id.toString());
              await loadProgressFromDatabase(plans[0].id.toString());
            }
          } catch {}
        }, 100);
      }
      chat.setCurrentStep('generating');
      chat.setIsGenerating(false);
    }
  }, [initialPlanData]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Auto-generate the last completed day content if it's missing
  useEffect(() => {
    if (planData && planData.days && selectedDay > 1) {
      const currentDayData = planData.days.find((d: any) => d.day === selectedDay);
      if (currentDayData && !currentDayData.youtubeVideoId && !currentDayData.youtubeSearchUrl) {
        // Auto-generate video for this day if it doesn't have one
        generateVideoForDay(selectedDay);
      }
    }
  }, [selectedDay, planData]);

  // Function to generate video for a specific day
  const generateVideoForDay = async (dayNumber: number) => {
    if (!planData || dayNumber < 2 || dayNumber > 7) return;
    
    try {
      console.log(`🎥 Generating video for Day ${dayNumber}...`);
      
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No authentication token available');
        return;
      }
      
      const response = await fetch('/api/generate-day', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          hobby: planData.hobby,
          experience: 'beginner', // Default experience level
          timeAvailable: '30-60 minutes', // Default time
          goal: `Learn ${planData.hobby} fundamentals`,
          day_number: dayNumber,
          outline: planData.outline || [],
          prior_days: planData.days?.filter((d: any) => d.day < dayNumber) || [],
          plan_id: currentPlanId || sessionStorage.getItem('activePlanId') || ''
        })
      });

      if (response.ok) {
        const dayData = await response.json();

        // Merge locally
        const mergedDays = (() => {
          const baseDays = Array.isArray(planData?.days) ? planData.days : [];
          const others = baseDays.filter((d: any) => Number(d?.day) !== dayNumber);
          const next = {
            day: dayNumber,
            title: dayData.day.title,
            mainTask: dayData.day.mainTask,
            explanation: dayData.day.explanation,
            howTo: dayData.day.howTo,
            checklist: dayData.day.checklist,
            tips: dayData.day.tips,
            mistakesToAvoid: dayData.day.mistakesToAvoid,
            freeResources: dayData.day.freeResources || [],
            affiliateProducts: dayData.day.affiliateProducts || [],
            youtubeVideoId: dayData.day.youtubeVideoId,
            videoTitle: dayData.day.videoTitle,
            estimatedTime: dayData.day.estimatedTime,
            skillLevel: dayData.day.skillLevel
          };
          return [...others, next].sort((a: any, b: any) => Number(a.day) - Number(b.day));
        })();

        setPlanData(prev => prev ? { ...prev, days: mergedDays } : prev);

        // Persist to DB as fallback (in case server-side persist skipped)
        try {
          if (currentPlanId) {
            const payload = {
              hobby: planData?.hobby,
              title: planData?.title,
              overview: planData?.overview,
              difficulty: planData?.difficulty,
              totalDays: Number((planData as any)?.totalDays || 7),
              outline: Array.isArray((planData as any)?.outline) ? (planData as any).outline : [],
              days: mergedDays
            } as any;
            const up = await supabase.from('hobby_plans').update({ plan_data: payload, total_days: Number(payload.totalDays || mergedDays.length) }).eq('id', currentPlanId);
            if (up.error) console.warn('⚠️ Client persist of day failed:', up.error.message);
          }
        } catch (persistErr) {
          console.warn('⚠️ Client persist exception:', persistErr);
        }
      } else {
        console.error(`❌ Failed to generate video for Day ${dayNumber}:`, response.status);
      }
    } catch (error) {
      console.error(`❌ Error generating video for Day ${dayNumber}:`, error);
    }
  };

  // Ensure full content exists for the currently selected day (when returning from dashboard)
  const generateContentForDayIfMissing = async (dayNumber: number) => {
    if (!planData || dayNumber < 2 || dayNumber > 7) return;
    const currentDayData = (planData.days || []).find((d: any) => d.day === dayNumber);
    if (currentDayData) return;
    try {
      setLoadingDay(dayNumber);
      const prevDays = planData?.days || [];
      const body: any = {
        hobby: planData.hobby,
        experience: planData.difficulty || 'beginner',
        timeAvailable: (planData.days?.[0]?.estimatedTime || '30-60 minutes'),
        goal: planData.overview || `Learn ${planData.hobby} fundamentals`,
        day_number: dayNumber,
        outline: (planData as any).outline || [],
        prior_days: prevDays.map((d: any) => ({ day: d.day, title: d.title, mainTask: d.mainTask, howTo: d.howTo })),
        plan_id: currentPlanId || sessionStorage.getItem('activePlanId') || ''
      };
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No authentication token available');
        setLoadingDay(null);
        return;
      }
      const resp = await fetch('/api/generate-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(body)
      });
      if (resp.ok) {
        const j = await resp.json();
        if (j?.day) {
          const mergedDays = (() => {
            const baseDays = Array.isArray(planData?.days) ? planData.days : [];
            const others = baseDays.filter((d: any) => Number(d?.day) !== dayNumber);
            return [...others, j.day].sort((a: any, b: any) => Number(a.day) - Number(b.day));
          })();
          setPlanData((prev: any) => prev ? { ...prev, days: mergedDays } : prev);
          // Persist to DB as fallback
          try {
            if (currentPlanId) {
              const payload = {
                hobby: planData?.hobby,
                title: planData?.title,
                overview: planData?.overview,
                difficulty: planData?.difficulty,
                totalDays: Number((planData as any)?.totalDays || 7),
                outline: Array.isArray((planData as any)?.outline) ? (planData as any).outline : [],
                days: mergedDays
              } as any;
              const up = await supabase.from('hobby_plans').update({ plan_data: payload, total_days: Number(payload.totalDays || mergedDays.length) }).eq('id', currentPlanId);
              if (up.error) console.warn('⚠️ Client persist of day (hydrate path) failed:', up.error.message);
              else console.log('💾 Client persist of day (hydrate path) ok; days =', mergedDays.length);
            }
          } catch (err) {
            console.warn('⚠️ Client persist exception (hydrate path):', err);
          }
        }
      } else {
        console.warn('🔧 Auto-generate day failed for hydration:', resp.status, resp.statusText);
        // Create a minimal local fallback so the user can continue when AI is unavailable
        if (resp.status === 503) {
          const fallback = {
            day: dayNumber,
            title: `Day ${dayNumber} - Practice Session`,
            mainTask: `Review and practice the concepts you learned on Day ${dayNumber - 1}.`,
            explanation: `AI service is temporarily unavailable. This fallback keeps you moving.`,
            howTo: [
              `Warm up for 5 minutes`,
              `Repeat the main exercise from Day ${dayNumber - 1}`,
              `Reflect 2 minutes: one win, one improvement`
            ],
            checklist: [
              `Practice complete`,
              `Note one improvement`
            ],
            tips: [
              `Stay consistent; small gains compound.`,
              `Break into two short sessions if needed.`
            ],
            mistakesToAvoid: [
              `Rushing; aim for quality reps.`,
              `Skipping reflection.`
            ],
            freeResources: [],
            affiliateProducts: [],
            youtubeVideoId: null,
            videoTitle: 'Video not available',
            estimatedTime: '30-45 minutes',
            skillLevel: planData.difficulty || 'beginner'
          };
          setPlanData((prev: any) => prev ? { ...prev, days: [...prev.days, fallback] } : prev);
        }
      }
    } catch (e) {
      console.error('🔧 Auto-generate day exception:', e);
    } finally {
      setLoadingDay(null);
    }
  };

  // Track which days we already tried to hydrate to avoid loops
  const attemptedHydrationDaysRef = useRef<Set<number>>(new Set());
  
  // Try merging missing day content from sessionStorage cache
  const mergeDayFromSessionIfExists = (dayNumber: number): boolean => {
    try {
      const keys = ['activePlanData', 'currentPlanData', 'lastViewedPlanData'];
      for (const k of keys) {
        const raw = sessionStorage.getItem(k) || localStorage.getItem(k);
        if (!raw) continue;
        let cached: any = null;
        try { cached = JSON.parse(raw); } catch {}
        if (!cached) continue;
        const payload = cached?.plan_data?.days ? cached.plan_data : (cached?.days ? cached : null);
        const found = payload?.days?.find((d: any) => Number(d?.day) === Number(dayNumber));
        if (found) {
          setPlanData((prev: any) => prev ? { ...prev, days: [...prev.days.filter((d: any) => d.day !== dayNumber), found] } : prev);
          return true;
        }
      }
    } catch {}
    return false;
  };

  // Fetch latest plan payload from API to hydrate missing day content
  const fetchLatestPlanDataForPlanId = async (): Promise<any | null> => {
    try {
      const planId = currentPlanId || sessionStorage.getItem('activePlanId') || '';
      if (!planId) return null;
      const r = await fetch(`/api/hobby-plans/${planId}?_t=${Date.now()}`, { cache: 'no-cache' });
      if (!r.ok) return null;
      const j = await r.json();
      const payload = j?.plan_data || j?.planData || j;
      if (payload) {
        const fixed = fixPlanDataFields(payload);
        const currentDays = Array.isArray(planData?.days) ? planData!.days : [];
        const serverDays = Array.isArray(fixed?.days) ? fixed.days : [];
        // Merge by day number, prefer current/local content over server when conflict
        const dayMap = new Map<number, any>();
        for (const d of currentDays) { dayMap.set(Number(d?.day), d); }
        for (const d of serverDays) { const k = Number(d?.day); if (!dayMap.has(k)) dayMap.set(k, d); }
        const mergedDays = Array.from(dayMap.values()).sort((a: any, b: any) => Number(a.day) - Number(b.day));
        const currentLen = currentDays.length;
        const mergedLen = mergedDays.length;
        if (mergedLen > currentLen) {
          setPlanData(prev => {
            const base = prev || {} as any;
            return { ...base, ...fixed, days: mergedDays };
          });
        }
        // Return the server-fixed payload so callers can check
        return { ...fixed, days: mergedDays };
      }
      return null;
    } catch { return null; }
  };

  // When a day is selected but content is missing after hydration, snap to last available saved day (no auto-generate)
  useEffect(() => {
    if (!planData || !Array.isArray(planData.days)) return;
    if (selectedDay <= 1) return;
    const hasContent = planData.days.some((d: any) => d.day === selectedDay);
    if (hasContent) return;
    if (loadingDay === selectedDay) return;
    if (attemptedHydrationDaysRef.current.has(selectedDay)) return;
    attemptedHydrationDaysRef.current.add(selectedDay);

    (async () => {
      // First, try session cache merge (avoids re-generation if user had content locally)
      const merged = mergeDayFromSessionIfExists(selectedDay);
      if (merged) return;
      // First, try to hydrate from backend
      const refreshed = await fetchLatestPlanDataForPlanId();
      const existsNow = (refreshed?.days || planData?.days || []).some((d: any) => d.day === selectedDay);
      if (existsNow) return;
      // Still missing: snap to the last available saved day to avoid placeholder
      const availableDays = (refreshed?.days || planData?.days || []).map((d: any) => Number(d.day) || 0);
      const maxAvailable = availableDays.length > 0 ? Math.max(...availableDays) : 1;
      setSelectedDay(maxAvailable);
    })();
  }, [selectedDay, planData, currentPlanId, loadingDay]);

  // Chat functions are now in usePlanChat hook - all removed

  const loadProgressFromDatabase = async (planId: string) => {
    if (!user?.id) return;
    if (progressLoaded || progressLoading || progressLoadedRef.current) {
      console.log('🔄 Progress already loaded or loading, skipping...');
      return;
    }
    
    setProgressLoading(true);
    try {
      console.log('🔄 Loading progress for plan:', planId);
      
      // Debug: Check all session storage keys
      console.log('🔍 All session storage keys:');
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('progress')) {
          console.log('🔍 Progress key:', key, 'Value:', sessionStorage.getItem(key));
        }
      }
      
      // First try session storage
      const sessionKey = `progress_${user.id}_${planId}`;
      console.log('🔍 Looking for session key:', sessionKey);
      const sessionProgress = sessionStorage.getItem(sessionKey);
      if (sessionProgress) {
        try {
          const progress = JSON.parse(sessionProgress);
          console.log('📦 Found progress in session:', progress);
          console.log('📦 Progress completed_days:', progress.completed_days);
          console.log('📦 Progress current_day:', progress.current_day);
          
          const completedDaysArray = progress.completed_days || [];
          const lastCompletedDay = completedDaysArray.length > 0 ? Math.max(...completedDaysArray) : 1;
          
          console.log('📦 Setting completedDays to:', completedDaysArray);
          console.log('📦 Setting selectedDay to:', lastCompletedDay);
          
          setCompletedDays(completedDaysArray);
          setSelectedDay(lastCompletedDay);
          progressLoadedRef.current = true;
          
          // Force a re-render by updating state
          setTimeout(() => {
            console.log('🔄 Forcing re-render with progress data');
            setCompletedDays([...completedDaysArray]);
            setSelectedDay(lastCompletedDay);
          }, 100);
          
          return;
        } catch (parseError) {
          console.error('Error parsing session progress:', parseError);
        }
      }
      
      // Try direct API call for this specific plan
      try {
        console.log('🔍 Trying direct API call for plan progress...');
        const response = await fetch(`/api/user-progress/${user.id}/${planId}`, { cache: 'no-cache' });
        if (response.ok) {
          const progressData = await response.json();
          console.log('💾 Direct API progress data:', progressData);
          if (progressData && progressData.completed_days) {
            const lastCompletedDay = progressData.completed_days.length > 0 ? Math.max(...progressData.completed_days) : 1;
            setCompletedDays(progressData.completed_days || []);
            setSelectedDay(lastCompletedDay);
            
            // Cache in session storage
            try {
              sessionStorage.setItem(sessionKey, JSON.stringify({
                completed_days: progressData.completed_days || [],
                current_day: progressData.current_day || 1
              }));
            } catch {}
            return;
          }
        }
      } catch (directError) {
        console.log('Direct API call failed, trying general progress...');
      }
      
      // Then try general user progress
      const { data: progressData, error } = await apiService.getUserProgress(user.id);
      if (!error && progressData) {
        const planProgress = progressData.find((p: any) => String(p.plan_id) === String(planId));
        if (planProgress) {
          console.log('💾 Found progress in general database:', planProgress);
          const lastCompletedDay = planProgress.completed_days && planProgress.completed_days.length > 0 ? Math.max(...planProgress.completed_days) : 1;
          setCompletedDays(planProgress.completed_days || []);
          setSelectedDay(lastCompletedDay);
          
          // Cache in session storage
          try {
            sessionStorage.setItem(sessionKey, JSON.stringify({
              completed_days: planProgress.completed_days || [],
              current_day: planProgress.current_day || 1
            }));
          } catch {}
        } else {
          console.log('❌ No progress found for plan:', planId);
        }
      }
      
      // Final fallback: try Supabase directly
      try {
        console.log('🔍 Trying Supabase direct query...');
        const { data: supabaseProgress, error: supabaseError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('plan_id', planId)
          .maybeSingle();
        
        if (!supabaseError && supabaseProgress) {
          console.log('💾 Found progress in Supabase:', supabaseProgress);
          const lastCompletedDay = supabaseProgress.completed_days && supabaseProgress.completed_days.length > 0 ? Math.max(...supabaseProgress.completed_days) : 1;
          setCompletedDays(supabaseProgress.completed_days || []);
          setSelectedDay(lastCompletedDay);
          
          // Cache in session storage
          try {
            sessionStorage.setItem(sessionKey, JSON.stringify({
              completed_days: supabaseProgress.completed_days || [],
              current_day: supabaseProgress.current_day || 1
            }));
          } catch {}
        } else {
          console.log('❌ No progress found in Supabase for plan:', planId);
        }
              } catch (supabaseError) {
          console.error('Supabase direct query failed:', supabaseError);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setProgressLoading(false);
      }
    };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => {
    if (dayNumber === 1) return true;
    // For days 2-7, user must be logged in AND have completed the previous day
    if (!user) return false;
    return isDayCompleted(dayNumber - 1);
  };

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;
    try {
      setIsSavingProgress(true);
      if (isDayCompleted(dayNumber)) {
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);
        if (user?.id && currentPlanId) {
          try {
            await hobbyPlanService.updateProgress(user.id, currentPlanId, {
              completed_days: newCompletedDays,
              current_day: Math.max(1, Math.min(...newCompletedDays) || 1),
              unlocked_days: [1, ...newCompletedDays.map(d => d + 1)].filter(d => d <= 7)
            });
          } catch (error) {
            console.warn('Progress update failed, non-blocking', error);
          }
        }
      } else {
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);
        if (user?.id && currentPlanId) {
          try {
            await hobbyPlanService.completeDay(user.id, currentPlanId, dayNumber);
          } catch (error) {
            console.warn('Progress completeDay failed, non-blocking', error);
          }
        }
        if (dayNumber === 1 && !user) {
          addAIMessage("🎉 Well done! Day 1 completed! Sign up to unlock Days 2-7 and track your progress.", [], 500);
          setShowAuthModal(true);
        } else if (dayNumber === 7) {
          addAIMessage("🎊 Congratulations! You've completed your 7-day learning journey! You're amazing!", [], 500);
          try { setShowConfetti(true); } catch {}
        } else if (user) {
          addAIMessage(`Great job! Day ${dayNumber} completed. Keep up the excellent work!`, [], 500);
          try { setShowConfetti(true); } catch {}
        }
      }
    } catch (e) {
      console.warn('toggleDayCompletion error (non-blocking):', e);
      // Keep UX positive if local state succeeded
      addAIMessage("Progress saved locally. We'll sync in the background.", [], 500);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
    const isCompleted = isDayCompleted(dayNumber);
    const status = (() => {
      if (isCompleted) return 'completed';
      if (dayNumber === 1) return 'unlocked';
      if (dayNumber === 2 && !user) return 'unlocked';
      if (dayNumber > 2 && !user) return 'locked';
      if (isDayUnlocked(dayNumber)) return 'unlocked';
      return 'locked';
    })();
    console.log('🎯 Day status for day', dayNumber, ':', { isCompleted, user: !!user, status });
    return status;
  };

  const progressPercentage = useMemo(() => {
    // Force totalDays to be 7 for photography plans
    const totalDays = 7;
    const percentage = planData ? (completedDays.length / totalDays) * 100 : 0;
    console.log('📊 Progress calculation:', { 
      completedDays: completedDays.length, 
      totalDays, 
      percentage,
      planDataTotalDays: planData?.totalDays,
      planDataDaysLength: planData?.days?.length,
      planDataTitle: planData?.title
    });
    return percentage;
  }, [completedDays.length, planData?.totalDays, planData?.days?.length]);

  // Debug useEffect to monitor completedDays changes
  useEffect(() => {
    console.log('🎯 completedDays state changed to:', completedDays);
    console.log('🎯 selectedDay state changed to:', selectedDay);
    console.log('🎯 progressPercentage:', progressPercentage);
  }, [completedDays, selectedDay, progressPercentage]);

  // Reset progressLoaded when plan changes
  useEffect(() => {
    if (initialPlanData) {
      setProgressLoaded(false);
    }
  }, [initialPlanData?.hobby]); // Reset when hobby changes

  // Prevent state reset when progress is already loaded
  useEffect(() => {
    if (progressLoaded && completedDays.length > 0) {
      console.log('🛡️ Preventing progress state reset - progress already loaded');
      return;
    }
  }, [progressLoaded, completedDays]);

  // Aggressive state protection - restore progress if it gets reset
  useEffect(() => {
    if (completedDays.length === 0 && selectedDay === 1 && user?.id) {
      console.log('🛡️ Detected state reset, attempting to restore progress...');
      
      // Try to restore from session storage
      const hashStr = window.location.hash || '';
      const qs = hashStr.includes('?') ? hashStr.split('?')[1] : '';
      const params = new URLSearchParams(qs);
      const planId = params.get('plan_id');
      
      if (planId) {
        const sessionKey = `progress_${user.id}_${planId}`;
        const sessionProgress = sessionStorage.getItem(sessionKey);
        if (sessionProgress) {
          try {
            const progress = JSON.parse(sessionProgress);
            console.log('🛡️ Restoring progress from session:', progress);
            setCompletedDays(progress.completed_days || []);
            setSelectedDay(progress.current_day || 1);
            setProgressLoaded(true);
          } catch (error) {
            console.error('Error restoring progress:', error);
          }
        }
      }
    }
  }, [completedDays.length, selectedDay, user?.id]);

  // Force UI update when progress is loaded
  useEffect(() => {
    if (completedDays.length > 0 && planData) {
      console.log('🎨 Forcing UI update with progress:', { completedDays, selectedDay, progressPercentage });
      // Force a re-render by updating state
      setTimeout(() => {
        setCompletedDays([...completedDays]);
        setSelectedDay(selectedDay);
      }, 100);
    }
  }, [completedDays.length, planData]);

  // Force re-render when progress changes
  const [forceRender, setForceRender] = useState(0);
  useEffect(() => {
    if (completedDays.length > 0) {
      console.log('🔄 Forcing component re-render due to progress change');
      setForceRender(prev => prev + 1);
    }
  }, [completedDays.length, progressPercentage]);

  // Precheck functions are now in usePlanChat hook - removed

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <title>{planData ? `${planData.title} - Learn ${planData.hobby} in 7 Days` : 'Learn a New Hobby in 7 Days | AI Hobby Plan Generator'}</title>
        <meta name="description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan. Step-by-step guidance, daily tasks, and expert tips to help you succeed.` : "Ready to learn a new hobby fast? Build a 7-day plan with lessons, videos, and daily practice tips tailored to beginners."} />
        <meta name="keywords" content={planData ? `${planData.hobby}, learning, 7-day plan, tutorial, skills, personal development` : 'learn a new hobby, 7-day hobby plan, ai hobby generator, hobby ideas for beginners'} />
        <meta property="og:title" content={planData ? `Learn ${planData.hobby} in 7 Days` : 'Learn a New Hobby in 7 Days'} />
        <meta property="og:description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan.` : 'Create a 7-day AI hobby plan with lessons, videos, and daily practice prompts.'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={planData ? `Learn ${planData.hobby} in 7 Days` : 'Learn a New Hobby in 7 Days'} />
        <meta name="twitter:description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan.` : 'Create a 7-day AI hobby plan with lessons, videos, and daily practice prompts.'} />
      </div>
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={() => {
          if (planData && user) {
            sessionStorage.setItem('activePlanData', JSON.stringify(planData));
            sessionStorage.setItem('fromGeneratedPlan', 'true');
            window.location.href = '/#/dashboard';
          } else {
            onNavigateBack();
          }
        }}
        currentPage={planData ? "plan" : "generate"}
      />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Chat Interface - Full width on mobile, left side on desktop */}
        <div className="w-full lg:w-1/2 xl:w-2/5 border-r-0 lg:border-r-2 border-gray-300 bg-white flex flex-col h-full lg:h-full min-h-[60vh] lg:min-h-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Your AI hobby guide</h2>
              </div>
              
              {/* Make a New Plan Button - Top Right (show only after a plan exists) */}
              {planData && (
              <Button
                onClick={() => {
                  // Reset to initial state for new plan
                  setPlanData(null);
                  chat.setMessages([{
                    id: '1',
                    sender: 'ai' as const,
                    content: "Hi! 👋 I'm here to help you learn any hobby in just 7 days.\n\nI'll create a personalized learning plan just for you. What would you like to learn?",
                    options: [
                      { value: 'photography', label: 'Photography 📸', description: 'Capture amazing moments' },
                      { value: 'guitar', label: 'Guitar 🎸', description: 'Strum your first songs' },
                      { value: 'cooking', label: 'Cooking 👨‍🍳', description: 'Create delicious meals' },
                      { value: 'drawing', label: 'Drawing 🎨', description: 'Express your creativity' },
                      { value: 'yoga', label: 'Yoga 🧘', description: 'Find balance and peace' },
                      { value: 'gardening', label: 'Gardening 🌱', description: 'Grow your own plants' },
                      { value: 'coding', label: 'Coding 💻', description: 'Build your first app' },
                      { value: 'dance', label: 'Dance 💃', description: 'Move to the rhythm' },
                      { value: 'surprise', label: 'Surprise Me! 🎲', description: 'Let AI pick for me' }
                    ],
                    step: 'hobby',
                    timestamp: new Date()
                  }]);
                  chat.setCurrentStep('hobby');
                  chat.setSelectedHobby('');
                  chat.setQuizAnswers({});
                  chat.setAnsweredSteps(new Set());
                  setCompletedDays([]);
                  setSelectedDay(1);
                  chat.setCurrentInput('');
                  // Clear any existing plan data from storage
                  sessionStorage.removeItem('activePlanData');
                  sessionStorage.removeItem('currentPlanData');
                  localStorage.removeItem('lastViewedPlan');
                  localStorage.removeItem('lastViewedPlanData');
                }}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🚀 New Plan
              </Button>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-200px)]">
            {messages.length === 0 && (
                          <div className="text-center text-gray-500 p-4">
              <div className="lg:hidden mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Learn a New Hobby in 7 Days</h3>
                <p className="text-sm text-gray-600">Tell me which new hobby you want to learn this week, and I'll build a personalized 7-day plan just for you!</p>
              </div>
              <div className="hidden lg:block">
                <p>Loading conversation...</p>
              </div>
            </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.id}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-3 lg:px-5 lg:py-4 shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-xs lg:text-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: message.content }} />
                  {message.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.options.map((option) => {
                        const isDisabledForStep = message.step ? (message.step !== currentStep || answeredSteps.has(message.step)) : false;
                        return (
                        <button
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value, option.label)}
                          className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 shadow-sm border ${option.value === 'surprise' ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 border-transparent hover:from-purple-600 hover:to-pink-600' : 'text-gray-700 bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'} ${isDisabledForStep || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isGenerating || isDisabledForStep}
                        >
                          {option.label}
                        </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50">

            {showQuickReplies && (
              <div className="mb-3 flex flex-wrap gap-2">
                {['How do I get started?','What should I practice today?','Suggest resources','Common mistakes to avoid'].map((q) => (
                  <button key={q} onClick={() => { setCurrentInput(q); setShowQuickReplies(false); }} className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-3 items-center">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value.slice(0, 50))}
                    placeholder="Ask me anything about your plan..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full pr-12 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
                    aria-label="Chat input"
                  />
                  <span
                    id="char-counter"
                    aria-live="polite"
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${currentInput.length < 35 ? 'text-gray-400' : currentInput.length < 50 ? 'text-yellow-600' : 'text-red-600'}`}
                  >
                    {currentInput.length}/50
                  </span>
                </div>
                <Button onClick={handleSendMessage} size="sm" className="px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Display - Full width on mobile, right side on desktop */}
        <div className="w-full lg:w-1/2 xl:w-3/5 overflow-y-auto h-full bg-gray-50 min-h-[40vh] lg:min-h-0">
          {planData && planData.days ? (
            <div className="p-4 lg:p-6">
              {/* Header */}
              <div className="mb-4 lg:mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{planData.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {planData.difficulty}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        7 days
                      </span>
                    </div>
                  </div>
                  
                  {/* Share Button */}
                  <div className="mt-3 lg:mt-0">
                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `${planData.title} - 7-Day Learning Plan`,
                            text: `Check out my ${planData.hobby} learning plan on Wizqo!`,
                            url: window.location.href
                          });
                        } else {
                          // Fallback: copy to clipboard
                          navigator.clipboard.writeText(window.location.href);
                          // You could add a toast notification here
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share className="w-4 h-4" />
                      Share Plan
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4 lg:mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedDays.length}/7 days completed

                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    Progress: {progressPercentage.toFixed(1)}% | Completed: {completedDays.join(', ') || 'none'} | Current Day: {selectedDay}
                  </div>
                </div>

                {/* Overview */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{planData.overview}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Day Selection Buttons */}
              <div className="mb-4 lg:mb-6 sticky top-0 z-20 bg-gray-50/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 lg:static lg:bg-transparent lg:backdrop-blur-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Select Day</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1 lg:flex-wrap lg:overflow-visible lg:mx-0 lg:px-0">
                                    {(() => {
                    // Show all 7 days with proper status
                    const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
                    const nextDayToComplete = lastCompletedDay + 1;
                    
                    // Do not auto-correct selectedDay here; respect explicit user selection
                    

                    
                    // Generate all 7 day buttons
                    return Array.from({ length: 7 }, (_, i) => {
                      const dayNum = i + 1;
                      const isCompleted = completedDays.includes(dayNum);
                      const isNextDay = dayNum === nextDayToComplete;
                      const isSelected = selectedDay === dayNum;
                      const hasContent = planData?.days?.some((d: any) => d.day === dayNum);
                      
                      return (
                        <button
                          key={dayNum}
                          data-day={dayNum}
                          onClick={async () => {
                            console.log('🎯 Day button clicked:', { dayNum, isCompleted, isNextDay });
                            setDayGenerationError(null);
                            setSelectedDay(dayNum);
                            
                            // Generate content if it doesn't exist
                            if (!hasContent) {
                              try {
                                console.log('🎯 Generating content for day:', dayNum);
                                setLoadingDay(dayNum);
                                // Start lightweight local progress (visual only)
                                try { if (dayProgressTimerRef.current) window.clearInterval(dayProgressTimerRef.current); } catch {}
                                let localPercent = 0;
                                dayProgressTimerRef.current = window.setInterval(() => {
                                  localPercent = Math.min(95, localPercent + 5);
                                  // percent rendered below in Loader section label
                                }, 250);
                                const prevDays = planData?.days || [];
                                const body: any = {
                                  hobby: planData.hobby,
                                  experience: planData.difficulty || 'beginner',
                                  timeAvailable: (planData.days?.[0]?.estimatedTime || '30-60 minutes'),
                                  goal: planData.overview || `Learn ${planData.hobby} fundamentals`,
                                  day_number: dayNum,
                                  outline: (planData as any).outline || [],
                                  prior_days: prevDays.map((d: any) => ({ day: d.day, title: d.title, mainTask: d.mainTask, howTo: d.howTo })),
                                  plan_id: currentPlanId || sessionStorage.getItem('activePlanId') || ''
                                };
                                console.log('🎯 Sending day generation request:', body);
                                
                                // Get the current session for authentication
                                const { data: { session } } = await supabase.auth.getSession();
                                if (!session?.access_token) {
                                  console.error('❌ No authentication token available');
                                  setDayGenerationError('Please sign in to generate content.');
                                  setLoadingDay(null);
                                  return;
                                }
                                
                                const resp = await fetch('/api/generate-day', { 
                                  method: 'POST', 
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${session.access_token}`
                                  }, 
                                  body: JSON.stringify(body) 
                                });
                                console.log('🎯 Day generation response status:', resp.status);
                                if (resp.ok) {
                                  const j = await resp.json();
                                  console.log('🎯 Day generation response:', j);
                                  if (j?.day) {
                                    console.log('🎯 Adding generated day to plan data');
                                    const mergedDays = (() => {
                                      const baseDays = Array.isArray(planData?.days) ? planData.days : [];
                                      const others = baseDays.filter((d: any) => Number(d?.day) !== dayNum);
                                      return [...others, j.day].sort((a: any, b: any) => Number(a.day) - Number(b.day));
                                    })();
                                    setPlanData((prev: any) => prev ? { ...prev, days: mergedDays } : prev);
                                    // Persist to DB as fallback
                                    try {
                                      if (currentPlanId) {
                                        const payload = {
                                          hobby: planData?.hobby,
                                          title: planData?.title,
                                          overview: planData?.overview,
                                          difficulty: planData?.difficulty,
                                          totalDays: Number((planData as any)?.totalDays || 7),
                                          outline: Array.isArray((planData as any)?.outline) ? (planData as any).outline : [],
                                          days: mergedDays
                                        } as any;
                                        const up = await supabase.from('hobby_plans').update({ plan_data: payload, total_days: Number(payload.totalDays || mergedDays.length) }).eq('id', currentPlanId);
                                        if (up.error) console.warn('⚠️ Client persist of day (button path) failed:', up.error.message);
                                      }
                                    } catch (err) {
                                      console.warn('⚠️ Client persist exception (button path):', err);
                                    }
                                  } else {
                                    // No day data in response
                                  }
                                } else {
                                  if (resp.status === 401) {
                                    setDayGenerationError('Sign in to generate and save plans.');
                                  } else if (resp.status === 429 || resp.status === 500) {
                                    setDayGenerationError('Generation failed (possibly API quota). Please try again later.');
                                  } else {
                                    setDayGenerationError('Sign in to generate and save plans.');
                                  }
                                }
                                try { if (dayProgressTimerRef.current) window.clearInterval(dayProgressTimerRef.current); } catch {}
                                setLoadingDay(null);
                              } catch (e) {
                                try { if (dayProgressTimerRef.current) window.clearInterval(dayProgressTimerRef.current); } catch {}
                                setLoadingDay(null);
                                setDayGenerationError('Sign in to generate and save plans.');
                              }
                            }
                          }}
                          disabled={loadingDay === dayNum || !isDayUnlocked(dayNum)}
                          className={`min-w-[44px] w-11 h-11 lg:w-12 lg:h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center relative touch-manipulation ${
                            isSelected
                              ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                              : loadingDay === dayNum
                                ? 'bg-gray-100 text-gray-600 border-2 border-gray-300 cursor-wait'
                                : isCompleted
                                  ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                                  : isNextDay && isDayUnlocked(dayNum)
                                    ? 'bg-orange-50 text-orange-600 border-2 border-orange-300 hover:bg-orange-100'
                                    : !isDayUnlocked(dayNum)
                                      ? 'bg-gray-50 text-gray-400 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                                      : 'bg-gray-50 text-gray-400 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {loadingDay === dayNum ? (
                            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              {dayNum}
                              {isCompleted && (
                                <CheckCircle className="w-3 h-3 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                              )}
                              {isNextDay && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">→</span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Selected Day Content */}
              {(() => {
                const currentDay = planData?.days?.find((day: any) => day.day === selectedDay);
                const status = getDayStatus(selectedDay);

                if (!currentDay) {
                  return (
                    <Card className="p-8 text-center">
                      {dayGenerationError && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          {dayGenerationError}
                        </div>
                      )}
                      {loadingDay === selectedDay || attemptedHydrationDaysRef.current.has(selectedDay) ? (
                        <div className="flex flex-col items-center space-y-3">
                          <div style={{ transform: 'scale(0.6)' }}><Loader /></div>
                          <p className="text-gray-700 font-medium">Loading Day {selectedDay} content…</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-xl">🎯</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Day {selectedDay}!</h3>
                          <p className="text-gray-600 mb-4">Click the green Day {selectedDay} button above to start your next lesson.</p>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-700">
                              <strong>Tip:</strong> Complete each day in order to build your skills progressively.
                            </p>
                          </div>
                        </>
                      )}
                    </Card>
                  );
                }
                return (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b sticky top-0 z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center leading-snug">
                            Day {currentDay.day}: {currentDay.title}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Main Focus</p>
                        </div>
                        <button
                          onClick={() => toggleDayCompletion(selectedDay)}
                          disabled={selectedDay > 1 && !user && status !== 'completed'}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm border transition-colors ${
                            selectedDay > 1 && !user && status !== 'completed'
                              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {status === 'completed' ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Completed</span>
                            </>
                          ) : selectedDay > 1 && !user ? (
                            <>
                              <Lock className="w-5 h-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-400">Login to Complete</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">Mark Complete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-8 md:p-12">
                        <div className="max-w-4xl">
                          <div className="flex items-center mb-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                              <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Today's Learning Goal</h2>
                          </div>
                          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-medium text-blue-50 mb-6">
                            {currentDay.mainTask}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                              <span className="text-blue-200">Day {currentDay.day} of 7</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                              <span className="text-purple-200">Beginner Level</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 space-y-8">
                        <section className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6 md:p-8">
                          <div className="flex items-center mb-6">
                            <div className="bg-green-500 rounded-full p-2 mr-4">
                              <span className="text-white text-xl">📚</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-green-900">Why This Matters</h3>
                          </div>
                          <p className="text-base sm:text-lg text-green-800 leading-relaxed">
                            {currentDay.explanation}
                          </p>
                        </section>

                        <section className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 shadow-sm">
                          <div className="flex items-center mb-3">
                            <div className="bg-indigo-500 rounded-full p-1.5 mr-3">
                              <span className="text-white text-base">🔍</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Guide</h3>
                          </div>
                          <div className="space-y-2">
                            {(currentDay.howTo || []).slice(0, 5).map((step, index) => (
                              <div key={index} className="flex items-start group hover:bg-gray-50 rounded-lg p-3 transition-colors">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0 shadow">
                                  {index + 1}
                                </div>
                                <div className="text-gray-800 leading-snug text-base sm:text-sm flex-1">{step}</div>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 sm:p-6 md:p-8">
                          <div className="flex items-center mb-6">
                            <div className="bg-red-500 rounded-full p-2 mr-4">
                              <span className="text-white text-xl">📺</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Watch Today's Video Tutorial</h3>
                          </div>
                          <div>
                            {currentDay.youtubeVideoId ? (
                              <YouTubeEmbed 
                                videoId={currentDay.youtubeVideoId}
                                title={currentDay.videoTitle || `${currentDay.title} Tutorial`}
                                className="mb-4 rounded-xl overflow-hidden"
                              />
                            ) : currentDay.youtubeSearchUrl ? (
                              <div className="text-center p-4 sm:p-6">
                                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                  <Play className="w-10 h-10 text-red-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{currentDay.videoTitle}</h4>
                                <p className="text-gray-600 mb-6">Find the perfect tutorial for this lesson</p>
                                <a 
                                  href={currentDay.youtubeSearchUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                  Search YouTube Tutorials
                                </a>
                              </div>
                            ) : (
                              <div className="text-center p-4 sm:p-6">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                  <Play className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-lg text-gray-600 mb-2 font-medium">Video tutorial coming soon!</p>
                              </div>
                            )}
                            <div className="flex flex-wrap items-center mt-6 gap-4">
                              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                                Beginner Level
                              </span>
                            </div>
                          </div>
                        </section>

                        <section className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4 md:p-6">
                          <div className="flex items-center mb-3">
                            <div className="bg-purple-500 rounded-full p-1.5 mr-3">
                              <span className="text-white text-sm">📋</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-purple-900">What You Need</h3>
                          </div>
                          <div className="space-y-2">
                            {currentDay.checklist && currentDay.checklist.length > 0 ? currentDay.checklist.map((item, index) => (
                              <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="text-purple-600 text-xs">✓</span>
                                </div>
                                <span className="text-gray-800 text-base sm:text-sm font-medium">{item}</span>
                              </div>
                            )) : (
                              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                <p className="text-gray-600 text-sm sm:text-base">No checklist items for this day.</p>
                              </div>
                            )}
                          </div>
                        </section>

                        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
                          <div className="flex items-center mb-3">
                            <div className="bg-amber-500 rounded-full p-1.5 mr-3">
                              <span className="text-white text-sm">💡</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-amber-900">Success Tips</h3>
                          </div>
                          <div className="space-y-2">
                            {currentDay.tips && currentDay.tips.length > 0 ? currentDay.tips.map((tip, index) => (
                              <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start">
                                  <div className="bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    <span className="text-amber-600 text-xs">•</span>
                                  </div>
                                  <p className="text-gray-800 text-base sm:text-sm font-medium leading-relaxed">{tip}</p>
                                </div>
                              </div>
                            )) : (
                              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                <p className="text-gray-600 text-sm sm:text-base">No tips available for this day.</p>
                              </div>
                            )}
                          </div>
                        </section>

                        <section className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
                          <div className="flex items-center mb-3">
                            <div className="bg-red-500 rounded-full p-1.5 mr-3">
                              <span className="text-white text-sm">⚠️</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-red-900">Avoid These Mistakes</h3>
                          </div>
                          <div className="space-y-2">
                            {(currentDay.mistakesToAvoid && currentDay.mistakesToAvoid.length > 0
                              ? currentDay.mistakesToAvoid
                              : (currentDay.commonMistakes && currentDay.commonMistakes.length > 0
                                  ? currentDay.commonMistakes
                                  : [])
                            ).map((mistake: string, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-3 border-red-400">
                                <div className="flex items-start">
                                  <div className="bg-red-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    <span className="text-red-600 text-xs">•</span>
                                  </div>
                                  <p className="text-gray-800 text-base sm:text-sm font-medium leading-relaxed">{mistake}</p>
                                </div>
                              </div>
                            ))}
                            {(!currentDay.mistakesToAvoid || currentDay.mistakesToAvoid.length === 0) && (!currentDay.commonMistakes || currentDay.commonMistakes.length === 0) && (
                              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                <p className="text-gray-600 text-sm">No common mistakes listed for this day.</p>
                              </div>
                            )}
                          </div>
                        </section>

                        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6">
                          <div className="flex items-center mb-4">
                            <div className="bg-blue-500 rounded-full p-1.5 mr-3">
                              <span className="text-white text-sm">🔗</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-blue-900">Resources</h3>
                          </div>
                          <div className="space-y-3">
                            {currentDay.freeResources && currentDay.freeResources.length > 0 && (
                              currentDay.freeResources.map((resource, index) => (
                                <a
                                  key={index}
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block bg-white border border-blue-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all group"
                                >
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 rounded-full p-1.5 mr-3 group-hover:bg-blue-200 transition-colors flex-shrink-0">
                                      <ExternalLink className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="font-medium text-blue-700 group-hover:text-blue-800 text-sm leading-tight truncate">{resource.title}</h5>
                                      <p className="text-xs text-blue-600 mt-0.5">Free tutorial</p>
                                    </div>
                                  </div>
                                </a>
                              ))
                            )}
                            {currentDay.affiliateProducts && currentDay.affiliateProducts.length > 0 && (
                              currentDay.affiliateProducts.map((product, index) => {
                                const sanitizedTitle = String(product.title || '')
                                  .replace(/\bday\s*\d+\b/gi, '')
                                  .replace(/practice\s*bundle/gi, 'practice kit')
                                  .replace(/\s{2,}/g, ' ')
                                  .trim();
                                return (
                                  <a
                                    key={index}
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white border border-green-200 rounded-lg p-3 hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all group"
                                  >
                                    <div className="flex items-center">
                                      <div className="bg-green-100 rounded-full p-1.5 mr-3 group-hover:bg-green-200 transition-colors flex-shrink-0">
                                        <ExternalLink className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h5 className="font-medium text-green-700 group-hover:text-green-800 text-sm leading-tight truncate">{sanitizedTitle}</h5>
                                        <p className="text-xs text-green-600 mt-0.5">Recommended gear</p>
                                      </div>
                                    </div>
                                  </a>
                                );
                              })
                            )}
                          </div>
                        </section>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          ) : isGenerating ? (
            <div className="h-full w-full flex items-center justify-center p-6">
              <div className="w-full max-w-2xl">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#6366f1_0,transparent_40%),radial-gradient(circle_at_80%_0%,#a855f7_0,transparent_40%),radial-gradient(circle_at_0%_80%,#22d3ee_0,transparent_40%)] opacity-20" />
                  <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div style={{ transform: 'scale(0.6)' }}>
                        <Loader />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Creating your 7-day plan…</h3>
                        <p className="text-white/80 text-sm">This usually takes 20–60 seconds</p>
                      </div>
                    </div>

                    {/* Determinate progress bar with percent */}
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-white/90 rounded-full transition-[width] duration-200"
                        style={{ width: `${Math.max(0, Math.min(100, planProgressPercent))}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-white/80 mb-4">{Math.max(0, Math.min(100, Math.round(planProgressPercent)))}%</div>

                    {/* Steps */}
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white/20 text-white text-xs font-semibold">1</span>
                          <span className="font-semibold">Outlining</span>
                        </div>
                        <p className="text-xs text-white/80">Building your personalized day-by-day plan</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white/20 text-white text-xs font-semibold">2</span>
                          <span className="font-semibold">Finding videos</span>
                        </div>
                        <p className="text-xs text-white/80">Selecting a great tutorial for each day</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white/20 text-white text-xs font-semibold">3</span>
                          <span className="font-semibold">Final touches</span>
                        </div>
                        <p className="text-xs text-white/80">Adding tips, checklists and resources</p>
                      </div>
                    </div>

                    <p className="mt-6 text-xs text-white/70">Pro tip: You can keep browsing while we prepare your plan. This page will update automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-full p-4 lg:p-6">
              {isPlanRoute ? (
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="font-medium">Loading your plan…</span>
                </div>
              ) : (
                <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4 lg:mb-6">
                      <WizqoLogo width={80} height={46} />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">Learn a New Hobby in 7 Days</h2>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mx-auto mb-3" />
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Tell me which new hobby you want to master next, and I'll create a personalized 7-day plan with daily lessons and practice prompts. 
                      Your custom hobby roadmap will appear here as soon as we chat!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Pick Your Passion */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl">🧠</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Pick Your Passion</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">Choose from 1,000+ hobbies or type your own. Answer 3 quick questions about your experience and goals.</p>
                      </div>
                    </div>

                    {/* AI Creates Your Plan */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">AI Creates Your Plan</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">Our smart AI analyzes your inputs and generates a personalized 7-day learning roadmap just for you.</p>
                        <div className="mt-2 inline-flex items-center text-blue-600 text-xs font-medium">Powered by AI</div>
                      </div>
                    </div>

                    {/* Learn & Master */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col min-h-[240px]">
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30"></div>
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Learn & Master</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">Follow your daily lessons, track progress, and celebrate as you master your new hobby in just one week!</p>
                        <div className="mt-3 bg-white/60 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-medium text-slate-600">Day 5 of 7</span>
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {[1,2,3,4,5,6,7].map((d) => (
                              <div key={d} className={`w-3 h-3 rounded ${d <= 5 ? 'bg-green-400' : 'bg-slate-200'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">💬</span>
                      <h3 className="text-xl font-bold text-gray-900">How to Get Started</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">1</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Tell me your hobby</h4>
                          <p className="text-sm text-gray-600">Use the chat on the left to tell me what you want to learn.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">2</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Answer 3 questions</h4>
                          <p className="text-sm text-gray-600">Help me personalize your learning plan.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">3</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Start learning!</h4>
                          <p className="text-sm text-gray-600">Your custom 7-day plan will appear here.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Learning Paths</h3>
                    <p className="text-gray-600 mb-4">Not sure what to learn? Here are some popular hobbies to get started:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 lg:gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">📸</div><div className="text-xs font-medium text-gray-700">Photography</div></div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🎨</div><div className="text-xs font-medium text-gray-700">Painting</div></div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🍳</div><div className="text-xs font-medium text-gray-700">Cooking</div></div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">💻</div><div className="text-xs font-medium text-gray-700">Coding</div></div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🧶</div><div className="text-xs font-medium text-gray-700">Knitting</div></div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🏡</div><div className="text-xs font-medium text-gray-700">Gardening</div></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <Confetti isActive={true} onComplete={() => setShowConfetti(false)} />
        </div>
      )}
    </div>
  );
}
