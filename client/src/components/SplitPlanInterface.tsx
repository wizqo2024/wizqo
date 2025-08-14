import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, Send, Play, MessageCircle } from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { apiService } from '@/lib/api-service';
import { supabase } from '@/lib/supabase';

export interface QuizAnswers {
	experience: string;
	timeCommitment: string;
	specificGoal: string;
	hobby: string;
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

export interface PlanData {
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
	onGeneratePlan: (hobby: string, answers: QuizAnswers, userId?: string, force?: boolean) => Promise<PlanData>;
	onNavigateBack: () => void;
	initialPlanData?: PlanData & { id?: string; planId?: string };
}

// Normalize backend/legacy plan shapes into the UI shape
const fixPlanDataFields = (plan: any): PlanData => {
	if (!plan) return plan;

	const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];

	const fixedPlan: PlanData = {
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
			youtubeVideoId: day.youtubeVideoId || (day.freeResources?.[0]?.link?.match(/v=([^&]+)/)?.[1]) || 'ewJNyS9pe-Y',
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
	const [currentStep, setCurrentStep] = useState<'hobby' | 'experience' | 'time' | 'goal' | 'generating' | 'plan'>('hobby');
	const [isTyping, setIsTyping] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [planData, setPlanData] = useState<PlanData | null>(null);
	const [completedDays, setCompletedDays] = useState<number[]>([]);
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
	const [isSavingProgress, setIsSavingProgress] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { savePlan, saving } = usePlanStorage();
	const { user } = useAuth();

	// Helpers
	const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
	const isDayUnlocked = (dayNumber: number) => dayNumber === 1 || (user && isDayCompleted(dayNumber - 1));
	const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Message helpers
	const addAIMessage = (content: string, options?: { value: string; label: string; description?: string }[]) => {
		setMessages(prev => ([
			...prev,
			{ id: `${Date.now()}_${prev.length}`, sender: 'ai', content, options, timestamp: new Date() }
		]));
	};
	const addUserMessage = (content: string) => {
		setMessages(prev => ([
			...prev,
			{ id: `${Date.now()}_${prev.length}`, sender: 'user', content, timestamp: new Date() }
		]));
	};

	const experienceOptions = [
		{ value: 'beginner', label: 'Beginner 🌱' },
		{ value: 'intermediate', label: 'Intermediate 🧭' },
		{ value: 'advanced', label: 'Advanced 🏆' },
	];
	const timeOptions = [
		{ value: '15 minutes', label: '15 minutes/day' },
		{ value: '30 minutes', label: '30 minutes/day' },
		{ value: '1 hour', label: '1 hour/day' },
	];
	const goalOptions = [
		{ value: 'personal enjoyment', label: 'Personal enjoyment' },
		{ value: 'skill improvement', label: 'Improve skills' },
		{ value: 'professional', label: 'Professional growth' },
	];

	const randomHobbies = ['photography', 'guitar', 'cooking', 'drawing', 'yoga', 'gardening', 'coding', 'dance'];

	// Generate plan using provided answers
	const handleGenerate = async (hobby: string, answers: Partial<QuizAnswers>) => {
		if (!hobby || !answers.experience) return;
		setIsGenerating(true);
		try {
			const finalAnswers: QuizAnswers = {
				experience: answers.experience!,
				timeCommitment: answers.timeCommitment || '30 minutes',
				specificGoal: answers.specificGoal || 'Learn the basics',
				hobby: hobby,
			};

			const plan = await onGeneratePlan(hobby, finalAnswers, user?.id || undefined, false);
			const fixed = fixPlanDataFields(plan);
			setPlanData(fixed);
			setCurrentStep('plan');
			localStorage.setItem('lastViewedPlanData', JSON.stringify(fixed));
			sessionStorage.setItem('activePlanData', JSON.stringify(fixed));
			sessionStorage.setItem('currentPlanData', JSON.stringify(fixed));
		} catch (e) {
			console.error('Error generating plan:', e);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSurpriseMe = async () => {
		const random = randomHobbies[Math.floor(Math.random() * randomHobbies.length)];
		setSelectedHobby(random);
		setQuizAnswers({ experience: 'beginner', timeCommitment: '1 hour', specificGoal: 'personal enjoyment', hobby: random });
		setCurrentStep('generating');
		await handleGenerate(random, { experience: 'beginner', timeCommitment: '1 hour', specificGoal: 'personal enjoyment', hobby: random });
	};

	const handleOptionSelect = async (value: string, label: string) => {
		if (value === 'surprise' && currentStep === 'hobby') {
			await handleSurpriseMe();
			return;
		}

		addUserMessage(label);

		if (currentStep === 'hobby') {
			setSelectedHobby(value);
			setCurrentStep('experience');
			addAIMessage(`Great choice! ${value} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
			return;
		}
		if (currentStep === 'experience') {
			setQuizAnswers(prev => ({ ...prev, experience: value }));
			setCurrentStep('time');
			addAIMessage('Got it! How much time can you spend learning each day?', timeOptions);
			return;
		}
		if (currentStep === 'time') {
			setQuizAnswers(prev => ({ ...prev, timeCommitment: value }));
			setCurrentStep('goal');
			addAIMessage("Perfect! What's your main goal for learning this hobby?", goalOptions);
			return;
		}
		if (currentStep === 'goal') {
			const final = { ...quizAnswers, specificGoal: value } as QuizAnswers;
			setQuizAnswers(final);
			setCurrentStep('generating');
			await handleGenerate(selectedHobby, final);
			return;
		}
	};

	const handleSendMessage = async () => {
		if (!currentInput.trim()) return;
		const input = currentInput.trim();
		setCurrentInput('');
		if (currentStep === 'hobby') {
			setSelectedHobby(input.toLowerCase());
			addUserMessage(input);
			setCurrentStep('experience');
			addAIMessage(`Great choice! ${input} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
			return;
		}
		if (currentStep === 'experience') {
			addUserMessage(input);
			setQuizAnswers(prev => ({ ...prev, experience: input.toLowerCase() }));
			setCurrentStep('time');
			addAIMessage('Got it! How much time can you spend learning each day?', timeOptions);
			return;
		}
		if (currentStep === 'time') {
			addUserMessage(input);
			setQuizAnswers(prev => ({ ...prev, timeCommitment: input }));
			setCurrentStep('goal');
			addAIMessage("Perfect! What's your main goal for learning this hobby?", goalOptions);
			return;
		}
		if (currentStep === 'goal') {
			addUserMessage(input);
			const final = { ...quizAnswers, specificGoal: input } as QuizAnswers;
			await handleGenerate(selectedHobby, final);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<UnifiedNavigation 
				showBackButton={true} 
				onBackClick={onNavigateBack}
				currentPage={planData ? 'plan' : 'generate'}
			/>

			<div className="flex flex-col min-h-[calc(100vh-64px)]">
				{/* Chat area header and messages */}
				<div className="w-full bg-white border-b-2 border-gray-300 flex flex-col h-64 md:h-80">
					<div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
						<h2 className="text-sm md:text-lg font-semibold text-gray-900">Learning Assistant</h2>
						<p className="text-xs md:text-sm text-gray-600">Ask me anything about your plan</p>
					</div>

					<div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
						{messages.map((message, index) => (
							<div key={`${message.id}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div className={`max-w-[85%] rounded-lg px-2 md:px-3 py-1.5 md:py-2 shadow-sm ${
									message.sender === 'user' 
										? 'bg-blue-600 text-white' 
										: 'bg-white text-gray-900 border border-gray-200'
								}` }>
									<div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
										{message.content}
									</div>
								</div>
							</div>
						))}
						{/* Render options for the last AI message */}
						{(() => {
							const last = messages[messages.length - 1];
							if (last && last.sender === 'ai' && last.options && last.options.length > 0 && currentStep !== 'plan') {
								return (
									<div className="flex flex-wrap gap-2 mt-2">
										{last.options.map((option) => (
											<button
												key={option.value}
												onClick={() => handleOptionSelect(option.value, option.label)}
												className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50"
												disabled={isGenerating}
											>
												{option.label}
											</button>
										))}
									</div>
								);
							}
							return null;
						})()}
						<div ref={messagesEndRef} />
					</div>

					<div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 shrink-0">
						<div className="flex space-x-2">
							<Input
								ref={inputRef}
								value={currentInput}
								onChange={(e) => setCurrentInput(e.target.value)}
								placeholder="Type your answer..."
								onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
								className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-xs md:text-sm h-8 md:h-10"
							/>
							<Button onClick={handleSendMessage} size="sm" className="px-2 md:px-3 h-8 md:h-10">
								<Send className="w-3 h-3 md:w-4 md:h-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Plan area */}
				<div className="w-full flex-1 overflow-y-auto bg-gray-50">
					{planData && planData.days ? (
						<div className="p-4 lg:p-6">
							<div className="mb-6">
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

							<div className="mb-6">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-700">Progress</span>
									<span className="text-sm text-gray-600">{completedDays.length}/{planData.totalDays} days completed</span>
								</div>
								<Progress value={progressPercentage} className="h-2" />
							</div>

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
					) : (
						<div className="flex items-center justify-center min-h-full p-6">
							<div className="max-w-2xl mx-auto space-y-6">
								<div className="text-center">
									<div className="text-6xl mb-6">🎯</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
									<p className="text-lg text-gray-700 leading-relaxed">
										Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<AuthModal 
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
