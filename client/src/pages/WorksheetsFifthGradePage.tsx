import React, { useState, useMemo } from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { CategoryFilter, type Category } from '@/components/CategoryFilter'
import { trackCategoryFilter } from '@/utils/analytics'

const FIFTH_GRADE_CATEGORIES: Category[] = [
  { id: 'operations', label: 'Advanced Operations', icon: '🔢' },
  { id: 'fractions-decimals', label: 'Fractions & Decimals', icon: '🍕' },
  { id: 'algebra', label: 'Algebra Basics', icon: '📐' },
  { id: 'geometry', label: 'Geometry', icon: '📐' },
  { id: 'word-problems', label: 'Word Problems', icon: '🧮' },
  { id: 'data-analysis', label: 'Data & Analysis', icon: '📊' },
]

interface WorksheetItem {
  title: string
  description: string
  href: string
  docId: string
  categories: string[]
  section?: string
}

// Define all worksheets with their categories - unique 5th Grade content
const FIFTH_GRADE_WORKSHEETS: WorksheetItem[] = [
    // Advanced Operations
    { title: '🔢 Multi-Digit Multiplication (3×2)', description: 'Multiply 3-digit numbers by 2-digit numbers. Master the standard algorithm.', href: '/print?doc=mult-3x2-digit&from=5th-grade', docId: 'mult-3x2-digit', categories: ['operations'], section: 'Advanced Operations' },
    { title: '🔢 Long Division (Multi-Digit)', description: 'Divide multi-digit numbers by 2 and 3-digit divisors. Advanced long division practice.', href: '/print?doc=long-division-multidigit&from=5th-grade', docId: 'long-division-multidigit', categories: ['operations'], section: 'Advanced Operations' },
    { title: '🔢 Order of Operations', description: 'Solve expressions using PEMDAS (parentheses, exponents, multiplication, division, addition, subtraction).', href: '/print?doc=order-of-operations&from=5th-grade', docId: 'order-of-operations', categories: ['operations'], section: 'Advanced Operations' },
    { title: '🔢 Powers of 10', description: 'Multiply and divide by powers of 10. Understand place value relationships.', href: '/print?doc=powers-of-10&from=5th-grade', docId: 'powers-of-10', categories: ['operations'], section: 'Advanced Operations' },
    { title: '🔢 Rounding Decimals', description: 'Round decimals to the nearest whole number, tenth, or hundredth. Master decimal place value.', href: '/print?doc=rounding-decimals&from=5th-grade', docId: 'rounding-decimals', categories: ['operations', 'fractions-decimals'], section: 'Advanced Operations' },
    { title: '🔢 Estimating Sums & Differences', description: 'Estimate sums and differences of whole numbers and decimals. Build number sense.', href: '/print?doc=estimating-sums-differences&from=5th-grade', docId: 'estimating-sums-differences', categories: ['operations'], section: 'Advanced Operations' },
    // Fractions & Decimals
    { title: '🍕 Adding & Subtracting Mixed Numbers', description: 'Add and subtract mixed numbers with like and unlike denominators. Regroup when needed.', href: '/print?doc=add-sub-mixed-numbers&from=5th-grade', docId: 'add-sub-mixed-numbers', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Multiplying Fractions', description: 'Multiply fractions by fractions and whole numbers. Simplify your answers.', href: '/print?doc=multiplying-fractions&from=5th-grade', docId: 'multiplying-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Dividing Fractions', description: 'Divide fractions by fractions and whole numbers. Use the "keep, change, flip" method.', href: '/print?doc=dividing-fractions&from=5th-grade', docId: 'dividing-fractions', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Multiplying Decimals', description: 'Multiply decimals by whole numbers and decimals. Count decimal places in your answer.', href: '/print?doc=multiplying-decimals&from=5th-grade', docId: 'multiplying-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Dividing Decimals', description: 'Divide decimals by whole numbers and decimals. Move decimal points correctly.', href: '/print?doc=dividing-decimals&from=5th-grade', docId: 'dividing-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Fractions, Decimals, & Percents', description: 'Convert between fractions, decimals, and percents. Understand all three forms.', href: '/print?doc=fractions-decimals-percents&from=5th-grade', docId: 'fractions-decimals-percents', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    { title: '🍕 Comparing & Ordering Fractions/Decimals', description: 'Compare and order fractions and decimals. Use common denominators or convert to decimals.', href: '/print?doc=comparing-ordering-fractions-decimals&from=5th-grade', docId: 'comparing-ordering-fractions-decimals', categories: ['fractions-decimals'], section: 'Fractions & Decimals' },
    // Algebra Basics
    { title: '📐 Evaluating Expressions', description: 'Substitute values for variables and evaluate expressions. Practice order of operations.', href: '/print?doc=evaluating-expressions&from=5th-grade', docId: 'evaluating-expressions', categories: ['algebra'], section: 'Algebra Basics' },
    { title: '📐 Writing Expressions', description: 'Write algebraic expressions from word phrases. Understand variables and operations.', href: '/print?doc=writing-expressions&from=5th-grade', docId: 'writing-expressions', categories: ['algebra'], section: 'Algebra Basics' },
    { title: '📐 Solving One-Step Equations', description: 'Solve equations with addition, subtraction, multiplication, or division. Find the value of x.', href: '/print?doc=solving-one-step-equations&from=5th-grade', docId: 'solving-one-step-equations', categories: ['algebra'], section: 'Algebra Basics' },
    { title: '📐 Patterns & Rules', description: 'Identify patterns and write rules. Extend number patterns and sequences.', href: '/print?doc=patterns-rules&from=5th-grade', docId: 'patterns-rules', categories: ['algebra'], section: 'Algebra Basics' },
    { title: '📐 Coordinate Graphing', description: 'Plot points on a coordinate plane. Understand x and y coordinates.', href: '/print?doc=coordinate-graphing&from=5th-grade', docId: 'coordinate-graphing', categories: ['algebra', 'geometry'], section: 'Algebra Basics' },
    // Geometry
    { title: '📐 Volume of Rectangular Prisms', description: 'Find volume using the formula V = l × w × h. Count unit cubes.', href: '/print?doc=volume-rectangular-prisms&from=5th-grade', docId: 'volume-rectangular-prisms', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Area of Triangles & Parallelograms', description: 'Find area using formulas. Understand base and height relationships.', href: '/print?doc=area-triangles-parallelograms&from=5th-grade', docId: 'area-triangles-parallelograms', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Classifying 2D & 3D Shapes', description: 'Identify and classify polygons and polyhedra. Understand shape properties.', href: '/print?doc=classifying-shapes&from=5th-grade', docId: 'classifying-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Nets of 3D Shapes', description: 'Identify nets that form 3D shapes. Visualize spatial relationships.', href: '/print?doc=nets-3d-shapes&from=5th-grade', docId: 'nets-3d-shapes', categories: ['geometry'], section: 'Geometry' },
    { title: '📐 Transformations', description: 'Understand translations, rotations, and reflections. Apply transformations to shapes.', href: '/print?doc=transformations-5th&from=5th-grade', docId: 'transformations-5th', categories: ['geometry'], section: 'Geometry' },
    // Word Problems
    { title: '🧮 Multi-Step Word Problems', description: 'Solve complex word problems with 4 or more steps. Show all your work and reasoning.', href: '/print?doc=multi-step-word-5th&from=5th-grade', docId: 'multi-step-word-5th', categories: ['word-problems'], section: 'Word Problems' },
    { title: '🧮 Fraction Word Problems', description: 'Solve word problems involving adding, subtracting, multiplying, and dividing fractions.', href: '/print?doc=fraction-word-problems-5th&from=5th-grade', docId: 'fraction-word-problems-5th', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: '🧮 Decimal Word Problems', description: 'Solve word problems involving decimal operations. Money, measurement, and real-world applications.', href: '/print?doc=decimal-word-problems-5th&from=5th-grade', docId: 'decimal-word-problems-5th', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    { title: '🧮 Ratio & Proportion Word Problems', description: 'Solve problems involving ratios and proportions. Understand relationships between quantities.', href: '/print?doc=ratio-proportion-word-problems&from=5th-grade', docId: 'ratio-proportion-word-problems', categories: ['word-problems'], section: 'Word Problems' },
    { title: '🧮 Percent Word Problems', description: 'Solve problems involving percents. Find percentages, discounts, and tax.', href: '/print?doc=percent-word-problems&from=5th-grade', docId: 'percent-word-problems', categories: ['word-problems', 'fractions-decimals'], section: 'Word Problems' },
    // Data & Analysis
    { title: '📊 Line Graphs', description: 'Create and interpret line graphs. Understand trends and changes over time.', href: '/print?doc=line-graphs&from=5th-grade', docId: 'line-graphs', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: '📊 Mean, Median, Mode, Range', description: 'Calculate mean, median, mode, and range. Understand measures of central tendency and spread.', href: '/print?doc=mean-median-mode-range&from=5th-grade', docId: 'mean-median-mode-range', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: '📊 Stem-and-Leaf Plots', description: 'Create and interpret stem-and-leaf plots. Organize and analyze data.', href: '/print?doc=stem-leaf-plots&from=5th-grade', docId: 'stem-leaf-plots', categories: ['data-analysis'], section: 'Data & Analysis' },
    { title: '📊 Probability', description: 'Understand probability. Calculate simple probabilities and use fractions to express likelihood.', href: '/print?doc=probability&from=5th-grade', docId: 'probability', categories: ['data-analysis'], section: 'Data & Analysis' },
]

export default function WorksheetsFifthGradePage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      const isSelecting = !next.has(categoryId)
      if (isSelecting) {
        next.add(categoryId)
        trackCategoryFilter(categoryId, 'select', '5th-grade-math-worksheets')
      } else {
        next.delete(categoryId)
        trackCategoryFilter(categoryId, 'deselect', '5th-grade-math-worksheets')
      }
      return next
    })
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  // Filter worksheets based on selected categories
  const filteredWorksheets = useMemo(() => {
    if (selectedCategories.size === 0) return FIFTH_GRADE_WORKSHEETS
    return FIFTH_GRADE_WORKSHEETS.filter((ws) => 
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
        title="5th Grade Math Worksheets – Free Printable PDF"
        description="Free 5th grade math worksheets covering advanced multiplication, division, fractions, decimals, and algebra basics. Download printable PDF worksheets with answer keys for comprehensive math practice."
        keywords="5th grade math worksheets, fifth grade math worksheets, free 5th grade math worksheets PDF, printable math worksheets grade 5, multiplication worksheets 5th grade, division worksheets 5th grade, fractions worksheets 5th grade, decimals worksheets 5th grade, algebra worksheets 5th grade, geometry worksheets 5th grade"
        canonicalUrl="https://wizqo.com/worksheets/5th-grade-math-worksheets"
      />
      {(() => {
        const canonical = "https://wizqo.com/worksheets/5th-grade-math-worksheets";
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "5th Grade Math Worksheets", item: canonical }
          ]
        } as const;
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "5th Grade Math Worksheets – Free Printable PDF",
          url: canonical,
          description: "Free 5th grade math worksheets covering advanced multiplication, division, fractions, decimals, and algebra basics.",
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
                ✨ Free 5th grade math worksheets • Advanced math free PDF
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Free 5th Grade Math Worksheets
                <span className="block text-purple-600">Printable PDFs with answer keys for comprehensive practice.</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                Free 5th grade math worksheets covering advanced multiplication, division, fractions, decimals, and algebra basics. Download printable PDF worksheets with answer keys for comprehensive math practice.
              </p>
            </div>
          </div>
        </section>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What's Inside</h2>
          <p className="text-slate-700 text-sm max-w-3xl">
            Build 5th grade math mastery with focused practice: multi-digit operations, fractions and decimals (all operations), algebra basics (expressions, equations), geometry (volume, area, transformations), multi-step word problems, and data analysis (graphs, probability). Each worksheet is one page, easy to print, and designed for quick daily practice with answer keys included.
          </p>
          <div className="mt-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="text-slate-900 font-semibold mb-1">🧰 Build a 5‑Minute Print Pack</div>
              <p className="text-slate-700 text-sm mb-3">Create a quick 5th grade math set — perfect for warm‑ups, brain breaks, or homework helpers.</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Time: 5 min</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Age/Grade: 5th Grade</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Focus: Math</span>
              </div>
              <a href="/print?doc=pack&time=5&age=g5&skill=math&from=5th-grade" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={(e)=>{ try { (window as any).gtag?.('event','build_pack_click',{grade:'5'});} catch{} }}>Build Pack →</a>
            </div>
          </div>
        </section>

        {/* Main content with sidebar layout */}
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sidebar - Category Filter */}
          <aside className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <CategoryFilter
                categories={FIFTH_GRADE_CATEGORIES}
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
                'Advanced Operations': '🔢 Advanced Operations',
                'Fractions & Decimals': '🍕 Fractions & Decimals',
                'Algebra Basics': '📐 Algebra Basics',
                'Geometry': '📐 Geometry',
                'Word Problems': '🧮 Word Problems',
                'Data & Analysis': '📊 Data & Analysis',
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

        {/* Explore More Worksheets */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900">Explore More Worksheets</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-purple-700">
            <li><a className="hover:underline" href="/worksheets/4th-grade-math-worksheets">4th Grade Math Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/3rd-grade-math-worksheets">3rd Grade Math Worksheets – Printable</a></li>
            <li><a className="hover:underline" href="/worksheets/multiplication-worksheets">Multiplication Worksheets – Free PDF</a></li>
            <li><a className="hover:underline" href="/worksheets/times-table-multiplication-worksheets">Times Table Multiplication Worksheets</a></li>
            <li><a className="hover:underline" href="/worksheets/reading-comprehension">Reading Comprehension Worksheets</a></li>
            <li><a className="hover:underline" href="/printables">Printable Fun Learning Activities</a></li>
          </ul>
        </section>

        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4">Are 5th grade math worksheets free to download?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! All 5th grade math worksheets are completely free. Generate unlimited unique worksheets, download as PDFs, and print as many copies as you need. No sign-up required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4">What skills do 5th grade math worksheets cover?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Our 5th grade worksheets cover multi-digit operations, fractions and decimals (all operations), algebra basics (expressions, equations, coordinate graphing), geometry (volume, area, transformations), multi-step word problems, and data analysis (graphs, probability, statistics).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4">Do 5th grade worksheets include answer keys?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Every 5th grade worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4">Are these worksheets suitable for 4th graders who are advanced?</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                Yes! Advanced 4th graders can use our 5th grade worksheets to challenge themselves. Start with simpler operations and progress to more complex topics like algebra and advanced geometry as skills develop.
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
