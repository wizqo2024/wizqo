import React, { useMemo, useRef, useState } from 'react';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import MemoryMatch from '@/components/kids/MemoryMatch';
import WordSearch from '@/components/kids/WordSearch';

const CARD_CLASS = 'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden';
const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors';
const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors';
const CHIP_CLASS = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700';

// Curated, kid‑safe Unsplash images (playground, puzzles, crayons, classroom)
const KID_SAFE = {
  classroom: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=80',
  planets: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=1600&q=80',
  puzzleJigsaw: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1600&q=80',
  puzzleDesk: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1600&q=80',
  playground: 'https://images.unsplash.com/photo-1519681719073-a6b3c1f0b122?auto=format&fit=crop&w=1600&q=80',
  kidColoring: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
  childStudy: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
  childWrite: 'https://images.unsplash.com/photo-1519455953755-af066f52f1ea?auto=format&fit=crop&w=1600&q=80',
  kidJournal: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1600&q=80',
  animals: 'https://images.unsplash.com/photo-1477764860582-56fdf29dfc4d?auto=format&fit=crop&w=1600&q=80'
} as const;

export default function KidsPage() {
  const usedImageUrlsRef = useRef<Set<string>>(new Set());
  const KIDS_GENERIC_IMAGE = KID_SAFE.kidColoring;
  const KIDS_IMAGE_POOL = useMemo(
    () => [
      KID_SAFE.playground,
      KID_SAFE.classroom,
      KID_SAFE.kidColoring,
      KID_SAFE.puzzleJigsaw,
      KID_SAFE.puzzleDesk,
      KID_SAFE.childStudy,
      KID_SAFE.childWrite,
      KID_SAFE.kidJournal,
      KID_SAFE.planets,
      KID_SAFE.animals
    ],
    []
  );

  function SmartImage({ primary, alts = [], alt, className, fetchPriority }: { primary: string; alts?: string[]; alt: string; className?: string; fetchPriority?: 'auto' | 'low' | 'high' }) {
    const initialSrc = useMemo(() => {
      const set = usedImageUrlsRef.current;
      const candidates = [primary, ...alts, KIDS_GENERIC_IMAGE, ...KIDS_IMAGE_POOL];
      for (const url of candidates) {
        if (!set.has(url)) {
          set.add(url);
          return url;
        }
      }
      return primary;
    }, [primary, alts]);

    const [src, setSrc] = useState<string>(initialSrc);
    const [idx, setIdx] = useState<number>(0);

    const fallbackList = useMemo(() => {
      const list = [primary, ...alts, KIDS_GENERIC_IMAGE, ...KIDS_IMAGE_POOL].filter((u) => u !== src);
      return list;
    }, [primary, alts, src]);

    function onError() {
      const set = usedImageUrlsRef.current;
      for (let i = idx; i < fallbackList.length; i++) {
        const candidate = fallbackList[i];
        if (!set.has(candidate)) {
          set.add(candidate);
          setSrc(candidate);
          setIdx(i + 1);
          return;
        }
      }
      setSrc(KIDS_GENERIC_IMAGE);
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
        sizes="(min-width: 1024px) 800px, 100vw"
        fetchPriority={fetchPriority || 'auto'}
        onError={onError}
      />
    );
  }

  const path = (typeof window !== 'undefined' ? window.location.pathname : '/kids');
  const parts = path.replace(/^\/+/,'').split('/');
  const sub1 = parts[1] || '';
  const sub2 = parts[2] || '';

  if (sub1 === 'games') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEOMetaTags
          title={`Kids Games – ${sub2 === 'word-search' ? 'Word Search' : 'Memory Match'}`}
          description="Free kids mini‑games – fast, safe, and mobile‑friendly."
          canonicalUrl={`https://wizqo.com/kids/games/${sub2 || 'memory'}`}
        />
        <UnifiedNavigation currentPage="kids" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {sub2 === 'word-search' ? 'Word Search' : 'Memory Match'}
            </h1>
            <a className={OUTLINE_BUTTON} href="/kids">Back to Kids Hub</a>
          </div>
          {sub2 === 'word-search' ? <WordSearch /> : <MemoryMatch />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOMetaTags
        title="Kids Hub – Play, Print, and Learn"
        description="Free kids mini‑games, printable puzzles, and homework helpers. Play online or download weekly packs."
        canonicalUrl="https://wizqo.com/kids"
      />
      <UnifiedNavigation currentPage="kids" />

      <header className="relative text-white">
        <SmartImage
          primary={KID_SAFE.kidColoring}
          alts={[KID_SAFE.classroom, KID_SAFE.playground, KID_SAFE.puzzleJigsaw, KID_SAFE.childStudy]}
          alt="Kids Hub hero background (child coloring/crayons)"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-purple-700/40 to-pink-700/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">Kids Hub</h1>
          <p className="text-lg opacity-90 max-w-2xl">Play, print, and learn — new puzzles and games every week.</p>
          <div className="mt-6 flex gap-3">
            <a href="#print" className={BUTTON_CLASS}>Download printables</a>
            <a href="#play" className={OUTLINE_BUTTON}>Play games</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section id="play">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Play</h2>
            <span className="text-sm text-slate-500">Fast, safe, mobile‑friendly</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <article className={CARD_CLASS}>
              <SmartImage
                primary={KID_SAFE.puzzleDesk}
                alts={[KID_SAFE.puzzleJigsaw, KID_SAFE.classroom, KID_SAFE.kidColoring]}
                alt="Kids memory match game cover"
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 6–8</span>
                  <span className={CHIP_CLASS}>Easy/Medium</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Memory Match</h3>
                <p className="text-slate-600 text-sm mb-4">Find all pairs in the fewest moves. Timer + best score.</p>
                <a href="/kids/games/memory" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>

            <article className={CARD_CLASS}>
              <SmartImage
                primary={KID_SAFE.planets}
                alts={[KID_SAFE.classroom, KID_SAFE.childStudy, KID_SAFE.kidJournal]}
                alt="Kids word search game cover"
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <span className={CHIP_CLASS}>Ages 9–12</span>
                  <span className={CHIP_CLASS}>Animals/Space</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Word Search</h3>
                <p className="text-slate-600 text-sm mb-4">Find all hidden words in time. Mobile friendly.</p>
                <a href="/kids/games/word-search" className={BUTTON_CLASS}>Play</a>
              </div>
            </article>
          </div>
        </section>

        <section id="print">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Print</h2>
            <a href="/printables/kids-pack-week1.zip" className="text-purple-600 hover:text-purple-700 font-medium">Download all (ZIP)</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRINTABLES.map(p => (
              <article key={p.id} className={CARD_CLASS}>
                <SmartImage
                  primary={p.cover}
                  alts={[KID_SAFE.kidColoring, KID_SAFE.animals, KID_SAFE.classroom, KID_SAFE.puzzleDesk, KID_SAFE.puzzleJigsaw, KID_SAFE.planets, KID_SAFE.playground, KID_SAFE.childWrite, KID_SAFE.kidJournal]}
                  alt={`${p.title} – kids printable`}
                  className="w-full h-36 object-cover"
                />
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {p.chips.map((c, i) => (<span key={i} className={CHIP_CLASS}>{c}</span>))}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{p.subtitle}</p>
                  <a href={p.href} className={BUTTON_CLASS} download>Download PDF</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="learn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Learn</h2>
            <a href="/blog" className="text-purple-600 hover:text-purple-700 font-medium">More on the blog</a>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HELPERS.map(h => (
              <article key={h.id} className={CARD_CLASS}>
                <SmartImage
                  primary={h.cover}
                  alts={[KID_SAFE.childStudy, KID_SAFE.childWrite, KID_SAFE.kidJournal, KID_SAFE.classroom, KID_SAFE.kidColoring]}
                  alt={`${h.title} – kids helper`}
                  className="w-full h-28 object-cover"
                />
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    <span className={CHIP_CLASS}>Kids</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{h.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{h.subtitle}</p>
                  <a href={h.href} className="text-purple-600 hover:text-purple-700 font-medium">Read</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const PRINTABLES = [
  {
    id: 'ws-animals',
    title: 'Word Search – Animals',
    subtitle: 'Find 12 animal names',
    chips: ['Ages 6–8', 'Easy'],
    href: '/printables/kids-wordsearch-animals.pdf',
    cover: KID_SAFE.classroom
  },
  {
    id: 'ws-space',
    title: 'Word Search – Space',
    subtitle: 'Find 12 space words',
    chips: ['Ages 9–12', 'Moderate'],
    href: '/printables/kids-wordsearch-space.pdf',
    cover: KID_SAFE.planets
  },
  {
    id: 'sudoku-4',
    title: 'Sudoku – 4×4 (Easy)',
    subtitle: 'Beginner logic puzzle',
    chips: ['Ages 6–8', 'Easy'],
    href: '/printables/kids-sudoku-4x4.pdf',
    cover: KID_SAFE.puzzleJigsaw
  },
  {
    id: 'sudoku-6',
    title: 'Sudoku – 6×6 (Medium)',
    subtitle: 'A bit more challenge',
    chips: ['Ages 9–12', 'Medium'],
    href: '/printables/kids-sudoku-6x6.pdf',
    cover: KID_SAFE.classroom
  },
  {
    id: 'coloring',
    title: 'Coloring – Cute Animals',
    subtitle: 'Creative and calming',
    chips: ['Ages 6–8'],
    href: '/printables/kids-coloring-animals.pdf',
    cover: KID_SAFE.kidColoring
  },
  {
    id: 'spot-diff',
    title: 'Spot the Difference – Playground',
    subtitle: 'Find 8 differences',
    chips: ['Ages 6–10'],
    href: '/printables/kids-spot-the-difference-playground.pdf',
    cover: KID_SAFE.playground
  }
];

const HELPERS = [
  {
    id: 'focus-in-10',
    title: 'Focus in 10 (for Kids)',
    subtitle: 'Quick routine to start homework calmly',
    href: '/blog',
    cover: KID_SAFE.childStudy
  },
  {
    id: 'kid-note-taking',
    title: 'Simple Note‑Taking for Homework',
    subtitle: 'Write just what matters — with examples',
    href: '/blog',
    cover: KID_SAFE.childWrite
  },
  {
    id: 'micro-journaling-kids',
    title: 'Micro‑Journaling for Kids',
    subtitle: '1–2 lines that build confidence',
    href: '/blog',
    cover: KID_SAFE.kidJournal
  }
];
