import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';
import { SpecificWorksheetProps } from '../../types/printable';

// Helper for translations with fallback
function useWorksheetTranslation(docId: string) {
    const { t } = useTranslation();

    const getTrans = (key: string, fallback: string) => {
        const fullKey = key.includes('.') ? key : `worksheets.${docId}.${key}`;
        const translated = t(fullKey);
        return translated && translated !== fullKey && !translated.startsWith('worksheets.') ? translated : fallback;
    };

    return { t, getTrans };
}

export function HalloweenPack({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'halloween-pack';
    const { getTrans } = useWorksheetTranslation(docId);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Spooky Fun Halloween Pack')}
            emoji="🎃"
            description={getTrans('description', 'A collection of math and puzzle activities with a spooky theme!')}
            problemCount={4}
            learningObjectives={[
                'Solve themed math problems',
                'Practice critical thinking with puzzles',
                'Enjoy holiday-themed learning'
            ]}
        >
            <PremiumWorksheetBanner
                title="Spooky Specialists"
                subtitle="Halloween Math & fun"
                icons={{ bg1: "🎃", bg2: "👻", float1: "🕸️", float2: "🦇" }}
                colors={{
                    bg: "bg-gradient-to-br from-orange-100 to-purple-100",
                    border: "border-orange-300",
                    pillBg: "bg-white/90",
                    pillBorder: "border-orange-400",
                    pillText: "text-orange-900",
                    accent: "text-purple-600"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Activity 1: Pumpkin Math */}
                <div className="bg-white p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                    <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎃</span> Pumpkin Patch Addition
                    </h3>
                    <div className="space-y-3">
                        {['5 + 3 = ___', '10 - 4 = ___', '6 + 6 = ___'].map((prob, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-100 font-mono text-lg">
                                <span>{prob}</span>
                                <div className="w-8 h-8 rounded-full border border-orange-200 bg-white"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity 2: Ghost Maze */}
                <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-sm relative overflow-hidden">
                    <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">👻</span> Ghostly Maze
                    </h3>
                    <div className="aspect-[4/3] bg-slate-50 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-purple-300 italic">
                        [Maze Graphic Placeholder]
                    </div>
                </div>

                {/* Activity 3: Witch's Word Search */}
                <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🧙‍♀️</span> Witch's Word Search
                    </h3>
                    <div className="grid grid-cols-6 gap-1 font-mono text-sm leading-none text-center bg-green-50 p-2 rounded">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="w-6 h-6 flex items-center justify-center text-slate-500">
                                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs text-slate-600 font-bold flex gap-2 flex-wrap">
                        <span>CAT</span> <span>BAT</span> <span>HAT</span> <span>MOON</span>
                    </div>
                </div>
                {/* Activity 4: Candy Count */}
                <div className="bg-white p-6 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🍬</span> Candy Corn Count
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Array.from({ length: 12 }).map((_, i) => <span key={i} className="text-xl">🌽</span>)}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                        How many corn? <div className="w-12 h-8 border-b-2 border-slate-400"></div>
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

export function WinterKindness({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'winter-kindness';
    const { getTrans } = useWorksheetTranslation(docId);

    const acts = [
        "Help make dinner", "Write a thank you card", "Donate an old toy",
        "Say 'Hi' to a neighbor", "Share a treat", "Clean up without asking",
        "Hug a family member", "Read to someone", "Make a bird feeder"
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Winter Kindness Challenge')}
            emoji="❄️"
            description={getTrans('description', 'Warm up the winter with these acts of kindness!')}
            problemCount={9}
            learningObjectives={[
                'Practice social-emotional skills',
                'Build community and empathy',
                'Celebrate the season with giving'
            ]}
        >
            <PremiumWorksheetBanner
                title="Kindness Kingdom"
                subtitle="Winter Wonder Acts"
                icons={{ bg1: "❄️", bg2: "☃️", float1: "🧤", float2: "☕" }}
                colors={{
                    bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
                    border: "border-sky-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-sky-300",
                    pillText: "text-sky-900",
                    accent: "text-sky-400"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {acts.map((act, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border-2 border-sky-100 shadow-sm flex flex-col items-center text-center gap-4 hover:border-sky-300 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-2xl">
                            ❄️
                        </div>
                        <p className="font-bold text-slate-700">{act}</p>
                        <div className="w-6 h-6 rounded border-2 border-slate-300 mt-auto"></div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-sky-50 p-6 rounded-xl border border-sky-200 text-center">
                <h3 className="font-bold text-sky-800 mb-2">My Own Kindness Idea:</h3>
                <div className="w-full border-b-2 border-sky-200 border-dashed h-8"></div>
            </div>
        </WorksheetSectionWrapper>
    );
}
