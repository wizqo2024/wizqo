# Print Layout UI Fix for Tables

## Problem
Worksheets with tables (like times-table-blank-6-12) were showing only numbers in print layout, missing the table structure (borders, headers, etc.) that was visible in the live view.

## Root Cause
The print CSS had a rule that removed borders from all elements to create a "clean" print layout. However, this rule was also removing borders from table cells (`td`, `th`), which are essential for displaying tables correctly.

## Solution
Added specific CSS rules in `/workspace/client/src/index.css` to:

1. **Preserve table borders in print mode** - Added rules that come AFTER the border removal rule with higher specificity to restore table borders
2. **Maintain table structure** - Ensured `border-collapse: collapse` is applied
3. **Preserve table styling** - Maintained background colors for headers and proper border colors

### Changes Made
- Added rules at lines 1147-1187 in `index.css` that specifically target tables and restore their borders
- Rules use `!important` to override the general border removal rule
- Preserves table header backgrounds (`bg-slate-100`)
- Maintains proper border colors (`border-slate-400`)

## Affected Worksheets
This fix applies to ALL worksheets with tables, including:
- `times-table-blank-6-12` (the reported issue)
- `times-table-blank-1-5`
- `times-table-blank-1-12`
- `times-table-horizontal-*` (all variants)
- `times-table-vertical-*` (all variants)
- `times-table-missing-*` (all variants)
- Any other worksheets that use HTML tables

## Testing
To verify the fix:
1. Open any worksheet with a table (e.g., `/print?doc=times-table-blank-6-12&autoprint=1`)
2. Use browser print preview (Ctrl+P / Cmd+P)
3. Verify that:
   - Table borders are visible
   - Table headers have background colors
   - Table structure matches the live view
   - Numbers are properly contained within cells

## How to Identify Similar Issues

If you encounter other print layout issues:

1. **Check the live view** - Compare what you see in the browser vs print preview
2. **Look for missing visual elements**:
   - Borders
   - Background colors
   - Spacing/layout
   - Grid structures

3. **Common causes**:
   - Elements excluded from print styles
   - Border removal rules affecting necessary borders
   - Background colors being removed
   - Layout changes (flex/grid → block)

4. **Fix approach**:
   - Add specific rules AFTER general removal rules
   - Use higher specificity selectors
   - Use `!important` if needed to override
   - Ensure `-webkit-print-color-adjust: exact` for colors

## Future Prevention

When adding new worksheets with tables or grid structures:
- Test print layout immediately
- Ensure table elements are properly styled for print
- Consider adding worksheet-specific print styles if needed
- Document any special print requirements
