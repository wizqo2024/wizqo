import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';

type Mode = 'letters' | 'words' | 'sentences';

export default function HandwritingMakerPage() {
  const [mode, setMode] = React.useState<Mode>('letters');
  const [letters, setLetters] = React.useState<string>('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z');
  const [words, setWords] = React.useState<string>('cat dog sun moon bus red blue green');
  const [sentences, setSentences] = React.useState<string>('I can write neatly. We like to read. Today is fun.');
  const [fontSize, setFontSize] = React.useState<number>(42);
  const [lineType, setLineType] = React.useState<'primary' | 'baseline'>('primary');
  const [dotted, setDotted] = React.useState<boolean>(true);
  const [startDots, setStartDots] = React.useState<boolean>(true);
  const [autoSpaceLetters, setAutoSpaceLetters] = React.useState<boolean>(true);

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
  
</style>
</head><body><div id=\"frame\"><img id=\"print-logo\" src=\"/favicon.svg\" alt=\"Wizqo\" />${content}</div></body></html>`;
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
        } catch {}
        setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 1000);
      };
      if (iframe.contentWindow?.document.readyState === 'complete') doPrint();
      else iframe.onload = doPrint;
    } catch {}
  }

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
      if (mode === 'letters') return letters.trim().replace(/\s+/g, ' ');
      if (mode === 'words') return words.trim().replace(/\s+/g, ' ');
      const parts = sentences
        .split(/[\.!?]+/)
        .map(s => s.trim())
        .filter(Boolean);
      return parts.join(' ');
    })();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontStack = "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial";
    if (ctx) ctx.font = `${fontSize}px ${fontStack}`;
    const measure = (t: string) => (ctx ? ctx.measureText(t).width : t.length * (fontSize * 0.6));
          const availableWidth = pageW - (margin + 16) - margin;
          const letterSpacing = autoSpaceLetters
            ? (mode === 'letters' ? fontSize * 0.18 : fontSize * 0.35)
            : 0; // stronger spacing for words/sentences when enabled
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
    const baselineColor = '#cbd5e1';
    const midlineColor = '#e5e7eb';
    const topLineColor = '#e5e7eb';

    return (
      <svg viewBox={`0 0 ${pageW} ${pageH}`} className="w-full h-auto bg-white border border-slate-300 rounded" role="img" aria-label="Handwriting sheet preview">
        <rect x={margin/2} y={margin/2} width={pageW - margin} height={pageH - margin} fill="none" stroke="#e2e8f0" />
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
                fontFamily="'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial"
                fill={dotted ? 'none' : '#0f172a'}
                stroke={dotted ? '#0f172a' : 'none'}
                strokeWidth={dotted ? 2 : 0}
                strokeDasharray={dotted ? '3 5' : undefined}
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
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Handwriting Practice Sheets for Kids | Printable Tracing Worksheets"
        description="Download free printable handwriting practice sheets for kids. Trace letters A–Z, simple words, and sentences in both print and cursive. Fun and easy handwriting worksheets for young learners!"
        canonicalUrl="https://wizqo.com/worksheets/handwriting-worksheet-maker"
      />
      <UnifiedNavigation currentPage="kids" />
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
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Free Handwriting Practice Sheets for Kids (Generator)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">Generate printable tracing worksheets with guidelines and dotted letters. Practice A–Z letters, simple words, or short sentences. Print and save as PDF.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Controls */}
          <div className="order-2 md:order-1 md:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full whitespace-normal">
            {/* Mode segmented control */}
            <div className="mb-4">
              <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                <button onClick={() => setMode('letters')} className={`px-4 py-2 text-sm ${mode==='letters' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>Letters A–Z</button>
                <button onClick={() => setMode('words')} className={`px-4 py-2 text-sm border-l border-slate-200 ${mode==='words' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>Words</button>
                <button onClick={() => setMode('sentences')} className={`px-4 py-2 text-sm border-l border-slate-200 ${mode==='sentences' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>Sentences</button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {mode==='letters' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">Letters (separate by space)</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={()=>applyLettersSample('upper')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">A–Z</button>
                      <button type="button" onClick={()=>applyLettersSample('lower')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">a–z</button>
                      <button type="button" onClick={()=>applyLettersSample('mixed')} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">Aa–Zz</button>
                      <button type="button" onClick={()=>setLetters('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea
                    value={letters}
                    onChange={(e)=>{
                      const v = e.target.value;
                      if (autoSpaceLetters) {
                        const spaced = v.replace(/\s+/g, '').split('').join(' ').replace(/\s{2,}/g,' ').trim();
                        setLetters(spaced);
                      } else {
                        setLetters(v);
                      }
                    }}
                    className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e)=>setAutoSpaceLetters(e.target.checked)} /> Auto‑space letters
                  </label>
                </div>
              )}
              {mode==='words' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">Words (separate by space)</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={applyWordsSample} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">Example</button>
                      <button type="button" onClick={()=>setWords('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea value={words} onChange={(e)=>setWords(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e)=>setAutoSpaceLetters(e.target.checked)} /> Auto‑space letters
                  </label>
                </div>
              )}
              {mode==='sentences' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-700">Sentences (separate by period)</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={applySentencesSample} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">Example</button>
                      <button type="button" onClick={()=>setSentences('')} className="text-sm px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">Clear</button>
                    </div>
                  </div>
                  <textarea value={sentences} onChange={(e)=>setSentences(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={autoSpaceLetters} onChange={(e)=>setAutoSpaceLetters(e.target.checked)} /> Auto‑space letters
                  </label>
                </div>
              )}

              <div className="mt-4 border-t pt-3 grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">Font size <span className="text-slate-400">(28–72)</span>
                  <input
                    type="number"
                    min={28}
                    max={72}
                    step={2}
                    value={fontSize}
                    onChange={(e)=>{
                      const raw = parseInt(e.target.value || '42', 10);
                      const safe = isNaN(raw) ? 42 : raw;
                      const clamped = Math.max(28, Math.min(72, safe));
                      setFontSize(clamped);
                    }}
                    className="ml-2 w-24 px-2 py-1 border border-slate-300 rounded"
                  />
                </label>
                <label className="text-sm text-slate-700">Line style
                  <select value={lineType} onChange={(e)=>setLineType(e.target.value as any)} className="ml-2 px-2 py-1 border border-slate-300 rounded">
                    <option value="primary">Primary guidelines</option>
                    <option value="baseline">Baseline only</option>
                  </select>
                </label>
                <label className="text-sm text-slate-700 inline-flex items-center gap-2">
                  <input type="checkbox" checked={dotted} onChange={(e)=>setDotted(e.target.checked)} /> Dotted trace
                </label>
                <label className="text-sm text-slate-700 inline-flex items-center gap-2">
                  <input type="checkbox" checked={startDots} onChange={(e)=>setStartDots(e.target.checked)} /> Starting dot
                </label>
              </div>

              <div className="print:hidden pt-2">
                <button
                  onClick={printPreview}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm shadow"
                >
                  <span>⬇️</span>
                  <span>Print / Save as PDF</span>
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
                <PreviewSVG key={`${mode}-${lineType}-${fontSize}-${dotted}-${startDots}-${autoSpaceLetters}`} />
              </div>
              <div className="text-xs text-slate-500 mt-2 print:hidden">Tip: Long text wraps to the next line automatically.</div>
            </div>
        </section>

        

      </main>
      <Footer />
    </div>
  );
}
