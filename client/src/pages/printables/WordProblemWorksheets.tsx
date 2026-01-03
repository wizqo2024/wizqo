import * as React from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared'
import { makeRng } from '@/utils/printableUtils'

type ShowAnswersFn = (docId: string, content: () => React.ReactNode) => React.ReactNode

// Shared layout for word problems to ensure consistency
const WordProblemLayout: React.FC<{
    title: string
    subtitle: string
    emoji: string
    color: 'blue' | 'purple' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan'
    bannerIcons: { bg1: string; bg2: string; float1: string; float2: string }
    strategy: { title: string; steps: { label: string; text: string }[] }
    workedExample: { problem: string; steps: string[]; answer: string; tip?: string }
    problems: { text: string; answerSteps: string[]; finalAnswer: string }[]
    children?: React.ReactNode
}> = ({ title, subtitle, emoji, color, bannerIcons, strategy, workedExample, problems, children }) => {

    // Map color to specific tailwind classes
    const colorMap = {
        blue: {
            bg: "bg-gradient-to-br from-blue-50 to-sky-50",
            border: "border-blue-200",
            pillBg: "bg-white/80",
            pillBorder: "border-blue-300",
            pillText: "text-blue-800",
            accent: "text-blue-300",
            darkText: "text-blue-900",
            lightBg: "bg-blue-50"
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
            border: "border-purple-200",
            pillBg: "bg-white/80",
            pillBorder: "border-purple-300",
            pillText: "text-purple-800",
            accent: "text-purple-300",
            darkText: "text-purple-900",
            lightBg: "bg-purple-50"
        },
        emerald: {
            bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
            border: "border-emerald-200",
            pillBg: "bg-white/80",
            pillBorder: "border-emerald-300",
            pillText: "text-emerald-800",
            accent: "text-emerald-300",
            darkText: "text-emerald-900",
            lightBg: "bg-emerald-50"
        },
        amber: {
            bg: "bg-gradient-to-br from-amber-50 to-orange-50",
            border: "border-amber-200",
            pillBg: "bg-white/80",
            pillBorder: "border-amber-300",
            pillText: "text-amber-800",
            accent: "text-amber-300",
            darkText: "text-amber-900",
            lightBg: "bg-amber-50"
        },
        indigo: {
            bg: "bg-gradient-to-br from-indigo-50 to-violet-50",
            border: "border-indigo-200",
            pillBg: "bg-white/80",
            pillBorder: "border-indigo-300",
            pillText: "text-indigo-800",
            accent: "text-indigo-300",
            darkText: "text-indigo-900",
            lightBg: "bg-indigo-50"
        },
        rose: {
            bg: "bg-gradient-to-br from-rose-50 to-pink-50",
            border: "border-rose-200",
            pillBg: "bg-white/80",
            pillBorder: "border-rose-300",
            pillText: "text-rose-800",
            accent: "text-rose-300",
            darkText: "text-rose-900",
            lightBg: "bg-rose-50"
        },
        cyan: {
            bg: "bg-gradient-to-br from-cyan-50 to-sky-50",
            border: "border-cyan-200",
            pillBg: "bg-white/80",
            pillBorder: "border-cyan-300",
            pillText: "text-cyan-800",
            accent: "text-cyan-300",
            darkText: "text-cyan-900",
            lightBg: "bg-cyan-50"
        }
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
                icon="🧠"
                steps={strategy.steps}
                color={color}
                className="mb-8"
            />

            {/* Worked Example */}
            <div className={`mb-8 p-6 rounded-xl border-2 ${colorMap.border} ${colorMap.lightBg} shadow-sm break-inside-avoid`}>
                <div className={`flex items-center gap-2 font-bold ${colorMap.darkText} mb-4 text-lg`}>
                    <span className="text-2xl">💡</span> Worked Example
                </div>
                <div className="space-y-4">
                    <div className="font-medium text-slate-800 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        {workedExample.problem}
                    </div>
                    <div className="pl-6 border-l-4 border-white space-y-3">
                        {workedExample.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 text-slate-700">
                                <span className={`font-bold ${colorMap.pillText}`}>Step {i + 1}:</span>
                                <span>{step}</span>
                            </div>
                        ))}
                        <div className={`font-bold ${colorMap.darkText} text-lg mt-2 pt-2 border-t border-slate-200/50`}>
                            Ans: {workedExample.answer}
                        </div>
                        {workedExample.tip && (
                            <div className="text-sm text-slate-500 italic flex items-center gap-2">
                                <span>✨</span> Tip: {workedExample.tip}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {problems.map((p, i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="flex gap-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colorMap.bg} ${colorMap.border} border flex items-center justify-center font-bold ${colorMap.pillText}`}>
                                {i + 1}
                            </div>
                            <div className="flex-grow space-y-4">
                                <div className="text-lg font-medium text-slate-800 leading-relaxed">
                                    {p.text}
                                </div>
                                <div className={`min-h-[160px] border-2 border-dashed ${colorMap.border} rounded-xl bg-slate-50/50 p-4 relative`}>
                                    <div className="absolute top-3 left-3 text-slate-400 text-sm font-medium italic">
                                        Show your work here...
                                    </div>
                                    <div className="absolute bottom-3 right-3 text-slate-400 text-sm">
                                        Answer: _________________
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {children}
        </>
    )
}

export const FractionWordProblems: React.FC<{ docId: string; showAnswersForDoc: ShowAnswersFn }> = ({ docId, showAnswersForDoc }) => {
    const { t } = useTranslation()
    const rng = makeRng(docId)

    const problems = [
        {
            text: "Emma ate 1/4 of a pizza on Monday and 3/8 of the same pizza on Tuesday. How much pizza did she eat in total?",
            answerSteps: ["Find common denominator: 1/4 = 2/8", "Add: 2/8 + 3/8 = 5/8"],
            finalAnswer: "5/8 of the pizza"
        },
        {
            text: "A recipe calls for 2/3 cup of sugar. Sarah has 1/6 cup. How much more does she need?",
            answerSteps: ["Find common denominator: 2/3 = 4/6", "Subtract: 4/6 - 1/6 = 3/6", "Simplify: 3/6 = 1/2"],
            finalAnswer: "1/2 cup"
        },
        {
            text: "There are 24 students in the class. 1/3 of them bring their lunch. How many students bring their lunch?",
            answerSteps: ["Formula: 1/3 of 24", "Calculate: 24 ÷ 3 = 8"],
            finalAnswer: "8 students"
        },
        {
            text: "Tom ran 3/5 of a mile and walked 1/5 of a mile. How far did he travel in total?",
            answerSteps: ["Add: 3/5 + 1/5 = 4/5"],
            finalAnswer: "4/5 of a mile"
        }
    ]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Fraction Tales"
            emoji="🍕"
            description="Solve real-world problems using fractions."
            problemCount={problems.length}
            learningObjectives={['Add/Sub fractions in context', 'Fractions of a whole number']}
            parentTeacherTips={['Draw pie charts if stuck!', 'Find common denominators first.']}
        >
            <WordProblemLayout
                title="Fraction Tales"
                subtitle="Real World Math"
                emoji="🍕"
                color="purple"
                bannerIcons={{ bg1: "🍰", bg2: "🥧", float1: "½", float2: "¼" }}
                strategy={{
                    title: "Solving Fraction Problems",
                    steps: [
                        { label: "Visualize", text: "Draw the fraction (pizza or bar)." },
                        { label: "Operation", text: "Are we combining (+) or finding difference (-)?" },
                        { label: "Match", text: "Make denominators the same before adding." },
                        { label: "Solve", text: "Calculate and simplify if needed." }
                    ]
                }}
                workedExample={{
                    problem: "Jake has 3/4 of a chocolate bar. He gives 1/4 to his friend. How much does he have left?",
                    steps: [
                        "Check denominators: Both are 4 (Good!).",
                        "Subtract numerators: 3 - 1 = 2.",
                        "Keep denominator: 2/4.",
                        "Simplify: 2/4 = 1/2."
                    ],
                    answer: "1/2 of a bar",
                    tip: "Always check if you can simplify your answer!"
                }}
                problems={problems}
            >
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                            <span>✅</span> Answer Key
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {problems.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-emerald-200">
                                    <div className="font-bold text-emerald-800 mb-2">Problem {i + 1}</div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        {p.answerSteps.map((step, si) => (
                                            <div key={si}>• {step}</div>
                                        ))}
                                        <div className="font-bold text-emerald-700 mt-2 border-t pt-1 border-emerald-100">
                                            Ans: {p.finalAnswer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WordProblemLayout>
        </WorksheetSectionWrapper>
    )
}

export const DecimalWordProblems: React.FC<{ docId: string; showAnswersForDoc: ShowAnswersFn }> = ({ docId, showAnswersForDoc }) => {
    const problems = [
        {
            text: "A notebook costs $3.25 and a pen costs $1.50. How much do they cost together?",
            answerSteps: ["Align decimals: 3.25 + 1.50", "Add: $4.75"],
            finalAnswer: "$4.75"
        },
        {
            text: "Sarah has $10.00. She spends $4.35 on a snack. How much money does she have left?",
            answerSteps: ["Align decimals: 10.00 - 4.35", "Borrow and subtract: $5.65"],
            finalAnswer: "$5.65"
        },
        {
            text: "A snail crawled 2.4 meters in the morning and 1.8 meters in the afternoon. What is the total distance?",
            answerSteps: ["Align decimals: 2.4 + 1.8", "Add: 4.2 meters"],
            finalAnswer: "4.2 meters"
        },
        {
            text: "Tom wants to buy a toy for $8.50. He saves $1.25 each week for 4 weeks. Does he have enough?",
            answerSteps: ["Calculate savings: $1.25 × 4 = $5.00", "Compare: $5.00 < $8.50"],
            finalAnswer: "No, he needs $3.50 more"
        }
    ]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Decimal Dollars & Sense"
            emoji="💵"
            description="Solve money and measurement problems using decimals."
            problemCount={problems.length}
            learningObjectives={['Add/Sub decimals', 'Money math application']}
            parentTeacherTips={['Line up the decimal points!', 'Add placeholder zeros if needed (e.g. 10.00).']}
        >
            <WordProblemLayout
                title="Decimal Daily Life"
                subtitle="Money & Measurement"
                emoji="💵"
                color="emerald"
                bannerIcons={{ bg1: "💰", bg2: "🏷️", float1: "$", float2: "." }}
                strategy={{
                    title: "The Decimal Rule",
                    steps: [
                        { label: "Line Up", text: "Line up the decimal points vertically." },
                        { label: "Fill", text: "Fill empty spots with 0 (e.g., 5 becomes 5.0)." },
                        { label: "Drop", text: "Drop the decimal point straight down." },
                        { label: "Solve", text: "Add or subtract like normal whole numbers." }
                    ]
                }}
                workedExample={{
                    problem: "Max has $5.50. He buys a drink for $2.25. How much is left?",
                    steps: [
                        "Line up:  5.50",
                        "          - 2.25",
                        "Subtract:   3.25 (50-25=25, 5-2=3)"
                    ],
                    answer: "$3.25",
                    tip: "Think of cents: 50 cents minus 25 cents."
                }}
                problems={problems}
            >
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                            <span>✅</span> Answer Key
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {problems.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-emerald-200">
                                    <div className="font-bold text-emerald-800 mb-2">Problem {i + 1}</div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        {p.answerSteps.map((step, si) => (
                                            <div key={si}>• {step}</div>
                                        ))}
                                        <div className="font-bold text-emerald-700 mt-2 border-t pt-1 border-emerald-100">
                                            Ans: {p.finalAnswer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WordProblemLayout>
        </WorksheetSectionWrapper>
    )
}

export const MeasurementWordProblems: React.FC<{ docId: string; showAnswersForDoc: ShowAnswersFn }> = ({ docId, showAnswersForDoc }) => {
    const problems = [
        {
            text: "A room is 12 feet long and 10 feet wide. What is the perimeter of the room?",
            answerSteps: ["Formula: 2 × (Length + Width)", "Calc: 2 × (12 + 10) = 2 × 22 = 44"],
            finalAnswer: "44 feet"
        },
        {
            text: "Sarah is building a fence. She needs 3 yards of wood, but the store only sells it in feet. How many feet does she need?",
            answerSteps: ["Conversion: 1 yard = 3 feet", "Calc: 3 yards × 3 = 9 feet"],
            finalAnswer: "9 feet"
        },
        {
            text: "A jug holds 2 liters of water. How many milliliters is that?",
            answerSteps: ["Conversion: 1 Liter = 1,000 mL", "Calc: 2 × 1,000"],
            finalAnswer: "2,000 mL"
        },
        {
            text: "Class starts at 9:00 AM and ends at 10:30 AM. How many minutes long is the class?",
            answerSteps: ["Hours: 9 to 10 is 60 mins", "Minutes: 10 to 10:30 is 30 mins", "Total: 60 + 30"],
            finalAnswer: "90 minutes"
        }
    ]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Measure Master"
            emoji="📏"
            description="Solving problems with length, time, and volume."
            problemCount={problems.length}
            learningObjectives={['Calculate Perimeter', 'Convert units (ft/yd, L/mL)', 'Time intervals']}
            parentTeacherTips={['Draw the shape for perimeter questions.', 'Remember: 12 in = 1 ft, 3 ft = 1 yd.']}
        >
            <WordProblemLayout
                title="Measurement Mastery"
                subtitle="Length, Time & Volume"
                emoji="📏"
                color="amber"
                bannerIcons={{ bg1: "⚖️", bg2: "🕰️", float1: "📏", float2: "🥛" }}
                strategy={{
                    title: "Metric & Customary",
                    steps: [
                        { label: "Unit Check", text: "Are units the same? (e.g. feet vs inches)" },
                        { label: "Convert", text: "Big to Small = Multiply. Small to Big = Divide." },
                        { label: "Draw", text: "Sketch the room, clock, or container." },
                        { label: "Solve", text: "Do the math." }
                    ]
                }}
                workedExample={{
                    problem: "A box is 5 feet long. How many inches is that?",
                    steps: [
                        "Know the rule: 1 foot = 12 inches.",
                        "Big (ft) to Small (in) means Multiply.",
                        "Calc: 5 × 12 = 60."
                    ],
                    answer: "60 inches",
                    tip: "Think: inches are tiny, so you need MORE of them."
                }}
                problems={problems}
            >
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                            <span>✅</span> Answer Key
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {problems.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-emerald-200">
                                    <div className="font-bold text-emerald-800 mb-2">Problem {i + 1}</div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        {p.answerSteps.map((step, si) => (
                                            <div key={si}>• {step}</div>
                                        ))}
                                        <div className="font-bold text-emerald-700 mt-2 border-t pt-1 border-emerald-100">
                                            Ans: {p.finalAnswer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WordProblemLayout>
        </WorksheetSectionWrapper>
    )
}

export const GeometryWordProblems: React.FC<{ docId: string; showAnswersForDoc: ShowAnswersFn }> = ({ docId, showAnswersForDoc }) => {
    const problems = [
        {
            text: "A rectangular garden is 8 meters long and 4 meters wide. What is its Area?",
            answerSteps: ["Formula: Area = Length × Width", "Calc: 8 × 4 = 32"],
            finalAnswer: "32 square meters"
        },
        {
            text: "A square tile has a side length of 10 cm. What is the Perimeter of the tile?",
            answerSteps: ["Formula: Perimeter = Side × 4 (or add all sides)", "Calc: 10 + 10 + 10 + 10 = 40"],
            finalAnswer: "40 cm"
        },
        {
            text: "A triangle has a base of 6 inches and a height of 4 inches. What is the Area?",
            answerSteps: ["Formula: 1/2 × Base × Height", "Calc: 1/2 × 6 × 4", "Half of 24 is 12"],
            finalAnswer: "12 square inches"
        },
        {
            text: "A swimming pool is a rectangle. The area is 50 square meters. The length is 10 meters. What is the width?",
            answerSteps: ["Formula: Area = L × W", "50 = 10 × ?", "50 ÷ 10 = 5"],
            finalAnswer: "5 meters"
        }
    ]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Geometry Genius"
            emoji="📐"
            description="Solving problems with Area and Perimeter."
            problemCount={problems.length}
            learningObjectives={['Area of Rectangles', 'Perimeter of Polygons', 'Unknown side lengths']}
            parentTeacherTips={['Area is the inside (grass).', 'Perimeter is the outside (fence).']}
        >
            <WordProblemLayout
                title="Geometry Genius"
                subtitle="Area & Perimeter"
                emoji="📐"
                color="indigo"
                bannerIcons={{ bg1: "🟦", bg2: "🔺", float1: "📐", float2: "✏️" }}
                strategy={{
                    title: "Shape Detective",
                    steps: [
                        { label: "Identify", text: "Is it a Square? Rectangle? Triangle?" },
                        { label: "Question", text: "Are we finding Area (inside) or Perimeter (outside)?" },
                        { label: "Formula", text: "Write down the rule (e.g., A = L × W)." },
                        { label: "Compute", text: "Plug in the numbers and solve." }
                    ]
                }}
                workedExample={{
                    problem: "A rug is 5 feet long and 3 feet wide. What is the Area?",
                    steps: [
                        "Shape: Rectangle.",
                        "Goal: Area (space covered).",
                        "Formula: Length × Width.",
                        "Calc: 5 × 3 = 15."
                    ],
                    answer: "15 sq feet",
                    tip: "Don't forget to say 'square' units for Area!"
                }}
                problems={problems}
            >
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                            <span>✅</span> Answer Key
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {problems.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-emerald-200">
                                    <div className="font-bold text-emerald-800 mb-2">Problem {i + 1}</div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        {p.answerSteps.map((step, si) => (
                                            <div key={si}>• {step}</div>
                                        ))}
                                        <div className="font-bold text-emerald-700 mt-2 border-t pt-1 border-emerald-100">
                                            Ans: {p.finalAnswer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WordProblemLayout>
        </WorksheetSectionWrapper>
    )
}

export const WordProblems100: React.FC<{ docId: string; showAnswersForDoc: ShowAnswersFn }> = ({ docId, showAnswersForDoc }) => {
    const { t } = useTranslation()
    const problems = React.useMemo(() => {
        const rng = makeRng(new Date().toDateString())
        return Array.from({ length: 6 }).map(() => {
            const isAdd = rng() > 0.5
            let n1, n2, ans, text, steps

            if (isAdd) {
                // Addition within 100
                n1 = rng.int(10, 60)
                n2 = rng.int(5, 39)
                ans = n1 + n2
                const items = rng.pick(['marbles', 'stickers', 'cards', 'pages'])
                const name = rng.pick(['Mia', 'Liam', 'Noah', 'Ava'])
                text = `${name} has ${n1} ${items}. ${name === 'Mia' || name === 'Ava' ? 'She' : 'He'} gets ${n2} more. How many ${items} does ${name === 'Mia' || name === 'Ava' ? 'she' : 'he'} have now?`
                steps = [`Identify: Start with ${n1}, add ${n2}`, `Solve: ${n1} + ${n2} = ${ans}`]
            } else {
                // Subtraction within 100
                n1 = rng.int(30, 99)
                n2 = rng.int(5, 25)
                ans = n1 - n2
                const items = rng.pick(['apples', 'pencils', 'cookies', 'books'])
                const name = rng.pick(['Tom', 'Sara', 'Leo', 'Zoe'])
                text = `${name} had ${n1} ${items}. ${name === 'Sara' || name === 'Zoe' ? 'She' : 'He'} gave away ${n2}. How many ${items} are left?`
                steps = [`Identify: Start with ${n1}, subtract ${n2}`, `Solve: ${n1} - ${n2} = ${ans}`]
            }
            return {
                text,
                answerSteps: steps,
                finalAnswer: `${ans}`
            }
        })
    }, [])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t('worksheets.wordProblems.title', "Word Problem Wizards")}
            emoji="🧙‍♂️"
            description={t('worksheets.wordProblems.description', "Read each word problem carefully and solve.")}
            problemCount={problems.length}
            learningObjectives={['Solve addition word problems', 'Solve subtraction word problems', 'Understand word problem keywords']}
            parentTeacherTips={['"More" usually means add.', '"Left" usually means subtract.']}
        >
            <WordProblemLayout
                title="Word Problem Wizards"
                subtitle="Addition & Subtraction within 100"
                emoji="🧙‍♂️"
                color="amber"
                bannerIcons={{ bg1: "✨", bg2: "📜", float1: "🔮", float2: "⭐" }}
                strategy={{
                    title: "Spell for Solving",
                    steps: [
                        { label: " READ", text: "Read the story carefully." },
                        { label: " PLAN", text: "Circle numbers. Box key words (more, left)." },
                        { label: " SOLVE", text: "Write the equation and find the answer." },
                    ]
                }}
                workedExample={{
                    problem: "Alex found 15 magic stones. He found 12 more. How many stones in all?",
                    steps: [
                        "Circle 15 and 12. Box 'in all' (means add).",
                        "Equation: 15 + 12 = 27",
                    ],
                    answer: "27 stones",
                    tip: "Make sure your answer has a label (stones)!"
                }}
                problems={problems}
            >
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 border-2 border-emerald-300 bg-emerald-50 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl flex items-center gap-2">
                            <span>✅</span> Answer Key
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {problems.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg border border-emerald-200">
                                    <div className="font-bold text-emerald-800 mb-2">Problem {i + 1}</div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        {p.answerSteps.map((step, si) => (
                                            <div key={si}>• {step}</div>
                                        ))}
                                        <div className="font-bold text-emerald-700 mt-2 border-t pt-1 border-emerald-100">
                                            Ans: {p.finalAnswer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WordProblemLayout>
        </WorksheetSectionWrapper>
    )
}
