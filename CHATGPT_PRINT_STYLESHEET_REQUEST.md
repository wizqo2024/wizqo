# Print Stylesheet Request for ChatGPT

## Worksheet: kindergarten-counting-visual

### HTML Container Structure

```html
<div data-worksheet-content="true" data-doc="kindergarten-counting-visual">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0 print:py-0 print:mt-0">
    
    <!-- Logo (print only) -->
    <div class="hidden print:block wizqo-logo-print">
      <img src="/logo.svg" alt="Wizqo Logo" />
      <span class="domain-text">www.wizqo.com</span>
    </div>

    <!-- Worksheet Section Wrapper -->
    <section class="worksheet-section mb-10 break-inside-avoid rounded-xl border-2 p-6 print:border-0 print:p-0 print:bg-white print:mt-0 print:mb-0 print:pt-0">
      
      <!-- Header (hidden in print) -->
      <div class="print:hidden">...</div>
      
      <!-- Title -->
      <h2 class="text-xl font-bold mb-2">🐻 Counting with Cute Characters</h2>
      
      <!-- Description -->
      <p class="text-sm mb-4">Count the cute cartoon characters in each group. Write the number in the box.</p>
      
      <!-- Example Section -->
      <div class="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
        <div class="font-semibold text-blue-900 mb-3 text-sm">📚 Example - Let's solve this together:</div>
        <div class="space-y-2 text-sm">
          <div class="font-semibold text-base"><strong>Count the bears:</strong></div>
          <div class="flex gap-2 justify-center mb-3">
            <svg width="240" height="80">
              <!-- Bear SVGs -->
            </svg>
          </div>
          <div class="pl-4 border-l-2 border-blue-300 space-y-1">
            <div><strong>Step 1:</strong> Point to each bear and count: 1, 2, 3</div>
            <div class="font-semibold text-blue-900"><strong>Answer:</strong> 3</div>
          </div>
        </div>
      </div>
      
      <!-- Questions Container -->
      <div class="space-y-2 print:space-y-1">
        
        <!-- Each Question (THIS IS THE CRITICAL PART) -->
        <div class="question-section-wrapper">
          <div class="question-section question-block count-group border-4 border-pink-200 rounded-2xl print:p-3 p-5 print:my-2 my-4 bg-pink-50 print:flex-col flex flex-wrap items-start break-inside-avoid">
            
            <!-- Question Heading -->
            <div class="min-w-[150px] font-bold text-2xl print:text-xl text-pink-900 mb-2 md:mb-0 print:mb-1">
              How many flowers?
            </div>
            
            <!-- Character Images (SVG) -->
            <div class="mx-5 print:mx-0 flex-1 min-w-0 print:w-full">
              <svg width="650" height="100" class="max-w-full h-auto print:max-h-[120px]" viewBox="0 0 650 100" preserveAspectRatio="xMidYMid meet">
                <!-- Multiple character SVGs inside -->
                <g transform="translate(10, 10)">
                  <!-- Flower SVG component -->
                </g>
                <!-- More characters... -->
              </svg>
            </div>
            
            <!-- Answer Box -->
            <div class="ml-auto print:ml-0 print:mt-1 min-w-[80px] mt-2 md:mt-0">
              <svg width="80" height="80" viewBox="0 0 80 80" class="print:w-16 print:h-16">
                <rect x="0" y="0" width="80" height="80" rx="10" ry="10" fill="#FFFFFF" stroke="#00BCD4" strokeWidth="4" />
              </svg>
            </div>
            
          </div>
        </div>
        
        <!-- More questions repeat... -->
        
      </div>
      
      <!-- Extension Section -->
      <div class="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border">
        <div class="font-semibold text-purple-900 mb-3 text-sm">🌟 More Fun (Optional):</div>
        <!-- Content... -->
      </div>
      
      <!-- Answer Key (if shown) -->
      <div class="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white">
        <div class="font-bold text-emerald-900 mb-3 text-base">✅ Answer Key</div>
        <!-- Answers... -->
      </div>
      
    </section>
    
  </div>
</div>
```

### Current CSS Layout for Page/Section

```css
@media print {
  @page { 
    size: A4;
    margin: 0 !important;
  }

  html, body, #root, [data-worksheet-content="true"] {
    background-color: white !important;
    width: 794px !important;
    max-width: 794px !important;
    margin: 0 auto !important;
  }

  /* Main container */
  [data-worksheet-content="true"] > div:first-child,
  [data-worksheet-content="true"] .max-w-4xl {
    position: relative !important;
    border-radius: 12px !important;
    border: 4px solid transparent !important;
    border-image: linear-gradient(135deg, #f472b6 0%, #a78bfa 20%, #60a5fa 40%, #34d399 60%, #fbbf24 80%, #fb7185 100%) 1 !important;
    padding: 20px 24px 24px 24px !important;
    margin: 0.5in !important;
  }

  /* Worksheet sections */
  [data-worksheet-content="true"] section,
  [data-worksheet-content="true"] .worksheet-section {
    margin: 0 !important;
    padding: 0.25rem !important;
    page-break-before: auto !important;
    page-break-after: auto !important;
    page-break-inside: auto !important;
  }

  /* Current fix for kindergarten-counting-visual (SIMPLIFIED) */
  [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .question-section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] img,
  [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] svg {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  [data-worksheet-content="true"][data-doc="kindergarten-counting-visual"] .question-section > * {
    page-break-inside: avoid !important;
  }
}
```

### Current Problem

**Issue:** When printing to PDF (Chrome/Edge), question sections are breaking across pages even though they're wrapped in `.question-section` with `page-break-inside: avoid`.

**What's happening:**
- The entire question (heading + SVG images + answer box) should stay together
- But the browser is splitting them across pages
- The colored border box starts on one page, then breaks mid-question

### What We Need

A **PERFECT print stylesheet** that:
1. ✅ Keeps each `.question-section` together (no page breaks inside)
2. ✅ Keeps images/SVGs with their question
3. ✅ Keeps the answer box with its question
4. ✅ Works reliably in Chrome/Edge "Save as PDF"
5. ✅ Handles questions that might be taller than one page (though ideally they fit)

### Key Constraints

- Each question is wrapped in: `<div class="question-section">` containing:
  - Heading: `<div>How many {title}?</div>`
  - Images: `<svg>` with multiple character graphics
  - Answer box: `<svg>` with white box and border
- Questions are in a container: `<div class="space-y-2 print:space-y-1">`
- The main wrapper has: `data-worksheet-content="true" data-doc="kindergarten-counting-visual"`
- Page size: A4 (794px width)
- Margins: 0.5in on main container

### Current Classes Used

- `.question-section` - The main question container
- `.question-section-wrapper` - Wrapper around each question
- `.count-group` - Additional class on question-section
- `.question-block` - Additional class on question-section

---

**Please generate an optimized print stylesheet that will prevent page breaks within question sections!**
