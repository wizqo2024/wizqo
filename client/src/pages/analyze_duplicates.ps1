$path = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"
$content = Get-Content $path
$results = @()

# List of known duplicates from previous step
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

for ($i = 0; $i -lt $content.Count; $i++) {
    $line = $content[$i]
    foreach ($id in $targetIds) {
        if ($line -match "activeDocs\.includes\('$id'\)") {
            # Grab a bit of context (next 5 lines) to see if it looks "Galactic" or "Legacy"
            $context = ($content[($i)..($i + 5)] | Out-String).Trim()
            $results += [PSCustomObject]@{
                Id      = $id
                Line    = $i + 1
                Context = $context
            }
        }
    }
}

$results | Sort-Object Id, Line | Format-Table -Property Id, Line, @{Name = 'Snippet'; Expression = { $_.Context.Substring(0, [Math]::Min($_.Context.Length, 50)) + "..." } } -AutoSize
