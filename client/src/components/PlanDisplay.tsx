import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, Circle, Lock, Clock, Package, ExternalLink, Zap } from 'lucide-react';

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
  youtubeVideoId?: string;
  videoId?: string;
  videoTitle?: string;
  estimatedTime?: string;
  skillLevel?: string;
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
  const completedDays = propCompletedDays || localCompletedDays;
  const setCompletedDays = propSetCompletedDays || setLocalCompletedDays;
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const isDayCompleted = (dayNumber: number) => completedDays.includes(dayNumber);
  const getDayStatus = (dayNumber: number): 'locked' | 'unlocked' | 'completed' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (!user) return dayNumber === 1 ? 'unlocked' : 'locked';
    return 'unlocked';
  };

  const toggleDayCompletion = (dayNumber: number) => {
    if (!user) {
      if (dayNumber === 1) setShowAuthModal(true);
      return;
    }
    if (isDayCompleted(dayNumber)) {
      setCompletedDays(completedDays.filter(d => d !== dayNumber));
    } else {
      setCompletedDays([...completedDays, dayNumber]);
    }
  };

  const selectedDayData = planData.days.find(d => d.day === selectedDay) || planData.days[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{planData.title}</h2>
        <p className="text-gray-600 mt-1">{planData.overview}</p>
      </div>

      {/* Day selector */}
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

      {/* Selected day card */}
      <Card className="bg-white border border-gray-200 shadow-sm">
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
                <h3 className="text-xl font-semibold text-gray-900">{selectedDayData.title}</h3>
                <p className="text-sm text-gray-600">{selectedDayData.mainTask}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{selectedDayData.estimatedTime || '30-60 minutes'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Why this matters */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
            <p className="text-blue-800 leading-relaxed text-base">{selectedDayData.explanation}</p>
          </div>

          {/* Pro Tips for Success */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-900">💡 Pro Tips for Success</h4>
                <p className="text-sm text-green-700">Expert insights to accelerate your learning</p>
              </div>
            </div>
            <ul className="space-y-2">
              {selectedDayData.tips?.map((tip, index) => (
                <li key={index} className="text-sm text-gray-800">• {tip}</li>
              ))}
            </ul>
          </div>

          {/* Today's Action Items */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-900">✅ Today's Action Items</h4>
                <p className="text-sm text-blue-700">Check off each item as you complete it</p>
              </div>
            </div>
            <ul className="space-y-2">
              {selectedDayData.checklist?.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
                  <span className="text-sm text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Resources - below Tips and Action Items */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-900">🛒 Recommended Resources</h4>
                <p className="text-sm text-orange-700">Tools and materials to enhance your learning experience</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Free resources */}
              {selectedDayData.freeResources && selectedDayData.freeResources.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h5 className="text-sm font-medium text-orange-700 mb-3">📚 Free Learning Resources</h5>
                  <div className="space-y-2">
                    {selectedDayData.freeResources.map((r, idx) => (
                      <a key={idx} href={r.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span>{r.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Affiliate products */}
              {selectedDayData.affiliateProducts && selectedDayData.affiliateProducts.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h5 className="text-sm font-medium text-orange-700 mb-3">🛍️ Recommended Products</h5>
                  <div className="space-y-3">
                    {selectedDayData.affiliateProducts.map((p, idx) => (
                      <a key={idx} href={p.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 text-sm">{p.title}</h6>
                            <p className="text-xs text-gray-500 mt-1">Amazon</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-orange-600">{p.price}</span>
                            <div className="text-xs text-gray-400 mt-1">View on Amazon</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complete button */}
          {getDayStatus(selectedDayData.day) === 'unlocked' && !isDayCompleted(selectedDayData.day) && (
            <div className="text-center">
              <Button onClick={() => toggleDayCompletion(selectedDayData.day)} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
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
        </CardContent>
      </Card>
    </div>
  );
}