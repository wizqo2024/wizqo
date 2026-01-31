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
    id?: string;
    x: number;
    y: number;
    color?: string;
    isIcon?: boolean;
}

const THEMES: Record<ColorTheme, string[]> = {
    classic: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
    rainbow: ['#ff0000', '#ff8700', '#ffd300', '#deff0a', '#a1ff0a', '#0aff99', '#0aefff', '#147df5', '#580aff', '#be0aff'],
    pastel: ['#fecaca', '#bfdbfe', '#bbf7d0', '#fef3c7', '#ddd6fe'],
    bw: ['#000000'],
};

// --- THE COORDINATE MAP: Defines the shape of every letter (5x7 grid) ---
const DOT_FONT: Record<string, number[][]> = {
    'A': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'B': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
    'C': [[0, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [0, 1, 1, 1, 1]],
    'D': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
    'E': [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
    'F': [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0]],
    'G': [[0, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    'H': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'I': [[0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0]],
    'J': [[0, 0, 1, 1, 1], [0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [1, 0, 0, 1, 0], [0, 1, 1, 0, 0]],
    'K': [[1, 0, 0, 0, 1], [1, 0, 1, 0, 0], [1, 0, 1, 0, 0], [1, 1, 0, 0, 0], [1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [1, 0, 0, 0, 1]],
    'L': [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
    'M': [[1, 0, 0, 0, 1], [1, 1, 0, 1, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'N': [[1, 0, 0, 0, 1], [1, 1, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'O': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    'P': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0]],
    'Q': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 1, 0], [0, 1, 1, 0, 1]],
    'R': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [1, 0, 0, 0, 1]],
    'S': [[0, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
    'T': [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    'U': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    'V': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
    'W': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 1, 0, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'X': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    'Y': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    'Z': [[1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
    '0': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 1, 1], [1, 0, 1, 0, 1], [1, 1, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    '1': [[0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0]],
    '2': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 1, 1, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
    '3': [[1, 1, 1, 1, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 1, 1, 1, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
    '4': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1]],
    '5': [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    '6': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    '7': [[1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    '8': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    '9': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
    'HEART': [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
    'STAR': [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [1, 0, 1, 0, 1]],
    'DINO': [[0, 0, 0, 1, 1], [0, 0, 0, 1, 1], [0, 0, 0, 1, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [0, 0, 1, 0, 1], [0, 0, 1, 0, 1]]
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

    // --- Logic: Point Generation (Using Coordinate Map) ---
    const { dots, totalWidth } = useMemo(() => {
        const safeText = childName.toUpperCase().replace(/[^A-Z0-9 ]/g, '') || 'NAME';
        const result: DotPoint[] = [];

        // Gap constants
        const dotSpacing = spacing;
        const letterSpacing = spacing * 1.5;

        let cursorX = 0;
        const colors = THEMES[colorTheme];

        safeText.split('').forEach((char) => {
            if (char === ' ') {
                cursorX += letterSpacing;
                return;
            }

            const matrix = DOT_FONT[char] || DOT_FONT['A'];

            // Loop through 5x7 grid
            matrix.forEach((row, rowIndex) => {
                row.forEach((isDot, colIndex) => {
                    if (isDot === 1) {
                        result.push({
                            id: `dot-${char}-${result.length}`,
                            x: cursorX + (colIndex * dotSpacing),
                            y: rowIndex * dotSpacing,
                            color: colors[result.length % colors.length]
                        });
                    }
                });
            });

            // Move cursor for next letter (5 columns + spacing)
            cursorX += (5 * dotSpacing) + letterSpacing;
        });

        // --- Logic Fix: Add Decoration Icon below the name ---
        if (stamperIcon !== 'none') {
            const iconKey = stamperIcon.toUpperCase() as keyof typeof DOT_FONT;
            const iconMatrix = DOT_FONT[iconKey];
            if (iconMatrix) {
                // Determine vertical start: 8 rows down from top (below text)
                const iconYStart = 8 * dotSpacing;
                // Center it horizontally relative to the total cursorX
                const iconWidth = iconMatrix[0].length;
                const iconXStart = (cursorX / 2) - ((iconWidth / 2) * dotSpacing);

                iconMatrix.forEach((row, rIndex) => {
                    row.forEach((isDot, cIndex) => {
                        if (isDot) {
                            result.push({
                                id: `icon-${rIndex}-${cIndex}`,
                                x: iconXStart + (cIndex * dotSpacing),
                                y: iconYStart + (rIndex * dotSpacing),
                                isIcon: true,
                                color: colors[result.length % colors.length]
                            });
                        }
                    });
                });
            }
        }

        return { dots: result, totalWidth: cursorX };
    }, [childName, spacing, stamperIcon, colorTheme]);

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
                        key={`${point.id || `${point.x}-${point.y}`}-${type}`}
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
                        key={`${point.id || `${point.x}-${point.y}`}-${type}`}
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
                    <g key={`${point.id || `${point.x}-${point.y}`}-${type}`} transform={`translate(${point.x - size}, ${point.y - size}) scale(${size / 20})`}>
                        <path d="M10,30 Q15,5 30,10 Q45,15 40,35 Q35,55 20,50 Q5,45 10,30" fill={color} stroke={stroke} strokeWidth="3" />
                        <circle cx="30" cy="15" r="2" fill={stroke} />
                    </g>
                );
            default:
                return (
                    <circle
                        key={`${point.id || `${point.x}-${point.y}`}-${type}`}
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

    const [logoBase64, setLogoBase64] = useState<string | null>(null);

    // Load logo as base64 for reliable PDF/SVG embedding
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const response = await fetch('/logo-720x720.png');
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoBase64(reader.result as string);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Failed to load logo:', error);
            }
        };
        loadLogo();
    }, []);

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
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            {(() => {
                const seo = HUB_SEO_DATA['dot-marker-generator'] || {};
                const imageArray = Array.isArray(seo.image) ? seo.image : [seo.image || "/images/dot-marker-16x9.png"];
                return (
                    <SEOMetaTags
                        title={seo.title || "Free Dot Marker Generator | Custom Name Worksheets | Wizqo"}
                        description={seo.metaDescription || "Create personalized dot marker name tracing worksheets for toddlers and preschoolers. Fun, hands-on fine motor practice. 100% Free PDF."}
                        keywords="dot marker printables, do a dot worksheets, bingo dauber activity, custom name tracing, dot art generator, free preschool worksheets, fine motor skills activities"
                        ogImage="https://wizqo.com/images/seo/dot-marker-olivia.png"
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

                const learningResourceLd = {
                    "@context": "https://schema.org",
                    "@type": "LearningResource",
                    name: "Custom Dot Marker Name Worksheet",
                    description: "A personalized fine motor skill activity where children use dot markers to trace their names.",
                    learningResourceType: "Worksheet",
                    educationalLevel: "Preschool, Kindergarten",
                    competencyRequired: "Fine motor skills, Letter recognition"
                } as const;

                return (
                    <>
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }} />
                    </>
                );
            })()}
            <UnifiedNavigation />

            <main className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
                <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">

                    {/* Left: Sidebar Controls */}
                    <aside className="sticky top-24 space-y-4 bg-white p-6 rounded-[32px] border-2 border-slate-50 shadow-xl shadow-slate-200/50 print:hidden lg:order-1">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                Personalization <Sparkles size={18} className="text-purple-400" />
                            </h2>
                            <p className="text-sm text-slate-400 font-medium">Configure your custom worksheet.</p>
                        </div>

                        <div className="space-y-4 pt-2">
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

                            <div className="pt-4">

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
                    <div className="space-y-4 lg:order-2">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="text-center lg:text-left space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
                                    {HUB_SEO_DATA['dot-marker-generator']?.h1 || "Do-A-Dot Name Generator"}
                                </h1>
                                <p className="text-base text-slate-500 font-medium max-w-2xl">
                                    Professional layout for Bingo Markers, Q-Tips, and Stickers.
                                </p>
                            </div>

                            <div className="flex justify-center md:justify-end gap-3 print:hidden">
                                <Button
                                    onClick={handlePrint}
                                    className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-black shadow-lg shadow-slate-200 text-sm group transition-all"
                                >
                                    <Printer className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    PRINT
                                </Button>
                                <Button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg shadow-purple-200 text-sm group transition-all"
                                >
                                    <Download className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-bounce' : 'group-hover:translate-y-0.5'} transition-transform`} />
                                    {isGenerating ? 'BUILDING...' : 'SAVE PDF'}
                                </Button>
                            </div>
                        </div>

                        {/* SVG Preview Container: Adjusted to Portrait Paper Aspect Ratio (A4) with Height Constraint */}
                        <div className="w-full aspect-[1/1.41] max-h-[600px] bg-white relative p-8 flex items-center justify-center overflow-auto rounded-3xl border-2 border-slate-100 shadow-2xl shadow-purple-500/5 print:shadow-none print:border-0 print:rounded-none">
                            <div className="absolute inset-0 bg-[#FAFAFA] opacity-50 print:bg-white" />

                            <svg
                                ref={svgRef}
                                viewBox={`0 0 ${Math.max(800, totalWidth + 100)} 1000`}
                                className="max-w-full max-h-full drop-shadow-2xl"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Center the name */}
                                <g transform={`translate(${totalWidth < 700 ? (700 - totalWidth) / 2 : 0}, 150)`}>
                                    {/* Branding Footer */}
                                    <g transform={`translate(${totalWidth / 2}, 650)`} className="print:block">
                                        {logoBase64 && (
                                            <image
                                                href={logoBase64}
                                                x="-40"
                                                y="-40"
                                                height="80"
                                                width="80"
                                                preserveAspectRatio="xMidYMid meet"
                                            />
                                        )}
                                        <text
                                            y="55"
                                            textAnchor="middle"
                                            className="fill-slate-400 text-[14px] font-bold uppercase tracking-widest"
                                            style={{ fontFamily: 'sans-serif' }}
                                        >
                                            wizqo.com
                                        </text>
                                    </g>

                                    {/* The Dots */}
                                    <g className="dots-container">
                                        {dots.map((point, i) => (
                                            <React.Fragment key={i}>
                                                {renderShape(point, dotSize / 4, selectedShape)}
                                            </React.Fragment>
                                        ))}
                                    </g>
                                </g>
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

                {/* Content Sandwich: SEO Keyword Zone */}
                <div className="mt-16 max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 border-2 border-slate-50 shadow-sm space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-3xl font-black text-slate-900">Free Custom Dot Marker Name Generator (PDF)</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Stop searching for generic worksheets. Create your own <strong>custom name do-a-dot printables</strong> in seconds!
                                Perfect for toddlers learning to spell their names using <strong>bingo daubers</strong>, <strong>dot markers</strong>, or <strong>stickers</strong>.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="font-bold text-slate-900">Adjustable Dot Size</h3>
                                <p className="text-sm text-slate-500">Perfect for standard 18mm Bingo Markers or smaller Q-Tip painting.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="font-bold text-slate-900">Sticker Mode</h3>
                                <p className="text-sm text-slate-500">Turn dots into solid circles for garage sale stickers (fine motor practice).</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="font-bold text-slate-900">Instant PDF</h3>
                                <p className="text-sm text-slate-500">Download high-resolution dot art worksheets for free.</p>
                            </div>
                        </div>

                        <section className="pt-8 border-t border-slate-100 text-slate-600">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Are you a teacher? 🍎</h3>
                            <p className="leading-relaxed">
                                Use this dot marker generator to make a class set of name mats for the first week of school.
                                Great for <strong>name recognition centers</strong>! Our tools are designed to save you hours of prep time.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Teacher's Corner: The Viral Hook */}
                <div className="mt-16 max-w-4xl mx-auto px-4 print:hidden">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
                                <Info size={40} className="animate-pulse" />
                            </div>
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-white leading-none">Are you a Teacher? 🍎</h2>
                                <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                                    Our "Classroom Mode" allows you to print personalized dot-marker sets for your entire class in minutes. Perfect for back-to-school name recognition centers!
                                </p>
                                <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                    <button
                                        onClick={() => {
                                            setChildName("CLASS NAME");
                                            toast({
                                                title: "Classroom Mode Active",
                                                description: "Ready to print a name set. Type each student's name and hit Print!",
                                            });
                                        }}
                                        className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-black text-sm shadow-xl hover:scale-105 transition-transform"
                                    >
                                        ACTIVATE CLASSROOM MODE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Million Dollar SEO Blueprint Content */}
                <div className="mt-24 border-t-2 border-slate-50 pt-16">
                    <div className="bg-white p-12 rounded-[48px] border-2 border-slate-50 shadow-sm">
                        <section className="max-w-4xl mx-auto">
                            {HUB_SEO_DATA['dot-marker-generator']?.richContent ? (
                                <div
                                    className="prose prose-slate max-w-none 
                                        prose-h1:text-4xl prose-h1:font-black prose-h1:text-slate-900
                                        prose-h2:text-3xl prose-h2:font-black prose-h2:text-slate-900 prose-h2:mt-12 prose-h2:mb-6
                                        prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-800 prose-h3:mt-8 prose-h3:mb-4
                                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                                        prose-strong:text-slate-900 prose-strong:font-bold
                                        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-100 prose-img:my-12"
                                    dangerouslySetInnerHTML={{ __html: HUB_SEO_DATA['dot-marker-generator'].richContent }}
                                />
                            ) : (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-900">Why Use This Dot Marker Generator?</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        Traditional PDFs are static and rarely match your child's name perfectly. Our
                                        <strong> Optimized Dot Grid Layout</strong> ensures that every letter is
                                        mapped with mathematical precision.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
