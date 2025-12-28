$path = "client/src/pages/PrintablesPage.tsx"
$content = Get-Content $path -Raw

# Ordered mapping of keywords to Emojis (Hex string for fromCodePoint)
# Specific matches first, then generic
$emojiMap = [ordered]@{
    "geo"           = "0x1F30D"       # Earth
    "reading"       = "0x1F4D6"   # Book
    "stem"          = "0x1F52C"      # Microscope
    "arts"          = "0x1F3A8"      # Palette
    "science"       = "0x1F9EA"   # Test Tube
    "grammar"       = "0x270D"    # Writing Hand
    "color"         = "0x1F58D"     # Crayon
    "maze"          = "0x1F300"      # Cyclone
    "halloween"     = "0x1F383" # Pumpkin
    "winter"        = "0x2744"     # Snowflake
    "spring"        = "0x1F338"    # Blossom
    "summer"        = "0x2600"     # Sun
    "animal"        = "0x1F43E"    # Paw
    "space"         = "0x1F680"     # Rocket
    "add"           = "0x2795"        # Plus
    "sum"           = "0x2795"        # Plus
    "sub"           = "0x2796"        # Minus
    "minus"         = "0x2796"      # Minus
    "mult"          = "0x2716"       # Multiply
    "times"         = "0x2716"      # Multiply
    "div"           = "0x2797"        # Divide
    "fraction"      = "0x1F370"  # Cake
    "decimal"       = "0x1F522"   # Input Numbers
    "percent"       = "0x1F4AF"   # 100
    "money"         = "0x1F4B0"     # Money Bag
    "time"          = "0x23F0"       # Alarm Clock
    "elapsed"       = "0x23F0"    # Alarm Clock
    "measure"       = "0x1F4CF"   # Ruler
    "metric"        = "0x1F4CF"    # Ruler
    "geometry"      = "0x1F4D0"  # Triangular Ruler
    "shape"         = "0x1F537"     # Diamond
    "tangram"       = "0x1F7E9"   # Large Square (closest) Or 0x1F6A7
    "kindergarten"  = "0x1F9FA" # Kite
    "rhyming"       = "0x1F5E3"   # Speaking Head
    "sight"         = "0x1F441"     # Eye
    "logic"         = "0x1F9E0"     # Brain
    "word-problems" = "0x1F4DD" # Memo
    "pattern"       = "0x1F3C1"   # Chequered Flag
    "compare"       = "0x2696"    # Scales
    "data"          = "0x1F4CA"      # Chart
    "graph"         = "0x1F4CA"     # Chart
    "probability"   = "0x1F3B2" # Die
    "mean"          = "0x1F4C8"      # Chart Increasing
    "skip-count"    = "0x1F430" # Rabbit
    "number"        = "0x1F522"    # Numbers
    "count"         = "0x1F522"     # Numbers
    "place-value"   = "0x1F3DB" # Classical Building (Placeholder for structure) or 0x1F522
    "rounding"      = "0x2934"   # Arrow curving up? 0x1F504 Repeat button
    "transform"     = "0x21BB"  # Clockwise open circle arrow
    "symmetry"      = "0x1F9FE"  # Receipt? No. 0x1F9A2 Swan? 0x1F54A Dove
    "angle"         = "0x1F4D0"     # Triangle Ruler
    "perimeter"     = "0x25AD"  # Rectangle
    "area"          = "0x25A6"       # Square with shading
    "volume"        = "0x1F9CA"    # Ice Cube
    "mass"          = "0x2696"       # Scales
    "weight"        = "0x2696"     # Scales
    "customary"     = "0x1F1FA" # US Flag? No. Ruler.
    "lines"         = "0x1F4CF"     # Ruler
    "nets"          = "0x1F4E6"      # Package
    "expression"    = "0x2797" # Division/Symbol
    "equation"      = "0x1F522"
    "rule"          = "0x1F4D8"      # Blue Book
    "upper"         = "0x1F520"     # Capital ABCD
    "lower"         = "0x1F524"     # abc
    "beginning"     = "0x1F524" # abc
    "ten-frame"     = "0x1F518" # Radio button? 
    "drawing"       = "0x270F"    # Pencil
    "craft"         = "0x2702"      # Scissors
    "feeling"       = "0x1F600"   # Grinning
    "reward"        = "0x1F3C6"    # Trophy
    "spelling"      = "0x1F4DD"  # Memo
    "design"        = "0x1F3A8"    # Palette
    "hidden"        = "0x1F50D"    # Magnifying Glass
    "gratitude"     = "0x1F64F" # Folded Hands
    "mood"          = "0x1F60C"      # Relieved
    "mandala"       = "0x1F308"   # Rainbow
    "goal"          = "0x1F3AF"      # Direct Hit
    "brain"         = "0x1F9E0"     # Brain
    "world"         = "0x1F30D"     # Earth
    "doubles"       = "0x2211"    # Sum? 0x1F46F Twins
    "balance"       = "0x2696"    # Scales
    "line-trace"    = "0x2712" # Pen nib
    "tracking"      = "0x1F43E"  # Paw
    "bar-graph"     = "0x1F4CA"
    "pie"           = "0x1F967"       # Pie
}

# Regex to find: docId="ANYTHING" ... emoji={String.fromCharCode(0x2728)}
# We match loosely but ensure we capture the docId.
# We will use a constraint that the emoji must follow the docId without seeing another docId="
$regex = [regex]'(docId=")([^"]+)("[\s\S]*?emoji=\{)(String\.fromCharCode\(0x2728\))(\})'

# We can rely on the fact that these props are usually close. 
# But to be safe against the "skip-over" bug, we iterate through matches and check the distance or content.
# Alternatively, we just blindly replace if we find the pattern, assuming the code structure is consistent 
# (which it is: docId is top prop, emoji follows shortly).

# Let's use a callback replace.
$newContent = $regex.Replace($content, {
        param($match)
        $docId = $match.Groups[2].Value
        $fullMatch = $match.Value
    
        # Safety Check: If the span between docId and emoji contains 'docId="', then we have skipped.
        # $match.Groups[3].Value is the stuff in between.
        if ($match.Groups[3].Value -match 'docId="') {
            # This is the "skip-over" case. We should NOT replace this, or we need to be smarter.
            # However, regex engine in Replace traverses left to right.
            # If it matched greedily/lazily across a boundary, it consumes the start.
            # If we return the original string, we might miss the legitimate inner match?
            # Actually, if we return original, the engine continues AFTER the match.
            # So we skip the *first* docId, but we might also skip the *second* docId inside the group 3?
            # Yes. This is risky.
        
            # Better approach: Fix the Regex to be strict.
            # (?:(?!docId=).)*? ensures we don't cross a docId.
            return $match.Value # Return unchanged if unsafe
        }

        $emojiHex = "0x1F4D1" # Default Bookmark

        # Match key
        foreach ($key in $emojiMap.Keys) {
            if ($docId -match $key) {
                $emojiHex = $emojiMap[$key]
                break
            }
        }
    
        # Construct replacement
        # Group 1: docId="
        # Group 2: <ID>
        # Group 3: " ... emoji={
        # Group 4: String.fromCharCode(0x2728)
        # Group 5: }
    
        return $match.Groups[1].Value + $docId + $match.Groups[3].Value + "String.fromCodePoint($emojiHex)" + $match.Groups[5].Value
    })

Set-Content $path -Value $newContent -Encoding UTF8
Write-Host "Batch header fix completed."
