$path = "client/src/pages/PrintablesPage.tsx"
$content = Get-Content $path
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match "emoji=\{String.fromCharCode\(0x2728\)\}") {
        # Look backwards for docId
        $found = $false
        for ($j = $i; $j -gt ($i - 20); $j--) {
            if ($j -lt 0) { break }
            if ($content[$j] -match 'docId="([^"]+)"') {
                $docId = $matches[1]
                Write-Output "$docId : $($i+1)"
                $found = $true
                break
            }
        }
        if (-not $found) {
            Write-Output "UNKNOWN : $($i+1)"
        }
    }
}
