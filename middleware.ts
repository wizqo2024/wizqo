/**
 * Vercel Edge Middleware to return proper 404 status codes for non-existent pages
 * This fixes the issue where invalid routes were returning 200 OK instead of 404 Not Found
 */

// Valid static routes (excluding API routes and static assets)
const VALID_ROUTES = new Set([
  '', // home
  'generate',
  'plan',
  'blog',
  'kids',
  'print',
  'interactive-worksheets-generator',
  'printables',
  'printables/name-tracing-generator',
  'printables/certificate-maker',
  'worksheets',
  'worksheets/all',
  'worksheets/multiplication-worksheets',
  'worksheets/times-table-multiplication-worksheets',
  'worksheets/fractions-to-decimals-worksheets',
  'worksheets/order-of-operations-worksheets',
  'worksheets/1st-grade-math-worksheets',
  'worksheets/2nd-grade-math-worksheets',
  'worksheets/handwriting-worksheet-maker',
  'worksheets/reading-comprehension',
  'worksheets/kindergarten-math-worksheets',
  'worksheets/3rd-grade-math-worksheets',
  'worksheets/4th-grade-math-worksheets',
  'worksheets/5th-grade-math-worksheets',
  'dashboard',
  'about',
  'contact',
  'privacy',
  'terms',
  'cookies',
  'reset-password',
]);

// Cache for worksheet slugs (loaded once)
let worksheetSlugsCache: Set<string> | null = null;

// Load worksheet slugs from the public JSON file
async function loadWorksheetSlugs(request: Request): Promise<Set<string>> {
  if (worksheetSlugsCache) {
    return worksheetSlugsCache;
  }

  try {
    // Construct URL to fetch worksheet-seo-data.json
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const worksheetDataUrl = `${baseUrl}/worksheet-seo-data.json`;
    
    const response = await fetch(worksheetDataUrl, {
      // Add cache headers to avoid refetching on every request
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      worksheetSlugsCache = new Set(Object.keys(data));
      return worksheetSlugsCache;
    }
  } catch (error) {
    console.error('Failed to load worksheet slugs in middleware:', error);
  }

  // Fallback: return empty set
  worksheetSlugsCache = new Set();
  return worksheetSlugsCache;
}

// Worksheet slug pattern validation
// Valid worksheet slugs follow this pattern: lowercase letters, numbers, and hyphens
function isValidWorksheetSlugPattern(slug: string): boolean {
  // Must be non-empty and match slug pattern (lowercase, numbers, hyphens)
  if (!slug || slug.length === 0) return false;
  
  // Check pattern: only lowercase letters, numbers, and hyphens
  const slugPattern = /^[a-z0-9-]+$/;
  if (!slugPattern.test(slug)) return false;
  
  // Must not start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) return false;
  
  // Must not have consecutive hyphens
  if (slug.includes('--')) return false;
  
  return true;
}

function isValidRoute(pathname: string): boolean {
  // Remove leading slash and locale prefix (es/, ar/)
  const cleanPath = pathname.replace(/^\//, '').replace(/^(es|ar)\//, '');
  
  // Check if it's a valid static route
  if (VALID_ROUTES.has(cleanPath)) {
    return true;
  }

  // Check if it's a valid worksheet route: /worksheets/[slug]
  const worksheetMatch = cleanPath.match(/^worksheets\/(.+)$/);
  if (worksheetMatch) {
    const slug = worksheetMatch[1];
    // Check against known category pages
    const categoryPages = [
      'all',
      'multiplication-worksheets',
      'times-table-multiplication-worksheets',
      'fractions-to-decimals-worksheets',
      'order-of-operations-worksheets',
      '1st-grade-math-worksheets',
      '2nd-grade-math-worksheets',
      'handwriting-worksheet-maker',
      'reading-comprehension',
      'kindergarten-math-worksheets',
      '3rd-grade-math-worksheets',
      '4th-grade-math-worksheets',
      '5th-grade-math-worksheets',
    ];
    
    if (categoryPages.includes(slug)) {
      return true;
    }
    
    // For dynamic worksheet slugs, we'll check them asynchronously
    // Return true for now and let the React app handle validation
    // This prevents blocking valid routes
    return true; // Allow through - React will handle 404 display
  }

  // Check if it's a blog post route: /blog/[slug]
  if (cleanPath.startsWith('blog/')) {
    return true; // Allow blog posts through
  }

  // Check if it's a kids game route: /kids/games/[game]
  if (cleanPath.startsWith('kids/games/')) {
    const validGames = ['memory', 'word-search', 'puzzle', 'typing', 'pattern'];
    const game = cleanPath.replace('kids/games/', '');
    return validGames.includes(game);
  }

  return false;
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip middleware for:
  // - API routes
  // - Static assets (_next, assets, etc.)
  // - Files with extensions (images, fonts, etc.)
  // - Sitemap and robots.txt
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|json|xml|txt|woff|woff2|ttf|eot)$/) ||
    pathname === '/sitemap.xml' ||
    pathname === '/sitemap_worksheets.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/worksheet-seo-data.json' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/favicon')
  ) {
    // Pass through - don't return anything to let request continue
    return;
  }

  // For worksheet routes, validate the slug
  const worksheetMatch = pathname.match(/^\/worksheets\/([^\/]+)/);
  if (worksheetMatch) {
    const slug = worksheetMatch[1];
    
    // Known category pages are valid
    const categoryPages = [
      'all',
      'multiplication-worksheets',
      'times-table-multiplication-worksheets',
      'fractions-to-decimals-worksheets',
      'order-of-operations-worksheets',
      '1st-grade-math-worksheets',
      '2nd-grade-math-worksheets',
      'handwriting-worksheet-maker',
      'reading-comprehension',
      'kindergarten-math-worksheets',
      '3rd-grade-math-worksheets',
      '4th-grade-math-worksheets',
      '5th-grade-math-worksheets',
    ];
    
    if (categoryPages.includes(slug)) {
      // Valid category page - pass through
      return;
    }

    // First check pattern - if invalid pattern, return 404 immediately
    if (!isValidWorksheetSlugPattern(slug)) {
      return new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Pattern is valid - now check if worksheet actually exists
    try {
      const worksheetSlugs = await loadWorksheetSlugs(request);
      if (!worksheetSlugs.has(slug)) {
        // Worksheet doesn't exist - return 404
        return new Response('Not Found', {
          status: 404,
          statusText: 'Not Found',
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
      // Worksheet exists - pass through
      return;
    } catch (error) {
      // If we can't load worksheet data, allow through (React will handle it)
      console.error('Error loading worksheet slugs:', error);
      return;
    }
  }

  // Check if it's a valid route
  if (isValidRoute(pathname)) {
    // Valid route - pass through
    return;
  }

  // Invalid route - return 404
  return new Response('Not Found', {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

// Vercel Edge Middleware config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
