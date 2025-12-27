param (
    [string]$FilePath,
    [int]$LineNumber
)

$bytes = [System.IO.File]::ReadAllBytes($FilePath)
# Estimate line position is hard with raw bytes without scanning for newlines.
# Instead, read lines with default encoding to find the string, then convert back to get roughly the bytes, 
# OR use a stream reader to count newlines.

# Better approach: Read as text, find the target string, then inspect bytes of that string.
$content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
$lines = $content -split "`n"
$line = $lines[$LineNumber - 1].Trim()

Write-Host "Target Line Content: $line"

# Convert the string back to UTF8 bytes to see what's actually there
$enc = [System.Text.Encoding]::UTF8
$lineBytes = $enc.GetBytes($line)
$hex = ($lineBytes | ForEach-Object { "{0:X2}" -f $_ }) -join " "
Write-Host "Bytes (Hex): $hex"
