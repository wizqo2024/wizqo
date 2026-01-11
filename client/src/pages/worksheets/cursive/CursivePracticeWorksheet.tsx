import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import jsPDF from 'jspdf';


export default function CursivePracticeWorksheet({ isPrintView = false }: { isPrintView?: boolean }) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Check for preview mode - check immediately for better iframe rendering
    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

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

    const handleDownloadPDF = async () => {
        try {
            if (!svgRef.current) return;
            const { drawSvgRefOnPDF } = await import('@/utils/pdfHelpers');
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            await drawSvgRefOnPDF(doc, svgRef.current, 0, 0, 297, 210);
            doc.save(`cursive-practice-set-${currentSetIndex + 1}.pdf`);
            toast({ title: "Downloaded!", description: "Happy practicing." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "PDF failed.", variant: "destructive" });
        }
    };

    const toggleSet = () => {
        setCurrentSetIndex((prev: number) => (prev + 1) % SENTENCE_SETS.length);
    };

    const renderContent = () => (
        <>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="#ffffff" />

            {/* Header */}
            <rect x="0" y="0" width="10" height={pageHeight} fill="#ef4444" opacity="0.1" /> {/* Margin Line */}
            <text x={margin} y={50} fontSize="14" fontFamily="serif" fill="#94a3b8">Name: ______________________</text>
            <text x={pageWidth - margin - 150} y={50} fontSize="14" fontFamily="serif" fill="#94a3b8">Date: ____________</text>

            {/* Sentences */}
            {sentences.map((text, i) => {
                const y = 140 + i * 85;
                return (
                    <g key={i}>
                        {/* Guide Lines */}
                        <line x1={margin} y1={y - 20} x2={pageWidth - margin} y2={y - 20} stroke="#94a3b8" strokeWidth="1" /> {/* Top */}
                        <line x1={margin} y1={y} x2={pageWidth - margin} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" /> {/* Middle */}
                        <line x1={margin} y1={y + 20} x2={pageWidth - margin} y2={y + 20} stroke="#94a3b8" strokeWidth="1" /> {/* Base */}

                        {/* Traceable Text - Light Gray */}
                        <text
                            x={margin + 10}
                            y={y + 5} // Nudge for cursive baseline visual alignment
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="48"
                            fill="#cbd5e1" // Light gray for tracing
                            dominantBaseline="middle"
                        >
                            {text}
                        </text>

                        {/* Start Here Dot (Subtle) */}
                        <circle cx={margin + 5} cy={y + 5} r="2" fill="#3b82f6" opacity="0.5" />
                    </g>
                )
            })}
        </>
    );

    if (isPreview) {
        return (
            <div className="w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
                <svg
                    viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                    className="w-full h-full max-w-full max-h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {renderContent()}
                </svg>
            </div>
        );
    }

    if (isPrintView) {
        return (
            <div className="max-w-[842px] mx-auto">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                    className="w-full h-auto bg-white"
                >
                    {renderContent()}
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            <SEOMetaTags
                title="Free Cursive Writing Practice Sheets - Sentences | Wizqo"
                description="Improve cursive flow with these positive affirmation practice sheets. Download free PDF worksheets for 3rd and 4th grade."
                keywords={['cursive writing practice sheets', 'cursive sentences', 'handwriting flow', '3rd grade cursive'].join(', ')}
                canonicalUrl="https://wizqo.com/printables/cursive-writing-practice-sheets"
            />
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center mb-10 text-center">
                    <span className="uppercase tracking-widest text-xs font-bold text-slate-400 mb-2">Penmanship Series</span>
                    <h1 className="text-4xl font-serif font-medium text-slate-800 mb-4">
                        Cursive Sentence Flow
                    </h1>
                    <p className="text-slate-600 max-w-xl font-light">
                        Connect letters smoothly with full sentence practice.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        onClick={toggleSet}
                        variant="outline"
                        className="h-12 border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Swap Sentences
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 bg-indigo-900 hover:bg-indigo-800 text-white shadow-md font-serif px-8"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download Sheet
                    </Button>
                </div>

                {/* Live Preview */}
                <div className="max-w-[842px] mx-auto bg-white shadow-xl rounded-sm overflow-hidden">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                        className="w-full h-auto bg-white"
                    >
                        {renderContent()}
                    </svg>
                </div>

            </main>
            <Footer />
        </div>
    );
}
