# Print Layout Work Box Audit - pemdas-basic Worksheet

## Issue
The dotted "Show your work" boxes are not appearing in print layout for the pemdas-basic worksheet (and likely other worksheets with similar structure).

## URL Tested
https://wizqo.com/print?doc=pemdas-basic&from=order-of-operations&autoprint=1

## Root Cause Analysis

### 1. HTML Structure
The work boxes are structured as:
```html
<div className="grid grid-cols-2 gap-4 break-inside-avoid">
  <div className="border border-slate-300 rounded-lg p-4 bg-white break-inside-avoid">
    ...
    <div 
      data-work-box="true"
      className="min-h-16 border border-dashed border-slate-300 rounded p-2 bg-slate-50 print:bg-white"
      style={{...}}
    >
      {'\u00A0'}
    </div>
  </div>
</div>
```

### 2. CSS Rules Found

#### ✅ Rules that SHOULD make work boxes visible:
1. **Line 6842-6867**: Rules targeting `[data-work-box="true"]` with `!important` flags
2. **Line 6673-6690**: Rules targeting `div[class*="border-dashed"]`
3. **Line 3944-3957**: Rules preserving dashed borders
4. **Line 3869-3890**: Rules preserving `grid-cols-2` grids

#### ❌ Potential Issues Found:

1. **Grid Layout Conversion (Line 4028-4047)**:
   - There's a rule that converts grids to block UNLESS they match specific patterns
   - The rule excludes `grid-cols-2` grids, BUT there's also a float-based layout rule for `grid-cols-2` children (line 4049-4056)
   - This float-based layout might be interfering with child visibility

2. **CSS Specificity Conflict**:
   - Multiple rules targeting work boxes, but some might have lower specificity
   - The `grid-cols-2` float rule (line 4049) sets `width: calc(50% - 0.4rem)` which might cause layout issues

3. **Parent Container Issues**:
   - The work box is inside a `border border-slate-300` container
   - Line 3023-3032 has rules that convert borders to solid, but excludes `border-dashed`
   - However, the parent container's border might be affecting child visibility

4. **Background Color Override**:
   - Work boxes have `bg-slate-50 print:bg-white`
   - Line 6704-6711 has rules to convert `bg-slate-50` to white in print
   - But if the background is being set incorrectly, borders might not be visible

### 3. Most Likely Issue

The problem is likely in the **grid layout handling**. While there are rules to preserve `grid-cols-2` grids, there's also a float-based fallback (line 4049-4056) that might be interfering. Additionally, the work boxes might be getting hidden due to:

1. **Float layout interference**: The float-based layout for grid children might be causing boxes to collapse or be hidden
2. **Width calculations**: The `calc(50% - 0.4rem)` width might be causing overflow issues
3. **Display property conflicts**: Multiple rules setting `display: block` vs `display: grid` might conflict

## Solution

Add explicit CSS rules to ensure:
1. Work boxes are ALWAYS visible in print, regardless of parent layout
2. Grid containers with work boxes maintain proper grid layout
3. Work boxes maintain their dashed borders and proper dimensions

## Fix Implementation

### Changes Made to `client/src/index.css`:

1. **Added grid preservation for work boxes** (after line 3890):
   - Added `:has([data-work-box="true"])` selector to preserve grid layout
   - Ensured `grid-cols-2` grids with work boxes maintain proper grid template

2. **Fixed float-based layout interference** (around line 4049):
   - Modified float rules to exclude grids containing work boxes: `:not(:has([data-work-box="true"]))`
   - Added explicit rules to prevent float layout on grids with work boxes

3. **Added ultimate override rules** (at end of @media print block, before closing brace):
   - Maximum specificity rules targeting `[data-work-box="true"]`
   - Changed border color from `#cbd5e1` (light slate) to `#334155` (dark slate) for better print visibility
   - Added explicit grid layout rules for containers with work boxes
   - Ensured parent containers don't hide work boxes with overflow rules

### Key Fixes:

1. **Grid Layout Preservation**: Grids containing work boxes now maintain CSS Grid layout instead of falling back to float-based layout
2. **Border Visibility**: Changed border color to darker shade (#334155) for better print contrast
3. **Specificity Override**: Added rules with maximum specificity to ensure work boxes are never hidden
4. **Parent Container Fix**: Ensured parent containers don't hide work boxes with overflow or display rules

## Testing

To verify the fix works:
1. Open: https://wizqo.com/print?doc=pemdas-basic&from=order-of-operations&autoprint=1
2. Use browser print preview (Ctrl+P / Cmd+P)
3. Verify that all "Show your work" dotted boxes are visible
4. Check that boxes have visible dashed borders
5. Verify grid layout is maintained (2 columns)

## Expected Result

- ✅ All work boxes visible in print preview
- ✅ Dashed borders clearly visible (dark slate color)
- ✅ Grid layout maintained (2 columns)
- ✅ Proper spacing and dimensions preserved
