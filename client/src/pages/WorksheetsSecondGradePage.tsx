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
  { title: '🔟 Place Value (Tens/Ones) to 99', description: 'Break numbers into tens and ones; compare and build numbers.', href: '/print?doc=place-value-hto&from=2nd-grade', docId: 'place-value-hto', category: 'Number Sense' },
  { title: '➡️ Skip Counting by 5s/10s to 120', description: 'Count on using number charts and dot‑paths to reach 120.', href: '/print?doc=skip-count-5-10-120&from=2nd-grade', docId: 'skip-count-5-10-120', category: 'Number Sense' },
  { title: '🔢 Expanded Form to 200', description: 'Write numbers in expanded form (100+20+5); understand place value.', href: '/print?doc=expanded-form-200&from=2nd-grade', docId: 'expanded-form-200', category: 'Number Sense' },
  { title: '📊 Number Patterns to 200', description: 'Identify and extend number patterns; build number sense.', href: '/print?doc=number-patterns-200&from=2nd-grade', docId: 'number-patterns-200', category: 'Number Sense' },
  { title: '🔍 Rounding to Nearest 10', description: 'Round 2-digit numbers to the nearest 10; estimation skills.', href: '/print?doc=rounding-nearest-10&from=2nd-grade', docId: 'rounding-nearest-10', category: 'Number Sense' },
  // Addition & Subtraction
  { title: '➕ 2‑Digit Addition (No Regrouping)', description: 'Practice adding two 2‑digit numbers within 100 (no carry).', href: '/print?doc=add-2digit-100&from=2nd-grade', docId: 'add-2digit-100', category: 'Addition & Subtraction' },
  { title: '➖ 2‑Digit Subtraction (No Regrouping)', description: 'Subtract within 100 using number lines and base‑ten models.', href: '/print?doc=sub-2digit-100&from=2nd-grade', docId: 'sub-2digit-100', category: 'Addition & Subtraction' },
  { title: '➕ Adding 3 Numbers', description: 'Add three single-digit or two-digit numbers; mental math practice.', href: '/print?doc=add-three-numbers&from=2nd-grade', docId: 'add-three-numbers', category: 'Addition & Subtraction' },
  { title: '➖ Missing Addends', description: 'Find the missing number in addition equations; inverse operations.', href: '/print?doc=missing-addends&from=2nd-grade', docId: 'missing-addends', category: 'Addition & Subtraction' },
  { title: '⚖️ Fact Families (to 20)', description: 'Complete fact families showing addition and subtraction relationships.', href: '/print?doc=fact-families-20&from=2nd-grade', docId: 'fact-families-20', category: 'Addition & Subtraction' },
  // Fluency Boosters
  { title: '📊 Compare 2‑Digit Numbers', description: 'Use >, <, = to compare numbers; explain using tens and ones.', href: '/print?doc=compare-2digit&from=2nd-grade', docId: 'compare-2digit', category: 'Fluency Boosters' },
  { title: '🧮 2nd‑Grade Word Problems', description: 'Mixed add/sub word problems within 100 (no regrouping).', href: '/print?doc=word-problems-100&from=2nd-grade', docId: 'word-problems-100', category: 'Fluency Boosters' },
  { title: '🔢 Mental Math (Add/Sub to 20)', description: 'Quick recall of addition and subtraction facts; build speed.', href: '/print?doc=mental-math-20&from=2nd-grade', docId: 'mental-math-20', category: 'Fluency Boosters' },
  { title: '📈 Number Line to 200', description: 'Use number lines to solve problems and locate numbers up to 200.', href: '/print?doc=number-line-200&from=2nd-grade', docId: 'number-line-200', category: 'Fluency Boosters' },
  { title: '🎯 Doubles & Near Doubles', description: 'Master doubles facts and near doubles (doubles +1) strategies.', href: '/print?doc=doubles-near-doubles&from=2nd-grade', docId: 'doubles-near-doubles', category: 'Fluency Boosters' },
  // Focus & Logic
  { title: '🔢 Even/Odd Sorting (to 100)', description: 'Sort numbers into even and odd; explain patterns you notice.', href: '/print?doc=even-odd-100&from=2nd-grade', docId: 'even-odd-100', category: 'Focus & Logic' },
  { title: '🕒 Time to 5 Minutes', description: 'Read times to the nearest 5 minutes; draw hands to match.', href: '/print?doc=time-5min&from=2nd-grade', docId: 'time-5min', category: 'Focus & Logic' },
  { title: '💰 Money: Coins & Bills', description: 'Count coins (pennies, nickels, dimes, quarters) and make change.', href: '/print?doc=money-coins-bills&from=2nd-grade', docId: 'money-coins-bills', category: 'Focus & Logic' },
  { title: '📏 Measurement: Length', description: 'Compare lengths using inches and centimeters; measurement practice.', href: '/print?doc=measurement-length&from=2nd-grade', docId: 'measurement-length', category: 'Focus & Logic' },
  { title: '📊 Bar Graphs & Data', description: 'Read and create simple bar graphs; interpret data.', href: '/print?doc=bar-graphs-data&from=2nd-grade', docId: 'bar-graphs-data', category: 'Focus & Logic' },
]

const CATEGORIES = ['All', 'Number Sense', 'Addition & Subtraction', 'Fluency Boosters', 'Focus & Logic']

export default function WorksheetsSecondGradePage() {
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
        title="2nd Grade Math Worksheets – Free Printable PDF"
        description="Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF."
        canonicalUrl="https://wizqo.com/worksheets/2nd-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/2nd-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/1st-grade-math-worksheets" },
            { "@type": "ListItem", position: 3, name: "2nd Grade Math Worksheets", item: "https://wizqo.com/worksheets/2nd-grade-math-worksheets" }
          ]
        } as const;
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Are these worksheets printable as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open any worksheet and use your browser's Print → Save as PDF to download." } },
            { "@type": "Question", name: "Can I use these in the classroom?", acceptedAnswer: { "@type": "Answer", text: "Yes—free for personal and classroom use." } },
            { "@type": "Question", name: "What skills are covered?", acceptedAnswer: { "@type": "Answer", text: "Counting, number sense, place value (tens/ones), addition/subtraction within 20 and 100, and focus/logic practice." } }
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
                ✨ Free printable worksheets • 2nd Grade Math
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                2nd Grade Math Worksheets
                <span className="block text-purple-600">Free printable PDFs with answer keys.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Build fluency with focused practice: place value (tens/ones), ten‑frames, number lines, addition and subtraction within 20, and attention‑boosting puzzles. Each worksheet is one page, easy to print, and designed for quick daily practice.
              </p>
              <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
                <p className="text-slate-700 text-sm mb-3">Create a quick Grade 2 math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 2nd Grade</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
                </div>
                <button
                  onClick={() => {
                    try {
                      const v = (document.getElementById('g2p-time') as HTMLSelectElement)?.getAttribute('data-v') || '5';
                      const url = `/print?doc=pack&time=${encodeURIComponent(v)}&age=g2&skill=math&from=2nd-grade`;
                      window.location.href = url;
                    } catch {}
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Build Pack →
                </button>
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
              <h2 className="text-xl font-semibold text-slate-900">2nd Grade Math Worksheets</h2>
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
                  Counting, number sense, place value, addition/subtraction within 20 and 100, focus and attention.
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
