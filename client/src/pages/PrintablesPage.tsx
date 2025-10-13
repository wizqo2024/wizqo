import React from 'react'
import { WizqoLogo } from '@/components/WizqoLogo'

export function PrintablesPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const doc = params.get('doc') || ''
  const [showAnswers, setShowAnswers] = React.useState(false)
  const answerableDocs = new Set([
    'science-match',
    'spelling',
    'logic-grid',
    'grammar-detective',
    'math-maze',
  ])
  const shouldShowAnswerToggle = answerableDocs.has(doc)
  const mathMazeCells = React.useMemo(() => {
    if (doc !== 'math-maze') return [] as string[];
    const ops = ['+','-'] as const;
    const cells: string[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 && c === 0) { cells.push('S'); continue; }
        if (r === 6 && c === 6) { cells.push('F'); continue; }
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        const op = ops[Math.floor(Math.random() * ops.length)];
        cells.push(`${a}${op}${b}`);
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
          <a href="/printables" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-label="Back printable page">
            <span>←</span>
            <span>Back printable page</span>
          </a>
        </div>
        <header className="mb-6 print:mb-4 flex items-center justify-between border-b border-slate-200 pb-3 print:border-b-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Printable Fun Learning Activities</h1>
            <p className="text-slate-600 mt-2 print:mt-1 text-sm">Print these kid‑friendly activities. Use your browser’s Print → Save as PDF to download.</p>
          </div>
          <div className="flex items-center gap-3">
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
            <div className="grid grid-cols-2 gap-6">
              <svg viewBox="0 0 200 200" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="200" height="200" fill="url(#g1)" />
                <path d="M40 100 C60 40, 140 40, 160 100 C140 160, 60 160, 40 100 Z" fill="none" stroke="#111827" strokeWidth="3" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
              <svg viewBox="0 0 200 200" className="w-full h-auto bg-white border border-slate-300">
                <defs>
                  <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0 H0 V20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="200" height="200" fill="url(#g2)" />
                <path d="M60 160 L100 40 L140 160 Z" fill="none" stroke="#111827" strokeWidth="3" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="#9ca3af" strokeDasharray="4 4" />
              </svg>
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
                <li>The fish belongs to the youngest child.</li>
                <li>Ava’s pet sleeps in a basket.</li>
              </ol>
            </div>
            {showAnswers && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
                <div className="font-semibold mb-1">One valid solution</div>
                <ul className="list-disc list-inside">
                  <li>Ava → Fish</li>
                  <li>Noah → Dog</li>
                  <li>Liam → Cat</li>
                </ul>
                <div className="text-xs text-emerald-900/80 mt-1">Note: Multiple solutions can satisfy the clues; this is one example.</div>
              </div>
            )}
          </section>
        )}

        {doc === 'hidden-object' && (
          <section className="mb-10 break-inside-avoid border border-slate-200 rounded-xl p-4 print:border-0 print:p-0">
            <h2 className="text-lg font-bold text-slate-900">🔍 Find the Hidden Object</h2>
            <p className="text-slate-600 text-sm mb-3">Find and circle each item hidden in the scene below.</p>
            <div className="mb-3">
              <HiddenObjectsSceneSVG />
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
                  {/* Start and Den */}
                  <text x="18" y="32" fontSize="12" fill="#334155">Start</text>
                  <text x="168" y="200" fontSize="12" textAnchor="end" fill="#334155">Den</text>
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

function HiddenObjectsSceneSVG() {
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

      {/* Cloud (hidden object: Cloud) */}
      <g>
        <ellipse cx="180" cy="90" rx="50" ry="20" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="210" cy="90" rx="35" ry="16" fill="#ffffff" stroke="#94a3b8" />
        <ellipse cx="150" cy="94" rx="30" ry="14" fill="#ffffff" stroke="#94a3b8" />
      </g>

      {/* Star (hidden on tree) */}
      <polygon points="560,160 566,176 584,176 569,186 574,202 560,192 546,202 551,186 536,176 554,176" fill="#fde68a" stroke="#b45309" />

      {/* Leaf (on ground) */}
      <path d="M300 300 C320 290, 340 310, 320 320 C330 330, 310 335, 300 320 Z" fill="#86efac" stroke="#16a34a" />

      {/* Book (bench) */}
      <g>
        <rect x="400" y="285" width="60" height="8" fill="#94a3b8" />
        <rect x="405" y="255" width="50" height="30" fill="#e2e8f0" stroke="#64748b" />
        <line x1="430" y1="255" x2="430" y2="285" stroke="#64748b" />
      </g>

      {/* Car (simple) */}
      <g>
        <rect x="640" y="270" width="90" height="30" rx="6" fill="#c7d2fe" stroke="#64748b" />
        <circle cx="660" cy="305" r="10" fill="#475569" />
        <circle cx="710" cy="305" r="10" fill="#475569" />
      </g>

      {/* Key (on ground) */}
      <g>
        <circle cx="520" cy="330" r="8" fill="#fde68a" stroke="#b45309" />
        <rect x="528" y="328" width="20" height="4" fill="#fde68a" stroke="#b45309" />
        <rect x="548" y="328" width="4" height="6" fill="#fde68a" stroke="#b45309" />
        <rect x="553" y="328" width="4" height="6" fill="#fde68a" stroke="#b45309" />
      </g>

      {/* Apple (on tree) */}
      <circle cx="220" cy="205" r="8" fill="#ef4444" stroke="#991b1b" />

      {/* Shell (near pond) */}
      <g>
        <path d="M110 320 C120 300, 150 300, 160 320 C155 330, 115 330, 110 320 Z" fill="#f5d0fe" stroke="#a855f7" />
        <line x1="120" y1="318" x2="150" y2="318" stroke="#9333ea" />
      </g>

      {/* Ball */}
      <circle cx="360" cy="310" r="10" fill="#fca5a5" stroke="#ef4444" />

      {/* Hat (on bench) */}
      <g>
        <ellipse cx="475" cy="280" rx="16" ry="6" fill="#fef9c3" stroke="#a16207" />
        <rect x="466" y="270" width="18" height="10" fill="#fde68a" stroke="#a16207" />
      </g>
    </svg>
  )
}
