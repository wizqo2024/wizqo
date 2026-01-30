import React, { useState, useRef } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, Printer, Star, Heart, Scissors, Car, Bike, Rocket, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import jsPDF from 'jspdf';
import { generateWorksheetPDF } from '@/utils/pdfGenerator';
import { trackWorksheetDownload } from '@/utils/analytics';
import { SocialShare } from '@/components/SocialShare';
import { getWorksheetSEOBySlug } from '@shared/worksheetSEO';

type ColorTheme = 'classic' | 'rainbow' | 'ocean' | 'candy' | 'forest' | 'sunset' | 'bw';
type IconTheme = 'dinosaurs' | 'bunnies' | 'cars' | 'stars' | 'hearts' | 'rockets';

const THEMES: Record<ColorTheme, { name: string; primary: string; secondary: string; text: string; bg: string; rainbow?: boolean }> = {
    classic: { name: 'Classic Blue', primary: '#94a3b8', secondary: '#cbd5f5', text: '#475569', bg: '#f8fafc' },
    rainbow: { name: 'Rainbow', primary: '#f472b6', secondary: '#fbcfe8', text: '#1e293b', bg: '#fffafb', rainbow: true },
    ocean: { name: 'Deep Sea', primary: '#0ea5e9', secondary: '#bae6fd', text: '#0369a1', bg: '#f0f9ff' },
    candy: { name: 'Cotton Candy', primary: '#db2777', secondary: '#fbcfe8', text: '#be185d', bg: '#fff1f2' },
    forest: { name: 'Magic Forest', primary: '#059669', secondary: '#d1fae5', text: '#065f46', bg: '#f0fdf4' },
    sunset: { name: 'Warm Sunset', primary: '#ea580c', secondary: '#ffedd5', text: '#9a3412', bg: '#fff7ed' },
    bw: { name: 'Black & White', primary: '#000000', secondary: '#cbd5e1', text: '#000000', bg: '#ffffff' },
};

const DinosaurIcon = (props: any) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M3 20c0-3.3 2.7-6 6-6h3.6L11 9.5c-.3-1 .4-2 1.5-2H15l1.5-3.5c.3-.7 1.2-.9 1.8-.4l2.5 2.2c.5.4.6 1.1.2 1.6L19 10h-2l1 4h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4v-2h-2v2h-4v-2H9c-2.2 0-4-1.8-4-4v-2H3v2z" />
        <circle cx="16" cy="8" r="0.5" fill="currentColor" />
    </svg>
);

const BunnyIcon = (props: any) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M10 20v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M14 20v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M20 12.5c0-1.7-1.3-3-3-3a3 3 0 0 0-3 3v.5h-4v-.5a3 3 0 0 0-3-3c-1.7 0-3 1.3-3 3v2.5a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-2.5z" />
        <path d="M7 9.5V4a2 2 0 0 1 4 0v3M13 7V4a2 2 0 0 1 4 0v5.5" />
        <circle cx="9" cy="14" r="0.5" fill="currentColor" />
        <circle cx="15" cy="14" r="0.5" fill="currentColor" />
    </svg>
);

const ICONS: Record<IconTheme, { name: string; icon: string; label: string; lucide?: React.ElementType }> = {
    dinosaurs: { name: 'Dinosaurs', icon: '🦕', label: 'Dinosaur', lucide: DinosaurIcon },
    bunnies: { name: 'Bunnies', icon: '🐰', label: 'Bunny', lucide: BunnyIcon },
    cars: { name: 'Cars', icon: '🏎️', label: 'Car', lucide: Car },
    stars: { name: 'Stars', icon: '⭐', label: 'Star', lucide: Star },
    hearts: { name: 'Hearts', icon: '❤️', label: 'Heart', lucide: Heart },
    rockets: { name: 'Rockets', icon: '🚀', label: 'Rocket', lucide: Rocket },
};

const NUMBER_NAMES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// --- Reusable Worksheet Template Component ---
interface WorksheetTemplateProps {
    number: number;
    iconTheme: IconTheme;
    colorTheme: ColorTheme;
    isOutlineMode?: boolean;
    childName?: string;
    t: any;
    id?: string;
}

const CountingWorksheetTemplate: React.FC<WorksheetTemplateProps> = ({
    number,
    iconTheme,
    colorTheme,
    isOutlineMode,
    childName,
    t,
    id
}: WorksheetTemplateProps) => {
    const theme = THEMES[colorTheme];
    const iconData = ICONS[iconTheme];
    const IconComponent = iconData.lucide || Star; // Fallback

    const renderIcons = () => {
        const icons = [];
        for (let i = 0; i < number; i++) {
            if (isOutlineMode) {
                // Outline Mode: Use Lucide SVG with stroke
                icons.push(
                    <div key={i} className="text-6xl animate-in zoom-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                        <IconComponent
                            className="w-16 h-16 sm:w-20 sm:h-20"
                            strokeWidth={1.5}
                            color="black"
                            fill="transparent"
                        />
                    </div>
                );
            } else {
                // Standard Mode: Use Emoji
                icons.push(
                    <div key={i} className="text-4xl sm:text-6xl animate-in zoom-in duration-300 fill-mode-both" style={{ animationDelay: `${i * 50}ms` }}>
                        {iconData.icon}
                    </div>
                );
            }
        }
        // Special case for Zero: Show a friendly message if needed, or just keep it empty (correct for 0)
        return icons;
    };

    return (
        <div
            id={id}
            className="bg-white rounded-sm shadow-2xl border border-slate-200 aspect-[8.5/11] p-12 flex flex-col items-center overflow-hidden worksheet-section relative"
            style={{
                // Ensure print styles are forced even if captured off-screen
                width: '8.5in',
                height: '11in',
                minHeight: '11in',
                maxHeight: '11in',
                padding: '0.5in',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <div className="w-full text-center border-b-2 border-slate-100 pb-4 mb-6 relative">
                <div className="absolute left-0 top-0 text-slate-200">
                    <Star className="w-12 h-12" strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {childName ? `${childName}'s ` : ''}Counting Practice
                </h2>
                <div className="flex justify-center items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        WIZQO MAGIC MATH
                    </span>
                </div>
            </div>

            {/* Big Number Section */}
            <div className="flex-1 w-full flex flex-col items-center justify-between">
                <div className="text-center">
                    <div
                        className={`text-[250px] leading-[1] font-normal relative ${!isOutlineMode && 'pdf-gradient-text'}`} // Only gradient if not outline
                        data-gradient-colors={(!isOutlineMode && colorTheme === 'rainbow') ? '#ef4444, #f97316, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899' : ''}
                        style={{
                            fontFamily: "'KG Primary Dots', sans-serif",
                            ...(isOutlineMode ? {
                                color: 'transparent',
                                WebkitTextStroke: '2px black', // Ink saving outline for text
                            } : (colorTheme === 'rainbow' ? {
                                backgroundImage: 'linear-gradient(45deg, #ef4444, #f97316, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent'
                            } : {
                                color: theme.primary
                            }))
                        }}
                    >
                        {number}
                    </div>
                </div>

                {/* Icons Grid */}
                <div className="w-full py-2">
                    <p className="text-center text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">
                        {number === 0 ? 'Zero means nothing to count!' : t('pages.counting.countIcons', { name: iconData.name })}
                    </p>
                    <div className="grid grid-cols-5 gap-6 max-w-sm mx-auto place-items-center min-h-[100px]">
                        {renderIcons()}
                    </div>
                </div>

                {/* Word Tracing Section */}
                <div className="w-full text-center mt-auto border-t-2 border-slate-100 pt-8">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">{t('pages.counting.traceWord')}</p>
                    <div
                        className="text-[80px] leading-none mb-4"
                        style={{
                            fontFamily: "'Learning Curve Dashed', sans-serif",
                            color: isOutlineMode ? '#000000' : theme.primary,
                            opacity: isOutlineMode ? 1 : 0.8
                        }}
                    >
                        {NUMBER_NAMES[number]}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full mt-6 flex justify-between items-end border-t border-slate-50 pt-4">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© wizqo.com • Free Educational Resources</p>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                </div>
            </div>
        </div>
    );
};


export default function CountingWorksheetsPage() {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [selectedNumber, setSelectedNumber] = useState<number>(5);
    const [iconTheme, setIconTheme] = useState<IconTheme>('dinosaurs');
    const [colorTheme, setColorTheme] = useState<ColorTheme>('rainbow');
    const [isOutlineMode, setIsOutlineMode] = useState<boolean>(false);
    const [childName, setChildName] = useState<string>('');

    // SEO Data
    const seoData = getWorksheetSEOBySlug('counting-numbers-generator');

    const handleDownloadPDF = async () => {
        try {
            const element = document.getElementById('counting-preview-single');
            if (!element) return;

            // Apply print class for safety (though template handles styles)
            element.classList.add('printing');
            toast({ title: 'Generating...', description: 'Preparing your high-quality PDF.' });

            await generateWorksheetPDF(element, {
                filename: `wizqo-counting-${selectedNumber}${childName ? `-${childName}` : ''}.pdf`,
                scale: 3.5,
                docTitle: `Counting Practice - ${selectedNumber}`
            });

            trackWorksheetDownload('counting-numbers-generator', `Counting Worksheets (${selectedNumber})`, 'CountingWorksheetsPage', 'Pre-K');
            toast({ title: 'Success!', description: 'Your counting worksheet is ready.' });
        } catch (err) {
            console.error('PDF Error:', err);
            toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
        } finally {
            const element = document.getElementById('counting-preview-single');
            if (element) element.classList.remove('printing');
        }
    };

    const handleDownloadWorkbook = async () => {
        try {
            const element = document.getElementById('workbook-container');
            if (!element) return;

            toast({ title: 'Building Workbook...', description: 'Generating 11-page workbook (0-10). This may take a moment.' });

            // Ensure the container is "visible" for capture (it's off-screen)
            // No class manipulation needed as it's static

            await generateWorksheetPDF(element, {
                filename: `wizqo-counting-workbook-0-10${childName ? `-${childName}` : ''}.pdf`,
                scale: 3.5, // High quality
                docTitle: `Counting Workbook 0-10`,
                packSections: false // Ensure each uses a full page
            });

            trackWorksheetDownload('counting-numbers-generator', `Workbook 0-10`, 'CountingWorksheetsPage', 'Pre-K');
            toast({ title: 'Workbook Ready!', description: 'Your 0-10 workbook has been downloaded.' });

        } catch (err) {
            console.error('Workbook PDF Error:', err);
            toast({ title: 'Error', description: 'Failed to generate Workbook.', variant: 'destructive' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEOMetaTags
                title={seoData?.title || 'Free Counting Numbers Worksheets & Tracing Generator (1-10)'}
                description={seoData?.metaDescription || 'Create unlimited, fun, and colorful math worksheets for your child in seconds!'}
                keywords={seoData?.keywords}
                ogImage={seoData?.image}
                canonicalUrl="https://wizqo.com/worksheets/counting-numbers-generator"
            />

            <UnifiedNavigation />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6 print:hidden">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h1 className="text-2xl font-black text-slate-800 mb-2">
                                {t('pages.counting.title')}
                            </h1>
                            <p className="text-slate-500 text-sm mb-6 font-medium">
                                {t('pages.counting.subtitle')}
                            </p>

                            {/* Personalization: Child's Name */}
                            <div className="space-y-3 mb-6">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Personalize (Optional)</Label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter child's name..."
                                        value={childName}
                                        onChange={(e) => setChildName(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-purple-500 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    />
                                    {childName && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-purple-400 bg-purple-50 px-2 py-1 rounded-md">
                                            Magic Added ✨
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                <div className="space-y-6">
                                    {/* Number Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('pages.counting.selectNumber')}</Label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => setSelectedNumber(num)}
                                                    className={`h-10 rounded-xl font-bold transition-all ${selectedNumber === num
                                                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Outline Mode Toggle */}
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-slate-700">Ink Saving Mode</Label>
                                            <p className="text-xs text-slate-500">Black & white outlines for coloring</p>
                                        </div>
                                        <Switch
                                            checked={isOutlineMode}
                                            onCheckedChange={setIsOutlineMode}
                                            className="data-[state=checked]:bg-purple-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Icon Theme */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('pages.counting.chooseTheme')}</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(Object.keys(ICONS) as IconTheme[]).map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setIconTheme(key)}
                                                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${iconTheme === key
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                >
                                                    <span className="text-2xl">{ICONS[key].icon}</span>
                                                    <span className="text-[10px] font-bold uppercase text-slate-500">{ICONS[key].name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Theme */}
                                    <div className={`space-y-3 transition-opacity duration-300 ${isOutlineMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('pages.counting.colorPalette')}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {(Object.keys(THEMES) as ColorTheme[]).map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setColorTheme(key)}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all ${colorTheme === key ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                                                        }`}
                                                    style={{
                                                        background: key === 'rainbow'
                                                            ? 'linear-gradient(45deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)'
                                                            : THEMES[key].primary
                                                    }}
                                                    title={THEMES[key].name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-8">
                                {/* Single Download */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => window.print()}
                                        className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold shadow-lg"
                                    >
                                        <Printer className="w-4 h-4 mr-2" /> {t('pages.counting.printNow')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDownloadPDF}
                                        className="flex-1 h-12 rounded-2xl border-2 border-slate-200 font-bold hover:bg-slate-50"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> {t('pages.counting.savePdf')}
                                    </Button>
                                </div>

                                {/* Workbook Download Button */}
                                <Button
                                    onClick={handleDownloadWorkbook}
                                    className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black shadow-xl border-2 border-slate-900 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02]"
                                >
                                    <BookOpen className="w-5 h-5 group-hover:animate-bounce" />
                                    <span>Download Full Workbook (0-10)</span>
                                    <span className="bg-yellow-400 text-slate-900 text-[10px] px-2 py-0.5 rounded-full ml-auto">FREE</span>
                                </Button>
                            </div>
                        </div>

                        {/* Support Box */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 text-center">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">{t('pages.counting.shareMagic')}</p>
                            <SocialShare
                                url="https://wizqo.com/worksheets/counting-numbers-generator"
                                title={t('pages.counting.shareText', { number: selectedNumber })}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-12 xl:col-span-7" id="counting-preview-area">
                        <div id="counting-preview-single" className="sticky top-8">
                            <CountingWorksheetTemplate
                                number={selectedNumber}
                                iconTheme={iconTheme}
                                colorTheme={colorTheme}
                                isOutlineMode={isOutlineMode}
                                childName={childName}
                                t={t}
                            />
                        </div>
                    </div>
                </div>

                {/* Hidden Workbook Staging Area */}
                {/* Positioned absolute off-screen, but NOT 'display: none' so html2canvas can read it */}
                <div
                    id="workbook-container"
                    style={{ position: 'absolute', top: -10000, left: -10000, width: '8.5in' }}
                >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <div key={num} className="mb-8">
                            <CountingWorksheetTemplate
                                number={num}
                                iconTheme={iconTheme}
                                colorTheme={colorTheme}
                                isOutlineMode={isOutlineMode}
                                childName={childName}
                                t={t}
                            />
                        </div>
                    ))}
                </div>

                {/* SEO Content Section */}
                <div className="mt-20 prose prose-slate max-w-none print:hidden">
                    <div dangerouslySetInnerHTML={{ __html: seoData?.richContent || '' }} />
                </div>
            </main>

            <Footer />

            {/* Print-เฉพาะ styles */}
            <style>{`
        @media print {
            @page {
                size: letter portrait;
                margin: 0;
            }
            body {
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            nav, footer, .print\\:hidden { display: none !important; }
            main { padding: 0 !important; margin: 0 !important; max-width: none !important; }

            #counting-preview-area {
                width: 100% !important;
                margin: 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
            }
             /* When printing normally (CTRL+P), we typically only print the visible one */
             #workbook-container { display: none !important; }
        }
      `}</style>
        </div>
    );
}
