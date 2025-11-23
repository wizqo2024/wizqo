import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'

// Categories will be defined inside component to use translation

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

// Worksheets will be defined inside component to use translation

export default function WorksheetsFifthGradePage() {
  const { t, isRTL } = useTranslation();
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  const FIFTH_GRADE_CATEGORIES: Category[] = [
    { id: 'operations', label: t('pages.fifthGrade.categories.operations'), icon: '🔢' },
    { id: 'fractions-decimals', label: t('pages.fifthGrade.categories.fractionsDecimals'), icon: '🍕' },
    { id: 'algebra', label: t('pages.fifthGrade.categories.algebra'), icon: '📐' },
    { id: 'geometry', label: t('pages.fifthGrade.categories.geometry'), icon: '📐' },
    { id: 'word-problems', label: t('pages.fifthGrade.categories.wordProblems'), icon: '🧮' },
    { id: 'data-analysis', label: t('pages.fifthGrade.categories.dataAnalysis'), icon: '📊' },
  ];
  
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '5th-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '5th-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const FIFTH_GRADE_WORKSHEETS: WorksheetItem[] = useMemo(() => [
    // Advanced Operations
    { title: t('pages.fifthGrade.worksheets.mult3x2Digit.title'), description: t('pages.fifthGrade.worksheets.mult3x2Digit.description'), href: '/print?doc=mult-3x2-digit&from=5th-grade', docId: 'mult-3x2-digit', categories: ['operations'], section: 'Advanced Operations' },
    { title: t('pages.fifthGrade.worksheets.longDivisionMultidigit.title'), description: t('pages.fifthGrade.worksheets.longDivisionMultidigit.description'), href: '/print?doc=long-division-multidigit&from=5th-grade', docId: 'long-division-multidigit', categories: ['operations'], section: 'Advanced Operations' },
    { title: t('pages.fifthGrade.worksheets.orderOfOperations.title'), description: t('pages.fifthGrade.worksheets.orderOfOperations.description'), href: '/print?doc=order-of-operations&from=5th-grade', docId: 'order-of-operations', categories: ['operations'], section: 'Advanced Operations' },
    { title: t('pages.fifthGrade.worksheets.powersOf10.title'), description: t('pages.fifthGrade.worksheets.powersOf10.description'), href: '/print?doc=powers-of-10&from=5th-grade', docId: 'powers-of-10', categories: ['operations'], section: 'Advanced Operations' },
    { title: t('pages.fifthGrade.worksheets.roundingDecimals.title'), description: t('pages.fifthGrade.worksheets.roundingDecimals.description'), href: '/print?doc=rounding-decimals&from=5th-grade', docId: 'rounding-decimals', categories: ['operations', 'fractions-decimals'], section: 'Advanced Operations' },
    { title: t('pages.fifthGrade.worksheets.estimatingSumsDifferences.title'), description: t('pages.fifthGrade.worksheets.estimatingSumsDifferences.description'), href: '/print?doc=estimating-sums-differences&from=5th-grade', docId: 'estimating-sums-differences', categories: ['operations'], section: 'Advanced Operations' },
    // Fractions & Decimals
    { title: t('pages.fifthGrade.worksheets.addingSubtractingMixedNumbers.title'), description: t('pages.fifthGrade.worksheets.addingSubtractingMixedNumbers.description'), href: '/print?doc=add-sub-mixed-numbers&from=5th-grade', docId: 'add-sub-mixed-numbers', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.multiplyingFractions.title'), description: t('pages.fifthGrade.worksheets.multiplyingFractions.description'), href: '/print?doc=multiplying-fractions&from=5th-grade', docId: 'multiplying-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.dividingFractions.title'), description: t('pages.fifthGrade.worksheets.dividingFractions.description'), href: '/print?doc=dividing-fractions&from=5th-grade', docId: 'dividing-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.multiplyingDecimals.title'), description: t('pages.fifthGrade.worksheets.multiplyingDecimals.description'), href: '/print?doc=multiplying-decimals&from=5th-grade', docId: 'multiplying-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.dividingDecimals.title'), description: t('pages.fifthGrade.worksheets.dividingDecimals.description'), href: '/print?doc=dividing-decimals&from=5th-grade', docId: 'dividing-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.fractionsDecimalsPercents.title'), description: t('pages.fifthGrade.worksheets.fractionsDecimalsPercents.description'), href: '/print?doc=fractions-decimals-percents&from=5th-grade', docId: 'fractions-decimals-percents', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: t('pages.fifthGrade.worksheets.comparingOrderingFractionsDecimals.title'), description: t('pages.fifthGrade.worksheets.comparingOrderingFractionsDecimals.description'), href: '/print?doc=comparing-ordering-fractions-decimals&from=5th-grade', docId: 'comparing-ordering-fractions-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    // Algebra Basics
    { title: t('pages.fifthGrade.worksheets.evaluatingExpressions.title'), description: t('pages.fifthGrade.worksheets.evaluatingExpressions.description'), href: '/print?doc=evaluating-expressions&from=5th-grade', docId: 'evaluating-expressions', categories: ['algebra'], section: 'Algebra Basics' },
    { title: t('pages.fifthGrade.worksheets.writingExpressions.title'), description: t('pages.fifthGrade.worksheets.writingExpressions.description'), href: '/print?doc=writing-expressions&from=5th-grade', docId: 'writing-expressions', categories: ['algebra'], section: 'Algebra Basics' },
    { title: t('pages.fifthGrade.worksheets.solvingOneStepEquations.title'), description: t('pages.fifthGrade.worksheets.solvingOneStepEquations.description'), href: '/print?doc=solving-one-step-equations&from=5th-grade', docId: 'solving-one-step-equations', categories: ['algebra'], section: 'Algebra Basics' },
    { title: t('pages.fifthGrade.worksheets.patternsRules.title'), description: t('pages.fifthGrade.worksheets.patternsRules.description'), href: '/print?doc=patterns-rules&from=5th-grade', docId: 'patterns-rules', categories: ['algebra'], section: 'Algebra Basics' },
    { title: t('pages.fifthGrade.worksheets.coordinateGraphing.title'), description: t('pages.fifthGrade.worksheets.coordinateGraphing.description'), href: '/print?doc=coordinate-graphing&from=5th-grade', docId: 'coordinate-graphing', categories: ['algebra', 'geometry'], section: 'Algebra Basics' },
    // Geometry
    { title: t('pages.fifthGrade.worksheets.volumeRectangularPrisms.title'), description: t('pages.fifthGrade.worksheets.volumeRectangularPrisms.description'), href: '/print?doc=volume-rectangular-prisms&from=5th-grade', docId: 'volume-rectangular-prisms', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fifthGrade.worksheets.areaTrianglesParallelograms.title'), description: t('pages.fifthGrade.worksheets.areaTrianglesParallelograms.description'), href: '/print?doc=area-triangles-parallelograms&from=5th-grade', docId: 'area-triangles-parallelograms', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fifthGrade.worksheets.classifyingShapes.title'), description: t('pages.fifthGrade.worksheets.classifyingShapes.description'), href: '/print?doc=classifying-shapes&from=5th-grade', docId: 'classifying-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fifthGrade.worksheets.nets3dShapes.title'), description: t('pages.fifthGrade.worksheets.nets3dShapes.description'), href: '/print?doc=nets-3d-shapes&from=5th-grade', docId: 'nets-3d-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: t('pages.fifthGrade.worksheets.transformations5th.title'), description: t('pages.fifthGrade.worksheets.transformations5th.description'), href: '/print?doc=transformations-5th&from=5th-grade', docId: 'transformations-5th', categories: ['geometry'], section: 'Geometry' },
    // Word Problems
    { title: t('pages.fifthGrade.worksheets.multiStepWord5th.title'), description: t('pages.fifthGrade.worksheets.multiStepWord5th.description'), href: '/print?doc=multi-step-word-5th&from=5th-grade', docId: 'multi-step-word-5th', categories: ['word-problems'], section: 'Word Problems' },
    { title: t('pages.fifthGrade.worksheets.fractionWordProblems5th.title'), description: t('pages.fifthGrade.worksheets.fractionWordProblems5th.description'), href: '/print?doc=fraction-word-problems-5th&from=5th-grade', docId: 'fraction-word-problems-5th', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: t('pages.fifthGrade.worksheets.decimalWordProblems5th.title'), description: t('pages.fifthGrade.worksheets.decimalWordProblems5th.description'), href: '/print?doc=decimal-word-problems-5th&from=5th-grade', docId: 'decimal-word-problems-5th', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: t('pages.fifthGrade.worksheets.ratioProportionWordProblems.title'), description: t('pages.fifthGrade.worksheets.ratioProportionWordProblems.description'), href: '/print?doc=ratio-proportion-word-problems&from=5th-grade', docId: 'ratio-proportion-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: t('pages.fifthGrade.worksheets.percentWordProblems.title'), description: t('pages.fifthGrade.worksheets.percentWordProblems.description'), href: '/print?doc=percent-word-problems&from=5th-grade', docId: 'percent-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    // Data & Analysis
    { title: t('pages.fifthGrade.worksheets.lineGraphs.title'), description: t('pages.fifthGrade.worksheets.lineGraphs.description'), href: '/print?doc=line-graphs&from=5th-grade', docId: 'line-graphs', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: t('pages.fifthGrade.worksheets.meanMedianModeRange.title'), description: t('pages.fifthGrade.worksheets.meanMedianModeRange.description'), href: '/print?doc=mean-median-mode-range&from=5th-grade', docId: 'mean-median-mode-range', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: t('pages.fifthGrade.worksheets.stemLeafPlots.title'), description: t('pages.fifthGrade.worksheets.stemLeafPlots.description'), href: '/print?doc=stem-leaf-plots&from=5th-grade', docId: 'stem-leaf-plots', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: t('pages.fifthGrade.worksheets.probability.title'), description: t('pages.fifthGrade.worksheets.probability.description'), href: '/print?doc=probability&from=5th-grade', docId: 'probability', categories: ['data-analysis'], section: 'Data & Analysis' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return FIFTH_GRADE_WORKSHEETS
    return FIFTH_GRADE_WORKSHEETS.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, FIFTH_GRADE_WORKSHEETS])

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
        title={t('pages.fifthGrade.seoTitle')}
        description={t('pages.fifthGrade.seoDescription')}
        keywords={t('pages.fifthGrade.seoKeywords')}
        canonicalUrl="https://wizqo.com/worksheets/5th-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/5th-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "5th Grade Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "5th Grade Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free 5th grade math worksheets covering advanced multiplication, division, fractions, decimals, and algebra basics.",
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
                {t('pages.fifthGrade.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.fifthGrade.title')}
                <span className="block text-purple-600">{t('pages.fifthGrade.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.fifthGrade.description')}
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.fifthGrade.whatsInside')}</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            {t('pages.fifthGrade.whatsInsideDesc')}
          </p>
          <div className="mt-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="text-slate-900 font-semibold mb-1">{t('pages.fifthGrade.buildPack')}</div>
              <p className="text-slate-700 text-sm mb-3">{t('pages.fifthGrade.buildPackDesc')}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fifthGrade.buildPackTime')}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fifthGrade.buildPackAge')}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.fifthGrade.buildPackFocus')}</span>
              </div>
              <a href="/print?doc=pack&time=5&age=g5&skill=math&from=5th-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'5'});} catch{} }}>{t('pages.printables.buildPackButton')}</a>
            </div>
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={FIFTH_GRADE_CATEGORIES}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
                title={t('pages.fifthGrade.filterByCategory')}
              />
            </div>
          </aside>

          {/* Right side - Worksheets grouped by section */}
          <div className="space-y-8">
            {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
              const sectionLabels: Record<string, string> = {
                'Advanced Operations': `🔢 ${t('pages.fifthGrade.sections.advancedOperations')}`,
                'Fractions & Decimals': `🍕 ${t('pages.fifthGrade.sections.fractionsDecimals')}`,
                'Algebra Basics': `📐 ${t('pages.fifthGrade.sections.algebraBasics')}`,
                'Geometry': `📐 ${t('pages.fifthGrade.sections.geometry')}`,
                'Word Problems': `🧮 ${t('pages.fifthGrade.sections.wordProblems')}`,
                'Data & Analysis': `📊 ${t('pages.fifthGrade.sections.dataAnalysis')}`,
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
                      />
                    ))}
                  </div>
                </div>
              )
            })}
            {filteredWorksheets.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">{t('pages.fifthGrade.noWorksheets')}</p>
                <button
                  onClick={clearCategories}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t('pages.fifthGrade.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Explore More Worksheets */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">{t('pages.fifthGrade.exploreMore')}</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">{t('pages.fifthGrade.exploreLinks.fourthGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">{t('pages.fifthGrade.exploreLinks.thirdGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">{t('pages.fifthGrade.exploreLinks.multiplication')}</a></li>
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">{t('pages.fifthGrade.exploreLinks.timesTable')}</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">{t('pages.fifthGrade.exploreLinks.readingComprehension')}</a></li>
            <li><a className="hover:underline" href="/printables">{t('pages.printables.title')}</a></li>
          </ul>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.fifthGrade.faqs')}</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">{t('pages.fifthGrade.faq1Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.fifthGrade.faq1Answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">{t('pages.fifthGrade.faq2Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.fifthGrade.faq2Answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">{t('pages.fifthGrade.faq3Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.fifthGrade.faq3Answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">{t('pages.fifthGrade.faq4Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.fifthGrade.faq4Answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
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
                    <a
                      href={previewItem.href + (previewItem.href.includes('?') ? '&download=1' : '?download=1')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => {
                        window.open(previewItem.href, '_blank')
                        setTimeout(() => window.print(), 500)
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm"
                    >
                      🖨️ Print
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

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void }) {
  const { t, language } = useTranslation();
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1')
  
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
      
      {/* Worksheet Thumbnail Preview */}
      <div 
        className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
        onClick={() => onPreview?.({ title: translatedTitle, description: translatedDescription, href, docId, categories: [], section: '' })}
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
          title={t('pages.fifthGrade.previewOf') + ' ' + title}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.fifthGrade.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={href + (href.includes('?') ? '&download=1' : '?download=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={t('pages.fifthGrade.downloadButton')}
          >
            ⬇️ {t('pages.fifthGrade.downloadButton')}
          </a>
        </div>
      </div>
    </article>
  )
});
