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

    const problems = Array.from({ length: 12 }).map(() => {
        let expression = '';
        let answer = 0;

        if (docId === 'pemdas-basic') {
            // A + B * C or A * B - C
            const a = nextInt(2, 10);
            const b = nextInt(2, 8);
            const c = nextInt(2, 6);
            if (rng() > 0.5) {
                expression = `${a} + ${b} × ${c}`;
                answer = a + (b * c);
            } else {
                expression = `${a} × ${b} - ${c}`;
                answer = (a * b) - c;
            }
        } else if (docId === 'pemdas-parentheses') {
            // (A + B) * C or A * (B - C)
            const a = nextInt(2, 12);
            const b = nextInt(2, 10);
            const c = nextInt(2, 5);
            if (rng() > 0.5) {
                expression = `(${a} + ${b}) × ${c}`;
                answer = (a + b) * c;
            } else {
                expression = `${a} × (${b + 5} - 5)`; // Ensure B-C is simple
                answer = a * b;
            }
        } else {
            // General mixed
            const a = nextInt(2, 10);
            const b = nextInt(2, 5);
            const c = nextInt(10, 20);
            expression = `${c} + ${a} × ${b}`;
            answer = c + (a * b);
        }

        return { expression, answer };
    });

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title="Order of Operations"
            emoji="🔢"
            description="Follow the rules of PEMDAS to solve these expressions."
            problemCount={problems.length}
        >
            <PremiumWorksheetBanner
                title="PEMDAS Power"
                subtitle="Mastering the Order of Operations"
                icons={{ bg1: "➕", bg2: "✖️", float1: "括号", float2: "🔢" }}
                colors={{
                    bg: "bg-gradient-to-br from-violet-600 to-fuchsia-900",
                    border: "border-fuchsia-400",
                    pillBg: "bg-white/10",
                    pillBorder: "border-fuchsia-300/30",
                    pillText: "text-fuchsia-50",
                    accent: "text-yellow-400"
                }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {problems.map((p, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border-2 border-fuchsia-100 shadow-sm break-inside-avoid">
                        <div className="text-xl font-mono mb-4 text-center">{p.expression} = ____</div>
                        <div className="h-16 border border-dashed border-fuchsia-50 rounded bg-slate-50/50"></div>
                    </div>
                ))}
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-8 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded grid grid-cols-4 gap-2 text-sm font-mono text-fuchsia-900">
                    {problems.map((p, i) => <div key={i}>{i + 1}: {p.answer}</div>)}
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
