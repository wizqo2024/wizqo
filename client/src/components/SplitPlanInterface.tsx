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

	// Comprehensive hobby validation system
	const blockedKeywords = [
		// Inappropriate content
		'sex', 'sexual', 'porn', 'xxx', 'nude', 'fetish', 'bdsm', 'escort', 'adult', 'erotic',
		// Dangerous activities
		'drugs', 'cocaine', 'heroin', 'meth', 'bomb', 'weapon', 'gun', 'hacking illegal', 'terrorism',
		// Harmful activities
		'self-harm', 'suicide', 'violence', 'hate', 'racism', 'discrimination'
	];

	const religiousActivities = [
		'reading quran', 'praying', 'worship', 'religious study', 'bible study', 'meditation spiritual',
		'fasting', 'pilgrimage', 'religious ceremony', 'church', 'mosque', 'temple', 'synagogue'
	];

	const nonHobbyActivities = [
		'work', 'job', 'career', 'business', 'study', 'homework', 'exam', 'test', 'assignment',
		'chores', 'cleaning', 'cooking daily', 'shopping', 'errands', 'sleeping', 'eating',
		'watching tv', 'social media', 'internet browsing', 'gaming addiction', 'gambling'
	];

	const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');

	const isInappropriate = (text: string) => {
		const normalized = text.toLowerCase();
		return blockedKeywords.some(k => normalized.includes(k));
	};

	const isReligiousActivity = (text: string) => {
		const normalized = normalize(text);
		return religiousActivities.some(activity => normalized.includes(activity));
	};

	const isNonHobbyActivity = (text: string) => {
		const normalized = normalize(text);
		return nonHobbyActivities.some(activity => normalized.includes(activity));
	};

	const hasMultipleHobbies = (text: string) => {
		const hobbyWords = allHobbies.filter(hobby => 
			text.toLowerCase().includes(hobby.toLowerCase())
		);
		return hobbyWords.length > 1;
	};

	const findTypos = (input: string) => {
		const normalized = normalize(input);
		const suggestions = [];
		
		// Common typos mapping
		const typoMap: { [key: string]: string } = {
			'guitar': ['guitar', 'guitar playing'],
			'piano': ['piano', 'piano playing'],
			'cooking': ['cooking', 'chef', 'culinary'],
			'drawing': ['drawing', 'sketching', 'art'],
			'painting': ['painting', 'watercolor', 'acrylic'],
			'photography': ['photography', 'photo', 'camera'],
			'yoga': ['yoga', 'meditation'],
			'gardening': ['gardening', 'garden'],
			'knitting': ['knitting', 'crochet'],
			'woodworking': ['woodworking', 'carpentry'],
			'coding': ['coding', 'programming', 'web development'],
			'writing': ['writing', 'creative writing'],
			'reading': ['reading', 'books'],
			'dancing': ['dancing', 'dance'],
			'singing': ['singing', 'vocal'],
			'pottery': ['pottery', 'ceramics'],
			'calligraphy': ['calligraphy', 'handwriting'],
			'origami': ['origami', 'paper folding'],
			'jewelry': ['jewelry making', 'beading'],
			'sewing': ['sewing', 'tailoring'],
			'candle making': ['candle making', 'candles'],
			'soap making': ['soap making', 'soap'],
			'beekeeping': ['beekeeping', 'bees'],
			'bird watching': ['bird watching', 'ornithology'],
			'astronomy': ['astronomy', 'stargazing'],
			'coin collecting': ['coin collecting', 'numismatics'],
			'stamp collecting': ['stamp collecting', 'philately']
		};

		// Check for exact matches and similar words
		for (const [correct, variations] of Object.entries(typoMap)) {
			if (variations.some(v => normalized.includes(v))) {
				suggestions.push(correct);
			}
		}

		// Fuzzy matching for similar words
		const inputWords = normalized.split(' ');
		for (const hobby of allHobbies) {
			const hobbyWords = hobby.toLowerCase().split(' ');
			const similarity = inputWords.filter(word => 
				hobbyWords.some(hobbyWord => 
					hobbyWord.includes(word) || word.includes(hobbyWord) || 
					levenshteinDistance(word, hobbyWord) <= 2
				)
			).length;
			
			if (similarity > 0 && !suggestions.includes(hobby)) {
				suggestions.push(hobby);
			}
		}

		return suggestions.slice(0, 5);
	};

	const levenshteinDistance = (str1: string, str2: string) => {
		const matrix = [];
		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i];
		}
		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j;
		}
		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1,
						matrix[i][j - 1] + 1,
						matrix[i - 1][j] + 1
					);
				}
			}
		}
		return matrix[str2.length][str1.length];
	};

	const validateHobbyInput = (input: string) => {
		const normalized = normalize(input);
		
		// Check for inappropriate content
		if (isInappropriate(input)) {
			return {
				isValid: false,
				type: 'inappropriate',
				message: "I can't help with that type of activity. Let's focus on positive, creative hobbies that help you grow and learn! 🌱",
				suggestions: allHobbies.slice(0, 6)
			};
		}

		// Check for religious activities
		if (isReligiousActivity(input)) {
			return {
				isValid: false,
				type: 'religious',
				message: "That's a spiritual practice, not a hobby. I focus on creative, recreational, and skill-building activities. Here are some great hobby options:",
				suggestions: allHobbies.slice(0, 6)
			};
		}

		// Check for non-hobby activities
		if (isNonHobbyActivity(input)) {
			return {
				isValid: false,
				type: 'non-hobby',
				message: "That sounds like a daily activity or obligation rather than a hobby. Hobbies are activities you do for enjoyment and personal growth. Try one of these:",
				suggestions: allHobbies.slice(0, 6)
			};
		}

		// Check for multiple hobbies
		if (hasMultipleHobbies(input)) {
			const foundHobbies = allHobbies.filter(hobby => 
				input.toLowerCase().includes(hobby.toLowerCase())
			);
			return {
				isValid: false,
				type: 'multiple',
				message: `I see you mentioned multiple hobbies: ${foundHobbies.join(', ')}. Let's focus on one hobby at a time for the best learning experience. Which one interests you most?`,
				suggestions: foundHobbies.slice(0, 4)
			};
		}

		// Check for typos and suggest corrections
		const typoSuggestions = findTypos(input);
		if (typoSuggestions.length > 0 && !allHobbies.some(h => h.toLowerCase() === normalized)) {
			return {
				isValid: false,
				type: 'typo',
				message: `Did you mean one of these hobbies?`,
				suggestions: typoSuggestions
			};
		}

		// Check if it's a valid hobby
		const exactMatch = allHobbies.find(h => h.toLowerCase() === normalized);
		if (exactMatch) {
			return {
				isValid: true,
				type: 'exact',
				hobby: exactMatch
			};
		}

		// Check for partial matches
		const partialMatches = allHobbies.filter(h => 
			h.toLowerCase().includes(normalized) || normalized.includes(h.toLowerCase())
		);

		if (partialMatches.length > 0) {
			return {
				isValid: false,
				type: 'partial',
				message: "I found some similar hobbies. Did you mean one of these?",
				suggestions: partialMatches.slice(0, 4)
			};
		}

		// No matches found
		return {
			isValid: false,
			type: 'no-match',
			message: "I don't recognize that as a hobby. Here are some popular options to choose from:",
			suggestions: allHobbies.slice(0, 6)
		};
	};

	const fuzzySuggest = (input: string) => {
		const validation = validateHobbyInput(input);
		return validation.suggestions || allHobbies.slice(0, 6);
	};

	const preflightDuplicateCheck = async (hobby: string): Promise<'ok'|'duplicate'> => {
		if (!user?.id) return 'ok';
		try {
			const existing = await hobbyPlanService.checkExistingPlan(hobby, user.id);
			if (existing) {
				setExistingPlanCandidate(existing);
				// Show duplicate plan dialog with options
				setMessages(prev => [...prev, {
					id: Date.now().toString(),
					sender: 'ai',
					content: `You already have a ${hobby} learning plan! 📚\n\nI found an existing plan in your dashboard. Would you like to continue your existing plan or create a fresh one?`,
					options: [
						{ value: 'continue_existing', label: 'Continue Existing Plan', description: 'Go to dashboard to continue where you left off' },
						{ value: 'create_new', label: 'Create Fresh Plan', description: 'Generate a new plan with different approach' },
						{ value: 'go_dashboard', label: 'View All Plans', description: 'See all your learning plans' }
					],
					timestamp: new Date()
				}]);
				return 'duplicate';
			}
		} catch (e) {
			console.log('Duplicate check failed, proceeding');
		}
		return 'ok';
	};

	const generatePlanFlow = async (hobby: string, qa: QuizAnswers = defaultAnswers, forceNew: boolean = false) => {
		// Only check for duplicates if not forcing a new plan
		if (!forceNew) {
			const dup = await preflightDuplicateCheck(hobby);
			if (dup === 'duplicate') return;
		}
		
		// Check plan limits for logged-in users
		if (user?.id) {
			try {
				// Use the same API endpoint as the dashboard for consistency
				const timestamp = Date.now();
				const plansResponse = await fetch(`/api/hobby-plans?user_id=${user.id}&_t=${timestamp}&_bustCache=true`, {
					cache: 'no-cache',
					headers: {
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': '0'
					}
				});
				
				let userPlans: any[] = [];
				if (plansResponse.ok) {
					userPlans = await plansResponse.json();
					console.log('Plan limit check: Found', userPlans.length, 'plans');
				}
				
				if (userPlans.length >= 5) {
					setMessages(prev => [...prev, { 
						id: Date.now().toString(), 
						sender: 'ai', 
						content: `You have reached the maximum limit of 5 plans. You currently have ${userPlans.length} plans. Please delete an existing plan from your dashboard before creating a new one.`, 
						options: [
							{ value: 'check_plans', label: 'Check My Plans', description: 'View dashboard to see all plans' },
							{ value: 'debug_plans', label: 'Debug Plan Count', description: 'Check what plans exist' }
						],
						timestamp: new Date() 
					}]);
					return;
				}
			} catch (e) {
				console.log('Plan limit check failed, proceeding:', e);
			}
		}
		
		try {
			setChatStep('generating');
			// Clear old chat messages when starting a new plan generation
			setMessages([]);
			const plan = await onGeneratePlan(hobby, qa);
			setPlanData(plan);
			setShowSuggestions(false);
			setCompletedDays([]);
			
			// Save plan to database if user is logged in
			if (user?.id) {
				try {
					const savedPlan = await hobbyPlanService.savePlan({
						...plan,
						user_id: user.id,
						hobby: hobby
					});
					
					// Initialize progress for the saved plan
					await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
					
					console.log('Plan saved successfully:', savedPlan.id);
				} catch (saveError) {
					console.error('Failed to save plan:', saveError);
					// Don't block the UI, just log the error
				}
			}
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
		// Clear old chat messages and start fresh
		setMessages([]);
		// Add fresh welcome message
		setTimeout(() => {
			let welcomeContent = "Hi! 👋 Tell me what hobby you'd like to learn.";
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
			sendHobbySuggestionsMessage();
		}, 100);
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

		// Handle duplicate plan options
		if (value === 'continue_existing' || value === 'create_new' || value === 'go_dashboard') {
			setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: value === 'continue_existing' ? 'Continue Existing Plan' : value === 'create_new' ? 'Create New Plan' : 'View Dashboard', timestamp: new Date() }]);
			
			if (value === 'continue_existing') {
				// Navigate to dashboard to continue existing plan
				window.location.href = '/#/dashboard';
				return;
			} else if (value === 'go_dashboard') {
				// Navigate to dashboard
				window.location.href = '/#/dashboard';
				return;
			} else if (value === 'create_new') {
				// Clear existing plan candidate and proceed with new plan
				setExistingPlanCandidate(null);
				setChatStep('hobby');
				// Generate new plan for the same hobby, bypassing duplicate check
				if (selectedHobby) {
					setMessages(prev => [...prev, {
						id: Date.now().toString(),
						sender: 'ai',
						content: `Great! I'll create a fresh ${selectedHobby} learning plan for you. Generating now...`,
						timestamp: new Date()
					}]);
					await generatePlanFlow(selectedHobby, defaultAnswers, true);
				}
				return;
			}
		}

		// Handle plan limit debug options
		if (value === 'check_plans' || value === 'debug_plans') {
			setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: value === 'check_plans' ? 'Check My Plans' : 'Debug Plan Count', timestamp: new Date() }]);
			
			if (value === 'check_plans') {
				window.location.href = '/#/dashboard';
				return;
			} else if (value === 'debug_plans') {
				// Debug: Check what plans actually exist
				try {
					const timestamp = Date.now();
					const plansResponse = await fetch(`/api/hobby-plans?user_id=${user?.id}&_t=${timestamp}&_bustCache=true`, {
						cache: 'no-cache',
						headers: {
							'Cache-Control': 'no-cache, no-store, must-revalidate',
							'Pragma': 'no-cache',
							'Expires': '0'
						}
					});
					
					let userPlans: any[] = [];
					if (plansResponse.ok) {
						userPlans = await plansResponse.json();
					}
					
					setMessages(prev => [...prev, {
						id: Date.now().toString(),
						sender: 'ai',
						content: `🔍 Debug Info:\n\nAPI Response Status: ${plansResponse.status}\nPlans Found: ${userPlans.length}\n\nPlan Details:\n${userPlans.map((plan, i) => `${i + 1}. ${plan.title || plan.hobby} (ID: ${plan.id})`).join('\n') || 'No plans found'}`,
						timestamp: new Date()
					}]);
				} catch (error) {
					setMessages(prev => [...prev, {
						id: Date.now().toString(),
						sender: 'ai',
						content: `❌ Debug Error: ${error}`,
						timestamp: new Date()
					}]);
				}
				return;
			}
		}

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
			const validation = validateHobbyInput(value);
			
			if (!validation.isValid) {
				const options = validation.suggestions?.map(h => ({ 
					value: h, 
					label: h.charAt(0).toUpperCase() + h.slice(1) 
				})) || [];
				
				if (validation.type !== 'multiple' && options.length > 0) {
					options.push({ value: '__surprise__', label: 'Surprise Me 🎲' });
				}
				
				setMessages(prev => [...prev, { 
					id: Date.now().toString(), 
					sender: 'ai', 
					content: validation.message, 
					options, 
					timestamp: new Date() 
				}]);
				return;
			}
			
			setSelectedHobby(validation.hobby);
			setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: validation.hobby, timestamp: new Date() }]);
			await generatePlanFlow(validation.hobby, defaultAnswers); // skip extra questions
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
		const validation = validateHobbyInput(hobby);
		
		if (!validation.isValid) {
			const options = validation.suggestions?.map(h => ({ 
				value: h, 
				label: h.charAt(0).toUpperCase() + h.slice(1) 
			})) || [];
			
			if (validation.type !== 'multiple' && options.length > 0) {
				options.push({ value: '__surprise__', label: 'Surprise Me 🎲' });
			}
			
			setMessages(prev => [...prev, { 
				id: Date.now().toString(), 
				sender: 'ai', 
				content: validation.message, 
				options, 
				timestamp: new Date() 
			}]);
			return;
		}
		
		setSelectedHobby(validation.hobby);
		setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: validation.hobby, timestamp: new Date() }]);
		await generatePlanFlow(validation.hobby, defaultAnswers);
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
			const validation = validateHobbyInput(text);
			
			if (!validation.isValid) {
				// Create options from suggestions
				const options = validation.suggestions?.map(h => ({ 
					value: h, 
					label: h.charAt(0).toUpperCase() + h.slice(1) 
				})) || [];
				
				// Add "Surprise Me" option for most cases
				if (validation.type !== 'multiple' && options.length > 0) {
					options.push({ value: '__surprise__', label: 'Surprise Me 🎲' });
				}
				
				setMessages(prev => [...prev, { 
					id: Date.now().toString(), 
					sender: 'ai', 
					content: validation.message, 
					options, 
					timestamp: new Date() 
				}]);
				return;
			}
			
			// Valid hobby found
			setSelectedHobby(validation.hobby);
			setMessages(prev => [...prev, { 
				id: Date.now().toString(), 
				sender: 'ai', 
				content: `Perfect! Let's create your ${validation.hobby} learning plan. Generating now...`, 
				timestamp: new Date() 
			}]);
			generatePlanFlow(validation.hobby, defaultAnswers);
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
							<div className="flex-1 relative">
								<Input
									ref={inputRef}
									value={currentInput}
									onChange={(e) => setCurrentInput(e.target.value.slice(0, 50))}
									placeholder="Ask me anything... (max 50 chars)"
									maxLength={50}
									onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
									className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-xs md:text-sm h-8 md:h-10 pr-12"
								/>
								<div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
									{currentInput.length}/50
								</div>
							</div>
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
							<PlanDisplay 
								planData={planData} 
								user={user} 
								setShowAuthModal={setShowAuthModal}
								completedDays={completedDays}
								setCompletedDays={setCompletedDays}
							/>
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
