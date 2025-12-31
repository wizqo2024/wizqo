import React from 'react';
import { WorksheetSectionWrapper } from './PrintablesPage';
import { makeRng } from '@/utils/printableUtils';

interface GeographyWorksheetsProps {
    docId: string;
    commonProps: {
        activeDocs: string[];
        showAnswers: boolean;
        docTitle: string;
        effectiveSeed: string;
        variant: number;
        showAnswersForDoc: (id: string, render: () => React.ReactNode) => React.ReactNode;
        t: (key: string, fallback?: string) => string;
        getTrans: (key: string, fallback?: string) => string;
    };
}

export const GeographyWorksheets: React.FC<GeographyWorksheetsProps> = ({ docId, commonProps }) => {
    const { activeDocs, effectiveSeed, variant, showAnswersForDoc, t, getTrans } = commonProps;

    // Only render if this doc is active
    if (!activeDocs.includes(docId)) return null;

    if (docId === 'geo-continents-k2') {
        return (
            <WorksheetSectionWrapper
                docId="geo-continents-k2"
                title="World Explorer: The 7 Continents"
                emoji={String.fromCodePoint(0x1F30D)}
                description="Color the map and trace the continent names. Can you find where you live?"
                problemCount={7}
                learningObjectives={[
                    'Identify and name the 7 continents',
                    'Associate continents with colors on a map',
                    'Practice tracing geographic names',
                    'Develop basic map reading skills'
                ]}
                parentTeacherTips={[
                    'Sing the "7 Continents Song" to help remember them.',
                    'Discuss which continent you live on and point to it.',
                    'Use the colors to help distinguish borders between continents.'
                ]}
            >
                {/* Map Header */}
                <div className="print:hidden w-full h-12 mb-2 relative overflow-hidden bg-sky-100 rounded-lg flex items-center justify-center">
                    <div className="font-bold text-xl text-sky-700">{String.fromCodePoint(0x279C)}</div>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 bg-sky-50/30 break-inside-avoid">
                    <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-sm" role="img" aria-labelledby="continents-title">
                        <title id="continents-title">World map outline with 7 continents for coloring</title>

                        {/* Ocean Background Pattern (Subtle waves) */}
                        <pattern id="ocean-waves" x="0" y="0" width="50" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,10 Q12.5,0 25,10 T50,10" fill="none" stroke="#e0f2fe" strokeWidth="2" />
                        </pattern>
                        <rect x="0" y="0" width="800" height="500" fill="url(#ocean-waves)" opacity="0.5" rx="8" />

                        {/* Compass Rose */}
                        <g transform="translate(680, 400)">
                            <circle cx="0" cy="0" r="45" fill="white" stroke="#94a3b8" strokeWidth="2" />
                            <path d="M0,-35 L10,-10 L35,0 L10,10 L0,35 L-10,10 L-35,0 L-10,-10 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                            <text x="0" y="-40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">N</text>
                            <text x="0" y="52" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">S</text>
                            <text x="50" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">E</text>
                            <text x="-50" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">W</text>
                        </g>

                        {/* Use a standard world map ratio */}
                        <svg viewBox="0 0 1000 650" className="w-full h-full drop-shadow-lg">
                            {/* Water Background */}
                            <defs>
                                <pattern id="geo-water-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M0,10 Q5,5 10,10 T20,10" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.5" />
                                </pattern>
                            </defs>
                            <rect width="1000" height="650" fill="url(#geo-water-pattern)" opacity="0.6" />

                            <g fill="white" stroke="#334155" strokeWidth="2" strokeLinejoin="round" className="continent-shapes">
                                {/* 1. North America */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    <path d="M120,50 L250,30 L350,20 L320,80 L400,60 L350,150 L280,140 L280,180 L250,230 L260,280 L230,320 L200,280 L180,260 L150,250 L120,200 L110,150 L80,120 L50,110 L40,80 L80,70 L100,50 Z M280,30 L380,20 L360,50 Z"
                                        title="North America" />
                                    {/* Detailed NA Trace: Alaska, Canada, Hudson Bay, East Coast, Florida, Gulf, Mexico, Baja, West Coast */}
                                    {/* Simplified for worksheet but recognizable */}
                                    <path d="M170,80 L220,70 L260,60 L280,90 L330,80 L320,130 L290,140 L300,160 L290,190 L270,190 L260,220 L240,240 L220,280 L200,280 L180,240 L160,220 L150,180 L130,160 L100,140 L80,120 L120,90 L150,100 L170,80 Z"
                                        style={{ display: 'none' }} /> {/* Placeholder for logic */}

                                    {/* ACTUAL PATH - Hand-tuned for recognition */}
                                    <path d="M 160,80 L 220,70 L 290,50 L 330,80 L 300,120 L 320,140 L 300,170 L 280,180 L 270,220 L 250,250 L 240,290 L 220,310 L 190,260 L 160,250 L 140,200 L 120,160 L 80,120 L 110,90 Z" />

                                    {/* Better tracing approx */}
                                    <path d="M 70,80 L 120,70 L 160,100 L 210,50 L 280,40 L 320,60 L 300,100 L 330,120 L 310,160 L 290,160 L 280,180 L 270,200 L 260,230 L 270,250 L 240,260 L 230,310 L 200,270 L 180,250 L 160,250 L 140,200 L 120,160 L 60,110 Z" />

                                    {/* Removing old paths and using this new one for NA */}
                                    {/* North America: Alaska(60,80), Canadian Arch(200,40), Greenland(320,50), Newfoundland(320,150), Florida(260,230), Baja(140,220) */}
                                    <path d="M 80,90 L 120,80 L 180,50 L 260,40 L 310,50 L 350,30 L 330,100 L 350,140 L 310,160 L 290,150 L 280,190 L 260,220 L 270,250 L 230,260 L 220,300 L 190,260 L 170,250 L 150,220 L 130,230 L 140,190 L 120,160 L 90,140 L 60,100 Z" />

                                    <circle cx="210" cy="150" r="18" fill="white" stroke="#334155" />
                                    <text x="210" y="156" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">1</text>
                                </g>

                                {/* 2. South America */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    {/* South America: Isthmus(230,300), Bulge(350,380), Horn(280,550), Peru bulge(210,380) */}
                                    <path d="M 230,300 L 280,300 L 330,330 L 360,370 L 340,440 L 300,500 L 280,550 L 260,530 L 240,460 L 210,380 L 210,340 L 230,300 Z" />
                                    <circle cx="280" cy="400" r="18" fill="white" stroke="#334155" />
                                    <text x="280" y="406" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">2</text>
                                </g>

                                {/* 3. Europe */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    {/* Europe: Spain(430,160), UK(410,110), Scan(470,60), Italy(480,170), Black Sea(550,160) */}
                                    <path d="M 430,160 L 420,130 L 400,120 L 410,100 L 440,90 L 460,110 L 470,70 L 510,50 L 530,90 L 550,60 L 580,60 L 560,120 L 550,150 L 520,160 L 500,180 L 480,160 L 460,170 Z" />
                                    {/* UK/Ireland Island */}
                                    <path d="M 390,110 L 410,130 L 400,140 Z" />
                                    <circle cx="490" cy="120" r="16" fill="white" stroke="#334155" />
                                    <text x="490" y="126" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="16">3</text>
                                </g>

                                {/* 4. Africa */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    {/* Africa: Strait(430,180), Horn(600,280), Cape(500,450), Gulf(450,300), Maghreb(400,180) */}
                                    <path d="M 430,180 L 480,180 L 540,190 L 560,210 L 600,280 L 560,350 L 500,450 L 460,390 L 440,300 L 390,250 L 390,200 Z M 610,380 L 630,420 L 620,430 L 600,390 Z" /> {/* +Madagascar */}
                                    <circle cx="500" cy="300" r="18" fill="white" stroke="#334155" />
                                    <text x="500" y="306" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">4</text>
                                </g>

                                {/* 5. Asia */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    {/* Asia: ArabianPen(570,220), India(650,280), SE Asia(750,300), ChinaCoast(800,200), Kamchatka(900,100), Arctic(600,50), Caspian(550,150) */}
                                    <path d="M 550,150 L 600,150 L 650,140 L 750,100 L 850,80 L 920,100 L 900,150 L 850,200 L 820,250 L 780,320 L 750,280 L 700,290 L 660,300 L 630,230 L 600,240 L 570,220 L 560,180 Z" />
                                    {/* Japan */}
                                    <path d="M 880,160 L 900,180 L 880,200 Z" />
                                    {/* Indonesia/Islands simplified */}
                                    <path d="M 720,320 L 800,350 L 850,340 L 810,310 Z" />

                                    <circle cx="720" cy="180" r="18" fill="white" stroke="#334155" />
                                    <text x="720" y="186" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">5</text>
                                </g>

                                {/* 6. Australia */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    {/* Australia(800,400) */}
                                    <path d="M 780,400 L 850,380 L 900,420 L 900,480 L 840,500 L 790,470 L 780,440 Z" />
                                    {/* NZ */}
                                    <path d="M 930,500 L 950,540 L 930,550 Z" />

                                    <circle cx="840" cy="450" r="18" fill="white" stroke="#334155" />
                                    <text x="840" y="456" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">6</text>
                                </g>

                                {/* 7. Antarctica */}
                                <g className="hover:opacity-90 transition-opacity cursor-pointer">
                                    <path d="M 250,580 C 350,570 650,570 850,590 L 830,620 L 280,620 Z" />
                                    <circle cx="550" cy="600" r="18" fill="white" stroke="#334155" />
                                    <text x="550" y="606" textAnchor="middle" fill="#0f172a" stroke="none" fontWeight="bold" fontSize="18">7</text>
                                </g>
                            </g>
                        </svg>
                    </svg>
                </div>

                {/* Coloring Key & Tracing */}
                <div className="mt-4 grid md:grid-cols-2 gap-4 break-inside-avoid">
                    {/* Column 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-red-50 p-2 rounded border border-red-200">
                            <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center font-bold text-white shadow-sm border border-red-500">1</div>
                            <div className="flex-1">
                                <div className="text-xs text-red-600 font-semibold mb-1">Color RED, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">North America</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-orange-50 p-2 rounded border border-orange-200">
                            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold text-white shadow-sm border border-orange-500">2</div>
                            <div className="flex-1">
                                <div className="text-xs text-orange-600 font-semibold mb-1">Color ORANGE, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">South America</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 p-2 rounded border border-yellow-200">
                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white shadow-sm border border-yellow-500">3</div>
                            <div className="flex-1">
                                <div className="text-xs text-yellow-700 font-semibold mb-1">Color YELLOW, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">Europe</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 p-2 rounded border border-green-200">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white shadow-sm border border-green-600">4</div>
                            <div className="flex-1">
                                <div className="text-xs text-green-700 font-semibold mb-1">Color GREEN, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">Africa</div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-purple-50 p-2 rounded border border-purple-200">
                            <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center font-bold text-white shadow-sm border border-purple-500">5</div>
                            <div className="flex-1">
                                <div className="text-xs text-purple-700 font-semibold mb-1">Color PURPLE, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">Asia</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-pink-50 p-2 rounded border border-pink-200">
                            <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center font-bold text-white shadow-sm border border-pink-500">6</div>
                            <div className="flex-1">
                                <div className="text-xs text-pink-600 font-semibold mb-1">Color PINK, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">Australia</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 p-2 rounded border border-blue-200">
                            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center font-bold text-white shadow-sm border border-blue-500">7</div>
                            <div className="flex-1">
                                <div className="text-xs text-blue-600 font-semibold mb-1">Color BLUE, then trace:</div>
                                <div className="font-[Move_Pen_Lite] text-2xl tracking-wide text-slate-400 dashed-text">Antarctica</div>
                            </div>
                        </div>

                        {/* Mini-Challenge */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                            <div className="font-bold text-slate-700 mb-1">{String.fromCodePoint(0x270F)}</div>
                            <div className="text-slate-600">Can you circle the continent you live on?</div>
                        </div>
                    </div>
                </div>

                {showAnswersForDoc('geo-continents-k2', () => {
                    const matches = [
                        { id: 1, name: 'North America', color: 'Red' },
                        { id: 2, name: 'South America', color: 'Orange' },
                        { id: 3, name: 'Europe', color: 'Yellow' },
                        { id: 4, name: 'Africa', color: 'Green' },
                        { id: 5, name: 'Asia', color: 'Purple' },
                        { id: 6, name: 'Australia', color: 'Pink' },
                        { id: 7, name: 'Antarctica', color: 'Blue' },
                    ];
                    return (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="grid grid-cols-2 gap-2">
                                {matches.map((m) => (
                                    <div key={m.id} className="text-sm text-emerald-800">
                                        {m.id}. <strong>{m.name}</strong> ({m.color})
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'geo-compass-rose') {
        return (
            <WorksheetSectionWrapper
                docId="geo-compass-rose"
                title="Compass Rose & Directions"
                emoji={String.fromCodePoint(0x1F30D)}
                description="Color the compass and label cardinal (N, E, S, W) and intercardinal (NE, SE, SW, NW) directions."
                problemCount={8}
                learningObjectives={[
                    'Identify cardinal directions (N, E, S, W)',
                    'Identify intercardinal directions (NE, SE, SW, NW)',
                    'Understand how to use a compass rose'
                ]}
                parentTeacherTips={[
                    'Cardinal directions: North, East, South, West',
                    'Intercardinal directions: Northeast, Southeast, Southwest, Northwest',
                    'Help students remember: Never Eat Soggy Waffles (N, E, S, W)',
                    'Extension: Practice using directions to navigate'
                ]}
            >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                    <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="space-y-2 text-sm">
                        <div className="font-semibold text-base"><strong>{t('common.problem')}</strong> {t('worksheets.geographyMap.example.problemText', 'Label the direction at the top of the compass')}</div>
                        <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                            <div><strong>{t('common.step1')}</strong> {t('worksheets.geographyMap.example.step1Text', 'Look at the top of the compass rose')}</div>
                            <div><strong>{t('common.step2')}</strong> {t('worksheets.geographyMap.example.step2Text', 'The top direction is always North (N)')}</div>
                            <div><strong>{t('common.step3')}</strong> {t('worksheets.geographyMap.example.step3Text', 'Write "N" at the top')}</div>
                            <div className="font-semibold text-blue-900"><strong>{t('common.answer')}</strong> {t('worksheets.geographyMap.example.answerText', 'N (North)')}</div>
                            <div className="text-xs text-blue-700 mt-1">{String.fromCodePoint(0x279C)}</div>
                        </div>
                    </div>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                    <svg viewBox="0 0 600 600" className="w-full h-auto" role="img" aria-labelledby="compass-title">
                        <title id="compass-title">Compass rose</title>
                        <g fill="none" stroke="#111827" strokeWidth="4">
                            <circle cx="300" cy="300" r="180" />
                            <line x1="300" y1="100" x2="300" y2="500" />
                            <line x1="100" y1="300" x2="500" y2="300" />
                            <path d="M300 120 L330 300 L300 480 L270 300 Z" fill="white" />
                            <path d="M120 300 L300 330 L480 300 L300 270 Z" fill="white" />
                        </g>
                        <g stroke="#111827" strokeWidth="2" fill="white" strokeDasharray="4 4">
                            {/* Main directions */}
                            <circle cx="300" cy="60" r="30" />
                            <circle cx="540" cy="300" r="30" />
                            <circle cx="300" cy="540" r="30" />
                            <circle cx="60" cy="300" r="30" />
                            {/* Intercardinal directions */}
                            <circle cx="450" cy="150" r="25" />
                            <circle cx="450" cy="450" r="25" />
                            <circle cx="150" cy="450" r="25" />
                            <circle cx="150" cy="150" r="25" />
                        </g>
                    </svg>
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                    <div className="space-y-2 text-sm text-purple-800">
                        <div>1. Draw your own compass rose</div>
                        <div>2. Use the compass to give directions from your house to school</div>
                        <div>3. Can you name all 8 directions in order?</div>
                    </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                    <div className="space-y-2 text-xs">
                        <div>{String.fromCharCode(0x2610)} I can identify all 4 cardinal directions</div>
                        <div>{String.fromCharCode(0x2610)} I can identify all 4 intercardinal directions</div>
                        <div>{String.fromCharCode(0x2610)} I understand how to use a compass rose</div>
                    </div>
                    <div className="mt-3 text-xs">
                        <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 8
                    </div>
                    <div className="mt-2 text-xs">
                        <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                    </div>
                </div>
                {showAnswersForDoc('geo-compass-rose', () => {
                    const directions = [
                        { position: 'Top', dir: 'N (North)' },
                        { position: 'Right', dir: 'E (East)' },
                        { position: 'Bottom', dir: 'S (South)' },
                        { position: 'Left', dir: 'W (West)' },
                        { position: 'Top-Right', dir: 'NE (Northeast)' },
                        { position: 'Bottom-Right', dir: 'SE (Southeast)' },
                        { position: 'Bottom-Left', dir: 'SW (Southwest)' },
                        { position: 'Top-Left', dir: 'NW (Northwest)' }
                    ];
                    return (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="space-y-2">
                                {directions.map((d, i) => (
                                    <div key={i} className="text-sm text-emerald-800">
                                        {d.position}: <strong>{d.dir}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'geo-landforms') {
        const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${docId}`);

        const items = [
            {
                label: 'Mountain',
                svg: (
                    <g>
                        <path d="M40 160 L90 75 L140 160 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M95 160 L135 95 L200 160 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M80 120 L90 105 L100 120" stroke="#111827" strokeWidth="2" />
                        <path d="M140 120 L150 108 L160 120" stroke="#111827" strokeWidth="2" />
                    </g>
                )
            },
            {
                label: 'Valley',
                svg: (
                    <g>
                        <path d="M30 160 L80 95 L110 160 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M130 160 L170 95 L210 160 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M30 160 Q120 145 210 160" fill="#e2e8f0" stroke="#111827" strokeWidth="2" />
                    </g>
                )
            },
            {
                label: 'Island',
                svg: (
                    <g>
                        <path d="M80 145 C110 110, 170 110, 200 145 C175 165, 115 165, 80 145 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M150 140 C145 125, 146 115, 148 105" stroke="#111827" strokeWidth="2" />
                        <path d="M148 105 C142 100, 135 100, 130 105" stroke="#111827" strokeWidth="2" />
                        <path d="M148 105 C154 100, 162 100, 168 105" stroke="#111827" strokeWidth="2" />
                    </g>
                )
            },
            {
                label: 'Lake',
                svg: (
                    <g>
                        <path d="M80 130 C100 110, 140 100, 180 120 C200 135, 170 160, 130 160 C110 158, 90 150, 80 130 Z" fill="white" stroke="#111827" strokeWidth="2" />
                        <path d="M100 135 C110 140, 120 140, 130 135" stroke="#111827" strokeWidth="2" />
                        <path d="M120 145 C130 150, 140 150, 150 145" stroke="#111827" strokeWidth="2" />
                    </g>
                )
            },
            {
                label: 'River',
                svg: (
                    <g>
                        <path d="M40 65 C80 85, 110 55, 150 75 C190 95, 150 120, 190 140" fill="none" stroke="#111827" strokeWidth="2" />
                        <path d="M30 75 C70 95, 100 65, 140 85 C180 105, 140 130, 180 150" fill="none" stroke="#111827" strokeWidth="2" />
                    </g>
                )
            }
        ];

        // Shuffle items
        const shuffledItems = [...items].sort(() => rng() - 0.5);

        return (
            <WorksheetSectionWrapper
                docId="geo-landforms"
                title="Landforms vs Water Bodies"
                emoji={String.fromCodePoint(0x1F30D)}
                description="Look at the pictures. Write the correct letter (AE) next to each word."
                problemCount={5}
                learningObjectives={[
                    'Identify different landforms',
                    'Identify different water bodies',
                    'Match words to pictures'
                ]}
                parentTeacherTips={[
                    'Landforms are parts of the land: mountain, valley, island',
                    'Water bodies hold or carry water: lake, river',
                    'Help students look at the shapes in the pictures',
                    'Extension: Find examples of these in your area'
                ]}
            >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                    <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="space-y-2 text-sm">
                        <div className="font-semibold text-base"><strong>Problem:</strong> Match "Mountain" to the correct picture</div>
                        <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                            <div><strong>{t('common.step1')}</strong> {t('worksheets.vocab.example.step1Text', 'Look at the word "Mountain"')}</div>
                            <div><strong>{t('common.step2')}</strong> {t('worksheets.vocab.example.step2Text', 'Find the picture that shows tall peaks pointing up')}</div>
                            <div><strong>{t('common.step3')}</strong> {t('worksheets.vocab.example.step3Text', 'Write the letter of that picture next to "Mountain"')}</div>
                        </div>
                    </div>
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                    <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                        {shuffledItems.map((item, i) => (
                            <div key={i} className="border-2 border-slate-200 rounded-lg p-2 flex flex-col items-center bg-white">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 mb-2 border border-slate-300">
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <svg viewBox="0 0 240 180" className="w-full h-auto max-h-32 mb-2">
                                    {item.svg}
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Match list */}
                <div className="mt-6">
                    <div className="text-slate-900 font-bold mb-4 text-center">Write the Letter</div>
                    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                        {['Mountain', 'Valley', 'Island', 'Lake', 'River'].map((w, i) => (
                            <div key={w} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                                <span className="text-lg font-medium text-slate-800">{w}</span>
                                <div className="w-16 h-12 border-2 border-slate-400 bg-white rounded flex items-center justify-center">
                                    {/* Box for letter */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-purple-900 mb-3 text-sm">{String.fromCodePoint(0x1F680)}</div>
                    <div className="space-y-2 text-sm text-purple-800">
                        <div>1. Draw your own landform or water body</div>
                        <div>2. Can you find examples of these near your home?</div>
                        <div>3. Create a story using 3 of these landforms/water bodies</div>
                    </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                    <div className="space-y-2 text-xs">
                        <div>{String.fromCharCode(0x2610)} I can identify landforms</div>
                        <div>{String.fromCharCode(0x2610)} I can identify water bodies</div>
                        <div>{String.fromCharCode(0x2610)} I can match words to pictures</div>
                    </div>
                    <div className="mt-3 text-xs">
                        <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 5
                    </div>
                    <div className="mt-2 text-xs">
                        <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                    </div>
                </div>
                {showAnswersForDoc('geo-landforms', () => {
                    const matches = [
                        { word: 'Mountain', letter: 'A' },
                        { word: 'Valley', letter: 'B' },
                        { word: 'Island', letter: 'C' },
                        { word: 'Lake', letter: 'D' },
                        { word: 'River', letter: 'E' }
                    ];
                    return (
                        <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                            <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                            <div className="space-y-2">
                                {matches.map((m, i) => (
                                    <div key={i} className="text-sm text-emerald-800">
                                        {m.word}  <strong>{m.letter}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </WorksheetSectionWrapper>
        );
    }

    if (docId === 'geo-latlong') {
        return (
            <WorksheetSectionWrapper
                docId="geo-latlong"
                title="Latitude & Longitude Basics"
                emoji={String.fromCodePoint(0x1F30D)}
                description="Read grid lines and plot simple coordinates. Practice with a minimal world grid. Tip: Latitude is horizontal (N/S). Longitude is vertical (E/W)."
                problemCount={2}
                learningObjectives={[
                    'Understand latitude and longitude coordinates',
                    'Plot coordinates on a grid',
                    'Read coordinates from a map'
                ]}
                parentTeacherTips={[
                    'Latitude is horizontal (runs east-west), measures north-south',
                    'Longitude is vertical (runs north-south), measures east-west',
                    'Remember: Latitude = flat (like ladder rungs), Longitude = long (up and down)',
                    'Extension: Find coordinates of your city'
                ]}
            >
                <div className="print:hidden h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 animate-gradient-x mb-2" />
                {/* Worked Example */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg print:border print:bg-white">
                    <div className="font-semibold text-blue-900 mb-3 text-sm">{String.fromCodePoint(0x1F4A1)}</div>
                    <div className="space-y-2 text-sm">
                        <div className="font-semibold text-base"><strong>{t('common.problem')}</strong>{String.fromCodePoint(0x1F4A1)}</div>
                        <div className="pl-4 border-l-2 border-blue-300 space-y-1">
                            <div><strong>{t('common.step1')}</strong> Find the latitude (numbers on the side)</div>
                            <div><strong>{t('common.step2')}</strong> Find the longitude (numbers on the top/bottom)</div>
                            <div><strong>{t('common.step3')}</strong> {t('worksheets.geographyMap.example.step3Text2', 'Where they meet is point A')}</div>
                            <div className="font-semibold text-blue-900"><strong>{t('common.answer')}</strong> (Latitude, Longitude)</div>
                            <div className="text-xs text-blue-700 mt-1">Tip: Latitude lines go "ladder-style" up and down!</div>
                        </div>
                    </div>
                </div>
                <div className="border border-slate-300 rounded p-4 bg-white break-inside-avoid" style={{ pageBreakAfter: 'auto' }}>
                    <svg viewBox="0 0 800 500" className="w-full h-auto" role="img" aria-labelledby="latlong-title">
                        <title id="latlong-title">Latitude and longitude grid</title>
                        <g fill="none" stroke="#94a3b8" strokeWidth="2">
                            {Array.from({ length: 10 }).map((_, i) => (<line key={`h-${i}`} x1="40" y1={50 + i * 40} x2="760" y2={50 + i * 40} />))}
                            {Array.from({ length: 16 }).map((_, i) => (<line key={`v-${i}`} x1={40 + i * 45} y1="50" x2={40 + i * 45} y2="450" />))}
                        </g>
                        {/* Axes labels */}
                        <g fill="#111827" fontSize="12">
                            {/* Equator and Prime Meridian labels */}
                            <text x="380" y="46">0{String.fromCharCode(0x00B0)}</text>
                            <text x="36" y="260" transform="rotate(-90 36,260)">0{String.fromCharCode(0x00B0)}</text>
                            {/* Latitude tick labels */}
                            {([-60, -30, 0, 30, 60] as number[]).map((lat) => {
                                const y = 50 + ((90 - lat) / 180) * 400; // map -90..90 to 50..450
                                const label = lat === 0 ? '0' : (Math.abs(lat) + '' + (lat > 0 ? 'N' : 'S'));
                                return (<text key={`lat-${lat}`} x={30} y={y + 4} textAnchor="end">{label}</text>);
                            })}
                            {/* Longitude tick labels */}
                            {([-120, -90, -60, -30, 0, 30, 60, 90, 120] as number[]).map((lon) => {
                                const x = 40 + ((lon + 120) / 240) * 720; // map -120..120 to 40..760
                                const label = lon === 0 ? '0' : (Math.abs(lon) + '' + (lon > 0 ? 'E' : 'W'));
                                return (<text key={`lon-${lon}`} x={x} y={468} textAnchor="middle">{label}</text>);
                            })}
                        </g>
                        <g fill="none" stroke="#111827" strokeWidth="3.5">
                            <circle cx="260" cy="170" r="18" />
                            <rect x="520" y="300" width="24" height="24" />
                        </g>
                        <g fill="#111827" fontSize="14">
                            <text x="250" y="160">A</text>
                            <text x="515" y="295">B</text>
                        </g>
                    </svg>
                </div>
                {/* Practice coordinates */}
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="text-slate-900 font-semibold mb-1">Try plotting:</div>
                        <ul className="text-slate-700 text-sm list-disc list-inside">
                            <li>45{String.fromCharCode(0x00B0)}N, 90{String.fromCharCode(0x00B0)}W</li>
                            <li>30{String.fromCharCode(0x00B0)}S, 60{String.fromCharCode(0x00B0)}E</li>
                        </ul>
                    </div>
                    <div className="text-slate-500 text-xs border border-slate-200 rounded-lg p-3">
                        Tip: Latitude (90 to 90) increases northward. Longitude (180 to 180) increases eastward. On this grid, we show from 120W to 120E.
                    </div>
                </div>
                {/* Extension/Challenge Problems */}
                <div className="mt-6 print:mt-0 p-4 bg-purple-50 border-2 border-purple-200 rounded print:bg-white print:border" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-purple-900 mb-3 text-sm">Challenge Questions</div>
                    <div className="space-y-2 text-sm text-purple-800">
                        <div>1. Plot your own coordinates on the grid</div>
                        <div>2. Find the coordinates of your city or town</div>
                        <div>3. Can you explain the difference between latitude and longitude?</div>
                    </div>
                </div>
                {/* Self-Assessment */}
                <div className="print:block hidden print:mt-0 mt-6 p-4 border-2 border-slate-300 rounded" style={{ pageBreakBefore: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="font-semibold text-slate-800 mb-3 text-sm">{String.fromCodePoint(0x270F)}</div>
                    <div className="space-y-2 text-xs">
                        <div>{String.fromCharCode(0x2610)} I understand what latitude and longitude are</div>
                        <div>{String.fromCharCode(0x2610)} I can plot coordinates on a grid</div>
                        <div>{String.fromCharCode(0x2610)} I can read coordinates from a map</div>
                    </div>
                    <div className="mt-3 text-xs">
                        <strong>{getTrans('common.myScore', 'My score:')}</strong> ___ / 2
                    </div>
                    <div className="mt-2 text-xs">
                        <strong>{getTrans('common.whatWasHardest', 'What was hardest?')}</strong> _________________________
                    </div>
                </div>
                {showAnswersForDoc('geo-latlong', () => (
                    <div className="mt-6 p-4 border-2 border-emerald-300 bg-emerald-50 rounded print:border print:bg-white print:page-break-before-always">
                        <div className="font-bold text-emerald-900 mb-3 text-base">{String.fromCodePoint(0x2705)}</div>
                        <div className="space-y-2">
                            <div className="text-sm text-emerald-800">
                                Point A: <strong>{String.fromCodePoint(0x2705)}</strong> - Located in the northern and western hemisphere
                            </div>
                            <div className="text-sm text-emerald-800">
                                Point B: <strong>30{String.fromCharCode(0x00B0)}S, 60{String.fromCharCode(0x00B0)}E</strong> - Located in the southern and eastern hemisphere
                            </div>
                            <div className="mt-4 border border-emerald-200 rounded p-2 bg-white">
                                <div className="text-xs font-bold mb-1 text-center">Solution Map:</div>
                                <svg viewBox="0 0 800 500" className="w-full h-auto">
                                    <rect width="800" height="500" fill="#ecfdf5" />
                                    <g fill="none" stroke="#94a3b8" strokeWidth="1">
                                        {Array.from({ length: 10 }).map((_, i) => (<line key={`h-${i}`} x1="40" y1={50 + i * 40} x2="760" y2={50 + i * 40} />))}
                                        {Array.from({ length: 16 }).map((_, i) => (<line key={`v-${i}`} x1={40 + i * 45} y1="50" x2={40 + i * 45} y2="450" />))}
                                    </g>
                                    <g fill="#059669" stroke="#059669" strokeWidth="2">
                                        {/* C: 0, 120E */}
                                        <circle cx={40 + ((120 + 120) / 240) * 720} cy={50 + ((90 - 0) / 180) * 400} r={8} />
                                        <text x={40 + ((120 + 120) / 240) * 720} y={50 + ((90 - 0) / 180) * 400 - 15} textAnchor="middle" stroke="none">C</text>

                                        {/* D: 45N, 60W */}
                                        <circle cx={40 + ((-60 + 120) / 240) * 720} cy={50 + ((90 - 45) / 180) * 400} r={8} />
                                        <text x={40 + ((-60 + 120) / 240) * 720} y={50 + ((90 - 45) / 180) * 400 - 15} textAnchor="middle" stroke="none">D</text>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    return null;
};
