// Analytics utility - loads asynchronously without affecting SEO
// Only loads after page is interactive

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

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

// Enhanced tracking functions for conversion and user behavior

/**
 * Track worksheet download/print (conversion event)
 */
export function trackWorksheetDownload(docId: string, docTitle: string, source: string, grade?: string) {
  trackEvent('worksheet_download', {
    doc_id: docId,
    doc_title: docTitle,
    source_page: source,
    grade: grade || 'unknown',
    event_category: 'conversion',
    event_label: 'Worksheet Download',
    value: 1, // Conversion value
  });
  
  // Also track as conversion
  trackConversion('worksheet_download', {
    doc_id: docId,
    source: source,
    grade: grade,
  });
}

/**
 * Track worksheet view (engagement metric)
 */
export function trackWorksheetView(docId: string, docTitle: string, source: string, grade?: string) {
  trackEvent('worksheet_view', {
    doc_id: docId,
    doc_title: docTitle,
    source_page: source,
    grade: grade || 'unknown',
    event_category: 'engagement',
  });
}

/**
 * Track print dialog opened
 */
export function trackPrintDialog(docId: string, source: string) {
  trackEvent('print_dialog_opened', {
    doc_id: docId,
    source_page: source,
    event_category: 'user_action',
  });
}

/**
 * Track answer key toggle
 */
export function trackAnswerKeyToggle(docId: string, action: 'show' | 'hide') {
  trackEvent('answer_key_toggle', {
    doc_id: docId,
    action: action,
    event_category: 'engagement',
  });
}

/**
 * Track category filter usage
 */
export function trackCategoryFilter(category: string, action: 'select' | 'deselect', page: string) {
  trackEvent('category_filter', {
    category: category,
    action: action,
    page: page,
    event_category: 'user_behavior',
  });
}

/**
 * Track grade level selection
 */
export function trackGradeSelection(grade: string, page: string) {
  trackEvent('grade_selection', {
    grade: grade,
    page: page,
    event_category: 'user_behavior',
  });
}

/**
 * Track worksheet generation (interactive generator)
 */
export function trackWorksheetGeneration(grade: string, categories: string[], count: number) {
  trackEvent('worksheet_generation', {
    grade: grade,
    categories: categories.join(','),
    worksheet_count: count,
    event_category: 'conversion',
    event_label: 'Worksheet Generated',
    value: count,
  });
  
  // Track as conversion
  trackConversion('worksheet_generated', {
    grade: grade,
    category_count: categories.length,
    worksheet_count: count,
  });
}

/**
 * Track user flow - page navigation
 */
export function trackUserFlow(from: string, to: string, action: string) {
  trackEvent('user_flow', {
    from_page: from,
    to_page: to,
    action: action,
    event_category: 'user_flow',
  });
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(page: string, seconds: number) {
  trackEvent('time_on_page', {
    page: page,
    time_seconds: seconds,
    event_category: 'engagement',
  });
}

/**
 * Track conversion events (for GA4 conversion tracking)
 */
export function trackConversion(conversionName: string, params?: Record<string, any>) {
  trackEvent(conversionName, {
    ...params,
    event_category: 'conversion',
  });
  
  // Also send as conversion event for GA4
  if (analyticsLoaded && window.gtag) {
    window.gtag('event', 'conversion', {
      conversion_name: conversionName,
      ...params,
    });
  }
}

/**
 * Track search behavior
 */
export function trackSearch(query: string, results: number, page: string) {
  trackEvent('search', {
    search_term: query,
    results_count: results,
    page: page,
    event_category: 'user_behavior',
  });
}

/**
 * Track button clicks (CTA tracking)
 */
export function trackCTAClick(ctaName: string, location: string, destination?: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
    destination: destination || 'unknown',
    event_category: 'conversion',
  });
}

/**
 * Track error events
 */
export function trackError(errorType: string, errorMessage: string, page: string) {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    page: page,
    event_category: 'error',
  });
}

/**
 * Track scroll depth (engagement metric)
 */
export function trackScrollDepth(page: string, depth: number) {
  trackEvent('scroll_depth', {
    page: page,
    scroll_depth: depth,
    event_category: 'engagement',
  });
}

/**
 * Track thumbnail/preview clicks
 */
export function trackThumbnailClick(docId: string, source: string) {
  trackEvent('thumbnail_click', {
    doc_id: docId,
    source_page: source,
    event_category: 'engagement',
  });
}

/**
 * Track pack generation
 */
export function trackPackGeneration(time: number, age: string, skill: string, count: number) {
  trackEvent('pack_generated', {
    time_minutes: time,
    age_range: age,
    skill: skill,
    worksheet_count: count,
    event_category: 'conversion',
    event_label: 'Print Pack Generated',
    value: count,
  });
  
  trackConversion('pack_generated', {
    time: time,
    age: age,
    skill: skill,
  });
}
