// @ts-nocheck
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
import { addLocaleToPath, getLocaleFromURL } from '@/utils/locale'
import { HUB_SEO_DATA } from '@shared/worksheetSEO'

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

export default function MultiplicationWorksheetsPage() {
  const { t, language, isRTL } = useTranslation()
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);
  React.useEffect(() => { }, [language])

  const MULTIPLICATION_CATEGORIES: Category[] = useMemo(() => [
    { id: 'facts', label: t('pages.multiplication.categories.facts'), icon: '✖️' },
    { id: 'arrays', label: t('pages.multiplication.categories.arrays'), icon: '📊' },
    { id: 'word-problems', label: t('pages.multiplication.categories.wordProblems'), icon: '🧮' },
    { id: 'multi-digit', label: t('pages.multiplication.categories.multiDigit'), icon: '🔢' },
    { id: 'fluency', label: t('pages.multiplication.categories.fluency'), icon: '⏱️' },
    { id: 'skip-counting', label: t('pages.multiplication.categories.skipCounting'), icon: '➡️' },
    { id: 'fact-families', label: t('pages.multiplication.categories.factFamilies'), icon: '⚖️' },
  ], [t, language])

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'multiplication-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'multiplication-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const allWorksheets: WorksheetItem[] = useMemo(() => [
    // 2nd & 3rd Grade
    { title: t('pages.multiplication.worksheets.basicFacts1_5.title'), description: t('pages.multiplication.worksheets.basicFacts1_5.description'), href: getWorksheetURL('mult-facts-1-5', 'multiplication'), docId: 'mult-facts-1-5', categories: ['facts'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.arrays2_5.title'), description: t('pages.multiplication.worksheets.arrays2_5.description'), href: getWorksheetURL('mult-arrays-2-5', 'multiplication'), docId: 'mult-arrays-2-5', categories: ['arrays'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.skipCounting.title'), description: t('pages.multiplication.worksheets.skipCounting.description'), href: getWorksheetURL('skip-count-mult', 'multiplication'), docId: 'skip-count-mult', categories: ['skip-counting'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.wordProblems2_3.title'), description: t('pages.multiplication.worksheets.wordProblems2_3.description'), href: getWorksheetURL('mult-word-problems-2-3', 'multiplication'), docId: 'mult-word-problems-2-3', categories: ['word-problems'], gradeRange: '2nd-3rd' },
    // 3rd & 4th Grade
    { title: t('pages.multiplication.worksheets.advancedFacts6_12.title'), description: t('pages.multiplication.worksheets.advancedFacts6_12.description'), href: getWorksheetURL('mult-facts-6-12', 'multiplication'), docId: 'mult-facts-6-12', categories: ['facts'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.arraysModels.title'), description: t('pages.multiplication.worksheets.arraysModels.description'), href: getWorksheetURL('mult-arrays-models', 'multiplication'), docId: 'mult-arrays-models', categories: ['arrays'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.multiStepWord.title'), description: t('pages.multiplication.worksheets.multiStepWord.description'), href: getWorksheetURL('mult-multi-step-word', 'multiplication'), docId: 'mult-multi-step-word', categories: ['word-problems'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.factFamilies.title'), description: t('pages.multiplication.worksheets.factFamilies.description'), href: getWorksheetURL('mult-fact-families', 'multiplication'), docId: 'mult-fact-families', categories: ['fact-families'], gradeRange: '3rd-4th' },
    // 4th & 5th Grade
    { title: t('pages.multiplication.worksheets.multiDigit2x1.title'), description: t('pages.multiplication.worksheets.multiDigit2x1.description'), href: getWorksheetURL('mult-2x1', 'multiplication'), docId: 'mult-2x1', categories: ['multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.multiDigit2x2.title'), description: t('pages.multiplication.worksheets.multiDigit2x2.description'), href: getWorksheetURL('mult-2x2', 'multiplication'), docId: 'mult-2x2', categories: ['multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.areaModel.title'), description: t('pages.multiplication.worksheets.areaModel.description'), href: getWorksheetURL('mult-area-model', 'multiplication'), docId: 'mult-area-model', categories: ['arrays', 'multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.complexWord.title'), description: t('pages.multiplication.worksheets.complexWord.description'), href: getWorksheetURL('mult-complex-word', 'multiplication'), docId: 'mult-complex-word', categories: ['word-problems'], gradeRange: '4th-5th' },
    // Fluency & Practice
    { title: t('pages.multiplication.worksheets.factFluency.title'), description: t('pages.multiplication.worksheets.factFluency.description'), href: getWorksheetURL('mult-fact-fluency', 'multiplication'), docId: 'mult-fact-fluency', categories: ['facts', 'fluency'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.mixedReview.title'), description: t('pages.multiplication.worksheets.mixedReview.description'), href: getWorksheetURL('mult-mixed-review', 'multiplication'), docId: 'mult-mixed-review', categories: ['fluency'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.strategies.title'), description: t('pages.multiplication.worksheets.strategies.description'), href: getWorksheetURL('mult-strategies', 'multiplication'), docId: 'mult-strategies', categories: ['fluency', 'skip-counting'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.patterns.title'), description: t('pages.multiplication.worksheets.patterns.description'), href: getWorksheetURL('mult-patterns', 'multiplication'), docId: 'mult-patterns', categories: ['fluency', 'skip-counting'], gradeRange: 'All' },
    {
      title: 'Lattice Multiplication',
      description: 'Master multi-digit multiplication using the ancient lattice method with guided premium grids.',
      href: getWorksheetURL('mult-lattice', 'multiplication'),
      docId: 'mult-lattice',
      categories: ['multi-digit', 'logic'],
      gradeRange: '4th-5th'
    },
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
      {(() => {
        const seo = HUB_SEO_DATA['multiplication-worksheets'] || {}
        return (
          <SEOMetaTags
            title={seo.title || `${t('pages.multiplication.title')} - Printable PDFs with Answer Keys | Wizqo`}
            description={seo.metaDescription || t('pages.multiplication.subtitle')}
            keywords={seo.keywords || "multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"}
            ogImage="/images/math-multiplication-seo.png"
            canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
            ogType="website"
          />
        )
      })()}
      {(() => {
        const currentLocale = getLocaleFromURL();
        const canonical = `https://wizqo.com${addLocaleToPath('/worksheets/multiplication-worksheets', currentLocale)}`;
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
            { "@type": "ListItem", position: 3, name: "Multiplication Worksheets", item: canonical }
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
                ✨ {t('pages.multiplication.title')} • 2nd-5th grade
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.multiplication.title')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-emerald-600 mt-2">
                  {t('pages.multiplication.subtitle')}
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.multiplication.description')}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">What's Inside</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              Build multiplication fluency with focused practice: multiplication facts 1-12, visual arrays, skip counting patterns, multiplication word problems, and fact families. Each worksheet is one page, easy to print, and designed for quick daily practice with answer keys included.
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
                  categories={MULTIPLICATION_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.multiplication.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right side - Worksheets grouped by grade range */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([gradeRange, worksheets]) => {
                const gradeLabels: Record<string, string> = {
                  '2nd-3rd': `🔢 ${t('pages.multiplication.gradeLabels.secondThird')}`,
                  '3rd-4th': `⚡ ${t('pages.multiplication.gradeLabels.thirdFourth')}`,
                  '4th-5th': `🚀 ${t('pages.multiplication.gradeLabels.fourthFifth')}`,
                  'All': `🎯 ${t('pages.multiplication.gradeLabels.all')}`,
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
                  <p className="text-lg">{t('pages.multiplication.noResults')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded font-medium"
                    aria-label="Clear all filters"
                  >
                    {t('pages.multiplication.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">Explore More Worksheets</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/times-table-multiplication-worksheets", getLocaleFromURL())}>Times Table Multiplication Worksheets</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/2nd-grade-math-worksheets", getLocaleFromURL())}>2nd Grade Math Worksheets – Free PDF</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/3rd-grade-math-worksheets", getLocaleFromURL())}>3rd Grade Math Worksheets – Printable</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/4th-grade-math-worksheets", getLocaleFromURL())}>4th Grade Math Worksheets – Free PDF</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/worksheets/5th-grade-math-worksheets", getLocaleFromURL())}>5th Grade Math Worksheets – Printable</a></li>
              <li><a className="hover:underline" href={addLocaleToPath("/printables", getLocaleFromURL())}>Printable Fun Learning Activities</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">Are multiplication worksheets free to download?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Yes! All multiplication worksheets are completely free. Generate unlimited unique multiplication worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">What grade levels are multiplication worksheets available for?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Our multiplication worksheets are perfect for 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with multiplication facts, arrays, and word problems.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">Do multiplication worksheets include answer keys?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Yes! Every multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">What multiplication skills are covered?</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  Our multiplication worksheets cover multiplication facts, arrays, multiplication word problems, fact fluency, multi-digit multiplication, and visual multiplication models. Perfect for building confidence and mastering multiplication skills.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {(() => {
            const seo = HUB_SEO_DATA['multiplication-worksheets'];
            if (seo?.richContent) {
              return (
                <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
                  <div className="prose prose-slate prose-indigo max-w-none
                                  prose-h1:text-3xl prose-h1:font-black prose-h1:text-slate-900
                                  prose-h2:text-2xl prose-h2:font-extrabold prose-h2:text-slate-800
                                  prose-p:text-slate-600 prose-p:leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: seo.richContent }} />
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Multiplication Concepts Guide (SEO Hub Injection) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <MultiplicationConceptsGuide />
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

function MultiplicationConceptsGuide() {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-10 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🧩
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('pages.multiplication.wiki.title', 'Mastering the Concept: Beyond Memorization')}</h2>
            <p className="text-orange-500 bg-white/90 px-2 py-0.5 rounded text-xs font-bold inline-block mt-1">Foundational Strategy Guide</p>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">📐</span> {t('pages.multiplication.wiki.powerTitle', 'The Power of Visual Models')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Multiplication is more than just math facts; it is about <strong>scaling and grouping</strong>. Using <strong>Arrays</strong> and <strong>Area Models</strong> helps students visualize why 3x4 is the same as 3 groups of 4. This conceptual depth is critical for solving complex word problems and understanding multi-digit multiplication later on.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b-2 border-orange-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">✨</span> {t('pages.multiplication.wiki.stratTitle', 'Key Strategies to Teach First')}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Equal Groups:</strong> Start with the basics. 2x6 is simply "2 groups of 6." Drawing circles with dots makes this concrete for young learners.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>Array Representation:</strong> Use rows and columns. This transitions perfectly into area and perimeter concepts in 4th and 5th grade.</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>Repeated Addition:</strong> Help students bridge the gap by showing that multiplication is a faster way to add equal sets (e.g., 4+4+4 = 3x4).</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm italic">
            "Conceptual understanding is the foundation upon which speed and accuracy are built."
          </p>
        </div>
      </div>
    </div>
  );
}

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4'
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors'
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors'

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t, language } = useTranslation();
  // Use print URL for preview (not SEO URL) to show actual worksheet content
  const printUrl = getWorksheetPrintURL(docId, 'multiplication')
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
          <PDFDownloadButton
            onClick={() => {
              if (customDownloadUrl) {
                window.open(customDownloadUrl, '_blank')
                return
              }
              const printUrl = getWorksheetPrintURL(docId, 'multiplication')
              window.open(printUrl, '_blank')
            }}
            isGenerating={false}
            disableDefaultPositioning={true}
            label="Download"
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
    const url = `/print?doc=pack&time=5&age=25&skill=math&from=multiplication&variant=${variant}&timestamp=${timestamp}`;
    e.preventDefault();
    // Track pack generation
    trackPackGeneration(5, '25', 'math', 5); // 5 minutes, age 25 (2nd-5th), math, ~5 worksheets
    window.location.href = url;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Print Pack</div>
      <p className="text-slate-700 text-sm mb-3">Create a quick multiplication practice set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 2nd-5th Grade</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Multiplication</span>
      </div>
      <a href={addLocaleToPath("/print?doc=pack&time=5&age=25&skill=math&from=multiplication", getLocaleFromURL())} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={handleBuildPack}>{t('pages.printables.buildPackButton')}</a>
    </div>
  )
}
