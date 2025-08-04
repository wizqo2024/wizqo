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
            We're on a mission to make learning any hobby accessible, structured, and achievable in just 7 days.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <div className="text-gray-900">
            <p className="text-lg mb-6 text-gray-700">
              Wizqo is your personal AI-powered learning companion, helping you discover and master new hobbies in just 7 days.
              Whether you're exploring photography, coding, music, writing, or design — our platform guides you with a step-by-step plan tailored just for you.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🚀 Our Mission</h2>
            <p className="mb-4 text-gray-700">
              We believe everyone has the potential to be creative, curious, and skilled — they just need the right start. Wizqo removes the overwhelm and replaces it with a smart, supportive, and structured journey.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">💡 What Makes Wizqo Different?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>7-day learning plans customized by AI</li>
              <li>Micro-commitments that fit your busy schedule</li>
              <li>Real-time support and personalized suggestions</li>
              <li>Designed to help you stay consistent — and actually finish</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🌍 Who We Help</h2>
            <p className="mb-4 text-gray-700">
              From students trying something new, to busy professionals seeking balance, to retirees reigniting a lifelong passion — Wizqo is here to help anyone start and stick with a hobby they love.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🤖 Powered by AI, Driven by Passion</h2>
            <p className="mb-8 text-gray-700">
              Our smart system continuously learns from your behavior, adapting the experience to keep it fun, frictionless, and effective.
              We combine the power of artificial intelligence with human-centered design — so learning a new skill never feels lonely or hard again.
            </p>

            <p className="text-base text-gray-600">
              Ready to find your next passion?{' '}
              <a href="#/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
                Check out our latest blog posts
              </a>{' '}
              and get started today.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}