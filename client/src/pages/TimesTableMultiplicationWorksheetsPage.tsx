import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackPackGeneration, trackCategoryFilter } from '@/utils/analytics'

const TIMES_TABLE_CATEGORIES: Category[] = [
  { id: 'horizontal', label: 'Horizontal Format', icon: '➡️' },
  { id: 'vertical', label: 'Vertical Format', icon: '⬇️' },
  { id: 'missing-number', label: 'Missing Numbers', icon: '❓' },
  { id: 'timed', label: 'Timed Tests', icon: '⏱️' },
  { id: 'blank', label: 'Blank Tables', icon: '📋' },
  { id: 'confidence', label: 'Confidence Building', icon: '💪' },
  { id: 'fluency', label: 'Fluency Practice', icon: '⚡' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  gradeRange?: string
}

export default function TimesTableMultiplicationWorksheetsPage() {
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
  const allWorksheets: WorksheetItem[] = [
    // Horizontal Format Worksheets
    { title: '➡️ Horizontal Times Table (1-5)', description: 'Practice times tables 1-5 in horizontal format. Build confidence with simple, stress-free multiplication practice sheets perfect for beginners.', href: '/print?doc=times-table-horizontal-1-5&from=times-table', docId: 'times-table-horizontal-1-5', categories: ['horizontal', 'confidence'], gradeRange: '1st-2nd' },
    { title: '➡️ Horizontal Times Table (6-12)', description: 'Master times tables 6-12 in horizontal format. Fun and simple worksheets to make multiplication easier for advancing learners.', href: '/print?doc=times-table-horizontal-6-12&from=times-table', docId: 'times-table-horizontal-6-12', categories: ['horizontal', 'fluency'], gradeRange: '3rd-4th' },
    { title: '➡️ Complete Horizontal Times Table (1-12)', description: 'Comprehensive horizontal times table practice covering all facts 1-12. Perfect for building multiplication fluency and speed.', href: '/print?doc=times-table-horizontal-1-12&from=times-table', docId: 'times-table-horizontal-1-12', categories: ['horizontal', 'fluency'], gradeRange: 'All' },
    
    // Vertical Format Worksheets
    { title: '⬇️ Vertical Times Table (1-5)', description: 'Practice times tables 1-5 in vertical format. Step-by-step multiplication worksheets designed for kids who struggle with multiplication.', href: '/print?doc=times-table-vertical-1-5&from=times-table', docId: 'times-table-vertical-1-5', categories: ['vertical', 'confidence'], gradeRange: '1st-2nd' },
    { title: '⬇️ Vertical Times Table (6-12)', description: 'Master times tables 6-12 in vertical format. Engaging multiplication worksheets that make learning fun and build math confidence.', href: '/print?doc=times-table-vertical-6-12&from=times-table', docId: 'times-table-vertical-6-12', categories: ['vertical', 'fluency'], gradeRange: '3rd-4th' },
    { title: '⬇️ Complete Vertical Times Table (1-12)', description: 'Comprehensive vertical times table practice covering all facts 1-12. Printable worksheets to help kids overcome math fear.', href: '/print?doc=times-table-vertical-1-12&from=times-table', docId: 'times-table-vertical-1-12', categories: ['vertical', 'fluency'], gradeRange: 'All' },
    
    // Missing Number Worksheets
    { title: '❓ Missing Number Times Table (1-5)', description: 'Fill in the missing numbers in times table problems. No-tears times table practice sheets that build understanding through pattern recognition.', href: '/print?doc=times-table-missing-1-5&from=times-table', docId: 'times-table-missing-1-5', categories: ['missing-number', 'confidence'], gradeRange: '1st-2nd' },
    { title: '❓ Missing Number Times Table (6-12)', description: 'Complete missing numbers in advanced times table problems. Gentle step-by-step multiplication worksheets for confident learning.', href: '/print?doc=times-table-missing-6-12&from=times-table', docId: 'times-table-missing-6-12', categories: ['missing-number', 'fluency'], gradeRange: '3rd-4th' },
    { title: '❓ Mixed Missing Number Challenge', description: 'Mixed missing number problems across all times tables 1-12. Build multiplication fluency with engaging practice that makes learning fun.', href: '/print?doc=times-table-missing-mixed&from=times-table', docId: 'times-table-missing-mixed', categories: ['missing-number', 'fluency'], gradeRange: 'All' },
    
    // Timed Test Worksheets
    { title: '⏱️ Timed Times Table Test (1-5)', description: 'Build speed and accuracy with timed multiplication tests for facts 1-5. Printable timed multiplication test sheets for confident practice.', href: '/print?doc=times-table-timed-1-5&from=times-table', docId: 'times-table-timed-1-5', categories: ['timed', 'fluency'], gradeRange: '2nd-3rd' },
    { title: '⏱️ Timed Times Table Test (6-12)', description: 'Master speed with timed multiplication tests for facts 6-12. Fun multiplication worksheets that build confidence and math fact practice.', href: '/print?doc=times-table-timed-6-12&from=times-table', docId: 'times-table-timed-6-12', categories: ['timed', 'fluency'], gradeRange: '3rd-5th' },
    { title: '⏱️ Complete Timed Test (1-12)', description: 'Comprehensive timed multiplication test covering all facts 1-12. Perfect for building multiplication fluency and memorizing times tables.', href: '/print?doc=times-table-timed-1-12&from=times-table', docId: 'times-table-timed-1-12', categories: ['timed', 'fluency'], gradeRange: 'All' },
    
    // Blank Times Table Worksheets
    { title: '📋 Blank Times Table (1-5) - Fill In', description: 'Blank times table worksheets to fill in for facts 1-5. Perfect for memorization practice and building multiplication confidence.', href: '/print?doc=times-table-blank-1-5&from=times-table', docId: 'times-table-blank-1-5', categories: ['blank', 'confidence'], gradeRange: '1st-2nd' },
    { title: '📋 Blank Times Table (6-12) - Fill In', description: 'Blank times table worksheets to fill in for facts 6-12. Worksheets for kids who struggle with multiplication - build confidence step by step.', href: '/print?doc=times-table-blank-6-12&from=times-table', docId: 'times-table-blank-6-12', categories: ['blank', 'fluency'], gradeRange: '3rd-4th' },
    { title: '📋 Complete Blank Times Table (1-12)', description: 'Complete blank times table grid for all facts 1-12. Printable worksheets to help kids overcome math fear and build multiplication fluency.', href: '/print?doc=times-table-blank-1-12&from=times-table', docId: 'times-table-blank-1-12', categories: ['blank', 'fluency'], gradeRange: 'All' },
    
    // Confidence Building Worksheets
    { title: '💪 Confidence-Building Times Table (1-5)', description: 'Stress-free times table worksheets designed to build confidence. Fun and simple worksheets to make multiplication easier for struggling learners.', href: '/print?doc=times-table-confidence-1-5&from=times-table', docId: 'times-table-confidence-1-5', categories: ['confidence'], gradeRange: '1st-2nd' },
    { title: '💪 Confidence-Building Times Table (6-12)', description: 'Gentle step-by-step multiplication worksheets for facts 6-12. No-tears times table practice sheets that build understanding and confidence.', href: '/print?doc=times-table-confidence-6-12&from=times-table', docId: 'times-table-confidence-6-12', categories: ['confidence'], gradeRange: '3rd-4th' },
    
    // Fluency Practice Worksheets
    { title: '⚡ Times Table Fluency Practice (1-12)', description: 'Build multiplication fluency with comprehensive practice covering all times tables 1-12. Repeated addition worksheets that make learning fun.', href: '/print?doc=times-table-fluency-1-12&from=times-table', docId: 'times-table-fluency-1-12', categories: ['fluency'], gradeRange: 'All' },
    { title: '⚡ Mixed Times Table Review', description: 'Mixed review of all times tables 1-12 for comprehensive practice. Math fact practice worksheets that build speed, accuracy, and confidence.', href: '/print?doc=times-table-mixed-review&from=times-table', docId: 'times-table-mixed-review', categories: ['fluency'], gradeRange: 'All' },
    
    // Color-by-Number Worksheets
    { title: '🎨 Color-by-Number Times Table (1-5)', description: 'Solve multiplication problems and color the picture! Fun color-by-number worksheets that make times table practice engaging and visual.', href: '/print?doc=times-table-color-1-5&from=times-table', docId: 'times-table-color-1-5', categories: ['fluency'], gradeRange: '1st-3rd' },
    { title: '🎨 Color-by-Number Times Table (6-12)', description: 'Master times tables 6-12 with fun color-by-number activities. Engaging multiplication worksheets that combine math practice with creativity.', href: '/print?doc=times-table-color-6-12&from=times-table', docId: 'times-table-color-6-12', categories: ['fluency'], gradeRange: '3rd-5th' },
    { title: '🎨 Color-by-Number Times Table (1-12)', description: 'Complete color-by-number picture using all times tables 1-12. Multiplication color-by-number worksheets that make learning fun and rewarding.', href: '/print?doc=times-table-color-1-12&from=times-table', docId: 'times-table-color-1-12', categories: ['fluency'], gradeRange: 'All' },
  ]

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories])

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
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Times Table Worksheets PDF | Math Practice | Wizqo"
        description="Print free time table multiplication worksheets (PDF) that boost confidence, speed, and accuracy. Fun, no-stress practice sheets for grades 1–5. Download and learn today!"
        keywords="times table multiplication worksheets free pdf, printable times table worksheets for kids, 1–12 multiplication table worksheets pdf, free times table practice sheets grade 1–5, multiplication drill worksheets printable, easy times table worksheets for struggling learners, fun multiplication worksheets for kids pdf, basic multiplication worksheets for beginners, multiplication worksheets with answers pdf, confidence-building multiplication worksheets pdf, stress-free times table worksheets for kids, fun and simple worksheets to make multiplication easier, no-tears times table practice sheets, gentle step-by-step multiplication worksheets, worksheets for kids who struggle with multiplication, printable worksheets to help kids overcome math fear, engaging multiplication worksheets that make learning fun, horizontal multiplication worksheets pdf, vertical multiplication worksheets printable, missing number multiplication worksheets, timed multiplication test sheets printable, multiplication color-by-number worksheets, multiplication worksheets for slow learners pdf, blank times table worksheets to fill in, memorize times tables, multiplication fluency, math fact practice, repeated addition worksheets, math confidence building"
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
                ✨ Free times table worksheets • Grades 1–5
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free Times Table Multiplication Worksheets (PDF) to Boost Your Child's Confidence
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Print free time table multiplication worksheets (PDF) that boost confidence, speed, and accuracy. Fun, no-stress practice sheets for grades 1–5 covering all times tables 1-12. Download horizontal, vertical, missing number, and timed test worksheets with answer keys included.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What's Inside</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build multiplication confidence and fluency with focused times table practice: horizontal and vertical formats, missing number challenges, timed tests, blank tables to fill in, and confidence-building worksheets. Each worksheet is designed to make multiplication easier, reduce math anxiety, and build speed and accuracy. Perfect for struggling learners, slow learners, and kids who need extra support. All worksheets include answer keys.
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
                title="Filter by Category"
              />
            </div>
          </aside>

          {/* Right side - Worksheets grouped by grade range */}
          <div className="space-y-8">
          {Object.entries(groupedWorksheets).map(([gradeRange, worksheets]) => {
            const gradeLabels: Record<string, string> = {
              '1st-2nd': '🌟 1st & 2nd Grade Times Tables',
              '2nd-3rd': '🔢 2nd & 3rd Grade Times Tables',
              '3rd-4th': '⚡ 3rd & 4th Grade Times Tables',
              '3rd-5th': '🚀 3rd-5th Grade Times Tables',
              'All': '🎯 All Grades Times Table Practice',
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
              <p className="text-lg">No worksheets match the selected categories.</p>
              <button
                onClick={clearCategories}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters to show all worksheets
              </button>
            </div>
          )}
          </div>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">Are times table multiplication worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All times table multiplication worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What grade levels are times table worksheets available for?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our times table multiplication worksheets are perfect for 1st grade, 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to build confidence and make multiplication easier for struggling learners.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do times table worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every times table multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">What types of times table worksheets are available?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                We offer horizontal multiplication worksheets, vertical multiplication worksheets, missing number multiplication worksheets, timed multiplication test sheets, blank times table worksheets to fill in, and confidence-building worksheets. Perfect for building multiplication fluency and helping kids overcome math fear.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="px-4">Are these worksheets good for kids who struggle with multiplication?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Absolutely! Our times table worksheets are specifically designed for struggling learners and slow learners. They feature gentle step-by-step practice, stress-free formats, and confidence-building exercises that make multiplication easier and more fun.
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
          <a
            href={href}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            👁️ Preview
          </a>
          <a
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            ⬇️ Download
          </a>
        </div>
      </div>
    </article>
  )
}

function BuildPackInline() {
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
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Times Table Print Pack</div>
      <p className="text-slate-700 text-sm mb-3">Create a quick times table practice set — perfect for building confidence, warm‑ups, brain breaks, or homework helpers.</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 1st-5th Grade</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Times Tables</span>
      </div>
      <a href="/print?doc=pack&time=5&age=25&skill=math&from=times-table" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={handleBuildPack}>Build Pack →</a>
    </div>
  )
}
