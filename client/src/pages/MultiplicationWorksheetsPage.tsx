import React, { useEffect } from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { SEOMetaTags } from '@/components/SEOMetaTags';
import { InteractiveWorksheetsPage } from './InteractiveWorksheetsPage';

// Set URL params synchronously before component renders - CRITICAL for parseInitialFilters
if (typeof window !== 'undefined' && window.location.pathname.includes('/worksheets/multiplication-worksheets')) {
  const params = new URLSearchParams(window.location.search);
  let needsUpdate = false;
  
  // Force set filters for multiplication - always ensure they're present
  const currentGrade = params.get('grade');
  const currentCategories = params.get('categories');
  
  if (currentGrade !== 'g2') {
    params.set('grade', 'g2'); // Default to 2nd-3rd grade
    needsUpdate = true;
  }
  if (currentCategories !== 'math') {
    params.set('categories', 'math');
    needsUpdate = true;
  }
  
  // Update URL synchronously if params changed - this must happen before any component renders
  if (needsUpdate) {
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    // Use replaceState synchronously - this happens before React renders
    window.history.replaceState({}, '', newUrl);
  }
}

export default function MultiplicationWorksheetsPage() {
  // Prevent URL from changing to /interactive-worksheets-generator
  useEffect(() => {
    const originalReplaceState = window.history.replaceState;
    const originalPushState = window.history.pushState;
    
    // Override history methods to prevent URL changes
    window.history.replaceState = function(...args) {
      const [state, , url] = args;
      // Only allow URL updates if they keep the multiplication-worksheets path
      if (typeof url === 'string' && url.includes('/worksheets/multiplication-worksheets')) {
        return originalReplaceState.apply(window.history, args);
      }
      // Block URL changes to interactive-worksheets-generator
      if (typeof url === 'string' && url.includes('/interactive-worksheets-generator')) {
        // Convert to multiplication-worksheets path
        const newUrl = url.replace('/interactive-worksheets-generator', '/worksheets/multiplication-worksheets');
        return originalReplaceState.apply(window.history, [state, '', newUrl]);
      }
      return originalReplaceState.apply(window.history, args);
    };
    
    window.history.pushState = function(...args) {
      const [state, , url] = args;
      // Only allow URL updates if they keep the multiplication-worksheets path
      if (typeof url === 'string' && url.includes('/worksheets/multiplication-worksheets')) {
        return originalPushState.apply(window.history, args);
      }
      // Block URL changes to interactive-worksheets-generator
      if (typeof url === 'string' && url.includes('/interactive-worksheets-generator')) {
        // Convert to multiplication-worksheets path
        const newUrl = url.replace('/interactive-worksheets-generator', '/worksheets/multiplication-worksheets');
        return originalPushState.apply(window.history, [state, '', newUrl]);
      }
      return originalPushState.apply(window.history, args);
    };
    
    return () => {
      // Restore original methods on unmount
      window.history.replaceState = originalReplaceState;
      window.history.pushState = originalPushState;
    };
  }, []);

  return (
    <>
      <SEOMetaTags
        title="Free Multiplication Worksheets - Printable PDFs with Answer Keys | Wizqo"
        description="Help your child master multiplication with our free multiplication worksheets for 2nd grade, 3rd grade, 4th grade, and 5th grade! Download printable PDFs instantly with answer keys. Practice multiplication facts, arrays, and word problems - perfect for building confidence and math fluency. No sign-up required!"
        keywords="multiplication worksheets, free multiplication worksheets, multiplication worksheets for 2nd grade, multiplication worksheets for 3rd grade, printable multiplication worksheets, multiplication facts worksheets, multiplication arrays worksheets, multiplication word problems, free multiplication worksheets PDF, multiplication practice sheets, multiplication worksheets with answer keys, 2nd grade multiplication worksheets, 3rd grade multiplication worksheets, multiplication tables worksheets, multiplication drills"
        canonicalUrl="https://wizqo.com/worksheets/multiplication-worksheets"
      />
      
      {/* Structured Data for SEO */}
      {(() => {
        const breadcrumbLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://wizqo.com/" },
            { "@type": "ListItem", position: 2, name: "Worksheets", item: "https://wizqo.com/interactive-worksheets-generator" },
            { "@type": "ListItem", position: 3, name: "Multiplication Worksheets", item: "https://wizqo.com/worksheets/multiplication-worksheets" }
          ]
        };
        
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are multiplication worksheets free to download?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! All multiplication worksheets are completely free. Generate unlimited unique multiplication worksheets, download as PDFs, and print as many copies as you need. No sign-up required."
              }
            },
            {
              "@type": "Question",
              name: "What grade levels are multiplication worksheets available for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our multiplication worksheets are perfect for 2nd grade, 3rd grade, 4th grade, and 5th grade students. Each worksheet is tailored to the appropriate grade level with multiplication facts, arrays, and word problems."
              }
            },
            {
              "@type": "Question",
              name: "Do multiplication worksheets include answer keys?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! Every multiplication worksheet automatically includes a complete answer key, making grading quick and easy for teachers and parents."
              }
            },
            {
              "@type": "Question",
              name: "What multiplication skills are covered?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our multiplication worksheets cover multiplication facts, arrays, multiplication word problems, fact fluency, and visual multiplication models. Perfect for building confidence and mastering multiplication skills."
              }
            }
          ]
        };

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}

      {/* Embed the Interactive Worksheets Generator with pre-filled filters */}
      <InteractiveWorksheetsPage />
    </>
  );
}
