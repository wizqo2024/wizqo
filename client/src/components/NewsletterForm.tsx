import React from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface NewsletterFormProps {
    variant?: 'footer' | 'blog' | 'inline';
    className?: string;
}

export function NewsletterForm({ variant = 'inline', className = '' }: NewsletterFormProps) {
    const { t } = useTranslation();
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

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
            console.error('Newsletter subscription error:', err);
            setStatus('error');
        }
    };

    const isFooter = variant === 'footer';
    const isBlog = variant === 'blog';

    if (status === 'success') {
        return (
            <div className={`bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-in fade-in zoom-in duration-300 ${className}`}>
                <p className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                    <span>✨</span> {t('pages.blog.newsletter.success') || 'Welcome to the club!'}
                </p>
            </div>
        );
    }

    return (
        <form className={`flex flex-col gap-3 ${className}`} onSubmit={handleSubmit}>
            <div className={`flex flex-col sm:flex-row gap-3 ${isFooter ? 'sm:flex-row' : ''}`}>
                <div className="relative flex-1">
                    <input
                        type="email"
                        placeholder={t('pages.blog.newsletter.placeholder') || 'Enter your email'}
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg text-sm transition-all focus:ring-2 focus:ring-purple-500 outline-none
              ${isFooter
                                ? 'bg-slate-800 border-0 text-white placeholder-slate-500'
                                : isBlog
                                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                                    : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                        required
                        disabled={status === 'loading'}
                        aria-label="Email address"
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`px-6 py-3 font-bold rounded-lg text-sm transition-all active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
            ${isFooter
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : isBlog
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                >
                    {status === 'loading'
                        ? (t('pages.blog.newsletter.subscribing') || 'Joining...')
                        : (t('pages.blog.newsletter.subscribe') || 'Join')}
                </button>
            </div>

            {status === 'error' && (
                <p className="text-red-400 text-[11px] font-medium animate-in slide-in-from-top-1 px-1">
                    {t('pages.blog.newsletter.failedDesc') || 'Something went wrong. Please try again later.'}
                </p>
            )}
            {status === 'exists' && (
                <p className="text-blue-400 text-[11px] font-medium animate-in slide-in-from-top-1 px-1">
                    You're already on the list! Stay tuned for updates.
                </p>
            )}
        </form>
    );
}
