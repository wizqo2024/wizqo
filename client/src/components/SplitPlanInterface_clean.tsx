
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, Send, Play } from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { apiService } from '@/lib/api-service';
import { supabase } from '@/lib/supabase';
import Loader from './Loader';

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
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
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
    'language learning', 'spanish language', 'french language', 'german language', 'japanese language', 'korean language',
    'coding', 'web development', 'app development', 'game development',
    'bird watching', 'astronomy', 'stargazing', 'kite flying', 'calligraphy practice'
  ];
  const surpriseAnswers: QuizAnswers = { experience: 'beginner', timeAvailable: '1 hour', goal: 'personal enjoyment' };

  useEffect(() => {
    if (initialPlanData) {
      const fixedPlanData = fixPlanDataFields(initialPlanData);
      setPlanData(fixedPlanData);
    }
  }, [initialPlanData]);

  // ... existing code ...

          ) : isGenerating ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-6">
              <Loader />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">Creating your 7‑day plan…</h3>
                <p className="text-gray-500 text-sm mt-1">This usually takes 20–60 seconds</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-full p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-6">🎯</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. 
                    Your custom learning plan will appear here once we chat!
                  </p>
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
    </div>
  );
}