/** @jsxImportSource react */
import React from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared'
import { makeRng } from '@/utils/printableUtils'

interface SpecificWorksheetProps {
    docId: string
    showAnswersForDoc: (docId: string, factory: () => React.ReactNode) => React.ReactNode
    seed: string
    variant: number
}

export function PreWritingTracingWorksheet({ docId, seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const rng = makeRng(`${seed}-${docId}-${variant}`)

    const getPattern = (type: string, y: number) => {
        const width = 600
        const segmentWidth = 60
        let path = `M 20 ${y} `

        if (type === 'zigzag-lines') {
            for (let x = 20 + segmentWidth; x <= width; x += segmentWidth) {
                const up = (x / segmentWidth) % 2 === 0
                path += `L ${x} ${up ? y : y - 40} `
            }
        } else if (type === 'curve-tracing') {
            for (let x = 20; x <= width - segmentWidth; x += segmentWidth) {
                path += `C ${x + segmentWidth / 4} ${y - 50}, ${x + 3 * segmentWidth / 4} ${y - 50}, ${x + segmentWidth} ${y} `
            }
        } else if (type === 'path-tracing') {
            // Mixed path
            for (let x = 20 + segmentWidth; x <= width; x += segmentWidth) {
                const step = (x / segmentWidth) % 3
                if (step === 1) path += `L ${x} ${y - 40} `
                else if (step === 2) path += `C ${x - segmentWidth / 2} ${y - 60}, ${x} ${y - 60}, ${x} ${y} `
                else path += `L ${x} ${y} `
            }
        } else {
            // default line-tracing
            path += `L ${width} ${y}`
        }
        return path
    }

    const rows = [1, 2, 3, 4, 5, 6]

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={t(`worksheets.${docId}.title`) || resolveTitle(docId)}
            emoji="✏️"
            description={t(`worksheets.${docId}.description`) || "Trace the lines carefully. Start at the red dot and follow the path."}
            problemCount={rows.length}
        >
            <PremiumWorksheetBanner
                title={resolveTitle(docId)}
                subtitle="Pre-Writing Skills"
                icons={{ bg1: "✏️", bg2: "🖍️", float1: "🎨", float2: "🌟" }}
                colors={{
                    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
                    border: "border-blue-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-blue-300",
                    pillText: "text-blue-900",
                    accent: "text-blue-400"
                }}
            />

            <div className="mt-8 space-y-12 bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm">
                {rows.map((row, index) => {
                    // Logic Pairs for "Purposeful Tracing"
                    const pairs = [
                        { start: '🐝', end: '🌸' }, // Bee -> Flower
                        { start: '🚗', end: '🏠' }, // Car -> House
                        { start: '🚀', end: '🪐' }, // Rocket -> Planet
                        { start: '🐰', end: '🥕' }, // Bunny -> Carrot
                        { start: '🐶', end: '🦴' }, // Dog -> Bone
                        { start: '😺', end: '🧶' }, // Cat -> Yarn
                    ]
                    const pair = pairs[index % pairs.length]

                    return (
                        <div key={row} className="relative h-24 w-full break-inside-avoid">
                            <svg viewBox="0 0 620 100" className="w-full h-full overflow-visible">
                                {/* Guidelines */}
                                <line x1="10" y1="80" x2="610" y2="80" stroke="#e2e8f0" strokeWidth="1" />
                                <line x1="10" y1="20" x2="610" y2="20" stroke="#e2e8f0" strokeWidth="1" />

                                {/* Tracing Path */}
                                <path
                                    d={getPattern(docId, 80)}
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="4"
                                    strokeDasharray="8 8"
                                    strokeLinecap="round"
                                />

                                {/* Start Icon (Logic) */}
                                <text x="0" y="85" fontSize="32">{pair.start}</text>

                                {/* End Icon (Logic) */}
                                <text x="580" y="85" fontSize="32">{pair.end}</text>
                            </svg>
                        </div>
                    )
                })}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 border border-emerald-200 rounded-lg bg-emerald-50 text-sm text-emerald-800 break-inside-avoid">
                    <strong>Teaching Tip:</strong>
                    <p className="mt-1">Encourage the student to keep their pencil on the paper from start to finish. Focus on steady movement rather than speed.</p>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

function resolveTitle(docId: string) {
    switch (docId) {
        case 'zigzag-lines': return 'Zigzag Tracing Practice'
        case 'curve-tracing': return 'Curvy Lines Tracing'
        case 'path-tracing': return 'Complex Path Tracing'
        case 'line-tracing': return 'Straight Line Tracing'
        default: return 'Tracing Practice'
    }
}
