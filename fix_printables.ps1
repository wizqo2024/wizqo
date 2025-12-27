
$path = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"

# Read all lines
$lines = [System.IO.File]::ReadAllLines($path)
$newLines = [System.Collections.Generic.List[string]]::new()

# Define range to delete (1-based: 14356 to 14460) => 0-based: 14355 to 14459
$startDelete = 14355
$endDelete = 14459

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge $startDelete -and $i -le $endDelete) {
        continue
    }
    $newLines.Add($lines[$i])
}

# Join back to string
$content = $newLines -join "`n"

# Fix Encoding Artifacts (Mojibake)
# Common replacements for UTF-8 bytes interpreted as Windows-1252
$content = $content.Replace('Â¢', '¢')
$content = $content.Replace('â€“', '–')
$content = $content.Replace('â€”', '—')
$content = $content.Replace('âœ…', '✅')
$content = $content.Replace('Ã—', '×')
$content = $content.Replace('Ã·', '÷')

# Emojis (Approximate based on known content)
$content = $content.Replace('ðŸ’µ', '💸')   # Money bag
$content = $content.Replace('ðŸ’¡', '💡')   # Bulb
$content = $content.Replace('ðŸŒŸ', '🌟')   # Star
$content = $content.Replace('ðŸ“Š', '📊')   # Chart
$content = $content.Replace('ðŸ“', '📏')    # Ruler (partial match often)
$content = $content.Replace('â˜ ', '☐')     # Checkbox
$content = $content.Replace('âž—', '➗')    # Division sign? Or minus? Check context. 
# âž— (E2 9E 97) -> U+2797 (Heavy Division Sign) ➗ is U+2797? No ➗ is U+2797? Wait. 
# Heavy Division Sign is U+2797. 
# Standard Division is U+00F7 (÷). 
# Input likely has U+2797 if it was an emoji-style division. 

# Generic fix for 'â' artifacts if any remain that create obvious issues?
# Careful not to break valid code.

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Fixed duplicate block and encoding."
