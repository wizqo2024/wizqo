import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'

export default function MultiplicationWorksheetsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Multiplication Worksheets - Printable PDFs with Answer Keys | Wizqo"
        description="Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, 4th grade, and 5th grade! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency. No sign-up required!"
        keywords="multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"
        canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/multiplication-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
            { "@type": "ListItem", position: 3, name: "Multiplication Worksheets", item: "https://wizqo.com/worksheets/multiplication-worksheets" }
          ]
        } as const;
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Are multiplication worksheets free to download?", acceptedAnswer: { "@type": "Answer", text: "Yes! All multiplication worksheets are completely free. Generate unlimited unique multiplication worksheets, download as PDFs, and print as many copies as you need. No sign-up required." } },
            { "@type": "Question", name: "What grade levels are multiplication worksheets available for?", acceptedAnswer: { "@type": "Answer", text: "Our multiplication worksheets are perfect for 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with multiplication facts, arrays, and word problems." } },
            { "@type": "Question", name: "Do multiplication worksheets include answer keys?", acceptedAnswer: { "@type": "Answer", text: "Yes! Every multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents." } },
            { "@type": "Question", name: "What multiplication skills are covered?", acceptedAnswer: { "@type": "Answer", text: "Our multiplication worksheets cover multiplication facts, arrays, multiplication word problems, fact fluency, and visual multiplication models. Perfect for building confidence and mastering multiplication skills." } }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation currentPage="worksheets" />
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
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Free Multiplication Worksheets (Printable PDFs)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">
            Free multiplication worksheets for 2nd grade, 3rd grade, 4th grade, and 5th grade—multiplication facts, arrays, word problems, and visual models you can print and use at home or in class. Download as PDF with answer keys included.
          </p>
        </header>

        <section>
          <div className="text-slate-800 font-semibold mb-1">What's Inside</div>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build multiplication fluency with focused practice: multiplication facts 1-12, visual arrays, skip counting patterns, multiplication word problems, and fact families. Each worksheet is one page, easy to print, and designed for quick daily practice with answer keys included.
          </p>
          <div className="mt-4">
            <BuildPackInline />
          </div>
        </section>

        {/* 2nd & 3rd Grade Multiplication Worksheets */}
        <section>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 2nd & 3rd Grade Multiplication</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="✖️ Basic Multiplication Facts (1-5)" description="Practice multiplication facts 1×1 through 5×5 with visual arrays and number sentences." href="/print?doc=multiplication-facts-1-5&from=multiplication" docId="multiplication-facts-1-5" />
                <WorksheetThumbnailCard title="📊 Multiplication Arrays (2-5)" description="Draw arrays to solve multiplication problems; understand multiplication as repeated addition." href="/print?doc=multiplication-arrays-2-5&from=multiplication" docId="multiplication-arrays-2-5" />
                <WorksheetThumbnailCard title="➡️ Skip Counting by 2s, 3s, 5s" description="Practice skip counting patterns to build multiplication foundation." href="/print?doc=skip-count-multiplication&from=multiplication" docId="skip-count-multiplication" />
                <WorksheetThumbnailCard title="✖️ Multiplication Tables (1-10)" description="Fill in multiplication tables to memorize basic facts." href="/print?doc=multiplication-tables-1-10&from=multiplication" docId="multiplication-tables-1-10" />
                <WorksheetThumbnailCard title="🧮 Multiplication Word Problems (2nd-3rd)" description="Solve simple multiplication word problems with pictures and number sentences." href="/print?doc=multiplication-word-problems-g2&from=multiplication" docId="multiplication-word-problems-g2" />
                <WorksheetThumbnailCard title="🎯 Doubles Multiplication" description="Practice multiplying by 2 using doubles facts and visual models." href="/print?doc=doubles-multiplication&from=multiplication" docId="doubles-multiplication" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ 3rd & 4th Grade Multiplication</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="✖️ Multiplication Facts (6-10)" description="Master multiplication facts 6×6 through 10×10 with timed practice." href="/print?doc=multiplication-facts-6-10&from=multiplication" docId="multiplication-facts-6-10" />
                <WorksheetThumbnailCard title="📊 Advanced Arrays (6-12)" description="Create and solve multiplication problems using larger arrays." href="/print?doc=multiplication-arrays-6-12&from=multiplication" docId="multiplication-arrays-6-12" />
                <WorksheetThumbnailCard title="✖️ Multiplication Tables (1-12)" description="Complete full multiplication tables from 1 to 12 for fact fluency." href="/print?doc=multiplication-tables-1-12&from=multiplication" docId="multiplication-tables-1-12" />
                <WorksheetThumbnailCard title="🧮 Multiplication Word Problems (3rd-4th)" description="Solve multi-step multiplication word problems with real-world scenarios." href="/print?doc=multiplication-word-problems-g3&from=multiplication" docId="multiplication-word-problems-g3" />
                <WorksheetThumbnailCard title="⚖️ Fact Families (Multiplication & Division)" description="Complete multiplication and division fact families to understand inverse operations." href="/print?doc=multiplication-fact-families&from=multiplication" docId="multiplication-fact-families" />
                <WorksheetThumbnailCard title="🔢 Missing Factors" description="Find the missing number in multiplication equations; build algebraic thinking." href="/print?doc=missing-factors&from=multiplication" docId="missing-factors" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🚀 4th & 5th Grade Multiplication</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="✖️ Multi-Digit Multiplication (2×1)" description="Multiply 2-digit numbers by 1-digit numbers with regrouping." href="/print?doc=multi-digit-multiply-2x1&from=multiplication" docId="multi-digit-multiply-2x1" />
                <WorksheetThumbnailCard title="✖️ Multi-Digit Multiplication (2×2)" description="Multiply 2-digit numbers by 2-digit numbers using standard algorithm." href="/print?doc=multi-digit-multiply-2x2&from=multiplication" docId="multi-digit-multiply-2x2" />
                <WorksheetThumbnailCard title="✖️ Multi-Digit Multiplication (3×1)" description="Multiply 3-digit numbers by 1-digit numbers with step-by-step practice." href="/print?doc=multi-digit-multiply-3x1&from=multiplication" docId="multi-digit-multiply-3x1" />
                <WorksheetThumbnailCard title="🧮 Advanced Word Problems (4th-5th)" description="Solve complex multiplication word problems with multiple steps and real-world contexts." href="/print?doc=multiplication-word-problems-g4&from=multiplication" docId="multiplication-word-problems-g4" />
                <WorksheetThumbnailCard title="📊 Area Model Multiplication" description="Use area models to visualize and solve multi-digit multiplication problems." href="/print?doc=area-model-multiplication&from=multiplication" docId="area-model-multiplication" />
                <WorksheetThumbnailCard title="⚡ Multiplication Properties" description="Practice commutative, associative, and distributive properties of multiplication." href="/print?doc=multiplication-properties&from=multiplication" docId="multiplication-properties" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🎯 Multiplication Fluency & Drills</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="⏱️ Timed Multiplication Drills (1-5)" description="Build speed and accuracy with timed multiplication fact practice." href="/print?doc=timed-multiplication-1-5&from=multiplication" docId="timed-multiplication-1-5" />
                <WorksheetThumbnailCard title="⏱️ Timed Multiplication Drills (6-10)" description="Advanced timed drills for multiplication facts 6 through 10." href="/print?doc=timed-multiplication-6-10&from=multiplication" docId="timed-multiplication-6-10" />
                <WorksheetThumbnailCard title="⏱️ Timed Multiplication Drills (1-12)" description="Complete timed drills covering all multiplication facts 1-12." href="/print?doc=timed-multiplication-1-12&from=multiplication" docId="timed-multiplication-1-12" />
                <WorksheetThumbnailCard title="🔢 Mixed Multiplication Review" description="Mixed practice with all multiplication facts for comprehensive review." href="/print?doc=mixed-multiplication-review&from=multiplication" docId="mixed-multiplication-review" />
                <WorksheetThumbnailCard title="🎯 Multiplication Strategies" description="Learn and practice different multiplication strategies (skip counting, arrays, repeated addition)." href="/print?doc=multiplication-strategies&from=multiplication" docId="multiplication-strategies" />
                <WorksheetThumbnailCard title="📈 Multiplication Patterns" description="Identify and extend multiplication patterns and number sequences." href="/print?doc=multiplication-patterns&from=multiplication" docId="multiplication-patterns" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="text-slate-800 font-semibold mb-2">FAQs</div>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">Are multiplication worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All multiplication worksheets are completely free. Generate unlimited unique multiplication worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What grade levels are multiplication worksheets available for?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our multiplication worksheets are perfect for 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with multiplication facts, arrays, and word problems.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do multiplication worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">What multiplication skills are covered?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our multiplication worksheets cover multiplication facts, arrays, multiplication word problems, fact fluency, multi-digit multiplication, and visual multiplication models. Perfect for building confidence and mastering multiplication skills.
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
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            👁️ Click to preview full worksheet
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
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            ⬇️ Download
          </a>
          <button
            onClick={() => window.open(href, '_blank')}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
          >
            👁️ Preview
          </button>
        </div>
      </div>
    </article>
  )
}

function BuildPackInline() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="text-base font-semibold text-slate-900 mb-1">🧰 Build a 5‑Minute Print Pack</div>
      <p className="text-slate-700 text-sm mb-3">Create a quick multiplication practice set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 2nd-5th Grade</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Multiplication</span>
      </div>
      <a href="/interactive-worksheets-generator?grade=g2&categories=math" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'multiplication'});} catch{} }}>Build Pack →</a>
    </div>
  )
}
