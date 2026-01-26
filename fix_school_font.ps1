# fix_school_font.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# 1. Add the helper function (Scoped STRICTLY to School style)
$helperCode = "  const getBaselineOffset = (family: string, fs: number) => {
    if (textStyle === 'school-cursive') {
      // Correcting the vertical position for School font
      return family === 'SchoolHandDotted' ? fs * 0.12 : fs * 0.28;
    }
    return -6; // Default for everything else
  };

  // Quick-fill helpers"

$content = $content -replace "// Quick-fill helpers", $helperCode

# 2. Apply to SVG text
# Remove the hardcoded y from parent text
$content = $content -replace 'y=\{baselineY - 6\}', ''

# Add dynamic y to tspans
$content = $content -replace '<tspan\s+', '<tspan y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} '

# Correct firstChar tspan to use false (model font)
$content = $content -replace 'y=\{baselineY\s+\+\s+getBaselineOffset\(getFontFamily\(isDotted\),\s+fontSize\)\}\s+fontFamily=\{getFontFamily\(false\)\}', 'y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} fontFamily={getFontFamily(false)}'

# 3. Apply to PDF
$content = $content -replace 'baselineY - 6\)', 'baselineY + getBaselineOffset(textStyle === "school-cursive" ? (isDotted ? "SchoolHandDotted" : "ABeeZee") : "helvetica", fontSizeVal))'
# Fix the firstChar PDF call which is special
$content = $content -replace 'doc\.text\(firstChar, currentX, baselineY \+ getBaselineOffset\([^)]+\)\)\)', 'doc.text(firstChar, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? "ABeeZee" : "helvetica", fontSizeVal))'

Set-Content $filePath $content
house.
