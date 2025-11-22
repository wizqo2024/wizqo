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

export default function WorksheetsFirstGradePage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  const FIRST_GRADE_CATEGORIES: Category[] = [
    { id: 'number-sense', label: t('pages.firstGrade.categories.numberSense'), icon: '🔢' },
    { id: 'addition-subtraction', label: t('pages.firstGrade.categories.additionSubtraction'), icon: '➕➖' },
    { id: 'fluency', label: t('pages.firstGrade.categories.fluency'), icon: '⚡' },
    { id: 'logic', label: t('pages.firstGrade.categories.logic'), icon: '🧩' },
    { id: 'literacy', label: t('pages.firstGrade.categories.literacy'), icon: '📚' },
    { id: 'early-math', label: t('pages.firstGrade.categories.earlyMath'), icon: '🔢' },
  ];
  
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '1st-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '1st-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories - using translation keys
  const allWorksheets: WorksheetItem[] = useMemo(() => [
    // Number Sense
    { title: t('pages.firstGrade.worksheets.tenFrames1_10.title'), description: t('pages.firstGrade.worksheets.tenFrames1_10.description'), href: '/print?doc=ten-frames-1-10&from=1st-grade', docId: 'ten-frames-1-10', categories: ['number-sense'], section: 'Number Sense' },
    { title: t('pages.firstGrade.worksheets.numberTracing1_20.title'), description: t('pages.firstGrade.worksheets.numberTracing1_20.description'), href: '/print?doc=number-tracing-1-20&from=1st-grade', docId: 'number-tracing-1-20', categories: ['number-sense'], section: 'Number Sense' },
    { title: t('pages.firstGrade.worksheets.numberBonds10.title'), description: t('pages.firstGrade.worksheets.numberBonds10.description'), href: '/print?doc=number-bonds-10&from=1st-grade', docId: 'number-bonds-10', categories: ['number-sense'], section: 'Number Sense' },
    { title: t('pages.firstGrade.worksheets.countWrite30.title'), description: t('pages.firstGrade.worksheets.countWrite30.description'), href: '/print?doc=count-write-30&from=1st-grade', docId: 'count-write-30', categories: ['number-sense'], section: 'Number Sense' },
    { title: t('pages.firstGrade.worksheets.missingNumbers50.title'), description: t('pages.firstGrade.worksheets.missingNumbers50.description'), href: '/print?doc=missing-numbers-50&from=1st-grade', docId: 'missing-numbers-50', categories: ['number-sense'], section: 'Number Sense' },
    // Addition & Subtraction
    { title: t('pages.firstGrade.worksheets.addSubWithin10.title'), description: t('pages.firstGrade.worksheets.addSubWithin10.description'), href: '/print?doc=addition-subtraction-0-10&from=1st-grade', docId: 'addition-subtraction-0-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: t('pages.firstGrade.worksheets.mathMaze.title'), description: t('pages.firstGrade.worksheets.mathMaze.description'), href: '/print?doc=math-maze&from=1st-grade', docId: 'math-maze', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: t('pages.firstGrade.worksheets.pictureAddition10.title'), description: t('pages.firstGrade.worksheets.pictureAddition10.description'), href: '/print?doc=picture-addition-10&from=1st-grade', docId: 'picture-addition-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: t('pages.firstGrade.worksheets.subtractionStories.title'), description: t('pages.firstGrade.worksheets.subtractionStories.description'), href: '/print?doc=subtraction-stories&from=1st-grade', docId: 'subtraction-stories', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: t('pages.firstGrade.worksheets.balanceEquations10.title'), description: t('pages.firstGrade.worksheets.balanceEquations10.description'), href: '/print?doc=balance-equations-10&from=1st-grade', docId: 'balance-equations-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    // Fluency Boosters
    { title: t('pages.firstGrade.worksheets.dotToDot1_20.title'), description: t('pages.firstGrade.worksheets.dotToDot1_20.description'), href: '/print?doc=dot-to-dot-1-20&from=1st-grade', docId: 'dot-to-dot-1-20', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: t('pages.firstGrade.worksheets.colorByNumber.title'), description: t('pages.firstGrade.worksheets.colorByNumber.description'), href: '/print?doc=color-by-number&from=1st-grade', docId: 'color-by-number', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: t('pages.firstGrade.worksheets.skipCounting2s.title'), description: t('pages.firstGrade.worksheets.skipCounting2s.description'), href: '/print?doc=skip-count-2s&from=1st-grade', docId: 'skip-count-2s', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: t('pages.firstGrade.worksheets.numberLineAddition.title'), description: t('pages.firstGrade.worksheets.numberLineAddition.description'), href: '/print?doc=number-line-add&from=1st-grade', docId: 'number-line-add', categories: ['fluency', 'addition-subtraction'], section: 'Fluency Boosters' },
    { title: t('pages.firstGrade.worksheets.doublesFacts.title'), description: t('pages.firstGrade.worksheets.doublesFacts.description'), href: '/print?doc=doubles-facts&from=1st-grade', docId: 'doubles-facts', categories: ['fluency'], section: 'Fluency Boosters' },
    // Focus & Logic
    { title: t('pages.firstGrade.worksheets.spotDifference.title'), description: t('pages.firstGrade.worksheets.spotDifference.description'), href: '/print?doc=spot-difference&from=1st-grade', docId: 'spot-difference', categories: ['logic'], section: 'Focus & Logic' },
    { title: t('pages.firstGrade.worksheets.shapesColorsSort.title'), description: t('pages.firstGrade.worksheets.shapesColorsSort.description'), href: '/print?doc=shapes-colors-sort&from=1st-grade', docId: 'shapes-colors-sort', categories: ['logic'], section: 'Focus & Logic' },
    { title: t('pages.firstGrade.worksheets.patternCompletion.title'), description: t('pages.firstGrade.worksheets.patternCompletion.description'), href: '/print?doc=pattern-complete&from=1st-grade', docId: 'pattern-complete', categories: ['logic'], section: 'Focus & Logic' },
    { title: t('pages.firstGrade.worksheets.findMissingShape.title'), description: t('pages.firstGrade.worksheets.findMissingShape.description'), href: '/print?doc=missing-shape&from=1st-grade', docId: 'missing-shape', categories: ['logic'], section: 'Focus & Logic' },
    { title: t('pages.firstGrade.worksheets.sizeComparison.title'), description: t('pages.firstGrade.worksheets.sizeComparison.description'), href: '/print?doc=size-comparison&from=1st-grade', docId: 'size-comparison', categories: ['logic'], section: 'Focus & Logic' },
    // Early Literacy
    { title: t('pages.firstGrade.worksheets.rhymingWords.title'), description: t('pages.firstGrade.worksheets.rhymingWords.description'), href: '/print?doc=rhyming-words&from=1st-grade', docId: 'rhyming-words', categories: ['literacy'], section: 'Early Literacy' },
    { title: t('pages.firstGrade.worksheets.cvcWords.title'), description: t('pages.firstGrade.worksheets.cvcWords.description'), href: '/print?doc=cvc-words&from=1st-grade', docId: 'cvc-words', categories: ['literacy'], section: 'Early Literacy' },
    { title: t('pages.firstGrade.worksheets.sightWordsPrePrimer.title'), description: t('pages.firstGrade.worksheets.sightWordsPrePrimer.description'), href: '/print?doc=sight-words-pre-primer&from=1st-grade', docId: 'sight-words-pre-primer', categories: ['literacy'], section: 'Early Literacy' },
    { title: t('pages.firstGrade.worksheets.letterTracingAZ.title'), description: t('pages.firstGrade.worksheets.letterTracingAZ.description'), href: '/print?doc=letter-tracing-az&from=1st-grade', docId: 'letter-tracing-az', categories: ['literacy'], section: 'Early Literacy' },
    { title: t('pages.firstGrade.worksheets.sentenceBuilding.title'), description: t('pages.firstGrade.worksheets.sentenceBuilding.description'), href: '/print?doc=sentence-building&from=1st-grade', docId: 'sentence-building', categories: ['literacy'], section: 'Early Literacy' },
    // Early Math Skills
    { title: t('pages.firstGrade.worksheets.moreLessEqual10.title'), description: t('pages.firstGrade.worksheets.moreLessEqual10.description'), href: '/print?doc=more-less-equal-10&from=1st-grade', docId: 'more-less-equal-10', categories: ['early-math'], section: 'Early Math Skills' },
    { title: t('pages.firstGrade.worksheets.countingObjects20.title'), description: t('pages.firstGrade.worksheets.countingObjects20.description'), href: '/print?doc=counting-objects-20&from=1st-grade', docId: 'counting-objects-20', categories: ['early-math'], section: 'Early Math Skills' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories, allWorksheets])

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
        title={t('pages.firstGrade.seoTitle')}
        description={t('pages.firstGrade.seoDescription')}
        canonicalUrl="https://wizqo.com/worksheets/1st-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/1st-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/2nd-grade-math-worksheets" },
            { "@type": "ListItem", position: 3, name: "1st Grade Math Worksheets", item: "https://wizqo.com/worksheets/1st-grade-math-worksheets" }
          ]
        } as const;
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Are these worksheets printable as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open any worksheet and use your browser's Print → Save as PDF to download." } },
            { "@type": "Question", name: "{t('pages.firstGrade.faq1Question')}", acceptedAnswer: { "@type": "Answer", text: "Yes—free for personal and classroom use." } },
            { "@type": "Question", name: "What skills are covered?", acceptedAnswer: { "@type": "Answer", text: "Number sense, addition/subtraction within 10, ten‑frames, skip counting, shapes, and simple logic warm‑ups." } }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">{t('pages.firstGrade.title')}</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">
            {t('pages.firstGrade.description')}
          </p>
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">{t('pages.firstGrade.whatsInside')}</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            {t('pages.firstGrade.whatsInsideDesc')}
          </p>
          {/* Grade 1 Pack CTA (moved from header) */}
          <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white">
            <div className="text-slate-900 font-semibold mb-1">{t('pages.firstGrade.buildPack')}</div>
            <p className="text-slate-700 text-sm mb-3">{t('pages.firstGrade.buildPackDesc')}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.firstGrade.buildPackTime')}</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.firstGrade.buildPackAge')}</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{t('pages.firstGrade.buildPackFocus')}</span>
            </div>
            <a href="/print?doc=pack&time=5&age=g1&skill=math&from=1st-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'1'});} catch{} }}>{t('pages.printables.buildPackButton')}</a>
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={FIRST_GRADE_CATEGORIES}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
                title={t('pages.firstGrade.filterByCategory')}
              />
            </div>
          </aside>

          {/* Right side - Worksheets grouped by section */}
          <div className="space-y-8">
            {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
              const sectionLabels: Record<string, string> = {
                'Number Sense': `🔢 ${t('pages.firstGrade.sections.numberSense')}`,
                'Addition & Subtraction': `➕➖ ${t('pages.firstGrade.sections.additionSubtraction')}`,
                'Fluency Boosters': `⚡ ${t('pages.firstGrade.sections.fluencyBoosters')}`,
                'Focus & Logic': `🧩 ${t('pages.firstGrade.sections.focusLogic')}`,
                'Early Literacy': `📚 ${t('pages.firstGrade.sections.earlyLiteracy')}`,
                'Early Math Skills': `🔢 ${t('pages.firstGrade.sections.earlyMathSkills')}`,
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
                      />
                    ))}
                  </div>
                </div>
              )
            })}
            {filteredWorksheets.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">{t('pages.firstGrade.noWorksheets')}</p>
                <button
                  onClick={clearCategories}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t('pages.firstGrade.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Explore More Worksheets */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">{t('pages.firstGrade.exploreMore')}</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/kindergarten-math-worksheets">{t('pages.firstGrade.exploreLinks.kindergarten')}</a></li>
            <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">{t('pages.firstGrade.exploreLinks.secondGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">{t('pages.firstGrade.exploreLinks.thirdGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/handwriting-worksheet-maker">{t('pages.firstGrade.exploreLinks.handwriting')}</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">{t('pages.firstGrade.exploreLinks.readingComprehension')}</a></li>
            <li><a className="hover:underline" href="/printables">{t('pages.printables.title')}</a></li>
          </ul>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('pages.firstGrade.faqs')}</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">{t('pages.firstGrade.faq1Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.firstGrade.faq1Answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">{t('pages.firstGrade.faq2Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.firstGrade.faq2Answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">{t('pages.firstGrade.faq3Question')}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {t('pages.firstGrade.faq3Answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4'
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors'
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors'
function ItemCard({ title, description, href }: { title: string; description: string; href: string }) {
  const { t } = useTranslation();
  return (
    <div className={CARD_CLASS}>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <a href={href} className={BUTTON_CLASS} aria-label={`${t('pages.firstGrade.downloadPDF')} ${title}`} target="_blank" rel="noopener noreferrer">⬇️ {t('pages.firstGrade.downloadPDF')}</a>
      </div>
    </div>
  )
}

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, href, docId }: { title: string; description: string; href: string; docId: string }) {
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
        onClick={() => window.open(href, '_blank')}
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
          title={`${t('pages.firstGrade.previewOf')} ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.firstGrade.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            ⬇️ {t('pages.firstGrade.download')}
          </a>
        </div>
      </div>
    </article>
  )
});
