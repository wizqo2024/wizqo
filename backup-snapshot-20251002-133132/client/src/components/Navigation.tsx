import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onBack: () => void;
  title?: string;
  progress?: {
    current: number;
    total: number;
  };
}

export function Navigation({ onBack, title, progress }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Wizqo</span>
              {title && <span className="text-slate-600">• {title}</span>}
            </div>
          </div>
          
          {progress && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                {progress.current} of {progress.total} completed
              </div>
              <div className="w-24 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
