import React, { ReactNode } from 'react'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared'
import { makeRng } from '@/utils/printableUtils'
import { useTranslation } from '@/context/TranslationContext'

// --- Data Definitions ---

interface OnePagerData {
    title: string
    emoji: string
    description: string
    time?: string
    materials: string[]
    steps: { text: string; icon?: string }[]
    science?: { title: string; text: string; icon: string } // "What's Happening?" or similar
    challenge?: string
    icons: { bg1: string; bg2: string; float1: string; float2: string }
    colors: {
        bg: string
        border: string
        pillBg: string
        pillBorder: string
        pillText: string
        accent: string
    }
}

const ONE_PAGERS: Record<string, OnePagerData> = {
    'stem-balloon-rocket': {
        title: "Balloon Rocket",
        emoji: "🚀",
        description: "Build a rocket powered by air! Learn about action and reaction.",
        time: "10-15 Minutes",
        materials: [
            "Balloon 🎈",
            "String (about 6 feet) 🧶",
            "Drinking straw 🥤",
            "Tape 📼",
            "Two chairs 🪑"
        ],
        steps: [
            { text: "Tie one end of the string to a chair.", icon: "🪑" },
            { text: "Thread the straw onto the string.", icon: "🥤" },
            { text: "Tie the other end of the string to another chair. Make it tight!", icon: "📏" },
            { text: "Blow up the balloon but don't tie it. Hold the end closed.", icon: "🎈" },
            { text: "Tape the balloon to the straw.", icon: "📼" },
            { text: "Let go! Watch your rocket fly!", icon: "🚀" }
        ],
        science: {
            title: "What's Happening?",
            text: "Newton's Third Law: For every action, there is an equal and opposite reaction. As the air shoots out the back (Action), it pushes the balloon forward (Reaction)!",
            icon: "🔬"
        },
        challenge: "Try blowing the balloon up halfway vs. all the way. Which goes faster?",
        icons: { bg1: "🚀", bg2: "💨", float1: "🎈", float2: "🌟" },
        colors: {
            bg: "bg-gradient-to-br from-blue-50 to-red-50",
            border: "border-blue-200",
            pillBg: "bg-white/90",
            pillBorder: "border-blue-300",
            pillText: "text-blue-900",
            accent: "text-red-500"
        }
    },
    'stem-walking-water': {
        title: "Walking Water",
        emoji: "🌈",
        description: "Watch colored water 'walk' between cups and mix new colors!",
        time: "15-30 Minutes",
        materials: [
            "3 Clear cups 🥃",
            "Water 💧",
            "Food coloring (Red, Yellow, Blue) 🎨",
            "Paper towels 🧻"
        ],
        steps: [
            { text: "Line up 3 cups. Fill the 1st and 3rd with water.", icon: "🥃" },
            { text: "Add Red drops to the 1st cup. Add Yellow to the 3rd.", icon: "🔴" },
            { text: "Leave the middle cup empty.", icon: "⭕" },
            { text: "Fold paper towels into strips. Connect the cups like bridges.", icon: "🌉" },
            { text: "Wait and watch the water climb!", icon: "👀" }
        ],
        science: {
            title: "The Science of Capillary Action",
            text: "Water is 'sticky'! It sticks to the fibers in the paper towel and pulls itself up. Plants use this same trick to pull water from their roots all the way to their leaves.",
            icon: "🌿"
        },
        challenge: "What new color appears in the middle cup?",
        icons: { bg1: "🌈", bg2: "💧", float1: "🎨", float2: "🥃" },
        colors: {
            bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
            border: "border-indigo-200",
            pillBg: "bg-white/90",
            pillBorder: "border-indigo-300",
            pillText: "text-indigo-900",
            accent: "text-purple-500"
        }
    },
    'arts-3-shape-creature': {
        title: "3-Shape Creature Challenge",
        emoji: "🎨",
        description: "Use your imagination to turn simple shapes into a unique monster or animal.",
        time: "10-20 Minutes",
        materials: [
            "Pencil ✏️",
            "Crayons or Markers 🖍️",
            "Imagination! ✨"
        ],
        steps: [
            { text: "Start with a Circle 🔴 for the body or head.", icon: "🔴" },
            { text: "Add a Triangle 🔺 somewhere (ears, nose, or tail?)", icon: "🔺" },
            { text: "Add a Square 🟦 (feet, teeth, or hat?)", icon: "🟦" },
            { text: "Draw the rest! Give it fur, scales, or wings.", icon: "✏️" },
            { text: "Color it in and give it a funny name.", icon: "🖍️" }
        ],
        science: {
            title: "Artist's Corner",
            text: "Artists use basic shapes to build complex drawings. Look around—your house is a square, wheels are circles, and pizza slices are triangles!",
            icon: "🖌️"
        },
        challenge: "Write a 1-sentence story about where your creature lives.",
        icons: { bg1: "🎨", bg2: "✏️", float1: "🖍️", float2: "🌀" },
        colors: {
            bg: "bg-gradient-to-br from-orange-50 to-yellow-50",
            border: "border-orange-200",
            pillBg: "bg-white/90",
            pillBorder: "border-orange-300",
            pillText: "text-orange-900",
            accent: "text-orange-500"
        }
    }
}

export function OnePagerWorksheet({
    docId,
    effectiveSeed,
    variant,
    showAnswersForDoc
}: {
    docId: string
    effectiveSeed: string
    variant: string
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
}) {
    const { t } = useTranslation()
    const data = ONE_PAGERS[docId]

    if (!data) return null

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={data.title}
            emoji={data.emoji}
            description={data.description}
            problemCount={data.steps.length}
            learningObjectives={[
                'Follow multi-step directions',
                data.docId?.includes('stem') ? 'Observe simple scientific phenomena' : 'Use creativity to transform basic shapes',
                'Develop fine motor skills through hands-on activity'
            ]}
            parentTeacherTips={[
                'Read the materials list first and act like a "Supply Manager" to gather them.',
                'Encourage the child to predict what will happen before doing the step.',
                'Ask "Why?" questions to spark curiosity.'
            ]}
        >
            <PremiumWorksheetBanner
                title={data.title}
                subtitle={data.time ? `${data.time} Activity` : "Fun Activity"}
                icons={data.icons}
                colors={data.colors}
            />

            <div className="grid md:grid-cols-3 gap-8 mt-8 mb-8 break-inside-avoid">
                {/* Left Col: Materials */}
                <div className={`p-6 rounded-2xl border-2 ${data.colors.border} bg-white h-full`}>
                    <div className={`font-bold text-center uppercase tracking-widest text-sm mb-4 ${data.colors.accent}`}>
                        🛠️ Checklist
                    </div>
                    <ul className="space-y-3">
                        {data.materials.map((mat, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                                <div className={`w-5 h-5 rounded border-2 ${data.colors.pillBorder} flex-shrink-0 mt-0.5`} />
                                <span>{mat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Col: Steps */}
                <div className="md:col-span-2 space-y-4">
                    {data.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm items-center">
                            <div className={`w-10 h-10 rounded-full ${data.colors.bg} border-2 ${data.colors.border} flex items-center justify-center font-bold text-lg text-slate-700 flex-shrink-0`}>
                                {i + 1}
                            </div>
                            <div className="flex-1 font-medium text-slate-800">
                                {step.text}
                            </div>
                            {step.icon && <div className="text-2xl">{step.icon}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Science/Art Note */}
            {data.science && (
                <StrategySpotlight
                    title={data.science.title}
                    description={data.science.text}
                    icon={data.science.icon}
                    color={data.docId?.includes('arts') ? 'orange' : 'blue'}
                />
            )}

            {/* Canvas for Art (Only if Art) */}
            {docId.includes('arts') && (
                <div className="mt-8 mb-8 p-4 border-4 border-dashed border-slate-200 rounded-3xl bg-white min-h-[400px] flex items-center justify-center relative">
                    <div className="absolute top-4 left-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
                        Draw Here
                    </div>
                    <div className="opacity-10 text-9xl">🎨</div>
                </div>
            )}

            {/* Observation Notes (For STEM) */}
            {docId.includes('stem') && (
                <div className="mt-8 mb-8 p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-sm print:border">
                    <div className="font-bold text-slate-700 mb-2">My Observations:</div>
                    <div className="space-y-8">
                        <div className="border-b border-slate-200 h-8"></div>
                        <div className="border-b border-slate-200 h-8"></div>
                        <div className="border-b border-slate-200 h-8"></div>
                    </div>
                </div>
            )}

        </WorksheetSectionWrapper>
    )
}
