import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedNavigation } from './UnifiedNavigation';
import { Footer } from './Footer';
import GradientText from './GradientText';
import AnimatedIcon from './AnimatedIcon';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslation } from '@/context/TranslationContext';

interface LandingPageProps {
  onNavigateToGenerate: () => void;
}

export function LandingPage({ onNavigateToGenerate }: LandingPageProps) {
  const { t, language, isRTL } = useTranslation()
  // Force re-render when language changes
  React.useEffect(() => {}, [language])
  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wizqo",
    "url": "https://wizqo.com",
    "logo": "https://wizqo.com/og-image.jpg",
    "description": "AI-powered worksheet generator and learning tools. Create personalized worksheets for math, reading, writing, and more.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://wizqo.com/contact"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wizqo",
    "url": "https://wizqo.com",
    "description": "Free interactive worksheets and AI-powered learning tools for teachers and parents",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wizqo.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I create free printable worksheets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our Interactive Worksheets Generator to create unlimited unique worksheets for math, reading, writing, science, and more. Select your grade level and subjects, then generate and download PDFs instantly with answer keys included."
        }
      },
      {
        "@type": "Question",
        "name": "Are the worksheets free to download?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All worksheets are completely free. Generate unlimited worksheets, download as PDFs, and print as many copies as you need. No sign-up required for basic access."
        }
      },
      {
        "@type": "Question",
        "name": "What subjects are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer worksheets for Math, Reading, Writing, Science, Social Studies, Art & Coloring, Critical Thinking, and more. Worksheets are available for Preschool, K-1, 2nd-3rd, 4th-5th, and Middle School grade levels."
        }
      },
      {
        "@type": "Question",
        "name": "Do worksheets include answer keys?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every worksheet automatically includes a printable answer key appendix, making grading quick and easy for teachers and parents."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wizqo.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Math Worksheets",
        "item": "https://wizqo.com/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Kindergarten Math Worksheets",
        "item": "https://wizqo.com/worksheets/kindergarten-math-worksheets"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "1st Grade Math Worksheets",
        "item": "https://wizqo.com/worksheets/1st-grade-math-worksheets"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "2nd Grade Math Worksheets",
        "item": "https://wizqo.com/worksheets/2nd-grade-math-worksheets"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "3rd Grade Math Worksheets",
        "item": "https://wizqo.com/worksheets/3rd-grade-math-worksheets"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "4th Grade Math Worksheets",
        "item": "https://wizqo.com/worksheets/4th-grade-math-worksheets"
      },
      {
        "@type": "ListItem",
        "position": 8,
        "name": "5th Grade Math Worksheets",
        "item": "https://wizqo.com/worksheets/5th-grade-math-worksheets"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      {/* Unified Navigation */}
      <UnifiedNavigation currentPage="home" />

      {/* Hero Section - Modern Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Trendy Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium"><span aria-hidden="true">✨</span> {t('home.hero.badge')}</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
              <GradientText 
                colors={['#a855f7', '#ec4899', '#8b5cf6', '#f472b6', '#a855f7']}
                animationSpeed={8}
              >
                {t('home.hero.headline')}
              </GradientText>
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              {t('home.hero.subheading')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 sm:mb-16 px-4">
              <a 
                href="/worksheets/multiplication-worksheets"
                className="inline-flex items-center gap-2 justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <DotLottieReact
                    src="https://lottie.host/765d5fff-4a5e-4cb5-a3a1-91f5413be22e/tpoLOKOFhP.json"
                    loop
                    autoplay
                    className="w-full h-full"
                  />
                </div>
                🔥 {t('home.hero.ctaMultiplication')}
              </a>
              <a 
                href="/interactive-worksheets-generator"
                className="inline-flex items-center gap-2 justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                {t('home.hero.ctaBrowse')}
              </a>
            </div>
            {/* Above-the-fold internal links to worksheets (SEO-safe) - Card Layout */}
            <nav aria-label="Popular worksheets" className="px-4 sm:px-0 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
                <a 
                  href="/worksheets/kindergarten-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-3xl">👶</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Kindergarten Math</h3>
                    <p className="text-xs text-gray-600">Counting, shapes, patterns</p>
                  </div>
                </a>
                <a 
                  href="/worksheets/1st-grade-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <AnimatedIcon
                        animationUrl="https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json"
                        className="w-full h-full"
                        fallback={
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        }
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">1st Grade Math</h3>
                    <p className="text-xs text-gray-600">Addition, subtraction, counting</p>
                  </div>
                </a>
                <a 
                  href="/worksheets/2nd-grade-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <AnimatedIcon
                        animationUrl="https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json"
                        className="w-full h-full"
                        fallback={
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        }
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">2nd Grade Math</h3>
                    <p className="text-xs text-gray-600">Multiplication, division, word problems</p>
                  </div>
                </a>
                <a 
                  href="/worksheets/3rd-grade-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-3xl">3️⃣</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">3rd Grade Math</h3>
                    <p className="text-xs text-gray-600">Fractions, division, word problems</p>
                  </div>
                </a>
                <a 
                  href="/worksheets/4th-grade-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-3xl">4️⃣</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">4th Grade Math</h3>
                    <p className="text-xs text-gray-600">Decimals, geometry, measurement</p>
                  </div>
                </a>
                <a 
                  href="/worksheets/5th-grade-math-worksheets" 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-3xl">5️⃣</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">5th Grade Math</h3>
                    <p className="text-xs text-gray-600">Algebra, advanced operations</p>
                  </div>
                </a>
              </div>
            </nav>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 text-gray-200 px-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white/60"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full border-2 border-white/60"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full border-2 border-white/60"></div>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{t('home.features.lovedBy')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="whitespace-nowrap">{t('home.features.printableAwards')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="whitespace-nowrap">{t('home.features.allGrades')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300" aria-label="Math worksheets example">
            <span className="text-2xl" aria-hidden="true">🔢</span>
            <p className="text-white text-sm mt-1">Math</p>
          </div>
        </div>
        <div className="absolute top-1/3 right-16 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-300" aria-label="Reading worksheets example">
            <span className="text-2xl" aria-hidden="true">📖</span>
            <p className="text-white text-sm mt-1">Reading</p>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-6 hover:rotate-12 transition-transform duration-300" aria-label="Writing worksheets example">
            <span className="text-2xl" aria-hidden="true">✍️</span>
            <p className="text-white text-sm mt-1">Writing</p>
          </div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-6 hover:-rotate-12 transition-transform duration-300" aria-label="Science worksheets example">
            <span className="text-2xl" aria-hidden="true">🔬</span>
            <p className="text-white text-sm mt-1">Science</p>
          </div>
        </div>
      </section>

      {/* Kids Hub Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">{t('home.kidsHub.title')}</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {t('home.kidsHub.description')}
              </p>
              <ul className="text-slate-700 text-sm space-y-1 mb-5 list-disc list-inside">
                <li><span aria-hidden="true">🃏</span> {t('home.kidsHub.features')}</li>
                <li><span aria-hidden="true">🖨️</span> {t('home.kidsHub.printables')}</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <a href="/kids" className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">{t('home.kidsHub.visitKidsHub')}</a>
                <a href="/interactive-worksheets-generator" className="inline-flex items-center px-4 py-2 rounded-lg border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"><span aria-hidden="true">📚</span> {t('home.kidsHub.interactiveWorksheets')}</a>
              </div>
            </div>
            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden">
              <div className="absolute top-2 left-4">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform rotate-6 hover:-rotate-2 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">🃏</div>
                  <p className="text-slate-800 text-sm mt-1">Memory</p>
                </div>
              </div>
              <div className="absolute top-6 right-12">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform -rotate-6 hover:-rotate-1 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">🔤</div>
                  <p className="text-slate-800 text-sm mt-1">Word Search</p>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/4">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform rotate-3 hover:rotate-0 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">🧩</div>
                  <p className="text-slate-800 text-sm mt-1">Puzzle</p>
                </div>
              </div>
              <div className="absolute bottom-6 right-32">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform -rotate-3 hover:rotate-0 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">⌨️</div>
                  <p className="text-slate-800 text-sm mt-1">Typing</p>
                </div>
              </div>
              {/* Added: Floating Printables & Coloring cards with extra spacing */}
              <div className="absolute top-24 right-40 hidden sm:block">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform rotate-2 hover:-rotate-1 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">🖨️</div>
                  <p className="text-slate-800 text-sm mt-1">Printables</p>
                </div>
              </div>
              <div className="absolute top-40 right-10 hidden sm:block">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-300/60 rounded-2xl p-4 shadow-lg transform -rotate-2 hover:rotate-0 hover:-translate-y-1 transition">
                  <div className="text-2xl" aria-hidden="true">🖍️</div>
                  <p className="text-slate-800 text-sm mt-1">Coloring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🌟</div>
              <h3 className="text-lg font-semibold text-slate-900">{t('home.trust.lovedBy.title')}</h3>
              <p className="mt-2 text-sm text-slate-600">{t('home.trust.lovedBy.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🖨️</div>
              <h3 className="text-lg font-semibold text-slate-900">{t('home.trust.printableLibrary.title')}</h3>
              <p className="mt-2 text-sm text-slate-600">{t('home.trust.printableLibrary.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🤖</div>
              <h3 className="text-lg font-semibold text-slate-900">{t('home.trust.aiGenerator.title')}</h3>
              <p className="mt-2 text-sm text-slate-600">{t('home.trust.aiGenerator.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🎯</div>
              <h3 className="text-lg font-semibold text-slate-900">{t('home.trust.freshActivities.title')}</h3>
              <p className="mt-2 text-sm text-slate-600">{t('home.trust.freshActivities.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Worksheets by Grade Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              {t('home.grades.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {t('home.grades.subtitle')}
            </p>
          </div>
          
          {/* Grade-Specific H2 Sections with SEO Content */}
          <div className="space-y-16 mb-16">
            {/* 1st Grade Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.firstGrade.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.firstGrade.description')}
              </p>
              <a 
                href="/worksheets/1st-grade-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                {t('home.grades.firstGrade.cta')}
              </a>
            </div>

            {/* 2nd Grade Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.secondGrade.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.secondGrade.description')}
              </p>
              <a 
                href="/worksheets/2nd-grade-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
              >
                {t('home.grades.secondGrade.cta')}
              </a>
            </div>

            {/* Kindergarten Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.kindergarten.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.kindergarten.description')}
              </p>
              <a 
                href="/worksheets/kindergarten-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
              >
                {t('home.grades.kindergarten.cta')}
              </a>
            </div>

            {/* 3rd Grade Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.thirdGrade.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.thirdGrade.description')}
              </p>
              <a 
                href="/worksheets/3rd-grade-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-700 transition-all"
              >
                {t('home.grades.thirdGrade.cta')}
              </a>
            </div>

            {/* 4th Grade Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.fourthGrade.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.fourthGrade.description')}
              </p>
              <a 
                href="/worksheets/4th-grade-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
              >
                {t('home.grades.fourthGrade.cta')}
              </a>
            </div>

            {/* 5th Grade Math Worksheets H2 */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-100">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t('home.grades.fifthGrade.title')}</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('home.grades.fifthGrade.description')}
              </p>
              <a 
                href="/worksheets/5th-grade-math-worksheets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
              >
                {t('home.grades.fifthGrade.cta')}
              </a>
            </div>
          </div>
          
          {/* Grade Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <a 
              href="/worksheets/kindergarten-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">👶</div>
              <h3 className="font-bold text-slate-900 mb-2">Kindergarten Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free printable kindergarten math worksheets with answer keys</p>
            </a>
            <a 
              href="/worksheets/1st-grade-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">1️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">1st Grade Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free 1st grade math worksheets PDF with answer keys</p>
            </a>
            <a 
              href="/worksheets/2nd-grade-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">2️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">2nd Grade Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free multiplication worksheets for 2nd grade with answer keys</p>
            </a>
            <a 
              href="/worksheets/3rd-grade-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:border-yellow-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">3️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">3rd Grade Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free 3rd grade math worksheets PDF with answer keys</p>
            </a>
            <a 
              href="/worksheets/4th-grade-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 hover:border-teal-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">4️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">4th Grade Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free 4th grade math worksheets PDF with answer keys</p>
            </a>
            <a 
              href="/worksheets/5th-grade-math-worksheets"
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 hover:border-indigo-200 hover:shadow-md transition-all block"
            >
              <div className="text-4xl mb-4" aria-hidden="true">5️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">5th Grade Math Worksheets</h3>
              <p className="text-slate-600 text-sm">Free 5th grade math worksheets PDF with answer keys</p>
            </a>
          </div>
          
          {/* Multiplication Worksheets Highlight Section */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-8 mb-12 border-2 border-purple-200">
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4">
                {t('home.grades.multiplicationHighlight.title')} 🔥
              </h3>
              <p className="text-lg text-slate-700 mb-6 max-w-3xl mx-auto">
                {t('home.grades.multiplicationHighlight.description')}
              </p>
              <a 
                href="/worksheets/multiplication-worksheets" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('home.grades.multiplicationHighlight.cta')}
              </a>
            </div>
          </div>

          {/* Subject Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2" aria-hidden="true">🔢</div>
              <h4 className="font-semibold text-slate-900 text-sm">Math Worksheets</h4>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2" aria-hidden="true">📖</div>
              <h4 className="font-semibold text-slate-900 text-sm">Reading Worksheets</h4>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2" aria-hidden="true">✍️</div>
              <h4 className="font-semibold text-slate-900 text-sm">Writing Worksheets</h4>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2" aria-hidden="true">🔬</div>
              <h4 className="font-semibold text-slate-900 text-sm">Science Worksheets</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Wizqo Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              {t('home.whyChoose.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t('home.whyChoose.subtitle')}
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">🖨️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.printablePDFs.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.printablePDFs.description')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">✅</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.answerKeys.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.answerKeys.description')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.allGrades.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.allGrades.description')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">🚀</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.generateUnlimited.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.generateUnlimited.description')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">💯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.free.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.free.description')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.trustedByTeachers.title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('home.whyChoose.trustedByTeachers.description')}</p>
            </div>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* AI Personalization - Large Card */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl" aria-hidden="true">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.whyChoose.aiGenerator.title')}</h3>
                <p className="text-slate-700 text-base leading-relaxed mb-6">
                  {t('home.whyChoose.aiGenerator.description')}
                </p>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Grade Level: K-5</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Subjects: Math, Reading, Writing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Answer Keys: Included</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grade Levels Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl" aria-hidden="true">📚</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">All Grade Levels Covered</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Worksheets available for every grade from Kindergarten through 5th grade. Perfect for classroom use, homework, or extra practice.
                </p>
                <div className="grid grid-cols-5 gap-2 mt-6">
                  {['K', '1st', '2nd', '3rd', '4th-5th'].map((grade) => (
                    <div key={grade} className="px-3 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                      {grade}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Progress Tracking */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xl" aria-hidden="true">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Answer Keys Included</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Every worksheet comes with a complete answer key, making grading quick and easy for teachers and parents.
                </p>
                <div className="mt-4 bg-white/60 rounded-lg p-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
            
            {/* Community */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-30"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xl" aria-hidden="true">👥</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted by Teachers</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Used by thousands of teachers and parents worldwide. High-quality worksheets that align with educational standards.
                </p>
                <div className="flex -space-x-2 mt-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-600">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Wizqo Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1: Choose Grade & Subject */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl" aria-hidden="true">🎯</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 text-sm">
                      <span aria-hidden="true">🔢</span> Math
                      <span aria-hidden="true">📖</span> Reading
                    </div>
                    <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 text-sm">
                      <span aria-hidden="true">✍️</span> Writing
                      <span aria-hidden="true">🔬</span> Science
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('home.howItWorks.step1.description')}
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {t('home.howItWorks.step1.time')}
              </div>
            </div>

            {/* Step 2: Generate Worksheets */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl" aria-hidden="true">🤖</span>
                  </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="flex items-center mb-2 text-sm">
                  <div className="w-3 h-1 bg-blue-400 rounded mr-2"></div>
                  <div className="w-6 h-1 bg-blue-400 rounded mr-2"></div>
                  <div className="w-4 h-1 bg-blue-300 rounded"></div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-1 bg-blue-300 rounded mr-2"></div>
                  <div className="w-5 h-1 bg-blue-400 rounded"></div>
                </div>
              </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('home.howItWorks.step2.description')}
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {t('home.howItWorks.step2.poweredBy')}
              </div>
            </div>

            {/* Step 3: Download & Print */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">🖨️</span>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">PDF Ready</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-lg" aria-hidden="true">📄</span>
                      <span className="ml-2 text-xs text-slate-600">Answer Key Included</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('home.howItWorks.step3.description')}
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {t('home.howItWorks.step3.ready')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-slate-900">Sarah M.</h4>
                  <div className="text-yellow-400" aria-label="5 out of 5 stars">★★★★★</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                "Wizqo worksheets have been a lifesaver for my 2nd grade class! The math worksheets with answer keys save me hours of prep time. My students love the variety."
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-slate-900">Ahmed K.</h4>
                  <div className="text-yellow-400" aria-label="5 out of 5 stars">★★★★★</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                "As a homeschooling parent, I use Wizqo worksheets daily. The reading comprehension worksheets are perfect for my kids, and having answer keys makes grading so easy!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              {t('home.faq.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('home.faq.subtitle')}
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.faq.free.question')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.faq.free.answer')}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.faq.subjects.question')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.faq.subjects.answer')}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.faq.answerKeys.question')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.faq.answerKeys.answer')}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.faq.classroom.question')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.faq.classroom.answer')}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t('home.faq.generate.question')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.faq.generate.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Floating badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <span aria-hidden="true">📚</span> {t('home.cta.badges.free')}
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <span aria-hidden="true">✅</span> {t('home.cta.badges.answerKeys')}
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <span aria-hidden="true">🖨️</span> {t('home.cta.badges.printable')}
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
            {t('home.cta.title')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient-x">
              {t('home.cta.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('home.cta.description')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a 
              href="/interactive-worksheets-generator"
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 text-lg font-black rounded-3xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 border-0"
            >
              <span aria-hidden="true">📚</span> {t('home.cta.button')}
            </a>
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                {t('home.cta.features')}
              </p>
            </div>
          </div>
          
          {/* Success Stories Preview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-white mb-2">Sarah</div>
                <div className="text-gray-300 text-sm mb-3">"Learned guitar in 7 days!"</div>
                <div className="flex justify-center">
                  <span className="text-yellow-400" aria-label="5 out of 5 stars">★★★★★</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">Mike</div>
                <div className="text-gray-300 text-sm mb-3">"Photography skills transformed"</div>
                <div className="flex justify-center">
                  <span className="text-yellow-400" aria-label="5 out of 5 stars">★★★★★</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">Lisa</div>
                <div className="text-gray-300 text-sm mb-3">"Coding from zero to hero"</div>
                <div className="flex justify-center">
                  <span className="text-yellow-400" aria-label="5 out of 5 stars">★★★★★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
