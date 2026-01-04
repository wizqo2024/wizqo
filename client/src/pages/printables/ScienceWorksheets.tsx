import React, { ReactNode } from 'react'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared'
import { makeRng, pick, shuffleArray } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

// --- Extended Logic for Premium Science ---

interface LifecycleData {
    name: string
    stages: string[]
}

function generateLifecycle(seed: string): LifecycleData {
    const rng = makeRng(seed)
    const cycles = [
        { name: 'Butterfly', stages: ['Egg 🥚', 'Caterpillar 🐛', 'Pupa 🧱', 'Butterfly 🦋'] },
        { name: 'Frog', stages: ['Egg 🥚', 'Tadpole 🐟', 'Froglet 🐸', 'Adult Frog 🐸'] },
        { name: 'Plant', stages: ['Seed 🌱', 'Sprout 🌿', 'Young Plant 🌳', 'Flower 🌸'] },
        { name: 'Chicken', stages: ['Egg 🥚', 'Hatchling 🐣', 'Chick 🐥', 'Hen 🐔'] },
    ]
    const cycle = cycles[Math.floor(rng() * cycles.length)]
    return cycle
}

interface SortingData {
    theme: string
    items: { name: string, category: string }[]
    categories: string[]
}

function generateScienceSorting(seed: string): SortingData {
    const rng = makeRng(seed)
    const themes = [
        {
            name: 'Living vs Non-Living',
            sets: {
                'Living': ['Puppy 🐶', 'Tree 🌲', 'Spider 🕷️', 'Flower 🌷', 'Bird 🐦', 'Mushroom 🍄'],
                'Non-Living': ['Rock 🪨', 'Car 🚗', 'Toy 🧸', 'Spoon 🥄', 'Robot 🤖', 'Pencil ✏️']
            }
        },
        {
            name: 'Sink or Float',
            sets: {
                'Float': ['Apple 🍎', 'Wood 🪵', 'Leaf 🍃', 'Boat ⛵', 'Feather 🪶', 'Cork 🍾'],
                'Sink': ['Coin 🪙', 'Key 🔑', 'Stone 🪨', 'Brick 🧱', 'Anchor ⚓', 'Marble 🔮']
            }
        },
        {
            name: 'Solids vs Liquids',
            sets: {
                'Solid': ['Ice 🧊', 'Wood 🪵', 'Metal 🔩', 'Glass 🥛', 'Bread 🍞', 'Paper 📄'],
                'Liquid': ['Water 💧', 'Milk 🥛', 'Juice 🧃', 'Oil 🫗', 'Rain 🌧️', 'Honey 🍯']
            }
        }
    ]

    const theme = themes[Math.floor(rng() * themes.length)]
    const cats = Object.keys(theme.sets)
    const cat1 = cats[0]
    const cat2 = cats[1]

    const set1 = shuffleArray(theme.sets[cat1], rng).slice(0, 4)
    const set2 = shuffleArray(theme.sets[cat2], rng).slice(0, 4)

    const items = [
        ...set1.map(i => ({ name: i, category: cat1 })),
        ...set2.map(i => ({ name: i, category: cat2 }))
    ]
    shuffleArray(items, rng)

    return { theme: theme.name, items, categories: [cat1, cat2] }
}

// --- Components ---

export function ScienceWorksheets({
    doc,
    effectiveSeed,
    variant,
    showAnswersForDoc
}: {
    doc: string
    effectiveSeed: string
    variant: string
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
}) {
    const { t } = useTranslation()

    // --- Lifecycle Upgrade ---
    if (doc.startsWith('science-lifecycle')) {
        const data = generateLifecycle(`${effectiveSeed}|${doc}|v${variant}`)
        const rng = makeRng(`${effectiveSeed}|${doc}|v${variant}`)
        const shuffledStages = shuffleArray(data.stages.map((s, i) => ({ text: s, originalIdx: i })), rng)

        return (
            <WorksheetSectionWrapper
                docId={doc}
                title={`${data.name} Lifecycle`}
                emoji="🔄"
                description={`Order the stages of the ${data.name} lifecycle by writing 1-4 in the circles.`}
                problemCount={4}
                learningObjectives={[
                    `Understand the sequence of biological growth in a ${data.name.toLowerCase()}`,
                    'Identify key vocabulary for developmental stages',
                    'Practice sequence and pattern recognition in nature'
                ]}
                parentTeacherTips={[
                    'Explain that lifecycles are continuous loops—the end stage creates the beginning!',
                    'Ask what special needs the organism has in each stage (e.g., food, shelter).',
                    'Discuss how long each stage might last in the real world.'
                ]}
            >
                <PremiumWorksheetBanner
                    title="Nature's Cycle"
                    subtitle={`${data.name} Growth Journey`}
                    icons={{ bg1: "🌱", bg2: "🦋", float1: "🔄", float2: "☀️" }}
                    colors={{
                        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
                        border: "border-green-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-green-300",
                        pillText: "text-green-900",
                        accent: "text-green-400"
                    }}
                />

                <StrategySpotlight
                    title="Scientist's Note: The Loop of Life"
                    description="A lifecycle shows how a living thing grows, changes, and produces more of its kind. It starts with a seed or egg and goes all the way to a full-grown adult!"
                    icon="🔬"
                    color="green"
                />

                <div className="mt-12 mb-12 flex justify-center break-inside-avoid">
                    <div className="relative w-full max-w-2xl aspect-[1.2/1]">
                        {/* Central Visual (Optional placeholder or logo) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-200 opacity-50">
                            <span className="text-6xl opacity-30">🔄</span>
                        </div>

                        {/* Circular Layout of Stages */}
                        {shuffledStages.map((stage, i) => {
                            const angle = (i * 90) * (Math.PI / 180)
                            const rX = 40 // % radius
                            const rY = 35 // % radius
                            const x = 50 + rX * Math.cos(angle - Math.PI / 2)
                            const y = 50 + rY * Math.sin(angle - Math.PI / 2)

                            return (
                                <div
                                    key={i}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 w-40"
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    <div className="bg-white p-6 rounded-2xl border-4 border-slate-200 shadow-md w-full aspect-square flex flex-col items-center justify-center group hover:border-emerald-300 transition-colors">
                                        <div className="text-5xl mb-2">{stage.text.split(' ')[1] || '❓'}</div>
                                        <div className="font-bold text-slate-800 text-center">{stage.text.split(' ')[0]}</div>
                                    </div>

                                    {/* Ordering Circle */}
                                    <div className="w-10 h-10 rounded-full border-4 border-emerald-500 bg-white shadow-sm flex items-center justify-center font-black text-emerald-900 z-10">
                                        {/* Blank for child to fill */}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Connection Arrows (Simplified for print) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                            <path d="M 65 30 Q 75 50 65 70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 35 70 Q 25 50 35 30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 40 20 Q 50 10 60 20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 60 80 Q 50 90 40 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                        </svg>
                    </div>
                </div>

                {showAnswersForDoc(doc, () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl print:bg-white">
                        <div className="font-bold text-emerald-900 mb-2">Answer Key: {data.name} Lifecycle</div>
                        <ol className="list-decimal list-inside space-y-1 text-emerald-800 font-medium">
                            {data.stages.map((s, idx) => (
                                <li key={idx}>Stage {idx + 1}: {s}</li>
                            ))}
                        </ol>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        )
    }

    // --- Sorting Upgrade ---
    if (doc.startsWith('science-match')) {
        const data = generateScienceSorting(`${effectiveSeed}|${doc}|v${variant}`)

        return (
            <WorksheetSectionWrapper
                docId={doc}
                title={data.theme}
                emoji="🔬"
                description={`Sort the items into the correct categories: ${data.categories[0]} or ${data.categories[1]}.`}
                problemCount={data.items.length}
                learningObjectives={[
                    `Identify key characteristics that define ${data.categories[0]} and ${data.categories[1]}`,
                    'Apply classification skills to real-world objects',
                    'Develop scientific observation and logical grouping'
                ]}
                parentTeacherTips={[
                    `For "${data.theme}", ask the child to describe one physical property for each category.`,
                    'If they get stuck, try a real-world experiment (like dropping objects in water for float/sink).',
                    'Discuss "edge cases"—items that might fit in both or change state.'
                ]}
            >
                <PremiumWorksheetBanner
                    title="The Sorting Lab"
                    subtitle={`Exercise: ${data.theme}`}
                    icons={{ bg1: "🔬", bg2: "🧪", float1: "⚖️", float2: "🥽" }}
                    colors={{
                        bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
                        border: "border-indigo-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-indigo-300",
                        pillText: "text-indigo-900",
                        accent: "text-indigo-400"
                    }}
                />

                <div className="grid md:grid-cols-2 gap-8 mt-10 items-start break-inside-avoid">
                    {/* Items Bank */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 text-center uppercase tracking-widest text-xs">
                            Materials Log
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {data.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sorting Buckets (SVG) */}
                    <div className="space-y-6">
                        {data.categories.map((cat, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-white border-2 border-indigo-500 rounded-full font-bold text-indigo-700 text-sm z-10">
                                    {cat}
                                </div>
                                <div className="h-44 bg-indigo-50/30 border-2 border-indigo-200 border-t-0 rounded-b-3xl rounded-t-lg relative overflow-hidden">
                                    {/* Liquid-ish background visual */}
                                    {/* <div className="absolute bottom-0 w-full h-1/2 bg-indigo-100/50"></div> */}

                                    {/* Placeholder for writing */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-indigo-300 text-xs font-bold opacity-30 uppercase tracking-[0.2em]">
                                            Write items here
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showAnswersForDoc(doc, () => (
                    <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
                        <div className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <span>🥽</span> Lab Results: Answer Key
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.categories.map(cat => (
                                <div key={cat} className="space-y-1">
                                    <div className="font-bold text-indigo-700 text-sm">{cat}:</div>
                                    <ul className="text-sm text-indigo-900 italic">
                                        {data.items.filter(it => it.category === cat).map(it => (
                                            <li key={it.name}>• {it.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        )
    }

    return null
}
