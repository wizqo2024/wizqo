import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter, trackBuildPackClick } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'
import { getWorksheetURL, getWorksheetPrintURL } from '@/utils/worksheetLinks'
import { addLocaleToPath, getLocaleFromURL } from '@/utils/locale'
import { trackWorksheetDownload } from '@/utils/analytics'

// Categories will be defined inside component to use translation

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
  customPreviewUrl?: string
  customDownloadUrl?: string
}

// Worksheets will be defined inside component to use translation

export default function WorksheetsFourthGradePage() {
  const { t, isRTL } = useTranslation();
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);

  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);

  const FOURTH_GRADE_CATEGORIES: Category[] = [
    { id: 'multi-digit', label: t('pages.fourthGrade.categories.multiDigit'), icon: '🔢' },
    { id: 'fractions-decimals', label: t('pages.fourthGrade.categories.fractionsDecimals'), icon: '🍕' },
    { id: 'geometry', label: t('pages.fourthGrade.categories.geometry'), icon: '📐' },
    { id: 'measurement', label: t('pages.fourthGrade.categories.measurement'), icon: '📏' },
    { id: 'word-problems', label: t('pages.fourthGrade.categories.wordProblems'), icon: '🧮' },
    { id: 'data-analysis', label: t('pages.fourthGrade.categories.dataAnalysis'), icon: '📊' },
  ];

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev: Set<string>) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '4th-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '4th-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const FOURTH_GRADE_WORKSHEETS: WorksheetItem[] = useMemo(() => [
    // Multi-Digit Operations
    { title: t('pages.fourthGrade.worksheets.mult2x1Digit.title'), description: t('pages.fourthGrade.worksheets.mult2x1Digit.description'), href: getWorksheetURL('mult-2x1-digit', '4th-grade'), docId: 'mult-2x1-digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: t('pages.fourthGrade.worksheets.mult2x2Digit.title'), description: t('pages.fourthGrade.worksheets.mult2x2Digit.description'), href: getWorksheetURL('mult-2x2-digit', '4th-grade'), docId: 'mult-2x2-digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: t('pages.fourthGrade.worksheets.longDivision1Digit.title'), description: t('pages.fourthGrade.worksheets.longDivision1Digit.description'), href: getWorksheetURL('long-division-1digit', '4th-grade'), docId: 'long-division-1digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: t('pages.fourthGrade.worksheets.longDivision2Digit.title'), description: t('pages.fourthGrade.worksheets.longDivision2Digit.description'), href: getWorksheetURL('long-division-2digit', '4th-grade'), docId: 'long-division-2digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: t('pages.fourthGrade.worksheets.areaModelMultiplication.title'), description: t('pages.fourthGrade.worksheets.areaModelMultiplication.description'), href: getWorksheetURL('area-model-mult', '4th-grade'), docId: 'area-model-mult', categories: ['multi-digit', 'geometry'], section: 'Multi-Digit Operations' },
    { title: t('pages.fourthGrade.worksheets.partialProductsMultiplication.title'), description: t('pages.fourthGrade.worksheets.partialProductsMultiplication.description'), href: getWorksheetURL('partial-products', '4th-grade'), docId: 'partial-products', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    // Fractions & Decimals
    { title: t('pages.fourthGrade.worksheets.equivalentFractions4th.title'), description: t('pages.fourthGrade.worksheets.equivalentFractions4th.description'), href: getWorksheetURL('equivalent-fractions-4th', '4th-grade'), docId: 'equivalent-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.comparingFractions4th.title'), description: t('pages.fourthGrade.worksheets.comparingFractions4th.description'), href: getWorksheetURL('comparing-fractions-4th', '4th-grade'), docId: 'comparing-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.addingSubtractingFractions4th.title'), description: t('pages.fourthGrade.worksheets.addingSubtractingFractions4th.description'), href: getWorksheetURL('add-sub-fractions-4th', '4th-grade'), docId: 'add-sub-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.mixedNumbersImproperFractions.title'), description: t('pages.fourthGrade.worksheets.mixedNumbersImproperFractions.description'), href: getWorksheetURL('mixed-improper-fractions', '4th-grade'), docId: 'mixed-improper-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.decimalsPlaceValue.title'), description: t('pages.fourthGrade.worksheets.decimalsPlaceValue.description'), href: getWorksheetURL('decimals-place-value', '4th-grade'), docId: 'decimals-place-value', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.comparingOrderingDecimals.title'), description: t('pages.fourthGrade.worksheets.comparingOrderingDecimals.description'), href: getWorksheetURL('comparing-decimals', '4th-grade'), docId: 'comparing-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.addingSubtractingDecimals.title'), description: t('pages.fourthGrade.worksheets.addingSubtractingDecimals.description'), href: getWorksheetURL('add-sub-decimals', '4th-grade'), docId: 'add-sub-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fourthGrade.worksheets.fractionsToDecimals.title'), description: t('pages.fourthGrade.worksheets.fractionsToDecimals.description'), href: getWorksheetURL('fractions-to-decimals', '4th-grade'), docId: 'fractions-to-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    // Geometry
    { title: t('pages.fourthGrade.worksheets.classifyingAngles.title'), description: t('pages.fourthGrade.worksheets.classifyingAngles.description'), href: getWorksheetURL('classifying-angles', '4th-grade'), docId: 'classifying-angles', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fourthGrade.worksheets.areaPerimeter4th.title'), description: t('pages.fourthGrade.worksheets.areaPerimeter4th.description'), href: getWorksheetURL('area-perimeter-4th', '4th-grade'), docId: 'area-perimeter-4th', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fourthGrade.worksheets.linesAngles4th.title'), description: t('pages.fourthGrade.worksheets.linesAngles4th.description'), href: getWorksheetURL('lines-angles-4th', '4th-grade'), docId: 'lines-angles-4th', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fourthGrade.worksheets.classifyingTriangles.title'), description: t('pages.fourthGrade.worksheets.classifyingTriangles.description'), href: getWorksheetURL('classifying-triangles', '4th-grade'), docId: 'classifying-triangles', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fourthGrade.worksheets.classifyingQuadrilaterals.title'), description: t('pages.fourthGrade.worksheets.classifyingQuadrilaterals.description'), href: getWorksheetURL('classifying-quadrilaterals', '4th-grade'), docId: 'classifying-quadrilaterals', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fourthGrade.worksheets.symmetryTransformations.title'), description: t('pages.fourthGrade.worksheets.symmetryTransformations.description'), href: getWorksheetURL('symmetry-transformations', '4th-grade'), docId: 'symmetry-transformations', categories: ['geometry'], section: 'Geometry' },
    // Measurement
    { title: t('pages.fourthGrade.worksheets.customaryUnitsConversion.title'), description: t('pages.fourthGrade.worksheets.customaryUnitsConversion.description'), href: getWorksheetURL('customary-conversion', '4th-grade'), docId: 'customary-conversion', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.fourthGrade.worksheets.metricUnitsConversion.title'), description: t('pages.fourthGrade.worksheets.metricUnitsConversion.description'), href: getWorksheetURL('metric-conversion', '4th-grade'), docId: 'metric-conversion', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.fourthGrade.worksheets.elapsedTime4th.title'), description: t('pages.fourthGrade.worksheets.elapsedTime4th.description'), href: getWorksheetURL('elapsed-time-4th', '4th-grade'), docId: 'elapsed-time-4th', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.fourthGrade.worksheets.liquidMeasurement4th.title'), description: t('pages.fourthGrade.worksheets.liquidMeasurement4th.description'), href: getWorksheetURL('liquid-measurement-4th', '4th-grade'), docId: 'liquid-measurement-4th', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.fourthGrade.worksheets.massWeight4th.title'), description: t('pages.fourthGrade.worksheets.massWeight4th.description'), href: getWorksheetURL('mass-weight-4th', '4th-grade'), docId: 'mass-weight-4th', categories: ['measurement'], section: 'Measurement' },
    // Word Problems
    { title: t('pages.fourthGrade.worksheets.multiStepWord4th.title'), description: t('pages.fourthGrade.worksheets.multiStepWord4th.description'), href: getWorksheetURL('multi-step-word-4th', '4th-grade'), docId: 'multi-step-word-4th', categories: ['word-problems'], section: 'Word Problems' },
    { title: t('pages.fourthGrade.worksheets.fractionWordProblems.title'), description: t('pages.fourthGrade.worksheets.fractionWordProblems.description'), href: getWorksheetURL('fraction-word-problems', '4th-grade'), docId: 'fraction-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: t('pages.fourthGrade.worksheets.decimalWordProblems.title'), description: t('pages.fourthGrade.worksheets.decimalWordProblems.description'), href: getWorksheetURL('decimal-word-problems', '4th-grade'), docId: 'decimal-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: t('pages.fourthGrade.worksheets.measurementWordProblems.title'), description: t('pages.fourthGrade.worksheets.measurementWordProblems.description'), href: getWorksheetURL('measurement-word-problems', '4th-grade'), docId: 'measurement-word-problems', categories: ['word-problems', 'measurement'], section: 'Word Problems' },
    { title: t('pages.fourthGrade.worksheets.geometryWordProblems.title'), description: t('pages.fourthGrade.worksheets.geometryWordProblems.description'), href: getWorksheetURL('geometry-word-problems', '4th-grade'), docId: 'geometry-word-problems', categories: ['word-problems', 'geometry'], section: 'Word Problems' },
    // Data & Analysis
    { title: t('pages.fourthGrade.worksheets.linePlots.title'), description: t('pages.fourthGrade.worksheets.linePlots.description'), href: getWorksheetURL('line-plots', '4th-grade'), docId: 'line-plots', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: t('pages.fourthGrade.worksheets.barGraphsPictographs.title'), description: t('pages.fourthGrade.worksheets.barGraphsPictographs.description'), href: getWorksheetURL('bar-graphs-pictographs', '4th-grade'), docId: 'bar-graphs-pictographs', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: t('pages.fourthGrade.worksheets.meanMedianMode.title'), description: t('pages.fourthGrade.worksheets.meanMedianMode.description'), href: getWorksheetURL('mean-median-mode', '4th-grade'), docId: 'mean-median-mode', categories: ['data-analysis'], section: 'Data & Analysis' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    // Reverse the array to show newly added worksheets (at the bottom of the list) first
    const newestFirst = [...FOURTH_GRADE_WORKSHEETS].reverse()
    if (selectedCategories.size === 0) return newestFirst
    return newestFirst.filter((ws: WorksheetItem) =>
      ws.categories.some((cat: string) => selectedCategories.has(cat))
    )
  }, [selectedCategories, FOURTH_GRADE_WORKSHEETS])

  // Group filtered worksheets by section
  const groupedWorksheets = useMemo(() => {
    const groups: Record<string, WorksheetItem[]> = {}
    filteredWorksheets.forEach((ws: WorksheetItem) => {
      const section = ws.section || 'Other'
      if (!groups[section]) groups[section] = []
      groups[section].push(ws)
    })
    return groups
  }, [filteredWorksheets])

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.fourthGrade.seoTitle')}
        description={t('pages.fourthGrade.seoDescription')}
        keywords={t('pages.fourthGrade.seoKeywords')}
        ogImage="/images/math-grade-4-seo.jpg"
        canonicalUrl={`https://wizqo.com${addLocaleToPath('/worksheets/4th-grade-math-worksheets', getLocaleFromURL())}`}
        ogType="website"
      />
      {(() => {
        const currentLocale = getLocaleFromURL();
        const canonical = `https://wizqo.com${addLocaleToPath('/worksheets/4th-grade-math-worksheets', currentLocale)}`;
        const homeUrl = `https://wizqo.com${addLocaleToPath('/', currentLocale)}`;
        const allWorksheetsUrl = `https://wizqo.com${addLocaleToPath('/worksheets/all', currentLocale)}`;
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: allWorksheetsUrl },
            { "@type": "ListItem", position: 3, name: "4th Grade Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "4th Grade Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free 4th grade math worksheets covering multiplication, division, fractions, decimals, and geometry.",
          breadcrumb: { "@id": breadcrumbId }
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-emerald-50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                {t('pages.fourthGrade.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.fourthGrade.title')}
                <span className="block text-purple-600">{t('pages.fourthGrade.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.fourthGrade.description')}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.fourthGrade.whatsInside')}</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              {t('pages.fourthGrade.whatsInsideDesc')}
            </p>
            <div className="mt-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">{t('pages.fourthGrade.buildPack')}</div>
                <p className="text-slate-700 text-sm mb-3">{t('pages.fourthGrade.buildPackDesc')}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fourthGrade.buildPackTime')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fourthGrade.buildPackAge')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fourthGrade.buildPackFocus')}</span>
                </div>
                <a href={addLocaleToPath("/print?doc=pack&time=5&age=g4&skill=math&from=4th-grade", getLocaleFromURL())} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={() => trackBuildPackClick('4')}>{t('pages.printables.buildPackButton')}</a>
              </div>
            </div>
          </section>

          {/* Main content with sidebar layout */}
          <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Left sidebar - Category Filter */}
            <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <CategoryFilter
                  categories={FOURTH_GRADE_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.fourthGrade.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right side - Worksheets grouped by section */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
                const sectionLabels: Record<string, string> = {
                  'Multi-Digit Operations': `🔢 ${t('pages.fourthGrade.sections.multiDigitOperations')}`,
                  'Fractions & Decimals': `🍕 ${t('pages.fourthGrade.sections.fractionsDecimals')}`,
                  'Geometry': `📐 ${t('pages.fourthGrade.sections.geometry')}`,
                  'Measurement': `📏 ${t('pages.fourthGrade.sections.measurement')}`,
                  'Word Problems': `🧮 ${t('pages.fourthGrade.sections.wordProblems')}`,
                  'Data & Analysis': `📊 ${t('pages.fourthGrade.sections.dataAnalysis')}`,
                }
                const label = sectionLabels[section] || section

                return (
                  <div key={section}>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{label}</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {worksheets.map((ws: WorksheetItem) => (
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
                  <p className="text-lg">{t('pages.fourthGrade.noWorksheets')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('pages.fourthGrade.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">{t('pages.fourthGrade.exploreMore')}</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/3rd-grade-math-worksheets", getLocaleFromURL())}>{t('pages.fourthGrade.exploreLinks.thirdGrade')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/5th-grade-math-worksheets", getLocaleFromURL())}>{t('pages.fourthGrade.exploreLinks.fifthGrade')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/multiplication-worksheets", getLocaleFromURL())}>{t('pages.fourthGrade.exploreLinks.multiplication')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/times-table-multiplication-worksheets", getLocaleFromURL())}>{t('pages.fourthGrade.exploreLinks.timesTable')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/reading-comprehension", getLocaleFromURL())}>{t('pages.fourthGrade.exploreLinks.readingComprehension')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/printables", getLocaleFromURL())}>{t('pages.printables.title')}</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.fourthGrade.faqs')}</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">{t('pages.fourthGrade.faq1Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.fourthGrade.faq1Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">{t('pages.fourthGrade.faq2Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.fourthGrade.faq2Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">{t('pages.fourthGrade.faq3Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.fourthGrade.faq3Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">{t('pages.fourthGrade.faq4Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.fourthGrade.faq4Answer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* 4th Grade Mastery Guide (SEO Injection) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <FourthGradeMasteryGuide />
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

function FourthGradeMasteryGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-yellow-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🌟
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.fourthGrade.wiki.title', '4th Grade Hub: Mastering New Complexity')}</h2>
            <p className="text-amber-100 font-medium italic">Introduction to decimals, multi-digit operations & geometry</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-yellow-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🔢</span> {t('pages.fourthGrade.wiki.decimalsTitle', 'Understanding Decimal Foundations')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              In 4th grade, students encounter <strong>decimals</strong> for the first time. This is a critical transition where they learn how the base-ten system extends below one. Mastering <strong>tenths and hundredths</strong> through visual models helps students bridge the gap between fractions and decimals, setting the stage for financial literacy and scientific measurement.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-yellow-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">📐</span> {t('pages.fourthGrade.wiki.standardsTitle', 'Key 4th Grade Math Standards')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Equivalent Fractions:</strong> Students learn to use multiplication and division to find equivalent fractions and compare fractions with different denominators.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Multi-Digit multiplication:</strong> Moving beyond rote facts to multiplying up to four digits by one digit, or two-digit by two-digit numbers using area models.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Geometric Symmetry:</strong> Identifying lines of symmetry in two-dimensional figures and understanding properties of rays, segments, and angles.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "4th grade is the year where math becomes a tool for solving multi-step, real-world problems."
          </p>
        </div>
      </div>
    </div>
  );
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t, language } = useTranslation();
  // Use print URL for preview (not SEO URL) to show actual worksheet content
  const printUrl = getWorksheetPrintURL(docId, '4th-grade')
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
          title={`${t('pages.fourthGrade.previewOf')} ${title}`}
          aria-label={`Preview thumbnail of ${title} worksheet`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-none">
            {t('pages.fourthGrade.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </a>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (customDownloadUrl) {
                trackWorksheetDownload(docId, translatedTitle, '4th-grade-hub', '4th Grade')
                window.open(customDownloadUrl, '_blank')
                return
              }
              const printUrl = getWorksheetPrintURL(docId, '4th-grade')
              trackWorksheetDownload(docId, translatedTitle, '4th-grade-hub', '4th Grade')
              window.open(printUrl, '_blank')
            }}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={`${t('pages.fourthGrade.download')} ${title}`}
          >
            {t('pages.fourthGrade.download')}
          </button>
        </div>
      </div>
    </article>
  )
});
