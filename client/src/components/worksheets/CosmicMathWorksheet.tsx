
import React, { useState, useEffect } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';

// Utility for random numbers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function CosmicMathWorksheet() {
  const [problems, setProblems] = useState<{ a: number; b: number; op: string }[]>([]);

  // Generate problems on mount
  useEffect(() => {
    const newProblems = Array.from({ length: 10 }).map(() => ({
      a: randomInt(2, 9),
      b: randomInt(2, 9),
      op: '×'
    }));
    setProblems(newProblems);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <UnifiedNavigation />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-slate-600 print:hidden" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li className="text-slate-400">/</li>
            <li><a href="/worksheets/all" className="hover:text-blue-600">Worksheets</a></li>
            <li className="text-slate-400">/</li>
            <li><a href="/worksheets/3rd-grade-math-worksheets" className="hover:text-blue-600">3rd Grade Math</a></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium" aria-current="page">Cosmic Math Adventure</li>
          </ol>
        </nav>

        {/* Introduction */}
        <div className="mb-8 text-center print:hidden">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Cosmic Multiplication Adventure 🚀</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Blast off into a galaxy of numbers! Solve the multiplication problems to navigate through the stars.
            This interactive worksheet brings math to life with deep space visuals.
          </p>
        </div>

        {/* The "Cosmic" Container - enhanced visuals contained here */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0f172a] text-white selection:bg-purple-500 selection:text-white print:shadow-none print:rounded-none">

          {/* Background Effects (Contained) */}
          <div className="absolute inset-0 pointer-events-none print:hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[100px] rounded-full animate-pulse delay-700" />
            {/* Stars */}
            <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" />
            <div className="absolute top-40 right-60 w-1.5 h-1.5 bg-blue-200 rounded-full animate-twinkle delay-300" />
            <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-purple-200 rounded-full animate-twinkle delay-500" />
            <div className="absolute top-1/2 left-10 w-0.5 h-0.5 bg-white/50 rounded-full animate-twinkle delay-100" />
            <div className="absolute bottom-1/3 right-10 w-1 h-1 bg-pink-200 rounded-full animate-twinkle delay-700" />
          </div>

          {/* Worksheet Content */}
          <div className="relative z-10 p-8 md:p-12">

            {/* Cosmic Header Inside Card */}
            <header className="text-center mb-12 print:mb-8">
              <div className="inline-block relative">
                <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-tight print:text-black print:drop-shadow-none">
                  COSMIC MATH
                </h2>
              </div>
              <p className="mt-2 text-slate-300 font-light tracking-wide print:text-black">
                Mission: Master the <span className="text-purple-300 font-semibold print:text-black">Multiplication Galaxy</span>
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 print:block">
              {/* Problems List */}
              <div className="space-y-4 print:space-y-6">
                {problems.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group/item print:bg-transparent print:border-b print:border-slate-200 print:rounded-none print:p-2">
                    <span className="text-xl font-bold text-slate-400 w-8 print:text-slate-600">{i + 1}.</span>
                    <div className="flex items-center gap-4 text-2xl md:text-3xl font-mono text-white print:text-black">
                      <span className="text-blue-400 print:text-black">{p.a}</span>
                      <span className="text-slate-500 print:text-black">×</span>
                      <span className="text-pink-400 print:text-black">{p.b}</span>
                      <span className="text-slate-500 print:text-black">=</span>
                    </div>
                    <div className="w-20 h-10 bg-black/30 rounded-lg border border-white/10 group-hover/item:border-purple-500/50 transition-colors print:border print:border-black print:bg-white" />
                  </div>
                ))}
              </div>

              {/* Sidebar Info - Hidden on Print to save ink/space usually, or styled simply */}
              <div className="flex flex-col gap-6 print:hidden">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">🧑‍🚀 Cadet Profile</h3>
                  <div className="space-y-3">
                    <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-8 bg-white/5 rounded w-1/2 animate-pulse" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-900/40 to-orange-900/40 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">🏆 Mission Status</h3>
                  <p className="text-slate-300 text-sm mb-4">Complete all equations to unlock hyper-drive.</p>
                  <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden">
                    <div className="w-[0%] h-full bg-gradient-to-r from-pink-500 to-yellow-500" />
                  </div>
                </div>

                <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-slate-400 text-sm mb-4 text-center">Ready to submit your mission report?</p>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 group/btn"
                  >
                    <span>PRINT MISSION</span>
                    <svg className="w-6 h-6 group-hover/btn:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center opacity-50 print:mt-8">
              <p className="text-sm text-slate-400 font-mono tracking-widest print:text-slate-500">WIZQO INTERSTELLAR ACADEMY • 2024</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 1cm; size: portrait; }
          body { -webkit-print-color-adjust: exact; }
          
          /* Hide generic site nav and footer */
          nav, footer, .unified-navigation, .site-footer { display: none !important; }
          
          /* Reset container widths for print */
          .container { max-width: none !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          main { padding: 0 !important; }
          
          /* Ensure backgrounds are white */
          .bg-slate-50 { background: white !important; }
          .bg-\\[\\#0f172a\\] { background: white !important; color: black !important; box-shadow: none !important; }
          
          /* Hide decorative blobs */
          .animate-pulse, .animate-twinkle { display: none !important; }
          
          /* Typography for print */
          .text-white { color: black !important; }
          .text-slate-300, .text-slate-400, .text-slate-500 { color: #666 !important; }
          .text-transparent { color: black !important; -webkit-text-fill-color: black !important; background: none !important; }
          
          /* Borders */
          .border-white\\/10 { border-color: #ddd !important; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
