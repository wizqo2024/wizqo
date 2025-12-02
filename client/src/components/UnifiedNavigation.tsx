import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { WizqoLogo } from './WizqoLogo';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/context/TranslationContext';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, Menu, X, Puzzle } from 'lucide-react';

interface UnifiedNavigationProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  currentPage?: string;
}

export function UnifiedNavigation({ showBackButton = false, onBackClick, currentPage }: UnifiedNavigationProps) {
  const { user, signOut } = useAuth();
  const { t, isRTL } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showKidsMenu, setShowKidsMenu] = useState(false);
  const [showWorksheetsMenu, setShowWorksheetsMenu] = useState(false);
  const kidsMenuCloseTimer = useRef<number | null>(null);
  const kidsMenuRef = useRef<HTMLDivElement | null>(null);
  const kidsToggleRef = useRef<HTMLButtonElement | null>(null);
  const worksheetsMenuCloseTimer = useRef<number | null>(null);
  const worksheetsMenuRef = useRef<HTMLDivElement | null>(null);
  const worksheetsToggleRef = useRef<HTMLButtonElement | null>(null);

  // Check if we're on a worksheets page (but not specific worksheet pages)
  // This is checked on every render to be reactive to navigation
  const getIsWorksheetsPageActive = () => {
    const pathname = window.location.pathname;
    // Only show active state on interactive-worksheets-generator
    // Don't show active on specific worksheet pages
    if (pathname === '/interactive-worksheets-generator') {
      return true;
    }
    // Don't show active on any specific worksheet pages
    if (pathname.startsWith('/worksheets/')) {
      return false;
    }
    return false;
  };

  // Close Kids menu on outside click or ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showKidsMenu) return;
      const target = e.target as Node | null;
      if (!target) return;
      const inMenu = kidsMenuRef.current?.contains(target);
      const inToggle = kidsToggleRef.current?.contains(target);
      if (!inMenu && !inToggle) setShowKidsMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowKidsMenu(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showKidsMenu]);

  // Close Worksheets menu on outside click or ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showWorksheetsMenu) return;
      const target = e.target as Node | null;
      if (!target) return;
      const inMenu = worksheetsMenuRef.current?.contains(target);
      const inToggle = worksheetsToggleRef.current?.contains(target);
      if (!inMenu && !inToggle) setShowWorksheetsMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowWorksheetsMenu(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showWorksheetsMenu]);

  const handleSignOut = async () => {
    try {
      console.log('Navigation: handleSignOut called');
      setShowUserMenu(false);
      await signOut();
    } catch (error) {
      console.error('Navigation: Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 cursor-pointer">
              <WizqoLogo width={40} height={23} className="hover:opacity-80 transition-opacity" />
              <span className="text-xl font-bold text-slate-800">Wizqo</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#72C2E9" d="M252.334 253.197H3.667V83.8L128 2.8l124.334 81z"/>
                  <path fill="#C5E5FE" d="M239.334 242.697H34.684a2.5 2.5 0 1 1 0-5h202.149V90.847a2.5 2.5 0 1 1 5 0v149.351a2.498 2.498 0 0 1-2.499 2.499zm-214.65 0h-8.018a2.5 2.5 0 1 1 0-5h8.018a2.5 2.5 0 1 1 0 5z"/>
                  <circle fill="#FEB69F" cx="72.566" cy="149.895" r="21.155"/>
                  <path fill="#13BF6D" d="M103.978 229.923H41.153v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z"/>
                  <path fill="#76FFBB" d="M94.978 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z"/>
                  <circle fill="#FEB69F" cx="128" cy="168.724" r="16.178"/>
                  <path fill="#8B72E9" d="M152.022 229.923h-48.044v-20.999c0-13.267 10.755-24.022 24.022-24.022 13.267 0 24.022 10.755 24.022 24.022v20.999z"/>
                  <path fill="#B8A4FF" d="M143.022 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.6a2.5 2.5 0 1 1 5 0v2.6a2.5 2.5 0 0 1-2.5 2.5zm-2.51-15A12.483 12.483 0 0 0 128 196.402a2.5 2.5 0 1 1 0-5c9.445 0 17.136 7.39 17.508 16.824a2.5 2.5 0 1 1-4.996.197z"/>
                  <circle fill="#FEB69F" cx="183.435" cy="149.895" r="21.155"/>
                  <path fill="#EDC21D" d="M214.847 229.923h-62.825v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z"/>
                  <path fill="#F8E5B0" d="M205.847 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z"/>
                  <path fill="#FC5D3D" d="m167.248 86.573-35.713 35.713a5 5 0 0 1-7.071 0L88.753 86.575c-7.226-7.226-7.224-18.941.002-26.165l.003-.003c7.225-7.222 18.936-7.221 26.16.003l9.546 9.546a5 5 0 0 0 7.07.001l9.553-9.55c7.225-7.222 18.936-7.221 26.16.002 7.225 7.226 7.225 18.939.001 26.164z"/>
                </svg>
                <span className="font-medium">{t('navigation.home')}</span>
              </a>

              <a href="/blog" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                <span className="font-medium">{t('navigation.blog')}</span>
              </a>

              <div className="relative">
                <div className="flex items-center">
                  <a href="/worksheets/all" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${(() => {
                    // Show active on /worksheets/all or interactive-worksheets-generator
                    const pathname = window.location.pathname;
                    return pathname === '/worksheets/all' || currentPage === 'interactive-worksheets-generator' || 
                           getIsWorksheetsPageActive();
                  })() ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`} aria-haspopup="true" aria-expanded={showWorksheetsMenu}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="font-medium whitespace-nowrap">{t('navigation.worksheets')}</span>
                  </a>
                  <button
                    type="button"
                    aria-label="Toggle Worksheets menu"
                    ref={worksheetsToggleRef}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWorksheetsMenu((v) => !v);
                    }}
                    className="px-2 py-2 text-slate-600 hover:text-slate-800"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showWorksheetsMenu ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {/* Dropdown: Worksheets */}
                <div
                  ref={worksheetsMenuRef}
                  className={`absolute left-0 top-full mt-2 ${showWorksheetsMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} transition-all duration-150 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl min-w-[320px] w-full md:w-auto md:max-w-[98vw] md:min-w-[800px] z-50 p-1.5`}
                  role="menu"
                  aria-label="Worksheets menu"
                  onMouseEnter={() => { if (worksheetsMenuCloseTimer.current) { window.clearTimeout(worksheetsMenuCloseTimer.current); worksheetsMenuCloseTimer.current = null; }}}
                  onMouseLeave={() => { worksheetsMenuCloseTimer.current = window.setTimeout(() => setShowWorksheetsMenu(false), 200) as unknown as number; }}
                >
                  {/* caret */}
                  <div className="absolute -top-2 left-10 h-4 w-4 bg-white rotate-45 border-l border-t border-slate-200" aria-hidden />
                  <div className="grid gap-0 min-w-[320px] md:grid-cols-3 w-full md:gap-0">
                    {/* First Column: Free Worksheet PDFs */}
                    <div className="-mx-1">
                      <div className="px-2 py-1.5 mb-2 text-xs uppercase tracking-wide text-slate-500 font-semibold border-b border-slate-200">Free Worksheet PDFs</div>
                      <a href="/worksheets/all" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-purple-50 transition-colors border border-purple-200 bg-purple-50/50 mb-2">
                        <svg className="w-4 h-4 text-purple-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          <path d="M9 22V12h6v10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-purple-700 whitespace-nowrap">✨ All Worksheet Categories</div>
                          <div className="text-[10px] text-purple-600 truncate">Browse complete collection</div>
                        </div>
                      </a>
                      <a href="/worksheets/multiplication-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Multiplication Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">2nd-5th grade free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/times-table-multiplication-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Times Table Multiplication Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">1-12 tables, confidence building free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/kindergarten-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Kindergarten Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Counting, shapes, patterns free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/1st-grade-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">1st Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Ten-frames, add/sub free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/2nd-grade-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">2nd Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Place value, add/sub free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/3rd-grade-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">3rd Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Fractions, division, word problems free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/4th-grade-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">4th Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Decimals, geometry, measurement free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/5th-grade-math-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">5th Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Algebra, advanced operations free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/reading-comprehension" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Reading Comprehension Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">G1-G3 passages free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/fractions-to-decimals-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Converting Fractions to Decimals Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">3rd-5th grade free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/order-of-operations-worksheets" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Order of Operations Worksheets (PEMDAS)</div>
                          <div className="text-[10px] text-slate-600 truncate">4th-6th grade free PDF</div>
                        </div>
                      </a>
                    </div>

                    {/* Second Column: Create Something Magical */}
                    <div className="-mx-1">
                      <div className="px-2 py-1.5 mb-2 text-xs uppercase tracking-wide text-slate-500 font-semibold border-b border-slate-200">Create Something Magical</div>
                      <a href="/printables/certificate-maker" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17l-5 3 1.9-5.9L4 9h6l2-6 2 6h6l-4.9 5.1L17 20z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Certificate Maker</div>
                          <div className="text-[10px] text-slate-600 truncate">Editable name/date</div>
                        </div>
                      </a>
                      <a href="/printables/name-tracing-generator" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Name Tracing</div>
                          <div className="text-[10px] text-slate-600 truncate">Personalized sheets</div>
                        </div>
                      </a>
                      <a href="/worksheets/handwriting-worksheet-maker" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Handwriting Maker</div>
                          <div className="text-[10px] text-slate-600 truncate">Letters, words, sentences</div>
                        </div>
                      </a>
                    </div>

                    {/* Third Column: Worksheets & Quick Packs */}
                    <div className="-mx-1">
                      <div className="px-2 py-1.5 mb-2">
                        <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold border-b border-slate-200 pb-1.5 inline-block">Worksheets & Quick Packs</span>
                      </div>
                      <a href="/interactive-worksheets-generator" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Interactive Worksheets Generator</div>
                          <div className="text-[10px] text-slate-600 truncate">Create custom worksheets instantly</div>
                        </div>
                      </a>
                      <a href="/printables" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9V2h12v7" />
                          <path d="M6 18H5a3 3 0 01-3-3v-2a3 3 0 013-3h14a3 3 0 013 3v2a3 3 0 01-3 3h-1" />
                          <rect x="6" y="14" width="12" height="8" rx="1" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Printables</div>
                          <div className="text-[10px] text-slate-600 truncate">Puzzles, coloring, packs</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a href="/generate" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'generate' || currentPage === 'plan' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span className="font-medium">{t('navigation.learn')}</span>
              </a>

              <div className="relative">
                <div className="flex items-center">
                  <a href="/kids" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'kids' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`} aria-haspopup="true" aria-expanded={showKidsMenu}>
                    <Puzzle className="w-4 h-4" />
                    <span className="font-medium">{t('navigation.kidsHub')}</span>
                  </a>
                    <button
                      type="button"
                      aria-label="Toggle Kids menu"
                      ref={kidsToggleRef}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowKidsMenu((v) => !v);
                      }}
                      className="px-2 py-2 text-slate-600 hover:text-slate-800"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${showKidsMenu ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                {/* Dropdown: Printables under Kids */}
                <div
                  ref={kidsMenuRef}
                  className={`absolute left-0 top-full mt-2 ${showKidsMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} transition-all duration-150 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl min-w-[280px] max-w-[850px] z-50 p-2`}
                  role="menu"
                  aria-label="Kids Hub menu"
                  onMouseEnter={() => { if (kidsMenuCloseTimer.current) { window.clearTimeout(kidsMenuCloseTimer.current); kidsMenuCloseTimer.current = null; }}}
                  onMouseLeave={() => { kidsMenuCloseTimer.current = window.setTimeout(() => setShowKidsMenu(false), 200) as unknown as number; }}
                >
                  {/* caret */}
                  <div className="absolute -top-2 left-10 h-4 w-4 bg-white rotate-45 border-l border-t border-slate-200" aria-hidden />
                    <div className="grid gap-2 min-w-[280px] md:grid-cols-[1fr_2.8fr] md:max-w-[850px]">
                      <div>
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{t('navigation.kidsGames')}</div>
                        <a href="/kids/games/memory" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">{t('navigation.memoryMatch')}</div>
                            <div className="text-[10px] text-slate-600 truncate">{t('navigation.memoryMatchDesc')}</div>
                          </div>
                        </a>
                        <a href="/kids/games/word-search" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">{t('navigation.wordSearch')}</div>
                            <div className="text-[10px] text-slate-600 truncate">{t('navigation.wordSearchDesc')}</div>
                          </div>
                        </a>
                        <a href="/kids/games/puzzle" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 3h3a2 2 0 012 2v3h-2.5a1.5 1.5 0 100 3H18v3h-2.5a1.5 1.5 0 100 3H18v3a2 2 0 01-2 2h-3v-2.5a1.5 1.5 0 10-3 0V22H8a2 2 0 01-2-2v-3h2.5a1.5 1.5 0 000-3H6V9h2.5a1.5 1.5 0 000-3H6V5a2 2 0 012-2h3v2.5a1.5 1.5 0 003 0V3z" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">{t('navigation.puzzleBuilder')}</div>
                            <div className="text-[10px] text-slate-600 truncate">{t('navigation.puzzleBuilderDesc')}</div>
                          </div>
                        </a>
                        <a href="/kids/games/typing" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                            <path d="M6 8h12" />
                            <path d="M6 12h12" />
                            <path d="M6 16h8" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">{t('navigation.typingSafari')}</div>
                            <div className="text-[10px] text-slate-600 truncate">{t('navigation.typingSafariDesc')}</div>
                          </div>
                        </a>
                        <a href="/kids/games/pattern" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h4v4H4z" />
                            <path d="M10 10h4v4h-4z" />
                            <path d="M16 4h4v4h-4z" />
                            <path d="M4 16h4v4H4z" />
                            <path d="M16 16h4v4h-4z" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">{t('navigation.patternBuilder')}</div>
                            <div className="text-[10px] text-slate-600 truncate">{t('navigation.patternBuilderDesc')}</div>
                          </div>
                        </a>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-slate-600 hover:text-slate-800"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Right side - Account */}
          <div className="hidden md:flex items-center space-x-4" dir="ltr">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <a
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t('navigation.dashboard')}
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('navigation.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
              >
                <User className="w-4 h-4" />
                <span>{t('navigation.signIn')}</span>
              </Button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <button 
              onClick={() => {
                window.location.href = '/';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path fill="#72C2E9" d="M252.334 253.197H3.667V83.8L128 2.8l124.334 81z"/>
                <path fill="#C5E5FE" d="M239.334 242.697H34.684a2.5 2.5 0 1 1 0-5h202.149V90.847a2.5 2.5 0 1 1 5 0v149.351a2.498 2.498 0 0 1-2.499 2.499zm-214.65 0h-8.018a2.5 2.5 0 1 1 0-5h8.018a2.5 2.5 0 1 1 0 5z"/>
                <circle fill="#FEB69F" cx="72.566" cy="149.895" r="21.155"/>
                <path fill="#13BF6D" d="M103.978 229.923H41.153v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z"/>
                <path fill="#76FFBB" d="M94.978 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z"/>
                <circle fill="#FEB69F" cx="128" cy="168.724" r="16.178"/>
                <path fill="#8B72E9" d="M152.022 229.923h-48.044v-20.999c0-13.267 10.755-24.022 24.022-24.022 13.267 0 24.022 10.755 24.022 24.022v20.999z"/>
                <path fill="#B8A4FF" d="M143.022 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.6a2.5 2.5 0 1 1 5 0v2.6a2.5 2.5 0 0 1-2.5 2.5zm-2.51-15A12.483 12.483 0 0 0 128 196.402a2.5 2.5 0 1 1 0-5c9.445 0 17.136 7.39 17.508 16.824a2.5 2.5 0 1 1-4.996.197z"/>
                <circle fill="#FEB69F" cx="183.435" cy="149.895" r="21.155"/>
                <path fill="#EDC21D" d="M214.847 229.923h-62.825v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z"/>
                <path fill="#F8E5B0" d="M205.847 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z"/>
                <path fill="#FC5D3D" d="m167.248 86.573-35.713 35.713a5 5 0 0 1-7.071 0L88.753 86.575c-7.226-7.226-7.224-18.941.002-26.165l.003-.003c7.225-7.222 18.936-7.221 26.16.003l9.546 9.546a5 5 0 0 0 7.07.001l9.553-9.55c7.225-7.222 18.936-7.221 26.16.002 7.225 7.226 7.225 18.939.001 26.164z"/>
              </svg>
              <span className="font-medium">{t('navigation.home')}</span>
            </button>
            
            <button 
              onClick={() => {
                window.location.href = '/blog';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <span className="font-medium">{t('navigation.blog')}</span>
            </button>

            <div>
              <button 
                onClick={() => {
                  window.location.href = '/interactive-worksheets-generator';
                  setShowMobileMenu(false);
                }} 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'interactive-worksheets-generator' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-medium">{t('navigation.worksheets')}</span>
              </button>
              
              <div className="pl-7 pt-2 space-y-1">
                <div className="px-3 pb-2 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent border-b border-purple-100">{t('navigation.createSomethingMagical')}</div>
                <button 
                  onClick={() => {
                    window.location.href = '/printables/certificate-maker';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.certificateMaker')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/printables/name-tracing-generator';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.nameTracingGenerator')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/handwriting-worksheet-maker';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.handwritingWorksheetMaker')}</span>
                </button>
                
                <div className="pt-3 mt-2">
                  <div className="px-3 pb-2 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent border-b border-blue-100">{t('navigation.freeWorksheetPDFs')}</div>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/multiplication-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.multiplicationWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/times-table-multiplication-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.timesTableMultiplicationWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/kindergarten-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.kindergartenMathWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/1st-grade-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.firstGradeMathWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/2nd-grade-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.secondGradeMathWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/3rd-grade-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.thirdGradeMathWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/4th-grade-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.fourthGradeMathWorksheets')}</span>
                </button>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/5th-grade-math-worksheets';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.fifthGradeMathWorksheets')}</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/worksheets/reading-comprehension';
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.readingComprehensionWorksheets')}</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/worksheets/fractions-to-decimals-worksheets';
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                >
                  <span className="text-sm font-medium">{t('navigation.fractionsToDecimalsWorksheets')}</span>
                </button>
                </div>
                
                <div className="pt-3 mt-2">
                  <div className="px-3 pb-2 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent border-b border-green-100">{t('navigation.worksheetsQuickPacks')}</div>
                  <button 
                    onClick={() => {
                      window.location.href = '/printables';
                      setShowMobileMenu(false);
                    }} 
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-green-700 hover:bg-green-50 active:bg-green-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.printables')}</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                window.location.href = '/generate';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'generate' || currentPage === 'plan' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span className="font-medium">{t('navigation.learn')}</span>
            </button>

            <div>
              <button 
                onClick={() => {
                  window.location.href = '/kids';
                  setShowMobileMenu(false);
                }} 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'kids' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <Puzzle className="w-4 h-4" />
                <span className="font-medium">{t('navigation.kidsHub')}</span>
              </button>
              
              <div className="pl-7 pt-2 space-y-1">
                <div className="px-3 pb-2 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent border-b border-orange-100">{t('navigation.kidsGames')}</div>
                {[
                  { href: '/kids/games/memory', label: t('navigation.memoryMatch') },
                  { href: '/kids/games/word-search', label: t('navigation.wordSearchGame') },
                  { href: '/kids/games/puzzle', label: t('navigation.puzzleBuilder') },
                  { href: '/kids/games/typing', label: t('navigation.typingSafari') },
                  { href: '/kids/games/pattern', label: t('navigation.patternBuilder') },
                ].map(({ href, label }) => (
                  <button
                    key={href}
                    onClick={() => {
                      window.location.href = href;
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100"
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Account Section */}
            {user ? (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <button 
                  onClick={() => {
                    window.location.href = '/dashboard';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium">{t('navigation.dashboard')}</span>
                </button>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">{t('navigation.signOut')}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{t('navigation.signIn')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
}