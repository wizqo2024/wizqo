# correct_font_position.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# 1. Re-add the helper function needed for the font to look right
$helperCode = "  const getBaselineOffset = (family: string, fs: number) => {
    if (textStyle === 'school-cursive') {
      return family === 'SchoolHandDotted' ? fs * 0.12 : fs * 0.28;
    }
    return -6;
  };

  // Quick-fill helpers"

$content = $content -replace "// Quick-fill helpers", $helperCode

# 2. Update SVG to use the helper instead of fixed -6
$content = $content -replace 'y=\{baselineY - 6\}', ''
$content = $content -replace '<tspan\s+', '<tspan y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} '
$content = $content -replace 'y=\{baselineY\s+\+\s+getBaselineOffset\(getFontFamily\(isDotted\),\s+fontSize\)\}\s+fontFamily=\{getFontFamily\(false\)\}', 'y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} fontFamily={getFontFamily(false)}'

# 3. Update PDF to use the helper
$content = $content -replace 'baselineY - 6\)', 'baselineY + getBaselineOffset(textStyle === "school-cursive" ? (isDotted ? "SchoolHandDotted" : "ABeeZee") : "helvetica", fontSizeVal))'
$content = $content -replace 'doc\.text\(firstChar, currentX, baselineY \+ getBaselineOffset\([^)]+\)\)\)', 'doc.text(firstChar, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? "ABeeZee" : "helvetica", fontSizeVal))'

Set-Content $filePath $content
house.
