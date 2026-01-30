import React, { useState, useRef } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Printer, Star, Heart, Scissors, Car, Bike, Rocket } from 'lucide-react';
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

const ICONS: Record<IconTheme, { name: string; icon: string; label: string }> = {
    dinosaurs: { name: 'Dinosaurs', icon: '🦕', label: 'Dinosaur' },
    bunnies: { name: 'Bunnies', icon: '🐰', label: 'Bunny' },
    cars: { name: 'Cars', icon: '🏎️', label: 'Car' },
    stars: { name: 'Stars', icon: '⭐', label: 'Star' },
    hearts: { name: 'Hearts', icon: '❤️', label: 'Heart' },
    rockets: { name: 'Rockets', icon: '🚀', label: 'Rocket' },
};

const NUMBER_NAMES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

const RAINBOW_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function CountingWorksheetsPage() {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [selectedNumber, setSelectedNumber] = useState<number>(5);
    const [iconTheme, setIconTheme] = useState<IconTheme>('dinosaurs');
    const [colorTheme, setColorTheme] = useState<ColorTheme>('rainbow');
    const previewRef = useRef<HTMLDivElement>(null);

    const seoData = getWorksheetSEOBySlug('counting-numbers-generator');

    const handleDownloadPDF = async () => {
        try {
            const element = document.getElementById('counting-preview-svg');
            if (!element) return;

            toast({ title: 'Generating...', description: 'Preparing your high-quality PDF.' });

            await generateWorksheetPDF(element, {
                filename: `wizqo-counting-${selectedNumber}.pdf`,
                scale: 3.5,
                docTitle: `Counting Practice - ${selectedNumber}`
            });

            trackWorksheetDownload('counting-numbers-generator', `Counting Worksheets (${selectedNumber})`, 'CountingWorksheetsPage', 'Pre-K');
            toast({ title: 'Success!', description: 'Your counting worksheet is ready.' });
        } catch (err) {
            console.error('PDF Error:', err);
            toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
        }
    };

    const renderIcons = () => {
        const icons = [];
        const iconData = ICONS[iconTheme];
        for (let i = 0; i < selectedNumber; i++) {
            icons.push(
                <div key={i} className="text-4xl sm:text-6xl animate-in zoom-in duration-300 fill-mode-both" style={{ animationDelay: `${i * 50}ms` }}>
                    {iconData.icon}
                </div>
            );
        }
        return icons;
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
                    <div className="lg:col-span-5 space-y-6 print:hidden">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h1 className="text-2xl font-black text-slate-800 mb-2">
                                {t('counting.title')}
                            </h1>
                            <p className="text-slate-500 text-sm mb-6 font-medium">
                                {t('counting.subtitle')}
                            </p>

                            {/* Number Selection */}
                            <div className="space-y-3 mb-6">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('counting.selectNumber')}</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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

                            {/* Icon Theme */}
                            <div className="space-y-3 mb-6">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('counting.chooseTheme')}</Label>
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
                            <div className="space-y-3 mb-8">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('counting.colorPalette')}</Label>
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

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => window.print()}
                                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold shadow-lg"
                                >
                                    <Printer className="w-4 h-4 mr-2" /> {t('counting.printNow')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDownloadPDF}
                                    className="flex-1 h-12 rounded-2xl border-2 border-slate-200 font-bold hover:bg-slate-50"
                                >
                                    <Download className="w-4 h-4 mr-2" /> {t('counting.savePdf')}
                                </Button>
                            </div>
                        </div>

                        {/* Support Box */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 text-center">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">{t('counting.shareMagic')}</p>
                            <SocialShare
                                url="https://wizqo.com/worksheets/counting-numbers-generator"
                                title={t('counting.shareText', { number: selectedNumber })}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-7" id="counting-preview-area">
                        <div className="sticky top-8 bg-white rounded-sm shadow-2xl border border-slate-200 aspect-[8.5/11] p-12 flex flex-col items-center overflow-hidden worksheet-section" id="counting-preview-svg">
                            {/* Header */}
                            <div className="w-full text-center border-b-2 border-slate-100 pb-6 mb-8 relative">
                                <div className="absolute left-0 top-0 text-slate-200">
                                    <Star className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Counting Practice</h2>
                                <div className="flex justify-center items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                        WIZQO MAGIC MATH
                                    </span>
                                </div>
                            </div>

                            {/* Big Number Section */}
                            <div className="flex-1 w-full flex flex-col items-center justify-between">
                                <div className="text-center">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">{t('counting.traceNumber')}</p>
                                    <div
                                        className="text-[200px] leading-[1] font-normal relative"
                                        style={{
                                            fontFamily: "'KG Primary Dots', sans-serif",
                                            color: colorTheme === 'rainbow' ? '#fdba74' : THEMES[colorTheme].primary,
                                            // Fallback for PDF if color is transparent
                                            // backgroundImage: colorTheme === 'rainbow' ? 'linear-gradient(45deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)' : 'none',
                                            // backgroundClip: colorTheme === 'rainbow' ? 'text' : 'border-box',
                                        }}
                                    >
                                        {selectedNumber}
                                    </div>
                                </div>

                                {/* Icons Grid */}
                                <div className="w-full py-8">
                                    <p className="text-center text-xs font-bold uppercase text-slate-400 mb-6 tracking-widest">
                                        {t('counting.countIcons', { name: ICONS[iconTheme].name })}
                                    </p>
                                    <div className="grid grid-cols-5 gap-6 max-w-sm mx-auto place-items-center">
                                        {renderIcons()}
                                    </div>
                                </div>

                                {/* Word Tracing Section */}
                                <div className="w-full text-center mt-auto border-t-2 border-slate-100 pt-8">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">{t('counting.traceWord')}</p>
                                    <div
                                        className="text-[80px] leading-none mb-4"
                                        style={{
                                            fontFamily: "'Learning Curve Dashed', sans-serif",
                                            color: THEMES[colorTheme].primary,
                                            opacity: 0.8
                                        }}
                                    >
                                        {NUMBER_NAMES[selectedNumber]}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="w-full mt-12 flex justify-between items-end border-t border-slate-50 pt-4">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© wizqo.com • Free Educational Resources</p>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
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
          nav, footer, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          #counting-preview-area { width: 100% !important; margin: 0 !important; }
          #counting-preview-svg { 
            width: 8.5in !important; 
            height: 11in !important; 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0.75in !important;
            margin: 0 !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          body { background: white !important; }
        }
      `}</style>
        </div>
    );
}
