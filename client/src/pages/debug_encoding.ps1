param (
    [string]$FilePath,
    [int]$LineNumber
)

$content = [System.IO.File]::ReadAllLines($FilePath, [System.Text.Encoding]::UTF8)
$line = $content[$LineNumber - 1]
Write-Host "Line $LineNumber Content: $line"
$chars = $line.ToCharArray()
foreach ($c in $chars) {
    [int]$i = $c
    Write-Host "$c : $i" -NoNewline
    Write-Host " " -NoNewline
}
Write-Host ""
