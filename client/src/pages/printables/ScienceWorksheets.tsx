import React from 'react'
import type { ReactNode } from 'react'
import { WorksheetSectionWrapper } from './PrintableShared'
import { makeRng, pick } from '@/utils/printableUtils'

// --- Helper Functions ---

interface Theme {
    name: string;
    sets: Record<string, string[]>;
}

function generateScienceSorting(seed: string) {
    const rng = makeRng(seed)
    const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

    const themes: Theme[] = [
        {
            name: 'Living vs Non-Living',
            sets: {
                'Living': ['🐶', '🌲', '🐛', '🌷', '🦋', '🍄', '🐢'],
                'Non-Living': ['rock', 'car', 'balloon', 'spoon', 'robot', 'cup', 'pencil'] // Using words/simple text if emojis ambiguous
            }
        },
        {
            name: 'Sink or Float',
            sets: {
                'Float': ['apple', 'wood', 'leaf', 'boat', 'feather'],
                'Sink': ['rock', 'coin', 'key', 'brick', 'metal spoon']
            }
        },
        {
            name: 'Vertebrate vs Invertebrate',
            sets: {
                'Vertebrate': ['Human', 'Dog', 'Bird', 'Fish', 'Frog'],
                'Invertebrate': ['Worm', 'Spider', 'Jellyfish', 'Octopus', 'Snail']
            }
        }
    ]

    const theme = pick(themes)
    const cats = Object.keys(theme.sets)
    const cat1 = cats[0]
    const cat2 = cats[1]

    // Pick 3 items from each
    const set1 = theme.sets[cat1].sort(() => rng() - 0.5).slice(0, 3)
    const set2 = theme.sets[cat2].sort(() => rng() - 0.5).slice(0, 3)

    const items = [...set1.map((i: string) => ({ name: i, Cat: cat1 })), ...set2.map((i: string) => ({ name: i, Cat: cat2 }))]
    items.sort(() => rng() - 0.5)

    return { theme: theme.name, items, categories: [cat1, cat2] }
}

function generateLifecycle(seed: string) {
    const rng = makeRng(seed)
    const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

    const cycles = [
        { name: 'Butterfly', stages: ['Egg 🥚', 'Caterpillar 🐛', 'Pupa 🧱', 'Butterfly 🦋'] },
        { name: 'Frog', stages: ['Egg 🥚', 'Tadpole 🐟', 'Froglet 🐸', 'Adult Frog 🐸'] },
        { name: 'Plant', stages: ['Seed 🌱', 'Sprout 🌿', 'Plant 🌳', 'Flower 🌸'] },
        { name: 'Chicken', stages: ['Egg 🥚', 'Hatchling 🐣', 'Chick 🐥', 'Chicken 🐔'] },
    ]

    const lifecycle = pick(cycles)
    return { name: lifecycle.name, stages: lifecycle.stages } // Stages are already in order
}

// --- Component ---

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

    // Science Lifecycle
    if (doc.startsWith('science-lifecycle')) {
        const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${doc}`)
        const data = generateLifecycle(`${effectiveSeed}|${doc}`)

        return (
            <WorksheetSectionWrapper
                docId={doc}
                title={`${data.name} Lifecycle`}
                emoji="🔄"
                description={`Order the stages of the ${data.name} lifecycle.`}
                problemCount={4}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.stages.sort(() => rng() - 0.5).map((stage, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl border-2 border-dashed border-slate-300">
                            <div className="text-4xl">{stage.split(' ')[1] || '❓'}</div>
                            <div className="font-bold text-center text-lg">{stage.split(' ')[0]}</div>
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-300 font-bold">
                                #
                            </div>
                        </div>
                    ))}
                </div>

                {showAnswersForDoc(doc, () => (
                    <div className="mt-4 p-4 border rounded font-mono text-sm max-w-md mx-auto">
                        <div className="font-bold mb-2">Correct Order:</div>
                        <ol className="list-decimal pl-5 space-y-1">
                            {data.stages.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ol>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        )
    }

    // Science Sorting (Match)
    if (doc.startsWith('science-match')) {
        const data = generateScienceSorting(`${effectiveSeed}|${doc}`)

        return (
            <WorksheetSectionWrapper
                docId={doc}
                title={data.theme}
                emoji="🔬"
                description={`Sort the items into: ${data.categories.join(' vs ')}`}
                problemCount={6}
            >
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between mb-8 px-8">
                        {data.categories.map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="text-xl font-bold text-indigo-600 border-b-2 border-indigo-200 pb-1">{cat}</div>
                                <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    Place Items Here
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-center font-bold mb-4 text-slate-600">Items to Sort:</div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {data.items.map((item, i) => (
                                <div key={i} className="px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg font-medium border border-indigo-100">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showAnswersForDoc(doc, () => (
                    <div className="mt-4 grid grid-cols-2 gap-4 max-w-lg mx-auto">
                        {data.categories.map((cat, i) => (
                            <div key={i} className="p-3 border rounded bg-slate-50">
                                <div className="font-bold border-b mb-2">{cat}</div>
                                {data.items.filter(item => item.Cat === cat).map((item, k) => (
                                    <div key={k} className="text-sm">{item.name}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </WorksheetSectionWrapper>
        )
    }

    return null
}
