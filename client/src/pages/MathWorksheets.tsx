import React from 'react';
import { WorksheetSectionWrapper, getWorksheetTheme } from './PrintablesPage';
import { makeRng, shuffleArray } from '@/utils/printableUtils';
import { ExpandedForm200, NumberPatterns200, RoundingNearest10, AddThreeNumbers, MissingAddends, FactFamilies20, MentalMath20, MoneyCoinsBills, MeasurementLength, BarGraphsData, Add2Digit100, PlaceValueHTO } from './printables/SecondGradeMath';

function generateColorByNumber(seed: string) {
    const rng = makeRng(seed)
    const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]
    const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const themes = [
        {
            name: 'Rocket',
            emoji: '🚀',
            regions: [
                { id: 1, color: 'Red', hex: '#ef4444', path: 'M300,100 L350,200 H250 Z' }, // Top
                { id: 2, color: 'White', hex: '#ffffff', path: 'M250,200 H350 V350 H250 Z' }, // Body
                { id: 3, color: 'Blue', hex: '#3b82f6', path: 'M250,350 H350 L370,400 H230 Z' }, // Base
                { id: 4, color: 'Yellow', hex: '#eab308', path: 'M290,240 A10,10 0 1,1 310,240 A10,10 0 1,1 290,240' }, // Window
                { id: 5, color: 'Orange', hex: '#f97316', path: 'M250,300 L200,380 H250 Z M350,300 L400,380 H350 Z' }, // Fins
            ]
        },
        {
            name: 'Flower',
            emoji: '🌻',
            regions: [
                { id: 1, color: 'Yellow', hex: '#fcd34d', path: 'M300,250 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0' }, // Center
                { id: 2, color: 'Pink', hex: '#f472b6', path: 'M300,200 C250,150 200,200 250,250 M300,200 C350,150 400,200 350,250 M350,250 C400,300 350,350 300,300 M250,250 C200,300 250,350 300,300' }, // Petals (Simplified)
                { id: 3, color: 'Green', hex: '#4ade80', path: 'M300,300 V450 M300,380 Q350,350 380,380 Q350,410 300,380' }, // Stem & Leaf
                { id: 4, color: 'Blue', hex: '#60a5fa', path: 'M0,0 H600 V500 H0 Z' }, // Sky (Background - handled conceptually)
            ]
        }
    ]
    // Fallback simple SVG paths for Flower Petals because the above path string is broken/incomplete for a single path element usage visually without multiple paths.
    // Actually, let's stick to the Rocket for robustness, or simplified shapes.
    // Let's use robust Rocket and maybe a simple House.

    const robustThemes = [
        {
            name: 'Simple House',
            emoji: '🏠',
            regions: [
                { id: 1, color: 'Red', hex: '#ef4444', path: 'M200,200 L300,100 L400,200 Z' }, // Roof
                { id: 2, color: 'Blue', hex: '#3b82f6', path: 'M220,200 H380 V350 H220 Z' }, // Walls
                { id: 3, color: 'Yellow', hex: '#eab308', path: 'M250,230 H290 V270 H250 Z M310,230 H350 V270 H310 Z' }, // Windows
                { id: 4, color: 'Brown', hex: '#78350f', path: 'M280,350 V300 H320 V350 Z' }, // Door
                { id: 5, color: 'Green', hex: '#4ade80', path: 'M100,350 H500 V400 H100 Z' }, // Grass
            ]
        }
    ]

    const theme = pick([...themes.slice(0, 1), ...robustThemes])

    // Generate math problems for each ID
    const key = theme.regions.map(r => {
        // Generate a simple addition/subtraction problem that equals r.id
        // e.g. if id=1, prob = "0 + 1", "2 - 1"
        const isAdd = rng() > 0.5
        let a, b, problem

        if (isAdd) {
            a = randInt(0, r.id)
            b = r.id - a
            problem = `${a} + ${b}`
        } else {
            a = randInt(r.id, 10)
            b = a - r.id
            problem = `${a} - ${b}`
        }

        // Sometimes just give the number for very young kids? No, math practice is the goal.
        return { ...r, problem }
    })

    return { theme, key }
}


interface MathWorksheetsProps {
    docId: string;
    commonProps: {
        activeDocs: string[];
        showAnswers: boolean;
        docTitle: string;
        effectiveSeed: string;
        variant: number;
        showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
        t: (key: string, fallback?: string) => string;
        getTrans: (key: string, fallback?: string) => string;
        language: string;
    };
}

// Worked Example Component for addition-subtraction-0-10
function WorkedExampleContent({ t }: { t: (key: string, fallback?: string) => string }) {
    return (
        <div
            className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg print:border print:bg-white worked-example"
            style={{
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
                WebkitRegionBreakInside: 'avoid'
            } as React.CSSProperties}
        >
            <div
                className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2"
                style={{
                    pageBreakAfter: 'avoid',
                    breakAfter: 'avoid'
                } as React.CSSProperties}
            >
                <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                <span>{t('worksheets.addition-subtraction-0-10.workedExample.title')}</span>
            </div>
            <div className="space-y-3 text-sm">
                <div className="font-semibold text-base text-blue-900 math-problem"><strong>{t('worksheets.addition-subtraction-0-10.workedExample.problem', 'Problem:')}</strong> {t('worksheets.addition-subtraction-0-10.workedExample.problemText', '5 + 3 = ?')}</div>
                {/* Visual example with objects */}
                <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                    <svg viewBox="0 0 500 120" className="w-full h-auto">
                        {/* 5 blue circles */}
                        {Array.from({ length: 5 }).map((_, j) => (
                            <g key={j}>
                                <circle cx={40 + j * 50} cy="40" r="18" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                                <circle cx={40 + j * 50 - 4} cy="36" r="3" fill="#ffffff" />
                                <text x={40 + j * 50} y="45" fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="bold">{j + 1}</text>
                            </g>
                        ))}
                        {/* Plus sign */}
                        <text x="290" y="50" fontSize="32" fill="#1e40af" fontWeight="bold">+</text>
                        {/* 3 green circles */}
                        {Array.from({ length: 3 }).map((_, j) => (
                            <g key={j}>
                                <circle cx={330 + j * 50} cy="40" r="18" fill="#10b981" stroke="#059669" strokeWidth="2" />
                                <circle cx={330 + j * 50 - 4} cy="36" r="3" fill="#ffffff" />
                                <text x={330 + j * 50} y="45" fontSize="14" fill="#059669" textAnchor="middle" fontWeight="bold">{j + 1}</text>
                            </g>
                        ))}
                        {/* Equals */}
                        <text x="480" y="50" fontSize="32" fill="#1e40af" fontWeight="bold">=</text>
                    </svg>
                    <div className="text-center mt-2 text-blue-900 font-semibold">{t('worksheets.addition-subtraction-0-10.workedExample.countAll', 'Count all the circles: 5 + 3 = 8')}</div>
                </div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step1')}</strong></div>
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step2')}</strong></div>
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step3')}</strong></div>
                    <div className="font-semibold text-blue-900 mt-2"><strong>{t('worksheets.addition-subtraction-0-10.workedExample.answer', 'Answer:')}</strong> {t('worksheets.addition-subtraction-0-10.workedExample.answerText', '5 + 3 = 8')}</div>
                    <div className="text-xs text-blue-700 mt-2 flex items-center gap-1">
                        <span>💡</span>
                        <span>{t('worksheets.addition-subtraction-0-10.workedExample.tip')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChallengeAndAssessmentContent({ t, showAnswersForDoc }: { t: (key: string, fallback?: string) => string, showAnswersForDoc: any }) {
    return (
        <>
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border challenge-section" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. {t('worksheets.addition-subtraction-0-10.challenge.problem1')}</div>
                    <div>2. {t('worksheets.addition-subtraction-0-10.challenge.problem2')}</div>
                    <div>3. {t('worksheets.addition-subtraction-0-10.challenge.problem3')}</div>
                </div>
            </div>
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded self-assessment" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('worksheets.addition-subtraction-0-10.selfAssessment.score')}</strong> ___ / 12
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('worksheets.addition-subtraction-0-10.selfAssessment.hardest')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc('addition-subtraction-0-10', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always answer-key">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                        <div>{t('worksheets.addition-subtraction-0-10.answerKey.note')}</div>
                        <div className="text-xs text-emerald-700 mt-2">{String.fromCodePoint(0x2705)}</div>
                    </div>
                </div>
            ))}
        </>
    )
}

export const MathWorksheets: React.FC<MathWorksheetsProps> = ({ docId, commonProps }) => {
    const { activeDocs, effectiveSeed, variant, showAnswersForDoc, t, getTrans } = commonProps;

    if (!activeDocs.includes(docId)) return null;

    if (docId === 'addition-subtraction-0-10') {
        const docId = 'addition-subtraction-0-10';
        return (
            <WorksheetSectionWrapper
                docId={docId}
                title={getTrans(`worksheets.${docId}.title`, 'Addition & Subtraction 010')}
                emoji={String.fromCodePoint(0x2795)}
                description={getTrans(`worksheets.${docId}.description`, 'Use the number line if needed to solve each addition problem. Write the correct answer in the blank space provided.')}
                problemCount={12}
                learningObjectives={(() => {
                    const obj = t(`worksheets.${docId}.learningObjectives`)
                    if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') return obj
                    return [
                        'Add numbers within 10',
                        'Subtract numbers within 10',
                        'Use a number line to solve problems',
                        'Build fact fluency for addition and subtraction'
                    ]
                })()}
                parentTeacherTips={(() => {
                    const tips = t(`worksheets.${docId}.parentTeacherTips`)
                    if (Array.isArray(tips) && tips.length > 0 && typeof tips[0] === 'string') return tips
                    return [
                        'Use the number line: start at the first number, then move right for addition, left for subtraction',
                        'Encourage counting on for addition (e.g., 5 + 3: start at 5, count 3 more)',
                        'For subtraction, count backwards (e.g., 8 - 3: start at 8, count back 3)',
                        'Practice makes perfect - try to solve without the number line as you get better',
                        'Extension: Try solving problems mentally without using the number line'
                    ]
                })()}
            >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <WorkedExampleContent t={t} />
                <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const isAdd = i % 2 === 0;
                        const num1 = 2 + (i % 4);
                        const num2 = 1 + (i % 3);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const answer = isAdd ? num1 + num2 : num1 - num2;
                        return (
                            <div key={i} className="break-inside-avoid bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border-2 border-blue-200">
                                <svg viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                                    {/* Visual objects for counting */}
                                    <g>
                                        {/* First group of objects */}
                                        {Array.from({ length: num1 }).map((_, j) => {
                                            const col = j % 3;
                                            const row = Math.floor(j / 3);
                                            const x = 40 + col * 35;
                                            const y = 30 + row * 35;
                                            return (
                                                <g key={j}>
                                                    <circle cx={x} cy={y} r="12" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                                                    <circle cx={x - 3} cy={y - 3} r="2" fill="#ffffff" />
                                                </g>
                                            );
                                        })}
                                        {/* Plus or minus sign */}
                                        <text x={isAdd ? "140" : "140"} y="50" fontSize="36" fill="#1e40af" fontWeight="bold">
                                            {isAdd ? '+' : ''}
                                        </text>
                                        {/* Second group of objects */}
                                        {Array.from({ length: num2 }).map((_, j) => {
                                            const col = j % 3;
                                            const row = Math.floor(j / 3);
                                            const x = 180 + col * 35;
                                            const y = 30 + row * 35;
                                            return (
                                                <g key={j}>
                                                    <circle cx={x} cy={y} r="12" fill={isAdd ? "#10b981" : "#ef4444"} stroke={isAdd ? "#059669" : "#dc2626"} strokeWidth="2" />
                                                    <circle cx={x - 3} cy={y - 3} r="2" fill="#ffffff" />
                                                </g>
                                            );
                                        })}
                                        {/* Equals sign */}
                                        <text x="280" y="50" fontSize="36" fill="#1e40af" fontWeight="bold">=</text>
                                        {/* Answer box */}
                                        <rect x="310" y="20" width="60" height="50" rx="4" fill="white" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                                        <text x="340" y="50" fontSize="24" fill="#64748b" textAnchor="middle">?</text>
                                    </g>
                                    {/* Number line below */}
                                    <g fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.6">
                                        <path d="M40 140 H360" />
                                        {Array.from({ length: 11 }).map((__, k) => (
                                            <line key={k} x1={40 + k * 32} y1={140} x2={40 + k * 32} y2={130} />
                                        ))}
                                        {Array.from({ length: 11 }).map((__, k) => (
                                            <text key={k} x={40 + k * 32} y="155" fontSize="12" fill="#64748b" textAnchor="middle">{k}</text>
                                        ))}
                                    </g>
                                </svg>
                                {/* Answer label below - moved outside SVG to prevent overlap */}
                                <div className="text-center text-sm text-slate-600 mt-2">
                                    Answer: <span className="font-bold text-blue-700">?</span>
                                </div>
                                <div className="mt-2 text-xs text-center text-slate-600">
                                    {num1} {isAdd ? '+' : ''} {num2} = <span className="font-bold text-blue-700">___</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Extension/Challenge Problems */}
                <ChallengeAndAssessmentContent t={t} showAnswersForDoc={showAnswersForDoc} />
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'number-tracing-1-10') {
        const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

        return (
            <WorksheetSectionWrapper
                docId={docId}
                title="Rainbow Tracing: 110"
                emoji={String.fromCodePoint(0x1F4D1)}
                description="Trace each number 3 times! Use different colors (Red, Blue, Green) to make a rainbow."
                problemCount={10}
                learningObjectives={[
                    'Develop fine motor control through repetition',
                    'Learn proper number formation stroke order',
                    'Recognize numbers 110',
                    'Build muscle memory for writing'
                ]}
                parentTeacherTips={[
                    'Rainbow Tracing means tracing the same number multiple times with different colors.',
                    'Watch the start point (Green Dot) to ensure correct stroke direction.',
                    'Encourage big arm movements first, then precise finger movements.'
                ]}
            >
                {/* Rainbow Header Decorative */}
                <div className="print:hidden w-full h-16 mb-6 relative overflow-hidden bg-gradient-to-r from-red-100 via-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="font-bold text-3xl tracking-widest text-slate-700 opacity-50">{String.fromCodePoint(0x270F)}</div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 break-inside-avoid">
                    {numbers.map((n) => (
                        <div key={n} className="break-inside-avoid flex flex-col items-center">
                            <svg viewBox="0 0 200 200" className="w-full h-auto bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                                {/* Grid Lines for reference (light) */}
                                <line x1="20" y1="50" x2="180" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="20" y1="150" x2="180" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="20" y1="100" x2="180" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                                <g fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10">
                                    {(() => {
                                        const getPath = (digit: string, xOffset: number) => {
                                            switch (digit) {
                                                case '0': return { d: `M${100 + xOffset},50 Q${135 + xOffset},50 ${135 + xOffset},100 Q${135 + xOffset},150 ${100 + xOffset},150 Q${65 + xOffset},150 ${65 + xOffset},100 Q${65 + xOffset},50 ${100 + xOffset},50`, start: [100 + xOffset, 50] };
                                                case '1': return { d: `M${85 + xOffset},65 L${100 + xOffset},50 L${100 + xOffset},150`, start: [85 + xOffset, 65] };
                                                case '2': return { d: `M${75 + xOffset},75 Q${75 + xOffset},50 ${100 + xOffset},50 Q${125 + xOffset},50 ${125 + xOffset},75 Q${125 + xOffset},100 ${75 + xOffset},150 L${130 + xOffset},150`, start: [75 + xOffset, 75] };
                                                case '3': return { d: `M${75 + xOffset},60 Q${125 + xOffset},50 ${125 + xOffset},95 Q${125 + xOffset},100 ${100 + xOffset},100 Q${125 + xOffset},100 ${125 + xOffset},140 Q${125 + xOffset},150 ${75 + xOffset},150`, start: [75 + xOffset, 60] };
                                                case '4': return { d: `M${110 + xOffset},150 L${110 + xOffset},50 L${70 + xOffset},115 L${130 + xOffset},115`, start: [110 + xOffset, 50] };
                                                case '5': return { d: `M${125 + xOffset},50 L${80 + xOffset},50 L${80 + xOffset},90 Q${80 + xOffset},80 ${100 + xOffset},80 Q${130 + xOffset},80 ${130 + xOffset},120 Q${130 + xOffset},150 ${80 + xOffset},150`, start: [125 + xOffset, 50] };
                                                case '6': return { d: `M${120 + xOffset},50 Q${70 + xOffset},60 ${70 + xOffset},120 Q${70 + xOffset},150 ${100 + xOffset},150 Q${130 + xOffset},150 ${130 + xOffset},120 Q${130 + xOffset},100 ${100 + xOffset},100 Q${70 + xOffset},100 ${70 + xOffset},120`, start: [120 + xOffset, 50] };
                                                case '7': return { d: `M${70 + xOffset},50 L${130 + xOffset},50 L${90 + xOffset},150`, start: [70 + xOffset, 50] };
                                                case '8': return { d: `M${100 + xOffset},100 Q${130 + xOffset},100 ${130 + xOffset},75 Q${130 + xOffset},50 ${100 + xOffset},50 Q${70 + xOffset},50 ${70 + xOffset},75 Q${70 + xOffset},100 ${100 + xOffset},100 Q${70 + xOffset},100 ${70 + xOffset},125 Q${70 + xOffset},150 ${100 + xOffset},150 Q${130 + xOffset},150 ${130 + xOffset},125 Q${130 + xOffset},100 ${100 + xOffset},100`, start: [100 + xOffset, 50] };
                                                case '9': return { d: `M${130 + xOffset},80 Q${130 + xOffset},50 ${100 + xOffset},50 Q${70 + xOffset},50 ${70 + xOffset},80 Q${70 + xOffset},110 ${100 + xOffset},110 Q${130 + xOffset},110 ${130 + xOffset},80 L${130 + xOffset},150`, start: [130 + xOffset, 80] };
                                                default: return { d: '', start: [0, 0] };
                                            }
                                        };

                                        if (n < 10) {
                                            const p = getPath(n.toString(), 0);
                                            return (
                                                <g>
                                                    <path d={p.d} />
                                                    <circle cx={p.start[0]} cy={p.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                </g>
                                            )
                                        } else {
                                            const s = n.toString();
                                            const p1 = getPath(s[0], -35);
                                            const p2 = getPath(s[1], 35);
                                            return (
                                                <g>
                                                    <path d={p1.d} />
                                                    <circle cx={p1.start[0]} cy={p1.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                    <path d={p2.d} />
                                                    <circle cx={p2.start[0]} cy={p2.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                </g>
                                            )
                                        }
                                    })()}
                                </g>
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                    <div className="space-y-2 text-sm text-purple-800">
                        <div>{String.fromCodePoint(0x1F680)}</div>
                        <div>2. Count objects around you: How many can you find of each number?</div>
                        <div>3. Draw your own numbers and trace them!</div>
                    </div>
                </div>

                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                    <div className="space-y-2 text-xs">
                        <div>{String.fromCodePoint(0x270F)}</div>
                        <div>{String.fromCharCode(0x2610)} I can trace numbers following the lines</div>
                        <div>{String.fromCharCode(0x2610)} I can say the number names</div>
                    </div>
                    <div className="mt-3 text-xs">
                        <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 10
                    </div>
                    <div className="mt-2 text-xs">
                        <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                    </div>
                </div>

                {showAnswersForDoc('number-tracing-1-10', () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                        <div className="space-y-2 text-sm text-emerald-800">
                            <div>Trace each number following the dashed lines. Start at the green dot to begin correctly.</div>
                            <div className="mt-2">Use different colors for rainbow tracing!</div>
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'number-tracing-1-20') {
        const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

        return (
            <WorksheetSectionWrapper
                docId={docId}
                title="Rainbow Tracing: 120"
                emoji={String.fromCodePoint(0x1F4D1)}
                description="Trace each number 3 times! Use different colors (Red, Blue, Green) to make a rainbow."
                problemCount={20}
                learningObjectives={[
                    'Develop fine motor control through repetition',
                    'Learn proper number formation stroke order',
                    'Recognize numbers 120',
                    'Build muscle memory for writing'
                ]}
                parentTeacherTips={[
                    'Rainbow Tracing means tracing the same number multiple times with different colors.',
                    'Watch the start point (Green Dot) to ensure correct stroke direction.',
                    'Encourage big arm movements first, then precise finger movements.'
                ]}
            >
                {/* Rainbow Header Decorative */}
                <div className="print:hidden w-full h-16 mb-6 relative overflow-hidden bg-gradient-to-r from-red-100 via-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="font-bold text-3xl tracking-widest text-slate-700 opacity-50">{String.fromCodePoint(0x270F)}</div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 break-inside-avoid">
                    {numbers.map((n) => (
                        <div key={n} className="break-inside-avoid flex flex-col items-center">
                            <svg viewBox="0 0 200 200" className="w-full h-auto bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                                {/* Grid Lines for reference (light) */}
                                <line x1="20" y1="50" x2="180" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="20" y1="150" x2="180" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="20" y1="100" x2="180" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                                <g fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10">
                                    {(() => {
                                        const getPath = (digit: string, xOffset: number) => {
                                            // Coordinates optimized for 200x200 box, digit approx 100px tall
                                            switch (digit) {
                                                case '0': return { d: `M${100 + xOffset},50 Q${135 + xOffset},50 ${135 + xOffset},100 Q${135 + xOffset},150 ${100 + xOffset},150 Q${65 + xOffset},150 ${65 + xOffset},100 Q${65 + xOffset},50 ${100 + xOffset},50`, start: [100 + xOffset, 50] };
                                                case '1': return { d: `M${85 + xOffset},65 L${100 + xOffset},50 L${100 + xOffset},150`, start: [85 + xOffset, 65] };
                                                case '2': return { d: `M${75 + xOffset},75 Q${75 + xOffset},50 ${100 + xOffset},50 Q${125 + xOffset},50 ${125 + xOffset},75 Q${125 + xOffset},100 ${75 + xOffset},150 L${130 + xOffset},150`, start: [75 + xOffset, 75] };
                                                case '3': return { d: `M${75 + xOffset},60 Q${125 + xOffset},50 ${125 + xOffset},95 Q${125 + xOffset},100 ${100 + xOffset},100 Q${125 + xOffset},100 ${125 + xOffset},140 Q${125 + xOffset},150 ${75 + xOffset},150`, start: [75 + xOffset, 60] };
                                                case '4': return { d: `M${110 + xOffset},150 L${110 + xOffset},50 L${70 + xOffset},115 L${130 + xOffset},115`, start: [110 + xOffset, 50] }; // Start top
                                                case '5': return { d: `M${125 + xOffset},50 L${80 + xOffset},50 L${80 + xOffset},90 Q${80 + xOffset},80 ${100 + xOffset},80 Q${130 + xOffset},80 ${130 + xOffset},120 Q${130 + xOffset},150 ${80 + xOffset},150`, start: [125 + xOffset, 50] };
                                                case '6': return { d: `M${120 + xOffset},50 Q${70 + xOffset},60 ${70 + xOffset},120 Q${70 + xOffset},150 ${100 + xOffset},150 Q${130 + xOffset},150 ${130 + xOffset},120 Q${130 + xOffset},100 ${100 + xOffset},100 Q${70 + xOffset},100 ${70 + xOffset},120`, start: [120 + xOffset, 50] };
                                                case '7': return { d: `M${70 + xOffset},50 L${130 + xOffset},50 L${90 + xOffset},150`, start: [70 + xOffset, 50] };
                                                case '8': return { d: `M${100 + xOffset},100 Q${130 + xOffset},100 ${130 + xOffset},75 Q${130 + xOffset},50 ${100 + xOffset},50 Q${70 + xOffset},50 ${70 + xOffset},75 Q${70 + xOffset},100 ${100 + xOffset},100 Q${70 + xOffset},100 ${70 + xOffset},125 Q${70 + xOffset},150 ${100 + xOffset},150 Q${130 + xOffset},150 ${130 + xOffset},125 Q${130 + xOffset},100 ${100 + xOffset},100`, start: [100 + xOffset, 50] }; // Start Center/Top? usually S
                                                case '9': return { d: `M${130 + xOffset},80 Q${130 + xOffset},50 ${100 + xOffset},50 Q${70 + xOffset},50 ${70 + xOffset},80 Q${70 + xOffset},110 ${100 + xOffset},110 Q${130 + xOffset},110 ${130 + xOffset},80 L${130 + xOffset},150`, start: [130 + xOffset, 80] }; // Start Right side?
                                                default: return { d: '', start: [0, 0] };
                                            }
                                        };

                                        if (n < 10) {
                                            const p = getPath(n.toString(), 0);
                                            return (
                                                <g>
                                                    <path d={p.d} />
                                                    {/* Start Dot */}
                                                    <circle cx={p.start[0]} cy={p.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                </g>
                                            )
                                        } else {
                                            const s = n.toString();
                                            const p1 = getPath(s[0], -35); // Shift left
                                            const p2 = getPath(s[1], 35);  // Shift right
                                            return (
                                                <g>
                                                    <path d={p1.d} />
                                                    <circle cx={p1.start[0]} cy={p1.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                    <path d={p2.d} />
                                                    <circle cx={p2.start[0]} cy={p2.start[1]} r="6" fill="#22c55e" stroke="none" />
                                                </g>
                                            )
                                        }
                                    })()}
                                </g>
                            </svg>
                            {/* Number Label */}
                            <div className="mt-2 text-2xl font-bold text-slate-400">{n}</div>
                        </div>
                    ))}
                </div>

                {showAnswersForDoc(docId, () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                        <div className="text-sm text-emerald-800">
                            <p>All numbers 1-20 are displayed. Ensure the student traces following the lines, starting at the <strong>Green Dot</strong>.</p>
                            <p className="mt-2 text-xs">Correction Tip: If stroke order is incorrect, guide their hand gently to start at the dot.</p>
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'place-value-hto') {
        return <PlaceValueHTO {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId.includes('color-by-number')) {
        const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${docId}`)
        const data = generateColorByNumber(`${effectiveSeed}|${docId}`)

        return (
            <WorksheetSectionWrapper
                docId={docId}
                title={`${data.theme.name} Color by Number`}
                emoji="🎨"
                description={`Solve the math problems to color the ${data.theme.name}.`}
                problemCount={data.key.length}
            >
                <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
                    {/* Legend / Key */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold mb-4 text-slate-800">Color Key:</h3>
                        <div className="space-y-3">
                            {data.key.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded border border-slate-300 shadow-sm" style={{ backgroundColor: item.hex }}></div>
                                    <div className="font-mono text-lg font-bold text-slate-700">{item.problem}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SVG Canvas */}
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-center">
                        <div className="w-full max-w-lg aspect-square relative">
                            <svg viewBox="0 0 600 600" className="w-full h-full">
                                {data.theme.regions.map((item, i) => (
                                    <g key={i}>
                                        <path
                                            d={item.path}
                                            fill="white"
                                            stroke="#1e293b"
                                            strokeWidth="2"
                                        />
                                        <text
                                            x="0"
                                            y="0"
                                            fill="#64748b"
                                            fontSize="14"
                                            fontWeight="bold"
                                            className="select-none pointer-events-none"
                                        >
                                            <animate attributeName="x" from="0" to="0" dur="0s" fill="freeze" />
                                        </text>
                                    </g>
                                ))}

                                {/* Re-render paths with numbers using basic regex to find first coordinate */}
                                {data.key.map((item, i) => {
                                    const match = item.path.match(/M\s?(\d+)[,\s](\d+)/)
                                    const x = match ? parseInt(match[1]) + 20 : 0
                                    const y = match ? parseInt(match[2]) + 20 : 0
                                    return (
                                        <text key={i} x={x} y={y} fontSize="20" fontWeight="bold" fill="#1e293b">{item.id}</text>
                                    )
                                })}
                            </svg>
                        </div>
                    </div>

                    {showAnswersForDoc(docId, () => (
                        <div className="mt-4 p-4 border rounded font-mono text-sm text-center">
                            {data.key.map(k => `${k.problem} = ${k.id} (${k.color})`).join(', ')}
                        </div>
                    ))}
                </div>
            </WorksheetSectionWrapper>
        )
    }

    if (docId === 'expanded-form-200') {
        return <ExpandedForm200 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'number-patterns-200') {
        return <NumberPatterns200 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'rounding-nearest-10') {
        return <RoundingNearest10 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'add-three-numbers') {
        return <AddThreeNumbers {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'missing-addends') {
        return <MissingAddends {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'fact-families-20') {
        return <FactFamilies20 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'mental-math-20') {
        return <MentalMath20 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'money-coins-bills') {
        return <MoneyCoinsBills {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'measurement-length') {
        return <MeasurementLength {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'bar-graphs-data') {
        return <BarGraphsData {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }

    if (docId === 'add-2digit-100') {
        return <Add2Digit100 {...{ showAnswersForDoc, seed: effectiveSeed, variant }} />
    }




    return null;
}
