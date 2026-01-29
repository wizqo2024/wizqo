import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { WizqoLogo } from './WizqoLogo';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/context/TranslationContext';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, Menu, X, Puzzle } from 'lucide-react';
import { addLocaleToPath, getLocaleFromURL } from '@/utils/locale';

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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <a href={addLocaleToPath("/", getLocaleFromURL())} className="flex items-center space-x-3 cursor-pointer group/logo">
              <WizqoLogo width={40} height={23} className="group-hover/logo:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold tracking-tight text-slate-800 font-['Comic_Neue',_cursive] group-hover/logo:text-purple-600 transition-colors duration-300">Wizqo</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href={addLocaleToPath("/", getLocaleFromURL())} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-3px_rgba(147,51,234,0.1)] ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <div className={currentPage === 'home' || currentPage === 'landing' ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}>
                  <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#72C2E9" d="M252.334 253.197H3.667V83.8L128 2.8l124.334 81z" />
                    <path fill="#C5E5FE" d="M239.334 242.697H34.684a2.5 2.5 0 1 1 0-5h202.149V90.847a2.5 2.5 0 1 1 5 0v149.351a2.498 2.498 0 0 1-2.499 2.499zm-214.65 0h-8.018a2.5 2.5 0 1 1 0-5h8.018a2.5 2.5 0 1 1 0 5z" />
                    <circle fill="#FEB69F" cx="72.566" cy="149.895" r="21.155" />
                    <path fill="#13BF6D" d="M103.978 229.923H41.153v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z" />
                    <path fill="#76FFBB" d="M94.978 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z" />
                    <circle fill="#FEB69F" cx="128" cy="168.724" r="16.178" />
                    <path fill="#8B72E9" d="M152.022 229.923h-48.044v-20.999c0-13.267 10.755-24.022 24.022-24.022 13.267 0 24.022 10.755 24.022 24.022v20.999z" />
                    <path fill="#B8A4FF" d="M143.022 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.6a2.5 2.5 0 1 1 5 0v2.6a2.5 2.5 0 0 1-2.5 2.5zm-2.51-15A12.483 12.483 0 0 0 128 196.402a2.5 2.5 0 1 1 0-5c9.445 0 17.136 7.39 17.508 16.824a2.5 2.5 0 1 1-4.996.197z" />
                    <circle fill="#FEB69F" cx="183.435" cy="149.895" r="21.155" />
                    <path fill="#EDC21D" d="M214.847 229.923h-62.825v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z" />
                    <path fill="#F8E5B0" d="M205.847 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z" />
                    <path fill="#FC5D3D" d="m167.248 86.573-35.713 35.713a5 5 0 0 1-7.071 0L88.753 86.575c-7.226-7.226-7.224-18.941.002-26.165l.003-.003c7.225-7.222 18.936-7.221 26.16.003l9.546 9.546a5 5 0 0 0 7.07.001l9.553-9.55c7.225-7.222 18.936-7.221 26.16.002 7.225 7.226 7.225 18.939.001 26.164z" />
                  </svg>
                </div>
                <span className="font-medium">{t('navigation.home')}</span>
              </a>

              <a href={addLocaleToPath("/blog", getLocaleFromURL())} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-3px_rgba(147,51,234,0.1)] ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <div className={currentPage === 'blog' ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="2" fill="#FEF3C7" />
                    <rect x="5" y="6" width="14" height="2" rx="1" fill="#FDE68A" />
                    <rect x="5" y="10" width="10" height="1" rx="0.5" fill="#F59E0B" />
                    <rect x="5" y="12" width="14" height="1" rx="0.5" fill="#F59E0B" />
                    <rect x="5" y="14" width="14" height="1" rx="0.5" fill="#F59E0B" />
                    <path d="M16 10H19V15H16V10Z" fill="#FBBF24" />
                  </svg>
                </div>
                <span className="font-medium">{t('navigation.blog')}</span>
              </a>

              <div className="relative">
                <div className="flex items-center">
                  <a href={addLocaleToPath("/worksheets/all", getLocaleFromURL())} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-3px_rgba(147,51,234,0.1)] whitespace-nowrap ${(() => {
                    // Show active on /worksheets/all or interactive-worksheets-generator
                    const pathname = window.location.pathname;
                    return pathname === '/worksheets/all' || currentPage === 'interactive-worksheets-generator' ||
                      getIsWorksheetsPageActive();
                  })() ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`} aria-haspopup="true" aria-expanded={showWorksheetsMenu}>
                    <div className={(() => {
                      const pathname = window.location.pathname;
                      return pathname === '/worksheets/all' || currentPage === 'interactive-worksheets-generator' || getIsWorksheetsPageActive();
                    })() ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" fill="#E0F2FE" />
                        <path d="M6 8H18" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 12H18" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 16H13" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
                        <rect x="15" y="14" width="4" height="5" rx="1" fill="#0EA5E9" opacity="0.4" />
                      </svg>
                    </div>
                    <span className="font-medium whitespace-nowrap">{t('navigation.worksheets')}</span>
                  </a>
                  <button
                    type="button"
                    aria-label="Toggle Worksheets menu"
                    ref={worksheetsToggleRef}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setShowWorksheetsMenu((v: boolean) => !v);
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
                  onMouseEnter={() => { if (worksheetsMenuCloseTimer.current) { window.clearTimeout(worksheetsMenuCloseTimer.current); worksheetsMenuCloseTimer.current = null; } }}
                  onMouseLeave={() => { worksheetsMenuCloseTimer.current = window.setTimeout(() => setShowWorksheetsMenu(false), 200) as unknown as number; }}
                >
                  {/* caret */}
                  <div className="absolute -top-1.5 left-10 h-3 w-3 bg-white rotate-45 border-l border-t border-slate-200" aria-hidden />
                  <div className="grid gap-0 min-w-[320px] md:grid-cols-3 w-full md:gap-0">
                    {/* First Column: Free Worksheet PDFs */}
                    <div className="-mx-1">
                      <div className="px-2 py-1.5 mb-2 text-xs uppercase tracking-wide font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent border-b border-blue-100">{t('navigation.freeWorksheetPDFs')}</div>
                      <a href={addLocaleToPath("/worksheets/all", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-purple-50 transition-colors border border-purple-200 bg-purple-50/50 mb-2">
                        <svg className="w-4 h-4 text-purple-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          <path d="M9 22V12h6v10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-purple-700 whitespace-nowrap">{t('navigation.allWorksheets')}</div>
                          <div className="text-[10px] text-purple-600 truncate">{t('navigation.allWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/multiplication-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.multiplicationWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.multiplicationWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/times-table-multiplication-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.timesTableMultiplicationWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.timesTableMultiplicationWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/kindergarten-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.kindergartenMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.kindergartenMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/1st-grade-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.firstGradeMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.firstGradeMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/2nd-grade-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.secondGradeMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.secondGradeMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/3rd-grade-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.thirdGradeMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.thirdGradeMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/4th-grade-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.fourthGradeMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.fourthGradeMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/5th-grade-math-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.fifthGradeMathWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.fifthGradeMathWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/reading-comprehension", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.readingComprehensionWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.readingComprehensionWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/fractions-to-decimals-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.fractionsToDecimalsWorksheets')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.fractionsToDecimalsWorksheetsDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/order-of-operations-worksheets", getLocaleFromURL())} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
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
                      <div className="px-2 py-1.5 mb-2 text-xs uppercase tracking-wide font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent border-b border-purple-100">{t('navigation.createSomethingMagical')}</div>
                      <a href={addLocaleToPath("/printables/certificate-maker", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17l-5 3 1.9-5.9L4 9h6l2-6 2 6h6l-4.9 5.1L17 20z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.certificateMaker')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.certificateMakerDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/printables/name-tracing-generator", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.nameTracing')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.nameTracingDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/handwriting-worksheet-maker", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.handwritingMaker')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.handwritingMakerDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/worksheets/spelling-list-generator", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Spelling List Generator</div>
                          <div className="text-[10px] text-slate-600 truncate">Create custom spelling tracing sheets</div>
                        </div>
                      </a>
                    </div>

                    {/* Third Column: Worksheets & Quick Packs */}
                    <div className="-mx-1">
                      <div className="px-2 py-1.5 mb-2">
                        <span className="text-xs uppercase tracking-wide font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent border-b border-green-100 pb-1.5 inline-block">{t('navigation.worksheetsQuickPacks')}</span>
                      </div>
                      <a href={addLocaleToPath("/interactive-worksheets-generator", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Interactive Worksheets Generator</div>
                          <div className="text-[10px] text-slate-600 truncate">Create custom worksheets instantly</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/printables", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9V2h12v7" />
                          <path d="M6 18H5a3 3 0 01-3-3v-2a3 3 0 013-3h14a3 3 0 013 3v2a3 3 0 01-3 3h-1" />
                          <rect x="6" y="14" width="12" height="8" rx="1" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">{t('navigation.printables')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.printablesDesc')}</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a href={addLocaleToPath("/generate", getLocaleFromURL())} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-3px_rgba(147,51,234,0.1)] ${currentPage === 'generate' || currentPage === 'plan' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <div className={currentPage === 'generate' || currentPage === 'plan' ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#ECFDF5" />
                    <path d="M12 2L4 7L12 12L20 7L12 2Z" fill="#D1FAE5" />
                    <path d="M4 7V17L12 22L12 12L4 7Z" fill="#A7F3D0" />
                    <path d="M20 7V17L12 22L12 12L20 7Z" fill="#6EE7B7" />
                    <path d="M12 15L15 11M12 15L9 11M12 15V8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-medium">{t('navigation.learn')}</span>
              </a>

              <div className="relative">
                <div className="flex items-center">
                  <a href={addLocaleToPath("/kids", getLocaleFromURL())} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-3px_rgba(147,51,234,0.1)] ${currentPage === 'kids' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`} aria-haspopup="true" aria-expanded={showKidsMenu}>
                    <div className={currentPage === 'kids' ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.5 13H15V9.5C15 8.11929 13.8807 7 12.5 7H11.5C10.1193 7 9 8.11929 9 9.5V13H5.5C4.11929 13 3 14.1193 3 15.5V16.5C3 17.8807 4.11929 19 5.5 19H18.5C19.8807 19 21 17.8807 21 16.5V15.5C21 14.1193 19.8807 13 18.5 13Z" fill="#F5H1FF" opacity="0.2" />
                        <path d="M11 11H13V13H11V11Z" fill="#D8B4FE" />
                        <path d="M11 15H13V17H11V15Z" fill="#D8B4FE" />
                        <path d="M7 11H9V13H7V11Z" fill="#D8B4FE" />
                        <path d="M7 15H9V17H7V15Z" fill="#D8B4FE" />
                        <path d="M15 11H17V13H15V11Z" fill="#D8B4FE" />
                        <path d="M15 15H17V17H15V15Z" fill="#D8B4FE" />
                        <path d="M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V7H10V5Z" fill="#A855F7" />
                        <rect x="4" y="9" width="16" height="10" rx="2" fill="#C084FC" />
                      </svg>
                    </div>
                    <span className="font-medium">{t('navigation.kidsHub')}</span>
                  </a>
                  <button
                    type="button"
                    aria-label="Toggle Kids menu"
                    ref={kidsToggleRef}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setShowKidsMenu((v: boolean) => !v);
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
                  onMouseEnter={() => { if (kidsMenuCloseTimer.current) { window.clearTimeout(kidsMenuCloseTimer.current); kidsMenuCloseTimer.current = null; } }}
                  onMouseLeave={() => { kidsMenuCloseTimer.current = window.setTimeout(() => setShowKidsMenu(false), 200) as unknown as number; }}
                >
                  {/* caret */}
                  <div className="absolute -top-1.5 left-10 h-3 w-3 bg-white rotate-45 border-l border-t border-slate-200" aria-hidden />
                  <div className="grid gap-2 min-w-[280px] md:grid-cols-[1fr_2.8fr] md:max-w-[850px]">
                    <div>
                      <div className="px-2 py-1 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent border-b border-orange-100 pb-1.5">{t('navigation.kidsGames')}</div>
                      <a href={addLocaleToPath("/kids/games/memory", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
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
                      <a href={addLocaleToPath("/kids/games/word-search", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">{t('navigation.wordSearch')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.wordSearchDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/kids/games/puzzle", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 3h3a2 2 0 012 2v3h-2.5a1.5 1.5 0 100 3H18v3h-2.5a1.5 1.5 0 100 3H18v3a2 2 0 01-2 2h-3v-2.5a1.5 1.5 0 10-3 0V22H8a2 2 0 01-2-2v-3h2.5a1.5 1.5 0 000-3H6V9h2.5a1.5 1.5 0 000-3H6V5a2 2 0 012-2h3v2.5a1.5 1.5 0 003 0V3z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">{t('navigation.puzzleBuilder')}</div>
                          <div className="text-[10px] text-slate-600 truncate">{t('navigation.puzzleBuilderDesc')}</div>
                        </div>
                      </a>
                      <a href={addLocaleToPath("/kids/games/typing", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
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
                      <a href={addLocaleToPath("/kids/games/pattern", getLocaleFromURL())} className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
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
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-md group"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-110">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[120px] truncate text-sm font-semibold text-slate-700 transition-colors group-hover:text-indigo-700">
                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:text-indigo-500 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('navigation.account')}</div>
                      </div>
                      <a
                        href={addLocaleToPath("/dashboard", getLocaleFromURL())}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group/item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 group-hover/item:bg-indigo-100 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        {t('navigation.dashboard')}
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group/item"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 group-hover/item:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
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
                window.location.href = addLocaleToPath('/', getLocaleFromURL());
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path fill="#72C2E9" d="M252.334 253.197H3.667V83.8L128 2.8l124.334 81z" />
                <path fill="#C5E5FE" d="M239.334 242.697H34.684a2.5 2.5 0 1 1 0-5h202.149V90.847a2.5 2.5 0 1 1 5 0v149.351a2.498 2.498 0 0 1-2.499 2.499zm-214.65 0h-8.018a2.5 2.5 0 1 1 0-5h8.018a2.5 2.5 0 1 1 0 5z" />
                <circle fill="#FEB69F" cx="72.566" cy="149.895" r="21.155" />
                <path fill="#13BF6D" d="M103.978 229.923H41.153v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z" />
                <path fill="#76FFBB" d="M94.978 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z" />
                <circle fill="#FEB69F" cx="128" cy="168.724" r="16.178" />
                <path fill="#8B72E9" d="M152.022 229.923h-48.044v-20.999c0-13.267 10.755-24.022 24.022-24.022 13.267 0 24.022 10.755 24.022 24.022v20.999z" />
                <path fill="#B8A4FF" d="M143.022 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.6a2.5 2.5 0 1 1 5 0v2.6a2.5 2.5 0 0 1-2.5 2.5zm-2.51-15A12.483 12.483 0 0 0 128 196.402a2.5 2.5 0 1 1 0-5c9.445 0 17.136 7.39 17.508 16.824a2.5 2.5 0 1 1-4.996.197z" />
                <circle fill="#FEB69F" cx="183.435" cy="149.895" r="21.155" />
                <path fill="#EDC21D" d="M214.847 229.923h-62.825v-27.46c0-17.349 14.064-31.413 31.413-31.413s31.413 14.064 31.413 31.413v27.46z" />
                <path fill="#F8E5B0" d="M205.847 223.423a2.5 2.5 0 0 1-2.5-2.5v-2.671a2.5 2.5 0 1 1 5 0v2.671a2.5 2.5 0 0 1-2.5 2.5zm0-12.671a2.5 2.5 0 0 1-2.5-2.5v-5.789c0-10.98-8.933-19.913-19.913-19.913a2.5 2.5 0 1 1 0-5c13.737 0 24.913 11.176 24.913 24.913v5.789a2.5 2.5 0 0 1-2.5 2.5z" />
                <path fill="#FC5D3D" d="m167.248 86.573-35.713 35.713a5 5 0 0 1-7.071 0L88.753 86.575c-7.226-7.226-7.224-18.941.002-26.165l.003-.003c7.225-7.222 18.936-7.221 26.16.003l9.546 9.546a5 5 0 0 0 7.07.001l9.553-9.55c7.225-7.222 18.936-7.221 26.16.002 7.225 7.226 7.225 18.939.001 26.164z" />
              </svg>
              <span className="font-medium">{t('navigation.home')}</span>
            </button>

            <button
              onClick={() => {
                window.location.href = addLocaleToPath('/blog', getLocaleFromURL());
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
                  window.location.href = addLocaleToPath('/worksheets/all', getLocaleFromURL());
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
                    window.location.href = addLocaleToPath('/printables/certificate-maker', getLocaleFromURL());
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.certificateMaker')}</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = addLocaleToPath('/printables/name-tracing-generator', getLocaleFromURL());
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.nameTracingGenerator')}</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = addLocaleToPath('/worksheets/handwriting-worksheet-maker', getLocaleFromURL());
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">{t('navigation.handwritingWorksheetMaker')}</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = addLocaleToPath('/worksheets/spelling-list-generator', getLocaleFromURL());
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                >
                  <span className="text-sm font-medium">Spelling List Generator</span>
                </button>

                <div className="pt-3 mt-2">
                  <div className="px-3 pb-2 text-[11px] uppercase tracking-wide font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent border-b border-blue-100">{t('navigation.freeWorksheetPDFs')}</div>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/all', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-purple-700 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 mb-2 border border-purple-200 shadow-sm"
                  >
                    <span className="text-sm font-bold">{t('navigation.allWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/multiplication-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.multiplicationWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/times-table-multiplication-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.timesTableMultiplicationWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/kindergarten-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.kindergartenMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/1st-grade-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.firstGradeMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/2nd-grade-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.secondGradeMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/3rd-grade-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.thirdGradeMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/4th-grade-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.fourthGradeMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/5th-grade-math-worksheets', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.fifthGradeMathWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/reading-comprehension', getLocaleFromURL());
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left text-slate-700 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{t('navigation.readingComprehensionWorksheets')}</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = addLocaleToPath('/worksheets/fractions-to-decimals-worksheets', getLocaleFromURL());
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
                      window.location.href = addLocaleToPath('/printables', getLocaleFromURL());
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
                window.location.href = addLocaleToPath('/generate', getLocaleFromURL());
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
                  window.location.href = addLocaleToPath('/kids', getLocaleFromURL());
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
                      window.location.href = addLocaleToPath(href, getLocaleFromURL());
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
                    window.location.href = addLocaleToPath('/dashboard', getLocaleFromURL());
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