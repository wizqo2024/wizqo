#!/usr/bin/env node
/*
  Generate sitemap.xml from Markdown and inline posts only (no print views).
  Note: fresh commit to retrigger deploy if Vercel had an internal error.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const site = 'https://wizqo.com';

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const meta = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!mm) continue;
    const k = mm[1].trim();
    let v = mm[2].trim();
    v = v.replace(/^"|"$/g, '');
    meta[k] = v;
  }
  return meta;
}

function collectMarkdownPosts() {
  const dir = path.join(ROOT, 'client', 'content', 'blog');
  const posts = [];
  if (!fs.existsSync(dir)) return posts;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const md = readFileSafe(path.join(dir, f));
    if (!md) continue;
    const meta = parseFrontmatter(md);
    const slug = meta.slug || f.replace(/\.md$/, '');
    const date = meta.date || '';
    posts.push({ slug, date });
  }
  return posts;
}

function collectInlinePosts() {
  const file = path.join(ROOT, 'client', 'src', 'pages', 'BlogPage.tsx');
  const src = readFileSafe(file) || '';
  const ids = Array.from(src.matchAll(/id:\s*"([a-z0-9-]+)"/g)).map(m => m[1]);
  const exclude = new Set(['test-markdown-post']);
  return Array.from(new Set(ids)).filter(id => !exclude.has(id)).map(slug => ({ slug, date: '' }));
}

// Intentionally no printable doc collection for sitemap

function uniqueBySlug(list) {
  const seen = new Set();
  const out = [];
  for (const p of list) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

function iso(d) {
  if (!d) return null;
  const t = Date.parse(d);
  if (!isFinite(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

function generate() {
  const md = collectMarkdownPosts();
  const inlinePosts = collectInlinePosts();
  const posts = uniqueBySlug([...md, ...inlinePosts]);

  const urls = [];
  const push = (loc, lastmod = null, changefreq = 'weekly', priority = '0.7') => {
    urls.push({ loc, lastmod, changefreq, priority });
  };

  push(`${site}/`, '2024-08-22', 'weekly', '0.8');
  push(`${site}/kids`, null, 'weekly', '0.8');
  // Kids games subpages
  const kidsGames = ['memory', 'word-search', 'puzzle', 'typing', 'pattern'];
  for (const slug of kidsGames) {
    push(`${site}/kids/games/${slug}`, null, 'weekly', '0.6');
  }
  push(`${site}/printables`, null, 'weekly', '0.7');
  // Intentionally excluding math hubs for now
  push(`${site}/blog`, null, 'weekly', '0.7');
  // Worksheets landing pages
  push(`${site}/worksheets/1st-grade-math-worksheets`, null, 'weekly', '0.7');
  push(`${site}/worksheets/2nd-grade-math-worksheets`, null, 'weekly', '0.7');
  push(`${site}/worksheets/reading-comprehension`, null, 'weekly', '0.7');
  // Reading print views
  const readingDocs = [
    'reading-g1-lost-hat','reading-g1-ants','reading-g1-bus-ride','reading-g1-pet-fish',
    'reading-g2-paper-bridge','reading-g2-rainy-garden','reading-g2-library-card','reading-g2-lost-and-found',
    'reading-g3-lighthouse','reading-g3-science-fair','reading-g3-community-garden'
  ];
  for (const d of readingDocs) {
    push(`${site}/print?doc=${d}`, null, 'weekly', '0.5');
  }

  for (const p of posts) {
    const lastmod = iso(p.date);
    push(`${site}/blog/${p.slug}`, lastmod, 'weekly', '0.7');
  }

  // Skipping /print?doc=... entries on purpose

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => {
      return [
        '  <url>',
        `    <loc>${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        `    <changefreq>${u.changefreq}</changefreq>`,
        `    <priority>${u.priority}</priority>`,
        '  </url>'
      ].filter(Boolean).join('\n');
    }),
    '</urlset>',
    ''
  ].join('\n');

  const outPath = path.join(ROOT, 'client', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote sitemap with ${posts.length} posts -> ${outPath}`);
}

generate();
