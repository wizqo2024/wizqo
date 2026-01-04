import React from 'react';
export type ReactNode = React.ReactNode;

export interface SpecificWorksheetProps {
    seed: string;
    variant: number;
    showAnswersForDoc: (docId: string, render: () => ReactNode) => ReactNode;
    docId: string;
    activeDocs?: string[];
}
