import React, { useState } from 'react';
import { UnifiedNavigation } from './components/UnifiedNavigation';
import { ChatInterface } from './components/ChatInterface';
import { PlanDisplay } from './components/PlanDisplay';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

type QuizAnswers = {
  experience: string;
  timeAvailable: string;
  goal: string;
};

export default function App() {
  const [planData, setPlanData] = useState<any | null>(null);

  const handleGeneratePlan = async (hobby: string, answers: QuizAnswers) => {
    const resp = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby, ...answers })
    });
    if (!resp.ok) throw new Error('Failed to generate plan');
    const data = await resp.json();
    sessionStorage.setItem('currentPlanData', JSON.stringify(data));
    return data;
  };

  const handlePlanGenerated = (plan: any) => {
    setPlanData(plan);
  };

  const handleNavigateBack = () => {
    setPlanData(null);
    sessionStorage.removeItem('currentPlanData');
  };

  const currentPlan = planData || (() => {
    const s = sessionStorage.getItem('currentPlanData');
    return s ? JSON.parse(s) : null;
  })();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavigation showBackButton={!!currentPlan} onBackClick={handleNavigateBack} currentPage={currentPlan ? 'plan' : 'generate'} />
        <div className="max-w-6xl mx-auto p-4">
          {!currentPlan ? (
            <ChatInterface onGeneratePlan={handleGeneratePlan} onPlanGenerated={handlePlanGenerated} onNavigateBack={handleNavigateBack} />
          ) : (
            <PlanDisplay planData={currentPlan} user={null} setShowAuthModal={() => {}} />
          )}
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

