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

// Automated hobby image system
const getHobbyImage = (hobby: string): string => {
  const normalizedHobby = hobby?.toLowerCase() || '';
  
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
    
    // Creative arts and crafts
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
    
    // Culinary and food
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
    
    // Fitness and movement
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
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60));
  const finalImage = `${selectedImage}&t=${timestamp}`;
  
  return finalImage;
};

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

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  options?: { value: string; label: string; description: string }[];
  timestamp: Date;
}

// Function to fix field mapping consistently across all plan data sources
const fixPlanDataFields = (plan: any): PlanData => {
  if (!plan) return plan;
  
  const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
  
  if (plan.days?.[0]) {
    // Process each day to ensure consistent field mapping
    const processedDays = daysArray.map((day: any) => ({
      ...day,
      mistakesToAvoid: day.mistakesToAvoid || day.commonMistakes || [
        "Rushing through exercises without understanding concepts",
        "Skipping practice time or cutting sessions short", 
        "Not taking notes or tracking your improvement"
      ],
      commonMistakes: day.commonMistakes || day.mistakesToAvoid || []
    }));
    
    return {
      ...plan,
      days: processedDays
    };
  }
  
  return plan;
};

const ICONS = [
  Target, Lightbulb, CheckCircle, Star, Trophy, BookOpen, Clock, Play, ExternalLink
];

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initialize with welcome message immediately if no plan data
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
  
  // Plan management state
  const [planData, setPlanData] = useState<PlanData | null>(initialPlanData || null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { user, isSignedIn } = useAuth();
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  
  // Message scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Plan processing and initialization
  useEffect(() => {
    if (initialPlanData) {
      const processedPlan = fixPlanDataFields(initialPlanData);
      setPlanData(processedPlan);
      setCurrentStep('plan');
      setSelectedHobby(processedPlan.hobby);
    }
  }, [initialPlanData]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Plan storage and progress initialization
  useEffect(() => {
    const initializePlan = async () => {
      if (!planData) return;
      
      const planId = planData.id || planData.planId || `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCurrentPlanId(planId);
      
      if (isSignedIn && user && planData) {
        try {
          const savedPlan = await hobbyPlanService.savePlan({
            hobby: planData.hobby,
            title: planData.title,
            overview: planData.overview || '',
            plan_data: planData
          }, user.id);

          setCurrentPlanId(savedPlan?.id?.toString() || planId);
          
          // Initialize progress tracking
          const progressData = await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
          setUserProgress(progressData);
        } catch (error: any) {
          // Continue without database save
        }
      }
    };

    if (planData) {
      initializePlan();
    }
  }, [isSignedIn, user, planData]);

  // Chat functionality
  const generateSurpriseHobby = () => {
    const surpriseHobbies = [
      'pottery', 'calligraphy', 'origami', 'bonsai', 'astronomy', 'magic tricks',
      'beatboxing', 'juggling', 'chess', 'sudoku', 'crossword puzzles', 'scrapbooking',
      'candle making', 'soap making', 'jewelry making', 'embroidery', 'knitting',
      'crocheting', 'woodworking', 'leather crafting', 'glass blowing', 'metalworking',
      'blacksmithing', 'stone carving', 'mosaic art', 'stained glass', 'macramé',
      'quilting', 'weaving', 'spinning', 'dyeing', 'printmaking', 'bookbinding'
    ];
    return surpriseHobbies[Math.floor(Math.random() * surpriseHobbies.length)];
  };

  const addMessage = (sender: 'user' | 'ai', content: string, options?: any[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      content,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    addMessage('user', userMessage);
    setCurrentInput('');
    setIsTyping(true);

    setTimeout(() => {
      if (currentStep === 'plan' && planData) {
        // Handle chat in plan view
        const contextualResponse = generateContextualResponse(userMessage, planData);
        addMessage('ai', contextualResponse);
      } else {
        // Handle generation flow
        handleGenerationFlow(userMessage);
      }
      setIsTyping(false);
    }, 1000);
  };

  const generateContextualResponse = (question: string, planData: PlanData): string => {
    const q = question.toLowerCase().trim();
    const hobby = planData?.hobby || 'hobby';
    
    // Skills improvement questions
    if (q.includes('improve') || q.includes('better') || q.includes('skill') || q.includes('advance')) {
      return `Here's how to improve your ${hobby} skills progressively:\n\n**Foundation (Days 1-2):**\n• Master basic techniques and fundamentals\n• Practice consistently with proper form\n• Build muscle memory through repetition\n\n**Intermediate (Days 3-5):**\n• Learn advanced techniques and combinations\n• Develop your personal style\n• Challenge yourself with complex exercises\n\n**Advanced (Days 6-7):**\n• Perfect advanced skills and timing\n• Create original work or compositions\n• Focus on refinement and mastery\n\nYour 7-day plan covers all these progressively!`;
    }

    // Tips requests
    if (q.includes('tip') || q.includes('advice') || q.includes('suggestion')) {
      if (planData?.days && planData.days.length > 0) {
        const day1 = planData.days.find((day: any) => day.day === 1) || planData.days[0];
        if (day1?.tips && day1.tips.length > 0) {
          return `Here are some key tips for your ${hobby} journey:\n\n${day1.tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}\n\nThese come from Day 1 of your plan. Each day has specific tips tailored to what you're learning!`;
        }
      }
      return `Here are some essential ${hobby} learning tips:\n\n1. Start with proper fundamentals - don't rush the basics\n2. Practice consistently, even 15-20 minutes daily\n3. Be patient with yourself and celebrate small wins\n4. Take notes and track your progress\n\nYour plan has specific tips for each day too!`;
    }
    
    // Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      return `Hello! I'm here to help you with your ${hobby} learning journey. You can ask me about specific techniques, daily activities, equipment, time management, or any questions about your 7-day plan. What would you like to know?`;
    }
    
    // Default response
    return `I'm here to help with your ${hobby} learning plan! You can ask me about:\n• Getting started with Day 1\n• Daily activities and techniques\n• Equipment and setup\n• Practice tips and techniques\n• Time management\n• Progress tracking\n\nWhat aspect of your ${hobby} learning would you like help with?`;
  };

  const handleGenerationFlow = (userMessage: string) => {
    if (currentStep === 'hobby') {
      let hobby = userMessage.toLowerCase();
      
      if (hobby === 'surprise me' || hobby === 'surprise') {
        hobby = generateSurpriseHobby();
        addMessage('ai', `🎲 Surprise! I've picked **${hobby}** for you - it's a fascinating hobby that combines creativity and skill. Let's create your learning plan!\n\nWhat's your experience level with ${hobby}?`, [
          { value: 'none', label: 'Complete Beginner', description: 'Never tried this before' },
          { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
          { value: 'intermediate', label: 'Intermediate', description: 'Have some solid skills' }
        ]);
      } else {
        addMessage('ai', `Great choice! ${hobby} is an amazing hobby to learn. What's your experience level?`, [
          { value: 'none', label: 'Complete Beginner', description: 'Never tried this before' },
          { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
          { value: 'intermediate', label: 'Intermediate', description: 'Have some solid skills' }
        ]);
      }
      
      setSelectedHobby(hobby);
      setCurrentStep('experience');
    } else if (currentStep === 'experience') {
      setQuizAnswers(prev => ({ ...prev, experience: userMessage }));
      addMessage('ai', `Perfect! How much time can you dedicate each day?`, [
        { value: '15-30 minutes', label: '15-30 minutes', description: 'Quick daily sessions' },
        { value: '30-60 minutes', label: '30-60 minutes', description: 'Standard practice time' },
        { value: '1-2 hours', label: '1-2 hours', description: 'Deep learning sessions' }
      ]);
      setCurrentStep('time');
    } else if (currentStep === 'time') {
      setQuizAnswers(prev => ({ ...prev, timeAvailable: userMessage }));
      addMessage('ai', `Excellent! What's your main goal for learning ${selectedHobby}?`, [
        { value: 'personal enjoyment', label: 'Personal Enjoyment', description: 'Just for fun and relaxation' },
        { value: 'skill building', label: 'Skill Building', description: 'Want to get really good at this' },
        { value: 'creative expression', label: 'Creative Expression', description: 'Express myself artistically' }
      ]);
      setCurrentStep('goal');
    } else if (currentStep === 'goal') {
      setQuizAnswers(prev => ({ ...prev, goal: userMessage }));
      generatePlan();
    }
  };

  const generatePlan = async () => {
    setCurrentStep('generating');
    addMessage('ai', `🤖 Creating your personalized 7-day ${selectedHobby} plan...\n\nThis may take a moment as I customize everything for your ${quizAnswers.experience} level and ${quizAnswers.timeAvailable} daily commitment.`);

    try {
      const userId = user?.id;
      const completeAnswers: QuizAnswers = {
        experience: quizAnswers.experience || 'beginner',
        timeAvailable: quizAnswers.timeAvailable || '30-60 minutes',
        goal: quizAnswers.goal || 'personal enjoyment'
      };

      const generatedPlan = await onGeneratePlan(selectedHobby, completeAnswers, userId);
      
      const processedPlan = fixPlanDataFields(generatedPlan);
      setPlanData(processedPlan);
      setCurrentStep('plan');
      
      // Store plan data for navigation
      sessionStorage.setItem('currentPlanData', JSON.stringify(processedPlan));
      localStorage.setItem('lastViewedPlanData', JSON.stringify(processedPlan));
      
      addMessage('ai', `🎉 Your personalized ${selectedHobby} plan is ready! I've created a comprehensive 7-day journey that will take you from ${quizAnswers.experience || 'beginner'} to confident practitioner.\n\nEach day includes step-by-step instructions, helpful tips, and everything you need to succeed. Ready to start your learning adventure?`);

    } catch (error: any) {
      if (error.message === 'DUPLICATE_PLAN' && error.duplicateData) {
        // Handle duplicate plan error
        const duplicateData = error.duplicateData;
        addMessage('ai', `I found that you already have a ${selectedHobby} plan! Would you like to:\n\n🔄 **Continue your existing plan** - Pick up where you left off\n🆕 **Create a new plan** - Start fresh with updated content\n\nYour existing plan: "${duplicateData.existingPlan?.title || 'Your previous plan'}"`);
      } else {
        addMessage('ai', `I encountered an issue generating your plan, but don't worry! I've created a comprehensive fallback plan for ${selectedHobby} that will still give you an excellent learning experience.`);
        
        // Create a basic fallback plan structure
        const fallbackPlan = createFallbackPlan(selectedHobby, quizAnswers);
        const processedPlan = fixPlanDataFields(fallbackPlan);
        setPlanData(processedPlan);
        setCurrentStep('plan');
      }
    }
  };

  const createFallbackPlan = (hobby: string, answers: Partial<QuizAnswers>): PlanData => {
    return {
      hobby: hobby,
      title: `Master ${hobby.charAt(0).toUpperCase() + hobby.slice(1)} in 7 Days`,
      overview: `A comprehensive ${hobby} learning plan tailored for your level.`,
      difficulty: answers.experience || 'beginner',
      totalDays: 7,
      days: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${hobby} Fundamentals`,
        mainTask: `Learn essential ${hobby} techniques and practice hands-on exercises.`,
        explanation: `Day ${i + 1} focuses on building your foundation in ${hobby}.`,
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
          `Practice regularly for best results`,
          `Don't hesitate to repeat difficult parts`
        ],
        mistakesToAvoid: [
          `Rushing through exercises`,
          `Skipping practice time`,
          `Not taking notes`
        ],
        freeResources: [],
        affiliateProducts: [{
          title: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Starter Kit`,
          link: `https://amazon.com/s?k=${encodeURIComponent(hobby)}+beginner+kit&tag=wizqohobby-20`,
          price: `$${19 + i * 5}.99`
        }],
        youtubeVideoId: 'dQw4w9WgXcQ',
        videoTitle: `${hobby} Day ${i + 1} Tutorial`,
        estimatedTime: answers.timeAvailable || '30-60 minutes',
        skillLevel: answers.experience || 'beginner'
      }))
    };
  };

  const handleOptionClick = (value: string) => {
    addMessage('user', value);
    handleGenerationFlow(value);
  };

  // Plan Display Functions
  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => dayNumber === 1 || isDayCompleted(dayNumber - 1);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;

    try {
      setIsSavingProgress(true);

      if (isDayCompleted(dayNumber)) {
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);

        if (isSignedIn && user && currentPlanId) {
          await hobbyPlanService.updateProgress(user.id, currentPlanId.toString(), {
            completed_days: newCompletedDays,
            current_day: Math.max(1, Math.min(...newCompletedDays) || 1),
            unlocked_days: [1, ...newCompletedDays.map(d => d + 1)].filter(d => d <= 7)
          });
        }
      } else {
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);

        if (isSignedIn && user && currentPlanId) {
          await hobbyPlanService.completeDay(user.id, currentPlanId.toString(), dayNumber);
        }
        
        if (dayNumber === 1 && !isSignedIn) {
          setShowAuthModal(true);
        }
      }
    } catch (error: any) {
      // Handle error silently or show user-friendly message
    } finally {
      setIsSavingProgress(false);
    }
  };

  const toggleDayExpansion = (dayNumber: number) => {
    if (isDayUnlocked(dayNumber)) {
      setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
    }
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (isDayUnlocked(dayNumber)) return 'unlocked';
    return 'locked';
  };

  const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

  // Render logic
  if (currentStep === 'plan' && planData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
        <UnifiedNavigation 
          showBackButton={true} 
          onBackClick={onNavigateBack}
          currentPage="plan"
        />

        <div className={`${isMobile ? 'flex flex-col' : 'flex'} min-h-[calc(100vh-80px)]`}>
          {/* Chat Section */}
          <div className={`${isMobile ? 'h-64' : 'w-1/2'} bg-white dark:bg-gray-800 flex flex-col border-r border-slate-200 dark:border-gray-700`}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option.value)}
                            className="w-full text-left p-2 bg-white/10 hover:bg-white/20 rounded border text-sm transition-colors"
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs opacity-75">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-gray-700 rounded-lg p-3 text-slate-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask me anything about your ${planData.hobby} plan...`}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className={`${isMobile ? 'flex-1' : 'w-1/2'} overflow-y-auto p-4`}>
            {/* Plan Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                  {planData.title}
                </h1>
                <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{completedDays.length} of {planData.totalDays} Days • {Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Plan Overview */}
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-gray-300 mb-4">
                  {planData.overview}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                    {planData.difficulty} Level
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {planData.totalDays} Days
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Plan Cards */}
            <div className="space-y-4">
              {planData.days.map((day) => {
                const status = getDayStatus(day.day);
                const isExpanded = expandedDay === day.day;
                
                return (
                  <Card key={day.day} className="overflow-hidden">
                    <CardHeader 
                      className={`cursor-pointer transition-colors ${
                        status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700' :
                        status === 'unlocked' ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700' :
                        'bg-slate-100 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700'
                      }`}
                      onClick={() => toggleDayExpansion(day.day)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status === 'completed' ? 'bg-green-500' :
                            status === 'unlocked' ? 'bg-blue-500' :
                            'bg-slate-400'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : status === 'unlocked' ? (
                              <Circle className="w-5 h-5 text-white" />
                            ) : (
                              <Lock className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              Day {day.day}: {day.title}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-gray-400 flex items-center mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {day.estimatedTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {status === 'unlocked' && !isDayCompleted(day.day) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDayCompletion(day.day);
                              }}
                              disabled={isSavingProgress}
                            >
                              Complete
                            </Button>
                          )}
                          {isDayCompleted(day.day) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDayCompletion(day.day);
                              }}
                              disabled={isSavingProgress}
                            >
                              Mark Incomplete
                            </Button>
                          )}
                          {isDayUnlocked(day.day) ? (
                            isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
                          ) : (
                            <span className="text-sm text-slate-500 dark:text-gray-400">Locked</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="p-4 space-y-6">
                        {/* Main Task */}
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <Target className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Main Task</h4>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{day.mainTask}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Why This Matters */}
                        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <Lightbulb className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Why This Matters</h4>
                                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">{day.explanation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Tips and Mistakes Grid */}
                        <div className="grid lg:grid-cols-2 gap-4">
                          {/* Tips for Success */}
                          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <h4 className="font-semibold text-green-900 dark:text-green-300">Tips for Success</h4>
                              </div>
                              <ul className="space-y-2">
                                {day.tips.map((tip, index) => {
                                  const IconComponent = ICONS[index % ICONS.length];
                                  return (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-green-800 dark:text-green-200">
                                      <IconComponent className="w-3 h-3 mt-1 flex-shrink-0 text-green-500" />
                                      <span className="leading-relaxed">{tip}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </CardContent>
                          </Card>

                          {/* Avoid These Mistakes */}
                          <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <AlertTriangle className="w-3 h-3 text-white" />
                                </div>
                                <h4 className="font-semibold text-red-900 dark:text-red-300">Avoid These Mistakes</h4>
                              </div>
                              <ul className="space-y-2">
                                {(day.mistakesToAvoid || day.commonMistakes || []).map((mistake, index) => {
                                  const MistakeIcons = [XCircle, StopCircle, Ban];
                                  const IconComponent = MistakeIcons[index % MistakeIcons.length];
                                  return (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-red-800 dark:text-red-200">
                                      <IconComponent className="w-3 h-3 mt-1 flex-shrink-0 text-red-500" />
                                      <span className="leading-relaxed">{mistake}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Video Tutorial */}
                        {day.youtubeVideoId && (
                          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <Play className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                                <h4 className="font-semibold text-slate-900 dark:text-gray-100">Video Tutorial</h4>
                              </div>
                              <YouTubeEmbed
                                videoId={day.youtubeVideoId}
                                title={day.videoTitle || `${day.title} Tutorial`}
                              />
                            </CardContent>
                          </Card>
                        )}

                        {/* How-To Steps */}
                        {day.howTo && day.howTo.length > 0 && (
                          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-l-4 border-l-orange-500">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Step-by-Step Guide
                              </h4>
                              <ol className="space-y-2">
                                {day.howTo.map((step, index) => (
                                  <li key={index} className="flex items-start space-x-3 text-sm text-orange-800 dark:text-orange-200">
                                    <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                      {index + 1}
                                    </span>
                                    <span className="leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </CardContent>
                          </Card>
                        )}

                        {/* Today's Checklist */}
                        {day.checklist && day.checklist.length > 0 && (
                          <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-l-4 border-l-cyan-500">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-3 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Today's Checklist
                              </h4>
                              <ul className="space-y-2">
                                {day.checklist.map((item, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-sm text-cyan-800 dark:text-cyan-200">
                                    <div className="w-4 h-4 border-2 border-cyan-500 rounded flex-shrink-0"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Resources */}
                        {day.affiliateProducts && day.affiliateProducts.length > 0 && (
                          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-l-yellow-500">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Recommended Resources
                              </h4>
                              <div className="space-y-2">
                                {day.affiliateProducts.map((product, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                                    <div>
                                      <div className="font-medium text-sm text-slate-900 dark:text-gray-100">{product.title}</div>
                                      <div className="text-xs text-slate-600 dark:text-gray-400">{product.price}</div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(product.link, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            title="Save Your Progress"
            description="Sign up to save your learning progress and access your plans from any device."
          />
        )}
      </div>
    );
  }

  // Chat-only view (generation flow)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={onNavigateBack}
        currentPage="generate"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-gray-100'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.options && (
                    <div className="mt-4 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option.value)}
                          className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded border transition-colors"
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm opacity-75">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-gray-700 rounded-lg p-4 text-slate-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-6 border-t border-slate-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
                disabled={currentStep === 'generating'}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={currentStep === 'generating' || !currentInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}