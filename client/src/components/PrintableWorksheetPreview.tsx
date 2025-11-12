import React from 'react'

interface PrintableWorksheetPreviewProps {
  docId: string
  seed?: string
  variant?: number
}

export function PrintableWorksheetPreview({ 
  docId, 
  seed,
  variant = 1 
}: PrintableWorksheetPreviewProps) {
  // Generate a stable seed for consistent previews
  const previewSeed = seed || new Date().toISOString().split('T')[0]
  
  // Create iframe URL with preview mode
  const previewUrl = `/print?doc=${encodeURIComponent(docId)}&preview=1&seed=${encodeURIComponent(previewSeed)}&variant=${variant}`
  
  return (
    <iframe
      src={previewUrl}
      className="w-full h-full border-0"
      style={{
        transform: 'scale(0.25)',
        transformOrigin: 'top left',
        width: '400%',
        height: '400%',
        pointerEvents: 'none',
      }}
      title={`Preview of ${docId}`}
    />
  )
}
