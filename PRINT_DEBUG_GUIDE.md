# Print Layout Debugging Guide

## How to Check Print Preview

1. **Open any worksheet** (e.g., `/print?doc=place-value-hto`)
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Run this command to check print styles:**

```javascript
// Check if sections have break-inside styles
const sections = document.querySelectorAll('section.worksheet-section');
sections.forEach((section, i) => {
  const styles = window.getComputedStyle(section);
  console.log(`Section ${i + 1}:`, {
    element: section,
    breakInside: styles.breakInside,
    pageBreakInside: styles.pageBreakInside,
    display: styles.display,
    hasInlineStyle: section.hasAttribute('style')
  });
});
```

5. **Open Print Preview:**
   - Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
   - Or right-click → Print
   - Check the preview

6. **Check if sections are breaking:**
   - Look for section headers at bottom of page
   - Look for content starting on next page
   - Check if images/examples are split

## Common Issues

### Issue 1: Sections still breaking
**Possible causes:**
- Section is too large (larger than one page)
- Browser doesn't support `break-inside: avoid`
- Conflicting CSS rules

**Solution:**
- Check browser compatibility (Chrome/Edge work best)
- Verify section height (should be < page height)
- Check for conflicting styles

### Issue 2: Headers separating from content
**Possible causes:**
- Header and content in different elements
- Missing `page-break-after: avoid` on header

**Solution:**
- Check if h2 has inline styles
- Verify CSS rules are applied

### Issue 3: Images/examples breaking
**Possible causes:**
- Image too large
- Missing `break-inside: avoid` on container

**Solution:**
- Check image/example container has styles
- Verify max-height is set

## Browser Compatibility

- **Chrome/Edge**: Best support ✅
- **Firefox**: Good support ✅
- **Safari**: May need WebKit prefixes ✅ (already added)
- **Opera**: Similar to Chrome ✅

## Testing Checklist

- [ ] Open worksheet in browser
- [ ] Check console for errors
- [ ] Open print preview (Ctrl+P)
- [ ] Verify sections don't break
- [ ] Check headers stay with content
- [ ] Verify images don't split
- [ ] Test with different worksheets
- [ ] Test in different browsers

## If Still Breaking

1. **Check which browser** you're using
2. **Check which worksheet** is breaking
3. **Take a screenshot** of the print preview
4. **Check browser console** for errors
5. **Verify CSS is loading** (check Network tab)

## Manual Override (Temporary)

If CSS isn't working, you can manually add styles in browser console:

```javascript
// Force all sections to not break
document.querySelectorAll('section.worksheet-section').forEach(section => {
  section.style.pageBreakInside = 'avoid';
  section.style.breakInside = 'avoid';
  section.style.display = 'block';
});
```

Then try printing again.
