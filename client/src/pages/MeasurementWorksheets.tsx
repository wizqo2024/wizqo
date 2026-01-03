
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

// Shared layout for Measurement worksheets
const MeasurementLayout: React.FC<{
    title: string
    subtitle: string
    emoji: string
    color: 'blue' | 'purple' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'rose' | 'cyan'
    bannerIcons: { bg1: string; bg2: string; float1: string; float2: string }
    strategy: { title: string; steps: { label: string; text: string }[] }
    children: React.ReactNode
}> = ({ title, subtitle, emoji, color, bannerIcons, strategy, children }) => {

    const colorMap = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-sky-50", border: "border-blue-200", pillBg: "bg-white/80", pillBorder: "border-blue-300", pillText: "text-blue-800", accent: "text-blue-300", darkText: "text-blue-900", lightBg: "bg-blue-50" },
        purple: { bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50", border: "border-purple-200", pillBg: "bg-white/80", pillBorder: "border-purple-300", pillText: "text-purple-800", accent: "text-purple-300", darkText: "text-purple-900", lightBg: "bg-purple-50" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", border: "border-emerald-200", pillBg: "bg-white/80", pillBorder: "border-emerald-300", pillText: "text-emerald-800", accent: "text-emerald-300", darkText: "text-emerald-900", lightBg: "bg-emerald-50" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-orange-50", border: "border-amber-200", pillBg: "bg-white/80", pillBorder: "border-amber-300", pillText: "text-amber-800", accent: "text-amber-300", darkText: "text-amber-900", lightBg: "bg-amber-50" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-violet-50", border: "border-indigo-200", pillBg: "bg-white/80", pillBorder: "border-indigo-300", pillText: "text-indigo-800", accent: "text-indigo-300", darkText: "text-indigo-900", lightBg: "bg-indigo-50" },
        fuchsia: { bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50", border: "border-fuchsia-200", pillBg: "bg-white/80", pillBorder: "border-fuchsia-300", pillText: "text-fuchsia-800", accent: "text-fuchsia-300", darkText: "text-fuchsia-900", lightBg: "bg-fuchsia-50" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-pink-50", border: "border-rose-200", pillBg: "bg-white/80", pillBorder: "border-rose-300", pillText: "text-rose-800", accent: "text-rose-300", darkText: "text-rose-900", lightBg: "bg-rose-50" },
        cyan: { bg: "bg-gradient-to-br from-cyan-50 to-sky-50", border: "border-cyan-200", pillBg: "bg-white/80", pillBorder: "border-cyan-300", pillText: "text-cyan-800", accent: "text-cyan-300", darkText: "text-cyan-900", lightBg: "bg-cyan-50" }
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
// 1. Mass and Weight (Grams, Kilograms, Ounces, Pounds)
// ==========================================

export const MassAndWeight: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 6 }).map((_, i) => {
            // Comparison problems
            const type = i < 3 ? 'Compare' : 'Estimate'
            let text = ''
            let answer = ''
            let item = ''

            if (type === 'Compare') {
                const val1 = rng.int(2, 50)
                const isKg = rng() > 0.5
                const unit1 = isKg ? 'kg' : 'lb'
                const factor = isKg ? 1000 : 16 // 1kg=1000g, 1lb=16oz
                const unit2 = isKg ? 'g' : 'oz'
                const val2 = rng.int(val1 * factor - (factor / 2), val1 * factor + (factor / 2))
                text = `${val1} ${unit1} vs ${val2} ${unit2}`
                const total2 = val1 * factor
                answer = total2 > val2 ? '>' : total2 < val2 ? '<' : '='
            } else {
                item = getRandomItem(['Elephant', 'Apple', 'Bicycle', 'Feather', 'Car', 'Book'], rng)
                let correct = ''
                let distractor = ''
                switch (item) {
                    case 'Elephant': correct = '4,000 kg'; distractor = '4,000 g'; break
                    case 'Apple': correct = '150 g'; distractor = '150 kg'; break
                    case 'Bicycle': correct = '12 kg'; distractor = '12 g'; break
                    case 'Feather': correct = '1 g'; distractor = '1 kg'; break
                    case 'Car': correct = '1,500 kg'; distractor = '1,500 g'; break
                    case 'Book': correct = '500 g'; distractor = '500 kg'; break
                }
                text = `Best estimate for a ${item}?`
                answer = correct
                // Swapping for rendering
                if (rng() > 0.5) text += ` (${correct} or ${distractor})`
                else text += ` (${distractor} or ${correct})`
            }
            return { id: i + 1, type, text, answer, item }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Mass & Weight"
            description="Compare and estimate mass (g/kg) and weight (oz/lb)."
            learningObjectives={["Convert between kg and g", "Convert between lb and oz", "Estimate reasonable weights"]}
            emoji="⚖️"
            problemCount={problems.length}
            parentTeacherTips={["1 kg = 1,000 g", "1 lb = 16 oz", "Paperclip ~ 1g, Dictionary ~ 1kg"]}
        >
            <MeasurementLayout
                title="Scale Master"
                subtitle="Heavy or Light?"
                emoji="⚖️"
                color="amber"
                bannerIcons={{ bg1: "⚖️", bg2: "🏋️", float1: "kg", float2: "oz" }}
                strategy={{
                    title: "Weight Rules",
                    steps: [
                        { label: "Metric", text: "1 kg = 1,000 g (Kilo means 1000!)" },
                        { label: "Customary", text: "1 lb = 16 oz (Pound is heavier)" },
                        { label: "Estimate", text: "Car = kg. Apple = g. Human = lb/kg." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">{prob.type}</div>
                                    <div className="text-slate-400 font-bold">#{prob.id}</div>
                                </div>
                                <div className="text-center font-medium text-lg mb-4">
                                    {prob.text}
                                </div>
                                {prob.type === 'Compare' && (
                                    <div className="flex justify-center gap-4 text-3xl font-bold text-slate-300">
                                        <div className="border-2 border-slate-200 rounded-lg w-12 h-12 flex items-center justify-center">&lt;</div>
                                        <div className="border-2 border-slate-200 rounded-lg w-12 h-12 flex items-center justify-center">&gt;</div>
                                        <div className="border-2 border-slate-200 rounded-lg w-12 h-12 flex items-center justify-center">=</div>
                                    </div>
                                )}
                                {prob.type === 'Estimate' && (
                                    <div className="flex justify-center my-2">
                                        {/* Simple icon placeholder */}
                                        <div className="text-4xl">🤔</div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 border-t pt-2 border-slate-100 text-center">
                                <span className="text-xs text-slate-400 uppercase tracking-widest">Answer</span>
                                <div className="h-6 w-full border-b border-slate-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl break-before-page">
                        <h3 className="font-bold text-amber-900 mb-4 flex items-center text-xl"><span>✅ Answer Key</span></h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-amber-100">
                                    <div className="font-bold text-amber-800 mb-1">Problem {p.id}</div>
                                    <div className="text-lg font-mono text-slate-700">{p.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </MeasurementLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 2. Liquid Measurement (Capacity)
// ==========================================

export const LiquidMeasurement: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 6 }).map((_, i) => {
            // Conversions
            // 1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 cups
            const startUnit = getRandomItem(['gal', 'qt', 'pt'], rng)
            let endUnit = ''
            let factor = 1
            if (startUnit === 'gal') { endUnit = 'qt'; factor = 4; }
            else if (startUnit === 'qt') { endUnit = 'pt'; factor = 2; }
            else { endUnit = 'cups'; factor = 2; }

            const val = rng.int(2, 10)
            return { id: i + 1, text: `${val} ${startUnit} = ___ ${endUnit}`, answer: `${val * factor}` }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Liquid Measurement"
            description="Convert liquid capacities (gallons, quarts, pints, cups)."
            learningObjectives={["Convert gallons to quarts", "Convert quarts to pints", "Convert pints to cups"]}
            emoji="🥛"
            problemCount={problems.length}
            parentTeacherTips={["The Big G: 1 G has 4 Qs, each Q has 2 Ps, each P has 2 Cs."]}
        >
            <MeasurementLayout
                title="Potion Lab"
                subtitle="Capacity Mix"
                emoji="🥛"
                color="cyan"
                bannerIcons={{ bg1: "🧪", bg2: "⚗️", float1: "gl", float2: "qt" }}
                strategy={{
                    title: "Capacity Kingdom",
                    steps: [
                        { label: "Gallon (G)", text: "King Gallon has 4 Queens (Quarts)" },
                        { label: "Quart (Q)", text: "Each Queen has 2 Prince/Princesses (Pints)" },
                        { label: "Pint (P)", text: "Each Prince has 2 Cats (Cups)" }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white flex items-center justify-between">
                            <div className="font-bold text-xl text-slate-700">{prob.text}</div>
                            {/* Visual Beaker Hint */}
                            <div className="w-16 h-20 border-2 border-cyan-400 border-t-0 rounded-b-lg relative bg-cyan-50">
                                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-cyan-200 rounded-b-md opacity-50"></div>
                                <div className="absolute top-2 right-1 text-[10px] text-cyan-600 font-mono">mL</div>
                                <div className="absolute top-1/3 right-0 w-2 h-px bg-cyan-400"></div>
                                <div className="absolute top-2/3 right-0 w-2 h-px bg-cyan-400"></div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-xl break-before-page">
                        <h3 className="font-bold text-cyan-900 mb-4 flex items-center text-xl"><span>✅ Answer Key</span></h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-cyan-100">
                                    <div className="font-bold text-cyan-800 mb-1">Problem {p.id}</div>
                                    <div className="text-lg font-mono text-slate-700">{p.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </MeasurementLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 3. Elapsed Time
// ==========================================

export const ElapsedTime: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 6 }).map((_, i) => {
            // Start time + Duration = End time
            const startH = rng.int(1, 11)
            const startM = rng.pick([0, 15, 30, 45])
            const durH = rng.int(0, 3)
            const durM = rng.pick([15, 30, 45])

            let endM = startM + durM
            let endH = startH + durH
            if (endM >= 60) {
                endH += 1
                endM -= 60
            }
            if (endH > 12) endH -= 12

            const formatTime = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`
            return {
                id: i + 1,
                start: formatTime(startH, startM),
                duration: `${durH}h ${durM}m`,
                answer: formatTime(endH, endM)
            }
        })
    }, [docId])

    const renderClock = (timeStr: string) => {
        // Very simple SVG clock
        const [hStr, mStr] = timeStr.split(':')
        const h = parseInt(hStr)
        const m = parseInt(mStr)
        const hAng = (h % 12) * 30 + (m / 2)
        const mAng = m * 6

        return (
            <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="fill-white stroke-slate-800 stroke-2" />
                <line x1="50" y1="50" x2="50" y2="25" className="stroke-slate-800 stroke-4" transform={`rotate(${hAng} 50 50)`} strokeLinecap="round" />
                <line x1="50" y1="50" x2="50" y2="15" className="stroke-slate-600 stroke-2" transform={`rotate(${mAng} 50 50)`} strokeLinecap="round" />
                <circle cx="50" cy="50" r="2" className="fill-slate-800" />
                {/* Reference ticks */}
                <line x1="50" y1="5" x2="50" y2="10" className="stroke-slate-400" />
                <line x1="95" y1="50" x2="90" y2="50" className="stroke-slate-400" />
                <line x1="50" y1="95" x2="50" y2="90" className="stroke-slate-400" />
                <line x1="5" y1="50" x2="10" y2="50" className="stroke-slate-400" />
            </svg>
        )
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Elapsed Time"
            description="Calculate the end time given a start time and duration."
            learningObjectives={["Add time intervals", "Understand clock face movement", "Calculate ending times"]}
            emoji="⏱️"
            problemCount={problems.length}
            parentTeacherTips={["Add minutes first. If > 60, convert to hour.", "Use a number line to jump hours then minutes."]}
        >
            <MeasurementLayout
                title="Time Traveler"
                subtitle="Clock Quest"
                emoji="⏱️"
                color="purple"
                bannerIcons={{ bg1: "🕰️", bg2: "⌛", float1: "Start", float2: "End" }}
                strategy={{
                    title: "Time Travel Steps",
                    steps: [
                        { label: "1. Add Hours", text: "Jump the big hand." },
                        { label: "2. Add Minutes", text: "Jump the small hand." },
                        { label: "3. Check 60", text: "If minutes > 60, add another hour!" }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-slate-400 uppercase font-bold mb-1">Start</span>
                                    {renderClock(prob.start)}
                                    <span className="font-bold text-slate-700 mt-1">{prob.start}</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <div className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded mb-1">+{prob.duration}</div>
                                    <div className="text-2xl text-slate-300">➜</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-slate-400 uppercase font-bold mb-1">End</span>
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-2xl">?</div>
                                    <div className="border-b-2 border-slate-300 w-16 h-6 mt-1"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl break-before-page">
                        <h3 className="font-bold text-purple-900 mb-4 flex items-center text-xl"><span>✅ Answer Key</span></h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-purple-100">
                                    <div className="font-bold text-purple-800 mb-1">Problem {p.id}</div>
                                    <div className="text-lg font-mono text-slate-700">{p.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </MeasurementLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 4. Customary Units (Inches, Feet, Yards)
// ==========================================

export const CustomaryUnits: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 6 }).map((_, i) => {
            // Simple conversions
            const isFtToIn = rng() > 0.5
            const val = rng.int(2, 12)
            let text = ''
            let ans = 0

            if (isFtToIn) {
                text = `${val} ft = ___ in`
                ans = val * 12
            } else {
                // Yd to ft
                text = `${val} yd = ___ ft`
                ans = val * 3
            }
            return { id: i + 1, text, answer: ans }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Customary Units"
            description="Convert inches, feet, and yards."
            learningObjectives={["Convert feet to inches", "Convert yards to feet"]}
            emoji="📏"
            problemCount={problems.length}
            parentTeacherTips={["1 foot = 12 inches", "1 yard = 3 feet"]}
        >
            <MeasurementLayout
                title="Length Logic"
                subtitle="Inches, Feet, Yards"
                emoji="📏"
                color="emerald"
                bannerIcons={{ bg1: "🪜", bg2: "👞", float1: "ft", float2: "in" }}
                strategy={{
                    title: "Ruler Rules",
                    steps: [
                        { label: "Foot", text: "1 Foot = 12 Inches (Like a standard ruler)" },
                        { label: "Yard", text: "1 Yard = 3 Feet (Like a door width)" },
                        { label: "Rule", text: "Big to Small -> Multiply" }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white flex flex-col justify-center">
                            <div className="text-2xl font-bold text-center text-slate-700 mb-4">{prob.text}</div>
                            {/* Visual Ruler Segment */}
                            <div className="w-full h-8 bg-yellow-100 border border-yellow-400 rounded relative overflow-hidden">
                                {Array.from({ length: 20 }).map((_, k) => (
                                    <div key={k} className="absolute top-0 bottom-0 border-r border-yellow-500 opacity-50" style={{ left: `${k * 5}%` }}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl break-before-page">
                        <h3 className="font-bold text-emerald-900 mb-4 flex items-center text-xl"><span>✅ Answer Key</span></h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-emerald-100">
                                    <div className="font-bold text-emerald-800 mb-1">Problem {p.id}</div>
                                    <div className="text-lg font-mono text-slate-700">{p.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </MeasurementLayout>
        </WorksheetSectionWrapper>
    )
}
