param (
    [string]$FilePath,
    [int]$StartLine,
    [int]$EndLine
)

$ErrorActionPreference = "Stop"

try {
    # .NET IO for speed and encoding control
    $lines = [System.IO.File]::ReadAllLines($FilePath, [System.Text.Encoding]::UTF8)
    
    $keepCountBefore = $StartLine - 1
    # Check bounds
    if ($keepCountBefore -lt 0) { $keepCountBefore = 0 }
    if ($keepCountBefore -gt $lines.Count) { $keepCountBefore = $lines.Count }
    
    $keepIndexAfter = $EndLine
    if ($keepIndexAfter -lt 0) { $keepIndexAfter = 0 }
    
    $newLines = @()
    
    # Add first chunk
    if ($keepCountBefore -gt 0) {
        $newLines += $lines[0..($keepCountBefore - 1)]
    }
    
    # Add second chunk
    if ($keepIndexAfter -lt $lines.Count) {
        $newLines += $lines[$keepIndexAfter..($lines.Count - 1)]
    }
    
    [System.IO.File]::WriteAllLines($FilePath, $newLines, [System.Text.Encoding]::UTF8)
    
    Write-Host "Success: Deleted lines $StartLine to $EndLine"
    Write-Host "Old count: $($lines.Count)"
    Write-Host "New count: $($newLines.Count)"

}
catch {
    Write-Error $_.Exception.Message
    exit 1
}
