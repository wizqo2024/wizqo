import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { CVCWords, SightWordsPrePrimer, LetterTracingAZ, RhymingWords, SentenceBuilding } from '../LanguageWorksheets';
import { GrammarDetective } from '../GrammarWorksheets';
import { ReadingComprehension } from '../ReadingWorksheets';
import { WorksheetSectionWrapper } from '../PrintableShared'; // Required for inline renderers if any
import InteractiveReadingWorksheetPage from '../../InteractiveReadingWorksheetPage';

import { makeRng, shuffleArray } from '@/utils/printableUtils';

// Props interface
interface LanguageRendererProps {
    activeDocs: string[];
    seed: string;
    variant: string;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: any;
    getTrans: any;
}

export const LanguageRenderer: React.FC<LanguageRendererProps> = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans }) => {
    return (
        <>
            {activeDocs.includes('spelling') && (() => {
                const rng = makeRng(`${effectiveSeed}|v${variant}|doc=spelling`)
                const gradeLevel = (parseInt(effectiveSeed.slice(-1), 16) % 3) + 1 // Grades 1-3

                // Vocabulary words by pattern
                const vocabWords = {
                    cvc: ['cat', 'dog', 'pig', 'box', 'rug', 'bus', 'hat', 'web', 'pin', 'fox'],
                    blends: ['frog', 'star', 'blue', 'drum', 'flag', 'crab', 'tree', 'swim', 'stop', 'plan'],
                    silentE: ['cake', 'bike', 'rose', 'cube', 'kite', 'bone', 'game', 'home', 'time', 'nose'],
                    longVowels: ['tree', 'rain', 'boat', 'blue', 'pie', 'leaf', 'road', 'moon', 'stay', 'fruit'],
                    compound: ['cupcake', 'sunshine', 'rainbow', 'butterfly', 'starfish', 'popcorn', 'jellyfish', 'snowman', 'football', 'ladybug']
                }

                let selectedWords: string[] = []
                let patternTitle = ""

                // Select pattern based on randomness (or grade bias)
                const roll = Math.floor(rng() * 10)
                if (roll < 2) {
                    selectedWords = shuffleArray(vocabWords.cvc, rng).slice(0, 5)
                    patternTitle = "Short Vowels (CVC)"
                } else if (roll < 4) {
                    selectedWords = shuffleArray(vocabWords.blends, rng).slice(0, 5)
                    patternTitle = "Consonant Blends"
                } else if (roll < 6) {
                    selectedWords = shuffleArray(vocabWords.silentE, rng).slice(0, 5)
                    patternTitle = "Silent E"
                } else if (roll < 8) {
                    selectedWords = shuffleArray(vocabWords.longVowels, rng).slice(0, 5)
                    patternTitle = "Long Vowel Teams"
                } else {
                    selectedWords = shuffleArray(vocabWords.compound, rng).slice(0, 5)
                    patternTitle = "Compound Words"
                }

                return (
                    <WorksheetSectionWrapper
                        docId="spelling"
                        title={`Spelling Challenge: ${patternTitle}`}
                        emoji={String.fromCodePoint(0x270F)}
                        description="Read, trace, and write the words. Then find them in the puzzle!"
                        problemCount={selectedWords.length + 1}
                        learningObjectives={[
                            'Recognize common spelling patterns',
                            'Practice spelling skills',
                            'Develop word recognition'
                        ]}
                        parentTeacherTips={[
                            'Look for common spelling patterns',
                            'Say the words out loud',
                            'Extension: Use these words in a sentence'
                        ]}
                    >
                        <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 animate-gradient-x mb-2" />

                        {/* List A: Read, Trace, Write */}
                        <div className="mb-8">
                            <div className="grid grid-cols-4 gap-4 mb-2 font-bold text-slate-700 border-b-2 border-slate-300 pb-1">
                                <div className="text-center">Read</div>
                                <div className="text-center text-slate-400">Trace</div>
                                <div className="text-center text-slate-400">Write</div>
                                <div className="text-center text-slate-400">Write Again</div>
                            </div>

                            {selectedWords.map(word => (
                                <div key={word} className="grid grid-cols-4 gap-4 h-16 items-center border-b border-slate-200">
                                    <div className="text-xl font-bold text-center tracking-wide">{word}</div>
                                    <div className="text-xl font-bold text-center tracking-wide text-slate-300 font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{word}</div>
                                    <div className="border-b border-slate-300 relative"></div>
                                    <div className="border-b border-slate-300 relative"></div>
                                </div>
                            ))}
                        </div>

                        {/* Word Scramble */}
                        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                            <h3 className="font-bold text-orange-900 mb-2">{String.fromCodePoint(0x1F520)} Unscramble the Words</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {shuffleArray([...selectedWords].slice(0, 4), rng).map(word => {
                                    const scrambled = shuffleArray(word.split(''), rng).join('')
                                    return (
                                        <div key={word} className="flex gap-2 items-center">
                                            <span className="font-mono text-lg tracking-widest uppercase bg-white px-2 py-1 rounded border border-orange-200">{scrambled}</span>
                                            <span className="text-xl">{String.fromCodePoint(0x2192)}</span>
                                            <div className="border-b-2 border-slate-400 w-32 h-8"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Answer Key */}
                        {showAnswersForDoc('spelling', () => (
                            <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                                <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)} Solution</div>
                                <div className="text-sm text-emerald-800">
                                    <div className="mb-2"><strong>Words used:</strong> {selectedWords.join(', ')}</div>
                                </div>
                            </div>
                        ))}
                    </WorksheetSectionWrapper>
                )
            })()}

            {/* Reading Comprehension Blocks */}
            {[
                'reading-mini-1', 'reading-g1-lost-hat', 'reading-g1-ants', 'reading-g1-bus-ride',
                'reading-g1-pet-fish', 'reading-g2-paper-bridge', 'reading-g2-rainy-garden',
                'reading-g2-library-card', 'reading-g2-lost-and-found', 'reading-g3-lighthouse',
                'reading-g3-science-fair', 'reading-g3-community-garden', 'reading-g1-red-balloon',
                'reading-g1-big-box', 'reading-g1-garden-snail', 'reading-g1-birthday-cake',
                'reading-g2-bird-feeder', 'reading-g2-cookie-recipe', 'reading-g2-tree-house',
                'reading-g2-magic-seeds', 'reading-g3-school-play', 'reading-g3-art-project'
            ].map(id => (activeDocs.includes(id) || activeDocs.includes(id.replace('reading-', ''))) && (
                <ReadingComprehension
                    key={id}
                    docId={id}
                    activeDocs={activeDocs}
                    showAnswersForDoc={showAnswersForDoc}
                    seed={effectiveSeed}
                    variant={variant}
                />
            ))}

            {/* Language / Literacy Worksheets */}
            {activeDocs.includes('rhyming-words') && (
                <RhymingWords docId="rhyming-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('cvc-words') && (
                <CVCWords docId="cvc-words" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('sentence-building') && (
                <SentenceBuilding docId="sentence-building" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('sight-words-pre-primer') && (
                <SightWordsPrePrimer docId="sight-words-pre-primer" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('letter-tracing-az') && (
                <LetterTracingAZ docId="letter-tracing-az" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('grammar-detective') && (
                <GrammarDetective docId="grammar-detective" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('reading-discovery-interactive') && (
                <InteractiveReadingWorksheetPage />
            )}
        </>
    );
};
