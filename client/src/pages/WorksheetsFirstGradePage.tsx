import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { WorksheetThumbnailCard } from '@/components/WorksheetThumbnailCard'

interface Worksheet {
  title: string
  description: string
  href: string
  docId: string
  category: string
}

const ALL_WORKSHEETS: Worksheet[] = [
  // Number Sense
  { title: '🔟 Ten Frames 1–10', description: 'Color counters to build numbers 1–10; develop subitizing and number bonds.', href: '/print?doc=ten-frames-1-10', docId: 'ten-frames-1-10', category: 'Number Sense' },
  { title: '✏️ Number Tracing 1–20', description: 'Trace numbers 1–20 with start points and big writing space.', href: '/print?doc=number-tracing-1-20', docId: 'number-tracing-1-20', category: 'Number Sense' },
  { title: '🔢 Number Bonds to 10', description: 'Complete number bonds showing parts that make 10; build fact fluency.', href: '/print?doc=number-bonds-10', docId: 'number-bonds-10', category: 'Number Sense' },
  { title: '📊 Count & Write 1–30', description: 'Count objects and write the number; practice one-to-one correspondence.', href: '/print?doc=count-write-30', docId: 'count-write-30', category: 'Number Sense' },
  { title: '🔍 Missing Numbers 1–50', description: 'Fill in missing numbers on number lines; practice sequencing.', href: '/print?doc=missing-numbers-50', docId: 'missing-numbers-50', category: 'Number Sense' },
  // Addition & Subtraction
  { title: '➕ Add/Sub within 10', description: 'No‑prep practice with number lines and picture cues.', href: '/print?doc=addition-subtraction-0-10', docId: 'addition-subtraction-0-10', category: 'Addition & Subtraction' },
  { title: '🧮 Math Maze (Within 18)', description: 'Solve simple equations to find a path from start to finish.', href: '/print?doc=math-maze', docId: 'math-maze', category: 'Addition & Subtraction' },
  { title: '➕ Picture Addition to 10', description: 'Count pictures and add them together; visual math practice.', href: '/print?doc=picture-addition-10', docId: 'picture-addition-10', category: 'Addition & Subtraction' },
  { title: '➖ Subtraction Stories', description: 'Solve subtraction problems using picture stories and number lines.', href: '/print?doc=subtraction-stories', docId: 'subtraction-stories', category: 'Addition & Subtraction' },
  { title: '⚖️ Balance Equations (to 10)', description: 'Find missing numbers to balance addition and subtraction equations.', href: '/print?doc=balance-equations-10', docId: 'balance-equations-10', category: 'Addition & Subtraction' },
  // Fluency Boosters
  { title: '🔢 Dot‑to‑Dot 1–20', description: 'Connect the dots to reveal a picture while you count to 20.', href: '/print?doc=dot-to-dot-1-20', docId: 'dot-to-dot-1-20', category: 'Fluency Boosters' },
  { title: '🎨 Color‑by‑Number (1–4)', description: 'Follow the key to color simple scenes; practice number recognition.', href: '/print?doc=color-by-number', docId: 'color-by-number', category: 'Fluency Boosters' },
  { title: '➡️ Skip Counting by 2s', description: 'Practice counting by 2s from 2 to 20; build pattern recognition.', href: '/print?doc=skip-count-2s', docId: 'skip-count-2s', category: 'Fluency Boosters' },
  { title: '🔢 Number Line Addition', description: 'Use number lines to solve addition problems within 15.', href: '/print?doc=number-line-add', docId: 'number-line-add', category: 'Fluency Boosters' },
  { title: '🎯 Doubles Facts Practice', description: 'Master doubles (1+1, 2+2, etc.) with fun visual activities.', href: '/print?doc=doubles-facts', docId: 'doubles-facts', category: 'Fluency Boosters' },
  // Focus & Logic
  { title: '👀 Spot‑the‑Difference (7)', description: 'Find differences to build attention and visual scanning.', href: '/print?doc=spot-difference', docId: 'spot-difference', category: 'Focus & Logic' },
  { title: '🟩 Shapes & Colors Sort', description: 'Cut, sort, and glue basic shapes by color; early math + fine motor.', href: '/print?doc=shapes-colors-sort', docId: 'shapes-colors-sort', category: 'Focus & Logic' },
  { title: '🧩 Pattern Completion', description: 'Complete AB, ABC, and AAB patterns using shapes and colors.', href: '/print?doc=pattern-complete', docId: 'pattern-complete', category: 'Focus & Logic' },
  { title: '🔍 Find the Missing Shape', description: 'Identify which shape comes next in a sequence; logic practice.', href: '/print?doc=missing-shape', docId: 'missing-shape', category: 'Focus & Logic' },
  { title: '📏 Size Comparison', description: 'Compare objects by size (big/small, long/short); measurement basics.', href: '/print?doc=size-comparison', docId: 'size-comparison', category: 'Focus & Logic' },
]

const CATEGORIES = ['All', 'Number Sense', 'Addition & Subtraction', 'Fluency Boosters', 'Focus & Logic']

export default function WorksheetsFirstGradePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredWorksheets = useMemo(() => {
    let filtered = ALL_WORKSHEETS

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(ws => ws.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(ws => 
        ws.title.toLowerCase().includes(query) ||
        ws.description.toLowerCase().includes(query) ||
        ws.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="1st Grade Math Worksheets – Free Printable PDF"
        description="Free 1st grade math worksheets covering number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF."
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
            { "@type": "Question", name: "Can I use these in the classroom?", acceptedAnswer: { "@type": "Answer", text: "Yes—free for personal and classroom use." } },
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
      <UnifiedNavigation currentPage="kids" />
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
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                ✨ Free printable worksheets • 1st Grade Math
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                1st Grade Math Worksheets
                <span className="block text-purple-600">Free printable PDFs with answer keys.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Build Grade 1 fluency with free printable worksheets covering number sense, addition/subtraction, ten‑frames, skip counting, and shapes. Ready to print or download as PDF.
              </p>
              <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
                <p className="text-slate-700 text-sm mb-3">Create a quick Grade 1 math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 1st Grade</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
                </div>
                <a href="/print?doc=pack&time=5&age=g1&skill=math" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'1'});} catch{} }}>Build Pack →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
          {/* Sidebar */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">Filter by Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">1st Grade Math Worksheets</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {filteredWorksheets.length} {filteredWorksheets.length === 1 ? 'worksheet' : 'worksheets'} {searchQuery || selectedCategory !== 'All' ? 'found' : 'available'}
              </span>
            </div>
            
            {/* Search Bar */}
            <div className="flex justify-end">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search worksheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {filteredWorksheets.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                {searchQuery ? `No worksheets match your search query "${searchQuery}". Try a different search term.` : 'No worksheets found.'}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredWorksheets.map((worksheet) => (
                  <WorksheetThumbnailCard
                    key={worksheet.docId}
                    title={worksheet.title}
                    description={worksheet.description}
                    href={worksheet.href}
                    docId={worksheet.docId}
                  />
                ))}
              </div>
            )}
          </section>
        </section>

        {/* FAQs Section */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="q1" className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <AccordionTrigger className="font-semibold text-slate-900">Can I use these in the classroom?</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 mt-2">
                  Yes, they're free for personal and classroom use.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <AccordionTrigger className="font-semibold text-slate-900">What skills are covered?</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 mt-2">
                  Number sense, addition/subtraction within 10, counting to 120, shapes, and early logic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <AccordionTrigger className="font-semibold text-slate-900">Are these worksheets printable as PDF?</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 mt-2">
                  Yes. Open any worksheet and use your browser's Print → Save as PDF to download.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
