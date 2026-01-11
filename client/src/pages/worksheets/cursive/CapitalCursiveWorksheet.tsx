import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import jsPDF from 'jspdf';


export default function CapitalCursiveWorksheet({ isPrintView = false, isEmbedded = false }: { isPrintView?: boolean, isEmbedded?: boolean }) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Check for preview mode - check immediately for better iframe rendering
    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

    // The "Tricky" Letters
    const TRICKY_LETTERS = ['Z', 'G', 'F', 'Q', 'I', 'J'];

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
            doc.save('tricky-cursive-capitals.pdf');
            toast({ title: "Downloaded!", description: "Master those capitals!" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "PDF failed.", variant: "destructive" });
        }
    };

    const renderContent = () => (
        <>
            <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                </pattern>
            </defs>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="url(#grid)" />

            {/* Title */}
            <rect x="0" y="0" width={pageWidth} height="80" fill="#fff7ed" />
            <text x={pageWidth / 2} y={50} textAnchor="middle" fontSize="24" fontFamily="serif" fill="#c2410c" fontWeight="bold">The Tricky Capitals</text>

            {TRICKY_LETTERS.map((char, i) => {
                // 2 rows of 3 letters
                const cols = 3;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const sectionW = (pageWidth - margin * 2) / cols;
                const sectionH = 220;
                const x = margin + col * sectionW + sectionW / 2;
                const y = 160 + row * sectionH;

                return (
                    <g key={char}>
                        {/* Big Letter Box */}
                        <rect x={x - 60} y={y - 80} width="120" height="160" fill="none" stroke="#fed7aa" strokeWidth="2" rx="10" />

                        {/* Guidelines inside box */}
                        <line x1={sectionW > 0 ? x - 50 : 0} y1={y - 20} x2={x + 50} y2={y - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1={x - 50} y1={y + 20} x2={x + 50} y2={y + 20} stroke="#94a3b8" strokeWidth="2" />

                        {/* The Letter */}
                        <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="100"
                            fill="#cbd5e1" // Light gray for tracing
                            dominantBaseline="middle"
                        >
                            {char}
                        </text>

                        {/* Label */}
                        <text x={x} y={y + 100} textAnchor="middle" fontSize="14" fill="#64748b" fontFamily="sans-serif">Practice {char}</text>
                    </g>
                )
            })}
        </>
    );

    if (isEmbedded) {
        return (
            <div className="flex flex-col items-center w-full min-h-[500px] justify-center">
                <div className="flex justify-center mb-10">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-14 px-10 text-lg rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 shadow-xl"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download Worksheet
                    </Button>
                </div>

                <div className="max-w-[842px] mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200">
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
        <div className="min-h-screen bg-slate-50">
            <SEOMetaTags
                title="Capital 'Z' Cursive Writing - Difficult Letters Worksheet | Wizqo"
                description="Master the hardest cursive capital letters like Z, G, F, and Q. Specialized practice worksheet for advanced handwriting."
                keywords={['capital z cursive writing', 'z in cursive', 'hard cursive letters', 'cursive G', 'cursive F'].join(', ')}
                canonicalUrl="https://wizqo.com/printables/capital-cursive-writing-worksheets"
            />
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Tricky Capitals Masterclass
                    </h1>
                    <p className="text-slate-600">
                        Specifically designed for the letters everyone struggles with:
                        <span className="font-serif italic mx-1 font-bold">Z, G, F, Q</span>
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-14 px-10 text-lg rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 shadow-xl"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download Worksheet
                    </Button>
                </div>

                {/* Live Preview */}
                <div className="max-w-[842px] mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200">
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
