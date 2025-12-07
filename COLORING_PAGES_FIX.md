# Coloring Pages Fix - Transparent Insides for Kids to Color

## Issue
Coloring page images were being filled with black color, making it impossible for kids to color inside them.

## Root Cause
The universal `*` selector was applying `print-color-adjust: exact` to all elements including images and SVGs, which caused:
1. Images to render incorrectly (black fills)
2. SVG paths to get forced fills
3. Background colors applied to images

## Fix Applied

### 1. Excluded Images from Color Adjustment
- Images, SVGs, and image elements use `print-color-adjust: auto` (normal rendering)
- Excluded from universal color-adjust rule

### 2. Transparent Backgrounds for Images
- All images get `background: transparent`
- No background colors applied to images
- Coloring page images specifically targeted

### 3. SVG Path Preservation
- SVG paths maintain their original `fill` and `stroke`
- Don't force fills on SVG shapes
- Preserves transparent insides for coloring

### 4. Coloring Page Specific Rules
- Images with "coloring" in src/alt attributes
- Elements with "coloring" classes
- All get transparent backgrounds

## Result

✅ **Coloring pages now have**:
- Transparent/white insides (kids can color them)
- Visible outlines/borders (for guidance)
- No black fills
- Normal image rendering

✅ **Other UI elements still work**:
- Borders visible
- Background colors preserved
- Text readable
- Answer lines visible

## Worksheets Affected

- ✅ coloring-animals
- ✅ coloring-nature
- ✅ coloring-space
- ✅ coloring-vehicles
- ✅ coloring-letters-numbers
- ✅ coloring-heroes
- ✅ coloring (general)
- ✅ All worksheets with images/SVGs

## Testing

To verify:
1. Open a coloring page worksheet
2. Print preview (Ctrl+P / Cmd+P)
3. Check that:
   - Images have transparent/white insides
   - Outlines are visible
   - No black fills
   - Kids can color inside the images
