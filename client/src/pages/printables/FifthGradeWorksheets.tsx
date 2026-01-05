/** @jsxImportSource react */
import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared';

type ReactNode = React.ReactNode;

interface SpecificWorksheetProps {
    seed: string;
    variant: number;
    showAnswersForDoc: (docId: string, render: () => ReactNode) => ReactNode;
    docId?: string;
}

/**
 * Powers of 10 Worksheet
 * Multiplaying and dividing decimals and whole numbers by 10, 100, 1000
 */
export function PowersOf10({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const docId = 'powers-of-10';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 12 }, () => {
        const base = nextInt(1, 1000) / (rng() > 0.5 ? 10 : 100);
        const power = [10, 100, 1000][nextInt(0, 2)];
        const isMult = rng() > 0.5;

        let answer;
        if (isMult) {
            answer = base * power;
        } else {
            answer = base / power;
        }

        return {
            base: base.toFixed(2).replace(/\.?0+$/, ''),
            power,
            isMult,
            answer: answer.toFixed(5).replace(/\.?0+$/, ''),
            id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Powers of 10: Space Shift"
            emoji="🚀"
            description="Shift the decimal point! Master multiplication and division by powers of ten."
            problemCount={problems.length}
            learningObjectives={[
                'Understand decimal place value patterns',
                'Multiply decimals by 10, 100, and 1000',
                'Divide decimals by 10, 100, and 1000'
            ]}
            parentTeacherTips={[
                'Multiplication shifts the decimal RIGHT.',
                'Division shifts the decimal LEFT.',
                'The number of zeros tells you how many places to move.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Decimal Launch Pad"
                subtitle="Mission Control: Shift the decimal for safe orbit!"
                icons={{
                    bg1: '🛰️',
                    bg2: '🛸',
                    float1: '✨',
                    float2: '💫'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <StrategySpotlight
                title="The Zero Rule"
                icon="⚡"
                color="purple"
                steps={[
                    { label: 'Multiply (×)', text: 'Move the decimal RIGHT (bigger number).' },
                    { label: 'Divide (÷)', text: 'Move the decimal LEFT (smaller number).' },
                    { label: 'How far?', text: 'The number of zeros in 10, 100, or 1000 tells you how many places.' }
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white relative overflow-hidden group shadow-sm hover:border-indigo-300 transition-all break-inside-avoid">
                        <div className="absolute top-2 right-3 text-[10px] font-black text-slate-300">#{i + 1}</div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-mono font-black text-slate-800 tracking-tight">
                                    {p.base} <span className="text-indigo-500 font-bold">{p.isMult ? '×' : '÷'}</span> {p.power}
                                </div>
                            </div>

                            {/* Base 10 Visualizer */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative h-20 flex items-center justify-center">
                                <div className="flex items-center gap-1 font-mono text-lg text-slate-400 opacity-40">
                                    {Array.from(p.base.replace('.', '')).map((digit, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center bg-white">{digit}</div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg ${p.isMult ? 'animate-bounce-h-right' : 'animate-bounce-h-left'}`}>
                                        {p.isMult ? 'Shift Right →' : '← Shift Left'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Final Position:</div>
                                <div className="flex-1 h-12 bg-white border-b-4 border-indigo-200 border-2 border-indigo-50 rounded-xl flex items-center px-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl print:bg-white">
                    <h3 className="text-lg font-bold text-emerald-900 mb-4">Command Center: Mission Solutions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b border-emerald-100 pb-1">
                                <span>{p.base} {p.isMult ? '×' : '÷'} {p.power}</span>
                                <span className="font-bold text-emerald-700">{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Rounding Decimals
 */
export function RoundingDecimals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const docId = 'rounding-decimals';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const places = [
        { name: 'nearest whole number', value: 0 },
        { name: 'nearest tenth', value: 1 },
        { name: 'nearest hundredth', value: 2 }
    ];

    const problems = Array.from({ length: 12 }, () => {
        const num = (rng() * 100).toFixed(3);
        const target = places[nextInt(0, 2)];
        const answer = Number(num).toFixed(target.value);

        return {
            num,
            targetName: target.name,
            answer,
            id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Rounding Decimals: Precision Peak"
            emoji="🎯"
            description="Round decimal numbers to the nearest whole number, tenth, or hundredth."
            problemCount={problems.length}
            learningObjectives={[
                'Identify decimal place values',
                'Apply rounding rules to decimals',
                'Compare decimal values before and after rounding'
            ]}
            parentTeacherTips={[
                'Look at the digit to the RIGHT of the target place.',
                '5 or more? Round UP.',
                '4 or less? Keep it the SAME.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Rounding Range"
                subtitle="Bring the decimals home to the right place!"
                icons={{
                    bg1: '🏔️',
                    bg2: '🎯',
                    float1: '❄️',
                    float2: '☁️'
                }}
                colors={{
                    bg: 'bg-blue-900',
                    border: 'border-blue-700',
                    pillBg: 'bg-blue-800',
                    pillBorder: 'border-blue-600',
                    pillText: 'text-blue-50',
                    accent: 'text-blue-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-4 bg-white flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-mono font-bold text-slate-800">{p.num}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Round to {p.targetName}</span>
                        </div>
                        <div className="w-32 border-b-2 border-slate-300 h-10 mr-4"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl print:bg-white">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Precision Log: Rounding Solutions</h3>
                    <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b border-blue-100 pb-1">
                                <span>{p.num} ({p.targetName.split(' ').pop()})</span>
                                <span className="font-bold text-blue-700">{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Estimating Sums & Differences
 */
export function EstimatingSumsDifferences({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const docId = 'estimating-sums-differences';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 8 }, () => {
        const n1 = (rng() * 100).toFixed(1);
        const n2 = (rng() * 100).toFixed(1);
        const isSum = rng() > 0.5;

        // Nearest whole number estimation
        const e1 = Math.round(Number(n1));
        const e2 = Math.round(Number(n2));
        const est = isSum ? e1 + e2 : e1 - e2;

        return {
            n1, n2, isSum, est, e1, e2,
            id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Estimating Sums & Differences"
            emoji="🧮"
            description="Estimate answers by rounding decimals to the nearest whole number before calculating."
            problemCount={problems.length}
            learningObjectives={[
                'Estimate sums and differences of decimals',
                'Round to the nearest whole number for estimation',
                'Evaluate the reasonableness of calculations'
            ]}
            parentTeacherTips={[
                'Round each number BEFORE adding or subtracting.',
                'Why estimate? To check if your final answer makes sense!',
                'Think of money: $5.90 is about $6.00.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Estimate Expedition"
                subtitle="Quick math for the jungle trek! Close counts!"
                icons={{
                    bg1: '🏕️',
                    bg2: '🧮',
                    float1: '🍃',
                    float2: '🔥'
                }}
                colors={{
                    bg: 'bg-yellow-900',
                    border: 'border-yellow-700',
                    pillBg: 'bg-yellow-800',
                    pillBorder: 'border-yellow-600',
                    pillText: 'text-yellow-50',
                    accent: 'text-yellow-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold font-mono">{p.n1} {p.isSum ? '+' : '-'} {p.n2}</span>
                            <span className="text-xs text-slate-400">ID: {p.id}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-8 bg-slate-50 border border-dashed border-slate-300 rounded flex items-center justify-center text-xs text-slate-400">Round 1</div>
                                <div className="text-lg">{p.isSum ? '+' : '-'}</div>
                                <div className="w-24 h-8 bg-slate-50 border border-dashed border-slate-300 rounded flex items-center justify-center text-xs text-slate-400">Round 2</div>
                            </div>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="text-sm font-bold text-slate-600">Estimate:</div>
                                <div className="flex-1 h-10 bg-yellow-50 border-2 border-yellow-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-yellow-900 mb-4">Explorer's Key: Estimation Guide</h3>
                    <div className="grid grid-cols-2 gap-4 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="border-b border-yellow-100 pb-1">
                                {p.n1}({p.e1}) {p.isSum ? '+' : '-'} {p.n2}({p.e2}) = <strong>{p.est}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Evaluating Expressions
 * Order of Operations with nested groupings
 */
export function EvaluatingExpressions({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'evaluating-expressions';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 8 }, () => {
        const a = nextInt(2, 10);
        const b = nextInt(2, 6);
        const c = nextInt(2, 5);
        const d = nextInt(1, 4);

        // [a + (b * c)] - d
        const expr = `[${a} + (${b} × ${c})] - ${d}`;
        const result = (a + (b * c)) - d;

        // Or: a * [b + (c - d)]
        const isAlt = rng() > 0.5;
        if (isAlt) {
            const e = nextInt(5, 12);
            const f = nextInt(2, 5);
            const g = nextInt(1, 3);
            const h = nextInt(2, 4);
            return {
                expr: `${h} × [${e} - (${f} + ${g})]`,
                result: h * (e - (f + g)),
                id: nextInt(100, 999)
            };
        }

        return {
            expr, result, id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Evaluating Expressions: Level Up!"
            emoji="🧬"
            description="Solve numerical expressions using parentheses, brackets, and the order of operations."
            problemCount={problems.length}
            learningObjectives={[
                'Use parentheses and brackets in expressions',
                'Solve multi-step numerical expressions',
                'Follow GEMDAS (Groupings first!)'
            ]}
            parentTeacherTips={[
                'Start with the innermost parentheses ( )',
                'Move to the outer brackets [ ]',
                'Then solve the rest following standard PEMDAS rules.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Expression Engine"
                subtitle="Inside-Out! Break the brackets to reveal the power!"
                icons={{
                    bg1: '⚙️',
                    bg2: '🧬',
                    float1: '🔌',
                    float2: '🔋'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <div className="space-y-10 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-sm hover:border-indigo-400 transition-all break-inside-avoid relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-1 rounded-bl-2xl font-black text-xs uppercase tracking-widest shadow-md">
                            Logic Flow #{i + 1}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Expression Header */}
                            <div className="lg:col-span-4 flex flex-col justify-center gap-2">
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1">Target Expression</div>
                                <div className="text-3xl font-mono font-black text-slate-800 tracking-tighter">
                                    {p.expr}
                                </div>
                            </div>

                            {/* Logic Flowchart */}
                            <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-between gap-4 py-4 relative">
                                {/* Flow Lines (Desktop) */}
                                <div className="hidden md:block absolute top-[50%] left-0 right-0 h-0.5 bg-slate-100 -z-10" />

                                {[1, 2, 3].map(step => (
                                    <div key={step} className="flex flex-col items-center gap-3 group">
                                        <div className={`w-8 h-8 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors z-10 shadow-sm`}>
                                            {step}
                                        </div>
                                        {step < 3 ? (
                                            <div className="w-32 h-14 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl relative flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50/50 transition-all">
                                                <div className="text-[8px] font-bold text-slate-300 uppercase italic">Partial Value</div>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-16 bg-indigo-900 border-2 border-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-1 group-hover:rotate-0 transition-transform">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Final Core</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connection Arrows (Mobile Hidden) */}
                        <div className="hidden lg:flex justify-around absolute bottom-4 left-[33%] right-[20%] text-slate-200 pointer-events-none">
                            <span className="text-xl">➔</span>
                            <span className="text-xl">➔</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl print:bg-white font-mono text-sm">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4">Engine Log: Final Outputs</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b border-indigo-100 pb-1">
                                <span>{p.expr}</span>
                                <span className="font-bold text-indigo-700">{p.result}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Solving One-Step Equations
 */
export function SolvingOneStepEquations({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'solving-one-step-equations';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const variables = ['x', 'y', 'n', 'a', 'b', 'k'];

    const problems = Array.from({ length: 12 }, () => {
        const v = variables[nextInt(0, variables.length - 1)];
        const type = nextInt(0, 3); // 0: add, 1: sub, 2: mult, 3: div
        let eq, answer;

        if (type === 0) {
            const a = nextInt(5, 50);
            const res = nextInt(60, 100);
            eq = `${v} + ${a} = ${res}`;
            answer = res - a;
        } else if (type === 1) {
            const a = nextInt(5, 30);
            const res = nextInt(2, 20);
            eq = `${v} - ${a} = ${res}`;
            answer = res + a;
        } else if (type === 2) {
            const a = nextInt(2, 9);
            const ans = nextInt(2, 12);
            eq = `${a}${v} = ${a * ans}`;
            answer = ans;
        } else {
            const ans = nextInt(2, 12);
            const div = nextInt(2, 5);
            eq = `${v} / ${div} = ${ans}`;
            answer = ans * div;
        }

        return { eq, answer, var: v, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Solving Equations: Variable Vault"
            emoji="🗝️"
            description="Find the missing value! Solve one-step equations involving addition, subtraction, multiplication, and division."
            problemCount={problems.length}
            learningObjectives={[
                'Understand variables as unknown values',
                'Solve one-step algebraic equations',
                'Apply inverse operations'
            ]}
            parentTeacherTips={[
                'Goal: Get the variable by itself!',
                'Opposites attract: Undo addition with subtraction, and multiplication with division.',
                'Keep it balanced: Whatever you do to one side, you MUST do to the other!'
            ]}
        >
            <PremiumWorksheetBanner
                title="The X-Files"
                subtitle="Decode the secret numbers hidden in the vault!"
                icons={{
                    bg1: '🔐',
                    bg2: '🗝️',
                    float1: '📁',
                    float2: '🕵️'
                }}
                colors={{
                    bg: 'bg-emerald-900',
                    border: 'border-emerald-700',
                    pillBg: 'bg-emerald-800',
                    pillBorder: 'border-emerald-600',
                    pillText: 'text-emerald-50',
                    accent: 'text-emerald-400'
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
                        <div className="text-xl font-mono font-bold text-slate-800 text-center">{p.eq}</div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                            <span className="font-bold text-emerald-600">{p.var} =</span>
                            <div className="flex-1 h-8 bg-slate-50 border border-slate-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl print:bg-white font-mono text-sm">
                    <h3 className="text-lg font-bold text-emerald-900 mb-4">Vault Master Key: Solutions</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b border-emerald-100 pb-1">
                                <span>{p.var} in #{i + 1}</span>
                                <span className="font-bold text-emerald-700">{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Patterns & Rules
 */
export function PatternsRules({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'patterns-rules';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 4 }, () => {
        const startX = nextInt(0, 10);
        const stepX = nextInt(2, 5);
        const startY = nextInt(0, 10);
        const stepY = nextInt(3, 8);

        const table = Array.from({ length: 5 }, (_, i) => ({
            x: startX + (i * stepX),
            y: startY + (i * stepY)
        }));

        return {
            ruleX: `Add ${stepX}`,
            ruleY: `Add ${stepY}`,
            table,
            id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Patterns & Rules: Data Detectives"
            emoji="🕵️"
            description="Compare numerical patterns and identify rules between two sequences of numbers."
            problemCount={problems.length}
            learningObjectives={[
                'Generate two numerical patterns using two given rules',
                'Identify relationships between corresponding terms',
                'Record patterns in a table'
            ]}
            parentTeacherTips={[
                'Work across the table: How does X relate to Y?',
                'Look for the common difference in each column.',
                'Rule 1 might be "Add 2" while Rule 2 is "Add 4". What do you notice?'
            ]}
        >
            <PremiumWorksheetBanner
                title="Pattern Pursuit"
                subtitle="Crack the code! Follow the rules to complete the mission."
                icons={{
                    bg1: '🔍',
                    bg2: '🕵️',
                    float1: '👣',
                    float2: '🎯'
                }}
                colors={{
                    bg: 'bg-slate-900',
                    border: 'border-slate-700',
                    pillBg: 'bg-slate-800',
                    pillBorder: 'border-slate-600',
                    pillText: 'text-slate-50',
                    accent: 'text-slate-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1 bg-blue-50 p-2 rounded text-xs text-blue-700 font-bold border border-blue-100">Pattern X: {p.ruleX}</div>
                            <div className="flex-1 bg-purple-50 p-2 rounded text-xs text-purple-700 font-bold border border-purple-100">Pattern Y: {p.ruleY}</div>
                        </div>

                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-2 border-slate-200 p-2 bg-slate-50 text-slate-700">X</th>
                                    <th className="border-2 border-slate-200 p-2 bg-slate-50 text-slate-700">Y</th>
                                </tr>
                            </thead>
                            <tbody>
                                {p.table.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="border-2 border-slate-200 p-2 text-center font-mono">
                                            {idx < 3 ? row.x : <div className="h-6 w-12 bg-slate-50 mx-auto rounded border border-dashed border-slate-200"></div>}
                                        </td>
                                        <td className="border-2 border-slate-200 p-2 text-center font-mono">
                                            {idx < 3 ? row.y : <div className="h-6 w-12 bg-slate-50 mx-auto rounded border border-dashed border-slate-200"></div>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pt-2">
                            <p className="text-xs text-slate-500 mb-2 italic">What relationship do you see between X and Y?</p>
                            <div className="h-10 border-b-2 border-slate-200"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-slate-50 border-2 border-slate-200 rounded-xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Case Closed: Pattern Key</h3>
                    <div className="grid grid-cols-2 gap-8">
                        {problems.map((p, i) => (
                            <div key={i} className="font-mono">
                                <p className="font-bold border-b mb-2">Pattern #{i + 1}</p>
                                {p.table.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 border-b border-slate-100 pb-0.5">
                                        <span>X: {row.x}</span>
                                        <span>Y: {row.y}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Adding & Subtracting Mixed Numbers
 */
export function AddSubMixedNumbers({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'add-sub-mixed-numbers';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 6 }, () => {
        const den = [2, 3, 4, 5, 6, 8, 10, 12][nextInt(0, 7)];
        const w1 = nextInt(1, 5);
        const n1 = nextInt(1, den - 1);
        const w2 = nextInt(1, 4);
        const n2 = nextInt(1, den - 1);

        const isSum = rng() > 0.4; // Slightly more sums

        // Simple case: same denominator for now, or easily compatible
        let answerW, answerN, answerD = den;
        if (isSum) {
            answerW = w1 + w2;
            answerN = n1 + n2;
            if (answerN >= den) {
                answerW += Math.floor(answerN / den);
                answerN = answerN % den;
            }
        } else {
            // Handle borrowing
            let bn1 = n1;
            let bw1 = w1;
            if (n1 < n2) {
                bw1 -= 1;
                bn1 += den;
            }
            // Ensure result is positive for 5th grade usually unless negative numbers are target
            if (bw1 < w2) {
                // swap or adjust
                answerW = w2 - bw1;
                answerN = n2 - bn1;
            } else {
                answerW = bw1 - w2;
                answerN = bn1 - n2;
            }
        }

        return {
            w1, n1, w2, n2, den, isSum,
            ansW: answerW, ansN: answerN, ansD: den
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Mixed Number Mountain"
            emoji="🏔️"
            description="Add and subtract mixed numbers with like denominators. Practice regrouping and borrowing."
            problemCount={problems.length}
            learningObjectives={[
                'Add mixed numbers with like denominators',
                'Subtract mixed numbers with like denominators',
                'Regroup fractions into whole numbers'
            ]}
            parentTeacherTips={[
                'Add the whole numbers first, then the fractions.',
                'If the fraction is > 1, regroup it!',
                'Borrowing: Take 1 from the whole number and add the denominator to the numerator.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Summit Success"
                subtitle="Climb the peaks by combining and comparing whole counts!"
                icons={{
                    bg1: '⛷️',
                    bg2: '🏔️',
                    float1: '❄️',
                    float2: '🌲'
                }}
                colors={{
                    bg: 'bg-slate-900',
                    border: 'border-slate-700',
                    pillBg: 'bg-slate-800',
                    pillBorder: 'border-slate-600',
                    pillText: 'text-slate-50',
                    accent: 'text-slate-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col gap-4 p-6 border-2 border-slate-100 rounded-2xl bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rotate-45 translate-x-10 -translate-y-10 border-b border-slate-200"></div>
                        <div className="text-3xl font-serif flex items-center gap-4 text-slate-800">
                            <div className="flex items-center">
                                <span className="text-4xl mr-1">{p.w1}</span>
                                <div className="flex flex-col items-center text-lg">
                                    <span className="border-b border-slate-800 px-1">{p.n1}</span>
                                    <span>{p.den}</span>
                                </div>
                            </div>
                            <span className="text-2xl text-slate-400">{p.isSum ? '+' : '-'}</span>
                            <div className="flex items-center">
                                <span className="text-4xl mr-1">{p.w2}</span>
                                <div className="flex flex-col items-center text-lg">
                                    <span className="border-b border-slate-800 px-1">{p.n2}</span>
                                    <span>{p.den}</span>
                                </div>
                            </div>
                            <span className="text-2xl text-slate-400 ml-2">=</span>
                        </div>
                        <div className="h-16 w-full border-b-2 border-slate-200 border-dashed mt-4 bg-slate-50/30 rounded"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-slate-900 text-white rounded-3xl print:bg-white print:text-black print:border-2 print:border-slate-200">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-emerald-400">★</span> Summit Key: Master Solutions
                    </h3>
                    <div className="grid grid-cols-2 gap-8 font-serif">
                        {problems.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-slate-700 pb-4 print:border-slate-200 text-xl">
                                <span className="text-slate-500 text-sm">#{i + 1}</span>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-1">{p.ansW}</span>
                                    {p.ansN > 0 && (
                                        <div className="flex flex-col items-center text-sm">
                                            <span className="border-b border-white print:border-black px-1">{p.ansN}</span>
                                            <span>{p.ansD}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Multiplying Fractions
 */
export function MultiplyingFractions({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'multiplying-fractions';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 8 }, () => {
        const n1 = nextInt(1, 5);
        const d1 = nextInt(n1 + 1, 10);
        const n2 = nextInt(1, 5);
        const d2 = nextInt(n2 + 1, 10);

        const ansN = n1 * n2;
        const ansD = d1 * d2;

        return { n1, d1, n2, d2, ansN, ansD };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fraction Factory: Multiply & Grow"
            emoji="🏗️"
            description="Multiply two fractions. Remember: Across the top, across the bottom!"
            problemCount={problems.length}
            learningObjectives={[
                'Multiply numerators together',
                'Multiply denominators together',
                'Understand area models of fraction multiplication'
            ]}
            parentTeacherTips={[
                'Numerators multiply with numerators.',
                'Denominators multiply with denominators.',
                'Think "of": 1/2 OF 1/4 means 1/2 times 1/4.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Assembly Line"
                subtitle="Piece them together! Multiply to build the final product."
                icons={{
                    bg1: '⛓️',
                    bg2: '🏗️',
                    float1: '📦',
                    float2: '⚙️'
                }}
                colors={{
                    bg: 'bg-blue-900',
                    border: 'border-blue-700',
                    pillBg: 'bg-blue-800',
                    pillBorder: 'border-blue-600',
                    pillText: 'text-blue-50',
                    accent: 'text-blue-400'
                }}
            />

            <div className="grid grid-cols-2 gap-10 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-around p-6 border-2 border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="flex flex-col items-center text-xl font-bold font-mono">
                            <span className="border-b-2 border-slate-800 w-8 text-center">{p.n1}</span>
                            <span>{p.d1}</span>
                        </div>
                        <span className="text-3xl text-blue-500 font-bold">×</span>
                        <div className="flex flex-col items-center text-xl font-bold font-mono">
                            <span className="border-b-2 border-slate-800 w-8 text-center">{p.n2}</span>
                            <span>{p.d2}</span>
                        </div>
                        <span className="text-3xl text-slate-300">=</span>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-8 border-b-2 border-slate-200 bg-slate-50 rounded"></div>
                            <div className="w-12 h-8 bg-slate-50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-blue-50 border-2 border-blue-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-6">Factory Records: Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col items-center border border-blue-100 p-3 rounded-lg bg-white">
                                <span className="text-[10px] text-blue-300 mb-1">UNIT #{i + 1}</span>
                                <div className="flex flex-col items-center font-bold">
                                    <span className="border-b border-blue-800">{p.ansN}</span>
                                    <span>{p.ansD}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Dividing Fractions
 */
export function DividingFractions({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'dividing-fractions';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 8 }, () => {
        // Simple division of unit fractions by whole numbers or vice versa
        const isUnitByWhole = rng() > 0.5;
        let n1, d1, n2, d2, ansN, ansD;

        if (isUnitByWhole) {
            n1 = 1;
            d1 = nextInt(2, 6);
            n2 = nextInt(2, 5);
            d2 = 1;
            ansN = 1;
            ansD = d1 * n2;
        } else {
            n1 = nextInt(2, 5);
            d1 = 1;
            n2 = 1;
            d2 = nextInt(2, 6);
            ansN = n1 * d2;
            ansD = 1;
        }

        return { n1, d1, n2, d2, ansN, ansD, isUnitByWhole };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fraction Flip-O-Rama"
            emoji="🤸"
            description="Divide unit fractions by whole numbers and whole numbers by unit fractions. Keep, Change, Flip!"
            problemCount={problems.length}
            learningObjectives={[
                'Divide fractions by whole numbers',
                'Divide whole numbers by unit fractions',
                'Understand the reciprocal relationship'
            ]}
            parentTeacherTips={[
                'KEEP the first number.',
                'CHANGE division to multiplication.',
                'FLIP the second number (use the reciprocal).'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Great Flip"
                subtitle="Turn it upside down! Divide and conquer the fragments."
                icons={{
                    bg1: '🌀',
                    bg2: '🤸',
                    float1: '🛸',
                    float2: '🎈'
                }}
                colors={{
                    bg: 'bg-purple-900',
                    border: 'border-purple-700',
                    pillBg: 'bg-purple-800',
                    pillBorder: 'border-purple-600',
                    pillText: 'text-purple-50',
                    accent: 'text-purple-400'
                }}
            />

            <StrategySpotlight
                title="K.C.F. Method"
                icon="🍕"
                color="purple"
                steps={[
                    { label: 'Keep', text: 'Keep the first fraction exactly as it is.' },
                    { label: 'Change', text: 'Change division to multiplication (×).' },
                    { label: 'Flip', text: 'Flip the second fraction into its reciprocal.' }
                ]}
            />

            <div className="grid grid-cols-2 gap-10 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-around p-6 border-2 border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="font-bold text-2xl font-mono">
                            {p.d1 === 1 ? p.n1 : <div className="flex flex-col items-center"><span className="border-b-2 border-slate-800 px-2">{p.n1}</span><span>{p.d1}</span></div>}
                        </div>
                        <span className="text-3xl text-purple-500 font-bold">÷</span>
                        <div className="font-bold text-2xl font-mono">
                            {p.d2 === 1 ? p.n2 : <div className="flex flex-col items-center"><span className="border-b-2 border-slate-800 px-2">{p.n2}</span><span>{p.d2}</span></div>}
                        </div>
                        <span className="text-3xl text-slate-300">=</span>
                        <div className="w-16 h-12 border-2 border-slate-100 bg-slate-50 flex items-center justify-center rounded text-slate-300">?</div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-purple-50 border-2 border-purple-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-purple-900 mb-6">Flip Log: Quotients</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col items-center border border-purple-100 p-3 rounded-lg bg-white">
                                <span className="text-[10px] text-purple-300 mb-1">SLICE #{i + 1}</span>
                                <div className="font-bold text-xl text-purple-800">
                                    {p.ansD === 1 ? p.ansN : <div className="flex flex-col items-center"><span className="border-b border-purple-800">{p.ansN}</span><span>{p.ansD}</span></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Multiplying Decimals
 */
export function MultiplyingDecimals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'multiplying-decimals';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 8 }, () => {
        const n1 = (nextInt(11, 89) / 10).toFixed(1);
        const n2 = (nextInt(11, 49) / 10).toFixed(1);
        const ans = (Number(n1) * Number(n2)).toFixed(2);
        return { n1, n2, ans };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Decimal Disco: Multiplication Mix"
            emoji="💃"
            description="Multiply decimals to the hundredths place. Count the decimal places in the factors!"
            problemCount={problems.length}
            learningObjectives={[
                'Multiply decimals using standard algorithms',
                'Place the decimal point correctly in products',
                'Understand decimal multiplication visually'
            ]}
            parentTeacherTips={[
                'Ignore the decimal points first—just multiply like whole numbers.',
                'Count how many digits are behind the decimals in the question.',
                'Move the decimal in your answer that many places to the LEFT.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Groove Guide"
                subtitle="Step by step! Don't let the decimal trip you up!"
                icons={{
                    bg1: '🕺',
                    bg2: '💃',
                    float1: '🎵',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-pink-900',
                    border: 'border-pink-700',
                    pillBg: 'bg-pink-800',
                    pillBorder: 'border-pink-600',
                    pillText: 'text-pink-50',
                    accent: 'text-pink-400'
                }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-2xl bg-white shadow-sm hover:border-pink-200 transition-colors">
                        <div className="text-2xl font-mono text-slate-800 mb-4 flex flex-col items-end border-b-2 border-slate-800 pb-1 pr-1 mr-4">
                            <span>{p.n1}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-pink-500">×</span>
                                <span>{p.n2}</span>
                            </div>
                        </div>
                        <div className="h-10 w-24 bg-pink-50/50 border border-pink-100 rounded-lg flex items-center justify-center text-pink-200 font-mono italic text-xs">
                            {p.n1.length + p.n2.length - 2} places?
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-pink-50 border-2 border-pink-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-pink-900 mb-6">Disco Hall: Final Scores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="border-b border-pink-100 pb-2">
                                <span>{p.n1} × {p.n2} =</span>
                                <strong className="block text-pink-700 text-base">{p.ans}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Dividing Decimals
 */
export function DividingDecimals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'dividing-decimals';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 6 }, () => {
        const quotient = nextInt(5, 25);
        const divisor = nextInt(2, 8) / 10; // decimal divisor
        const dividend = (quotient * divisor).toFixed(2);
        return { dividend, divisor: divisor.toFixed(1), quotient, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Decimal Demolition"
            emoji="🚜"
            description="Divide decimals by decimals. Move the point and divide!"
            problemCount={problems.length}
            learningObjectives={[
                'Divide decimals by decimal divisors',
                'Place decimal points correctly in quotients',
                'Convert decimal division to whole number division'
            ]}
            parentTeacherTips={[
                'Make the divisor a whole number by moving its decimal.',
                'Move the dividend\'s decimal the same number of places.',
                'Division becomes easier when you shift the points!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Construction Site"
                subtitle="Clear the decimals for the big build!"
                icons={{
                    bg1: '🚧',
                    bg2: '🚜',
                    float1: '🔨',
                    float2: '🔩'
                }}
                colors={{
                    bg: 'bg-yellow-900',
                    border: 'border-yellow-700',
                    pillBg: 'bg-yellow-800',
                    pillBorder: 'border-yellow-600',
                    pillText: 'text-yellow-50',
                    accent: 'text-yellow-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col gap-6 p-8 border-2 border-slate-200 rounded-3xl bg-white shadow-inner relative overflow-hidden">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rotate-45"></div>
                        <div className="text-3xl font-mono text-slate-800 flex items-center justify-center gap-4">
                            <span>{p.dividend}</span>
                            <span className="text-yellow-600 font-bold">÷</span>
                            <span>{p.divisor}</span>
                            <span className="text-slate-300">=</span>
                        </div>
                        <div className="h-12 border-b-4 border-yellow-200 bg-slate-50 border-dashed rounded-lg"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-yellow-50 border-4 border-yellow-400 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-xl font-bold text-yellow-900 mb-6 uppercase tracking-widest">Site Inspector: Inspection Report</h3>
                    <div className="grid grid-cols-2 gap-6 font-mono text-lg">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b-2 border-yellow-100 pb-2">
                                <span className="text-slate-500">Task #{i + 1}</span>
                                <span className="font-bold text-yellow-700">{p.quotient}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Fractions, Decimals & Percents
 */
export function FractionsDecimalsPercents({ seed, variant, showAnswersForDoc, docId: propDocId }: SpecificWorksheetProps) {
    const docId = propDocId || 'fractions-decimals-percents';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const isAdvanced = docId.includes('advanced');
    const isOutOf100 = docId === 'fractions-out-of-100';
    const isPercentToDecimal = docId === 'percent-to-decimal';
    const isDecimalToPercent = docId === 'decimal-to-percent';

    let problems;

    if (isOutOf100) {
        problems = Array.from({ length: 8 }, () => {
            const num = nextInt(1, 99);
            const den = 100;
            const f = `${num}/${den}`;
            const d = (num / 100).toFixed(2);
            const p = `${num}%`;
            return { f, d, p, missing: 1, id: nextInt(100, 999) };
        });
    } else if (isPercentToDecimal) {
        problems = Array.from({ length: 12 }, () => {
            const val = nextInt(1, 150);
            const p = `${val}%`;
            const d = (val / 100).toString();
            return { f: '', d, p, missing: 1, id: nextInt(100, 999) };
        });
    } else if (isDecimalToPercent) {
        problems = Array.from({ length: 12 }, () => {
            const val = nextInt(1, 150);
            const d = (val / 100).toString();
            const p = `${val}%`;
            return { f: '', d, p, missing: 2, id: nextInt(100, 999) };
        });
    } else if (isAdvanced) {
        problems = Array.from({ length: 8 }, () => {
            const whole = nextInt(1, 5);
            const den = [2, 4, 5, 8, 10, 20, 25, 50][nextInt(0, 7)];
            const num = nextInt(1, den - 1);
            const val = whole + (num / den);
            const f = `${whole} ${num}/${den}`;
            const d = val.toFixed(den === 8 ? 3 : 2).replace(/\.?0+$/, '');
            const p = `${(val * 100).toFixed(den === 8 ? 1 : 0).replace(/\.0$/, '')}%`;
            const missing = rng() > 0.5 ? 1 : 2;
            return { f, d, p, missing, id: nextInt(100, 999) };
        });
    } else {
        const common = [
            { f: '1/2', d: '0.50', p: '50%' },
            { f: '1/4', d: '0.25', p: '25%' },
            { f: '3/4', d: '0.75', p: '75%' },
            { f: '1/5', d: '0.20', p: '20%' },
            { f: '2/5', d: '0.40', p: '40%' },
            { f: '1/10', d: '0.10', p: '10%' },
            { f: '4/5', d: '0.80', p: '80%' }
        ];
        problems = Array.from({ length: 6 }, () => {
            const item = common[nextInt(0, common.length - 1)];
            const missing = nextInt(0, 2);
            return { ...item, missing, id: nextInt(100, 999) };
        });
    }

    let title = "The Triple Threat: F-D-P";
    let desc = "Convert between fractions, decimals, and percents.";
    let cols = 3;

    if (isOutOf100) {
        title = "Fractions Out of 100";
        desc = "Convert fractions with denominator 100 into decimals.";
    } else if (isPercentToDecimal) {
        title = "Percent to Decimal";
        desc = "Convert percents to decimals.";
        cols = 2;
    } else if (isDecimalToPercent) {
        title = "Decimal to Percent";
        desc = "Convert decimals to percents.";
        cols = 2;
    } else if (isAdvanced) {
        title = "Mixed Numbers & Decimals";
        desc = "Convert mixed numbers to decimals and percents.";
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={title}
            emoji="🎭"
            description={desc}
            problemCount={problems.length}
            learningObjectives={[
                'Convert fractions to decimals and percents',
                'Understand percents as parts of 100',
                'Identify equivalent representations of values'
            ]}
            parentTeacherTips={[
                'Percent means "per 100".',
                'To convert a decimal to a percent, move the point 2 places RIGHT.',
                'Fractions like 1/2 are just another way to say 0.5 or 50%.'
            ]}
        >
            <PremiumWorksheetBanner
                title={title}
                subtitle="Help the numbers find their other faces!"
                icons={{
                    bg1: '🤡',
                    bg2: '🎭',
                    float1: '🎭',
                    float2: '🃏'
                }}
                colors={{
                    bg: 'bg-slate-900',
                    border: 'border-slate-700',
                    pillBg: 'bg-slate-800',
                    pillBorder: 'border-slate-600',
                    pillText: 'text-slate-50',
                    accent: 'text-slate-400'
                }}
            />

            <div className={`grid ${cols === 3 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-6 mt-10`}>
                {problems.map((p, i) => (
                    <div key={i} className={`bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm ${cols === 3 ? 'grid grid-cols-3 gap-4' : 'flex items-center justify-around'}`}>
                        {(!isPercentToDecimal && !isDecimalToPercent) && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Fraction</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full">
                                    {p.missing === 0 ? <div className="w-16 h-10 border-b-2 border-dashed border-slate-300"></div> : p.f}
                                </div>
                            </div>
                        )}

                        {(cols === 2 && (isDecimalToPercent || isPercentToDecimal)) && p.missing !== 1 && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Decimal</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full text-indigo-600">
                                    {p.d}
                                </div>
                            </div>
                        )}

                        {(cols === 3) && (
                            <div className="flex flex-col items-center gap-2 border-x border-slate-100 px-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Decimal</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full text-indigo-600">
                                    {p.missing === 1 ? <div className="w-16 h-10 border-b-2 border-dashed border-slate-300"></div> : p.d}
                                </div>
                            </div>
                        )}

                        {(cols === 2 && isPercentToDecimal && p.missing === 1) && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Decimal</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full text-indigo-600">
                                    <div className="w-16 h-10 border-b-2 border-dashed border-slate-300"></div>
                                </div>
                            </div>
                        )}

                        {cols === 2 && <div className="text-slate-300 text-2xl">➔</div>}

                        {(cols === 3) && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Percent</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full text-emerald-600">
                                    {p.missing === 2 ? <div className="w-16 h-10 border-b-2 border-dashed border-slate-300"></div> : p.p}
                                </div>
                            </div>
                        )}

                        {(cols === 2 && (isDecimalToPercent || isPercentToDecimal)) && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs uppercase text-slate-400 font-bold">Percent</span>
                                <div className="text-xl font-mono h-12 flex items-center justify-center w-full text-emerald-600">
                                    {p.missing === 2 ? <div className="w-16 h-10 border-b-2 border-dashed border-slate-300"></div> : p.p}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-slate-50 border-2 border-slate-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 underline">Backstage Access: Converting Key</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="font-bold text-slate-600">#{i + 1}</span>
                                <div className="flex gap-4 font-mono text-base">
                                    {(!isPercentToDecimal && !isDecimalToPercent) && <span>{p.f}</span>}
                                    <span>{p.d}</span>
                                    {!isOutOf100 && <span>{p.p}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Comparing & Ordering Fractions and Decimals
 */
export function ComparingOrderingFractionsDecimals({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'comparing-ordering-fractions-decimals';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 6 }, () => {
        const val1 = (nextInt(1, 9) / 10).toFixed(1);
        const n2 = nextInt(1, 9);
        const d2 = 10;
        const v1 = Number(val1);
        const v2 = n2 / d2;

        let op = '=';
        if (v1 > v2) op = '>';
        else if (v1 < v2) op = '<';

        return { val1, n2, d2, op };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Tug-of-War: Decimals vs Fractions"
            emoji="🏗️"
            description="Compare values in decimal and fraction form. Use <, >, or = to show which side wins!"
            problemCount={problems.length}
            learningObjectives={[
                'Compare fractions and decimals',
                'Convert between formats to compare values',
                'Order mixed numerical formats'
            ]}
            parentTeacherTips={[
                'Convert everything to the same format (all decimals or all fractions) first.',
                'Think of 0.7 as 7/10.',
                'Draw a number line to visualize where each value fits.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Arena"
                subtitle="Who is heavier? Tension on the line!"
                icons={{
                    bg1: '⚖️',
                    bg2: '🏗️',
                    float1: '⚓',
                    float2: '⛓️'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-8 border-4 border-slate-100 rounded-full bg-white shadow-lg relative">
                        <div className="text-3xl font-mono font-bold text-blue-600">{p.val1}</div>
                        <div className="w-16 h-16 border-4 border-slate-300 rounded-2xl flex items-center justify-center text-slate-100 font-bold text-2xl">?</div>
                        <div className="flex flex-col items-center font-mono font-bold text-3xl text-emerald-600">
                            <span className="border-b-4 border-emerald-600 px-4">{p.n2}</span>
                            <span>{p.d2}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-blue-900 text-white rounded-3xl print:bg-white print:text-black print:border-2">
                    <h3 className="text-xl font-bold mb-6 italic">Arena Scorecard: Winners</h3>
                    <div className="grid grid-cols-3 gap-6 font-mono text-2xl">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-center items-center gap-2 border-r border-slate-700 last:border-0">
                                <span className="text-sm text-slate-400 mr-2">#{i + 1}</span>
                                <strong>{p.op}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Adding Decimals Challenge
 */
export function AddingDecimalsChallenge({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'adding-decimals-challenge';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 9 }, () => {
        const n1 = (rng() * 100).toFixed(2);
        const n2 = (rng() * 100).toFixed(2);
        const ans = (Number(n1) + Number(n2)).toFixed(2);
        return { n1, n2, ans };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Vault: Decimal Addition"
            emoji="💰"
            description="Add multiple decimal numbers with varying place values. Keep the points lined up!"
            problemCount={problems.length}
            learningObjectives={[
                'Add decimals with regrouping',
                'Align decimal points for vertical addition',
                'Solve multi-digit decimal operations'
            ]}
            parentTeacherTips={[
                'Always line up the decimal points like a vertical column.',
                'Add placeholders (zeros) to make all numbers the same length.',
                'The decimal in the answer drops straight down.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Treasure Hunt"
                subtitle="Calculate the gold! Precise sums unlock the chest."
                icons={{
                    bg1: '💎',
                    bg2: '💰',
                    float1: '🪙',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-emerald-900',
                    border: 'border-emerald-700',
                    pillBg: 'bg-emerald-800',
                    pillBorder: 'border-emerald-600',
                    pillText: 'text-emerald-50',
                    accent: 'text-emerald-400'
                }}
            />

            <div className="grid grid-cols-3 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col items-end p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-sm font-mono text-xl relative">
                        <div className="absolute top-2 left-2 text-[10px] text-slate-300">GOLD BLOCK #{i + 1}</div>
                        <span> {p.n1}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-base text-slate-400">+</span>
                            <span className="border-b-2 border-slate-800 pb-1">{p.n2}</span>
                        </div>
                        <div className="h-8 mt-2 w-full bg-slate-50/50 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-emerald-50 border-2 border-emerald-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6">Vault Summary: Total Treasure</h3>
                    <div className="grid grid-cols-3 gap-8 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[10px] text-emerald-400 mb-1">ID #{i + 1}</span>
                                <span className="text-lg font-bold text-emerald-700">{p.ans}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}


/**
 * Volume of Rectangular Prisms
 */
export function VolumeRectangularPrisms({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'volume-rectangular-prisms';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 4 }, () => {
        const l = nextInt(3, 10);
        const w = nextInt(2, 6);
        const h = nextInt(2, 8);
        const vol = l * w * h;
        return { l, w, h, vol, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Volume Voyage: 3D Space"
            emoji="📦"
            description="Calculate the volume of rectangular prisms by multiplying length, width, and height."
            problemCount={problems.length}
            learningObjectives={[
                'Understand volume as a property of 3D space',
                'Apply the formula V = l × w × h',
                'Calculate volume in cubic units'
            ]}
            parentTeacherTips={[
                'Volume is the space inside a 3D object.',
                'The formula is Length × Width × Height.',
                'Think of it as the area of the baseStacking identical layers (l × w) as high as the height (h).'
            ]}
        >
            <PremiumWorksheetBanner
                title="Space Explorer"
                subtitle="Pack the cargo! How much fits inside the prism?"
                icons={{
                    bg1: '📦',
                    bg2: '🏗️',
                    float1: '🛰️',
                    float2: '🛸'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white flex flex-col gap-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargo Pod #{i + 1}</span>
                            <span className="text-[10px] text-slate-300 font-mono">ID: {p.id}</span>
                        </div>

                        <div className="flex justify-center py-6">
                            <svg viewBox="0 0 200 120" className="w-48 h-auto drop-shadow-lg">
                                <path d="M40,100 L120,100 L120,40 L40,40 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
                                <path d="M120,100 L160,70 L160,10 L120,40" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" />
                                <path d="M40,40 L80,10 L160,10" fill="none" stroke="#6366f1" strokeWidth="2" />
                                <path d="M80,10 L80,70 L40,100" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />

                                <text x="80" y="115" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">L = {p.l}</text>
                                <text x="150" y="90" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold" transform="rotate(-35, 150, 90)">W = {p.w}</text>
                                <text x="30" y="70" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold" transform="rotate(-90, 30, 70)">H = {p.h}</text>
                            </svg>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-slate-600 font-bold uppercase text-sm italic">Volume =</span>
                            <div className="w-40 h-10 bg-indigo-50 border-2 border-indigo-100 rounded-lg flex items-center justify-end px-3 font-mono text-slate-400">
                                units³
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-indigo-50 border-2 border-indigo-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-indigo-900 mb-6">Mission Control: Cargo Logs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col border-l-4 border-indigo-400 pl-3">
                                <span className="text-[10px] text-indigo-400">POD #{i + 1}</span>
                                <span className="font-bold text-indigo-700">{p.l} × {p.w} × {p.h} = {p.vol} u³</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Area of Triangles & Parallelograms
 */
export function AreaTrianglesParallelograms({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'area-triangles-parallelograms';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const problems = Array.from({ length: 6 }, () => {
        const isTriangle = rng() > 0.5;
        const base = nextInt(4, 12);
        const height = nextInt(3, 10);
        const area = isTriangle ? (base * height) / 2 : (base * height);
        return { isTriangle, base, height, area, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Shapes on a Grid: Area Ace"
            emoji="📐"
            description="Find the area of triangles and parallelograms using base and height."
            problemCount={problems.length}
            learningObjectives={[
                'Apply the area formula for triangles (1/2 b × h)',
                'Apply the area formula for parallelograms (b × h)',
                'Differentiate between 2D shape area calculations'
            ]}
            parentTeacherTips={[
                'A parallelogram is like a rectangle shifted sideways. Area = Base × Height.',
                'A triangle is exactly HALF of a parallelogram. Area = 1/2 × Base × Height.',
                'Base and Height must always be PERPENDICULAR.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Blueprint"
                subtitle="Measure twice, calculate once! Master the geometry of space."
                icons={{
                    bg1: '📐',
                    bg2: '🖋️',
                    float1: '📏',
                    float2: '✂️'
                }}
                colors={{
                    bg: 'bg-emerald-900',
                    border: 'border-emerald-700',
                    pillBg: 'bg-emerald-800',
                    pillBorder: 'border-emerald-600',
                    pillText: 'text-emerald-50',
                    accent: 'text-emerald-400'
                }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-100 rounded-2xl p-6 bg-white flex flex-col gap-4 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{p.isTriangle ? 'Triangle' : 'Parallelogram'}</span>
                        </div>

                        <div className="flex justify-center h-24">
                            {p.isTriangle ? (
                                <svg viewBox="0 0 100 80" className="h-full">
                                    <path d="M10,70 L90,70 L40,10 Z" fill="none" stroke="#10b981" strokeWidth="2" />
                                    <line x1="40" y1="10" x2="40" y2="70" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 100 80" className="h-full">
                                    <path d="M20,70 L90,70 L80,10 L10,10 Z" fill="none" stroke="#059669" strokeWidth="2" />
                                    <line x1="80" y1="10" x2="80" y2="70" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
                                </svg>
                            )}
                        </div>

                        <div className="text-center text-xs font-mono text-slate-500">
                            b = {p.base} | h = {p.height}
                        </div>

                        <div className="h-8 border-b-2 border-dashed border-emerald-100 mt-2 flex items-center justify-end px-2 text-emerald-200 text-xs italic">
                            Area = ________
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-emerald-50 border-2 border-emerald-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6">Master Blueprint: Area Key</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="border-b border-emerald-100 pb-2">
                                <span className="text-[10px] uppercase block mb-1">#{i + 1} {p.isTriangle ? '△' : '▱'}</span>
                                <span className="text-emerald-700 font-bold">
                                    {p.area} sq units
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Classifying Shapes (5th Grade)
 */
export function ClassifyingShapes5th({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'classifying-shapes';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const shapes = [
        { name: 'Rectangle', props: ['Opposite sides parallel', 'Four right angles'], parent: 'Parallelogram' },
        { name: 'Rhombus', props: ['All sides equal length', 'Opposite sides parallel'], parent: 'Parallelogram' },
        { name: 'Square', props: ['All sides equal', 'Four right angles'], parent: 'Rectangle & Rhombus' },
        { name: 'Right Triangle', props: ['One 90° angle'], parent: 'Triangle' },
        { name: 'Trapezoid', props: ['Only one pair of parallel sides'], parent: 'Quadrilateral' }
    ];

    const problems = Array.from({ length: 4 }, () => {
        const shape = shapes[nextInt(0, shapes.length - 1)];
        return { ...shape, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Shape Hierarchy Explorer"
            emoji="💠"
            description="Classify 2D figures into hierarchies based on their properties."
            problemCount={problems.length}
            learningObjectives={[
                'Identify properties of quadrilaterals',
                'Understand shape hierarchies',
                'Classify figures based on angles and sides'
            ]}
            parentTeacherTips={[
                'Every square is a rectangle, but not every rectangle is a square.',
                'Use specific properties to narrow down the category.',
                'Focus on parallel lines and right angles.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Shape Inspector"
                subtitle="True or False? Check the rules to find the name!"
                icons={{
                    bg1: '💠',
                    bg2: '💎',
                    float1: '✨',
                    float2: '📐'
                }}
                colors={{
                    bg: 'bg-slate-900',
                    border: 'border-slate-700',
                    pillBg: 'bg-slate-800',
                    pillBorder: 'border-slate-600',
                    pillText: 'text-slate-50',
                    accent: 'text-slate-400'
                }}
            />

            <div className="space-y-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white flex flex-col md:flex-row gap-8 items-center shadow-lg">
                        <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-4 border-slate-100 flex-shrink-0 animate-pulse">
                            <span className="text-4xl text-slate-300">?</span>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Spec #{p.id}</span>
                                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Shape Properties:</span>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {p.props.map((prop, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                                        <div className="w-4 h-4 rounded-full border-2 border-indigo-400"></div>
                                        {prop}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-slate-400">Identity:</span>
                                    <div className="flex-1 h-10 border-b-2 border-slate-200 border-dashed"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-slate-900 text-slate-100 rounded-3xl print:bg-white print:text-black print:border-2">
                    <h3 className="text-lg font-bold mb-6 italic border-b border-slate-700 pb-2">Classification Registry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-indigo-400 font-bold text-xs uppercase">SPEC #{p.id}</span>
                                <div className="text-lg">
                                    <strong>{p.name}</strong> <span className="text-slate-500 text-sm italic">(Parent: {p.parent})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Coordinate Graphing
 */
export function CoordinateGraphing({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'coordinate-graphing';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const points = Array.from({ length: 5 }, (_, i) => ({
        x: nextInt(1, 9),
        y: nextInt(1, 9),
        label: String.fromCharCode(65 + i)
    }));

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Coordinate Quest"
            emoji="🗺️"
            description="Plot and identify points on a coordinate plane."
            problemCount={points.length}
            learningObjectives={[
                'Identify x and y coordinates',
                'Plot points on a grid',
                'Identify movement on a coordinate plane'
            ]}
            parentTeacherTips={[
                'X comes before Y in the alphabet, just like in (x, y).',
                'Walk (X) before you jump (Y).',
                'The origin is (0, 0).'
            ]}
        >
            <PremiumWorksheetBanner
                title="Mission Control"
                subtitle="Map the signals! Every point has a secret location."
                icons={{
                    bg1: '🛰️',
                    bg2: '📡',
                    float1: '📍',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-blue-900',
                    border: 'border-blue-700',
                    pillBg: 'bg-blue-800',
                    pillBorder: 'border-blue-600',
                    pillText: 'text-blue-50',
                    accent: 'text-blue-400'
                }}
            />

            <div className="flex flex-col md:flex-row gap-12 mt-10">
                <div className="flex-1 bg-white border-2 border-slate-200 p-8 rounded-3xl shadow-lg relative aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border border-slate-100 p-12">
                        {Array.from({ length: 121 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-slate-100"></div>
                        ))}
                    </div>
                    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full p-12 overflow-visible">
                        <line x1="0" y1="100" x2="105" y2="100" stroke="#1e293b" strokeWidth="1" />
                        <line x1="0" y1="100" x2="0" y2="-5" stroke="#1e293b" strokeWidth="1" />
                        {points.slice(0, 3).map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x * 10} cy={100 - (p.y * 10)} r="1.5" fill="#3b82f6" />
                                <text x={p.x * 10 + 2} y={100 - (p.y * 10) - 2} fontSize="5" fontWeight="bold" fill="#1e3a8a">{p.label}</text>
                            </g>
                        ))}
                    </svg>
                    <div className="absolute bottom-4 right-12 text-[10px] font-bold text-slate-800 uppercase italic">x - axis</div>
                    <div className="absolute top-12 left-4 text-[10px] font-bold text-slate-800 uppercase italic transform -rotate-90">y - axis</div>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100 border-dashed">
                        <h4 className="text-sm font-bold text-blue-900 mb-4">Identify the Points:</h4>
                        <div className="space-y-4">
                            {points.slice(0, 3).map((p, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-blue-800">Point {p.label}:</span>
                                    <div className="flex-1 border-b-2 border-blue-200 h-8 flex items-center px-2 text-slate-400 font-mono">( __ , __ )</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-blue-50 border-2 border-blue-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-6">Coordinate Key</h3>
                    <div className="grid grid-cols-5 gap-4 font-mono text-center">
                        {points.map((p, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="font-bold text-blue-700">{p.label}</span>
                                <span>({p.x}, {p.y})</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Nets & 3D Shapes
 */
export function Nets3DShapes({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'nets-3d-shapes';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const shapes = [
        { name: 'Cube', net: '6 matching squares', faces: 6, edges: 12, vertices: 8 },
        { name: 'Square Pyramid', net: '1 square, 4 triangles', faces: 5, edges: 8, vertices: 5 },
        { name: 'Triangular Prism', net: '2 triangles, 3 rectangles', faces: 5, edges: 9, vertices: 6 },
        { name: 'Rectangular Prism', net: '6 rectangles', faces: 6, edges: 12, vertices: 8 }
    ];

    const problems = Array.from({ length: 4 }, () => {
        const shape = shapes[nextInt(0, shapes.length - 1)];
        return { ...shape, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="3D Blueprint: Nets & Vertices"
            emoji="📐"
            description="Identify 3D shapes from their 2D nets and count their properties."
            problemCount={problems.length}
            learningObjectives={[
                'Identify 3D shapes from 2D nets',
                'Count faces, edges, and vertices',
                'Understand how 2D shapes fold into 3D objects'
            ]}
            parentTeacherTips={[
                'A net is like a flattened box.',
                'Faces are the flat surfaces.',
                'Vertices are the corners.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Architect's Studio"
                subtitle="Fold it up! Can you see the 3D shape in the net?"
                icons={{
                    bg1: '📐',
                    bg2: '🏗️',
                    float1: '🖋️',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-amber-900',
                    border: 'border-amber-700',
                    pillBg: 'bg-amber-800',
                    pillBorder: 'border-amber-600',
                    pillText: 'text-amber-50',
                    accent: 'text-amber-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white space-y-6 shadow-md">
                        <div className="flex justify-between">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Blueprint #{p.id}</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-700">
                                <span className="text-amber-600 font-bold">Net Description:</span> {p.net}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center p-3 border-2 border-dashed border-slate-100 rounded-xl">
                                    <span className="text-[10px] font-bold text-slate-400">FACES</span>
                                    <div className="h-8 w-full border-b-2 border-slate-200"></div>
                                </div>
                                <div className="flex flex-col items-center p-3 border-2 border-dashed border-slate-100 rounded-xl">
                                    <span className="text-[10px] font-bold text-slate-400">EDGES</span>
                                    <div className="h-8 w-full border-b-2 border-slate-200"></div>
                                </div>
                                <div className="flex flex-col items-center p-3 border-2 border-dashed border-slate-100 rounded-xl">
                                    <span className="text-[10px] font-bold text-slate-400">VERTICES</span>
                                    <div className="h-8 w-full border-b-2 border-slate-200"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-sm font-bold text-slate-400">Shape Name:</span>
                                <div className="flex-1 h-8 border-b-2 border-slate-200"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-amber-50 border-2 border-amber-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-amber-900 mb-6 uppercase">Architect's Ledger</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {problems.map((p, i) => (
                            <div key={i} className="font-mono">
                                <span className="text-amber-700 font-bold">#{p.id}: {p.name}</span>
                                <div className="text-slate-600 text-xs">F: {p.faces} | E: {p.edges} | V: {p.vertices}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Transformations 5th Grade
 */
export function Transformations5th({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'transformations-5th';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const types = ['Translation (Slide)', 'Reflection (Flip)', 'Rotation (Turn)'];
    const problems = Array.from({ length: 4 }, () => {
        const type = types[nextInt(0, types.length - 1)];
        return { type, id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Morphing Shapes: Transformations"
            emoji="🌀"
            description="Identify slides, flips, and turns of 2D shapes on a coordinate plane."
            problemCount={problems.length}
            learningObjectives={[
                'Identify translations, reflections, and rotations',
                'Describe the movement of a figure on a grid',
                'Understand congruence after transformation'
            ]}
            parentTeacherTips={[
                'Translation = Slide (it moves but looks the same).',
                'Reflection = Mirror Image (it flips over a line).',
                'Rotation = Clockwise or Counter-clockwise Turn.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The Motion Lab"
                subtitle="Track the movement! How did the shape get from A to B?"
                icons={{
                    bg1: '🌀',
                    bg2: '🔄',
                    float1: '✨',
                    float2: '📐'
                }}
                colors={{
                    bg: 'bg-violet-900',
                    border: 'border-violet-700',
                    pillBg: 'bg-violet-800',
                    pillBorder: 'border-violet-600',
                    pillText: 'text-violet-50',
                    accent: 'text-violet-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white flex flex-col gap-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Experiment #{p.id}</span>
                        </div>
                        <div className="flex justify-center py-6 bg-slate-50 rounded-2xl relative overflow-hidden h-40">
                            {/* Abstract representation of a Transformation */}
                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
                                {Array.from({ length: 60 }).map((_, j) => (
                                    <div key={j} className="border-[0.5px] border-slate-200"></div>
                                ))}
                            </div>
                            <div className="relative z-10 flex items-center justify-center gap-16 w-full h-full p-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-indigo-100 border-2 border-indigo-400 rounded-lg flex items-center justify-center font-bold text-indigo-700 shadow-sm transition-transform duration-500">
                                        A
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">ORIGINAL</div>
                                </div>

                                <div className="text-3xl text-slate-300 font-light flex flex-col items-center">
                                    <span className="leading-none">→</span>
                                    <div className="w-8 h-px bg-slate-200 mt-1"></div>
                                </div>

                                <div className="relative">
                                    <div
                                        className={`w-12 h-12 bg-indigo-500 border-2 border-indigo-700 rounded-lg flex items-center justify-center font-bold text-white shadow-md transition-all duration-500 ${p.type.includes('Rotation') ? 'rotate-90' :
                                            p.type.includes('Reflection') ? 'scale-x-100 translate-x-2' :
                                                'translate-y-4 translate-x-4'
                                            }`}
                                    >
                                        <span className={`${p.type.includes('Reflection') ? 'scale-x-[-1]' : ''}`}>B</span>
                                    </div>
                                    {p.type.includes('Reflection') && (
                                        <div className="absolute top-0 bottom-0 -left-8 w-0.5 bg-dashed border-l border-indigo-300 opacity-50"></div>
                                    )}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-indigo-400 font-mono font-bold tracking-tighter">TRANSFORMED</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Type of Transformation:</span>
                            <div className="flex flex-col gap-2">
                                {types.map((t, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-md border-2 border-slate-200"></div>
                                        <span className="text-slate-700 font-medium">{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-violet-50 border-2 border-violet-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-violet-900 mb-6 uppercase tracking-widest">Lab Report: Verified Motions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[10px] text-violet-400">EXP #{p.id}</span>
                                <span className="font-bold text-violet-700">{p.type.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Line Graphs
 */
export function LineGraphs({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'line-graphs';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = labels.map(() => nextInt(10, 50));

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Trend Tracker: Line Graphs"
            emoji="📈"
            description="Plot data over time and identify trends in a line graph."
            problemCount={1}
            learningObjectives={[
                'Construct a line graph from periodic data',
                'Identify trends (increasing, decreasing, static)',
                'Label axes and title the graph appropriately'
            ]}
            parentTeacherTips={[
                'Line graphs are perfect for showing changes over time.',
                'The horizontal axis (x) usually shows time (days, months).',
                'Connect the dots with straight lines to see the trend.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Data Scientist"
                subtitle="Analyze the changes! What story does the line tell?"
                icons={{
                    bg1: '📈',
                    bg2: '📊',
                    float1: '⏱️',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-cyan-900',
                    border: 'border-cyan-700',
                    pillBg: 'bg-cyan-800',
                    pillBorder: 'border-cyan-600',
                    pillText: 'text-cyan-50',
                    accent: 'text-cyan-400'
                }}
            />

            <div className="border-2 border-slate-200 rounded-3xl p-8 bg-white mt-10 shadow-lg">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recorded Data:</h4>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="text-left py-2 text-xs font-bold text-slate-500">Day</th>
                                    <th className="text-right py-2 text-xs font-bold text-slate-500">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labels.map((l, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        <td className="py-2 text-sm font-medium text-slate-700">{l}</td>
                                        <td className="py-2 text-right text-sm font-mono text-slate-600 font-bold">{data[i]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex-1 min-h-[300px] border-l-2 border-b-2 border-slate-800 relative m-8">
                        <div className="absolute top-0 right-0 p-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-xs italic">
                            Construct Graph Here
                        </div>
                        {/* Grid Lines */}
                        {[10, 20, 30, 40, 50].reverse().map((n, i) => (
                            <div key={n} className="absolute w-full border-t border-slate-50 flex items-center" style={{ top: `${i * 20}%` }}>
                                <span className="absolute -left-8 text-[10px] font-bold text-slate-400">{n}</span>
                            </div>
                        ))}
                        {/* Day Labels */}
                        <div className="absolute -bottom-8 w-full flex justify-between px-2">
                            {labels.map(l => (
                                <span key={l} className="text-[10px] font-bold text-slate-500">{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-2xl print:bg-white text-sm">
                    <h3 className="text-md font-bold text-cyan-900 mb-2 uppercase">Official Reading:</h3>
                    <p className="text-slate-600 italic">Verify that the points match the table exactly. Highest point: {labels[data.indexOf(Math.max(...data))]}. Lowest: {labels[data.indexOf(Math.min(...data))]}.</p>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Mean, Median, Mode & Range
 */
export function MeanMedianModeRange({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'mean-median-mode-range';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const sets = Array.from({ length: 3 }, () => {
        const count = nextInt(5, 9);
        const nums = Array.from({ length: count }, () => nextInt(5, 50)).sort((a, b) => a - b);
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = (sum / count).toFixed(1);
        const median = nums[Math.floor(count / 2)];
        const range = nums[nums.length - 1] - nums[0];

        const counts: Record<number, number> = {};
        nums.forEach(n => counts[n] = (counts[n] || 0) + 1);
        let max = 0;
        let modes: number[] = [];
        Object.entries(counts).forEach(([k, v]) => {
            if (v > max) { max = v; modes = [Number(k)]; }
            else if (v === max && max > 1) { modes.push(Number(k)); }
        });

        return { nums, mean, median, range, mode: max > 1 ? modes.join(', ') : 'None', id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Stats Lab: Mean, Median, Mode"
            emoji="🔢"
            description="Calculate key statistical measures to describe a dataset."
            problemCount={sets.length * 4}
            learningObjectives={[
                'Calculate the arithmetic mean (average)',
                'Identify the median (middle value)',
                'Identify the mode (most common value)',
                'Calculate the range (spread)'
            ]}
            parentTeacherTips={[
                'Mean: Add all numbers and divide by the count.',
                'Median: Order numbers first, then find the middle one.',
                'Mode: The number that appears most often.',
                'Range: Subtract the smallest number from the largest.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Data Analyst"
                subtitle="Calculate the critical 4! Master the language of data."
                icons={{
                    bg1: '🔢',
                    bg2: '📊',
                    float1: '🧠',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-emerald-900',
                    border: 'border-emerald-700',
                    pillBg: 'bg-emerald-800',
                    pillBorder: 'border-emerald-600',
                    pillText: 'text-emerald-50',
                    accent: 'text-emerald-400'
                }}
            />

            <div className="space-y-10 mt-10">
                {sets.map((s, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-md">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-xs">Dataset #{s.id}</span>
                            <div className="flex-1 p-4 bg-slate-50 rounded-2xl font-mono text-xl tracking-wider text-center text-slate-800 border border-slate-100">
                                {s.nums.join(', ')}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {['Mean', 'Median', 'Mode', 'Range'].map(m => (
                                <div key={m} className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
                                    <div className="h-10 border-b-2 border-emerald-100 border-dashed"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-emerald-50 border-2 border-emerald-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6 uppercase">Statistical Summary: Verified Sets</h3>
                    <div className="space-y-4 font-mono text-xs">
                        {sets.map((s, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-3 rounded-xl border border-emerald-100">
                                <span className="font-bold text-emerald-600 min-w-[60px]">#{s.id}:</span>
                                <div className="grid grid-cols-4 flex-1">
                                    <span>Mn: {s.mean}</span>
                                    <span>Md: {s.median}</span>
                                    <span>Mo: {s.mode}</span>
                                    <span>Rg: {s.range}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Stem & Leaf Plots
 */
export function StemLeafPlots({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'stem-leaf-plots';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const data = Array.from({ length: 15 }, () => nextInt(10, 45)).sort((a, b) => a - b);
    const stems: Record<number, number[]> = {};
    data.forEach(n => {
        const s = Math.floor(n / 10);
        const l = n % 10;
        if (!stems[s]) stems[s] = [];
        stems[s].push(l);
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Forest of Data: Stem & Leaf"
            emoji="🌿"
            description="Organize data by tens and ones using a stem-and-leaf plot."
            problemCount={data.length}
            learningObjectives={[
                'Organize numerical data into stems and leaves',
                'Retrieve specific data points from a plot',
                'Identify the minimum, maximum, and mode from the plot'
            ]}
            parentTeacherTips={[
                'The "Stem" is the tens digit.',
                'The "Leaf" is the ones digit.',
                'Leaves must be in order from smallest to greatest!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Data Ranger"
                subtitle="Sort the leaves! Organize your data into categorical tens."
                icons={{
                    bg1: '🌿',
                    bg2: '📊',
                    float1: '🍃',
                    float2: '✨'
                }}
                colors={{
                    bg: 'bg-green-900',
                    border: 'border-green-700',
                    pillBg: 'bg-green-800',
                    pillBorder: 'border-green-600',
                    pillText: 'text-green-50',
                    accent: 'text-green-400'
                }}
            />

            <div className="flex flex-col md:flex-row gap-8 mt-10">
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-md">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Raw Data Collection:</h4>
                        <div className="grid grid-cols-5 gap-3 font-mono text-lg text-slate-700">
                            {data.map((n, i) => (
                                <div key={i} className="bg-slate-50 p-2 text-center rounded-lg border border-slate-100">{n}</div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-100 border-dashed">
                        <h4 className="text-sm font-bold text-green-800 mb-2">Instructions:</h4>
                        <p className="text-xs text-green-600 leading-relaxed italic">
                            1. Create a plot with stems for 1, 2, 3, and 4.<br />
                            2. List the ones digits (leaves) in order next to their stems.<br />
                            3. Answer the analysis questions on the right.
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="border-2 border-slate-300 rounded-3xl bg-white p-8 min-h-[250px] relative">
                        <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Stem-and-Leaf Plot</div>
                        <div className="flex justify-center mt-6">
                            <div className="flex text-2xl font-mono">
                                <div className="flex flex-col pr-6 border-r-4 border-slate-800 text-right gap-4">
                                    <div className="text-slate-200 italic">Stem</div>
                                    {[1, 2, 3, 4].map(s => <div key={s}>{s}</div>)}
                                </div>
                                <div className="flex flex-col pl-6 gap-4">
                                    <div className="text-slate-200 italic">Leaf</div>
                                    {[1, 2, 3, 4].map(s => <div key={s} className="w-32 h-8 border-b-2 border-slate-100 border-dashed"></div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600 italic">What is the RANGE of this data?</span>
                            <div className="w-20 h-8 border-b-2 border-slate-300"></div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600 italic">What is the MODE?</span>
                            <div className="w-20 h-8 border-b-2 border-slate-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-green-50 border-2 border-green-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-green-900 mb-6 uppercase">Ranger's Key: Verified Plot</h3>
                    <div className="flex gap-10 font-mono text-xl">
                        <div className="flex flex-col pr-6 border-r-2 border-green-200 text-right">
                            {Object.keys(stems).sort().map(s => <div key={s}>{s}</div>)}
                        </div>
                        <div className="flex flex-col">
                            {Object.keys(stems).sort().map(s => <div key={s} className="text-green-700">{stems[Number(s)].join(' ')}</div>)}
                        </div>
                    </div>
                    <div className="mt-6 flex gap-12 text-green-600 font-bold">
                        <span>Range: {data[data.length - 1] - data[0]}</span>
                        <span>Mode: {Object.entries(stems).flatMap(([s, leaves]) => {
                            const c: Record<number, number> = {};
                            leaves.forEach(l => c[l] = (c[l] || 0) + 1);
                            return Object.entries(c).filter(([l, v]) => v > 1).map(([l]) => Number(s) * 10 + Number(l));
                        }).join(', ') || 'None'}</span>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Probability
 */
export function Probability5th({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'probability';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const marbles = [
        { color: 'Red', count: nextInt(2, 6), bg: 'bg-red-500' },
        { color: 'Blue', count: nextInt(2, 6), bg: 'bg-blue-500' },
        { color: 'Green', count: nextInt(2, 6), bg: 'bg-green-500' }
    ];
    const total = marbles.reduce((a, b) => a + b.count, 0);

    const questions = [
        { text: `P(Red)?`, ans: `${marbles[0].count}/${total}` },
        { text: `P(Blue or Green)?`, ans: `${marbles[1].count + marbles[2].count}/${total}` },
        { text: `P(Yellow)?`, ans: `0/${total} (Impossible)` },
        { text: `P(Not Red)?`, ans: `${total - marbles[0].count}/${total}` }
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Prediction Engine: Probability"
            emoji="🎲"
            description="Use fractions to express the likelihood of events."
            problemCount={questions.length}
            learningObjectives={[
                'Examine outcomes and calculate probability as a fraction',
                'Understand certain, likely, unlikely, and impossible events',
                'Identify probabilities for compound events (OR/NOT events)'
            ]}
            parentTeacherTips={[
                'Probability is a fraction: (Wanted Outcomes) / (Total Outcomes).',
                'Impossible = 0. Certain = 1.',
                'The sum of all probabilities in a set always equals 1.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Probability Pro"
                subtitle="What are the odds? Predict the future with fractions."
                icons={{
                    bg1: '🎲',
                    bg2: '🃏',
                    float1: '✨',
                    float2: '🔮'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <div className="flex flex-col md:flex-row gap-8 mt-10">
                <div className="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-md">
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-6 text-center">The Marble Jar</h4>
                    <div className="aspect-square bg-slate-50 border-4 border-slate-100 rounded-[4rem] relative p-10 flex flex-wrap gap-2 justify-center content-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent"></div>
                        {marbles.map(m => Array.from({ length: m.count }).map((_, j) => (
                            <div key={`${m.color}-${j}`} className={`w-8 h-8 rounded-full ${m.bg} border-2 border-white/30 shadow-sm animate-bounce`} style={{ animationDelay: `${(j + 1) * 100}ms` }}></div>
                        )))}
                    </div>
                    <div className="mt-8 space-y-2">
                        {marbles.map(m => (
                            <div key={m.color} className="flex items-center justify-between text-sm">
                                <span className="font-bold text-slate-500">{m.color}:</span>
                                <span className="font-mono bg-slate-100 px-2 rounded font-bold">{m.count}</span>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-800">
                            <span>Total:</span>
                            <span>{total}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {questions.map((q, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors">
                            <span className="text-2xl font-black text-indigo-100">{i + 1}</span>
                            <span className="flex-1 text-lg font-bold text-slate-700">{q.text}</span>
                            <div className="w-24 h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center font-mono text-slate-200">
                                ____
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-indigo-900 text-indigo-100 rounded-3xl print:bg-white print:text-black print:border-2">
                    <h3 className="text-lg font-bold mb-6 italic border-b border-indigo-700 pb-2 uppercase tracking-widest">Oracle's Registry: Final Odds</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono">
                        {questions.map((q, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-indigo-400 font-bold text-[10px]">PROB #{i + 1}</span>
                                <span className="text-lg font-bold">{q.ans}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * 5th Grade Mixed Word Problems (Advanced)
 */
export function FifthGradeWordProblems({ seed, variant, showAnswersForDoc, docId: propDocId }: SpecificWorksheetProps) {
    const docId = propDocId || 'multi-step-word-5th';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const type = docId.includes('fraction') ? 'Fraction' :
        docId.includes('decimal') ? 'Decimal' :
            docId.includes('ratio') ? 'Ratio' :
                docId.includes('percent') ? 'Percent' : 'Multi-Step';

    const problems = Array.from({ length: 4 }, () => {
        let text = '', ans = '', steps: string[] = [];
        const id = nextInt(100, 999);

        if (type === 'Fraction') {
            const d = nextInt(3, 8);
            const n = nextInt(1, d - 1);
            const whole = nextInt(10, 30);
            text = `A container holds ${whole} liters of juice. If children drink ${n}/${d} of the juice, how many liters are left?`;
            const drank = ((whole * n) / d).toFixed(1);
            ans = `${(whole - Number(drank)).toFixed(1)} L`;
            steps = [`Total = ${whole} L`, `Drank = ${n}/${d} × ${whole} = ${drank} L`, `Left = ${whole} - ${drank} = ${ans}`];
        } else if (type === 'Decimal') {
            const p1 = (rng() * 20 + 5).toFixed(2);
            const p2 = (rng() * 10 + 2).toFixed(2);
            const qty = nextInt(2, 5);
            text = `A book costs $${p1} and a notebook costs $${p2}. If you buy one book and ${qty} notebooks, what is the total cost?`;
            const total = (Number(p1) + Number(p2) * qty).toFixed(2);
            ans = `$${total}`;
            steps = [`Book = $${p1}`, `Notebooks = ${qty} × $${p2} = $${(Number(p2) * qty).toFixed(2)}`, `Sum = ${total}`];
        } else if (type === 'Ratio') {
            const r1 = nextInt(2, 4);
            const r2 = nextInt(3, 5);
            const mult = nextInt(5, 10);
            text = `The ratio of blue cars to red cars in a lot is ${r1}:${r2}. If there are ${r1 * mult} blue cars, how many red cars are there?`;
            ans = `${r2 * mult} cars`;
            steps = [`Ratio = ${r1}:${r2}`, `Blue = ${r1} × ${mult} = ${r1 * mult}`, `Red = ${r2} × ${mult} = ${ans}`];
        } else if (type === 'Percent') {
            const p = nextInt(1, 4) * 10; // 10, 20, 30, 40%
            const total = nextInt(1, 10) * 50; // 50, 100... 500
            text = `A store is having a ${p}% off sale. A game costs $${total}. How much do you SAVE with the discount?`;
            const save = (total * p) / 100;
            ans = `$${save}`;
            steps = [`Price = $${total}`, `Discount = ${p}%`, `Save = ($${total} × ${p}) / 100 = ${ans}`];
        } else {
            // Multi-Step Multi-Operation
            const boxes = nextInt(5, 12);
            const perBox = nextInt(20, 50);
            const lost = nextInt(10, 30);
            const div = nextInt(2, 4);
            text = `A farmer picks ${boxes} boxes of apples, with ${perBox} apples in each. He finds ${lost} are bruised and throws them away. He packs the rest into ${div} equal bags. How many apples are in each bag?`;
            const total = boxes * perBox;
            const remains = total - lost;
            const final = Math.floor(remains / div);
            ans = `${final} apples`;
            steps = [`Total = ${boxes} × ${perBox} = ${total}`, `Remaining = ${total} - ${lost} = ${remains}`, `Per bag = ${remains} ÷ ${div} = ${final}`];
        }

        return { text, ans, steps, id };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={`Quest of the Quotient: ${type} Problems`}
            emoji="📜"
            description={`Master complex ${type.toLowerCase()} scenarios with multi-step logic.`
            }
            problemCount={problems.length}
            learningObjectives={[
                `Apply ${type} concepts to real-world scenarios`,
                'Deconstruct complex problems into logical steps',
                'Verify solutions using inverse operations'
            ]}
            parentTeacherTips={[
                'Circle the numbers and underline the question.',
                'Draw a bar model or diagram to visualize the relationship.',
                'Always write the final answer with units ($, apples, L).'
            ]}
        >
            <PremiumWorksheetBanner
                title="Quest Master"
                subtitle={`${type} Intelligence Briefing. Success requires precision.`}
                icons={{
                    bg1: '📜',
                    bg2: '🖋️',
                    float1: '✨',
                    float2: '💎'
                }}
                colors={{
                    bg: 'bg-rose-900',
                    border: 'border-rose-700',
                    pillBg: 'bg-rose-800',
                    pillBorder: 'border-rose-600',
                    pillText: 'text-rose-50',
                    accent: 'text-rose-400'
                }}
            />

            <div className="space-y-12 mt-12">
                {problems.map((p, i) => (
                    <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl border-2 border-rose-200 shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-all">
                                {i + 1}
                            </div>
                            <div className="w-1 h-full bg-slate-100 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <p className="text-xl font-medium text-slate-800 leading-relaxed border-l-4 border-rose-50 pl-6">
                                {p.text}
                            </p>
                            <div className="min-h-[160px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30 p-8 relative">
                                <span className="absolute top-4 left-6 text-[10px] uppercase font-bold text-slate-300 tracking-[0.2em]">Calculation Zone</span>
                                <div className="absolute bottom-6 right-6 text-slate-400 font-mono italic">
                                    Result: ___________________
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-16 p-10 bg-rose-50 border-2 border-rose-200 rounded-[3rem] print:bg-white text-sm">
                    <h3 className="text-xl font-bold text-rose-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-xs">A</span>
                        Solution Registry: Verified Verdicts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {problems.map((p, i) => (
                            <div key={i} className="space-y-3 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                                <div className="text-xs font-bold text-rose-400 tracking-widest uppercase">Quest #{p.id}</div>
                                {p.steps.map((s, idx) => (
                                    <div key={idx} className="flex gap-2 text-slate-600 font-mono text-xs">
                                        <span className="text-rose-300">•</span> {s}
                                    </div>
                                ))}
                                <div className="pt-3 border-t border-rose-50 flex items-center justify-between">
                                    <span className="font-bold text-rose-900 text-lg">{p.ans}</span>
                                    <span className="text-[10px] text-slate-300 italic">VERIFIED</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Writing Expressions
 */
export function WritingExpressions({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'writing-expressions';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    const scenarios = [
        { text: (n: number, m: number) => `Add ${n} and ${m}, then multiply by 2`, ans: (n: number, m: number) => `( ${n} + ${m} ) × 2` },
        { text: (n: number, m: number) => `Subtract ${m} from ${n}, then divide by 3`, ans: (n: number, m: number) => `( ${n} - ${m} ) ÷ 3` },
        { text: (n: number, m: number) => `The sum of ${n} and ${m} divided by 5`, ans: (n: number, m: number) => `( ${n} + ${m} ) ÷ 5` },
        { text: (n: number, m: number) => `Multiply the difference of ${n} and ${m} by 4`, ans: (n: number, m: number) => `( ${n} - ${m} ) × 4` }
    ];

    const problems = Array.from({ length: 6 }, () => {
        const s = scenarios[nextInt(0, scenarios.length - 1)];
        const n = nextInt(10, 50);
        const m = nextInt(1, 9);
        return { text: s.text(n, m), ans: s.ans(n, m), id: nextInt(100, 999) };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="The Alchemist's Script: Writing Expressions"
            emoji="✍️"
            description="Translate verbal phrases into numerical expressions using parentheses."
            problemCount={problems.length}
            learningObjectives={[
                'Translate words into numerical expressions',
                'Use parentheses to indicate order of operations',
                'Identify key words for addition, subtraction, multiplication, and division'
            ]}
            parentTeacherTips={[
                '"Then" usually indicates that the previous step needs parentheses.',
                '"Sum" and "Difference" often need to be grouped together.',
                'The goal is NOT to solve, but to write the expression correctly!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Expression Architect"
                subtitle="Draw the blueprint of math. Translate words into symbols."
                icons={{
                    bg1: '✍️',
                    bg2: '📐',
                    float1: '✨',
                    float2: '🧠'
                }}
                colors={{
                    bg: 'bg-indigo-900',
                    border: 'border-indigo-700',
                    pillBg: 'bg-indigo-800',
                    pillBorder: 'border-indigo-600',
                    pillText: 'text-indigo-50',
                    accent: 'text-indigo-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-3xl p-6 bg-white shadow-sm hover:border-indigo-200 transition-colors group">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-indigo-100 text-indigo-600 font-bold px-3 py-1 rounded-full text-xs">#{i + 1}</span>
                        </div>
                        <p className="text-lg font-medium text-slate-700 mb-6 italic">"{p.text}"</p>
                        <div className="h-12 border-b-2 border-dashed border-slate-200 flex items-center px-4 text-slate-300 font-mono">
                            Expression: ________________
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 bg-indigo-50 border-2 border-indigo-200 rounded-3xl print:bg-white text-sm">
                    <h3 className="text-lg font-bold text-indigo-900 mb-6 uppercase">Architect's Key: Verified Scripts</h3>
                    {problems.map((p, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 font-mono">
                            <span className="text-indigo-400 mr-2">#{i + 1}</span> {p.ans}
                        </div>
                    ))}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

/**
 * Adding & Subtracting Fractions (Unlike Denominators)
 */
export function AddSubFractionsUnlike({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'add-sub-fractions-unlike';
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    // Helper to compute GCD
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    // Helper to compute LCM
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

    const problems = Array.from({ length: 8 }, () => {
        let d1 = nextInt(2, 9);
        let d2 = nextInt(2, 9);
        while (d1 === d2 || (d1 % d2 !== 0 && d2 % d1 !== 0 && gcd(d1, d2) === 1 && d1 * d2 > 60)) {
            d1 = nextInt(2, 10);
            d2 = nextInt(2, 10);
        }

        if (d1 === d2) d2 = d1 + 1;

        const n1 = nextInt(1, d1 - 1);
        const n2 = nextInt(1, d2 - 1);

        const isSum = rng() > 0.5;

        const commonD = lcm(d1, d2);
        const newN1 = n1 * (commonD / d1);
        const newN2 = n2 * (commonD / d2);

        let ansN = isSum ? newN1 + newN2 : newN1 - newN2;
        let ansD = commonD;

        if (!isSum && ansN < 0) {
            ansN = Math.abs(ansN);
        }

        const common = gcd(ansN, ansD);
        const finalN = ansN / common;
        const finalD = ansD / common;

        const f1 = { n: n1, d: d1, val: n1 / d1 };
        const f2 = { n: n2, d: d2, val: n2 / d2 };

        let p1 = f1;
        let p2 = f2;

        if (!isSum && f1.val < f2.val) {
            p1 = f2;
            p2 = f1;
        }

        return {
            n1: p1.n, d1: p1.d,
            n2: p2.n, d2: p2.d,
            isSum,
            ansN: finalN, ansD: finalD,
            id: nextInt(100, 999)
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fractions: Unlike Denominators"
            emoji="🍰"
            description="Add or subtract fractions with different denominators. Find the common ground!"
            problemCount={problems.length}
            learningObjectives={[
                'Find common denominators',
                'Add fractions with unlike denominators',
                'Subtract fractions with unlike denominators',
                'Simplify fractions to lowest terms'
            ]}
            parentTeacherTips={[
                'Step 1: Find a common denominator (LCM).',
                'Step 2: Rename the fractions.',
                'Step 3: Add or subtract the numerators.',
                'Step 4: Simplify if possible!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Fraction Fusion"
                subtitle="Mixing slices to make whole new flavors!"
                icons={{
                    bg1: '🥧',
                    bg2: '🍰',
                    float1: '½',
                    float2: '🥣'
                }}
                colors={{
                    bg: 'bg-orange-900',
                    border: 'border-orange-700',
                    pillBg: 'bg-orange-800',
                    pillBorder: 'border-orange-600',
                    pillText: 'text-orange-50',
                    accent: 'text-orange-400'
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-2xl p-6 bg-white flex items-center justify-between gap-4 break-inside-avoid">
                        <div className="flex items-center gap-3 text-2xl font-bold text-slate-700">
                            <div className="flex flex-col items-center">
                                <span className="border-b-2 border-slate-700 w-full text-center px-2">{p.n1}</span>
                                <span>{p.d1}</span>
                            </div>

                            <span>{p.isSum ? '+' : '−'}</span>

                            <div className="flex flex-col items-center">
                                <span className="border-b-2 border-slate-700 w-full text-center px-2">{p.n2}</span>
                                <span>{p.d2}</span>
                            </div>

                            <span>=</span>
                        </div>

                        <div className="flex flex-col items-center w-16 gap-1">
                            <div className="w-12 h-10 border-2 border-slate-300 rounded bg-slate-50 shadow-inner"></div>
                            <div className="w-12 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-12 h-10 border-2 border-slate-300 rounded bg-slate-50 shadow-inner"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl print:bg-white text-sm font-mono">
                    <h3 className="text-lg font-bold text-orange-900 mb-4">Chef's Recipe: Solutions</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {problems.map((p, i) => (
                            <div key={i} className="flex flex-col items-center border p-2 rounded bg-white border-orange-100">
                                <span className="text-xs text-orange-400 mb-1">#{i + 1}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-center leading-none text-xs text-slate-500">
                                        <span className="border-b border-slate-400 pb-0.5">{p.n1}</span>
                                        <span>{p.d1}</span>
                                    </div>
                                    <span>{p.isSum ? '+' : '-'}</span>
                                    <div className="flex flex-col items-center leading-none text-xs text-slate-500">
                                        <span className="border-b border-slate-400 pb-0.5">{p.n2}</span>
                                        <span>{p.d2}</span>
                                    </div>
                                    <span>=</span>
                                    <div className="flex flex-col items-center leading-tight font-bold text-orange-700">
                                        <span className="border-b-2 border-orange-600 px-1">{p.ansN}</span>
                                        <span>{p.ansD}</span>
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


