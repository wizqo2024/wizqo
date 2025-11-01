import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';

export default function CertificateMakerPage() {
  const [recipient, setRecipient] = React.useState<string>('');
  const [awardTitle, setAwardTitle] = React.useState<string>('Certificate of Achievement');
  const [reason, setReason] = React.useState<string>('For outstanding effort and kindness');
  const [date, setDate] = React.useState<string>('');
  const [issuer, setIssuer] = React.useState<string>('');
  const [theme, setTheme] = React.useState<'classic' | 'rainbow' | 'space' | 'animals'>('classic');
  const [fontStyle, setFontStyle] = React.useState<'print' | 'cursive' | 'serif' | 'comic' | 'handwritten'>('print');
  const [textColorOverride, setTextColorOverride] = React.useState<string>('');
  const [accentColorOverride, setAccentColorOverride] = React.useState<string>('');

  const colors = React.useMemo(() => {
    switch (theme) {
      case 'rainbow': return { border: '#f59e0b', accent: '#8b5cf6', text: '#111827', badge: '#ef4444' };
      case 'space': return { border: '#0ea5e9', accent: '#14b8a6', text: '#0f172a', badge: '#6366f1' };
      case 'animals': return { border: '#22c55e', accent: '#f97316', text: '#111827', badge: '#10b981' };
      default: return { border: '#64748b', accent: '#0ea5e9', text: '#0f172a', badge: '#f59e0b' };
    }
  }, [theme]);

  const fontStacks = React.useMemo(() => ({
    print: "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial",
    cursive: "'Brush Script MT', 'Segoe Script', 'Snell Roundhand', 'Dancing Script', 'Pacifico', cursive",
    serif: "Georgia, 'Times New Roman', serif",
    comic: "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', cursive",
    handwritten: "'Patrick Hand', 'Indie Flower', 'Bradley Hand', cursive"
  }), []);

  const effective = React.useMemo(() => ({
    text: textColorOverride || colors.text,
    accent: accentColorOverride || colors.accent,
    fontFamily: fontStacks[fontStyle]
  }), [textColorOverride, accentColorOverride, colors, fontStyle, fontStacks]);

  const formattedDate = React.useMemo(() => {
    if (!date) return '';
    // HTML date input returns YYYY-MM-DD; format to "Mon D, YYYY"
    try {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return date;
    } catch {
      return date;
    }
  }, [date]);

  function printPreview() {
    try {
      const sheet = document.getElementById('certificate-sheet');
      if (!sheet) return;
      const svg = sheet.querySelector('svg');
      const content = svg ? (svg as SVGElement).outerHTML : sheet.innerHTML;
      const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>Print</title>
<style>
  @page { size: 11in 8.5in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 11in; height: 8.5in; }
  #frame { position: relative; width: 11in; height: 8.5in; overflow: hidden; background: #fff; }
  svg { position: absolute; left: 0.25in; top: 0.25in; width: 10.5in; height: 8in; }
</style>
</head><body><div id="frame">${content}</div></body></html>`;
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(html);
      doc.close();
      const doPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {}
        setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 1000);
      };
      if (iframe.contentWindow?.document.readyState === 'complete') doPrint();
      else iframe.onload = doPrint;
    } catch {}
  }

  const svg = (
    <svg viewBox="0 0 1120 800" role="img" aria-label="Certificate preview">
      {/* Border */}
      <rect x="10" y="10" width="1100" height="780" rx="20" fill="#fff" stroke={colors.border} strokeWidth="8" />
      <rect x="26" y="26" width="1068" height="748" rx="14" fill="#fff" stroke={colors.accent} strokeDasharray="12 10" strokeWidth="3" />
      {/* Badge */}
      <circle cx="1000" cy="100" r="36" fill={colors.badge} />
      <text x="1000" y="110" textAnchor="middle" fontSize="28" fill="#fff">★</text>
      {/* Title */}
      <text x="560" y="200" textAnchor="middle" fontSize="48" fontWeight="800" fill={effective.text} fontFamily={effective.fontFamily}
        style={{ letterSpacing: '1px' }}>
        {awardTitle || 'Certificate of Achievement'}
      </text>
      {/* Recipient */}
      <text x="560" y="300" textAnchor="middle" fontSize="36" fill={effective.text} fontFamily={effective.fontFamily}>
        Awarded to
      </text>
      <text x="560" y="360" textAnchor="middle" fontSize="56" fontWeight="700" fill={effective.accent} fontFamily={effective.fontFamily}
        style={{ letterSpacing: '1px' }}>
        {recipient || 'Your Name Here'}
      </text>
      {/* Reason */}
      <foreignObject x="160" y="420" width="800" height="120">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: 'center', color: effective.text, fontSize: 24, whiteSpace: 'pre-line', fontFamily: effective.fontFamily as any }}>
          {reason || 'For outstanding effort and kindness'}
        </div>
      </foreignObject>
      {/* Footer lines */}
      <line x1="200" y1="620" x2="460" y2="620" stroke="#94a3b8" strokeWidth="2" />
      <text x="330" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>Date{formattedDate ? `: ${formattedDate}` : ''}</text>
      <line x1="660" y1="620" x2="920" y2="620" stroke="#94a3b8" strokeWidth="2" />
      <text x="790" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>Signature{issuer ? `: ${issuer}` : ''}</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="kids" />
      {/* JSON-LD Structured Data */}
      {(() => {
        const canonical = 'https://wizqo.com/printables/certificate-maker';
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wizqo.com/' },
            { '@type': 'ListItem', position: 2, name: 'Printables', item: 'https://wizqo.com/printables' },
            { '@type': 'ListItem', position: 3, name: 'Certificate Maker', item: canonical }
          ]
        } as const;
        const faqLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Is this certificate maker free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can customize and print your certificates for free.' } },
            { '@type': 'Question', name: 'How do I print or save as PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Click “Print / Save as PDF” and choose your browser’s Save as PDF option.' } }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Free Printable Certificate Maker (Cute Themes)</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-slate-700 text-sm max-w-3xl">Create your own certificate online for free. Edit name, award reason, date, and signature — pick a cute theme and print instantly.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left controls */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="space-y-3">
              <label className="text-sm text-slate-700">Recipient name
                <input value={recipient} onChange={e=>setRecipient(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Student name" />
              </label>
              <label className="text-sm text-slate-700">Award title
                <input value={awardTitle} onChange={e=>setAwardTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Certificate of Achievement" />
              </label>
              <label className="text-sm text-slate-700">Reason/message
                <textarea value={reason} onChange={e=>setReason(e.target.value)} className="mt-1 w-full h-20 px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="For outstanding effort and kindness" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">Date
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </label>
                <label className="text-sm text-slate-700">Signature/Issuer
                  <input value={issuer} onChange={e=>setIssuer(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Teacher / Parent" />
                </label>
              </div>
              <label className="text-sm text-slate-700">Theme
                <select value={theme} onChange={e=>setTheme(e.target.value as any)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="classic">Classic</option>
                  <option value="rainbow">Rainbow</option>
                  <option value="space">Space</option>
                  <option value="animals">Animals</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">Font style
                <select value={fontStyle} onChange={e=>setFontStyle(e.target.value as any)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="print">Print (Sans)</option>
                  <option value="cursive">Cursive (Script)</option>
                  <option value="serif">Serif (Formal)</option>
                  <option value="comic">Comic (Playful)</option>
                  <option value="handwritten">Handwritten</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">Text color
                  <input type="color" value={textColorOverride || ''} onChange={e=>setTextColorOverride(e.target.value)} className="mt-1 h-10 w-full border border-slate-300 rounded-lg" />
                </label>
                <label className="text-sm text-slate-700">Name color
                  <input type="color" value={accentColorOverride || ''} onChange={e=>setAccentColorOverride(e.target.value)} className="mt-1 h-10 w-full border border-slate-300 rounded-lg" />
                </label>
              </div>
              <button
                type="button"
                onClick={() => { setTextColorOverride(''); setAccentColorOverride(''); }}
                className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs"
              >
                Reset colors to theme
              </button>
              <div className="pt-2">
                <button onClick={printPreview} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm shadow">
                  <span>🖨️</span>
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right preview */}
          <div className="md:col-span-8">
            <div id="certificate-sheet" className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
              {svg}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
