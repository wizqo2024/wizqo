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
import { Slider } from '@/components/ui/slider';
import jsPDF from 'jspdf';
import { hexToRgb } from '@/utils/pdfHelpers';
import { trackWorksheetDownload } from '@/utils/analytics';
import { HUB_SEO_DATA } from '@shared/worksheetSEO';
import { SocialShare } from '@/components/SocialShare';

type Mode = 'letters' | 'words' | 'sentences';
type ColorTheme = 'classic' | 'rainbow' | 'ocean' | 'candy' | 'forest' | 'sunset';
type DecorationType = 'none' | 'stars' | 'hearts' | 'flower';

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

    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Codystar';
        src: url('/fonts/codystar.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'CedarvilleCursive';
        src: url('/fonts/cedarville_cursive.ttf') format('truetype');
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
        font-family: 'ABeeZee';
        src: url('/fonts/abeezee_regular.ttf') format('truetype');
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
        font-family: 'FoundationDots';
        src: url('/fonts/FoundationDots-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'SchoolHandDotted';
        src: url('/fonts/SchoolHandDotted_v2.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

    return () => {
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
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('classic');
  const [decoration, setDecoration] = React.useState<DecorationType>('flower');
  const [textStyle, setTextStyle] = React.useState<'cursive' | 'bubble' | 'true-monoline' | 'monoline-cursive' | 'school-cursive'>('true-monoline');
  const [tracingStyle, setTracingStyle] = React.useState<'dotted' | 'faint'>('dotted');
  const [showModelWord, setShowModelWord] = React.useState<boolean>(true);

  const getBaselineOffset = (family: string, fs: number, currentTextStyle: string) => {
    if (currentTextStyle === 'school-cursive') {
      // SchoolHandDotted: keep default positioning
      // ABeeZee: slight upward adjustment
      return family.includes('SchoolHandDotted') ? fs * 0.16 : fs * -0.02;
    }
    // Default offset for other fonts (Monoline, etc.)
    // Note: We use positive 6 here because we've unified the logic: positive = UP
    return 6;
  };

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
      let content = svg ? (svg as SVGElement).outerHTML : sheet.innerHTML;

      // Ensure SVG has the required XML namespace for proper rendering in the standalone iframe document
      if (content.startsWith('<svg') && !content.includes('xmlns=')) {
        content = content.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const nameLabel = t('pages.handwriting.name');
      const dateLabel = t('pages.handwriting.date');
      const html = `<!doctype html><html><head><meta charset=\"utf-8\"/>
<title>Print</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=ABeeZee&family=Inter:wght@300;400;500;600;700&family=Playwrite+GB+S:wght@100..400&family=Sacramento&family=Cedarville+Cursive&family=Comic+Neue&family=Dancing+Script&family=Handlee&family=Pacifico&family=Patrick+Hand&family=Playfair+Display&display=swap');
  
  /* Custom Fonts for Printing */
  @font-face { font-family: 'Codystar'; src: url('/fonts/codystar.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'CedarvilleCursive'; src: url('/fonts/cedarville_cursive.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'LearningCurve'; src: url('/fonts/learning_curve.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'LearningCurveDashed'; src: url('/fonts/learning_curve_dashed.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'KGPrimaryDots'; src: url('/fonts/kg_primary_dots.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'ABeeZee'; src: url('/fonts/abeezee_regular.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'FoundationDots'; src: url('/fonts/FoundationDots-Regular.ttf') format('truetype'); font-weight: normal; font-style: normal; }
  @font-face { font-family: 'SchoolHandDotted'; src: url('/fonts/SchoolHandDotted_v2.ttf') format('truetype'); font-weight: normal; font-style: normal; }

  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 8.5in; height: 11in; background: #fff; }
  #frame { position: relative; width: 8.5in; height: 11in; overflow: hidden; background: #fff; }
  /* Printed worksheet area */
  svg { position: absolute; left: 0; top: 0; width: 8.5in; height: 11in; }
</style>
</head><body><div id=\"frame\">${content}</div></body></html>`;
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
          // Give a tiny bit more time for fonts to "initialize" in the iframe
          setTimeout(() => {
            iframe.contentWindow?.print();
          }, 500);
        } catch { }
        // Remove iframe after some time to ensure print dialog finished
        setTimeout(() => {
          try {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
          } catch { }
        }, 3000);
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

    const [codystarB64, cedarvilleB64, learningCurveDashedB64, learningCurveSolidB64, abeezeeB64, foundationDotsB64, kgPrimaryDotsB64] = await Promise.all([
      fetchFontBase64('/fonts/codystar.ttf'),
      fetchFontBase64('/fonts/cedarville_cursive.ttf'),
      fetchFontBase64('/fonts/learning_curve_dashed.ttf'),
      fetchFontBase64('/fonts/learning_curve.ttf'),
      fetchFontBase64('/fonts/abeezee_regular.ttf'),
      fetchFontBase64('/fonts/SchoolHandDotted_v2.ttf'),
      fetchFontBase64('/fonts/kg_primary_dots.ttf')
    ]);

    // Register Fonts with PDF
    doc.addFileToVFS('Codystar-Regular.ttf', codystarB64);
    doc.addFont('Codystar-Regular.ttf', 'Codystar', 'normal');
    doc.addFont('Codystar-Regular.ttf', 'Codystar', 'bold');
    doc.addFileToVFS('Cedarville-Cursive.ttf', cedarvilleB64);
    doc.addFont('Cedarville-Cursive.ttf', 'CedarvilleCursive', 'normal');
    doc.addFileToVFS('LearningCurve-Dashed.ttf', learningCurveDashedB64);
    doc.addFont('LearningCurve-Dashed.ttf', 'LearningCurveDashed', 'normal');
    doc.addFileToVFS('LearningCurve.ttf', learningCurveSolidB64);
    doc.addFont('LearningCurve.ttf', 'LearningCurve', 'normal');
    doc.addFileToVFS('ABeeZee-Regular.ttf', abeezeeB64);
    doc.addFont('ABeeZee-Regular.ttf', 'ABeeZee', 'normal');

    // Load new true single-stroke dotted fonts
    doc.addFileToVFS('SchoolHandDotted.ttf', foundationDotsB64);
    doc.addFont('SchoolHandDotted.ttf', 'SchoolHandDotted', 'normal');
    doc.addFileToVFS('KGPrimaryDots.ttf', kgPrimaryDotsB64);
    doc.addFont('KGPrimaryDots.ttf', 'KGPrimaryDots', 'normal');

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
            doc.circle(pos.x, pos.y, s * 0.3, 'F');
          } else if (decoration === 'flower') {
            const s = 10;
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
    };

    const drawFooter = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('Created for Free at Wizqo.com - Scan to create your own!', pageW / 2, pageH - 20, { align: 'center' });

      // Add a subtle clickable-looking underline
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.line(pageW / 2 - 100, pageH - 18, pageW / 2 + 100, pageH - 18);
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
    const availableWidth = pageW - margin * 2 - 36;

    const letterSpacingAdjustment = (() => {
      if (textStyle === 'school-cursive') return 20; // Match Playwrite wide kerning
      if (textStyle === 'monoline-cursive') return 10;
      return 0;
    })();

    const measure = (txt: string) => {
      if (textStyle === 'true-monoline') doc.setFont('LearningCurve', 'normal');
      else if (textStyle === 'monoline-cursive') doc.setFont('LearningCurve', 'normal');
      else if (textStyle === 'school-cursive') doc.setFont('ABeeZee', 'normal');
      else if (textStyle === 'cursive') doc.setFont('CedarvilleCursive', 'normal');
      else if (textStyle === 'bubble') doc.setFont('Codystar', 'bold');
      else if (tracingStyle === 'dotted') {
        if (textStyle === 'bubble') doc.setFont('Codystar', 'normal');
        else doc.setFont('KGPrimaryDots', 'normal');
      }
      else doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSizeVal);
      const textWidth = doc.getTextWidth(txt);
      const kerningAdjustment = Math.max(0, txt.length - 1) * letterSpacingAdjustment;
      return textWidth + kerningAdjustment;
    };

    const letterSpacing = (() => {
      if (!autoSpaceLetters) {
        const isCursive = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'cursive' || textStyle === 'school-cursive';
        return isCursive ? fontSizeVal * 0.02 : 0;
      }
      const base = (mode === 'letters' ? fontSizeVal * 0.18 : fontSizeVal * 0.25);
      return textStyle === 'bubble' ? base + fontSizeVal * 0.05 : base;
    })();

    const measureWithSpacing = (txt: string) => {
      const charCount = Array.from(txt).length;
      const buffer = textStyle === 'bubble' ? charCount * 2 : 0;
      return measure(txt) + Math.max(0, charCount - 1) * letterSpacing + buffer;
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

    const rowsPerPage = Math.floor((pageH - startY - margin) / lineGap);

    // Initial page header
    drawHeader();
    drawFooter();

    pdfRows.forEach((txt, idx) => {
      const pageIdx = Math.floor(idx / rowsPerPage);
      const rowInPage = idx % rowsPerPage;

      if (pageIdx > 0 && rowInPage === 0) {
        doc.addPage();
        drawHeader();
        drawFooter();
      }

      const y = startY + rowInPage * lineGap;
      const baselineY = y;
      const mid = y - fontSizeVal * 0.35;
      const top = y - fontSizeVal * 0.7;

      const charSpace = letterSpacing + letterSpacingAdjustment;
      doc.setCharSpace(charSpace);

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

      // Rendering word by word
      const wordsInRow = txt.split(' ');
      let currentX = margin + 16;

      wordsInRow.forEach((word, wordIdx) => {
        const isModel = showModelWord && wordIdx === 0;
        const isFaint = tracingStyle === 'faint' && !isModel;
        const isDotted = tracingStyle === 'dotted' && !isModel;
        const wordToDraw = word + (wordIdx < wordsInRow.length - 1 ? ' ' : '');
        const onlyFirstCharModel = isModel && (mode === 'letters' || word.length > 5);

        if (onlyFirstCharModel) {
          const firstChar = wordToDraw.substring(0, 1);
          const restOfWord = wordToDraw.substring(1);

          const firstCharFont = (() => {
            if (textStyle === 'true-monoline') return 'LearningCurve';
            if (textStyle === 'monoline-cursive') return 'LearningCurve';
            if (textStyle === 'school-cursive') return 'ABeeZee';
            if (textStyle === 'cursive') return 'CedarvilleCursive';
            if (textStyle === 'bubble') return 'Codystar';
            return 'ABeeZee';
          })();
          doc.setFont(firstCharFont, 'normal');

          let textColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
          const rowTextRGB = hexToRgb(textColor);
          doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
          doc.setLineDashPattern([], 0);
          doc.setLineWidth(0);

          doc.text(firstChar, currentX, baselineY - getBaselineOffset(doc.getFont().fontName, fontSizeVal, textStyle), { renderingMode: 0 });
          currentX += doc.getTextWidth(firstChar) + charSpace;

          const isActuallyDotted = tracingStyle === 'dotted';
          const font = (() => {
            if (textStyle === 'true-monoline') return isActuallyDotted ? 'LearningCurveDashed' : 'LearningCurve';
            if (textStyle === 'monoline-cursive') return isActuallyDotted ? 'LearningCurveDashed' : 'LearningCurve';
            if (textStyle === 'school-cursive') return isActuallyDotted ? 'SchoolHandDotted' : 'ABeeZee';
            if (textStyle === 'cursive') return isActuallyDotted ? 'LearningCurveDashed' : 'CedarvilleCursive';
            if (textStyle === 'bubble') return 'Codystar';
            return isActuallyDotted ? 'KGPrimaryDots' : 'ABeeZee';
          })();
          doc.setFont(font, textStyle === 'bubble' ? 'bold' : 'normal');

          if (isFaint) doc.setTextColor(203, 213, 225);
          else doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);

          const isTracing = isActuallyDotted && (textStyle === 'bubble');
          const renderingMode = (textStyle === 'bubble' || isTracing) ? 1 : 0;
          if (isTracing) { doc.setLineWidth(0.8); doc.setLineDashPattern([3, 3], 0); }
          else if (textStyle === 'bubble') { doc.setLineWidth(2); doc.setLineDashPattern(tracingStyle === 'dotted' ? [4, 6] : [], 0); }

          for (const char of restOfWord) {
            doc.text(char, currentX, baselineY - getBaselineOffset(doc.getFont().fontName, fontSizeVal, textStyle), { renderingMode: renderingMode as any });
            currentX += doc.getTextWidth(char) + charSpace;
          }
        } else {
          const isDotted = tracingStyle === 'dotted';
          const font = (() => {
            if (textStyle === 'true-monoline') return isDotted ? 'LearningCurveDashed' : 'LearningCurve';
            if (textStyle === 'monoline-cursive') return isDotted ? 'LearningCurveDashed' : 'LearningCurve';
            if (textStyle === 'school-cursive') return isDotted ? 'SchoolHandDotted' : 'ABeeZee';
            if (textStyle === 'cursive') return isDotted ? 'LearningCurveDashed' : 'CedarvilleCursive';
            if (textStyle === 'bubble') return 'Codystar';
            return isDotted ? 'KGPrimaryDots' : 'ABeeZee';
          })();
          doc.setFont(font, textStyle === 'bubble' ? 'bold' : 'normal');

          let textColor = theme.rainbow ? RAINBOW_COLORS[idx % RAINBOW_COLORS.length] : theme.text;
          if (isFaint) textColor = '#cbd5e1';
          const rowTextRGB = hexToRgb(textColor);
          doc.setTextColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);
          doc.setDrawColor(rowTextRGB.r, rowTextRGB.g, rowTextRGB.b);

          const isTracing = isDotted && (textStyle === 'bubble');
          const renderingMode = (textStyle === 'bubble' || isTracing) ? 1 : 0;
          if (isTracing) { doc.setLineWidth(0.8); doc.setLineDashPattern([3, 3], 0); }
          else if (textStyle === 'bubble') { doc.setLineWidth(2); doc.setLineDashPattern(isDotted ? [4, 6] : [], 0); }
          else { doc.setLineDashPattern([], 0); doc.setLineWidth(0); }

          for (const char of wordToDraw) {
            doc.text(char, currentX, baselineY - getBaselineOffset(doc.getFont().fontName, fontSizeVal, textStyle), { renderingMode: renderingMode as any });
            currentX += doc.getTextWidth(char) + charSpace;
          }
        }
      });

      doc.setLineDashPattern([], 0);
      doc.setLineWidth(1);
      doc.setCharSpace(0);

      const isSchoolDotted = textStyle === 'school-cursive' && tracingStyle === 'dotted';
      if (isSchoolDotted) {
        const bgRGB = hexToRgb(theme.bg);
        doc.setDrawColor(bgRGB.r, bgRGB.g, bgRGB.b);
        doc.setLineWidth(2.5);
        doc.line(margin + 16, baselineY + 1.0, pageW - margin, baselineY + 1.0);
      }
    });

    const fileNameText = (pdfRows[0] || 'worksheet').substring(0, 15).replace(/\s+/g, '-');
    doc.save(`handwriting-${fileNameText}.pdf`);

    trackWorksheetDownload('handwriting-maker', `${mode}-pdf`, 'handwriting-maker', 'handwriting')

    // Confetti
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

  // Memoized content for the layout

  const content = React.useMemo(() => {
    if (mode === 'letters') return letters.split(/\s+/).filter(Boolean);
    if (mode === 'words') return words.split(/\s+/).filter(Boolean);
    // Keep punctuation by splitting on spaces but preserving sentence structure
    return sentences.split(/(?<=[.!?])\s+|\s+/).filter(Boolean);
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
    const pageW = 612; // Letter width in points
    const pageH = 792; // Letter height in points
    const margin = 36;
    const startY = 140;
    const lineGap = fontSize * 2.0;
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
    const fontStackPrint = "ABeeZee, sans-serif";
    const fontStackCursive = "CedarvilleCursive, cursive";
    const fontStackKidsMonoline = "LearningCurve, cursive";
    const fontStackSchoolMonoline = "ABeeZee, sans-serif";
    const fontStackPrimaryDots = "KGPrimaryDots";
    const fontStackSchoolDotted = "SchoolHandDotted, monospace";
    const fontStackKidsDashed = "LearningCurveDashed";

    const fontWeight = textStyle === 'bubble' ? '800 ' : '';
    const measurementFont = (() => {
      if (textStyle === 'true-monoline') return fontStackKidsMonoline;
      if (textStyle === 'monoline-cursive') return fontStackKidsMonoline;
      if (textStyle === 'school-cursive') return fontStackSchoolMonoline;
      if (textStyle === 'cursive') return fontStackCursive;
      if (textStyle === 'bubble') return "Codystar";
      return fontStackPrint;
    })();
    if (ctx) ctx.font = `${fontWeight}${fontSize}px ${measurementFont}`;
    const letterSpacingAdjustment = (() => {
      if (textStyle === 'school-cursive') return 20; // Match Playwrite wide kerning
      if (textStyle === 'monoline-cursive') return 10;
      return 0;
    })();
    const measure = (t: string) => (ctx ? ctx.measureText(t).width + (t.length * letterSpacingAdjustment) : t.length * (fontSize * 0.6));
    const availableWidth = pageW - margin * 2 - 36;
    const letterSpacing = (() => {
      if (!autoSpaceLetters) {
        // When auto-spacing is off, CSS still applies 0.02em for cursive fonts
        // Must match this in measurement to prevent overflow
        const isCursive = textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'cursive' || textStyle === 'school-cursive';
        return isCursive ? fontSize * 0.02 : 0;
      }
      // bubble needs a little extra space for stroke outline
      const base = (mode === 'letters' ? fontSize * 0.18 : fontSize * 0.25);
      return textStyle === 'bubble' ? base + fontSize * 0.05 : base;
    })();
    // Include CSS letter-spacing effect in our width measurement so lines wrap correctly
    const measureWithSpacing = (t: string) => {
      const charCount = Array.from(t).length;
      const base = measure(t);
      // CSS letter-spacing (base + adjustment) only applies between characters, so (charCount - 1)
      const extra = Math.max(0, charCount - 1) * letterSpacing;
      // Add a small safety buffer for Bubble style due to thick strokes
      const buffer = textStyle === 'bubble' ? charCount * 2 : 0;
      return base + extra + buffer;
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
      if (type === 'flower') {
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
      <svg viewBox={`0 0 ${pageW} ${pageH}`} className="w-full h-auto bg-white shadow-2xl rounded-sm" role="img" aria-label="Handwriting sheet preview" style={{ overflow: 'hidden' }}>
        <rect width={pageW} height={pageH} fill={theme.bg} />

        {/* Branding Header */}
        <text x={margin} y={margin + 20} fontSize={24} fontWeight="bold" fill="#0f172a" fontFamily="helvetica, Arial, sans-serif">Wizqo</text>
        <text x={pageW - margin} y={margin + 20} fontSize={10} fill="#64748b" textAnchor="end" fontFamily="helvetica, Arial, sans-serif">www.wizqo.com</text>

        {decoration !== 'none' && (
          <>
            {renderDecoration(decoration, margin - 10, margin - 10, 12)}
            {renderDecoration(decoration, pageW - margin + 10, margin - 10, 12)}
            {renderDecoration(decoration, margin - 10, pageH - margin + 10, 12)}
            {renderDecoration(decoration, pageW - margin + 10, pageH - margin + 10, 12)}
          </>
        )}

        {rows.map((text, idx) => {
          const y = startY + idx * lineGap;
          const mid = y - fontSize * 0.35;
          const top = y - fontSize * 0.7;
          const hasPrimary = lineType === 'primary';
          const baselineY = y;
          // SchoolHandDotted font has a built-in underline that we need to cover
          const usesSchoolDottedFont = textStyle === 'school-cursive' && tracingStyle === 'dotted';
          return (
            <g key={idx}>
              {hasPrimary && (
                <>
                  <line x1={margin} y1={top} x2={pageW - margin} y2={top} stroke={topLineColor} strokeWidth={1.5} strokeDasharray="8 8" />
                  <line x1={margin} y1={mid} x2={pageW - margin} y2={mid} stroke={midlineColor} strokeWidth={1.5} strokeDasharray="6 10" />
                </>
              )}
              {startDots && (
                <circle cx={margin + 8} cy={baselineY - fontSize * 0.2} r={4} fill="#10b981" />
              )}
              {/* Draw text */}
              <text x={margin + 16} y={baselineY}

                fontSize={fontSize}
                style={{
                  vectorEffect: 'non-scaling-stroke',
                  paintOrder: 'stroke fill',
                  letterSpacing: (() => {
                    const adjustment = (() => {
                      if (textStyle === 'school-cursive') return 20;
                      if (textStyle === 'monoline-cursive') return 10;
                      return 0;
                    })();
                    // Base matches standard CSS letter-spacing
                    const base = autoSpaceLetters
                      ? letterSpacing
                      : (textStyle === 'true-monoline' || textStyle === 'monoline-cursive' || textStyle === 'cursive' || textStyle === 'school-cursive' ? fontSize * 0.02 : 0);
                    // Standard letter-spacing behavior: total extra width = (charCount - 1) * spacing
                    // We apply the sum (base + adjustment) as the letter-spacing value
                    return `${base + adjustment}px`;
                  })()
                } as any} >
                {(() => {
                  const parts = text.split(' ');
                  return parts.map((part, pIdx) => {
                    const isModel = showModelWord && pIdx === 0;
                    const isFaint = tracingStyle === 'faint' && !isModel;
                    const isDotted = tracingStyle === 'dotted' && !isModel;

                    const word = part + (pIdx < parts.length - 1 ? ' ' : '');
                    const onlyFirstCharModel = isModel && (mode === 'letters' || part.length > 5);

                    const getFontFamily = (isDottedWord: boolean) => {
                      if (textStyle === 'true-monoline') return isDottedWord ? fontStackKidsDashed : fontStackKidsMonoline;
                      if (textStyle === 'monoline-cursive') return isDottedWord ? fontStackKidsDashed : fontStackKidsMonoline;
                      if (textStyle === 'school-cursive') return isDottedWord ? fontStackSchoolDotted : fontStackSchoolMonoline;
                      if (textStyle === 'cursive') return isDottedWord ? fontStackKidsDashed : fontStackCursive;
                      if (textStyle === 'bubble') return "Codystar";
                      return isDottedWord ? fontStackPrimaryDots : fontStackPrint;
                    };

                    if (onlyFirstCharModel) {
                      const firstChar = word.substring(0, 1);
                      const rest = word.substring(1);
                      return (
                        <React.Fragment key={pIdx}>
                          <tspan style={{ baselineShift: getBaselineOffset(getFontFamily(false), fontSize, textStyle) + 'px' }} fill={theme.text}
                            stroke="none"
                            strokeWidth={0}
                            fontFamily={getFontFamily(false)} >
                            {firstChar}
                          </tspan>
                          <tspan style={{ baselineShift: getBaselineOffset(getFontFamily(tracingStyle === 'dotted'), fontSize, textStyle) + 'px' }} fontFamily={getFontFamily(tracingStyle === 'dotted')} fill={(() => {
                            const isNativeDotted = tracingStyle === 'dotted' && textStyle !== 'bubble';
                            if (isNativeDotted) return theme.text;
                            if (isFaint) return '#cbd5e1';
                            if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                            return theme.text;
                          })()}
                            stroke={(() => {
                              if (textStyle === 'bubble' && tracingStyle === 'faint') return '#cbd5e1';
                              if (textStyle === 'bubble') return theme.text;
                              return 'none';
                            })()}
                            strokeWidth={textStyle === 'bubble' ? 3 : 0}
                            strokeDasharray={(textStyle === 'bubble' && tracingStyle === 'dotted') ? '4 6' : undefined} >
                            {rest}
                          </tspan>
                        </React.Fragment>
                      );
                    }

                    return (
                      <tspan style={{ baselineShift: getBaselineOffset(getFontFamily(isDotted), fontSize, textStyle) + 'px' }} key={pIdx}
                        fontFamily={getFontFamily(isDotted)} fill={(() => {
                          const isNativeDotted = isDotted && textStyle !== 'bubble';
                          if (isNativeDotted) return theme.text;
                          if (isFaint) return '#cbd5e1';
                          if (theme.rainbow) return RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                          return theme.text;
                        })()}
                        stroke={(() => {
                          if (textStyle === 'bubble' && isFaint) return '#cbd5e1';
                          if (textStyle === 'bubble') return theme.text;
                          return 'none';
                        })()}
                        strokeWidth={textStyle === 'bubble' ? 3 : 0}
                        strokeDasharray={(textStyle === 'bubble' && isDotted) ? '4 6' : undefined} >
                        {word}
                      </tspan>
                    );
                  });
                })()}
              </text>
              {/* Draw baseline */}
              <line x1={margin} y1={baselineY} x2={pageW - margin} y2={baselineY} stroke={baselineColor} strokeWidth={2} />
              {/* Mask built-in underline for SchoolHandDotted */}
              {usesSchoolDottedFont && (
                <line
                  x1={margin + 16}
                  y1={baselineY + 1}
                  x2={pageW - margin}
                  y2={baselineY + 1}
                  stroke={theme.bg}
                  strokeWidth={2.5}
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-700 bg-dotted-pattern" style={{ backgroundColor: THEMES[colorTheme as ColorTheme].bg }} dir={isRTL ? 'rtl' : 'ltr'}>
      {(() => {
        const seo = HUB_SEO_DATA['handwriting-worksheet-maker'] || {};
        return (
          <SEOMetaTags
            title={seo.title || "Free Name Tracing Worksheet Generator | Wizqo"}
            description={seo.metaDescription || "Create personalized Name Tracing and Cursive Writing worksheets in seconds. Perfect for kids learning handwriting. Download your custom PDF instantly for free."}
            keywords={seo.keywords || "name tracing generator, cursive handwriting worksheets, cursive writing practice, printable cursive sheets, tracing cursive letters, handwriting worksheet maker, free name tracing worksheets"}
            ogImage="https://wizqo.com/images/handwriting-og-preview.png"
            canonicalUrl="https://wizqo.com/worksheets/handwriting-worksheet-maker"
          />
        );
      })()}
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
        <header className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t('pages.handwriting.title')}
            </h1>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400" />
            <p className="text-slate-700 text-sm max-w-3xl leading-relaxed">
              {t('pages.handwriting.subtitle')}
            </p>
          </div>

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
                className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-200/50 shadow-inner" >
                <ToggleGroupItem value="true-monoline" className="px-2 py-2 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-0.5 h-auto">
                  <span className="text-base">✨</span>
                  <span>Monoline</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="monoline-cursive" className="px-2 py-2 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-0.5 h-auto">
                  <span className="text-base">🎨</span>
                  <span>Kids Cursive</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="school-cursive" className="px-2 py-2 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-0.5 h-auto">
                  <span className="text-base">🏫</span>
                  <span>School</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="cursive" className="px-2 py-2 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-0.5 h-auto">
                  <span className="text-base">🖋️</span>
                  <span>Classic</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="bubble" className="px-2 py-2 text-[10px] font-bold uppercase data-[state=on]:bg-white data-[state=on]:text-purple-600 data-[state=on]:shadow-md rounded-xl border-0 transition-all duration-300 flex flex-col items-center gap-0.5 h-auto">
                  <span className="text-base">🫧</span>
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
                className="w-full justify-start border border-slate-200 rounded-lg overflow-hidden" >
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
                    className="gap-1 bg-white p-0.5 rounded-lg border border-slate-200" >
                    <ToggleGroupItem
                      value="dotted"
                      className="px-2.5 py-1 h-auto text-[9px] font-bold uppercase rounded-md border-0 data-[state=on]:bg-purple-600 data-[state=on]:text-white transition-all" >
                      Dotted
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="faint"
                      className="px-2.5 py-1 h-auto text-[9px] font-bold uppercase rounded-md border-0 data-[state=on]:bg-purple-600 data-[state=on]:text-white transition-all" >
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
                    className="justify-start gap-2" >
                    {[
                      { id: 'none', label: 'None', icon: '🚫' },
                      { id: 'stars', label: 'Stars', icon: '⭐' },
                      { id: 'hearts', label: 'Hearts', icon: '❤️' },
                      { id: 'flower', label: 'Flower', icon: '🌸' },
                    ].map(dec => (
                      <ToggleGroupItem
                        key={dec.id}
                        value={dec.id}
                        className="px-3 py-1 h-8 text-xs border rounded-lg data-[state=on]:bg-slate-900 data-[state=on]:text-white" >
                        <span className="mr-1">{dec.icon}</span> {dec.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              {/* Standard Options */}
              <div className="mt-4 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label htmlFor="fontSizeSlider" className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.fontSize')} ({fontSize}px)</Label>
                  <Slider
                    id="fontSizeSlider"
                    min={28}
                    max={72}
                    step={2}
                    value={[fontSize]}
                    onValueChange={([v]) => setFontSize(v)}
                    className="py-4"
                  />
                </div>


                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600 font-bold uppercase">{t('pages.handwriting.options.lineType')}</Label>
                  <ToggleGroup
                    type="single"
                    value={lineType}
                    onValueChange={(v: string) => v && setLineType(v as 'primary' | 'baseline')}
                    className="grid grid-cols-2 gap-2" >
                    <ToggleGroupItem
                      value="primary"
                      className="px-3 py-1.5 h-auto text-[10px] font-bold uppercase rounded-lg border data-[state=on]:bg-purple-600 data-[state=on]:border-purple-600 data-[state=on]:text-white" >
                      Three Lines
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="baseline"
                      className="px-3 py-1.5 h-auto text-[10px] font-bold uppercase rounded-lg border data-[state=on]:bg-purple-600 data-[state=on]:border-purple-600 data-[state=on]:text-white" >
                      Single Line
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>


              </div>


              {/* Tips moved here below the options */}
              <div className="mt-4 print:hidden">
                <h2 className="text-sm font-semibold text-slate-900">Tips for better handwriting</h2>
                <ul className="mt-2 list-disc list-inside text-xs text-slate-700 space-y-1">
                  <li>Use short sessions (5–10 minutes) with frequent praise.</li>
                  <li>Model one clean letter, then let your child trace and copy.</li>
                  <li>Keep wrist straight, grip relaxed; paper slightly tilted.</li>
                  <li>Say letter strokes out loud (e.g., “down, around, close”).</li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 print:hidden text-center flex flex-col items-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Share & Support</p>
                <div className="flex justify-center">
                  <SocialShare
                    url="https://wizqo.com/worksheets/handwriting-worksheet-maker"
                    title="Check out this Free Personalized Name Tracing & Handwriting Maker! Create custom worksheets for kids in seconds. #education #parenting"
                    media="https://wizqo.com/images/handwriting-hub-preview-v2_1769603396482.png"
                  />
                </div>
                <p className="mt-3 text-[9px] text-slate-400 leading-relaxed italic">
                  Show your worksheet some love! 🌸<br />Sharing helps other parents and teachers find this free tool.
                </p>
              </div>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="order-1 md:order-2 md:col-span-7 w-full min-w-0" id="handwriting-preview">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
              <div className="text-slate-700 text-sm font-medium">Preview</div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold shadow-md transition-all active:scale-[0.98]" >
                  <Download className="h-4 w-4" />
                  <span>{t('Download PDF')}</span>
                </button>
                <button
                  onClick={printPreview}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]" >
                  <Printer className="h-4 w-4" />
                  <span>{t('Print Worksheet')}</span>
                </button>
              </div>
            </div>
            <div id="handwriting-sheet" className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm print:border-0 print:shadow-none print:rounded-none print:p-0 overflow-hidden">
              <PreviewSVG key={`${mode}-${lineType}-${fontSize}-${dotted}-${startDots}-${autoSpaceLetters}-${textStyle}-${colorTheme}-${decoration}`} />
            </div>
            <div className="text-xs text-slate-500 mt-2 print:hidden">Tip: Long text wraps to the next line automatically.</div>
          </div>
        </section>

        {/* Explore More Worksheets (SEO-friendly, hidden in print) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 print:hidden space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Explore More Free Worksheets</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-purple-700">
            <li><a className="hover:underline flex items-center gap-2" href="/worksheets/1st-grade-math-worksheets"><span>➕</span> 1st Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline flex items-center gap-2" href="/worksheets/2nd-grade-math-worksheets"><span>🔢</span> 2nd Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline flex items-center gap-2" href="/worksheets/reading-comprehension"><span>📚</span> Reading Comprehension Worksheets – Free PDF</a></li>
            <li><a className="hover:underline flex items-center gap-2" href="/printables"><span>🎨</span> Printable Fun Learning Activities</a></li>
          </ul>
        </section>

        {/* SEO Sections B, C, D */}
        <div className="grid grid-cols-1 gap-6 print:hidden">
          <section className="bg-white border border-slate-200 rounded-2xl p-8 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                {t('pages.handwriting.seo.howTo.title')}
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {i}</div>
                    <p className="text-slate-600 text-sm leading-relaxed">{t(`pages.handwriting.seo.howTo.step${i}`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">★</span>
                {t('pages.handwriting.seo.authority.title')}
              </h2>
              <p className="text-slate-600 leading-relaxed max-w-4xl">{t('pages.handwriting.seo.authority.text')}</p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm">?</span>
                {t('pages.handwriting.seo.faq.title')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">{t(`pages.handwriting.seo.faq.q${i}`)}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{t(`pages.handwriting.seo.faq.a${i}`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 space-y-8">
          {/* Section A: Direct Answer Block (Now Below the Fold) */}
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200 p-8 rounded-3xl shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">?</span>
              {t('pages.handwriting.seo.directAnswer.title')}
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              {t('pages.handwriting.seo.directAnswer.text')}
            </p>
          </div>

          {(() => {
            const seo = HUB_SEO_DATA['handwriting-worksheet-maker'];
            if (seo?.richContent) {
              return (
                <div
                  className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: seo.richContent }}
                />
              );
            }
            return <FineMotorHandwritingGuide />;
          })()}
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
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12 text-white text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 max-w-5xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
            ✏️
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{t('pages.handwriting.wiki.title')}</h2>
            <p className="text-orange-100 font-medium text-lg italic opacity-90">{t('pages.handwriting.wiki.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🧠</span> {t('pages.handwriting.wiki.cognitiveLinkTitle')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pages.handwriting.wiki.cognitiveLinkText')}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🏆</span> {t('pages.handwriting.wiki.milestonesTitle')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold mt-1">1</span>
                <span>{t('pages.handwriting.wiki.milestones.strokeOrder')}</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold mt-1">2</span>
                <span>{t('pages.handwriting.wiki.milestones.pencilGrip')}</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold mt-1">3</span>
                <span>{t('pages.handwriting.wiki.milestones.visualMotor')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm italic font-medium">
            {t('pages.handwriting.wiki.quote')}
          </p>
        </div>
      </div>
    </div>
  );
}






