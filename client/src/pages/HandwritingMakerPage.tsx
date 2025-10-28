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
    const rows = buildRows(rowsCount);
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
                style={{ vectorEffect: 'non-scaling-stroke', paintOrder: 'stroke fill' } as any}
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Free Handwriting Practice Sheets for Kids (Generator)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">Generate printable tracing worksheets with lines and dotted letters. Practice A–Z letters, simple words, or short sentences. Print and save as PDF.</p>
        </header>

        <section className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <button onClick={() => setMode('letters')} className={`px-3 py-1.5 rounded-full border ${mode==='letters'?'bg-purple-600 text-white border-purple-600':'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Letters A–Z</button>
            <button onClick={() => setMode('words')} className={`px-3 py-1.5 rounded-full border ${mode==='words'?'bg-purple-600 text-white border-purple-600':'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Words</button>
            <button onClick={() => setMode('sentences')} className={`px-3 py-1.5 rounded-full border ${mode==='sentences'?'bg-purple-600 text-white border-purple-600':'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Sentences</button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {mode==='letters' && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Letters (separate by space)</label>
                  <textarea value={letters} onChange={(e)=>setLetters(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              )}
              {mode==='words' && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Words (separate by space)</label>
                  <textarea value={words} onChange={(e)=>setWords(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              )}
              {mode==='sentences' && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Sentences (separate by period)</label>
                  <textarea value={sentences} onChange={(e)=>setSentences(e.target.value)} className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">Font size
                  <input type="number" min={28} max={72} value={fontSize} onChange={(e)=>setFontSize(parseInt(e.target.value||'42',10))} className="ml-2 w-20 px-2 py-1 border border-slate-300 rounded" />
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

              <div className="print:hidden">
                <button
                  onClick={() => { try { window.print(); } catch {} }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                  <span>⬇️</span>
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
            <div>
              <PreviewSVG />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4">
          <h2 className="text-xl font-bold text-slate-900">Tips for better handwriting</h2>
          <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
            <li>Use short sessions (5–10 minutes) with frequent praise.</li>
            <li>Model one clean letter, then let your child trace and copy.</li>
            <li>Keep wrist straight, grip relaxed; paper slightly tilted.</li>
            <li>Say letter strokes out loud (e.g., “down, around, close”).</li>
          </ul>
        </section>

      </main>
      <Footer />
    </div>
  );
}
