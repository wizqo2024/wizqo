import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Circle, Lock, Play, Star, Lightbulb, Target, Trophy, X, AlertTriangle, Ban, Clock, Package, BookOpen, Zap, Award, ArrowRight, ExternalLink } from 'lucide-react';

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
  timeAllocation?: string;
  equipment?: string[];
  materials?: string[];
  detailedSteps?: { step: string; time: string; description: string }[];
  progressMilestones?: string[];
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
  user?: any;
  setShowAuthModal: (show: boolean) => void;
  completedDays?: number[];
  setCompletedDays?: (days: number[]) => void;
}

export function PlanDisplay({ planData, user, setShowAuthModal, completedDays: propCompletedDays, setCompletedDays: propSetCompletedDays }: PlanDisplayProps) {
  const [localCompletedDays, setLocalCompletedDays] = useState<number[]>([]);
  
  // Use props if provided, otherwise use local state
  const completedDays = propCompletedDays || localCompletedDays;
  const setCompletedDays = propSetCompletedDays || setLocalCompletedDays;
  
  // Debug: Log plan data structure
  console.log('🔍 PlanDisplay: Received planData:', planData);
  console.log('🔍 PlanDisplay: planData.days:', planData?.days);
  console.log('🔍 PlanDisplay: planData keys:', planData ? Object.keys(planData) : 'planData is null/undefined');
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  // Load plan ID and progress when component mounts
  useEffect(() => {
    const loadPlanData = async () => {
      if (user?.id && planData) {
        try {
          // Get the plan ID from the database
          const userPlans = await hobbyPlanService.getUserPlans(user.id);
          const matchingPlan = userPlans.find(plan => 
            plan.hobby?.toLowerCase() === planData.hobby?.toLowerCase() ||
            plan.title?.toLowerCase().includes(planData.hobby?.toLowerCase())
          );
          
          if (matchingPlan) {
            setCurrentPlanId(matchingPlan.id);
            
            // Load progress for this plan
            const progress = await hobbyPlanService.getPlanProgress(user.id, matchingPlan.id);
            if (progress) {
              setCompletedDays(progress.completed_days || []);
            }
          }
        } catch (error) {
          console.error('Error loading plan data:', error);
        }
      }
    };
    
    loadPlanData();
  }, [user?.id, planData]);

  useEffect(() => {
    const target = dayRefs.current[selectedDay];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDay]);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (!user) {
      if (dayNumber === 1) {
        setShowAuthModal(true);
      }
      return;
    }

    if (completedDays.includes(dayNumber)) {
      // Mark day as incomplete
      const newCompletedDays = completedDays.filter(d => d !== dayNumber);
      setCompletedDays(newCompletedDays);
      
      // Save progress to database
      if (currentPlanId) {
        try {
          await hobbyPlanService.updateProgress(user.id, currentPlanId, {
            completed_days: newCompletedDays,
            current_day: Math.max(1, Math.min(...newCompletedDays) || 1)
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    } else {
      // Mark day as complete
      const newCompletedDays = [...completedDays, dayNumber];
      setCompletedDays(newCompletedDays);
      
      toast({
        title: "Day Completed!",
        description: `Great job completing Day ${dayNumber}!`,
      });
      
      // Save progress to database
      if (currentPlanId) {
        try {
          await hobbyPlanService.completeDay(user.id, currentPlanId, dayNumber);
        } catch (error) {
          console.error('Error completing day:', error);
        }
      }
    }
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);

  const getDayStatus = (dayNumber: number): 'locked' | 'unlocked' | 'completed' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (!user) {
      return dayNumber === 1 ? 'unlocked' : 'locked';
    }
    return 'unlocked';
  };

  const getTipIcon = (index: number) => {
    const icons = [Star, Lightbulb, Target, CheckCircle, Trophy];
    return icons[index % icons.length];
  };

  const getMistakeIcon = (index: number) => {
    const icons = [X, AlertTriangle, Ban];
    return icons[index % icons.length];
  };

  const selectedDayData = planData.days.find(day => day.day === selectedDay);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{planData.title}</h1>
        <p className="text-gray-600">{planData.overview}</p>
      </div>

      {/* Day Selector */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 py-2 -mx-4 px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {Array.from({ length: planData.totalDays }, (_, i) => i + 1).map((n) => {
            const status = getDayStatus(n);
            const isSelected = selectedDay === n;
            return (
              <button
                key={n}
                onClick={() => status !== 'locked' && setSelectedDay(n)}
                disabled={status === 'locked'}
                className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center border transition ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : status === 'locked'
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Display */}
      {selectedDayData && (
        <div className="min-h-[600px]" ref={(el) => (dayRefs.current[selectedDay] = el)}>
          <Card className="bg-white border border-gray-200 shadow-sm">
            {/* Day Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    getDayStatus(selectedDayData.day) === 'completed' ? 'bg-green-500' : 
                    getDayStatus(selectedDayData.day) === 'unlocked' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {getDayStatus(selectedDayData.day) === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                     getDayStatus(selectedDayData.day) === 'locked' ? <Lock className="w-5 h-5" /> : selectedDayData.day}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedDayData.title}</h2>
                    <p className="text-sm text-gray-600">{selectedDayData.mainTask}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => toggleDayCompletion(selectedDayData.day)}
                  disabled={getDayStatus(selectedDayData.day) === 'locked'}
                  className="flex items-center space-x-2"
                >
                  {isDayCompleted(selectedDayData.day) ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Mark Complete</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            {/* Day Content */}
            <CardContent className="space-y-6 max-w-none">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Time Allocation & Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Today's Focus</h3>
                        <p className="text-sm text-blue-700">{selectedDayData.timeAllocation || selectedDayData.estimatedTime || '30-45 minutes'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-blue-700">Day {selectedDayData.day}</span>
                      <p className="text-xs text-blue-600">{selectedDayData.skillLevel || 'Beginner'}</p>
                    </div>
                  </div>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-blue-800 leading-relaxed text-base">{selectedDayData.explanation}</p>
                  </div>
                </div>

                {/* Equipment & Materials */}
                {(selectedDayData.equipment || selectedDayData.materials) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">What You'll Need</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedDayData.equipment && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-700 mb-2">🎯 Equipment</h4>
                          <ul className="space-y-2">
                            {selectedDayData.equipment?.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedDayData.materials && (
                        <div>
                          <h4 className="text-sm font-medium text-indigo-700 mb-2">📋 Materials</h4>
                          <ul className="space-y-2">
                            {selectedDayData.materials?.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Detailed Steps */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Instructions</h3>
                  </div>
                  
                  {selectedDayData.detailedSteps && selectedDayData.detailedSteps.length > 0 ? (
                    <div className="space-y-6">
                      {selectedDayData.detailedSteps?.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{step.step}</h4>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{step.time}</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                          {index < (selectedDayData.detailedSteps?.length || 0) - 1 && (
                            <div className="ml-4 mt-3 mb-3">
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ol className="space-y-4">
                      {selectedDayData.howTo?.map((step, index) => (
                        <li key={index} className="flex items-start space-x-4">
                          <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed">{step}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* 7-Day Plan Overview */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">📅 Your 7-Day Learning Journey</h3>
                      <p className="text-sm text-purple-700">Complete overview of your learning plan</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-3">
                    {planData.days?.map((day, index) => {
                      const dayStatus = getDayStatus(day.day);
                      const isCurrentDay = day.day === selectedDay;
                      return (
                        <div 
                          key={day.day}
                          onClick={() => setSelectedDay(day.day)}
                          className={`relative cursor-pointer rounded-lg p-3 border transition-all ${
                            isCurrentDay 
                              ? 'bg-purple-100 border-purple-300 shadow-md' 
                              : dayStatus === 'locked'
                              ? 'bg-gray-50 border-gray-200 opacity-50'
                              : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                              dayStatus === 'completed' 
                                ? 'bg-green-500 text-white' 
                                : dayStatus === 'locked'
                                ? 'bg-gray-300 text-gray-500'
                                : isCurrentDay
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {dayStatus === 'completed' ? <CheckCircle className="w-4 h-4" /> : day.day}
                            </div>
                            <h4 className={`text-xs font-semibold mb-1 ${
                              isCurrentDay ? 'text-purple-900' : 'text-gray-700'
                            }`}>
                              Day {day.day}
                            </h4>
                            <p className={`text-xs line-clamp-2 ${
                              isCurrentDay ? 'text-purple-700' : 'text-gray-500'
                            }`}>
                              {day.title}
                            </p>
                          </div>
                          {isCurrentDay && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Video Tutorial Section */}
                {selectedDayData.youtubeVideoId && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-900">🎥 Video Tutorial</h3>
                        <p className="text-sm text-red-700">Watch and learn with our step-by-step video guide</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedDayData.youtubeVideoId}?rel=0&showinfo=0&modestbranding=1`}
                          title={`${planData.hobby} Day ${selectedDayData.day}: ${selectedDayData.title}`}
                          frameBorder="0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                      {selectedDayData.videoTitle && (
                        <div className="mt-4 text-center">
                          <h4 className="font-semibold text-gray-900">{selectedDayData.videoTitle}</h4>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resources Section */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-900">🛒 Recommended Resources</h3>
                      <p className="text-sm text-orange-700">Tools and materials to enhance your learning experience</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Free Resources */}
                    {selectedDayData.freeResources && selectedDayData.freeResources.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-medium text-orange-700 mb-3">📚 Free Learning Resources</h4>
                        <div className="space-y-2">
                          {selectedDayData.freeResources?.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>{resource.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Affiliate Products */}
                    {selectedDayData.affiliateProducts && selectedDayData.affiliateProducts.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-medium text-orange-700 mb-3">🛍️ Recommended Products</h4>
                        <div className="space-y-3">
                          {selectedDayData.affiliateProducts?.map((product, index) => (
                            <a
                              key={index}
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{product.title}</h5>
                                  <p className="text-xs text-gray-500 mt-1">Amazon</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold text-orange-600">{product.price}</span>
                                  <div className="text-xs text-gray-400 mt-1">View on Amazon</div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Placeholder for when no resources are available */}
                    {(!selectedDayData.freeResources || selectedDayData.freeResources.length === 0) && 
                     (!selectedDayData.affiliateProducts || selectedDayData.affiliateProducts.length === 0) && (
                      <div className="col-span-2 bg-white rounded-lg p-6 border border-orange-200 text-center">
                        <div className="text-orange-400 mb-2">
                          <Package className="w-8 h-8 mx-auto" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Resources Coming Soon</h4>
                        <p className="text-sm text-gray-500">We're curating the best tools and materials for this hobby. Check back soon!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips and Checklist Section */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Success Tips */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">💡 Pro Tips for Success</h3>
                        <p className="text-sm text-green-700">Expert insights to accelerate your learning</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {selectedDayData.tips?.map((tip, index) => {
                        const IconComponent = getTipIcon(index);
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 leading-relaxed font-medium">{tip}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">✅ Today's Action Items</h3>
                        <p className="text-sm text-blue-700">Check off each item as you complete it</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedDayData.checklist?.map((item, index) => (
                        <label key={index} className="flex items-start space-x-3 cursor-pointer group hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-blue-500 rounded mt-0.5 focus:ring-blue-500 focus:ring-2" 
                          />
                          <span className="text-gray-800 leading-relaxed group-hover:text-blue-900 transition-colors font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Complete Button */}
                {getDayStatus(selectedDayData.day) === 'unlocked' && !isDayCompleted(selectedDayData.day) && (
                  <div className="text-center">
                    <Button 
                      onClick={() => toggleDayCompletion(selectedDayData.day)}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                    >
                      Mark Day {selectedDayData.day} Complete
                    </Button>
                  </div>
                )}

                {getDayStatus(selectedDayData.day) === 'completed' && (
                  <div className="text-center bg-green-50 rounded-lg py-4">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Day {selectedDayData.day} Complete! 🎉</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}