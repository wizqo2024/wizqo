import React from 'react'
import { Download, Loader2 } from 'lucide-react'

interface PDFDownloadButtonProps {
    onClick: () => void | Promise<void>
    isGenerating: boolean
    label?: string
    className?: string
    // Allow overriding the positioning if needed, but default to absolute top-right
    disableDefaultPositioning?: boolean
}

/**
 * Standard PDF Download Button
 * 
 * Uses the approved "High Visibility" design:
 * - Solid Indigo/Purple background (bg-indigo-600)
 * - White text
 * - Always visible (no hover effects hiding it)
 * - Standard size and rounded corners
 */
export function PDFDownloadButton({
    onClick,
    isGenerating,
    label = "PDF Download",
    className = "",
    disableDefaultPositioning = false
}: PDFDownloadButtonProps) {
    const baseClasses = "flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white border border-indigo-700 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 text-xs"
    const positionClasses = disableDefaultPositioning ? "" : "absolute top-2 right-2 z-20 print:hidden"

    return (
        <div className={`${positionClasses} ${className}`} data-html2canvas-ignore="true">
            <button
                onClick={onClick}
                disabled={isGenerating}
                className={baseClasses}
                title="Download PDF"
            >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {isGenerating ? 'Generating...' : label}
            </button>
        </div>
    )
}
