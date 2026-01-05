import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { HalloweenPack, WinterKindness, SpringScavenger, SummerPack } from '../HolidayWorksheets';
import { WordSearch } from '@/pages/worksheets/WordSearch'; // Absolute import
import { OnePagerWorksheet } from '../OnePagerWorksheet';
import { RewardChart, GratitudeJar, MoodTracker, WeeklyGoals, Mandalas, FeelingsCheckin } from '../SocialEmotionalWorksheets';
import { BrainBoost, CreativeChallenge } from '../LogicWorksheets';
import { AnimalPack } from '../KindergartenExtraWorksheets';

import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper } from '../PrintableShared'; // Needed for ScienceMatch

// Props interface
interface HolidayRendererProps {
    activeDocs: string[];
    seed: string;
    variant: string;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: any;
    getTrans: any;
}

export const HolidayRenderer: React.FC<HolidayRendererProps> = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans }) => {
    return (
        <>
            {activeDocs.includes('science-match') && (() => {
                const rng = makeRng(`${effectiveSeed}|v${variant}|doc=science-match`);
                const pairs = [
                    { question: "Mars is known as the red planet.", answer: "A dusty red world" },
                    { question: "Whales are the largest mammals.", answer: "A huge ocean animal" },
                    { question: "Lightning is a giant spark of electricity.", answer: "Shocking sky energy" },
                    { question: "Penguins live in the Southern Hemisphere.", answer: "A cold-loving bird" },
                    { question: "Clouds are made of tiny water droplets.", answer: "Weather water in the sky" },
                    { question: "Earth orbits the Sun once a year.", answer: "Our home planet's trip" },
                ];

                // Shuffle questions (Left side)
                const shuffledQuestions = [...pairs].sort(() => rng() - 0.5);

                // Shuffle answers (Right side)
                const shuffledAnswers = [...pairs].sort(() => rng() - 0.5);

                return (
                    <WorksheetSectionWrapper
                        docId="science-match"
                        title="Science Fun Facts Match"
                        emoji={String.fromCodePoint(0x1F9EA)}
                        description="Draw a line to match each fact with its pair."
                        problemCount={6}
                        learningObjectives={[
                            'Learn science facts',
                            'Match related concepts',
                            'Understand scientific relationships'
                        ]}
                        parentTeacherTips={[
                            'Read each fact carefully',
                            'Look for key words that connect facts',
                            'Help students understand the relationships',
                            'Extension: Research more about these science topics'
                        ]}
                    >
                        <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />

                        <div className="grid grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                            <ol className="list-decimal list-inside space-y-4 text-sm">
                                {shuffledQuestions.map((q, i) => (
                                    <li key={i} className="p-2 border border-blue-100 rounded bg-blue-50/50">{q.question}</li>
                                ))}
                            </ol>
                            <ul className="list-none space-y-4 text-sm">
                                {shuffledAnswers.map((a, i) => (
                                    <li key={i} className="p-2 border border-slate-200 rounded flex gap-2">
                                        <span className="font-bold text-blue-600">{String.fromCharCode(65 + i)})</span>
                                        <span>{a.answer}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {showAnswersForDoc('science-match', () => (
                            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                                <div className="font-semibold mb-1">Answer key</div>
                                <div className="grid grid-cols-1 gap-1">
                                    {shuffledQuestions.map((q, i) => {
                                        const answerIndex = shuffledAnswers.findIndex(a => a.answer === q.answer);
                                        const letter = String.fromCharCode(65 + answerIndex);
                                        return <div key={i}>{i + 1}. {letter} ({q.answer})</div>
                                    })}
                                </div>
                            </div>
                        ))}
                    </WorksheetSectionWrapper>
                );
            })()}

            {/* Holiday Packs */}
            {activeDocs.includes('halloween-pack') && <HalloweenPack docId="halloween-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('winter-kindness') && <WinterKindness docId="winter-kindness" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('spring-scavenger') && <SpringScavenger docId="spring-scavenger" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('summer-pack') && <SummerPack docId="summer-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* SEL / Social Emotional */}
            {activeDocs.includes('reward-chart') && <RewardChart docId="reward-chart" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('gratitude-jar') && <GratitudeJar docId="gratitude-jar" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mood-tracker') && <MoodTracker docId="mood-tracker" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('weekly-goals') && <WeeklyGoals docId="weekly-goals" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('mandalas') && <Mandalas docId="mandalas" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('feelings-checkin') && <FeelingsCheckin docId="feelings-checkin" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* One Pagers / STEM / Arts */}
            {activeDocs.includes('stem-balloon-rocket') && <OnePagerWorksheet docId="stem-balloon-rocket" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('stem-walking-water') && <OnePagerWorksheet docId="stem-walking-water" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('arts-3-shape-creature') && <OnePagerWorksheet docId="arts-3-shape-creature" effectiveSeed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Packs */}
            {activeDocs.includes('animal-pack') && <AnimalPack docId="animal-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Logic / Brain */}
            {activeDocs.includes('brain-boost') && <BrainBoost docId="brain-boost" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}
            {activeDocs.includes('creative-challenge') && <CreativeChallenge docId="creative-challenge" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />}

            {/* Word Search - Handles all variants */}
            {activeDocs.some(d => ['word-search', 'ws-animals', 'ws-space', 'ws-sight-words', 'ws-world'].includes(d)) && (
                <WordSearch
                    activeDocs={activeDocs}
                    showAnswers={true}
                    effectiveSeed={effectiveSeed}
                    variant={String(variant)}
                    packTime="free"
                    packAge="k2"
                    packSkill="brain"
                    showAnswersForDoc={showAnswersForDoc}
                />
            )}
        </>
    );
};
