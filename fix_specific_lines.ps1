$path = "client/src/pages/PrintablesPage.tsx"
$lines = Get-Content $path

# Map of LineNumber (1-based) to Emoji Hex String
$fixes = @{
    5669  = "0x1F51F" # ten-frames-1-20
    5917  = "0x270F"  # dot-to-dot
    7111  = "0x1F9F8" # lost-and-found
    13550 = "0x2795" # add-2digit
    13979 = "0x1F430" # skip-count
    14132 = "0x2716" # mult-facts
    18142 = "0x1F524" # cvc-words
    22837 = "0x1F3E0" # fact-families
    27829 = "0x2696"  # comparing-decimals
    28655 = "0x2797"  # dividing-decimals
    29282 = "0x1F522" # pemdas
    29810 = "0x1F680" # powers-of-10
    31319 = "0x1F95B" # liquid
    32673 = "0x1F4C9" # line-plots
    34244 = "0x1F4CF" # measurement-words
    34521 = "0x2797"  # ratio
}

foreach ($lineNum in $fixes.Keys) {
    $index = $lineNum - 1
    if ($lines[$index] -match "emoji=\{String.fromCharCode\(0x2728\)\}") {
        $lines[$index] = $lines[$index].Replace("String.fromCharCode(0x2728)", "String.fromCodePoint($($fixes[$lineNum]))")
        Write-Host "Fixed line $lineNum"
    }
    else {
        Write-Host "Skipped line $lineNum (Job match failed)"
    }
}

Set-Content $path -Value $lines -Encoding UTF8
Write-Host "Line-specific fixes applied."
