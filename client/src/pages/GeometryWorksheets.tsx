
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

// Shared layout for Geometry worksheets to handle Premium Banner complexity
const GeometryLayout: React.FC<{
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
// 1. Classifying Triangles
// ==========================================

export const ClassifyingTriangles: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)

        return Array.from({ length: 9 }).map((_, i) => {
            const type = getRandomItem(['Equilateral', 'Isosceles', 'Scalene', 'Right', 'Acute', 'Obtuse'], rng)
            return { id: i + 1, type }
        })
    }, [docId])

    const renderTriangle = (type: string) => {
        const color = "stroke-indigo-600 stroke-2 fill-indigo-50"
        switch (type) {
            case 'Equilateral': return <path d="M50 10 L90 80 L10 80 Z" className={color} />
            case 'Isosceles': return <path d="M50 10 L80 80 L20 80 Z" className={color} />
            case 'Scalene': return <path d="M30 10 L90 70 L10 90 Z" className={color} />
            case 'Right': return <g><path d="M20 20 L20 80 L80 80 Z" className={color} /><rect x="20" y="70" width="10" height="10" className="stroke-indigo-600 fill-none" /></g>
            case 'Obtuse': return <g><path d="M20 20 L90 80 L10 80 Z" className={color} /></g>
            case 'Acute': return <path d="M50 15 L85 80 L15 80 Z" className={color} />
            default: return null
        }
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Classifying Triangles"
            description="Identify triangles by their sides (Equilateral, Isosceles, Scalene) and angles (Acute, Right, Obtuse)."
            learningObjectives={["Classify triangles by side length", "Classify triangles by angle measurement", "Identify right angles in triangles"]}
            emoji="🔺"
            problemCount={problems.length}
            parentTeacherTips={["Equilateral: 3 equal sides", "Isosceles: 2 equal sides", "Scalene: No equal sides", "Right: Has a 90° corner", "Obtuse: Has an angle > 90°", "Acute: All angles < 90°"]}
        >
            <GeometryLayout
                title="Triangle Detective"
                subtitle="Analyze the Clues!"
                emoji="🔺"
                color="indigo"
                bannerIcons={{ bg1: "📐", bg2: "✏️", float1: "🔺", float2: "✓" }}
                strategy={{
                    title: "Triangle Types Cheat Sheet",
                    steps: [
                        { label: "By Sides", text: "Equilateral (3 equal), Isosceles (2 equal), Scalene (0 equal)" },
                        { label: "By Angles", text: "Right (Has 90°), Acute (All < 90°), Obtuse (One > 90°)" }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white relative">
                            <div className="absolute top-2 left-3 bg-slate-100 text-slate-500 font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">{prob.id}</div>
                            <div className="h-32 flex items-center justify-center my-2">
                                <svg width="100" height="100" viewBox="0 0 100 100">{renderTriangle(prob.type)}</svg>
                            </div>
                            <div className="text-center text-sm mb-4 text-slate-500 italic">Hint: {prob.type === 'Right' ? 'Has a square corner' : prob.type === 'Equilateral' ? 'All sides match' : prob.type === 'Isosceles' ? 'Two sides same' : ''}</div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Classify by Sides</label>
                                    <div className="flex gap-2 text-[10px]">
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Equilateral</div>
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Isosceles</div>
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Scalene</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Classify by Angles</label>
                                    <div className="flex gap-2 text-[10px]">
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Acute</div>
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Right</div>
                                        <div className="border rounded px-2 py-1 flex-1 text-center text-slate-400">Obtuse</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl break-before-page">
                        <h3 className="font-bold text-indigo-900 mb-4 flex items-center text-xl"><span>✅ Answer Key</span></h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-indigo-100">
                                    <div className="font-bold text-indigo-800 mb-1">Problem {p.id}</div>
                                    <div className="text-sm">Type: <span className="font-semibold">{p.type}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 2. Classifying Quadrilaterals
// ==========================================

export const ClassifyingQuadrilaterals: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        return Array.from({ length: 6 }).map((_, i) => {
            const type = getRandomItem(['Square', 'Rectangle', 'Parallelogram', 'Trapezoid', 'Rhombus'], rng)
            return { id: i + 1, type }
        })
    }, [docId])

    const renderQuad = (type: string) => {
        const color = "stroke-fuchsia-600 stroke-2 fill-fuchsia-50"
        switch (type) {
            case 'Square': return <rect x="25" y="25" width="50" height="50" className={color} />
            case 'Rectangle': return <rect x="15" y="30" width="70" height="40" className={color} />
            case 'Parallelogram': return <path d="M30 30 L80 30 L70 70 L20 70 Z" className={color} />
            case 'Trapezoid': return <path d="M35 30 L65 30 L80 70 L20 70 Z" className={color} />
            case 'Rhombus': return <path d="M50 20 L80 50 L50 80 L20 50 Z" className={color} />
            default: return null
        }
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Classifying Quadrilaterals"
            description="Identify quadrilaterals based on their sides and angles."
            learningObjectives={["Identify properties of squares, rectangles, rhombuses", "Distinguish between parallelograms and trapezoids", "Classify shapes by parallel sides"]}
            emoji="🟦"
            problemCount={problems.length}
            parentTeacherTips={["Square: 4 equal sides, 4 right angles", "Rectangle: 4 right angles, opposite sides equal", "Rhombus: 4 equal sides", "Parallelogram: 2 pairs of parallel sides", "Trapezoid: Only 1 pair of parallel sides"]}
        >
            <GeometryLayout
                title="Shape Sorter"
                subtitle="Name that Quad!"
                emoji="🟦"
                color="fuchsia"
                bannerIcons={{ bg1: "🔷", bg2: "◾", float1: "🟦", float2: "🔶" }}
                strategy={{
                    title: "Quadrilateral Family Tree",
                    steps: [
                        { label: "Parallelogram Family", text: "2 pairs of parallel sides (Square, Rectangle, Rhombus are all Parallelograms!)" },
                        { label: "Trapezoid", text: "Only 1 pair of parallel sides" },
                        { label: "Square vs Rhombus", text: "Square needs right angles. Rhombus just needs equal sides." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white flex items-center gap-6">
                            <div className="w-1/3 flex items-center justify-center">
                                <svg width="100" height="100" viewBox="0 0 100 100">{renderQuad(prob.type)}</svg>
                            </div>
                            <div className="w-2/3 space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Properties Checklist</div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-4 h-4 border rounded"></div><span>4 Sides</span></div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-4 h-4 border rounded"></div><span>Parallel Sides?</span></div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-4 h-4 border rounded"></div><span>Right Angles?</span></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name It:</div>
                                    <div className="h-8 border-b-2 border-slate-300"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl break-before-page">
                        <div className="font-bold text-fuchsia-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-fuchsia-100">
                                    <div className="font-bold text-fuchsia-800 mb-1">Problem {p.id}</div>
                                    <div className="text-sm">Shape: <span className="font-semibold">{p.type}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 3. Lines and Angles
// ==========================================

export const LinesAndAngles: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        return Array.from({ length: 6 }).map((_, i) => {
            const type = getRandomItem(['Parallel', 'Perpendicular', 'Intersecting'], rng)
            return { id: i + 1, type }
        })
    }, [docId])

    const renderLines = (type: string) => {
        const color = "stroke-cyan-600 stroke-2"
        switch (type) {
            case 'Parallel':
                return <g><line x1="20" y1="30" x2="80" y2="30" className={color} markerEnd="url(#arrow)" /><line x1="20" y1="70" x2="80" y2="70" className={color} markerEnd="url(#arrow)" /></g>
            case 'Perpendicular':
                return <g><line x1="20" y1="50" x2="80" y2="50" className={color} /><line x1="50" y1="20" x2="50" y2="80" className={color} /><rect x="50" y="50" width="10" height="-10" className="opacity-0" /><path d="M50,50 L58,50 L58,42 L50,42 Z" className="fill-none stroke-cyan-600 stroke-1" /></g>
            case 'Intersecting':
                return <g><line x1="20" y1="80" x2="80" y2="20" className={color} /><line x1="20" y1="30" x2="80" y2="70" className={color} /></g>
            default: return null
        }
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Lines and Angles"
            description="Identify parallel, perpendicular, and intersecting lines."
            learningObjectives={["Identify parallel lines", "Identify perpendicular lines", "Identify intersecting lines"]}
            emoji="📏"
            problemCount={problems.length}
            parentTeacherTips={["Parallel: Never touch (like train tracks)", "Perpendicular: Meet at 90° (corner)", "Intersecting: Cross at any other angle"]}
        >
            <GeometryLayout
                title="City Planner"
                subtitle="Line Designer"
                emoji="📏"
                color="cyan"
                bannerIcons={{ bg1: "🛤️", bg2: "✖️", float1: "∥", float2: "⊥" }}
                strategy={{
                    title: "Line Relationship Guide",
                    steps: [
                        { label: "Parallel ∥", text: "Never cross. Always same distance apart." },
                        { label: "Perpendicular ⊥", text: "Cross to make square corners (90°)." },
                        { label: "Intersecting ✖", text: "Cross at any point." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white">
                            <div className="h-32 flex items-center justify-center my-2 relative">
                                <div className="absolute top-0 left-0 text-slate-400 font-bold text-xs">{prob.id}</div>
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="fill-cyan-600" /></marker></defs>
                                    {renderLines(prob.type)}
                                </svg>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Parallel</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Perpendicular</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Intersecting</span></div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-xl break-before-page">
                        <div className="font-bold text-cyan-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-cyan-100">
                                    <div className="font-bold text-cyan-800">#{p.id}: {p.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 4. Classifying Angles
// ==========================================

export const ClassifyingAngles: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        return Array.from({ length: 9 }).map((_, i) => {
            const type = getRandomItem(['Acute', 'Right', 'Obtuse', 'Straight'], rng)
            return { id: i + 1, type }
        })
    }, [docId])

    const renderAngle = (type: string) => {
        const color = "stroke-indigo-600 stroke-2"
        switch (type) {
            case 'Acute':
                return <g><line x1="50" y1="80" x2="90" y2="80" className={color} markerEnd="url(#arrowA)" /><line x1="50" y1="80" x2="80" y2="40" className={color} markerEnd="url(#arrowA)" /><path d="M65,80 A15,15 0 0,0 60,65" className="fill-none stroke-indigo-400" /></g>
            case 'Right':
                return <g><line x1="50" y1="80" x2="90" y2="80" className={color} markerEnd="url(#arrowA)" /><line x1="50" y1="80" x2="50" y2="30" className={color} markerEnd="url(#arrowA)" /><path d="M50,70 L60,70 L60,80" className="fill-none stroke-indigo-600" /></g>
            case 'Obtuse':
                return <g><line x1="50" y1="80" x2="90" y2="80" className={color} markerEnd="url(#arrowA)" /><line x1="50" y1="80" x2="20" y2="50" className={color} markerEnd="url(#arrowA)" /><path d="M65,80 A15,15 0 0,0 40,70" className="fill-none stroke-indigo-400" /></g>
            case 'Straight':
                return <g><line x1="10" y1="80" x2="90" y2="80" className={color} markerEnd="url(#arrowA)" markerStart="url(#arrowRev)" /><circle cx="50" cy="80" r="3" className="fill-indigo-600" /></g>
            default: return null
        }
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Classifying Angles"
            description="Identify angle types: Acute, Right, Obtuse, Straight."
            learningObjectives={["Measure angles visually", "Classify angles by degrees", "Identify straight angles"]}
            emoji="📐"
            problemCount={problems.length}
            parentTeacherTips={["Acute: Cute small angle (<90°)", "Right: Corner (90°)", "Obtuse: Wide open (>90°)", "Straight: Flat line (180°)"]}
        >
            <GeometryLayout
                title="Angle Architect"
                subtitle="Measure the Turn"
                emoji="📐"
                color="indigo"
                bannerIcons={{ bg1: "🏗️", bg2: "📐", float1: "∠", float2: "°" }}
                strategy={{
                    title: "Angle Types",
                    steps: [
                        { label: "Acute", text: "Less than 90°. Small and sharp." },
                        { label: "Right", text: "Exactly 90°. Like a book corner." },
                        { label: "Obtuse", text: "More than 90°. Wide open." },
                        { label: "Straight", text: "Exactly 180°. A straight line." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white">
                            <div className="h-32 flex items-center justify-center my-2 relative">
                                <div className="absolute top-0 left-0 text-slate-400 font-bold text-xs">{prob.id}</div>
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <defs>
                                        <marker id="arrowA" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="fill-indigo-600" /></marker>
                                        <marker id="arrowRev" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto"><path d="M9,0 L9,6 L0,3 z" className="fill-indigo-600" /></marker>
                                    </defs>
                                    {renderAngle(prob.type)}
                                </svg>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Acute</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Right</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Obtuse</span></div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border rounded"></div><span className="text-sm text-slate-600">Straight</span></div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl break-before-page">
                        <div className="font-bold text-indigo-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-indigo-100">
                                    <div className="font-bold text-indigo-800">#{p.id}: {p.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 5. Symmetry & Transformations
// ==========================================

export const SymmetryTransformations: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        return Array.from({ length: 6 }).map((_, i) => {
            const type = getRandomItem(['Line Symmetry', 'Reflection', 'Translation', 'Rotation'], rng)
            return { id: i + 1, type }
        })
    }, [docId])

    const renderTransformation = (type: string) => {
        const color = "stroke-fuchsia-600 stroke-2 fill-fuchsia-50 opacity-80"
        const phantom = "stroke-slate-300 stroke-2 fill-none stroke-dashed"

        switch (type) {
            case 'Line Symmetry':
                return <g><path d="M50 20 L80 50 L50 80 L20 50 Z" className={color} /><line x1="50" y1="10" x2="50" y2="90" className="stroke-indigo-600 stroke-2 stroke-dasharray-4" /></g>
            case 'Reflection': // Flip over line
                return <g>
                    <path d="M30 30 L40 30 L30 50 Z" className={phantom} />
                    <line x1="50" y1="20" x2="50" y2="80" className="stroke-slate-400 stroke-1" />
                    <path d="M70 30 L60 30 L70 50 Z" className={color} />
                    <path d="M40 35 L60 35" className="stroke-slate-300 stroke-1 marker-end-arrow" markerEnd="url(#arrowT)" />
                </g>
            case 'Translation': // Slide
                return <g>
                    <rect x="20" y="30" width="20" height="20" className={phantom} />
                    <rect x="60" y="50" width="20" height="20" className={color} />
                    <line x1="40" y1="40" x2="60" y2="50" className="stroke-indigo-400 stroke-2" markerEnd="url(#arrowT)" />
                </g>
            case 'Rotation': // Turn
                return <g>
                    <rect x="40" y="20" width="20" height="40" className={phantom} />
                    <rect x="40" y="20" width="40" height="20" className={color} transform="rotate(90 50 40)" />
                    <path d="M65 30 A 15 15 0 0 1 70 50" className="stroke-indigo-400 stroke-2 fill-none" markerEnd="url(#arrowT)" />
                </g>
            default: return null
        }
    }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Symmetry & Transformations"
            description="Identify lines of symmetry and transformations (flips, slides, turns)."
            learningObjectives={["Identify line symmetry", "Recognize reflections (flips)", "Recognize translations (slides)", "Recognize rotations (turns)"]}
            emoji="🦋"
            problemCount={problems.length}
            parentTeacherTips={["Symmetry: Can you fold it in half?", "Reflection: Mirror image (Flip)", "Translation: Moving without turning (Slide)", "Rotation: Spinning around a point (Turn)"]}
        >
            <GeometryLayout
                title="Magic Mirrors"
                subtitle="Shape Shifters"
                emoji="🦋"
                color="fuchsia"
                bannerIcons={{ bg1: "❄️", bg2: "🎡", float1: "🦋", float2: "🔄" }}
                strategy={{
                    title: "Transformation Terms",
                    steps: [
                        { label: "Symmetry", text: "Both sides match perfectly (Mirror Line)" },
                        { label: "Reflection", text: "FLIP over a line." },
                        { label: "Translation", text: "SLIDE to a new spot." },
                        { label: "Rotation", text: "TURN around a point." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-4 break-inside-avoid bg-white">
                            <div className="h-32 flex items-center justify-center my-2 relative">
                                <div className="absolute top-0 left-0 text-slate-400 font-bold text-xs">{prob.id}</div>
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <defs><marker id="arrowT" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" className="fill-indigo-400" /></marker></defs>
                                    {renderTransformation(prob.type)}
                                </svg>
                            </div>
                            <div className="space-y-4 text-center">
                                <div className="text-sm font-bold text-slate-600 border rounded py-1 px-2 bg-slate-50">{prob.type === 'Line Symmetry' ? 'Line Symmetry' : 'Transformation'}</div>
                                <div className="text-xs text-slate-400 italic">
                                    {prob.type === 'Line Symmetry' ? 'Fold perfectly?' :
                                        prob.type === 'Reflection' ? 'Flip?' :
                                            prob.type === 'Translation' ? 'Slide?' : 'Turn?'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl break-before-page">
                        <div className="font-bold text-fuchsia-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-fuchsia-100">
                                    <div className="font-bold text-fuchsia-800">#{p.id}: {p.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}

// ==========================================
// 6. Area and Perimeter
// ==========================================

export const AreaPerimeter: React.FC<{
    docId: string
    showAnswersForDoc: ShowAnswersFn
}> = ({ docId, showAnswersForDoc }) => {
    const problems = React.useMemo(() => {
        const seed = docId
        const rng = makeRng(seed)
        return Array.from({ length: 6 }).map((_, i) => {
            const isArea = i % 2 === 0
            const width = rng.int(2, 6)
            const height = rng.int(2, 6)
            const answer = isArea ? width * height : 2 * (width + height)
            return { id: i + 1, width, height, isArea, answer }
        })
    }, [docId])

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Area and Perimeter"
            description="Calculate area (squares inside) and perimeter (distance around)."
            learningObjectives={["Calculate Area of rectangles", "Calculate Perimeter of rectangles", "Differentiate Area vs Perimeter"]}
            emoji="📏"
            problemCount={problems.length}
            parentTeacherTips={["Area: Count the squares INSIDE", "Perimeter: Count the steps OUTSIDE", "Formula: Area = L×W, Perimeter = L+L+W+W"]}
        >
            <GeometryLayout
                title="Space Surveyor"
                subtitle="Measure the Land"
                emoji="📏"
                color="emerald"
                bannerIcons={{ bg1: "🗺️", bg2: "🚧", float1: "Total", float2: "Edge" }}
                strategy={{
                    title: "Area vs Perimeter",
                    steps: [
                        { label: "Perimeter (Fence)", text: "Distance AROUND the outside. Add all sides." },
                        { label: "Area (Grass)", text: "Space INSIDE. Count the squares or Multiply L x W." }
                    ]
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((prob) => (
                        <div key={prob.id} className="border-2 border-slate-200 rounded-xl p-6 break-inside-avoid bg-white flex items-center gap-6">
                            <div className="w-1/2 flex items-center justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <pattern id={`grid-${prob.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" opacity="0.2" />
                                    </pattern>
                                    <rect width="120" height="120" fill={`url(#grid-${prob.id})`} />

                                    {/* Centered Rectangle */}
                                    <g transform={`translate(${60 - (prob.width * 10)}, ${60 - (prob.height * 10)})`}>
                                        <rect width={prob.width * 20} height={prob.height * 20} className={prob.isArea ? "fill-emerald-200 stroke-emerald-600 stroke-2" : "fill-none stroke-rose-500 stroke-4"} />
                                        {/* Grid lines inside */}
                                        {prob.isArea && <rect width={prob.width * 20} height={prob.height * 20} fill={`url(#grid-${prob.id})`} stroke="none" />}
                                    </g>
                                </svg>
                            </div>
                            <div className="w-1/2 space-y-2">
                                <div className="font-bold text-lg text-slate-700">Find the <span className={prob.isArea ? "text-emerald-600" : "text-rose-500"}>{prob.isArea ? "AREA" : "PERIMETER"}</span></div>
                                <div className="text-sm text-slate-500">Width: {prob.width} units</div>
                                <div className="text-sm text-slate-500">Height: {prob.height} units</div>
                                <div className="mt-4 border-b-2 border-slate-300 w-full h-8"></div>
                                <div className="text-xs text-slate-400 text-right">{prob.isArea ? "square units" : "units"}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {showAnswersForDoc(docId, () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl break-before-page">
                        <div className="font-bold text-emerald-900 mb-4 text-xl">✅ Answer Key</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {problems.map((p) => (
                                <div key={p.id} className="bg-white p-3 rounded border border-emerald-100">
                                    <div className="font-bold text-emerald-800">#{p.id}: {p.isArea ? "Area" : "Perimeter"}</div>
                                    <div className="text-lg font-mono">{p.answer} {p.isArea ? "sq units" : "units"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </GeometryLayout>
        </WorksheetSectionWrapper>
    )
}
