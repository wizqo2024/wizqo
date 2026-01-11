import React from 'react';

export default function JoiningCursiveWorksheet() {
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Common tricky connections
    const JOINS = ['br', 'os', 've', 'wi', 'on', 'bl', 'ch', 'th', 'sh'];

    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 50;

    const renderContent = () => (
        <>
            <rect x="0" y="0" width={pageWidth} height={pageHeight} fill="#ecfeff" opacity="0.3" />
            <rect x={margin} y={margin} width={pageWidth - margin * 2} height={80} fill="white" rx="10" stroke="#bae6fd" strokeWidth="2" />
            <text x={pageWidth / 2} y={margin + 50} textAnchor="middle" fontSize="24" fontFamily="serif" fill="#0891b2">Common Letter Joins</text>

            {JOINS.map((join, i) => {
                const cols = 3;
                const rowH = 120;
                const col = i % cols;
                const row = Math.floor(i / cols);

                const x = margin + 50 + col * ((pageWidth - margin * 2) / cols);
                const y = 200 + row * rowH;

                return (
                    <g key={join}>
                        <line x1={x - 80} y1={y - 20} x2={x + 80} y2={y - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1={x - 80} y1={y + 20} x2={x + 80} y2={y + 20} stroke="#94a3b8" strokeWidth="2" />
                        <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            fontFamily="'Cedarville Cursive', cursive"
                            fontSize="64"
                            fill="#cbd5e1"
                            dominantBaseline="middle"
                        >
                            {join}
                        </text>
                        <text x={x} y={y + 50} textAnchor="middle" fontSize="32" fill="#e2e8f0" fontFamily="'Cedarville Cursive', cursive">{join} {join}</text>
                    </g>
                )
            })}
        </>
    );

    return (
        <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden border-2 border-cyan-100">
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
