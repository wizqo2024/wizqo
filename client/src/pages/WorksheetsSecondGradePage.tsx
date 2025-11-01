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
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">2nd Grade Math Worksheets (Free Printables)</h1>
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

        {/* Utility card component */}
        <section>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 Number Sense</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔟 Place Value (Tens/Ones) to 99" description="Break numbers into tens and ones; compare and build numbers." href="/print?doc=place-value-hto" />
                <ItemCard title="➡️ Skip Counting by 5s/10s to 120" description="Count on using number charts and dot‑paths to reach 120." href="/print?doc=skip-count-5-10-120" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">➕➖ Addition & Subtraction</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="➕ 2‑Digit Addition (No Regrouping)" description="Practice adding two 2‑digit numbers within 100 (no carry)." href="/print?doc=add-2digit-100" />
                <ItemCard title="➖ 2‑Digit Subtraction (No Regrouping)" description="Subtract within 100 using number lines and base‑ten models." href="/print?doc=sub-2digit-100" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ Fluency Boosters</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="📊 Compare 2‑Digit Numbers" description="Use >, <, = to compare numbers; explain using tens and ones." href="/print?doc=compare-2digit" />
                <ItemCard title="🧮 2nd‑Grade Word Problems" description="Mixed add/sub word problems within 100 (no regrouping)." href="/print?doc=word-problems-100" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 Focus & Logic</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ItemCard title="🔢 Even/Odd Sorting (to 100)" description="Sort numbers into even and odd; explain patterns you notice." href="/print?doc=even-odd-100" />
                <ItemCard title="🕒 Time to 5 Minutes" description="Read times to the nearest 5 minutes; draw hands to match." href="/print?doc=time-5min" />
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
              const url = `/print?doc=pack&time=${encodeURIComponent(v)}&age=g2&skill=math`;
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
