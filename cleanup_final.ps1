# cleanup_final.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# 1. Remove y={baselineY - 6} from parent <text>
$content = $content -replace 'y=\{baselineY\s+-\s+6\}', ''

# 2. Add y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} to all tspans
# First, remove ANY existing y={...} from tspans to start clean
$content = [regex]::Replace($content, '<tspan[^>]*?y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}[^>]*?>', {
        param($m)
        return $m.Value -replace 'y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}', ''
    })

# Now add it back once per tspan
$content = $content -replace '<tspan\s+', '<tspan y={baselineY + getBaselineOffset(getFontFamily(isDotted), fontSize)} '

# Special case for firstChar which uses getFontFamily(false)
$content = $content -replace 'y=\{baselineY\s+\+\s+getBaselineOffset\(getFontFamily\(isDotted\),\s+fontSize\)\}\s+fontFamily=\{getFontFamily\(false\)\}', 'y={baselineY + getBaselineOffset(getFontFamily(false), fontSize)} fontFamily={getFontFamily(false)}'

# Clean up any leftover double spaces
$content = $content -replace '\s{2,}>', ' >'

Set-Content $filePath $content
house.
