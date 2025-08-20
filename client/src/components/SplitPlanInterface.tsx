import React, { useEffect, useMemo, useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { PlanDisplay } from './PlanDisplay';
import { UnifiedNavigation } from './UnifiedNavigation';
import { useAuth } from '@/hooks/useAuth';

type QuizAnswers = {
  experience: string;
  timeAvailable: string;
  goal: string;
};

type Props = {
  onGeneratePlan: (hobby: string, answers: QuizAnswers) => Promise<any>;
  onNavigateBack: () => void;
  initialPlanData?: any;
};

function WrapperSplitPlanInterface({ onGeneratePlan, onNavigateBack, initialPlanData }: Props) {
  const { user } = useAuth();
  const [planData, setPlanData] = useState<any | null>(initialPlanData || null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load from session if present
  useEffect(() => {
    if (!planData) {
      try {
        const s = sessionStorage.getItem('currentPlanData');
        if (s) setPlanData(JSON.parse(s));
      } catch {}
    }
  }, []);

  const handlePlanGenerated = (plan: any) => {
    try { sessionStorage.setItem('currentPlanData', JSON.stringify(plan)); } catch {}
    setPlanData(plan);
    // Navigate to plan page so the right panel shows up consistently
    try { window.location.hash = '#/plan'; } catch {}
  };

  if (planData && planData.days && Array.isArray(planData.days)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavigation
          showBackButton={true}
          onBackClick={onNavigateBack}
          currentPage="plan"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PlanDisplay
            planData={planData}
            user={user}
            setShowAuthModal={setShowAuthModal}
          />
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      onGeneratePlan={onGeneratePlan}
      onPlanGenerated={handlePlanGenerated}
      onNavigateBack={onNavigateBack}
    />
  );
}

const SplitPlanInterface = WrapperSplitPlanInterface;
export { SplitPlanInterface };
export default SplitPlanInterface;

