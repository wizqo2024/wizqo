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
        id: 'number-tracing-1-10',
        title: 'Trace Numbers 1–10',
        description: 'Large-format tracing with start dots for each numeral.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['number writing', 'fine motor'],
      }),
      makeDoc({
        id: 'ten-frames-1-10',
        title: 'Ten Frames 1–10',
        description: 'Fill, count, and compare ten frames for early number sense.',
        grades: ['preK', 'k1'],
        difficulty: 'Beginner',
        focus: ['number sense', 'subitizing'],
      }),
      makeDoc({
        id: 'addition-subtraction-0-10',
        title: 'Addition & Subtraction to 10',
        description: 'Solve picture-supported addition and subtraction problems.',
        grades: ['k1', 'g2'],
        difficulty: 'Beginner',
        focus: ['fact fluency', 'word problems'],
      }),
      makeDoc({
        id: 'math-maze',
        title: 'Math Maze Adventure',
        description: 'Navigate a maze by solving math facts at each turn.',
        grades: ['k1', 'g2', '35'],
        difficulty: 'Intermediate',
        focus: ['problem solving', 'operations'],
      }),
      makeDoc({
        id: 'skip-count-5-10-120',
        title: 'Skip Count Warm-Up',
        description: 'Practice skip counting by 5s and 10s up to 120.',
        grades: ['g2'],
        difficulty: 'Beginner',
        focus: ['patterns', 'skip counting'],
      }),
      makeDoc({
        id: 'word-problems-100',
        title: 'Story Problems to 100',
        description: 'Solve mixed-operation word problems with workspace.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['reasoning', 'multi-step problems'],
      }),
      makeDoc({
        id: 'place-value-hto',
        title: 'Hundreds • Tens • Ones',
        description: 'Break apart numbers into hundreds, tens, and ones.',
        grades: ['g2', '35'],
        difficulty: 'Intermediate',
        focus: ['place value', 'expanded form'],
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
        title: 'Mini Reading Passage',
        description: 'Short fiction passage with three comprehension questions.',
        grades: ['k1'],
        difficulty: 'Beginner',
        focus: ['recall', 'comprehension'],
      }),
      makeDoc({
        id: 'reading-g1-lost-hat',
        title: 'Grade 1 – The Lost Hat',
        description: 'Narrative passage with prompts for text evidence and sequencing.',
        grades: ['k1'],
        difficulty: 'Beginner',
        focus: ['text evidence', 'sequencing'],
      }),
      makeDoc({
        id: 'reading-g2-paper-bridge',
        title: 'Grade 2 – Paper Bridge',
        description: 'Nonfiction STEM passage with inference and vocabulary questions.',
        grades: ['g2'],
        difficulty: 'Intermediate',
        focus: ['nonfiction', 'inference'],
      }),
      makeDoc({
        id: 'reading-g2-rainy-garden',
        title: 'Grade 2 – Rainy Garden',
        description: 'Informational text focusing on cause and effect plus key detail questions.',
        grades: ['g2'],
        difficulty: 'Intermediate',
        focus: ['cause & effect', 'key details'],
      }),
      makeDoc({
        id: 'reading-g3-science-fair',
        title: 'Grade 3 – Science Fair Plan',
        description: 'Upper elementary reading with multi-part comprehension set.',
        grades: ['35'],
        difficulty: 'Intermediate',
        focus: ['main idea', 'analysis'],
      }),
      makeDoc({
        id: 'reading-g3-community-garden',
        title: 'Grade 3 – Community Garden',
        description: 'Paired questions and short written response for higher readers.',
        grades: ['35'],
        difficulty: 'Intermediate',
        focus: ['inference', 'written response'],
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
          description: 'Set goals, plan action steps, and reflect at the end of the week.',
          grades: ['g2', '35'],
          difficulty: 'Beginner',
          focus: ['reflection', 'planning', 'writing'],
        }),
        makeDoc({
          id: 'feelings-checkin',
          title: 'Feelings Check-In Journal',
          description: 'Write or draw about feelings with sentence starters and prompts.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['journaling', 'sentence starters'],
        }),
        makeDoc({
          id: 'design-monster',
          title: 'Design a Monster Story',
          description: 'Draw a monster and write descriptive sentences about it.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['creative writing', 'description'],
        }),
        makeDoc({
          id: 'draw-half',
          title: 'Finish & Describe the Picture',
          description: 'Complete the drawing and add sentences about what you created.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['observation', 'sentence writing'],
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
          description: 'Record predictions, observations, and results for a balloon rocket experiment.',
          grades: ['g2', '35'],
          difficulty: 'Intermediate',
          focus: ['experiments', 'data recording'],
        }),
        makeDoc({
          id: 'stem-walking-water',
          title: 'Walking Water Investigation',
          description: 'Observe color mixing and capillary action and jot findings.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['observation', 'sequencing'],
        }),
        makeDoc({
          id: 'science-match',
          title: 'Science Fun Facts Match',
          description: 'Match science terms to their definitions with a quick quiz.',
          grades: ['k1', 'g2', '35'],
          difficulty: 'Intermediate',
          focus: ['vocabulary', 'science facts'],
        }),
        makeDoc({
          id: 'geo-landforms',
          title: 'Landforms vs Water Bodies',
          description: 'Classify and label major landforms and water features.',
          grades: ['g2', '35'],
          difficulty: 'Beginner',
          focus: ['earth science', 'classification'],
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
          description: 'Trace and label the seven continents with visual hints.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['maps', 'continent names'],
        }),
        makeDoc({
          id: 'geo-compass-rose',
          title: 'Compass Rose Directions',
          description: 'Practice cardinal and intercardinal directions with labeling.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['direction', 'map skills'],
        }),
        makeDoc({
          id: 'geo-latlong',
          title: 'Latitude & Longitude Basics',
          description: 'Use coordinates to plot locations and practice geography vocabulary.',
          grades: ['35'],
          difficulty: 'Intermediate',
          focus: ['coordinates', 'geography terms'],
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
          id: 'grammar-detective',
          title: 'Grammar Detective',
          description: 'Fix capitalization, punctuation, and grammar errors in short passages.',
          grades: ['g2', '35'],
          difficulty: 'Intermediate',
          focus: ['editing', 'punctuation', 'grammar'],
        }),
        makeDoc({
          id: 'spelling',
          title: 'Spelling Challenge',
          description: 'Circle the correctly spelled word and rewrite neatly on the lines provided.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['spelling', 'handwriting'],
        }),
        makeDoc({
          id: 'beginning-sounds-az',
          title: 'Beginning Sounds A–Z',
          description: 'Match pictures to their beginning sounds and trace the letters.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['phonics', 'alphabet', 'letter sounds'],
        }),
        makeDoc({
          id: 'uppercase-lowercase-match',
          title: 'Upper & Lowercase Match',
          description: 'Trace uppercase letters and connect them to their lowercase partners.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['letter recognition', 'handwriting'],
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
          id: 'color-by-number',
          title: 'Color by Number Fun',
          description: 'Follow number codes to reveal a colorful picture.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['color recognition', 'fine motor'],
        }),
        makeDoc({
          id: 'directed-drawing-animals',
          title: 'Directed Drawing: Animals',
          description: 'Step-by-step animal drawing with room to add your own ideas.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['drawing', 'observation'],
        }),
        makeDoc({
          id: 'cut-and-paste-crafts',
          title: 'Cut & Paste Crafts',
          description: 'Cut, sort, and assemble themed craft pieces.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['cutting', 'following directions'],
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
          id: 'number-tracing-1-20',
          title: 'Trace Numbers 1–20',
          description: 'Practice tracing numbers with helpful start dots.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['number formation', 'fine motor'],
        }),
        makeDoc({
          id: 'uppercase-lowercase-match',
          title: 'Upper & Lowercase Match',
          description: 'Trace uppercase letters and connect them to lowercase partners.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['alphabet', 'letter matching'],
        }),
        makeDoc({
          id: 'shapes-colors-sort',
          title: 'Shapes & Colors Sort',
          description: 'Cut, sort, and glue shapes by color families.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['sorting', 'geometry basics'],
        }),
        makeDoc({
          id: 'beginning-sounds-az',
          title: 'Beginning Sounds Practice',
          description: 'Match pictures to beginning sounds and trace the letters.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['phonemic awareness', 'alphabet'],
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
          description: 'Use clues to fill the grid and solve the mystery.',
          grades: ['g2', '35'],
          difficulty: 'Advanced',
          focus: ['deductive reasoning', 'problem solving'],
        }),
        makeDoc({
          id: 'maze-focus',
          title: 'Focus Maze Challenge',
          description: 'Navigate mazes that strengthen attention and planning.',
          grades: ['preK', 'k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['focus', 'perseverance'],
        }),
        makeDoc({
          id: 'spot-difference',
          title: 'Spot the Difference',
          description: 'Compare pictures to find subtle differences.',
          grades: ['preK', 'k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['observation', 'critical thinking'],
        }),
        makeDoc({
          id: 'dot-to-dot-1-20',
          title: 'Dot-to-Dot 1–20',
          description: 'Connect the dots in order to reveal hidden pictures.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['number order', 'fine motor'],
        }),
        makeDoc({
          id: 'ws-animals',
          title: 'Animal Word Search',
          description: 'Hunt for animal vocabulary in a themed word search.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['vocabulary', 'pattern recognition'],
        }),
        makeDoc({
          id: 'ws-space',
          title: 'Space Word Search',
          description: 'Find space-themed words hidden in a grid.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['vocabulary', 'pattern recognition'],
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
          description: 'Write daily gratitude notes and collect them in the jar.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['gratitude', 'reflection'],
        }),
        makeDoc({
          id: 'mood-tracker',
          title: 'Mood Tracker',
          description: 'Color-code daily feelings and reflect on what helped.',
          grades: ['k1', 'g2'],
          difficulty: 'Beginner',
          focus: ['self-awareness', 'emotional vocabulary'],
        }),
        makeDoc({
          id: 'reward-chart',
          title: 'Reward & Habit Chart',
          description: 'Track positive habits or classroom routines with stars or stickers.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['goal setting', 'motivation'],
        }),
        makeDoc({
          id: 'feelings-checkin',
          title: 'Feelings Check-In',
          description: 'Name feelings, choose coping ideas, and write next steps.',
          grades: ['preK', 'k1'],
          difficulty: 'Beginner',
          focus: ['self-regulation', 'coping strategies'],
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
