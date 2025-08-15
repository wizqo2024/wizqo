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

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();
	usePlanStorage();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		if (user && showAuthModal) setShowAuthModal(false);
	}, [user, showAuthModal]);

	const handleSendMessage = () => {
		if (!currentInput.trim()) return;
		const newMessage: ChatMessage = {
			id: Date.now().toString(),
			sender: 'user',
			content: currentInput.trim(),
			timestamp: new Date()
		};
		setMessages(prev => [...prev, newMessage]);
		setCurrentInput('');
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

			<div className="flex flex-col min-h-[calc(100vh-64px)]">
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
								}`}> 
									<div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
										{message.content}
									</div>
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
