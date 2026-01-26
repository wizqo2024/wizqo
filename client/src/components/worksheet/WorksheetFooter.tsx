/**
 * Optional Worksheet Footer Component
 * 
 * Professional footer with website URL, copyright, and page numbers
 * Only renders when enabled via props
 * 
 * Usage:
 * <WorksheetFooter enabled={true} currentPage={1} totalPages={2} />
 */

import { WizqoLogo } from '../WizqoLogo'

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
        lineHeight: '1.5',
        pageBreakBefore: 'auto',
        breakBefore: 'auto'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <WizqoLogo className="w-8 h-auto opacity-70" />
          <a
            href="https://www.wizqo.com"
            style={{
              color: '#4845D2',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '11pt'
            }}
          >
            www.wizqo.com
          </a>
        </div>
        {showCopyright && (
          <div style={{ fontSize: '9pt', color: '#94a3b8' }}>
            Copyright © {new Date().getFullYear()} Wizqo. All rights reserved.
          </div>
        )}
        {currentPage && totalPages && totalPages > 1 && (
          <div style={{ fontSize: '9pt', color: '#94a3b8' }}>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  )
}
