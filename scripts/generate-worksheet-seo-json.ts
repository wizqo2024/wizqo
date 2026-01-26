import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { WORKSHEET_SEO_MAP, HUB_SEO_DATA } from '../shared/worksheetSEO.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Generate a simplified JSON mapping for client-side SEO updates
const seoData: Record<string, {
  title: string
  description: string
  keywords: string
  canonicalUrl: string
  learningObjectives: string[]
  grade: string[]
  category: string[]
  h1: string
  richContent?: string
}> = {}

// ============================================================================
// CATEGORY-SPECIFIC CONTENT TEMPLATES
// Each category has unique educational context to avoid duplicate content
// ============================================================================

interface ContentParams {
  name: string;
  h1: string;
  grade: string[];
  category: string[];
  objectives: string[];
  docId: string;
}

// Generate a hash-based selector for variation (uses docId for consistency)
function getVariationIndex(docId: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < docId.length; i++) {
    hash = ((hash << 5) - hash) + docId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

// Grade-specific learning context
const GRADE_CONTEXTS: Record<string, string> = {
  'Kindergarten': 'early learners developing foundational number sense and pre-reading skills',
  '1st Grade': 'students building fluency in basic addition, subtraction, and phonics',
  '2nd Grade': 'learners mastering two-digit operations and reading comprehension basics',
  '3rd Grade': 'students transitioning to multiplication, division, and multi-step word problems',
  '4th Grade': 'learners tackling fractions, decimals, and multi-digit calculations',
  '5th Grade': 'students preparing for middle school with advanced operations and algebraic thinking',
  'Elementary': 'young learners building essential academic foundations'
};

// Category-specific pedagogical content
const CATEGORY_INTROS: Record<string, string[]> = {
  'Multiplication': [
    'Multiplication mastery is the gateway to advanced mathematics. When students develop automaticity with times tables, they free up cognitive resources for complex problem-solving, fraction operations, and algebraic reasoning.',
    'Understanding multiplication as repeated addition and equal groups builds the conceptual foundation that prevents future math anxiety. Our worksheets progress from visual arrays to abstract computation.',
    'Research shows that students who achieve multiplication fluency by 4th grade are significantly more likely to succeed in higher-level math courses. This worksheet targets that critical skill development.'
  ],
  'Division': [
    'Division is the inverse of multiplication and essential for understanding fractions, ratios, and proportional reasoning. These worksheets help students see division as both "sharing equally" and "grouping."',
    'Mastering division facts reduces cognitive load when solving complex word problems and multi-step equations. Our structured approach builds confidence through progressive difficulty levels.',
    'Understanding the relationship between multiplication and division creates flexible mathematical thinkers who can approach problems from multiple angles.'
  ],
  'Addition-Subtraction': [
    'Fluency in addition and subtraction within 20 is the cornerstone of all arithmetic learning. Students who master these facts early develop the mental math skills essential for everyday life and advanced mathematics.',
    'Our addition and subtraction worksheets emphasize number relationships, fact families, and mental strategies that go beyond rote memorization to build true mathematical understanding.',
    'Building strong addition and subtraction foundations prepares students for regrouping, multi-digit operations, and algebraic thinking in later grades.'
  ],
  'Fractions': [
    'Fractions represent one of the most challenging yet essential concepts in elementary mathematics. Our worksheets use visual models, number lines, and real-world contexts to make fractions intuitive.',
    'Understanding fractions is critical for success in algebra, geometry, and real-world applications like cooking, measurement, and finance. We build from concrete to abstract representations.',
    'Students who develop strong fraction sense are better prepared for ratios, proportions, and percentages—skills that extend far beyond the math classroom.'
  ],
  'Decimals': [
    'Decimals connect fractions to our base-ten number system and are essential for money, measurement, and scientific notation. Our worksheets bridge the gap between these related concepts.',
    'Decimal fluency enables students to work confidently with calculators, spreadsheets, and real-world data. We focus on place value understanding, not just procedural computation.',
    'Mastering decimal operations prepares students for percentages, scientific measurement, and the quantitative reasoning required in STEM fields.'
  ],
  'Geometry': [
    'Geometry develops spatial reasoning and visual-analytical skills that transfer to art, architecture, engineering, and everyday problem-solving. Our worksheets make abstract shapes concrete.',
    'Understanding geometric properties and relationships builds the foundation for coordinate graphing, transformations, and trigonometry in later grades.',
    'Spatial reasoning skills developed through geometry practice correlate strongly with success in science, technology, and mathematical modeling.'
  ],
  'Measurement': [
    'Measurement connects mathematics to the physical world. Students learn to quantify length, weight, volume, and time—skills essential for cooking, construction, science, and daily life.',
    'Our measurement worksheets emphasize both customary and metric systems, preparing students for real-world applications and scientific inquiry.',
    'Understanding units and conversion develops proportional reasoning and dimensional analysis skills used throughout science and engineering.'
  ],
  'Place Value': [
    'Place value is the foundation of our number system. Deep understanding of how digits represent different values enables mental math, estimation, and multi-digit computation.',
    'Students who truly understand place value can compose and decompose numbers flexibly, leading to more efficient calculation strategies and stronger number sense.',
    'Place value concepts extend from whole numbers through decimals, making this understanding essential for all future mathematical learning.'
  ],
  'Counting': [
    'Counting is the first mathematical skill children develop, and it remains foundational for all arithmetic. Our worksheets build number sense through patterns, sequences, and one-to-one correspondence.',
    'Skip counting lays the groundwork for multiplication and division. We help students see patterns in numbers that make math feel logical rather than arbitrary.',
    'Strong counting skills enable students to estimate, compare quantities, and develop the number sense that underlies all mathematical reasoning.'
  ],
  'Reading': [
    'Reading comprehension is the gateway to all academic learning. Our passages are carefully crafted to build vocabulary, inference skills, and critical thinking through engaging content.',
    'Active reading strategies—predicting, questioning, summarizing—help students become independent learners who can extract meaning from any text they encounter.',
    'Research shows that students who read with comprehension in early grades are more successful across all subjects. Our worksheets build these essential literacy skills.'
  ],
  'Handwriting': [
    'Handwriting practice develops fine motor skills and reinforces letter recognition and spelling. The physical act of forming letters activates neural pathways that support reading and memory.',
    'Legible handwriting remains essential for note-taking, test-taking, and personal communication. Our worksheets provide structured practice for proper letter formation.',
    'Studies show that students who practice handwriting demonstrate better reading skills, stronger memory retention, and improved written expression.'
  ],
  'Phonics': [
    'Phonics instruction teaches the systematic relationship between letters and sounds, providing students with the decoding skills essential for independent reading.',
    'Our phonics worksheets progress from letter sounds through blends, digraphs, and word families, building a complete toolkit for word recognition.',
    'Strong phonemic awareness is the best predictor of early reading success. We make these abstract sound-symbol relationships concrete and accessible.'
  ],
  'Patterns': [
    'Pattern recognition is fundamental to mathematical thinking. Students who can identify and extend patterns develop the algebraic reasoning skills essential for advanced math.',
    'Understanding patterns helps students predict, generalize, and see mathematics as a system of relationships rather than isolated facts to memorize.',
    'Pattern work builds the foundation for sequences, functions, and the logical thinking required in computer science and problem-solving.'
  ],
  'Time': [
    'Telling time connects mathematics to daily life and develops students\' understanding of measurement and number relationships. Our worksheets progress from hourly to minute intervals.',
    'Time concepts extend beyond reading clocks to include elapsed time, scheduling, and time management—skills essential for academic and life success.',
    'Understanding time develops sequential thinking and the ability to plan and organize, supporting executive function skills used across all learning.'
  ],
  'Money': [
    'Money concepts make mathematics relevant and practical. Students learn to count coins, make change, and solve real-world problems involving purchase and saving.',
    'Working with money develops place value understanding through decimals and builds the financial literacy skills essential for responsible adulthood.',
    'Our money worksheets progress from coin identification through multi-step word problems, building practical mathematical reasoning.'
  ],
  'Shapes': [
    'Shape recognition is the first step in geometric understanding. Students learn to identify, describe, and compare shapes based on their defining attributes.',
    'Understanding shapes develops spatial vocabulary and visual discrimination skills that transfer to reading, art, and scientific observation.',
    'Our shape worksheets build from basic identification through composition and decomposition, laying the foundation for geometric reasoning.'
  ],
  'Word Problems': [
    'Word problems develop the mathematical reasoning skills needed to apply computation to real situations. Students learn to identify relevant information and choose appropriate operations.',
    'Solving word problems builds reading comprehension, logical thinking, and the ability to translate between mathematical and everyday language.',
    'Multi-step word problems prepare students for the complex reasoning required in science, engineering, and real-world decision-making.'
  ],
  'Order of Operations': [
    'Order of operations (PEMDAS) establishes the mathematical conventions that ensure consistent results. This foundational skill is essential for algebra and all higher mathematics.',
    'Understanding why we follow a specific order develops logical thinking and attention to detail—skills that transfer to programming, science, and systematic problem-solving.',
    'Mastering order of operations prepares students for algebraic expressions, equations, and the mathematical notation used throughout STEM fields.'
  ],
  'Tracing': [
    'Tracing develops the fine motor control and hand-eye coordination essential for handwriting success. Students build muscle memory for proper stroke formation.',
    'Our tracing worksheets progress from lines and curves through letters and numbers, building the physical skills needed for fluent writing.',
    'The focused attention required for careful tracing also builds concentration and self-regulation skills that support all academic learning.'
  ],
  'Coloring': [
    'Educational coloring activities combine creativity with learning, engaging multiple senses and learning styles to reinforce concepts and vocabulary.',
    'Coloring develops fine motor skills, color recognition, and the ability to follow directions while keeping students engaged with educational content.',
    'Our coloring worksheets integrate learning objectives with creative expression, making practice enjoyable and memorable.'
  ]
};

// Unique closing paragraphs (selected based on docId hash)
const CLOSING_PARAGRAPHS = [
  'Every worksheet includes a comprehensive answer key, enabling immediate feedback and supporting independent learning. Students can self-check their work and learn from mistakes in real-time.',
  'Designed for flexibility, these worksheets work equally well for classroom instruction, homework practice, or homeschool curriculum. Print as many copies as needed at no cost.',
  'Our clean, distraction-free design keeps students focused on learning. High-contrast layouts support visual accessibility and ensure clear printing on any standard printer.',
  'Progressive difficulty levels allow students to build confidence with simpler problems before advancing to more challenging content. Success breeds success.',
  'Aligned with Common Core and state standards, these worksheets provide targeted practice on the skills students need to demonstrate proficiency.',
  'Perfect for morning warm-ups, math centers, or quick assessments, these worksheets fit seamlessly into any instructional routine.',
  'Comprehensive skill coverage ensures no gaps in understanding. Use these worksheets for initial instruction, review, or intervention as needed.',
  'Students develop both accuracy and speed through regular practice. Consistent exposure builds the automaticity that frees mental resources for complex problem-solving.',
  'Parent-friendly answer keys make homework help stress-free. Support your child\'s learning without needing to remember every math concept yourself.',
  'Join thousands of educators who trust Wizqo for high-quality, free resources. Our commitment to educational excellence means you always get the best.'
];

// Generate unique rich content for a worksheet
function generateUniqueContent(params: ContentParams): string {
  const { name, h1, grade, category, objectives, docId } = params;

  // Build grade context string
  const gradeList = grade.length > 0 ? grade.join(', ') : 'Elementary';
  const gradeContext = grade.length > 0
    ? GRADE_CONTEXTS[grade[0]] || 'students building essential academic skills'
    : 'students building essential academic skills';

  // Select category intro (vary by docId)
  const primaryCategory = category[0] || 'Math';
  const categoryIntros = CATEGORY_INTROS[primaryCategory] || CATEGORY_INTROS['Addition-Subtraction'];
  const introIndex = getVariationIndex(docId, categoryIntros.length);
  const categoryIntro = categoryIntros[introIndex];

  // Select closing paragraph (vary by docId)
  const closingIndex = getVariationIndex(docId + '-closing', CLOSING_PARAGRAPHS.length);
  const closingParagraph = CLOSING_PARAGRAPHS[closingIndex];

  // Build learning objectives list (use actual objectives or generate from name)
  let objectivesList = '';
  if (objectives && objectives.length > 0) {
    objectivesList = objectives.slice(0, 4).map(obj =>
      `<li style="margin-bottom: 0.5rem;">${obj}</li>`
    ).join('\n            ');
  } else {
    // Generate contextual objectives if none provided
    objectivesList = `
            <li style="margin-bottom: 0.5rem;">Develop proficiency with ${name.toLowerCase()} concepts</li>
            <li style="margin-bottom: 0.5rem;">Build confidence through structured practice and immediate feedback</li>
            <li style="margin-bottom: 0.5rem;">Strengthen foundational skills for future academic success</li>`;
  }

  // Build unique secondary section based on category
  const secondarySection = buildSecondarySection(primaryCategory, name, gradeList, docId);

  return `
      <article style="max-width: 1200px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">${h1} - Free Printable Worksheet</h1>
        
        <p style="font-size: 1.125rem; color: #475569; margin-bottom: 2rem; line-height: 1.6;">
          This <strong>${name}</strong> worksheet is designed specifically for ${gradeContext}. ${categoryIntro}
        </p>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">What Students Will Learn</h2>
          <ul style="color: #475569; line-height: 1.8; padding-left: 1.5rem;">
            ${objectivesList}
          </ul>
        </section>

        ${secondarySection}

        <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem;">Why Choose This ${primaryCategory} Worksheet</h2>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">
            ${closingParagraph} Suitable for ${gradeList} students, this resource provides the targeted practice needed to build lasting skills.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Download this free ${name.toLowerCase()} PDF today and give your students the focused practice they need. With clear instructions, ample workspace, and complete answer keys, Wizqo worksheets make teaching and learning more effective.
          </p>
        </section>
      </article>
    `;
}

// Build category-specific secondary sections
function buildSecondarySection(category: string, name: string, gradeList: string, docId: string): string {
  const variations = getVariationIndex(docId + '-section', 3);

  switch (category) {
    case 'Multiplication':
      const multSections = [
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Building Times Table Fluency</h2>
          <p style="color: #475569; line-height: 1.6;">Multiplication fluency develops through consistent, focused practice. This ${name} worksheet provides the repetition needed to move facts from working memory to long-term recall, freeing cognitive resources for complex problem-solving.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">From Arrays to Algorithms</h2>
          <p style="color: #475569; line-height: 1.6;">Understanding multiplication as equal groups and arrays builds the conceptual foundation for the standard algorithm. This worksheet reinforces both the visual models and symbolic notation students need for ${gradeList} success.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Multiplication Strategies That Work</h2>
          <p style="color: #475569; line-height: 1.6;">Skip counting, doubling, and pattern recognition all support multiplication mastery. This practice sheet helps students discover these strategies naturally while building procedural fluency.</p>
        </section>`
      ];
      return multSections[variations];

    case 'Fractions':
      const fracSections = [
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Understanding Parts of a Whole</h2>
          <p style="color: #475569; line-height: 1.6;">Fractions represent equal parts of a whole or set. This ${name} worksheet uses visual models to make the abstract concept of fractional quantities concrete and understandable for ${gradeList} learners.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Fractions on the Number Line</h2>
          <p style="color: #475569; line-height: 1.6;">Seeing fractions as points on a number line develops the number sense needed for comparing, ordering, and operating with fractions. This worksheet builds that essential understanding.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Real-World Fraction Applications</h2>
          <p style="color: #475569; line-height: 1.6;">From cooking to construction, fractions appear everywhere. This practice helps students connect mathematical notation to meaningful contexts they encounter daily.</p>
        </section>`
      ];
      return fracSections[variations];

    case 'Reading':
      const readingSections = [
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Active Reading Strategies</h2>
          <p style="color: #475569; line-height: 1.6;">Good readers predict, question, and summarize as they read. This ${name} passage provides opportunities to practice these comprehension strategies that transfer to all reading situations.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Building Vocabulary Through Context</h2>
          <p style="color: #475569; line-height: 1.6;">Encountering new words in meaningful context is the most effective way to build vocabulary. This reading worksheet exposes students to rich language while supporting comprehension.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">From Decoding to Deep Understanding</h2>
          <p style="color: #475569; line-height: 1.6;">Reading comprehension goes beyond recognizing words. This passage challenges students to make inferences, identify main ideas, and think critically about what they read.</p>
        </section>`
      ];
      return readingSections[variations];

    case 'Handwriting':
    case 'Tracing':
      const hwSections = [
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Developing Fine Motor Skills</h2>
          <p style="color: #475569; line-height: 1.6;">The controlled movements required for this ${name} activity strengthen the small muscles needed for fluid handwriting. Regular practice builds the stamina for extended writing tasks.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Proper Letter Formation</h2>
          <p style="color: #475569; line-height: 1.6;">Consistent stroke patterns lead to legible, efficient handwriting. This worksheet guides students through correct letter formation that prevents bad habits and supports writing fluency.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">The Brain-Hand Connection</h2>
          <p style="color: #475569; line-height: 1.6;">Writing by hand activates neural pathways that support memory and learning. This practice worksheet leverages the hand-brain connection to reinforce letter and word recognition.</p>
        </section>`
      ];
      return hwSections[variations];

    default:
      // Generic but still varied sections for other categories
      const defaultSections = [
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Practice Makes Progress</h2>
          <p style="color: #475569; line-height: 1.6;">Consistent, focused practice is the key to academic success. This ${name} worksheet provides the structured repetition that builds lasting skills and confidence for ${gradeList} students.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Building Strong Foundations</h2>
          <p style="color: #475569; line-height: 1.6;">Every complex skill is built on simpler ones. This worksheet ensures students have the foundational understanding they need before advancing to more challenging concepts.</p>
        </section>`,
        `<section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Learning Through Engagement</h2>
          <p style="color: #475569; line-height: 1.6;">Active engagement produces deeper learning than passive review. This ${name} practice challenges students to apply their understanding, not just recall information.</p>
        </section>`
      ];
      return defaultSections[variations];
  }
}

// Main processing loop
for (const [docId, seo] of Object.entries(WORKSHEET_SEO_MAP)) {
  const h1Text = seo.h1 || seo.title;
  let finalRich = seo.richContent || "";

  // If no custom rich content, generate unique content based on worksheet attributes
  if (!finalRich || finalRich.length < 100) {
    finalRich = generateUniqueContent({
      name: h1Text.replace(' Worksheet', '').replace(' - Free Printable PDF | Wizqo', ''),
      h1: h1Text,
      grade: seo.grade || [],
      category: seo.category || [],
      objectives: seo.learningObjectives || [],
      docId
    });
  }

  const slug = seo.slug || docId;
  seoData[slug] = {
    title: seo.title,
    description: seo.metaDescription,
    keywords: seo.keywords,
    canonicalUrl: `https://wizqo.com/worksheets/${slug}`,
    learningObjectives: seo.learningObjectives,
    grade: seo.grade,
    category: seo.category,
    h1: seo.h1,
    richContent: finalRich
  }
}

// Add Hub SEO data
for (const [slug, seo] of Object.entries(HUB_SEO_DATA)) {
  seoData[slug] = {
    title: seo.title || '',
    description: seo.metaDescription || '',
    keywords: seo.keywords || '',
    canonicalUrl: `https://wizqo.com/worksheets/${slug}`,
    learningObjectives: seo.learningObjectives || [],
    grade: seo.grade || [],
    category: seo.category || [],
    h1: seo.h1 || '',
    richContent: seo.richContent
  }
}

// Write to client/public directory so Vite copies it to build output
const outputPath = join(__dirname, '../client/public/worksheet-seo-data.json')
writeFileSync(outputPath, JSON.stringify(seoData, null, 2), 'utf-8')

console.log(`Generated worksheet SEO data JSON with ${Object.keys(seoData).length} worksheets`)
console.log(`Output: ${outputPath}`)
