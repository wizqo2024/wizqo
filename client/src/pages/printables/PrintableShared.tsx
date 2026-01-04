import React, { type ReactNode, type CSSProperties } from 'react'
import { useTranslation } from '@/context/TranslationContext'

// Helper function to get theme for regular worksheets based on docId
export function getWorksheetTheme(docId: string): {
    background: string
    border: string
    text: string
    cornerAccent: string
    cornerAccent2: string
} {
    if (!docId) {
        return {
            background: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
            border: 'border-slate-300',
            text: 'text-slate-800',
            cornerAccent: 'rgba(226, 232, 240, 0.3)',
            cornerAccent2: 'rgba(241, 245, 249, 0.2)',
        }
    }

    // Math worksheets
    if (docId.includes('math') || docId.includes('number') || docId.includes('addition') || docId.includes('subtraction') ||
        docId.includes('place-value') || docId.includes('counting') || docId.includes('skip-count') || docId.includes('expanded') ||
        docId.includes('rounding') || docId.includes('fact') || docId.includes('mental-math') || docId.includes('doubles') ||
        docId.includes('compare') || docId.includes('word-problems') || docId.includes('number-line') || docId.includes('number-patterns') ||
        docId.includes('missing-addends') || docId.includes('add-three') || docId.includes('balance-equations') || docId.includes('picture-addition') ||
        docId.includes('subtraction-stories') || docId.includes('number-bonds') || docId.includes('count-write') || docId.includes('missing-numbers') ||
        docId.includes('ten-frames') || docId.includes('number-tracing') || docId.includes('dot-to-dot') || docId.includes('color-by-number') || docId.includes('fraction')) {
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
            <div className="font-semibold text-yellow-900 mb-2">💡 Parent & Teacher Tips</div>
            <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                ))}
            </ul>
        </div>
    )
}

interface PremiumBannerProps {
    title: string;
    subtitle?: string;
    icons: {
        bg1: string;
        bg2: string;
        float1: string;
        float2: string;
    };
    colors: {
        bg: string;
        border: string;
        pillBg: string;
        pillBorder: string;
        pillText: string;
        accent: string;
    };
}

export function PremiumWorksheetBanner({ title, subtitle, icons, colors }: PremiumBannerProps) {
    return (
        <div className={`w-full h-24 mb-6 relative overflow-hidden ${colors.bg} rounded-xl border-2 ${colors.border}`}>
            {/* Background elements */}
            <div className={`absolute -bottom-4 left-0 text-6xl ${colors.accent} opacity-40 select-none`}>{icons.bg1}</div>
            <div className={`absolute -bottom-4 right-0 text-6xl ${colors.accent} opacity-40 select-none`}>{icons.bg2}</div>

            {/* Floating elements */}
            <div className="absolute top-2 left-10 text-2xl animate-bounce-slow select-none">{icons.float1}</div>
            <div className="absolute top-8 right-20 text-xl animate-bounce-medium select-none">{icons.float2}</div>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`${colors.pillBg} px-8 py-2 rounded-full border ${colors.pillBorder} shadow-sm`}>
                    <span className={`text-2xl font-bold ${colors.pillText} tracking-wider uppercase`}>{title}</span>
                </div>
                {subtitle && (
                    <div className={`mt-2 text-xs font-semibold ${colors.pillText} opacity-80 uppercase tracking-widest`}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
}

// Worked Example Component for addition-subtraction-0-10
export function WorkedExampleContent() {
    const { t, language } = useTranslation()
    // Force re-render when language changes
    React.useEffect(() => { }, [language])
    return (
        <div
            className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg print:border print:bg-white worked-example"
            style={{
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
                WebkitRegionBreakInside: 'avoid'
            } as React.CSSProperties}
        >
            <div
                className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2"
                style={{
                    pageBreakAfter: 'avoid',
                    breakAfter: 'avoid'
                } as React.CSSProperties}
            >
                <span className="text-2xl">{String.fromCodePoint(0x279C)}</span>
                <span>{t('worksheets.addition-subtraction-0-10.workedExample.title')}</span>
            </div>
            <div className="space-y-3 text-sm">
                <div className="font-semibold text-base text-blue-900 math-problem"><strong>{t('worksheets.addition-subtraction-0-10.workedExample.problem', 'Problem:')}</strong> {t('worksheets.addition-subtraction-0-10.workedExample.problemText', '5 + 3 = ?')}</div>
                {/* Visual example with objects */}
                <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                    <svg viewBox="0 0 500 120" className="w-full h-auto">
                        {/* 5 blue circles */}
                        {Array.from({ length: 5 }).map((_, j) => (
                            <g key={j}>
                                <circle cx={40 + j * 50} cy="40" r="18" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                                <circle cx={40 + j * 50 - 4} cy="36" r="3" fill="#ffffff" />
                                <text x={40 + j * 50} y="45" fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="bold">{j + 1}</text>
                            </g>
                        ))}
                        {/* Plus sign */}
                        <text x="290" y="50" fontSize="32" fill="#1e40af" fontWeight="bold">+</text>
                        {/* 3 green circles */}
                        {Array.from({ length: 3 }).map((_, j) => (
                            <g key={j}>
                                <circle cx={330 + j * 50} cy="40" r="18" fill="#10b981" stroke="#059669" strokeWidth="2" />
                                <circle cx={330 + j * 50 - 4} cy="36" r="3" fill="#ffffff" />
                                <text x={330 + j * 50} y="45" fontSize="14" fill="#059669" textAnchor="middle" fontWeight="bold">{j + 1}</text>
                            </g>
                        ))}
                        {/* Equals */}
                        <text x="480" y="50" fontSize="32" fill="#1e40af" fontWeight="bold">=</text>
                    </svg>
                    <div className="text-center mt-2 text-blue-900 font-semibold">{t('worksheets.addition-subtraction-0-10.workedExample.countAll', 'Count all the circles: 5 + 3 = 8')}</div>
                </div>
                <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step1')}</strong></div>
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step2')}</strong></div>
                    <div><strong>{t('worksheets.addition-subtraction-0-10.workedExample.step3')}</strong></div>
                    <div className="font-semibold text-blue-900 mt-2"><strong>{t('worksheets.addition-subtraction-0-10.workedExample.answer', 'Answer:')}</strong> {t('worksheets.addition-subtraction-0-10.workedExample.answerText', '5 + 3 = 8')}</div>
                    <div className="text-xs text-blue-700 mt-2 flex items-center gap-1">
                        <span>💡</span>
                        <span>{t('worksheets.addition-subtraction-0-10.workedExample.tip')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main Wrapper Component
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

    // Try to get translated title/description if available
    const translatedTitle = React.useMemo(() => {
        if (title && !title.startsWith('worksheets.')) {
            return title
        }
        const translated = t(`worksheets.${docId}.title`)
        return translated !== `worksheets.${docId}.title` ? translated : title
    }, [t, docId, title, language])

    const translatedDescription = React.useMemo(() => {
        if (!description) return description
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

    return (
        <section
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
    )
}

// Helper function to get translated worksheet title
export function getTranslatedWorksheetTitle(docId: string, t: ((key: string) => string) | undefined, fallback: string): string {
    if (t) {
        const translated = t(`worksheets.${docId}.title`)
        if (translated && translated !== `worksheets.${docId}.title` && !translated.startsWith('worksheets.')) {
            // Extract emoji from fallback if present, otherwise use first emoji from translated
            const emojiMatch = fallback.match(/^[\u1F300-\u1F9FF]|[\u2600-\u26FF]|[\u2700-\u27BF]/)
            const emoji = emojiMatch ? emojiMatch[0] : ''
            return emoji ? `${emoji} ${translated}` : translated
        }
    }
    return fallback
}

export function resolveDocTitle(docId: string, context: { packTime: string; bundleCategory?: string; t?: (key: string) => string }): string {
    const { packTime, bundleCategory, t } = context
    switch (docId) {
        case 'bundle':
            return bundleCategory ? `${bundleCategory} ${t ? t('pages.printables.printableBundle') : 'Printable Bundle'}` : (t ? t('pages.printables.printableBundle') : 'Printable Bundle')
        case 'ten-frames-1-20':
            return getTranslatedWorksheetTitle(docId, t, ' Ten Frames 120')
        case 'number-tracing-1-20':
            return getTranslatedWorksheetTitle(docId, t, ' Number Tracing 120')
        case 'stem-balloon-rocket':
            return getTranslatedWorksheetTitle(docId, t, ' Balloon Rocket (STEM)')
        case 'stem-walking-water':
            return getTranslatedWorksheetTitle(docId, t, ' Walking Water (STEM)')
        case 'arts-3-shape-creature':
            return getTranslatedWorksheetTitle(docId, t, ' Draw From 3 Shapes (Arts)')
        case 'number-tracing-1-10':
            return getTranslatedWorksheetTitle(docId, t, ' Number Tracing 110')
        case 'uppercase-lowercase-match':
            return getTranslatedWorksheetTitle(docId, t, 'AaZz Upper/Lower Letter Match')
        case 'beginning-sounds-az':
            return getTranslatedWorksheetTitle(docId, t, ' Beginning Sounds (AZ)')
        case 'kindergarten-counting-1-10':
            return getTranslatedWorksheetTitle(docId, t, ' Counting 110')
        case 'kindergarten-number-recognition':
            return getTranslatedWorksheetTitle(docId, t, ' Number Recognition')
        case 'kindergarten-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Shapes')
        case 'kindergarten-patterns':
            return getTranslatedWorksheetTitle(docId, t, ' Patterns')
        case 'kindergarten-addition-pictures':
            return getTranslatedWorksheetTitle(docId, t, ' Addition with Pictures')
        case 'kindergarten-counting-visual':
            return getTranslatedWorksheetTitle(docId, t, ' Counting with Cute Characters')
        case 'addition-subtraction-0-10':
            return getTranslatedWorksheetTitle(docId, t, ' Addition & Subtraction 010')
        case 'ten-frames-1-10':
            return getTranslatedWorksheetTitle(docId, t, ' Ten Frames 110')
        case 'shapes-colors-sort':
            return getTranslatedWorksheetTitle(docId, t, ' Shapes & Colors Sort (Cut & Glue)')
        case 'dot-to-dot-1-20':
            return getTranslatedWorksheetTitle(docId, t, '120 Dot-to-Dot')
        case 'tangram-animals':
            return getTranslatedWorksheetTitle(docId, t, 'Tangram Animals (Cutouts)')
        case 'spot-difference':
        case 'spotdiff':
            return getTranslatedWorksheetTitle(docId, t, ' Spot-the-Difference')
        case 'directed-drawing-animals':
            return getTranslatedWorksheetTitle(docId, t, ' Directed Drawing: Animals')
        case 'cut-and-paste-crafts':
            return getTranslatedWorksheetTitle(docId, t, ' Cut-and-Paste Paper Crafts')
        case 'feelings-checkin':
            return getTranslatedWorksheetTitle(docId, t, ' Feelings Check-In Meter')
        case 'reward-chart':
            return getTranslatedWorksheetTitle(docId, t, ' Weekly Reward / Sticker Chart')
        case 'reading-mini-1':
            return getTranslatedWorksheetTitle(docId, t, ' Mini Reading Passage + 3 Questions')
        case 'reading-g1-lost-hat':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Lost Hat (Reading)')
        case 'reading-g1-ants':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  Lunch for the Ants (Reading)')
        case 'reading-g1-bus-ride':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Bus Ride (Reading)')
        case 'reading-g1-pet-fish':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Pet Fish (Reading)')
        case 'reading-g2-paper-bridge':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Paper Bridge (Reading)')
        case 'reading-g2-rainy-garden':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  Rainy Day Garden (Reading)')
        case 'reading-g2-library-card':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  New Library Card (Reading)')
        case 'reading-g2-lost-and-found':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  Lost and Found (Reading)')
        case 'reading-g3-lighthouse':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Lighthouse Keepers Trick (Reading)')
        case 'reading-g3-science-fair':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Science Fair Plan (Reading)')
        case 'reading-g3-community-garden':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Community Garden (Reading)')
        case 'reading-g1-red-balloon':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Red Balloon (Reading)')
        case 'reading-g1-big-box':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Big Box (Reading)')
        case 'reading-g1-garden-snail':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Garden Snail (Reading)')
        case 'reading-g1-birthday-cake':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 1  The Birthday Cake (Reading)')
        case 'reading-g2-bird-feeder':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Bird Feeder (Reading)')
        case 'reading-g2-cookie-recipe':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Cookie Recipe (Reading)')
        case 'reading-g2-tree-house':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Tree House (Reading)')
        case 'reading-g2-magic-seeds':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 2  The Magic Seeds (Reading)')
        case 'reading-g3-school-play':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The School Play (Reading)')
        case 'reading-g3-art-project':
            return getTranslatedWorksheetTitle(docId, t, ' Grade 3  The Art Project (Reading)')
        case 'pack':
            return `Todays ${packTime}-Minute Print Pack`
        case 'math-maze':
            return getTranslatedWorksheetTitle(docId, t, ' Math Maze Adventure')
        case 'spelling':
            return getTranslatedWorksheetTitle(docId, t, ' Spelling Challenge Worksheet')
        case 'science-match':
            return getTranslatedWorksheetTitle(docId, t, ' Science Fun Facts Match')
        case 'grammar-detective':
            return getTranslatedWorksheetTitle(docId, t, ' Grammar Detective')
        case 'sudoku4':
            return getTranslatedWorksheetTitle(docId, t, ' Sudoku  44 (Easy)')
        case 'sudoku6':
            return getTranslatedWorksheetTitle(docId, t, ' Sudoku  66 (Medium)')
        case 'place-value-hto':
            return getTranslatedWorksheetTitle(docId, t, ' Place Value (Tens/Ones)')
        case 'skip-count-5-10-120':
            return getTranslatedWorksheetTitle(docId, t, ' Skip Counting by 5s & 10s')
        case 'add-2digit-100':
            return getTranslatedWorksheetTitle(docId, t, ' Add 2-Digit Numbers (to 100)')
        case 'sub-2digit-100':
            return getTranslatedWorksheetTitle(docId, t, ' Subtract 2-Digit Numbers (to 100)')
        case 'word-problems-100':
            return getTranslatedWorksheetTitle(docId, t, ' Word Problems (within 100)')
        case 'compare-2digit':
            return getTranslatedWorksheetTitle(docId, t, ' Compare 2-Digit Numbers')
        case 'even-odd-100':
            return getTranslatedWorksheetTitle(docId, t, ' Even or Odd to 100')
        case 'time-5min':
            return getTranslatedWorksheetTitle(docId, t, ' Tell Time to 5 Minutes')
        case 'color-by-number':
            return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Pages')
        // New 1st Grade worksheets
        case 'number-bonds-10':
            return getTranslatedWorksheetTitle(docId, t, ' Number Bonds to 10')
        case 'count-write-30':
            return getTranslatedWorksheetTitle(docId, t, ' Count & Write 130')
        case 'missing-numbers-50':
            return getTranslatedWorksheetTitle(docId, t, ' Missing Numbers 150')
        case 'picture-addition-10':
            return getTranslatedWorksheetTitle(docId, t, ' Picture Addition to 10')
        case 'subtraction-stories':
            return getTranslatedWorksheetTitle(docId, t, ' Subtraction Stories')
        case 'balance-equations-10':
            return getTranslatedWorksheetTitle(docId, t, ' Balance Equations (to 10)')
        case 'skip-count-2s':
            return getTranslatedWorksheetTitle(docId, t, ' Skip Counting by 2s')
        case 'number-line-add':
            return getTranslatedWorksheetTitle(docId, t, ' Number Line Addition')
        case 'doubles-facts':
            return getTranslatedWorksheetTitle(docId, t, ' Doubles Facts Practice')
        case 'pattern-complete':
            return getTranslatedWorksheetTitle(docId, t, ' Pattern Completion')
        case 'missing-shape':
            return getTranslatedWorksheetTitle(docId, t, ' Find the Missing Shape')
        case 'size-comparison':
            return getTranslatedWorksheetTitle(docId, t, ' Size Comparison')
        // New 2nd Grade worksheets
        case 'expanded-form-200':
            return getTranslatedWorksheetTitle(docId, t, ' Expanded Form to 200')
        case 'number-patterns-200':
            return getTranslatedWorksheetTitle(docId, t, ' Number Patterns to 200')
        case 'rounding-nearest-10':
            return getTranslatedWorksheetTitle(docId, t, ' Rounding to Nearest 10')
        case 'add-three-numbers':
            return getTranslatedWorksheetTitle(docId, t, ' Adding 3 Numbers')
        case 'missing-addends':
            return getTranslatedWorksheetTitle(docId, t, ' Missing Addends')
        case 'fact-families-20':
            return getTranslatedWorksheetTitle(docId, t, ' Fact Families (to 20)')
        case 'mental-math-20':
            if (t) {
                const translated = t('worksheets.mental-math-20.title')
                if (translated && translated !== 'worksheets.mental-math-20.title' && !translated.startsWith('worksheets.')) {
                    return translated
                }
            }
            return ' Mental Math (Add/Sub to 20)'
        case 'number-line-200':
            return getTranslatedWorksheetTitle(docId, t, ' Number Line to 200')
        case 'doubles-near-doubles':
            return getTranslatedWorksheetTitle(docId, t, ' Doubles & Near Doubles')
        case 'money-coins-bills':
            return getTranslatedWorksheetTitle(docId, t, ' Money: Coins & Bills')
        case 'measurement-length':
            return getTranslatedWorksheetTitle(docId, t, ' Measurement: Length')
        case 'bar-graphs-data':
            return getTranslatedWorksheetTitle(docId, t, ' Bar Graphs & Data')
        case 'add-2digit-regrouping':
            return getTranslatedWorksheetTitle(docId, t, ' 2-Digit Addition (WITH Regrouping)')
        case 'sub-2digit-regrouping':
            return getTranslatedWorksheetTitle(docId, t, ' 2-Digit Subtraction (WITH Regrouping)')
        case 'fractions-halves-thirds-fourths':
            return getTranslatedWorksheetTitle(docId, t, ' Fractions: Halves, Thirds, Fourths')
        case 'rhyming-words':
            return getTranslatedWorksheetTitle(docId, t, ' Rhyming Words')
        case 'cvc-words':
            return getTranslatedWorksheetTitle(docId, t, ' CVC Words (Consonant-Vowel-Consonant)')
        case 'sight-words-pre-primer':
            return getTranslatedWorksheetTitle(docId, t, ' Sight Words (Dolch Pre-Primer)')
        case 'letter-tracing-az':
            return getTranslatedWorksheetTitle(docId, t, ' Letter Tracing AZ')
        case 'more-less-equal-10':
            return getTranslatedWorksheetTitle(docId, t, ' More, Less, or Equal? (110)')
        case 'counting-objects-20':
            return getTranslatedWorksheetTitle(docId, t, ' Count the Objects (120)')
        case 'sentence-building':
            return getTranslatedWorksheetTitle(docId, t, ' Sentence Building')
        // Multiplication worksheets
        case 'mult-facts-1-5':
            if (t) {
                const translated = t('worksheets.mult-facts-1-5.title')
                if (translated && translated !== 'worksheets.mult-facts-1-5.title' && !translated.startsWith('worksheets.')) {
                    return translated
                }
            }
            return ' Basic Multiplication Facts (1-5)'
        case 'mult-arrays-2-5':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays (2-5)')
        case 'skip-count-mult':
            return getTranslatedWorksheetTitle(docId, t, ' Skip Counting for Multiplication')
        case 'mult-word-problems-2-3':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Word Problems (2nd-3rd)')
        case 'mult-facts-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Advanced Multiplication Facts (6-12)')
        case 'mult-arrays-models':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays & Models')
        case 'mult-multi-step-word':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
        case 'mult-fact-families':
            return getTranslatedWorksheetTitle(docId, t, ' Fact Families (Multiplication & Division)')
        case 'mult-2x1':
            if (t) {
                const translated = t('worksheets.mult-2x1.title')
                if (translated && translated !== 'worksheets.mult-2x1.title' && !translated.startsWith('worksheets.')) {
                    return translated
                }
            }
            return ' Multi-Digit Multiplication (21)'
        case 'mult-2x2':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (22)')
        case 'mult-area-model':
            return getTranslatedWorksheetTitle(docId, t, ' Area Model Multiplication')
        case 'mult-complex-word':
            return getTranslatedWorksheetTitle(docId, t, ' Complex Word Problems')
        case 'mult-fact-fluency':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Fact Fluency')
        case 'mult-mixed-review':
            return getTranslatedWorksheetTitle(docId, t, ' Mixed Multiplication Review')
        case 'mult-strategies':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Strategies')
        case 'mult-patterns':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Patterns')
        // Times Table worksheets
        case 'times-table-horizontal-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Horizontal Times Table (1-5)')
        case 'times-table-horizontal-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Horizontal Times Table (6-12)')
        case 'times-table-horizontal-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Complete Horizontal Times Table (1-12)')
        case 'times-table-vertical-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Vertical Times Table (1-5)')
        case 'times-table-vertical-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Vertical Times Table (6-12)')
        case 'times-table-vertical-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Complete Vertical Times Table (1-12)')
        case 'times-table-missing-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Missing Number Times Table (1-5)')
        case 'times-table-missing-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Missing Number Times Table (6-12)')
        case 'times-table-missing-mixed':
            return getTranslatedWorksheetTitle(docId, t, ' Mixed Missing Number Challenge')
        case 'times-table-timed-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Timed Times Table Test (1-5)')
        case 'times-table-timed-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Timed Times Table Test (6-12)')
        case 'times-table-timed-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Complete Timed Test (1-12)')
        case 'times-table-blank-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Blank Times Table (1-5) - Fill In')
        case 'times-table-blank-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Blank Times Table (6-12) - Fill In')
        case 'times-table-blank-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Complete Blank Times Table (1-12)')
        case 'times-table-confidence-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Confidence-Building Times Table (1-5)')
        case 'times-table-confidence-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Confidence-Building Times Table (6-12)')
        case 'times-table-fluency-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Times Table Fluency Practice (1-12)')
        case 'times-table-mixed-review':
            return getTranslatedWorksheetTitle(docId, t, ' Mixed Times Table Review')
        case 'times-table-color-1-5':
            return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (1-5)')
        case 'times-table-color-6-12':
            return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (6-12)')
        case 'times-table-color-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Color-by-Number Times Table (1-12)')
        case 'bookmark-templates':
            return getTranslatedWorksheetTitle(docId, t, ' DIY Bookmark Templates')
        case 'design-monster':
            return getTranslatedWorksheetTitle(docId, t, ' Design Your Monster')
        case 'draw-half':
            return getTranslatedWorksheetTitle(docId, t, ' Draw the Missing Half')
        case 'coloring-animals':
            return getTranslatedWorksheetTitle(docId, t, ' Animal Friends Coloring')
        case 'coloring-nature':
            return getTranslatedWorksheetTitle(docId, t, ' Nature & Seasons Coloring')
        case 'coloring-space':
            return getTranslatedWorksheetTitle(docId, t, ' Space Adventure Coloring')
        case 'coloring-vehicles':
            return getTranslatedWorksheetTitle(docId, t, ' Vehicles & Transport Coloring')
        case 'coloring-letters-numbers':
            return getTranslatedWorksheetTitle(docId, t, ' Alphabet & Number Coloring')
        case 'coloring-heroes':
            return getTranslatedWorksheetTitle(docId, t, ' Superheroes & Everyday Heroes')
        case 'coloring':
            return getTranslatedWorksheetTitle(docId, t, ' Coloring Page  Cute Animal')
        case 'hidden-object':
            return getTranslatedWorksheetTitle(docId, t, ' Find the Hidden Object')
        case 'maze-focus':
            return getTranslatedWorksheetTitle(docId, t, ' Maze of Focus')
        case 'ws-animals':
            return getTranslatedWorksheetTitle(docId, t, ' Word Search  Animals')
        case 'ws-space':
            return getTranslatedWorksheetTitle(docId, t, ' Word Search  Space')
        case 'logic-grid':
            return getTranslatedWorksheetTitle(docId, t, ' Logic Grid Puzzle')
        case 'gratitude-jar':
            return getTranslatedWorksheetTitle(docId, t, ' Gratitude Jar Worksheet')
        case 'mood-tracker':
            return getTranslatedWorksheetTitle(docId, t, ' Mood Tracker Coloring Page')
        case 'mandalas':
            return getTranslatedWorksheetTitle(docId, t, ' Mindful Coloring Mandalas')
        case 'weekly-goals':
            return getTranslatedWorksheetTitle(docId, t, ' My Goals for the Week')
        case 'halloween-pack':
            return getTranslatedWorksheetTitle(docId, t, ' Halloween Puzzle Pack')
        case 'winter-kindness':
            return getTranslatedWorksheetTitle(docId, t, ' Winter Kindness Challenge')
        case 'spring-scavenger':
            return getTranslatedWorksheetTitle(docId, t, ' Spring Nature Scavenger Hunt')
        case 'summer-pack':
            return getTranslatedWorksheetTitle(docId, t, ' Summer Adventure Pack')
        case 'brain-boost':
            return getTranslatedWorksheetTitle(docId, t, ' 7-Day Brain Boost Pack')
        case 'creative-challenge':
            return getTranslatedWorksheetTitle(docId, t, ' Creative Kids Challenge')
        case 'ws-world':
            return getTranslatedWorksheetTitle(docId, t, ' Around the World Word Search')
        case 'animal-pack':
            return getTranslatedWorksheetTitle(docId, t, ' Animal Adventure Pack')
        case 'geo-continents-k2':
            return getTranslatedWorksheetTitle(docId, t, ' Label the 7 Continents (K2)')
        case 'geo-compass-rose':
            return getTranslatedWorksheetTitle(docId, t, ' Compass Rose & Directions')
        case 'geo-landforms':
            return getTranslatedWorksheetTitle(docId, t, ' Landforms vs Water Bodies')
        case 'geo-latlong':
            return getTranslatedWorksheetTitle(docId, t, ' Latitude & Longitude Basics')
        // Interactive Worksheets - Math
        case 'interactive-math-rhythm':
            return getTranslatedWorksheetTitle(docId, t, ' Number Pattern Rhythm')
        case 'interactive-math-race':
            return getTranslatedWorksheetTitle(docId, t, ' Math Race Challenge')
        case 'interactive-math-puzzle':
            return getTranslatedWorksheetTitle(docId, t, ' Equation Puzzle Box')
        case 'interactive-math-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Geometry Shape Challenge')
        case 'interactive-math-money':
            return getTranslatedWorksheetTitle(docId, t, ' Money Math Mastery')
        case 'interactive-math-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Fraction Fun Practice')
        case 'interactive-math-measurement':
            return getTranslatedWorksheetTitle(docId, t, ' Measurement Mission')
        // Interactive Worksheets - Reading
        case 'interactive-reading-adventure':
            return getTranslatedWorksheetTitle(docId, t, ' Reading Adventure Quest')
        case 'interactive-reading-detective':
            return getTranslatedWorksheetTitle(docId, t, ' Reading Detective Challenge')
        case 'interactive-reading-vocab':
            return getTranslatedWorksheetTitle(docId, t, ' Vocabulary Builder Workshop')
        case 'interactive-reading-summary':
            return getTranslatedWorksheetTitle(docId, t, ' Summary & Main Idea')
        case 'interactive-reading-compare':
            return getTranslatedWorksheetTitle(docId, t, ' Compare & Contrast Passages')
        case 'interactive-reading-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Picture Story Time')
        case 'interactive-reading-storymap':
            return getTranslatedWorksheetTitle(docId, t, ' Story Map Builders')
        // Interactive Worksheets - Writing
        case 'interactive-writing-prompts':
            return getTranslatedWorksheetTitle(docId, t, ' Creative Writing Prompts')
        case 'interactive-writing-sentences':
            return getTranslatedWorksheetTitle(docId, t, ' Sentence Builder Workshop')
        case 'interactive-writing-poetry':
            return getTranslatedWorksheetTitle(docId, t, ' Poetry Writing Practice')
        case 'interactive-writing-opinion':
            return getTranslatedWorksheetTitle(docId, t, ' Opinion Writing Framework')
        case 'interactive-writing-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Drawing & Labeling')
        // Interactive Worksheets - Science
        case 'interactive-science-observation':
            return getTranslatedWorksheetTitle(docId, t, ' Science Observation Journal')
        case 'interactive-science-lifecycle':
            return getTranslatedWorksheetTitle(docId, t, ' Life Cycle Explorer')
        case 'interactive-science-states':
            return getTranslatedWorksheetTitle(docId, t, ' States of Matter Lab')
        case 'interactive-science-weather':
            return getTranslatedWorksheetTitle(docId, t, ' Weather Watcher Journal')
        case 'interactive-science-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Nature Explorer')
        case 'interactive-science-space':
            return getTranslatedWorksheetTitle(docId, t, ' Space & Astronomy Explorer')
        // Interactive Worksheets - Geography
        case 'interactive-geography-map':
            return getTranslatedWorksheetTitle(docId, t, ' Interactive Map Skills')
        case 'interactive-geography-culture':
            return getTranslatedWorksheetTitle(docId, t, ' Culture Explorer')
        case 'interactive-geography-history':
            return getTranslatedWorksheetTitle(docId, t, ' Historical Timeline Builder')
        case 'interactive-geography-prek':
            return getTranslatedWorksheetTitle(docId, t, ' My Community Explorer')
        // Interactive Worksheets - Grammar
        case 'interactive-grammar-parts':
            return getTranslatedWorksheetTitle(docId, t, ' Parts of Speech Practice')
        case 'interactive-grammar-tenses':
            return getTranslatedWorksheetTitle(docId, t, ' Verb Tense Mastery')
        case 'interactive-grammar-antonyms':
            return getTranslatedWorksheetTitle(docId, t, ' Synonyms & Antonyms Challenge')
        case 'interactive-grammar-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Word & Picture Match')
        // Interactive Worksheets - Art
        case 'interactive-art-design':
            return getTranslatedWorksheetTitle(docId, t, ' Creative Design Challenge')
        case 'interactive-art-colorwheel':
            return getTranslatedWorksheetTitle(docId, t, ' Color Theory Practice')
        case 'interactive-art-sketch':
            return getTranslatedWorksheetTitle(docId, t, ' Sketch & Observe')
        // Interactive Worksheets - Early Learning
        case 'interactive-early-phonics':
            return getTranslatedWorksheetTitle(docId, t, ' Phonics Fun Practice')
        case 'interactive-early-counting':
            return getTranslatedWorksheetTitle(docId, t, ' Counting & Number Recognition')
        case 'interactive-early-patterns':
            return getTranslatedWorksheetTitle(docId, t, ' Pattern Recognition Explorer')
        case 'interactive-early-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Shape & Color Explorer')
        case 'interactive-early-letters':
            return getTranslatedWorksheetTitle(docId, t, ' Letter Formation Practice')
        case 'interactive-early-numbers':
            return getTranslatedWorksheetTitle(docId, t, ' Number Writing & Recognition')
        case 'interactive-early-foundations':
            return getTranslatedWorksheetTitle(docId, t, ' Foundational Skills Review')
        case 'interactive-early-basics':
            return getTranslatedWorksheetTitle(docId, t, ' Basic Skills Practice')
        // Interactive Worksheets - Logic
        case 'interactive-logic-sequence':
            return getTranslatedWorksheetTitle(docId, t, ' Sequencing Challenge')
        case 'interactive-logic-riddles':
            return getTranslatedWorksheetTitle(docId, t, ' Brain Teaser Riddles')
        case 'interactive-logic-deduction':
            return getTranslatedWorksheetTitle(docId, t, ' Deductive Reasoning Quest')
        case 'interactive-logic-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Simple Patterns & Sorting')
        // Interactive Worksheets - SEL
        case 'interactive-sel-mindfulness':
            return getTranslatedWorksheetTitle(docId, t, ' Mindfulness & Reflection')
        case 'interactive-sel-empathy':
            return getTranslatedWorksheetTitle(docId, t, ' Empathy Builder')
        case 'interactive-sel-goals':
            return getTranslatedWorksheetTitle(docId, t, ' Goal Setting & Growth')
        case 'interactive-sel-prek':
            return getTranslatedWorksheetTitle(docId, t, ' Feelings & Emotions Explorer')
        // Kindergarten worksheets
        case 'count-circle-1-10':
            if (t) {
                const translated = t('worksheets.count-circle-1-10.title')
                if (translated && translated !== 'worksheets.count-circle-1-10.title' && !translated.startsWith('worksheets.')) {
                    return translated
                }
            }
            return ' Count & Circle 110'
        case 'count-match-1-20':
            return getTranslatedWorksheetTitle(docId, t, ' Count & Match 120')
        case 'how-many-1-15':
            return getTranslatedWorksheetTitle(docId, t, ' How Many? (115)')
        case 'count-color-1-10':
            return getTranslatedWorksheetTitle(docId, t, ' Count & Color (110)')
        case 'number-id-1-10':
            // Use translation if available, otherwise fallback to English
            if (context.t) {
                const translated = context.t('worksheets.number-id-1-10.title')
                if (translated && translated !== 'worksheets.number-id-1-10.title') {
                    return ` ${translated}`
                }
            }
            return ' Number Identification 110'
        case 'number-matching-1-15':
            return getTranslatedWorksheetTitle(docId, t, ' Number Matching 115')
        case 'number-order-1-20':
            return getTranslatedWorksheetTitle(docId, t, ' Number Order 120')
        case 'find-number-1-10':
            return getTranslatedWorksheetTitle(docId, t, ' Find the Number (110)')
        case 'shape-identification':
            return getTranslatedWorksheetTitle(docId, t, ' Shape Identification')
        case 'color-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Color the Shapes')
        case 'shape-sorting':
            return getTranslatedWorksheetTitle(docId, t, ' Shape Sorting')
        case 'color-recognition':
            return getTranslatedWorksheetTitle(docId, t, ' Color Recognition')
        case 'draw-shape':
            return getTranslatedWorksheetTitle(docId, t, ' Draw the Shape')
        case 'ab-pattern':
            return getTranslatedWorksheetTitle(docId, t, ' AB Pattern Completion')
        case 'color-patterns':
            return getTranslatedWorksheetTitle(docId, t, ' Color Patterns')
        case 'shape-patterns':
            return getTranslatedWorksheetTitle(docId, t, ' Shape Patterns')
        case 'what-comes-next':
            return getTranslatedWorksheetTitle(docId, t, ' What Comes Next?')
        case 'big-small':
            return getTranslatedWorksheetTitle(docId, t, ' Big and Small')
        case 'more-less':
            return getTranslatedWorksheetTitle(docId, t, ' More and Less')
        case 'long-short':
            return getTranslatedWorksheetTitle(docId, t, ' Long and Short')
        case 'heavy-light':
            return getTranslatedWorksheetTitle(docId, t, ' Heavy and Light')
        case 'same-different':
            return getTranslatedWorksheetTitle(docId, t, ' Same and Different')
        case 'line-tracing':
            return getTranslatedWorksheetTitle(docId, t, ' Line Tracing')
        case 'curve-tracing':
            return getTranslatedWorksheetTitle(docId, t, ' Curve Tracing')
        case 'zigzag-lines':
            return getTranslatedWorksheetTitle(docId, t, ' Zigzag Lines')
        case 'path-tracing':
            return getTranslatedWorksheetTitle(docId, t, ' Path Tracing')
        // 3rd Grade worksheets
        case 'mult-facts-0-12':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Facts 012')
        case 'mult-arrays':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Arrays')
        case 'mult-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplication Word Problems')
        case 'mult-by-10-100':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplying by 10, 100')
        case 'mult-properties':
            return getTranslatedWorksheetTitle(docId, t, ' Properties of Multiplication')
        case 'div-facts-1-12':
            return getTranslatedWorksheetTitle(docId, t, ' Division Facts 112')
        case 'div-with-remainders':
            return getTranslatedWorksheetTitle(docId, t, ' Division with Remainders')
        case 'div-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Division Word Problems')
        case 'fact-families-mult-div':
            return getTranslatedWorksheetTitle(docId, t, ' Fact Families (Mult/Div)')
        case 'div-by-10-100':
            return getTranslatedWorksheetTitle(docId, t, ' Dividing by 10, 100')
        case 'fractions-whole':
            return getTranslatedWorksheetTitle(docId, t, ' Fractions: Parts of a Whole')
        case 'comparing-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Comparing Fractions')
        case 'equivalent-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Equivalent Fractions')
        case 'fractions-number-line':
            return getTranslatedWorksheetTitle(docId, t, ' Fractions on a Number Line')
        case 'add-sub-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Fractions')
        case 'multi-step-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
        case 'elapsed-time-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Elapsed Time Word Problems')
        case 'money-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Money Word Problems')
        case 'perimeter-area-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Perimeter & Area Word Problems')
        case 'identify-polygons':
            return getTranslatedWorksheetTitle(docId, t, ' Identify Polygons')
        case 'perimeter-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Perimeter of Shapes')
        case 'area-rectangles':
            return getTranslatedWorksheetTitle(docId, t, ' Area of Rectangles')
        case 'lines-rays-angles':
            return getTranslatedWorksheetTitle(docId, t, ' Lines, Rays, and Angles')
        case 'symmetry':
            return getTranslatedWorksheetTitle(docId, t, ' Symmetry')
        case 'time-to-minute':
            return getTranslatedWorksheetTitle(docId, t, ' Time to the Minute')
        case 'customary-units':
            return getTranslatedWorksheetTitle(docId, t, ' Customary Units')
        case 'metric-units':
            return getTranslatedWorksheetTitle(docId, t, ' Metric Units')
        case 'liquid-measurement':
            return getTranslatedWorksheetTitle(docId, t, ' Liquid Measurement')
        case 'mass-weight':
            return getTranslatedWorksheetTitle(docId, t, ' Mass and Weight')
        // 4th Grade worksheets
        case 'mult-2x1-digit':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (21)')
        case 'mult-2x2-digit':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (22)')
        case 'long-division-1digit':
            return getTranslatedWorksheetTitle(docId, t, ' Long Division (1-Digit Divisor)')
        case 'long-division-2digit':
            return getTranslatedWorksheetTitle(docId, t, ' Long Division (2-Digit Divisor)')
        case 'area-model-mult':
            return getTranslatedWorksheetTitle(docId, t, ' Area Model Multiplication')
        case 'partial-products':
            return getTranslatedWorksheetTitle(docId, t, ' Partial Products Multiplication')
        case 'equivalent-fractions-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Equivalent Fractions')
        case 'comparing-fractions-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Comparing Fractions')
        case 'add-sub-fractions-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Fractions')
        case 'mixed-improper-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Mixed Numbers & Improper Fractions')
        case 'decimals-place-value':
            return getTranslatedWorksheetTitle(docId, t, ' Decimals: Place Value')
        case 'comparing-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Comparing & Ordering Decimals')
        case 'add-sub-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Decimals')
        case 'fractions-to-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Fractions to Decimals')
        case 'classifying-angles':
            return getTranslatedWorksheetTitle(docId, t, ' Classifying Angles')
        case 'area-perimeter-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Area & Perimeter')
        case 'lines-angles-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Lines & Angles')
        case 'classifying-triangles':
            return getTranslatedWorksheetTitle(docId, t, ' Classifying Triangles')
        case 'classifying-quadrilaterals':
            return getTranslatedWorksheetTitle(docId, t, ' Classifying Quadrilaterals')
        case 'symmetry-transformations':
            return getTranslatedWorksheetTitle(docId, t, ' Symmetry & Transformations')
        case 'customary-conversion':
            return getTranslatedWorksheetTitle(docId, t, ' Customary Units Conversion')
        case 'metric-conversion':
            return getTranslatedWorksheetTitle(docId, t, ' Metric Units Conversion')
        case 'elapsed-time-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Elapsed Time')
        case 'liquid-measurement-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Liquid Measurement')
        case 'mass-weight-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Mass and Weight')
        case 'multi-step-word-4th':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
        case 'fraction-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Fraction Word Problems')
        case 'decimal-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Decimal Word Problems')
        case 'measurement-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Measurement Word Problems')
        case 'geometry-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Geometry Word Problems')
        case 'line-plots':
            return getTranslatedWorksheetTitle(docId, t, ' Line Plots')
        case 'bar-graphs-pictographs':
            return getTranslatedWorksheetTitle(docId, t, ' Bar Graphs & Pictographs')
        case 'mean-median-mode':
            return getTranslatedWorksheetTitle(docId, t, ' Mean, Median, Mode')
        // 5th Grade worksheets
        case 'mult-3x2-digit':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Digit Multiplication (32)')
        case 'long-division-multidigit':
            return getTranslatedWorksheetTitle(docId, t, ' Long Division (Multi-Digit)')
        case 'order-of-operations':
            return getTranslatedWorksheetTitle(docId, t, ' Order of Operations')
        case 'pemdas-basic':
            return getTranslatedWorksheetTitle(docId, t, 'Basic Order of Operations (PEMDAS)')
        case 'pemdas-parentheses':
            return getTranslatedWorksheetTitle(docId, t, 'PEMDAS with Parentheses')
        case 'pemdas-practice':
            return getTranslatedWorksheetTitle(docId, t, 'Order of Operations Practice Sheet')
        case 'pemdas-exponents':
            return getTranslatedWorksheetTitle(docId, t, 'PEMDAS with Exponents')
        case 'pemdas-multistep':
            return getTranslatedWorksheetTitle(docId, t, 'Multi-Step PEMDAS Problems')
        case 'pemdas-word-problems':
            return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Word Problems')
        case 'pemdas-advanced':
            return getTranslatedWorksheetTitle(docId, t, 'Advanced Parentheses and Exponents')
        case 'pemdas-complex':
            return getTranslatedWorksheetTitle(docId, t, 'Complex PEMDAS Expressions')
        case 'pemdas-rules':
            return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Rules and Practice')
        case 'pemdas-mixed-review':
            return getTranslatedWorksheetTitle(docId, t, 'Mixed PEMDAS Review')
        case 'pemdas-fluency':
            return getTranslatedWorksheetTitle(docId, t, 'PEMDAS Fluency Practice')
        case 'pemdas-step-by-step':
            return getTranslatedWorksheetTitle(docId, t, 'Step-by-Step PEMDAS Guide')
        case 'powers-of-10':
            return getTranslatedWorksheetTitle(docId, t, ' Powers of 10')
        case 'rounding-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Rounding Decimals')
        case 'estimating-sums-differences':
            return getTranslatedWorksheetTitle(docId, t, ' Estimating Sums & Differences')
        case 'add-sub-mixed-numbers':
            return getTranslatedWorksheetTitle(docId, t, ' Adding & Subtracting Mixed Numbers')
        case 'multiplying-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplying Fractions')
        case 'dividing-fractions':
            return getTranslatedWorksheetTitle(docId, t, ' Dividing Fractions')
        case 'multiplying-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Multiplying Decimals')
        case 'dividing-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Dividing Decimals')
        case 'fractions-decimals-percents':
            return getTranslatedWorksheetTitle(docId, t, ' Fractions, Decimals, & Percents')
        case 'comparing-ordering-fractions-decimals':
            return getTranslatedWorksheetTitle(docId, t, ' Comparing & Ordering Fractions/Decimals')
        case 'evaluating-expressions':
            return getTranslatedWorksheetTitle(docId, t, ' Evaluating Expressions')
        case 'writing-expressions':
            return getTranslatedWorksheetTitle(docId, t, ' Writing Expressions')
        case 'solving-one-step-equations':
            return getTranslatedWorksheetTitle(docId, t, ' Solving One-Step Equations')
        case 'patterns-rules':
            return getTranslatedWorksheetTitle(docId, t, ' Patterns & Rules')
        case 'coordinate-graphing':
            return getTranslatedWorksheetTitle(docId, t, ' Coordinate Graphing')
        case 'volume-rectangular-prisms':
            return getTranslatedWorksheetTitle(docId, t, ' Volume of Rectangular Prisms')
        case 'area-triangles-parallelograms':
            return getTranslatedWorksheetTitle(docId, t, ' Area of Triangles & Parallelograms')
        case 'classifying-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Classifying 2D & 3D Shapes')
        case 'nets-3d-shapes':
            return getTranslatedWorksheetTitle(docId, t, ' Nets of 3D Shapes')
        case 'transformations-5th':
            return getTranslatedWorksheetTitle(docId, t, ' Transformations')
        case 'multi-step-word-5th':
            return getTranslatedWorksheetTitle(docId, t, ' Multi-Step Word Problems')
        case 'fraction-word-problems-5th':
            return getTranslatedWorksheetTitle(docId, t, ' Fraction Word Problems')
        case 'decimal-word-problems-5th':
            return getTranslatedWorksheetTitle(docId, t, ' Decimal Word Problems')
        case 'ratio-proportion-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Ratio & Proportion Word Problems')
        case 'percent-word-problems':
            return getTranslatedWorksheetTitle(docId, t, ' Percent Word Problems')
        case 'line-graphs':
            return getTranslatedWorksheetTitle(docId, t, ' Line Graphs')
        case 'mean-median-mode-range':
            return getTranslatedWorksheetTitle(docId, t, ' Mean, Median, Mode, Range')
        case 'stem-leaf-plots':
            return getTranslatedWorksheetTitle(docId, t, ' Stem-and-Leaf Plots')
        case 'probability':
            return getTranslatedWorksheetTitle(docId, t, ' Probability')
        case 'adding-decimals-challenge':
            return getTranslatedWorksheetTitle(docId, t, ' Adding Decimals Challenge')
    }
}

interface StrategySpotlightProps {
    title: string;
    icon: string;
    steps: { label: string; text: string }[];
    color: string;
    className?: string;
}

export function StrategySpotlight({ title, icon, steps, color, className = "" }: StrategySpotlightProps) {
    // Map color name to Tailwind classes
    const colorMap: Record<string, { border: string, bg: string, text: string, iconBg: string }> = {
        purple: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900', iconBg: 'bg-purple-100' },
        blue: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900', iconBg: 'bg-blue-100' },
        green: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', iconBg: 'bg-green-100' },
        indigo: { border: 'border-indigo-200', bg: 'bg-indigo-50', text: 'text-indigo-900', iconBg: 'bg-indigo-100' },
        pink: { border: 'border-pink-200', bg: 'bg-pink-50', text: 'text-pink-900', iconBg: 'bg-pink-100' },
        emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-900', iconBg: 'bg-emerald-100' },
        orange: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', iconBg: 'bg-orange-100' },
        red: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-900', iconBg: 'bg-red-100' },
        yellow: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', iconBg: 'bg-yellow-100' },
        cyan: { border: 'border-cyan-200', bg: 'bg-cyan-50', text: 'text-cyan-900', iconBg: 'bg-cyan-100' },
        teal: { border: 'border-teal-200', bg: 'bg-teal-50', text: 'text-teal-900', iconBg: 'bg-teal-100' },
    };

    const theme = colorMap[color] || colorMap.blue;

    return (
        <div className={`mb-8 page-break-inside-avoid break-inside-avoid ${className}`}>
            <div className={`bg-white border-2 ${theme.border} rounded-xl p-6 shadow-sm relative overflow-hidden`}>
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center text-xl shadow-inner`}>
                        {icon}
                    </div>
                    <h3 className={`font-bold text-lg ${theme.text}`}>
                        {title}
                    </h3>
                </div>

                <div className="space-y-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full ${theme.bg.replace('50', '600')} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                                {idx + 1}
                            </div>
                            <div className="text-sm text-slate-700">
                                <strong>{step.label}:</strong> {step.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
