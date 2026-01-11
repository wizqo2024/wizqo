import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import jsPDF from 'jspdf';


export default function JoiningCursiveWorksheet({ isPrintView = false, isEmbedded = false }: { isPrintView?: boolean, isEmbedded?: boolean }) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Check for preview mode - check immediately for better iframe rendering
    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

    // Common tricky connections
    const JOINS = ['br', 'os', 've', 'wi', 'on', 'bl', 'ch', 'th', 'sh'];

    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    const handleDownloadPDF = async () => {
        try {
            if (!svgRef.current) return;
            const { drawSvgRefOnPDF } = await import('@/utils/pdfHelpers');
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });


            await drawSvgRefOnPDF(doc, svgRef.current, 0, 0, 297, 210);
            doc.save('cursive-connections.pdf');
            toast({ title: "Downloaded!", description: "Practice those connections." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "PDF failed.", variant: "destructive" });
        }
    };

    const renderContent = () => (
        <>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="#ecfeff" opacity="0.3" />

            {/* Header */}
            <rect x={margin} y={margin} width={pageWidth - margin * 2} height={80} fill="white" rx="10" stroke="#bae6fd" strokeWidth="2" />
            <text x={pageWidth / 2} y={margin + 50} textAnchor="middle" fontSize="24" fontFamily="serif" fill="#0891b2">Common Letter Joins</text>

            {/* Grid of Joins */}
            {JOINS.map((join, i) => {
                const cols = 3;
                const rowH = 120;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const x = margin + 50 + col * ((pageWidth - margin * 2) / cols);
                const y = 200 + row * rowH;

                return (
                    <g key={join}>
                        {/* Line Set */}
                        <line x1={x - 80} y1={y - 20} x2={x + 80} y2={y - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1={x - 80} y1={y + 20} x2={x + 80} y2={y + 20} stroke="#94a3b8" strokeWidth="2" />

                        {/* The Join Text */}
                        <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="64"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {join}
                        </text>

                        {/* Repetition guides */}
                        <text x={x} y={y + 50} textAnchor="middle" fontSize="32" fill="#e2e8f0" fontFamily="'Cedarville Cursive', cursive">{join} {join}</text>
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

    if (isEmbedded) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="flex justify-center mb-10">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 px-8 text-lg rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download PDF
                    </Button>
                </div>

                <div className="max-w-[842px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden border-2 border-cyan-100">
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

    return (
        <div className="min-h-screen bg-cyan-50">
            <SEOMetaTags
                title="Joining Cursive Letters Worksheets - Connection Practice | Wizqo"
                description="Learn how to connect cursive letters correctly. Free worksheet focusing on tricky joins like 'br', 've', and 'os'."
                keywords={['joining cursive letters', 'cursive connections', 'handwriting joins', 'cursive writing practice'].join(', ')}
                canonicalUrl="https://wizqo.com/printables/joining-cursive-letters-worksheets"
            />
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-3 bg-cyan-100 rounded-full mb-4">
                        <Link2 className="h-8 w-8 text-cyan-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-cyan-900 mb-2">
                        Mastering Connections
                    </h1>
                    <p className="text-cyan-700 max-w-lg">
                        The secret to fast, legible cursive is mastering the "joins". Practice the most common connections below.
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 px-8 text-lg rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download PDF
                    </Button>
                </div>

                {/* Live Preview */}
                <div className="max-w-[842px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden border-2 border-cyan-100">
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
