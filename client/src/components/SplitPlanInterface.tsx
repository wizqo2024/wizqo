import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, Send, Play, MessageCircle } from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { CleanPlanDisplay } from './CleanPlanDisplay';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { apiService } from '@/lib/api-service';
import { supabase } from '@/lib/supabase';

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

export const SplitPlanInterface: React.FC<SplitPlanInterfaceProps> = ({ 
  onGeneratePlan, 
  onNavigateBack, 
  initialPlanData 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'hobby' | 'experience' | 'time' | 'goal' | 'generating'>('hobby');
  const [selectedHobby, setSelectedHobby] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({} as QuizAnswers);
  const [planData, setPlanData] = useState<PlanData | null>(initialPlanData || null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with plan data if provided
  useEffect(() => {
    if (initialPlanData) {
      const fixedPlan = fixPlanDataFields(initialPlanData);
      setPlanData(fixedPlan);
      setCurrentPlanId(initialPlanData.id || initialPlanData.planId || null);
      setCurrentStep('plan' as any);
    }
  }, [initialPlanData]);

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load completed days for current user and plan
  useEffect(() => {
    const loadProgress = async () => {
      if (user?.id && currentPlanId) {
        try {
          const progress = await hobbyPlanService.getProgress(user.id, currentPlanId);
          setCompletedDays(progress?.completed_days || []);
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    };
    
    loadProgress();
  }, [user?.id, currentPlanId]);

  // Minimize chat automatically on mobile after plan is generated
  useEffect(() => {
    if (planData && !isDesktop) {
      setIsChatMinimized(true);
    }
  }, [planData, isDesktop]);

  const fixPlanDataFields = (plan: any) => {
    if (!plan) return plan;
    
    const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
    
    const fixedDays = daysArray.map((day: any) => ({
      ...day,
      mistakesToAvoid: day.mistakesToAvoid || day.commonMistakes || [],
    }));

    return {
      ...plan,
      days: fixedDays
    };
  };

  const addAIMessage = (content: string, options?: any[], delay: number = 0) => {
    if (delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          content,
          options,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }, delay);
    } else {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content,
        options,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const toggleDayCompletion = async (day: number) => {
    if (day > 1 && !user) {
      setShowAuthModal(true);
      return;
    }

    const isCompleted = completedDays.includes(day);
    let newCompletedDays: number[];
    
    if (isCompleted) {
      newCompletedDays = completedDays.filter(d => d !== day);
    } else {
      newCompletedDays = [...completedDays, day].sort((a, b) => a - b);
    }
    
    setCompletedDays(newCompletedDays);

    if (user?.id && currentPlanId) {
      try {
        await hobbyPlanService.updateProgress(user.id, currentPlanId, newCompletedDays);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && !initialPlanData) {
      const hobbyOptions = [
        { value: 'yoga', label: 'Yoga', description: 'Mind-body wellness practice' },
        { value: 'guitar', label: 'Guitar', description: 'Musical instrument mastery' },
        { value: 'cooking', label: 'Cooking', description: 'Culinary skills development' },
        { value: 'drawing', label: 'Drawing', description: 'Artistic expression and technique' },
        { value: 'photography', label: 'Photography', description: 'Visual storytelling skills' },
        { value: 'gardening', label: 'Gardening', description: 'Growing plants and flowers' },
        { value: 'surprise', label: '✨ Surprise Me!', description: 'Let AI choose for you' }
      ];
      
      addAIMessage(
        "Welcome! I'll help you create a personalized 7-day learning plan for any hobby. What would you like to learn?",
        hobbyOptions,
        1000
      );
    }
  }, [messages.length, initialPlanData]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isGenerating) return;

    const userMessage = currentInput.trim();
    addUserMessage(userMessage);
    setCurrentInput('');

    addAIMessage("I'm thinking about your question...", undefined, 800);

    try {
      const response = await apiService.sendChatMessage(userMessage, planData);
      
      setTimeout(() => {
        setMessages(prev => prev.slice(0, -1));
        addAIMessage(response.message);
      }, 1200);
    } catch (error) {
      console.error('Chat error:', error);
      setTimeout(() => {
        setMessages(prev => prev.slice(0, -1));
        addAIMessage("I'm having trouble responding right now. Could you try asking again?");
      }, 1200);
    }
  };

  const handleSurpriseMe = async () => {
    const hobbies = ['yoga', 'guitar', 'cooking', 'drawing', 'photography', 'gardening', 'coding'];
    const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
    
    const surpriseAnswers: QuizAnswers = {
      experience: 'beginner',
      timeAvailable: '1 hour',
      goal: 'personal enjoyment'
    };

    addAIMessage(`Perfect! I've chosen ${randomHobby} for you. Creating your 7-day plan now... ✨`, undefined, 800);
    
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
          const savedPlan = await hobbyPlanService.savePlan({
            hobby: randomHobby,
            title: plan.title,
            overview: plan.overview,
            plan_data: planDataWithCorrectFields
          }, user.id);
          
          setCurrentPlanId(savedPlan.id.toString());
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
      addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = async (value: string, label: string) => {
    if (value === 'surprise') {
      await handleSurpriseMe();
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
        const plan = await onGeneratePlan(selectedHobby, finalAnswers);
        const fixedStandardPlan = fixPlanDataFields(plan);
        setPlanData(fixedStandardPlan);
        
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
            
            addAIMessage(`Your ${selectedHobby} plan is ready! 🎉`, undefined, 1000);
          } catch (saveError) {
            console.error('Error saving plan to Supabase:', saveError);
            addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Progress tracking is temporarily unavailable.`, undefined, 1000);
          }
        } else {
          addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Sign up to save your progress!`, undefined, 1000);
        }
      } catch (error) {
        console.error('Error generating plan:', error);
        addAIMessage("I had trouble generating your plan. Let me try a different approach!", undefined, 500);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <UnifiedNavigation currentPage="plan" onNavigateBack={onNavigateBack} />
      
      <div 
        className="flex-1 flex overflow-hidden"
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          height: 'calc(100vh - 64px)'
        }}
      >
        {/* Chat Interface - Mobile: Top, Desktop: Left */}
        {!isChatMinimized && (
        <div 
          className="flex flex-col bg-white border-r border-gray-200 relative"
          style={{
            width: isDesktop ? '40%' : '100%',
            height: isDesktop ? '100%' : planData ? '256px' : '100%'
          }}
        >
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3">
            {messages.map((message, index) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] lg:max-w-xs ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs lg:text-sm shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  
                  {message.options && (
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
          {planData && planData.days ? (
            <CleanPlanDisplay 
              planData={planData}
              currentDay={selectedDay}
              completedDays={completedDays}
              onDayComplete={toggleDayCompletion}
            />
          ) : (
            <div className="p-4 lg:p-6 text-center">
              <p className="text-gray-600">Generate a plan to see your learning path here!</p>
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
};