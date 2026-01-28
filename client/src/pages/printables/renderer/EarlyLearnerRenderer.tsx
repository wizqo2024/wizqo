import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import {
    SpotDifferenceWorksheet,
    ColorByNumberWorksheet,
    DesignMonsterWorksheet,
    DrawHalfWorksheet,
    HiddenObjectWorksheet,
    MazeFocusWorksheet,
    BookmarkTemplates,
    DotToDot1to20,
    CountingWorksheet,
    ComparisonWorksheet,
    PatternWorksheet,
    ShapeWorksheet,
    NumberRecognitionWorksheet,
    AnimalPack,
    ColoringWorksheet
} from '../KindergartenExtraWorksheets';
import { WorksheetSectionWrapper } from '../PrintableShared';
import ShadowMatchingWorksheetPage from '../../ShadowMatchingWorksheetPage';
import MatchFeelingWorksheetPage from '../../MatchFeelingWorksheetPage';
import CursiveAlphabetWorksheet from '../../worksheets/cursive/CursiveAlphabetWorksheet';
import { PreWritingTracingWorksheet as TracingRenderer } from '../TracingWorksheets'
import CursivePracticeWorksheet from '../../worksheets/cursive/CursivePracticeWorksheet';
import CapitalCursiveWorksheet from '../../worksheets/cursive/CapitalCursiveWorksheet';
import JoiningCursiveWorksheet from '../../worksheets/cursive/JoiningCursiveWorksheet';
import HybridHandwritingWorksheet from '../../worksheets/cursive/HybridHandwritingWorksheet';

// Props interface section
interface EarlyLearnerRendererProps {
    activeDocs: string[];
    seed: string;
    variant: number;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: (key: string) => string;
    getTrans: (key: string, fallback: string) => string;
    isPreview?: boolean; // New prop for preview mode
}

export const EarlyLearnerRenderer = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans, isPreview = false }: EarlyLearnerRendererProps) => {
    const numVariant = variant;
    return (
        <>
            {/* Kindergarten / Early Learning */}
            {activeDocs.includes('spot-difference') && (
                <SpotDifferenceWorksheet docId="spot-difference" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('color-by-number') && (
                <ColorByNumberWorksheet docId="color-by-number" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('design-monster') && (
                <DesignMonsterWorksheet docId="design-monster" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('draw-half') && (
                <DrawHalfWorksheet docId="draw-half" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('line-tracing') && (
                <TracingRenderer docId="line-tracing" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.includes('zigzag-lines') && (
                <TracingRenderer docId="zigzag-lines" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.includes('curve-tracing') && (
                <TracingRenderer docId="curve-tracing" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.includes('path-tracing') && (
                <TracingRenderer docId="path-tracing" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.includes('hidden-object') && (
                <HiddenObjectWorksheet docId="hidden-object" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('maze-focus') && (
                <MazeFocusWorksheet docId="maze-focus" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('bookmark-templates') && (
                <BookmarkTemplates docId="bookmark-templates" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('dot-to-dot-1-20') && (
                <DotToDot1to20 docId="dot-to-dot-1-20" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('animal-pack') && (
                <AnimalPack docId="animal-pack" seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {activeDocs.includes('match-object-to-shadow') && (
                <ShadowMatchingWorksheetPage />
            )}

            {activeDocs.includes('match-the-feeling') && (
                <MatchFeelingWorksheetPage />
            )}

            {activeDocs.includes('cursive-writing-alphabet-worksheets') && (
                <WorksheetSectionWrapper
                    docId="cursive-writing-alphabet-worksheets"
                    title="Cursive Writing Alphabet"
                    description="Practice writing the entire cursive alphabet with these comprehensive worksheets."
                    emoji={String.fromCodePoint(0x270D)}
                    orientation="l"
                >
                    <CursiveAlphabetWorksheet />
                </WorksheetSectionWrapper>
            )}
            {activeDocs.includes('cursive-writing-practice-sheets') && (
                <WorksheetSectionWrapper
                    docId="cursive-writing-practice-sheets"
                    title="Cursive Writing Practice"
                    description="Improve your cursive handwriting with daily practice sheets."
                    emoji={String.fromCodePoint(0x1F4DD)}
                    orientation="l"
                >
                    <CursivePracticeWorksheet />
                </WorksheetSectionWrapper>
            )}
            {activeDocs.includes('capital-cursive-writing-worksheets') && (
                <WorksheetSectionWrapper
                    docId="capital-cursive-writing-worksheets"
                    title="Capital Cursive Writing"
                    description="Master the art of writing capital cursive letters."
                    emoji={String.fromCodePoint(0x1F170)}
                    orientation="l"
                >
                    <CapitalCursiveWorksheet />
                </WorksheetSectionWrapper>
            )}
            {activeDocs.includes('joining-cursive-letters-worksheets') && (
                <WorksheetSectionWrapper
                    docId="joining-cursive-letters-worksheets"
                    title="Joining Cursive Letters"
                    description="Learn how to connect cursive letters smoothly."
                    emoji={String.fromCodePoint(0x1F517)}
                    orientation="l"
                >
                    <JoiningCursiveWorksheet />
                </WorksheetSectionWrapper>
            )}
            {activeDocs.includes('half-print-half-cursive-writing') && (
                <WorksheetSectionWrapper
                    docId="half-print-half-cursive-writing"
                    title="Half Print Half Cursive"
                    description="Bridge the gap between print and cursive writing styles."
                    emoji={String.fromCodePoint(0x2ABC)}
                    orientation="l"
                >
                    <HybridHandwritingWorksheet />
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('directed-drawing-animals') && (
                <WorksheetSectionWrapper
                    docId="directed-drawing-animals"
                    title="Directed Drawing: Animals"
                    emoji={String.fromCodePoint(0x1F43E)}
                    description="Follow each step to draw a fish silhouette using simple shapes. No face features (eyes, nose, mouth, ears)."
                    problemCount={6}
                    learningObjectives={[
                        'Follow step-by-step drawing instructions',
                        'Use simple shapes to create drawings',
                        'Practice fine motor skills'
                    ]}
                    parentTeacherTips={[
                        'Follow the steps in order',
                        'Use simple shapes like circles and triangles',
                        'Take your time with each step',
                        'Extension: Create your own step-by-step drawing'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-gradient-x mb-2" />
                    {/* Full-page, 6-step grid (2x3) with thick strokes for easy tracing */}
                    <svg viewBox="0 0 900 1200" className="w-full h-auto bg-white border border-slate-300 rounded">
                        <g fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Panel frames */}
                            <rect x="50" y="60" width="360" height="300" rx="16" />
                            <rect x="490" y="60" width="360" height="300" rx="16" />
                            <rect x="50" y="420" width="360" height="300" rx="16" />
                            <rect x="490" y="420" width="360" height="300" rx="16" />
                            <rect x="50" y="780" width="360" height="300" rx="16" />
                            <rect x="490" y="780" width="360" height="300" rx="16" />

                            {/* Step numbers */}
                            <text x="70" y="100" fontSize="28" fill="#111827">1</text>
                            <text x="510" y="100" fontSize="28" fill="#111827">2</text>
                            <text x="70" y="460" fontSize="28" fill="#111827">3</text>
                            <text x="510" y="460" fontSize="28" fill="#111827">4</text>
                            <text x="70" y="820" fontSize="28" fill="#111827">5</text>
                            <text x="510" y="820" fontSize="28" fill="#111827">6</text>

                            {/* Step 1 (panel 1): Body ellipse */}
                            <ellipse cx="230" cy="210" rx="130" ry="70" />
                            {/* Step 2 (panel 2): Add tail */}
                            <ellipse cx="670" cy="210" rx="130" ry="70" />
                            <polygon points="740,210 830,160 830,260" />
                            {/* Step 3 (panel 3): Dorsal fin */}
                            <ellipse cx="230" cy="570" rx="130" ry="70" />
                            <polygon points="260,520 320,490 300,540" />
                            <polygon points="740,210 830,160 830,260" opacity="0" />
                            {/* Step 4 (panel 4): Ventral fin */}
                            <ellipse cx="670" cy="570" rx="130" ry="70" />
                            <polygon points="700,620 760,650 740,600" />
                            <polygon points="740,570 830,520 830,620" opacity="0" />
                            {/* Step 5 (panel 5): Side fin */}
                            <ellipse cx="230" cy="930" rx="130" ry="70" />
                            <polygon points="160,930 110,960 160,990" />
                            {/* Step 6 (panel 6): Gentle stripes (no face) */}
                            <ellipse cx="670" cy="930" rx="130" ry="70" />
                            <path d="M600 900 C 640 880, 700 880, 740 900" />
                            <path d="M590 930 C 640 915, 700 915, 750 930" />
                            <path d="M610 960 C 650 980, 690 980, 730 960" />
                        </g>
                    </svg>
                    {showAnswersForDoc('directed-drawing-animals', () => (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="text-sm text-emerald-800">
                                Follow the 6 steps in order: 1) Draw body ellipse, 2) Add tail, 3) Add dorsal fin, 4) Add ventral fin, 5) Add side fin, 6) Add gentle stripes. Your fish should look like the final step!
                            </div>
                        </div>
                    ))}
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('cut-and-paste-crafts') && (
                <WorksheetSectionWrapper
                    docId="cut-and-paste-crafts"
                    title="Cut-and-Paste Paper Crafts"
                    emoji={String.fromCodePoint(0x2702)}
                    description="Point to or color how you feel today."
                    problemCount={1}
                    learningObjectives={[
                        'Identify and express feelings',
                        'Understand emotional states',
                        'Practice self-awareness'
                    ]}
                    parentTeacherTips={[
                        'Help children identify their feelings',
                        'All feelings are valid',
                        'Use this as a conversation starter',
                        'Extension: Talk about what makes you feel each way'
                    ]}
                >
                    <h2 className="text-lg font-bold text-slate-900">Cut-and-Paste Paper Crafts</h2>
                    <p className="text-slate-600 text-sm mb-3">Cut the parts and glue them in place. Color when finished.</p>
                    <svg viewBox="0 0 800 300" className="w-full h-auto bg-white border border-slate-300 rounded">
                        <g fill="none" stroke="#111827" strokeWidth="3.5">
                            <rect x="80" y="60" width="80" height="80" />
                            <circle cx="220" cy="100" r="40" />
                            <polygon points="320,60 380,140 260,140" />
                            <rect x="420" y="60" width="80" height="80" />
                            <rect x="510" y="70" width="30" height="60" />
                            <rect x="550" y="70" width="30" height="60" />
                        </g>
                    </svg>
                    {showAnswersForDoc('cut-and-paste-crafts', () => (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="text-sm text-emerald-800">
                                Cut out the shapes and glue them together to create your craft. Be creative with colors!
                            </div>
                        </div>
                    ))}
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('tangram-animals') && (
                <WorksheetSectionWrapper
                    docId="tangram-animals"
                    title="Tangram Animals (Cutouts)"
                    emoji={String.fromCodePoint(0x1F43E)}
                    description="Cut the shapes and arrange to make animal silhouettes. Glue the final shape on a clean sheet."
                    problemCount={5}
                    learningObjectives={[
                        'Identify and name geometric shapes',
                        'Practice spatial reasoning and problem-solving',
                        'Develop fine motor skills (cutting and arranging)',
                        'Understand how shapes can be combined to create new shapes'
                    ]}
                    parentTeacherTips={[
                        'Supervise scissor use for safety',
                        'Encourage children to try different arrangements',
                        'Ask: "What animal does this look like?"',
                        'Extension: Create your own tangram animals or objects',
                        'Practice spatial thinking by rotating and flipping shapes'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 animate-gradient-x mb-2" />
                    {/* Worked Example */}
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                        <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                        <div className="space-y-2 text-sm">
                            <div className="font-semibold text-base"><strong>Task:</strong> Make a cat using tangram pieces</div>
                            <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                                <div><strong>Step 1:</strong> Cut out all the tangram shapes carefully</div>
                                <div><strong>Step 2:</strong> Try arranging the shapes to make a cat shape</div>
                                <div><strong>Step 3:</strong> When you're happy with your animal, glue it on a clean sheet</div>
                                <div className="font-semibold text-blue-900"><strong>Answer:</strong> There are many ways to arrange the shapes - be creative!</div>
                                <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                        <svg viewBox="0 0 800 400" className="w-full h-auto bg-white border border-slate-300 rounded">
                            <g fill="none" stroke="#111827" strokeWidth="3.5">
                                <polygon points="100,50 200,50 200,150 100,150" />
                                <polygon points="220,50 270,100 220,150 170,100" />
                                <polygon points="300,50 350,50 350,150 300,150" />
                                <polygon points="380,50 430,100 380,150 330,100" />
                                <polygon points="460,50 560,50 560,150 460,150" />
                            </g>
                        </svg>
                    </div>
                    {/* Extension/Challenge Problems */}
                    <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                        <div className="space-y-2 text-sm text-purple-800">
                            <div>1. Can you make a different animal using the same shapes?</div>
                            <div>2. Try making a house, a tree, or a person with the tangram pieces</div>
                            <div>3. Draw your tangram creation and label the shapes you used</div>
                        </div>
                    </div>
                    {/* Self-Assessment */}
                    <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                        <div className="space-y-2 text-xs">
                            <div>{String.fromCharCode(0x2610)} I can identify the tangram shapes</div>
                            <div>{String.fromCharCode(0x2610)} I can arrange shapes to make animals</div>
                            <div>{String.fromCharCode(0x2610)} I can cut and glue carefully</div>
                        </div>
                        <div className="mt-3 text-xs">
                            <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 5
                        </div>
                        <div className="mt-2 text-xs">
                            <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                        </div>
                    </div>
                    {showAnswersForDoc('tangram-animals', () => (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="space-y-2 text-sm text-emerald-800">
                                <div>Tangram puzzles have many solutions! The goal is to use all 7 pieces to create different shapes.</div>
                                <div className="mt-2">Common animals you can make: cat, rabbit, bird, fish, horse, and more!</div>
                                <div className="text-xs text-emerald-700 mt-2">{String.fromCodePoint(0x279C)}</div>
                            </div>
                        </div>
                    ))}
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('ten-frames-1-20') && (() => {
                const numbers = Array.from({ length: 20 }, (_, n) => n + 1);
                return (
                    <WorksheetSectionWrapper
                        docId="ten-frames-1-20"
                        title="Ten Frames 1-20"
                        emoji={String.fromCodePoint(0x1F51F)}
                        description="Color the circles to match each number. Say how many are filled and how many are empty."
                        problemCount={numbers.length}
                        learningObjectives={[
                            'Recognize numbers 1-20',
                            'Understand number quantity using ten frames',
                            'Count and represent numbers visually',
                            'Build number sense and subitizing skills'
                        ]}
                        parentTeacherTips={[
                            'Ten frames help children see numbers as groups of 10',
                            'Encourage counting aloud while coloring',
                            'Ask: "How many filled? How many empty?"',
                            'For numbers 11-20, use two ten frames (one full, one partial)',
                            'Extension: Practice addition and subtraction using ten frames'
                        ]}
                    >
                        <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 animate-gradient-x mb-2" />
                        {/* Worked Example */}
                        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                            <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                            <div className="space-y-2 text-sm">
                                <div className="font-semibold text-base"><strong>Number:</strong> 7</div>
                                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                                    <div><strong>Step 1:</strong> Look at the number: 7</div>
                                    <div><strong>Step 2:</strong> Color 7 circles in the ten frame</div>
                                    <div><strong>Step 3:</strong> Count: 7 filled, 3 empty</div>
                                    <div className="font-semibold text-blue-900"><strong>Answer:</strong> Color 7 circles. Say "7 filled, 3 empty"</div>
                                    <div className="text-xs text-blue-700 mt-1">Tip: Double check your steps!</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                            {numbers.map((n) => (
                                <div key={n} className="break-inside-avoid">
                                    <svg viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                                        <text x="40" y="50" fontSize="36" fill="#111827">{n}</text>
                                        <g transform="translate(120,60)">
                                            {Array.from({ length: 10 }).map((__, i) => (
                                                <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                                            ))}
                                        </g>
                                        {n > 10 && (
                                            <g transform="translate(120,120)">
                                                {Array.from({ length: 10 }).map((__, i) => (
                                                    <rect key={i} x={(i % 5) * 40} y={Math.floor(i / 5) * 40} width="36" height="36" fill="none" stroke="#111827" />
                                                ))}
                                            </g>
                                        )}
                                    </svg>
                                </div>
                            ))}
                        </div>
                        {/* Extension/Challenge Problems */}
                        <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                            <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                            <div className="space-y-2 text-sm text-purple-800">
                                <div>1. Can you show 15 using ten frames? Color it!</div>
                                <div>2. How many ways can you make 10? (5+5, 6+4, 7+3...)</div>
                                <div>3. Draw your own ten frame and show the number 12</div>
                            </div>
                        </div>
                        {/* Self-Assessment */}
                        <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                            <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                            <div className="space-y-2 text-xs">
                                <div>{String.fromCodePoint(0x270F)}</div>
                                <div>{String.fromCharCode(0x2610)} I can show numbers using ten frames</div>
                                <div>{String.fromCharCode(0x2610)} I can count filled and empty spaces</div>
                            </div>
                            <div className="mt-3 text-xs">
                                <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / {numbers.length}
                            </div>
                            <div className="mt-2 text-xs">
                                <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                            </div>
                        </div>
                        {showAnswersForDoc('ten-frames-1-20', () => (
                            <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                                <div className="space-y-2 text-sm text-emerald-800">
                                    {numbers.map((n, i) => {
                                        const filled = n <= 10 ? n : 10;
                                        const empty = n <= 10 ? 10 - n : 0;
                                        const secondFilled = n > 10 ? n - 10 : 0;
                                        const secondEmpty = n > 10 ? 10 - (n - 10) : 0;
                                        return (
                                            <div key={i}>
                                                {i + 1}. <strong>{n}:</strong> {n <= 10
                                                    ? `${filled} filled, ${empty} empty (in one ten frame)`
                                                    : `First ten frame: 10 filled. Second ten frame: ${secondFilled} filled, ${secondEmpty} empty`}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-emerald-700 mt-3">
                                    Remember: For numbers 1-10, use one ten frame. For numbers 11-20, fill the first ten frame completely (10) and use the second ten frame for the remaining amount!
                                </div>
                            </div>
                        ))}
                    </WorksheetSectionWrapper>
                );
            })()}

            {activeDocs.includes('uppercase-lowercase-match') && (
                <WorksheetSectionWrapper
                    docId="uppercase-lowercase-match"
                    title="Uppercase & Lowercase Match"
                    emoji={String.fromCodePoint(0x1F524)}
                    description="Draw a line to match each uppercase letter with its lowercase pair. Say the sound out loud!"
                    problemCount={26}
                    learningObjectives={[
                        'Recognize uppercase and lowercase versions of letters',
                        'Practice matching letter pairs',
                        'Develop letter-name and sound recognition'
                    ]}
                    parentTeacherTips={[
                        'Point to the big letter (uppercase) and ask for its "little" partner (lowercase)',
                        'Help students say the sound of the letter as they match',
                        'Try to match letters they already know first',
                        'Extension: Find these letters in a book you read today'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x mb-2" />
                    {/* Worked Example */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg print:border print:bg-white">
                        <div className="font-semibold text-purple-900 mb-3 text-sm flex items-center gap-2">
                            <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                            <span>Example - Let's solve this together:</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="font-semibold text-base text-purple-900"><strong>Problem:</strong> Match the uppercase <span className="text-3xl text-indigo-700">"A"</span> and lowercase <span className="text-3xl text-purple-700">"a"</span></div>
                            <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                                <div className="flex items-center justify-center gap-8">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-indigo-700 mb-1">A</div>
                                        <div className="text-xs font-semibold text-indigo-500 italic">uppercase</div>
                                        <div className="mt-2 w-4 h-4 rounded-full bg-indigo-500 mx-auto"></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center relative h-16">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-full h-full" viewBox="0 0 100 40">
                                                <line x1="10" y1="20" x2="90" y2="20" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
                                                <circle cx="90" cy="20" r="3" fill="#6366f1" />
                                            </svg>
                                        </div>
                                        <span className="text-indigo-400 drop-shadow-sm font-mono text-xl z-10">{String.fromCodePoint(0x270F)}</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-purple-700 mb-1">a</div>
                                        <div className="text-xs font-semibold text-purple-500 italic">lowercase</div>
                                        <div className="mt-2 w-4 h-4 rounded-full bg-purple-500 mx-auto"></div>
                                    </div>
                                </div>
                                <div className="text-center mt-3 text-indigo-900 font-semibold">{String.fromCodePoint(0x1F4A1)} Use a pencil to draw a line!</div>
                            </div>
                            <div className="pl-4 border-l-2 border-indigo-300 space-y-1">
                                <div><strong>Step 1:</strong> Look at the big <span className="text-indigo-700 font-bold">"A"</span></div>
                                <div><strong>Step 2:</strong> Look for the little <span className="text-purple-700 font-bold">"a"</span> on the other side</div>
                                <div><strong>Step 3:</strong> Draw a line to connect them</div>
                                <div><strong>Step 4:</strong> Say <span className="text-indigo-700 font-bold">"A"</span> sound as you match</div>
                                <div className="font-semibold text-indigo-900 mt-2"><strong>Answer:</strong> <span className="text-indigo-700">A</span> matches <span className="text-purple-700">a</span></div>
                                <div className="text-xs text-indigo-700 mt-2 flex items-center gap-1">
                                    <span>{String.fromCodePoint(0x279C)}</span>
                                    <span>Tip: Uppercase and lowercase are the same letter, just different sizes!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                        {[['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm']].map(([U, l]) => (
                            <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                                <circle cx="48" cy="40" r="4" fill="#ef4444" />
                                <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                                <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                                <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                                <circle cx="330" cy="40" r="4" fill="#ef4444" />
                                <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                            </svg>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']].map(([U, l]) => (
                            <svg key={U} viewBox="0 0 400 120" className="w-full h-auto bg-white border border-slate-300 rounded">
                                <circle cx="48" cy="40" r="4" fill="#ef4444" />
                                <line x1="48" y1="40" x2="70" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="70" y1="40" x2="64" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="70" y1="40" x2="64" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <text x="60" y="70" fontSize="48" fill="#111827">{U}</text>
                                <circle cx="80" cy="90" r="6" fill="#94a3b8" />
                                <text x="300" y="70" fontSize="48" fill="#111827">{l}</text>
                                <circle cx="330" cy="40" r="4" fill="#ef4444" />
                                <line x1="330" y1="40" x2="308" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="308" y1="40" x2="314" y2="35" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="308" y1="40" x2="314" y2="45" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="320" cy="90" r="6" fill="#94a3b8" />
                            </svg>
                        ))}
                    </div>
                    {/* Extension/Challenge Problems */}
                    <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                        <div className="space-y-2 text-sm text-purple-800">
                            <div>1. Write your own uppercase and lowercase letter pairs</div>
                            <div>2. Can you name all 26 letters in order?</div>
                            <div>3. Practice writing both uppercase and lowercase</div>
                        </div>
                    </div>
                    {/* Self-Assessment */}
                    <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                        <div className="space-y-2 text-xs">
                            <div>{String.fromCharCode(0x2610)} I can match uppercase and lowercase letters</div>
                            <div>{String.fromCodePoint(0x270F)}</div>
                            <div>{String.fromCharCode(0x2610)} I can say letter sounds</div>
                        </div>
                        <div className="mt-3 text-xs">
                            <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 26
                        </div>
                        <div className="mt-2 text-xs">
                            <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                        </div>
                    </div>
                    {showAnswersForDoc('uppercase-lowercase-match', () => {
                        const letters = [['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm'], ['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']];
                        return (
                            <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                                <div className="space-y-1 text-sm text-emerald-800">
                                    {letters.map(([U, l], i) => (
                                        <div key={i}>{String.fromCodePoint(0x2705)}<strong>{l}</strong></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </WorksheetSectionWrapper>
            )}

            {activeDocs.includes('beginning-sounds-az') && (
                <WorksheetSectionWrapper
                    docId="beginning-sounds-az"
                    title="Beginning Sounds (AZ)"
                    emoji={String.fromCodePoint(0x1F524)}
                    description="Circle pictures that begin with each letter. Say the sound out loud (e.g., A as in apple)."
                    problemCount={26}
                    learningObjectives={[
                        'Identify beginning sounds of words',
                        'Match letters to their sounds',
                        'Recognize letter-sound relationships'
                    ]}
                    parentTeacherTips={[
                        'Say the sound, not the letter name (A says /a/ as in apple)',
                        'Help students listen for the first sound in each word',
                        'Encourage students to say the sound out loud',
                        'Extension: Find objects around you that start with each letter'
                    ]}
                >
                    <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x mb-2" />
                    {/* Worked Example */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg print:border print:bg-white">
                        <div className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                            <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                            <span>Example - Let's solve this together:</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="font-semibold text-base text-indigo-900"><strong>Problem:</strong> Circle the picture that begins with <span className="text-3xl text-indigo-700">"A"</span></div>
                            {/* Visual example with pictures */}
                            <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                                <div className="flex items-center justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">🍎</div>
                                        <div className="text-xs font-semibold text-indigo-700">apple</div>
                                        <div className="mt-2 w-16 h-16 rounded-full border-4 border-green-500 mx-auto flex items-center justify-center">
                                            <span className="text-2xl">A</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">✈️</div>
                                        <div className="text-xs font-semibold text-indigo-700">airplane</div>
                                        <div className="mt-2 w-16 h-16 rounded-full border-4 border-green-500 mx-auto flex items-center justify-center">
                                            <span className="text-2xl">A</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">🦋</div>
                                        <div className="text-xs font-semibold text-slate-500">butterfly</div>
                                        <div className="mt-2 w-16 h-16 rounded-full border-4 border-slate-300 mx-auto flex items-center justify-center">
                                            <span className="text-xl text-slate-400">{String.fromCodePoint(0x270F)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-3 text-indigo-900 font-semibold">{String.fromCodePoint(0x270F)}</div>
                            </div>
                            <div className="pl-4 border-l-2 border-indigo-300 space-y-1">
                                <div><strong>Step 1:</strong> Say the sound: <span className="text-indigo-700 font-bold">/a/</span> (like in apple)</div>
                                <div><strong>Step 2:</strong> Look at the pictures.</div>
                                <div><strong>Step 3:</strong> Which one starts with /a/? <span className="text-green-600 font-bold">Apple and airplane both start with /a/!</span></div>
                                <div><strong>Step 4:</strong> Circle the pictures that begin with /a/</div>
                                <div className="font-semibold text-indigo-900 mt-2"><strong>Answer:</strong> Circle 🍎 and ✈️</div>
                                <div className="text-xs text-indigo-700 mt-2 flex items-center gap-1">
                                    <span>{String.fromCodePoint(0x1F4A1)}</span>
                                    <span>Tip: Say the sound, not the letter name! A says /a/ as in apple!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4" style={{ pageBreakAfter: 'auto' }}>
                        {(() => {
                            const rows: Array<[string, string, string, string]> = [
                                ['A', '🍎', '🐜', '⚓'], ['B', '🐻', '💣', '🐝'], ['C', '🐱', '🚗', '🍰'], ['D', '🐶', '🎲', '🍩'],
                                ['E', '🥚', '🐘', '🦅'], ['F', '🐟', '🦊', '🍟'], ['G', '🍇', '🎁', '🎸'], ['H', '🏠', '👒', '🐹'],
                                ['I', '🧊', '🍦', '🦎'], ['J', '🏺', '👖', '🚁'], ['K', '🪁', '🔑', '🦘'], ['L', '🦁', '🍋', '🪵'],
                                ['M', '🌙', '🐵', '🖱️'], ['N', '🥜', '🥅', '🥡'], ['O', '🐙', '🦉', '🍊'], ['P', '🐷', '🍕', '✏️'],
                                ['Q', '👑', '❓', '🦆'], ['R', '🐰', '💍', '🤖'], ['S', '☀️', '🐍', '⭐'], ['T', '🐢', '🎪', '🐅'],
                                ['U', '☂️', '🆙', '🦄'], ['V', '🎻', '🌋', '🚐'], ['W', '🐋', '🍉', '⌚'], ['X', '📦', '🦊', '🧹'],
                                ['Y', '🧶', '⛵', '🍠'], ['Z', '🦓', '🤐', '⚡'],
                            ]
                            return rows.map(([L, a, b, c]) => (
                                <svg key={L} viewBox="0 0 400 160" className="w-full h-auto bg-white border border-slate-300 rounded">
                                    <text x="40" y="60" fontSize="40" fill="#111827">{L}</text>
                                    <text x="140" y="60" fontSize="36">{a}</text>
                                    <text x="200" y="60" fontSize="36">{b}</text>
                                    <text x="260" y="60" fontSize="36">{c}</text>
                                    <rect x="130" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                                    <rect x="190" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                                    <rect x="250" y="80" width="40" height="40" fill="none" stroke="#94a3b8" />
                                </svg>
                            ))
                        })()}
                    </div>
                    {/* Extension/Challenge Problems */}
                    <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                        <div className="space-y-2 text-sm text-purple-800">
                            <div>1. Find objects around you that start with each letter</div>
                            <div>2. Can you think of 3 words that start with each letter?</div>
                            <div>3. Practice saying the sound for each letter</div>
                        </div>
                    </div>
                    {/* Self-Assessment */}
                    <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                        <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                        <div className="space-y-2 text-xs">
                            <div>{String.fromCharCode(0x2610)} I can identify beginning sounds</div>
                            <div>{String.fromCharCode(0x2610)} I can match letters to their sounds</div>
                            <div>{String.fromCharCode(0x2610)} I understand letter-sound relationships</div>
                        </div>
                        <div className="mt-3 text-xs">
                            <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 26
                        </div>
                        <div className="mt-2 text-xs">
                            <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                        </div>
                    </div>
                    {showAnswersForDoc('beginning-sounds-az', () => {
                        const answers: Record<string, string[]> = {
                            'A': ['🍎', '🐜', '⚓'], 'B': ['🐻', '💣', '🐝'], 'C': ['🐱', '🚗', '🍰'], 'D': ['🐶', '🎲', '🍩'],
                            'E': ['🥚', '🐘', '🦅'], 'F': ['🐟', '🦊', '🍟'], 'G': ['🍇', '🎁', '🎸'], 'H': ['🏠', '👒', '🐹'],
                            'I': ['🧊', '🍦', '🦎'], 'J': ['🏺', '👖', '🚁'], 'K': ['🪁', '🔑', '🦘'], 'L': ['🦁', '🍋', '🪵'],
                            'M': ['🌙', '🐵', '🖱️'], 'N': ['🥜', '🥅', '🥡'], 'O': ['🐙', '🦉', '🍊'], 'P': ['🐷', '🍕', '✏️'],
                            'Q': ['👑', '❓', '🦆'], 'R': ['🐰', '💍', '🤖'], 'S': ['☀️', '🐍', '⭐'], 'T': ['🐢', '🎪', '🐅'],
                            'U': ['☂️', '🆙', '🦄'], 'V': ['🎻', '🌋', '🚐'], 'W': ['🐋', '🍉', '⌚'], 'X': ['📦', '🦊', '🧹'],
                            'Y': ['🧶', '⛵', '🍠'], 'Z': ['🦓', '🤐', '⚡']
                        };
                        return (
                            <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                                <div className="space-y-1 text-sm text-emerald-800">
                                    {Object.entries(answers).map(([letter, emojis]) => (
                                        <div key={letter}>{letter}: Circle <strong>{emojis.join(', ')}</strong></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </WorksheetSectionWrapper>
            )}

            {/* Structured Worksheet Groups */}
            {activeDocs.map(docId => {
                if (['count-color-1-10', 'how-many-1-15', 'count-match-1-20', 'count-circle-1-10'].includes(docId)) {
                    return <CountingWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['heavy-light', 'long-short', 'big-small', 'more-less', 'same-different', 'size-comparison'].includes(docId)) {
                    return <ComparisonWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['ab-pattern', 'color-patterns', 'shape-patterns', 'what-comes-next', 'what-comes-next-shapes', 'pattern-complete'].includes(docId)) {
                    return <PatternWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['shape-identification', 'missing-shape', 'color-shapes', 'shape-sorting', 'color-recognition', 'draw-shape', 'shapes-colors-sort'].includes(docId)) {
                    return <ShapeWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['find-number-1-10', 'number-order-1-20', 'number-matching-1-15', 'number-id-1-10'].includes(docId)) {
                    return <NumberRecognitionWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (docId.startsWith('coloring')) {
                    return <ColoringWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={numVariant} showAnswersForDoc={showAnswersForDoc} />;
                }
                return null;
            })}
        </>
    );
};
