/**
 * Universal Worksheet Layout Component
 * 
 * Provides three layout modes:
 * - free: Freeform layout (default, current system)
 * - 1col: Single column for reading/long content
 * - 2col: Two-column grid for repetitive problems
 * 
 * Usage:
 * <WorksheetLayout mode="2col">
 *   {problems}
 * </WorksheetLayout>
 */

import React from 'react'

type LayoutMode = 'free' | '1col' | '2col'

interface WorksheetLayoutProps {
  children: React.ReactNode
  mode?: LayoutMode
  gap?: number // Gap between items in pixels
  className?: string
}

export function WorksheetLayout({ 
  children, 
  mode = 'free',
  gap = 24,
  className = ''
}: WorksheetLayoutProps) {
  // Free mode: no layout constraints (current system)
  if (mode === 'free') {
    return <div className={`worksheet-layout-free ${className}`}>{children}</div>
  }

  // Single column: centered, max width
  if (mode === '1col') {
    return (
      <div 
        className={`worksheet-layout-1col ${className}`}
        style={{
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`
        }}
      >
        {children}
      </div>
    )
  }

  // Two column: grid layout for repetitive problems
  if (mode === '2col') {
    return (
      <div 
        className={`worksheet-layout-2col ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: `${gap}px`,
          // Responsive: single column on small screens
          '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr'
          }
        } as React.CSSProperties}
      >
        {children}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}
