import React from 'react'
import type { ReactNode } from 'react'
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
                icon="📏"
                color="blue"
                range="50-200"
            />

            <StrategySpotlight
                title="Stretch it Out!"
                tips={[
                    "Say the number out loud slowly.",
                    "134 sounds like 'One hundred... thirty... four'.",
                    "Write exactly what you hear: 100 + 30 + 4"
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
                icon="🕵️"
                color="purple"
                range="1-200"
            />

            <StrategySpotlight
                title="Find the Rule"
                tips={[
                    "Look at two numbers side-by-side.",
                    "Are they getting bigger (+) or smaller (-)?",
                    "How much did they change? Is it the same next time?"
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
                                        {p.holes[idx] && <span className="text-purple-100 text-3xl font-light">?</span>}
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
                icon="🚀"
                color="orange"
                range="10-99"
            />

            <StrategySpotlight
                title="Rocket Rules for Rounding"
                tips={[
                    "Look at the digit in the ones place (the neighbor).",
                    "5 or more? Round UP to the next 10. (🚀 Blast off!)",
                    "4 or less? Round DOWN (stay at the same 10). (Land safely)"
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
                icon="3️⃣"
                color="green"
                range="1-9"
            />

            <StrategySpotlight
                title="Strategy: Make it Easier!"
                tips={[
                    "Look for pairs that make 10 (like 6 + 4).",
                    "Look for doubles (like 3 + 3).",
                    "Add those two first, then add the third number!"
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
                icon="🕵️‍♀️"
                color="indigo"
                range="Sums to 20"
            />

            <StrategySpotlight
                title="Part + Part = Whole"
                tips={[
                    "If a PART is missing, SUBTRACT the other part from the Whole.",
                    "Example: 5 + ? = 12",
                    "12 is the Whole. 5 is a Part.",
                    "12 - 5 = 7. The missing part is 7!"
                ]}
                color="indigo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-center p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 shadow-sm print:bg-white print:border-slate-300 break-inside-avoid">
                        <div className="flex items-center gap-3 text-2xl font-bold font-mono text-slate-700">
                            {p.hideA ? (
                                <div className="w-12 h-12 bg-white border-2 border-indigo-300 rounded flex items-center justify-center text-indigo-300 shadow-inner">?</div>
                            ) : (
                                <span>{p.a}</span>
                            )}
                            <span className="text-indigo-400">+</span>
                            {!p.hideA ? (
                                <div className="w-12 h-12 bg-white border-2 border-indigo-300 rounded flex items-center justify-center text-indigo-300 shadow-inner">?</div>
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
                icon="👨‍👩‍👧"
                color="pink"
                range="Sums to 20"
            />

            <StrategySpotlight
                title="3 Numbers = 4 Facts"
                tips={[
                    "Big number is always the Sum (Addition) or the Whole (Subtraction).",
                    "Add the small parts: 3 + 4 = 7",
                    "Switch them: 4 + 3 = 7",
                    "Subtract from the whole: 7 - 3 = 4",
                    "Subtract the other part: 7 - 4 = 3"
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
                icon="⚡"
                color="red"
                range="0-20"
            />

            <StrategySpotlight
                title="Mental Math Tricks"
                tips={[
                    "Doubles Rule: 6 + 7 is just 6 + 6 + 1 (13).",
                    "Make 10: 8 + 5 -> 8 + 2 is 10, plus 3 more is 13.",
                    "Counting Back: 15 - 2 -> 14, 13."
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

    const Coin = ({ type, size }: { type: 'Q' | 'D' | 'N' | 'P', size: number }) => {
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
                icon="🪙"
                color="yellow"
                range="0-99¢"
            />

            <StrategySpotlight
                title="Counting Coins Strategy"
                tips={[
                    "Start with the biggest value coins (Quarters 25¢).",
                    "Add the Dimes (10¢), then Nickels (5¢).",
                    "Count the Pennies (1¢) last!"
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
                icon="📏"
                color="cyan"
                range="Inches"
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
                icon="📊"
                color="fuchsia"
                range="Data Analysis"
            />

            <div className="my-8 bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm print:shadow-none break-inside-avoid">
                <h3 className="text-center font-bold text-lg text-slate-800 mb-6">Favorite Colors in Our Class</h3>
                <div className="flex items-end justify-around h-64 border-b-2 border-l-2 border-slate-800 pl-2 pb-2 relative">
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
                        <div key={i} className="flex flex-col items-center w-12 sm:w-16 h-full justify-end group">
                            <div
                                className="w-full bg-slate-300 rounded-t-sm transition-all print:border print:border-slate-800"
                                style={{
                                    height: `${d.value * 10}%`,
                                    backgroundColor: d.name.toLowerCase() === 'yellow' ? '#fde047' : d.name.toLowerCase() === 'red' ? '#f87171' : d.name.toLowerCase() === 'blue' ? '#60a5fa' : '#4ade80'
                                }}
                            >
                                <span className="hidden print:block text-xs font-bold text-center -mt-4">{d.value}</span>
                            </div>
                            <span className="mt-2 text-xs font-bold text-slate-600 uppercase tracking-wider">{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 break-inside-avoid">
                <div className="p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100 print:bg-white print:border-slate-200">
                    <div className="font-bold text-slate-700 mb-1">1. How many students chose {most.name}?</div>
                    <div className="w-full h-8 border-b border-slate-300 bg-white"></div>
                </div>
                <div className="p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100 print:bg-white print:border-slate-200">
                    <div className="font-bold text-slate-700 mb-1">2. Which color had the least votes?</div>
                    <div className="w-full h-8 border-b border-slate-300 bg-white"></div>
                </div>
                <div className="p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100 print:bg-white print:border-slate-200">
                    <div className="font-bold text-slate-700 mb-1">3. How many more students chose {most.name} than {least.name}?</div>
                    <div className="w-full h-8 border-b border-slate-300 bg-white"></div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900">Answer Key</h3>
                    </div>
                    <div className="space-y-2 text-sm text-emerald-800 font-medium">
                        <div>1. {most.value}</div>
                        <div>2. {least.name}</div>
                        <div>3. {most.value} - {least.value} = {most.value - least.value}</div>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
