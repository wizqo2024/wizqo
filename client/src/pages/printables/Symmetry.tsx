import React from 'react'
import { makeRng } from '../PrintablesPage'

interface SymmetryProps {
    type: 'Draw Line' | 'Is Symmetrical?'
    seed: string
    showAnswers?: boolean
}

export const Symmetry: React.FC<SymmetryProps> = ({ type, seed, showAnswers }) => {
    const rng = makeRng(seed)
    const isSymmetrical = type === 'Draw Line' ? true : rng() > 0.5

    // For "Is Symmetrical?", if it's NOT symmetrical, we need to draw a wrong line
    // Types of wrong lines:
    // 1. Off-center vertical
    // 2. Horizontal
    // 3. Diagonal
    let lineType = 'vertical' // default correct
    let lineX = 50
    let lineY = 50
    let rotation = 0

    if (type === 'Is Symmetrical?' && !isSymmetrical) {
        const errorType = Math.floor(rng() * 3)
        if (errorType === 0) {
            // Off-center vertical
            lineX = rng() > 0.5 ? 35 : 65
        } else if (errorType === 1) {
            // Horizontal
            lineType = 'horizontal'
            rotation = 90
        } else {
            // Diagonal
            lineType = 'diagonal'
            rotation = 45
        }
    }

    return (
        <div className="flex flex-col items-center p-6 border-2 border-pink-100 rounded-xl bg-pink-50 break-inside-avoid">
            <div className="relative w-32 h-32">
                {/* Butterfly SVG Base */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Left Wing */}
                    <path d="M 50 20 Q 10 0 10 40 Q 10 80 50 80" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
                    {/* Right Wing */}
                    <path d="M 50 20 Q 90 0 90 40 Q 90 80 50 80" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
                    {/* Body */}
                    {/* Body - lighter for "Draw Line" to avoid looking like a pre-drawn answer */}
                    <rect
                        x="47"
                        y="20"
                        width="6"
                        height="60"
                        rx="3"
                        fill={type === 'Draw Line' ? '#fbcfe8' : '#831843'}
                        stroke={type === 'Draw Line' ? '#db2777' : 'none'}
                        strokeWidth={type === 'Draw Line' ? '1' : '0'}
                    />
                </svg>

                {type === 'Is Symmetrical?' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-0.5 h-full bg-slate-800 border-l-2 border-dashed border-slate-800"
                            style={{
                                transform: `rotate(${rotation}deg) translateX(${lineX - 50}px)`,
                                height: '100%',
                                position: 'absolute'
                            }}
                        ></div>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center w-full">
                <p className="text-sm font-bold text-pink-900 mb-2">
                    {type === 'Draw Line' ? 'Draw the line of symmetry' : 'Is the line a line of symmetry?'}
                </p>

                {type === 'Is Symmetrical?' ? (
                    <div className="flex justify-center gap-4">
                        <div className={`w-12 h-8 border border-pink-300 bg-white rounded flex items-center justify-center text-xs ${showAnswers && isSymmetrical ? 'font-bold text-green-600 ring-2 ring-green-400' : 'text-slate-300'}`}>Yes</div>
                        <div className={`w-12 h-8 border border-pink-300 bg-white rounded flex items-center justify-center text-xs ${showAnswers && !isSymmetrical ? 'font-bold text-green-600 ring-2 ring-green-400' : 'text-slate-300'}`}>No</div>
                    </div>
                ) : (
                    // Specific valid line check for visual debugging if needed, but not shown to user
                    showAnswers && <p className="text-[10px] text-slate-400 mt-1">Draw vertical line down center</p>
                )}
            </div>
        </div>
    )
}
