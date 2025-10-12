import React, { useEffect, useMemo, useRef, useState } from 'react';

type Difficulty = 'letters' | 'easy' | 'medium';

const LETTERS = 'asdfjkl;ghruityenwovcmbpqxz';
const EASY_WORDS = [
  'cat','dog','lion','bear','wolf','seal','frog','bird','fish','duck',
  'tree','leaf','rain','snow','wind','star','rock','wood','river','lake',
  'sun','moon','cloud','shell','seed','nest','hive','bush','moss','sand'
];
const MEDIUM_WORDS = [
  'panda','zebra','tiger','eagle','otter','rhino','snake','whale','camel','horse',
  'forest','garden','jungle','ocean','meadow','mountain','valley','planet','comet','galaxy',
  'petals','branch','pebble','stream','breeze','sunset','sunrise','shadow','thunder','blossom'
];

const ANIMALS = ['🦁','🐼','🦓','🐯','🐨','🐸','🐵','🦊','🐻','🐮','🐶','🐱','🐰','🐥','🐢'];

function pickRandom<T>(arr: readonly T[] | T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function TypingSafari() {
  const [difficulty, setDifficulty] = useState<Difficulty>('letters');
  const [target, setTarget] = useState<string>('');
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [currentAnimal, setCurrentAnimal] = useState<string>(() => pickRandom(ANIMALS));
  const [running, setRunning] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  const totalChars = target.length;
  const progress = totalChars > 0 ? Math.min(1, typedIndex / totalChars) : 0;

  const seconds = useMemo(() => {
    const end = finishedAt ?? (running && startedAt ? nowTs : null);
    if (!startedAt) return 0;
    if (!end) return (Date.now() - startedAt) / 1000;
    return (end - startedAt) / 1000;
  }, [startedAt, finishedAt, running, nowTs]);

  const wpm = useMemo(() => {
    if (!seconds) return 0;
    const words = Math.max(1, typedIndex / 5);
    return Math.round((words / seconds) * 60);
  }, [typedIndex, seconds]);

  function generateTarget(d: Difficulty): string {
    if (d === 'letters') {
      let out = '';
      for (let i = 0; i < 10; i++) out += pickRandom(LETTERS);
      return out;
    }
    if (d === 'easy') return pickRandom(EASY_WORDS);
    return pickRandom(MEDIUM_WORDS);
  }

  function startRound() {
    // Resume if a target exists and not finished
    if (target && typedIndex < target.length) {
      setFinishedAt(null);
      setRunning(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    // Otherwise start a new round
    setTarget(generateTarget(difficulty));
    setTypedIndex(0);
    setMistakes(0);
    const t = Date.now();
    setStartedAt(t);
    setNowTs(t);
    setFinishedAt(null);
    setRunning(true);
    setCurrentAnimal(pickRandom(ANIMALS));
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function nextRound() {
    setTarget(generateTarget(difficulty));
    setTypedIndex(0);
    setMistakes(0);
    const t = Date.now();
    setStartedAt(t);
    setNowTs(t);
    setFinishedAt(null);
    setRunning(true);
    setCurrentAnimal(pickRandom(ANIMALS));
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function stopRound() {
    setRunning(false);
    setFinishedAt(Date.now());
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!running || !target) { e.target.value = ''; return; }
    const ch = val.slice(-1);
    e.target.value = '';
    if (!ch) return;
    const expected = target.charAt(typedIndex);
    if (ch.toLowerCase() === expected.toLowerCase()) {
      const next = typedIndex + 1;
      setTypedIndex(next);
      if (next >= target.length) {
        stopRound();
      }
    } else {
      setMistakes((m) => m + 1);
    }
  }

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!running || !target) return;
      // If the hidden input is focused (desktop/mobile), let its onChange handler handle typing
      if (document.activeElement === inputRef.current) return;
      if (ev.key.length !== 1) return;
      const expected = target.charAt(typedIndex);
      const ch = ev.key;
      if (ch.toLowerCase() === expected.toLowerCase()) {
        const next = typedIndex + 1;
        setTypedIndex(next);
        if (next >= target.length) {
          stopRound();
        }
      } else {
        setMistakes((m) => m + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, target, typedIndex]);

  // Tick timer while running so Time updates even without typing
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNowTs(Date.now()), 200);
    return () => clearInterval(id);
  }, [running]);

  const totalInputs = Math.max(typedIndex + mistakes, 1);
  const accuracy = totalChars > 0 ? Math.max(0, Math.min(100, Math.round((typedIndex / totalInputs) * 100))) : 100;

  const steps = Math.max(1, totalChars);
  const position = Math.min(steps - 1, Math.floor(progress * steps));

  const denom = Math.max(1, steps - 1);
  const leftPercent = Math.min(100, Math.max(0, (position / denom) * 100));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-slate-900 border border-slate-200 shadow-sm" onClick={() => inputRef.current?.focus()}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {running ? (
            <button onClick={stopRound} className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm">Pause</button>
          ) : (
            <button onClick={startRound} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm">{target && typedIndex > 0 && typedIndex < totalChars ? 'Resume' : 'Start'}</button>
          )}
          <button onClick={nextRound} className="px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-sm">Next</button>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="px-2 py-1 border border-slate-300 rounded-md text-sm"
            aria-label="Difficulty"
          >
            <option value="letters">Letters</option>
            <option value="easy">Easy words</option>
            <option value="medium">Medium words</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Ages 7–12</span>
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Typing</span>
        </div>
      </div>

      {/* Success banner at top */}
      {!running && typedIndex > 0 && typedIndex >= totalChars && (
        <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-emerald-800" role="status">
          ✅ Great job! Your animal made it across.
        </div>
      )}

      {/* River track with stepping stones */}
      <div className="mb-6">
        <div className="h-28 rounded-xl bg-gradient-to-b from-sky-100 to-sky-200 border border-sky-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pattern-dots" />
          <div className="absolute inset-x-4 bottom-4 grid" style={{ gridTemplateColumns: `repeat(${steps}, minmax(0,1fr))`, gap: '8px' }}>
            {Array.from({ length: steps }).map((_, i) => (
              <div key={i} className={`h-8 rounded-full ${i <= position ? 'bg-emerald-300' : 'bg-white/70'} border border-emerald-400`} />
            ))}
          </div>
          <div className="absolute inset-x-4 top-4">
            <div className="relative w-full">
              <div className="text-3xl select-none absolute" style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}>
                <span role="img" aria-label="animal">{currentAnimal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target word - polished UI */}
      <div className="mb-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm" onClick={() => inputRef.current?.focus()}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-slate-700">Type this</div>
            <div className="text-xs text-slate-500">{typedIndex}/{totalChars}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {target
              ? target.split('').map((c, i) => {
                  const base = 'inline-flex items-center justify-center h-10 min-w-[2.25rem] px-2 rounded-lg border font-mono text-xl transition-colors duration-150';
                  const state = i < typedIndex
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : i === typedIndex
                      ? 'bg-yellow-50 text-slate-900 border-yellow-200 ring-2 ring-yellow-200'
                      : 'bg-white text-slate-600 border-slate-200';
                  return (
                    <span key={i} className={`${base} ${state}`}>{c}</span>
                  );
                })
              : (
                <div className="text-slate-500 text-sm">Press Start to begin</div>
              )}
          </div>
        </div>
      </div>

      {/* Hidden input to capture mobile typing */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        className="opacity-0 pointer-events-none h-0 w-0"
        onChange={handleInput}
        aria-hidden
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">WPM</div>
          <div className="text-xl font-semibold text-slate-900">{wpm}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">Accuracy</div>
          <div className="text-xl font-semibold text-slate-900">{accuracy}%</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">Mistakes</div>
          <div className="text-xl font-semibold text-slate-900">{mistakes}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">Time</div>
          <div className="text-xl font-semibold text-slate-900">{Math.floor(seconds)}s</div>
        </div>
      </div>

      
    </div>
  );
}
