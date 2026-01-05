import React from 'react';
import { makeRng } from '../utils/printableUtils';
import { WorksheetSectionWrapper } from './printables/PrintableShared';

// Standard props expected by worksheet components
import { useTranslation } from '@/context/TranslationContext';

interface MathMazeWorksheetsProps {
    docId: string;
    seed: string;
    variant: number;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
}

export const MathMazeWorksheets: React.FC<MathMazeWorksheetsProps> = ({ docId, seed: effectiveSeed, variant, showAnswersForDoc }) => {
    const { t } = useTranslation();
    const getTrans = (key: string, fallback: string) => {
        const fullKey = key.includes('.') ? key : `worksheets.${docId}.${key}`;
        const translated = t(fullKey);
        return translated && translated !== fullKey && !translated.startsWith('worksheets.') ? translated : fallback;
    };

    // activeDocs check is not needed if only rendered when active, but if we want to keep it safe we can just ignore it or remove it. 
    // The previous code checked activeDocs from commonProps. Since we don't pass activeDocs, we assume if it's rendered, it's active.




    const mathMazeCells = React.useMemo(() => {
        const cells: string[] = [];
        // makeRng expects a seed string
        const rng = makeRng(`${effectiveSeed}|math-maze|v${variant}`);
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (r === 0 && c === 0) {
                    cells.push('S');
                    continue;
                }
                if (r === 6 && c === 6) {
                    cells.push('F');
                    continue;
                }
                const useAddition = rng() < 0.7;
                if (useAddition) {
                    let a = Math.floor(rng() * 9) + 1;
                    let b = Math.floor(rng() * 9) + 1;
                    // limit sum to 18 for simplicity or up to 20? 
                    // Original logic was: if (a + b > 18) b = Math.max(1, 18 - a)
                    // Preserving original logic:
                    if (a + b > 18) b = Math.max(1, 18 - a);
                    cells.push(`${a}+${b}`);
                } else {
                    const big = Math.floor(rng() * 9) + 1;
                    const small = Math.floor(rng() * (big + 1));
                    cells.push(`${big}-${small}`);
                }
            }
        }
        return cells;
    }, [effectiveSeed, variant]);

    // Helper to solve cell for answer key
    const solveCell = (cell: string) => {
        if (cell === 'S') return 'Start';
        if (cell === 'F') return 'Finish';
        if (cell.includes('+')) {
            const [a, b] = cell.split('+').map(Number);
            return a + b;
        }
        if (cell.includes('-')) {
            const [a, b] = cell.split('-').map(Number);
            return a - b;
        }
        return '?';
    };

    return (
        <WorksheetSectionWrapper
            docId="math-maze"
            title={getTrans('worksheets.mathMaze.title', 'Math Maze Challenge')}
            emoji={String.fromCodePoint(0x1F9E9)} // Puzzle 🧩
            description={getTrans('worksheets.mathMaze.description', 'Find your way from Start (S) to Finish (F). Solve the math problems as you go!')}
            problemCount={49}
            learningObjectives={[
                'Practice basic addition within 20',
                'Practice basic subtraction within 10',
                'Develop critical thinking and pathfinding skills',
                'Build fluency with mental math'
            ]}
            parentTeacherTips={[
                'Encourage the child to solve the problem before moving to the next square',
                'Use a finger to trace a path first',
                'Have the child color in the path they take',
                'Timed Challenge: See how fast they can reach the finish!'
            ]}
        >
            {/* Decorative Header */}
            <div className="print:hidden h-2 w-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-pulse mb-6" />

            {/* Modern Grid Layout */}
            <div className="flex justify-center break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                <div className="inline-grid grid-cols-7 gap-1 p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl border-4 border-indigo-200 shadow-md print:shadow-none print:border-slate-300 print:bg-none print:p-0">
                    {mathMazeCells.map((cell, i) => {
                        const isStart = cell === 'S';
                        const isFinish = cell === 'F';

                        // Layout classes
                        const baseClasses = "flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 text-sm sm:text-lg font-bold rounded shadow-sm border-2 print:shadow-none print:w-14 print:h-14";

                        // Color Logic
                        let colorClasses = "bg-white border-indigo-100 text-slate-700";
                        if (isStart) colorClasses = "bg-emerald-400 border-emerald-500 text-white animate-pulse-slow print:bg-emerald-100 print:text-emerald-900 print:border-emerald-300";
                        if (isFinish) colorClasses = "bg-rose-400 border-rose-500 text-white animate-pulse-slow print:bg-rose-100 print:text-rose-900 print:border-rose-300";

                        return (
                            <div
                                key={i}
                                className={`${baseClasses} ${colorClasses}`}
                            >
                                {cell}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Instructions / Legend */}
            <div className="mt-6 flex justify-center gap-6 text-sm text-slate-600 print:text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-400 border border-emerald-500 print:bg-emerald-100" />
                    <span><strong>S</strong> = Start</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-400 border border-rose-500 print:bg-rose-100" />
                    <span><strong>F</strong> = Finish</span>
                </div>
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'auto', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm flex items-center gap-2">
                    <span>{String.fromCodePoint(0x1F680)}</span>
                    <span>Extra Challenge!</span>
                </div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Find a path where all the answers are <strong>even numbers</strong>.</div>
                    <div>2. Find a path where all the answers are <strong>odd numbers</strong>.</div>
                    <div>3. What is the sum of the first 5 boxes you stepped on?</div>
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-4 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'auto', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)} Self Check</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I found the Start and Finish</div>
                    <div>{String.fromCharCode(0x2610)} I solved the addition problems</div>
                    <div>{String.fromCharCode(0x2610)} I solved the subtraction problems</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{getTrans('common.myScore', 'My score:')}</strong> ___________________
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>

            {/* Answer Key */}
            {showAnswersForDoc('math-maze', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} Solved Grid</div>
                    <div className="flex justify-center">
                        <div className="inline-grid grid-cols-7 gap-1 p-1 bg-white border border-slate-200">
                            {mathMazeCells.map((cell, i) => (
                                <div key={i} className="flex items-center justify-center w-8 h-8 text-xs border border-slate-100 bg-emerald-50 text-emerald-900 font-mono">
                                    {solveCell(cell)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-emerald-700 mt-2 text-center">
                        (Values shown are the answers to each box)
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
};

export default MathMazeWorksheets;
