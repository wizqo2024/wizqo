import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="about" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Wizqo</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We provide free printable worksheets for teachers and parents. Create unlimited worksheets for math, reading, writing, and more — with answer keys included. Perfect for classroom use, homework, or homeschooling.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <div className="text-gray-900">
            <p className="text-lg mb-6 text-gray-700">
              Wizqo is a free educational resource platform providing printable worksheets for teachers, parents, and homeschoolers. We offer high-quality worksheets for math, reading, writing, science, and more — covering kindergarten through 5th grade. All worksheets include answer keys and are ready to print.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🚀 Our Mission</h2>
            <p className="mb-4 text-gray-700">
              Make quality educational resources accessible to everyone. We provide free printable worksheets that teachers and parents can use immediately — no sign-up required, no credit card needed. Our goal is to support educators and families with high-quality, ready-to-use worksheets that save time and enhance learning.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">💡 What Makes Wizqo Different?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>100% Free:</strong> All worksheets are completely free with no hidden costs</li>
              <li><strong>Answer Keys Included:</strong> Every worksheet comes with a complete answer key for easy grading</li>
              <li><strong>All Grades K-5:</strong> Worksheets for kindergarten, 1st, 2nd, 3rd, 4th, and 5th grade</li>
              <li><strong>Multiple Subjects:</strong> Math, reading, writing, science, and more</li>
              <li><strong>Worksheet Generator:</strong> Create unlimited custom worksheets with our AI-powered generator</li>
              <li><strong>Printable PDFs:</strong> Download and print as many copies as you need</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🌍 Who We Help</h2>
            <p className="mb-4 text-gray-700">
              <strong>Teachers:</strong> Find ready-to-use worksheets for your classroom. Perfect for homework, classwork, or extra practice.<br/><br/>
              <strong>Parents:</strong> Support your child's learning at home with free worksheets covering all major subjects.<br/><br/>
              <strong>Homeschoolers:</strong> Access comprehensive worksheet collections for every grade level and subject.<br/><br/>
              <strong>Students:</strong> Get extra practice with worksheets that include answer keys for self-checking.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🎨 Also Available: AI Learning Plans</h2>
            <p className="mb-8 text-gray-700">
              In addition to worksheets, Wizqo also offers AI-powered 7-day learning plans for hobbies and skills. Whether you want to learn guitar, photography, coding, or any other hobby, our AI creates personalized learning plans tailored to your goals and schedule. This feature complements our worksheet offerings, providing a complete learning platform for both academic and personal development.
            </p>

            <p className="text-base text-gray-600">
              Ready to get started?{' '}
              <a href="/printables" className="text-blue-600 hover:text-blue-800 transition-colors">Explore printables</a>{' '}or{' '}
              <a href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">read the latest blog</a>.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
              <span className="text-xs uppercase tracking-wide font-semibold">Trusted by learners</span>
              <a href="https://www.trustpilot.com/review/wizqo.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">See reviews on Trustpilot →</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}