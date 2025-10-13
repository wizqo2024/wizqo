import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';

const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4';

export function PrintablesLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="kids" />

      <header className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50" />
          <div className="absolute -top-16 -right-24 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Printable Fun Learning Activities</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 max-w-3xl">
            Take a break from screens with our fun learning activities for kids you can print at home. 
            Download puzzles and worksheets designed to boost focus, logic, and creativity:
          </p>
          <ul className="mt-3 list-disc list-inside text-slate-700 space-y-1">
            <li>🧠 Word Search – Animals & Space</li>
            <li>🔢 Sudoku – Easy (4×4) & Medium (6×6)</li>
            <li>🎨 Coloring Page – Creative Animals</li>
          </ul>
          <div className="mt-5">
            <a href="/print?doc=ws-animals" className={BUTTON_CLASS}>Open printable view →</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Quick links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a className={CARD_CLASS} href="/print?doc=ws-animals">
              <div className="text-lg font-semibold text-slate-900">🧠 Word Search – Animals</div>
              <div className="text-slate-600 text-sm">Find 12 animal names</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
            <a className={CARD_CLASS} href="/print?doc=ws-space">
              <div className="text-lg font-semibold text-slate-900">🧠 Word Search – Space</div>
              <div className="text-slate-600 text-sm">Find 12 space words</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
            <a className={CARD_CLASS} href="/print">
              <div className="text-lg font-semibold text-slate-900">🔢 Sudoku – 4×4 (Easy)</div>
              <div className="text-slate-600 text-sm">Beginner logic puzzle</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
            <a className={CARD_CLASS} href="/print?doc=sudoku6">
              <div className="text-lg font-semibold text-slate-900">🔢 Sudoku – 6×6 (Medium)</div>
              <div className="text-slate-600 text-sm">A bit more challenge</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
            <a className={CARD_CLASS} href="/print">
              <div className="text-lg font-semibold text-slate-900">🎨 Coloring – Cute Animals</div>
              <div className="text-slate-600 text-sm">Creative and calming</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
            <a className={CARD_CLASS} href="/print?doc=spotdiff">
              <div className="text-lg font-semibold text-slate-900">👀 Spot‑the‑Difference – Playground</div>
              <div className="text-slate-600 text-sm">Find 8 differences</div>
              <div className="mt-3"><span className={OUTLINE_BUTTON}>Open</span></div>
            </a>
          </div>
        </section>

        <section className="text-xs text-slate-500">
          <p className="print:hidden">Tip: Use your browser menu → Print → Save as PDF.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
