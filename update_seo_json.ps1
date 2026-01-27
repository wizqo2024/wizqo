# update_seo_json.ps1 - Manual SEO Sync Script
$jsonFile = "c:\Users\mohamedsafran\.gemini\antigravity\scratch\wizqo\client\public\worksheet-seo-data.json"
$raw = Get-Content $jsonFile -Raw
$data = $raw | ConvertFrom-Json

# 1. Rename 'addition-subtraction-within-10' to 'addition-subtraction-0-10' if exists
if ($data.PSObject.Properties.Name -contains "addition-subtraction-within-10") {
  $oldEntry = $data."addition-subtraction-within-10"
  $data | Add-Member -MemberType NoteProperty -Name "addition-subtraction-0-10" -Value $oldEntry
  $data.PSObject.Properties.Remove("addition-subtraction-within-10")
  Write-Host "Renamed addition-subtraction-within-10 to addition-subtraction-0-10" -ForegroundColor Cyan
}

# 2. Define Rich Content for sub-2digit-100 (Article Style with Emojis)
$RICH_SUB_2DIGIT_100 = @"
<article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">2-Digit Subtraction Within 100: Math Practice - Free PDF</h1>
  <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2rem; line-height: 1.6;">
    Mastering <strong>2-digit subtraction</strong> without regrouping is a critical milestone for 1st and 2nd grade students. At Wizqo, we provide high-fidelity, printable math resources that help children transition from simple facts to columnar arithmetic with zero frustration. 💎
  </p>
  <section style="margin-bottom: 2rem;">
    <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">✨ Core Learning Objectives</h2>
    <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;"><strong>Place Value Awareness:</strong> Understanding how to align tens and ones columns correctly for 100% accuracy.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Mental Math Fluency:</strong> Developing speed with larger numbers without relying on finger counting.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Procedural Independence:</strong> Building the confidence to solve multi-step subtraction problems vertically.</li>
    </ul>
  </section>
  <section style="margin-bottom: 2rem; background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">📝 Strategic Practice Tips</h2>
    <p style="color: #475569; line-height: 1.6;">
      Encourage students to solve problems column by column, starting always from the <strong>ones place</strong>. This habit prevents confusion when they later advance to subtraction <em>with</em> regrouping. Use these sheets as timed drills to build technical speed!
    </p>
  </section>
  <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
    <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Why Educators Choose Wizqo 🍎</h2>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">At Wizqo, we believe that high-quality education should be accessible to everyone. Our resources are designed by pedagogical experts to ensure they meet the highest standards of clarity. By focusing on print-based learning, we help students foster a deeper connection with the material through physical problem-solving.</p>
  </section>
</article>
"@

# 3. Define Rich Content for addition-subtraction-0-10
$RICH_ADD_SUB_0_10 = @"
<article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">The Math Foundation: Addition & Subtraction within 10</h1>
  <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">
    Discover the logic of 'Unit Fluency' with our primary math collection. Designed for early elementary students, these resources focus on <strong>mastering the core relationships between numbers 0 through 10</strong>, building the essential mental anchors required for all future arithmetic. 🚀
  </p>
  <section style="margin-bottom: 2rem;">
    <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">💡 Foundational Mastery Goals</h2>
    <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;"><strong>Automaticity Rigor:</strong> achieving 100% correct recall for all operations within the 0-10 set.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Relational Logic:</strong> understanding how addition and subtraction are inverse operations.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Stamina Building:</strong> completing 20+ problems with sustained focus and accuracy.</li>
    </ul>
  </section>
  <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
    <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Premier Academic Grade Printables 🏆</h2>
    <p style="color: #475569; line-height: 1.6;">Wizqo produces educator-vetted math tools that are high-fidelity for student growth. Our primary series follows rigorous developmental standards for early arithmetic excellence. Download your first step today!</p>
  </section>
</article>
"@

# 4. Apply Updates
if ($data."sub-2digit-100") {
  $data."sub-2digit-100".richContent = $RICH_SUB_2DIGIT_100
  $data."sub-2digit-100".title = "2-Digit Subtraction Within 100 Worksheets - Free PDF | Wizqo"
  Write-Host "Updated sub-2digit-100 with rich content" -ForegroundColor Green
}

if ($data."addition-subtraction-0-10") {
  $data."addition-subtraction-0-10".richContent = $RICH_ADD_SUB_0_10
  $data."addition-subtraction-0-10".title = "Addition and Subtraction within 10 - Math Foundations | Wizqo"
  Write-Host "Updated addition-subtraction-0-10 with rich content" -ForegroundColor Green
}

# 5. Save back to JSON
$jsonOutput = $data | ConvertTo-Json -Depth 10
$jsonOutput | Set-Content $jsonFile -Encoding UTF8
Write-Host "Manual SEO JSON sync completed." -ForegroundColor Yellow

# 6. Verification
$verifyRaw = Get-Content $jsonFile -Raw
if ($verifyRaw -match "Mastering 2-digit subtraction") {
  Write-Host "VERIFICATION SUCCESS: Content found in file." -ForegroundColor Green
}
else {
  Write-Host "VERIFICATION FAILED: Content NOT found in file." -ForegroundColor Red
  # Print a snippet of what IS there
  Write-Host "Snippet found: $($verifyRaw.Substring(0, 200))..."
}
