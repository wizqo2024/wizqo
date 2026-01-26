# revert_alignment.ps1
$filePath = "C:/Users/mohamedsafran/.gemini/antigravity/scratch/wizqo/client/src/pages/HandwritingMakerPage.tsx"
$content = Get-Content $filePath -Raw

# 1. Remove helper function
$helperRegex = '(?s)\s+const getBaselineOffset = \(family: string, fs: number\) => \{.*?return -6;.*?\};'
$content = $content -replace $helperRegex, ""

# 2. Restore parent <text> y attribute
$content = $content -replace '<text\s+x=\{margin \+ 16\}', '<text x={margin + 16} y={baselineY - 6}'

# 3. Remove y from tspans
$content = [regex]::Replace($content, '(<tspan[^>]*?)y=\{baselineY\s+\+\s+getBaselineOffset\([^)]+\),\s+fontSize\)\}', {
        param($m)
        return $m.Groups[1].Value
    })

# 4. Revert PDF doc.text calls
$content = $content -replace 'baselineY \+ getBaselineOffset\([^)]+\),\s+fontSizeVal\)', 'baselineY - 6)'

# Clean up double spaces if any
$content = $content -replace '\s{2,}>', ' >'

Set-Content $filePath $content
house.
