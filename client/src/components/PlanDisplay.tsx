import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { SimpleAuthModal } from './SimpleAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, User, Target, Lightbulb, AlertTriangle, Star, Play, Users, Gift, Zap, Heart, TrendingUp, X, AlertCircle, Ban, Trophy, Gem, Crown, StopCircle, XCircle, Slash, Shield } from 'lucide-react';

interface Day {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  howTo: string[];
  checklist: string[];
  tips: string[];
  mistakesToAvoid: string[];
  youtubeVideoId?: string;
  videoId?: string;
  videoTitle?: string;
  estimatedTime?: string;
  skillLevel?: string;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => dayNumber === 1 || isDayCompleted(dayNumber - 1);

  // Initialize plan on mount
  useEffect(() => {
    const initializePlan = async () => {
      const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCurrentPlanId(planId);
      
      if (user && planData) {
        try {
          const savedPlan = await hobbyPlanService.savePlan({
            hobby: planData.hobby,
            title: planData.title,
            overview: planData.overview || '',
            plan_data: planData
          }, user.id);

          setCurrentPlanId(savedPlan?.id?.toString());
          await hobbyPlanService.initializeProgress(user.id, savedPlan.id);
        } catch (error) {
          console.error('Error saving plan:', error);
        }
      }
    };

    if (planData) {
      initializePlan();
    }
  }, [user, planData]);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;

    try {
      setIsSavingProgress(true);

      if (isDayCompleted(dayNumber)) {
        // Mark as incomplete
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);
      } else {
        // Mark as complete
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);

        if (user && currentPlanId) {
          await hobbyPlanService.completeDay(user.id, currentPlanId.toString(), dayNumber);
          toast({
            title: "Progress Saved!",
            description: `Day ${dayNumber} completed and synced to your account.`,
          });
        } else {
          toast({
            title: "Day Completed!",
            description: `Day ${dayNumber} completed. Sign up to save your progress.`,
          });
        }
        
        if (dayNumber === 1 && !user) {
          setShowAuthModal(true);
        }
      }
    } catch (error) {
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
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    {/* Main Task Card */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">Main Task</h4>
                            <p className="text-blue-800 text-sm leading-relaxed">{day.mainTask}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Why This Matters Card */}
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-purple-900 mb-2">Why This Matters</h4>
                            <p className="text-purple-800 text-sm leading-relaxed">{day.explanation}</p>
                            <div className="mt-3 text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                              Day {day.day} focuses on building your foundation in {planData.hobby}, ensuring you develop proper techniques and understanding.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clean Success Tips Section */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Success Tips</h3>
                        </div>
                        <div className="space-y-3">
                          {day.tips.map((tip, index) => {
                            const tipIcons = [Star, Lightbulb, Target, CheckCircle, Trophy];
                            const IconComponent = tipIcons[index % tipIcons.length];
                            console.log(`TIP ${index}: Using ${IconComponent.name} icon`);
                            return (
                              <div key={`tip-${index}-${IconComponent.name}`} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <IconComponent className="w-3 h-3 text-green-600" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clean Mistakes Section */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Avoid These Mistakes</h3>
                        </div>
                        <div className="space-y-3">
                          {day.mistakesToAvoid.map((mistake, index) => {
                            const mistakeIcons = [X, AlertTriangle, Ban, StopCircle, XCircle];
                            const IconComponent = mistakeIcons[index % mistakeIcons.length];
                            console.log(`MISTAKE ${index}: Using ${IconComponent.name} icon`);
                            return (
                              <div key={`mistake-${index}-${IconComponent.name}`} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <IconComponent className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{mistake}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clean Video Tutorial Section */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Video Tutorial</h3>
                            <p className="text-sm text-gray-500">{day.videoTitle || 'Watch and learn the fundamentals'}</p>
                          </div>
                        </div>
                        
                        {day.youtubeVideoId ? (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
                              <iframe
                                src={`https://www.youtube.com/embed/${day.youtubeVideoId}?rel=0&showinfo=0&modestbranding=1&controls=1&autoplay=0`}
                                title={`Learn ${planData.hobby} - Day ${day.day}: ${day.title}`}
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                                loading="lazy"
                              ></iframe>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-gray-600 mb-4">Video tutorial unavailable</p>
                            <Button 
                              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(planData.hobby + ' beginner tutorial')}`, '_blank')}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Search YouTube
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>



                    {/* Clean Checklist Section */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Today's Checklist</h3>
                        </div>
                        <div className="space-y-3">
                          {day.checklist.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <Circle className="w-3 h-3 text-purple-600" />
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clean Resources Section */}
                    {day.affiliateProducts && day.affiliateProducts.length > 0 && (
                      <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Recommended Tool</h3>
                          </div>
                          <div className="space-y-3">
                            {day.affiliateProducts.map((product, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <ExternalLink className="w-3 h-3 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <a 
                                    href={product.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-900 hover:text-orange-600 underline"
                                  >
                                    {product.title}
                                  </a>
                                  <p className="text-xs text-gray-600 mt-1">{product.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Clean Complete Button */}
                    {status === 'unlocked' && !isDayCompleted(day.day) && (
                      <div className="text-center">
                        <Button 
                          onClick={() => toggleDayCompletion(day.day)}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg"
                        >
                          Mark Day {day.day} Complete
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
        {!user && completedDays.includes(1) && !localStorage.getItem('skipAuthPrompt') && (
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
                  localStorage.setItem('skipAuthPrompt', 'true');
                }}
                className="text-gray-600 border-gray-300"
              >
                Continue Without Saving
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <SimpleAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}// Force refresh
