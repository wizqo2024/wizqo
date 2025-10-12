import React from 'react'
import { WizqoLogo } from '@/components/WizqoLogo'

export function PrintablesPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const doc = params.get('doc') || ''
  function SafeImg({ sources, alt, className }: { sources: string[]; alt: string; className?: string }) {
    const [idx, setIdx] = React.useState(0)
    const src = sources[idx] || sources[0]
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading="eager"
        decoding="async"
        onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
      />
    )
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0">
        <header className="mb-6 print:mb-4 flex items-center justify-between border-b border-slate-200 pb-3 print:border-b-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Printable Fun Learning Activities</h1>
            <p className="text-slate-600 mt-2 print:mt-1 text-sm">Print these kid‑friendly activities. Use your browser’s Print → Save as PDF to download.</p>
          </div>
          <div className="print:block">
            <WizqoLogo className="w-20 h-auto opacity-80" />
          </div>
        </header>

        {(!doc || doc === 'ws-animals') && (
        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">🧠 Word Search – Animals</h2>
          <p className="text-slate-600 text-sm mb-3">Find 12 animal names. Circle horizontally, vertically, or diagonally.</p>
          <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
            {generateWordSearchGrid(12, ["DOG","CAT","LION","BEAR","WOLF","SEAL","FROG","EAGLE","MOUSE","HORSE","ZEBRA","SNAKE"]).map((row, r) => (
              <React.Fragment key={r}>
                {row.map((ch, c) => (
                  <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        )}

        {doc === 'ws-space' && (
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900">🧠 Word Search – Space</h2>
          <p className="text-slate-600 text-sm mb-3">Find 12 space words. Circle horizontally, vertically, or diagonally.</p>
          <div className="grid grid-cols-12 gap-1 font-mono text-sm">
            {generateWordSearchGrid(12, ["STAR","MOON","SUN","COMET","ORBIT","SPACE","ALIEN","ROVER","MARS","VENUS","NEBULA","ASTRO"]).map((row, r) => (
              <React.Fragment key={r}>
                {row.map((ch, c) => (
                  <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center">{ch}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        )}

        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">🔢 Sudoku – 4×4 (Easy)</h2>
          <p className="text-slate-600 text-sm mb-3">Fill numbers 1–4 so each row/column contains all numbers with no repeats.</p>
          <div className="inline-grid grid-cols-4 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-10 h-10 border border-slate-400" />
            ))}
          </div>
        </section>

        {doc === 'sudoku6' && (
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900">🔢 Sudoku – 6×6 (Medium)</h2>
          <p className="text-slate-600 text-sm mb-3">Fill numbers 1–6 so each row/column contains all numbers with no repeats.</p>
          <div className="inline-grid grid-cols-6 gap-0">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="w-10 h-10 border border-slate-400" />
            ))}
          </div>
        </section>
        )}

        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">🎨 Coloring Page – Cute Animal</h2>
          <p className="text-slate-600 text-sm mb-3">Print and color the outline below.</p>
          <div className="border border-slate-300 rounded p-4 bg-white print:border-0 print:p-0">
            <ColoringSVG />
          </div>
        </section>

        {(doc === 'spotdiff') && (
        <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
          <h2 className="text-lg font-bold text-slate-900">👀 Spot‑the‑Difference – Playground Fun</h2>
          <p className="text-slate-600 text-sm mb-3">Compare both pictures and circle 8 differences.</p>
          <div className="grid grid-cols-2 gap-4">
            <SafeImg
              sources={[
                'https://images.unsplash.com/photo-1519681719073-a6b3c1f0b122?auto=format&fit=crop&w=1600&q=90&kidv=spot-a',
                'https://images.unsplash.com/photo-1477764860582-56fdf29dfc4d?auto=format&fit=crop&w=1600&q=90&kidv=spot-a2',
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=90&kidv=spot-a3'
              ]}
              alt="Playground scene A"
              className="w-full aspect-video object-cover bg-white border border-slate-300 rounded"
            />
            <SafeImg
              sources={[
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=90&kidv=spot-b',
                'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=1600&q=90&kidv=spot-b2',
                'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1600&q=90&kidv=spot-b3'
              ]}
              alt="Playground scene B"
              className="w-full aspect-video object-cover bg-white border border-slate-300 rounded"
            />
          </div>
        </section>
        )}

        <footer className="text-center text-slate-500 text-xs print:hidden">
          Tip: Use your browser menu → Print → Save as PDF.
        </footer>
      </div>
    </div>
  )
}

function generateWordSearchGrid(size: number, words: string[]): string[][] {
  // very basic filler grid with words placed sequentially across rows to demonstrate printing
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''))
  let r = 0, c = 0
  for (const w of words) {
    for (let i = 0; i < w.length; i++) {
      if (r >= size) break
      grid[r][c] = w[i]
      c++
      if (c >= size) { r++; c = 0 }
    }
    r++; c = 0
    if (r >= size) break
  }
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
    }
  }
  return grid
}

function ColoringSVG() {
  // Simple cat face line art for coloring
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="#111827" strokeWidth="4">
        <circle cx="200" cy="210" r="120" />
        <polygon points="110,120 170,80 170,150" />
        <polygon points="290,120 230,80 230,150" />
        <circle cx="160" cy="200" r="16" />
        <circle cx="240" cy="200" r="16" />
        <polygon points="200,220 190,235 210,235" />
        <path d="M150 260 Q200 300 250 260" />
        <line x1="120" y1="220" x2="70" y2="210" />
        <line x1="120" y1="230" x2="70" y2="230" />
        <line x1="120" y1="240" x2="70" y2="250" />
        <line x1="280" y1="220" x2="330" y2="210" />
        <line x1="280" y1="230" x2="330" y2="230" />
        <line x1="280" y1="240" x2="330" y2="250" />
      </g>
    </svg>
  )
}
