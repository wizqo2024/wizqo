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

// Load worksheet SEO data to get all individual worksheet URLs
function getAllWorksheetURLs() {
  try {
    // Try to read from the generated worksheet SEO data
    const worksheetSEOFile = path.join(ROOT, 'client', 'public', 'worksheet-seo-data.json');
    if (!fs.existsSync(worksheetSEOFile)) {
      return [];
    }
    const data = JSON.parse(fs.readFileSync(worksheetSEOFile, 'utf8'));
    const worksheets = Object.entries(data).map(([slug, seo]) => ({
      slug,
      url: seo.canonicalUrl || `${SITE}/worksheets/${slug}`,
      title: seo.title || slug,
      description: seo.description,
      keywords: seo.keywords, // Added keywords extraction
      richContent: seo.richContent, // Capture rich content for bake-in
      image: seo.image
    })).filter(w => w.url && w.url.includes('/worksheets/'));

    console.log(`  → Loaded ${worksheets.length} worksheets from JSON.`);
    const withRich = worksheets.filter(w => w.richContent);
    console.log(`  → ${withRich.length} worksheets have richContent.`);

    return worksheets;
  } catch (e) {
    console.warn('Could not load worksheet SEO data:', e.message);
    return [];
  }
}

// GLOBAL LOOKUP: Direct access to SEO data by slug (bypasses route object issues)
let WORKSHEET_SEO_DATA_MAP = null;

function getWorksheetSEODataMap() {
  if (WORKSHEET_SEO_DATA_MAP !== null) {
    return WORKSHEET_SEO_DATA_MAP;
  }
  WORKSHEET_SEO_DATA_MAP = {};
  try {
    const paths = [
      path.join(ROOT, 'client', 'public', 'worksheet-seo-data.json'),
      path.join(ROOT, 'public', 'worksheet-seo-data.json')
    ];

    let found = false;
    for (const worksheetSEOFile of paths) {
      if (fs.existsSync(worksheetSEOFile)) {
        console.log(`  → Reading SEO data from: ${worksheetSEOFile}`);
        const data = JSON.parse(fs.readFileSync(worksheetSEOFile, 'utf8'));
        let count = 0;
        for (const [slug, seo] of Object.entries(data)) {
          WORKSHEET_SEO_DATA_MAP[slug] = {
            richContent: seo.richContent,
            image: seo.image
          };
          count++;
        }
        if (count > 0) {
          console.log(`  → Loaded SEO data map with ${count} entries from ${path.basename(worksheetSEOFile)}`);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      console.warn('  ⚠ WARNING: No worksheet-seo-data.json found in search paths!');
    }
  } catch (e) {
    console.warn('Could not load worksheet SEO data map:', e.message);
  }
  return WORKSHEET_SEO_DATA_MAP;
}

/**
 * Helper to get a map of slugs to richContent strings
 */
function getWorksheetRichContentMap() {
  const seoData = getWorksheetSEODataMap();
  const map = {};
  for (const [slug, data] of Object.entries(seoData)) {
    map[slug] = data.richContent;
  }
  return map;
}


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
  return html.replace(/<\/head>/i, `  ${replacement}\n</head>`);
}

function removeLegacyScripts(html) {
  let out = html;
  let removedCount = 0;

  // 1. Target specific IDs that MUST go (non-regex for maximum safety)
  const idsToKill = ['seo-update-script', 'seo-clean-script'];
  for (const id of idsToKill) {
    const startTag = `<script id="${id}">`;
    const endTag = '</script>';
    let startIdx = out.indexOf(startTag);
    while (startIdx !== -1) {
      const endIdx = out.indexOf(endTag, startIdx);
      if (endIdx !== -1) {
        const fullBlock = out.substring(startIdx, endIdx + endTag.length);
        out = out.replace(fullBlock, '');
        removedCount++;
      } else {
        break;
      }
      startIdx = out.indexOf(startTag);
    }
  }

  // 2. Identification-based purge
  const identifies = [
    'Dynamic SEO update',
    'worksheet-seo-data.json',
    'location.pathname',
    'isWorksheetPage',
    'Addition and Subtraction to 10',
    'The Wizqo Comprehensive Learning Guide',
    'var categoryPages',
    'Simplified SEO update',
    'updateSEO',
    'Simplified trigger'
  ];

  // Global regex for any remaining script tags (excluding LD+JSON)
  const scriptRegex = /<script(?![^>]*type=["']application\/ld\+json["'])[\s\S]*?<\/script>/gi;

  out = out.replace(scriptRegex, (match) => {
    const shouldRemove = identifies.some(pattern => match.includes(pattern));
    if (shouldRemove) {
      removedCount++;
      return '';
    }
    return match;
  });

  if (removedCount > 0) {
    console.log(`  ✓ Purged ${removedCount} legacy/redundant scripts.`);
  }
  return out;
}

function getThumbnailForRoute(routePath, title = '') {
  const path = routePath.toLowerCase();
  const t = title.toLowerCase();

  // 1. Check if we have a specific image in our SEO data map
  const slug = path.startsWith('/worksheets/') ? path.replace('/worksheets/', '').split('/')[0] : (path === '/' ? 'home' : null);
  if (slug) {
    const seoMap = getWorksheetSEODataMap();
    if (seoMap[slug] && seoMap[slug].image) {
      const img = seoMap[slug].image;
      return img.startsWith('http') ? img : `${SITE}${img}`;
    }
  }

  if (path.includes('multiplication')) return `${SITE}/images/thumbs/multiplication.png`;
  if (path.includes('times-table')) return `${SITE}/images/thumbs/times-table.png`;
  if (path.includes('fractions')) return `${SITE}/images/thumbs/fractions.png`;
  if (path.includes('handwriting') || path.includes('writing')) return `${SITE}/images/thumbs/handwriting.png`;
  if (path.includes('tracing')) return `${SITE}/images/thumbs/tracing.png`;
  if (path.includes('reading')) return `${SITE}/images/thumbs/reading.png`;
  if (path.includes('generator')) return `${SITE}/images/thumbs/generator.png`;
  if (path.includes('certificate')) return `${SITE}/images/thumbs/certificate.png`;

  if (path.includes('kindergarten')) return `${SITE}/images/thumbs/kindergarten.png`;
  if (path.includes('1st-grade') || path.includes('first-grade')) return `${SITE}/images/thumbs/first-grade.png`;
  if (path.includes('2nd-grade') || path.includes('second-grade')) return `${SITE}/images/thumbs/second-grade.png`;
  if (path.includes('3rd-grade') || path.includes('third-grade')) return `${SITE}/images/thumbs/third-grade.png`;
  if (path.includes('4th-grade') || path.includes('fourth-grade')) return `${SITE}/images/thumbs/fourth-grade.png`;
  if (path.includes('5th-grade') || path.includes('fifth-grade')) return `${SITE}/images/thumbs/fifth-grade.png`;

  if (t.includes('addition') || t.includes('subtraction') || t.includes('math') || t.includes('digit')) {
    return `${SITE}/images/thumbs/math-generic.png`;
  }

  // Home page or default fallback
  if (path === '/' || path === '') {
    const seoMap = getWorksheetSEODataMap();
    if (seoMap['home'] && seoMap['home'].image) {
      const img = seoMap['home'].image;
      return img.startsWith('http') ? img : `${SITE}${img}`;
    }
  }

  return `${SITE}/logo-720x720.png`;
}

function injectStructuredData(html, route) {
  const canonical = `${SITE}${route.path}`;
  const thumbnail = getThumbnailForRoute(route.path, route.title);

  // 1. LearningResource Schema
  let grade = 'K-5';
  if (route.path.includes('kindergarten')) grade = 'Kindergarten';
  else if (route.path.includes('1st-grade')) grade = 'Grade 1';
  else if (route.path.includes('2nd-grade')) grade = 'Grade 2';
  else if (route.path.includes('3rd-grade')) grade = 'Grade 3';
  else if (route.path.includes('4th-grade')) grade = 'Grade 4';
  else if (route.path.includes('5th-grade')) grade = 'Grade 5';

  const learningResource = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": route.title,
    "description": route.description,
    "image": thumbnail,
    "learningResourceType": "Worksheet",
    "educationalLevel": grade,
    "publisher": {
      "@type": "Organization",
      "name": "Wizqo",
      "url": SITE,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE}/icon-512.png`
      }
    }
  };

  // 2. BreadcrumbList Schema
  const segments = route.path.split('/').filter(Boolean);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Worksheets",
        "item": `${SITE}/worksheets`
      }
    ]
  };

  if (segments.length > 1) {
    let catName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    // Simple heuristic for category naming
    if (route.path.includes('math')) catName = 'Math';
    if (route.path.includes('reading')) catName = 'Reading';
    if (route.path.includes('handwriting')) catName = 'Handwriting';

    // Only add if it's not already 'Worksheets' to avoid duplicate position 1 and 2
    if (catName.toLowerCase() !== 'worksheets') {
      breadcrumbs.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": catName,
        "item": `${SITE}/${segments[0]}`
      });
    }

    const currentPos = breadcrumbs.itemListElement.length + 1;
    breadcrumbs.itemListElement.push({
      "@type": "ListItem",
      "position": currentPos,
      "name": route.title.split('|')[0].trim(),
      "item": canonical
    });
  }

  const scripts = `
  <script type="application/ld+json">${JSON.stringify(learningResource)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script>
  `;

  return html.replace(/<\/head>/i, `${scripts}\n</head>`);
}


function setTitle(html, title) {
  const escaped = escapeHtml(title);
  if (/<title>.*?<\/title>/i.test(html)) {
    return html.replace(/<title>.*?<\/title>/i, `<title>${escaped}</title>`);
  }
  // Try to find any title tag (even if split across lines)
  const flexibleTitle = /<title[\s\S]*?>[\s\S]*?<\/title>/i;
  if (flexibleTitle.test(html)) {
    return html.replace(flexibleTitle, `<title>${escaped}</title>`);
  }
  // Fallback to insertion before head
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `  <title>${escaped}</title>\n</head>`);
  }
  // Ultimate fallback: just prepend
  return `<title>${escaped}</title>\n${html}`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractH1FromTitle(title) {
  // Remove emojis and special characters at the start
  let h1 = title.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/gu, '');

  // Remove everything after separators (|, –, -) - these usually contain branding/descriptors
  h1 = h1.replace(/\s*\|\s*.*$/i, '');
  h1 = h1.replace(/\s*–\s*.*$/i, '');
  h1 = h1.replace(/\s*-\s*.*$/i, '');

  // Remove parenthetical content like "(PDF + Answer Key)", "(PDF)", "(Backed by Psychology)", etc.
  h1 = h1.replace(/\s*\([^)]*\).*$/i, '');

  // Remove common suffixes and descriptive phrases
  h1 = h1.replace(/\s*Free\s+PDF.*$/i, '');
  h1 = h1.replace(/\s*Free\s+Printable.*$/i, '');
  h1 = h1.replace(/\s*Free.*$/i, '');
  h1 = h1.replace(/\s*for\s+Kids.*$/i, '');
  h1 = h1.replace(/\s*for\s+Teachers.*$/i, '');
  h1 = h1.replace(/\s*for\s+Students.*$/i, '');
  h1 = h1.replace(/\s*Online.*$/i, '');
  h1 = h1.replace(/\s*Welcome.*$/i, '');
  h1 = h1.replace(/\s*Questions\s+&\s+Feedback.*$/i, '');
  h1 = h1.replace(/\s*Teaching\s+Tips.*$/i, '');
  h1 = h1.replace(/\s*Learning\s+Blog.*$/i, '');
  h1 = h1.replace(/\s*Play\s+Games.*$/i, '');
  h1 = h1.replace(/\s*Download.*$/i, '');

  // Remove "Free" from the beginning
  h1 = h1.replace(/^Free\s+/i, '');

  // For titles with multiple phrases, keep only the first main phrase
  // Example: "Free Printable Worksheet Ideas, Teaching Tips & Learning Blog" 
  // Should become just "Printable Worksheet Ideas" or even shorter
  const phrases = h1.split(/[,&]/);
  if (phrases.length > 1) {
    // Take first phrase and clean it
    h1 = phrases[0].trim();
    // Remove "Free" again if it appears
    h1 = h1.replace(/^Free\s+/i, '');
  }

  // Clean up extra whitespace
  h1 = h1.trim();

  // If H1 is still too long or similar to title, extract just the core topic
  // Take first 2-4 meaningful words (skip "Free", "How to", etc.)
  if (h1.length > 50 || h1 === title.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()) {
    const words = h1.split(/\s+/).filter(w =>
      w.length > 0 &&
      !/^(Free|How|to|Be|The|A|An|And|Or|But|For|With|From|About|Get|Make|Create|Download|Play|Learn|Find|Try|Easy|Best|Top|New|Old|Good|Bad|Online|PDF|Printable|Worksheets?|Games?|Kids?|Students?|Teachers?|Parents?)$/i.test(w)
    );
    h1 = words.slice(0, 5).join(' ').trim();
  }

  // Final fallback if still too short or empty
  if (!h1 || h1.length < 5) {
    // Use first 3-4 meaningful words of original title
    const words = title.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').split(/\s+/).filter(w => w.length > 0);
    h1 = words.slice(0, 4).join(' ').replace(/[|–\-\(].*$/, '').trim();
    h1 = h1.replace(/^Free\s+/i, '');
  }

  return h1 || title; // Fallback to original if all else fails
}

/**
 * Inject SoftwareApplication structured data for generator pages
 * This enables premium search result features like star ratings and price badges
 */
function injectStructuredData(html, route) {
  // Only inject for generator pages
  const generatorSlugs = [
    'counting-numbers-generator',
    'name-tracing-generator',
    'dot-marker-generator',
    'scissor-skills-generator',
    'handwriting-worksheet-maker',
    'spelling-list-generator',
    'certificate-maker'
  ];

  const slug = route.path.replace('/worksheets/', '').split('/')[0];
  const isGenerator = generatorSlugs.includes(slug);

  if (!isGenerator) {
    return html; // Not a generator, skip injection
  }

  const canonical = `${SITE}${route.path}`;
  const ogImage = route.ogImage || `${SITE}/images/${slug}-seo.png`;

  // Build SoftwareApplication schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": route.title.split('|')[0].trim(),
    "operatingSystem": "Any",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "EducationalTool",
    "url": canonical,
    "image": ogImage,
    "screenshot": ogImage,
    "description": route.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "254"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "xpath": [
        "/html/head/title",
        "/html/head/meta[@name='description']/@content"
      ]
    },
    "featureList": "Instant PDF download, Multiple themes, Personalization, 100% Free"
  };

  const schemaScript = `<script type="application/ld+json">${JSON.stringify(softwareAppSchema)}</script>`;

  // Inject before </head>
  return html.replace(/<\/head>/i, `  ${schemaScript}\n</head>`);
}

function ensureViewport(html) {
  // Ensure viewport meta tag is always present
  const viewportPattern = /<meta\s+name=["']viewport["'][^>]*>/i;
  if (!viewportPattern.test(html)) {
    // Add viewport tag right after charset meta tag
    const charsetMatch = html.match(/<meta\s+charset=["'][^"']*["'][^>]*>/i);
    if (charsetMatch) {
      const viewportTag = '    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />';
      return html.replace(charsetMatch[0], charsetMatch[0] + '\n' + viewportTag);
    } else {
      // If no charset found, add it before </head>
      const viewportTag = '    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />';
      return html.replace(/<\/head>/i, `${viewportTag}\n</head>`);
    }
  }
  return html;
}

function setMeta(html, { title, description, canonical, ogImage, ogType = 'website', twitterCard = 'summary_large_image', robots = 'index, follow', keywords }) {
  let out = html;
  out = setTitle(out, title);

  // Ensure viewport tag is present
  out = ensureViewport(out);

  // More aggressive replacement - replace entire tag including content
  // description
  out = out.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  if (!/<meta\s+name=["']description["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="description" content="${escapeHtml(description)}">\n</head>`);
  }

  // keywords (if provided)
  if (keywords) {
    out = out.replace(/<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapeHtml(keywords)}">`);
    if (!/<meta\s+name=["']keywords["'][^>]*>/i.test(out)) {
      out = out.replace(/<\/head>/i, `  <meta name="keywords" content="${escapeHtml(keywords)}">\n</head>`);
    }
  }

  // robots
  out = out.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}">`);
  if (!/<meta\s+name=["']robots["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="robots" content="${robots}">\n</head>`);
  }

  // canonical - remove all existing canonical links first, then add new one
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  out = out.replace(/<\/head>/i, `  <link rel="canonical" href="${canonical}">\n</head>`);

  // Open Graph
  out = out.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  if (!/<meta\s+property=["']og:title["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta property="og:title" content="${escapeHtml(title)}">\n</head>`);
  }

  // Ensure absolute image URL for meta tags
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  out = out.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  if (!/<meta\s+property=["']og:description["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta property="og:description" content="${escapeHtml(description)}">\n</head>`);
  }

  out = out.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${absoluteOgImage}">`);
  if (!/<meta\s+property=["']og:image["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta property="og:image" content="${absoluteOgImage}">\n</head>`);
  }

  out = out.replace(/<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${ogType}">`);
  if (!/<meta\s+property=["']og:type["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta property="og:type" content="${ogType}">\n</head>`);
  }

  out = out.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  if (!/<meta\s+property=["']og:url["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta property="og:url" content="${canonical}">\n</head>`);
  }

  // Twitter
  out = out.replace(/<meta\s+(?:name|property)=["']twitter:card["'][^>]*>/i, `<meta name="twitter:card" content="${twitterCard}">`);
  if (!/<meta\s+(?:name|property)=["']twitter:card["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="twitter:card" content="${twitterCard}">\n</head>`);
  }

  out = out.replace(/<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  if (!/<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="twitter:title" content="${escapeHtml(title)}">\n</head>`);
  }

  out = out.replace(/<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  if (!/<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="twitter:description" content="${escapeHtml(description)}">\n</head>`);
  }

  out = out.replace(/<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${absoluteOgImage}">`);
  if (!/<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="twitter:image" content="${absoluteOgImage}">\n</head>`);
  }

  out = out.replace(/<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${canonical}">`);
  if (!/<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i.test(out)) {
    out = out.replace(/<\/head>/i, `  <meta name="twitter:url" content="${canonical}">\n</head>`);
  }

  return out;
}

function cloneForRoute(baseHtml, route, allPosts = [], allRoutes = []) {
  const canonical = `${SITE}${route.path}`;
  const ogImage = getThumbnailForRoute(route.path, route.title);
  let workingHtml = baseHtml;

  // The removal pass is now handled at the very end of this function for absolute safety.
  // This allows setMeta to work on the original structure if needed.

  let html = setMeta(workingHtml, {
    title: route.title,
    description: route.description,
    canonical,
    ogImage,
    ogType: route.ogType || (route.path.startsWith('/blog/') ? 'article' : 'website'),
    twitterCard: 'summary_large_image',
    robots: route.noIndex ? 'noindex, nofollow' : 'index, follow',
    keywords: route.keywords
  });

  // Inject Rich Structured Data for Worksheets
  if (route.path.startsWith('/worksheets/') && route.path !== '/worksheets') {
    html = injectStructuredData(html, route);
  }

  // Final check: ensure viewport tag is always present
  html = ensureViewport(html);

  // 1. If we have rich content (from worksheet-seo-data.json), use it!
  const slug = route.path.startsWith('/worksheets/') ? route.path.replace('/worksheets/', '').split('/')[0] : (route.path === '/' ? 'home' : null);
  const seoDataMap = getWorksheetSEODataMap();
  const directSEO = slug ? seoDataMap[slug] : null;
  const directRichContent = directSEO ? directSEO.richContent : null;
  let richContent = directRichContent || route.richContent;



  if (richContent) {
    let richHtml = richContent;
    // ensure it has the main id if not present
    if (!richHtml.includes('id="seo-fallback"')) {
      richHtml = richHtml.replace('<article', '<main id="seo-fallback"').replace('</article>', '</main>');
    }


    // resilient replacement that doesn't care about style/attributes on original tag
    const mainRe = /<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/i;
    if (mainRe.test(html)) {
      html = html.replace(mainRe, richHtml);
    } else {
      // Fallback: search for the skeleton shell if main not found
      html = html.replace(/<\/header>/i, `</header>\n${richHtml}`);
    }
  }
  // 2. Otherwise fall back to hardcoded overrides (legacy)
  else if (route.path === '/worksheets/multiplication-worksheets') {
    // Replace fallback content with multiplication-specific content
    // H1 should be shorter than title to avoid duplicate
    const multiplicationContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Multiplication Worksheets
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
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, multiplicationContent);
  } else if (route.path === '/worksheets/times-table-multiplication-worksheets') {
    // Replace fallback content with times table-specific content
    // H1 should be shorter than title to avoid duplicate
    const timesTableContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Times Table Multiplication Worksheets
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
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, timesTableContent);
  } else if (route.path === '/worksheets/fractions-to-decimals-worksheets') {
    // Replace fallback content with fractions-to-decimals-specific content (already correct from prerender)
    // H1 should be shorter than title to avoid duplicate
    const fractionsToDecimalsContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Converting Fractions to Decimals Worksheets
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Download free fractions-to-decimals worksheets with answer keys. Easy, clear, no-login math PDFs perfect for grades 3–5. Boost confidence with simple step-by-step practice.
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Converting Fractions to Decimals Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Free printable fractions to decimals worksheets with step-by-step examples and answer keys. Perfect for 3rd, 4th, and 5th grade students learning to convert fractions to decimal form. Download PDF worksheets instantly for classroom or home practice.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Fractions to Decimals Practice Sheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Comprehensive fractions to decimals conversion worksheets covering proper fractions, improper fractions, and mixed numbers. Each worksheet includes visual examples and detailed answer keys for easy learning and practice.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Free Fractions to Decimals Worksheets PDF</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Download free printable fractions to decimals worksheets in PDF format. All worksheets include answer keys and are perfect for grades 3-5. No login required - instant download and printing.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">3rd Grade Fractions to Decimals Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Beginner-friendly fractions to decimals worksheets for 3rd grade. Practice converting fractions with denominators 10 and 100 to decimals. Step-by-step examples and visual models help students understand the concept clearly.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">4th Grade Fractions to Decimals Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Intermediate fractions to decimals worksheets for 4th grade. Convert mixed numbers to decimals, use division method, and compare fractions and decimals. Perfect for building advanced conversion skills.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">5th Grade Fractions to Decimals Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Advanced fractions to decimals worksheets for 5th grade. Master repeating decimals, complex word problems, and percent conversions. Comprehensive practice with detailed answer keys included.
        </p>
      </section>
    </main>`;

    // Replace the seo-fallback content
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, fractionsToDecimalsContent);
    // Ensure viewport tag is present (double-check after all processing)
    html = ensureViewport(html);
  } else if (route.path === '/worksheets/order-of-operations-worksheets') {
    // Redundant script removal removed as global removeLegacyScripts handles it better.
    // Replace fallback content with order-of-operations-specific content
    // H1 should be shorter than title to avoid duplicate
    const orderOfOperationsContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Order of Operations Worksheets (PEMDAS)
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Make PEMDAS finally "click"! Download free Order of Operations worksheets (PDF) with step-by-step practice. Stress-free exercises that build confidence in 4th–6th grade students. No login — just print and learn.
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Free Order of Operations Worksheets (PEMDAS)</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Download and print these no-stress PEMDAS worksheets. Each page includes an answer key. Perfect for grades 4–6 (and even review for 7th). Understanding the order of operations is one of the big math milestones in upper-elementary grades.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">PEMDAS Worksheets with Answers</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Free printable order of operations worksheets with complete answer keys. Practice PEMDAS rules with step-by-step solutions. Worksheets cover basic PEMDAS, parentheses, exponents, multi-step problems, and word problems.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">4th Grade PEMDAS Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Start with simple expressions using multiplication, division, addition, and subtraction. Perfect for building confidence in 4th grade students. Practice solving expressions with parentheses and basic order of operations.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">5th Grade PEMDAS Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Master expressions with exponents and multi-step problems. Challenge yourself with complex expressions combining parentheses, exponents, and all operations. Perfect for 5th grade mastery.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">6th Grade PEMDAS Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Master the most challenging order of operations problems. Perfect for 6th grade students ready for advanced practice. Comprehensive review of PEMDAS rules with step-by-step examples.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Step-by-Step PEMDAS Practice</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Learn PEMDAS with clear step-by-step instructions and worked examples. Ideal for students who struggle with order of operations. Build confidence with guided practice and comprehensive answer keys.
        </p>
      </section>
    </main>`;

    // Replace the seo-fallback content
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, orderOfOperationsContent);
    // Ensure viewport tag is present (double-check after all processing)
    html = ensureViewport(html);
  } else if (route.path === '/interactive-worksheets-generator') {
    // Replace fallback content with interactive worksheets-specific content
    // H1 should be shorter than title to avoid duplicate
    const interactiveContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Interactive Worksheets Generator
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
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, interactiveContent);
  } else if (route.path === '/') {
    // Inject homepage static content for SEO
    const homepageContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        Free Worksheets for Kids (K-5) | Math, Reading & More
      </h1>
      <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
        Download free printable worksheets for teachers, parents, and homeschoolers. Generate unlimited worksheets for math, reading, writing, science, and more with answer keys included. Worksheets for grades K-5.
      </p>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Free Printable Math Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          access thousands of free math worksheets for kindergarten through 5th grade. Practice addition, subtraction, multiplication, division, fractions, geometry, and more. All worksheets include answer keys and are available as PDF downloads.
        </p>
      </section>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Interactive Worksheet Generator</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Create your own custom worksheets with our AI-powered generator. Tailor problems to your student's specific needs and grade level. Generate unique problem sets for daily practice or testing.
        </p>
      </section>
      
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.875rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">Reading & Writing Worksheets</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          Build literacy skills with reading comprehension passages, handwriting practice, and grammar worksheets. Engaging activities designed to improve vocabulary, fluency, and writing abilities for elementary students.
        </p>
      </section>
    </main>`;

    // Insert the content - replacing any existing fallback or inserting new
    if (html.includes('id="seo-fallback"')) {
      html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, homepageContent);
    } else {
      // Insert after opening body tag if not found (fallback strategy)
      html = html.replace(/<body>/, '<body>' + homepageContent);
    }

    // Ensure viewport tag is present
    html = ensureViewport(html);
  } else if (route.path.startsWith('/worksheets/')) {
    // Check if we have rich content for this route from the worksheet SEO data
    const slug = route.path.replace('/worksheets/', '').split('/')[0];

    // DIRECT LOOKUP: Get richContent directly from JSON (bypasses route object issues)
    const richContentMap = getWorksheetRichContentMap();
    const directRichContent = richContentMap[slug];

    // Use direct lookup OR route.richContent as fallback
    let richContent = directRichContent || route.richContent;

    // DIAGNOSTIC: Why is richContent missing?
    if (slug === 'addition-subtraction-within-10' && !richContent) {
      console.log(`DIAGNOSTIC for addition-subtraction-within-10:`);
      console.log(`  directRichContent keys sample: ${Object.keys(richContentMap).slice(0, 5).join(', ')}`);
      console.log(`  Is slug in map: ${!!richContentMap[slug]}`);
      console.log(`  Map size: ${Object.keys(richContentMap).length}`);
    }

    if (slug && richContent) {
      // NUCLEAR: Ensure we are using the ID-based container for the bake-in
      const bakedContent = `<main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
        ${richContent}
      </main>`;

      // Try replacing by ID first
      const mainRe = /<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/i;
      if (mainRe.test(html)) {
        html = html.replace(mainRe, bakedContent);
      } else {
        // Search for any main or search for the header to insert after
        html = html.replace(/<\/header>/i, `</header>\n${bakedContent}`);
      }

      if (slug === 'addition-subtraction-within-10') {
        console.log(`  ✓ Enriched addition-subtraction-within-10 with ${richContent.length} chars of content.`);
      }
    } else {
      // Fallback for worksheets without richContent
      const h1Text = extractH1FromTitle(route.title);

      html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, `<main id="seo-fallback"><h1>${escapeHtml(h1Text)}</h1><p>${escapeHtml(route.description)}</p></main>`);
      if (slug === 'addition-subtraction-within-10') {
        console.log(`DEBUG: FALLBACK used for addition-subtraction-within-10 (NO richContent found anywhere!)`);
      }
    }

  } else if (route.path.startsWith('/kids/games/')) {

    // Inject Game Booster
    const gameBooster = `
        <article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">${escapeHtml(route.title)}</h1>
          <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2rem; line-height: 1.6;">${escapeHtml(route.description)}</p>
          
          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">The Educational Value of Play</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">At Wizqo, we believe that interactive games are a vital component of a well-rounded educational experience. Beyond mere entertainment, Digital "Mini-Games" like this one provide a low-stakes environment for students to practice essential cognitive skills. Whether it's memory training, fine-motor coordination through typing, or pattern recognition via word searches, our games are engineered to reinforce the same standards found in our physical worksheets. This multi-modal approach helps reach learners who may struggle with traditional pen-and-paper tasks, offering them a different "entry point" into complex subject matter.</p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Gaming in an educational context encourages "Logical Perseverance"—the ability to stay focused on a task until a solution is achieved. This resilience is directly transferable to classroom problem-solving. Our kid-safe, ad-minimized interface ensures that students can explore these digital concepts without the clutter and distractions often found on other platforms. By integrating play with structured learning, we help foster a lifelong love for discovery and intellectual curiosity.</p>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Cognitive Development & Reward Systems</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">The "Game-Loop" of challenge, action, and immediate feedback is one of the most powerful tools in modern pedagogy. When a student engages with this resource, they are not just "playing"—they are participating in a structured cycle of hypothesis testing. For instance, in a memory match, the student must visualize spatial locations and maintain that information in their short-term working memory while processing new visual stimuli. This exercise strengthens the prefrontal cortex and helps develop the attentional control required for high-stakes testing and daily coursework.</p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Furthermore, the intrinsic reward of achieving a "High Score" or completing a level builds internal self-efficacy. Students learn that effort leads to progress, a core tenet of a growth mindset. Unlike social media or high-intensity commercial games, our educational modules focus on "calm-tech" principles—reducing overstimulation so the brain can focus on the underlying logic of the task. This makes our games an ideal bridge for students transitioning from screen-time back to focused classroom study.</p>
          </section>

          <section style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #334155; margin-bottom: 0.75rem;">Benefits of Kid-Safe Educational Games</h3>
            <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
              <li><strong>Visual Discrimination:</strong> Games help students quickly identify differences and similarities in shapes, letters, and numbers under time-constrained conditions.</li>
              <li><strong>Strategic Thinking:</strong> Planning moves in a puzzle or logic game requires anticipating future states, a core component of mathematical reasoning.</li>
              <li><strong>Motor Mastery:</strong> Typing, clicking, and dragging activities refine the fine-motor coordination needed for advanced handwriting and digital literacy.</li>
              <li><strong>Emotional Resilience:</strong> Learning to handle "Game Over" states in a supportive environment helps children develop the grit needed to tackle difficult school subjects.</li>
            </ul>
          </section>

          <section style="margin-top: 2rem;">
            <p style="color: #475569; line-height: 1.6;">Join thousands of students who use Wizqo to master new skills through play. From Kindergarten foundations to Grade 5 mastery, our interactive tools are designed to support every learner on their unique educational journey. We are committed to keeping these resources free and accessible, ensuring that every child has the opportunity to thrive in a safe, productive digital environment. Start your learning adventure today!</p>
          </section>
        </article>`;
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, `<main id="seo-fallback">${gameBooster}</main>`);
  } else if (route.path.startsWith('/blog/')) {
    // Inject Blog Booster
    const blogBooster = `
        <article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">${escapeHtml(route.title)}</h1>
          <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2rem; line-height: 1.6;">${escapeHtml(route.description)}</p>
          
          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Wizqo Education Insights & Pedagogy</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">The Wizqo blog is a dedicated resource for teachers, parents, and homeschoolers seeking to optimize their student's learning outcomes. We provide deep dives into pedagogical strategies, practical tips for classroom management, and innovative ways to use printable worksheets to foster deep understanding. Our mission is to bridge the gap between educational theory and the daily realities of teaching, providing a roadmap for success in any learning environment.</p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Effective education is not just about what is taught, but how it is integrated into a child's world. By exploring our expert-vetted articles, authors gain access to high-fidelity insights that turn standard practice into meaningful mastery. Whether you are looking for new ways to teach multiplication or tips for supporting a struggling reader, our blog offers the evidence-based perspective you need to succeed. We prioritize clarity, accessibility, and actionable advice in every post, ensuring that our community feels supported and empowered.</p>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">A Holistic Approach to Literacy & Math</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Beyond simple worksheets, the Wizqo philosophy emphasizes the "Whole Learner." This means we look at the cognitive, emotional, and physical aspects of education simultaneously. Our articles often discuss the importance of "Tactile Feedback"—the way handwriting improves memory retention more effectively than typing. We also explore the psychology of motivation, helping parents understand how to use positive reinforcement and structured routines to reduce student anxiety. By taking a holistic view, we ensure that the academic progress made at home or in the classroom is sustainable and enjoyable for the child.</p>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">In today's fast-paced digital world, finding high-quality, distraction-free resources can be a challenge. That is why the Wizqo blog focuses on "Essentialism" in education—cutting through the noise to focus on the core standards that drive long-term achievement. From mastering the 120-chart in Kindergarten to understanding multi-step word problems in Grade 5, our content is mapped to the standard curriculum while remaining flexible enough for diverse learning styles.</p>
          </section>

          <section style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #334155; margin-bottom: 0.75rem;">Our Educational Commitment</h3>
            <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
              <li><strong>Expert-Led Research:</strong> We analyze current educational trends and cognitive science to bring you the best strategies for student success in math and literacy.</li>
              <li><strong>Practical Applications:</strong> Every article is designed to be useful immediately, with clear steps for home or classroom implementation.</li>
              <li><strong>Inclusive Mastery:</strong> We support diverse learners by providing accessible resources that cater to varied grade levels and skill sets.</li>
              <li><strong>Community Support:</strong> We provide a space for educators to share ideas and find inspiration for their daily teaching practice.</li>
            </ul>
          </section>

          <section style="margin-top: 2rem;">
            <p style="color: #475569; line-height: 1.6;">Join our growing community of educators and parents who trust Wizqo for their daily learning needs. Explore our comprehensive library of free printable worksheets and interactive tools today to see the difference that structured, high-quality support can make. Together, we can build a stronger foundation for the next generation of learners.</p>
          </section>
        </article>`;
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, `<main id="seo-fallback">${blogBooster}</main>`);
  } else {
    // For indexed pages or pages without explicit richContent, maintain the minimal, safe fallback
    const h1Text = extractH1FromTitle(route.title);
    html = html.replace(/<main[^>]*id="seo-fallback"[^>]*>[\s\S]*?<\/main>/, `<main id="seo-fallback"><h1>${escapeHtml(h1Text)}</h1><p>${escapeHtml(route.description)}</p></main>`);
  }

  // Ensure viewport tag is present
  html = ensureViewport(html);

  // --- GLOBAL SCRIPT REMOVAL (FINAL PASS) ---
  // We remove ALL client-side SEO/fallback logic scripts from the static HTML.
  // This prevents scripts from overriding the baked-in SEO metadata or showing the fallback content as limited data.
  html = removeLegacyScripts(html);

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

  // Clean the base HTML immediately
  let baseHtml = read(baseIndexPath);
  baseHtml = removeLegacyScripts(baseHtml);
  // Also remove the explicit fallback script if it exists
  baseHtml = baseHtml.replace(/<script id="seo-clean-script">[\s\S]*?<\/script>/gi, '');
  // Save the cleaned base index back to dist/public/index.html
  write(baseIndexPath, baseHtml);
  console.log(`  ✓ Base index.html cleaned and scripts removed.`);

  const routes = [];
  // Homepage - MUST be first
  routes.push({
    path: '/',
    title: 'Free Worksheets for Kids (K-5) | Math, Reading & More | Wizqo',
    description: "Download free printable worksheets for kids (K-5). Math, reading, writing, tracing, and multiplication worksheets with answer keys—100% free, ready to print.",
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
  // Load SEO data to look up rich content for specific hub routes
  let seoMap = {};
  try {
    const seoFilePath = path.join(ROOT, 'client', 'public', 'worksheet-seo-data.json');
    if (fs.existsSync(seoFilePath)) {
      seoMap = JSON.parse(fs.readFileSync(seoFilePath, 'utf8'));
    }
  } catch (e) {
    console.warn('Failed to load SEO map for hubs:', e.message);
  }

  // Helper to extract slug from path
  const getSlug = (p) => {
    let slug = p.replace('/worksheets/', '').replace('/', '');
    // Hub route mapping fixes
    if (slug === 'order-of-operations-worksheets') return 'order-of-operations';
    if (slug === 'fractions-to-decimals-worksheets') return 'fractions-to-decimals';
    return slug;
  };

  // Worksheets
  const worksheetsData = [
    { path: '/worksheets/all' },
    { path: '/worksheets/kindergarten-math-worksheets' },
    { path: '/worksheets/1st-grade-math-worksheets' },
    { path: '/worksheets/2nd-grade-math-worksheets' },
    { path: '/worksheets/3rd-grade-math-worksheets' },
    { path: '/worksheets/4th-grade-math-worksheets' },
    { path: '/worksheets/5th-grade-math-worksheets' },
    { path: '/worksheets/handwriting-worksheet-maker' },
    { path: '/worksheets/reading-comprehension' },
    { path: '/worksheets/multiplication-worksheets' },
    { path: '/worksheets/times-table-multiplication-worksheets' },
    { path: '/worksheets/fractions-to-decimals-worksheets' },
    { path: '/worksheets/order-of-operations-worksheets' },
    { path: '/interactive-worksheets-generator' }
  ];

  for (const wd of worksheetsData) {
    const slug = getSlug(wd.path);
    const seo = seoMap[slug] || {};
    routes.push({
      path: wd.path,
      title: seo.title || wd.title || 'Worksheets - Wizqo',
      description: seo.description || wd.description || 'Free printable worksheets for kids.',
      keywords: seo.keywords || wd.keywords,
      richContent: seo.richContent
    });
  }
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

  // Individual Worksheets (from generic list)
  const allWorksheets = getAllWorksheetURLs();
  console.log(`Found ${allWorksheets.length} individual worksheets to prerender`);

  // DEBUG: Check how many worksheets have richContent
  const withRichContent = allWorksheets.filter(w => w.richContent);
  console.log(`  → ${withRichContent.length} worksheets have richContent in JSON`);

  // DEBUG: Sample check for our target worksheet
  const targetWorksheet = allWorksheets.find(w => w.url.includes('addition-subtraction-within-10'));
  if (targetWorksheet) {
    console.log(`  → TARGET FOUND: addition-subtraction-within-10`);
    console.log(`    URL: ${targetWorksheet.url}`);
    console.log(`    Has richContent: ${!!targetWorksheet.richContent}`);
    console.log(`    richContent length: ${targetWorksheet.richContent ? targetWorksheet.richContent.length : 0}`);
  } else {
    console.log(`  → TARGET NOT FOUND: addition-subtraction-within-10`);
  }

  for (const w of allWorksheets) {
    const relativePath = w.url.replace(SITE, '');
    // Check if route already exists
    const existingIndex = routes.findIndex(r => r.path === relativePath || r.path === w.url);

    if (existingIndex >= 0) {
      // Route exists - AGGRESSIVELY UPDATE it with all metadata from JSON
      const r = routes[existingIndex];
      if (w.title) r.title = w.title;
      if (w.description) r.description = w.description;
      if (w.keywords) r.keywords = w.keywords;
      if (w.richContent) {
        r.richContent = w.richContent;
        console.log(`  Updated existing route ${relativePath} with enriched data (length: ${w.richContent.length})`);
      }
    } else {
      // Route doesn't exist - add it with all data
      routes.push({
        path: relativePath,
        title: w.title,
        description: w.description || `Free printable ${w.title} for kids. Download PDF with answer key.`,
        keywords: w.keywords,
        richContent: w.richContent,
        ogImage: `${SITE}/og-image.jpg`
      });
    }
  }




  let count = 0;
  let orderOfOpsGenerated = false;
  for (const r of routes) {
    const html = cloneForRoute(baseHtml, r, posts, routes);
    const out = routeOutPath(DIST, r.path);
    write(out, html);
    count++;
    if (r.path.startsWith('/blog/')) {
      console.log(`  Prerendered blog post: ${r.path} -> ${out}`);
    } else if (r.path.includes('order-of-operations') || r.path.includes('fractions-to-decimals')) {
      console.log(`  Prerendered special page: ${r.path} -> ${out}`);
      if (r.path.includes('order-of-operations')) {
        orderOfOpsGenerated = true;
      }
      // Verify file was written
      if (!fs.existsSync(out)) {
        console.error(`  ERROR: File not created at ${out}!`);
        process.exit(1);
      } else {
        const stats = fs.statSync(out);
        console.log(`  ✓ File verified at ${out} (${stats.size} bytes)`);
      }
      // Verify script removal worked
      if (html.includes('updateSEO') || html.includes('markAsLoaded')) {
        console.error(`  WARNING: Script removal failed for ${r.path}! SEO scripts still detected.`);
      } else {
        console.log(`  ✓ Script removal verified for ${r.path}`);
      }
      // Verify SEO metadata
      if (html.includes(r.title)) {
        console.log(`  ✓ SEO title verified: ${r.title.substring(0, 50)}...`);
      } else {
        console.error(`  ERROR: SEO title mismatch for ${r.path}!`);
        console.error(`  Expected: "${r.title}"`);
        // Log a snippet of the HTML title area for debugging
        const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (titleMatch) {
          console.error(`  Found in HTML: "${titleMatch[1]}"`);
        } else {
          console.error(`  No <title> tag found in HTML!`);
        }

        // Only exit for the primary target page, warn for others
        if (r.path.includes('order-of-operations-worksheets')) {
          process.exit(1);
        } else {
          console.warn(`  WARNING: Continuing despite title mismatch for ${r.path}`);
        }
      }
      // Verify canonical URL
      if (html.includes(`canonical" href="https://wizqo.com${r.path}"`)) {
        console.log(`  ✓ Canonical URL verified for ${r.path}`);
      } else {
        console.error(`  ERROR: Canonical URL missing or incorrect for ${r.path}!`);
      }
    }
  }

  // FINAL VALIDATION: Check for any remaining script tags across all generated files (sample check)
  console.log(`\n  --- Final Quality Validation ---`);
  const samplePaths = [
    path.join(DIST, 'index.html'),
    path.join(DIST, 'worksheets', 'addition-subtraction-within-10', 'index.html')
  ];

  for (const p of samplePaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const scriptMatches = content.match(/<script(?![^>]*type=["']application\/ld\+json["'])[\s\S]*?<\/script>/gi) || [];
      const suspicious = scriptMatches.filter(s => !s.includes('src="/assets/') && !s.includes('src="/src/'));

      if (suspicious.length > 0) {
        console.warn(`  ⚠ WARNING: Suspicious scripts found in ${path.basename(p)}:`);
        suspicious.forEach(s => console.warn(`    → ${s.substring(0, 100)}...`));
      } else {
        console.log(`  ✓ ${path.basename(p)} is script-clean (excluding LD+JSON and main assets).`);
      }
    }
  }

  console.log(`\nPrerendered ${count} routes into dist/`);

  // Critical check: ensure order-of-operations was generated
  if (!orderOfOpsGenerated) {
    console.error('CRITICAL ERROR: Order of Operations page was not prerendered!');
    process.exit(1);
  }

  // Final verification: check if the file exists on disk
  const orderOfOpsPath = routeOutPath(DIST, '/worksheets/order-of-operations-worksheets');
  if (!fs.existsSync(orderOfOpsPath)) {
    console.error(`CRITICAL ERROR: Order of Operations file not found at ${orderOfOpsPath}!`);
    process.exit(1);
  } else {
    console.log(`✓ Final verification: Order of Operations file exists at ${orderOfOpsPath}`);
  }

  // TRIPLE-LOCK ASSERTION: Ensure critical worksheets have rich content
  const CRITICAL_SLUGS = [
    '2-digit-subtraction-within-100',
    '2-digit-subtraction-with-regrouping',
    '2-digit-addition-within-100',
    '2-digit-addition-with-regrouping',
    'addition-subtraction-within-10'
  ];

  console.log('\n  --- Triple-Lock Rich Content Verification ---');
  for (const slug of CRITICAL_SLUGS) {
    const filePath = path.join(DIST, 'worksheets', slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error(`CRITICAL ERROR: High-fidelity file missing for ${slug} at ${filePath}`);
      process.exit(1);
    }
    const html = fs.readFileSync(filePath, 'utf8');
    if (html.length < 5000 || (!html.includes('<article>') && !html.includes('id="seo-fallback"')) || !html.includes('style=')) {
      console.error(`CRITICAL ERROR: Thin content detected for ${slug}! Length: ${html.length}`);
      console.error('Bailing build to prevent SEO regression.');
      process.exit(1);
    }
    console.log(`  ✓ Triple-Lock PASSED for ${slug} (${html.length} chars)`);
  }
}

main();
