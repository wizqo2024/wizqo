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
                <WorksheetThumbnailCard title="✖️ Multiplication Mastery (2nd-3rd)" description="Practice multiplication facts, arrays, and multiplication word problems. Perfect for building foundational multiplication skills." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="📊 Multiplication Arrays" description="Draw arrays to solve multiplication problems; understand multiplication as repeated addition with visual models." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="✖️ Basic Multiplication Facts" description="Practice multiplication facts 1×1 through 5×5 with visual arrays and number sentences." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="🧮 Multiplication Word Problems" description="Solve simple multiplication word problems with pictures and number sentences for 2nd and 3rd graders." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">⚡ 3rd & 4th Grade Multiplication</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="✖️ Advanced Multiplication Facts" description="Master multiplication facts 6×6 through 12×12 with timed practice and fact fluency drills." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="📊 Multiplication Arrays & Models" description="Create and solve multiplication problems using larger arrays and visual models." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="🧮 Multi-Step Word Problems" description="Solve multi-step multiplication word problems with real-world scenarios for 3rd and 4th graders." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="⚖️ Fact Families" description="Complete multiplication and division fact families to understand inverse operations." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🚀 4th & 5th Grade Multiplication</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="✖️ Multi-Digit Multiplication" description="Multiply 2-digit and 3-digit numbers using standard algorithm and area models." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="📊 Area Model Multiplication" description="Use area models to visualize and solve multi-digit multiplication problems." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="🧮 Complex Word Problems" description="Solve complex multiplication word problems with multiple steps and real-world contexts for 4th and 5th graders." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="⚡ Multiplication Properties" description="Practice commutative, associative, and distributive properties of multiplication." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">🎯 Multiplication Fluency & Practice</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <WorksheetThumbnailCard title="⏱️ Multiplication Fact Fluency" description="Build speed and accuracy with multiplication fact practice covering all facts 1-12." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="🔢 Mixed Multiplication Review" description="Mixed practice with all multiplication facts for comprehensive review and mastery." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="🎯 Multiplication Strategies" description="Learn and practice different multiplication strategies (skip counting, arrays, repeated addition)." href="/interactive-worksheets-generator?grade=g2&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
                <WorksheetThumbnailCard title="📈 Multiplication Patterns" description="Identify and extend multiplication patterns and number sequences." href="/interactive-worksheets-generator?grade=35&categories=math&worksheet=multiplication" docId="interactive-math-multiplication" />
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
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      
      {/* Worksheet Preview Placeholder */}
      <div 
        className="relative w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
        onClick={() => window.open(href, '_blank')}
        style={{ 
          height: '140px',
          aspectRatio: '2.5/1',
        }}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">✖️</div>
          <div className="text-sm font-semibold text-purple-700">Multiplication Worksheets</div>
          <div className="text-xs text-purple-600 mt-1">Click to generate & download</div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            👁️ Click to open generator
          </div>
        </div>
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
            🚀 Generate Worksheets
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
