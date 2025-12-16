import React, { useRef } from 'react';
import { WorksheetHeader } from '../components/worksheet/WorksheetHeader';
import { useTranslation } from '../context/TranslationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Printer, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { SEOMetaTags } from '../components/SEOMetaTags';

// Simple SVG Icons components to avoid external dependencies for this specific worksheet
const Icons = {
    Apple: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" fill="#ef4444" stroke="#991b1b" />
            <path d="M10 2c1 .5 2 2 2 5" stroke="#166534" strokeWidth="2" />
        </svg>
    ),
    Car: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" fill="#3b82f6" stroke="#1e3a8a" />
            <circle cx="7" cy="17" r="2" fill="#1f2937" />
            <circle cx="17" cy="17" r="2" fill="#1f2937" />
        </svg>
    ),
    Star: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#eab308" stroke="#a16207" />
        </svg>
    ),
    Tree: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c-4 0-8 4-8 9s4 9 8 9h0s4-4 8-9-4-9-8-9" fill="#22c55e" stroke="#15803d" />
            <path d="M12 22v-8" stroke="#78350f" strokeWidth="3" />
        </svg>
    ),
    Fish: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 12c.94-2.08 2.55-4 5.5-4 4.5 0 7 2.5 7 9s-2.5 9-7 9c-3 0-4.5-2-5.5-4" fill="#f97316" stroke="#c2410c" />
            <path d="M6 12C2 12 2 8 2 8s3 0 4 4" fill="#f97316" stroke="#c2410c" />
            <circle cx="16" cy="12" r="1.5" fill="#000" />
        </svg>
    ),
    Ghost: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 10h.01" stroke="#000" strokeWidth="3" />
            <path d="M15 10h.01" stroke="#000" strokeWidth="3" />
            <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" fill="#cbd5e1" stroke="#475569" />
        </svg>
    ),
};

const ShadowIcon = ({ Icon, className }: { Icon: any, className?: string }) => (
    <div className={`filter brightness-0 contrast-200 opacity-60 ${className}`}>
        <Icon className="w-full h-full text-gray-500" />
    </div>
);

export default function ShadowMatchingWorksheetPage() {
    const { t } = useTranslation();
    const printRef = useRef<HTMLDivElement>(null);
    const [leftItems, setLeftItems] = React.useState<any[]>([]);
    const [rightItems, setRightItems] = React.useState<any[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isShuffling, setIsShuffling] = React.useState(false);

    const allItems = [
        { id: 1, Icon: Icons.Apple, name: 'Apple' },
        { id: 2, Icon: Icons.Car, name: 'Car' },
        { id: 3, Icon: Icons.Star, name: 'Star' },
        { id: 4, Icon: Icons.Tree, name: 'Tree' },
        { id: 5, Icon: Icons.Fish, name: 'Fish' },
        { id: 6, Icon: Icons.Ghost, name: 'Ghost' },
    ];

    // Shuffle function
    const shuffle = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const randomizeItems = () => {
        setIsShuffling(true);
        // Add a small delay for better UX
        setTimeout(() => {
            // Pick 5 random items from the total pool of 6 to add variety
            const shuffledPool = shuffle(allItems);
            const selected = shuffledPool.slice(0, 5);

            // Left column: Random order
            setLeftItems(shuffle(selected));

            // Right column: Different random order
            setRightItems(shuffle(selected));
            setIsShuffling(false);
        }, 600);
    };

    React.useEffect(() => {
        // Initial load without delay
        const shuffledPool = shuffle(allItems);
        const selected = shuffledPool.slice(0, 5);
        setLeftItems(shuffle(selected));
        setRightItems(shuffle(selected));
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            // Temporarily show loading or disable button if needed
            const canvas = await html2canvas(printRef.current, {
                scale: 2, // Retain high quality
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('match-object-to-shadow-wizqo.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Could not generate PDF. Please try "Print" -> "Save as PDF" instead.');
        } finally {
            setIsGenerating(false);
        }
    };

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=1');

    return (
        <div className={`font-sans text-slate-900 ${isPreview ? 'p-0 bg-white' : 'min-h-screen pb-16 bg-slate-50'} print:bg-white print:pb-0`}>
            {!isPreview && (
                <SEOMetaTags
                    title="Match Object to Shadow - Free Kindergarten Worksheet | Wizqo"
                    description="Free printable Match the Object to Its Shadow worksheet. Fun visual perception game for kindergarten and preschool. Print PDF instantly."
                    canonicalUrl="https://wizqo.com/worksheets/match-object-to-shadow"
                />
            )}

            {/* Control Bar (Hidden in Print and Preview) */}
            {!isPreview && (
                <div className="max-w-4xl mx-auto px-4 py-8 print:hidden">
                    <button
                        onClick={() => {
                            if (window.history.length > 2) {
                                window.history.back();
                            } else {
                                window.location.href = '/worksheets/kindergarten-math-worksheets';
                            }
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back to Worksheets
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Object Shadow Matching</h1>
                    <p className="text-slate-600 mb-8 max-w-2xl">
                        Develop visual discrimination skills! Draw a line to connect each colorful object on the left to its matching shadow on the right.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <Printer size={20} />
                            Print Worksheet
                        </button>

                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold transition-colors shadow-sm ${isGenerating ? 'opacity-70 cursor-not-allowed bg-slate-50' : 'hover:border-violet-200 hover:bg-violet-50'}`}
                        >
                            {isGenerating ? <Loader2 size={20} className="animate-spin text-violet-600" /> : <Download size={20} />}
                            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                        </button>

                        <button
                            onClick={randomizeItems}
                            disabled={isShuffling}
                            className={`flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold transition-colors shadow-sm ${isShuffling ? 'opacity-70 cursor-not-allowed bg-slate-50' : 'hover:border-emerald-200 hover:bg-emerald-50'}`}
                        >
                            {isShuffling ? <Loader2 size={20} className="animate-spin text-emerald-600" /> : <RefreshCw size={20} />}
                            {isShuffling ? 'Shuffling...' : 'Shuffle Items'}
                        </button>
                    </div>
                </div>
            )}

            {/* Worksheet Preview / Print Area */}
            <div className={`flex justify-center ${isPreview ? 'items-start overflow-hidden' : 'print:block print:w-full'}`}>
                <div
                    ref={printRef}
                    className={`bg-white w-[210mm] min-h-[297mm] shadow-xl print:shadow-none p-8 md:p-12 relative flex flex-col ${isPreview ? 'shadow-none w-full h-auto !min-h-0 box-border' : ''}`}
                    style={isPreview ? { transform: 'scale(1)', transformOrigin: 'top left' } : {}}
                >
                    {/* Header - Only hide in preview if causing issues, but keeping enabled for now. 
                        If the 'Tip' comes from here, we will know. */}
                    {!isPreview && <WorksheetHeader
                        enabled={true}
                        showScore={true}
                    />}

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-comic text-slate-900 mb-2">Match the Object to Its Shadow</h1>
                        <p className="text-lg text-slate-600 font-comic">Visual Perception: Draw a line to connect each object to its matching shadow.</p>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 mt-4">
                        <div className="grid grid-cols-2 gap-12 h-full">

                            {/* Left Column: Bright Objects */}
                            <div className="flex flex-col h-full border-2 border-orange-200 rounded-3xl overflow-hidden">
                                <div className="bg-orange-100 py-3 text-center border-b-2 border-orange-200">
                                    <h3 className="text-xl font-bold text-orange-800 font-comic">Bright Objects</h3>
                                </div>
                                <div className="flex-1 flex flex-col justify-around p-6 bg-orange-50/30">
                                    {leftItems.map((item) => (
                                        <div key={`obj-${item.id}`} className="flex justify-center items-center">
                                            <div className="w-24 h-24 bg-white border-4 border-orange-200 rounded-2xl p-4 flex items-center justify-center shadow-sm">
                                                <item.Icon className="w-full h-full drop-shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Shadows */}
                            <div className="flex flex-col h-full border-2 border-violet-200 rounded-3xl overflow-hidden">
                                <div className="bg-violet-100 py-3 text-center border-b-2 border-violet-200">
                                    <h3 className="text-xl font-bold text-violet-800 font-comic">Dark Shadows</h3>
                                </div>
                                <div className="flex-1 flex flex-col justify-around p-6 bg-violet-50/30">
                                    {rightItems.map((item) => (
                                        <div key={`shadow-${item.id}`} className="flex justify-center items-center">
                                            <div className="w-24 h-24 bg-white border-4 border-violet-200 rounded-2xl p-4 flex items-center justify-center shadow-sm">
                                                {/* Use CSS filter to turn the exact same SVG into a shadow */}
                                                <ShadowIcon Icon={item.Icon} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm font-comic">
                        <p>© {new Date().getFullYear()} Wizqo.com - Free Printable Worksheets</p>
                        <p>Visual Perception Series</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
