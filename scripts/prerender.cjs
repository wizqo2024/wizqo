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
  let html = setMeta(baseHtml, {
    title: route.title,
    description: route.description,
    canonical,
    ogImage,
    ogType: route.ogType || (route.path.startsWith('/blog/') ? 'article' : 'website'),
    twitterCard: 'summary_large_image',
    robots: route.noIndex ? 'noindex, nofollow' : 'index, follow',
    keywords: route.keywords
  });
  
  // Update SEO fallback content for specific pages
  if (route.path === '/worksheets/multiplication-worksheets') {
    // Replace fallback content with multiplication-specific content
    const multiplicationContent = `<main id="seo-fallback" style="display: none; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Multiplication Worksheets - Printable PDFs with Answer Keys
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, 4th grade, and 5th grade! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency.
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">2nd & 3rd Grade Multiplication Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Free printable multiplication worksheets for 2nd and 3rd grade students. Practice basic multiplication facts 1-5, multiplication arrays, skip counting, and simple word problems. Perfect for building foundational multiplication skills with answer keys included.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">3rd & 4th Grade Multiplication Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Advanced multiplication worksheets for 3rd and 4th grade. Master multiplication facts 6-12, larger arrays, multi-step word problems, and fact families. Download printable PDFs with answer keys for comprehensive practice.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">4th & 5th Grade Multiplication Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Multi-digit multiplication worksheets for 4th and 5th grade students. Practice 2×1 and 2×2 digit multiplication, area models, and complex word problems. Perfect for mastering advanced multiplication skills with answer keys included.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Multiplication Fluency & Practice</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Build multiplication fluency with fact practice, mixed reviews, multiplication strategies, and pattern recognition. All worksheets include answer keys and are available as free printable PDFs.
        </p>
      </section>
    </main>`;
    
    // Replace the seo-fallback content
    html = html.replace(/<main id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, multiplicationContent);
  } else if (route.path === '/worksheets/times-table-multiplication-worksheets') {
    // Replace fallback content with times table-specific content
    const timesTableContent = `<main id="seo-fallback" style="display: none; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Times Table Multiplication Worksheets (PDF) to Boost Your Child's Confidence
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Print free time table multiplication worksheets (PDF) that boost confidence, speed, and accuracy. Fun, no-stress practice sheets for grades 1–5 covering all times tables 1-12. Download horizontal, vertical, missing number, and timed test worksheets with answer keys included.
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Horizontal Times Table Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Practice times tables 1-5, 6-12, and complete 1-12 in horizontal format. Build confidence with simple, stress-free multiplication practice sheets perfect for beginners and advancing learners. All worksheets include answer keys.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Vertical Times Table Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Master times tables in vertical format. Step-by-step multiplication worksheets designed for kids who struggle with multiplication. Engaging worksheets that make learning fun and build math confidence.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Missing Number Times Table Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Fill in the missing numbers in times table problems. No-tears times table practice sheets that build understanding through pattern recognition. Perfect for building multiplication fluency with engaging practice.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Timed Times Table Tests</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Build speed and accuracy with timed multiplication tests for facts 1-5, 6-12, and complete 1-12. Printable timed multiplication test sheets for confident practice. Perfect for building multiplication fluency and memorizing times tables.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Blank Times Table Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Blank times table worksheets to fill in for facts 1-5, 6-12, and complete 1-12. Perfect for memorization practice and building multiplication confidence. Worksheets for kids who struggle with multiplication - build confidence step by step.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Confidence-Building Times Table Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Stress-free times table worksheets designed to build confidence. Fun and simple worksheets to make multiplication easier for struggling learners. Gentle step-by-step multiplication worksheets that build understanding and confidence.
        </p>
      </section>
    </main>`;
    
    // Replace the seo-fallback content
    html = html.replace(/<main id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, timesTableContent);
  } else if (route.path === '/interactive-worksheets-generator') {
    // Replace fallback content with interactive worksheets-specific content
    const interactiveContent = `<main id="seo-fallback" style="display: none; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Interactive Worksheets Generator | Create Printable PDF Worksheets Online
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Generate free interactive worksheets for math, reading, science, and SEL. Create printable PDF worksheets with answer keys for all grades (K-5). Daily refresh with new problems. No sign-up required!
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Math Worksheet Generator</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Create free printable math worksheets for all grades (K-5). Generate addition, subtraction, multiplication, division, fractions, and more with answer keys included. Perfect for teachers, parents, and homeschoolers.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Reading Worksheet Generator</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Generate free reading comprehension worksheets with passages and questions. Create printable PDF worksheets for all grade levels with answer keys. Perfect for building reading skills and comprehension.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Science & SEL Worksheet Generator</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Create free science and social-emotional learning (SEL) worksheets. Generate printable PDF worksheets with answer keys for all grades. Perfect for comprehensive learning across subjects.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Grade-Specific Worksheets (K-5)</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Generate worksheets tailored to specific grade levels from kindergarten through 5th grade. All worksheets include answer keys and are available as free printable PDFs. Daily refresh with new problems ensures fresh content every time.
        </p>
      </section>
    </main>`;
    
    // Replace the seo-fallback content
    html = html.replace(/<main id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, interactiveContent);
  } else if (route.path === '/') {
    // Ensure visible H1/H2 content exists for homepage (already in base HTML, but verify)
    if (!html.includes('id="seo-fallback"')) {
      console.warn('Warning: SEO fallback content missing in base HTML for homepage');
    }
  } else {
    // For other pages, remove or minimize the fallback content to avoid duplicate content issues
    // Keep it hidden but with minimal content
    html = html.replace(/<main id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, `<main id="seo-fallback" style="display: none;"><h1>${escapeHtml(route.title.replace(' | Wizqo', ''))}</h1><p>${escapeHtml(route.description)}</p></main>`);
  }
  
  return html;
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
      // Extract blog posts: id, title, excerpt, imageUrl, keywords
      // Find all post objects by looking for id: "..." patterns
      const idPattern = /id:\s*"([^"]+)"/g;
      let idMatch;
      const postStarts = [];
      while ((idMatch = idPattern.exec(src))) {
        postStarts.push({ index: idMatch.index, id: idMatch[1] });
      }
      
      // For each post, extract its fields
      for (let i = 0; i < postStarts.length; i++) {
        const start = postStarts[i].index;
        const end = i < postStarts.length - 1 ? postStarts[i + 1].index : src.length;
        const postBlock = src.substring(start, end);
        
        const id = postStarts[i].id;
        const titleMatch = postBlock.match(/title:\s*"([^"]+)"/);
        const excerptMatch = postBlock.match(/excerpt:\s*"([\s\S]*?)"(?:\s*[,}])/);
        const imageUrlMatch = postBlock.match(/imageUrl:\s*"([^"]+)"/);
        const keywordsMatch = postBlock.match(/keywords:\s*"([^"]+)"/);
        
        if (titleMatch && excerptMatch) {
          const title = titleMatch[1];
          const excerpt = excerptMatch[1].replace(/\s+/g, ' ').trim().slice(0, 300);
          const imageUrl = imageUrlMatch ? imageUrlMatch[1] : `${SITE}/og-image.jpg`;
          const keywords = keywordsMatch ? keywordsMatch[1] : undefined;
          posts.push({ id, title, excerpt, imageUrl, keywords });
        }
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
                  const keywords = meta.keywords || undefined;
                  posts.push({ id, title, excerpt, imageUrl, keywords });
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
    description: "Free PDF math and multiplication worksheets for Kindergarten to 5th grade. Download kindergarten math worksheets instantly – boost confidence!",
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
  routes.push({ path: '/kids', title: 'Kids Hub - Play Games & Download Free Printables', description: 'Play kid-safe mini-games and download free printables: puzzles, handwriting, and quick math warm-ups.', keywords: 'kids games, educational games for kids, free kids games, learning games, children activities' });
  const games = [
    { slug: 'memory', title: 'Memory Match', desc: 'Play free Memory Match game for kids! Improve memory and concentration with fun card matching. Kid-safe, educational, and mobile-friendly.', keywords: 'memory match game, memory game for kids, card matching game, concentration game, kids memory training' },
    { slug: 'word-search', title: 'Word Search', desc: 'Free Word Search game for kids! Build vocabulary and spelling skills with fun word puzzles. Educational and engaging word games.', keywords: 'word search game, word puzzle for kids, vocabulary game, spelling game, word find puzzle' },
    { slug: 'puzzle', title: 'Puzzle Game', desc: 'Free Puzzle Builder game for kids! Drag and drop pieces to solve puzzles. Develop problem-solving and spatial reasoning skills.', keywords: 'puzzle game for kids, jigsaw puzzle online, puzzle builder, kids puzzle game, educational puzzle' },
    { slug: 'typing', title: 'Typing Safari', desc: 'Free Typing Safari game for kids! Learn typing skills while racing animals. Fun typing practice for beginners and kids.', keywords: 'typing game for kids, typing practice, learn to type, typing tutor, kids typing game' },
    { slug: 'pattern', title: 'Pattern Builder', desc: 'Free Pattern Builder game for kids! Create and complete color patterns. Develop pattern recognition and logical thinking.', keywords: 'pattern game for kids, pattern recognition game, color pattern game, logic game for kids, pattern builder' }
  ];
  for (const game of games) {
    routes.push({ path: `/kids/games/${game.slug}`, title: `Kids Hub – ${game.title}`, description: game.desc, keywords: game.keywords });
  }
  // Printables
  routes.push({ path: '/printables', title: 'Printable Fun Learning Activities for Kids | Free Worksheets & Games', description: 'Download free printable fun learning activities for kids — word searches, Sudoku, coloring pages, and spot-the-difference games. Perfect for home, school, or travel!', keywords: 'printables for kids, free printable activities, printable games, kids printables, educational printables' });
  routes.push({ path: '/printables/name-tracing-generator', title: 'Free Name Tracing Generator - Create Personalized Handwriting Sheets', description: 'Create free personalized name tracing worksheets for kids! Customize font styles, sizes, and patterns. Perfect for teaching handwriting and name recognition. Print instantly!', keywords: 'name tracing generator, name tracing worksheets, personalized handwriting, name practice sheets, custom name tracing' });
  routes.push({ path: '/printables/certificate-maker', title: 'How to Make a Certificate Online - Free Certificate Maker', description: 'Create your own certificate online for free! Learn how to make a certificate with editable names, cute themes, and instant download options.', keywords: 'certificate maker, create certificate online, free certificate generator, award certificate maker, printable certificate' });
  // Blog root
  routes.push({ path: '/blog', title: 'Free Printable Worksheet Ideas, Teaching Tips & Learning Blog | Wizqo', description: 'Explore Wizqo\'s free educational blog — full of printable worksheet ideas, teaching hacks, learning tips, student hobbies, and classroom inspiration for teachers and parents.', keywords: 'free printable worksheets, learning blog, educational tips, teaching ideas, classroom resources, student hobbies, homeschool worksheets' });
  // Worksheets
  routes.push({ path: '/worksheets/kindergarten-math-worksheets', title: 'Kindergarten Math Worksheets – Free Printable PDF', description: 'Free printable kindergarten math worksheets for early learners. Download PDF worksheets covering counting, number recognition, basic shapes, and simple addition. Perfect for building math foundations with answer keys included.', keywords: 'kindergarten math worksheets, free kindergarten worksheets, printable kindergarten worksheets, kindergarten counting worksheets, number recognition worksheets, shapes worksheets kindergarten, kindergarten patterns worksheets, free printable kindergarten math worksheets PDF' });
  routes.push({ path: '/worksheets/1st-grade-math-worksheets', title: '1st Grade Math Worksheets – Free Printable PDF', description: 'Free 1st grade math worksheets—number sense, addition/subtraction within 10, ten‑frames, skip counting, and shapes. Print or save as PDF.', keywords: '1st grade math worksheets, first grade math worksheets, free 1st grade math worksheets PDF, printable math worksheets grade 1, addition worksheets first grade, subtraction worksheets grade 1, number sense worksheets, ten frames worksheets, skip counting worksheets' });
  routes.push({ path: '/worksheets/2nd-grade-math-worksheets', title: '2nd Grade Math Worksheets – Free Printable PDF', description: 'Free 2nd grade math worksheets covering counting, place value, addition/subtraction within 20 and 100, and focus skills. Print or save as PDF.', keywords: '2nd grade math worksheets, second grade math worksheets, free 2nd grade math worksheets PDF, printable math worksheets grade 2, addition worksheets second grade, subtraction worksheets grade 2, place value worksheets, counting worksheets grade 2' });
  routes.push({ path: '/worksheets/3rd-grade-math-worksheets', title: '3rd Grade Math Worksheets – Free Printable PDF', description: 'Free 3rd grade math worksheets covering advanced multiplication, fractions, division, and multi-step word problems. Printable PDF worksheets with answer keys for comprehensive math practice. Perfect for building problem-solving skills.', keywords: '3rd grade math worksheets, third grade math worksheets, free 3rd grade math worksheets PDF, printable math worksheets grade 3, multiplication worksheets 3rd grade, division worksheets 3rd grade, fractions worksheets 3rd grade, word problems 3rd grade, geometry worksheets 3rd grade' });
  routes.push({ path: '/worksheets/4th-grade-math-worksheets', title: '4th Grade Math Worksheets – Free Printable PDF', description: 'Free 4th grade math worksheets covering multiplication, division, fractions, decimals, and geometry. Download printable PDFs with answer keys for comprehensive math practice and skill building.', keywords: '4th grade math worksheets, fourth grade math worksheets, free 4th grade math worksheets PDF, printable math worksheets grade 4, multiplication worksheets 4th grade, division worksheets 4th grade, fractions worksheets 4th grade, decimals worksheets 4th grade, geometry worksheets 4th grade' });
  routes.push({ path: '/worksheets/5th-grade-math-worksheets', title: '5th Grade Math Worksheets – Free Printable PDF', description: 'Free 5th grade math worksheets covering advanced multiplication, division, fractions, decimals, and algebra basics. Download printable PDF worksheets with answer keys for comprehensive math practice.', keywords: '5th grade math worksheets, fifth grade math worksheets, free 5th grade math worksheets PDF, printable math worksheets grade 5, multiplication worksheets 5th grade, division worksheets 5th grade, fractions worksheets 5th grade, decimals worksheets 5th grade, algebra worksheets 5th grade, geometry worksheets 5th grade' });
  routes.push({ path: '/worksheets/handwriting-worksheet-maker', title: 'Free Handwriting Practice Sheets | Printable Tracing Worksheets', description: 'Download free printable handwriting practice sheets for kids. Trace letters A–Z, words, and sentences in print and cursive. Perfect for teaching handwriting!', keywords: 'handwriting worksheets, handwriting practice sheets, printable handwriting worksheets, tracing worksheets, cursive handwriting worksheets, print handwriting worksheets, handwriting practice for kids, free handwriting worksheets PDF' });
  routes.push({ path: '/worksheets/reading-comprehension', title: 'Free Printable Reading Comprehension Worksheets for Kids (PDF)', description: 'Download free printable reading comprehension worksheets for kids. Fun and engaging passages with questions, answers, and PDFs for grades 1–3.', keywords: 'reading comprehension worksheets, free reading comprehension worksheets PDF, reading comprehension for kids, reading passages with questions, reading worksheets grade 1, reading worksheets grade 2, reading worksheets grade 3, printable reading comprehension' });
  routes.push({ path: '/worksheets/multiplication-worksheets', title: 'Free Multiplication Worksheets - Printable PDFs with Answer Keys | Wizqo', description: 'Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, 4th grade, and 5th grade! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency. No sign-up required!', keywords: 'multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills' });
  routes.push({ path: '/worksheets/times-table-multiplication-worksheets', title: 'Free Time Table Multiplication Worksheets (PDF) — Build Confidence, Speed & Math Strength | Wizqo', description: 'Print free time table multiplication worksheets (PDF) that boost confidence, speed, and accuracy. Fun, no-stress practice sheets for grades 1–5. Download and learn today!', keywords: 'times table multiplication worksheets free pdf, printable times table worksheets for kids, 1–12 multiplication table worksheets pdf, free times table practice sheets grade 1–5, multiplication drill worksheets printable, easy times table worksheets for struggling learners, fun multiplication worksheets for kids pdf, basic multiplication worksheets for beginners, multiplication worksheets with answers pdf, confidence-building multiplication worksheets pdf, stress-free times table worksheets for kids, fun and simple worksheets to make multiplication easier, no-tears times table practice sheets, gentle step-by-step multiplication worksheets, worksheets for kids who struggle with multiplication, printable worksheets to help kids overcome math fear, engaging multiplication worksheets that make learning fun, horizontal multiplication worksheets pdf, vertical multiplication worksheets printable, missing number multiplication worksheets, timed multiplication test sheets printable, multiplication color-by-number worksheets, multiplication worksheets for slow learners pdf, blank times table worksheets to fill in, memorize times tables, multiplication fluency, math fact practice, repeated addition worksheets, math confidence building' });
  routes.push({ path: '/interactive-worksheets-generator', title: 'Free Interactive Worksheets Generator | Create Printable PDF Worksheets Online | Wizqo', description: 'Generate free interactive worksheets for math, reading, science, and SEL. Create printable PDF worksheets with answer keys for all grades (K-5). Daily refresh with new problems. No sign-up required!', keywords: 'interactive worksheets generator, free worksheet generator, printable worksheets generator, create worksheets online, math worksheet generator, reading worksheet generator, free worksheet maker, interactive math worksheets, printable PDF worksheets, worksheet generator with answer keys, grade-specific worksheets, K-5 worksheets' });
  // Print page (noIndex but still needs SEO for consistency)
  routes.push({ path: '/print', title: 'Printable Fun Learning Activities for Kids | Free Worksheets & Games', description: 'Download free printables for kids: word searches, Sudoku, coloring, and spot-the-difference. Print at home in seconds.', noIndex: true });
  // Plan page (noIndex but still needs SEO)
  routes.push({ path: '/plan', title: 'Your Learning Plan - Wizqo', description: 'Your personalized 7-day learning plan with daily videos, practice guides, and progress tracking.', noIndex: true });
  // Dashboard (noIndex but still needs SEO)
  routes.push({ path: '/dashboard', title: 'Your Learning Dashboard - Wizqo', description: 'Track your learning progress, manage your plans, and access your personalized educational resources and worksheets.', noIndex: true });
  // Reset password (noIndex but still needs SEO)
  routes.push({ path: '/reset-password', title: 'Reset Your Password - Wizqo', description: 'Reset your Wizqo account password securely and continue accessing free printable worksheets and learning resources.', noIndex: true });
  // About/Contact/Legal
  routes.push({ path: '/about', title: 'About Wizqo - Free Printable Worksheets for Teachers & Parents', description: "Learn about Wizqo's mission to provide free printable worksheets for teachers, parents, and homeschoolers. High-quality worksheets for math, reading, writing, and more with answer keys included.", keywords: 'about wizqo, free worksheets, printable worksheets, educational resources, teachers worksheets, homeschool worksheets, free math worksheets' });
  routes.push({ path: '/contact', title: 'Contact Wizqo - Questions & Feedback Welcome', description: 'Got a question or suggestion about our worksheets or learning tools? Reach out to Wizqo\'s team - we typically respond within 24 hours.', keywords: 'contact wizqo, worksheet support, educational help, teacher resources contact' });
  routes.push({ path: '/privacy', title: 'Privacy Policy - Wizqo', description: 'Learn how Wizqo protects your privacy and handles your data while providing free printable worksheets and personalized learning experiences.', keywords: 'privacy policy, data protection, user privacy, educational platform privacy', noIndex: true });
  routes.push({ path: '/terms', title: 'Terms of Service - Wizqo', description: "Read Wizqo's terms of service and understand the rules and guidelines for using our educational platform and worksheet generator.", keywords: 'terms of service, user agreement, platform terms, educational website terms', noIndex: true });
  routes.push({ path: '/cookies', title: 'Cookie Policy - How Wizqo Uses Cookies | Transparent Data Practice', description: 'Understand how Wizqo uses cookies to enhance your learning experience. Comprehensive cookie policy covering types, purposes, and your control options.', keywords: 'cookie policy, website cookies, data cookies, privacy cookies', noIndex: true });

  // Blog posts (from inline list)
  const posts = collectBlogPosts();
  console.log(`Found ${posts.length} blog posts to prerender`);
  for (const p of posts) {
    routes.push({ 
      path: `/blog/${p.id}`, 
      title: p.title, 
      description: p.excerpt, 
      ogImage: p.imageUrl, 
      ogType: 'article',
      keywords: p.keywords
    });
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
