import React from "react";

export interface QuizAnswers {
  experience: string;
  timeCommitment: string;
  specificGoal: string;
  hobby: string;
}

export interface PlanData {
  [key: string]: any;
}

interface SplitPlanInterfaceProps {
  onGeneratePlan: (hobby: string, answers: QuizAnswers, userId?: string, force?: boolean) => Promise<PlanData>;
  onNavigateBack: () => void;
  initialPlanData?: any;
}

export function SplitPlanInterface({
  onGeneratePlan,
  onNavigateBack,
  initialPlanData,
}: SplitPlanInterfaceProps) {
  return (
    <div>
      <h1>Split Plan Interface</h1>
      {/* You can use the props here */}
    </div>
  );
}
