import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnifiedNavigation } from './UnifiedNavigation';

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

interface SplitChatInterfaceProps {
  onGeneratePlan: (hobby: string, answers: QuizAnswers) => Promise<any>;
  onPlanGenerated: (plan: any) => void;
  onNavigateBack: () => void;
}

export function SplitChatInterface({ onGeneratePlan, onPlanGenerated, onNavigateBack }: SplitChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedHobby, setSelectedHobby] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Partial<QuizAnswers>>({});
  const [currentStep, setCurrentStep] = useState<'hobby' | 'experience' | 'time' | 'goal' | 'generating'>('hobby');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hobbyOptions = [
    { value: 'photography', label: 'Photography 📸', description: 'Capture amazing moments' },
    { value: 'guitar', label: 'Guitar 🎸', description: 'Strum your first songs' },
    { value: 'cooking', label: 'Cooking 👨‍🍳', description: 'Create delicious meals' },
    { value: 'drawing', label: 'Drawing 🎨', description: 'Express your creativity' },
    { value: 'yoga', label: 'Yoga 🧘', description: 'Find balance and peace' },
    { value: 'gardening', label: 'Gardening 🌱', description: 'Grow your own plants' },
    { value: 'coding', label: 'Coding 💻', description: 'Build your first app' },
    { value: 'surprise', label: 'Surprise Me! 🎲', description: 'Let AI pick for me' }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation on mount
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      sender: 'ai',
      content: "Hey there! 👋 I'm your personal learning assistant. I'm here to help you master any hobby in just 7 days with a personalized plan made just for you.\n\nWhat hobby would you like to learn?",
      options: hobbyOptions,
      timestamp: new Date(),
      step: 'hobby'
    };
    
    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 500);
  }, []);

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addAIMessage = (content: string, options?: any[], stepForOptions?: 'hobby' | 'experience' | 'time' | 'goal') => {
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content,
        options,
        timestamp: new Date(),
        step: stepForOptions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleHobbySelect = (hobby: string) => {
    addUserMessage(hobby === 'surprise' ? 'Surprise me!' : hobbyOptions.find(h => h.value === hobby)?.label || hobby);
    setSelectedHobby(hobby === 'surprise' ? 'photography' : hobby);
    setCurrentStep('experience');
    
    addAIMessage(
      `Great choice! ${hobby === 'surprise' ? 'I\'ll surprise you with photography' : hobbyOptions.find(h => h.value === hobby)?.label || hobby} sounds exciting. 🎯\n\nTo create the perfect learning plan for you, what's your current experience level?`,
      [
        { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
        { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
        { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' }
      ],
      'experience'
    );
  };

  const handleExperienceSelect = (experience: string) => {
    const experienceLabels = {
      beginner: 'Complete Beginner',
      some: 'Some Experience',
      intermediate: 'Intermediate'
    };
    
    addUserMessage(experienceLabels[experience as keyof typeof experienceLabels]);
    setQuizAnswers(prev => ({ ...prev, experience }));
    setCurrentStep('time');
    
    addAIMessage(
      `Perfect! Now I know where you're starting from. ⏰\n\nHow much time can you dedicate to learning each day?`,
      [
        { value: '15-30 minutes', label: '15-30 minutes', description: 'Quick daily sessions' },
        { value: '30-60 minutes', label: '30-60 minutes', description: 'Focused practice time' },
        { value: '1-2 hours', label: '1-2 hours', description: 'Deep learning sessions' },
        { value: '2+ hours', label: '2+ hours', description: 'Intensive learning' }
      ],
      'time'
    );
  };

  const handleTimeSelect = (timeAvailable: string) => {
    addUserMessage(timeAvailable);
    setQuizAnswers(prev => ({ ...prev, timeAvailable }));
    setCurrentStep('goal');
    
    addAIMessage(
      `Excellent! ${timeAvailable} per day is perfect for making real progress. 🎯\n\nWhat's your main goal with this hobby?`,
      [
        { value: 'personal enjoyment', label: 'Personal Enjoyment', description: 'Learn for fun and relaxation' },
        { value: 'creative expression', label: 'Creative Expression', description: 'Express myself artistically' },
        { value: 'skill building', label: 'Skill Building', description: 'Develop a valuable skill' },
        { value: 'social connection', label: 'Social Connection', description: 'Connect with others who share this hobby' }
      ],
      'goal'
    );
  };

  const handleGoalSelect = async (goal: string) => {
    const goalLabels = {
      'personal enjoyment': 'Personal Enjoyment',
      'creative expression': 'Creative Expression', 
      'skill building': 'Skill Building',
      'social connection': 'Social Connection'
    };
    
    addUserMessage(goalLabels[goal as keyof typeof goalLabels]);
    
    const finalAnswers = { ...quizAnswers, goal };
    setQuizAnswers(finalAnswers);
    setCurrentStep('generating');
    setIsGenerating(true);

    try {
      addAIMessage(`Perfect! I have everything I need. 🚀\n\nGive me a moment to create your personalized 7-day ${selectedHobby} learning plan...`);
      
      const plan = await onGeneratePlan(selectedHobby, finalAnswers as QuizAnswers);
      onPlanGenerated(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      addAIMessage("Oops! Something went wrong while creating your plan. Let me try again...");
      setCurrentStep('goal');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextInput = () => {
    if (!currentInput.trim()) return;
    
    if (currentStep === 'hobby') {
      addUserMessage(currentInput);
      setSelectedHobby(currentInput.trim());
      setCurrentStep('experience');
      
      addAIMessage(
        `Great choice! ${currentInput.charAt(0).toUpperCase() + currentInput.slice(1)} sounds exciting. 🎯\n\nTo create the perfect learning plan for you, what's your current experience level?`,
        [
          { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
          { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
          { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' }
        ]
      );
    }
    
    setCurrentInput('');
  };

  const handleOptionSelect = (value: string, optionStep?: 'hobby' | 'experience' | 'time' | 'goal') => {
    if (optionStep && optionStep !== currentStep) {
      return;
    }
    switch (currentStep) {
      case 'hobby':
        handleHobbySelect(value);
        break;
      case 'experience':
        if (['beginner', 'some', 'intermediate'].includes(value)) {
          handleExperienceSelect(value);
        }
        break;
      case 'time':
        if (['15-30 minutes', '30-60 minutes', '1-2 hours', '2+ hours'].includes(value)) {
          handleTimeSelect(value);
        }
        break;
      case 'goal':
        if (['personal enjoyment', 'creative expression', 'skill building', 'social connection'].includes(value)) {
          handleGoalSelect(value);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Unified Navigation */}
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={onNavigateBack}
        currentPage="generate" 
      />

      {/* Main Content - Split Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
          {/* AI Assistant Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">AI Learning Assistant</h2>
                <p className="text-sm text-slate-600">Ready to create your learning plan</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                Hi! I'm your AI learning assistant. I create personalized 7-day learning plans for any hobby.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-800 mb-2">What hobby would you like to learn?</p>
              </div>
            </div>
          </div>

          {/* Chat Messages in Sidebar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              message.sender === 'ai' && (
                <div key={message.id} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option) => (
                        <Button
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value, message.step)}
                          disabled={message.step !== currentStep || isTyping || isGenerating}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-3 border-slate-200"
                        >
                          <div>
                            <div className="font-medium text-sm">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}

            {/* User Messages Display */}
            {messages.filter(m => m.sender === 'user').map((message) => (
              <div key={message.id + '-user'} className="text-right">
                <div className="inline-block bg-purple-500 text-white rounded-lg px-3 py-2 text-sm">
                  {message.content}
                </div>
              </div>
            ))}

            {/* Typing/Generating Indicators */}
            {(isTyping || isGenerating) && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                  <p className="text-sm text-slate-600">
                    {isGenerating ? 'Creating your personalized learning plan...' : 'AI is typing...'}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area in Sidebar */}
          {currentStep !== 'generating' && !isGenerating && (
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
                  placeholder="Type your hobby here..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleTextInput}
                  disabled={!currentInput.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Welcome Section */}
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-2xl">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-slate-800 mb-6">
                Welcome to Your Learning Journey!
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. Your custom learning plan will appear here once we chat!
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Personalized Plans</h3>
                  <p className="text-sm text-slate-600">Every plan is tailored to your experience level, available time, and specific goals.</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Structured Learning</h3>
                  <p className="text-sm text-slate-600">Daily lessons with tips, checklists, and resources to guide your progress step by step.</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Quick Results</h3>
                  <p className="text-sm text-slate-600">See real progress in just 7 days with our proven methodology and expert guidance.</p>
                </div>
              </div>

              {/* Popular Hobbies */}
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-3">Popular hobbies:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['📸 Photography', '🍳 Cooking', '🎸 Guitar', '🎨 Painting'].map((hobby) => (
                    <span key={hobby} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}