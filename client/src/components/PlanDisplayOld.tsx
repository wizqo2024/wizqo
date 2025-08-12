
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedNavigation } from './UnifiedNavigation';
import { SimpleAuthModal } from './SimpleAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { hobbyPlanService } from '@/services/hobbyPlanService';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Lock, ExternalLink, Share, BookOpen, Clock, User, Target, Lightbulb, AlertTriangle, Star, Play, Users, Gift } from 'lucide-react';

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
  const { user, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const isDayUnlocked = (dayNumber: number) => dayNumber === 1 || isDayCompleted(dayNumber - 1);

  const toggleDayCompletion = async (dayNumber: number) => {
    if (isSavingProgress) return;

    try {
      setIsSavingProgress(true);

      if (isDayCompleted(dayNumber)) {
        const newCompletedDays = completedDays.filter(d => d !== dayNumber);
        setCompletedDays(newCompletedDays);
      } else {
        const newCompletedDays = [...completedDays, dayNumber];
        setCompletedDays(newCompletedDays);

        if (dayNumber === 1 && !isSignedIn) {
          setShowAuthModal(true);
        }
      }
    } catch (error) {
      console.error('Error updating day completion:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
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

  const progressPercentage = planData.totalDays > 0 ? (completedDays.length / planData.totalDays) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <UnifiedNavigation 
        showBackButton={true} 
        onBackClick={onNavigateBack}
        currentPage="plan"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Learn {planData.hobby} in 7 Days
            </h1>
            <p className="text-slate-600">
              AI-powered learning plan customized for your beginner level.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">Progress</span>
            <span>{completedDays.length} of 7 Days • {Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              {planData.overview}
            </p>
          </CardContent>
        </Card>

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
                          {day.title.startsWith('Day ') ? day.title : `Day ${day.day}: ${day.title}`}
                        </CardTitle>
                        <p className="text-sm text-slate-600 flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          30-45 minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <SimpleAuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}
