
import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, loading, error, signIn } = useAuth();
  const { savePlan, loadPlan, deletePlan } = usePlanStorage();

  useEffect(() => {
    if (initialPlanData) {
      setPlanData(fixPlanDataFields(initialPlanData));
      setCurrentStep('generating');
      setIsGenerating(true);
      setAnsweredSteps(new Set(['hobby']));
      setMessages([{
        id: '1',
        sender: 'ai' as const,
        content: `I've generated a plan for you based on your answers. Let's dive into it!`,
        timestamp: new Date()
      }]);
    }
  }, [initialPlanData]);

  useEffect(() => {
    if (planData && currentStep === 'generating') {
      setIsGenerating(false);
      setCurrentStep('hobby');
      setMessages([{
        id: '1',
        sender: 'ai' as const,
        content: `I've generated a plan for you based on your answers. Let's dive into it!`,
        timestamp: new Date()
      }]);
    }
  }, [planData, currentStep]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isTyping) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentInput('');

    setIsTyping(true);

    try {
      const response = await hobbyPlanService.getPlan(currentInput, quizAnswers);
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `Sorry, I encountered an error: ${error.message || error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReplyClick = (option: { value: string; label: string; description?: string }) => {
    setCurrentInput(option.value);
    setShowQuickReplies(false);
    handleSendMessage();
  };

  const handleGeneratePlan = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setCurrentStep('generating');
    setIsGenerating(true);
    setAnsweredSteps(new Set(['hobby']));
    setMessages([{
      id: '1',
      sender: 'ai' as const,
      content: `I'll generate a plan for you based on your answers. This might take a moment...`,
      timestamp: new Date()
    }]);

    try {
      const generatedPlan = await onGeneratePlan(selectedHobby, quizAnswers);
      setPlanData(fixPlanDataFields(generatedPlan));
      setMessages([{
        id: '1',
        sender: 'ai' as const,
        content: `I've generated a plan for you based on your answers. Let's dive into it!`,
        timestamp: new Date()
      }]);
      setShowConfetti(true);
      setShowQuickReplies(true);
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `Sorry, I encountered an error: ${error.message || error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsGenerating(false);
      setCurrentStep('hobby');
    }
  };

  const handleNavigateBack = () => {
    onNavigateBack();
  };

  const handlePlanSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!planData) return;

    setIsSavingProgress(true);
    try {
      const planId = await savePlan(planData, user.id);
      setCurrentPlanId(planId);
      alert('Plan saved successfully!');
    } catch (error) {
      alert(`Error saving plan: ${error.message || error}`);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handlePlanLoad = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const loadedPlan = await loadPlan(user.id);
    if (loadedPlan) {
      setPlanData(fixPlanDataFields(loadedPlan));
      setCurrentStep('generating');
      setIsGenerating(true);
      setAnsweredSteps(new Set(['hobby']));
      setMessages([{
        id: '1',
        sender: 'ai' as const,
        content: `I've loaded your plan. Let's dive into it!`,
        timestamp: new Date()
      }]);
    } else {
      alert('No plan found to load.');
    }
  };

  const handlePlanDelete = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!currentPlanId) return;

    if (confirm('Are you sure you want to delete this plan?')) {
      await deletePlan(currentPlanId);
      setCurrentPlanId(null);
      alert('Plan deleted successfully!');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col h-full">
      <UnifiedNavigation />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold mb-4">Your Learning Plan</h1>
        <p className="text-lg text-gray-700 mb-6">
          I've created a personalized learning plan for you to achieve your goal in just 7 days.
          Let's dive into the details and get started!
        </p>

        {planData ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{planData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{planData.overview}</p>
                <p>Difficulty: {planData.difficulty}</p>
                <p>Total Days: {planData.totalDays}</p>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Days</h2>
            <div className="space-y-4">
              {planData.days.map((day, index) => (
                <Card key={day.day} className={`p-4 ${completedDays.includes(day.day) ? 'opacity-50' : ''}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{day.title}</h3>
                      <p className="text-sm text-gray-600">{day.estimatedTime}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDay(day.day)}
                      className={`${selectedDay === day.day ? 'bg-blue-500 text-white' : ''}`}
                    >
                      Day {day.day}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p>{day.explanation}</p>
                    <h4 className="text-md font-bold mt-4">How to:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.howTo.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-bold mt-4">Checklist:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.checklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-bold mt-4">Tips:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.tips.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-bold mt-4">Common Mistakes to Avoid:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.mistakesToAvoid.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-bold mt-4">Free Resources:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.freeResources.map((resource, i) => (
                        <li key={i}>
                          <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <h4 className="text-md font-bold mt-4">Affiliate Products:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {day.affiliateProducts.map((product, i) => (
                        <li key={i}>
                          <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {product.title} - ${product.price}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {day.youtubeVideoId && (
                      <div className="mt-4">
                        <YouTubeEmbed videoId={day.youtubeVideoId} title={day.videoTitle || `${planData.hobby || 'Tutorial'} - Day ${day.day}`} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Start Your Learning Journey</h2>
            <p className="text-lg text-gray-700 mb-6">
              To begin, please answer a few questions about your desired hobby and time availability.
            </p>
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What's Your Hobby?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    I'll create a personalized plan based on your chosen hobby.
                    What's your favorite activity or interest?
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setCurrentStep('hobby')} className="w-full">
                      Let's Begin!
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Your Experience Level?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    I'll tailor the plan to your current skill level.
                    How much experience do you have with this hobby?
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setCurrentStep('experience')} className="w-full">
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How Much Time Do You Have?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    I'll adjust the plan to fit your available time.
                    How many hours per day can you dedicate to this hobby?
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setCurrentStep('time')} className="w-full">
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Your Goal?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    I'll ensure the plan aligns with your ultimate goal.
                    What do you want to achieve with this hobby?
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setCurrentStep('goal')} className="w-full">
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
        {showQuickReplies && (
          <div className="mb-3 flex flex-wrap gap-2">
            {['How do I get started?','What should I practice today?','Can you suggest resources?','How to fix common mistakes?'].map(q => (
              <button key={q} onClick={() => { setCurrentInput(q); setShowQuickReplies(false); }} className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-3">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value.slice(0, 50))}
              placeholder="Ask me anything about your plan..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
              maxLength={50}
              aria-label="Chat input"
              aria-describedby="char-counter"
            />
            <Button onClick={handleSendMessage} size="sm" className="px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div id="char-counter" aria-live="polite" className={`text-right text-xs ${currentInput.length < 35 ? 'text-gray-400' : currentInput.length < 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {currentInput.length}/50
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showConfetti && <Confetti />}
    </div>
  );
}