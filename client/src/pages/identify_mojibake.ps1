$filePath = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::GetEncoding("iso-8859-1"))

# Match sequences that look like UTF-8 mojibake
# Usually start with ð (0xF0) or â (0xE2)
$matches = [regex]::Matches($content, "[\xF0\xE2][\x80-\xBF\xC0-\xFF]{1,10}")
$uniques = $matches.Value | Sort-Object -Unique

foreach ($m in $uniques) {
    try {
        $bytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($m)
        $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
        Write-Output "Match: $m -> Fixed: $fixed"
    } catch {
        Write-Output "Match: $m -> (Error)"
    }
}
