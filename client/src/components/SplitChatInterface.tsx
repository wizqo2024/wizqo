import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnifiedNavigation } from './UnifiedNavigation';
import { useAuth } from '@/context/AuthContext';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

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

  const getRandomHobby = () => {
    const randomHobbies = [
      'photography', 'guitar', 'cooking', 'drawing', 'yoga', 'gardening', 'coding', 
      'painting', 'dance', 'woodworking', 'piano', 'singing', 'drums', 'violin', 
      'ukulele', 'running', 'weightlifting', 'swimming', 'cycling', 'baking', 
      'writing', 'journaling', 'chess', 'hiking', 'camping', 'fishing', 'crafting', 
      'knitting', 'pottery', 'calligraphy', 'martial arts', 'rock climbing', 
      'jewelry making', 'origami', 'wine tasting', 'coffee brewing', 'mixology',
      'blogging', 'storytelling', 'poetry', 'creative writing', 'board games'
    ];
    return randomHobbies[Math.floor(Math.random() * randomHobbies.length)];
  };

  // Frontend hobby validation function
  const validateHobby = (input: string): { isValid: boolean; normalizedHobby: string; suggestions?: string[] } => {
    const hobbyInput = input.toLowerCase().trim();

    // Reject common non-hobby words
    const invalidInputs = [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'what', 'how', 'when', 'where', 'why', 'who', 
      'test', 'testing', 'example', 'sample',
      'nothing', 'none', 'anything', 'something',
      'help', 'please', 'thank you', 'thanks'
    ];

    if (invalidInputs.includes(hobbyInput) || hobbyInput.length < 3) {
      return { 
        isValid: false, 
        normalizedHobby: '', 
        suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
      };
    }

    // Check if it's a supported hobby from our options
    const supportedHobbies = ['photography', 'guitar', 'cooking', 'drawing', 'yoga', 'gardening', 'coding', 'dance', 'music', 'piano', 'singing', 'drums', 'violin', 'ukulele', 'running', 'weightlifting', 'swimming', 'martial arts', 'cycling', 'baking', 'wine tasting', 'coffee brewing', 'grilling', 'mixology', 'writing', 'journaling', 'blogging', 'storytelling', 'poetry', 'creative writing', 'chess', 'gaming', 'board games', 'puzzle solving', 'card games', 'video games', 'hiking', 'birdwatching', 'camping', 'rock climbing', 'fishing', 'woodworking', 'crafting', 'knitting', 'sewing', 'jewelry making', 'origami', 'painting', 'pottery', 'sketching', 'calligraphy'];

    const directMatch = supportedHobbies.find(hobby => hobby.toLowerCase() === hobbyInput);
    if (directMatch) {
      return { isValid: true, normalizedHobby: directMatch };
    }

    // Check for partial matches
    const partialMatches = supportedHobbies.filter(hobby => 
      hobby.toLowerCase().includes(hobbyInput) || hobbyInput.includes(hobby.toLowerCase())
    );

    if (partialMatches.length > 0) {
      return { isValid: true, normalizedHobby: partialMatches[0] };
    }

    // Check if it's a reasonable hobby-like word (basic validation)
    const validHobbyPattern = /^[a-zA-Z\s-]{3,30}$/;
    if (validHobbyPattern.test(input) && !invalidInputs.includes(hobbyInput)) {
      return { isValid: true, normalizedHobby: hobbyInput };
    }

    return { 
      isValid: false, 
      normalizedHobby: '', 
      suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
    };
  };

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
      timestamp: new Date()
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

  const addAIMessage = (content: string, options?: any[]) => {
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
    }, 1000);
  };

  const handleHobbySelect = async (hobby: string) => {
    // Handle "Surprise Me!" with random selection
    const finalHobby = hobby === 'surprise' ? getRandomHobby() : hobby;

    // Validate hobby selection to prevent invalid inputs from being processed
    if (hobby !== 'surprise' && !hobbyOptions.some(h => h.value === hobby)) {
      const validation = validateHobby(hobby);
      if (!validation.isValid) {
        addUserMessage(hobby);
        addAIMessage(
          `I didn't quite catch that hobby. Could you be more specific? 🤔\n\nTry something like: guitar, cooking, drawing, photography, yoga, or coding. What hobby would you like to learn?`,
          validation.suggestions?.map(h => ({
            value: h,
            label: h.charAt(0).toUpperCase() + h.slice(1),
            description: `Learn ${h} in 7 days`
          })) || [
            { value: 'guitar', label: 'Guitar', description: 'Learn guitar in 7 days' },
            { value: 'cooking', label: 'Cooking', description: 'Learn cooking in 7 days' },
            { value: 'drawing', label: 'Drawing', description: 'Learn drawing in 7 days' },
            { value: 'photography', label: 'Photography', description: 'Learn photography in 7 days' },
            { value: 'yoga', label: 'Yoga', description: 'Learn yoga in 7 days' },
            { value: 'dance', label: 'Dance', description: 'Learn dance in 7 days' }
          ]
        );
        return;
      }
    }

    // Check for duplicate plan if user is signed in
    if (user) {
      try {
        // Wait a moment for any recent deletions to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const existingPlan = await hobbyPlanService.checkExistingPlan(finalHobby, user.id);
        if (existingPlan) {
          // Double-check by fetching fresh data from API
          const response = await fetch(`/api/hobby-plans?user_id=${user.id}`);
          if (response.ok) {
            const allPlans = await response.json();
            const currentPlan = allPlans.find((p: any) => {
              if (p.title) {
                const titleMatch = p.title.match(/Learn (\w+) in/i);
                const planHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
                return planHobby === finalHobby.toLowerCase();
              }
              return false;
            });
            
            // If plan still exists after fresh check, show duplicate message
            if (currentPlan) {
              addUserMessage(hobby === 'surprise' ? 'Surprise me!' : hobbyOptions.find(h => h.value === hobby)?.label || hobby);
              addAIMessage(
                `You already have a learning plan for ${finalHobby}! 📚\n\nTo continue your existing plan, go to your Dashboard and click "Continue Plan". Each plan is designed to be unique and comprehensive.\n\nWould you like to try a different hobby instead?`,
                hobbyOptions.filter(h => h.value !== 'surprise' && h.value !== finalHobby).slice(0, 6).map(h => ({
                  value: h.value,
                  label: h.label,
                  description: h.description
                }))
              );

              toast({
                title: "Plan already exists",
                description: `You already have a ${finalHobby} plan. Check your dashboard to continue.`,
                variant: "default"
              });

              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking for existing plan:', error);
        // Continue with plan generation if check fails
      }
    }

    addUserMessage(hobby === 'surprise' ? `Surprise me! (${finalHobby.charAt(0).toUpperCase() + finalHobby.slice(1)})` : hobbyOptions.find(h => h.value === hobby)?.label || hobby);
    setSelectedHobby(finalHobby);
    setCurrentStep('experience');

    addAIMessage(
      `Great choice! ${finalHobby.charAt(0).toUpperCase() + finalHobby.slice(1)} sounds exciting. 🎯\n\nTo create the perfect learning plan for you, what's your current experience level?`,
      [
        { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
        { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
        { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' }
      ]
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
      ]
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
      ]
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
      // Store the plan data for the plan interface
      sessionStorage.setItem('currentPlanData', JSON.stringify(plan));
      sessionStorage.setItem('lastViewedPlanData', JSON.stringify(plan));
      sessionStorage.setItem('planFromGeneration', 'true');
    } catch (error) {
      console.error('Error generating plan:', error);
      addAIMessage("Oops! Something went wrong while creating your plan. Let me try again...");
      setCurrentStep('goal');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextInput = () => {
    console.log('🚨 HANDLE TEXT INPUT CALLED!!! Input:', currentInput, 'Step:', currentStep);
    if (!currentInput.trim()) return;

    const userInput = currentInput.trim();
    setCurrentInput('');

    // Add user message immediately
    addUserMessage(userInput);

    console.log('🔧 TEXT INPUT DEBUG: Current step is:', currentStep);
    console.log('🔧 TEXT INPUT DEBUG: Input received:', userInput);

    // Check if plan is already generated (after generating step)
    if (currentStep === 'generating' && messages.some(m => m.content.includes('Your personalized learning plan is ready'))) {
      // Handle questions about the generated plan
      handlePlanQuestions(userInput);
    } else if (currentStep === 'hobby') {
      // Add debug logging to trace validation
      console.log('🔍 VALIDATION DEBUG: Input received:', userInput);
      console.log('🔍 VALIDATION DEBUG: Current step:', currentStep);

      // Validate hobby input before proceeding
      const validation = validateHobby(userInput);
      console.log('🔍 VALIDATION DEBUG: Validation result:', validation);

      if (!validation.isValid) {
        console.log('🔍 VALIDATION DEBUG: Invalid input detected, showing error message');
        addAIMessage(
          `I didn't quite catch that hobby. Could you be more specific? 🤔\n\nTry something like: guitar, cooking, drawing, photography, yoga, or coding. What hobby would you like to learn?`,
          validation.suggestions?.map(hobby => ({
            value: hobby,
            label: hobby.charAt(0).toUpperCase() + hobby.slice(1),
            description: `Learn ${hobby} in 7 days`
          })) || [
            { value: 'guitar', label: 'Guitar', description: 'Learn guitar in 7 days' },
            { value: 'cooking', label: 'Cooking', description: 'Learn cooking in 7 days' },
            { value: 'drawing', label: 'Drawing', description: 'Learn drawing in 7 days' },
            { value: 'photography', label: 'Photography', description: 'Learn photography in 7 days' },
            { value: 'yoga', label: 'Yoga', description: 'Learn yoga in 7 days' },
            { value: 'dance', label: 'Dance', description: 'Learn dance in 7 days' }
          ]
        );
        return;
      }

      console.log('🔍 VALIDATION DEBUG: Valid input, proceeding with hobby:', validation.normalizedHobby);
      // Call handleHobbySelect with the validated hobby instead of setting state directly
      handleHobbySelect(validation.normalizedHobby);
    }
  };

  // Handle questions about the generated plan
  const handlePlanQuestions = (question: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let response = "";
      const q = question.toLowerCase();

      // Smart responses based on question content
      if (q.includes('how') && (q.includes('start') || q.includes('begin'))) {
        response = "Great question! Start with Day 1 - that's where all the fundamentals are covered. Click on 'Day 1' in your plan above to see the detailed instructions, video tutorial, and checklist. Take your time and don't rush through the basics!";
      } else if (q.includes('video') || q.includes('youtube')) {
        response = "Each day includes a carefully selected YouTube video tutorial that matches exactly what you're learning that day. The videos are under 40 minutes and chosen specifically for your experience level. Just click the play button on any day!";
      } else if (q.includes('time') || q.includes('long') || q.includes('minutes') || q.includes('hours')) {
        response = `Your plan is designed for ${quizAnswers.timeAvailable || '30 minutes'} per day. But feel free to spend more or less time - the most important thing is consistent daily practice. Even 15 minutes a day can make a huge difference!`;
      } else if (q.includes('hard') || q.includes('difficult') || q.includes('easy')) {
        response = `This plan is designed for ${quizAnswers.experience === 'beginner' ? 'complete beginners' : 'people with some experience'}. Each day builds on the previous one, so start from Day 1 even if some things seem familiar. The progression ensures you don't miss any important foundations!`;
      } else if (q.includes('equipment') || q.includes('need') || q.includes('buy')) {
        response = "Check the 'What You'll Need' section in Day 1 - it lists everything required to get started. Most hobbies can be started with basic, affordable equipment. Focus on learning first before investing in expensive gear!";
      } else if (q.includes('progress') || q.includes('track')) {
        response = "Your progress is automatically saved! You can mark days as complete and track your learning journey. Visit your dashboard anytime to see your progress and continue where you left off.";
      } else if (q.includes('skip') || q.includes('jump')) {
        response = "I recommend following the 7-day sequence - each day builds important skills you'll need later. But if you're really excited about a particular day, feel free to preview it! Just make sure to come back and complete the earlier days too.";
      } else {
        response = "I'm here to help with any questions about your learning plan! You can ask me about getting started, the daily activities, equipment needed, time requirements, or anything else about your 7-day journey. What would you like to know more about?";
      }

      addAIMessage(response);
      setIsTyping(false);
    }, 1000);
  };;

  const handleOptionSelect = (value: string) => {
    switch (currentStep) {
      case 'hobby':
        handleHobbySelect(value);
        break;
      case 'experience':
        handleExperienceSelect(value);
        break;
      case 'time':
        handleTimeSelect(value);
        break;
      case 'goal':
        handleGoalSelect(value);
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
                          onClick={() => handleOptionSelect(option.value)}
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

          {/* Input Area in Sidebar - Show after plan generation too */}
          {!isGenerating && (
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => {
                    console.log('🔥 INPUT CHANGE:', e.target.value);
                    setCurrentInput(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    console.log('🔥 KEY PRESSED:', e.key, 'Current input:', currentInput);
                    if (e.key === 'Enter') {
                      console.log('🔥 ENTER PRESSED - CALLING handleTextInput');
                      handleTextInput();
                    }
                  }}
                  placeholder={
                    currentStep === 'generating' && messages.some(m => m.content.includes('Your personalized learning plan is ready'))
                      ? "Ask me anything about your plan..."
                      : "Type your hobby here..."
                  }
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={() => {
                    console.log('🔥 SEND BUTTON CLICKED - CALLING handleTextInput');
                    handleTextInput();
                  }}
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