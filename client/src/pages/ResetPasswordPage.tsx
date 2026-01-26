import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function ResetPasswordPage() {
  const { t, isRTL } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();


  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError(t('pages.resetPassword.invalidLink'));
        return;
      }
    };

    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError(t('pages.resetPassword.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('pages.resetPassword.passwordsNotMatch'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: t('pages.resetPassword.updateSuccess'),
        description: t('pages.resetPassword.updateSuccessDesc'),
      });

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error: any) {
      setError(error?.message || t('pages.resetPassword.updateFailedDesc'));
      toast({
        title: t('pages.resetPassword.updateFailed'),
        description: error?.message || t('pages.resetPassword.updateFailedDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-lg p-8 w-full max-w-md text-center shadow-xl">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('pages.resetPassword.successTitle')}</h1>
            <p className="text-gray-600">{t('pages.resetPassword.successMessage')}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              {t('pages.resetPassword.successDescription')}
            </p>
          </div>

          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {t('pages.resetPassword.goToSignIn')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('pages.resetPassword.title')}</h1>
          <p className="text-gray-600">{t('pages.resetPassword.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              {t('pages.resetPassword.newPassword')}
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder={t('pages.resetPassword.passwordPlaceholder')}
                required
                minLength={6}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? t('pages.resetPassword.hidePassword') : t('pages.resetPassword.showPassword')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-red-500 mt-1">{t('pages.resetPassword.passwordMinLength')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              {t('pages.resetPassword.confirmPassword')}
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder={t('pages.resetPassword.confirmPlaceholder')}
                required
                minLength={6}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? t('pages.resetPassword.hidePassword') : t('pages.resetPassword.showPassword')}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{t('pages.resetPassword.passwordsNotMatch')}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading || password.length < 6 || password !== confirmPassword}
          >
            {loading ? t('pages.resetPassword.updatingPassword') : t('pages.resetPassword.updatePassword')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('pages.resetPassword.rememberPassword')}{' '}
                      <button
            onClick={() => window.location.href = '/'}
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
              {t('pages.resetPassword.signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}