import React from 'react';
import { WorksheetSectionWrapper } from './printables/PrintableShared';
import { makeRng } from '@/utils/printableUtils';

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

interface LogicWorksheetsProps {
    docId: string;
    commonProps: {
        activeDocs: string[];
        showAnswers: boolean;
        docTitle: string;
        effectiveSeed: string;
        variant: number;
        showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
        t: (key: string, fallback?: string) => string;
        getTrans: (key: string, fallback?: string) => string;
        language: string;
    };
}

export const LogicWorksheets: React.FC<LogicWorksheetsProps> = ({ docId, commonProps }) => {
    const { activeDocs, effectiveSeed, variant, showAnswersForDoc, getTrans } = commonProps;

    if (!activeDocs.includes('logic-grid')) return null;

    const data = generateLogicPuzzle(`${effectiveSeed}|${docId}`)

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
