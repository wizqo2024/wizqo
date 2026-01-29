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
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trackWorksheetDownload } from '@/utils/analytics';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';
import { SocialShare } from '@/components/SocialShare';

type LineStyle = 'straight' | 'zigzag' | 'wavy';
type Thickness = 'thin' | 'thick';
type ColorTheme = 'classic' | 'ocean' | 'candy' | 'forest' | 'sunset';

const THEMES: Record<ColorTheme, { name: string; color: string; bg: string }> = {
    classic: { name: 'Classic Black', color: '#1e293b', bg: '#f8fafc' },
    ocean: { name: 'Deep Sea', color: '#0ea5e9', bg: '#f0f9ff' },
    candy: { name: 'Cotton Candy', color: '#db2777', bg: '#fff1f2' },
    forest: { name: 'Magic Forest', color: '#059669', bg: '#f0fdf4' },
    sunset: { name: 'Warm Sunset', color: '#ea580c', bg: '#fff7ed' },
};

export default function ScissorSkillsGeneratorPage() {
    const { t, language } = useTranslation();
    const { toast } = useToast();

    const [lineStyle, setLineStyle] = useState<LineStyle>('straight');
    const [thickness, setThickness] = useState<Thickness>('thick');
    const [theme, setTheme] = useState<ColorTheme>('classic');
    const [stripCount, setStripCount] = useState(6);

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
        const usableWidth = 800;
        const padding = 40;
        const contentWidth = usableWidth - (padding * 2);

        return (
            <div id="scissor-sheet-preview" className="bg-white shadow-2xl rounded-sm p-8 border border-slate-200 mx-auto transition-all duration-300 print:shadow-none print:border-none" style={{ width: '100%', maxWidth: '800px', aspectRatio: '8.5/11' }}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Scissor Skills Practice</h2>
                    <p className="text-sm text-slate-400 font-medium tracking-widest uppercase">www.wizqo.com</p>
                </div>

                <div className="space-y-16">
                    {Array.from({ length: stripCount }).map((_, i) => (
                        <div key={i} className="relative flex items-center group">
                            < Scissors className="absolute -left-12 text-slate-300 transform -rotate-45 group-hover:text-purple-400 transition-colors print_scissor_icon" size={24} />
                            <svg width="100%" height="60" viewBox={`0 0 ${contentWidth} 60`} className="overflow-visible">
                                {lineStyle === 'straight' && (
                                    <line
                                        x1="0" y1="30" x2={contentWidth} y2="30"
                                        stroke={activeTheme.color}
                                        strokeWidth={thickness === 'thick' ? 6 : 2}
                                        strokeDasharray="12, 8"
                                    />
                                )}
                                {lineStyle === 'zigzag' && (
                                    <path
                                        d={`M 0 30 ${Array.from({ length: 10 }).map((_, j) => `L ${(contentWidth / 10) * (j + 1)} ${j % 2 === 0 ? 0 : 60}`).join(' ')}`}
                                        fill="none"
                                        stroke={activeTheme.color}
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
                                        stroke={activeTheme.color}
                                        strokeWidth={thickness === 'thick' ? 6 : 2}
                                        strokeDasharray="12, 8"
                                    />
                                )}
                            </svg>
                        </div>
                    ))}
                </div>
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
                                        <ToggleGroupItem value="straight" className="flex-1 rounded-xl px-4 py-6 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all">Straight</ToggleGroupItem>
                                        <ToggleGroupItem value="zigzag" className="flex-1 rounded-xl px-4 py-6 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all">Zig-Zag</ToggleGroupItem>
                                        <ToggleGroupItem value="wavy" className="flex-1 rounded-xl px-4 py-6 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900 border-2 hover:bg-slate-50 transition-all">Wavy</ToggleGroupItem>
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
                                        min={3} max={10} step={1}
                                        onValueChange={(vals: number[]) => setStripCount(vals[0])}
                                        className="py-4"
                                    />
                                </div>

                                <div className="pt-6 space-y-3">
                                    <Button onClick={generatePDF} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl text-lg font-bold flex gap-2">
                                        <Download size={20} /> Download PDF
                                    </Button>
                                    <Button variant="outline" onClick={handlePrint} className="w-full py-6 rounded-xl text-lg font-medium flex gap-2">
                                        <Printer size={20} /> Print Directly
                                    </Button>
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
                        <div className="sticky top-24 bg-slate-100 p-8 sm:p-12 rounded-3xl border-4 border-dashed border-slate-200 print:bg-transparent print:border-none print:p-0 print:static">
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
