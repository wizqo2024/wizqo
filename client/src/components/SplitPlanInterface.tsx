import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnifiedNavigation } from './UnifiedNavigation';
import { Clock, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { PlanDisplay as PlanDisplayOld } from '@/components/PlanDisplayOld';

interface QuizAnswers {
  experience: string;
  timeAvailable: string;
  goal: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  options?: { value: string; label: string }[];
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
  onGeneratePlan: (hobby: string, answers: any, userId?: string, force?: boolean) => Promise<any>;
  onNavigateBack: () => void;
  initialPlanData?: PlanData & { id?: string; planId?: string };
}

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [planData, setPlanData] = useState<PlanData | null>(initialPlanData || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(!initialPlanData);

  const [chatStep, setChatStep] = useState<'idle' | 'hobby' | 'experience' | 'time' | 'goal' | 'generating'>('hobby');
  const [selectedHobby, setSelectedHobby] = useState('');
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  usePlanStorage();

  const hobbySuggestions = ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance', 'coding', 'gardening', 'piano', 'singing', 'painting'];

  const sendHobbySuggestionsMessage = () => {
    const top = hobbySuggestions.slice(0, 6);
    const options = [
      ...top.map(h => ({ value: h, label: h.charAt(0).toUpperCase() + h.slice(1) })),
      { value: '__surprise__', label: 'Surprise Me 🎲' }
    ];
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'ai', content: 'Pick a hobby to get started:', options, timestamp: new Date(), step: 'hobby' }
    ]);
    setChatStep('hobby');
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { id: 'welcome', sender: 'ai', content: "Hi! 👋 Tell me what hobby you'd like to learn.", timestamp: new Date() }
      ]);
      sendHobbySuggestionsMessage();
    }
  }, []);

  const handleStartNewPlan = () => {
    setPlanData(null);
    setShowSuggestions(true);
    setChatStep('hobby');
    setSelectedHobby('');
    setAnswers({});
  };

  const askExperience = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'ai', content: "Great! What's your experience level?", options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'some', label: 'Some Experience' },
        { value: 'intermediate', label: 'Intermediate' }
      ], timestamp: new Date(), step: 'experience' }
    ]);
    setChatStep('experience');
  };

  const askTime = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'ai', content: 'How much time per day can you spend?', options: [
        { value: '30 minutes', label: '30 minutes/day' },
        { value: '1 hour', label: '1 hour/day' },
        { value: '2+ hours', label: '2+ hours/day' }
      ], timestamp: new Date(), step: 'time' }
    ]);
    setChatStep('time');
  };

  const askGoal = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'ai', content: 'What is your main goal?', options: [
        { value: 'personal enjoyment', label: 'Personal Enjoyment' },
        { value: 'skill building', label: 'Skill Building' },
        { value: 'social connection', label: 'Social Connection' },
        { value: 'career change', label: 'Career Change' }
      ], timestamp: new Date(), step: 'goal' }
    ]);
    setChatStep('goal');
  };

  const handleOptionSelect = async (value: string) => {
    if (chatStep === 'hobby') {
      if (value === '__surprise__') {
        const random = hobbySuggestions[Math.floor(Math.random() * hobbySuggestions.length)];
        setSelectedHobby(random);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: 'Surprise Me 🎲', timestamp: new Date() }]);
        askExperience();
        return;
      }
      setSelectedHobby(value);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: value, timestamp: new Date() }]);
      askExperience();
      return;
    }
    if (chatStep === 'experience') {
      const allowedExperience = ['beginner', 'some', 'intermediate'];
      if (!allowedExperience.includes(value)) return;
      setAnswers(prev => ({ ...prev, experience: value }));
      askTime();
      return;
    }
    if (chatStep === 'time') {
      const allowedTime = ['30 minutes', '1 hour', '2+ hours'];
      if (!allowedTime.includes(value)) return;
      setAnswers(prev => ({ ...prev, timeAvailable: value }));
      askGoal();
      return;
    }
    if (chatStep === 'goal') {
      const allowedGoals = ['personal enjoyment', 'skill building', 'social connection', 'career change'];
      if (!allowedGoals.includes(value)) return;
      const finalAnswers: QuizAnswers = {
        experience: answers.experience || 'beginner',
        timeAvailable: answers.timeAvailable || '1 hour',
        goal: value || 'personal enjoyment'
      };
      try {
        setChatStep('generating');
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), sender: 'ai', content: "Creating your personalized 7-day plan...", timestamp: new Date() }
        ]);
        const plan = await onGeneratePlan(selectedHobby, finalAnswers);
        setPlanData(plan);
        setShowSuggestions(false);
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), sender: 'ai', content: 'Your plan is ready! Want to make a new plan?', options: [
            { value: '__new_plan__', label: 'Make a new plan' }
          ], timestamp: new Date(), step: 'hobby' }
        ]);
      } catch (e) {
        console.error('Failed to generate plan', e);
      } finally {
        setChatStep('idle');
      }
      return;
    }
    if (value === '__new_plan__') {
      handleStartNewPlan();
      sendHobbySuggestionsMessage();
      return;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    const text = currentInput.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: text, timestamp: new Date() }]);
    setCurrentInput('');
    if (chatStep === 'hobby') {
      setSelectedHobby(text.toLowerCase());
      askExperience();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation showBackButton={true} onBackClick={onNavigateBack} currentPage={planData ? 'plan' : 'generate'} />
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-64px)]">
        <div className="w-full md:w-[420px] lg:w-[480px] bg-white border-b border-gray-200 md:border-b-0 md:border-r flex flex-col h-64 md:h-full">
          <div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
            <h2 className="text-sm md:text-lg font-semibold text-gray-900">Learning Assistant</h2>
            <p className="text-xs md:text-sm text-gray-600">Ask me anything about your plan</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.id}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-2 md:px-3 py-1.5 md:py-2 shadow-sm ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                  <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">{message.content}</div>
                  {message.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.options.map(opt => (
                        <Button key={opt.value} size="sm" variant="secondary" onClick={() => handleOptionSelect(opt.value)} disabled={message.step !== undefined && message.step !== chatStep} className="px-2 py-1 text-xs">
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatStep === 'generating' && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg px-3 py-2 bg-white text-gray-900 border border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                    <span>Creating your personalized learning plan...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex space-x-2">
              <Input ref={inputRef} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder="Ask me anything..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-xs md:text-sm h-8 md:h-10" disabled={chatStep === 'generating'} />
              <Button onClick={handleSendMessage} size="sm" className="px-2 md:px-3 h-8 md:h-10" disabled={chatStep === 'generating'}>
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full md:flex-1 overflow-y-auto bg-gray-50 md:h-full">
          {planData && !showSuggestions ? (
            <div className="p-4 lg:p-6">
              <div className="mb-6 flex items-start justify-between gap-3">
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
                <div>
                  <Button onClick={handleStartNewPlan} variant="default">Start New Plan</Button>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">0/{planData.totalDays} days completed</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <PlanDisplayOld planData={planData} onNavigateBack={onNavigateBack} />
            </div>
          ) : (
            <div className="p-6 lg:p-10">
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center">
                  <div className="text-6xl mb-6">🎯</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. Your custom learning plan will appear here once we chat!</p>
                </div>

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
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { icon: '📸', label: 'Photography', key: 'photography' },
                      { icon: '🎨', label: 'Painting', key: 'painting' },
                      { icon: '🍳', label: 'Cooking', key: 'cooking' },
                      { icon: '💻', label: 'Coding', key: 'coding' },
                      { icon: '🧶', label: 'Knitting', key: 'knitting' },
                      { icon: '🏡', label: 'Gardening', key: 'gardening' },
                      { icon: '✍️', label: 'Writing', key: 'writing' },
                      { icon: '♟️', label: 'Chess', key: 'chess' },
                      { icon: '🎸', label: 'Guitar', key: 'guitar' },
                      { icon: '🧘', label: 'Yoga', key: 'yoga' },
                      { icon: '📚', label: 'Reading', key: 'reading' },
                      { icon: '🏃', label: 'Running', key: 'running' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handlePickHobby(item.key)}
                        className="text-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-200"
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs font-medium text-gray-700">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

