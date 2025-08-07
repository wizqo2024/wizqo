import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, Send, Play, MessageCircle, Star, Lightbulb, Target, Trophy, X, AlertTriangle, Ban, StopCircle, XCircle } from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { apiService } from '@/lib/api-service';
import { supabase } from '@/lib/supabase';

// Automated hobby image system (same as Dashboard)
const getHobbyImage = (hobby: string): string => {
  const normalizedHobby = hobby?.toLowerCase() || '';
  console.log(`🎨 Plan AUTO-IMAGE: "${hobby}" -> category-based generation`);
  
  // Automated categorization and image selection (same logic as Dashboard)
  const getImageByCategory = (hobbyName: string): string => {
    // Technology hobbies
    if (hobbyName.includes('cod') || hobbyName.includes('program') || hobbyName.includes('develop') || hobbyName.includes('tech') || hobbyName.includes('edit')) {
      const techImages = [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop'
      ];
      const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return techImages[hash % techImages.length];
    }
    
    // Creative arts and crafts - comprehensive coverage
    if (hobbyName.includes('art') || hobbyName.includes('draw') || hobbyName.includes('paint') || hobbyName.includes('music') || hobbyName.includes('photo') || 
        hobbyName.includes('craft') || hobbyName.includes('embroidery') || hobbyName.includes('knit') || hobbyName.includes('sew') || 
        hobbyName.includes('candle') || hobbyName.includes('jewelry') || hobbyName.includes('pottery') || hobbyName.includes('wood') ||
        hobbyName.includes('crochet') || hobbyName.includes('calligraphy') || hobbyName.includes('quill') || hobbyName.includes('origami') ||
        hobbyName.includes('macramé') || hobbyName.includes('upcycl') || hobbyName.includes('watercolor') || hobbyName.includes('diamond') ||
        hobbyName.includes('pour') || hobbyName.includes('scrapbook') || hobbyName.includes('soap') || hobbyName.includes('leather') ||
        hobbyName.includes('street') || hobbyName.includes('digital') || hobbyName.includes('mug') || hobbyName.includes('nail') ||
        hobbyName.includes('floral') || hobbyName.includes('miniature') || hobbyName.includes('bullet') || hobbyName.includes('writing') ||
        hobbyName.includes('song') || hobbyName.includes('acting') || hobbyName.includes('improv') || hobbyName.includes('comedy') ||
        hobbyName.includes('sketch') || hobbyName.includes('cosplay') || hobbyName.includes('vintage') || hobbyName.includes('collect')) {
      const creativeImages = [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1559622214-2d1b21d5ab7e?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=240&fit=crop'
      ];
      const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return creativeImages[hash % creativeImages.length];
    }
    
    // Culinary and food - comprehensive coverage
    if (hobbyName.includes('cook') || hobbyName.includes('bak') || hobbyName.includes('food') ||
        hobbyName.includes('mixology') || hobbyName.includes('ferment') || hobbyName.includes('cheese') ||
        hobbyName.includes('brew') || hobbyName.includes('kombucha') || hobbyName.includes('drink')) {
      const culinaryImages = [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop'
      ];
      const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return culinaryImages[hash % culinaryImages.length];
    }
    
    // Fitness and movement - comprehensive coverage
    if (hobbyName.includes('fitness') || hobbyName.includes('yoga') || hobbyName.includes('exercise') || hobbyName.includes('sport') ||
        hobbyName.includes('pilates') || hobbyName.includes('aerial') || hobbyName.includes('hula') || hobbyName.includes('jump') ||
        hobbyName.includes('krav') || hobbyName.includes('boxing') || hobbyName.includes('capoeira') || hobbyName.includes('dance') ||
        hobbyName.includes('tai chi') || hobbyName.includes('martial') || hobbyName.includes('climb') || hobbyName.includes('parkour') ||
        hobbyName.includes('rollerblade') || hobbyName.includes('skateboard') || hobbyName.includes('fencing') || hobbyName.includes('archery')) {
      const fitnessImages = [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1571019613540-996a69c42d3f?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=240&fit=crop'
      ];
      const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return fitnessImages[hash % fitnessImages.length];
    }
    
    // Default learning category
    const learningImages = [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7a7cc52?w=400&h=240&fit=crop'
    ];
    const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return learningImages[hash % learningImages.length];
  };
  
  const selectedImage = getImageByCategory(normalizedHobby);
  console.log(`🎨 Plan AUTO-GENERATED: "${hobby}" -> unique category-based image`);
  
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60));
  const finalImage = `${selectedImage}&t=${timestamp}`;
  console.log(`🎨 Plan FINAL IMAGE: ${finalImage}`);
  return finalImage;
};

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
  commonMistakes?: string[];
  freeResources: { title: string; link: string }[];
  affiliateProducts: { title: string; link: string; price: string }[];
  youtubeVideoId?: string;
  youtubeSearchUrl?: string;
  videoTitle?: string;
  estimatedTime: string;
  skillLevel: string;
}

interface PlanData {
  id?: string;
  planId?: string;
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
  initialPlanData?: PlanData & { id?: string; planId?: string };
}

// Function to fix field mapping consistently across all plan data sources
const fixPlanDataFields = (plan: any) => {
  if (!plan) return plan;
  
  // Extract days array from various possible nested structures
  const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
  
  console.log('🔍 fixPlanDataFields - Examining data structure:');
  console.log('🔍 plan.days length:', plan.days?.length || 0);
  console.log('🔍 plan.plan_data?.days length:', plan.plan_data?.days?.length || 0);
  console.log('🔍 plan.plan_data?.plan_data?.days length:', plan.plan_data?.plan_data?.days?.length || 0);
  console.log('🔍 First day youtubeVideoId from different paths:');
  console.log('🔍   plan.days?.[0]?.youtubeVideoId:', plan.days?.[0]?.youtubeVideoId);
  console.log('🔍   plan.days?.[0]?.videoId:', plan.days?.[0]?.videoId);
  console.log('🔍   plan.plan_data?.days?.[0]?.youtubeVideoId:', plan.plan_data?.days?.[0]?.youtubeVideoId);
  console.log('🔍   plan.plan_data?.plan_data?.days?.[0]?.youtubeVideoId:', plan.plan_data?.plan_data?.days?.[0]?.youtubeVideoId);
  
  // LOG COMPLETE FIRST DAY TO SEE ALL FIELDS
  if (plan.days?.[0]) {
    console.log('🔍 COMPLETE FIRST DAY FRONTEND DATA:', JSON.stringify(plan.days[0], null, 2));
    console.log('🔍 FRONTEND - All keys in first day:', Object.keys(plan.days[0]));
    console.log('🔍 FRONTEND - youtubeVideoId value type:', typeof plan.days[0].youtubeVideoId);
    console.log('🔍 FRONTEND - videoId value type:', typeof plan.days[0].videoId);
  }
  
  console.log('🔧 fixPlanDataFields - Input plan structure:', {
    hasDays: !!plan.days,
    hasPlanData: !!plan.plan_data,
    hasPlanDataDays: !!plan.plan_data?.days,
    daysArrayLength: daysArray.length
  });
  
  if (!daysArray || daysArray.length === 0) {
    console.warn('🔧 fixPlanDataFields - No days array found in plan data');
    return plan;
  }
  
  const fixedPlan = {
    ...plan,
    // Preserve important top-level fields from backend
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
      // CRITICAL: Preserve unique YouTube video IDs from backend - never override with undefined
      youtubeVideoId: day.youtubeVideoId || day.videoId || day.video_id || undefined,
      videoId: day.videoId || day.youtubeVideoId || day.video_id || undefined,
      videoTitle: day.videoTitle || `${plan.hobby || 'Tutorial'} - Day ${day.day}`,
      // Preserve all other backend fields
      estimatedTime: day.estimatedTime,
      skillLevel: day.skillLevel
    }))
  };
  
  console.log('🔧 fixPlanDataFields - Output plan days count:', fixedPlan.days.length);
  return fixedPlan;
};

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initialize with welcome message immediately if no plan data
    if (!initialPlanData) {
      console.log('🔄 Initializing messages state with welcome message');
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
        timestamp: new Date()
      }];
    }
    return [];
  });
  const [currentInput, setCurrentInput] = useState('');
  const [selectedHobby, setSelectedHobby] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Partial<QuizAnswers>>({});
  const [currentStep, setCurrentStep] = useState<'hobby' | 'experience' | 'time' | 'goal' | 'generating' | 'plan'>('hobby');
  const [isTyping, setIsTyping] = useState(false);
  
  // Fix initial loading state
  useEffect(() => {
    setIsTyping(false);
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // Start with mobile view
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  
  // Window resize listener for responsive layout
  useEffect(() => {
    const handleResize = () => {
      // Use only browser window measurements, not physical screen size
      const innerWidth = window.innerWidth || 0;
      const clientWidth = document.documentElement.clientWidth || 0;
      
      // Use the smaller of the two measurements to be conservative
      const effectiveWidth = Math.min(innerWidth, clientWidth);
      const isLikelyDesktop = effectiveWidth >= 768;
      
      // console.log('📱 Inner:', innerWidth, 'Client:', clientWidth, 'Effective:', effectiveWidth, 'Desktop:', isLikelyDesktop);
      setIsDesktop(isLikelyDesktop);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Store plan data for dashboard navigation when plan is generated
  useEffect(() => {
    if (planData) {
      const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('🔍 Direct Supabase session check:', planId, planData.hobby);
      localStorage.setItem('lastViewedPlan', planId);
      localStorage.setItem('lastViewedPlanData', JSON.stringify(planData));
      // Also store in session for immediate back navigation
      sessionStorage.setItem('activePlanData', JSON.stringify(planData));
      sessionStorage.setItem('activePlanId', planId);
    }
  }, [planData]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { savePlan, saving } = usePlanStorage();
  const { user } = useAuth();

  // Auto-close auth modal when user signs in
  useEffect(() => {
    if (user && showAuthModal) {
      console.log('🔐 User signed in, closing auth modal');
      setShowAuthModal(false);
    }
  }, [user]);

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
    // Creative Arts
    'photography', 'drawing', 'painting', 'digital art', 'calligraphy', 'pottery', 'jewelry making', 'sculpture',
    
    // Music & Performance
    'guitar', 'piano', 'ukulele', 'singing', 'violin', 'drums', 'harmonica', 'dance', 'theater',
    
    // Culinary Arts
    'cooking', 'baking', 'wine tasting', 'coffee brewing', 'bread making', 'cake decorating',
    
    // Physical & Wellness
    'yoga', 'meditation', 'tai chi', 'martial arts', 'rock climbing', 'swimming', 'running', 'cycling',
    
    // Technical & Digital
    'coding', 'web design', 'video editing', 'electronics tinkering', 'programming basics', 'model building', 'digital photography',
    
    // Nature & Outdoor
    'gardening', 'hiking', 'bird watching', 'astronomy', 'fishing', 'camping', 'foraging',
    
    // Crafts & Making
    'knitting', 'sewing', 'woodworking', 'leather crafting', 'soap making', 'candle making', 'embroidery',
    
    // Learning & Culture
    'chess', 'language learning', 'reading', 'writing', 'history research', 'genealogy'
  ];
  const surpriseAnswers: QuizAnswers = {
    experience: 'beginner',
    timeAvailable: '1 hour',
    goal: 'personal enjoyment'
  };

  // Initialize with plan data if provided (for back navigation from dashboard)
  useEffect(() => {
    if (initialPlanData) {
      console.log('🔄 Initializing with existing plan data:', initialPlanData.hobby);
      const fixedPlanData = fixPlanDataFields(initialPlanData);
      console.log('🔧 Applied field mapping fix to initial plan data');
      setPlanData(fixedPlanData);
      setRenderKey(prev => prev + 1); // Force React re-render
      
      // CRITICAL FIX: Set plan ID from initial plan data if available
      if (initialPlanData.id || initialPlanData.planId) {
        const planId = initialPlanData.id || initialPlanData.planId;
        console.log('🎯 Setting plan ID from initial data:', planId);
        setCurrentPlanId(planId.toString());
      }
      
      // Also check storage for plan ID
      const storedPlanId = sessionStorage.getItem('currentPlanId') || localStorage.getItem('currentPlanId');
      if (storedPlanId) {
        console.log('🎯 Found stored plan ID:', storedPlanId);
        setCurrentPlanId(storedPlanId);
      }
    }
  }, [initialPlanData]);

  // Auto-load user's most recent plan when component initializes
  useEffect(() => {
    const loadMostRecentPlan = async () => {
      // Only load if no initial plan data and user is authenticated
      if (!initialPlanData && user?.id) {
        console.log('🔄 AUTO-LOAD: Checking for user\'s most recent plan...');
        
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=*&order=created_at.desc&limit=1`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            }
          });

          if (response.ok) {
            const plans = await response.json();
            if (plans && plans.length > 0) {
              const mostRecentPlan = plans[0];
              console.log('🔄 AUTO-LOAD: Found recent plan:', mostRecentPlan.title);
              
              // Convert Supabase plan to our format - FIXED nested structure
              const planData = {
                id: mostRecentPlan.id,
                hobby: mostRecentPlan.hobby_name || mostRecentPlan.plan_data?.hobby,
                title: mostRecentPlan.title,
                overview: mostRecentPlan.overview,
                difficulty: mostRecentPlan.difficulty,
                totalDays: mostRecentPlan.total_days,
                days: mostRecentPlan.plan_data?.plan_data?.days || mostRecentPlan.plan_data?.days || []
              };
              
              console.log('🔧 AUTO-LOAD: Extracted days count:', planData.days.length);
              console.log('🔧 AUTO-LOAD: Raw plan_data structure:', {
                hasPlanData: !!mostRecentPlan.plan_data,
                hasDays: !!mostRecentPlan.plan_data?.days,
                hasNestedDays: !!mostRecentPlan.plan_data?.plan_data?.days,
                extractedDaysLength: planData.days.length
              });
              
              const fixedAutoLoadPlan = fixPlanDataFields(planData);
              console.log('🔄 AUTO-LOAD: Setting plan data automatically');
              setPlanData(fixedAutoLoadPlan);
              setCurrentPlanId(mostRecentPlan.id.toString());
              setRenderKey(prev => prev + 1); // Force React re-render
              
              // Load progress
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
                }
              }

              // Initialize chat for returning user
              const welcomeMessage: ChatMessage = {
                id: Date.now().toString(),
                sender: 'ai',
                content: `Welcome back to your ${planData.hobby} learning plan! 🌟\n\nI can see you were working on this plan. Your progress has been saved and you can continue where you left off.\n\nHow can I help you today?`,
                timestamp: new Date()
              };
              setMessages([welcomeMessage]);
            } else {
              console.log('🔄 AUTO-LOAD: No recent plans found');
            }
          }
        } catch (error) {
          console.error('🔄 AUTO-LOAD: Error loading recent plan:', error);
        }
      }
    };

    // Only run if user is loaded and component is fully initialized
    if (user !== undefined) {
      loadMostRecentPlan();
    }
  }, [user, initialPlanData]);

  // Separate effect to handle authentication and plan ID detection
  useEffect(() => {
    if (user && initialPlanData && initialPlanData.hobby && !currentPlanId) {
      console.log('🔍 User authenticated, looking for plan ID for hobby:', initialPlanData.hobby);
      console.log('🔍 User ID:', user.id);
      
      const findPlanId = async () => {
        try {
          // Use the same direct API approach as the dashboard - no hobby column in production
          console.log('🔍 Using direct API to find plans for hobby:', initialPlanData.hobby);
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            }
          });
          
          if (response.ok) {
            const allPlans = await response.json();
            console.log('🔍 Direct API query result:', { totalPlans: allPlans?.length || 0 });
            console.log('🔍 All user plans:', allPlans?.map((p: any) => ({ id: p.id, title: p.title })));
            
            // Filter for the specific hobby by extracting from title
            const supabasePlans = allPlans?.filter((p: any) => {
              if (p.title) {
                const titleMatch = p.title.match(/Learn (\w+) in/i);
                const extractedHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
                return extractedHobby === initialPlanData.hobby.toLowerCase();
              }
              return false;
            }) || [];
            console.log('🔍 Filtered plans for hobby:', supabasePlans?.map((p: any) => ({ id: p.id, title: p.title })));
            console.log('🔍 Search comparison - extractedHobby vs initialPlanData.hobby:', { 
              searchTerm: initialPlanData.hobby.toLowerCase(),
              foundTitles: allPlans?.map((p: any) => p.title),
              matchedPlans: supabasePlans?.length || 0 
            });
            
            if (supabasePlans && supabasePlans.length > 0) {
              const mostRecentPlan = supabasePlans[0];
              console.log('🎯 Found plan via auth context:', mostRecentPlan.id, 'for title:', mostRecentPlan.title);
              setCurrentPlanId(mostRecentPlan.id.toString());
              
              // Load progress for this plan using direct API
              const progressResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${user.id}`, {
                headers: {
                  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                }
              });
              
              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                console.log('🔍 Progress query result:', { progressCount: progressData?.length || 0 });
                
                if (progressData && progressData.length > 0) {
                  const progress = progressData[0];
                  console.log('📖 Loaded progress from database:', progress.completed_days);
                  setCompletedDays(progress.completed_days || []);
                  setSelectedDay(progress.current_day || 1);
                } else {
                  // Check session storage as fallback
                  const sessionKey = `progress_${user.id}_${mostRecentPlan.id}`;
                  const sessionProgress = sessionStorage.getItem(sessionKey);
                  if (sessionProgress) {
                    try {
                      const progress = JSON.parse(sessionProgress);
                      console.log('📖 Loaded progress from session storage fallback:', progress.completed_days);
                      setCompletedDays(progress.completed_days || []);
                      setSelectedDay(progress.current_day || 1);
                    } catch (e) {
                      console.error('Failed to parse session progress');
                    }
                  }
                }
              }
            } else {
              console.log('🚨 No plans found for hobby:', initialPlanData.hobby);
              console.log('🚨 Query details - User ID:', user.id, 'Hobby:', initialPlanData.hobby);
              console.log('🚨 Available plan titles:', allPlans?.map((p: any) => p.title));
              console.log('🚨 This indicates a plan lookup issue - checking if plan exists with different title format');
              
              // Fallback: try broader search patterns
              const fallbackPlans = allPlans?.filter((p: any) => {
                if (p.title) {
                  const hobbyInTitle = p.title.toLowerCase().includes(initialPlanData.hobby.toLowerCase());
                  return hobbyInTitle;
                }
                return false;
              }) || [];
              
              if (fallbackPlans.length > 0) {
                console.log('🔧 FALLBACK SUCCESS: Found plan with broader search:', fallbackPlans[0].title);
                const fallbackPlan = fallbackPlans[0];
                setCurrentPlanId(fallbackPlan.id.toString());
                
                // Load progress for fallback plan
                const sessionKey = `progress_${user.id}_${fallbackPlan.id}`;
                const sessionProgress = sessionStorage.getItem(sessionKey);
                if (sessionProgress) {
                  try {
                    const progress = JSON.parse(sessionProgress);
                    console.log('📖 Restored progress from session (fallback):', progress.completed_days);
                    setCompletedDays(progress.completed_days || []);
                    setSelectedDay(progress.current_day || 1);
                  } catch (e) {
                    console.error('Failed to parse session progress');
                  }
                }
              }
            }
          } else {
            const errorText = await response.text();
            console.error('🚨 Direct API error:', response.status, response.statusText, errorText);
          }
        } catch (error) {
          console.error('Error finding plan:', error);
        }
      };

      findPlanId();
    } else if (user && initialPlanData) {
      console.log('⚠️ Missing hobby in plan data:', initialPlanData);
      console.log('⚠️ Plan data keys:', Object.keys(initialPlanData));
      console.log('⚠️ Plan data hobby field:', initialPlanData.hobby);
      console.log('⚠️ Plan data title field:', initialPlanData.title);
      
      // Try to extract hobby from title if available
      if (initialPlanData.title && !initialPlanData.hobby) {
        const titleMatch = initialPlanData.title.match(/Learn (\w+) in/i);
        if (titleMatch) {
          const extractedHobby = titleMatch[1].toLowerCase();
          console.log('🔧 Extracted hobby from title:', extractedHobby);
          
          // Create updated plan data with extracted hobby
          const updatedPlanData = {
            ...initialPlanData,
            hobby: extractedHobby
          };
          
          console.log('🔧 Retrying plan ID search with extracted hobby...');
          
          const findPlanIdWithExtractedHobby = async () => {
            try {
              // Use the same direct API approach as the dashboard - no hobby column in production
              console.log('🔍 Using direct API to find plans for hobby:', extractedHobby);
              const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc`, {
                headers: {
                  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                }
              });
              
              if (response.ok) {
                const allPlans = await response.json();
                console.log('🔍 Direct API query result:', { totalPlans: allPlans?.length || 0 });
                console.log('🔍 All user plans:', allPlans?.map(p => ({ id: p.id, title: p.title })));
                
                // Filter for the extracted hobby by parsing titles
                const supabasePlans = allPlans?.filter(p => {
                  if (p.title) {
                    const titleMatch = p.title.match(/Learn (\w+) in/i);
                    const planHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
                    return planHobby === extractedHobby;
                  }
                  return false;
                }) || [];
                console.log('🔍 Filtered plans for extracted hobby:', supabasePlans?.map(p => ({ id: p.id, title: p.title })));
                
                if (supabasePlans && supabasePlans.length > 0) {
                  const mostRecentPlan = supabasePlans[0];
                  console.log('🎯 Found plan via extracted hobby:', mostRecentPlan.id, 'for title:', mostRecentPlan.title);
                  setCurrentPlanId(mostRecentPlan.id.toString());
                  
                  // Load progress for this plan using direct API
                  const progressResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${user.id}`, {
                    headers: {
                      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    }
                  });
                  
                  if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    console.log('🔍 Progress query result for extracted hobby:', { progressCount: progressData?.length || 0 });
                    
                    if (progressData && progressData.length > 0) {
                      const completed = progressData.map(p => p.day_number);
                      console.log('📖 Loaded progress from database via extracted hobby:', completed);
                      setCompletedDays(completed);
                    }
                  }
                } else {
                  console.log('🚨 No plans found for extracted hobby:', extractedHobby);
                  console.log('🚨 User ID:', user.id, 'Hobby searched:', extractedHobby);
                }
              } else {
                const errorText = await response.text();
                console.error('🚨 Direct API error:', response.status, response.statusText, errorText);
              }
            } catch (error) {
              console.error('Error finding plan with extracted hobby:', error);
            }
          };
          
          findPlanIdWithExtractedHobby();
        }
      }
    }
  }, [user, initialPlanData]);

  // Keep the old logic for backward compatibility
  useEffect(() => {
    if (initialPlanData && !user) {
      const initializeWithAuth = async () => {
        // Check directly with Supabase instead of relying on hook state
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 Fallback session check:', session?.user?.id || 'no session');
        
        if (session?.user) {
          try {
            console.log('🔍 Looking for plan ID for authenticated user:', session.user.id);
            
            // First, try to find existing plan via direct Supabase query to ensure we get the latest data
            const { data: supabasePlans, error: supabaseError } = await supabase
              .from('hobby_plans')
              .select('id, hobby, created_at, title')
              .eq('user_id', session.user.id)
              .eq('hobby', initialPlanData.hobby)
              .order('created_at', { ascending: false })
              .limit(5); // Get more plans to debug
              
            console.log('🔍 Supabase query result:', { supabaseError, planCount: supabasePlans?.length || 0 });
            console.log('🔍 Available plans:', supabasePlans?.map(p => ({ id: p.id, hobby: p.hobby, title: p.title })));
              
            if (!supabaseError && supabasePlans && supabasePlans.length > 0) {
              const mostRecentPlan = supabasePlans[0];
              console.log('🎯 Found plan via Supabase:', mostRecentPlan.id, 'for hobby:', mostRecentPlan.hobby);
              setCurrentPlanId(mostRecentPlan.id.toString());
              
              // Load progress for this plan  
              try {
                const { data: progressData, error: progressError } = await supabase
                  .from('user_progress')
                  .select('*')
                  .eq('plan_id', mostRecentPlan.id)
                  .eq('user_id', session.user.id);
                
                console.log('🔍 Progress query result:', { progressError, progressCount: progressData?.length || 0 });
                
                if (!progressError && progressData && progressData.length > 0) {
                  const completed = progressData.map(p => p.day_number);
                  console.log('📖 Loaded progress from database:', completed);
                  setCompletedDays(completed);
                }
              } catch (progressErr) {
                console.error('Error loading progress:', progressErr);
              }
              return;
            } else {
              console.log('🚨 No plans found via Supabase for hobby:', initialPlanData.hobby);
            }
            
            // Fallback to API service
            const { data: userPlans, error } = await apiService.getHobbyPlans(session.user.id);
            
            if (!error && userPlans && userPlans.length > 0) {
              // Find the MOST RECENT plan that matches this hobby
              const matchingPlans = userPlans.filter(plan => 
                plan.hobby === initialPlanData.hobby
              );
              
              if (matchingPlans.length > 0) {
                // Sort by created_at descending and take the most recent
                const mostRecentPlan = matchingPlans.sort((a, b) => 
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )[0];
                
                console.log('🎯 Found most recent plan ID via API:', mostRecentPlan.id, 'for hobby:', mostRecentPlan.hobby);
                setCurrentPlanId(mostRecentPlan.id.toString());
                
                // Load progress from database for this plan
                console.log('📖 Loading progress for plan ID:', mostRecentPlan.id);
                
                // Try direct REST API call for progress
                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${session.user.id}`,
                    {
                      headers: {
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  
                  if (response.ok) {
                    const progressData = await response.json();
                    if (progressData && progressData.length > 0) {
                      const progress = progressData[0];
                      console.log('✅ FOUND PROGRESS! Loading from database:', progress.completed_days);
                      setCompletedDays(progress.completed_days || []);
                      setSelectedDay(progress.current_day || 1);
                      return; // Exit early, we found the progress
                    } else {
                      console.log('⚠️ No progress found for plan ID:', mostRecentPlan.id);
                    }
                  } else {
                    console.log('⚠️ Progress API response not OK:', response.status);
                  }
                } catch (progressError) {
                  console.log('⚠️ Error loading progress from database:', progressError);
                }
              } else {
                console.log('🔄 No matching plans found for hobby:', initialPlanData.hobby);
              }
            } else {
              console.log('🔄 No user plans found');
            }
          } catch (error) {
            console.error('🔄 Error fetching user plans:', error);
          }
        } else {
          console.log('🔄 No authenticated session found - progress will not persist');
        }
      };
      
      const loadLocalStorageProgress = () => {
        console.log('📍 No localStorage progress loading - using database only');
      };
      
      // Start the initialization process
      initializeWithAuth();
    } else if (initialPlanData) {
      // User with existing plan data - check if authenticated to get plan ID
      console.log('🔄 Initializing with existing plan data:', initialPlanData.hobby);
      const fixedGuestPlanData = fixPlanDataFields(initialPlanData);
      console.log('🔧 Applied field mapping fix to initial plan data');
      setPlanData(fixedGuestPlanData);
      
      // Initialize chat conversation for existing plan
      if (messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          content: `Welcome back to your ${initialPlanData.hobby} learning plan! 🌟\n\nI'm here to help you with any questions about your 7-day journey. Feel free to ask me about:\n\n• Daily tasks and how to complete them\n• Tips for better practice\n• Troubleshooting common challenges\n• Resources and recommendations\n\nHow can I assist you today?`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
      
      // If user is authenticated, try to get plan ID from database
      if (user?.id) {
        console.log('🔍 User authenticated, searching for existing plan ID...');
        // Find the plan ID from the database based on hobby and user
        setTimeout(async () => {
          try {
            const { data: plans, error } = await supabase
              .from('hobby_plans')
              .select('id')
              .eq('user_id', user.id)
              .eq('hobby', initialPlanData.hobby)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (!error && plans && plans.length > 0) {
              console.log('✅ Found existing plan ID:', plans[0].id);
              setCurrentPlanId(plans[0].id.toString());
              
              // Also load progress for this plan
              await loadProgressFromDatabase(plans[0].id.toString());
            } else {
              console.log('⚠️ No existing plan found for this hobby');
            }
          } catch (error) {
            console.error('Error finding plan ID:', error);
          }
        }, 100);
      }
      
      console.log('📍 Database-only progress tracking - no localStorage used');
      
      // CRITICAL FIX: Set step to 'plan' when plan exists so chat works properly
      setCurrentStep('plan');
      setIsGenerating(false);
    }
  }, [initialPlanData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Component mounted
  useEffect(() => {
    // Component initialization logging can be removed in production
  }, []);

  // Enhanced hobby validation and processing
  const validateAndProcessHobby = (input: string): { isValid: boolean; suggestions?: string[]; detectedHobbies?: string[] } => {
    const trimmedInput = input.toLowerCase().trim();
    
    // Only reject completely nonsensical inputs (matching backend logic)
    const badInputs = ['bye', 'hello', 'hi', 'hey', 'hmm', 'um', 'uh', 'ah', 'ok', 'okay', 'yes', 'no', 'maybe', 'test', 'testing', '', 'null', 'undefined', 'admin', 'root'];
    
    if (badInputs.includes(trimmedInput) || trimmedInput.length < 2) {
      return {
        isValid: false,
        suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
      };
    }
    
    // Expanded hobby detection with smart matching
    const hobbyKeywords = {
      music: ['music', 'guitar', 'piano', 'violin', 'drums', 'singing', 'bass', 'keyboard', 'ukulele'],
      art: ['drawing', 'painting', 'sketching', 'art', 'illustration', 'digital art', 'watercolor', 'acrylic'],
      dance: ['dance', 'dancing', 'ballet', 'hip hop', 'salsa', 'ballroom', 'contemporary', 'jazz dance'],
      fitness: ['yoga', 'pilates', 'workout', 'fitness', 'exercise', 'gym', 'strength training', 'cardio'],
      sports: ['tennis', 'basketball', 'soccer', 'football', 'volleyball', 'swimming', 'running', 'cycling'],
      cooking: ['cooking', 'baking', 'culinary', 'chef', 'cuisine', 'recipes', 'food preparation'],
      crafts: ['knitting', 'sewing', 'crochet', 'embroidery', 'quilting', 'needlework', 'crafting'],
      coding: ['coding', 'programming', 'web development', 'app development', 'software', 'javascript', 'python'],
      gardening: ['gardening', 'horticulture', 'plants', 'farming', 'landscaping', 'greenhouse'],
      photography: ['photography', 'photo', 'camera', 'portrait', 'landscape photography', 'digital photography'],
      writing: ['writing', 'creative writing', 'poetry', 'storytelling', 'blogging', 'journalism'],
      languages: ['language', 'spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'english'],
      gaming: ['gaming', 'video games', 'board games', 'chess', 'poker', 'game development']
    };
    
    // Smart hobby detection
    const detectedHobbies: string[] = [];
    
    for (const [category, keywords] of Object.entries(hobbyKeywords)) {
      for (const keyword of keywords) {
        if (trimmedInput === keyword || 
            trimmedInput.includes(keyword) || 
            (keyword.includes(trimmedInput) && trimmedInput.length >= 3)) {
          if (!detectedHobbies.includes(keyword)) {
            detectedHobbies.push(keyword);
          }
        }
      }
    }
    
    if (detectedHobbies.length > 0) {
      return {
        isValid: true,
        detectedHobbies: detectedHobbies
      };
    }
    
    // Accept reasonable-looking inputs (let backend handle detailed validation)
    const reasonablePattern = /^[a-zA-Z\s-]{3,30}$/;
    if (reasonablePattern.test(trimmedInput)) {
      return {
        isValid: true,
        detectedHobbies: [trimmedInput]
      };
    }
    
    return {
      isValid: false,
      suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
    };
  };

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  const addAIMessage = (content: string, options?: { value: string; label: string; description?: string }[], delay = 1000) => {
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          content,
          options,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, delay);
    }, 300);
  };

  const handleSurpriseMe = async () => {
    const randomHobby = surpriseHobbies[Math.floor(Math.random() * surpriseHobbies.length)];
    
    // Add user message
    addUserMessage("Surprise Me! 🎲");
    
    // Add AI response
    addAIMessage(`Perfect! I've chosen ${randomHobby} for you. Creating your 7-day plan now... ✨`, undefined, 800);
    
    setSelectedHobby(randomHobby);
    setQuizAnswers(surpriseAnswers);
    setCurrentStep('generating');
    setIsGenerating(true);

    try {
      const plan = await onGeneratePlan(randomHobby, surpriseAnswers);
      console.log('🎯 Setting plan data in SplitPlanInterface:', plan.hobby);
      console.log('🐛 Raw plan data received in setPlanData:', JSON.stringify(plan, null, 2));
      console.log('🐛 First day YouTube video ID before fixPlanDataFields:', plan?.days?.[0]?.youtubeVideoId);
      console.log('🐛 CRITICAL - Raw plan first day has keys:', Object.keys(plan?.days?.[0] || {}));
      console.log('🐛 CRITICAL - Raw plan first day youtubeVideoId type:', typeof plan?.days?.[0]?.youtubeVideoId);
      console.log('🐛 CRITICAL - Raw plan first day videoId type:', typeof plan?.days?.[0]?.videoId);
      
      // If no YouTube video ID, check nested structures
      if (!plan?.days?.[0]?.youtubeVideoId) {
        console.log('🔍 Checking nested plan structure for YouTube video ID...');
        console.log('🔍 plan.plan_data?.days?.[0]?.youtubeVideoId:', plan.plan_data?.days?.[0]?.youtubeVideoId);
        console.log('🔍 plan.days?.[0]?.freeResources:', plan.days?.[0]?.freeResources);
      }
      
      // Fix field mapping for frontend display
      const correctedPlanData = fixPlanDataFields(plan);
      
      console.log('🔧 CORRECTED plan data - first day commonMistakes:', correctedPlanData.days[0].commonMistakes);
      console.log('🔧 CORRECTED plan data - first day youtubeVideoId:', correctedPlanData.days[0].youtubeVideoId);
      
      console.log('🔍 PLAN DEBUG: Setting planData with correctedPlanData');
      console.log('🔍 PLAN DEBUG: correctedPlanData structure:', {
        exists: !!correctedPlanData,
        hasDays: !!correctedPlanData?.days,
        daysLength: correctedPlanData?.days?.length,
        title: correctedPlanData?.title
      });
      
      console.log('🔍 PLAN DEBUG: About to set plan data and step to plan');
      setPlanData(correctedPlanData);
      setCurrentStep('plan'); // Show the plan after generation
      setRenderKey(prev => prev + 1); // Force React re-render
      
      console.log('🔍 PLAN DEBUG: After setPlanData - currentStep should be:', 'plan');
      console.log('🔍 PLAN DEBUG: planData should have days:', !!correctedPlanData?.days);
      
      // Force a re-render check immediately after state update
      setTimeout(() => {
        console.log('🔍 PLAN DEBUG: Force re-render check - planData exists:', !!correctedPlanData);
        console.log('🔍 PLAN DEBUG: Force re-render check - days array:', !!correctedPlanData?.days);
        console.log('🔍 PLAN DEBUG: Force re-render check - days length:', correctedPlanData?.days?.length);
        console.log('🔍 PLAN DEBUG: Force re-render check - currentStep:', 'plan');
        console.log('🔍 PLAN DEBUG: Force re-render check - should show plan:', 
          !!(correctedPlanData && correctedPlanData.days && Array.isArray(correctedPlanData.days) && correctedPlanData.days.length > 0));
      }, 100);
      
      // Prevent any navigation for the next few seconds to ensure plan displays
      const preventNavigation = (e: BeforeUnloadEvent) => {
        console.log('🛡️ NAVIGATION PROTECTION: Preventing unwanted navigation after plan generation');
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', preventNavigation);
      setTimeout(() => {
        window.removeEventListener('beforeunload', preventNavigation);
        console.log('🔍 PLAN DEBUG: Force re-render check - planData exists:', !!correctedPlanData);
      }, 3000);
      
      // Save plan to Supabase if user is authenticated
      if (user?.id) {
        try {
          console.log('Saving surprise plan to Supabase for authenticated user...');
          // Fix field name mapping before saving
          const planDataWithCorrectFields = fixPlanDataFields(plan);
          
          console.log('🔧 FIXED plan data - first day commonMistakes:', planDataWithCorrectFields.days[0].commonMistakes);
          console.log('🔧 FIXED plan data - first day youtubeVideoId:', planDataWithCorrectFields.days[0].youtubeVideoId);

          const savedPlan = await hobbyPlanService.savePlan({
            hobby: randomHobby,
            title: plan.title,
            overview: plan.overview,
            plan_data: planDataWithCorrectFields
          }, user.id);
          
          console.log('✅ Plan saved successfully, setting plan ID:', savedPlan.id);
          setCurrentPlanId(savedPlan.id.toString());
          
          // Initialize progress tracking
          await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
          
          addAIMessage(`Your ${randomHobby} plan is ready and saved! 🎉 Check it out on the right side. Your progress will be tracked automatically!`, undefined, 500);
        } catch (saveError) {
          console.error('Error saving surprise plan to Supabase:', saveError);
          addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Progress tracking is unavailable right now, but you can still use your plan!`, undefined, 500);
        }
      } else {
        addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Sign up to save your progress!`, undefined, 500);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      
      // Handle duplicate plan errors with friendly UI
      if (error instanceof Error && error.message === 'DUPLICATE_PLAN') {
        const duplicateData = (error as any).duplicateData;
        console.log('🚨 DUPLICATE PLAN detected for surprise:', duplicateData);
        
        addAIMessage(
          `I see you already have a ${randomHobby} plan! 🎯\n\nWould you like me to:\n• Show your existing plan\n• Try a different surprise hobby\n• Generate the same hobby with new content?`,
          [
            { value: 'show_existing', label: 'Show My Existing Plan', description: 'View your current plan' },
            { value: 'try_different', label: 'Try Different Hobby', description: 'Get a new surprise hobby' },
            { value: 'generate_anyway', label: 'Create New Version', description: 'Generate fresh content for same hobby' }
          ]
        );
      } else {
        addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = async (value: string, label: string) => {
    // Handle AI-suggested hobbies with automatic plan generation
    if (value.startsWith('ai_suggested_')) {
      const actualHobby = value.replace('ai_suggested_', '');
      addUserMessage(label);
      addAIMessage(`Excellent choice! ${actualHobby} is perfect for learning in 7 days. Let me create your personalized plan right away... ✨`);
      
      setSelectedHobby(actualHobby);
      setQuizAnswers({
        experience: 'beginner',
        timeAvailable: '1 hour',
        goal: 'personal enjoyment'
      });
      setCurrentStep('generating');
      setIsGenerating(true);
      
      try {
        const plan = await onGeneratePlan(actualHobby, {
          experience: 'beginner',
          timeAvailable: '1 hour',
          goal: 'personal enjoyment'
        });
        
        console.log('🎯 AI Suggested plan generated:', plan.hobby);
        const fixedPlan = fixPlanDataFields(plan);
        console.log('🔍 AI SUGGESTION DEBUG: Setting planData with fixedPlan');
        console.log('🔍 AI SUGGESTION DEBUG: fixedPlan structure:', {
          exists: !!fixedPlan,
          hasDays: !!fixedPlan?.days,
          daysLength: fixedPlan?.days?.length,
          title: fixedPlan?.title
        });
        
        console.log('🔍 AI SUGGESTION DEBUG: About to set plan data and step to plan');
        setPlanData(fixedPlan);
        setCurrentStep('plan'); // Show the plan after generation
        
        // Prevent any navigation for the next few seconds to ensure plan displays
        const preventNavigation = (e: BeforeUnloadEvent) => {
          console.log('🛡️ NAVIGATION PROTECTION: Preventing unwanted navigation after AI plan generation');
          e.preventDefault();
          e.returnValue = '';
        };
        window.addEventListener('beforeunload', preventNavigation);
        setTimeout(() => {
          window.removeEventListener('beforeunload', preventNavigation);
          console.log('🔍 AI SUGGESTION DEBUG: Force re-render check - planData exists:', !!fixedPlan);
        }, 3000);
        addAIMessage(`Your ${actualHobby} plan is ready! 🎉 This AI-recommended hobby is perfect for beginners. Ask me any questions!`);
      } catch (error) {
        console.error('Error generating AI suggested plan:', error);
        addAIMessage(`I had trouble creating your ${actualHobby} plan. Let me try a different approach or you can choose another hobby.`);
        setCurrentStep('hobby');
      } finally {
        setIsGenerating(false);
      }
      return;
    }
    
    if (value === 'surprise') {
      await handleSurpriseMe();
      return;
    }

    // Handle duplicate plan response options
    if (value === 'show_existing' || value === 'view_existing') {
      addUserMessage(label);
      addAIMessage("Let me show you your existing plan right here!");
      // FIXED: Instead of navigating away, just keep the user on the current plan
      console.log('🔍 User wants to view existing plan - staying on current interface');
      return;
    }

    if (value === 'try_different' || value === 'try_different_hobby') {
      addUserMessage(label);
      // Reset to hobby selection
      setCurrentStep('hobby');
      setSelectedHobby('');
      setQuizAnswers({ experience: '', timeAvailable: '', goal: '' });
      addAIMessage("Great choice! Let's find you a different hobby to explore. What would you like to learn?", [
        { value: 'surprise', label: 'Surprise Me! 🎲', description: 'Let me pick something exciting for you' },
        { value: 'cooking', label: 'Cooking', description: 'Learn delicious recipes and techniques' },
        { value: 'drawing', label: 'Drawing', description: 'Express yourself through art' },
        { value: 'guitar', label: 'Guitar', description: 'Play your favorite songs' },
        { value: 'photography', label: 'Photography', description: 'Capture beautiful moments' },
        { value: 'yoga', label: 'Yoga', description: 'Find peace and flexibility' }
      ]);
      return;
    }

    if (value === 'generate_anyway' || value === 'create_new') {
      addUserMessage(label);
      setCurrentStep('generating');
      setIsGenerating(true);
      addAIMessage(`Creating a fresh ${selectedHobby} plan with new content... ✨`);
      
      try {
        // Force generate new plan by bypassing duplicate check
        const plan = await onGeneratePlan(selectedHobby, quizAnswers);
        const fixedPlan = fixPlanDataFields(plan);
        setPlanData(fixedPlan);
        setRenderKey(prev => prev + 1); // Force React re-render
        
        // Save new plan
        if (user?.id) {
          try {
            const savedPlan = await hobbyPlanService.savePlan({
              hobby: selectedHobby,
              title: plan.title,
              overview: plan.overview,
              plan_data: plan
            }, user.id);
            setCurrentPlanId(savedPlan.id.toString());
            await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
            addAIMessage(`Your fresh ${selectedHobby} plan is ready! 🎉 This version has different content and approach. Ask me any questions!`);
          } catch (saveError) {
            addAIMessage(`Your fresh ${selectedHobby} plan is ready! 🎉 Ask me any questions about this new version!`);
          }
        } else {
          addAIMessage(`Your fresh ${selectedHobby} plan is ready! 🎉 Sign up to save multiple plans!`);
        }
        setCurrentStep('plan');
      } catch (error) {
        console.error('Error generating fresh plan:', error);
        addAIMessage("I had trouble creating a fresh plan. Let me try again!");
        setCurrentStep('goal');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    addUserMessage(label);
    
    if (currentStep === 'hobby') {
      setSelectedHobby(value);
      setCurrentStep('experience');
      
      const experienceOptions = [
        { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
        { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
        { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
      ];
      
      addAIMessage(`Great choice! ${selectedHobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
      
    } else if (currentStep === 'experience') {
      setQuizAnswers(prev => ({ ...prev, experience: value }));
      setCurrentStep('time');
      
      const timeOptions = [
        { value: '30 minutes', label: '30 minutes/day', description: 'Quick daily sessions' },
        { value: '1 hour', label: '1 hour/day', description: 'Solid practice time' },
        { value: '2+ hours', label: '2+ hours/day', description: 'Deep dive sessions' }
      ];
      
      addAIMessage("Got it! How much time can you spend learning each day?", timeOptions);
      
    } else if (currentStep === 'time') {
      setQuizAnswers(prev => ({ ...prev, timeAvailable: value }));
      setCurrentStep('goal');
      
      const goalOptions = [
        { value: 'personal enjoyment', label: 'Personal Enjoyment', description: 'Just for fun and relaxation' },
        { value: 'skill building', label: 'Skill Building', description: 'Develop expertise and technique' },
        { value: 'social connection', label: 'Social Connection', description: 'Meet people and share experiences' },
        { value: 'career change', label: 'Career Change', description: 'Explore new professional paths' }
      ];
      
      addAIMessage("Perfect! What's your main goal for learning this hobby?", goalOptions);
      
    } else if (currentStep === 'goal') {
      const finalAnswers = { ...quizAnswers, goal: value } as QuizAnswers;
      setQuizAnswers(finalAnswers);
      setCurrentStep('generating');
      setIsGenerating(true);
      
      addAIMessage(`Perfect! Creating your personalized ${selectedHobby} plan now... ✨`);
      
      try {
        console.log('🔥 GENERATING PLAN FOR:', selectedHobby, finalAnswers);
        const plan = await onGeneratePlan(selectedHobby, finalAnswers);
        console.log('🔥 PLAN GENERATED:', plan);
        const fixedStandardPlan = fixPlanDataFields(plan);
        console.log('🔧 Applied field mapping fix to standard plan');
        setPlanData(fixedStandardPlan);
        setRenderKey(prev => prev + 1); // Force React re-render
        
        // Save plan to Supabase if user is authenticated
        console.log('🔍 AUTH CHECK: user object:', user);
        console.log('🔍 AUTH CHECK: user?.id:', user?.id);
        console.log('🔍 AUTH CHECK: Boolean(user?.id):', Boolean(user?.id));
        
        if (user?.id) {
          try {
            console.log('🔄 PLAN SAVE: Starting Supabase save for authenticated user...');
            console.log('🔄 PLAN SAVE: User ID:', user.id);
            const savedPlan = await hobbyPlanService.savePlan({
              hobby: selectedHobby,
              title: plan.title,
              overview: plan.overview,
              plan_data: plan
            }, user.id);
            
            console.log('✅ PLAN SAVE SUCCESS: Plan saved with ID:', savedPlan.id);
            console.log('✅ PLAN SAVE SUCCESS: Setting currentPlanId to:', savedPlan.id);
            setCurrentPlanId(savedPlan.id.toString());
            
            // Initialize progress tracking
            await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
            
            // Load any existing progress for this plan
            setTimeout(async () => {
              await loadProgressFromDatabase(savedPlan.id);
            }, 500); // Small delay to ensure progress is initialized
            
            addAIMessage(`Your ${selectedHobby} plan is ready and saved! 🎉 Your progress will be tracked automatically. Ask me any questions about your plan!`);
            
            // CRITICAL FIX: Set step to 'plan' after plan generation for proper chat handling
            setCurrentStep('plan');
          } catch (saveError) {
            console.error('🚨 PLAN SAVE FAILED:', saveError);
            console.error('🚨 PLAN SAVE FAILED Details:', JSON.stringify(saveError, null, 2));
            
            // Provide specific error messages to user
            let errorMessage = `Your ${selectedHobby} plan is ready! 🎉 Note: Progress tracking is temporarily unavailable, but you can still use your plan.`
            
            if (saveError instanceof Error) {
              if (saveError.message.includes('timed out')) {
                errorMessage += ' (Database connection timed out - please run the manual RLS fix)'
              } else if (saveError.message.includes('violates row-level security policy')) {
                errorMessage += ' (Database permissions issue - please run the SUPABASE_MANUAL_FIX.md instructions)'
              } else if (saveError.message.includes('Authentication issue')) {
                errorMessage += ' (Authentication issue - please try signing out and back in)'
              } else if (saveError.message.includes('table not found')) {
                errorMessage += ' (Database setup issue - please contact support)'
              }
            }
            
            addAIMessage(errorMessage + ' Ask me any questions about your plan!');
            
            // CRITICAL FIX: Set step to 'plan' even when save fails for proper chat handling  
            setCurrentStep('plan');
          }
        } else {
          console.log('❌ AUTH CHECK: User not authenticated - cannot save plan');
          console.log('❌ AUTH CHECK: user object:', user);
          addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Sign up to save your progress and unlock advanced features. Ask me any questions about your plan!`);
          
          // CRITICAL FIX: Set step to 'plan' for non-authenticated users too
          setCurrentStep('plan');
        }
      } catch (error) {
        console.error('Error generating plan:', error);
        
        // Handle duplicate plan errors with friendly UI and options
        if (error instanceof Error && error.message === 'DUPLICATE_PLAN') {
          const duplicateData = (error as any).duplicateData;
          console.log('🚨 DUPLICATE PLAN detected:', duplicateData);
          
          addAIMessage(
            `I notice you already have a ${selectedHobby} learning plan! 🎯\n\nWhat would you like to do?`,
            [
              { value: 'view_existing', label: 'View My Current Plan', description: 'See your existing plan and continue learning' },
              { value: 'create_new', label: 'Create Fresh Plan', description: 'Generate new content with different approach' },
              { value: 'try_different_hobby', label: 'Try Different Hobby', description: 'Pick a completely different hobby to learn' }
            ]
          );
          
          // Reset to goal step so user can make a choice
          setCurrentStep('goal');
        } else {
          addAIMessage("Sorry, I had trouble creating your plan. Let me try again!");
        }
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // ENHANCED: Use DeepSeek API for intelligent chat responses
  const handlePlanQuestions = async (question: string) => {
    console.log('🤖 Processing plan question with DeepSeek API:', question);
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          planData: planData,
          hobbyContext: planData?.hobby || 'hobby learning'
        })
      });

      if (!response.ok) {
        throw new Error('Chat API request failed');
      }

      const data = await response.json();
      addAIMessage(data.response);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback response
      addAIMessage(`I'm here to help with your ${planData?.hobby || 'hobby'} learning plan! You can ask me about getting started, daily activities, equipment needed, practice tips, or anything else about your 7-day journey. What would you like to know?`);
    }
    
    setIsTyping(false);
  };



  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userInput = currentInput.trim();
    addUserMessage(userInput);
    setCurrentInput('');
    
    // CRITICAL FIX: Handle post-plan generation chat
    if (planData && (currentStep === 'generating' || currentStep === 'plan')) {
      console.log('🤖 Handling post-plan question:', userInput);
      handlePlanQuestions(userInput);
      return;
    }
    
    // Handle hobby input if we're in hobby selection step
    if (currentStep === 'hobby') {
      // Use DeepSeek AI for intelligent hobby validation
      try {
        const response = await fetch('/api/validate-hobby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ hobby: userInput.trim() })
        });

        if (response.ok) {
          const validation = await response.json();
          console.log('🔍 Frontend received validation response:', validation);
          console.log('🔍 Original input:', userInput);
          console.log('🔍 Corrected hobby:', validation.correctedHobby);
          
          if (validation.isValid) {
            const finalHobby = validation.correctedHobby || userInput.toLowerCase().trim();
            setSelectedHobby(finalHobby);
            setCurrentStep('experience');
            
            let message = `Perfect! I understand you want to learn ${finalHobby}. This is an excellent choice!`;
            
            if (validation.correctedHobby && validation.correctedHobby !== userInput.toLowerCase().trim()) {
              message += `\n\n(I detected the specific hobby from your input)`;
            }
            
            message += `\n\nWhat's your experience level?`;
            
            const experienceOptions = [
              { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
              { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
              { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
            ];
            
            addAIMessage(message, experienceOptions);
          } else {
            let errorMessage = `I'm not sure "${userInput}" is a hobby I can help with right now.`;
            
            if (validation.suggestions && validation.suggestions.length > 0) {
              errorMessage += `\n\nHere are some popular hobbies you might enjoy instead:`;
              const hobbyOptions = validation.suggestions.map((suggestion: string) => ({
                value: `ai_suggested_${suggestion}`,
                label: suggestion.charAt(0).toUpperCase() + suggestion.slice(1),
                description: `Learn ${suggestion} (AI recommended)`
              }));
              
              addAIMessage(errorMessage, hobbyOptions);
            } else {
              addAIMessage(errorMessage + '\n\nTry something like: guitar, cooking, drawing, yoga, photography, or dance.', [
                { value: 'guitar', label: 'Guitar', description: 'Learn guitar in 7 days' },
                { value: 'cooking', label: 'Cooking', description: 'Learn cooking in 7 days' },
                { value: 'drawing', label: 'Drawing', description: 'Learn drawing in 7 days' },
                { value: 'photography', label: 'Photography', description: 'Learn photography in 7 days' },
                { value: 'yoga', label: 'Yoga', description: 'Learn yoga in 7 days' },
                { value: 'dance', label: 'Dance', description: 'Learn dance in 7 days' }
              ]);
            }
          }
        } else {
          // Fallback to old validation if API fails
          const validation = validateAndProcessHobby(userInput);
          
          if (validation.isValid && validation.detectedHobbies) {
            if (validation.detectedHobbies.length === 1) {
              // Single hobby detected - process directly
              const hobby = validation.detectedHobbies[0];
              setSelectedHobby(hobby);
              setCurrentStep('experience');
              
              const experienceOptions = [
                { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
                { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
                { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
              ];
              
              addAIMessage(`Great choice! ${hobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
            } else {
              // Multiple hobbies detected
              const hobbyOptions = validation.detectedHobbies.map(h => ({
                value: h,
                label: `🎨 Start with ${h.charAt(0).toUpperCase() + h.slice(1)}`,
                description: `Focus on ${h} first`
              }));
              
              addAIMessage(`I found multiple hobbies! Which one would you like to start with?`, hobbyOptions);
            }
          } else {
            // Invalid hobby - use fallback suggestions
            addAIMessage(`I didn't quite catch that hobby. Could you be more specific? 🤔\n\nTry something like: guitar, cooking, drawing, photography, yoga, or coding. What hobby would you like to learn?`, [
              { value: 'guitar', label: 'Guitar', description: 'Learn guitar in 7 days' },
              { value: 'cooking', label: 'Cooking', description: 'Learn cooking in 7 days' },
              { value: 'drawing', label: 'Drawing', description: 'Learn drawing in 7 days' },
              { value: 'photography', label: 'Photography', description: 'Learn photography in 7 days' },
              { value: 'yoga', label: 'Yoga', description: 'Learn yoga in 7 days' },
              { value: 'coding', label: 'Coding', description: 'Learn coding in 7 days' }
            ]);
          }
        }
      } catch (error) {
        console.error('Error validating hobby with DeepSeek API:', error);
        // Fallback to old validation if API completely fails
        const validation = validateAndProcessHobby(userInput);
        
        if (validation.isValid && validation.detectedHobbies) {
          const hobby = validation.detectedHobbies[0];
          setSelectedHobby(hobby);
          setCurrentStep('experience');
          
          const experienceOptions = [
            { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
            { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
            { value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
          ];
          
          addAIMessage(`Great choice! ${hobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
        } else {
          addAIMessage(`I didn't quite catch that hobby. Could you be more specific? 🤔\n\nTry something like: guitar, cooking, drawing, photography, yoga, or coding. What hobby would you like to learn?`, [
            { value: 'guitar', label: 'Guitar', description: 'Learn guitar in 7 days' },
            { value: 'cooking', label: 'Cooking', description: 'Learn cooking in 7 days' },
            { value: 'drawing', label: 'Drawing', description: 'Learn drawing in 7 days' },
            { value: 'photography', label: 'Photography', description: 'Learn photography in 7 days' },
            { value: 'yoga', label: 'Yoga', description: 'Learn yoga in 7 days' },
            { value: 'coding', label: 'Coding', description: 'Learn coding in 7 days' }
          ]);
        }
      }
      return;
    } else {
      // General chat response for other steps
      setTimeout(() => {
        addAIMessage("Thanks for your message! How can I help you with your learning plan?");
      }, 1000);
    }
  };

  // Function to load progress from database for current plan
  const loadProgressFromDatabase = async (planId: string) => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Loading progress from database for plan:', planId);
      
      // First check session storage for immediate access
      const sessionKey = `progress_${user.id}_${planId}`;
      const sessionProgress = sessionStorage.getItem(sessionKey);
      if (sessionProgress) {
        try {
          const progress = JSON.parse(sessionProgress);
          console.log('✅ Found session storage progress:', progress.completed_days);
          setCompletedDays(progress.completed_days || []);
          setSelectedDay(progress.current_day || 1);
          return; // Exit early if we have session data
        } catch (e) {
          console.error('Failed to parse session progress');
        }
      }
      
      // Fallback to API
      const { data: progressData, error } = await apiService.getUserProgress(user.id);
      if (!error && progressData) {
        const planProgress = progressData.find((p: any) => p.plan_id === parseInt(planId));
        if (planProgress) {
          console.log('✅ Found database progress:', planProgress);
          setCompletedDays(planProgress.completed_days || []);
          setSelectedDay(planProgress.current_day || 1);
        } else {
          console.log('🔍 No progress found for plan:', planId);
        }
      }
    } catch (error) {
      console.error('❌ Error loading progress from database:', error);
    }
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => {
    if (dayNumber === 1) return true;
    // Days 2-7 require authentication
    return user && isDayCompleted(dayNumber - 1);
  };

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;
    
    // CRITICAL FIX: Check for plan ID before attempting database save
    if (!currentPlanId && (!initialPlanData?.id && !initialPlanData?.planId)) {
      console.warn('📝 DATABASE SAVE: No plan ID available - checking storage...');
      
      // Try to get plan ID from storage
      const storedPlanId = sessionStorage.getItem('currentPlanId') || localStorage.getItem('currentPlanId');
      if (storedPlanId) {
        console.log('🎯 Found plan ID in storage:', storedPlanId);
        setCurrentPlanId(storedPlanId);
      } else {
        console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
        console.log('📝 DEBUG:', {
          currentPlanId,
          hasInitialPlanData: !!initialPlanData,
          initialPlanDataId: initialPlanData?.id || initialPlanData?.planId,
          userId: user?.id,
          isAuthenticated: !!user
        });
      }
    }

    try {
      setIsSavingProgress(true);

      if (isDayCompleted(dayNumber)) {
        // Mark as incomplete
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);

        if (user?.id && currentPlanId) {
          // Save to database via API
          console.log('📝 DATABASE SAVE: Marking day INCOMPLETE via API:', dayNumber, 'for plan ID:', currentPlanId);
          try {
            await hobbyPlanService.updateProgress(user.id, currentPlanId, {
              completed_days: newCompletedDays,
              current_day: Math.max(1, Math.min(...newCompletedDays) || 1),
              unlocked_days: [1, ...newCompletedDays.map(d => d + 1)].filter(d => d <= 7)
            });
            console.log('📝 DATABASE SAVE: Successfully saved progress to database');
          } catch (error) {
            console.error('📝 DATABASE SAVE: Failed to save progress to database:', error);
            throw error;
          }
        } else {
          console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
        }
      } else {
        // Mark as complete
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);
        
        if (user?.id && currentPlanId) {
          // Save to database via API
          console.log('📝 DATABASE SAVE: Marking day COMPLETE via API:', dayNumber, 'for plan ID:', currentPlanId);
          try {
            await hobbyPlanService.completeDay(user.id, currentPlanId, dayNumber);
            console.log('📝 DATABASE SAVE: Successfully saved progress to database');
          } catch (error) {
            console.error('📝 DATABASE SAVE: Failed to save progress to database:', error);
            throw error;
          }
        } else {
          console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
          console.log('📝 DEBUG:', { hasUser: !!user, userId: user?.id, planId: currentPlanId, hobby: initialPlanData?.hobby });
          addAIMessage("Sign up to save your progress automatically! Your progress isn't saved without an account.", [], 500);
        }



        // Show congratulations message after completing Day 1
        if (dayNumber === 1 && !user) {
          addAIMessage("🎉 Well done! Day 1 completed! Sign up to unlock Days 2-7 and track your progress.", [], 500);
          setShowAuthModal(true);
        } else if (dayNumber === 7) {
          addAIMessage("🎊 Congratulations! You've completed your 7-day learning journey! You're amazing!", [], 500);
        } else if (user) {
          addAIMessage(`Great job! Day ${dayNumber} completed. Keep up the excellent work!`, [], 500);
        }
      }
    } catch (error) {
      console.error('Error updating day completion:', error);
      addAIMessage("Sorry, there was an error saving your progress. Please try again.", [], 500);
    } finally {
      setIsSavingProgress(false);
    }
  };

  // Day selection is now handled by selectedDay state

  const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
    const isCompleted = isDayCompleted(dayNumber);
    
    if (isCompleted) return 'completed';
    if (dayNumber === 1) return 'unlocked';
    if (dayNumber === 2 && !user) return 'unlocked';
    // Days 3-7 show as locked for non-authenticated users
    if (dayNumber > 2 && !user) return 'locked';
    // For authenticated users, follow normal progression
    if (isDayUnlocked(dayNumber)) return 'unlocked';
    return 'locked';
  };

  const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

  return (
    <div key={renderKey} className="min-h-screen bg-slate-50">
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={() => {
          console.log('🔙 BACK NAVIGATION: User manually clicked back button');
          console.log('🔙 BACK NAVIGATION: planData exists:', !!planData, 'user exists:', !!user);
          
          // FIXED: Always use default back behavior to prevent automatic navigation
          // The dashboard redirect was causing plans to disappear after generation
          console.log('🔙 BACK NAVIGATION: Using default back behavior (no auto-redirect)');
          onNavigateBack();
        }}
        currentPage={planData ? "plan" : "generate"}
      />

      <div 
        className="flex min-h-[calc(100vh-64px)]" 
        style={{ 
          flexDirection: isDesktop ? 'row' : 'column'
        }}
      >
        {/* Chat Interface - Mobile: Top, Desktop: Left */}
        {!isChatMinimized && (
          <div 
            className="bg-white border-gray-300 flex flex-col shrink-0"
            style={{
              width: isDesktop ? '40%' : '100%',
              height: isDesktop ? 'calc(100vh - 64px)' : window.innerWidth >= 768 ? '320px' : '256px',
              borderBottom: isDesktop ? 'none' : '2px solid #d1d5db',
              borderRight: isDesktop ? '2px solid #d1d5db' : 'none',
              backgroundColor: '#ffffff'
            }}
          >
          <div className="p-3 lg:p-4 border-b border-gray-200 shrink-0">
            <h2 className="text-sm lg:text-lg font-semibold text-gray-900">Learning Assistant</h2>
            <p className="text-xs lg:text-sm text-gray-600">Ask me anything about your plan</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 p-2">
                <p className="text-xs md:text-sm">Chat is ready! Ask me anything.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.id}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap text-xs lg:text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.options && currentStep !== 'plan' && !planData && (
                    <div className="mt-1 lg:mt-2 flex flex-wrap gap-1">
                      {message.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value, option.label)}
                          className="px-2 py-0.5 lg:py-1 text-xs lg:text-sm text-gray-700 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          disabled={isGenerating}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-2 md:px-3 py-1.5 md:py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 lg:p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-xs lg:text-sm h-8 lg:h-10"
              />
              <Button onClick={handleSendMessage} size="sm" className="px-2 lg:px-3 h-8 lg:h-10">
                <Send className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* Chat Toggle Button (when minimized and plan exists) */}
        {isChatMinimized && planData && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              onClick={() => setIsChatMinimized(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Chat Minimize Button (when chat is visible and plan exists) */}
        {!isChatMinimized && planData && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              onClick={() => setIsChatMinimized(true)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Plan Display - Mobile: Bottom, Desktop: Right */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            width: (isDesktop && !isChatMinimized) ? '60%' : '100%',
            height: isDesktop ? 'calc(100vh - 64px)' : 'auto',
            backgroundColor: '#f9fafb'
          }}
        >
{(planData && planData.days && Array.isArray(planData.days) && planData.days.length > 0) ? (
            <div className="p-4 lg:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-900">{planData.title}</h1>
                    <div className="flex items-center space-x-2 lg:space-x-4 mt-2">
                      <span className="inline-flex items-center px-2 lg:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {planData.difficulty}
                      </span>
                      <span className="text-xs lg:text-sm text-gray-600 flex items-center">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {planData.totalDays} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Day</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: planData.totalDays || 7 }, (_, i) => i + 1).map((dayNum) => {
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
                        className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center relative ${
                          isSelected 
                            ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                            : status === 'completed' 
                              ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                              : status === 'unlocked' 
                                ? 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200' 
                                : 'bg-gray-50 text-gray-400 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
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
                const currentDay = planData.days?.find((day: any) => day.day === selectedDay);
                const status = getDayStatus(selectedDay);
                
                if (!currentDay || status === 'locked' || !planData.days) {
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
                        <div className="flex items-center space-x-4">
                          {/* Achievement Image */}
                          <div 
                            className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center text-lg lg:text-2xl font-bold text-white shadow-lg flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, 
                                ${planData.hobby?.toLowerCase() === 'photography' ? '#3B82F6, #1D4ED8' : 
                                  planData.hobby?.toLowerCase() === 'guitar' ? '#F59E0B, #D97706' :
                                  planData.hobby?.toLowerCase() === 'cooking' ? '#EF4444, #DC2626' :
                                  planData.hobby?.toLowerCase() === 'drawing' ? '#8B5CF6, #7C3AED' :
                                  planData.hobby?.toLowerCase() === 'yoga' ? '#10B981, #059669' :
                                  planData.hobby?.toLowerCase() === 'gardening' ? '#22C55E, #16A34A' :
                                  planData.hobby?.toLowerCase() === 'coding' ? '#6366F1, #4F46E5' :
                                  planData.hobby?.toLowerCase() === 'dance' ? '#EC4899, #DB2777' :
                                  planData.hobby?.toLowerCase() === 'foraging' ? '#22C55E, #16A34A' :
                                  planData.hobby?.toLowerCase() === 'hiking' ? '#8B5A2B, #6B4423' :
                                  planData.hobby?.toLowerCase() === 'camping' ? '#059669, #047857' :
                                  planData.hobby?.toLowerCase() === 'chess' ? '#374151, #1F2937' :
                                  planData.hobby?.toLowerCase() === 'writing' ? '#7C3AED, #5B21B6' :
                                  planData.hobby?.toLowerCase() === 'reading' ? '#DC2626, #B91C1C' :
                                  planData.hobby?.toLowerCase() === 'piano' ? '#1F2937, #111827' :
                                  planData.hobby?.toLowerCase() === 'singing' ? '#EC4899, #DB2777' :
                                  planData.hobby?.toLowerCase() === 'baking' ? '#F59E0B, #D97706' :
                                  planData.hobby?.toLowerCase() === 'knitting' ? '#8B5CF6, #7C3AED' :
                                  planData.hobby?.toLowerCase() === 'pottery' ? '#A3A3A3, #737373' :
                                  planData.hobby?.toLowerCase().includes('history') ? '#8B5CF6, #7C3AED' :
                                  '#6B7280, #4B5563'})`
                            }}
                          >
                            {planData.hobby?.toLowerCase() === 'photography' ? '📸' : 
                             planData.hobby?.toLowerCase() === 'guitar' ? '🎸' :
                             planData.hobby?.toLowerCase() === 'cooking' ? '👨‍🍳' :
                             planData.hobby?.toLowerCase() === 'drawing' ? '🎨' :
                             planData.hobby?.toLowerCase() === 'yoga' ? '🧘' :
                             planData.hobby?.toLowerCase() === 'gardening' ? '🌱' :
                             planData.hobby?.toLowerCase() === 'coding' ? '💻' :
                             planData.hobby?.toLowerCase() === 'dance' ? '💃' :
                             planData.hobby?.toLowerCase() === 'foraging' ? '🌿' :
                             planData.hobby?.toLowerCase() === 'hiking' ? '🥾' :
                             planData.hobby?.toLowerCase() === 'camping' ? '🏕️' :
                             planData.hobby?.toLowerCase() === 'chess' ? '♟️' :
                             planData.hobby?.toLowerCase() === 'writing' ? '✍️' :
                             planData.hobby?.toLowerCase() === 'reading' ? '📚' :
                             planData.hobby?.toLowerCase() === 'piano' ? '🎹' :
                             planData.hobby?.toLowerCase() === 'singing' ? '🎤' :
                             planData.hobby?.toLowerCase() === 'baking' ? '🧁' :
                             planData.hobby?.toLowerCase() === 'knitting' ? '🧶' :
                             planData.hobby?.toLowerCase() === 'pottery' ? '🏺' :
                             planData.hobby?.toLowerCase().includes('history') ? '📚' :
                             '🎯'}
                          </div>
                          
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                              {currentDay.title.startsWith('Day ') ? currentDay.title : `Day ${currentDay.day}: ${currentDay.title}`}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Today's Learning Goal</p>
                          </div>
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
                        {/* Hero Section with Main Task */}
                        <div 
                          className="text-white p-8 md:p-12 relative overflow-hidden"
                          style={{
                            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${getHobbyImage(planData?.hobby || initialPlanData?.hobby || selectedHobby || '')})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <div className="max-w-4xl">
                            <div className="flex items-center mb-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-4 flex items-center justify-center text-3xl shadow-lg">
                                {planData?.hobby?.toLowerCase() === 'photography' ? '📸' : 
                                 planData?.hobby?.toLowerCase() === 'guitar' ? '🎸' :
                                 planData?.hobby?.toLowerCase() === 'cooking' ? '👨‍🍳' :
                                 planData?.hobby?.toLowerCase() === 'drawing' ? '🎨' :
                                 planData?.hobby?.toLowerCase() === 'yoga' ? '🧘' :
                                 planData?.hobby?.toLowerCase() === 'gardening' ? '🌱' :
                                 planData?.hobby?.toLowerCase() === 'coding' ? '💻' :
                                 planData?.hobby?.toLowerCase() === 'dance' ? '💃' :
                                 planData?.hobby?.toLowerCase() === 'foraging' ? '🌿' :
                                 planData?.hobby?.toLowerCase() === 'hiking' ? '🥾' :
                                 planData?.hobby?.toLowerCase() === 'camping' ? '🏕️' :
                                 planData?.hobby?.toLowerCase() === 'chess' ? '♟️' :
                                 planData?.hobby?.toLowerCase() === 'writing' ? '✍️' :
                                 planData?.hobby?.toLowerCase() === 'reading' ? '📚' :
                                 planData?.hobby?.toLowerCase() === 'piano' ? '🎹' :
                                 planData?.hobby?.toLowerCase() === 'singing' ? '🎤' :
                                 planData?.hobby?.toLowerCase() === 'baking' ? '🧁' :
                                 planData?.hobby?.toLowerCase() === 'knitting' ? '🧶' :
                                 planData?.hobby?.toLowerCase() === 'pottery' ? '🏺' :
                                 planData?.hobby?.toLowerCase().includes('history') ? '📚' :
                                 '🎯'}
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
                          {/* Why This Matters */}
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
                      
                          {/* Step-by-Step Guide */}
                          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                              <div className="bg-indigo-500 rounded-full p-1.5 mr-3">
                                <span className="text-white text-sm">🔍</span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">Step-by-Step Guide</h3>
                            </div>
                            <div className="space-y-2">
                              {currentDay.howTo.map((step, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="text-gray-800 text-sm leading-relaxed flex-1">{step}</div>
                                </div>
                            ))}
                            </div>
                          </section>
                      
                          {/* Video Tutorial Section - Simple */}
                          <section className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Video Tutorial</h3>
                            
                            {(() => {
                              console.log('🐛 Debug YouTube Video ID:', currentDay.youtubeVideoId);
                              console.log('🐛 Video Title:', currentDay.videoTitle);
                              return currentDay.youtubeVideoId;
                            })() ? (
                              <YouTubeEmbed 
                                videoId={currentDay.youtubeVideoId}
                                title=""
                                className="w-full"
                              />
                            ) : (
                              <div className="text-center py-6">
                                <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                  <Play className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-sm">Professional learning video selected</p>
                              </div>
                            )}
                          </section>

                          {/* What You Need - Mobile Optimized */}
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
                            
                          {/* Success Tips - Mobile Optimized */}
                          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
                            <div className="flex items-center mb-3">
                              <div className="bg-amber-500 rounded-full p-1.5 mr-3">
                                <span className="text-white text-sm">💡</span>
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-amber-900">Success Tips</h3>
                            </div>
                            <div className="space-y-2">
                              {currentDay.tips && currentDay.tips.length > 0 ? currentDay.tips.map((tip, index) => {
                                const iconMap = [Star, Lightbulb, Target, CheckCircle, Trophy];
                                const IconComponent = iconMap[index % iconMap.length];
                                console.log(`TIP ${index}: Using icon at index ${index % iconMap.length}`);
                                return (
                                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                      <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <IconComponent className="w-3 h-3 text-green-600" />
                                      </div>
                                      <p className="text-gray-800 text-sm font-medium leading-relaxed">{tip}</p>
                                    </div>
                                  </div>
                                );
                              }) : (
                                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                  <p className="text-gray-600 text-sm">No tips available for this day.</p>
                                </div>
                              )}
                            </div>
                          </section>

                          {/* Avoid These Mistakes - Mobile Optimized */}
                          <section className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
                            <div className="flex items-center mb-3">
                              <div className="bg-red-500 rounded-full p-1.5 mr-3">
                                <span className="text-white text-sm">⚠️</span>
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-red-900">Avoid These Mistakes</h3>
                            </div>
                            <div className="space-y-2">
                              {(() => {
                                console.log('🐛 Debug Common Mistakes:', currentDay.commonMistakes);
                                console.log('🐛 Full current day data:', currentDay);
                                return currentDay.commonMistakes && currentDay.commonMistakes.length > 0;
                              })() ? currentDay.commonMistakes.map((mistake: string, index: number) => {
                                const iconMap = [X, AlertTriangle, Ban, StopCircle, XCircle];
                                const IconComponent = iconMap[index % iconMap.length];
                                console.log(`MISTAKE ${index}: Using icon at index ${index % iconMap.length}`);
                                return (
                                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-3 border-red-400">
                                    <div className="flex items-start">
                                      <div className="bg-red-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <IconComponent className="w-3 h-3 text-red-600" />
                                      </div>
                                      <p className="text-gray-800 text-sm font-medium leading-relaxed">{mistake}</p>
                                    </div>
                                  </div>
                                );
                              }) : (
                                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                                  <p className="text-gray-600 text-sm">No common mistakes listed for this day.</p>
                                </div>
                              )}
                            </div>
                          </section>

                          {/* Learning Resources - Mobile-Optimized */}
                          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6">
                            <div className="flex items-center mb-4">
                              <div className="bg-blue-500 rounded-full p-1.5 mr-3">
                                <span className="text-white text-sm">🔗</span>
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-blue-900">Resources</h3>
                            </div>
                            <div className="space-y-3">
                              {/* USER PREFERENCE: Only affiliate links, no free tutorials */}
                            
                              {/* Recommended Tools - Compact, No Pricing */}
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
          ) : (
            <div className="flex items-center justify-center min-h-full p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Welcome Section */}
                <div className="text-center">
                  <div className="text-6xl mb-6">🎯</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. 
                    Your custom learning plan will appear here once we chat!
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
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

                {/* How to Get Started */}
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

                {/* Popular Learning Paths */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Learning Paths</h3>
                  <p className="text-gray-600 mb-4">Not sure what to learn? Here are some popular hobbies our AI has created amazing plans for:</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">📸</div>
                      <div className="text-xs font-medium text-gray-700">Photography</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🎨</div>
                      <div className="text-xs font-medium text-gray-700">Painting</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🍳</div>
                      <div className="text-xs font-medium text-gray-700">Cooking</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">💻</div>
                      <div className="text-xs font-medium text-gray-700">Coding</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🧶</div>
                      <div className="text-xs font-medium text-gray-700">Knitting</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🏡</div>
                      <div className="text-xs font-medium text-gray-700">Gardening</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">✍️</div>
                      <div className="text-xs font-medium text-gray-700">Writing</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">♟️</div>
                      <div className="text-xs font-medium text-gray-700">Chess</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🎸</div>
                      <div className="text-xs font-medium text-gray-700">Guitar</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🧘</div>
                      <div className="text-xs font-medium text-gray-700">Yoga</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-xs font-medium text-gray-700">Reading</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🏃</div>
                      <div className="text-xs font-medium text-gray-700">Running</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}