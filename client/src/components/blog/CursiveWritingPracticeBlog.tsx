import React from 'react';

export default function CursiveWritingPracticeBlog() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50">
            <header className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[#073B4C] mb-4">
                    Cursive Writing Practice for Kids: A Parent's Complete Guide
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Cursive isn't dead — and research shows it's actually good for your child's brain.
                    Here's when to start, how to teach it, and free tools to make practice easy.
                </p>
            </header>

            <main className="grid grid-cols-1 gap-8">
                {/* Why Cursive Still Matters */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#073B4C] mb-4">Why Cursive Still Matters in 2026</h2>
                    <p className="text-gray-600 mb-4">
                        Many schools dropped cursive from the curriculum. But neuroscience research has swung the pendulum back — and 24 U.S. states now require cursive instruction again. Here's why:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-5 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                            <h3 className="font-bold text-blue-900 text-sm mb-2">🧠 Brain Development</h3>
                            <p className="text-blue-700 text-xs">
                                A 2023 study in <em>Frontiers in Psychology</em> found that cursive activates more brain regions than typing or print writing — improving memory, reading comprehension, and idea generation.
                            </p>
                        </div>
                        <div className="p-5 bg-green-50 rounded-xl border-l-4 border-green-400">
                            <h3 className="font-bold text-green-900 text-sm mb-2">✍️ Writing Speed</h3>
                            <p className="text-green-700 text-xs">
                                Once learned, cursive is significantly faster than print because letters connect without lifting the pencil. This matters for note-taking and timed tests.
                            </p>
                        </div>
                        <div className="p-5 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                            <h3 className="font-bold text-purple-900 text-sm mb-2">📖 Reading Old Documents</h3>
                            <p className="text-purple-700 text-xs">
                                Without cursive skills, kids can't read handwritten letters from grandparents, historical documents, or even their teacher's board notes.
                            </p>
                        </div>
                        <div className="p-5 bg-pink-50 rounded-xl border-l-4 border-pink-400">
                            <h3 className="font-bold text-pink-900 text-sm mb-2">🎯 Focus & Discipline</h3>
                            <p className="text-pink-700 text-xs">
                                The rhythmic, flowing motion of cursive is almost meditative. Many teachers report that cursive practice calms fidgety kids and improves concentration.
                            </p>
                        </div>
                    </div>
                </div>

                {/* When to Start */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#073B4C] mb-4">When Should Kids Start Learning Cursive?</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                            <h3 className="font-semibold text-yellow-800">Ages 3-5: Build the Foundation First</h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Don't jump to cursive yet. Focus on print letter tracing, fine motor skills, and pencil grip. Use our{' '}
                                <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Name Tracing Generator</a>{' '}
                                and{' '}
                                <a href="/worksheets/scissor-skills-generator" className="text-blue-600 hover:text-blue-800 underline">Scissor Skills Generator</a>{' '}
                                to build these skills.
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <h3 className="font-semibold text-green-800">Ages 6-7 (1st-2nd Grade): Introduce Pre-Cursive</h3>
                            <p className="text-sm text-green-700 mt-1">
                                Start with pre-cursive strokes — loops, waves, and connected lines. Some schools use D'Nealian style, which bridges print and cursive. Our{' '}
                                <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Handwriting Worksheet Maker</a>{' '}
                                offers D'Nealian and cursive font options.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <h3 className="font-semibold text-blue-800">Ages 7-8 (2nd-3rd Grade): Full Cursive Letters</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                This is the traditional starting point for cursive in most curricula. Begin with lowercase letters, starting with the easiest ones (c, a, d, g, o). Then move to capitals.
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                            <h3 className="font-semibold text-purple-800">Ages 8-10 (3rd-5th Grade): Fluency & Speed</h3>
                            <p className="text-sm text-purple-700 mt-1">
                                By now they should know all letters. Focus shifts to connecting letters smoothly, writing whole words, and building speed for note-taking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Learning Order */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#073B4C] mb-4">The Best Order to Teach Cursive Letters</h2>
                    <p className="text-gray-600 mb-4">
                        Don't teach cursive alphabetically (a, b, c...). Instead, group letters by similar strokes. Here's the proven sequence most handwriting programs recommend:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-5 rounded-xl">
                            <h3 className="font-bold text-green-900 mb-2 text-sm">Group 1: Undercurve Starters</h3>
                            <p className="text-green-700 text-2xl font-serif italic tracking-wider mb-1">i, t, u, w, r, s</p>
                            <p className="text-green-600 text-xs">Start here — these use the simplest upward stroke</p>
                        </div>
                        <div className="bg-blue-50 p-5 rounded-xl">
                            <h3 className="font-bold text-blue-900 mb-2 text-sm">Group 2: Downcurve Starters</h3>
                            <p className="text-blue-700 text-2xl font-serif italic tracking-wider mb-1">a, c, d, g, o, q</p>
                            <p className="text-blue-600 text-xs">Same starting motion — learn one, learn them all</p>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-xl">
                            <h3 className="font-bold text-purple-900 mb-2 text-sm">Group 3: Overcurve Starters</h3>
                            <p className="text-purple-700 text-2xl font-serif italic tracking-wider mb-1">n, m, v, x, y, z</p>
                            <p className="text-purple-600 text-xs">Adds the hump motion — builds on Group 1 skills</p>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-xl">
                            <h3 className="font-bold text-orange-900 mb-2 text-sm">Group 4: Loop & Special Letters</h3>
                            <p className="text-orange-700 text-2xl font-serif italic tracking-wider mb-1">b, e, f, h, j, k, l, p</p>
                            <p className="text-orange-600 text-xs">Loops and tails — save these for last as they're hardest</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
                        <p className="text-gray-600 text-sm">
                            <strong>Pro tip:</strong> After each group, have kids practice connecting letters into real words. Use our{' '}
                            <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline font-semibold">Handwriting Worksheet Maker</a>{' '}
                            with cursive font to create word practice sheets. Type words like "cat", "dog", "run" that use letters they've already learned.
                        </p>
                    </div>
                </div>

                {/* Practice Activities */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-center text-[#073B4C] mb-6">8 Fun Cursive Practice Activities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-pink-200 text-pink-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">1</span>
                                <h3 className="font-bold text-pink-900 text-sm">Cursive Name Art</h3>
                            </div>
                            <p className="text-pink-700 text-xs">
                                Write their name in cursive, then decorate each letter with patterns, colors, or doodles. Make it a fridge-worthy masterpiece.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-blue-200 text-blue-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">2</span>
                                <h3 className="font-bold text-blue-900 text-sm">Rainbow Cursive</h3>
                            </div>
                            <p className="text-blue-700 text-xs">
                                Write the same word in cursive 6 times, each in a different rainbow color. The repetition builds muscle memory while the colors keep it fun.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-green-200 text-green-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">3</span>
                                <h3 className="font-bold text-green-900 text-sm">Spelling Words in Cursive</h3>
                            </div>
                            <p className="text-green-700 text-xs">
                                Two birds, one stone: practice this week's spelling words in cursive. Use our{' '}
                                <a href="/worksheets/spelling-list-generator" className="text-blue-600 hover:text-blue-800 underline">Spelling Generator</a> to create tracing sheets.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-yellow-200 text-yellow-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">4</span>
                                <h3 className="font-bold text-yellow-900 text-sm">Letter to Grandma</h3>
                            </div>
                            <p className="text-yellow-700 text-xs">
                                Give cursive a real purpose — write a short letter to a grandparent. Even 2-3 sentences in cursive feel special and meaningful to the recipient.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-purple-200 text-purple-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">5</span>
                                <h3 className="font-bold text-purple-900 text-sm">Cursive Copywork</h3>
                            </div>
                            <p className="text-purple-700 text-xs">
                                Copy a favorite quote, poem, or book passage in cursive. Great for 3rd-5th graders — builds reading comprehension while practicing handwriting.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-teal-200 text-teal-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">6</span>
                                <h3 className="font-bold text-teal-900 text-sm">Whiteboard First</h3>
                            </div>
                            <p className="text-teal-700 text-xs">
                                Practice new letters on a whiteboard before paper. The bigger strokes build confidence, and mistakes erase easily — less frustration.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-orange-200 text-orange-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">7</span>
                                <h3 className="font-bold text-orange-900 text-sm">Secret Message</h3>
                            </div>
                            <p className="text-orange-700 text-xs">
                                Write a secret message in cursive for a sibling or parent. If they can't read cursive — even better! Motivates kids who think cursive is "a secret code."
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-md">
                            <div className="flex items-center mb-2">
                                <span className="bg-red-200 text-red-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-2">8</span>
                                <h3 className="font-bold text-red-900 text-sm">Certificate Reward</h3>
                            </div>
                            <p className="text-red-700 text-xs">
                                After mastering each letter group, print a{' '}
                                <a href="/worksheets/certificate-maker" className="text-blue-600 hover:text-blue-800 underline">personalized certificate</a>! Tangible rewards boost motivation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Common Mistakes */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#073B4C] mb-4">5 Common Cursive Mistakes (and How to Fix Them)</h2>
                    <div className="space-y-4">
                        <div className="flex items-start p-4 bg-red-50 rounded-lg">
                            <span className="text-2xl mr-3 mt-1">❌</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm">Letters don't sit on the line</h3>
                                <p className="text-red-700 text-xs mt-1">
                                    <strong>Fix:</strong> Use worksheets with clear baseline guides. Our{' '}
                                    <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Handwriting Maker</a>{' '}
                                    includes guide lines in every PDF.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-red-50 rounded-lg">
                            <span className="text-2xl mr-3 mt-1">❌</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm">Inconsistent letter size</h3>
                                <p className="text-red-700 text-xs mt-1">
                                    <strong>Fix:</strong> Practice between two lines (midline and baseline). Remind them: short letters (a, c, e) stay below the midline, tall letters (b, d, h) reach the top.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-red-50 rounded-lg">
                            <span className="text-2xl mr-3 mt-1">❌</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm">Lifting the pencil between letters</h3>
                                <p className="text-red-700 text-xs mt-1">
                                    <strong>Fix:</strong> Start with 2-3 letter words first (e.g., "it", "us", "at"). Master the connection before adding more letters.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-red-50 rounded-lg">
                            <span className="text-2xl mr-3 mt-1">❌</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm">Gripping the pencil too tight</h3>
                                <p className="text-red-700 text-xs mt-1">
                                    <strong>Fix:</strong> Use a pencil grip aid or have them hold a small ball (like a marble) in their ring/pinky fingers while writing. This forces a relaxed tripod grip.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-red-50 rounded-lg">
                            <span className="text-2xl mr-3 mt-1">❌</span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm">Rushing through practice</h3>
                                <p className="text-red-700 text-xs mt-1">
                                    <strong>Fix:</strong> Quality over speed. Have them trace slowly first (dotted letters), then write independently. 5 good words beat 20 sloppy ones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Free Worksheets */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-4">Free Cursive Practice Worksheets</h2>
                    <p className="text-purple-100 mb-6">
                        Create unlimited cursive tracing worksheets with any word, name, or sentence. No signup, no watermarks — just type and download.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/worksheets/handwriting-worksheet-maker" className="bg-white/10 hover:bg-white/20 transition-colors p-5 rounded-xl text-center">
                            <span className="text-3xl block mb-2">✍️</span>
                            <h3 className="font-bold text-white mb-1 text-sm">Handwriting Maker</h3>
                            <p className="text-purple-200 text-xs">Cursive, D'Nealian, print — any style, any word</p>
                        </a>
                        <a href="/worksheets/handwriting-worksheet-maker" className="bg-white/10 hover:bg-white/20 transition-colors p-5 rounded-xl text-center">
                            <span className="text-3xl block mb-2">📝</span>
                            <h3 className="font-bold text-white mb-1 text-sm">Name Tracing</h3>
                            <p className="text-purple-200 text-xs">Practice their name in cursive</p>
                        </a>
                        <a href="/worksheets/spelling-list-generator" className="bg-white/10 hover:bg-white/20 transition-colors p-5 rounded-xl text-center">
                            <span className="text-3xl block mb-2">📚</span>
                            <h3 className="font-bold text-white mb-1 text-sm">Spelling Generator</h3>
                            <p className="text-purple-200 text-xs">Spelling words in cursive tracing</p>
                        </a>
                    </div>
                </div>

                {/* Print vs Cursive */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-[#073B4C] mb-4">Print vs. Cursive vs. D'Nealian: What's the Difference?</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left p-3 font-bold text-gray-800 border-b-2 border-gray-300">Style</th>
                                    <th className="text-left p-3 font-bold text-gray-800 border-b-2 border-gray-300">What It Looks Like</th>
                                    <th className="text-left p-3 font-bold text-gray-800 border-b-2 border-gray-300">Best For</th>
                                    <th className="text-left p-3 font-bold text-gray-800 border-b-2 border-gray-300">Ages</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="p-3 font-semibold text-gray-800">Print (Block)</td>
                                    <td className="p-3 text-gray-600">Separate letters: A B C</td>
                                    <td className="p-3 text-gray-600">First writing, reading readiness</td>
                                    <td className="p-3 text-gray-600">3-6</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <td className="p-3 font-semibold text-gray-800">D'Nealian</td>
                                    <td className="p-3 text-gray-600">Slanted print with tails</td>
                                    <td className="p-3 text-gray-600">Transition from print to cursive</td>
                                    <td className="p-3 text-gray-600">5-7</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="p-3 font-semibold text-gray-800">Cursive</td>
                                    <td className="p-3 text-gray-600 italic">Connected flowing letters</td>
                                    <td className="p-3 text-gray-600">Speed, fluency, signatures</td>
                                    <td className="p-3 text-gray-600">7-10+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">
                        Our{' '}
                        <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline font-semibold">Handwriting Worksheet Maker</a>{' '}
                        supports all three styles — so you can create practice sheets for whichever stage your child is at.
                    </p>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-center text-[#073B4C] mb-6">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">Is cursive still taught in schools?</summary>
                            <p className="mt-3 text-gray-600">
                                It varies by state and district. As of 2026, 24 U.S. states require cursive instruction — usually starting in 2nd or 3rd grade. Even if your school doesn't teach it, you can easily supplement at home with our free{' '}
                                <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Handwriting Worksheet Maker</a>{' '}
                                (select the cursive font option).
                            </p>
                        </details>
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">What grade do kids learn cursive?</summary>
                            <p className="mt-3 text-gray-600">
                                Traditionally, cursive is introduced in <strong>2nd or 3rd grade</strong> (ages 7-8). Some programs start pre-cursive strokes in 1st grade. If your child shows interest earlier, there's no harm in introducing basic cursive letters — but make sure they're comfortable with print letters first.
                            </p>
                        </details>
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">Should I teach uppercase or lowercase cursive first?</summary>
                            <p className="mt-3 text-gray-600">
                                <strong>Lowercase first.</strong> Unlike print writing (where uppercase is easier), cursive lowercase letters are simpler and more commonly used. Start with lowercase, master all 26 letters, then introduce uppercase cursive capitals.
                            </p>
                        </details>
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">How long does it take to learn cursive?</summary>
                            <p className="mt-3 text-gray-600">
                                With consistent daily practice (10-15 minutes), most children can learn all cursive letters in <strong>3-4 months</strong> and achieve fluency within a school year. The key is daily consistency — not long marathon sessions.
                            </p>
                        </details>
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">Where can I get free cursive practice worksheets?</summary>
                            <p className="mt-3 text-gray-600">
                                You can create unlimited free cursive worksheets at{' '}
                                <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Wizqo's Handwriting Worksheet Maker</a>.
                                Select the cursive font, type any word or sentence, and download a PDF instantly. No account needed. Also check our{' '}
                                <a href="/blog/best-free-handwriting-worksheet-generators" className="text-blue-600 hover:text-blue-800 underline">comparison of the best free generators</a>.
                            </p>
                        </details>
                        <details className="bg-gray-50 rounded-lg p-4 group">
                            <summary className="font-semibold text-[#073B4C] cursor-pointer">Is D'Nealian the same as cursive?</summary>
                            <p className="mt-3 text-gray-600">
                                Not exactly. D'Nealian is a <strong>transitional style</strong> that looks like slanted print with small tails on the letters. It's designed to make the switch from print to cursive easier. Many schools use D'Nealian in 1st grade, then transition to full cursive in 2nd-3rd grade.
                            </p>
                        </details>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-lg shadow-xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Start Cursive Practice Today — Free!</h2>
                    <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
                        Type any word. Select cursive font. Download a beautiful tracing worksheet in seconds. Works for individual letters, words, names, and full sentences.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="/worksheets/handwriting-worksheet-maker" className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform">
                            Create Cursive Worksheets →
                        </a>
                        <a href="/worksheets/handwriting-worksheet-maker" className="inline-block bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transform hover:scale-105 transition-transform border-2 border-white">
                            Cursive Name Tracing →
                        </a>
                    </div>
                    <ul className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mt-8 text-indigo-100">
                        <li className="flex items-center">
                            <span className="text-2xl mr-2">✅</span> No sign-up required
                        </li>
                        <li className="flex items-center">
                            <span className="text-2xl mr-2">✅</span> Print, D'Nealian & Cursive
                        </li>
                        <li className="flex items-center">
                            <span className="text-2xl mr-2">✅</span> Unlimited downloads
                        </li>
                    </ul>
                </div>
            </main>

            <footer className="text-center mt-12 py-8 border-t border-gray-300">
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Cursive is a skill worth learning — for the brain, for the hand, and for the heart.
                    Explore more:{' '}
                    <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Handwriting Maker</a>,{' '}
                    <a href="/worksheets/handwriting-worksheet-maker" className="text-blue-600 hover:text-blue-800 underline">Name Tracing</a>,{' '}
                    <a href="/blog/how-to-improve-handwriting" className="text-blue-600 hover:text-blue-800 underline">Handwriting Guide</a>,{' '}
                    <a href="/blog/best-free-handwriting-worksheet-generators" className="text-blue-600 hover:text-blue-800 underline">Generator Comparison</a>, or{' '}
                    <a href="/blog/free-printable-name-tracing-worksheets-preschool" className="text-blue-600 hover:text-blue-800 underline">Name Tracing Ideas</a>.
                </p>
            </footer>
        </div>
    );
}
