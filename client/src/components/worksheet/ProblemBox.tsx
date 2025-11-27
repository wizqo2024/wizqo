/**
 * Optional Problem Box Component
 * 
 * Reusable container for worksheet problems/tasks
 * Rounded corners, subtle border, consistent padding
 * 
 * Usage:
 * <ProblemBox>
 *   <div>Problem content here</div>
 * </ProblemBox>
 */

import React from 'react'

interface ProblemBoxProps {
  children: React.ReactNode
  enabled?: boolean
  variant?: 'default' | 'highlight' | 'minimal'
  className?: string
  style?: React.CSSProperties
}

export function ProblemBox({ 
  children, 
  enabled = true,
  variant = 'default',
  className = '',
  style = {}
}: ProblemBoxProps) {
  if (!enabled) {
    return <>{children}</>
  }

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: '#ffffff',
      border: '1px solid #d5d5d5',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '20px'
    },
    highlight: {
      backgroundColor: '#eaf4ff', // Light blue
      border: '1px solid #b3d9ff',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '20px'
    },
    minimal: {
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px'
    }
  }

  const boxStyle = {
    ...variantStyles[variant],
    ...style,
    // Print-specific adjustments
    '@media print': {
      backgroundColor: '#ffffff !important',
      pageBreakInside: 'avoid',
      breakInside: 'avoid'
    }
  } as React.CSSProperties

  return (
    <div 
      className={`problem-box problem-box-${variant} ${className}`}
      style={boxStyle}
    >
      {children}
    </div>
  )
}
