import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { WizqoLogo } from './WizqoLogo';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, Menu, X, Puzzle } from 'lucide-react';

interface UnifiedNavigationProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  currentPage?: string;
}

export function UnifiedNavigation({ showBackButton = false, onBackClick, currentPage }: UnifiedNavigationProps) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showKidsMenu, setShowKidsMenu] = useState(false);
  const kidsMenuCloseTimer = useRef<number | null>(null);
  const kidsMenuRef = useRef<HTMLDivElement | null>(null);
  const kidsToggleRef = useRef<HTMLButtonElement | null>(null);

  // Check if we're on a worksheets page (but not multiplication-worksheets)
  // This is checked on every render to be reactive to navigation
  const getIsWorksheetsPageActive = () => {
    const pathname = window.location.pathname;
    // Don't show active state on multiplication-worksheets page
    if (pathname.includes('/multiplication-worksheets')) {
      return false;
    }
    // Show active for interactive-worksheets-generator or other worksheets pages
    return pathname === '/interactive-worksheets-generator' || 
           (pathname.startsWith('/worksheets/') && !pathname.includes('/multiplication-worksheets'));
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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="font-medium">Home</span>
              </a>

              <a href="/blog" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                <span className="font-medium">Blog</span>
              </a>

              <a href="/interactive-worksheets-generator" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${(() => {
                // Don't show active on multiplication-worksheets page
                if (window.location.pathname.includes('/multiplication-worksheets')) {
                  return false;
                }
                // Show active for interactive-worksheets-generator or other worksheets pages
                return currentPage === 'interactive-worksheets-generator' || 
                       (currentPage === 'worksheets' && !window.location.pathname.includes('/multiplication-worksheets')) ||
                       getIsWorksheetsPageActive();
              })() ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-medium">Worksheets</span>
              </a>

              <a href="/generate" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'generate' || currentPage === 'plan' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span className="font-medium">Learn</span>
              </a>

              <div className="relative">
                <div className="flex items-center">
                  <a href="/kids" className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'kids' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`} aria-haspopup="true" aria-expanded={showKidsMenu}>
                    <Puzzle className="w-4 h-4" />
                    <span className="font-medium">Kids Hub</span>
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
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Create Something Magical</div>
                      <a href="/printables/certificate-maker" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17l-5 3 1.9-5.9L4 9h6l2-6 2 6h6l-4.9 5.1L17 20z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">Certificate Maker</div>
                          <div className="text-[10px] text-slate-600 truncate">Editable name/date</div>
                        </div>
                      </a>
                      <a href="/printables/name-tracing-generator" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">Name Tracing</div>
                          <div className="text-[10px] text-slate-600 truncate">Personalized sheets</div>
                        </div>
                      </a>
                      <a href="/worksheets/handwriting-worksheet-maker" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">Handwriting Maker</div>
                          <div className="text-[10px] text-slate-600 truncate">Letters, words, sentences</div>
                        </div>
                      </a>
                    </div>

                    <div className="pl-4">
                      <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Free Worksheet PDFs</div>
                      <a href="/worksheets/multiplication-worksheets" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">Multiplication Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">2nd-5th grade free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/1st-grade-math-worksheets" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">1st Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Ten-frames, add/sub free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/2nd-grade-math-worksheets" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800">2nd Grade Math Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">Place value, add/sub free PDF</div>
                        </div>
                      </a>
                      <a href="/worksheets/reading-comprehension" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19h16M4 5h16M7 12h10" />
                        </svg>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">Reading Comprehension Worksheets</div>
                          <div className="text-[10px] text-slate-600 truncate">G1-G3 passages free PDF</div>
                        </div>
                      </a>
                    </div>

                      <div className="pl-4">
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Worksheets &amp; Quick Packs</div>
                        <a href="/printables" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H5a3 3 0 01-3-3v-2a3 3 0 013-3h14a3 3 0 013 3v2a3 3 0 01-3 3h-1" />
                            <rect x="6" y="14" width="12" height="8" rx="1" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">Printables</div>
                            <div className="text-[10px] text-slate-600 truncate">Puzzles, coloring, packs</div>
                          </div>
                        </a>
                      </div>

                      <div className="pl-4">
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Kids Games</div>
                        <a href="/kids/games/memory" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">Memory Match</div>
                            <div className="text-[10px] text-slate-600 truncate">Flip cards &amp; recall</div>
                          </div>
                        </a>
                        <a href="/kids/games/word-search" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">Word Search</div>
                            <div className="text-[10px] text-slate-600 truncate">Timed vocabulary</div>
                          </div>
                        </a>
                        <a href="/kids/games/puzzle" className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-50">
                          <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 3h3a2 2 0 012 2v3h-2.5a1.5 1.5 0 100 3H18v3h-2.5a1.5 1.5 0 100 3H18v3a2 2 0 01-2 2h-3v-2.5a1.5 1.5 0 10-3 0V22H8a2 2 0 01-2-2v-3h2.5a1.5 1.5 0 000-3H6V9h2.5a1.5 1.5 0 000-3H6V5a2 2 0 012-2h3v2.5a1.5 1.5 0 003 0V3z" />
                          </svg>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800">Puzzle Builder</div>
                            <div className="text-[10px] text-slate-600 truncate">Drag pieces to solve</div>
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
                            <div className="text-xs font-semibold text-slate-800">Typing Safari</div>
                            <div className="text-[10px] text-slate-600 truncate">Race animals typing</div>
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
                            <div className="text-xs font-semibold text-slate-800">Pattern Builder</div>
                            <div className="text-[10px] text-slate-600 truncate">Color sequences</div>
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
          <div className="hidden md:flex items-center space-x-4">
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
                        Dashboard
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
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
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={() => {
                window.location.href = '/';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="font-medium">Home</span>
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
              <span className="font-medium">Blog</span>
            </button>

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
              <span className="font-medium">Worksheets</span>
            </button>

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
              <span className="font-medium">Learn</span>
            </button>

            <button 
              onClick={() => {
                window.location.href = '/kids';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'kids' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <Puzzle className="w-4 h-4" />
              <span className="font-medium">Kids Hub</span>
            </button>

            <button 
              onClick={() => {
                window.location.href = '/printables';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'printables' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <span className="pl-5 inline-flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H5a3 3 0 01-3-3v-2a3 3 0 013-3h14a3 3 0 013 3v2a3 3 0 01-3 3h-1" />
                  <rect x="6" y="14" width="12" height="8" rx="1" />
                </svg>
                <span className="font-medium">Printables</span>
              </span>
            </button>

              <div className="pt-2 border-t border-slate-200 mt-2">
                <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Create Something Magical</div>
                <button 
                  onClick={() => {
                    window.location.href = '/worksheets/handwriting-worksheet-maker';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <span className="pl-8">Handwriting Worksheet Maker</span>
                </button>

                <button 
                  onClick={() => {
                    window.location.href = '/printables/name-tracing-generator';
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <span className="pl-8">Name Tracing Generator</span>
                </button>
              </div>

            <button 
              onClick={() => {
                window.location.href = '/worksheets/1st-grade-math-worksheets';
                setShowMobileMenu(false);
              }} 
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <span className="pl-8">1st Grade Math Worksheets</span>
            </button>

            <button 
              onClick={() => {
                window.location.href = '/worksheets/2nd-grade-math-worksheets';
                setShowMobileMenu(false);
              }} 
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <span className="pl-8">2nd Grade Math Worksheets</span>
            </button>

            <button
              onClick={() => {
                window.location.href = '/worksheets/reading-comprehension';
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <span className="pl-8">Reading Comprehension</span>
            </button>

            <div className="pt-2 border-t border-slate-200 mt-2">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Kids Games</div>
              {[
                { href: '/kids/games/memory', label: 'Memory Match' },
                { href: '/kids/games/word-search', label: 'Word Search Game' },
                { href: '/kids/games/puzzle', label: 'Puzzle Builder' },
                { href: '/kids/games/typing', label: 'Typing Safari' },
                { href: '/kids/games/pattern', label: 'Pattern Builder' },
              ].map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => {
                    window.location.href = href;
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <span className="pl-8">{label}</span>
                </button>
              ))}
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
                  <span className="font-medium">Dashboard</span>
                </button>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setShowMobileMenu(false);
                  }} 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
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
                  <span className="font-medium">Sign In</span>
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