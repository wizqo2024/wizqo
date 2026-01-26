
import * as React from 'react'
import {
    WorksheetSectionWrapper,
    PremiumWorksheetBanner,
    StrategySpotlight
} from './PrintableShared'
import { makeRng, pick, shuffleArray } from '@/utils/printableUtils'

// Helper for random items
const getRandomItem = <T,>(arr: T[], rng: () => number): T => arr[Math.floor(rng() * arr.length)]

type ShowAnswersFn = (docId: string, content: () => React.ReactNode) => React.ReactNode

interface ThirdGradeProps {
    docId: string
    showAnswersForDoc: ShowAnswersFn
}

// ==========================================
// 1. Fractions on a Number Line
// ==========================================

export const FractionsNumberLine: React.FC<ThirdGradeProps> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 6 }).map((_, i) => {
            const denom = pick([3, 4, 6, 8], rng)
            const num = Math.floor(rng() * (denom - 1)) + 1 // 1 to denom-1
            return { id: i + 1, num, denom }
        })
    }, [docId])

    const renderNumberLine = (num: number, denom: number) => {
        const width = 200
        const startX = 20
        const endX = 220

        // Ticks
        const ticks = []
        for (let i = 0; i <= denom; i++) {
            const x = startX + (i / denom) * width
            const isEnd = i === 0 || i === denom
            ticks.push(
                <line
                    key={i}
                    x1={x} y1={40}
                    x2={x} y2={isEnd ? 60 : 50}
                    className={`stroke-slate-800 ${isEnd ? 'stroke-2' : 'stroke-1'}`}
                />
            )
        }

        // Point
        const pointX = startX + (num / denom) * width

        return (
            <svg viewBox="0 0 240 100" className="w-full">
                {/* Main Line */}
                <line x1={startX} y1={50} x2={endX} y2={50} className="stroke-slate-800 stroke-2" />
                <path d={`M${startX},50 L${startX + 5},45 L${startX + 5},55 Z`} className="fill-slate-800" />
                <path d={`M${endX},50 L${endX - 5},45 L${endX - 5},55 Z`} className="fill-slate-800" />

                {/* Ticks */}
                {ticks}

                {/* Labels 0 and 1 */}
                <text x={startX} y={75} className="text-sm font-bold fill-slate-500 text-anchor-middle">0</text>
                <text x={endX} y={75} className="text-sm font-bold fill-slate-500 text-anchor-middle">1</text>

                {/* The Point */}
                <circle cx={pointX} cy={50} r="6" className="fill-teal-500 stroke-white stroke-2" />

                {/* Question Mark Box */}
                <rect x={pointX - 15} y={10} width="30" height="25" rx="4" className="fill-white stroke-teal-500 stroke-2 border-dashed" />
                <text x={pointX} y={28} className="text-xs font-bold fill-teal-600 text-anchor-middle">?</text>
            </svg>
        )
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fractions on a Number Line"
            description="Identify the fraction shown on the number line."
            learningObjectives={["Represent fractions on a number line", "Understand fractions as parts of a whole distance"]}
            emoji="🐸"
            problemCount={problems.length}
            parentTeacherTips={["Count the total hops from 0 to 1 (Denominator)", "Count how many hops to the dot (Numerator)"]}
        >
            <PremiumWorksheetBanner
                title="Froggy Jumps"
                subtitle="Number Line Fractions"
                icons={{ bg1: "🐸", bg2: "📏", float1: "0", float2: "1" }}
                colors={{
                    bg: "bg-gradient-to-br from-teal-50 to-green-50",
                    border: "border-teal-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-teal-300",
                    pillText: "text-teal-800",
                    accent: "text-teal-300"
                }}
            />
            <StrategySpotlight
                title="Number Line Strategy"
                icon="🐸"
                steps={[
                    { label: "Step 1: Denominator", text: "Count equal spaces between 0 and 1. This is the bottom number." },
                    { label: "Step 2: Numerator", text: "Count hops from 0 to the dot. This is the top number." }
                ]}
                color="emerald"
                className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {problems.map(p => (
                    <div key={p.id} className="border-2 border-slate-200 rounded-xl p-6 bg-white break-inside-avoid">
                        <div className="absolute top-2 left-3 bg-slate-100 text-slate-400 font-bold px-2 rounded-full text-xs">#{p.id}</div>
                        <div className="flex flex-col items-center">
                            {renderNumberLine(p.num, p.denom)}
                            <div className="mt-4 flex items-center gap-2">
                                <span className="font-bold text-slate-600">Fraction:</span>
                                <div className="ml-2 w-16 h-12 border-2 border-slate-300 rounded-lg bg-slate-50"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-teal-50 border-2 border-teal-200 rounded-xl break-before-page">
                    <h3 className="font-bold text-teal-900 mb-4 text-xl">✅ Answer Key</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {problems.map(p => (
                            <div key={p.id} className="bg-white p-2 rounded border border-teal-100 text-center">
                                <span className="font-bold text-teal-800">#{p.id}: </span>
                                <span className="font-mono text-lg">{p.num}/{p.denom}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 2. Fractions as Whole Numbers
// ==========================================

export const FractionsWholeNumbers: React.FC<ThirdGradeProps> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 9 }).map((_, i) => {
            // Mix of types: "3 = ?/1" or "4/4 = ?"
            // Randomly choose type
            const type = rng() > 0.5 ? 'WholeToFrac' : 'FracToWhole'
            const num = rng.int(1, 9)
            return { id: i + 1, type, num }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Whole Number Fractions"
            description="Express whole numbers as fractions and vice versa."
            learningObjectives={["Understand fractions with denominator 1", "Understand fractions where numerator equals denominator", "Convert between whole numbers and fractions"]}
            emoji="1️⃣"
            problemCount={problems.length}
            parentTeacherTips={["Any number over 1 is itself (5/1 = 5)", "Start with visual aids: 3 whole pizzas = 3/1"]}
        >
            <PremiumWorksheetBanner
                title="Whole Number Magic"
                subtitle="Fractions in Disguise"
                icons={{ bg1: "🎩", bg2: "🐇", float1: "1", float2: "1/1" }}
                colors={{
                    bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
                    border: "border-indigo-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-indigo-300",
                    pillText: "text-indigo-800",
                    accent: "text-indigo-300"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {problems.map((p) => (
                    <div key={p.id} className="border-2 border-indigo-100 rounded-xl p-6 bg-white flex flex-col items-center justify-center h-32 relative">
                        <div className="absolute top-2 left-2 text-xs font-bold text-indigo-300">#{p.id}</div>

                        {p.type === 'WholeToFrac' ? (
                            <div className="flex items-center gap-4 text-3xl font-bold font-mono text-slate-700">
                                <span>{p.num}</span>
                                <span>=</span>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-2 border-indigo-300 rounded bg-indigo-50"></div>
                                    <div className="h-0.5 w-8 bg-slate-800 my-1"></div>
                                    <span>1</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-3xl font-bold font-mono text-slate-700">
                                <div className="flex flex-col items-center">
                                    <span>{p.num}</span>
                                    <div className="h-0.5 w-8 bg-slate-800 my-1"></div>
                                    <span>1</span>
                                </div>
                                <span>=</span>
                                <div className="w-12 h-12 border-2 border-indigo-300 rounded bg-indigo-50"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl break-before-page">
                    <h3 className="font-bold text-indigo-900 mb-4 text-xl">✅ Answer Key</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {problems.map((p) => (
                            <div key={p.id} className="bg-white p-2 text-center rounded text-indigo-800">
                                #{p.id}: <strong>{p.num}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 3. Metric Units
// ==========================================

export const MetricUnits: React.FC<ThirdGradeProps> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 8 }).map((_, i) => {
            // Conversions: km->m, m->cm, cm->mm
            const unitType = pick(['km', 'm', 'cm'], rng)
            let val = 0
            let ans = 0
            let label = ''

            if (unitType === 'km') { // to m
                val = rng.int(1, 9)
                ans = val * 1000
                label = `${val} km = ___ m`
            } else if (unitType === 'm') { // to cm
                val = rng.int(1, 9)
                ans = val * 100
                label = `${val} m = ___ cm`
            } else { // cm to mm
                val = rng.int(1, 20)
                ans = val * 10
                label = `${val} cm = ___ mm`
            }
            return { id: i + 1, label, ans }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Metric Measurement"
            description="Convert between metric units (km, m, cm, mm)."
            learningObjectives={["Convert kilometers to meters", "Convert meters to centimeters", "Convert centimeters to millimeters"]}
            emoji="📏"
            problemCount={problems.length}
            parentTeacherTips={["Kilo means 1,000", "Centi means 100 (like century)", "Milli means 1,000 (millimeter is 1/1000th of meter)"]}
        >
            <PremiumWorksheetBanner
                title="Metric Master"
                subtitle="The Power of 10"
                icons={{ bg1: "📏", bg2: "🔬", float1: "km", float2: "mm" }}
                colors={{
                    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
                    border: "border-blue-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-blue-300",
                    pillText: "text-blue-800",
                    accent: "text-blue-300"
                }}
            />

            <StrategySpotlight
                title="Metric Cheat Sheet"
                icon="📏"
                steps={[
                    { label: "1 km", text: "1,000 meters" },
                    { label: "1 m", text: "100 centimeters" },
                    { label: "1 cm", text: "10 millimeters" }
                ]}
                color="blue"
                className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p) => (
                    <div key={p.id} className="border-2 border-slate-200 rounded-xl p-6 bg-white flex items-center justify-between">
                        <div className="text-xl font-bold text-slate-700">{p.label}</div>
                        <div className="text-slate-300 font-bold opacity-20 text-3xl">#{p.id}</div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl break-before-page">
                    <h3 className="font-bold text-blue-900 mb-4 text-xl">✅ Answer Key</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {problems.map((p) => (
                            <div key={p.id} className="bg-white p-2 rounded border border-blue-100 text-center text-blue-800">
                                #{p.id}: <strong>{p.ans}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 4. Money Word Problems
// ==========================================

export const MoneyWordProblems: React.FC<ThirdGradeProps> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 4 }).map((_, i) => {
            const names = ['Lisa', 'Tom', 'Sarah', 'Mike', 'Emma', 'David']
            const items = ['toy', 'book', 'game', 'snack', 'pen', 'hat']
            const name = getRandomItem(names, rng)
            const item = getRandomItem(items, rng)

            const cost = rng.int(2, 8)
            const paid = rng.int(cost + 1, cost + 10)
            const change = paid - cost

            return {
                id: i + 1,
                text: `${name} buys a ${item} for $${cost}. ${name === 'Lisa' || name === 'Sarah' || name === 'Emma' ? 'She' : 'He'} pays with $${paid}. How much change does ${name === 'Lisa' || name === 'Sarah' || name === 'Emma' ? 'she' : 'he'} get?`,
                answer: `$${change}`
            }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Money Word Problems"
            description="Solve word problems involving money conversion and change."
            learningObjectives={["Calculate change from a purchase", "Subtract money amounts", "Solve real-world money problems"]}
            emoji="💵"
            problemCount={problems.length}
            parentTeacherTips={["Count up from the cost to the amount paid to find change", "Example: Cost $3, Paid $5. Count $4, $5. Change is $2."]}
        >
            <PremiumWorksheetBanner
                title="Smart Shopper"
                subtitle="Counting Change"
                icons={{ bg1: "🛒", bg2: "🪙", float1: "$", float2: "¢" }}
                colors={{
                    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
                    border: "border-green-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-green-300",
                    pillText: "text-green-800",
                    accent: "text-green-300"
                }}
            />

            <div className="grid grid-cols-1 gap-6">
                {problems.map((p) => (
                    <div key={p.id} className="border-2 border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-4">
                        <div className="flex justify-between">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Problem {p.id}</div>
                        </div>
                        <div className="text-lg text-slate-700 font-medium">{p.text}</div>
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg h-24 w-full flex items-center justify-center text-slate-400 text-sm">
                            Show Work Here
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="font-bold text-slate-500">Answer:</span>
                            <div className="w-24 border-b-2 border-slate-300 h-8"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl break-before-page">
                    <h3 className="font-bold text-green-900 mb-4 text-xl">✅ Answer Key</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {problems.map((p) => (
                            <div key={p.id} className="bg-white p-3 rounded border border-green-100">
                                <div className="font-bold text-green-800 text-sm mb-1">Problem {p.id}</div>
                                <div className="font-bold text-xl text-slate-700">{p.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
