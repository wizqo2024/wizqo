/**
 * Custom hook for managing plan chat interface
 * 
 * Extracted from SplitPlanInterface.tsx for better organization and reusability.
 * 
 * This hook manages all chat-related state and logic including:
 * - Chat messages and conversation flow
 * - User input and validation
 * - Plan generation workflow
 * - Quiz answers and step progression
 * 
 * @example
 * ```tsx
 * // IMPORTANT: Declare these BEFORE calling usePlanChat:
 * const { user } = useAuth();
 * const [planData, setPlanData] = useState<PlanData | null>(null);
 * const planProgressTimerRef = useRef<number | null>(null);
 * 
 * const chat = usePlanChat({
 *   onGeneratePlan,
 *   initialPlanData,
 *   planData,
 *   onPlanGenerated: (plan) => setPlanData(plan),
 *   onPlanIdSet,
 *   onShowAuthModal,
 *   planProgressTimerRef,
 * });
 * ```
 */

import { useState, useRef } from 'react';
import type { ChatMessage, QuizAnswers, PlanData } from '@/types/plan';
import { validateAndProcessHobby, highlightHobby } from '@/utils/planValidation';
import { fixPlanDataFields } from '@/utils/planDataFix';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useAuth } from '@/hooks/useAuth';

/**
 * Props for the usePlanChat hook
 */
interface UsePlanChatProps {
  /** Function to generate a plan based on hobby and quiz answers */
  onGeneratePlan: (hobby: string, answers: QuizAnswers) => Promise<any>;
  /** Initial plan data if loading an existing plan */
  initialPlanData?: PlanData;
  /** Current plan data for post-plan chat */
  planData?: PlanData | null;
  /** Callback when a plan is generated */
  onPlanGenerated: (plan: PlanData) => void;
  /** Callback when plan ID is set */
  onPlanIdSet: (planId: string) => void;
  /** Callback to show/hide auth modal */
  onShowAuthModal: (show: boolean) => void;
  /** Ref for plan progress timer */
  planProgressTimerRef: React.MutableRefObject<number | null>;
}

export function usePlanChat({
  onGeneratePlan,
  initialPlanData,
  planData,
  onPlanGenerated,
  onPlanIdSet,
  onShowAuthModal,
  planProgressTimerRef,
}: UsePlanChatProps) {
  const { user } = useAuth();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!initialPlanData && !((typeof window !== 'undefined' ? window.location.hash : '').includes('#/plan'))) {
      return [{
        id: '1',
        sender: 'ai' as const,
        content: "Hi! 👋 I'm here to help you learn any hobby in just 7 days.\n\nI'll create a personalized learning plan just for you. What would you like to learn?",
        options: [
          { value: 'photography', label: 'Photography 📸', description: 'Capture amazing moments' },
          { value: 'reading', label: 'Reading 📚', description: 'Build a daily reading habit' },
          { value: 'cooking', label: 'Cooking 👨‍🍳', description: 'Create delicious meals' },
          { value: 'drawing', label: 'Drawing 🎨', description: 'Express your creativity' },
          { value: 'yoga', label: 'Yoga 🧘', description: 'Find balance and peace' },
          { value: 'gardening', label: 'Gardening 🌱', description: 'Grow your own plants' },
          { value: 'coding', label: 'Coding 💻', description: 'Build your first app' },
          { value: 'cloudspotting', label: 'Cloudspotting ☁️', description: 'Learn to read the sky' },
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [planProgressPercent, setPlanProgressPercent] = useState<number>(0);
  const [answeredSteps, setAnsweredSteps] = useState<Set<'hobby' | 'experience' | 'time' | 'goal'>>(() => new Set());

  // Constants
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

  // Helper functions
  const precheckPlanLimit = async () => {
    try {
      if (!user?.id) return false;
      const r = await fetch(`/api/hobby-plans?user_id=${user.id}&_t=${Date.now()}`, { cache: 'no-cache' });
      if (!r.ok) return false;
      const arr = await r.json();
      return Array.isArray(arr) && arr.length >= 5;
    } catch {
      return false;
    }
  };

  const precheckDuplicate = async (hobbyName: string) => {
    try {
      if (!user?.id) return false;
      const r = await fetch(`/api/hobby-plans?user_id=${user.id}&_t=${Date.now()}`, { cache: 'no-cache' });
      if (!r.ok) return false;
      const arr = await r.json();
      const normalize = (s: any) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const target = normalize(hobbyName);
      return (Array.isArray(arr) ? arr : []).some((p: any) => {
        const h1 = normalize(p.hobby);
        const h2 = normalize(p.hobby_name);
        const hp = normalize(p.plan_data?.hobby || p.plan_data?.hobby_name);
        const m = String(p.title || '').match(/(?:Learn|Master)\s+(.+?)\s+in/i);
        const ht = m ? normalize(m[1]) : '';
        return [h1, h2, hp, ht].some(v => v && v === target);
      });
    } catch {
      return false;
    }
  };

  // Message handlers
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
    // Duplicate check
    if (await precheckDuplicate(randomHobby)) {
      addAIMessage(`⚠️ You already have a ${highlightHobby(randomHobby, randomHobby)} plan in your dashboard. Open it to continue learning!`);
      return;
    }
    // Block if user has reached plan limit
    if (await precheckPlanLimit()) {
      addAIMessage("⚠️ Plan limit reached (5 per account). Subscription plans coming soon.");
      return;
    }
    setCurrentStep('generating');
    setIsGenerating(true);
    // Start staged progress to 85% while awaiting server
    try { if (planProgressTimerRef.current) window.clearInterval(planProgressTimerRef.current); } catch {}
    setPlanProgressPercent(0);
    planProgressTimerRef.current = window.setInterval(() => {
      setPlanProgressPercent(prev => {
        const next = prev < 85 ? Math.min(85, prev + 2) : prev;
        return next;
      });
    }, 300);
    try {
      const plan = await onGeneratePlan(randomHobby, surpriseAnswers).catch((e: any) => {
        const msg = String(e?.message || e);
        if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already have a learning plan')) {
          addAIMessage(`⚠️ You already have a ${highlightHobby(randomHobby, randomHobby)} plan in your dashboard. Open it to continue learning!`);
        }
        if (msg.includes('Plan limit reached')) {
          addAIMessage("⚠️ Plan limit reached (5 per account). Subscription plans coming soon.");
        }
        throw e;
      });
      const correctedPlanData = fixPlanDataFields(plan);
      onPlanGenerated(correctedPlanData);
      if (user?.id) {
        try {
          const planDataWithCorrectFields = fixPlanDataFields(plan);
          const savedPlan = await hobbyPlanService.savePlan({ hobby: randomHobby, title: plan.title, overview: plan.overview, plan_data: planDataWithCorrectFields }, user.id);
          onPlanIdSet(savedPlan.id.toString());
          await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
          addAIMessage(`Your ${randomHobby} plan is ready and saved! 🎉 Check it out on the right side. Your progress will be tracked automatically!`, undefined, 500);
        } catch (saveError) {
          addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Progress tracking is unavailable right now, but you can still use your plan!`, undefined, 500);
        }
      } else {
        addAIMessage(`Your ${randomHobby} plan is ready! 🎉 Check it out on the right side. Sign up to save your progress!`, undefined, 500);
      }
    } catch (error) {
      addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
    } finally {
      // Smoothly finish progress to 100%
      try { if (planProgressTimerRef.current) window.clearInterval(planProgressTimerRef.current); } catch {}
      setPlanProgressPercent(100);
      setTimeout(() => setIsGenerating(false), 200);
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
        { value: '15-30 minutes', label: '15-30 minutes', description: 'Quick daily practice' },
        { value: '30-60 minutes', label: '30-60 minutes', description: 'Moderate time commitment' },
        { value: '1 hour', label: '1+ hour', description: 'Dedicated learning time' }
      ];
      addAIMessage("Perfect! How much time can you dedicate each day?", timeOptions, 1000, 'time');
    } else if (currentStep === 'time') {
      setQuizAnswers(prev => ({ ...prev, timeAvailable: value }));
      setAnsweredSteps(prev => new Set(prev).add('time'));
      setCurrentStep('goal');
      const goalOptions = [
        { value: 'personal enjoyment', label: 'Personal Enjoyment', description: 'Just for fun' },
        { value: 'skill development', label: 'Skill Development', description: 'Build new abilities' },
        { value: 'creative expression', label: 'Creative Expression', description: 'Express yourself' },
        { value: 'social connection', label: 'Social Connection', description: 'Connect with others' }
      ];
      addAIMessage("Great! What's your main goal?", goalOptions, 1000, 'goal');
    } else if (currentStep === 'goal') {
      const finalAnswers: QuizAnswers = { ...quizAnswers, goal: value } as QuizAnswers;
      setQuizAnswers(finalAnswers);
      setAnsweredSteps(prev => new Set(prev).add('goal'));
      
      // Duplicate check
      if (await precheckDuplicate(selectedHobby)) {
        addAIMessage(`⚠️ You already have a ${highlightHobby(selectedHobby, selectedHobby)} plan in your dashboard. Open it to continue learning!`);
        return;
      }
      // Block if user has reached plan limit
      if (await precheckPlanLimit()) {
        addAIMessage("⚠️ Plan limit reached (5 per account). Subscription plans coming soon.");
        return;
      }
      
      setCurrentStep('generating');
      setIsGenerating(true);
      // Start staged progress to 85% while awaiting server
      try { if (planProgressTimerRef.current) window.clearInterval(planProgressTimerRef.current); } catch {}
      setPlanProgressPercent(0);
      planProgressTimerRef.current = window.setInterval(() => {
        setPlanProgressPercent(prev => {
          const next = prev < 85 ? Math.min(85, prev + 2) : prev;
          return next;
        });
      }, 300);
      try {
        const plan = await onGeneratePlan(selectedHobby, finalAnswers).catch((e: any) => {
          const msg = String(e?.message || e);
          if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already have a learning plan')) {
            addAIMessage(`⚠️ You already have a ${highlightHobby(selectedHobby, selectedHobby)} plan in your dashboard. Open it to continue learning!`);
          }
          if (msg.includes('Plan limit reached')) {
            addAIMessage("⚠️ Plan limit reached (5 per account). Subscription plans coming soon.");
          }
          throw e;
        });
        const correctedPlanData = fixPlanDataFields(plan);
        onPlanGenerated(correctedPlanData);
        if (user?.id) {
          try {
            const planDataWithCorrectFields = fixPlanDataFields(plan);
            const savedPlan = await hobbyPlanService.savePlan({ hobby: selectedHobby, title: plan.title, overview: plan.overview, plan_data: planDataWithCorrectFields }, user.id);
            onPlanIdSet(savedPlan.id.toString());
            await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
            addAIMessage(`Your ${selectedHobby} plan is ready and saved! 🎉 Check it out on the right side. Your progress will be tracked automatically!`, undefined, 500);
          } catch (saveError) {
            addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Check it out on the right side. Progress tracking is unavailable right now, but you can still use your plan!`, undefined, 500);
          }
        } else {
          addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Check it out on the right side. Sign up to save your progress!`, undefined, 500);
        }
      } catch (error) {
        addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
      } finally {
        // Smoothly finish progress to 100%
        try { if (planProgressTimerRef.current) window.clearInterval(planProgressTimerRef.current); } catch {}
        setPlanProgressPercent(100);
        setTimeout(() => setIsGenerating(false), 200);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    const userInput = currentInput.trim();
    addUserMessage(userInput);
    setCurrentInput('');
    if (currentStep === 'hobby') {
      // Guard: avoid guessing for ultra-short inputs
      if (userInput.length < 3) {
        addAIMessage("Hi! Which hobby would you like to learn? For example: guitar, cooking, yoga, photography, or drawing.");
        return;
      }
      // First try OpenRouter API validation
      let validation;
      try {
        const response = await fetch('/api/validate-hobby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hobby: userInput })
        });
        
        if (response.ok) {
          const apiResult = await response.json();
          
          if (apiResult.isValid) {
            // API validation succeeded
            validation = {
              isValid: true,
              detectedHobbies: [apiResult.suggestion || userInput],
              suggestions: [apiResult.suggestion || userInput]
            };
          } else {
            // API says invalid -> do NOT guess; ask for clarification instead
            addAIMessage("I didn't catch a specific hobby there. Please type a clear hobby you want to learn (e.g., guitar, cooking, yoga).");
            return;
          }
        } else {
          // API call failed, fall back to local validation
          validation = await validateAndProcessHobby(userInput);
        }
      } catch (error) {
        // API error, fall back to local validation
        console.error(`❌ OpenRouter API error:`, error);
        validation = await validateAndProcessHobby(userInput);
      }
      if ((validation as any).unsafe) {
        // Show suggestions if available, otherwise show default message
        if (validation.suggestions && validation.suggestions.length > 0) {
          const suggestionOptions = validation.suggestions.map(s => ({ 
            value: s, 
            label: s.charAt(0).toUpperCase() + s.slice(1), 
            description: 'Safe and beginner-friendly' 
          }));
          addAIMessage("🎯 That's not a hobby - it's inappropriate content. Here are some great, safe hobbies you can actually learn in a week! 🌟", suggestionOptions, 800, 'hobby');
        } else {
          addAIMessage("🎯 That's not a hobby - it's inappropriate content. How about trying something safe and fun like photography, guitar, cooking, drawing, yoga, gardening, or coding? 🌟");
        }
        return;
      }
      
      if ((validation as any).reason === 'complex_hobby') {
        addAIMessage("🎯 Great choice! That's a fascinating hobby, but it might be a bit complex for a 7-day beginner plan. Here are some related alternatives that are perfect for getting started in just a week! 🌟");
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
          addAIMessage(`Great choice! ${highlightHobby(hobby, hobby)} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions, 1000, 'experience');
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
          addAIMessage(data.response || "I'm here to help! What would you like to know?");
        } else {
          addAIMessage("I'm having trouble processing that. Could you rephrase?");
        }
      } catch (error) {
        addAIMessage("I'm having trouble processing that. Could you rephrase?");
      }
    }
  };

  /**
   * Return value of usePlanChat hook
   */
  return {
    // State values
    messages,
    currentInput,
    selectedHobby,
    quizAnswers,
    currentStep,
    isTyping,
    isGenerating,
    planProgressPercent,
    answeredSteps,
    
    // State setters (exposed for external control when needed)
    setMessages,
    setCurrentInput,
    setSelectedHobby,
    setQuizAnswers,
    setCurrentStep,
    setIsGenerating,
    setAnsweredSteps,
    
    // Event handlers
    addUserMessage,
    addAIMessage,
    handleSendMessage,
    handleOptionSelect,
    handleSurpriseMe,
  };
}
