import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'

const KINDERGARTEN_CATEGORIES: Category[] = [
  { id: 'counting', label: 'Counting', icon: '🔢' },
  { id: 'number-recognition', label: 'Number Recognition', icon: '🔟' },
  { id: 'shapes-colors', label: 'Shapes & Colors', icon: '🟩' },
  { id: 'patterns', label: 'Patterns', icon: '🧩' },
  { id: 'comparison', label: 'Comparison', icon: '⚖️' },
  { id: 'pre-writing', label: 'Pre-Writing', icon: '✏️' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

export default function WorksheetsKindergartenPage() {
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

  // Define all worksheets with their categories - unique Kindergarten content
  const allWorksheets: WorksheetItem[] = [
    // Counting
    { title: '🔢 Count & Circle 1–10', description: 'Count the objects in each box. Circle the correct number. Perfect for one-to-one correspondence.', href: '/print?doc=count-circle-1-10&from=kindergarten', docId: 'count-circle-1-10', categories: ['counting'], section: 'Counting' },
    { title: '🔢 Count & Match 1–20', description: 'Count the objects and draw a line to match with the correct number. Build number sense.', href: '/print?doc=count-match-1-20&from=kindergarten', docId: 'count-match-1-20', categories: ['counting'], section: 'Counting' },
    { title: '🔢 How Many? (1–15)', description: 'Count how many objects you see. Write the number in the box. Visual counting practice.', href: '/print?doc=how-many-1-15&from=kindergarten', docId: 'how-many-1-15', categories: ['counting'], section: 'Counting' },
    { title: '🔢 Count & Color (1–10)', description: 'Count the objects and color the correct number of items. Fun hands-on practice.', href: '/print?doc=count-color-1-10&from=kindergarten', docId: 'count-color-1-10', categories: ['counting'], section: 'Counting' },
    { title: '🔢 Counting Objects to 20', description: 'Count groups of objects up to 20. Circle the number that tells how many.', href: '/print?doc=counting-objects-20&from=kindergarten', docId: 'counting-objects-20', categories: ['counting'], section: 'Counting' },
    // Number Recognition
    { title: '🔟 Number Identification 1–10', description: 'Find and circle all the number 3s, 5s, etc. Build number recognition skills.', href: '/print?doc=number-id-1-10&from=kindergarten', docId: 'number-id-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: '🔟 Number Tracing 1–10', description: 'Trace each number with your finger or pencil. Follow the arrows. Big writing space.', href: '/print?doc=number-tracing-1-10&from=kindergarten', docId: 'number-tracing-1-10', categories: ['number-recognition', 'pre-writing'], section: 'Number Recognition' },
    { title: '🔟 Number Matching 1–15', description: 'Match the number word to the numeral. Connect with a line. Word recognition practice.', href: '/print?doc=number-matching-1-15&from=kindergarten', docId: 'number-matching-1-15', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: '🔟 Number Order 1–20', description: 'Cut and paste numbers in order from 1 to 20. Sequencing practice.', href: '/print?doc=number-order-1-20&from=kindergarten', docId: 'number-order-1-20', categories: ['number-recognition'], section: 'Number Recognition' },
    { title: '🔟 Find the Number (1–10)', description: 'Look at the number. Find and circle all the matching numbers on the page.', href: '/print?doc=find-number-1-10&from=kindergarten', docId: 'find-number-1-10', categories: ['number-recognition'], section: 'Number Recognition' },
    // Shapes & Colors
    { title: '🟩 Shape Identification', description: 'Circle the circle, square, triangle, and rectangle. Learn basic shapes.', href: '/print?doc=shape-identification&from=kindergarten', docId: 'shape-identification', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: '🟩 Color the Shapes', description: 'Color all circles red, squares blue, triangles yellow. Shape and color practice.', href: '/print?doc=color-shapes&from=kindergarten', docId: 'color-shapes', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: '🟩 Shape Sorting', description: 'Cut out shapes and sort them into groups. Glue each shape in the correct box.', href: '/print?doc=shape-sorting&from=kindergarten', docId: 'shape-sorting', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: '🟩 Color Recognition', description: 'Color the apple red, the sun yellow, the sky blue. Learn color names.', href: '/print?doc=color-recognition&from=kindergarten', docId: 'color-recognition', categories: ['shapes-colors'], section: 'Shapes & Colors' },
    { title: '🟩 Draw the Shape', description: 'Look at the shape name. Draw the shape in the box. Practice drawing skills.', href: '/print?doc=draw-shape&from=kindergarten', docId: 'draw-shape', categories: ['shapes-colors', 'pre-writing'], section: 'Shapes & Colors' },
    // Patterns
    { title: '🧩 AB Pattern Completion', description: 'Look at the pattern. What comes next? Circle or draw the next item. AB patterns.', href: '/print?doc=ab-pattern&from=kindergarten', docId: 'ab-pattern', categories: ['patterns'], section: 'Patterns' },
    { title: '🧩 Color Patterns', description: 'Complete the color pattern. Red, blue, red, blue... What comes next?', href: '/print?doc=color-patterns&from=kindergarten', docId: 'color-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: '🧩 Shape Patterns', description: 'Circle, square, circle, square... Continue the pattern. Draw the next shape.', href: '/print?doc=shape-patterns&from=kindergarten', docId: 'shape-patterns', categories: ['patterns'], section: 'Patterns' },
    { title: '🧩 What Comes Next?', description: 'Look at the pattern. Draw what comes next in each row. Pattern recognition.', href: '/print?doc=what-comes-next&from=kindergarten', docId: 'what-comes-next', categories: ['patterns'], section: 'Patterns' },
    // Comparison
    { title: '⚖️ Big and Small', description: 'Circle the big object. Put an X on the small object. Size comparison practice.', href: '/print?doc=big-small&from=kindergarten', docId: 'big-small', categories: ['comparison'], section: 'Comparison' },
    { title: '⚖️ More and Less', description: 'Count each group. Circle the group that has more. Compare quantities.', href: '/print?doc=more-less&from=kindergarten', docId: 'more-less', categories: ['comparison', 'counting'], section: 'Comparison' },
    { title: '⚖️ Long and Short', description: 'Color the long object red. Color the short object blue. Length comparison.', href: '/print?doc=long-short&from=kindergarten', docId: 'long-short', categories: ['comparison'], section: 'Comparison' },
    { title: '⚖️ Heavy and Light', description: 'Circle the heavy object. Put an X on the light object. Weight comparison.', href: '/print?doc=heavy-light&from=kindergarten', docId: 'heavy-light', categories: ['comparison'], section: 'Comparison' },
    { title: '⚖️ Same and Different', description: 'Find the object that is different. Circle it. Visual discrimination practice.', href: '/print?doc=same-different&from=kindergarten', docId: 'same-different', categories: ['comparison'], section: 'Comparison' },
    // Pre-Writing
    { title: '✏️ Line Tracing', description: 'Trace the lines from left to right. Practice pencil control and fine motor skills.', href: '/print?doc=line-tracing&from=kindergarten', docId: 'line-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: '✏️ Curve Tracing', description: 'Trace the curves and circles. Build hand strength for writing.', href: '/print?doc=curve-tracing&from=kindergarten', docId: 'curve-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: '✏️ Zigzag Lines', description: 'Trace the zigzag lines. Practice different line patterns for writing readiness.', href: '/print?doc=zigzag-lines&from=kindergarten', docId: 'zigzag-lines', categories: ['pre-writing'], section: 'Pre-Writing' },
    { title: '✏️ Path Tracing', description: 'Follow the path from start to finish. Trace the line carefully. Motor skills practice.', href: '/print?doc=path-tracing&from=kindergarten', docId: 'path-tracing', categories: ['pre-writing'], section: 'Pre-Writing' },
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
        title="Kindergarten Math Worksheets – Free Printable PDF"
        description="Free printable kindergarten math worksheets for early learners. Download PDF worksheets covering counting, number recognition, basic shapes, and simple addition. Perfect for building math foundations with answer keys included."
        keywords="kindergarten math worksheets, free kindergarten worksheets, printable kindergarten worksheets, kindergarten counting worksheets, number recognition worksheets, shapes worksheets kindergarten, kindergarten patterns worksheets, free printable kindergarten math worksheets PDF"
        canonicalUrl="https://wizqo.com/worksheets/kindergarten-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/kindergarten-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Kindergarten Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Kindergarten Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free printable kindergarten math worksheets for early learners. Download PDF worksheets covering counting, number recognition, basic shapes, and simple addition.",
          breadcrumb: { "@id": breadcrumbId }
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
          </>
        );
      })()}
      <UnifiedNavigation />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-emerald-50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white to-emerald-50/50" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm">
                ✨ Free kindergarten math worksheets • Pre-K & K free PDF
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free Kindergarten Math Worksheets
                <span className="block text-purple-600">Printable PDFs with answer keys for early learners.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Free printable kindergarten math worksheets for early learners. Download PDF worksheets covering counting, number recognition, basic shapes, and simple addition. Perfect for building math foundations with answer keys included.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What's Inside</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build kindergarten math foundations with focused practice: counting 1–20, number recognition, basic shapes, colors, patterns, and pre-writing skills. Each worksheet is one page, easy to print, and designed for quick daily practice with answer keys included.
          </p>
          <div className="mt-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
              <p className="text-slate-700 text-sm mb-3">Create a quick kindergarten math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: Kindergarten</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
              </div>
              <a href="/print?doc=pack&time=5&age=k&skill=math&from=kindergarten" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'K'});} catch{} }}>Build Pack →</a>
            </div>
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={KINDERGARTEN_CATEGORIES}
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
                'Counting': '🔢 Counting',
                'Number Recognition': '🔟 Number Recognition',
                'Shapes & Colors': '🟩 Shapes & Colors',
                'Patterns': '🧩 Patterns',
                'Comparison': '⚖️ Comparison',
                'Pre-Writing': '✏️ Pre-Writing',
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
              <AccordionTrigger className="px-4">Are kindergarten math worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All kindergarten math worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What skills do kindergarten math worksheets cover?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our kindergarten worksheets cover counting 1–20, number recognition, basic shapes, colors, patterns, comparisons (big/small, more/less), and pre-writing skills. Perfect for building early math foundations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do kindergarten worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every kindergarten worksheet automatically includes a complete answer key, making it easy for parents and teachers to check work quickly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">Are these worksheets suitable for pre-K students?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Many of our kindergarten worksheets are perfect for pre-K students who are ready for early math concepts like counting, shapes, and colors. Start with the simpler worksheets and progress as skills develop.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
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
    <div className={CARD_CLASS}>
      <h3 className="font-semibold text-slate-900 mb-2 text-base">{title}</h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>
      <a href={href} className={BUTTON_CLASS} target="_blank" rel="noopener noreferrer">
        Open Worksheet →
      </a>
    </div>
  )
}
