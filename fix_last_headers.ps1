$path = "client/src/pages/PrintablesPage.tsx"
$lines = Get-Content $path

# Map of LineNumber (1-based) to Emoji Hex String
$fixes = @{
    4302  = "0x2795" # addition-subtraction-0-10
    6496  = "0x1F9E2" # reading-g1-lost-hat (Cap)
    9335  = "0x1F300" # math-maze
    14574 = "0x2716" # mult-2x1
    15877 = "0x2716" # times-table-horizontal
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
Write-Host "Final 5 header fixes applied."
