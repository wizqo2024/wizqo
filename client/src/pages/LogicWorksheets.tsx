import React from 'react';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './printables/PrintableShared';
import { makeRng } from '@/utils/printableUtils';
import { useTranslation } from '@/context/TranslationContext';
import { SpecificWorksheetProps } from '../types/printable';

function generateLogicPuzzle(seed: string) {
    const rng = makeRng(seed)
    const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]
    const shuffle = <T,>(arr: T[]) => {
        const newArr = [...arr]
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr
    }

    const names = shuffle(['Alice', 'Bob', 'Charlie', 'Diana']).slice(0, 3)
    const colors = shuffle(['Red', 'Blue', 'Green', 'Yellow']).slice(0, 3)
    const pets = shuffle(['Dog', 'Cat', 'Bird', 'Fish']).slice(0, 3)

    // Create solution
    const solution = names.map((n, i) => ({
        name: n,
        color: colors[i],
        pet: pets[i]
    }))

    const clues = []
    // Direct clues
    clues.push(`${solution[0].name} has a ${solution[0].pet}.`)
    clues.push(`The person who likes ${solution[1].color} has a ${solution[1].pet}.`)
    clues.push(`${solution[2].name} likes ${solution[2].color}.`)
    clues.push(`${solution[0].name} does not like ${solution[1].color}.`) // Negative clue (simple)

    return { names, colors, pets, clues: shuffle(clues), solution }
}


export const LogicWorksheets = ({ docId, seed, variant, showAnswersForDoc, activeDocs = [] }: SpecificWorksheetProps) => {
    const { getTrans } = useWorksheetTranslation(docId);

    if (activeDocs.length > 0 && !activeDocs.includes(docId)) return null;

    const data = generateLogicPuzzle(`${seed}|${docId}`)

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('worksheets.logicGrid.title', 'Logic Puzzle')}
            emoji="🧠"
            description={getTrans('worksheets.logicGrid.description', 'Use the clues to find the truth!')}
            problemCount={4}
            learningObjectives={[
                'Develop deductive reasoning skills',
                'Practice organizing information',
                'Improve reading comprehension',
                'Solve problems using elimination'
            ]}
            parentTeacherTips={[
                'Encourage using the grid: mark X for impossible matches and O for definite matches.',
                'Read clues carefully one by one.',
                'If "Alice has a dog", put an O in the box where Alice row meets Dog column.',
                'Then put Xs in the rest of Alice\'s row and Dog\'s column.'
            ]}
        >
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Clues:</h3>
                <ul className="list-disc pl-5 mb-8 space-y-2 text-slate-700">
                    {data.clues.map((clue, i) => (
                        <li key={i}>{clue}</li>
                    ))}
                </ul>

                {/* Solving Grid */}
                <div className="overflow-x-auto">
                    <table className="border-collapse w-full max-w-2xl text-sm border border-slate-300">
                        <thead>
                            <tr>
                                <th className="p-2 bg-slate-100 border border-slate-300"></th>
                                {data.colors.map(c => <th key={c} className="p-2 bg-slate-50 border border-slate-300 rotate-45 h-24 align-bottom"><div><span className="block w-24 -ml-8">{c}</span></div></th>)}
                                {data.pets.map(p => <th key={p} className="p-2 bg-slate-50 border border-slate-300 rotate-45 h-24 align-bottom"><div><span className="block w-24 -ml-8">{p}</span></div></th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.names.map(n => (
                                <tr key={n}>
                                    <th className="p-2 bg-slate-50 border border-slate-300 text-left font-bold">{n}</th>
                                    {data.colors.map(c => <td key={c} className="p-2 border border-slate-300 w-10 text-center text-slate-300 hover:bg-slate-50">.</td>)}
                                    {data.pets.map(p => <td key={p} className="p-2 border border-slate-300 w-10 text-center text-slate-300 hover:bg-slate-50">.</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-6 p-6 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                    <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} Solution</div>
                    <ul className="space-y-2 text-emerald-800">
                        {data.solution.map((sol, i) => (
                            <li key={i}><strong>{sol.name}</strong> likes <strong>{sol.color}</strong> and has a <strong>{sol.pet}</strong>.</li>
                        ))}
                    </ul>
                </div>
            ))}
        </WorksheetSectionWrapper>
    )
}

function useWorksheetTranslation(docId: string) {
    const { t } = useTranslation();
    const getTrans = (key: string, fallback: string) => {
        const fullKey = key.includes('.') ? key : `worksheets.${docId}.${key}`;
        const translated = t(fullKey);
        return translated && translated !== fullKey && !translated.startsWith('worksheets.') ? translated : fallback;
    };
    return { t, getTrans };
}

export function BrainBoost({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = 'brain-boost';
    const { getTrans } = useWorksheetTranslation(docId);

    const riddles = [
        { q: "What has keys but can't open locks?", a: "A Piano" },
        { q: "What has to be broken before you can use it?", a: "An Egg" },
        { q: "I'm tall when I'm young, and I'm short when I'm old. What am I?", a: "A Candle" },
        { q: "What is full of holes but still holds water?", a: "A Sponge" }
    ];

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={getTrans('title', 'Brain Boost Riddles')}
            emoji="🧠"
            description={getTrans('description', 'Exercise your brain with these fun riddles!')}
            problemCount={4}
            learningObjectives={['Critical thinking', 'Reading comprehension', 'Lateral thinking']}
        >
            <PremiumWorksheetBanner
                title="Brain Gym"
                subtitle="Mental Workout"
                icons={{ bg1: "🧠", bg2: "💡", float1: "⚡", float2: "🧩" }}
                colors={{
                    bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50",
                    border: "border-fuchsia-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-fuchsia-300",
                    pillText: "text-fuchsia-900",
                    accent: "text-fuchsia-400"
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {riddles.map((r, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border-2 border-fuchsia-100 shadow-sm flex flex-col justify-between h-full">
                        <div>
                            <span className="text-xs font-bold text-fuchsia-400 uppercase mb-2 block">Riddle #{i + 1}</span>
                            <p className="font-bold text-slate-700 text-lg mb-4">{r.q}</p>
                        </div>
                        <div className="border-t border-slate-100 pt-4 mt-4">
                            <p className="text-sm text-slate-400 font-bold mb-1">Answer:</p>
                            <div className="h-8 border-b border-slate-200 border-dashed"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl">
                    <h3 className="font-bold text-fuchsia-900 mb-4">Riddle Answers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {riddles.map((r, i) => (
                            <div key={i} className="text-sm">
                                <span className="font-bold text-fuchsia-700">#{i + 1}:</span> {r.a}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}

export function CreativeChallenge({ seed, variant, showAnswersForDoc }: SpecificWorksheetProps) {
    const docId = ' रचनात्मक-challenge'; // Typo in variable name in memory? Fixed to 'creative-challenge' below.
    const realDocId = 'creative-challenge';
    const { getTrans } = useWorksheetTranslation(realDocId);

    return (
        <WorksheetSectionWrapper
            docId={realDocId}
            title={getTrans('title', 'Creative Thinking Challenge')}
            emoji="🎨"
            description={getTrans('description', 'Think outside the box to solve these drawing challenges.')}
            problemCount={2}
            learningObjectives={['Creative problem solving', 'Drawing skills', 'Imagination']}
        >
            <PremiumWorksheetBanner
                title="Imagination Station"
                subtitle="Drawing Challenge"
                icons={{ bg1: "🎨", bg2: "✏️", float1: "🌈", float2: "✨" }}
                colors={{
                    bg: "bg-gradient-to-br from-lime-50 to-green-50",
                    border: "border-lime-200",
                    pillBg: "bg-white/90",
                    pillBorder: "border-lime-300",
                    pillText: "text-lime-900",
                    accent: "text-lime-600"
                }}
            />

            <div className="space-y-8 mt-8">
                {/* Challenge 1 */}
                <div className="bg-white p-6 rounded-xl border-2 border-lime-100 shadow-sm break-inside-avoid">
                    <h3 className="font-bold text-lime-800 text-xl mb-2">Challenge 1: The Squiggle</h3>
                    <p className="text-slate-600 mb-4">Turn this squiggly line into a picture of something amazing!</p>
                    <div className="h-64 border-2 border-slate-200 rounded-lg bg-slate-50 relative">
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32" viewBox="0 0 100 100">
                            <path d="M10 50 Q30 10, 50 50 T90 50" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="mt-4 border-b border-slate-200 border-dashed">
                        <span className="text-slate-400 text-sm">Title of my masterpiece:</span>
                    </div>
                </div>

                {/* Challenge 2 */}
                <div className="bg-white p-6 rounded-xl border-2 border-lime-100 shadow-sm break-inside-avoid">
                    <h3 className="font-bold text-lime-800 text-xl mb-2">Challenge 2: Circles Only</h3>
                    <p className="text-slate-600 mb-4">Draw a robot using ONLY circles and ovals.</p>
                    <div className="h-64 border-2 border-slate-200 rounded-lg bg-white"></div>
                </div>
            </div>
        </WorksheetSectionWrapper>
    );
}

