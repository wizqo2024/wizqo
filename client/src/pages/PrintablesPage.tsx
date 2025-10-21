import React from 'react'
import { WizqoLogo } from '@/components/WizqoLogo'

export function PrintablesPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const doc = params.get('doc') || ''
  const packTime = params.get('time') || '5'
  const packAge = params.get('age') || 'k2'
  const packSkill = params.get('skill') || 'mixed'
  const seedParam = params.get('seed') || ''
  const variantParam = params.get('variant') || '1'
  const [showAnswers, setShowAnswers] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)
  const answerableDocs = new Set([
    'science-match',
    'spelling',
    'logic-grid',
    'grammar-detective',
    'math-maze',
  ])
  const shouldShowAnswerToggle = answerableDocs.has(doc)
  const docTitle = React.useMemo(() => {
    switch (doc) {
      case 'ten-frames-1-20':
        return '🔟 Ten Frames 1–20'
      case 'number-tracing-1-20':
        return '🔢 Number Tracing 1–20'
      case 'stem-balloon-rocket':
        return '🚀 Balloon Rocket (STEM)'
      case 'stem-walking-water':
        return '🌈 Walking Water (STEM)'
      case 'arts-3-shape-creature':
        return '🎨 Draw From 3 Shapes (Arts)'
      case 'number-tracing-1-10':
        return '🔢 Number Tracing 1–10'
      case 'uppercase-lowercase-match':
        return 'Aa–Zz Upper/Lower Letter Match'
      case 'beginning-sounds-az':
        return '🔤 Beginning Sounds (A–Z)'
      case 'addition-subtraction-0-10':
        return '➕➖ Addition & Subtraction 0–10'
      case 'ten-frames-1-10':
        return '🔟 Ten Frames 1–10'
      case 'shapes-colors-sort':
        return '◻ Shapes & Colors Sort (Cut & Glue)'
      case 'dot-to-dot-1-20':
        return '1–20 Dot‑to‑Dot'
      case 'tangram-animals':
        return 'Tangram Animals (Cutouts)'
      case 'spot-difference':
        return '👀 Spot‑the‑Difference'
      case 'directed-drawing-animals':
        return '🖊️ Directed Drawing: Animals'
      case 'cut-and-paste-crafts':
        return '✂️ Cut‑and‑Paste Paper Crafts'
      case 'feelings-checkin':
        return '😊 Feelings Check‑In Meter'
      case 'reward-chart':
        return '⭐ Weekly Reward / Sticker Chart'
      case 'reading-mini-1':
        return '📖 Mini Reading Passage + 3 Questions'
      case 'pack':
        return `Today’s ${packTime}-Minute Print Pack`
      default:
        return 'Printable Fun Learning Activities'
    }
  }, [doc])
  const pinHref = React.useMemo(() => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print'
      const desc = `${docTitle} — free printable for kids`
      return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc)}`
    } catch {
      return '#'
    }
  }, [docTitle])

  // Build a daily/variant seed: today if none provided
  const todaySeed = React.useMemo(() => {
    try {
      const d = new Date()
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return '2025-01-01'
    }
  }, [])

  const effectiveSeed = seedParam || todaySeed
  const variant = parseInt(variantParam || '1', 10)

  const friendlyAge = (v: string) => v === 'k2' ? 'K–2' : v === '35' ? '3–5' : v === '68' ? '6–8' : v
  const friendlyFocus = (v: string) => ({ mixed: 'Mixed', focus: 'Focus', reading: 'Reading', stem: 'STEM', creativity: 'Creativity' } as any)[v] || v

  // Deterministic tiny RNG for repeatable print packs
  function makeRng(seedStr: string) {
    let seed = 0
    for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) >>> 0
    return function rng() {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0xffffffff
    }
  }
  function pick<T>(arr: T[], rng: () => number) { return arr[Math.floor(rng() * arr.length)] }
  function pickNUnique<T>(arr: T[], n: number, rng: () => number): T[] {
    const pool = arr.slice()
    const out: T[] = []
    while (out.length < Math.min(n, pool.length)) {
      const idx = Math.floor(rng() * pool.length)
      out.push(pool.splice(idx, 1)[0])
    }
    return out
  }
  function buildWords(theme: string, age: string): string[] {
    if (theme === 'sight') {
      return age === 'k2'
        ? ['THE','AND','IS','YOU','ARE','IT','IN','TO','WE','GO']
        : age === '35'
          ? ['THIS','THAT','WHEN','YOUR','WHICH','WHERE','THEIR','COULD','WOULD','SHOULD']
          : ['BECAUSE','THROUGH','BEFORE','BETWEEN','AROUND','ANOTHER','ALREADY','THOUGHT','ENOUGH','FAMILY']
    }
    if (theme === 'space') {
      return age === 'k2'
        ? ['MOON','STAR','SKY','SUN','ROCK','DUST','SHIP','RING']
        : age === '35'
          ? ['MARS','COMET','ORBIT','ROVER','VENUS','SATURN','PLUTO','CRATER']
          : ['NEBULA','GALAXY','ROCKET','ASTRO','QUASAR','ECLIPSE','METEOR','COSMOS']
    }
    // animals
    return age === 'k2'
      ? ['CAT','DOG','OWL','PIG','ANT','FOX','BEE','COW','BAT','HEN']
      : age === '35'
        ? ['HORSE','TIGER','EAGLE','WHALE','MOUSE','OTTER','CAMEL','ZEBRA','GORILLA']
        : ['LLAMA','ORCA','PANDA','LYNX','HYENA','JAGUAR','RHINO','DOLPHIN','BUFFALO']
  }
  function buildGridLetters(words: string[], size: number, seedStr: string): string[] {
    const rng = makeRng(seedStr)
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const grid = new Array(size * size).fill('')
    // place words horizontally on successive rows
    let row = 0
    for (const w of words) {
      if (row >= size) break
      const start = Math.max(0, Math.floor((size - Math.min(w.length, size)) * rng()))
      for (let i = 0; i < Math.min(w.length, size); i++) grid[row * size + start + i] = w[i]
      row++
    }
    // fill blanks with random letters
    for (let i = 0; i < grid.length; i++) if (!grid[i]) grid[i] = A[Math.floor(rng() * A.length)]
    return grid
  }
  const mathMazeCells = React.useMemo(() => {
    if (doc !== 'math-maze') return [] as string[];
    const cells: string[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 && c === 0) { cells.push('S'); continue; }
        if (r === 6 && c === 6) { cells.push('F'); continue; }
        // Prefer non-negative, age-appropriate results (<= 18)
        const useAddition = Math.random() < 0.7; // weight towards addition
        if (useAddition) {
          let a = Math.floor(Math.random() * 9) + 1; // 1..9
          let b = Math.floor(Math.random() * 9) + 1; // 1..9
          if (a + b > 18) b = Math.max(1, 18 - a); // clamp to <= 18
          cells.push(`${a}+${b}`);
        } else {
          const big = Math.floor(Math.random() * 9) + 1; // 1..9
          const small = Math.floor(Math.random() * (big + 1)); // 0..big (allows 0)
          cells.push(`${big}-${small}`);
        }
      }
    }
    return cells;
  }, [doc])
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
        {/* Doc-specific back link is above header; sections appear below header */}
        <div className="mb-4 print:hidden flex justify-end">
          <a href={(() => {
            try {
              const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
              const from = u.searchParams.get('from')
              // Determine category anchor by doc
              const cat = doc.startsWith('coloring') ? 'Coloring' : (
                // Worksheets
                ['math-maze','spelling','science-match','grammar-detective','sudoku4','sudoku6','number-tracing-1-10','uppercase-lowercase-match','beginning-sounds-az','addition-subtraction-0-10','ten-frames-1-10','shapes-colors-sort','ten-frames-1-20','number-tracing-1-20','place-value-hto','add-2digit-100','sub-2digit-100','skip-count-5-10-120','word-problems-100','compare-2digit'].includes(doc) ? 'Worksheets' : (
                  // Creative & Art
                  ['color-by-number','bookmark-templates','design-monster','draw-half','directed-drawing-animals','cut-and-paste-crafts'].includes(doc) ? 'Creative' : (
                    // Brain & Focus
                    ['spot-difference','logic-grid','ws-animals','ws-space','maze-focus','hidden-object','dot-to-dot-1-20','tangram-animals'].includes(doc) ? 'Brain' : (
                      // Emotional & Mindfulness
                      ['feelings-checkin','mood-tracker','mandalas','gratitude-jar','weekly-goals','reward-chart'].includes(doc) ? 'Emotional' : (
                        // Seasonal & Holiday
                        ['halloween-pack','winter-kindness','spring-scavenger','summer-pack'].includes(doc) ? 'Seasonal' : (
                          // Challenge Packs
                          ['brain-boost','creative-challenge','ws-world','animal-pack'].includes(doc) ? 'Challenge' : (
                            // One-pagers
                            ['stem-balloon-rocket','stem-walking-water','arts-3-shape-creature','reading-mini-1'].includes(doc) ? 'One-pagers' : ''
                          )
                        )
                      )
                    )
                  )
                ))
              const hash = cat ? `#${encodeURIComponent(cat)}` : ''
              return from === 'printables' ? `/printables${hash}` : '/printables'
            } catch {
              return '/printables'
            }
          })()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-label="Back printable page">
            <span>←</span>
            <span>Back printable page</span>
          </a>
        </div>
        <header className="mb-6 print:mb-4 flex items-center justify-between border-b border-slate-200 pb-3 print:border-b-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{docTitle}</h1>
            <p className="text-slate-600 mt-2 print:mt-1 text-sm">Print these kid‑friendly activities. Use your browser’s Print → Save as PDF to download.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={pinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden print:hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm"
              title="Pin this printable"
              aria-label="Pin this printable on Pinterest"
            >
              <span>📌</span>
              <span>Pin this</span>
            </a>
            {shouldShowAnswerToggle && (
              <div className="print:hidden">
                <button
                  onClick={() => setShowAnswers((v) => !v)}
                  aria-pressed={showAnswers}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${showAnswers ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'}`}
                  title="Toggle answer key visibility"
                >
                  {showAnswers ? 'Hide answers' : 'Show answers'}
                </button>
              </div>
            )}
            <div className="print:block">
              <WizqoLogo className="w-20 h-auto opacity-80" />
            </div>
          </div>
        </header>

        {/* Doc-specific sections (unique content per topic) */}
        {doc === 'number-tracing-1-10' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Trace Numbers 1–10</h2>
            <p className="text-slate-600 text-sm mb-3">Start‑point arrows included. Say each number while tracing; then color one object for each number.</p>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <svg key={n} viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#94a3b8" strokeWidth="3">
                    <path strokeDasharray="6 6" d={`M40 160 H360`} />
                  </g>
                  <g fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round">
                    {n===1 && <path d="M120 150 L120 60" />}
                    {n===2 && <path d="M90 90 Q120 60, 150 90 Q180 120, 90 150 H180" />}
                    {n===3 && <path d="M105 85 C135 65,170 85,150 100 C170 115,135 135,105 115" />}
                    {n===4 && (
                      <g>
                        <path d="M160 60 L100 110 H170" />
                        <path d="M160 60 V150" />
                      </g>
                    )}
                    {n===5 && <path d="M170 70 H100 V110 Q130 90, 160 110 Q170 140, 120 150" />}
                    {n===6 && <path d="M160 80 Q100 80, 110 120 Q140 160, 170 130 Q150 110, 120 120" />}
                    {n===7 && <path d="M90 70 H170 L110 150" />}
                    {n===8 && (
                      <g>
                        <circle cx="120" cy="95" r="26" fill="none" />
                        <circle cx="120" cy="135" r="26" fill="none" />
                      </g>
                    )}
                    {n===9 && (
                      <g>
                        <circle cx="135" cy="100" r="28" fill="none" />
                        <path d="M162 120 Q150 150, 120 150" />
                      </g>
                    )}
                    {n===10 && (
                      <g>
                        <path d="M90 150 L90 80" />
                        <circle cx="140" cy="115" r="30" fill="none" />
                      </g>
                    )}
                  </g>
                  <circle cx="80" cy="70" r="6" fill="#ef4444" />
                  <text x="300" y="60" fontSize="28" fill="#111827">{n}</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {doc === 'number-tracing-1-20' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Trace Numbers 1–20</h2>
            <p className="text-slate-600 text-sm mb-3">Start‑point arrows included. Say each number while tracing; then color one object for each number.</p>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(20).keys()].map((i) => {
                const n = i + 1;
                return (
                  <svg key={n} viewBox="0 0 400 200" className="w-full h-auto bg-white border border-slate-300 rounded">
                    <g fill="none" stroke="#94a3b8" strokeWidth="3">
                      <path strokeDasharray="6 6" d={`M40 160 H360`} />
                    </g>
                    <g fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round">
                      {n===1 && <path d="M120 150 L120 60" />}
                      {n===2 && <path d="M90 90 Q120 60, 150 90 Q180 120, 90 150 H180" />}
                      {n===3 && <path d="M105 85 C135 65,170 85,150 100 C170 115,135 135,105 115" />}
                      {n===4 && (
                        <g>
                          <path d="M160 60 L100 110 H170" />
                          <path d="M160 60 V150" />
                        </g>
                      )}
                      {n===5 && <path d="M170 70 H100 V110 Q130 90, 160 110 Q170 140, 120 150" />}
                      {n===6 && <path d="M160 80 Q100 80, 110 120 Q140 160, 170 130 Q150 110, 120 120" />}
                      {n===7 && <path d="M90 70 H170 L110 150" />}
                      {n===8 && (
                        <g>
                          <circle cx="120" cy="95" r="26" fill="none" />
                          <circle cx="120" cy="135" r="26" fill="none" />
                        </g>
                      )}
                      {n===9 && (
                        <g>
                          <circle cx="135" cy="100" r="28" fill="none" />
                          <path d="M162 120 Q150 150, 120 150" />
                        </g>
                      )}
                      {n===10 && (
                        <g>
                          <path d="M90 150 L90 80" />
                          <circle cx="140" cy="115" r="30" fill="none" />
                        </g>
                      )}
                    </g>
                    <circle cx="80" cy="70" r="6" fill="#ef4444" />
                    <text x="300" y="60" fontSize="28" fill="#111827">{n}</text>
                  </svg>
                );
              })}
            </div>
          </section>
        )}

        {doc === 'uppercase-lowercase-match' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Aa–Zz Upper/Lower Letter Match</h2>
            <p className="text-slate-600 text-sm mb-3">Draw lines from uppercase to lowercase. Say the sound for each match.</p>
            <div className="grid grid-cols-2 gap-4">
              {[['A','a'],['B','b'],['C','c'],['D','d'],['E','e'],['F','f'],['G','g'],['H','h'],['I','i'],['J','j'],['K','k'],['L','l'],['M','m']].map(([U,l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['N','n'],['O','o'],['P','p'],['Q','q'],['R','r'],['S','s'],['T','t'],['U','u'],['V','v'],['W','w'],['X','x'],['Y','y'],['Z','z']].map(([U,l]) => (
                <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                  <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                  <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                  <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                </svg>
              ))}
            </div>
          </section>
        )}

        {doc === 'beginning-sounds-az' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Beginning Sounds (A–Z)</h2>
            <p className="text-slate-600 text-sm mb-3">Circle pictures that begin with each letter. Say the sound out loud (e.g., A as in apple).</p>
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const rows: Array<[string,string,string,string]> = [
                  ['A','🍎','✈️','🦋'],
                  ['B','🐝','🚲','🍌'],
                  ['C','🐱','🚗','☕'],
                  ['D','🐶','🦆','🍩'],
                  ['E','🥚','🦅','👂'],
                  ['F','🐟','🦊','🏁'],
                  ['G','🦒','👓','🦎'],
                  ['H','🏠','🐹','🥅'],
                  ['I','🍦','🏝️','🧊'],
                  ['J','🤹','🧃','🕹️'],
                  ['K','🔑','🌋','🪁'],
                  ['L','🦁','🍋','🌿'],
                  ['M','🐭','🌙','🍄'],
                  ['N','🥜','巛','📓'],
                  ['O','🐙','🧅','🍊'],
                  ['P','🐼','🥧','🖊️'],
                  ['Q','👸','🧶','🧭'],
                  ['R','🐰','🚀','🌧️'],
                  ['S','🐍','⭐','🌞'],
                  ['T','🐯','🌮','🌳'],
                  ['U','☂️','🦄','⛽'],
                  ['V','🎻','🚐','🌋'],
                  ['W','🐳','🍉','🚶'],
                  ['X','🪓','📦','🧪'],
                  ['Y','🛶','🪀','🍠'],
                  ['Z','🦓','⚡','👟'],
                ]
                return rows.map(([L,a,b,c]) => (
                  <svg key={L} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                    <text x="40" y="60" fontSize="40" fill="#111827">{L}</text>
                    <text x="140" y="60" fontSize="36">{a}</text>
                    <text x="200" y="60" fontSize="36">{b}</text>
                    <text x="260" y="60" fontSize="36">{c}</text>
                    <rect x="130" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="190" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                    <rect x="250" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                  </svg>
                ))
              })()}
            </div>
          </section>
        )}

        {doc === 'addition-subtraction-0-10' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Addition & Subtraction 0–10</h2>
            <p className="text-slate-600 text-sm mb-3">Use the number line if needed. Write the answer in the box.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_,i)=> (
                <svg key={i} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <g fill="none" stroke="#94a3b8" strokeWidth="3">
                    <path d="M60 120 H340" />
                    {Array.from({ length: 11 }).map((__,k)=> (
                      <line key={k} x1={60 + k*28} y1={120} x2={60 + k*28} y2={110} />
                    ))}
                  </g>
                  <text x="60" y="60" fontSize="32" fill="#111827">__ {i%2===0?'+':'-'} __ = ____</text>
                </svg>
              ))}
            </div>
          </section>
        )}

        {doc === 'ten-frames-1-10' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Ten Frames 1–10</h2>
            <p className="text-slate-600 text-sm mb-3">Color the circles to match each number. Say how many are filled and how many are empty.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_,n)=> (
                <svg key={n} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="40" y="50" fontSize="36" fill="#111827">{n+1}</text>
                  <g transform="translate(120,60)">
                    {Array.from({ length: 10 }).map((__,i)=> (
                      <rect key={i} x={(i%5)*40} y={Math.floor(i/5)*40} width="36" height="36" fill="none" stroke="#111827" />
                    ))}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {doc === 'ten-frames-1-20' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Ten Frames 1–20</h2>
            <p className="text-slate-600 text-sm mb-3">Color the circles to match each number. Say how many are filled and how many are empty.</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 20 }).map((_,n)=> (
                <svg key={n} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <text x="40" y="50" fontSize="36" fill="#111827">{n+1}</text>
                  <g transform="translate(120,60)">
                    {Array.from({ length: 10 }).map((__,i)=> (
                      <rect key={i} x={(i%5)*40} y={Math.floor(i/5)*40} width="36" height="36" fill="none" stroke="#111827" />
                    ))}
                  </g>
                </svg>
              ))}
            </div>
          </section>
        )}

        {doc === 'shapes-colors-sort' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Shapes & Colors Sort (Cut & Glue)</h2>
            <p className="text-slate-600 text-sm mb-3">Cut out the shapes, then sort into the right color boxes. Practice scissor skills safely.</p>
            <div className="grid grid-cols-2 gap-4">
              <svg viewBox="0 0 400 300" className="w-full h-auto bg-white border border-slate-300 rounded">
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <rect x="40" y="40" width="120" height="80" />
                  <rect x="240" y="40" width="120" height="80" />
                  <rect x="140" y="160" width="120" height="80" />
                </g>
                <text x="70" y="95" fontSize="18" fill="#0ea5e9">BLUE</text>
                <text x="280" y="95" fontSize="18" fill="#ef4444">RED</text>
                <text x="175" y="215" fontSize="18" fill="#22c55e">GREEN</text>
              </svg>
              <svg viewBox="0 0 400 300" className="w-full h-auto bg-white border border-slate-300 rounded">
                <g fill="none" stroke="#111827" strokeWidth="3.5">
                  <circle cx="80" cy="60" r="20" />
                  <rect x="40" y="110" width="60" height="40" />
                  <polygon points="160,60 190,110 130,110" />
                  <circle cx="250" cy="60" r="20" />
                  <rect x="220" y="110" width="60" height="40" />
                  <polygon points="340,60 370,110 310,110" />
                </g>
              </svg>
            </div>
          </section>
        )}

        {doc === 'dot-to-dot-1-20' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">1–20 Dot‑to‑Dot</h2>
            <p className="text-slate-600 text-sm mb-3">Connect the dots in order to reveal the picture.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              {Array.from({ length: 20 }).map((_,i)=> (
                <g key={i}>
                  <circle cx={60 + i*35} cy={200 + (i%2===0? -30:30)} r="4" fill="#111827" />
                  <text x={60 + i*35 + 6} y={200 + (i%2===0? -30:30) - 6} fontSize="12">{i+1}</text>
                </g>
              ))}
            </svg>
          </section>
        )}

        {doc === 'tangram-animals' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Tangram Animals (Cutouts)</h2>
            <p className="text-slate-600 text-sm mb-3">Cut the shapes and arrange to make animal silhouettes. Glue the final shape on a clean sheet.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <polygon points="100,50 200,50 200,150 100,150" />
                <polygon points="220,50 270,100 220,150 170,100" />
                <polygon points="300,50 350,50 350,150 300,150" />
                <polygon points="380,50 430,100 380,150 330,100" />
                <polygon points="460,50 560,50 560,150 460,150" />
              </g>
            </svg>
          </section>
        )}

        {doc === 'spot-difference' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Spot‑the‑Difference (7)</h2>
            <p className="text-slate-600 text-sm mb-3">Find 7 differences between the two pictures.</p>
            <div className="grid grid-cols-2 gap-4">
              <HiddenObjectsSceneSVGA />
              <HiddenObjectsSceneSVGB />
            </div>
          </section>
        )}

        {doc === 'directed-drawing-animals' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Directed Drawing: Animals</h2>
            <p className="text-slate-600 text-sm mb-3">Follow each step to draw. Start with simple shapes, then add details.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <circle cx="100" cy="100" r="30" />
                <rect x="80" y="130" width="40" height="30" />
                <text x="90" y="190" fontSize="14">1</text>
                <circle cx="250" cy="100" r="30" />
                <rect x="230" y="130" width="40" height="30" />
                <circle cx="270" cy="80" r="10" />
                <text x="240" y="190" fontSize="14">2</text>
                <circle cx="400" cy="100" r="30" />
                <rect x="380" y="130" width="40" height="30" />
                <circle cx="420" cy="80" r="10" />
                <line x1="400" y1="130" x2="430" y2="160" />
                <text x="390" y="190" fontSize="14">3</text>
              </g>
            </svg>
          </section>
        )}

        {doc === 'cut-and-paste-crafts' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Cut‑and‑Paste Paper Crafts</h2>
            <p className="text-slate-600 text-sm mb-3">Cut the parts and glue them in place. Color when finished.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="80" y="60" width="80" height="80" />
                <circle cx="220" cy="100" r="40" />
                <polygon points="320,60 380,140 260,140" />
                <rect x="420" y="60" width="80" height="80" />
                <rect x="510" y="70" width="30" height="60" />
                <rect x="550" y="70" width="30" height="60" />
              </g>
            </svg>
          </section>
        )}

        {doc === 'feelings-checkin' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Feelings Check‑In Meter</h2>
            <p className="text-slate-600 text-sm mb-3">Point to or color how you feel today.</p>
            <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
              <defs>
                <linearGradient id="mood" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="100" y="120" width="600" height="40" fill="url(#mood)" rx="8" />
              <circle cx="400" cy="140" r="56" fill="none" stroke="#111827" strokeWidth="4" />
              <text x="90" y="190" fontSize="16">Calm</text>
              <text x="380" y="190" fontSize="16">Okay</text>
              <text x="680" y="190" fontSize="16">Upset</text>
            </svg>
          </section>
        )}

        {doc === 'reward-chart' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Weekly Reward / Sticker Chart</h2>
            <p className="text-slate-600 text-sm mb-3">Add a sticker or color a star each time you complete a task.</p>
            <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
              <g fill="none" stroke="#111827" strokeWidth="3.5">
                <rect x="100" y="80" width="600" height="220" />
                {Array.from({ length: 5 }).map((_,r)=> (
                  <line key={r} x1="100" y1={80 + (r+1)*44} x2="700" y2={80 + (r+1)*44} />
                ))}
                {Array.from({ length: 6 }).map((_,c)=> (
                  <line key={c} x1={100 + (c+1)*100} y1="80" x2={100 + (c+1)*100} y2="300" />
                ))}
              </g>
              <text x="120" y="70" fontSize="16">Mon</text>
              <text x="220" y="70" fontSize="16">Tue</text>
              <text x="320" y="70" fontSize="16">Wed</text>
              <text x="420" y="70" fontSize="16">Thu</text>
              <text x="520" y="70" fontSize="16">Fri</text>
              <text x="620" y="70" fontSize="16">Sat</text>
              <text x="690" y="70" fontSize="16">Sun</text>
            </svg>
          </section>
        )}

        {doc === 'reading-mini-1' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">Mini Reading Passage + 3 Questions</h2>
            <p className="text-slate-600 text-sm mb-3">Read the short passage, then answer the questions in full sentences.</p>
            <div className="bg-white border border-slate-300 rounded p-4">
              <p className="text-slate-800 text-base">Sara planted a tiny seed in a cup by the window. Every day, she gave it a little water and turned the cup toward the sun. One morning, she saw a green sprout peek out of the soil. Sara smiled. “Hello, little plant,” she whispered.</p>
              <ol className="list-decimal list-inside mt-3 text-slate-800 text-base space-y-1">
                <li>Where did Sara put the cup?</li>
                <li>What did she give the seed every day?</li>
                <li>What did Sara see in the soil?</li>
              </ol>
            </div>
          </section>
        )}
        {doc === 'pack' && (() => {
          // Build dynamic pack content by time/age/skill
          const timeInt = parseInt(packTime || '5', 10);
          const itemCount = timeInt <= 5 ? 3 : (timeInt <= 10 ? 4 : 5);
          const isK2 = packAge === 'k2';
          const is35 = packAge === '35';
          const wsSize = 8;
          const seedStr = `${effectiveSeed}|v${variant}|t${packTime}|a${packAge}|s${packSkill}`;
          const rng = makeRng(seedStr);
          const theme = packSkill === 'reading' ? 'sight' : (packSkill === 'stem' ? 'space' : pick(['animals', 'space', 'sight'], rng));
          const wordsFull = buildWords(theme, packAge);
          const words = pickNUnique(wordsFull, 8, rng);
          const grid = buildGridLetters(words.slice(0, 8), wsSize, seedStr);
          // Choose a different maze path based on age and seed for variety
          let mazePath = '';
          if (isK2) {
            mazePath = pick([
              'M10 20h80v20H30v20h60v20H40v20h50',
              'M10 20h70v20H30v20h50v20H20v20h70'
            ], rng);
          } else if (is35) {
            mazePath = pick([
              'M10 20h90v15H20v15h80v15H30v15h70v15H40v15h60',
              'M10 20h80v15H30v15h70v15H20v15h80v15H30v15h70'
            ], rng);
          } else {
            mazePath = pick([
              'M10 15h90v10H20v10h80v10H30v10h70v10H40v10h60v10H50v10h50',
              'M10 15h70v10H30v10h80v10H40v10h70v10H50v10h60v10H60v10h40'
            ], rng);
          }
          const drawingPrompt = packSkill === 'creativity'
            ? 'Invent a gadget for school. Label 3 parts.'
            : isK2
              ? 'Draw a creature from a circle, triangle, and rectangle.'
              : 'Draw your favorite animal and write one fact.';

          const items: React.ReactNode[] = [];
          // Helpers for extra activities
          function scrambleWordLocal(w: string) {
            const a = w.split('');
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(rng() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a.join('');
          }
          function buildMiniMathProblems(n: number) {
            const out: string[] = [];
            for (let i = 0; i < n; i++) {
              const a = Math.floor(rng() * (isK2 ? 9 : 12)) + 1;
              const b = Math.floor(rng() * (isK2 ? 9 : 12)) + 1;
              const useAdd = isK2 ? true : rng() < 0.6;
              if (useAdd) out.push(`${a} + ${b} = ____`);
              else out.push(`${Math.max(a,b)} - ${Math.min(a,b)} = ____`);
            }
            return out;
          }
          function buildMiniSudoku() {
            const base = [
              [1,2,3,4],
              [3,4,1,2],
              [2,1,4,3],
              [4,3,2,1],
            ];
            const removals = 6 + Math.floor(rng()*3);
            const grid: number[][] = base.map(r=>r.slice());
            let removed = 0;
            while (removed < removals) {
              const r = Math.floor(rng()*4);
              const c = Math.floor(rng()*4);
              if (grid[r][c] !== 0) { grid[r][c] = 0; removed++; }
            }
            return grid;
          }
          // 1) Word Search or Reading prompt
          if (packSkill !== 'creativity') {
            items.push(
              <div key="ws" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-3">Mini Word Search — {theme === 'sight' ? 'Sight Words' : theme === 'space' ? 'Space' : 'Animals'}</div>
                <div className={`grid grid-cols-8 gap-2 font-mono text-lg`}>
                  {grid.map((c,i)=> (
                    <div key={i} className="w-10 h-10 border border-slate-300 rounded-sm flex items-center justify-center">{c}</div>
                  ))}
                </div>
                <div className="mt-3 text-lg text-slate-700">Find: {words.join(', ')}</div>
              </div>
            );
          }
          // 2) Quick Maze or STEM mini-task
          if (packSkill === 'stem') {
            items.push(
              <div key="stem" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-lg mb-2">STEM Mini‑Task</div>
                <div className="text-base text-slate-700">Balance a ruler on your finger. Slide a coin along the ruler — what happens? Write one observation.</div>
                <div className="mt-3 h-24 border border-dashed border-slate-300 rounded-md" />
              </div>
            );
          } else {
            // Build a unique grid maze using a seeded DFS (recursive backtracker)
            const mazeCols = isK2 ? 8 : (is35 ? 10 : 12);
            const mazeRows = isK2 ? 8 : (is35 ? 10 : 12);
            const total = mazeCols * mazeRows;
            const cells = Array.from({ length: total }, () => ({ t: true, r: true, b: true, l: true })) as { t: boolean; r: boolean; b: boolean; l: boolean }[];
            const visited = new Array(total).fill(false) as boolean[];
            const indexOf = (x: number, y: number) => y * mazeCols + x;
            const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < mazeCols && y < mazeRows;
            const stack: number[] = [0];
            visited[0] = true;
            while (stack.length) {
              const cur = stack[stack.length - 1];
              const cx = cur % mazeCols;
              const cy = Math.floor(cur / mazeCols);
              const neigh: Array<{ i: number; dir: 't' | 'r' | 'b' | 'l' }> = [];
              if (inBounds(cx, cy - 1) && !visited[indexOf(cx, cy - 1)]) neigh.push({ i: indexOf(cx, cy - 1), dir: 't' });
              if (inBounds(cx + 1, cy) && !visited[indexOf(cx + 1, cy)]) neigh.push({ i: indexOf(cx + 1, cy), dir: 'r' });
              if (inBounds(cx, cy + 1) && !visited[indexOf(cx, cy + 1)]) neigh.push({ i: indexOf(cx, cy + 1), dir: 'b' });
              if (inBounds(cx - 1, cy) && !visited[indexOf(cx - 1, cy)]) neigh.push({ i: indexOf(cx - 1, cy), dir: 'l' });
              if (neigh.length === 0) { stack.pop(); continue; }
              // pick neighbor deterministically
              const pickIdx = Math.floor(rng() * neigh.length);
              const next = neigh[pickIdx];
              // carve passage
              if (next.dir === 't') { cells[cur].t = false; cells[next.i].b = false; }
              if (next.dir === 'r') { cells[cur].r = false; cells[next.i].l = false; }
              if (next.dir === 'b') { cells[cur].b = false; cells[next.i].t = false; }
              if (next.dir === 'l') { cells[cur].l = false; cells[next.i].r = false; }
              visited[next.i] = true;
              stack.push(next.i);
            }

            // Convert walls to SVG lines
            const cellSize = 12;
            const pad = 6;
            const svgW = mazeCols * cellSize + pad * 2;
            const svgH = mazeRows * cellSize + pad * 2;
            const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
            for (let y = 0; y < mazeRows; y++) {
              for (let x = 0; x < mazeCols; x++) {
                const i = indexOf(x, y);
                const w = cells[i];
                const x0 = pad + x * cellSize;
                const y0 = pad + y * cellSize;
                const x1 = x0 + cellSize;
                const y1 = y0 + cellSize;
                if (w.t) lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
                if (w.l) lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
                if (w.b) lines.push({ x1: x0, y1: y1, x2: x1, y2: y1 });
                if (w.r) lines.push({ x1: x1, y1: y0, x2: x1, y2: y1 });
              }
            }

            items.push(
              <div key="maze" className="border border-slate-200 rounded-lg p-5 sm:col-span-2">
                <div className="font-semibold text-2xl mb-3">Quick Maze</div>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-96" preserveAspectRatio="xMinYMin meet">
                  <rect x={2} y={2} width={svgW - 4} height={svgH - 4} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
                  {lines.map((l, idx) => (
                    <line key={idx} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
                  ))}
                  <text x={pad + 2} y={pad + 14} fontSize={10} fill="#10B981" textAnchor="start">START</text>
                  <text x={svgW - (pad + 2)} y={svgH - (pad + 2)} fontSize={10} fill="#EC4899" textAnchor="end">FINISH</text>
                </svg>
              </div>
            );
          }
          // Build an extras pool; prioritize by focus
          const extras: React.ReactNode[] = [];
          const pushColoring = () => {
            const letter = (words[Math.floor(rng()*words.length)] || 'A').slice(0, 1).toUpperCase();
            const isSpace = theme === 'space';
            const isSight = theme === 'sight';
            const isAnimals = theme === 'animals';
            // Seeded extras for variety
            const stars = Array.from({ length: 18 }, () => ({ x: Math.floor(rng() * 760) + 20, y: Math.floor(rng() * 520) + 40 }));
            const planet = { cx: 140 + Math.floor(rng()*160), cy: 120 + Math.floor(rng()*160), r: 32 + Math.floor(rng()*24) };
            const animalTypes = ['Fish','Turtle','Butterfly','Bird','Dino'] as const;
            const animalPick = animalTypes[Math.floor(rng()*animalTypes.length)];
            extras.push(
              <div key="coloring-sheet" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
                <div className="font-semibold text-xl mb-2">Coloring Sheet — {isSpace ? 'Rocket' : isSight ? `Letter ${letter}` : animalPick}</div>
                <svg viewBox="0 0 800 600" className="w-full h-[28rem] sm:h-[32rem] print:h-[36rem]" fill="none" stroke="#334155" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="coloring-title">
                  <title id="coloring-title">Big coloring illustration</title>
                  {isSpace && (
                    <g>
                      {/* Rocket body */}
                      <path d="M400 100 Q420 60 440 100 L440 360 Q420 400 400 360 Z"/>
                      {/* Window */}
                      <circle cx="420" cy="200" r="24" />
                      {/* Fins */}
                      <path d="M440 300 L500 340 L440 340 Z"/>
                      <path d="M400 300 L340 340 L400 340 Z"/>
                      {/* Flame */}
                      <path d="M400 360 Q420 420 440 360"/>
                      {/* Planet and ring */}
                      <circle cx={planet.cx} cy={planet.cy} r={planet.r} />
                      <ellipse cx={planet.cx} cy={planet.cy} rx={planet.r + 24} ry={planet.r / 2 + 8} />
                      {/* Stars */}
                      {stars.slice(0,12).map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={6 + (i%3)} />))}
                    </g>
                  )}
                  {isAnimals && (
                    <g>
                      {animalPick === 'Fish' && (
                        <g>
                          <ellipse cx="420" cy="280" rx={140 + Math.floor(rng()*20)} ry={80 + Math.floor(rng()*20)}/>
                          <polygon points={`540,280 ${580 + Math.floor(rng()*60)},${240 + Math.floor(rng()*40)} ${580 + Math.floor(rng()*60)},${320 - Math.floor(rng()*40)}`}/>
                          <circle cx={350 + Math.floor(rng()*30)} cy={250 + Math.floor(rng()*30)} r="10" />
                          <path d={`M${320 + Math.floor(rng()*10)} 280 Q${360 + Math.floor(rng()*10)} ${300 + Math.floor(rng()*10)} ${400 + Math.floor(rng()*10)} 280`}/>
                          <path d={`M${320 + Math.floor(rng()*10)} 240 Q${360 + Math.floor(rng()*10)} ${260 + Math.floor(rng()*10)} ${400 + Math.floor(rng()*10)} 240`}/>
                          {stars.slice(0,6).map((s, i) => (<circle key={i} cx={280 + i*20} cy={160 + i*22} r={8} />))}
                        </g>
                      )}
                      {animalPick === 'Turtle' && (
                        <g>
                          <circle cx="420" cy="300" r={100 + Math.floor(rng()*20)} />
                          <circle cx="340" cy="300" r="22" />
                          <ellipse cx="380" cy="360" rx="28" ry="16"/>
                          <ellipse cx="460" cy="360" rx="28" ry="16"/>
                          <ellipse cx="380" cy="240" rx="28" ry="16"/>
                          <ellipse cx="460" cy="240" rx="28" ry="16"/>
                          <path d="M360 300 H480"/>
                          <path d="M420 240 V360"/>
                          <path d="M380 260 L460 340"/>
                          <path d="M460 260 L380 340"/>
                        </g>
                      )}
                      {animalPick === 'Butterfly' && (
                        <g>
                          <line x1="420" y1="220" x2="420" y2="360"/>
                          <path d="M420 260 Q360 220 300 260 Q360 300 420 280"/>
                          <path d="M420 260 Q480 220 540 260 Q480 300 420 280"/>
                          <path d="M420 300 Q360 340 300 320 Q360 300 420 320"/>
                          <path d="M420 300 Q480 340 540 320 Q480 300 420 320"/>
                          <circle cx="340" cy="260" r="10"/>
                          <circle cx="500" cy="260" r="10"/>
                        </g>
                      )}
                      {animalPick === 'Bird' && (
                        <g>
                          <ellipse cx="420" cy="300" rx="120" ry="70"/>
                          <polygon points="520,300 560,280 560,320"/>
                          <circle cx="360" cy="280" r="8" />
                          <path d="M420 290 Q380 320 340 310"/>
                          <line x1="400" y1="360" x2="390" y2="390"/>
                          <line x1="440" y1="360" x2="450" y2="390"/>
                        </g>
                      )}
                      {animalPick === 'Dino' && (
                        <g>
                          <ellipse cx="420" cy="340" rx="140" ry="60"/>
                          <path d="M360 240 Q380 200 420 220 Q460 240 460 280"/>
                          <circle cx="380" cy="220" r="8" />
                          <path d="M500 340 Q560 320 580 300"/>
                        </g>
                      )}
                    </g>
                  )}
                  {isSight && (
                    <g>
                      {/* Giant letter outline */}
                      <text x="260" y="360" fontSize="280" stroke="#334155" fill="none">{letter}</text>
                      {/* Book */}
                      <rect x="520" y="220" width="160" height="120" rx="8"/>
                      <line x1="600" y1="220" x2="600" y2="340"/>
                      <path d="M520 240 Q560 260 600 240"/>
                      <path d="M600 240 Q640 260 680 240"/>
                    </g>
                  )}
                </svg>
              </div>
            );
          };
          const pushDrawing = () => extras.push(
            <div key="draw" className="border border-slate-200 rounded-lg p-4 sm:col-span-2">
              <div className="font-semibold text-xl mb-2">Drawing Prompt</div>
              <div className="text-lg text-slate-700">{drawingPrompt}</div>
              <div className="mt-3 h-72 border border-dashed border-slate-300 rounded-md" />
            </div>
          );
          const pushMiniMath = () => extras.push(
            <div key="mini-math" className="border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-xl mb-2">Mini Math — Quick Sums</div>
              <div className="grid sm:grid-cols-2 gap-2 text-lg text-slate-800">
                {buildMiniMathProblems(8).map((p, i)=> (
                  <div key={i} className="flex items-center justify-between">
                    <span>{p}</span>
                    <span className="ml-3 flex-1 border-b border-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          );
          const pushScramble = () => {
            const scrambleWords = words.slice(0, Math.min(5, words.length));
            extras.push(
              <div key="scramble" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Word Scramble</div>
                <div className="space-y-2 text-lg text-slate-800">
                  {scrambleWords.map((w,i)=> (
                    <div key={i} className="flex items-center justify-between">
                      <span>Unscramble: {scrambleWordLocal(w)}</span>
                      <span className="ml-3 flex-1 border-b border-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            );
          };
          const pushReading = () => {
            const readingSnippets = [
              'A fox saw the moon in the pond. It tried to catch it, but the water rippled and the moon danced away.',
              'Sara planted a tiny seed. Every day she gave it water and a song. One morning, a green leaf waved hello.'
            ];
            const reading = readingSnippets[Math.floor(rng()*readingSnippets.length)];
            extras.push(
              <div key="reading" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Mini Reading</div>
                <p className="text-lg text-slate-800 mb-3">{reading}</p>
                <ol className="list-decimal list-inside space-y-1 text-lg text-slate-800">
                  <li>Circle the main character.</li>
                  <li>Underline one action word.</li>
                </ol>
              </div>
            );
          };
          const pushMiniSudoku = () => {
            const miniS = buildMiniSudoku();
            extras.push(
              <div key="mini-sudoku" className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-xl mb-2">Mini Sudoku — 4×4</div>
                <div className="inline-grid grid-cols-4 gap-[3px] text-lg font-mono">
                  {miniS.flat().map((v, i)=> (
                    <div key={i} className="w-12 h-12 border border-slate-300 rounded-sm flex items-center justify-center bg-white">
                      {v === 0 ? '' : v}
                    </div>
                  ))}
                </div>
              </div>
            );
          };

          if (packSkill === 'creativity') {
            pushColoring();
            pushDrawing();
            pushScramble();
            pushMiniMath();
            pushMiniSudoku();
            pushReading();
          } else if (packSkill === 'reading') {
            pushColoring();
            pushReading();
            pushScramble();
            pushMiniMath();
            pushMiniSudoku();
            pushDrawing();
          } else if (packSkill === 'stem') {
            pushColoring();
            pushMiniMath();
            pushMiniSudoku();
            pushScramble();
            pushReading();
            pushDrawing();
          } else {
            // mixed/focus
            pushColoring();
            pushMiniMath();
            pushScramble();
            pushReading();
            pushMiniSudoku();
            pushDrawing();
          }

          // Fill remaining slots from extras
          for (const extra of extras) {
            if (items.length >= itemCount) break;
            items.push(extra);
          }

          const buildLink = (nextVariant?: number, nextSeed?: string) => {
            const sp = new URLSearchParams({
              doc: 'pack',
              time: packTime,
              age: packAge,
              skill: packSkill,
              seed: nextSeed || effectiveSeed,
              variant: String(nextVariant ?? variant)
            })
            return `/print?${sp.toString()}`
          }

          const shareUrl = (typeof window !== 'undefined') ? `${window.location.origin}${buildLink()}` : buildLink()
          async function copyShare() {
            try {
              await navigator.clipboard.writeText(shareUrl)
              setCopiedLink(true)
              setTimeout(()=> setCopiedLink(false), 1500)
            } catch {}
          }

          const nextVariantUrl = buildLink(variant + 1)
          const todayUrl = buildLink(1, todaySeed)

          return (
            <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-5 print:border-0 print:p-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{docTitle}</h2>
                  <div className="text-slate-700 text-xl">Time: {packTime} min • Age: {friendlyAge(packAge)} • Focus: {friendlyFocus(packSkill)}</div>
                  <div className="text-slate-700 text-sm">Seed: {effectiveSeed} • Variant: {variant}</div>
                </div>
                <div className="print:hidden flex items-center gap-2">
                  <a href={todayUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">Today’s Pack</a>
                  <a href={nextVariantUrl} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">New Pack</a>
                  <button onClick={copyShare} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{copiedLink ? 'Link Copied!' : 'Copy Link'}</button>
                </div>
              </div>
              <div className="text-slate-700 text-xl mt-3 mb-3">Quick wins you can finish today. Check off as you go!</div>
              <div className="grid sm:grid-cols-2 gap-6">
                {items.slice(0, itemCount)}
              </div>
            </section>
          );
        })()}
        {doc === 'stem-balloon-rocket' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🚀 Balloon Rocket (STEM)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 10 minutes • Ages: 7–10</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Balloon</li>
                  <li>2–3 m string</li>
                  <li>Plastic straw</li>
                  <li>Clear tape</li>
                  <li>Two chairs (to tie the string)</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Thread the string through the straw.</li>
                  <li>Tie the string tightly between two chairs.</li>
                  <li>Tape the balloon to the straw (opening facing backward).</li>
                  <li>Inflate (don’t knot), hold, then release.</li>
                  <li>Measure distance and try again.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Air pushes backward; the rocket moves forward (action/reaction).
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Test balloon sizes, angles, or add a small paper “cargo”.
              </div>
            </div>
          </section>
        )}

        {doc === 'stem-walking-water' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🌈 Walking Water (STEM)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 15–20 minutes • Ages: 6–10</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>3 clear cups</li>
                  <li>Water</li>
                  <li>Paper towels</li>
                  <li>Red + blue food coloring</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Fill the outer cups with colored water; leave the middle empty.</li>
                  <li>Fold paper towels into two “bridges”.</li>
                  <li>Place bridges into the cups.</li>
                  <li>Watch colors “walk” into the middle cup.</li>
                  <li>Record what changed.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Water climbs paper fibers (capillary action) and mixes colors.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Try different towel brands, longer gaps, or other color pairs.
              </div>
            </div>
          </section>
        )}

        {doc === 'arts-3-shape-creature' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-2xl font-bold text-slate-900">🎨 Draw From 3 Shapes (Arts)</h2>
            <p className="text-slate-700 text-base mb-4">Time: 10–15 minutes • Ages: 6–12</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-800 mb-2">Materials</div>
                <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
                  <li>Paper</li>
                  <li>Pencil or markers</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-2">Steps</div>
                <ol className="list-decimal list-inside text-base text-slate-700 space-y-1.5">
                  <li>Draw a big circle, triangle, and rectangle anywhere.</li>
                  <li>Turn one shape into a face (eyes/mouth).</li>
                  <li>Connect shapes into one creature.</li>
                  <li>Add patterns and a background.</li>
                  <li>Name your creature and write a 1‑line story.</li>
                </ol>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-base">
                <div className="font-semibold mb-2">Learn</div>
                Play with shape language and composition using simple constraints.
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 text-base">
                <div className="font-semibold mb-2">Try next</div>
                Mirror (symmetry) version, only curved lines, or only straight lines.
              </div>
            </div>
          </section>
        )}
      {/* (Removed legacy one-pager duplicates) */}
        {doc === 'math-maze' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">➕ Math Maze Adventure</h2>
            <p className="text-slate-600 text-sm mb-3">Start at S and reach F. Move up/down/left/right only onto tiles whose equation equals the target shown in that row. Circle your path!</p>
            <div className="flex items-start gap-4">
              <div className="inline-grid grid-cols-7 gap-[2px] text-sm font-mono">
                {mathMazeCells.map((t,i)=> (
                  <div key={i} className="w-10 h-10 border border-slate-300 rounded-sm flex items-center justify-center bg-white">{t}</div>
                ))}
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-semibold mb-1">How to play</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Choose a target number per row (e.g., row 1 = 6).</li>
                  <li>Step only on equations that equal that row’s target.</li>
                  <li>Draw your path from S to F without diagonal moves.</li>
                </ol>
                {showAnswers && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                    <div className="font-semibold mb-1">Example target plan</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Row 1 target: 6 → valid tiles: 4+2, 8-2…</li>
                      <li>Row 2 target: 8 → valid tiles: 6+2, 9-1…</li>
                      <li>Row 3 target: 10 → valid tiles: 7+3, 12-2…</li>
                    </ul>
                    <div className="text-xs mt-1">Tip: Any path obeying row targets is correct; teacher can pick targets.</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {doc === 'spelling' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">✏️ Spelling Challenge Worksheet</h2>
            <p className="text-slate-600 text-sm mb-3">Circle the correctly spelled word in each group. Then write it neatly on the line.</p>
            {[
              ['elefant','elephant','elephent'],
              ['becaus','because','becuase'],
              ['skool','school','scool'],
              ['butterflie','butterfly','buterfly'],
              ['tommorow','tomorrow','tommorrow']
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 mb-2">
                <div className="text-sm font-mono">{i+1}.) {row.join('   ')}</div>
                <div className="flex-1 border-b border-slate-300 ml-3" />
              </div>
            ))}
            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>1) elephant</li>
                  <li>2) because</li>
                  <li>3) school</li>
                  <li>4) butterfly</li>
                  <li>5) tomorrow</li>
                </ol>
              </div>
            )}
          </section>
        )}

        {doc === 'science-match' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔬 Science Fun Facts Match</h2>
            <p className="text-slate-600 text-sm mb-3">Draw a line to match each fact with its pair.</p>
            <div className="grid grid-cols-2 gap-6">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Mars is known as the red planet.</li>
                <li>Whales are the largest mammals.</li>
                <li>Lightning is a giant spark of electricity.</li>
                <li>Penguins live in the Southern Hemisphere.</li>
                <li>Clouds are made of tiny water droplets.</li>
                <li>Earth orbits the Sun once a year.</li>
              </ol>
              <ul className="list-none space-y-1 text-sm">
                <li>A) Weather water in the sky</li>
                <li>B) A cold‑loving bird</li>
                <li>C) The blue planet’s path</li>
                <li>D) A huge ocean animal</li>
                <li>E) A dusty red world</li>
                <li>F) Shocking sky energy</li>
              </ul>
            </div>
            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>1 → E (red planet → dusty red world)</li>
                  <li>2 → D (largest mammals → huge ocean animal)</li>
                  <li>3 → F (spark of electricity → shocking sky energy)</li>
                  <li>4 → B (lives in the south → cold‑loving bird)</li>
                  <li>5 → A (made of water droplets → weather water in the sky)</li>
                  <li>6 → C (orbits the Sun → the blue planet’s path)</li>
                </ol>
              </div>
            )}
          </section>
        )}

        {doc === 'grammar-detective' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🕵️‍♀️ Grammar Detective</h2>
            <p className="text-slate-600 text-sm mb-3">Find and fix the mistake in each sentence. Rewrite it correctly on the line.</p>
            {[
              'we goes to the park every saturday.',
              'The cats is sleeping under the table.',
              'i can run faster then my friend.',
              'There is two pencils on the desk.',
              'She dont like broccoli.'
            ].map((s, i) => (
              <div key={i} className="mb-3">
                <div className="text-sm">{i+1}.) {s}</div>
                <div className="border-b border-slate-300 mt-2" />
              </div>
            ))}
            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer key</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>We go to the park every Saturday.</li>
                  <li>The cats are sleeping under the table.</li>
                  <li>I can run faster than my friend.</li>
                  <li>There are two pencils on the desk.</li>
                  <li>She doesn't like broccoli.</li>
                </ol>
              </div>
            )}
          </section>
        )}

        {doc === 'color-by-number' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🖍️ Color‑by‑Number</h2>
            <p className="text-slate-600 text-sm mb-3">Use the legend to color the grid. Reveal the hidden scene!</p>
            <div className="flex items-start gap-6">
              <div className="inline-grid grid-cols-16 gap-[2px] text-[10px] font-mono">
                {Array.from({length: 16*16}).map((_,i)=> (
                  <div key={i} className="w-5 h-5 border border-slate-300 rounded-[2px] flex items-center justify-center bg-white">
                    {(i*7 + i%5)%4 + 1}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-700">
                <div className="font-semibold mb-1">Legend</div>
                <ul className="space-y-1">
                  <li>1 = Yellow</li>
                  <li>2 = Blue</li>
                  <li>3 = Green</li>
                  <li>4 = Red</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {doc === 'bookmark-templates' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">📚 DIY Bookmark Templates</h2>
            <p className="text-slate-600 text-sm mb-3">Cut along the dotted lines. Decorate with doodles and colors. Add your name on the back!</p>
            <div className="grid grid-cols-3 gap-4">
              {['Be Kind','Keep Reading','Dream Big'].map((t,i)=> (
                <div key={i} className="relative h-64 border border-slate-400 rounded bg-white">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-300 m-2 rounded" />
                  <div className="flex items-center justify-center h-full text-slate-700 font-semibold">{t}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {doc === 'design-monster' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">👾 Design Your Monster</h2>
            <p className="text-slate-600 text-sm mb-3">Draw inside the box and give your monster a name. Check the features you used.</p>
            <div className="h-64 border border-slate-400 rounded bg-white mb-3" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-semibold text-slate-800 mb-1">Features</div>
                <div className="grid grid-cols-2 gap-1 text-slate-700">
                  {['Horns','Spots','Stripes','Furry','Scales','One eye','Three eyes','Big teeth'].map((f)=> (
                    <label key={f} className="inline-flex items-center gap-2"><span className="w-3 h-3 border border-slate-400 inline-block"/> {f}</label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-1">Monster Name</div>
                <div className="border-b border-slate-400 h-6" />
              </div>
            </div>
          </section>
        )}

        {doc === 'draw-half' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">✏️ Draw the Missing Half</h2>
            <p className="text-slate-600 text-sm mb-3">Copy the right side to complete each picture. Use the grid as a guide.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <svg viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                  <clipPath id="half1"><rect x="0" y="0" width="110" height="220" /></clipPath>
                </defs>
                <rect x="0" y="0" width="220" height="220" fill="url(#g1)" />
                <g clipPath="url(#half1)">
                  <path d="M40 110 C70 40, 150 40, 180 110 C150 180, 70 180, 40 110 Z" fill="none" stroke="#111827" strokeWidth="3" />
                </g>
                <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
              <svg viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                  <clipPath id="half2"><rect x="0" y="0" width="110" height="220" /></clipPath>
                </defs>
                <rect x="0" y="0" width="220" height="220" fill="url(#g2)" />
                <g clipPath="url(#half2)">
                  <path d="M70 180 L110 40 L150 180 Z" fill="none" stroke="#111827" strokeWidth="3" />
                </g>
                <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
              {/* Four more prompts */}
              {[
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Heart */}
                      <path d="M110 90 C90 50, 40 60, 40 95 C40 130, 110 160, 110 180" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* House */}
                      <path d="M60 120 L110 80 L160 120" fill="none" stroke="#111827" strokeWidth="3" />
                      <rect x="70" y="120" width="80" height="60" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Rocket */}
                      <path d="M110 70 L130 120 L110 170 L90 120 Z" fill="none" stroke="#111827" strokeWidth="3" />
                      <circle cx="110" cy="120" r="10" fill="none" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
                (id: string) => (
                  <svg key={id} viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300">
                    <defs>
                      <pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                      </pattern>
                      <clipPath id={`${id}-half`}><rect x="0" y="0" width="110" height="220" /></clipPath>
                    </defs>
                    <rect x="0" y="0" width="220" height="220" fill={`url(#${id}-g)`} />
                    <g clipPath={`url(#${id}-half)`}>
                      {/* Butterfly */}
                      <path d="M110 110 Q90 80 70 100 Q90 120 110 110" fill="none" stroke="#111827" strokeWidth="3" />
                      <path d="M110 130 Q90 160 70 140 Q90 120 110 130" fill="none" stroke="#111827" strokeWidth="3" />
                      <line x1="110" y1="80" x2="110" y2="150" stroke="#111827" strokeWidth="3" />
                    </g>
                    <line x1="110" y1="0" x2="110" y2="220" stroke="#9ca3af" strokeDasharray="4 4" />
                  </svg>
                ),
              ].map((fn, i) => fn(`dh-${i}`))}
            </div>
          </section>
        )}

        {doc === 'logic-grid' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧩 Logic Grid Puzzle</h2>
            <p className="text-slate-600 text-sm mb-3">Mark ✓ for matches and ✗ for no match. Use the clues to solve.</p>
            <div className="overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-400 px-2 py-1 text-sm bg-slate-50"></th>
                    {['Cat','Dog','Fish'].map((h)=> (
                      <th key={h} className="border border-slate-400 px-2 py-1 text-sm bg-slate-50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Liam','Ava','Noah'].map((n)=> (
                    <tr key={n}>
                      <td className="border border-slate-400 px-2 py-1 text-sm bg-slate-50">{n}</td>
                      {Array.from({length:3}).map((_,i)=> (
                        <td key={i} className="border border-slate-400 w-10 h-10"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-slate-700">
              <div className="font-semibold">Clues</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Liam does not own the dog.</li>
                <li>Ava’s pet swims.</li>
                <li>Noah’s pet barks.</li>
              </ol>
            </div>
            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">Answer (unique)</div>
                <ul className="list-disc list-inside">
                  <li>Ava → Fish</li>
                  <li>Noah → Dog</li>
                  <li>Liam → Cat</li>
                </ul>
              </div>
            )}
          </section>
        )}

        {doc === 'hidden-object' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Find the Hidden Object</h2>
            <p className="text-slate-600 text-sm mb-3">Find and circle each item hidden in the scene below.</p>
            <div className="mb-3">
              <HiddenObjectsSceneSVGA />
            </div>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {['Key','Apple','Star','Leaf','Car','Book','Shell','Cloud','Ball','Hat'].map((x)=> (<li key={x}>☐ {x}</li>))}
            </ul>
          </section>
        )}

        {doc === 'maze-focus' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌀 Maze of Focus</h2>
            <p className="text-slate-600 text-sm mb-3">Follow the steps from START to FINISH. Skip distractions!</p>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {['START','Deep breath','Phone buzz (skip)','One step','Snack break','Water sip','Chit‑chat (skip)','Stretch','Refocus','Tiny goal','Timer 10 min','FINISH','⭐ Great job!'].map((t,i)=> (
                <div key={i} className={`h-12 border rounded flex items-center justify-center ${/skip/i.test(t)?'bg-slate-50 text-slate-400':'bg-white'}`}>{t}</div>
              ))}
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Progress checklist</div>
                <ul className="space-y-1 text-slate-700">
                  <li>☐ Started my timer</li>
                  <li>☐ Skipped one distraction</li>
                  <li>☐ Reached my tiny goal</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Set your timer</div>
                <div className="h-6 border-b border-slate-400" />
                <div className="mt-3 font-semibold text-slate-800 mb-1">Reward</div>
                <div className="h-6 border-b border-slate-400" />
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                <div className="font-semibold text-slate-800 mb-2">Notes</div>
                <div className="h-6 border-b border-slate-300 mb-1" />
                <div className="h-6 border-b border-slate-300 mb-1" />
                <div className="h-6 border-b border-slate-300" />
              </div>
            </div>
          </section>
        )}

        {doc === 'gratitude-jar' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">💌 Gratitude Jar</h2>
            <p className="text-slate-600 text-sm mb-3">Write or draw one thing you’re thankful for in each circle.</p>
            <svg viewBox="0 0 400 400" className="w-full h-auto bg-white border border-slate-300">
              <g fill="none" stroke="#111827" strokeWidth="3">
                <path d="M120 70 H280" />
                <path d="M140 70 C140 40, 260 40, 260 70" />
                <path d="M130 70 C120 140, 120 320, 200 360 C280 320, 280 140, 270 70" />
              </g>
              {Array.from({length:18}).map((_,i)=> {
                const col = i%6
                const row = Math.floor(i/6)
                const cx = 70 + col*50
                const cy = 110 + row*60
                return <circle key={i} cx={cx} cy={cy} r={18} stroke="#9ca3af" fill="none" />
              })}
            </svg>
          </section>
        )}

        {doc === 'mood-tracker' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌈 Mood Tracker</h2>
            <p className="text-slate-600 text-sm mb-3">Color each day based on your mood. Use your own color legend.</p>
            <table className="w-full border border-slate-300">
              <thead>
                <tr className="bg-slate-50 text-sm">
                  <th className="border border-slate-300 px-2 py-1 text-left">Day</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">How I felt</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d)=> (
                  <tr key={d} className="h-10">
                    <td className="border border-slate-300 px-2">{d}</td>
                    <td className="border border-slate-300" />
                    <td className="border border-slate-300" />
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {doc === 'mandalas' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🕉️ Mindful Coloring Mandalas</h2>
            <p className="text-slate-600 text-sm mb-3">Color slowly. Start from the center and move outward.</p>
            <svg viewBox="0 0 400 400" className="w-full h-auto bg-white border border-slate-300">
              <g fill="none" stroke="#111827" strokeWidth="2">
                {Array.from({length:6}).map((_,i)=> (
                  <circle key={i} cx={200} cy={200} r={30 + i*25} />
                ))}
                {Array.from({length:12}).map((_,i)=> {
                  const ang = (i/12)*Math.PI*2
                  const x1 = 200 + Math.cos(ang)*40
                  const y1 = 200 + Math.sin(ang)*40
                  const x2 = 200 + Math.cos(ang)*160
                  const y2 = 200 + Math.sin(ang)*160
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                })}
                {Array.from({length:8}).map((_,i)=> {
                  const ang = (i/8)*Math.PI*2
                  const r=110
                  const x = 200 + Math.cos(ang)*r
                  const y = 200 + Math.sin(ang)*r
                  return <polygon key={i} points={`${x},${y} ${x+8},${y+14} ${x-8},${y+14}`} />
                })}
              </g>
            </svg>
          </section>
        )}

        {doc === 'weekly-goals' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🗓️ My Goals for the Week</h2>
            <p className="text-slate-600 text-sm mb-3">Write 3 goals, 1 thing to try, and 1 thing you’re proud of.</p>
            {['Goal 1','Goal 2','Goal 3','Try this','Proud of'].map((t,i)=> (
              <div key={i} className="mb-3">
                <div className="text-sm font-semibold text-slate-800">{t}</div>
                <div className="h-6 border-b border-slate-400" />
              </div>
            ))}
          </section>
        )}

        {doc === 'halloween-pack' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎃 Halloween Puzzle Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Mini pack: word list + costume ideas + tiny maze.</p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-1">Spooky Word List</div>
                <ul className="list-disc list-inside space-y-1">
                  {['ghost','pumpkin','witch','bat','candy','mask','moon','owl'].map(w=> <li key={w}>{w}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Costume Idea Box</div>
                <div className="h-32 border border-dashed border-slate-400 rounded" />
              </div>
            </div>
          </section>
        )}

        {doc === 'winter-kindness' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">❄️ Winter Kindness Challenge</h2>
            <p className="text-slate-600 text-sm mb-3">Color a square each time you complete a kind act.</p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({length:25}).map((_,i)=> (
                <div key={i} className="h-10 border border-slate-300 rounded text-[10px] p-1">Act #{i+1}</div>
              ))}
            </div>
          </section>
        )}

        {doc === 'spring-scavenger' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌸 Spring Nature Scavenger Hunt</h2>
            <p className="text-slate-600 text-sm mb-3">Go outside and check off what you discover.</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {['Leaf with spots','Pink flower','Three smooth stones','Ant trail','Bird feather','Cloud shaped like an animal','Two kinds of grass','Buzzing insect','Tiny pinecone','Something yellow'].map(x=> <li key={x}>☐ {x}</li>)}
            </ul>
          </section>
        )}

        {doc === 'summer-pack' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">☀️ Summer Adventure Pack</h2>
            <p className="text-slate-600 text-sm mb-3">A quick set for travel days: word list + maze box + drawing prompt.</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {['beach','shell','sand','wave','sun','boat','crab','icecream'].map(w=> <li key={w}>{w}</li>)}
              </ul>
              <div className="h-24 border border-dashed border-slate-400 rounded" />
              <div>
                <div className="font-semibold mb-1">Draw: Your best summer day</div>
                <div className="h-24 border border-slate-300 rounded" />
              </div>
            </div>
          </section>
        )}

        {doc === 'brain-boost' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🧠 7‑Day Brain Boost Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Do one mini‑challenge each day. Track your streak!</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {['Memory pairs','Word jumble','Counting maze','Pattern copy','Quick sudoku','Riddle time','Spot the change'].map((t,i)=> <li key={i}>{t}</li>)}
            </ol>
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">Streak tracker</div>
              <table className="w-full border border-slate-300 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                      <th key={d} className="border border-slate-300 px-2 py-1 text-center">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Array.from({length:7}).map((_,i)=> (
                      <td key={i} className="border border-slate-300 h-8 text-center align-middle">☐</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">What was tricky?</div>
                  <div className="h-6 border-b border-slate-400 mb-1" />
                  <div className="h-6 border-b border-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">What I nailed</div>
                  <div className="h-6 border-b border-slate-400 mb-1" />
                  <div className="h-6 border-b border-slate-400" />
                </div>
              </div>
            </div>
          </section>
        )}

        {doc === 'creative-challenge' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎨 Creative Kids Challenge</h2>
            <p className="text-slate-600 text-sm mb-3">7 days of quick art prompts. Spend 5–10 minutes each.</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {['Draw a robot pet','Design a flag','Invent a snack package','Doodle your name in 3 styles','Sketch a tiny house','Create a new animal','Make a comic in 3 panels'].map((t,i)=> <li key={i}>{t}</li>)}
            </ol>
          </section>
        )}

        {doc === 'ws-world' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌍 Around the World Word Search</h2>
            <p className="text-slate-600 text-sm mb-3">Find all the world words hidden in the grid. Use the clue list to track your progress.</p>
            {(() => {
              const words = ['PARIS','NILE','AFRICA','ASIA','ALPS','TOKYO','ITALY','NORTH','SOUTH','RIO','BERLIN']
              return (
                <div className="md:flex md:items-start md:gap-6">
                  <div className="flex-1">
                    <div className="grid grid-cols-12 gap-[2px] font-mono text-sm bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
                      {generateWordSearchGrid(12, [...words]).map((row, r) => (
                        <React.Fragment key={r}>
                          {row.map((ch, c) => (
                            <div key={c} className="w-6 h-6 border border-slate-300 flex items-center justify-center rounded-sm">{ch}</div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:w-64 border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                    <div className="text-sm font-semibold text-slate-800 mb-2">Clue words</div>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {words.map(w => (<li key={w}>☐ {w}</li>))}
                    </ul>
                  </div>
                </div>
              )
            })()}
          </section>
        )}

        {doc === 'animal-pack' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🦁 Animal Adventure Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Mix of animal‑themed puzzles to print and enjoy.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Mini maze */}
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-2">Mini maze: Help the cub reach its den</div>
                <svg viewBox="0 0 220 220" className="w-full h-auto bg-white border border-slate-300 rounded">
                  <rect x="10" y="10" width="200" height="200" fill="#ffffff" stroke="#94a3b8" />
                  {/* Simple walls */}
                  <path d="M10 50 H170 M50 10 V100 M90 50 V210 M130 10 V160 M170 90 H210 M50 130 H210 M10 170 H130" stroke="#94a3b8" strokeWidth="4" />
                  {/* Start and Den with icons */}
                  <text x="18" y="32" fontSize="13" fill="#334155">Start</text>
                  <text x="48" y="30" fontSize="14">🐾</text>
                  <text x="168" y="200" fontSize="13" textAnchor="end" fill="#334155">Den</text>
                  <text x="172" y="196" fontSize="14">🏠</text>
                </svg>
              </div>
              {/* Word list with checkboxes */}
              <div className="md:pl-2">
                <div className="text-sm font-semibold text-slate-800 mb-2">Word list</div>
                <div className="border border-slate-200 rounded-lg p-3 bg-white print:bg-transparent print:border-0">
                  <ul className="text-sm text-slate-700 space-y-1 columns-2 md:columns-1">
                    {['lion','zebra','panda','eagle','whale','koala'].map(w => (
                      <li key={w}>☐ {w}</li>
                    ))}
                  </ul>
                  <div className="mt-3 text-sm">
                    <div className="font-semibold text-slate-800 mb-1">Pick two animals to combine</div>
                    <div className="flex items-center gap-3 mb-1">
                      <span>☐</span>
                      <div className="flex-1 border-b border-slate-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span>☐</span>
                      <div className="flex-1 border-b border-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Draw challenge */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">Draw challenge: Create your own creature</div>
              <div className="h-40 border border-slate-300 rounded bg-white" />
              <div className="mt-2 text-sm font-semibold text-slate-800">Creature name</div>
              <div className="h-6 border-b border-slate-400" />
            </div>
          </section>
        )}

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

        {(!doc || doc === 'sudoku4') && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Sudoku – 4×4 (Easy)</h2>
            <p className="text-slate-600 text-sm mb-3">Fill numbers 1–4 so each row/column contains all numbers with no repeats.</p>
            <div className="inline-grid grid-cols-4 gap-0 bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-10 h-10 border border-slate-400" />
              ))}
            </div>
          </section>
        )}

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

        {doc === 'coloring' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🎨 Coloring Page – Cute Animal</h2>
            <p className="text-slate-600 text-sm mb-3">Print and color the outline below.</p>
            <div className="border border-slate-300 rounded p-4 bg-white print:border-0 print:p-0">
              <ColoringSVG />
            </div>
          </section>
        )}

        {doc === 'coloring-letters-numbers' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔢 Alphabet & Number Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">A–Z animals and 1–10 rockets — trace, color, and learn letters and numbers.</p>
            {/* A–Z Letters grid (large) */}
            <div className="mb-8 grid grid-cols-3 sm:grid-cols-4 gap-6 print:gap-4">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch, i) => (
                <div key={i} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <text x="100" y="135" textAnchor="middle" fontSize="120" fill="none" stroke="#111827" strokeWidth="4">{ch}</text>
                  </svg>
                </div>
              ))}
            </div>
            {/* 1–10 Numbers with rocket icon (large) */}
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-6 print:gap-4">
              {Array.from({ length: 10 }, (_, idx) => idx + 1).map((n) => (
                <div key={n} className="aspect-square min-h-[180px] sm:min-h-[220px] border border-slate-300 rounded bg-white flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <text x="70" y="135" textAnchor="middle" fontSize="96" fill="none" stroke="#111827" strokeWidth="4">{n}</text>
                    {/* small rocket */}
                    <g fill="none" stroke="#111827" strokeWidth="4">
                      <path d="M120 70 L140 110 L120 150 L100 110 Z" />
                      <circle cx="120" cy="110" r="8" />
                      <path d="M100 150 L120 170 L140 150" />
                    </g>
                  </svg>
                </div>
              ))}
            </div>
          </section>
        )}

        {doc === 'coloring-animals' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🦁 Animal Friends Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">Meet our friendly jungle and sea animals — lions, pandas, dolphins, and more. Ages 5–10.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Lion */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <circle cx="200" cy="150" r="70" />
                    <circle cx="200" cy="150" r="95" strokeDasharray="8 8" />
                    <circle cx="175" cy="140" r="8" />
                    <circle cx="225" cy="140" r="8" />
                    <path d="M190 165 Q200 175 210 165" />
                    <path d="M145 200 Q200 220 255 200" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Turtle */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <ellipse cx="200" cy="180" rx="80" ry="45" />
                    <circle cx="120" cy="175" r="20" />
                    <line x1="155" y1="200" x2="135" y2="220" />
                    <line x1="245" y1="200" x2="265" y2="220" />
                    <line x1="180" y1="220" x2="170" y2="240" />
                    <line x1="220" y1="220" x2="230" y2="240" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Dolphin */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M60 180 C120 80, 260 80, 320 160 C250 140, 180 180, 120 190 Z" />
                    <path d="M120 190 L90 215 L140 205 Z" />
                    <circle cx="260" cy="145" r="5" />
                    <path d="M300 160 L340 160 L320 180 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Elephant */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M90 200 C120 120, 260 120, 300 190 C270 210, 200 220, 140 210 Z" />
                    <circle cx="260" cy="165" r="6" />
                    <path d="M110 190 Q100 210 120 220" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Fish */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M120 160 C180 120, 240 120, 300 160 C240 200, 180 200, 120 160 Z" />
                    <path d="M120 160 L90 145 L95 175 Z" />
                    <circle cx="260" cy="160" r="5" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Bird */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="4">
                    <path d="M90 190 C140 150, 220 150, 270 190" />
                    <path d="M180 170 L210 150 L200 190 Z" />
                    <circle cx="280" cy="180" r="4" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {doc === 'coloring-nature' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🌼 Nature & Seasons Coloring Pack</h2>
            <p className="text-slate-600 text-sm mb-3">Color flowers, trees, rainbows, and seasonal scenes (spring to winter).</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Flower */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="130" r="14" />
                    <circle cx="235" cy="130" r="18" />
                    <circle cx="165" cy="130" r="18" />
                    <circle cx="200" cy="95" r="18" />
                    <circle cx="200" cy="165" r="18" />
                    <path d="M200 144 L200 230" />
                    <path d="M200 200 Q230 220 250 240" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Leaf (large) */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M120 220 C200 120, 300 120, 280 220 C220 240, 180 240, 120 220 Z" />
                    <path d="M200 220 L200 150" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Tree */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="185" y="180" width="30" height="60" />
                    <circle cx="200" cy="150" r="22" />
                    <circle cx="170" cy="165" r="20" />
                    <circle cx="230" cy="165" r="20" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Rainbow */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M80 220 Q200 100 320 220" />
                    <path d="M100 220 Q200 120 300 220" />
                    <path d="M120 220 Q200 140 280 220" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Mountain */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M60 220 L160 120 L200 180 L240 140 L340 220 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Sun */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="140" r="24" />
                    {Array.from({length:12}).map((_,i)=>{const a=i*Math.PI*2/12;return <line key={i} x1={200} y1={140} x2={200+Math.cos(a)*50} y2={140+Math.sin(a)*50} />})}
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {doc === 'coloring-space' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🚀 Space Adventure Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">Rockets, planets, and astronauts. Great for science week or STEM lessons.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Rocket */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M200 80 L220 140 L200 200 L180 140 Z" />
                    <circle cx="200" cy="140" r="10" />
                    <path d="M180 200 L200 220 L220 200" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Comet */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="280" cy="100" r="10" />
                    <path d="M100 180 Q200 120 270 105" />
                    <path d="M120 190 Q210 130 270 115" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Planet */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="150" r="45" />
                    <ellipse cx="200" cy="150" rx="80" ry="18" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Astronaut helmet */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <circle cx="200" cy="150" r="50" />
                    <rect x="165" y="140" width="70" height="30" rx="8" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Satellite */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="190" y="140" width="20" height="20" />
                    <rect x="150" y="142" width="30" height="16" />
                    <rect x="220" y="142" width="30" height="16" />
                    <line x1="170" y1="150" x2="230" y2="150" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Star cluster */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    {Array.from({length:7}).map((_,i)=>{const x=120+i*30; const y=120+((i%2)*30);return <circle key={i} cx={x} cy={y} r={3}/>})}
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {doc === 'coloring-vehicles' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🚗 Vehicles & Transport Coloring Sheets</h2>
            <p className="text-slate-600 text-sm mb-3">Cars, trucks, airplanes, and trains to keep little drivers busy and creative.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Car */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="120" y="170" width="160" height="40" rx="8" />
                    <path d="M150 170 Q200 140 250 170" />
                    <circle cx="160" cy="220" r="14" />
                    <circle cx="240" cy="220" r="14" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Truck */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="110" y="170" width="130" height="40" />
                    <rect x="240" y="180" width="40" height="30" />
                    <circle cx="150" cy="220" r="12" />
                    <circle cx="230" cy="220" r="12" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Airplane */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M80 180 L320 140 L320 160 L80 200 Z" />
                    <path d="M220 150 L280 100" />
                    <path d="M200 160 L260 210" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Train engine */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="120" y="160" width="160" height="40" />
                    <rect x="230" y="140" width="50" height="20" />
                    <circle cx="160" cy="210" r="12" />
                    <circle cx="240" cy="210" r="12" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Boat */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M100 200 L300 200 L260 230 L140 230 Z" />
                    <rect x="180" y="170" width="40" height="30" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Helicopter */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="170" y="170" width="60" height="25" />
                    <line x1="200" y1="170" x2="200" y2="150" />
                    <line x1="150" y1="150" x2="250" y2="150" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

        {doc === 'coloring-heroes' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🦸 Superheroes & Everyday Heroes Coloring Pages</h2>
            <p className="text-slate-600 text-sm mb-3">Celebrate courage and kindness — superheroes and community helpers (doctors, firefighters, teachers).</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Shield */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M200 90 L260 110 L250 170 L200 210 L150 170 L140 110 Z" />
                    <path d="M200 110 L235 125 L228 165 L200 188 L172 165 L165 125 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Firefighter helmet */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M140 200 Q200 140 260 200" />
                    <rect x="160" y="195" width="80" height="20" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Star badge */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <polygon points="200,100 215,145 260,145 225,170 240,210 200,185 160,210 175,170 140,145 185,145" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Cape */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M160 100 Q200 200 240 100 Q220 160 180 160 Z" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Mask */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <rect x="150" y="140" width="100" height="30" rx="10" />
                    <circle cx="175" cy="155" r="8" />
                    <circle cx="225" cy="155" r="8" />
                  </g>
                </svg>
              </div>
              <div className="border border-slate-300 rounded p-4 bg-white">
                {/* Doctor stethoscope */}
                <svg viewBox="0 0 400 300" className="w-full h-auto" aria-hidden>
                  <g fill="none" stroke="#111827" strokeWidth="3.5">
                    <path d="M180 120 C160 160, 240 160, 220 120" />
                    <circle cx="250" cy="130" r="10" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        )}

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

function HiddenObjectsSceneSVGA() {
  // Hand-drawn busy scene with hidden shapes matching the checklist
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#sky)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y={220} width="10" height="40" fill="#64748b" />
          <circle cx={x+5} cy={200} r="28" fill="#a7f3d0" />
          <circle cx={x-15} cy={215} r="18" fill="#a7f3d0" />
          <circle cx={x+22} cy={215} r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (hidden object: Cloud) – larger, line-art */}
      <g>
        <ellipse cx="180" cy="90" rx="70" ry="28" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="215" cy="90" rx="50" ry="22" fill="none" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="140" cy="96" rx="45" ry="18" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Star (hidden on tree) – bigger, line-art */}
      <polygon points="560,145 568,170 596,170 572,186 580,210 560,196 540,210 548,186 524,170 552,170" fill="none" stroke="#111827" strokeWidth="3.5" />

      {/* Leaf (on ground) – clearer outline with vein */}
      <g>
        <path d="M290 300 C320 280, 360 310, 330 330 C345 345, 305 350, 290 330 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M325 295 Q325 315 318 332" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Book (bench) – larger, line-art with page lines */}
      <g>
        <rect x="392" y="285" width="80" height="10" fill="none" stroke="#111827" strokeWidth="3" />
        <rect x="398" y="248" width="68" height="36" rx="2" fill="none" stroke="#111827" strokeWidth="3" />
        <line x1="432" y1="248" x2="432" y2="284" stroke="#111827" strokeWidth="3" />
        <line x1="404" y1="256" x2="464" y2="256" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="263" x2="464" y2="263" stroke="#111827" strokeWidth="2" />
        <line x1="404" y1="270" x2="464" y2="270" stroke="#111827" strokeWidth="2" />
      </g>

      {/* Car (simple) – larger, line-art */}
      <g>
        <rect x="620" y="265" width="120" height="36" rx="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="650" y="270" width="50" height="16" rx="3" fill="none" stroke="#111827" strokeWidth="2.5" />
        <circle cx="648" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <circle cx="712" cy="308" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Key (on ground) – larger, line-art with teeth */}
      <g>
        <circle cx="520" cy="328" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="538" y="325" width="36" height="8" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="574" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="584" y="325" width="8" height="12" fill="none" stroke="#111827" strokeWidth="3.5" />
      </g>

      {/* Apple (on tree) – larger, line-art with stem + leaf */}
      <g>
        <circle cx="220" cy="205" r="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="220" y1="191" x2="220" y2="199" stroke="#111827" strokeWidth="3" />
        <ellipse cx="228" cy="196" rx="8" ry="4" fill="none" stroke="#111827" strokeWidth="2.5" />
      </g>

      {/* Shell (near pond) – larger, line-art with scallops */}
      <g>
        <path d="M100 324 C118 296, 162 296, 180 324 C172 340, 108 340, 100 324 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
        {Array.from({length:5}).map((_,i)=>{
          const x = 112 + i*14; return (<path key={i} d={`M${x} 322 Q${x+4} 312 ${x+8} 322`} stroke="#111827" fill="none" strokeWidth="2.5"/>);
        })}
      </g>

      {/* Ball – larger, line-art with stripes */}
      <g>
        <circle cx="360" cy="310" r="16" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M342 310 Q360 296 378 310" stroke="#111827" strokeWidth="2.5" fill="none" />
        <path d="M360 294 Q370 310 360 326" stroke="#111827" strokeWidth="2.5" fill="none" />
      </g>

      {/* Hat (on bench) – clearer fedora outline */}
      <g>
        <ellipse cx="475" cy="282" rx="28" ry="10" fill="none" stroke="#111827" strokeWidth="3.5" />
        <path d="M452 268 Q475 258 498 268" fill="none" stroke="#111827" strokeWidth="3.5" />
        <rect x="458" y="264" width="34" height="14" fill="none" stroke="#111827" strokeWidth="3.5" />
        <line x1="458" y1="270" x2="492" y2="270" stroke="#111827" strokeWidth="3" />
      </g>
    </svg>
  )
}

// Variant B with 7 differences from A: (1) no star, (2) leaf moved, (3) book moved, (4) car color/position, (5) key moved, (6) apple moved, (7) add a bird
function HiddenObjectsSceneSVGB() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
      <defs>
        <linearGradient id="skyB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {/* Background sky and ground */}
      <rect x="0" y="0" width="800" height="240" fill="url(#skyB)" />
      <rect x="0" y="240" width="800" height="160" fill="#f1f5f9" />

      {/* Trees */}
      {[100, 220, 560, 700].map((x, i) => (
        <g key={i}>
          <rect x={x} y="220" width="10" height="40" fill="#64748b" />
          <circle cx={x+5} cy="200" r="28" fill="#a7f3d0" />
          <circle cx={x-15} cy="215" r="18" fill="#a7f3d0" />
          <circle cx={x+22} cy="215" r="18" fill="#a7f3d0" />
        </g>
      ))}

      {/* Cloud (same) */}
      <g>
        <ellipse cx="180" cy="90" rx="50" ry="20" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="210" cy="90" rx="35" ry="16" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="150" cy="94" rx="30" ry="14" fill="#ffffff" stroke="#94a3b8" />
      </g>

      {/* Star removed (difference 1) */}

      {/* Leaf moved (difference 2) */}
      <path d="M500 310 C520 300, 540 320, 520 330 C530 340, 510 345, 500 330 Z" fill="#86efac" stroke="#16a34a" />

      {/* Book moved to ground (difference 3) */}
      <g>
        <rect x="460" y="310" width="60" height="8" fill="#94a3b8" />
        <rect x="465" y="280" width="50" height="30" fill="#e2e8f0" stroke="#64748b" />
        <line x1="490" y1="280" x2="490" y2="310" stroke="#64748b" />
      </g>

      {/* Car changed color and slightly moved (difference 4) */}
      <g>
        <rect x="620" y="275" width="90" height="30" rx="6" fill="#86efac" stroke="#64748b" />
        <circle cx="640" cy="310" r="10" fill="#475569" />
        <circle cx="690" cy="310" r="10" fill="#475569" />
      </g>

      {/* Key moved (difference 5) */}
      <g>
        <circle cx="140" cy="335" r="8" fill="#fde68a" stroke="#b45309" />
        <rect x="148" y="333" width="20" height="4" fill="#fde68a" stroke="#b45309" />
        <rect x="168" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
        <rect x="173" y="333" width="4" height="6" fill="#fde68a" stroke="#b45309" />
      </g>

      {/* Apple moved (difference 6) */}
      <circle cx="260" cy="190" r="8" fill="#ef4444" stroke="#991b1b" />

      {/* Shell (same) */}
      <g>
        <path d="M110 320 C120 300, 150 300, 160 320 C155 330, 115 330, 110 320 Z" fill="#f5d0fe" stroke="#a855f7" />
        <line x1="120" y1="318" x2="150" y2="318" stroke="#9333ea" />
      </g>

      {/* Bird in sky (difference 7) */}
      <g>
        <path d="M600 80 Q610 70, 620 80 M620 80 Q630 70, 640 80" fill="none" stroke="#64748b" strokeWidth="3" />
      </g>
    </svg>
  )
}
