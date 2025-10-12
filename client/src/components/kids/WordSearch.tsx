import React, { useEffect, useMemo, useRef, useState } from 'react';

const THEMES: Record<string, string[]> = {
  Animals: ['DOG','CAT','LION','BEAR','WOLF','SEAL','FROG','EAGLE','MOUSE','HORSE','ZEBRA','SNAKE'],
  Space: ['STAR','MOON','SUN','MARS','COMET','NEBULA','ROVER','ORBIT','ASTRO','NOVAE','PLUTO','EARTH']
};

function generateGrid(words: string[], size = 12): string[][] {
  // Start with empty grid
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  const directions = [
    [0,1], [1,0], [0,-1], [-1,0], // H & V
    [1,1], [-1,-1], [1,-1], [-1,1] // Diagonals
  ];
  const placeWord = (word: string) => {
    const tries = 200;
    for (let t = 0; t < tries; t++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startR = Math.floor(Math.random() * size);
      const startC = Math.floor(Math.random() * size);
      let r = startR, c = startC;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        if (r < 0 || r >= size || c < 0 || c >= size) { ok = false; break; }
        const cell = grid[r][c];
        if (cell && cell !== word[i]) { ok = false; break; }
        r += dir[0]; c += dir[1];
      }
      if (!ok) continue;
      r = startR; c = startC;
      for (let i = 0; i < word.length; i++) {
        grid[r][c] = word[i];
        r += dir[0]; c += dir[1];
      }
      return true;
    }
    return false;
  };
  const pool = [...words];
  for (const w of pool) placeWord(w);
  // Fill remaining blanks with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random()*letters.length)];
    }
  }
  return grid;
}

export default function WordSearch() {
  const [theme, setTheme] = useState<'Animals' | 'Space'>('Animals');
  const words = THEMES[theme];
  const [grid, setGrid] = useState<string[][]>(() => generateGrid(words));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [found, setFound] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
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
  const bestKey = `kids_ws_best_${theme}`;
  const best = useMemo(() => {
    const raw = localStorage.getItem(bestKey);
    return raw ? Number(raw) : null;
  }, [bestKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (found.size >= Math.min(10, words.length)) {
      setRunning(false);
      if (!best || time < best) localStorage.setItem(bestKey, String(time));
      playVictory();
    }
  }, [found, words.length, best, time]);

  const newPuzzle = () => {
    unlockAudio();
    setGrid(generateGrid(words));
    setSelected(new Set());
    setFound(new Set());
    setTime(0);
    setRunning(true);
  };

  const toggleCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    setSelected(next);
  };

  const toggleWordFound = (word: string) => {
    const up = new Set(found);
    if (up.has(word)) up.delete(word); else up.add(word);
    setFound(up);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
          🔤 Word Search
        </div>
        <select value={theme} onChange={(e) => { setTheme(e.target.value as any); setGrid(generateGrid(THEMES[e.target.value as any])); setSelected(new Set()); setFound(new Set()); setTime(0); setRunning(true); }} className="border rounded-lg px-2 py-1 text-sm">
          <option>Animals</option>
          <option>Space</option>
        </select>
        <span className="text-slate-700 text-sm">Time: {time}s</span>
        <span className="text-slate-500 text-sm">Best: {best ?? '-'}s</span>
        <button onClick={newPuzzle} className="ml-auto px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:opacity-90">New</button>
      </div>
      <div className="grid grid-cols-12 gap-1 select-none bg-slate-50 p-3 rounded-xl border border-slate-200">
        {grid.map((row, r) => row.map((ch, c) => {
          const key = `${r},${c}`;
          const isSel = selected.has(key);
          return (
            <button key={key} aria-label={`Row ${r+1} col ${c+1}`} onClick={() => toggleCell(r,c)} className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold rounded ${isSel ? 'bg-purple-200 text-purple-900' : 'bg-white text-slate-800 border border-slate-200'}`}>
              {ch}
            </button>
          );
        }))}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-700">Words</h4>
          <span className="text-xs text-slate-600">{found.size}/{words.length} found</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {words.map(w => {
            const isFound = found.has(w);
            return (
              <button
                key={w}
                onClick={() => toggleWordFound(w)}
                className={`inline-flex items-center justify-between gap-2 px-2 py-1 rounded-full text-xs border transition-colors ${isFound ? 'bg-green-100 text-green-800 border-green-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                aria-pressed={isFound}
                title={isFound ? 'Marked as found' : 'Mark as found'}
              >
                <span className="font-medium">{w}</span>
                <span className={`w-4 h-4 rounded-full border ${isFound ? 'bg-green-500 border-green-500' : 'border-slate-300'}`} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
