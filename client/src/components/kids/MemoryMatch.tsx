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

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-slate-700">Time: {time}s</span>
        <span className="text-slate-700">Moves: {moves}</span>
        <span className="text-slate-500">Best: {best ?? '-'}s</span>
        <button onClick={restart} className="ml-auto px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700">Restart</button>
      </div>
      <div className="grid grid-cols-4 gap-3 max-w-md">
        {board.map((emoji, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.has(idx);
          return (
            <button
              key={idx}
              aria-label={isFaceUp ? `Card ${emoji}` : 'Hidden card'}
              onClick={() => handleFlip(idx)}
              className={`aspect-square rounded-lg border text-3xl flex items-center justify-center transition-colors ${isFaceUp ? 'bg-white border-slate-300' : 'bg-purple-100 border-purple-200 hover:bg-purple-200'}`}
            >
              {isFaceUp ? emoji : '🎴'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
