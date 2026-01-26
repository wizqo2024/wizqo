import React, {
  Component,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  useReducer,
  isValidElement,
  memo,
  lazy,
  Suspense,
  ReactNode,
  ErrorInfo,
  FC,
  CSSProperties,
  ComponentType,
  MouseEvent
} from 'react'
import { removeLocaleFromPath, getLocaleFromURL, addLocaleToPath } from '@/utils/locale';
import { useTranslation } from '@/context/TranslationContext'
import { WizqoLogo } from '@/components/WizqoLogo'
import InteractiveBundleSections from '@/components/InteractiveBundleSections'
import { PRINTABLE_BUNDLE_SECTIONS, getPrintableSectionForDoc } from '@/data/printableBundles'
import { INTERACTIVE_CATEGORIES } from '@shared/interactive/interactiveWorksheets'
import { getWorksheetSEOBySlug } from '@shared/worksheetSEO'
import { formatNumber } from '@/utils/numbers'

import { WorksheetFooter, ProblemBox, WorksheetHeader } from '@/components/worksheet'
import {
  WorksheetSectionWrapper,
  PremiumWorksheetBanner,
  StrategySpotlight,
  getWorksheetTheme,
  resolveDocTitle,
  getTranslatedWorksheetTitle
} from './printables/PrintableShared'
// Local components defined below to avoid conflicts
import { makeRng, pick, pickNUnique, shuffleArray, buildWords } from '@/utils/printableUtils'
import { SpecificWorksheetProps } from '../types/printable';
import { generateWorksheetPDF } from '@/utils/pdfGenerator';

import { MathRenderer } from './printables/renderer/MathRenderer';
import { LanguageRenderer } from './printables/renderer/LanguageRenderer';
import { EarlyLearnerRenderer } from './printables/renderer/EarlyLearnerRenderer';
import { HolidayRenderer } from './printables/renderer/HolidayRenderer';

import {
  trackWorksheetDownload,
  trackWorksheetView,
  trackPrintDialog,
  trackAnswerKeyToggle,
  trackTimeOnPage,
  trackScrollDepth,
  trackUserFlow
} from '@/utils/analytics'




const INTERACTIVE_DOC_IDS = INTERACTIVE_CATEGORIES.flatMap((category) => category.docs.map((doc) => doc.id))

const BUNDLE_DOC_ALLOWLIST = new Set<string>([
  ...Object.values(PRINTABLE_BUNDLE_SECTIONS).flat(),
  ...INTERACTIVE_DOC_IDS,
])

const ANSWERABLE_BASE_DOC_IDS = [
  'coloring',
  'design-monster',
  'rhyming-words',
  'science-match',
  'spelling',
  'logic-grid',
  'grammar-detective',
  'math-maze',
  'factors-multiples',
  'prime-composite',
  // Reading print views
  'reading-mini-1',
  'reading-g1-lost-hat',
  'reading-g1-ants',
  'reading-g1-bus-ride',
  'reading-g1-pet-fish',
  'reading-g1-red-balloon',
  'reading-g1-big-box',
  'reading-g1-garden-snail',
  'reading-g1-birthday-cake',
  'reading-g2-paper-bridge',
  'reading-g2-rainy-garden',
  'reading-g2-library-card',
  'reading-g2-lost-and-found',
  'reading-g2-bird-feeder',
  'reading-g2-cookie-recipe',
  'reading-g2-tree-house',
  'reading-g2-magic-seeds',
  'reading-g3-lighthouse',
  'reading-g3-science-fair',
  'reading-g3-community-garden',
  'reading-g3-school-play',
  'reading-g3-art-project',
  // 2nd grade math printables
  'place-value-hto',
  'skip-count-5-10-120',
  'add-2digit-100',
  'sub-2digit-100',
  'add-2digit-regrouping',
  'sub-2digit-regrouping',
  'word-problems-100',
  'compare-2digit',
  'even-odd-100',
  // New 1st Grade worksheets
  'number-bonds-10',
  'count-write-30',
  'missing-numbers-50',
  'picture-addition-10',
  'subtraction-stories',
  'balance-equations-10',
  'skip-count-2s',
  'number-line-add',
  'doubles-facts',
  'pattern-complete',
  'missing-shape',
  'size-comparison',
  'color-by-number',
  'cvc-words',
  'sentence-building',
  'sight-words-pre-primer',
  'fractions-halves-thirds-fourths',
  // New 2nd Grade worksheets
  'expanded-form-200',
  'number-patterns-200',
  'rounding-nearest-10',
  'add-three-numbers',
  'missing-addends',
  'fact-families-20',
  'mental-math-20',
  'number-line-200',
  'doubles-near-doubles',
  // Multiplication worksheets
  'mult-fact-families',
  'mult-facts-1-5',
  'mult-arrays-2-5',
  'mult-arrays',
  'skip-count-mult',
  'mult-word-problems-2-3',
  'mult-facts-6-12',
  'mult-arrays-models',
  'mult-multi-step-word',
  'times-table-horizontal-1-5', 'times-table-horizontal-6-12', 'times-table-horizontal-1-12',
  'times-table-vertical-1-5', 'times-table-vertical-6-12', 'times-table-vertical-1-12',
  'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed',
  'times-table-timed-1-5', 'times-table-timed-6-12', 'times-table-timed-1-12',
  'times-table-mixed-review', 'times-table-fluency-1-12',
  'times-table-blank-1-5', 'times-table-blank-6-12', 'times-table-blank-1-12',
  'times-table-color-1-5', 'times-table-color-6-12', 'times-table-color-1-12',
  'times-table-confidence-1-5', 'times-table-confidence-6-12',
  'mult-horizontal', 'mult-vertical', 'mult-missing', 'mult-timed',
  'mult-2x1',
  'mult-2x2',
  'mult-area-model',
  'mult-complex-word',
  'mult-fact-fluency',
  'mult-mixed-review',
  'mult-strategies',
  'mult-patterns',
  'mult-lattice',
  // Times Table worksheets
  'times-table-horizontal-1-5',
  'times-table-horizontal-6-12',
  'times-table-horizontal-1-12',
  'times-table-vertical-1-5',
  'times-table-vertical-6-12',
  'times-table-vertical-1-12',
  'times-table-missing-1-5',
  'times-table-missing-6-12',
  'times-table-missing-mixed',
  'times-table-timed-1-5',
  'times-table-timed-6-12',
  'times-table-timed-1-12',
  'times-table-blank-1-5',
  'times-table-blank-6-12',
  'times-table-blank-1-12',
  'times-table-confidence-1-5',
  'times-table-confidence-6-12',
  'times-table-fluency-1-12',
  'times-table-mixed-review',
  'times-table-color-1-5',
  'times-table-color-6-12',
  'times-table-color-1-12',

  'money-coins-bills',
  'measurement-length',
  'bar-graphs-data',
  'time-5min',
  'more-less',
  'more-less-equal-10',
  // Kindergarten worksheets
  'count-circle-1-10',
  'count-match-1-20',
  'how-many-1-15',
  'count-color-1-10',
  'counting-objects-20',
  'number-id-1-10',
  'number-tracing-1-10',
  'number-tracing-1-20',
  'number-matching-1-15',
  'number-order-1-20',
  'find-number-1-10',
  'shape-identification',
  'color-shapes',
  'shape-sorting',
  'color-recognition',
  'draw-shape',
  'ab-pattern',
  'color-patterns',
  'shape-patterns',
  'what-comes-next',
  'big-small',

  'long-short',
  'heavy-light',
  'same-different',
  'line-tracing',
  'curve-tracing',
  'zigzag-lines',
  'path-tracing',
  // New Kindergarten worksheets (code-based)
  'kindergarten-counting-1-10',
  'kindergarten-number-recognition',
  'kindergarten-shapes',
  'kindergarten-patterns',
  'kindergarten-addition-pictures',
  'kindergarten-counting-visual',
  // 3rd Grade worksheets
  'mult-facts-0-12',

  'mult-word-problems',
  'mult-by-10-100',
  'mult-properties',
  'div-facts-1-12',
  'div-with-remainders',
  'div-word-problems',
  'fact-families-mult-div',
  'div-by-10-100',
  'fractions-whole',
  'comparing-fractions',
  'equivalent-fractions',
  'fractions-number-line',
  'add-sub-fractions',
  // Fractions to Decimals
  'fractions-to-decimals-basic-tenths',
  'decimals-place-value',
  'comparing-decimals',
  'mixed-improper-fractions',
  'comparing-ordering-fractions-decimals',
  'fractions-to-decimals-division',
  'fraction-word-problems',
  'fractions-decimals-percents-advanced',
  'add-sub-decimals',
  'decimal-word-problems',
  'ordering-fractions-decimals',
  'fractions-decimals-percents',
  'percent-word-problems',
  'fractions-out-of-100',
  'percent-to-decimal',
  'decimal-to-percent',
  'equivalent-fractions-4th',
  'add-sub-fractions-4th',
  'multi-step-word-problems',
  'elapsed-time-word-problems',
  'money-word-problems',
  'perimeter-area-word-problems',
  'identify-polygons',
  'perimeter-shapes',
  'area-rectangles',
  'lines-rays-angles',
  'symmetry',
  'time-to-minute',
  'customary-units',
  'metric-units',
  'liquid-measurement',
  'mass-weight',
  // 4th Grade worksheets
  'mult-2x1-digit',
  'mult-2x2-digit',
  'long-division-1digit',
  'long-division-2digit',
  'area-model-mult',
  'partial-products',
  'equivalent-fractions-4th',
  'comparing-fractions-4th',
  'add-sub-fractions-4th',
  'mixed-improper-fractions',
  'decimals-place-value',
  'comparing-decimals',
  'add-sub-decimals',
  'fractions-to-decimals',
  'fractions-to-decimals-basic-tenths',
  'fractions-to-decimals-division',
  'classifying-angles',
  'area-perimeter-4th',
  'lines-angles-4th',
  'classifying-triangles',
  'classifying-quadrilaterals',
  'symmetry-transformations',
  'customary-conversion',
  'metric-conversion',
  'elapsed-time-4th',
  'liquid-measurement-4th',
  'mass-weight-4th',
  'multi-step-word-4th',
  'fraction-word-problems',
  'decimal-word-problems',
  'measurement-word-problems',
  'geometry-word-problems',
  'line-plots',
  'bar-graphs-pictographs',
  'mean-median-mode',
  // 5th Grade worksheets
  'mult-3x2-digit',
  'long-division-multidigit',
  'order-of-operations',
  'pemdas-basic',
  'pemdas-parentheses',
  'pemdas-practice',
  'pemdas-exponents',
  'pemdas-multistep',
  'pemdas-word-problems',
  'pemdas-advanced',
  'pemdas-complex',
  'pemdas-rules',
  'pemdas-mixed-review',
  'pemdas-fluency',
  'pemdas-step-by-step',
  'powers-of-10',
  'rounding-decimals',
  'estimating-sums-differences',
  'add-sub-mixed-numbers',

  'multiplying-decimals',
  'dividing-decimals',
  'fractions-decimals-percents',
  'comparing-ordering-fractions-decimals',
  'evaluating-expressions',
  'writing-expressions',
  'solving-one-step-equations',
  'patterns-rules',
  'coordinate-graphing',
  'volume-rectangular-prisms',
  'area-triangles-parallelograms',
  'classifying-shapes',
  'nets-3d-shapes',
  'transformations-5th',
  'multi-step-word-5th',
  'fraction-word-problems-5th',
  'decimal-word-problems-5th',
  'ratio-proportion-word-problems',
  'percent-word-problems',
  'line-graphs',
  'mean-median-mode-range',
  'stem-leaf-plots',
  'probability',
  'adding-decimals-challenge',
  'add-sub-fractions-unlike',
  'mixed-numbers-add-sub',
  'fraction-mult-whole',
  'fraction-mult',
  'div-fractions',
  // Geography worksheets
  'geo-continents-k2',
  'geo-compass-rose',
  'geo-landforms',
  'geo-latlong',
]





// Generate a seed based on today's date for consistent daily content
const today = new Date()
const todaySeed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

export function PrintablesPage({ docId: propDocId }: { docId?: string } = {}) {
  const { t, language } = useTranslation()

  // Force re-render when language changes (important for /print route with ?lang=ar)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    // Force re-render when language changes to ensure translations update
    forceUpdate()
  }, [language])

  // Helper function to get translations with fallback
  // Include language in dependencies to ensure it updates when language changes
  const getTrans = useCallback((key: string, fallback: string) => {
    try {
      if (!t || typeof t !== 'function') {
        return fallback
      }
      const result = t(key)
      // Debug: Log if translation is missing
      if (typeof window !== 'undefined' && import.meta.env.DEV &&
        key.includes('number-id-1-10') && (result === key || (typeof result === 'string' && result.startsWith('worksheets.')))) {
        console.warn(`[PrintablesPage] Translation missing for key: ${key}, language: ${language}, result: ${result}`)
      }
      // If result is the key itself, translation is missing - use fallback
      if (typeof result === 'string' && result === key) {
        return fallback
      }
      // If result starts with 'worksheets.', it's likely a missing translation key - use fallback
      if (typeof result === 'string' && result.startsWith('worksheets.')) {
        return fallback
      }
      // If result is empty or falsy, use fallback
      if (!result || (typeof result === 'string' && result.trim() === '')) {
        return fallback
      }
      return result
    } catch (error) {
      return fallback
    }
  }, [t, language])

  // CRITICAL: Early check to ensure we're on /print route, not /printables or other routes
  // This prevents autoprint from triggering on category pages
  const [isPrintRoute, setIsPrintRoute] = useState(() => {
    if (typeof window === 'undefined') return false
    const purePath = removeLocaleFromPath(window.location.pathname).replace(/\/$/, '')
    return purePath === '/print'
  })

  // Update route check when location changes
  useEffect(() => {
    const checkRoute = () => {
      if (typeof window === 'undefined') return
      const pathname = window.location.pathname
      const isPrint = pathname === '/print' || pathname.startsWith('/print?')
      setIsPrintRoute(isPrint)
    }
    checkRoute()
    window.addEventListener('popstate', checkRoute)
    return () => window.removeEventListener('popstate', checkRoute)
  }, [])

  // Track URL search params in state so they update reactively when URL changes
  const [urlSearch, setUrlSearch] = useState(() =>
    typeof window !== 'undefined' ? window.location.search : ''
  )

  // Update URL search when location changes (for language changes)
  useEffect(() => {
    const updateSearch = () => {
      const currentSearch = typeof window !== 'undefined' ? window.location.search : ''
      if (currentSearch !== urlSearch) {
        setUrlSearch(currentSearch)
      }
    }

    // Check immediately
    updateSearch()

    // Listen for URL changes
    window.addEventListener('popstate', updateSearch)
    window.addEventListener('hashchange', updateSearch)

    // Also check periodically for programmatic URL changes (e.g., when lang param is added)
    const interval = setInterval(updateSearch, 100)

    return () => {
      window.removeEventListener('popstate', updateSearch)
      window.removeEventListener('hashchange', updateSearch)
      clearInterval(interval)
    }
  }, [urlSearch])

  const params = useMemo(() => {
    return new URLSearchParams(urlSearch)
  }, [urlSearch])

  const doc = propDocId || params.get('doc') || ''
  const isPreview = (params.get('preview') || '').toLowerCase() === '1' || (params.get('preview') || '').toLowerCase() === 'true'
  // CRITICAL: Never trigger autoprint if preview=1 (used in iframes on category pages)
  // Only calculate autoPrint if we're on the /print route AND not in preview mode - prevents popup on category pages
  const autoPrint = !isPreview && isPrintRoute && ((params.get('autoprint') || '').toLowerCase() === '1' || (params.get('autoprint') || '').toLowerCase() === 'true')
  const autoDownload = !isPreview && isPrintRoute && ((params.get('download') || '').toLowerCase() === '1' || (params.get('download') || '').toLowerCase() === 'true')
  const packTime = params.get('time') || '5'
  const packAge = params.get('age') || 'k2'
  const packSkill = params.get('skill') || 'mixed'
  const fromParam = params.get('from') || ''

  const seedParam = params.get('seed') || ''
  const timestampParam = params.get('timestamp') || ''
  const variantParam = params.get('variant') || '1'
  // Initialize showAnswers from URL parameter if present, otherwise default to false
  const [showAnswers, setShowAnswers] = useState(() => {
    const showAnswersParam = params.get('showAnswers')
    return showAnswersParam === '1' || showAnswersParam === 'true'
  })
  const [copiedLink, setCopiedLink] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false)
  const bundleItemsParam = params.get('items') || ''
  const bundleCategoryParam = params.get('category') || ''
  // Customization parameters
  const teacherName = params.get('teacher') || ''
  const className = params.get('class') || ''
  const studentsParam = params.get('students') || ''
  const studentNames = studentsParam ? studentsParam.split(',').map((s: string) => s.trim()).filter(Boolean) : []
  const activeDocs = useMemo(() => {
    if (doc === 'bundle') {
      return bundleItemsParam
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s && BUNDLE_DOC_ALLOWLIST.has(s))
    }
    return doc ? [doc] : []
  }, [doc, bundleItemsParam])
  const interactiveDocs = useMemo(
    () => activeDocs.filter((id: string) => id.startsWith('interactive-')),
    [activeDocs]
  )
  const primaryDoc = activeDocs[0] || doc || ''
  const answerableDocs = useMemo(
    () => new Set([...ANSWERABLE_BASE_DOC_IDS, ...INTERACTIVE_DOC_IDS]),
    []
  )
  const bundleHasAnswers = doc === 'bundle' && activeDocs.some((id: string) => answerableDocs.has(id))
  const shouldShowAnswerToggle = (activeDocs.length === 1 && answerableDocs.has(primaryDoc)) || bundleHasAnswers
  const docTitle = useMemo(() => {
    // If single worksheet, show its title instead of "Bundle"
    if (doc === 'bundle' && activeDocs.length === 1 && activeDocs[0].startsWith('interactive-')) {
      const singleDocId = activeDocs[0]
      // Try to get the worksheet title from INTERACTIVE_CATEGORIES
      for (const category of INTERACTIVE_CATEGORIES) {
        const worksheet = category.docs.find(d => d.id === singleDocId)
        if (worksheet) {
          // Use translated title if available, otherwise fall back to English title
          const translatedTitle = t(`interactive.${singleDocId}.title`)
          const title = translatedTitle !== `interactive.${singleDocId}.title` ? translatedTitle : worksheet.title
          return `${category.icon} ${title}`
        }
      }
    }
    return resolveDocTitle(doc || '', { packTime, bundleCategory: bundleCategoryParam || undefined, t })
  }, [doc, packTime, bundleCategoryParam, activeDocs, t, language])
  const pinHref = useMemo(() => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print'
      const desc = `${docTitle}  free printable for kids`
      return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc)}`
    } catch {
      return '#'
    }
  }, [docTitle])

  // Build a daily/variant seed: today if none provided
  const todaySeed = useMemo(() => {
    try {
      const d = new Date()
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return '2025-01-01'
    }
  }, [])

  const effectiveSeed = seedParam || (timestampParam ? `ts:${timestampParam}` : todaySeed)
  const variant = parseInt(variantParam || '1', 10)
  const bundleAnswerSections: Array<{ docId: string; title: string; content: ReactNode }> = []
  const showAnswersForDoc = (docId: string, factory: () => ReactNode) => {
    if (!showAnswers) return null
    const content = factory()
    if (doc === 'bundle') {
      const title = resolveDocTitle(docId, { packTime, bundleCategory: bundleCategoryParam || undefined, t })
      let summaryContent = content
      if (isValidElement(content)) {
        // Clone to remove some props or simplify for summary if needed
        // For now just keep as is
      }
      bundleAnswerSections.push({ docId, title, content: summaryContent })
      return null
    }
    return (
      <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-300 break-inside-avoid">
        <h3 className="text-lg font-bold text-slate-500 mb-4 flex items-center gap-2">
          <span>{String.fromCodePoint(0x1F511)}</span>
          Answer Key
        </h3>
        {content}
      </div>
    )
  }

  // Challenge and Assessment Component for addition-subtraction-0-10


  const friendlyAge = (v: string) =>
    v === 'k1' ? 'K1'
      : v === 'k2' ? 'K2'
        : v === 'g1' ? '1st Grade'
          : v === 'g2' ? '2nd Grade'
            : v === '25' ? '2nd-5th Grade'
              : v === '35' ? '35'
                : v === '68' ? '68'
                  : v
  const friendlyFocus = (v: string) => ({ mixed: 'Mixed', focus: 'Focus', reading: 'Reading', stem: 'STEM', creativity: 'Creativity', math: 'Math' } as any)[v] || v

  // Helpers moved to @/utils/printableUtils and components
  // makeRng, pick, pickNUnique etc. imported from utils

  // local components
  function SafeImg({ sources, alt, className }: { sources: string[]; alt: string; className?: string }) {
    const [idx, setIdx] = useState(0)
    const src = sources[idx] || sources[0]
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading="eager"
        decoding="async"
        onError={() => setIdx((i: number) => Math.min(i + 1, sources.length - 1))}
      />
    )
  }
  // Track worksheet view on mount
  useEffect(() => {
    if (doc && primaryDoc) {
      const from = params.get('from') || 'unknown'
      const grade = from.includes('grade') ? from.replace('-grade', '') :
        from.includes('kindergarten') ? 'kindergarten' :
          from.includes('multiplication') ? 'multiplication' :
            from.includes('reading') ? 'reading' : undefined
      trackWorksheetView(primaryDoc, docTitle, from, grade)
    }
  }, [doc, primaryDoc, docTitle])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      if (timeSpent > 3) { // Only track if user spent more than 3 seconds
        trackTimeOnPage(`/print?doc=${doc}`, timeSpent)
      }
    }
  }, [doc])

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll < 50) {
          trackScrollDepth(`/print?doc=${doc}`, 25)
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll < 75) {
          trackScrollDepth(`/print?doc=${doc}`, 50)
        } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScroll < 100) {
          trackScrollDepth(`/print?doc=${doc}`, 75)
        } else if (scrollPercent >= 100) {
          trackScrollDepth(`/print?doc=${doc}`, 100)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [doc])

  // PDF download function - refactored to use unified utility
  const downloadPDF = useCallback(async () => {
    try {
      setIsDownloadingPDF(true)

      // Wait for content to render
      if (showAnswers) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement
      if (!contentElement) {
        throw new Error('Could not find worksheet content. Please refresh the page and try again.')
      }

      const filename = docTitle
        ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        : `worksheet_${doc || 'download'}.pdf`

      // Use the unified utility for high-quality, paginated PDF
      await generateWorksheetPDF(contentElement, {
        filename,
        scale: 3.0,
        showAnswers,
        docTitle
      })

      // Track download
      if (doc || primaryDoc) {
        const from = params.get('from') || 'unknown'
        const gradeStr = from.includes('grade') ? from.replace('-grade', '') : (packAge || 'Mixed')
        trackWorksheetDownload(primaryDoc || doc || 'unknown', docTitle || 'Worksheet', `print-page-auto-${from}`, gradeStr)
      }

    } catch (error) {
      console.error('PDF download failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`PDF download failed: ${errorMessage}\n\nPlease try using the Print button and select "Save as PDF" instead.`)
    } finally {
      setIsDownloadingPDF(false)
    }
  }, [doc, docTitle, primaryDoc, params, showAnswers])





  // Auto-download PDF when download=1 parameter is present
  useEffect(() => {
    if (!autoDownload) return

    // Only allow auto-download if we are in an iframe (headless/background download)
    // OR if explicitly requested via download=1 in a new tab
    const isInIframe = window.self !== window.top
    const isExplicitDownload = params.get('download') === '1'
    if (!isInIframe && !isExplicitDownload) return

    // Defer a bit to let the view render fully
    const t = setTimeout(async () => {
      await downloadPDF()
      // If was opened in a new tab for auto-download, close it after done
      // const isInIframe = window.self !== window.top
      // if (!isInIframe) {
      //   window.close()
      // }
    }, 1200)
    return () => clearTimeout(t)
  }, [autoDownload, downloadPDF])

  // Track if print has already been called to prevent multiple popups
  // Use a more robust approach with sessionStorage and ref to persist across re-renders
  const hasPrintedRef = useRef(false)
  const printCallTimeRef = useRef<number>(0)
  const printTimeoutRef = useRef<any>(null)
  const hasScheduledPrintRef = useRef(false)

  // Auto-open browser print dialog when requested (e.g., from "Download PDF" links)
  // ONLY run on /print route, not on category pages like /printables or in preview mode (iframes)
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') return

    try {
      // Check pathname directly to ensure we're on /print route
      const currentPathname = window.location.pathname
      if (currentPathname !== '/print') {
        return // Don't run on category pages like /printables
      }

      // Check autoprint parameter directly from URL
      const currentSearch = window.location.search
      const currentParams = new URLSearchParams(currentSearch)
      const autoprintParam = (currentParams.get('autoprint') || '').toLowerCase()
      const hasAutoprint = autoprintParam === '1' || autoprintParam === 'true'
      const isPreviewParam = (currentParams.get('preview') || '').toLowerCase() === '1' || (currentParams.get('preview') || '').toLowerCase() === 'true'
      const hasAutoDownload = (currentParams.get('download') || '').toLowerCase() === '1' || (currentParams.get('download') || '').toLowerCase() === 'true'

      // CRITICAL: Never trigger autoprint in preview mode (used in iframes on category pages)
      if (isPreviewParam) {
        return // Don't run in preview mode (iframes)
      }

      // Skip if autoprint is not set or download is handling it
      // DISABLED: User requested to stop automatic print layout popup
      /* 
      if (!hasAutoprint || hasAutoDownload) {
        return
      }
      */
      return;

      // Check if we're in an iframe and parent is not on /print route
      const isInIframe = window.self !== window.top
      if (isInIframe) {
        try {
          const parentPath = window.top?.location?.pathname || ''
          if (parentPath !== '/print') {
            return // Don't trigger print if parent is not on print route
          }
        } catch (e) {
          // Cross-origin iframe - can't access parent, so don't trigger print to be safe
          return
        }
      }

      // Use a URL-based key with timestamp to ensure fresh prints on navigation
      const currentUrl = window.location.href
      const printKey = `autoprint_${currentUrl}`
      const now = Date.now()
      const PRINT_COOLDOWN = 2000 // 2 seconds - prevent duplicate prints within 2 seconds

      // Check if we've already printed for this exact URL in this session
      // Use a timestamp to allow re-printing if user navigates away and comes back
      const lastPrintTime = sessionStorage.getItem(printKey)
      if (lastPrintTime) {
        const timeSinceLastPrint = now - parseInt(lastPrintTime || '0', 10)
        if (timeSinceLastPrint < PRINT_COOLDOWN) {
          return // Too soon since last print attempt
        }
      }

      // Check if we've already scheduled a print for this exact URL recently
      // Only block if we've scheduled it very recently (within cooldown)
      const scheduledUrl = sessionStorage.getItem('autoprint_scheduled_url')
      if (scheduledUrl === currentUrl) {
        const scheduledTime = sessionStorage.getItem(printKey)
        if (scheduledTime) {
          const timeSinceScheduled = now - parseInt(scheduledTime || '0', 10)
          if (timeSinceScheduled < PRINT_COOLDOWN) {
            return // Too soon since last scheduled print for this URL
          }
        }
        // It's been long enough, allow re-printing
      }

      // If we get here, we should proceed with printing

      // Mark that we're scheduling a print for this URL
      hasScheduledPrintRef.current = true
      sessionStorage.setItem('autoprint_scheduled_url', currentUrl)
      sessionStorage.setItem(printKey, now.toString())

      // Clear any existing timeout
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current)
      }

      // Defer a bit to let the view render fully
      printTimeoutRef.current = setTimeout(() => {
        try {
          // Final checks before printing
          const finalPathname = window.location.pathname
          if (finalPathname !== '/print') {
            return
          }

          const finalSearch = window.location.search
          const finalParams = new URLSearchParams(finalSearch)
          const finalIsPreview = (finalParams.get('preview') || '').toLowerCase() === '1' || (finalParams.get('preview') || '').toLowerCase() === 'true'
          if (finalIsPreview) {
            return
          }

          // Check if still scheduled for this URL - but don't block print if not set
          // The sessionStorage flag was set earlier to prevent duplicate attempts
          const stillScheduledUrl = sessionStorage.getItem('autoprint_scheduled_url')
          // Only check if the scheduled URL exists and doesn't match - this allows first-time prints
          if (stillScheduledUrl && stillScheduledUrl !== currentUrl) {
            return
          }

          // All checks passed - trigger print
          window.print()

          // Track auto-print
          if (doc && primaryDoc) {
            const from = params.get('from') || 'unknown'
            const grade = from.includes('grade') ? from.replace('-grade', '') : undefined
            trackPrintDialog(primaryDoc, from)
            trackWorksheetDownload(primaryDoc, docTitle, from, grade)
          }
        } catch (e) {
          console.error('Error in autoprint timeout:', e)
        }
      }, 1200)

      return () => {
        if (printTimeoutRef.current) {
          clearTimeout(printTimeoutRef.current)
          printTimeoutRef.current = null
        }
      }
    } catch (e) {
      console.error('Error in autoprint effect:', e)
    }
  }, [urlSearch, doc, primaryDoc, docTitle, params]) // Re-run when URL or doc changes

  // Reset print flag when URL changes (new worksheet loaded)
  // Use a ref to track the previous URL to only reset when URL actually changes
  const previousUrlRef = useRef<string>('')
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only reset on exact /print route, not /printables
    const currentPathname = window.location.pathname
    if (currentPathname !== '/print') {
      // If we're not on print route, ensure print is disabled
      hasScheduledPrintRef.current = true
      return
    }

    // Check preview mode
    const currentSearch = window.location.search
    const currentParams = new URLSearchParams(currentSearch)
    const isPreviewParam = (currentParams.get('preview') || '').toLowerCase() === '1' || (currentParams.get('preview') || '').toLowerCase() === 'true'

    if (isPreviewParam) {
      hasScheduledPrintRef.current = true
      return
    }

    // Get current URL
    const currentUrl = window.location.href

    // Only reset if URL actually changed from a previous URL (not on initial mount)
    // On initial mount, previousUrlRef.current is '', so we check if it's not empty
    if (previousUrlRef.current && currentUrl !== previousUrlRef.current) {
      // URL actually changed from a previous URL - reset everything
      previousUrlRef.current = currentUrl

      // Clear the scheduled URL flag to allow autoprint to work for new URLs
      sessionStorage.removeItem('autoprint_scheduled_url')

      // Reset refs for new worksheet
      hasPrintedRef.current = false
      printCallTimeRef.current = 0
      hasScheduledPrintRef.current = false

      // Clear any pending timeout from previous URL
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current)
        printTimeoutRef.current = null
      }
    } else if (!previousUrlRef.current) {
      // Initial mount - just set the previous URL, don't clear anything
      // This allows the autoprint effect to run and set up the print timeout
      previousUrlRef.current = currentUrl
    }
  }, [urlSearch, doc])

  // CRITICAL: We only render worksheet content if we're on the /print route OR if a propDocId was passed (slug-based route)
  // If we're neither, then we don't render anything to avoid polluting other pages
  if (!isPrintRoute && !propDocId) {
    return null
  }

  return (
    <div className="min-h-screen bg-white" data-worksheet-content="true" data-doc={doc || primaryDoc || ''}>
      <style>{`
        @media print {
          @page { 
            size: A4;
            margin: 0 !important;
          }
          html, body, #root, [data-worksheet-content="true"] {
            background-color: white !important;
            background: white !important;
            color: black !important;
            width: 794px !important;
            max-width: 794px !important;
            margin: 0 !important; 
            padding: 0.25in 0 0 !important; 
            font-size: 11pt !important;
            line-height: 1.3 !important;
          }
          /* Decorative emoji-style border using CSS patterns - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child::before,
          [data-worksheet-content="true"] > div.max-w-4xl::before,
          .max-w-4xl.mx-auto::before,
          [data-worksheet-content="true"] .max-w-4xl::before {
            content: '' !important;
            position: absolute !important;
            top: -8px !important;
            left: -8px !important;
            right: -8px !important;
            bottom: -8px !important;
            background-image: 
              /* Stars pattern */
              repeating-linear-gradient(0deg, transparent, transparent 20px, #fbbf24 20px, #fbbf24 21px),
              repeating-linear-gradient(90deg, transparent, transparent 20px, #f472b6 20px, #f472b6 21px),
              repeating-linear-gradient(45deg, transparent, transparent 15px, #60a5fa 15px, #60a5fa 16px),
              repeating-linear-gradient(135deg, transparent, transparent 15px, #34d399 15px, #34d399 16px),
              /* Base gradient */
              linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) !important;
            background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%, 100% 100% !important;
            background-position: top, right, bottom, left, center !important;
            background-repeat: repeat-x, repeat-y, repeat-x, repeat-y, no-repeat !important;
            border-radius: 14px !important;
            z-index: -1 !important;
            opacity: 0.3 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Decorative emoji stars at top - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child::after,
          [data-worksheet-content="true"] > div.max-w-4xl::after,
          .max-w-4xl.mx-auto::after,
          [data-worksheet-content="true"] .max-w-4xl::after {
            content: '   ' !important;
            position: absolute !important;
            top: 0px !important;
            left: 50% !important;
            transform: translateX(-50%) translateY(-50%) !important;
            font-size: 18px !important;
            letter-spacing: 10px !important;
            z-index: 10 !important;
            background: white !important;
            padding: 4px 12px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: #f472b6 !important;
            display: block !important;
            white-space: nowrap !important;
          }
          /* Thin colorful decorative border with emoji-style pattern - applied to ALL worksheets */
          [data-worksheet-content="true"] > div:first-child,
          [data-worksheet-content="true"] .max-w-4xl {
            position: relative !important;
            border-radius: 12px !important;
            border: 4px solid transparent !important;
            border-image: linear-gradient(
              135deg,
              #f472b6 0%,
              #a78bfa 20%,
              #60a5fa 40%,
              #34d399 60%,
              #fbbf24 80%,
              #fb7185 100%
            ) 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            padding: 20px 24px 24px 24px; /* Removed !important to allow JS override */
            margin: 0.25in !important;
            margin-top: 0 !important;
          }
          [data-worksheet-content="true"] .wizqo-logo-print {
            display: none !important; /* Managed by JS during capture */
            position: relative !important;
            width: 100% !important;
            z-index: 100 !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 10px !important;
            background: transparent !important;
            padding: 0.35in 0.5in 0.2in 0.5in !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-worksheet-content="true"] .wizqo-logo-print img {
            width: 45px !important;
            height: 45px !important;
            object-fit: contain !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-worksheet-content="true"] .wizqo-logo-print .domain-text {
            font-size: 14px !important;
            font-weight: 700 !important;
            color: #4845D2 !important;
            white-space: nowrap !important;
            letter-spacing: 0.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-worksheet-content="true"] .wizqo-footer-print {
            position: absolute !important;
            bottom: 25px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 4px !important;
            color: #64748b !important;
            font-size: 10pt !important;
          }
          /* Branding specific styles for capture */
          .wizqo-logo-print.force-show,
          .wizqo-footer-print.force-show {
            display: flex !important;
          }
          /* End of layout fixes */
        }
      `}</style>
      <div className={`${isPreview ? 'w-full h-full p-0 m-0' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'} print:p-0 print:py-0 print:mt-0 ${isPreview ? 'preview-mode' : ''}`}>
        {/* Customization header (print view - appears once at top) */}
        {(teacherName || className || studentNames.length > 0) && !isPreview && (
          <div className="hidden print:block print-customization-header" aria-hidden>
            <div className="flex flex-wrap gap-x-3 items-center">
              {teacherName && <span><strong>Teacher:</strong> {teacherName}</span>}
              {className && teacherName && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {className && <span><strong>Class:</strong> {className}</span>}
              {studentNames.length > 0 && (teacherName || className) && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {studentNames.length > 0 && (
                <span><strong>Students:</strong> {studentNames.join(', ')}</span>
              )}
            </div>
          </div>
        )}
        {(teacherName || className || studentNames.length > 0) && !isPreview && (
          <div className="hidden print:block print-customization-header" aria-hidden>
            <div className="flex flex-wrap gap-x-3 items-center">
              {teacherName && <span><strong>Teacher:</strong> {teacherName}</span>}
              {className && teacherName && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {className && <span><strong>Class:</strong> {className}</span>}
              {studentNames.length > 0 && (teacherName || className) && <span className="text-slate-400">{String.fromCodePoint(0x270F)}</span>}
              {studentNames.length > 0 && (
                <span><strong>Students:</strong> {studentNames.join(', ')}</span>
              )}
            </div>
          </div>
        )}
        {!isPreview && (
          <header className="relative mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 print:hidden" data-html2canvas-ignore="true">
            {/* Top Row: Back Link and Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={(() => {
                  try {
                    const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                    const from = (u.searchParams.get('from') || '').trim()
                    const docId = (doc || '').trim()

                    // HOTFIX: Mapping lost "from" params for specific Kindergarten worksheets
                    if (!from && ['big-small', 'heavy-light', 'long-short', 'same-different', 'more-less'].includes(docId)) {
                      return '/worksheets/kindergarten-math-worksheets'
                    }

                    // If coming from interactive worksheets generator, go back there
                    if (from === 'interactive') {
                      return '/interactive-worksheets-generator'
                    }
                    // If coming from grade pages, go back to the appropriate grade page
                    if (from === 'kindergarten') {
                      return '/worksheets/kindergarten-math-worksheets'
                    }
                    if (from === '1st-grade') {
                      return '/worksheets/1st-grade-math-worksheets'
                    }
                    if (from === '2nd-grade') {
                      return '/worksheets/2nd-grade-math-worksheets'
                    }
                    if (from === '3rd-grade') {
                      return '/worksheets/3rd-grade-math-worksheets'
                    }
                    if (from === '4th-grade') {
                      return '/worksheets/4th-grade-math-worksheets'
                    }
                    if (from === '5th-grade') {
                      return '/worksheets/5th-grade-math-worksheets'
                    }
                    if (from === 'reading-comprehension') {
                      return '/worksheets/reading-comprehension'
                    }
                    if (from === 'multiplication') {
                      return '/worksheets/multiplication-worksheets'
                    }
                    if (from === 'times-table') {
                      return '/worksheets/times-table-multiplication-worksheets'
                    }
                    if (from === 'fractions-to-decimals') {
                      return '/worksheets/fractions-to-decimals-worksheets'
                    }
                    if (from === 'order-of-operations') {
                      return '/worksheets/order-of-operations-worksheets'
                    }
                    if (from === 'handwriting') {
                      return '/worksheets/handwriting-worksheet-maker'
                    }
                    if (from === 'geometry-worksheets' || from === 'geometry') {
                      return '/printables/geometry-worksheets'
                    }
                    if (from === 'geography-worksheets' || from === 'geography') {
                      return '/printables/geography-worksheets'
                    }
                    if (from === 'measurement-worksheets' || from === 'measurement') {
                      return '/printables/measurement-worksheets'
                    }
                    if (from === 'logic-worksheets' || from === 'logic') {
                      return '/printables/logic-worksheets'
                    }
                    if (from === 'decimal-worksheets' || from === 'decimal') {
                      return '/printables/decimal-worksheets'
                    }
                    if (from === 'math-maze-worksheets' || from === 'math-maze') {
                      return '/printables/math-maze-worksheets'
                    }
                    if (from === 'data-analysis-worksheets') {
                      return '/printables/data-analysis-worksheets'
                    }
                    if (from === 'word-problem-worksheets') {
                      return '/printables/word-problem-worksheets'
                    }
                    if (from === 'science-worksheets') {
                      return '/printables/science-worksheets'
                    }
                    if (from === 'all') {
                      return '/worksheets/all'
                    }

                    // Check if 'from' is a known SEO slug
                    if (from) {
                      const seo = getWorksheetSEOBySlug(from)
                      if (seo) return addLocaleToPath(`/${seo.slug}`, getLocaleFromURL())
                    }

                    // Robust fallback: if 'from' looks like a full internal path, use it
                    if (from && (from.startsWith('/') || from.includes('-worksheets') || from.includes('-worksheet-') || from === 'reading-comprehension')) {
                      if (from.startsWith('/')) return from
                      return addLocaleToPath(`/${from}`, getLocaleFromURL())
                    }
                    // Determine category anchor by doc or bundle selection
                    const cat = (() => {
                      if (docId === 'bundle') {
                        if (bundleCategoryParam) return bundleCategoryParam
                        if (primaryDoc) {
                          return getPrintableSectionForDoc(primaryDoc) || (primaryDoc.startsWith('coloring') ? 'Coloring' : primaryDoc.startsWith('geo-') ? 'Geography' : '')
                        }
                        return 'Worksheets'
                      }
                      if (!docId) return ''
                      const found = getPrintableSectionForDoc(docId)
                      if (found) return found

                      // Improved fallback logic
                      if (docId.startsWith('coloring')) return 'Coloring'
                      if (docId.startsWith('geo-')) return 'Geography'
                      return 'Worksheets'
                    })()
                    const hash = cat ? `#${encodeURIComponent(cat)}` : ''
                    return `/printables${hash}`
                  } catch {
                    return '/printables'
                  }
                })()}
                onClick={(e: MouseEvent) => {
                  if (typeof window !== 'undefined' &&
                    document.referrer &&
                    document.referrer.includes(window.location.host) &&
                    window.history.length > 1) {
                    e.preventDefault()
                    window.history.back()
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                aria-label={t('pages.printables.backPrintablePage')}
              >
                <span>{String.fromCodePoint(0x2B05)}</span>
                <span>{(() => {
                  try {
                    const u = new URL(typeof window !== 'undefined' ? window.location.href : 'https://wizqo.com/print')
                    const from = u.searchParams.get('from')
                    if (from === 'interactive') return t('pages.printables.backToInteractive')
                    if (from === 'kindergarten') return t('pages.printables.backToKindergarten')
                    if (from === '1st-grade') return t('pages.printables.backToFirstGrade')
                    if (from === '2nd-grade') return t('pages.printables.backToSecondGrade')
                    if (from === '3rd-grade') return t('pages.printables.backToThirdGrade')
                    if (from === '4th-grade') return t('pages.printables.backToFourthGrade')
                    if (from === '5th-grade') return t('pages.printables.backToFifthGrade')
                    if (from === 'reading-comprehension') return t('pages.printables.backToReadingComprehension')
                    if (from === 'multiplication') return t('pages.printables.backToMultiplication')
                    if (from === 'times-table') return t('pages.printables.backToTimesTable')
                    if (from === 'fractions-to-decimals') return t('pages.printables.backToFractionsToDecimals')
                    if (from === 'order-of-operations') return 'Back to Order of Operations'
                    if (from === 'handwriting') return t('pages.handwriting.title')
                    if (from === 'geometry') return 'Back to Geometry'
                    if (from === 'geography') return 'Back to Geography'
                    if (from === 'all') return t('pages.printables.backToAllWorksheets')

                    if (from) {
                      const seo = getWorksheetSEOBySlug(from)
                      if (seo) return `Back to ${seo.h1}`
                    }
                    return t('pages.printables.backPrintablePage')
                  } catch {
                    return t('pages.printables.backPrintablePage')
                  }
                })()}</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.print();
                    // Track print as download intent
                    trackWorksheetDownload(primaryDoc || doc || 'unknown', docTitle || 'Worksheet', `print-view-${fromParam || 'direct'}`, packAge || 'Mixed')
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition-colors"
                >
                  <span>{String.fromCodePoint(0x1F5A8)}</span> Print
                </button>
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault(); e.stopPropagation();
                    if (isDownloadingPNG) return;

                    setIsDownloadingPNG(true);
                    const contentElement = document.querySelector('[data-worksheet-content="true"]') as HTMLElement;
                    if (!contentElement) {
                      setIsDownloadingPNG(false);
                      return;
                    }

                    // Small timeout to allow UI to update
                    setTimeout(() => {
                      import('html2canvas').then(m => m.default || m).then(html2canvas => {
                        html2canvas(contentElement, {
                          scale: 2.0,
                          useCORS: true,
                          logging: false,
                          backgroundColor: '#ffffff',
                          allowTaint: false,
                          ignoreElements: (element: Element) => {
                            if (element.hasAttribute('data-html2canvas-ignore')) return true;
                            if (element.classList.contains('print:hidden')) return true;
                            return false;
                          },
                          onclone: (clonedDoc: Document) => {
                            const printHidden = clonedDoc.querySelectorAll('.print\\:hidden');
                            printHidden.forEach((el: Element) => {
                              if (el.parentNode) el.parentNode.removeChild(el);
                            });
                            const ignoreEls = clonedDoc.querySelectorAll('[data-html2canvas-ignore="true"]');
                            ignoreEls.forEach((el: Element) => {
                              if (el.parentNode) el.parentNode.removeChild(el);
                            });
                          }
                        }).then((canvas: HTMLCanvasElement) => {
                          const imgData = canvas.toDataURL('image/png');
                          const link = document.createElement('a');
                          link.download = docTitle
                            ? `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
                            : `worksheet_${doc || 'download'}.png`;
                          link.href = imgData;
                          link.click();
                          setIsDownloadingPNG(false);

                          // Track PNG download
                          trackWorksheetDownload(primaryDoc || doc || 'unknown', docTitle || 'Worksheet', `print-view-png-${fromParam || 'direct'}`, packAge || 'Mixed')
                        }).catch((error: unknown) => {
                          console.error('PNG capture failed:', error);
                          setIsDownloadingPNG(false);
                        });
                      }).catch((error: unknown) => {
                        console.error('Failed to load html2canvas:', error);
                        setIsDownloadingPNG(false);
                      });
                    }, 50);
                  }}
                  disabled={isDownloadingPNG}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition-colors"
                >
                  {isDownloadingPNG ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12 a 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291 a 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : <span>{String.fromCodePoint(0x2B07)}</span>}
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Title and Secondary Actions */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{docTitle}</h1>
                <p className="text-slate-600 mt-1 text-xs sm:text-sm">{t('pages.printables.printInstructions')}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium"
                  title={t('pages.printables.pinThisPrintable')}
                >
                  <span>{String.fromCodePoint(0x279C)}</span>
                  <span>{t('pages.printables.pinThis')}</span>
                </a>

                {shouldShowAnswerToggle && (
                  <button
                    onClick={() => { const val = !showAnswers; setShowAnswers(val); trackAnswerKeyToggle(primaryDoc, val ? 'show' : 'hide'); }}
                    className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-bold shadow-sm ${showAnswers ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-emerald-600 text-white border-emerald-600'}`}
                  >
                    {showAnswers ? t('pages.printables.hideAnswers') : t('pages.printables.showAnswers')}
                  </button>
                )}
                <div className="hidden sm:block">
                  <WizqoLogo className="w-16 h-auto opacity-80" />
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Doc-specific sections (unique content per topic) */}
        <div key={`interactive-${interactiveDocs.join('-')}-${language}-${effectiveSeed}`}>
          {interactiveDocs.length > 0 && (
            <InteractiveBundleSections
              docIds={interactiveDocs}
              seed={effectiveSeed}
              variant={variant}
              showAnswers={showAnswers}
              teacherName={teacherName}
              className={className}
              studentNames={studentNames}
              isPrintMode={true}
            />
          )}
        </div>
        <MathRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswers={showAnswers}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
          language={language}
        />
        <LanguageRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
        />
        <EarlyLearnerRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
          isPreview={isPreview}
        />
        <HolidayRenderer
          activeDocs={activeDocs}
          seed={effectiveSeed}
          variant={variant}
          showAnswersForDoc={showAnswersForDoc}
          t={t}
          getTrans={getTrans}
        />







        <WorksheetFooter enabled={true} showCopyright={true} />
      </div>
    </div>
  )
}

function generateWordSearch(seed: string) {
  const rng = makeRng(seed)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]

  const themes = [
    { name: 'Space', words: ['STAR', 'MOON', 'SUN', 'PLANET', 'ORBIT', 'COMET'] },
    { name: 'Animals', words: ['LION', 'TIGER', 'BEAR', 'ZEBRA', 'WOLF', 'FOX'] },
    { name: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'PINK', 'BLACK', 'WHITE'] },
    { name: 'School', words: ['BOOK', 'DESK', 'PEN', 'MATH', 'READ', 'WRITE'] },
    { name: 'World', words: ['MAP', 'GLOBE', 'LAND', 'OCEAN', 'CITY', 'FLAG'] },
  ]

  const theme = pick(themes)
  const size = 10
  const grid = Array(size).fill(null).map(() => Array(size).fill(''))
  const placedWords = []

  for (const word of theme.words) {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 50) {
      const dir = rng() > 0.5 ? 'H' : 'V' // Horizontal or Vertical only for simplicity
      const row = Math.floor(rng() * size)
      const col = Math.floor(rng() * size)

      if (dir === 'H') {
        if (col + word.length <= size) {
          let clear = true
          for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) clear = false
          }
          if (clear) {
            for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i]
            placed = true
            placedWords.push(word)
          }
        }
      } else {
        if (row + word.length <= size) {
          let clear = true
          for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) clear = false
          }
          if (clear) {
            for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i]
            placed = true
            placedWords.push(word)
          }
        }
      }
      attempts++
    }
  }

  // Fill empty
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(rng() * letters.length)]
    }
  }

  return { theme: theme.name, grid, words: placedWords }
}




export default PrintablesPage
