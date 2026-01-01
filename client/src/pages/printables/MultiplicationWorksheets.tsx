import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';

// Helper for translations with fallback
function useWorksheetTranslation(docId: string) {
    const { t } = useTranslation();

    const getTrans = (key: string, fallback: string) => {
        const fullKey = key.includes('.') ? key : `worksheets.${docId}.${key}`;
        const translated = t(fullKey);
        // Check if translation is missing (returns key) or explicitly empty
        return translated && translated !== fullKey && !translated.startsWith('worksheets.') ? translated : fallback;
    };

    return { t, getTrans };
}

interface SpecificWorksheetProps {
    seed: string
    variant: number
    showAnswersForDoc: (docId: string, render: () => React.ReactNode) => React.ReactNode
}


export function MultiplicationFacts({ seed, variant, showAnswersForDoc, docId, range }: SpecificWorksheetProps & { docId: string, range: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const isZeroToTwelve = docId === 'mult-facts-0-12';
    const count = isZeroToTwelve ? 20 : 12;

    // Logic for 0-12 (Super Hero City) is different from 1-5 and 6-12
    if (isZeroToTwelve) {
        const problems = Array.from({ length: count }, () => {
            const a = Math.floor(rng() * 13)
            const b = Math.floor(rng() * 13)
            return { a, b, answer: a * b }
        })

        return (
            <WorksheetSectionWrapper
                docId={docId}
                title={getTrans('title', 'Super Hero City: Power Facts')}
                emoji={String.fromCodePoint(0x2716)}
                description={getTrans('description', 'Charge up the hero shields! Solve the multiplication problems to save the city.')}
                problemCount={problems.length}
                learningObjectives={[
                    getTrans('learningObjectives.0', 'Master multiplication facts from 0x0 to 12x12'),
                    getTrans('learningObjectives.1', 'Build speed and accuracy'),
                    getTrans('learningObjectives.2', 'Develop fact fluency')
                ]}
                parentTeacherTips={[
                    getTrans('parentTeacherTips.0', 'Practice a few "families" at a time (e.g., all x2, then all x5).'),
                    getTrans('parentTeacherTips.1', 'Use flashcards for facts that result in "shield failures" (incorrect answers).'),
                    getTrans('parentTeacherTips.2', 'Challenge: Can you beat your time?')
                ]}
            >
                <PremiumWorksheetBanner
                    title={getTrans('banner.title', "Super Hero City")}
                    subtitle={getTrans('banner.subtitle', "Power Fact Shield Training")}
                    icons={{
                        bg1: "🛡️",
                        bg2: "🏙️",
                        float1: "🦸",
                        float2: "⚡"
                    }}
                    colors={{
                        bg: "bg-gradient-to-br from-blue-900 to-indigo-900 border-4",
                        border: "border-yellow-400",
                        pillBg: "bg-yellow-400",
                        pillBorder: "border-yellow-500",
                        pillText: "text-blue-900",
                        accent: "text-blue-400/30"
                    }}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {problems.map((p, i) => (
                        <div key={i} className="relative bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center shadow-sm overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-xs pt-2 pr-2">#{i + 1}</div>

                            <div className="z-10 flex flex-col items-end">
                                <div className="text-2xl font-black text-slate-700">{p.a}</div>
                                <div className="flex items-center gap-1 text-2xl font-black text-slate-700">
                                    <span className="text-base text-slate-400">x</span> {p.b}
                                </div>
                                <div className="w-full h-1 bg-slate-800 my-1"></div>
                                <div className="w-16 h-10 border-2 border-dashed border-blue-300 bg-blue-50 rounded flex items-center justify-center text-xl font-bold text-blue-800"></div>
                            </div>

                            {/* Background Shield Opacity */}
                            <div className="absolute bottom-1 left-1 text-4xl opacity-10">{String.fromCodePoint(0x1F4A1)}</div>
                        </div>
                    ))}
                </div>

                {showAnswersForDoc(docId, () => (
                    <div className="mt-6 p-4 border-2 border-blue-300 bg-blue-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-blue-900 mb-2">{String.fromCharCode(0x2705)} Answer Key</div>
                        <div className="grid grid-cols-4 gap-2 text-xs text-blue-800">
                            {problems.map((p, i) => (
                                <div key={i}>{p.a} x {p.b} = <strong>{p.answer}</strong></div>
                            ))}
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        )
    }

    // Standard logic for 1-5 and 6-12
    const facts: Array<[number, number]> = Array.from({ length: 12 }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const isAdvanced = range[0] >= 6;
    const title = isAdvanced
        ? getTrans('title', 'Advanced Multiplication Facts (6-12)')
        : getTrans('title', 'Basic Multiplication Facts (1-5)');

    const description = isAdvanced
        ? getTrans('description', 'Write the correct answer in each blank. These problems help students memorize multiplication facts from 6-12.')
        : getTrans('description', 'Write the correct answer in each blank. These problems help students memorize multiplication facts from 1-5.');

    const objectives = isAdvanced ? [
        'Memorize multiplication facts from 6x6 to 12x12',
        'Build speed and accuracy with advanced facts',
        'Use strategies like breaking apart or using known facts'
    ] : [
        'Memorize multiplication facts from 1x1 to 5x5',
        'Build speed and accuracy with basic facts',
        'Understand multiplication as repeated addition'
    ];

    const tips = isAdvanced ? [
        'These are harder facts - encourage using strategies',
        'Break apart: 7 x 8 = (7 x 5) + (7 x 3) = 35 + 21 = 56',
        'Use known facts: If you know 6 x 6 = 36, then 6 x 7 = 36 + 6 = 42',
        'Extension: Time yourself and try to beat your record'
    ] : [
        'Start with easier facts (1s, 2s) and work up to 5s',
        'Use skip counting to help: 3 x 4 means count by 3s four times',
        'Practice daily for 5-10 minutes for best results',
        'Extension: Time yourself and try to beat your record'
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={title}
            emoji={String.fromCharCode(0x2716, 0xFE0F)}
            description={description}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                return Array.isArray(obj) && obj.length > 0 ? obj : objectives
            })()}
            parentTeacherTips={(() => {
                const tipList = t(`worksheets.${docId}.parentTeacherTips`)
                return Array.isArray(tipList) && tipList.length > 0 ? tipList : tips
            })()}
        >
            <PremiumWorksheetBanner
                title={isAdvanced ? "Advanced Skills" : "Foundation Training"}
                subtitle={isAdvanced ? "6-12 Multiplication" : "1-5 Multiplication"}
                icons={{
                    bg1: isAdvanced ? "🚀" : "🎯",
                    bg2: "✖️",
                    float1: isAdvanced ? "🌟" : "💡",
                    float2: "⚡"
                }}
                colors={{
                    bg: isAdvanced ? "bg-purple-50" : "bg-blue-50",
                    border: isAdvanced ? "border-purple-200" : "border-blue-200",
                    pillBg: "bg-white/90",
                    pillBorder: isAdvanced ? "border-purple-300" : "border-blue-300",
                    pillText: isAdvanced ? "text-purple-900" : "text-blue-900",
                    accent: isAdvanced ? "text-purple-200" : "text-blue-200"
                }}
            />

            {/* Worked Example */}
            <div className={`mb-8 p-6 bg-${isAdvanced ? 'purple' : 'blue'}-50/50 border-2 border-${isAdvanced ? 'purple' : 'blue'}-100 rounded-2xl relative overflow-hidden group`}>
                <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 text-${isAdvanced ? 'purple' : 'blue'}-500 group-hover:scale-110 transition-transform`}>{isAdvanced ? '🚀' : '💡'}</div>
                <div className={`font-black text-${isAdvanced ? 'purple' : 'blue'}-900 mb-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                    <span className={`w-8 h-8 rounded-lg bg-${isAdvanced ? 'purple' : 'blue'}-500 text-white flex items-center justify-center text-sm`}>{isAdvanced ? '🚀' : '💡'}</span>
                    {getTrans('example.title', "Technique Guide")}
                </div>
                <div className="space-y-4 text-sm">
                    <div className="flex items-baseline gap-3">
                        <span className="text-slate-400 font-mono text-xs uppercase tracking-tighter font-bold">Goal:</span>
                        <div className="text-lg font-medium text-slate-700 italic">
                            {getTrans('example.problem', 'Solve:')} {getTrans('example.problemText', isAdvanced ? '8 × 7 = ?' : '3 × 4 = ?')}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                        {isAdvanced ? (
                            <>
                                <div className={`pl-4 border-l-4 border-purple-200 py-1 space-y-1`}>
                                    <div className="text-sm font-bold text-slate-800">{getTrans('example.strategy1', 'Strategy 1: Break it down')}</div>
                                    <p className="text-xs text-slate-500 italic">{getTrans('example.strategy1Text', '(5 × 7) + (3 × 7) = 35 + 21 = 56')}</p>
                                </div>
                                <div className={`pl-4 border-l-4 border-purple-200 py-1 space-y-1`}>
                                    <div className="text-sm font-bold text-slate-800">{getTrans('example.strategy2', 'Strategy 2: Use known facts')}</div>
                                    <p className="text-xs text-slate-500 italic">{getTrans('example.strategy2Text', 'If 7 × 7 = 49, then 49 + 7 = 56')}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`pl-4 border-l-4 border-blue-200 py-1 space-y-1`}>
                                    <div className="text-sm font-bold text-slate-800">{getTrans('example.step1', 'Step 1: Visualize')}</div>
                                    <p className="text-xs text-slate-500 italic">{getTrans('example.step1Text', 'Think: 3 groups of 4')}</p>
                                </div>
                                <div className={`pl-4 border-l-4 border-blue-200 py-1 space-y-1`}>
                                    <div className="text-sm font-bold text-slate-800">{getTrans('example.step2', 'Step 2: Add up')}</div>
                                    <p className="text-xs text-slate-500 italic">{getTrans('example.step2Text', '4 + 4 + 4 = 12')}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={`mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between`}>
                        <div className="text-emerald-800 font-black text-[10px] uppercase tracking-widest">{getTrans('example.answer', 'Final Answer')}</div>
                        <div className="text-xl font-black text-emerald-600">{getTrans('example.answerText', isAdvanced ? '56' : '12')}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className={`relative border-2 border-${isAdvanced ? 'purple' : 'blue'}-100 rounded-2xl p-6 bg-white hover:border-${isAdvanced ? 'purple' : 'blue'}-300 transition-all group break-inside-avoid shadow-sm`}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-700">
                                <span className="w-6 text-[10px] font-black text-slate-300 mr-2">{i + 1}</span>
                                <span>{a}</span>
                                <span className={`text-${isAdvanced ? 'purple' : 'blue'}-400 scale-75`}>×</span>
                                <span>{b}</span>
                                <span className="text-slate-300">=</span>
                                <div className={`w-16 h-10 border-b-4 border-dashed border-${isAdvanced ? 'purple' : 'blue'}-300 bg-${isAdvanced ? 'purple' : 'blue'}-50/30 rounded-lg`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    {(() => {
                        const challengeItems = t(`worksheets.${docId}.challenge.items`)
                        const items = Array.isArray(challengeItems) && challengeItems.length > 0 ? challengeItems : (isAdvanced ? [
                            String.fromCodePoint(0x1F680),
                            'Create your own multiplication problem using numbers 6-12',
                            String.fromCodePoint(0x279C),
                            `Time yourself: Can you complete all ${facts.length} problems in under 3 minutes?`
                        ] : [
                            'Create your own multiplication problem: ___ x ___ = ?',
                            'Solve: 5 x 5 = ? (the biggest fact in this worksheet!)',
                            'Write all the facts that equal 12: ___ x ___ = 12',
                            `Time yourself: Can you complete all ${facts.length} problems in under 2 minutes?`
                        ])
                        return items.map((item, idx) => {
                            const itemText = typeof item === 'string' ? item.replace('{count}', String(facts.length)) : item
                            return <div key={idx}>{idx + 1}. {itemText}</div>
                        })
                    })()}
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{getTrans('selfAssessment.title', String.fromCharCode(0xD83D, 0xDCCA) + ' How did you do?')}</div>
                <div className="space-y-2 text-xs">
                    {(() => {
                        const assessmentItems = t(`worksheets.${docId}.selfAssessment.items`)
                        const items = Array.isArray(assessmentItems) && assessmentItems.length > 0 ? assessmentItems : (isAdvanced ? [
                            'I can multiply numbers 6-12 easily',
                            String.fromCodePoint(0x270F),
                            'I can use strategies to help me solve',
                            'I can say the answers quickly (fluency)'
                        ] : [
                            'I can multiply numbers 1-5 easily',
                            'I need more practice with some facts',
                            'I can say the answers quickly (fluency)'
                        ])
                        return items.map((item, idx) => (
                            <div key={idx}>{String.fromCharCode(0x2610)} {item}</div>
                        ))
                    })()}
                </div>
                <div className="mt-3 text-xs">
                    <strong>{getTrans('selfAssessment.score', 'My score:')}</strong> ___ / {facts.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans('selfAssessment.timeTaken', 'Time taken:')}</strong> _____ {getTrans('selfAssessment.minutes', 'minutes')}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans('selfAssessment.factsToPractice', 'Facts I want to practice more:')}</strong> ______________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{getTrans('answerKey.title', String.fromCharCode(0x2705) + ' Answer Key')}</div>
                    <div className="space-y-2">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {a} x {b} = <strong>{a * b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationArrays2To5({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-arrays-2-5'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const arrays: Array<[number, number]> = Array.from({ length: 6 }).map(() => {
        const rows = nextInt(2, 5); const cols = nextInt(2, 5); return [rows, cols];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Multiplication Arrays (2-5)')}
            emoji={String.fromCharCode(0x2716, 0xFE0F)}
            description={getTrans('description', "Find the product for each multiplication problem. Use the array to help you count.")}
            problemCount={arrays.length}
            learningObjectives={t('learningObjectives', [
                'Use arrays to visualize multiplication',
                'Count rows and columns to find the product',
                'Understand multiplication as equal groups'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Arrays help students see multiplication visually',
                'Count rows first, then columns, or count all objects',
                'Encourage students to count the total number of boxes',
                'Extension: Draw your own arrays for different problems'
            ])}
        >
            <PremiumWorksheetBanner
                title={getTrans('title', 'Array Builder')}
                subtitle={getTrans('subtitle', 'Draw and solve with equal groups')}
                icons={{
                    bg1: String.fromCharCode(0x2716, 0xFE0F),
                    bg2: String.fromCodePoint(0x1F4CF),
                    float1: String.fromCodePoint(0x1F3A8),
                    float2: String.fromCodePoint(0x1F4D0)
                }}
                colors={{
                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    border: 'border-blue-200',
                    pillBg: 'bg-white/80',
                    pillBorder: 'border-blue-300',
                    pillText: 'text-blue-800',
                    accent: 'text-blue-300'
                }}
            />

            {/* Strategy Spotlight: Worked Example */}
            <div className="mb-8 page-break-inside-avoid break-inside-avoid">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full opacity-50 -z-10"></div>
                    <div className="flex items-center gap-3 mb-4 border-b border-blue-100 pb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shadow-inner">
                            {String.fromCodePoint(0x1F4A1)}
                        </div>
                        <h3 className="font-bold text-lg text-blue-900">{getTrans('example.title', "Strategy Spotlight: Using Arrays")}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Visual Representation */}
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                            <div className="mb-2 font-mono text-xl font-bold text-blue-800">3 × 4 = ?</div>
                            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(4, 1fr)`, width: '120px' }}>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-blue-400 rounded-sm border border-blue-500 shadow-sm relative group cursor-help">
                                        <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">3 rows of 4</div>
                        </div>

                        {/* Text Explanation */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                                <div className="text-sm text-slate-700"><strong>Draw rows and columns:</strong> <br />Make 3 rows (down) and 4 columns (across).</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                                <div className="text-sm text-slate-700"><strong>Count the objects:</strong> <br />Count all the boxes to find the total.</div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 bg-blue-100 px-3 py-2 rounded-lg border border-blue-200">
                                <span className="text-sm font-bold text-blue-800">Answer:</span>
                                <span className="font-mono font-bold text-lg text-blue-900">12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                {arrays.map(([rows, cols], i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-5 bg-white break-inside-avoid shadow-sm hover:border-blue-300 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-16 bg-slate-50 rounded-br-full -z-10"></div>
                        <div className="absolute top-2 right-2 text-xs font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-md">#{i + 1}</div>

                        <div className="flex flex-col items-center">
                            {/* Problem */}
                            <div className="flex items-center gap-2 mb-4 font-mono text-xl font-bold text-slate-800">
                                <span>{rows}</span>
                                <span>×</span>
                                <span>{cols}</span>
                                <span>=</span>
                                <div className="w-16 h-10 border-b-2 border-slate-400 bg-slate-50"></div>
                            </div>

                            {/* Array Visual */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 w-full flex justify-center">
                                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: 'fit-content' }}>
                                    {Array.from({ length: rows * cols }).map((_, idx) => (
                                        <div key={idx} className="w-6 h-6 border-2 border-slate-300 rounded bg-white print:border-slate-400" />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 font-medium">Array Helper</div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-slate-700">{String.fromCodePoint(0x1F4DD)} Answer Key</div>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                        {arrays.map(([rows, cols], i) => (
                            <div key={i}>
                                <span className="text-slate-500 mr-2">#{i + 1}:</span>
                                <strong>{rows * cols}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}


export function SkipCountingMultiplication({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = "skip-count-mult"
    const { getTrans, t } = useWorksheetTranslation(docId);

    // Static pattern for now as per inline implementation
    const patterns = [
        { pattern: [2, 4, '__', 8, '__', 12], mult: '2 x __ = __', answer: '2 x 6 = 12', missing: [6, 10] },
        { pattern: [3, '__', 9, '__', 15, 18], mult: '3 x __ = __', answer: '3 x 6 = 18', missing: [6, 12] },
        { pattern: [5, 10, '__', 20, '__', 30], mult: '5 x __ = __', answer: '5 x 6 = 30', missing: [15, 25] },
        { pattern: [10, '__', 30, 40, '__', 60], mult: '10 x __ = __', answer: '10 x 6 = 60', missing: [20, 50] },
    ]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Skip Counting for Multiplication')}
            emoji={String.fromCodePoint(0x1F430)}
            description={getTrans('description', "Skip count to find the missing numbers in each pattern. Then write the complete multiplication fact in the blank.")}
            learningObjectives={t('learningObjectives', [
                'Understand multiplication as repeated addition',
                'Master skip counting patterns',
                'Connect counting sequences to multiplication facts'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Skip counting is the foundation of multiplication fluency.',
                'If a child gets stuck, have them use their fingers to keep track of each jump.',
                'Encourage them to say the numbers out loud as they write.'
            ])}
        >
            <PremiumWorksheetBanner
                title={getTrans('title', 'Leap Frog Patterns')}
                subtitle={getTrans('subtitle', 'Skip count to jump towards the answer')}
                icons={{
                    bg1: String.fromCodePoint(0x1F430),
                    bg2: String.fromCodePoint(0x1F33F),
                    float1: String.fromCodePoint(0x1F4A7),
                    float2: String.fromCodePoint(0x1F344)
                }}
                colors={{
                    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                    border: 'border-green-200',
                    pillBg: 'bg-white/80',
                    pillBorder: 'border-green-300',
                    pillText: 'text-green-800',
                    accent: 'text-green-300'
                }}
            />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg print:border print:bg-white text-sm">
                <div className="font-semibold text-green-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', 'Leap Frog Example:')}</span>
                </div>
                <div className="space-y-2">
                    <div className="font-semibold text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong> {getTrans('example.patternText', '2, 4, __, 8, __, 12')}</div>
                    <div className="pl-4 border-l-2 border-green-300 space-y-1">
                        <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'Find the jump: 2 to 4 is +2. Skip count by 2s!')}</div>
                        <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'Fill in: 2, 4, 6, 8, 10, 12')}</div>
                        <div><strong>{getTrans('example.step3', 'Step 3:')}</strong> {getTrans('example.step3Text', 'This is 2 × 6 (six jumps of 2)')}</div>
                        <div className="font-semibold text-green-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '2 × 6 = 12')}</div>
                        <div className="text-xs text-green-700 mt-1 italic">{getTrans('example.tip', 'Tip: Each number in the skip count is a "multiple" of the starting number!')}</div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {patterns.map((item, idx) => (
                    <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                        <div className="font-mono text-xl mb-2">
                            {item.pattern.map((n, i) => (
                                <span key={i} className="inline-block w-16 h-10 text-center border-b-[3px] border-slate-600 mx-1 align-middle">
                                    {typeof n === 'number' ? n : ''}
                                </span>
                            ))}
                        </div>
                        <div className="text-lg text-slate-700 font-semibold">{item.mult.replace(/x/g, String.fromCharCode(0x00D7))}</div>
                    </div>
                ))}
            </div>
            {/* Self-Assessment - Added for completeness though not in inline snippet view, helps standardise */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can skip count correctly</div>
                    <div>{String.fromCharCode(0x2610)} I can connect skip counting to multiplication</div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{getTrans('answerKey', String.fromCharCode(0x2705) + ' Answer Key')}</div>
                    <div className="space-y-2">
                        {patterns.map((item, i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. Missing: {item.missing.join(', ')}. Fact: <strong>{item.answer}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function MultiplicationArraysModels({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-arrays-models'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const arrays: Array<[number, number]> = Array.from({ length: 6 }).map(() => {
        const rows = nextInt(3, 6); const cols = nextInt(3, 6); return [rows, cols];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Multiplication Arrays & Models')}
            emoji={String.fromCodePoint(0x1F3D7)}
            description={getTrans('description', "Draw an array for each problem. Use your favorite color to shade the boxes!")}
            problemCount={arrays.length}
            learningObjectives={t('learningObjectives', [
                'Use arrays to visualize and solve multiplication',
                'Count rows and columns to find products',
                'Understand multiplication as equal groups arranged in arrays'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Arrays help students see the structure of multiplication',
                'Encourage students to count rows x columns',
                'Students can also count all boxes to verify their answer',
                'Extension: Draw arrays for larger numbers'
            ])}
        >
            <PremiumWorksheetBanner
                title={getTrans('title', 'Array Architect')}
                subtitle={getTrans('subtitle', 'Build and Solve with Rows & Columns')}
                icons={{
                    bg1: String.fromCodePoint(0x1F3D7),
                    bg2: String.fromCodePoint(0x1F4CF),
                    float1: String.fromCodePoint(0x1F6A7),
                    float2: String.fromCodePoint(0x1F4D0)
                }}
                colors={{
                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    border: 'border-blue-200',
                    pillBg: 'bg-white/80',
                    pillBorder: 'border-blue-300',
                    pillText: 'text-blue-800',
                    accent: 'text-blue-300'
                }}
            />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white text-sm">
                <div className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', "Let's solve this together:")}</span>
                </div>
                <div className="space-y-2">
                    <div className="font-semibold text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong> 4 {String.fromCharCode(0x00D7)} 5 = ?</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'Look at the array: 4 rows and 5 columns')}</div>
                        <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'Count by rows: 5, 10, 15, 20')}</div>
                        <div><strong>{getTrans('example.step3', 'Step 3:')}</strong> {getTrans('example.step3Text', 'Or count all boxes: 1, 2, 3... 20 boxes total')}</div>
                        <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '20')}</div>
                        <div className="text-xs text-blue-700 mt-1 italic">{getTrans('example.tip', 'Tip: Double check your steps!')}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8" style={{ pageBreakAfter: 'auto' }}>
                {arrays.map(([rows, cols], i) => (
                    <div key={i} className="relative bg-white border-2 border-slate-200 rounded-xl p-5 break-inside-avoid hover:border-blue-300 transition-colors">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md print:border">
                            {i + 1}
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-4 text-center font-bold text-xl text-slate-800 flex items-center gap-2">
                                <span>{rows} × {cols} = </span>
                                <span className="inline-block w-16 h-8 border-b-2 border-slate-400" />
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, minWidth: '120px' }}>
                                    {Array.from({ length: rows * cols }).map((_, idx) => (
                                        <div key={idx} className="w-6 h-6 border border-slate-400 rounded-sm bg-white" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension / Rocket Challenge */}
            <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl print:bg-white print:border break-inside-avoid">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl animate-bounce-slow">{String.fromCodePoint(0x1F680)}</span>
                    <h3 className="font-bold text-lg text-indigo-900">{getTrans('extension.title', 'Rocket Challenge!')}.</h3>
                </div>
                <div className="space-y-3 text-sm text-indigo-800 ml-2">
                    <div className="flex gap-3">
                        <span className="font-bold text-indigo-400">01</span>
                        <p>{getTrans('extension.step1', '1. Draw a massive 10x10 array on your own paper.')}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-indigo-400">02</span>
                        <p>{getTrans('extension.step2', '2. Count how many boxes are in half of it (5x10).')}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-indigo-400">03</span>
                        <p>{getTrans('extension.step3', '3. Create a word problem that matches one of the arrays above.')}</p>
                    </div>
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can use arrays to solve multiplication</div>
                    <div>{String.fromCharCode(0x2610)} I can count rows and columns correctly</div>
                    <div>{String.fromCharCode(0x2610)} I understand how arrays show multiplication</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{getTrans('myScore', 'My score:')}</strong> ___ / {arrays.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans('whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {arrays.map(([rows, cols], i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {rows} x {cols} = <strong>{rows * cols}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function TimesTableHorizontal({ seed, variant, showAnswersForDoc, docId, range = [1, 12] }: SpecificWorksheetProps & { docId: string, range?: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const is1To12 = docId.includes('1-12');
    const is6To12 = docId.includes('6-12');
    const problemCount = is1To12 ? 20 : 16; // 16 for standard to match grid 4x4 or 2x8

    const facts: Array<[number, number]> = Array.from({ length: problemCount }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const theme = is1To12 ? 'purple' : (is6To12 ? 'indigo' : 'blue');
    const accentColor = is1To12 ? 'text-purple-600' : (is6To12 ? 'text-indigo-600' : 'text-blue-600');
    const borderColor = is1To12 ? 'border-purple-200' : (is6To12 ? 'border-indigo-200' : 'border-blue-200');

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', is1To12 ? 'Complete Horizontal Tables' : 'Horizontal Times Tables')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', "Practice your multiplication facts in horizontal format. Solve each problem carefully.")}
            problemCount={facts.length}
            learningObjectives={t('learningObjectives', [
                'Master multiplication facts',
                'Practice horizontal equation format',
                'Build fluency and speed'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Horizontal problems help students read math sentences from left to right',
                'Encourage finding the answer first, then writing it down',
                'Use skip counting or known facts to solve harder problems'
            ])}
        >
            <PremiumWorksheetBanner
                title={is1To12 ? "Grand Multiplication Master" : "Multiplication Practice"}
                subtitle={getTrans('subtitle', is1To12 ? "Mastering Facts 1-12" : `Facts ${range[0]} to ${range[1]}`)}
                icons={{
                    bg1: String.fromCodePoint(0x2716),
                    bg2: String.fromCodePoint(0x1F4D0),
                    float1: String.fromCodePoint(0x1F3AF),
                    float2: String.fromCodePoint(0x2B50)
                }}
                colors={{
                    bg: is1To12 ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : 'bg-gradient-to-br from-blue-50 to-cyan-50',
                    border: is1To12 ? 'border-purple-200' : 'border-blue-200',
                    pillBg: 'bg-white/80',
                    pillBorder: is1To12 ? 'border-purple-300' : 'border-blue-300',
                    pillText: is1To12 ? 'text-purple-800' : 'text-blue-800',
                    accent: is1To12 ? 'text-purple-300' : 'text-blue-300'
                }}
            />

            {/* Strategy Spotlight */}
            <div className="mb-8 page-break-inside-avoid break-inside-avoid">
                <div className={`bg-white border-2 ${borderColor} rounded-xl p-6 shadow-sm relative overflow-hidden`}>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div className={`w-10 h-10 rounded-full ${is1To12 ? 'bg-purple-100' : 'bg-blue-100'} flex items-center justify-center text-xl shadow-inner`}>
                            {String.fromCodePoint(0x1F4A1)}
                        </div>
                        <h3 className={`font-bold text-lg ${is1To12 ? 'text-purple-900' : 'text-blue-900'}`}>
                            {getTrans('example.title', "Strategy Spotlight")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className={`p-6 rounded-lg border ${borderColor} ${is1To12 ? 'bg-purple-50' : 'bg-blue-50'} flex flex-col items-center justify-center`}>
                            <div className="font-mono text-3xl font-bold text-slate-800 mb-2">
                                {is6To12 ? '7' : '3'} × {is6To12 ? '8' : '4'} = <span className={accentColor}>{is6To12 ? '56' : '12'}</span>
                            </div>
                            <div className="text-sm text-slate-600 text-center">
                                {is6To12 ? '7 groups of 8' : '3 groups of 4'}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${is1To12 ? 'bg-purple-600' : 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>1</div>
                                <div className="text-sm text-slate-700"><strong>Read the problem:</strong> <br />First number times second number.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${is1To12 ? 'bg-purple-600' : 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>2</div>
                                <div className="text-sm text-slate-700"><strong>Use a strategy:</strong> <br />Skip count, use known facts, or repeated addition.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-6 bg-white shadow-sm flex items-center justify-between break-inside-avoid">
                        <div className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-700">
                            <span className="w-8 text-right">{a}</span>
                            <span className="text-slate-400 text-xl">×</span>
                            <span className="w-8 text-left">{b}</span>
                            <span className="text-slate-400 text-xl">=</span>
                        </div>
                        <div className="w-16 h-12 border-b-2 border-slate-300 bg-slate-50 rounded-t-lg"></div>
                    </div>
                ))}
            </div>

            {/* Answer Key */}
            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-slate-700">{String.fromCodePoint(0x1F4DD)} Answer Key</div>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                        {facts.map(([a, b], i) => (
                            <div key={i}>
                                <span className="text-slate-500 mr-2">#{i + 1}:</span>
                                <strong>{a * b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationWindowArrays({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-arrays'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)

    const problems = Array.from({ length: 4 }, () => {
        const rows = Math.floor(rng() * 4) + 2 // 2-5 rows
        const cols = Math.floor(rng() * 5) + 2 // 2-6 cols
        return { rows, cols, product: rows * cols }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'City Builder: Window Arrays')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', 'Count the rows and columns of windows to find the total product.')}
            problemCount={4}
            learningObjectives={t('learningObjectives', [
                'Understand multiplication as repeated addition',
                'Visualize arrays (rows x columns)',
                'Write multiplication sentences'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Rows go side to side (like a building floor).',
                'Columns go up and down.',
                'Count by skip counting the rows!'
            ])}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-gradient-x mb-4" />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', 'Project: Building Windows')}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong></div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'There are 3 rows and 4 columns')}</div>
                        <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'Multiplication fact: 3 × 4')}</div>
                        <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '12 windows')}</div>
                        <div className="text-xs text-blue-700 mt-1">{getTrans('example.tip', 'Tip: Think of it as 4 + 4 + 4 = 12')}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-slate-100 border-b-8 border-slate-300 rounded-t-xl p-6 flex flex-col items-center relative">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-400">BLDG-{i + 100}</div>

                        {/* The Building */}
                        <div className="bg-blue-900 p-3 rounded-lg shadow-lg mb-4 border-2 border-blue-800" style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${p.cols}, 1fr)`,
                            gap: '8px'
                        }}>
                            {Array.from({ length: p.rows * p.cols }).map((_, j) => (
                                <div key={j} className="w-8 h-10 bg-yellow-200 border border-yellow-500 shadow-inner rounded-sm relative overflow-hidden">
                                    <div className="absolute top-1/2 w-full h-px bg-yellow-500"></div>
                                    <div className="absolute left-1/2 h-full w-px bg-yellow-500"></div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="w-full bg-white p-3 rounded-lg border-2 border-slate-200 flex items-center justify-center gap-2 font-bold text-lg text-slate-700">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-slate-400 uppercase">Rows</span>
                                <div className="w-10 h-8 border-b-2 border-slate-400 flex items-center justify-center bg-slate-50">{p.rows}</div>
                            </div>
                            <span>x</span>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-slate-400 uppercase">Cols</span>
                                <div className="w-10 h-8 border-b-2 border-slate-400 flex items-center justify-center bg-slate-50">{p.cols}</div>
                            </div>
                            <span>=</span>
                            <div className="w-14 h-10 border-2 border-dashed border-cyan-500 rounded flex items-center justify-center bg-cyan-50 text-cyan-800">?</div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-cyan-300 bg-cyan-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-cyan-900 mb-2">{String.fromCharCode(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-cyan-800">
                        {problems.map((p, i) => (
                            <div key={i}>
                                <strong>BLDG-{i + 100}:</strong> {p.rows} rows x {p.cols} cols = <strong>{p.product} windows</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

interface TimesTableProps extends SpecificWorksheetProps {
    docId: string
    range: [number, number]
}

export function TimesTableVertical({ seed, variant, showAnswersForDoc, docId, range = [1, 12] }: TimesTableProps) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problemCount = range[1] > 9 ? 16 : 12;
    const facts: Array<[number, number]> = Array.from({ length: problemCount }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const is1To12 = range[1] === 12 && range[0] === 1;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Vertical Times Tables')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', "Solve each multiplication problem in vertical format. Pay attention to place value alignment.")}
            problemCount={facts.length}
            learningObjectives={t('learningObjectives', [
                'Master vertical multiplication format',
                'Practice place value alignment',
                'Build calculation speed'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Ensure numbers are stacked correctly (ones under ones)',
                'Draw a line to separate the problem from the answer',
                'Say the problem out loud as "top times bottom"'
            ])}
        >
            <PremiumWorksheetBanner
                title={getTrans('banner.title', 'Vertical Velocity')}
                subtitle={getTrans('banner.subtitle', `Vertical Mastery: ${range[0]}-${range[1]}`)}
                icons={{
                    bg1: String.fromCodePoint(0x2716),
                    bg2: String.fromCodePoint(0x1F4CA),
                    float1: String.fromCodePoint(0x1F680),
                    float2: String.fromCodePoint(0x1F4C8)
                }}
                colors={{
                    bg: range[0] === 1 ? 'bg-gradient-to-br from-teal-50 to-emerald-50' : 'bg-gradient-to-br from-orange-50 to-amber-50',
                    border: range[0] === 1 ? 'border-teal-200' : 'border-orange-200',
                    pillBg: 'bg-white/80',
                    pillBorder: range[0] === 1 ? 'border-teal-300' : 'border-orange-300',
                    pillText: range[0] === 1 ? 'text-teal-800' : 'text-orange-800',
                    accent: range[0] === 1 ? 'text-teal-300' : 'text-orange-300'
                }}
            />

            {/* Strategy Spotlight */}
            <div className="mb-8 page-break-inside-avoid break-inside-avoid">
                <div className={`bg-white border-2 ${range[0] === 1 ? 'border-teal-200' : 'border-orange-200'} rounded-xl p-6 shadow-sm relative overflow-hidden`}>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div className={`w-10 h-10 rounded-full ${range[0] === 1 ? 'bg-teal-100' : 'bg-orange-100'} flex items-center justify-center text-xl shadow-inner`}>
                            {String.fromCodePoint(0x1F4A1)}
                        </div>
                        <h3 className={`font-bold text-lg ${range[0] === 1 ? 'text-teal-900' : 'text-orange-900'}`}>
                            {getTrans('example.title', "Strategy Spotlight: Alignment")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className={`p-6 rounded-lg border ${range[0] === 1 ? 'border-teal-200 bg-teal-50' : 'border-orange-200 bg-orange-50'} flex flex-col items-center justify-center`}>
                            <div className="font-mono text-4xl font-bold text-slate-800 flex flex-col items-end leading-none">
                                <div className="pr-2">{range[1] > 9 ? '12' : '4'}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl text-slate-400">×</span>
                                    <span className="pr-2">{range[1] > 9 ? '3' : '5'}</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 mt-2 mb-2"></div>
                                <div className={`pr-1 ${range[0] === 1 ? 'text-teal-600' : 'text-orange-600'}`}>{range[1] > 9 ? '36' : '20'}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${range[0] === 1 ? 'bg-teal-600' : 'bg-orange-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>1</div>
                                <div className="text-sm text-slate-700"><strong>Stack it up:</strong> <br />Make sure the numbers are lined up on the right side (ones place).</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${range[0] === 1 ? 'bg-teal-600' : 'bg-orange-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>2</div>
                                <div className="text-sm text-slate-700"><strong>Multiply down:</strong> <br />Multiply the numbers and write the answer at the bottom, keeping it aligned!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col items-center justify-center break-inside-avoid">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-300">#{i + 1}</div>
                        <div className="font-mono text-3xl font-bold text-slate-800 flex flex-col items-end leading-snug">
                            <div className="pr-2">{a}</div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl text-slate-400">×</span>
                                <span className="pr-2">{b}</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-700 mt-1 mb-2"></div>
                            <div className="w-24 h-10 border-2 border-dashed border-slate-200 bg-slate-50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Key */}
            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-slate-700">{String.fromCodePoint(0x1F4DD)} Answer Key</div>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                        {facts.map(([a, b], i) => (
                            <div key={i}>
                                <span className="text-slate-500 mr-2">#{i + 1}:</span>
                                <strong>{a * b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}


export function TimesTableMissing({ seed, variant, showAnswersForDoc, docId, range = [1, 12] }: SpecificWorksheetProps & { docId: string, range?: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

    const problems = Array.from({ length: 12 }).map(() => {
        const type = nextInt(1, 3);
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        const answer = a * b;
        if (type === 1) return { a, b, missingType: 'answer' as const };
        if (type === 2) return { a, answer, missingType: 'b' as const };
        return { b, answer, missingType: 'a' as const };
    });

    const is1To12 = range[1] === 12 && range[0] === 1;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Missing Numbers Challenge')}
            emoji={String.fromCodePoint(0x1F50D)}
            description={getTrans('description', "Find the missing number to complete each multiplication fact.")}
            problemCount={problems.length}
            learningObjectives={t('learningObjectives', [
                'Master basic multiplication facts',
                'Understand relationship between factors and products',
                'Build algebraic thinking'
            ])}
            parentTeacherTips={t('parentTeacherTips', [
                'Ask "multiply what by X to get Y?"',
                'Explain that division is the reverse of multiplication',
                'Use counters to show groups if stuck'
            ])}
        >
            <PremiumWorksheetBanner
                title={getTrans('banner.title', 'Fact Finder')}
                subtitle={getTrans('banner.subtitle', 'Detective Mission: Missing Numbers')}
                icons={{
                    bg1: String.fromCodePoint(0x1F50D),
                    bg2: String.fromCodePoint(0x2753),
                    float1: String.fromCodePoint(0x1F9E9),
                    float2: String.fromCodePoint(0x1F4D6)
                }}
                colors={{
                    bg: range[0] === 1 ? 'bg-gradient-to-br from-amber-50 to-yellow-50' : 'bg-gradient-to-br from-indigo-50 to-violet-50',
                    border: range[0] === 1 ? 'border-amber-200' : 'border-indigo-200',
                    pillBg: 'bg-white/80',
                    pillBorder: range[0] === 1 ? 'border-amber-300' : 'border-indigo-300',
                    pillText: range[0] === 1 ? 'text-amber-800' : 'text-indigo-800',
                    accent: range[0] === 1 ? 'text-amber-300' : 'text-indigo-300'
                }}
            />

            {/* Strategy Spotlight */}
            <div className="mb-8 page-break-inside-avoid break-inside-avoid">
                <div className={`bg-white border-2 ${range[0] === 1 ? 'border-amber-200' : 'border-indigo-200'} rounded-xl p-6 shadow-sm relative overflow-hidden`}>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div className={`w-10 h-10 rounded-full ${range[0] === 1 ? 'bg-amber-100' : 'bg-indigo-100'} flex items-center justify-center text-xl shadow-inner`}>
                            {String.fromCodePoint(0x1F575)}
                        </div>
                        <h3 className={`font-bold text-lg ${range[0] === 1 ? 'text-amber-900' : 'text-indigo-900'}`}>
                            {getTrans('example.title', "Detective's Guide")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className={`p-6 rounded-lg border ${range[0] === 1 ? 'border-amber-200 bg-amber-50' : 'border-indigo-200 bg-indigo-50'} flex flex-col items-center justify-center`}>
                            <div className="font-mono text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <span>?</span>
                                <span>×</span>
                                <span>3</span>
                                <span>=</span>
                                <span className={range[0] === 1 ? 'text-amber-600' : 'text-indigo-600'}>12</span>
                            </div>
                            <div className="text-sm text-slate-500 mt-2 italic">{"What number times 3 is 12?"}</div>
                            <div className={`mt-3 px-4 py-1 rounded-full ${range[0] === 1 ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'} text-xs font-bold`}>
                                Answer: 4
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${range[0] === 1 ? 'bg-amber-600' : 'bg-indigo-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>1</div>
                                <div className="text-sm text-slate-700"><strong>Ask the question:</strong> <br />"How many groups of 3 make 12?"</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${range[0] === 1 ? 'bg-amber-600' : 'bg-indigo-600'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>2</div>
                                <div className="text-sm text-slate-700"><strong>Use division:</strong> <br />You can rewrite it as division: 12 ÷ 3 = ?</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-8 bg-white shadow-sm flex items-center justify-center break-inside-avoid min-h-[140px]">
                        <div className="absolute top-2 left-3 text-[10px] font-black text-slate-300">#{i + 1}</div>
                        <div className="font-mono text-2xl font-bold text-slate-700 flex items-center justify-center gap-2">
                            {p.missingType === 'a' ? (
                                <div className={`w-14 h-11 border-b-4 border-dashed ${range[0] === 1 ? 'border-amber-300 bg-amber-50' : 'border-indigo-300 bg-indigo-50'} rounded-lg flex items-center justify-center text-slate-400 opacity-50`}>?</div>
                            ) : <span>{p.a}</span>}

                            <span className="text-slate-400 text-xl">×</span>

                            {p.missingType === 'b' ? (
                                <div className={`w-14 h-11 border-b-4 border-dashed ${range[0] === 1 ? 'border-amber-300 bg-amber-50' : 'border-indigo-300 bg-indigo-50'} rounded-lg flex items-center justify-center text-slate-400 opacity-50`}>?</div>
                            ) : <span>{p.b}</span>}

                            <span className="text-slate-400 text-xl">=</span>

                            {p.missingType === 'answer' ? (
                                <div className={`w-16 h-11 border-b-4 border-dashed ${range[0] === 1 ? 'border-amber-300 bg-amber-50' : 'border-indigo-300 bg-indigo-50'} rounded-lg flex items-center justify-center text-slate-400 opacity-50`}>?</div>
                            ) : <span>{p.answer}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Key */}
            {showAnswersForDoc(docId, () => {
                const answers = problems.map((p) => {
                    if (p.missingType === 'answer') {
                        return { a: p.a!, b: p.b!, answer: p.a! * p.b!, note: `${p.a} × ${p.b} = ${p.a! * p.b!}` };
                    } else if (p.missingType === 'b' && p.a !== undefined && p.answer !== undefined) {
                        return { a: p.a, b: p.answer / p.a, answer: p.answer, note: `${p.answer} ÷ ${p.a} = ${p.answer / p.a}` };
                    } else if (p.missingType === 'a' && p.b !== undefined && p.answer !== undefined) {
                        return { a: p.answer / p.b, b: p.b, answer: p.answer, note: `${p.answer} ÷ ${p.b} = ${p.answer / p.b}` };
                    }
                    return { a: 1, b: 1, answer: 1, note: '' }; // fallback
                });
                return (
                    <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-sm font-mono break-inside-avoid">
                        <div className="font-bold mb-2 text-slate-700">{String.fromCodePoint(0x1F4DD)} Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                            {answers.map((ans, i) => (
                                <div key={i} className="flex justify-between border-b border-slate-100 pb-1">
                                    <span className="text-slate-500 mr-2">#{i + 1}:</span>
                                    <span className="font-bold text-slate-700">{ans.note}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-2 bg-indigo-50 rounded text-xs text-indigo-700 italic border border-indigo-100">
                            Tip: For missing factors, think about division!
                        </div>
                    </div>
                );
            })}
        </WorksheetSectionWrapper>
    )
}

export function MultiplicationPatterns({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-patterns'
    const { getTrans, t: worksheetT } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    // Generate 4 distinct pattern problems
    const patterns = Array.from({ length: 4 }).map((_, i) => {
        const base = nextInt(2, 9);
        const step = nextInt(1, 4); // Slightly more variety
        const start = nextInt(1, 4);

        const items = Array.from({ length: 5 }).map((_, j) => {
            const mult = start + (j * step);
            return {
                eq: `${base} × ${mult}`,
                val: base * mult,
                hidden: j >= 3 // Hide answers for the last 2
            };
        });

        const increment = base * step;
        const description = `Add ${increment} each time`;

        return { items, description, base, step };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Multiplication Patterns')}
            emoji={String.fromCodePoint(0x1F50D)}
            description={getTrans('description', 'Observe how the numbers change. Can you find the hidden rule?')}
            problemCount={patterns.length}
            learningObjectives={worksheetT('learningObjectives', [
                'Identify patterns in multiplication tables',
                'Extend numerical sequences',
                'Recognize algebraic relationships'
            ])}
            parentTeacherTips={worksheetT('parentTeacherTips', [
                'Ask: "What is the rule between each number?"',
                'Encourage students to count the jump between answers',
                'Connect addition to multiplication jumps'
            ])}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-500 animate-gradient-x mb-4" />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', 'Example - Pattern Detective:')}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong> {getTrans('example.problemText', 'Find the rule for: 2, 4, 6, 8, ...')}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'Look at the "jump" between numbers: 2 to 4 is +2, 4 to 6 is +2')}</div>
                        <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'The rule is: Add 2 each time (Multiples of 2)')}</div>
                        <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', 'The next number is 10!')}</div>
                        <div className="text-xs text-blue-700 mt-1">{getTrans('example.tip', 'Tip: Multiplication is just adding the same number over and over!')}</div>
                    </div>
                </div>
            </div>
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-500 animate-gradient-x mb-4" />

            {/* Premium Header Banner */}
            <PremiumWorksheetBanner
                title="Pattern Detective"
                subtitle="Mission: Find the Hidden Rule"
                icons={{
                    bg1: "🔍",
                    bg2: "🧩",
                    float1: "🔎",
                    float2: "💡"
                }}
                colors={{
                    bg: "bg-indigo-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-900",
                    accent: "text-indigo-200"
                }}
            />

            {/* Premium Instruction Card */}
            <div className="mb-6 p-4 bg-blue-50/50 border-2 border-blue-200 rounded-xl print:border print:bg-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl text-blue-100/50 select-none">❔</div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">Task</div>
                    <div className="font-bold text-blue-900 text-base">Look for the Rule</div>
                </div>
                <div className="pl-11 space-y-1 text-sm text-blue-800">
                    <div>Find what stays the same and what changes.</div>
                    <div>Describe how the answers "jump" from one to the next.</div>
                </div>
            </div>

            <div className="space-y-6 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {patterns.map((item, idx) => (
                    <div key={idx} className="border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-indigo-300 transition-colors break-inside-avoid relative overflow-hidden">
                        <div className="absolute -right-2 -top-2 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 font-bold text-xl">
                            {idx + 1}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            {item.items.map((part, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                        <span className="text-lg font-mono text-slate-800 whitespace-nowrap">{part.eq} =</span>
                                        {!part.hidden ? (
                                            <span className="text-lg font-mono font-bold text-indigo-700 ml-2">{part.val}</span>
                                        ) : (
                                            <span className="inline-block w-16 h-8 border-b-2 border-slate-400 bg-slate-100/50 ml-2 rounded-t" />
                                        )}
                                    </div>
                                    {i < item.items.length - 1 && <span className="text-slate-300 font-bold ml-1">→</span>}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex flex-col md:flex-row md:items-center gap-3">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">The Rule is:</div>
                            <div className="flex-1 min-h-12 border-2 border-dashed border-indigo-200 rounded-xl p-2 bg-indigo-50/30 font-medium text-indigo-900 flex items-center px-4">
                                <span className="text-slate-400 italic text-sm">Describe the pattern here...</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Key */}
            {showAnswersForDoc(docId, () => (
                <div className="mt-10 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-2xl print:border print:bg-white print:page-break-before-always relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 text-8xl text-emerald-100 rotate-12 select-none">✓</div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">✓</div>
                        <h3 className="text-xl font-bold text-emerald-900">Detective Solution Key</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patterns.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-200">
                                <div className="font-bold text-emerald-800 mb-2">Pattern {idx + 1}:</div>
                                <div className="font-mono text-emerald-700 text-sm">
                                    {item.items.map(p => p.val).join(', ')}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-emerald-600">
                                    Rule: {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationTimed({ seed, variant, showAnswersForDoc, docId, range, count, timeLimit }: SpecificWorksheetProps & { docId: string, range: [number, number], count: number, timeLimit: string }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const facts: Array<[number, number]> = Array.from({ length: count }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const is1To12 = docId.includes('1-12');
    const is6To12 = docId.includes('6-12');

    // Default configuration (1-5)
    let title = getTrans('title', 'Timed Times Table Test (1-5)');
    let description = getTrans('description', "Practice times tables 1-5 with this timed test. Build speed and accuracy with basic multiplication facts.");
    let objectives = [
        'Memorize multiplication facts for numbers 1-5',
        'Practice timed multiplication problems',
        'Build speed and fluency'
    ];
    let tips = [
        'Start with a goal of 5 minutes, then try to beat your time',
        'If you get stuck, skip it and come back',
        'Extension: Graph your time each day to see improvement'
    ];
    let gradient = "from-green-400 to-emerald-400";

    if (is1To12) {
        title = getTrans('title', 'Complete Timed Test (1-12)');
        description = getTrans('description', "Comprehensive timed multiplication test covering all facts 1-12. Perfect for building multiplication fluency and memorizing times tables.");
        objectives = [
            'Build speed and accuracy with all multiplication facts 1-12',
            'Practice comprehensive timed multiplication to build fluency',
            'Track progress and improve time across all facts'
        ];
        tips = [
            'This is comprehensive practice - allow 5 minutes initially',
            'Use all strategies: doubles, patterns, breaking down, known facts',
            'Focus on accuracy first, then work on speed',
            'Extension: Try to complete in under 4 minutes!'
        ];
        gradient = "from-indigo-400 to-purple-400";
    } else if (is6To12) {
        title = getTrans('title', 'Timed Times Table Test (6-12)');
        description = getTrans('description', "Master speed with timed multiplication tests for facts 6-12. Fun multiplication worksheets that build confidence and math fact practice.");
        objectives = [
            'Build speed and accuracy with advanced multiplication facts 6-12',
            'Practice timed multiplication to build fluency',
            'Track progress and improve time with challenging facts'
        ];
        tips = [
            'These facts are more challenging - allow 3 minutes initially',
            'Use strategies: breaking down (8x7 = 8x5 + 8x2), known facts',
            'Focus on accuracy first, then work on speed',
            'Extension: Try to complete in under 2.5 minutes!'
        ];
        gradient = "from-purple-400 to-pink-400";
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={title}
            emoji={String.fromCodePoint(0x23F1)} // Stopwatch
            description={description}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                return Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string' ? obj : objectives
            })()}
            parentTeacherTips={(() => {
                const obj = t(`worksheets.${docId}.parentTeacherTips`)
                return Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string' ? obj : tips
            })()}
        >
            <div className={`print:hidden h-1 w-16 rounded-full bg-gradient-to-r ${gradient} animate-gradient-x mb-2`} />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', "Timed Challenge Tip:")}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong> {getTrans('example.problemText', is1To12 ? '9 × 8 = ?' : (is6To12 ? '8 × 7 = ?' : '3 × 4 = ?'))}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{getTrans('example.strategy', 'Quick method:')}</strong> {getTrans('example.strategyText', is1To12 ? 'Think: 9 × 8 = 9 × 4 × 2 = 36 × 2 = 72' : (is6To12 ? 'Break it down: (5 × 7) + (3 × 7) = 35 + 21 = 56' : 'Count: 4, 8, 12 (skip count by 4s three times)'))}</div>
                        <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', is1To12 ? '72' : (is6To12 ? '56' : '12'))}</div>
                        <div className="text-xs text-blue-700 mt-1">{getTrans('example.tip', 'Tip: Double check your steps!')}</div>
                    </div>
                </div>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
                <strong>{String.fromCodePoint(0x23F1)}</strong> Try to complete all problems in {timeLimit}. Write your start time: ______
            </div>

            <div className="grid grid-cols-4 gap-2 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-2 bg-white text-center break-inside-avoid shadow-sm print:shadow-none">
                        <div className="font-mono text-lg leading-6">
                            {a} x {b} = <span className="inline-block w-12 h-6 border-b-[2px] border-slate-600 mx-1" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Try to beat your time by 30 seconds next time!</div>
                    <div>2. Circle the problems that were hardest and practice them</div>
                    <div>3. Create your own timed test with 5 problems</div>
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I finished before the time limit</div>
                    <div>{String.fromCharCode(0x2610)} I double-checked my answers</div>
                    <div>{String.fromCharCode(0x2610)} I can say the answers quickly (fluency)</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{getTrans('myScore', 'My score:')}</strong> ___ / {facts.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>Time taken:</strong> _____ minutes _____ seconds
                </div>
                <div className="mt-2 text-xs">
                    <strong>Facts I want to practice more:</strong> _________________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="border-b border-emerald-200 pb-1 text-emerald-800">
                                {i + 1}. {a} x {b} = {a * b}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-emerald-100 rounded text-xs text-emerald-900">
                        <strong>{String.fromCodePoint(0x2705)}</strong> Great job practicing timed tests! Keep practicing daily to build speed and automaticity!
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationWordProblems({ seed, variant, showAnswersForDoc, docId, difficulty = 'basic', problemCount = 6 }: SpecificWorksheetProps & { docId: string, difficulty?: 'basic' | 'multi-step' | 'complex', problemCount?: number }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }
    function pick<T>(arr: T[]): T { return arr[nextInt(0, arr.length - 1)]; }

    const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Logan'];
    const items = [
        { name: 'apples', container: 'bags', containerPlural: 'bags' },
        { name: 'cookies', container: 'jars', containerPlural: 'jars' },
        { name: 'books', container: 'shelves', containerPlural: 'shelves' },
        { name: 'pencils', container: 'boxes', containerPlural: 'boxes' },
        { name: 'toys', container: 'baskets', containerPlural: 'baskets' },
        { name: 'stickers', container: 'sheets', containerPlural: 'sheets' }
    ];

    interface WordProblem {
        text: string;
        step1?: string;
        step2?: string;
        answer: number;
        answerUnit: string;
        equation: string;
    }

    const problems: WordProblem[] = Array.from({ length: problemCount }).map(() => {
        const name = pick(names);
        const item = pick(items);

        if (difficulty === 'multi-step') {
            // Multi-step: Multiply then Add/Subtract
            // e.g., "Emma has 3 bags. Each bag has 5 apples. She gets 2 more apples. How many total?"
            const groups = nextInt(3, 9);
            const inEach = nextInt(3, 9);
            const extra = nextInt(2, 10);
            const isAdd = nextInt(0, 1) === 1; // 50/50 chance of add or subtract problem

            // Ensure subtraction is valid (product > extra)
            const operation = isAdd ? 'add' : (groups * inEach > extra ? 'sub' : 'add');

            const total = operation === 'add'
                ? (groups * inEach) + extra
                : (groups * inEach) - extra;

            let text = '';
            if (operation === 'add') {
                text = `${name} has ${groups} ${item.containerPlural}. Each ${item.container.replace(/s$/, '')} has ${inEach} ${item.name}. Then ${name} finds ${extra} more ${item.name}. How many ${item.name} does ${name} have in total?`;
            } else {
                text = `${name} has ${groups} ${item.containerPlural}. Each ${item.container.replace(/s$/, '')} has ${inEach} ${item.name}. Then ${name} gives away ${extra} ${item.name}. How many ${item.name} does ${name} have left?`;
            }

            return {
                text,
                step1: `${groups} × ${inEach} = ${groups * inEach}`,
                step2: operation === 'add'
                    ? `${groups * inEach} + ${extra} = ${total}`
                    : `${groups * inEach} - ${extra} = ${total}`,
                answer: total,
                answerUnit: item.name,
                equation: `(${groups} × ${inEach}) ${operation === 'add' ? '+' : '-'} ${extra} = ${total}`
            };

        } else if (difficulty === 'complex') {
            // Complex: True multi-step problems or 3-digit x 1-digit / 2-digit x 2-digit variety
            const type = nextInt(0, 2); // 0: Sum of two products, 1: Multi-step product, 2: Large numbers

            if (type === 0) {
                // Sum of two products: (A x B) + (C x D)
                const g1 = nextInt(10, 15);
                const i1 = nextInt(4, 6);
                const g2 = nextInt(10, 15);
                const i2 = nextInt(3, 5);
                const item2 = pick(items.filter(it => it.name !== item.name));

                return {
                    text: `${name} has ${g1} ${item.containerPlural} of ${item.name} and ${g2} ${item2.containerPlural} of ${item2.name}. Each ${item.container.replace(/s$/, '')} has ${i1} ${item.name}, and each ${item2.container.replace(/s$/, '')} has ${i2} ${item2.name}. How many total items does ${name} have?`,
                    step1: `${g1} × ${i1} = ${g1 * i1}`,
                    step2: `${g2} × ${i2} = ${g2 * i2} | Total: ${g1 * i1} + ${g2 * i2} = ${(g1 * i1) + (g2 * i2)}`,
                    answer: (g1 * i1) + (g2 * i2),
                    answerUnit: 'items',
                    equation: `(${g1} × ${i1}) + (${g2} × ${i2}) = ${(g1 * i1) + (g2 * i2)}`
                };
            } else if (type === 1) {
                // Comparison: (A x B) - (C x D) or similar
                const g1 = nextInt(15, 25);
                const i1 = nextInt(5, 8);
                const spent = nextInt(20, 50);

                return {
                    text: `A teacher buys ${g1} packs of pencils. Each pack contains ${i1} pencils. After the class uses ${spent} pencils, how many pencils are left in the storage?`,
                    step1: `${g1} × ${i1} = ${g1 * i1}`,
                    step2: `${g1 * i1} - ${spent} = ${(g1 * i1) - spent}`,
                    answer: (g1 * i1) - spent,
                    answerUnit: 'pencils',
                    equation: `(${g1} × ${i1}) - ${spent} = ${(g1 * i1) - spent}`
                };
            } else {
                // Large Numbers with a twist
                const sets = nextInt(5, 8);
                const itemsPerSet = nextInt(120, 150);
                return {
                    text: `A factory produces ${sets} sets of parts every hour. If each set contains ${itemsPerSet} small components, how many components are produced in one hour? Show your calculation.`,
                    step1: `Multiply ${sets} by ${itemsPerSet}`,
                    answer: sets * itemsPerSet,
                    answerUnit: 'components',
                    equation: `${sets} × ${itemsPerSet} = ${sets * itemsPerSet}`
                };
            }

        } else {
            // Basic: 1-step (1-digit x 1-digit)
            const groups = nextInt(2, 9);
            const inEach = nextInt(2, 9);
            return {
                text: `${name} has ${groups} ${item.containerPlural}. Each ${item.container.replace(/s$/, '')} has ${inEach} ${item.name}. How many ${item.name} does ${name} have in total?`,
                step1: `${groups} groups of ${inEach}`,
                answer: groups * inEach,
                answerUnit: item.name,
                equation: `${groups} × ${inEach} = ${groups * inEach}`
            };
        }
    });

    let defaultTitle = 'Multiplication Word Problems';
    let defaultDesc = 'Solve the multiplication word problems. Show your work.';
    let emoji = String.fromCodePoint(0x1F4DD); // Memo
    let themeColor = "indigo";

    if (difficulty === 'multi-step') {
        defaultTitle = 'Multi-Step Word Problems';
        defaultDesc = 'Two-step problems involving multiplication and addition/subtraction.';
        emoji = String.fromCodePoint(0x1F9E9); // Puzzle
        themeColor = "purple";
    } else if (difficulty === 'complex') {
        defaultTitle = 'Complex Multiplication Problems';
        defaultDesc = 'Challenging word problems with larger numbers.';
        emoji = String.fromCodePoint(0x1F4AA); // Flexed bicep
        themeColor = "blue";
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', defaultTitle)}
            emoji={emoji}
            description={getTrans('description', defaultDesc)}
            problemCount={problems.length}
            learningObjectives={[
                getTrans('learningObjectives.0', 'Apply multiplication to real-world scenarios'),
                getTrans('learningObjectives.1', 'Interpret and solve word problems'),
                getTrans('learningObjectives.2', difficulty === 'multi-step' ? 'Solve multi-step mathematical problems' : 'Identify groups and items per group')
            ]}
            parentTeacherTips={[
                getTrans('parentTeacherTips.0', 'Encourage drawing a picture or model to visualize the problem'),
                getTrans('parentTeacherTips.1', 'Circle the numbers and underline the question'),
                getTrans('parentTeacherTips.2', 'Ask: "What do we know? What are we trying to find?"')
            ]}
        >
            <PremiumWorksheetBanner
                title={difficulty === 'multi-step' ? "Master Mission" : (difficulty === 'complex' ? "Expert Challenge" : "Case File")}
                subtitle="Solving for Success"
                icons={{
                    bg1: emoji,
                    bg2: "🕵️",
                    float1: "📋",
                    float2: "💡"
                }}
                colors={{
                    bg: `bg-${themeColor}-50`,
                    border: `border-${themeColor}-200`,
                    pillBg: "bg-white/90",
                    pillBorder: `border-${themeColor}-300`,
                    pillText: `text-${themeColor}-900`,
                    accent: `text-${themeColor}-200`
                }}
            />

            <div className="space-y-8">
                {problems.map((prob, i) => (
                    <div key={i} className={`relative overflow-hidden bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:border-${themeColor}-200 transition-colors break-inside-avoid`}>
                        <div className={`absolute top-0 right-0 bg-${themeColor}-100 text-${themeColor}-800 px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-widest`}>Task #{i + 1}</div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-grow">
                                <div className="text-lg font-medium text-slate-800 mb-6 leading-relaxed pt-2">
                                    {prob.text}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                                    <div className="lg:col-span-12 xl:col-span-7 space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="p-1 px-2 bg-slate-800 text-white text-[9px] font-black uppercase rounded tracking-widest">Workspace</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Strategic Thinking Area</span>
                                        </div>
                                        <div className="min-h-[180px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 relative group">
                                            <div className="absolute inset-4 border border-slate-100 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                                                <span className="text-slate-300 text-sm italic">Sketch patterns, arrays, or bar models here...</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12 xl:col-span-5 flex flex-col h-full">
                                        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 space-y-5 h-full flex flex-col justify-between shadow-inner">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Equation</span>
                                                    <span className="text-slate-300 lowercase font-normal italic">Show your steps</span>
                                                </div>
                                                <div className="h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    <span>Final Answer</span>
                                                    <span className="text-indigo-300 lowercase font-normal italic">Including units</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-grow h-14 bg-white border-b-4 border-indigo-200 border-2 border-indigo-100 rounded-xl shadow-sm flex items-center px-4" />
                                                    <div className="text-slate-400 font-bold italic text-sm whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full">{prob.answerUnit}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className={`mt-10 p-6 bg-${themeColor}-900 rounded-2xl border-2 border-${themeColor}-400/30 text-white`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-full bg-${themeColor}-500 flex items-center justify-center text-white text-xl animate-pulse`}>✓</div>
                        <div>
                            <h3 className="text-xl font-bold">Mission Debrief: Solutions</h3>
                            <p className={`text-${themeColor}-300 text-sm`}>Verified results for Task Set {seed}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {problems.map((prob, i) => (
                            <div key={i} className={`bg-white/5 border border-white/10 rounded-xl p-4 space-y-2`}>
                                <div className={`text-${themeColor}-400 font-bold text-xs uppercase`}>Task {i + 1}</div>
                                <div className="text-sm opacity-90 font-mono">
                                    {prob.step1 && <div className="text-white/70">Step 1: {prob.step1}</div>}
                                    {prob.step2 && <div className="text-white/70">Step 2: {prob.step2}</div>}
                                    <div className="mt-2 text-white font-bold text-base">Answer: {prob.answer} {prob.answerUnit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationFactFamilies({ seed, variant, showAnswersForDoc, docId, limit = 12, count = 10 }: SpecificWorksheetProps & { docId: string, limit?: number, count?: number }) {
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: count }, () => {
        const a = nextInt(2, limit);
        const b = nextInt(2, limit);
        return { a, b, p: a * b };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Fact Families (Multiplication & Division)')}
            emoji={String.fromCodePoint(0x1F3E0)} // House/Structure
            description={getTrans('description', 'Fill in the fact family triangles and write four related equations for each set of numbers.')}
            problemCount={problems.length}
            learningObjectives={[
                'Understand the relationship between multiplication and division',
                'Recognize inverse operations',
                'Build fact fluency using number families',
                'Write complete fact family equations'
            ]}
            parentTeacherTips={[
                'A fact family uses the same 3 numbers for all equations',
                'The largest number (product) is always at the top of the triangle',
                'Multiplication: bottom numbers multiply to make the top number',
                'Division: top number divided by a bottom number equals the other bottom number',
                'Example: 3, 4, 12 → 3×4=12, 4×3=12, 12÷3=4, 12÷4=3'
            ]}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg print:border print:bg-white break-inside-avoid">
                <div className="font-semibold text-purple-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-2xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', 'Example - Fact Family for 3, 4, 12')}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    {/* Visual Triangle */}
                    <div className="relative w-32 h-28 flex-shrink-0">
                        {/* Triangle SVG */}
                        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm">
                            <polygon points="50,5 10,75 90,75" fill="white" stroke="#a78bfa" strokeWidth="3" strokeLinejoin="round" />
                            {/* Product (Top) */}
                            <circle cx="50" cy="20" r="12" fill="#8b5cf6" />
                            <text x="50" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">12</text>
                            {/* Factors (Bottom) */}
                            <circle cx="20" cy="70" r="10" fill="#c4b5fd" />
                            <text x="20" y="74" textAnchor="middle" fill="#4c1d95" fontSize="10" fontWeight="bold">3</text>
                            <circle cx="80" cy="70" r="10" fill="#c4b5fd" />
                            <text x="80" y="74" textAnchor="middle" fill="#4c1d95" fontSize="10" fontWeight="bold">4</text>
                        </svg>
                    </div>

                    {/* Equations */}
                    <div className="flex-grow grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-700">3 × 4 = 12</span>
                            <span className="text-xs text-purple-500">(Factor × Factor = Product)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-700">12 ÷ 3 = 4</span>
                            <span className="text-xs text-purple-500">(Product ÷ Factor = Factor)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-700">4 × 3 = 12</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-700">12 ÷ 4 = 3</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-purple-700 pl-2 border-l-2 border-purple-300">
                    {getTrans('example.tip', 'Tip: The biggest number is always the product!')}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                {problems.map((p, i) => (
                    <div key={i} className="break-inside-avoid p-4 border border-slate-300 rounded-lg bg-white shadow-sm print:shadow-none flex flex-col items-center">
                        {/* Problem Triangle */}
                        <div className="relative w-24 h-20 mb-4">
                            <svg viewBox="0 0 100 80" className="w-full h-full">
                                <polygon points="50,5 10,75 90,75" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 4" />
                                {/* Top Circle */}
                                <circle cx="50" cy="20" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                                <text x="50" y="24" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">{p.p}</text>
                                {/* Bottom Circles */}
                                <circle cx="20" cy="70" r="9" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                                <text x="20" y="74" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="bold">{p.a}</text>
                                <circle cx="80" cy="70" r="9" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                                <text x="80" y="74" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="bold">{p.b}</text>
                            </svg>
                        </div>

                        {/* Answer Lines */}
                        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3">
                            {/* Multiplication Lines */}
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">×</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">=</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">÷</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">=</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">×</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">=</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">÷</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                                <span className="text-slate-400">=</span>
                                <div className="w-6 h-6 border-b border-slate-400"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                        {String.fromCodePoint(0x2705)} Answer Key
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="p-2 border border-emerald-200 rounded bg-white">
                                <div className="font-bold text-emerald-800 mb-1 border-b border-emerald-100">Ex #{i + 1} ({p.a},{p.b},{p.p})</div>
                                <div className="text-emerald-700">{p.a}×{p.b}={p.p}</div>
                                <div className="text-emerald-700">{p.b}×{p.a}={p.p}</div>
                                <div className="text-emerald-700">{p.p}÷{p.a}={p.b}</div>
                                <div className="text-emerald-700">{p.p}÷{p.b}={p.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationVertical({ seed, variant, showAnswersForDoc, docId, digitsTop, digitsBottom, problemCount = 12 }: SpecificWorksheetProps & { docId: string, digitsTop: number, digitsBottom: number, problemCount?: number }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    // Generate ranges based on digits
    const minTop = Math.pow(10, digitsTop - 1);
    const maxTop = Math.pow(10, digitsTop) - 1;
    const minBottom = Math.pow(10, digitsBottom - 1);
    const maxBottom = Math.pow(10, digitsBottom) - 1;

    const problems = Array.from({ length: problemCount }).map(() => {
        let a = nextInt(minTop, maxTop);
        let b = nextInt(minBottom, maxBottom);

        // Ensure standard algorithm is usually required (avoid trivial 10s or 1s if possible for higher grades)
        if (digitsBottom === 1 && b < 2) b = nextInt(2, 9);

        return { a, b, product: a * b };
    });

    const is2x2 = digitsTop === 2 && digitsBottom === 2;

    const learningObjectives = (() => {
        const obj = t(`worksheets.${docId}.learningObjectives`)
        if (Array.isArray(obj) && obj.length > 0) return obj;

        if (is2x2) {
            return [
                'Multiply 2-digit numbers by 2-digit numbers',
                'Use standard algorithm with regrouping',
                'Align partial products correctly'
            ];
        }
        return [
            `Multiply ${digitsTop}-digit numbers by ${digitsBottom}-digit numbers`,
            'Use regrouping (carrying) when needed',
            'Align numbers by place value'
        ];
    })();

    const tips = (() => {
        const tipList = t(`worksheets.${docId}.parentTeacherTips`)
        if (Array.isArray(tipList) && tipList.length > 0) return tipList;

        if (is2x2) {
            return [
                'Remind students to put a zero placeholder (turtle egg) on the second line',
                'Keep columns straight - graph paper helps!',
                'Don\'t forget to add the partial products at the end'
            ];
        }
        return [
            'Start multiplying from the ones place (right side)',
            'Carry any tens to the next column',
            'Encourage neat handwriting to keep columns aligned'
        ];
    })();

    // Helper to render a vertical problem
    const renderVerticalProblem = (a: number, b: number, showSolution = false) => {
        const aStr = a.toString();
        const bStr = b.toString();
        const product = a * b;

        // Calculations for solution display
        const ones = a % 10;
        const tens = Math.floor(a / 10);

        // For 2x1
        const bOnes = b % 10;
        const line1 = a * bOnes;

        // For 2x2
        const bTens = Math.floor(b / 10);
        const line2 = a * bTens; // Actual value (e.g. 240) but we might display 24 with offset

        return (
            <div className="inline-block font-mono text-xl leading-none text-right mx-auto">
                <div className="tracking-widest">{a}</div>
                <div className="tracking-widest border-b-2 border-slate-800 mb-1 pb-1 relative">
                    <span className="absolute left-[-1ch] bottom-1">{String.fromCharCode(0x00D7)}</span>
                    {b}
                </div>
                {showSolution && (
                    <div className="leading-snug text-emerald-700 font-bold">
                        {digitsBottom === 2 ? (
                            <>
                                <div>{line1}</div>
                                <div>{line2}0</div>
                                <div className="border-t border-slate-400 pt-1">{product}</div>
                            </>
                        ) : (
                            <div>{product}</div>
                        )}
                    </div>
                )}
                {!showSolution && (
                    <div className="h-16 w-full"></div>
                )}
            </div>
        );
    };

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', `Multiplication (${digitsTop}-digit x ${digitsBottom}-digit)`)}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', `Practice vertical multiplication standard algorithm.`)}
            problemCount={problems.length}
            learningObjectives={learningObjectives}
            parentTeacherTips={tips}
        >
            <PremiumWorksheetBanner
                title={getTrans('title', 'Multiplication Wizard')}
                subtitle={getTrans('subtitle', `${digitsTop}-Digit × ${digitsBottom}-Digit Challenges`)}
                icons={{
                    bg1: String.fromCodePoint(0x2692),
                    bg2: String.fromCodePoint(0x1F522),
                    float1: String.fromCodePoint(0x2728),
                    float2: String.fromCodePoint(0x1F3AF)
                }}
                colors={{
                    bg: is2x2 ? 'bg-gradient-to-br from-orange-50 to-red-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    border: is2x2 ? 'border-orange-200' : 'border-blue-200',
                    pillBg: 'bg-white/80',
                    pillBorder: is2x2 ? 'border-orange-300' : 'border-blue-300',
                    pillText: is2x2 ? 'text-orange-800' : 'text-blue-800',
                    accent: is2x2 ? 'text-orange-300' : 'text-blue-300'
                }}
            />

            {/* Worked Example */}
            <div className={`my-8 p-6 bg-${is2x2 ? 'orange' : 'blue'}-50/50 border-2 border-${is2x2 ? 'orange' : 'blue'}-100 rounded-2xl relative overflow-hidden group shadow-sm`}>
                <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 text-${is2x2 ? 'orange' : 'blue'}-500 group-hover:scale-110 transition-transform`}>{is2x2 ? '🌟' : '💡'}</div>
                <div className={`font-black text-${is2x2 ? 'orange' : 'blue'}-900 mb-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                    <span className={`w-8 h-8 rounded-lg bg-${is2x2 ? 'orange' : 'blue'}-500 text-white flex items-center justify-center text-sm`}>{is2x2 ? '🌟' : '💡'}</span>
                    {getTrans('example.title', "Strategy Spotlight")}
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="space-y-4 text-sm flex-1">
                        <div className="font-bold text-slate-800 text-lg mb-2">{getTrans('example.header', 'Standard Algorithm Mastery:')}</div>
                        {is2x2 ? (
                            <div className="space-y-3 text-slate-700">
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                                    <p>Multiply the top number by the <strong>ones</strong> digit of the bottom number.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                                    <p><strong>Crucial Step:</strong> Put a <span className="text-orange-600 font-bold underline">zero (0)</span> placeholder (turtle egg) on the second line.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                                    <p>Multiply the top number by the <strong>tens</strong> digit of the bottom number.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                                    <p>Finally, <strong>add</strong> both partial products to find the final result.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-slate-700">
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                                    <p>Multiply the bottom number by the <strong>ones</strong> digit of the top number.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                                    <p>Write the ones digit; carry over any tens digit to the next column.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                                    <p>Multiply by the <strong>tens</strong> place and add your carried number.</p>
                                </div>
                            </div>
                        )}
                        <div className={`mt-4 p-3 bg-${is2x2 ? 'orange' : 'blue'}-100/50 rounded-xl border border-${is2x2 ? 'orange' : 'blue'}-200 text-xs italic text-${is2x2 ? 'orange' : 'blue'}-700 font-medium`}>
                            {String.fromCodePoint(0x1F4A1)} {getTrans('example.tip', 'Pro Tip: Keeping your columns perfectly aligned is the secret to accuracy!')}
                        </div>
                    </div>
                    {/* Visual Example */}
                    <div className="bg-white p-6 border-2 border-slate-200 rounded-2xl shadow-xl text-center min-w-[160px] transform hover:scale-105 transition-transform">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Live Demo</div>
                        {is2x2 ? renderVerticalProblem(24, 12, true) : renderVerticalProblem(24, 3, true)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((p, i) => (
                    <div key={i} className={`relative border-2 border-slate-100 rounded-2xl p-6 bg-white hover:border-${is2x2 ? 'orange' : 'blue'}-200 transition-all group break-inside-avoid shadow-sm flex flex-col items-center justify-center min-h-[180px]`}>
                        <div className="absolute top-2 left-3 text-[10px] font-black text-slate-300">{i + 1}</div>
                        {renderVerticalProblem(p.a, p.b, false)}
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Create your own problem and solve it.</div>
                    <div>2. Explain how you solve it to a friend.</div>
                    <div>3. Check your answers with addition.</div>
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I lined up my numbers correctly</div>
                    <div>{String.fromCharCode(0x2610)} I regrouped (carried) correctly</div>
                    <div>{String.fromCharCode(0x2610)} I checked my addition</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{getTrans('myScore', 'My score:')}</strong> ___ / {problems.length}
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                        {problems.map((p, i) => (
                            <div key={i} className="text-emerald-900 border-b border-emerald-200 pb-1">
                                <span className="font-bold mr-1">{i + 1}.</span>
                                {p.a} x {p.b} = <strong>{p.product}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationAreaModel({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-area-model'
    const { getTrans, t: worksheetT } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 4 }).map(() => {
        const a = nextInt(12, 35);
        const b = nextInt(12, 35);
        return { a, b };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Area Model Multiplication')}
            emoji={String.fromCodePoint(0x1F4CF)}
            description={getTrans('description', 'Break numbers into tens and ones. Map out the area to find the total.')}
            problemCount={problems.length}
            learningObjectives={worksheetT('learningObjectives', [
                'Apply area models to multi-digit multiplication',
                'Decompose numbers by place value',
                'Synthesize partial products for a final result'
            ])}
            parentTeacherTips={worksheetT('parentTeacherTips', [
                'Visualize the area as a rectangle divided into four plots',
                'The large plot is Tens x Tens (e.g., 20 x 10)',
                'Adding the four "plots" gives the total territory'
            ])}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-gradient-x mb-4" />

            <PremiumWorksheetBanner
                title="Plot Architect"
                subtitle="Project: Building Multiplication Areas"
                icons={{
                    bg1: "📐",
                    bg2: "🏗️",
                    float1: "📏",
                    float2: "🖋️"
                }}
                colors={{
                    bg: "bg-blue-900",
                    border: "border-blue-700",
                    pillBg: "bg-white/10 backdrop-blur-sm",
                    pillBorder: "border-blue-400",
                    pillText: "text-white",
                    accent: "text-blue-400"
                }}
            />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">{String.fromCodePoint(0x1F4A1)}</span>
                    <span>{getTrans('example.title', 'Example - Plot Architect:')}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong></div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'Split numbers: 24 × 12 → (20+4) × (10+2)')}</div>
                        <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'Multiply parts: 20×10=200, 20×2=40, 4×10=40, 4×2=8')}</div>
                        <div><strong>{getTrans('example.step3', 'Step 3:')}</strong> {getTrans('example.step3Text', 'Add them up: 200 + 40 + 40 + 8 = 288')}</div>
                        <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '288')}</div>
                        <div className="text-xs text-blue-700 mt-1">{getTrans('example.tip', 'Tip: Each box in the grid represents part of the total area!')}</div>
                    </div>
                </div>
            </div>

            {/* Premium Instruction Card */}
            <div className="mb-6 p-4 bg-slate-50 border-2 border-blue-200 rounded-xl print:border print:bg-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl text-blue-100/50 select-none">🏗️</div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white font-bold text-sm">Task</div>
                    <div className="font-bold text-slate-900 text-base">Decompose & Construct</div>
                </div>
                <div className="pl-11 space-y-1 text-sm text-slate-700">
                    <div>1. Split each number into <strong>Tens</strong> and <strong>Ones</strong>.</div>
                    <div>2. Fill in the four area "plots" by multiplying.</div>
                    <div>3. Add all four products to reach the final total.</div>
                </div>
            </div>

            <div className="space-y-10 break-inside-avoid">
                {problems.map(({ a, b }, i) => {
                    const aTens = Math.floor(a / 10) * 10;
                    const aOnes = a % 10;
                    const bTens = Math.floor(b / 10) * 10;
                    const bOnes = b % 10;

                    return (
                        <div key={i} className="relative border-2 border-blue-100 rounded-3xl p-8 bg-white shadow-sm break-inside-avoid overflow-hidden">
                            {/* Blueprint Grid Background Effect */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <div className="flex justify-between items-start mb-8">
                                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm">
                                    Site {i + 1}
                                </div>
                                <div className="text-2xl font-mono font-bold text-blue-900">
                                    {a} × {b} = ?
                                </div>
                            </div>

                            <div className="relative max-w-md mx-auto aspect-square mb-6">
                                {/* Labels */}
                                <div className="absolute -top-6 left-[25%] right-0 flex justify-around text-blue-800 font-bold font-mono">
                                    <span>{aTens}</span>
                                    <span>{aOnes}</span>
                                </div>
                                <div className="absolute top-0 -left-8 bottom-0 flex flex-col justify-around text-blue-800 font-bold font-mono py-[10%]">
                                    <span>{bTens}</span>
                                    <span>{bOnes}</span>
                                </div>

                                {/* Area Grid */}
                                <div className="w-full h-full border-4 border-blue-800 grid grid-cols-[2fr_1fr] grid-rows-[2fr_1fr] rounded-lg overflow-hidden shadow-lg">
                                    <div className="border-b-2 border-r-2 border-blue-800 flex items-center justify-center bg-blue-50/30">
                                        <div className="text-center group">
                                            <div className="text-xs text-blue-400 font-mono mb-1">{aTens} × {bTens}</div>
                                            <div className="w-20 h-10 border-b-2 border-blue-300 mx-auto" />
                                        </div>
                                    </div>
                                    <div className="border-b-2 border-blue-800 flex items-center justify-center bg-blue-50/50">
                                        <div className="text-center">
                                            <div className="text-xs text-blue-400 font-mono mb-1">{aOnes} × {bTens}</div>
                                            <div className="w-16 h-8 border-b-2 border-blue-300 mx-auto" />
                                        </div>
                                    </div>
                                    <div className="border-r-2 border-blue-800 flex items-center justify-center bg-blue-50/50">
                                        <div className="text-center">
                                            <div className="text-xs text-blue-400 font-mono mb-1">{aTens} × {bOnes}</div>
                                            <div className="w-16 h-8 border-b-2 border-blue-300 mx-auto" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center bg-blue-100/30">
                                        <div className="text-center">
                                            <div className="text-xs text-blue-400 font-mono mb-1">{aOnes} × {bOnes}</div>
                                            <div className="w-12 h-6 border-b-2 border-blue-300 mx-auto" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-blue-100 flex flex-col items-center gap-3">
                                <div className="text-sm font-bold text-blue-900/60 uppercase tracking-wider">Final Calculation</div>
                                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-lg">
                                    <span className="w-16 h-8 border-b-2 border-blue-400 bg-white rounded-t" />
                                    <span>+</span>
                                    <span className="w-16 h-8 border-b-2 border-blue-400 bg-white rounded-t" />
                                    <span>+</span>
                                    <span className="w-16 h-8 border-b-2 border-blue-400 bg-white rounded-t" />
                                    <span>+</span>
                                    <span className="w-16 h-8 border-b-2 border-blue-400 bg-white rounded-t" />
                                    <span className="font-bold">=</span>
                                    <span className="w-24 h-10 border-b-4 border-blue-600 bg-blue-50 text-blue-900 rounded-t flex items-center justify-center font-bold" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-10 p-8 border-2 border-cyan-300 bg-cyan-50 rounded-3xl print:border print:bg-white print:page-break-before-always relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 text-8xl text-cyan-100 rotate-12 select-none">🏗️</div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white italic font-serif">A</div>
                        <h3 className="text-xl font-bold text-cyan-900 uppercase tracking-widest">Architect Solution Key</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {problems.map(({ a, b }, i) => {
                            const aTens = Math.floor(a / 10) * 10;
                            const aOnes = a % 10;
                            const bTens = Math.floor(b / 10) * 10;
                            const bOnes = b % 10;
                            const p1 = aTens * bTens;
                            const p2 = aOnes * bTens;
                            const p3 = aTens * bOnes;
                            const p4 = aOnes * bOnes;
                            return (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-sm">
                                    <div className="font-bold text-cyan-800 mb-3 border-b border-cyan-50 pb-2">Site {i + 1}: {a} × {b}</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm font-mono text-cyan-700">
                                        <div>{aTens}×{bTens} = {p1}</div>
                                        <div>{aOnes}×{bTens} = {p2}</div>
                                        <div>{aTens}×{bOnes} = {p3}</div>
                                        <div>{aOnes}×{bOnes} = {p4}</div>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-dashed border-cyan-100 text-base font-bold text-blue-900">
                                        Total: {a * b}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationFactFluency({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mult-fact-fluency'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const facts: Array<[number, number]> = Array.from({ length: 20 }).map(() => {
        const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Multiplication Fact Fluency')}
            emoji={String.fromCodePoint(0x26A1)}
            description={t(`worksheets.${docId}.description`, 'Solve as many facts as you can quickly. Practice all facts 1-12.')}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                return Array.isArray(obj) && obj.length > 0 ? obj : [
                    'Build speed and accuracy with multiplication facts 1-12',
                    'Practice quick recall of multiplication facts',
                    'Achieve automaticity (knowing facts instantly)'
                ]
            })()}
            parentTeacherTips={(() => {
                const tipList = t(`worksheets.${docId}.parentTeacherTips`)
                return Array.isArray(tipList) && tipList.length > 0 ? tipList : [
                    'Fluency means speed AND accuracy - encourage both',
                    'Time students to track improvement',
                    'Use strategies: patterns, known facts, breaking down',
                    'Extension: Try to beat your time on the next attempt!'
                ]
            })()}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-gradient-x mb-4" />

            {/* Premium Header Banner */}
            <PremiumWorksheetBanner
                title="Speed Racer"
                subtitle="Mission: Lightning Fast Recall"
                icons={{
                    bg1: "🏎️",
                    bg2: "🏁",
                    float1: "⚡",
                    float2: "⏱️"
                }}
                colors={{
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-emerald-300",
                    pillText: "text-emerald-900",
                    accent: "text-emerald-200"
                }}
            />

            {/* Premium Instruction Card */}
            <div className="mb-6 p-4 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl print:border print:bg-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl text-emerald-100/50 select-none">⚡</div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">Task</div>
                    <div className="font-bold text-emerald-900 text-base">Quick Recall</div>
                </div>
                <div className="pl-11 space-y-1 text-sm text-emerald-800">
                    <div>Solve each problem as quickly as you can.</div>
                    <div>Try to write the answer without counting on your fingers!</div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 break-inside-avoid">
                {facts.map(([a, b], i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-emerald-300 transition-colors text-center break-inside-avoid relative overflow-hidden group">
                        <div className="absolute -left-1 -top-1 w-6 h-6 bg-slate-50 group-hover:bg-emerald-50 rounded-br-lg flex items-center justify-center text-[10px] text-slate-300 group-hover:text-emerald-300 font-bold transition-colors">
                            {i + 1}
                        </div>
                        <div className="font-mono text-xl text-slate-800 py-2">
                            {a} × {b} =
                            <span className="inline-block w-16 h-8 border-b-2 border-slate-400 bg-slate-100/50 ml-2 rounded-t align-middle" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Self-Assessment & Timer section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50 print:bg-white">
                    <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span>⏱️</span> Timer Stats
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                            <span>Time Taken:</span>
                            <span className="font-mono">____ min ____ sec</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Target:</span>
                            <span className="text-emerald-600 font-bold underline decoration-emerald-200">2:00 Minutes</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50 print:bg-white">
                    <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span>✅</span> Best Efforts
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-slate-400 rounded" />
                            <span>I correctly solved ____ / {facts.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-slate-400 rounded" />
                            <span>I stayed focused the whole time!</span>
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-10 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-2xl print:bg-white print:border print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-4 text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">✓</div>
                        Speed Racer Answer Key
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="flex gap-2 items-center border-b border-emerald-200/50 pb-1">
                                <span className="text-emerald-600 font-bold w-6">{i + 1}.</span>
                                <span className="text-emerald-900">{a} × {b} = <span className="font-bold">{a * b}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationMixedReview({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mult-mixed-review'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const facts: Array<[number, number]> = Array.from({ length: 16 }).map(() => {
        const a = nextInt(1, 12); const b = nextInt(1, 12); return [a, b];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Mixed Multiplication Review')}
            emoji={String.fromCodePoint(0x1F31F)}
            description={t(`worksheets.${docId}.description`, 'Mixed practice with all multiplication facts. Review everything you\'ve learned.')}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                return Array.isArray(obj) && obj.length > 0 ? obj : [
                    'Review all multiplication facts 1-12 in mixed order',
                    'Test mastery across all times tables',
                    'Build confidence with comprehensive practice'
                ]
            })()}
            parentTeacherTips={(() => {
                const tipList = t(`worksheets.${docId}.parentTeacherTips`)
                return Array.isArray(tipList) && tipList.length > 0 ? tipList : [
                    'Mixed review tests true mastery - students can\'t rely on patterns',
                    'Encourage students to use all strategies they know',
                    'This is great for assessment - see which facts need more practice',
                    'Extension: Time yourself and track improvement'
                ]
            })()}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-gradient-x mb-4" />

            {/* Premium Header Banner */}
            <PremiumWorksheetBanner
                title="Knowledge Quest"
                subtitle="Mission: Master All Dimensions"
                icons={{
                    bg1: "🗺️",
                    bg2: "💎",
                    float1: "📜",
                    float2: "🛡️"
                }}
                colors={{
                    bg: "bg-purple-50",
                    border: "border-purple-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-purple-300",
                    pillText: "text-purple-900",
                    accent: "text-purple-200"
                }}
            />

            {/* Premium Instruction Card */}
            <div className="mb-6 p-4 bg-purple-50/50 border-2 border-purple-200 rounded-xl print:border print:bg-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl text-purple-100/50 select-none">🔍</div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">Task</div>
                    <div className="font-bold text-purple-900 text-base">The Ultimate Test</div>
                </div>
                <div className="pl-11 space-y-1 text-sm text-purple-800">
                    <div>You've traveled through the tables. Now show what you know!</div>
                    <div>Solve these mixed problems to complete your quest.</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 break-inside-avoid">
                {facts.map(([a, b], i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-purple-300 transition-colors flex items-center justify-between break-inside-avoid relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 opacity-50" />
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold border border-slate-100 italic">
                                {i + 1}
                            </div>
                            <div className="font-mono text-2xl text-slate-800 tracking-wider">
                                {a} × {b} =
                            </div>
                        </div>
                        <div className="w-32 h-14 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/30" />
                    </div>
                ))}
            </div>

            {/* Achievement Section */}
            <div className="mt-10 p-6 border-2 border-purple-200 bg-purple-50/30 rounded-2xl print:bg-white relative overflow-hidden">
                <div className="absolute top-4 right-4 text-4xl opacity-20">🏆</div>
                <div className="font-bold text-purple-900 mb-4">Quest Summary</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-sm font-semibold text-purple-800 mb-2 uppercase tracking-wider">Mastery Check</div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 border-2 border-purple-300 rounded" />
                                <span>I completed the entire quest!</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-5 h-5 border-2 border-purple-300 rounded" />
                                <span>Total Crystals (Score): ____ / {facts.length}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-purple-800 mb-2 uppercase tracking-wider">Target Skills</div>
                        <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs text-slate-700 italic">
                            Identifying "Sticky Facts" — circle the problems that took more time. These are your next target for practice!
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-10 p-6 border-2 border-purple-300 bg-purple-50 rounded-2xl print:bg-white print:border print:page-break-before-always">
                    <div className="font-bold text-purple-900 mb-4 text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">✨</div>
                        Quest Answer Key
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="flex gap-2 items-center bg-white/50 p-2 rounded-lg border border-purple-100">
                                <span className="text-purple-600 font-bold">{i + 1}.</span>
                                <span className="text-purple-900">{a} × {b} = <span className="font-bold font-mono">{a * b}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationStrategies({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mult-strategies'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    // Fixed set of strategy problems for consistency and pedagogical value
    const problems = [
        { problem: '4 × 5', strategy: 'skip-count', strategyText: 'Skip count by 5s:', blanks: 4, answer: 20, hint: '5, 10, 15, ...' },
        { problem: '3 × 6', strategy: 'array', strategyText: 'Visualize an Array:', blanks: 2, answer: 18, hint: 'Rows × Columns' },
        { problem: '7 × 2', strategy: 'repeated', strategyText: 'Repeated Addition:', blanks: 7, answer: 14, hint: '2 + 2 + ...' },
        { problem: '5 × 8', strategy: 'doubles', strategyText: 'Use Known Facts (Doubles):', blanks: 2, answer: 40, hint: '5 × 4 = 20, so...' },
        { problem: '6 × 9', strategy: 'break-apart', strategyText: 'Break-Apart Strategy:', blanks: 2, answer: 54, hint: '6 × 10 = 60, then...' },
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Multiplication Strategies')}
            emoji={String.fromCodePoint(0x1F9E0)}
            description={t(`worksheets.${docId}.description`, 'Use different tools to solve problems. Choose the best strategy for each!')}
            problemCount={problems.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                return Array.isArray(obj) && obj.length > 0 ? obj : [
                    'Use multiple strategies to solve multiplication problems',
                    'Understand skip counting, arrays, repeated addition, and doubles',
                    'Choose the best tool for each problem'
                ]
            })()}
            parentTeacherTips={(() => {
                const tipList = t(`worksheets.${docId}.parentTeacherTips`)
                return Array.isArray(tipList) && tipList.length > 0 ? tipList : [
                    'Different strategies work for different learners',
                    'Skip counting: Great for 2s, 5s, and 10s',
                    'Arrays: Excellent for visual learners',
                    'Break-apart: Preparatory for distributive property',
                    'Extension: Design your own strategy for 7 × 8!'
                ]
            })()}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 animate-gradient-x mb-4" />

            {/* Premium Header Banner */}
            <PremiumWorksheetBanner
                title="Strategy Master"
                subtitle="Mission: Use Your Toolkit"
                icons={{
                    bg1: "🛠️",
                    bg2: "🧠",
                    float1: "📐",
                    float2: "🔭"
                }}
                colors={{
                    bg: "bg-teal-50",
                    border: "border-teal-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-teal-300",
                    pillText: "text-teal-900",
                    accent: "text-teal-200"
                }}
            />

            {/* Premium Instruction Card */}
            <div className="mb-6 p-4 bg-teal-50/50 border-2 border-teal-200 rounded-xl print:border print:bg-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl text-teal-100/50 select-none">💡</div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">Task</div>
                    <div className="font-bold text-teal-900 text-base">Select Your Tool</div>
                </div>
                <div className="pl-11 space-y-1 text-sm text-teal-800">
                    <div>Solve each problem using the specific strategy shown.</div>
                    <div>Show your work in the space provided.</div>
                </div>
            </div>

            <div className="space-y-6 break-inside-avoid">
                {problems.map((item, idx) => (
                    <div key={idx} className="border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-teal-300 transition-colors break-inside-avoid">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-teal-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                                        Problem {idx + 1}
                                    </div>
                                    <div className="font-mono text-2xl font-bold text-slate-800">
                                        {item.problem} = ?
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
                                        <span className="text-xl">⚙️</span> {item.strategyText}
                                    </div>

                                    {item.strategy === 'skip-count' && (
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-14 h-10 border-b-2 border-teal-300 flex items-end justify-center pb-1 text-teal-900 font-mono">
                                                        {i === 0 ? "5" : ""}
                                                    </div>
                                                    {i < 3 && <span className="text-slate-300">,</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {item.strategy === 'array' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-20 border-2 border-dashed border-teal-200 rounded-lg flex items-center justify-center text-xs text-teal-400 p-2 text-center italic">
                                                Draw {item.hint} here...
                                            </div>
                                            <div className="text-xl text-teal-300">➜</div>
                                            <div className="font-mono text-slate-700">
                                                ___ rows × ___ cols
                                            </div>
                                        </div>
                                    )}

                                    {item.strategy === 'repeated' && (
                                        <div className="flex items-center gap-2 flex-wrap font-mono">
                                            {Array.from({ length: 7 }).map((_, i) => (
                                                <React.Fragment key={i}>
                                                    <span className="w-8 h-8 border-b-2 border-teal-200 flex items-end justify-center pb-1">2</span>
                                                    {i < 6 && <span className="text-teal-400 font-bold">+</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}

                                    {(item.strategy === 'doubles' || item.strategy === 'break-apart') && (
                                        <div className="space-y-3">
                                            <div className="text-xs text-teal-600 italic mb-2">Hint: {item.hint}</div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-10 border-b-2 border-teal-100 italic text-slate-400 text-sm flex items-end ml-4 pb-1">
                                                    Write your steps here...
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-teal-50/50 border-2 border-teal-100 rounded-2xl p-6 min-w-[180px]">
                                <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2 text-center">Final Result</div>
                                <div className="w-24 h-16 border-4 border-teal-300 rounded-2xl bg-white flex items-center justify-center text-3xl font-mono text-teal-900 shadow-inner">
                                    ?
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategy Bonus */}
            <div className="mt-8 p-6 border-2 border-dashed border-slate-300 rounded-2xl print:bg-white text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="font-bold text-slate-800">Strategy Challenge</div>
                <div className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Choose your favorite strategy and use it to solve <strong>12 × 5</strong>.
                    Can you explain your thinking to a partner?
                </div>
                <div className="mt-4 h-12 w-48 border-b-2 border-slate-400 mx-auto" />
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-10 p-6 border-2 border-teal-300 bg-teal-50 rounded-2xl print:bg-white print:border print:page-break-before-always">
                    <div className="font-bold text-teal-900 mb-4 text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">⚙️</div>
                        Strategy Master Answer Key
                    </div>
                    <div className="space-y-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between border-b border-teal-200/50 pb-2 last:border-b-0">
                                <div className="flex gap-4 items-center">
                                    <span className="text-teal-600 font-bold w-6">{i + 1}.</span>
                                    <span className="text-teal-900 font-medium">Problem: {p.problem}</span>
                                    <span className="text-teal-500 text-sm italic">({p.strategy})</span>
                                </div>
                                <div className="font-bold text-teal-900 bg-white px-3 py-1 rounded-lg border border-teal-100">
                                    Answer: {p.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationBy10And100({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-by-10-100'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 12 }, () => {
        const isHundred = rng() > 0.5;
        const base = nextInt(1, 12);
        const multiplier = isHundred ? 100 : 10;
        return { base, multiplier, product: base * multiplier };
    });

    const learnObjs = t(`worksheets.${docId}.learningObjectives`) as unknown as string[];
    const tips = t(`worksheets.${docId}.parentTeacherTips`) as unknown as string[];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Zero Hero: Power Up!')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', 'Use the Zero Orbs to power up your numbers! Multiplying by 10 or 100 is easier than it looks.')}
            problemCount={problems.length}
            learningObjectives={Array.isArray(learnObjs) ? learnObjs : [
                'Multiply one-digit and two-digit numbers by multiples of 10',
                'Understand place value shift',
                'Recognize the pattern of adding zeros'
            ]}
            parentTeacherTips={Array.isArray(tips) ? tips : [
                'When multiplying by 10, just attach one zero!',
                'When multiplying by 100, attach two zeros!',
                '5 groups of 10 is 5 tens (50).',
                'Extension: Try multiplying by 1000!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Zero Hero"
                subtitle="Power Up the Grid!"
                icons={{
                    bg1: "⚡",
                    bg2: "🌀",
                    float1: "🔋",
                    float2: "🔋"
                }}
                colors={{
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-emerald-300",
                    pillText: "text-emerald-900",
                    accent: "text-emerald-200"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-4 text-3xl font-black text-slate-700">
                            <span className="w-8 text-slate-300 font-normal text-sm">{i + 1}.</span>
                            <div className="w-12 text-center">{p.base}</div>
                            <div className="text-slate-300 text-xl font-normal">×</div>
                            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-2xl">{p.multiplier}</div>
                            <div className="text-slate-200 text-2xl font-normal">=</div>
                        </div>

                        <div className="w-28 h-12 border-2 border-emerald-100 bg-slate-50/50 rounded-xl flex items-center justify-center">
                            {/* Empty for solving */}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-slate-900 rounded-2xl border-2 border-emerald-500/30">
                    <div className="text-emerald-400 font-mono text-xs mb-4 uppercase tracking-widest opacity-50">Answer Key // System Over-ride</div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="text-emerald-300 font-mono">
                                <span className="text-emerald-800 mr-2">{i + 1}.</span>
                                {p.product}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationProperties({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-properties'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 6 }, () => {
        const a = nextInt(2, 9);
        const b = nextInt(2, 9);
        return { a, b, answer: a * b };
    });

    const learnObjs = t(`worksheets.${docId}.learningObjectives`) as unknown as string[];
    const tips = t(`worksheets.${docId}.parentTeacherTips`) as unknown as string[];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Robot Logic: Properties')}
            emoji={String.fromCodePoint(0x1F9E0)}
            description={getTrans('description', 'Robots know that order doesn\'t matter! Show the Commutative Property.')}
            problemCount={problems.length}
            learningObjectives={Array.isArray(learnObjs) ? learnObjs : [
                'Understand the Commutative Property of Multiplication (a x b = b x a)',
                'Verify that changing order does not change the product',
                'Write equivalent equations'
            ]}
            parentTeacherTips={Array.isArray(tips) ? tips : [
                'Turn the array sideways - it has the same number of items!',
                '3 groups of 5 is the same total as 5 groups of 3.',
                'Commutative comes from "commute" meaning to move around.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Robot Logic"
                subtitle="Property Protocols"
                icons={{
                    bg1: "🤖",
                    bg2: "⚙️",
                    float1: "🔧",
                    float2: "🔋"
                }}
                colors={{
                    bg: "bg-slate-50",
                    border: "border-slate-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-slate-300",
                    pillText: "text-slate-900",
                    accent: "text-slate-200"
                }}
            />

            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-8 shadow-sm">
                        <div className="flex items-center gap-4 text-2xl font-black text-slate-700">
                            <span className="w-8 text-slate-300 font-normal text-sm">{i + 1}.</span>
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-slate-200">{p.a}</div>
                            <span className="text-slate-300">×</span>
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-slate-200">{p.b}</div>
                        </div>

                        <div className="text-3xl font-black text-slate-200">=</div>

                        <div className="flex items-center gap-4 text-2xl font-black text-slate-700">
                            <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-300 font-bold">?</div>
                            <span className="text-slate-300">×</span>
                            <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-300 font-bold">?</div>
                        </div>

                        <div className="md:ml-auto flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Product:</span>
                            <div className="w-16 h-10 border-b-2 border-slate-300" />
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-slate-100 rounded-xl text-slate-600 text-sm text-center font-mono">
                    Protocol: [a × b = b × a] // Swapped values: {problems.map(p => `${p.b}×${p.a}`).join(', ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationDecimals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-decimals'
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 12 }, () => {
        const n1 = (nextInt(10, 99) / 10).toFixed(1);
        const n2 = (nextInt(10, 99) / 10).toFixed(1);
        return { n1, n2 };
    });

    const learnObjs = t(`worksheets.${docId}.learningObjectives`) as unknown as string[];
    const tips = t(`worksheets.${docId}.parentTeacherTips`) as unknown as string[];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Multiplying Decimals')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', 'Multiply decimals to hundredths. Remember to count the places!')}
            problemCount={problems.length}
            learningObjectives={Array.isArray(learnObjs) ? learnObjs : [
                'Multiply decimals to hundredths',
                'Use standard algorithm for decimal multiplication',
                'Understand decimal point placement'
            ]}
            parentTeacherTips={Array.isArray(tips) ? tips : [
                'Multiply as if they were whole numbers.',
                'Count total decimal places in the factors.',
                'Place the decimal point in the product so it has the same number of decimal places.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Decimal Dash"
                subtitle="The Point of Precision"
                icons={{
                    bg1: "📍",
                    bg2: "🎯",
                    float1: "✨",
                    float2: "💎"
                }}
                colors={{
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-blue-300",
                    pillText: "text-blue-900",
                    accent: "text-blue-200"
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="w-full text-right font-mono text-2xl pr-4">
                            <div className="mb-1">{p.n1}</div>
                            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1">
                                <span className="text-slate-400 text-sm">×</span>
                                <span>{p.n2}</span>
                            </div>
                            <div className="h-16 w-full bg-slate-50/50 mt-2 rounded-lg" />
                        </div>
                        <div className="mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-tighter self-start">Problem {i + 1}</div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-blue-900 rounded-2xl border-2 border-blue-400/30">
                    <div className="text-blue-300 font-mono text-xs mb-4 uppercase tracking-widest opacity-70 italic">Verified Results // Precise Calculations</div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="text-blue-100 font-mono text-sm">
                                <span className="text-blue-400/50 mr-2">{i + 1}.</span>
                                {(parseFloat(p.n1) * parseFloat(p.n2)).toFixed(2)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationBlankTable({ seed, variant, showAnswersForDoc, docId, range }: SpecificWorksheetProps & { docId: string, range: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);

    // Determine the numbers to show in headers/rows
    const numbers = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i);
    const isAdvanced = range[0] >= 6;
    const isFull = range[0] === 1 && range[1] === 12;

    const themeColor = isFull ? 'indigo' : (isAdvanced ? 'purple' : 'blue');
    const accentSymbol = isFull ? "🚀" : (isAdvanced ? "🌟" : "💡");

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', isFull ? 'Complete Blank Times Table (1-12)' : (isAdvanced ? 'Blank Times Table (6-12) - Fill In' : 'Blank Times Table (1-5) - Fill In'))}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', isFull ? 'Complete blank times table grid for all facts 1-12.' : (isAdvanced ? 'Blank times table worksheets to fill in for facts 6-12.' : 'Blank times table worksheets to fill in for facts 1-5.'))}
            problemCount={numbers.length * numbers.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                const defaults = isFull
                    ? ['Fill in complete 12x12 times table grid', 'Practice all multiplication combinations 1-12', 'Build comprehensive memorization through repetition']
                    : (isAdvanced
                        ? ['Fill in complete times table grid for facts 6-12', 'Practice all advanced multiplication combinations', 'Build memorization through repetition with larger numbers']
                        : ['Fill in complete times table grid for facts 1-5', 'Practice all multiplication combinations', 'Build memorization through repetition']);
                return Array.isArray(obj) && obj.length > 0 ? obj : defaults;
            })()}
            parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                const defaults = isFull
                    ? ['This is comprehensive practice - encourage systematic filling (row by row or column by column)', 'Use skip counting strategies for each row', 'Notice patterns: diagonal shows perfect squares, rows count by that number', 'Extension: Time yourself filling in the complete table']
                    : ['This helps students see patterns in multiplication', 'Encourage students to fill in rows or columns systematically', 'Use skip counting to help: for row 3, count by 3s', 'Extension: Time yourself filling in the table'];
                return Array.isArray(tips) && tips.length > 0 ? tips : defaults;
            })()}
        >
            <PremiumWorksheetBanner
                title={isFull ? "Comprehensive Grid" : (isAdvanced ? "Advanced Skills" : "Foundation Training")}
                subtitle="Complete the Matrix"
                icons={{
                    bg1: "📊",
                    bg2: "🔢",
                    float1: accentSymbol,
                    float2: "📋"
                }}
                colors={{
                    bg: `bg-${themeColor}-50`,
                    border: `border-${themeColor}-200`,
                    pillBg: "bg-white/90",
                    pillBorder: `border-${themeColor}-300`,
                    pillText: `text-${themeColor}-900`,
                    accent: `text-${themeColor}-200`
                }}
            />

            {/* Worked Example */}
            <div className={`mb-8 p-6 bg-${themeColor}-50/50 border-2 border-${themeColor}-100 rounded-2xl relative overflow-hidden group`}>
                <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 text-${themeColor}-500 group-hover:scale-110 transition-transform`}>{accentSymbol}</div>
                <div className={`font-black text-${themeColor}-900 mb-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                    <span className={`w-8 h-8 rounded-lg bg-${themeColor}-500 text-white flex items-center justify-center text-sm`}>{accentSymbol}</span>
                    {getTrans('example.title', "Strategy Guide")}
                </div>
                <div className="space-y-4">
                    <div className="flex items-baseline gap-3">
                        <span className="text-slate-400 font-mono text-xs">GUIDE:</span>
                        <div className="text-lg font-medium text-slate-700 italic">
                            {getTrans('example.instruction', isFull ? 'For each square, multiply the top number by the side number.' : `For row ${numbers[1] - 1}:`)}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                        <div className={`pl-4 border-l-4 border-${themeColor}-200 py-1 space-y-2`}>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full bg-${themeColor}-400 animate-pulse`}></span>
                                {getTrans('example.step1', 'Step 1: Check the Headers')}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">{getTrans('example.step1Text', 'Look at the row number on the left and the column number at the top.')}</p>
                        </div>
                        <div className={`pl-4 border-l-4 border-${themeColor}-200 py-1 space-y-2`}>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full bg-${themeColor}-400`}></span>
                                {getTrans('example.step2', 'Step 2: Mental Math')}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">{getTrans('example.step2Text', 'Multiply them and write the product in the crossing box.')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 break-inside-avoid">
                <div className={`relative overflow-hidden bg-white border-2 border-${themeColor}-100 rounded-3xl p-6 shadow-xl`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className={`text-lg font-black text-${themeColor}-900 uppercase tracking-widest bg-${themeColor}-50 px-4 py-1 rounded-full`}>
                            Multiplication Matrix
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Facts {range[0]} - {range[1]}</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-1">
                            <thead>
                                <tr>
                                    <th className={`w-12 h-12 bg-${themeColor}-600 text-white rounded-xl shadow-lg flex items-center justify-center font-black text-xl border-2 border-white/20 transform rotate-3`}>
                                        {String.fromCodePoint(0x270F)}
                                    </th>
                                    {numbers.map(n => (
                                        <th key={n} className={`w-12 h-12 bg-slate-800 text-white rounded-xl shadow-md border-b-4 border-slate-900 font-black text-lg`}>
                                            {n}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {numbers.map(row => (
                                    <tr key={row}>
                                        <td className={`w-12 h-12 bg-slate-100 text-slate-800 rounded-xl shadow-sm border border-slate-200 font-black text-lg text-center`}>
                                            {row}
                                        </td>
                                        {numbers.map(col => (
                                            <td key={col} className="w-12 h-12 relative group">
                                                <div className="absolute inset-0 bg-slate-50 border-2 border-slate-200 rounded-xl group-hover:border-blue-400 transition-colors shadow-inner" />
                                                <div className="absolute inset-0 flex items-end justify-center pb-2">
                                                    <div className="w-8 h-1 bg-slate-300 rounded-full" />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                <div className={`p-6 bg-purple-50/50 border-2 border-purple-100 rounded-2xl relative overflow-hidden group`}>
                    <div className="absolute -right-2 -top-2 text-6xl opacity-5 Rotate-12 group-hover:scale-110 transition-transform">🚀</div>
                    <div className="font-black text-purple-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center text-xs">🚀</span>
                        Elite Challenges
                    </div>
                    <div className="space-y-3 text-xs text-purple-800 font-medium">
                        <div className="flex gap-2">
                            <span className="text-purple-300">01.</span>
                            <span>{getTrans('challenge.1', 'Fill in the table from memory without looking at any notes.')}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-purple-300">02.</span>
                            <span>{getTrans('challenge.2', `Time yourself: Can you fill it in under ${isFull ? '10' : '5'} minutes?`)}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-purple-300">03.</span>
                            <span>{getTrans('challenge.3', 'Find all the perfect squares (numbers on the diagonal). Color them in!')}</span>
                        </div>
                    </div>
                </div>

                <div className={`p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl`}>
                    <div className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs">📊</span>
                        Self-Assessment
                    </div>
                    <div className="space-y-3">
                        {[
                            isFull ? 'I mastered the complete 12x12 grid' : `I filled in all ${numbers.length * numbers.length} facts correctly`,
                            'I identified patterns in rows and columns',
                            'I feel confident with these facts'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <div className="w-4 h-4 rounded border-2 border-slate-300 bg-white" />
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">My Score:</span>
                            <div className="h-6 border-b-2 border-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Total Time:</span>
                            <div className="h-6 border-b-2 border-slate-200" />
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className={`mt-10 p-8 bg-emerald-900 rounded-3xl border-2 border-emerald-400/30 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 text-emerald-500/10 text-900 px-4 py-1 rounded-bl-xl font-bold text-sm tracking-widest rotate-12">{String.fromCodePoint(0x2705)}</div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-500/20">
                            {String.fromCodePoint(0x2705)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Solution Matrix</h3>
                            <p className="text-emerald-300 text-xs italic">Verified Results for Range {range[0]}-{range[1]}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-1">
                            <thead>
                                <tr>
                                    <th className="w-10 h-10 bg-emerald-700 rounded-lg text-xs font-black">X</th>
                                    {numbers.map(n => (
                                        <th key={n} className="w-10 h-10 bg-white/5 rounded-lg text-xs font-black">{n}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {numbers.map(row => (
                                    <tr key={row}>
                                        <td className="w-10 h-10 bg-white/5 rounded-lg text-xs font-black text-center">{row}</td>
                                        {numbers.map(col => (
                                            <td key={col} className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-xs font-mono font-bold text-emerald-200">
                                                {row * col}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationConfidence({ seed, variant, showAnswersForDoc, docId, range = [1, 12] }: SpecificWorksheetProps & { docId: string, range?: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const isAdvanced = range[0] >= 6;
    const themeColor = isAdvanced ? 'purple' : 'green';
    const accentSymbol = isAdvanced ? "💪" : "🌱";

    const facts: Array<[number, number]> = Array.from({ length: 12 }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', isAdvanced ? 'Confidence-Building Times Table (6-12)' : 'Confidence-Building Times Table (1-5)')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', isAdvanced ? 'Gentle step-by-step multiplication worksheets for facts 6-12.' : 'Stress-free times table worksheets designed to build confidence.')}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                const defaults = isAdvanced
                    ? ['Build confidence with advanced multiplication facts 6-12', 'Practice at a comfortable pace without time pressure', 'Develop positive attitude toward challenging multiplication']
                    : ['Build confidence with multiplication facts 1-5', 'Practice at a comfortable pace without time pressure', 'Develop positive attitude toward multiplication'];
                return Array.isArray(obj) && obj.length > 0 ? obj : defaults;
            })()}
            parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                const defaults = isAdvanced
                    ? ['This worksheet is designed to be stress-free - no time limits', 'Encourage students to use visual aids or manipulatives if needed', 'Celebrate every correct answer to build confidence', 'Extension: Once confident, try timed practice']
                    : ['This worksheet is designed to be stress-free - no time limits', 'Encourage students to use visual aids or manipulatives if needed', 'Celebrate every correct answer to build confidence', 'Extension: Once confident, try timed practice'];
                return Array.isArray(tips) && tips.length > 0 ? tips : defaults;
            })()}
        >
            <PremiumWorksheetBanner
                title={getTrans('banner.title', isAdvanced ? "Advanced Growth" : "Confidence First")}
                subtitle={getTrans('banner.subtitle', "Mastery at your own pace")}
                icons={{
                    bg1: accentSymbol,
                    bg2: "✨",
                    float1: "⭐",
                    float2: "🌈"
                }}
                colors={{
                    bg: `bg-gradient-to-br from-${themeColor}-50 to-white`,
                    border: `border-${themeColor}-200`,
                    pillBg: "bg-white/80",
                    pillBorder: `border-${themeColor}-300`,
                    pillText: `text-${themeColor}-800`,
                    accent: `text-${themeColor}-300`
                }}
            />

            {/* Stress-Free Tip */}
            <div className={`mb-6 p-4 bg-${themeColor}-50 border border-${themeColor}-200 rounded-2xl flex items-center gap-4 animate-fade-in`}>
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm`}>{accentSymbol}</div>
                <div>
                    <div className={`font-bold text-${themeColor}-900`}>{getTrans('tip.title', "You've got this!")}</div>
                    <div className={`text-sm text-${themeColor}-700`}>{getTrans('tip.text', "Take your time. There's no rush. Each problem helps you get stronger!")}</div>
                </div>
            </div>

            {/* Worked Example */}
            <div className={`mb-8 p-6 bg-blue-50/50 border-2 border-blue-100 rounded-3xl relative overflow-hidden group`}>
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 text-blue-500 group-hover:scale-110 transition-transform">💡</div>
                <div className="font-black text-blue-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs">💡</span>
                    {getTrans('example.title', "Thinking Pattern")}
                </div>
                <div className="space-y-4 ml-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{getTrans('example.problemLabel', 'Problem')}</span>
                        <div className="text-2xl font-black text-slate-800">{isAdvanced ? '7 × 8 = ?' : '3 × 4 = ?'}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{getTrans('example.step1Label', 'Think')}</span>
                            <p className="text-sm text-slate-600 font-medium italic">{isAdvanced ? 'It is like 7 groups of 8' : 'It is like 3 groups of 4'}</p>
                        </div>
                        <div className="space-y-1 text-blue-700">
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-tighter">{getTrans('example.step2Label', 'Result')}</span>
                            <p className="text-sm font-black">{isAdvanced ? '7 × 8 = 56' : '3 × 4 = 12'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className={`relative border-2 border-${themeColor}-100 rounded-2xl p-6 bg-white hover:border-${themeColor}-300 transition-all group break-inside-avoid`}>
                        <div className={`absolute top-0 right-0 p-3 text-[10px] font-black text-${themeColor}-300 group-hover:text-${themeColor}-500 transition-colors uppercase tracking-widest`}>Task {i + 1}</div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-4 text-3xl font-black text-slate-700">
                                <span>{a}</span>
                                <span className={`text-${themeColor}-400 transform scale-75`}>×</span>
                                <span>{b}</span>
                                <span className="text-slate-300">=</span>
                                <div className={`w-24 h-12 border-b-4 border-dashed border-${themeColor}-300 bg-${themeColor}-50/30 rounded-lg flex items-center justify-center`} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                                {getTrans('hintText', 'Hint: Think {a} groups of {b}').replace('{a}', String(a)).replace('{b}', String(b))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-10 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100 rounded-3xl print:bg-white print:border break-inside-avoid">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl animate-bounce-slow">🚀</span>
                    <h3 className="font-bold text-lg text-indigo-900">{getTrans('challenge.title', 'Confidence Quest')}</h3>
                </div>
                <div className="space-y-3 text-sm text-indigo-800 ml-2">
                    {[
                        getTrans('challenge.item1', 'Draw a picture to show one of the problems above.'),
                        getTrans('challenge.item2', 'Create your own multiplication problem and solve it!'),
                        getTrans('challenge.item3', 'Explain to someone how you solved your favorite problem.')
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                            <span className="font-bold text-indigo-300">{(idx + 1).toString().padStart(2, '0')}</span>
                            <p className="font-medium text-slate-700">{item}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-8 p-6 border-2 border-slate-200 rounded-3xl bg-slate-50 relative" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="absolute -top-3 left-6 px-4 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Check</div>
                <div className="space-y-4 pt-2">
                    {[
                        getTrans('assessment.item1', 'I feel more confident with these facts'),
                        getTrans('assessment.item2', 'I can explain my steps to solve a problem'),
                        getTrans('assessment.item3', 'I took my time and checked my work')
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                            <div className="w-5 h-5 rounded-lg border-2 border-slate-300 bg-white" />
                            {item}
                        </div>
                    ))}
                    <div className="mt-6 flex justify-between items-end border-t border-slate-200 pt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTrans('assessment.scoreLabel', 'Mastery Level')}</span>
                            <div className="text-sm font-black text-slate-800 italic">______ / {facts.length}</div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTrans('assessment.feelingLabel', 'Current Feeling')}</span>
                            <div className="text-xs text-slate-400 italic">Circle one: 😊 😐 🚀</div>
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className={`mt-10 p-8 bg-emerald-900 rounded-3xl border-2 border-emerald-400/30 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 text-emerald-500/10 text-6xl tracking-widest rotate-12">{String.fromCodePoint(0x2705)}</div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-500/20">
                            {String.fromCodePoint(0x2705)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Confidence Key</h3>
                            <p className="text-emerald-300 text-xs italic">You're doing amazing! Check your results below.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="flex items-center gap-3 border-b border-emerald-700/50 pb-2">
                                <span className="text-[10px] font-black text-emerald-500">{i + 1}</span>
                                <div className="text-sm font-mono flex gap-2">
                                    <span>{a} × {b}</span>
                                    <span className="text-emerald-400">=</span>
                                    <span className="font-black text-white">{a * b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-emerald-200 leading-relaxed font-medium">
                        {getTrans('answerKey.feedback', "Mastering these facts is the first step toward becoming a math wizard! Keep practicing every day.")}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationFluency({ seed, variant, showAnswersForDoc, docId, range = [1, 12] }: SpecificWorksheetProps & { docId: string, range?: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const isMixed = docId === 'times-table-mixed-review';
    const problemCount = isMixed ? 30 : 25;
    const gridCols = isMixed ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';

    const facts: Array<[number, number]> = Array.from({ length: problemCount }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const themeColor = isMixed ? 'indigo' : 'orange';
    const accentSymbol = isMixed ? "🧬" : "⚡";

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', isMixed ? 'Mixed Times Table Review' : 'Times Table Fluency Practice (1-12)')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', isMixed ? 'Comprensive review of all times tables covering facts 1-12 in mixed order.' : 'Build multiplication fluency with comprehensive practice covering all times tables 1-12.')}
            problemCount={facts.length}
            learningObjectives={(() => {
                const obj = t(`worksheets.${docId}.learningObjectives`)
                const defaults = isMixed
                    ? ['Review all multiplication facts 1-12 in mixed order', 'Build speed and accuracy with comprehensive practice', 'Test mastery across all times tables']
                    : ['Build fluency (speed and accuracy) with all multiplication facts 1-12', 'Practice comprehensive multiplication to achieve automaticity', 'Develop quick recall of multiplication facts'];
                return Array.isArray(obj) && obj.length > 0 ? obj : defaults;
            })()}
            parentTeacherTips={(() => {
                const tips = t(`worksheets.${docId}.parentTeacherTips`)
                const defaults = isMixed
                    ? ['Mixed review tests true mastery - students cannot rely on patterns', 'Encourage students to use all strategies they know', 'This is great for assessment - see which facts need more practice', 'Extension: Time yourself and track improvement']
                    : ['Fluency means knowing facts quickly and accurately', 'Encourage students to answer as fast as they can while staying accurate', 'Use strategies: patterns, known facts, breaking down', 'Extension: Time yourself and try to beat your record!'];
                return Array.isArray(tips) && tips.length > 0 ? tips : defaults;
            })()}
        >
            <PremiumWorksheetBanner
                title={getTrans('banner.title', isMixed ? "Mastery Matrix" : "Speed & Accuracy")}
                subtitle={getTrans('banner.subtitle', "Achieve lightning-fast recall")}
                icons={{
                    bg1: accentSymbol,
                    bg2: "🔥",
                    float1: "⏱️",
                    float2: "🎯"
                }}
                colors={{
                    bg: `bg-gradient-to-br from-${themeColor}-50 to-white`,
                    border: `border-${themeColor}-200`,
                    pillBg: "bg-white/80",
                    pillBorder: `border-${themeColor}-300`,
                    pillText: `text-${themeColor}-800`,
                    accent: `text-${themeColor}-300`
                }}
            />

            {/* Fluency Meter */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 bg-${themeColor}-50/50 border border-${themeColor}-100 rounded-2xl`}>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Speed</div>
                    <div className="text-lg font-black text-slate-800">3 Seconds <span className="text-xs font-normal text-slate-500">per fact</span></div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Goal</div>
                    <div className="text-lg font-black text-emerald-800">100% Accuracy</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Focus</div>
                    <div className="text-lg font-black text-purple-800">Automaticity</div>
                </div>
            </div>

            {/* Worked Example */}
            <div className={`mb-8 p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl relative overflow-hidden group`}>
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 text-slate-500 group-hover:scale-110 transition-transform">💡</div>
                <div className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs">💡</span>
                    {getTrans('example.title', "Technique Corner")}
                </div>
                <div className="space-y-4 ml-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fast Recall</span>
                            <p className="text-sm text-slate-600 font-medium">For facts you know, write them instantly! Don't overthink them.</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Strategy Backup</span>
                            <p className="text-sm text-slate-600 font-medium italic">Stuck on 9 × 7? Think: (10 × 7) - 7 = 63. Then memorize it!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`grid ${gridCols} gap-3 break-inside-avoid`} style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className={`border border-slate-200 rounded-xl p-3 bg-white hover:border-${themeColor}-300 transition-colors break-inside-avoid shadow-sm flex items-center justify-center`}>
                        <div className="font-mono text-xl leading-7 text-slate-700 flex items-center gap-2">
                            <span className="w-5 text-[10px] font-black text-slate-300 mr-1">{i + 1}</span>
                            <span>{a}</span>
                            <span className="text-slate-300">×</span>
                            <span>{b}</span>
                            <span className="text-slate-400">=</span>
                            <span className={`inline-block w-12 h-8 border-b-2 border-${themeColor}-200`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Self-Assessment & Time Tracking */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl relative">
                    <div className="absolute -top-3 left-6 px-4 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Tracker</div>
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Start Time</span>
                            <div className="w-32 h-6 border-b-2 border-slate-300" />
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">End Time</span>
                            <div className="w-32 h-6 border-b-2 border-slate-300" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Duration</span>
                            <div className="w-32 h-6 border-b-2 border-slate-300" />
                        </div>
                    </div>
                </div>

                <div className={`p-6 bg-${themeColor}-50/50 border-2 border-${themeColor}-100 rounded-3xl relative`}>
                    <div className="absolute -top-3 left-6 px-4 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Level</div>
                    <div className="space-y-3 pt-2">
                        {[
                            'I answered most facts instantly',
                            'I used strategies for hard facts',
                            'I checked my work for errors'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                                <div className="w-5 h-5 rounded-lg border-2 border-slate-300 bg-white" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className={`mt-10 p-8 bg-emerald-900 rounded-3xl border-2 border-emerald-400/30 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 text-emerald-500/10 text-6xl tracking-widest rotate-12">{String.fromCodePoint(0x2705)}</div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-500/20">
                            {String.fromCodePoint(0x2705)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Fast Answers</h3>
                            <p className="text-emerald-300 text-xs italic">Accuracy is the foundation of speed.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="flex items-center gap-2 border-b border-emerald-700/50 pb-1">
                                <span className="text-[10px] font-black text-emerald-500">{i + 1}</span>
                                <div className="text-xs font-mono">
                                    {a} × {b} = <span className="font-black text-white">{a * b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function MultiplicationColorByNumber({ seed, variant, showAnswersForDoc, docId, range }: SpecificWorksheetProps & { docId: string, range: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const isAdvanced = range[0] >= 6;
    const isFull = range[0] === 1 && range[1] === 12;

    const colorMap: Record<number, { name: string, color: string }> = isFull ? {
        1: { name: 'Red', color: 'bg-red-500' },
        4: { name: 'Blue', color: 'bg-blue-500' },
        9: { name: 'Green', color: 'bg-green-500' },
        16: { name: 'Yellow', color: 'bg-yellow-400' },
        25: { name: 'Orange', color: 'bg-orange-500' },
        36: { name: 'Purple', color: 'bg-purple-500' },
        49: { name: 'Pink', color: 'bg-pink-400' },
        64: { name: 'Brown', color: 'bg-amber-800' },
        81: { name: 'Gray', color: 'bg-slate-400' },
        100: { name: 'Cyan', color: 'bg-cyan-400' },
        121: { name: 'Magenta', color: 'bg-magenta-500' },
        144: { name: 'Teal', color: 'bg-teal-500' }
    } : isAdvanced ? {
        36: { name: 'Red', color: 'bg-red-500' },
        42: { name: 'Blue', color: 'bg-blue-500' },
        48: { name: 'Green', color: 'bg-green-500' },
        54: { name: 'Yellow', color: 'bg-yellow-400' },
        60: { name: 'Orange', color: 'bg-orange-500' },
        66: { name: 'Purple', color: 'bg-purple-500' },
        72: { name: 'Pink', color: 'bg-pink-400' },
        81: { name: 'Brown', color: 'bg-amber-800' },
        90: { name: 'Gray', color: 'bg-slate-400' },
        100: { name: 'Cyan', color: 'bg-cyan-400' },
        108: { name: 'Magenta', color: 'bg-magenta-500' },
        121: { name: 'Teal', color: 'bg-teal-500' }
    } : {
        1: { name: 'Red', color: 'bg-red-500' },
        2: { name: 'Blue', color: 'bg-blue-500' },
        3: { name: 'Green', color: 'bg-green-500' },
        4: { name: 'Yellow', color: 'bg-yellow-400' },
        5: { name: 'Orange', color: 'bg-orange-500' },
        6: { name: 'Purple', color: 'bg-purple-500' },
        8: { name: 'Pink', color: 'bg-pink-400' },
        9: { name: 'Brown', color: 'bg-amber-800' },
        10: { name: 'Gray', color: 'bg-slate-400' },
        12: { name: 'Cyan', color: 'bg-cyan-400' },
        15: { name: 'Magenta', color: 'bg-magenta-500' },
        20: { name: 'Teal', color: 'bg-teal-500' }
    };

    const validProducts = Object.keys(colorMap).map(Number);
    const facts: Array<[number, number, number]> = [];

    // Generate valid facts
    for (let attempts = 0; attempts < 100 && facts.length < 12; attempts++) {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        const p = a * b;
        if (validProducts.includes(p)) {
            facts.push([a, b, p]);
        }
    }

    // Fallback if not enough facts
    while (facts.length < 12) {
        const p = validProducts[nextInt(0, validProducts.length - 1)];
        // Find factors
        for (let a = range[0]; a <= range[1]; a++) {
            if (p % a === 0) {
                const b = p / a;
                if (b >= range[0] && b <= range[1]) {
                    facts.push([a, b, p]);
                    break;
                }
            }
        }
        if (facts.length < 12 && facts.length > 0) facts.push(facts[0]); // Duplicate as last resort
        else if (facts.length === 0) break;
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', isAdvanced ? 'Color-by-Number Times Table (6-12)' : 'Color-by-Number Times Table (1-5)')}
            emoji={String.fromCodePoint(0x1F58D)}
            description={getTrans('description', 'Solve multiplication problems and color based on the results! A creative way to master your times tables.')}
            problemCount={facts.length}
        >
            <PremiumWorksheetBanner
                title={getTrans('banner.title', "Math Art Discovery")}
                subtitle={getTrans('banner.subtitle', "Color your way to mastery")}
                icons={{
                    bg1: "🎨",
                    bg2: "🖍️",
                    float1: "✨",
                    float2: "🌈"
                }}
                colors={{
                    bg: `bg-gradient-to-br from-pink-50 to-white`,
                    border: `border-pink-200`,
                    pillBg: "bg-white/80",
                    pillBorder: `border-pink-300`,
                    pillText: `text-pink-800`,
                    accent: `text-pink-300`
                }}
            />

            {/* Color Legend */}
            <div className="mb-8 p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Color Legend</div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(colorMap).map(([num, info]) => (
                        <div key={num} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl ${info.color} shadow-lg border-2 border-white`} />
                            <div className="text-center">
                                <div className="text-xs font-black text-slate-800">{num}</div>
                                <div className="text-[10px] text-slate-500 font-bold">{info.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b, p], i) => (
                    <div key={i} className="relative group break-inside-avoid">
                        <div className="absolute inset-0 bg-slate-50 rounded-3xl -rotate-1 group-hover:rotate-0 transition-transform" />
                        <div className="relative bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-col items-center gap-4 shadow-sm group-hover:border-pink-200 transition-colors">
                            <div className="text-xl font-black text-slate-700">
                                {a} × {b} = <span className="inline-block w-12 h-6 border-b-2 border-slate-200" />
                            </div>

                            {/* Shape to color */}
                            <div className="w-24 h-24 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-50 opacity-20" />
                                <span className="text-[10px] font-black text-slate-300 uppercase rotate-45 tracking-widest">Color Me</span>
                            </div>

                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pt-2 border-t border-slate-50 w-full text-center">
                                Shape #{i + 1}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className={`mt-10 p-8 bg-slate-900 rounded-3xl border-2 border-slate-700 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 text-white/5 text-8xl tracking-widest rotate-12">🎨</div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-pink-500/20">
                            🎨
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Artist's Key</h3>
                            <p className="text-slate-400 text-xs italic">Verify your colors before you finish!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4">
                        {facts.map(([a, b, p], i) => (
                            <div key={i} className="flex items-center gap-2 border-b border-slate-800 pb-1">
                                <span className="text-[10px] font-black text-slate-500">{i + 1}</span>
                                <div className="text-xs font-mono">
                                    {a} × {b} = <span className={`font-black ${colorMap[p]?.color.replace('bg-', 'text-')}`}>{p}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
