import React from 'react';
type ReactNode = React.ReactNode;
import { WorksheetSectionWrapper } from './PrintableShared';
import { makeRng, shuffleArray } from '@/utils/printableUtils';
import { useTranslation } from '@/context/TranslationContext';

interface SpecificWorksheetProps {
    key?: string;
    docId: string;
    activeDocs?: string[];
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode;
    seed: string;
    variant: number;
}

// --- Comparison Worksheets ---

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
            parentTeacherTips={[
                'Encourage your child to describe why they chose an object.',
                'Find real-life objects at home to compare (e.g., "Is the spoon heavier than the pillow?").',
                'Use these concepts during everyday activities like sorting groceries or cleaning up toys.'
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

// --- Pattern Worksheets ---

// Helper function for pattern generation
const generatePattern = (rng: any, elements: string[], type: 'AB' | 'AAB' | 'ABC') => {
    const shuffledElements = shuffleArray([...elements], rng);
    const e1 = shuffledElements[0];
    const e2 = shuffledElements[1];
    const e3 = shuffledElements[2];

    let sequence: string[] = [];
    let answer: string = '';
    let options: string[] = [];

    if (type === 'AB') {
        sequence = [e1, e2, e1, e2, e1];
        answer = e2;
        options = shuffleArray([e1, e2], rng);
    } else if (type === 'AAB') {
        sequence = [e1, e1, e2, e1, e1];
        answer = e2;
        options = shuffleArray([e1, e2], rng);
    } else if (type === 'ABC') {
        sequence = [e1, e2, e3, e1, e2];
        answer = e3;
        options = shuffleArray([e1, e2, e3], rng);
    }
    return { sequence, options, answer };
};

const PATTERN_TYPES: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => { sequence: string[], options: string[], answer: string } }> = {
    'ab-pattern': {
        title: 'AB Patterns',
        emoji: '🧩',
        description: 'What comes next in the AB pattern?',
        generator: (rng: any) => {
            const themes = [
                ['🍎', '🍌'], ['🐶', '🐱'], ['🚗', '🚙'], ['🔴', '🔵'], ['⭐', '🌙'], ['🌳', '🌸']
            ];
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
            const palettes = [
                ['🔴', '🔵', '🟢'], ['🟡', '🟠', '🔴'], ['🟣', '⚪', '⚫']
            ];
            const palette = palettes[Math.floor(rng() * palettes.length)];
            const sequence = [palette[0], palette[1], palette[0], palette[1], palette[0]];
            return { sequence, options: [palette[0], palette[1], palette[2]], answer: palette[1] };
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

            const type = rng() > 0.5 ? 'AAB' : 'ABC';
            if (type === 'AAB') {
                return { sequence: [s1, s1, s2, s1, s1], options: [s1, s2], answer: s2 };
            } else {
                let s3 = shapes[Math.floor(rng() * shapes.length)];
                while (s3 === s1 || s3 === s2) s3 = shapes[Math.floor(rng() * shapes.length)];
                return { sequence: [s1, s2, s3, s1, s2], options: [s1, s2, s3], answer: s3 };
            }
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

            const sequence = [e1, e2, e1, e2, e1, e2];
            return { sequence, options: [e1, e2], answer: e1 };
        }
    },
    'what-comes-next-shapes': {
        title: 'What Comes Next?',
        emoji: '❓',
        description: 'Draw the shape that comes next in the pattern!',
        generator: (rng: any) => generatePattern(rng, ['🟥', '🟦', '🟢', '⭐'], 'ABC')
    },
    'pattern-complete': {
        title: 'Complete the Pattern',
        emoji: '🧩',
        description: 'Fill in the missing parts of the pattern!',
        generator: (rng: any) => generatePattern(rng, ['🍎', '🍌', '🍇', '🍊', '🍓'], 'AAB')
    }
};

export function PatternWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = PATTERN_TYPES[docId] || PATTERN_TYPES['ab-pattern'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);

    const problems = Array.from({ length: 6 }, () => config.generator(rng));

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description={config.description}
            problemCount={problems.length}
            learningObjectives={[
                'Identify and extend repeating patterns',
                'Recognize pattern units (AB, AAB, ABC)',
                'Develop logical reasoning and prediction skills',
                'Identify colors and shapes in sequences'
            ]}
            parentTeacherTips={[
                'Have your child read the pattern out loud (e.g., "Apple, Banana, Apple, Banana").',
                'Use blocks or toys to create physical patterns together.',
                'Encourage them to point to each item as they identify the sequence.'
            ]}
        >
            <div className="space-y-6 print:space-y-4">
                {problems.map((p, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-300 transition-colors break-inside-avoid shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                {i + 1}
                            </span>
                            <div className="flex items-center gap-2 md:gap-4 p-4 bg-slate-50 rounded-xl overflow-x-auto">
                                {p.sequence.map((item, j: number) => (
                                    <span key={j} className="text-4xl md:text-5xl">{item}</span>
                                ))}
                                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-white">
                                    <span className="text-3xl font-bold text-slate-300"></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-l-2 border-slate-100 pl-6 h-full min-h-[100px]">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Pick:</span>
                            {p.options.map((opt, k: number) => (
                                <div key={k} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-4xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm bg-white">
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl print:bg-white">
                    <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span>✨</span> Answer Key
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {problems.map((p, i: number) => (
                            <div key={i} className="bg-white px-4 py-2 rounded-lg border border-purple-200 shadow-sm flex items-center gap-2">
                                <span className="font-bold text-purple-600">#{i + 1}</span>
                                <span className="text-2xl">{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Shape Worksheets ---

const SHAPE_DATA: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => any }> = {
    'shape-identification': {
        title: 'Shape Identification',
        emoji: '🟢',
        description: 'Look at the shape and circle its name!',
        generator: (rng: any) => {
            const shapes = [
                { name: 'Circle', icon: '⭕' },
                { name: 'Square', icon: '🟥' },
                { name: 'Triangle', icon: '🔺' },
                { name: 'Star', icon: '⭐' },
                { name: 'Heart', icon: '❤️' },
                { name: 'Diamond', icon: '🔷' }
            ]

            // Generate 4 unique problems if possible, or just 4 random ones
            return Array.from({ length: 4 }).map(() => {
                const shape = shapes[Math.floor(rng() * shapes.length)]
                const options = shuffleArray(shapes.map(s => s.name), rng).slice(0, 3)
                if (!options.includes(shape.name)) options[0] = shape.name
                return {
                    shape: shape.icon,
                    correctAnswer: shape.name,
                    options: shuffleArray(options, rng)
                }
            })
        }
    },
    'missing-shape': {
        title: 'Missing Shape',
        emoji: '❓',
        description: 'Look at the pattern. Which shape is missing? Draw it in the empty circle!',
        generator: (rng: any) => {
            const shapes = ['⭕', '🟥', '⭐', '🔺', '🔷', '❤️', '🟩', '🔶'];
            return Array.from({ length: 5 }).map(() => {
                const [s1, s2] = shuffleArray(shapes, rng).slice(0, 2);
                // Randomly decide pattern type: ABAB or AAB
                const isABAB = rng() > 0.5;
                const items = isABAB
                    ? [
                        { icon: s1, missing: false },
                        { icon: s2, missing: false },
                        { icon: s1, missing: false },
                        { icon: s2, missing: true }
                    ]
                    : [
                        { icon: s1, missing: false },
                        { icon: s1, missing: false },
                        { icon: s2, missing: false },
                        { icon: s2, missing: true }
                    ];

                return { items };
            });
        }
    },
    'color-shapes': {
        title: 'Color the Shapes',
        emoji: '🎨',
        description: 'Read the color and color the shape!',
        generator: (rng: any) => {
            const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'];
            const shapes = ['Circle', 'Square', 'Triangle', 'Star', 'Heart', 'Diamond'];
            const iconsMap: Record<string, string> = {
                'Circle': '⭕',
                'Square': '⬜',
                'Triangle': '📐',
                'Star': '⭐',
                'Heart': '❤️',
                'Diamond': '💎'
            };
            const problems = Array.from({ length: 6 }, (_, i) => {
                const shape = shapes[Math.floor(rng() * shapes.length)];
                return {
                    color: colors[i % colors.length],
                    shape: shape,
                    icon: iconsMap[shape]
                };
            });
            return shuffleArray(problems, rng);
        }
    },
    'shape-sorting': {
        title: 'Shape Sorting',
        emoji: '📦',
        description: 'Draw a line to sort the shapes into the correct boxes!',
        generator: (rng: any) => {
            const categories = [
                { name: 'Round', shapes: ['⭕', '⚽', '🍊', '🍪'] },
                { name: 'With Corners', shapes: ['🟦', '📐', '🎁', '🧱'] }
            ];
            return { categories, allShapes: shuffleArray([...categories[0].shapes, ...categories[1].shapes], rng) };
        }
    },
    'color-recognition': {
        title: 'Color Recognition',
        emoji: '🌈',
        description: 'Point to each color and say its name!',
        generator: (rng: any) => {
            const colors = [
                { name: 'Red', emoji: '🔴' },
                { name: 'Blue', emoji: '🔵' },
                { name: 'Green', emoji: '🟢' },
                { name: 'Yellow', emoji: '🟡' },
                { name: 'Orange', emoji: '🟠' },
                { name: 'Purple', emoji: '🟣' },
                { name: 'Pink', emoji: '🌸' },
                { name: 'Brown', emoji: '🐻' }
            ];
            return shuffleArray(colors, rng);
        }
    },
    'draw-shape': {
        title: 'Draw and Trace Shapes',
        emoji: '✏️',
        description: 'Trace the shapes and then draw your own!',
        generator: (rng: any) => {
            return [
                { name: 'Circle', path: 'M 50 10 A 40 40 0 1 1 49.9 10 Z' },
                { name: 'Square', path: 'M 10 10 H 90 V 90 H 10 Z' },
                { name: 'Triangle', path: 'M 50 10 L 90 90 L 10 90 Z' },
                { name: 'Star', path: 'M 50 10 L 61 40 L 94 40 L 67 60 L 77 90 L 50 70 L 23 90 L 33 60 L 6 40 L 39 40 Z' }
            ];
        }
    }
};

export function ShapeWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = SHAPE_DATA[docId] || SHAPE_DATA['shape-identification'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const data = config.generator(rng);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description={config.description}
            problemCount={Array.isArray(data) ? data.length : 1}
            learningObjectives={[
                'Recognize and name basic geometric shapes',
                'Identify and name primary and secondary colors',
                'Develop sorting and classification skills',
                'Enhance fine motor skills through drawing and tracing'
            ]}
            parentTeacherTips={[
                'Encourage your child to find these shapes and colors in the room.',
                'Practice drawing shapes in sand or shaving cream for a tactile experience.',
                'Talk about the attributes of each shape (e.g., "A triangle has 3 sides").'
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
                {docId === 'shape-identification' && (data as any[]).map((item: any, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col items-center gap-6 break-inside-avoid shadow-sm">
                        <div className="text-8xl p-6 bg-slate-50 rounded-3xl">{item.icon}</div>
                        <div className="flex gap-4">
                            {item.options.map((opt: string, idx: number) => (
                                <div key={idx} className="px-4 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {docId === 'color-shapes' && (data as any[]).map((item: any, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col items-center gap-4 break-inside-avoid shadow-sm">
                        <div className="text-3xl font-bold text-slate-400 mb-2">Color this {item.shape}:</div>
                        <div className="text-8xl py-4 flex items-center justify-center opacity-20 border-4 border-dashed border-slate-200 rounded-3xl w-full">
                            {item.icon}
                        </div>
                        <div className="mt-4 px-6 py-2 bg-slate-100 rounded-full font-black text-xl text-slate-700 uppercase tracking-widest ">
                            {item.color}
                        </div>
                    </div>
                ))}

                {docId === 'shape-sorting' && (
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div className="flex flex-wrap justify-center gap-6 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                            {(data as any).allShapes.map((s: string, i: number) => (
                                <div key={i} className="text-5xl p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:scale-110 transition-transform cursor-grab active:cursor-grabbing">
                                    {s}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {(data as any).categories.map((cat: any, i: number) => (
                                <div key={i} className="border-4 border-dashed border-slate-300 rounded-3xl p-8 min-h-[250px] flex flex-col items-center gap-4 bg-white/50">
                                    <h3 className="text-2xl font-black text-slate-400 uppercase">{cat.name}</h3>
                                    <div className="flex-1 flex items-center justify-center text-slate-200 italic text-sm text-center" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {docId === 'color-recognition' && (data as any[]).map((item: any, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex items-center gap-6 break-inside-avoid shadow-sm group hover:border-purple-300 transition-all">
                        <div className="text-7xl group-hover:scale-110 transition-transform">{item.emoji}</div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-800">{item.name}</span>
                            <div className="flex gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, idx: number) => (
                                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-slate-100 bg-slate-50" />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {docId === 'draw-shape' && (data as any[]).map((item: any, i: number) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col items-center gap-6 break-inside-avoid shadow-sm">
                        <h3 className="text-2xl font-bold text-slate-700">{item.name}</h3>
                        <div className="grid grid-cols-2 gap-6 w-full">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Trace</span>
                                <svg viewBox="0 0 100 100" className="w-32 h-32 text-slate-200">
                                    <path d={item.path} fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8,8" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Draw</span>
                                <div className="w-32 h-32 border-2 border-slate-100 rounded-2xl bg-slate-50" />
                            </div>
                        </div>
                    </div>
                ))}

                {docId === 'missing-shape' && (
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {(data as any[]).map((problem: any, rowIdx: number) => (
                            <div key={rowIdx} className="flex flex-nowrap items-center justify-between gap-2 sm:gap-4 p-4 border-2 border-slate-200 rounded-2xl bg-white break-inside-avoid shadow-sm">
                                <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
                                    {problem.items.map((item: any, i: number) => (
                                        <div key={i} className={`relative flex flex-col items-center justify-center w-14 h-14 sm:w-20 sm:h-20 border-3 rounded-xl sm:rounded-2xl transition-all
                                            ${item.missing ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-100 bg-white text-slate-700'}`}>
                                            <span className="text-2xl sm:text-4xl">{item.missing ? '' : item.icon}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Visual Separator/Arrow */}
                                <div className="hidden sm:block text-slate-300">➜</div>
                                {/* Copy Box (Optional, or just the missing spot is enough. Let's keep it simple as just the sequence with missing spot) */}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl print:bg-white">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <span>💡</span> Teaching Guide
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed italic">
                        {docId === 'shape-identification' ? 'Ensure students can correctly identify each shape by name.' :
                            docId === 'color-shapes' ? 'Check if students follow both the color and shape instructions.' :
                                docId === 'shape-sorting' ? 'Round items go in the Round box, items with corners go in the other.' :
                                    docId === 'color-recognition' ? 'Listen for correct pronunciation and immediate recognition of each color.' :
                                        'Focus on proper pencil grip and following the directional flow of the shapes.'}
                    </p>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Number Recognition Worksheets ---

const NUMBER_DATA: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => any }> = {
    'number-id-1-10': {
        title: 'Number Recognition (1-10)',
        emoji: '🔟',
        description: 'Read each number out loud and trace it!',
        generator: (rng: any) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    'number-matching-1-15': {
        title: 'Number Matching (1-15)',
        emoji: '🤝',
        description: 'Draw a line to match the number to the group of objects!',
        generator: (rng: any) => {
            const numbers = [3, 5, 8, 10, 12, 15];
            const icons = ['🍎', '⭐', '🎈', '🍪', '🐶', '🍭'];
            return numbers.map((n, i) => ({
                number: n,
                objects: Array.from({ length: n }).map(() => icons[i]).join('')
            }));
        }
    },
    'number-order-1-20': {
        title: 'Number Order (1-20)',
        emoji: '🚂',
        description: 'Fill in the missing numbers on the train!',
        generator: (rng: any) => {
            const sequence = Array.from({ length: 20 }, (_, i) => i + 1);
            const missingIndices = new Set([1, 4, 7, 11, 14, 18]);
            return sequence.map((n, i) => ({
                num: n,
                isMissing: missingIndices.has(i)
            }));
        }
    },
    'find-number-1-10': {
        title: 'Find the Number!',
        emoji: '🔍',
        description: 'Find all the hidden numbers!',
        generator: (rng: any) => {
            const target = Math.floor(rng() * 10) + 1;
            const grid = Array.from({ length: 20 }, () => Math.floor(rng() * 10) + 1);
            return { target, grid };
        }
    }
};

export function NumberRecognitionWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = NUMBER_DATA[docId] || NUMBER_DATA['number-id-1-10'];
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const data = config.generator(rng);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={config.title}
            emoji={config.emoji}
            description={config.description}
            problemCount={Array.isArray(data) ? data.length : 1}
            learningObjectives={[
                'Identify and name numbers from 1 to 20',
                'Connect number names to their written symbols',
                'Understand one-to-one correspondence by matching number to quantity',
                'Recognize and complete number sequences'
            ]}
            parentTeacherTips={[
                'Count physical objects like steps or cereal pieces to reinforce these numbers.',
                'Point out numbers on house doors, signs, or in books.',
                'Draw numbers in the air together using large arm movements.'
            ]}
        >
            <div className="grid grid-cols-1 gap-6">
                {docId === 'number-id-1-10' && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                        {(data as number[]).map((n: number, i: number) => (
                            <div key={i} className="border-2 border-slate-200 rounded-2xl p-8 bg-white flex flex-col items-center gap-4 break-inside-avoid shadow-sm group hover:border-emerald-300 transition-all">
                                <span className="text-7xl font-black text-slate-800">{n}</span>
                                <div className="w-20 h-10 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center" />
                            </div>
                        ))}
                    </div>
                )}

                {docId === 'number-matching-1-15' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {shuffleArray([...(data as any[])], rng).map((item: any, i: number) => (
                                <div key={i} className="h-24 p-6 border-2 border-slate-200 rounded-2xl bg-white flex items-center justify-center text-5xl font-black text-slate-800 shadow-sm">
                                    {item.number}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {shuffleArray([...(data as any[])], rng).map((item: any, i: number) => (
                                <div key={i} className="h-24 p-4 border-2 border-slate-200 rounded-2xl bg-white flex items-center justify-center text-2xl overflow-hidden leading-tight flex-wrap gap-1 shadow-sm">
                                    {Array.from(item.objects).map((obj, idx: number) => <span key={idx}>{obj as string}</span>)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {docId === 'number-order-1-20' && (
                    <div className="flex flex-wrap justify-center gap-4 p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
                        {(data as any[]).map((item: any, i: number) => (
                            <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all shadow-sm ${item.isMissing ? 'border-dashed border-slate-300 bg-white text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
                                {item.isMissing ? '' : item.num}
                            </div>
                        ))}
                    </div>
                )}

                {docId === 'find-number-1-10' && (
                    <div className="flex flex-col items-center gap-8">
                        <div className="px-8 py-4 bg-yellow-100 border-2 border-yellow-200 rounded-3xl flex items-center gap-4 shadow-sm">
                            <span className="text-xl font-bold text-yellow-800 uppercase tracking-widest">Find all the:</span>
                            <span className="text-6xl font-black text-yellow-900">{(data as any).target}</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                            {(data as any).grid.map((n: number, i: number) => (
                                <div key={i} className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-center text-4xl font-bold text-slate-700 hover:border-yellow-400 hover:bg-yellow-50 cursor-pointer transition-all shadow-sm">
                                    {n}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl print:bg-white">
                    <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span>🎯</span> Guidance
                    </h3>
                    <div className="text-sm text-emerald-800 italic space-y-2">
                        <p>{docId === 'number-id-1-10' ? 'Focus on correct identification and steady tracing.' :
                            docId === 'number-matching-1-15' ? 'Verify one-to-one counting for each set of objects.' :
                                docId === 'number-order-1-20' ? 'The missing numbers are: ' + (data as any[]).filter((n: any) => n.isMissing).map((n: any) => n.num).join(', ') :
                                    'The target number ' + (data as any).target + ' appears ' + (data as any).grid.filter((n: number) => n === (data as any).target).length + ' times.'}</p>
                        {docId === 'find-number-1-10' && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(data as any).grid.map((n: number, i: number) => n === (data as any).target && (
                                    <span key={i} className="px-2 py-1 bg-white rounded border border-emerald-200 text-xs">Pos {i + 1}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Spot The Difference ---

export function SpotDifferenceWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const rng = makeRng(`${seed}-${docId}-${variant}`)

    // Generate 4 puzzles
    const puzzles = Array.from({ length: 4 }).map((_, i) => {
        // Base scene items (simple emoji composition)
        const sceneBase = [
            { id: 1, icon: '🏠', x: 20, y: 30, size: 40 },
            { id: 2, icon: '🌳', x: 70, y: 30, size: 50 },
            { id: 3, icon: '☀️', x: 10, y: 10, size: 25 },
            { id: 4, icon: '☁️', x: 60, y: 15, size: 30 },
            { id: 5, icon: '🌷', x: 30, y: 70, size: 20 },
            { id: 6, icon: '🍄', x: 80, y: 75, size: 15 },
        ]

        // Vary positions slightly per puzzle
        const scene = sceneBase.map(item => ({
            ...item,
            x: item.x + (rng() * 10 - 5),
            y: item.y + (rng() * 10 - 5)
        }))

        // Pick one item to change for the difference
        const targetIndex = Math.floor(rng() * scene.length)
        const diffType = rng() > 0.5 ? 'missing' : 'change'

        return {
            scene,
            targetIndex,
            diffType,
            // If change, swap icon
            altIcon: scene[targetIndex].icon === '☀️' ? '🌙' : '🐕' // Simple fallback swap
        }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Spot the Difference"
            emoji="👀"
            description="Find and circle the difference between the two pictures!"
            problemCount={puzzles.length}
        >
            <div className="space-y-8">
                {puzzles.map((p, i) => (
                    <div key={i} className="flex gap-4 md:gap-8 items-center justify-center p-4 border-2 border-slate-100 rounded-2xl bg-slate-50">
                        {/* Original */}
                        <div className="relative w-64 h-48 bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                            {p.scene.map((item, j) => (
                                <div key={j} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: `${item.size}px` }}>
                                    {item.icon}
                                </div>
                            ))}
                        </div>

                        {/* Modified */}
                        <div className="relative w-64 h-48 bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
                            {p.scene.map((item, j) => {
                                if (j === p.targetIndex) {
                                    if (p.diffType === 'missing') return null
                                    return (
                                        <div key={j} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: `${item.size}px` }}>
                                            {p.altIcon}
                                        </div>
                                    )
                                }
                                return (
                                    <div key={j} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: `${item.size}px` }}>
                                        {item.icon}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <h4 className="font-bold text-emerald-900 mb-2">Answer Key:</h4>
                    <ul className="list-disc list-inside text-sm text-emerald-800">
                        {puzzles.map((p, i) => (
                            <li key={i}>Puzzle {i + 1}: The {p.scene[p.targetIndex].icon} became {p.diffType === 'missing' ? 'missing' : `a ${p.altIcon}`}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
