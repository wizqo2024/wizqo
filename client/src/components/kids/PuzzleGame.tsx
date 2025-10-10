import React, { useEffect, useMemo, useRef, useState } from 'react'

// Simple drag-and-drop picture puzzle (3x3) with kid-friendly UI
// Swap any two tiles by dragging one over the other.

type Theme = 'Animals' | 'Nature'

const THEME_IMAGES: Record<Theme, string[]> = {
  Animals: [
    'https://plus.unsplash.com/premium_photo-1720694751690-ab68c805bf36?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1668294141622-18e9998a00f6?q=80&w=1200&auto=format&fit=crop'
  ],
  Nature: [
    'https://plus.unsplash.com/premium_photo-1727009856408-0ed31ef1e28d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628308256890-e4ca276dc489?q=80&w=1200&auto=format&fit=crop'
  ]
}

export default function PuzzleGame() {
  const size = 3 // 3x3
  const total = size * size
  const [theme, setTheme] = useState<Theme>('Animals')
  const [imgIndex, setImgIndex] = useState(0)
  const imageUrl = useMemo(() => THEME_IMAGES[theme][imgIndex % THEME_IMAGES[theme].length], [theme, imgIndex])

  const [tiles, setTiles] = useState<number[]>(() => Array.from({ length: total }, (_, i) => i))
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [solved, setSolved] = useState(false)
  const timerId = useRef<number | null>(null)

  useEffect(() => {
    shuffle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (running) {
      timerId.current = window.setInterval(() => setTime((t) => t + 1), 1000)
    }
    return () => {
      if (timerId.current) window.clearInterval(timerId.current)
    }
  }, [running])

  const shuffle = () => {
    const arr = Array.from({ length: total }, (_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    if (arr.every((v, i) => v === i)) {
      // ensure not already solved
      ;[arr[0], arr[1]] = [arr[1], arr[0]]
    }
    setTiles(arr)
    setMoves(0)
    setTime(0)
    setSolved(false)
    setRunning(true)
  }

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>, fromIndex: number) => {
    e.dataTransfer.setData('text/plain', String(fromIndex))
    // for iOS Safari
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    e.dataTransfer.setDragImage?.(new Image(), 0, 0)
  }

  const onDropSwap = (e: React.DragEvent<HTMLButtonElement>, toIndex: number) => {
    e.preventDefault()
    const fromIndexStr = e.dataTransfer.getData('text/plain')
    if (!fromIndexStr) return
    const fromIndex = Number(fromIndexStr)
    if (Number.isNaN(fromIndex) || fromIndex === toIndex) return
    setTiles((prev) => {
      const next = [...prev]
      ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
      const newMoves = moves + 1
      setMoves(newMoves)
      const isSolved = next.every((v, i) => v === i)
      if (isSolved) {
        setSolved(true)
        setRunning(false)
        if (timerId.current) window.clearInterval(timerId.current)
      }
      return next
    })
  }

  const onDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  const tileSizePercent = 100 / size

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
            setImgIndex(0)
            shuffle()
          }}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option>Animals</option>
          <option>Nature</option>
        </select>
        <button
          onClick={() => {
            setImgIndex((i) => i + 1)
            shuffle()
          }}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:opacity-90"
        >
          New Image
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">⏱ {time}s</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">🎯 {moves} moves</span>
          <button onClick={shuffle} className="ml-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">Shuffle</button>
        </div>
      </div>

      <div
        className="grid gap-1 bg-slate-50 p-3 rounded-xl border border-slate-200"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {tiles.map((tileValue, tileIndex) => {
          const row = Math.floor(tileValue / size)
          const col = tileValue % size
          const bgPosX = (col * 100) / (size - 1)
          const bgPosY = (row * 100) / (size - 1)
          return (
            <button
              key={`${tileValue}-${tileIndex}`}
              draggable
              onDragStart={(e) => onDragStart(e, tileIndex)}
              onDragOver={onDragOver}
              onDrop={(e) => onDropSwap(e, tileIndex)}
              aria-label={`Tile ${tileIndex + 1}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${size * 100}% ${size * 100}%`,
                backgroundPosition: `${bgPosX}% ${bgPosY}%`
              }}
            >
              {/* optional overlay */}
            </button>
          )
        })}
      </div>

      {solved && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-800 border border-green-200 text-sm font-semibold">
            ✅ Solved! Great job!
          </div>
        </div>
      )}
    </div>
  )
}
