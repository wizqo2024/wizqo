export type GradeBand = 'preK' | 'k1' | 'g2' | '35' | '68'

export interface InteractiveWorksheetDoc {
  id: string
  title: string
  description: string
  grades: GradeBand[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  focus: string[]
}

export interface InteractiveCategory {
  id: string
  label: string
  icon: string
  tagline: string
  longDescription: string
  topics: string[]
  docs: InteractiveWorksheetDoc[]
}

export const INTERACTIVE_GRADE_OPTIONS: Array<{ id: GradeBand; label: string }> = [
  { id: 'preK', label: 'Preschool' },
  { id: 'k1', label: 'K–1' },
  { id: 'g2', label: '2nd–3rd' },
  { id: '35', label: '4th–5th' },
  { id: '68', label: '6th–8th' },
]

const makeDoc = (
  doc: Partial<InteractiveWorksheetDoc> & { id: string; title: string }
): InteractiveWorksheetDoc => ({
  description: '',
  grades: ['k1'],
  difficulty: 'Beginner',
  focus: [],
  ...doc,
})

export const INTERACTIVE_CATEGORIES: InteractiveCategory[] = [
  {
    id: 'math',
    label: 'Math',
    icon: '🧠',
    tagline: 'Daily math practice with puzzles, drills, and logic.',
    longDescription:
      'Auto-generate interactive math worksheets that mix fluency drills with puzzles, word problems, and visual models. Perfect for warm-ups, stations, or homework.',
    topics: [
      'Addition & subtraction',
      'Fractions and place value',
      'Word problems',
      'Logic grids and puzzles',
    ],
    docs: [
      makeDoc({
        id: 'interactive-math-rhythm',
        title: 'Number Pattern Rhythm',
        description: 'Complete number patterns with skip counting sequences. Each sheet generates unique patterns.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['patterns', 'skip counting', 'number sense'],
      }),
      makeDoc({
        id: 'interactive-math-race',
        title: 'Math Race Challenge',
        description: 'Timed addition and subtraction challenges with varying difficulty levels.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['speed', 'fact fluency', 'mental math'],
      }),
      makeDoc({
        id: 'interactive-math-puzzle',
        title: 'Equation Puzzle Box',
        description: 'Solve missing number equations arranged in puzzle format. Each puzzle is unique.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['algebraic thinking', 'problem solving'],
      }),
      makeDoc({
        id: 'interactive-math-shapes',
        title: 'Geometry Shape Challenge',
        description: 'Identify, count, and classify shapes with interactive exercises.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['geometry', 'classification', 'spatial reasoning'],
      }),
      makeDoc({
        id: 'interactive-math-money',
        title: 'Money Math Mastery',
        description: 'Count coins, make change, and solve money word problems.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['money', 'decimals', 'real-world math'],
      }),
      makeDoc({
        id: 'interactive-math-fractions',
        title: 'Fraction Fun Practice',
        description: 'Compare fractions, find equivalents, and solve fraction operations.',
        grades: ['35', '68'],
        difficulty: 'Advanced',
        focus: ['fractions', 'equivalency', 'operations'],
      }),
      makeDoc({
        id: 'interactive-math-measurement',
        title: 'Measurement Mission',
        description: 'Practice length, weight, volume, and time measurement conversions.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['measurement', 'units', 'conversion'],
      }),
      makeDoc({
        id: 'interactive-math-algebra',
        title: 'Algebra Basics Practice',
        description: 'Solve equations, work with variables, and practice algebraic expressions.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['algebra', 'equations', 'variables', 'expressions'],
      }),
      makeDoc({
        id: 'interactive-math-percentages',
        title: 'Percentage & Ratio Mastery',
        description: 'Calculate percentages, work with ratios, and solve proportion problems.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['percentages', 'ratios', 'proportions', 'real-world math'],
      }),
      makeDoc({
        id: 'interactive-math-geometry',
        title: 'Advanced Geometry Challenge',
        description: 'Calculate area, perimeter, volume, and work with angles and transformations.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['geometry', 'area', 'perimeter', 'volume', 'angles'],
      }),
      makeDoc({
        id: 'interactive-math-statistics',
        title: 'Data & Statistics Explorer',
        description: 'Analyze data sets, create graphs, calculate mean, median, mode, and interpret statistics.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['statistics', 'data analysis', 'graphs', 'mean median mode'],
      }),
      makeDoc({
        id: 'interactive-math-word-problems',
        title: 'Multi-Step Word Problems',
        description: 'Solve complex word problems requiring multiple steps and critical thinking.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['word problems', 'problem solving', 'multi-step', 'critical thinking'],
      }),
    ],
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: '📚',
    tagline: 'Short passages with comprehension checks.',
    longDescription:
      'Print fiction and nonfiction passages with leveled questions, vocabulary focus, and answer keys. Includes grade-specific inference and context clues practice.',
    topics: [
      'Fiction & nonfiction passages',
      'Inference questions',
      'Vocabulary in context',
      'Reading logs & prompts',
    ],
    docs: [
      makeDoc({
        id: 'interactive-reading-adventure',
        title: 'Reading Adventure Quest',
        description: 'Interactive story passages with multiple choice and short answer questions. Each sheet features a new story.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['comprehension', 'inference', 'vocabulary'],
      }),
      makeDoc({
        id: 'interactive-reading-prek',
        title: 'Picture Story Time',
        description: 'Simple picture-based stories with yes/no questions and basic comprehension activities.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['picture reading', 'basic comprehension', 'storytelling'],
      }),
      makeDoc({
        id: 'interactive-reading-detective',
        title: 'Reading Detective Challenge',
        description: 'Find clues in the text to answer mystery questions. New mysteries each time.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['text evidence', 'critical thinking', 'inference'],
      }),
      makeDoc({
        id: 'interactive-reading-storymap',
        title: 'Story Map Builders',
        description: 'Retell fiction stories with beginning, middle, and ending organizers plus clue gathering practice.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['story structure', 'retelling', 'comprehension'],
      }),
      makeDoc({
        id: 'interactive-reading-vocab',
        title: 'Vocabulary Builder Workshop',
        description: 'Context clues exercises with word matching and sentence completion.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['vocabulary', 'context clues', 'word meaning'],
      }),
      makeDoc({
        id: 'interactive-reading-summary',
        title: 'Summary & Main Idea',
        description: 'Practice identifying main ideas and writing concise summaries.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['main idea', 'summarizing', 'key details'],
      }),
      makeDoc({
        id: 'interactive-reading-compare',
        title: 'Compare & Contrast Passages',
        description: 'Read multiple texts and compare themes, characters, or information.',
        grades: ['35', '68'],
        difficulty: 'Advanced',
        focus: ['comparing', 'analysis', 'critical thinking'],
      }),
      makeDoc({
        id: 'interactive-reading-literary-analysis',
        title: 'Literary Analysis Workshop',
        description: 'Analyze literary elements, themes, symbolism, and author\'s purpose in fiction texts.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['literary analysis', 'themes', 'symbolism', 'author\'s purpose'],
      }),
      makeDoc({
        id: 'interactive-reading-research',
        title: 'Research & Evidence Builder',
        description: 'Practice finding and evaluating sources, citing evidence, and building arguments from multiple texts.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['research', 'evidence', 'citations', 'argument building'],
      }),
    ],
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: '✍️',
    tagline: 'Creative prompts and handwriting practice.',
    longDescription:
      'Spark writing with printable prompts, handwriting practice, and planners that guide students from sentences to paragraphs.',
    topics: [
      'Sentence structure',
      'Creative prompts',
      'Handwriting practice',
      'Goal-setting journals',
    ],
    docs: [
      makeDoc({
        id: 'interactive-writing-prompts',
        title: 'Creative Writing Prompts',
        description: 'Unique story starters and creative writing prompts that change with each generation.',
        grades: ['g2', '35'],
        difficulty: 'Beginner',
        focus: ['creativity', 'storytelling', 'imagination'],
      }),
      makeDoc({
        id: 'interactive-writing-prek',
        title: 'Drawing & Labeling',
        description: 'Draw pictures and label them with simple words. Perfect for early writers.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['drawing', 'labeling', 'early writing'],
      }),
      makeDoc({
        id: 'interactive-writing-sentences',
        title: 'Sentence Builder Workshop',
        description: 'Practice building complete sentences with varied structures and punctuation.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['sentence structure', 'grammar', 'punctuation'],
      }),
      makeDoc({
        id: 'interactive-writing-poetry',
        title: 'Poetry Writing Practice',
        description: 'Guided poetry exercises with rhyming, haiku, and free verse prompts.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['poetry', 'figurative language', 'self-expression'],
      }),
      makeDoc({
        id: 'interactive-writing-opinion',
        title: 'Opinion Writing Framework',
        description: 'Structured templates for opinion writing with prompts and evidence gathering.',
        grades: ['35', '68'],
        difficulty: 'Advanced',
        focus: ['opinion writing', 'persuasion', 'evidence'],
      }),
      makeDoc({
        id: 'interactive-writing-research',
        title: 'Research Paper Planner',
        description: 'Organize research, create outlines, and structure research papers with proper citations.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['research', 'outlining', 'citations', 'academic writing'],
      }),
      makeDoc({
        id: 'interactive-writing-essay',
        title: 'Essay Writing Workshop',
        description: 'Practice writing structured essays with thesis statements, body paragraphs, and conclusions.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['essay writing', 'thesis statements', 'structure', 'academic writing'],
      }),
    ],
  },
  {
    id: 'science',
    label: 'Science',
    icon: '🌎',
    tagline: 'Hands-on STEM prompts and lab reflections.',
    longDescription:
      'Bring STEM topics to life with printable lab guides, observation charts, and quick facts that connect to real-world concepts.',
    topics: ['Human body', 'Plants & animals', 'Earth science', 'Space & physics'],
    docs: [
      makeDoc({
        id: 'interactive-science-observation',
        title: 'Science Observation Journal',
        description: 'Daily observation logs for experiments and nature studies. Each sheet features new prompts.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['observation', 'scientific method', 'recording'],
      }),
      makeDoc({
        id: 'interactive-science-prek',
        title: 'Nature Explorer',
        description: 'Simple nature observation activities with pictures and basic questions about plants, animals, and weather.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['nature observation', 'basic science', 'curiosity'],
      }),
      makeDoc({
        id: 'interactive-science-space',
        title: 'Space & Astronomy Explorer',
        description: 'Learn about planets, stars, and space phenomena with interactive activities.',
        grades: ['35', '68'],
        difficulty: 'Intermediate',
        focus: ['astronomy', 'space science', 'planets'],
      }),
      makeDoc({
        id: 'interactive-science-lifecycle',
        title: 'Life Cycle Explorer',
        description: 'Interactive worksheets exploring plant and animal life cycles.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['life cycles', 'biology', 'sequencing'],
      }),
      makeDoc({
        id: 'interactive-science-states',
        title: 'States of Matter Lab',
        description: 'Hands-on activities exploring solid, liquid, gas with observation charts.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['matter', 'physical science', 'experimentation'],
      }),
      makeDoc({
        id: 'interactive-science-weather',
        title: 'Weather Watcher Journal',
        description: 'Track weather patterns, temperature, and observations over time.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['weather', 'data collection', 'patterns'],
      }),
      makeDoc({
        id: 'interactive-science-chemistry',
        title: 'Chemistry Basics Lab',
        description: 'Explore atoms, molecules, chemical reactions, and the periodic table.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['chemistry', 'atoms', 'molecules', 'periodic table'],
      }),
      makeDoc({
        id: 'interactive-science-physics',
        title: 'Physics Fundamentals',
        description: 'Learn about forces, motion, energy, and simple machines with hands-on activities.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['physics', 'forces', 'motion', 'energy'],
      }),
      makeDoc({
        id: 'interactive-science-ecology',
        title: 'Ecology & Environment Study',
        description: 'Explore ecosystems, food webs, environmental issues, and conservation.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['ecology', 'ecosystems', 'environment', 'conservation'],
      }),
    ],
  },
  {
    id: 'geography',
    label: 'Social Studies',
    icon: '🗺️',
    tagline: 'Maps, timelines, and culture snapshots.',
    longDescription:
      'Download printable social studies worksheets that cover maps, history milestones, communities, and civics discussions.',
    topics: ['Continents & oceans', 'Timelines', 'Communities', 'Civics'],
    docs: [
      makeDoc({
        id: 'interactive-geography-map',
        title: 'Interactive Map Skills',
        description: 'Practice reading maps, using legends, and identifying locations. Each sheet features different maps.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['map skills', 'spatial awareness', 'geography'],
      }),
      makeDoc({
        id: 'interactive-geography-prek',
        title: 'My Community Explorer',
        description: 'Learn about places in the community, home, and school with simple maps and pictures.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['community', 'places', 'spatial concepts'],
      }),
      makeDoc({
        id: 'interactive-geography-culture',
        title: 'Culture Explorer',
        description: 'Learn about different cultures, traditions, and communities around the world.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['culture', 'world studies', 'diversity'],
      }),
      makeDoc({
        id: 'interactive-geography-history',
        title: 'Historical Timeline Builder',
        description: 'Create timelines and learn about historical events and figures.',
        grades: ['35', '68'],
        difficulty: 'Intermediate',
        focus: ['history', 'timelines', 'chronology'],
      }),
      makeDoc({
        id: 'interactive-geography-government',
        title: 'Civics & Government Explorer',
        description: 'Learn about government structure, citizenship, rights, and responsibilities.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['government', 'civics', 'citizenship', 'rights'],
      }),
      makeDoc({
        id: 'interactive-geography-economics',
        title: 'Economics Basics',
        description: 'Explore supply and demand, budgeting, financial literacy, and economic systems.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['economics', 'supply and demand', 'budgeting', 'financial literacy'],
      }),
    ],
  },
  {
    id: 'grammar',
    label: 'Grammar & Vocabulary',
    icon: '💬',
    tagline: 'Parts of speech, verb tenses, and word play.',
    longDescription:
      'Print grammar drills, vocabulary quizzes, and sentence repair challenges that work for both native speakers and ESL learners.',
    topics: ['Parts of speech', 'Verb tense practice', 'Synonyms & antonyms', 'Sentence correction'],
    docs: [
      makeDoc({
        id: 'interactive-grammar-parts',
        title: 'Parts of Speech Practice',
        description: 'Identify nouns, verbs, adjectives, and adverbs in sentences. Each sheet has new sentences.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['parts of speech', 'grammar', 'sentence analysis'],
      }),
      makeDoc({
        id: 'interactive-grammar-prek',
        title: 'Word & Picture Match',
        description: 'Match simple words with pictures and identify basic word types.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['word recognition', 'vocabulary', 'matching'],
      }),
      makeDoc({
        id: 'interactive-grammar-tenses',
        title: 'Verb Tense Mastery',
        description: 'Practice past, present, and future tense with verb conjugation exercises.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['verb tenses', 'grammar', 'conjugation'],
      }),
      makeDoc({
        id: 'interactive-grammar-antonyms',
        title: 'Synonyms & Antonyms Challenge',
        description: 'Match words with synonyms and antonyms to expand vocabulary.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['vocabulary', 'word relationships', 'language'],
      }),
      makeDoc({
        id: 'interactive-grammar-advanced',
        title: 'Advanced Grammar Practice',
        description: 'Practice complex sentence structures, clauses, phrases, and advanced punctuation.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['grammar', 'sentence structure', 'clauses', 'punctuation'],
      }),
      makeDoc({
        id: 'interactive-grammar-vocab',
        title: 'Academic Vocabulary Builder',
        description: 'Learn and practice academic vocabulary words with context clues and usage exercises.',
        grades: ['68'],
        difficulty: 'Advanced',
        focus: ['vocabulary', 'academic language', 'context clues'],
      }),
    ],
  },
  {
    id: 'art',
    label: 'Art & Coloring',
    icon: '🎨',
    tagline: 'Creative prompts and color-by-number fun.',
    longDescription:
      'Keep creativity alive with coloring adventures, symmetry drawing, and design challenges that double as calming brain breaks.',
    topics: ['Color-by-number', 'Seasonal themes', 'Pattern & symmetry', 'Drawing prompts'],
    docs: [
      makeDoc({
        id: 'interactive-art-design',
        title: 'Creative Design Challenge',
        description: 'Fun coloring pages with simple pictures to color. Perfect for young artists!',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['coloring', 'fine motor', 'creativity'],
      }),
      makeDoc({
        id: 'interactive-art-colorwheel',
        title: 'Color Theory Practice',
        description: 'Color pictures with the correct colors. Learn colors while having fun!',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['colors', 'coloring', 'recognition'],
      }),
      makeDoc({
        id: 'interactive-art-sketch',
        title: 'Sketch & Observe',
        description: 'Simple drawing prompts with helpful hints. Draw and have fun!',
        grades: ['g2', '35', '68'],
        difficulty: 'Beginner',
        focus: ['drawing', 'creativity', 'imagination'],
      }),
    ],
  },
  {
    id: 'early-learning',
    label: 'Early Learning',
    icon: '🌈',
    tagline: 'Foundational skills for preschool and kindergarten.',
    longDescription:
      'Letter, number, shape, and fine motor practice printables that keep littles engaged while building core skills.',
    topics: ['Alphabet tracing', 'Counting & numbers', 'Shapes & colors', 'Fine motor'],
    docs: [
      makeDoc({
        id: 'interactive-early-phonics',
        title: 'Phonics Fun Practice',
        description: 'Letter sounds, beginning sounds, and CVC word practice. Each sheet focuses on different sounds.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['phonics', 'letter sounds', 'reading readiness'],
      }),
      makeDoc({
        id: 'interactive-early-counting',
        title: 'Counting & Number Recognition',
        description: 'Interactive counting exercises with one-to-one correspondence practice.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['counting', 'number recognition', 'math readiness'],
      }),
      makeDoc({
        id: 'interactive-early-patterns',
        title: 'Pattern Recognition Explorer',
        description: 'Complete and create patterns with colors, shapes, and numbers.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['patterns', 'logic', 'critical thinking'],
      }),
      makeDoc({
        id: 'interactive-early-shapes',
        title: 'Shape & Color Explorer',
        description: 'Identify and match shapes and colors with interactive sorting activities.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['shapes', 'colors', 'classification'],
      }),
      makeDoc({
        id: 'interactive-early-letters',
        title: 'Letter Formation Practice',
        description: 'Trace and write uppercase and lowercase letters with guided practice.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['letter formation', 'handwriting', 'fine motor'],
      }),
      makeDoc({
        id: 'interactive-early-numbers',
        title: 'Number Writing & Recognition',
        description: 'Practice writing numbers 1-20 and matching quantities to numerals.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['number writing', 'numeral recognition', 'quantity matching'],
      }),
      makeDoc({
        id: 'interactive-early-foundations',
        title: 'Foundational Skills Review',
        description: 'Review basic letter, number, and shape recognition skills. Perfect for remediation or review.',
        grades: ['g2', '35'],
        difficulty: 'Beginner',
        focus: ['foundational skills', 'review', 'remediation'],
      }),
      makeDoc({
        id: 'interactive-early-basics',
        title: 'Basic Skills Practice',
        description: 'Essential early learning skills including letter sounds, counting, and basic patterns.',
        grades: ['g2', '35', '68'],
        difficulty: 'Beginner',
        focus: ['basic skills', 'foundations', 'review'],
      }),
    ],
  },
  {
    id: 'logic',
    label: 'Critical Thinking',
    icon: '💡',
    tagline: 'Puzzles, riddles, and pattern challenges.',
    longDescription:
      'Printable brain teasers that sharpen reasoning, pattern spotting, and problem solving for a variety of ages.',
    topics: ['Logic grids', 'Pattern recognition', 'Sequencing', 'Puzzles & riddles'],
    docs: [
      makeDoc({
        id: 'interactive-logic-sequence',
        title: 'Sequencing Challenge',
        description: 'Order events, steps, and patterns logically. Each sheet has unique sequences.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['sequencing', 'logic', 'order'],
      }),
      makeDoc({
        id: 'interactive-logic-prek',
        title: 'Simple Patterns & Sorting',
        description: 'Complete simple patterns and sort objects by color, size, or type.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['patterns', 'sorting', 'logic'],
      }),
      makeDoc({
        id: 'interactive-logic-riddles',
        title: 'Brain Teaser Riddles',
        description: 'Solve riddles and brain teasers with varying difficulty levels.',
        grades: ['g2', '35', '68'],
        difficulty: 'Advanced',
        focus: ['critical thinking', 'problem solving', 'reasoning'],
      }),
      makeDoc({
        id: 'interactive-logic-deduction',
        title: 'Deductive Reasoning Quest',
        description: 'Use clues to solve mysteries and logic puzzles.',
        grades: ['35', '68'],
        difficulty: 'Advanced',
        focus: ['deductive reasoning', 'logic', 'critical thinking'],
      }),
    ],
  },
  {
    id: 'sel',
    label: 'Social Emotional',
    icon: '🧘',
    tagline: 'Mindfulness, empathy, and growth mindset printables.',
    longDescription:
      'Free SEL worksheets that encourage reflection, gratitude, empathy, and emotional regulation—ideal for morning meetings or counseling groups.',
    topics: ['Feelings & emotions', 'Mindfulness', 'Kindness challenges', 'Goal setting'],
    docs: [
      makeDoc({
        id: 'interactive-sel-mindfulness',
        title: 'Mindfulness & Reflection',
        description: 'Daily mindfulness exercises with breathing techniques and reflection prompts.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['mindfulness', 'self-awareness', 'emotional regulation'],
      }),
      makeDoc({
        id: 'interactive-sel-prek',
        title: 'Feelings & Emotions Explorer',
        description: 'Identify and express feelings through pictures, simple words, and activities.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['emotions', 'feelings', 'self-expression'],
      }),
      makeDoc({
        id: 'interactive-sel-empathy',
        title: 'Empathy Builder',
        description: 'Practice perspective-taking and understanding others\' feelings through scenarios.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['empathy', 'social skills', 'perspective-taking'],
      }),
      makeDoc({
        id: 'interactive-sel-goals',
        title: 'Goal Setting & Growth',
        description: 'Set and track personal and academic goals with action plans.',
        grades: ['g2', '35', '68'],
        difficulty: 'Intermediate',
        focus: ['goal setting', 'growth mindset', 'self-reflection'],
      }),
    ],
  },
]

export function getCategoryById(id: string): InteractiveCategory | undefined {
  return INTERACTIVE_CATEGORIES.find((c) => c.id === id)
}

export function getDocMeta(docId: string): InteractiveWorksheetDoc | undefined {
  for (const cat of INTERACTIVE_CATEGORIES) {
    const match = cat.docs.find((d) => d.id === docId)
    if (match) return match
  }
  return undefined
}
