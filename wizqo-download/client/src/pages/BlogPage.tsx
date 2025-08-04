import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="blog" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Wizqo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Blog</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover learning tips, hobby guides, and success stories from our community of learners.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
          <div className="text-6xl mb-8">📝</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Coming Soon</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're working on creating valuable content about hobby learning, AI-powered education, and success strategies. Our blog will feature:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-slate-900 mb-2">Learning Guides</h3>
              <p className="text-slate-600 text-sm">Step-by-step tutorials for popular hobbies</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-bold text-slate-900 mb-2">Success Stories</h3>
              <p className="text-slate-600 text-sm">Real experiences from our learners</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="font-bold text-slate-900 mb-2">AI Insights</h3>
              <p className="text-slate-600 text-sm">How AI enhances personalized learning</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Want to be notified when we publish new content?</h3>
            <p className="text-slate-600 mb-4">Join our newsletter to get the latest learning tips and hobby guides.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}