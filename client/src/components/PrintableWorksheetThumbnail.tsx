import React from 'react'

interface PrintableWorksheetThumbnailProps {
  docId: string
}

// Render a simplified preview of the worksheet
export function PrintableWorksheetThumbnail({ docId }: PrintableWorksheetThumbnailProps) {
  // Map docId to preview content
  const previews: Record<string, React.ReactNode> = {
    'ten-frames-1-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Ten Frames 1–10</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border rounded p-2">
              <div className="text-xs mb-1">{n}</div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded ${i < n ? 'bg-purple-500' : 'border border-gray-300'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    'number-tracing-1-20': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Number Tracing</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border rounded p-2 text-center">
              <div className="text-lg font-bold">{n}</div>
              <div className="text-xs text-gray-500 mt-1">Trace</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'number-bonds-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Number Bonds to 10</h3>
        <div className="space-y-2">
          {[3, 4, 5].map((n) => (
            <div key={n} className="border rounded p-2 text-center">
              <div className="text-sm">{n} + __ = 10</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'count-write-30': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Count & Write</h3>
        <div className="grid grid-cols-3 gap-2">
          {[3, 5, 7].map((n) => (
            <div key={n} className="border rounded p-2 text-center">
              <div className="flex justify-center gap-1 mb-1">
                {Array.from({ length: n }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-purple-500 rounded-full" />
                ))}
              </div>
              <div className="text-xs">__</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'missing-numbers-50': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Missing Numbers</h3>
        <div className="text-sm">
          <div>10, __, 12, 13, __</div>
          <div>20, 21, __, 23, __</div>
        </div>
      </div>
    ),
    'addition-subtraction-0-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Add/Sub within 10</h3>
        <div className="space-y-1 text-sm">
          <div>3 + 4 = __</div>
          <div>7 - 2 = __</div>
          <div>5 + 2 = __</div>
        </div>
      </div>
    ),
    'math-maze': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Math Maze</h3>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border rounded p-1 text-center bg-white">
              {i === 0 ? 'S' : i === 15 ? 'E' : i % 4 === 0 ? '✓' : ''}
            </div>
          ))}
        </div>
      </div>
    ),
    'picture-addition-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Picture Addition</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex gap-1">
              <span>●</span><span>●</span><span>●</span>
            </span>
            <span>+</span>
            <span className="flex gap-1">
              <span>●</span><span>●</span>
            </span>
            <span>= __</span>
          </div>
        </div>
      </div>
    ),
    'subtraction-stories': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Subtraction Stories</h3>
        <div className="space-y-2">
          <div className="text-xs border rounded p-2">
            <div>8 apples, 3 eaten</div>
            <div className="mt-1">8 - 3 = __</div>
          </div>
        </div>
      </div>
    ),
    'balance-equations-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Balance Equations</h3>
        <div className="text-sm space-y-1">
          <div>3 + 2 = __ + 1</div>
          <div>5 + __ = 4 + 3</div>
        </div>
      </div>
    ),
    'skip-count-2s': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Skip Count by 2s</h3>
        <div className="text-sm">2, 4, __, 8, __, 12</div>
      </div>
    ),
    'number-line-add': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Number Line</h3>
        <div className="text-xs">
          <div>0---5---10---15</div>
          <div className="mt-1">3 + 4 = __</div>
        </div>
      </div>
    ),
    'doubles-facts': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Doubles Facts</h3>
        <div className="text-sm space-y-1">
          <div>1 + 1 = __</div>
          <div>2 + 2 = __</div>
          <div>3 + 3 = __</div>
        </div>
      </div>
    ),
    'pattern-complete': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Patterns</h3>
        <div className="flex gap-1 text-lg">
          <span>🔴</span><span>🔵</span><span>🔴</span><span>🔵</span><span>__</span>
        </div>
      </div>
    ),
    'missing-shape': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Missing Shape</h3>
        <div className="flex gap-2 text-2xl">
          <span>⬜</span><span>🔵</span><span>⬜</span><span>__</span>
        </div>
      </div>
    ),
    'size-comparison': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Size Comparison</h3>
        <div className="text-sm space-y-1">
          <div>Big ⚫ Small ⚪</div>
          <div>Long ═ Short ─</div>
        </div>
      </div>
    ),
    'spot-difference': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Spot the Difference</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2 text-center text-xs">Image A</div>
          <div className="border rounded p-2 text-center text-xs">Image B</div>
        </div>
      </div>
    ),
    'shapes-colors-sort': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Shapes & Colors</h3>
        <div className="flex gap-2 text-xl">
          <span>🔴⬜</span><span>🔵⬜</span>
        </div>
      </div>
    ),
    'dot-to-dot-1-20': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Dot to Dot</h3>
        <div className="text-xs">
          <div>Connect 1→2→3...</div>
          <div className="mt-1">● ● ●</div>
        </div>
      </div>
    ),
    'place-value-hto': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Place Value</h3>
        <div className="text-sm space-y-1">
          <div>23 = __ tens + __ ones</div>
          <div>45 = __ tens + __ ones</div>
        </div>
      </div>
    ),
    'skip-count-5-10-120': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Skip Count 5s/10s</h3>
        <div className="text-sm">5, 10, 15, __, 25</div>
      </div>
    ),
    'expanded-form-200': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Expanded Form</h3>
        <div className="text-sm space-y-1">
          <div>45 = 40 + __</div>
          <div>123 = 100 + 20 + __</div>
        </div>
      </div>
    ),
    'number-patterns-200': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Number Patterns</h3>
        <div className="text-sm">10, 20, 30, __, 50</div>
      </div>
    ),
    'rounding-nearest-10': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Rounding to 10</h3>
        <div className="text-sm space-y-1">
          <div>23 rounds to __</div>
          <div>37 rounds to __</div>
        </div>
      </div>
    ),
    'add-2digit-100': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">2-Digit Addition</h3>
        <div className="text-sm space-y-1">
          <div>23 + 45 = __</div>
          <div>12 + 34 = __</div>
        </div>
      </div>
    ),
    'sub-2digit-100': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">2-Digit Subtraction</h3>
        <div className="text-sm space-y-1">
          <div>45 - 23 = __</div>
          <div>67 - 34 = __</div>
        </div>
      </div>
    ),
    'add-three-numbers': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Add 3 Numbers</h3>
        <div className="text-sm space-y-1">
          <div>3 + 4 + 2 = __</div>
          <div>5 + 2 + 3 = __</div>
        </div>
      </div>
    ),
    'missing-addends': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Missing Addends</h3>
        <div className="text-sm space-y-1">
          <div>5 + __ = 10</div>
          <div>__ + 3 = 8</div>
        </div>
      </div>
    ),
    'fact-families-20': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Fact Families</h3>
        <div className="text-sm space-y-1">
          <div>3 + 4 = 7</div>
          <div>4 + 3 = 7</div>
          <div>7 - 3 = __</div>
        </div>
      </div>
    ),
    'mental-math-20': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Mental Math</h3>
        <div className="text-sm space-y-1">
          <div>8 + 5 = __</div>
          <div>12 - 7 = __</div>
        </div>
      </div>
    ),
    'number-line-200': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Number Line to 200</h3>
        <div className="text-xs">0---50---100---150---200</div>
      </div>
    ),
    'doubles-near-doubles': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Doubles & Near</h3>
        <div className="text-sm space-y-1">
          <div>4 + 4 = __</div>
          <div>4 + 5 = __</div>
        </div>
      </div>
    ),
    'money-coins-bills': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Money</h3>
        <div className="text-sm space-y-1">
          <div>💰 💰 💰 = __¢</div>
          <div>💵 💵 = $__</div>
        </div>
      </div>
    ),
    'measurement-length': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Measurement</h3>
        <div className="text-sm space-y-1">
          <div>Longer: ═══ or ─</div>
          <div>Shorter: ═ or ─</div>
        </div>
      </div>
    ),
    'bar-graphs-data': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Bar Graph</h3>
        <div className="text-xs">
          <div>Apples: ████</div>
          <div>Oranges: ██</div>
        </div>
      </div>
    ),
    'even-odd-100': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Even/Odd</h3>
        <div className="text-sm space-y-1">
          <div>Even: 2, 4, 6, __</div>
          <div>Odd: 1, 3, 5, __</div>
        </div>
      </div>
    ),
    'time-5min': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Time</h3>
        <div className="text-sm space-y-1">
          <div>🕐 3:00</div>
          <div>🕑 3:05</div>
        </div>
      </div>
    ),
    'word-problems-100': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Word Problems</h3>
        <div className="text-xs space-y-1">
          <div>Tom has 5 apples...</div>
          <div>How many total? __</div>
        </div>
      </div>
    ),
    'compare-2digit': (
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">Compare Numbers</h3>
        <div className="text-sm space-y-1">
          <div>23 __ 32</div>
          <div>45 __ 40</div>
        </div>
      </div>
    ),
  }

  const preview = previews[docId]
  
  if (!preview) {
    // Fallback for unknown worksheets
    return (
      <div className="p-4 text-center">
        <div className="text-2xl mb-2">📄</div>
        <div className="text-xs text-slate-400">Worksheet Preview</div>
      </div>
    )
  }

  return <div className="bg-white">{preview}</div>
}
