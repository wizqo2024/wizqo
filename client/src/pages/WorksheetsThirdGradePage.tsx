import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter } from '@/utils/analytics'

const THIRD_GRADE_CATEGORIES: Category[] = [
  { id: 'multiplication', label: 'Multiplication', icon: '✖️' },
  { id: 'division', label: 'Division', icon: '➗' },
  { id: 'fractions', label: 'Fractions', icon: '🍕' },
  { id: 'word-problems', label: 'Word Problems', icon: '🧮' },
  { id: 'geometry', label: 'Geometry', icon: '📐' },
  { id: 'measurement', label: 'Measurement', icon: '📏' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

// Define all worksheets with their categories - unique 3rd Grade content
const THIRD_GRADE_WORKSHEETS: WorksheetItem[] = [
    // Multiplication
    { title: '✖️ Multiplication Facts 0–12', description: 'Practice all multiplication facts from 0×0 to 12×12. Build speed and accuracy with timed drills.', href: '/print?doc=mult-facts-0-12&from=3rd-grade', docId: 'mult-facts-0-12', categories: ['multiplication'], section: 'Multiplication' },
    { title: '✖️ Multiplication Arrays', description: 'Draw arrays to solve multiplication problems. Understand multiplication as repeated addition.', href: '/print?doc=mult-arrays&from=3rd-grade', docId: 'mult-arrays', categories: ['multiplication'], section: 'Multiplication' },
    { title: '✖️ Multiplication Word Problems', description: 'Solve real-world multiplication problems. Read carefully and show your work.', href: '/print?doc=mult-word-problems&from=3rd-grade', docId: 'mult-word-problems', categories: ['multiplication', 'word-problems'], section: 'Multiplication' },
    { title: '✖️ Multiplying by 10, 100', description: 'Learn the pattern: multiply by 10, 100. Master place value multiplication.', href: '/print?doc=mult-by-10-100&from=3rd-grade', docId: 'mult-by-10-100', categories: ['multiplication'], section: 'Multiplication' },
    { title: '✖️ Properties of Multiplication', description: 'Practice commutative, associative, and distributive properties. Understand number relationships.', href: '/print?doc=mult-properties&from=3rd-grade', docId: 'mult-properties', categories: ['multiplication'], section: 'Multiplication' },
    // Division
    { title: '➗ Division Facts 1–12', description: 'Master division facts from 1÷1 to 144÷12. Build division fluency.', href: '/print?doc=div-facts-1-12&from=3rd-grade', docId: 'div-facts-1-12', categories: ['division'], section: 'Division' },
    { title: '➗ Division with Remainders', description: 'Divide and find the remainder. Practice long division basics.', href: '/print?doc=div-with-remainders&from=3rd-grade', docId: 'div-with-remainders', categories: ['division'], section: 'Division' },
    { title: '➗ Division Word Problems', description: 'Solve division problems in real-world contexts. Show your thinking.', href: '/print?doc=div-word-problems&from=3rd-grade', docId: 'div-word-problems', categories: ['division', 'word-problems'], section: 'Division' },
    { title: '➗ Fact Families (Mult/Div)', description: 'Complete multiplication and division fact families. Understand inverse operations.', href: '/print?doc=fact-families-mult-div&from=3rd-grade', docId: 'fact-families-mult-div', categories: ['division', 'multiplication'], section: 'Division' },
    { title: '➗ Dividing by 10, 100', description: 'Learn the pattern: divide by 10, 100. Master place value division.', href: '/print?doc=div-by-10-100&from=3rd-grade', docId: 'div-by-10-100', categories: ['division'], section: 'Division' },
    // Fractions
    { title: '🍕 Fractions: Parts of a Whole', description: 'Color the fraction shown. Understand fractions as parts of a whole.', href: '/print?doc=fractions-whole&from=3rd-grade', docId: 'fractions-whole', categories: ['fractions'], section: 'Fractions' },
    { title: '🍕 Comparing Fractions', description: 'Compare fractions using >, <, or =. Use visual models to help.', href: '/print?doc=comparing-fractions&from=3rd-grade', docId: 'comparing-fractions', categories: ['fractions'], section: 'Fractions' },
    { title: '🍕 Equivalent Fractions', description: 'Find equivalent fractions. Understand that 1/2 = 2/4 = 4/8.', href: '/print?doc=equivalent-fractions&from=3rd-grade', docId: 'equivalent-fractions', categories: ['fractions'], section: 'Fractions' },
    { title: '🍕 Fractions on a Number Line', description: 'Plot fractions on a number line. Understand fraction placement.', href: '/print?doc=fractions-number-line&from=3rd-grade', docId: 'fractions-number-line', categories: ['fractions'], section: 'Fractions' },
    { title: '🍕 Adding & Subtracting Fractions', description: 'Add and subtract fractions with like denominators. Visual practice included.', href: '/print?doc=add-sub-fractions&from=3rd-grade', docId: 'add-sub-fractions', categories: ['fractions'], section: 'Fractions' },
    // Word Problems
    { title: '🧮 Multi-Step Word Problems', description: 'Solve problems with 2 or 3 steps. Read carefully and show all your work.', href: '/print?doc=multi-step-word-problems&from=3rd-grade', docId: 'multi-step-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: '🧮 Elapsed Time Word Problems', description: 'Solve problems about time. How long did something take?', href: '/print?doc=elapsed-time-word-problems&from=3rd-grade', docId: 'elapsed-time-word-problems', categories: ['word-problems', 'measurement'], section: 'Word Problems' },
    { title: '🧮 Money Word Problems', description: 'Solve problems involving dollars and cents. Practice making change.', href: '/print?doc=money-word-problems&from=3rd-grade', docId: 'money-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: '🧮 Perimeter & Area Word Problems', description: 'Find perimeter and area in real-world situations. Show your calculations.', href: '/print?doc=perimeter-area-word-problems&from=3rd-grade', docId: 'perimeter-area-word-problems', categories: ['word-problems', 'geometry'], section: 'Word Problems' },
    // Geometry
    { title: '📐 Identify Polygons', description: 'Name polygons by number of sides. Triangle, quadrilateral, pentagon, hexagon, etc.', href: '/print?doc=identify-polygons&from=3rd-grade', docId: 'identify-polygons', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Perimeter of Shapes', description: 'Find the perimeter of rectangles, squares, and other polygons. Add all sides.', href: '/print?doc=perimeter-shapes&from=3rd-grade', docId: 'perimeter-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Area of Rectangles', description: 'Find the area by counting squares or multiplying length × width.', href: '/print?doc=area-rectangles&from=3rd-grade', docId: 'area-rectangles', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Lines, Rays, and Angles', description: 'Identify lines, line segments, rays, and angles. Learn geometry vocabulary.', href: '/print?doc=lines-rays-angles&from=3rd-grade', docId: 'lines-rays-angles', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Symmetry', description: 'Find lines of symmetry. Draw the other half of symmetrical shapes.', href: '/print?doc=symmetry&from=3rd-grade', docId: 'symmetry', categories: ['geometry'], section: 'Geometry' },
    // Measurement
    { title: '📏 Time to the Minute', description: 'Read and write time to the nearest minute. Practice elapsed time.', href: '/print?doc=time-to-minute&from=3rd-grade', docId: 'time-to-minute', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Customary Units', description: 'Convert between inches, feet, and yards. Practice measurement conversions.', href: '/print?doc=customary-units&from=3rd-grade', docId: 'customary-units', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Metric Units', description: 'Convert between centimeters, meters, and kilometers. Learn metric system.', href: '/print?doc=metric-units&from=3rd-grade', docId: 'metric-units', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Liquid Measurement', description: 'Compare cups, pints, quarts, and gallons. Understand capacity.', href: '/print?doc=liquid-measurement&from=3rd-grade', docId: 'liquid-measurement', categories: ['measurement'], section: 'Measurement' },
    { title: '📏 Mass and Weight', description: 'Compare ounces, pounds, grams, and kilograms. Understand mass vs. weight.', href: '/print?doc=mass-weight&from=3rd-grade', docId: 'mass-weight', categories: ['measurement'], section: 'Measurement' },
]

export default function WorksheetsThirdGradePage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '3rd-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '3rd-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return THIRD_GRADE_WORKSHEETS
    return THIRD_GRADE_WORKSHEETS.filter((ws) => 
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
        title="3rd Grade Math Worksheets – Free Printable PDF"
        description="Free 3rd grade math worksheets covering advanced multiplication, fractions, division, and multi-step word problems. Printable PDF worksheets with answer keys for comprehensive math practice. Perfect for building problem-solving skills."
        keywords="3rd grade math worksheets, third grade math worksheets, free 3rd grade math worksheets PDF, printable math worksheets grade 3, multiplication worksheets 3rd grade, division worksheets 3rd grade, fractions worksheets 3rd grade, word problems 3rd grade, geometry worksheets 3rd grade"
        canonicalUrl="https://wizqo.com/worksheets/3rd-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/3rd-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "3rd Grade Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "3rd Grade Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free 3rd grade math worksheets covering advanced multiplication, fractions, division, and multi-step word problems.",
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
                ✨ Free 3rd grade math worksheets • Advanced math free PDF
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free 3rd Grade Math Worksheets
                <span className="block text-purple-600">Printable PDFs with answer keys for comprehensive practice.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Free 3rd grade math worksheets covering advanced multiplication, fractions, division, and multi-step word problems. Printable PDF worksheets with answer keys for comprehensive math practice. Perfect for building problem-solving skills.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What's Inside</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build 3rd grade math mastery with focused practice: multiplication facts 0–12, division with remainders, fractions, multi-step word problems, geometry (perimeter & area), and measurement. Each worksheet is one page, easy to print, and designed for quick daily practice with answer keys included.
          </p>
          <div className="mt-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
              <p className="text-slate-700 text-sm mb-3">Create a quick 3rd grade math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 3rd Grade</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
              </div>
              <a href="/print?doc=pack&time=5&age=g3&skill=math&from=3rd-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'3'});} catch{} }}>Build Pack →</a>
            </div>
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={THIRD_GRADE_CATEGORIES}
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
                'Multiplication': '✖️ Multiplication',
                'Division': '➗ Division',
                'Fractions': '🍕 Fractions',
                'Word Problems': '🧮 Word Problems',
                'Geometry': '📐 Geometry',
                'Measurement': '📏 Measurement',
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
              <AccordionTrigger className="px-4">Are 3rd grade math worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All 3rd grade math worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What skills do 3rd grade math worksheets cover?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our 3rd grade worksheets cover multiplication facts 0–12, division with remainders, fractions (parts of a whole, comparing, equivalent), multi-step word problems, geometry (perimeter, area, polygons), and measurement (time, length, capacity, mass).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do 3rd grade worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every 3rd grade worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">Are these worksheets suitable for 2nd graders who are advanced?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Advanced 2nd graders can use our 3rd grade worksheets to challenge themselves. Start with simpler multiplication and division worksheets and progress to more complex topics as skills develop.
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
