import React, { useState, useMemo } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CategoryFilter, type Category } from '@/components/CategoryFilter';
import { trackCategoryFilter } from '@/utils/analytics';

const READING_CATEGORIES: Category[] = [
  { id: 'grade-1', label: 'Grade 1', icon: '📖' },
  { id: 'grade-2', label: 'Grade 2', icon: '📖' },
  { id: 'grade-3', label: 'Grade 3', icon: '📖' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  grade?: string
}

export default function ReadingComprehensionPage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', 'reading-comprehension')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', 'reading-comprehension')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Define all worksheets with their categories
  const allWorksheets: WorksheetItem[] = [
    // Grade 1
    { title: '📖 The Lost Hat (Grade 1)', description: 'Short passage + 4 questions — print‑ready PDF view.', href: '/print?doc=reading-g1-lost-hat&from=reading-comprehension', docId: 'reading-g1-lost-hat', categories: ['grade-1'], grade: 'Grade 1' },
    { title: '📖 Lunch for the Ants (Grade 1)', description: 'Short passage + 4 questions — print‑ready PDF view.', href: '/print?doc=reading-g1-ants&from=reading-comprehension', docId: 'reading-g1-ants', categories: ['grade-1'], grade: 'Grade 1' },
    { title: '📖 The Bus Ride (Grade 1)', description: 'Short passage + 4 questions — print‑ready PDF view.', href: '/print?doc=reading-g1-bus-ride&from=reading-comprehension', docId: 'reading-g1-bus-ride', categories: ['grade-1'], grade: 'Grade 1' },
    { title: '📖 The Pet Fish (Grade 1)', description: 'Short passage + 4 questions — print‑ready PDF view.', href: '/print?doc=reading-g1-pet-fish&from=reading-comprehension', docId: 'reading-g1-pet-fish', categories: ['grade-1'], grade: 'Grade 1' },
    // Grade 2
    { title: '📖 The Paper Bridge (Grade 2)', description: 'Short passage + questions — open to print‑ready PDF view.', href: '/print?doc=reading-g2-paper-bridge&from=reading-comprehension', docId: 'reading-g2-paper-bridge', categories: ['grade-2'], grade: 'Grade 2' },
    { title: '📖 Rainy Day Garden (Grade 2)', description: 'Short passage + questions — open to print‑ready PDF view.', href: '/print?doc=reading-g2-rainy-garden&from=reading-comprehension', docId: 'reading-g2-rainy-garden', categories: ['grade-2'], grade: 'Grade 2' },
    { title: '📖 New Library Card (Grade 2)', description: 'Short passage + questions — open to print‑ready PDF view.', href: '/print?doc=reading-g2-library-card&from=reading-comprehension', docId: 'reading-g2-library-card', categories: ['grade-2'], grade: 'Grade 2' },
    { title: '📖 Lost and Found (Grade 2)', description: 'Short passage + questions — open to print‑ready PDF view.', href: '/print?doc=reading-g2-lost-and-found&from=reading-comprehension', docId: 'reading-g2-lost-and-found', categories: ['grade-2'], grade: 'Grade 2' },
    // Grade 3
    { title: '📖 The Lighthouse Keeper\'s Trick (Grade 3)', description: 'Short passage + Q&A — open print‑ready PDF view.', href: '/print?doc=reading-g3-lighthouse&from=reading-comprehension', docId: 'reading-g3-lighthouse', categories: ['grade-3'], grade: 'Grade 3' },
    { title: '📖 The Science Fair Plan (Grade 3)', description: 'Short passage + Q&A — open print‑ready PDF view.', href: '/print?doc=reading-g3-science-fair&from=reading-comprehension', docId: 'reading-g3-science-fair', categories: ['grade-3'], grade: 'Grade 3' },
    { title: '📖 The Community Garden (Grade 3)', description: 'Short passage + Q&A — open print‑ready PDF view.', href: '/print?doc=reading-g3-community-garden&from=reading-comprehension', docId: 'reading-g3-community-garden', categories: ['grade-3'], grade: 'Grade 3' },
  ]

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return allWorksheets
    return allWorksheets.filter((ws) => 
      ws.categories.some((cat) => selectedCategories.has(cat))
    )
  }, [selectedCategories])

  // Group filtered worksheets by grade
  const groupedWorksheets = useMemo(() => {
    const groups: Record<string, WorksheetItem[]> = {}
    filteredWorksheets.forEach((ws) => {
      const grade = ws.grade || 'Other'
      if (!groups[grade]) groups[grade] = []
      groups[grade].push(ws)
    })
    return groups
  }, [filteredWorksheets])
  const scrollTo = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Printable Reading Comprehension Worksheets for Kids (PDF)"
        description="Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3."
        canonicalUrl="https://wizqo.com/worksheets/reading-comprehension"
      />
      <UnifiedNavigation currentPage="printables" />
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
      {/* Structured data: Breadcrumbs + WebPage + FAQ */}
      {(() => {
        const canonical = "https://wizqo.com/worksheets/reading-comprehension";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/worksheets/2nd-grade-math-worksheets" },
            { "@type": "ListItem", position: 3, name: "Reading Comprehension", item: "https://wizqo.com/worksheets/reading-comprehension" }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Free Printable Reading Comprehension Worksheets for Kids (PDF)",
          url: "https://wizqo.com/worksheets/reading-comprehension",
          description: "Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3.",
          breadcrumb: { "@id": breadcrumbId }
        } as const;
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I download the worksheets as PDF?",
              acceptedAnswer: { "@type": "Answer", text: "Open a worksheet link to the print view, then use your browser’s Print → Save as PDF." }
            },
            {
              "@type": "Question",
              name: "Can I use these in class?",
              acceptedAnswer: { "@type": "Answer", text: "Yes—free for personal and classroom use." }
            },
            {
              "@type": "Question",
              name: "What skills do these build?",
              acceptedAnswer: { "@type": "Answer", text: "Finding details, main idea, sequence, vocabulary in context, and light inference." }
            }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}

      <main className="bg-gradient-to-b from-purple-50/70 via-white to-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                ✨ Free reading comprehension worksheets • G1-G3 passages free PDF
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free Printable Reading Comprehension Worksheets
                <span className="block text-purple-600">Fun passages with questions and answer keys for grades 1–3.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Fun and engaging passages with questions, answers, and print‑ready PDFs. Ideal for Grades 1–3 and at‑home practice.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <button onClick={() => scrollTo('grade-1')} className="px-3 py-1.5 rounded-full border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 font-medium">Grade 1</button>
                <button onClick={() => scrollTo('grade-2')} className="px-3 py-1.5 rounded-full border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 font-medium">Grade 2</button>
                <button onClick={() => scrollTo('grade-3')} className="px-3 py-1.5 rounded-full border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 font-medium">Grade 3</button>
              </div>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        {/* What's Inside + Pack Builder */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">What’s Inside</h2>
          <p className="text-slate-700 text-sm mt-1 max-w-3xl">
            Free printable reading comprehension worksheets (PDF) with answer keys — short reading
            passages with questions and answers for Grades 1–3. Topics include main idea, details,
            sequencing, and vocabulary in context. Open the print view to save as PDF.
          </p>
          <div className="mt-4">
            <BuildPackReadingInline />
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={READING_CATEGORIES}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
                title="Filter by Grade"
              />
            </div>
          </aside>

          {/* Right side - Worksheets grouped by grade */}
          <div className="space-y-8">
            {Object.entries(groupedWorksheets).map(([grade, worksheets]) => {
          const gradeLabels: Record<string, { title: string; description: string; id: string }> = {
            'Grade 1': {
              title: 'Grade 1 Reading Comprehension Worksheets (Free Printable PDF)',
              description: 'Short, decodable passages with picture‑supported questions and an answer key. Focus: who/what/where, sequence, and one inference. Great for early readers and ESL.',
              id: 'grade-1',
            },
            'Grade 2': {
              title: 'Grade 2 Reading Comprehension Worksheets (with Answer Key, PDF)',
              description: 'One‑paragraph passages with who/what/why, sequence, and vocabulary in context. Printable worksheets with answer key included — ideal for homework, centers, and small groups.',
              id: 'grade-2',
            },
            'Grade 3': {
              title: 'Grade 3 Reading Comprehension — Short Passages with Questions and Answers (PDF)',
              description: 'Longer passages with main idea, supporting details, and a simple inference or conclusion. Free printable worksheets (PDF) with answer key — reading practice for 3rd grade.',
              id: 'grade-3',
            },
          }
          const gradeInfo = gradeLabels[grade] || { title: grade, description: '', id: grade.toLowerCase().replace(' ', '-') }
          
          return (
            <section key={grade} id={gradeInfo.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-xl font-bold text-slate-900">{gradeInfo.title}</h2>
              <p className="text-slate-700 text-sm mt-1">{gradeInfo.description}</p>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {worksheets.map((ws) => {
                  // Use WorksheetThumbnailCard for all items
                  if (ws.docId) {
                    return (
                      <WorksheetThumbnailCard
                        key={ws.docId}
                        title={ws.title}
                        description={ws.description}
                        href={ws.href}
                        docId={ws.docId}
                      />
                    )
                  } else {
                    // Fallback to ItemCard for items without docId
                    return (
                      <ItemCard
                        key={ws.href}
                        title={ws.title}
                        description={ws.description}
                        href={ws.href}
                      />
                    )
                  }
                })}
              </div>
            </section>
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
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
            <li><a className="hover:underline" href="/kids">Kids Hub – Games</a></li>
            <li><a className="hover:underline" href="/worksheets/1st-grade-math-worksheets">1st Grade Math Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/2nd-grade-math-worksheets">2nd Grade Math Worksheets</a></li>
          </ul>
        </section>

        {/* FAQs (match accordion UI used elsewhere) */}
        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">How do I download the worksheets as PDF?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Open a worksheet link to the print view, then use your browser's Print → Save as PDF.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">Can I use these in class?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes—free for personal and classroom use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">What skills do these build?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Finding details, main idea, sequence, vocabulary in context, and light inference.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4';
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
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
  );
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

function BuildPackReadingInline() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 print:hidden">
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Print Pack</div>
      <p className="text-slate-700 text-sm mb-3 max-w-3xl">Create a quick reading comprehension set — short passages with questions and answer keys.</p>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm text-slate-600">Time
          <select id="rcp-time" className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" defaultValue="5">
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">Grade
          <select id="rcp-grade" className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" defaultValue="g1">
            <option value="g1">Grade 1</option>
            <option value="g2">Grade 2</option>
            <option value="35">Grade 3</option>
          </select>
        </label>
        <div className="text-sm text-slate-600">Focus <span className="font-medium ml-2">Reading</span></div>
        <button
          onClick={() => {
            try {
              const tSel = document.getElementById('rcp-time') as HTMLSelectElement | null;
              const gSel = document.getElementById('rcp-grade') as HTMLSelectElement | null;
              const t = (tSel?.value || '5').trim();
              const g = (gSel?.value || 'g1').trim();
              const url = `/print?doc=pack&time=${encodeURIComponent(t)}&age=${encodeURIComponent(g)}&skill=reading&from=reading-comprehension`;
              window.location.href = url;
            } catch {}
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Build Pack →
        </button>
      </div>
    </div>
  );
}
