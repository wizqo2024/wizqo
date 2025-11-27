/**
 * Optional Worksheet Footer Component
 * 
 * Professional footer with website URL, copyright, and page numbers
 * Only renders when enabled via props
 * 
 * Usage:
 * <WorksheetFooter enabled={true} currentPage={1} totalPages={2} />
 */

import React from 'react'

interface WorksheetFooterProps {
  enabled?: boolean
  currentPage?: number
  totalPages?: number
  showCopyright?: boolean
  className?: string
}

export function WorksheetFooter({ 
  enabled = false,
  currentPage,
  totalPages,
  showCopyright = true,
  className = ''
}: WorksheetFooterProps) {
  if (!enabled) return null

  return (
    <div 
      className={`worksheet-footer-optional mt-8 print:mt-6 ${className}`}
      style={{
        borderTop: '1px solid #e2e8f0',
        paddingTop: '12px',
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '10pt',
        color: '#666',
        lineHeight: '1.5'
      }}
    >
      <div style={{ marginBottom: '4px' }}>
        <a 
          href="https://www.wizqo.com" 
          style={{ 
            color: '#666', 
            textDecoration: 'none',
            borderBottom: 'none'
          }}
        >
          www.wizqo.com
        </a>
      </div>
      {showCopyright && (
        <div style={{ marginBottom: '4px', fontSize: '9pt' }}>
          Copyright © {new Date().getFullYear()} Wizqo. All rights reserved.
        </div>
      )}
      {currentPage && totalPages && totalPages > 1 && (
        <div style={{ fontSize: '9pt' }}>
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  )
}
