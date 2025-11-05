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
        id: 'math-maze',
        title: 'Math Maze Adventure',
        description: 'Solve to stay on the correct path through a 7x7 maze.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['fact fluency', 'perseverance'],
      }),
      makeDoc({
        id: 'addition-subtraction-0-10',
        title: 'Add & Subtract to 10',
        description: 'Number lines and picture cues build fact confidence.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['basic facts', 'number sense'],
      }),
      makeDoc({
        id: 'ten-frames-1-20',
        title: 'Ten Frames to 20',
        description: 'Compose and decompose teen numbers with ten frames.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['subitizing', 'number bonds'],
      }),
      makeDoc({
        id: 'place-value-hto',
        title: 'Hundreds Tens Ones',
        description: 'Break apart 3-digit numbers and practice expanded form.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['place value', 'expanded form'],
      }),
      makeDoc({
        id: 'word-problems-100',
        title: 'Word Problems to 100',
        description: 'Multi-step problems covering the four operations.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['problem solving', 'reasoning'],
      }),
      makeDoc({
        id: 'sudoku4',
        title: '4x4 Sudoku',
        description: 'Logic puzzle using digits 1–4. Great for brain warm-ups.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['logic', 'perseverance'],
      }),
      makeDoc({
        id: 'sudoku6',
        title: '6x6 Sudoku',
        description: 'Medium-level sudoku with 6 symbols.',
        grades: ['g2', '35'],
        difficulty: 'Advanced',
        focus: ['logic', 'pattern recognition'],
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
        id: 'reading-mini-1',
        title: 'Reading Mini Passage',
        description: 'Short story with three comprehension questions.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['comprehension', 'recall'],
      }),
      makeDoc({
        id: 'reading-g1-lost-hat',
        title: 'Grade 1 – The Lost Hat',
        description: 'Narrative passage with literal and inferential questions.',
        grades: ['k1'],
        difficulty: 'Beginner',
        focus: ['sequencing', 'character feelings'],
      }),
      makeDoc({
        id: 'reading-g2-paper-bridge',
        title: 'Grade 2 – Paper Bridge',
        description: 'Nonfiction engineering snippet with text-evidence prompts.',
        grades: ['g2'],
        difficulty: 'Intermediate',
        focus: ['STEM vocab', 'context clues'],
      }),
      makeDoc({
        id: 'reading-g3-science-fair',
        title: 'Grade 3 – Science Fair Plan',
        description: 'Upper elementary informational text with multi-part questions.',
        grades: ['35'],
        difficulty: 'Intermediate',
        focus: ['main idea', 'author purpose'],
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
        id: 'weekly-goals',
        title: 'Weekly Writing Goals',
        description: 'Plan, try, and reflect with structured boxes.',
        grades: ['g2', '35'],
        difficulty: 'Beginner',
        focus: ['reflection', 'planning'],
      }),
      makeDoc({
        id: 'feelings-checkin',
        title: 'Feelings Check-In',
        description: 'Write or draw emotions for the day with prompts.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['SEL', 'journaling'],
      }),
      makeDoc({
        id: 'reading-g2-rainy-garden',
        title: 'Rainy Garden Writing Extension',
        description: 'Use passage details to write a paragraph summary.',
        grades: ['g2'],
        difficulty: 'Intermediate',
        focus: ['summary', 'evidence'],
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
        id: 'stem-balloon-rocket',
        title: 'Balloon Rocket Lab',
        description: 'STEM steps plus space for results and reflections.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['forces', 'data recording'],
      }),
      makeDoc({
        id: 'stem-walking-water',
        title: 'Walking Water Experiment',
        description: 'Observe capillary action and color mixing.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['observation', 'recording'],
      }),
      makeDoc({
        id: 'geo-latlong',
        title: 'Latitude & Longitude Basics',
        description: 'Map skills with coordinates practice.',
        grades: ['35', '68'],
        difficulty: 'Intermediate',
        focus: ['geography', 'map skills'],
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
        id: 'geo-continents-k2',
        title: 'Label the Continents',
        description: 'Trace and label the seven continents with hints.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['map skills', 'geography'],
      }),
      makeDoc({
        id: 'geo-compass-rose',
        title: 'Compass Rose Directions',
        description: 'Color and label cardinal/intercardinal directions.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['directions', 'map skills'],
      }),
      makeDoc({
        id: 'geo-landforms',
        title: 'Landforms vs Water Bodies',
        description: 'Match vocabulary to simple icons.',
        grades: ['g2'],
        difficulty: 'Beginner',
        focus: ['landforms', 'classification'],
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
        id: 'spelling',
        title: 'Spelling Challenge',
        description: 'Circle the correct spelling and rewrite neatly.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['spelling', 'handwriting'],
      }),
      makeDoc({
        id: 'grammar-detective',
        title: 'Grammar Detective',
        description: 'Fix sentences and explain the grammatical rule.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['editing', 'grammar rules'],
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
        id: 'coloring-animals',
        title: 'Animal Friends Coloring',
        description: 'Whimsical animal scenes that reinforce color words.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['fine motor', 'color recognition'],
      }),
      makeDoc({
        id: 'draw-half',
        title: 'Draw the Missing Half',
        description: 'Mirror-drawing practice with symmetry cues.',
        grades: ['k1', 'g2'],
        difficulty: 'Intermediate',
        focus: ['symmetry', 'observation'],
      }),
      makeDoc({
        id: 'design-monster',
        title: 'Design Your Monster',
        description: 'Creative drawing and writing prompt combination.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['imagination', 'writing'],
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
        id: 'number-tracing-1-10',
        title: 'Trace Numbers 1–10',
        description: 'Directional arrows and start dots improve handwriting.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['number writing', 'fine motor'],
      }),
      makeDoc({
        id: 'uppercase-lowercase-match',
        title: 'Upper & Lowercase Match',
        description: 'Match letter pairs with traceable guides.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['letter recognition', 'phonics'],
      }),
      makeDoc({
        id: 'shapes-colors-sort',
        title: 'Shapes & Colors Sort',
        description: 'Cut, sort, and glue basic shapes by color.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['sorting', 'fine motor'],
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
        id: 'logic-grid',
        title: 'Logic Grid Puzzle',
        description: 'Match clues to solve the mystery in a tidy grid.',
        grades: ['g2', '35', '68'],
        difficulty: 'Advanced',
        focus: ['deductive reasoning'],
      }),
      makeDoc({
        id: 'spot-difference',
        title: 'Spot the Difference',
        description: 'Find seven changes between playful illustrations.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['visual scanning'],
      }),
      makeDoc({
        id: 'maze-focus',
        title: 'Maze of Focus',
        description: 'Navigate mazes while building executive function skills.',
        grades: ['preK', 'k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['focus', 'perseverance'],
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
        id: 'gratitude-jar',
        title: 'Gratitude Jar',
        description: 'Write daily gratitude slips and fill the jar illustration.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['gratitude', 'reflection'],
      }),
      makeDoc({
        id: 'mood-tracker',
        title: 'Mood Tracker',
        description: 'Color-coded mood log for morning check-ins.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Beginner',
        focus: ['self-awareness'],
      }),
      makeDoc({
        id: 'reward-chart',
        title: 'Reward & Habit Chart',
        description: 'Track routines or positive behaviors with stickers.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['habit building'],
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
