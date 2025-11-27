import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { useTranslation } from '@/context/TranslationContext'

interface CategoryCard {
  title: string
  description: string
  href: string
  emoji: string
  gradeRange?: string
  badge?: string
}

export default function AllWorksheetsPage() {
  const { t, isRTL } = useTranslation()

  const categories: CategoryCard[] = [
    // Math Worksheets by Grade
    {
      title: 'Kindergarten Math Worksheets',
      description: 'Counting, shapes, patterns free PDF',
      href: '/worksheets/kindergarten-math-worksheets',
      emoji: '🎨',
      gradeRange: 'Kindergarten',
      badge: 'Early Learning'
    },
    {
      title: '1st Grade Math Worksheets',
      description: 'Ten-frames, add/sub free PDF',
      href: '/worksheets/1st-grade-math-worksheets',
      emoji: '🌟',
      gradeRange: '1st Grade',
      badge: 'Foundations'
    },
    {
      title: '2nd Grade Math Worksheets',
      description: 'Place value, add/sub free PDF',
      href: '/worksheets/2nd-grade-math-worksheets',
      emoji: '🚀',
      gradeRange: '2nd Grade',
      badge: 'Building Skills'
    },
    {
      title: '3rd Grade Math Worksheets',
      description: 'Fractions, division, word problems free PDF',
      href: '/worksheets/3rd-grade-math-worksheets',
      emoji: '💪',
      gradeRange: '3rd Grade',
      badge: 'Growing Strong'
    },
    {
      title: '4th Grade Math Worksheets',
      description: 'Decimals, geometry, measurement free PDF',
      href: '/worksheets/4th-grade-math-worksheets',
      emoji: '🎯',
      gradeRange: '4th Grade',
      badge: 'Mastering Concepts'
    },
    {
      title: '5th Grade Math Worksheets',
      description: 'Algebra, advanced operations free PDF',
      href: '/worksheets/5th-grade-math-worksheets',
      emoji: '🏆',
      gradeRange: '5th Grade',
      badge: 'Advanced'
    },
    // Multiplication Focus
    {
      title: 'Multiplication Worksheets',
      description: '2nd-5th grade free PDF',
      href: '/worksheets/multiplication-worksheets',
      emoji: '✖️',
      gradeRange: '2nd-5th',
      badge: 'Popular'
    },
    {
      title: 'Times Table Multiplication Worksheets',
      description: '1-12 tables, confidence building free PDF',
      href: '/worksheets/times-table-multiplication-worksheets',
      emoji: '📊',
      gradeRange: '1st-5th',
      badge: 'Essential'
    },
    // Specialized Math
    {
      title: 'Converting Fractions to Decimals Worksheets',
      description: '3rd-5th grade free PDF',
      href: '/worksheets/fractions-to-decimals-worksheets',
      emoji: '🔢',
      gradeRange: '3rd-5th',
      badge: 'Specialized'
    },
    {
      title: 'Order of Operations Worksheets (PEMDAS)',
      description: '4th-6th grade free PDF',
      href: '/worksheets/order-of-operations-worksheets',
      emoji: '🧮',
      gradeRange: '4th-6th',
      badge: 'Advanced'
    },
    // Reading & Language
    {
      title: 'Reading Comprehension Worksheets',
      description: 'G1-G3 passages free PDF',
      href: '/worksheets/reading-comprehension',
      emoji: '📚',
      gradeRange: '1st-3rd',
      badge: 'Language Arts'
    },
    // Creative Tools
    {
      title: 'Certificate Maker',
      description: 'Editable name/date',
      href: '/printables/certificate-maker',
      emoji: '🏅',
      badge: 'Create Something Magical'
    },
    {
      title: 'Name Tracing',
      description: 'Personalized sheets',
      href: '/printables/name-tracing-generator',
      emoji: '✍️',
      badge: 'Create Something Magical'
    },
    {
      title: 'Handwriting Maker',
      description: 'Letters, words, sentences',
      href: '/worksheets/handwriting-worksheet-maker',
      emoji: '🖋️',
      badge: 'Create Something Magical'
    },
    // Quick Access
    {
      title: 'Interactive Worksheets Generator',
      description: 'Create custom worksheets instantly',
      href: '/interactive-worksheets-generator',
      emoji: '✨',
      badge: 'Worksheets & Quick Packs'
    },
    {
      title: 'Printables',
      description: 'Puzzles, coloring, packs',
      href: '/printables',
      emoji: '🎁',
      badge: 'Worksheets & Quick Packs'
    }
  ]

  // Group categories by type
  const mathByGrade = categories.filter(c => c.gradeRange && ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'].includes(c.gradeRange))
  const multiplication = categories.filter(c => c.title.includes('Multiplication'))
  const specializedMath = categories.filter(c => ['Converting Fractions to Decimals', 'Order of Operations'].some(t => c.title.includes(t)))
  const reading = categories.filter(c => c.title.includes('Reading'))
  const creativeTools = categories.filter(c => c.badge === 'Create Something Magical')
  const quickAccess = categories.filter(c => c.badge === 'Worksheets & Quick Packs')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOMetaTags
        title="All Worksheet Categories - Discover Every Learning Tool | Wizqo"
        description="Explore our complete collection of free worksheet categories! From kindergarten math to 5th grade, multiplication practice to reading comprehension—find the perfect worksheets to inspire and empower every learner. 100% free, ready to print."
        keywords="worksheet categories, browse worksheets, all worksheet types, worksheet directory, worksheets by grade, worksheets by subject, complete worksheet list, free worksheet categories, math worksheets by grade, reading worksheets, handwriting worksheets"
        canonicalUrl="https://wizqo.com/worksheets/all"
      />
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
          { "@type": "ListItem", position: 2, name: "All Worksheets", item: "https://wizqo.com/worksheets/all" }
        ]
      }) }} />

      <UnifiedNavigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 mb-6 text-sm font-medium">
                <span className="animate-pulse">✨</span> Every Worksheet You Need, All in One Place
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                All Worksheet Categories
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 text-white/90">
                  Discover Every Learning Tool
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
                From kindergarten math to 5th grade mastery, multiplication practice to reading comprehension—find the perfect worksheets to inspire and empower every learner. <span className="font-semibold">100% free, ready to print.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          
          {/* Math by Grade */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Math Worksheets by Grade</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mathByGrade.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

          {/* Multiplication Focus */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Multiplication Mastery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {multiplication.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

          {/* Specialized Math */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Specialized Math Topics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {specializedMath.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

          {/* Reading & Language */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Reading & Language Arts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {reading.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

          {/* Create Something Magical */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Create Something Magical</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {creativeTools.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

          {/* Quick Access */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Worksheets & Quick Packs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {quickAccess.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </section>

        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-t border-purple-100">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
              Use our Interactive Worksheets Generator to create custom worksheets tailored to your exact needs. Generate unlimited unique worksheets with answer keys included.
            </p>
            <a
              href="/interactive-worksheets-generator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>✨</span>
              Create Custom Worksheets
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Category Card Component
function CategoryCard({ category }: { category: CategoryCard }) {
  return (
    <a
      href={category.href}
      className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-300 p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
    >
      {/* Badge */}
      {category.badge && (
        <span className="inline-block text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full mb-3 w-fit">
          {category.badge}
        </span>
      )}
      
      {/* Emoji & Title */}
      <div className="flex items-start gap-4 mb-3">
        <div className="text-4xl sm:text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {category.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
            {category.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed flex-1">
        {category.description}
      </p>

      {/* Grade Range */}
      {category.gradeRange && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-4">
          <span className="font-medium">Grade:</span>
          <span className="px-2 py-1 bg-slate-100 rounded-full">{category.gradeRange}</span>
        </div>
      )}

      {/* Arrow */}
      <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
        <span>Explore</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      {/* Hover gradient effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-300 pointer-events-none"></div>
    </a>
  )
}
