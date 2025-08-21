
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
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

interface QuizAnswers {
  experience: string;
  timeAvailable: string;
  goal: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  options?: { value: string; label: string; description?: string }[];
  isTyping?: boolean;
  timestamp: Date;
  step?: 'hobby' | 'experience' | 'time' | 'goal';
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
  youtubeSearchUrl?: string;
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

interface SplitPlanInterfaceProps {
  onGeneratePlan: (hobby: string, answers: QuizAnswers) => Promise<any>;
  onNavigateBack: () => void;
  initialPlanData?: PlanData;
}

// Function to fix field mapping consistently across all plan data sources
const fixPlanDataFields = (plan: any) => {
  if (!plan) return plan;
  const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
  if (!daysArray || daysArray.length === 0) {
    return plan;
  }
  const fixedPlan = {
    ...plan,
    difficulty: plan.difficulty || plan.plan_data?.difficulty || 'beginner',
    overview: plan.overview || plan.plan_data?.overview || plan.description || `Learn ${plan.hobby} with this comprehensive plan`,
    totalDays: plan.totalDays || daysArray.length || 7,
    days: daysArray.map((day: any) => ({
      ...day,
      commonMistakes: (day.commonMistakes && day.commonMistakes.length > 0)
        ? day.commonMistakes
        : (day.mistakesToAvoid && day.mistakesToAvoid.length > 0)
          ? day.mistakesToAvoid
          : [
              'Rushing through exercises without understanding concepts',
              'Skipping practice time or cutting sessions short',
              'Not taking notes or tracking your improvement'
            ],
      youtubeVideoId: day.youtubeVideoId || (day.freeResources?.[0]?.link?.match(/v=([^&]+)/)?.[1]) || 'dQw4w9WgXcQ',
      videoTitle: day.videoTitle || `${plan.hobby || 'Tutorial'} - Day ${day.day}`
    }))
  };
  return fixedPlan;
};

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!initialPlanData) {
      return [{
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
      }];
    }
    return [];
  });
  const [currentInput, setCurrentInput] = useState('');
  const [selectedHobby, setSelectedHobby] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Partial<QuizAnswers>>({});
  const [currentStep, setCurrentStep] = useState<'hobby' | 'experience' | 'time' | 'goal' | 'generating'>('hobby');
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => { setIsTyping(false); }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [answeredSteps, setAnsweredSteps] = useState<Set<'hobby' | 'experience' | 'time' | 'goal'>>(() => new Set());
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  // Performance optimization: Memoize expensive calculations
  const progressPercentage = useMemo(() => 
    planData ? (completedDays.length / planData.totalDays) * 100 : 0, 
    [completedDays.length, planData?.totalDays]
  );
  useEffect(() => {
    if (planData) {
      const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lastViewedPlan', planId);
      localStorage.setItem('lastViewedPlanData', JSON.stringify(planData));
      sessionStorage.setItem('activePlanData', JSON.stringify(planData));
      sessionStorage.setItem('activePlanId', planId);
    }
  }, [planData]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { savePlan, saving } = usePlanStorage();
  const { user } = useAuth();
  useEffect(() => { if (user && showAuthModal) setShowAuthModal(false); }, [user]);

  const hobbyOptions = [
    { value: 'photography', label: 'Photography 📸', description: 'Capture amazing moments' },
    { value: 'guitar', label: 'Guitar 🎸', description: 'Strum your first songs' },
    { value: 'cooking', label: 'Cooking 👨‍🍳', description: 'Create delicious meals' },
    { value: 'drawing', label: 'Drawing 🎨', description: 'Express your creativity' },
    { value: 'yoga', label: 'Yoga 🧘', description: 'Find balance and peace' },
    { value: 'gardening', label: 'Gardening 🌱', description: 'Grow your own plants' },
    { value: 'coding', label: 'Coding 💻', description: 'Build your first app' },
    { value: 'dance', label: 'Dance 💃', description: 'Move to the rhythm' },
    { value: 'surprise', label: 'Surprise Me! 🎲', description: 'Let AI pick for me' }
  ];

  const surpriseHobbies = [
    'photography', 'smartphone photography', 'photo editing', 'video editing',
    'guitar', 'piano', 'ukulele', 'violin', 'drums', 'harmonica', 'singing',
    'music production', 'dj mixing', 'beatboxing',
    'cooking', 'baking', 'bread baking', 'sourdough', 'coffee brewing', 'latte art', 'tea tasting',
    'drawing', 'sketching', 'painting', 'watercolor', 'acrylic painting', 'oil painting',
    'calligraphy', 'hand lettering', 'graphic design', 'logo design', 'animation', '3d modeling',
    'origami', 'paper crafts', 'pottery', 'ceramics', 'woodworking', 'carpentry', 'leathercraft',
    'knitting', 'crochet', 'sewing', 'embroidery', 'quilting', 'quilling', 'jewelry making',
    'candle making', 'soap making', 'resin art',
    'gardening', 'indoor plants', 'succulents', 'bonsai', 'terrarium building',
    'yoga', 'meditation', 'pilates', 'calisthenics', 'weight training',
    'running', 'cycling', 'hiking', 'swimming', 'jump rope',
    'table tennis', 'badminton', 'basketball shooting', 'football juggling',
    'chess', 'rubiks cube', 'speed cubing', 'sudoku', 'crossword puzzles',
    'blogging', 'journaling', 'creative writing', 'poetry', 'public speaking',
    'coding', 'web development', 'app development', 'game development',
    'bird watching', 'astronomy', 'stargazing', 'kite flying', 'calligraphy practice', 'reading'
  ];
  const surpriseAnswers: QuizAnswers = { experience: 'beginner', timeAvailable: '1 hour', goal: 'personal enjoyment' };

  useEffect(() => {
    if (initialPlanData) {
      const fixedPlanData = fixPlanDataFields(initialPlanData);
      setPlanData(fixedPlanData);
    }
  }, [initialPlanData]);

  useEffect(() => {
    if (user && initialPlanData && initialPlanData.hobby) {
      const findPlanId = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            }
          });
          if (response.ok) {
            const allPlans = await response.json();
            const supabasePlans = allPlans?.filter((p: any) => {
              if (p.title) {
                const titleMatch = p.title.match(/Learn (\w+) in/i);
                const extractedHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
                return extractedHobby === initialPlanData.hobby;
              }
              return false;
            }) || [];
            if (supabasePlans && supabasePlans.length > 0) {
              const mostRecentPlan = supabasePlans[0];
              setCurrentPlanId(mostRecentPlan.id.toString());
              const progressResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${user.id}`, {
                headers: {
                  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                }
              });
              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                if (progressData && progressData.length > 0) {
                  const progress = progressData[0];
                  setCompletedDays(progress.completed_days || []);
                  setSelectedDay(progress.current_day || 1);
                } else {
                  const sessionKey = `progress_${user.id}_${mostRecentPlan.id}`;
                  const sessionProgress = sessionStorage.getItem(sessionKey);
                  if (sessionProgress) {
                    try {
                      const progress = JSON.parse(sessionProgress);
                      setCompletedDays(progress.completed_days || []);
                      setSelectedDay(progress.current_day || 1);
                    } catch {}
                  }
                }
              }
            }
          }
        } catch {}
      };
      findPlanId();
    }
  }, [user, initialPlanData]);

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
        setMessages([welcomeMessage]);
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
      setCurrentStep('generating');
      setIsGenerating(false);
    }
  }, [initialPlanData]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const highlightHobby = (text: string, hobby: string) => {
    return text.replace(new RegExp(`(${hobby})`, 'gi'), '<span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg font-semibold shadow-sm">$1</span>');
  };

  const validateAndProcessHobby = (input: string): { isValid: boolean; detectedHobbies?: string[]; suggestions?: string[]; unsafe?: boolean; reason?: string } => {
    const SAFE_HOBBIES = Array.from(new Set([
      'photography','smartphone photography','photo editing','video editing',
      'guitar','piano','ukulele','violin','drums','harmonica','singing','music production','dj mixing','beatboxing',
      'cooking','baking','bread baking','sourdough','coffee brewing','latte art','tea tasting',
      'drawing','sketching','painting','watercolor','acrylic painting','oil painting','calligraphy','hand lettering','graphic design','logo design','animation','3d modeling',
      'origami','paper crafts','pottery','ceramics','woodworking','carpentry','leathercraft','knitting','crochet','sewing','embroidery','quilting','quilling','jewelry making',
      'candle making','soap making','resin art','gardening','indoor plants','succulents','bonsai','terrarium building',
      'yoga','meditation','pilates','calisthenics','weight training','running','cycling','hiking','swimming','jump rope',
      'table tennis','badminton','basketball shooting','football juggling','chess','rubiks cube','speed cubing','sudoku','crossword puzzles',
      'blogging','journaling','creative writing','poetry','public speaking','language learning','spanish language','french language','german language','japanese language','korean language',
      'coding','web development','app development','game development','bird watching','astronomy','stargazing','kite flying','calligraphy practice','reading'
    ]));

    const SYNONYMS: Record<string, string> = {
      'art':'drawing', 'sketch':'sketching', 'photos':'photography','camera':'photography','photo':'photography',
      'chef':'cooking','recipes':'cooking','cook':'cooking','dev':'coding','development':'coding','software':'coding',
      'write':'creative writing','blog':'blogging','blogging':'blogging','speak':'public speaking',
      'arabic':'language learning','quran':'reading','holy book':'reading','holybook':'reading'
    };

    const BANNED = [
      'sex','sexual','porn','pornography','nsfw','nude','erotic','fetish','escort','prostitution','blowjob','anal','rape','incest','hentai',
      'drug','cocaine','heroin','meth','weed','marijuana','steroid','mdma','lsd','psychedelic','suicide','self-harm','bomb','weapon','gun','kill','murder'
    ];

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const text = normalize(input);

    // Safety check
    for (const term of BANNED) {
      if (text.includes(term)) {
        return {
          isValid: false,
          unsafe: true,
          reason: 'unsafe',
          suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding']
        };
      }
    }

    // Extract candidates (split by delimiters and handle multi-words)
    const rawTokens = text.split(/[,/&]|\band\b|\bwith\b|\bfor\b/).map(t => normalize(t)).filter(Boolean);
    const candidates: string[] = [];
    for (const token of rawTokens) {
      if (!token) continue;
      // direct match
      if (SAFE_HOBBIES.includes(token)) candidates.push(token);
      // synonym map by words
      const words = token.split(' ');
      for (const w of words) {
        if (SYNONYMS[w]) candidates.push(SYNONYMS[w]);
      }
      // generate bigrams/trigrams to catch multi-word hobbies
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= Math.min(words.length, i + 3); j++) {
          const phrase = words.slice(i, j).join(' ');
          if (SAFE_HOBBIES.includes(phrase)) candidates.push(phrase);
        }
      }
    }

    // Fuzzy match helper
    const editDistance = (a: string, b: string) => {
      const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
      return dp[a.length][b.length];
    };
    const fuzzySuggest = (phrase: string): string | null => {
      let best: { h: string; d: number } | null = null;
      for (const h of SAFE_HOBBIES) {
        const d = editDistance(phrase, h);
        if (!best || d < best.d) best = { h, d };
      }
      if (best && best.d <= Math.max(1, Math.floor(best.h.length * 0.25))) return best.h;
      return null;
    };

    // If nothing detected, try fuzzy suggestions
    let detected = Array.from(new Set(candidates));
    if (detected.length === 0) {
      const words = text.split(' ');
      const phrases = new Set<string>();
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= Math.min(words.length, i + 3); j++) {
          const p = words.slice(i, j).join(' ');
          if (p.length > 2) phrases.add(p);
        }
      }
      const sug: string[] = [];
      for (const p of phrases) {
        const s = fuzzySuggest(p);
        if (s && !sug.includes(s)) sug.push(s);
        if (sug.length >= 5) break;
      }
      if (sug.length > 0) return { isValid: false, suggestions: sug };
    }

    // Vague input handling
    const vagueTerms = ['fun','interesting','creative','cool','nice','good'];
    if (vagueTerms.some(term => text.includes(term)) && detected.length === 0) {
      return { isValid: false, suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding'] };
    }

    // Block arbitrary alphabetic strings (like "haaa", "test", etc.)
    const isArbitraryString = (str: string) => {
      // Check if it's just repeated characters or random letters
      const uniqueChars = new Set(str.split(''));
      const isRepeated = uniqueChars.size <= 2 && str.length > 3;
      const isRandomLetters = /^[a-z]{3,}$/.test(str) && !SAFE_HOBBIES.some(hobby => 
        hobby.includes(str) || str.includes(hobby) || editDistance(str, hobby) <= 2
      );
      return isRepeated || isRandomLetters;
    };

    if (detected.length === 0 && isArbitraryString(text)) {
      return { 
        isValid: false, 
        suggestions: ['photography','guitar','cooking','drawing','yoga','gardening','coding','reading','writing','meditation'] 
      };
    }

    return { isValid: detected.length > 0, detectedHobbies: detected };
  };

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  const addAIMessage = (content: string, options?: { value: string; label: string; description?: string }[], delay = 1000, step?: 'hobby' | 'experience' | 'time' | 'goal') => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: ChatMessage = { id: Date.now().toString(), sender: 'ai', content, options, timestamp: new Date(), step };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, delay);
    }, 300);
  };

  const handleSurpriseMe = async () => {
    const randomHobby = surpriseHobbies[Math.floor(Math.random() * surpriseHobbies.length)];
    addUserMessage("Surprise Me! 🎲");
    addAIMessage(`Perfect! I've chosen ${highlightHobby(randomHobby, randomHobby)} for you. Creating your 7-day plan now... ✨`, undefined, 800);
    setSelectedHobby(randomHobby);
    setQuizAnswers(surpriseAnswers);
    setCurrentStep('generating');
    setIsGenerating(true);
    try {
      const plan = await onGeneratePlan(randomHobby, surpriseAnswers);
      const correctedPlanData = fixPlanDataFields(plan);
      setPlanData(correctedPlanData);
      if (user?.id) {
        try {
          const planDataWithCorrectFields = fixPlanDataFields(plan);
          const savedPlan = await hobbyPlanService.savePlan({ hobby: randomHobby, title: plan.title, overview: plan.overview, plan_data: planDataWithCorrectFields }, user.id);
          setCurrentPlanId(savedPlan.id.toString());
          await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
          addAIMessage(`Your ${randomHobby} plan is ready and saved! 🎉 Check it out on the right side. Your progress will be tracked automatically!`, undefined, 500);
          setShowQuickReplies(true);
        } catch (saveError) {
          addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Progress tracking is unavailable right now, but you can still use your plan!`, undefined, 500);
        }
      } else {
        addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Sign up to save your progress!`, undefined, 500);
      }
    } catch (error) {
      addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = async (value: string, label: string) => {
    // Prevent double-clicks on the same step
    if (answeredSteps.has(currentStep as any)) {
      return;
    }
    if (value === 'surprise') {
      await handleSurpriseMe();
      return;
    }
    addUserMessage(label);
    if (currentStep === 'hobby') {
      setSelectedHobby(value);
      setAnsweredSteps(prev => new Set(prev).add('hobby'));
      setCurrentStep('experience');
      const experienceOptions = [
        { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
        { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
        { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
      ];
                        addAIMessage(`Great choice! ${highlightHobby(value, value)} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions, 1000, 'experience');
    } else if (currentStep === 'experience') {
      setQuizAnswers(prev => ({ ...prev, experience: value }));
      setAnsweredSteps(prev => new Set(prev).add('experience'));
      setCurrentStep('time');
      const timeOptions = [
        { value: '30 minutes', label: '30 minutes/day', description: 'Quick daily sessions' },
        { value: '1 hour', label: '1 hour/day', description: 'Solid practice time' },
        { value: '2+ hours', label: '2+ hours/day', description: 'Deep dive sessions' }
      ];
      addAIMessage("Got it! How much time can you spend learning each day?", timeOptions, 1000, 'time');
    } else if (currentStep === 'time') {
      setQuizAnswers(prev => ({ ...prev, timeAvailable: value }));
      setAnsweredSteps(prev => new Set(prev).add('time'));
      setCurrentStep('goal');
      const goalOptions = [
        { value: 'personal enjoyment', label: 'Personal Enjoyment', description: 'Just for fun and relaxation' },
        { value: 'skill building', label: 'Skill Building', description: 'Develop expertise and technique' },
        { value: 'social connection', label: 'Social Connection', description: 'Meet people and share experiences' },
        { value: 'career change', label: 'Career Change', description: 'Explore new professional paths' }
      ];
      addAIMessage("Perfect! What's your main goal for learning this hobby?", goalOptions, 1000, 'goal');
    } else if (currentStep === 'goal') {
      const finalAnswers = { ...quizAnswers, goal: value } as QuizAnswers;
      setQuizAnswers(finalAnswers);
      setAnsweredSteps(prev => new Set(prev).add('goal'));
      setCurrentStep('generating');
      setIsGenerating(true);
      addAIMessage(`Perfect! Creating your personalized ${selectedHobby} plan now... ✨`);
      try {
        const plan = await onGeneratePlan(selectedHobby, finalAnswers);
        const fixedStandardPlan = fixPlanDataFields(plan);
        setPlanData(fixedStandardPlan);
        if (user?.id) {
          try {
            const savedPlan = await hobbyPlanService.savePlan({ hobby: selectedHobby, title: plan.title, overview: plan.overview, plan_data: plan }, user.id);
            setCurrentPlanId(savedPlan.id.toString());
            await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
            setTimeout(async () => { await loadProgressFromDatabase(savedPlan.id); }, 500);
            addAIMessage(`Your ${selectedHobby} plan is ready and saved! 🎉 Your progress will be tracked automatically. Need help with anything? Just ask!`);
          setShowQuickReplies(true);
          } catch (saveError) {
            let errorMessage = `Your ${selectedHobby} plan is ready! 🎉 Note: Progress tracking is temporarily unavailable, but you can still use your plan.`;
            addAIMessage(errorMessage + ' Need help with anything? Just ask!');
          }
        } else {
          addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Sign up to save your progress and unlock advanced features. Need help with anything? Just ask!`);
        }
      } catch (error) {
        addAIMessage("Sorry, I had trouble creating your plan. Let me try again!");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    const userInput = currentInput.trim();
    addUserMessage(userInput);
    setCurrentInput('');
    if (currentStep === 'hobby') {
      const validation = validateAndProcessHobby(userInput);
      if ((validation as any).unsafe) {
        addAIMessage("I can't help with adult, illegal, or dangerous topics. Please choose a safe, family-friendly hobby like photography, guitar, cooking, drawing, yoga, gardening, or coding.");
        return;
      }
      if (validation.isValid && validation.detectedHobbies) {
        if (validation.detectedHobbies.length === 1) {
          const hobby = validation.detectedHobbies[0];
          setSelectedHobby(hobby);
          setAnsweredSteps(prev => new Set(prev).add('hobby'));
          setCurrentStep('experience');
          const experienceOptions = [
            { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
            { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
            { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
          ];
          addAIMessage(`Great choice! ${hobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions, 1000, 'experience');
        } else {
          const hobbyOptions = validation.detectedHobbies.map(h => ({ value: h, label: `🎨 Start with ${h.charAt(0).toUpperCase() + h.slice(1)}`, description: `Focus on ${h} first` }));
          addAIMessage(`I found multiple hobbies! Which one would you like to start with?`, hobbyOptions, 1000, 'hobby');
        }
      } else {
        const fallbackList = (validation.suggestions && validation.suggestions.length > 0)
          ? validation.suggestions.slice(0, 8)
          : ['photography','guitar','cooking','drawing','yoga','gardening','coding','language learning'];
        const suggestionOptions = fallbackList.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1), description: 'Explore this hobby' }));
        addAIMessage("I didn't quite catch that hobby. Did you mean one of these?", suggestionOptions, 800, 'hobby');
      }
    } else {
      // Post-plan smart chat with server AI
      try {
        const resp = await fetch('/api/hobby-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userInput,
            hobby: selectedHobby || planData?.hobby || '',
            plan: planData || null
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          addAIMessage(data?.reply || "I'm here to help. What would you like to know about your hobby?");
        } else {
          addAIMessage("I'm here to help. What would you like to know about your hobby?");
        }
      } catch {
        addAIMessage("I'm here to help. What would you like to know about your hobby?");
      }
    }
  };

  const loadProgressFromDatabase = async (planId: string) => {
    if (!user?.id) return;
    try {
      const sessionKey = `progress_${user.id}_${planId}`;
      const sessionProgress = sessionStorage.getItem(sessionKey);
      if (sessionProgress) {
        try {
          const progress = JSON.parse(sessionProgress);
          setCompletedDays(progress.completed_days || []);
          setSelectedDay(progress.current_day || 1);
          return;
        } catch {}
      }
      const { data: progressData, error } = await apiService.getUserProgress(user.id);
      if (!error && progressData) {
        const planProgress = progressData.find((p: any) => String(p.plan_id) === String(planId));
        if (planProgress) {
          setCompletedDays(planProgress.completed_days || []);
          setSelectedDay(planProgress.current_day || 1);
        }
      }
    } catch {}
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => {
    if (dayNumber === 1) return true;
    return user && isDayCompleted(dayNumber - 1);
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
            throw error;
          }
        }
      } else {
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);
        if (user?.id && currentPlanId) {
          try {
            await hobbyPlanService.completeDay(user.id, currentPlanId, dayNumber);
          } catch (error) {
            throw error;
          }
        }
        if (dayNumber === 1 && !user) {
          addAIMessage("🎉 Well done! Day 1 completed! Sign up to unlock Days 2-7 and track your progress.", [], 500);
          setShowAuthModal(true);
        } else if (dayNumber === 7) {
          addAIMessage("🎊 Congratulations! You've completed your 7-day learning journey! You're amazing!", [], 500);
          setShowConfetti(true);
        } else if (user) {
          addAIMessage(`Great job! Day ${dayNumber} completed. Keep up the excellent work!`, [], 500);
          setShowConfetti(true);
        }
      }
    } catch {
      addAIMessage("Sorry, there was an error saving your progress. Please try again.", [], 500);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
    const isCompleted = isDayCompleted(dayNumber);
    if (isCompleted) return 'completed';
    if (dayNumber === 1) return 'unlocked';
    if (dayNumber === 2 && !user) return 'unlocked';
    if (dayNumber > 2 && !user) return 'locked';
    if (isDayUnlocked(dayNumber)) return 'unlocked';
    return 'locked';
  };



  return (
    <div className="min-h-screen bg-slate-50">
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <title>{planData ? `${planData.title} - Learn ${planData.hobby} in 7 Days` : 'Learn Any Hobby in 7 Days - Personalized Learning Plans'}</title>
        <meta name="description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan. Step-by-step guidance, daily tasks, and expert tips to help you succeed.` : 'Transform your life with personalized 7-day learning plans for any hobby. From photography to coding, get expert guidance and achieve your goals faster.'} />
        <meta name="keywords" content={planData ? `${planData.hobby}, learning, 7-day plan, tutorial, skills, personal development` : 'hobby learning, 7-day plans, personal development, skill building, tutorials'} />
        <meta property="og:title" content={planData ? `Learn ${planData.hobby} in 7 Days` : 'Learn Any Hobby in 7 Days'} />
        <meta property="og:description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan.` : 'Transform your life with personalized 7-day learning plans for any hobby.'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={planData ? `Learn ${planData.hobby} in 7 Days` : 'Learn Any Hobby in 7 Days'} />
        <meta name="twitter:description" content={planData ? `Master ${planData.hobby} with our personalized 7-day learning plan.` : 'Transform your life with personalized 7-day learning plans for any hobby.'} />
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
            <h2 className="text-lg font-semibold text-gray-900">Learning Assistant</h2>
            <p className="text-sm text-gray-600">Your personal hobby guide</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-200px)]">
            {messages.length === 0 && (
                          <div className="text-center text-gray-500 p-4">
              <div className="lg:hidden mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Start Your Learning Journey</h3>
                <p className="text-sm text-gray-600">Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you!</p>
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
                          className={`px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full transition-all duration-200 shadow-sm ${isDisabledForStep || isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'}`}
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

          {/* Quick Reply Buttons */}
          {showQuickReplies && planData && (
            <div className="p-4 lg:p-6 border-t border-gray-200 bg-blue-50">
              <p className="text-sm text-gray-600 mb-3">💡 Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCurrentInput("How do I get started with today's lesson?");
                    setShowQuickReplies(false);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                >
                  How do I get started?
                </button>
                <button
                  onClick={() => {
                    setCurrentInput("What if I miss a day?");
                    setShowQuickReplies(false);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                >
                  What if I miss a day?
                </button>
                <button
                  onClick={() => {
                    setCurrentInput("How long should I practice each day?");
                    setShowQuickReplies(false);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                >
                  How long to practice?
                </button>
                <button
                  onClick={() => {
                    setCurrentInput("Can I modify this plan?");
                    setShowQuickReplies(false);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Can I modify the plan?
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                                  <Input
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setCurrentInput(value);
                      }
                    }}
                    placeholder="Ask me anything about your plan..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 pr-12"
                    maxLength={50}
                    aria-label="Chat message input"
                    aria-describedby="char-counter"
                  />
                <div 
                  id="char-counter"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                    currentInput.length >= 45 ? 'text-red-500' : 
                    currentInput.length >= 35 ? 'text-yellow-500' : 
                    'text-gray-400'
                  }`}
                  aria-live="polite"
                  aria-label={`${currentInput.length} of 50 characters used`}
                >
                  {currentInput.length}/50
                </div>
              </div>
              <Button 
                onClick={handleSendMessage} 
                size="sm" 
                className="px-4"
                disabled={!currentInput.trim() || currentInput.length === 0}
              >
                <Send className="w-4 h-4" />
              </Button>
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
                        {planData.totalDays} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4 lg:mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{completedDays.length}/{planData.totalDays} days completed</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
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
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Select Day</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: planData?.totalDays || 7 }, (_, i) => i + 1).map((dayNum) => {
                    const status = getDayStatus(dayNum);
                    const isSelected = selectedDay === dayNum;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => {
                          if (dayNum > 1 && !user) {
                            setShowAuthModal(true);
                          } else {
                            setSelectedDay(dayNum);
                          }
                        }}
                        disabled={false}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center relative ${
                          isSelected 
                            ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                            : status === 'completed' 
                              ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                              : status === 'unlocked' 
                                ? 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200' 
                                : 'bg-gray-50 text-gray-400 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                        aria-label={`Day ${dayNum} - ${status === 'completed' ? 'Completed' : status === 'unlocked' ? 'Available' : 'Locked'}`}
                        aria-pressed={isSelected}
                      >
                        {dayNum}
                        {status === 'completed' && (
                          <CheckCircle className="w-3 h-3 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                        {status === 'locked' && (
                          <Lock className="w-3 h-3 text-gray-400 absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Content */}
              {(() => {
                const currentDay = planData?.days?.find((day: any) => day.day === selectedDay);
                const status = getDayStatus(selectedDay);
                if (!currentDay || status === 'locked' || !planData?.days) {
                  return (
                    <Card className="p-8 text-center">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Day {selectedDay} Locked</h3>
                      <p className="text-gray-600">Complete previous days to unlock this content.</p>
                    </Card>
                  );
                }
                return (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                            Day {currentDay.day}: {currentDay.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Main Focus</p>
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
                      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-8 md:p-12">
                        <div className="max-w-4xl">
                          <div className="flex items-center mb-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                              <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Today's Learning Goal</h2>
                          </div>
                          <p className="text-xl md:text-2xl leading-relaxed font-medium text-blue-50 mb-6">
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
                        <section className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8">
                          <div className="flex items-center mb-6">
                            <div className="bg-green-500 rounded-full p-2 mr-4">
                              <span className="text-white text-xl">📚</span>
                            </div>
                            <h3 className="text-2xl font-bold text-green-900">Why This Matters</h3>
                          </div>
                          <p className="text-lg text-green-800 leading-relaxed">
                            {currentDay.explanation}
                          </p>
                        </section>

                        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex items-center mb-6">
                            <div className="bg-indigo-500 rounded-full p-2 mr-4">
                              <span className="text-white text-xl">🔍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Step-by-Step Guide</h3>
                          </div>
                          <div className="space-y-4">
                            {currentDay.howTo.map((step, index) => (
                              <div key={index} className="flex items-start group hover:bg-gray-50 rounded-xl p-4 transition-colors">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4 mt-0.5 flex-shrink-0 shadow-lg">
                                  {index + 1}
                                </div>
                                <div className="text-gray-800 leading-relaxed text-lg flex-1">{step}</div>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 md:p-8">
                          <div className="flex items-center mb-6">
                            <div className="bg-red-500 rounded-full p-2 mr-4">
                              <span className="text-white text-xl">📺</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Watch Today's Video Tutorial</h3>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-sm">
                            {currentDay.youtubeVideoId ? (
                              <YouTubeEmbed 
                                videoId={currentDay.youtubeVideoId}
                                title={currentDay.videoTitle || `${currentDay.title} Tutorial`}
                                className="mb-4 rounded-xl overflow-hidden"
                              />
                            ) : currentDay.youtubeSearchUrl ? (
                              <div className="text-center p-8">
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
                              <div className="text-center p-8">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                  <Play className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-lg text-gray-600 mb-2 font-medium">Video tutorial coming soon!</p>
                              </div>
                            )}
                            <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-5 h-5 mr-2" />
                                <span className="font-medium">Duration: {currentDay.estimatedTime || 'TBD'}</span>
                              </div>
                              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                                Beginner Level
                              </span>
                            </div>
                          </div>
                        </section>

                        <section className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6">
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
                                <span className="text-gray-800 text-sm font-medium">{item}</span>
                              </div>
                            )) : (
                              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                <p className="text-gray-600 text-sm">No checklist items for this day.</p>
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
                                    <span className="text-amber-600 text-xs">💡</span>
                                  </div>
                                  <p className="text-gray-800 text-sm font-medium leading-relaxed">{tip}</p>
                                </div>
                              </div>
                            )) : (
                              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                <p className="text-gray-600 text-sm">No tips available for this day.</p>
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
                            {currentDay.commonMistakes && currentDay.commonMistakes.length > 0 ? currentDay.commonMistakes.map((mistake: string, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-3 border-red-400">
                                <div className="flex items-start">
                                  <div className="bg-red-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    <span className="text-red-600 text-xs">⚠️</span>
                                  </div>
                                  <p className="text-gray-800 text-sm font-medium leading-relaxed">{mistake}</p>
                                </div>
                              </div>
                            )) : (
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
                              currentDay.affiliateProducts.map((product, index) => (
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
                                      <h5 className="font-medium text-green-700 group-hover:text-green-800 text-sm leading-tight truncate">{product.title}</h5>
                                      <p className="text-xs text-green-600 mt-0.5">Recommended gear</p>
                                    </div>
                                  </div>
                                </a>
                              ))
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

                    {/* Animated progress bar */}
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-6">
                      <div className="h-full w-2/3 bg-white/90 rounded-full animate-[loading_1.4s_ease_infinite]" style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.1) 100%)',
                        backgroundSize: '200% 100%'
                      }} />
                    </div>

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
              <div className="max-w-2xl mx-auto space-y-4 lg:space-y-6">
                <div className="text-center">
                  <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">🎯</div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Welcome to Your Learning Journey!</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. 
                    Your custom learning plan will appear here once we chat!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-3xl mb-3">🎨</div>
                    <h3 className="font-bold text-gray-900 mb-2">Personalized Plans</h3>
                    <p className="text-sm text-gray-600">Every plan is tailored to your experience level, available time, and specific goals.</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-3xl mb-3">📚</div>
                    <h3 className="font-bold text-gray-900 mb-2">Structured Learning</h3>
                    <p className="text-sm text-gray-600">Daily lessons with tips, checklists, and resources to guide your progress step by step.</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-bold text-gray-900 mb-2">Quick Results</h3>
                    <p className="text-sm text-gray-600">See real progress in just 7 days with our proven methodology and expert guidance.</p>
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
                        <p className="text-sm text-gray-600">Use the chat on the left to tell me what you want to learn</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">2</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Answer 3 questions</h4>
                        <p className="text-sm text-gray-600">Help me personalize your learning plan</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">3</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Start learning!</h4>
                        <p className="text-sm text-gray-600">Your custom 7-day plan will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Learning Paths</h3>
                  <p className="text-gray-600 mb-4">Not sure what to learn? Here are some popular hobbies our AI has created amazing plans for:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 lg:gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">📸</div><div className="text-xs font-medium text-gray-700">Photography</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🎨</div><div className="text-xs font-medium text-gray-700">Painting</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🍳</div><div className="text-xs font-medium text-gray-700">Cooking</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">💻</div><div className="text-xs font-medium text-gray-700">Coding</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🧶</div><div className="text-xs font-medium text-gray-700">Knitting</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🏡</div><div className="text-xs font-medium text-gray-700">Gardening</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">✍️</div><div className="text-xs font-medium text-gray-700">Writing</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">♟️</div><div className="text-xs font-medium text-gray-700">Chess</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🎸</div><div className="text-xs font-medium text-gray-700">Guitar</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🧘</div><div className="text-xs font-medium text-gray-700">Yoga</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">📚</div><div className="text-xs font-medium text-gray-700">Reading</div></div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-2xl mb-1">🏃</div><div className="text-xs font-medium text-gray-700">Running</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Confetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
}
