import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
type ReactNode = React.ReactNode;
import { SpecificWorksheetProps } from '../../types/printable';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';
import { makeRng, pick, shuffleArray } from '@/utils/printableUtils';
import { useTranslation } from '@/context/TranslationContext';

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
    'size-comparison': {
        title: 'Size Comparison',
        emoji: '📏',
        prompt: 'Compare objects by size (Big vs Small, Long vs Short)',
        pairs: [
            { a: { icon: '🐘', label: 'Elephant' }, b: { icon: '🐜', label: 'Ant' }, correct: 'a' }, // Big
            { a: { icon: '✏️', label: 'Pencil' }, b: { icon: '📏', label: 'Ruler' }, correct: 'b' }, // Long
            { a: { icon: '🐁', label: 'Mouse' }, b: { icon: '🦁', label: 'Lion' }, correct: 'b' }, // Small vs Big
            { a: { icon: '🏢', label: 'Building' }, b: { icon: '🏠', label: 'House' }, correct: 'a' }, // Big
            { a: { icon: '🐛', label: 'Caterpillar' }, b: { icon: '🐍', label: 'Snake' }, correct: 'b' }, // Short vs Long
            { a: { icon: '🚙', label: 'Car' }, b: { icon: '🚚', label: 'Truck' }, correct: 'b' }, // Small vs Big
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
    },
    'same-different': {
        title: 'Same or Different?',
        emoji: '🔄',
        prompt: 'Are they the same? Circle matching pairs!',
        pairs: [
            { a: { icon: '🍎', label: 'Apple' }, b: { icon: '🍎', label: 'Apple' }, correct: 'a' },
            { a: { icon: '🐱', label: 'Cat' }, b: { icon: '🐶', label: 'Dog' }, correct: 'b' },
            { a: { icon: '🚗', label: 'Car' }, b: { icon: '🚗', label: 'Car' }, correct: 'a' },
            { a: { icon: '⭐', label: 'Star' }, b: { icon: '🌙', label: 'Moon' }, correct: 'b' },
            { a: { icon: '🎈', label: 'Balloon' }, b: { icon: '🎈', label: 'Balloon' }, correct: 'a' },
            { a: { icon: '🍪', label: 'Cookie' }, b: { icon: '🍩', label: 'Donut' }, correct: 'b' },
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

const PATTERN_TYPES: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => { sequence: string[], options: string[], answer: string, missingIndex?: number } }> = {
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
    'what-comes-next-shapes': {
        title: 'What Comes Next?',
        emoji: '❓',
        description: 'Draw the shape that comes next!',
        generator: (rng: any) => {
            const shapes = ['🟥', '🟦', '🟢', '⭐', '🔺', '🔷'];
            const s1 = shapes[Math.floor(rng() * shapes.length)];
            let s2 = shapes[Math.floor(rng() * shapes.length)];
            while (s2 === s1) s2 = shapes[Math.floor(rng() * shapes.length)];
            return { sequence: [s1, s2, s1, s2, s1], options: [s1, s2], answer: s2 };
        }
    },
    'pattern-complete': {
        title: 'Complete the Pattern',
        emoji: '🧩',
        description: 'Fill in the missing part!',
        generator: (rng: any) => {
            const items = ['🍎', '🍌', '🍇', '🍊', '🥝'];
            const i1 = items[Math.floor(rng() * items.length)];
            let i2 = items[Math.floor(rng() * items.length)];
            while (i2 === i1) i2 = items[Math.floor(rng() * items.length)];
            // AAB pattern: A A B A A B
            return { sequence: [i1, i1, i2, i1, i1, i2], missingIndex: 2, options: [i1, i2], answer: i2 };
        }
    }
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
                            {p.sequence.map((item: any, j: number) => {
                                const isMissing = p.missingIndex !== undefined ? j === p.missingIndex : j === p.sequence.length; // If undefined, assume next is missing (handled by Mystery Carriage but let's unify)
                                // Actually, for 'next' pattern, p.sequence is the VISIBLE part.
                                // For 'complete', p.sequence INCLUDES the missing part but we need to hide it?
                                // Let's simplify: generator returns sequence. If missingIndex is defined, that index is hidden. If not, we append a mystery box.

                                if (p.missingIndex !== undefined && j === p.missingIndex) {
                                    return (
                                        <div key={j} className="relative w-16 h-14 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center shrink-0">
                                            {docId !== 'color-patterns' && <span className="text-2xl opacity-50">?</span>}
                                            <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                                            <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                                            <div className="absolute top-1/2 -right-3 w-3 h-1 bg-slate-400"></div>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={j} className="relative w-16 h-14 bg-white border-2 border-indigo-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                        <span className="text-3xl">{item}</span>
                                        <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-700 rounded-full"></div>
                                        <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-700 rounded-full"></div>
                                        <div className="absolute top-1/2 -right-3 w-3 h-1 bg-slate-400"></div>
                                    </div>
                                );
                            })}

                            {/* Mystery Carriage (Next) */}
                            {p.missingIndex === undefined && (
                                <div className="relative w-16 h-14 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center shrink-0">
                                    {docId !== 'color-patterns' && <span className="text-2xl opacity-50">?</span>}
                                    <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                                    <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-300 rounded-full"></div>
                                </div>
                            )}
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

const SHAPE_DATA: Record<string, { title: string, emoji: string, type?: 'identify' | 'draw' | 'sort' | 'color' | 'mixed', generator: (rng: any) => any }> = {
    'shape-identification': {
        title: 'Shape Identification',
        emoji: '🟢',
        type: 'identify',
        generator: (rng: any) => [
            { name: 'Circle', icon: '⭕', sides: 0 },
            { name: 'Square', icon: '🟥', sides: 4 },
            { name: 'Triangle', icon: '🔺', sides: 3 },
            { name: 'Star', icon: '⭐', sides: 10 }
        ]
    },
    'missing-shape': {
        title: 'Missing Shape',
        emoji: '❓',
        type: 'draw',
        generator: (rng) => {
            const shapes = [{ name: 'Circle', icon: '⭕' }, { name: 'Square', icon: '🟥' }, { name: 'Triangle', icon: '🔺' }, { name: 'Diamond', icon: '💎' }];
            return shuffleArray(shapes, rng).slice(0, 4);
        }
    },
    'color-shapes': {
        title: 'Color the Shapes',
        emoji: '🎨',
        type: 'color',
        generator: (rng) => {
            return [
                { shape: 'Circle', color: 'Red', hex: '#ef4444', ring: 'border-red-500' },
                { shape: 'Square', color: 'Blue', hex: '#3b82f6', ring: 'border-blue-500' },
                { shape: 'Triangle', color: 'Yellow', hex: '#eab308', ring: 'border-yellow-500' }
            ];
        }
    },
    'shapes-colors-sort': {
        title: 'Shapes & Colors Sort',
        emoji: '✂️',
        type: 'sort',
        generator: (rng) => {
            // Circles vs Squares
            return {
                categories: [{ name: 'Circles', count: 0 }, { name: 'Squares', count: 0 }],
                items: shuffleArray([
                    { icon: '🔴', cat: 0 }, { icon: '🔵', cat: 0 }, { icon: '🟢', cat: 0 },
                    { icon: '🟥', cat: 1 }, { icon: '🟦', cat: 1 }, { icon: '🟧', cat: 1 }
                ], rng)
            };
        }
    },
    'shape-sorting': {
        title: 'Shape Sorting',
        emoji: '📦',
        type: 'sort',
        generator: (rng) => {
            // 3 Sides vs 4 Sides
            return {
                categories: [{ name: '3 Sides', count: 3 }, { name: '4 Sides', count: 4 }],
                items: shuffleArray([
                    { icon: '🔺', cat: 0 }, { icon: '📐', cat: 0 }, { icon: '🍕', cat: 0 },
                    { icon: '🟥', cat: 1 }, { icon: '🟦', cat: 1 }, { icon: '🖼️', cat: 1 }
                ], rng)
            };
        }
    },
    'color-recognition': {
        title: 'Color Recognition',
        emoji: '🌈',
        type: 'mixed',
        generator: (rng) => [
            { name: 'Apple', icon: '🍎', color: 'Red', hex: '#ef4444' },
            { name: 'Sun', icon: '☀️', color: 'Yellow', hex: '#eab308' },
            { name: 'Blueberry', icon: '🫐', color: 'Blue', hex: '#3b82f6' },
            { name: 'Leaf', icon: '🌿', color: 'Green', hex: '#22c55e' }
        ]
    },
    'draw-shape': {
        title: 'Draw the Shape',
        emoji: '✏️',
        type: 'draw',
        generator: (rng) => {
            const shapes = [{ name: 'Circle', icon: '⭕' }, { name: 'Square', icon: '🟥' }, { name: 'Triangle', icon: '🔺' }, { name: 'Rectangle', icon: '▬' }];
            return shuffleArray(shapes, rng).slice(0, 4);
        }
    }
};

export function ShapeWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = SHAPE_DATA[docId] || SHAPE_DATA['shape-identification'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const data = config.generator(rng);
    const type = config.type || 'identify';

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description="Explore the world of shapes and colors!"
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

            {/* Identify / Visual Cards */}
            {type === 'identify' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
            )}

            {/* Draw / Trace */}
            {type === 'draw' && (
                <div className="grid grid-cols-2 gap-6 mt-8">
                    {(data as any[]).map((shape: any, i: number) => (
                        <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2 border-b pb-2">
                                <span className="text-2xl">{shape.icon}</span>
                                <span className="font-bold text-slate-700">{shape.name}</span>
                            </div>
                            <div className="flex-1 min-h-[150px] border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                                Draw a {shape.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sort */}
            {type === 'sort' && (
                <div className="flex flex-col gap-8 mt-8">
                    <div className="flex justify-around gap-8">
                        {data.categories.map((cat: any, i: number) => (
                            <div key={i} className="flex-1 min-h-[200px] border-4 border-slate-300 rounded-xl bg-slate-50 relative p-4">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 border-2 border-slate-300 rounded-full font-bold text-slate-700 whitespace-nowrap">
                                    {cat.name}
                                </div>
                                <div className="w-full h-full flex items-center justify-center text-slate-300">Paste Here</div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t-2 border-slate-300 pt-8 border-dashed">
                        <div className="flex justify-center gap-4 text-slate-400 text-sm mb-4">✂️ Cut out these shapes:</div>
                        <div className="flex justify-center gap-6 flex-wrap">
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="w-16 h-16 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-4xl bg-white">
                                    {item.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Color Specific */}
            {type === 'color' && (
                <div className="mt-8">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6 text-center text-blue-800 font-medium">
                        Instructions: {data.map((d: any) => `Color ${d.shape}s ${d.color}`).join('. ')}.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Generate a grid of varied shapes to color */}
                        {Array.from({ length: 8 }).map((_, i) => {
                            const item = data[i % data.length]; // Cycle through targets
                            return (
                                <div key={i} className={`aspect-square border-2 ${item.ring || 'border-slate-200'} rounded-xl flex items-center justify-center bg-white`}>
                                    <div className="text-6xl text-slate-900 drop-shadow-sm opacity-20 filter grayscale">
                                        {/* In real app use SVG, here simplified with emoji but emoji has fixed color...
                                                Ideally we need SVG shapes to color. Using emojis for now but asking user to color OVER them or draw box.
                                                Actually, let's use simple CSS/SVG shapes for coloring tasks.
                                            */}
                                        {item.shape === 'Circle' && <div className="w-16 h-16 rounded-full border-4 border-black" />}
                                        {item.shape === 'Square' && <div className="w-16 h-16 border-4 border-black" />}
                                        {item.shape === 'Triangle' && <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[64px] border-b-black" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Color Recognition (Mixed) */}
            {type === 'mixed' && (
                <div className="grid grid-cols-2 gap-6 mt-8">
                    {(data as any[]).map((item: any, i: number) => (
                        <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2">
                            <div className="text-6xl grayscale opacity-50">{item.icon}</div>
                            <div className="font-bold text-slate-800">{item.name}</div>
                            <div className="mt-2 text-sm px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                Color it <span style={{ color: item.hex }} className="font-bold">{item.color}</span>
                            </div>
                            <div className="w-full h-8 mt-2 border border-slate-200 rounded bg-white" style={{ borderColor: item.hex }}></div>
                        </div>
                    ))}
                </div>
            )}


            {/* Answer Key (Simple) */}
            {showAnswersForDoc(docId, () => (
                <div className="mt-8 text-center text-slate-400 text-sm">
                    Answer Key: Correctly distinguishing shapes and colors is the goal!
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Number Recognition (Enhanced) ---

const NUMBER_DATA: Record<string, { title: string, emoji: string, type: 'find' | 'order' | 'match' | 'trace' | 'id', max: number }> = {
    'find-number-1-10': { title: 'Find the Number (1-10)', emoji: '🔍', type: 'find', max: 10 },
    'number-order-1-20': { title: 'Number Order 1-20', emoji: '🔢', type: 'order', max: 20 },
    'number-matching-1-15': { title: 'Number Matching 1-15', emoji: '🔗', type: 'match', max: 15 },
    'number-tracing-1-10': { title: 'Number Tracing 1-10', emoji: '✏️', type: 'trace', max: 10 },
    'number-id-1-10': { title: 'Number Identification', emoji: '🆔', type: 'id', max: 10 },
};

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];

export function NumberRecognitionWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = NUMBER_DATA[docId] || NUMBER_DATA['find-number-1-10'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);

    // Generate data based on type
    const data = useMemo(() => {
        if (config.type === 'find') {
            const target = Math.floor(rng() * config.max) + 1;
            const grid = Array.from({ length: 20 }).map(() => (rng() > 0.7 ? target : Math.floor(rng() * config.max) + 1));
            // Ensure at least 3 instances of target
            let count = grid.filter(n => n === target).length;
            while (count < 3) { grid[Math.floor(rng() * 20)] = target; count++; }
            return { target, grid };
        }
        if (config.type === 'order') {
            // Sequence of 5 numbers with 2 blanks
            const start = Math.floor(rng() * (config.max - 5)) + 1;
            const sequence = Array.from({ length: 5 }, (_, i) => ({ val: start + i, missing: rng() > 0.5 }));
            // Ensure at least 1 missing, at most 3
            if (sequence.every(s => !s.missing)) sequence[2].missing = true;
            return { sequence };
        }
        if (config.type === 'match') {
            const nums = shuffleArray(Array.from({ length: config.max }, (_, i) => i + 1), rng).slice(0, 5);
            return { pairs: nums.map((n: number) => ({ num: n, word: NUMBER_WORDS[n] })) };
        }
        if (config.type === 'trace') {
            return { numbers: Array.from({ length: 5 }, (_, i) => Math.floor(rng() * config.max) + 1) };
        }
        if (config.type === 'id') {
            // Mix numbers and letters
            const chars = ['A', 'B', 'C', 'X', 'Y', 'Z', 'M', 'P', '1', '2', '3', '4', '5'];
            return {
                grid: Array.from({ length: 15 }, () => {
                    return rng() > 0.5 ? (Math.floor(rng() * 9) + 1).toString() : chars[Math.floor(rng() * chars.length)];
                })
            };
        }
        return {};
    }, [config, rng]);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description="Master your numbers with these fun activities!"
            problemCount={5}
        >
            <PremiumWorksheetBanner
                title="Number Fun"
                subtitle="Math Adventures"
                icons={{ bg1: "1️⃣", bg2: "💯", float1: "#", float2: "🔢" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-400"
                }}
            />

            <div className="mt-8 break-inside-avoid">
                {/* Find Mode */}
                {config.type === 'find' && (
                    <div className="flex flex-col items-center">
                        <div className="text-xl font-bold bg-yellow-100 px-6 py-2 rounded-full border border-yellow-200 mb-6 text-yellow-800 shadow-sm">
                            Find all the <span className="text-3xl mx-2 font-black">{data.target}</span>s!
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {(data.grid as number[]).map((n, i) => (
                                <div key={i} className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-3xl font-bold hover:bg-yellow-50 hover:border-yellow-200 cursor-pointer text-slate-700">
                                    {n}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Mode */}
                {config.type === 'order' && (
                    <div className="flex flex-col gap-8 items-center">
                        <div className="flex gap-2">
                            {(data.sequence as any[]).map((item, i) => (
                                <div key={i} className={`w-14 h-14 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center text-3xl font-bold shadow-sm ${item.missing ? 'border-dashed border-slate-300 bg-slate-50 text-transparent' : 'border-indigo-200 bg-white text-indigo-700'}`}>
                                    {item.missing ? '?' : item.val}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 p-4 border-t-2 border-dashed border-slate-200">
                            <span className="text-slate-400 text-sm font-medium self-center">Cut & Paste:</span>
                            {(data.sequence as any[]).filter((s: any) => s.missing).map((item: any, i: number) => (
                                <div key={i} className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-400 bg-white flex items-center justify-center text-2xl font-bold text-slate-800">
                                    {item.val}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Match Mode */}
                {config.type === 'match' && (
                    <div className="flex justify-between max-w-lg mx-auto w-full relative">
                        <div className="flex flex-col gap-6">
                            {(data.pairs as any[]).map((p: any, i: number) => (
                                <div key={i} className="px-6 py-3 bg-white border-2 border-slate-200 rounded-lg font-bold text-slate-700 text-center shadow-sm">
                                    {p.word}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-6">
                            {shuffleArray([...(data.pairs as any[])], rng).map((p: any, i: number) => (
                                <div key={i} className="w-16 h-[52px] bg-indigo-50 border-2 border-indigo-200 rounded-lg flex items-center justify-center font-bold text-indigo-800 text-2xl shadow-sm">
                                    {p.num}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trace Mode */}
                {config.type === 'trace' && (
                    <div className="flex flex-wrap justify-center gap-8">
                        {(data.numbers as number[]).map((n, i) => (
                            <div key={i} className="w-32 h-32 border-2 border-slate-100 rounded-2xl flex items-center justify-center">
                                <span className="text-9xl font-outline-2 text-transparent bg-clip-text bg-slate-100" style={{ WebkitTextStroke: '2px #cbd5e1' }}>
                                    {n}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ID Mode */}
                {config.type === 'id' && (
                    <div className="text-center">
                        <p className="mb-4 text-slate-500 font-medium">Circle all the numbers!</p>
                        <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
                            {(data.grid as string[]).map((char, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-2xl font-serif text-slate-600">
                                    {char}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-center text-emerald-800 text-sm">
                    Answer Key: Great job learning numbers!
                </div>
            ))}
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
            name: 'Majestic Lion',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Detailed Mane */}
                    <path d="M250 80 Q210 40, 160 80 Q120 60, 100 110 Q60 120, 70 170 Q40 210, 70 250 Q60 300, 100 320 Q120 370, 170 360 Q210 400, 250 370 Q290 400, 330 360 Q380 370, 400 320 Q440 300, 430 250 Q460 210, 430 170 Q440 120, 400 110 Q380 60, 340 80 Q290 40, 250 80 Z" />
                    <path d="M100 110 C80 150, 80 280, 100 320" strokeDasharray="5,5" />
                    <path d="M400 110 C420 150, 420 280, 400 320" strokeDasharray="5,5" />

                    {/* Face Outline */}
                    <path d="M150 150 Q130 250, 160 320 Q250 350, 340 320 Q370 250, 350 150 Q250 110, 150 150" />

                    {/* Ears */}
                    <path d="M150 150 Q130 110, 110 130" />
                    <path d="M350 150 Q370 110, 390 130" />

                    {/* Detailed Eyes */}
                    <path d="M180 200 Q200 190, 220 200" />
                    <circle cx="200" cy="205" r="5" fill="#000" />
                    <path d="M280 200 Q300 190, 320 200" />
                    <circle cx="300" cy="205" r="5" fill="#000" />

                    {/* Nose */}
                    <path d="M230 250 Q250 240, 270 250 L250 280 Z" fill="#000" />

                    {/* Mouth & Whiskers */}
                    <path d="M250 280 Q230 300, 210 280" />
                    <path d="M250 280 Q270 300, 290 280" />

                    <path d="M180 260 L140 250 M180 270 L140 275 M180 280 L140 290" />
                    <path d="M320 260 L360 250 M320 270 L360 275 M320 280 L360 290" />

                    {/* Fur Details */}
                    <path d="M250 370 L250 450 M220 450 L280 450" />
                    <path d="M170 360 L150 420 M330 360 L350 420" />
                </g>
            )
        },
        {
            name: 'Wise Owl',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Detailed Tree */}
                    <path d="M0 450 Q100 440, 150 400 Q200 380, 350 400 Q450 410, 500 380" strokeWidth="12" />
                    <path d="M350 400 Q400 350, 420 300" strokeWidth="8" />

                    {/* Owl Body */}
                    <path d="M200 200 Q150 250, 180 380 Q250 410, 320 380 Q350 250, 300 200" />
                    <path d="M200 200 Q250 180, 300 200" /> {/* Head top */}

                    {/* Wings with Feathers */}
                    <path d="M180 240 Q150 300, 180 350" />
                    <path d="M180 240 Q170 270, 180 290 M175 260 Q165 290, 175 310" />
                    <path d="M320 240 Q350 300, 320 350" />
                    <path d="M320 240 Q330 270, 320 290 M325 260 Q335 290, 325 310" />

                    {/* Face */}
                    <circle cx="225" cy="240" r="25" />
                    <circle cx="275" cy="240" r="25" />
                    <circle cx="225" cy="240" r="8" fill="#000" />
                    <circle cx="275" cy="240" r="8" fill="#000" />
                    <path d="M240 260 L260 260 L250 280 Z" fill="#000" />

                    {/* Chest Feathers */}
                    <path d="M210 300 Q225 310, 240 300 M260 300 Q275 310, 290 300" />
                    <path d="M220 320 Q235 330, 250 320 M270 320 Q285 330, 300 320" />
                    <path d="M230 340 Q245 350, 260 340" />

                    {/* Leaves */}
                    <path d="M420 300 Q400 280, 420 260 Q440 280, 420 300" />
                    <path d="M420 300 Q440 320, 460 300 Q440 280, 420 300" />
                </g>
            )
        },
        {
            name: 'Playful Elephant',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Head & Trunk */}
                    <path d="M180 150 Q140 100, 240 100 Q300 100, 320 150" />
                    <path d="M180 150 Q160 250, 180 300" /> {/* Left face */}
                    <path d="M320 150 Q340 250, 320 280" /> {/* Right face */}

                    <path d="M220 250 Q200 280, 210 330 Q220 360, 250 350 Q260 340, 250 330 Q230 330, 230 280" /> {/* Trunk */}

                    {/* Ears */}
                    <path d="M180 150 Q100 120, 120 250 Q160 280, 180 220" />
                    <path d="M320 150 Q400 120, 380 250 Q340 280, 320 220" />

                    {/* Body */}
                    <path d="M160 300 Q100 350, 120 450 L380 450 Q400 350, 340 300" />

                    {/* Legs */}
                    <path d="M180 450 L180 400 Q200 390, 220 400 L220 450" />
                    <path d="M280 450 L280 400 Q300 390, 320 400 L320 450" />

                    {/* Eyes */}
                    <path d="M200 180 Q215 170, 230 180" />
                    <circle cx="215" cy="185" r="4" fill="#000" />
                    <path d="M270 180 Q285 170, 300 180" />
                    <circle cx="285" cy="185" r="4" fill="#000" />

                    {/* Water Splash */}
                    <path d="M250 350 Q240 380, 220 390" strokeDasharray="2,4" />
                    <path d="M250 350 Q260 380, 280 390" strokeDasharray="2,4" />
                    <circle cx="250" cy="370" r="2" fill="#3b82f6" stroke="none" />
                    <circle cx="230" cy="380" r="3" fill="#3b82f6" stroke="none" />
                </g>
            )
        },
        {
            name: 'Happy Dog',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Head */}
                    <path d="M250 120 Q180 120, 180 200 Q180 280, 250 300 Q320 280, 320 200 Q320 120, 250 120" />

                    {/* Ears (Floppy) */}
                    <path d="M190 150 Q140 140, 140 200 Q150 240, 180 210" />
                    <path d="M310 150 Q360 140, 360 200 Q350 240, 320 210" />

                    {/* Face */}
                    <ellipse cx="230" cy="190" rx="8" ry="12" fill="#000" />
                    <ellipse cx="270" cy="190" rx="8" ry="12" fill="#000" />
                    <path d="M250 230 L240 220 L260 220 Z" fill="#000" />
                    <path d="M250 230 Q230 250, 210 230" />
                    <path d="M250 230 Q270 250, 290 230" />
                    <path d="M250 240 Q250 280, 250 290" strokeWidth="4" stroke="pink" /> {/* Tongue */}

                    {/* Body */}
                    <path d="M210 300 Q180 350, 160 450 L340 450 Q320 350, 290 300" />

                    {/* Collar */}
                    <path d="M200 300 Q250 320, 300 300" strokeWidth="4" />
                    <circle cx="250" cy="310" r="8" />

                    {/* Tail */}
                    <path d="M320 380 Q360 350, 350 320 Q330 330, 320 360" />
                </g>
            )
        }
    ],
    // Nature Theme (Detailed)
    nature: [
        {
            name: 'Forest Scene',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Mountains */}
                    <path d="M50 350 L150 150 L250 350" />
                    <path d="M200 350 L350 100 L500 350" />
                    <path d="M125 200 L150 230 L175 200" /> {/* Snow */}
                    <path d="M310 160 L350 200 L390 160" /> {/* Snow */}

                    {/* Trees */}
                    <path d="M50 450 L50 380 M20 450 L50 380 L80 450" />
                    <path d="M450 450 L450 380 M420 450 L450 380 L480 450" />

                    {/* Sun */}
                    <circle cx="400" cy="80" r="30" />
                    <path d="M400 40 L400 20 M440 80 L460 80 M400 120 L400 140 M360 80 L340 80" />

                    {/* Clouds */}
                    <path d="M100 100 Q120 80, 140 100 Q160 80, 180 100 L100 100" />

                    {/* Stream */}
                    <path d="M200 350 Q250 400, 200 450 Q150 500, 250 500" strokeWidth="2" />
                    <path d="M220 360 Q270 410, 220 460" strokeWidth="1" />
                </g>
            )
        }
    ],
    // Space Theme (Detailed)
    space: [
        {
            name: 'Space Explorer',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Rocket Detail */}
                    <path d="M220 350 L220 150 Q250 80, 280 150 L280 350" />
                    <path d="M220 350 Q250 360, 280 350" />
                    <circle cx="250" cy="200" r="20" />
                    <circle cx="250" cy="200" r="15" />
                    <path d="M220 320 L180 380 L220 360" /> {/* Left Fin */}
                    <path d="M280 320 L320 380 L280 360" /> {/* Right Fin */}
                    <path d="M250 360 L240 380 L260 380 Z" /> {/* Engine */}

                    {/* Flames */}
                    <path d="M240 380 Q250 420, 260 380" />
                    <path d="M245 380 Q250 400, 255 380" />

                    {/* Planet Saturn-like */}
                    <circle cx="100" cy="120" r="30" />
                    <ellipse cx="100" cy="120" rx="50" ry="10" transform="rotate(-20 100 120)" />

                    {/* Stars */}
                    <path d="M400 100 L405 90 L410 100 L420 105 L410 110 L405 120 L400 110 L390 105 Z" />
                    <circle cx="50" cy="300" r="2" fill=" #000" />
                    <circle cx="450" cy="400" r="3" fill="#000" />
                </g>
            )
        }
    ],
    // Vehicles Theme (Detailed)
    vehicles: [
        {
            name: 'Off-Road Truck',
            viewBox: '0 0 500 500',
            path: (
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* Body */}
                    <path d="M100 300 L100 240 L160 200 L280 200 L280 240 L380 240 L380 300" />
                    <path d="M100 300 L380 300" />

                    {/* Windows */}
                    <path d="M170 210 L270 210 L270 240 L165 240 Z" />
                    <line x1="220" y1="210" x2="220" y2="240" />

                    {/* Wheels (Big) */}
                    <circle cx="140" cy="300" r="40" />
                    <circle cx="140" cy="300" r="25" />
                    <circle cx="140" cy="300" r="10" />
                    <circle cx="340" cy="300" r="40" />
                    <circle cx="340" cy="300" r="25" />
                    <circle cx="340" cy="300" r="10" />

                    {/* Ground */}
                    <path d="M50 340 L100 340 M180 340 L300 340 M380 340 L450 340" strokeWidth="3" />
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

// --- Color By Number ---
export function ColorByNumberWorksheet({ docId, seed, variant }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Color by Number: Mystery Picture"
            emoji="🎨"
            description="Use the code key to color the picture and reveal the hidden image!"
            problemCount={1}
            learningObjectives={['Number recognition', 'Color word recognition', 'Fine motor skills', 'Following specific instructions']}
        >
            <div className="flex flex-col items-center gap-6 break-inside-avoid">
                <div className="flex gap-4 mb-4 flex-wrap justify-center">
                    {[
                        { num: 1, color: 'Red', hex: '#ef4444' },
                        { num: 2, color: 'Blue', hex: '#3b82f6' },
                        { num: 3, color: 'Yellow', hex: '#eab308' },
                        { num: 4, color: 'Green', hex: '#22c55e' }
                    ].map(k => (
                        <div key={k.num} className="flex items-center gap-2 border px-3 py-1 rounded-full bg-slate-50">
                            <span className="font-bold text-slate-900">{k.num}</span>
                            <span>=</span>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: k.hex }} />
                            <span className="text-sm font-medium text-slate-600">{k.color}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-lg aspect-square border-4 border-slate-900 bg-white relative">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                        <g fill="none" stroke="#000" strokeWidth="2">
                            {/* Sun (Yellow/3) */}
                            <circle cx="60" cy="60" r="30" />
                            <text x="60" y="65" textAnchor="middle" fontSize="20" stroke="none" fill="#000">3</text>

                            {/* Sky (Blue/2) */}
                            <path d="M0 0 L400 0 L400 300 L0 300 Z" stroke="none" fill="none" />
                            <text x="200" y="100" textAnchor="middle" fontSize="20" stroke="none" fill="#000">2</text>
                            <text x="350" y="50" textAnchor="middle" fontSize="20" stroke="none" fill="#000">2</text>

                            {/* Hills (Green/4) */}
                            <path d="M0 300 Q100 250, 200 300 T400 300 L400 400 L0 400 Z" />
                            <text x="100" y="350" textAnchor="middle" fontSize="20" stroke="none" fill="#000">4</text>
                            <text x="300" y="350" textAnchor="middle" fontSize="20" stroke="none" fill="#000">4</text>

                            {/* House (Red/1) */}
                            <path d="M220 320 L220 250 L280 200 L340 250 L340 320 Z" />
                            <text x="280" y="280" textAnchor="middle" fontSize="20" stroke="none" fill="#000">1</text>
                        </g>
                    </svg>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

// --- Design A Monster ---
export function DesignMonsterWorksheet({ docId, seed, variant }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Design a Monster!"
            emoji="👾"
            description="Use your imagination to draw a friendly (or scary!) monster. Give it eyes, mouths, and arms!"
            problemCount={1}
            learningObjectives={['Creative expression', 'Drawing body parts', 'Descriptive adjectives', 'Fine motor skills']}
        >
            <div className="flex flex-col items-center gap-6 break-inside-avoid">
                <div className="w-full h-96 border-4 border-dashed border-purple-300 rounded-xl bg-purple-50 flex items-center justify-center relative p-8">
                    <span className="absolute top-4 left-4 text-purple-200 text-6xl opacity-30">⚡</span>
                    <span className="absolute bottom-4 right-4 text-purple-200 text-6xl opacity-30">🎈</span>

                    <div className="text-center text-purple-400 font-bold text-xl border-dashed border-2 border-purple-200 p-8 rounded-lg">
                        Draw your Monster Here!
                    </div>
                </div>

                <div className="w-full border-t-2 border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-700 mb-4">My Monster's Stats:</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <span>Name:</span>
                            <div className="border-b-2 border-slate-300 flex-1 h-8"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Superpower:</span>
                            <div className="border-b-2 border-slate-300 flex-1 h-8"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Number of Eyes:</span>
                            <div className="border-b-2 border-slate-300 flex-1 h-8"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Favorite Food:</span>
                            <div className="border-b-2 border-slate-300 flex-1 h-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

// --- Draw Half ---
export function DrawHalfWorksheet({ docId, seed, variant }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Finish the Picture (Symmetry)"
            emoji="🦋"
            description="Use the grid to draw the missing half of the picture. Try to make it look exactly like the other side!"
            problemCount={1}
            learningObjectives={['Spatial reasoning', 'Understanding symmetry', 'Counting grid units', 'Fine motor control']}
        >
            <div className="flex justify-center break-inside-avoid">
                <div className="relative w-full max-w-lg aspect-square border-4 border-slate-900 bg-white">
                    {/* Grid */}
                    <svg viewBox="0 0 20 20" className="w-full h-full opacity-20 pointer-events-none absolute top-0 left-0">
                        <pattern id="grid" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
                            <rect width="1" height="1" fill="none" stroke="#000" strokeWidth="0.05" />
                        </pattern>
                        <rect width="20" height="20" fill="url(#grid)" />
                    </svg>

                    {/* The Drawing (Butterfly Half) */}
                    <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                        {/* Left Side (Visible) */}
                        <g fill="none" stroke="#000" strokeWidth="2">
                            <path d="M100 20 Q60 10, 50 60 Q20 80, 50 110 Q40 160, 100 180" /> {/* Wing */}
                            <path d="M100 40 Q80 40, 80 100 Q80 160, 100 160" /> {/* Body Left */}
                            <line x1="100" y1="20" x2="100" y2="180" strokeDasharray="5,5" strokeWidth="1" /> {/* Center Line */}
                        </g>

                        {/* Right Side (Faint Guide) */}
                        <path d="M100 20 Q140 10, 150 60 Q180 80, 150 110 Q160 160, 100 180" fill="none" stroke="#ddd" strokeWidth="2" strokeDasharray="2,2" />
                    </svg>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

// --- Bookmark Templates ---
export function BookmarkTemplates({ docId, seed }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="DIY Bookmarks"
            emoji="🔖"
            description="Color, cut, and create your own bookmarks!"
            problemCount={4}
            learningObjectives={['Reading encouragement', 'Creativity and design', 'Fine motor skills', 'Personal expression']}
        >
            <div className="flex justify-around items-stretch h-[600px] break-inside-avoid gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 border-4 border-dashed border-slate-300 rounded-full flex flex-col items-center p-4 relative bg-white">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-900 absolute top-4"></div>

                        {i === 1 && <div className="mt-12 text-center font-bold text-2xl rotate-90 origin-center translate-y-32 whitespace-nowrap">READ MORE!</div>}
                        {i === 1 && <div className="absolute bottom-12 text-4xl">📚</div>}

                        {i === 2 && <div className="mt-12 flex flex-col gap-4 items-center">
                            {[...Array(5)].map((_, idx) => <div key={idx} className="text-2xl">⭐</div>)}
                        </div>}

                        {i === 3 && <div className="mt-20 w-full flex flex-col gap-8 opacity-30 px-2">
                            {[...Array(6)].map((_, idx) => <div key={idx} className="border-b-2 border-black w-full"></div>)}
                        </div>}

                        {i === 4 && (
                            <>
                                <div className="mt-12 text-center text-lg font-bold">Ex Libris:</div>
                                <div className="mt-4 border-b-2 border-black w-3/4"></div>
                            </>
                        )}

                        <div className="absolute bottom-1 w-full text-center text-[10px] text-slate-400">Cut Here</div>
                    </div>
                ))}
            </div>
        </WorksheetSectionWrapper>
    )
}

// --- Hidden Object ---
export function HiddenObjectWorksheet({ docId }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Hidden Picture Puzzle"
            emoji="🔍"
            description="Can you find the hidden objects in the garden? Circle them when you find them!"
            problemCount={4}
            learningObjectives={['Visual discrimination', 'Attention to detail', 'Figure-ground perception', 'Patience']}
        >
            <div className="flex flex-col gap-6 break-inside-avoid">
                {/* Legend */}
                <div className="flex justify-center gap-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">✏️</span>
                        <span className="text-xs font-semibold text-slate-600">Pencil</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🗝️</span>
                        <span className="text-xs font-semibold text-slate-600">Key</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🍕</span>
                        <span className="text-xs font-semibold text-slate-600">Pizza</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🎈</span>
                        <span className="text-xs font-semibold text-slate-600">Balloon</span>
                    </div>
                </div>

                {/* Puzzle Scene */}
                <div className="w-full relative rounded-xl border-4 border-slate-900 overflow-hidden bg-white shadow-lg">
                    {/* Background Image */}
                    <img
                        src="/images/hidden-puzzle-garden.png"
                        alt="Hidden Picture Garden Scene"
                        className="w-full h-auto object-cover grayscale opacity-90 block"
                    />

                    {/* Hidden Objects - Overlays */}
                    {/* Pencil - Hidden near bushes bottom left */}
                    <div className="absolute top-[82%] left-[12%] w-[4%] opacity-80 rotate-45 mix-blend-multiply print:mix-blend-normal">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-700">
                            <path d="M20 80 L80 20 L90 30 L30 90 Z M20 80 L10 90 L30 90 Z" />
                        </svg>
                    </div>

                    {/* Key - Hidden near bench leg right */}
                    <div className="absolute top-[65%] left-[78%] w-[3%] opacity-70 -rotate-12 mix-blend-multiply print:mix-blend-normal">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-800">
                            <path d="M70 20 A20 20 0 1 0 50 40 L50 80 L70 80 L70 70 L60 70 L60 40 L70 40 A20 20 0 0 0 70 20 Z M70 30 A10 10 0 1 1 70 30" />
                        </svg>
                    </div>

                    {/* Pizza - Hidden in flower foliage top right */}
                    <div className="absolute top-[15%] left-[85%] w-[4%] opacity-60 rotate-[120deg] mix-blend-multiply print:mix-blend-normal">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-700">
                            <path d="M50 10 L90 90 L10 90 Z" />
                            <circle cx="45" cy="50" r="5" fill="#fff" />
                            <circle cx="55" cy="70" r="5" fill="#fff" />
                            <circle cx="35" cy="75" r="5" fill="#fff" />
                        </svg>
                    </div>

                    {/* Balloon - Hidden near path stones middle */}
                    <div className="absolute top-[55%] left-[45%] w-[3.5%] opacity-70 rotate-12 mix-blend-multiply print:mix-blend-normal">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-800">
                            <path d="M50 10 C30 10 15 30 15 50 C15 70 50 90 50 90 C50 90 85 70 85 50 C85 30 70 10 50 10 Z M50 90 L50 100" stroke="currentColor" strokeWidth="5" />
                        </svg>
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    )
}

// --- Maze Focus ---
export function MazeFocusWorksheet({ docId, seed }: SpecificWorksheetProps) {
    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Maze Runner"
            emoji="🌀"
            description="Help the character find their way to the goal! Stay inside the lines."
            problemCount={1}
            learningObjectives={['Fine motor control', 'Spatial planning', 'Problem solving', 'Hand-eye coordination']}
        >
            <div className="flex justify-center p-4 break-inside-avoid">
                <div className="w-full max-w-2xl relative">
                    <div className="absolute top-0 left-0 -translate-x-full pr-4 text-4xl">🐹</div>
                    <div className="absolute bottom-0 right-0 translate-x-full pl-4 text-4xl">🧀</div>

                    <svg viewBox="0 0 400 400" className="w-full h-auto border-4 border-slate-900 bg-white">
                        <defs>
                            <pattern id="mazePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 0 L40 0 L40 40" fill="none" stroke="#000" strokeWidth="2" />
                            </pattern>
                        </defs>
                        <g fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round">
                            <path d="M20 20 L380 20 L380 380 L20 380 L20 60 L340 60 L340 340 L60 340 L60 100 L300 100 L300 300 L100 300 L100 140 L260 140 L260 260 L140 260 L140 180 L220 180" />
                        </g>
                    </svg>
                </div>
            </div>
        </WorksheetSectionWrapper>
    )
}

export function DotToDot1to20({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'dot-to-dot-1-20';
    const { t } = useTranslation();

    // Simple mock dot-to-dot points (star shape)
    const points = [
        { x: 50, y: 10, l: 1 }, { x: 60, y: 40, l: 2 }, { x: 90, y: 40, l: 3 }, { x: 65, y: 60, l: 4 },
        { x: 75, y: 90, l: 5 }, { x: 50, y: 70, l: 6 }, { x: 25, y: 90, l: 7 }, { x: 35, y: 60, l: 8 },
        { x: 10, y: 40, l: 9 }, { x: 40, y: 40, l: 10 }
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t('worksheets.dot-to-dot-1-20.title') || 'Connect the Dots (1-20)'}
            emoji="✏️"
            description="Connect the numbers in order to reveal the picture!"
            problemCount={1}
            learningObjectives={['Count from 1 to 20', 'Motor control', 'Number sequencing']}
        >
            <PremiumWorksheetBanner
                title="Dot-to-Dot Discovery"
                subtitle="Connect & Create"
                icons={{ bg1: "✏️", bg2: "🌟", float1: "1️⃣", float2: "2️⃣" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-400"
                }}
            />

            <div className="bg-white p-8 rounded-xl border-2 border-indigo-100 shadow-sm mt-8 flex justify-center break-inside-avoid">
                <svg viewBox="0 0 100 100" className="w-full max-w-md border border-slate-100 rounded bg-slate-50/50">
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle cx={p.x} cy={p.y} r="1.5" fill="#333" />
                            <text x={p.x + 2} y={p.y} fontSize="4" fill="#666">{p.l}</text>
                        </g>
                    ))}
                </svg>
            </div>
        </WorksheetSectionWrapper>
    );
}

export function AnimalPack({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'animal-pack';
    const { getTrans } = useWorksheetTranslation(docId);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Animal Activity Pack')}
            emoji="🦁"
            description={getTrans('description', 'Learn about animals through tracing, matching, and coloring.')}
            problemCount={4}
            learningObjectives={['Animal recognition', 'Writing skills', 'Visual discrimination']}
        >
            <PremiumWorksheetBanner
                title="Zoo Adventures"
                subtitle="Learning Pack"
                icons={{ bg1: "🦁", bg2: "🦓", float1: "🦒", float2: "🐘" }}
                colors={{
                    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
                    border: "border-green-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-green-300",
                    pillText: "text-green-900",
                    accent: "text-emerald-600"
                }}
            />

            {/* Tracing Section */}
            <div className="mt-8 mb-8 p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4">Trace the animal names:</h3>
                <div className="grid grid-cols-2 gap-8">
                    {['LION', 'ZEBRA', 'BEAR', 'FROG'].map(animal => (
                        <div key={animal} className="flex flex-col gap-2">
                            <div className="h-16 border-b border-dashed border-slate-300 relative flex items-end pb-2">
                                <span className="font-mono text-4xl text-slate-200 tracking-[0.2em]">{animal}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Matching Section Placeholder */}
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-bold text-green-800 mb-4">Draw a line to match:</h3>
                <div className="flex justify-between px-8">
                    <div className="flex flex-col gap-8">
                        <div className="p-2 bg-white rounded shadow-sm">🐶</div>
                        <div className="p-2 bg-white rounded shadow-sm">🐱</div>
                        <div className="p-2 bg-white rounded shadow-sm">🐦</div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="p-2 bg-white rounded shadow-sm">Bird</div>
                        <div className="p-2 bg-white rounded shadow-sm">Dog</div>
                        <div className="p-2 bg-white rounded shadow-sm">Cat</div>
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}


// --- Colorable Icon for Counting Worksheets ---
const ColorableIcon = ({ icon, size = 32, colorMode = false }: { icon: string, size?: number, colorMode?: boolean }) => {
    const strokeWidth = colorMode ? 0 : 2.5;

    // Return an SVG outline/colored version for specific emojis
    const icons: Record<string, React.ReactNode> = {
        '🍎': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 25 C60 15 90 25 90 55 C90 85 50 95 50 95 C50 95 10 85 10 55 C10 25 40 15 50 25Z" fill={colorMode ? "#ef4444" : "none"} />
                <path d="M50 25 L50 15" stroke={colorMode ? "#b91c1c" : "currentColor"} />
                <path d="M50 15 Q60 5 70 15" stroke={colorMode ? "#15803d" : "currentColor"} fill={colorMode ? "#22c55e" : "none"} />
            </svg>
        ),
        '⭐️': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 5 L63 38 L95 38 L69 57 L79 90 L50 70 L21 90 L31 57 L5 38 L37 38 Z" fill={colorMode ? "#eab308" : "none"} stroke={colorMode ? "#ca8a04" : "currentColor"} />
            </svg>
        ),
        '🌸': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 30 Q60 10 70 30 T90 50 T70 70 T50 90 T30 70 T10 50 T30 30 T50 30" fill={colorMode ? "#f472b6" : "none"} stroke={colorMode ? "#db2777" : "currentColor"} />
                <circle cx="50" cy="50" r="10" fill={colorMode ? "#fbbf24" : "none"} stroke={colorMode ? "#d97706" : "currentColor"} />
            </svg>
        ),
        '🦋': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 40 Q30 15 15 40 Q15 60 40 65 Q40 90 50 85 Q60 90 60 65 Q85 60 85 40 Q70 15 50 40" fill={colorMode ? "#60a5fa" : "none"} stroke={colorMode ? "#2563eb" : "currentColor"} />
                <path d="M50 30 L50 80" stroke={colorMode ? "#1e40af" : "currentColor"} />
            </svg>
        ),
        '🎈': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <ellipse cx="50" cy="40" rx="30" ry="38" fill={colorMode ? "#f87171" : "none"} stroke={colorMode ? "#dc2626" : "currentColor"} />
                <path d="M50 78 L45 83 L55 83 Z" fill={colorMode ? "#dc2626" : "none"} />
                <path d="M50 83 Q45 90 50 100" />
            </svg>
        ),
        '🍪': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <circle cx="50" cy="50" r="42" fill={colorMode ? "#d97706" : "none"} stroke={colorMode ? "#92400e" : "currentColor"} />
                <circle cx="35" cy="35" r="4" fill={colorMode ? "#451a03" : "currentColor"} />
                <circle cx="65" cy="45" r="4" fill={colorMode ? "#451a03" : "currentColor"} />
                <circle cx="45" cy="65" r="4" fill={colorMode ? "#451a03" : "currentColor"} />
                <circle cx="55" cy="70" r="4" fill={colorMode ? "#451a03" : "currentColor"} />
                <circle cx="50" cy="30" r="4" fill={colorMode ? "#451a03" : "currentColor"} />
            </svg>
        ),
        '🧸': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <circle cx="50" cy="60" r="32" fill={colorMode ? "#b45309" : "none"} stroke={colorMode ? "#78350f" : "currentColor"} />
                <circle cx="28" cy="32" r="14" fill={colorMode ? "#b45309" : "none"} stroke={colorMode ? "#78350f" : "currentColor"} />
                <circle cx="72" cy="32" r="14" fill={colorMode ? "#b45309" : "none"} stroke={colorMode ? "#78350f" : "currentColor"} />
                <circle cx="50" cy="65" r="10" fill={colorMode ? "#fde68a" : "none"} />
                <circle cx="40" cy="52" r="3.5" fill={colorMode ? "#000" : "currentColor"} />
                <circle cx="60" cy="52" r="3.5" fill={colorMode ? "#000" : "currentColor"} />
            </svg>
        ),
        '🚗': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M10 70 L90 70 L85 50 L65 50 L55 30 L25 30 L15 50 L10 50 Z" fill={colorMode ? "#ef4444" : "none"} stroke={colorMode ? "#991b1b" : "currentColor"} />
                <circle cx="25" cy="70" r="8" fill={colorMode ? "#333" : "none"} stroke={colorMode ? "#000" : "currentColor"} />
                <circle cx="75" cy="70" r="8" fill={colorMode ? "#333" : "none"} stroke={colorMode ? "#000" : "currentColor"} />
            </svg>
        ),
        '⚽️': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <circle cx="50" cy="50" r="42" fill={colorMode ? "#fff" : "none"} stroke={colorMode ? "#000" : "currentColor"} />
                <path d="M50 30 L65 40 L60 55 L40 55 L35 40 Z" fill={colorMode ? "#333" : "currentColor"} opacity={colorMode ? "1" : "0.1"} />
                <line x1="50" y1="30" x2="50" y2="8" stroke={colorMode ? "#000" : "currentColor"} />
                <line x1="65" y1="40" x2="85" y2="35" stroke={colorMode ? "#000" : "currentColor"} />
                <line x1="60" y1="55" x2="80" y2="75" stroke={colorMode ? "#000" : "currentColor"} />
                <line x1="40" y1="55" x2="20" y2="75" stroke={colorMode ? "#000" : "currentColor"} />
                <line x1="35" y1="40" x2="15" y2="35" stroke={colorMode ? "#000" : "currentColor"} />
            </svg>
        ),
        '🍦': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 95 L25 45 L75 45 Z" fill={colorMode ? "#fcd34d" : "none"} stroke={colorMode ? "#d97706" : "currentColor"} />
                <circle cx="50" cy="35" r="25" fill={colorMode ? "#fecaca" : "none"} stroke={colorMode ? "#f87171" : "currentColor"} />
                <circle cx="50" cy="15" r="5" fill={colorMode ? "#ef4444" : "none"} />
            </svg>
        ),
        '🚀': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 10 Q70 50 70 80 L30 80 Q30 50 50 10" fill={colorMode ? "#e5e7eb" : "none"} stroke={colorMode ? "#374151" : "currentColor"} />
                <path d="M30 80 L20 95 L30 90 Z" fill={colorMode ? "#ef4444" : "none"} />
                <path d="M70 80 L80 95 L70 90 Z" fill={colorMode ? "#ef4444" : "none"} />
                <circle cx="50" cy="45" r="8" fill={colorMode ? "#3b82f6" : "none"} stroke={colorMode ? "#1e40af" : "currentColor"} />
            </svg>
        ),
        '🐝': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <ellipse cx="50" cy="55" rx="25" ry="18" fill={colorMode ? "#eab308" : "none"} stroke={colorMode ? "#000" : "currentColor"} />
                <path d="M40 37 L30 20 M60 37 L70 20" stroke={colorMode ? "#000" : "currentColor"} />
                <circle cx="65" cy="50" r="2" fill="#000" />
                <path d="M42 40 Q50 35 58 40" stroke={colorMode ? "#000" : "currentColor"} />
            </svg>
        ),
        '🐟': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M10 50 Q30 20 70 40 L90 20 L90 80 L70 60 Q30 80 10 50" fill={colorMode ? "#60a5fa" : "none"} stroke={colorMode ? "#1e40af" : "currentColor"} />
                <circle cx="25" cy="45" r="3" fill="#000" />
            </svg>
        ),
        '🍓': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M50 90 Q15 80 15 45 Q15 20 50 20 Q85 20 85 45 Q85 80 50 90" fill={colorMode ? "#ef4444" : "none"} stroke={colorMode ? "#991b1b" : "currentColor"} />
                <path d="M50 20 L40 10 M50 20 L60 10 M50 20 L50 5" stroke={colorMode ? "#15803d" : "currentColor"} strokeWidth="4" />
                <circle cx="35" cy="40" r="1.5" fill={colorMode ? "#fde68a" : "#000"} />
                <circle cx="65" cy="45" r="1.5" fill={colorMode ? "#fde68a" : "#000"} />
                <circle cx="50" cy="65" r="1.5" fill={colorMode ? "#fde68a" : "#000"} />
            </svg>
        ),
        '🍉': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M10 40 Q50 95 90 40 Z" fill={colorMode ? "#f87171" : "none"} stroke={colorMode ? "#15803d" : "currentColor"} strokeWidth="5" />
                <circle cx="35" cy="55" r="2" fill="#000" />
                <circle cx="50" cy="65" r="2" fill="#000" />
                <circle cx="65" cy="55" r="2" fill="#000" />
            </svg>
        ),
        '🍄': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M35 85 L65 85 L60 55 L40 55 Z" fill={colorMode ? "#f3f4f6" : "none"} stroke={colorMode ? "#9ca3af" : "currentColor"} />
                <path d="M10 55 Q50 10 90 55 Z" fill={colorMode ? "#ef4444" : "none"} stroke={colorMode ? "#991b1b" : "currentColor"} />
                <circle cx="35" cy="35" r="5" fill={colorMode ? "#fff" : "none"} />
                <circle cx="65" cy="40" r="4" fill={colorMode ? "#fff" : "none"} />
                <circle cx="50" cy="25" r="3" fill={colorMode ? "#fff" : "none"} />
            </svg>
        ),
        '🦒': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <path d="M40 90 L40 40 Q40 20 60 20 L75 20 L75 35 Q60 35 60 55 L60 90" fill={colorMode ? "#fbbf24" : "none"} stroke={colorMode ? "#b45309" : "currentColor"} />
                <circle cx="70" cy="25" r="2" fill="#000" />
                <path d="M60 35 L50 45 L60 55" fill={colorMode ? "#b45309" : "none"} />
            </svg>
        ),
        '🦀': (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
                <circle cx="50" cy="60" r="25" fill={colorMode ? "#ef4444" : "none"} stroke={colorMode ? "#991b1b" : "currentColor"} />
                <path d="M25 60 L10 50 M25 70 L10 80 M75 60 L90 50 M75 70 L90 80" stroke={colorMode ? "#ef4444" : "currentColor"} strokeWidth="5" />
                <path d="M35 40 Q30 20 45 40 M65 40 Q70 20 55 40" stroke={colorMode ? "#ef4444" : "currentColor"} strokeWidth="5" />
            </svg>
        )
    };

    return icons[icon] || <span style={{ fontSize: `${size * 0.8}px` }}>{icon}</span>;
}

// --- Counting Worksheets (New Implementation) ---


const COUNTING_DATA: Record<string, { title: string, emoji: string, max: number, type: 'color' | 'write' | 'match' | 'circle' }> = {
    'count-color-1-10': { title: 'Count & Color (1-10)', emoji: '🖍️', max: 10, type: 'color' },
    'how-many-1-15': { title: 'How Many? (1-15)', emoji: '🔢', max: 15, type: 'write' },
    'count-match-1-20': { title: 'Count & Match (1-20)', emoji: '🔗', max: 20, type: 'match' },
    'count-circle-1-10': { title: 'Count & Circle (1-10)', emoji: '⭕', max: 10, type: 'circle' },
    'counting-objects-20': { title: 'Counting Objects to 20', emoji: '🧸', max: 20, type: 'circle' },
};

export function CountingWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const config = COUNTING_DATA[docId] || COUNTING_DATA['count-color-1-10'];

    const items = ['🍎', '⭐️', '🌸', '🦋', '🎈', '🍪', '🧸', '🚗', '⚽️', '🍦', '🚀', '🐝', '🐟', '🍓', '🍉', '🍄', '🦒', '🦀'];

    // Generate problems
    const { problems, shuffledNumbers } = useMemo(() => {
        const problemCount = config.type === 'match' ? 6 : config.type === 'color' ? 6 : 9;

        // Pick unique icons for each problem
        const shuffledItems = shuffleArray([...items], rng);

        const probs = Array.from({ length: problemCount }).map((_, i) => {
            const count = Math.floor(rng() * config.max) + 1;
            const icon = shuffledItems[i % shuffledItems.length] || '⭐️';

            // For 'circle' type, generate options
            let options: number[] = [];
            if (config.type === 'circle') {
                const dist1 = Math.max(1, count + Math.floor(rng() * 3) - 1);
                const dist2 = Math.max(1, count + Math.floor(rng() * 5) - 2);
                options = shuffleArray([...new Set([count, dist1, dist2])].slice(0, 3), rng).sort((a, b) => a - b);
                // Ensure correct answer is in options if distinct failed
                if (!options.includes(count)) {
                    if (options.length < 3) options.push(count);
                    else options[0] = count;
                }
                options.sort((a, b) => a - b);
            }

            return {
                id: i,
                count,
                icon,
                options
            };
        });

        // For matching, we need a shuffled list of the counts
        let shuffled = config.type === 'match' ? shuffleArray(probs.map(p => p.count), makeRng(`${seed}-${docId}-${variant}-shuffle`)) : [];

        // Extra check: If by some miracle (or bug) the shuffle is identical to the original order,
        // we force a shuffle by reversing or shifting, as it defeats the purpose for a kid's worksheet.
        if (config.type === 'match' && shuffled.length > 1 && shuffled.every((num, idx) => num === probs[idx].count)) {
            shuffled = [...shuffled].reverse();
        }

        return { problems: probs, shuffledNumbers: shuffled };
    }, [config, rng, seed, docId, variant]);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, config.title)}
            emoji={config.emoji}
            description={t(`worksheets.${docId}.description`, `Practice counting numbers up to ${config.max}.`)}
            problemCount={config.type === 'match' || config.type === 'color' ? 6 : 9}
        >
            <PremiumWorksheetBanner
                title={config.title}
                subtitle="Counting Adventures"
                icons={{ bg1: "🍎", bg2: "🎡", float1: "🧸", float2: "🧩" }}
                colors={{
                    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                    border: "border-amber-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-amber-300",
                    pillText: "text-amber-900",
                    accent: "text-amber-400"
                }}
            />

            {/* Match Layout */}
            {config.type === 'match' ? (
                <div className="flex justify-between gap-12 mt-8 max-w-2xl mx-auto">
                    {/* Left Column: Groups */}
                    <div className="flex-1 flex flex-col gap-6">
                        {problems.map((p: any) => (
                            <div key={p.id} className="relative border-2 border-slate-200 rounded-xl p-3 bg-white shadow-sm h-32 flex items-center justify-center break-inside-avoid">
                                <div className={`grid ${p.count > 12 ? 'grid-cols-5' : p.count > 6 ? 'grid-cols-4' : 'grid-cols-3'} gap-2 justify-items-center items-center p-2 rounded-lg bg-slate-50/50`}>
                                    {Array.from({ length: p.count }).map((_, idx) => (
                                        <div key={idx} className={`flex items-center justify-center ${p.count > 12 ? 'w-6 h-6' : 'w-8 h-8'}`}>
                                            <ColorableIcon icon={p.icon} size={p.count > 12 ? 22 : 28} colorMode={true} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Shuffled Numbers */}
                    <div className="w-24 flex flex-col gap-6 justify-between py-2">
                        {shuffledNumbers.map((num: number, idx: number) => (
                            <div key={idx} className="relative h-32 flex items-center justify-end">
                                <div className="w-16 h-16 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 flex items-center justify-center text-2xl font-black text-indigo-700 shadow-sm">
                                    {num}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Grid Layout for other types */
                <div className={`grid ${config.type === 'color' ? 'grid-cols-2' : 'grid-cols-3'} gap-6 mt-8`}>
                    {problems.map((p: any) => (
                        <div key={p.id} className="border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center bg-white break-inside-avoid shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow">
                            {/* Object Display */}
                            <div className={`mb-4 w-full ${config.type === 'color' ? 'min-h-[14rem]' : 'min-h-[8rem]'} flex items-center justify-center p-4 rounded-xl ${config.type === 'color' ? 'bg-white' : 'bg-slate-50/50'}`}>
                                <div className={`grid ${p.count > 12 || config.type === 'color' ? 'grid-cols-5' : p.count > 6 ? 'grid-cols-4' : 'grid-cols-3'} ${p.count > 10 ? 'gap-2' : 'gap-4'} justify-items-center items-center`}>
                                    {Array.from({ length: config.type === 'color' ? config.max : p.count }).map((_, idx) => (
                                        <div key={idx} className={`flex items-center justify-center ${config.type === 'color' ? 'w-16 h-16' : p.count > 12 ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                            {config.type === 'color' ? (
                                                <ColorableIcon icon={p.icon} size={54} colorMode={false} />
                                            ) : (
                                                <ColorableIcon icon={p.icon} size={p.count > 12 ? 32 : 42} colorMode={true} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Interaction Area based on Type */}
                            {config.type === 'write' && (
                                <div className="w-12 h-12 border-2 border-slate-300 rounded-md bg-slate-50 flex items-center justify-center">
                                </div>
                            )}

                            {config.type === 'circle' && (
                                <div className="flex gap-2 justify-center w-full">
                                    {p.options.map((opt: number) => (
                                        <div key={opt} className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-600">
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {config.type === 'color' && (
                                <div className="text-xs text-slate-500 font-medium border-t border-slate-100 pt-2 w-full text-center">
                                    Color {p.count}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 border border-emerald-200 rounded-lg bg-emerald-50 text-sm text-emerald-800 break-inside-avoid">
                    <strong>Answer Key:</strong>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {problems.map((p: any, i: number) => (
                            <div key={i}>#{i + 1}: {p.count}</div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
