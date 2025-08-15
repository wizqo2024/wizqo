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

// Function to fix field mapping consistently across all plan data sources
const fixPlanDataFields = (plan: any) => {
	if (!plan) return plan;
	
	// Extract days array from various possible nested structures
	const daysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
	
	console.log('🔧 fixPlanDataFields - Input plan structure:', {
		hasDays: !!plan.days,
		hasPlanData: !!plan.plan_data,
		hasPlanDataDays: !!plan.plan_data?.days,
		daysArrayLength: daysArray.length
	});
	
	if (!daysArray || daysArray.length === 0) {
		console.warn('🔧 fixPlanDataFields - No days array found in plan data');
		return plan;
	}
	
	const fixedPlan = {
		...plan,
		// Preserve important top-level fields from backend
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
	
	console.log('🔧 fixPlanDataFields - Output plan days count:', fixedPlan.days.length);
	return fixedPlan;
};

export function SplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: SplitPlanInterfaceProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(() => {
		// Initialize with welcome message immediately if no plan data
		if (!initialPlanData) {
			console.log('🔄 Initializing messages state with welcome message');
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
	
	// Fix initial loading state
	useEffect(() => {
		setIsTyping(false);
	}, []);
	const [isGenerating, setIsGenerating] = useState(false);
	const [planData, setPlanData] = useState<PlanData | null>(null);
	const [completedDays, setCompletedDays] = useState<number[]>([]);
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
	const [isSavingProgress, setIsSavingProgress] = useState(false);
	
	// Store plan data for dashboard navigation when plan is generated
	useEffect(() => {
		if (planData) {
			const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			console.log('🔍 Direct Supabase session check:', planId, planData.hobby);
			localStorage.setItem('lastViewedPlan', planId);
			localStorage.setItem('lastViewedPlanData', JSON.stringify(planData));
			// Also store in session for immediate back navigation
			sessionStorage.setItem('activePlanData', JSON.stringify(planData));
			sessionStorage.setItem('activePlanId', planId);
		}
	}, [planData]);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { savePlan, saving } = usePlanStorage();
	const { user } = useAuth();

	// Auto-close auth modal when user signs in
	useEffect(() => {
		if (user && showAuthModal) {
			console.log('🔐 User signed in, closing auth modal');
			setShowAuthModal(false);
		}
	}, [user]);

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

	const surpriseHobbies = ['photography', 'guitar', 'cooking', 'drawing', 'yoga', 'gardening', 'coding'];
	const surpriseAnswers: QuizAnswers = {
		experience: 'beginner',
		timeAvailable: '1 hour',
		goal: 'personal enjoyment'
	};

	// Initialize with plan data if provided (for back navigation from dashboard)
	useEffect(() => {
		if (initialPlanData) {
			console.log('🔄 Initializing with existing plan data:', initialPlanData.hobby);
			const fixedPlanData = fixPlanDataFields(initialPlanData);
			console.log('🔧 Applied field mapping fix to initial plan data');
			setPlanData(fixedPlanData);
			
			// CRITICAL FIX: Set plan ID from initial plan data if available
			if (initialPlanData.id || initialPlanData.planId) {
				const planId = initialPlanData.id || initialPlanData.planId;
				console.log('🎯 Setting plan ID from initial data:', planId);
				setCurrentPlanId(planId.toString());
			}
			
			// Also check storage for plan ID
			const storedPlanId = sessionStorage.getItem('currentPlanId') || localStorage.getItem('currentPlanId');
			if (storedPlanId) {
				console.log('🎯 Found stored plan ID:', storedPlanId);
				setCurrentPlanId(storedPlanId);
			}
		}
	}, [initialPlanData]);

	// Separate effect to handle authentication and plan ID detection
	useEffect(() => {
		if (user && initialPlanData && initialPlanData.hobby && !currentPlanId) {
			console.log('🔍 User authenticated, looking for plan ID for hobby:', initialPlanData.hobby);
			console.log('🔍 User ID:', user.id);
			
			const findPlanId = async () => {
				try {
					// Use the same direct API approach as the dashboard - no hobby column in production
					console.log('🔍 Using direct API to find plans for hobby:', initialPlanData.hobby);
					const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc`, {
						headers: {
							'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
							'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
						}
					});
					
					if (response.ok) {
						const allPlans = await response.json();
						console.log('🔍 Direct API query result:', { totalPlans: allPlans?.length || 0 });
						console.log('🔍 All user plans:', allPlans?.map((p: any) => ({ id: p.id, title: p.title })));
						
						// Filter for the specific hobby by extracting from title
						const supabasePlans = allPlans?.filter((p: any) => {
							if (p.title) {
								const titleMatch = p.title.match(/Learn (\w+) in/i);
								const extractedHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
								return extractedHobby === initialPlanData.hobby;
							}
							return false;
						}) || [];
						console.log('🔍 Filtered plans for hobby:', supabasePlans?.map((p: any) => ({ id: p.id, title: p.title })));
						
						if (supabasePlans && supabasePlans.length > 0) {
							const mostRecentPlan = supabasePlans[0];
							console.log('🎯 Found plan via auth context:', mostRecentPlan.id, 'for title:', mostRecentPlan.title);
							setCurrentPlanId(mostRecentPlan.id.toString());
							
							// Load progress for this plan using direct API
							const progressResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${user.id}`, {
								headers: {
									'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
									'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
								}
							});
							
							if (progressResponse.ok) {
								const progressData = await progressResponse.json();
								console.log('🔍 Progress query result:', { progressCount: progressData?.length || 0 });
								
								if (progressData && progressData.length > 0) {
									const progress = progressData[0];
									console.log('📖 Loaded progress from database:', progress.completed_days);
									setCompletedDays(progress.completed_days || []);
									setSelectedDay(progress.current_day || 1);
								} else {
									// Check session storage as fallback
									const sessionKey = `progress_${user.id}_${mostRecentPlan.id}`;
									const sessionProgress = sessionStorage.getItem(sessionKey);
									if (sessionProgress) {
										try {
											const progress = JSON.parse(sessionProgress);
											console.log('📖 Loaded progress from session storage fallback:', progress.completed_days);
											setCompletedDays(progress.completed_days || []);
																														setSelectedDay(progress.current_day || 1);
																	} catch (e) {
																		console.error('Failed to parse session progress');
																	}
																}
														}
												}
											} else {
												const errorText = await response.text();
												console.error('🚨 Direct API error:', response.status, response.statusText, errorText);
											}
										} catch (error) {
											console.error('Error finding plan:', error);
										}
								};

			findPlanId();
		} else if (user && initialPlanData) {
			console.log('⚠️ Missing hobby in plan data:', initialPlanData);
			console.log('⚠️ Plan data keys:', Object.keys(initialPlanData));
			console.log('⚠️ Plan data hobby field:', initialPlanData.hobby);
			console.log('⚠️ Plan data title field:', initialPlanData.title);
			
			// Try to extract hobby from title if available
			if (initialPlanData.title && !initialPlanData.hobby) {
				const titleMatch = initialPlanData.title.match(/Learn (\w+) in/i);
				if (titleMatch) {
					const extractedHobby = titleMatch[1].toLowerCase();
					console.log('🔧 Extracted hobby from title:', extractedHobby);
					
					// Create updated plan data with extracted hobby
					const updatedPlanData = {
						...initialPlanData,
						hobby: extractedHobby
					};
					
					console.log('🔧 Retrying plan ID search with extracted hobby...');
					
					const findPlanIdWithExtractedHobby = async () => {
						try {
							// Use the same direct API approach as the dashboard - no hobby column in production
							console.log('🔍 Using direct API to find plans for hobby:', extractedHobby);
							const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&select=id,title,created_at,plan_data&order=created_at.desc`, {
								headers: {
									'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
									'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
								}
							});
							
							if (response.ok) {
								const allPlans = await response.json();
								console.log('🔍 Direct API query result:', { totalPlans: allPlans?.length || 0 });
								console.log('🔍 All user plans:', allPlans?.map(p => ({ id: p.id, title: p.title })));
								
								// Filter for the extracted hobby by parsing titles
								const supabasePlans = allPlans?.filter(p => {
									if (p.title) {
										const titleMatch = p.title.match(/Learn (\w+) in/i);
										const planHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
										return planHobby === extractedHobby;
									}
									return false;
								}) || [];
								console.log('🔍 Filtered plans for extracted hobby:', supabasePlans?.map(p => ({ id: p.id, title: p.title })));
								
								if (supabasePlans && supabasePlans.length > 0) {
									const mostRecentPlan = supabasePlans[0];
									console.log('🎯 Found plan via extracted hobby:', mostRecentPlan.id, 'for title:', mostRecentPlan.title);
									setCurrentPlanId(mostRecentPlan.id.toString());
									
									// Load progress for this plan using direct API
									const progressResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${user.id}`, {
										headers: {
											'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
											'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
										}
									});
									
									if (progressResponse.ok) {
										const progressData = await progressResponse.json();
										console.log('🔍 Progress query result for extracted hobby:', { progressCount: progressData?.length || 0 });
										
										if (progressData && progressData.length > 0) {
											const completed = progressData.map(p => p.day_number);
											console.log('📖 Loaded progress from database via extracted hobby:', completed);
											setCompletedDays(completed);
										}
									}
								} else {
									console.log('🚨 No plans found for extracted hobby:', extractedHobby);
									console.log('🚨 User ID:', user.id, 'Hobby searched:', extractedHobby);
								}
							} else {
								const errorText = await response.text();
								console.error('🚨 Direct API error:', response.status, response.statusText, errorText);
							}
						} catch (error) {
							console.error('Error finding plan with extracted hobby:', error);
						}
					};
					
					findPlanIdWithExtractedHobby();
				}
			}
		}
	}, [user, initialPlanData]);

	// Keep the old logic for backward compatibility
	useEffect(() => {
		if (initialPlanData && !user) {
			const initializeWithAuth = async () => {
				// Check directly with Supabase instead of relying on hook state
				const { data: { session } } = await supabase.auth.getSession();
				console.log('🔍 Fallback session check:', session?.user?.id || 'no session');
				
				if (session?.user) {
					try {
						console.log('🔍 Looking for plan ID for authenticated user:', session.user.id);
						
						// First, try to find existing plan via direct Supabase query to ensure we get the latest data
						const { data: supabasePlans, error: supabaseError } = await supabase
							.from('hobby_plans')
							.select('id, hobby, created_at, title')
							.eq('user_id', session.user.id)
							.eq('hobby', initialPlanData.hobby)
							.order('created_at', { ascending: false })
							.limit(5); // Get more plans to debug
							
						console.log('🔍 Supabase query result:', { supabaseError, planCount: supabasePlans?.length || 0 });
						console.log('🔍 Available plans:', supabasePlans?.map(p => ({ id: p.id, hobby: p.hobby, title: p.title })));
						
						if (!supabaseError && supabasePlans && supabasePlans.length > 0) {
							const mostRecentPlan = supabasePlans[0];
							console.log('🎯 Found plan via Supabase:', mostRecentPlan.id, 'for hobby:', mostRecentPlan.hobby);
							setCurrentPlanId(mostRecentPlan.id.toString());
							
							// Load progress for this plan  
							try {
								const { data: progressData, error: progressError } = await supabase
									.from('user_progress')
									.select('*')
									.eq('plan_id', mostRecentPlan.id)
									.eq('user_id', session.user.id);
								
								console.log('🔍 Progress query result:', { progressError, progressCount: progressData?.length || 0 });
								
								if (!progressError && progressData && progressData.length > 0) {
									const completed = progressData.map(p => p.day_number);
									console.log('📖 Loaded progress from database:', completed);
									setCompletedDays(completed);
								}
							} catch (progressErr) {
								console.error('Error loading progress:', progressErr);
							}
							return;
						} else {
							console.log('🚨 No plans found via Supabase for hobby:', initialPlanData.hobby);
						}
						
						// Fallback to API service
						const { data: userPlans, error } = await apiService.getHobbyPlans(session.user.id);
						
						if (!error && userPlans && userPlans.length > 0) {
							// Find the MOST RECENT plan that matches this hobby
							const matchingPlans = userPlans.filter(plan => 
								plan.hobby === initialPlanData.hobby
							);
							
							if (matchingPlans.length > 0) {
								// Sort by created_at descending and take the most recent
								const mostRecentPlan = matchingPlans.sort((a, b) => 
									new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
								)[0];
								
								console.log('🎯 Found most recent plan ID via API:', mostRecentPlan.id, 'for hobby:', mostRecentPlan.hobby);
								setCurrentPlanId(mostRecentPlan.id.toString());
								
								// Load progress from database for this plan
								console.log('📖 Loading progress for plan ID:', mostRecentPlan.id);
								
								// Try direct REST API call for progress
								try {
									const response = await fetch(
										`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?plan_id=eq.${mostRecentPlan.id}&user_id=eq.${session.user.id}`,
										{
											headers: {
												'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
												'Authorization': `Bearer ${session.access_token}`,
												'Content-Type': 'application/json'
											}
										}
									);
									
									if (response.ok) {
										const progressData = await response.json();
										if (progressData && progressData.length > 0) {
											const progress = progressData[0];
											console.log('✅ FOUND PROGRESS! Loading from database:', progress.completed_days);
											setCompletedDays(progress.completed_days || []);
											setSelectedDay(progress.current_day || 1);
											return; // Exit early, we found the progress
										} else {
											console.log('⚠️ No progress found for plan ID:', mostRecentPlan.id);
										}
									} else {
										console.log('⚠️ Progress API response not OK:', response.status);
									}
								} catch (progressError) {
									console.log('⚠️ Error loading progress from database:', progressError);
								}
							} else {
								console.log('🔄 No matching plans found for hobby:', initialPlanData.hobby);
							}
						} else {
							console.log('🔄 No user plans found');
						}
					} catch (error) {
						console.error('🔄 Error fetching user plans:', error);
					}
				} else {
					console.log('🔄 No authenticated session found - progress will not persist');
				}
			};
			
			const loadLocalStorageProgress = () => {
				console.log('📍 No localStorage progress loading - using database only');
			};
			
			// Start the initialization process
			initializeWithAuth();
		} else if (initialPlanData) {
			// User with existing plan data - check if authenticated to get plan ID
			console.log('🔄 Initializing with existing plan data:', initialPlanData.hobby);
			const fixedGuestPlanData = fixPlanDataFields(initialPlanData);
			console.log('🔧 Applied field mapping fix to initial plan data');
			setPlanData(fixedGuestPlanData);
			
			// Initialize chat conversation for existing plan
			if (messages.length === 0) {
				const welcomeMessage: ChatMessage = {
					id: Date.now().toString(),
					sender: 'ai',
					content: `Welcome back to your ${initialPlanData.hobby} learning plan! 🌟\n\nI'm here to help you with any questions about your 7-day journey. Feel free to ask me about:\n\n• Daily tasks and how to complete them\n• Tips for better practice\n• Troubleshooting common challenges\n• Resources and recommendations\n\nHow can I assist you today?`,
					timestamp: new Date()
				};
				setMessages([welcomeMessage]);
			}
			
			// If user is authenticated, try to get plan ID from database
			if (user?.id) {
				console.log('🔍 User authenticated, searching for existing plan ID...');
				// Find the plan ID from the database based on hobby and user
				setTimeout(async () => {
					try {
						const { data: plans, error } = await supabase
							.from('hobby_plans')
							.select('id')
							.eq('user_id', user.id)
							.eq('hobby', initialPlanData.hobby)
							.order('created_at', { ascending: false })
							.limit(1);
							
						if (!error && plans && plans.length > 0) {
							console.log('✅ Found existing plan ID:', plans[0].id);
							setCurrentPlanId(plans[0].id.toString());
							
							// Also load progress for this plan
							await loadProgressFromDatabase(plans[0].id.toString());
						} else {
							console.log('⚠️ No existing plan found for this hobby');
						}
					} catch (error) {
						console.error('Error finding plan ID:', error);
					}
				}, 100);
			}
			
			console.log('📍 Database-only progress tracking - no localStorage used');
			
			// CRITICAL FIX: Set step to 'plan' when plan exists so chat works properly
			setCurrentStep('plan');
			setIsGenerating(false);
		}
	}, [initialPlanData]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Component mounted
	useEffect(() => {
		// Component initialization logging can be removed in production
	}, []);

	// Enhanced hobby validation and processing
	const validateAndProcessHobby = (input: string): { isValid: boolean; suggestions?: string[]; detectedHobbies?: string[] } => {
		const hobbies = ['painting', 'drawing', 'coding', 'programming', 'guitar', 'music', 'photography', 'cooking', 'baking', 'yoga', 'reading', 'writing', 'journaling', 'gardening', 'crafting'];
		const synonymMap: Record<string, string> = {
			'sketching': 'drawing',
			'art': 'drawing', 
			'dev': 'coding',
			'development': 'coding',
			'software': 'coding',
			'instrument': 'guitar',
			'camera': 'photography',
			'photo': 'photography',
			'chef': 'cooking',
			'recipes': 'cooking',
			'diary': 'journaling',
			'journal': 'journaling',
			'blogging': 'writing',
			'blog': 'writing',
			'creative writing': 'writing',
			'poetry': 'writing',
			'storytelling': 'writing'
		};

		const words = input.toLowerCase().split(/[\s,&]+/).filter(w => w.length > 2);
		const detectedHobbies: string[] = [];
		
		words.forEach(word => {
			if (hobbies.includes(word)) {
				detectedHobbies.push(word);
			} else if (synonymMap[word]) {
				detectedHobbies.push(synonymMap[word]);
			}
		});

		// Check for vague inputs
		const vagueTerms = ['fun', 'interesting', 'creative', 'cool', 'nice', 'good'];
		if (vagueTerms.some(term => input.toLowerCase().includes(term))) {
			return {
				isValid: false,
				suggestions: ['🎨 Arts (painting, drawing)', '🎮 Games', '🏃 Outdoor Activities']
			};
		}

		return {
			isValid: detectedHobbies.length > 0,
			detectedHobbies: Array.from(new Set(detectedHobbies)) // Remove duplicates
		};
	};

	const addUserMessage = (content: string) => {
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			sender: 'user',
			content,
			timestamp: new Date()
		};
		
		setMessages(prev => [...prev, userMessage]);
		return userMessage;
	};

	const addAIMessage = (content: string, options?: { value: string; label: string; description?: string }[], delay = 1000) => {
		setTimeout(() => {
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
			}, delay);
		}, 300);
	};

	const handleSurpriseMe = async () => {
		const randomHobby = surpriseHobbies[Math.floor(Math.random() * surpriseHobbies.length)];
		
		// Add user message
		addUserMessage("Surprise Me! 🎲");
		
		// Add AI response
		addAIMessage(`Perfect! I've chosen ${randomHobby} for you. Creating your 7-day plan now... ✨`, undefined, 800);
		
		setSelectedHobby(randomHobby);
		setQuizAnswers(surpriseAnswers);
		setCurrentStep('generating');
		setIsGenerating(true);

		try {
			const plan = await onGeneratePlan(randomHobby, surpriseAnswers);
			console.log('🎯 Setting plan data in SplitPlanInterface:', plan.hobby);
			console.log('🐛 Raw plan data received in setPlanData:', JSON.stringify(plan, null, 2));
			
			// Fix field mapping for frontend display
			const correctedPlanData = fixPlanDataFields(plan);
			
			console.log('🔧 CORRECTED plan data - first day commonMistakes:', correctedPlanData.days[0].commonMistakes);
			console.log('🔧 CORRECTED plan data - first day youtubeVideoId:', correctedPlanData.days[0].youtubeVideoId);
			
			setPlanData(correctedPlanData);
			
			// Save plan to Supabase if user is authenticated
			if (user?.id) {
				try {
					console.log('Saving surprise plan to Supabase for authenticated user...');
					// Fix field name mapping before saving
					const planDataWithCorrectFields = fixPlanDataFields(plan);
					
					console.log('🔧 FIXED plan data - first day commonMistakes:', planDataWithCorrectFields.days[0].commonMistakes);
					console.log('🔧 FIXED plan data - first day youtubeVideoId:', planDataWithCorrectFields.days[0].youtubeVideoId);

					const savedPlan = await hobbyPlanService.savePlan({
						hobby: randomHobby,
						title: plan.title,
						overview: plan.overview,
						plan_data: planDataWithCorrectFields
					}, user.id);
					
					console.log('✅ Plan saved successfully, setting plan ID:', savedPlan.id);
					setCurrentPlanId(savedPlan.id.toString());
					
					// Initialize progress tracking
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
				console.log('🔥 GENERATING PLAN FOR:', selectedHobby, finalAnswers);
				const plan = await onGeneratePlan(selectedHobby, finalAnswers);
				console.log('🔥 PLAN GENERATED:', plan);
				const fixedStandardPlan = fixPlanDataFields(plan);
				console.log('🔧 Applied field mapping fix to standard plan');
				setPlanData(fixedStandardPlan);
				
				// Save plan to Supabase if user is authenticated
				console.log('🔍 AUTH CHECK: user object:', user);
				console.log('🔍 AUTH CHECK: user?.id:', user?.id);
				console.log('🔍 AUTH CHECK: Boolean(user?.id):', Boolean(user?.id));
				
				if (user?.id) {
					try {
						console.log('🔄 PLAN SAVE: Starting Supabase save for authenticated user...');
						console.log('🔄 PLAN SAVE: User ID:', user.id);
						const savedPlan = await hobbyPlanService.savePlan({
							hobby: selectedHobby,
							title: plan.title,
							overview: plan.overview,
							plan_data: plan
						}, user.id);
						
						console.log('✅ PLAN SAVE SUCCESS: Plan saved with ID:', savedPlan.id);
						console.log('✅ PLAN SAVE SUCCESS: Setting currentPlanId to:', savedPlan.id);
						setCurrentPlanId(savedPlan.id.toString());
						
						// Initialize progress tracking
						await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
						
						// Load any existing progress for this plan
						setTimeout(async () => {
							await loadProgressFromDatabase(savedPlan.id);
						}, 500); // Small delay to ensure progress is initialized
						
						addAIMessage(`Your ${selectedHobby} plan is ready and saved! 🎉 Your progress will be tracked automatically. Need help with anything? Just ask!`);
						
						// CRITICAL FIX: Set step to 'plan' after plan generation for proper chat handling
						setCurrentStep('plan');
					} catch (saveError) {
						console.error('🚨 PLAN SAVE FAILED:', saveError);
						console.error('🚨 PLAN SAVE FAILED Details:', JSON.stringify(saveError, null, 2));
						
						// Provide specific error messages to user
						let errorMessage = `Your ${selectedHobby} plan is ready! 🎉 Note: Progress tracking is temporarily unavailable, but you can still use your plan.`
						
						if (saveError instanceof Error) {
							if (saveError.message.includes('timed out')) {
								errorMessage += ' (Database connection timed out - please run the manual RLS fix)'
							} else if (saveError.message.includes('violates row-level security policy')) {
								errorMessage += ' (Database permissions issue - please run the SUPABASE_MANUAL_FIX.md instructions)'
							} else if (saveError.message.includes('Authentication issue')) {
								errorMessage += ' (Authentication issue - please try signing out and back in)'
							} else if (saveError.message.includes('table not found')) {
								errorMessage += ' (Database setup issue - please contact support)'
							}
						}
						
						addAIMessage(errorMessage + ' Need help with anything? Just ask!');
						
						// CRITICAL FIX: Set step to 'plan' even when save fails for proper chat handling  
						setCurrentStep('plan');
					}
				} else {
					console.log('❌ AUTH CHECK: User not authenticated - cannot save plan');
					console.log('❌ AUTH CHECK: user object:', user);
					addAIMessage(`Your ${selectedHobby} plan is ready! 🎉 Sign up to save your progress and unlock advanced features. Need help with anything? Just ask!`);
					
					// CRITICAL FIX: Set step to 'plan' for non-authenticated users too
					setCurrentStep('plan');
				}
			} catch (error) {
				console.error('Error generating plan:', error);
				addAIMessage("Sorry, I had trouble creating your plan. Let me try again!");
			} finally {
				setIsGenerating(false);
			}
		}
	};

	// ENHANCED: Use DeepSeek API for intelligent chat responses
	const handlePlanQuestions = async (question: string) => {
		console.log('🤖 Processing plan question with DeepSeek API:', question);
		setIsTyping(true);
		
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					question: question,
					planData: planData,
					hobbyContext: planData?.hobby || 'hobby learning'
				})
			});

			if (!response.ok) {
				throw new Error('Chat API request failed');
			}

			const data = await response.json();
			addAIMessage(data.response);
			
		} catch (error) {
			console.error('Error getting AI response:', error);
			// Fallback response
			addAIMessage(`I'm here to help with your ${planData?.hobby || 'hobby'} learning plan! You can ask me about getting started, daily activities, equipment needed, practice tips, or anything else about your 7-day journey. What would you like to know?`);
		}
		
		setIsTyping(false);
	};

	const handleSendMessage = () => {
		if (!currentInput.trim()) return;
		
		const userInput = currentInput.trim();
		addUserMessage(userInput);
		setCurrentInput('');
		
		// CRITICAL FIX: Handle post-plan generation chat
		if (planData && (currentStep === 'generating' || currentStep === 'plan')) {
			console.log('🤖 Handling post-plan question:', userInput);
			handlePlanQuestions(userInput);
			return;
		}
		
		// Handle hobby input if we're in hobby selection step
		if (currentStep === 'hobby') {
			const validation = validateAndProcessHobby(userInput);
			
			if (validation.isValid && validation.detectedHobbies) {
				if (validation.detectedHobbies.length === 1) {
					// Single hobby detected - process directly without duplicate message
					const hobby = validation.detectedHobbies[0];
					setSelectedHobby(hobby);
					setCurrentStep('experience');
					
					const experienceOptions = [
						{ value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
						{ value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
						{ value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
					];
					
					addAIMessage(`Great choice! ${hobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
				} else {
					// Multiple hobbies detected - show selection buttons
					const hobbyOptions = validation.detectedHobbies.map(h => ({
						value: h,
						label: `🎨 Start with ${h.charAt(0).toUpperCase() + h.slice(1)}`,
						description: `Focus on ${h} first`
					}));
					
					addAIMessage(`I found multiple hobbies! Which one would you like to start with?`, hobbyOptions);
				}
			} else {
				// Invalid hobby or suggestions needed
				if (validation.suggestions) {
					const suggestionOptions = validation.suggestions.map(s => ({
						value: s.toLowerCase().replace(/[^\w]/g, ''),
						label: s,
						description: 'Explore this category'
					}));
					
					addAIMessage("I'd love to help you explore new hobbies! Here are some popular options:", suggestionOptions);
				} else {
					// Accept any reasonable hobby input and let backend validate - process directly
					const reasonablePattern = /^[a-zA-Z\s-]{2,30}$/;
					if (reasonablePattern.test(userInput)) {
						const hobby = userInput.toLowerCase();
						setSelectedHobby(hobby);
						setCurrentStep('experience');
						
						const experienceOptions = [
							{ value: 'beginner', label: 'Complete Beginner', description: 'Never tried this before' },
							{ value: 'some', label: 'Some Experience', description: 'Tried it a few times' },
							{ value: 'intermediate', label: 'Intermediate', description: 'Have some solid basics' }
						];
						
						addAIMessage(`Great choice! ${hobby} is really fun to learn.\n\nWhat's your experience level?`, experienceOptions);
					} else {
						addAIMessage("I didn't quite catch that hobby. Could you be more specific? Try something like 'guitar', 'cooking', 'dance', or 'photography'!");
					}
				}
			}
		} else {
			// General chat response for other steps
			setTimeout(() => {
				addAIMessage("Thanks for your message! How can I help you with your learning plan?");
			}, 1000);
		}
	};

	// Function to load progress from database for current plan
	const loadProgressFromDatabase = async (planId: string) => {
		if (!user?.id) return;
		
		try {
			console.log('🔄 Loading progress from database for plan:', planId);
			
			// First check session storage for immediate access
			const sessionKey = `progress_${user.id}_${planId}`;
			const sessionProgress = sessionStorage.getItem(sessionKey);
			if (sessionProgress) {
				try {
					const progress = JSON.parse(sessionProgress);
					console.log('✅ Found session storage progress:', progress.completed_days);
					setCompletedDays(progress.completed_days || []);
					setSelectedDay(progress.current_day || 1);
					return; // Exit early if we have session data
				} catch (e) {
					console.error('Failed to parse session progress');
				}
			}
			
			// Fallback to API
			const { data: progressData, error } = await apiService.getUserProgress(user.id);
			if (!error && progressData) {
				const planProgress = progressData.find((p: any) => p.plan_id === parseInt(planId));
				if (planProgress) {
					console.log('✅ Found database progress:', planProgress);
					setCompletedDays(planProgress.completed_days || []);
					setSelectedDay(planProgress.current_day || 1);
				} else {
					console.log('🔍 No progress found for plan:', planId);
				}
			}
		} catch (error) {
			console.error('❌ Error loading progress from database:', error);
		}
	};

	const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
	const isDayUnlocked = (dayNumber: number) => {
		if (dayNumber === 1) return true;
		// Days 2-7 require authentication
		return user && isDayCompleted(dayNumber - 1);
	};

	const toggleDayCompletion = async (dayNumber: number) => {
		if (isSavingProgress) return;
		
		// CRITICAL FIX: Check for plan ID before attempting database save
		if (!currentPlanId && (!initialPlanData?.id && !initialPlanData?.planId)) {
			console.warn('📝 DATABASE SAVE: No plan ID available - checking storage...');
			
			// Try to get plan ID from storage
			const storedPlanId = sessionStorage.getItem('currentPlanId') || localStorage.getItem('currentPlanId');
			if (storedPlanId) {
				console.log('🎯 Found plan ID in storage:', storedPlanId);
				setCurrentPlanId(storedPlanId);
			} else {
				console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
				console.log('📝 DEBUG:', {
					currentPlanId,
					hasInitialPlanData: !!initialPlanData,
					initialPlanDataId: initialPlanData?.id || initialPlanData?.planId,
					userId: user?.id,
					isAuthenticated: !!user
				});
			}
		}

		try {
			setIsSavingProgress(true);

			if (isDayCompleted(dayNumber)) {
				// Mark as incomplete
				const newCompletedDays = completedDays.filter(d => d !== dayNumber);
				setCompletedDays(newCompletedDays);

				if (user?.id && currentPlanId) {
					// Save to database via API
					console.log('📝 DATABASE SAVE: Marking day INCOMPLETE via API:', dayNumber, 'for plan ID:', currentPlanId);
					try {
						await hobbyPlanService.updateProgress(user.id, currentPlanId, {
							completed_days: newCompletedDays,
							current_day: Math.max(1, Math.min(...newCompletedDays) || 1),
							unlocked_days: [1, ...newCompletedDays.map(d => d + 1)].filter(d => d <= 7)
						});
						console.log('📝 DATABASE SAVE: Successfully saved progress to database');
					} catch (error) {
						console.error('📝 DATABASE SAVE: Failed to save progress to database:', error);
						throw error;
					}
				} else {
					console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
				}
			} else {
				// Mark as complete
				const newCompletedDays = [...completedDays, dayNumber];
				setCompletedDays(newCompletedDays);
				
				if (user?.id && currentPlanId) {
					// Save to database via API
					console.log('📝 DATABASE SAVE: Marking day COMPLETE via API:', dayNumber, 'for plan ID:', currentPlanId);
					try {
						await hobbyPlanService.completeDay(user.id, currentPlanId, dayNumber);
						console.log('📝 DATABASE SAVE: Successfully saved progress to database');
					} catch (error) {
						console.error('📝 DATABASE SAVE: Failed to save progress to database:', error);
						throw error;
					}
				} else {
					console.warn('📝 DATABASE SAVE: User not authenticated or no plan ID - progress not saved');
					console.log('📝 DEBUG:', { hasUser: !!user, userId: user?.id, planId: currentPlanId, hobby: initialPlanData?.hobby });
					addAIMessage("Sign up to save your progress automatically! Your progress isn't saved without an account.", [], 500);
				}

				// Show congratulations message after completing Day 1
				if (dayNumber === 1 && !user) {
					addAIMessage("🎉 Well done! Day 1 completed! Sign up to unlock Days 2-7 and track your progress.", [], 500);
					setShowAuthModal(true);
				} else if (dayNumber === 7) {
					addAIMessage("🎊 Congratulations! You've completed your 7-day learning journey! You're amazing!", [], 500);
				} else if (user) {
					addAIMessage(`Great job! Day ${dayNumber} completed. Keep up the excellent work!`, [], 500);
				}
			}
		} catch (error) {
			console.error('Error updating day completion:', error);
			addAIMessage("Sorry, there was an error saving your progress. Please try again.", [], 500);
		} finally {
			setIsSavingProgress(false);
		}
	};

	// Day selection is now handled by selectedDay state

	const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
		const isCompleted = isDayCompleted(dayNumber);
		
		if (isCompleted) return 'completed';
		if (dayNumber === 1) return 'unlocked';
		if (dayNumber === 2 && !user) return 'unlocked';
		// Days 3-7 show as locked for non-authenticated users
		if (dayNumber > 2 && !user) return 'locked';
		// For authenticated users, follow normal progression
		if (isDayUnlocked(dayNumber)) return 'unlocked';
		return 'locked';
	};

	const progressPercentage = planData ? (completedDays.length / planData.totalDays) * 100 : 0;

	return (
		<div className="min-h-screen bg-slate-50">
			<UnifiedNavigation 
				showBackButton={true} 
				onBackClick={() => {
					// When navigating back from a generated plan, go to dashboard if user is logged in
					if (planData && user) {
						// Store the current plan state for potential return
						sessionStorage.setItem('activePlanData', JSON.stringify(planData));
						sessionStorage.setItem('fromGeneratedPlan', 'true');
						window.location.href = '/#/dashboard';
					} else {
						// Default back behavior for non-authenticated users or no plan
						onNavigateBack();
					}
				}}
				currentPage={planData ? "plan" : "generate"}
			/>

			<div className="flex flex-col min-h-[calc(100vh-64px)]">
				{/* Chat Interface - Always on top */}
				<div className="w-full bg-white border-b-2 border-gray-300 flex flex-col h-64 md:h-80">
					<div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
						<h2 className="text-sm md:text-lg font-semibold text-gray-900">Learning Assistant</h2>
						<p className="text-xs md:text-sm text-gray-600">Ask me anything about your plan</p>
					</div>

					{/* Chat Messages */}
					<div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-6 max-h-[calc(33vh-120px)] lg:max-h-[calc(100vh-200px)]">
						{messages.length === 0 && (
							<div className="text-center text-gray-500 p-4">
								<p>Loading conversation...</p>
							</div>
						)}
						{messages.map((message, index) => (
							<div key={`${message.id}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div className={`max-w-[85%] rounded-2xl px-3 py-3 lg:px-5 lg:py-4 shadow-sm ${
									message.sender === 'user' 
										? 'bg-blue-600 text-white' 
										: 'bg-white text-gray-900 border border-gray-200'
								}`}> 
									<div className="whitespace-pre-wrap text-xs lg:text-sm leading-relaxed font-medium">
										{message.content}
									</div>
									
									{message.options && (
										<div className="mt-4 flex flex-wrap gap-2">
											{message.options.map((option) => (
												<button
													key={option.value}
													onClick={() => handleOptionSelect(option.value, option.label)}
													className="px-3 py-2 text-xs font-medium text-gray-700 bg.white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
								<div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
									</div>
								</div>
							</div>
						)}
						
						<div ref={messagesEndRef} />
					</div>

					{/* Chat Input */}
					<div className="p-3 lg:p-6 border-t border-gray-200 bg-gray-50">
						<div className="flex space-x-2 lg:space-x-3">
							<Input
								ref={inputRef}
								value={currentInput}
								onChange={(e) => setCurrentInput(e.target.value)}
								placeholder="Ask me anything..."
								onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
								className="flex-1 border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
							/>
							<Button onClick={handleSendMessage} size="sm" className="px-3 lg:px-4">
								<Send className="w-3 h-3 lg:w-4 lg:h-4" />
							</Button>
						</div>
					</div>
				</div>

				<div className="p-3 md:p-4 border-b border-gray-200 shrink-0">
					<h2 className="text-sm md:text-lg font-semibold text-gray-900">Learning Assistant</h2>
					<p className="text-xs md:text-sm text-gray-600">Ask me anything about your plan</p>
				</div>

				{/* Chat Messages */}
				<div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
					{messages.length === 0 && (
						<div className="text-center text-gray-500 p-2">
							<p className="text-xs md:text-sm">Chat is ready! Ask me anything.</p>
						</div>
					)}
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
									<div className="mt-1 md:mt-2 flex flex-wrap gap-1">
										{message.options.map((option) => (
											<button
												key={option.value}
												onClick={() => handleOptionSelect(option.value, option.label)}
												className="px-2 py-0.5 md:py-1 text-xs md:text-sm text-gray-700 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-colors"
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

			{/* Plan Display - Takes remaining space */}
			<div className="w-full flex-1 overflow-y-auto bg-gray-50">
				{planData && planData.days ? (
					<div className="p-4 lg:p-6">
						{/* Header */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
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
							</div>

						{/* Progress */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font.medium text-gray-700">Progress</span>
								<span className="text-sm text-gray-600">{completedDays.length}/{planData.totalDays} days completed</span>
							</div>
							<Progress value={progressPercentage} className="h-2" />
						</div>

						{/* Overview */}
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
							{/* Welcome Section */}
							<div className="text-center">
								<div className="text-6xl mb-6">🎯</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Learning Journey!</h2>
								<p className="text-lg text-gray-700 leading-relaxed">
									Tell me what hobby you'd like to learn, and I'll create a personalized 7-day plan just for you. 
									Your custom learning plan will appear here once we chat!
								</p>
							</div>

							{/* Features Grid */}
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

							{/* How to Get Started */}
							<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
								<div className="flex items-center mb-4">
									<span className="text-2xl mr-3">💬</span>
									<h3 className="text-xl font-bold text-gray-900">How to Get Started</h3>
								</div>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-8 h-8 bg-purple-500 text.white rounded-full flex items-center justify.center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">1</span>
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

							{/* Popular Learning Paths */}
							<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
								<h3 className="text-xl font-bold text-gray-900 mb-4">Popular Learning Paths</h3>
								<p className="text-gray-600 mb-4">Not sure what to learn? Here are some popular hobbies our AI has created amazing plans for:</p>
								<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">📸</div>
										<div className="text-xs font-medium text-gray-700">Photography</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🎨</div>
										<div className="text-xs font-medium text-gray-700">Painting</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🍳</div>
										<div className="text-xs font-medium text-gray-700">Cooking</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">💻</div>
										<div className="text-xs font-medium text-gray-700">Coding</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🧶</div>
										<div className="text-xs font-medium text-gray-700">Knitting</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🏡</div>
										<div className="text-xs font-medium text-gray-700">Gardening</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">✍️</div>
										<div className="text-xs font-medium text-gray-700">Writing</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">♟️</div>
										<div className="text-xs font-medium text-gray-700">Chess</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🎸</div>
										<div className="text-xs font-medium text-gray-700">Guitar</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🧘</div>
										<div className="text-xs font-medium text-gray-700">Yoga</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">📚</div>
										<div className="text-xs font-medium text-gray-700">Reading</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl mb-1">🏃</div>
										<div className="text-xs font-medium text-gray-700">Running</div>
									</div>
								</div>
							</div>
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
}
