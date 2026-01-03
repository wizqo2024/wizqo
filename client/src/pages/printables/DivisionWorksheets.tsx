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

    console.log('DEBUG: LongDivision1Digit rendering', { docId, problemsCount: problems.length });

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
            <div className="bg-red-500 text-white p-4 text-center font-bold text-xl border-4 border-yellow-400 mb-8">
                DEBUG MODE: IF YOU SEE THIS, THE COMPONENT IS MOUNTING
                <br />
                Problems generated: {problems.length}
            </div>
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
