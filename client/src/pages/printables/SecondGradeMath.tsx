import * as React from 'react'
type ReactNode = React.ReactNode
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared'
import { makeRng } from '@/utils/printableUtils'

interface SpecificWorksheetProps {
    docId?: string
    activeDocs?: string[]
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
    seed: string
    variant: number
}

// ==========================================
// Expanded Form (Numbers to 200)
// ==========================================
export function ExpandedForm200({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'expanded-form-200'

    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 12 }, () => {
        // Mostly 3 digits (100-199), some 2 digits (50-99) for variety if desired, 
        // but title says '200' so focus on 100-200 range generally.
        // Let's mix: 80% 100-199, 20% 50-99
        if (rng() > 0.2) {
            return nextInt(100, 199)
        } else {
            return nextInt(50, 99)
        }
    })

    const getExpanded = (n: number) => {
        const hundreds = Math.floor(n / 100) * 100
        const tens = Math.floor((n % 100) / 10) * 10
        const ones = n % 10

        const parts = []
        if (hundreds > 0) parts.push(hundreds)
        if (tens > 0 || hundreds === 0) parts.push(tens) // Always show tens if no hundreds, or if we want specific format?
        // Standard expanded form: 105 = 100 + 5. 120 = 100 + 20.
        // Let's filter out 0s unless the number itself is 0 (not poss here)

        const nonZeroParts = []
        if (hundreds > 0) nonZeroParts.push(hundreds)
        if (tens > 0) nonZeroParts.push(tens)
        if (ones > 0) nonZeroParts.push(ones)

        if (nonZeroParts.length === 0) return "0"
        return nonZeroParts.join(' + ')
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Expanded Form Explorer (up to 200)')}
            emoji="🔢"
            description={t(`worksheets.${docId}.description`, 'Write each number in expanded form (breaking it into hundreds, tens, and ones).')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Number Expander"
                subtitle="Stretching Numbers Apart"
                icons={{
                    bg1: "📏",
                    bg2: "🔢",
                    float1: "1️⃣",
                    float2: "0️⃣"
                }}
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
                title="Stretch it Out!"
                icon="↔️"
                steps={[
                    { label: "Step 1", text: "Say the number out loud slowly." },
                    { label: "Step 2", text: "134 sounds like 'One hundred... thirty... four'." },
                    { label: "Step 3", text: "Write exactly what you hear: 100 + 30 + 4" }
                ]}
                color="blue"
            />

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                {problems.map((n, i) => (
                    <div key={i} className="flex items-center gap-4 break-inside-avoid">
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl text-2xl font-bold text-blue-700 shadow-sm print:border-slate-300 print:bg-white print:text-black">
                            {n}
                        </div>
                        <div className="text-xl font-bold text-slate-400">=</div>
                        <div className="flex-1 border-b-2 border-dashed border-slate-300 h-12 flex items-end pb-1 px-2 relative">
                            {/* Visual guide lines for H T O? Maybe too cluttered. Just blank line. */}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                        {problems.map((n, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="font-bold text-emerald-800 w-8">{n}</span>
                                <span className="text-slate-500">=</span>
                                <span className="text-emerald-700">{getExpanded(n)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Number Patterns (Patterns to 200)
// ==========================================
export function NumberPatterns200({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'number-patterns-200'

    // Generate patterns
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const rules = [
        { name: '+2', fn: (n: number) => n + 2, start: [100, 160] },
        { name: '+5', fn: (n: number) => n + 5, start: [50, 150] },
        { name: '+10', fn: (n: number) => n + 10, start: [20, 120] },
        { name: '-1', fn: (n: number) => n - 1, start: [150, 200] },
        { name: '-10', fn: (n: number) => n - 10, start: [120, 200] },
        { name: '+100', fn: (n: number) => n + 100, start: [0, 99], rare: true }, // Simple jumps
    ]

    const problems = Array.from({ length: 8 }, () => {
        const ruleParams = rules[Math.floor(rng() * rules.length)]
        const isRare = ruleParams.rare && rng() > 0.3 // Only allow rare sometimes
        const finalRule = isRare ? ruleParams : rules.filter(r => !r.rare)[Math.floor(rng() * (rules.length - 1))]

        const start = nextInt(finalRule.start[0], finalRule.start[1])
        const sequence = [start]
        for (let k = 0; k < 5; k++) {
            sequence.push(finalRule.fn(sequence[sequence.length - 1]))
        }

        // Hide random positions (keep first usually visible for context, maybe hide 2 or 3 spots)
        // Let's simply hide index 2, 3, 5?
        // Or randomized holes
        const holes = [false, false, false, false, false, false]
        // Always show first
        const holeCount = 3
        let h = 0
        while (h < holeCount) {
            const idx = nextInt(1, 5) // 1 to 5
            if (!holes[idx]) {
                holes[idx] = true
                h++
            }
        }

        return {
            sequence,
            holes,
            rule: finalRule.name
        }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Number Pattern Detective')}
            emoji="🔎"
            description={t(`worksheets.${docId}.description`, 'Find the rule for each number pattern and fill in the missing numbers.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Pattern Detective"
                subtitle="Cracking the Number Code"
                icons={{
                    bg1: "🕵️",
                    bg2: "🔎",
                    float1: "❓",
                    float2: "❗"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
                    border: "border-purple-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-purple-300",
                    pillText: "text-purple-800",
                    accent: "text-purple-300"
                }}
            />

            <StrategySpotlight
                title="Find the Rule"
                icon="🔍"
                steps={[
                    { label: "Look", text: "Look at two numbers side-by-side." },
                    { label: "Check", text: "Are they getting bigger (+) or smaller (-)?" },
                    { label: "Solve", text: "How much did they change? Is it the same next time?" }
                ]}
                color="purple"
            />

            <div className="space-y-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 print:bg-white print:border-slate-300 break-inside-avoid">
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center">
                            {p.sequence.map((num, idx) => (
                                <React.Fragment key={idx}>
                                    <div className={`
                                        w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold border-2 shadow-sm
                                        ${p.holes[idx]
                                            ? 'bg-white border-dashed border-purple-300 text-transparent'
                                            : 'bg-white border-purple-200 text-purple-900'}
                                    `}>
                                        {p.holes[idx] ? '' : num}
                                        {p.holes[idx] && <span className="text-purple-100 text-3xl font-light"></span>}
                                    </div>
                                    {idx < p.sequence.length - 1 && (
                                        <div className="text-purple-300">➜</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-2 text-right">
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mr-2">Rule:</span>
                            <span className="inline-block w-24 border-b-2 border-purple-200"></span>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {problems.map((p, i) => (
                            <div key={i} className="border-b border-emerald-200 pb-2">
                                <div className="font-bold text-emerald-900 mb-1">Pattern #{i + 1} (Rule: {p.rule})</div>
                                <div className="font-mono text-emerald-700 tracking-wider">
                                    {p.sequence.map((n, idx) => (
                                        <span key={idx} className={p.holes[idx] ? "font-bold text-emerald-900 underline decoration-2 decoration-emerald-500" : ""}>
                                            {n}{idx < p.sequence.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Rounding to Nearest 10
// ==========================================
export function RoundingNearest10({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'rounding-nearest-10'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 12 }, () => nextInt(10, 99))

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Rounding Rocket (Nearest 10)')}
            emoji="🚀"
            description={t(`worksheets.${docId}.description`, 'Round each number to the nearest 10. Use the Rocket Rules!')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Rounding Rocket"
                subtitle="To the Nearest 10"
                icons={{
                    bg1: "🚀",
                    bg2: "🌌",
                    float1: "🔟",
                    float2: "🌠"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
                    border: "border-orange-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-orange-300",
                    pillText: "text-orange-800",
                    accent: "text-orange-300"
                }}
            />

            <StrategySpotlight
                title="Rocket Rules for Rounding"
                icon="🚀"
                steps={[
                    { label: "Step 1", text: "Look at the digit in the ones place (the neighbor)." },
                    { label: "Step 2", text: "5 or more? Round UP to the next 10. (🚀 Blast off!)" },
                    { label: "Step 3", text: "4 or less? Round DOWN (stay at the same 10). (Land safely)" }
                ]}
                color="orange"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {problems.map((n, i) => (
                    <div key={i} className="flex flex-col items-center bg-orange-50/50 p-4 rounded-xl border border-orange-100 break-inside-avoid print:bg-white print:border-slate-300">
                        <div className="text-3xl font-bold text-orange-900 mb-2">{n}</div>
                        <div className="w-full text-center text-xs text-orange-400 font-bold uppercase tracking-widest mb-1">Nearest 10</div>
                        <div className="w-20 h-12 border-2 border-orange-200 rounded-lg bg-white shadow-inner flex items-center justify-center font-mono text-xl text-orange-800"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm font-mono">
                        {problems.map((n, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="font-bold text-emerald-800">{n}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-emerald-700">{Math.round(n / 10) * 10}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Add Three Numbers
// ==========================================
export function AddThreeNumbers({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'add-three-numbers'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    // Generate problems: single digit 3 numbers (to make sum < 30 usually)
    const problems = Array.from({ length: 12 }, () => [nextInt(1, 9), nextInt(1, 9), nextInt(1, 9)])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Triple Threat Addition')}
            emoji="➕"
            description={t(`worksheets.${docId}.description`, 'Add three numbers together. Look for doubles or sums of 10!')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Triple Addition"
                subtitle="Adding 3 Numbers"
                icons={{
                    bg1: "3️⃣",
                    bg2: "➕",
                    float1: "🎯",
                    float2: "✅"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
                    border: "border-green-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-green-300",
                    pillText: "text-green-800",
                    accent: "text-green-300"
                }}
            />

            <StrategySpotlight
                title="Strategy: Make it Easier!"
                icon="✨"
                steps={[
                    { label: "Step 1", text: "Look for pairs that make 10 (like 6 + 4)." },
                    { label: "Step 2", text: "Look for doubles (like 3 + 3)." },
                    { label: "Step 3", text: "Add those two first, then add the third number!" }
                ]}
                color="green"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6">
                {problems.map((nums, i) => (
                    <div key={i} className="flex flex-col items-center bg-green-50/50 p-4 rounded-xl border border-green-100 break-inside-avoid print:bg-white print:border-slate-300">
                        <div className="flex flex-col items-end text-2xl font-mono font-bold text-slate-700 leading-tight">
                            <div>{nums[0]}</div>
                            <div>{nums[1]}</div>
                            <div className="border-b-2 border-slate-700 flex items-center w-full justify-end">
                                <span className="mr-2 text-green-500">+</span>
                                {nums[2]}
                            </div>
                        </div>
                        <div className="w-16 h-12 border-2 border-slate-300 rounded-lg bg-white mt-2 shadow-inner"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm font-mono">
                        {problems.map((nums, i) => (
                            <div key={i} className="flex items-center gap-1 justify-center">
                                <span className="text-emerald-800">{nums.join(' + ')}</span>
                                <span className="text-slate-500">=</span>
                                <span className="font-bold text-emerald-700 text-lg">{nums.reduce((a, b) => a + b, 0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Missing Addends
// ==========================================
export function MissingAddends({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'missing-addends'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 12 }, () => {
        const sum = nextInt(10, 20)
        const a = nextInt(1, sum - 1)
        const b = sum - a
        // Randomly hide a or b
        const hideA = rng() > 0.5
        return { a, b, sum, hideA }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Mystery Numbers (Missing Addends)')}
            emoji="❓"
            description={t(`worksheets.${docId}.description`, 'Find the missing number to make the equation true.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Mystery Numbers"
                subtitle="Finding Missing Parts"
                icons={{
                    bg1: "🕵️‍♀️",
                    bg2: "❓",
                    float1: "🔍",
                    float2: "🧮"
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

            <StrategySpotlight
                title="Part + Part = Whole"
                icon="🧩"
                steps={[
                    { label: "Idea", text: "If a PART is missing, SUBTRACT the other part from the Whole." },
                    { label: "Example", text: "5 + ___ = 12 (12 is Whole, 5 is Part)." },
                    { label: "Solve", text: "12 - 5 = 7. The missing part is 7!" }
                ]}
                color="indigo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-center p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 shadow-sm print:bg-white print:border-slate-300 break-inside-avoid">
                        <div className="flex items-center gap-3 text-2xl font-bold font-mono text-slate-700">
                            {p.hideA ? (
                                <div className="w-12 h-12 bg-white border-2 border-indigo-300 rounded flex items-center justify-center text-indigo-300 shadow-inner"></div>
                            ) : (
                                <span>{p.a}</span>
                            )}
                            <span className="text-indigo-400">+</span>
                            {!p.hideA ? (
                                <div className="w-12 h-12 bg-white border-2 border-indigo-300 rounded flex items-center justify-center text-indigo-300 shadow-inner"></div>
                            ) : (
                                <span>{p.b}</span>
                            )}
                            <span className="text-slate-400">=</span>
                            <span className="text-indigo-900">{p.sum}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="text-center bg-white border border-emerald-100 rounded p-2">
                                {p.a} + {p.b} = {p.sum}
                                <span className="ml-2 text-emerald-600 font-bold block sm:inline">
                                    (Missing: {p.hideA ? p.a : p.b})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Fact Families (up to 20)
// ==========================================
export function FactFamilies20({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'fact-families-20'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 6 }, () => {
        const sum = nextInt(10, 20) // Limit to 20 for 2nd grade fluency
        const a = nextInt(2, sum - 2)
        const b = sum - a
        return [a, b, sum]
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Fact Family Triangles')}
            emoji="🏠"
            description={t(`worksheets.${docId}.description`, 'Write the 4 facts (2 addition, 2 subtraction) for each family.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Fact Families"
                subtitle="One Family, Four Facts"
                icons={{
                    bg1: "👨‍👩‍👧",
                    bg2: "🏠",
                    float1: "↔️",
                    float2: "❤️"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
                    border: "border-pink-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-800",
                    accent: "text-pink-300"
                }}
            />

            <StrategySpotlight
                title="3 Numbers = 4 Facts"
                icon="🏠"
                steps={[
                    { label: "Tip 1", text: "Big number is always the Sum (Addition) or the Whole (Subtraction)." },
                    { label: "Tip 2", text: "Add the small parts: 3 + 4 = 7" },
                    { label: "Tip 3", text: "Switch them: 4 + 3 = 7" },
                    { label: "Tip 4", text: "Subtract from the whole: 7 - 3 = 4 and 7 - 4 = 3" }
                ]}
                color="pink"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {problems.map((fam, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-pink-50/50 rounded-xl border border-pink-100 items-center justify-between break-inside-avoid print:bg-white print:border-slate-300">
                        {/* Triangle Graphic */}
                        <div className="w-24 h-24 relative flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200 fill-current">
                                <path d="M50,10 L90,90 H10 Z" />
                            </svg>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-pink-900">{fam[2]}</div>
                            <div className="absolute bottom-2 left-4 font-bold text-pink-700">{fam[0]}</div>
                            <div className="absolute bottom-2 right-4 font-bold text-pink-700">{fam[1]}</div>
                        </div>

                        {/* Input Lines */}
                        <div className="flex-1 space-y-2 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="w-6 border-b border-slate-400"></span> + <span className="w-6 border-b border-slate-400"></span> = <span className="w-6 border-b border-slate-400"></span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-6 border-b border-slate-400"></span> + <span className="w-6 border-b border-slate-400"></span> = <span className="w-6 border-b border-slate-400"></span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-6 border-b border-slate-400"></span> - <span className="w-6 border-b border-slate-400"></span> = <span className="w-6 border-b border-slate-400"></span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-6 border-b border-slate-400"></span> - <span className="w-6 border-b border-slate-400"></span> = <span className="w-6 border-b border-slate-400"></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        {problems.map((fam, i) => (
                            <div key={i} className="border-b border-emerald-200 pb-2">
                                <div className="font-bold text-emerald-800 mb-1">Family: {fam.join(', ')}</div>
                                <div className="grid grid-cols-2 gap-x-4 text-xs font-mono text-emerald-700">
                                    <div>{fam[0]} + {fam[1]} = {fam[2]}</div>
                                    <div>{fam[2]} - {fam[0]} = {fam[1]}</div>
                                    <div>{fam[1]} + {fam[0]} = {fam[2]}</div>
                                    <div>{fam[2]} - {fam[1]} = {fam[0]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Mental Math (Fluency to 20)
// ==========================================
export function MentalMath20({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mental-math-20'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 20 }, () => {
        const isAdd = rng() > 0.5
        if (isAdd) {
            const a = nextInt(1, 15)
            const b = nextInt(1, 5) // keep sums mostly under 20
            return { type: '+', a, b, ans: a + b }
        } else {
            const a = nextInt(10, 20)
            const b = nextInt(1, 9)
            return { type: '-', a, b, ans: a - b }
        }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Mental Math Sprint')}
            emoji="🧠"
            description={t(`worksheets.${docId}.description`, 'Solve these problems in your head! Try to be fast and accurate.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Mental Math Sprint"
                subtitle="Fast & Fluent"
                icons={{
                    bg1: "⚡",
                    bg2: "🧠",
                    float1: "⏱️",
                    float2: "💭"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-red-50 to-orange-50",
                    border: "border-red-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-red-300",
                    pillText: "text-red-800",
                    accent: "text-red-300"
                }}
            />

            <StrategySpotlight
                title="Mental Math Tricks"
                icon="🧠"
                steps={[
                    { label: "Doubles", text: "6 + 7 is just 6 + 6 + 1 (13)." },
                    { label: "Make 10", text: "8 + 5 -> 8 + 2 is 10, plus 3 more is 13." },
                    { label: "Count Back", text: "15 - 2 -> 14, 13." }
                ]}
                color="red"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg border border-red-100 print:bg-white print:border-slate-300 break-inside-avoid">
                        <div className="flex-1 text-right font-mono text-xl font-medium text-slate-700">
                            {p.a} {p.type} {p.b}
                        </div>
                        <div className="text-slate-400">=</div>
                        <div className="w-12 h-10 border-b-2 border-slate-300 bg-white shadow-sm flex items-center justify-center text-slate-900 font-bold"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-4 text-sm font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="text-center bg-white border border-emerald-100 rounded p-1 text-emerald-800">
                                {p.a} {p.type} {p.b} = <strong>{p.ans}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Money (Coins & Bills)
// ==========================================
export function MoneyCoinsBills({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'money-coins-bills'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    // Simple money counting: mix of pennies, nickels, dimes, quarters
    const problems = Array.from({ length: 6 }, () => {
        const quarters = rng() > 0.5 ? nextInt(0, 3) : 0
        const dimes = nextInt(0, 5)
        const nickels = nextInt(0, 5)
        const pennies = nextInt(0, 5)
        // Ensure at least some coins
        if (quarters + dimes + nickels + pennies === 0) return { q: 1, d: 0, n: 0, p: 0, total: 25 }

        const total = quarters * 25 + dimes * 10 + nickels * 5 + pennies
        return { q: quarters, d: dimes, n: nickels, p: pennies, total }
    })

    const Coin = ({ type, size }: { type: 'Q' | 'D' | 'N' | 'P', size: number, key?: any }) => {
        const colors = { Q: '#9ca3af', D: '#9ca3af', N: '#9ca3af', P: '#b45309' } // Silver/Copper
        const labels = { Q: '25¢', D: '10¢', N: '5¢', P: '1¢' }
        return (
            <div
                className="rounded-full flex items-center justify-center border-2 border-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm text-[10px] font-bold text-slate-700"
                style={{
                    width: size, height: size,
                    backgroundColor: type === 'P' ? '#fed7aa' : undefined,
                    borderColor: type === 'P' ? '#b45309' : undefined,
                    color: type === 'P' ? '#7c2d12' : undefined
                }}
            >
                {labels[type]}
            </div>
        )
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Money Master: Coins Checker')}
            emoji="💰"
            description={t(`worksheets.${docId}.description`, 'Count the coins and write the total amount.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Coin Counter"
                subtitle="Counting Money"
                icons={{
                    bg1: "🪙",
                    bg2: "💰",
                    float1: "💵",
                    float2: "💲"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
                    border: "border-yellow-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-yellow-300",
                    pillText: "text-yellow-800",
                    accent: "text-yellow-300"
                }}
            />

            <StrategySpotlight
                title="Counting Coins Strategy"
                icon="🪙"
                steps={[
                    { label: "Step 1", text: "Start with the biggest value coins (Quarters 25¢)." },
                    { label: "Step 2", text: "Add the Dimes (10¢), then Nickels (5¢)." },
                    { label: "Step 3", text: "Count the Pennies (1¢) last!" }
                ]}
                color="yellow"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 break-inside-avoid print:bg-white print:border-slate-300">
                        <div className="flex flex-wrap items-center gap-2 min-h-[60px]">
                            {Array.from({ length: p.q }).map((_, j) => <Coin key={`q-${j}`} type="Q" size={40} />)}
                            {Array.from({ length: p.d }).map((_, j) => <Coin key={`d-${j}`} type="D" size={30} />)}
                            {Array.from({ length: p.n }).map((_, j) => <Coin key={`n-${j}`} type="N" size={34} />)}
                            {Array.from({ length: p.p }).map((_, j) => <Coin key={`p-${j}`} type="P" size={28} />)}
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-yellow-200 pt-2">
                            <span className="text-sm font-bold text-yellow-700 uppercase">Total:</span>
                            <div className="w-20 h-10 border-2 border-yellow-300 bg-white rounded shadow-inner flex items-center justify-center">
                                <span className="text-yellow-900 font-bold ml-auto mr-2">¢</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono">
                        {problems.map((p, i) => (
                            <div key={i} className="flex items-center justify-between bg-white border border-emerald-100 rounded p-2 px-4">
                                <span className="text-emerald-800 font-bold">Problem {i + 1}</span>
                                <span className="text-emerald-600 border-b-2 border-emerald-200 ml-2">{p.total}¢</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Measurement (Length)
// ==========================================
export function MeasurementLength({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'measurement-length'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const objects = [
        { name: 'Pencil', emoji: '✏️', min: 3, max: 7 },
        { name: 'Crayon', emoji: '🖍️', min: 2, max: 5 },
        { name: 'Brush', emoji: '🖌️', min: 4, max: 9 },
        { name: 'Spoon', emoji: '🥄', min: 3, max: 6 },
        { name: 'Key', emoji: '🔑', min: 1, max: 3 }
    ]

    const problems = Array.from({ length: 5 }, () => {
        const obj = objects[Math.floor(rng() * objects.length)]
        const length = nextInt(obj.min, obj.max)
        return { ...obj, length }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Measuring Fun')}
            emoji="📏"
            description={t(`worksheets.${docId}.description`, 'Measure the objects using the ruler provided.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Measurement Master"
                subtitle="How Long is It?"
                icons={{
                    bg1: "📏",
                    bg2: "📐",
                    float1: "✏️",
                    float2: "🖍️"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-50 to-sky-50",
                    border: "border-cyan-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-cyan-300",
                    pillText: "text-cyan-800",
                    accent: "text-cyan-300"
                }}
            />

            <div className="space-y-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="mb-2 text-lg font-bold text-slate-700 flex items-center gap-2">
                            <span>{i + 1}. {p.emoji} {p.name}</span>
                        </div>
                        <div className="relative h-24 bg-slate-50 border-b border-slate-300">
                            {/* Object Bar */}
                            <div
                                className="absolute top-4 left-0 h-8 rounded-r-md bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm border border-cyan-600 flex items-center justify-end px-2 text-white text-xs font-bold"
                                style={{ width: `${p.length * 40}px` }} // Scale: 40px = 1 inch visual approx
                            >
                            </div>

                            {/* Ruler Markers */}
                            <div className="absolute bottom-0 left-0 w-full h-8 border-t border-slate-800 flex">
                                {Array.from({ length: 11 }).map((_, j) => (
                                    <div key={j} className="relative h-full" style={{ width: '40px', flexShrink: 0 }}>
                                        <div className="absolute bottom-0 left-0 border-l border-slate-800 h-4"></div>
                                        {/* Half inch mark */}
                                        <div className="absolute bottom-0 left-1/2 border-l border-slate-400 h-2"></div>
                                        <span className="absolute bottom-5 left-[-4px] text-xs font-mono font-bold text-slate-600">{j}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 justify-end">
                            <span className="text-sm font-bold text-slate-500">Length:</span>
                            <div className="w-16 h-8 border-b-2 border-slate-400 bg-slate-100/50"></div>
                            <span className="text-sm font-bold text-slate-500">inches</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {problems.map((p, i) => (
                            <div key={i} className="flex justify-between border-b border-emerald-200 pb-1">
                                <span className="text-emerald-800">{i + 1}. {p.name}</span>
                                <span className="text-emerald-700 font-mono font-bold">{p.length} in</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Bar Graphs (Data)
// ==========================================
export function BarGraphsData({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'bar-graphs-data'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const categories = ['Red', 'Blue', 'Green', 'Yellow']
    const data = categories.map(c => ({ name: c, value: nextInt(1, 10) }))
    const most = [...data].sort((a, b) => b.value - a.value)[0]
    const least = [...data].sort((a, b) => a.value - b.value)[0]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Graphing Genius')}
            emoji="📊"
            description={t(`worksheets.${docId}.description`, 'Read the graph to answer the questions about favorite colors.')}
            problemCount={4}
        >
            <PremiumWorksheetBanner
                title="Data Detective"
                subtitle="Reading Bar Graphs"
                icons={{
                    bg1: "📊",
                    bg2: "📉",
                    float1: "📋",
                    float2: "✏️"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-50 to-purple-50",
                    border: "border-pink-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-800",
                    accent: "text-pink-300"
                }}
            />

            <div className="my-8 print:my-2 bg-white p-6 print:p-2 rounded-xl border-2 border-slate-200 shadow-sm print:shadow-none break-inside-avoid page-break-inside-avoid relative z-10">
                <h3 className="text-center font-bold text-lg text-slate-800 mb-6 print:mb-4 text-base">Favorite Colors in Our Class</h3>

                {/* Graph Container - Enforce height in print */}
                <div className="flex items-end justify-around h-64 print:h-[250px] border-b-2 border-l-2 border-slate-800 pl-2 pb-2 relative w-full mb-6 print:mb-2">
                    {/* Y-axis labels simplified */}
                    <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-mono py-2">
                        <span>10</span>
                        <span>5</span>
                        <span>0</span>
                    </div>

                    {/* Grid lines */}
                    <div className="absolute left-0 right-0 top-0 border-t border-slate-100 w-full h-full pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-[50%] border-t border-slate-100 w-full h-full pointer-events-none"></div>

                    {data.map((d, i) => (
                        <div key={i} className="flex flex-col items-center w-12 sm:w-16 h-full justify-end group z-20">
                            <div
                                className="w-full bg-slate-300 rounded-t-sm transition-all print:border print:border-slate-800 relative"
                                style={{
                                    height: `${d.value * 10}%`,
                                    backgroundColor: d.name.toLowerCase() === 'yellow' ? '#fde047' : d.name.toLowerCase() === 'red' ? '#f87171' : d.name.toLowerCase() === 'blue' ? '#60a5fa' : '#4ade80'
                                }}
                            >
                                <span className="hidden print:block absolute -top-5 left-0 right-0 text-xs font-bold text-center bg-white/80 rounded px-1">{d.value}</span>
                            </div>
                            <span className="mt-2 text-xs font-bold text-slate-600 uppercase tracking-wider">{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 print:gap-3 mt-8 print:mt-2 relative z-10">
                <div className="bg-white p-6 print:p-2 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
                    <h4 className="font-bold text-slate-700 mb-4 print:mb-2">Answer the questions:</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-slate-400">1.</span>
                            <div className="flex-1">
                                <div className="text-slate-800 font-medium mb-1">Which color got the most votes?</div>
                                <div className="h-8 border-b-2 border-slate-200 w-full"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-slate-400">2.</span>
                            <div className="flex-1">
                                <div className="text-slate-800 font-medium mb-1">Which color got the least votes?</div>
                                <div className="h-8 border-b-2 border-slate-200 w-full"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-slate-400">3.</span>
                            <div className="flex-1">
                                <div className="text-slate-800 font-medium mb-1">How many students voted for {data[0].name}?</div>
                                <div className="h-8 border-b-2 border-slate-200 w-full"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-slate-400">4.</span>
                            <div className="flex-1">
                                <div className="text-slate-800 font-medium mb-1">How many students voted in total?</div>
                                <div className="h-8 border-b-2 border-slate-200 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => {
                const maxVal = Math.max(...data.map(d => d.value));
                const minVal = Math.min(...data.map(d => d.value));
                const most = data.find(d => d.value === maxVal)?.name;
                const least = data.find(d => d.value === minVal)?.name;
                const total = data.reduce((a, b) => a + b.value, 0);

                return (
                    <div className="mt-8 p-6 border-2 border-fuchsia-400 bg-fuchsia-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">✅</span>
                            <h3 className="font-bold text-fuchsia-900">Answer Key</h3>
                        </div>
                        <div className="space-y-2 text-sm text-fuchsia-900 font-medium">
                            <p>1. Most votes: <strong>{most}</strong> ({maxVal})</p>
                            <p>2. Least votes: <strong>{least}</strong> ({minVal})</p>
                            <p>3. Voted for {data[0].name}: <strong>{data[0].value}</strong></p>
                            <p>4. Total students: <strong>{total}</strong></p>
                        </div>
                    </div>
                )
            })}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 2-Digit Addition (No Regrouping)
// ==========================================
export function Add2Digit100({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'add-2digit-100'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    function genPairs(count: number) {
        const out: Array<[number, number]> = [];
        let guard = 0;
        while (out.length < count && guard < 10000) {
            const a = nextInt(10, 99);
            const b = nextInt(10, 99);
            // No regrouping condition: (a%10) + (b%10) < 10
            if ((a % 10) + (b % 10) < 10 && a + b <= 100) out.push([a, b]);
            guard++;
        }
        return out;
    }
    const pairs = genPairs(12); // Increased to 12 to match grid

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, '2-Digit Addition (No Regrouping)')}
            emoji="➕"
            description={t(`worksheets.${docId}.description`, 'Add the two numbers. No regrouping needed.')}
            problemCount={pairs.length}
        >
            <PremiumWorksheetBanner
                title="Double Digit Power"
                subtitle="Adding Without Regrouping"
                icons={{
                    bg1: "🏗️",
                    bg2: "🧱",
                    float1: "➕",
                    float2: "💪"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
                    border: "border-cyan-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-cyan-300",
                    pillText: "text-cyan-800",
                    accent: "text-cyan-300"
                }}
            />

            <StrategySpotlight
                title="Building Numbers"
                icon="🏗️"
                steps={[
                    { label: "Line Up", text: "Line up the numbers: Ones under Ones, Tens under Tens." },
                    { label: "Step 1", text: "Add the Ones column first." },
                    { label: "Step 2", text: "Then add the Tens column." },
                    { label: "Note", text: "No Regrouping needed! (The ones add up to less than 10)" }
                ]}
                color="cyan"
            />

            {/* Worked Example with Visuals */}
            <div className="mb-8 p-6 bg-cyan-50/50 rounded-xl border border-cyan-100 break-inside-avoid print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 mb-4 font-bold text-cyan-900">
                    <span className="text-xl">👁️</span>
                    <span>Visual Example: 23 + 45 = ?</span>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-cyan-200 overflow-hidden shadow-sm print:shadow-none">
                    <svg viewBox="0 0 600 200" className="w-full h-auto max-h-48" preserveAspectRatio="xMidYMid meet">
                        {/* 23 - 2 tens and 3 ones */}
                        <text x="10" y="25" fontSize="14" fill="#0891b2" fontWeight="bold">23 =</text>
                        {Array.from({ length: 2 }).map((_, j) => (
                            <rect key={`t1-${j}`} x={50 + j * 55} y="5" width="45" height="65" rx="4" fill="#22d3ee" stroke="#0891b2" strokeWidth="2" />
                        ))}
                        {Array.from({ length: 3 }).map((_, j) => (
                            <rect key={`o1-${j}`} x={165 + j * 35} y="45" width="25" height="25" rx="2" fill="#67e8f9" stroke="#0891b2" strokeWidth="1.5" />
                        ))}

                        {/* Plus sign */}
                        <text x="280" y="45" fontSize="28" fill="#0891b2" fontWeight="bold">+</text>

                        {/* 45 - 4 tens and 5 ones */}
                        <text x="10" y="105" fontSize="14" fill="#0369a1" fontWeight="bold">45 =</text>
                        {Array.from({ length: 4 }).map((_, j) => (
                            <rect key={`t2-${j}`} x={50 + j * 55} y="85" width="45" height="65" rx="4" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
                        ))}
                        {Array.from({ length: 5 }).map((_, j) => (
                            <rect key={`o2-${j}`} x={280 + j * 35} y="125" width="25" height="25" rx="2" fill="#7dd3fc" stroke="#0369a1" strokeWidth="1.5" />
                        ))}

                        {/* Equals and answer */}
                        <text x="470" y="45" fontSize="28" fill="#0891b2" fontWeight="bold">=</text>
                        <text x="470" y="105" fontSize="32" fill="#0e7490" fontWeight="bold">68</text>
                        <text x="10" y="185" fontSize="12" fill="#0e7490" fontWeight="bold">Total: 6 tens (20+40) + 8 ones (3+5) = 68</text>
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6">
                {pairs.map(([a, b], i) => (
                    <div key={i} className="flex flex-col items-center p-4 bg-cyan-50/30 rounded-xl border border-cyan-100 break-inside-avoid print:bg-white print:border-slate-300">
                        <div className="flex flex-col items-end text-3xl font-mono font-bold text-slate-700 leading-tight w-24">
                            <div>{a}</div>
                            <div className="border-b-4 border-slate-700 w-full flex justify-between">
                                <span className="text-cyan-500 mr-2">+</span>
                                <span>{b}</span>
                            </div>
                        </div>
                        <div className="w-24 h-16 border-2 border-slate-200 rounded-lg bg-white mt-2 shadow-inner"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm font-mono">
                        {pairs.map(([a, b], i) => (
                            <div key={i} className="flex items-center justify-center bg-white border border-emerald-100 rounded p-1 text-emerald-800">
                                {a} + {b} = <strong>{a + b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Place Value: Tens & Ones
// ==========================================
export function PlaceValueHTO({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'place-value-hto'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const nums = (() => {
        const set = new Set<number>()
        while (set.size < 8) {
            set.add(nextInt(10, 99))
        }
        return Array.from(set)
    })()

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Place Value: Tens and Ones (to 99)')}
            emoji="🔷"
            description={t(`worksheets.${docId}.description`, 'Write how many tens and ones in each number. Then write the complete number in expanded form in the blank spaces.')}
            problemCount={nums.length}
        >
            <PremiumWorksheetBanner
                title="Place Value Power"
                subtitle="Tens & Ones"
                icons={{
                    bg1: "🔷",
                    bg2: "🟦",
                    float1: "🔟",
                    float2: "1️⃣"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
                    border: "border-violet-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-violet-300",
                    pillText: "text-violet-800",
                    accent: "text-violet-300"
                }}
            />

            <StrategySpotlight
                title="Tens & Ones Master Class"
                icon="🎓"
                steps={[
                    { label: "Tens", text: "The first digit shows how many groups of 10." },
                    { label: "Ones", text: "The second digit shows the extra ones." },
                    { label: "Expanded", text: "Write the value of each: 47 = 40 + 7" }
                ]}
                color="purple"
            />

            {/* Visual Example: 47 */}
            <div className="mb-6 print:mb-2 p-4 print:p-2 bg-violet-50/50 rounded-xl border border-violet-100 break-inside-avoid print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 mb-3 text-violet-900 font-bold">
                    <span className="text-xl">👁️</span>
                    <span>Example: 47</span>
                </div>

                <div className="bg-white p-4 print:p-1 rounded-xl border-2 border-violet-200 shadow-sm print:shadow-none">
                    <div className="flex flex-wrap items-center gap-6 md:gap-8 justify-center">
                        {/* Tens */}
                        <div className="flex flex-col items-center gap-2">
                            <svg viewBox="0 0 240 80" className="w-auto h-20 print:h-12" preserveAspectRatio="xMidYMid meet">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <rect key={j} x={15 + j * 55} y="15" width="45" height="65" rx="4" fill="#22c55e" stroke="#16a34a" strokeWidth="2.5" />
                                ))}
                            </svg>
                            <span className="text-sm font-bold text-green-700">4 Tens = 40</span>
                        </div>

                        <div className="text-2xl text-slate-300 font-bold">+</div>

                        {/* Ones */}
                        <div className="flex flex-col items-center gap-2">
                            <svg viewBox="0 0 250 50" className="w-auto h-16 print:h-10" preserveAspectRatio="xMidYMid meet">
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <rect key={j} x={15 + j * 35} y="10" width="25" height="25" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
                                ))}
                            </svg>
                            <span className="text-sm font-bold text-blue-700">7 Ones = 7</span>
                        </div>

                        <div className="text-2xl text-slate-300 font-bold">=</div>

                        <div className="text-4xl font-bold text-violet-800">47</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                {nums.map((n, i) => {
                    const tens = Math.floor(n / 10);
                    const ones = n % 10;
                    return (
                        <div key={i} className="border-2 border-violet-200 rounded-xl p-4 print:p-2 bg-gradient-to-br from-violet-50/50 to-purple-50/50 break-inside-avoid print:bg-white">
                            <div className="flex justify-between items-center mb-4 print:mb-2">
                                <div className="text-violet-900 font-bold text-lg print:text-base">Number: <span className="text-2xl print:text-xl ml-2">{n}</span></div>
                            </div>

                            {/* Visual Blocks */}
                            <div className="mb-4 print:mb-2 bg-white p-3 print:p-1 rounded-lg border border-violet-300 shadow-sm print:shadow-none">
                                <div className="flex flex-col items-center gap-2">
                                    <svg viewBox="0 0 360 120" className="w-full h-auto max-h-32" preserveAspectRatio="xMidYMid meet">
                                        {/* Tens rods */}
                                        {Array.from({ length: tens }).map((_, j) => (
                                            <rect key={j} x={5 + j * 38} y="5" width="35" height="55" rx="3" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                                        ))}
                                        {/* Ones cubes */}
                                        {Array.from({ length: ones }).map((_, j) => (
                                            <rect key={j} x={5 + j * 28} y="65" width="20" height="20" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" />
                                        ))}
                                    </svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 print:gap-2">
                                <div className="bg-white border-2 border-violet-200 rounded-lg p-2 text-center">
                                    <div className="text-xs text-violet-500 font-bold uppercase mb-1">Tens</div>
                                    <div className="h-8 border-b-2 border-violet-100"></div>
                                </div>
                                <div className="bg-white border-2 border-violet-200 rounded-lg p-2 text-center">
                                    <div className="text-xs text-violet-500 font-bold uppercase mb-1">Ones</div>
                                    <div className="h-8 border-b-2 border-violet-100"></div>
                                </div>
                                <div className="bg-white border-2 border-violet-200 rounded-lg p-2 text-center">
                                    <div className="text-xs text-violet-500 font-bold uppercase mb-1">Expanded</div>
                                    <div className="h-8 border-b-2 border-violet-100 flex items-center justify-center text-xs text-slate-300">__ + __</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-emerald-800">
                        {nums.map((n, i) => {
                            const tens = Math.floor(n / 10);
                            const ones = n % 10;
                            return (
                                <div key={i} className="border-b border-emerald-200 pb-1">
                                    <strong>{n}:</strong> {tens} Tens, {ones} Ones <span className="text-slate-400">|</span> Expanded: {tens * 10} + {ones}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Time to 5 Minutes
// ==========================================
export function Time5Min({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'time-5min'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const times = Array.from({ length: 8 }, () => {
        const h = nextInt(1, 12)
        const m = nextInt(0, 11) * 5 // 0, 5, 10, ... 55
        return `${h}:${m.toString().padStart(2, '0')}`
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Tell Time to 5 Minutes')}
            emoji="🕰️"
            description={t(`worksheets.${docId}.description`, 'Draw the clock hands to show each time.')}
            problemCount={times.length}
        >
            <PremiumWorksheetBanner
                title="Time Teller"
                subtitle="Reading Clocks"
                icons={{
                    bg1: "🕰️",
                    bg2: "⌚",
                    float1: "⌛",
                    float2: "⏰"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-50 to-sky-50",
                    border: "border-cyan-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-cyan-300",
                    pillText: "text-cyan-800",
                    accent: "text-cyan-300"
                }}
            />

            <StrategySpotlight
                title="Clock Hands"
                icon="🕑"
                steps={[
                    { label: "Short Hand", text: "The Hour Hand. It points to the hour number." },
                    { label: "Long Hand", text: "The Minute Hand. It counts by 5s around the clock." },
                    { label: "Tip", text: "If minutes are past 30, the hour hand moves halfway to the next number!" }
                ]}
                color="cyan"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {times.map((time, i) => (
                    <div key={i} className="flex flex-col items-center bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 break-inside-avoid print:bg-white print:border-slate-300">
                        <div className="w-full aspect-square relative mb-3">
                            <svg viewBox="0 0 200 200" className="w-full h-full bg-white border-2 border-slate-300 rounded-full shadow-sm">
                                <circle cx="100" cy="100" r="2" fill="#1e293b" />
                                {/* Clock Face Marks */}
                                {Array.from({ length: 12 }).map((_, k) => {
                                    const angle = (k / 12) * Math.PI * 2 - Math.PI / 2 + (Math.PI / 6) // Start at 1
                                    const x1 = 100 + Math.cos(angle) * 80
                                    const y1 = 100 + Math.sin(angle) * 80
                                    const x2 = 100 + Math.cos(angle) * 90
                                    const y2 = 100 + Math.sin(angle) * 90
                                    const tx = 100 + Math.cos(angle) * 70
                                    const ty = 100 + Math.sin(angle) * 70
                                    return (
                                        <g key={k}>
                                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />
                                            <text x={tx} y={ty + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#64748b">{k + 1}</text>
                                        </g>
                                    )
                                })}
                                {/* Student draws hands here */}
                            </svg>
                        </div>
                        <div className="font-mono text-xl font-bold text-slate-700 bg-white px-4 py-1 rounded border border-slate-200">
                            {time}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        {times.map((tStr, i) => {
                            const [h, m] = tStr.split(':').map(Number)
                            return (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="mb-2 font-bold text-emerald-800">{tStr}</div>
                                    <div className="w-24 h-24 relative">
                                        <svg viewBox="0 0 200 200" className="w-full h-full bg-white border border-emerald-200 rounded-full">
                                            {/* Hands */}
                                            {(() => {
                                                const hAngle = ((h % 12) + m / 60) * 30 - 90
                                                const mAngle = m * 6 - 90
                                                const hRad = hAngle * Math.PI / 180
                                                const mRad = mAngle * Math.PI / 180
                                                return (
                                                    <g>
                                                        {/* Hour Hand */}
                                                        <line
                                                            x1="100" y1="100"
                                                            x2={100 + Math.cos(hRad) * 50}
                                                            y2={100 + Math.sin(hRad) * 50}
                                                            stroke="#059669" strokeWidth="4" strokeLinecap="round"
                                                        />
                                                        {/* Minute Hand */}
                                                        <line
                                                            x1="100" y1="100"
                                                            x2={100 + Math.cos(mRad) * 75}
                                                            y2={100 + Math.sin(mRad) * 75}
                                                            stroke="#059669" strokeWidth="3" strokeLinecap="round"
                                                        />
                                                        <circle cx="100" cy="100" r="3" fill="#047857" />
                                                    </g>
                                                )
                                            })()}
                                        </svg>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Compare 2-Digit Numbers
// ==========================================
export function Compare2Digit({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'compare-2digit'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    const pairs: Array<[number, number]> = Array.from({ length: 10 }).map(() => {
        const a = nextInt(10, 99); const b = nextInt(10, 99); return [a, b];
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Compare 2-Digit Numbers"
            emoji={String.fromCodePoint(0x2696)}
            description="Write one comparison symbol in each blank: > (greater than), < (less than), or = (equal to). Tip: Compare tens first. If tens are equal, compare ones."
            problemCount={pairs.length}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x mb-2" />
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Problem:</strong> Compare 58 and 41</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Compare tens: 5 tens vs 4 tens</div>
                        <div><strong>Step 2:</strong> 5 &gt; 4, so 58 &gt; 41</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> 58 &gt; 41</div>
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

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {pairs.map(([a, b], i) => {
                            const symbol = a > b ? '>' : a < b ? '<' : '=';
                            return (
                                <div key={i} className="text-sm text-emerald-800">
                                    {i + 1}. {a} <strong>{symbol}</strong> {b}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Even or Odd to 100
// ==========================================
export function EvenOdd100({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'even-odd-100'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
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
            <PremiumWorksheetBanner
                title="Even or Odd?"
                subtitle="Number Sorting"
                icons={{
                    bg1: "🔢",
                    bg2: "⚖️",
                    float1: "2️⃣",
                    float2: "❓"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-violet-50 to-rose-50",
                    border: "border-violet-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-violet-300",
                    pillText: "text-violet-800",
                    accent: "text-violet-300"
                }}
            />

            <StrategySpotlight
                title="How to Check"
                icon="💡"
                steps={[
                    { label: "Look", text: "Look at the Ones digit (the last number)." },
                    { label: "Even", text: "0, 2, 4, 6, 8 -> It is EVEN!" },
                    { label: "Odd", text: "1, 3, 5, 7, 9 -> It is ODD!" }
                ]}
                color="violet"
            />

            <div className="grid grid-cols-2 gap-3 text-xl font-mono break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                {nums.map((n, i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full flex items-center justify-between break-inside-avoid">
                        <span>{n}</span>
                        <span className="mx-2 text-base text-slate-400">Even / Odd</span>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-2">
                        {nums.map((n, i) => (
                            <div key={i} className="text-sm text-emerald-800">
                                {i + 1}. {n} is <strong>{n % 2 === 0 ? 'Even' : 'Odd'}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Add 2-Digit with Regrouping
// ==========================================
export function Add2DigitRegrouping({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'add-2digit-regrouping'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }
    function genPairsWithRegrouping(count: number) {
        const out: Array<[number, number]> = [];
        let guard = 0;
        while (out.length < count && guard < 10000) {
            const a = nextInt(15, 99);
            const b = nextInt(6, 99);
            if (a + b <= 100 && ((a % 10) + (b % 10)) >= 10) {
                out.push([a, b]);
            }
            guard++;
        }
        return out;
    }
    const pairs = genPairsWithRegrouping(10);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, '2-Digit Addition (WITH Regrouping)')}
            emoji={String.fromCodePoint(0x2795)}
            description={t(`worksheets.${docId}.description`, 'Add the two numbers. You will need to regroup (carry) when the ones add up to 10 or more.')}
            problemCount={pairs.length}
            learningObjectives={[
                'Add 2-digit numbers with regrouping',
                'Understand place value involved in carrying',
                'Build addition fluency'
            ]}
            parentTeacherTips={[
                'Line up the numbers vertically',
                'Always start with the ones place',
                'If ones add to 10+, write the ones digit and carry the ten',
                'Don\'t forget to add the carried 1!'
            ]}
        >
            <PremiumWorksheetBanner
                title="Addition Regrouping"
                subtitle="Carrying to the Tens"
                icons={{
                    bg1: "➕",
                    bg2: "🔟",
                    float1: "⬆️",
                    float2: "1️⃣"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
                    border: "border-pink-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-800",
                    accent: "text-pink-300"
                }}
            />

            <StrategySpotlight
                title="Regrouping Rule"
                icon="☝️"
                steps={[
                    { label: "Step 1", text: "Add the ONES first." },
                    { label: "Step 2", text: "If the sum is 10 or more..." },
                    { label: "Step 3", text: "Write the ones digit at bottom, CARRY the ten to top!" }
                ]}
                color="pink"
            />
            <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                        <div className="font-mono text-2xl leading-7 text-right">
                            <div>{a}</div>
                            <div>+ {b}</div>
                            <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                        {pairs.map(([a, b], i) => (<li key={i}>{a} + {b} = {a + b}</li>))}
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Sub 2-Digit with Regrouping
// ==========================================
export function Sub2DigitRegrouping({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'sub-2digit-regrouping'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    function nextInt(min: number, max: number) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }
    function genPairsWithRegrouping(count: number) {
        const out: Array<[number, number]> = [];
        let guard = 0;
        while (out.length < count && guard < 10000) {
            const a = nextInt(20, 99);
            const b = nextInt(1, a - 1);
            if ((a % 10) < (b % 10)) {
                out.push([a, b]);
            }
            guard++;
        }
        return out;
    }
    const pairs = genPairsWithRegrouping(10);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, '2-Digit Subtraction (WITH Regrouping)')}
            emoji={String.fromCharCode(0x2796)}
            description={t(`worksheets.${docId}.description`, 'Subtract the two numbers. You will need to regroup (borrow) when the ones digit is smaller.')}
            problemCount={pairs.length}
            learningObjectives={[
                'Subtract 2-digit numbers with regrouping',
                'Understand borrowing/trading from tens',
                'Check answers using addition'
            ]}
            parentTeacherTips={[
                'Check if the top number in the ones place is smaller',
                'If so, borrow 1 ten (which becomes 10 ones)',
                'Change the tens number (it goes down by 1)',
                'Always subtract ones first, then tens'
            ]}
        >
            <PremiumWorksheetBanner
                title="Subtraction Regrouping"
                subtitle="Borrowing from Tens"
                icons={{
                    bg1: "➖",
                    bg2: "📉",
                    float1: "⬇️",
                    float2: "🔙"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-orange-50 to-red-50",
                    border: "border-orange-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-orange-300",
                    pillText: "text-orange-800",
                    accent: "text-orange-300"
                }}
            />

            <StrategySpotlight
                title="Subtraction Poem"
                icon="🗣️"
                steps={[
                    { label: "Top > Bottom", text: "More on top? No need to stop!" },
                    { label: "Bottom > Top", text: "More on the floor? Go next door, get 10 more!" },
                    { label: "Same", text: "Numbers the same? Zero's the game!" }
                ]}
                color="orange"
            />
            <div className="grid grid-cols-2 gap-3">
                {pairs.map(([a, b], i) => (
                    <div key={i} className="border border-slate-300 rounded p-3 bg-white w-full">
                        <div className="font-mono text-2xl leading-7 text-right">
                            <div>{a}</div>
                            <div>{String.fromCharCode(0x2212)} {b}</div>
                            <div className="border-t-[3px] border-slate-600 mt-2 pt-2 h-12 flex items-center"><span className="inline-block w-20 h-10 border-b-[3px] border-slate-600" /></div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                    <div className="font-semibold mb-1">Answer key</div>
                    <ul className="list-disc list-inside space-y-0.5">
                        {pairs.map(([a, b], i) => (<li key={i}>{a} {String.fromCharCode(0x2212)} {b} = {a - b}</li>))}
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Fractions: Halves, Thirds, Fourths
// ==========================================
export function FractionsHalvesThirdsFourths({ showAnswersForDoc, seed, variant, activeDocs, showAnswers }: SpecificWorksheetProps & { activeDocs: string[], showAnswers: boolean }) {
    const { t } = useTranslation()
    const docId = 'fractions-halves-thirds-fourths'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)

    const allFractions = [
        { label: '1/2', parts: 2, filled: 1 },
        { label: '1/3', parts: 3, filled: 1 },
        { label: '2/3', parts: 3, filled: 2 },
        { label: '1/4', parts: 4, filled: 1 },
        { label: '2/4', parts: 4, filled: 2 },
        { label: '3/4', parts: 4, filled: 3 },
    ];
    const problems = allFractions
        .map(item => ({ item, sort: rng() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fractions: Halves, Thirds, Fourths"
            emoji={String.fromCharCode(0xD83C, 0xDF70)}
            description="Color the fraction shown in each shape. Then write the fraction name in the blank space provided."
            problemCount={6}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-gradient-x mb-2" />
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Fraction:</strong> 1/2 (one half)</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at the fraction: 1/2 means 1 out of 2 equal parts</div>
                        <div><strong>Step 2:</strong> The shape is divided into 2 equal parts (halves)</div>
                        <div><strong>Step 3:</strong> Color 1 of the 2 parts</div>
                        <div><strong>Step 4:</strong> Write "one half" in the blank</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((frac, idx) => (
                    <div key={idx} className="border border-slate-300 rounded p-4 bg-white">
                        <svg viewBox="0 0 200 200" className="w-full h-auto mb-2">
                            {frac.parts === 2 ? (
                                <>
                                    <rect x="20" y="20" width="80" height="160" fill={frac.filled >= 1 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="100" y="20" width="80" height="160" fill={frac.filled >= 2 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                </>
                            ) : frac.parts === 3 ? (
                                <>
                                    <rect x="20" y="20" width="53.33" height="160" fill={frac.filled >= 1 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="73.33" y="20" width="53.33" height="160" fill={frac.filled >= 2 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="126.66" y="20" width="53.34" height="160" fill={frac.filled >= 3 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                </>
                            ) : (
                                <>
                                    <rect x="20" y="20" width="80" height="80" fill={frac.filled >= 1 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="100" y="20" width="80" height="80" fill={frac.filled >= 2 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="20" y="100" width="80" height="80" fill={frac.filled >= 3 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                    <rect x="100" y="100" width="80" height="80" fill={frac.filled >= 4 ? '#3b82f6' : '#e5e7eb'} stroke="#111827" strokeWidth="3" />
                                </>
                            )}
                        </svg>
                        <p className="text-center text-slate-700 font-semibold">{frac.label}</p>
                        <p className="text-center text-slate-600 text-sm mt-1">
                            Write: "{showAnswers && activeDocs.includes('fractions-halves-thirds-fourths') ? (
                                <span className="text-emerald-700 font-semibold">
                                    {frac.label === '1/2' ? 'one half' :
                                        frac.label === '1/3' ? 'one third' :
                                            frac.label === '2/3' ? 'two thirds' :
                                                frac.label === '1/4' ? 'one fourth' :
                                                    frac.label === '2/4' ? 'two fourths' :
                                                        'three fourths'}
                                </span>
                            ) : '____'}"
                        </p>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{t('common.answerKey') || (String.fromCharCode(0x2705) + ' Answer Key')}</div>
                    <ul className="list-disc list-inside space-y-2 text-sm text-emerald-800">
                        <li><strong>1/2 = one half</strong></li>
                        <li><strong>1/3 = one third</strong></li>
                        <li><strong>2/3 = two thirds</strong></li>
                        <li><strong>1/4 = one fourth</strong></li>
                        <li><strong>2/4 = two fourths</strong></li>
                        <li><strong>3/4 = three fourths</strong></li>
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Skip Counting by 5s and 10s
// ==========================================
export function SkipCounting5To120({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'skip-counting-by-5s-and-10s-to-120'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const seq5 = Array.from({ length: 24 }, (_, i) => (i + 1) * 5); // 5..120
    const seq10 = Array.from({ length: 12 }, (_, i) => (i + 1) * 10); // 10..120
    const isBlank5 = (i: number) => i % 3 === 1;
    const isBlank10 = (i: number) => i % 3 === 2;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Skip Counting by 5s and 10s (to 120)"
            emoji={String.fromCodePoint(0x1F430)}
            description="Fill in the missing numbers."
            problemCount={seq5.filter((_, i) => isBlank5(i)).length + seq10.filter((_, i) => isBlank10(i)).length}
        >
            <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-400 animate-gradient-x mb-2" />
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                <div className="space-y-2 text-sm">
                    <div className="font-semibold text-base"><strong>Count by 5s:</strong> 5, 10, ___, 20, 25</div>
                    <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                        <div><strong>Step 1:</strong> Look at the pattern: 5, 10, ___, 20, 25</div>
                        <div><strong>Step 2:</strong> Each number is 5 more than the previous: 5 + 5 = 10, 10 + 5 = 15</div>
                        <div className="font-semibold text-blue-900"><strong>Answer:</strong> 15</div>
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
            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-3">
                        <div className="text-sm text-emerald-800">
                            <strong>Count by 5s to 120:</strong> The missing numbers are: {seq5.filter((_, i) => isBlank5(i)).map((n, idx) => `${idx + 1}. ${n}`).join(', ')}
                        </div>
                        <div className="text-sm text-emerald-800">
                            <strong>Count by 10s to 120:</strong> The missing numbers are: {seq10.filter((_, i) => isBlank10(i)).map((n, idx) => `${idx + 1}. ${n}`).join(', ')}
                        </div>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Missing Numbers (1-50 Train)
// ==========================================
export function MissingNumbers50({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'missing-numbers-50'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)

    // Train Configurations
    const trainConfigs = [
        { id: 1, start: 1, length: 10, color: 'emerald' },
        { id: 2, start: 11, length: 10, color: 'blue' },
        { id: 3, start: 21, length: 10, color: 'purple' },
        { id: 4, start: 31, length: 10, color: 'orange' },
        { id: 5, start: 41, length: 10, color: 'rose' },
    ]

    const problems = trainConfigs.map(conf => {
        const carriages = Array.from({ length: conf.length }, (_, i) => {
            const num = conf.start + i
            // Hide roughly 40-50% of numbers, but keep first and last sometimes for anchors?
            // Let's make it random but ensure reasonably doable.
            const isHidden = rng() > 0.5
            return { num, isHidden }
        })
        return { ...conf, carriages }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Number Train: 1 to 50')}
            emoji="🔢"
            description={t(`worksheets.${docId}.description`, 'All aboard! Fill in the missing numbers on the train carriages.')}
            problemCount={5}
            learningObjectives={[
                'Identify missing numbers in sequences up to 50',
                'Count forward from different starting points',
                'Write two-digit numbers legibly',
                'Recognize number patterns (tens and ones)'
            ]}
            parentTeacherTips={[
                'Have your child read the full sequence out loud after filling in the blanks.',
                'Point out patterns: "Look, all the numbers in this column end with 5!"',
                'Use objects (like blocks) to build the train if they need concrete help.'
            ]}
        >
            {/* Decorative Track Header */}
            <div className="print:hidden w-full h-4 border-b-4 border-slate-400 border-dashed mb-6 relative">
                <div className="absolute top-0 right-0 -mt-8 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>✂️</div>
            </div>

            <div className="space-y-6 break-inside-avoid">
                {problems.map((train, idx) => (
                    <div key={idx} className="w-full overflow-hidden p-2">
                        {/* Ensure no wrapping and allow scrolling/shrinking if needed, but for print we want it to fit */}
                        <div className="flex items-end gap-0.5 flex-nowrap">
                            {/* Engine SVG */}
                            <div className="shrink-0 w-24 h-20 mb-1 relative flex flex-col items-center justify-end">
                                <svg viewBox="0 0 100 80" className={`w-full h-full text-${train.color}-600 fill-current drop-shadow-sm`}>
                                    {/* Classic Steam Engine Profile */}
                                    {/* Cabin */}
                                    <path d="M55,30 L90,30 L90,65 L55,65 Z" />
                                    {/* Roof */}
                                    <path d="M52,30 L93,30 Q95,25 93,25 L52,25 Q50,25 52,30 Z" fillOpacity="0.8" />
                                    {/* Boiler */}
                                    <rect x="20" y="35" width="40" height="30" rx="2" />
                                    {/* Funnel */}
                                    <path d="M25,35 L25,20 L15,10 L35,10 L25,20 L25,35 Z" />
                                    {/* Cow Catcher / Front */}
                                    <path d="M20,65 L10,65 L5,55 L20,55 Z" />
                                    {/* Window */}
                                    <rect x="62" y="36" width="20" height="15" fill="white" fillOpacity="0.8" rx="1" />

                                    {/* Wheels - Big Rear */}
                                    <circle cx="75" cy="70" r="9" fill="#334155" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="75" cy="70" r="3" fill="#94a3b8" />

                                    {/* Wheels - Small Fronts */}
                                    <circle cx="30" cy="70" r="7" fill="#334155" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="30" cy="70" r="2" fill="#94a3b8" />
                                    <circle cx="48" cy="70" r="7" fill="#334155" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="48" cy="70" r="2" fill="#94a3b8" />

                                    {/* Smoke */}
                                    <circle cx="25" cy="0" r="4" className="text-slate-300 animate-ping" style={{ transformOrigin: 'center', animationDuration: '2s' }} />
                                    <circle cx="35" cy="-8" r="6" className="text-slate-200 animate-pulse" />
                                </svg>
                                <div className="absolute -top-1 left-0 w-full text-center">
                                    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-white bg-${train.color}-500 rounded-full shadow-sm`}>
                                        Engine {train.start}
                                    </span>
                                </div>
                            </div>

                            {/* Carriages */}
                            <div className="flex items-end flex-nowrap pl-1">
                                {train.carriages.map((c, i) => (
                                    <div key={i} className="flex items-end shrink-0">
                                        {/* Coupler - adjusted margin/width */}
                                        {i >= 0 && <div className={`w-1.5 h-1.5 rounded-full bg-slate-400 mb-5 relative z-0 -mr-0.5`}></div>}

                                        {/* Carriage Box - adjusted size slightly to fit 10 */}
                                        <div className={`w-10 h-12 md:w-11 md:h-14 border-2 border-${train.color}-400 bg-${train.color}-50 rounded-lg relative z-10 flex flex-col items-center justify-between pb-1 shadow-sm`}>
                                            {/* Roof line */}
                                            <div className={`w-full h-1.5 bg-${train.color}-200 border-b border-${train.color}-300 rounded-t-lg`}></div>

                                            {/* Number Content */}
                                            <div className="flex-1 flex items-center justify-center w-full">
                                                {c.isHidden ? (
                                                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded bg-white border border-${train.color}-200 shadow-inner flex items-center justify-center`}>
                                                    </div>
                                                ) : (
                                                    <span className={`text-lg md:text-xl font-bold text-${train.color}-900`}>{c.num}</span>
                                                )}
                                            </div>

                                            {/* Wheels */}
                                            <div className="w-full flex justify-around px-1 translate-y-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-500 shadow-sm"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-500 shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                    <div className="space-y-4">
                        {problems.map((train, idx) => (
                            <div key={idx} className="flex gap-2 items-center text-sm">
                                <span className="font-bold w-16">Train {idx + 1}:</span>
                                <div className="flex gap-1 font-mono">
                                    {train.carriages.map(c => (
                                        <span key={c.num} className={c.isHidden ? 'text-emerald-700 font-bold underline bg-emerald-100 px-1 rounded' : 'text-slate-400'}>
                                            {c.num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Doubles & Near Doubles
// ==========================================
export function DoublesNearDoubles({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'doubles-near-doubles'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 8 }, () => {
        const base = nextInt(2, 9)
        const type = rng() > 0.5 ? 'plus1' : 'minus1'
        const neighbor = type === 'plus1' ? base + 1 : base - 1

        return {
            base,
            neighbor,
            sum: base + neighbor,
            doubleSum: base * 2
        }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Doubles & Near Doubles')}
            emoji="👯"
            description={t(`worksheets.${docId}.description`, 'Use your doubles facts to solve the near doubles!')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Near Doubles"
                subtitle="One More, One Less"
                icons={{
                    bg1: "➕",
                    bg2: "➖",
                    float1: "1️⃣",
                    float2: "🍬"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
                    border: "border-pink-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-pink-300",
                    pillText: "text-pink-800",
                    accent: "text-pink-300"
                }}
            />

            <StrategySpotlight
                title="Use What You Know!"
                icon="💡"
                steps={[
                    { label: "Double It", text: "You know 6 + 6 = 12" },
                    { label: "Add One", text: "6 + 7 is just one more... so it's 13!" }
                ]}
                color="pink"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-4 border-2 border-pink-100 rounded-xl bg-pink-50/50 break-inside-avoid shadow-sm flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-slate-500 font-semibold mb-1">
                                Think: {p.base} + {p.base} = {p.doubleSum}
                            </div>
                            <div className="flex items-center gap-3 text-3xl font-bold text-slate-700">
                                <span>{p.base}</span>
                                <span className="text-pink-400">+</span>
                                <span>{p.neighbor}</span>
                                <span>=</span>
                                <div className="w-16 h-12 border-2 border-pink-300 bg-white rounded-lg shadow-inner"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answers:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {problems.map((p, i) => (
                            <div key={i}>{p.base} + {p.neighbor} = <strong>{p.sum}</strong></div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// Number Line to 200
// ==========================================
export function NumberLine200({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'number-line-200'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)
    const nextInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

    const problems = Array.from({ length: 5 }, () => {
        // Start somewhere between 0 and 150
        const start = Math.floor(nextInt(0, 15) * 10)
        const step = nextInt(1, 3) === 1 ? 5 : 10
        const targetOffset = nextInt(1, 4) * step
        const target = start + targetOffset

        return { start, step, target, targetOffset }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`, 'Number Line Journey (to 200)')}
            emoji="🛤️"
            description={t(`worksheets.${docId}.description`, 'Find the missing numbers on the number line.')}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="Number Line Layout"
                subtitle="Jumping to 200"
                icons={{
                    bg1: "📏",
                    bg2: "🐸",
                    float1: "📍",
                    float2: "🚩"
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

            <div className="space-y-8 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 border-2 border-indigo-100 rounded-xl bg-white break-inside-avoid">
                        <div className="mb-4 font-bold text-slate-700">
                            Problem {i + 1}: <span className="font-normal text-slate-500">Skip count by {p.step}s</span>
                        </div>

                        <div className="relative h-20 w-full flex items-center">
                            {/* Main Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-300 rounded"></div>

                            {/* Ticks and Labels */}
                            {Array.from({ length: 11 }).map((_, k) => {
                                const val = p.start + (k * p.step)
                                const isTarget = val === p.target
                                const isHidden = isTarget // Hide the target

                                return (
                                    <div key={k} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ left: `${k * 10}%` }}>
                                        <div className="w-0.5 h-4 bg-slate-400"></div>
                                        {isHidden ? (
                                            <div className="w-10 h-8 border-2 border-indigo-400 rounded bg-indigo-50 shadow-inner flex items-center justify-center font-bold text-indigo-600">

                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold text-slate-600 transform -rotate-45 origin-top-left translate-y-2">{val}</span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answers:</div>
                    <div className="flex flex-wrap gap-4 text-sm">
                        {problems.map((p, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded border border-emerald-200">
                                #{i + 1}: <strong>{p.target}</strong>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
