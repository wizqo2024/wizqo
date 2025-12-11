
import React, { useState, useEffect } from 'react';

// Utility for random numbers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const CosmicMathWorksheet = () => {
  const [problems, setProblems] = useState<{ a: number; b: number; op: string }[]>([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

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
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        {/* Stars */}
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" />
        <div className="absolute top-40 right-60 w-1.5 h-1.5 bg-blue-200 rounded-full animate-twinkle delay-300" />
        <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-purple-200 rounded-full animate-twinkle delay-500" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-tight">
              COSMIC MATH
            </h1>
            <div className="absolute -top-6 -right-6 text-4xl animate-bounce">🚀</div>
          </div>
          <p className="mt-4 text-slate-300 text-lg md:text-xl font-light tracking-wide">
            Mission: Master the <span className="text-purple-300 font-semibold">Multiplication Galaxy</span>
          </p>
        </header>

        {/* Worksheet Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          {/* Glass Gloss */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Problems List */}
            <div className="space-y-6">
              {problems.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group/item">
                  <span className="text-2xl font-bold text-slate-400 w-8">{i + 1}.</span>
                  <div className="flex items-center gap-4 text-3xl font-mono text-white">
                    <span className="text-blue-400">{p.a}</span>
                    <span className="text-slate-500">{p.op}</span>
                    <span className="text-pink-400">{p.b}</span>
                    <span className="text-slate-500">=</span>
                  </div>
                  <div className="w-20 h-10 bg-black/30 rounded-lg border border-white/10 group-hover/item:border-purple-500/50 transition-colors" />
                </div>
              ))}
            </div>

            {/* Sidebar Info */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">🧑‍🚀 Cadet Profile</h3>
                <div className="space-y-3">
                  <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
                  <div className="h-8 bg-white/5 rounded w-1/2 animate-pulse" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-900/40 to-orange-900/40 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">🏆 Mission Status</h3>
                <p className="text-slate-300 text-sm mb-4">Complete all equations to unlock hyper-drive.</p>
                <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden">
                  <div className="w-[0%] h-full bg-gradient-to-r from-pink-500 to-yellow-500" />
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => window.print()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 group/btn"
                >
                  <span>PRINT MISSION</span>
                  <svg className="w-6 h-6 group-hover/btn:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
                <p className="text-center text-slate-500 text-sm mt-3">Ready for launch? 3... 2... 1...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="mt-12 text-center opacity-50">
          <p className="text-sm text-slate-400 font-mono tracking-widest">WIZQO INTERSTELLAR ACADEMY • 2024</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; }
          body { background: white !important; color: black !important; }
          .min-h-screen { min-height: auto; overflow: visible; }
          .bg-slate-900\\/50 { background: white !important; border: 2px solid #000 !important; box-shadow: none !important; color: black !important; }
          .text-white { color: black !important; }
          .text-slate-300, .text-slate-400, .text-slate-500 { color: #666 !important; }
          .bg-gradient-to-r, .bg-gradient-to-br { background: none !important; }
          .text-transparent { color: black !important; -webkit-text-fill-color: black !important; }
          .bg-clip-text { -webkit-background-clip: unset !important; }
          button { display: none !important; }
          .animate-pulse, .animate-bounce, .animate-twinkle { animation: none !important; }
          .fixed { display: none !important; }
          .group-hover\\:opacity-100 { opacity: 0 !important; }
          /* Ensure inputs (empty boxes) are visible */
          .bg-black\\/30 { background: white !important; border: 1px solid #000 !important; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default CosmicMathWorksheet;
