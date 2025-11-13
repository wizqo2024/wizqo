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
import { Download, Printer, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const MAX_NAME_LENGTH = 18;

export default function NameTracingGeneratorPage() {
  const { toast } = useToast();
  
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

  const svgRef = React.useRef<SVGSVGElement | null>(null);

  // Get names for preview (multiple in batch mode, single otherwise)
  const previewNames = React.useMemo(() => {
    if (batchMode === 'batch') {
      // Handle all types of line endings (Windows \r\n, Mac \r, Unix \n)
      const normalized = multipleNames.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const rawNames = normalized.split('\n');
      const names = rawNames
        .map(n => n.trim())
        .filter(n => n.length > 0 && n.length <= MAX_NAME_LENGTH);
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('multipleNames raw:', JSON.stringify(multipleNames));
        console.log('rawNames after split:', rawNames);
        console.log('names after trim/filter:', names);
        console.log('batchLayout:', batchLayout);
      }
      
      if (names.length === 0) return ['Your Name'];
      
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
    return [childName.trim() || 'Your Name'];
  }, [batchMode, multipleNames, childName, batchLayout]);

  // Format names for display
  const formattedNames = React.useMemo(() => {
    const formatted = previewNames.map((name, index) => {
      const trimmed = name.trim();
      if (!trimmed) return 'Your Name';
      let result: string;
      switch (letterCase) {
        case 'title':
          result = trimmed
            .split(/\s+/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
          break;
        case 'upper':
          result = trimmed.toUpperCase();
          break;
        case 'lower':
          result = trimmed.toLowerCase();
          break;
        default:
          result = trimmed;
      }
      return result;
    });
    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('previewNames:', previewNames);
      console.log('formattedNames:', formatted);
    }
    return formatted;
  }, [previewNames, letterCase]);

  // For backward compatibility, keep formattedName as first name
  const formattedName = formattedNames[0] || 'Your Name';

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

  const safeFileName = React.useMemo(
    () => formattedName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'name-tracing',
    [formattedName]
  );

  // Helper function to format a name based on letter case
  const formatName = React.useCallback((name: string, caseType: LetterCase) => {
    const trimmed = name.trim();
    if (!trimmed) return 'Your Name';
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
  }, []);

  // Use a ref to store the generateSVGForName function so it can be accessed by callbacks defined earlier
  const generateSVGForNameRef = React.useRef<((name: string) => string) | null>(null);

  const handlePrint = React.useCallback(() => {
    try {
      if (batchMode === 'single') {
        // Single name mode - use existing logic
        const container = document.getElementById('name-tracing-sheet');
        if (!container) {
          toast({
            title: 'Error',
            description: 'Worksheet not found. Please refresh the page.',
            variant: 'destructive',
          });
          return;
        }
        const svg = container.querySelector('svg');
        if (!svg) {
          toast({
            title: 'Error',
            description: 'SVG not found. Please refresh the page.',
            variant: 'destructive',
          });
          return;
        }

        // Get paper size in inches
        const paperSizes = {
          'us-letter': { width: 8.5, height: 11 },
          'a4': { width: 8.27, height: 11.69 },
          'legal': { width: 8.5, height: 14 },
        };
        const size = paperSizes[paperSize];
        const width = printOrientation === 'landscape' ? size.height : size.width;
        const height = printOrientation === 'landscape' ? size.width : size.height;

        const html = `<!doctype html><html><head><meta charset="utf-8" />
<title>Name Tracing Worksheet</title>
<style>
  @page { size: ${width}in ${height}in; margin: 0; }
  html, body { margin: 0; padding: 0; width: ${width}in; height: ${height}in; background: #fff; }
  #frame { position: relative; width: ${width}in; height: ${height}in; overflow: hidden; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
</head><body><div id="frame">${svg.outerHTML}</div></body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        doc.open();
        doc.write(html);
        doc.close();
        const finish = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            toast({
              title: 'Print Ready',
              description: 'Print dialog opened. Select your printer and settings.',
            });
          } catch (error) {
            console.error('Print failed', error);
            toast({
              title: 'Print Failed',
              description: 'Unable to open print dialog. Please try again.',
              variant: 'destructive',
            });
          }
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch {}
          }, 600);
        };
        if (iframe.contentWindow?.document.readyState === 'complete') finish();
        else iframe.onload = finish;
      } else {
        // Batch mode
        const names = multipleNames
          .split('\n')
          .map(n => n.trim())
          .filter(n => n.length > 0 && n.length <= MAX_NAME_LENGTH)
          .slice(0, 50); // Limit to 50 names

        if (names.length === 0) {
          toast({
            title: 'No Names',
            description: 'Please enter at least one name in batch mode.',
            variant: 'destructive',
          });
          return;
        }

        const generateFn = generateSVGForNameRef.current;
        if (!generateFn) {
          toast({
            title: 'Error',
            description: 'SVG generator not ready. Please refresh the page.',
            variant: 'destructive',
          });
          return;
        }

        const paperSizes = {
          'us-letter': { width: 8.5, height: 11 },
          'a4': { width: 8.27, height: 11.69 },
          'legal': { width: 8.5, height: 14 },
        };
        const size = paperSizes[paperSize];
        const width = printOrientation === 'landscape' ? size.height : size.width;
        const height = printOrientation === 'landscape' ? size.width : size.height;

        let htmlContent = '';
        if (batchLayout === 'one-per-page') {
          // One name per page
          names.forEach((name) => {
            const svg = generateFn(name);
            htmlContent += `<div style="page-break-after: always; width: ${width}in; height: ${height}in; position: relative; overflow: hidden;"><div style="position: absolute; inset: 0; width: 100%; height: 100%;">${svg}</div></div>`;
          });
        } else if (batchLayout === 'two-per-page') {
          // Two names per page
          for (let i = 0; i < names.length; i += 2) {
            const name1 = names[i];
            const name2 = names[i + 1];
            const svg1 = generateFn(name1);
            const svg2 = name2 ? generateFn(name2) : '';
            htmlContent += `<div style="page-break-after: always; width: ${width}in; height: ${height}in; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 50%;">${svg1}</div>
              ${svg2 ? `<div style="position: absolute; top: 50%; left: 0; width: 100%; height: 50%;">${svg2}</div>` : ''}
            </div>`;
          }
        } else {
          // Four names per page
          for (let i = 0; i < names.length; i += 4) {
            const name1 = names[i];
            const name2 = names[i + 1];
            const name3 = names[i + 2];
            const name4 = names[i + 3];
            const svg1 = generateFn(name1);
            const svg2 = name2 ? generateFn(name2) : '';
            const svg3 = name3 ? generateFn(name3) : '';
            const svg4 = name4 ? generateFn(name4) : '';
            htmlContent += `<div style="page-break-after: always; width: ${width}in; height: ${height}in; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; width: 50%; height: 50%;">${svg1}</div>
              ${svg2 ? `<div style="position: absolute; top: 0; left: 50%; width: 50%; height: 50%;">${svg2}</div>` : ''}
              ${svg3 ? `<div style="position: absolute; top: 50%; left: 0; width: 50%; height: 50%;">${svg3}</div>` : ''}
              ${svg4 ? `<div style="position: absolute; top: 50%; left: 50%; width: 50%; height: 50%;">${svg4}</div>` : ''}
            </div>`;
          }
        }

        const html = `<!doctype html><html><head><meta charset="utf-8" />
<title>Name Tracing Worksheets - ${names.length} names</title>
<style>
  @page { size: ${width}in ${height}in; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: ${width}in; }
</style>
</head><body>${htmlContent}</body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        doc.open();
        doc.write(html);
        doc.close();
        const finish = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            toast({
              title: 'Print Ready',
              description: `Print dialog opened for ${names.length} name${names.length > 1 ? 's' : ''}.`,
            });
          } catch (error) {
            console.error('Print failed', error);
            toast({
              title: 'Print Failed',
              description: 'Unable to open print dialog. Please try again.',
              variant: 'destructive',
            });
          }
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch {}
          }, 600);
        };
        if (iframe.contentWindow?.document.readyState === 'complete') finish();
        else iframe.onload = finish;
      }
    } catch (error) {
      console.error('Unable to print name tracing sheet', error);
      toast({
        title: 'Error',
        description: 'An error occurred while preparing the print. Please try again.',
        variant: 'destructive',
      });
    }
  }, [batchMode, multipleNames, batchLayout, paperSize, printOrientation, toast]);

  const handleDownloadPNG = React.useCallback(() => {
    try {
      if (batchMode === 'batch') {
        const names = multipleNames
          .split('\n')
          .map(n => n.trim())
          .filter(n => n.length > 0 && n.length <= MAX_NAME_LENGTH)
          .slice(0, 50);

        if (names.length === 0) {
          toast({
            title: 'No Names',
            description: 'Please enter at least one name in batch mode.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Batch PNG Download',
          description: `Generating ${names.length} PNG file${names.length > 1 ? 's' : ''}... This may take a moment.`,
        });

        const generateFn = generateSVGForNameRef.current;
        if (!generateFn) {
          toast({
            title: 'Error',
            description: 'SVG generator not ready. Please refresh the page.',
            variant: 'destructive',
          });
          return;
        }

        // Download each name as a separate PNG
        names.forEach((name, index) => {
          setTimeout(() => {
            try {
              const svgString = generateFn(name);
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
              const svgElement = svgDoc.documentElement as SVGSVGElement;
              
              const cloned = svgElement.cloneNode(true) as SVGSVGElement;
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
            title: 'Download Complete',
            description: `All ${names.length} PNG file${names.length > 1 ? 's' : ''} have been downloaded.`,
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
          link.download = `${safeFileName}.png`;
          link.click();
          toast({
            title: 'Download Complete',
            description: 'Your PNG file has been downloaded.',
          });
        }
        URL.revokeObjectURL(url);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        toast({
          title: 'Download Failed',
          description: 'Unable to generate PNG. Please try again.',
          variant: 'destructive',
        });
      };
      image.src = url;
    } catch (error) {
      console.error('Unable to download PNG', error);
      toast({
        title: 'Error',
        description: 'An error occurred while downloading. Please try again.',
        variant: 'destructive',
      });
    }
  }, [batchMode, multipleNames, formatName, letterCase, safeFileName, svgRef, toast]);

  const handleNameInput = (value: string) => {
    if (value.length > MAX_NAME_LENGTH) {
      setChildName(value.slice(0, MAX_NAME_LENGTH));
      return;
    }
    const cleaned = value.replace(/[^A-Za-zÀ-ÿ' -]/g, '');
    setChildName(cleaned);
  };

  // Calculate page dimensions based on paper size and orientation
  const pageDimensions = React.useMemo(() => {
    let width = 850; // US Letter portrait default
    let height = 1100;
    
    if (paperSize === 'a4') {
      width = 794; // A4 width at 96 DPI
      height = 1123; // A4 height at 96 DPI
    } else if (paperSize === 'legal') {
      width = 850;
      height = 1400; // Legal height
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
    switch (fontStyle) {
      case 'bubble':
        return {
          fontFamily: "'Comic Neue', 'Patrick Hand', 'Arial Rounded MT Bold', 'Segoe UI', sans-serif",
          fontWeight: 800,
          letterSpacing: 6,
          fill: '#1d4ed8',
          stroke: '#1d4ed8',
          strokeWidth: 6,
          dashArray: undefined,
        };
      case 'script':
        return {
          fontFamily: "'Dancing Script', 'Pacifico', 'Brush Script MT', cursive",
          fontWeight: 600,
          letterSpacing: 4,
          fill: '#1f2937',
          stroke: undefined,
          strokeWidth: 0,
          dashArray: undefined,
        };
      case 'classic':
        return {
          fontFamily: "'Patrick Hand', 'Handlee', 'Comic Neue', 'Segoe UI', sans-serif",
          fontWeight: 600,
          letterSpacing: 3,
          fill: '#0f172a',
          stroke: undefined,
          strokeWidth: 0,
          dashArray: undefined,
        };
      default:
        return {
          fontFamily: "'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif",
          fontWeight: 600,
          letterSpacing: 4,
          fill: 'rgba(59, 130, 246, 0.15)',
          stroke: '#2563eb',
          strokeWidth: 5,
          dashArray: '0 26',
        };
    }
  }, [fontStyle]);

  const sizeMultiplier = fontSizeMode === 'large' ? 1 : fontSizeMode === 'medium' ? 0.85 : 0.7;
  const baseFontSize = (fontStyle === 'script' ? 100 : 110) * sizeMultiplier;

  // Calculate font config for each name in preview
  const fittedFontConfigs = React.useMemo(() => {
    return formattedNames.map(displayName => {
      const startX = margin + 40;
      const endX = pageWidth - margin + 20;
      const usableWidth = endX - startX;
      const maxWidth = Math.max(140, usableWidth - 80);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const dominantRowType = practicingRows.find((row) => row === 'trace') ? 'trace' : 'blank';
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

  // For backward compatibility
  const fittedFontConfig = fittedFontConfigs[0] || baseFontConfig;

  // Helper function to generate SVG for a given name (defined here after all dependencies)
  const generateSVGForName = React.useCallback((name: string): string => {
    const formatted = formatName(name, letterCase);
    const practicingRows = (() => {
      const sequence = patternStyle === 'traceOnly'
        ? ['trace']
        : ['trace', 'trace', 'blank'];
      const rows: Array<'trace' | 'blank'> = [];
      for (let i = 0; rows.length < rowCount; i += 1) {
        rows.push(sequence[i % sequence.length] as 'trace' | 'blank');
      }
      return rows;
    })();

    // Calculate font config for this name
    const startX = margin + 40;
    const endX = pageWidth - margin + 20;
    const usableWidth = endX - startX;
    const maxWidth = Math.max(140, usableWidth - 80);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dominantRowType = practicingRows.find((row) => row === 'trace') ? 'trace' : 'blank';
    const isTraceRow = dominantRowType === 'trace';
    const weight = baseFontConfig.fontWeight || 600;
    if (ctx) {
      ctx.font = `${weight} ${baseFontSize}px ${baseFontConfig.fontFamily}`;
    }
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
    const fittedDashArray = baseFontConfig.dashArray
      ? `0 ${Math.max(12, Math.round(26 * scale))}`
      : undefined;

    const fittedFontConfig = {
      ...baseFontConfig,
      fontSize: fittedSize,
      letterSpacing: fittedSpacing,
      strokeWidth: fittedStrokeWidth,
      dashArray: fittedDashArray,
    };

    const baselineOffset = lineStyle === 'primary' ? 96 : 88;
    const rowGap = lineStyle === 'primary' ? 170 : 150;
    const maxRows = Math.min(rowCount, Math.max(3, Math.floor((pageHeight - margin * 2) / rowGap)));
    const rowsForSVG = practicingRows.slice(0, maxRows);

    // Generate SVG content
    let svgContent = `<rect x="0" y="0" width="${pageWidth}" height="${pageHeight}" fill="#ffffff" rx="36" />`;
    svgContent += `<rect x="${margin - 24}" y="${margin - 24}" width="${pageWidth - (margin - 24) * 2}" height="${pageHeight - (margin - 24) * 2}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="28" />`;

    rowsForSVG.forEach((rowType, index) => {
      const baselineY = margin + 120 + index * rowGap;
      const startX = margin + 40;
      const endX = pageWidth - margin + 20;
      const topLine = baselineY - baselineOffset;
      const midLine = baselineY - baselineOffset / 2;
      const showPrimary = lineStyle === 'primary';

      if (showPrimary) {
        svgContent += `<line x1="${startX}" y1="${topLine}" x2="${endX}" y2="${topLine}" stroke="#cbd5f5" stroke-width="3" stroke-dasharray="10 14" />`;
        svgContent += `<line x1="${startX}" y1="${midLine}" x2="${endX}" y2="${midLine}" stroke="#dbeafe" stroke-width="2.5" stroke-dasharray="14 14" />`;
      }
      svgContent += `<line x1="${startX}" y1="${baselineY}" x2="${endX}" y2="${baselineY}" stroke="#94a3b8" stroke-width="4" />`;

      if (rowType === 'blank') {
        svgContent += `<line x1="${startX}" y1="${baselineY + 26}" x2="${endX}" y2="${baselineY + 26}" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="14 16" />`;
      } else {
        if (showGuideDots) {
          svgContent += `<circle cx="${startX - 16}" cy="${baselineY - baselineOffset / 3}" r="8" fill="#34d399" />`;
        }
        if (fontStyle === 'dotted') {
          svgContent += `<text x="${startX}" y="${baselineY - 8}" font-family="${fittedFontConfig.fontFamily}" font-size="${fittedFontConfig.fontSize}" font-weight="${fittedFontConfig.fontWeight}" fill="${fittedFontConfig.fill}" style="letter-spacing: ${fittedFontConfig.letterSpacing}px">${formatted}</text>`;
        }
        svgContent += `<text x="${startX}" y="${baselineY - 8}" font-family="${fittedFontConfig.fontFamily}" font-size="${fittedFontConfig.fontSize}" font-weight="${fittedFontConfig.fontWeight}" fill="${fontStyle === 'dotted' ? 'none' : fittedFontConfig.fill}" stroke="${fittedFontConfig.stroke || 'none'}" stroke-width="${fittedFontConfig.strokeWidth || 0}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${fittedFontConfig.dashArray || 'none'}" style="letter-spacing: ${fittedFontConfig.letterSpacing}px">${formatted}</text>`;
      }
    });

    svgContent += `<text x="${margin}" y="${pageHeight - margin + 10}" font-size="18" font-family="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif" fill="#94a3b8">Trace slowly, say each letter aloud, and celebrate every line!</text>`;

    return `<svg viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
  }, [formatName, letterCase, patternStyle, rowCount, margin, pageWidth, pageHeight, baseFontConfig, baseFontSize, sizeMultiplier, fontStyle, lineStyle, showGuideDots]);

  // Store the function in ref so it can be accessed by callbacks
  React.useEffect(() => {
    generateSVGForNameRef.current = generateSVGForName;
  }, [generateSVGForName]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Create Personalized Name Tracing Worksheets | Free Printable Name Practice for Kids"
        description="Make learning fun with free printable name tracing worksheets! Type your child's name, choose lines or dotted fonts, and print a personalized handwriting sheet they'll love practicing every day."
        canonicalUrl="https://wizqo.com/printables/name-tracing-generator"
      />

      <UnifiedNavigation currentPage="printables" />

      <main className="pt-12 pb-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-10 lg:gap-14">
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-3xl shadow-sm p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> Make it personal
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-4 leading-tight">
                  Create Personalized Name Tracing Worksheets
                </h1>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  Type a name, pick your favorite tracing style, and print a practice sheet that feels like it was made just for your child. Perfect for preschool, kindergarten, and first-grade handwriting warm-ups.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6">
                {/* Mode Selection */}
                <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Mode</p>
                    <p className="text-xs text-slate-500">Single name or batch generation</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBatchMode('single')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        batchMode === 'single'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-purple-100'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchMode('batch')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        batchMode === 'batch'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-purple-100'
                      }`}
                    >
                      Batch
                    </button>
                  </div>
                </div>

                {batchMode === 'single' ? (
                  <div>
                    <Label htmlFor="child-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Enter your name
                    </Label>
                    <Input
                      id="child-name"
                      value={childName}
                      onChange={(event) => handleNameInput(event.target.value)}
                      placeholder="Type a name"
                      className="mt-2 h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-purple-500 text-base"
                      maxLength={MAX_NAME_LENGTH}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Up to {MAX_NAME_LENGTH} characters. Letters, spaces, hyphens, and apostrophes are welcome.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="multiple-names" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Enter names (one per line)
                    </Label>
                    <Textarea
                      id="multiple-names"
                      value={multipleNames}
                      onChange={(e) => setMultipleNames(e.target.value)}
                      placeholder="Emma&#10;Liam&#10;Sophia&#10;Noah"
                      className="mt-2 min-h-[120px] rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-purple-500 text-sm font-mono"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Enter one name per line. Up to {MAX_NAME_LENGTH} characters per name. Maximum 50 names.
                    </p>
                    {multipleNames && (
                      <p className="mt-1 text-xs text-purple-600 font-medium">
                        {multipleNames.split('\n').filter(n => n.trim().length > 0).length} name{multipleNames.split('\n').filter(n => n.trim().length > 0).length !== 1 ? 's' : ''} entered
                      </p>
                    )}
                    
                    {batchMode === 'batch' && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Layout (batch mode)
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setBatchLayout('one-per-page')}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                              batchLayout === 'one-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            1 per page
                          </button>
                          <button
                            type="button"
                            onClick={() => setBatchLayout('two-per-page')}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                              batchLayout === 'two-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            2 per page
                          </button>
                          <button
                            type="button"
                            onClick={() => setBatchLayout('four-per-page')}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                              batchLayout === 'four-per-page'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            4 per page
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Print Layout Settings */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Print Layout Settings</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Orientation</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPrintOrientation('portrait')}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                              printOrientation === 'portrait'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-purple-50'
                            }`}
                          >
                            Portrait
                          </button>
                          <button
                            type="button"
                            onClick={() => setPrintOrientation('landscape')}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                              printOrientation === 'landscape'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-purple-50'
                            }`}
                          >
                            Landscape
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Paper Size</Label>
                        <div className="relative">
                          <select
                            value={paperSize}
                            onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          >
                            <option value="us-letter">US Letter (8.5" × 11")</option>
                            <option value="a4">A4 (8.27" × 11.69")</option>
                            <option value="legal">Legal (8.5" × 14")</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Margins</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['none', 'small', 'medium', 'large'] as MarginSize[]).map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setMarginSize(size)}
                              className={`px-2 py-2 rounded-xl text-xs font-medium transition capitalize ${
                                marginSize === size
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-slate-700 hover:bg-purple-50'
                              }`}
                            >
                              {size}
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
                      Letter Case
                    </Label>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={letterCase}
                    onValueChange={(value) => value && setLetterCase(value as LetterCase)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <ToggleGroupItem value="title" aria-label="Title case" className="rounded-xl">
                      Title Case
                    </ToggleGroupItem>
                    <ToggleGroupItem value="upper" aria-label="Uppercase" className="rounded-xl">
                      UPPERCASE
                    </ToggleGroupItem>
                    <ToggleGroupItem value="lower" aria-label="Lowercase" className="rounded-xl">
                      lowercase
                    </ToggleGroupItem>
                    <ToggleGroupItem value="original" aria-label="Original" className="rounded-xl">
                      Keep As Typed
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Tracing Style
                    </Label>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={fontStyle}
                    onValueChange={(value) => value && setFontStyle(value as FontStyle)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <ToggleGroupItem value="dotted" className="rounded-xl">
                      Dotted Lines
                    </ToggleGroupItem>
                    <ToggleGroupItem value="classic" className="rounded-xl">
                      Solid Trace
                    </ToggleGroupItem>
                    <ToggleGroupItem value="bubble" className="rounded-xl">
                      Bubble Letters
                    </ToggleGroupItem>
                    <ToggleGroupItem value="script" className="rounded-xl">
                      Cursive Flow
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Font Size
                    </Label>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={fontSizeMode}
                    onValueChange={(value) => value && setFontSizeMode(value as FontSizeMode)}
                    className="grid grid-cols-3 gap-2"
                  >
                    <ToggleGroupItem value="small" className="rounded-xl" aria-label="Small font size">
                      Small
                    </ToggleGroupItem>
                    <ToggleGroupItem value="medium" className="rounded-xl" aria-label="Medium font size">
                      Medium
                    </ToggleGroupItem>
                    <ToggleGroupItem value="large" className="rounded-xl" aria-label="Large font size">
                      Large
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Guideline Lines</h3>
                        <p className="text-xs text-slate-500">Choose handwriting lines</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => setLineStyle('primary')}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition ${lineStyle === 'primary' ? 'border-purple-400 bg-white shadow-sm text-slate-900' : 'border-transparent hover:bg-white/70 text-slate-600'}`}
                      >
                        Primary lines (top, middle, baseline)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLineStyle('baseline')}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition ${lineStyle === 'baseline' ? 'border-purple-400 bg-white shadow-sm text-slate-900' : 'border-transparent hover:bg-white/70 text-slate-600'}`}
                      >
                        Single baseline only
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Practice Pattern</h3>
                        <p className="text-xs text-slate-500">Mix tracing with blank lines</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => setPatternStyle('traceAndWrite')}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition ${patternStyle === 'traceAndWrite' ? 'border-purple-400 bg-white shadow-sm text-slate-900' : 'border-transparent hover:bg-white/70 text-slate-600'}`}
                      >
                        Trace + write it yourself (best for practice)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPatternStyle('traceOnly')}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition ${patternStyle === 'traceOnly' ? 'border-purple-400 bg-white shadow-sm text-slate-900' : 'border-transparent hover:bg-white/70 text-slate-600'}`}
                      >
                        Tracing only (repeat the name on every line)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Friendly start dot</p>
                    <p className="text-xs text-slate-500">Show a colorful dot so kids know where to begin</p>
                  </div>
                  <Switch
                    checked={showGuideDots}
                    onCheckedChange={setShowGuideDots}
                    aria-label="Toggle start dot"
                  />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Number of practice lines</h3>
                      <p className="text-xs text-slate-500">Choose between 3 and 6 rows</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {[3, 4, 5, 6].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setRowCount(count)}
                        aria-label={`${count} practice rows`}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${rowCount === count ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-600'}`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handlePrint}
                    className="rounded-2xl h-11 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Print worksheet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadPNG}
                    className="rounded-2xl h-11"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PNG
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Make handwriting practice feel magical</h2>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="font-semibold text-slate-800">❤️ Personalized connection:</span> Create my child's name tracing printable in seconds.</li>
                  <li><span className="font-semibold text-slate-800">🌈 Encouraging practice:</span> Make handwriting fun with custom name tracing sheets they look forward to.</li>
                  <li><span className="font-semibold text-slate-800">📚 Teacher-approved:</span> Perfect for classroom centers, homework packets, and homeschool warm-ups.</li>
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Live preview</h2>
                      <p className="text-xs text-slate-500">
                        {batchMode === 'batch' 
                          ? `Showing preview of ${formattedNames.length} name${formattedNames.length > 1 ? 's' : ''} (${batchLayout === 'two-per-page' ? '2 per page' : batchLayout === 'four-per-page' ? '4 per page' : '1 per page'}). Everything prints beautifully on ${paperSize === 'a4' ? 'A4' : paperSize === 'legal' ? 'Legal' : 'US Letter'} paper (${printOrientation}).`
                          : `Everything you see prints beautifully on ${paperSize === 'a4' ? 'A4' : paperSize === 'legal' ? 'Legal' : 'US Letter'} paper (${printOrientation}).`
                        }
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
                      {batchMode === 'batch' ? 'Batch mode' : 'Ready to trace'}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 p-4">
                  <div className="bg-white rounded-2xl shadow-inner border border-slate-200">
                    <div id="name-tracing-sheet" className="p-4">
                      {batchMode === 'batch' && formattedNames.length > 1 ? (
                        // Show multiple names in batch mode when there are multiple names
                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                          role="img"
                          aria-label="Name tracing worksheets preview"
                          className="w-full h-auto"
                        >
                          <defs>
                            {formattedNames.map((_, nameIndex) => {
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
                          <rect x={0} y={0} width={pageWidth} height={pageHeight} fill="#ffffff" rx={36} />
                          <rect
                            x={margin - 24}
                            y={margin - 24}
                            width={pageWidth - (margin - 24) * 2}
                            height={pageHeight - (margin - 24) * 2}
                            fill="#f8fafc"
                            stroke="#e2e8f0"
                            strokeWidth={2}
                            rx={28}
                          />
                          {formattedNames.map((name, nameIndex) => {
                            // Use the name from the map parameter directly - it's already the correct value
                            if (!name) return null;
                            
                            // Debug logging
                            if (process.env.NODE_ENV === 'development') {
                              console.log(`Rendering name at index ${nameIndex}:`, name, 'from formattedNames:', formattedNames);
                              console.log(`Worksheet position: x=${worksheetX}, y=${worksheetY}, width=${worksheetWidth}, height=${worksheetHeight}`);
                            }
                            
                            const nameConfig = fittedFontConfigs[nameIndex] || fittedFontConfig;
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
                                {/* Debug: Visual border for worksheet area (remove in production) */}
                                {process.env.NODE_ENV === 'development' && (
                                  <rect x={0} y={0} width={worksheetWidth} height={worksheetHeight} fill="none" stroke="red" strokeWidth={2} strokeDasharray="5,5" opacity={0.3} />
                                )}
                                {adjustedRows.map((rowType, rowIndex) => {
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
                                          <line x1={startX} y1={topLine} x2={endX} y2={topLine} stroke="#cbd5f5" strokeWidth={3} strokeDasharray="10 14" />
                                          <line x1={startX} y1={midLine} x2={endX} y2={midLine} stroke="#dbeafe" strokeWidth={2.5} strokeDasharray="14 14" />
                                        </>
                                      )}
                                      <line x1={startX} y1={baselineY} x2={endX} y2={baselineY} stroke="#94a3b8" strokeWidth={4} />
                                      
                                      {rowType === 'blank' ? (
                                        <line x1={startX} y1={baselineY + 26} x2={endX} y2={baselineY + 26} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="14 16" />
                                      ) : (
                                        <>
                                          {showGuideDots && (
                                            <circle cx={startX - 16} cy={baselineY - baselineOffset / 3} r={8} fill="#34d399" />
                                          )}
                                          {fontStyle === 'dotted' && (
                                            <text
                                              x={startX}
                                              y={baselineY - 8}
                                              fontFamily={nameConfig.fontFamily}
                                              fontSize={nameConfig.fontSize}
                                              fontWeight={nameConfig.fontWeight}
                                              fill={nameConfig.fill}
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
                                            fill={fontStyle === 'dotted' ? 'none' : nameConfig.fill}
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
                                    </g>
                                  );
                                })}
                                </g>
                              </g>
                            );
                          })}
                          <text
                            x={margin}
                            y={pageHeight - margin + 10}
                            fontSize={18}
                            fontFamily="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif"
                            fill="#94a3b8"
                          >
                            Trace slowly, say each letter aloud, and celebrate every line!
                          </text>
                        </svg>
                      ) : (
                        // Single name preview (single mode or one-per-page batch mode)
                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                          role="img"
                          aria-label="Name tracing worksheet preview"
                          className="w-full h-auto"
                        >
                          <rect x={0} y={0} width={pageWidth} height={pageHeight} fill="#ffffff" rx={36} />
                          <rect
                            x={margin - 24}
                            y={margin - 24}
                            width={pageWidth - (margin - 24) * 2}
                            height={pageHeight - (margin - 24) * 2}
                            fill="#f8fafc"
                            stroke="#e2e8f0"
                            strokeWidth={2}
                            rx={28}
                          />

                          {rowsForPreview.map((rowType, index) => {
                            const baselineY = margin + 120 + index * rowGap;
                            const startX = margin + 40;
                            const endX = pageWidth - margin + 20;
                            const topLine = baselineY - baselineOffset;
                            const midLine = baselineY - baselineOffset / 2;
                            const showPrimary = lineStyle === 'primary';
                            const accessibilityLabel = rowType === 'blank'
                              ? 'Blank handwriting line'
                              : 'Traceable handwriting line';
                            return (
                              <g key={`row-${index}`} aria-label={accessibilityLabel}>
                                {showPrimary && (
                                  <>
                                    <line x1={startX} y1={topLine} x2={endX} y2={topLine} stroke="#cbd5f5" strokeWidth={3} strokeDasharray="10 14" />
                                    <line x1={startX} y1={midLine} x2={endX} y2={midLine} stroke="#dbeafe" strokeWidth={2.5} strokeDasharray="14 14" />
                                  </>
                                )}
                                <line x1={startX} y1={baselineY} x2={endX} y2={baselineY} stroke="#94a3b8" strokeWidth={4} />

                                {rowType === 'blank' ? (
                                  <>
                                    <line
                                      x1={startX}
                                      y1={baselineY + 26}
                                      x2={endX}
                                      y2={baselineY + 26}
                                      stroke="#e2e8f0"
                                      strokeWidth={2}
                                      strokeDasharray="14 16"
                                    />
                                  </>
                                ) : (
                                  <>
                                    {showGuideDots && (
                                      <circle cx={startX - 16} cy={baselineY - baselineOffset / 3} r={8} fill="#34d399" />
                                    )}
                                    {fontStyle === 'dotted' && (
                                      <text
                                        x={startX}
                                        y={baselineY - 8}
                                        fontFamily={fittedFontConfig.fontFamily}
                                        fontSize={fittedFontConfig.fontSize}
                                        fontWeight={fittedFontConfig.fontWeight}
                                        fill={fittedFontConfig.fill}
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
                                      fill={fontStyle === 'dotted' ? 'none' : fittedFontConfig.fill}
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
                              </g>
                            );
                          })}

                          <text
                            x={margin}
                            y={pageHeight - margin + 10}
                            fontSize={18}
                            fontFamily="'Patrick Hand', 'Comic Neue', 'Segoe UI', sans-serif"
                            fill="#94a3b8"
                          >
                            Trace slowly, say each letter aloud, and celebrate every line!
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
    </div>
  );
}
