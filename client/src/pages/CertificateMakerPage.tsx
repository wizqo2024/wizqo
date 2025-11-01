import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function CertificateMakerPage() {
  const [recipient, setRecipient] = React.useState<string>('');
  const [awardTitle, setAwardTitle] = React.useState<string>('Certificate of Achievement');
  const [reason, setReason] = React.useState<string>('For outstanding effort and kindness');
  const [date, setDate] = React.useState<string>('');
  const [issuer, setIssuer] = React.useState<string>('');
  const [theme, setTheme] = React.useState<'classic' | 'rainbow' | 'space' | 'animals' | 'gold' | 'confetti'>('classic');
  const [fontStyle, setFontStyle] = React.useState<'print' | 'cursive' | 'serif' | 'comic' | 'handwritten'>('print');
  const [textColorOverride, setTextColorOverride] = React.useState<string>('');
  const [accentColorOverride, setAccentColorOverride] = React.useState<string>('');
  const [templateStyle, setTemplateStyle] = React.useState<'simple' | 'ribbon' | 'medal' | 'trophy' | 'academic'>('simple');
  const [badgeIcon, setBadgeIcon] = React.useState<'star' | 'trophy' | 'medal' | 'book' | 'rocket' | 'cap'>('star');
  const [inkFriendly, setInkFriendly] = React.useState<boolean>(false);
  const [bgStyle, setBgStyle] = React.useState<'none' | 'wavy' | 'bands' | 'rosette'>('none');

  const colors = React.useMemo(() => {
    const base = (obj: any) => inkFriendly ? { ...obj, border: '#64748b', accent: '#111827', badge: '#64748b' } : obj;
    switch (theme) {
      case 'rainbow': return base({ border: '#f59e0b', accent: '#8b5cf6', text: '#111827', badge: '#ef4444' });
      case 'space': return base({ border: '#0ea5e9', accent: '#14b8a6', text: '#0f172a', badge: '#6366f1' });
      case 'animals': return base({ border: '#22c55e', accent: '#f97316', text: '#111827', badge: '#10b981' });
      case 'gold': return base({ border: '#d4af37', accent: '#b7791f', text: '#111827', badge: '#fbbf24' });
      case 'confetti': return base({ border: '#fb7185', accent: '#22d3ee', text: '#111827', badge: '#f59e0b' });
      default: return base({ border: '#64748b', accent: '#0ea5e9', text: '#0f172a', badge: '#f59e0b' });
    }
  }, [theme, inkFriendly]);

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

  const reactId = React.useId();
  const backgroundClipId = React.useMemo(() => `certificate-bg-${reactId.replace(/:/g, '')}`, [reactId]);
  const goldGradientId = React.useMemo(() => `${backgroundClipId}-gold-gradient`, [backgroundClipId]);

  const backgroundElements = React.useMemo(() => {
    if (bgStyle === 'none') return null;

    if (bgStyle === 'bands') {
      const palette = inkFriendly
        ? [
            { color: '#cbd5f5', opacity: 0.32 },
            { color: '#94a3b8', opacity: 0.28 },
            { color: '#e2e8f0', opacity: 0.36 },
            { color: '#94a3b8', opacity: 0.26 }
          ]
        : [
            { color: '#22d3ee', opacity: 0.3 },
            { color: '#a855f7', opacity: 0.26 },
            { color: '#fb7185', opacity: 0.28 },
            { color: '#34d399', opacity: 0.24 }
          ];

      return (
        <g aria-hidden="true" transform="rotate(-18 560 400)">
          {palette.map((band, index) => (
            <rect
              key={`band-${index}`}
              x={-240 + index * 46}
              y={120 + index * 68}
              width={1340}
              height={54 - index * 6}
              fill={band.color}
              opacity={band.opacity}
            />
          ))}
        </g>
      );
    }

    if (bgStyle === 'wavy') {
      const crest = inkFriendly ? '#94a3b8' : colors.accent;
      const trough = inkFriendly ? '#cbd5f5' : colors.badge;
      return (
        <g aria-hidden="true" opacity={inkFriendly ? 0.32 : 0.42}>
          <path d="M0,220 C220,140 420,300 640,220 C860,140 1060,280 1120,200 L1120,0 L0,0 Z" fill={crest} />
          <path d="M0,720 C220,660 420,780 620,720 C820,660 1020,760 1120,720 L1120,800 L0,800 Z" fill={trough} />
        </g>
      );
    }

    if (bgStyle === 'rosette') {
      const stroke = inkFriendly ? '#94a3b8' : colors.accent;
      return (
        <g aria-hidden="true" opacity={inkFriendly ? 0.28 : 0.34}>
          {Array.from({ length: 28 }).map((_, index) => (
            <ellipse
              key={`petal-${index}`}
              cx={560}
              cy={400}
              rx={240}
              ry={32 - (index % 2 === 0 ? 6 : 0)}
              fill="none"
              stroke={stroke}
              strokeWidth={index % 2 === 0 ? 1.8 : 1.2}
              transform={`rotate(${(360 / 28) * index} 560 400)`}
            />
          ))}
        </g>
      );
    }

    return null;
  }, [bgStyle, colors, inkFriendly]);

  const badgePosition = React.useMemo(() => {
    if (templateStyle === 'medal' || templateStyle === 'trophy') {
      return { cx: 90, cy: 100 };
    }
    return { cx: 1000, cy: 100 };
  }, [templateStyle]);

  const badgeGraphic = React.useMemo(() => {
    const baseFill = inkFriendly ? '#e2e8f0' : '#ffffff';
    const strokeColor = inkFriendly ? '#1f2937' : '#0f172a';
    const accentFill = inkFriendly ? '#94a3b8' : colors.accent;

    const centerTransform = `translate(${badgePosition.cx} ${badgePosition.cy})`;

    switch (badgeIcon) {
      case 'trophy':
        return (
          <g transform={centerTransform} aria-hidden="true">
            <path d="M-16 -12h32v6c0 7-6 12-16 13s-16-6-16-13z" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} strokeLinejoin="round" />
            <path d="M-20 -8c0 6 4 11 10 12" stroke={accentFill} strokeWidth={2} strokeLinecap="round" fill="none" />
            <path d="M20 -8c0 6-4 11-10 12" stroke={accentFill} strokeWidth={2} strokeLinecap="round" fill="none" />
            <rect x="-8" y="0" width="16" height="8" rx="2" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} />
            <rect x="-11" y="7" width="22" height="4" rx="1.5" fill={accentFill} opacity={inkFriendly ? 0.55 : 0.85} />
            <circle cx="0" cy="-4" r="4" fill={accentFill} opacity={inkFriendly ? 0.6 : 0.9} />
          </g>
        );
      case 'medal':
        return (
          <g transform={centerTransform} aria-hidden="true">
            <path d="M-10 -24h20l4 16h-12l-2-6-2 6h-12z" fill={accentFill} opacity={inkFriendly ? 0.45 : 0.75} />
            <circle r="14" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} />
            <polygon points="0,-6 4,-1 10,0 5,4 7,10 0,6 -7,10 -5,4 -10,0 -4,-1" fill={accentFill} opacity={inkFriendly ? 0.6 : 0.9} />
          </g>
        );
      case 'book':
        return (
          <g transform={centerTransform} aria-hidden="true">
            <path d="M-16 -14h13c3 0 5 2 5 5v20c0 3-2 5-5 5h-13z" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} />
            <path d="M2 -14h13c3 0 5 2 5 5v20c0 3-2 5-5 5H2z" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} />
            <rect x="-2" y="-14" width="4" height="24" fill={accentFill} opacity={inkFriendly ? 0.4 : 0.65} />
            <line x1="-10" y1="-6" x2="-3" y2="-6" stroke={accentFill} strokeWidth={2} strokeLinecap="round" />
            <line x1="-10" y1="0" x2="-3" y2="0" stroke={accentFill} strokeWidth={2} strokeLinecap="round" />
            <line x1="4" y1="-6" x2="11" y2="-6" stroke={accentFill} strokeWidth={2} strokeLinecap="round" />
            <line x1="4" y1="0" x2="11" y2="0" stroke={accentFill} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
      case 'rocket':
        return (
          <g transform={centerTransform} aria-hidden="true">
            <path d="M0 -18c-7 6-9 16-9 24c0 4 2 8 5 10h8c3-2 5-6 5-10c0-8-2-18-9-24z" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} strokeLinejoin="round" />
            <circle cx="0" cy="-4" r="5" fill={accentFill} opacity={inkFriendly ? 0.6 : 0.9} />
            <path d="M-9 7l-8 10l8-2l4 6l4-6l8 2l-8-10z" fill={accentFill} opacity={inkFriendly ? 0.45 : 0.8} />
          </g>
        );
      case 'cap':
        return (
          <g transform={centerTransform} aria-hidden="true">
            <polygon points="0,-14 22,-6 0,2 -22,-6" fill={baseFill} stroke={strokeColor} strokeWidth={1.6} strokeLinejoin="round" />
            <path d="M-12 -4v10c0 5 6 8 12 8s12-3 12-8v-10" fill="none" stroke={strokeColor} strokeWidth={1.6} />
            <path d="M8 -5v12l6 4" stroke={accentFill} strokeWidth={2} strokeLinecap="round" fill="none" />
            <circle cx="8" cy="-6" r="3" fill={accentFill} opacity={inkFriendly ? 0.6 : 0.9} />
          </g>
        );
      default: {
        const outer = '0,-15 4.5,-5 15,-5 6,2 9,13 0,7 -9,13 -6,2 -15,-5 -4.5,-5';
        const inner = '0,-8 3,-2 8,-2 4,1 5,7 0,4 -5,7 -4,1 -8,-2 -3,-2';
        return (
          <g transform={centerTransform} aria-hidden="true">
            <polygon points={outer} fill={baseFill} stroke={strokeColor} strokeWidth={1.6} strokeLinejoin="round" />
            <polygon points={inner} fill={accentFill} opacity={inkFriendly ? 0.6 : 0.9} />
          </g>
        );
      }
    }
  }, [badgeIcon, badgePosition, colors.accent, inkFriendly]);

  const showGoldGradient = theme === 'gold' || templateStyle === 'academic';

  const svg = (
    <svg viewBox="0 0 1120 800" role="img" aria-label="Certificate preview">
      <defs>
        <clipPath id={backgroundClipId}>
          <rect x="24" y="24" width="1072" height="752" rx="18" />
        </clipPath>
        {showGoldGradient ? (
          <linearGradient id={goldGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={inkFriendly ? '#9ca3af' : '#fef3c7'} />
            <stop offset="50%" stopColor={inkFriendly ? '#6b7280' : '#d4af37'} />
            <stop offset="100%" stopColor={inkFriendly ? '#9ca3af' : '#fde68a'} />
          </linearGradient>
        ) : null}
      </defs>

      {backgroundElements && (
        <g
          clipPath={`url(#${backgroundClipId})`}
          opacity={bgStyle === 'none' ? 0 : 1}
          style={{ transition: 'opacity 0.35s ease-in-out' }}
          pointerEvents="none"
        >
          {backgroundElements}
        </g>
      )}

      {/* Border */}
      {showGoldGradient ? (
        <>
          <rect x="10" y="10" width="1100" height="780" rx="20" fill="#fff" stroke={`url(#${goldGradientId})`} strokeWidth="10" />
          {templateStyle === 'academic' && (
            <>
              <rect x="34" y="34" width="1052" height="732" rx="14" fill="none" stroke={inkFriendly ? '#475569' : '#b7791f'} strokeWidth="3" />
              {/* corner ornaments */}
              <g opacity="0.35" stroke={inkFriendly ? '#94a3b8' : '#b45309'} fill="none" strokeWidth="3">
                <path d="M60 60 L120 60 L60 120 Z" />
                <path d="M1060 60 L1000 60 L1060 120 Z" />
                <path d="M60 740 L120 740 L60 680 Z" />
                <path d="M1060 740 L1000 740 L1060 680 Z" />
              </g>
            </>
          )}
        </>
      ) : (
        <rect x="10" y="10" width="1100" height="780" rx="20" fill="#fff" stroke={colors.border} strokeWidth="8" />
      )}
      {/* Inner border / ribbons */}
      {templateStyle === 'ribbon' ? (
        <>
          <polygon points="10,10 140,10 10,140" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="1110,10 980,10 1110,140" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="10,790 140,790 10,660" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="1110,790 980,790 1110,660" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
        </>
      ) : templateStyle === 'academic' ? (
        <>
          <rect x="50" y="50" width="1020" height="700" rx="10" fill="#fff" stroke={colors.accent} strokeWidth="2" />
        </>
      ) : (
        <rect x="26" y="26" width="1068" height="748" rx="14" fill="#fff" stroke={colors.accent} strokeDasharray="12 10" strokeWidth="3" />
      )}
      {/* Badge */}
      <circle cx={badgePosition.cx} cy={badgePosition.cy} r={36} fill={colors.badge} />
      {badgeGraphic}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50">
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
            { '@type': 'Question', name: 'How do I print or save as PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Click ?Print / Save as PDF? and choose your browser?s Save as PDF option.' } }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 lg:pb-28 space-y-10">
        <header className="space-y-4 text-center lg:text-left">
          <Badge variant="secondary" className="mx-auto w-fit rounded-full border border-indigo-100 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 lg:mx-0">
            Printables
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Design a printable certificate they&apos;ll be proud to receive
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 lg:mx-0 lg:text-base">
            Personalize the name, award reason, colors, and badge. Preview updates instantly and print in one click?no design skills required.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_1fr] items-start lg:items-stretch lg:pb-12">
          <div className="lg:sticky lg:top-24 lg:pr-2">
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur-sm lg:h-[calc(100vh-8rem)] lg:min-h-[680px]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" aria-hidden />
              <div className="flex flex-col gap-4 px-6 pb-6 pt-7 sm:px-8 lg:flex-1 lg:overflow-y-auto">
                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">General details</p>
                    <h2 className="text-lg font-semibold text-slate-900">Personalize the award</h2>
                    <p className="text-sm text-slate-500">Tell us who the certificate is for and why they&apos;re being celebrated.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-slate-700">Recipient name</Label>
                      <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Student name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awardTitle" className="text-slate-700">Award title</Label>
                      <Input id="awardTitle" value={awardTitle} onChange={e => setAwardTitle(e.target.value)} placeholder="Certificate of Achievement" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-slate-700">Reason / message</Label>
                      <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="For outstanding effort and kindness" className="min-h-[120px]" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-700">Date</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuer" className="text-slate-700">Signature / issuer</Label>
                        <Input id="issuer" value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="Teacher / Parent" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Style &amp; layout</p>
                    <h2 className="text-lg font-semibold text-slate-900">Pick the look</h2>
                    <p className="text-sm text-slate-500">Experiment with themes, layouts, badges, and background accents.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-slate-700">Theme</Label>
                      <div className="relative">
                        <select
                          id="theme"
                          value={theme}
                          onChange={e => setTheme(e.target.value as typeof theme)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="classic">Classic</option>
                          <option value="rainbow">Rainbow</option>
                          <option value="space">Space</option>
                          <option value="animals">Animals</option>
                          <option value="gold">Gold (formal)</option>
                          <option value="confetti">Confetti (colorful)</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">?</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateStyle" className="text-slate-700">Template</Label>
                      <div className="relative">
                        <select
                          id="templateStyle"
                          value={templateStyle}
                          onChange={e => setTemplateStyle(e.target.value as typeof templateStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="simple">Simple border</option>
                          <option value="ribbon">Corner ribbons</option>
                          <option value="medal">Medal badge (top-left)</option>
                          <option value="trophy">Trophy badge (top-left)</option>
                          <option value="academic">Academic border (gold)</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">?</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badgeIcon" className="text-slate-700">Badges</Label>
                      <div className="relative">
                        <select
                          id="badgeIcon"
                          value={badgeIcon}
                          onChange={e => setBadgeIcon(e.target.value as typeof badgeIcon)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="star">Star badge</option>
                          <option value="trophy">Trophy badge</option>
                          <option value="medal">Medal badge</option>
                          <option value="book">Book badge</option>
                          <option value="rocket">Rocket badge</option>
                          <option value="cap">Graduation cap badge</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">?</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bgStyle" className="text-slate-700">Background style</Label>
                      <div className="relative">
                        <select
                          id="bgStyle"
                          value={bgStyle}
                          onChange={e => setBgStyle(e.target.value as typeof bgStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="none">None</option>
                          <option value="wavy">Wavy bands</option>
                          <option value="bands">Diagonal bands</option>
                          <option value="rosette">Center rosette</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">?</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontStyle" className="text-slate-700">Font style</Label>
                      <div className="relative">
                        <select
                          id="fontStyle"
                          value={fontStyle}
                          onChange={e => setFontStyle(e.target.value as typeof fontStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="print">Print (Sans)</option>
                          <option value="cursive">Cursive (Script)</option>
                          <option value="serif">Serif (Formal)</option>
                          <option value="comic">Comic (Playful)</option>
                          <option value="handwritten">Handwritten</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">?</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex flex-1 flex-col gap-4 pb-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Colors &amp; print</p>
                    <h2 className="text-lg font-semibold text-slate-900">Make it print-ready</h2>
                    <p className="text-sm text-slate-500">Fine-tune colors and export settings so everything looks crisp on paper.</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Ink-friendly colors</p>
                        <p className="text-xs text-slate-500">Reduce heavy fills for economical home printing.</p>
                      </div>
                      <Switch checked={inkFriendly} onCheckedChange={setInkFriendly} aria-label="Toggle ink-friendly colors" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="textColor" className="text-slate-700">Text color</Label>
                        <input
                          id="textColor"
                          type="color"
                          value={textColorOverride || colors.text}
                          onChange={e => setTextColorOverride(e.target.value)}
                          className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accentColor" className="text-slate-700">Name color</Label>
                        <input
                          id="accentColor"
                          type="color"
                          value={accentColorOverride || colors.accent}
                          onChange={e => setAccentColorOverride(e.target.value)}
                          className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-inner"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setTextColorOverride(''); setAccentColorOverride(''); }}
                        className="rounded-full border-slate-300 bg-white/80 text-slate-600 hover:bg-slate-100"
                      >
                        Reset colors to theme
                      </Button>
                    </div>
                    <div className="mt-auto pt-2">
                      <Button
                        onClick={printPreview}
                        className="w-full justify-center rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-sm font-semibold shadow-lg hover:from-purple-600/90 hover:via-indigo-600/90 hover:to-blue-600/90"
                        size="lg"
                      >
                        <span role="img" aria-hidden>???</span>
                        <span>Print / Save as PDF</span>
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="relative flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:h-[calc(100vh-8rem)] lg:min-h-[680px] lg:overflow-hidden">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Live preview</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Watch your certificate update in real time</h2>
                  <p className="text-sm text-slate-500">Sized perfectly for US letter paper (landscape).</p>
                </div>
                <div className="w-full rounded-full border border-white/80 bg-white/70 px-4 py-2 text-center text-xs font-semibold text-slate-500 shadow-sm lg:w-auto">
                  Print-ready landscape layout
                </div>
              </div>
              <div className="relative flex-1 min-h-[480px] lg:min-h-[520px]">
                <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-br from-indigo-300/25 via-purple-300/20 to-amber-200/25 blur-3xl" aria-hidden />
                <div className="relative flex h-full flex-col rounded-[32px] border border-white/70 bg-white p-4 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.45)]">
                  <div className="flex-1 overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-50/60 p-4 shadow-inner">
                    <div id="certificate-sheet" className="h-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                      {svg}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
