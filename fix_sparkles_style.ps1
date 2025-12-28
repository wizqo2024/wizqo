$path = "client/src/pages/PrintablesPage.tsx"
$lines = Get-Content $path

$replacements = 0
$defaultReplacements = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "String.fromCharCode\(0x2728\)") {
        # Determine context from current or previous few lines
        $contextEmoji = "0x2728" # Default Sparkle
        
        # Look back up to 5 lines for context clues
        for ($j = $i; $j -gt ($i - 5); $j--) {
            if ($j -lt 0) { break }
            $line = $lines[$j]
            
            if ($line -match "bg-blue") { $contextEmoji = "0x1F4A1"; break }     # Bulb (Worked Example)
            if ($line -match "bg-purple") { $contextEmoji = "0x1F680"; break }   # Rocket (Challenge)
            if ($line -match "bg-emerald") { $contextEmoji = "0x2705"; break }   # Check (Answer Key)
            if ($line -match "bg-green") { $contextEmoji = "0x2705"; break }     # Check
            if ($line -match "bg-yellow") { $contextEmoji = "0x1F4A1"; break }   # Bulb (Tips)
            if ($line -match "bg-orange") { $contextEmoji = "0x270F"; break }    # Pencil
            if ($line -match "bg-red") { $contextEmoji = "0x26A0"; break }       # Warning/Important
            if ($line -match "text-slate") { $contextEmoji = "0x270F"; break }   # Pencil (Instructions)
            if ($line -match "border-dashed") { $contextEmoji = "0x2702"; break } # Scissors (Cutout)
        }
        
        # Apply replacement
        $lines[$i] = $lines[$i].Replace("String.fromCharCode(0x2728)", "String.fromCodePoint($contextEmoji)")
        
        if ($contextEmoji -eq "0x2728") {
            $defaultReplacements++
        }
        else {
            $replacements++
        }
    }
}

Set-Content $path -Value $lines -Encoding UTF8
Write-Host "Contextual Sparkle Fixes: $replacements"
Write-Host "Default Sparkle Updates: $defaultReplacements"
