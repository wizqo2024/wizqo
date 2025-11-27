import React from 'react'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'
import { Footer } from '@/components/Footer'
import { SEOMetaTags } from '@/components/SEOMetaTags'
import { useTranslation } from '@/context/TranslationContext'

interface CategoryCard {
  title: string
  description: string
  href: string
  iconType: string
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
      iconType: 'kindergarten',
      gradeRange: 'Kindergarten',
      badge: 'Early Learning'
    },
    {
      title: '1st Grade Math Worksheets',
      description: 'Ten-frames, add/sub free PDF',
      href: '/worksheets/1st-grade-math-worksheets',
      iconType: 'first-grade',
      gradeRange: '1st Grade',
      badge: 'Foundations'
    },
    {
      title: '2nd Grade Math Worksheets',
      description: 'Place value, add/sub free PDF',
      href: '/worksheets/2nd-grade-math-worksheets',
      iconType: 'second-grade',
      gradeRange: '2nd Grade',
      badge: 'Building Skills'
    },
    {
      title: '3rd Grade Math Worksheets',
      description: 'Fractions, division, word problems free PDF',
      href: '/worksheets/3rd-grade-math-worksheets',
      iconType: 'third-grade',
      gradeRange: '3rd Grade',
      badge: 'Growing Strong'
    },
    {
      title: '4th Grade Math Worksheets',
      description: 'Decimals, geometry, measurement free PDF',
      href: '/worksheets/4th-grade-math-worksheets',
      iconType: 'fourth-grade',
      gradeRange: '4th Grade',
      badge: 'Mastering Concepts'
    },
    {
      title: '5th Grade Math Worksheets',
      description: 'Algebra, advanced operations free PDF',
      href: '/worksheets/5th-grade-math-worksheets',
      iconType: 'fifth-grade',
      gradeRange: '5th Grade',
      badge: 'Advanced'
    },
    // Multiplication Focus
    {
      title: 'Multiplication Worksheets',
      description: '2nd-5th grade free PDF',
      href: '/worksheets/multiplication-worksheets',
      iconType: 'multiplication',
      gradeRange: '2nd-5th',
      badge: 'Popular'
    },
    {
      title: 'Times Table Multiplication Worksheets',
      description: '1-12 tables, confidence building free PDF',
      href: '/worksheets/times-table-multiplication-worksheets',
      iconType: 'times-table',
      gradeRange: '1st-5th',
      badge: 'Essential'
    },
    // Specialized Math
    {
      title: 'Converting Fractions to Decimals Worksheets',
      description: '3rd-5th grade free PDF',
      href: '/worksheets/fractions-to-decimals-worksheets',
      iconType: 'fractions',
      gradeRange: '3rd-5th',
      badge: 'Specialized'
    },
    {
      title: 'Order of Operations Worksheets (PEMDAS)',
      description: '4th-6th grade free PDF',
      href: '/worksheets/order-of-operations-worksheets',
      iconType: 'operations',
      gradeRange: '4th-6th',
      badge: 'Advanced'
    },
    // Reading & Language
    {
      title: 'Reading Comprehension Worksheets',
      description: 'G1-G3 passages free PDF',
      href: '/worksheets/reading-comprehension',
      iconType: 'reading',
      gradeRange: '1st-3rd',
      badge: 'Language Arts'
    },
    // Creative Tools
    {
      title: 'Certificate Maker',
      description: 'Editable name/date',
      href: '/printables/certificate-maker',
      iconType: 'certificate',
      badge: 'Create Something Magical'
    },
    {
      title: 'Name Tracing',
      description: 'Personalized sheets',
      href: '/printables/name-tracing-generator',
      iconType: 'tracing',
      badge: 'Create Something Magical'
    },
    {
      title: 'Handwriting Maker',
      description: 'Letters, words, sentences',
      href: '/worksheets/handwriting-worksheet-maker',
      iconType: 'handwriting',
      badge: 'Create Something Magical'
    },
    // Quick Access
    {
      title: 'Interactive Worksheets Generator',
      description: 'Create custom worksheets instantly',
      href: '/interactive-worksheets-generator',
      iconType: 'generator',
      badge: 'Worksheets & Quick Packs'
    },
    {
      title: 'Printables',
      description: 'Puzzles, coloring, packs',
      href: '/printables',
      iconType: 'printables',
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
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 mb-6 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Every Worksheet You Need, All in One Place
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
      
      {/* Icon & Title */}
      <div className="flex items-start gap-4 mb-3">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 ${getIconBgClass(category.iconType)}`}>
          <CategoryIcon iconType={category.iconType} />
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

// Get background gradient class for icon container
function getIconBgClass(iconType: string): string {
  switch (iconType) {
    case 'kindergarten':
      return 'bg-gradient-to-br from-pink-100 to-rose-200'
    case 'first-grade':
      return 'bg-gradient-to-br from-blue-100 to-cyan-200'
    case 'second-grade':
      return 'bg-gradient-to-br from-green-100 to-emerald-200'
    case 'third-grade':
      return 'bg-gradient-to-br from-yellow-100 to-amber-200'
    case 'fourth-grade':
      return 'bg-gradient-to-br from-purple-100 to-indigo-200'
    case 'fifth-grade':
      return 'bg-gradient-to-br from-orange-100 to-red-200'
    case 'multiplication':
      return 'bg-gradient-to-br from-purple-100 to-pink-200'
    case 'times-table':
      return 'bg-gradient-to-br from-indigo-100 to-purple-200'
    case 'fractions':
      return 'bg-gradient-to-br from-cyan-100 to-blue-200'
    case 'operations':
      return 'bg-gradient-to-br from-teal-100 to-green-200'
    case 'reading':
      return 'bg-gradient-to-br from-emerald-100 to-teal-200'
    case 'certificate':
      return 'bg-gradient-to-br from-yellow-100 to-orange-200'
    case 'tracing':
      return 'bg-gradient-to-br from-pink-100 to-purple-200'
    case 'handwriting':
      return 'bg-gradient-to-br from-blue-100 to-indigo-200'
    case 'generator':
      return 'bg-gradient-to-br from-purple-100 to-pink-200'
    case 'printables':
      return 'bg-gradient-to-br from-amber-100 to-yellow-200'
    default:
      return 'bg-gradient-to-br from-purple-100 to-pink-100'
  }
}

// Category Icon Component
function CategoryIcon({ iconType }: { iconType: string }) {
  const iconClass = "w-6 h-6 sm:w-7 sm:h-7"
  
  const getIconColor = (iconType: string): string => {
    switch (iconType) {
      case 'kindergarten': return 'text-pink-600'
      case 'first-grade': return 'text-blue-600'
      case 'second-grade': return 'text-green-600'
      case 'third-grade': return 'text-yellow-600'
      case 'fourth-grade': return 'text-purple-600'
      case 'fifth-grade': return 'text-orange-600'
      case 'multiplication': return 'text-purple-600'
      case 'times-table': return 'text-indigo-600'
      case 'fractions': return 'text-cyan-600'
      case 'operations': return 'text-teal-600'
      case 'reading': return 'text-emerald-600'
      case 'certificate': return 'text-yellow-600'
      case 'tracing': return 'text-pink-600'
      case 'handwriting': return 'text-blue-600'
      case 'generator': return 'text-purple-600'
      case 'printables': return 'text-amber-600'
      default: return 'text-purple-600'
    }
  }

  switch (iconType) {
    case 'kindergarten':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'first-grade':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'second-grade':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'third-grade':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'fourth-grade':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'fifth-grade':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'multiplication':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'times-table':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    case 'fractions':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    case 'operations':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'reading':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'certificate':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    case 'tracing':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    case 'handwriting':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    case 'generator':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    case 'printables':
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a3 3 0 01-3-3v-2a3 3 0 013-3h14a3 3 0 013 3v2a3 3 0 01-3 3h-1M6 18h12M6 18v-4m12 4v-4" />
        </svg>
      )
    default:
      return (
        <svg className={`${iconClass} ${getIconColor(iconType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}
