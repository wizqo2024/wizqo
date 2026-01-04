
import React from 'react';
type ReactNode = React.ReactNode;
import { WorksheetSectionWrapper } from './PrintableShared';
import { makeRng, pick, shuffleArray } from '@/utils/printableUtils';
import { useTranslation } from '@/context/TranslationContext';

interface SpecificWorksheetProps {
    key?: string;
    docId: string;
    activeDocs?: string[];
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode;
    seed: string;
    variant: number;
}

// --- Number Line Addition ---
export function NumberLineAddition({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const problems = Array.from({ length: 6 }).map(() => {
        const start = Math.floor(rng() * 10) + 1; // 1-10
        const add = Math.floor(rng() * (20 - start - 1)) + 1; // Ensure sum <= 20
        return { start, add, sum: start + add };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Number Line Addition"
            emoji="📈"
            description="Use the number line to solve the addition problems!"
            problemCount={problems.length}
        >
            <div className="space-y-8">
                {problems.map((p, i) => (
                    <div key={i} className="p-4 border-2 border-slate-200 rounded-xl bg-white break-inside-avoid">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-slate-700">{p.start} + {p.add} = </span>
                            <div className="w-20 h-12 border-2 border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center">
                                {/* Answer box */}
                            </div>
                        </div>
                        {/* Number Line Visual */}
                        <div className="relative h-16 w-full">
                            <svg viewBox="0 0 420 60" className="w-full h-full">
                                {/* Main Line */}
                                <line x1="10" y1="40" x2="410" y2="40" stroke="#94a3b8" strokeWidth="2" />
                                {/* Ticks and Numbers */}
                                {Array.from({ length: 21 }).map((_, n) => {
                                    const x = 10 + n * 20;
                                    return (
                                        <g key={n}>
                                            <line x1={x} y1="35" x2={x} y2="45" stroke="#94a3b8" strokeWidth="2" />
                                            <text x={x} y="55" fontSize="10" textAnchor="middle" fill="#64748b" fontWeight="bold">{n}</text>
                                        </g>
                                    );
                                })}
                                {/* Arcs */}
                                {/* First jump (start) */}
                                <path
                                    d={`M 10 35 Q ${10 + (p.start * 20) / 2} 5 ${10 + p.start * 20} 35`}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                                {/* Second jump (add) */}
                                <path
                                    d={`M ${10 + p.start * 20} 35 Q ${10 + p.start * 20 + (p.add * 20) / 2} 5 ${10 + (p.sum) * 20} 35`}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                />
                                {/* Arrowheads */}
                                <circle cx={10 + p.sum * 20} cy="35" r="3" fill="#ef4444" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answers:</div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-emerald-800">
                        {problems.map((p, i) => <div key={i}>{p.start} + {p.add} = <strong>{p.sum}</strong></div>)}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Skip Counting ---
export function SkipCountingWorksheet({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const step = 2; // Default for 'skip-counting-by-2s'
    const problems = Array.from({ length: 5 }).map(() => {
        const start = (Math.floor(rng() * 5) + 1) * 2; // Start at 2, 4, 6, 8, or 10
        const sequence = Array.from({ length: 6 }).map((_, k) => start + k * step);
        const missingIndices = shuffleArray([1, 2, 3, 4], rng).slice(0, 3); // Remove 3 numbers
        return { sequence, missingIndices };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Skip Counting by 2s"
            emoji="🐰"
            description="Help the bunny hop! Fill in the missing numbers."
            problemCount={problems.length}
        >
            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-wrap justify-between items-center gap-2 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                        {p.sequence.map((num, idx) => {
                            const isMissing = p.missingIndices.includes(idx);
                            return (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-4 text-2xl font-bold bg-white
                                        ${isMissing ? 'border-dashed border-slate-300 text-slate-200' : 'border-indigo-200 text-indigo-600'}`}>
                                        {isMissing ? '' : num}
                                    </div>
                                    {idx < p.sequence.length - 1 && (
                                        <div className="text-xs text-slate-400 font-bold mt-1">+2</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded">
                    <div className="font-bold text-emerald-900 mb-2">Answers:</div>
                    <ul className="list-disc list-inside text-sm text-emerald-800">
                        {problems.map((p, i) => (
                            <li key={i}>{p.sequence.join(', ')}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Balance Equations ---
export function BalanceEquations({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const problems = Array.from({ length: 6 }).map(() => {
        const total = Math.floor(rng() * 6) + 5; // 5-10
        const known = Math.floor(rng() * (total - 1)) + 1; // 1 to total-1
        const unknown = total - known;
        return { total, known, unknown };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Balance the Scales"
            emoji="⚖️"
            description="Make both sides equal! Write the missing number."
            problemCount={problems.length}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-4 border-2 border-slate-200 rounded-xl bg-white flex flex-col items-center gap-4">
                        {/* Scale Visual */}
                        <div className="relative w-full h-32 flex items-end justify-center pb-2">
                            <div className="w-4 h-24 bg-slate-300 rounded-t-lg mx-auto"></div>
                            <div className="absolute bottom-16 h-2 w-48 bg-slate-400 rounded-full"></div>
                            {/* Left Pan (Total) */}
                            <div className="absolute left-1/4 bottom-4 flex flex-col items-center">
                                <div className="text-2xl font-bold text-slate-700 bg-slate-100 rounded-lg px-3 py-1 mb-2">{p.total}</div>
                                <div className="w-16 h-1 border-b-4 border-slate-400 rounded-[50%]"></div>
                                <div className="w-[1px] h-12 bg-slate-300"></div>
                            </div>
                            {/* Right Pan (Expr) */}
                            <div className="absolute right-1/4 bottom-4 flex flex-col items-center">
                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1 mb-2">
                                    <span className="text-xl font-bold text-slate-700">{p.known}</span>
                                    <span className="text-slate-400">+</span>
                                    <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded bg-white"></div>
                                </div>
                                <div className="w-16 h-1 border-b-4 border-slate-400 rounded-[50%]"></div>
                                <div className="w-[1px] h-12 bg-slate-300"></div>
                            </div>
                        </div>
                        <div className="text-lg font-bold text-slate-500">
                            {p.total} = {p.known} + <span className="inline-block w-8 border-b-2 border-slate-400"></span>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {problems.map((p, i) => `${p.total} = ${p.known} + ${p.unknown}`).join(' | ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Subtraction Stories ---
export function SubtractionStories({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const stories = [
        { subject: 'Annie', item: 'apples', emoji: '🍎' },
        { subject: 'Ben', item: 'balloons', emoji: '🎈' },
        { subject: 'Charlie', item: 'cars', emoji: '🚗' },
        { subject: 'Diana', item: 'donuts', emoji: '🍩' },
        { subject: 'Eddie', item: 'eggs', emoji: '🥚' },
    ];

    const problems = Array.from({ length: 4 }).map(() => {
        const story = pick(stories, rng);
        const total = Math.floor(rng() * 5) + 5; // 5-9
        const take = Math.floor(rng() * 3) + 1; // 1-3
        return { ...story, total, take, left: total - take };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Subtraction Stories"
            emoji="📖"
            description="Read the story and solve the math problem."
            problemCount={problems.length}
        >
            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 border-2 border-indigo-100 rounded-2xl bg-indigo-50/30">
                        <div className="text-lg mb-4 text-slate-800">
                            <strong>{p.subject}</strong> has <strong className="text-indigo-600">{p.total}</strong> {p.item}.
                            {p.subject === 'Diana' || p.subject === 'Annie' ? ' She' : ' He'} gives away <strong className="text-rose-500">{p.take}</strong> {p.item}.
                            How many are left?
                        </div>
                        <div className="flex gap-4 mb-4 flex-wrap">
                            {/* Visuals */}
                            <div className="flex gap-1 p-2 bg-white rounded-lg border border-slate-200">
                                {Array.from({ length: p.total }).map((_, k) => (
                                    <div key={k} className={`text-2xl relative ${k >= p.total - p.take ? 'opacity-50 grayscale' : ''}`}>
                                        {p.emoji}
                                        {k >= p.total - p.take && (
                                            <div className="absolute inset-0 flex items-center justify-center text-rose-600 font-bold text-3xl">×</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-700">
                            <div className="w-12 h-12 bg-white border-2 border-indigo-200 rounded flex items-center justify-center">{p.total}</div>
                            <span>-</span>
                            <div className="w-12 h-12 bg-white border-2 border-rose-200 rounded flex items-center justify-center">{p.take}</div>
                            <span>=</span>
                            <div className="w-12 h-12 bg-white border-2 border-dashed border-slate-300 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {problems.map((p, i) => `${p.total} - ${p.take} = ${p.left}`).join(' | ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Number Bonds (Making 10) ---
export function NumberBonds10({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const problems = Array.from({ length: 8 }).map(() => {
        const whole = 10;
        const part1 = Math.floor(rng() * 10) + 1; // 1-10
        const part2 = whole - part1;
        // Randomly hide part1 or part2
        const hidePart1 = rng() > 0.5;
        return { whole, part1, part2, hidePart1 };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Number Bonds to 10"
            emoji="🔗"
            description="Fill in the missing number to make 10!"
            problemCount={problems.length}
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-slate-200 rounded-xl">
                        {/* Start (Whole) */}
                        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-xl font-bold text-emerald-700">
                            {p.whole}
                        </div>
                        {/* Lines */}
                        <div className="flex gap-4 w-16 justify-center">
                            <div className="w-0.5 h-6 bg-slate-300 rotate-[-20deg]"></div>
                            <div className="w-0.5 h-6 bg-slate-300 rotate-[20deg]"></div>
                        </div>
                        {/* Parts */}
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold
                                ${p.hidePart1 ? 'border-dashed border-slate-400 bg-white' : 'border-blue-500 bg-blue-50 text-blue-700'}`}>
                                {p.hidePart1 ? '' : p.part1}
                            </div>
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold
                                ${!p.hidePart1 ? 'border-dashed border-slate-400 bg-white' : 'border-blue-500 bg-blue-50 text-blue-700'}`}>
                                {!p.hidePart1 ? '' : p.part2}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {problems.map((p, i) => `(Missing: ${p.hidePart1 ? p.part1 : p.part2})`).join(', ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Count & Write to 30 ---
export function CountWrite30({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const items = ['⭐', '🍎', '🎈', '🍪', '✏️'];
    const problems = Array.from({ length: 4 }).map(() => {
        const count = Math.floor(rng() * 11) + 20; // 20-30
        const item = items[Math.floor(rng() * items.length)];
        return { count, item };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Count and Write (to 30)"
            emoji="📝"
            description="Count the objects and write the total number."
            problemCount={problems.length}
        >
            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="p-4 border-2 border-slate-200 rounded-xl bg-white flex flex-col md:flex-row items-center gap-4 break-inside-avoid">
                        <div className="flex-1 flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg justify-center md:justify-start">
                            {Array.from({ length: p.count }).map((_, k) => (
                                <span key={k} className="text-xl">{p.item}</span>
                            ))}
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[100px]">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">How many?</span>
                            <div className="w-16 h-12 border-2 border-slate-300 rounded bg-white shadow-inner flex items-center justify-center text-2xl font-handwriting text-slate-400">
                                {/* Blank for writing */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {problems.map((p, i) => `${p.count}`).join(', ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Missing Numbers to 50 ---
export function MissingNumbers50({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const grid = Array.from({ length: 50 }, (_, i) => {
        const num = i + 1;
        const hide = rng() > 0.6; // Hide ~40% of numbers
        return { num, hide };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Number Grid Challenge (1-50)"
            emoji="🔢"
            description="Fill in the missing numbers on the grid."
            problemCount={1}
        >
            <div className="grid grid-cols-10 gap-1 md:gap-2 max-w-2xl mx-auto border-2 border-slate-800 p-2 bg-slate-100 rounded-lg">
                {grid.map((cell, i) => (
                    <div key={i} className={`
                        aspect-square flex items-center justify-center rounded text-sm md:text-xl font-bold border border-slate-300
                        ${cell.hide ? 'bg-white text-transparent' : 'bg-white text-slate-800'}
                    `}>
                        {cell.hide ? '' : cell.num}
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <p>All missing numbers should be filled in sequentially 1-50.</p>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Doubles Facts ---
export function DoublesFacts({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`); // Used for stability if needed, though data is static-ish
    // Fixed visual doubles concepts
    const concepts = [
        { num: 1, label: 'eyes on a face', emoji: '👀', count: 2 },
        { num: 2, label: 'wheels on a car', emoji: '🚗', count: 4 },
        { num: 3, label: 'legs on an insect (per side)', emoji: '🐞', count: 6 },
        { num: 4, label: 'spider legs (per side)', emoji: '🕷️', count: 8 },
        { num: 5, label: 'fingers on hands', emoji: '👐', count: 10 },
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Doubles Delight"
            emoji="👯"
            description="Add the doubles! Use the pictures to help you."
            problemCount={concepts.length}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {concepts.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-2 border-purple-100 rounded-xl bg-purple-50 break-inside-avoid">
                        <div className="text-4xl">{c.emoji}</div>
                        <div className="flex-1">
                            <div className="text-sm text-purple-800 font-bold mb-1 uppercase">{c.label}</div>
                            <div className="flex items-center gap-2 text-2xl font-bold text-slate-700">
                                <span>{c.num}</span>
                                <span>+</span>
                                <span>{c.num}</span>
                                <span>=</span>
                                <div className="w-12 h-10 border-2 border-purple-300 bg-white rounded flex items-center justify-center shadow-inner"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {concepts.map(c => `${c.num} + ${c.num} = ${c.num * 2}`).join(', ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

// --- Picture Addition ---
export function PictureAddition10({ docId, showAnswersForDoc, seed, variant }: SpecificWorksheetProps) {
    const rng = makeRng(`${seed}-${docId}-${variant}`);
    const items = ['🧁', '🐱', '🦋', '⚽', '🍌'];
    const problems = Array.from({ length: 5 }).map(() => {
        const item = items[Math.floor(rng() * items.length)];
        const a = Math.floor(rng() * 5) + 1; // 1-5
        const b = Math.floor(rng() * 5) + 1; // 1-5
        return { item, a, b, sum: a + b };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Picture Addition"
            emoji="🖼️"
            description="Count the pictures to find the sum."
            problemCount={problems.length}
        >
            <div className="space-y-6">
                {problems.map((p, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center gap-4 p-4 border-2 border-slate-200 rounded-xl bg-white break-inside-avoid">
                        {/* Group A */}
                        <div className="flex gap-1 p-2 bg-blue-50 rounded-lg border border-blue-100">
                            {Array.from({ length: p.a }).map((_, k) => <span key={k} className="text-2xl">{p.item}</span>)}
                        </div>
                        <div className="text-2xl font-bold text-slate-400">+</div>
                        {/* Group B */}
                        <div className="flex gap-1 p-2 bg-blue-50 rounded-lg border border-blue-100">
                            {Array.from({ length: p.b }).map((_, k) => <span key={k} className="text-2xl">{p.item}</span>)}
                        </div>
                        <div className="text-2xl font-bold text-slate-400">=</div>
                        {/* Answer */}
                        <div className="w-16 h-12 border-2 border-slate-300 rounded bg-white shadow-inner flex items-center justify-center text-xl"></div>
                    </div>
                ))}
            </div>
            {showAnswersForDoc(docId, () => (
                <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 rounded text-sm text-emerald-800">
                    <strong>Answers:</strong> {problems.map(p => `${p.a} + ${p.b} = ${p.sum}`).join(', ')}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
