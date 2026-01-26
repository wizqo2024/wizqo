import React from 'react';
type ReactNode = React.ReactNode;
import { useTranslation } from '@/context/TranslationContext';
import { makeRng, pick, pickNUnique, shuffleArray } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';
import { SpecificWorksheetProps } from '../../types/printable';

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

export function FactorsMultiples({ seed, variant, showAnswers, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'factors-multiples';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    // Generate Factor Problems
    const factorProblems = pickNUnique(
        Array.from({ length: 39 }, (_, i) => i + 12),
        6,
        rng
    ).map(num => {
        const factors = [];
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) factors.push(i);
        }
        return { type: 'factors', num, answer: factors.join(', ') };
    });

    // Generate Multiple Problems
    const multipleProblems = pickNUnique(
        Array.from({ length: 8 }, (_, i) => i + 2),
        6,
        rng
    ).map(num => {
        const multiples = [];
        for (let i = 1; i <= 5; i++) {
            multiples.push(num * i);
        }
        return { type: 'multiples', num, answer: multiples.join(', ') };
    });

    const problems = shuffleArray([...factorProblems, ...multipleProblems], rng);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Factors & Multiples Factory')}
            emoji="🏭"
            description={getTrans('description', 'Find all factors for large numbers and first 5 multiples for small numbers.')}
            problemCount={problems.length}
            learningObjectives={[
                'Distinguish between factors and multiples',
                'Find all factors of a whole number',
                'List multiples of a number'
            ]}
        >
            <PremiumWorksheetBanner
                title="Factor Factory"
                subtitle="Multiples Production Line"
                icons={{ bg1: "🏭", bg2: "⚙️", float1: "🔧", float2: "🔩" }}
                colors={{
                    bg: "bg-gradient-to-br from-slate-200 to-zinc-300",
                    border: "border-slate-400",
                    pillBg: "bg-white/80",
                    pillBorder: "border-slate-500",
                    pillText: "text-slate-800",
                    accent: "text-orange-500"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm break-inside-avoid">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">#{i + 1}</span>
                            <h3 className="font-bold text-slate-700 text-lg">
                                {p.type === 'factors' ? `Find all factors of ${p.num}` : `List first 5 multiples of ${p.num}`}
                            </h3>
                        </div>
                        <div className="h-24 w-full border-b-2 border-slate-100 bg-slate-50/50 rounded-lg flex items-center justify-center p-4">
                            {showAnswers ? (
                                <div className="text-xl font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 shadow-sm animate-in fade-in zoom-in duration-300">
                                    {p.answer}
                                </div>
                            ) : (
                                <div className="w-full border-b border-slate-300 border-dashed mb-2 mt-auto"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-slate-100 border-2 border-slate-300 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider">Quality Control: Answer Key</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="flex gap-2 text-sm text-slate-700 font-mono">
                                <span className="font-bold">#{i + 1}:</span>
                                <span>{p.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function PrimeComposite({ seed, variant, showAnswers, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'prime-composite';
    const { getTrans } = useWorksheetTranslation(docId);
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    function isPrime(num: number) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
        return num > 1;
    }

    const problems = Array.from({ length: 12 }).map(() => {
        const num = nextInt(2, 50);
        return { num, answer: isPrime(num) ? 'Prime' : 'Composite' };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Prime vs. Composite Challenge')}
            emoji="🛡️"
            description={getTrans('description', 'Identify whether each number is Prime or Composite.')}
            problemCount={problems.length}
            learningObjectives={[
                'Define prime and composite numbers',
                'Identify prime numbers up to 50',
                'Understand factors'
            ]}
        >
            <PremiumWorksheetBanner
                title="Prime Defenders"
                subtitle="Composite Castle"
                icons={{ bg1: "🛡️", bg2: "🏰", float1: "⚔️", float2: "🏳️" }}
                colors={{
                    bg: "bg-gradient-to-br from-red-50 to-rose-50",
                    border: "border-red-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-red-300",
                    pillText: "text-red-900",
                    accent: "text-red-400"
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border-2 border-rose-100 shadow-sm flex flex-col items-center gap-3 break-inside-avoid">
                        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-2xl font-black text-rose-500 border-2 border-rose-200">
                            {p.num}
                        </div>
                        <div className="w-full flex justify-between items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${showAnswers && p.answer === 'Prime' ? 'bg-rose-500 border-rose-600 text-white scale-110 shadow-md' : 'border-slate-300'}`}>P</div>
                            <div className="flex-1 border-b border-slate-200"></div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${showAnswers && p.answer === 'Composite' ? 'bg-rose-500 border-rose-600 text-white scale-110 shadow-md' : 'border-slate-300'}`}>C</div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-rose-50 border-2 border-rose-200 rounded-xl">
                    <h3 className="font-bold text-rose-900 mb-4">Command Center: Answer Key</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {problems.map((p, i) => (
                            <div key={i} className="text-sm text-rose-800">
                                <span className="font-bold">{p.num}:</span> {p.answer}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
