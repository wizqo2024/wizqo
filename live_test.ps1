
try {
    $liveAll = Invoke-WebRequest -Uri "https://wizqo.com/worksheets/all/" -UseBasicParsing -ErrorAction Stop
    $liveAllWords = ($liveAll.Content -split '\s+').Count
}
catch {
    $liveAllWords = "ERROR"
}

try {
    $liveZig = Invoke-WebRequest -Uri "https://wizqo.com/worksheets/zigzag-lines/" -UseBasicParsing -ErrorAction Stop
    $liveZigWords = ($liveZig.Content -split '\s+').Count
}
catch {
    $liveZigWords = "ERROR"
}

$localAll = Get-Content "prerendered/worksheets/all/index.html" -Raw
$localAllWords = ($localAll -split '\s+').Count

$localZig = Get-Content "prerendered/worksheets/zigzag-lines/index.html" -Raw
$localZigWords = ($localZig -split '\s+').Count

$liveAllTitle = if ($liveAll) { ([regex]::Match($liveAll.Content, '<title>(.*?)</title>')).Groups[1].Value } else { "N/A" }
$localAllTitle = ([regex]::Match($localAll, '<title>(.*?)</title>')).Groups[1].Value

Write-Host "--- LIVE SEO TEST RESULTS ---"
Write-Host "Page: All Worksheets Hub"
Write-Host "  Live Word Count:  $liveAllWords"
Write-Host "  Local Word Count: $localAllWords"
Write-Host "  Live Title:       $liveAllTitle"
Write-Host "  Local Title:      $localAllTitle"
Write-Host ""
Write-Host "Page: Zigzag Lines (Single Worksheet)"
Write-Host "  Live Word Count:  $liveZigWords"
Write-Host "  Local Word Count: $localZigWords"
Write-Host "-----------------------------"
if ($localAllWords -gt $liveAllWords -and $localZigWords -gt 300) {
    Write-Host "RESULT: PASSED. Local files provide significantly more rich content."
}
else {
    Write-Host "RESULT: CHECK DATA. Verify if word counts meet expectations."
}
