# update_seo_json.ps1
$jsonFile = "c:\Users\mohamedsafran\.gemini\antigravity\scratch\wizqo\client\public\worksheet-seo-data.json"
$raw = Get-Content $jsonFile -Raw
$data = $raw | ConvertFrom-Json

$BOOSTER_TITLE = "The Wizqo Comprehensive Learning Guide"
$BOOSTER_HTML = @"
  <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
    <h2 style="font-size: 1.5625rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Why Educators Choose Wizqo</h2>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">At Wizqo, we believe that high-quality education should be accessible to everyone, everywhere. Our resources are designed by pedagogical experts to ensure they meet the highest standards of clarity and effectiveness. By focusing on print-based learning, we help students avoid digital eye strain and foster a deeper connection with the material through handwriting and physical problem-solving.</p>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Consistent practice is the cornerstone of pedagogical mastery. Our worksheets are engineered to provide localized, focused training on key educational standards. By engaging with this material, students develop critical manual coordination, visual discrimination, and symbolic logic. This activity focuses on building internal confidence through clear, manageable steps, ensuring that learners feel empowered rather than overwhelmed.</p>
    <p style="color: #475569; line-height: 1.6;">Every worksheet in our library is optimized for standard home and classroom printers. We include detailed answer keys with every download to provide immediate feedback and support independent learning. Join our community of thousands of teachers and parents who trust Wizqo for their daily educational needs. From Kindergarten foundations to Grade 5 mastery, we are your partners in academic excellence.</p>
  </section>
"@

$count = 0
foreach ($slug in $data.PSObject.Properties.Name) {
    if ($slug -eq "addition-subtraction-within-10" -or $slug -eq "animal-word-search") {
        # Keep existing or specifically handle
    }
    
    $entry = $data.$slug
    if (-not $entry.richContent -or $entry.richContent.Length -lt 100) {
        $h1Text = $entry.h1
        if (-not $h1Text) { $h1Text = $entry.title }
        
        $rich = @"
      <article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">$($h1Text) - $($BOOSTER_TITLE)</h1>
        <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2rem; line-height: 1.6;">Welcome to the definitive resource for <strong>$($h1Text.ToLower())</strong>. At Wizqo, we are dedicated to providing educators, parents, and students with high-fidelity, printable educational assets that bridge the gap between conceptual understanding and procedural fluency.</p>
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Core Learning Objectives & Benefits</h2>
          <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
            <li style="margin-bottom: 0.5rem;"><strong>Conceptual Clarity:</strong> Our intuitive layouts help students understand the "why" behind every problem, not just the "how."</li>
            <li style="margin-bottom: 0.5rem;"><strong>Procedural Speed:</strong> Repeated practice builds the mental automaticity required for higher-level problem solving.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Academic Stamina:</strong> Completing multi-step educational tasks builds the concentration and discipline needed for complex reasoning.</li>
          </ul>
        </section>
        $($BOOSTER_HTML)
      </article>
"@
        if (-not $entry.PSObject.Properties['richContent']) {
            $entry | Add-Member -MemberType NoteProperty -Name richContent -Value $rich
        }
        else {
            $entry.richContent = $rich
        }
        $count++
    }
}

$data | ConvertTo-Json -Depth 10 | Set-Content $jsonFile -Encoding UTF8
Write-Host "Injected richContent booster into $count worksheets in JSON." -ForegroundColor Green
