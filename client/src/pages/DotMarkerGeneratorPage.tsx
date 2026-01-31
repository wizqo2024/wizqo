import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
    Download,
    Printer,
    Circle,
    Heart,
    Star,
    Smile,
    Check,
    RotateCcw,
    Sparkles,
    Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import jsPDF from 'jspdf';
import { trackWorksheetDownload } from '@/utils/analytics';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';
import { SocialShare } from '@/components/SocialShare';

// --- Types ---
type DotSize = 'small' | 'medium' | 'large';
type ShapeType = 'circle' | 'heart' | 'star' | 'dino';
type ColorTheme = 'classic' | 'rainbow' | 'pastel' | 'bw';

interface DotPoint {
    x: number;
    y: number;
    color?: string;
}

const THEMES: Record<ColorTheme, string[]> = {
    classic: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
    rainbow: ['#ff0000', '#ff8700', '#ffd300', '#deff0a', '#a1ff0a', '#0aff99', '#0aefff', '#147df5', '#580aff', '#be0aff'],
    pastel: ['#fecaca', '#bfdbfe', '#bbf7d0', '#fef3c7', '#ddd6fe'],
    bw: ['#000000'],
};

// --- Component ---
export default function DotMarkerGeneratorPage() {
    const { toast } = useToast();
    const { t } = useTranslation();

    // State
    const [childName, setChildName] = useState<string>('AVA');
    const [dotSize, setDotSize] = useState<number>(30); // Radius in pixels for preview
    const [spacing, setSpacing] = useState<number>(65); // Spacing between dots
    const [isStickerMode, setIsStickerMode] = useState<boolean>(false);
    const [colorTheme, setColorTheme] = useState<ColorTheme>('bw');
    const [selectedShape, setSelectedShape] = useState<ShapeType>('circle');
    const [stamperIcon, setStamperIcon] = useState<ShapeType | 'none'>('heart');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // --- Logic: Point Sampling ---
    const dots = useMemo(() => {
        if (typeof document === 'undefined') return []; // SSR safety

        const nameToRender = childName.trim().toUpperCase() || 'NAME';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return [];

        // Scale canvas to fit text
        const fontSize = 180; // Reduced slightly for better fit
        ctx.font = `bold ${fontSize}px "Inter", "Arial Black", sans-serif`;
        const textMetrics = ctx.measureText(nameToRender);

        canvas.width = textMetrics.width + 100;
        canvas.height = fontSize + 100;

        // Draw text
        ctx.fillStyle = 'black';
        ctx.font = `bold ${fontSize}px "Inter", "Arial Black", sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(nameToRender, 50, canvas.height / 2);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const sampledPoints: DotPoint[] = [];

        // Sampling loop
        const step = spacing;
        const colors = THEMES[colorTheme];

        for (let y = step / 2; y < canvas.height; y += step) {
            for (let x = step / 2; x < canvas.width; x += step) {
                const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
                if (index < 0 || index >= imgData.data.length) continue;
                const alpha = imgData.data[index + 3];

                if (alpha > 128) {
                    sampledPoints.push({
                        x,
                        y,
                        color: colors[sampledPoints.length % colors.length]
                    });
                }
            }
        }

        return sampledPoints;
    }, [childName, spacing, colorTheme]);

    // Center horizontally
    const dotsBounds = useMemo(() => {
        if (dots.length === 0) return { width: 0, height: 0, minX: 0, minY: 0 };
        const xs = dots.map(d => d.x);
        const ys = dots.map(d => d.y);
        return {
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys),
            minX: Math.min(...xs),
            minY: Math.min(...ys)
        };
    }, [dots]);

    // --- Helper: Render Shape ---
    const renderShape = (point: DotPoint, size: number, type: ShapeType = 'circle', overrideColor?: string) => {
        const color = isStickerMode ? (overrideColor || point.color) : 'none';
        const stroke = overrideColor || point.color || '#000';

        switch (type) {
            case 'heart':
                return (
                    <path
                        key={`${point.x}-${point.y}-${type}`}
                        d={`M ${point.x} ${point.y + size * 0.3}
               C ${point.x - size} ${point.y - size} ${point.x - size * 1.5} ${point.y + size * 0.5} ${point.x} ${point.y + size * 1.2}
               C ${point.x + size * 1.5} ${point.y + size * 0.5} ${point.x + size} ${point.y - size} ${point.x} ${point.y + size * 0.3}`}
                        fill={color}
                        stroke={stroke}
                        strokeWidth="3"
                    />
                );
            case 'star':
                return (
                    <path
                        key={`${point.x}-${point.y}-${type}`}
                        d={`M ${point.x} ${point.y - size}
               L ${point.x + size * 0.3} ${point.y - size * 0.3}
               L ${point.x + size} ${point.y - size * 0.2}
               L ${point.x + size * 0.5} ${point.y + size * 0.3}
               L ${point.x + size * 0.7} ${point.y + size}
               L ${point.x} ${point.y + size * 0.6}
               L ${point.x - size * 0.7} ${point.y + size}
               L ${point.x - size * 0.5} ${point.y + size * 0.3}
               L ${point.x - size} ${point.y - size * 0.2}
               L ${point.x - size * 0.3} ${point.y - size * 0.3} Z`}
                        fill={color}
                        stroke={stroke}
                        strokeWidth="3"
                    />
                );
            case 'dino':
                return (
                    <g key={`${point.x}-${point.y}-${type}`} transform={`translate(${point.x - size}, ${point.y - size}) scale(${size / 20})`}>
                        <path d="M10,30 Q15,5 30,10 Q45,15 40,35 Q35,55 20,50 Q5,45 10,30" fill={color} stroke={stroke} strokeWidth="3" />
                        <circle cx="30" cy="15" r="2" fill={stroke} />
                    </g>
                );
            default:
                return (
                    <circle
                        key={`${point.x}-${point.y}-${type}`}
                        cx={point.x}
                        cy={point.y}
                        r={size}
                        fill={color}
                        stroke={stroke}
                        strokeWidth="3"
                    />
                );
        }
    };

    // --- Actions ---
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleDownloadPDF = async () => {
        if (!svgRef.current) return;
        setIsGenerating(true);

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [842, 595] // A4 landscape in px
            });

            // Simple implementation: clone SVG, scale it, and draw
            // For a better result, we might want to iterate points directly into PDF
            const svg = svgRef.current;
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                canvas.width = 1684; // 2x for quality
                canvas.height = 1190;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 0, 0, 842, 595, undefined, 'FAST');
                doc.save(`dot-marker-${childName.toLowerCase()}.pdf`);
                URL.revokeObjectURL(url);
                setIsGenerating(false);
                trackWorksheetDownload('dot-marker-generator', `Dot Marker - ${childName}`, 'dot-marker-generator', 'pre-k');
            };
            img.src = url;
        } catch (e) {
            console.error(e);
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-purple-100">
            {(() => {
                const seo = HUB_SEO_DATA['dot-marker-generator'] || {};
                return (
                    <SEOMetaTags
                        title={seo.title || "Free Dot Marker Name Generator | Create Personalized Do-A-Dot Worksheets"}
                        description={seo.metaDescription || "Make personalized dot marker worksheets for toddlers and preschoolers. Perfect for Bingo Daubers, stickers, and fine motor skills. 100% Free PDF."}
                        keywords={seo.keywords || "dot marker generator, do a dot worksheets, bingo dauber printables, name tracing"}
                        ogImage={seo.image || "/images/dot-marker-16x9.png"}
                        canonicalUrl="https://wizqo.com/worksheets/dot-marker-generator"
                    />
                );
            })()}

            {(() => {
                const canonical = "https://wizqo.com/worksheets/dot-marker-generator";
                const breadcrumbLd = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
                        { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
                        { "@type": "ListItem", position: 3, name: "Dot Marker Generator", item: canonical }
                    ]
                } as const;

                const softwareLd = {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "Wizqo Dot Marker Generator",
                    operatingSystem: "Any",
                    applicationCategory: "EducationalApplication",
                    image: [
                        "https://wizqo.com/images/dot-marker-16x9.png",
                        "https://wizqo.com/images/dot-marker-4x3.png",
                        "https://wizqo.com/images/dot-marker-1x1.png"
                    ],
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD"
                    },
                    featureList: "Dynamic dot scaling, Sticker mode support, Custom name sampling, High-res PDF export"
                } as const;

                return (
                    <>
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
                    </>
                );
            })()}
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
                <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">

                    {/* Left: Sidebar Controls */}
                    <aside className="sticky top-24 space-y-6 bg-white p-8 rounded-[32px] border-2 border-slate-50 shadow-xl shadow-slate-200/50 print:hidden lg:order-1">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                Personalization <Sparkles size={18} className="text-purple-400" />
                            </h2>
                            <p className="text-sm text-slate-400 font-medium">Configure your viral worksheet.</p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="space-y-3">
                                <Label htmlFor="childName" className="text-xs font-black uppercase tracking-widest text-slate-400">Child's Name</Label>
                                <Input
                                    id="childName"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value.slice(0, 12))}
                                    placeholder="Enter Name"
                                    className="h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-purple-600 focus:ring-0 text-lg font-bold text-slate-700 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-8 py-2">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Dot Size (px)</Label>
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">{dotSize}px</span>
                                    </div>
                                    <Slider
                                        value={[dotSize]}
                                        onValueChange={(v) => setDotSize(v[0])}
                                        min={10} max={50} step={1}
                                        className="accent-purple-600"
                                    />
                                    <p className="text-[10px] text-slate-400 italic flex items-center gap-1 leading-tight">
                                        <Info size={10} /> 18-20px is perfect for standard Bingo Markers.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Dot Spacing</Label>
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">{spacing}px</span>
                                    </div>
                                    <Slider
                                        value={[spacing]}
                                        onValueChange={(v) => setSpacing(v[0])}
                                        min={40} max={120} step={5}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Color Theme</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(THEMES) as ColorTheme[]).map((theme) => (
                                        <button
                                            key={theme}
                                            onClick={() => setColorTheme(theme)}
                                            className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border-2 
                        ${colorTheme === theme ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-purple-200'}`}
                                        >
                                            {theme.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Icon Stamper (Decoration)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(['none', 'heart', 'star', 'dino'] as const).map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setStamperIcon(icon)}
                                            className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border-2 
                        ${stamperIcon === icon ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-amber-200'}`}
                                        >
                                            {icon.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Dot Shape</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(['circle', 'heart', 'star'] as const).map((shape) => (
                                        <button
                                            key={shape}
                                            onClick={() => setSelectedShape(shape)}
                                            className={`h-10 px-4 rounded-xl text-xs font-bold transition-all border-2 
                        ${selectedShape === shape ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-purple-200'}`}
                                        >
                                            {shape.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black text-amber-800 uppercase tracking-tight">Sticker Mode</Label>
                                    <p className="text-[10px] text-amber-600/80 font-bold leading-none">Fill dots for round stickers</p>
                                </div>
                                <Switch
                                    checked={isStickerMode}
                                    onCheckedChange={setIsStickerMode}
                                    className="data-[state=checked]:bg-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Button
                                    onClick={handlePrint}
                                    className="h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-lg shadow-slate-200 text-sm group"
                                >
                                    <Printer className="mr-2 group-hover:scale-110 transition-transform" size={18} /> PRINT NOW
                                </Button>
                                <Button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg shadow-purple-200 text-sm group"
                                >
                                    <Download className={`mr-2 ${isGenerating ? 'animate-bounce' : 'group-hover:translate-y-0.5'} transition-transform`} size={18} />
                                    {isGenerating ? 'BUILDING...' : 'SAVE PDF'}
                                </Button>
                            </div>

                            <button
                                onClick={() => {
                                    setChildName('NAME');
                                    setDotSize(30);
                                    setSpacing(65);
                                    setColorTheme('bw');
                                    setIsStickerMode(false);
                                }}
                                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors py-2"
                            >
                                <RotateCcw size={14} /> RESET DEFAULTS
                            </button>
                        </div>
                    </aside>

                    {/* Right: Preview Area */}
                    <div className="space-y-8 lg:order-2">
                        <div className="text-center lg:text-left space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-bold animate-pulse">
                                <Sparkles size={16} /> 2026 Viral Tool Logic
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                                Do-A-Dot <span className="text-purple-600">Name Generator</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl">
                                The internet's only dynamic dot sampler. Professional layout for Bingo Markers, Q-Tips, and Stickers.
                            </p>
                        </div>

                        {/* SVG Canvas Preview */}
                        <div className="relative group bg-white rounded-3xl border-2 border-slate-100 shadow-2xl shadow-purple-500/5 aspect-[1.41] overflow-hidden print:shadow-none print:border-0 print:rounded-none">
                            <div className="absolute inset-0 bg-[#FAFAFA] opacity-50 print:bg-white" />

                            <svg
                                ref={svgRef}
                                viewBox="0 0 1200 800"
                                className="relative w-full h-full p-12 drop-shadow-sm transition-all duration-300 pointer-events-none"
                            >
                                {/* Branding footer in preview */}
                                <text x="1150" y="780" textAnchor="end" className="fill-slate-300 text-[12px] font-bold uppercase tracking-widest print:hidden">
                                    Made with Wizqo.com
                                </text>

                                {/* The Dots */}
                                <g className="dots-container">
                                    {dots.map(point => renderShape(point, dotSize))}
                                </g>

                                {/* Dedicated Icon Stamper at the bottom */}
                                {stamperIcon !== 'none' && (
                                    <g transform="translate(600, 650) scale(4)" className="opacity-10 print:opacity-100">
                                        <g transform="translate(-10, -10)">
                                            {renderShape({ x: 0, y: 0 }, 15, stamperIcon, '#e2e8f0')}
                                        </g>
                                    </g>
                                )}
                            </svg>

                            {/* Grid Lines Overlay for Realism */}
                            <div className="absolute inset-0 pointer-events-none opacity-5 print:hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
                        </div>

                        {/* Features Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'High Resolution', icon: Check },
                                { label: 'Printer Friendly', icon: Printer },
                                { label: 'Sticker Ready', icon: Sparkles },
                                { label: 'Instant PDF', icon: Download },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 text-sm font-bold shadow-sm">
                                    <f.icon className="text-purple-500" size={16} />
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Copy Section (Required for Google Image Trap) */}
                <div className="mt-24 border-t-2 border-slate-50 pt-16">
                    <div className="bg-white p-12 rounded-[48px] border-2 border-slate-50 shadow-sm space-y-12">
                        <section className="max-w-3xl mx-auto space-y-6">
                            <h2 className="text-3xl font-black text-slate-900">Why Use This Dot Marker Generator?</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Traditional PDFs are static and rarely match your child's name perfectly. Our
                                <strong> 2026 AI-Powered Sampling Logic</strong> ensures that every letter is
                                mapped with mathematical precision. This isn't just a worksheet; it's a technical fine
                                motor tool designed to prepare little hands for handwriting and penmanship.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                <div className="space-y-3 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black">1</div>
                                    <h3 className="font-black text-slate-800">Dynamic Scaling</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">Adjust the radius to fit your specific tools, from jumbo markers to tiny cotton swabs.</p>
                                </div>
                                <div className="space-y-3 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black">2</div>
                                    <h3 className="font-black text-slate-800">Sticker Chart Logic</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">Switch to Sticker Mode to create custom name reward charts for pincer grasp development.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
