import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Play, Star, Lightbulb, Target, Trophy, X, AlertTriangle, Ban, Clock, Package, BookOpen, Zap, Award, ArrowRight } from 'lucide-react';

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
}

export function PlanDisplay({ planData, user, setShowAuthModal }: PlanDisplayProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const target = dayRefs.current[selectedDay];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDay]);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (completedDays.includes(dayNumber)) {
      setCompletedDays(completedDays.filter(d => d !== dayNumber));
    } else {
      setCompletedDays([...completedDays, dayNumber]);
      toast({
        title: "Day Completed!",
        description: `Great job completing Day ${dayNumber}!`,
      });
      // If user not logged in and day 1 is now completed, prompt auth
      if (!user && dayNumber === 1) {
        setShowAuthModal(true);
      }
    }
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);

  const getDayStatus = (dayNumber: number): 'locked' | 'unlocked' | 'completed' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    // If not logged in, only Day 1 is accessible
    if (!user) {
      return dayNumber === 1 ? 'unlocked' : 'locked';
    }
    // Logged-in users can access all days
    return 'unlocked';
  };

  // Define different icons for tips and mistakes
  const getTipIcon = (index: number) => {
    const icons = [Star, Lightbulb, Target, CheckCircle, Trophy];
    return icons[index % icons.length];
  };

  const getMistakeIcon = (index: number) => {
    const icons = [X, AlertTriangle, Ban];
    return icons[index % icons.length];
  };

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
      <div className="min-h-[600px]">
        {planData.days.map((day) => {
          const status = getDayStatus(day.day);
          const isSelected = selectedDay === day.day;

          if (!isSelected) return null;

          return (
            <div key={day.day} ref={(el) => (dayRefs.current[day.day] = el)}>
              <Card className="bg-white border border-gray-200 shadow-sm">
                {/* Day Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        status === 'completed' ? 'bg-green-500' : 
                        status === 'unlocked' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                         status === 'locked' ? <Lock className="w-5 h-5" /> : day.day}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{day.title}</h2>
                        <p className="text-sm text-gray-600">{day.mainTask}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => toggleDayCompletion(day.day)}
                      disabled={status === 'locked'}
                      className="flex items-center space-x-2"
                    >
                      {isDayCompleted(day.day) ? (
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

                {/* Day Content - Horizontal Layout */}
                <CardContent className="space-y-6 max-w-none">
                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Overview & Steps */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Time Allocation & Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-blue-900">Today's Focus</h3>
                              <p className="text-sm text-blue-700">{day.timeAllocation || day.estimatedTime || '30-45 minutes'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-blue-700">Day {day.day}</span>
                            <p className="text-xs text-blue-600">{day.skillLevel || 'Beginner'}</p>
                          </div>
                        </div>
                        <div className="prose prose-blue max-w-none">
                          <p className="text-blue-800 leading-relaxed text-base">{day.explanation}</p>
                        </div>
                      </div>

                      {/* Equipment & Materials */}
                      {(day.equipment || day.materials) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">What You'll Need</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {day.equipment && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-700 mb-2">🎯 Equipment</h4>
                                <ul className="space-y-2">
                                  {day.equipment.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {day.materials && (
                              <div>
                                <h4 className="text-sm font-medium text-indigo-700 mb-2">📋 Materials</h4>
                                <ul className="space-y-2">
                                  {day.materials.map((item, index) => (
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
                        
                        {day.detailedSteps && day.detailedSteps.length > 0 ? (
                          <div className="space-y-6">
                            {day.detailedSteps.map((step, index) => (
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
                                {index < (day.detailedSteps?.length || 0) - 1 && (
                                  <div className="ml-4 mt-3 mb-3">
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ol className="space-y-4">
                            {day.howTo.map((step, index) => (
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
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">

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
                      {day.tips.map((tip, index) => {
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

                  {/* Avoid These Mistakes */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-900">⚠️ Common Pitfalls to Avoid</h3>
                        <p className="text-sm text-red-700">Learn from others' mistakes to save time</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {day.mistakesToAvoid.map((mistake, index) => {
                        const IconComponent = getMistakeIcon(index);
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 border border-red-200 hover:border-red-300 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 leading-relaxed font-medium">{mistake}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Video Tutorial */}
                  {day.youtubeVideoId && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Video Tutorial</h3>
                          <p className="text-sm text-gray-500">{day.videoTitle}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${day.youtubeVideoId}?rel=0&showinfo=0&modestbranding=1`}
                            title={`${planData.hobby} Day ${day.day}: ${day.title}`}
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Milestones */}
                  {day.progressMilestones && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-900">🎯 Progress Milestones</h3>
                      </div>
                      <div className="space-y-3">
                        {day.progressMilestones.map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-yellow-200">
                            <div className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-gray-800 font-medium">{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                      {day.checklist.map((item, index) => (
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

                  {/* Complete Button */}
                  {status === 'unlocked' && !isDayCompleted(day.day) && (
                    <div className="text-center">
                      <Button 
                        onClick={() => toggleDayCompletion(day.day)}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
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
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}