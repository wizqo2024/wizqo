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

interface ChatInterfaceProps {
  onGeneratePlan: (hobby: string, answers: QuizAnswers) => Promise<any>;
  onPlanGenerated: (plan: any) => void;
  onNavigateBack: () => void;
}

export function ChatInterface({ onGeneratePlan, onPlanGenerated, onNavigateBack }: ChatInterfaceProps) {
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
    { value: 'dance', label: 'Dance 💃', description: 'Move to the rhythm' },
    { value: 'surprise', label: 'Surprise Me! 🎲', description: 'Let AI pick for me' }
  ];

  const categorizedHobbies = {
    arts: ['drawing', 'painting', 'photography', 'pottery', 'sketching', 'calligraphy', 'dance', 'dancing'],
    games: ['chess', 'gaming', 'board games', 'puzzle solving', 'card games', 'video games'],
    nature: ['gardening', 'hiking', 'birdwatching', 'camping', 'rock climbing', 'fishing'],
    diy: ['woodworking', 'crafting', 'knitting', 'sewing', 'jewelry making', 'origami'],
    music: ['guitar', 'piano', 'singing', 'drums', 'violin', 'ukulele'],
    tech: ['coding', 'programming', 'web development', 'app development', 'robotics', 'electronics'],
    fitness: ['yoga', 'running', 'weightlifting', 'swimming', 'martial arts', 'cycling'],
    culinary: ['cooking', 'baking', 'wine tasting', 'coffee brewing', 'grilling', 'mixology'],
    writing: ['writing', 'journaling', 'blogging', 'storytelling', 'poetry', 'creative writing']
  };

  const hobbySynonyms: { [key: string]: string } = {
    'sketching': 'drawing',
    'dev': 'coding',
    'programming': 'coding',
    'web dev': 'coding',
    'baking': 'cooking',
    'martial arts': 'karate',
    'working out': 'fitness',
    'running': 'jogging',
    'picture taking': 'photography',
    'photo': 'photography',
    'instrument': 'music',
    'plants': 'gardening',
    'dancing': 'dance',
    'ballet': 'dance',
    'hip hop': 'dance',
    'salsa': 'dance',
    'ballroom': 'dance',
    'breakdancing': 'dance',
    'video games': 'gaming',
    'gaming': 'video games',
    'games': 'gaming',
    'jogging': 'running',
    'weightlifting': 'fitness',
    'exercise': 'fitness',
    'workout': 'fitness',
    'diary': 'journaling',
    'journal': 'journaling', 
    'blogging': 'writing',
    'blog': 'writing',
    'creative writing': 'writing',
    'poetry': 'writing',
    'storytelling': 'writing'
  };

  const commonTypos: { [key: string]: string } = {
    'panting': 'painting',
    'codding': 'coding',
    'guittar': 'guitar',
    'photograpy': 'photography',
    'cookin': 'cooking',
    'drawin': 'drawing',
    'gardenin': 'gardening'
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const validateHobby = (input: string): { isValid: boolean; suggestion?: string; needsClarification?: boolean; options?: any[] } => {
    const cleanInput = input.toLowerCase().trim();
    if (!cleanInput || cleanInput.length < 2) {
      return { 
        isValid: false, 
        suggestion: "Let's try a specific hobby (like painting, gardening, coding) to get started!" 
      };
    }
    const vagueTerms = ['fun', 'cool', 'interesting', 'good', 'nice', 'creative', 'physical'];
    if (vagueTerms.includes(cleanInput)) {
      return {
        isValid: false,
        needsClarification: true,
        suggestion: cleanInput === 'fun' ? "Do you mean arts, games, or outdoor fun?" : "Could you be more specific? Try naming a particular hobby!",
        options: [
          { value: 'arts', label: '🎨 Arts', description: 'Drawing, painting, photography' },
          { value: 'games', label: '🎮 Games', description: 'Chess, gaming, puzzles' },
          { value: 'nature', label: '🌿 Nature', description: 'Gardening, hiking, camping' },
          { value: 'diy', label: '🔧 DIY', description: 'Crafting, woodworking, building' }
        ]
      };
    }
    if (commonTypos[cleanInput]) {
      return {
        isValid: false,
        suggestion: `Did you mean "${commonTypos[cleanInput]}"?`,
        options: [
          { value: commonTypos[cleanInput], label: `✅ ${commonTypos[cleanInput].charAt(0).toUpperCase() + commonTypos[cleanInput].slice(1)}` },
          { value: 'different', label: '🔁 Let me choose a different hobby' }
        ]
      };
    }
    if (hobbySynonyms[cleanInput]) {
      return { isValid: true, suggestion: hobbySynonyms[cleanInput] };
    }
    const words = cleanInput.split(/\s+|,|and|&/);
    const foundHobbies = words.filter(word => {
      const normalizedWord = word.trim().toLowerCase();
      return Object.values(categorizedHobbies).flat().includes(normalizedWord) || 
             hobbySynonyms[normalizedWord] ||
             hobbyOptions.some(h => h.value === normalizedWord);
    });
    if (foundHobbies.length > 1) {
      return {
        isValid: false,
        suggestion: `Looks like you mentioned more than one hobby: ${foundHobbies.join(' and ')}. Want to focus on just one for now?`,
        options: [
          ...foundHobbies.slice(0, 2).map(hobby => ({ 
            value: hobby, 
            label: `${getHobbyEmoji(hobby)} Start with ${hobby.charAt(0).toUpperCase() + hobby.slice(1)}` 
          })),
          { value: 'surprise', label: '🎲 Surprise Me!' },
          { value: 'different', label: '🔁 Let me choose a different hobby' }
        ]
      };
    }
    const allHobbies = Object.values(categorizedHobbies).flat();
    if (allHobbies.includes(cleanInput) || hobbyOptions.some(h => h.value === cleanInput)) {
      return { isValid: true, suggestion: cleanInput };
    }
    const reasonableHobbyPattern = /^[a-zA-Z\s-]{2,30}$/;
    if (reasonableHobbyPattern.test(cleanInput)) {
      return { isValid: true, suggestion: cleanInput };
    }
    return {
      isValid: false,
      suggestion: "I'm not familiar with that hobby yet. Here are some popular categories to choose from:",
      options: [
        { value: 'arts', label: '🎨 Arts', description: 'Drawing, painting, photography' },
        { value: 'games', label: '🧩 Games', description: 'Chess, gaming, puzzles' },
        { value: 'nature', label: '🌿 Nature', description: 'Gardening, hiking, camping' },
        { value: 'diy', label: '🔧 DIY', description: 'Crafting, woodworking, building' },
        { value: 'surprise', label: '🎲 Surprise Me!', description: 'Random hobby plan' },
        { value: 'custom', label: '✏️ Try ' + cleanInput + ' anyway' }
      ]
    };
  };

  const getHobbyEmoji = (hobby: string): string => {
    const emojiMap: {[key: string]: string} = {
      photography: '📸', guitar: '🎸', cooking: '👨‍🍳', drawing: '🎨',
      yoga: '🧘', gardening: '🌱', coding: '💻', painting: '🎨',
      piano: '🎹', singing: '🎤', chess: '♟️', hiking: '🥾',
      dance: '💃', dancing: '💃', gaming: '🎮', video: '🎮',
      running: '🏃', fitness: '💪', swimming: '🏊', cycling: '🚴',
      baking: '🧁', woodworking: '🔨', knitting: '🧶', fishing: '🎣',
      writing: '✍️', journaling: '📝', blogging: '📝', poetry: '📖',
      storytelling: '📚', 'creative writing': '✍️'
    };
    return emojiMap[hobby] || '🎯';
  };

  const getCategoryHobbies = (category: string) => {
    const options = categorizedHobbies[category as keyof typeof categorizedHobbies] || [];
    return options.slice(0, 4).map(hobby => ({
      value: hobby,
      label: `${getHobbyEmoji(hobby)} ${hobby.charAt(0).toUpperCase() + hobby.slice(1)}`,
      description: `Learn ${hobby} in 7 days`
    }));
  };

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

  const addAIMessage = (
    content: string,
    options?: { value: string; label: string; description?: string }[],
    stepForOptions?: 'hobby' | 'experience' | 'time' | 'goal'
  ) => {
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
    }, 1000 + Math.random() * 1000);
  };

  const handleHobbySelect = (hobby: string) => {
    const selectedOption = hobbyOptions.find(h => h.value === hobby);
    const finalHobby = hobby === 'surprise' ? getRandomHobby() : hobby;
    addUserMessage(selectedOption?.label || hobby);
    setSelectedHobby(finalHobby);
    setCurrentStep('experience');
    addAIMessage(
      `Awesome choice! ${finalHobby.charAt(0).toUpperCase() + finalHobby.slice(1)} is such a rewarding hobby. 🎯\n\nTo create the perfect learning plan for you, I need to know your current experience level. What best describes you?`,
      [
        { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
        { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
        { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' }
      ],
      'experience'
    );
  };

  const getRandomHobby = () => {
    const randomHobbies = ['photography', 'guitar', 'cooking', 'drawing', 'yoga', 'gardening', 'coding', 'painting', 'dancing', 'woodworking'];
    return randomHobbies[Math.floor(Math.random() * randomHobbies.length)];
  };

  const handleExperienceSelect = (experience: string) => {
    const experienceLabels = {
      'beginner': 'Complete Beginner',
      'some': 'Some Experience', 
      'intermediate': 'Intermediate'
    };
    addUserMessage(experienceLabels[experience as keyof typeof experienceLabels]);
    setQuizAnswers(prev => ({ ...prev, experience }));
    setCurrentStep('time');
    addAIMessage(
      `Perfect! I'll design the plan for your ${experience} level. ⏰\n\nHow much time can you dedicate to learning each day? Be honest - consistency is more important than duration!`,
      [
        { value: '15-30 minutes', label: '15-30 minutes', description: 'Quick daily sessions' },
        { value: '30-60 minutes', label: '30-60 minutes', description: 'Regular practice time' },
        { value: '60+ minutes', label: '1+ hours', description: 'Deep learning sessions' }
      ],
      'time'
    );
  };

  const handleTimeSelect = (timeAvailable: string) => {
    addUserMessage(timeAvailable);
    setQuizAnswers(prev => ({ ...prev, timeAvailable }));
    setCurrentStep('goal');
    addAIMessage(
      `Great! ${timeAvailable} per day is perfect for building real momentum. 🎯\n\nFinally, what's your main goal? This helps me focus your plan on what matters most to you.`,
      [
        { value: 'learn basics', label: 'Learn the Basics', description: 'Understand fundamentals' },
        { value: 'create something', label: 'Create Something', description: 'Make my first project' },
        { value: 'improve skills', label: 'Improve Skills', description: 'Get better at what I know' },
        { value: 'explore and have fun', label: 'Explore & Have Fun', description: 'Discover if I like it' }
      ],
      'goal'
    );
  };

  const handleGoalSelect = async (goal: string) => {
    const goalLabels = {
      'learn basics': 'Learn the Basics',
      'create something': 'Create Something',
      'improve skills': 'Improve Skills',
      'explore and have fun': 'Explore & Have Fun'
    };
    addUserMessage(goalLabels[goal as keyof typeof goalLabels]);
    setQuizAnswers(prev => ({ ...prev, goal }));
    setCurrentStep('generating');
    addAIMessage("Perfect! I have everything I need. 🚀\n\nI'm now creating your personalized 7-day learning plan. This will take about 10-15 seconds...");
    setIsGenerating(true);
    try {
      const plan = await onGeneratePlan(selectedHobby, { ...quizAnswers, goal } as QuizAnswers);
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
      const validation = validateHobby(currentInput);
      if (validation.isValid) {
        const finalHobby = validation.suggestion || currentInput.toLowerCase().trim();
        addUserMessage(currentInput);
        setSelectedHobby(finalHobby);
        setCurrentStep('experience');
        addAIMessage(
          `Awesome choice! ${finalHobby.charAt(0).toUpperCase() + finalHobby.slice(1)} is such a rewarding hobby. 🎯\n\nTo create the perfect learning plan for you, I need to know your current experience level. What best describes you?`,
          [
            { value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
            { value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
            { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' }
          ],
          'experience'
        );
      } else {
        addUserMessage(currentInput);
        addAIMessage(validation.suggestion!, validation.options, 'hobby');
      }
    }
    setCurrentInput('');
  };

  const handleOptionSelect = (value: string, optionStep?: 'hobby' | 'experience' | 'time' | 'goal') => {
    if (optionStep && optionStep !== currentStep) {
      return;
    }
    switch (currentStep) {
      case 'hobby':
        if (value === 'different') {
          addAIMessage(
            "No problem! Here are some popular hobbies to choose from:",
            hobbyOptions,
            'hobby'
          );
        } else if (value === 'arts' || value === 'games' || value === 'nature' || value === 'diy') {
          const categoryHobbies = getCategoryHobbies(value);
          addAIMessage(
            `Great choice! Here are some popular ${value} hobbies you can learn:`,
            [
              ...categoryHobbies,
              { value: 'surprise', label: '🎲 Surprise Me!', description: 'Random hobby plan' }
            ],
            'hobby'
          );
        } else if (value.startsWith('custom:') || value === 'custom') {
          const customHobby = value === 'custom' ? currentInput : value.replace('custom:', '');
          handleHobbySelect(customHobby);
        } else {
          handleHobbySelect(value);
        }
        break;
      case 'experience':
        if (['beginner', 'some', 'intermediate'].includes(value)) {
          handleExperienceSelect(value);
        }
        break;
      case 'time':
        if (['15-30 minutes', '30-60 minutes', '60+ minutes'].includes(value)) {
          handleTimeSelect(value);
        }
        break;
      case 'goal':
        if ([
          'learn basics',
          'create something',
          'improve skills',
          'explore and have fun'
        ].includes(value)) {
          handleGoalSelect(value);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={onNavigateBack}
        currentPage="generate" 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col text-[12px]">
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message, index) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'ai' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  <span className="text-white text-lg">
                    {message.sender === 'ai' ? '🤖' : '👤'}
                  </span>
                </div>
                <div className={`rounded-2xl p-4 ${
                  message.sender === 'ai'
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                }`}>
                  <p className="whitespace-pre-line text-base leading-relaxed">
                    {message.content}
                  </p>
                  {message.options && (
                    <div className="mt-4 space-y-2">
                      {message.options.map((option) => (
                        <Button
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value, message.step)}
                          disabled={message.step !== currentStep || isTyping || isGenerating}
                          className="w-full justify-start text left bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl p-4 h-auto"
                        >
                          <div>
                            <div className="font-medium text-base">{option.label}</div>
                            {option.description && (
                              <div className="text-sm text-white/70 mt-1">{option.description}</div>
                            )}
                          </div>
                        </Button)
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <p className="text-white">Creating your personalized learning plan...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {currentStep === 'hobby' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex space-x-3">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type any hobby you want to learn..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50 text-base rounded-xl"
                disabled={isTyping || isGenerating}
              />
              <Button
                onClick={handleTextInput}
                disabled={!currentInput.trim() || isTyping || isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}