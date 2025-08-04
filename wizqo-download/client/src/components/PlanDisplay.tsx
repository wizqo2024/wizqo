import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { SimpleAuthModal } from './SimpleAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, User } from 'lucide-react';

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
}

interface PlanData {
  hobby: string;
  title: string;
  overview: string;
  difficulty: string;
  totalDays: number;
  days: Day[];
}

interface PlanDisplayProps {
  planData: PlanData;
  onNavigateBack: () => void;
}

export function PlanDisplay({ planData, onNavigateBack }: PlanDisplayProps) {
  console.log('🚨 PLANDISPLAY COMPONENT IS RENDERING 🚨');
  console.log('Plan data received:', planData?.hobby);
  
  // Set plan data when component renders
  React.useEffect(() => {
    if (planData) {
      console.log('🔍 Plan data loaded:', planData.hobby);
    }
  }, [planData]);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  
  const [userProgress, setUserProgress] = useState<any>(null);
  
  // Debug: Check if planData is actually available
  console.log('🔍 PlanDisplay state check:', { 
    hasPlanData: !!planData, 
    planTitle: planData?.title,
    planHobby: planData?.hobby 
  });

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => dayNumber === 1 || isDayCompleted(dayNumber - 1);

  // Load user progress and save plan when component mounts
  useEffect(() => {
    const initializePlan = async () => {
      // Generate a unique plan ID for this plan
      const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCurrentPlanId(planId);
      
      // Store plan ID for navigation
      console.log('🔍 Setting current plan ID for navigation:', planId, planData?.hobby);
      
      if (isAuthenticated && user && planData) {
        console.log('User authenticated, saving surprise plan to Supabase...');
        
        try {
          console.log('Saving plan to Supabase for user:', user.id);
          
          // Save the plan to database
          const savedPlan = await hobbyPlanService.savePlan({
            hobby: planData.hobby,
            title: planData.title,
            overview: planData.overview || '',
            plan_data: planData
          }, user.id);

          console.log('Plan saved successfully:', savedPlan);
          setCurrentPlanId(savedPlan?.id?.toString());

          // Initialize progress tracking
          const progressData = await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
          console.log('Progress initialized:', progressData);
          setUserProgress(progressData);

        } catch (error: any) {
          console.error('Error saving surprise plan to Supabase:', error);
          // Don't show error to user for plan saving, they can still use it
        }
      }
    };

    if (planData) {
      console.log('🔧 Running initializePlan for:', planData.hobby);
      initializePlan();
    } else {
      console.log('❌ No planData available for initialization');
    }
  }, [isAuthenticated, user, planData]);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;

    try {
      setIsSavingProgress(true);
      console.log('Toggling day completion for day:', dayNumber);

      if (isDayCompleted(dayNumber)) {
        // Mark as incomplete
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);
        console.log('Marking day as incomplete, new completed days:', newCompletedDays);

        // Save to database via API if authenticated
        if (isAuthenticated && user && currentPlanId) {
          try {
            console.log('Saving progress to database (incomplete)...');
            await hobbyPlanService.updateProgress(user.id, currentPlanId.toString(), {
              completed_days: newCompletedDays,
              current_day: Math.max(1, Math.min(...newCompletedDays) || 1),
              unlocked_days: [1, ...newCompletedDays.map(d => d + 1)].filter(d => d <= 7)
            });
            console.log('Progress saved to database successfully');
          } catch (error) {
            console.error('Database save error:', error);
            toast({
              title: "Error",
              description: "Failed to save progress. Please try again.",
              variant: "destructive"
            });
          }
        } else {
          console.log('Guest user - progress not saved to database');
        }
      } else {
        // Mark as complete
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);
        console.log('Marking day as complete, new completed days:', newCompletedDays);

        // Save to database via API if authenticated
        if (isAuthenticated && user && currentPlanId) {
          try {
            console.log('Saving progress to database (complete)...');
            await hobbyPlanService.completeDay(user.id, currentPlanId.toString(), dayNumber);
            
            console.log('Progress saved to database successfully');
            toast({
              title: "Progress Saved!",
              description: `Day ${dayNumber} completed and synced to your account.`,
            });
          } catch (error) {
            console.error('Database save error:', error);
            toast({
              title: "Error",
              description: "Failed to save progress. Please try again.",
              variant: "destructive"
            });
          }
        } else {
          console.log('Guest user - progress not saved to database');
          toast({
            title: "Day Completed!",
            description: `Day ${dayNumber} completed. Sign up to save your progress.`,
          });
        }
        
        // Show auth modal after completing Day 1 for non-authenticated users
        if (dayNumber === 1 && !isAuthenticated) {
          setShowAuthModal(true);
        }
      }
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProgress(false);
    }
  };

  const toggleDayExpansion = (dayNumber: number) => {
    if (isDayUnlocked(dayNumber)) {
      setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
    }
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'unlocked' | 'locked' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (isDayUnlocked(dayNumber)) return 'unlocked';
    return 'locked';
  };

  const progressPercentage = (completedDays.length / planData.totalDays) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Unified Navigation */}
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={onNavigateBack}
        currentPage="plan"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Learn {planData.hobby} in 7 Days
            </h1>
            
            <button 
              onClick={() => setShowAuthModal(true)}
              style={{
                backgroundColor: '#ff0000',
                color: '#ffffff',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '3px solid #000000',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              TEST MODAL NOW
            </button>

            <p className="text-slate-600">
              AI-powered learning plan customized for your beginner level. Each day builds upon the previous, taking you from complete beginner to confident practitioner with hands-on exercises and expert guidance.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">Progress</span>
            <span>{completedDays.length} of 7 Days • {Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Overview Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Master {planData.hobby} in 7 days with this personalized plan designed for your beginner level. Each day builds upon the previous, taking you from complete beginner to confident practitioner with hands-on exercises and expert guidance.
            </p>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto bg-white hover:bg-slate-50"
            >
              📋 View All 7 Days Summary
            </Button>
          </CardContent>
        </Card>

        {/* Daily Plan Cards */}
        <div className="space-y-4">
          {planData.days.map((day) => {
            const status = getDayStatus(day.day);
            const isExpanded = expandedDay === day.day;
            
            return (
              <Card key={day.day} className="overflow-hidden">
                <CardHeader 
                  className={`cursor-pointer transition-colors ${
                    status === 'completed' ? 'bg-green-50 border-b border-green-200' :
                    status === 'unlocked' ? 'bg-blue-50 border-b border-blue-200' :
                    'bg-slate-100 border-b border-slate-200'
                  }`}
                  onClick={() => toggleDayExpansion(day.day)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'unlocked' ? 'bg-blue-500' :
                        'bg-slate-400'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : status === 'unlocked' ? (
                          <Circle className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Day {day.day}: {day.title}
                        </CardTitle>
                        <p className="text-sm text-slate-600 flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          30-45 minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status === 'unlocked' && (
                        <span className="text-sm font-medium text-blue-600">Current</span>
                      )}
                      {isDayUnlocked(day.day) ? (
                        isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
                      ) : (
                        <span className="text-sm text-slate-500">Locked</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-6">
                    {/* Main Task */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-2">Main Task</h4>
                      <p className="text-slate-700">{day.mainTask}</p>
                    </div>

                    {/* Why This Matters */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-purple-500">💡</span>
                        <h4 className="font-semibold text-slate-900">Why This Matters</h4>
                      </div>
                      <p className="text-slate-700">{day.explanation}</p>
                    </div>

                    {/* Tips and Mistakes */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Tips for Success */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-green-500">✅</span>
                          <h4 className="font-semibold text-slate-900">Tips for Success</h4>
                        </div>
                        <ul className="space-y-2">
                          {day.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Avoid These Mistakes */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-red-500">⚠️</span>
                          <h4 className="font-semibold text-slate-900">Avoid These Mistakes</h4>
                        </div>
                        <ul className="space-y-2">
                          {day.mistakesToAvoid.map((mistake, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{mistake}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Today's Checklist */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-blue-500">📋</span>
                        <h4 className="font-semibold text-slate-900">Today's Checklist</h4>
                      </div>
                      <ul className="space-y-2">
                        {day.checklist.map((item, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-purple-500 rounded"
                            />
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {/* Free Resource */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-blue-500">🆓</span>
                          <h4 className="font-semibold text-slate-900">Free Resource</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {day.freeResources[0]?.title || 'Pottery Day 1 Tutorial'}
                        </p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={day.freeResources[0]?.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <span>Watch Tutorial</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>

                      {/* Recommended Tool */}
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-orange-500">🛒</span>
                          <h4 className="font-semibold text-slate-900">Recommended Tool</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {day.affiliateProducts[0]?.title || 'Pottery Beginner Set'}
                        </p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={day.affiliateProducts[0]?.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <span>View on Amazon</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Complete Day Button */}
                    {status === 'unlocked' && !isDayCompleted(day.day) && (
                      <div className="text-center">
                        <Button 
                          onClick={() => toggleDayCompletion(day.day)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                        >
                          ✅ Mark Day {day.day} as Complete
                        </Button>
                      </div>
                    )}

                    {status === 'completed' && (
                      <div className="text-center bg-green-50 rounded-lg py-4">
                        <div className="flex items-center justify-center space-x-2 text-green-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Day {day.day} Complete! 🎉</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Authentication prompt for progress tracking */}
        {!isAuthenticated && completedDays.includes(1) && !localStorage.getItem('skipAuthPrompt') && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Save Your Progress</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Great job completing Day 1! Sign up now to save your progress, track completed days, and continue your learning journey across all devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1 sm:flex-none"
              >
                Save My Progress
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                setShowAuthModal(false);
                // Hide the auth prompt permanently for this session
                localStorage.setItem('skipAuthPrompt', 'true');
              }}
                className="text-gray-600 border-gray-300"
              >
                Continue Without Saving
              </Button>
            </div>
          </div>
        )}

        <SimpleAuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}