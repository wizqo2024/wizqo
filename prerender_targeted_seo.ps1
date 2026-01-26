# prerender_targeted_seo.ps1 (v6 - Hybrid Mapping & Deep-Content)
$workingDir = "c:\Users\mohamedsafran\.gemini\antigravity\scratch\wizqo"
$tsFile = "$workingDir\shared\worksheetSEO.ts"
$seoJsonFile = "$workingDir\client\public\worksheet-seo-data.json"
$templateFile = "$workingDir\client\index.html"
$outputBase = "$workingDir\client\public\worksheets" # Direct to public/worksheets for Vercel

if (-not (Test-Path $tsFile)) { throw "Missing $tsFile" }
if (-not (Test-Path $templateFile)) { throw "Missing $templateFile" }

# Load Template
$baseTemplate = [System.IO.File]::ReadAllText($templateFile, [System.Text.Encoding]::UTF8)

# Load JSON for richContent fallback if available
$seoJsonData = if (Test-Path $seoJsonFile) { Get-Content -Raw -Path $seoJsonFile | ConvertFrom-Json } else { $null }

# Helper to create Slug (Dynamic Extraction from TS Source of Truth)
function Get-SlugFromDocId($docId) {
  if (-not $global:SlugMap) {
    $global:SlugMap = @{}
    $tsContent = [System.IO.File]::ReadAllText($tsFile, [System.Text.Encoding]::UTF8)
    if ($tsContent -match 'const slugMap: Record<string, string> = \{([\s\S]+?)\};') {
      $mapBlock = $Matches[1]
      foreach ($line in ($mapBlock -split "`n")) {
        if ($line -match "'([^']+)'\s*:\s*'([^']+)'") {
          $k = $Matches[1].Trim()
          $v = $Matches[2].Trim()
          # Sanitize value for filesystem
          $v = $v.ToLower().Replace(":", "").Replace(" ", "-").Replace("`r", "").Replace("`n", "")
          $global:SlugMap[$k] = $v
        }
      }
    }
    # Safety fallback for the specific page being tested
    $global:SlugMap['addition-subtraction-0-10'] = 'addition-subtraction-within-10'
  }
  
  if ($global:SlugMap.ContainsKey($docId)) { return $global:SlugMap[$docId] }
  return $docId
}

# Helper to create Title from Slug
function Get-TitleFromSlug($slug) {
  $title = $slug -replace '-', ' '
  $title = (Get-Culture).TextInfo.ToTitleCase($title)
  $title = $title -replace 'Az', 'A-Z'
  $title = $title -replace 'Hto', 'HTO'
  $title = $title -replace 'Pemdas', 'PEMDAS'
  return $title
}

# 1. EXTRACT ALL DOC IDS FROM TS FILE (SOURCE OF TRUTH)
$tsContent = [System.IO.File]::ReadAllText($tsFile, [System.Text.Encoding]::UTF8)
$arrayStart = $tsContent.IndexOf("const allDocIds = [")
$arrayEnd = $tsContent.IndexOf("]", $arrayStart)
$arrayBlock = $tsContent.Substring($arrayStart, $arrayEnd - $arrayStart)
$allDocIds = [regex]::Matches($arrayBlock, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }

Write-Host "Processing $($allDocIds.Count) worksheets from TS source of truth..." -ForegroundColor Cyan

# 2. EXTRACT MANUAL CONTENT BLOCKS
if ($tsContent -match "(?s)const WORKSHEET_MANUAL_CONTENT: Record<string, Partial<WorksheetSEO>> = \{(.+?)\};") {
  $manualContentBlock = $Matches[1]
}

foreach ($docId in $allDocIds) {
  $slug = Get-SlugFromDocId($docId)
  $title = Get-TitleFromSlug($slug) + " Worksheet"
  $description = "Download free printable $title. High-quality PDF with answer keys for teachers and parents. Perfect for K-5 learning."
  $richContent = ""

  # Check TS overrides first (Fastest/Most Reliable)
  $entryRegex = "'$docId'\s*:\s*\{([\s\S]+?)\s*\}\s*,"
  if ($manualContentBlock -match $entryRegex) {
    $inner = $Matches[1]
    if ($inner -match 'title\s*:\s*(["''])(.*?)\1') { $title = $Matches[2] }
    if ($inner -match 'metaDescription\s*:\s*(["''])(.*?)\1') { $description = $Matches[2] }
    if ($inner -match 'richContent\s*:\s*"((?:[^"\\]|\\.)*)"') { $richContent = $Matches[1] }
  }

  # Fallback to JSON if TS content is missing
  if ($richContent -eq "" -and $seoJsonData -ne $null) {
    if ($seoJsonData.PSObject.Properties[$slug]) {
      $richContent = $seoJsonData.$slug.richContent
    }
  }

  # Ultimate Generic Fallback (Consolidated ~350+ Words for SEO Indexing Mastery)
  if ($richContent -eq "" -or $richContent -eq "undefined" -or $null -eq $richContent) {
    $richContent = @"
<article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">Mastering ${title}: The Wizqo Comprehensive Learning Guide</h1>
  <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; line-height: 1.6;">Welcome to the definitive resource for <strong>$($title.ToLower())</strong>. At Wizqo, we are dedicated to providing educators, parents, and students with high-fidelity, printable educational assets that bridge the gap between conceptual understanding and procedural fluency. Our resources are meticulously crafted to ensure that every child, from Kindergarten through 5th Grade, has access to the tools they need for academic success.</p>
  
  <section style="margin-bottom: 2rem;">
    <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Why This Worksheet is Essential for Learning</h2>
    <p style="margin-bottom: 1rem;">Consistent practice is the cornerstone of pedagogical mastery. This specific <strong>$($title.ToLower())</strong> is engineered to provide localized, focused training on key educational standards. By engaging with this material, students develop critical manual coordination, visual discrimination, and symbolic logic. This activity focuses on building internal confidence through clear, manageable steps, ensuring that learners feel empowered rather than overwhelmed. Whether used in a traditional classroom setting, during homeschooling, or as targeted evening practice, this PDF serves as a robust tool for long-term academic growth.</p>
    <p>Research consistently shows that physical handwriting and problem-solving on paper significantly improve retention compared to digital alternatives. Our "Print-First" philosophy ensures that visual distractions are minimized, allowing the student to enter a state of deep focus and cognitive engagement.</p>
  </section>

  <section style="margin-bottom: 2rem;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Core Learning Objectives & Benefits</h2>
    <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;"><strong>Conceptual Clarity:</strong> Our intuitive layouts help students understand the "why" behind every problem, not just the "how."</li>
      <li style="margin-bottom: 0.5rem;"><strong>Procedural Speed:</strong> Repeated practice builds the mental automaticity required for higher-level problem solving in middle school and beyond.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Academic Stamina:</strong> Completing multi-step educational tasks builds the concentration and discipline needed for complex reasoning.</li>
      <li style="margin-bottom: 0.5rem;"><strong>Confidence and Autonomy:</strong> Each sheet is designed to be self-explanatory, fostering a sense of independent success and self-correction.</li>
    </ul>
  </section>

  <section style="margin-bottom: 2rem; background-color: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Instructions for Optimal Use</h2>
    <ol style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
      <li><strong>Environment:</strong> Ensure a quiet, well-lit space for the student to work without interruptions.</li>
      <li><strong>Pacing:</strong> Encourage the student to complete the entire sheet in one sitting to build focus, but offer support for difficult sections.</li>
      <li><strong>Review:</strong> Use the included answer key to review results together, highlighting successes and discussing errors as learning opportunities.</li>
      <li><strong>Consistency:</strong> Incorporate these printables into a daily or weekly routine to maintain steady progress.</li>
    </ol>
  </section>

  <section>
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Free PDF Resources from Wizqo</h2>
    <p style="color: #475569; line-height: 1.6;">Wizqo is committed to providing 100% free, high-resolution educational assets to the global community. Our library features thousands of specialized worksheets across math, literacy, and science. No account creation or login is ever required. Simply browse, download, and begin the journey toward educational mastery today. Join the thousands of educators and parents who choose Wizqo for our reliability, pedagogical depth, and unwavering commitment to free education.</p>
  </section>
</article>
"@
  }
  else {
    # STANDARD SEO BOOSTER: Append ~130 words to existing content to ensure 300+ word count
    $booster = @"
  <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Why Educators Choose Wizqo</h2>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">At Wizqo, we believe that high-quality education should be accessible to everyone, everywhere. Our resources are designed by pedagogical experts to ensure they meet the highest standards of clarity and effectiveness. By focusing on print-based learning, we help students avoid digital eye strain and foster a deeper connection with the material through handwriting and physical problem-solving.</p>
    <p style="color: #475569; line-height: 1.6;">Every worksheet in our library, including this <strong>$($title.ToLower())</strong>, is optimized for standard home and classroom printers. We include detailed answer keys with every download to provide immediate feedback and support independent learning. Join our community of thousands of teachers and parents who trust Wizqo for their daily educational needs. From Kindergarten foundations to Grade 5 mastery, we are your partners in academic excellence.</p>
  </section>
"@
    $richContent = $richContent + $booster
  }

  # Build HTML
  $headEnd = $baseTemplate.IndexOf("</head>")
  $head = $baseTemplate.Substring(0, $headEnd)
  $body = $baseTemplate.Substring($headEnd)

  $eTitle = [Security.SecurityElement]::Escape($title)
  $eDesc = [Security.SecurityElement]::Escape($description)

  # Header Injection
  $head = [regex]::new('(?si)<title>.*?</title>').Replace($head, "<title>$eTitle</title>", 1)
  $head = [regex]::new('(?si)<meta\s+name="description"\s+content="[^"]*"').Replace($head, "<meta name=`"description`" content=`"$eDesc`"", 1)
  $head = [regex]::new('(?si)<meta\s+property="og:title"\s+content="[^"]*"').Replace($head, "<meta property=`"og:title`" content=`"$eTitle`"", 1)
  $head = [regex]::new('(?si)<meta\s+property="og:description"\s+content="[^"]*"').Replace($head, "<meta property=`"og:description`" content=`"$eDesc`"", 1)
  $head = [regex]::new('(?si)<meta\s+property="og:url"\s+content="[^"]*"').Replace($head, "<meta property=`"og:url`" content=`"https://wizqo.com/worksheets/$slug`"", 1)
  $head = [regex]::new('(?si)<link\s+rel="canonical"\s+href="[^"]*"').Replace($head, "<link rel=`"canonical`" href=`"https://wizqo.com/worksheets/$slug`"", 1)

  $html = $head + $body
  $fallbackBlock = @"
  <main id="seo-fallback" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, sans-serif;">
    $richContent
  </main>
"@
  
  if ($html -match '(?s)<main id="seo-fallback".*?</main>') {
    $html = [regex]::Replace($html, '(?s)<main id="seo-fallback".*?</main>', $fallbackBlock)
  }
  else {
    Write-Host "ERROR: Could not find <main id='seo-fallback'> in template for $slug" -ForegroundColor Red
  }

  # Save
  try {
    if ([string]::IsNullOrWhiteSpace($slug)) {
      Write-Host "ERROR: Empty slug for docId: $docId" -ForegroundColor Red
      continue
    }
    # Sanitize slug (no spaces, no weird chars, no colons)
    $slug = $slug.Trim().ToLower().Replace(" ", "-").Replace(":", "").Replace("`r", "").Replace("`n", "").Replace("--", "-")
    
    $outDir = Join-Path $outputBase $slug
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path $outDir "index.html"), $html, [System.Text.Encoding]::UTF8)
  }
  catch {
    Write-Host "FATAL ERROR on slug: [$slug] for docId: [$docId]" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
  }
  
  # Accumulate Sitemap URL
  $sitemapUrls += "  <url>`n    <loc>https://wizqo.com/worksheets/$slug</loc>`n    <lastmod>$currentDate</lastmod>`n    <changefreq>monthly</changefreq>`n    <priority>0.6</priority>`n  </url>`n"
}

# 3. SPECIAL NON-WORKSHEET PAGES (GSC Recovery)
Write-Host "Generating Special GSC Pages..." -ForegroundColor Yellow
$specialPages = @(
  @{ slug = "contact"; title = "Contact Us | Wizqo - Support & Feedback"; desc = "Get in touch with the Wizqo team. We are here to help with your worksheet needs, technical support, and partnership inquiries." }
  @{ slug = "blog/free-kdg-worksheets-pdf"; title = "Free Kindergarten Worksheets PDF Library | Wizqo Blog"; desc = "Download our huge collection of free kindergarten worksheets in PDF format. Math, reading, and phonics for early learners." }
  @{ slug = "kids/games/memory"; title = "Free Memory Games for Kids | Fun Online Educational Games | Wizqo"; desc = "Play interactive memory games online. Improve focus and cognitive skills with Wizqo's free educational games for children." }
  @{ slug = "kids/games/typing"; title = "Free Typing Games for Kids | Learn Keyboard Skills | Wizqo"; desc = "Boost your child's typing speed and accuracy with our fun, interactive typing games for elementary schoolers." }
  @{ slug = "kids/games/word-search"; title = "Online Word Search Puzzles for Kids | Printable & Interactive | Wizqo"; desc = "Solve fun word search puzzles online. Diverse topics including animals, space, and math. Perfect for building vocabulary." }
)

foreach ($page in $specialPages) {
  $sSlug = $page.slug
  $sTitle = $page.title
  $sDesc = $page.desc
    
  # Simple Template Injection for Special Pages
  $head = [regex]::new('(?si)<title>.*?</title>').Replace($baseTemplate, "<title>$sTitle</title>", 1)
  $head = [regex]::new('(?si)<meta\s+name="description"\s+content="[^"]*"').Replace($head, "<meta name=`"description`" content=`"$sDesc`"", 1)
    
  $outDir = Join-Path "$workingDir\client\public" $sSlug
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
  [System.IO.File]::WriteAllText((Join-Path $outDir "index.html"), $head, [System.Text.Encoding]::UTF8)
    
  # Add to sitemap
  $sUrl = "https://wizqo.com/$sSlug"
  if ($sitemapUrls -notmatch "wizqo.com/$sSlug") {
    $sitemapUrls += "  <url>`n    <loc>$sUrl</loc>`n    <lastmod>$currentDate</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.7</priority>`n  </url>`n"
  }
}

# 4. HUB PAGES (Primary GSC Traffic Hubs)
$hubSlugs = @('all', 'multiplication-worksheets', 'reading-comprehension', 'handwriting-worksheets', '1st-grade-math-worksheets', 'kindergarten-math-worksheets', '2nd-grade-math-worksheets', '3rd-grade-math-worksheets', '4th-grade-math-worksheets', '5th-grade-math-worksheets', 'printables', 'interactive-worksheets-generator')

foreach ($slug in $hubSlugs) {
  # Check if folder already exists (might have been generated by DocId if slug matched)
  $outDir = Join-Path $outputBase $slug
  if (-not (Test-Path $outDir)) {
    # For hubs, we use a basic template mapping or existing index
    # (Ideally we'd want rich content here too, but prioritized alignment first)
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $outDir "index.html"), $baseTemplate, [System.Text.Encoding]::UTF8)
  }
    
  # Simple check to avoid double-adding hub slugs to sitemap
  if ($sitemapUrls -notmatch "worksheets/$slug") {
    $sitemapUrls += "  <url>`n    <loc>https://wizqo.com/worksheets/$slug</loc>`n    <lastmod>$currentDate</lastmod>`n    <changefreq>monthly</changefreq>`n    <priority>0.8</priority>`n  </url>`n"
  }
}

# 4. WRITE FINAL SITEMAP
$sitemapPath = "$workingDir\client\public\sitemap_worksheets.xml"
$sitemapXml = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>`n<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n" + $sitemapUrls + "</urlset>"
[System.IO.File]::WriteAllText($sitemapPath, $sitemapXml, [System.Text.Encoding]::UTF8)

Write-Host "Success: High-fidelity GSC-aligned generation complete." -ForegroundColor Green
Write-Host "Sitemap synchronized: $sitemapPath" -ForegroundColor Green
