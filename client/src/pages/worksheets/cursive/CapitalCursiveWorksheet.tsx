import React from 'react';

export default function CapitalCursiveWorksheet() {
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Layout Constants
    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    // The "Tricky" Letters
    const TRICKY_LETTERS = ['Z', 'G', 'F', 'Q', 'I', 'J'];

    const renderContent = () => (
        <>
            <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                </pattern>
            </defs>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="url(#grid)" />

            {/* Title */}
            <rect x="0" y="0" width={pageWidth} height="80" fill="#fff7ed" />
            <text x={pageWidth / 2} y={50} textAnchor="middle" fontSize="24" fontFamily="serif" fill="#c2410c" fontWeight="bold">The Tricky Capitals</text>

            {TRICKY_LETTERS.map((char, i) => {
                const cols = 3;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const sectionW = (pageWidth - margin * 2) / cols;
                const sectionH = 220;
                const x = margin + col * sectionW + sectionW / 2;
                const y = 160 + row * sectionH;

                return (
                    <g key={char}>
                        <rect x={x - 60} y={y - 80} width="120" height="160" fill="none" stroke="#fed7aa" strokeWidth="2" rx="10" />
                        <line x1={x - 50} y1={y - 20} x2={x + 50} y2={y - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1={x - 50} y1={y + 20} x2={x + 50} y2={y + 20} stroke="#94a3b8" strokeWidth="2" />
                        <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="100"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {char}
                        </text>
                        <text x={x} y={y + 100} textAnchor="middle" fontSize="14" fill="#64748b" fontFamily="sans-serif">Practice {char}</text>
                    </g>
                )
            })}
        </>
    );

    return (
        <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                className="w-full h-auto bg-white"
            >
                {renderContent()}
            </svg>
        </div>
    );
}
