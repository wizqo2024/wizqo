// Utility function to fix plan data field mapping
// Extracted from SplitPlanInterface.tsx for better organization

import type { PlanData, Day } from '@/types/plan';

export function fixPlanDataFields(plan: any): PlanData | null {
  if (!plan) return null;
  
  const existingDaysArray = plan.days || plan.plan_data?.days || plan.plan_data?.plan_data?.days || [];
  const totalDays = plan.totalDays || 7;
  
  // Only include days that actually exist in the plan data
  const daysArray = existingDaysArray || [];
  
  const fixedPlan: PlanData = {
    ...plan,
    difficulty: plan.difficulty || plan.plan_data?.difficulty || 'beginner',
    overview: plan.overview || plan.plan_data?.overview || plan.description || `Learn ${plan.hobby} with this comprehensive plan`,
    totalDays: plan.totalDays || 7,
    days: daysArray.map((day: any): Day => ({
      ...day,
      commonMistakes: (day.commonMistakes && day.commonMistakes.length > 0)
        ? day.commonMistakes
        : (day.mistakesToAvoid && day.mistakesToAvoid.length > 0)
          ? day.mistakesToAvoid
          : [
              'Rushing through exercises without understanding concepts',
              'Skipping practice time or cutting sessions short',
              'Not taking notes or tracking your improvement'
            ],
      youtubeVideoId: day.youtubeVideoId || (day.freeResources?.[0]?.link?.match(/v=([^&]+)/)?.[1]) || null,
      videoTitle: day.videoTitle || `${plan.hobby || 'Tutorial'} - Day ${day.day}`
    }))
  };
  
  return fixedPlan;
}
