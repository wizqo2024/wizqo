import * as React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { makeRng } from '@/utils/printableUtils';
import { WorksheetSectionWrapper, PremiumWorksheetBanner } from './PrintableShared';

type ReactNode = React.ReactNode;

interface SpecificWorksheetProps {
    seed: string
    variant: number
    showAnswersForDoc: (docId: string, render: () => ReactNode) => ReactNode
    docId?: string
}

export function OrderOfOperations({ seed, variant, showAnswersForDoc, docId = 'order-of-operations' }: SpecificWorksheetProps) {
    const { t } = useTranslation();
    const rng = makeRng(`${seed}|v${variant}|doc=${docId}`);

    function nextInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min; }

    // Helper to generate a basic PEMDAS problem
    const generateProblem = (type: string): { expression: string, answer: number } => {
        if (type === 'basic') {
            // A + B * C or A * B - C
            const a = nextInt(2, 10);
            const b = nextInt(2, 8);
            const c = nextInt(2, 6);
            if (rng() > 0.5) {
                return { expression: `${a} + ${b} × ${c}`, answer: a + (b * c) };
            } else {
                return { expression: `${a} × ${b} - ${c}`, answer: (a * b) - c };
            }
        }
        if (type === 'parentheses') {
            // (A + B) * C or A * (B - C)
            const a = nextInt(2, 12);
            const b = nextInt(2, 10);
            const c = nextInt(2, 5);
            if (rng() > 0.5) {
                return { expression: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
            } else {
                const b_mod = b + 5;
                return { expression: `${a} × (${b_mod} - 5)`, answer: a * (b_mod - 5) };
            }
        }
        if (type === 'exponents') {
            // A + B² or (A + B)² etc
            const base = nextInt(2, 5);
            const exp = 2;
            const val = Math.pow(base, exp);
            const extra = nextInt(2, 10);
            if (rng() > 0.5) {
                return { expression: `${base}² + ${extra}`, answer: val + extra };
            } else {
                return { expression: `${extra} × ${base}²`, answer: extra * val };
            }
        }
        if (type === 'multistep' || type === 'complex') {
            // (A + B) * C - D²
            const a = nextInt(1, 6);
            const b = nextInt(1, 6);
            const c = nextInt(2, 5);
            const d = nextInt(1, 4);
            if (rng() > 0.6) {
                // (A + B) * C - D
                return { expression: `(${a} + ${b}) × ${c} - ${d}`, answer: ((a + b) * c) - d };
            } else {
                // A * (B + C) / D (ensure divisibility)
                const factor = nextInt(2, 5);
                const B_plus_C = factor * nextInt(2, 5);
                const B = nextInt(1, B_plus_C - 1);
                const C = B_plus_C - B;
                const A = nextInt(2, 5);
                return {
                    expression: `${A} × (${B} + ${C}) ÷ ${factor}`,
                    answer: (A * (B + C)) / factor
                };
            }
        }
        // Fallback
        return { expression: `2 + 3 × 4`, answer: 14 };
    };

    const problemCount = docId.includes('fluency') ? 20 : 12;

    const problems = Array.from({ length: problemCount }).map((_, i) => {
        let p: { expression: string, answer: number } = { expression: '', answer: 0 };
        const id = nextInt(100, 999);

        // Map docId to a type for generation
        if (docId === 'pemdas-basic' || docId === 'pemdas-practice' || docId === 'order-of-operations' || docId === 'order-of-operations-pemdas') {
            p = generateProblem('basic');
        } else if (docId === 'pemdas-parentheses' || docId === 'pemdas-with-parentheses') {
            p = generateProblem('parentheses');
        } else if (docId === 'pemdas-exponents' || docId === 'pemdas-exponents-5th') {
            p = generateProblem('exponents');
        } else if (docId === 'pemdas-multistep') {
            p = generateProblem('multistep');
        } else if (docId === 'pemdas-advanced' || docId === 'pemdas-complex' || docId.includes('nested')) {
            if (docId === 'pemdas-complex' || docId === 'pemdas-advanced') {
                // Harder version for 5th/6th grade
                const r = rng();
                if (r < 0.3) {
                    const a = nextInt(2, 5); const b = nextInt(2, 5); const c = nextInt(2, 4);
                    p = { expression: `(${a} + ${b})² - ${c} × 2`, answer: Math.pow(a + b, 2) - (c * 2) };
                } else if (r < 0.6) {
                    const a = nextInt(10, 20); const b = nextInt(2, 5); const c = nextInt(2, 4);
                    p = { expression: `(${a} - ${b} × 2) + 3²`, answer: (a - b * 2) + 9 };
                } else {
                    p = generateProblem('multistep');
                }
            } else {
                p = generateProblem('multistep');
            }
        } else if (docId === 'pemdas-fluency') {
            // High speed, simpler
            p = rng() > 0.6 ? generateProblem('basic') : generateProblem('parentheses');
        } else if (docId === 'pemdas-mixed-review') {
            const r = rng();
            if (r < 0.25) p = generateProblem('basic');
            else if (r < 0.5) p = generateProblem('parentheses');
            else if (r < 0.75) p = generateProblem('exponents');
            else p = generateProblem('multistep');
        } else if (docId === 'pemdas-rules' || docId === 'pemdas-step-by-step') {
            // For these, we show a mix of basic and parentheses as they are instructional
            p = rng() > 0.5 ? generateProblem('basic') : generateProblem('parentheses');
        } else if (docId === 'pemdas-word-problems') {
            // Template based word problems
            const templates = [
                (n1: number, n2: number, n3: number) => ({ text: `Jenny has ${n1} boxes of crayons. Each box involves ${n2} crayons. She gives ${n3} crayons to her friend. How many does she have left?`, expr: `${n1} × ${n2} - ${n3}`, ans: (n1 * n2) - n3 }),
                (n1: number, n2: number, n3: number) => ({ text: `Tom buys ${n1} packs of trading cards with ${n2} cards in each pack. His mom gives him ${n3} more cards. How many cards does Tom have now?`, expr: `${n1} × ${n2} + ${n3}`, ans: (n1 * n2) + n3 }),
                (n1: number, n2: number, n3: number) => ({ text: `A baker made ${n1} trays of cookies. Each tray had ${n2} cookies. He then threw away ${n3} burnt cookies. How many good cookies are left?`, expr: `${n1} × ${n2} - ${n3}`, ans: (n1 * n2) - n3 }),
                (n1: number, n2: number, n3: number) => ({ text: `Sarah had ${n1} dollars. She bought ${n2} books that cost ${n3} dollars each. How much money does she have left?`, expr: `${n1} - ${n2} × ${n3}`, ans: n1 - (n2 * n3) }),
                (n1: number, n2: number, n3: number) => ({ text: `A group of ${n1} friends each bought ${n2} tickets. Later, ${n3} more friends bought 1 ticket each. How many tickets in total?`, expr: `${n1} × ${n2} + ${n3}`, ans: (n1 * n2) + n3 }),
            ];
            const tIdx = nextInt(0, templates.length - 1);
            const n1 = nextInt(5, 12); const n2 = nextInt(3, 9); const n3 = nextInt(2, 8);

            // Ensure positive result for subtraction checks
            let res;
            if (tIdx === 3) {
                // Money left case
                const cost = n2 * n3;
                const start = cost + nextInt(5, 20);
                res = templates[tIdx](start, n2, n3);
            } else {
                res = templates[tIdx](n1, n2, n3);
            }
            p = { expression: res.text, answer: res.ans };
        } else {
            // Default/Fallback
            const r = rng();
            if (r < 0.5) p = generateProblem('basic');
            else p = generateProblem('parentheses');
        }

        return { ...p, id };
    });

    let title = "Order of Operations";
    let desc = "Follow PEMDAS rules.";
    let bannerIcons = { bg1: "➕", bg2: "✖️", float1: "( )", float2: "²" };

    if (docId === 'pemdas-basic' || docId === 'order-of-operations' || docId === 'order-of-operations-pemdas') { title = "Basic PEMDAS"; desc = "Operations without parentheses or exponents."; }
    if (docId === 'pemdas-parentheses') { title = "PEMDAS with Parentheses"; desc = "Solving expressions inside grouping symbols first."; }
    if (docId === 'pemdas-practice') { title = "PEMDAS Practice Sheet"; desc = "Build fluency with PEMDAS rules through repeated practice."; }
    if (docId === 'pemdas-exponents') { title = "PEMDAS with Exponents"; desc = "Evaluating powers before multiplying or adding."; }
    if (docId === 'pemdas-word-problems') { title = "PEMDAS Word Problems"; desc = "Real-world scenarios using order of operations."; }
    if (docId === 'pemdas-multistep') { title = "Multi-Step PEMDAS"; desc = "Complex expressions with multiple order of operations steps."; }
    if (docId === 'pemdas-advanced') { title = "Advanced PEMDAS"; desc = "Tackling nested parentheses and complex exponents."; }
    if (docId === 'pemdas-complex') { title = "Complex PEMDAS"; desc = "Challenging expressions with nested groups and exponents."; }
    if (docId === 'pemdas-mixed-review') { title = "Mixed PEMDAS Review"; desc = "Comprehensive review of all order of operations concepts."; }
    if (docId === 'pemdas-fluency') { title = "PEMDAS Fluency"; desc = "Speed drills to master order of operations."; }
    if (docId === 'pemdas-rules') { title = "PEMDAS Rules & Practice"; desc = "Review the rules then practice your skills."; }
    if (docId === 'pemdas-step-by-step') { title = "Step-by-Step PEMDAS"; desc = "Guided practice with worked examples."; }

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={title}
            emoji="🔢"
            description={desc}
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title={title}
                subtitle="Mastering the Order"
                icons={bannerIcons}
                colors={{
                    bg: "bg-gradient-to-br from-violet-600 to-fuchsia-900",
                    border: "border-fuchsia-400",
                    pillBg: "bg-white/10",
                    pillBorder: "border-fuchsia-300/30",
                    pillText: "text-fuchsia-50",
                    accent: "text-yellow-400"
                }}
            />

            {(docId === 'pemdas-rules' || docId === 'pemdas-step-by-step') && (
                <div className="mb-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">PEMDAS Rules</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">P</div><div className="text-xs font-semibold text-slate-600">Parentheses</div></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">E</div><div className="text-xs font-semibold text-slate-600">Exponents</div></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">M</div><div className="text-xs font-semibold text-slate-600">Multiply</div></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">D</div><div className="text-xs font-semibold text-slate-600">Divide</div></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">A</div><div className="text-xs font-semibold text-slate-600">Add</div></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100"><div className="text-2xl font-bold text-purple-600">S</div><div className="text-xs font-semibold text-slate-600">Subtract</div></div>
                    </div>
                    <p className="mt-4 text-sm text-center text-purple-800 font-medium">Multiply & Divide from Left to Right! Add & Subtract from Left to Right!</p>
                </div>
            )}

            <div className={`grid gap-8 mt-8 ${docId === 'pemdas-word-problems' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
                {problems.map((p, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border-2 border-fuchsia-100 shadow-sm break-inside-avoid relative">
                        <div className="absolute top-2 right-2 text-xs text-slate-300">#{p.id}</div>
                        <div className={`text-xl ${docId === 'pemdas-word-problems' ? 'font-sans text-lg' : 'font-mono text-center'} mb-4`}>{p.expression}</div>

                        <div className="flex items-center gap-2">
                            {docId !== 'pemdas-word-problems' && <span className="text-slate-400 font-mono">=</span>}
                            <div className="h-12 w-full border-b-2 border-dashed border-slate-200"></div>
                        </div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-6 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl">
                    <div className="font-bold text-fuchsia-900 mb-4 text-lg">Answer Key</div>
                    <div className="grid grid-cols-4 gap-4 text-sm font-mono text-fuchsia-800">
                        {problems.map((p, i) => <div key={i}><span className="font-bold text-fuchsia-600">#{p.id}</span>: {p.answer}</div>)}
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
