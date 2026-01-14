import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter, trackBuildPackClick } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'
import { getWorksheetURL, getWorksheetPrintURL } from '@/utils/worksheetLinks'
import { trackWorksheetDownload } from '@/utils/analytics'

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  gradeRange?: string
  customPreviewUrl?: string
  customDownloadUrl?: string
}

export default function FractionsToDecimalsWorksheetsPage() {
  const { t, language, isRTL } = useTranslation()
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);
  React.useEffect(() => { }, [language])

  const FRACTIONS_TO_DECIMALS_CATEGORIES: Category[] = useMemo(() => [
    { id: 'basic', label: t('pages.fractionsToDecimals.categories.basic'), icon: '🔢' },
    { id: 'tenths-hundredths', label: t('pages.fractionsToDecimals.categories.tenthsHundredths'), icon: '📊' },
    { id: 'mixed-numbers', label: t('pages.fractionsToDecimals.categories.mixedNumbers'), icon: '🔀' },
    { id: 'division', label: t('pages.fractionsToDecimals.categories.division'), icon: '➗' },
    { id: 'word-problems', label: t('pages.fractionsToDecimals.categories.wordProblems'), icon: '🧮' },
    { id: 'comparing', label: t('pages.fractionsToDecimals.categories.comparing'), icon: '⚖️' },
    { id: 'visual', label: t('pages.fractionsToDecimals.categories.visual'), icon: '👁️' },
    { id: 'percentage', label: t('pages.fractionsToDecimals.categories.percentage'), icon: '📈' },
  ], [t, language])

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev: Set<string>) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'fractions-to-decimals-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'fractions-to-decimals-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using unique doc IDs that match the worksheet concepts
  // Each worksheet is unique and targets specific long-tail keywords
  const allWorksheets: WorksheetItem[] = useMemo(() => [
    // 3rd Grade - Beginner worksheets
    { title: t('pages.fractionsToDecimals.worksheets.basicTenths.title'), description: t('pages.fractionsToDecimals.worksheets.basicTenths.description'), href: getWorksheetURL('fractions-to-decimals', 'fractions-to-decimals'), docId: 'fractions-to-decimals-basic-tenths', categories: ['basic', 'tenths-hundredths'], gradeRange: '3rd' },
    { title: t('pages.fractionsToDecimals.worksheets.visualTenths.title'), description: t('pages.fractionsToDecimals.worksheets.visualTenths.description'), href: getWorksheetURL('decimals-place-value', 'fractions-to-decimals'), docId: 'decimals-place-value', categories: ['visual', 'tenths-hundredths'], gradeRange: '3rd' },
    { title: t('pages.fractionsToDecimals.worksheets.basicHundredths.title'), description: t('pages.fractionsToDecimals.worksheets.basicHundredths.description'), href: getWorksheetURL('comparing-decimals', 'fractions-to-decimals'), docId: 'comparing-decimals', categories: ['basic', 'tenths-hundredths'], gradeRange: '3rd' },
    // 4th Grade - Intermediate worksheets
    { title: t('pages.fractionsToDecimals.worksheets.mixedNumbersBasic.title'), description: t('pages.fractionsToDecimals.worksheets.mixedNumbersBasic.description'), href: getWorksheetURL('mixed-improper-fractions', 'fractions-to-decimals'), docId: 'mixed-improper-fractions', categories: ['mixed-numbers'], gradeRange: '4th' },
    { title: t('pages.fractionsToDecimals.worksheets.comparingFractionsDecimals.title'), description: t('pages.fractionsToDecimals.worksheets.comparingFractionsDecimals.description'), href: getWorksheetURL('comparing-ordering-fractions-decimals', 'fractions-to-decimals'), docId: 'comparing-ordering-fractions-decimals', categories: ['comparing'], gradeRange: '4th' },
    { title: t('pages.fractionsToDecimals.worksheets.divisionMethod.title'), description: t('pages.fractionsToDecimals.worksheets.divisionMethod.description'), href: getWorksheetURL('fractions-to-decimals', 'fractions-to-decimals'), docId: 'fractions-to-decimals-division', categories: ['division'], gradeRange: '4th' },
    { title: t('pages.fractionsToDecimals.worksheets.wordProblemsBasic.title'), description: t('pages.fractionsToDecimals.worksheets.wordProblemsBasic.description'), href: getWorksheetURL('fraction-word-problems', 'fractions-to-decimals'), docId: 'fraction-word-problems', categories: ['word-problems'], gradeRange: '4th' },
    // 5th Grade - Advanced worksheets including percent conversions
    { title: t('pages.fractionsToDecimals.worksheets.advancedMixedNumbers.title'), description: t('pages.fractionsToDecimals.worksheets.advancedMixedNumbers.description'), href: getWorksheetURL('fractions-decimals-percents', 'fractions-to-decimals'), docId: 'fractions-decimals-percents-advanced', categories: ['mixed-numbers'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.repeatingDecimals.title'), description: t('pages.fractionsToDecimals.worksheets.repeatingDecimals.description'), href: getWorksheetURL('add-sub-decimals', 'fractions-to-decimals'), docId: 'add-sub-decimals', categories: ['division'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.complexWordProblems.title'), description: t('pages.fractionsToDecimals.worksheets.complexWordProblems.description'), href: getWorksheetURL('decimal-word-problems', 'fractions-to-decimals'), docId: 'decimal-word-problems', categories: ['word-problems'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.orderingFractionsDecimals.title'), description: t('pages.fractionsToDecimals.worksheets.orderingFractionsDecimals.description'), href: getWorksheetURL('comparing-ordering-fractions-decimals', 'fractions-to-decimals'), docId: 'ordering-fractions-decimals', categories: ['comparing'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.percentConversions.title'), description: t('pages.fractionsToDecimals.worksheets.percentConversions.description'), href: getWorksheetURL('fractions-decimals-percents', 'fractions-to-decimals'), docId: 'fractions-decimals-percents', categories: ['percentage'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.percentWordProblems.title'), description: t('pages.fractionsToDecimals.worksheets.percentWordProblems.description'), href: getWorksheetURL('percent-word-problems', 'fractions-to-decimals'), docId: 'percent-word-problems', categories: ['word-problems', 'percentage'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.fractionsOutOf100.title'), description: t('pages.fractionsToDecimals.worksheets.fractionsOutOf100.description'), href: getWorksheetURL('fractions-decimals-percents', 'fractions-to-decimals'), docId: 'fractions-out-of-100', categories: ['percentage', 'tenths-hundredths'], gradeRange: '4th' },
    { title: t('pages.fractionsToDecimals.worksheets.percentToDecimal.title'), description: t('pages.fractionsToDecimals.worksheets.percentToDecimal.description'), href: getWorksheetURL('fractions-decimals-percents', 'fractions-to-decimals'), docId: 'percent-to-decimal', categories: ['percentage'], gradeRange: '5th' },
    { title: t('pages.fractionsToDecimals.worksheets.decimalToPercent.title'), description: t('pages.fractionsToDecimals.worksheets.decimalToPercent.description'), href: getWorksheetURL('fractions-decimals-percents', 'fractions-to-decimals'), docId: 'decimal-to-percent', categories: ['percentage'], gradeRange: '5th' },
    // All Grades - Practice and review
    { title: t('pages.fractionsToDecimals.worksheets.mixedReview.title'), description: t('pages.fractionsToDecimals.worksheets.mixedReview.description'), href: getWorksheetURL('equivalent-fractions-4th', 'fractions-to-decimals'), docId: 'equivalent-fractions-4th', categories: ['basic'], gradeRange: 'All' },
    { title: t('pages.fractionsToDecimals.worksheets.fluencyPractice.title'), description: t('pages.fractionsToDecimals.worksheets.fluencyPractice.description'), href: getWorksheetURL('add-sub-fractions-4th', 'fractions-to-decimals'), docId: 'add-sub-fractions-4th', categories: ['basic'], gradeRange: 'All' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    // Reverse the array to show newly added worksheets (at the bottom of the list) first
    const newestFirst = [...allWorksheets].reverse()
    if (selectedCategories.size === 0) return newestFirst
    return newestFirst.filter((ws) =>
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, allWorksheets])

  // Group filtered worksheets by grade range
  const groupedWorksheets = useMemo(() => {
    const groups: Record<string, WorksheetItem[]> = {}
    filteredWorksheets.forEach((ws: WorksheetItem) => {
      const range = ws.gradeRange || 'All'
      if (!groups[range]) groups[range] = []
      groups[range].push(ws)
    })
    return groups
  }, [filteredWorksheets])
  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* SEO tags are set in App.tsx for this route */}
      {(() => {
        const canonical = "https://wizqo.com/worksheets/fractions-to-decimals-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
            { "@type": "ListItem", position: 3, name: "Fractions to Decimals Worksheets", item: "https://wizqo.com/worksheets/fractions-to-decimals-worksheets" }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation />
      {/* Print-only Name/Date overlay for this page */}
      <style>{`
        @media print {
          @page { margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          .print-name-date { position: fixed; bottom: 0.35in; left: 0.5in; right: 0.5in; display: flex; justify-content: space-between; color: #334155; font-size: 12px; z-index: 9999; pointer-events: none; }
          .print-name-date .label { margin-right: 6px; }
          .print-name-date .line { border-bottom: 1px solid #94a3b8; min-width: 2.5in; height: 0.9em; display: inline-block; }
        }
      `}</style>
      <div className="hidden print:block print-name-date" aria-hidden>
        <div>
          <span className="label">Name</span>
          <span className="line" />
        </div>
        <div>
          <span className="label">Date</span>
          <span className="line" />
        </div>
      </div>
      <main className="bg-gradient-to-b from-purple-50/70 via-white to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                {t('pages.fractionsToDecimals.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.fractionsToDecimals.title')}
                <span className="block text-purple-600">{t('pages.fractionsToDecimals.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.fractionsToDecimals.description')}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.fractionsToDecimals.whatsInside')}</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              {t('pages.fractionsToDecimals.whatsInsideDesc')}
            </p>
            <div className="mt-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">{t('pages.fractionsToDecimals.buildPack')}</div>
                <p className="text-slate-700 text-sm mb-3">{t('pages.fractionsToDecimals.buildPackDesc')}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fractionsToDecimals.buildPackTime')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fractionsToDecimals.buildPackAge')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fractionsToDecimals.buildPackFocus')}</span>
                </div>
                <a href="/print?doc=pack&time=5&age=g3&skill=math&from=fractions-to-decimals" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={() => trackBuildPackClick('3-5')}>{t('pages.printables.buildPackButton')}</a>
              </div>
            </div>
          </section>

          {/* Main content with sidebar layout */}
          <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Left sidebar - Category Filter */}
            <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <CategoryFilter
                  categories={FRACTIONS_TO_DECIMALS_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.fractionsToDecimals.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right content - Worksheets Grid */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([gradeRange, worksheets]) => {
                const label = gradeRange === 'All'
                  ? t('pages.fractionsToDecimals.allGrades')
                  : `${gradeRange} Grade`

                return (
                  <div key={gradeRange}>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{label}</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {(worksheets as WorksheetItem[]).map((ws: WorksheetItem) => (
                        <WorksheetThumbnailCard
                          key={ws.docId}
                          title={ws.title}
                          description={ws.description}
                          href={ws.href}
                          docId={ws.docId}
                          onPreview={setPreviewItem}
                          customPreviewUrl={ws.customPreviewUrl}
                          customDownloadUrl={ws.customDownloadUrl}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
              {filteredWorksheets.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-lg">{t('pages.fractionsToDecimals.noResults')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded font-medium"
                    aria-label="Clear all filters"
                  >
                    {t('pages.fractionsToDecimals.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">Explore More Worksheets</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">Multiplication Worksheets</a></li>
              <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">Times Table Multiplication Worksheets</a></li>
              <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">3rd Grade Math Worksheets – Printable</a></li>
              <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">4th Grade Math Worksheets – Free PDF</a></li>
              <li><a className="hover:underline" href="/worksheets/5th-grade-math-worksheets">5th Grade Math Worksheets – Printable</a></li>
              <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">Are fractions to decimals worksheets free to download?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Yes! All fractions to decimals worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">What grade levels are fractions to decimals worksheets available for?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Our fractions to decimals worksheets are perfect for 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with step-by-step practice and answer keys.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">Do fractions to decimals worksheets include answer keys?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Yes! Every fractions to decimals worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">What skills are covered in fractions to decimals worksheets?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Our worksheets cover converting fractions with denominators 10 and 100, mixed numbers to decimals, using division method, comparing fractions and decimals, word problems, and visual models. Perfect for building confidence and mastering conversion skills.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <FractionDecimalMasteryGuide />
      </div>

      <Footer />

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setPreviewItem(null)}
          />

          {/* Side Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{previewItem.title}</h2>
                  <p className="text-sm text-slate-600 mt-1">{previewItem.description}</p>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="ml-4 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close preview"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-slate-50">
                <div className="mx-auto max-w-3xl px-6 py-8">
                  {/* Worksheet Preview */}
                  <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
                    <iframe
                      src={previewItem.href}
                      className="w-full h-full min-h-[600px] border-0"
                      title={previewItem.title}
                      aria-label={`Preview of ${previewItem.title} worksheet`}
                    />
                  </div>

                  {/* Info Footer */}
                  <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                    <p className="font-semibold mb-2">📄 Preview</p>
                    <p>Click the Download button below to download as PDF or use your browser's print function.</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => {
                        trackWorksheetDownload(previewItem.docId, previewItem.title, 'fractions-decimals-hub', 'Math')
                        const newWindow = window.open(previewItem.href, '_blank')
                        if (newWindow) {
                          setTimeout(() => {
                          }, 500)
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-white text-sm font-medium shadow-sm"
                      aria-label={`Download ${previewItem.title} as PDF`}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t, language } = useTranslation();
  // Use print URL for preview (not SEO URL) to show actual worksheet content
  const printUrl = getWorksheetPrintURL(docId, 'fractions-to-decimals')
  const previewUrl = customPreviewUrl || (printUrl + (printUrl.includes('?') ? '&preview=1' : '?preview=1'))

  // Use translations if available (fallback to provided title/description) - memoize to prevent re-renders
  // Use language instead of t in dependencies to avoid re-renders when t function reference changes
  const translatedTitle = React.useMemo(() => {
    if (!docId) return title;
    const translated = t(`worksheets.${docId}.title`);
    return translated && translated !== `worksheets.${docId}.title` ? translated : title;
  }, [docId, title, language, t]);

  const translatedDescription = React.useMemo(() => {
    if (!docId) return description;
    const translated = t(`worksheets.${docId}.description`);
    return translated && translated !== `worksheets.${docId}.description` ? translated : description;
  }, [docId, description, language, t]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{translatedTitle}</h3>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">{translatedDescription}</p>

      {/* Worksheet Thumbnail Preview - Clickable to SEO page */}
      <a
        href={href}
        className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow block"
        style={{
          height: '140px',
          aspectRatio: '2.5/1',
        }}
      >
        {/* Thumbnail content using iframe with preview mode */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '400%',
            height: '400%',
            pointerEvents: 'none',
          }}
          title={`Preview of ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-none">
            👁️ Click to view full worksheet
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </a>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Answer key included</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (customDownloadUrl) {
                trackWorksheetDownload(docId, translatedTitle, 'fractions-decimals-hub', 'Math')
                window.open(customDownloadUrl, '_blank')
                return
              }
              const printUrl = getWorksheetPrintURL(docId, 'fractions-to-decimals')
              trackWorksheetDownload(docId, translatedTitle, 'fractions-decimals-hub', 'Math')
              window.open(printUrl, '_blank')
            }}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </article>
  )
})

function FractionDecimalMasteryGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            📊
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.fractionsToDecimals.wiki.title', 'Conversion Hub: Bridging Fractions & Decimals')}</h2>
            <p className="text-emerald-100 font-medium italic">Mastering the language of parts, grids & precision</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">👁️</span> {t('pages.fractionsToDecimals.wiki.visualTitle', 'Visual Logic: Seeing the Split')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Fractions and decimals are simply two ways to describe the same "part of a whole." We use <strong>base-ten blocks</strong> and <strong>100-grids</strong> to help students visualize how 0.7 is the same as 7/10. Once children can see the quantity, the conversion becomes a natural step in their mathematical vocabulary.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">⭐</span> {t('pages.fractionsToDecimals.wiki.milestonesTitle', 'Key Mastery Milestones')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Denominator Discovery:</strong> Recognizing that denominators of 10 and 100 map directly to decimal place value columns.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Equivalent Ratios:</strong> Learning to scale fractions up to have a denominator of 10, 100, or 1000 for instant conversion.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Problem-Solving Precision:</strong> Applying conversions to word problems involving money (cents as hundredths) and measurement.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "Numbers are like a toolbox; fractions and decimals are different tools for the same job."
          </p>
        </div>
      </div>
    </div>
  );
}
