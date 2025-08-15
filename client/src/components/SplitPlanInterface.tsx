import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { BookOpen, Clock, Send } from 'lucide-react';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { PlanDisplay } from '@/components/PlanDisplay';
import { hobbyPlanService } from '@/services/hobbyPlanService';

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
	const [completedDays, setCompletedDays] = useState<number[]>([]);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(!initialPlanData);

	const [chatStep, setChatStep] = useState<'idle' | 'hobby' | 'experience' | 'time' | 'goal' | 'generating'>('hobby');
	const [selectedHobby, setSelectedHobby] = useState('');
	const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();
	usePlanStorage();

	const defaultAnswers: QuizAnswers = { experience: 'beginner', timeAvailable: '1 hour', goal: 'personal enjoyment' };
	const allHobbies: string[] = [
		'guitar','piano','violin','drums','singing','music production','dj','ukulele','flute','saxophone',
		'painting','drawing','sketching','watercolor','digital art','calligraphy','graphic design','animation',
		'photography','videography','photo editing','video editing','film making','blogging','podcasting','writing','creative writing','poetry','journaling',
		'coding','programming','web development','app development','game development','data science','machine learning',
		'cooking','baking','grilling','coffee brewing','mixology','nutrition','meal prep',
		'yoga','meditation','pilates','running','cycling','swimming','weightlifting','calisthenics','boxing','martial arts',
		'chess','board games','puzzle solving','origami','knitting','crochet','sewing','embroidery','woodworking','leathercraft','jewelry making',
		'gardening','bonsai','indoor plants','herbalism',
		'language learning','spanish','french','german','japanese','korean','arabic',
		'public speaking','storytelling','debate','reading Quran','Bible reading'
	];
	const hobbySuggestions = allHobbies;

	const [existingPlanCandidate, setExistingPlanCandidate] = useState<any>(null);

	const blockedKeywords = ['sex','sexual','porn','xxx','nude','fetish','bdsm','escort','adult','erotic','drugs','cocaine','heroin','meth','bomb','weapon','gun','hacking illegal'];
	const isInappropriate = (text: string) => blockedKeywords.some(k => text.toLowerCase().includes(k));
	const normalize = (s: string) => s.toLowerCase().trim();
	const fuzzySuggest = (input: string) => {
		const n = normalize(input).replace(/\s+/g,'');
		const candidates = allHobbies.filter(h => {
			const hn = h.toLowerCase().replace(/\s+/g,'');
			return hn.includes(n) || n.includes(hn);
		});
		return (candidates.length > 0 ? candidates.slice(0,6) : allHobbies.slice(0,6));
	};

	const preflightDuplicateCheck = async (hobby: string): Promise<'ok'|'duplicate'> => {
		if (!user?.id) return 'ok';
		try {
			const existing = await hobbyPlanService.checkExistingPlan(hobby, user.id);
			if (existing) {
				setExistingPlanCandidate(existing);
				return 'duplicate';
			}
		} catch (e) {
			console.log('Duplicate check failed, proceeding');
		}
		return 'ok';
	};

	const generatePlanFlow = async (hobby: string, qa: QuizAnswers = defaultAnswers) => {
		const dup = await preflightDuplicateCheck(hobby);
		if (dup === 'duplicate') return;
		try {
			setChatStep('generating');
			const plan = await onGeneratePlan(hobby, qa);
			setPlanData(plan);
			setShowSuggestions(false);
			setCompletedDays([]);
		} catch (e) {
			setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: 'Sorry, I had trouble generating the plan. Please try again.', timestamp: new Date() }]);
		} finally {
			setChatStep('idle');
		}
	};

	const sendHobbySuggestionsMessage = () => {
		const top = hobbySuggestions.slice(0, 6);
		const options = [
			...top.map(h => ({ value: h, label: h.charAt(0).toUpperCase() + h.slice(1) })),
			{ value: '__surprise__', label: 'Surprise Me 🎲' }
		];
		setMessages(prev => [
			...prev,
			{ id: Date.now().toString(), sender: 'ai', content: 'Pick a hobby to get started:', options, timestamp: new Date() }
		]);
		setChatStep('hobby');
	};

	useEffect(() => {
		if (messages.length === 0) {
			let welcomeContent = "Hi! 👋 Tell me what hobby you'd like to learn.";
			
			// If user is already signed in, show personalized welcome
			if (user) {
				const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
				welcomeContent = `Welcome back, ${userName}! 👋 I'm here to help you with your hobby learning journey. What would you like to work on today?`;
			}
			
			setMessages([
				{
					id: 'welcome',
					sender: 'ai',
					content: welcomeContent,
					timestamp: new Date()
				}
			]);
			// also show quick suggestions
			sendHobbySuggestionsMessage();
		}
	}, [user]);

	// Listen for authentication events
	useEffect(() => {
		const handleUserSignedIn = (event: CustomEvent) => {
			const user = event.detail.user;
			const welcomeMessage = `Welcome back, ${user.user_metadata?.full_name || user.user_metadata?.name || user.email}! 👋 I'm here to help you with your hobby learning journey. What would you like to work on today?`;
			
			setMessages(prev => [
				...prev,
				{
					id: Date.now().toString(),
					sender: 'ai',
					content: welcomeMessage,
					timestamp: new Date()
				}
			]);
		};

		const handleUserSignedOut = () => {
			const signOutMessage = "You've been signed out. Feel free to continue exploring hobbies or sign in again to save your progress!";
			
			setMessages(prev => [
				...prev,
				{
					id: Date.now().toString(),
					sender: 'ai',
					content: signOutMessage,
					timestamp: new Date()
				}
			]);
		};

		window.addEventListener('userSignedIn', handleUserSignedIn as EventListener);
		window.addEventListener('userSignedOut', handleUserSignedOut);

		return () => {
			window.removeEventListener('userSignedIn', handleUserSignedIn as EventListener);
			window.removeEventListener('userSignedOut', handleUserSignedOut);
		};
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
			], timestamp: new Date() }
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
			], timestamp: new Date() }
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
			], timestamp: new Date() }
		]);
		setChatStep('goal');
	};

	const handleOptionSelect = async (value: string) => {

		if (chatStep === 'hobby') {
			if (value === '__surprise__') {
				const random = allHobbies[Math.floor(Math.random() * allHobbies.length)];
				setSelectedHobby(random);
				setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: 'Surprise Me 🎲', timestamp: new Date() }]);
				// Generate immediately with defaults
				await generatePlanFlow(random, defaultAnswers);
				return;
			}
			// value is a hobby
			if (isInappropriate(value)) {
				const opts = fuzzySuggest('hobby').map(h => ({ value: h, label: h.charAt(0).toUpperCase()+h.slice(1) }));
				setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: "I'm not sure about that hobby. Please pick a safe option below:", options: opts, timestamp: new Date() }]);
				return;
			}
			setSelectedHobby(value);
			await generatePlanFlow(value, defaultAnswers); // skip extra questions
			return;
		}
		if (chatStep === 'experience') {
			setAnswers(prev => ({ ...prev, experience: value }));
			askTime();
			return;
		}
		if (chatStep === 'time') {
			setAnswers(prev => ({ ...prev, timeAvailable: value }));
			askGoal();
			return;
		}
		if (chatStep === 'goal') {
			await generatePlanFlow(selectedHobby, {
				experience: answers.experience || 'beginner',
				timeAvailable: answers.timeAvailable || '1 hour',
				goal: value || 'personal enjoyment'
			});
			return;
		}
	};

	const handlePickHobby = async (hobby: string) => {
		if (isInappropriate(hobby)) {
			const opts = fuzzySuggest('hobby').map(h => ({ value: h, label: h.charAt(0).toUpperCase()+h.slice(1) }));
			setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: "I'm not sure about that hobby. Please pick a safe option below:", options: opts, timestamp: new Date() }]);
			return;
		}
		setSelectedHobby(hobby);
		setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: hobby, timestamp: new Date() }]);
		await generatePlanFlow(hobby, defaultAnswers);
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		if (user && showAuthModal) setShowAuthModal(false);
	}, [user, showAuthModal]);

	const handleSendMessage = async () => {
		if (!currentInput.trim()) return;
		const text = currentInput.trim();
		setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: text, timestamp: new Date() }]);
		setCurrentInput('');
		
		// If we have a plan, treat as general chat
		if (planData) {
			try {
				const response = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						question: text,
						planData: planData,
						hobbyContext: planData.hobby
					})
				});
				
				if (response.ok) {
					const data = await response.json();
					setMessages(prev => [...prev, { 
						id: Date.now().toString(), 
						sender: 'ai', 
						content: data.response, 
						timestamp: new Date() 
					}]);
				} else {
					setMessages(prev => [...prev, { 
						id: Date.now().toString(), 
						sender: 'ai', 
						content: "I'm here to help with your learning plan! What would you like to know?", 
						timestamp: new Date() 
					}]);
				}
			} catch (error) {
				console.error('Chat error:', error);
				setMessages(prev => [...prev, { 
					id: Date.now().toString(), 
					sender: 'ai', 
					content: "I'm here to help with your learning plan! What would you like to know?", 
					timestamp: new Date() 
				}]);
			}
			return;
		}
		
		// If no plan and in hobby selection mode, treat as hobby input
		if (!planData && (chatStep === 'hobby' || chatStep === 'idle')) {
			if (isInappropriate(text)) {
				const opts = fuzzySuggest('hobby').map(h => ({ value: h, label: h.charAt(0).toUpperCase()+h.slice(1) }));
				setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: "I'm not sure about that hobby. Please pick a safe option below:", options: opts, timestamp: new Date() }]);
				return;
			}
			// fuzzy normalization/typo correction
			const suggestions = fuzzySuggest(text);
			if (suggestions.length > 0) {
				setSelectedHobby(suggestions[0]);
				setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: `Did you mean ${suggestions[0]}? Generating now...`, timestamp: new Date() }]);
				generatePlanFlow(suggestions[0], defaultAnswers);
			} else {
				setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: 'Please pick a hobby below to begin:', options: fuzzySuggest('hobby').map(h => ({ value: h, label: h.charAt(0).toUpperCase()+h.slice(1) })), timestamp: new Date() }]);
			}
		}
	};

	const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);

	const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

	return (
		<div className="min-h-screen bg-slate-50">
			<UnifiedNavigation 
				showBackButton={true} 
				onBackClick={onNavigateBack}
				currentPage={planData ? "plan" : "generate"}
			/>

			<div className="flex flex-col md:flex-row md:h-[calc(100vh-64px)]">
				<div className="w-full md:w-[420px] lg:w-[480px] bg-white border-b border-gray-200 md:border-b-0 md:border-r flex flex-col h-64 md:h-full">
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
								}`}> 
									<div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
										{message.content}
									</div>
									{message.options && (
										<div className="mt-2 flex flex-wrap gap-2">
											{message.options.map(opt => (
												<Button key={opt.value} size="sm" variant="secondary" onClick={() => handleOptionSelect(opt.value)} className="px-2 py-1 text-xs">
													{opt.label}
												</Button>
											))}
										</div>
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					<div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 shrink-0">
						<div className="flex space-x-2">
							<Input
								ref={inputRef}
								value={currentInput}
								onChange={(e) => setCurrentInput(e.target.value)}
								placeholder="Ask me anything..."
								onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
								className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-xs md:text-sm h-8 md:h-10"
							/>
							<Button onClick={handleSendMessage} size="sm" className="px-2 md:px-3 h-8 md:h-10">
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
									<span className="text-sm text-gray-600">{completedDays.length}/{planData.totalDays} days completed</span>
								</div>
								<Progress value={progressPercentage} className="h-2" />
							</div>

							{/* Full plan content */}
							<PlanDisplay planData={planData} user={user} setShowAuthModal={setShowAuthModal} />
						</div>
					) : (
						<div className="p-6 lg:p-10">
							<div className="max-w-5xl mx-auto space-y-10">
								<div className="text-center">
									<div className="text-6xl mb-6">🎯</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
									<p className="text-lg text-gray-700 leading-relaxed">
										Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. Your custom learning plan will appear here once we chat!
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
										{[
											{ icon: '📸', label: 'Photography', key: 'photography' },
											{ icon: '🎨', label: 'Painting', key: 'painting' },
											{ icon: '🍳', label: 'Cooking', key: 'cooking' },
											{ icon: '💻', label: 'Coding', key: 'coding' },
											{ icon: '🧶', label: 'Knitting', key: 'knitting' },
											{ icon: '🏡', label: 'Gardening', key: 'gardening' },
											{ icon: '✍️', label: 'Writing', key: 'writing' },
											{ icon: '♟️', label: 'Chess', key: 'chess' },
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

			<AuthModal 
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
