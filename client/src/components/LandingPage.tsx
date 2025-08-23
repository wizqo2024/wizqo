import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedNavigation } from './UnifiedNavigation';
import { Footer } from './Footer';

interface LandingPageProps {
  onNavigateToGenerate: () => void;
}

export function LandingPage({ onNavigateToGenerate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
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
              <span className="text-sm font-medium">✨ AI-Powered • Personalized • Free</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
              What Hobby Means – Discover Your Ideal Hobby with Wizqo AI
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Wondering what hobby means and how to find one you'll truly enjoy? A hobby is more than just a pastime — it's a meaningful activity that boosts creativity, relaxation, and personal growth. 
              <br className="hidden lg:block" />
              At Wizqo, we use AI technology to help you discover your ideal hobby and create a personalized 7-day learning plan tailored to your goals, schedule, and experience level.
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center mb-12 sm:mb-16 px-4">
              <Button 
                onClick={onNavigateToGenerate}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-0 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                🚀 Start Your Journey
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400 px-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm font-medium">50,000+ learners</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm">4.9/5 rating</span>
              </div>
              <div className="text-sm font-medium">🎯 97% completion rate</div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300">
            <span className="text-2xl">🎸</span>
            <p className="text-white text-sm mt-1">Guitar</p>
          </div>
        </div>
        <div className="absolute top-1/3 right-16 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
            <span className="text-2xl">📸</span>
            <p className="text-white text-sm mt-1">Photography</p>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-6 hover:rotate-12 transition-transform duration-300">
            <span className="text-2xl">🍳</span>
            <p className="text-white text-sm mt-1">Cooking</p>
          </div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-6 hover:-rotate-12 transition-transform duration-300">
            <span className="text-2xl">💻</span>
            <p className="text-white text-sm mt-1">Coding</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-slate-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-slate-600">Plans Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-slate-600">Hobbies Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-slate-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is a Hobby Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              What Is a Hobby? Definition, Benefits & Examples
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              A hobby is a regular activity done for pleasure, self-expression, or relaxation — not for financial gain. Hobbies range from creative arts like painting and writing to physical activities like gardening or yoga. Engaging in hobbies improves mental health, reduces stress, and brings joy into your everyday life.
            </p>
          </div>
          
          {/* Common Types of Hobbies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold text-slate-900 mb-2">Creative</h3>
              <p className="text-slate-600 text-sm">Painting, crafting, journaling</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🚴</div>
              <h3 className="font-bold text-slate-900 mb-2">Physical</h3>
              <p className="text-slate-600 text-sm">Cycling, hiking, gardening</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="font-bold text-slate-900 mb-2">Cognitive</h3>
              <p className="text-slate-600 text-sm">Coding, puzzles, songwriting</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-slate-900 mb-2">Social</h3>
              <p className="text-slate-600 text-sm">Clubs, workshops, community volunteering</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Wizqo Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
              Why Choose Wizqo to Find Your Hobby?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Discover your perfect hobby with AI-powered personalization and structured learning
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Personalized Plans</h3>
              <p className="text-slate-600 leading-relaxed">Our AI analyzes your interests, goals, and schedule to recommend the perfect hobby for you.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">7-Day Challenge</h3>
              <p className="text-slate-600 leading-relaxed">Get bite-sized daily activities designed to help you get started fast and stay motivated.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Support</h3>
              <p className="text-slate-600 leading-relaxed">Chat with our assistant anytime for tips, guidance, and answers to your questions.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Progress Tracking</h3>
              <p className="text-slate-600 leading-relaxed">Visualize your milestones and keep your hobby journey on track.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Mobile Friendly</h3>
              <p className="text-slate-600 leading-relaxed">Learn anytime, anywhere, on any device.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">100% Free to Start</h3>
              <p className="text-slate-600 leading-relaxed">No credit card required — try Wizqo risk-free.</p>
            </div>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* AI Personalization - Large Card */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Smart AI Personalization</h3>
                <p className="text-slate-700 text-base leading-relaxed mb-6">
                  Our AI analyzes your experience, time, and goals to create a learning path that's perfectly tailored to you.
                </p>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Experience Level: Beginner</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Daily Time: 30-45 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Goal: Create my first project</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 7-Day Structure */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Perfect 7-Day Structure</h3>
                <p className="text-slate-700 leading-relaxed">
                  Science-backed learning methodology that turns overwhelming hobbies into bite-sized daily wins.
                </p>
                <div className="grid grid-cols-7 gap-2 mt-6">
                  {[1,2,3,4,5,6,7].map((day) => (
                    <div key={day} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {day}
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
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Visual progress tracking keeps you motivated and on track.
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
                  <span className="text-xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Join Community</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Connect with fellow learners and share your progress.
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
              How Wizqo Works — Simple, Smart, and Fun
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From hobby discovery to mastery in just 3 steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1: Pick Your Passion */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 text-sm">
                      <span>🎸 Guitar</span>
                      <span>📸 Photo</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 text-sm">
                      <span>👨‍🍳 Cook</span>
                      <span>💻 Code</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">Pick Your Passion</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Choose from 150+ hobbies or type your own. Answer 3 quick questions about your experience and goals.
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Takes 30 seconds
              </div>
            </div>

            {/* Step 2: AI Creates Your Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">🤖</span>
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
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI Creates Your Plan</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our smart AI analyzes your inputs and generates a personalized 7-day learning roadmap just for you.
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Powered by AI
              </div>
            </div>

            {/* Step 3: Learn & Master */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">Day 5 of 7</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[1,2,3,4,5,6,7].map((day) => (
                        <div key={day} className={`w-4 h-4 rounded ${day <= 5 ? 'bg-green-400' : 'bg-slate-200'}`}>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">Learn & Master</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Follow your daily lessons, track progress, and celebrate as you master your new hobby in just one week!
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                97% success rate
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
              Real Stories from Wizqo Users
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              See how our AI-powered hobby plans have transformed learning experiences
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
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                "I never knew how to start a hobby until Wizqo's AI suggested painting for me. The 7-day plan kept me excited, and now I paint weekly!"
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-slate-900">Ahmed K.</h4>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                "Wizqo made it so easy to pick up guitar. The daily challenges helped me build skills without feeling overwhelmed."
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
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about hobbies and Wizqo
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">What exactly is a hobby?</h3>
              <p className="text-slate-600 leading-relaxed">
                A hobby is an activity you enjoy doing regularly for fun, relaxation, or creativity—not for money.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">How does Wizqo's AI help me find a hobby?</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI asks about your preferences and lifestyle, then generates a customized plan with daily tasks to help you start and stick with your new hobby.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Can I try Wizqo for free?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! You can start any hobby plan without a credit card or commitment.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">What kinds of hobbies can Wizqo recommend?</h3>
              <p className="text-slate-600 leading-relaxed">
                From painting and gardening to coding and yoga, Wizqo covers a wide variety of hobbies based on your interests.
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
              🚀 50,000+ Active Learners
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              ⭐ 4.9/5 Rating
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm">
              🎯 97% Success Rate
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
            Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient-x">
              Learning Journey
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands who've transformed their lives with our AI-powered learning system.
            <br className="hidden lg:block" />
            Your first day is <strong className="text-white">completely free</strong> - no strings attached.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              onClick={onNavigateToGenerate}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 text-lg font-black rounded-3xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 border-0"
            >
              🎯 Start Learning Now
            </Button>
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                ✓ No credit card required • ✓ Day 1 completely free • ✓ Cancel anytime
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
                  <span className="text-yellow-400">★★★★★</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">Mike</div>
                <div className="text-gray-300 text-sm mb-3">"Photography skills transformed"</div>
                <div className="flex justify-center">
                  <span className="text-yellow-400">★★★★★</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">Lisa</div>
                <div className="text-gray-300 text-sm mb-3">"Coding from zero to hero"</div>
                <div className="flex justify-center">
                  <span className="text-yellow-400">★★★★★</span>
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
