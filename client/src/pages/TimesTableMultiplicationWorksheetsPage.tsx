import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackPackGeneration, trackCategoryFilter } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'
import { getWorksheetURL, getWorksheetPrintURL } from '@/utils/worksheetLinks'
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton'

// TIMES_TABLE_CATEGORIES will be created inside component to use translations

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

export default function TimesTableMultiplicationWorksheetsPage() {
  const { t, isRTL } = useTranslation();
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);

  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);

  const TIMES_TABLE_CATEGORIES: Category[] = [
    { id: 'horizontal', label: t('pages.timesTable.categories.horizontal'), icon: '➡️' },
    { id: 'vertical', label: t('pages.timesTable.categories.vertical'), icon: '⬇️' },
    { id: 'missing-number', label: t('pages.timesTable.categories.missingNumber'), icon: '❓' },
    { id: 'timed', label: t('pages.timesTable.categories.timed'), icon: '⏱️' },
    { id: 'blank', label: t('pages.timesTable.categories.blank'), icon: '📋' },
    { id: 'confidence', label: t('pages.timesTable.categories.confidence'), icon: '💪' },
    { id: 'fluency', label: t('pages.timesTable.categories.fluency'), icon: '⚡' },
  ];

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'times-table-multiplication-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'times-table-multiplication-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all times table worksheets with their categories
  const allWorksheets: WorksheetItem[] = useMemo(() => [
    // Horizontal Format Worksheets
    { title: t('pages.timesTable.worksheets.horizontal1_5.title'), description: t('pages.timesTable.worksheets.horizontal1_5.description'), href: getWorksheetURL('times-table-horizontal-1-5', 'times-table'), docId: 'times-table-horizontal-1-5', categories: ['horizontal', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.horizontal6_12.title'), description: t('pages.timesTable.worksheets.horizontal6_12.description'), href: getWorksheetURL('times-table-horizontal-6-12', 'times-table'), docId: 'times-table-horizontal-6-12', categories: ['horizontal', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.horizontal1_12.title'), description: t('pages.timesTable.worksheets.horizontal1_12.description'), href: getWorksheetURL('times-table-horizontal-1-12', 'times-table'), docId: 'times-table-horizontal-1-12', categories: ['horizontal', 'fluency'], gradeRange: 'All' },

    // Vertical Format Worksheets
    { title: t('pages.timesTable.worksheets.vertical1_5.title'), description: t('pages.timesTable.worksheets.vertical1_5.description'), href: getWorksheetURL('times-table-vertical-1-5', 'times-table'), docId: 'times-table-vertical-1-5', categories: ['vertical', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.vertical6_12.title'), description: t('pages.timesTable.worksheets.vertical6_12.description'), href: getWorksheetURL('times-table-vertical-6-12', 'times-table'), docId: 'times-table-vertical-6-12', categories: ['vertical', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.vertical1_12.title'), description: t('pages.timesTable.worksheets.vertical1_12.description'), href: getWorksheetURL('times-table-vertical-1-12', 'times-table'), docId: 'times-table-vertical-1-12', categories: ['vertical', 'fluency'], gradeRange: 'All' },

    // Missing Number Worksheets
    { title: t('pages.timesTable.worksheets.missing1_5.title'), description: t('pages.timesTable.worksheets.missing1_5.description'), href: getWorksheetURL('times-table-missing-1-5', 'times-table'), docId: 'times-table-missing-1-5', categories: ['missing-number', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.missing6_12.title'), description: t('pages.timesTable.worksheets.missing6_12.description'), href: getWorksheetURL('times-table-missing-6-12', 'times-table'), docId: 'times-table-missing-6-12', categories: ['missing-number', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.missingMixed.title'), description: t('pages.timesTable.worksheets.missingMixed.description'), href: getWorksheetURL('times-table-missing-mixed', 'times-table'), docId: 'times-table-missing-mixed', categories: ['missing-number', 'fluency'], gradeRange: 'All' },

    // Timed Test Worksheets
    { title: t('pages.timesTable.worksheets.timed1_5.title'), description: t('pages.timesTable.worksheets.timed1_5.description'), href: getWorksheetURL('times-table-timed-1-5', 'times-table'), docId: 'times-table-timed-1-5', categories: ['timed', 'fluency'], gradeRange: '2nd-3rd' },
    { title: t('pages.timesTable.worksheets.timed6_12.title'), description: t('pages.timesTable.worksheets.timed6_12.description'), href: getWorksheetURL('times-table-timed-6-12', 'times-table'), docId: 'times-table-timed-6-12', categories: ['timed', 'fluency'], gradeRange: '3rd-5th' },
    { title: t('pages.timesTable.worksheets.timed1_12.title'), description: t('pages.timesTable.worksheets.timed1_12.description'), href: getWorksheetURL('times-table-timed-1-12', 'times-table'), docId: 'times-table-timed-1-12', categories: ['timed', 'fluency'], gradeRange: 'All' },

    // Blank Times Table Worksheets
    { title: t('pages.timesTable.worksheets.blank1_5.title'), description: t('pages.timesTable.worksheets.blank1_5.description'), href: getWorksheetURL('times-table-blank-1-5', 'times-table'), docId: 'times-table-blank-1-5', categories: ['blank', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.blank6_12.title'), description: t('pages.timesTable.worksheets.blank6_12.description'), href: getWorksheetURL('times-table-blank-6-12', 'times-table'), docId: 'times-table-blank-6-12', categories: ['blank', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.blank1_12.title'), description: t('pages.timesTable.worksheets.blank1_12.description'), href: getWorksheetURL('times-table-blank-1-12', 'times-table'), docId: 'times-table-blank-1-12', categories: ['blank', 'fluency'], gradeRange: 'All' },

    // Confidence Building Worksheets
    { title: t('pages.timesTable.worksheets.confidence1_5.title'), description: t('pages.timesTable.worksheets.confidence1_5.description'), href: getWorksheetURL('times-table-confidence-1-5', 'times-table'), docId: 'times-table-confidence-1-5', categories: ['confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.confidence6_12.title'), description: t('pages.timesTable.worksheets.confidence6_12.description'), href: getWorksheetURL('times-table-confidence-6-12', 'times-table'), docId: 'times-table-confidence-6-12', categories: ['confidence'], gradeRange: '3rd-4th' },

    // Fluency Practice Worksheets
    { title: t('pages.timesTable.worksheets.fluency1_12.title'), description: t('pages.timesTable.worksheets.fluency1_12.description'), href: getWorksheetURL('times-table-fluency-1-12', 'times-table'), docId: 'times-table-fluency-1-12', categories: ['fluency'], gradeRange: 'All' },
    { title: t('pages.timesTable.worksheets.mixedReview.title'), description: t('pages.timesTable.worksheets.mixedReview.description'), href: getWorksheetURL('times-table-mixed-review', 'times-table'), docId: 'times-table-mixed-review', categories: ['fluency'], gradeRange: 'All' },

    // Color-by-Number Worksheets
    { title: t('pages.timesTable.worksheets.color1_5.title'), description: t('pages.timesTable.worksheets.color1_5.description'), href: getWorksheetURL('times-table-color-1-5', 'times-table'), docId: 'times-table-color-1-5', categories: ['fluency'], gradeRange: '1st-3rd' },
    { title: t('pages.timesTable.worksheets.color6_12.title'), description: t('pages.timesTable.worksheets.color6_12.description'), href: getWorksheetURL('times-table-color-6-12', 'times-table'), docId: 'times-table-color-6-12', categories: ['fluency'], gradeRange: '3rd-5th' },
    { title: t('pages.timesTable.worksheets.color1_12.title'), description: t('pages.timesTable.worksheets.color1_12.description'), href: getWorksheetURL('times-table-color-1-12', 'times-table'), docId: 'times-table-color-1-12', categories: ['fluency'], gradeRange: 'All' },
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
    filteredWorksheets.forEach((ws) => {
      const range = ws.gradeRange || 'All'
      if (!groups[range]) groups[range] = []
      groups[range].push(ws)
    })
    return groups
  }, [filteredWorksheets])

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.timesTable.seoTitle')}
        description={t('pages.timesTable.seoDescription')}
        keywords={t('pages.timesTable.seoKeywords')}
        canonicalUrl="https://wizqo.com/worksheets/times-table-multiplication-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/times-table-multiplication-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
            { "@type": "ListItem", position: 3, name: "Times Table Multiplication Worksheets", item: "https://wizqo.com/worksheets/times-table-multiplication-worksheets" }
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
          <span className="label">{t('pages.handwriting.name')}</span>
          <span className="line" />
        </div>
        <div>
          <span className="label">{t('pages.handwriting.date')}</span>
          <span className="line" />
        </div>
      </div>
      <main className="bg-gradient-to-b from-purple-50/70 via-white to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                {t('pages.timesTable.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.timesTable.title')}
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.timesTable.description')}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.timesTable.whatsInside')}</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              {t('pages.timesTable.whatsInsideDesc')}
            </p>
            <div className="mt-4">
              <BuildPackInline />
            </div>
          </section>

          {/* Main content with sidebar layout */}
          <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Left sidebar - Category Filter */}
            <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <CategoryFilter
                  categories={TIMES_TABLE_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.timesTable.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right side - Worksheets grouped by grade range */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([gradeRange, worksheets]) => {
                const gradeLabels: Record<string, string> = {
                  '1st-2nd': t('pages.timesTable.gradeLabels.firstSecond'),
                  '2nd-3rd': t('pages.timesTable.gradeLabels.secondThird'),
                  '3rd-4th': t('pages.timesTable.gradeLabels.thirdFourth'),
                  '3rd-5th': t('pages.timesTable.gradeLabels.thirdFifth'),
                  'All': t('pages.timesTable.gradeLabels.all'),
                }
                const label = gradeLabels[gradeRange] || `Grade ${gradeRange}`

                return (
                  <div key={gradeRange}>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{label}</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {worksheets.map((ws) => (
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
                  <p className="text-lg">{t('pages.timesTable.noWorksheets')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('pages.timesTable.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">{t('pages.timesTable.exploreMore')}</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">{t('pages.timesTable.exploreLinks.multiplication')}</a></li>
              <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">{t('pages.timesTable.exploreLinks.thirdGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">{t('pages.timesTable.exploreLinks.fourthGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">{t('pages.timesTable.exploreLinks.secondGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">{t('pages.timesTable.exploreLinks.firstGrade')}</a></li>
              <li><a className="hover:underline" href="/printables">{t('pages.printables.title')}</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.timesTable.faqs')}</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">{t('pages.timesTable.faq1Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.timesTable.faq1Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">{t('pages.timesTable.faq2Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.timesTable.faq2Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">{t('pages.timesTable.faq3Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.timesTable.faq3Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">{t('pages.timesTable.faq4Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.timesTable.faq4Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger className="px-4">{t('pages.timesTable.faq5Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.timesTable.faq5Answer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* Math Strategy Guide (SEO Wiki Injection) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <MathStrategyGuide />
        </section>
      </main>
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
                  className="ml-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
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
                    />
                  </div>

                  {/* Info Footer */}
                  <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                    <p className="font-semibold mb-2">📄 Preview</p>
                    <p>Click the Download button below to download as PDF or use your browser's print function.</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center gap-3">
                    <PDFDownloadButton
                      onClick={() => {
                        const newWindow = window.open(previewItem.href, '_blank')
                        if (newWindow) {
                          setTimeout(() => {
                          }, 500)
                        }
                      }}
                      isGenerating={false}
                      disableDefaultPositioning={true}
                      label="Download"
                      className="px-4 py-2"
                    />
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

function MathStrategyGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🎓
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.timesTable.wiki.title', 'Teacher\'s Corner: Master Multiplication')}</h2>
            <p className="text-purple-100 font-medium">Expert strategies for grades 2-5</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-purple-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🧠</span> {t('pages.timesTable.wiki.whyTitle', 'Why Memorize Times Tables?')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Multiplication fluency is the <strong>bridge to advanced math</strong>. Without automatic recall of facts 0-12, students often struggle with <strong>long division</strong> and <strong>fractions</strong> in 4th grade and beyond. Building a strong foundation now prevents "math anxiety" and allows students to focus on complex problem-solving rather than basic calculations.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-purple-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span> {t('pages.timesTable.wiki.tipsTitle', '3 Expert Teaching Tips')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Start with Skip Counting:</strong> Before memorizing 5x3, practice counting by 5s (5, 10, 15). This builds number sense and makes multiplication intuitive.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Master the "9s" Trick:</strong> Teach students that the digits of any multiple of 9 add up to 9 (e.g., 9x2=18, 1+8=9). This simple pattern builds massive confidence.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Timed Drills for Fluency:</strong> Use our "Fluency" PDFs for 1-minute sprints to build speed, but only after accuracy is firmly established.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "The goal isn't just speed; it's the confidence that comes from knowing the numbers."
          </p>
        </div>
      </div>
    </div>
  );
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t, language } = useTranslation();
  // Use print URL for preview (not SEO URL) to show actual worksheet content
  const printUrl = getWorksheetPrintURL(docId, 'times-table')
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
            {t('pages.printables.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </a>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{t('pages.timesTable.answerKeyIncluded')}</span>
        </div>
        <div className="flex items-center gap-2">
          <PDFDownloadButton
            onClick={() => {
              if (customDownloadUrl) {
                window.open(customDownloadUrl, '_blank')
                return
              }
              const printUrl = getWorksheetPrintURL(docId, 'times-table')
              window.open(printUrl, '_blank')
            }}
            isGenerating={false}
            disableDefaultPositioning={true}
            label={t('pages.printables.download')}
            className="px-3 py-1.5"
          />
        </div>
      </div>
    </article>
  )
});

function BuildPackInline() {
  const { t } = useTranslation();
  const handleBuildPack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Generate a new variant/timestamp for each click to create a new pack
    const variant = Math.floor(Math.random() * 1000);
    const timestamp = Date.now();
    const url = `/print?doc=pack&time=5&age=25&skill=math&from=times-table&variant=${variant}&timestamp=${timestamp}`;
    e.preventDefault();
    // Track pack generation
    trackPackGeneration(5, '25', 'math', 5); // 5 minutes, age 25 (2nd-5th), math, ~5 worksheets
    window.location.href = url;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="text-base font-semibold text-slate-900 mb-1">{t('pages.timesTable.buildPack')}</div>
      <p className="text-slate-700 text-sm mb-3">{t('pages.timesTable.buildPackDesc')}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.timesTable.buildPackTime')}</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.timesTable.buildPackAge')}</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.timesTable.buildPackFocus')}</span>
      </div>
      <a href="/print?doc=pack&time=5&age=25&skill=math&from=times-table" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={handleBuildPack}>{t('pages.printables.buildPackButton')}</a>
    </div>
  )
}
