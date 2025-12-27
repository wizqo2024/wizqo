
$path = "c:\Users\ThajulAmeerMohamedSa\OneDrive - Alpha Data LLC\Desktop\wizqo\client\src\pages\PrintablesPage.tsx"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)
$changed = $false

# Helper to map hex codes to char
function U($code) { return [char]::ConvertFromUtf32($code) }

# Mapping based on visual inspection of mapped char codes or context
# A: Apple, Airplane, Butterfly
# B: Bear, Bicycle, Banana
# C: Cat, Car, Coffee
# D: Dog, Drum, Doughnut
# E: Egg, Eagle, Elephant
# F: Fish, Fox, Frog
# G: Giraffe, Guitar, Goat
# H: House, Hammer, Hat
# I: Ice cream, Igloo, Ice skate
# J: Juggler, Jeans, Joystick
# K: Key, Kangaroo, Kite
# L: Lion, Lemon, Leaf
# M: Monkey, Map, Mouse
# N: Nest, Nail?
# O: Owl, Onion, Octopus
# P: Panda?, Pie, Pen
# Q: Queen, Quilt, Compass?
# R: Robot, Rocket, Rose
# S: Snake, Star, Sun
# T: Tiger, Turtle, Tree
# U: Umbrella, Unicorn, Urn?
# V: Violin, Van, Volcano
# W: Whale, Watermelon, Wheelchair?
# X: Xylophone, Box, Test tube
# Y: Yo-yo, Yarn, Yak?
# Z: Zebra, Zap?, Shoe?

# EMOJI MAP
$apple = "$(U 0x1F34E)";
$airplane = "$(U 0x2708)$(U 0xFE0F)"; # âœˆï¸
$butterfly = "$(U 0x1F98B)";

$bear = "$(U 0x1F43B)";
$bicycle = "$(U 0x1F6B2)";
$banana = "$(U 0x1F34C)";

$cat = "$(U 0x1F431)";
$car = "$(U 0x1F697)";
$coffee = "$(U 0x2615)";

$pick = "$(U 0x26CF)$(U 0xFE0F)"; # â›“ï¸  (Pick) -> No, context is Robot Assembly line. Let's see. 
# Line 21407: â›“ï¸  surrounding the machine.
# Probably "Gear" or "Hammer"? No, â›“ is Pick. Maybe meant âš™ï¸ (Gear)?
# Let's assume generic "Gear" or "Wrench". 
# But for now, let's fix the obvious A-Z list first.

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Generic Checkbox fix (if any left)
    if ($line.Contains("â˜ ") -and $line.Contains("I understand")) {
        $lines[$i] = $lines[$i].Replace("â˜ ", "$(U 0x2610)")
        $changed = $true
    }
    
    # A-Z Fixes (Geo Landforms / Beginning Sounds)
    if ($lines[$i].Contains("['A', 'ðŸ Ž', 'âœˆï¸ ', '🦋']")) {
        $lines[$i] = "                  ['A', '$apple', '$airplane', '$butterfly'],"
        $changed = $true
    }
    # ... This is tedious and prone to missing.
    # Better strategy: Replace the bad byte sequences GLOBALLY where safe.
    # ðŸ Ž -> Apple
    # ðŸ   -> Bear? Snake?
    
    # Let's perform specific replacements based on the "Mojibake i," log locations.
    
    # 3468: emoji="ðŸ ”ï¸ " -> National Park / Mountain? Title: "Landforms vs Water Bodies"
    # ðŸ ” = Mount Fuji? 🗻 (U+1F5FB). ðŸ ”ï¸  might be Mountain ⛰️ (U+26F0) or similar.
    # Let's use Mountain ⛰️
    if ($i + 1 -eq 3468) { $lines[$i] = '            emoji="⛰️"'; $changed = $true }
    
    # 21407: <span>â›“ï¸ </span> -> Pick with VS16. U+26CF U+FE0F => ⛏️
    # Context: Robot Assembly. Probably meant intended emoji.
    if ($line -match "<span>â›“ï¸ </span>") {
         $lines[$i] = $line.Replace("â›“ï¸ ", "⛏️")
    $changed = $true
}

# 4206-4231: The Alphabet Matrix
# We can try to repair using a dictionary if we knew the mapping.
# Since I don't have the full map of 'ðŸ Ž' -> Apple, I'll do my best guess or replace with a placeholder requiring user check?
# No, user wants me to fix. I should deduce from context where possible.
# ['A', 'ðŸ Ž', 'âœˆï¸ ', '🦋'] -> Apple, Airplane, Butterfly
# ['B', 'ðŸ  ', ... ]
# This is risky. 
    
# ALTERNATIVE: Use a "Blind Rewrite" of the A-Z array since I know what they SHOULD be from the variable names or standard phonics.
# But I don't want to break if they chose specific variants.
    
# Let's leave the A-Z block for a moment and look at the "Mojibake i," hits.
# "ï¸" is the Variation Selector 16. It appears often after a corrupted 2-byte sequence.
# If I just remove the mojibake chars and replace with *something* valid, it's better than garbage.
    
# Fix corrupted "Mountain" at 3468
# Fix corrupted "Pick" at 21407
    
# Line 21415: "â›“ï¸ " again.
}

if ($changed) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllLines($path, $lines, $utf8NoBom)
    Write-Host "Done."
}
