import React, { useState } from 'react';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';

export function ContactPage() {
  const { t, language, isRTL } = useTranslation()
  React.useEffect(() => {}, [language])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t('pages.contact.toast.missingInfo'),
        description: t('pages.contact.toast.missingInfoDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('pages.contact.toast.thanks'),
          description: t('pages.contact.toast.thanksDesc'),
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: 'General',
          message: ''
        });
      } else {
        toast({
          title: t('pages.contact.toast.failed'),
          description: result.error || t('pages.contact.toast.failedDesc'),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t('pages.contact.toast.networkError'),
        description: t('pages.contact.toast.networkErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <UnifiedNavigation currentPage="contact" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            {t('pages.contact.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6">
            {t('pages.contact.subtitle')}
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('pages.contact.loveToHear.title')}</h2>
            <p className="text-slate-600 leading-relaxed">
              {t('pages.contact.loveToHear.description')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('pages.contact.form.title')}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('pages.contact.form.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('pages.contact.form.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('pages.contact.form.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('pages.contact.form.emailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('pages.contact.form.topic')}</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="General">{t('pages.contact.subjects.general')}</option>
                  <option value="Suggest a Hobby">{t('pages.contact.subjects.suggestHobby')}</option>
                  <option value="Report an Issue">{t('pages.contact.subjects.reportIssue')}</option>
                  <option value="Other">{t('pages.contact.subjects.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('pages.contact.form.message')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('pages.contact.form.messagePlaceholder')}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('pages.contact.form.sending') : t('pages.contact.form.send')}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('pages.contact.email.title')}</h3>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">{t('pages.contact.email.reachUs')}</h4>
                  <p className="text-lg font-semibold text-purple-600">admin@wizqo.com</p>
                  <p className="text-sm text-slate-500">{t('pages.contact.email.responseTime')}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <h4 className="font-semibold text-slate-900">{t('pages.contact.email.builtFor')}</h4>
                </div>
                <p className="text-slate-600">{t('pages.contact.email.thanks')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}