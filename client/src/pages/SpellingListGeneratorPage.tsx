import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { useTranslation } from '@/context/TranslationContext';
import { Download, Printer, Info, Plus, X, List, Type, Palette, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import jsPDF from 'jspdf';
import { hexToRgb } from '@/utils/pdfHelpers';
import { trackWorksheetDownload } from '@/utils/analytics';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';

type ColorTheme = 'classic' | 'rainbow' | 'ocean' | 'candy' | 'forest' | 'sunset';
type DecorationType = 'none' | 'stars' | 'hearts' | 'flower';
type FontStyle = 'dotted' | 'cursive' | 'print' | 'bubble';

const THEMES: Record<ColorTheme, {
    name: string;
    primary: string; // Baseline color
    secondary: string; // Guideline color
    text: string; // Default text color
    dots: string; // Guide dot color
    bg: string; // Sheet background tint
    rainbow?: boolean;
}> = {
    classic: { name: 'Classic Blue', primary: '#94a3b8', secondary: '#cbd5f5', text: '#94a3b8', dots: '#34d399', bg: '#f8fafc' },
    rainbow: { name: 'Rainbow', primary: '#cbd5f1', secondary: '#e2e8f0', text: '#475569', dots: '#ec4899', bg: '#fffafb', rainbow: true },
    ocean: { name: 'Deep Sea', primary: '#0ea5e9', secondary: '#bae6fd', text: '#0369a1', dots: '#2DD4BF', bg: '#f0f9ff' },
    candy: { name: 'Cotton Candy', primary: '#db2777', secondary: '#fbcfe8', text: '#be185d', dots: '#a855f7', bg: '#fff1f2' },
    forest: { name: 'Magic Forest', primary: '#059669', secondary: '#d1fae5', text: '#065f46', dots: '#f59e0b', bg: '#f0fdf4' },
    sunset: { name: 'Warm Sunset', primary: '#ea580c', secondary: '#ffedd5', text: '#9a3412', dots: '#ef4444', bg: '#fff7ed' },
};

const RAINBOW_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function SpellingListGeneratorPage() {
    const { t } = useTranslation();
    const { toast } = useToast();

    React.useEffect(() => {
        // Add Fonts
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=ABeeZee&family=Cedarville+Cursive&family=Inter:wght@400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
      @font-face {
        font-family: 'Codystar';
        src: url('/fonts/codystar.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'LearningCurve';
        src: url('/fonts/learning_curve.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'LearningCurveDashed';
        src: url('/fonts/learning_curve_dashed.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'KGPrimaryDots';
        src: url('/fonts/kg_primary_dots.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'SchoolHandDotted';
        src: url('/fonts/SchoolHandDotted_v2.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @media print {
        @page { 
          size: 8.5in 11in; 
          margin: 0 !important; 
        }
        body { 
          background: white !important; 
          margin: 0 !important; 
          padding: 0 !important; 
        }
        nav, footer, .UnifiedNavigation, header, aside, button, .Button, .Label, .Switch, .ToggleGroup, .Card, .bg-amber-50, .mt-20 {
          display: none !important;
        }
        #spelling-sheet-preview {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 8.5in !important;
          height: 11in !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          box-shadow: none !important;
          z-index: 99999 !important;
          background: white !important;
          display: block !important;
        }
        /* Ensure the SVG inside takes full space */
        #spelling-sheet-preview svg {
          width: 100% !important;
          height: 100% !important;
        }
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // State
    const [words, setWords] = React.useState<string[]>(['Apple', 'Banana', 'Cherry']);
    const [newWord, setNewWord] = React.useState('');
    const [listTitle, setListTitle] = React.useState('My Spelling List');
    const [fontSize, setFontSize] = React.useState<number>(64);
    const [fontStyle, setFontStyle] = React.useState<FontStyle>('dotted');
    const [tracingType, setTracingType] = React.useState<'dotted' | 'faint'>('dotted');
    const [colorTheme, setColorTheme] = React.useState<ColorTheme>('classic');
    const [decoration, setDecoration] = React.useState<DecorationType>('stars');
    const [showGuidelines, setShowGuidelines] = React.useState(true);
    const [showStartDots, setShowStartDots] = React.useState(true);

    const addWord = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newWord.trim() && words.length < 20) {
            setWords([...words, newWord.trim()]);
            setNewWord('');
        } else if (words.length >= 20) {
            toast({
                title: "Limit Reached",
                description: "You can add up to 20 words per list.",
                variant: "destructive"
            });
        }
    };

    const removeWord = (index: number) => {
        setWords(words.filter((_, i) => i !== index));
    };

    const getBaselineOffset = (fs: number, style: FontStyle) => {
        if (style === 'dotted' || style === 'print') return fs * 0.16;
        if (style === 'cursive') return fs * 0.05;
        return 6;
    };

    const handleDownloadPDF = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter'
        });

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 36;
        const startY = 160;
        const theme = THEMES[colorTheme];
        const lineGap = fontSize * 1.8;

        // Load Fonts Asynchronously for PDF
        const fetchFontBase64 = async (path: string) => {
            const response = await fetch(path);
            const buffer = await response.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };

        const [codystarB64, cedarvilleB64, learningCurveDashedB64, learningCurveSolidB64, abeezeeB64, kgPrimaryDotsB64] = await Promise.all([
            fetchFontBase64('/fonts/codystar.ttf'),
            fetchFontBase64('/fonts/cedarville_cursive.ttf'),
            fetchFontBase64('/fonts/learning_curve_dashed.ttf'),
            fetchFontBase64('/fonts/learning_curve.ttf'),
            fetchFontBase64('/fonts/abeezee_regular.ttf'),
            fetchFontBase64('/fonts/kg_primary_dots.ttf'),
        ]);

        doc.addFileToVFS('Codystar.ttf', codystarB64);
        doc.addFont('Codystar.ttf', 'Codystar', 'normal');

        doc.addFileToVFS('Cedarville-Cursive.ttf', cedarvilleB64);
        doc.addFont('Cedarville-Cursive.ttf', 'Cedarville-Cursive', 'normal');

        doc.addFileToVFS('LearningCurve-Dashed.ttf', learningCurveDashedB64);
        doc.addFont('LearningCurve-Dashed.ttf', 'LearningCurve-Dashed', 'normal');

        doc.addFileToVFS('LearningCurve.ttf', learningCurveSolidB64);
        doc.addFont('LearningCurve.ttf', 'LearningCurve', 'normal');

        doc.addFileToVFS('ABeeZee.ttf', abeezeeB64);
        doc.addFont('ABeeZee.ttf', 'ABeeZee', 'normal');

        doc.addFileToVFS('KGPrimaryDots.ttf', kgPrimaryDotsB64);
        doc.addFont('KGPrimaryDots.ttf', 'KGPrimaryDots', 'normal');

        // Header Drawing
        const drawHeader = () => {
            const bgRGB = hexToRgb(theme.bg);
            doc.setFillColor(bgRGB.r, bgRGB.g, bgRGB.b);
            doc.rect(0, 0, pageW, pageH, 'F');

            // Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(28);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text(listTitle, pageW / 2, 70, { align: 'center' });

            // Branding
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text('Wizqo Spelling List Generator', margin, 30);
            doc.text('www.wizqo.com', pageW - margin, 30, { align: 'right' });
        };

        drawHeader();

        // Draw Words
        words.forEach((word, idx) => {
            const y = startY + (idx % 12) * lineGap; // Basic pagination logic
            if (idx > 0 && idx % 12 === 0) {
                doc.addPage();
                drawHeader();
            }

            const baselineY = y;
            const topY = y - fontSize * 0.7;
            const midY = y - fontSize * 0.35;

            // Guidelines
            if (showGuidelines) {
                const secRGB = hexToRgb(theme.secondary);
                doc.setDrawColor(secRGB.r, secRGB.g, secRGB.b);
                doc.setLineWidth(1);
                doc.setLineDashPattern([5, 5], 0);
                doc.line(margin, topY, pageW - margin, topY);
                doc.line(margin, midY, pageW - margin, midY);
            }

            // Baseline
            const primRGB = hexToRgb(theme.primary);
            doc.setDrawColor(primRGB.r, primRGB.g, primRGB.b);
            doc.setLineWidth(2);
            doc.setLineDashPattern([], 0);
            doc.line(margin, baselineY, pageW - margin, baselineY);

            // Start Dot
            if (showStartDots) {
                const dotRGB = hexToRgb(theme.dots);
                doc.setFillColor(dotRGB.r, dotRGB.g, dotRGB.b);
                doc.circle(margin + 10, baselineY - fontSize * 0.2, 3, 'F');
            }

            // Word Text
            doc.setFontSize(fontSize);

            // Font selection logic
            if (fontStyle === 'cursive') {
                doc.setFont('LearningCurve-Dashed', 'normal');
            } else if (fontStyle === 'bubble') {
                doc.setFont('Codystar', 'normal');
            } else if (fontStyle === 'dotted') {
                doc.setFont('KGPrimaryDots', 'normal');
            } else {
                doc.setFont('ABeeZee', 'normal');
            }

            const textColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
            const textRGB = hexToRgb(textColor);
            doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);

            doc.text(word, margin + 25, baselineY - getBaselineOffset(fontSize, fontStyle));
        });

        doc.save(`${listTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        trackWorksheetDownload('spelling-generator', 'spelling-list', 'spelling-generator', 'writing');

        toast({
            title: "PDF Generated!",
            description: "Your spelling list is ready to print.",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans" style={{ backgroundColor: THEMES[colorTheme].bg }}>
            {(() => {
                const seo = HUB_SEO_DATA['spelling-list-generator'] || {};
                return (
                    <SEOMetaTags
                        title={seo.title || "Free Spelling List Generator | Create Custom Spelling Worksheets | Wizqo"}
                        description={seo.metaDescription || "Create personalized spelling list worksheets for kids (K-5). Choose from dotted, cursive, or bubble fonts. 100% free to customize and print as PDF."}
                        keywords={seo.keywords || "spelling list generator, custom spelling worksheets, handwriting practice, spelling words for kids, free printable spelling sheets"}
                        ogImage={seo.image || "/images/spelling-generator-seo.png"}
                        canonicalUrl="https://wizqo.com/worksheets/spelling-list-generator"
                    />
                );
            })()}

            {(() => {
                const canonical = "https://wizqo.com/worksheets/spelling-list-generator";
                const breadcrumbLd = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
                        { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
                        { "@type": "ListItem", position: 3, name: "Spelling List Generator", item: canonical }
                    ]
                } as const;
                const softwareLd = {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "Wizqo Spelling List Generator",
                    operatingSystem: "Any",
                    applicationCategory: "EducationalApplication",
                    image: "https://wizqo.com/images/spelling-generator-seo.png",
                    screenshot: "https://wizqo.com/images/spelling-generator-seo.png",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD"
                    },
                    featureList: "Custom word lists, Dotted tracing fonts, Cursive support, Instant PDF download"
                } as const;
                const faqLd = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: [
                        {
                            "@type": "Question",
                            name: "Can I create my own spelling lists?",
                            acceptedAnswer: { "@type": "Answer", text: "Yes! You can add up to 20 custom words to create a personalized spelling practice sheet." }
                        },
                        {
                            "@type": "Question",
                            name: "Is the Spelling List Generator free?",
                            acceptedAnswer: { "@type": "Answer", text: "Absolutely. Like all Wizqo resources, the generator is 100% free for teachers and parents." }
                        }
                    ]
                } as const;
                return (
                    <>
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
                    </>
                );
            })()}

            <UnifiedNavigation />

            <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Controls Panel */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                                    <List className="w-5 h-5 text-indigo-500" />
                                    Customize Your List
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">

                                {/* Word Input */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Word (Max 20)
                                    </Label>
                                    <form onSubmit={addWord} className="flex gap-2">
                                        <Input
                                            value={newWord}
                                            onChange={(e) => setNewWord(e.target.value)}
                                            placeholder="Enter a word..."
                                            className="flex-grow border-slate-200 focus:ring-indigo-500"
                                        />
                                        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                            Add
                                        </Button>
                                    </form>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {words.map((word, idx) => (
                                            <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                                {word}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => removeWord(idx)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Title Input */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold">List Title</Label>
                                    <Input
                                        value={listTitle}
                                        onChange={(e) => setListTitle(e.target.value)}
                                        placeholder="e.g. Weekly Spelling"
                                        className="border-slate-200"
                                    />
                                </div>

                                {/* Font Styles */}
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Font Style
                                    </Label>
                                    <ToggleGroup
                                        type="single"
                                        value={fontStyle}
                                        onValueChange={(v) => v && setFontStyle(v as FontStyle)}
                                        className="justify-start"
                                    >
                                        <ToggleGroupItem value="dotted" className="px-4">Dotted</ToggleGroupItem>
                                        <ToggleGroupItem value="cursive" className="px-4">Cursive</ToggleGroupItem>
                                        <ToggleGroupItem value="bubble" className="px-4">Bubble</ToggleGroupItem>
                                        <ToggleGroupItem value="print" className="px-4">Print</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            Size ({fontSize}px)
                                        </Label>
                                    </div>
                                    <Slider
                                        value={[fontSize]}
                                        min={32}
                                        max={120}
                                        step={1}
                                        onValueChange={([v]) => setFontSize(v)}
                                        className="py-4"
                                    />
                                </div>

                                {/* Visual Settings */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium cursor-pointer" htmlFor="guidelines">Show Guidelines</Label>
                                        <Switch id="guidelines" checked={showGuidelines} onCheckedChange={setShowGuidelines} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium cursor-pointer" htmlFor="startdots">Show Starting Dots</Label>
                                        <Switch id="startdots" checked={showStartDots} onCheckedChange={setShowStartDots} />
                                    </div>
                                </div>

                                {/* Themes */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Palette className="w-4 h-4" /> Theme
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(Object.keys(THEMES) as ColorTheme[]).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setColorTheme(t)}
                                                className={`p-2 rounded-md border-2 transition-all ${colorTheme === t ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: THEMES[t].primary }} />
                                                <span className="text-[10px] uppercase font-bold text-slate-600">{THEMES[t].name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 space-y-3">
                                    <Button
                                        onClick={handleDownloadPDF}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg shadow-md"
                                    >
                                        <Download className="mr-2 w-5 h-5" /> Download PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.print()}
                                        className="w-full h-12 border-slate-200 text-slate-600"
                                    >
                                        <Printer className="mr-2 w-5 h-5" /> Quick Print
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-amber-800">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-xs">
                                <strong>Pro Tip:</strong> Use the "Dotted" font for beginners to practice tracing, or "Cursive" for advanced students.
                            </p>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="w-full lg:w-2/3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Live Preview
                            </h2>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Letter Format (8.5" x 11")</span>
                        </div>

                        {/* The SVG Preview */}
                        <div
                            id="spelling-sheet-preview"
                            className="w-full aspect-[8.5/11] bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200"
                            style={{
                                fontFamily: fontStyle === 'cursive' ? 'LearningCurveDashed' :
                                    fontStyle === 'bubble' ? 'Codystar' :
                                        fontStyle === 'dotted' ? 'SchoolHandDotted' : 'ABeeZee'
                            }}
                        >
                            <PreviewSVG
                                words={words}
                                title={listTitle}
                                theme={THEMES[colorTheme]}
                                fontSize={fontSize}
                                fontStyle={fontStyle}
                                showGuidelines={showGuidelines}
                                showStartDots={showStartDots}
                            />
                        </div>
                    </div>
                </div>

                {(() => {
                    const seo = HUB_SEO_DATA['spelling-list-generator'];
                    if (seo?.richContent) {
                        return (
                            <div
                                className="mt-20 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm"
                                dangerouslySetInnerHTML={{ __html: seo.richContent }}
                            />
                        );
                    }
                    return (
                        <section className="mt-20 border-t border-slate-200 pt-16">
                            <div className="max-w-4xl mx-auto space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                        The Ultimate Free Spelling List Generator
                                    </h2>
                                    <p className="text-lg text-slate-600">
                                        Helping parents and teachers create better learning resources, one word at a time.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-slate-800">Why Use Our Generator?</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Memorizing spelling words can be challenging for young learners. Our generator makes it fun and interactive by allowing you to create custom worksheets that match your student's level. Whether you need simple print for kindergarten or fluent cursive for 5th grade, we've got you covered.
                                        </p>
                                        <ul className="space-y-2">
                                            {[
                                                "Custom word lists tailored to your curriculum",
                                                "Choose from tracing, cursive, or bubble fonts",
                                                "Beautiful color themes to keep kids engaged",
                                                "Free PDF downloads and easy printing"
                                            ].map((feat, i) => (
                                                <li key={i} className="flex items-center gap-2 text-slate-700 text-sm italic">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-slate-800">Tips for Spelling Success</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Research shows that "active writing" is more effective for memory retention than just reading. Use the **Tracing Mode (Dotted)** daily to build muscle memory. Once confident, switch to **Print Mode** to let them write independently below the guidelines.
                                        </p>
                                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <p className="text-sm text-indigo-900">
                                                <strong>Recommended:</strong> Start with 5-10 words per week to avoid overwhelming the student.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })()}
            </main>

            <Footer />
        </div>
    );
}

function PreviewSVG({ words, title, theme, fontSize, fontStyle, showGuidelines, showStartDots }: any) {
    const pageW = 612;
    const pageH = 792;
    const margin = 40;
    const startY = 160;
    const lineGap = fontSize * 1.8;

    return (
        <svg
            viewBox={`0 0 ${pageW} ${pageH}`}
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width={pageW} height={pageH} fill={theme.bg} />

            {/* Title */}
            <text
                x={pageW / 2}
                y={80}
                textAnchor="middle"
                className="font-bold fill-slate-800"
                style={{ fontSize: '32px', fontFamily: 'Inter, sans-serif' }}
            >
                {title}
            </text>

            {/* Grid Lines and Words */}
            {words.map((word: string, idx: number) => {
                const y = startY + idx * lineGap;
                const midY = y - fontSize * 0.35;
                const topY = y - fontSize * 0.7;

                return (
                    <g key={idx}>
                        {/* Guidelines */}
                        {showGuidelines && (
                            <>
                                <line
                                    x1={margin} y1={topY} x2={pageW - margin} y2={topY}
                                    stroke={theme.secondary} strokeWidth="1" strokeDasharray="5,5"
                                />
                                <line
                                    x1={margin} y1={midY} x2={pageW - margin} y2={midY}
                                    stroke={theme.secondary} strokeWidth="1" strokeDasharray="5,5"
                                />
                            </>
                        )}

                        {/* Baseline */}
                        <line
                            x1={margin} y1={y} x2={pageW - margin} y2={y}
                            stroke={theme.primary} strokeWidth="2"
                        />

                        {/* Start Dot */}
                        {showStartDots && (
                            <circle cx={margin + 10} cy={y - fontSize * 0.2} r="3" fill={theme.dots} />
                        )}

                        {/* Word Text */}
                        <text
                            x={margin + 25}
                            y={y - (fontStyle === 'cursive' ? fontSize * 0.05 : fontSize * 0.16)}
                            className="fill-current"
                            style={{
                                fontSize: `${fontSize}px`,
                                color: theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text,
                                letterSpacing: '2px'
                            }}
                        >
                            {word}
                        </text>
                    </g>
                );
            })}

            {/* Watermark */}
            <text
                x={pageW - margin}
                y={pageH - 20}
                textAnchor="end"
                className="fill-slate-400"
                style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
            >
                Created with wizqo.com
            </text>
        </svg>
    );
}
