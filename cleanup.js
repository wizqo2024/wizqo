const fs = require('fs');
const path = 'C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove recursive useEffect if any (check for multiple font updates)
// 2. Fix the tspan attributes
// Remove y from parent text
content = content.replace(/<text\s+x=\{margin \+ 16\}\s+y=\{baselineY\s+-\s+6\}/g, '<text x={margin + 16}');

// Remove y={...} if it appears twice on the same line or in the same tag
content = content.replace(/<tspan\s+y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}\s+fill/g, '<tspan fill');
content = content.replace(/<tspan\s+y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}\s+fontFamily/g, '<tspan fontFamily');
content = content.replace(/<tspan\s+y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}\s+key/g, '<tspan key');

// Now add it back cleanly to all tspans
content = content.replace(/<tspan\s/g, (match) => match + 'y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} ');

// Special case for firstChar which uses getFontFamily(false)
content = content.replace(/y=\{baselineY\s+\+\s+getBaselineOffset\(getFontFamily\(isDotted\),\s+fontSize\)\}\s+fontFamily=\{getFontFamily\(false\)\}/g, 'y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} fontFamily={getFontFamily(false)}');

// Fix the PDF parts if duplicated
// content = content.replace(/doc\.text\(firstChar, currentX, baselineY \+ getBaselineOffset\([^)]+\),\s+fontSizeVal\){2,}/g, 'doc.text(firstChar, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? "ABeeZee" : "helvetica", fontSizeVal)');

fs.writeFileSync(path, content, 'utf8');
house.
