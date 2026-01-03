import React from 'react'
import {
    WorksheetSectionWrapper,
    PremiumWorksheetBanner,
    StrategySpotlight
} from './printables/PrintableShared'
import { makeRng, pick } from '@/utils/printableUtils'

// Helper for random items
const getRandomItem = <T,>(arr: T[], rng: () => number): T => arr[Math.floor(rng() * arr.length)]

type ShowAnswersFn = (docId: string, content: () => React.ReactNode) => React.ReactNode

// Shared layout for Decimal worksheets
const DecimalLayout: React.FC<{
    title: string
    subtitle: string
    emoji: string
    color: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'fuchsia'
    bannerIcons: { bg1: string; bg2: string; float1: string; float2: string }
    strategy: { title: string; steps: { label: string; text: string }[] }
    children: React.ReactNode
}> = ({ title, subtitle, emoji, color, bannerIcons, strategy, children }) => {

    const colorMap = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-sky-50", border: "border-blue-200", pillBg: "bg-white/80", pillBorder: "border-blue-300", pillText: "text-blue-800", accent: "text-blue-300", darkText: "text-blue-900", lightBg: "bg-blue-50" },
        purple: { bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50", border: "border-purple-200", pillBg: "bg-white/80", pillBorder: "border-purple-300", pillText: "text-purple-800", accent: "text-purple-300", darkText: "text-purple-900", lightBg: "bg-purple-50" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", border: "border-emerald-200", pillBg: "bg-white/80", pillBorder: "border-emerald-300", pillText: "text-emerald-800", accent: "text-emerald-300", darkText: "text-emerald-900", lightBg: "bg-emerald-50" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-orange-50", border: "border-amber-200", pillBg: "bg-white/80", pillBorder: "border-amber-300", pillText: "text-amber-800", accent: "text-amber-300", darkText: "text-amber-900", lightBg: "bg-amber-50" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-pink-50", border: "border-rose-200", pillBg: "bg-white/80", pillBorder: "border-rose-300", pillText: "text-rose-800", accent: "text-rose-300", darkText: "text-rose-900", lightBg: "bg-rose-50" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-violet-50", border: "border-indigo-200", pillBg: "bg-white/80", pillBorder: "border-indigo-300", pillText: "text-indigo-800", accent: "text-indigo-300", darkText: "text-indigo-900", lightBg: "bg-indigo-50" },
        cyan: { bg: "bg-gradient-to-br from-cyan-50 to-sky-50", border: "border-cyan-200", pillBg: "bg-white/80", pillBorder: "border-cyan-300", pillText: "text-cyan-800", accent: "text-cyan-300", darkText: "text-cyan-900", lightBg: "bg-cyan-50" },
        fuchsia: { bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50", border: "border-fuchsia-200", pillBg: "bg-white/80", pillBorder: "border-fuchsia-300", pillText: "text-fuchsia-800", accent: "text-fuchsia-300", darkText: "text-fuchsia-900", lightBg: "bg-fuchsia-50" }
    }[color]

    return (
        <>
            <PremiumWorksheetBanner
                title={title}
                subtitle={subtitle}
                icons={bannerIcons}
                colors={colorMap}
            />
            <StrategySpotlight
                title={strategy.title}
                icon={emoji}
                steps={strategy.steps}
                color={color}
                className="mb-8"
            />
            {children}
        </>
    )
}

// ==========================================
// 1. Decimals Place Value
// ==========================================

export const DecimalsPlaceValue: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

        return Array.from({ length: 9 }).map((_, i) => {
            const whole = nextInt(1, 99)
            const tenths = nextInt(0, 9)
            const hundredths = nextInt(0, 9)
            return { id: i + 1, value: `${whole}.${tenths}${hundredths}`, whole, tenths, hundredths }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Decimals: Place Value"
            description="Identify the value of digits in decimal numbers (Tenths & Hundredths)."
            learningObjectives={["Identify tenths and hundredths place", "Read decimal numbers correctly", "Understanding decimal place value"]}
            emoji="🎯"
            problemCount={problems.length}
            parentTeacherTips={["The first spot after the dot is Tenths (1/10)", "The second spot is Hundredths (1/100)", "Think of money: $1.25 is 1 dollar, 2 dimes (tenths), 5 pennies (hundredths)"]}
        >
            <DecimalLayout
                title="Decimal Detective"
                subtitle="Spot the Place Value!"
                emoji="🎯"
                color="indigo"
                bannerIcons={{ bg1: "🔢", bg2: "🎯", float1: ".", float2: "1/10" }}
                strategy={{
                    title: "Place Value Map",
                    steps: [
                        { label: "Left of Dot", text: "Whole Numbers (Ones, Tens)" },
                        { label: ".", text: "Decimal Point (AND)" },
                        { label: "1st Right", text: "Tenths (dimes)" },
                        { label: "2nd Right", text: "Hundredths (pennies)" }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-indigo-50 px-3 py-1 rounded-bl-lg text-xs font-bold text-indigo-400">#{prob.id}</div>
                            <div className="text-center mb-4 mt-2">
                                <div className="text-3xl font-mono font-bold text-slate-700 tracking-wider">
                                    {prob.value}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tenths Place?</div>
                                    <div className="h-8 border-b-2 border-dashed border-indigo-200"></div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Hundredths Place?</div>
                                    <div className="h-8 border-b-2 border-dashed border-indigo-200"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl break-before-page">
                        <div className="font-bold text-indigo-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-indigo-100">
                                    <div className="font-bold text-indigo-800 mb-1">#{p.id}: {p.value}</div>
                                    <div className="text-sm space-y-1">
                                        <div>Tenths: <span className="font-bold text-indigo-600">{p.tenths}</span></div>
                                        <div>Hundredths: <span className="font-bold text-indigo-600">{p.hundredths}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </DecimalLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 2. Comparing Decimals
// ==========================================

export const ComparingDecimals: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

        return Array.from({ length: 9 }).map((_, i) => {
            const isTrick = rng() > 0.6
            let d1, d2

            if (isTrick) {
                // Generate tricky pairs like 0.4 vs 0.40 or 0.5 vs 0.05
                const base = nextInt(1, 9)
                if (rng() > 0.5) {
                    d1 = base / 10
                    d2 = base / 100
                } else {
                    d1 = base / 10
                    d2 = base / 10
                }
            } else {
                d1 = nextInt(1, 99) / 10
                d2 = nextInt(1, 99) / 10
            }
            // Ensure not equal too often
            if (d1 === d2 && rng() > 0.2) d2 += 0.1

            return {
                id: i + 1,
                d1: d1.toFixed(d1 % 1 === 0 ? 0 : d1 * 10 % 1 === 0 ? 1 : 2),
                d2: d2.toFixed(d2 % 1 === 0 ? 0 : d2 * 10 % 1 === 0 ? 1 : 2),
                val1: d1,
                val2: d2
            }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Comparing Decimals"
            description="Compare decimal numbers using <, >, or =."
            learningObjectives={["Compare decimals using symbols", "Understand decimal magnitude", "Ordering decimal numbers"]}
            emoji="⚖️"
            problemCount={problems.length}
            parentTeacherTips={["Line up the decimal points to compare", "Add 'magic zeroes' to make them the same length (0.4 vs 0.35 -> 0.40 vs 0.35)", "Compare biggest place value first (left to right)"]}
        >
            <DecimalLayout
                title="Decimal Showdown"
                subtitle="Which is Greater?"
                emoji="⚖️"
                color="rose"
                bannerIcons={{ bg1: ">", bg2: "<", float1: "=", float2: "Total" }}
                strategy={{
                    title: "Comparison Strategies",
                    steps: [
                        { label: "1. Line Up", text: "Stack the numbers by the decimal point." },
                        { label: "2. Fill Zeros", text: "Make them the same length (0.5 -> 0.50)." },
                        { label: "3. Compare", text: "Look from left to right like alphabetizing." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-4">
                                <div className="text-2xl font-mono font-bold text-slate-700">{prob.d1}</div>
                                <div className="w-12 h-12 border-2 border-rose-200 rounded-full flex items-center justify-center bg-rose-50 text-rose-300 font-bold text-xl">?</div>
                                <div className="text-2xl font-mono font-bold text-slate-700">{prob.d2}</div>
                            </div>
                            <div className="w-full flex justify-between text-xs text-slate-400 px-2">
                                <div>Write &lt;, &gt;, or =</div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                                <div className="text-[10px] text-slate-400 uppercase font-bold text-center mb-1">Stack needed?</div>
                                <div className="flex justify-center gap-4 text-sm font-mono text-slate-300">
                                    <div className="flex flex-col items-end">
                                        <div>{prob.d1}</div>
                                        <div>{prob.d2}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-rose-50 border-2 border-rose-200 rounded-xl break-before-page">
                        <div className="font-bold text-rose-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-3 gap-4">
                            {problems.map((p) => {
                                const sym = p.val1 > p.val2 ? '>' : p.val1 < p.val2 ? '<' : '='
                                return (
                                    <div key={p.id} className="bg-white p-3 rounded border border-rose-100 text-center">
                                        <div className="font-mono font-bold text-rose-800">
                                            {p.d1} <span className="text-rose-600 bg-rose-100 px-1 rounded">{sym}</span> {p.d2}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </DecimalLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 3. Adding & Subtracting Decimals
// ==========================================

export const AddSubDecimals: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

        return Array.from({ length: 9 }).map((_, i) => {
            const op = rng() > 0.5 ? '+' : '-'
            // Generate numbers with diverse lengths for practice lining up
            const n1Whole = nextInt(0, 50)
            const n1Dec = nextInt(1, 99)
            const n2Whole = nextInt(0, 40)
            const n2Dec = nextInt(1, 99)

            let v1 = parseFloat(`${n1Whole}.${n1Dec}`)
            let v2 = parseFloat(`${n2Whole}.${n2Dec}`)

            // Ensure positive result for subtraction
            if (v1 < v2) [v1, v2] = [v2, v1]

            return {
                id: i + 1,
                n1: v1.toFixed(2),
                n2: v2.toFixed(2),
                op,
                ans: op === '+' ? (v1 + v2).toFixed(2) : (v1 - v2).toFixed(2)
            }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Add & Subtract Decimals"
            description="Practice adding and subtracting decimals. Remember to line up the dots!"
            learningObjectives={["Align decimal points correctly", "Add decimals with regrouping", "Subtract decimals with borrowing"]}
            emoji="➕"
            problemCount={problems.length}
            parentTeacherTips={["The Golden Rule: LINE UP THE DOTS!", "Fill empty spots with 0 placeholders", "Drop the decimal point straight down into the answer"]}
        >
            <DecimalLayout
                title="Decimal Operations"
                subtitle="Line 'Em Up!"
                emoji="➕"
                color="cyan"
                bannerIcons={{ bg1: "➕", bg2: "➖", float1: ".", float2: "=" }}
                strategy={{
                    title: "Operation Rules",
                    steps: [
                        { label: "1. Line Up", text: "Stack numbers so decimal points are perfectly aligned." },
                        { label: "2. Drop Down", text: "Put the decimal point in the answer line immediately." },
                        { label: "3. Solve", text: "Add or subtract like normal whole numbers." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white">
                            <div className="text-right font-mono text-2xl tracking-widest leading-relaxed">
                                <div>{prob.n1}</div>
                                <div className="border-b-4 border-slate-800 relative">
                                    <span className="absolute left-0 -bottom-1">{prob.op}</span>
                                    {prob.n2}
                                </div>
                                <div className="h-12 mt-2 bg-slate-50 rounded border border-slate-100"></div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-xl break-before-page">
                        <div className="font-bold text-cyan-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-cyan-100 text-center font-mono">
                                    <span className="text-cyan-800 font-bold">{p.ans}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </DecimalLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 4. Fractions to Decimals
// ==========================================

export const FractionsToDecimals: React.FC<{
    docId: string
    variant?: 'mixed' | 'tenths' | 'division'
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, variant = 'mixed', showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }

        return Array.from({ length: variant === 'mixed' ? 8 : 10 }).map((_, i) => {
            let num, denom
            if (variant === 'tenths') {
                denom = 10
                num = nextInt(1, 9)
            } else if (variant === 'division') {
                denom = [4, 5, 8, 20, 25, 40][nextInt(0, 5)]
                num = nextInt(1, denom - 1)
            } else {
                denom = [2, 4, 5, 10, 20][nextInt(0, 4)]
                num = nextInt(1, denom - 1)
            }
            return {
                id: i + 1,
                num,
                denom,
                decimal: (num / denom).toFixed(variant === 'division' ? 3 : 2).replace(/\.?0+$/, '') // trim trailing zeros
            }
        })
    }, [docId, variant])

    const titleMap = {
        mixed: "Fractions to Decimals",
        tenths: "Fractions to Decimals: Tenths",
        division: "Fractions to Decimals: Division"
    }

    const tipMap = {
        mixed: ["Think of money: 1/4 is a quarter (0.25)", "Divide numerator by denominator"],
        tenths: ["Since denominator is 10, just use one decimal place", "7/10 is literally 0.7"],
        division: ["Set up long division: Top ÷ Bottom", "Add a decimal and zeros inside the house"]
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={titleMap[variant]}
            description="Convert the fractions into decimal numbers."
            learningObjectives={["Convert fractions to decimals", "Understand fraction-decimal equivalency", "Perform division to find decimal values"]}
            emoji="🍰"
            problemCount={problems.length}
            parentTeacherTips={tipMap[variant]}
        >
            <DecimalLayout
                title="Fraction Transformers"
                subtitle="Convert to Decimals"
                emoji="🍰"
                color="fuchsia"
                bannerIcons={{ bg1: "🍰", bg2: "➗", float1: "¼", float2: "0.25" }}
                strategy={{
                    title: "Conversion Magic",
                    steps: [
                        { label: "Method 1", text: "Say it out loud! 3/10 is 'three tenths' -> 0.3" },
                        { label: "Method 2", text: "Divide! Top number goes inside the box." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white flex items-center justify-between px-8">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold border-b-2 border-slate-800 px-2">{prob.num}</span>
                                <span className="text-2xl font-bold px-2">{prob.denom}</span>
                            </div>
                            <div className="text-3xl text-slate-300 font-light">=</div>
                            <div className="w-32 h-16 border-2 border-dashed border-slate-300 rounded bg-slate-50 flex items-center justify-center">
                                <span className="text-slate-200 font-bold">0.__</span>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl break-before-page">
                        <div className="font-bold text-fuchsia-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-fuchsia-100 text-center">
                                    <div className="text-sm text-slate-500 mb-1">{p.num}/{p.denom}</div>
                                    <div className="font-bold text-fuchsia-600 font-mono">{p.decimal}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </DecimalLayout>
        </WorksheetSectionWrapper>
    )
}
