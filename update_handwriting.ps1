# update_handwriting.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# Ensure SchoolHandDotted is in useEffect
$oldFontFace = "@font-face \{`r?`n\s+font-family: 'FoundationDots';`r?`n\s+src: url\('/fonts/FoundationDots-Regular.ttf'\) format\('truetype'\);`r?`n\s+font-weight: normal;`r?`n\s+font-style: normal;`r?`n\s+\}"
$newFontFace = "@font-face {
        font-family: 'FoundationDots';
        src: url('/fonts/FoundationDots-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'SchoolHandDotted';
        src: url('/fonts/SchoolHandDotted.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }"
$content = $content -replace $oldFontFace, $newFontFace

# Update font constant
$content = $content -replace 'fontStackSchoolDotted = "FoundationDots"', 'fontStackSchoolDotted = "SchoolHandDotted"'

# Add helper function
$helper = "  const getBaselineOffset = (family: string, fs: number) => {
    if (textStyle === 'school-cursive') {
      return family === 'SchoolHandDotted' ? fs * 0.12 : fs * 0.28;
    }
    return -6;
  };

  // Quick-fill helpers"
$content = $content -replace "// Quick-fill helpers", $helper

# Update SVG text rendering
# Remove y={baselineY - 6} from parent <text> and add y={baselineY + getBaselineOffset(..., fontSize)} to tspans
$content = $content -replace 'y=\{baselineY - 6\}', ''
$content = $content -replace '<tspan', '<tspan y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)}'
# Wait, this matches ALL tspans. I need to be more precise.
# Let's use a simpler approach: just update the y value in the parent text for now if it's unified? 
# No, they are NOT unified (0.28 vs 0.12).

# Let's do a more surgical replacement for the tspans.

# 1. firstChar tspan (solid)
$content = $content -replace 'fontFamily=\{getFontFamily\(false\)\}\s+>', 'fontFamily={getFontFamily(false)} y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} >'

# 2. restOfWord/word tspan (dotted/practice)
$content = $content -replace 'fontFamily=\{getFontFamily\(isDotted\)\}\s+fill=', 'fontFamily={getFontFamily(isDotted)} y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} fill='

# Update PDF path
$content = $content -replace 'fetchFontBase64\(''/fonts/FoundationDots-Regular.ttf''\)', "fetchFontBase64('/fonts/SchoolHandDotted.ttf')"
$content = $content -replace 'doc.addFileToVFS\(''FoundationDots.ttf'', foundationDotsB64\)', "doc.addFileToVFS('SchoolHandDotted.ttf', foundationDotsB64)"
$content = $content -replace 'doc.addFont\(''FoundationDots.ttf'', ''FoundationDots'', ''normal''\)', "doc.addFont('SchoolHandDotted.ttf', 'SchoolHandDotted', 'normal')"
$content = $content -replace 'if \(textStyle === ''school-cursive''\) return isDotted \? ''FoundationDots'' : ''ABeeZee''', "if (textStyle === 'school-cursive') return isDotted ? 'SchoolHandDotted' : 'ABeeZee'"

# Update PDF baseline offsets
# In PDF, it uses baselineY - 6 too.
$content = $content -replace 'doc.text\(firstChar, currentX, baselineY - 6', 'doc.text(firstChar, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? "ABeeZee" : "helvetica", fontSizeVal)'
$content = $content -replace 'doc.text\(restOfWord, currentX, baselineY - 6', 'doc.text(restOfWord, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? (isDotted ? "SchoolHandDotted" : "ABeeZee") : "helvetica", fontSizeVal)'
$content = $content -replace 'doc.text\(wordToDraw, currentX, baselineY - 6', 'doc.text(wordToDraw, currentX, baselineY + getBaselineOffset(textStyle === "school-cursive" ? (isDotted ? "SchoolHandDotted" : "ABeeZee") : "helvetica", fontSizeVal)'

Set-Content $filePath $content
house.
