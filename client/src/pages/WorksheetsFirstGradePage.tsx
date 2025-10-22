import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'

export default function WorksheetsFirstGradePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="1st Grade Math Worksheets – Free Printable PDF"
        description="Free 1st grade math worksheets covering number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF."
        canonicalUrl="https://wizqo.com/worksheets/1st-grade-math-worksheets"
      />
      <UnifiedNavigation currentPage="blog" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">1st Grade Math Worksheets (Free Printables)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">
            Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes you can print and use at home or in class. Download as PDF.
          </p>
          <div className="mt-4">
            <a href="/print?doc=pack&time=5&age=k2&skill=mixed" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">Download 5‑Minute Pack →</a>
          </div>
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">What’s Inside</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build early fluency with focused practice: ten‑frames, number tracing, addition and subtraction within 10, skip counting, and shape/logic warm‑ups. Each worksheet is one page—easy to print and use for daily practice.
          </p>
        </section>

        <section>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 Number Sense</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔟 Ten Frames 1–10" description="Color counters to build numbers 1–10; develop subitizing and number bonds." href="/print?doc=ten-frames-1-10" />
                <ItemCard title="✏️ Number Tracing 1–20" description="Trace numbers 1–20 with start points and big writing space." href="/print?doc=number-tracing-1-20" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">➕➖ Addition & Subtraction</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="➕ Add/Sub within 10" description="No‑prep practice with number lines and picture cues." href="/print?doc=addition-subtraction-0-10" />
                <ItemCard title="🧮 Math Maze (Within 18)" description="Solve simple equations to find a path from start to finish." href="/print?doc=math-maze" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ Fluency Boosters</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔢 Dot‑to‑Dot 1–20" description="Connect the dots to reveal a picture while you count to 20." href="/print?doc=dot-to-dot-1-20" />
                <ItemCard title="🟩 Shapes & Colors Sort" description="Cut, sort, and glue basic shapes by color; early math + fine motor skills." href="/print?doc=shapes-colors-sort" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 Focus & Logic</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔢 Ten Frames 1–20" description="Quick warm‑ups; fill counters to match numbers 1–20." href="/print?doc=ten-frames-1-20" />
                <ItemCard title="🧲 Even or Odd? (to 100)" description="Mark each number as even or odd; look for patterns." href="/print?doc=even-odd-100" />
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
