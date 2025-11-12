import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { WorksheetThumbnailCard } from '@/components/WorksheetThumbnailCard'

export default function WorksheetsFirstGradePage() {
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
            <a href="/print?doc=pack&time=5&age=g1&skill=math" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'1'});} catch{} }}>Build Pack →</a>
          </div>
        </section>

        <section>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 Number Sense</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <WorksheetThumbnailCard title="🔟 Ten Frames 1–10" description="Color counters to build numbers 1–10; develop subitizing and number bonds." href="/print?doc=ten-frames-1-10" docId="ten-frames-1-10" />
                <WorksheetThumbnailCard title="✏️ Number Tracing 1–20" description="Trace numbers 1–20 with start points and big writing space." href="/print?doc=number-tracing-1-20" docId="number-tracing-1-20" />
                <WorksheetThumbnailCard title="🔢 Number Bonds to 10" description="Complete number bonds showing parts that make 10; build fact fluency." href="/print?doc=number-bonds-10" docId="number-bonds-10" />
                <WorksheetThumbnailCard title="📊 Count & Write 1–30" description="Count objects and write the number; practice one-to-one correspondence." href="/print?doc=count-write-30" docId="count-write-30" />
                <WorksheetThumbnailCard title="🔍 Missing Numbers 1–50" description="Fill in missing numbers on number lines; practice sequencing." href="/print?doc=missing-numbers-50" docId="missing-numbers-50" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">➕➖ Addition & Subtraction</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <WorksheetThumbnailCard title="➕ Add/Sub within 10" description="No‑prep practice with number lines and picture cues." href="/print?doc=addition-subtraction-0-10" docId="addition-subtraction-0-10" />
                <WorksheetThumbnailCard title="🧮 Math Maze (Within 18)" description="Solve simple equations to find a path from start to finish." href="/print?doc=math-maze" docId="math-maze" />
                <WorksheetThumbnailCard title="➕ Picture Addition to 10" description="Count pictures and add them together; visual math practice." href="/print?doc=picture-addition-10" docId="picture-addition-10" />
                <WorksheetThumbnailCard title="➖ Subtraction Stories" description="Solve subtraction problems using picture stories and number lines." href="/print?doc=subtraction-stories" docId="subtraction-stories" />
                <WorksheetThumbnailCard title="⚖️ Balance Equations (to 10)" description="Find missing numbers to balance addition and subtraction equations." href="/print?doc=balance-equations-10" docId="balance-equations-10" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ Fluency Boosters</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <WorksheetThumbnailCard title="🔢 Dot‑to‑Dot 1–20" description="Connect the dots to reveal a picture while you count to 20." href="/print?doc=dot-to-dot-1-20" docId="dot-to-dot-1-20" />
                <WorksheetThumbnailCard title="🎨 Color‑by‑Number (1–4)" description="Follow the key to color simple scenes; practice number recognition." href="/print?doc=color-by-number" docId="color-by-number" />
                <WorksheetThumbnailCard title="➡️ Skip Counting by 2s" description="Practice counting by 2s from 2 to 20; build pattern recognition." href="/print?doc=skip-count-2s" docId="skip-count-2s" />
                <WorksheetThumbnailCard title="🔢 Number Line Addition" description="Use number lines to solve addition problems within 15." href="/print?doc=number-line-add" docId="number-line-add" />
                <WorksheetThumbnailCard title="🎯 Doubles Facts Practice" description="Master doubles (1+1, 2+2, etc.) with fun visual activities." href="/print?doc=doubles-facts" docId="doubles-facts" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 Focus & Logic</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <WorksheetThumbnailCard title="👀 Spot‑the‑Difference (7)" description="Find differences to build attention and visual scanning." href="/print?doc=spot-difference" docId="spot-difference" />
                <WorksheetThumbnailCard title="🟩 Shapes & Colors Sort" description="Cut, sort, and glue basic shapes by color; early math + fine motor." href="/print?doc=shapes-colors-sort" docId="shapes-colors-sort" />
                <WorksheetThumbnailCard title="🧩 Pattern Completion" description="Complete AB, ABC, and AAB patterns using shapes and colors." href="/print?doc=pattern-complete" docId="pattern-complete" />
                <WorksheetThumbnailCard title="🔍 Find the Missing Shape" description="Identify which shape comes next in a sequence; logic practice." href="/print?doc=missing-shape" docId="missing-shape" />
                <WorksheetThumbnailCard title="📏 Size Comparison" description="Compare objects by size (big/small, long/short); measurement basics." href="/print?doc=size-comparison" docId="size-comparison" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="text-slate-800 font-semibold mb-2">FAQs</div>
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

