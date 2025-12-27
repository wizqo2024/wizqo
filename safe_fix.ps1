
$path = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"
$lines = [System.IO.File]::ReadAllLines($path)
$outLines = [System.Collections.Generic.List[string]]::new()

# Target Range for removal (0-indexed)
# Line 14356 is index 14355
$startDel = 14355 
$endDel = 14459 

for ($i = 0; $i -lt $lines.Count; $i++) {
    # Check if inside deletion range
    if ($i -ge $startDel -and $i -le $endDel) {
        # Safety Check at start of block
        if ($i -eq $startDel) {
            if (-not ($lines[$i].Contains("money-coins-bills"))) {
                Write-Host "Safety Abort: Line $i does not contain expected string. Preserving line."
                $outLines.Add($lines[$i])
                continue
            }
            else {
                Write-Host "Deleting duplicate block started at $i"
            }
        }
        continue 
    }
    
    $line = $lines[$i]
    
    # Fix Mojibake
    $line = $line.Replace('Â¢', '¢')
    $line = $line.Replace('â€“', '–')
    $line = $line.Replace('â€”', '—')
    $line = $line.Replace('âœ…', '✅')
    $line = $line.Replace('Ã—', '×')
    $line = $line.Replace('Ã·', '÷')
    
    # Fix Emojis
    $line = $line.Replace('ðŸ’°', '💸')
    $line = $line.Replace('ðŸ’¡', '💡')
    $line = $line.Replace('ðŸŒŸ', '🌟')
    $line = $line.Replace('ðŸ“Š', '📊')
    $line = $line.Replace('ðŸ“', '📏')
    $line = $line.Replace('â˜ ', '☐')
    $line = $line.Replace('âž—', '➗')
    $line = $line.Replace('ðŸ‘½', '👽')
    $line = $line.Replace('ðŸ”«', '🔫')
    $line = $line.Replace('ðŸ§ª', '🧪')
    $line = $line.Replace('ðŸ”®', '🔮')
    $line = $line.Replace('ðŸ¦ ', '🦟')
    $line = $line.Replace('ðŸ’µ', '💸')

    $outLines.Add($line)
}

[System.IO.File]::WriteAllLines($path, $outLines, [System.Text.Encoding]::UTF8)
Write-Host "Safe fix completed."
