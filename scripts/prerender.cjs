#!/usr/bin/env node
/*
  Simple prerender for SPA: generate route-specific static HTML clones of dist/index.html
  with correct SEO meta (title, description, canonical, OG/Twitter tags).

  This is NOT full SSR of React content; it's head-level prerender so crawlers get
  correct meta in first HTML. Pages still hydrate client-side.
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
// Vite outputs to dist/public per vite.config.ts
const DIST = path.join(ROOT, 'dist', 'public');
const SITE = 'https://wizqo.com';

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, contents) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, contents, 'utf8');
}

function upsertTag(html, findRe, replacement) {
  if (findRe.test(html)) return html.replace(findRe, replacement);
  return html.replace(/<\/head>/i, `${replacement}\n</head>`);
}

function setTitle(html, title) {
  if (/<title>.*?<\/title>/i.test(html)) {
    return html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  }
  return html.replace(/<\/head>/i, `<title>${escapeHtml(title)}</title>\n</head>`);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setMeta(html, { title, description, canonical, ogImage, ogType = 'website', twitterCard = 'summary_large_image', robots = 'index, follow' }) {
  let out = html;
  out = setTitle(out, title);
  // description
  out = upsertTag(out, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  // robots
  out = upsertTag(out, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}">`);
  // canonical
  out = upsertTag(out, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  // Open Graph
  out = upsertTag(out, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  out = upsertTag(out, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  out = upsertTag(out, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${ogImage}">`);
  out = upsertTag(out, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${ogType}">`);
  out = upsertTag(out, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  // Twitter
  out = upsertTag(out, /<meta\s+name=["']twitter:card["'][^>]*>/i, `<meta name="twitter:card" content="${twitterCard}">`);
  out = upsertTag(out, /<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${escapeHtml(title)}">`);
  out = upsertTag(out, /<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${escapeHtml(description)}">`);
  out = upsertTag(out, /<meta\s+property=["']twitter:image["'][^>]*>/i, `<meta property="twitter:image" content="${ogImage}">`);
  out = upsertTag(out, /<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonical}">`);
  return out;
}

function cloneForRoute(baseHtml, route) {
  const canonical = `${SITE}${route.path}`;
  const ogImage = route.ogImage || `${SITE}/og-image.jpg`;
  return setMeta(baseHtml, {
    title: route.title,
    description: route.description,
    canonical,
    ogImage,
    ogType: route.ogType || (route.path.startsWith('/blog/') ? 'article' : 'website'),
    twitterCard: 'summary_large_image',
    robots: route.noIndex ? 'noindex, nofollow' : 'index, follow'
  });
}

function routeOutPath(distRoot, routePath) {
  // e.g. /kids -> dist/kids/index.html, /kids/games/memory -> dist/kids/games/memory/index.html
  const rel = routePath.replace(/^\/+/, '');
  return path.join(distRoot, rel, 'index.html');
}

function collectBlogPosts() {
  try {
    const file = path.join(ROOT, 'client', 'src', 'pages', 'BlogPage.tsx');
    const src = read(file);
    // naive extraction: id, title, excerpt, imageUrl
    const posts = [];
    const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?excerpt:\s*"([\s\S]*?)"[\s\S]*?(?:imageUrl:\s*"([^"]+)")?/g;
    let m;
    while ((m = re.exec(src))) {
      const id = m[1];
      const title = m[2];
      const excerpt = m[3].replace(/\s+/g, ' ').trim().slice(0, 300);
      const imageUrl = m[4] || `${SITE}/og-image.jpg`;
      posts.push({ id, title, excerpt, imageUrl });
    }
    // de-duplicate by id
    const seen = new Set();
    return posts.filter(p => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  } catch {
    return [];
  }
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/public not found. Run vite build first.');
    process.exit(1);
  }
  const baseIndexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    console.error(`Base index not found at ${baseIndexPath}`);
    process.exit(1);
  }
  const baseHtml = read(baseIndexPath);

  const routes = [];
  // Kids hub and games
  routes.push({ path: '/kids', title: 'Kids Hub – Fun Learning Games & Printable Activities for Kids', description: 'Discover our Kids Hub: free fun learning games, printable puzzles, and creative 7-day skill plans that make learning fun for children ages 6–12.' });
  const gameDesc = 'Play free fun learning games for kids online – Memory Match, Word Search, Puzzle, Typing Safari, and Pattern Builder. Kid‑safe, fast, and mobile‑friendly.';
  const games = [
    ['memory', 'Memory Match'],
    ['word-search', 'Word Search'],
    ['puzzle', 'Puzzle Game'],
    ['typing', 'Typing Safari'],
    ['pattern', 'Pattern Builder']
  ];
  for (const [slug, title] of games) {
    routes.push({ path: `/kids/games/${slug}`, title: `Kids Hub – ${title}`, description: gameDesc });
  }
  // Printables
  routes.push({ path: '/printables', title: 'Printable Fun Learning Activities for Kids | Free Worksheets & Games', description: 'Download free printable fun learning activities for kids — word searches, Sudoku, coloring pages, and spot-the-difference games. Perfect for home, school, or travel!' });
  // Blog root
  routes.push({ path: '/blog', title: 'Hobby Learning Blog - Tips, Guides & Inspiration - Wizqo', description: 'Discover expert tips, comprehensive guides, and inspiring stories to help you master new hobbies. Learn from our community of hobby enthusiasts.' });
  // Worksheets
  routes.push({ path: '/worksheets/1st-grade-math-worksheets', title: '1st Grade Math Worksheets – Free Printable PDF', description: 'Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF.' });
  routes.push({ path: '/worksheets/2nd-grade-math-worksheets', title: '2nd Grade Math Worksheets – Free Printable PDF', description: 'Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF.' });
  routes.push({ path: '/worksheets/handwriting-worksheet-maker', title: 'Free Handwriting Practice Sheets for Kids | Printable Tracing Worksheets', description: 'Download free printable handwriting practice sheets for kids. Trace letters A–Z, simple words, and sentences in both print and cursive. Fun and easy handwriting worksheets for young learners!' });
  // About/Contact/Legal
  routes.push({ path: '/about', title: 'About Wizqo - AI-Powered Hobby Learning Platform', description: "Learn about Wizqo's mission to make hobby learning accessible to everyone through AI-powered personalized plans and expert-curated content." });
  routes.push({ path: '/contact', title: 'Contact Wizqo – Questions, Feedback, or Hobby Ideas Welcome', description: 'Got a question or suggestion? Reach out to Wizqo\'s team — we typically respond within 24 hours. Let’s improve your hobby journey together' });
  routes.push({ path: '/privacy', title: 'Privacy Policy - Wizqo', description: 'Learn how Wizqo protects your privacy and handles your data while providing personalized hobby learning experiences.' });
  routes.push({ path: '/terms', title: 'Terms of Service - Wizqo', description: "Read Wizqo's terms of service and understand the rules and guidelines for using our hobby learning platform." });
  routes.push({ path: '/cookies', title: 'Cookie Policy - How Wizqo Uses Cookies | Transparent Data Practice', description: 'Understand how Wizqo uses cookies to enhance your learning experience. Comprehensive cookie policy covering types, purposes, and your control options.' });

  // Blog posts (from inline list)
  const posts = collectBlogPosts();
  for (const p of posts) {
    routes.push({ path: `/blog/${p.id}`, title: p.title, description: p.excerpt, ogImage: p.imageUrl, ogType: 'article' });
  }

  let count = 0;
  for (const r of routes) {
    const html = cloneForRoute(baseHtml, r);
    const out = routeOutPath(DIST, r.path);
    write(out, html);
    count++;
  }
  console.log(`Prerendered ${count} routes into dist/`);
}

main();
