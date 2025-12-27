param (
    [string]$FilePath,
    [string]$JsonPath
)

$ErrorActionPreference = "Stop"

try {
    Write-Host "Reading replacements from $JsonPath..."
    # Read JSON with UTF8 encoding explicitly
    $jsonContent = [System.IO.File]::ReadAllText($JsonPath, [System.Text.Encoding]::UTF8)
    $replacements = $jsonContent | ConvertFrom-Json
    
    Write-Host "Reading target file $FilePath..."
    $content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
    
    $count = 0
    foreach ($prop in $replacements.PSObject.Properties) {
        $key = $prop.Name
        $val = $prop.Value
        
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $val)
            $count++
        }
    }
    
    Write-Host "Replaced $count patterns."
    
    Write-Host "Writing file back..."
    [System.IO.File]::WriteAllText($FilePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done."
    
}
catch {
    Write-Error $_.Exception.Message
    exit 1
}
