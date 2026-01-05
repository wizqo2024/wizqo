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
import { WorksheetSectionWrapper } from '../PrintableShared'; // For inline SVGs if we move them here eventually

// Props interface section
interface EarlyLearnerRendererProps {
    activeDocs: string[];
    seed: string;
    variant: string;
    showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
    t: any;
    getTrans: any;
}

export const EarlyLearnerRenderer: React.FC<EarlyLearnerRendererProps> = ({ activeDocs, seed: effectiveSeed, variant, showAnswersForDoc, t, getTrans }) => {
    return (
        <>
            {/* Kindergarten / Early Learning */}
            {activeDocs.includes('spot-difference') && (
                <SpotDifferenceWorksheet docId="spot-difference" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('color-by-number') && (
                <ColorByNumberWorksheet docId="color-by-number" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('design-monster') && (
                <DesignMonsterWorksheet docId="design-monster" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('draw-half') && (
                <DrawHalfWorksheet docId="draw-half" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('hidden-object') && (
                <HiddenObjectWorksheet docId="hidden-object" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('maze-focus') && (
                <MazeFocusWorksheet docId="maze-focus" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('bookmark-templates') && (
                <BookmarkTemplates docId="bookmark-templates" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('dot-to-dot-1-20') && (
                <DotToDot1to20 docId="dot-to-dot-1-20" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}
            {activeDocs.includes('animal-pack') && (
                <AnimalPack docId="animal-pack" seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />
            )}

            {/* Structured Worksheet Groups */}
            {activeDocs.map(docId => {
                if (['count-color-1-10', 'how-many-1-15', 'count-match-1-20', 'count-circle-1-10', 'counting-objects-20'].includes(docId)) {
                    return <CountingWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['heavy-light', 'long-short', 'big-small', 'more-less', 'same-different', 'size-comparison'].includes(docId)) {
                    return <ComparisonWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['ab-pattern', 'color-patterns', 'shape-patterns', 'what-comes-next', 'what-comes-next-shapes', 'pattern-complete'].includes(docId)) {
                    return <PatternWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['shape-identification', 'missing-shape', 'color-shapes', 'shape-sorting', 'color-recognition', 'draw-shape', 'shapes-colors-sort'].includes(docId)) {
                    return <ShapeWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (['find-number-1-10', 'number-order-1-20', 'number-matching-1-15', 'number-tracing-1-10', 'number-id-1-10'].includes(docId)) {
                    return <NumberRecognitionWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                if (docId.startsWith('coloring-pages-')) {
                    return <ColoringWorksheet key={docId} docId={docId} seed={effectiveSeed} variant={variant} showAnswersForDoc={showAnswersForDoc} />;
                }
                return null;
            })}
        </>
    );
};
