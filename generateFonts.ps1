
$b64Path = "C:\Users\ThajulAmeerMohamedSa\.gemini\antigravity\brain\139a62d6-4bc8-426f-b6ba-e636d28ca948\Codystar-Regular.ttf.base64.txt"
$outputPath = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\lib\fonts.ts"

if (Test-Path $b64Path) {
    $b64 = Get-Content -Path $b64Path -Raw
    $content = "export const CODYSTAR_TTF_BASE64 = '" + $b64.Trim() + "';"
    Set-Content -Path $outputPath -Value $content -Encoding utf8
    Write-Host "Successfully generated $outputPath"
} else {
    Write-Error "Base64 file not found at $b64Path"
}
