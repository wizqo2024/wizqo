import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, X, CheckCircle, Lightbulb } from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';

interface Day {
  day: number;
  title: string;
  mainTask: string;
  explanation: string;
  tips: string[];
  mistakesToAvoid: string[];
  checklist: string[];
  youtubeVideoId?: string;
  videoId?: string;
  videoTitle?: string;
  affiliateProducts?: Array<{
    title: string;
    link: string;
    price: string;
  }>;
}

interface PlanData {
  hobby: string;
  title: string;
  overview: string;
  days: Day[];
}

interface CleanPlanDisplayProps {
  planData: PlanData;
  currentDay: number;
  completedDays: number[];
  onDayComplete: (day: number) => void;
}

export const CleanPlanDisplay: React.FC<CleanPlanDisplayProps> = ({
  planData,
  currentDay,
  completedDays,
  onDayComplete
}) => {
  const isDayCompleted = (day: number) => completedDays.includes(day);
  
  const currentDayData = planData.days.find(d => d.day === currentDay);
  if (!currentDayData) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{planData.title}</h1>
        <p className="text-gray-600">Day {currentDay}: {currentDayData.title}</p>
      </div>

      {/* Main Task */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Today's Main Task</h2>
          <p className="text-gray-700 leading-relaxed">{currentDayData.mainTask}</p>
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Video Tutorial</h3>
          </div>
          
          {currentDayData.youtubeVideoId || currentDayData.videoId ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <YouTubeEmbed 
                videoId={currentDayData.youtubeVideoId || currentDayData.videoId!} 
                title={currentDayData.videoTitle || 'Video Tutorial'}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No video available for this lesson</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Success Tips</h3>
          </div>
          <div className="space-y-3">
            {currentDayData.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Lightbulb className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mistakes to Avoid */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Avoid These Mistakes</h3>
          </div>
          <div className="space-y-3">
            {currentDayData.mistakesToAvoid.map((mistake, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <X className="w-3 h-3 text-red-600" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{mistake}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Checklist</h3>
          </div>
          <div className="space-y-3">
            {currentDayData.checklist.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3 h-3 text-purple-600" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      {!isDayCompleted(currentDay) && (
        <div className="text-center">
          <Button 
            onClick={() => onDayComplete(currentDay)}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg"
          >
            Mark Day {currentDay} Complete
          </Button>
        </div>
      )}

      {isDayCompleted(currentDay) && (
        <div className="text-center bg-green-50 rounded-lg py-4">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Day {currentDay} Complete!</span>
          </div>
        </div>
      )}
    </div>
  );
};