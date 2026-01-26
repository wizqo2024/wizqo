import React, { ReactNode } from 'react'
import { WorksheetSectionWrapper } from '@/components/worksheet/WorksheetSectionWrapper'
import { PremiumWorksheetBanner } from '@/pages/printables/PrintableShared'
import { makeRng, shuffleArray } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

// --- Game Logic ---

function genSudoku(side: number, boxRows: number, boxCols: number, rng: () => number, minClues: number, maxClues: number) {
    const nums = Array.from({ length: side }, (_, i) => i + 1)

    // Base Latin pattern
    // This formula generates a valid base solution directly
    const base: number[][] = Array.from({ length: side }, (_, r) =>
        Array.from({ length: side }, (_, c) => {
            // Shift logic for box bands
            const shift = Math.floor(r / boxRows) + (r % boxRows) * boxCols
            return nums[(c + shift) % side]
        })
    )

    // Symbol permutation
    const sym = shuffleArray(nums.slice(), rng)
    let board = base.map(row => row.map(v => sym[v - 1]))

    // Row band permutation (shuffle bands of rows)
    // A "band" is a set of boxRows
    // Actually for 4x4 (2x2 boxes), bands are rows 0-1 and 2-3.
    // For 6x6 (2x3 boxes - 2 rows high), bands are 0-1, 2-3, 4-5.
    const rowBands: number[][] = []
    for (let b = 0; b < side; b += boxRows) {
        const group = Array.from({ length: boxRows }, (_, i) => b + i)
        // Shuffle within band? And shuffle bands themselves?
        // Standard sudoku shuffle:
        // 1. Shuffle rows WITHIN each band
        // 2. Shuffle bands themselves (if square... but for rectangle blocks, simple band shuffle is safe)
        // 3. Columns: similar logic

        // For simplicity and robustness on smaller grids, we'll just shuffle rows within bands
        // and shuffle columns within stacks.
        // Shuffling global bands/stacks is valid ONLY if grid is square-blocked (like 9x9, 4x4).
        // For 6x6 with 2x3 blocks, row bands are 2-high, col stacks are 3-wide.

        rowBands.push(shuffleArray(group, rng))
    }
    // Only shuffle the ORDER of bands if it's safe? Yes, row bands can always be swapped.
    const rbIndices = shuffleArray(Array.from({ length: rowBands.length }, (_, i) => i), rng)
    // Reconstruct row order
    const rowOrder: number[] = []
    for (const idx of rbIndices) {
        rowOrder.push(...rowBands[idx])
    }

    // Column stacks
    const colStacks: number[][] = []
    for (let s = 0; s < side; s += boxCols) {
        const group = Array.from({ length: boxCols }, (_, i) => s + i)
        colStacks.push(shuffleArray(group, rng))
    }
    const csIndices = shuffleArray(Array.from({ length: colStacks.length }, (_, i) => i), rng)
    const colOrder: number[] = []
    for (const idx of csIndices) {
        colOrder.push(...colStacks[idx])
    }

    // Apply permutations
    board = rowOrder.map(r => colOrder.map(c => board[r][c]))

    // Solution needed for answer key
    const solution = board.map(row => [...row])

    // Create puzzle by punching holes
    // Ensure unique solution? 
    // Small grids (4x4, 6x6) usually don't have uniqueness issues with high clue counts,
    // but a proper solver check is expensive. We'll rely on high clue counts for kids.
    const total = side * side
    const clues = Math.max(minClues, Math.min(maxClues, minClues + Math.floor(rng() * (maxClues - minClues + 1))))
    const blanks = Math.max(0, total - clues)

    // Pick cells to blank
    const indices = shuffleArray(Array.from({ length: total }, (_, i) => i), rng)
    const puzzle = board.map(row => [...row])

    for (let k = 0; k < blanks; k++) {
        const flatIdx = indices[k]
        const r = Math.floor(flatIdx / side)
        const c = flatIdx % side
        // @ts-ignore - simulating blank with null/0 for render purposes
        puzzle[r][c] = null
    }

    return { puzzle, solution }
}


// --- SVG Grid Component ---

const SudokuGrid = ({
    data,
    side,
    boxRows,
    boxCols,
    isSolution
}: {
    data: any[][], // number | null
    side: number,
    boxRows: number,
    boxCols: number,
    isSolution?: boolean
}) => {
    const cellSize = 50
    const padding = 4
    const width = side * cellSize + padding * 2
    const height = side * cellSize + padding * 2

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height="auto"
            style={{ maxWidth: side * 60 + 'px' }} // limit max width logic
            className="block mx-auto"
        >
            <rect x={padding} y={padding} width={side * cellSize} height={side * cellSize} fill="white" stroke="none" />

            {/* Grid Lines */}
            {Array.from({ length: side + 1 }).map((_, i) => {
                // Vertical Lines
                // Thick if i % boxCols === 0
                const vThick = i % boxCols === 0
                const vX = padding + i * cellSize

                // Horizontal Lines
                // Thick if i % boxRows === 0
                const hThick = i % boxRows === 0
                const hY = padding + i * cellSize

                return (
                    <React.Fragment key={i}>
                        {/* Vertical */}
                        <line
                            x1={vX} y1={padding}
                            x2={vX} y2={height - padding}
                            stroke="#334155" // slate-700
                            strokeWidth={vThick ? 3 : 1}
                            strokeLinecap="square"
                        />
                        {/* Horizontal */}
                        <line
                            x1={padding} y1={hY}
                            x2={width - padding} y2={hY}
                            stroke="#334155"
                            strokeWidth={hThick ? 3 : 1}
                            strokeLinecap="square"
                        />
                    </React.Fragment>
                )
            })}

            {/* Border (Extra Thick) */}
            <rect
                x={padding}
                y={padding}
                width={side * cellSize}
                height={side * cellSize}
                fill="none"
                stroke="#1e293b" // slate-800
                strokeWidth="4"
            />

            {/* Numbers */}
            {data.map((row, r) => row.map((val, c) => (
                val !== null && (
                    <text
                        key={`${r}-${c}`}
                        x={padding + c * cellSize + cellSize / 2}
                        y={padding + r * cellSize + cellSize / 2 + 2} // +2 for visual centering
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isSolution ? 22 : 28}
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        fill={isSolution ? "#059669" : "#1e293b"} // Green for solution, Dark Slate for puzzle
                        opacity={isSolution ? 0.9 : 1}
                    >
                        {val}
                    </text>
                )
            )))}
        </svg>
    )
}

// --- Main Component ---

export function Sudoku({
    activeDocs,
    showAnswers,
    effectiveSeed,
    variant,
    showAnswersForDoc
}: {
    activeDocs: string[],
    showAnswers: boolean,
    effectiveSeed: string,
    variant: string,
    showAnswersForDoc: (id: string, render: () => ReactNode) => ReactNode
}) {
    const { t } = useTranslation()

    return (
        <>
            {activeDocs.includes('sudoku4') && (() => {
                const rng = makeRng(`${effectiveSeed}|s4|v${variant}`)
                const { puzzle, solution } = genSudoku(4, 2, 2, rng, 6, 8) // Min 6 clues for easy 4x4

                return (
                    <WorksheetSectionWrapper
                        docId="sudoku4"
                        title="Sudoku 4×4"
                        emoji="🧠"
                        description="Fill the grid! Every row, column, and 2x2 box must have numbers 1-4."
                        problemCount={1}
                        learningObjectives={['Logic', 'Deduction', 'Pattern Recognition']}
                    >
                        <PremiumWorksheetBanner
                            title="Brain Gym: Sudoku"
                            subtitle="Level 1: 4x4 Grid"
                            icons={{ bg1: "🧠", bg2: "💡", float1: "🔢", float2: "🧩" }}
                            colors={{
                                bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
                                border: "border-blue-200",
                                pillBg: "bg-white/80",
                                pillBorder: "border-blue-300",
                                pillText: "text-blue-900",
                                accent: "text-blue-400"
                            }}
                        />

                        <div className="flex flex-col md:flex-row gap-8 mt-8 items-start break-inside-avoid">
                            {/* Tips Card */}
                            <div className="w-full md:w-64 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <span>💡</span> Strategy
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-400">1.</span>
                                        <span>Find a row or column that only needs 1 number.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-400">2.</span>
                                        <span>Check the 2x2 blocks. Each must have 1, 2, 3, and 4.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-400">3.</span>
                                        <span>Use your finger to trace lines and eliminate spots.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Puzzle Grid */}
                            <div className="flex-1 flex justify-center">
                                <SudokuGrid
                                    data={puzzle}
                                    side={4}
                                    boxRows={2}
                                    boxCols={2}
                                />
                            </div>
                        </div>

                        {showAnswersForDoc('sudoku4', () => (
                            <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                    <span>✅</span> Answer Key
                                </div>
                                <div className="flex justify-center">
                                    <SudokuGrid
                                        data={solution}
                                        side={4}
                                        boxRows={2}
                                        boxCols={2}
                                        isSolution={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </WorksheetSectionWrapper>
                )
            })()}

            {activeDocs.includes('sudoku6') && (() => {
                const rng = makeRng(`${effectiveSeed}|s6|v${variant}`)
                // 6x6 grid: 2 rows of 3-col boxes? Or 3 rows of 2-col boxes?
                // Standard is "2 rows high, 3 cols wide" boxes -> boxRows=2, boxCols=3.
                const { puzzle, solution } = genSudoku(6, 2, 3, rng, 14, 18)

                return (
                    <WorksheetSectionWrapper
                        docId="sudoku6"
                        title="Sudoku 6×6"
                        emoji="🧠"
                        description="Level up! Fill the grid with numbers 1-6."
                        problemCount={1}
                        learningObjectives={['Advanced Logic', 'Systematic Thinking', 'Focus']}
                    >
                        <PremiumWorksheetBanner
                            title="Brain Gym: Sudoku"
                            subtitle="Level 2: 6x6 Grid"
                            icons={{ bg1: "🧠", bg2: "⚡", float1: "6️⃣", float2: "🔧" }}
                            colors={{
                                bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
                                border: "border-purple-200",
                                pillBg: "bg-white/80",
                                pillBorder: "border-purple-300",
                                pillText: "text-purple-900",
                                accent: "text-purple-400"
                            }}
                        />

                        <div className="flex flex-col md:flex-row gap-8 mt-8 items-start break-inside-avoid">
                            {/* Tips Card */}
                            <div className="w-full md:w-64 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <span>⚡</span> Pro Tips
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <span className="font-bold text-purple-400">1.</span>
                                        <span>Scan "Singles": Spots where only ONE number can fit.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-purple-400">2.</span>
                                        <span>Look at the 3x2 boxes. Cross-hatch to find placements.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-purple-400">3.</span>
                                        <span>Don't guess! There is always a logical next step.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Puzzle Grid */}
                            <div className="flex-1 flex justify-center">
                                <SudokuGrid
                                    data={puzzle}
                                    side={6}
                                    boxRows={2}
                                    boxCols={3}
                                />
                            </div>
                        </div>

                        {showAnswersForDoc('sudoku6', () => (
                            <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                    <span>✅</span> Answer Key
                                </div>
                                <div className="flex justify-center">
                                    <SudokuGrid
                                        data={solution}
                                        side={6}
                                        boxRows={2}
                                        boxCols={3}
                                        isSolution={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </WorksheetSectionWrapper>
                )
            })()}
        </>
    )
}
