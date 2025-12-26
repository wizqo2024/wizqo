import React from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Download, Loader2 } from 'lucide-react'

// Helper function to get theme for regular worksheets based on docId
export function getWorksheetTheme(docId: string): {
    background: string
    border: string
    text: string
    cornerAccent: string
    cornerAccent2: string
} {
    // Math worksheets
    if (docId.includes('math') || docId.includes('number') || docId.includes('addition') || docId.includes('subtraction') ||
        docId.includes('place-value') || docId.includes('counting') || docId.includes('skip-count') || docId.includes('expanded') ||
        docId.includes('rounding') || docId.includes('fact') || docId.includes('mental-math') || docId.includes('doubles') ||
        docId.includes('compare') || docId.includes('word-problems') || docId.includes('number-line') || docId.includes('number-patterns') ||
        docId.includes('missing-addends') || docId.includes('add-three') || docId.includes('balance-equations') || docId.includes('picture-addition') ||
        docId.includes('subtraction-stories') || docId.includes('number-bonds') || docId.includes('count-write') || docId.includes('missing-numbers') ||
        docId.includes('ten-frames') || docId.includes('number-tracing') || docId.includes('dot-to-dot') || docId.includes('color-by-number')) {
        return {
            background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
            border: 'border-purple-300',
            text: 'text-purple-900',
            cornerAccent: 'rgba(196, 181, 253, 0.3)',
            cornerAccent2: 'rgba(251, 207, 232, 0.2)',
        }
    }
    // Reading worksheets
    if (docId.includes('reading') || docId.includes('comprehension')) {
        return {
            background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
            border: 'border-blue-300',
            text: 'text-blue-800',
            cornerAccent: 'rgba(191, 219, 254, 0.3)',
            cornerAccent2: 'rgba(186, 230, 253, 0.2)',
        }
    }
    // Writing/Handwriting worksheets
    if (docId.includes('writing') || docId.includes('handwriting') || docId.includes('tracing') || docId.includes('spelling') || docId.includes('grammar')) {
        return {
            background: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50',
            border: 'border-emerald-300',
            text: 'text-emerald-800',
            cornerAccent: 'rgba(167, 243, 208, 0.3)',
            cornerAccent2: 'rgba(134, 239, 172, 0.2)',
        }
    }
    // Science worksheets
    if (docId.includes('science') || docId.includes('stem')) {
        return {
            background: 'bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50',
            border: 'border-green-300',
            text: 'text-green-800',
            cornerAccent: 'rgba(187, 247, 208, 0.3)',
            cornerAccent2: 'rgba(167, 243, 208, 0.2)',
        }
    }
    // Geography worksheets
    if (docId.includes('geo') || docId.includes('geography') || docId.includes('continents') || docId.includes('map')) {
        return {
            background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
            border: 'border-amber-300',
            text: 'text-amber-800',
            cornerAccent: 'rgba(253, 230, 138, 0.3)',
            cornerAccent2: 'rgba(254, 243, 199, 0.2)',
        }
    }
    // Logic/Focus worksheets
    if (docId.includes('logic') || docId.includes('spot-difference') || docId.includes('pattern') || docId.includes('maze') ||
        docId.includes('missing-shape') || docId.includes('size-comparison') || docId.includes('shapes-colors-sort')) {
        return {
            background: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
            border: 'border-slate-300',
            text: 'text-slate-800',
            cornerAccent: 'rgba(226, 232, 240, 0.3)',
            cornerAccent2: 'rgba(241, 245, 249, 0.2)',
        }
    }
    // Default theme
    return {
        background: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50',
        border: 'border-purple-300',
        text: 'text-purple-800',
        cornerAccent: 'rgba(196, 181, 253, 0.3)',
        cornerAccent2: 'rgba(251, 207, 232, 0.2)',
    }
}

// Professional header component for print worksheets - matching Interactive Worksheets Generator
export function LocalWorksheetHeader({ problemCount }: { problemCount?: number }) {
    return (
        <div className="print:block hidden print:mb-4 pb-3 mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="text-sm mb-2"><strong>Name:</strong> _________________________</div>
                    <div className="text-sm mb-2"><strong>Date:</strong> ___________  <strong>Grade:</strong> _____</div>

                </div>
                {problemCount && (
                    <div className="text-right text-xs text-slate-600">
                        <div>Score: ___ / {problemCount}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Parent/Teacher tips component
export function ParentTeacherTips({ tips }: { tips: string[] }) {
    return (
        <div className="print:block hidden print:mt-0 mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="font-semibold text-yellow-900 mb-2">💡 Tips for Parents/Teachers:</div>
            <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                ))}
            </ul>
        </div>
    )
}

// Helper component to wrap worksheet sections with nice styling
// Remove memo to ensure re-renders when language changes
export function WorksheetSectionWrapper({
    docId,
    title,
    emoji,
    description,
    children,
    problemCount,
    learningObjectives,
    parentTeacherTips,
    hideDefaultHeader = false,
    footer
}: {
    docId: string
    title: string
    emoji?: string
    description?: string
    children: ReactNode
    problemCount?: number
    learningObjectives?: string[]
    parentTeacherTips?: string[]
    hideDefaultHeader?: boolean
    footer?: ReactNode
}) {
    const { t, isRTL, language } = useTranslation()
    const theme = getWorksheetTheme(docId)
    const sectionRef = React.useRef<HTMLElement>(null)
    const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false)

    // Try to get translated title/description if available
    // Use language in dependency to force re-render when language changes
    // Only try to translate if the title/description looks like a translation key (starts with 'worksheets.')
    const translatedTitle = React.useMemo(() => {
        // If title is already a translated string (doesn't start with 'worksheets.'), use it as-is
        if (title && !title.startsWith('worksheets.')) {
            return title
        }
        const translated = t(`worksheets.${docId}.title`)
        return translated !== `worksheets.${docId}.title` ? translated : title
    }, [t, docId, title, language])

    const translatedDescription = React.useMemo(() => {
        if (!description) return description
        // If description is already a translated string (doesn't start with 'worksheets.'), use it as-is
        if (description && !description.startsWith('worksheets.')) {
            return description
        }
        const translated = t(`worksheets.${docId}.description`)
        return translated !== `worksheets.${docId}.description` ? translated : description
    }, [t, docId, description, language])

    const translatedObjectives = React.useMemo(() => {
        if (!learningObjectives) return undefined
        return learningObjectives.map((obj, idx) => {
            const key = `worksheets.${docId}.learningObjectives.${idx}`
            const translated = t(key)
            return translated !== key ? translated : obj
        })
    }, [t, docId, learningObjectives, language])

    const translatedTips = React.useMemo(() => {
        if (!parentTeacherTips) return undefined
        return parentTeacherTips.map((tip, idx) => {
            const key = `worksheets.${docId}.parentTeacherTips.${idx}`
            const translated = t(key)
            return translated !== key ? translated : tip
        })
    }, [t, docId, parentTeacherTips, language])

    const handleDownloadPDF = async () => {
        if (!sectionRef.current || isGeneratingPdf) return

        setIsGeneratingPdf(true)

        try {
            // Wait for re-render/styles
            await new Promise(resolve => setTimeout(resolve, 100))

            const canvas = await html2canvas(sectionRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                ignoreElements: (element) => {
                    return element.hasAttribute('data-html2canvas-ignore')
                }
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgProps = pdf.getImageProperties(imgData)

            const imgRatio = imgProps.width / imgProps.height
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()

            let w = pdfWidth
            let h = w / imgRatio

            if (h > pdfHeight) {
                h = pdfHeight
                w = h * imgRatio
            }

            const x = (pdfWidth - w) / 2
            const y = 0

            pdf.addImage(imgData, 'PNG', x, y, w, h)
            pdf.save(`${docId}.pdf`)
        } catch (error) {
            console.error('PDF generation failed:', error)
            alert('Could not generate PDF. Please use the Print button instead.')
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    return (
        <div className="relative group w-full">
            <div className="absolute top-2 right-2 z-20 print:hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-html2canvas-ignore="true">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-indigo-600 border border-indigo-200 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-50 text-xs"
                    title="Download PDF"
                >
                    {isGeneratingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {isGeneratingPdf ? 'Generating...' : 'PDF'}
                </button>
            </div>
            <section
                ref={sectionRef}
                className={`mb-10 break-inside-auto rounded-xl border-2 ${theme.border} ${theme.background} p-6 print:border-0 print:p-0 print:bg-white print:mt-0 print:mb-0 print:pt-0 shadow-lg relative overflow-hidden print:overflow-visible worksheet-section`}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                    pageBreakInside: 'auto',
                    breakInside: 'auto',
                    WebkitRegionBreakInside: 'auto',
                    pageBreakBefore: 'auto',
                    breakBefore: 'auto',
                    marginTop: 0,
                    marginBottom: 0
                } as React.CSSProperties}
            >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full pointer-events-none print:hidden" style={{ backgroundColor: theme.cornerAccent }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr rounded-tr-full pointer-events-none print:hidden" style={{ backgroundColor: theme.cornerAccent2 }} />
                <div
                    className="relative z-10 print:p-0"
                    style={{
                        pageBreakInside: 'auto',
                        breakInside: 'auto',
                        paddingTop: 0,
                        marginTop: 0
                    } as React.CSSProperties}
                >
                    {!hideDefaultHeader && <LocalWorksheetHeader problemCount={problemCount} />}
                    <h2
                        className={`text-xl font-bold ${theme.text} mb-2 flex items-center gap-2`}
                        style={{
                            pageBreakAfter: 'avoid',
                            breakAfter: 'avoid',
                            pageBreakInside: 'avoid',
                            breakInside: 'avoid',
                            marginTop: 0,
                            paddingTop: 0
                        } as React.CSSProperties}
                    >
                        {emoji && <span className="text-4xl">{emoji}</span>}
                        <span>{translatedTitle}</span>
                    </h2>
                    {translatedDescription && (
                        <p
                            className={`text-sm ${theme.text} opacity-70 mb-4`}
                            style={{
                                pageBreakAfter: 'avoid',
                                breakAfter: 'avoid',
                                marginTop: '0.25rem'
                            } as React.CSSProperties}
                        >
                            {translatedDescription}
                        </p>
                    )}

                    <div className="print:mt-0" style={{ marginTop: 0, paddingTop: 0, pageBreakBefore: 'auto' } as React.CSSProperties}>
                        {children}
                    </div>
                    {/* Parent/Teacher Tips - Will appear on page 2 with Self-Assessment */}
                    {translatedTips && (
                        <div style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                            <ParentTeacherTips tips={translatedTips} />
                        </div>
                    )}
                    {/* Footer - Always rendered last, after ParentTeacherTips */}
                    {footer}
                </div>
            </section>
        </div>
    )
}
