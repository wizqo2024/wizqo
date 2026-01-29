import React, { useState, useMemo } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { useTranslation } from '@/context/TranslationContext';
import { Download, Printer, Scissors, Info, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trackWorksheetDownload, trackEvent } from '@/utils/analytics';
import { Star, Award, Zap, Palette, Trash2, Layout } from 'lucide-react';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';
import { SocialShare } from '@/components/SocialShare';

type LineStyle = 'straight' | 'zigzag' | 'wavy';
type Thickness = 'thin' | 'thick';
type ColorTheme = 'ocean' | 'candy' | 'forest' | 'sunset' | 'royal';
type MissionTheme = 'none' | 'animals' | 'space' | 'food' | 'transport';

const THEMES: Record<ColorTheme, { name: string, color: string }> = {
    ocean: { name: 'Deep Sea', color: '#0ea5e9' },
    candy: { name: 'Cotton Candy', color: '#db2777' },
    forest: { name: 'Magic Forest', color: '#059669' },
    sunset: { name: 'Warm Sunset', color: '#ea580c' },
    royal: { name: 'Royal Gold', color: '#B45309' },
};

const MISSIONS: Record<MissionTheme, { name: string, start: string, end: string }> = {
    none: { name: 'Simple', start: '', end: '' },
    animals: { name: 'Animal Feeding', start: '🥕', end: '🐰' },
    space: { name: 'Space Mission', start: '🚀', end: '🌕' },
    food: { name: 'Grocery Run', start: '🍎', end: '🧺' },
    transport: { name: 'Race Day', start: '🏎️', end: '🏁' },
};

export default function ScissorSkillsGeneratorPage() {
    const { t, language } = useTranslation();
    const { toast } = useToast();

    const [lineStyle, setLineStyle] = useState<LineStyle>('straight');
    const [thickness, setThickness] = useState<Thickness>('thick');
    const [theme, setTheme] = useState<ColorTheme>('candy');
    const [stripCount, setStripCount] = useState(5);
    const [mission, setMission] = useState<MissionTheme>('animals');
    const [isRainbow, setIsRainbow] = useState(false);
    const [showBadge, setShowBadge] = useState(true);

    const seo = HUB_SEO_DATA['scissor-skills-generator'] || {};

    const generatePDF = async () => {
        try {
            const previewElement = document.getElementById('scissor-sheet-preview');
            if (!previewElement) return;

            toast({ title: 'Generating...', description: 'Preparing your high-quality PDF.' });

            const canvas = await html2canvas(previewElement, {
                scale: 3, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('wizqo-scissor-skills.pdf');

            trackWorksheetDownload('scissor-skills-generator', 'Scissor Skills Practice', 'ScissorSkillsGeneratorPage', 'Pre-K');
            toast({ title: 'Success!', description: 'Your cutting practice sheet is ready.' });
        } catch (err) {
            console.error('PDF Generation Error:', err);
            toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
        }
    };

    const handlePrint = () => {
        try {
            const previewElement = document.getElementById('scissor-sheet-preview');
            if (!previewElement) return;

            // Simple win.print() is often better with robust @media print
            // But we use an iframe for targeted printing of ONLY the preview
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            // Clone the styles to the iframe
            const styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                    try {
                        return Array.from(styleSheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('');
                    } catch (e) {
                        return '';
                    }
                })
                .join('');

            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Wizqo Scissor Skills Practice</title>
                    <style>
                        ${styles}
                        @page { size: 8.5in 11in; margin: 0; }
                        body { margin: 0; padding: 0; background: #fff; }
                        #scissor-sheet-preview { 
                            width: 8.5in !important; 
                            height: 11in !important; 
                            max-width: none !important; 
                            margin: 0 !important; 
                            padding: 0.75in !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        .print-scissor-icon { display: block !important; }
                    </style>
                </head>
                <body>
                    ${previewElement.outerHTML}
                </body>
                </html>
            `);
            doc.close();

            const onIframeLoad = () => {
                setTimeout(() => {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                }, 500);
            };

            if (iframe.contentWindow?.document.readyState === 'complete') {
                onIframeLoad();
            } else {
                iframe.onload = onIframeLoad;
            }

            trackWorksheetDownload('scissor-skills-generator', 'Scissor Skills Practice (Print)', 'ScissorSkillsGeneratorPage', 'Pre-K');
        } catch (err) {
            console.error('Print Error:', err);
            toast({ title: 'Error', description: 'Failed to open print dialog.', variant: 'destructive' });
        }
    };

    const renderPreview = () => {
        const activeTheme = THEMES[theme as ColorTheme];
        const activeMission = MISSIONS[mission as MissionTheme];
        const contentWidth = 600;

        return (
            <div
                id="scissor-sheet-preview"
                className="bg-[#FFFDF5] w-full aspect-[8.5/11] shadow-2xl rounded-sm p-12 flex flex-col items-center relative overflow-hidden border-[12px] border-purple-200"
            >
                {/* Header */}
                <div className="text-center mb-12 w-full">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
                        <Star className="text-amber-400 fill-amber-400 animate-pulse" />
                        Scissor Skills Practice
                        <Star className="text-amber-400 fill-amber-400 animate-pulse" />
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                        Created with love at wizqo.com
                    </p>
                </div>

                {/* Strips */}
                <div className="flex-1 w-full space-y-12">
                    {Array.from({ length: stripCount }).map((_, i) => (
                        <div key={i} className="relative flex items-center group w-full px-8">
                            {/* Mission Start */}
                            <div className="absolute left-0 text-3xl z-10">
                                {activeMission.start || <Scissors className="text-slate-300 transform -rotate-45" size={24} />}
                            </div>

                            <svg width="100%" height="60" viewBox={`0 0 ${contentWidth} 60`} className="overflow-visible flex-1">
                                <defs>
                                    <linearGradient id={`rainbow-grad-${i}`} x1="0" y1="0" x2={contentWidth} y2="0" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#EF4444" />
                                        <stop offset="25%" stopColor="#F59E0B" />
                                        <stop offset="50%" stopColor="#10B981" />
                                        <stop offset="75%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                </defs>

                                {lineStyle === 'straight' && (
                                    <line
                                        x1="0" y1="30" x2={contentWidth} y2="30"
                                        stroke={isRainbow ? `url(#rainbow-grad-${i})` : activeTheme.color}
                                        strokeWidth={thickness === 'thick' ? 6 : 2}
                                        strokeDasharray="12, 8"
                                    />
                                )}
                                {lineStyle === 'zigzag' && (
                                    <path
                                        d={`M 0 30 ${Array.from({ length: 10 }).map((_, j) => {
                                            const x = (contentWidth / 10) * (j + 1);
                                            const y = j % 2 === 0 ? 0 : 60;
                                            return `L ${x} ${y}`;
                                        }).join(' ')}`}
                                        fill="none"
                                        stroke={isRainbow ? `url(#rainbow-grad-${i})` : activeTheme.color}
                                        strokeWidth={thickness === 'thick' ? 6 : 2}
                                        strokeDasharray="12, 8"
                                    />
                                )}
                                {lineStyle === 'wavy' && (
                                    <path
                                        d={`M 0 30 ${Array.from({ length: 6 }).map((_, j) => {
                                            const nextX = (contentWidth / 6) * (j + 1);
                                            const ctrlX1 = (contentWidth / 6) * j + (contentWidth / 24);
                                            const ctrlY1 = j % 2 === 0 ? 0 : 60;
                                            const ctrlX2 = (contentWidth / 6) * j + (3 * contentWidth / 24);
                                            const ctrlY2 = j % 2 === 0 ? 0 : 60;
                                            return `C ${ctrlX1} ${ctrlY1} ${ctrlX2} ${ctrlY2} ${nextX} 30`;
                                        }).join(' ')}`}
                                        fill="none"
                                        stroke={isRainbow ? `url(#rainbow-grad-${i})` : activeTheme.color}
                                        strokeWidth={thickness === 'thick' ? 6 : 2}
                                        strokeDasharray="12, 8"
                                    />
                                )}
                            </svg>

                            {/* Mission End */}
                            <div className="absolute right-0 text-3xl z-10">
                                {activeMission.end}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reward Badge */}
                {showBadge && (
                    <div className="mt-8 border-4 border-dashed border-amber-200 rounded-full p-6 flex flex-col items-center justify-center bg-white shadow-sm transform hover:scale-105 transition-transform duration-300">
                        <Award className="text-amber-500 mb-1" size={32} />
                        <span className="text-sm font-black text-slate-700">SCISSOR MASTER</span>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3].map(s => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase italic cursor-default">Cut & Paste Your Trophy!</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    nav, footer, .lg\\:col-span-4, .prose, .social-share-container, .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
                    .lg\\:col-span-8 { width: 100% !important; margin: 0 !important; }
                    #scissor-sheet-preview { 
                        width: 8.5in !important; 
                        height: 11in !important; 
                        max-width: none !important; 
                        margin: 0 auto !important; 
                        padding: 0.75in !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: white !important;
                    }
                    .rounded-3xl { border: none !important; padding: 0 !important; background: transparent !important; }
                    .border-dashed { border: none !important; }
                    .sticky { position: static !important; }
                    .print_scissor_icon { display: block !important; color: #cbd5e1 !important; }
                }
            ` }} />
            <SEOMetaTags
                title={seo.title}
                description={seo.metaDescription}
                keywords={seo.keywords}
                ogImage="/images/scissor-skills.png"
            />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "Wizqo Scissor Skills Generator",
                    "url": "https://wizqo.com/worksheets/scissor-skills-generator",
                    "description": seo.metaDescription,
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "All",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "author": {
                        "@type": "Organization",
                        "name": "Wizqo"
                    }
                })}
            </script>

            <UnifiedNavigation currentPage="worksheets" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24 print:hidden">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h1 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                <Scissors className="text-purple-600" />
                                Scissor Skills
                            </h1>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Generate unlimited cutting strips for preschoolers. Custom difficulty levels.
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Line Style</Label>
                                    <ToggleGroup type="single" value={lineStyle} onValueChange={(v: string | null) => v && setLineStyle(v as LineStyle)} className="justify-start gap-2">
                                        <ToggleGroupItem value="straight" className="flex-1 rounded-xl px-4 py-8 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all flex flex-col gap-2">
                                            <div className="h-0.5 w-8 bg-current opacity-40" />
                                            <span>Straight</span>
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="zigzag" className="flex-1 rounded-xl px-4 py-8 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all flex flex-col gap-2">
                                            <Zap size={16} className="opacity-40" />
                                            <span>Zig-Zag</span>
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="wavy" className="flex-1 rounded-xl px-4 py-8 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all flex flex-col gap-2">
                                            <Layout size={16} className="opacity-40" />
                                            <span>Wavy</span>
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mission Theme</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(MISSIONS).map(([key, data]) => (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setMission(key as MissionTheme);
                                                    trackEvent('scissor_theme_change', { theme: key });
                                                }}
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all shadow-sm ${mission === key ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                                            >
                                                <span className="text-xl">{data.start || '✂️'}</span>
                                                <span className="text-xs font-bold truncate">{data.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isRainbow ? 'bg-gradient-to-r from-red-400 to-purple-400' : 'bg-slate-200'}`}>
                                            <Palette className="text-white" size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-700">Rainbow Dash</span>
                                            <span className="text-[10px] text-slate-400 font-bold">Pinterest Favorite!</span>
                                        </div>
                                    </div>
                                    <ToggleGroup type="single" value={isRainbow ? 'on' : 'off'} onValueChange={(v: string | null) => setIsRainbow(v === 'on')}>
                                        <ToggleGroupItem value="on" className="rounded-lg px-4 py-1 flex-1 text-xs">ON</ToggleGroupItem>
                                        <ToggleGroupItem value="off" className="rounded-lg px-4 py-1 flex-1 text-xs">OFF</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty (Thickness)</Label>
                                    <ToggleGroup type="single" value={thickness} onValueChange={(v: string | null) => v && setThickness(v as Thickness)} className="justify-start gap-2">
                                        <ToggleGroupItem value="thick" className="flex-1 rounded-xl px-4 py-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border-2">Beginner (Thick)</ToggleGroupItem>
                                        <ToggleGroupItem value="thin" className="flex-1 rounded-xl px-4 py-2 data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-900 border-2">Precision (Thin)</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Theme</Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {Object.entries(THEMES).map(([key, value]) => (
                                            <button
                                                key={key}
                                                onClick={() => setTheme(key as ColorTheme)}
                                                title={value.name}
                                                className={`w-full aspect-square rounded-full border-2 transition-all ${theme === key ? 'ring-2 ring-purple-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                                style={{ backgroundColor: value.color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Strips Per Page</Label>
                                        <span className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-1 rounded">{stripCount}</span>
                                    </div>
                                    <Slider
                                        value={[stripCount]}
                                        min={2} max={8} step={1}
                                        onValueChange={(vals: number[]) => setStripCount(vals[0])}
                                        className="py-4"
                                    />
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Award size={10} /> Show Reward Badge
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={showBadge}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowBadge(e.target.checked)}
                                            className="accent-purple-600"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 social-share-container">
                                    <SocialShare
                                        url="https://wizqo.com/worksheets/scissor-skills-generator"
                                        title="Check out this free Preschool Scissor Skills Generator! ✂️"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="sticky top-24 bg-slate-100 p-8 sm:p-12 rounded-3xl border-4 border-dashed border-slate-200 print:bg-transparent print:border-none print:p-0 print:static group/preview">
                            {/* Action Buttons Overlay */}
                            <div className="absolute top-6 right-6 flex gap-3 z-30 print:hidden">
                                <Button onClick={generatePDF} size="sm" className="bg-slate-900/90 hover:bg-slate-800 text-white rounded-full px-4 py-5 shadow-lg backdrop-blur-sm transition-all hover:scale-105 flex gap-2">
                                    <Download size={18} /> <span className="hidden sm:inline">Download</span>
                                </Button>
                                <Button variant="outline" onClick={handlePrint} size="sm" className="bg-white/90 hover:bg-white text-slate-900 rounded-full px-4 py-5 shadow-lg backdrop-blur-sm transition-all hover:scale-105 flex gap-2">
                                    <Printer size={18} /> <span className="hidden sm:inline">Print</span>
                                </Button>
                            </div>

                            {renderPreview()}
                        </div>

                        {/* SEO Content Section */}
                        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 prose prose-slate max-w-none print:hidden">
                            <div dangerouslySetInnerHTML={{ __html: seo.richContent || '' }} />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
