import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'

export default function WorksheetsSecondGradePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="2nd Grade Math Worksheets – Free Printable PDF"
        description="Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF."
        canonicalUrl="https://wizqo.com/worksheets/2nd-grade-math-worksheets"
      />
      <UnifiedNavigation currentPage="blog" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">2nd Grade Math Worksheets (Free Printables)</h1>
          <p className="text-slate-700 mt-3 text-sm max-w-3xl">
            Free 2nd grade math worksheets—number sense, addition/subtraction to 100, ten‑frames, skip counting, and word‑problem warmups you can print and use at home or in class. Download as PDF.
          </p>
          <div className="mt-4">
            <a href="/print?doc=pack&time=5&age=k2&skill=mixed" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">Download 5‑Minute Pack →</a>
          </div>
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">What’s Inside</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build fluency with focused practice: place value (tens/ones), ten‑frames, number lines, addition and subtraction within 20, and attention‑boosting puzzles. Each worksheet is one page, easy to print, and designed for quick daily practice.
          </p>
        </section>

        {/* Utility card component */}
        <section>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 Number Sense</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔟 Ten Frames 1–20" description="Color counters to build numbers; develop subitizing and number bonds." href="/print?doc=ten-frames-1-20" />
                <ItemCard title="✏️ Number Tracing 1–20" description="Trace numbers 1–20 with start points and big writing space." href="/print?doc=number-tracing-1-20" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">➕➖ Addition & Subtraction</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="➕ Add/Sub within 10" description="No‑prep practice with number lines and picture cues." href="/print?doc=addition-subtraction-0-10" />
                <ItemCard title="🧮 Math Maze" description="Solve simple equations to find a path from start to finish." href="/print?doc=math-maze" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ Fluency Boosters</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔢 Skip Counting (Dot‑to‑Dot 1–20)" description="Connect the dots to reveal a picture while you skip count." href="/print?doc=dot-to-dot-1-20" />
                <ItemCard title="🔟 Ten Frames 1–10" description="Quick subitizing warm‑ups; fill counters to match numbers 1–10." href="/print?doc=ten-frames-1-10" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 Focus & Logic</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🧩 Logic Grid" description="Read clues and deduce the correct matches." href="/print?doc=logic-grid" />
                <ItemCard title="🌀 Maze of Focus" description="Follow a sequence through distractions from START to FINISH." href="/print?doc=maze-focus" />
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
function ItemCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className={CARD_CLASS}>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      <div className="mt-3">
        <a href={href} className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors">Open printable view →</a>
      </div>
    </div>
  )
}
