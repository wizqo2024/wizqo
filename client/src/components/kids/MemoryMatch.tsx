import React, { useEffect, useMemo, useState } from 'react';

const EMOJIS = ['🐶','🐱','🦊','🐼','🐵','🦄','🐸','🐙'];

export default function MemoryMatch() {
  const [board, setBoard] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const bestKey = 'kids_memory_best_seconds';
  const best = useMemo(() => {
    const raw = localStorage.getItem(bestKey);
    return raw ? Number(raw) : null;
  }, []);

  useEffect(() => {
    const pair = [...EMOJIS, ...EMOJIS];
    const shuffled = pair.sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setTime(0);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (matched.size === board.length && board.length > 0) {
      setRunning(false);
      if (!best || time < best) {
        localStorage.setItem(bestKey, String(time));
      }
    }
  }, [matched, board, time, best]);

  const handleFlip = (idx: number) => {
    if (matched.has(idx) || flipped.includes(idx) || flipped.length === 2) return;
    setFlipped(prev => [...prev, idx]);
    if (flipped.length === 1) setMoves(m => m + 1);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      if (board[a] === board[b]) {
        setMatched(new Set([...Array.from(matched), a, b]));
        setFlipped([]);
      } else {
        const t = setTimeout(() => setFlipped([]), 800);
        return () => clearTimeout(t);
      }
    }
  }, [flipped, board, matched]);

  const restart = () => {
    const pair = [...EMOJIS, ...EMOJIS];
    const shuffled = pair.sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setTime(0);
    setRunning(true);
  };

  const bestDisplay = best !== null ? `${best}s` : '—';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
          🃏 Memory Match
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">⏱ {time}s</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">🎯 {moves} moves</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">🏆 {bestDisplay}</span>
          <button onClick={restart} className="ml-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">Restart</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 max-w-md bg-slate-50 p-3 rounded-xl border border-slate-200">
        {board.map((emoji, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.has(idx);
          return (
            <button
              key={idx}
              aria-label={isFaceUp ? `Card ${emoji}` : 'Hidden card'}
              onClick={() => handleFlip(idx)}
              className={`aspect-square rounded-xl border text-3xl flex items-center justify-center transition-colors shadow-sm ${isFaceUp ? 'bg-white border-slate-300' : 'bg-white border-slate-200 hover:bg-purple-50'}`}
            >
              {isFaceUp ? emoji : '🎴'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
