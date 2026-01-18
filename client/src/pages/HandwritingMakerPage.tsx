import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { useTranslation } from '@/context/TranslationContext';
import { Download, Printer, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import jsPDF from 'jspdf';
import { hexToRgb } from '@/utils/pdfHelpers';
import { trackWorksheetDownload } from '@/utils/analytics';

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
    // Add Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playwrite+GB+S:wght@100..400&family=Sacramento&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add Local Fonts for preview
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Codystar';
        src: url('/fonts/codystar.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Cedarville Cursive';
        src: url('/fonts/cedarville_cursive.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Learning Curve';
        src: url('/fonts/learning_curve.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'ABeeZee';
        src: url('/fonts/abeezee_regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Learning Curve Dashed';
        src: url('/fonts/learning_curve_dashed.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const { toast } = useToast();

  const [mode, setMode] = React.useState<Mode>('sentences');
  const [letters, setLetters] = React.useState<string>('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
  const [words, setWords] = React.useState<string>('cat dog sun moon bus red blue green');
  const [sentences, setSentences] = React.useState<string>('I can write neatly. We like to read. Today is fun.');
  const [fontSize, setFontSize] = React.useState<number>(72);
  const [lineType, setLineType] = React.useState<'primary' | 'baseline'>('primary');
  const [dotted, setDotted] = React.useState<boolean>(true);
  const [startDots, setStartDots] = React.useState<boolean>(true);
  const [autoSpaceLetters, setAutoSpaceLetters] = React.useState<boolean>(false);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('forest');
  const [decoration, setDecoration] = React.useState<DecorationType>('flowers');
  const [textStyle, setTextStyle] = React.useState<'print' | 'cursive' | 'bubble' | 'true-monoline' | 'monoline-cursive' | 'school-cursive'>('true-monoline');
  const [tracingStyle, setTracingStyle] = React.useState<'dotted' | 'faint'>('faint');
  const [showModelWord, setShowModelWord] = React.useState<boolean>(true);

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
  @import url('https://fonts.googleapis.com/css2?family=Playwrite+GB+S:wght@100..400&family=Sacramento&display=swap');
  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 8.5in; height: 11in; }
  #frame { position: relative; width: 8.5in; height: 11in; overflow: hidden; background: #fff; }
  /* Printed worksheet area */
  svg { position: absolute; left: 0.5in; top: 0.5in; width: 7.5in; height: 10in; }
  /* Custom Font overrides */
  .playwrite { font-family: 'Playwrite GB S', cursive; }
  /* Name/Date footer */
  #print-footer { position: absolute; bottom: 0.35in; left: 0.5in; right: 0.5in; display: flex; justify-content: space-between; font: 12px system-ui, -apple-system, 'Segoe UI', Roboto, Arial; color: #334155; }
  #print-footer .label { margin-right: 6px; }
  #print-footer .line { border-bottom: 1px solid #94a3b8; min-width: 2.5in; height: 0.9em; display: inline-block; }
  
</style>
</head><body><div id=\"frame\">${content}<div id=\"print-footer\"><div><span class=\"label\">${nameLabel}</span><span class=\"line\"></span></div><div><span class=\"label\">${dateLabel}</span><span class=\"line\"></span></div></div></div></body></html>`;
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

      // Track print intent as download
      trackWorksheetDownload('handwriting-maker', `${mode}-worksheet`, 'handwriting-maker', 'handwriting')
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
    const startY = 140;
    const fontSizeVal = fontSize;
    const lineGap = fontSizeVal * 2.0;
    const rowsPerPage = Math.floor((pageH - startY - margin) / lineGap);
    const theme = THEMES[colorTheme as ColorTheme] || THEMES.classic;

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

    const [codystarB64, cedarvilleB64, learningCurveDashedB64, learningCurveSolidB64, abeezeeB64] = await Promise.all([
      fetchFontBase64('/fonts/codystar.ttf'),
      fetchFontBase64('/fonts/cedarville_cursive.ttf'),
      fetchFontBase64('/fonts/learning_curve_dashed.ttf'),
      fetchFontBase64('/fonts/learning_curve.ttf'),
      fetchFontBase64('/fonts/abeezee_regular.ttf')
    ]);

    // Load Codystar for dotted print
    doc.addFileToVFS('Codystar-Regular.ttf', codystarB64);
    doc.addFont('Codystar-Regular.ttf', 'Codystar', 'normal');

    // Load Cedarville Cursive for cursive style
    doc.addFileToVFS('Cedarville-Cursive.ttf', cedarvilleB64);
    doc.addFont('Cedarville-Cursive.ttf', 'Cedarville-Cursive', 'normal');

    // Load Learning Curve styles
    doc.addFileToVFS('LearningCurve-Dashed.ttf', learningCurveDashedB64);
    doc.addFont('LearningCurve-Dashed.ttf', 'LearningCurve-Dashed', 'normal');
    doc.addFileToVFS('LearningCurve-Solid.ttf', learningCurveSolidB64);
    doc.addFont('LearningCurve-Solid.ttf', 'LearningCurve', 'normal');

    // Load ABeeZee for monoline print
    doc.addFileToVFS('ABeeZee-Regular.ttf', abeezeeB64);
    doc.addFont('ABeeZee-Regular.ttf', 'ABeeZee', 'normal');

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

      // Name/Date removed to prevent overlap in compact layout
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

    const letterSpacingAdjustment = (() => {
      if (textStyle === 'school-cursive') return 20; // Match Playwrite wide kerning
      if (textStyle === 'monoline-cursive') return 10;
      return 0;
    })();

    const measure = (txt: string) => {
      if (textStyle === 'true-monoline') doc.setFont('LearningCurve-Dashed', 'normal');
      else if (textStyle === 'monoline-cursive') doc.setFont('LearningCurve', 'normal');
      else if (textStyle === 'school-cursive') doc.setFont('ABeeZee', 'normal');
      else if (textStyle === 'cursive') doc.setFont('Cedarville-Cursive', 'normal');
      else if (dotted) doc.setFont('Codystar', 'normal');
      else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');
      doc.setFontSize(fontSizeVal);
      return doc.getTextWidth(txt) + (txt.length * letterSpacingAdjustment);
    };

    const letterSpacing = (() => {
      if (!autoSpaceLetters) {
        // Match PreviewSVG: 0.02em for cursives, 0 for others (including monoline)
        const isCursive = textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive';
        return isCursive ? fontSizeVal * 0.02 : 0;
      }
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

      // Ensure footer-style adjustments for kerning are applied consistently during drawing
      doc.setCharSpace(letterSpacing + letterSpacingAdjustment);
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

      doc.setFontSize(fontSizeVal);

      // Rendering word by word to support per-word styles (Model Word)
      const wordsInRow = txt.split(' ');
      let currentX = margin + 16;

      wordsInRow.forEach((word, wordIdx) => {
        // Only model the first token in the row
        const isModel = showModelWord && wordIdx === 0;
        const isFaint = tracingStyle === 'faint' && !isModel;
        const isDotted = tracingStyle === 'dotted' && !isModel;

        const wordToDraw = word + (wordIdx < wordsInRow.length - 1 ? ' ' : '');

        // If it's a model word, we might still want to only solidify the first letter
        // if it's "Letters" mode or a very long continuous string (like "ffff...")
        const onlyFirstCharModel = isModel && (mode === 'letters' || word.length > 5);

        if (onlyFirstCharModel) {
          const firstChar = wordToDraw.substring(0, 1);
          const restOfWord = wordToDraw.substring(1);

          // Draw the SOLID first character
          const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
          if (textStyle === 'true-monoline') doc.setFont('LearningCurve-Dashed', 'normal');
          else if (textStyle === 'monoline-cursive') doc.setFont('LearningCurve', 'normal');
          else if (textStyle === 'school-cursive') doc.setFont('ABeeZee', 'normal');
          else if (textStyle === 'cursive') doc.setFont('Cedarville-Cursive', 'normal');
          else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');

          let textColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
          const rowTextRGB = hexToRgb(textColor);
          doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
          doc.setLineDashPattern([], 0);
          doc.setLineWidth(0);

          doc.text(firstChar, currentX, baselineY - 6, { renderingMode: 0 });
          currentX += doc.getTextWidth(firstChar);

          // Now draw the TRACING rest of the word
          if (textStyle === 'true-monoline') doc.setFont('LearningCurve-Dashed', 'normal');
          else if (textStyle === 'monoline-cursive') doc.setFont('LearningCurve', 'normal');
          else if (textStyle === 'school-cursive') doc.setFont('ABeeZee', 'normal');
          else if (textStyle === 'cursive') doc.setFont('Cedarville-Cursive', 'normal');
          else if (tracingStyle === 'dotted') doc.setFont('Codystar', 'normal');
          else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');

          if (tracingStyle === 'faint') {
            doc.setTextColor(203, 213, 225); // Slate-300
          } else {
            doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
          }

          const isTracing = tracingStyle === 'dotted' && !isMonoline && textStyle !== 'bubble';
          const renderingMode = (textStyle === 'bubble' || isTracing) ? 1 : 0;
          if (isTracing) {
            const isCursiveStyle = textStyle === 'cursive';
            doc.setLineWidth(isCursiveStyle ? 0.2 : 0.8);
            doc.setLineDashPattern(isCursiveStyle ? [1.5, 1.5] : [3, 3], 0);
          } else if (textStyle === 'bubble') {
            doc.setLineWidth(1);
            doc.setLineDashPattern(tracingStyle === 'dotted' ? [4, 6] : [], 0);
          }

          doc.text(restOfWord, currentX, baselineY - 6, { renderingMode: renderingMode as any });
          currentX += doc.getTextWidth(restOfWord);
        } else {
          // Standard full-word model or full-word tracing
          const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
          if (textStyle === 'true-monoline') doc.setFont('LearningCurve-Dashed', 'normal');
          else if (textStyle === 'monoline-cursive') doc.setFont('LearningCurve', 'normal');
          else if (textStyle === 'school-cursive') doc.setFont('ABeeZee', 'normal');
          else if (textStyle === 'cursive') doc.setFont('Cedarville-Cursive', 'normal');
          else if (isDotted) doc.setFont('Codystar', 'normal');
          else doc.setFont('helvetica', textStyle === 'bubble' ? 'bold' : 'normal');

          let textColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
          if (isFaint) textColor = '#cbd5e1';

          const rowTextRGB = hexToRgb(textColor);
          doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
          doc.setDrawColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);

          const isTracing = isDotted && !isMonoline && textStyle !== 'bubble';
          const renderingMode = (textStyle === 'bubble' || isTracing) ? 1 : 0;

          if (isTracing) {
            const isCursiveStyle = textStyle === 'cursive';
            doc.setLineWidth(isCursiveStyle ? 0.2 : 0.8);
            doc.setLineDashPattern(isCursiveStyle ? [1.5, 1.5] : [3, 3], 0);
          } else if (textStyle === 'bubble') {
            doc.setLineWidth(1);
            doc.setLineDashPattern(isDotted ? [4, 6] : [], 0);
          } else {
            doc.setLineDashPattern([], 0);
            doc.setLineWidth(0);
          }

          doc.text(wordToDraw, currentX, baselineY - 6, { renderingMode: renderingMode as any });
          currentX += doc.getTextWidth(wordToDraw);
        }
      });

      // Reset dash pattern and line width for next elements
      doc.setLineDashPattern([], 0);
      doc.setLineWidth(1);
      doc.setCharSpace(0);
    });

    const fileNameText = (pdfRows[0] || 'worksheet').substring(0, 15).replace(/\s+/g, '-');
    doc.save(`handwriting-${fileNameText}.pdf`);

    // Track download
    trackWorksheetDownload('handwriting-maker', `${mode}-pdf`, 'handwriting-maker', 'handwriting')

    // CREATIVE UPGRADE: Confetti Celebration
    const colors = theme.rainbow ? RAINBOW_COLORS : [theme.primary, theme.text, theme.dots];
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '9999';
      conf.style.left = Math.random() * 100 + 'vw';
      conf.style.top = '-5vh';
      conf.style.width = '10px';
      conf.style.height = '10px';
      conf.style.pointerEvents = 'none';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      conf.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(conf);

      const animation = conf.animate([
        { top: '-5vh', transform: `rotate(0deg) translateX(0px)`, opacity: 1 },
        { top: '105vh', transform: `rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 200 - 100}px)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 3000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      animation.onfinish = () => conf.remove();
    }

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
    const fontStackCursive = "'Cedarville Cursive', 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', 'Dancing Script', 'Pacifico', cursive";
    const fontStackSchool = "'Playwrite GB S', 'Segoe UI', cursive";
    const fontStackMonoline = "'Sacramento', cursive";
    const fontStackTrueMonoline = "'Learning Curve Dashed', 'Segoe UI', system-ui, sans-serif";
    const fontStackKidsMonoline = "'Learning Curve', 'Sacramento', cursive";
    const fontStackSchoolMonoline = "'ABeeZee', 'Segoe UI', sans-serif";
    const fontFamily = (() => {
      if (textStyle === 'true-monoline') return fontStackTrueMonoline;
      if (textStyle === 'monoline-cursive') return fontStackKidsMonoline;
      if (textStyle === 'school-cursive') return fontStackSchoolMonoline;
      if (textStyle === 'cursive') return fontStackCursive;
      return fontStackPrint;
    })();
    const fontWeight = textStyle === 'bubble' ? '800 ' : '';
    if (ctx) ctx.font = `${fontWeight}${fontSize}px ${fontFamily}`;
    const letterSpacingAdjustment = (() => {
      if (textStyle === 'school-cursive') return 20; // Match Playwrite wide kerning
      if (textStyle === 'monoline-cursive') return 10;
      return 0;
    })();
    const measure = (t: string) => (ctx ? ctx.measureText(t).width + (t.length * letterSpacingAdjustment) : t.length * (fontSize * 0.6));
    const availableWidth = pageW - (margin + 16) - margin - 20; // Added 20px safety margin
    const letterSpacing = (() => {
      if (!autoSpaceLetters) return 0;
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
                style={{
                  vectorEffect: 'non-scaling-stroke',
                  paintOrder: 'stroke fill',
                  letterSpacing: autoSpaceLetters
                    ? `${letterSpacing}px`
                    : (textStyle === 'true-monoline' ? '0' : (textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive' ? '0.02em' : undefined))
                } as any}
              >
                {(() => {
                  const parts = text.split(' ');
                  return parts.map((part, pIdx) => {
                    const isModel = showModelWord && pIdx === 0;
                    const isFaint = tracingStyle === 'faint' && !isModel;
                    const isDotted = tracingStyle === 'dotted' && !isModel;

                    const word = part + (pIdx < parts.length - 1 ? ' ' : '');
                    const onlyFirstCharModel = isModel && (mode === 'letters' || part.length > 5);

                    if (onlyFirstCharModel) {
                      const firstChar = word.substring(0, 1);
                      const rest = word.substring(1);
                      return (
                        <React.Fragment key={pIdx}>
                          <tspan fill={theme.text} stroke="none" strokeWidth={0}>{firstChar}</tspan>
                          <tspan
                            fill={(() => {
                              const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
                              if (isMonoline) return tracingStyle === 'faint' ? '#cbd5e1' : theme.text;
                              if (textStyle === 'bubble') return 'none';
                              if (tracingStyle === 'faint') return '#cbd5e1';
                              if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                              return tracingStyle === 'dotted' ? 'none' : theme.text;
                            })()}
                            stroke={(() => {
                              const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
                              if (isMonoline) return 'none';
                              if (textStyle === 'bubble') return tracingStyle === 'faint' ? '#cbd5e1' : theme.text;
                              if (tracingStyle === 'faint') return 'none';
                              if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                              return tracingStyle === 'dotted' ? theme.text : 'none';
                            })()}
                            strokeWidth={(() => {
                              if (textStyle === 'bubble') return 3;
                              if (tracingStyle === 'faint') return 0;
                              // Ultra-thin collapse for cursive to simulate a single-path monoline look
                              return (tracingStyle === 'dotted' && (textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive')) ? 0.4 : 2;
                            })()}
                            strokeDasharray={(() => {
                              if (tracingStyle === 'faint') return undefined;
                              if (textStyle === 'bubble') return tracingStyle === 'dotted' ? '4 6' : undefined;
                              // Even denser dots for the ultra-thin collapsed path
                              return (tracingStyle === 'dotted' && (textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive')) ? '1.5 2.5' : '3 5';
                            })()}
                            strokeLinecap={tracingStyle === 'dotted' ? 'round' as any : undefined}
                            strokeLinejoin={tracingStyle === 'dotted' ? 'round' as any : undefined}
                          >
                            {rest}
                          </tspan>
                        </React.Fragment>
                      );
                    }

                    return (
                      <tspan
                        key={pIdx}
                        fill={(() => {
                          const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
                          if (textStyle === 'bubble') return 'none';
                          if (isMonoline) return isFaint ? '#cbd5e1' : theme.text;
                          if (isModel) return theme.text; // Solid model word
                          if (isFaint) return '#cbd5e1'; // Faint solid path (standardized)
                          if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                          return isDotted ? 'none' : theme.text;
                        })()}
                        stroke={(() => {
                          const isMonoline = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'school-cursive';
                          if (isMonoline) return 'none';
                          if (isModel) return 'none'; // No stroke for model
                          if (textStyle === 'bubble') return isFaint ? '#cbd5e1' : theme.text;
                          if (isFaint) return 'none'; // No stroke for faint print/cursive
                          if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                          return isDotted ? theme.text : 'none';
                        })()}
                        strokeWidth={(() => {
                          if (isModel) return 0;
                          if (textStyle === 'bubble') return 3;
                          if (isFaint) return 0;
                          return (isDotted && (textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive')) ? 0.4 : 2;
                        })()}
                        strokeDasharray={(() => {
                          if (isModel || isFaint) return undefined;
                          if (textStyle === 'bubble') return isDotted ? '4 6' : undefined;
                          return (isDotted && (textStyle === 'cursive' || textStyle === 'school-cursive' || textStyle === 'monoline-cursive')) ? '1.5 2.5' : '3 5';
                        })()}
                        strokeLinecap={isDotted ? 'round' as any : undefined}
                        strokeLinejoin={isDotted ? 'round' as any : undefined}
                      >
                        {word}
                      </tspan>
                    );
                  });
                })()}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-700 bg-dotted-pattern" style={{ backgroundColor: THEMES[colorTheme as ColorTheme].bg }} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title="Free Name Tracing & Cursive Writing Worksheet Maker | Wizqo"
        description="Create personalized Name Tracing and Cursive Writing worksheets in seconds. Perfect for kids learning handwriting. Download your custom PDF instantly for free."
        keywords="name tracing generator, cursive handwriting worksheets, cursive writing practice, printable cursive sheets, tracing cursive letters, handwriting worksheet maker"
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
          name: "Free Name Tracing & Cursive Writing Practice Sheets for Kids | Wizqo",
          url: "https://wizqo.com/worksheets/handwriting-worksheet-maker",
          description: "Create personalized Name Tracing and Cursive Writing worksheets in seconds. Perfect for kids learning handwriting. Download your custom PDF instantly for free.",
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
        }
        .bg-dotted-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v1h-3v-1h3zm10 2v1h-3v-1h3zm-10 2v1h-3v-1h3zm10 2v1h-3v-1h3zm-10 2v1h-3v-1h3zm10 2v1h-3v-1h3zm-10 2v1h-3v-1h3zm10 2v1h-3v-1h3zm-10 2v1h-3v-1h3zm10 2v1h-3v-1h3zM6 34v1H3v-1h3zm10 2v1h-3v-1h3zM6 38v1H3v-1h3zm10 2v1h-3v-1h3zM6 42v1H3v-1h3zm10 4v1h-3v-1h3zM6 46v1H3v-1h3zm10 4v1h-3v-1h3zM6 50v1H3v-1h3zm10 4v1h-3v-1h3zM6 54v1H3v-1h3zm10 4v1h-3v-1h3zM6 58v1H3v-1h3zm10 0v1h-3v-1h3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Custom Name Tracing & Cursive Writing Practice Sheets</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">{t('pages.handwriting.subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Controls - PREMIUM UPGRADE: Glassmorphism */}
          <div className="order-2 md:order-1 md:col-span-5 bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-6 shadow-xl w-full whitespace-normal">
            {/* Handwriting Style Selector - NEW PLACEMENT */}
            <div className="mb-6">
              <Label className="text-[10px] font-bold uppercase text-slate-400 mb-2.5 block tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                Handwriting Style
              </Label>
              <ToggleGroup
                type="single"
                value={textStyle}
                onValueChange={(v: string) => v && setTextStyle(v as any)}
                className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-200/50 shadow-inner"
              >
                <ToggleGroupItem value="true-monoline" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">✨</span>
                  <span>Monoline</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="monoline-cursive" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">🎨</span>
                  <span>Kids Cursive</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="school-cursive" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">🏫</span>
                  <span>School</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="cursive" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">🖋️</span>
                  <span>Classic</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="print" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">✍️</span>
                  <span>Print</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="bubble" className="px-2 py-3 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-1 h-auto">
                  <span className="text-lg">🫧</span>
                  <span>Bubble</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Mode segmented control */}
            <div className="mb-6">
              <Label className="text-[10px] font-bold uppercase text-slate-400 mb-2.5 block tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                Practice Mode
              </Label>
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(v: string) => v && setMode(v as Mode)}
                className="w-full justify-start border border-slate-200 rounded-lg overflow-hidden"
              >
                <ToggleGroupItem value="letters" className="flex-1 px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0">
                  {t('pages.handwriting.mode.letters')}
                </ToggleGroupItem>
                <ToggleGroupItem value="words" className="flex-1 px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0 border-l border-slate-200">
                  {t('pages.handwriting.mode.words')}
                </ToggleGroupItem>
                <ToggleGroupItem value="sentences" className="flex-1 px-4 py-2 text-sm data-[state=on]:bg-purple-600 data-[state=on]:text-white rounded-none border-0 border-l border-slate-200">
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
                </div>
              )}

              {/* Grouped Learning Aids (Auto Space, Model Word, Tracing Style) */}
              <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-slate-50/50 rounded-xl border border-slate-100 shadow-sm mt-2">
                <label className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 cursor-pointer hover:text-slate-700 transition-colors group">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    checked={autoSpaceLetters}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoSpaceLetters(e.target.checked)}
                  />
                  <span>Auto Space</span>
                </label>
                <label className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 cursor-pointer hover:text-slate-700 transition-colors group">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    checked={showModelWord}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowModelWord(e.target.checked)}
                  />
                  <span>Model Word</span>
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tracing:</span>
                  <ToggleGroup
                    type="single"
                    value={tracingStyle}
                    onValueChange={(v: string) => v && setTracingStyle(v as 'dotted' | 'faint')}
                    className="gap-1 bg-white p-0.5 rounded-lg border border-slate-200"
                  >
                    <ToggleGroupItem
                      value="dotted"
                      className="px-2.5 py-1 h-auto text-[9px] font-bold uppercase rounded-md border-0 data-[state=on]:bg-purple-600 data-[state=on]:text-white transition-all"
                    >
                      Dotted
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="faint"
                      className="px-2.5 py-1 h-auto text-[9px] font-bold uppercase rounded-md border-0 data-[state=on]:bg-purple-600 data-[state=on]:text-white transition-all"
                    >
                      Faint
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

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
                        aria-label={THEMES[tKey].name}
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
                  <Label htmlFor="fontSizeSlider" className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.fontSize')}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="fontSizeSlider"
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

              {/* Pinterest Growth Section - SEO Safe */}
              <div className="mt-6 pt-4 border-t border-slate-100 print:hidden text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Save for Later</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent('https://wizqo.com/worksheets/handwriting-worksheet-maker')}&media=${encodeURIComponent('https://wizqo.com/logo-720x720.png')}&description=${encodeURIComponent('Free Personalized Name Tracing & Cursive Handwriting Maker - Create custom worksheets for kids in seconds! #education #handwriting #parenting')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#E60023] text-white text-xs font-bold hover:bg-[#ad001a] transition-all hover:scale-105 shadow-sm shadow-red-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.654 2.568-.994 3.993-.284 1.194.593 2.167 1.77 2.167 2.124 0 3.756-2.241 3.756-5.476 0-2.863-2.056-4.865-4.997-4.865-3.399 0-5.395 2.551-5.395 5.186 0 1.027.395 2.127.889 2.727.098.119.112.224.083.345-.091.377-.293 1.191-.333 1.353-.053.214-.174.26-.401.154-1.49-.693-2.422-2.869-2.422-4.616 0-3.759 2.731-7.213 7.877-7.213 4.136 0 7.351 2.947 7.351 6.89 0 4.11-2.591 7.416-6.185 7.416-1.207 0-2.343-.627-2.731-1.369 0 0-.599 2.282-.744 2.84-.269 1.038-1.001 2.34-1.492 3.138 1.066.31 2.195.477 3.361.477 6.611 0 11.988-5.365 11.988-11.988C23.995 5.367 18.628 0 12.017 0z" />
                    </svg>
                    Pin to Pinterest
                  </a>
                </div>
                <p className="mt-3 text-[9px] text-slate-400 leading-relaxed italic">
                  Show your worksheet some love! 🌸<br />Pining helps other parents find this free tool.
                </p>
              </div>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="order-1 md:order-2 md:col-span-7 w-full min-w-0" id="handwriting-preview">
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

        <div className="mt-12">
          <FineMotorHandwritingGuide />
        </div>

      </main>
      <Footer />
    </div >
  );
}

function FineMotorHandwritingGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            ✏️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.handwriting.wiki.title', 'Handwriting Hub: Mastering the Art of Letter Formation')}</h2>
            <p className="text-orange-100 font-medium italic">Developing precision, pencil control & cognitive foundations</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🧠</span> {t('pages.handwriting.wiki.cognitiveLinkTitle', 'The Cognitive Link')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Handwriting is more than just a motor skill; it's a cognitive foundation. Physically forming letters helps students internalize <strong>alphabet recognition</strong> and improves spelling retention. Our handwriting tools focus on proper <strong>stroke order</strong>, consistency, and the fine motor precision required for lifelong writing success.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🏆</span> {t('pages.handwriting.wiki.milestonesTitle', 'Development Milestones')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Proper Stroke Order:</strong> Learning to start letters at the top and follow standard paths for better speed and legibility.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Pencil Grip Mastery:</strong> Developing a steady tripod grip to reduce hand fatigue and ensure consistent control.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Visual-Motor Integration:</strong> Bridging the gap between seeing a letter and physically replicating its shape with scale.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "Handwriting is the physical manifestation of thought."
          </p>
        </div>
      </div>
    </div>
  );
}
