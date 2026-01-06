import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { useTranslation } from '@/context/TranslationContext'
import { getWorksheetURL, getWorksheetPrintURL } from '@/utils/worksheetLinks'
import { trackCategoryFilter, trackThumbnailClick } from '@/utils/analytics'

// Categories will be translated in the component
const KINDERGARTEN_CATEGORIES_IDS = [
  { id: 'counting', icon: '🔢' },
  { id: 'number-recognition', icon: '🔟' },
  { id: 'shapes-colors', icon: '🟩' },
  { id: 'patterns', icon: '🧩' },
  { id: 'comparison', icon: '⚖️' },
  { id: 'pre-writing', icon: '✏️' },
]

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

export default function WorksheetsKindergartenPage() {
  const { t, isRTL } = useTranslation();
  const [previewItem, setPreviewItem] = React.useState<WorksheetItem | null>(null);

  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);

  // Helper to convert hyphenated IDs to camelCase for translation keys
  const hyphenToCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  }

  // Build translated categories
  const KINDERGARTEN_CATEGORIES: Category[] = useMemo(() =>
    KINDERGARTEN_CATEGORIES_IDS.map(cat => {
      const translationKey = hyphenToCamelCase(cat.id)
      const translatedLabel = t(`pages.grades.kindergarten.categories.${translationKey}`) as string
      // Fallback to a readable label if translation is missing
      const label = translatedLabel && translatedLabel !== `pages.grades.kindergarten.categories.${translationKey}`
        ? translatedLabel
        : cat.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      return {
        ...cat,
        label
      }
    })
    , [t]);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'kindergarten-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'kindergarten-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const KINDERGARTEN_WORKSHEETS: WorksheetItem[] = useMemo(() => [
    // Counting

    { title: t('pages.grades.kindergarten.worksheets.countCircle1_10.title'), description: t('pages.grades.kindergarten.worksheets.countCircle1_10.description'), href: getWorksheetURL('count-circle-1-10', 'kindergarten'), docId: 'count-circle-1-10', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countMatch1_20.title'), description: t('pages.grades.kindergarten.worksheets.countMatch1_20.description'), href: getWorksheetURL('count-match-1-20', 'kindergarten'), docId: 'count-match-1-20', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.howMany1_15.title'), description: t('pages.grades.kindergarten.worksheets.howMany1_15.description'), href: getWorksheetURL('how-many-1-15', 'kindergarten'), docId: 'how-many-1-15', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countColor1_10.title'), description: t('pages.grades.kindergarten.worksheets.countColor1_10.description'), href: getWorksheetURL('count-color-1-10', 'kindergarten'), docId: 'count-color-1-10', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countingObjects20.title'), description: t('pages.grades.kindergarten.worksheets.countingObjects20.description'), href: getWorksheetURL('counting-objects-20', 'kindergarten'), docId: 'counting-objects-20', categories: ['counting'], section: 'Counting' },

    // Number Recognition

    { title: t('pages.grades.kindergarten.worksheets.numberId1_10.title'), description: t('pages.grades.kindergarten.worksheets.numberId1_10.description'), href: getWorksheetURL('number-id-1-10', 'kindergarten'), docId: 'number-id-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberTracing1_10.title'), description: t('pages.grades.kindergarten.worksheets.numberTracing1_10.description'), href: getWorksheetURL('number-tracing-1-10', 'kindergarten'), docId: 'number-tracing-1-10', categories: ['number-recognition', 'pre-writing'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberMatching1_15.title'), description: t('pages.grades.kindergarten.worksheets.numberMatching1_15.description'), href: getWorksheetURL('number-matching-1-15', 'kindergarten'), docId: 'number-matching-1-15', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberOrder1_20.title'), description: t('pages.grades.kindergarten.worksheets.numberOrder1_20.description'), href: getWorksheetURL('number-order-1-20', 'kindergarten'), docId: 'number-order-1-20', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.findNumber1_10.title'), description: t('pages.grades.kindergarten.worksheets.findNumber1_10.description'), href: getWorksheetURL('find-number-1-10', 'kindergarten'), docId: 'find-number-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    // Shapes & Colors

    { title: t('pages.grades.kindergarten.worksheets.shapeIdentification.title'), description: t('pages.grades.kindergarten.worksheets.shapeIdentification.description'), href: getWorksheetURL('shape-identification', 'kindergarten'), docId: 'shape-identification', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.colorShapes.title'), description: t('pages.grades.kindergarten.worksheets.colorShapes.description'), href: getWorksheetURL('color-shapes', 'kindergarten'), docId: 'color-shapes', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.shapeSorting.title'), description: t('pages.grades.kindergarten.worksheets.shapeSorting.description'), href: getWorksheetURL('shape-sorting', 'kindergarten'), docId: 'shape-sorting', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.colorRecognition.title'), description: t('pages.grades.kindergarten.worksheets.colorRecognition.description'), href: getWorksheetURL('color-recognition', 'kindergarten'), docId: 'color-recognition', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.drawShape.title'), description: t('pages.grades.kindergarten.worksheets.drawShape.description'), href: getWorksheetURL('draw-shape', 'kindergarten'), docId: 'draw-shape', categories: ['shapes-colors', 'pre-writing'], section: 'Shapes & Colors' },
    { title: '🌑 Match Object to Shadow', description: 'Draw a line to connect each object to its matching shadow. Great for visual perception!', href: '/worksheets/match-object-to-shadow', docId: 'match-object-to-shadow', categories: ['shapes-colors'], section: 'Shapes & Colors', customPreviewUrl: '/worksheets/match-object-to-shadow?preview=1', customDownloadUrl: '/worksheets/match-object-to-shadow' },
    { title: '😊 Match the Feeling', description: 'Identify emotions! Match feelings like sad, happy, and bored to real-life situations.', href: '/worksheets/match-the-feeling', docId: 'match-the-feeling', categories: ['shapes-colors'], section: 'Shapes & Colors', customPreviewUrl: '/worksheets/match-the-feeling?preview=1', customDownloadUrl: '/worksheets/match-the-feeling' },
    // Patterns

    { title: t('pages.grades.kindergarten.worksheets.abPattern.title'), description: t('pages.grades.kindergarten.worksheets.abPattern.description'), href: getWorksheetURL('ab-pattern', 'kindergarten'), docId: 'ab-pattern', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.colorPatterns.title'), description: t('pages.grades.kindergarten.worksheets.colorPatterns.description'), href: getWorksheetURL('color-patterns', 'kindergarten'), docId: 'color-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.shapePatterns.title'), description: t('pages.grades.kindergarten.worksheets.shapePatterns.description'), href: getWorksheetURL('shape-patterns', 'kindergarten'), docId: 'shape-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.whatComesNext.title'), description: t('pages.grades.kindergarten.worksheets.whatComesNext.description'), href: getWorksheetURL('what-comes-next', 'kindergarten'), docId: 'what-comes-next', categories: ['patterns'], section: 'Patterns' },
    // Comparison
    { title: t('pages.grades.kindergarten.worksheets.bigSmall.title'), description: t('pages.grades.kindergarten.worksheets.bigSmall.description'), href: getWorksheetURL('big-small', 'kindergarten'), docId: 'big-small', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.moreLess.title'), description: t('pages.grades.kindergarten.worksheets.moreLess.description'), href: getWorksheetURL('more-less', 'kindergarten'), docId: 'more-less', categories: ['comparison', 'counting'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.longShort.title'), description: t('pages.grades.kindergarten.worksheets.longShort.description'), href: getWorksheetURL('long-short', 'kindergarten'), docId: 'long-short', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.heavyLight.title'), description: t('pages.grades.kindergarten.worksheets.heavyLight.description'), href: getWorksheetURL('heavy-light', 'kindergarten'), docId: 'heavy-light', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.sameDifferent.title'), description: t('pages.grades.kindergarten.worksheets.sameDifferent.description'), href: getWorksheetURL('same-different', 'kindergarten'), docId: 'same-different', categories: ['comparison'], section: 'Comparison' },

    // New Interactive Worksheets (Moved to end for 'Newest First' display)
    { title: t('pages.grades.kindergarten.worksheets.countCircle1_10.title'), description: t('pages.grades.kindergarten.worksheets.countCircle1_10.description'), href: getWorksheetURL('count-circle-1-10', 'kindergarten'), docId: 'count-circle-1-10', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countMatch1_20.title'), description: t('pages.grades.kindergarten.worksheets.countMatch1_20.description'), href: getWorksheetURL('count-match-1-20', 'kindergarten'), docId: 'count-match-1-20', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.howMany1_15.title'), description: t('pages.grades.kindergarten.worksheets.howMany1_15.description'), href: getWorksheetURL('how-many-1-15', 'kindergarten'), docId: 'how-many-1-15', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countColor1_10.title'), description: t('pages.grades.kindergarten.worksheets.countColor1_10.description'), href: getWorksheetURL('count-color-1-10', 'kindergarten'), docId: 'count-color-1-10', categories: ['counting'], section: 'Counting' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    // Reverse the array to show newly added worksheets (at the bottom of the list) first
    const newestFirst = [...KINDERGARTEN_WORKSHEETS].reverse()
    if (selectedCategories.size === 0) return newestFirst
    return newestFirst.filter((ws) =>
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, KINDERGARTEN_WORKSHEETS])

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
        title={t('pages.grades.kindergarten.seoTitle')}
        description={t('pages.grades.kindergarten.seoDescription')}
        keywords={t('pages.grades.kindergarten.seoKeywords')}
        canonicalUrl="https://wizqo.com/worksheets/kindergarten-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/kindergarten-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/all" },
            { "@type": "ListItem", position: 3, name: "Kindergarten Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Kindergarten Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free printable kindergarten math worksheets for early learners. Download PDF worksheets covering counting, number recognition, basic shapes, and simple addition.",
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
                {t('pages.grades.kindergarten.badge')}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t('pages.grades.kindergarten.title')}
                <span className="block text-purple-600">{t('pages.grades.kindergarten.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.grades.kindergarten.description')}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t('pages.grades.kindergarten.whatsInside')}</h2>
            <p className="text-slate-700 text-sm max-w-3xl">
              {t('pages.grades.kindergarten.whatsInsideDesc')}
            </p>
            <div className="mt-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">{t('pages.grades.kindergarten.buildPack')}</div>
                <p className="text-slate-700 text-sm mb-3">{t('pages.grades.kindergarten.buildPackDesc')}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.grades.kindergarten.buildPackTime')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.grades.kindergarten.buildPackAge')}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.grades.kindergarten.buildPackFocus')}</span>
                </div>
                <a href="/print?doc=pack&time=5&age=k&skill=math&from=kindergarten" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e) => { try { (window as any).gtag?.('event', 'build_pack_click', { grade: 'K' }); } catch { } }}>{t('pages.printables.buildPackButton')}</a>
              </div>
            </div>
          </section>

          {/* Main content with sidebar layout */}
          <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Left sidebar - Category Filter */}
            <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <CategoryFilter
                  categories={KINDERGARTEN_CATEGORIES}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={clearCategories}
                  title={t('pages.grades.kindergarten.filterByCategory')}
                />
              </div>
            </aside>

            {/* Right side - Worksheets grouped by section */}
            <div className="space-y-8">
              {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
                // Translate section labels
                const sectionKeyMap: Record<string, string> = {
                  'Counting': 'counting',
                  'Number Recognition': 'numberRecognition',
                  'Shapes & Colors': 'shapesColors',
                  'Patterns': 'patterns',
                  'Comparison': 'comparison',
                  'Pre-Writing': 'preWriting',
                }
                const sectionKey = sectionKeyMap[section] || section.toLowerCase()
                const iconMap: Record<string, string> = {
                  'Counting': '🔢',
                  'Number Recognition': '🔟',
                  'Shapes & Colors': '🟩',
                  'Patterns': '🧩',
                  'Comparison': '⚖️',
                  'Pre-Writing': '✏️',
                }
                const icon = iconMap[section] || ''
                const translatedSection = t(`pages.grades.kindergarten.categories.${sectionKey}`) as string
                const sectionLabel = translatedSection && translatedSection !== `pages.grades.kindergarten.categories.${sectionKey}`
                  ? translatedSection
                  : section
                const label = `${icon} ${sectionLabel}`

                return (
                  <div key={section}>
                    <div className="mb-6 flex items-center gap-3 border-l-4 border-purple-500 pl-4 py-1">
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{label}</h2>
                    </div>
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
                  <p className="text-lg">{t('pages.grades.kindergarten.noResults')}</p>
                  <button
                    onClick={clearCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {t('pages.grades.kindergarten.allCategories')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Explore More Worksheets */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900">{t('pages.grades.kindergarten.exploreMore')}</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
              <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">{t('pages.grades.kindergarten.exploreLinks.firstGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">{t('pages.grades.kindergarten.exploreLinks.secondGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">{t('pages.grades.kindergarten.exploreLinks.thirdGrade')}</a></li>
              <li><a className="hover:underline" href="/worksheets/handwriting-worksheet-maker">{t('pages.grades.kindergarten.exploreLinks.handwriting')}</a></li>
              <li><a className="hover:underline" href="/printables">{t('pages.printables.title')}</a></li>
              <li><a className="hover:underline" href="/kids">{t('pages.grades.kindergarten.exploreLinks.kidsHub')}</a></li>
            </ul>
          </section>

          <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.grades.kindergarten.faqs')}</h2>
            <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
              <AccordionItem value="q1">
                <AccordionTrigger className="px-4">{t('pages.grades.kindergarten.faq1Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.grades.kindergarten.faq1Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="px-4">{t('pages.grades.kindergarten.faq2Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.grades.kindergarten.faq2Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="px-4">{t('pages.grades.kindergarten.faq3Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.grades.kindergarten.faq3Answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="px-4">{t('pages.grades.kindergarten.faq4Question')}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {t('pages.grades.kindergarten.faq4Answer')}
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
                      src={previewItem.customPreviewUrl || previewItem.href}
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

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId, onPreview, customPreviewUrl, customDownloadUrl }: { title: string; description: string; href: string; docId: string; onPreview?: (item: WorksheetItem) => void; customPreviewUrl?: string; customDownloadUrl?: string }) {
  const { t } = useTranslation()
  const printUrl = getWorksheetPrintURL(docId, 'kindergarten')
  const previewUrl = customPreviewUrl || (printUrl + (printUrl.includes('?') ? '&preview=1' : '?preview=1'))

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    trackThumbnailClick(docId, title, '/worksheets/kindergarten-math-worksheets')
    if (onPreview) {
      onPreview({ title, description, href, docId, categories: [], customPreviewUrl, customDownloadUrl })
    }
  }

  return (
    <article className="group relative flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-purple-100">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Worksheet Thumbnail Preview - Clickable */}
      <a
        href={href}
        onClick={handleClick}
        className="relative block w-full overflow-hidden rounded-2xl bg-white shadow-inner ring-1 ring-slate-200/50 transition-all hover:ring-purple-300"
        style={{
          height: '160px',
        }}
      >
        {/* Thumbnail content using iframe with preview mode */}
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
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
            title={t('pages.grades.kindergarten.previewOf') + ' ' + title}
            aria-label={`Preview of ${title}`}
            loading="lazy"
            tabIndex={-1}
          />
        </div>

        {/* Gradient overlays for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-purple-900/5 pointer-events-none" />

        {/* Hover Action Badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 px-4 py-2 font-bold text-purple-700 shadow-lg backdrop-blur-sm transform scale-95 transition-transform duration-300 group-hover:scale-100">
            {t('pages.grades.kindergarten.clickToView')}
          </div>
        </div>
      </a>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            if (customDownloadUrl) {
              window.open(customDownloadUrl, '_blank');
              return;
            }
            const printUrl = getWorksheetPrintURL(docId, 'kindergarten')
            window.open(printUrl, '_blank')
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 transition-all hover:bg-purple-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-95"
          aria-label={`${t('pages.grades.kindergarten.downloadButton')} ${title}`}
        >
          <span className="text-lg leading-none">⬇️</span> {t('pages.grades.kindergarten.downloadButton')}
        </button>
      </div>
    </article>
  )
})
