import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { useTranslation } from '@/context/TranslationContext'
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
}

// Worksheets will be defined inside component to use translation

export default function WorksheetsKindergartenPage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  // Build translated categories
  const KINDERGARTEN_CATEGORIES: Category[] = useMemo(() => 
    KINDERGARTEN_CATEGORIES_IDS.map(cat => ({
      ...cat,
      label: t(`pages.grades.kindergarten.categories.${cat.id}`) as string
    }))
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
    { title: t('pages.grades.kindergarten.worksheets.countCircle1_10.title'), description: t('pages.grades.kindergarten.worksheets.countCircle1_10.description'), href: '/print?doc=count-circle-1-10&from=kindergarten', docId: 'count-circle-1-10', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countMatch1_20.title'), description: t('pages.grades.kindergarten.worksheets.countMatch1_20.description'), href: '/print?doc=count-match-1-20&from=kindergarten', docId: 'count-match-1-20', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.howMany1_15.title'), description: t('pages.grades.kindergarten.worksheets.howMany1_15.description'), href: '/print?doc=how-many-1-15&from=kindergarten', docId: 'how-many-1-15', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countColor1_10.title'), description: t('pages.grades.kindergarten.worksheets.countColor1_10.description'), href: '/print?doc=count-color-1-10&from=kindergarten', docId: 'count-color-1-10', categories: ['counting'], section: 'Counting' },
    { title: t('pages.grades.kindergarten.worksheets.countingObjects20.title'), description: t('pages.grades.kindergarten.worksheets.countingObjects20.description'), href: '/print?doc=counting-objects-20&from=kindergarten', docId: 'counting-objects-20', categories: ['counting'], section: 'Counting' },
    // Number Recognition
    { title: t('pages.grades.kindergarten.worksheets.numberId1_10.title'), description: t('pages.grades.kindergarten.worksheets.numberId1_10.description'), href: '/print?doc=number-id-1-10&from=kindergarten', docId: 'number-id-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberTracing1_10.title'), description: t('pages.grades.kindergarten.worksheets.numberTracing1_10.description'), href: '/print?doc=number-tracing-1-10&from=kindergarten', docId: 'number-tracing-1-10', categories: ['number-recognition', 'pre-writing'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberMatching1_15.title'), description: t('pages.grades.kindergarten.worksheets.numberMatching1_15.description'), href: '/print?doc=number-matching-1-15&from=kindergarten', docId: 'number-matching-1-15', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.numberOrder1_20.title'), description: t('pages.grades.kindergarten.worksheets.numberOrder1_20.description'), href: '/print?doc=number-order-1-20&from=kindergarten', docId: 'number-order-1-20', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: t('pages.grades.kindergarten.worksheets.findNumber1_10.title'), description: t('pages.grades.kindergarten.worksheets.findNumber1_10.description'), href: '/print?doc=find-number-1-10&from=kindergarten', docId: 'find-number-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    // Shapes & Colors
    { title: t('pages.grades.kindergarten.worksheets.shapeIdentification.title'), description: t('pages.grades.kindergarten.worksheets.shapeIdentification.description'), href: '/print?doc=shape-identification&from=kindergarten', docId: 'shape-identification', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.colorShapes.title'), description: t('pages.grades.kindergarten.worksheets.colorShapes.description'), href: '/print?doc=color-shapes&from=kindergarten', docId: 'color-shapes', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.shapeSorting.title'), description: t('pages.grades.kindergarten.worksheets.shapeSorting.description'), href: '/print?doc=shape-sorting&from=kindergarten', docId: 'shape-sorting', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.colorRecognition.title'), description: t('pages.grades.kindergarten.worksheets.colorRecognition.description'), href: '/print?doc=color-recognition&from=kindergarten', docId: 'color-recognition', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: t('pages.grades.kindergarten.worksheets.drawShape.title'), description: t('pages.grades.kindergarten.worksheets.drawShape.description'), href: '/print?doc=draw-shape&from=kindergarten', docId: 'draw-shape', categories: ['shapes-colors', 'pre-writing'], section: 'Shapes & Colors' },
    // Patterns
    { title: t('pages.grades.kindergarten.worksheets.abPattern.title'), description: t('pages.grades.kindergarten.worksheets.abPattern.description'), href: '/print?doc=ab-pattern&from=kindergarten', docId: 'ab-pattern', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.colorPatterns.title'), description: t('pages.grades.kindergarten.worksheets.colorPatterns.description'), href: '/print?doc=color-patterns&from=kindergarten', docId: 'color-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.shapePatterns.title'), description: t('pages.grades.kindergarten.worksheets.shapePatterns.description'), href: '/print?doc=shape-patterns&from=kindergarten', docId: 'shape-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: t('pages.grades.kindergarten.worksheets.whatComesNext.title'), description: t('pages.grades.kindergarten.worksheets.whatComesNext.description'), href: '/print?doc=what-comes-next&from=kindergarten', docId: 'what-comes-next', categories: ['patterns'], section: 'Patterns' },
    // Comparison
    { title: t('pages.grades.kindergarten.worksheets.bigSmall.title'), description: t('pages.grades.kindergarten.worksheets.bigSmall.description'), href: '/print?doc=big-small&from=kindergarten', docId: 'big-small', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.moreLess.title'), description: t('pages.grades.kindergarten.worksheets.moreLess.description'), href: '/print?doc=more-less&from=kindergarten', docId: 'more-less', categories: ['comparison', 'counting'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.longShort.title'), description: t('pages.grades.kindergarten.worksheets.longShort.description'), href: '/print?doc=long-short&from=kindergarten', docId: 'long-short', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.heavyLight.title'), description: t('pages.grades.kindergarten.worksheets.heavyLight.description'), href: '/print?doc=heavy-light&from=kindergarten', docId: 'heavy-light', categories: ['comparison'], section: 'Comparison' },
    { title: t('pages.grades.kindergarten.worksheets.sameDifferent.title'), description: t('pages.grades.kindergarten.worksheets.sameDifferent.description'), href: '/print?doc=same-different&from=kindergarten', docId: 'same-different', categories: ['comparison'], section: 'Comparison' },
    // Pre-Writing
    { title: t('pages.grades.kindergarten.worksheets.lineTracing.title'), description: t('pages.grades.kindergarten.worksheets.lineTracing.description'), href: '/print?doc=line-tracing&from=kindergarten', docId: 'line-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: t('pages.grades.kindergarten.worksheets.curveTracing.title'), description: t('pages.grades.kindergarten.worksheets.curveTracing.description'), href: '/print?doc=curve-tracing&from=kindergarten', docId: 'curve-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: t('pages.grades.kindergarten.worksheets.zigzagLines.title'), description: t('pages.grades.kindergarten.worksheets.zigzagLines.description'), href: '/print?doc=zigzag-lines&from=kindergarten', docId: 'zigzag-lines', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: t('pages.grades.kindergarten.worksheets.pathTracing.title'), description: t('pages.grades.kindergarten.worksheets.pathTracing.description'), href: '/print?doc=path-tracing&from=kindergarten', docId: 'path-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return KINDERGARTEN_WORKSHEETS
    return KINDERGARTEN_WORKSHEETS.filter((ws) => 
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
            { "@type": "ListItem", position: 2, name: "Kindergarten Math Worksheets", item: canonical }
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
              <a href="/print?doc=pack&time=5&age=k&skill=math&from=kindergarten" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'K'});} catch{} }}>{t('pages.printables.buildPackButton')}</a>
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
              const label = `${icon} ${t(`pages.grades.kindergarten.categories.${sectionKey}`)}`
              
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
    </div>
  )
}

function WorksheetThumbnailCard({ title, description, href, docId }: { title: string; description: string; href: string; docId: string }) {
  const { t } = useTranslation();
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1')
  
  const handleClick = () => {
    trackThumbnailClick(docId, 'kindergarten-math-worksheets')
  }
  
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      
      {/* Worksheet Thumbnail Preview */}
      <div 
        className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
        onClick={() => {
          handleClick()
          window.open(href, '_blank')
        }}
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
          title={t('pages.grades.kindergarten.previewOf') + ' ' + title}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.grades.kindergarten.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={href}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={t('pages.grades.kindergarten.previewButton')}
          >
            {t('pages.grades.kindergarten.previewButton')}
          </a>
          <a
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={t('pages.grades.kindergarten.downloadButton')}
          >
            {t('pages.grades.kindergarten.downloadButton')}
          </a>
        </div>
      </div>
    </article>
  )
}
