
import React, { ReactNode } from 'react'
import { WorksheetSectionWrapper } from '@/components/worksheet/WorksheetSectionWrapper'
import { makeRng, shuffleArray } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

function genSudoku(side: number, boxRows: number, boxCols: number, rng: () => number, minClues: number, maxClues: number) {
    const nums = Array.from({ length: side }, (_, i) => i + 1)
    // Base Latin pattern that respects sub-boxes
    const base: number[][] = Array.from({ length: side }, (_, r) =>
        Array.from({ length: side }, (_, c) => {
            const idx = (r * boxCols + Math.floor(r / boxRows) + c) % side
            return nums[idx]
        })
    )
    // Symbol permutation
    const sym = shuffleArray(nums.slice(), rng)
    let board = base.map(row => row.map(v => sym[v - 1]))
    // Row order: shuffle within bands, then shuffle bands
    const rowBands: number[][] = []
    for (let b = 0; b < side; b += boxRows) {
        const group = Array.from({ length: boxRows }, (_, i) => b + i)
        rowBands.push(shuffleArray(group, rng))
    }
    shuffleArray(rowBands, rng)
    const rowOrder = rowBands.flat()
    // Column order: shuffle within stacks, then shuffle stacks
    const colStacks: number[][] = []
    for (let s = 0; s < side; s += boxCols) {
        const group = Array.from({ length: boxCols }, (_, i) => s + i)
        colStacks.push(shuffleArray(group, rng))
    }
    shuffleArray(colStacks, rng)
    const colOrder = colStacks.flat()
    // Apply permutations
    board = rowOrder.map(r => colOrder.map(c => board[r][c]))
    // Remove cells to create puzzle
    const total = side * side
    const clues = Math.max(minClues, Math.min(maxClues, minClues + Math.floor(rng() * (maxClues - minClues + 1))))
    const blanks = Math.max(0, total - clues)
    const indices = shuffleArray(Array.from({ length: total }, (_, i) => i), rng)
    const blankSet = new Set(indices.slice(0, blanks))
    const puzzle = Array.from({ length: side }, (_, r) =>
        Array.from({ length: side }, (_, c) => (blankSet.has(r * side + c) ? null : board[r][c]))
    )
    return { puzzle, solution: board }
}

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
            {activeDocs.includes('sudoku4') && (
                <WorksheetSectionWrapper
                    docId="sudoku4"
                    title="Sudoku – 4×4 (Easy)"
                    emoji="🔢"
                    description="Fill numbers 1–4 so each row/column contains all numbers with no repeats."
                    problemCount={1}
                    learningObjectives={[
                        'Practice logical reasoning',
                        'Learn sudoku rules and strategies',
                        'Develop problem-solving skills'
                    ]}
                    parentTeacherTips={[
                        'Start with rows or columns that have more numbers',
                        'Look for missing numbers in each 2×2 box',
                        'Use elimination to find the correct number',
                        'Extension: Try a 6×6 sudoku puzzle'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x mb-2" />
                    <div className="inline-grid grid-cols-4 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 relative">
                        {/* visual subgrid lines */}
                        <div className="pointer-events-none absolute inset-3 grid grid-cols-2 grid-rows-2">
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                        </div>
                        {(() => {
                            const rng = makeRng(`${effectiveSeed}|s4|v${variant}`)
                            const data = genSudoku(4, 2, 2, rng, 8, 12)
                            const grid = (showAnswers ? data.solution : data.puzzle).flat()
                            return grid.map((val: number | null, i: number) => (
                                <div key={i} className="w-10 h-10 border border-slate-400 flex items-center justify-center">
                                    {val != null ? <span className="font-semibold text-slate-900">{val}</span> : null}
                                </div>
                            ))
                        })()}
                    </div>
                    <div className="mt-3 text-slate-700 text-sm">
                        <div className="font-medium mb-1">Clues</div>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>Start with rows or columns that already have more numbers.</li>
                            <li>Look for missing numbers in each 2×2 box.</li>
                            <li>Use elimination: if 1 and 2 exist in a row, place 3 or 4.</li>
                        </ul>
                    </div>
                    {showAnswersForDoc('sudoku4', () => (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">✅ {t('common.answerKey')}</div>
                            <div className="text-sm text-emerald-800">
                                The completed sudoku grid shows the solution. Each row, column, and 2×2 box contains the numbers 1-4 exactly once. Use the clues provided to solve step by step!
                            </div>
                        </div>
                    ))}
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('sudoku6') && (
                <WorksheetSectionWrapper
                    docId="sudoku6"
                    title="Sudoku – 6×6 (Medium)"
                    emoji="🔢"
                    description="Fill numbers 1–6 so each row/column contains all numbers with no repeats."
                    problemCount={1}
                    learningObjectives={[
                        'Practice advanced logical reasoning',
                        'Learn sudoku strategies for larger grids',
                        'Develop systematic problem-solving skills'
                    ]}
                    parentTeacherTips={[
                        'Check each 3×2 box for missing numbers',
                        'Scan for singles in rows and columns',
                        'Use pencil marks mentally to eliminate options',
                        'Extension: Try a 9×9 sudoku puzzle'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                    <div className="inline-grid grid-cols-6 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 relative">
                        {/* visual subgrid lines (3×2 boxes) */}
                        <div className="pointer-events-none absolute inset-3 grid grid-cols-3 grid-rows-2">
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                            <div className="border-2 border-slate-400/60" />
                        </div>
                        {(() => {
                            const rng = makeRng(`${effectiveSeed}|s6|v${variant}`)
                            const data = genSudoku(6, 2, 3, rng, 18, 24)
                            const grid = (showAnswers ? data.solution : data.puzzle).flat()
                            return grid.map((val: number | null, i: number) => (
                                <div key={i} className="w-10 h-10 border border-slate-400 flex items-center justify-center">
                                    {val != null ? <span className="font-semibold text-slate-900">{val}</span> : null}
                                </div>
                            ))
                        })()}
                    </div>
                    <div className="mt-3 text-slate-700 text-sm">
                        <div className="font-medium mb-1">Clues</div>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>Check each 3×2 box: fill the only spot a number can go.</li>
                            <li>Scan for singles: if a row is missing only “5”, place it.</li>
                        </ul>
                    </div>
                    {showAnswersForDoc('sudoku6', () => (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">✅ {t('common.answerKey')}</div>
                            <div className="text-sm text-emerald-800">
                                The completed sudoku grid shows the solution. Each row, column, and 3×2 box contains the numbers 1-6 exactly once.
                            </div>
                        </div>
                    ))}
                </WorksheetSectionWrapper>
            )}
        </>
    )
}
