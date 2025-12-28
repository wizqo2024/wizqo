$path = "client/src/pages/PrintablesPage.tsx"
$lines = Get-Content $path

$keywordMap = @{
    "Times Table"    = "0x2716"
    "Multiplication" = "0x2716"
    "Multiply"       = "0x2716"
    "Division"       = "0x2797"
    "Divide"         = "0x2797"
    "Shrink Ray"     = "0x2797" # Special case
    "Addition"       = "0x2795"
    "Add"            = "0x2795"
    "Subtraction"    = "0x2796"
    "Subtract"       = "0x2796"
    "Fraction"       = "0x1F370"
    "Decimal"        = "0x1F522"
    "Geometry"       = "0x1F4D0"
    "Shape"          = "0x1F537"
    "Money"          = "0x1F4B0"
    "Measure"        = "0x1F4CF"
    "Graph"          = "0x1F4CA"
    "Word Problem"   = "0x1F4DD"
    "Reading"        = "0x1F4D6"
    "Writing"        = "0x270D"
    "Spelling"       = "0x1F524"
    "Science"        = "0x1F52C"
    "Art"            = "0x1F3A8"
    "Pattern"        = "0x1F3C1"
    "Count"          = "0x1F522"
    "Number"         = "0x1F522"
    "Logic"          = "0x1F9E0"
    "Maze"           = "0x1F300"
    "Data"           = "0x1F4CA"
    "Time"           = "0x23F0"
    "Clock"          = "0x23F0"
    "Elapsed"        = "0x23F0"
}

$fixedCount = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "emoji=\{String.fromCharCode\(0x2728\)\}") {
        # Look backwards for title="..."
        $found = $false
        # Shorter lookback for title
        for ($j = $i; $j -gt ($i - 10); $j--) {
            if ($j -lt 0) { break }
            if ($lines[$j] -match 'title="([^"]+)"') {
                $title = $matches[1]
                $emojiHex = "0x1F4D1" # Default Bookmark

                foreach ($key in $keywordMap.Keys) {
                    if ($title -match $key) {
                        $emojiHex = $keywordMap[$key]
                        $found = $true
                        break
                    }
                }
                
                # Apply fix
                $lines[$i] = $lines[$i].Replace("String.fromCharCode(0x2728)", "String.fromCodePoint($emojiHex)")
                $fixedCount++
                break # Stop looking for title
            }
        }
    }
}

Set-Content $path -Value $lines -Encoding UTF8
Write-Host "Fixed $fixedCount dynamic headers."
