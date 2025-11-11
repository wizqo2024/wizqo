// Analytics utility - loads asynchronously without affecting SEO
// Only loads after page is interactive

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.VITE_GA_MEASUREMENT_ID || '';

let analyticsLoaded = false;
let analyticsQueue: any[] = [];

export function initAnalytics() {
  if (typeof window === 'undefined' || analyticsLoaded) return;
  
  // Only load analytics if measurement ID is provided
  if (!GA_MEASUREMENT_ID) {
    console.log('Analytics: No measurement ID provided, skipping initialization');
    return;
  }

  // Load Google Analytics asynchronously after page load
  if (document.readyState === 'complete') {
    loadAnalytics();
  } else {
    window.addEventListener('load', loadAnalytics, { once: true });
  }
}

function loadAnalytics() {
  if (analyticsLoaded || typeof window === 'undefined') return;

  try {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      send_page_view: true,
    });

    // Load gtag.js script asynchronously
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      analyticsLoaded = true;
      // Process queued events
      analyticsQueue.forEach((args) => window.gtag?.(...args));
      analyticsQueue = [];
    };
    document.head.appendChild(script);

    // Track page view
    trackPageView(window.location.pathname);
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
}

export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;
  
  if (analyticsLoaded && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  } else {
    // Queue the event if analytics isn't loaded yet
    analyticsQueue.push(['config', GA_MEASUREMENT_ID, { page_path: path }]);
  }
}

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  if (analyticsLoaded && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    // Queue the event if analytics isn't loaded yet
    analyticsQueue.push(['event', eventName, eventParams]);
  }
}

export function trackWorksheetGenerated(grade: string, categories: string[]) {
  trackEvent('worksheet_generated', {
    grade,
    categories: categories.join(','),
    event_category: 'worksheets',
  });
}

export function trackBlogPostView(postId: string, postTitle: string) {
  trackEvent('blog_post_view', {
    post_id: postId,
    post_title: postTitle,
    event_category: 'blog',
  });
}

export function trackDownload(type: string, fileName: string) {
  trackEvent('file_download', {
    file_type: type,
    file_name: fileName,
    event_category: 'downloads',
  });
}
