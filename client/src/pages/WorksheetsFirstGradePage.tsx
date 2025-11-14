import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'

const FIRST_GRADE_CATEGORIES: Category[] = [
  { id: 'number-sense', label: 'Number Sense', icon: '🔢' },
  { id: 'addition-subtraction', label: 'Addition & Subtraction', icon: '➕➖' },
  { id: 'fluency', label: 'Fluency Boosters', icon: '⚡' },
  { id: 'logic', label: 'Focus & Logic', icon: '🧩' },
  { id: 'literacy', label: 'Early Literacy', icon: '📚' },
  { id: 'early-math', label: 'Early Math Skills', icon: '🔢' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

export default function WorksheetsFirstGradePage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
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
    { title: '🔟 Ten Frames 1–10', description: 'Color counters to build numbers 1–10; develop subitizing and number bonds.', href: '/print?doc=ten-frames-1-10&from=1st-grade', docId: 'ten-frames-1-10', categories: ['number-sense'], section: 'Number Sense' },
    { title: '✏️ Number Tracing 1–20', description: 'Trace numbers 1–20 with start points and big writing space.', href: '/print?doc=number-tracing-1-20&from=1st-grade', docId: 'number-tracing-1-20', categories: ['number-sense'], section: 'Number Sense' },
    { title: '🔢 Number Bonds to 10', description: 'Complete number bonds showing parts that make 10; build fact fluency.', href: '/print?doc=number-bonds-10&from=1st-grade', docId: 'number-bonds-10', categories: ['number-sense'], section: 'Number Sense' },
    { title: '📊 Count & Write 1–30', description: 'Count objects and write the number; practice one-to-one correspondence.', href: '/print?doc=count-write-30&from=1st-grade', docId: 'count-write-30', categories: ['number-sense'], section: 'Number Sense' },
    { title: '🔍 Missing Numbers 1–50', description: 'Fill in missing numbers on number lines; practice sequencing.', href: '/print?doc=missing-numbers-50&from=1st-grade', docId: 'missing-numbers-50', categories: ['number-sense'], section: 'Number Sense' },
    // Addition & Subtraction
    { title: '➕ Add/Sub within 10', description: 'No‑prep practice with number lines and picture cues.', href: '/print?doc=addition-subtraction-0-10&from=1st-grade', docId: 'addition-subtraction-0-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '🧮 Math Maze (Within 18)', description: 'Solve simple equations to find a path from start to finish.', href: '/print?doc=math-maze&from=1st-grade', docId: 'math-maze', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➕ Picture Addition to 10', description: 'Count pictures and add them together; visual math practice.', href: '/print?doc=picture-addition-10&from=1st-grade', docId: 'picture-addition-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '➖ Subtraction Stories', description: 'Solve subtraction problems using picture stories and number lines.', href: '/print?doc=subtraction-stories&from=1st-grade', docId: 'subtraction-stories', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    { title: '⚖️ Balance Equations (to 10)', description: 'Find missing numbers to balance addition and subtraction equations.', href: '/print?doc=balance-equations-10&from=1st-grade', docId: 'balance-equations-10', categories: ['addition-subtraction'], section: 'Addition & Subtraction' },
    // Fluency Boosters
    { title: '🔢 Dot‑to‑Dot 1–20', description: 'Connect the dots to reveal a picture while you count to 20.', href: '/print?doc=dot-to-dot-1-20&from=1st-grade', docId: 'dot-to-dot-1-20', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: '🎨 Color‑by‑Number (1–4)', description: 'Follow the key to color simple scenes; practice number recognition.', href: '/print?doc=color-by-number&from=1st-grade', docId: 'color-by-number', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: '➡️ Skip Counting by 2s', description: 'Practice counting by 2s from 2 to 20; build pattern recognition.', href: '/print?doc=skip-count-2s&from=1st-grade', docId: 'skip-count-2s', categories: ['fluency'], section: 'Fluency Boosters' },
    { title: '🔢 Number Line Addition', description: 'Use number lines to solve addition problems within 15.', href: '/print?doc=number-line-add&from=1st-grade', docId: 'number-line-add', categories: ['fluency', 'addition-subtraction'], section: 'Fluency Boosters' },
    { title: '🎯 Doubles Facts Practice', description: 'Master doubles (1+1, 2+2, etc.) with fun visual activities.', href: '/print?doc=doubles-facts&from=1st-grade', docId: 'doubles-facts', categories: ['fluency'], section: 'Fluency Boosters' },
    // Focus & Logic
    { title: '👀 Spot‑the‑Difference (7)', description: 'Find differences to build attention and visual scanning.', href: '/print?doc=spot-difference&from=1st-grade', docId: 'spot-difference', categories: ['logic'], section: 'Focus & Logic' },
    { title: '🟩 Shapes & Colors Sort', description: 'Cut, sort, and glue basic shapes by color; early math + fine motor.', href: '/print?doc=shapes-colors-sort&from=1st-grade', docId: 'shapes-colors-sort', categories: ['logic'], section: 'Focus & Logic' },
    { title: '🧩 Pattern Completion', description: 'Complete AB, ABC, and AAB patterns using shapes and colors.', href: '/print?doc=pattern-complete&from=1st-grade', docId: 'pattern-complete', categories: ['logic'], section: 'Focus & Logic' },
    { title: '🔍 Find the Missing Shape', description: 'Identify which shape comes next in a sequence; logic practice.', href: '/print?doc=missing-shape&from=1st-grade', docId: 'missing-shape', categories: ['logic'], section: 'Focus & Logic' },
    { title: '📏 Size Comparison', description: 'Compare objects by size (big/small, long/short); measurement basics.', href: '/print?doc=size-comparison&from=1st-grade', docId: 'size-comparison', categories: ['logic'], section: 'Focus & Logic' },
    // Early Literacy
    { title: '🎵 Rhyming Words', description: 'Circle the word that rhymes with the picture. Say both words out loud.', href: '/print?doc=rhyming-words&from=1st-grade', docId: 'rhyming-words', categories: ['literacy'], section: 'Early Literacy' },
    { title: '📚 CVC Words', description: 'Read each CVC word. Match it to the picture. Then write the word.', href: '/print?doc=cvc-words&from=1st-grade', docId: 'cvc-words', categories: ['literacy'], section: 'Early Literacy' },
    { title: '👁️ Sight Words (Pre-Primer)', description: 'Read each sight word. Trace it, then write it three times.', href: '/print?doc=sight-words-pre-primer&from=1st-grade', docId: 'sight-words-pre-primer', categories: ['literacy'], section: 'Early Literacy' },
    { title: '✏️ Letter Tracing A–Z', description: 'Trace each letter. Start at the dot. Say the letter name and sound.', href: '/print?doc=letter-tracing-az&from=1st-grade', docId: 'letter-tracing-az', categories: ['literacy'], section: 'Early Literacy' },
    { title: '📝 Sentence Building', description: 'Put the words in order to make a sentence. Write the sentence on the line.', href: '/print?doc=sentence-building&from=1st-grade', docId: 'sentence-building', categories: ['literacy'], section: 'Early Literacy' },
    // Early Math Skills
    { title: '⚖️ More, Less, or Equal? (1–10)', description: 'Compare the two groups. Circle: more, less, or equal.', href: '/print?doc=more-less-equal-10&from=1st-grade', docId: 'more-less-equal-10', categories: ['early-math'], section: 'Early Math Skills' },
    { title: '🔢 Count the Objects (1–20)', description: 'Count each group of objects. Write the number in the box.', href: '/print?doc=counting-objects-20&from=1st-grade', docId: 'counting-objects-20', categories: ['early-math'], section: 'Early Math Skills' },
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
            { "@type": "Question", name: "Are these worksheets printable as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open any worksheet and use your browser’s Print → Save as PDF to download." } },
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">1st Grade Math Worksheets (Free Printables)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">
            Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes you can print and use at home or in class. Download as PDF.
          </p>
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">What’s Inside</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build Grade 1 fluency: ten‑frames, number tracing, number bonds to 10, addition/subtraction within 10, skip counting by 2s/5s, and simple shape/logic warm‑ups. One page each—no prep.
          </p>
          {/* Grade 1 Pack CTA (moved from header) */}
          <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white">
            <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
            <p className="text-slate-700 text-sm mb-3">Create a quick Grade 1 math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 1st Grade</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
            </div>
            <a href="/print?doc=pack&time=5&age=g1&skill=math&from=1st-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'1'});} catch{} }}>Build Pack →</a>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <CategoryFilter
            categories={FIRST_GRADE_CATEGORIES}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            onClearAll={clearCategories}
            title="Filter by Category"
          />
        </section>

        {/* Worksheets grouped by section */}
        <section>
          <div className="space-y-8">
            {Object.entries(groupedWorksheets).map(([section, worksheets]) => {
              const sectionLabels: Record<string, string> = {
                'Number Sense': '🔢 Number Sense',
                'Addition & Subtraction': '➕➖ Addition & Subtraction',
                'Fluency Boosters': '⚡ Fluency Boosters',
                'Focus & Logic': '🧩 Focus & Logic',
                'Early Literacy': '📚 Early Literacy',
                'Early Math Skills': '🔢 Early Math Skills',
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
                Number sense, addition/subtraction within 10, counting to 120, shapes, and early logic.
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
