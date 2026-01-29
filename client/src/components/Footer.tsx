import React from 'react';
import { WizqoLogo } from './WizqoLogo';
import { useTranslation } from '@/context/TranslationContext';

// Social media configuration - easy to update
const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/wizqo-hobbies/',
  facebook: 'https://www.facebook.com/wizqo.learning/',
  instagram: 'https://www.instagram.com/wizqo.worksheets/',
  pinterest: 'https://www.pinterest.com/wizqo2024/',
  trustpilot: 'https://www.trustpilot.com/review/wizqo.com'
};

export function Footer() {
  const { t, isRTL } = useTranslation();
  return (
    <footer className="bg-slate-900 text-white py-12 print:hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <WizqoLogo width={32} height={18} />
              <span className="text-xl font-bold">Wizqo</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a href="/generate" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Learning Plan Generator
                </a>
              </li>
              <li>
                <a href="/kids" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Kids Hub
                </a>
              </li>
              <li>
                <a href="/printables" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Printables
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.termsOfService')}
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">
                  {t('footer.cookiePolicy')}
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">{t('footer.connect')}</h3>
            <p className="text-slate-400 text-sm mb-4">
              {t('footer.followUsOnSocialMedia')}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 mb-4">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                title={t('footer.followUsOnLinkedIn')}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                title={t('footer.followUsOnFacebook')}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Trustpilot */}
              <a
                href={SOCIAL_LINKS.trustpilot}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                title={t('footer.seeUsOnTrustpilot')}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a
                href={SOCIAL_LINKS.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                title={t('footer.followUsOnPinterest')}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 4.99 3.657 9.153 8.484 10.146-.117-.861-.223-2.186.046-3.13.242-.83 1.556-5.3 1.556-5.3s-.397-.794-.397-1.967c0-1.84 1.067-3.214 2.398-3.214 1.13 0 1.676.849 1.676 1.866 0 1.137-.725 2.838-1.098 4.415-.312 1.317.662 2.39 1.963 2.39 2.356 0 3.943-3.025 3.943-6.602 0-2.722-1.833-4.759-5.165-4.759-3.765 0-6.107 2.81-6.107 5.952 0 1.085.32 1.853.821 2.445.23.272.262.381.179.692-.06.228-.196.778-.251.996-.082.315-.334.427-.616.31-1.718-.703-2.523-2.588-2.523-4.705 0-3.501 2.954-7.704 8.807-7.704 4.703 0 7.785 3.402 7.785 7.052 0 4.835-2.689 8.443-6.648 8.443-1.331 0-2.584-.72-3.013-1.543l-.818 3.115c-.296 1.139-1.096 2.57-1.633 3.44C10.725 23.803 11.35 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>

              {/* Instagram - will be active when link is provided */}
              {SOCIAL_LINKS.instagram ? (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
                  title={t('footer.followUsOnInstagram')}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              ) : (
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center opacity-50" title={t('footer.instagramComingSoon')}>
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Newsletter Signup */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Get New Worksheets Weekly</h4>
              <p className="text-xs text-slate-400 mb-4 truncate line-clamp-2">Be the first to get our latest printable tools and educational tips.</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Wizqo. {t('footer.allRightsReserved')}
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            {t('footer.madeWithLove')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else if (response.status === 409) {
        setStatus('exists');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-in fade-in zoom-in duration-300">
        <p className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
          <span>✨</span> Welcome to the club! Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="bg-slate-800 border-0 focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 text-sm text-white flex-1 min-w-0"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap active:scale-95"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Joining...' : 'Join'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-[11px] font-medium animate-in slide-in-from-top-1">
          Something went wrong. Please try again later.
        </p>
      )}
      {status === 'exists' && (
        <p className="text-blue-400 text-[11px] font-medium animate-in slide-in-from-top-1">
          You're already on the list! Stay tuned for updates.
        </p>
      )}
    </form>
  );
}
