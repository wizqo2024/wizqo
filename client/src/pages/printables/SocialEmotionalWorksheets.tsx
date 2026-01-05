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

export function GratitudeJar({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'gratitude-jar';
    const { getTrans } = useWorksheetTranslation(docId);

    // No RNG needed for static template, but keeping pattern
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'My Gratitude Jar')}
            emoji="🏺"
            description={getTrans('description', 'Fill your jar with things you are thankful for!')}
            problemCount={1}
            learningObjectives={[
                'Practice gratitude reflecting',
                'Identify positive aspects of life',
                'Express feelings through writing/drawing'
            ]}
        >
            <PremiumWorksheetBanner
                title="Gratitude Garden"
                subtitle="Collecting Moments of Joy"
                icons={{ bg1: "🌻", bg2: "🦋", float1: "💖", float2: "✨" }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
                    border: "border-pink-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-900",
                    accent: "text-pink-400"
                }}
            />

            <div className="flex justify-center mt-8">
                <div className="relative w-full max-w-lg aspect-[3/4] border-4 border-slate-800 rounded-[50px] bg-white shadow-xl overflow-hidden">
                    {/* Jar Lid */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-slate-200 border-b-4 border-slate-800 flex items-center justify-center">
                        <div className="w-3/4 h-2 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Jar Label */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-pink-100 border-2 border-pink-300 px-8 py-4 rounded-xl shadow-inner transform -rotate-2">
                        <h3 className="font-handwriting text-2xl text-pink-800 font-bold">My Gratitude Jar</h3>
                    </div>

                    {/* Lines for writing */}
                    <div className="absolute top-48 left-8 right-8 bottom-8 flex flex-col gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex gap-4 items-end">
                                <span className="text-2xl">✨</span>
                                <div className="flex-1 border-b-2 border-slate-300 border-dashed relative">
                                    <div className="absolute -bottom-1 left-0 w-full h-px bg-slate-100"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute top-20 right-8 w-8 h-32 bg-white/40 rounded-full blur-xl transform rotate-12"></div>
                </div>
            </div>

            <div className="mt-8 text-center text-slate-500 italic">
                Tip: Color the jar and draw decorations around the things you love!
            </div>
        </WorksheetSectionWrapper>
    );
}

export function MoodTracker({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mood-tracker';
    const { getTrans } = useWorksheetTranslation(docId);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Monthly Mood Tracker')}
            emoji="🎭"
            description={getTrans('description', 'Track your feelings every day to see patterns.')}
            problemCount={31}
            learningObjectives={[
                'Identify and label emotions',
                'Track emotional patterns over time',
                'Practice self-reflection'
            ]}
        >
            <PremiumWorksheetBanner
                title="Emotion Explorer"
                subtitle="Mapping My Feelings"
                icons={{ bg1: "🎭", bg2: "🌈", float1: "🌙", float2: "☀️" }}
                colors={{
                    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
                    border: "border-violet-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-violet-300",
                    pillText: "text-violet-900",
                    accent: "text-violet-400"
                }}
            />

            <div className="flex flex-col md:flex-row gap-8 mt-8">
                {/* Key Legend */}
                <div className="w-full md:w-1/3 bg-white p-6 rounded-xl border-2 border-slate-200 h-fit">
                    <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">Color Key</h3>
                    <div className="space-y-4">
                        {[
                            { color: "bg-yellow-300", label: "Happy / Excited" },
                            { color: "bg-green-300", label: "Calm / Relaxed" },
                            { color: "bg-blue-300", label: "Sad / Tired" },
                            { color: "bg-red-300", label: "Angry / Frustrated" },
                            { color: "bg-purple-300", label: "Worried / Anxious" }
                        ].map((mood, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full border border-slate-300 ${mood.color}`}></div>
                                <span className="text-sm font-medium text-slate-600">{mood.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-5 md:grid-cols-7 gap-3">
                    {days.map(d => (
                        <div key={d} className="aspect-square border-2 border-slate-200 rounded-lg p-2 flex flex-col justify-between hover:border-violet-300">
                            <span className="text-xs font-bold text-slate-400">{d}</span>
                            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 self-center"></div>
                        </div>
                    ))}
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

export function WeeklyGoals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'weekly-goals';
    const { getTrans } = useWorksheetTranslation(docId);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Weekly Goal Setter')}
            emoji="🎯"
            description={getTrans('description', 'Set and track your goals for the week.')}
            problemCount={1}
            learningObjectives={[
                'Set achievable goals',
                'Break big tasks into small steps',
                'Reflect on progress'
            ]}
        >
            <PremiumWorksheetBanner
                title="Goal Getter"
                subtitle="Ready, Set, Achieve!"
                icons={{ bg1: "🎯", bg2: "🚀", float1: "🏆", float2: "📈" }}
                colors={{
                    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                    border: "border-emerald-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-emerald-300",
                    pillText: "text-emerald-900",
                    accent: "text-emerald-400"
                }}
            />

            <div className="space-y-6 mt-8">
                {/* Main Goal */}
                <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400"></div>
                    <h3 className="font-bold text-emerald-800 text-lg mb-4">🌟 My Main Goal for the Week</h3>
                    <div className="w-full h-24 border-b border-emerald-100 border-dashed bg-emerald-50/30 rounded p-4"></div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(step => (
                        <div key={step} className="bg-white p-4 rounded-xl border-2 border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold mb-3">
                                {step}
                            </div>
                            <div className="h-20 border-b border-slate-100 border-dashed"></div>
                            <p className="text-xs text-slate-400 mt-2 uppercase text-center font-bold">Step {step}</p>
                        </div>
                    ))}
                </div>

                {/* Habit Tracker Mini */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4">⚡ Daily Habits to Help Me</h3>
                    <div className="flex justify-between gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded border-2 border-slate-300 bg-white"></div>
                                <span className="text-xs font-bold text-slate-400">{d}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

export function Mandalas({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mandalas';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    // Simple procedural mandala generation using SVG
    const generateMandala = (index: number) => {
        const petals = 8 + (index % 3) * 4;
        const layers = 3 + (index % 2);

        return (
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="98" fill="none" stroke="black" strokeWidth="1" />
                {Array.from({ length: layers }).map((_, l) => {
                    const radius = 90 - (l * 25);
                    return Array.from({ length: petals }).map((_, i) => {
                        const angle = (i * 360) / petals;
                        return (
                            <g key={`${l}-${i}`} transform={`rotate(${angle} 100 100)`}>
                                <path
                                    d={`M100 ${100 - radius} Q115 ${100 - radius / 2} 100 100 Q85 ${100 - radius / 2} 100 ${100 - radius}`}
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="0.5"
                                />
                                <circle cx="100" cy={100 - radius} r={3} fill="none" stroke="black" strokeWidth="0.5" />
                            </g>
                        );
                    });
                })}
                <circle cx="100" cy="100" r="10" fill="none" stroke="black" />
            </svg>
        );
    };

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Mandala Mindfulness')}
            emoji="🧘"
            description={getTrans('description', 'Color these symmetrical patterns to relax and focus.')}
            problemCount={2}
            learningObjectives={[
                'Practice mindfulness and relaxation',
                'Develop fine motor skills',
                'Explore symmetry and patterns'
            ]}
        >
            <PremiumWorksheetBanner
                title="Mindful Mandalas"
                subtitle="Peaceful Patterns"
                icons={{ bg1: "🧘", bg2: "🌺", float1: "☮️", float2: "🖍️" }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
                    border: "border-cyan-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-cyan-300",
                    pillText: "text-cyan-900",
                    accent: "text-cyan-400"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {[1, 2].map(m => (
                    <div key={m} className="aspect-square bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm flex items-center justify-center">
                        {generateMandala(m)}
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center text-slate-500 italic">
                Focus on your breathing while you color. Stay inside the lines!
            </div>
        </WorksheetSectionWrapper>
    );
}

export function FeelingsCheckin({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'feelings-checkin';
    const { getTrans } = useWorksheetTranslation(docId);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Feelings Check-In')}
            emoji="🌡️"
            description={getTrans('description', 'How are you feeling right now? Rate your mood.')}
            problemCount={1}
            learningObjectives={[
                'Identify current emotional state',
                'Communicate feelings effectively',
                'Practice self-awareness'
            ]}
        >
            <PremiumWorksheetBanner
                title="Mood Meter"
                subtitle="Emotional Intelligence"
                icons={{ bg1: "🌡️", bg2: "💭", float1: "😊", float2: "😢" }}
                colors={{
                    bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
                    border: "border-yellow-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-yellow-300",
                    pillText: "text-yellow-900",
                    accent: "text-yellow-600"
                }}
            />

            <div className="flex flex-col items-center gap-8 mt-8">
                <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-yellow-200 shadow-sm relative">
                    <h3 className="text-center font-bold text-slate-700 mb-6 text-xl">How I Feel Today</h3>

                    {/* Meter Gauge Graphic */}
                    <div className="w-full h-12 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full relative mb-4">
                        <div className="absolute top-1/2 left-0 w-full flex justify-between px-4 -translate-y-1/2 text-white font-bold text-shadow">
                            <span>Low Energy</span>
                            <span>Okay</span>
                            <span>High Energy</span>
                        </div>
                    </div>

                    {/* Selection Areas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { emoji: '🤩', label: 'Excited' },
                            { emoji: '😊', label: 'Happy' },
                            { emoji: '😐', label: 'Okay' },
                            { emoji: '😔', label: 'Sad' },
                            { emoji: '😠', label: 'Angry' },
                            { emoji: '😴', label: 'Tired' },
                            { emoji: '😨', label: 'Scared' },
                            { emoji: '🤢', label: 'Sick' }
                        ].map((feel, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                <span className="text-4xl">{feel.emoji}</span>
                                <span className="font-bold text-slate-600">{feel.label}</span>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-2xl bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="font-bold text-orange-800 mb-2">Why do I feel this way?</h3>
                    <div className="w-full h-32 border-b-2 border-orange-200 border-dashed bg-white/50 rounded p-4"></div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

export function RewardChart({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'reward-chart';
    const { getTrans } = useWorksheetTranslation(docId);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Weekly Reward / Sticker Chart')}
            emoji="🏆"
            description={getTrans('description', 'Add a sticker or color a star each time you complete a task.')}
            problemCount={1}
            learningObjectives={[
                'Track daily accomplishments',
                'Build positive habits',
                'Practice goal-setting'
            ]}
        >
            <PremiumWorksheetBanner
                title="Super Star Tracker"
                subtitle="Weekly Goals"
                icons={{ bg1: "⭐", bg2: "🏆", float1: "🌟", float2: "✨" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-600"
                }}
            />

            <div className="mt-8 flex flex-col gap-6 items-center">
                <div className="w-full bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 bg-indigo-50 border-b-2 border-indigo-100">
                        <div className="col-span-2 p-4 font-bold text-indigo-900 flex items-center justify-center">Task / Goal</div>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="p-2 text-center text-sm font-bold text-indigo-800 border-l border-indigo-100 flex items-center justify-center">
                                {day}
                            </div>
                        ))}
                    </div>
                    {/* Rows */}
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="grid grid-cols-8 border-b border-slate-100 min-h-[60px]">
                            <div className="col-span-2 p-2 border-r border-slate-100 relative">
                                <div className="absolute top-2 left-2 text-slate-300 text-xs font-bold w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center">
                                    {row}
                                </div>
                            </div>
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="border-r border-slate-100 last:border-0 p-1 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50 opacity-50"></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="w-full p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 border-dashed text-center">
                    <span className="font-bold text-yellow-800 mr-2">Reward when complete:</span>
                    <span className="border-b-2 border-black/20 w-48 inline-block"></span>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

