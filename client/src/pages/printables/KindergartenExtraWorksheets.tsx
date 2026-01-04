import * as React from 'react'
import { WorksheetSectionWrapper } from './PrintableShared'
import { makeRng, shuffleArray } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

type ReactNode = React.ReactNode

interface SpecificWorksheetProps {
    docId: string
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
    seed: string
    variant: number
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
}

export function ComparisonWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const config = COMPARISON_DATA[docId] || COMPARISON_DATA['heavy-light']
    const rng = makeRng(`${seed}-${docId}-${variant}`)
    const displayPairs = shuffleArray([...config.pairs], rng)

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
                {displayPairs.map((pair, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col items-center justify-center gap-6 hover:border-blue-300 transition-colors break-inside-avoid shadow-sm">
                        <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                <div className="text-5xl md:text-6xl p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors min-h-[140px] w-full flex items-center justify-center flex-wrap gap-1 cursor-pointer">
                                    {/* Handle multi-emoji strings for more-less worksheet */}
                                    {Array.from(pair.a.icon).map((emoji, idx) => (
                                        <span key={idx}>{emoji}</span>
                                    ))}
                                </div>
                                <span className="font-bold text-slate-800 text-center">{pair.a.label}</span>
                            </div>

                            <div className="text-xl font-black text-slate-200 uppercase tracking-tighter shrink-0">vs</div>

                            <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                <div className="text-5xl md:text-6xl p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors min-h-[140px] w-full flex items-center justify-center flex-wrap gap-1 cursor-pointer">
                                    {Array.from(pair.b.icon).map((emoji, idx) => (
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
                        {displayPairs.map((p, i) => (
                            <div key={i} className="text-sm font-medium text-emerald-800">
                                {i + 1}. {p.correct === 'a' ? p.a.label : p.b.label}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// --- Pattern Worksheets ---

const PATTERN_TYPES: Record<string, { title: string, emoji: string, description: string, generator: (rng: any) => { sequence: string[], options: string[], answer: string } }> = {
    'ab-pattern': {
        title: 'AB Patterns',
        emoji: '🧩',
        description: 'What comes next in the AB pattern?',
        generator: (rng) => {
            const themes = [
                ['🍎', '🍌'], ['🐶', '🐱'], ['🚗', '🚙'], ['🔴', '🔵'], ['⭐', '🌙'], ['🌳', '🌸']
            ]
            const [a, b] = themes[Math.floor(rng() * themes.length)]
            const sequence = [a, b, a, b, a, b]
            return { sequence, options: [a, b], answer: a }
        }
    },
    'color-patterns': {
        title: 'Color Patterns',
        emoji: '🎨',
        description: 'Find the pattern and color the next object!',
        generator: (rng) => {
            const palettes = [
                ['🔴', '🔵', '🟢'], ['🟡', '🟠', '🔴'], ['🟣', '⚪', '⚫']
            ]
            const palette = palettes[Math.floor(rng() * palettes.length)]
            const sequence = [palette[0], palette[1], palette[0], palette[1], palette[0]]
            return { sequence, options: [palette[0], palette[1], palette[2]], answer: palette[1] }
        }
    },
    'shape-patterns': {
        title: 'Shape Patterns',
        emoji: '📐',
        description: 'Which shape comes next in the pattern?',
        generator: (rng) => {
            const shapes = ['⭕', '📐', '🟦', '⭐', '💎']
            const s1 = shapes[Math.floor(rng() * shapes.length)]
            let s2 = shapes[Math.floor(rng() * shapes.length)]
            while (s2 === s1) s2 = shapes[Math.floor(rng() * shapes.length)]

            const type = rng() > 0.5 ? 'AAB' : 'ABC'
            if (type === 'AAB') {
                return { sequence: [s1, s1, s2, s1, s1], options: [s1, s2], answer: s2 }
            } else {
                let s3 = shapes[Math.floor(rng() * shapes.length)]
                while (s3 === s1 || s3 === s2) s3 = shapes[Math.floor(rng() * shapes.length)]
                return { sequence: [s1, s2, s3, s1, s2], options: [s1, s2, s3], answer: s3 }
            }
        }
    },
    'what-comes-next': {
        title: 'What Comes Next?',
        emoji: '🔮',
        description: 'Look at the pattern and find the missing piece!',
        generator: (rng) => {
            const emojis = ['🚀', '🛸', '🛰️', '🪐', '👽', '👾', '🌈', '☀️', '☁️', '❄️']
            const e1 = emojis[Math.floor(rng() * emojis.length)]
            let e2 = emojis[Math.floor(rng() * emojis.length)]
            while (e2 === e1) e2 = emojis[Math.floor(rng() * emojis.length)]

            const sequence = [e1, e2, e1, e2, e1, e2]
            return { sequence, options: [e1, e2], answer: e1 }
        }
    }
}

export function PatternWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const config = PATTERN_TYPES[docId] || PATTERN_TYPES['ab-pattern']
    const rng = makeRng(`${seed}-${docId}-${variant}`)

    const problems = Array.from({ length: 6 }, () => config.generator(rng))

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
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-300 transition-colors break-inside-avoid shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                {i + 1}
                            </span>
                            <div className="flex items-center gap-2 md:gap-4 p-4 bg-slate-50 rounded-xl overflow-x-auto">
                                {p.sequence.map((item, j) => (
                                    <span key={j} className="text-4xl md:text-5xl">{item}</span>
                                ))}
                                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-white">
                                    <span className="text-3xl font-bold text-slate-300">?</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-l-2 border-slate-100 pl-6 h-full min-h-[100px]">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Pick:</span>
                            {p.options.map((opt, k) => (
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
                        {problems.map((p, i) => (
                            <div key={i} className="bg-white px-4 py-2 rounded-lg border border-purple-200 shadow-sm flex items-center gap-2">
                                <span className="font-bold text-purple-600">#{i + 1}</span>
                                <span className="text-2xl">{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
