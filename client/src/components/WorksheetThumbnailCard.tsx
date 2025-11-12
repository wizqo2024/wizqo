import React from 'react'
import { PrintableWorksheetThumbnail } from './PrintableWorksheetThumbnail'

interface WorksheetThumbnailCardProps {
  title: string
  description: string
  href: string
  docId?: string
  previewContent?: React.ReactNode
  emoji?: string
}

export function WorksheetThumbnailCard({ 
  title, 
  description, 
  href, 
  docId,
  previewContent,
  emoji 
}: WorksheetThumbnailCardProps) {
  // Extract docId from href if not provided
  const extractedDocId = docId || (href.includes('doc=') ? new URLSearchParams(href.split('?')[1] || '').get('doc') || '' : '')
  
  // Use previewContent if provided, otherwise use PrintableWorksheetThumbnail
  const actualPreviewContent = previewContent || (extractedDocId ? <PrintableWorksheetThumbnail docId={extractedDocId} /> : null)
  const CARD_CLASS = 'bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col'
  const BUTTON_CLASS = 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium'
  const OUTLINE_BUTTON = 'inline-flex items-center justify-center px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium'

  return (
    <article className={CARD_CLASS}>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900 mb-1">{title}</div>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
        
        {/* Worksheet Thumbnail Preview */}
        <div 
          className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
          onClick={() => window.location.href = href}
          style={{ 
            height: '140px',
            aspectRatio: '2.5/1',
          }}
        >
          {actualPreviewContent ? (
            <>
              {/* Thumbnail content container */}
              <div className="absolute inset-0 p-3 overflow-hidden">
                <div 
                  className="bg-white rounded shadow-sm"
                  style={{
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    width: '400%',
                    height: 'auto',
                    minHeight: '400%',
                    pointerEvents: 'none',
                  }}
                >
                  <div className="bg-white p-4" style={{ width: '100%' }}>
                    {actualPreviewContent}
                  </div>
                </div>
              </div>
              {/* Gradient fade at bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 pointer-events-none" />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-purple-700 border-2 border-purple-300 shadow-lg pointer-events-auto">
                  👁️ Click to view worksheet
                </div>
              </div>
              {/* Corner fold effect */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{emoji || '📄'}</div>
                <p className="text-xs text-slate-400 font-medium">Worksheet Preview</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-auto">
          <a 
            href={href} 
            className={OUTLINE_BUTTON}
            aria-label={`Open ${title} printable view`}
            onClick={(e) => e.stopPropagation()}
          >
            Open view →
          </a>
          <a 
            href={href + (href.includes('?') ? '&autoprint=1' : '?autoprint=1')} 
            className={BUTTON_CLASS}
            aria-label={`Download ${title} as PDF`}
            onClick={(e) => e.stopPropagation()}
          >
            ⬇️ Download PDF
          </a>
        </div>
      </div>
    </article>
  )
}
