import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { SimpleAuthModal } from './SimpleAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, User, Target, Lightbulb, AlertTriangle, Star, Play, Users, Gift, Zap, Heart, TrendingUp, X, AlertCircle, Ban } from 'lucide-react';

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

                    {/* Tips and Mistakes Grid */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      {/* Tips for Success */}
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="font-semibold text-green-900">Tips for Success</h4>
                          </div>
                          <ul className="space-y-2">
                            {day.tips.map((tip, tipIndex) => {
                              const tipIcons = [Star, Zap, Heart, TrendingUp, Target, CheckCircle];
                              const IconComponent = tipIcons[(day.day * 3 + tipIndex * 2) % tipIcons.length];
                              return (
                                <li key={tipIndex} className="flex items-start space-x-3 text-sm text-green-800">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <IconComponent className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="leading-relaxed">{tip}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Avoid These Mistakes */}
                      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="font-semibold text-red-900">Avoid These Mistakes</h4>
                          </div>
                          <ul className="space-y-2">
                            {day.mistakesToAvoid.map((mistake, mistakeIndex) => {
                              const mistakeIcons = [X, Ban, AlertCircle, AlertTriangle, Circle, Lock];
                              const IconComponent = mistakeIcons[(day.day * 2 + mistakeIndex * 3 + 1) % mistakeIcons.length];
                              return (
                                <li key={mistakeIndex} className="flex items-start space-x-3 text-sm text-red-800">
                                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <IconComponent className="w-3 h-3 text-red-600" />
                                  </div>
                                  <span className="leading-relaxed">{mistake}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Professional YouTube Video Tutorial Card */}
                    <Card className="overflow-hidden border border-gray-200 bg-white shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl mb-1">Day {day.day} Tutorial</h3>
                              <p className="text-red-100 text-sm font-medium">Expert-curated {planData.hobby} learning content</p>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-300" />
                            <span className="text-white font-medium text-sm">Verified Content</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        {/* YouTube Video Embed */}
                        {day.youtubeVideoId ? (
                          <div className="relative bg-black group">
                            <div className="aspect-video relative overflow-hidden">
                              <iframe
                                src={`https://www.youtube.com/embed/${day.youtubeVideoId}?rel=0&showinfo=0&modestbranding=1&controls=1&autoplay=0`}
                                title={`Learn ${planData.hobby} - Day ${day.day}: ${day.title}`}
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full rounded-none"
                                loading="lazy"
                              ></iframe>
                            </div>
                            
                            {/* Video overlay info */}
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              HD Quality
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                              <Play className="w-10 h-10 text-white ml-1" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Video Tutorial Ready</h4>
                            <p className="text-gray-600 mb-6 text-sm max-w-md mx-auto leading-relaxed">
                              Watch our carefully selected professional tutorial to master Day {day.day} concepts step by step
                            </p>
                            <Button 
                              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(planData.hobby + ' beginner tutorial day ' + day.day)}`, '_blank')}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <ExternalLink className="w-5 h-5 mr-2" />
                              Watch on YouTube
                            </Button>
                          </div>
                        )}
                        
                        {/* Enhanced Video Info Footer */}
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Optimal Duration</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Beginner Friendly</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-semibold text-gray-700">Professional Quality</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Learning Resources */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="font-semibold text-slate-900">Day {day.day}: {day.title} - Step by Step Tutorial</h4>
                        </div>
                        <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                          This tutorial opens in an optimized learning environment designed to minimize distractions and maximize focus. Our platform provides the best possible learning experience with enhanced video quality and interactive features.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <div className="flex items-center space-x-1 text-slate-600">
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                            <span>HD Quality</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Step by Step</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <CheckCircle className="w-3 h-3 text-purple-500" />
                            <span>Beginner Friendly</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <CheckCircle className="w-3 h-3 text-yellow-500" />
                            <span>Interactive</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Today's Checklist Card */}
                    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-l-indigo-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="font-semibold text-indigo-900">Today's Checklist</h4>
                        </div>
                        <p className="text-indigo-800 text-sm mb-4">Basic {planData.hobby} materials and tools</p>
                        <div className="space-y-3">
                          {day.checklist.map((item, index) => (
                            <label key={index} className="flex items-start space-x-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-indigo-500 rounded border-2 border-indigo-300 focus:ring-indigo-500 focus:ring-2 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-sm text-indigo-800 leading-relaxed group-hover:text-indigo-900 transition-colors">
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Free Resources and Recommended Tools */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      {/* Free Resource */}
                      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-l-teal-500">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                              <Gift className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="font-semibold text-teal-900">Free Resource</h4>
                          </div>
                          {day.freeResources.map((resource, index) => (
                            <div key={index} className="mb-3 last:mb-0">
                              <div className="flex items-start space-x-2">
                                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <a 
                                    href={resource.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-teal-800 hover:text-teal-900 underline"
                                  >
                                    {resource.title}
                                  </a>
                                  <p className="text-xs text-teal-700 mt-1">
                                    High-quality free resource to supplement your learning
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Recommended Tool */}
                      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="font-semibold text-orange-900">Recommended Tool</h4>
                          </div>
                          {day.affiliateProducts.map((product, index) => (
                            <div key={index} className="mb-3 last:mb-0">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2 flex-1">
                                  <ExternalLink className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <a 
                                      href={product.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-orange-800 hover:text-orange-900 underline block"
                                    >
                                      {product.title}
                                    </a>
                                    <p className="text-xs text-orange-700 mt-1">
                                      Professional-grade tool recommended for best results
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-3 flex-shrink-0">
                                  <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2 py-1 rounded-full">
                                    {product.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
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
}