import React, { useEffect, useMemo, useState } from 'react';

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
    }
  }, [found, words.length, best, time]);

  const newPuzzle = () => {
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select value={theme} onChange={(e) => { setTheme(e.target.value as any); setGrid(generateGrid(THEMES[e.target.value as any])); setSelected(new Set()); setFound(new Set()); setTime(0); setRunning(true); }} className="border rounded-lg px-2 py-1">
          <option>Animals</option>
          <option>Space</option>
        </select>
        <span className="text-slate-700">Time: {time}s</span>
        <span className="text-slate-500">Best: {best ?? '-'}s</span>
        <button onClick={newPuzzle} className="ml-auto px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700">New Puzzle</button>
      </div>
      <div className="grid grid-cols-12 gap-1 select-none">
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
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Words</h4>
        <div className="flex flex-wrap gap-2">
          {words.map(w => (
            <span key={w} className={`px-2 py-1 rounded text-xs border ${found.has(w) ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
