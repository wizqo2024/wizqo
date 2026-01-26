$dirs = Get-Content physical_dirs.txt
$xml = '<?xml version="1.0" encoding="UTF-8"?>' + [Environment]::NewLine
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + [Environment]::NewLine
foreach ($d in $dirs) {
    $xml += '  <url>' + [Environment]::NewLine
    $xml += '    <loc>https://wizqo.com/worksheets/' + $d + '</loc>' + [Environment]::NewLine
    $xml += '    <changefreq>weekly</changefreq>' + [Environment]::NewLine
    $xml += '    <priority>0.8</priority>' + [Environment]::NewLine
    $xml += '  </url>' + [Environment]::NewLine
}
$xml += '</urlset>'
$xml | Out-File -FilePath 'client/public/sitemap_worksheets.xml' -Encoding UTF8
Write-Host "Generated sitemap with $($dirs.Count) URLs"
