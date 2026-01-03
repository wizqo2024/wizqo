import React from 'react'
import type { FC } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './PrintableShared'
import { makeRng } from '@/utils/printableUtils'

export const LinePlots: FC<{ docId: string }> = ({ docId }) => {
    const { t } = useTranslation()
    const rng = makeRng(docId)

    // Generate dynamic data for line plot
    // Generate 8-12 data points between 3 and 8
    const count = rng.int(8, 13)
    const data: number[] = []
    for (let i = 0; i < count; i++) {
        data.push(rng.int(3, 9)) // 3 to 8
    }
    data.sort((a, b) => a - b)

    // Calculate stats for answer key
    const uniqueValues = Array.from(new Set(data)).sort((a, b) => a - b)
    const counts: Record<number, number> = {}
    let maxCount = 0
    let mode: number[] = []

    data.forEach(n => {
        counts[n] = (counts[n] || 0) + 1
        if (counts[n] > maxCount) {
            maxCount = counts[n]
            mode = [n]
        } else if (counts[n] === maxCount) {
            mode.push(n)
        }
    })

    const minVal = data[0]
    const maxVal = data[data.length - 1]
    const range = maxVal - minVal

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Line Plot Explorer"
            emoji="📉"
            description="Create a line plot from the data and analyze it."
            problemCount={1}
            learningObjectives={[
                'Create line plots from data',
                'Identify the mode (most frequent)',
                'Calculate the range (max - min)'
            ]}
            parentTeacherTips={[
                'X marks the spot! Stack Xs for each number.',
                'Mode is the tallest stack of Xs.',
                'Range is the distance from first to last X.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Line Plot Explorer"
                subtitle="Graphing & Analysis"
                icons={{
                    bg1: "📉",
                    bg2: "📊",
                    float1: "📈",
                    float2: "📍"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
                    border: "border-cyan-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-cyan-300",
                    pillText: "text-cyan-800",
                    accent: "text-cyan-300"
                }}
            />

            <StrategySpotlight
                title="Plotting Power"
                icon="📍"
                steps={[
                    { label: "List", text: "Order numbers least to greatest." },
                    { label: "Mark", text: "Put an X above the number line." },
                    { label: "Stack", text: "Stack Xs if numbers repeat." },
                    { label: "Analyze", text: "Find Mode (tallest) & Range." }
                ]}
                color="cyan"
                className="mb-8"
            />

            <div className="border-2 border-slate-200 rounded-xl p-8 bg-white">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Data Set:</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-lg font-mono tracking-wider text-slate-800">
                        {data.join(', ')}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-sm text-blue-800 font-semibold mb-1">Mode (Most Frequent)</div>
                        <div className="h-12 border-b-2 border-blue-200"></div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="text-sm text-purple-800 font-semibold mb-1">Range (Max - Min)</div>
                        <div className="h-12 border-b-2 border-purple-200"></div>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl min-h-[300px] flex items-end justify-center p-8 relative">
                    <div className="absolute top-4 left-4 text-slate-400 text-sm italic">Draw your line plot here...</div>
                    {/* Simple Number Line Visual Guide at bottom */}
                    <div className="w-full h-12 border-t-2 border-slate-800 relative mt-auto">
                        {/* Ticks - simplified for printable range 3-8 */}
                        {[3, 4, 5, 6, 7, 8].map((n, i, arr) => (
                            <div key={n} className="absolute top-0 w-8 -ml-4 flex flex-col items-center" style={{ left: `${(i / (arr.length - 1)) * 100}%` }}>
                                <div className="h-3 w-0.5 bg-slate-800"></div>
                                <div className="mt-1 font-bold text-slate-700">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    )
}

export const BarGraphs: FC<{ docId: string }> = ({ docId }) => {
    const { t } = useTranslation()
    const rng = makeRng(docId)

    // Dynamic Data
    const categories = [
        ['Apples', 'Bananas', 'Oranges', 'Grapes'],
        ['Dogs', 'Cats', 'Birds', 'Fish'],
        ['Red', 'Blue', 'Green', 'Yellow'],
        ['Soccer', 'Basketball', 'Baseball', 'Tennis']
    ]
    const selectedCats = rng.pick(categories)
    const data = selectedCats.map(item => ({
        item,
        count: rng.int(2, 11) // 2 to 10
    }))

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Bar Graphs & Pictographs"
            emoji="📊"
            description="Create a bar graph to visualize the data."
            problemCount={1}
            learningObjectives={[
                'Create bar graphs from frequency tables',
                'Label axes correctly',
                'Interpret data patterns'
            ]}
            parentTeacherTips={[
                'Bars should be the same width.',
                'Spaces between bars should be equal.',
                'Height represents the quantity.'
            ]}
        >
            <PremiumWorksheetBanner
                title="Graphing Guru"
                subtitle="Data Visualization"
                icons={{
                    bg1: "📊",
                    bg2: "📉",
                    float1: "📏",
                    float2: "📝"
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

            <StrategySpotlight
                title="Bar Graph Basics"
                icon="📏"
                steps={[
                    { label: "Title", text: "What is this graph about?" },
                    { label: "Labels", text: "Label the categories (bottom)." },
                    { label: "Scale", text: "Number the side (0, 2, 4...)." },
                    { label: "Bars", text: "Draw bars to matching height." }
                ]}
                color="purple"
                className="mb-8"
            />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Data Table */}
                <div className="w-full md:w-1/3">
                    <table className="w-full border-2 border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="p-3 text-left text-purple-900">Category</th>
                                <th className="p-3 text-right text-purple-900">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-t border-slate-200">
                                    <td className="p-3 font-medium text-slate-700">{row.item}</td>
                                    <td className="p-3 text-right font-mono text-slate-600">{row.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Graphing Grid */}
                <div className="w-full md:w-2/3 border-2 border-slate-300 rounded-lg bg-white p-4 min-h-[400px] relative">
                    <div className="absolute top-2 left-2 text-slate-400 text-xs">Title: __________________________</div>

                    {/* Grid Lines Visual */}
                    <div className="absolute inset-x-12 bottom-12 top-12 border-l-2 border-b-2 border-slate-800">
                        {/* Y-Axis Guidelines (approximate) */}
                        {[10, 8, 6, 4, 2].map((n, i) => (
                            <div key={n} className="absolute w-full border-t border-slate-100 flex items-center" style={{ top: `${(i + 1) * 16.6}%` }}>
                                <span className="absolute -left-8 text-xs text-slate-500 font-mono">{n}</span>
                            </div>
                        ))}
                        <div className="absolute bottom-0 -left-8 text-xs text-slate-500 font-mono">0</div>
                    </div>

                    <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-xs italic">Label Categories Here &rarr;</div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    )
}

export const MeanMedianMode: FC<{ docId: string }> = ({ docId }) => {
    const { t } = useTranslation()
    const rng = makeRng(docId)

    // Generate 3 datasets
    const problems = Array.from({ length: 3 }).map(() => {
        // Generate data with a nice mean (integer or .5)
        // Strategy: pick a mean, pick N numbers, adjust last number to match sum
        const count = rng.pick([5, 7, 9]) // Odd count makes median easy
        const targetMean = rng.int(4, 10)
        const targetSum = targetMean * count
        const nums: number[] = []
        let currentSum = 0

        for (let i = 0; i < count - 1; i++) {
            const n = rng.int(1, 15)
            nums.push(n)
            currentSum += n
        }

        let lastNum = targetSum - currentSum
        if (lastNum < 1 || lastNum > 20) {
            // Fallback if math gets weird: just random numbers
            return { data: [2, 4, 4, 6, 9].sort((a, b) => a - b) }
        }
        nums.push(lastNum)
        nums.sort((a, b) => a - b)

        return { data: nums }
    })

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Mean, Median, Mode"
            emoji="📊"
            description="Calculate the 3 M's for each dataset."
            problemCount={problems.length}
            learningObjectives={[
                'Calculate arithmetic mean',
                'Find the median of ordered data',
                'Identify the mode'
            ]}
            parentTeacherTips={[
                'Mean: Add & Divide.',
                'Median: The one in the Middle.',
                'Mode: The one there the Most.'
            ]}
        >
            <PremiumWorksheetBanner
                title="The 3 M's of Data"
                subtitle="Statistical Analysis"
                icons={{
                    bg1: "📉",
                    bg2: "📊",
                    float1: "🧠",
                    float2: "🔢"
                }}
                colors={{
                    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                    border: "border-emerald-200",
                    pillBg: "bg-white/80",
                    pillBorder: "border-emerald-300",
                    pillText: "text-emerald-800",
                    accent: "text-emerald-300"
                }}
            />

            <StrategySpotlight
                title="Memory Tricks"
                icon="🧠"
                steps={[
                    { label: "Mean", text: "The Average (Add ÷ Count)" },
                    { label: "Median", text: "The Middle (Order first!)" },
                    { label: "Mode", text: "The Most Popular (# that repeats)" },
                    { label: "Range", text: "Big - Small (Distance)" }
                ]}
                color="emerald"
                className="mb-8"
            />

            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 bg-white border-2 border-emerald-100 rounded-xl shadow-sm break-inside-avoid">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm">Set {i + 1}</div>
                            <div className="font-mono text-lg tracking-wider text-slate-700">
                                {p.data.join(', ')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-emerald-200 rounded p-3 bg-emerald-50/50">
                                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Mean</label>
                                <div className="h-8 border-b border-emerald-300"></div>
                            </div>
                            <div className="border border-emerald-200 rounded p-3 bg-emerald-50/50">
                                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Median</label>
                                <div className="h-8 border-b border-emerald-300"></div>
                            </div>
                            <div className="border border-emerald-200 rounded p-3 bg-emerald-50/50">
                                <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Mode</label>
                                <div className="h-8 border-b border-emerald-300"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WorksheetSectionWrapper>
    )
}
