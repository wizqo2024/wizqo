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
            We help people learn a new hobby fast — with clear 7‑day plans, kid‑friendly games, and printable activities that make learning feel fun.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <div className="text-gray-900">
            <p className="text-lg mb-6 text-gray-700">
              Wizqo is your personal AI‑powered learning companion. We create simple, guided 7‑day plans for any hobby — while our Kids Hub adds playful mini‑games and rich printables to build skills away from screens.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🚀 Our Mission</h2>
            <p className="mb-4 text-gray-700">
              Make learning approachable for everyone. We remove the overwhelm and replace it with short, structured steps — supported by AI guidance, games that improve focus and memory, and printable activities you can use at home or in class.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">💡 What Makes Wizqo Different?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>AI‑customized 7‑day learning plans with daily checklists</li>
              <li>Kid‑friendly mini‑games and printables to reinforce skills</li>
              <li>Fast, mobile‑friendly experience with offline‑ready print views</li>
              <li>Real‑time tips, progress cues, and motivation to finish</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🌍 Who We Help</h2>
            <p className="mb-4 text-gray-700">
              Students starting fresh, busy parents looking for screen‑free activities, teachers seeking quick resources, and lifelong learners who want a clear weekly plan — Wizqo is for everyone who learns best with small wins.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">🤖 Powered by AI, Driven by Play</h2>
            <p className="mb-8 text-gray-700">
              Our system adapts to your pace and helps you build momentum. With human‑friendly design and playful elements, learning new skills stays simple, focused, and fun for both adults and kids.
            </p>

            <p className="text-base text-gray-600">
              Ready to get started?{' '}
              <a href="/printables" className="text-blue-600 hover:text-blue-800 transition-colors">Explore printables</a>{' '}or{' '}
              <a href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">read the latest blog</a>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}