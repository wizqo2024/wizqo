import React, { useEffect } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { Button } from '@/components/ui/button';

export default function MultiplicationWorksheetsPage() {
  // Pre-fill URL params for generator if not already set
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Set default filters for multiplication if not present
    if (!params.get('grade')) {
      params.set('grade', 'g2'); // Default to 2nd-3rd grade
    }
    if (!params.get('categories')) {
      params.set('categories', 'math');
    }
    // Update URL without page reload if params changed
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (window.location.search !== `?${params.toString()}`) {
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Free Multiplication Worksheets - Printable PDFs with Answer Keys | Wizqo"
        description="Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, and beyond! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency. No sign-up required!"
        keywords="multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"
        canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
      />
      
      {/* Structured Data for SEO */}
      {(() => {
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
            { "@type": "ListItem", position: 3, name: "Multiplication Worksheets", item: "https://wizqo.com/worksheets/multiplication-worksheets" }
          ]
        };
        
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are multiplication worksheets free to download?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! All multiplication worksheets are completely free. Generate unlimited unique multiplication worksheets, download as PDFs, and print as many copies as you need. No sign-up required."
              }
            },
            {
              "@type": "Question",
              name: "What grade levels are multiplication worksheets available for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our multiplication worksheets are perfect for 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with multiplication facts, arrays, and word problems."
              }
            },
            {
              "@type": "Question",
              name: "Do multiplication worksheets include answer keys?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! Every multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents."
              }
            },
            {
              "@type": "Question",
              name: "What multiplication skills are covered?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our multiplication worksheets cover multiplication facts, arrays, multiplication word problems, fact fluency, and visual multiplication models. Perfect for building confidence and mastering multiplication skills."
              }
            }
          ]
        };

        const howToLd = {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Get Free Multiplication Worksheets",
          description: "Generate unlimited unique multiplication worksheets with answer keys in seconds",
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Select Grade Level",
              text: "Choose your grade level (2nd-3rd or 4th-5th) from the filter sidebar"
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Generate Worksheets",
              text: "Click Generate to create your personalized multiplication worksheet pack with answer keys"
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Download PDF",
              text: "Download your multiplication worksheets as a printable PDF and print as many copies as needed"
            }
          ]
        };

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
          </>
        );
      })()}

      <UnifiedNavigation currentPage="worksheets" />
      
      {/* Hero Section with SEO Content */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 mb-6">
              <span className="text-sm font-semibold">🔥 Most Popular - 22,000+ Monthly Searches</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Free Multiplication Worksheets
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-700 mb-8 leading-relaxed">
              Help your child <strong className="text-purple-700">master multiplication</strong> with our free multiplication worksheets for 2nd grade, 3rd grade, and beyond! Download printable PDFs instantly with answer keys. Perfect for <strong className="text-pink-700">building confidence</strong> and <strong className="text-purple-700">math fluency</strong> - no sign-up required!
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-2xl">✅</span>
                <span className="text-sm font-medium text-slate-700">Answer Keys Included</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-2xl">🖨️</span>
                <span className="text-sm font-medium text-slate-700">Printable PDFs</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium text-slate-700">All Grades 2nd-5th</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-2xl">💯</span>
                <span className="text-sm font-medium text-slate-700">100% Free</span>
              </div>
            </div>

            <a 
              href="#generator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              <span>🚀</span>
              Generate Free Multiplication Worksheets Now
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Master Multiplication Facts</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Build fluency with multiplication facts through engaging practice sheets. Each worksheet is unique and designed to help students memorize multiplication tables with confidence.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visual Learning with Arrays</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Understand multiplication through visual arrays and models. Perfect for 2nd and 3rd grade students who are just learning multiplication concepts.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-World Word Problems</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Apply multiplication skills to solve word problems. Build critical thinking and problem-solving abilities while mastering multiplication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade-Specific Content */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
            Multiplication Worksheets for Every Grade Level
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">2nd & 3rd Grade Multiplication Worksheets</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Perfect for students just starting to learn multiplication! Our <strong>free multiplication worksheets for 2nd grade</strong> and 3rd grade focus on:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Basic multiplication facts (1-10)</li>
                <li>Visual arrays and models</li>
                <li>Skip counting patterns</li>
                <li>Simple multiplication word problems</li>
                <li>Building fact fluency</li>
              </ul>
              <a 
                href="/interactive-worksheets-generator?grade=g2&categories=math"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Get 2nd-3rd Grade Worksheets →
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">4th & 5th Grade Multiplication Worksheets</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Advanced multiplication practice for older students! Our 4th and 5th grade multiplication worksheets include:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Multi-digit multiplication</li>
                <li>Multiplication with regrouping</li>
                <li>Complex word problems</li>
                <li>Multiplication properties</li>
                <li>Problem-solving challenges</li>
              </ul>
              <a 
                href="/interactive-worksheets-generator?grade=35&categories=math"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Get 4th-5th Grade Worksheets →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section - Embed Interactive Worksheets Generator */}
      <section id="generator" className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Generate Unlimited Multiplication Worksheets
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-6">
              Use our interactive worksheet generator below to create unlimited unique multiplication worksheets. Each worksheet is different, includes answer keys, and is perfect for daily practice, homework, or classroom use.
            </p>
            
            {/* Quick Grade Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="#generator"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/interactive-worksheets-generator?grade=g2&categories=math';
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <span>🚀</span>
                2nd-3rd Grade Multiplication
              </a>
              
              <a 
                href="#generator"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/interactive-worksheets-generator?grade=35&categories=math';
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <span>📚</span>
                4th-5th Grade Multiplication
              </a>
            </div>
          </div>
          
          {/* Direct link to generator with pre-filled filters */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 mb-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Generate Multiplication Worksheets?
            </h3>
            <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
              Click below to open our interactive worksheet generator. The filters will be pre-set for multiplication worksheets, so you can start generating immediately!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/interactive-worksheets-generator?grade=g2&categories=math"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                <span>🚀</span>
                Open Generator (2nd-3rd Grade)
              </a>
              <a 
                href="/interactive-worksheets-generator?grade=35&categories=math"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                <span>📚</span>
                Open Generator (4th-5th Grade)
              </a>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              The generator will open with multiplication worksheets pre-selected. You can then generate, preview, and download unlimited unique worksheets with answer keys.
            </p>
          </div>
          
          {/* Preview/Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-bold text-slate-900 mb-3">What You'll Get</h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li>Multiplication facts practice</li>
                <li>Array models and visual aids</li>
                <li>Word problems</li>
                <li>Complete answer keys</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-3">Perfect For</h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li>Daily math practice</li>
                <li>Homework assignments</li>
                <li>Classroom activities</li>
                <li>Test preparation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-slate-900 mb-3">Features</h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li>Unlimited unique worksheets</li>
                <li>Instant PDF download</li>
                <li>No sign-up required</li>
                <li>100% free forever</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
            Why Teachers & Parents Love Our Multiplication Worksheets
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-bold text-slate-900 mb-2">Unlimited Unique Worksheets</h3>
              <p className="text-sm text-slate-600">
                Generate as many multiplication worksheets as you need. Each one is unique, so students never run out of practice material.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold text-slate-900 mb-2">Answer Keys Included</h3>
              <p className="text-sm text-slate-600">
                Every multiplication worksheet comes with a complete answer key, making grading quick and easy for teachers and parents.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Download</h3>
              <p className="text-sm text-slate-600">
                Download multiplication worksheets as PDFs instantly. No waiting, no sign-up required. Print and use immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-bold text-slate-900 mb-2">Grade-Appropriate</h3>
              <p className="text-sm text-slate-600">
                Worksheets are tailored to each grade level, ensuring students practice multiplication skills that match their learning stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
