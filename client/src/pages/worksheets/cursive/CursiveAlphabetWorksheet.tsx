import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import jsPDF from 'jspdf';
import { CEDARVILLE_CURSIVE_TTF_BASE64 } from '@/lib/fonts';
import { drawSvgRefOnPDF } from '@/utils/pdfHelpers';

export default function CursiveAlphabetWorksheet() {
    const { toast } = useToast();
    const { t } = useTranslation();
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [isPrinting, setIsPrinting] = React.useState(false);

    // Check for preview mode - check immediately for better iframe rendering
    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

    // Layout Constants
    const pageWidth = 842; // A4 Landscape
    const pageHeight = 595;
    const margin = 40;

    const alphabet = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz".split(' ');

    const handleDownloadPDF = async () => {
        try {
            if (!svgRef.current) return;
            setIsPrinting(true);
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            try {
                doc.addFileToVFS("Cedarville-Cursive.ttf", CEDARVILLE_CURSIVE_TTF_BASE64);
                doc.addFont("Cedarville-Cursive.ttf", "Cedarville", "normal");
            } catch (e) { console.warn("Font loading skipped", e); }

            await drawSvgRefOnPDF(doc, svgRef.current, 0, 0, 297, 210);
            doc.save('cursive-alphabet-mastery.pdf');

            toast({
                title: "Download Complete",
                description: "Your premium cursive chart is ready.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPrinting(false);
        }
    };

    if (isPreview) {
        return (
            <div className="w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
                <svg
                    viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                    className="w-full h-full max-w-full max-h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Vintage Border */}
                    <rect x="20" y="20" width={pageWidth - 40} height={pageHeight - 40} fill="none" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="24" y="24" width={pageWidth - 48} height={pageHeight - 48} fill="none" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Header */}
                    <text x={pageWidth / 2} y={60} textAnchor="middle" fontSize="32" fontFamily="serif" fill="#1e293b" fontWeight="bold">Cursive Alphabet</text>

                    {/* Grid Layout for Alphabet */}
                    {alphabet.map((pair, index) => {
                        const cols = 7;
                        const cellWidth = (pageWidth - margin * 2) / cols;
                        const cellHeight = (pageHeight - 100 - margin) / 4; // 4 rows

                        const col = index % cols;
                        const row = Math.floor(index / cols);

                        const x = margin + col * cellWidth + cellWidth / 2;
                        const y = 110 + row * cellHeight;

                        // Skip if overflow (should fit 26 exactly in 4x7 grid with room)
                        if (index >= 26) return null;

                        return (
                            <g key={pair}>
                                {/* Guide Lines */}
                                <line x1={x - 40} y1={y - 15} x2={x + 40} y2={y - 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" /> {/* Top */}
                                <line x1={x - 40} y1={y + 15} x2={x + 40} y2={y + 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" /> {/* Bottom */}
                                <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke="#e2e8f0" strokeWidth="1" /> {/* Base */}

                                {/* Letter */}
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    fontFamily="'Cedarville Cursive', cursive"
                                    fontSize="42"
                                    fill="#1e293b" // Navy/Slate ink
                                    dominantBaseline="middle"
                                >
                                    {pair}
                                </text>
                            </g>
                        );
                    })}

                    {/* Decorative Footer */}
                    <text x={pageWidth / 2} y={pageHeight - 30} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#64748b" italic="true">Practice makes progress.</text>

                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7]"> {/* Cream background for premium feel */}
            <SEOMetaTags
                title="Free Cursive Writing Alphabet Worksheets - Premium Chart | Wizqo"
                description="Master the cursive alphabet with this elegant, printable reference chart. Perfect for 3rd grade students learning joined-up writing."
                keywords={['cursive writing alphabet worksheets', 'cursive chart', '3rd grade handwriting', 'printable cursive'].join(', ')}
                canonicalUrl="https://wizqo.com/printables/cursive-writing-alphabet-worksheets"
            />
            {!isPreview && <UnifiedNavigation />}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4 tracking-tight">
                        The Art of Cursive
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light font-serif italic">
                        "Elegant penmanship starts with mastering the classics."
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-10 flex justify-center gap-4">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-amber-50 shadow-lg hover:shadow-xl transition-all font-serif"
                        disabled={isPrinting}
                    >
                        <Download className="mr-2 h-5 w-5" /> Download Printable Chart
                    </Button>
                </div>

                {/* Live Preview - Premium Card Look */}
                <div className="max-w-[842px] mx-auto bg-white rounded-sm shadow-2xl overflow-hidden border-[16px] border-[#f1f5f9]">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                        className="w-full h-auto bg-[#fffaf0]" // Very subtle ivory paper
                    >
                        {/* Vintage Border */}
                        <rect x="20" y="20" width={pageWidth - 40} height={pageHeight - 40} fill="none" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="24" y="24" width={pageWidth - 48} height={pageHeight - 48} fill="none" stroke="#cbd5e1" strokeWidth="1" />

                        {/* Header */}
                        <text x={pageWidth / 2} y={60} textAnchor="middle" fontSize="32" fontFamily="serif" fill="#1e293b" fontWeight="bold">Cursive Alphabet</text>

                        {/* Grid Layout for Alphabet */}
                        {alphabet.map((pair, index) => {
                            const cols = 7;
                            const cellWidth = (pageWidth - margin * 2) / cols;
                            const cellHeight = (pageHeight - 100 - margin) / 4; // 4 rows

                            const col = index % cols;
                            const row = Math.floor(index / cols);

                            const x = margin + col * cellWidth + cellWidth / 2;
                            const y = 110 + row * cellHeight;

                            // Skip if overflow (should fit 26 exactly in 4x7 grid with room)
                            if (index >= 26) return null;

                            return (
                                <g key={pair}>
                                    {/* Guide Lines */}
                                    <line x1={x - 40} y1={y - 15} x2={x + 40} y2={y - 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" /> {/* Top */}
                                    <line x1={x - 40} y1={y + 15} x2={x + 40} y2={y + 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" /> {/* Bottom */}
                                    <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke="#e2e8f0" strokeWidth="1" /> {/* Base */}

                                    {/* Letter */}
                                    <text
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        fontFamily="'Cedarville Cursive', cursive"
                                        fontSize="42"
                                        fill="#1e293b" // Navy/Slate ink
                                        dominantBaseline="middle"
                                    >
                                        {pair}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Decorative Footer */}
                        <text x={pageWidth / 2} y={pageHeight - 30} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#64748b" italic="true">Practice makes progress.</text>

                    </svg>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500 font-serif">
                    A classic reference for the modern student.
                </div>

            </main>
            {!isPreview && <Footer />}
        </div>
    );
}
