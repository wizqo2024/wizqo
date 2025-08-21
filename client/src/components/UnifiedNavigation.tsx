import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { WizqoLogo } from './WizqoLogo';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

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
            <button onClick={() => window.location.href = '/#/'} className="flex items-center space-x-3 cursor-pointer">
              <WizqoLogo width={40} height={23} className="hover:opacity-80 transition-opacity" />
              <span className="text-xl font-bold text-slate-800">Wizqo</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => window.location.href = '/#/'} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'home' || currentPage === 'landing' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="font-medium">Home</span>
              </button>
              
              <button onClick={() => { window.location.href = '/#/generate'; }} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'generate' || currentPage === 'plan' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span className="font-medium">Learn</span>
              </button>
              
              <button onClick={() => window.location.href = '/#/blog'} className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                <span className="font-medium">Blog</span>
              </button>
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
                        href="#/dashboard"
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
                window.location.href = '/#/';
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
                window.location.href = '/#/generate';
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
                window.location.href = '/#/blog';
                setShowMobileMenu(false);
              }} 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${currentPage === 'blog' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <span className="font-medium">Blog</span>
            </button>

            {/* Mobile Account Section */}
            {user ? (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <button 
                  onClick={() => {
                    window.location.href = '#/dashboard';
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