import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedNavigation } from './UnifiedNavigation';
import { Footer } from './Footer';

interface LandingPageProps {
  onNavigateToGenerate: () => void;
}

export function LandingPage({ onNavigateToGenerate }: LandingPageProps) {
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

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
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
              <span className="text-sm font-medium"><span aria-hidden="true">✨</span> Free • Printable • Answer Keys Included</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
              Free Printable Worksheets for Teachers & Parents
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Create unlimited free printable worksheets for math, reading, writing, science, and more. Download PDFs instantly with answer keys included. Perfect for teachers, parents, and homeschoolers. 
              <br className="hidden lg:block" />
              <strong className="text-white">No sign-up required</strong> — start generating worksheets for kindergarten through 5th grade right away!
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center mb-12 sm:mb-16 px-4">
              <a 
                href="/interactive-worksheets-generator"
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-0 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                <span aria-hidden="true">📚</span> Browse Free Worksheets
              </a>
            </div>
            {/* Above-the-fold internal links to worksheets (SEO-safe) */}
            <nav aria-label="Popular worksheets" className="px-4 sm:px-0">
              <ul className="flex flex-wrap justify-center gap-2 text-sm">
                <li>
                  <a href="/worksheets/1st-grade-math-worksheets" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    1st Grade Math Worksheets
                  </a>
                </li>
                <li>
                  <a href="/worksheets/2nd-grade-math-worksheets" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    2nd Grade Math Worksheets
                  </a>
                </li>
                <li>
                  <a href="/worksheets/handwriting-worksheet-maker" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Handwriting Worksheets
                  </a>
                </li>
                <li>
                  <a href="/worksheets/reading-comprehension" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Reading Comprehension
                  </a>
                </li>
                <li>
                  <a href="/printables/certificate-maker" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certificate Maker
                  </a>
                </li>
              </ul>
            </nav>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-200 px-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white/60"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full border-2 border-white/60"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full border-2 border-white/60"></div>
                </div>
                <span className="text-sm font-medium">Loved by parents & teachers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Printable awards & handwriting sheets
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Worksheets for all grades K-5
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Kids Hub – Fun Learning Games & Printables</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Play quick, kid‑friendly games that build focus, vocabulary, and logic — plus printable puzzles you can download and use at home.
              </p>
              <ul className="text-slate-700 text-sm space-y-1 mb-5 list-disc list-inside">
                <li><span aria-hidden="true">🃏</span> Memory Match • <span aria-hidden="true">🔤</span> Word Search • <span aria-hidden="true">🧩</span> Puzzle • <span aria-hidden="true">⌨️</span> Typing Safari</li>
                <li><span aria-hidden="true">🖨️</span> Printables: word search, sudoku, coloring • <span aria-hidden="true">📚</span> Interactive Worksheets Generator</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <a href="/kids" className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Visit Kids Hub →</a>
                <a href="/interactive-worksheets-generator" className="inline-flex items-center px-4 py-2 rounded-lg border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"><span aria-hidden="true">📚</span> Interactive Worksheets →</a>
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
              <h3 className="text-lg font-semibold text-slate-900">Loved by families & teachers</h3>
              <p className="mt-2 text-sm text-slate-600">Used by thousands of teachers and parents worldwide. High-quality worksheets that align with educational standards.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🖨️</div>
              <h3 className="text-lg font-semibold text-slate-900">Printable library ready to go</h3>
              <p className="mt-2 text-sm text-slate-600">Grab certificates, handwriting sheets, and activity packs without any setup.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🤖</div>
              <h3 className="text-lg font-semibold text-slate-900">AI worksheet generator</h3>
              <p className="mt-2 text-sm text-slate-600">Create unlimited custom worksheets instantly with our AI-powered generator. Perfect for any grade or subject.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden="true">🎯</div>
              <h3 className="text-lg font-semibold text-slate-900">Fresh activities weekly</h3>
              <p className="mt-2 text-sm text-slate-600">New printables, games, and challenges pushed live so you always have something fun to try.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Worksheets by Grade Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              Browse Worksheets by Grade & Subject
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Find the perfect worksheets for your students. We offer free printable worksheets for kindergarten through 5th grade, covering math, reading, writing, science, and more. All worksheets include answer keys and are ready to print.
            </p>
          </div>
          
          {/* Grade Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="text-4xl mb-4" aria-hidden="true">👶</div>
              <h3 className="font-bold text-slate-900 mb-2">Kindergarten</h3>
              <p className="text-slate-600 text-sm">Math, Reading, Writing</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-4xl mb-4" aria-hidden="true">1️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">1st Grade</h3>
              <p className="text-slate-600 text-sm">Addition, Subtraction, Reading</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="text-4xl mb-4" aria-hidden="true">2️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">2nd Grade</h3>
              <p className="text-slate-600 text-sm">Multiplication, Division, Word Problems</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
              <div className="text-4xl mb-4" aria-hidden="true">3️⃣</div>
              <h3 className="font-bold text-slate-900 mb-2">3rd Grade</h3>
              <p className="text-slate-600 text-sm">Fractions, Multiplication, Reading</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50 border border-pink-100">
              <div className="text-4xl mb-4" aria-hidden="true">🎨</div>
              <h3 className="font-bold text-slate-900 mb-2">All Grades</h3>
              <p className="text-slate-600 text-sm">Create Custom Worksheets</p>
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
              Why Teachers & Parents Choose Wizqo Worksheets
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Get high-quality, free printable worksheets with answer keys for every grade level. Perfect for classroom use, homework, or homeschooling.
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">🖨️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Printable PDFs</h3>
              <p className="text-slate-600 leading-relaxed">Download worksheets instantly as PDFs. Print as many copies as you need for your classroom or home.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">✅</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Answer Keys Included</h3>
              <p className="text-slate-600 leading-relaxed">Every worksheet comes with a complete answer key, making grading quick and easy for teachers and parents.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">All Grades K-5</h3>
              <p className="text-slate-600 leading-relaxed">Find worksheets for kindergarten, 1st grade, 2nd grade, 3rd grade, and more. Covering math, reading, writing, and science.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">🚀</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Generate Unlimited</h3>
              <p className="text-slate-600 leading-relaxed">Use our worksheet generator to create unlimited unique worksheets. Perfect for daily practice and homework.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">💯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">100% Free</h3>
              <p className="text-slate-600 leading-relaxed">All worksheets are completely free. No sign-up required, no credit card needed. Start downloading right away.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4" aria-hidden="true">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Trusted by Teachers</h3>
              <p className="text-slate-600 leading-relaxed">Used by thousands of teachers and parents worldwide. High-quality worksheets that align with educational standards.</p>
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
                <h3 className="text-xl font-bold text-slate-900 mb-4">Smart AI Worksheet Generator</h3>
                <p className="text-slate-700 text-base leading-relaxed mb-6">
                  Our AI creates worksheets perfectly matched to your grade level and subject. Each worksheet is unique and includes answer keys.
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
              How to Generate Free Worksheets - 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Create unlimited printable worksheets with answer keys in seconds
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
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">Choose Grade & Subject</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Select your grade level (Kindergarten through 5th grade) and choose from math, reading, writing, science, and more.
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Takes 10 seconds
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
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">Generate Worksheets</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our AI instantly creates unique worksheets tailored to your selected grade and subject. Each worksheet includes answer keys.
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Powered by AI
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
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">Download & Print</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Download your worksheets as PDFs instantly. Print as many copies as you need for your classroom or home. Answer keys included!
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Ready in seconds
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
              Real Stories from Teachers & Parents
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              See how Wizqo worksheets are helping educators and families every day
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
              Frequently Asked Questions About Free Worksheets
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our free printable worksheets
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Are the worksheets free to download?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! All worksheets are completely free. Generate unlimited worksheets, download as PDFs, and print as many copies as you need. No sign-up required for basic access.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">What subjects and grades are available?</h3>
              <p className="text-slate-600 leading-relaxed">
                We offer worksheets for Math, Reading, Writing, Science, and more. Worksheets are available for Kindergarten, 1st grade, 2nd grade, 3rd grade, and up to 5th grade. All worksheets include answer keys.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Do worksheets include answer keys?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! Every worksheet automatically includes a printable answer key appendix, making grading quick and easy for teachers and parents.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Can I use these worksheets in my classroom?</h3>
              <p className="text-slate-600 leading-relaxed">
                Absolutely! All worksheets are free for personal and classroom use. Print as many copies as you need for your students. Perfect for homework, classwork, or extra practice.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">How do I generate custom worksheets?</h3>
              <p className="text-slate-600 leading-relaxed">
                Use our Interactive Worksheets Generator to create unlimited unique worksheets. Select your grade level and subjects, then generate and download PDFs instantly with answer keys included.
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
              <span aria-hidden="true">📚</span> Free worksheets for all grades
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <span aria-hidden="true">✅</span> Answer keys included
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              <span aria-hidden="true">🖨️</span> Printable PDF downloads
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
            Start Using Free
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient-x">
              Printable Worksheets Today
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of teachers and parents who use Wizqo worksheets every day.
            <br className="hidden lg:block" />
            All worksheets are <strong className="text-white">completely free</strong> - no sign-up required, no credit card needed.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a 
              href="/interactive-worksheets-generator"
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 text-lg font-black rounded-3xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 border-0"
            >
              <span aria-hidden="true">📚</span> Browse Free Worksheets
            </a>
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                <span aria-hidden="true">✓</span> No sign-up required • <span aria-hidden="true">✓</span> 100% free forever • <span aria-hidden="true">✓</span> Answer keys included
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
