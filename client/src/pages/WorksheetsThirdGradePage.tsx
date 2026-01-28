import React, { useState, useMemo } from 'react'
import { useTranslation } from '@/context/TranslationContext'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter, trackBuildPackClick } from '@/utils/analytics'
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

export default function WorksheetsThirdGradePage() {
  const { t, isRTL } = useTranslation();
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);

  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);

  const THIRD_GRADE_CATEGORIES: Category[] = [
    { id: 'multiplication', label: t('pages.thirdGrade.categories.multiplication'), icon: '✖️' },
    { id: 'division', label: t('pages.thirdGrade.categories.division'), icon: '➗' },
    { id: 'fractions', label: t('pages.thirdGrade.categories.fractions'), icon: '🍕' },
    { id: 'word-problems', label: t('pages.thirdGrade.categories.wordProblems'), icon: '🧮' },
    { id: 'geometry', label: t('pages.thirdGrade.categories.geometry'), icon: '📐' },
    { id: 'measurement', label: t('pages.thirdGrade.categories.measurement'), icon: '📏' },
    { id: 'cursive', label: t('pages.thirdGrade.categories.cursive'), icon: '✍️' },
  ];

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '3rd-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '3rd-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const THIRD_GRADE_WORKSHEETS: WorksheetItem[] = useMemo(() => [
    // Multiplication
    { title: t('pages.thirdGrade.worksheets.multFacts0_12.title'), description: t('pages.thirdGrade.worksheets.multFacts0_12.description'), href: getWorksheetURL('mult-facts-0-12', '3rd-grade'), docId: 'mult-facts-0-12', categories: ['multiplication'], section: 'Multiplication' },
    { title: t('pages.thirdGrade.worksheets.multArrays.title'), description: t('pages.thirdGrade.worksheets.multArrays.description'), href: getWorksheetURL('mult-arrays', '3rd-grade'), docId: 'mult-arrays', categories: ['multiplication'], section: 'Multiplication' },
    { title: t('pages.thirdGrade.worksheets.multWordProblems.title'), description: t('pages.thirdGrade.worksheets.multWordProblems.description'), href: getWorksheetURL('mult-word-problems', '3rd-grade'), docId: 'mult-word-problems', categories: ['multiplication', 'word-problems'], section: 'Multiplication' },
    { title: t('pages.thirdGrade.worksheets.multiplyingBy10_100.title'), description: t('pages.thirdGrade.worksheets.multiplyingBy10_100.description'), href: getWorksheetURL('mult-by-10-100', '3rd-grade'), docId: 'mult-by-10-100', categories: ['multiplication'], section: 'Multiplication' },
    { title: t('pages.thirdGrade.worksheets.propertiesOfMultiplication.title'), description: t('pages.thirdGrade.worksheets.propertiesOfMultiplication.description'), href: getWorksheetURL('mult-properties', '3rd-grade'), docId: 'mult-properties', categories: ['multiplication'], section: 'Multiplication' },
    // Division
    { title: t('pages.thirdGrade.worksheets.divFacts1_12.title'), description: t('pages.thirdGrade.worksheets.divFacts1_12.description'), href: getWorksheetURL('div-facts-1-12', '3rd-grade'), docId: 'div-facts-1-12', categories: ['division'], section: 'Division' },
    { title: t('pages.thirdGrade.worksheets.divWithRemainders.title'), description: t('pages.thirdGrade.worksheets.divWithRemainders.description'), href: getWorksheetURL('div-with-remainders', '3rd-grade'), docId: 'div-with-remainders', categories: ['division'], section: 'Division' },
    { title: t('pages.thirdGrade.worksheets.divWordProblems.title'), description: t('pages.thirdGrade.worksheets.divWordProblems.description'), href: getWorksheetURL('div-word-problems', '3rd-grade'), docId: 'div-word-problems', categories: ['division', 'word-problems'], section: 'Division' },
    { title: t('pages.thirdGrade.worksheets.factFamiliesMultDiv.title'), description: t('pages.thirdGrade.worksheets.factFamiliesMultDiv.description'), href: getWorksheetURL('fact-families-mult-div', '3rd-grade'), docId: 'fact-families-mult-div', categories: ['division', 'multiplication'], section: 'Division' },
    { title: t('pages.thirdGrade.worksheets.dividingBy10_100.title'), description: t('pages.thirdGrade.worksheets.dividingBy10_100.description'), href: getWorksheetURL('div-by-10-100', '3rd-grade'), docId: 'div-by-10-100', categories: ['division'], section: 'Division' },
    // Fractions
    { title: t('pages.thirdGrade.worksheets.fractionsPartsOfWhole.title'), description: t('pages.thirdGrade.worksheets.fractionsPartsOfWhole.description'), href: getWorksheetURL('fractions-whole', '3rd-grade'), docId: 'fractions-whole', categories: ['fractions'], section: 'Fractions' },
    { title: t('pages.thirdGrade.worksheets.comparingFractions.title'), description: t('pages.thirdGrade.worksheets.comparingFractions.description'), href: getWorksheetURL('comparing-fractions', '3rd-grade'), docId: 'comparing-fractions', categories: ['fractions'], section: 'Fractions' },
    { title: t('pages.thirdGrade.worksheets.equivalentFractions.title'), description: t('pages.thirdGrade.worksheets.equivalentFractions.description'), href: getWorksheetURL('equivalent-fractions', '3rd-grade'), docId: 'equivalent-fractions', categories: ['fractions'], section: 'Fractions' },
    { title: t('pages.thirdGrade.worksheets.fractionsOnNumberLine.title'), description: t('pages.thirdGrade.worksheets.fractionsOnNumberLine.description'), href: getWorksheetURL('fractions-number-line', '3rd-grade'), docId: 'fractions-number-line', categories: ['fractions'], section: 'Fractions' },
    { title: t('pages.thirdGrade.worksheets.addingSubtractingFractions.title'), description: t('pages.thirdGrade.worksheets.addingSubtractingFractions.description'), href: getWorksheetURL('add-sub-fractions', '3rd-grade'), docId: 'add-sub-fractions', categories: ['fractions'], section: 'Fractions' },
    // Word Problems
    { title: t('pages.thirdGrade.worksheets.multiStepWordProblems.title'), description: t('pages.thirdGrade.worksheets.multiStepWordProblems.description'), href: getWorksheetURL('multi-step-word-problems', '3rd-grade'), docId: 'multi-step-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: t('pages.thirdGrade.worksheets.elapsedTimeWordProblems.title'), description: t('pages.thirdGrade.worksheets.elapsedTimeWordProblems.description'), href: getWorksheetURL('elapsed-time-word-problems', '3rd-grade'), docId: 'elapsed-time-word-problems', categories: ['word-problems', 'measurement'], section: 'Word Problems' },
    { title: t('pages.thirdGrade.worksheets.moneyWordProblems.title'), description: t('pages.thirdGrade.worksheets.moneyWordProblems.description'), href: getWorksheetURL('money-word-problems', '3rd-grade'), docId: 'money-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: t('pages.thirdGrade.worksheets.perimeterAreaWordProblems.title'), description: t('pages.thirdGrade.worksheets.perimeterAreaWordProblems.description'), href: getWorksheetURL('perimeter-area-word-problems', '3rd-grade'), docId: 'perimeter-area-word-problems', categories: ['word-problems', 'geometry'], section: 'Word Problems' },
    // Geometry
    { title: t('pages.thirdGrade.worksheets.identifyPolygons.title'), description: t('pages.thirdGrade.worksheets.identifyPolygons.description'), href: getWorksheetURL('identify-polygons', '3rd-grade'), docId: 'identify-polygons', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.thirdGrade.worksheets.perimeterOfShapes.title'), description: t('pages.thirdGrade.worksheets.perimeterOfShapes.description'), href: getWorksheetURL('perimeter-shapes', '3rd-grade'), docId: 'perimeter-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.thirdGrade.worksheets.areaOfRectangles.title'), description: t('pages.thirdGrade.worksheets.areaOfRectangles.description'), href: getWorksheetURL('area-rectangles', '3rd-grade'), docId: 'area-rectangles', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.thirdGrade.worksheets.linesRaysAngles.title'), description: t('pages.thirdGrade.worksheets.linesRaysAngles.description'), href: getWorksheetURL('lines-rays-angles', '3rd-grade'), docId: 'lines-rays-angles', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.thirdGrade.worksheets.symmetry.title'), description: t('pages.thirdGrade.worksheets.symmetry.description'), href: getWorksheetURL('symmetry', '3rd-grade'), docId: 'symmetry', categories: ['geometry'], section: 'Geometry' },
    // Measurement
    { title: t('pages.thirdGrade.worksheets.timeToMinute.title'), description: t('pages.thirdGrade.worksheets.timeToMinute.description'), href: getWorksheetURL('time-to-minute', '3rd-grade'), docId: 'time-to-minute', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.thirdGrade.worksheets.customaryUnits.title'), description: t('pages.thirdGrade.worksheets.customaryUnits.description'), href: getWorksheetURL('customary-units', '3rd-grade'), docId: 'customary-units', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.thirdGrade.worksheets.metricUnits.title'), description: t('pages.thirdGrade.worksheets.metricUnits.description'), href: getWorksheetURL('metric-units', '3rd-grade'), docId: 'metric-units', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.thirdGrade.worksheets.liquidMeasurement.title'), description: t('pages.thirdGrade.worksheets.liquidMeasurement.description'), href: getWorksheetURL('liquid-measurement', '3rd-grade'), docId: 'liquid-measurement', categories: ['measurement'], section: 'Measurement' },
    { title: t('pages.thirdGrade.worksheets.massAndWeight.title'), description: t('pages.thirdGrade.worksheets.massAndWeight.description'), href: getWorksheetURL('mass-weight', '3rd-grade'), docId: 'mass-weight', categories: ['measurement'], section: 'Measurement' },
    // Cursive
    { title: t('pages.thirdGrade.worksheets.cursiveAlphabet.title'), description: t('pages.thirdGrade.worksheets.cursiveAlphabet.description'), href: addLocaleToPath('/worksheets/cursive-writing-alphabet-worksheets', getLocaleFromURL()), docId: 'cursive-writing-alphabet-worksheets', categories: ['cursive'], section: 'Cursive Writing', customPreviewUrl: getWorksheetPrintURL('cursive-writing-alphabet-worksheets', '3rd-grade') + '&preview=1' },
    { title: t('pages.thirdGrade.worksheets.cursivePractice.title'), description: t('pages.thirdGrade.worksheets.cursivePractice.description'), href: addLocaleToPath('/worksheets/cursive-writing-practice-sheets', getLocaleFromURL()), docId: 'cursive-writing-practice-sheets', categories: ['cursive'], section: 'Cursive Writing', customPreviewUrl: getWorksheetPrintURL('cursive-writing-practice-sheets', '3rd-grade') + '&preview=1' },
    { title: t('pages.thirdGrade.worksheets.capitalCursive.title'), description: t('pages.thirdGrade.worksheets.capitalCursive.description'), href: addLocaleToPath('/worksheets/capital-cursive-writing-worksheets', getLocaleFromURL()), docId: 'capital-cursive-writing-worksheets', categories: ['cursive'], section: 'Cursive Writing', customPreviewUrl: getWorksheetPrintURL('capital-cursive-writing-worksheets', '3rd-grade') + '&preview=1' },
    { title: t('pages.thirdGrade.worksheets.joiningCursive.title'), description: t('pages.thirdGrade.worksheets.joiningCursive.description'), href: addLocaleToPath('/worksheets/joining-cursive-letters-worksheets', getLocaleFromURL()), docId: 'joining-cursive-letters-worksheets', categories: ['cursive'], section: 'Cursive Writing', customPreviewUrl: getWorksheetPrintURL('joining-cursive-letters-worksheets', '3rd-grade') + '&preview=1' },
    { title: t('pages.thirdGrade.worksheets.printToCursive.title'), description: t('pages.thirdGrade.worksheets.printToCursive.description'), href: addLocaleToPath('/worksheets/half-print-half-cursive-writing', getLocaleFromURL()), docId: 'half-print-half-cursive-writing', categories: ['cursive'], section: 'Cursive Writing', customPreviewUrl: getWorksheetPrintURL('half-print-half-cursive-writing', '3rd-grade') + '&preview=1' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    // Reverse the array to show newly added worksheets (at the bottom of the list) first
    const newestFirst = [...THIRD_GRADE_WORKSHEETS].reverse()
    if (selectedCategories.size === 0) return newestFirst
    return newestFirst.filter((ws) =>
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, THIRD_GRADE_WORKSHEETS])

  // Group filtered worksheets by section
  const groupedWorksheets = useMemo(() => {
    const groups: Record<string, WorksheetItem[]> = {}
    filteredWorksheets.forEach((ws) => {
      const section = ws.section || 'Other'
      if (!groups[section]) groups[section] = []
      groups[section].push(ws)
    })
    return groups
  }, [filteredWorksheets])

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title={t('pages.thirdGrade.seoTitle')}
        description={t('pages.thirdGrade.seoDescription')}
        keywords={t('pages.thirdGrade.seoKeywords')}
        ogImage="/images/math-grade-3-seo.png"
        canonicalUrl={`https://wizqo.com${addLocaleToPath('/worksheets/3rd-grade-math-worksheets', getLocaleFromURL())}`}
        ogType="website"
      />
      {(() => {
        const currentLocale = getLocaleFromURL();
        const canonical = `https://wizqo.com${addLocaleToPath('/worksheets/3rd-grade-math-worksheets', currentLocale)}`;
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
            { "@type": "ListItem", position: 3, name: "3rd Grade Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "3rd Grade Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free 3rd grade math worksheets covering advanced multiplication, fractions, division, and multi-step word problems.",
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
                {t('pages.thirdGrade.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.thirdGrade.title')}
                <span className="block text-purple-600">{t('pages.thirdGrade.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.thirdGrade.description')}
              </p>
            </div>
          </div>
        </section>



        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.thirdGrade.whatsInside')}</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              {t('pages.thirdGrade.whatsInsideDesc')}
            </p>
            <div className="mt-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">{t('pages.thirdGrade.buildPack')}</div>
                <p className="text-slate-700 text-sm mb-3">{t('pages.thirdGrade.buildPackDesc')}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.thirdGrade.buildPackTime')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.thirdGrade.buildPackAge')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.thirdGrade.buildPackFocus')}</span>
                </div>
                <a href={addLocaleToPath("/print?doc=pack&time=5&age=g3&skill=math&from=3rd-grade", getLocaleFromURL())} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={() => trackBuildPackClick('3')}>{t('pages.printables.buildPackButton')}</a>
              </div>
            </div>
          </section>

          {/* Main content with sidebar layout */}
          <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Left sidebar - Category Filter */}
            <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <CategoryFilter
                  categories={THIRD_GRADE_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.thirdGrade.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right side - Worksheets grouped by section */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
                const sectionLabels: Record<string, string> = {
                  'Multiplication': `✖️ ${t('pages.thirdGrade.sections.multiplication')}`,
                  'Division': `➗ ${t('pages.thirdGrade.sections.division')}`,
                  'Fractions': `🍕 ${t('pages.thirdGrade.sections.fractions')}`,
                  'Word Problems': `🧮 ${t('pages.thirdGrade.sections.wordProblems')}`,
                  'Geometry': `📐 ${t('pages.thirdGrade.sections.geometry')}`,
                  'Measurement': `📏 ${t('pages.thirdGrade.sections.measurement')}`,
                  'Cursive Writing': `✍️ ${t('pages.thirdGrade.sections.cursive')}`,
                }
                const label = sectionLabels[section] || section

                return (
                  <div key={section}>
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
                  <p className="text-lg">{t('pages.thirdGrade.noWorksheets')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('pages.thirdGrade.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">{t('pages.thirdGrade.exploreMore')}</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/2nd-grade-math-worksheets", getLocaleFromURL())}>{t('pages.thirdGrade.exploreLinks.secondGrade')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/4th-grade-math-worksheets", getLocaleFromURL())}>{t('pages.thirdGrade.exploreLinks.fourthGrade')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/multiplication-worksheets", getLocaleFromURL())}>{t('pages.thirdGrade.exploreLinks.multiplication')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/times-table-multiplication-worksheets", getLocaleFromURL())}>{t('pages.thirdGrade.exploreLinks.timesTable')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/reading-comprehension", getLocaleFromURL())}>{t('pages.thirdGrade.exploreLinks.readingComprehension')}</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/printables", getLocaleFromURL())}>{t('pages.printables.title')}</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.thirdGrade.faqs')}</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">{t('pages.thirdGrade.faq1Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.thirdGrade.faq1Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">{t('pages.thirdGrade.faq2Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.thirdGrade.faq2Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">{t('pages.thirdGrade.faq3Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.thirdGrade.faq3Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">{t('pages.thirdGrade.faq4Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.thirdGrade.faq4Answer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* 3rd Grade Foundational Guide (SEO Injection) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <FoundationalNumberSenseGuide />
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

function FoundationalNumberSenseGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-blue-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🧩
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.thirdGrade.wiki.title', '3rd Grade Hub: The "Golden Year" of Math')}</h2>
            <p className="text-blue-100 font-medium italic">Mastering multiplication, fractions & the logic of groups</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-blue-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">✖️</span> {t('pages.thirdGrade.wiki.multiplicationTitle', 'The Shift to Multiplicative Thinking')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              3rd grade marks the most important shift in elementary mathematics: the transition from <strong>additive</strong> (adding things one by one) to <strong>multiplicative</strong> thinking (thinking in groups). Mastering multiplication is not just about memorization; it's about understanding <strong>scaling, arrays, and area</strong>. This foundation is what allows students to eventually master division and proportions.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-blue-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">🍕</span> {t('pages.thirdGrade.wiki.standardsTitle', 'Core 3rd Grade Horizons')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Fractions as Numbers:</strong> Shifting from seeing fractions as just "pizza slices" to seeing them as actual points on a 1D number line.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Division as Shared Logic:</strong> Understanding division as the inverse of multiplication (grouping vs. sharing) to solve real-world partition problems.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Measurement Clarity:</strong> Learning to measure to the nearest 1/4 inch and calculating area by tiling, connecting geometry to multiplication.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "A strong 3rd-grade foundation transforms math from a series of rules into a powerful language of logic."
          </p>
        </div>
      </div>
    </div>
  );
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t, language } = useTranslation();
  // Use print URL for preview (not SEO URL) to show actual worksheet content
  const printUrl = getWorksheetPrintURL(docId, '3rd-grade')
  // For the modal preview, we want the print URL with preview mode enabled
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
          title={`${t('pages.thirdGrade.previewOf')} ${title}`}
          aria-label={`Preview thumbnail of ${title} worksheet`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-none">
            {t('pages.thirdGrade.clickToView')}
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
                trackWorksheetDownload(docId, translatedTitle, '3rd-grade-hub', '3rd Grade')
                window.open(customDownloadUrl, '_blank')
                return
              }
              const printUrl = getWorksheetPrintURL(docId, '3rd-grade')
              trackWorksheetDownload(docId, translatedTitle, '3rd-grade-hub', '3rd Grade')
              window.open(printUrl, '_blank')
            }}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={`${t('pages.thirdGrade.download')} ${title}`}
          >
            {t('pages.thirdGrade.download')}
          </button>
        </div>
      </div>
    </article>
  )
});
