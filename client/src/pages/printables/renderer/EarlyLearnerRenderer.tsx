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
    DotToDot1to20
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
        </>
    );
};
