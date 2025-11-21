import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/context/TranslationContext';
import { PRINTABLE_BUNDLE_SECTIONS, PRINTABLE_DOC_META } from '@/data/printableBundles';

const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden p-4';
// DOWNLOAD_NOTE will be translated in component

const WorksheetThumbnailCard = React.memo(function WorksheetThumbnailCard({ title, description, skills, age, href, docId }: { title: string; description: string; skills?: string; age?: string; href: string; docId?: string }) {
  const { t, language } = useTranslation();
  const level = docId ? PRINTABLE_DOC_META[docId]?.level : undefined;
  const previewUrl = href + (href.includes('?') ? '&preview=1' : '?preview=1');
  const finalHref = href.includes('?') ? `${href}&from=printables` : `${href}?from=printables`;
  const downloadHref = (href.includes('?') ? `${href}&autoprint=1` : `${href}?autoprint=1`) + `&from=printables`;
  
  // Use translations if docId is provided - memoize to prevent re-renders
  // Use language instead of t in dependencies to avoid re-renders when t function reference changes
  const translatedTitle = React.useMemo(() => {
    if (!docId) return title;
    const translated = t(`worksheets.${docId}.title`);
    return translated && translated !== `worksheets.${docId}.title` ? translated : title;
  }, [docId, title, language, t]);
  
  const translatedDescription = React.useMemo(() => {
    if (!docId) return description;
    const translated = t(`worksheets.${docId}.description`);
    return translated && translated !== `worksheets.${docId}.description` ? translated : description;
  }, [docId, description, language, t]);
  
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{translatedTitle}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed">{translatedDescription}</p>
      
      {(skills || age || level) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {level ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700">{t('pages.printables.level')} {level}</span> : null}
          {skills ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">{t('pages.printables.skills')} {skills}</span> : null}
          {age ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">{t('pages.printables.age')} {age}</span> : null}
        </div>
      )}
      
      {/* Worksheet Thumbnail Preview */}
      <div 
        className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
        onClick={() => window.open(finalHref, '_blank')}
        style={{ 
          height: '140px',
          aspectRatio: '2.5/1',
        }}
      >
        {/* Thumbnail content using iframe with preview mode */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '400%',
            height: '400%',
            pointerEvents: 'none',
          }}
          title={`Preview of ${title}`}
          loading="lazy"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
            {t('pages.printables.clickToView')}
          </div>
        </div>
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={finalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={`Open ${title} printable view`}
          >
            {t('pages.printables.preview')}
          </a>
          <a
            href={downloadHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:border-purple-300 transition-colors"
            aria-label={`Download ${title} as PDF`}
            title={t('pages.printables.downloadNote')}
          >
            {t('pages.printables.download')}
          </a>
        </div>
      </div>
    </article>
  );
});

function BundleButton({ section, className }: { section: string; className?: string }) {
  const { t } = useTranslation();
  const docs = PRINTABLE_BUNDLE_SECTIONS[section];
  if (!docs || docs.length === 0) return null;
  const params = new URLSearchParams({
    doc: 'bundle',
    items: docs.join(','),
    category: section,
    from: 'printables',
    autoprint: '1',
  });
  const url = `/print?${params.toString()}`;
  return (
    <a
      href={url}
      className={`${BUTTON_CLASS} ${className ?? ''}`.trim()}
      aria-label={`Download the ${section} printable bundle`}
      title={t('pages.printables.downloadNote')}
    >
      ⬇️ {t('pages.printables.download')}
    </a>
  );
}

export function PrintablesLandingPage() {
  const { t, isRTL } = useTranslation();
  
  React.useEffect(() => {
    // Ensure re-render on language change
  }, [t]);
  
  const [filterCategory, setFilterCategory] = React.useState<string>('All');
  const [packTime, setPackTime] = React.useState<'5' | '10' | '15'>('5');
  const [packAge, setPackAge] = React.useState<'k1' | 'k2' | 'g1' | 'g2' | '35' | '68'>('k2');
  const [packSkill, setPackSkill] = React.useState<'math' | 'focus' | 'reading' | 'stem' | 'creativity' | 'mixed'>('math');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState<boolean>(false);
  const path = (typeof window !== 'undefined' ? window.location.pathname : '/printables');
  const recentSet = React.useMemo(() => new Set<string>(['One-pagers']), []);
  const sectionVisibility = (cat: string) => (
    filterCategory === 'All' ||
    filterCategory === cat ||
    (filterCategory === 'Recent' && recentSet.has(cat))
  ) ? '' : 'hidden';

  // Derive pack focus from global filter to keep results aligned
  React.useEffect(() => {
    const map: Record<string, typeof packSkill> = {
      Coloring: 'creativity',
      Worksheets: 'math',
      Creative: 'creativity',
      Brain: 'focus',
      Geography: 'focus',
      Emotional: 'focus',
      Seasonal: 'mixed',
      Challenge: 'mixed',
      'One-pagers': 'stem',
      Recent: 'stem'
    };
    if (filterCategory in map) {
      setPackSkill(map[filterCategory] as any);
    } else if (filterCategory === 'All') {
      setPackSkill('mixed');
    }
  }, [filterCategory]);

  // Auto-scroll to a section when coming from print view with an anchor
  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = window.location.hash || '';
      const id = decodeURIComponent(raw.replace(/^#/, ''));
      if (!id) return;
      // Defer until after first paint so layout is ready
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    } catch {}
  }, []);

  // Show a floating "Scroll up" button after scrolling down a bit
  React.useEffect(() => {
    const onScroll = () => {
      try {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        setShowBackToTop(y > 200);
      } catch {}
    };
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll as any);
  }, []);

  const gridClass = filterCategory === 'All'
    ? 'grid sm:grid-cols-2 lg:grid-cols-2 gap-4'
    : 'grid sm:grid-cols-1 lg:grid-cols-2 gap-6';

  const quickLinks: { label: string; id: string }[] = [
    { label: 'Coloring', id: 'Coloring' },
    { label: 'Worksheets', id: 'Worksheets' },
    { label: 'Geography', id: 'Geography' },
    { label: 'Math by Grade', id: 'MathByGrade' },
    { label: 'Grade 1', id: 'Math-G1' },
    { label: 'Grade 2', id: 'Math-G2' },
    { label: 'Math — Numbers', id: 'Math-Numbers' },
    { label: 'Math — 4 Operations', id: 'Math-Operations' },
    { label: 'Creative', id: 'Creative' },
    { label: 'Brain & Focus', id: 'Brain' },
    { label: 'Emotional', id: 'Emotional' },
    { label: 'Seasonal', id: 'Seasonal' },
    { label: 'Challenge', id: 'Challenge' },
    { label: 'One‑pagers', id: 'One-pagers' },
  ];

  const scrollToSection = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowSidebar(false);
    } catch {}
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavigation currentPage="kids" />
      {/* Print-only Name/Date overlay for this page */}
      <style>{`
        @media print {
          @page { margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          .print-name-date { position: fixed; bottom: 0.35in; left: 0.5in; right: 0.5in; display: flex; justify-content: space-between; color: #334155; font-size: 12px; z-index: 9999; pointer-events: none; }
          .print-name-date .label { margin-right: 6px; }
          .print-name-date .line { border-bottom: 1px solid #94a3b8; min-width: 2.5in; height: 0.9em; display: inline-block; }
        }
      `}</style>
      <div className="hidden print:block print-name-date" aria-hidden>
        <div>
          <span className="label">Name</span>
          <span className="line" />
        </div>
        <div>
          <span className="label">Date</span>
          <span className="line" />
        </div>
      </div>
      {(() => {
        // SEO structured data: Breadcrumbs + ItemList of printables
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Kids Hub", item: "https://wizqo.com/kids" },
            { "@type": "ListItem", position: 3, name: "Printable Fun Learning Activities", item: "https://wizqo.com/printables" }
          ]
        } as const;
        const itemListLd = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Printable Fun Learning Activities for Kids",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Word Search – Animals", url: "https://wizqo.com/print?doc=ws-animals" },
            { "@type": "ListItem", position: 2, name: "Word Search – Space", url: "https://wizqo.com/print?doc=ws-space" },
            { "@type": "ListItem", position: 3, name: "Sudoku – 4×4 (Easy)", url: "https://wizqo.com/print" },
            { "@type": "ListItem", position: 4, name: "Sudoku – 6×6 (Medium)", url: "https://wizqo.com/print?doc=sudoku6" },
            { "@type": "ListItem", position: 5, name: "Coloring – Cute Animals", url: "https://wizqo.com/print" },
            { "@type": "ListItem", position: 6, name: "Spot‑the‑Difference – Playground", url: "https://wizqo.com/print?doc=spotdiff" }
          ]
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
          </>
        );
      })()}

      <header className="relative mb-8 md:mb-12">
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1699347914988-c61ec13c99c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Kids doing printable activities"
            aria-hidden
            className="w-full h-full object-cover"
            width="1170"
            height="658"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/25 print:hidden" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">{t('pages.printables.title')}</h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 mt-3 mb-3" />
          <p className="text-white max-w-3xl">{t('pages.printables.subtitle')}</p>
          {/* Above-the-fold quick links to worksheets */}
          <nav aria-label={t('pages.printables.popularWorksheets')} className="mt-3">
            <ul className="flex flex-wrap gap-2 text-sm">
              <li><a href="/worksheets/handwriting-worksheet-maker" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15">✍️ Handwriting worksheets (PDF)</a></li>
              <li><a href="/printables/name-tracing-generator" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15">🖊️ Personalized name tracing</a></li>
              <li><a href="/worksheets/1st-grade-math-worksheets" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15">➕ 1st grade math – printable</a></li>
              <li><a href="/worksheets/reading-comprehension" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15">📖 Reading comprehension (free PDF)</a></li>
              <li><a href="/printables/certificate-maker" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15">🏅 Certificate maker (free)</a></li>
            </ul>
          </nav>
          {/* Floating cards (desktop) */}
          <div className="hidden lg:block">
            <div className="absolute top-2 left-8 z-20 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-12 hover:rotate-6 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="text-2xl">🖨️</div>
                <p className="text-white text-sm mt-1">{t('pages.printables.print')}</p>
              </div>
            </div>
            <div className="absolute top-[22%] right-6 md:right-10 z-20 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-12 hover:-rotate-6 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="text-2xl">🖍️</div>
                <p className="text-white text-sm mt-1">{t('pages.printables.coloring')}</p>
              </div>
            </div>
            <div className="absolute top-[64%] left-[6%] z-20 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-6 hover:rotate-3 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="text-2xl">🧩</div>
                <p className="text-white text-sm mt-1">{t('pages.printables.puzzles')}</p>
              </div>
            </div>
            <div className="absolute top-[52%] right-6 md:right-10 z-20 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-6 hover:-rotate-3 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="text-2xl">➕</div>
                <p className="text-white text-sm mt-1">{t('pages.printables.math')}</p>
              </div>
            </div>
            <div className="absolute top-[18%] right-[6%] z-20 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-3 hover:rotate-0 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="text-2xl">📖</div>
                <p className="text-white text-sm mt-1">{t('pages.printables.reading')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-6 md:mt-10">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden mb-3 print:hidden">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
            onClick={() => setShowSidebar(v => !v)}
            aria-expanded={showSidebar}
            aria-controls="printables-sidebar"
          >
            ☰ {t('pages.printables.browseCategories')}
          </button>
          {showSidebar && (
            <nav id="printables-sidebar" aria-label="Printables categories" className="mt-2 bg-white border border-slate-200 rounded-2xl p-3">
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <button className="w-full text-left text-purple-700 hover:underline" onClick={() => scrollToSection(l.id)}>{l.label}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:col-span-3 print:hidden">
            <nav aria-label="Printables categories" className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-slate-900 font-semibold mb-2">{t('pages.printables.browse')}</div>
              <ul className="space-y-1 text-sm">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <button className="text-left text-purple-700 hover:underline" onClick={() => scrollToSection(l.id)}>{l.label}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="md:col-span-9 space-y-10">
        {/* Math hubs removed per request */}
        {/* Intro: What You'll Find */}
        <section>
          <div className="mb-2 text-slate-800 font-semibold">🧩 What You’ll Find</div>
          <p className="text-slate-700 text-sm max-w-3xl">We’ve organized our printable packs by activity type so you can choose what fits your child’s interests and age group.</p>
        </section>

        {/* Filter + Search Bar */}
        <section className="print:hidden">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="printables-filter" className="text-sm text-slate-600">{t('pages.printables.filter')}</label>
              <select
                id="printables-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="All">{t('pages.printables.all')}</option>
                <option value="Recent">{t('pages.printables.recent')}</option>
                <option value="Coloring">{t('pages.printables.coloring')}</option>
                <option value="Worksheets">{t('pages.printables.worksheets')}</option>
                <option value="Creative">{t('pages.printables.creative')}</option>
                <option value="Brain">{t('pages.printables.brain')}</option>
                <option value="Emotional">{t('pages.printables.emotional')}</option>
                <option value="Season">{t('pages.printables.season')}</option>
                <option value="Challenge">{t('pages.printables.challenge')}</option>
                <option value="One-pagers">{t('pages.printables.onePagers')}</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="search"
                inputMode="search"
                placeholder={t('pages.printables.searchPlaceholder')}
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                aria-label={t('pages.printables.searchPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-2">
              {filterCategory !== 'All' && (
                <button onClick={() => setFilterCategory('All')} className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">{t('pages.printables.clearFilter')}</button>
              )}
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">{t('pages.printables.clearSearch')}</button>
              )}
            </div>
          </div>
        </section>
        {/* Build a 5‑Minute Print Pack */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4">
          <h2 className="text-xl font-bold text-slate-900 mb-1">{t('pages.printables.buildPack')}</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">{t('pages.printables.buildPackDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="text-sm text-slate-600">{t('pages.printables.time')}
              <select value={packTime} onChange={(e)=>setPackTime(e.target.value as any)} className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
              </select>
            </label>
            <label className="text-sm text-slate-600">{t('pages.printables.ageGrade')}
              <select value={packAge} onChange={(e)=>setPackAge(e.target.value as any)} className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="k1">K–1</option>
                <option value="k2">K–2</option>
                <option value="g1">1st Grade</option>
                <option value="g2">2nd Grade</option>
                <option value="35">3–5</option>
                <option value="68">6–8</option>
              </select>
            </label>
            <label className="text-sm text-slate-600">{t('pages.printables.focus')}
              <select value={packSkill} onChange={(e)=>setPackSkill(e.target.value as any)} className="ml-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="math">Math</option>
                <option value="mixed">Mixed</option>
                <option value="focus">Focus</option>
                <option value="reading">Reading</option>
                <option value="stem">STEM</option>
                <option value="creativity">Creativity</option>
              </select>
            </label>
            <button
              onClick={() => {
                const url = `/print?doc=pack&time=${packTime}&age=${packAge}&skill=${packSkill}`;
                try { window.location.href = url; } catch {}
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {t('pages.printables.buildPackButton')}
            </button>
          </div>
        </section>

        


        {searchQuery && (
          <section className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="mb-2 text-slate-800 font-semibold">🔎 Results for “{searchQuery}”</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(
                [
                  { title: '🖍️ Color-by-Number Pages', href: '/print?doc=color-by-number', tags: 'color coloring art creative number' },
                  { title: '➕ Math Maze Adventure', href: '/print?doc=math-maze', tags: 'math maze addition subtraction focus brain' },
                  { title: '🔢 Number Tracing 1–10', href: '/print?doc=number-tracing-1-10', tags: 'number tracing math k2 fine motor' },
                  { title: '🔟 Ten Frames 1–10', href: '/print?doc=ten-frames-1-10', tags: 'ten frames subitizing counting math' },
                  { title: '🔤 Beginning Sounds (A–Z)', href: '/print?doc=beginning-sounds-az', tags: 'reading phonics sounds letters' },
                  { title: 'Aa–Zz Upper/Lower Match', href: '/print?doc=uppercase-lowercase-match', tags: 'letters match uppercase lowercase reading' },
                  { title: '👀 Spot‑the‑Difference', href: '/print?doc=spot-difference', tags: 'focus visual difference brain' },
                  { title: '📖 Mini Reading Passage + 3 Qs', href: '/print?doc=reading-mini-1', tags: 'reading comprehension questions' },
                  { title: '😊 Feelings Check‑In Meter', href: '/print?doc=feelings-checkin', tags: 'feelings emotional mindfulness' },
                  { title: '⭐ Weekly Reward/Sticker Chart', href: '/print?doc=reward-chart', tags: 'reward chart sticker habit' },
                ].filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.tags.includes(searchQuery.toLowerCase()))
              ).map(item => (
                <a key={item.href} href={item.href} className="border border-slate-200 rounded-xl p-4 hover:border-purple-300">
                  <div className="text-slate-900 font-medium">{item.title}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.href}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 1. Coloring Packs */}
        <section id="Coloring" className={`scroll-mt-24 ${sectionVisibility('Coloring')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🖍️ 1. Printable Coloring Pages for Kids</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Themed packs to spark creativity and learning. Each pack is unique and print‑ready.</p>
            <div className="mb-3">
              <BundleButton section="Coloring" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🎨 Animal Friends Coloring Pages"
              description="Meet friendly jungle and sea animals — from roaring lions to jumping dolphins. Ages 5–10; learn animal names while coloring."
              href="/print?doc=coloring-animals" docId="coloring-animals"
            />
            <WorksheetThumbnailCard
              title="🌸 Nature & Seasons Coloring Pack"
              description="Color blooming flowers, sunny skies, and winter wonderlands. Learn seasons, plants, and colors."
              href="/print?doc=coloring-nature" docId="coloring-nature"
            />
            <WorksheetThumbnailCard
              title="🚀 Space Adventure Coloring Pages"
              description="Blast off into creativity — rockets, planets, and astronauts. Great for science week or STEM lessons."
              href="/print?doc=coloring-space" docId="coloring-space"
            />
            <WorksheetThumbnailCard
              title="🚗 Vehicles & Transport Coloring Sheets"
              description="From race cars to airplanes, develop motor skills while exploring transportation."
              href="/print?doc=coloring-vehicles" docId="coloring-vehicles"
            />
            <WorksheetThumbnailCard
              title="🔢 Alphabet & Number Coloring Pages"
              description="A–Z animals and 1–10 rockets — trace, color, and learn letters and numbers."
              href="/print?doc=coloring-letters-numbers" docId="coloring-letters-numbers"
            />
          </div>
        </section>

        {/* 2. Educational Worksheets */}
        <section id="Worksheets" className={`scroll-mt-24 ${sectionVisibility('Worksheets')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧠 2. Educational Worksheets</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Short, skill‑building worksheets you can finish in minutes. Use them as warm‑ups, homework helpers, or rainy‑day challenges to grow confidence in reading, math, and science.</p>
          {/* Promote Handwriting Worksheet Maker */}
          <div className="mb-3 space-y-3">
            <div className={CARD_CLASS}>
              <div className="text-base font-semibold text-slate-900">✍️ Handwriting Worksheet Maker</div>
              <p className="text-slate-600 text-sm mt-1">Generate dotted A–Z letters, words, or sentences with guidelines. Adjust size and spacing, then print or save as PDF.</p>
              <div className="mt-3 flex items-center gap-2">
                <a href="/worksheets/handwriting-worksheet-maker" className={BUTTON_CLASS}>Open worksheet maker →</a>
              </div>
            </div>
            <div className={CARD_CLASS}>
              <div className="text-base font-semibold text-slate-900">🖊️ Name Tracing Generator</div>
              <p className="text-slate-600 text-sm mt-1">Create personalized name tracing worksheets with dotted or bubble letters, friendly start dots, and printable guidelines.</p>
              <div className="mt-3 flex items-center gap-2">
                <a href="/printables/name-tracing-generator" className={BUTTON_CLASS}>Open name tracing tool →</a>
              </div>
            </div>
          </div>
            <div className="mb-3">
              <BundleButton section="Worksheets" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="➕ Math Maze Adventure"
              description="Solve simple addition and subtraction problems to find your way through the maze! Kids answer to uncover the right path — a mix of math and logic fun."
              skills="problem-solving, basic math, critical thinking"
              age="6–10"
              href="/print?doc=math-maze" docId="math-maze"
            />
            <WorksheetThumbnailCard
              title="✏️ Spelling Challenge Worksheet"
              description="Circle correctly spelled words or fill in missing letters. Themes include animals, school items, and food."
              skills="spelling, vocabulary, reading comprehension"
              age="6–9"
              href="/print?doc=spelling" docId="spelling"
            />
            <WorksheetThumbnailCard
              title="🔬 Science Fun Facts Match"
              description="Match each fun fact to its correct picture — planets, weather, and ocean creatures!"
              skills="science awareness, visual association, curiosity"
              age="8–12"
              href="/print?doc=science-match" docId="science-match"
            />
            <WorksheetThumbnailCard
              title="🕵️‍♀️ Grammar Detective"
              description="Become a language detective! Find and correct small grammar mistakes in funny sentences."
              skills="grammar, reading, logic"
              age="8–12"
              href="/print?doc=grammar-detective" docId="grammar-detective"
            />
            <WorksheetThumbnailCard
              title="🔢 Sudoku – 4×4 (Easy)"
              description="Beginner logic and number practice in a friendly 4×4 grid."
              skills="logic, number sense, focus"
              age="6–8"
              href="/print?doc=sudoku4" docId="sudoku4"
            />
            <WorksheetThumbnailCard
              title="🧮 Sudoku – 6×6 (Medium)"
              description="A bit more challenge to build sustained attention and reasoning."
              skills="logic, number sense, perseverance"
              age="9–12"
              href="/print?doc=sudoku6" docId="sudoku6"
            />
            <WorksheetThumbnailCard
              title="🔢 Number Tracing 1–10"
              description="Trace numbers 1–10 with start‑point arrows and space to color."
              skills="number sense, fine motor, counting"
              age="3–5"
              href="/print?doc=number-tracing-1-10" docId="number-tracing-1-10"
            />
            <WorksheetThumbnailCard
              title="Aa–Zz Upper/Lower Match"
              description="Draw lines from uppercase to lowercase letters; simple A–Z practice."
              skills="letter recognition, pre‑reading"
              age="3–5"
              href="/print?doc=uppercase-lowercase-match" docId="uppercase-lowercase-match"
            />
            <WorksheetThumbnailCard
              title="Beginning Sounds (A–Z)"
              description="Circle pictures that start with each letter; simple phonics warm‑ups."
              skills="phonemic awareness, vocabulary"
              age="4–6"
              href="/print?doc=beginning-sounds-az" docId="beginning-sounds-az"
            />
            <WorksheetThumbnailCard
              title="Add/Subtract 0–10"
              description="No‑prep practice with number lines and picture cues."
              skills="addition, subtraction, number sense"
              age="5–7"
              href="/print?doc=addition-subtraction-0-10" docId="addition-subtraction-0-10"
            />
            <WorksheetThumbnailCard
              title="Ten Frames 1–10"
              description="Color counters to build numbers; develop subitizing quickly."
              skills="counting, subitizing, number bonds"
              age="4–6"
              href="/print?doc=ten-frames-1-10" docId="ten-frames-1-10"
            />
            <WorksheetThumbnailCard
              title="Shapes & Colors Sort"
              description="Cut, sort, and glue basic shapes by color; early math + fine motor."
              skills="sorting, shapes, colors, scissor skills"
              age="3–5"
              href="/print?doc=shapes-colors-sort" docId="shapes-colors-sort"
            />
          </div>
        </section>

        {/* Math by Grade (chips) */}
        <section id="MathByGrade" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-slate-900 mb-2">➗ Math by Grade</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Jump to grade‑focused math printables and build a quick pack.</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: 'Kindergarten', id: 'Math-GK' },
              { label: 'Grade 1', id: 'Math-G1' },
              { label: 'Grade 2', id: 'Math-G2' },
            ].map(g => (
              <button key={g.id} onClick={() => scrollToSection(g.id)} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">{g.label}</button>
            ))}
          </div>
        </section>

        {/* Math grade sections */}
        <section id="Math-G1" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Grade 1</h3>
          <div className={gridClass}>
            <WorksheetThumbnailCard title="Ten Frames 1–10" description="Build numbers to 10 with counters" skills="number sense, subitizing" age="Grade 1" href="/print?doc=ten-frames-1-10" docId="ten-frames-1-10" />
            <WorksheetThumbnailCard title="Addition within 10" description="Number lines + picture cues" skills="addition, number sense" age="Grade 1" href="/print?doc=addition-subtraction-0-10" docId="addition-subtraction-0-10" />
            <WorksheetThumbnailCard title="Number Tracing 1–20" description="Trace digits with start points" skills="fine motor, counting" age="Grade 1" href="/print?doc=number-tracing-1-20" docId="number-tracing-1-20" />
          </div>
          <div className="mt-3 print:hidden">
            <a href="/print?doc=pack&time=5&age=g1&skill=math" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-sm">Build Grade 1 Pack →</a>
          </div>
        </section>

        <section id="Math-G2" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Grade 2</h3>
          <div className={gridClass}>
            <WorksheetThumbnailCard title="Ten Frames 1–20" description="Compose/decompose to 20" skills="number bonds, subitizing" age="Grade 2" href="/print?doc=ten-frames-1-20" docId="ten-frames-1-20" />
            <WorksheetThumbnailCard title="Place Value (Tens/Ones)" description="Break 2‑digit numbers" skills="place value, comparing" age="Grade 2" href="/print?doc=place-value-hto" docId="place-value-hto" />
            <WorksheetThumbnailCard title="Facts to 20" description="Add/sub within 20" skills="fact fluency" age="Grade 2" href="/print?doc=addition-subtraction-0-10" docId="addition-subtraction-0-10" />
          </div>
          <div className="mt-3 print:hidden">
            <a href="/print?doc=pack&time=5&age=g2&skill=math" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-sm">Build Grade 2 Pack →</a>
          </div>
        </section>

        {/* Math by Topic */}
        <section id="Math-Numbers" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-slate-900 mb-2">🔢 Math — Numbers</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Number sense foundations — counting, comparing, and place value.</p>
          <div className={gridClass}>
            <WorksheetThumbnailCard title="Ten Frames 1–10" description="Quick warm‑ups to build numbers" skills="subitizing" age="K–1" href="/print?doc=ten-frames-1-10" docId="ten-frames-1-10" />
            <WorksheetThumbnailCard title="Ten Frames 1–20" description="Compose/decompose numbers to 20" skills="number bonds" age="1–2" href="/print?doc=ten-frames-1-20" docId="ten-frames-1-20" />
            <WorksheetThumbnailCard title="Place Value — Tens/Ones" description="Break 2‑digit numbers" skills="place value" age="2–3" href="/print?doc=place-value-hto" docId="place-value-hto" />
          </div>
        </section>

        <section id="Math-Operations" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-slate-900 mb-2">➕ Math — 4 Operations</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Practice addition and subtraction fluency with fun mini‑challenges.</p>
          <div className={gridClass}>
            <WorksheetThumbnailCard title="Add/Sub within 10" description="Number lines and picture cues" skills="addition, subtraction" age="1–2" href="/print?doc=addition-subtraction-0-10" docId="addition-subtraction-0-10" />
            <WorksheetThumbnailCard title="Math Maze" description="Solve to find the path" skills="fact fluency, focus" age="1–3" href="/print?doc=math-maze" docId="math-maze" />
          </div>
        </section>

        {/* 3. Creative & Art Printables */}
        <section id="Creative" className={`scroll-mt-24 ${sectionVisibility('Creative')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🎨 3. Creative & Art Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Spark imagination with low‑prep projects kids can draw, color, and customize. These printable art prompts build hand control, creativity, and a lifelong love of making things.</p>
            <div className="mb-3">
              <BundleButton section="Creative" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🖍️ Color-by-Number Pages"
              description="Color each section by number to reveal a hidden animal or scene. Includes Animals in Space and Under the Sea editions."
              skills="color recognition, number practice, creativity"
              age="5–9"
              href="/print?doc=color-by-number" docId="color-by-number"
            />
            <WorksheetThumbnailCard
              title="📚 DIY Bookmark Templates"
              description="Design your own bookmarks with quotes and doodles — print-ready outlines: ‘Be Kind’, ‘Keep Reading’, ‘Dream Big’."
              skills="creativity, design, fine motor skills"
              age="6–12"
              href="/print?doc=bookmark-templates" docId="bookmark-templates"
            />
            <WorksheetThumbnailCard
              title="👾 Design Your Monster"
              description="Print, draw, and name your own funny monster! Great for imagination and drawing practice."
              skills="creativity, self-expression, art skills"
              age="6–10"
              href="/print?doc=design-monster" docId="design-monster"
            />
            <WorksheetThumbnailCard
              title="✏️ Draw the Missing Half"
              description="Half of each image is missing — complete it! A great symmetry and observation activity."
              skills="geometry, visual balance, focus"
              age="7–12"
              href="/print?doc=draw-half" docId="draw-half"
            />
            <WorksheetThumbnailCard
              title="🖊️ Directed Drawing: Animals"
              description="Step‑by‑step drawing guides (cat, fish, rocket) with simple shapes."
              skills="observation, shape composition, fine motor"
              age="5–9"
              href="/print?doc=directed-drawing-animals" docId="directed-drawing-animals"
            />
            <WorksheetThumbnailCard
              title="✂️ Cut‑and‑Paste Crafts"
              description="Print, cut, and glue simple paper crafts — build motor control and creativity."
              skills="scissor skills, sequencing, creativity"
              age="4–8"
              href="/print?doc=cut-and-paste-crafts" docId="cut-and-paste-crafts"
            />
          </div>
        </section>

        {/* 4. Brain & Focus Activities */}
        <section id="Brain" className={`scroll-mt-24 ${sectionVisibility('Brain')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧩 4. Brain & Focus Activities</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Build attention and problem‑solving with puzzles that reward careful thinking. Great for quiet time, independent work, and on‑the‑go brain breaks.</p>
            <div className="mb-3">
              <BundleButton section="Brain" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🧩 Logic Grid Puzzle"
              description="Read clues, think critically, and solve who owns what, where, or when!"
              skills="logic, reading comprehension, problem-solving"
              age="9–12"
              href="/print?doc=logic-grid" docId="logic-grid"
            />
            <WorksheetThumbnailCard
              title="🔍 Find the Hidden Object"
              description="Search and circle hidden items in a detailed scene — jungle, ocean, or city themes."
              skills="attention to detail, focus, patience"
              age="6–10"
              href="/print?doc=hidden-object" docId="hidden-object"
            />
            <WorksheetThumbnailCard
              title="🌀 Maze of Focus"
              description="Follow the path through distractions to reach your goal! Includes tips like ‘Take a deep breath’."
              skills="concentration, mindfulness, planning"
              age="6–9"
              href="/print?doc=maze-focus" docId="maze-focus"
            />
            <WorksheetThumbnailCard
              title="1–20 Dot‑to‑Dot"
              description="Connect the dots to reveal animals and objects; practice number order."
              skills="counting, attention, sequencing"
              age="4–7"
              href="/print?doc=dot-to-dot-1-20" docId="dot-to-dot-1-20"
            />
            <WorksheetThumbnailCard
              title="Tangram Animals (Cutouts)"
              description="Cut and arrange pieces to form animal silhouettes — spatial reasoning, but fun."
              skills="spatial thinking, problem‑solving, scissors"
              age="6–10"
              href="/print?doc=tangram-animals" docId="tangram-animals"
            />
            <WorksheetThumbnailCard
              title="Spot the Difference (7)"
              description="Find 7 differences between two pictures — visual scanning exercise."
              skills="attention to detail, persistence"
              age="6–10"
              href="/print?doc=spot-difference" docId="spot-difference"
            />
          </div>
        </section>

        {/* 5. Emotional & Mindfulness Printables */}
        <section id="Emotional" className={`scroll-mt-24 ${sectionVisibility('Emotional')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">💖 5. Emotional & Mindfulness Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Simple, calming pages that help kids name feelings, practice gratitude, and reflect on wins. Perfect for bedtime routines or classroom mindfulness corners.</p>
            <div className="mb-3">
              <BundleButton section="Emotional" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="💌 Gratitude Jar Worksheet"
              description="Each day, write or draw one thing you’re thankful for and color your jar as it fills up!"
              skills="gratitude, mindfulness, journaling"
              age="7–12"
              href="/print?doc=gratitude-jar" docId="gratitude-jar"
            />
            <WorksheetThumbnailCard
              title="🌈 Mood Tracker Coloring Page"
              description="Track feelings for the week by coloring a section based on your mood."
              skills="emotional awareness, reflection, art expression"
              age="8–12"
              href="/print?doc=mood-tracker" docId="mood-tracker"
            />
            <WorksheetThumbnailCard
              title="🕉️ Mindful Coloring Mandalas"
              description="Relax and focus while coloring calming mandala patterns."
              skills="focus, mindfulness, relaxation"
              age="9–13"
              href="/print?doc=mandalas" docId="mandalas"
            />
            <WorksheetThumbnailCard
              title="🗓️ My Goals for the Week Planner"
              description="Write three goals, one thing to try, and one thing you’re proud of — printable motivation for kids."
              skills="planning, reflection, motivation"
              age="8–12"
              href="/print?doc=weekly-goals" docId="weekly-goals"
            />
            <WorksheetThumbnailCard
              title="😊 Feelings Check‑In Meter"
              description="Point to or color how you feel — quick daily emotional check‑in."
              skills="emotional vocabulary, self‑awareness"
              age="4–10"
              href="/print?doc=feelings-checkin" docId="feelings-checkin"
            />
            <WorksheetThumbnailCard
              title="⭐ Weekly Reward/Sticker Chart"
              description="Track small wins with stickers — build consistency with positive feedback."
              skills="habits, motivation, reflection"
              age="4–10"
              href="/print?doc=reward-chart" docId="reward-chart"
            />
          </div>
        </section>

        {/* 6. Seasonal & Holiday Printables */}
        <section id="Seasonal" className={`scroll-mt-24 ${sectionVisibility('Seasonal')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🎉 6. Seasonal & Holiday Printables</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Celebrate the seasons with themed puzzles, hunts, and kindness challenges. Keep little hands busy during holidays, travel days, and family gatherings.</p>
            <div className="mb-3">
              <BundleButton section="Seasonal" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🎃 Halloween Puzzle Pack"
              description="Pumpkin maze, costume word search, and spooky coloring pages — all in one."
              skills="creative play, vocabulary, fine motor skills"
              age="6–10"
              href="/print?doc=halloween-pack" docId="halloween-pack"
            />
            <WorksheetThumbnailCard
              title="❄️ Winter Kindness Challenge"
              description="30 simple ways to spread kindness — color one each time you complete a task!"
              skills="empathy, kindness, social skills"
              age="6–12"
              href="/print?doc=winter-kindness" docId="winter-kindness"
            />
            <WorksheetThumbnailCard
              title="🌸 Spring Nature Scavenger Hunt"
              description="Go outside and check off everything you find — leaves, flowers, clouds, bugs, and more!"
              skills="observation, curiosity, environmental awareness"
              age="6–12"
              href="/print?doc=spring-scavenger" docId="spring-scavenger"
            />
            <WorksheetThumbnailCard
              title="☀️ Summer Adventure Pack"
              description="Word search, beach maze, and ocean animals coloring sheet — perfect for travel."
              skills="creativity, focus, vocabulary"
              age="6–10"
              href="/print?doc=summer-pack" docId="summer-pack"
            />
          </div>
        </section>

        {/* 7. Printable Challenge Packs */}
        <section id="Challenge" className={`scroll-mt-24 ${sectionVisibility('Challenge')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🌍 7. Printable Challenge Packs</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Week‑long printable packs that turn practice into a friendly challenge. Each set layers small daily wins into real progress kids can feel proud of.</p>
            <div className="mb-3">
              <BundleButton section="Challenge" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🧠 7-Day Brain Boost Pack"
              description="Daily puzzles, word games, and mini memory challenges to build focus and logic."
              href="/print?doc=brain-boost" docId="brain-boost"
            />
            <WorksheetThumbnailCard
              title="🎨 Creative Kids Challenge"
              description="7 days of art prompts and doodle ideas to spark creativity and reduce screen time."
              href="/print?doc=creative-challenge" docId="creative-challenge"
            />
            <WorksheetThumbnailCard
              title="🌍 Around the World Word Search"
              description="Learn geography through words — explore landmarks, countries, and famous animals."
              href="/print?doc=ws-world" docId="ws-world"
            />
            <WorksheetThumbnailCard
              title="🦁 Animal Adventure Pack"
              description="6 printables focused on wildlife fun — puzzles, coloring, and animal facts."
              href="/print?doc=animal-pack" docId="animal-pack"
            />
          </div>
        </section>

        {/* 8. Quick STEM/Arts One‑pagers */}
        <section id="One-pagers" className={`scroll-mt-24 ${sectionVisibility('One-pagers')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧪 8. Quick STEM/Arts One‑pagers</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Fast, print‑and‑go activities with 5 clear steps, simple materials, and a short “what you learned” box.</p>
            <div className="mb-3">
              <BundleButton section="One-pagers" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard
              title="🚀 Balloon Rocket (STEM)"
              description="Make a balloon rocket and learn how action and reaction push it forward. 10 minutes."
              skills="science, observation"
              age="7–10"
              href="/print?doc=stem-balloon-rocket" docId="stem-balloon-rocket"
            />
            <WorksheetThumbnailCard
              title="🌈 Walking Water (STEM)"
              description="Watch colors climb and mix through paper towels. Learn capillary action. 15 minutes."
              skills="science, recording results"
              age="6–10"
              href="/print?doc=stem-walking-water" docId="stem-walking-water"
            />
            <WorksheetThumbnailCard
              title="🎨 Draw From 3 Shapes (Arts)"
              description="Create a creature starting from a circle, triangle, and rectangle. Finish with a 1‑line story."
              skills="creativity, composition"
              age="6–12"
              href="/print?doc=arts-3-shape-creature" docId="arts-3-shape-creature"
            />
            <WorksheetThumbnailCard
              title="📖 Mini Reading Passage + 3 Qs"
              description="Short passage with 3 questions — practice comprehension in 5 minutes."
              skills="reading comprehension, evidence finding"
              age="7–10"
              href="/print?doc=reading-mini-1" docId="reading-mini-1"
            />
          </div>
        </section>

        {/* 9. Geography Worksheets */}
        <section id="Geography" className={`scroll-mt-24 ${sectionVisibility('Geography')}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🧭 9. Geography Worksheets</h2>
          <p className="text-slate-700 text-sm mb-3 max-w-3xl">Learn continents, directions, landforms, and latitude/longitude. Printable, kid‑friendly pages that build map skills.</p>
            <div className="mb-3">
              <BundleButton section="Geography" />
            </div>
          <div className={gridClass}>
            <WorksheetThumbnailCard title="🌍 Label the 7 Continents (K–2)" description="Write or trace continent names; beginner‑friendly world outline with hints." href="/print?doc=geo-continents-k2" docId="geo-continents-k2" />
            <WorksheetThumbnailCard title="🧭 Compass Rose & Directions" description="N, E, S, W with NE/SE/SW/NW — color and label the compass." href="/print?doc=geo-compass-rose" docId="geo-compass-rose" />
            <WorksheetThumbnailCard title="🏔️ Landforms vs Water Bodies" description="Match words to simple icons: mountain, valley, island, lake, river." href="/print?doc=geo-landforms" docId="geo-landforms" />
            <WorksheetThumbnailCard title="🗺️ Latitude & Longitude Basics" description="Practice reading and plotting coordinates on a simple world grid." href="/print?doc=geo-latlong" docId="geo-latlong" />
          </div>
        </section>

        <section className="text-xs text-slate-500">
          <p className="print:hidden">{t('common.printTip', 'Tip: Use your browser menu → Print → Save as PDF.')}</p>
        </section>
          </div>
        </div>
      </main>

      <Footer />
      {showBackToTop && (
        <button
          onClick={() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {} }}
          aria-label="Scroll up"
          title="Scroll up"
          className="fixed bottom-6 left-6 z-50 print:hidden inline-flex items-center gap-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 px-4 py-3"
        >
          <span aria-hidden>↑</span>
          <span className="text-sm">Scroll up</span>
        </button>
      )}
    </div>
  );
}
