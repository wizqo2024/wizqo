import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter } from '@/utils/analytics'

const SECOND_GRADE_CATEGORIES: Category[] = [
  { id: 'number-sense', label: 'Number Sense', icon: '🔢' },
  { id: 'addition-subtraction', label: 'Addition & Subtraction', icon: '➕➖' },
  { id: 'fluency', label: 'Fluency Boosters', icon: '⚡' },
  { id: 'logic', label: 'Focus & Logic', icon: '🧩' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

export default function WorksheetsSecondGradePage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '2nd-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '2nd-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories
  const allWorksheets: WorksheetItem[] = [
    // Number Sense
    { title: '🔟 Place Value (Tens/Ones) to 99', description: 'Break numbers into tens and ones; compare and build numbers.', href: '/print?doc=place-value-hto&from=2nd-grade', docId: 'place-value-hto', categories: ['number-sense'], section: 'Number Sense' },
    { title: '➡️ Skip Counting by 5s/10s to 120', description: 'Count on using number charts and dot‑paths to reach 120.', href: '/print?doc=skip-count-5-10-120&from=2nd-grade', docId: 'skip-count-5-10-120', categories: ['number-sense'], section: 'Number Sense' },
    { title: '🔢 Expanded Form to 200', description: 'Write numbers in expanded form (100+20+5); understand place value.', href: '/print?doc=expanded-form-200&from=2nd-grade', docId: 'expanded-form-200', categories: ['number-sense'], section: 'Number Sense' },
    { title: '📊 Number Patterns to 200', description: 'Identify and extend number patterns; build number sense.', href: '/print?doc=number-patterns-200&from=2nd-grade', docId: 'number-patterns-200', categories: ['number-sense'], section: 'Number Sense' },
    { title: '🔍 Rounding to Nearest 10', description: 'Round 2-digit numbers to the nearest 10; estimation skills.', href: '/print?doc=rounding-nearest-10&from=2nd-grade', docId: 'rounding-nearest-10', categories: ['number-sense'], section: 'Number Sense' },
    // Addition & Subtraction
    { title: '➕ 2‑Digit Addition (No Regrouping)', description: 'Practice adding two 2‑digit numbers within 100 (no carry).', href: '/print?doc=add-2digit-100&from=2nd-grade', docId: 'add-2digit-100', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➕ 2‑Digit Addition (WITH Regrouping)', description: 'Add the two numbers. You will need to regroup (carry) when the ones add up to 10 or more.', href: '/print?doc=add-2digit-regrouping&from=2nd-grade', docId: 'add-2digit-regrouping', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➖ 2‑Digit Subtraction (No Regrouping)', description: 'Subtract within 100 using number lines and base‑ten models.', href: '/print?doc=sub-2digit-100&from=2nd-grade', docId: 'sub-2digit-100', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➖ 2‑Digit Subtraction (WITH Regrouping)', description: 'Subtract the two numbers. You will need to regroup (borrow) when the ones digit is smaller.', href: '/print?doc=sub-2digit-regrouping&from=2nd-grade', docId: 'sub-2digit-regrouping', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➕ Adding 3 Numbers', description: 'Add three single-digit or two-digit numbers; mental math practice.', href: '/print?doc=add-three-numbers&from=2nd-grade', docId: 'add-three-numbers', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➖ Missing Addends', description: 'Find the missing number in addition equations; inverse operations.', href: '/print?doc=missing-addends&from=2nd-grade', docId: 'missing-addends', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '⚖️ Fact Families (to 20)', description: 'Complete fact families showing addition and subtraction relationships.', href: '/print?doc=fact-families-20&from=2nd-grade', docId: 'fact-families-20', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    // Fluency Boosters
    { title: '📊 Compare 2‑Digit Numbers', description: 'Use >, <, = to compare numbers; explain using tens and ones.', href: '/print?doc=compare-2digit&from=2nd-grade', docId: 'compare-2digit', categories: ['fluency', 'number-sense'], section: 'Fluency Boosters' },
    { title: '🧮 2nd‑Grade Word Problems', description: 'Mixed add/sub word problems within 100 (no regrouping).', href: '/print?doc=word-problems-100&from=2nd-grade', docId: 'word-problems-100', categories: ['fluency', 'addition-subtraction'], section: 'Fluency Boosters' },
    { title: '🔢 Mental Math (Add/Sub to 20)', description: 'Quick recall of addition and subtraction facts; build speed.', href: '/print?doc=mental-math-20&from=2nd-grade', docId: 'mental-math-20', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: '📈 Number Line to 200', description: 'Use number lines to solve problems and locate numbers up to 200.', href: '/print?doc=number-line-200&from=2nd-grade', docId: 'number-line-200', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: '🎯 Doubles & Near Doubles', description: 'Master doubles facts and near doubles (doubles +1) strategies.', href: '/print?doc=doubles-near-doubles&from=2nd-grade', docId: 'doubles-near-doubles', categories: ['fluency'], section: 'Fluency Boosters' },
    // Focus & Logic
    { title: '🔢 Even/Odd Sorting (to 100)', description: 'Sort numbers into even and odd; explain patterns you notice.', href: '/print?doc=even-odd-100&from=2nd-grade', docId: 'even-odd-100', categories: ['logic'], section: 'Focus & Logic' },
    { title: '🕒 Time to 5 Minutes', description: 'Read times to the nearest 5 minutes; draw hands to match.', href: '/print?doc=time-5min&from=2nd-grade', docId: 'time-5min', categories: ['logic'], section: 'Focus & Logic' },
    { title: '💰 Money: Coins & Bills', description: 'Count coins (pennies, nickels, dimes, quarters) and make change.', href: '/print?doc=money-coins-bills&from=2nd-grade', docId: 'money-coins-bills', categories: ['logic'], section: 'Focus & Logic' },
    { title: '📏 Measurement: Length', description: 'Compare lengths using inches and centimeters; measurement practice.', href: '/print?doc=measurement-length&from=2nd-grade', docId: 'measurement-length', categories: ['logic'], section: 'Focus & Logic' },
    { title: '📊 Bar Graphs & Data', description: 'Read and create simple bar graphs; interpret data.', href: '/print?doc=bar-graphs-data&from=2nd-grade', docId: 'bar-graphs-data', categories: ['logic'], section: 'Focus & Logic' },
    { title: '🍕 Fractions: Halves, Thirds, Fourths', description: 'Color the fraction shown. Then write the fraction name.', href: '/print?doc=fractions-halves-thirds-fourths&from=2nd-grade', docId: 'fractions-halves-thirds-fourths', categories: ['logic'], section: 'Focus & Logic' },
  ]

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
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
            { "@type": "Question", name: "Are these worksheets printable as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open any worksheet and use your browser’s Print → Save as PDF to download." } },
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">2nd Grade Math Worksheets</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">
            Free 2nd grade math worksheets—number sense, addition/subtraction to 100, ten‑frames, skip counting, and word‑problem warmups you can print and use at home or in class. Download as PDF.
          </p>
          {/* Builder moved under What's Inside per request */}
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">What’s Inside</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build fluency with focused practice: place value (tens/ones), ten‑frames, number lines, addition and subtraction within 20, and attention‑boosting puzzles. Each worksheet is one page, easy to print, and designed for quick daily practice.
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
                categories={SECOND_GRADE_CATEGORIES}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
                title="Filter by Category"
              />
            </div>
          </aside>

          {/* Right side - Worksheets grouped by section */}
          <div className="space-y-8">
            {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
              const sectionLabels: Record<string, string> = {
                'Number Sense': '🔢 Number Sense',
                'Addition & Subtraction': '➕➖ Addition & Subtraction',
                'Fluency Boosters': '⚡ Fluency Boosters',
                'Focus & Logic': '🧩 Focus & Logic',
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

        {/* Related links */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Related links</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">1st Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">3rd Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">Multiplication Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">Times Table Multiplication Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">Reading Comprehension Worksheets</a></li>
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
          </ul>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">Can I use these in the classroom?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes, they’re free for personal and classroom use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What skills are covered?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Counting, number sense, place value, addition/subtraction within 20 and 100, focus and attention.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Are these worksheets printable as PDF?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes. Open any worksheet and use your browser’s Print → Save as PDF to download.
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
  return (
    <div className={CARD_CLASS}>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <a href={href} className={OUTLINE_BUTTON} aria-label={`Open ${title} printable view`}>Open printable view →</a>
        <a href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')} className={BUTTON_CLASS} aria-label={`Download ${title} as PDF`}>Download PDF</a>
      </div>
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
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Print Pack</div>
      <p className="text-slate-700 text-sm mb-3 max-w-3xl">Create a quick Grade 2 math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm text-slate-600">Time
          <select id="g2p-time" className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" defaultValue="5"
            onChange={(e) => { (document.getElementById('g2p-time') as HTMLSelectElement).setAttribute('data-v', e.target.value); }}
          >
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </label>
      <div className="text-sm text-slate-600">Age/Grade <span className="font-medium ml-2">2nd Grade</span></div>
      <div className="text-sm text-slate-600">Focus <span className="font-medium ml-2">Math</span></div>
        <button
          onClick={() => {
            try {
              const v = (document.getElementById('g2p-time') as HTMLSelectElement)?.getAttribute('data-v') || '5';
              const url = `/print?doc=pack&time=${encodeURIComponent(v)}&age=g2&skill=math&from=2nd-grade`;
              window.location.href = url;
            } catch {}
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Build Pack →
        </button>
      </div>
    </div>
  )
}
