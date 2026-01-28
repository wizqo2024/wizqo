import React from 'react';
import {
    GratitudeJar,
    MoodTracker,
    WeeklyGoals,
    Mandalas,
    FeelingsCheckin,
    RewardChart
} from '../SocialEmotionalWorksheets';

interface SocialEmotionalRendererProps {
    activeDocs: string[];
    seed: string;
    variant: number;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
}

export const SocialEmotionalRenderer: React.FC<SocialEmotionalRendererProps> = ({
    activeDocs,
    seed,
    variant,
    showAnswersForDoc
}) => {
    return (
        <>
            {activeDocs.includes('gratitude-jar') && (
                <GratitudeJar docId="gratitude-jar" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('mood-tracker') && (
                <MoodTracker docId="mood-tracker" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('weekly-goals') && (
                <WeeklyGoals docId="weekly-goals" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('mandalas') && (
                <Mandalas docId="mandalas" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('feelings-checkin') && (
                <FeelingsCheckin docId="feelings-checkin" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('reward-chart') && (
                <RewardChart docId="reward-chart" seed={seed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
        </>
    );
};
