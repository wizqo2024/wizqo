$content = Get-Content "client/src/pages/PrintablesPage.tsx" -Raw
$matches = [regex]::Matches($content, 'docId="([^"]+)"[\s\S]*?emoji=\{String\.fromCharCode\(0x2728\)\}')
$matches | ForEach-Object {
    Write-Output $_.Groups[1].Value
}
