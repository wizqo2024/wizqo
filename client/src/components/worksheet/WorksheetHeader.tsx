/**
 * Optional Worksheet Header Component
 * 
 * Professional header with Name, Date, Grade, Teacher, Score fields
 * Only renders when enabled via props
 * 
 * Usage:
 * <WorksheetHeader enabled={true} />
 */

import React from 'react'

interface WorksheetHeaderProps {
  enabled?: boolean
  showScore?: boolean
  className?: string
}

export function WorksheetHeader({
  enabled = false,
  showScore = true,
  className = ''
}: WorksheetHeaderProps) {
  if (!enabled) return null

  return (
    <div
      className={`worksheet-header-optional mb-6 print:mb-4 ${className}`}
      style={{
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px',
        marginBottom: '20px',
        fontSize: '13pt',
        lineHeight: '1.4',
        color: '#333'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Left side: Name and Date */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Name:</strong> <span style={{ borderBottom: '1px solid #333', minWidth: '200px', display: 'inline-block', marginLeft: '8px' }}>&nbsp;</span>
          </div>
          <div>
            <strong>Date:</strong> <span style={{ borderBottom: '1px solid #333', minWidth: '120px', display: 'inline-block', marginLeft: '8px' }}>&nbsp;</span>
          </div>
        </div>

        {/* Right side: Grade, Teacher, Score */}
        <div style={{ flex: '1', minWidth: '200px', textAlign: 'right' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Grade:</strong> <span style={{ borderBottom: '1px solid #333', minWidth: '60px', display: 'inline-block', marginLeft: '8px' }}>&nbsp;</span>
          </div>
          {showScore && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Score:</strong> <span style={{ borderBottom: '1px solid #333', minWidth: '40px', display: 'inline-block', marginLeft: '8px' }}>&nbsp;</span>
              {' / '}
              <span style={{ borderBottom: '1px solid #333', minWidth: '40px', display: 'inline-block', marginLeft: '4px' }}>&nbsp;</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
