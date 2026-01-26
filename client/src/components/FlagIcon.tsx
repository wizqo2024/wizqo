// Flag Icon Component - SVG flags for language selector
import React from 'react'

interface FlagIconProps {
  code: 'en' | 'es' | 'ar'
  className?: string
}

export function FlagIcon({ code, className = 'w-6 h-4' }: FlagIconProps) {
  const flags = {
    en: (
      <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        {/* US Flag - Red and white stripes */}
        <rect width="60" height="30" fill="#B22234"/>
        <rect y="0" width="60" height="4.29" fill="#FFFFFF"/>
        <rect y="8.57" width="60" height="4.29" fill="#FFFFFF"/>
        <rect y="17.14" width="60" height="4.29" fill="#FFFFFF"/>
        <rect y="25.71" width="60" height="4.29" fill="#FFFFFF"/>
        {/* Blue canton */}
        <rect width="24" height="16.15" fill="#3C3B6E"/>
      </svg>
    ),
    es: (
      <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        {/* Spain Flag - Red, yellow, red */}
        <rect width="60" height="13.33" fill="#AA151B"/>
        <rect y="13.33" width="60" height="13.33" fill="#F1BF00"/>
        <rect y="26.67" width="60" height="13.33" fill="#AA151B"/>
      </svg>
    ),
    ar: (
      <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        {/* Saudi Arabia Flag - Green with white Arabic text and sword */}
        <rect width="60" height="40" fill="#006C35"/>
        {/* Simplified white text area */}
        <rect x="0" y="15" width="60" height="10" fill="#FFFFFF" opacity="0.3"/>
        <text x="30" y="25" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontFamily="Arial, sans-serif">☪</text>
      </svg>
    ),
  }

  return flags[code] || flags.en
}
