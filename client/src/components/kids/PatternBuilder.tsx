import React, { useEffect, useMemo, useRef, useState } from 'react';

// Pattern Builder (Simon-like) – memorize and repeat colored tiles
// MVP: 4 tiles, 3 lives, timer, sounds, level-up, replay pattern once per level

const TILE_SET = [
  { id: 'red', label: 'Red', color: '#ef4444', emoji: '🔴' },
  { id: 'green', label: 'Green', color: '#10b981', emoji: '🟢' },
  { id: 'blue', label: 'Blue', color: '#3b82f6', emoji: '🔵' },
  { id: 'yellow', label: 'Yellow', color: '#f59e0b', emoji: '🟡' },
];

type TileId = typeof TILE_SET[number]['id'];

type GameState = 'idle' | 'playingSequence' | 'waitingInput' | 'success' | 'fail' | 'gameover';

export default function PatternBuilder() {
  const [sequence, setSequence] = useState<TileId[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [state, setState] = useState<GameState>('idle');
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [replayAvailable, setReplayAvailable] = useState(true);
  const [timerMs, setTimerMs] = useState(0);
  const [timerMaxMs, setTimerMaxMs] = useState(10000);
  const rafRef = useRef<number | null>(null);
  const seqPlayRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const bestKey = 'kids_pattern_best_level';
  const best = useMemo(() => {
    const raw = localStorage.getItem(bestKey);
    return raw ? Number(raw) : null;
  }, []);

  function unlockAudio() {
    if (!soundOn) return;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {}
    }
  }

  function playTone(freq: number, duration = 0.18) {
    if (!soundOn) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.001;
    osc.connect(gain); gain.connect(ctx.destination);
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.08, duration));
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  function playCorrect() { playTone(880, 0.15); }
  function playWrong() {
    if (!soundOn) return;
    const ctx = audioCtxRef.current; if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(420, ctx.currentTime);
    gain.gain.value = 0.001; osc.connect(gain); gain.connect(ctx.destination);
    const t = ctx.currentTime; osc.frequency.linearRampToValueAtTime(160, t + 0.14);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.start(t); osc.stop(t + 0.18);
  }
  function playVictory() {
    if (!soundOn) return;
    const ctx = audioCtxRef.current; if (!ctx) return;
    const notes = [523.25, 659.25, 783.99];
    const now = ctx.currentTime;
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = f; gain.gain.value = 0.001;
      osc.connect(gain); gain.connect(ctx.destination);
      const t0 = now + i * 0.09;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);
      osc.start(t0); osc.stop(t0 + 0.26);
    });
  }

  function randomTile(): TileId {
    const idx = Math.floor(Math.random() * TILE_SET.length);
    return TILE_SET[idx]!.id;
  }

  function startGame() {
    unlockAudio();
    const startLen = 3;
    const seq: TileId[] = Array.from({ length: startLen }, randomTile);
    setSequence(seq);
    setUserIndex(0);
    setLevel(1);
    setLives(3);
    setReplayAvailable(true);
    setTimerMaxMs(10000);
    setTimerMs(10000);
    setState('playingSequence');
  }

  function nextLevel() {
    playVictory();
    const nextSeq = [...sequence, randomTile()];
    setSequence(nextSeq);
    setUserIndex(0);
    setLevel((l) => l + 1);
    setReplayAvailable(true);
    const nextTimer = Math.max(6000, 10000 - level * 400);
    setTimerMaxMs(nextTimer);
    setTimerMs(nextTimer);
    setState('playingSequence');
  }

  function endGame() {
    setState('gameover');
    if (!best || level - 1 > best) {
      localStorage.setItem(bestKey, String(level - 1));
    }
  }

  // Playback sequence
  useEffect(() => {
    if (state !== 'playingSequence') return;
    // Lock input and flash tiles in order
    let i = 0;
    setHighlightIndex(null);
    const playStep = () => {
      if (i >= sequence.length) {
        setHighlightIndex(null);
        setState('waitingInput');
        return;
      }
      const tileId = sequence[i]!;
      const idx = TILE_SET.findIndex((t) => t.id === tileId);
      setHighlightIndex(idx);
      playTone(600 + idx * 100, 0.12);
      seqPlayRef.current = window.setTimeout(() => {
        setHighlightIndex(null);
        seqPlayRef.current = window.setTimeout(() => {
          i += 1; playStep();
        }, 180);
      }, 450);
    };
    playStep();
    return () => {
      if (seqPlayRef.current) { window.clearTimeout(seqPlayRef.current); seqPlayRef.current = null; }
    };
  }, [state, sequence]);

  // Timer countdown while waiting for input
  useEffect(() => {
    if (state !== 'waitingInput') { if (rafRef.current) cancelAnimationFrame(rafRef.current); return; }
    const start = performance.now();
    const startRemaining = timerMs;
    const loop = (now: number) => {
      const elapsed = now - start;
      const remaining = Math.max(0, startRemaining - elapsed);
      setTimerMs(remaining);
      if (remaining <= 0) {
        // time out counts as a fail
        handleFail();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [state]);

  function handleTileClick(idx: number) {
    if (state !== 'waitingInput') return;
    const expectedId = sequence[userIndex];
    const clickedId = TILE_SET[idx]!.id;
    setHighlightIndex(idx);
    setTimeout(() => setHighlightIndex(null), 150);
    if (clickedId === expectedId) {
      playCorrect();
      const next = userIndex + 1;
      if (next >= sequence.length) {
        setState('success');
        setTimeout(() => nextLevel(), 400);
      } else {
        setUserIndex(next);
      }
    } else {
      playWrong();
      handleFail();
    }
  }

  function handleFail() {
    setReplayAvailable(false);
    const remainLives = lives - 1;
    setLives(remainLives);
    if (remainLives <= 0) {
      endGame();
      return;
    }
    // reset input and allow retry on same level
    setUserIndex(0);
    setTimerMs(timerMaxMs);
    setState('playingSequence');
  }

  function replayPattern() {
    if (!replayAvailable || state === 'playingSequence') return;
    setReplayAvailable(false);
    setUserIndex(0);
    setTimerMs(timerMaxMs);
    setState('playingSequence');
  }

  const timerPct = Math.max(0, Math.min(100, (timerMs / timerMaxMs) * 100));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Ages 6–10</span>
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Memory</span>
        </div>
        <div className="flex items-center gap-2">
          {state === 'idle' || state === 'gameover' ? (
            <button onClick={startGame} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm">Start Game</button>
          ) : state === 'playingSequence' ? (
            <button disabled className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-sm">Playing…</button>
          ) : (
            <button onClick={replayPattern} disabled={!replayAvailable} className="px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-sm disabled:opacity-50">Replay pattern</button>
          )}
          <button onClick={() => { setSoundOn(v => !v); unlockAudio(); }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm" aria-pressed={soundOn}>
            {soundOn ? '🔊' : '🔈'}
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 rounded bg-slate-100 overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-[width] duration-75" style={{ width: `${timerPct}%` }} />
      </div>

      {/* Lives and level */}
      <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
        <div>Level: <span className="font-semibold text-slate-800">{level}</span>{best !== null ? <span className="ml-2 text-xs text-slate-500">Best: {best}</span> : null}</div>
        <div>Lives: {'❤'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}</div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-3 max-w-xs">
        {TILE_SET.map((t, i) => (
          <button
            key={t.id}
            onClick={() => handleTileClick(i)}
            style={{ backgroundColor: t.color + (highlightIndex === i ? 'cc' : '26') }}
            className={`h-24 w-24 rounded-2xl border ${highlightIndex === i ? 'border-slate-300 ring-2 ring-yellow-300' : 'border-slate-200'} flex flex-col items-center justify-center text-white font-semibold select-none`}
            aria-label={t.label}
          >
            <div className="text-2xl">{t.emoji}</div>
            <div className="text-xs mt-1 drop-shadow">{t.label}</div>
          </button>
        ))}
      </div>

      {state === 'gameover' && (
        <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-emerald-800">
          Awesome effort! You built <strong>{Math.max(0, level - 1)}</strong> patterns correctly!
        </div>
      )}

      {/* Try another game */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Try another game</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <a href="/kids/games/memory" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">🃏 Memory Match</a>
          <a href="/kids/games/word-search" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">🔤 Word Search</a>
          <a href="/kids/games/puzzle" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">🧩 Puzzle</a>
          <a href="/kids/games/typing" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">⌨️ Typing Safari</a>
        </div>
      </div>
    </div>
  );
}
