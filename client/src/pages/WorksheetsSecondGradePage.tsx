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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">2nd Grade Math Worksheets</h1>
          <p className="text-slate-600 mt-2 text-sm">Print these kid‑friendly activities. Use your browser’s Print → Save as PDF to download.</p>
        </header>

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
