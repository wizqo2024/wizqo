import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ChevronsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import jsPDF from 'jspdf';
import { CEDARVILLE_CURSIVE_TTF_BASE64 } from '@/lib/fonts';
import { drawSvgRefOnPDF } from '@/utils/pdfHelpers';

export default function HybridHandwritingWorksheet({ isPrintView = false }: { isPrintView?: boolean }) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Check for preview mode - check immediately for better iframe rendering
    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

    const WORDS = ['Hello', 'Friend', 'School', 'Write', 'Learn', 'Happy'];

    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    const handleDownloadPDF = async () => {
        try {
            if (!svgRef.current) return;
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            try {
                doc.addFileToVFS("Cedarville-Cursive.ttf", CEDARVILLE_CURSIVE_TTF_BASE64);
                doc.addFont("Cedarville-Cursive.ttf", "Cedarville", "normal");
            } catch (e) { console.warn(e); }

            await drawSvgRefOnPDF(doc, svgRef.current, 0, 0, 297, 210);
            doc.save('print-to-cursive-practice.pdf');
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => (
        <>
            <rect x="20" y="20" width={pageWidth - 40} height={pageHeight - 40} fill="none" stroke="#d6d3d1" strokeWidth="4" />

            {WORDS.map((word, i) => {
                const cols = 2;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const sectionW = (pageWidth - margin * 2) / cols;
                const sectionH = 150;
                const x = margin + col * sectionW + sectionW / 2;
                const y = 100 + row * sectionH;

                return (
                    <g key={word}>
                        {/* Print Version (Top) */}
                        <text x={x} y={y - 30} textAnchor="middle" fontSize="36" fontFamily="sans-serif" fontWeight="bold" fill="#57534e">{word}</text>

                        {/* Arrow */}
                        <path d={`M ${x} ${y - 10} L ${x} ${y + 10}`} stroke="#d6d3d1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        {/* Cursive Lines */}
                        <line x1={x - 100} y1={y + 20} x2={x + 100} y2={y + 20} stroke="#a8a29e" strokeWidth="1" /> {/* Top */}
                        <line x1={x - 100} y1={y + 40} x2={x + 100} y2={y + 40} stroke="#e7e5e4" strokeWidth="1" strokeDasharray="5,5" /> {/* Mid */}
                        <line x1={x - 100} y1={y + 60} x2={x + 100} y2={y + 60} stroke="#a8a29e" strokeWidth="1" /> {/* Base */}

                        {/* Traceable */}
                        <text
                            x={x}
                            y={y + 45}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="48"
                            fill="#d6d3d1"
                            dominantBaseline="middle"
                        >
                            {word}
                        </text>
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
        <div className="min-h-screen bg-stone-50">
            <SEOMetaTags
                title="Half Print Half Cursive Writing Worksheets - Transition Practice | Wizqo"
                description="Bridge the gap between print and cursive. Unique 'Translate' worksheets where students see print and write in cursive."
                keywords={['half print half cursive writing', 'print to cursive', 'handwriting transition', 'cursive practice'].join(', ')}
                canonicalUrl="https://wizqo.com/printables/half-print-half-cursive-writing"
            />
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">
                        Print to Cursive Bridge
                    </h1>
                    <p className="text-stone-600">
                        Read in <span className="font-sans font-bold">Print</span>, Write in <span className="font-serif italic font-bold">Cursive</span>.
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 px-8 rounded-md bg-stone-800 hover:bg-stone-900 text-stone-50"
                    >
                        <Download className="mr-2 h-5 w-5" /> Get Worksheet
                    </Button>
                </div>

                {/* Live Preview */}
                <div className="max-w-[842px] mx-auto bg-white shadow-lg rounded-sm overflow-hidden border border-stone-200">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                        className="w-full h-auto bg-[#fffdf5]"
                    >
                        {renderContent()}
                    </svg>
                </div>

            </main>
            <Footer />
        </div>
    );
}
