import React, { ReactNode } from 'react'
import { WorksheetSectionWrapper } from '@/components/worksheet/WorksheetSectionWrapper'
import { PremiumWorksheetBanner } from '@/pages/printables/PrintableShared'
import { makeRng, pick, pickNUnique } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

// --- Extended Logic for Coordinate Tracking ---

interface WordPlacement {
    word: string
    start: [number, number] // [row, col]
    end: [number, number]   // [row, col]
}

export function generateWordSearchGrid(size: number, words: string[], rng: () => number) {
    const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''))
    const placements: WordPlacement[] = []

    // Sort words by length descending
    const sortedWords = [...words].sort((a, b) => b.length - a.length)

    // Directions: [row, col]
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1]   // diagonal down-left
    ]

    for (const word of sortedWords) {
        let placed = false
        let attempts = 0
        const maxAttempts = 200

        while (!placed && attempts < maxAttempts) {
            attempts++

            const dir = pick(directions, rng)!
            const rStep = dir[0]
            const cStep = dir[1]

            // Random start
            const rStart = Math.floor(rng() * size)
            const cStart = Math.floor(rng() * size)

            // Calculate end
            const rEnd = rStart + (word.length - 1) * rStep
            const cEnd = cStart + (word.length - 1) * cStep

            // Bounds check
            if (rEnd < 0 || rEnd >= size || cEnd < 0 || cEnd >= size) continue

            // Overlap check
            let fits = true
            for (let i = 0; i < word.length; i++) {
                const r = rStart + i * rStep
                const c = cStart + i * cStep
                const cell = grid[r][c]
                if (cell !== '' && cell !== word[i]) {
                    fits = false
                    break
                }
            }

            if (fits) {
                // Place it
                for (let i = 0; i < word.length; i++) {
                    const r = rStart + i * rStep
                    const c = cStart + i * cStep
                    grid[r][c] = word[i]
                }
                placements.push({
                    word,
                    start: [rStart, cStart],
                    end: [rEnd, cEnd]
                })
                placed = true
            }
        }
    }

    // Fill empty spaces
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) {
                grid[r][c] = letters[Math.floor(rng() * letters.length)]
            }
        }
    }

    return { grid, placements }
}

// Logic helpers
function buildWords(theme: string, age: string): string[] {
    if (theme === 'sight') {
        return age === 'k2'
            ? ['THE', 'AND', 'IS', 'YOU', 'ARE', 'IT', 'IN', 'TO', 'WE', 'GO', 'MY', 'ME']
            : ['BECAUSE', 'THROUGH', 'BEFORE', 'BETWEEN', 'AROUND', 'ANOTHER', 'ALREADY', 'THOUGHT', 'ENOUGH', 'FAMILY', 'FRIEND', 'SCHOOL']
    }
    if (theme === 'space') {
        return ['GALAXY', 'COMET', 'ORBIT', 'PLANET', 'STAR', 'MOON', 'ROCKET', 'NEBULA', 'MARS', 'VENUS', 'ALIEN', 'ASTRO']
    }
    // animals (default)
    return ['TIGER', 'LION', 'ZEBRA', 'PANDA', 'BEAR', 'WOLF', 'FOX', 'EAGLE', 'SHARK', 'WHALE', 'SNAKE', 'HAWK']
}

export function WordSearch({
    activeDocs,
    showAnswers,
    effectiveSeed,
    variant,
    packTime,
    packAge,
    packSkill,
    showAnswersForDoc
}: {
    activeDocs: string[],
    showAnswers: boolean,
    effectiveSeed: string,
    variant: string,
    packTime: string,
    packAge: string,
    packSkill: string,
    fromParam?: string, // unused but kept for interface compat if needed
    showAnswersForDoc: (id: string, render: () => ReactNode) => ReactNode
}) {
    const { t } = useTranslation()

    // Only render if activeDocs includes 'word-search'
    if (!activeDocs.includes('word-search')) return null;

    const wsSize = 10; // Increased size for premium feel
    const seedStr = `${effectiveSeed}|v${variant}|t${packTime}|a${packAge}|s${packSkill}`;
    const rng = makeRng(seedStr);

    // Select Theme
    const theme = packSkill === 'reading' ? 'sight' : (packSkill === 'stem' ? 'space' : pick(['animals', 'space', 'sight'], rng)!);
    const wordsFull = buildWords(theme, packAge);
    const words = pickNUnique(wordsFull, 10, rng);

    // Generate Grid & Solution
    const { grid, placements } = generateWordSearchGrid(wsSize, words, rng);

    // SVG scaling
    const cellSize = 30;
    const padding = 20;
    const width = wsSize * cellSize + padding * 2;
    const height = wsSize * cellSize + padding * 2;

    return (
        <WorksheetSectionWrapper
            docId="word-search"
            title="Detective Word Search"
            emoji="🔍"
            description="Find and circle the hidden words. They can be horizontal, vertical, or diagonal!"
            problemCount={1}
            learningObjectives={[
                'Develop visual scanning and pattern recognition',
                'Reinforce spelling and vocabulary',
                'Build focus and attention to detail'
            ]}
            parentTeacherTips={[
                'Encourage your child to look for the first letter of a word, then check surrounding letters.',
                'Use a ruler or finger to guide eyes line by line.',
                'Highlight found words with a colorful marker!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Word Detective"
                subtitle="Case File: Hidden Vocabulary"
                icons={{
                    bg1: "🔍",
                    bg2: "👣",
                    float1: "📋",
                    float2: "🕵️"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                    border: "border-amber-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-amber-300",
                    pillText: "text-amber-900",
                    accent: "text-amber-300"
                }}
            />

            <div className="flex flex-col md:flex-row gap-8 items-start break-inside-avoid mt-6">

                {/* Word List "Case File" */}
                <div className="w-full md:w-48 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                    {/* PaperClip Visual */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-8 border-2 border-slate-300 rounded-full bg-white z-10"></div>

                    <h3 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-3 text-center uppercase tracking-widest text-sm">
                        Evidence List
                    </h3>
                    <ul className="space-y-3">
                        {words.map((w, i) => (
                            <li key={w} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <div className="w-5 h-5 rounded border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-transparent">✓</div>
                                <span>{w}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 text-xs text-slate-400 text-center italic">
                        Find all {words.length} items to solve the case!
                    </div>
                </div>

                {/* The Grid (SVG) */}
                <div className="flex-1 w-full flex justify-center">
                    <div className="relative p-2 bg-white rounded-xl border-4 border-slate-800 shadow-lg">
                        <svg
                            viewBox={`0 0 ${width} ${height}`}
                            style={{ maxWidth: '100%', height: 'auto', width: '500px' }}
                            className="text-slate-900"
                        >
                            {/* Grid Letters */}
                            {grid.map((row, r) => row.map((char, c) => (
                                <text
                                    key={`${r}-${c}`}
                                    x={padding + c * cellSize + cellSize / 2}
                                    y={padding + r * cellSize + cellSize / 2}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize="18"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                    className="fill-slate-800"
                                >
                                    {char}
                                </text>
                            )))}
                        </svg>

                        {/* Decorative 'Magnifying Glass' handle or similar could go here visually, but kept simple for print */}
                    </div>
                </div>
            </div>

            {/* Answer Key */}
            {showAnswersForDoc('word-search', () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-4 text-lg flex items-center gap-2">
                        <span>✅</span> Case Solved: Answer Key
                    </div>
                    <div className="flex justify-center">
                        <div className="relative p-2 bg-white rounded-xl border-4 border-emerald-800/20 shadow-sm opacity-90">
                            <svg
                                viewBox={`0 0 ${width} ${height}`}
                                style={{ maxWidth: '100%', height: 'auto', width: '400px' }} // Smaller for answer key
                            >
                                {/* Background Letters (Lighter) */}
                                {grid.map((row, r) => row.map((char, c) => (
                                    <text
                                        key={`bg-${r}-${c}`}
                                        x={padding + c * cellSize + cellSize / 2}
                                        y={padding + r * cellSize + cellSize / 2}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize="18"
                                        fontFamily="monospace"
                                        fontWeight="bold"
                                        className="fill-slate-300"
                                    >
                                        {char}
                                    </text>
                                )))}

                                {/* Highlight Lines/Bubbles */}
                                {placements.map((p, i) => {
                                    const x1 = padding + p.start[1] * cellSize + cellSize / 2
                                    const y1 = padding + p.start[0] * cellSize + cellSize / 2
                                    const x2 = padding + p.end[1] * cellSize + cellSize / 2
                                    const y2 = padding + p.end[0] * cellSize + cellSize / 2
                                    return (
                                        <g key={i}>
                                            <line
                                                x1={x1} y1={y1} x2={x2} y2={y2}
                                                stroke="#10b981" // emerald-500
                                                strokeWidth="22"
                                                strokeLinecap="round"
                                                opacity="0.3"
                                            />
                                            <line
                                                x1={x1} y1={y1} x2={x2} y2={y2}
                                                stroke="#059669" // emerald-600
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </g>
                                    )
                                })}

                                {/* Foreground Letters (Words Only) - Optional, or just rely on highlight. 
                                    Let's redraw the letters of the words in black on top of highlight for readability. 
                                */}
                                {placements.map((p, i) => {
                                    // We need to re-iterate the letters of THIS placement
                                    // Calculate step again
                                    const len = p.word.length;
                                    const dRow = Math.sign(p.end[0] - p.start[0]) * (p.start[0] === p.end[0] ? 0 : 1);
                                    // Math.sign handles 0 correctly? No, if start==end it's 0. 
                                    // Actually we can infer step from delta / (len-1) if len > 1
                                    const rStep = len > 1 ? (p.end[0] - p.start[0]) / (len - 1) : 0;
                                    const cStep = len > 1 ? (p.end[1] - p.start[1]) / (len - 1) : 0;

                                    return Array.from({ length: len }).map((_, idx) => {
                                        const r = p.start[0] + idx * rStep;
                                        const c = p.start[1] + idx * cStep;
                                        return (
                                            <text
                                                key={`fg-${i}-${idx}`}
                                                x={padding + c * cellSize + cellSize / 2}
                                                y={padding + r * cellSize + cellSize / 2}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fontSize="18"
                                                fontFamily="monospace"
                                                fontWeight="bold"
                                                className="fill-emerald-900"
                                            >
                                                {grid[r][c]}
                                            </text>
                                        )
                                    })
                                })}

                            </svg>
                        </div>
                    </div>
                </div>
            ))}

        </WorksheetSectionWrapper>
    )
}
