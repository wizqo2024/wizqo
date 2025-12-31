import React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper } from './PrintableShared';

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
    showAnswersForDoc: (docId: string, render: () => ReactNode) => ReactNode
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
                <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-red-500 animate-gradient-x mb-4" />

                {/* Decorative Header */}
                <div className="w-full h-24 mb-6 relative overflow-hidden bg-blue-900 rounded-xl border-4 border-yellow-400 shadow-xl">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl animate-pulse">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl animate-bounce-slow">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-3xl font-black text-yellow-400 tracking-widest uppercase italic transform -skew-x-12" style={{ textShadow: '3px 3px 0px #ef4444' }}>HERO TRAINING</h2>
                    </div>
                </div>

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
            <div className={`print:hidden h-1 w-16 rounded-full bg-gradient-to-r ${isAdvanced ? 'from-purple-400 to-pink-400' : 'from-purple-400 to-pink-400'} animate-gradient-x mb-2`} />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong>{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        {isAdvanced ? (
                            <>
                                <div><strong>Strategy 1:</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Strategy 2:</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Strategy 3:</strong> Skip count: 8, 16, 24, 32, 40, 48, 56 (count by 8s seven times)</div>
                                <div className="font-semibold text-blue-900"><strong>Answer:</strong> 56</div>
                            </>
                        ) : (
                            <>
                                <div><strong>{getTrans('example.step1', 'Step 1:')}</strong> {getTrans('example.step1Text', 'Think: 3 groups of 4')}</div>
                                <div><strong>{getTrans('example.step2', 'Step 2:')}</strong> {getTrans('example.step2Text', 'Count: 4, 8, 12 (skip count by 4s three times)')}</div>
                                <div><strong>{getTrans('example.step3', 'Step 3:')}</strong> {getTrans('example.step3Text', 'Or add: 4 + 4 + 4 = 12')}</div>
                                <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '12')}</div>
                            </>
                        )}
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full break-inside-avoid">
                        <div className="font-mono text-2xl leading-7 text-center">
                            <div>{String.fromCodePoint(0x279C)}<span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
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
    const { getTrans } = useWorksheetTranslation(docId);
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
            description={getTrans('description', "Draw an array for each multiplication problem. Count the total number of objects and write the answer in the blank.")}
            problemCount={arrays.length}
            learningObjectives={[
                'Use arrays to visualize multiplication',
                'Count rows and columns to find the product',
                'Understand multiplication as equal groups'
            ]}
            parentTeacherTips={[
                'Arrays help students see multiplication visually',
                'Count rows first, then columns, or count all objects',
                'Encourage students to count the total number of boxes',
                'Extension: Draw your own arrays for different problems'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Problem:</strong>{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Draw an array with 3 rows and 4 columns</div>
                        <div><strong>Step 2:</strong>{String.fromCodePoint(0x279C)}</div>
                        <div><strong>Step 3:</strong> Or count: 4, 8, 12 (count by 4s three times)</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> 12</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {arrays.map(([rows, cols], i) => (
                    <div key={i} className="border border-slate-300 rounded p-4 bg-white break-inside-avoid">
                        <div className="text-center mb-2 font-semibold text-slate-800">{String.fromCodePoint(0x270F)}<span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '200px', margin: '0 auto' }}>
                            {Array.from({ length: rows * cols }).map((_, idx) => (
                                <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100 print:bg-white" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* Extension/Challenge and Self Assessment omitted for brevity in inline but good to include if extracted */}
            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>{String.fromCodePoint(0x1F680)}</div>
                    <div>{String.fromCodePoint(0x1F680)}</div>
                    <div>3. Create a word problem that matches one of the arrays above</div>
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
                    <div className="font-bold text-emerald-900 mb-3 text-base">{getTrans('answerKey', String.fromCharCode(0x2705) + ' Answer Key')}</div>
                    <div className="space-y-2">
                        {arrays.map(([rows, cols], i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {rows} x {cols} = <strong>{rows * cols}</strong> (count all {rows * cols} boxes in the array)
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
    const { getTrans } = useWorksheetTranslation(docId);

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
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-gradient-x mb-2" />
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
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const arrays: Array<[number, number]> = Array.from({ length: 6 }).map(() => {
        const rows = nextInt(3, 6); const cols = nextInt(3, 6); return [rows, cols];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Multiplication Arrays & Models')}
            emoji={String.fromCodePoint(0x2716)}
            description={getTrans('description', "Draw an array for each problem. Use the array to solve.")}
            problemCount={arrays.length}
            learningObjectives={[
                'Use arrays to visualize and solve multiplication',
                'Count rows and columns to find products',
                'Understand multiplication as equal groups arranged in arrays'
            ]}
            parentTeacherTips={[
                'Arrays help students see the structure of multiplication',
                'Encourage students to count rows x columns',
                'Students can also count all boxes to verify their answer',
                'Extension: Draw arrays for larger numbers'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient-x mb-2" />

            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Problem:</strong>{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at the array: 4 rows and 5 columns</div>
                        <div><strong>Step 2:</strong>{String.fromCodePoint(0x279C)}</div>
                        <div><strong>Step 3:</strong> Or count all boxes: 1, 2, 3... 20 boxes total</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> 20</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {arrays.map(([rows, cols], i) => (
                    <div key={i} className="border border-slate-300 rounded p-4 bg-white break-inside-avoid">
                        <div className="text-center mb-2 font-semibold text-slate-800">{String.fromCodePoint(0x270F)}<span className="inline-block w-20 h-10 border-b-[3px] border-slate-600 mx-1 align-middle" /></div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '200px', margin: '0 auto' }}>
                            {Array.from({ length: rows * cols }).map((_, idx) => (
                                <div key={idx} className="aspect-square border border-slate-400 rounded bg-slate-100 print:bg-white" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>{String.fromCodePoint(0x1F680)}</div>
                    <div>{String.fromCodePoint(0x1F680)}</div>
                    <div>3. Create a word problem that matches one of the arrays above</div>
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

export function TimesTableHorizontal({ seed, variant, showAnswersForDoc, docId, range }: SpecificWorksheetProps & { docId: string, range: [number, number] }) {
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    // Determine problem count based on docId/range roughly
    const problemCount = docId.includes('1-12') ? 20 : 15;

    const facts: Array<[number, number]> = Array.from({ length: problemCount }).map(() => {
        const a = nextInt(range[0], range[1]);
        const b = nextInt(range[0], range[1]);
        return [a, b];
    });

    const is1To12 = docId.includes('1-12');
    const is6To12 = docId.includes('6-12');

    // Defaults relative to specific doc, matching inline
    let title = getTrans('title', 'Horizontal Times Table (1-5)');
    let description = getTrans('description', 'Practice times tables 1-5 in horizontal format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice.');
    let objectives = [
        'Memorize multiplication facts for numbers 1-5',
        'Practice multiplication in horizontal format',
        'Build speed and accuracy with basic facts'
    ];
    let tips = [
        'Start with easier facts (1s, 2s) and work up to 5s',
        'Use skip counting to help: 3 x 4 means count by 3s four times',
        'Practice daily for 5-10 minutes for best results',
        'Extension: Time yourself and try to beat your record!'
    ];

    if (is1To12) {
        title = getTrans('title', 'Complete Horizontal Times Table (1-12)');
        description = getTrans('description', 'Comprehensive horizontal times table practice covering all facts 1-12. Perfect for building multiplication fluency and speed.');
        objectives = [
            'Master all multiplication facts 1-12',
            'Build speed and accuracy with complete times tables',
            'Practice multiplication in horizontal format'
        ];
        tips = [
            'This is comprehensive practice - celebrate progress!',
            'Use strategies: doubles (6x6), near doubles (6x7), patterns (9xn)',
            'Practice daily for 10-15 minutes for best results',
            'Extension: Time yourself and track improvement over time'
        ];
    } else if (is6To12) {
        title = getTrans('title', 'Horizontal Times Table (6-12)');
        description = getTrans('description', 'Master times tables 6-12 in horizontal format. Fun and simple worksheets to make multiplication easier for advancing learners.');
        objectives = [
            'Memorize multiplication facts for numbers 6-12',
            'Practice multiplication in horizontal format',
            'Build speed and accuracy with advanced facts'
        ];
        tips = [
            'These facts are trickier - use strategies like doubling (6x7 = 2x3x7)',
            'Break down larger facts: 8x9 = 8x10 - 8 = 80 - 8 = 72',
            'Practice daily for 10-15 minutes for best results',
            'Extension: Time yourself and try to beat your record!'
        ];
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={title}
            emoji={String.fromCodePoint(0x2716)}
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
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong>{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        {is1To12 ? (
                            <>
                                <div><strong>Method 1 (9s trick):</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Method 2 (Use known facts):</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Method 3 (Skip counting):</strong> Count by 9s seven times: 9, 18, 27, 36, 45, 54, 63</div>
                                <div className="font-semibold text-blue-900"><strong>Answer:</strong> 63</div>
                            </>
                        ) : is6To12 ? (
                            <>
                                <div><strong>Method 1 (Break it down):</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Method 2 (Use known facts):</strong>{String.fromCodePoint(0x279C)}</div>
                                <div><strong>Method 3 (Skip counting):</strong> Count by 7s eight times: 7, 14, 21, 28, 35, 42, 49, 56</div>
                                <div className="font-semibold text-blue-900"><strong>Answer:</strong> 56</div>
                            </>
                        ) : (
                            <>
                                <div><strong>{getTrans('example.method1', 'Method 1 (Skip Counting):')}</strong> {getTrans('example.method1Text', 'Count by 3s four times: 3, 6, 9, 12')}</div>
                                <div><strong>{getTrans('example.method2', 'Method 2 (Repeated Addition):')}</strong> {getTrans('example.method2Text', '3 + 3 + 3 + 3 = 12')}</div>
                                <div><strong>{getTrans('example.method3', 'Method 3 (Visual):')}</strong> {getTrans('example.method3Text', '3 groups of 4 objects = 12 objects')}</div>
                                <div className="font-semibold text-blue-900"><strong>{getTrans('example.answer', 'Answer:')}</strong> {getTrans('example.answerText', '12')}</div>
                            </>
                        )}
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center break-inside-avoid">
                        <div className="font-mono text-xl leading-7">
                            {a} x {b} = <span className="inline-block w-16 h-8 border-b-[3px] border-slate-600 mx-1 align-middle" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    {(() => {
                        const items = t(`worksheets.${docId}.challenge.items`)
                        const fallbackItems = [
                            'Create your own multiplication problem: ___ x ___ = ?',
                            'Solve: 5 x 5 = ? (the biggest fact in this worksheet!)',
                            'Write all the facts that equal 12: ___ x ___ = 12',
                            `Time yourself: Can you complete all ${facts.length} problems in under 2 minutes?`
                        ]
                        const itemsArray = Array.isArray(items) && items.length > 0 && typeof items[0] === 'string' && items[0] !== `worksheets.${docId}.challenge.items` ? items : fallbackItems
                        return itemsArray.map((item, i) => {
                            const itemText = typeof item === 'string' ? item.replace('{count}', String(facts.length)) : item
                            return <div key={i}>{i + 1}. {itemText}</div>
                        })
                    })()}
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    {(() => {
                        const items = t(`worksheets.${docId}.selfAssessment.items`)
                        const fallbackItems = [
                            'I can multiply numbers 1-5 easily',
                            'I need more practice with some facts',
                            'I can say the answers quickly (fluency)'
                        ]
                        const itemsArray = Array.isArray(items) && items.length > 0 && typeof items[0] === 'string' && items[0] !== `worksheets.${docId}.selfAssessment.items` ? items : fallbackItems
                        return itemsArray.map((item, i) => (
                            <div key={i}>{String.fromCodePoint(0x279C)}</div>
                        ))
                    })()}
                </div>
                {/* Simplified Self-Assessment fields */}
                <div className="mt-3 text-xs">
                    <strong>{getTrans('selfAssessment.score', 'My score:')}</strong> ___ / {facts.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{getTrans('selfAssessment.timeTaken', 'Time taken:')}</strong> _____ {getTrans('selfAssessment.minutes', 'minutes')}
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="border-b border-emerald-200 pb-1 text-emerald-800">
                                {i + 1}. {a} x {b} = {a * b}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-emerald-100 rounded text-xs text-emerald-900">
                        <strong>{String.fromCodePoint(0x2705)}</strong> {getTrans('answerKey.studyTipText', 'Practice saying these facts out loud daily. Try to answer faster each time!')}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function MultiplicationWindowArrays({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mult-arrays'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)

    const problems = Array.from({ length: 4 }, () => {
        const rows = Math.floor(rng() * 4) + 2 // 2-5 rows
        const cols = Math.floor(rng() * 5) + 2 // 2-6 cols
        return { rows, cols, product: rows * cols }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="City Builder: Window Arrays"
            emoji={String.fromCodePoint(0x2716)}
            description="Count the rows and columns of windows to find the total product."
            problemCount={4}
            learningObjectives={[
                'Understand multiplication as repeated addition',
                'Visualize arrays (rows x columns)',
                'Write multiplication sentences'
            ]}
            parentTeacherTips={[
                'Rows go side to side (like a row in a movie theater).',
                'Columns go up and down (like a building column).',
                'Count by skip counting the rows!'
            ]}
        >
            <div className="print:hidden h-1 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-gradient-x mb-4" />

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

export function TimesTableVertical({ seed, variant, showAnswersForDoc, docId, range }: TimesTableProps) {
    const { t } = useWorksheetTranslation(docId)
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

    const problemCount = range[1] > 9 ? 16 : 12
    const facts: Array<[number, number]> = Array.from({ length: problemCount }).map(() => {
        const a = nextInt(range[0], range[1])
        const b = nextInt(range[0], range[1])
        return [a, b]
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t('title')}
            emoji={String.fromCodePoint(0x2716)}
            description={t('description')}
            problemCount={facts.length}
            learningObjectives={t('learningObjectives', [])}
            parentTeacherTips={t('parentTeacherTips', [])}
        >
            <div className={`print:hidden h-1 w-16 rounded-full bg-gradient-to-r ${range[0] === 1 ? 'from-green-400 to-emerald-400' : range[0] === 6 ? 'from-purple-400 to-pink-400' : 'from-indigo-400 to-purple-400'} animate-gradient-x mb-2`} />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)} {t('example.header', 'Example')}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base mb-2">
                        <div className="text-right">{range[0] === 1 ? 4 : range[0] === 6 ? 8 : 9}</div>
                        <div className="flex items-center">
                            <span className="mr-2">{String.fromCodePoint(0x279C)}</span>
                            <span className="flex-1 text-right">{range[0] === 1 ? 3 : range[0] === 6 ? 7 : 8}</span>
                        </div>
                        <div className="border-t-2 border-slate-600 mt-1 pt-1">{range[0] === 1 ? 12 : range[0] === 6 ? 56 : 72}</div>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{t('example.step1', 'Step 1:')}</strong> {t('example.step1Text', 'Multiply the numbers')}</div>
                        <div><strong>{t('example.step2', 'Step 2:')}</strong> {t('example.step2Text', 'Write the answer below the line')}</div>
                        <div className="font-semibold text-blue-900"><strong>{t('example.answer', 'Answer:')}</strong> {range[0] === 1 ? 12 : range[0] === 6 ? 56 : 72}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {facts.map(([a, b], i) => (
                    <div key={i} className="border-2 border-slate-300 rounded-lg p-4 bg-white break-inside-avoid">
                        <div className="font-mono text-2xl leading-7">
                            <div className="text-right mb-1">{a}</div>
                            <div className="flex items-center mb-1">
                                <span className="mr-2">{String.fromCodePoint(0x279C)}</span>
                                <span className="flex-1 text-right">{b}</span>
                            </div>
                            <div className="border-t-[3px] border-slate-600 mt-2 pt-3 h-14 print:h-16 flex items-center justify-end">
                                <span className="inline-block w-full h-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)} {t('challenge.header', 'Challenge')}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    {t('challenge.items', [
                        'Create your own vertical multiplication problem',
                        'Write all the facts that equal 12 in vertical format',
                        `Time yourself: Can you complete all ${facts.length} problems in under 2 minutes?`
                    ]).map((item: string, i: number) => (
                        <div key={i}>{i + 1}. {item}</div>
                    ))}
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)} {t('selfAssessment.header', 'Self Assessment')}</div>
                <div className="space-y-2 text-xs">
                    {t('selfAssessment.items', [
                        `I can multiply numbers ${range[0]}-${range[1]} in vertical format`,
                        'I can align numbers correctly',
                        'I can say the answers quickly (fluency)'
                    ]).map((item: string, i: number) => (
                        <div key={i}>{String.fromCharCode(0x2610)} {item}</div>
                    ))}
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('selfAssessment.score', 'My score:')}</strong> ___ / {facts.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('selfAssessment.factsToPractice', 'Facts I want to practice more:')}</strong> _________________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} {t('answerKey.header', 'Answer Key')}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {facts.map(([a, b], i) => (
                            <div key={i} className="border-b border-emerald-200 pb-1 text-emerald-800">
                                {i + 1}. {a} x {b} = {a * b}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-emerald-100 rounded text-xs text-emerald-900">
                        <strong>{String.fromCodePoint(0x2705)}</strong> {t('answerKey.studyTipText', 'Great job practicing vertical format! Keep practicing to build speed and accuracy!')}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

export function TimesTableMissing({ seed, variant, showAnswersForDoc, docId, range }: TimesTableProps) {
    const { t } = useWorksheetTranslation(docId)
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

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t('title')}
            emoji={String.fromCodePoint(0x2716)}
            description={t('description')}
            problemCount={problems.length}
            learningObjectives={t('learningObjectives', [])}
            parentTeacherTips={t('parentTeacherTips', [])}
        >
            <div className={`print:hidden h-1 w-16 rounded-full bg-gradient-to-r ${range[0] === 1 ? 'from-amber-400 to-orange-400' : 'from-purple-400 to-pink-400'} animate-gradient-x mb-2`} />

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)} {t('example.header', 'Example')}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base"><strong>{t('example.problem', 'Problem:')}</strong> ? x 3 = 12</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>{t('example.step1', 'Step 1:')}</strong> {t('example.step1Text', 'Ask: "What times 3 equals 12?"')}</div>
                        <div><strong>{t('example.step2', 'Step 2:')}</strong> {t('example.step2Text', 'Use multiplication facts or division')}</div>
                        <div className="font-semibold text-blue-900"><strong>{t('example.answer', 'Answer:')}</strong> 4</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((p, i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white text-center break-inside-avoid">
                        <div className="font-mono text-xl leading-7">
                            {p.missingType === 'a' ? <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1 bg-slate-50" /> : p.a}
                            {String.fromCharCode(0x00D7)}
                            {p.missingType === 'b' ? <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1 bg-slate-50" /> : p.b}
                            =
                            {p.missingType === 'answer' ? <span className="inline-block w-12 h-8 border-b-[3px] border-slate-600 mx-1 bg-slate-50" /> : p.answer}
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)} {t('challenge.header', 'Challenge')}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    {t('challenge.items', [
                        'Create your own missing number problem',
                        `Write all the facts that equal ${range[0] === 1 ? 12 : 56}`,
                        'Solve: ? x ? = ? (create a full equation)'
                    ]).map((item: string, i: number) => (
                        <div key={i}>{i + 1}. {item}</div>
                    ))}
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)} {t('selfAssessment.header', 'Self Assessment')}</div>
                <div className="space-y-2 text-xs">
                    {t('selfAssessment.items', [
                        'I can find missing numbers in multiplication',
                        'I understand the relationship between multiplication and division',
                        'I can solve all types of missing number problems'
                    ]).map((item: string, i: number) => (
                        <div key={i}>{String.fromCharCode(0x2610)} {item}</div>
                    ))}
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('selfAssessment.score', 'My score:')}</strong> ___ / {problems.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('selfAssessment.factsToPractice', 'Facts I want to practice more:')}</strong> _________________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => {
                const answers = problems.map((p) => {
                    if (p.missingType === 'answer') {
                        return { a: p.a!, b: p.b!, answer: p.a! * p.b! };
                    } else if (p.missingType === 'b' && p.a !== undefined && p.answer !== undefined) {
                        return { a: p.a, b: p.answer / p.a, answer: p.answer };
                    } else if (p.missingType === 'a' && p.b !== undefined && p.answer !== undefined) {
                        return { a: p.answer / p.b, b: p.b, answer: p.answer };
                    }
                    return { a: 1, b: 1, answer: 1 }; // fallback
                });
                return (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCharCode(0x2705)} {t('answerKey.header', 'Answer Key')}</div>
                        <div className="space-y-2 text-sm">
                            {answers.map((ans, i) => {
                                const p = problems[i];
                                let explanation = '';
                                if (p.missingType === 'answer') {
                                    explanation = `${ans.a} x ${ans.b} = ${ans.answer}`;
                                } else if (p.missingType === 'b') {
                                    explanation = `${ans.a} x ${ans.b} = ${ans.answer} (${ans.answer} / ${ans.a} = ${ans.b})`;
                                } else {
                                    explanation = `${ans.a} x ${ans.b} = ${ans.answer} (${ans.answer} / ${ans.b} = ${ans.a})`;
                                }
                                return (
                                    <div key={i} className="border-b border-emerald-200 pb-1 text-emerald-800">
                                        {i + 1}. {explanation}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 p-3 bg-emerald-100 rounded text-xs text-emerald-900">
                            <strong>{String.fromCodePoint(0x2705)}</strong> {t('answerKey.studyTipText', 'Missing number problems help you understand multiplication and division are related!')}
                        </div>
                    </div>
                );
            })}
        </WorksheetSectionWrapper>
    )
}

export function MultiplicationPatterns({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mult-patterns'
    const doc = docId
    const rng = makeRng(`${seed}|v${variant}|doc=${doc}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    // Generate 4 distinct pattern problems
    const patterns = Array.from({ length: 4 }).map((_, i) => {
        // Base number (e.g. 2 in "2 x 1", "2 x 2")
        const base = nextInt(2, 9);

        // Step for the multiplier (e.g. 1 for 1,2,3,4,5. 2 for 2,4,6,8,10)
        const step = nextInt(1, 3);

        // Start multiplier
        const start = nextInt(1, 4);

        // Generate 5 items in the sequence
        const items = Array.from({ length: 5 }).map((_, j) => {
            const mult = start + (j * step);
            return {
                eq: `${base} × ${mult}`,
                val: base * mult,
                hidden: j >= 3 // Hide answers for the last 2
            };
        });

        // Pattern description for the answer key
        const increment = base * step;
        const description = `Add ${increment} each time`;

        return { items, description, base, step };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Multiplication Patterns')}
            emoji={String.fromCodePoint(0x2716)}
            description={t(`worksheets.${docId}.description`, 'Identify and extend the multiplication patterns. What do you notice?')}
            problemCount={patterns.length}
            learningObjectives={[
                'Identify patterns in multiplication tables',
                'Extend multiplication patterns',
                'Recognize how numbers change in patterns'
            ]}
            parentTeacherTips={[
                'Look for what stays the same and what changes',
                'Patterns help students memorize multiplication facts',
                'Encourage students to describe patterns in their own words',
                'Extension: Create your own multiplication patterns'
            ]}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
            {/* Worked Example */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>{t('common.pattern', 'Pattern:')}</strong> {String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at what changes: the second number goes 1, 2, 3, 4, 5</div>
                        <div><strong>Step 2:</strong> Look at the answers: 4, 8, 12... they increase by 4 each time!</div>
                        <div><strong>Step 3:</strong> {String.fromCodePoint(0x279C)} Fill in the blanks</div>
                        <div className="font-semibold text-blue-900"><strong>Pattern:</strong> Add 4 each time</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                    </div>
                </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <strong>{String.fromCodePoint(0x1F4A1)}</strong> Look at each pattern. Fill in the missing numbers and describe what pattern you notice.
            </div>

            <div className="space-y-5 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {patterns.map((item, idx) => (
                    <div key={idx} className="border-2 border-slate-300 rounded-lg p-5 bg-white break-inside-avoid">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            {item.items.map((part, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="text-base font-mono text-slate-800 whitespace-nowrap">{part.eq} =</span>
                                    {!part.hidden ? (
                                        <span className="text-base font-mono font-semibold text-slate-900">{part.val}</span>
                                    ) : (
                                        <span className="inline-block w-16 h-10 print:w-20 print:h-12 border-b-[3px] border-slate-600 align-middle" />
                                    )}
                                    {i < item.items.length - 1 && <span className="text-slate-400 mx-1">,</span>}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3">
                            <div className="text-sm font-semibold text-slate-600 mb-1">What pattern do you notice?</div>
                            <div className="min-h-12 print:min-h-16 border-2 border-dashed border-slate-400 rounded p-2 bg-slate-50 print:bg-white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Extension/Challenge Problems */}
            <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                <div className="space-y-2 text-sm text-purple-800">
                    <div>1. Create your own pattern where you multiply by 5</div>
                    <div>2. Can you find a pattern where numbers double each time?</div>
                    <div>3. Can you find a pattern where the answers decrease? (Hint: think about division)</div>
                </div>
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCharCode(0x2610)} I can identify patterns in multiplication</div>
                    <div>{String.fromCharCode(0x2610)} I can extend patterns to find missing numbers</div>
                    <div>{String.fromCharCode(0x2610)} I can describe patterns in my own words</div>
                </div>
                <div className="mt-3 text-xs">
                    <strong>{t('common.myScore', 'My score:')}</strong> ___ / {patterns.length}
                </div>
                <div className="mt-2 text-xs">
                    <strong>{t('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} Answer Key</div>
                    <div className="space-y-4">
                        {patterns.map((item, idx) => (
                            <div key={idx} className="border-b border-emerald-200 pb-3 last:border-b-0">
                                <div className="font-semibold text-sm mb-1 text-emerald-900">Pattern {idx + 1}:</div>
                                <div className="text-xs text-emerald-800 space-y-1 pl-4">
                                    <div className="flex flex-wrap gap-2">
                                        {item.items.map((part, i) => (
                                            <span key={i} className={part.hidden ? "font-bold bg-emerald-100 px-1 rounded" : ""}>
                                                {part.eq} = {part.val}{i < item.items.length - 1 ? "," : ""}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-1 font-semibold text-emerald-700">
                                        Rule: {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
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
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-mono text-base"><strong>{getTrans('example.problem', 'Problem:')}</strong>{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Quick method:</strong>{String.fromCodePoint(0x279C)}</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> {is1To12 ? 72 : (is6To12 ? 56 : 12)}</div>
                        <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
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
            // Complex: Larger numbers (2-digit x 1-digit)
            const groups = nextInt(12, 19);
            const inEach = nextInt(3, 9);
            return {
                text: `There are ${groups} ${item.containerPlural}. Each ${item.container.replace(/s$/, '')} holding ${inEach} ${item.name}. How many ${item.name} are there altogether?`,
                step1: `Multiply ${groups} by ${inEach}`,
                answer: groups * inEach,
                answerUnit: item.name,
                equation: `${groups} × ${inEach} = ${groups * inEach}`
            };
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

    if (difficulty === 'multi-step') {
        defaultTitle = 'Multi-Step Word Problems';
        defaultDesc = 'Two-step problems involving multiplication and addition/subtraction.';
        emoji = String.fromCodePoint(0x1F9E9); // Puzzle
    } else if (difficulty === 'complex') {
        defaultTitle = 'Complex Multiplication Problems';
        defaultDesc = 'Challenging word problems with larger numbers.';
        emoji = String.fromCodePoint(0x1F4AA); // Flexed bicep
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', defaultTitle)}
            emoji={emoji}
            description={getTrans('description', defaultDesc)}
            problemCount={problems.length}
        >
            <div className="grid grid-cols-1 gap-6 break-inside-avoid">
                {problems.map((prob, i) => (
                    <div key={i} className="break-inside-avoid p-4 border border-slate-300 rounded-lg bg-white shadow-sm print:shadow-none" style={{ pageBreakInside: 'avoid' }}>
                        <div className="flex gap-4">
                            <div className="bg-slate-100 text-slate-600 font-bold w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 text-sm">
                                {i + 1}
                            </div>
                            <div className="flex-grow">
                                <div className="text-lg mb-4 text-slate-800 leading-normal">{prob.text}</div>

                                <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-lg h-32 bg-slate-50 relative">
                                    <div className="absolute top-2 left-2 text-xs text-slate-400 uppercase tracking-widest font-semibold pointer-events-none">Show your work</div>
                                </div>

                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <span className="font-semibold text-slate-700">Answer:</span>
                                    <div className="w-32 border-b-2 border-slate-400"></div>
                                    <span className="text-slate-500 text-sm">{prob.answerUnit}</span>
                                </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {problems.map((prob, i) => (
                            <div key={i} className="p-3 border border-emerald-200 rounded bg-white">
                                <div className="font-bold text-emerald-800 mb-1">Problem {i + 1}</div>
                                <div className="text-sm text-slate-600 mb-2">{prob.text}</div>
                                <div className="space-y-1 text-sm bg-emerald-50 p-2 rounded">
                                    {prob.step1 && <div className="text-emerald-700 font-mono">Step 1: {prob.step1}</div>}
                                    {prob.step2 && <div className="text-emerald-700 font-mono">Step 2: {prob.step2}</div>}
                                    <div className="font-bold text-emerald-900 mt-1 border-t border-emerald-200 pt-1">
                                        Answer: {prob.answer} {prob.answerUnit}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
