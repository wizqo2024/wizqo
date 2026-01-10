import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { useTranslation } from '@/context/TranslationContext';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import jsPDF from 'jspdf';
import { CODYSTAR_TTF_BASE64 } from '@/lib/fonts';
import { hexToRgb } from '@/utils/pdfHelpers';

type Mode = 'letters' | 'words' | 'sentences';
type ColorTheme = 'classic' | 'rainbow' | 'ocean' | 'candy' | 'forest' | 'sunset';
type DecorationType = 'none' | 'stars' | 'hearts' | 'flowers';

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

export default function HandwritingMakerPage() {
  const { t, isRTL } = useTranslation();

  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);

  const { toast } = useToast();

  const [mode, setMode] = React.useState<Mode>('letters');
  const [letters, setLetters] = React.useState<string>('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
  const [words, setWords] = React.useState<string>('cat dog sun moon bus red blue green');
  const [sentences, setSentences] = React.useState<string>('I can write neatly. We like to read. Today is fun.');
  const [fontSize, setFontSize] = React.useState<number>(42);
  const [lineType, setLineType] = React.useState<'primary' | 'baseline'>('primary');
  const [dotted, setDotted] = React.useState<boolean>(true);
  const [startDots, setStartDots] = React.useState<boolean>(true);
  const [autoSpaceLetters, setAutoSpaceLetters] = React.useState<boolean>(true);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('classic');
  const [decoration, setDecoration] = React.useState<DecorationType>('none');
  const [textStyle, setTextStyle] = React.useState<'print' | 'cursive' | 'bubble'>('print');

  // Quick-fill helpers for nicer UX
  const applyLettersSample = (variant: 'lower' | 'upper' | 'mixed') => {
    if (variant === 'lower') setLetters('a b c d e f g h i j k l m n o p q r s t u v w x y z');
    else if (variant === 'upper') setLetters('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
    else setLetters('Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz');
  };
  const applyWordsSample = () => setWords('cat dog sun moon book pencil apple banana red blue green');
  const applySentencesSample = () => setSentences('I can write neatly. We like to read. Today is fun. Practice every day.');

  function printPreview() {
    try {
      const sheet = document.getElementById('handwriting-sheet');
      if (!sheet) return;
      const svg = sheet.querySelector('svg');
      const content = svg ? (svg as SVGElement).outerHTML : sheet.innerHTML;
      const nameLabel = t('pages.handwriting.name');
      const dateLabel = t('pages.handwriting.date');
      const html = `<!doctype html><html><head><meta charset=\"utf-8\"/>
<title>Print</title>
<style>
  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 8.5in; height: 11in; }
  #frame { position: relative; width: 8.5in; height: 11in; overflow: hidden; background: #fff; }
  /* Printed worksheet area */
  svg { position: absolute; left: 0.5in; top: 0.5in; width: 7.5in; height: 10in; }
  /* Logo in the top-left margin */
  #print-logo { position: absolute; top: 0.25in; left: 0.25in; width: 0.6in; height: auto; opacity: 0.95; }
  /* Name/Date footer */
  #print-footer { position: absolute; bottom: 0.35in; left: 0.5in; right: 0.5in; display: flex; justify-content: space-between; font: 12px system-ui, -apple-system, 'Segoe UI', Roboto, Arial; color: #334155; }
  #print-footer .label { margin-right: 6px; }
  #print-footer .line { border-bottom: 1px solid #94a3b8; min-width: 2.5in; height: 0.9em; display: inline-block; }
  
</style>
</head><body><div id=\"frame\"><img id=\"print-logo\" src=\"/favicon.svg\" alt=\"Wizqo\" />${content}<div id=\"print-footer\"><div><span class=\"label\">${nameLabel}</span><span class=\"line\"></span></div><div><span class=\"label\">${dateLabel}</span><span class=\"line\"></span></div></div></div></body></html>`;
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
      doc.open();
      doc.write(html);
      doc.close();
      const doPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch { }
        setTimeout(() => { try { document.body.removeChild(iframe); } catch { } }, 1000);
      };
      if (iframe.contentWindow?.document.readyState === 'complete') doPrint();
      else iframe.onload = doPrint;
    } catch { }
  }

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 36;
    const startY = 200;
    const fontSizeVal = fontSize;
    const lineGap = fontSizeVal * 2.2;
    const rowsPerPage = Math.floor((pageH - startY - margin) / lineGap);
    const theme = THEMES[colorTheme as ColorTheme] || THEMES.classic;

    // Load Codystar for dotted print
    doc.addFileToVFS('Codystar-Regular.ttf', CODYSTAR_TTF_BASE64);
    doc.addFont('Codystar-Regular.ttf', 'Codystar', 'normal');

    const drawHeader = () => {
      // Sheet Background
      const bgRGB = hexToRgb(theme.bg);
      doc.setFillColor(bgRGB.r, bgRGB.g, bgRGB.b);
      doc.rect(0, 0, pageW, pageH, 'F');

      // Decorations
      if (decoration !== 'none') {
        const decoRGB = hexToRgb(theme.dots);
        doc.setFillColor(decoRGB.r, decoRGB.g, decoRGB.b);
        const decoPos = [
          { x: margin - 10, y: margin - 10 },
          { x: pageW - margin + 10, y: margin - 10 },
          { x: margin - 10, y: pageH - margin + 10 },
          { x: pageW - margin + 10, y: pageH - margin + 10 }
        ];

        decoPos.forEach(pos => {
          if (decoration === 'stars') {
            const r = 8;
            const innerR = 3;
            const points: number[][] = [];
            for (let i = 0; i < 11; i++) {
              const radius = i % 2 === 0 ? r : innerR;
              const angle = (Math.PI * i) / 5 - Math.PI / 2;
              points.push([pos.x + radius * Math.cos(angle), pos.y + radius * Math.sin(angle)]);
            }
            for (let i = 0; i < points.length - 1; i++) {
              doc.triangle(pos.x, pos.y, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], 'F');
            }
          } else if (decoration === 'hearts') {
            const s = 5;
            doc.circle(pos.x - s / 1.5, pos.y - s / 2, s, 'F');
            doc.circle(pos.x + s / 1.5, pos.y - s / 2, s, 'F');
            doc.triangle(pos.x - s, pos.y + s / 4, pos.x + s, pos.y + s / 4, pos.x, pos.y + s * 2, 'F');
          } else if (decoration === 'flowers') {
            const s = 6;
            for (let i = 0; i < 5; i++) {
              const angle = (i * 72 * Math.PI) / 180;
              doc.ellipse(pos.x + Math.cos(angle) * s * 0.6, pos.y + Math.sin(angle) * s * 0.6, s * 0.4, s * 0.7, 'F', angle);
            }
            doc.circle(pos.x, pos.y, s * 0.3, 'F');
          }
        });
      }

      // Branding
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      const brandingRGB = hexToRgb('#0f172a');
      doc.setTextColor(brandingRGB.r, brandingRGB.g, brandingRGB.b);
      doc.text('Wizqo', margin, margin + 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const urlRGB = hexToRgb('#64748b');
      doc.setTextColor(urlRGB.r, urlRGB.g, urlRGB.b);
      doc.text('www.wizqo.com', pageW - margin, margin + 20, { align: 'right' });

      // Name/Date lines
      const lineY = margin + 65;
      doc.setFontSize(12);
      const textRGB = hexToRgb('#334155');
      doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
      doc.text(t('pages.handwriting.name'), margin, lineY);
      const lineRGB = hexToRgb(theme.secondary);
      doc.setDrawColor(lineRGB.r, lineRGB.g, lineRGB.b);
      doc.line(margin + 45, lineY + 2, margin + 220, lineY + 2);

      doc.text(t('pages.handwriting.date'), pageW - 140, lineY);
      doc.line(pageW - 105, lineY + 2, pageW - margin, lineY + 2);
    };

    // Logic to replicate PreviewSVG rows
    const srcText = (() => {
      if (mode === 'letters') {
        const cleaned = letters.replace(/\r?\n/g, ' <br> ');
        return cleaned.replace(/ {2,}/g, ' ').trim();
      }
      if (mode === 'words') {
        const withMarkers = words.replace(/\r?\n/g, ' <br> ');
        return withMarkers.replace(/ {2,}/g, ' ').trim();
      }
      const sentWithMarkers = sentences.replace(/\r?\n/g, ' <br> ');
      const parts = sentWithMarkers.split(/[\.!?]+/).map((s: string) => s.trim()).filter(Boolean);
      return parts.join(' ');
    })();

    // Wrapping logic
    const tokens = srcText ? srcText.split(' ') : [];
    const pdfRows: string[] = [];
    let current = '';
    const availableWidth = pageW - margin * 2 - 20;

    const measure = (txt: string) => {
      if (dotted) doc.setFont('Codystar', 'normal');
      else if (textStyle === 'cursive') doc.setFont('times', 'italic');
      else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');
      doc.setFontSize(fontSizeVal);
      return doc.getTextWidth(txt);
    };

    const letterSpacing = (() => {
      if (!autoSpaceLetters) return 0;
      if (textStyle === 'cursive') return 0;
      const base = (mode === 'letters' ? fontSizeVal * 0.18 : fontSizeVal * 0.25);
      return textStyle === 'bubble' ? base + fontSizeVal * 0.05 : base;
    })();

    const measureWithSpacing = (txt: string) => {
      const charCount = Array.from(txt).length;
      return measure(txt) + Math.max(0, charCount - 1) * letterSpacing;
    };

    const pushCurrent = () => { if (current) { pdfRows.push(current); current = ''; } };
    for (let ti = 0; ti < tokens.length; ti++) {
      const token = tokens[ti];
      if (token === '<br>') { pushCurrent(); continue; }
      const next = current ? `${current} ${token}` : token;
      if (measureWithSpacing(next) <= availableWidth) {
        current = next;
      } else {
        if (current) {
          pushCurrent();
          ti--;
        } else {
          let part = '';
          for (const ch of token) {
            if (measureWithSpacing(part + ch) <= availableWidth) {
              part += ch;
            } else {
              pdfRows.push(part);
              part = ch;
            }
          }
          current = part;
        }
      }
    }
    if (current) pdfRows.push(current);

    // Initial page header
    drawHeader();

    pdfRows.forEach((txt, idx) => {
      const pageIdx = Math.floor(idx / rowsPerPage);
      const rowInPage = idx % rowsPerPage;

      if (pageIdx > 0 && rowInPage === 0) {
        doc.addPage();
        drawHeader();
      }

      const y = startY + rowInPage * lineGap;
      const mid = y - fontSizeVal * 0.35;
      const top = y - fontSizeVal * 0.7;
      const baselineY = y;

      const secondaryRGB = hexToRgb(theme.secondary);
      const primaryRGB = hexToRgb(theme.primary);

      if (lineType === 'primary') {
        doc.setDrawColor(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
        doc.setLineWidth(1.5);
        doc.setLineDashPattern([8, 8], 0);
        doc.line(margin, top, pageW - margin, top);
        doc.setLineDashPattern([6, 10], 0);
        doc.line(margin, mid, pageW - margin, mid);
      }
      doc.setLineDashPattern([], 0);
      doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
      doc.setLineWidth(2);
      doc.line(margin, baselineY, pageW - margin, baselineY);

      if (startDots) {
        const dotRGB = hexToRgb(theme.dots);
        doc.setFillColor(dotRGB.r, dotRGB.g, dotRGB.b);
        doc.circle(margin + 8, baselineY - fontSizeVal * 0.2, 4, 'F');
      }

      if (dotted) doc.setFont('Codystar', 'normal');
      else if (textStyle === 'cursive') doc.setFont('times', 'italic');
      else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');

      doc.setFontSize(fontSizeVal);

      const rowTextColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
      const rowTextRGB = hexToRgb(rowTextColor);
      doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
      doc.setCharSpace(letterSpacing);

      const renderingMode = textStyle === 'bubble' ? 1 : 0;
      if (textStyle === 'bubble') {
        doc.setLineWidth(1);
        doc.setDrawColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
      }

      doc.text(txt, margin + 16, baselineY - 6, { renderingMode: renderingMode as any });
      doc.setCharSpace(0);
    });

    const fileNameText = (pdfRows[0] || 'worksheet').substring(0, 15).replace(/\s+/g, '-');
    doc.save(`handwriting-${fileNameText}.pdf`);
    toast({
      title: t('Downloaded'),
      description: t('Your handwriting worksheet has been saved as PDF.'),
    });
  };

  const content = React.useMemo(() => {
    if (mode === 'letters') return letters.split(/\s+/).filter(Boolean);
    if (mode === 'words') return words.split(/\s+/).filter(Boolean);
    return sentences.split(/\s*\.|\!|\?\s*/).filter(Boolean);
  }, [mode, letters, words, sentences]);

  function buildRows(maxRows: number): string[] {
    if (mode === 'letters') return content.slice(0, Math.min(maxRows, content.length));
    const rows: string[] = [];
    let i = 0;
    while (rows.length < maxRows && content.length) {
      rows.push(content[i % content.length]);
      i++;
    }
    return rows;
  }

  function PreviewSVG() {
    const pageW = 800;
    const pageH = 1000;
    const margin = 48;
    const lineGap = Math.max(48, fontSize + 12);
    const startY = margin + 40;
    const rowsCount = Math.floor((pageH - startY - margin) / lineGap);
    // Build source text and wrap to fit page width
    const src = (() => {
      if (mode === 'letters') {
        const withMarkers = letters.replace(/\r?\n/g, ' <br> ');
        return withMarkers.replace(/ {2,}/g, ' ').trim();
      }
      if (mode === 'words') {
        const withMarkers = words.replace(/\r?\n/g, ' <br> ');
        return withMarkers.replace(/ {2,}/g, ' ').trim();
      }
      const sentWithMarkers = sentences.replace(/\r?\n/g, ' <br> ');
      const parts = sentWithMarkers
        .split(/[\.!?]+/)
        .map((s: string) => s.trim())
        .filter(Boolean);
      return parts.join(' ');
    })();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontStackPrint = "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial";
    const fontStackCursive = "'Brush Script MT', 'Segoe Script', 'Snell Roundhand', 'Dancing Script', 'Pacifico', cursive";
    const fontFamily = textStyle === 'cursive' ? fontStackCursive : fontStackPrint;
    const fontWeight = textStyle === 'bubble' ? '800 ' : '';
    if (ctx) ctx.font = `${fontWeight}${fontSize}px ${fontFamily}`;
    const measure = (t: string) => (ctx ? ctx.measureText(t).width : t.length * (fontSize * 0.6));
    const availableWidth = pageW - (margin + 16) - margin - 20; // Added 20px safety margin
    const letterSpacing = (() => {
      if (!autoSpaceLetters) return 0;
      if (textStyle === 'cursive') return 0;
      // bubble needs a little extra space for stroke outline
      const base = (mode === 'letters' ? fontSize * 0.18 : fontSize * 0.25);
      return textStyle === 'bubble' ? base + fontSize * 0.05 : base;
    })();
    // Include CSS letter-spacing effect in our width measurement so lines wrap correctly
    const measureWithSpacing = (t: string) => {
      const charCount = Array.from(t).length;
      const base = measure(t);
      const extra = Math.max(0, charCount - 1) * letterSpacing;
      return base + extra;
    };
    const tokens = src ? src.split(' ') : [];
    const lines: string[] = [];
    let current = '';
    const pushCurrent = () => { if (current) { lines.push(current); current = ''; } };
    for (let ti = 0; ti < tokens.length && lines.length < rowsCount; ti++) {
      const token = tokens[ti];
      if (token === '<br>') { pushCurrent(); continue; }
      const next = current ? `${current} ${token}` : token;
      if (measureWithSpacing(next) <= availableWidth) {
        current = next;
        continue;
      }
      if (!current) {
        // token itself too long: split by characters
        let part = '';
        for (const ch of token) {
          const test = part + ch;
          if (measureWithSpacing(test) <= availableWidth) {
            part = test;
          } else {
            if (part) lines.push(part);
            part = ch;
            if (lines.length >= rowsCount) break;
          }
        }
        current = part;
      } else {
        pushCurrent();
        ti--; // reprocess token on next line
      }
    }
    if (lines.length < rowsCount && current) lines.push(current);
    const rows = lines.slice(0, rowsCount);
    const theme = THEMES[colorTheme as ColorTheme] || THEMES.classic;
    const baselineColor = theme.primary;
    const midlineColor = theme.secondary;
    const topLineColor = theme.secondary;

    const renderDecoration = (type: DecorationType, x: number, y: number, size: number) => {
      if (type === 'stars') {
        return (
          <path
            d={`M ${x} ${y - size} L ${x + size * 0.25} ${y - size * 0.25} L ${x + size} ${y - size * 0.15} L ${x + size * 0.4} ${y + size * 0.25} L ${x + size * 0.6} ${y + size} L ${x} ${y + size * 0.5} L ${x - size * 0.6} ${y + size} L ${x - size * 0.4} ${y + size * 0.25} L ${x - size} ${y - size * 0.15} L ${x - size * 0.25} ${y - size * 0.25} Z`}
            fill={theme.dots}
            opacity="0.6"
          />
        );
      }
      if (type === 'hearts') {
        return (
          <path
            d={`M ${x} ${y + size * 0.5} C ${x - size} ${y - size} ${x - size * 1.5} ${y + size * 1.5} ${x} ${y + size * 2} C ${x + size * 1.5} ${y + size * 1.5} ${x + size} ${y - size} ${x} ${y + size * 0.5} Z`}
            fill={theme.dots}
            opacity="0.6"
            transform={`translate(0, -${size})`}
          />
        );
      }
      if (type === 'flowers') {
        return (
          <g transform={`translate(${x},${y})`}>
            {[0, 72, 144, 216, 288].map(angle => (
              <ellipse key={angle} cx="0" cy={-size * 0.6} rx={size * 0.4} ry={size * 0.7} fill={theme.dots} opacity="0.6" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r={size * 0.3} fill={theme.primary} />
          </g>
        );
      }
      return null;
    };

    return (
      <svg viewBox={`0 0 ${pageW} ${pageH}`} className="w-full h-auto border border-slate-300 rounded transition-colors duration-300" style={{ background: theme.bg }} role="img" aria-label="Handwriting sheet preview">
        <rect x={margin / 2} y={margin / 2} width={pageW - margin} height={pageH - margin} fill="none" stroke={theme.secondary} strokeWidth={1} opacity="0.3" />

        {decoration !== 'none' && (
          <>
            {renderDecoration(decoration, margin / 2 + 15, margin / 2 + 15, 12)}
            {renderDecoration(decoration, pageW - margin / 2 - 15, margin / 2 + 15, 12)}
            {renderDecoration(decoration, margin / 2 + 15, pageH - margin / 2 - 15, 12)}
            {renderDecoration(decoration, pageW - margin / 2 - 15, pageH - margin / 2 - 15, 12)}
          </>
        )}

        {rows.map((text, idx) => {
          const y = startY + idx * lineGap;
          const mid = y - fontSize * 0.35;
          const top = y - fontSize * 0.7;
          const hasPrimary = lineType === 'primary';
          const baselineY = y;
          return (
            <g key={idx}>
              {hasPrimary && (
                <>
                  <line x1={margin} y1={top} x2={pageW - margin} y2={top} stroke={topLineColor} strokeWidth={1.5} strokeDasharray="8 8" />
                  <line x1={margin} y1={mid} x2={pageW - margin} y2={mid} stroke={midlineColor} strokeWidth={1.5} strokeDasharray="6 10" />
                </>
              )}
              <line x1={margin} y1={baselineY} x2={pageW - margin} y2={baselineY} stroke={baselineColor} strokeWidth={2} />
              {startDots && (
                <circle cx={margin + 8} cy={baselineY - fontSize * 0.2} r={4} fill="#10b981" />
              )}
              <text
                x={margin + 16}
                y={baselineY - 6}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fill={(() => {
                  if (textStyle === 'bubble') return 'none';
                  if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                  return dotted ? 'none' : theme.text;
                })()}
                stroke={(() => {
                  if (textStyle === 'bubble') return theme.text;
                  if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                  return dotted ? theme.text : 'none';
                })()}
                strokeWidth={(() => {
                  if (textStyle === 'bubble') return 3;
                  return dotted ? 2 : 0;
                })()}
                strokeDasharray={(() => {
                  if (textStyle === 'bubble') return dotted ? '4 6' : undefined;
                  return dotted ? '3 5' : undefined;
                })()}
                strokeLinecap={dotted ? 'round' as any : undefined}
                style={{ vectorEffect: 'non-scaling-stroke', paintOrder: 'stroke fill', letterSpacing: autoSpaceLetters ? `${letterSpacing}px` : undefined } as any}
              >
                {text}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.handwriting.title')}
        description={t('pages.handwriting.subtitle')}
        keywords="handwriting worksheets, handwriting practice sheets, printable handwriting worksheets, tracing worksheets, cursive handwriting worksheets, print handwriting worksheets, handwriting practice for kids, free handwriting worksheets PDF"
        canonicalUrl="https://wizqo.com/worksheets/handwriting-worksheet-maker"
      />
      <UnifiedNavigation currentPage="kids" />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/handwriting-worksheet-maker";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/2nd-grade-math-worksheets" },
            { "@type": "ListItem", position: 3, name: "Handwriting Worksheet Maker", item: "https://wizqo.com/worksheets/handwriting-worksheet-maker" }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Free Handwriting Practice Sheets for Kids | Printable Tracing Worksheets",
          url: "https://wizqo.com/worksheets/handwriting-worksheet-maker",
          description: "Generate printable handwriting practice sheets with guidelines and dotted letters. Practice A–Z, words, or sentences and save as PDF.",
          breadcrumb: { "@id": breadcrumbId }
        } as const;
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I download the worksheet as PDF?",
              acceptedAnswer: { "@type": "Answer", text: "Click ‘Print / Save as PDF’ and use your browser’s Print → Save as PDF." }
            },
            {
              "@type": "Question",
              name: "Can I adjust font size and letter spacing?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. Use Font size and the Auto‑space letters toggle to increase spacing for letters, words, or sentences." }
            },
            {
              "@type": "Question",
              name: "Will it fit on one page when printing?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. The preview is sized to a single Letter page and prints without overflow." }
            }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}
      {/* Print-only styles to show preview only */}
      <style>{`
        @media print {
          @page { size: 8.5in 11in; margin: 0; }
          html, body { margin: 0; padding: 0; overflow: hidden !important; }
          body * { visibility: hidden !important; }
          #handwriting-sheet, #handwriting-sheet * { visibility: visible !important; }
          #handwriting-sheet {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 8in !important; height: 10.5in !important;
            margin: 0.25in !important; padding: 0 !important; border: 0 !important;
            overflow: hidden !important; page-break-before: avoid; page-break-after: avoid; break-inside: avoid-page;
          }
          #handwriting-sheet svg { width: 8in !important; height: 10.5in !important; break-inside: avoid-page; }
          /* Show small logo in top-left margin when printing from the page directly */
          #print-logo-inline { position: fixed; top: 0.15in; left: 0.15in; width: 0.5in; height: auto; visibility: visible !important; }
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">{t('pages.handwriting.title')}</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">{t('pages.handwriting.subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Controls */}
          <div className="order-2 md:order-1 md:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full whitespace-normal">
            {/* Mode segmented control */}
            <div className="mb-4">
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(v: string) => v && setMode(v as Mode)}
                className="justify-start border border-slate-200 rounded-lg overflow-hidden"
              >
                <ToggleGroupItem value="letters" className="px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0">
                  {t('pages.handwriting.mode.letters')}
                </ToggleGroupItem>
                <ToggleGroupItem value="words" className="px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0 border-l border-slate-200">
                  {t('pages.handwriting.mode.words')}
                </ToggleGroupItem>
                <ToggleGroupItem value="sentences" className="px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0 border-l border-slate-200">
                  {t('pages.handwriting.mode.sentences')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {mode === 'letters' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">{t('pages.handwriting.mode.letters')}</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => applyLettersSample('upper')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">{t('pages.handwriting.quickFill.uppercase')}</button>
                      <button type="button" onClick={() => applyLettersSample('lower')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">{t('pages.handwriting.quickFill.lowercase')}</button>
                      <button type="button" onClick={() => applyLettersSample('mixed')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">{t('pages.handwriting.quickFill.mixed')}</button>
                      <button type="button" onClick={() => setLetters('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea
                    value={letters}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const v = e.target.value;
                      if (autoSpaceLetters) {
                        // Preserve manual newlines while auto-spacing letters per line
                        const spacedByLine = v
                          .split(/\r?\n/)
                          .map((line: string) => line.replace(/\s+/g, '').split('').join(' '))
                          .join('\n');
                        setLetters(spacedByLine);
                      } else {
                        setLetters(v);
                      }
                    }}
                    className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoSpaceLetters(e.target.checked)} /> {t('pages.handwriting.options.autoSpace')}
                  </label>
                </div>
              )}
              {mode === 'words' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">{t('pages.handwriting.mode.words')}</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={applyWordsSample} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">{t('pages.handwriting.quickFill.words')}</button>
                      <button type="button" onClick={() => setWords('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea value={words} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWords(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoSpaceLetters(e.target.checked)} /> {t('pages.handwriting.options.autoSpace')}
                  </label>
                </div>
              )}
              {mode === 'sentences' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">{t('pages.handwriting.mode.sentences')}</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={applySentencesSample} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">{t('pages.handwriting.quickFill.sentences')}</button>
                      <button type="button" onClick={() => setSentences('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea value={sentences} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSentences(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoSpaceLetters(e.target.checked)} /> {t('pages.handwriting.options.autoSpace')}
                  </label>
                </div>
              )}

              {/* Premium Aesthetics Section */}
              <div className="mt-4 border-t pt-4 space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    {t('Color Theme')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(THEMES) as ColorTheme[]).map((tKey) => (
                      <button
                        key={tKey}
                        onClick={() => setColorTheme(tKey)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${colorTheme === tKey ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                          }`}
                        style={{ background: THEMES[tKey].primary }}
                        title={THEMES[tKey].name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    {t('Decorations')}
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={decoration}
                    onValueChange={(v: string) => v && setDecoration(v as DecorationType)}
                    className="justify-start gap-2"
                  >
                    {[
                      { id: 'none', label: 'None', icon: '🚫' },
                      { id: 'stars', label: 'Stars', icon: '⭐' },
                      { id: 'hearts', label: 'Hearts', icon: '❤️' },
                      { id: 'flowers', label: 'Flowers', icon: '🌸' },
                    ].map(dec => (
                      <ToggleGroupItem
                        key={dec.id}
                        value={dec.id}
                        className="px-3 py-1 h-8 text-xs border rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white"
                      >
                        <span className="mr-1">{dec.icon}</span> {dec.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              {/* Standard Options */}
              <div className="mt-4 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.fontSize')}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={28}
                      max={72}
                      step={2}
                      value={fontSize}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFontSize(parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <span className="text-xs font-bold text-slate-700 w-6">{fontSize}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.textStyle')}</Label>
                  <select
                    value={textStyle}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTextStyle(e.target.value as any)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="print">✍️ {t('pages.handwriting.options.print')}</option>
                    <option value="cursive">🖋️ {t('pages.handwriting.options.cursive')}</option>
                    <option value="bubble">🫧 {t('pages.handwriting.options.bubble')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.lineType')}</Label>
                  <ToggleGroup
                    type="single"
                    value={lineType}
                    onValueChange={(v: string) => v && setLineType(v as 'primary' | 'baseline')}
                    className="grid grid-cols-2 gap-2"
                  >
                    <ToggleGroupItem
                      value="primary"
                      className="px-3 py-1.5 h-auto text-[10px] font-bold uppercase rounded-lg border data-[state=on]:bg-purple-600 data-[state=on]:border-purple-600 data-[state=on]:text-white"
                    >
                      Three Lines
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="baseline"
                      className="px-3 py-1.5 h-auto text-[10px] font-bold uppercase rounded-lg border data-[state=on]:bg-purple-600 data-[state=on]:border-purple-600 data-[state=on]:text-white"
                    >
                      Single Line
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">{t('pages.handwriting.options.dotted')}</Label>
                    <Switch checked={dotted} onCheckedChange={(checked: boolean) => setDotted(checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">{t('pages.handwriting.options.startDots')}</Label>
                    <Switch checked={startDots} onCheckedChange={(checked: boolean) => setStartDots(checked)} />
                  </div>
                </div>
              </div>

              <div className="print:hidden pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('Download PDF')}</span>
                </button>
                <button
                  onClick={printPreview}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                >
                  <Printer className="h-4 w-4" />
                  <span>{t('Print Worksheet')}</span>
                </button>
              </div>
              {/* Tips moved here below the Print button */}
              <div className="mt-4 print:hidden">
                <h2 className="text-sm font-semibold text-slate-900">Tips for better handwriting</h2>
                <ul className="mt-2 list-disc list-inside text-xs text-slate-700 space-y-1">
                  <li>Use short sessions (5–10 minutes) with frequent praise.</li>
                  <li>Model one clean letter, then let your child trace and copy.</li>
                  <li>Keep wrist straight, grip relaxed; paper slightly tilted.</li>
                  <li>Say letter strokes out loud (e.g., “down, around, close”).</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="order-1 md:order-2 md:col-span-7 w-full min-w-0" id="handwriting-preview">
            <img id="print-logo-inline" src="/favicon.svg" alt="Wizqo" className="hidden print:block" />
            <div className="mb-2 text-slate-700 text-sm font-medium print:hidden">Preview</div>
            <div id="handwriting-sheet" className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm print:border-0 print:shadow-none print:rounded-none print:p-0">
              <PreviewSVG key={`${mode}-${lineType}-${fontSize}-${dotted}-${startDots}-${autoSpaceLetters}-${textStyle}-${colorTheme}-${decoration}`} />
            </div>
            <div className="text-xs text-slate-500 mt-2 print:hidden">Tip: Long text wraps to the next line automatically.</div>
          </div>
        </section>

        {/* Explore More Worksheets (SEO-friendly, hidden in print) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 print:hidden">
          <h2 className="text-xl font-bold text-slate-900">Explore More Worksheets</h2>
          <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">1st Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">2nd Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">Reading Comprehension Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
          </ul>
        </section>


      </main>
      <Footer />
    </div>
  );
}
