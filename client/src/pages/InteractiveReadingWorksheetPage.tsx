import React, { useRef, useState } from 'react';
import { WorksheetHeader } from '../components/worksheet/WorksheetHeader';
import { PDFDownloadButton } from '../components/common/PDFDownloadButton';
import { useTranslation } from '../context/TranslationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer, RefreshCw, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { SEOMetaTags } from '../components/SEOMetaTags';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';

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
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc: Document) => {
                    const target = (clonedDoc.body.querySelector('.bg-white.w-\\[210mm\\]') as HTMLElement) || clonedDoc.body.firstChild;
                    if (target) {
                        const targetElement = target as HTMLElement;
                        targetElement.style.setProperty('position', 'relative', 'important');
                        targetElement.style.setProperty('padding-top', '40px', 'important');
                        targetElement.style.setProperty('padding-bottom', '80px', 'important');

                        const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NCA0MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgMSkiPjxwYXRoIGQ9Ik0wLjQ1IDIwLjgxQzAuNDUgOS43NiA5LjQxIDAuODEgMjAuNDUgMC44MUg0Ni43QzU3Ljc1IDAuODEgNjYuNyA5Ljc2IDY2LjcgMjAuODFWNDAuODFIMjAuNDVDOS40MSA0MC44MSAwLjQ1IDMxLjg2IDAuNDUgMjAuODFaIiBmaWxsPSIjNDg0NUQyIi8+PHBhdGggZD0iTTQ2LjcgOC4zMUgyMC40NUMxMy41NSA4LjMxIDcuOTUgMTMuOTEgNy45NSAyMC44MUM3Ljk1IDI3LjcxIDEzLjU1IDMzLjMxIDIwLjQ1IDMzLjMxSDQ2LjdDNTMuNjEgMzMuMzEgNTkuMiAyNy43MSA1OS4yIDIwLjgxQzU5LjIgMTMuOTEgNTMuNjEgOC4zMSA0Ni43IDguMzFaIiBmaWxsPSIjQTVCNEZDIi8+PHBhdGggZD0iTTIwLjQ1IDI3LjA2QzIzLjkgMjcuMDYgMjYuNyAyNC4yNiAyNi43IDIwLjgxQzI2LjcgMTcuMzYgMjMuOSAxNC41NiAyMC40NSAxNC41NkMxNyAxNC41NiAxNC4yIDE3LjM2IDE0LjIgMjAuODFDMTQuMiAyNC4yNiAxNyAyNy4wNiAyMC40NSAyNy4wNloiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTE3Ljk1IDE5LjU2QzE4LjY0IDE5LjU2IDE5LjIgMTkgMTkuMiAxOC4zMUMxOS4yIDE3LjYyIDE4LjY0IDE3LjA2IDE3Ljk1IDE3LjA2QzE3LjI2IDE3LjA2IDE2LjcgMTcuNjIgMTYuNyAxOC4zMUMxNi43IDE5IDE3LjI2IDE5LjU2IDE3Ljk1IDE5LjU2WiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNNDcuOTUgMjcuMDZDNTEuNCAyNy4wNiA1NC4yIDI0LjI2IDU0LjIgMjAuODFDNTQuMiAxNy4zNiA1MS40IDE0LjU2IDQ3Ljk1IDE0LjU2QzQ0LjUgMTQuNTYgNDEuNyAxNy4zNiA0MS43IDIwLjgxQzQxLjcgMjQuMjYgNDQuNSAyNy4wNiA0Ny45NSAyNy4wNloiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTQ1LjQ1IDE5LjU2QzQ2LjE0IDE5LjU2IDQ2LjcgMTkgNDYuNyAxOC4zMUM0Ni43IDE3LjYyIDQ2LjE0IDE3LjA2IDQ1LjQ1IDE3LjA2QzQ0Ljc2IDE3LjA2IDQ0LjIgMTcuNjIgNDQuMiAxOC4zMUM0NC4yIDE5IDQ0Ljc2IDE5LjU2IDQ1LjQ1IDE5LjU2WiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+`;



                        const footer = clonedDoc.createElement('div');
                        footer.style.cssText = 'position: absolute !important; bottom: 25px !important; left: 0 !important; right: 0 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important; z-index: 9999 !important; width: 100% !important; height: 50px !important;';
                        footer.innerHTML = `
                            <div style="display: flex !important; align-items: center !important; gap: 8px !important; justify-content: center !important;">
                                <img src="${logoBase64}" style="width: 42px !important; height: 24px !important; opacity: 0.8 !important;" />
                                <span style="font-size: 12pt !important; font-weight: 700 !important; color: #4845D2 !important; font-family: system-ui, -apple-system, sans-serif !important;">www.wizqo.com</span>
                            </div>
                            <div style="font-size: 10pt !important; color: #64748b !important; opacity: 0.7 !important; font-family: system-ui, -apple-system, sans-serif !important;">
                                Copyright © ${new Date().getFullYear()} Wizqo. All rights reserved.
                            </div>
                        `;
                        targetElement.appendChild(footer);
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);

            const imgRatio = imgProps.width / imgProps.height; // Ratio width/height
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            // const pdfRatio = pdfWidth / pdfHeight; (Unused but implicit)

            // Calculate width/height to fit page width
            let w = pdfWidth;
            let h = w / imgRatio;

            // If the calculated height is taller than the page, constrain by height instead
            if (h > pdfHeight) {
                h = pdfHeight;
                w = h * imgRatio;
            }

            // Center content
            const x = (pdfWidth - w) / 2;
            const y = 0; // Top align for worksheets usually looks best, or (pdfHeight - h) / 2 for center

            pdf.addImage(imgData, 'PNG', x, y, w, h);
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
                <>
                    {(() => {
                        const seo = HUB_SEO_DATA['reading-discovery-interactive'] || {};
                        return (
                            <SEOMetaTags
                                title={seo.title || "Reading Discovery: Interactive Comprehension Worksheet | Wizqo"}
                                description={seo.metaDescription || "Free interactive reading comprehension worksheet for Grade 1 and 2. Features original stories, illustrations, and a 'Show Answer' toggle. Print as PDF instantly."}
                                ogImage={seo.image || "/images/reading-interactive-seo.jpg"}
                                canonicalUrl="https://wizqo.com/worksheets/reading-discovery-interactive"
                                ogType="website"
                            />
                        );
                    })()}
                    {(() => {
                        const canonical = "https://wizqo.com/worksheets/reading-discovery-interactive";
                        const breadcrumbLd = {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
                                { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
                                { "@type": "ListItem", position: 3, name: "Interactive Reading", item: canonical }
                            ]
                        } as const;
                        const softwareLd = {
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            name: "Wizqo Interactive Reading Discovery",
                            operatingSystem: "Any",
                            applicationCategory: "EducationalApplication",
                            image: "https://wizqo.com/images/reading-interactive-seo.jpg",
                            screenshot: "https://wizqo.com/images/reading-interactive-seo.jpg",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "USD"
                            },
                            featureList: "Dynamic passage shuffling, Interactive answer key, Multi-theme stories, High-res PDF export"
                        } as const;
                        const learningResourceLd = {
                            "@context": "https://schema.org",
                            "@type": "LearningResource",
                            name: "Reading Comprehension Mastery Sheet",
                            description: "An interactive reading resource where children practice comprehension skills with real-time feedback and story variants.",
                            learningResourceType: "Worksheet",
                            educationalLevel: "Grade 1, Grade 2",
                            competencyRequired: "Reading, Literacy, Critical Thinking"
                        } as const;
                        return (
                            <>
                                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
                                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
                                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }} />
                            </>
                        );
                    })()}
                </>
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

                        <PDFDownloadButton
                            onClick={handleDownloadPDF}
                            isGenerating={isGenerating}
                            disableDefaultPositioning={true}
                            className="px-6 py-3 text-base"
                        />
                    </div>
                </div>
            )}

            {/* Worksheet Content */}
            <div className={`flex justify-center ${isPreview ? 'items-start overflow-hidden' : 'print:block print:w-full'}`}>
                <div ref={printRef} className={`bg-white w-[210mm] min-h-[297mm] shadow-xl print:shadow-none p-8 md:p-12 relative flex flex-col ${isPreview ? 'shadow-none !min-h-0' : ''} print:p-6`}>

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
