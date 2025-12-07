# Print Layout Answer Lines Fix

## Issue
Horizontal answer lines (created with `border-b` or `border-t`) are not visible in print layout for worksheets like `times-table-confidence-1-5`.

## Root Cause
CSS rules in print media were not specifically ensuring that border-bottom and border-top answer lines are visible. These lines are created using:
- `border-b-[3px]` for thicker answer lines
- `border-b-2` for standard answer lines  
- `border-t-2` for top borders (used in vertical format)

## Fix Applied

Added comprehensive CSS rules in `client/src/index.css` (end of `@media print` block) to ensure:

1. **All border-bottom answer lines are visible**:
   - Targets `span[class*="border-b"]`, `div[class*="border-b"]`
   - Ensures `border-bottom-style: solid !important`
   - Sets minimum width of 2px (or preserves 3px for thicker lines)
   - Uses dark slate color (#334155) for better print visibility

2. **Border-top lines are visible**:
   - Targets `span[class*="border-t"]`, `div[class*="border-t"]`
   - Ensures proper visibility for vertical format worksheets

3. **Preserves colored borders**:
   - Maintains `border-blue-600`, `border-slate-600`, `border-amber-600` colors when specified
   - Uses `border-bottom-color: inherit` for colored borders

4. **Ensures inline-block elements maintain display**:
   - Forces `display: inline-block !important` for answer line elements
   - Sets minimum width to ensure visibility

## Worksheets Affected

- ✅ `times-table-confidence-1-5` - Fixed
- ✅ `times-table-confidence-6-12` - Fixed  
- ✅ `times-table-horizontal-*` - Fixed (uses border-b-2)
- ✅ `times-table-vertical-*` - Fixed (uses border-t-2 and border-b-2)
- ✅ `times-table-missing-*` - Fixed (uses border-b-2)
- ✅ All worksheets with horizontal answer lines - Fixed

## Testing

To verify the fix:
1. Open: https://wizqo.com/print?doc=times-table-confidence-1-5&from=times-table&autoprint=1
2. Use browser print preview (Ctrl+P / Cmd+P)
3. Verify that all horizontal answer lines are visible
4. Check that lines have proper thickness (3px for confidence worksheets, 2px for others)
5. Verify lines are dark enough to see clearly

## Expected Result

- ✅ All horizontal answer lines visible in print
- ✅ Proper line thickness maintained
- ✅ Dark enough color for print visibility
- ✅ Inline-block elements maintain proper display
- ✅ Colored borders preserved when specified
