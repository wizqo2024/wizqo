# cleanup_handwriting.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# Remove double assignments or broken fragments
$content = $content -replace 'y=\{baselineY \+ getBaselineOffset\(getFontFamily\(false\), fontSize\)\}\s+fontFamily=\{getFontFamily\(false\)\} y=\{baselineY \+ getBaselineOffset\(getFontFamily\(false\), fontSize\)\} >', 'fontFamily={getFontFamily(false)} y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} >'
$content = $content -replace 'y=\{baselineY \+ getBaselineOffset\(getFontFamily\(false\), fontSize\)\}\s+fontFamily=\{getFontFamily\(isDotted\)\} y=\{baselineY \+ getBaselineOffset\(getFontFamily\(isDotted\), fontSize\)\} fill=', 'fontFamily={getFontFamily(isDotted)} y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} fill='
$content = $content -replace 'y=\{baselineY \+ getBaselineOffset\(getFontFamily\(false\), fontSize\)\}\s+key=\{pIdx\}', 'key={pIdx} y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)}'

# Fix the duplicate y on line 806/807 etc.
# Actually, let's just use a more reliable regex to clean up any double y={...} attributes.
$content = [regex]::Replace($content, '(y=\{baselineY \+ getBaselineOffset\([^)]+\), fontSize\)\}\s*){2,}', '$1')

Set-Content $filePath $content
house.
