import React from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper } from './PrintableShared'
import { makeRng, shuffleArray } from '@/utils/printableUtils'

interface SpecificWorksheetProps {
    docId?: string
    activeDocs?: string[]
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode
    seed: string
    variant: number
}

// ==========================================
// Mass & Weight (Lbs to Oz)
// ==========================================
export function MassWeightConversion({ showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const { t } = useTranslation()
    const docId = 'mass-weight'
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`)

    // Generate unique problems
    // Range 1 to 10 lbs is common for elementary. Let's go up to 12.
    // We need 6 unique problems.
    const allPounds = Array.from({ length: 12 }, (_, i) => i + 1)
    const shuffled = shuffleArray(allPounds, rng)
    const problems = shuffled.slice(0, 6).map(pounds => ({
        pounds,
        ounces: pounds * 16
    })).sort((a, b) => a.pounds - b.pounds) // Sort for tidiness or keep shuffled? Random is better for worksheet.
    // Actually, sorting might make it look too patterned. Let's keep shuffled slice.
    // Re-shuffle the slice? No, the slice is already random order. 
    // Wait, let's sort them just so it looks organized? No, random is good.

    const renderScale = () => (
        <svg viewBox="0 0 100 80" className="w-16 h-12 mx-auto mb-2 opacity-80">
            {/* Base */}
            <path d="M20,70 L80,70 L70,50 L30,50 Z" fill="#475569" />
            {/* Pillar */}
            <rect x="48" y="20" width="4" height="30" fill="#475569" />
            {/* Beam */}
            <rect x="10" y="20" width="80" height="4" fill="#64748b" rx="2" />
            {/* Pans */}
            <path d="M10,24 L10,40 Q10,45 20,45 Q30,45 30,40 L30,24" fill="none" stroke="#94a3b8" />
            <path d="M70,24 L70,40 Q70,45 80,45 Q90,45 90,40 L90,24" fill="none" stroke="#94a3b8" />
        </svg>
    )

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Mad Science: Ingredient Weighing"
            emoji={String.fromCharCode(0x2696, 0xFE0F)}
            description="Balance the scales! Convert the weight of rare crystals and moon rocks."
            problemCount={problems.length}
            learningObjectives={[
                'Convert between ounces and pounds',
                'Understand weight measurement relationships',
                'Use multiplication and division for conversions'
            ]}
            parentTeacherTips={[
                '1 pound = 16 ounces',
                'Heavy Ingredients: Use Pounds',
                'Light Ingredients: Use Ounces',
                '16 "Moon Pebbles" (oz) = 1 "Moon Rock" (lb)'
            ]}
        >
            {/* Scale Header */}
            <div className="print:hidden w-full h-16 mb-4 relative overflow-hidden bg-slate-100 rounded-lg flex items-center justify-center border-b-4 border-orange-400">
                <div className="text-2xl font-mono text-orange-600 font-bold z-10 flex gap-2">
                    RARE MATERIALS LOG
                </div>
            </div>

            {/* Worked Example */}
            <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg print:border print:bg-white flex items-center gap-4">
                <div className="text-4xl shadow-sm rounded-full bg-white p-2">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-1 text-sm text-orange-900 font-mono">
                    <div className="font-bold text-base">MATERIAL: Dragon Scale</div>
                    <div>Weight: 2 Pounds</div>
                    <div>{String.fromCodePoint(0x279C)}<strong>32 Ounces</strong></div>
                </div>
            </div>

            <div className="mb-4 text-center font-mono text-xs text-slate-500">
                STANDARDS: 1 LB = 16 OZ
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                {problems.map((p, i) => (
                    <div key={i} className="border border-slate-300 rounded-lg p-4 bg-white break-inside-avoid relative">
                        {renderScale()}
                        <div className="text-center font-bold font-mono text-slate-800">
                            {p.pounds} LBS = ____ OZ
                        </div>
                        <div className="mt-2 flex justify-center gap-1">
                            {/* Visual weights */}
                            <div className="w-8 h-6 bg-slate-800 rounded-sm"></div>
                            <div className="text-xl">{String.fromCodePoint(0x279C)}</div>
                            <div className="w-8 h-6 border-2 border-slate-300 rounded-sm bg-slate-50"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Self-Assessment */}
            <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                <div className="space-y-2 text-xs">
                    <div>{String.fromCodePoint(0x270F)}</div>
                    <div>{String.fromCodePoint(0x270F)}</div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-4 border-2 border-orange-300 bg-orange-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-orange-900 mb-3 text-base">{String.fromCodePoint(0x270F)}</div>
                    <div className="space-y-2 font-mono text-sm">
                        {problems.map((p, i) => (
                            <div key={i} className="border-b border-orange-200 pb-1">
                                {p.pounds} lbs = <strong>{p.ounces} oz</strong>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}
