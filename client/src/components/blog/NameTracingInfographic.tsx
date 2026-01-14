import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { Check, X, Pencil, Trophy, Sparkles, Brain, Target, ArrowRight } from 'lucide-react';

const COLORS = {
    blue: '#4361EE',   /* Brilliant Blue */
    purple: '#7209B7', /* Deep Purple */
    pink: '#F72585',   /* Vibrant Pink */
    cyan: '#4CC9F0',   /* Bright Cyan */
    yellow: '#FDC500', /* Energetic Yellow */
    dark: '#1B263B',
    light: '#F8F9FA'
};

const RADAR_DATA = [
    { subject: 'Emotional Connection', A: 2, B: 9, fullMark: 10 },
    { subject: 'Attention Span', A: 3, B: 9, fullMark: 10 },
    { subject: 'Task Ownership', A: 2, B: 10, fullMark: 10 },
    { subject: 'Recall Speed', A: 4, B: 8, fullMark: 10 },
    { subject: 'Enjoyment Level', A: 3, B: 9, fullMark: 10 },
];

const BAR_DATA = [
    { name: 'Generic Alphabet Sheet', time: 2, fill: 'rgba(255, 255, 255, 0.3)' },
    { name: 'Custom Name Worksheet', time: 6.5, fill: '#FDC500' },
];

const PIE_DATA = [
    { name: 'Anchor Letters (Known)', value: 6 },
    { name: 'Remaining Alphabet', value: 20 },
];

const PIE_COLORS = [COLORS.blue, '#E5E7EB'];

export default function NameTracingInfographic() {
    return (
        <div className="w-full my-12 font-sans text-slate-800 bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 opacity-10 text-[150px] md:text-[200px] font-bold leading-none select-none pointer-events-none transform translate-x-12 -translate-y-12">A</div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-slate-900 font-bold text-sm tracking-wider mb-6 uppercase shadow-lg">Parenting & Education Hack</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        The "Secret Code" to <br className="hidden md:block" />Teaching Your Child to Write
                    </h2>
                    <p className="text-lg md:text-xl text-cyan-200 font-medium max-w-3xl mx-auto">
                        Why swapping "A is for Apple" with "Name Tracing" activates the brain's hidden learning pathways.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-12">

                {/* Intro Card */}
                <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl border-t-4 border-pink-500">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">The "Generic Workbook" Struggle</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Every parent knows the scene: You buy a standard handwriting book. Your child scribbles for two minutes, gets bored, and walks away. It's not a lack of ability; it's a lack of <strong>emotional connection</strong>. Tracing abstract words fails to ignite the preschooler's brain.
                            </p>
                            <div className="mt-6 flex items-center gap-4 text-purple-600 font-semibold">
                                <Sparkles className="w-6 h-6" />
                                <span>The Solution? Their Own Name.</span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 bg-slate-100 rounded-xl p-6 text-center">
                            <div className="text-6xl mb-2">⚡</div>
                            <div className="text-xl font-bold text-slate-900">The Spark</div>
                            <p className="text-sm text-slate-500">One word lights up the brain like a firework.</p>
                        </div>
                    </div>
                </div>

                {/* Section 1: The Cocktail Party Effect (Radar Chart) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
                    <div className="flex flex-col justify-center order-2 md:order-1">
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">1. The "Cocktail Party Effect"</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Psychologists define the <strong>Cocktail Party Effect</strong> as the brain's ability to instantly snap to attention when hearing one's own name, even in a noisy room. For a child, their name isn't just a word; it is their identity.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <p className="text-sm text-slate-700"><strong>Instant Attention:</strong> It stops being "work" and starts being "autographing".</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <p className="text-sm text-slate-700"><strong>Ownership:</strong> A powerful sense of self drives the desire to perfect the shape.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 order-1 md:order-2 shadow-lg border border-slate-100 flex flex-col items-center">
                        <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wide mb-4">Cognitive Engagement Metrics</h4>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                                    <Radar name="Generic Workbook" dataKey="A" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.2} />
                                    <Radar name="Name Tracing" dataKey="B" stroke={COLORS.pink} fill={COLORS.pink} fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 italic">Comparison of engagement factors</p>
                    </div>
                </section>

                {/* Section 2: Attention Span Data (Bar Chart) */}
                <section className="mb-16">
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full opacity-20 -mr-16 -mt-16 blur-3xl"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-bold text-yellow-400 mb-4">2. Focus Increases by 300%</h3>
                                <p className="text-gray-300 mb-6 text-lg">
                                    Data suggests a massive disparity in "Time on Task". While generic worksheets often result in abandonment after just a few minutes, tasks involving the child's own name sustain focus significantly longer.
                                </p>
                                <div className="inline-block border border-cyan-400 rounded-lg p-4 bg-cyan-400/10">
                                    <span className="block text-4xl font-bold text-white mb-1">2-3x</span>
                                    <span className="text-sm text-cyan-400 uppercase font-bold tracking-wider">Longer Engagement</span>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <div className="w-full h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={BAR_DATA} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', color: '#000' }} />
                                            <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={40}>
                                                {BAR_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={index === 1 ? '#FDC500' : 'rgba(255,255,255,0.5)'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-2">Average minutes spent before loss of focus</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: The Anchor Letter Theory (Pie Chart) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col justify-center items-center">
                        <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wide mb-4">Alphabet Breakdown Strategy</h4>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PIE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PIE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4 p-3 bg-pink-50 rounded-lg">
                            <span className="text-sm font-bold text-pink-600 block">Anchor Letters (e.g., O-L-I-V-I-A)</span>
                            <span className="text-xs text-slate-500">The letters they learn first & fastest</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">3. The "Anchor Letter" Theory</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Teaching the alphabet (A-Z) requires memorizing 26 abstract shapes. Name tracing "hacks" this process. By focusing on the 5-7 letters in their name, the child builds a foundation of known shapes.
                        </p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-sm rounded-r-lg mb-4">
                            <p className="text-slate-700 italic font-medium">"Look mom, that sign has an 'O' like in my name!"</p>
                        </div>
                        <p className="text-slate-600 text-sm">
                            These "Anchor Letters" become the reference point for learning the rest of the alphabet, making the task feel achievable rather than overwhelming.
                        </p>
                    </div>
                </section>

                {/* Section 4: The "One Size Fits All" Failure (HTML Viz) */}
                <section className="mb-16">
                    <h3 className="text-3xl font-bold text-center text-slate-900 mb-8">4. Why Generic Workbooks Fail</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Problem 1: Long Name */}
                        <div className="bg-white rounded-xl p-6 border-b-4 border-purple-500 shadow-md flex flex-col h-full">
                            <h4 className="font-bold text-slate-900 mb-2 text-lg leading-tight">The "Long Name" Problem</h4>
                            <p className="text-sm text-slate-500 mb-4">Generic boxes are too small for longer names, causing frustration.</p>

                            <div className="bg-slate-100 p-4 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Standard Workbook Box:</p>
                                <div className="border-2 border-red-400 bg-red-50 text-red-500 h-16 flex items-center justify-center font-mono font-bold text-lg relative overflow-hidden w-48 mx-auto whitespace-nowrap">
                                    CHRISTOPHER
                                    <span className="absolute right-0 top-0 bg-red-500 text-white text-[10px] px-1">OVERFLOW</span>
                                </div>
                                <p className="text-center text-xs text-red-500 mt-2 font-bold flex items-center justify-center gap-1"><X className="w-3 h-3" /> Cramped & Messy</p>
                            </div>
                        </div>

                        {/* Solution: Custom Fit */}
                        <div className="bg-white rounded-xl p-6 border-b-4 border-blue-500 shadow-xl transform lg:-translate-y-4 z-10 lg:scale-105">
                            <h4 className="font-bold text-blue-600 mb-2">The Custom Solution</h4>
                            <p className="text-sm text-slate-500 mb-4">Custom generators adjust font size and spacing dynamically.</p>

                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                <p className="text-xs text-blue-400 mb-1">Custom Dynamic Layout:</p>
                                <div className="border-2 border-blue-500 bg-indigo-50 text-blue-600 h-10 flex items-center justify-center font-mono font-bold w-full rounded text-[11px] sm:text-xs tracking-tighter text-center whitespace-nowrap overflow-hidden px-1">
                                    CHRISTOPHER
                                </div>
                                <div className="border-2 border-blue-500 bg-indigo-50 text-blue-600 h-14 flex items-center justify-center font-mono font-bold text-2xl w-full rounded">
                                    A V A
                                </div>
                                <p className="text-center text-xs text-blue-600 mt-1 font-bold flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Perfect Fit Every Time</p>
                            </div>
                        </div>

                        {/* Problem 2: Short Name */}
                        <div className="bg-white rounded-xl p-6 border-b-4 border-purple-500 shadow-md flex flex-col h-full">
                            <h4 className="font-bold text-slate-900 mb-2 text-lg leading-tight">The "Short Name" Problem</h4>
                            <p className="text-sm text-slate-500 mb-4">Short names in standard lines leave awkward gaps.</p>

                            <div className="bg-slate-100 p-4 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Standard Workbook Box:</p>
                                <div className="border-2 border-red-400 bg-red-50 text-red-500 h-16 flex items-center justify-start pl-4 font-mono font-bold text-lg relative w-48 mx-auto">
                                    AVA
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl">???</span>
                                </div>
                                <p className="text-center text-xs text-red-500 mt-2 font-bold flex items-center justify-center gap-1"><X className="w-3 h-3" /> Awkward Empty Space</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion / CTA */}
                <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl mx-4 lg:mx-0">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't Force "A is for Apple"</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Start with the word they love the most. Build confidence early, and watch their love for writing grow naturally.
                    </p>
                    <div className="bg-white text-blue-900 rounded-xl p-6 inline-block max-w-md w-full shadow-inner">
                        <p className="font-bold uppercase tracking-widest text-sm mb-2 text-purple-600">Get Started For Free</p>
                        <p className="text-slate-600 mb-6">Use the Wizqo Generator to create a printable PDF instantly.</p>
                        <a href="/worksheets/handwriting-worksheet-maker" className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 transition-all hover:scale-105 w-full">
                            Create Custom Worksheet <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>

            <div className="bg-slate-100 py-6 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-xs">© 2026 Wizqo Education. Based on "Why Custom Name Tracing is the Secret Code".</p>
            </div>
        </div>
    );
}
