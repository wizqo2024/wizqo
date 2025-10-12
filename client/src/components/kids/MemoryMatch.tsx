import React, { useEffect, useMemo, useRef, useState } from 'react';

const EMOJIS = ['🐶','🐱','🦊','🐼','🐵','🦄','🐸','🐙'];

export default function MemoryMatch() {
  const [board, setBoard] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const audioCtxRef = useRef<any>(null);
  function unlockAudio() {
    if (audioCtxRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
    } catch {}
  }

  function playVictory() {
    const ctx: AudioContext | undefined = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.value = 0.001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = now + idx * 0.09;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);
      osc.start(t0);
      osc.stop(t0 + 0.26);
    });
  }
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
      playVictory();
    }
  }, [matched, board, time, best]);

  const handleFlip = (idx: number) => {
    unlockAudio();
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
    unlockAudio();
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
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-100 to-pink-100 text-purple-700 text-xs font-semibold border border-pink-200">
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
