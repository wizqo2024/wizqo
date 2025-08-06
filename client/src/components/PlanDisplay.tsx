import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Play, Star, Lightbulb, Target, Trophy, X, AlertTriangle, Ban } from 'lucide-react';

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
  user?: any;
  setShowAuthModal: (show: boolean) => void;
}

export default function PlanDisplay({ planData, user, setShowAuthModal }: PlanDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const { toast } = useToast();

  const toggleDayExpansion = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };

  const toggleDayCompletion = async (dayNumber: number) => {
    if (completedDays.includes(dayNumber)) {
      setCompletedDays(completedDays.filter(d => d !== dayNumber));
    } else {
      setCompletedDays([...completedDays, dayNumber]);
      toast({
        title: "Day Completed!",
        description: `Great job completing Day ${dayNumber}!`,
      });
    }
  };

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);

  const getDayStatus = (dayNumber: number): 'locked' | 'unlocked' | 'completed' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (dayNumber === 1 || isDayCompleted(dayNumber - 1)) return 'unlocked';
    return 'locked';
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

      {/* Days */}
      <div className="space-y-4">
        {planData.days.map((day) => {
          const status = getDayStatus(day.day);
          const isExpanded = expandedDays.has(day.day);

          return (
            <Card key={day.day} className="bg-white border border-gray-200 shadow-sm">
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
                    onClick={() => toggleDayExpansion(day.day)}
                    disabled={status === 'locked'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </Button>
                </div>
              </CardHeader>

              {/* Day Content */}
              {isExpanded && (
                <CardContent className="space-y-6">
                  {/* Explanation */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{day.explanation}</p>
                  </div>

                  {/* How To Steps */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Complete This Day</h3>
                    <ol className="space-y-2">
                      {day.howTo.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Success Tips */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Success Tips</h3>
                    </div>
                    <div className="space-y-3">
                      {day.tips.map((tip, index) => {
                        const IconComponent = getTipIcon(index);
                        console.log(`TIP ${index}: Using ${IconComponent.name} icon`);
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <IconComponent className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-gray-700 text-sm">{tip}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Avoid These Mistakes */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Avoid These Mistakes</h3>
                    </div>
                    <div className="space-y-3">
                      {day.mistakesToAvoid.map((mistake, index) => {
                        const IconComponent = getMistakeIcon(index);
                        console.log(`MISTAKE ${index}: Using ${IconComponent.name} icon`);
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <IconComponent className="w-3 h-3 text-red-600" />
                            </div>
                            <p className="text-gray-700 text-sm">{mistake}</p>
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

                  {/* Checklist */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Checklist</h3>
                    <div className="space-y-2">
                      {day.checklist.map((item, index) => (
                        <label key={index} className="flex items-start space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-blue-500 rounded mt-0.5" />
                          <span className="text-gray-700 text-sm">{item}</span>
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
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}