$path = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"
$lines = Get-Content $path
$contentString = [System.IO.File]::ReadAllText($path)

Write-Host "Starting Cleanup..."

# ---------------------------------------------------------
# 1. Identify & Remove Legacy Duplicate Blocks
# ---------------------------------------------------------

$blocks = @()
$targetIds = @(
    'measurement-length', 'expanded-form-200', 'money-word-problems', 'math-maze', 'line-tracing', 
    'mental-math-20', 'big-small', 'patterns-rules', 'add-three-numbers', 'classifying-shapes', 
    'pattern-complete', 'picture-addition-10', 'size-comparison', 'missing-addends', 
    'balance-equations-10', 'color-by-number', 'fact-families-20', 'rounding-nearest-10', 
    'compare-2digit', 'add-sub-decimals', 'number-line-add', 'subtraction-stories', 
    'number-patterns-200', 'bar-graphs-data', 'fractions-halves-thirds-fourths', 'skip-count-2s', 
    'missing-shape', 'cvc-words', 'ab-pattern', 'area-perimeter-4th', 'doubles-near-doubles', 
    'number-id-1-10', 'number-line-200'
)

Write-Host "Scanning for duplicate blocks..."

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match "activeDocs\.includes\('([^']+)'\)") {
        $id = $Matches[1]
        if ($targetIds -contains $id) {
            # Heuristic to find the block start and end (checking surrounding braces)
            $openBraces = 0
            $foundStart = $false
            $startLine = $i

            # Check previous line for start brace
            if ($line.Trim().StartsWith("{")) { 
                $openBraces = 1 
                $foundStart = $true
            }
            elseif ($i -gt 0 -and $lines[$i - 1].Trim().EndsWith("{")) {
                $startLine = $i - 1
                $openBraces = 1
                $foundStart = $true
            }
            elseif ($i -gt 1 -and $lines[$i - 2].Trim().EndsWith("{")) {
                # Sometimes there's a blank line
                $startLine = $i - 2
                $openBraces = 1
                $foundStart = $true
            }

            if ($foundStart) {
                for ($j = $i; $j -lt $lines.Count; $j++) {
                    $chars = $lines[$j].ToCharArray()
                    foreach ($c in $chars) {
                        if ($c -eq '{') { $openBraces++ }
                        if ($c -eq '}') { $openBraces-- }
                    }
                    if ($openBraces -eq 0) {
                        $blocks += [PSCustomObject]@{
                            Id    = $id
                            Start = $startLine
                            End   = $j
                        }
                        break
                    }
                }
            }
        }
    }
}

# Select Blocks to Delete (The Legacy/First ones)
$toDelete = @()
$grouped = $blocks | Group-Object Id
foreach ($g in $grouped) {
    if ($g.Count -gt 1) {
        # Sort by Start line. 
        # Strategy: Keep the LAST one (highest line number), delete ALL others.
        $sorted = $g.Group | Sort-Object Start
        for ($k = 0; $k -lt ($sorted.Count - 1); $k++) {
            $toDelete += $sorted[$k]
        }
    }
}

# Calculate lines to skip
$linesToDeleteIndices = @{}
foreach ($b in $toDelete) {
    Write-Host "Marking legacy block for deletion: $($b.Id) (Lines $($b.Start+1) to $($b.End+1))"
    for ($l = $b.Start; $l -le $b.End; $l++) {
        $linesToDeleteIndices[$l] = $true
    }
}

# Reconstruct content without deleted lines
$newLines = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if (-not $linesToDeleteIndices.ContainsKey($i)) {
        $newLines += $lines[$i]
    }
}

# Convert back to single string for replacements
$text = $newLines -join "`r`n"

# ---------------------------------------------------------
# 2. Fix Mojibake (Global Replacements)
# ---------------------------------------------------------
Write-Host "Applying Mojibake fixes..."

# Use sequential replacements to avoid hash table syntax issues
$text = $text.Replace('dY"\^ Number Line to 200', '📈 Number Line to 200')
$text = $text.Replace('dY"^ Number Line to 200', '📈 Number Line to 200')
$text = $text.Replace('ðŸ"ˆ', '📈')
$text = $text.Replace('â†', '⬅️')
$text = $text.Replace('ðŸ–¼ï¸', '📥')
$text = $text.Replace('ðŸ–¨ï¸', '🖨️')
$text = $text.Replace('ðŸ“Œ', '📌')
$text = $text.Replace('ðŸ’°', '💰')

# Fix the dY sequences (often mapping to specific icons)
$text = $text.Replace('dY"s', '🎱')
$text = $text.Replace('dY"!', '💡')
$text = $text.Replace('dY"%', '🔔')
$text = $text.Replace('dY"&', '🎨')
$text = $text.Replace('dY"''', '🎯') # Single quote escaped
$text = $text.Replace('dY"(' , '🎲')
$text = $text.Replace('dY")', '🏆')
$text = $text.Replace('dY"*', '🧩')
$text = $text.Replace('dY"+', '🎮')
$text = $text.Replace('dY", ', '🎹')
$text = $text.Replace('dY"-', '🎷')
$text = $text.Replace('dY".', '🎸')
$text = $text.Replace('dY"/', '🎻')
$text = $text.Replace('dY"0', '🎺')
$text = $text.Replace('dY"1', '🥁')

# Generic sparkle for any remaining dY artifacts that look like icon prefix
# Be careful not to break valid code, but dY" seems very specific to this corruption
        # $text = $text.Replace('dY"', '✨') 

        # Fix observed specifics from logs
        $text = $text.Replace('dY"', '✨') 
        $text = $text.Replace('dY-",', '🖨️') 

        # Save
        [System.IO.File]::WriteAllText($path, $text)
        Write-Host "Cleanup complete."
