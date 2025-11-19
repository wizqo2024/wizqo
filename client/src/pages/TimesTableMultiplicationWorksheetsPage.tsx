import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackPackGeneration, trackCategoryFilter } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'

// TIMES_TABLE_CATEGORIES will be created inside component to use translations

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  gradeRange?: string
}

export default function TimesTableMultiplicationWorksheetsPage() {
  const { t, isRTL } = useTranslation();
  
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
    { title: t('pages.timesTable.worksheets.horizontal1_5.title'), description: t('pages.timesTable.worksheets.horizontal1_5.description'), href: '/print?doc=times-table-horizontal-1-5&from=times-table', docId: 'times-table-horizontal-1-5', categories: ['horizontal', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.horizontal6_12.title'), description: t('pages.timesTable.worksheets.horizontal6_12.description'), href: '/print?doc=times-table-horizontal-6-12&from=times-table', docId: 'times-table-horizontal-6-12', categories: ['horizontal', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.horizontal1_12.title'), description: t('pages.timesTable.worksheets.horizontal1_12.description'), href: '/print?doc=times-table-horizontal-1-12&from=times-table', docId: 'times-table-horizontal-1-12', categories: ['horizontal', 'fluency'], gradeRange: 'All' },
    
    // Vertical Format Worksheets
    { title: t('pages.timesTable.worksheets.vertical1_5.title'), description: t('pages.timesTable.worksheets.vertical1_5.description'), href: '/print?doc=times-table-vertical-1-5&from=times-table', docId: 'times-table-vertical-1-5', categories: ['vertical', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.vertical6_12.title'), description: t('pages.timesTable.worksheets.vertical6_12.description'), href: '/print?doc=times-table-vertical-6-12&from=times-table', docId: 'times-table-vertical-6-12', categories: ['vertical', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.vertical1_12.title'), description: t('pages.timesTable.worksheets.vertical1_12.description'), href: '/print?doc=times-table-vertical-1-12&from=times-table', docId: 'times-table-vertical-1-12', categories: ['vertical', 'fluency'], gradeRange: 'All' },
    
    // Missing Number Worksheets
    { title: t('pages.timesTable.worksheets.missing1_5.title'), description: t('pages.timesTable.worksheets.missing1_5.description'), href: '/print?doc=times-table-missing-1-5&from=times-table', docId: 'times-table-missing-1-5', categories: ['missing-number', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.missing6_12.title'), description: t('pages.timesTable.worksheets.missing6_12.description'), href: '/print?doc=times-table-missing-6-12&from=times-table', docId: 'times-table-missing-6-12', categories: ['missing-number', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.missingMixed.title'), description: t('pages.timesTable.worksheets.missingMixed.description'), href: '/print?doc=times-table-missing-mixed&from=times-table', docId: 'times-table-missing-mixed', categories: ['missing-number', 'fluency'], gradeRange: 'All' },
    
    // Timed Test Worksheets
    { title: t('pages.timesTable.worksheets.timed1_5.title'), description: t('pages.timesTable.worksheets.timed1_5.description'), href: '/print?doc=times-table-timed-1-5&from=times-table', docId: 'times-table-timed-1-5', categories: ['timed', 'fluency'], gradeRange: '2nd-3rd' },
    { title: t('pages.timesTable.worksheets.timed6_12.title'), description: t('pages.timesTable.worksheets.timed6_12.description'), href: '/print?doc=times-table-timed-6-12&from=times-table', docId: 'times-table-timed-6-12', categories: ['timed', 'fluency'], gradeRange: '3rd-5th' },
    { title: t('pages.timesTable.worksheets.timed1_12.title'), description: t('pages.timesTable.worksheets.timed1_12.description'), href: '/print?doc=times-table-timed-1-12&from=times-table', docId: 'times-table-timed-1-12', categories: ['timed', 'fluency'], gradeRange: 'All' },
    
    // Blank Times Table Worksheets
    { title: t('pages.timesTable.worksheets.blank1_5.title'), description: t('pages.timesTable.worksheets.blank1_5.description'), href: '/print?doc=times-table-blank-1-5&from=times-table', docId: 'times-table-blank-1-5', categories: ['blank', 'confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.blank6_12.title'), description: t('pages.timesTable.worksheets.blank6_12.description'), href: '/print?doc=times-table-blank-6-12&from=times-table', docId: 'times-table-blank-6-12', categories: ['blank', 'fluency'], gradeRange: '3rd-4th' },
    { title: t('pages.timesTable.worksheets.blank1_12.title'), description: t('pages.timesTable.worksheets.blank1_12.description'), href: '/print?doc=times-table-blank-1-12&from=times-table', docId: 'times-table-blank-1-12', categories: ['blank', 'fluency'], gradeRange: 'All' },
    
    // Confidence Building Worksheets
    { title: t('pages.timesTable.worksheets.confidence1_5.title'), description: t('pages.timesTable.worksheets.confidence1_5.description'), href: '/print?doc=times-table-confidence-1-5&from=times-table', docId: 'times-table-confidence-1-5', categories: ['confidence'], gradeRange: '1st-2nd' },
    { title: t('pages.timesTable.worksheets.confidence6_12.title'), description: t('pages.timesTable.worksheets.confidence6_12.description'), href: '/print?doc=times-table-confidence-6-12&from=times-table', docId: 'times-table-confidence-6-12', categories: ['confidence'], gradeRange: '3rd-4th' },
    
    // Fluency Practice Worksheets
    { title: t('pages.timesTable.worksheets.fluency1_12.title'), description: t('pages.timesTable.worksheets.fluency1_12.description'), href: '/print?doc=times-table-fluency-1-12&from=times-table', docId: 'times-table-fluency-1-12', categories: ['fluency'], gradeRange: 'All' },
    { title: t('pages.timesTable.worksheets.mixedReview.title'), description: t('pages.timesTable.worksheets.mixedReview.description'), href: '/print?doc=times-table-mixed-review&from=times-table', docId: 'times-table-mixed-review', categories: ['fluency'], gradeRange: 'All' },
    
    // Color-by-Number Worksheets
    { title: t('pages.timesTable.worksheets.color1_5.title'), description: t('pages.timesTable.worksheets.color1_5.description'), href: '/print?doc=times-table-color-1-5&from=times-table', docId: 'times-table-color-1-5', categories: ['fluency'], gradeRange: '1st-3rd' },
    { title: t('pages.timesTable.worksheets.color6_12.title'), description: t('pages.timesTable.worksheets.color6_12.description'), href: '/print?doc=times-table-color-6-12&from=times-table', docId: 'times-table-color-6-12', categories: ['fluency'], gradeRange: '3rd-5th' },
    { title: t('pages.timesTable.worksheets.color1_12.title'), description: t('pages.timesTable.worksheets.color1_12.description'), href: '/print?doc=times-table-color-1-12&from=times-table', docId: 'times-table-color-1-12', categories: ['fluency'], gradeRange: 'All' },
  ], [t])

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
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
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
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
      </main>
      <Footer />
    </div>
  )
}

function WorksheetThumbnailCard({ title, description, href, docId }: { title: string; description: string; href: string; docId: string }) {
  const { t } = useTranslation();
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1')
  
  // Use translations if available (fallback to provided title/description)
  const translatedTitle = docId 
    ? (t(`worksheets.${docId}.title`) !== `worksheets.${docId}.title` ? t(`worksheets.${docId}.title`) : title)
    : title;
  const translatedDescription = docId
    ? (t(`worksheets.${docId}.description`) !== `worksheets.${docId}.description` ? t(`worksheets.${docId}.description`) : description)
    : description;
  
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
          title={`Preview of ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.printables.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{t('pages.timesTable.answerKeyIncluded')}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={href}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            {t('pages.printables.preview')}
          </a>
          <a
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            {t('pages.printables.download')}
          </a>
        </div>
      </div>
    </article>
  )
}

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
