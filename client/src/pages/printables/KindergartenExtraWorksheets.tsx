import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
type ReactNode = React.ReactNode;
import { SpecificWorksheetProps } from '../../types/printable';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';
import { makeRng, pick, shuffleArray } from '@/utils/printableUtils';
import { useTranslation } from '@/context/TranslationContext';

// --- Comparison Worksheets (Preserved) ---

const COMPARISON_DATA: Record<string, { title: string, emoji: string, prompt: string, pairs: Array<{ a: { icon: string, label: string }, b: { icon: string, label: string }, correct: 'a' | 'b' }> }> = {
    'heavy-light': {
        title: 'Heavy or Light?',
        emoji: '⚖️',
        prompt: 'Which one is heavier? Circle it!',
        pairs: [
            { a: { icon: '🐘', label: 'Elephant' }, b: { icon: '🐜', label: 'Ant' }, correct: 'a' },
            { a: { icon: '🎈', label: 'Balloon' }, b: { icon: '🧱', label: 'Brick' }, correct: 'b' },
            { a: { icon: '🏠', label: 'House' }, b: { icon: '🧸', label: 'Teddy Bear' }, correct: 'a' },
            { a: { icon: '🚲', label: 'Bicycle' }, b: { icon: '🚗', label: 'Car' }, correct: 'b' },
            { a: { icon: '🍎', label: 'Apple' }, b: { icon: '🍉', label: 'Watermelon' }, correct: 'b' },
            { a: { icon: '🐭', label: 'Mouse' }, b: { icon: '🐱', label: 'Cat' }, correct: 'b' },
        ]
    },
    'long-short': {
        title: 'Long or Short?',
        emoji: '📏',
        prompt: 'Which one is longer? Circle it!',
        pairs: [
            { a: { icon: '🐍', label: 'Snake' }, b: { icon: '🐛', label: 'Caterpillar' }, correct: 'a' },
            { a: { icon: '✏️', label: 'Pencil' }, b: { icon: '📏', label: 'Ruler' }, correct: 'b' },
            { a: { icon: '🧣', label: 'Scarf' }, b: { icon: '🧤', label: 'Glove' }, correct: 'a' },
            { a: { icon: '🦒', label: 'Giraffe' }, b: { icon: '🐕', label: 'Dog' }, correct: 'a' },
            { a: { icon: '🛶', label: 'Canoe' }, b: { icon: '🛳️', label: 'Ship' }, correct: 'b' },
            { a: { icon: '🥖', label: 'Baguette' }, b: { icon: '🥨', label: 'Pretzel' }, correct: 'a' },
        ]
    },
    'big-small': {
        title: 'Big or Small?',
        emoji: '🐘',
        prompt: 'Which one is bigger? Circle it!',
        pairs: [
            { a: { icon: '🍉', label: 'Watermelon' }, b: { icon: '🍒', label: 'Cherry' }, correct: 'a' },
            { a: { icon: '🚌', label: 'Bus' }, b: { icon: '🚲', label: 'Bicycle' }, correct: 'a' },
            { a: { icon: '🐳', label: 'Whale' }, b: { icon: '🐠', label: 'Fish' }, correct: 'a' },
            { a: { icon: '🌳', label: 'Tree' }, b: { icon: '🌸', label: 'Flower' }, correct: 'a' },
            { a: { icon: '🚁', label: 'Helicopter' }, b: { icon: '✈️', label: 'Airplane' }, correct: 'b' },
            { a: { icon: '🍓', label: 'Strawberry' }, b: { icon: '🎃', label: 'Pumpkin' }, correct: 'b' },
        ]
    },
    'more-less': {
        title: 'More or Less?',
        emoji: '🔢',
        prompt: 'Which group has more? Circle it!',
        pairs: [
            { a: { icon: '🍎🍎🍎', label: '3 Apples' }, b: { icon: '🍎🍎', label: '2 Apples' }, correct: 'a' },
            { a: { icon: '⭐', label: '1 Star' }, b: { icon: '⭐⭐⭐⭐', label: '4 Stars' }, correct: 'b' },
            { a: { icon: '🎈🎈🎈🎈🎈', label: '5 Balloons' }, b: { icon: '🎈🎈🎈', label: '3 Balloons' }, correct: 'a' },
            { a: { icon: '🍪🍪', label: '2 Cookies' }, b: { icon: '🍪🍪🍪🍪🍪🍪', label: '6 Cookies' }, correct: 'b' },
            { a: { icon: '🐶🐶🐶', label: '3 Dogs' }, b: { icon: '🐶🐶🐶🐶', label: '4 Dogs' }, correct: 'b' },
            { a: { icon: '🍭🍭🍭🍭🍭🍭🍭', label: '7 Lollipops' }, b: { icon: '🍭🍭🍭🍭', label: '4 Lollipops' }, correct: 'a' },
        ]
    }
};

export function ComparisonWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const config = COMPARISON_DATA[docId] || COMPARISON_DATA['heavy-light'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const displayPairs = shuffleArray([...config.pairs], rng);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description={config.prompt}
            problemCount={displayPairs.length}
            learningObjectives={[
                'Identify and compare attributes of objects',
                'Use comparison vocabulary (heavier/lighter, longer/shorter, etc.)',
                'Develop visual discrimination skills',
                'Understand relative size and quantity'
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
                {displayPairs.map((pair, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col items-center justify-center gap-6 hover:border-blue-300 transition-colors break-inside-avoid shadow-sm">
                        <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                <div className="text-5xl md:text-6xl p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors min-h-[140px] w-full flex items-center justify-center flex-wrap gap-1 cursor-pointer">
                                    {Array.from(pair.a.icon).map((emoji, idx: number) => (
                                        <span key={idx}>{emoji}</span>
                                    ))}
                                </div>
                                <span className="font-bold text-slate-800 text-center">{pair.a.label}</span>
                            </div>

                            <div className="text-xl font-black text-slate-200 uppercase tracking-tighter shrink-0">vs</div>

                            <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                <div className="text-5xl md:text-6xl p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors min-h-[140px] w-full flex items-center justify-center flex-wrap gap-1 cursor-pointer">
                                    {Array.from(pair.b.icon).map((emoji, idx: number) => (
                                        <span key={idx}>{emoji}</span>
                                    ))}
                                </div>
                                <span className="font-bold text-slate-800 text-center">{pair.b.label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl print:bg-white">
                    <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span>✅</span> Answer Key
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {displayPairs.map((p, i: number) => (
                            <div key={i} className="text-sm font-medium text-emerald-800">
                                {i + 1}. {p.correct === 'a' ? p.a.label : p.b.label}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Pattern Worksheets (Premium Upgrade) ---

const PATTERN_TYPES: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => { sequence: string[], options: string[], answer: string } }> = {
    'ab-pattern': {
        title: 'AB Patterns',
        emoji: '🚂',
        description: 'What comes next in the AB pattern?',
        generator: (rng: any) => {
            const themes = [['🍎', '🍌'], ['🐶', '🐱'], ['🚗', '🚙'], ['🔴', '🔵'], ['⭐', '🌙'], ['🌳', '🌸']];
            const [a, b] = themes[Math.floor(rng() * themes.length)];
            const sequence = [a, b, a, b, a, b];
            return { sequence, options: [a, b], answer: a };
        }
    },
    'color-patterns': {
        title: 'Color Patterns',
        emoji: '🎨',
        description: 'Find the pattern and color the next object!',
        generator: (rng: any) => {
            const palettes = [['🔴', '🔵', '🟢'], ['🟡', '🟠', '🔴'], ['🟣', '⚪', '⚫']];
            const palette = palettes[Math.floor(rng() * palettes.length)];
            return { sequence: [palette[0], palette[1], palette[0], palette[1], palette[0]], options: [palette[0], palette[1]], answer: palette[1] };
        }
    },
    'shape-patterns': {
        title: 'Shape Patterns',
        emoji: '📐',
        description: 'Which shape comes next in the pattern?',
        generator: (rng: any) => {
            const shapes = ['⭕', '📐', '🟦', '⭐', '💎'];
            const s1 = shapes[Math.floor(rng() * shapes.length)];
            let s2 = shapes[Math.floor(rng() * shapes.length)];
            while (s2 === s1) s2 = shapes[Math.floor(rng() * shapes.length)];
            return { sequence: [s1, s1, s2, s1, s1], options: [s1, s2], answer: s2 }; // Fixed AAB
        }
    },
    'what-comes-next': {
        title: 'What Comes Next?',
        emoji: '🔮',
        description: 'Look at the pattern and find the missing piece!',
        generator: (rng: any) => {
            const emojis = ['🚀', '🛸', '🛰️', '🪐', '👽', '👾', '🌈', '☀️', '☁️', '❄️'];
            const e1 = emojis[Math.floor(rng() * emojis.length)];
            let e2 = emojis[Math.floor(rng() * emojis.length)];
            while (e2 === e1) e2 = emojis[Math.floor(rng() * emojis.length)];
            return { sequence: [e1, e2, e1, e2, e1, e2], options: [e1, e2], answer: e1 };
        }
    },
    'what-comes-next-shapes': { title: 'What Comes Next?', emoji: '❓', description: 'Draw the shape that comes next!', generator: (rng) => ({ sequence: ['🟥', '🟦', '🟢', '🟥', '🟦'], options: ['🟥', '🟦', '🟢'], answer: '🟢' }) },
    'pattern-complete': { title: 'Complete the Pattern', emoji: '🧩', description: 'Fill missing parts!', generator: (rng) => ({ sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], options: ['🍎', '🍌'], answer: '🍌' }) }
};

export function PatternWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = PATTERN_TYPES[docId] || PATTERN_TYPES['ab-pattern'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const problems = Array.from({ length: 5 }, () => config.generator(rng));

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description={config.description}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Pattern Express"
                subtitle="Next Stop: Logic City"
                icons={{ bg1: "🚂", bg2: "🛤️", float1: "🚃", float2: "🔧" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-400"
                }}
            />

            <div className="space-y-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col gap-4 break-inside-avoid">
                        {/* Train Viz */}
                        <div className="flex items-end gap-1 overflow-x-auto pb-4 pt-2">
                            {/* Engine */}
                            <div className="relative shrink-0 w-24 h-20 bg-indigo-500 rounded-lg rounded-tr-3xl mr-2 flex items-center justify-center shadow-md">
                                <div className="absolute -top-6 right-2 w-6 h-10 bg-indigo-600 rounded-sm"></div> {/* Smokestack */}
                                <div className="absolute bottom-2 left-2 w-16 h-4 bg-yellow-400 rounded-full"></div>
                                <div className="text-4xl">🚂</div>
                                <div className="absolute -bottom-3 left-2 w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-500"></div>
                                <div className="absolute -bottom-3 right-4 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-500"></div>
                            </div>

                            {/* Carriages */}
                            {p.sequence.map((item, j) => (
                                <div key={j} className="relative w-16 h-14 bg-white border-2 border-indigo-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                    <span className="text-3xl">{item}</span>
                                    {/* Wheels */}
                                    <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-700 rounded-full"></div>
                                    <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-700 rounded-full"></div>
                                    {/* Connector */}
                                    <div className="absolute top-1/2 -right-3 w-3 h-1 bg-slate-400"></div>
                                </div>
                            ))}

                            {/* Mystery Carriage */}
                            <div className="relative w-16 h-14 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-2xl opacity-50">?</span>
                                <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                                <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex justify-center gap-6">
                            {p.options.map((opt, k) => (
                                <div key={k} className="w-16 h-16 rounded-xl border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center text-3xl cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <h3 className="font-bold text-emerald-900 mb-2">Conductor's Log: Answer Key</h3>
                    <div className="flex gap-4 flex-wrap">
                        {problems.map((p, i) => (
                            <div key={i} className="px-3 py-1 bg-white border border-emerald-200 rounded text-emerald-800 font-medium">
                                #{i + 1}: {p.answer}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Shape Worksheets (Premium Upgrade) ---

const SHAPE_DATA: Record<string, { title: string, emoji: string, generator: (rng: any) => any }> = {
    'shape-identification': {
        title: 'Shape Identification',
        emoji: '🟢',
        generator: (rng: any) => [
            { name: 'Circle', icon: '⭕', sides: 0 },
            { name: 'Square', icon: '🟥', sides: 4 },
            { name: 'Triangle', icon: '🔺', sides: 3 },
            { name: 'Star', icon: '⭐', sides: 10 }
        ]
    },
    'missing-shape': { title: 'Missing Shape', emoji: '❓', generator: (rng) => [] },
    'color-shapes': { title: 'Color Shapes', emoji: '🎨', generator: (rng) => [] },
    'shape-sorting': { title: 'Shape Sorting', emoji: '📦', generator: (rng) => [] },
    'color-recognition': { title: 'Color Recognition', emoji: '🌈', generator: (rng) => [] },
    'draw-shape': { title: 'Draw Shapes', emoji: '✏️', generator: (rng) => [] }
};

export function ShapeWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = SHAPE_DATA[docId] || SHAPE_DATA['shape-identification'];
    // Logic for specific variants is simplified here as we primarily want to demonstrate the visual upgrade structure. 
    // In a full implementation, we'd port all logic blocks. For now, focused on shape-identification premium look.
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const data = config.generator(rng);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description="Explore the world of shapes!"
            problemCount={4}
        >
            <PremiumWorksheetBanner
                title="Shape Safari"
                subtitle="Geometry Adventure"
                icons={{ bg1: "🦁", bg2: "🌿", float1: "📐", float2: "🔭" }}
                colors={{
                    bg: "bg-gradient-to-br from-green-50 to-teal-50",
                    border: "border-green-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-green-300",
                    pillText: "text-green-900",
                    accent: "text-green-400"
                }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {/* Visual Cards */}
                {(data as any[]).map((shape: any, i: number) => (
                    <div key={i} className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm hover:border-green-300 transition-colors">
                        <div className="w-32 h-32 flex items-center justify-center bg-slate-50 rounded-full text-7xl">
                            {shape.icon}
                        </div>
                        <div className="w-full text-center">
                            <h3 className="font-bold text-slate-800 text-xl mb-1">{shape.name}</h3>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-widest">{shape.sides} Sides</div>
                        </div>
                        <div className="w-full h-12 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-300 text-sm">
                            Trace Here
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Key (Simple) */}
            {showAnswersForDoc(docId, () => (
                <div className="mt-8 text-center text-slate-400 text-sm">
                    Answer Key: Correctly identifying shapes is the goal!
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Number Recognition (Preserved) ---

export function NumberRecognitionWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Simple preservation

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Number Fun"
            emoji="1️⃣"
            description="Learn your numbers!"
            problemCount={10}
        >
            <div className="grid grid-cols-5 gap-4">
                {numbers.map(n => (
                    <div key={n} className="aspect-square border-2 border-slate-200 rounded-xl flex items-center justify-center text-4xl font-bold bg-white shadow-sm">
                        {n}
                    </div>
                ))}
            </div>
        </WorksheetSectionWrapper>
    );
}


// --- SVG Components for Premium Scenes ---

const RocketSVG = ({ color = '#6366f1', size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path d="M50 15C35 35 35 65 35 75C35 80 40 85 50 85C60 85 65 80 65 75C65 65 65 35 50 15Z" fill={color} stroke="#1e293b" strokeWidth="3" />
        <path d="M35 60C25 65 20 75 20 85H35" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 60C75 65 80 75 80 85H65" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
        <path d="M45 85V95M55 85V95M50 85V98" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const PlanetSVG = ({ color = '#fbbf24', size = 50 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill={color} stroke="#1e293b" strokeWidth="3" />
        <path d="M15 55C15 55 25 75 85 45" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="40" r="5" fill="black" opacity="0.1" />
        <circle cx="60" cy="65" r="8" fill="black" opacity="0.1" />
    </svg>
);

const TreeSVG = ({ color = '#10b981', size = 70 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="45" y="60" width="10" height="30" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <circle cx="50" cy="40" r="30" fill={color} stroke="#064e3b" strokeWidth="3" />
        <circle cx="35" cy="55" r="20" fill={color} stroke="#064e3b" strokeWidth="3" />
        <circle cx="65" cy="55" r="20" fill={color} stroke="#064e3b" strokeWidth="3" />
    </svg>
);

const MushroomSVG = ({ color = '#f87171', size = 30 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M30 80C30 70 40 60 50 60C60 60 70 70 70 80V90H30V80Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <path d="M15 65C15 40 30 20 50 20C70 20 85 40 85 65H15Z" fill={color} stroke="#991b1b" strokeWidth="3" />
        <circle cx="35" cy="40" r="6" fill="white" opacity="0.8" />
        <circle cx="60" cy="35" r="8" fill="white" opacity="0.8" />
        <circle cx="70" cy="50" r="5" fill="white" opacity="0.8" />
    </svg>
);

const FishSVG = ({ color = '#3b82f6', size = 40 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M10 50C10 30 40 20 60 40C70 40 90 20 90 50C90 80 70 60 60 60C40 80 10 70 10 50Z" fill={color} stroke="#1e3a8a" strokeWidth="3" />
        <circle cx="30" cy="45" r="4" fill="black" />
        <path d="M60 40L65 30M60 60L65 70" stroke="#1e3a8a" strokeWidth="2" />
    </svg>
);

const OctopusSVG = ({ color = '#a855f7', size = 50 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M30 40C30 25 40 15 50 15C60 15 70 25 70 40C70 55 60 65 50 65C40 65 30 55 30 40Z" fill={color} stroke="#581c87" strokeWidth="3" />
        <path d="M35 60Q20 70 10 90M45 65Q40 80 35 95M55 65Q60 80 65 95M65 60Q85 70 95 90" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <circle cx="43" cy="35" r="4" fill="white" />
        <circle cx="57" cy="35" r="4" fill="white" />
    </svg>
);

const SPACE_SCENE = (rng: any) => ({
    name: 'Space Adventure',
    bg: 'bg-slate-900',
    accent: 'text-indigo-400',
    elements: [
        { id: 'rocket', component: RocketSVG, x: 25, y: 35, size: 80, canDiff: ['color', 'move', 'rotate'] },
        { id: 'planet1', component: PlanetSVG, x: 75, y: 25, size: 70, canDiff: ['color', 'missing'] },
        { id: 'alien', icon: '👾', x: 80, y: 75, size: 45, canDiff: ['missing', 'move'] },
        { id: 'star1', icon: '⭐', x: 15, y: 15, size: 25, canDiff: ['missing'] },
        { id: 'star2', icon: '✨', x: 55, y: 20, size: 30, canDiff: ['missing'] },
        { id: 'star3', icon: '🌟', x: 35, y: 85, size: 25, canDiff: ['missing'] },
        { id: 'satellite', icon: '🛰️', x: 20, y: 70, size: 35, canDiff: ['missing', 'rotate'] },
        { id: 'ufo', icon: '🛸', x: 65, y: 55, size: 50, canDiff: ['color', 'missing'] },
        { id: 'comet', icon: '☄️', x: 85, y: 15, size: 40, canDiff: ['move', 'missing'] },
        { id: 'moon', icon: '🌙', x: 45, y: 45, size: 35, canDiff: ['move', 'missing'] },
    ]
});

const FOREST_SCENE = (rng: any) => ({
    name: 'Magic Forest',
    bg: 'bg-emerald-50',
    accent: 'text-emerald-500',
    elements: [
        { id: 'tree1', component: TreeSVG, x: 20, y: 55, size: 90, canDiff: ['move', 'missing'] },
        { id: 'tree2', component: TreeSVG, x: 70, y: 50, size: 100, canDiff: ['move', 'missing'] },
        { id: 'mushroom1', component: MushroomSVG, x: 35, y: 85, size: 40, canDiff: ['color', 'missing'] },
        { id: 'butterfly', icon: '🦋', x: 55, y: 25, size: 40, canDiff: ['move', 'color'] },
        { id: 'bee', icon: '🐝', x: 25, y: 30, size: 30, canDiff: ['missing', 'move'] },
        { id: 'flower1', icon: '🌸', x: 15, y: 90, size: 30, canDiff: ['missing', 'color'] },
        { id: 'flower2', icon: '🌻', x: 85, y: 90, size: 40, canDiff: ['missing', 'color'] },
        { id: 'rabbit', icon: '🐇', x: 65, y: 80, size: 35, canDiff: ['missing', 'move'] },
        { id: 'bird', icon: '🐦', x: 75, y: 20, size: 30, canDiff: ['missing', 'move'] },
        { id: 'rainbow', icon: '🌈', x: 40, y: 15, size: 60, canDiff: ['missing'] },
    ]
});

const OCEAN_SCENE = (rng: any) => ({
    name: 'Ocean Explorers',
    bg: 'bg-sky-100',
    accent: 'text-blue-500',
    elements: [
        { id: 'whale', component: FishSVG, x: 45, y: 45, size: 90, canDiff: ['move', 'color'] },
        { id: 'fish1', component: FishSVG, x: 15, y: 25, size: 40, canDiff: ['missing', 'move'] },
        { id: 'fish2', component: FishSVG, x: 80, y: 75, size: 45, canDiff: ['missing', 'move'] },
        { id: 'shark', icon: '🦈', x: 75, y: 30, size: 70, canDiff: ['move', 'missing'] },
        { id: 'crab', icon: '🦀', x: 25, y: 90, size: 35, canDiff: ['move', 'missing'] },
        { id: 'octopus', component: OctopusSVG, x: 70, y: 85, size: 60, canDiff: ['color', 'missing'] },
        { id: 'shell', icon: '🐚', x: 55, y: 95, size: 25, canDiff: ['missing', 'move'] },
        { id: 'bubble1', icon: '🫧', x: 35, y: 20, size: 25, canDiff: ['missing'] },
        { id: 'bubble2', icon: '🫧', x: 65, y: 65, size: 20, canDiff: ['missing'] },
        { id: 'submarine', icon: '🚢', x: 20, y: 50, size: 65, canDiff: ['color', 'move'] },
    ]
});

/**
 * SceneRenderer draws the SVG-based interactive scene
 */
const SceneRenderer = memo(({ scene, differences = [] }: { scene: any, differences?: any[] }) => {
    return (
        <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-4 border-slate-700 ${scene.bg}`}>
            {/* Background patterns based on theme */}
            {scene.bg === 'bg-slate-900' && (
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
            )}
            {scene.bg === 'bg-emerald-50' && (
                <div className="absolute bottom-0 w-full h-1/4 bg-emerald-100/30" />
            )}
            {scene.bg === 'bg-sky-100' && (
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 13 50 13s16.36 2.347 25.96 5.937l1.768.661c.368.138.73.272 1.088.402H100V0H0v20h21.184z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }} />
            )}

            {/* Render elements */}
            {scene.elements.map((el: any) => {
                const diff = differences.find(d => d.id === el.id);
                if (diff?.type === 'missing') return null;

                let style: any = {
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    fontSize: `${el.size}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.3s ease'
                };

                if (diff?.type === 'move') {
                    style.left = `${el.x + 8}%`;
                    style.top = `${el.y - 5}%`;
                }
                if (diff?.type === 'rotate') {
                    style.transform = 'translate(-50%, -50%) rotate(45deg)';
                }
                if (diff?.type === 'color') {
                    style.filter = 'hue-rotate(90deg) saturate(1.5)';
                }

                return (
                    <div key={el.id} className="absolute flex items-center justify-center select-none" style={style}>
                        {el.component ? <el.component size={el.size} /> : el.icon}
                    </div>
                );
            })}

            {/* Grid lines for "detective" feel - subtle */}
            <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
        </div>
    );
});

export function SpotDifferenceWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);

    // Generate 2 scenes
    const puzzles = useMemo(() => {
        const themePool = [SPACE_SCENE, FOREST_SCENE, OCEAN_SCENE];
        const pickedThemes = shuffleArray([...themePool], rng).slice(0, 2);

        return pickedThemes.map((themeFactory, idx) => {
            const scene = themeFactory(rng);
            const possibleDiffs = scene.elements.filter(el => el.canDiff && el.canDiff.length > 0);
            const chosenDiffs = shuffleArray([...possibleDiffs], rng).slice(0, 7).map(el => {
                const type = pick(el.canDiff, rng);
                return { id: el.id, type, label: el.id.replace(/\d+$/, '') };
            });

            return { scene, differences: chosenDiffs };
        });
    }, [seed, variant]);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Ultimate Detective Challenge"
            emoji="🔍"
            description="Find all 7 hidden differences in each pair of pictures. Look closely at colors, positions, and missing items!"
            problemCount={2}
            learningObjectives={[
                "Develop high-level visual discrimination",
                "Improve sustained attention and focus",
                "Pattern recognition and spatial awareness",
                "Detail-oriented observation skills"
            ]}
        >
            <PremiumWorksheetBanner
                title="Detective HQ"
                subtitle="Spot The Difference: Expert Edition"
                icons={{ bg1: "🕵️", bg2: "🕶️", float1: "🏮", float2: "🔦" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-400"
                }}
            />

            <div className="space-y-16 mt-8">
                {puzzles.map((puzzle: any, idx: number) => (
                    <div key={idx} className="break-inside-avoid flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                            <div className="flex gap-2 items-center">
                                <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">#{idx + 1}</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Case: {puzzle.scene.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1 uppercase">
                                        Difficulty: <span className="text-amber-500 font-black">★★★★★</span>
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex gap-2">
                                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                    <div key={n} className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 font-bold text-xs">{n}</div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                            <div className="flex flex-col gap-3">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Original Evidence</div>
                                <SceneRenderer scene={puzzle.scene} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">Modified Scene (7 Diffs)</div>
                                <SceneRenderer scene={puzzle.scene} differences={puzzle.differences} />
                            </div>

                            {/* Connector icon for desktop */}
                            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-slate-100 shadow-sm items-center justify-center text-xl z-10">
                                🔍
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-center">
                            <p className="text-sm text-slate-500 italic">
                                Tip: Cross-compare elements like the {puzzle.scene.elements[0].id.replace(/\d+$/, '')} and {puzzle.scene.elements[1].id.replace(/\d+$/, '')}. Good luck, detective!
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-emerald-50 border-4 border-double border-emerald-200 rounded-3xl print:bg-white print:border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">🏆</span>
                        <div>
                            <h3 className="font-black text-emerald-900 text-xl uppercase tracking-tight">Confidential: Answer Key</h3>
                            <p className="text-emerald-700 text-sm opacity-80">Only for Lead Detectives</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {puzzles.map((puzzle: any, i: number) => (
                            <div key={i} className="bg-white/50 p-4 rounded-xl border border-emerald-100">
                                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs">#{i + 1}</span>
                                    {puzzle.scene.name}
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {puzzle.differences.map((d: any, di: number) => (
                                        <div key={di} className="text-sm text-emerald-900 flex items-center gap-2 py-1 border-b border-emerald-50 last:border-0 capitalize">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            <span className="font-bold">{d.label}:</span>
                                            <span className="text-emerald-700">
                                                {d.type === 'missing' ? 'is missing' :
                                                    d.type === 'color' ? 'has a different color' :
                                                        d.type === 'move' ? 'has moved positions' :
                                                            'is rotated/flipped'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Coloring Worksheets (Restored & Upgraded) ---

const COLORING_ASSETS = {
    // Animals Theme
    animals: [
        {
            name: 'Friendly Lion',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Mane */}
                    <path d="M250 100 C200 50, 100 150, 120 250 C100 300, 150 400, 250 420 C350 400, 400 300, 380 250 C400 150, 300 50, 250 100 Z" />
                    {/* Face */}
                    <circle cx="250" cy="250" r="80" />
                    {/* Ears */}
                    <path d="M190 190 Q170 150, 210 180" />
                    <path d="M310 190 Q330 150, 290 180" />
                    {/* Eyes */}
                    <circle cx="225" cy="230" r="5" fill="#000" />
                    <circle cx="275" cy="230" r="5" fill="#000" />
                    {/* Nose & Mouth */}
                    <path d="M240 260 L260 260 L250 275 Z" fill="#000" />
                    <path d="M250 275 Q230 290, 220 280" />
                    <path d="M250 275 Q270 290, 280 280" />
                    {/* Whiskers */}
                    <line x1="200" y1="260" x2="160" y2="250" />
                    <line x1="200" y1="270" x2="160" y2="275" />
                    <line x1="300" y1="260" x2="340" y2="250" />
                    <line x1="300" y1="270" x2="340" y2="275" />
                </g>
            )
        },
        {
            name: 'Owl in Tree',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Tree Branch */}
                    <path d="M0 400 Q150 420, 300 380 Q400 360, 500 380" strokeWidth="15" />
                    {/* Leaves */}
                    <path d="M50 400 Q30 350, 70 340 Q90 350, 80 400" />
                    <path d="M400 370 Q420 320, 460 330 Q480 340, 450 380" />
                    {/* Owl Body */}
                    <ellipse cx="250" cy="300" rx="60" ry="80" />
                    {/* Wings */}
                    <path d="M190 300 Q170 350, 200 360" />
                    <path d="M310 300 Q330 350, 300 360" />
                    {/* Eyes */}
                    <circle cx="230" cy="270" r="15" />
                    <circle cx="270" cy="270" r="15" />
                    <circle cx="230" cy="270" r="3" fill="#000" />
                    <circle cx="270" cy="270" r="3" fill="#000" />
                    {/* Beak */}
                    <path d="M245 285 L255 285 L250 295 Z" fill="#000" />
                    {/* Feet */}
                    <path d="M230 380 L230 395" strokeWidth="5" />
                    <path d="M270 380 L270 395" strokeWidth="5" />
                </g>
            )
        },
        {
            name: 'Happy Elephant',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Body */}
                    <path d="M150 200 Q100 100, 250 100 Q350 100, 400 200 Q450 300, 400 400 L150 400 Z" />
                    {/* Head */}
                    <circle cx="180" cy="180" r="70" />
                    {/* Trunk */}
                    <path d="M130 200 Q100 250, 110 300 Q120 320, 140 310" strokeWidth="20" strokeLinecap="round" />
                    {/* Ear */}
                    <path d="M220 150 Q300 100, 280 250 Q220 250, 220 200" />
                    {/* Eye */}
                    <circle cx="160" cy="160" r="5" fill="#000" />
                    {/* Legs */}
                    <rect x="180" y="400" width="40" height="60" />
                    <rect x="350" y="400" width="40" height="60" />
                    {/* Tail */}
                    <path d="M400 250 Q450 250, 440 300" />
                </g>
            )
        }
    ],
    // Space Theme
    space: [
        {
            name: 'Rocket Launch',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Rocket Body */}
                    <path d="M200 350 L200 150 Q250 50, 300 150 L300 350 Z" />
                    {/* Fins */}
                    <path d="M200 350 L150 400 L200 380" />
                    <path d="M300 350 L350 400 L300 380" />
                    {/* Window */}
                    <circle cx="250" cy="200" r="30" />
                    {/* Flames */}
                    <path d="M220 350 Q250 450, 280 350" strokeDasharray="5,5" />
                    {/* Planets */}
                    <circle cx="100" cy="100" r="40" />
                    <path d="M50 100 Q100 150, 150 100" />
                    <circle cx="400" cy="300" r="20" />
                    {/* Stars */}
                    <path d="M400 100 L410 80 L420 100 L440 110 L420 120 L410 140 L400 120 L380 110 Z" />
                    <path d="M100 400 L110 380 L120 400 L140 410 L120 420 L110 440 L100 420 L80 410 Z" />
                </g>
            )
        },
        {
            name: 'To The Moon',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Moon Surface */}
                    <path d="M0 400 Q250 350, 500 400 L500 500 L0 500 Z" />
                    {/* Craters */}
                    <ellipse cx="100" cy="450" rx="40" ry="10" />
                    <ellipse cx="300" cy="420" rx="30" ry="8" />
                    <ellipse cx="450" cy="460" rx="20" ry="5" />
                    {/* Astronaut */}
                    <rect x="200" y="200" width="60" height="80" rx="10" />
                    <circle cx="230" cy="180" r="25" />
                    <line x1="200" y1="230" x2="170" y2="260" />
                    <line x1="260" y1="230" x2="290" y2="260" />
                    <line x1="210" y1="280" x2="210" y2="350" />
                    <line x1="250" y1="280" x2="250" y2="350" />
                    {/* Flag */}
                    <line x1="350" y1="350" x2="350" y2="150" strokeWidth="5" />
                    <rect x="350" y="150" width="80" height="50" />
                    {/* Earth in distance */}
                    <circle cx="400" cy="80" r="30" />
                </g>
            )
        }
    ],
    // Nature Theme
    nature: [
        {
            name: 'Flower Garden',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Grass */}
                    <path d="M0 450 L50 420 L100 450 L150 420 L200 450 L250 420 L300 450 L350 420 L400 450 L450 420 L500 450 L500 500 L0 500 Z" />
                    {/* Flower Center */}
                    <line x1="250" y1="450" x2="250" y2="300" strokeWidth="5" />
                    <circle cx="250" cy="250" r="30" />
                    {/* Petals */}
                    <circle cx="250" cy="190" r="30" />
                    <circle cx="250" cy="310" r="30" />
                    <circle cx="190" cy="250" r="30" />
                    <circle cx="310" cy="250" r="30" />
                    <circle cx="210" cy="210" r="25" />
                    <circle cx="290" cy="210" r="25" />
                    <circle cx="210" cy="290" r="25" />
                    <circle cx="290" cy="290" r="25" />
                    {/* Leaves */}
                    <path d="M250 350 Q300 320, 320 340 Q300 370, 250 360" />
                    <path d="M250 380 Q200 350, 180 370 Q200 400, 250 390" />
                    {/* Sun */}
                    <circle cx="50" cy="50" r="30" />
                    <line x1="50" y1="10" x2="50" y2="0" />
                    <line x1="50" y1="90" x2="50" y2="100" />
                    <line x1="10" y1="50" x2="0" y2="50" />
                    <line x1="90" y1="50" x2="100" y2="50" />
                </g>
            )
        },
        {
            name: 'Mountains',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Foreground Hills */}
                    <path d="M0 500 L0 400 Q150 350, 300 450 Q400 500, 500 400 L500 500 Z" />
                    {/* Big Mountain */}
                    <path d="M50 400 L250 100 L450 400" />
                    {/* Snow Cap */}
                    <path d="M200 175 L220 200 L250 175 L280 200 L300 175" />
                    {/* Cloud */}
                    <path d="M50 100 Q70 80, 90 100 Q110 80, 130 100 Q150 80, 170 100 L50 100" />
                    {/* Sun */}
                    <circle cx="400" cy="80" r="40" />
                    {/* Trees */}
                    <path d="M50 450 L60 420 L70 450" fill="#000" />
                    <path d="M100 470 L110 440 L120 470" fill="#000" />
                </g>
            )
        }
    ],
    // Vehicles Theme
    vehicles: [
        {
            name: 'Fast Car',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Car Body */}
                    <path d="M50 300 L100 250 L350 250 L400 300 L450 300 L450 350 L50 350 Z" />
                    {/* Roof / Windows */}
                    <path d="M120 250 L150 180 L300 180 L330 250" />
                    <line x1="225" y1="180" x2="225" y2="250" />
                    {/* Wheels */}
                    <circle cx="120" cy="350" r="40" />
                    <circle cx="120" cy="350" r="20" />
                    <circle cx="380" cy="350" r="40" />
                    <circle cx="380" cy="350" r="20" />
                    {/* Headlights */}
                    <circle cx="440" cy="320" r="10" />
                    {/* Road */}
                    <line x1="0" y1="400" x2="500" y2="400" strokeWidth="2" />
                </g>
            )
        },
        {
            name: 'Sailboat',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="3" fill="none">
                    {/* Water */}
                    <path d="M0 400 Q25 390, 50 400 T100 400 T150 400 T200 400 T250 400 T300 400 T350 400 T400 400 T450 400 T500 400" />
                    <path d="M0 430 Q25 420, 50 430 T100 430 T150 430 T200 430 T250 430 T300 430 T350 430 T400 430 T450 430 T500 430" />
                    {/* Boat Hull */}
                    <path d="M100 350 L400 350 L350 400 L150 400 Z" />
                    {/* Mast */}
                    <line x1="250" y1="350" x2="250" y2="100" />
                    {/* Sail Right */}
                    <path d="M255 110 L255 340 L380 340 Z" />
                    {/* Sail Left */}
                    <path d="M245 130 L245 340 L150 340 Z" />
                    {/* Flag */}
                    <path d="M250 100 L280 115 L250 130" />
                    {/* Sun */}
                    <circle cx="400" cy="80" r="30" />
                    {/* Birds */}
                    <path d="M100 100 L110 110 L120 100" />
                    <path d="M50 150 L60 160 L70 150" />
                </g>
            )
        }
    ]
};

export function ColoringWorksheet({ docId, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation();

    // Determine Theme
    const theme = useMemo(() => {
        if (docId.includes('animal')) return 'animals';
        if (docId.includes('space')) return 'space';
        if (docId.includes('nature')) return 'nature';
        if (docId.includes('vehicles')) return 'vehicles';
        if (docId.includes('letter')) return 'nature'; // Fallback for now
        return 'animals'; // Default default
    }, [docId]);

    // Select specific image based on seed
    const { selectedImage, currentPool } = useMemo(() => {
        const pool = COLORING_ASSETS[theme as keyof typeof COLORING_ASSETS] || COLORING_ASSETS['animals'];
        const rng = makeRng(`${seed}-${docId}-${variant}`);
        const img = pick(pool, rng);
        return { selectedImage: img, currentPool: pool };
    }, [seed, docId, variant, theme]);

    // Use selectedImage properties
    if (!selectedImage) return null;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={`${t(`worksheets.${docId}.title`) || 'Fun Coloring Page'}: ${selectedImage.name}`}
            emoji="🎨"
            description="Use your favorite colors to bring this scene to life!"
            problemCount={1}
            learningObjectives={[
                'Develop fine motor skills',
                'Practice color recognition',
                'Encourage creativity and self-expression',
                'Improve focus and concentration'
            ]}
        >
            <div className="flex flex-col items-center justify-center p-8 break-inside-avoid">
                <div className="w-full max-w-2xl aspect-square border-4 border-slate-900 rounded-xl bg-white p-4 shadow-xl">
                    <svg
                        viewBox={selectedImage.viewBox}
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {selectedImage.path}
                    </svg>
                </div>

                <div className="mt-8 flex gap-4 print:hidden">
                    <div className="flex gap-2">
                        {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'].map(c => (
                            <div key={c} className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: c }}></div>
                        ))}
                    </div>
                </div>

                <p className="mt-4 text-slate-500 text-sm italic print:block hidden">
                    My Masterpiece by: _________________________________  Date: ___________
                </p>
            </div>
        </WorksheetSectionWrapper>
    );
}

