import React, { useEffect, useMemo, useRef, useState } from 'react'

// Split-layout jigsaw puzzle with tray (right) and board (left)
// Drag pieces from tray to board; pieces have interlocking (basic) jigsaw edges.

type Theme = 'Animals' | 'Nature'

const THEME_IMAGES: Record<Theme, string[]> = {
  Animals: [
    'https://images.unsplash.com/photo-1739513235237-016717c6a9b8?q=80&w=1200&auto=format&fit=crop&kidv=puzzle-animals-1',
    'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=1200&auto=format&fit=crop&kidv=puzzle-animals-2'
  ],
  Nature: [
    'https://images.unsplash.com/photo-1630207831419-3532bcb828d7?q=80&w=1200&auto=format&fit=crop&kidv=puzzle-nature-1',
    'https://plus.unsplash.com/premium_photo-1683133431252-7c37e0867d41?q=80&w=1200&auto=format&fit=crop&kidv=puzzle-nature-2'
  ]
}

type Edge = 'flat' | 'in' | 'out'
type PieceEdges = { top: Edge; right: Edge; bottom: Edge; left: Edge }

function getOpposite(edge: Edge): Edge {
  if (edge === 'in') return 'out'
  if (edge === 'out') return 'in'
  return 'flat'
}

function randomEdge(): Edge {
  return Math.random() > 0.5 ? 'in' : 'out'
}

function generateEdges(size: number): PieceEdges[][] {
  const grid: PieceEdges[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ top: 'flat', right: 'flat', bottom: 'flat', left: 'flat' as Edge }))
  )
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const top: Edge = r === 0 ? 'flat' : getOpposite(grid[r - 1][c].bottom)
      const left: Edge = c === 0 ? 'flat' : getOpposite(grid[r][c - 1].right)
      const right: Edge = c === size - 1 ? 'flat' : randomEdge()
      const bottom: Edge = r === size - 1 ? 'flat' : randomEdge()
      grid[r][c] = { top, right, bottom, left }
    }
  }
  return grid
}

function buildJigsawPath(edges: PieceEdges): string {
  // Normalized 0..100 box. Tabs are centered on each side.
  const tabDepth = 14 // how far the tab goes (+/-)
  const tabWidth = 26 // width of tab along edge
  const center = 50
  const half = tabWidth / 2
  const l = center - half
  const r = center + half

  const topS = edges.top === 'out' ? -tabDepth : edges.top === 'in' ? tabDepth : 0
  const rightS = edges.right === 'out' ? tabDepth : edges.right === 'in' ? -tabDepth : 0
  const bottomS = edges.bottom === 'out' ? tabDepth : edges.bottom === 'in' ? -tabDepth : 0
  const leftS = edges.left === 'out' ? -tabDepth : edges.left === 'in' ? tabDepth : 0

  // We draw smooth bumps using two cubic curves per side when needed
  let d = `M 0 0`
  // top
  d += ` L ${l} 0`
  if (topS !== 0) {
    d += ` C ${l + 6} 0, ${center - 6} ${topS}, ${center} ${topS}`
    d += ` C ${center + 6} ${topS}, ${r - 6} 0, ${r} 0`
  }
  d += ` L 100 0`
  // right
  d += ` L 100 ${l}`
  if (rightS !== 0) {
    d += ` C 100 ${l + 6}, ${100 + rightS} ${center - 6}, ${100 + rightS} ${center}`
    d += ` C ${100 + rightS} ${center + 6}, 100 ${r - 6}, 100 ${r}`
  }
  d += ` L 100 100`
  // bottom
  d += ` L ${r} 100`
  if (bottomS !== 0) {
    d += ` C ${r - 6} 100, ${center + 6} ${100 + bottomS}, ${center} ${100 + bottomS}`
    d += ` C ${center - 6} ${100 + bottomS}, ${l + 6} 100, ${l} 100`
  }
  d += ` L 0 100`
  // left
  d += ` L 0 ${r}`
  if (leftS !== 0) {
    d += ` C 0 ${r - 6}, ${leftS} ${center + 6}, ${leftS} ${center}`
    d += ` C ${leftS} ${center - 6}, 0 ${l + 6}, 0 ${l}`
  }
  d += ` L 0 0 Z`
  return d
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type DragPayload = { piece: number; from: 'tray' | 'board'; fromIndex?: number }

export default function PuzzleGame() {
  const size = 3 // 3x3
  const total = size * size
  const [theme, setTheme] = useState<Theme>('Animals')
  const [imgIndex, setImgIndex] = useState(0)
  const imageUrl = useMemo(
    () => THEME_IMAGES[theme][imgIndex % THEME_IMAGES[theme].length],
    [theme, imgIndex]
  )

  const [edges, setEdges] = useState<PieceEdges[][]>(() => generateEdges(size))
  const [boardSlots, setBoardSlots] = useState<number[]>(() => Array(total).fill(-1))
  const [trayPieces, setTrayPieces] = useState<number[]>(() => shuffleArray(Array.from({ length: total }, (_, i) => i)))
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [solved, setSolved] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const timerId = useRef<number | null>(null)

  useEffect(() => {
    setRunning(true)
    timerId.current = window.setInterval(() => setTime((t) => t + 1), 1000)
    return () => {
      if (timerId.current) window.clearInterval(timerId.current)
    }
  }, [])

  useEffect(() => {
    if (!running && timerId.current) {
      window.clearInterval(timerId.current)
      timerId.current = null
    }
  }, [running])

  function resetWithShuffle(newImg = false) {
    if (newImg) setImgIndex((i) => i + 1)
    setEdges(generateEdges(size))
    setBoardSlots(Array(total).fill(-1))
    setTrayPieces(shuffleArray(Array.from({ length: total }, (_, i) => i)))
    setMoves(0)
    setTime(0)
    setSolved(false)
    setRunning(true)
    if (timerId.current) window.clearInterval(timerId.current)
    timerId.current = window.setInterval(() => setTime((t) => t + 1), 1000)
  }

  function checkSolved(nextBoard: number[]) {
    const isSolved = nextBoard.every((pid, idx) => pid === idx)
    if (isSolved) {
      setSolved(true)
      setRunning(false)
    }
  }

  function onPieceDragStart(e: React.DragEvent, payload: DragPayload) {
    e.dataTransfer.setData('application/json', JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
    // Improve Safari/iOS drag image
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  function onBoardDragOver(e: React.DragEvent, slotIndex: number) {
    e.preventDefault()
    setDragOverIndex(slotIndex)
  }

  function onBoardDrop(e: React.DragEvent, toIndex: number) {
    e.preventDefault()
    setDragOverIndex(null)
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    let data: DragPayload
    try { data = JSON.parse(raw) } catch { return }
    if (data.from === 'tray') {
      const piece = data.piece
      setTrayPieces((prevTray) => prevTray.filter((p) => p !== piece))
      setBoardSlots((prevBoard) => {
        const next = [...prevBoard]
        const displaced = next[toIndex]
        next[toIndex] = piece
        if (displaced !== -1) {
          // return displaced to tray
          setTrayPieces((prev) => [...prev, displaced])
        }
        setMoves((m) => m + 1)
        checkSolved(next)
        return next
      })
    } else if (data.from === 'board' && typeof data.fromIndex === 'number') {
      const fromIndex = data.fromIndex
      if (fromIndex === toIndex) return
      setBoardSlots((prev) => {
        const next = [...prev]
        ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
        setMoves((m) => m + 1)
        checkSolved(next)
        return next
      })
    }
  }

  function onTrayDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function onTrayDrop(e: React.DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    let data: DragPayload
    try { data = JSON.parse(raw) } catch { return }
    if (data.from === 'board' && typeof data.fromIndex === 'number') {
      const fromIndex = data.fromIndex
      setBoardSlots((prev) => {
        const next = [...prev]
        const piece = next[fromIndex]
        if (piece !== -1) {
          next[fromIndex] = -1
          setTrayPieces((tray) => [...tray, piece])
          setMoves((m) => m + 1)
          checkSolved(next)
        }
        return next
      })
    }
  }

function PieceSVG({ pieceIndex, svgId }: { pieceIndex: number; svgId: string }) {
    const row = Math.floor(pieceIndex / size)
    const col = pieceIndex % size
    const d = buildJigsawPath(edges[row][col])
    const imgW = size * 100
    const imgH = size * 100
    const x = -col * 100
    const y = -row * 100
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <defs>
          <clipPath id={svgId} clipPathUnits="userSpaceOnUse">
            <path d={d} />
          </clipPath>
          <filter id={`${svgId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>
        <g style={{ filter: `url(#${svgId}-shadow)` }}>
          <image href={imageUrl} x={x} y={y} width={imgW} height={imgH} clipPath={`url(#${svgId})`} preserveAspectRatio="xMidYMid slice" />
          <path d={d} fill="none" stroke="#334155" strokeOpacity="0.45" strokeWidth={1} />
        </g>
      </svg>
    )
  }

  function SlotOutline({ slotIndex }: { slotIndex: number }) {
    const row = Math.floor(slotIndex / size)
    const col = slotIndex % size
    const d = buildJigsawPath(edges[row][col])
    return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <path d={d} fill="transparent" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
      </svg>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-100 to-pink-100 text-purple-700 text-xs font-semibold border border-pink-200">
          🧩 Puzzle
        </div>
        <select
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value as Theme)
            resetWithShuffle(false)
          }}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option>Animals</option>
          <option>Nature</option>
        </select>
        <button
          onClick={() => resetWithShuffle(true)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:opacity-90"
        >
          New Image
        </button>
        <button
          onClick={() => resetWithShuffle(false)}
          className="px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 text-sm hover:bg-purple-50"
        >
          Shuffle
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">⏱ {time}s</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">🎯 {moves} moves</span>
        </div>
      </div>

      {solved && (
        <div className="mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-800 border border-green-200 text-sm font-semibold">
            ✅ Solved! Great job!
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Board (left) */}
        <div
          className="bg-slate-50 p-3 rounded-xl border border-slate-200"
        >
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: total }, (_, slotIndex) => {
              const piece = boardSlots[slotIndex]
              const isOver = dragOverIndex === slotIndex
              return (
                <div
                  key={slotIndex}
                  className={`relative aspect-square rounded-xl border ${isOver ? 'border-purple-500 ring-2 ring-purple-300' : 'border-slate-200'} bg-white overflow-hidden`}
                  onDragOver={(e) => onBoardDragOver(e, slotIndex)}
                  onDrop={(e) => onBoardDrop(e, slotIndex)}
                >
                  {piece === -1 ? (
                    <SlotOutline slotIndex={slotIndex} />
                  ) : (
                    <div
                      role="button"
                      aria-label={`Placed piece ${piece + 1}`}
                      draggable
                      onDragStart={(e) => onPieceDragStart(e, { piece, from: 'board', fromIndex: slotIndex })}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                      <PieceSVG pieceIndex={piece} svgId={`p-${piece}-b`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tray (right) */}
        <aside className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2">Reference</div>
            <img src={imageUrl} alt="Reference" className="w-full h-40 object-contain bg-white p-2" />
          </div>

          <div
            className="rounded-xl border border-slate-200 bg-white"
            onDragOver={onTrayDragOver}
            onDrop={onTrayDrop}
          >
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 flex items-center justify-between">
              <span>Pieces Tray</span>
              <span className="text-[10px] font-medium text-slate-500">Drag to board; drop here to return</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {trayPieces.map((piece) => (
                <div
                  key={`tray-${piece}`}
                  role="button"
                  aria-label={`Tray piece ${piece + 1}`}
                  draggable
                  onDragStart={(e) => onPieceDragStart(e, { piece, from: 'tray' })}
                  className="relative aspect-square cursor-grab active:cursor-grabbing flex items-center justify-center"
                >
                  <div className="w-full h-full">
                    <PieceSVG pieceIndex={piece} svgId={`p-${piece}-t`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* solved banner moved to the top */}
    </div>
  )
}
