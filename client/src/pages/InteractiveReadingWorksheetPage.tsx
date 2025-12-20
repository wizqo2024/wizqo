import React, { useRef, useState } from 'react';
import { WorksheetHeader } from '../components/worksheet/WorksheetHeader';
import { useTranslation } from '../context/TranslationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Printer, RefreshCw, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { SEOMetaTags } from '../components/SEOMetaTags';

const stories = [
    {
        id: 'space-adventure',
        title: "Leo's Space Adventure",
        image: "/images/worksheets/space-adventure.png",
        passage: "Leo is a brave young astronaut. Today, he landed his orange spaceship on a red planet. He saw blue glowing mountains in the distance. Suddenly, a small green alien with three eyes appeared! Leo was not scared. He opened his lunch box and shared some star-shaped space cookies. The alien was very happy and they became friends. Leo felt excited to explore the new planet together.",
        questions: [
            { q: "What color is Leo's spaceship?", a: "Orange" },
            { q: "What did the alien look like?", a: "Small, green, and has three eyes" },
            { q: "What did Leo share with the alien?", a: "Star-shaped space cookies" },
            { q: "How did Leo feel at the end?", a: "Excited" }
        ],
        theme: "sky"
    },
    {
        id: 'helpful-robot',
        title: "The Helpful Robot",
        image: "/images/worksheets/helping-robot.png",
        passage: "Rusty is a shiny silver robot with big friendly eyes. He lives in a futuristic workshop with many colorful doors. One morning, Rusty heard a soft whimper. He looked near the rainbow-colored door and found a small brown puppy. The puppy was lost and hungry. Rusty gently picked up the puppy and gave it some warm milk. Rusty felt happy because he could help a new friend find its way home.",
        questions: [
            { q: "What is the robot's name?", a: "Rusty" },
            { q: "What color is the puppy?", a: "Brown" },
            { q: "Where did Rusty find the puppy?", a: "Near the rainbow-colored door" },
            { q: "Why did Rusty feel happy?", a: "Because he helped the puppy" }
        ],
        theme: "orange"
    },
    {
        id: 'magic-garden',
        title: "Mia's Magic Garden",
        image: "/images/worksheets/magic-garden.png",
        passage: "Mia loves her garden, but it is not a normal garden. It is a magic garden! When Mia waters the giant purple flowers, they start to play beautiful music. Small musical notes float in the air like bubbles. Mia uses a pink watering can to care for them. Even the tiny bugs in the garden like to dance to the music. On sunny days, the garden smells like sweet strawberries and sounds like a happy song.",
        questions: [
            { q: "What color are the giant flowers?", a: "Purple" },
            { q: "What happens when Mia waters the flowers?", a: "They play beautiful music" },
            { q: "What does Mia use to water the plants?", a: "A pink watering can" },
            { q: "What does the garden smell like on sunny days?", a: "Sweet strawberries" }
        ],
        theme: "violet"
    }
];

export default function InteractiveReadingWorksheetPage() {
    const { t } = useTranslation();
    const printRef = useRef<HTMLDivElement>(null);
    const [storyIndex, setStoryIndex] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const currentStory = stories[storyIndex];

    const shuffleStory = () => {
        setIsShuffling(true);
        setTimeout(() => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * stories.length);
            } while (newIndex === storyIndex && stories.length > 1);

            setStoryIndex(newIndex);
            setShowAnswers(false);
            setIsShuffling(false);
        }, 500);
    };

    const handlePrint = () => {
        // Force hide answers for print if user forgot
        const originalShow = showAnswers;
        if (showAnswers) setShowAnswers(false);

        // Use a small delay to allow React to re-render without answers before printing
        setTimeout(() => {
            window.print();
            if (originalShow) setShowAnswers(true);
        }, 100);
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current || isGenerating) return;

        setIsGenerating(true);
        const originalShow = showAnswers;
        setShowAnswers(false); // Never show answers in the generic PDF download

        try {
            // Wait for re-render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`reading-discovery-${currentStory.id}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Could not generate PDF. Please use the Print button instead.');
        } finally {
            setShowAnswers(originalShow);
            setIsGenerating(false);
        }
    };

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=1');

    return (
        <div className={`font-sans text-slate-900 ${isPreview ? 'p-0 bg-white' : 'min-h-screen pb-16 bg-slate-50'} print:bg-white print:pb-0`}>
            {!isPreview && (
                <SEOMetaTags
                    title="Reading Discovery: Interactive Comprehension Worksheet | Wizqo"
                    description="Free interactive reading comprehension worksheet for Grade 1 and 2. Features original stories, illustrations, and a 'Show Answer' toggle. Print as PDF instantly."
                    canonicalUrl="https://wizqo.com/worksheets/reading-discovery-interactive"
                />
            )}

            {/* Control Bar */}
            {!isPreview && (
                <div className="max-w-4xl mx-auto px-4 py-8 print:hidden">
                    <button
                        onClick={() => window.location.href = '/worksheets/reading-comprehension'}
                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:underline transition-all mb-6 font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back to Reading Worksheets
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reading Discovery</h1>
                            <p className="text-slate-600">
                                Interactive reading comprehension with original stories and instant answers.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowAnswers(!showAnswers)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md ${showAnswers ? 'bg-orange-100 text-orange-700 border-2 border-orange-200' : 'bg-emerald-600 text-white border-2 border-emerald-700 hover:bg-emerald-700'}`}
                            >
                                {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
                                {showAnswers ? 'Hide Answers' : 'Show Answers'}
                            </button>

                            <button
                                onClick={shuffleStory}
                                disabled={isShuffling}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                            >
                                {isShuffling ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                New Story
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-lg"
                        >
                            <Printer size={20} />
                            Print Worksheet
                        </button>

                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 size={20} className="animate-spin text-violet-600" /> : <Download size={20} />}
                            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            )}

            {/* Worksheet Content */}
            <div className={`flex justify-center ${isPreview ? 'items-start overflow-hidden' : 'print:block print:w-full'}`}>
                <div ref={printRef} className={`bg-white w-[210mm] min-h-[297mm] shadow-xl print:shadow-none p-8 md:p-12 relative flex flex-col ${isPreview ? 'shadow-none w-full !min-h-0' : ''} print:p-6`}>

                    {!isPreview && (
                        <div className="mb-6">
                            <WorksheetHeader enabled={true} showScore={false} />
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-slate-900 mb-2 font-display uppercase tracking-tight">
                            Reading Discovery
                        </h1>
                        <p className="text-xl text-slate-500 font-medium">Topic: {currentStory.title}</p>
                    </div>

                    {/* Instruction */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-8">
                        <p className="text-slate-700 font-bold italic">
                            Instructions: Read the passage below carefully. Then, answer the comprehension questions.
                        </p>
                    </div>

                    {/* Story Card */}
                    <div className={`border-4 rounded-[2.5rem] p-8 mb-10 relative overflow-hidden transition-colors duration-500
                        ${currentStory.theme === 'sky' ? 'border-sky-200 bg-sky-50' :
                            currentStory.theme === 'orange' ? 'border-orange-200 bg-orange-50' :
                                'border-violet-200 bg-violet-50'}`}>

                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <h2 className={`text-3xl font-black mb-6 ${currentStory.theme === 'sky' ? 'text-sky-700' :
                                        currentStory.theme === 'orange' ? 'text-orange-700' :
                                            'text-violet-700'
                                    }`}>
                                    {currentStory.title}
                                </h2>
                                <p className="text-xl leading-relaxed text-slate-800 font-medium font-serif">
                                    {currentStory.passage}
                                </p>
                            </div>
                            <div className="w-full lg:w-72 aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
                                <img
                                    src={currentStory.image}
                                    alt={currentStory.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Area */}
                    <div className="space-y-8 flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">?</span>
                            Comprehension Questions
                        </h3>

                        <div className="grid grid-cols-1 gap-10">
                            {currentStory.questions.map((item, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="flex items-start gap-4">
                                        <span className="text-2xl font-black text-slate-300 mt-0.5">{idx + 1}.</span>
                                        <div className="flex-1">
                                            <p className="text-xl font-bold text-slate-800 mb-4">{item.q}</p>
                                            <div className="border-b-2 border-slate-200 w-full h-8 flex items-center">
                                                {showAnswers && (
                                                    <span className="text-xl font-black text-emerald-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                        {item.a}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t-2 border-slate-100 flex justify-between items-center text-slate-400 font-bold">
                        <p>© {new Date().getFullYear()} WIZQO.COM</p>
                        <p className="uppercase tracking-widest text-xs">Premium Reading Series</p>
                    </div>
                </div>
            </div>

            {/* Custom Styles for Print */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                }
                .font-display { font-family: "Outfit", sans-serif; }
            `}} />
        </div>
    );
}
