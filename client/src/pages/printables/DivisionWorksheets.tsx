import React from 'react';
type ReactNode = React.ReactNode;
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
    showAnswersForDoc: (docId: string, render: () => ReactNode) => ReactNode
}

export function LongDivision1Digit({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'long-division-1digit';
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 12 }).map(() => {
        const divisor = nextInt(2, 9);
        const quotient = nextInt(10, 99);
        const remainder = nextInt(0, divisor - 1);
        const dividend = (divisor * quotient) + remainder;
        return { dividend, divisor, quotient, remainder };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Long Division (1-Digit Divisor)')}
            emoji={String.fromCodePoint(0x2797)}
            description={getTrans('description', "Solve each long division problem. Show your work steps clearly.")}
            problemCount={problems.length}
            learningObjectives={[
                'Master long division algorithm',
                'Divide multi-digit numbers by 1-digit numbers',
                'Handle remainders correctly'
            ]}
            parentTeacherTips={[
                'DMSB: Divide, Multiply, Subtract, Bring down',
                'Keep columns aligned carefully',
                'Check answers by multiplying: Quotient x Divisor + Remainder = Dividend'
            ]}
        >
            <PremiumWorksheetBanner
                title="Division Detective"
                subtitle="Mastering the Long Division Method"
                icons={{
                    bg1: "➗",
                    bg2: "📉",
                    float1: "🔍",
                    float2: "📝"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
                    border: "border-teal-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-teal-300",
                    pillText: "text-teal-800",
                    accent: "text-teal-300"
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm break-inside-avoid">
                        <div className="flex items-start justify-center text-2xl font-mono font-bold text-slate-700">
                            <span className="mr-2 mt-1">{p.divisor}</span>
                            <div className="flex flex-col">
                                <span className="border-b-2 border-l-2 border-slate-800 px-2 rounded-tl-md">{p.dividend}</span>
                            </div>
                        </div>
                        <div className="h-24 w-full mt-2 border-t border-dashed border-slate-200"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-emerald-900">{String.fromCodePoint(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-emerald-800">
                        {problems.map((p, i) => (
                            <div key={i}>
                                {i + 1}. {p.quotient} {p.remainder > 0 ? `r${p.remainder}` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function LongDivision2Digit({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'long-division-2digit';
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 8 }).map(() => {
        const divisor = nextInt(11, 25);
        const quotient = nextInt(10, 50);
        const remainder = nextInt(0, divisor - 1);
        const dividend = (divisor * quotient) + remainder;
        return { dividend, divisor, quotient, remainder };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Long Division (2-Digit Divisor)')}
            emoji={String.fromCodePoint(0x1F47E)}
            description={getTrans('description', "Divide numbers by 2-digit divisors. Show all your steps.")}
            problemCount={problems.length}
            learningObjectives={[
                'Divide by 2-digit numbers',
                'Estimate quotients before solving',
                'Practice multi-step division'
            ]}
            parentTeacherTips={[
                'Round the divisor to estimate (e.g., treat 23 as 20)',
                'Use multiplication to check "how many times" it fits',
                'Keep work neat to avoid alignment errors'
            ]}
        >
            <PremiumWorksheetBanner
                title="Double Digit Division"
                subtitle="Advanced Long Division Challenge"
                icons={{
                    bg1: "🔢",
                    bg2: "✖️",
                    float1: "🚀",
                    float2: "🧠"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-violet-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-800",
                    accent: "text-indigo-300"
                }}
            />

            <div className="grid grid-cols-2 gap-10">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white p-8 rounded-xl border-2 border-slate-200 shadow-sm break-inside-avoid">
                        <div className="flex items-start justify-center text-3xl font-mono font-bold text-slate-700">
                            <span className="mr-3 mt-1.5">{p.divisor}</span>
                            <div className="flex flex-col">
                                <span className="border-b-[3px] border-l-[3px] border-slate-800 px-3 rounded-tl-lg">{p.dividend}</span>
                            </div>
                        </div>
                        <div className="h-32 w-full mt-4 border-t border-dashed border-slate-200 bg-slate-50/50 rounded-b-lg"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-indigo-900">{String.fromCodePoint(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-indigo-800">
                        {problems.map((p, i) => (
                            <div key={i}>
                                {i + 1}. {p.quotient} {p.remainder > 0 ? `r${p.remainder}` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function LongDivisionMultiDigit({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'long-division-multidigit';
    const { getTrans, t } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 9 }).map(() => {
        const divisor = nextInt(2, 9);
        const quotient = nextInt(100, 999);
        const remainder = nextInt(0, divisor - 1); // Often no remainder for standard practice, but robust to support it
        const dividend = (divisor * quotient) + remainder;
        return { dividend, divisor, quotient, remainder };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Long Division (Multi-Digit Dividend)')}
            emoji={String.fromCodePoint(0x1F3D7)}
            description={getTrans('description', "Practice dividing larger numbers. Follow the steps carefully for each place value.")}
            problemCount={problems.length}
            learningObjectives={[
                'Divide 3 or 4 digit numbers',
                'Reinforce place value understanding',
                'Build stamina for longer problems'
            ]}
            parentTeacherTips={[
                'One number at a time: focus on the current place value',
                'Bring down the next number only after subtracting',
                'Zeros in the quotient can be tricky - remind them "if it doesn\'t fit, put a zero"'
            ]}
        >
            <PremiumWorksheetBanner
                title="Big Number Builders"
                subtitle="Heavy Lifting Division Mode"
                icons={{
                    bg1: "🏗️",
                    bg2: "🔢",
                    float1: "👷",
                    float2: "📏"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                    border: "border-amber-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-amber-300",
                    pillText: "text-amber-800",
                    accent: "text-amber-300"
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm break-inside-avoid">
                        <div className="flex items-start justify-center text-2xl font-mono font-bold text-slate-700">
                            <span className="mr-2 mt-1">{p.divisor}</span>
                            <div className="flex flex-col">
                                <span className="border-b-2 border-l-2 border-slate-800 px-2 rounded-tl-md">{p.dividend}</span>
                            </div>
                        </div>
                        <div className="h-32 w-full mt-2 border-t border-dashed border-slate-200 bg-amber-50/20 rounded-b-lg"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm font-mono break-inside-avoid">
                    <div className="font-bold mb-2 text-amber-900">{String.fromCodePoint(0x2705)} Answer Key</div>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-amber-800">
                        {problems.map((p, i) => (
                            <div key={i}>
                                {i + 1}. {p.quotient} {p.remainder > 0 ? `r${p.remainder}` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function DivisionFacts({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'div-facts-1-12';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 24 }).map(() => {
        const b = nextInt(1, 12);
        const quotient = nextInt(1, 12);
        const a = b * quotient;
        return { a, b, quotient };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'The Division Depths')}
            emoji="🌊"
            description={getTrans('description', 'Dive deep and solve these basic division facts!')}
            problemCount={problems.length}
            learningObjectives={['Master division facts 1-12', 'Understand relationship between mult/div']}
        >
            <PremiumWorksheetBanner
                title="The Division Depths"
                subtitle="Fact Power Challenge"
                icons={{ bg1: "🌊", bg2: "🐙", float1: "🔱", float2: "💎" }}
                colors={{
                    bg: "bg-gradient-to-br from-blue-600 to-indigo-900",
                    border: "border-blue-400",
                    pillBg: "bg-white/10",
                    pillBorder: "border-blue-300/30",
                    pillText: "text-blue-50",
                    accent: "text-cyan-400"
                }}
            />

            <div className="grid grid-cols-3 md:grid-cols-4 gap-6 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-blue-100 shadow-sm font-mono text-xl">
                        {p.a} ÷ {p.b} = <span className="ml-2 w-10 border-b-2 border-blue-200"></span>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded grid grid-cols-6 gap-2 text-sm font-mono">
                    {problems.map((p, i) => <div key={i}>{i + 1}: {p.quotient}</div>)}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function DivisionWithRemainders({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'div-with-remainders';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 12 }).map(() => {
        const divisor = nextInt(2, 9);
        const dividend = nextInt(10, 80);
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        return { dividend, divisor, quotient, remainder };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'The Remainder Restaurant')}
            emoji="🍕"
            description={getTrans('description', 'Some slices are left over! Solve with remainders.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="The Remainder Restaurant"
                subtitle="Leftover Logic Challenge"
                icons={{ bg1: "🍕", bg2: "🍔", float1: "🥤", float2: "🍟" }}
                colors={{
                    bg: "bg-gradient-to-br from-orange-400 to-red-600",
                    border: "border-orange-300",
                    pillBg: "bg-white/90",
                    pillBorder: "border-orange-200",
                    pillText: "text-orange-900",
                    accent: "text-yellow-400"
                }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border-2 border-orange-100 shadow-sm break-inside-avoid">
                        <div className="text-2xl font-mono text-center mb-4">
                            {p.dividend} ÷ {p.divisor} =
                        </div>
                        <div className="h-20 border-2 border-dashed border-orange-50 rounded-lg flex items-center justify-center text-slate-300 italic text-sm">
                            Show Work
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded grid grid-cols-3 gap-4 text-sm font-mono text-orange-900">
                    {problems.map((p, i) => (
                        <div key={i}>{i + 1}: {p.quotient} r{p.remainder}</div>
                    ))}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function DivisionWordProblems({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'div-word-problems';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 6 }).map(() => {
        const scenarios = [
            { item: 'jewels', container: 'chests', action: 'placed' },
            { item: 'maps', container: 'explorers', action: 'given to' },
            { item: 'artifacts', container: 'museums', action: 'shipped to' }
        ];
        const scenario = scenarios[nextInt(0, 2)];
        const b = nextInt(3, 8);
        const quotient = nextInt(5, 12);
        const a = b * quotient;
        return {
            text: `The Quest for the Golden Quotient leads you to ${a} ${scenario.item}. They must be ${scenario.action} equally into ${b} ${scenario.container}. How many ${scenario.item} go into each one?`,
            ans: `${quotient} ${scenario.item}`,
            a, b, quotient
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Quest for the Golden Quotient')}
            emoji="🔱"
            description={getTrans('description', 'Crack the code with division word problems!')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Golden Quotient Quest"
                subtitle="Ancient Artifact Division"
                icons={{ bg1: "🔱", bg2: "📜", float1: "🗺️", float2: "🏛️" }}
                colors={{
                    bg: "bg-gradient-to-br from-yellow-300 to-amber-600",
                    border: "border-yellow-400",
                    pillBg: "bg-white/90",
                    pillBorder: "border-yellow-300",
                    pillText: "text-amber-900",
                    accent: "text-white"
                }}
            />

            <div className="space-y-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 bg-amber-50 rounded-xl border-l-8 border-amber-500 shadow-sm break-inside-avoid">
                        <p className="text-lg text-slate-800 leading-relaxed mb-4">{p.text}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 bg-white rounded border border-amber-200 p-2 text-[10px] text-amber-300 uppercase font-bold">Calculation Zone</div>
                            <div className="h-24 bg-white rounded border border-amber-200 p-2 text-[10px] text-amber-300 uppercase font-bold text-right">Final Verdict</div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-slate-900 text-amber-400 rounded-xl font-mono text-sm border-2 border-amber-500">
                    <h4 className="font-bold text-amber-500 mb-4 border-b border-amber-900 pb-2 uppercase tracking-widest">Oracle Answer Key</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-amber-600">MISSION {i + 1}:</span>
                                <span>{p.ans} ({p.a} ÷ {p.b} = {p.quotient})</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function DividingBy10And100({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'div-by-10-100';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const problems = Array.from({ length: 20 }).map((_, i) => {
        const is100 = i >= 10;
        const base = nextInt(1, 99);
        const divisor = is100 ? 100 : 10;
        const dividend = base * divisor;
        return { dividend, divisor, quotient: base };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Speedy Division')}
            emoji="⚡"
            description={getTrans('description', 'Master division by 10 and 100 with lightning speed!')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Speedy Division"
                subtitle="Mental Math Power-Up"
                icons={{ bg1: "⚡", bg2: "🏎️", float1: "⏱️", float2: "🚀" }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-400 to-blue-600",
                    border: "border-cyan-300",
                    pillBg: "bg-white/90",
                    pillBorder: "border-cyan-200",
                    pillText: "text-cyan-900",
                    accent: "text-white"
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border-2 border-cyan-100 text-lg font-mono text-center">
                        {p.dividend} ÷ {p.divisor} = ___
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-cyan-50 border border-cyan-200 rounded grid grid-cols-5 gap-2 text-xs font-mono text-cyan-800">
                    {problems.map((p, i) => <div key={i}>{i + 1}: {p.quotient}</div>)}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
