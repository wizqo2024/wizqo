# PDF Print Layout Test Guide

## What Was Fixed

1. **Added inline styles** directly to `WorksheetSectionWrapper` component:
   - `pageBreakInside: 'avoid'`
   - `breakInside: 'avoid'`
   - `WebkitRegionBreakInside: 'avoid'`

2. **Strengthened CSS rules** in `index.css`:
   - More specific selectors for worksheet sections
   - Added `orphans` and `widows` rules
   - Applied rules to inner content wrapper divs

3. **How it works**:
   - If a section doesn't fit on the current page, the **entire section** moves to the next page
   - Sections will not break across page boundaries
   - Content stays together

## How to Test

1. **Open any worksheet page** (e.g., `/print?doc=place-value-hto`)
2. **Open browser DevTools** (F12)
3. **Check the section element**:
   - Right-click on a worksheet section
   - Inspect Element
   - Look for `<section class="worksheet-section">`
   - Check if it has inline styles: `style="page-break-inside: avoid; break-inside: avoid;"`
4. **Print to PDF**:
   - Press `Ctrl+P` (or `Cmd+P` on Mac)
   - Select "Save as PDF"
   - Check if sections stay together

## If Still Breaking

If sections are still breaking, check:

1. **Browser compatibility**:
   - Chrome/Edge: Should work with inline styles
   - Firefox: May need additional CSS
   - Safari: May need WebKit prefixes (already added)

2. **Check if sections are too large**:
   - If a section is larger than one page, it might still break
   - This is a browser limitation

3. **Verify CSS is loading**:
   - Check Network tab in DevTools
   - Ensure `index.css` is loaded
   - Check if print styles are applied (use Print Preview)

4. **Check for conflicting styles**:
   - Look for other CSS that might override `break-inside: avoid`
   - Check if `!important` flags are being overridden

## Additional Debugging

If you need to debug further, add this to browser console while on print page:

```javascript
// Check if sections have break-inside styles
document.querySelectorAll('section.worksheet-section').forEach(section => {
  const styles = window.getComputedStyle(section);
  console.log('Section:', section);
  console.log('break-inside:', styles.breakInside);
  console.log('page-break-inside:', styles.pageBreakInside);
});
```

## Browser-Specific Notes

- **Chrome/Edge**: Best support for `break-inside: avoid`
- **Firefox**: May need `page-break-inside: avoid` (already included)
- **Safari**: Uses `-webkit-region-break-inside: avoid` (already included)

## Next Steps if Issue Persists

1. Check which browser is being used
2. Test with different worksheets
3. Check if specific sections are breaking or all sections
4. Verify the section HTML structure matches what we're targeting
