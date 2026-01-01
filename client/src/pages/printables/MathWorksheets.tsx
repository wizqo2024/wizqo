import React from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, WorkedExampleContent } from './PrintableShared'
import { makeRng, shuffleArray } from '@/utils/printableUtils'

interface SpecificWorksheetProps {
    // docId is often implied by the component, but passed for consistency if needed
    docId?: string
    activeDocs?: string[]
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
    seed: string
    variant: number
    onBundleAnswer?: (docId: string, title: string, content: ReactNode) => void
}

export function AdditionSubtraction0To10({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'addition-subtraction-0-10'

    const ChallengeAndAssessmentContent = () => (
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

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Addition & Subtraction 010')}
            emoji={String.fromCodePoint(0x2795)}
            description={t(`worksheets.${docId}.description`, 'Use the number line if needed to solve each addition problem. Write the correct answer in the blank space provided.')}
            problemCount={12}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') return obj as unknown as string[]
                return [
                    'Add numbers within 10',
                    'Subtract numbers within 10',
                    'Use a number line to solve problems',
                    'Build fact fluency for addition and subtraction'
                ]
            })()}
            parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                if (Array.isArray(tips) && tips.length > 0 && typeof tips[0] === 'string') return tips as unknown as string[]
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
            <WorkedExampleContent />
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {Array.from({ length: 12 }).map((_, i) => {
                    const isAdd = i % 2 === 0;
                    const num1 = 2 + (i % 4);
                    const num2 = 1 + (i % 3);

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
            {ChallengeAndAssessmentContent()}
        </WorksheetSectionWrapper>
    )
}

export function TenFrames1To10({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'ten-frames-1-10'
    const doc = docId

    // Initialize RNG for stable theme selection
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);
    const themes = ['apples', 'stars', 'cookies', 'buttons'];
    const theme = themes[Math.floor(rng() * themes.length)];

    // Generate customized problems (1-10, shuffled or ordered based on variant)
    let numbers = Array.from({ length: 10 }, (_, n) => n + 1);
    // Explicitly casting to any to work around potential TS issues if needed, but array method should work
    if (variant > 0) {
        numbers = shuffleArray(numbers, rng);
    }

    // Theme Configuration
    const getThemeAssets = (t: string) => {
        switch (t) {
            case 'apples': return {
                icon: (filled: boolean) => (
                    <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                        {filled ? (
                            <path d="M50,25 C30,25 20,40 20,60 C20,85 35,95 50,95 C65,95 80,85 80,60 C80,40 70,25 50,25 Z M50,25 Q50,10 60,5" fill="#ef4444" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
                        ) : (
                            <path d="M50,25 C30,25 20,40 20,60 C20,85 35,95 50,95 C65,95 80,85 80,60 C80,40 70,25 50,25 Z" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4" />
                        )}
                    </svg>
                ),
                color: 'text-red-600',
                borderColor: 'border-red-200',
                bgColor: 'bg-red-50',
                title: 'Apple Picking',
                emoji: String.fromCodePoint(0x1F34E)
            };
            case 'stars': return {
                icon: (filled: boolean) => (
                    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                        <path d="M50,5 L61,35 L95,35 L68,55 L79,85 L50,65 L21,85 L32,55 L5,35 L39,35 Z"
                            fill={filled ? "#f59e0b" : "none"}
                            stroke={filled ? "#b45309" : "#cbd5e1"}
                            strokeWidth={filled ? "3" : "2"}
                            strokeDasharray={filled ? "" : "4 4"}
                        />
                    </svg>
                ),
                color: 'text-amber-600',
                borderColor: 'border-amber-200',
                bgColor: 'bg-amber-50',
                title: 'Super Stars',
                emoji: String.fromCodePoint(0x2B50)
            };
            case 'cookies': return {
                icon: (filled: boolean) => (
                    <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                        <circle cx="50" cy="50" r="40" fill={filled ? "#d97706" : "none"} stroke={filled ? "#92400e" : "#d1d5db"} strokeWidth={filled ? "3" : "2"} strokeDasharray={filled ? "" : "4 4"} />
                        {filled && (
                            <g fill="#78350f">
                                <circle cx="35" cy="40" r="4" />
                                <circle cx="65" cy="45" r="4" />
                                <circle cx="50" cy="65" r="4" />
                                <circle cx="45" cy="25" r="4" />
                            </g>
                        )}
                    </svg>
                ),
                color: 'text-amber-700',
                borderColor: 'border-amber-200',
                bgColor: 'bg-orange-50',
                title: 'Yummy Cookies',
                emoji: String.fromCodePoint(0x270F)
            };
            default: return { // Buttons
                icon: (filled: boolean) => (
                    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                        <circle cx="50" cy="50" r="40" fill={filled ? "#3b82f6" : "none"} stroke={filled ? "#1e40af" : "#cbd5e1"} strokeWidth="3" strokeDasharray={filled ? "" : "4 4"} />
                        {filled && (
                            <g fill="white">
                                <circle cx="35" cy="50" r="4" />
                                <circle cx="65" cy="50" r="4" />
                                <circle cx="50" cy="35" r="4" />
                                <circle cx="50" cy="65" r="4" />
                            </g>
                        )}
                    </svg>
                ),
                color: 'text-blue-600',
                borderColor: 'border-blue-200',
                bgColor: 'bg-blue-50',
                title: 'Button Counting',
                emoji: String.fromCodePoint(0x1F4A1)
            }
        }
    }

    const themeData = getThemeAssets(theme);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={`${themeData.title}: Ten Frame Counting`}
            emoji={themeData.emoji}
            description={`Count the ${theme}. Trace the number, then write it in the box.`}
            problemCount={numbers.length}
            learningObjectives={[
                'Compose and decompose numbers up to 10',
                'Connect number quantities to numerals',
                'Develop subitizing skills (instantly seeing "how many")',
                'Practice number formation'
            ]}
            parentTeacherTips={[
                `Ask: "How many ${theme} do you see?"`,
                'Ask: "How many more do we need to make 10?"',
                'Encourage your child to count out loud as they point to each item.',
                'Trace the dashed number first to practice the motion.'
            ]}
        >
            <div className={`print:hidden h-1 w-full rounded-full bg-slate-100 mb-6 overflow-hidden`}>
                <div className={`h-full w-1/3 ${themeData.bgColor.replace('bg-', 'bg-')} bg-current opacity-50`}></div>
            </div>

            {/* 2-Column Layout for problems */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" style={{ pageBreakAfter: 'auto' }}>
                {numbers.map((n, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${themeData.borderColor} ${themeData.bgColor} print:border-slate-300 print:bg-white break-inside-avoid relative`}>

                        {/* Number Badge */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm print:hidden">
                            #{idx + 1}
                        </div>

                        {/* Ten Frame */}
                        <div className="bg-white border-4 border-slate-800 rounded-lg p-1 shadow-sm">
                            <div className="grid grid-cols-5 grid-rows-2 gap-1 w-40 h-20">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="border border-slate-200 rounded flex items-center justify-center relative">
                                        {/* Render icon if index < n */}
                                        {themeData.icon(i < n)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interaction Area */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 border-l-2 border-dashed border-slate-300 pl-4 h-full">
                            <div className="flex items-end gap-3">
                                {/* Tracing Number */}
                                <div className={`text-6xl font-outline-2 font-mono text-slate-200 relative`} style={{ fontFamily: '"Inter", sans-serif', fontWeight: 900, WebkitTextStroke: '2px #cbd5e1', color: 'transparent' }}>
                                    {n}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                                        {/* Dashed overlay for tracing effect - simplified */}
                                        <text x="50%" y="85%" textAnchor="middle" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" fontSize="1em" dy="-0.1em">{n}</text>
                                    </svg>
                                </div>

                                {/* Arrow pointing to writing box */}
                                <div className="text-2xl text-slate-300">{String.fromCodePoint(0x270F)}</div>
                            </div>

                            {/* Writing Box */}
                            <div className="w-16 h-16 border-2 border-slate-400 rounded-lg bg-white shadow-inner flex items-center justify-center">
                                {/* Empty box for student to write */}
                            </div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Write</div>
                        </div>

                    </div>
                ))}
            </div>

            {showAnswersForDoc('ten-frames-1-10', () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-2xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-3 mb-4 border-b border-emerald-200 pb-2">
                        <span className="text-2xl">{String.fromCodePoint(0x2705)}</span>
                        <h3 className="text-lg font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {numbers.map((n, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-xs text-emerald-700 font-medium mb-1">#{idx + 1}</div>
                                <div className="text-2xl font-black text-emerald-800">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </WorksheetSectionWrapper>
    )
}

export function PlaceValueHTO({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'place-value-hto'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
    const nums = (() => {
        const set = new Set<number>();
        while (set.size < 8) {
            set.add(nextInt(10, 99));
        }
        return Array.from(set);
    })();

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Place Value  Tens and Ones (to 99)')}
            emoji={String.fromCodePoint(0x1F518)}
            description={t(`worksheets.${docId}.description`, 'Write how many tens and ones in each number. Then write the complete number in expanded form in the blank spaces.')}
            problemCount={nums.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string') return obj as unknown as string[]
                return [
                    'Understand place value: tens and ones',
                    'Break numbers into tens and ones',
                    'Write numbers in expanded form'
                ]
            })()}
            parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                if (Array.isArray(tips) && tips.length > 0 && typeof tips[0] === 'string') return tips as unknown as string[]
                return [
                    'The tens place tells how many groups of 10',
                    'The ones place tells how many extra ones',
                    'Expanded form shows the value of each place',
                    'Example: 47 = 4 tens + 7 ones = 40 + 7',
                    'Extension: Try with 3-digit numbers (hundreds, tens, ones)'
                ]
            })()}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 print:mb-1 p-4 print:p-1.5 bg-gradient-to-br from-violet-50 to-pink-50 border-2 border-violet-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-violet-900 mb-3 print:mb-0.5 text-sm print:text-[9px] flex items-center gap-2 print:gap-1">
                    <span className="text-2xl print:text-sm">{String.fromCodePoint(0x279C)}</span>
                    <span>{t(`worksheets.${docId}.example.title`, 'Example - Let\'s solve this together:')}</span>
                </div>
                <div className="space-y-3 print:space-y-0.5 text-sm print:text-[8px]">
                    <div className="font-semibold text-base print:text-[9px] text-violet-900"><strong>{t(`worksheets.${docId}.example.number`, 'Number:')}</strong> <span className="text-3xl print:text-lg text-violet-700 ml-2">47</span></div>
                    {/* Visual base-10 blocks with proper spacing */}
                    <div className="bg-white p-4 print:p-1 rounded-lg border-2 border-violet-300">
                        <div className="flex flex-wrap items-center gap-4 print:gap-1">
                            {/* Tens blocks with label */}
                            <div className="flex flex-col items-center gap-2 print:gap-0.5">
                                <svg viewBox="0 0 240 80" className="w-auto h-20 print:h-8" preserveAspectRatio="xMidYMid meet">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <rect key={j} x={15 + j * 55} y="15" width="45" height="65" rx="4" fill="#22c55e" stroke="#16a34a" strokeWidth="2.5" />
                                    ))}
                                </svg>
                                <div className="text-sm print:text-[8px] font-bold text-green-700 whitespace-nowrap">{t(`worksheets.${docId}.example.tensLabel`, '4 tens = 40')}</div>
                            </div>
                            {/* Ones blocks with label */}
                            <div className="flex flex-col items-center gap-2 print:gap-0.5">
                                <svg viewBox="0 0 250 50" className="w-auto h-16 print:h-6" preserveAspectRatio="xMidYMid meet">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <rect key={j} x={15 + j * 35} y="10" width="25" height="25" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
                                    ))}
                                </svg>
                                <div className="text-sm print:text-[8px] font-bold text-blue-700 whitespace-nowrap">{t(`worksheets.${docId}.example.onesLabel`, '7 ones = 7')}</div>
                            </div>
                            {/* Expanded form label */}
                            <div className="flex items-center">
                                <div className="text-base print:text-[9px] font-bold text-violet-700 whitespace-nowrap">{t(`worksheets.${docId}.example.expandedLabel`, '47 = 40 + 7')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="pl-4 print:pl-1 border-l-2 border-violet-300 space-y-1 print:space-y-0">
                        <div className="print:text-[8px] print:leading-[1.1]"><strong>{t(`worksheets.${docId}.example.step1`, 'Step 1: Find tens:')}</strong> <span className="text-violet-700 font-bold">{t(`worksheets.${docId}.example.step1Text`, '47 has 4 tens (40)')}</span></div>
                        <div className="print:text-[8px] print:leading-[1.1]"><strong>{t(`worksheets.${docId}.example.step2`, 'Step 2: Find ones:')}</strong> <span className="text-violet-700 font-bold">{t(`worksheets.${docId}.example.step2Text`, '47 has 7 ones')}</span></div>
                        <div className="print:text-[8px] print:leading-[1.1]"><strong>{t(`worksheets.${docId}.example.step3`, 'Step 3: Expanded form:')}</strong> <span className="text-violet-700 font-bold text-lg print:text-[9px]">{t(`worksheets.${docId}.example.step3Text`, '40 + 7')}</span></div>
                        <div className="font-semibold text-violet-900 mt-2 print:mt-0 print:text-[8px] print:leading-[1.1]"><strong>{t(`worksheets.${docId}.example.answer`, 'Answer:')}</strong> <span className="text-violet-700">{t(`worksheets.${docId}.example.answerText`, 'Tens: 4, Ones: 7, Expanded: 40 + 7')}</span></div>
                        <div className="text-xs print:text-[7px] text-violet-700 mt-2 print:mt-0 flex items-center gap-1 print:leading-[1.1]">
                            <span>{String.fromCodePoint(0x279C)}</span>
                            <span>{t(`worksheets.${docId}.example.tip`, 'Tip: The tens digit tells you how many groups of 10, the ones digit tells you how many extra ones!')}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Visual legend */}
            <div className="mb-4 print:mb-0.5 flex flex-wrap items-center gap-4 print:gap-1 text-sm print:text-[8px] bg-violet-50 p-3 print:p-1 rounded-lg border border-violet-200">
                <div className="flex items-center gap-2 print:gap-1">
                    <svg viewBox="0 0 25 50" className="h-12 print:h-4 w-auto flex-shrink-0">
                        <rect x="10" y="10" width="15" height="30" rx="3" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                    </svg>
                    <span className="text-green-700 font-bold whitespace-nowrap">{t(`worksheets.${docId}.legend.tenLabel`, '= 1 Ten (10)')}</span>
                </div>
                <div className="flex items-center gap-2 print:gap-1">
                    <svg viewBox="0 0 60 30" className="h-8 print:h-3 w-auto flex-shrink-0">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <rect key={i} x={10 + i * 18} y="10" width="12" height="12" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" />
                        ))}
                    </svg>
                    <span className="text-blue-700 font-bold whitespace-nowrap">{t(`worksheets.${docId}.legend.oneLabel`, '= 1 One')}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-1 break-inside-auto" style={{ pageBreakAfter: 'auto' }}>
                {nums.map((n, i) => {
                    const tens = Math.floor(n / 10);
                    const ones = n % 10;
                    return (
                        <div key={i} className="border-2 border-violet-200 rounded-lg p-4 print:p-1.5 bg-gradient-to-br from-violet-50 to-pink-50 break-inside-avoid">
                            <div className="text-violet-900 font-semibold mb-3 print:mb-0.5 text-lg print:text-sm">{t(`worksheets.${docId}.labels.number`, 'Number:')} <span className="text-2xl print:text-lg">{n}</span></div>
                            {/* Visual base-10 blocks */}
                            <div className="mb-4 print:mb-1 bg-white p-3 print:p-1 rounded border border-violet-300">
                                <div className="flex flex-col items-center gap-2">
                                    <svg viewBox="0 0 280 70" className="w-full h-auto max-h-16" preserveAspectRatio="xMidYMid meet">
                                        {/* Tens rods */}
                                        {Array.from({ length: Math.min(tens, 5) }).map((_, j) => (
                                            <rect key={j} x={5 + j * 38} y="5" width="35" height="55" rx="3" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                                        ))}
                                        {/* Ones cubes */}
                                        {Array.from({ length: Math.min(ones, 8) }).map((_, j) => (
                                            <rect key={j} x={5 + j * 28} y="65" width="20" height="20" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" />
                                        ))}
                                    </svg>
                                    {tens > 5 && (
                                        <div className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                            {t('worksheets.place-value-hto.labels.more', '+{count} more').replace('{count}', String(tens - 5))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 print:gap-1.5 text-sm print:text-xs">
                                <div className="border-2 border-violet-300 rounded p-2.5 print:p-1.5 bg-white">
                                    <div className="text-xs print:text-[10px] text-violet-600 mb-1.5 print:mb-0.5">{t(`worksheets.${docId}.labels.tens`, 'Tens:')}</div>
                                    <div className="text-violet-900 font-mono text-base print:text-sm">______</div>
                                </div>
                                <div className="border-2 border-violet-300 rounded p-2.5 print:p-1.5 bg-white">
                                    <div className="text-xs print:text-[10px] text-violet-600 mb-1.5 print:mb-0.5">{t(`worksheets.${docId}.labels.ones`, 'Ones:')}</div>
                                    <div className="text-violet-900 font-mono text-base print:text-sm">______</div>
                                </div>
                                <div className="border-2 border-violet-300 rounded p-2.5 print:p-1.5 bg-white">
                                    <div className="text-xs print:text-[10px] text-violet-600 mb-1.5 print:mb-0.5">{t(`worksheets.${docId}.labels.expanded`, 'Expanded:')}</div>
                                    <div className="text-violet-900 font-mono text-xs print:text-[10px] leading-tight">___ + ___</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-2 p-4 print:p-2 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'auto', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 print:mb-1 text-sm print:text-xs">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 print:space-y-1 text-sm print:text-xs text-purple-800">
                    {(() => {
                        const items = t(`worksheets.${docId}.challenge.items`)
                        const fallbackItems = [
                            'Write 56 in expanded form: ___ + ___',
                            'What number has 8 tens and 3 ones? ___',
                            'Can you write a 3-digit number in expanded form? (hundreds, tens, ones)',
                        ]
                        const itemsArray = Array.isArray(items) && items.length > 0 && typeof items[0] === 'string' && items[0] !== `worksheets.${docId}.challenge.items` ? items : fallbackItems
                        return (itemsArray as unknown as string[]).map((item, i) => (
                            <div key={i}>{i + 1}. {item}</div>
                        ))
                    })()}
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 print:p-2 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 print:mb-1 text-sm print:text-xs">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    {(() => {
                        const items = t(`worksheets.${docId}.selfAssessment.items`)
                        const fallbackItems = [
                            'I understand tens and ones',
                            'I can break numbers into tens and ones',
                            'I can write numbers in expanded form',
                        ]
                        const itemsArray = Array.isArray(items) && items.length > 0 && typeof items[0] === 'string' && items[0] !== `worksheets.${docId}.selfAssessment.items` ? items : fallbackItems
                        return (itemsArray as unknown as string[]).map((item, i) => (
                            <div key={i}>{String.fromCodePoint(0x279C)}</div>
                        ))
                    })()}
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t(`worksheets.${docId}.selfAssessment.score`, 'My score:')}</strong> ___ / {nums.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t(`worksheets.${docId}.selfAssessment.hardest`, 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {nums.map((n, i) => {
                            const tens = Math.floor(n / 10); const ones = n % 10;
                            return (
                                <div key={i} className="text-sm text-emerald-800">
                                    {i + 1}. {n}: {t(`worksheets.${docId}.answerKey.tensLabel`, 'Tens')} <strong>{tens}</strong>, {t(`worksheets.${docId}.answerKey.onesLabel`, 'Ones')} <strong>{ones}</strong>, {t(`worksheets.${docId}.answerKey.expandedLabel`, 'Expanded')} <strong>{tens * 10} + {ones}</strong>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function Sub2Digit100({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'sub-2digit-100'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);
    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }
    function genPairs(count: number) {
        const out: Array<[number, number]> = [];
        let guard = 0;
        while (out.length < count && guard < 10000) {
            const a = nextInt(20, 99); // Min 20 to allow reasonable subtraction
            const b = nextInt(10, a);  // Ensure result is positive
            // No regrouping condition for subtraction: (a%10) >= (b%10)
            if ((a % 10) >= (b % 10)) out.push([a, b]);
            guard++;
        }
        return out;
    }
    const pairs = genPairs(10);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, '2-Digit Subtraction (No Regrouping)')}
            emoji={String.fromCodePoint(0x2796)}
            description={t(`worksheets.${docId}.description`, 'Subtract the two numbers. No regrouping (borrowing) needed.')}
            problemCount={pairs.length}
            learningObjectives={[
                'Subtract 2-digit numbers without regrouping',
                'Align numbers correctly by place value',
                'Subtract ones first, then tens'
            ]}
            parentTeacherTips={[
                'No regrouping means the top one is bigger than the bottom one',
                'Subtract the ones column first, then the tens column',
                'Make sure numbers are aligned correctly',
                'Extension: Check your answer by adding (part + part = whole)'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-red-400 to-orange-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-red-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                    <span>{t('common.example', "Example - Let's solve this together:")}</span>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="font-mono text-lg text-red-900"><strong>{t('common.problem', 'Problem:')}</strong> <span className="text-2xl">48 - 15 = ?</span></div>
                    {/* Visual representation */}
                    <div className="bg-white p-4 rounded-lg border-2 border-red-300 overflow-hidden">
                        <svg viewBox="0 0 600 180" className="w-full h-auto max-h-48" preserveAspectRatio="xMidYMid meet">
                            {/* 48 - 4 tens and 8 ones */}
                            <text x="10" y="25" fontSize="14" fill="#c026d3" fontWeight="bold">Start with 48:</text>
                            {/* 4 tens blocks */}
                            {Array.from({ length: 4 }).map((_, j) => (
                                <rect key={j} x={50 + j * 55} y="45" width="45" height="65" rx="4" fill="#e879f9" stroke="#c026d3" strokeWidth="2" />
                            ))}
                            {/* 8 ones */}
                            {Array.from({ length: 8 }).map((_, j) => (
                                <rect key={j} x={280 + j * 35} y="85" width="25" height="25" rx="2" fill="#f0abfc" stroke="#c026d3" strokeWidth="1.5" />
                            ))}

                            {/* Minus sign and what to take away */}
                            <text x="300" y="150" fontSize="14" fill="#dc2626" fontWeight="bold">Subtract 15 (1 ten, 5 ones)</text>

                            {/* Cross out animation effect static */}
                            <line x1="215" y1="45" x2="260" y2="110" stroke="#dc2626" strokeWidth="4" opacity="0.7" />
                            <line x1="260" y1="45" x2="215" y2="110" stroke="#dc2626" strokeWidth="4" opacity="0.7" />

                            {Array.from({ length: 5 }).map((_, j) => (
                                <g key={j}>
                                    <line x1={280 + (7 - j) * 35} y1="85" x2={305 + (7 - j) * 35} y2="110" stroke="#dc2626" strokeWidth="3" opacity="0.7" />
                                    <line x1={305 + (7 - j) * 35} y1="85" x2={280 + (7 - j) * 35} y2="110" stroke="#dc2626" strokeWidth="3" opacity="0.7" />
                                </g>
                            ))}

                            {/* Equals and answer */}
                            <text x="500" y="70" fontSize="28" fill="#c026d3" fontWeight="bold">=</text>
                            <text x="540" y="70" fontSize="28" fill="#c026d3" fontWeight="bold">33</text>
                        </svg>
                    </div>
                    <div className="pl-4 border-l-2 border-red-300 space-y-1">
                        <div><strong>{t('common.step1', 'Step 1:')}</strong> Subtract ones: <span className="text-red-700 font-bold">8 - 5 = 3</span></div>
                        <div><strong>{t('common.step2', 'Step 2:')}</strong> Subtract tens: <span className="text-red-700 font-bold">40 - 10 = 30</span></div>
                        <div><strong>{t('common.step3', 'Step 3:')}</strong> Combine: <span className="text-red-700 font-bold">30 + 3 = 33</span></div>
                        <div className="font-semibold text-red-900 mt-2"><strong>{t('common.answer', 'Answer:')}</strong> <span className="text-2xl text-red-700">33</span></div>
                        <div className="text-xs text-red-700 mt-2 flex items-center gap-1">
                            <span>{String.fromCodePoint(0x279C)}</span>
                            <span>{t('common.tip', 'Tip:')} Always subtract ones first!</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {pairs.map(([a, b], i) => (
                    <div key={i} className="border-2 border-red-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-orange-50 w-full break-inside-avoid print:p-3">
                        <div className="font-mono text-2xl leading-7 text-right mb-2">
                            <div className="text-red-700">{a}</div>
                            <div className="text-orange-700">- {b}</div>
                            <div className="border-t-[3px] border-red-600 mt-2 pt-2 h-12 flex items-center justify-end">
                                <span className="inline-block w-20 h-10 border-b-[3px] border-red-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Create your own 2-digit subtraction problem: ___ - ___ = ?</div>
                    <div>2. Solve: 88 - 44 = ?</div>
                    <div>3. Check your answer with addition!</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can subtract 2-digit numbers without regrouping</div>
                    <div>{String.fromCharCode(0x2610)} I can line up numbers correctly</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {pairs.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {pairs.map(([a, b], i) => (
                            <div key={i} className="text-emerald-800 border-b border-emerald-200 pb-1">
                                {i + 1}. {a} - {b} = <strong>{a - b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function SkipCount510120({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'skip-count-5-10-120'
    const seq5 = Array.from({ length: 24 }, (_, i) => (i + 1) * 5); // 5..120
    const seq10 = Array.from({ length: 12 }, (_, i) => (i + 1) * 10); // 10..120
    const isBlank5 = (i: number) => i % 3 === 1; // blank some boxes for practice
    const isBlank10 = (i: number) => i % 3 === 2;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Skip Counting by 5s and 10s (to 120)"
            emoji={String.fromCodePoint(0x1F430)}
            description="Fill in the missing numbers."
            problemCount={seq5.filter((_, i) => isBlank5(i)).length + seq10.filter((_, i) => isBlank10(i)).length}
            learningObjectives={[
                'Skip count by 5s up to 120',
                'Skip count by 10s up to 120',
                'Identify patterns in skip counting',
                'Build number sense and fluency'
            ]}
            parentTeacherTips={[
                'Skip counting helps with multiplication and division',
                'Practice counting aloud: 5, 10, 15, 20...',
                'Use a number line or hundreds chart to visualize',
                'Encourage students to notice the pattern: each number is 5 (or 10) more than the previous',
                'Extension: Try skip counting backwards or by other numbers (2s, 3s, 4s)'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Count by 5s:</strong> 5, 10, ___, 20, 25</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at the pattern: 5, 10, ___, 20, 25</div>
                        <div><strong>Step 2:</strong> Each number is 5 more than the previous: 5 + 5 = 10, 10 + 5 = 15</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> 15</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>
            <div className="space-y-6 text-sm break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                <div>
                    <div className="font-semibold text-slate-800 mb-2">Count by 5s to 120</div>
                    <div className="grid grid-cols-12 gap-1">
                        {seq5.map((n, i) => (
                            <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white break-inside-avoid">
                                {isBlank5(i) ? <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 align-middle" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-slate-800 mb-2">Count by 10s to 120</div>
                    <div className="grid grid-cols-12 gap-1">
                        {seq10.map((n, i) => (
                            <div key={i} className="h-12 border border-slate-300 rounded flex items-center justify-center bg-white break-inside-avoid">
                                {isBlank10(i) ? <span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 align-middle" /> : <span className="font-mono text-base text-slate-900">{n}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Skip count backwards by 5s from 50: 50, ___, ___, ___, ___</div>
                    <div>2. Skip count by 2s to 20: ___, ___, ___, ___, ___</div>
                    <div>3. What comes after 75 when counting by 5s? ___</div>
                    <div>4. Can you skip count by 3s? Try: 3, ___, ___, ___, ___</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can skip count by 5s</div>
                    <div>{String.fromCharCode(0x2610)} I can skip count by 10s</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {seq5.filter((_, i) => isBlank5(i)).length + seq10.filter((_, i) => isBlank10(i)).length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc('skip-count-5-10-120', () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-3">
                        <div className="text-sm text-emerald-800">
                            <strong>Count by 5s to 120:</strong> The missing numbers are: {seq5.filter((_, i) => isBlank5(i)).map((n, idx) => `${idx + 1}. ${n}`).join(', ')}
                        </div>
                        <div className="text-sm text-emerald-800">
                            <strong>Count by 10s to 120:</strong> The missing numbers are: {seq10.filter((_, i) => isBlank10(i)).map((n, idx) => `${idx + 1}. ${n}`).join(', ')}
                        </div>
                        <div className="text-xs text-emerald-700 mt-2">
                            Remember: Each number in the 5s sequence is 5 more than the previous. Each number in the 10s sequence is 10 more than the previous.
                        </div>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}



export function WordProblems100({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'word-problems-100'

    // Note: In a real app we might want to randomize these based on seed/variant
    // For now we keep the static list from the original code
    const problems = [
        { problem: 'Mia has 24 marbles. She gets 15 more. How many now?', equation: '24 + 15 = ?', answer: '39 marbles' },
        { problem: 'A class has 32 books on one shelf and 17 on another. How many in all?', equation: '32 + 17 = ?', answer: '49 books' },
        { problem: 'Liam had 45 stickers. He gave 20 to a friend. How many left?', equation: '45 - 20 = ?', answer: '25 stickers' },
        { problem: 'A box has 38 pencils. 10 were used. How many remain?', equation: '38 - 10 = ?', answer: '28 pencils' },
        { problem: 'Sara read 27 pages on Monday and 22 on Tuesday. How many pages total?', equation: '27 + 22 = ?', answer: '49 pages' }
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, '2nd-Grade Word Problems (within 100)')}
            emoji={String.fromCodePoint(0x1F4DD)}
            description={t(`worksheets.${docId}.description`, 'Read each word problem carefully. Write a number sentence (equation) and solve. Show your answer in the blank space.')}
            problemCount={problems.length}
            learningObjectives={[
                'Read and understand word problems',
                'Write number sentences (equations) from word problems',
                'Solve addition and subtraction word problems within 100'
            ]}
            parentTeacherTips={[
                'Help students identify key words: "more", "in all", "left", "remain", "total"',
                'Encourage students to write the equation before solving',
                'Check that students understand what the question is asking',
                'Extension: Create your own word problems'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-lime-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-lime-50 border-2 border-amber-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-amber-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                    <span>{t('common.example', "Example - Let's solve this together:")}</span>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="font-semibold text-base text-amber-900"><strong>{t('common.problem', 'Problem:')}</strong> Tom has 15 apples. He buys 12 more. How many apples does he have now?</div>
                    {/* Visual illustration */}
                    <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="text-center">
                                <div className="text-2xl mb-1">Tom has:</div>
                                <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <span key={i} className="text-2xl">{String.fromCodePoint(0x1F34E)}</span>
                                    ))}
                                </div>
                                <div className="text-sm font-semibold text-amber-700 mt-1">15 apples</div>
                            </div>
                            <div className="text-3xl text-amber-700 font-bold">+</div>
                            <div className="text-center">
                                <div className="text-2xl mb-1">Buys:</div>
                                <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <span key={i} className="text-2xl">{String.fromCodePoint(0x1F34E)}</span>
                                    ))}
                                </div>
                                <div className="text-sm font-semibold text-amber-700 mt-1">12 more</div>
                            </div>
                            <div className="text-3xl text-amber-700 font-bold">=</div>
                            <div className="text-center">
                                <div className="text-2xl mb-1">Total:</div>
                                <div className="text-4xl font-bold text-amber-700">27</div>
                                <div className="text-sm font-semibold text-amber-700 mt-1">apples</div>
                            </div>
                        </div>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-300 space-y-1">
                        <div><strong>{t('common.step1', 'Step 1:')}</strong> {t('worksheets.wordProblems.example.step1Text', 'Find the numbers:')} <span className="text-amber-700 font-bold">15 apples, 12 more</span></div>
                        <div><strong>{t('common.step2', 'Step 2:')}</strong> {t('worksheets.wordProblems.example.step2Text', 'Write the equation:')} <span className="text-amber-700 font-bold text-lg">15 + 12 = ?</span></div>
                        <div><strong>{t('common.step3', 'Step 3:')}</strong> {t('worksheets.wordProblems.example.step3Text', 'Solve:')} <span className="text-amber-700 font-bold text-lg">15 + 12 = 27</span></div>
                        <div className="font-semibold text-amber-900 mt-2"><strong>{t('common.answer', 'Answer:')}</strong> <span className="text-2xl text-amber-700">27 apples</span></div>
                        <div className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                            <span>{String.fromCodePoint(0x279C)}</span>
                            <span>{t('common.tip', 'Tip:')} {t('worksheets.wordProblems.example.tip', '"More" or "in all" usually means addition! "Left" or "remain" usually means subtraction!')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((item, i) => {
                    const nums = item.equation.match(/\d+/g) || [];
                    const num1 = parseInt(nums[0] || '0');
                    const num2 = parseInt(nums[1] || '0');
                    const emoji = item.problem.includes('marbles') ? '' :
                        item.problem.includes('books') ? '' :
                            item.problem.includes('stickers') ? '' :
                                item.problem.includes('pencils') ? '' : '';
                    return (
                        <div key={i} className="border-2 border-amber-200 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-lime-50 break-inside-avoid">
                            <div className="text-base font-semibold text-amber-900 mb-3 flex items-start gap-2">
                                <span className="text-xl">{i + 1}.</span>
                                <span>{item.problem}</span>
                            </div>
                            {/* Visual illustration */}
                            <div className="bg-white p-3 rounded-lg border-2 border-amber-300 mb-3">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="text-center">
                                        <div className="flex gap-1 flex-wrap justify-center max-w-[150px] mb-1">
                                            {Array.from({ length: Math.min(num1, 20) }).map((_, j) => (
                                                <span key={j} className="text-xl">{emoji}</span>
                                            ))}
                                        </div>
                                        <div className="text-xs font-semibold text-amber-700">{num1}</div>
                                    </div>
                                    <div className="text-2xl text-amber-700 font-bold">{String.fromCodePoint(0x279C)}</div>
                                    <div className="text-center">
                                        <div className="flex gap-1 flex-wrap justify-center max-w-[150px] mb-1">
                                            {Array.from({ length: Math.min(num2, 20) }).map((_, j) => (
                                                <span key={j} className="text-xl">{emoji}</span>
                                            ))}
                                        </div>
                                        <div className="text-xs font-semibold text-amber-700">{num2}</div>
                                    </div>
                                    <div className="text-2xl text-amber-700 font-bold">=</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-amber-700">?</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="text-sm text-amber-700 mb-1 font-semibold">{t('worksheets.wordProblems.equation', 'Equation:')}</div>
                                <div className="text-lg font-mono text-amber-900 bg-white px-3 py-1 rounded border border-amber-300">{item.equation}</div>
                            </div>
                            <div>
                                <div className="text-sm text-amber-700 mb-1 font-semibold">{t('common.answer', 'Answer:')}</div>
                                <div className="h-10 border-b-[3px] border-amber-600 mt-2 bg-white rounded px-2" />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Create your own word problem using addition</div>
                    <div>2. Create your own word problem using subtraction</div>
                    <div>3. Draw a picture to help solve one of the problems above</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can read and understand word problems</div>
                    <div>{String.fromCharCode(0x2610)} I can write number sentences</div>
                    <div>{String.fromCharCode(0x2610)} I can solve word problems correctly</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {problems.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {problems.map((item, i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {item.equation.replace('?', item.answer.split(' ')[0])} = <strong>{item.answer}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function Compare2Digit({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'compare-2digit'
    const doc = docId

    // RNG and generation logic
    const rng = makeRng(`${seed}| v${variant}| doc=${doc} `);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
    const pairs: Array<[number, number]> = Array.from({ length: 10 }).map(() => {
        const a = nextInt(10, 99); const b = nextInt(10, 99); return [a, b];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Compare 2-Digit Numbers')}
            emoji={String.fromCodePoint(0x2696)}
            description={t(`worksheets.${docId}.description`, 'Write one comparison symbol in each blank: > (greater than), < (less than), or = (equal to). Tip: Compare tens first. If tens are equal, compare ones.')}
            problemCount={pairs.length}
            learningObjectives={[
                'Compare 2-digit numbers using >, <, and =',
                'Compare tens first, then ones if needed',
                'Understand place value when comparing numbers'
            ]}
            parentTeacherTips={[
                'Compare the tens place first - that\'s usually enough!',
                'If tens are equal, then compare the ones place',
                'Use > for greater than, < for less than, = for equal',
                'Extension: Compare 3-digit numbers'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{t('common.problem', 'Problem:')}</strong> Compare 58 and 41</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{t('common.step1', 'Step 1:')}</strong> Compare tens: 5 tens vs 4 tens</div>
                        <div><strong>{t('common.step2', 'Step 2:')}</strong> 5 &gt; 4, so 58 &gt; 41</div>
                        <div className="font-semibold text-blue-900"><strong>{t('common.answer', 'Answer:')}</strong> 58 &gt; 41</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xl font-mono break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {pairs.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full flex items-center justify-between break-inside-avoid">
                        <span>{a}</span>
                        <span className="mx-2 inline-block w-16 h-10 border-b-[3px] border-slate-600 align-middle" aria-label="comparison symbol box" />
                        <span>{b}</span>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Compare: 67 ___ 76 (which symbol goes in the blank?)</div>
                    <div>2. Find two numbers where the tens are equal but ones are different</div>
                    <div>3. Create your own comparison problem</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can compare 2-digit numbers correctly</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCharCode(0x2610)} I can use &gt;, &lt;, and = symbols correctly</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {pairs.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {pairs.map(([a, b], i) => {
                            const symbol = a > b ? '>' : a < b ? '<' : '=';
                            const aTens = Math.floor(a / 10);
                            const bTens = Math.floor(b / 10);
                            const explanation = aTens !== bTens
                                ? `${aTens} tens ${symbol === '>' ? '>' : '<'} ${bTens} tens`
                                : `${a} and ${b} have the same tens, so compare ones: ${a % 10} ${symbol} ${b % 10} `;
                            return (
                                <div key={i} className="text-sm text-emerald-800">
                                    {i + 1}. {a} <strong>{symbol}</strong> {b} ({explanation})
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function EvenOdd100({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const doc = 'even-odd-100'
    const docId = doc

    const rng = makeRng(`${seed}| v${variant}| doc=${doc} `);
    const nums = Array.from({ length: 20 }).map(() => Math.floor(rng() * 100));

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Even or Odd? (to 100)')}
            emoji={String.fromCodePoint(0x1F4D1)}
            description={t(`worksheets.${docId}.description`, 'Circle whether each number is even or odd.')}
            problemCount={nums.length}
            learningObjectives={[
                'Identify even and odd numbers',
                'Understand that even numbers end in 0, 2, 4, 6, 8',
                'Understand that odd numbers end in 1, 3, 5, 7, 9'
            ]}
            parentTeacherTips={[
                'Even numbers can be divided by 2 with no remainder',
                'Look at the ones digit: 0, 2, 4, 6, 8 = even; 1, 3, 5, 7, 9 = odd',
                'Even numbers: 2, 4, 6, 8, 10, 12...',
                'Odd numbers: 1, 3, 5, 7, 9, 11, 13...',
                'Extension: Find patterns in even and odd numbers'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-rose-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{t('common.problem', 'Problem:')}</strong> Is 24 even or odd?</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{t('common.step1', 'Step 1:')}</strong> Look at the ones digit: 4</div>
                        <div><strong>{t('common.step2', 'Step 2:')}</strong> 4 is in the even list (0, 2, 4, 6, 8)</div>
                        <div><strong>{t('common.step3', 'Step 3:')}</strong>{String.fromCodePoint(0x279C)}</div>
                        <div className="font-semibold text-blue-900"><strong>{t('common.answer', 'Answer:')}</strong> 24 is even</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xl font-mono break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {nums.map((n, i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full flex items-center justify-between break-inside-avoid">
                        <span>{n}</span>
                        <span className="mx-2">{String.fromCodePoint(0x279C)}</span>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. List 5 even numbers between 50 and 100</div>
                    <div>2. List 5 odd numbers between 50 and 100</div>
                    <div>3. What happens when you add two even numbers? (Try it!)</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can identify even numbers</div>
                    <div>{String.fromCharCode(0x2610)} I can identify odd numbers</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {nums.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {nums.map((n, i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {n} is <strong>{n % 2 === 0 ? 'Even' : 'Odd'}</strong> (ones digit is {n % 10})
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function Time5Min({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'time-5min'
    const times = ['3:25', '9:40', '12:05', '6:30', '1:55', '10:10', '7:45', '2:20'];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Tell Time to 5 Minutes')}
            emoji={String.fromCodePoint(0x1F552)}
            description={t(`worksheets.${docId}.description`, 'Draw the clock hands to show each time.')}
            problemCount={times.length}
            learningObjectives={[
                'Read time to the nearest 5 minutes',
                'Draw hour and minute hands on analog clocks',
                'Understand the relationship between hours and minutes',
                'Practice telling time in real-world contexts'
            ]}
            parentTeacherTips={[
                'The hour hand moves slowly between numbers',
                'The minute hand moves quickly: each number is 5 minutes',
                'When the minute hand is on 1, it\'s 5 minutes past',
                'When the minute hand is on 6, it\'s 30 minutes (half past)',
                'Practice with a real clock or clock manipulative',
                'Extension: Try telling time to the exact minute'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">How to Tell Time</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Time:</strong> 3:25</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Hour hand: Point between 3 and 4 (because it's 3:25, past 3:00)</div>
                        <div><strong>Step 2:</strong> Minute hand: Count by 5s to 25 (5, 10, 15, 20, 25). Point to the 5.</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> Hour hand between 3 and 4, minute hand on 5</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: The hour hand is past the 3!</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {times.map((t, i) => (
                    <div key={i} className="break-inside-avoid">
                        <svg viewBox="0 0 200 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#111827" strokeWidth="3" />
                            {/* hour marks */}
                            {Array.from({ length: 12 }).map((_, k) => { const a = (k / 12) * Math.PI * 2; const x1 = 100 + Math.cos(a) * 70; const y1 = 100 + Math.sin(a) * 70; const x2 = 100 + Math.cos(a) * 80; const y2 = 100 + Math.sin(a) * 80; return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111827" /> })}
                            <text x="100" y="180" textAnchor="middle" fontSize="16" fill="#111827">{t}</text>
                            {/* student draws hands */}
                        </svg>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Draw a clock showing 4:45. What is another way to say this time? (quarter to ___)</div>
                    <div>2. Draw a clock showing 11:30. What is another way to say this time? (half past ___)</div>
                    <div>3. If it's 2:15 now, what time will it be in 30 minutes? Draw it!</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can read time to 5 minutes</div>
                    <div>{String.fromCharCode(0x2610)} I can draw the hour hand correctly</div>
                    <div>{String.fromCharCode(0x2610)} I can draw the minute hand correctly</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {times.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => {
                const parseTime = (timeStr: string) => {
                    const [h, m] = timeStr.split(':').map(Number);
                    return { hour: h, minute: m };
                };
                return (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                        <div className="space-y-3">
                            {times.map((t, i) => {
                                const { hour, minute } = parseTime(t);
                                return (
                                    <div key={i} className="text-sm text-emerald-800">
                                        <div className="font-semibold">{i + 1}. {t}:</div>
                                        <div className="pl-4">
                                            <div>Hour hand: Between {hour % 12} and {(hour % 12) + 1} (closer to {hour % 12} since it's {minute} minutes past)</div>
                                            <div>Minute hand: On {Math.floor(minute / 5)} (which is {minute} minutes past the hour)</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-xs text-emerald-700 mt-3">
                            Remember: The hour hand moves slowly between numbers. The minute hand moves quickly - each number represents 5 minutes!
                        </div>
                    </div>
                );
            })}
        </WorksheetSectionWrapper>
    )
}

export function TenFrames1To20({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'ten-frames-1-20'
    const numbers = Array.from({ length: 20 }, (_, n) => n + 1);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Ten Frames 1-20')}
            emoji={String.fromCodePoint(0x1F51F)}
            description={t(`worksheets.${docId}.description`, 'Color the circles to match each number. Say how many are filled and how many are empty.')}
            problemCount={numbers.length}
            learningObjectives={[
                'Recognize numbers 1-20',
                'Understand number quantity using ten frames',
                'Count and represent numbers visually',
                'Build number sense and subitizing skills'
            ]}
            parentTeacherTips={[
                'Ten frames help children see numbers as groups of 10',
                'Encourage counting aloud while coloring',
                'Ask: "How many filled? How many empty?"',
                'For numbers 11-20, use two ten frames (one full, one partial)',
                'Extension: Practice addition and subtraction using ten frames'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Number:</strong> 7</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at the number: 7</div>
                        <div><strong>Step 2:</strong> Color 7 circles in the ten frame</div>
                        <div><strong>Step 3:</strong> Count: 7 filled, 3 empty</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> Color 7 circles. Say "7 filled, 3 empty"</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {numbers.map((n) => (
                    <div key={n} className="break-inside-avoid">
                        <svg viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                            <text x="40" y="50" fontSize="36" fill="#111827">{n}</text>
                            <g transform="translate(120,60)">
                                {Array.from({ length: 10 }).map((__, i) => (
                                    <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                                ))}
                            </g>
                            {n > 10 && (
                                <g transform="translate(120,120)">
                                    {Array.from({ length: 10 }).map((__, i) => (
                                        <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                                    ))}
                                </g>
                            )}
                        </svg>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Can you show 15 using ten frames? Color it!</div>
                    <div>2. How many ways can you make 10? (5+5, 6+4, 7+3...)</div>
                    <div>3. Draw your own ten frame and show the number 12</div>
                </div>
            </div>
            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCharCode(0x2610)} I can show numbers using ten frames</div>
                    <div>{String.fromCharCode(0x2610)} I can count filled and empty spaces</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {numbers.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2 text-sm text-emerald-800">
                        {numbers.map((n, i) => {
                            const filled = n <= 10 ? n : 10;
                            const empty = n <= 10 ? 10 - n : 0;
                            const secondFilled = n > 10 ? n - 10 : 0;
                            const secondEmpty = n > 10 ? 10 - (n - 10) : 0;
                            return (
                                <div key={i}>
                                    {i + 1}. <strong>{n}:</strong> {n <= 10
                                        ? `${filled} filled, ${empty} empty(in one ten frame)`
                                        : `First ten frame: 10 filled.Second ten frame: ${secondFilled} filled, ${secondEmpty} empty`}
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-xs text-emerald-700 mt-3">
                        Remember: For numbers 1-10, use one ten frame. For numbers 11-20, fill the first ten frame completely (10) and use the second ten frame for the remaining amount!
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function MoreLessEqual10({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'more-less-equal-10'
    const doc = docId
    const rng = makeRng(`${doc} `);
    const pairs: Array<{ left: number, right: number, emoji: string }> = [
        { left: 3, right: 5, emoji: '🍎' },
        { left: 7, right: 4, emoji: '🍌' },
        { left: 6, right: 6, emoji: '🍇' },
        { left: 8, right: 3, emoji: '🍊' },
        { left: 2, right: 9, emoji: '🍓' },
        { left: 5, right: 5, emoji: '🍒' },
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'More, Less, or Equal? (110)')}
            emoji={String.fromCodePoint(0x1F4D1)}
            description={t(`worksheets.${docId}.description`, 'Compare the two groups. Circle: more, less, or equal.')}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 animate-gradient-x mb-2" />
            <div className="grid grid-cols-2 gap-4">
                {pairs.map((pair, idx) => (
                    <div key={idx} className="border border-slate-300 rounded p-4 bg-white break-inside-avoid">
                        <div className="flex items-center justify-around mb-3">
                            <div className="text-center">
                                <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                                    {Array.from({ length: pair.left }).map((_, i) => (
                                        <span key={i} className="text-2xl leading-none">{pair.emoji}</span>
                                    ))}
                                </div>
                                <p className="text-xl font-bold text-slate-900">{pair.left}</p>
                            </div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">VS</div>
                            <div className="text-center">
                                <div className="flex gap-1 flex-wrap justify-center mb-2" style={{ width: '80px' }}>
                                    {Array.from({ length: pair.right }).map((_, i) => (
                                        <span key={i} className="text-2xl leading-none">{pair.emoji}</span>
                                    ))}
                                </div>
                                <p className="text-xl font-bold text-slate-900">{pair.right}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                            {['More', 'Less', 'Equal'].map((opt) => (
                                <div key={opt} className="border-2 border-slate-200 rounded-full px-3 py-1 text-sm text-slate-600 font-semibold bg-slate-50 min-w-[60px] text-center">
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc('more-less-equal-10', () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                        <li>3 vs 5: Less (3 &lt; 5)</li>
                        <li>7 vs 4: More (7 &gt; 4)</li>
                        <li>6 vs 6: Equal (6 = 6)</li>
                        <li>8 vs 3: More (8 &gt; 3)</li>
                        <li>2 vs 9: Less (2 &lt; 9)</li>
                        <li>5 vs 5: Equal (5 = 5)</li>
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function NumberTracing1To10({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'number-tracing-1-10';
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
                                            case '0': return { d: `M${100 + xOffset}, 50 Q${135 + xOffset}, 50 ${135 + xOffset}, 100 Q${135 + xOffset}, 150 ${100 + xOffset}, 150 Q${65 + xOffset}, 150 ${65 + xOffset}, 100 Q${65 + xOffset}, 50 ${100 + xOffset}, 50`, start: [100 + xOffset, 50] };
                                            case '1': return { d: `M${85 + xOffset}, 65 L${100 + xOffset}, 50 L${100 + xOffset}, 150`, start: [85 + xOffset, 65] };
                                            case '2': return { d: `M${75 + xOffset}, 75 Q${75 + xOffset}, 50 ${100 + xOffset}, 50 Q${125 + xOffset}, 50 ${125 + xOffset}, 75 Q${125 + xOffset}, 100 ${75 + xOffset}, 150 L${130 + xOffset}, 150`, start: [75 + xOffset, 75] };
                                            case '3': return { d: `M${75 + xOffset}, 60 Q${125 + xOffset}, 50 ${125 + xOffset}, 95 Q${125 + xOffset}, 100 ${100 + xOffset}, 100 Q${125 + xOffset}, 100 ${125 + xOffset}, 140 Q${125 + xOffset}, 150 ${75 + xOffset}, 150`, start: [75 + xOffset, 60] };
                                            case '4': return { d: `M${110 + xOffset}, 150 L${110 + xOffset}, 50 L${70 + xOffset}, 115 L${130 + xOffset}, 115`, start: [110 + xOffset, 50] };
                                            case '5': return { d: `M${125 + xOffset}, 50 L${80 + xOffset}, 50 L${80 + xOffset}, 90 Q${80 + xOffset}, 80 ${100 + xOffset}, 80 Q${130 + xOffset}, 80 ${130 + xOffset}, 120 Q${130 + xOffset}, 150 ${80 + xOffset}, 150`, start: [125 + xOffset, 50] };
                                            case '6': return { d: `M${120 + xOffset}, 50 Q${70 + xOffset}, 60 ${70 + xOffset}, 120 Q${70 + xOffset}, 150 ${100 + xOffset}, 150 Q${130 + xOffset}, 150 ${130 + xOffset}, 120 Q${130 + xOffset}, 100 ${100 + xOffset}, 100 Q${70 + xOffset}, 100 ${70 + xOffset}, 120`, start: [120 + xOffset, 50] };
                                            case '7': return { d: `M${70 + xOffset}, 50 L${130 + xOffset}, 50 L${90 + xOffset}, 150`, start: [70 + xOffset, 50] };
                                            case '8': return { d: `M${100 + xOffset}, 100 Q${130 + xOffset}, 100 ${130 + xOffset}, 75 Q${130 + xOffset}, 50 ${100 + xOffset}, 50 Q${70 + xOffset}, 50 ${70 + xOffset}, 75 Q${70 + xOffset}, 100 ${100 + xOffset}, 100 Q${70 + xOffset}, 100 ${70 + xOffset}, 125 Q${70 + xOffset}, 150 ${100 + xOffset}, 150 Q${130 + xOffset}, 150 ${130 + xOffset}, 125 Q${130 + xOffset}, 100 ${100 + xOffset}, 100`, start: [100 + xOffset, 50] };
                                            case '9': return { d: `M${130 + xOffset}, 80 Q${130 + xOffset}, 50 ${100 + xOffset}, 50 Q${70 + xOffset}, 50 ${70 + xOffset}, 80 Q${70 + xOffset}, 110 ${100 + xOffset}, 110 Q${130 + xOffset}, 110 ${130 + xOffset}, 80 L${130 + xOffset}, 150`, start: [130 + xOffset, 80] };
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
                    <strong>{getTrans(t, 'common.myScore', 'My score:')}</strong> ___ / 10
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans(t, 'common.whatWasHardest', 'What was hardest?')}</strong> _________________________
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
    )
}

export function NumberTracing1To20({ showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'number-tracing-1-20'
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
                                            case '0': return { d: `M${100 + xOffset}, 50 Q${135 + xOffset}, 50 ${135 + xOffset}, 100 Q${135 + xOffset}, 150 ${100 + xOffset}, 150 Q${65 + xOffset}, 150 ${65 + xOffset}, 100 Q${65 + xOffset}, 50 ${100 + xOffset}, 50`, start: [100 + xOffset, 50] };
                                            case '1': return { d: `M${85 + xOffset}, 65 L${100 + xOffset}, 50 L${100 + xOffset}, 150`, start: [85 + xOffset, 65] };
                                            case '2': return { d: `M${75 + xOffset}, 75 Q${75 + xOffset}, 50 ${100 + xOffset}, 50 Q${125 + xOffset}, 50 ${125 + xOffset}, 75 Q${125 + xOffset}, 100 ${75 + xOffset}, 150 L${130 + xOffset}, 150`, start: [75 + xOffset, 75] };
                                            case '3': return { d: `M${75 + xOffset}, 60 Q${125 + xOffset}, 50 ${125 + xOffset}, 95 Q${125 + xOffset}, 100 ${100 + xOffset}, 100 Q${125 + xOffset}, 100 ${125 + xOffset}, 140 Q${125 + xOffset}, 150 ${75 + xOffset}, 150`, start: [75 + xOffset, 60] };
                                            case '4': return { d: `M${110 + xOffset}, 150 L${110 + xOffset}, 50 L${70 + xOffset}, 115 L${130 + xOffset}, 115`, start: [110 + xOffset, 50] }; // Start top
                                            case '5': return { d: `M${125 + xOffset}, 50 L${80 + xOffset}, 50 L${80 + xOffset}, 90 Q${80 + xOffset}, 80 ${100 + xOffset}, 80 Q${130 + xOffset}, 80 ${130 + xOffset}, 120 Q${130 + xOffset}, 150 ${80 + xOffset}, 150`, start: [125 + xOffset, 50] };
                                            case '6': return { d: `M${120 + xOffset}, 50 Q${70 + xOffset}, 60 ${70 + xOffset}, 120 Q${70 + xOffset}, 150 ${100 + xOffset}, 150 Q${130 + xOffset}, 150 ${130 + xOffset}, 120 Q${130 + xOffset}, 100 ${100 + xOffset}, 100 Q${70 + xOffset}, 100 ${70 + xOffset}, 120`, start: [120 + xOffset, 50] };
                                            case '7': return { d: `M${70 + xOffset}, 50 L${130 + xOffset}, 50 L${90 + xOffset}, 150`, start: [70 + xOffset, 50] };
                                            case '8': return { d: `M${100 + xOffset}, 100 Q${130 + xOffset}, 100 ${130 + xOffset}, 75 Q${130 + xOffset}, 50 ${100 + xOffset}, 50 Q${70 + xOffset}, 50 ${70 + xOffset}, 75 Q${70 + xOffset}, 100 ${100 + xOffset}, 100 Q${70 + xOffset}, 100 ${70 + xOffset}, 125 Q${70 + xOffset}, 150 ${100 + xOffset}, 150 Q${130 + xOffset}, 150 ${130 + xOffset}, 125 Q${130 + xOffset}, 100 ${100 + xOffset}, 100`, start: [100 + xOffset, 50] }; // Start Center/Top? usually S
                                            case '9': return { d: `M${130 + xOffset}, 80 Q${130 + xOffset}, 50 ${100 + xOffset}, 50 Q${70 + xOffset}, 50 ${70 + xOffset}, 80 Q${70 + xOffset}, 110 ${100 + xOffset}, 110 Q${130 + xOffset}, 110 ${130 + xOffset}, 80 L${130 + xOffset}, 150`, start: [130 + xOffset, 80] }; // Start Right side?
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
                    </div>
                ))}
            </div>
        </WorksheetSectionWrapper>
    )
}

function getTrans(t: any, key: string, fallback: string) {
    const val = t(key);
    return (!val || val === key) ? fallback : val;
}
