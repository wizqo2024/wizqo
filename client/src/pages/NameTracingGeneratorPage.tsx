import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, FileText, Printer, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';
import jsPDF from 'jspdf';
import { drawWorksheetOnPDF } from '@/utils/pdfHelpers';
import { trackWorksheetDownload } from '@/utils/analytics';

type LetterCase = 'original' | 'title' | 'upper' | 'lower';
type FontStyle = 'classic' | 'dotted' | 'bubble' | 'script';
type FontSizeMode = 'small' | 'medium' | 'large';
type LineStyle = 'primary' | 'baseline';
type PatternStyle = 'traceOnly' | 'traceAndWrite';
type PrintOrientation = 'portrait' | 'landscape';
type PaperSize = 'us-letter' | 'a4' | 'legal';
type MarginSize = 'none' | 'small' | 'medium' | 'large';
type BatchMode = 'single' | 'batch';
type BatchLayout = 'one-per-page' | 'two-per-page' | 'four-per-page';
type ColorTheme = 'classic' | 'rainbow' | 'ocean' | 'candy' | 'forest' | 'sunset' | 'bw';
type DecorationType = 'none' | 'stars' | 'hearts' | 'flowers';

const MAX_NAME_LENGTH = 18;

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
  rainbow: { name: 'Rainbow', primary: '#f472b6', secondary: '#fbcfe8', text: '#1e293b', dots: '#ec4899', bg: '#fffafb', rainbow: true },
  ocean: { name: 'Deep Sea', primary: '#0ea5e9', secondary: '#bae6fd', text: '#0369a1', dots: '#2DD4BF', bg: '#f0f9ff' },
  candy: { name: 'Cotton Candy', primary: '#db2777', secondary: '#fbcfe8', text: '#be185d', dots: '#a855f7', bg: '#fff1f2' },
  forest: { name: 'Magic Forest', primary: '#059669', secondary: '#d1fae5', text: '#065f46', dots: '#f59e0b', bg: '#f0fdf4' },
  sunset: { name: 'Warm Sunset', primary: '#ea580c', secondary: '#ffedd5', text: '#9a3412', dots: '#ef4444', bg: '#fff7ed' },
  bw: { name: 'Black & White', primary: '#000000', secondary: '#cbd5e1', text: '#000000', dots: '#94a3b8', bg: '#ffffff' },
};

const RAINBOW_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function NameTracingGeneratorPage() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();

  // Single name mode
  const [childName, setChildName] = React.useState<string>('Ava');

  // Batch mode
  const [batchMode, setBatchMode] = React.useState<BatchMode>('single');
  const [multipleNames, setMultipleNames] = React.useState<string>('');
  const [batchLayout, setBatchLayout] = React.useState<BatchLayout>('one-per-page');

  // Print layout settings
  const [printOrientation, setPrintOrientation] = React.useState<PrintOrientation>('portrait');
  const [paperSize, setPaperSize] = React.useState<PaperSize>('us-letter');
  const [marginSize, setMarginSize] = React.useState<MarginSize>('small');
  const [worksheetsPerPage, setWorksheetsPerPage] = React.useState<number>(1);

  // Style settings
  const [letterCase, setLetterCase] = React.useState<LetterCase>('title');
  const [fontStyle, setFontStyle] = React.useState<FontStyle>('dotted');
  const [fontSizeMode, setFontSizeMode] = React.useState<FontSizeMode>('large');
  const [lineStyle, setLineStyle] = React.useState<LineStyle>('primary');
  const [showGuideDots, setShowGuideDots] = React.useState<boolean>(true);
  const [patternStyle, setPatternStyle] = React.useState<PatternStyle>('traceAndWrite');
  const [rowCount, setRowCount] = React.useState<number>(4);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('classic');
  const [decoration, setDecoration] = React.useState<DecorationType>('none');
  const [isPrinting, setIsPrinting] = React.useState<boolean>(false);
  const [printNames, setPrintNames] = React.useState<string[]>([]);


  const svgRef = React.useRef<SVGSVGElement | null>(null);

  // Get names for preview (multiple in batch mode, single otherwise)
  const previewNames = React.useMemo(() => {
    if (batchMode === 'batch') {
      // Handle all types of line endings (Windows \r\n, Mac \r, Unix \n)
      const normalized = multipleNames.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const rawNames = normalized.split('\n');
      const names = rawNames
        .map((n: string) => n.trim())
        .filter((n: string) => n.length > 0 && n.length <= MAX_NAME_LENGTH);

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('multipleNames raw:', JSON.stringify(multipleNames));
        console.log('rawNames after split:', rawNames);
        console.log('names after trim/filter:', names);
        console.log('batchLayout:', batchLayout);
      }

      if (names.length === 0) return [t('pages.nameTracing.yourName')];

      // For preview, show all names (up to 4) regardless of print layout
      // The print layout only affects the actual print/download, not the preview
      let result: string[];
      if (batchLayout === 'two-per-page') {
        // Show up to 2 names in preview for 2-per-page layout
        result = names.slice(0, 2);
      } else if (batchLayout === 'four-per-page') {
        // Show up to 4 names in preview for 4-per-page layout
        result = names.slice(0, 4);
      } else {
        // one-per-page: show all names (up to 4) in preview so user can see what they entered
        result = names.slice(0, 4);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('previewNames result:', result);
      }

      return result;
    }
    return [childName.trim() || t('pages.nameTracing.yourName')];
  }, [batchMode, multipleNames, childName, batchLayout, t]);

  // Register the font for the browser's Canvas/DOM usage if not already done by CSS
  React.useEffect(() => {
    // Add Fonts to document via CSS for preview
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Codystar';
        src: url('/fonts/codystar.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

    // Pre-warm the font cache for the browser
    try {
      const font = new FontFace('Codystar', "url('/fonts/codystar.ttf')");
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      }).catch(err => {
        console.warn('FontFace load failed', err);
      });
    } catch (e) {
      console.warn('FontFace pre-load failed', e);
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []); // Run once on mount

  // Helper to embed font in SVG string
  const embedFontInSVG = React.useCallback(async (svgContent: string) => {
    const response = await fetch('/fonts/codystar.ttf');
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = window.btoa(binary);
    const fontUri = `data:font/ttf;base64,${b64}`;

    const styleBlock = `<defs><style type="text/css"><![CDATA[
      @font-face { 
        font-family: 'Codystar'; 
        src: url('${fontUri}') format('truetype'); 
        font-weight: normal; 
        font-style: normal; 
      }
    ]]></style></defs>`;
    return svgContent.replace(/<svg[^>]*>/, (match) => `${match}${styleBlock}`);
  }, []);



  // 1. Basic formatting and file name helpers
  const formatName = React.useCallback((name: string, caseType: LetterCase) => {
    const trimmed = name.trim();
    if (!trimmed) return t('pages.nameTracing.yourName');
    switch (caseType) {
      case 'title':
        return trimmed
          .split(/\s+/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      case 'upper':
        return trimmed.toUpperCase();
      case 'lower':
        return trimmed.toLowerCase();
      default:
        return trimmed;
    }
  }, [t]);

  // Format names for display
  const formattedNames = React.useMemo(() => {
    const formatted = previewNames.map((name: string) => {
      return formatName(name, letterCase);
    });
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('previewNames:', previewNames);
      console.log('formattedNames:', formatted);
    }
    return formatted;
  }, [previewNames, letterCase, formatName]);

  const formattedName = formattedNames[0] || t('pages.nameTracing.yourName');

  const safeFileName = React.useMemo(
    () => formattedName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'name-tracing',
    [formattedName]
  );

  const practicingRows = React.useMemo(() => {
    const sequence = patternStyle === 'traceOnly'
      ? ['trace']
      : ['trace', 'trace', 'blank'];
    const rows: Array<'trace' | 'blank'> = [];
    for (let i = 0; rows.length < rowCount; i += 1) {
      rows.push(sequence[i % sequence.length] as 'trace' | 'blank');
    }
    return rows;
  }, [patternStyle, rowCount]);

  // 2. Layout and style calculations
  const pageDimensions = React.useMemo(() => {
    let width = 850; // US Letter portrait default
    let height = 1100;
    if (paperSize === 'a4') {
      width = 794; height = 1123;
    } else if (paperSize === 'legal') {
      width = 850; height = 1400;
    }
    if (printOrientation === 'landscape') {
      [width, height] = [height, width];
    }
    return { width, height };
  }, [paperSize, printOrientation]);

  const pageWidth = pageDimensions.width;
  const pageHeight = pageDimensions.height;

  const margin = React.useMemo(() => {
    switch (marginSize) {
      case 'none': return 0;
      case 'small': return 40;
      case 'medium': return 60;
      case 'large': return 80;
      default: return 40;
    }
  }, [marginSize]);

  const baselineOffset = lineStyle === 'primary' ? 96 : 88;
  const rowGap = lineStyle === 'primary' ? 170 : 150;
  const maxRows = Math.min(rowCount, Math.max(3, Math.floor((pageHeight - margin * 2) / rowGap)));
  const rowsForPreview = practicingRows.slice(0, maxRows);

  const baseFontConfig = React.useMemo(() => {
    const theme = THEMES[colorTheme as ColorTheme];
    switch (fontStyle) {
      case 'bubble':
        return {
          fontFamily: "'Comic Neue', 'Patrick Hand', 'Arial Rounded MT Bold', 'Segoe UI', sans-serif",
          fontWeight: 800, letterSpacing: 6, fill: theme.text, stroke: theme.text, strokeWidth: 6, dashArray: undefined,
        };
      case 'script':
        return {
          fontFamily: "'Dancing Script', 'Pacifico', 'Brush Script MT', cursive",
          fontWeight: 600, letterSpacing: 4, fill: theme.text, stroke: undefined, strokeWidth: 0, dashArray: undefined,
        };
      case 'classic':
        return {
          fontFamily: "'Patrick Hand', 'Handlee', 'Comic Neue', 'Segoe UI', sans-serif",
          fontWeight: 600, letterSpacing: 3, fill: theme.text, stroke: undefined, strokeWidth: 0, dashArray: undefined,
        };
      default: // dotted
        return {
          fontFamily: "'Codystar', sans-serif",
          fontWeight: 400, letterSpacing: 4, fill: theme.text, stroke: undefined, strokeWidth: 0, dashArray: undefined,
        };
    }
  }, [fontStyle, colorTheme]);

  const sizeMultiplier = fontSizeMode === 'large' ? 1 : fontSizeMode === 'medium' ? 0.85 : 0.7;
  const baseFontSize = (fontStyle === 'script' ? 100 : 110) * sizeMultiplier;

  const fittedFontConfigs = React.useMemo(() => {
    return formattedNames.map((displayName: string) => {
      const startX = margin + 40;
      const endX = pageWidth - margin + 20;
      const usableWidth = endX - startX;
      const maxWidth = Math.max(140, usableWidth - 80);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const dominantRowType = practicingRows.find((row: string) => row === 'trace') ? 'trace' : 'blank';
      const isTraceRow = dominantRowType === 'trace';
      const weight = baseFontConfig.fontWeight || 600;
      if (ctx) {
        ctx.font = `${weight} ${baseFontSize}px ${baseFontConfig.fontFamily}`;
      }
      const measuredWidth = ctx ? ctx.measureText(displayName).width : displayName.length * baseFontSize * 0.6;
      const charCount = Math.max(0, Array.from(displayName).length - 1);
      const baseSpacing = baseFontConfig.letterSpacing || 0;
      const totalWidth = measuredWidth + charCount * baseSpacing;
      const traceMinBase = fontStyle === 'bubble' ? 52 : fontStyle === 'script' ? 48 : 44;
      const blankMinBase = fontStyle === 'bubble' ? 60 : fontStyle === 'script' ? 54 : 50;
      const baseMin = isTraceRow ? traceMinBase : blankMinBase;
      const minFontSize = Math.max(36, Math.round(baseMin * sizeMultiplier * (isTraceRow ? 1 : 0.9)));
      let fittedSize = baseFontSize;
      if (totalWidth > maxWidth && totalWidth > 0) {
        const ratio = maxWidth / totalWidth;
        fittedSize = Math.max(Math.round(baseFontSize * ratio), minFontSize);
      }
      const scale = fittedSize / baseFontSize;
      const fittedSpacing = baseSpacing * scale;
      const fittedStrokeWidth = baseFontConfig.strokeWidth ? Math.max(2, baseFontConfig.strokeWidth * scale) : undefined;
      const fittedDashArray = baseFontConfig.dashArray
        ? `0 ${Math.max(12, Math.round(26 * scale))}`
        : undefined;

      return {
        ...baseFontConfig,
        fontSize: fittedSize,
        letterSpacing: fittedSpacing,
        strokeWidth: fittedStrokeWidth,
        dashArray: fittedDashArray,
        dominantRowType,
      } as typeof baseFontConfig & { fontSize: number; dominantRowType: 'trace' | 'blank'; };
    });
  }, [baseFontConfig, baseFontSize, formattedNames, fontStyle, sizeMultiplier, practicingRows, margin, pageWidth]);

  const fittedFontConfig = fittedFontConfigs[0] || baseFontConfig;

  // 3. Helper function to generate SVG for a given name
  const generateSVGForName = React.useCallback((name: string): string => {
    const formatted = formatName(name, letterCase);
    const rows = (() => {
      const sequence = patternStyle === 'traceOnly' ? ['trace'] : ['trace', 'trace', 'blank'];
      const r: Array<'trace' | 'blank'> = [];
      for (let i = 0; r.length < rowCount; i += 1) {
        r.push(sequence[i % sequence.length] as 'trace' | 'blank');
      }
      return r;
    })();

    // Calculate font config for this name
    const startX = margin + 40;
    const endX = pageWidth - margin + 20;
    const usableWidth = endX - startX;
    const maxWidth = Math.max(140, usableWidth - 80);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dominantRowType = rows.find((row: string) => row === 'trace') ? 'trace' : 'blank';
    const isTraceRow = dominantRowType === 'trace';
    const weight = baseFontConfig.fontWeight || 600;
    if (ctx) { ctx.font = `${weight} ${baseFontSize}px ${baseFontConfig.fontFamily}`; }
    const measuredWidth = ctx ? ctx.measureText(formatted).width : formatted.length * baseFontSize * 0.6;
    const charCount = Math.max(0, Array.from(formatted).length - 1);
    const baseSpacing = baseFontConfig.letterSpacing || 0;
    const totalWidth = measuredWidth + charCount * baseSpacing;
    const traceMinBase = fontStyle === 'bubble' ? 52 : fontStyle === 'script' ? 48 : 44;
    const blankMinBase = fontStyle === 'bubble' ? 60 : fontStyle === 'script' ? 54 : 50;
    const baseMin = isTraceRow ? traceMinBase : blankMinBase;
    const minFontSize = Math.max(36, Math.round(baseMin * sizeMultiplier * (isTraceRow ? 1 : 0.9)));
    let fittedSize = baseFontSize;
    if (totalWidth > maxWidth && totalWidth > 0) {
      const ratio = maxWidth / totalWidth;
      fittedSize = Math.max(Math.round(baseFontSize * ratio), minFontSize);
    }
    const scale = fittedSize / baseFontSize;
    const fittedSpacing = baseSpacing * scale;
    const fittedStrokeWidth = baseFontConfig.strokeWidth ? Math.max(2, baseFontConfig.strokeWidth * scale) : undefined;
    const fittedDashArray = baseFontConfig.dashArray ? `0 ${Math.max(12, Math.round(26 * scale))}` : undefined;

    const fitted = {
      ...baseFontConfig,
      fontSize: fittedSize,
      letterSpacing: fittedSpacing,
      strokeWidth: fittedStrokeWidth,
      dashArray: fittedDashArray,
    };

    const baselineOffset = lineStyle === 'primary' ? 96 : 88;
    const rowGap = lineStyle === 'primary' ? 170 : 150;
    const maxRows = Math.min(rowCount, Math.max(3, Math.floor((pageHeight - margin * 2) / rowGap)));
    const rowsForSVG = rows.slice(0, maxRows);

    const theme = THEMES[colorTheme as ColorTheme];
    const isRainbow = theme.rainbow;

    // Generate SVG content
    let svgContent = `<rect x="0" y="0" width="${pageWidth}" height="${pageHeight}" fill="${theme.bg}" rx="36" />`;
    svgContent += `<rect x="${margin - 24}" y="${margin - 24}" width="${pageWidth - (margin - 24) * 2}" height="${pageHeight - (margin - 24) * 2}" fill="#ffffff" stroke="${theme.secondary}" stroke-width="2" rx="28" />`;

    // Render Decorations
    if (decoration !== 'none') {
      const decoColor = theme.dots;
      const positions = [
        { x: margin + 30, y: margin + 30 },
        { x: pageWidth - margin - 30, y: margin + 30 },
        { x: margin + 30, y: pageHeight - margin - 30 },
        { x: pageWidth - margin - 30, y: pageHeight - margin - 30 }
      ];

      positions.forEach(pos => {
        if (decoration === 'stars') {
          svgContent += `<path d="M ${pos.x} ${pos.y - 15} L ${pos.x + 4} ${pos.y - 4} L ${pos.x + 15} ${pos.y - 4} L ${pos.x + 6} ${pos.y + 3} L ${pos.x + 10} ${pos.y + 15} L ${pos.x} ${pos.y + 7} L ${pos.x - 10} ${pos.y + 15} L ${pos.x - 6} ${pos.y + 3} L ${pos.x - 15} ${pos.y - 4} L ${pos.x - 4} ${pos.y - 4} Z" fill="${decoColor}" opacity="0.6" />`;
        } else if (decoration === 'hearts') {
          svgContent += `<path d="M ${pos.x} ${pos.y + 10} C ${pos.x - 20} ${pos.y - 10}, ${pos.x} ${pos.y - 20}, ${pos.x} ${pos.y - 5} C ${pos.x} ${pos.y - 20}, ${pos.x + 20} ${pos.y - 10}, ${pos.x} ${pos.y + 10}" fill="${decoColor}" opacity="0.6" />`;
        }
      });
    }

    rowsForSVG.forEach((rowType, index) => {
      const baselineY = margin + 120 + index * rowGap;
      const currentStartX = margin + 40;
      const currentEndX = pageWidth - margin + 20;
      const topLine = baselineY - baselineOffset;
      const midLine = baselineY - baselineOffset / 2;
      const showPrimary = lineStyle === 'primary';

      if (showPrimary) {
        svgContent += `<line x1="${currentStartX}" y1="${topLine}" x2="${currentEndX}" y2="${topLine}" stroke="${theme.secondary}" stroke-width="3" stroke-dasharray="10 14" />`;
        svgContent += `<line x1="${currentStartX}" y1="${midLine}" x2="${currentEndX}" y2="${midLine}" stroke="${theme.secondary}" opacity="0.5" stroke-width="2.5" stroke-dasharray="14 14" />`;
      }
      svgContent += `<line x1="${currentStartX}" y1="${baselineY}" x2="${currentEndX}" y2="${baselineY}" stroke="${theme.primary}" stroke-width="4" />`;

      if (rowType === 'blank') {
        svgContent += `<line x1="${currentStartX}" y1="${baselineY + 26}" x2="${currentEndX}" y2="${baselineY + 26}" stroke="${theme.secondary}" stroke-width="2" stroke-dasharray="14 16" />`;
      } else {
        if (showGuideDots) {
          svgContent += `<circle cx="${currentStartX - 16}" cy="${baselineY - baselineOffset / 3}" r="8" fill="${theme.dots}" />`;
        }

        if (isRainbow) {
          // Rainbow mode: each letter gets a color
          let currentX = currentStartX;
          const chars = Array.from(formatted);
          chars.forEach((char, charIdx) => {
            const charColor = RAINBOW_COLORS[charIdx % RAINBOW_COLORS.length];
            const charWeight = fitted.fontWeight || 600;
            // Note: SVG text spacing is tricky with individual characters. 
            // We use dx for relative spacing if available, but here we'll just use a simple offset approach or text-anchor.
            // Simplified: we'll use a single text element with tspans for colors.
          });

          // Re-implementing rainbow text more reliably
          svgContent += `<text x="${currentStartX}" y="${baselineY - 8}" font-family="${fitted.fontFamily}" font-size="${fitted.fontSize}" font-weight="${fitted.fontWeight}" style="letter-spacing: ${fitted.letterSpacing}px">`;
          chars.forEach((char, charIdx) => {
            const charColor = RAINBOW_COLORS[charIdx % RAINBOW_COLORS.length];
            svgContent += `<tspan fill="${charColor}">${char}</tspan>`;
          });
          svgContent += `</text>`;

          if (fontStyle !== 'dotted') {
            // For non-dotted styles in rainbow mode, we might want a stroke or something, but let's keep it simple first
          }
        } else {
          if (fontStyle === 'dotted') {
            svgContent += `<text x="${currentStartX}" y="${baselineY - 8}" font-family="${fitted.fontFamily}" font-size="${fitted.fontSize}" font-weight="${fitted.fontWeight}" fill="${theme.text}" style="letter-spacing: ${fitted.letterSpacing}px">${formatted}</text>`;
          }
          svgContent += `<text x="${currentStartX}" y="${baselineY - 8}" font-family="${fitted.fontFamily}" font-size="${fitted.fontSize}" font-weight="${fitted.fontWeight}" fill="${fontStyle === 'dotted' ? 'none' : theme.text}" stroke="${fitted.stroke || 'none'}" stroke-width="${fitted.strokeWidth || 0}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${fitted.dashArray || 'none'}" style="letter-spacing: ${fitted.letterSpacing}px">${formatted}</text>`;
        }
      }
    });

    svgContent += `<text x="${margin}" y="${pageHeight - margin + 10}" font-size="18" font-family="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif" fill="${theme.primary}">${t('pages.nameTracing.traceSlowly')}</text>`;
    return `<svg viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
  }, [formatName, letterCase, patternStyle, rowCount, margin, pageWidth, pageHeight, baseFontConfig, baseFontSize, sizeMultiplier, lineStyle, showGuideDots, fontStyle, t, colorTheme, decoration]);

  const generateSVGForNameRef = React.useRef<((name: string) => string) | null>(null);

  // Update ref whenever generateSVGForName changes
  React.useEffect(() => {
    generateSVGForNameRef.current = generateSVGForName;
  }, [generateSVGForName]);

  const handleNameInput = (value: string) => {
    if (value.length > MAX_NAME_LENGTH) {
      setChildName(value.slice(0, MAX_NAME_LENGTH));
      return;
    }
    const cleaned = value.replace(/[^A-Za-zÀ-ÿ' -]/g, '');
    setChildName(cleaned);
  };

  // Helper to convert SVG to PNG Data URL
  const svgToPngDataUrl = React.useCallback(async (svgString: string, scale: number = 2.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

        const cloned = svgElement.cloneNode(true) as unknown as SVGSVGElement;
        cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const data = new XMLSerializer().serializeToString(cloned);
        const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          // Increase delay to 350ms to give sub-resources (embedded font) time to be parsed in the image context
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            const viewBox = svgElement.viewBox.baseVal;
            canvas.width = viewBox.width * scale;
            canvas.height = viewBox.height * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              const pngUrl = canvas.toDataURL('image/png');
              resolve(pngUrl);
            } else {
              reject(new Error('Canvas context not found'));
            }
            URL.revokeObjectURL(url);
          }, 350);
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Image load error'));
        };
        image.src = url;
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const handlePrint = React.useCallback(async () => {
    try {
      const generateFn = generateSVGForNameRef.current;
      if (!generateFn) {
        toast({
          title: t('pages.nameTracing.error'),
          description: t('pages.nameTracing.svgNotReady'),
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('pages.nameTracing.preparingPrint'),
        description: t('pages.nameTracing.preparingPrintDesc'),
      });

      // Get names for printing
      let names: string[] = [];
      if (batchMode === 'single') {
        names = [childName];
      } else {
        names = multipleNames
          .split('\n')
          .map((n: string) => n.trim())
          .filter((n: string) => n.length > 0 && n.length <= MAX_NAME_LENGTH)
          .slice(0, 50); // Limit to 50 names
      }

      if (names.length === 0) {
        toast({
          title: t('pages.nameTracing.noNames'),
          description: t('pages.nameTracing.noNamesDesc'),
          variant: 'destructive',
        });
        return;
      }

      // 1. Set printing state
      setPrintNames(names);
      setIsPrinting(true);

      // 2. Wait for fonts and React render
      // We give it a small delay for the DOM to be populated
      setTimeout(async () => {
        try {
          await document.fonts.ready;
          window.print();
        } catch (error) {
          console.error('Print failed', error);
          toast({
            title: t('pages.nameTracing.printFailed'),
            description: t('pages.nameTracing.printFailedDesc'),
            variant: 'destructive',
          });
        } finally {
          // Track print intent as download
          trackWorksheetDownload('name-tracing', batchMode === 'batch' ? 'batch-print' : childName, 'name-tracing', 'Kindergarten')

          // 3. Reset state after printing started
          // Small delay to ensure the print dialog is fully independent of the DOM state
          setTimeout(() => setIsPrinting(false), 500);
        }
      }, 500);

    } catch (error) {
      console.error('Unable to print name tracing sheet', error);
      toast({
        title: t('pages.nameTracing.error'),
        description: t('pages.nameTracing.printError'),
        variant: 'destructive',
      });
      setIsPrinting(false);
    }
  }, [batchMode, multipleNames, childName, t, toast]);

  const handleDownloadPNG = React.useCallback(async () => {
    try {
      if (batchMode === 'batch') {
        const names = multipleNames
          .split('\n')
          .map((n: string) => n.trim())
          .filter((n: string) => n.length > 0 && n.length <= MAX_NAME_LENGTH)
          .slice(0, 50);

        if (names.length === 0) {
          toast({
            title: t('pages.nameTracing.noNames'),
            description: t('pages.nameTracing.noNamesDesc'),
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: t('pages.nameTracing.batchPNGDownload'),
          description: t('pages.nameTracing.batchPNGDownloadDesc').replace('{{count}}', String(names.length)).replace('{{fileCount}}', names.length === 1 ? '' : 's'),
        });

        const generateFn = generateSVGForNameRef.current;
        if (!generateFn) {
          toast({
            title: t('pages.nameTracing.error'),
            description: t('pages.nameTracing.svgNotReady'),
            variant: 'destructive',
          });
          return;
        }

        // Download each name as a separate PNG
        names.forEach((name: string, index: number) => {
          setTimeout(async () => {
            try {
              const svgStringRaw = generateFn(name);
              const svgString = await embedFontInSVG(svgStringRaw);
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
              const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

              const cloned = svgElement.cloneNode(true) as unknown as SVGSVGElement;
              cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
              const data = new XMLSerializer().serializeToString(cloned);
              const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const image = new Image();
              image.onload = () => {
                const scale = 2.5;
                const canvas = document.createElement('canvas');
                const viewBox = svgElement.viewBox.baseVal;
                canvas.width = viewBox.width * scale;
                canvas.height = viewBox.height * scale;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                  const pngUrl = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.href = pngUrl;
                  const safeName = formatName(name, letterCase).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'name-tracing';
                  link.download = `${safeName}.png`;
                  link.click();

                  // Track batch item download
                  trackWorksheetDownload('name-tracing', `batch-${name}`, 'name-tracing', 'Kindergarten')
                }
                URL.revokeObjectURL(url);
              };
              image.onerror = () => {
                URL.revokeObjectURL(url);
              };
              image.src = url;
            } catch (error) {
              console.error(`Error downloading PNG for ${name}:`, error);
            }
          }, index * 200); // Stagger downloads to avoid browser blocking
        });

        setTimeout(() => {
          toast({
            title: t('pages.nameTracing.downloadComplete'),
            description: t('pages.nameTracing.downloadCompleteBatch').replace('{{count}}', String(names.length)).replace('{{fileCount}}', names.length === 1 ? '' : 's'),
          });
        }, names.length * 200 + 500);
        return;
      }

      // Single name mode
      const svgElement = svgRef.current;
      if (!svgElement) {
        toast({
          title: 'Error',
          description: 'Worksheet not found. Please refresh the page.',
          variant: 'destructive',
        });
        return;
      }
      const cloned = svgElement.cloneNode(true) as SVGSVGElement;
      cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      let data = new XMLSerializer().serializeToString(cloned);
      data = await embedFontInSVG(data);
      const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        const scale = 2.5;
        const canvas = document.createElement('canvas');
        const viewBox = svgElement.viewBox.baseVal;
        canvas.width = viewBox.width * scale;
        canvas.height = viewBox.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${safeFileName}.png`;
          link.click();
          toast({
            title: t('pages.nameTracing.downloadComplete'),
            description: t('pages.nameTracing.downloadCompleteDesc'),
          });

          // Track single download
          trackWorksheetDownload('name-tracing', childName, 'name-tracing', 'Kindergarten')
        }
        URL.revokeObjectURL(url);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        toast({
          title: t('pages.nameTracing.downloadFailed'),
          description: t('pages.nameTracing.downloadFailedDesc'),
          variant: 'destructive',
        });
      };
      image.src = url;
    } catch (error) {
      console.error('Unable to download PNG', error);
      toast({
        title: t('pages.nameTracing.error'),
        description: t('pages.nameTracing.downloadError'),
        variant: 'destructive',
      });
    }
  }, [batchMode, multipleNames, formatName, letterCase, safeFileName, svgRef, toast, t, colorTheme, decoration]);



  const handleDownloadPDF = React.useCallback(async () => {
    try {
      toast({
        title: t('pages.nameTracing.preparingPDF'),
        description: t('pages.nameTracing.preparingPDFDesc'),
      });

      // Initialize jsPDF
      const orientation = printOrientation === 'landscape' ? 'l' : 'p';
      const format = paperSize === 'legal' ? 'legal' : paperSize === 'a4' ? 'a4' : 'letter';
      const doc = new jsPDF({
        orientation,
        unit: 'px',
        format,
        hotfixes: ['px_scaling'],
      });

      // Fetch Font Asynchronously
      const fetchFontBase64 = async (path: string) => {
        const res = await fetch(path);
        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

      const codystarB64 = await fetchFontBase64('/fonts/codystar.ttf');

      // Embed the Codystar TTF font natively
      doc.addFileToVFS('Codystar-Regular.ttf', codystarB64);
      doc.addFont('Codystar-Regular.ttf', 'Codystar', 'normal');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const names = batchMode === 'batch'
        ? multipleNames
          .split('\n')
          .map((n: string) => n.trim())
          .filter((n: string) => n.length > 0 && n.length <= MAX_NAME_LENGTH)
          .slice(0, 100)
        : [childName];

      if (names.length === 0) {
        toast({ title: t('pages.nameTracing.noNames'), description: t('pages.nameTracing.noNamesDesc'), variant: 'destructive' });
        return;
      }

      // Configuration for drawWorksheetOnPDF
      const commonConfig = {
        pageWidth,
        pageHeight,
        margin: marginSize === 'none' ? 0 : marginSize === 'small' ? 20 : marginSize === 'medium' ? 40 : 60,
        fontStyle,
        lineStyle,
        patternStyle,
        showGuideDots,
        rowCount,
        letterCase,
        sizeMultiplier,
        baseFontSize: 64, // Default baseline for generator
        colorTheme,
        decoration,
      };

      let currentNameIndex = 0;

      while (currentNameIndex < names.length) {
        if (currentNameIndex > 0) doc.addPage();

        if (batchLayout === 'one-per-page' || batchMode === 'single') {
          const name = names[currentNameIndex];
          drawWorksheetOnPDF(doc, name, commonConfig, formatName);
          currentNameIndex++;
        } else if (batchLayout === 'two-per-page') {
          for (let i = 0; i < 2; i++) {
            if (currentNameIndex >= names.length) break;
            const name = names[currentNameIndex];
            const yOffset = i * (pageHeight / 2);
            drawWorksheetOnPDF(doc, name, {
              ...commonConfig,
              pageHeight: pageHeight / 2,
              yOffset,
              scale: 0.95, // Slight scale down to fit two
            }, formatName);
            currentNameIndex++;
          }
        } else {
          // four-per-page
          for (let i = 0; i < 4; i++) {
            if (currentNameIndex >= names.length) break;
            const name = names[currentNameIndex];
            const col = i % 2;
            const row = Math.floor(i / 2);
            const xOffset = col * (pageWidth / 2);
            const yOffset = row * (pageHeight / 2);
            drawWorksheetOnPDF(doc, name, {
              ...commonConfig,
              pageWidth: pageWidth / 2,
              pageHeight: pageHeight / 2,
              xOffset,
              yOffset,
              scale: 0.48, // Scale down to fit four on one page (approx 0.5 - margins)
            }, formatName);
            currentNameIndex++;
          }
        }
      }

      const safeFilename = names.length > 1 ? 'name-tracing-batch.pdf' : `${safeFileName}.pdf`;
      doc.save(safeFilename);

      // Track PDF download
      trackWorksheetDownload('name-tracing', batchMode === 'batch' ? 'batch-pdf' : childName, 'name-tracing', 'Kindergarten')

      toast({
        title: t('pages.nameTracing.downloadComplete'),
        description: t('pages.nameTracing.downloadCompleteDesc'),
      });

    } catch (error) {
      console.error('PDF Generation failed', error);
      toast({
        title: t('pages.nameTracing.error'),
        description: t('pages.nameTracing.downloadError'),
        variant: 'destructive',
      });
    }
  }, [batchMode, childName, multipleNames, batchLayout, paperSize, printOrientation, marginSize, fontStyle, lineStyle, showGuideDots, rowCount, letterCase, sizeMultiplier, formatName, safeFileName, toast, t, colorTheme, decoration]);



  return (
    <>
      <div className={`min-h-screen bg-slate-50 ${isPrinting ? 'no-print' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <SEOMetaTags
          title="Create Name Tracing Worksheets | Free Generator & Printable PDF"
          description="Use our free name tracing generator to create custom name tracing worksheets instantly. Editable, printable PDFs perfect for preschool handwriting practice."
          keywords="create name tracing worksheets, name tracing generator free, name tracing printable, editable name tracing, handwriting worksheet maker"
          canonicalUrl="https://wizqo.com/printables/name-tracing-generator"
        />

        <UnifiedNavigation currentPage="printables" />


        <main className="pt-12 pb-16">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-10 lg:gap-14">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-3xl shadow-sm p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" /> {t('pages.nameTracing.makeItPersonal')}
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mt-4 leading-tight">
                    {t('pages.nameTracing.title')}
                  </h1>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {t('pages.nameTracing.subtitle')}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6">
                  {/* Mode Selection */}
                  <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t('pages.nameTracing.mode')}</p>
                      <p className="text-xs text-slate-500">{t('pages.nameTracing.modeDesc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBatchMode('single')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${batchMode === 'single'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-purple-100'
                          }`}
                      >
                        {t('pages.nameTracing.single')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatchMode('batch')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${batchMode === 'batch'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-purple-100'
                          }`}
                      >
                        {t('pages.nameTracing.batch')}
                      </button>
                    </div>
                  </div>

                  {batchMode === 'single' ? (
                    <div>
                      <Label htmlFor="child-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.enterYourName')}
                      </Label>
                      <Input
                        id="child-name"
                        value={childName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameInput(event.target.value)}
                        placeholder={t('pages.nameTracing.typeAName')}
                        className="mt-2 h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-purple-500 text-base"
                        maxLength={MAX_NAME_LENGTH}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        {t('pages.nameTracing.nameInputHint').replace('{{maxLength}}', String(MAX_NAME_LENGTH))}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="multiple-names" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.enterNamesOnePerLine')}
                      </Label>
                      <Textarea
                        id="multiple-names"
                        value={multipleNames}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMultipleNames(e.target.value)}
                        placeholder={t('pages.nameTracing.namesPlaceholder')}
                        className="mt-2 min-h-[120px] rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-purple-500 text-sm font-mono"
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        {t('pages.nameTracing.batchInputHint').replace('{{maxLength}}', String(MAX_NAME_LENGTH))}
                      </p>
                      {multipleNames && (
                        <p className="mt-1 text-xs text-purple-600 font-medium">
                          {(() => {
                            const count = multipleNames.split('\n').filter((n: string) => n.trim().length > 0).length;
                            return `${count} ${count === 1 ? t('pages.nameTracing.nameEntered') : t('pages.nameTracing.namesEntered')}`;
                          })()}
                        </p>
                      )}

                      {batchMode === 'batch' && (
                        <div className="mt-4 space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {t('pages.nameTracing.layoutBatchMode')}
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setBatchLayout('one-per-page')}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${batchLayout === 'one-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                              {t('pages.nameTracing.onePerPage')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setBatchLayout('two-per-page')}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${batchLayout === 'two-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                              {t('pages.nameTracing.twoPerPage')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setBatchLayout('four-per-page')}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${batchLayout === 'four-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                              {t('pages.nameTracing.fourPerPage')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Print Layout Settings */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">{t('pages.nameTracing.printLayoutSettings')}</h3>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t('pages.nameTracing.orientation')}</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPrintOrientation('portrait')}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${printOrientation === 'portrait'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-purple-50'
                                }`}
                            >
                              {t('pages.nameTracing.portrait')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrintOrientation('landscape')}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${printOrientation === 'landscape'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-purple-50'
                                }`}
                            >
                              {t('pages.nameTracing.landscape')}
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t('pages.nameTracing.paperSize')}</Label>
                          <div className="relative">
                            <select
                              value={paperSize}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaperSize(e.target.value as PaperSize)}
                              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            >
                              <option value="us-letter">{t('pages.nameTracing.paperSizes.usLetter')}</option>
                              <option value="a4">{t('pages.nameTracing.paperSizes.a4')}</option>
                              <option value="legal">{t('pages.nameTracing.paperSizes.legal')}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t('pages.nameTracing.margins')}</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['none', 'small', 'medium', 'large'] as MarginSize[]).map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setMarginSize(size)}
                                className={`px-2 py-2 rounded-xl text-xs font-medium transition capitalize ${marginSize === size
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-slate-700 hover:bg-purple-50'
                                  }`}
                              >
                                {t(`pages.nameTracing.marginSizes.${size}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.letterCase')}
                      </Label>
                    </div>
                    <ToggleGroup
                      type="single"
                      value={letterCase}
                      onValueChange={(value: string) => value && setLetterCase(value as LetterCase)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem value="title" aria-label={t('pages.nameTracing.titleCase')} className="rounded-xl">
                        {t('pages.nameTracing.titleCase')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="upper" aria-label={t('pages.nameTracing.uppercase')} className="rounded-xl">
                        {t('pages.nameTracing.uppercase')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="lower" aria-label={t('pages.nameTracing.lowercase')} className="rounded-xl">
                        {t('pages.nameTracing.lowercase')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="original" aria-label={t('pages.nameTracing.keepAsTyped')} className="rounded-xl">
                        {t('pages.nameTracing.keepAsTyped')}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.colorTheme') || 'Color Theme'}
                      </Label>
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded uppercase">Premium</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(THEMES) as ColorTheme[]).map((themeKey) => (
                        <button
                          key={themeKey}
                          onClick={() => setColorTheme(themeKey)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition ${colorTheme === themeKey ? 'border-purple-500 bg-purple-50' : 'border-slate-100 bg-white hover:border-purple-200'}`}
                        >
                          <div
                            className="w-full h-8 rounded-lg shadow-inner flex items-center justify-center overflow-hidden"
                            style={{
                              background: THEMES[themeKey].rainbow
                                ? 'linear-gradient(45deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)'
                                : themeKey === 'bw'
                                  ? '#000000'
                                  : THEMES[themeKey].bg
                            }}
                          >
                            <div className="flex gap-0.5">
                              {THEMES[themeKey].rainbow ? (
                                RAINBOW_COLORS.slice(0, 3).map((c, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />)
                              ) : (
                                <>
                                  <div className="w-2 h-2 rounded-full" style={{ background: THEMES[themeKey].primary }} />
                                  <div className="w-2 h-2 rounded-full" style={{ background: THEMES[themeKey].dots }} />
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">{THEMES[themeKey].name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.decorations') || 'Decorations'}
                      </Label>
                    </div>
                    <ToggleGroup
                      type="single"
                      value={decoration}
                      onValueChange={(value: string) => setDecoration(value as DecorationType || 'none')}
                      className="grid grid-cols-4 gap-2"
                    >
                      <ToggleGroupItem value="none" className="rounded-xl text-[10px]">None</ToggleGroupItem>
                      <ToggleGroupItem value="stars" className="rounded-xl text-[10px]">Stars</ToggleGroupItem>
                      <ToggleGroupItem value="hearts" className="rounded-xl text-[10px]">Hearts</ToggleGroupItem>
                      <ToggleGroupItem value="flowers" className="rounded-xl text-[10px]">Flowers</ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.tracingStyle')}
                      </Label>
                    </div>
                    <ToggleGroup
                      type="single"
                      value={fontStyle}
                      onValueChange={(value: string) => value && setFontStyle(value as FontStyle)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem value="dotted" className="rounded-xl">
                        {t('pages.nameTracing.dottedLines')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="classic" className="rounded-xl">
                        {t('pages.nameTracing.solidTrace')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="bubble" className="rounded-xl">
                        {t('pages.nameTracing.bubbleLetters')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="script" className="rounded-xl">
                        {t('pages.nameTracing.cursiveFlow')}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.nameTracing.fontSize')}
                      </Label>
                    </div>
                    <ToggleGroup
                      type="single"
                      value={fontSizeMode}
                      onValueChange={(value: string) => value && setFontSizeMode(value as FontSizeMode)}
                      className="grid grid-cols-3 gap-2"
                    >
                      <ToggleGroupItem value="small" className="rounded-xl" aria-label={t('pages.nameTracing.fontSizes.small')}>
                        {t('pages.nameTracing.fontSizes.small')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="medium" className="rounded-xl" aria-label={t('pages.nameTracing.fontSizes.medium')}>
                        {t('pages.nameTracing.fontSizes.medium')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="large" className="rounded-xl" aria-label={t('pages.nameTracing.fontSizes.large')}>
                        {t('pages.nameTracing.fontSizes.large')}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">{t('pages.nameTracing.guidelineLines')}</h3>
                          <p className="text-xs text-slate-500">{t('pages.nameTracing.chooseHandwritingLines')}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => setLineStyle('primary')}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 ${lineStyle === 'primary'
                            ? 'border-purple-500 bg-white shadow-md ring-1 ring-purple-500'
                            : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white text-slate-600'
                            }`}
                        >
                          <div className={`text-[11px] font-bold leading-tight ${lineStyle === 'primary' ? 'text-purple-700' : 'text-slate-800'}`}>
                            {t('pages.nameTracing.primaryLines')}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLineStyle('baseline')}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 ${lineStyle === 'baseline'
                            ? 'border-purple-500 bg-white shadow-md ring-1 ring-purple-500'
                            : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white text-slate-600'
                            }`}
                        >
                          <div className={`text-[11px] font-bold leading-tight ${lineStyle === 'baseline' ? 'text-purple-700' : 'text-slate-800'}`}>
                            {t('pages.nameTracing.singleBaselineOnly')}
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">{t('pages.nameTracing.practicePattern')}</h3>
                          <p className="text-xs text-slate-500">{t('pages.nameTracing.mixTracingWithBlankLines')}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => setPatternStyle('traceAndWrite')}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 ${patternStyle === 'traceAndWrite'
                            ? 'border-purple-500 bg-white shadow-md ring-1 ring-purple-500'
                            : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white text-slate-600'
                            }`}
                        >
                          <div className={`text-[11px] font-bold leading-tight ${patternStyle === 'traceAndWrite' ? 'text-purple-700' : 'text-slate-800'}`}>
                            {t('pages.nameTracing.traceAndWrite')}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPatternStyle('traceOnly')}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 ${patternStyle === 'traceOnly'
                            ? 'border-purple-500 bg-white shadow-md ring-1 ring-purple-500'
                            : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white text-slate-600'
                            }`}
                        >
                          <div className={`text-[11px] font-bold leading-tight ${patternStyle === 'traceOnly' ? 'text-purple-700' : 'text-slate-800'}`}>
                            {t('pages.nameTracing.tracingOnly')}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t('pages.nameTracing.friendlyStartDot')}</p>
                      <p className="text-xs text-slate-500">{t('pages.nameTracing.friendlyStartDotDesc')}</p>
                    </div>
                    <Switch
                      checked={showGuideDots}
                      onCheckedChange={setShowGuideDots}
                      aria-label={t('pages.nameTracing.toggleStartDot')}
                    />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{t('pages.nameTracing.numberOfPracticeLines')}</h3>
                        <p className="text-xs text-slate-500">{t('pages.nameTracing.chooseBetweenRows')}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      {[3, 4, 5, 6].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setRowCount(count)}
                          aria-label={`${count} ${t('pages.nameTracing.practiceRows')}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${rowCount === count ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-600'}`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>



                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <Button
                      onClick={handlePrint}
                      className="flex-1 rounded-2xl h-11 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4 mr-2" /> {t('pages.nameTracing.printWorksheet')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPDF}
                      className="flex-1 rounded-2xl h-11 border-purple-200 text-purple-700 hover:bg-purple-50 whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4 mr-2" /> {t('pages.nameTracing.downloadPDF')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPNG}
                      className="flex-1 rounded-2xl h-11 whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 mr-2" /> {t('pages.nameTracing.downloadPNG')}
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-3">{t('pages.nameTracing.makeItMagical')}</h2>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><span className="font-semibold text-slate-800">{t('pages.nameTracing.personalizedConnection')}</span> {t('pages.nameTracing.personalizedConnectionDesc')}</li>
                    <li><span className="font-semibold text-slate-800">{t('pages.nameTracing.encouragingPractice')}</span> {t('pages.nameTracing.encouragingPracticeDesc')}</li>
                    <li><span className="font-semibold text-slate-800">{t('pages.nameTracing.teacherApproved')}</span> {t('pages.nameTracing.teacherApprovedDesc')}</li>
                  </ul>
                </div>
              </div>

              <div className="lg:sticky lg:top-28">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{t('pages.nameTracing.livePreview')}</h2>
                        <p className="text-xs text-slate-500">
                          {batchMode === 'batch'
                            ? (() => {
                              const count = formattedNames.length;
                              const layout = batchLayout === 'two-per-page' ? t('pages.nameTracing.twoPerPage') : batchLayout === 'four-per-page' ? t('pages.nameTracing.fourPerPage') : t('pages.nameTracing.onePerPage');
                              const paper = paperSize === 'a4' ? t('pages.nameTracing.paperSizes.a4') : paperSize === 'legal' ? t('pages.nameTracing.paperSizes.legal') : t('pages.nameTracing.paperSizes.usLetter');
                              const orientation = printOrientation === 'portrait' ? t('pages.nameTracing.portrait') : t('pages.nameTracing.landscape');
                              return t('pages.nameTracing.previewBatch').replace('{{count}}', String(count)).replace('{{nameCount}}', count === 1 ? '' : 's').replace('{{layout}}', layout).replace('{{paper}}', paper).replace('{{orientation}}', orientation);
                            })()
                            : (() => {
                              const paper = paperSize === 'a4' ? t('pages.nameTracing.paperSizes.a4') : paperSize === 'legal' ? t('pages.nameTracing.paperSizes.legal') : t('pages.nameTracing.paperSizes.usLetter');
                              const orientation = printOrientation === 'portrait' ? t('pages.nameTracing.portrait') : t('pages.nameTracing.landscape');
                              return t('pages.nameTracing.previewSingle').replace('{{paper}}', paper).replace('{{orientation}}', orientation);
                            })()
                          }
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
                        {batchMode === 'batch' ? t('pages.nameTracing.batchMode') : t('pages.nameTracing.readyToTrace')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-8 sm:p-12">
                    <div
                      id="name-tracing-sheet"
                      className="bg-white rounded-sm overflow-hidden transition-all duration-500"
                      style={{
                        boxShadow: '0 20px 50px -12px rgba(76, 29, 149, 0.15), 0 0 0 1px rgba(124, 58, 237, 0.05)',
                        transform: 'perspective(1000px) rotateY(-0.5deg)',
                      }}
                    >
                      {batchMode === 'batch' && formattedNames.length > 1 ? (
                        // Show multiple names in batch mode when there are multiple names
                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                          role="img"
                          aria-label={t('pages.nameTracing.nameTracingWorksheetsPreview')}
                          className="w-full h-auto"
                        >
                          <defs>
                            {(formattedNames as string[]).map((_: string, nameIndex: number) => {
                              const totalNames = formattedNames.length;
                              let worksheetWidth = pageWidth - margin * 2;
                              let worksheetHeight = pageHeight - margin * 2;

                              if (batchLayout === 'two-per-page' || (batchLayout === 'one-per-page' && totalNames === 2)) {
                                worksheetHeight = (pageHeight - margin * 2) / 2;
                              } else if (batchLayout === 'four-per-page' || (batchLayout === 'one-per-page' && totalNames > 2)) {
                                worksheetWidth = (pageWidth - margin * 2) / 2;
                                worksheetHeight = (pageHeight - margin * 2) / 2;
                              }

                              return (
                                <clipPath key={`clip-def-${nameIndex}`} id={`worksheet-clip-${nameIndex}`}>
                                  <rect x={0} y={0} width={worksheetWidth} height={worksheetHeight} />
                                </clipPath>
                              );
                            })}
                          </defs>
                          <rect x={0} y={0} width={pageWidth} height={pageHeight} fill={THEMES[colorTheme].bg} rx={36} />
                          <rect
                            x={margin - 24}
                            y={margin - 24}
                            width={pageWidth - (margin - 24) * 2}
                            height={pageHeight - (margin - 24) * 2}
                            fill="#ffffff"
                            stroke={THEMES[colorTheme as ColorTheme].secondary}
                            strokeWidth={2}
                            rx={28}
                          />

                          {/* Decorations for Batch Preview */}
                          {decoration !== 'none' && (
                            <g opacity="0.6" fill={THEMES[colorTheme].dots}>
                              {[
                                { x: margin + 10, y: margin + 10 },
                                { x: pageWidth - margin - 10, y: margin + 10 },
                                { x: margin + 10, y: pageHeight - margin - 10 },
                                { x: pageWidth - margin - 10, y: pageHeight - margin - 10 }
                              ].map((pos, i) => (
                                decoration === 'stars' ? (
                                  <path key={i} d={`M ${pos.x} ${pos.y - 12} L ${pos.x + 3} ${pos.y - 3} L ${pos.x + 12} ${pos.y - 3} L ${pos.x + 5} ${pos.y + 2} L ${pos.x + 8} ${pos.y + 12} L ${pos.x} ${pos.y + 6} L ${pos.x - 8} ${pos.y + 12} L ${pos.x - 5} ${pos.y + 2} L ${pos.x - 12} ${pos.y - 3} L ${pos.x - 3} ${pos.y - 3} Z`} />
                                ) : (
                                  <path key={i} d={`M ${pos.x} ${pos.y + 8} C ${pos.x - 16} ${pos.y - 8}, ${pos.x} ${pos.y - 16}, ${pos.x} ${pos.y - 4} C ${pos.x} ${pos.y - 16}, ${pos.x + 16} ${pos.y - 8}, ${pos.x} ${pos.y + 8}`} />
                                )
                              ))}
                            </g>
                          )}

                          {(formattedNames as string[]).map((name: string, nameIndex: number) => {
                            // Use the name from the map parameter directly - it's already the correct value
                            if (!name) return null;

                            const nameConfig = fittedFontConfigs[nameIndex] || fittedFontConfig;
                            const currentTheme = THEMES[colorTheme];
                            // Calculate position based on layout
                            // For preview, use a smart layout based on number of names
                            const totalNames = formattedNames.length;

                            let worksheetX = 0;
                            let worksheetY = 0;
                            let worksheetWidth = pageWidth - margin * 2;
                            let worksheetHeight = pageHeight - margin * 2;

                            if (batchLayout === 'two-per-page' || (batchLayout === 'one-per-page' && totalNames === 2)) {
                              // Two names: stack vertically
                              worksheetHeight = (pageHeight - margin * 2) / 2;
                              worksheetX = margin;
                              worksheetY = margin + nameIndex * worksheetHeight;
                            } else if (batchLayout === 'four-per-page' || (batchLayout === 'one-per-page' && totalNames > 2)) {
                              // Four names or more: use 2x2 grid
                              worksheetWidth = (pageWidth - margin * 2) / 2;
                              worksheetHeight = (pageHeight - margin * 2) / 2;
                              // Calculate grid position: column (0 or 1) and row (0 or 1)
                              const col = nameIndex % 2;
                              const row = Math.floor(nameIndex / 2);
                              worksheetX = margin + col * worksheetWidth;
                              worksheetY = margin + row * worksheetHeight;
                            } else {
                              // Single name: full page
                              worksheetX = margin;
                              worksheetY = margin;
                            }

                            // Adjust row calculations for smaller worksheets
                            const adjustedRowGap = batchLayout === 'two-per-page' || (batchLayout === 'one-per-page' && totalNames === 2)
                              ? rowGap * 0.8
                              : (batchLayout === 'four-per-page' || (batchLayout === 'one-per-page' && totalNames > 2))
                                ? rowGap * 0.6
                                : rowGap;
                            const adjustedMaxRows = Math.min(rowCount, Math.max(2, Math.floor((worksheetHeight - 120) / adjustedRowGap)));
                            const adjustedRows = practicingRows.slice(0, adjustedMaxRows);

                            return (
                              <g key={`worksheet-${nameIndex}-${name}`} transform={`translate(${worksheetX}, ${worksheetY})`} clipPath={`url(#worksheet-clip-${nameIndex})`}>
                                {adjustedRows.map((rowType: 'trace' | 'blank', rowIndex: number) => {
                                  const baselineY = 120 + rowIndex * adjustedRowGap;
                                  const startX = 40;
                                  const endX = Math.min(worksheetWidth - 20, startX + worksheetWidth - 60);
                                  const topLine = baselineY - baselineOffset;
                                  const midLine = baselineY - baselineOffset / 2;
                                  const showPrimary = lineStyle === 'primary';

                                  return (
                                    <g key={`row-${nameIndex}-${rowIndex}`}>
                                      {showPrimary && (
                                        <>
                                          <line x1={startX} y1={topLine} x2={endX} y2={topLine} stroke={currentTheme.secondary} strokeWidth={3} strokeDasharray="10 14" />
                                          <line x1={startX} y1={midLine} x2={endX} y2={midLine} stroke={currentTheme.secondary} opacity={0.5} strokeWidth={2.5} strokeDasharray="14 14" />
                                        </>
                                      )}
                                      <line x1={startX} y1={baselineY} x2={endX} y2={baselineY} stroke={currentTheme.primary} strokeWidth={4} />

                                      {rowType === 'blank' ? (
                                        <line x1={startX} y1={baselineY + 26} x2={endX} y2={baselineY + 26} stroke={currentTheme.secondary} strokeWidth={2} strokeDasharray="14 16" />
                                      ) : (
                                        <>
                                          {showGuideDots && (
                                            <circle cx={startX - 16} cy={baselineY - baselineOffset / 3} r={8} fill={currentTheme.dots} />
                                          )}

                                          {currentTheme.rainbow ? (
                                            <text
                                              x={startX}
                                              y={baselineY - 8}
                                              fontFamily={nameConfig.fontFamily}
                                              fontSize={nameConfig.fontSize}
                                              fontWeight={nameConfig.fontWeight as any}
                                              style={{ letterSpacing: `${nameConfig.letterSpacing}px` }}
                                            >
                                              {Array.from(name).map((char, charIdx) => (
                                                <tspan key={charIdx} fill={RAINBOW_COLORS[charIdx % RAINBOW_COLORS.length]}>{char}</tspan>
                                              ))}
                                            </text>
                                          ) : (
                                            <>
                                              {fontStyle === 'dotted' && (
                                                <text
                                                  x={startX}
                                                  y={baselineY - 8}
                                                  fontFamily={nameConfig.fontFamily}
                                                  fontSize={nameConfig.fontSize}
                                                  fontWeight={nameConfig.fontWeight as any}
                                                  fill={currentTheme.text}
                                                  style={{ letterSpacing: `${nameConfig.letterSpacing}px` }}
                                                >
                                                  {name}
                                                </text>
                                              )}
                                              <text
                                                x={startX}
                                                y={baselineY - 8}
                                                fontFamily={nameConfig.fontFamily}
                                                fontSize={nameConfig.fontSize}
                                                fontWeight={nameConfig.fontWeight}
                                                fill={fontStyle === 'dotted' ? 'none' : currentTheme.text}
                                                stroke={nameConfig.stroke}
                                                strokeWidth={nameConfig.strokeWidth}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDasharray={nameConfig.dashArray}
                                                style={{ letterSpacing: `${nameConfig.letterSpacing}px` }}
                                              >
                                                {name}
                                              </text>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </g>
                                  );
                                })}
                              </g>
                            );
                          })}
                          <text
                            x={margin}
                            y={pageHeight - margin + 10}
                            fontSize={18}
                            fontFamily="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif"
                            fill={THEMES[colorTheme].primary}
                          >
                            {t('pages.nameTracing.traceSlowly')}
                          </text>
                        </svg>
                      ) : (
                        // Single name preview (single mode or one-per-page batch mode)
                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                          role="img"
                          aria-label={t('pages.nameTracing.nameTracingWorksheetPreview')}
                          className="w-full h-auto"
                        >
                          <rect x={0} y={0} width={pageWidth} height={pageHeight} fill={THEMES[colorTheme].bg} rx={36} />
                          <rect
                            x={margin - 24}
                            y={margin - 24}
                            width={pageWidth - (margin - 24) * 2}
                            height={pageHeight - (margin - 24) * 2}
                            fill="#ffffff"
                            stroke={THEMES[colorTheme].secondary}
                            strokeWidth={2}
                            rx={28}
                          />

                          {/* Decorations for Single Preview */}
                          {decoration !== 'none' && (
                            <g opacity="0.6" fill={THEMES[colorTheme].dots}>
                              {[
                                { x: margin + 10, y: margin + 10 },
                                { x: pageWidth - margin - 10, y: margin + 10 },
                                { x: margin + 10, y: pageHeight - margin - 10 },
                                { x: pageWidth - margin - 10, y: pageHeight - margin - 10 }
                              ].map((pos, i) => (
                                decoration === 'stars' ? (
                                  <path key={i} d={`M ${pos.x} ${pos.y - 12} L ${pos.x + 3} ${pos.y - 3} L ${pos.x + 12} ${pos.y - 3} L ${pos.x + 5} ${pos.y + 2} L ${pos.x + 8} ${pos.y + 12} L ${pos.x} ${pos.y + 6} L ${pos.x - 8} ${pos.y + 12} L ${pos.x - 5} ${pos.y + 2} L ${pos.x - 12} ${pos.y - 3} L ${pos.x - 3} ${pos.y - 3} Z`} />
                                ) : (
                                  <path key={i} d={`M ${pos.x} ${pos.y + 8} C ${pos.x - 16} ${pos.y - 8}, ${pos.x} ${pos.y - 16}, ${pos.x} ${pos.y - 4} C ${pos.x} ${pos.y - 16}, ${pos.x + 16} ${pos.y - 8}, ${pos.x} ${pos.y + 8}`} />
                                )
                              ))}
                            </g>
                          )}

                          {rowsForPreview.map((rowType: 'trace' | 'blank', index: number) => {
                            const baselineY = margin + 120 + index * rowGap;
                            const startX = margin + 40;
                            const endX = pageWidth - margin + 20;
                            const topLine = baselineY - baselineOffset;
                            const midLine = baselineY - baselineOffset / 2;
                            const showPrimary = lineStyle === 'primary';
                            const currentTheme = THEMES[colorTheme];

                            const accessibilityLabel = rowType === 'blank'
                              ? t('pages.nameTracing.blankHandwritingLine')
                              : t('pages.nameTracing.traceableHandwritingLine');
                            return (
                              <g key={`row-${index}`} aria-label={accessibilityLabel}>
                                {showPrimary && (
                                  <>
                                    <line x1={startX} y1={topLine} x2={endX} y2={topLine} stroke={currentTheme.secondary} strokeWidth={3} strokeDasharray="10 14" />
                                    <line x1={startX} y1={midLine} x2={endX} y2={midLine} stroke={currentTheme.secondary} opacity={0.5} strokeWidth={2.5} strokeDasharray="14 14" />
                                  </>
                                )}
                                <line x1={startX} y1={baselineY} x2={endX} y2={baselineY} stroke={currentTheme.primary} strokeWidth={4} />

                                {rowType === 'blank' ? (
                                  <>
                                    <line
                                      x1={startX}
                                      y1={baselineY + 26}
                                      x2={endX}
                                      y2={baselineY + 26}
                                      stroke={currentTheme.secondary}
                                      strokeWidth={2}
                                      strokeDasharray="14 16"
                                    />
                                  </>
                                ) : (
                                  <>
                                    {showGuideDots && (
                                      <circle cx={startX - 16} cy={baselineY - baselineOffset / 3} r={8} fill={currentTheme.dots} />
                                    )}

                                    {currentTheme.rainbow ? (
                                      <text
                                        x={startX}
                                        y={baselineY - 8}
                                        fontFamily={fittedFontConfig.fontFamily}
                                        fontSize={fittedFontConfig.fontSize}
                                        fontWeight={fittedFontConfig.fontWeight as any}
                                        style={{ letterSpacing: `${fittedFontConfig.letterSpacing}px` }}
                                      >
                                        {Array.from(formattedName).map((char, charIdx) => (
                                          <tspan key={charIdx} fill={RAINBOW_COLORS[charIdx % RAINBOW_COLORS.length]}>{char}</tspan>
                                        ))}
                                      </text>
                                    ) : (
                                      <>
                                        {fontStyle === 'dotted' && (
                                          <text
                                            x={startX}
                                            y={baselineY - 8}
                                            fontFamily={fittedFontConfig.fontFamily}
                                            fontSize={fittedFontConfig.fontSize}
                                            fontWeight={fittedFontConfig.fontWeight as any}
                                            fill={currentTheme.text}
                                            style={{ letterSpacing: `${fittedFontConfig.letterSpacing}px` }}
                                          >
                                            {formattedName}
                                          </text>
                                        )}
                                        <text
                                          x={startX}
                                          y={baselineY - 8}
                                          fontFamily={fittedFontConfig.fontFamily}
                                          fontSize={fittedFontConfig.fontSize}
                                          fontWeight={fittedFontConfig.fontWeight}
                                          fill={fontStyle === 'dotted' ? 'none' : currentTheme.text}
                                          stroke={fittedFontConfig.stroke}
                                          strokeWidth={fittedFontConfig.strokeWidth}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeDasharray={fittedFontConfig.dashArray}
                                          style={{ letterSpacing: `${fittedFontConfig.letterSpacing}px` }}
                                        >
                                          {formattedName}
                                        </text>
                                      </>
                                    )}
                                  </>
                                )}
                              </g>
                            );
                          })}

                          <text
                            x={margin}
                            y={pageHeight - margin + 10}
                            fontSize={18}
                            fontFamily="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif"
                            fill={THEMES[colorTheme].primary}
                          >
                            {t('pages.nameTracing.traceSlowly')}
                          </text>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Helpful tips for joyful handwriting</h2>
                <div className="space-y-4 text-sm text-slate-600">
                  <p>
                    Encourage a <strong>rainbow trace</strong>: print two copies and ask your child to trace with different colors each time. This keeps their hand relaxed and builds muscle memory.
                  </p>
                  <p>
                    Use the <strong>fun name tracing worksheet for preschoolers</strong> as part of a morning routine. Pair it with a favorite song or timer so they know practice time is short and sweet.
                  </p>
                  <p>
                    Adjust the <strong>font size</strong> toggle when you need extra breathing room or a tighter fit—large gives beginners more space, while small keeps confident writers focused on tidy letters.
                  </p>
                  <p>
                    Ready for a challenge? Switch to the <strong>personalized handwriting practice for kids</strong> mode by turning off the dotted style and letting them write on the blank lines.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">More tools kids love</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <a
                    href="/printables/certificate-maker"
                    className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">Certificate Maker</h3>
                    <p className="text-xs text-slate-600 mt-1">Design printable awards with cute badges and editable text.</p>
                    <span className="mt-3 inline-flex text-xs font-semibold text-purple-600">Create certificate →</span>
                  </a>

                  <a
                    href="/worksheets/handwriting-worksheet-maker"
                    className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">Handwriting Worksheet Maker</h3>
                    <p className="text-xs text-slate-600 mt-1">Generate tracing rows for letters, words, or sentences in print or cursive.</p>
                    <span className="mt-3 inline-flex text-xs font-semibold text-purple-600">Build worksheet →</span>
                  </a>

                  <a
                    href="/kids"
                    className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">Kids Hub</h3>
                    <p className="text-xs text-slate-600 mt-1">Play free learning games, print puzzles, and explore 7-day skill plans.</p>
                    <span className="mt-3 inline-flex text-xs font-semibold text-purple-600">Visit Kids Hub →</span>
                  </a>
                </div>
              </div>

              <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Frequently asked questions</h2>
                <div className="space-y-4">
                  <details className="group rounded-2xl border border-slate-200 p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-800">
                      How can I help my child hold the pencil correctly?
                      <span className="ml-2 text-purple-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      Start with a short practice session, remind them of the tripod grip, and keep the wrist floating above the page. Use the friendly start dot so they always know where to begin each letter.
                    </p>
                  </details>
                  <details className="group rounded-2xl border border-slate-200 p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-800">
                      Can I create more than one name?
                      <span className="ml-2 text-purple-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      Absolutely. Print or download your first sheet, then come back to type new names for siblings, classmates, or the whole preschool group. Each worksheet is instant and free.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >

      {/* Print-only container (moved outside to prevent parent display:none from hiding it) */ }
  {
    isPrinting && (
      <div className="print-only" style={{ background: '#fff', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
        <style dangerouslySetInnerHTML={{
          __html: `
          @media screen {
            .print-only { display: none !important; }
          }
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            @page { 
              size: ${paperSize === 'us-letter' ? '8.5in 11in' : paperSize === 'a4' ? '210mm 297mm' : '8.5in 14in'}; 
              margin: 0; 
            }
            html, body { 
              margin: 0 !important; 
              padding: 0 !important; 
              height: auto !important;
              background: #fff !important;
            }
            .print-page {
              width: ${pageWidth}px;
              height: ${pageHeight}px;
              page-break-after: always;
              position: relative;
              overflow: hidden;
              margin: 0 auto;
            }
            svg { width: 100%; height: 100%; }
          }
        `}} />

        {batchLayout === 'one-per-page' || batchMode === 'single' ? (
          printNames.map((name: string, i: number) => (
            <div key={i} className="print-page">
              <div dangerouslySetInnerHTML={{ __html: generateSVGForName(name) }} />
            </div>
          ))
        ) : batchLayout === 'two-per-page' ? (
          (() => {
            const pages = [];
            for (let i = 0; i < printNames.length; i += 2) {
              const name1 = printNames[i];
              const name2 = printNames[i + 1];
              pages.push(
                <div key={i} className="print-page">
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(name1) }} />
                  {name2 && <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(name2) }} />}
                </div>
              );
            }
            return pages;
          })()
        ) : (
          // four-per-page
          (() => {
            const pages = [];
            for (let i = 0; i < printNames.length; i += 4) {
              const chunk = printNames.slice(i, i + 4);
              pages.push(
                <div key={i} className="print-page">
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(chunk[0]) }} />
                  {chunk[1] && <div style={{ position: 'absolute', top: 0, left: '50%', width: '50%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(chunk[1]) }} />}
                  {chunk[2] && <div style={{ position: 'absolute', top: '50%', left: 0, width: '50%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(chunk[2]) }} />}
                  {chunk[3] && <div style={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%' }} dangerouslySetInnerHTML={{ __html: generateSVGForName(chunk[3]) }} />}
                </div>
              );
            }
            return pages;
          })()
        )}
      </div>
    )
  }
    </>
  );
}
