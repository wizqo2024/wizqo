/** @jsxImportSource react */
import React from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared'
import { makeRng, shuffleArray, pick } from '@/utils/printableUtils'

interface SpecificWorksheetProps {
    docId: string;
    seed: string;
    variant: string;
    showAnswersForDoc: (id: string, factory: () => React.ReactNode) => React.ReactNode;
}

export function GrammarDetective({ docId, seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const rng = makeRng(`${seed}-${docId}-${variant}`)

    const sentences = [
        { text: "The brave detective found a clue.", nouns: ["detective", "clue"], verbs: ["found"], adjectives: ["brave"] },
        { text: "A bright sun shines in the blue sky.", nouns: ["sun", "sky"], verbs: ["shines"], adjectives: ["bright", "blue"] },
        { text: "The hungry cat chased a small mouse.", nouns: ["cat", "mouse"], verbs: ["chased"], adjectives: ["hungry", "small"] },
        { text: "Quiet students read interesting books.", nouns: ["students", "books"], verbs: ["read"], adjectives: ["quiet", "interesting"] },
        { text: "Fast cars drive on the long road.", nouns: ["cars", "road"], verbs: ["drive"], adjectives: ["fast", "long"] },
        { text: "The green frog jumps into the cold water.", nouns: ["frog", "water"], verbs: ["jumps"], adjectives: ["green", "cold"] },
        { text: "Happy children play with colorful toys.", nouns: ["children", "toys"], verbs: ["play"], adjectives: ["happy", "colorful"] },
        { text: "A loud thunder scared the little puppy.", nouns: ["thunder", "puppy"], verbs: ["scared"], adjectives: ["loud", "little"] },
        { text: "The old man walked slowly on the wooden bridge.", nouns: ["man", "bridge"], verbs: ["walked"], adjectives: ["old", "wooden"] },
        { text: "Sharp needles help the skilled tailor.", nouns: ["needles", "tailor"], verbs: ["help"], adjectives: ["sharp", "skilled"] }
    ]

    const selectedSentences = shuffleArray([...sentences], rng).slice(0, 5)

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Grammar Detective"
            emoji="🕵️‍♀️"
            description="Identify parts of speech in each sentence. Use the color code to highlight words."
        >
            <PremiumWorksheetBanner
                title="Grammar Detective"
                subtitle="Parts of Speech Investigation"
                icons={{
                    bg1: "🔎",
                    bg2: "📝",
                    float1: "🕵️",
                    float2: "🔤"
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

            <div className="mt-6 space-y-8">
                {/* Color Code Legend */}
                <div className="flex justify-center gap-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 border-dashed">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-200 border-2 border-blue-400"></div>
                        <span className="font-bold text-slate-700">Noun</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-200 border-2 border-emerald-400"></div>
                        <span className="font-bold text-slate-700">Verb</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-200 border-2 border-amber-400"></div>
                        <span className="font-bold text-slate-700">Adjective</span>
                    </div>
                </div>

                {/* Sentences */}
                <div className="space-y-6">
                    {selectedSentences.map((s, idx) => (
                        <div key={idx} className="p-6 border-2 border-slate-100 rounded-2xl bg-white hover:border-purple-100 transition-colors break-inside-avoid shadow-sm">
                            <div className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-xl font-medium text-slate-800 leading-relaxed mb-4">
                                        {s.text}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-4 border-b-2 border-blue-200"></div>
                                        <div className="h-4 border-b-2 border-emerald-200"></div>
                                        <div className="h-4 border-b-2 border-amber-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl print:border-black print:bg-white break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-bold text-emerald-900 underline">Investigation Case Files (Answers)</h3>
                    </div>
                    <div className="space-y-4 text-sm">
                        {selectedSentences.map((s, idx) => (
                            <div key={idx} className="border-l-4 border-emerald-200 pl-4 py-1">
                                <p className="font-bold text-slate-700 mb-1">{idx + 1}. {s.text}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <span className="text-blue-700"><strong>Nouns:</strong> {s.nouns.join(", ")}</span>
                                    <span className="text-emerald-700"><strong>Verbs:</strong> {s.verbs.join(", ")}</span>
                                    <span className="text-amber-700"><strong>Adjectives:</strong> {s.adjectives.join(", ")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
