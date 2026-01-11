import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function CursivePracticeWorksheet() {
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Sentence sets
    const SENTENCE_SETS = [
        [
            "Knowledge is power.",
            "Practice makes us better.",
            "Kindness is free to give.",
            "I believe in myself.",
            "Today is a good day."
        ],
        [
            "The quick brown fox jumps.",
            "Cursive writing is an art.",
            "Hard work brings success.",
            "Listen to learn more.",
            "Be the change you seek."
        ]
    ];

    const [currentSetIndex, setCurrentSetIndex] = React.useState(0);
    const sentences = SENTENCE_SETS[currentSetIndex];

    // Layout Constants
    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    const toggleSet = () => {
        setCurrentSetIndex((prev: number) => (prev + 1) % SENTENCE_SETS.length);
    };

    const renderContent = () => (
        <>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="#ffffff" />
            <rect x="0" y="0" width="10" height={pageHeight} fill="#ef4444" opacity="0.1" />
            <text x={margin} y={50} fontSize="14" fontFamily="serif" fill="#94a3b8">Name: ______________________</text>
            <text x={pageWidth - margin - 150} y={50} fontSize="14" fontFamily="serif" fill="#94a3b8">Date: ____________</text>

            {sentences.map((text, i) => {
                const y = 140 + i * 85;
                return (
                    <g key={i}>
                        <line x1={margin} y1={y - 20} x2={pageWidth - margin} y2={y - 20} stroke="#94a3b8" strokeWidth="1" />
                        <line x1={margin} y1={y} x2={pageWidth - margin} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1={margin} y1={y + 20} x2={pageWidth - margin} y2={y + 20} stroke="#94a3b8" strokeWidth="1" />
                        <text
                            x={margin + 10}
                            y={y + 5}
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="48"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {text}
                        </text>
                        <circle cx={margin + 5} cy={y + 5} r="2" fill="#3b82f6" opacity="0.5" />
                    </g>
                )
            })}
        </>
    );

    return (
        <div className="w-full flex flex-col items-center">
            <div className="mb-6">
                <Button
                    onClick={toggleSet}
                    variant="outline"
                    className="h-10 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Swap Sentences
                </Button>
            </div>
            <div className="w-full bg-white shadow-xl rounded-sm overflow-hidden border border-slate-200">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                    className="w-full h-auto bg-white"
                >
                    {renderContent()}
                </svg>
            </div>
        </div>
    );
}
