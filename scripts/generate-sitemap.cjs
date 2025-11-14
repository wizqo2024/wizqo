#!/usr/bin/env node
/*
  Generate sitemap.xml from Markdown and inline posts only (no print views).
  Note: fresh commit to retrigger deploy if Vercel had an internal error.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const site = 'https://wizqo.com';
const today = new Date().toISOString().slice(0, 10);

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
  // Try to read from basePosts.ts first (more reliable)
  const basePostsFile = path.join(ROOT, 'client', 'src', 'pages', 'blog', 'basePosts.ts');
  const basePostsSrc = readFileSafe(basePostsFile) || '';
  const idsFromBase = Array.from(basePostsSrc.matchAll(/id:\s*"([a-z0-9-]+)"/g)).map(m => m[1]);
  
  // Also check BlogPage.tsx as fallback
  const blogPageFile = path.join(ROOT, 'client', 'src', 'pages', 'BlogPage.tsx');
  const blogPageSrc = readFileSafe(blogPageFile) || '';
  const idsFromPage = Array.from(blogPageSrc.matchAll(/id:\s*"([a-z0-9-]+)"/g)).map(m => m[1]);
  
  // Combine and deduplicate
  const allIds = [...idsFromBase, ...idsFromPage];
  const exclude = new Set(['test-markdown-post']);
  const uniqueIds = Array.from(new Set(allIds)).filter(id => !exclude.has(id));
  
  // Extract dates from basePosts.ts if available
  const posts = [];
  for (const id of uniqueIds) {
    const dateMatch = basePostsSrc.match(new RegExp(`id:\\s*"${id}"[\\s\\S]*?date:\\s*"([^"]+)"`));
    const date = dateMatch ? dateMatch[1] : '';
    posts.push({ slug: id, date });
  }
  
  return posts;
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

  // Homepage
  push(`${site}/`, today, 'weekly', '1.0');
  
  // Main navigation pages
  push(`${site}/generate`, today, 'monthly', '0.9');
  push(`${site}/about`, today, 'monthly', '0.8');
  push(`${site}/contact`, today, 'monthly', '0.6');
  
  // Kids hub and games
  push(`${site}/kids`, today, 'weekly', '0.8');
  const kidsGames = ['memory', 'word-search', 'puzzle', 'typing', 'pattern'];
  for (const slug of kidsGames) {
    push(`${site}/kids/games/${slug}`, today, 'weekly', '0.6');
  }
  
  // Printables
  push(`${site}/printables`, today, 'weekly', '0.7');
  push(`${site}/printables/name-tracing-generator`, today, 'weekly', '0.85');
  push(`${site}/printables/certificate-maker`, today, 'weekly', '0.7');
  
  // Interactive worksheets generator
  push(`${site}/interactive-worksheets-generator`, today, 'daily', '0.8');
  
  // Blog
  push(`${site}/blog`, today, 'weekly', '0.8');
  
  // Worksheets pages
  push(`${site}/worksheets/kindergarten-math-worksheets`, today, 'weekly', '0.7');
  push(`${site}/worksheets/1st-grade-math-worksheets`, today, 'weekly', '0.7');
  push(`${site}/worksheets/2nd-grade-math-worksheets`, today, 'weekly', '0.7');
  push(`${site}/worksheets/multiplication-worksheets`, today, 'weekly', '0.7');
  push(`${site}/worksheets/reading-comprehension`, today, 'weekly', '0.7');
  push(`${site}/worksheets/handwriting-worksheet-maker`, today, 'weekly', '0.7');
  
  // Intentionally exclude /print?doc=..., /plan, /dashboard, /reset-password, /privacy, /terms, /cookies from sitemap (non-indexed)

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
