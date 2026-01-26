import React from 'react';
type ReactNode = React.ReactNode;
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared';

interface SpecificWorksheetProps {
    docId?: string;
    activeDocs?: string[];
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode;
    seed: string;
    variant: number;
}

// Helper to render circle fraction
const renderFractionCircle = (numerator: number, denominator: number, size = 60, color = "#4f46e5") => {
    const radius = size / 2;
    const center = size / 2;

    // SVG path construction
    const createSlicePath = (startAngle: number, endAngle: number) => {
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);
        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
    };

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="1" />
            {Array.from({ length: denominator }).map((_, i) => {
                const angle = 360 / denominator;
                const active = i < numerator;
                return (
                    <path
                        key={i}
                        d={createSlicePath(i * angle, (i + 1) * angle)}
                        fill={active ? color : "white"}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                    />
                );
            })}
        </svg>
    );
};

export function EquivFractions4th({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const docId = 'equivalent-fractions-4th';
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    const problems = Array.from({ length: 6 }).map(() => {
        const baseNum = Math.floor(rng() * 4) + 1;
        const baseDenom = baseNum + Math.floor(rng() * 3) + 1; // Proper fraction
        const multiplier = Math.floor(rng() * 3) + 2; // 2 or 3 or 4
        return {
            num: baseNum,
            denom: baseDenom,
            multiplier,
            targetNum: baseNum * multiplier,
            targetDenom: baseDenom * multiplier
        };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Equivalent Fractions: Magic Potions"
            emoji="🧪"
            description="Find the missing numbers to make the fractions equal."
            problemCount={problems.length}
            learningObjectives={[
                'Generate equivalent fractions using multiplication',
                'Understand that multiplying numerator and denominator by same number maintains value',
                'Visualizing equivalence with models'
            ]}
            parentTeacherTips={[
                'Golden Rule: What you do to the top, you must do to the bottom!',
                'Use multiplication to find the missing numbers',
                'Check answers by simplifying back to the original fraction'
            ]}
        >
            <PremiumWorksheetBanner
                title="Potion Brewing"
                subtitle="Equivalent Formulations"
                icons={{ bg1: "🧪", bg2: "⚗️", float1: "✨", float2: "📜" }}
                colors={{
                    bg: "bg-gradient-to-br from-purple-900 to-indigo-900",
                    border: "border-purple-500",
                    pillBg: "bg-purple-800/50",
                    pillBorder: "border-purple-400",
                    pillText: "text-purple-100",
                    accent: "text-yellow-400"
                }}
            />

            <StrategySpotlight
                title="The Golden Rule"
                icon="✨"
                steps={[
                    { label: "Top & Bottom", text: "Multiply both by the SAME magic number." },
                    { label: "Example", text: "1/2 × 2/2 = 2/4. They are equal!" }
                ]}
                color="purple"
                className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm flex items-center justify-between">
                        <div className="flex flex-col items-center gap-2">
                            {renderFractionCircle(p.num, p.denom, 60, "#9333ea")}
                            <div className="font-bold text-2xl text-purple-900 flex flex-col items-center">
                                <span>{p.num}</span>
                                <span className="h-0.5 w-8 bg-purple-900 my-1 rounded-full"></span>
                                <span>{p.denom}</span>
                            </div>
                        </div>

                        <div className="text-3xl text-purple-300 font-bold">=</div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="border border-dashed border-purple-300 rounded p-1 opacity-50">
                                {renderFractionCircle(p.targetNum, p.targetDenom, 60, "#a855f7")}
                            </div>
                            <div className="font-bold text-2xl text-purple-900 flex flex-col items-center">
                                <div className="w-10 h-10 border-2 border-dashed border-purple-400 rounded bg-purple-50 flex items-center justify-center text-purple-600"></div>
                                <span className="h-0.5 w-8 bg-purple-900 my-1 rounded-full"></span>
                                <span>{p.targetDenom}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answer Key</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {problems.map((p, i) => (
                            <div key={i}>#{i + 1}: <strong>{p.targetNum}</strong> (Multiplier: x{p.multiplier})</div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function ComparingFractions4th({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const docId = 'comparing-fractions-4th';
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    const problems = Array.from({ length: 6 }).map(() => {
        // Strategy: Same Denominator OR Same Numerator for 4th grade
        const type = rng() > 0.5 ? 'denom' : 'num';
        const num1 = Math.floor(rng() * 8) + 1;
        const den1 = Math.floor(rng() * 6) + 3; // 3-9

        // Ensure proper fractions for simplicity mainly
        let validNum1 = num1 >= den1 ? den1 - 1 : num1;
        if (validNum1 < 1) validNum1 = 1;

        let num2 = validNum1;
        let den2 = den1;

        if (type === 'denom') {
            // Same denom, diff num
            num2 = Math.floor(rng() * (den1 - 1)) + 1;
            while (num2 === validNum1) num2 = Math.floor(rng() * (den1 - 1)) + 1;
        } else {
            // Same num, diff denom
            den2 = Math.floor(rng() * 6) + 3;
            while (den2 === den1) den2 = Math.floor(rng() * 6) + 3;
            // Ensure proper
            if (validNum1 >= den2) den2 = validNum1 + 1;
        }

        return { num1: validNum1, den1, num2: num2, den2 };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Hungry Gator: Comparing Fractions"
            emoji="🐊"
            description="Compare the fractions using <, >, or =."
            problemCount={problems.length}
            learningObjectives={['Compare fractions with same denominators', 'Compare fractions with same numerators', 'Understand fraction concepts']}
            parentTeacherTips={['Gator eats the bigger number!', 'Same Denominator? Look at the top numbers.', 'Same Numerator? Smaller denominator is bigger pieces!']}
        >
            <PremiumWorksheetBanner
                title="Hungry Gator Swamp"
                subtitle="Who has more?"
                icons={{ bg1: "🐊", bg2: "💧", float1: "🥩", float2: "📏" }}
                colors={{
                    bg: "bg-gradient-to-br from-green-700 to-teal-800",
                    border: "border-green-500",
                    pillBg: "bg-green-800/50",
                    pillBorder: "border-green-400",
                    pillText: "text-green-100",
                    accent: "text-yellow-300"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-green-50 p-6 rounded-xl border border-green-200">
                        {/* Fraction 1 */}
                        <div className="flex flex-col items-center">
                            {renderFractionCircle(p.num1, p.den1, 50, "#15803d")}
                            <div className="font-bold text-2xl mt-2 flex flex-col items-center leading-none">
                                <span>{p.num1}</span>
                                <span className="w-6 h-0.5 bg-black my-1"></span>
                                <span>{p.den1}</span>
                            </div>
                        </div>

                        {/* Comparison Box */}
                        <div className="w-12 h-12 bg-white border-2 border-green-400 rounded-lg shadow-inner"></div>

                        {/* Fraction 2 */}
                        <div className="flex flex-col items-center">
                            {renderFractionCircle(p.num2, p.den2, 50, "#15803d")}
                            <div className="font-bold text-2xl mt-2 flex flex-col items-center leading-none">
                                <span>{p.num2}</span>
                                <span className="w-6 h-0.5 bg-black my-1"></span>
                                <span>{p.den2}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answer Key</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {problems.map((p, i) => {
                            const val1 = p.num1 / p.den1;
                            const val2 = p.num2 / p.den2;
                            const sign = val1 > val2 ? ">" : val1 < val2 ? "<" : "=";
                            return <div key={i}>#{i + 1}: <strong>{sign}</strong></div>
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function AddSubFractions4th({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const docId = 'add-sub-fractions-4th';
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    const problems = Array.from({ length: 6 }).map(() => {
        const denom = Math.floor(rng() * 8) + 3; // 3-10
        const task = rng() > 0.5 ? 'add' : 'sub';

        let num1, num2;
        if (task === 'add') {
            num1 = Math.floor(rng() * (denom - 2)) + 1;
            num2 = Math.floor(rng() * (denom - num1)) + 1;
        } else {
            num1 = Math.floor(rng() * (denom - 2)) + 2;
            num2 = Math.floor(rng() * (num1 - 1)) + 1;
        }
        return { num1, num2, denom, task };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fraction Bakery: Add & Subtract"
            emoji="🍪"
            description="Add or subtract the fractions with like denominators."
            problemCount={problems.length}
            learningObjectives={['Add fractions with like denominators', 'Subtract fractions with like denominators', 'Understand denominator stays the same']}
            parentTeacherTips={['Only add/subtract the top numbers (numerators)', 'The bottom number (denominator) stays the same!', 'Think of slices of pie/pizza']}
        >
            <PremiumWorksheetBanner
                title="Bakery Math"
                subtitle="Fresh Fractions"
                icons={{ bg1: "🍪", bg2: "🍰", float1: "👩‍🍳", float2: "🥯" }}
                colors={{
                    bg: "bg-gradient-to-br from-amber-700 to-orange-800",
                    border: "border-amber-500",
                    pillBg: "bg-amber-900/50",
                    pillBorder: "border-amber-400",
                    pillText: "text-amber-100",
                    accent: "text-white"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-center p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
                        <div className="flex items-center gap-4 font-bold text-2xl text-amber-900">
                            <div className="flex flex-col items-center">
                                <span>{p.num1}</span>
                                <span className="w-8 h-0.5 bg-amber-900"></span>
                                <span>{p.denom}</span>
                            </div>
                            <div className="text-3xl">{p.task === 'add' ? '+' : '-'}</div>
                            <div className="flex flex-col items-center">
                                <span>{p.num2}</span>
                                <span className="w-8 h-0.5 bg-amber-900"></span>
                                <span>{p.denom}</span>
                            </div>
                            <div className="text-3xl">=</div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 border border-dashed border-amber-400 rounded bg-white"></div>
                                <span className="w-8 h-0.5 bg-amber-900 my-1"></span>
                                <span>{p.denom}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answer Key</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {problems.map((p, i) => {
                            const ans = p.task === 'add' ? p.num1 + p.num2 : p.num1 - p.num2;
                            return <div key={i}>#{i + 1}: <strong>{ans}/{p.denom}</strong></div>
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );

}

export function MixedImproperFractions({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const docId = 'mixed-improper-fractions';
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    const problems = Array.from({ length: 6 }).map(() => {
        const whole = Math.floor(rng() * 3) + 1; // 1 to 3
        const denom = Math.floor(rng() * 4) + 2; // 2, 3, 4, 5
        const num = Math.floor(rng() * (denom - 1)) + 1; // 1 to denom-1

        const improperNum = (whole * denom) + num;

        // Randomly decide direction: mixed -> improper OR improper -> mixed
        const type = rng() > 0.5 ? 'toImproper' : 'toMixed';

        return { whole, num, denom, improperNum, type };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Mixed Numbers & Improper Fractions"
            emoji="🍕"
            description="Convert between mixed numbers and improper fractions."
            problemCount={problems.length}
            learningObjectives={['Convert mixed numbers to improper fractions', 'Convert improper fractions to mixed numbers', 'Visualize fractional parts greater than 1']}
            parentTeacherTips={['Multiply whole number by bottom number, then add top number!', 'Divide top by bottom. The remainder is the new top number.', 'Think of full pizzas plus extra slices.']}
        >
            <PremiumWorksheetBanner
                title="Pizza Party Fractions"
                subtitle="Whole & Parts"
                icons={{ bg1: "🍕", bg2: "🥧", float1: "🔢", float2: "🔄" }}
                colors={{
                    bg: "bg-gradient-to-br from-orange-600 to-red-700",
                    border: "border-orange-500",
                    pillBg: "bg-orange-800/50",
                    pillBorder: "border-orange-400",
                    pillText: "text-orange-100",
                    accent: "text-yellow-300"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200 flex flex-col items-center break-inside-avoid">
                        <div className="flex items-center gap-4 mb-4">
                            {/* Visuals */}
                            <div className="flex gap-2">
                                {Array.from({ length: p.whole }).map((_, w) => (
                                    <div key={w}>{renderFractionCircle(p.denom, p.denom, 40, "#c2410c")}</div>
                                ))}
                                <div>{renderFractionCircle(p.num, p.denom, 40, "#c2410c")}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-2xl font-bold text-orange-900">
                            {p.type === 'toImproper' ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl">{p.whole}</span>
                                        <div className="flex flex-col items-center leading-none">
                                            <span>{p.num}</span>
                                            <span className="w-6 h-0.5 bg-orange-900 my-1"></span>
                                            <span>{p.denom}</span>
                                        </div>
                                    </div>
                                    <div className="text-orange-400">→</div>
                                    <div className="flex flex-col items-center leading-none">
                                        <div className="w-10 h-10 border-b-2 border-orange-900 bg-white/50 rounded-t flex items-center justify-center"></div>
                                        <div className="w-10 h-10 bg-white/50 rounded-b flex items-center justify-center">{p.denom}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center leading-none">
                                        <span>{p.improperNum}</span>
                                        <span className="w-8 h-0.5 bg-orange-900 my-1"></span>
                                        <span>{p.denom}</span>
                                    </div>
                                    <div className="text-orange-400">→</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-12 border border-dashed border-orange-400 rounded bg-white flex items-center justify-center"></div>
                                        <div className="flex flex-col items-center leading-none">
                                            <div className="w-8 h-8 border-b border-orange-900 bg-white/50 flex items-center justify-center text-sm"></div>
                                            <div className="w-8 h-8 bg-white/50 flex items-center justify-center text-sm">{p.denom}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answer Key</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {problems.map((p, i) => (
                            <div key={i}>
                                #{i + 1}: {p.type === 'toImproper'
                                    ? <strong>{p.improperNum}/{p.denom}</strong>
                                    : <strong>{p.whole} {p.num}/{p.denom}</strong>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function FractionBasicID({ docId = 'fractions-halves-thirds-fourths', showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    // Simple identification: Halves (1/2), Thirds (1/3, 2/3), Fourths (1/4, 2/4, 3/4)
    const problems = Array.from({ length: 6 }).map(() => {
        const denom = [2, 3, 4][Math.floor(rng() * 3)];
        const num = Math.floor(rng() * (denom - 1)) + 1; // 1 to denom-1 (proper fraction)
        return { num, denom };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Fraction Fun: Halves, Thirds, Fourths')}
            emoji="🍰"
            description={t(`worksheets.${docId}.description`, 'Color the correct parts or write the fraction shown.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Fraction Identification"
                subtitle="Halves, Thirds, Fourths"
                icons={{ bg1: "🍰", bg2: "🍕", float1: "½", float2: "¼" }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
                    border: "border-pink-400",
                    pillBg: "bg-pink-700/50",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-100",
                    accent: "text-yellow-300"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col items-center p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm break-inside-avoid">
                        <div className="mb-4">
                            {renderFractionCircle(p.num, p.denom, 80, "#ec4899")}
                        </div>
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Write the Fraction</div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-10 border-2 border-slate-300 rounded bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-700 shadow-inner"></div>
                                <div className="w-12 h-0.5 bg-slate-400 my-1"></div>
                                <div className="w-12 h-10 border-2 border-slate-300 rounded bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-700 shadow-inner"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answer Key</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {problems.map((p, i) => (
                            <div key={i}>#{i + 1}: <strong>{p.num}/{p.denom}</strong></div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
