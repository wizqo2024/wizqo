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

// Define all worksheets with their categories - unique 4th Grade content
const FOURTH_GRADE_WORKSHEETS: WorksheetItem[] = [
    // Multi-Digit Operations
    { title: '🔢 Multi-Digit Multiplication (2×1)', description: 'Multiply 2-digit numbers by 1-digit numbers with regrouping. Step-by-step practice for mastery.', href: '/print?doc=mult-2x1-digit&from=4th-grade', docId: 'mult-2x1-digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: '🔢 Multi-Digit Multiplication (2×2)', description: 'Multiply 2-digit numbers by 2-digit numbers using standard algorithm and area models.', href: '/print?doc=mult-2x2-digit&from=4th-grade', docId: 'mult-2x2-digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: '🔢 Long Division (1-Digit Divisor)', description: 'Divide multi-digit numbers by 1-digit divisors. Practice long division with remainders.', href: '/print?doc=long-division-1digit&from=4th-grade', docId: 'long-division-1digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: '🔢 Long Division (2-Digit Divisor)', description: 'Divide multi-digit numbers by 2-digit divisors. Advanced division practice.', href: '/print?doc=long-division-2digit&from=4th-grade', docId: 'long-division-2digit', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    { title: '🔢 Area Model Multiplication', description: 'Use area models to visualize and solve multi-digit multiplication problems.', href: '/print?doc=area-model-mult&from=4th-grade', docId: 'area-model-mult', categories: ['multi-digit', 'geometry'], section: 'Multi-Digit Operations' },
    { title: '🔢 Partial Products Multiplication', description: 'Break down multiplication into partial products. Understand the distributive property.', href: '/print?doc=partial-products&from=4th-grade', docId: 'partial-products', categories: ['multi-digit'], section: 'Multi-Digit Operations' },
    // Fractions & Decimals
    { title: '🍕 Equivalent Fractions', description: 'Find equivalent fractions using multiplication and division. Understand fraction relationships.', href: '/print?doc=equivalent-fractions-4th&from=4th-grade', docId: 'equivalent-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Comparing Fractions', description: 'Compare fractions with different denominators. Use common denominators or cross-multiplication.', href: '/print?doc=comparing-fractions-4th&from=4th-grade', docId: 'comparing-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Adding & Subtracting Fractions', description: 'Add and subtract fractions with like and unlike denominators. Find common denominators.', href: '/print?doc=add-sub-fractions-4th&from=4th-grade', docId: 'add-sub-fractions-4th', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Mixed Numbers & Improper Fractions', description: 'Convert between mixed numbers and improper fractions. Understand both forms.', href: '/print?doc=mixed-improper-fractions&from=4th-grade', docId: 'mixed-improper-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Decimals: Place Value', description: 'Understand decimal place value (tenths, hundredths). Read and write decimals.', href: '/print?doc=decimals-place-value&from=4th-grade', docId: 'decimals-place-value', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Comparing & Ordering Decimals', description: 'Compare decimals using >, <, or =. Order decimals from least to greatest.', href: '/print?doc=comparing-decimals&from=4th-grade', docId: 'comparing-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Adding & Subtracting Decimals', description: 'Add and subtract decimals. Line up decimal points and regroup when needed.', href: '/print?doc=add-sub-decimals&from=4th-grade', docId: 'add-sub-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Fractions to Decimals', description: 'Convert fractions to decimals. Understand the relationship between fractions and decimals.', href: '/print?doc=fractions-to-decimals&from=4th-grade', docId: 'fractions-to-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    // Geometry
    { title: '📐 Classifying Angles', description: 'Identify acute, right, obtuse, and straight angles. Measure angles with a protractor.', href: '/print?doc=classifying-angles&from=4th-grade', docId: 'classifying-angles', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Area & Perimeter', description: 'Find area and perimeter of rectangles, squares, and composite shapes. Real-world applications.', href: '/print?doc=area-perimeter-4th&from=4th-grade', docId: 'area-perimeter-4th', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Lines & Angles', description: 'Identify parallel, perpendicular, and intersecting lines. Understand angle relationships.', href: '/print?doc=lines-angles-4th&from=4th-grade', docId: 'lines-angles-4th', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Classifying Triangles', description: 'Classify triangles by sides (equilateral, isosceles, scalene) and angles (acute, right, obtuse).', href: '/print?doc=classifying-triangles&from=4th-grade', docId: 'classifying-triangles', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Classifying Quadrilaterals', description: 'Identify and classify quadrilaterals: squares, rectangles, parallelograms, trapezoids, rhombuses.', href: '/print?doc=classifying-quadrilaterals&from=4th-grade', docId: 'classifying-quadrilaterals', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Symmetry & Transformations', description: 'Find lines of symmetry. Understand translations, rotations, and reflections.', href: '/print?doc=symmetry-transformations&from=4th-grade', docId: 'symmetry-transformations', categories: ['geometry'], section: 'Geometry' },
    // Measurement
    { title: '📏 Customary Units Conversion', description: 'Convert between inches, feet, yards, and miles. Practice measurement conversions.', href: '/print?doc=customary-conversion&from=4th-grade', docId: 'customary-conversion', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Metric Units Conversion', description: 'Convert between millimeters, centimeters, meters, and kilometers. Learn metric system.', href: '/print?doc=metric-conversion&from=4th-grade', docId: 'metric-conversion', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Elapsed Time', description: 'Calculate elapsed time. Solve problems involving hours, minutes, and seconds.', href: '/print?doc=elapsed-time-4th&from=4th-grade', docId: 'elapsed-time-4th', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Liquid Measurement', description: 'Convert between cups, pints, quarts, and gallons. Understand capacity and volume.', href: '/print?doc=liquid-measurement-4th&from=4th-grade', docId: 'liquid-measurement-4th', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Mass and Weight', description: 'Convert between ounces, pounds, grams, and kilograms. Understand mass vs. weight.', href: '/print?doc=mass-weight-4th&from=4th-grade', docId: 'mass-weight-4th', categories: ['measurement'], section: 'Measurement' },
    // Word Problems
    { title: '🧮 Multi-Step Word Problems', description: 'Solve complex word problems with 3 or more steps. Show all your work and thinking.', href: '/print?doc=multi-step-word-4th&from=4th-grade', docId: 'multi-step-word-4th', categories: ['word-problems'], section: 'Word Problems' },
    { title: '🧮 Fraction Word Problems', description: 'Solve word problems involving fractions. Add, subtract, and compare fractions in context.', href: '/print?doc=fraction-word-problems&from=4th-grade', docId: 'fraction-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: '🧮 Decimal Word Problems', description: 'Solve word problems involving decimals. Money, measurement, and real-world applications.', href: '/print?doc=decimal-word-problems&from=4th-grade', docId: 'decimal-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: '🧮 Measurement Word Problems', description: 'Solve word problems involving length, weight, capacity, and time. Unit conversions included.', href: '/print?doc=measurement-word-problems&from=4th-grade', docId: 'measurement-word-problems', categories: ['word-problems', 'measurement'], section: 'Word Problems' },
    { title: '🧮 Geometry Word Problems', description: 'Solve word problems involving area, perimeter, and angles. Real-world geometry applications.', href: '/print?doc=geometry-word-problems&from=4th-grade', docId: 'geometry-word-problems', categories: ['word-problems', 'geometry'], section: 'Word Problems' },
    // Data & Analysis
    { title: '📊 Line Plots', description: 'Create and interpret line plots. Understand data distribution and outliers.', href: '/print?doc=line-plots&from=4th-grade', docId: 'line-plots', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: '📊 Bar Graphs & Pictographs', description: 'Read and create bar graphs and pictographs. Interpret data and draw conclusions.', href: '/print?doc=bar-graphs-pictographs&from=4th-grade', docId: 'bar-graphs-pictographs', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: '📊 Mean, Median, Mode', description: 'Calculate mean (average), median, and mode. Understand measures of central tendency.', href: '/print?doc=mean-median-mode&from=4th-grade', docId: 'mean-median-mode', categories: ['data-analysis'], section: 'Data & Analysis' },
]

export default function WorksheetsFourthGradePage() {
  const { t, isRTL } = useTranslation();
  
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
    setSelectedCategories((prev) => {
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

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return FOURTH_GRADE_WORKSHEETS
    return FOURTH_GRADE_WORKSHEETS.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories])

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
        title={t('pages.fourthGrade.seoTitle')}
        description={t('pages.fourthGrade.seoDescription')}
        keywords={t('pages.fourthGrade.seoKeywords')}
        canonicalUrl="https://wizqo.com/worksheets/4th-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/4th-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "4th Grade Math Worksheets", item: canonical }
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
              <a href="/print?doc=pack&time=5&age=g4&skill=math&from=4th-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'4'});} catch{} }}>{t('pages.printables.buildPackButton')}</a>
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
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">{t('pages.fourthGrade.exploreLinks.thirdGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/5th-grade-math-worksheets">{t('pages.fourthGrade.exploreLinks.fifthGrade')}</a></li>
            <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">{t('pages.fourthGrade.exploreLinks.multiplication')}</a></li>
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">{t('pages.fourthGrade.exploreLinks.timesTable')}</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">{t('pages.fourthGrade.exploreLinks.readingComprehension')}</a></li>
            <li><a className="hover:underline" href="/printables">{t('pages.printables.title')}</a></li>
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
      </main>
      <Footer />
    </div>
  )
}

function WorksheetThumbnailCard({ title, description, href, docId }: { title: string; description: string; href: string; docId: string }) {
  const { t } = useTranslation();
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1')
  
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
          title={`${t('pages.fourthGrade.previewOf')} ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.fourthGrade.clickToView')}
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
          >
            {t('pages.fourthGrade.preview')}
          </a>
          <a
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            {t('pages.fourthGrade.download')}
          </a>
        </div>
      </div>
    </article>
  )
}
