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

function setMeta(html, { title, description, canonical, ogImage, ogType = 'website', twitterCard = 'summary_large_image', robots = 'index, follow', keywords }) {
  let out = html;
  out = setTitle(out, title);
  // description
  out = upsertTag(out, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  // keywords (if provided)
  if (keywords) {
    out = upsertTag(out, /<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapeHtml(keywords)}">`);
  }
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
    robots: route.noIndex ? 'noindex, nofollow' : 'index, follow',
    keywords: route.keywords
  });
}

function routeOutPath(distRoot, routePath) {
  // e.g. /kids -> dist/kids/index.html, /kids/games/memory -> dist/kids/games/memory/index.html
  const rel = routePath.replace(/^\/+/, '');
  return path.join(distRoot, rel, 'index.html');
}

function collectBlogPosts() {
  const posts = [];
  try {
    // Read from basePosts.ts
    const basePostsFile = path.join(ROOT, 'client', 'src', 'pages', 'blog', 'basePosts.ts');
    if (fs.existsSync(basePostsFile)) {
      const src = read(basePostsFile);
      // Extract blog posts: id, title, excerpt, imageUrl
      const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?excerpt:\s*"([\s\S]*?)"[\s\S]*?(?:imageUrl:\s*"([^"]+)")?/g;
      let m;
      while ((m = re.exec(src))) {
        const id = m[1];
        const title = m[2];
        const excerpt = m[3].replace(/\s+/g, ' ').trim().slice(0, 300);
        const imageUrl = m[4] || `${SITE}/og-image.jpg`;
        posts.push({ id, title, excerpt, imageUrl });
      }
    }
    
    // Also check for markdown files in content/blog directory
    const contentDirs = [
      path.join(ROOT, 'content', 'blog'),
      path.join(ROOT, 'client', 'content', 'blog'),
      path.join(ROOT, 'client', 'src', 'pages', 'blog', 'content'),
    ];
    
    for (const contentDir of contentDirs) {
      if (fs.existsSync(contentDir)) {
        try {
          const files = fs.readdirSync(contentDir, { recursive: true });
          for (const file of files) {
            if (typeof file === 'string' && file.endsWith('.md')) {
              const filePath = path.isAbsolute(file) ? file : path.join(contentDir, file);
              try {
                const content = read(filePath);
                const fmMatch = content.match(/^---[\s\S]*?---/);
                if (fmMatch) {
                  const fmBlock = fmMatch[0].replace(/^---|---$/g, '').trim();
                  const meta = {};
                  for (const line of fmBlock.split('\n')) {
                    const idx = line.indexOf(':');
                    if (idx > -1) {
                      const key = line.slice(0, idx).trim();
                      let value = line.slice(idx + 1).trim();
                      value = value.replace(/^["']|["']$/g, '');
                      meta[key] = value;
                    }
                  }
                  const fileSlug = file.replace(/\.md$/, '').replace(/.*\//, '');
                  const id = meta.slug || fileSlug;
                  const title = meta.title || id;
                  const excerpt = (meta.excerpt || '').replace(/\s+/g, ' ').trim().slice(0, 300);
                  const imageUrl = meta.cover || meta.imageUrl || `${SITE}/og-image.jpg`;
                  posts.push({ id, title, excerpt, imageUrl });
                }
              } catch (fileErr) {
                console.warn(`Warning: Could not read markdown file ${filePath}:`, fileErr.message);
              }
            }
          }
        } catch (dirErr) {
          console.warn(`Warning: Could not read directory ${contentDir}:`, dirErr.message);
        }
      }
    }
    
    // de-duplicate by id
    const seen = new Set();
    return posts.filter(p => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  } catch (err) {
    console.error('Error collecting blog posts:', err);
    return posts; // Return what we have so far
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
  // Homepage - MUST be first
  routes.push({ 
    path: '/', 
    title: 'Free PDF Math and Multiplication Worksheets for Kindergarten to 5th Grade | Wizqo', 
    description: "Make learning fun with free PDF math and multiplication worksheets, including kindergarten math worksheets, for Kindergarten to 5th grade – boost confidence and enjoy every lesson!",
    ogImage: `${SITE}/og-image.jpg`
  });
  // Generate route (AI Learning Plan Generator)
  routes.push({ 
    path: '/generate', 
    title: 'My Learning Plan Generator - Free AI-Powered 7-Day Plans | Wizqo', 
    description: 'Create my learning plan instantly with AI! Generate personalized 7-day learning plans with daily lessons, videos, and practice prompts. Free tool for teachers, students, and hobby learners.',
    keywords: 'my learning plan, learning plan generator, create learning plan, personalized learning plan, 7-day learning plan, AI learning plan, free learning plan generator',
    ogImage: `${SITE}/og-image.jpg`
  });
  // Kids hub and games
  routes.push({ path: '/kids', title: 'Kids Hub - Play Games & Download Free Printables', description: 'Play kid-safe mini-games and download free printables: puzzles, handwriting, and quick math warm-ups.' });
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
  routes.push({ path: '/printables/name-tracing-generator', title: 'Free Name Tracing Generator - Create Personalized Handwriting Sheets', description: 'Create free personalized name tracing worksheets for kids! Customize font styles, sizes, and patterns. Perfect for teaching handwriting and name recognition. Print instantly!' });
  routes.push({ path: '/printables/certificate-maker', title: 'How to Make a Certificate Online - Free Certificate Maker', description: 'Create your own certificate online for free! Learn how to make a certificate with editable names, cute themes, and instant download options.' });
  // Blog root
  routes.push({ path: '/blog', title: 'Free Printable Worksheet Ideas, Teaching Tips & Learning Blog | Wizqo', description: 'Explore Wizqo\'s free educational blog — full of printable worksheet ideas, teaching hacks, learning tips, student hobbies, and classroom inspiration for teachers and parents.', keywords: 'free printable worksheets, learning blog, educational tips, teaching ideas, classroom resources, student hobbies, homeschool worksheets' });
  // Worksheets
  routes.push({ path: '/worksheets/1st-grade-math-worksheets', title: '1st Grade Math Worksheets – Free Printable PDF', description: 'Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF.', keywords: '1st grade math worksheets, first grade math worksheets, free 1st grade math worksheets PDF, printable math worksheets grade 1, addition worksheets first grade, subtraction worksheets grade 1, number sense worksheets, ten frames worksheets, skip counting worksheets' });
  routes.push({ path: '/worksheets/2nd-grade-math-worksheets', title: '2nd Grade Math Worksheets – Free Printable PDF', description: 'Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF.', keywords: '2nd grade math worksheets, second grade math worksheets, free 2nd grade math worksheets PDF, printable math worksheets grade 2, addition worksheets second grade, subtraction worksheets grade 2, place value worksheets, counting worksheets grade 2' });
  routes.push({ path: '/worksheets/handwriting-worksheet-maker', title: 'Free Handwriting Practice Sheets | Printable Tracing Worksheets', description: 'Download free printable handwriting practice sheets for kids. Trace letters A–Z, words, and sentences in print and cursive. Perfect for teaching handwriting!', keywords: 'handwriting worksheets, handwriting practice sheets, printable handwriting worksheets, tracing worksheets, cursive handwriting worksheets, print handwriting worksheets, handwriting practice for kids, free handwriting worksheets PDF' });
  routes.push({ path: '/worksheets/reading-comprehension', title: 'Free Printable Reading Comprehension Worksheets for Kids (PDF)', description: 'Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3.', keywords: 'reading comprehension worksheets, free reading comprehension worksheets PDF, reading comprehension for kids, reading passages with questions, reading worksheets grade 1, reading worksheets grade 2, reading worksheets grade 3, printable reading comprehension' });
  routes.push({ path: '/worksheets-1', title: '1st Grade Math Worksheets – Free Printable PDF', description: 'Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF.' });
  routes.push({ path: '/interactive-worksheets-generator', title: 'Interactive Worksheets Generator | Free Printable PDF Activities', description: 'Generate interactive worksheets for math, reading, science, SEL, and more. Free printable PDFs with daily refresh and answer keys for every grade.' });
  // About/Contact/Legal
  routes.push({ path: '/about', title: 'About Wizqo - Free Printable Worksheets for Teachers & Parents', description: "Learn about Wizqo's mission to provide free printable worksheets for teachers, parents, and homeschoolers. High-quality worksheets for math, reading, writing, and more with answer keys included." });
  routes.push({ path: '/contact', title: 'Contact Wizqo - Questions & Feedback Welcome', description: 'Got a question or suggestion about our worksheets or learning tools? Reach out to Wizqo\'s team - we typically respond within 24 hours.' });
  routes.push({ path: '/privacy', title: 'Privacy Policy - Wizqo', description: 'Learn how Wizqo protects your privacy and handles your data while providing free printable worksheets and personalized learning experiences.' });
  routes.push({ path: '/terms', title: 'Terms of Service - Wizqo', description: "Read Wizqo's terms of service and understand the rules and guidelines for using our educational platform and worksheet generator." });
  routes.push({ path: '/cookies', title: 'Cookie Policy - How Wizqo Uses Cookies | Transparent Data Practice', description: 'Understand how Wizqo uses cookies to enhance your learning experience. Comprehensive cookie policy covering types, purposes, and your control options.' });

  // Blog posts (from inline list)
  const posts = collectBlogPosts();
  console.log(`Found ${posts.length} blog posts to prerender`);
  for (const p of posts) {
    routes.push({ path: `/blog/${p.id}`, title: p.title, description: p.excerpt, ogImage: p.imageUrl, ogType: 'article' });
  }

  let count = 0;
  for (const r of routes) {
    const html = cloneForRoute(baseHtml, r);
    const out = routeOutPath(DIST, r.path);
    write(out, html);
    count++;
    if (r.path.startsWith('/blog/')) {
      console.log(`  Prerendered blog post: ${r.path} -> ${out}`);
    }
  }
  console.log(`Prerendered ${count} routes into dist/`);
}

main();
