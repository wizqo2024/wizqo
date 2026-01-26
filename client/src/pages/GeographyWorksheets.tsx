import React from 'react';
import { WorksheetSectionWrapper, PremiumWorksheetBanner, StrategySpotlight } from './printables/PrintableShared';
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

    // --- Continents Upgrade ---
    if (docId === 'geo-continents-k2') {
        return (
            <WorksheetSectionWrapper
                docId="geo-continents-k2"
                title="World Explorer: The 7 Continents"
                emoji="🌍"
                description="Identify and color the 7 continents. Remember: each continent has its own special shape!"
                problemCount={7}
                learningObjectives={[
                    'Identify and name the 7 continents',
                    'Practice matching colors to geographic regions',
                    'Develop basic map spatial awareness',
                    'Refine fine motor skills through tracing'
                ]}
                parentTeacherTips={[
                    'Ask the child to point to the continent they live on.',
                    'Discuss how oceans separate most of the continents.',
                    'Try to remember one animal that lives on each continent (e.g., Kangaroos in Australia).'
                ]}
            >
                <PremiumWorksheetBanner
                    title="World Explorer"
                    subtitle="Mapping the 7 Continents"
                    icons={{ bg1: "🌍", bg2: "🗺️", float1: "🎒", float2: "🔭" }}
                    colors={{
                        bg: "bg-gradient-to-br from-blue-50 to-sky-50",
                        border: "border-blue-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-blue-300",
                        pillText: "text-blue-900",
                        accent: "text-blue-400"
                    }}
                />

                <StrategySpotlight
                    title="Explorer's Guide: Identifying Continents"
                    description="Continents are the world's seven largest landmasses. You can spot them by their unique shapes! For example, South America looks like a triangle, and Antarctica is at the very bottom."
                    icon="🔭"
                    color="blue"
                />

                <div className="mt-8 border-4 border-slate-800 rounded-2xl p-4 bg-sky-50/30 overflow-hidden break-inside-avoid shadow-lg">
                    <svg viewBox="0 0 1000 650" className="w-full h-auto drop-shadow-sm">
                        {/* Water Pattern */}
                        <defs>
                            <pattern id="ocean-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1" fill="#bae6fd" opacity="0.5" />
                                <path d="M10,20 Q20,10 30,20 T50,20" fill="none" stroke="#e0f2fe" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="1000" height="650" fill="url(#ocean-pattern)" rx="12" />

                        {/* Compass Rose */}
                        <g transform="translate(80, 500) scale(0.8)">
                            <circle cx="0" cy="0" r="45" fill="white" stroke="#94a3b8" strokeWidth="2" />
                            <path d="M0,-40 L12,-10 L40,0 L12,10 L0,40 L-12,10 L-40,0 L-12,-10 Z" fill="#334155" />
                            <text x="0" y="-48" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">N</text>
                        </g>

                        <g fill="white" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round">
                            {/* 1. North America */}
                            <path d="M 80,90 L 120,80 L 180,50 L 260,40 L 310,50 L 350,30 L 330,100 L 350,140 L 310,160 L 290,150 L 280,190 L 260,220 L 270,250 L 230,260 L 220,300 L 190,260 L 170,250 L 150,220 L 130,230 L 140,190 L 120,160 L 90,140 L 60,100 Z" />
                            <circle cx="210" cy="150" r="22" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="210" y="157" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="22">1</text>

                            {/* 2. South America */}
                            <path d="M 230,300 L 280,300 L 330,330 L 360,370 L 340,440 L 300,500 L 280,550 L 260,530 L 240,460 L 210,380 L 210,340 L 230,300 Z" />
                            <circle cx="280" cy="400" r="22" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="280" y="407" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="22">2</text>

                            {/* 3. Europe */}
                            <path d="M 430,160 L 420,130 L 400,120 L 410,100 L 440,90 L 460,110 L 470,70 L 510,50 L 530,90 L 550,60 L 580,60 L 560,120 L 550,150 L 520,160 L 500,180 L 480,160 L 460,170 Z M 390,110 L 410,130 L 400,140 Z" />
                            <circle cx="485" cy="120" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="485" y="127" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="18">3</text>

                            {/* 4. Africa */}
                            <path d="M 430,180 L 480,180 L 540,190 L 560,210 L 600,280 L 560,350 L 500,450 L 460,390 L 440,300 L 390,250 L 390,200 Z M 600,400 L 620,430 L 610,440 Z" />
                            <circle cx="500" cy="300" r="22" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="500" y="307" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="22">4</text>

                            {/* 5. Asia */}
                            <path d="M 550,150 L 600,150 L 650,140 L 750,100 L 850,80 L 920,100 L 900,150 L 850,200 L 820,250 L 780,320 L 750,280 L 700,290 L 660,300 L 630,230 L 600,240 L 570,220 L 560,180 Z M 880,160 L 900,180 L 880,200 Z" />
                            <circle cx="720" cy="190" r="22" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="720" y="197" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="22">5</text>

                            {/* 6. Australia */}
                            <path d="M 780,400 L 850,380 L 900,420 L 900,480 L 840,500 L 790,470 L 780,440 Z" />
                            <circle cx="840" cy="450" r="22" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="840" y="457" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="22">6</text>

                            {/* 7. Antarctica */}
                            <path d="M 200,600 C 300,580 700,580 900,600 L 850,650 L 250,650 Z" />
                            <circle cx="550" cy="615" r="20" fill="white" stroke="#1e293b" strokeWidth="2" />
                            <text x="550" y="622" textAnchor="middle" fill="#0f172a" fontWeight="black" fontSize="20">7</text>
                        </g>
                    </svg>
                </div>

                {/* Key Column */}
                <div className="mt-8 grid sm:grid-cols-2 gap-4 break-inside-avoid">
                    {[
                        { id: 1, name: 'North America', color: 'bg-red-500' },
                        { id: 2, name: 'South America', color: 'bg-orange-500' },
                        { id: 3, name: 'Europe', color: 'bg-yellow-400' },
                        { id: 4, name: 'Africa', color: 'bg-green-500' },
                        { id: 5, name: 'Asia', color: 'bg-purple-500' },
                        { id: 6, name: 'Australia', color: 'bg-pink-500' },
                        { id: 7, name: 'Antarctica', color: 'bg-blue-400' },
                    ].map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
                            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                                {item.id}
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">CONTINENT {item.id}</div>
                                <div className="font-bold text-slate-800">{item.name}</div>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
                        </div>
                    ))}
                </div>

                {showAnswersForDoc('geo-continents-k2', () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                        <h3 className="font-bold text-emerald-900 mb-2">Answer Key (Map Order)</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                            <div>1. North America</div><div>2. South America</div>
                            <div>3. Europe</div><div>4. Africa</div>
                            <div>5. Asia</div><div>6. Australia</div>
                            <div>7. Antarctica</div>
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    // --- Compass Rose Upgrade ---
    if (docId === 'geo-compass-rose') {
        return (
            <WorksheetSectionWrapper
                docId="geo-compass-rose"
                title="Compass Rose & Directions"
                emoji="🧭"
                description="Color and label the compass rose. Use it to find your way!"
                problemCount={8}
                learningObjectives={[
                    'Identify cardinal directions: North, East, South, West',
                    'Identify intercardinal directions: NE, SE, SW, NW',
                    'Understand map orientation and navigation'
                ]}
                parentTeacherTips={[
                    'Use "Never Eat Soggy Waffles" to help remember N-E-S-W in order.',
                    'Discuss how early explorers used the stars and compasses to sail the oceans.',
                    'Try giving "compass directions" around the room (e.g., "Walk North to the door").'
                ]}
            >
                <PremiumWorksheetBanner
                    title="Navigating the World"
                    subtitle="Mastering the Compass Rose"
                    icons={{ bg1: "🧭", bg2: "🏴‍☠️", float1: "⚓", float2: "🔭" }}
                    colors={{
                        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                        border: "border-amber-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-amber-300",
                        pillText: "text-amber-900",
                        accent: "text-amber-400"
                    }}
                />

                <StrategySpotlight
                    title="Voyager's Tip: The Cardinal Points"
                    description='Cardinal directions are the main points: North, South, East, and West. Intercardinal points are halfway between, like "Northeast" (NE). Always start with North at the top!'
                    icon="⚓"
                    color="amber"
                />

                <div className="flex flex-col md:flex-row gap-8 mt-10 items-center break-inside-avoid">
                    {/* The Compass (SVG) */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative p-6 bg-white border-4 border-slate-800 rounded-full shadow-xl">
                            <svg viewBox="0 0 400 400" className="w-80 h-80">
                                {/* Outer Circles */}
                                <circle cx="200" cy="200" r="190" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                                <circle cx="200" cy="200" r="140" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />

                                {/* Secondary Points (NE, SE, SW, NW) */}
                                <g transform="rotate(45, 200, 200)" fill="white" stroke="#334155" strokeWidth="2">
                                    <path d="M200,60 L220,200 L200,340 L180,200 Z" opacity="0.6" />
                                    <path d="M60,200 L200,220 L340,200 L200,180 Z" opacity="0.6" />
                                </g>

                                {/* Main Points (N, S, E, W) */}
                                <g fill="white" stroke="#1e293b" strokeWidth="4">
                                    <path d="M200,20 L235,200 L200,380 L165,200 Z" />
                                    <path d="M20,200 L200,235 L380,200 L200,165 Z" />
                                </g>

                                {/* Compass Center Decoration */}
                                <circle cx="200" cy="200" r="15" fill="#334155" />
                                <circle cx="200" cy="200" r="8" fill="white" />
                            </svg>

                            {/* Direction Labels (Inputs) */}
                            {/* North */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-slate-800 rounded-xl flex items-center justify-center font-black text-2xl text-slate-800">?</div>
                            {/* South */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white border-4 border-slate-800 rounded-xl flex items-center justify-center font-black text-2xl text-slate-800">?</div>
                            {/* East */}
                            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-slate-800 rounded-xl flex items-center justify-center font-black text-2xl text-slate-800">?</div>
                            {/* West */}
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-slate-800 rounded-xl flex items-center justify-center font-black text-2xl text-slate-800">?</div>

                            {/* Intercardinals (Smaller Boxes) */}
                            <div className="absolute top-[18%] right-[18%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-300">NE</div>
                            <div className="absolute bottom-[18%] right-[18%] -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-300">SE</div>
                            <div className="absolute bottom-[18%] left-[18%] translate-x-1/2 translate-y-1/2 w-10 h-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-300">SW</div>
                            <div className="absolute top-[18%] left-[18%] translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-300">NW</div>
                        </div>
                    </div>

                    {/* Help Box */}
                    <div className="w-full md:w-56 bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                        <h4 className="font-bold text-slate-700 mb-3 text-center uppercase tracking-widest text-xs">Mystery List</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW'].map(d => (
                                <div key={d} className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 shadow-sm">{d}</div>
                            ))}
                        </div>
                        <div className="mt-6 text-xs text-slate-400 text-center italic">Label all 8 points to find the gold!</div>
                    </div>
                </div>

                {showAnswersForDoc('geo-compass-rose', () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                        <div className="font-bold text-emerald-900 mb-2">Answer Key:</div>
                        <div className="text-sm text-emerald-800">
                            N: North | S: South | E: East | W: West <br />
                            NE: Northeast | SE: Southeast | SW: Southwest | NW: Northwest
                        </div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    // --- Landforms Upgrade ---
    if (docId === 'geo-landforms') {
        const rng = makeRng(`${effectiveSeed}|v${variant}|doc=${docId}`);
        const items = [
            { label: 'Mountain', icon: '🏔️', desc: 'A very tall, high piece of land with a peak.' },
            { label: 'Valley', icon: '🚜', desc: 'Low land between hills or mountains.' },
            { label: 'Island', icon: '🏝️', desc: 'Land that is completely surrounded by water.' },
            { label: 'Lake', icon: '🛶', desc: 'A large body of water surrounded by land.' },
            { label: 'River', icon: '🛤️', desc: 'A long, flowing body of water.' },
        ];

        return (
            <WorksheetSectionWrapper
                docId="geo-landforms"
                title="Landforms & Water"
                emoji="🏜️"
                description="Match the name to the correct description and icon. Nature is amazing!"
                problemCount={5}
                learningObjectives={[
                    'Distinguish between landforms and water bodies',
                    'Identify physical characteristics of geographical features',
                    'Improve vocabulary related to earth science and geography'
                ]}
                parentTeacherTips={[
                    'Ask the child if they have ever visited a mountain or a river.',
                    'Discuss how water moves in a river (it flows) vs a lake (it stays still).',
                    'Extension: Draw a picture of a "fantasy island" with its own mountains and lakes.'
                ]}
            >
                <PremiumWorksheetBanner
                    title="Planet Earth"
                    subtitle="Landforms vs Water Bodies"
                    icons={{ bg1: "🌋", bg2: "🌊", float1: "🌲", float2: "☁️" }}
                    colors={{
                        bg: "bg-gradient-to-br from-green-50 to-teal-50",
                        border: "border-green-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-green-300",
                        pillText: "text-green-900",
                        accent: "text-green-400"
                    }}
                />

                <StrategySpotlight
                    title="Explorer's Guide: Shape of the Earth"
                    description="The Earth's surface isn't flat! Landforms are natural shapes on land (like mountains), while water bodies are parts of the Earth covered in water (like lakes)."
                    icon="🌲"
                    color="green"
                />

                <div className="grid grid-cols-1 gap-4 mt-8 break-inside-avoid">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-green-300 transition-colors">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner uppercase font-black text-slate-300">
                                {String.fromCharCode(65 + i)}
                            </div>
                            <div className="flex-1">
                                <div className="text-xl font-bold text-slate-800 mb-1">{item.label}</div>
                                <div className="text-slate-500 text-sm italic">{item.desc}</div>
                            </div>
                            <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-2xl opacity-20">
                                🖼️
                            </div>
                        </div>
                    ))}
                </div>

                {showAnswersForDoc('geo-landforms', () => (
                    <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                        <div className="font-bold text-emerald-900 mb-1">Answer Key:</div>
                        <div className="text-sm text-emerald-800">Correct matches follow the Earth science definitions provided.</div>
                    </div>
                ))}
            </WorksheetSectionWrapper>
        );
    }

    // --- Latitude/Longitude Upgrade ---
    if (docId === 'geo-latlong') {
        return (
            <WorksheetSectionWrapper
                docId="geo-latlong"
                title="Latitude & Longitude"
                emoji="🌐"
                description="Plot the secret points on the global grid. Think of it like a game of Battleship!"
                problemCount={2}
            >
                <PremiumWorksheetBanner
                    title="Global Coordinates"
                    subtitle="Finding Your Place on Earth"
                    icons={{ bg1: "🌐", bg2: "🗼", float1: "📡", float2: "🛰️" }}
                    colors={{
                        bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
                        border: "border-indigo-200",
                        pillBg: "bg-white/80",
                        pillBorder: "border-indigo-300",
                        pillText: "text-indigo-900",
                        accent: "text-indigo-400"
                    }}
                />

                <StrategySpotlight
                    title="Scientist's Note: Ladder-titude"
                    description="Remember: Latitude lines go around the world like rungs on a LADDER (Ladder-titude). Longitude lines are LONG lines that go from North to South."
                    icon="🛰️"
                    color="indigo"
                />

                <div className="mt-10 border-4 border-slate-800 rounded-2xl p-6 bg-white break-inside-avoid shadow-xl overflow-x-auto">
                    <svg viewBox="0 0 800 450" className="w-[800px] h-auto mx-auto">
                        {/* Sea Background */}
                        <rect width="800" height="450" fill="#f8fafc" />

                        {/* Grid Lines */}
                        <g stroke="#cbd5e1" strokeWidth="1">
                            {/* Latitude (Flat) */}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <line key={`lat-${i}`} x1="50" y1={45 + i * 60} x2="750" y2={45 + i * 60} />
                            ))}
                            {/* Longitude (Long) */}
                            {Array.from({ length: 11 }).map((_, i) => (
                                <line key={`lon-${i}`} x1={50 + i * 70} y1="45" x2={50 + i * 70} y2="405" />
                            ))}
                        </g>

                        {/* Equator & Prime Meridian (Thick) */}
                        <line x1="50" y1="225" x2="750" y2="225" stroke="#475569" strokeWidth="3" />
                        <line x1="400" y1="45" x2="400" y2="405" stroke="#475569" strokeWidth="3" />

                        {/* Labels */}
                        <g fill="#64748b" fontSize="12" fontWeight="bold">
                            <text x="410" y="220" fill="#1e293b">EQUATOR (0°)</text>
                            <text x="410" y="60" transform="rotate(90, 410, 60)" fill="#1e293b">PRIME MERIDIAN (0°)</text>

                            {/* Lat Labels */}
                            <text x="35" y="50">90°N</text><text x="35" y="230">0°</text><text x="35" y="410">90°S</text>
                            {/* Lon Labels */}
                            <text x="50" y="425" textAnchor="middle">180°W</text><text x="400" y="425" textAnchor="middle">0°</text><text x="750" y="425" textAnchor="middle">180°E</text>
                        </g>

                        {/* Mystery Points */}
                        <g fill="none" stroke="#6366f1" strokeWidth="4">
                            <circle cx="260" cy="165" r="15" />
                            <circle cx="610" cy="285" r="15" />
                        </g>
                        <g fill="#1e293b" fontSize="18" fontWeight="black" textAnchor="middle">
                            <text x="260" y="171">A</text>
                            <text x="610" y="291">B</text>
                        </g>
                    </svg>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6 break-inside-avoid">
                    <div className="p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 mb-3">Mystery Missions:</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-700">Point A coordinates:</span>
                                <div className="w-32 h-10 bg-white border-2 border-slate-300 rounded-lg"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-700">Point B coordinates:</span>
                                <div className="w-32 h-10 bg-white border-2 border-slate-300 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-center">
                        <div className="text-slate-500 text-sm">
                            <strong>Challenge!</strong> <br />
                            Mark point <strong>C</strong> at: <br />
                            <span className="text-lg font-black text-indigo-600 uppercase">30°N, 90°E</span>
                        </div>
                    </div>
                </div>
            </WorksheetSectionWrapper>
        );
    }

    return null;
};
