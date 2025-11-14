import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import GentleParentingFull from '@/components/blog/GentleParentingFull';
import HWTInfographic from '@/components/blog/HWTInfographic';
import MultiplicationWorksheetsBlog from '@/components/blog/MultiplicationWorksheetsBlog';
import CognitiveSkillsBlog from '@/components/blog/CognitiveSkillsBlog';
import Grade2MathWorksheetsBlog from '@/components/blog/Grade2MathWorksheetsBlog';
import { BlogPost } from '../types';
import { CATEGORY_IMAGES, GENERIC_BLOG_IMAGE } from '../constants';

interface MarkdownRendererProps {
  post: BlogPost;
  usedImageUrls: Set<string>;
  pickFallback: (primaryUrl?: string) => string;
}

const ALT_GENERIC_IMAGE = 'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0ee?auto=format&fit=crop&w=1600&q=80';

export function MarkdownRenderer({ post, usedImageUrls, pickFallback }: MarkdownRendererProps) {
  const lines = post.content.split('\n');
  let imageIdx = 0;

  const isMdImage = (s: string) => {
    const raw = s.trim();
    return /^!\[.*?\]\(.*\)$/.test(raw);
  };

  const parseMdHeading = (s: string): { level: number; text: string } | null => {
    const m = s.match(/^(#{1,6})\s+(.*)$/);
    if (!m) return null;
    return { level: m[1].length, text: m[2].trim() };
  };

  const isSectionHeading = (s: string) => {
    return (
      /^#{1,6}\s+/.test(s) ||
      s.includes('Day 1:') || s.includes('Day 2') || s.includes('Day 3') || s.includes('Day 4') || s.includes('Day 5') || s.includes('Day 6') || s.includes('Day 7') ||
      s.includes('Why Students Need Productive Hobbies') || s.includes('10 Easy Hobbies') || s.includes('How to Pick the Right Hobby for You') || s.includes('Final Thoughts') || s.includes('FAQs About Easy Hobbies') ||
      s.includes('Why Most Hobbies Fail') || s.includes('How AI Makes Hobbies') || s.includes('Your 7-Day Plan') ||
      s.includes('What Is Micro Journaling') || s.includes('Why It Works') || s.includes('5 Micro Journaling Prompts') ||
      s.includes('Why Watercolor Is') || s.includes('10 Easy Watercolor') || s.includes('Beginner Watercolor Supplies') ||
      s.includes('Common Mistakes') || s.includes('FREE 7-Day') || s.includes('Just Start!') ||
      s.includes('The Science:') || s.includes('What Hobby Have You') || s.includes('Ready to Find') ||
      s.includes('Bonus: Pair Micro') || s.includes('Micro Journaling =') || s.includes('Ready to Try') ||
      s.includes('Why We Get Bored So Easily') || s.includes('Why Cheap Hobbies Work Better Than Expensive Ones') || s.includes('FAQs on Cheap Hobbies') || s.includes('FAQs on Cheap Hobbies at Home')
    );
  };

  const convertInlineLinks = (text: string): string => {
    let out = text;
    out = out.replace(/([^\[]+?)\s*→\s*\[(\/blog\?post=([a-z0-9-]+))\]/gi, (_m, label, _url, slug) => {
      const safeLabel = String(label).trim();
      const pretty = `/blog/${slug}`;
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${safeLabel}</a>`;
    });
    out = out.replace(/\[(.*?)\]\((\/blog\?post=([a-z0-9-]+))\)/gi, (_m, label, _url, slug) => {
      const pretty = `/blog/${slug}`;
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${label}</a>`;
    });
    out = out.replace(/\[(\/blog\?post=([a-z0-9-]+))\]/gi, (_m, _url, slug) => {
      const pretty = `/blog/${slug}`;
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${pretty}</a>`;
    });
    out = out.replace(/([^\[]+?)\s*→\s*\[(\/blog\/([a-z0-9-]+))\]/gi, (_m, label, url) => {
      const safeLabel = String(label).trim();
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${safeLabel}</a>`;
    });
    out = out.replace(/\[(.*?)\]\((\/blog\/([a-z0-9-]+))\)/gi, (_m, label, url) => {
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${label}</a>`;
    });
    out = out.replace(/\[(\/blog\/([a-z0-9-]+))\]/gi, (_m, url) => {
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${pretty}</a>`;
    });
    out = out.replace(/([^\[]+?)\s*→\s*\[(\/[A-Za-z0-9_\-\/\?=&#%]+)\]/gi, (_m, label, url) => {
      const safeLabel = String(label).trim();
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${safeLabel}</a>`;
    });
    out = out.replace(/([^\[\n]+?)\s*\((\/[A-Za-z0-9_\-\/\?=&#%]+)\)/gi, (_m, label, url) => {
      const safeLabel = String(label).trim();
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${safeLabel} →</a>`;
    });
    out = out.replace(/\[(.*?)\]\((\/[A-Za-z0-9_\-\/\?=&#%]+)\)/gi, (_m, label, url) => {
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${label}</a>`;
    });
    out = out.replace(/\[(\/[A-Za-z0-9_\-\/\?=&#%]+)\]/gi, (_m, url) => {
      const pretty = String(url).trim();
      return `<a href="${pretty}" class="text-purple-600 hover:underline">${pretty}</a>`;
    });
    return out;
  };

  // Special simple render for relaxing-hobbies
  if (post.id === 'relaxing-hobbies') {
    const simple: JSX.Element[] = [];
    for (let idx = 0; idx < lines.length; idx++) {
      const raw = lines[idx];
      const t = raw.trim();
      if (t === '') continue;
      if (/^❓\s*FAQs/i.test(t) || /^##\s*.*FAQs/i.test(t) || /^FAQs\b/i.test(t) || (/faq/i.test(t) && !/^\d+\./.test(t))) {
        simple.push(<h2 key={`simp-faq-h-${idx}`} className="text-2xl font-bold text-slate-900 mt-8 mb-4">❓ FAQs</h2>);
        const items: { q: string; a: string[] }[] = [];
        let j = idx + 1;
        while (j < lines.length) {
          const l = lines[j].trim();
          if (l === '') { j++; continue; }
          if (
            /^#{1,6}\s+/.test(l) ||
            /^❓\s*FAQs/i.test(l) ||
            /^FAQs\b/i.test(l) ||
            (/faq/i.test(l) && !/^\d+\./.test(l)) ||
            /^🔗/.test(l) ||
            /^👉/.test(l) ||
            /^📌/.test(l)
          ) break;
          const mQ = l.match(/^\d+\.\s*(.+)$/);
          if (mQ) {
            items.push({ q: mQ[1].trim().replace(/\*\*(.*?)\*\*/g, '$1'), a: [] });
            j++;
            while (j < lines.length) {
              const l2 = lines[j].trim();
              if (l2 === '') { j++; continue; }
              if (
                /^\d+\./.test(l2) ||
                /^#{1,6}\s+/.test(l2) ||
                /^❓\s*FAQs/i.test(l2) ||
                /^FAQs\b/i.test(l2) ||
                (/faq/i.test(l2) && !/^\d+\./.test(l2)) ||
                /^🔗/.test(l2) ||
                /^👉/.test(l2) ||
                /^📌/.test(l2)
              ) break;
              items[items.length - 1].a.push(l2);
              j++;
            }
            continue;
          }
          j++;
        }
        simple.push(
          <Accordion key={`simp-faq-${idx}`} type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
            {items.map((it, iIdx) => (
              <AccordionItem key={`simp-faq-item-${iIdx}`} value={`item-${iIdx}`}>
                <AccordionTrigger className="px-4" aria-expanded="false">{it.q}</AccordionTrigger>
                <AccordionContent className="px-4 text-slate-700">
                  {it.a.map((p, pIdx) => (
                    <p key={`simp-faq-a-${iIdx}-${pIdx}`} className="mb-3" dangerouslySetInnerHTML={{ __html: convertInlineLinks(p).replace(/\*\*(.*?)\*\*/g, '$1') }} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        );
        idx = j - 1;
        continue;
      }
      if (isMdImage(raw)) {
        const m = t.match(/^!\[(.*?)\]\((\S+?)(?:\s+\"(.*?)\")?\)$/);
        let alt = post.title, url = '', caption = '';
        if (m) { alt = m[1] || alt; url = m[2] || ''; caption = m[3] || ''; }
        if (!alt || !alt.trim()) alt = post.title;
        const finalUrl = url || CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE;
        simple.push(
          <figure key={`simp-img-${idx}`} className="my-6">
            {(() => {
              const needsContain = (post.id === 'quiet-time') && (
                finalUrl.includes('photo-1758471995115-81c662cf949f')
              );
              const imgClass = needsContain
                ? 'w-full h-auto max-h-[24rem] object-contain rounded-xl border border-slate-200 bg-white'
                : 'w-full h-44 sm:h-52 md:h-64 lg:h-72 object-cover rounded-xl border border-slate-200';
              return (
                <img 
                  src={finalUrl} 
                  alt={alt || post.title} 
                  loading="lazy"
                  width={1600}
                  height={720}
                  className={imgClass}
                />
              );
            })()}
          </figure>
        );
        continue;
      }
      if (/^\d+\./.test(t)) {
        const hId = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        simple.push(<h3 key={`simp-h-${idx}`} id={hId} className="font-bold text-purple-900 mb-2">{t}</h3>);
        continue;
      }
      if (t.startsWith('•')) {
        const bulletHtml = convertInlineLinks(t.slice(1).trim());
        simple.push(
          <div key={`simp-b-${idx}`} className="flex items-start mb-3">
            <span className="text-purple-500 text-xl mr-3 mt-1" aria-hidden="true">•</span>
            <p className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: bulletHtml }} />
          </div>
        );
        continue;
      }
      const paraHtml = convertInlineLinks(raw);
      simple.push(<p key={`simp-p-${idx}`} className="mb-4 text-slate-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: paraHtml }} />);
    }
    return <div className="prose prose-lg max-w-none">{simple}</div>;
  }

  const elements: JSX.Element[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') continue;
    
    if (post.id === 'gentle-parenting-techniques' && trimmed === '<GentleParentingFull />') {
      elements.push(<GentleParentingFull key={`gp-full-${i}`} />);
      continue;
    }
    if (post.id === 'handwriting-without-tears-infographic' && trimmed === '<HWTInfographic />') {
      elements.push(<HWTInfographic key={`hwt-full-${i}`} />);
      continue;
    }
    if (post.id === 'free-multiplication-worksheets-pdf' && trimmed === '<MultiplicationWorksheetsBlog />') {
      elements.push(<MultiplicationWorksheetsBlog key={`multiplication-blog-${i}`} />);
      continue;
    }
    if (post.id === 'what-are-cognitive-skills' && trimmed === '<CognitiveSkillsBlog />') {
      elements.push(<CognitiveSkillsBlog key={`cognitive-skills-blog-${i}`} />);
      continue;
    }
    if (post.id === 'free-grade-2-math-worksheets-pdf' && trimmed === '<Grade2MathWorksheetsBlog />') {
      elements.push(<Grade2MathWorksheetsBlog key={`grade2-math-blog-${i}`} />);
      continue;
    }
    
    if (/^❓\s*FAQs/i.test(trimmed) || /^##\s*.*FAQs/i.test(trimmed) || /^FAQs\b/i.test(trimmed) || (/faq/i.test(trimmed) && !/^\d+\./.test(trimmed))) {
      elements.push(
        <h2 key={`faq-h-${i}`} className="text-2xl font-bold text-slate-900 mt-8 mb-4">❓ FAQs</h2>
      );
      const items: { q: string; a: string[] }[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const ln = lines[j].trim();
        if (ln === '') { j++; continue; }
        if (
          /^#{1,6}\s+/.test(ln) ||
          /^❓\s*FAQs/i.test(ln) ||
          /^FAQs\b/i.test(ln) ||
          (/faq/i.test(ln) && !/^\d+\./.test(ln)) ||
          /^🔗/.test(ln) ||
          /^👉/.test(ln) ||
          /^📌/.test(ln)
        ) break;
        const mQ = ln.match(/^\d+\.\s*(.+)$/);
        if (mQ) {
          items.push({ q: mQ[1].trim().replace(/\*\*(.*?)\*\*/g, '$1'), a: [] });
          j++;
          while (j < lines.length) {
            const ln2 = lines[j].trim();
            if (ln2 === '') { j++; continue; }
            if (
              /^\d+\./.test(ln2) ||
              /^#{1,6}\s+/.test(ln2) ||
              /^❓\s*FAQs/i.test(ln2) ||
              /^FAQs\b/i.test(ln2) ||
              (/faq/i.test(ln2) && !/^\d+\./.test(ln2)) ||
              /^🔗/.test(ln2) ||
              /^👉/.test(ln2) ||
              /^📌/.test(ln2)
            ) break;
            items[items.length - 1].a.push(ln2);
            j++;
          }
          continue;
        }
        j++;
      }
      elements.push(
        <Accordion key={`faq-${i}`} type="single" collapsible className="divide-y rounded-xl border border-slate-200 bg-white">
          {items.map((it, idxItem) => (
            <AccordionItem key={`faq-item-${idxItem}`} value={`item-${idxItem}`}>
              <AccordionTrigger className="px-4" aria-expanded="false">{it.q}</AccordionTrigger>
              <AccordionContent className="px-4 text-slate-700">
                {it.a.map((p, pIdx) => (
                  <p key={`faq-a-${idxItem}-${pIdx}`} className="mb-3" dangerouslySetInnerHTML={{ __html: convertInlineLinks(p).replace(/\*\*(.*?)\*\*/g, '$1') }} />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
      i = j - 1;
      continue;
    }

    const mdH = parseMdHeading(line);
    if (mdH) {
      const hId = mdH.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const HTag = mdH.level <= 2 ? 'h2' : mdH.level === 3 ? 'h3' : 'h4';
      elements.push(
        React.createElement(HTag as any, { key: `h-${i}`, id: hId, className: 'font-extrabold text-slate-900 mt-8 mb-3' }, mdH.text)
      );
      continue;
    }

    if (isMdImage(line)) {
      const raw = trimmed;
      const mdStrict = raw.match(/^!\[(.*?)\]\((\S+?)(?:\s+\"(.*?)\")?\)$/);
      let alt = post.title;
      let url = '';
      let caption = '';
      if (mdStrict) {
        alt = mdStrict[1] || alt;
        url = mdStrict[2] || '';
        caption = mdStrict[3] || '';
      } else {
        const altMatch = raw.match(/^!\[(.*?)\]/);
        const urlMatch = raw.match(/\((.*?)\)/);
        if (altMatch) alt = altMatch[1] || alt;
        if (urlMatch) url = (urlMatch[1] || '').split(' "')[0].trim();
      }
      let finalUrl = url || undefined;
      if (!finalUrl) {
        finalUrl = pickFallback(undefined);
        let guardCounter = 0;
        while ((typeof usedImageUrls !== 'undefined' && finalUrl && usedImageUrls.has(finalUrl)) && guardCounter < 3) {
          finalUrl = GENERIC_BLOG_IMAGE + `?v=${Date.now()}-${imageIdx}-${guardCounter}`;
          guardCounter++;
        }
      }
      if (typeof usedImageUrls !== 'undefined' && finalUrl && usedImageUrls.has(finalUrl)) {
        const avoidDupCandidates = [
          CATEGORY_IMAGES[post.category],
          GENERIC_BLOG_IMAGE,
          ALT_GENERIC_IMAGE
        ].filter(Boolean) as string[];
        for (const c of avoidDupCandidates) {
          if (!usedImageUrls.has(c)) { finalUrl = c; break; }
        }
      }
      if (typeof usedImageUrls !== 'undefined') usedImageUrls.add(finalUrl);
      imageIdx++;
      elements.push(
        <figure key={`img-${i}`} className="my-6">
          {(() => {
            const needsContain = (post.id === 'quiet-time') && (
              finalUrl.includes('photo-1758471995115-81c662cf949f')
            );
            const imgClass = needsContain
              ? 'w-full h-auto max-h-[24rem] object-contain rounded-xl border border-slate-200 bg-white'
              : 'w-full h-44 sm:h-52 md:h-64 lg:h-72 object-cover rounded-xl border border-slate-200';
            return (
              <img 
                src={finalUrl} 
                alt={alt || post.title} 
                loading="lazy" 
                width={1600} 
                height={720} 
                referrerPolicy="no-referrer"
                className={imgClass}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  const tried = parseInt(img.getAttribute('data-errcount') || '0', 10);
                  const candidates = [
                    CATEGORY_IMAGES[post.category],
                    GENERIC_BLOG_IMAGE,
                    ALT_GENERIC_IMAGE
                  ].filter(Boolean) as string[];
                  let picked: string | undefined;
                  let pickedIndex = tried;
                  for (let i = tried; i < candidates.length; i++) {
                    const c = candidates[i]!;
                    if (!usedImageUrls.has(c)) { picked = c; pickedIndex = i; break; }
                  }
                  if (!picked && candidates.length > 0) {
                    picked = candidates[Math.min(tried, candidates.length - 1)] || candidates[0];
                  }
                  if (picked) {
                    img.setAttribute('data-errcount', String(Math.min(pickedIndex + 1, candidates.length)));
                    if (img.src !== picked) {
                      img.src = picked;
                      usedImageUrls.add(picked);
                    }
                  }
                }} 
              />
            );
          })()}
        </figure>
      );
      continue;
    }

    const numMatch = trimmed.match(/\b\d+\./);
    if ((numMatch && /^\s*\d+\./.test(trimmed)) || (numMatch && trimmed.indexOf(numMatch[0]) <= 4)) {
      const headingText = trimmed.replace(/\*\*(.*?)\*\*/g, '$1');
      const numHeadingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const sectionEls: JSX.Element[] = [];
      sectionEls.push(<h3 key={`num-h-${i}`} id={numHeadingId} className="font-bold text-purple-900 mb-2">{headingText}</h3>);
      let j = i + 1;
      while (j < lines.length) {
        const rawNext = lines[j];
        const tNext = rawNext.trim();
        if (tNext === '') { j++; continue; }
        if (/^\s*\d+\./.test(tNext) || isSectionHeading(tNext)) break;
        if (isMdImage(rawNext)) {
          const m = tNext.match(/^!\[(.*?)\]\((\S+?)(?:\s+\"(.*?)\")?\)$/);
          let alt = post.title, url = '', caption = '';
          if (m) { alt = m[1] || alt; url = m[2] || ''; caption = m[3] || ''; }
          let finalUrl = url || CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE;
          if (typeof usedImageUrls !== 'undefined' && finalUrl && usedImageUrls.has(finalUrl)) {
            const avoidDupCandidates = [
              CATEGORY_IMAGES[post.category],
              GENERIC_BLOG_IMAGE,
              ALT_GENERIC_IMAGE
            ].filter(Boolean) as string[];
            for (const c of avoidDupCandidates) {
              if (!usedImageUrls.has(c)) { finalUrl = c; break; }
            }
          }
          if (typeof usedImageUrls !== 'undefined') usedImageUrls.add(finalUrl);
          sectionEls.push(
            <figure key={`num-img-${j}`} className="my-4">
              {(() => {
                const needsContain = (post.id === 'quiet-time') && (
                  finalUrl.includes('photo-1758471995115-81c662cf949f') || (String(alt||'').toLowerCase().includes('quiet'))
                );
                const imgClass = needsContain
                  ? 'w-full h-auto max-h-[24rem] object-contain rounded-xl border border-slate-200 bg-white'
                  : 'w-full h-44 sm:h-52 md:h-64 lg:h-72 object-cover rounded-xl border border-slate-200';
                return (
                  <img 
                    src={finalUrl} 
                    alt={alt || post.title} 
                    loading="lazy" 
                    width={1600} 
                    height={720} 
                    referrerPolicy="no-referrer"
                    className={imgClass}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      const tried = parseInt(img.getAttribute('data-errcount') || '0', 10);
                      const candidates = [
                        CATEGORY_IMAGES[post.category],
                        GENERIC_BLOG_IMAGE,
                        ALT_GENERIC_IMAGE
                      ].filter(Boolean) as string[];
                      let picked: string | undefined;
                      let pickedIndex = tried;
                      for (let i2 = tried; i2 < candidates.length; i2++) {
                        const c = candidates[i2]!;
                        if (!usedImageUrls.has(c)) { picked = c; pickedIndex = i2; break; }
                      }
                      if (!picked && candidates.length > 0) {
                        picked = candidates[Math.min(tried, candidates.length - 1)] || candidates[0];
                      }
                      if (picked) {
                        img.setAttribute('data-errcount', String(Math.min(pickedIndex + 1, candidates.length)));
                        if (img.src !== picked) {
                          img.src = picked;
                          usedImageUrls.add(picked);
                        }
                      }
                    }}
                  />
                );
              })()}
            </figure>
          );
          j++;
          continue;
        }
        if (tNext.startsWith('•')) {
          const bulletHtml = convertInlineLinks(tNext.slice(1).trim());
          sectionEls.push(
            <div key={`num-b-${j}`} className="flex items-start mb-3">
              <span className="text-purple-500 text-xl mr-3 mt-1" aria-hidden="true">•</span>
              <p className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: bulletHtml }} />
            </div>
          );
          j++;
          continue;
        }
        const paraHtml = convertInlineLinks(rawNext);
        sectionEls.push(<p key={`num-p-${j}`} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: paraHtml }} />);
        j++;
      }
      elements.push(
        <div key={`num-${i}`} className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4 rounded-r-lg">
          {sectionEls}
        </div>
      );
      i = j - 1;
      continue;
    }

    if (isSectionHeading(line)) {
      const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
      const headingId = cleanLine.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const AUTOLINKS: { term: string; slug: string }[] = [
        { term: 'journaling', slug: 'micro-journaling-habit' },
        { term: 'watercolor', slug: 'easy-watercolor-paintings' },
        { term: 'AI', slug: 'find-hobby-that-sticks' }
      ];
      let contentHtml = cleanLine;
      for (const { term, slug } of AUTOLINKS) {
        const re = new RegExp(`(\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b)`, 'gi');
        contentHtml = contentHtml.replace(re, `<a href="/blog/${slug}" class="text-purple-600 hover:underline">$1</a>`);
      }
      elements.push(
        <h2 key={`h-${i}`} id={headingId} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b-2 border-purple-200 pb-2 scroll-mt-8">
          <span dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('•')) {
      const bulletHtml = convertInlineLinks(trimmed.slice(1).trim());
      elements.push(
        <div key={`b-${i}`} className="flex items-start mb-3">
          <span className="text-purple-500 text-xl mr-3 mt-1" aria-hidden="true">•</span>
          <p className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: bulletHtml }} />
        </div>
      );
      continue;
    }

    if (line.includes('Ready to') || line.includes('Stop waiting') || line.includes('Let AI do') || line.includes('Don\'t wait')) {
      elements.push(
        <div key={`cta-${i}`} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-xl p-6 my-6 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-4">{line}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); window.location.href = '/generate'; }} 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Generate your personalized hobby plan"
          >
            Generate My Plan
          </button>
        </div>
      );
      continue;
    }

    const AUTOLINKS_BODY: { term: string; slug: string }[] = [
      { term: 'journaling', slug: 'micro-journaling-habit' },
      { term: 'watercolor', slug: 'easy-watercolor-paintings' },
      { term: 'AI', slug: 'find-hobby-that-sticks' }
    ];
    let bodyHtml = convertInlineLinks(line).replace(/\*\*(.*?)\*\*/g, '$1');
    for (const { term, slug } of AUTOLINKS_BODY) {
      const re = new RegExp(`(\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b)`, 'gi');
      bodyHtml = bodyHtml.replace(re, `<a href="/blog/${slug}" class="text-purple-600 hover:underline">$1</a>`);
    }
    elements.push(
      <p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    );
  }

  return <div className="prose prose-lg max-w-none">{elements}</div>;
}
