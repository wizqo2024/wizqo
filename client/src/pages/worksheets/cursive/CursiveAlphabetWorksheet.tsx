import React from 'react';

export default function CursiveAlphabetWorksheet() {
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Layout Constants
    const pageWidth = 842; // A4 Landscape
    const pageHeight = 595;
    const margin = 40;

    const alphabet = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz".split(' ');

    const renderContent = () => (
        <>
            {/* Vintage Border */}
            <rect x="20" y="20" width={pageWidth - 40} height={pageHeight - 40} fill="none" stroke="#94a3b8" strokeWidth="2" />
            <rect x="24" y="24" width={pageWidth - 48} height={pageHeight - 48} fill="none" stroke="#cbd5e1" strokeWidth="1" />

            {/* Header */}
            <text x={pageWidth / 2} y={60} textAnchor="middle" fontSize="32" fontFamily="serif" fill="#1e293b" fontWeight="bold">Cursive Alphabet</text>

            {/* Grid Layout for Alphabet */}
            {alphabet.map((pair, index) => {
                const cols = 7;
                const cellWidth = (pageWidth - margin * 2) / cols;
                const cellHeight = (pageHeight - 100 - margin) / 4; // 4 rows

                const col = index % cols;
                const row = Math.floor(index / cols);

                const x = margin + col * cellWidth + cellWidth / 2;
                const y = 110 + row * cellHeight;

                if (index >= 26) return null;

                return (
                    <g key={pair}>
                        <line x1={x - 40} y1={y - 15} x2={x + 40} y2={y - 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" />
                        <line x1={x - 40} y1={y + 15} x2={x + 40} y2={y + 15} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" />
                        <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="42"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {pair}
                        </text>
                    </g>
                );
            })}

            {/* Decorative Footer */}
            <text x={pageWidth / 2} y={pageHeight - 30} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#64748b" italic="true">Practice makes progress.</text>
        </>
    );

    return (
        <div className="w-full bg-white rounded-sm shadow-2xl overflow-hidden border-[16px] border-[#f1f5f9]">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                className="w-full h-auto bg-[#fffaf0]"
            >
                {renderContent()}
            </svg>
        </div>
    );
}
