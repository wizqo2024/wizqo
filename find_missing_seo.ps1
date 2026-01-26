$content = Get-Content -Path 'shared/worksheetSEO.ts' -Raw
$arrayStart = $content.IndexOf("const allDocIds = [")
$arrayEnd = $content.IndexOf("]", $arrayStart)
$arrayContent = $content.Substring($arrayStart, $arrayEnd - $arrayStart)

# Extract all single-quoted strings inside the array content
$mapped = [regex]::Matches($arrayContent, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }

$dirs = Get-ChildItem -Path 'prerendered/worksheets' -Directory | Select-Object -ExpandProperty Name

$diff = $dirs | Where-Object { $mapped -notcontains $_ }
$diff | Out-File -FilePath 'missing_worksheets.txt'

Write-Host "Total Physical Dirs: $($dirs.Count)"
Write-Host "Mapped in allDocIds: $($mapped.Count)"
Write-Host "Missing from Mapping: $($diff.Count)"
