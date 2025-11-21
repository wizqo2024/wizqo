import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackPackGeneration, trackCategoryFilter } from '@/utils/analytics'
import { useTranslation } from '@/context/TranslationContext'

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  gradeRange?: string
}

export default function MultiplicationWorksheetsPage() {
  const { t, language, isRTL } = useTranslation()
  React.useEffect(() => {}, [language])
  
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
    { title: t('pages.multiplication.worksheets.basicFacts1_5.title'), description: t('pages.multiplication.worksheets.basicFacts1_5.description'), href: '/print?doc=mult-facts-1-5&from=multiplication', docId: 'mult-facts-1-5', categories: ['facts'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.arrays2_5.title'), description: t('pages.multiplication.worksheets.arrays2_5.description'), href: '/print?doc=mult-arrays-2-5&from=multiplication', docId: 'mult-arrays-2-5', categories: ['arrays'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.skipCounting.title'), description: t('pages.multiplication.worksheets.skipCounting.description'), href: '/print?doc=skip-count-mult&from=multiplication', docId: 'skip-count-mult', categories: ['skip-counting'], gradeRange: '2nd-3rd' },
    { title: t('pages.multiplication.worksheets.wordProblems2_3.title'), description: t('pages.multiplication.worksheets.wordProblems2_3.description'), href: '/print?doc=mult-word-problems-2-3&from=multiplication', docId: 'mult-word-problems-2-3', categories: ['word-problems'], gradeRange: '2nd-3rd' },
    // 3rd & 4th Grade
    { title: t('pages.multiplication.worksheets.advancedFacts6_12.title'), description: t('pages.multiplication.worksheets.advancedFacts6_12.description'), href: '/print?doc=mult-facts-6-12&from=multiplication', docId: 'mult-facts-6-12', categories: ['facts'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.arraysModels.title'), description: t('pages.multiplication.worksheets.arraysModels.description'), href: '/print?doc=mult-arrays-models&from=multiplication', docId: 'mult-arrays-models', categories: ['arrays'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.multiStepWord.title'), description: t('pages.multiplication.worksheets.multiStepWord.description'), href: '/print?doc=mult-multi-step-word&from=multiplication', docId: 'mult-multi-step-word', categories: ['word-problems'], gradeRange: '3rd-4th' },
    { title: t('pages.multiplication.worksheets.factFamilies.title'), description: t('pages.multiplication.worksheets.factFamilies.description'), href: '/print?doc=mult-fact-families&from=multiplication', docId: 'mult-fact-families', categories: ['fact-families'], gradeRange: '3rd-4th' },
    // 4th & 5th Grade
    { title: t('pages.multiplication.worksheets.multiDigit2x1.title'), description: t('pages.multiplication.worksheets.multiDigit2x1.description'), href: '/print?doc=mult-2x1&from=multiplication', docId: 'mult-2x1', categories: ['multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.multiDigit2x2.title'), description: t('pages.multiplication.worksheets.multiDigit2x2.description'), href: '/print?doc=mult-2x2&from=multiplication', docId: 'mult-2x2', categories: ['multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.areaModel.title'), description: t('pages.multiplication.worksheets.areaModel.description'), href: '/print?doc=mult-area-model&from=multiplication', docId: 'mult-area-model', categories: ['arrays', 'multi-digit'], gradeRange: '4th-5th' },
    { title: t('pages.multiplication.worksheets.complexWord.title'), description: t('pages.multiplication.worksheets.complexWord.description'), href: '/print?doc=mult-complex-word&from=multiplication', docId: 'mult-complex-word', categories: ['word-problems'], gradeRange: '4th-5th' },
    // Fluency & Practice
    { title: t('pages.multiplication.worksheets.factFluency.title'), description: t('pages.multiplication.worksheets.factFluency.description'), href: '/print?doc=mult-fact-fluency&from=multiplication', docId: 'mult-fact-fluency', categories: ['facts', 'fluency'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.mixedReview.title'), description: t('pages.multiplication.worksheets.mixedReview.description'), href: '/print?doc=mult-mixed-review&from=multiplication', docId: 'mult-mixed-review', categories: ['fluency'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.strategies.title'), description: t('pages.multiplication.worksheets.strategies.description'), href: '/print?doc=mult-strategies&from=multiplication', docId: 'mult-strategies', categories: ['fluency', 'skip-counting'], gradeRange: 'All' },
    { title: t('pages.multiplication.worksheets.patterns.title'), description: t('pages.multiplication.worksheets.patterns.description'), href: '/print?doc=mult-patterns&from=multiplication', docId: 'mult-patterns', categories: ['fluency', 'skip-counting'], gradeRange: 'All' },
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
        title={`${t('pages.multiplication.title')} - Printable PDFs with Answer Keys | Wizqo`}
        description={t('pages.multiplication.subtitle')}
        keywords="multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"
        canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/multiplication-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
            { "@type": "ListItem", position: 3, name: "Multiplication Worksheets", item: "https://wizqo.com/worksheets/multiplication-worksheets" }
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
                <span className="block text-purple-600">{t('pages.multiplication.subtitle')}</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                {t('pages.multiplication.subtitle')}
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
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
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
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">Times Table Multiplication Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">2nd Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">3rd Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">4th Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/5th-grade-math-worksheets">5th Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
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
        </div>
      </main>
      <Footer />
    </div>
  )
}

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4'
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors'
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors'

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
          title={`Preview of ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            👁️ Click to view full worksheet
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Answer key included</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Add download=1 parameter
              const url = new URL(href, window.location.origin)
              url.searchParams.set('download', '1')
              
              // Use hidden iframe to trigger download
              const iframe = document.createElement('iframe')
              iframe.style.display = 'none'
              iframe.style.width = '0'
              iframe.style.height = '0'
              iframe.style.position = 'absolute'
              iframe.style.left = '-9999px'
              iframe.src = url.toString()
              document.body.appendChild(iframe)
              
              setTimeout(() => {
                if (iframe.parentNode) {
                  document.body.removeChild(iframe)
                }
              }, 10000)
            }}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            ⬇️ Download
          </button>
          <a
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            🖨️ Print
          </a>
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
      <a href="/print?doc=pack&time=5&age=25&skill=math&from=multiplication" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={handleBuildPack}>{t('pages.printables.buildPackButton')}</a>
    </div>
  )
}
