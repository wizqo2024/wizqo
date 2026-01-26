param (
    [string]$FilePath
)

$ErrorActionPreference = "Stop"

# Mapping of mojibake to correct emojis
$Replacements = @{
    'ðŸ’¡' = '💡'
    'ðŸ“š' = '📚'
    'ðŸ“ˆ' = '📈'
    'ðŸŽ¯' = '🎯'
    'ðŸ“ ' = '📏'
    'ðŸ •' = '🍕'
    'ðŸŽµ' = '🎵'
    'ðŸ‘ ï¸ ' = '👁️'
    'ðŸ‘¾' = '👾'
    'ðŸ¦ ' = '🦊'
    'ðŸš—' = '🚗'
    'ðŸ§©' = '🧩'
    'ðŸ’Œ' = '💌'
    'ðŸ•‰ï¸ ' = '🕊️'
    'ðŸ—“ï¸ ' = '🗓️'
    'ðŸŽƒ' = '🎃'
    'ðŸ ”ï¸ ' = '⛰️'
    'ðŸ—ºï¸ ' = '🗺️'
    'ðŸ   ' = '🏎️'
    'ðŸ”º' = '🔺'
    'ðŸ’°' = '💰'
    'ðŸ¥§' = '🥧'
    'ðŸ” ' = '🔎'
    'âš–ï¸ ' = '⚖️'
    'â˜ ' = '☑'
    'ðŸ ¦' = '🍦'
    'ðŸ »' = '🐻'
    'ðŸ•µï¸ â€ â™€ï¸ ' = '🕵️‍♀️'
    'ðŸ– ï¸ ' = '🖌️'
    'ðŸ“‹' = '📋'
    'ðŸ’ª' = '💪'
    'ðŸ“ ' = '📝'
    'ðŸ‘…' = '👖'
    'ðŸ‘Ÿ' = '👟'
    'ðŸ§¦' = '🧦'
    'ðŸ‘•' = '👕'
    'ðŸ§£' = '🧣'
    'ðŸ‘š' = '👚'
    'ðŸ‘‘' = '👑'
    'ðŸ‘' = '👗'
    'ðŸ§¡' = '🧡'
    'ðŸ§©' = '🧩'
    'ðŸš€' = '🚀'
    'ðŸŒˆ' = '🌈'
    'ðŸŒŸ' = '🌟'
    'ðŸŒ ' = '🌻'
    'ðŸŒ²' = '🌲'
    'ðŸŒŠ' = '🌊'
    'ðŸŒž' = '🌅'
    'ðŸ ðŸ »' = '🏠'
    'ðŸšœ' = '🚜'
    'ðŸ‘¶' = '👶'
    'ðŸ§ ' = '🧠'
    'ðŸ¦¾' = '🦖'
    'ðŸ ¬' = '🐬'
    'ðŸ »' = '🐻'
    'ðŸ ©' = '🐙'
    'ðŸ¦‹' = '🦋'
    'ðŸ”' = '🔍'
    '🌐Ÿ' = '🌐'
}

try {
    Write-Host "Reading file $FilePath..."
    $content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
    
    foreach ($key in $Replacements.Keys) {
        if ($content.Contains($key)) {
            Write-Host "Replacing $key with $($Replacements[$key])"
            $content = $content.Replace($key, $Replacements[$key])
        }
    }
    
    Write-Host "Writing file back..."
    [System.IO.File]::WriteAllText($FilePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done."
    
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
