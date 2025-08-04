import React from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';

export function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="cookies" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Policy</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
            <p className="text-gray-700">
              Cookies are small text files placed on your device when you visit a website. They help us remember your preferences, enhance your experience, and analyze site performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">2. How We Use Cookies</h2>
            <p className="text-gray-700">Wizqo uses cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Remember your preferences and settings</li>
              <li>Enable core functionality (e.g., user login)</li>
              <li>Analyze user behavior and improve performance</li>
              <li>Provide relevant content and recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Cookies</strong>: Required for basic functionality like navigation and login.</li>
              <li><strong>Analytics Cookies</strong>: Help us understand how users interact with our site (e.g., Google Analytics).</li>
              <li><strong>Functional Cookies</strong>: Remember user choices and enhance personalization.</li>
              <li><strong>Marketing Cookies</strong>: Used to deliver relevant advertising, if applicable.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">4. Managing Cookies</h2>
            <p className="text-gray-700">
              Most browsers allow you to control or disable cookies via settings. Please note that disabling cookies may impact your experience on Wizqo.
            </p>
            <p className="text-gray-700">
              You can also use opt-out tools from advertising platforms and analytics providers to manage tracking preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">5. Third-Party Cookies</h2>
            <p className="text-gray-700">
              We may allow trusted third parties to set cookies for analytics or performance. These third parties have their own privacy policies and cookie management options.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">6. Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time. Changes will be posted here with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Cookie Policy, please contact us at{" "}
              <a href="mailto:admin@wizqo.com" className="text-blue-600 hover:text-blue-800 transition-colors">admin@wizqo.com</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}