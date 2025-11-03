import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Printer, Sparkles } from 'lucide-react';

type LetterCase = 'original' | 'title' | 'upper' | 'lower';
type FontStyle = 'classic' | 'dotted' | 'bubble' | 'script';
type FontSizeMode = 'small' | 'medium' | 'large';
type LineStyle = 'primary' | 'baseline';
type PatternStyle = 'traceOnly' | 'traceAndWrite';

const MAX_NAME_LENGTH = 18;

export default function NameTracingGeneratorPage() {
  const [childName, setChildName] = React.useState<string>('Ava');
  const [letterCase, setLetterCase] = React.useState<LetterCase>('title');
  const [fontStyle, setFontStyle] = React.useState<FontStyle>('dotted');
  const [fontSizeMode, setFontSizeMode] = React.useState<FontSizeMode>('large');
  const [lineStyle, setLineStyle] = React.useState<LineStyle>('primary');
  const [showGuideDots, setShowGuideDots] = React.useState<boolean>(true);
  const [patternStyle, setPatternStyle] = React.useState<PatternStyle>('traceAndWrite');
  const [rowCount, setRowCount] = React.useState<number>(4);

  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const formattedName = React.useMemo(() => {
    const trimmed = childName.trim();
    if (!trimmed) return 'Your Name';
    switch (letterCase) {
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
  }, [childName, letterCase]);

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

  const handlePrint = React.useCallback(() => {
    try {
      const container = document.getElementById('name-tracing-sheet');
      if (!container) return;
      const svg = container.querySelector('svg');
      if (!svg) return;

      const html = `<!doctype html><html><head><meta charset="utf-8" />
<title>Name Tracing Worksheet</title>
<style>
  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 8.5in; height: 11in; background: #fff; }
  #frame { position: relative; width: 8.5in; height: 11in; overflow: hidden; }
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
        } catch (error) {
          console.error('Print failed', error);
        }
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {}
        }, 600);
      };
      if (iframe.contentWindow?.document.readyState === 'complete') finish();
      else iframe.onload = finish;
    } catch (error) {
      console.error('Unable to print name tracing sheet', error);
    }
  }, []);

  const handleDownloadPNG = React.useCallback(() => {
    try {
      const svgElement = svgRef.current;
      if (!svgElement) return;
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
        }
        URL.revokeObjectURL(url);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
      };
      image.src = url;
    } catch (error) {
      console.error('Unable to download PNG', error);
    }
  }, [safeFileName]);

  const handleNameInput = (value: string) => {
    if (value.length > MAX_NAME_LENGTH) {
      setChildName(value.slice(0, MAX_NAME_LENGTH));
      return;
    }
    const cleaned = value.replace(/[^A-Za-zÀ-ÿ' -]/g, '');
    setChildName(cleaned);
  };

  const pageWidth = 850;
  const pageHeight = 1100;
  const margin = 80;
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

  const fittedFontConfig = React.useMemo(() => {
    const startX = margin + 40;
    const endX = pageWidth - margin + 20;
    const usableWidth = endX - startX;
    const maxWidth = Math.max(140, usableWidth - 80);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const displayName = formattedName || '';
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
  }, [baseFontConfig, baseFontSize, formattedName, fontStyle, sizeMultiplier, practicingRows, margin, pageWidth]);

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
                      <p className="text-xs text-slate-500">Everything you see prints beautifully on US Letter paper.</p>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">Ready to trace</span>
                  </div>
                </div>
                <div className="bg-slate-100 p-4">
                  <div className="bg-white rounded-2xl shadow-inner border border-slate-200">
                    <div id="name-tracing-sheet" className="p-4">
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
