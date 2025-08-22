import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🎉</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">
              Great Job on Day 1!
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 mb-6">
            You've completed your first lesson. Create a free account to continue your learning journey and unlock Days 2-7.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={onLogin}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              Continue with Google
            </Button>
            <Button 
              onClick={onLogin}
              variant="outline"
              className="w-full"
            >
              Continue with Email
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy. No spam, ever.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
