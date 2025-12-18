import React, { useRef } from 'react';
import { WorksheetHeader } from '../components/worksheet/WorksheetHeader';
import { useTranslation } from '../context/TranslationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Printer, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { SEOMetaTags } from '../components/SEOMetaTags';

// --- Custom 3D-Style SVG Icons (Clayomorphism Style) ---

// 1. Situation: Lost Toy (Sad/Worried Boy)
const LostToyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
        <defs>
            <filter id="clay-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset dx="2" dy="2" result="offsetBlur" />
                <feComposite in="offsetBlur" in2="SourceAlpha" operator="out" result="outerShadow" />
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur2" />
                <feOffset dx="-1" dy="-1" result="offsetBlur2" />
                <feComposite in="offsetBlur2" in2="SourceAlpha" operator="out" result="highlight" />
                <feMerge>
                    <feMergeNode in="outerShadow" />
                    <feMergeNode in="highlight" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <linearGradient id="shirt-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
        </defs>
        {/* Head */}
        <circle cx="50" cy="40" r="15" fill="url(#skin)" filter="url(#clay-shadow)" />
        {/* Body */}
        <path d="M30 80 Q50 90 70 80 L70 95 L30 95 Z" fill="url(#shirt-blue)" filter="url(#clay-shadow)" />
        {/* Thought Bubble (Toy) */}
        <path d="M65 25 Q85 15 90 35 Q95 50 75 45 Z" fill="#fff" opacity="0.8" />
        <circle cx="80" cy="35" r="5" fill="#fcd34d" />
        {/* Sad Face */}
        <path d="M45 42 Q50 38 55 42" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="38" r="1.5" fill="#333" />
        <circle cx="55" cy="38" r="1.5" fill="#333" />
    </svg>
);

// 2. Situation: Won Game (Happy w/ Trophy)
const WonGameIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
        <defs>
            <linearGradient id="trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="shirt-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
        </defs>
        {/* Trophy */}
        <path d="M75 30 L85 30 L80 60 L70 60 Z" fill="url(#trophy-gold)" />
        <path d="M65 30 Q77 70 90 30" fill="none" stroke="#d97706" strokeWidth="3" />
        {/* Boy */}
        <circle cx="40" cy="45" r="15" fill="#fca5a5" />
        <path d="M20 85 Q40 95 60 85 L60 100 L20 100 Z" fill="url(#shirt-green)" />
        {/* Arms up */}
        <path d="M25 65 L15 45" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" />
        <path d="M55 65 L65 45" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" />
        {/* Happy Face */}
        <path d="M35 48 Q40 54 45 48" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="35" cy="42" r="1.5" fill="#333" />
        <circle cx="45" cy="42" r="1.5" fill="#333" />
    </svg>
);

// 3. Situation: Raining (Looking out window)
const RainingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
        {/* Window Frame */}
        <rect x="20" y="20" width="60" height="60" rx="5" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="4" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#94a3b8" strokeWidth="4" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#94a3b8" strokeWidth="4" />
        {/* Rain Drops */}
        <path d="M30 30 L28 35" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 35 L38 40" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 30 L58 35" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        {/* Sad Face in Window */}
        <circle cx="35" cy="65" r="10" fill="#fca5a5" />
        <path d="M32 68 Q35 66 38 68" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

// 4. Situation: Sharing Cookie (Clearer Scene)
const SharingCookieIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
        <defs>
            <linearGradient id="cookie-dough" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
        </defs>

        {/* Left Kid (Blue Shirt) */}
        <circle cx="30" cy="50" r="14" fill="#fca5a5" /> {/* Head */}
        <path d="M15 85 Q30 95 45 85 L45 95 L15 95 Z" fill="#93c5fd" /> {/* Body */}
        {/* Arm reaching */}
        <path d="M25 75 Q35 60 45 60" stroke="#fca5a5" strokeWidth="5" strokeLinecap="round" />
        {/* Face */}
        <circle cx="28" cy="48" r="1.5" fill="#333" />
        <circle cx="36" cy="48" r="1.5" fill="#333" />
        <path d="M30 54 Q33 57 36 54" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />

        {/* Right Kid (Green Shirt) */}
        <circle cx="70" cy="50" r="14" fill="#fca5a5" /> {/* Head */}
        <path d="M55 85 Q70 95 85 85 L85 95 L55 95 Z" fill="#86efac" /> {/* Body */}
        {/* Arm reaching */}
        <path d="M75 75 Q65 60 55 60" stroke="#fca5a5" strokeWidth="5" strokeLinecap="round" />
        {/* Face */}
        <circle cx="64" cy="48" r="1.5" fill="#333" />
        <circle cx="72" cy="48" r="1.5" fill="#333" />
        <path d="M66 54 Q69 57 72 54" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />

        {/* The BIG Cookie in the middle */}
        <circle cx="50" cy="55" r="12" fill="url(#cookie-dough)" />
        <circle cx="46" cy="52" r="1.5" fill="#3f1d08" />
        <circle cx="54" cy="53" r="1.5" fill="#3f1d08" />
        <circle cx="50" cy="58" r="1.5" fill="#3f1d08" />
        <circle cx="48" cy="56" r="1" fill="#3f1d08" />

        {/* Heart above */}
        <path d="M50 30 C55 20, 65 22, 65 30 C65 38, 50 45, 50 45 C50 45, 35 38, 35 30 C35 22, 45 20, 50 30 Z" fill="#f472b6" />
    </svg>
);

// --- Emotions Icons (3D Spheres) ---

const EmotionSad = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="grad-sad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#60a5fa" /> {/* lighter blue */}
                <stop offset="100%" stopColor="#2563eb" /> {/* darker blue */}
            </radialGradient>
            <filter id="glow-sad" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#grad-sad)" style={{ filter: 'drop-shadow(0px 10px 10px rgba(37, 99, 235, 0.3))' }} />
        {/* Eyes */}
        <path d="M35 45 Q30 40 25 45" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M65 45 Q70 40 75 45" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Tear */}
        <path d="M30 55 Q25 65 30 70 Q35 65 30 55" fill="#bfdbfe" />
        {/* Mouth */}
        <path d="M35 70 Q50 60 65 70" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
);

const EmotionHappy = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="grad-happy" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
            </radialGradient>
        </defs>
        {/* Sun rays */}
        <g stroke="#eab308" strokeWidth="6" strokeLinecap="round">
            <line x1="50" y1="5" x2="50" y2="15" />
            <line x1="50" y1="85" x2="50" y2="95" />
            <line x1="5" y1="50" x2="15" y2="50" />
            <line x1="85" y1="50" x2="95" y2="50" />
            <line x1="18" y1="18" x2="25" y2="25" />
            <line x1="75" y1="75" x2="82" y2="82" />
            <line x1="82" y1="18" x2="75" y2="25" />
            <line x1="25" y1="75" x2="18" y2="82" />
        </g>
        <circle cx="50" cy="50" r="35" fill="url(#grad-happy)" style={{ filter: 'drop-shadow(0px 10px 10px rgba(234, 179, 8, 0.4))' }} />
        {/* Eyes */}
        <circle cx="35" cy="45" r="4" fill="#422006" />
        <circle cx="65" cy="45" r="4" fill="#422006" />
        {/* Mouth */}
        <path d="M35 60 Q50 75 65 60" stroke="#422006" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <circle cx="25" cy="55" r="3" fill="#fca5a5" opacity="0.6" />
        <circle cx="75" cy="55" r="3" fill="#fca5a5" opacity="0.6" />
    </svg>
);

const EmotionBored = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="grad-bored" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
        </defs>
        {/* Blob shape */}
        <path d="M50 15 Q80 15 85 40 Q90 85 50 85 Q10 85 15 40 Q20 15 50 15 Z" fill="url(#grad-bored)" style={{ filter: 'drop-shadow(0px 10px 10px rgba(107, 114, 128, 0.4))' }} />
        {/* Eyes (Half closed) */}
        <path d="M30 45 L45 45" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        <circle cx="37" cy="48" r="2" fill="#374151" />
        <path d="M55 45 L70 45" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        <circle cx="62" cy="48" r="2" fill="#374151" />
        {/* Mouth (Straight) */}
        <path d="M40 65 L60 65" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const EmotionFriendly = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="grad-friendly" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
            </radialGradient>
        </defs>
        <path d="M50 30 Q85 0 90 50 Q95 90 50 90 Q5 90 10 50 Q15 0 50 30 Z" fill="url(#grad-friendly)" style={{ filter: 'drop-shadow(0px 10px 10px rgba(236, 72, 153, 0.4))' }} />
        {/* Heart Shape attempt */}
        <path d="M50 35 C65 15, 90 20, 90 50 C90 75, 50 90, 50 90 C50 90, 10 75, 10 50 C10 20, 35 15, 50 35 Z" fill="url(#grad-friendly)" />
        {/* Happy Face */}
        <path d="M35 55 Q40 50 45 55" stroke="#831843" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M55 55 Q60 50 65 55" stroke="#831843" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M40 70 Q50 78 60 70" stroke="#831843" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Arms hugging */}
        <path d="M10 50 Q5 40 20 40" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M90 50 Q95 40 80 40" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
);


export default function MatchFeelingWorksheetPage() {
    const { t } = useTranslation();
    const printRef = useRef<HTMLDivElement>(null);
    const [leftItems, setLeftItems] = React.useState<any[]>([]);
    const [rightItems, setRightItems] = React.useState<any[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);

    // Data Definition
    const pairs = [
        {
            id: 'sad',
            situation: 'Lost my favorite toy',
            emotion: 'SAD',
            SitIcon: LostToyIcon,
            EmoIcon: EmotionSad,
            color: 'blue'
        },
        {
            id: 'happy',
            situation: 'Won the big game!',
            emotion: 'HAPPY',
            SitIcon: WonGameIcon,
            EmoIcon: EmotionHappy,
            color: 'yellow'
        },
        {
            id: 'bored',
            situation: "It's raining outside, can't play",
            emotion: 'BORED',
            SitIcon: RainingIcon,
            EmoIcon: EmotionBored,
            color: 'gray'
        },
        {
            id: 'friendly',
            situation: 'Sharing a cookie with a friend',
            emotion: 'FRIENDLY',
            SitIcon: SharingCookieIcon,
            EmoIcon: EmotionFriendly,
            color: 'pink'
        }
    ];

    // Fisher-Yates shuffle
    const shuffle = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    React.useEffect(() => {
        setLeftItems(shuffle([...pairs]));
        setRightItems(shuffle([...pairs]));
    }, []);

    const handleShuffle = () => {
        setLeftItems(shuffle([...pairs]));
        setRightItems(shuffle([...pairs]));
    };

    const handlePrint = () => window.print();

    const handleDownloadPDF = async () => {
        if (!printRef.current || isGenerating) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('match-the-feeling-wizqo.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Could not generate PDF.');
        } finally {
            setIsGenerating(false);
        }
    };

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=1');

    return (
        <div className={`font-sans text-slate-900 ${isPreview ? 'p-0 bg-white' : 'min-h-screen pb-16 bg-slate-50'} print:bg-white print:pb-0`}>
            {!isPreview && (
                <SEOMetaTags
                    title="Match the Feeling to the Situation - Free SEL Worksheet | Wizqo"
                    description="Free printable Social Emotional Learning (SEL) worksheet. Help kids identify feelings like sad, happy, bored, and friendly by matching them to real-life situations."
                    canonicalUrl="https://wizqo.com/worksheets/match-the-feeling"
                />
            )}

            {/* Nav / Controls */}
            {!isPreview && (
                <div className="max-w-4xl mx-auto px-4 py-8 print:hidden">
                    <button onClick={() => window.location.href = '/worksheets/kindergarten-math-worksheets'} className="flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:underline transition-all mb-6 font-medium">
                        <ArrowLeft size={20} /> Back to Worksheets
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Match the Feeling Worksheet</h1>
                    <div className="flex flex-wrap gap-4 mb-8">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 shadow-sm"><Printer size={20} /> Print</button>
                        <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold hover:bg-violet-50 shadow-sm">
                            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} PDF
                        </button>
                        <button onClick={handleShuffle} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold hover:bg-emerald-50 shadow-sm"><RefreshCw size={20} /> Shuffle</button>
                    </div>
                </div>
            )}

            {/* Main Worksheet Area */}
            <div className="flex justify-center print:block print:w-full">
                <div ref={printRef} className={`bg-white w-[210mm] min-h-[297mm] shadow-xl print:shadow-none p-8 relative flex flex-col ${isPreview ? 'shadow-none w-full !min-h-0' : ''} print:p-4 print:print-color-adjust-exact`}>

                    {/* Header */}
                    <div className="text-center mb-8 print:mb-4">
                        <h1 className="text-4xl font-black text-sky-400 mb-2 font-comic drop-shadow-sm print:text-sky-600" style={{ textShadow: '2px 2px 0px #bae6fd' }}>
                            Match the Feeling
                        </h1>
                        <h2 className="text-3xl font-black text-yellow-400 font-comic print:text-yellow-500" style={{ textShadow: '2px 2px 0px #fde047' }}>
                            to the Situation
                        </h2>
                    </div>

                    <WorksheetHeader enabled={true} showScore={true} className="mb-8 print:mb-4" />

                    <div className="grid grid-cols-2 gap-12 flex-1 print:gap-x-24 print:gap-y-8">

                        {/* Column 1: Situation */}
                        <div className="flex flex-col gap-6 print:gap-8">
                            <div className="bg-sky-200 text-sky-800 font-black text-xl text-center py-2 rounded-full font-comic shadow-inner border-2 border-sky-300 print:print-color-adjust-exact print:text-lg print:py-1">
                                SITUATION
                            </div>
                            {leftItems.map((item, idx) => (
                                <div key={`sit-${idx}`} className="relative group">
                                    {/* Clay Container */}
                                    <div className="aspect-[4/3] rounded-3xl p-4 flex flex-col items-center justify-between transition-transform transform hover:scale-[1.02] border-2 border-transparent print:border-slate-200 print:print-color-adjust-exact print:p-2 print:rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(145deg, #e0f2fe, #bfdbfe)',
                                            boxShadow: '10px 10px 20px #9ca3af, -10px -10px 20px #ffffff'
                                        }}>
                                        <div className="flex-1 w-full flex items-center justify-center">
                                            <item.SitIcon className="w-32 h-32 print:w-20 print:h-20" />
                                        </div>
                                        <p className="font-comic font-bold text-slate-700 text-center text-lg leading-tight mt-2 print:text-sm">
                                            {item.situation}
                                        </p>
                                    </div>
                                    {/* Dot for connecting - Moved further out into the gap */}
                                    <div className="absolute right-[-32px] top-1/2 w-6 h-6 bg-slate-300 rounded-full border-4 border-white shadow-sm transform -translate-y-1/2 print:block hidden print:bg-slate-400 print:border-slate-600 print:right-[-40px] print:w-4 print:h-4" />
                                </div>
                            ))}
                        </div>

                        {/* Column 2: Emotion */}
                        <div className="flex flex-col gap-6 print:gap-8">
                            <div className="bg-rose-200 text-rose-800 font-black text-xl text-center py-2 rounded-full font-comic shadow-inner border-2 border-rose-300 print:print-color-adjust-exact print:text-lg print:py-1">
                                EMOTION
                            </div>
                            {rightItems.map((item, idx) => (
                                <div key={`emo-${idx}`} className="relative group h-full">
                                    {/* Clay Container */}
                                    <div className="h-full rounded-3xl p-4 flex flex-col items-center justify-center gap-4 transition-transform transform hover:scale-[1.02] border-2 border-transparent print:border-slate-200 print:print-color-adjust-exact print:p-2 print:rounded-2xl"
                                        style={{
                                            background: (() => {
                                                switch (item.id) {
                                                    case 'sad': return 'linear-gradient(145deg, #dbeafe, #bfdbfe)'; // Blueish
                                                    case 'happy': return 'linear-gradient(145deg, #fef9c3, #fde047)'; // Yellowish
                                                    case 'bored': return 'linear-gradient(145deg, #f3f4f6, #e5e7eb)'; // Grayish
                                                    case 'friendly': return 'linear-gradient(145deg, #fce7f3, #fbcfe8)'; // Pinkish
                                                    default: return 'linear-gradient(145deg, #ffffff, #f1f5f9)';
                                                }
                                            })(),
                                            boxShadow: '10px 10px 20px #9ca3af, -10px -10px 20px #ffffff'
                                        }}>

                                        <item.EmoIcon className="w-28 h-28 print:w-20 print:h-20" />

                                        <p className="font-comic font-black text-center text-xl tracking-wider print:text-base" style={{ color: '#475569' }}>
                                            {item.emotion}
                                        </p>
                                    </div>
                                    {/* Dot for connecting - Moved further out into the gap */}
                                    <div className="absolute left-[-32px] top-1/2 w-6 h-6 bg-slate-300 rounded-full border-4 border-white shadow-sm transform -translate-y-1/2 print:block hidden print:bg-slate-400 print:border-slate-600 print:left-[-40px] print:w-4 print:h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center text-slate-400 font-comic text-sm">
                        © {new Date().getFullYear()} Wizqo.com - Social Emotional Learning Series
                    </div>
                </div>
            </div>
        </div>
    );
}
