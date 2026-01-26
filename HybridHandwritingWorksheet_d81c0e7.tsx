import React from 'react';

export default function HybridHandwritingWorksheet() {
    const svgRef = React.useRef<SVGSVGElement>(null);

    const WORDS = ['Hello', 'Friend', 'School', 'Write', 'Learn', 'Happy'];

    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    const renderContent = () => (
        <>
            <rect x="20" y="20" width={pageWidth - 40} height={pageHeight - 40} fill="none" stroke="#d6d3d1" strokeWidth="4" />

            {WORDS.map((word, i) => {
                const cols = 2;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const sectionW = (pageWidth - margin * 2) / cols;
                const sectionH = 150;
                const x = margin + col * sectionW + sectionW / 2;
                const y = 100 + row * sectionH;

                return (
                    <g key={word}>
                        <text x={x} y={y - 30} textAnchor="middle" fontSize="36" fontFamily="sans-serif" fontWeight="bold" fill="#57534e">{word}</text>
                        <path d={`M ${x} ${y - 10} L ${x} ${y + 10}`} stroke="#d6d3d1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        <line x1={x - 100} y1={y + 20} x2={x + 100} y2={y + 20} stroke="#a8a29e" strokeWidth="1" />
                        <line x1={x - 100} y1={y + 40} x2={x + 100} y2={y + 40} stroke="#e7e5e4" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1={x - 100} y1={y + 60} x2={x + 100} y2={y + 60} stroke="#a8a29e" strokeWidth="1" />

                        <text
                            x={x}
                            y={y + 45}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="48"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {word}
                        </text>
                    </g>
                )
            })}
        </>
    );

    return (
        <div className="w-full bg-white shadow-lg rounded-sm overflow-hidden border border-stone-200">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${pageWidth} ${pageHeight}`}
                className="w-full h-auto bg-[#fffdf5]"
            >
                {renderContent()}
            </svg>
        </div>
    );
}
