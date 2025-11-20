// Translation system - Central export
import { en } from './en'
import { es } from './es'
import { ar } from './ar'

export type Language = 'en' | 'es' | 'ar'

export const translations = {
  en,
  es,
  ar,
} as const

// Explicitly export interactive worksheet keys to prevent tree-shaking
// This ensures these keys are included in the bundle
export const interactiveWorksheetKeys = {
  en: {
    countObjectsAndWriteNumber: en.worksheets.countObjectsAndWriteNumber,
    countThe: en.worksheets.countThe,
    numberLabel: en.worksheets.numberLabel,
    objectNames: en.worksheets.objectNames,
    mathPuzzle: en.worksheets.mathPuzzle,
    mathRace: en.worksheets.mathRace,
    reflection: en.worksheets.reflection,
  },
  es: {
    countObjectsAndWriteNumber: es.worksheets.countObjectsAndWriteNumber,
    countThe: es.worksheets.countThe,
    numberLabel: es.worksheets.numberLabel,
    objectNames: es.worksheets.objectNames,
    mathPuzzle: es.worksheets.mathPuzzle,
    mathRace: es.worksheets.mathRace,
    reflection: es.worksheets.reflection,
  },
  ar: {
    countObjectsAndWriteNumber: ar.worksheets.countObjectsAndWriteNumber,
    countThe: ar.worksheets.countThe,
    numberLabel: ar.worksheets.numberLabel,
    objectNames: ar.worksheets.objectNames,
    mathPuzzle: ar.worksheets.mathPuzzle,
    mathRace: ar.worksheets.mathRace,
    reflection: ar.worksheets.reflection,
  },
} as const

// Explicitly export interactive translations to prevent tree-shaking
// This ensures these translations are included in the bundle
export const interactiveTranslations = {
  en: en.interactive,
  es: es.interactive,
  ar: ar.interactive,
} as const

// Ensure interactive worksheet title and description keys are present
const ensureInteractiveTitleDescriptionKeys = () => {
  // Define the keys directly to prevent tree-shaking
  // Auto-generated: All 124 interactive worksheets
  const interactiveTitleDescKeys = {
    en: {
      'interactive-art-color-by-number': {
        title: 'Color-by-Number Art',
        description: 'Color pictures using number codes. Each sheet features unique designs and color patterns.',
      },
      'interactive-art-colorwheel': {
        title: 'Color Theory Practice',
        description: 'Color pictures with the correct colors. Learn colors while having fun!',
      },
      'interactive-art-comic': {
        title: 'Comic Strip Creator',
        description: 'Create your own comic strips with panels, speech bubbles, and characters. Tell a visual story!',
      },
      'interactive-art-critique': {
        title: 'Art Critique & Analysis',
        description: 'Learn to observe, describe, and analyze artwork using art vocabulary and critical thinking.',
      },
      'interactive-art-design': {
        title: 'Creative Design Challenge',
        description: 'Fun coloring pages with simple pictures to color. Perfect for young artists!',
      },
      'interactive-art-doodle': {
        title: 'Doodle Art Challenge',
        description: 'Free-form doodling prompts that spark creativity and imagination. No rules, just fun!',
      },
      'interactive-art-mandala': {
        title: 'Mandala Art & Patterns',
        description: 'Create beautiful mandala designs with patterns and symmetry. Perfect for mindfulness and creativity.',
      },
      'interactive-art-patterns': {
        title: 'Pattern & Symmetry Art',
        description: 'Create patterns and explore symmetry through drawing and coloring activities.',
      },
      'interactive-art-perspective': {
        title: 'Art & Perspective Practice',
        description: 'Learn about perspective, shading, and artistic techniques through guided exercises.',
      },
      'interactive-art-seasonal': {
        title: 'Seasonal Coloring Pages',
        description: 'Themed coloring pages for different seasons and holidays. Each sheet features unique seasonal designs.',
      },
      'interactive-art-shapes': {
        title: 'Shape Art & Drawing',
        description: 'Create art using basic shapes. Draw and color shapes to make pictures.',
      },
      'interactive-art-sketch': {
        title: 'Sketch & Observe',
        description: 'Simple drawing prompts with helpful hints. Draw and have fun!',
      },
      'interactive-cognitive-attention': {
        title: 'Attention & Focus Builder',
        description: 'Develop sustained attention and focus through visual scanning, spot-the-difference, and concentration exercises.',
      },
      'interactive-cognitive-executive': {
        title: 'Executive Function Practice',
        description: 'Build planning, organization, and task completion skills with structured activities and goal-setting exercises.',
      },
      'interactive-cognitive-flexibility': {
        title: 'Cognitive Flexibility Practice',
        description: 'Develop mental flexibility by switching between tasks, adapting to new rules, and thinking from multiple perspectives.',
      },
      'interactive-cognitive-memory': {
        title: 'Working Memory Challenge',
        description: 'Practice remembering sequences, patterns, and information. Strengthens working memory and recall skills.',
      },
      'interactive-cognitive-processing': {
        title: 'Processing Speed Challenge',
        description: 'Improve quick recognition and response time through timed activities and rapid identification exercises.',
      },
      'interactive-cognitive-visual': {
        title: 'Visual Processing Skills',
        description: 'Enhance visual discrimination, spatial reasoning, and visual-motor integration through pattern matching and spatial tasks.',
      },
      'interactive-early-basics': {
        title: 'Basic Skills Practice',
        description: 'Essential early learning skills including letter sounds, counting, and basic patterns.',
      },
      'interactive-early-counting': {
        title: 'Counting & Number Recognition',
        description: 'Interactive counting exercises with one-to-one correspondence practice.',
      },
      'interactive-early-foundations': {
        title: 'Foundational Skills Review',
        description: 'Review basic letter, number, and shape recognition skills. Perfect for remediation or review.',
      },
      'interactive-early-letters': {
        title: 'Letter Formation Practice',
        description: 'Trace and write uppercase and lowercase letters with guided practice.',
      },
      'interactive-early-numbers': {
        title: 'Number Writing & Recognition',
        description: 'Practice writing numbers 1-20 and matching quantities to numerals.',
      },
      'interactive-early-patterns': {
        title: 'Pattern Recognition Explorer',
        description: 'Complete and create patterns with colors, shapes, and numbers.',
      },
      'interactive-early-phonics': {
        title: 'Phonics Fun Practice',
        description: 'Letter sounds, beginning sounds, and CVC word practice. Each sheet focuses on different sounds.',
      },
      'interactive-early-shapes': {
        title: 'Shape & Color Explorer',
        description: 'Identify and match shapes and colors with interactive sorting activities.',
      },
      'interactive-geography-continents': {
        title: 'Continents & Oceans Explorer',
        description: 'Learn about the seven continents and five oceans with maps and activities.',
      },
      'interactive-geography-culture': {
        title: 'Culture Explorer',
        description: 'Learn about different cultures, traditions, and communities around the world.',
      },
      'interactive-geography-economics': {
        title: 'Economics Basics',
        description: 'Explore supply and demand, budgeting, financial literacy, and economic systems.',
      },
      'interactive-geography-government': {
        title: 'Civics & Government Explorer',
        description: 'Learn about government structure, citizenship, rights, and responsibilities.',
      },
      'interactive-geography-history': {
        title: 'Historical Timeline Builder',
        description: 'Create timelines and learn about historical events and figures.',
      },
      'interactive-geography-map': {
        title: 'Interactive Map Skills',
        description: 'Practice reading maps, using legends, and identifying locations. Each sheet features different maps.',
      },
      'interactive-geography-places': {
        title: 'Places & Landmarks',
        description: 'Learn about important places, landmarks, and locations in your community and country.',
      },
      'interactive-geography-prek': {
        title: 'My Community Explorer',
        description: 'Learn about places in the community, home, and school with simple maps and pictures.',
      },
      'interactive-geography-seasons': {
        title: 'Seasons & Weather Around the World',
        description: 'Learn about different seasons, weather patterns, and how they vary in different places.',
      },
      'interactive-grammar-advanced': {
        title: 'Advanced Grammar Practice',
        description: 'Practice complex sentence structures, clauses, phrases, and advanced punctuation.',
      },
      'interactive-grammar-antonyms': {
        title: 'Synonyms & Antonyms Challenge',
        description: 'Match words with synonyms and antonyms to expand vocabulary.',
      },
      'interactive-grammar-capitalization': {
        title: 'Capitalization & Punctuation',
        description: 'Practice proper capitalization and punctuation in sentences.',
      },
      'interactive-grammar-parts': {
        title: 'Parts of Speech Practice',
        description: 'Identify nouns, verbs, adjectives, and adverbs in sentences. Each sheet has new sentences.',
      },
      'interactive-grammar-plurals': {
        title: 'Plurals & Possessives',
        description: 'Learn to form plurals and possessives correctly.',
      },
      'interactive-grammar-prek': {
        title: 'Word & Picture Match',
        description: 'Match simple words with pictures and identify basic word types.',
      },
      'interactive-grammar-rhyming': {
        title: 'Rhyming Words Practice',
        description: 'Identify and match rhyming words through fun activities.',
      },
      'interactive-grammar-tenses': {
        title: 'Verb Tense Mastery',
        description: 'Practice past, present, and future tense with verb conjugation exercises.',
      },
      'interactive-grammar-vocab': {
        title: 'Academic Vocabulary Builder',
        description: 'Learn and practice academic vocabulary words with context clues and usage exercises.',
      },
      'interactive-logic-analogies': {
        title: 'Analogies & Relationships',
        description: 'Practice identifying relationships and completing analogies.',
      },
      'interactive-logic-classification': {
        title: 'Classification & Categorization',
        description: 'Sort and classify objects, pictures, and concepts into groups.',
      },
      'interactive-logic-deduction': {
        title: 'Deductive Reasoning Quest',
        description: 'Use clues to solve mysteries and logic puzzles.',
      },
      'interactive-logic-matching': {
        title: 'Matching & Memory Games',
        description: 'Match objects, pictures, and concepts. Practice memory and recognition skills.',
      },
      'interactive-logic-prek': {
        title: 'Simple Patterns & Sorting',
        description: 'Complete simple patterns and sort objects by color, size, or type.',
      },
      'interactive-logic-riddles': {
        title: 'Brain Teaser Riddles',
        description: 'Solve riddles and brain teasers with varying difficulty levels.',
      },
      'interactive-logic-sequence': {
        title: 'Sequencing Challenge',
        description: 'Order events, steps, and patterns logically. Each sheet has unique sequences.',
      },
      'interactive-math-algebra': {
        title: 'Algebra Basics Practice',
        description: 'Solve equations, work with variables, and practice algebraic expressions.',
      },
      'interactive-math-counting': {
        title: 'Counting & Number Recognition',
        description: 'Practice counting objects, recognizing numbers, and matching quantities to numerals.',
      },
      'interactive-math-decimals': {
        title: 'Decimal Operations',
        description: 'Add, subtract, multiply, and divide decimals with real-world applications.',
      },
      'interactive-math-division': {
        title: 'Division Practice',
        description: 'Learn division facts, use arrays, and solve division word problems.',
      },
      'interactive-math-exponents': {
        title: 'Exponents & Powers',
        description: 'Understand exponents, powers, and scientific notation.',
      },
      'interactive-math-fractions': {
        title: 'Fraction Fun Practice',
        description: 'Compare fractions, find equivalents, and solve fraction operations.',
      },
      'interactive-math-geometry': {
        title: 'Advanced Geometry Challenge',
        description: 'Calculate area, perimeter, volume, and work with angles and transformations.',
      },
      'interactive-math-graphing': {
        title: 'Data & Graphing Practice',
        description: 'Create bar graphs, pictographs, and line plots from data sets.',
      },
      'interactive-math-integers': {
        title: 'Integers & Number Line',
        description: 'Work with positive and negative numbers, absolute value, and coordinate plane.',
      },
      'interactive-math-measurement': {
        title: 'Measurement Mission',
        description: 'Practice length, weight, volume, and time measurement conversions.',
      },
      'interactive-math-money': {
        title: 'Money Math Mastery',
        description: 'Count coins, make change, and solve money word problems.',
      },
      'interactive-math-multiplication': {
        title: 'Multiplication Mastery',
        description: 'Practice multiplication facts, arrays, and multiplication word problems.',
      },
      'interactive-math-percentages': {
        title: 'Percentage & Ratio Mastery',
        description: 'Calculate percentages, work with ratios, and solve proportion problems.',
      },
      'interactive-math-place-value': {
        title: 'Place Value Explorer',
        description: 'Understand ones, tens, hundreds, and thousands place with interactive exercises.',
      },
      'interactive-math-puzzle': {
        title: 'Equation Puzzle Box',
        description: 'Solve missing number equations arranged in puzzle format. Each puzzle is unique.',
      },
      'interactive-math-race': {
        title: 'Math Race Challenge',
        description: 'Timed addition and subtraction challenges with varying difficulty levels.',
      },
      'interactive-math-rhythm': {
        title: 'Number Pattern Rhythm',
        description: 'Complete number patterns with skip counting sequences. Each sheet generates unique patterns.',
      },
      'interactive-math-rounding': {
        title: 'Rounding Numbers',
        description: 'Round numbers to the nearest ten, hundred, and thousand.',
      },
      'interactive-math-shapes': {
        title: 'Geometry Shape Challenge',
        description: 'Identify, count, and classify shapes with interactive exercises.',
      },
      'interactive-math-statistics': {
        title: 'Data & Statistics Explorer',
        description: 'Analyze data sets, create graphs, calculate mean, median, mode, and interpret statistics.',
      },
      'interactive-math-tens-frames': {
        title: 'Tens Frames Practice',
        description: 'Use tens frames to understand numbers, addition, and subtraction visually.',
      },
      'interactive-math-time': {
        title: 'Time & Clock Practice',
        description: 'Read analog and digital clocks, calculate elapsed time, and solve time word problems.',
      },
      'interactive-math-word-problems': {
        title: 'Multi-Step Word Problems',
        description: 'Solve complex word problems requiring multiple steps and critical thinking.',
      },
      'interactive-reading-adventure': {
        title: 'Reading Adventure Quest',
        description: 'Interactive story passages with multiple choice and short answer questions. Each sheet features a new story.',
      },
      'interactive-reading-alphabet': {
        title: 'Alphabet & Letter Recognition',
        description: 'Practice recognizing letters, matching uppercase and lowercase, and beginning sounds.',
      },
      'interactive-reading-character': {
        title: 'Character Analysis Workshop',
        description: 'Analyze character traits, motivations, and development in stories.',
      },
      'interactive-reading-compare': {
        title: 'Compare & Contrast Passages',
        description: 'Read multiple texts and compare themes, characters, or information.',
      },
      'interactive-reading-detective': {
        title: 'Reading Detective Challenge',
        description: 'Find clues in the text to answer mystery questions. New mysteries each time.',
      },
      'interactive-reading-fluency': {
        title: 'Reading Fluency Practice',
        description: 'Practice reading with expression, accuracy, and appropriate pacing. Includes repeated reading exercises.',
      },
      'interactive-reading-literary-analysis': {
        title: 'Literary Analysis Workshop',
        description: 'Analyze literary elements, themes, symbolism, and author\'s purpose in fiction texts.',
      },
      'interactive-reading-prek': {
        title: 'Picture Story Time',
        description: 'Simple picture-based stories with yes/no questions and basic comprehension activities.',
      },
      'interactive-reading-research': {
        title: 'Research & Evidence Builder',
        description: 'Practice finding and evaluating sources, citing evidence, and building arguments from multiple texts.',
      },
      'interactive-reading-sightwords': {
        title: 'Sight Word Practice',
        description: 'Practice reading and writing common sight words with fun activities.',
      },
      'interactive-reading-storymap': {
        title: 'Story Map Builders',
        description: 'Retell fiction stories with beginning, middle, and ending organizers plus clue gathering practice.',
      },
      'interactive-reading-summary': {
        title: 'Summary & Main Idea',
        description: 'Practice identifying main ideas and writing concise summaries.',
      },
      'interactive-reading-vocab': {
        title: 'Vocabulary Builder Workshop',
        description: 'Context clues exercises with word matching and sentence completion.',
      },
      'interactive-science-animals': {
        title: 'Animal Classification',
        description: 'Learn about different types of animals, their habitats, and characteristics.',
      },
      'interactive-science-chemistry': {
        title: 'Chemistry Basics Lab',
        description: 'Explore atoms, molecules, chemical reactions, and the periodic table.',
      },
      'interactive-science-ecology': {
        title: 'Ecology & Environment Study',
        description: 'Explore ecosystems, food webs, environmental issues, and conservation.',
      },
      'interactive-science-lifecycle': {
        title: 'Life Cycle Explorer',
        description: 'Interactive worksheets exploring plant and animal life cycles.',
      },
      'interactive-science-observation': {
        title: 'Science Observation Journal',
        description: 'Daily observation logs for experiments and nature studies. Each sheet features new prompts.',
      },
      'interactive-science-physics': {
        title: 'Physics Fundamentals',
        description: 'Learn about forces, motion, energy, and simple machines with hands-on activities.',
      },
      'interactive-science-plants': {
        title: 'Plant Explorer',
        description: 'Learn about plants, their parts, and how they grow through simple activities.',
      },
      'interactive-science-prek': {
        title: 'Nature Explorer',
        description: 'Simple nature observation activities with pictures and basic questions about plants, animals, and weather.',
      },
      'interactive-science-senses': {
        title: 'Five Senses Explorer',
        description: 'Explore the five senses through hands-on activities and observation exercises.',
      },
      'interactive-science-space': {
        title: 'Space & Astronomy Explorer',
        description: 'Learn about planets, stars, and space phenomena with interactive activities.',
      },
      'interactive-science-states': {
        title: 'States of Matter Lab',
        description: 'Hands-on activities exploring solid, liquid, gas with observation charts.',
      },
      'interactive-science-weather': {
        title: 'Weather Watcher Journal',
        description: 'Track weather patterns, temperature, and observations over time.',
      },
      'interactive-sel-character': {
        title: 'Character Building & Values',
        description: 'Explore important character traits like honesty, respect, responsibility, and integrity.',
      },
      'interactive-sel-conflict': {
        title: 'Conflict Resolution Skills',
        description: 'Learn strategies to resolve conflicts peacefully and communicate effectively with others.',
      },
      'interactive-sel-empathy': {
        title: 'Empathy Builder',
        description: 'Practice perspective-taking and understanding others\' feelings and experiences.',
      },
      'interactive-sel-friendship': {
        title: 'Friendship & Social Skills',
        description: 'Learn about making friends, sharing, taking turns, and being kind to others.',
      },
      'interactive-sel-goals': {
        title: 'Goal Setting & Growth',
        description: 'Set and track personal and academic goals with action plans.',
      },
      'interactive-sel-gratitude': {
        title: 'Gratitude & Appreciation',
        description: 'Practice gratitude through writing, drawing, and reflection activities.',
      },
      'interactive-sel-growth-mindset': {
        title: 'Growth Mindset Practice',
        description: 'Develop a growth mindset by learning to embrace challenges, learn from mistakes, and persist.',
      },
      'interactive-sel-kindness': {
        title: 'Kindness Challenge',
        description: 'Complete daily acts of kindness and reflect on how kindness impacts yourself and others.',
      },
      'interactive-sel-mindfulness': {
        title: 'Mindfulness & Reflection',
        description: 'Daily mindfulness exercises with breathing techniques and reflection prompts.',
      },
      'interactive-sel-prek': {
        title: 'Feelings & Emotions Explorer',
        description: 'Identify and express feelings through pictures, simple words, and activities.',
      },
      'interactive-sel-regulation': {
        title: 'Self-Regulation Strategies',
        description: 'Practice techniques to manage emotions, stay calm, and make thoughtful choices.',
      },
      'interactive-sel-stress': {
        title: 'Stress Management & Coping',
        description: 'Identify stress triggers and practice healthy coping strategies for managing anxiety and stress.',
      },
      'interactive-writing-argumentative': {
        title: 'Argumentative Writing Practice',
        description: 'Develop arguments with claims, evidence, and reasoning. Practice persuasive writing skills.',
      },
      'interactive-writing-essay': {
        title: 'Essay Writing Workshop',
        description: 'Practice writing structured essays with thesis statements, body paragraphs, and conclusions.',
      },
      'interactive-writing-informative': {
        title: 'Informative Writing Guide',
        description: 'Learn to write informative paragraphs and essays with facts, details, and explanations.',
      },
      'interactive-writing-lowercase-trace': {
        title: 'Neat Handwriting Practice – Lowercase Alphabet Tracing',
        description: 'Practice tracing lowercase letters with guided lines. Perfect for developing neat handwriting skills.',
      },
      'interactive-writing-narrative': {
        title: 'Narrative Writing Practice',
        description: 'Write short stories with beginning, middle, and end. Includes story planning templates.',
      },
      'interactive-writing-opinion': {
        title: 'Opinion Writing Framework',
        description: 'Structured templates for opinion writing with prompts and evidence gathering.',
      },
      'interactive-writing-pictures': {
        title: 'Picture Story Starters',
        description: 'Draw pictures based on prompts and write simple sentences about what you see.',
      },
      'interactive-writing-poetry': {
        title: 'Poetry Writing Practice',
        description: 'Guided poetry exercises with rhyming, haiku, and free verse prompts.',
      },
      'interactive-writing-prek': {
        title: 'Drawing & Labeling',
        description: 'Draw pictures and label them with simple words. Perfect for early artists!',
      },
      'interactive-writing-prompts': {
        title: 'Creative Writing Prompts',
        description: 'Unique story starters and creative writing prompts that change with each generation.',
      },
      'interactive-writing-research': {
        title: 'Research Paper Planner',
        description: 'Organize research, create outlines, and structure research papers with proper citations.',
      },
      'interactive-writing-sentences': {
        title: 'Sentence Builder Workshop',
        description: 'Practice building complete sentences with varied structures and punctuation.',
      },
      'interactive-writing-trace': {
        title: 'Letter & Word Tracing',
        description: 'Trace letters and simple words to build handwriting skills and letter recognition.',
      },
    },
    es: {
      'interactive-art-color-by-number': {
        title: 'Arte de Colorear por Números',
        description: 'Colorea imágenes usando códigos numéricos. Cada hoja presenta diseños únicos y patrones de color.',
      },
      'interactive-art-colorwheel': {
        title: 'Práctica de Teoría del Color',
        description: 'Colorea imágenes con los colores correctos. ¡Aprende colores mientras te diviertes!',
      },
      'interactive-art-comic': {
        title: 'Creador de Tiras Cómicas',
        description: 'Crea tus propias tiras cómicas con paneles, globos de diálogo y personajes. ¡Cuenta una historia visual!',
      },
      'interactive-art-critique': {
        title: 'Crítica y Análisis de Arte',
        description: 'Aprende a observar, describir y analizar obras de arte usando vocabulario artístico y pensamiento crítico.',
      },
      'interactive-art-design': {
        title: 'Desafío de Diseño Creativo',
        description: 'Páginas de colorear divertidas con imágenes simples para colorear. ¡Perfecto para artistas jóvenes!',
      },
      'interactive-art-doodle': {
        title: 'Desafío de Arte Garabateado',
        description: 'Indicadores de garabateo de forma libre que despiertan la creatividad y la imaginación. ¡Sin reglas, solo diversión!',
      },
      'interactive-art-mandala': {
        title: 'Arte de Mandala y Patrones',
        description: 'Crea hermosos diseños de mandala con patrones y simetría. Perfecto para la atención plena y la creatividad.',
      },
      'interactive-art-patterns': {
        title: 'Arte de Patrones y Simetría',
        description: 'Crea patrones y explora la simetría a través de actividades de dibujo y coloreado.',
      },
      'interactive-art-perspective': {
        title: 'Práctica de Arte y Perspectiva',
        description: 'Aprende sobre perspectiva, sombreado y técnicas artísticas a través de ejercicios guiados.',
      },
      'interactive-art-seasonal': {
        title: 'Páginas de Colorear Estacionales',
        description: 'Páginas de colorear temáticas para diferentes estaciones y festividades. Cada hoja presenta diseños estacionales únicos.',
      },
      'interactive-art-shapes': {
        title: 'Arte y Dibujo de Formas',
        description: 'Crea arte usando formas básicas. Dibuja y colorea formas para hacer imágenes.',
      },
      'interactive-art-sketch': {
        title: 'Boceto y Observación',
        description: 'Indicadores de dibujo simples con pistas útiles. ¡Dibuja y diviértete!',
      },
      'interactive-cognitive-attention': {
        title: 'Constructor de Atención y Enfoque',
        description: 'Desarrolla atención sostenida y enfoque a través de escaneo visual, busca las diferencias y ejercicios de concentración.',
      },
      'interactive-cognitive-executive': {
        title: 'Práctica de Función Ejecutiva',
        description: 'Desarrolla habilidades de planificación, organización y finalización de tareas con actividades estructuradas y ejercicios de establecimiento de metas.',
      },
      'interactive-cognitive-flexibility': {
        title: 'Práctica de Flexibilidad Cognitiva',
        description: 'Desarrolla flexibilidad mental cambiando entre tareas, adaptándote a nuevas reglas y pensando desde múltiples perspectivas.',
      },
      'interactive-cognitive-memory': {
        title: 'Desafío de Memoria de Trabajo',
        description: 'Practica recordar secuencias, patrones e información. Fortalece la memoria de trabajo y las habilidades de recuperación.',
      },
      'interactive-cognitive-processing': {
        title: 'Desafío de Velocidad de Procesamiento',
        description: 'Mejora el reconocimiento rápido y el tiempo de respuesta a través de actividades cronometradas y ejercicios de identificación rápida.',
      },
      'interactive-cognitive-visual': {
        title: 'Habilidades de Procesamiento Visual',
        description: 'Mejora la discriminación visual, el razonamiento espacial y la integración visomotora a través de tareas de coincidencia de patrones y espaciales.',
      },
      'interactive-early-basics': {
        title: 'Práctica de Habilidades Básicas',
        description: 'Habilidades esenciales de aprendizaje temprano que incluyen sonidos de letras, conteo y patrones básicos.',
      },
      'interactive-early-counting': {
        title: 'Conteo y Reconocimiento de Números',
        description: 'Ejercicios de conteo interactivos con práctica de correspondencia uno a uno.',
      },
      'interactive-early-foundations': {
        title: 'Revisión de Habilidades Fundamentales',
        description: 'Revisa habilidades básicas de reconocimiento de letras, números y formas. Perfecto para remediación o revisión.',
      },
      'interactive-early-letters': {
        title: 'Práctica de Formación de Letras',
        description: 'Traza y escribe letras mayúsculas y minúsculas con práctica guiada.',
      },
      'interactive-early-numbers': {
        title: 'Escritura y Reconocimiento de Números',
        description: 'Practica escribir números del 1 al 20 y emparejar cantidades con numerales.',
      },
      'interactive-early-patterns': {
        title: 'Explorador de Reconocimiento de Patrones',
        description: 'Completa y crea patrones con colores, formas y números.',
      },
      'interactive-early-phonics': {
        title: 'Práctica Divertida de Fonética',
        description: 'Sonidos de letras, sonidos iniciales y práctica de palabras CVC. Cada hoja se enfoca en diferentes sonidos.',
      },
      'interactive-early-shapes': {
        title: 'Explorador de Formas y Colores',
        description: 'Identifica y empareja formas y colores con actividades de clasificación interactivas.',
      },
      'interactive-geography-continents': {
        title: 'Explorador de Continentes y Océanos',
        description: 'Aprende sobre los siete continentes y cinco océanos con mapas y actividades.',
      },
      'interactive-geography-culture': {
        title: 'Explorador de Culturas',
        description: 'Aprende sobre diferentes culturas, tradiciones y comunidades alrededor del mundo.',
      },
      'interactive-geography-economics': {
        title: 'Fundamentos de Economía',
        description: 'Explora oferta y demanda, presupuesto, alfabetización financiera y sistemas económicos.',
      },
      'interactive-geography-government': {
        title: 'Explorador de Civismo y Gobierno',
        description: 'Aprende sobre la estructura del gobierno, ciudadanía, derechos y responsabilidades.',
      },
      'interactive-geography-history': {
        title: 'Constructor de Línea de Tiempo Histórica',
        description: 'Crea líneas de tiempo y aprende sobre eventos históricos y figuras.',
      },
      'interactive-geography-map': {
        title: 'Habilidades de Mapas Interactivos',
        description: 'Practica leer mapas, usar leyendas e identificar ubicaciones. Cada hoja presenta diferentes mapas.',
      },
      'interactive-geography-places': {
        title: 'Lugares y Puntos de Referencia',
        description: 'Aprende sobre lugares importantes, puntos de referencia y ubicaciones en tu comunidad y país.',
      },
      'interactive-geography-prek': {
        title: 'Explorador de Mi Comunidad',
        description: 'Aprende sobre lugares en la comunidad, el hogar y la escuela con mapas simples e imágenes.',
      },
      'interactive-geography-seasons': {
        title: 'Estaciones y Clima Alrededor del Mundo',
        description: 'Aprende sobre diferentes estaciones, patrones climáticos y cómo varían en diferentes lugares.',
      },
      'interactive-grammar-advanced': {
        title: 'Práctica Avanzada de Gramática',
        description: 'Practica estructuras de oraciones complejas, cláusulas, frases y puntuación avanzada.',
      },
      'interactive-grammar-antonyms': {
        title: 'Desafío de Sinónimos y Antónimos',
        description: 'Empareja palabras con sinónimos y antónimos para expandir el vocabulario.',
      },
      'interactive-grammar-capitalization': {
        title: 'Mayúsculas y Puntuación',
        description: 'Practica el uso correcto de mayúsculas y puntuación en oraciones.',
      },
      'interactive-grammar-parts': {
        title: 'Práctica de Partes de la Oración',
        description: 'Identifica sustantivos, verbos, adjetivos y adverbios en oraciones. Cada hoja tiene nuevas oraciones.',
      },
      'interactive-grammar-plurals': {
        title: 'Plurales y Posesivos',
        description: 'Aprende a formar plurales y posesivos correctamente.',
      },
      'interactive-grammar-prek': {
        title: 'Emparejamiento de Palabras e Imágenes',
        description: 'Empareja palabras simples con imágenes e identifica tipos básicos de palabras.',
      },
      'interactive-grammar-rhyming': {
        title: 'Práctica de Palabras que Riman',
        description: 'Identifica y empareja palabras que riman a través de actividades divertidas.',
      },
      'interactive-grammar-tenses': {
        title: 'Dominio de Tiempos Verbales',
        description: 'Practica tiempos pasado, presente y futuro con ejercicios de conjugación de verbos.',
      },
      'interactive-grammar-vocab': {
        title: 'Constructor de Vocabulario Académico',
        description: 'Aprende y practica palabras de vocabulario académico con pistas de contexto y ejercicios de uso.',
      },
      'interactive-logic-analogies': {
        title: 'Analogías y Relaciones',
        description: 'Practica identificar relaciones y completar analogías.',
      },
      'interactive-logic-classification': {
        title: 'Clasificación y Categorización',
        description: 'Clasifica y categoriza objetos, imágenes y conceptos en grupos.',
      },
      'interactive-logic-deduction': {
        title: 'Búsqueda de Razonamiento Deductivo',
        description: 'Usa pistas para resolver misterios y rompecabezas lógicos.',
      },
      'interactive-logic-matching': {
        title: 'Juegos de Emparejamiento y Memoria',
        description: 'Empareja objetos, imágenes y conceptos. Practica habilidades de memoria y reconocimiento.',
      },
      'interactive-logic-prek': {
        title: 'Patrones y Clasificación Simples',
        description: 'Completa patrones simples y clasifica objetos por color, tamaño o tipo.',
      },
      'interactive-logic-riddles': {
        title: 'Adivinanzas y Acertijos',
        description: 'Resuelve adivinanzas y acertijos con niveles de dificultad variables.',
      },
      'interactive-logic-sequence': {
        title: 'Desafío de Secuenciación',
        description: 'Ordena eventos, pasos y patrones lógicamente. Cada hoja tiene secuencias únicas.',
      },
      'interactive-math-algebra': {
        title: 'Práctica de Fundamentos de Álgebra',
        description: 'Resuelve ecuaciones, trabaja con variables y practica expresiones algebraicas.',
      },
      'interactive-math-counting': {
        title: 'Conteo y Reconocimiento de Números',
        description: 'Practica contando objetos, reconociendo números y emparejando cantidades con numerales.',
      },
      'interactive-math-decimals': {
        title: 'Operaciones con Decimales',
        description: 'Suma, resta, multiplica y divide decimales con aplicaciones del mundo real.',
      },
      'interactive-math-division': {
        title: 'Práctica de División',
        description: 'Aprende hechos de división, usa matrices y resuelve problemas de palabras de división.',
      },
      'interactive-math-exponents': {
        title: 'Exponentes y Potencias',
        description: 'Comprende exponentes, potencias y notación científica.',
      },
      'interactive-math-fractions': {
        title: 'Práctica Divertida de Fracciones',
        description: 'Compara fracciones, encuentra equivalentes y resuelve operaciones con fracciones.',
      },
      'interactive-math-geometry': {
        title: 'Desafío Avanzado de Geometría',
        description: 'Calcula área, perímetro, volumen y trabaja con ángulos y transformaciones.',
      },
      'interactive-math-graphing': {
        title: 'Práctica de Datos y Gráficos',
        description: 'Crea gráficos de barras, pictogramas y gráficos de líneas a partir de conjuntos de datos.',
      },
      'interactive-math-integers': {
        title: 'Enteros y Recta Numérica',
        description: 'Trabaja con números positivos y negativos, valor absoluto y plano de coordenadas.',
      },
      'interactive-math-measurement': {
        title: 'Misión de Medición',
        description: 'Practica conversiones de medida de longitud, peso, volumen y tiempo.',
      },
      'interactive-math-money': {
        title: 'Dominio de Matemáticas con Dinero',
        description: 'Cuenta monedas, haz cambio y resuelve problemas de palabras con dinero.',
      },
      'interactive-math-multiplication': {
        title: 'Dominio de Multiplicación',
        description: 'Practica hechos de multiplicación, matrices y problemas de palabras de multiplicación.',
      },
      'interactive-math-percentages': {
        title: 'Dominio de Porcentajes y Razones',
        description: 'Calcula porcentajes, trabaja con razones y resuelve problemas de proporción.',
      },
      'interactive-math-place-value': {
        title: 'Explorador de Valor Posicional',
        description: 'Comprende el lugar de unidades, decenas, centenas y millares con ejercicios interactivos.',
      },
      'interactive-math-puzzle': {
        title: 'Caja de Rompecabezas de Ecuaciones',
        description: 'Resuelve ecuaciones con números faltantes organizadas en formato de rompecabezas. Cada rompecabezas es único.',
      },
      'interactive-math-race': {
        title: 'Desafío de Carrera Matemática',
        description: 'Desafíos de suma y resta cronometrados con niveles de dificultad variables.',
      },
      'interactive-math-rhythm': {
        title: 'Ritmo de Patrones Numéricos',
        description: 'Completa patrones numéricos con secuencias de conteo saltado. Cada hoja genera patrones únicos.',
      },
      'interactive-math-rounding': {
        title: 'Redondeo de Números',
        description: 'Redondea números a la decena, centena y millar más cercanos.',
      },
      'interactive-math-shapes': {
        title: 'Desafío de Formas Geométricas',
        description: 'Identifica, cuenta y clasifica formas con ejercicios interactivos.',
      },
      'interactive-math-statistics': {
        title: 'Explorador de Datos y Estadísticas',
        description: 'Analiza conjuntos de datos, crea gráficos, calcula media, mediana, moda e interpreta estadísticas.',
      },
      'interactive-math-tens-frames': {
        title: 'Práctica de Marcos de Diez',
        description: 'Usa marcos de diez para entender números, suma y resta visualmente.',
      },
      'interactive-math-time': {
        title: 'Práctica de Tiempo y Reloj',
        description: 'Lee relojes analógicos y digitales, calcula tiempo transcurrido y resuelve problemas de palabras de tiempo.',
      },
      'interactive-math-word-problems': {
        title: 'Problemas de Palabras Multi-Paso',
        description: 'Resuelve problemas de palabras complejos que requieren múltiples pasos y pensamiento crítico.',
      },
      'interactive-reading-adventure': {
        title: 'Búsqueda de Aventura de Lectura',
        description: 'Pasajes de historias interactivas con preguntas de opción múltiple y respuesta corta. Cada hoja presenta una nueva historia.',
      },
      'interactive-reading-alphabet': {
        title: 'Alfabeto y Reconocimiento de Letras',
        description: 'Practica reconocer letras, emparejar mayúsculas y minúsculas, y sonidos iniciales.',
      },
      'interactive-reading-character': {
        title: 'Taller de Análisis de Personajes',
        description: 'Analiza rasgos de personajes, motivaciones y desarrollo en historias.',
      },
      'interactive-reading-compare': {
        title: 'Pasajes de Comparar y Contrastar',
        description: 'Lee múltiples textos y compara temas, personajes o información.',
      },
      'interactive-reading-detective': {
        title: 'Desafío de Detective de Lectura',
        description: 'Encuentra pistas en el texto para responder preguntas misteriosas. Nuevos misterios cada vez.',
      },
      'interactive-reading-fluency': {
        title: 'Práctica de Fluidez de Lectura',
        description: 'Practica leer con expresión, precisión y ritmo apropiado. Incluye ejercicios de lectura repetida.',
      },
      'interactive-reading-literary-analysis': {
        title: 'Taller de Análisis Literario',
        description: 'Analiza elementos literarios, temas, simbolismo y propósito del autor en textos de ficción.',
      },
      'interactive-reading-prek': {
        title: 'Hora de Cuentos con Imágenes',
        description: 'Historias simples basadas en imágenes con preguntas de sí/no y actividades básicas de comprensión.',
      },
      'interactive-reading-research': {
        title: 'Constructor de Investigación y Evidencia',
        description: 'Practica encontrar y evaluar fuentes, citar evidencia y construir argumentos a partir de múltiples textos.',
      },
      'interactive-reading-sightwords': {
        title: 'Práctica de Palabras de Vista',
        description: 'Practica leer y escribir palabras de vista comunes con actividades divertidas.',
      },
      'interactive-reading-storymap': {
        title: 'Constructores de Mapa de Historia',
        description: 'Reconstruye historias de ficción con organizadores de inicio, medio y final más práctica de recopilación de pistas.',
      },
      'interactive-reading-summary': {
        title: 'Resumen e Idea Principal',
        description: 'Practica identificar ideas principales y escribir resúmenes concisos.',
      },
      'interactive-reading-vocab': {
        title: 'Taller Constructor de Vocabulario',
        description: 'Ejercicios de pistas de contexto con emparejamiento de palabras y completar oraciones.',
      },
      'interactive-science-animals': {
        title: 'Clasificación de Animales',
        description: 'Aprende sobre diferentes tipos de animales, sus hábitats y características.',
      },
      'interactive-science-chemistry': {
        title: 'Laboratorio de Fundamentos de Química',
        description: 'Explora átomos, moléculas, reacciones químicas y la tabla periódica.',
      },
      'interactive-science-ecology': {
        title: 'Estudio de Ecología y Medio Ambiente',
        description: 'Explora ecosistemas, redes alimentarias, problemas ambientales y conservación.',
      },
      'interactive-science-lifecycle': {
        title: 'Explorador de Ciclo de Vida',
        description: 'Hojas de trabajo interactivas que exploran ciclos de vida de plantas y animales.',
      },
      'interactive-science-observation': {
        title: 'Diario de Observación Científica',
        description: 'Registros de observación diarios para experimentos y estudios de la naturaleza. Cada hoja presenta nuevos indicadores.',
      },
      'interactive-science-physics': {
        title: 'Fundamentos de Física',
        description: 'Aprende sobre fuerzas, movimiento, energía y máquinas simples con actividades prácticas.',
      },
      'interactive-science-plants': {
        title: 'Explorador de Plantas',
        description: 'Aprende sobre plantas, sus partes y cómo crecen a través de actividades simples.',
      },
      'interactive-science-prek': {
        title: 'Explorador de la Naturaleza',
        description: 'Actividades simples de observación de la naturaleza con imágenes y preguntas básicas sobre plantas, animales y clima.',
      },
      'interactive-science-senses': {
        title: 'Explorador de los Cinco Sentidos',
        description: 'Explora los cinco sentidos a través de actividades prácticas y ejercicios de observación.',
      },
      'interactive-science-space': {
        title: 'Explorador del Espacio y la Astronomía',
        description: 'Aprende sobre planetas, estrellas y fenómenos espaciales con actividades interactivas.',
      },
      'interactive-science-states': {
        title: 'Laboratorio de Estados de la Materia',
        description: 'Actividades prácticas que exploran sólido, líquido, gas con gráficos de observación.',
      },
      'interactive-science-weather': {
        title: 'Diario Observador del Clima',
        description: 'Rastrea patrones climáticos, temperatura y observaciones a lo largo del tiempo.',
      },
      'interactive-sel-character': {
        title: 'Construcción de Carácter y Valores',
        description: 'Explora rasgos de carácter importantes como honestidad, respeto, responsabilidad e integridad.',
      },
      'interactive-sel-conflict': {
        title: 'Habilidades de Resolución de Conflictos',
        description: 'Aprende estrategias para resolver conflictos pacíficamente y comunicarte efectivamente con otros.',
      },
      'interactive-sel-empathy': {
        title: 'Constructor de Empatía',
        description: 'Practica tomar perspectiva y entender los sentimientos y experiencias de otros.',
      },
      'interactive-sel-friendship': {
        title: 'Amistad y Habilidades Sociales',
        description: 'Aprende sobre hacer amigos, compartir, tomar turnos y ser amable con otros.',
      },
      'interactive-sel-goals': {
        title: 'Establecimiento de Metas y Crecimiento',
        description: 'Establece y rastrea metas personales y académicas con planes de acción.',
      },
      'interactive-sel-gratitude': {
        title: 'Gratitud y Apreciación',
        description: 'Practica la gratitud a través de actividades de escritura, dibujo y reflexión.',
      },
      'interactive-sel-growth-mindset': {
        title: 'Práctica de Mentalidad de Crecimiento',
        description: 'Desarrolla una mentalidad de crecimiento aprendiendo a abrazar desafíos, aprender de errores y persistir.',
      },
      'interactive-sel-kindness': {
        title: 'Desafío de Bondad',
        description: 'Completa actos diarios de bondad y reflexiona sobre cómo la bondad impacta a ti mismo y a otros.',
      },
      'interactive-sel-mindfulness': {
        title: 'Atención Plena y Reflexión',
        description: 'Ejercicios diarios de atención plena con técnicas de respiración e indicadores de reflexión.',
      },
      'interactive-sel-prek': {
        title: 'Explorador de Sentimientos y Emociones',
        description: 'Identifica y expresa sentimientos a través de imágenes, palabras simples y actividades.',
      },
      'interactive-sel-regulation': {
        title: 'Estrategias de Autorregulación',
        description: 'Practica técnicas para manejar emociones, mantener la calma y tomar decisiones reflexivas.',
      },
      'interactive-sel-stress': {
        title: 'Manejo del Estrés y Afrontamiento',
        description: 'Identifica desencadenantes del estrés y practica estrategias saludables de afrontamiento para manejar ansiedad y estrés.',
      },
      'interactive-writing-argumentative': {
        title: 'Práctica de Escritura Argumentativa',
        description: 'Desarrolla argumentos con afirmaciones, evidencia y razonamiento. Practica habilidades de escritura persuasiva.',
      },
      'interactive-writing-essay': {
        title: 'Taller de Escritura de Ensayos',
        description: 'Practica escribir ensayos estructurados con declaraciones de tesis, párrafos del cuerpo y conclusiones.',
      },
      'interactive-writing-informative': {
        title: 'Guía de Escritura Informativa',
        description: 'Aprende a escribir párrafos y ensayos informativos con hechos, detalles y explicaciones.',
      },
      'interactive-writing-lowercase-trace': {
        title: 'Práctica de Escritura Ordenada – Trazado del Alfabeto en Minúsculas',
        description: 'Practica trazar letras minúsculas con líneas guía. Perfecto para desarrollar habilidades de escritura ordenada.',
      },
      'interactive-writing-narrative': {
        title: 'Práctica de Escritura Narrativa',
        description: 'Escribe historias cortas con inicio, medio y final. Incluye plantillas de planificación de historias.',
      },
      'interactive-writing-opinion': {
        title: 'Marco de Escritura de Opinión',
        description: 'Plantillas estructuradas para escritura de opinión con indicadores y recopilación de evidencia.',
      },
      'interactive-writing-pictures': {
        title: 'Iniciadores de Historias con Imágenes',
        description: 'Dibuja imágenes basadas en indicadores y escribe oraciones simples sobre lo que ves.',
      },
      'interactive-writing-poetry': {
        title: 'Práctica de Escritura de Poesía',
        description: 'Ejercicios de poesía guiados con indicadores de rima, haiku y verso libre.',
      },
      'interactive-writing-prek': {
        title: 'Dibujo y Etiquetado',
        description: 'Dibuja imágenes y etiquétalas con palabras simples. ¡Perfecto para artistas principiantes!',
      },
      'interactive-writing-prompts': {
        title: 'Indicadores de Escritura Creativa',
        description: 'Iniciadores de historias únicos e indicadores de escritura creativa que cambian con cada generación.',
      },
      'interactive-writing-research': {
        title: 'Planificador de Trabajo de Investigación',
        description: 'Organiza investigación, crea esquemas y estructura trabajos de investigación con citas apropiadas.',
      },
      'interactive-writing-sentences': {
        title: 'Taller Constructor de Oraciones',
        description: 'Practica construir oraciones completas con estructuras variadas y puntuación.',
      },
      'interactive-writing-trace': {
        title: 'Trazado de Letras y Palabras',
        description: 'Traza letras y palabras simples para desarrollar habilidades de escritura y reconocimiento de letras.',
      },
    },
    ar: {
      'interactive-art-color-by-number': {
        title: 'فن التلوين بالأرقام',
        description: 'لون الصور باستخدام رموز الأرقام. كل ورقة تتميز بتصاميم وأنماط ألوان فريدة.',
      },
      'interactive-art-colorwheel': {
        title: 'ممارسة نظرية الألوان',
        description: 'لون الصور بالألوان الصحيحة. تعلم الألوان أثناء الاستمتاع!',
      },
      'interactive-art-comic': {
        title: 'منشئ القصص المصورة',
        description: 'أنشئ قصصك المصورة الخاصة مع اللوحات وفقاعات الكلام والشخصيات. اروِ قصة بصرية!',
      },
      'interactive-art-critique': {
        title: 'نقد وتحليل الفن',
        description: 'تعلم مراقبة ووصف وتحليل الأعمال الفنية باستخدام مفردات فنية والتفكير النقدي.',
      },
      'interactive-art-design': {
        title: 'تحدي التصميم الإبداعي',
        description: 'صفحات تلوين ممتعة مع صور بسيطة للتلوين. مثالي للفنانين الصغار!',
      },
      'interactive-art-doodle': {
        title: 'تحدي فن الخربشة',
        description: 'مطالبات خربشة حرة تثير الإبداع والخيال. لا قواعد، فقط متعة!',
      },
      'interactive-art-mandala': {
        title: 'فن الماندالا والأنماط',
        description: 'أنشئ تصاميم ماندالا جميلة مع الأنماط والتماثل. مثالي للوعي والإبداع.',
      },
      'interactive-art-patterns': {
        title: 'فن الأنماط والتماثل',
        description: 'أنشئ أنماطاً واستكشف التماثل من خلال أنشطة الرسم والتلوين.',
      },
      'interactive-art-perspective': {
        title: 'ممارسة الفن والمنظور',
        description: 'تعلم عن المنظور والتظليل والتقنيات الفنية من خلال التمارين الموجهة.',
      },
      'interactive-art-seasonal': {
        title: 'صفحات التلوين الموسمية',
        description: 'صفحات تلوين مواضيعية لموسمات وعطلات مختلفة. كل ورقة تتميز بتصاميم موسمية فريدة.',
      },
      'interactive-art-shapes': {
        title: 'فن الأشكال والرسم',
        description: 'أنشئ فناً باستخدام الأشكال الأساسية. ارسم ولون الأشكال لصنع صور.',
      },
      'interactive-art-sketch': {
        title: 'الرسم والمراقبة',
        description: 'مطالبات رسم بسيطة مع تلميحات مفيدة. ارسم واستمتع!',
      },
      'interactive-cognitive-attention': {
        title: 'باني الانتباه والتركيز',
        description: 'طور الانتباه والتركيز المستدام من خلال المسح البصري وتمارين البحث عن الاختلافات والتركيز.',
      },
      'interactive-cognitive-executive': {
        title: 'ممارسة الوظيفة التنفيذية',
        description: 'ابنِ مهارات التخطيط والتنظيم وإكمال المهام مع الأنشطة المنظمة وتمارين تحديد الأهداف.',
      },
      'interactive-cognitive-flexibility': {
        title: 'ممارسة المرونة المعرفية',
        description: 'طور المرونة العقلية بالتبديل بين المهام والتكيف مع القواعد الجديدة والتفكير من وجهات نظر متعددة.',
      },
      'interactive-cognitive-memory': {
        title: 'تحدي الذاكرة العاملة',
        description: 'تدرب على تذكر التسلسلات والأنماط والمعلومات. يقوي الذاكرة العاملة ومهارات الاستدعاء.',
      },
      'interactive-cognitive-processing': {
        title: 'تحدي سرعة المعالجة',
        description: 'حسّن التعرف السريع ووقت الاستجابة من خلال الأنشطة الموقوتة وتمارين التعرف السريع.',
      },
      'interactive-cognitive-visual': {
        title: 'مهارات المعالجة البصرية',
        description: 'عزز التمييز البصري والاستدلال المكاني والتكامل الحركي البصري من خلال مطابقة الأنماط والمهام المكانية.',
      },
      'interactive-early-basics': {
        title: 'ممارسة المهارات الأساسية',
        description: 'مهارات التعلم المبكر الأساسية بما في ذلك أصوات الحروف والعد والأنماط الأساسية.',
      },
      'interactive-early-counting': {
        title: 'العد والتعرف على الأرقام',
        description: 'تمارين عد تفاعلية مع ممارسة المراسلة واحد لواحد.',
      },
      'interactive-early-foundations': {
        title: 'مراجعة المهارات الأساسية',
        description: 'راجع مهارات التعرف الأساسية على الحروف والأرقام والأشكال. مثالي للمعالجة أو المراجعة.',
      },
      'interactive-early-letters': {
        title: 'ممارسة تكوين الحروف',
        description: 'تتبع واكتب الأحرف الكبيرة والصغيرة مع ممارسة موجهة.',
      },
      'interactive-early-numbers': {
        title: 'كتابة الأرقام والتعرف عليها',
        description: 'تدرب على كتابة الأرقام من 1 إلى 20 ومطابقة الكميات بالأرقام.',
      },
      'interactive-early-patterns': {
        title: 'مستكشف التعرف على الأنماط',
        description: 'أكمل وأنشئ أنماطاً بالألوان والأشكال والأرقام.',
      },
      'interactive-early-phonics': {
        title: 'ممارسة ممتعة للفونيكس',
        description: 'أصوات الحروف والأصوات الأولية وممارسة كلمات CVC. كل ورقة تركز على أصوات مختلفة.',
      },
      'interactive-early-shapes': {
        title: 'مستكشف الأشكال والألوان',
        description: 'حدد وطابق الأشكال والألوان مع أنشطة التصنيف التفاعلية.',
      },
      'interactive-geography-continents': {
        title: 'مستكشف القارات والمحيطات',
        description: 'تعلم عن القارات السبع والمحيطات الخمسة مع الخرائط والأنشطة.',
      },
      'interactive-geography-culture': {
        title: 'مستكشف الثقافات',
        description: 'تعلم عن الثقافات والتقاليد والمجتمعات المختلفة حول العالم.',
      },
      'interactive-geography-economics': {
        title: 'أساسيات الاقتصاد',
        description: 'استكشف العرض والطلب والميزانية والثقافة المالية والأنظمة الاقتصادية.',
      },
      'interactive-geography-government': {
        title: 'مستكشف المواطنة والحكومة',
        description: 'تعلم عن هيكل الحكومة والمواطنة والحقوق والمسؤوليات.',
      },
      'interactive-geography-history': {
        title: 'باني الخط الزمني التاريخي',
        description: 'أنشئ خطوطاً زمنية وتعلم عن الأحداث والشخصيات التاريخية.',
      },
      'interactive-geography-map': {
        title: 'مهارات الخرائط التفاعلية',
        description: 'تدرب على قراءة الخرائط واستخدام المفاتيح وتحديد المواقع. كل ورقة تتميز بخرائط مختلفة.',
      },
      'interactive-geography-places': {
        title: 'الأماكن والمعالم',
        description: 'تعلم عن الأماكن والمعالم والمواقع المهمة في مجتمعك وبلدك.',
      },
      'interactive-geography-prek': {
        title: 'مستكشف مجتمعي',
        description: 'تعلم عن الأماكن في المجتمع والمنزل والمدرسة مع خرائط وصور بسيطة.',
      },
      'interactive-geography-seasons': {
        title: 'الفصول والطقس حول العالم',
        description: 'تعلم عن الفصول المختلفة وأنماط الطقس وكيف تختلف في أماكن مختلفة.',
      },
      'interactive-grammar-advanced': {
        title: 'ممارسة النحو المتقدمة',
        description: 'تدرب على تراكيب الجمل المعقدة والعبارات والجمل وعلامات الترقيم المتقدمة.',
      },
      'interactive-grammar-antonyms': {
        title: 'تحدي المرادفات والمتضادات',
        description: 'طابق الكلمات مع المرادفات والمتضادات لتوسيع المفردات.',
      },
      'interactive-grammar-capitalization': {
        title: 'الحروف الكبيرة وعلامات الترقيم',
        description: 'تدرب على الاستخدام الصحيح للحروف الكبيرة وعلامات الترقيم في الجمل.',
      },
      'interactive-grammar-parts': {
        title: 'ممارسة أجزاء الكلام',
        description: 'حدد الأسماء والأفعال والصفات والظروف في الجمل. كل ورقة تحتوي على جمل جديدة.',
      },
      'interactive-grammar-plurals': {
        title: 'الجمع والملكية',
        description: 'تعلم تكوين الجمع والملكية بشكل صحيح.',
      },
      'interactive-grammar-prek': {
        title: 'مطابقة الكلمات والصور',
        description: 'طابق الكلمات البسيطة مع الصور وحدد أنواع الكلمات الأساسية.',
      },
      'interactive-grammar-rhyming': {
        title: 'ممارسة الكلمات المقفاة',
        description: 'حدد وطابق الكلمات المقفاة من خلال أنشطة ممتعة.',
      },
      'interactive-grammar-tenses': {
        title: 'إتقان أزمنة الأفعال',
        description: 'تدرب على الأزمنة الماضية والحاضرة والمستقبلية مع تمارين تصريف الأفعال.',
      },
      'interactive-grammar-vocab': {
        title: 'باني المفردات الأكاديمية',
        description: 'تعلم ومارس كلمات المفردات الأكاديمية مع أدلة السياق وتمارين الاستخدام.',
      },
      'interactive-logic-analogies': {
        title: 'القياسات والعلاقات',
        description: 'تدرب على تحديد العلاقات وإكمال القياسات.',
      },
      'interactive-logic-classification': {
        title: 'التصنيف والفئات',
        description: 'صنف وفرز الكائنات والصور والمفاهيم إلى مجموعات.',
      },
      'interactive-logic-deduction': {
        title: 'مهمة الاستدلال الاستنتاجي',
        description: 'استخدم الأدلة لحل الألغاز والأحاجي المنطقية.',
      },
      'interactive-logic-matching': {
        title: 'ألعاب المطابقة والذاكرة',
        description: 'طابق الكائنات والصور والمفاهيم. تدرب على مهارات الذاكرة والتعرف.',
      },
      'interactive-logic-prek': {
        title: 'الأنماط والتصنيف البسيطة',
        description: 'أكمل الأنماط البسيطة وصنف الكائنات حسب اللون أو الحجم أو النوع.',
      },
      'interactive-logic-riddles': {
        title: 'الألغاز والأحاجي',
        description: 'حل الألغاز والأحاجي بمستويات صعوبة مختلفة.',
      },
      'interactive-logic-sequence': {
        title: 'تحدي التسلسل',
        description: 'رتب الأحداث والخطوات والأنماط منطقياً. كل ورقة تحتوي على تسلسلات فريدة.',
      },
      'interactive-math-algebra': {
        title: 'ممارسة أساسيات الجبر',
        description: 'حل المعادلات واعمل مع المتغيرات ومارس التعبيرات الجبرية.',
      },
      'interactive-math-counting': {
        title: 'العد والتعرف على الأرقام',
        description: 'تدرب على عد الكائنات والتعرف على الأرقام ومطابقة الكميات بالأرقام.',
      },
      'interactive-math-decimals': {
        title: 'عمليات الكسور العشرية',
        description: 'اجمع واطرح واضرب واقسم الكسور العشرية مع تطبيقات من العالم الحقيقي.',
      },
      'interactive-math-division': {
        title: 'ممارسة القسمة',
        description: 'تعلم حقائق القسمة واستخدم المصفوفات وحل مسائل القسمة اللفظية.',
      },
      'interactive-math-exponents': {
        title: 'الأسس والقوى',
        description: 'افهم الأسس والقوى والتدوين العلمي.',
      },
      'interactive-math-fractions': {
        title: 'ممارسة ممتعة للكسور',
        description: 'قارن الكسور وابحث عن المكافئات وحل عمليات الكسور.',
      },
      'interactive-math-geometry': {
        title: 'تحدي الهندسة المتقدمة',
        description: 'احسب المساحة والمحيط والحجم واعمل مع الزوايا والتحويلات.',
      },
      'interactive-math-graphing': {
        title: 'ممارسة البيانات والرسوم البيانية',
        description: 'أنشئ رسوم بيانية شريطية ورسوم بيانية مصورة ومخططات خطية من مجموعات البيانات.',
      },
      'interactive-math-integers': {
        title: 'الأعداد الصحيحة وخط الأعداد',
        description: 'اعمل مع الأعداد الموجبة والسالبة والقيمة المطلقة ومستوى الإحداثيات.',
      },
      'interactive-math-measurement': {
        title: 'مهمة القياس',
        description: 'تدرب على تحويلات قياس الطول والوزن والحجم والوقت.',
      },
      'interactive-math-money': {
        title: 'إتقان رياضيات المال',
        description: 'عد العملات المعدنية واصنع الباقي وحل مسائل المال اللفظية.',
      },
      'interactive-math-multiplication': {
        title: 'إتقان الضرب',
        description: 'تدرب على حقائق الضرب والمصفوفات ومسائل الضرب اللفظية.',
      },
      'interactive-math-percentages': {
        title: 'إتقان النسب المئوية والنسب',
        description: 'احسب النسب المئوية واعمل مع النسب وحل مسائل التناسب.',
      },
      'interactive-math-place-value': {
        title: 'مستكشف القيمة المنزلية',
        description: 'افهم منزلة الآحاد والعشرات والمئات والآلاف مع تمارين تفاعلية.',
      },
      'interactive-math-puzzle': {
        title: 'صندوق لغز المعادلات',
        description: 'حل معادلات الأرقام المفقودة مرتبة بتنسيق الألغاز. كل لغز فريد.',
      },
      'interactive-math-race': {
        title: 'تحدي سباق الرياضيات',
        description: 'تحديات الجمع والطرح الموقوتة بمستويات صعوبة مختلفة.',
      },
      'interactive-math-rhythm': {
        title: 'إيقاع الأنماط الرقمية',
        description: 'أكمل الأنماط الرقمية مع تسلسلات العد بالقفز. كل ورقة تولد أنماطاً فريدة.',
      },
      'interactive-math-rounding': {
        title: 'تقريب الأرقام',
        description: 'قرّب الأرقام لأقرب عشرة ومئة وألف.',
      },
      'interactive-math-shapes': {
        title: 'تحدي الأشكال الهندسية',
        description: 'حدد وعد وصنف الأشكال مع تمارين تفاعلية.',
      },
      'interactive-math-statistics': {
        title: 'مستكشف البيانات والإحصاءات',
        description: 'حلل مجموعات البيانات وأنشئ رسوم بيانية واحسب المتوسط والوسيط والمنوال وفسر الإحصاءات.',
      },
      'interactive-math-tens-frames': {
        title: 'ممارسة إطارات العشرة',
        description: 'استخدم إطارات العشرة لفهم الأرقام والجمع والطرح بصرياً.',
      },
      'interactive-math-time': {
        title: 'ممارسة الوقت والساعة',
        description: 'اقرأ الساعات التناظرية والرقمية واحسب الوقت المنقضي وحل مسائل الوقت اللفظية.',
      },
      'interactive-math-word-problems': {
        title: 'مسائل متعددة الخطوات',
        description: 'حل مسائل لفظية معقدة تتطلب خطوات متعددة والتفكير النقدي.',
      },
      'interactive-reading-adventure': {
        title: 'مهمة مغامرة القراءة',
        description: 'مقتطفات قصص تفاعلية مع أسئلة الاختيار من متعدد والإجابة القصيرة. كل ورقة تتميز بقصة جديدة.',
      },
      'interactive-reading-alphabet': {
        title: 'الأبجدية والتعرف على الحروف',
        description: 'تدرب على التعرف على الحروف ومطابقة الأحرف الكبيرة والصغيرة والأصوات الأولية.',
      },
      'interactive-reading-character': {
        title: 'ورشة تحليل الشخصيات',
        description: 'حلل سمات الشخصيات والدوافع والتطور في القصص.',
      },
      'interactive-reading-compare': {
        title: 'مقتطفات المقارنة والتباين',
        description: 'اقرأ نصوصاً متعددة وقارن المواضيع أو الشخصيات أو المعلومات.',
      },
      'interactive-reading-detective': {
        title: 'تحدي المحقق القارئ',
        description: 'ابحث عن الأدلة في النص للإجابة على أسئلة الغموض. ألغاز جديدة في كل مرة.',
      },
      'interactive-reading-fluency': {
        title: 'ممارسة طلاقة القراءة',
        description: 'تدرب على القراءة بالتعبير والدقة والسرعة المناسبة. يتضمن تمارين القراءة المتكررة.',
      },
      'interactive-reading-literary-analysis': {
        title: 'ورشة التحليل الأدبي',
        description: 'حلل العناصر الأدبية والمواضيع والرمزية والغرض من المؤلف في النصوص الخيالية.',
      },
      'interactive-reading-prek': {
        title: 'وقت قصة الصور',
        description: 'قصص بسيطة قائمة على الصور مع أسئلة نعم/لا وأنشطة فهم أساسية.',
      },
      'interactive-reading-research': {
        title: 'باني البحث والأدلة',
        description: 'تدرب على العثور على المصادر وتقييمها واستشهاد الأدلة وبناء الحجج من نصوص متعددة.',
      },
      'interactive-reading-sightwords': {
        title: 'ممارسة كلمات البصر',
        description: 'تدرب على قراءة وكتابة كلمات البصر الشائعة مع أنشطة ممتعة.',
      },
      'interactive-reading-storymap': {
        title: 'بناة خريطة القصة',
        description: 'أعد سرد قصص خيالية مع منظمات البداية والوسط والنهاية بالإضافة إلى ممارسة جمع الأدلة.',
      },
      'interactive-reading-summary': {
        title: 'الملخص والفكرة الرئيسية',
        description: 'تدرب على تحديد الأفكار الرئيسية وكتابة ملخصات موجزة.',
      },
      'interactive-reading-vocab': {
        title: 'ورشة باني المفردات',
        description: 'تمارين أدلة السياق مع مطابقة الكلمات وإكمال الجمل.',
      },
      'interactive-science-animals': {
        title: 'تصنيف الحيوانات',
        description: 'تعلم عن أنواع الحيوانات المختلفة وموائلها وخصائصها.',
      },
      'interactive-science-chemistry': {
        title: 'مختبر أساسيات الكيمياء',
        description: 'استكشف الذرات والجزيئات والتفاعلات الكيميائية والجدول الدوري.',
      },
      'interactive-science-ecology': {
        title: 'دراسة البيئة والبيئة',
        description: 'استكشف النظم البيئية وشبكات الغذاء والقضايا البيئية والحفظ.',
      },
      'interactive-science-lifecycle': {
        title: 'مستكشف دورة الحياة',
        description: 'أوراق عمل تفاعلية تستكشف دورات حياة النباتات والحيوانات.',
      },
      'interactive-science-observation': {
        title: 'مجلة المراقبة العلمية',
        description: 'سجلات مراقبة يومية للتجارب ودراسات الطبيعة. كل ورقة تتميز بمطالبات جديدة.',
      },
      'interactive-science-physics': {
        title: 'أساسيات الفيزياء',
        description: 'تعلم عن القوى والحركة والطاقة والآلات البسيطة مع أنشطة عملية.',
      },
      'interactive-science-plants': {
        title: 'مستكشف النباتات',
        description: 'تعلم عن النباتات وأجزائها وكيف تنمو من خلال أنشطة بسيطة.',
      },
      'interactive-science-prek': {
        title: 'مستكشف الطبيعة',
        description: 'أنشطة بسيطة لمراقبة الطبيعة مع الصور والأسئلة الأساسية حول النباتات والحيوانات والطقس.',
      },
      'interactive-science-senses': {
        title: 'مستكشف الحواس الخمس',
        description: 'استكشف الحواس الخمس من خلال الأنشطة العملية وتمارين المراقبة.',
      },
      'interactive-science-space': {
        title: 'مستكشف الفضاء وعلم الفلك',
        description: 'تعلم عن الكواكب والنجوم وظواهر الفضاء مع الأنشطة التفاعلية.',
      },
      'interactive-science-states': {
        title: 'مختبر حالات المادة',
        description: 'أنشطة عملية تستكشف الصلب والسائل والغاز مع مخططات المراقبة.',
      },
      'interactive-science-weather': {
        title: 'مجلة مراقب الطقس',
        description: 'تتبع أنماط الطقس ودرجة الحرارة والملاحظات بمرور الوقت.',
      },
      'interactive-sel-character': {
        title: 'بناء الشخصية والقيم',
        description: 'استكشف سمات الشخصية المهمة مثل الصدق والاحترام والمسؤولية والنزاهة.',
      },
      'interactive-sel-conflict': {
        title: 'مهارات حل النزاعات',
        description: 'تعلم استراتيجيات حل النزاعات بسلام والتواصل الفعال مع الآخرين.',
      },
      'interactive-sel-empathy': {
        title: 'باني التعاطف',
        description: 'تدرب على أخذ المنظور وفهم مشاعر وتجارب الآخرين.',
      },
      'interactive-sel-friendship': {
        title: 'الصداقة والمهارات الاجتماعية',
        description: 'تعلم عن تكوين الصداقات والمشاركة وأخذ الأدوار واللطف مع الآخرين.',
      },
      'interactive-sel-goals': {
        title: 'تحديد الأهداف والنمو',
        description: 'حدد وتتبع الأهداف الشخصية والأكاديمية مع خطط العمل.',
      },
      'interactive-sel-gratitude': {
        title: 'الامتنان والتقدير',
        description: 'مارس الامتنان من خلال أنشطة الكتابة والرسم والتأمل.',
      },
      'interactive-sel-growth-mindset': {
        title: 'ممارسة عقلية النمو',
        description: 'طور عقلية النمو من خلال تعلم احتضان التحديات والتعلم من الأخطاء والمثابرة.',
      },
      'interactive-sel-kindness': {
        title: 'تحدي اللطف',
        description: 'أكمل أعمال لطف يومية وتأمل في كيفية تأثير اللطف على نفسك والآخرين.',
      },
      'interactive-sel-mindfulness': {
        title: 'اليقظة والتأمل',
        description: 'تمارين اليقظة اليومية مع تقنيات التنفس ومطالبات التأمل.',
      },
      'interactive-sel-prek': {
        title: 'مستكشف المشاعر والعواطف',
        description: 'حدد وعبّر عن المشاعر من خلال الصور والكلمات البسيطة والأنشطة.',
      },
      'interactive-sel-regulation': {
        title: 'استراتيجيات التنظيم الذاتي',
        description: 'تدرب على تقنيات إدارة المشاعر والبقاء هادئاً واتخاذ خيارات مدروسة.',
      },
      'interactive-sel-stress': {
        title: 'إدارة التوتر والمواجهة',
        description: 'حدد محفزات التوتر ومارس استراتيجيات مواجهة صحية لإدارة القلق والتوتر.',
      },
      'interactive-writing-argumentative': {
        title: 'ممارسة الكتابة الجدلية',
        description: 'طور الحجج مع الادعاءات والأدلة والمنطق. تدرب على مهارات الكتابة الإقناعية.',
      },
      'interactive-writing-essay': {
        title: 'ورشة كتابة المقالات',
        description: 'تدرب على كتابة مقالات منظمة مع بيانات الأطروحة والفقرات الأساسية والاستنتاجات.',
      },
      'interactive-writing-informative': {
        title: 'دليل الكتابة الإعلامية',
        description: 'تعلم كتابة الفقرات والمقالات الإعلامية مع الحقائق والتفاصيل والتفسيرات.',
      },
      'interactive-writing-lowercase-trace': {
        title: 'ممارسة الخط المرتب – تتبع الأبجدية الصغيرة',
        description: 'تدرب على تتبع الأحرف الصغيرة مع خطوط إرشادية. مثالي لتطوير مهارات الخط المرتب.',
      },
      'interactive-writing-narrative': {
        title: 'ممارسة الكتابة السردية',
        description: 'اكتب قصصاً قصيرة مع البداية والوسط والنهاية. يتضمن قوالب تخطيط القصة.',
      },
      'interactive-writing-opinion': {
        title: 'إطار كتابة الرأي',
        description: 'قوالب منظمة لكتابة الرأي مع مطالبات وجمع الأدلة.',
      },
      'interactive-writing-pictures': {
        title: 'مبتدئو قصص الصور',
        description: 'ارسم صوراً بناءً على مطالبات واكتب جمل بسيطة عما تراه.',
      },
      'interactive-writing-poetry': {
        title: 'ممارسة كتابة الشعر',
        description: 'تمارين شعرية موجهة مع مطالبات القافية والهايكو والقصيدة الحرة.',
      },
      'interactive-writing-prek': {
        title: 'الرسم والتسمية',
        description: 'ارسم الصور وضع عليها تسميات بكلمات بسيطة. مثالي للفنانين المبتدئين!',
      },
      'interactive-writing-prompts': {
        title: 'مطالبات الكتابة الإبداعية',
        description: 'مبتدئو قصص فريدون ومطالبات كتابة إبداعية تتغير مع كل جيل.',
      },
      'interactive-writing-research': {
        title: 'مخطط ورقة البحث',
        description: 'نظم البحث وأنشئ الخطوط العريضة وبنِ أوراق البحث مع الاستشهادات المناسبة.',
      },
      'interactive-writing-sentences': {
        title: 'ورشة بناء الجمل',
        description: 'تدرب على بناء جمل كاملة مع تراكيب متنوعة وعلامات الترقيم.',
      },
      'interactive-writing-trace': {
        title: 'تتبع الحروف والكلمات',
        description: 'تتبع الحروف والكلمات البسيطة لبناء مهارات الكتابة والتعرف على الحروف.',
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations) {
      // Create interactive object if it doesn't exist
      if (!langTranslations.interactive) {
        langTranslations.interactive = {}
      }
      const interactive = langTranslations.interactive
      const keys = interactiveTitleDescKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      Object.keys(keys).forEach((docId) => {
        if (keys[docId as keyof typeof keys]) {
          interactive[docId] = keys[docId as keyof typeof keys]
        }
      })
    }
  }
}

// Runtime merge: Ensure worksheet keys are always present
// This fixes the tree-shaking issue by directly injecting the keys
const ensureWorksheetKeys = () => {
  // First, ensure interactive worksheet title/description keys
  ensureInteractiveTitleDescriptionKeys()
  
  // Then, ensure interactive worksheet keys
  ensureInteractiveWorksheetKeys()
  
  // Then, ensure times-table worksheet keys
  ensureTimesTableWorksheetKeys()
  
  // Then, ensure place-value-hto worksheet keys
  ensurePlaceValueHtoKeys()
  
  // Then, ensure count-circle-1-10 worksheet keys
  ensureCountCircleKeys()
  
  // Then, ensure mult-facts-0-12 worksheet keys
  ensureMultFactsKeys()
  
  // Then, ensure math-maze worksheet keys
  ensureMathMazeKeys()
  
  // Then, ensure number-tracing-1-20 worksheet keys
  ensureNumberTracing120Keys()
  
  // Then, ensure addition-subtraction-0-10 worksheet keys
  ensureAdditionSubtraction010Keys()
  
  // Then, ensure number-id-1-10 worksheet keys
  ensureNumberId110Keys()
}

const ensureInteractiveWorksheetKeys = () => {
  // Define the keys directly to prevent tree-shaking
  const interactiveKeys = {
    en: {
      countObjectsAndWriteNumber: 'Count the objects and write the number.',
      countThe: 'Count the {{object}}',
      numberLabel: 'Number',
      objectNames: {
        stars: 'stars',
        hearts: 'hearts',
        circles: 'circles',
        apples: 'apples',
        balls: 'balls',
        flowers: 'flowers',
        butterflies: 'butterflies',
        fish: 'fish',
      },
      mathPuzzle: {
        instructions: 'Fill in the missing numbers to complete each equation. Show a different strategy (number line, draw, tens frame) for at least two puzzles.',
        answerLabel: 'Puzzle {{number}} answer',
      },
      mathRace: {
        instructions: 'Set a 60-second timer. Solve as many facts as you can, then circle your personal record.',
      },
      reflection: {
        title: 'Reflection',
        mathRaceQuestions: 'How many facts did you solve? ______ • Which strategy helped you most? ____________________',
        generalQuestions: 'What helped you complete your tasks? What would you do differently next time?',
        mandalaQuestion: 'Reflection: How did creating this mandala make you feel?',
      },
      answerKeyAndNotes: 'Answer key & teacher notes',
      countingTeachingNote: 'Teaching note: Students should count each object one by one. Encourage pointing or touching each object while counting to develop one-to-one correspondence.',
      placeValue: {
        instructions: 'Identify the digit in each place value.',
        placeValueChart: 'Place Value Chart:',
        whatDigit: 'What digit is in the {{place}} place?',
        expandedForm: 'Expanded form:',
        ones: 'Ones',
        tens: 'Tens',
        hundreds: 'Hundreds',
        thousands: 'Thousands',
        explanation: 'In the number {{number}}, read from right to left: ones place, tens place, hundreds place, etc. The digit in the {{place}} place is {{digit}}.',
      },
      circleThe: 'Circle the {{letter}}',
      beginningSounds: 'Beginning Sounds',
      says: 'says',
      circleWordsStart: 'Circle words that start with',
      alphabetAnswerKey: 'Students should correctly identify and match uppercase/lowercase letters, recognize beginning sounds, and circle matching letters. Check for letter recognition accuracy.',
      readingDetective: {
        caseFile: 'Case File',
        detectiveNotes: 'Detective Notes: The scene is the {{setting}}. A witness heard a hum. The main clue is {{clue}}. Who or what is responsible?',
        writeThreeInferences: 'Write three inferences using the clues.',
        explainWhy: 'Explain why the culprit might be {{culprit}}.',
        proveOrDisprove: 'Prove or disprove your theory with text evidence.',
        drawEvidenceBoard: 'Draw your evidence board below and label each clue.',
      },
      storyMap: {
        beginning: 'Beginning',
        beginningPrompt: 'Who are the characters? Where are they?',
        middle: 'Middle',
        middlePrompt: 'What problem appears? What clues help?',
        ending: 'Ending',
        endingPrompt: 'How do they solve it? What is the lesson?',
        clueLog: 'Clue Log',
        lookBackAtStory: 'Look back at the story',
        clue: 'Clue {{number}}',
        retellInOwnWords: 'Retell in Your Own Words',
        retellPrompt: 'Write three sentences that cover beginning, middle, and ending.',
        comprehensionChecks: 'Comprehension Checks',
        whyDidVisit: 'Why did {{hero}} and {{friend}} visit the {{setting}}?',
        whatProblem: 'What problem slowed them down in the middle of the story?',
        howDidHelper: 'How did {{helper}} help them finish their goal? What lesson did they learn?',
      },
      vocab: {
        instructions: 'Use context clues to match each word to its meaning. Then write a sentence using the word in the {{context}} context.',
        word: 'Word',
        matchMeaning: 'Match the meaning',
        sentenceInContext: 'Sentence in context',
      },
      summary: {
        instructions: 'Read the informational paragraph about the {{topic}}. Highlight the most important idea from each section. Then complete the summary box with 3 key points.',
        paragraph: 'Paragraph {{number}}',
        paragraph1Intro: 'Introduces the {{topic}}. Why was it created? Who benefits from it?',
        paragraph2Intro: 'Describes how it works each day. What steps are involved? Who helps?',
        paragraph3Intro: 'Shares one challenge and a plan to improve it next month.',
        summaryBox: 'Summary Box',
        keyPoint: 'Key point {{number}}',
        closingSentence: 'Write one closing sentence that restates the main idea in your own words.',
      },
      compare: {
        instructions: 'Compare and contrast the two texts. Record information about {{topicA}} and {{topicB}}, then write a paragraph explaining how they are alike and different.',
        text1: 'Text 1: {{topic}}',
        text2: 'Text 2: {{topic}}',
        keyDetails: 'Key details:',
        whatProblem: 'What problem does it solve?',
        compareContrastParagraph: 'Compare & Contrast Paragraph',
        alikeBecause: '{{topicA}} and {{topicB}} are alike because',
        differentBecause: 'They are different because',
      },
      writingPrompts: {
        instructions: 'Choose a prompt and write a beginning, middle, and end. Include feelings, actions, and dialogue.',
        prompt: 'Prompt {{number}}',
        brainstorm: 'Brainstorm:',
        beginning: 'Beginning:',
        middle: 'Middle:',
        end: 'End:',
      },
      writingSentences: {
        instructions: 'Complete each sentence with vivid verbs and details. Then rewrite one sentence using a compound structure.',
        compoundSentenceChallenge: 'Compound Sentence Challenge',
        combineWithConjunction: 'Combine two of your sentences with a conjunction:',
      },
      writingPoetry: {
        instructions: 'Create a haiku and a free-verse stanza about a {{theme}}. Use at least three word bank words.',
        wordBank: 'Word Bank',
        haiku: 'Haiku (5-7-5)',
        freeVerseStanza: 'Free-verse Stanza',
        line: 'Line {{number}}',
      },
      writingOpinion: {
        instructions: 'Plan an opinion paragraph about:',
        reasonsAndEvidence: 'Reasons & Evidence',
        reason: 'Reason #{{number}}',
        evidence: 'Evidence',
        paragraphPlanner: 'Paragraph Planner',
        hookSentence: 'Hook sentence:',
        opinionStatement: 'Opinion statement:',
        closingSentence: 'Closing sentence:',
      },
      scienceObservation: {
        instructions: 'Observe and record data about {{focus}}. Include sketches, measurements, and interesting questions.',
        dateAndTime: 'Date & Time',
        observationSketch: 'Observation Sketch',
        whatINoticed: 'What I Noticed',
        questionsNextSteps: 'Questions / Next Steps',
      },
      scienceLifecycle: {
        instructions: 'Label and illustrate the life cycle of a {{cycle}}. Describe what happens at each stage.',
        stage: '{{number}} Stage',
        notes: 'Notes:',
      },
      scienceStates: {
        instructions: 'Identify the change of state for each scenario. Draw the particles before and after the change.',
        scenario: 'Scenario',
        stateChange: 'State Change',
        particleDiagram: 'Particle Diagram',
      },
      scienceWeather: {
        instructions: 'Track the week\'s weather. Record the temperature, sketch the sky, and write one safety tip.',
        day: 'Day',
        temperature: 'Temperature',
        skySketch: 'Sky Sketch',
        safetyTip: 'Safety Tip',
      },
      geographyMap: {
        instructions: 'Plot each location on the grid below. Label and describe what is found at each spot.',
        coordinate: 'Coordinate',
        place: 'Place',
        whatDoYouNotice: 'What do you notice there?',
        exampleMap: 'Example map',
        yourMapGrid: 'Your map grid',
        useSampleToCheck: 'Use this sample to double-check coordinates and landmarks.',
        drawLandmarks: 'Draw landmarks, create a legend, and label each coordinate.',
      },
      geographyCulture: {
        instructions: 'Explore traditions from around the world. Research and note a food, celebration, and interesting fact for each region.',
        region: 'Region',
        food: 'Food',
        celebration: 'Celebration',
        interestingFact: 'Interesting Fact',
      },
      geographyHistory: {
        instructions: 'Build a timeline about {{theme}}. Place the events in order and explain the impact of each.',
        impact: 'Impact:',
      },
      grammarParts: {
        instructions: 'Label each underlined word as a noun, verb, adjective, or adverb. Add one more word to expand the sentence.',
        label: 'Label:',
        extraWord: 'Extra word:',
      },
      grammarTenses: {
        instructions: 'Conjugate each verb in past, present, and future tense. Then use the verb in a sentence.',
        verb: 'Verb',
        past: 'Past',
        present: 'Present',
        future: 'Future',
        writeSentence: 'Write one sentence using each tense below the table.',
      },
      grammarAntonyms: {
        instructions: 'Match each word to its antonym and use the pair in a sentence.',
        word: 'Word',
        antonym: 'Antonym',
        sentence: 'Sentence',
      },
      artDesign: {
        instructions: 'Color each pattern! Use your favorite colors and make it beautiful.',
        colorInsideShape: 'Color inside the shape!',
        patterns: {
          geometricStar: { title: 'Geometric Star', description: 'Color the star pattern with your favorite colors!' },
          flowerPattern: { title: 'Flower Pattern', description: 'Color the flower petals: pink, yellow, and purple' },
          rainbowPattern: { title: 'Rainbow Pattern', description: 'Color each stripe: red, orange, yellow, green, blue, purple' },
          heartDesign: { title: 'Heart Design', description: 'Color the hearts red and pink' },
          circleMandala: { title: 'Circle Mandala', description: 'Color the circles with different colors' },
          leafPattern: { title: 'Leaf Pattern', description: 'Color the leaves green' },
        },
      },
      artColorwheel: {
        instructions: 'Color each item with the correct color. Match the color name to the object.',
        item: 'Item',
        color: 'Color',
        colorIt: 'Color it!',
      },
      artSketch: {
        instructions: 'Draw each picture! Take your time and use your imagination.',
        drawHere: 'Draw here!',
        prompts: {
          beautifulFlower: { prompt: 'Draw a beautiful flower', hint: 'Add petals and a stem!' },
          treeWithLeaves: { prompt: 'Draw a tree with leaves', hint: 'Make it big and green!' },
          geometricShapes: { prompt: 'Draw geometric shapes', hint: 'Draw circles, squares, and triangles!' },
          rainbow: { prompt: 'Draw a rainbow', hint: 'Use all the colors!' },
          pattern: { prompt: 'Draw a pattern', hint: 'Create your own design!' },
          gardenScene: { prompt: 'Draw a garden scene', hint: 'Add flowers and plants!' },
        },
      },
      earlyPhonics: {
        instructions: 'Say the sound, trace the letter, then draw a picture that starts with it.',
        saySound: 'Say the sound:',
        traceLetter: 'Trace the letter:',
        drawPicture: 'Draw a picture:',
        words: 'Words:',
      },
      earlyPatterns: {
        instructions: 'Continue each pattern and create your own using shapes, colors, or stickers.',
        pattern: 'Pattern',
        tryBuilding: 'Try building your own using:',
      },
      earlyShapes: {
        instructions: 'Identify each shape, color it, then sort shapes by type and color.',
        shape: 'Shape',
        color: 'Color:',
        drawMore: 'Draw 2 more {{shape}}s below:',
        sortingActivity: 'Sorting Activity',
        sortByShape: 'Sort by shape:',
        sortByColor: 'Sort by color:',
      },
      earlyLetters: {
        instructions: 'Trace each letter, then write it 3 times. Draw a picture that starts with that letter.',
        trace: 'Trace',
        write: 'Write',
        draw: 'Draw',
      },
      earlyNumbers: {
        trace: 'Trace',
        write: 'Write',
        draw: 'Draw',
        numberWord: 'Number word:',
      },
      logicPrek: {
        instructions: 'Complete simple patterns and sort objects by color, size, or type.',
        pattern: 'Pattern',
      },
      selPrek: {
        instructions: 'Identify and express feelings through pictures, simple words, and activities.',
        feeling: 'Feeling:',
        color: 'Color:',
        drawTimeFelt: 'Draw a time you felt {{feeling}}',
        howIFeelToday: 'How I Feel Today',
        feelings: {
          happy: 'happy',
          sad: 'sad',
          angry: 'angry',
          excited: 'excited',
        },
      },
      mathRhythm: {
        instructions: 'Continue each skip-counting rhythm. Write the missing numbers in the blanks.',
      },
      logicRiddles: {
        instructions: 'Solve each brain teaser. Write your guess, then reveal the answer.',
        answer: 'Answer:',
      },
      logicDeduction: {
        instructions: 'Use the clues to determine who borrowed each item and where it was found.',
      },
      cognitiveMemory: {
        instructions: 'Try to remember all three sequences in order. Write them here:',
      },
      cognitiveAttention: {
        instructions: 'Practice focusing your attention with visual scanning and spot-the-difference exercises.',
        findAndCircle: 'Find and circle all the <span className="font-bold">{{items}}</span> shapes in the grid below:',
        countHowMany: 'Count how many {{items}} shapes you found: _______',
        compareImages: 'Compare the two images and find the differences:',
      },
      cognitiveExecutive: {
        instructions: 'Practice planning, organizing, and completing tasks. This builds executive function skills!',
        taskPlanning: 'Task Planning',
        planTasksToday: 'Plan your tasks for today. Break each task into steps:',
      },
      cognitiveVisual: {
        visualPatternMatching: 'Visual Pattern Matching',
        comparePatterns: 'Compare the two patterns. Circle what\'s different:',
        match: 'Match:',
        drawItemPosition: 'Draw each item in the correct position:',
        drawItemText: 'Draw a {{item}} {{text}} the line:',
        pattern: 'Pattern {{number}}:',
        original: 'Original:',
        whatsDifferent: 'What\'s different? Position: _______ Item: _______',
        spatialReasoning: 'Spatial Reasoning',
        above: 'above',
        below: 'below',
        toTheLeftOf: 'to the left of',
        toTheRightOf: 'to the right of',
      },
      cognitiveFlexibility: {
        instructions: 'Complete each task, then switch to the new rule:',
        perspectiveTakingPractice: 'Perspective-Taking Practice',
        thinkAboutSituation: 'Think about each situation from different points of view:',
      },
      cognitiveProcessing: {
        instructions: 'Circle all the ★ (stars) as quickly as you can:',
      },
      selConflict: {
        instructions: 'Learn strategies to resolve conflicts peacefully. Think about how to communicate effectively.',
      },
      selRegulation: {
        instructions: 'Practice self-regulation strategies. These techniques help you manage big feelings and make thoughtful choices.',
      },
      selKindness: {
        instructions: 'Complete acts of kindness this week! Track your kindness and reflect on how it makes you and others feel.',
      },
      selGrowthMindset: {
        instructions: 'Transform fixed mindset thoughts into growth mindset thoughts! Learn to embrace challenges and learn from mistakes.',
      },
      selStress: {
        instructions: 'Identify stress triggers and practice healthy coping strategies. Learn to manage anxiety and stress effectively.',
      },
      selCharacter: {
        instructions: 'Explore important character traits and values. Think about how these traits help you and others.',
        traits: {
          honesty: { name: 'Honesty', description: 'Telling the truth even when it\'s hard' },
          respect: { name: 'Respect', description: 'Treating others with kindness and consideration' },
          responsibility: { name: 'Responsibility', description: 'Doing what you\'re supposed to do' },
          integrity: { name: 'Integrity', description: 'Doing the right thing even when no one is watching' },
          courage: { name: 'Courage', description: 'Facing fears and standing up for what\'s right' },
          compassion: { name: 'Compassion', description: 'Caring about others and their feelings' },
        },
      },
      mathShapes: {
        instructions: 'Draw and tally each shape. Then classify it as "flat" or "solid" and record the number of sides.',
        shape: 'Shape',
        color: 'Color',
        howMany: 'How many?',
        flatOrSolid: 'Flat or Solid?',
        numberOfSides: 'Number of sides',
      },
      mathMoney: {
        instructions: 'Use coins to count up to the total. Draw the coins you would use and record the value.',
        costs: 'The {{item}} costs ${{amount}}. Pay using {{coin}}. Draw your coins below and write the total.',
        total: 'Total:',
        change: 'Change:',
      },
      mathFractions: {
        instructions: 'Compare each pair of fractions. Shade the bar models to help you decide, then write <, >, or =.',
        shade: 'Shade {{num}} of {{den}} equal parts.',
      },
      mathMeasurement: {
        instructions: 'Convert each measurement. Show your work in the space provided.',
        given: 'Given',
        convertTo: 'Convert to',
        workSpace: 'Work space',
      },
      readingAdventure: {
        story: '{{hero}} and {{partner}} arrive at the {{setting}}. They must {{quest}} before the moon sets. Along the way they meet a guide who speaks only in rhymes. What clues do they gather? How do they work together?',
        comprehensionChecks: 'Comprehension Checks',
        whatProblem: 'What problem do {{hero}} and {{partner}} need to solve?',
        describeClue: 'Describe one clue from the rhyme-speaking guide.',
        howSetting: 'How does the setting help or challenge the characters?',
        creativeExtension: 'Creative Extension',
        sketchScene: 'Sketch one scene from the adventure and label the important details.',
      },
      earlyFoundations: {
        instructions: 'Review basic skills: identify letters, numbers, and shapes. Perfect for remediation or review.',
        review: 'Review:',
        identify: 'Identify:',
        practiceWriting: 'Practice Writing',
        writeName: 'Write your name:',
        countTo10: 'Count to 10:',
      },
      earlyBasics: {
        instructions: 'Essential early learning skills review. Practice letter sounds, counting, and basic patterns.',
      },
      readingPrek: {
        instructions: 'Look at the pictures and answer yes/no questions about the story.',
        yesNo: 'Yes / No',
        storyTitles: {
          redCar: 'The Red Car',
          sunnyDay: 'The Sunny Day',
          bigTree: 'The Big Tree',
        },
        questions: {
          seeCar: 'Do you see a car?',
          carOnRoad: 'Is the car on the road?',
          seeSun: 'Do you see the sun?',
          thereFlower: 'Is there a flower?',
          treeBig: 'Is the tree big?',
          seeHouse: 'Do you see a house?',
        },
        objectNames: {
          sun: 'Sun',
          flower: 'Flower',
          ball: 'Ball',
          tree: 'Tree',
          house: 'House',
          car: 'Car',
          road: 'Road',
        },
      },
      writingPrek: {
        instructions: 'Draw a picture and label it with the word. Perfect for early writers.',
        word: 'Word:',
        label: 'Label:',
        drawPrompts: {
          cat: 'Draw a cat',
          dog: 'Draw a dog',
          sun: 'Draw the sun',
          car: 'Draw a car',
          tree: 'Draw a tree',
          flower: 'Draw a flower',
        },
      },
      readingSightwords: {
        instructions: 'Practice reading and writing common sight words with fun activities.',
        writeIt3Times: 'Write it 3 times:',
        useInSentences: 'Use sight words in sentences:',
        writeSentenceWith: 'Write a sentence with "{{word}}":',
        words: ['the', 'and', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said'],
      },
      writingTrace: {
        practiceTracing: 'Practice tracing lowercase letters neatly. Follow the dotted lines, then write each letter 3 times on your own.',
        letter: 'Letter:',
        traceTheLetter: 'Trace the letter:',
        traceHere: 'Trace here',
        write3Times: 'Write 3 times:',
        practiceAllLetters: 'Practice All Letters',
        writeEntireAlphabet: 'Write the entire lowercase alphabet:',
        drawPicture: 'Draw the picture',
        writeSentence: 'Write a sentence:',
      },
      writingLowercase: {
        practiceTracing: 'Practice tracing lowercase letters neatly. Follow the dotted lines, then write each letter 3 times on your own.',
        letter: 'Letter:',
        traceTheLetter: 'Trace the letter:',
        traceHere: 'Trace here',
        write3Times: 'Write 3 times:',
        practiceAllLetters: 'Practice All Letters',
        writeEntireAlphabet: 'Write the entire lowercase alphabet:',
      },
      writingNarrative: {
        instructions: 'Write a short story with a beginning, middle, and end. Use the story planning template below.',
      },
      writingInformative: {
        instructions: 'Write an informative paragraph about the topic below. Include facts, details, and explanations.',
      },
      writingPictures: {
        instructions: 'Look at each picture prompt and write simple sentences or a short story about what you see.',
        drawPicture: 'Draw the picture',
        writeSentence: 'Write a sentence:',
      },
      writingNarrative: {
        instructions: 'Write a short story with a beginning, middle, and end. Use the story planning template below.',
        storyStarters: 'Story Starters (choose one):',
      },
      writingInformative: {
        instructions: 'Write an informative paragraph about the topic below. Include facts, details, and explanations.',
        topic: 'Topic:',
      },
      writingEssay: {
        writeStructuredEssay: 'Write a structured essay responding to the prompt below.',
        prompt: 'Prompt:',
      },
      readingResearch: {
        researchTopic: 'Research Topic:',
      },
      readingVocab: {
        topic: 'Topic:',
      },
      writingPrompts: {
        prompt: 'Prompt:',
      },
      cognitiveProcessing: {
        quickSymbolRecognition: 'Quick Symbol Recognition',
        circleAllStars: 'Circle all the ★ (stars) as quickly as you can:',
      },
      cognitiveFlexibility: {
        taskSwitchingChallenge: 'Task Switching Challenge',
        completeEachTask: 'Complete each task, then switch to the new rule:',
      },
      algebra: {
        solveEachEquation: 'Solve each equation, evaluate each expression, or simplify as indicated.',
        solve: 'Solve:',
      },
      wordProblems: {
        solveEachMultiStep: 'Solve each multi-step word problem. Show your work.',
      },
      readingLiterary: {
        readAndAnalyze: 'Read the passage and analyze the literary elements below. Provide evidence from the text.',
      },
      writingEssay: {
        writeStructuredEssay: 'Write a structured essay responding to the prompt below.',
      },
      grammarAdvanced: {
        identifyClauses: 'Identify clauses, phrases, and advanced sentence structures in each sentence.',
      },
      grammarRhyming: {
        instructions: 'Identify and match rhyming words through fun activities.',
        word: 'Word:',
        rhymingWords: 'Rhyming words:',
        writeAnotherWord: 'Write another word that rhymes: ________',
      },
      grammarPrek: {
        instructions: 'Match simple words with pictures and identify basic word types.',
        word: 'Word:',
        match: 'Match:',
        wordPractice: 'Word Practice',
        circleWordMatches: 'Circle the word that matches the picture:',
      },
      answerKey: {
        acceptYesNo: 'Accept yes/no answers based on picture clues. Students should look at the pictures to answer.',
        studentsShould: 'Students should',
        drawPicture: 'draw a picture',
        lookAtPictures: 'look at the pictures to answer',
        sightWordsAnswer: 'correctly write sight words 3 times each and use them in sentences. Check for spelling accuracy and appropriate sentence construction.',
        grammarRhymingAnswer: 'Students should correctly identify and match rhyming words. Check for understanding of word families and phonemic awareness.',
        visualProcessingAnswer: 'identify differences in patterns and demonstrate spatial reasoning by drawing items in correct positions.',
        visualProcessingNote: 'Note: Pattern differences are: Pattern 1 - position 4 (green vs blue), Pattern 2 - position 3 (triangle vs circle), Pattern 3 - position 4 (big vs small). Spatial reasoning drawings should show items in correct relative positions.',
        note: 'Note:',
        answer: 'Answer:',
        task: 'Task {{number}}:',
        problem: 'Problem {{number}}',
        pattern: 'Pattern {{number}}:',
        answersWillVary: 'Answers will vary.',
      },
      sciencePrek: {
        instructions: 'Simple nature observation activities with pictures and basic questions.',
        drawOrPaste: 'Draw or paste a picture',
        topics: {
          plants: 'Plants',
          animals: 'Animals',
          weather: 'Weather',
          seasons: 'Seasons',
        },
        questions: {
          whatPlantsNeed: 'What do plants need?',
          whereAnimalsLive: 'Where do animals live?',
          whatWeatherLike: 'What is the weather like?',
          whatSeason: 'What season is it?',
        },
      },
      scienceSpace: {
        instructions: 'Learn about planets, stars, and space phenomena with interactive activities.',
        fact: 'Fact:',
        distanceFromSun: 'Distance from sun:',
        spaceQuestions: 'Space Questions',
        whatIsStar: 'What is a star?',
        nameOnePlanet: 'Name one planet:',
      },
      geographyPrek: {
        instructions: 'Learn about places in the community, home, and school with simple maps and pictures.',
        drawSimpleMap: 'Draw a simple map',
        placeTypes: {
          whereILive: 'Where I live',
          whereILearn: 'Where I learn',
          whereIPlay: 'Where I play',
        },
      },
    },
    es: {
      countObjectsAndWriteNumber: 'Cuenta los objetos y escribe el número.',
      countThe: 'Cuenta {{object}}',
      numberLabel: 'Número',
      objectNames: {
        stars: 'estrellas',
        hearts: 'corazones',
        circles: 'círculos',
        apples: 'manzanas',
        balls: 'pelotas',
        flowers: 'flores',
        butterflies: 'mariposas',
        fish: 'peces',
      },
      mathPuzzle: {
        instructions: 'Completa los números faltantes para completar cada ecuación. Muestra una estrategia diferente (recta numérica, dibujo, marco de diez) para al menos dos rompecabezas.',
        answerLabel: 'Respuesta del rompecabezas {{number}}',
      },
      mathRace: {
        instructions: 'Configura un temporizador de 60 segundos. Resuelve tantos hechos como puedas, luego marca tu récord personal.',
      },
      reflection: {
        title: 'Reflexión',
        mathRaceQuestions: '¿Cuántos hechos resolviste? ______ • ¿Qué estrategia te ayudó más? ____________________',
        generalQuestions: '¿Qué te ayudó a completar tus tareas? ¿Qué harías diferente la próxima vez?',
        mandalaQuestion: 'Reflexión: ¿Cómo te hizo sentir crear este mandala?',
      },
      answerKeyAndNotes: 'Clave de respuestas y notas del maestro',
      countingTeachingNote: 'Nota para enseñar: Los estudiantes deben contar cada objeto uno por uno. Anima a señalar o tocar cada objeto mientras cuentan para desarrollar la correspondencia uno a uno.',
      placeValue: {
        instructions: 'Identifica el dígito en cada valor posicional.',
        placeValueChart: 'Tabla de Valor Posicional:',
        whatDigit: '¿Qué dígito está en el lugar {{place}}?',
        expandedForm: 'Forma expandida:',
        ones: 'Unidades',
        tens: 'Decenas',
        hundreds: 'Centenas',
        thousands: 'Millares',
        explanation: 'En el número {{number}}, lee de derecha a izquierda: lugar de unidades, lugar de decenas, lugar de centenas, etc. El dígito en el lugar {{place}} es {{digit}}.',
      },
      circleThe: 'Encierra en un círculo la {{letter}}',
      beginningSounds: 'Sonidos Iniciales',
      says: 'dice',
      circleWordsStart: 'Encierra en un círculo las palabras que comienzan con',
      alphabetAnswerKey: 'Los estudiantes deben identificar y emparejar correctamente las letras mayúsculas/minúsculas, reconocer sonidos iniciales y encerrar en un círculo las letras coincidentes. Verifica la precisión del reconocimiento de letras.',
      readingDetective: {
        caseFile: 'Archivo del Caso',
        detectiveNotes: 'Notas del Detective: La escena es {{setting}}. Un testigo escuchó un zumbido. La pista principal es {{clue}}. ¿Quién o qué es responsable?',
        writeThreeInferences: 'Escribe tres inferencias usando las pistas.',
        explainWhy: 'Explica por qué el culpable podría ser {{culprit}}.',
        proveOrDisprove: 'Prueba o refuta tu teoría con evidencia del texto.',
        drawEvidenceBoard: 'Dibuja tu tablero de evidencia a continuación y etiqueta cada pista.',
      },
      storyMap: {
        beginning: 'Inicio',
        beginningPrompt: '¿Quiénes son los personajes? ¿Dónde están?',
        middle: 'Medio',
        middlePrompt: '¿Qué problema aparece? ¿Qué pistas ayudan?',
        ending: 'Final',
        endingPrompt: '¿Cómo lo resuelven? ¿Cuál es la lección?',
        clueLog: 'Registro de Pistas',
        lookBackAtStory: 'Vuelve a leer la historia',
        clue: 'Pista {{number}}',
        retellInOwnWords: 'Cuenta con Tus Propias Palabras',
        retellPrompt: 'Escribe tres oraciones que cubran el inicio, medio y final.',
        comprehensionChecks: 'Verificaciones de Comprensión',
        whyDidVisit: '¿Por qué {{hero}} y {{friend}} visitaron el {{setting}}?',
        whatProblem: '¿Qué problema los retrasó en el medio de la historia?',
        howDidHelper: '¿Cómo {{helper}} los ayudó a terminar su objetivo? ¿Qué lección aprendieron?',
      },
      vocab: {
        instructions: 'Usa pistas de contexto para hacer coincidir cada palabra con su significado. Luego escribe una oración usando la palabra en el contexto {{context}}.',
        word: 'Palabra',
        matchMeaning: 'Haz coincidir el significado',
        sentenceInContext: 'Oración en contexto',
      },
      summary: {
        instructions: 'Lee el párrafo informativo sobre {{topic}}. Resalta la idea más importante de cada sección. Luego completa el cuadro de resumen con 3 puntos clave.',
        paragraph: 'Párrafo {{number}}',
        paragraph1Intro: 'Presenta el {{topic}}. ¿Por qué se creó? ¿Quién se beneficia?',
        paragraph2Intro: 'Describe cómo funciona cada día. ¿Qué pasos están involucrados? ¿Quién ayuda?',
        paragraph3Intro: 'Comparte un desafío y un plan para mejorarlo el próximo mes.',
        summaryBox: 'Cuadro de Resumen',
        keyPoint: 'Punto clave {{number}}',
        closingSentence: 'Escribe una oración de cierre que reafirme la idea principal con tus propias palabras.',
      },
      compare: {
        instructions: 'Compara y contrasta los dos textos. Registra información sobre {{topicA}} y {{topicB}}, luego escribe un párrafo explicando cómo son similares y diferentes.',
        text1: 'Texto 1: {{topic}}',
        text2: 'Texto 2: {{topic}}',
        keyDetails: 'Detalles clave:',
        whatProblem: '¿Qué problema resuelve?',
        compareContrastParagraph: 'Párrafo de Comparación y Contraste',
        alikeBecause: '{{topicA}} y {{topicB}} son similares porque',
        differentBecause: 'Son diferentes porque',
      },
      writingPrompts: {
        instructions: 'Elige un indicador y escribe un inicio, medio y final. Incluye sentimientos, acciones y diálogo.',
        prompt: 'Indicador {{number}}',
        brainstorm: 'Lluvia de ideas:',
        beginning: 'Inicio:',
        middle: 'Medio:',
        end: 'Final:',
      },
      writingSentences: {
        instructions: 'Completa cada oración con verbos vívidos y detalles. Luego reescribe una oración usando una estructura compuesta.',
        compoundSentenceChallenge: 'Desafío de Oración Compuesta',
        combineWithConjunction: 'Combina dos de tus oraciones con una conjunción:',
      },
      writingPoetry: {
        instructions: 'Crea un haiku y una estrofa de verso libre sobre {{theme}}. Usa al menos tres palabras del banco de palabras.',
        wordBank: 'Banco de Palabras',
        haiku: 'Haiku (5-7-5)',
        freeVerseStanza: 'Estrofa de Verso Libre',
        line: 'Línea {{number}}',
      },
      writingOpinion: {
        instructions: 'Planifica un párrafo de opinión sobre:',
        reasonsAndEvidence: 'Razones y Evidencia',
        reason: 'Razón #{{number}}',
        evidence: 'Evidencia',
        paragraphPlanner: 'Planificador de Párrafos',
        hookSentence: 'Oración gancho:',
        opinionStatement: 'Declaración de opinión:',
        closingSentence: 'Oración de cierre:',
      },
      scienceObservation: {
        instructions: 'Observa y registra datos sobre {{focus}}. Incluye bocetos, mediciones y preguntas interesantes.',
        dateAndTime: 'Fecha y Hora',
        observationSketch: 'Boceto de Observación',
        whatINoticed: 'Lo que Noté',
        questionsNextSteps: 'Preguntas / Próximos Pasos',
      },
      scienceLifecycle: {
        instructions: 'Etiqueta e ilustra el ciclo de vida de {{cycle}}. Describe lo que sucede en cada etapa.',
        stage: 'Etapa {{number}}',
        notes: 'Notas:',
      },
      scienceStates: {
        instructions: 'Identifica el cambio de estado para cada escenario. Dibuja las partículas antes y después del cambio.',
        scenario: 'Escenario',
        stateChange: 'Cambio de Estado',
        particleDiagram: 'Diagrama de Partículas',
      },
      scienceWeather: {
        instructions: 'Rastrea el clima de la semana. Registra la temperatura, dibuja el cielo y escribe un consejo de seguridad.',
        day: 'Día',
        temperature: 'Temperatura',
        skySketch: 'Boceto del Cielo',
        safetyTip: 'Consejo de Seguridad',
      },
      geographyMap: {
        instructions: 'Traza cada ubicación en la cuadrícula a continuación. Etiqueta y describe lo que se encuentra en cada lugar.',
        coordinate: 'Coordenada',
        place: 'Lugar',
        whatDoYouNotice: '¿Qué notas allí?',
        exampleMap: 'Mapa de ejemplo',
        yourMapGrid: 'Tu cuadrícula de mapa',
        useSampleToCheck: 'Usa esta muestra para verificar las coordenadas y los puntos de referencia.',
        drawLandmarks: 'Dibuja puntos de referencia, crea una leyenda y etiqueta cada coordenada.',
      },
      geographyCulture: {
        instructions: 'Explora tradiciones de todo el mundo. Investiga y anota una comida, celebración y dato interesante para cada región.',
        region: 'Región',
        food: 'Comida',
        celebration: 'Celebración',
        interestingFact: 'Dato Interesante',
      },
      geographyHistory: {
        instructions: 'Construye una línea de tiempo sobre {{theme}}. Coloca los eventos en orden y explica el impacto de cada uno.',
        impact: 'Impacto:',
      },
      grammarParts: {
        instructions: 'Etiqueta cada palabra subrayada como sustantivo, verbo, adjetivo o adverbio. Agrega una palabra más para expandir la oración.',
        label: 'Etiqueta:',
        extraWord: 'Palabra extra:',
      },
      grammarTenses: {
        instructions: 'Conjuga cada verbo en tiempo pasado, presente y futuro. Luego usa el verbo en una oración.',
        verb: 'Verbo',
        past: 'Pasado',
        present: 'Presente',
        future: 'Futuro',
        writeSentence: 'Escribe una oración usando cada tiempo debajo de la tabla.',
      },
      grammarAntonyms: {
        instructions: 'Haz coincidir cada palabra con su antónimo y usa el par en una oración.',
        word: 'Palabra',
        antonym: 'Antónimo',
        sentence: 'Oración',
      },
      artDesign: {
        instructions: '¡Colorea cada patrón! Usa tus colores favoritos y hazlo hermoso.',
        colorInsideShape: '¡Colorea dentro de la forma!',
        patterns: {
          geometricStar: { title: 'Estrella Geométrica', description: '¡Colorea el patrón de estrella con tus colores favoritos!' },
          flowerPattern: { title: 'Patrón de Flor', description: 'Colorea los pétalos de la flor: rosa, amarillo y morado' },
          rainbowPattern: { title: 'Patrón de Arcoíris', description: 'Colorea cada franja: rojo, naranja, amarillo, verde, azul, morado' },
          heartDesign: { title: 'Diseño de Corazón', description: 'Colorea los corazones de rojo y rosa' },
          circleMandala: { title: 'Mandala Circular', description: 'Colorea los círculos con diferentes colores' },
          leafPattern: { title: 'Patrón de Hoja', description: 'Colorea las hojas de verde' },
        },
      },
      artColorwheel: {
        instructions: 'Colorea cada elemento con el color correcto. Haz coincidir el nombre del color con el objeto.',
        item: 'Elemento',
        color: 'Color',
        colorIt: '¡Colorealo!',
      },
      artSketch: {
        instructions: '¡Dibuja cada imagen! Tómate tu tiempo y usa tu imaginación.',
        drawHere: '¡Dibuja aquí!',
        prompts: {
          beautifulFlower: { prompt: 'Dibuja una flor hermosa', hint: '¡Agrega pétalos y un tallo!' },
          treeWithLeaves: { prompt: 'Dibuja un árbol con hojas', hint: '¡Hazlo grande y verde!' },
          geometricShapes: { prompt: 'Dibuja formas geométricas', hint: '¡Dibuja círculos, cuadrados y triángulos!' },
          rainbow: { prompt: 'Dibuja un arcoíris', hint: '¡Usa todos los colores!' },
          pattern: { prompt: 'Dibuja un patrón', hint: '¡Crea tu propio diseño!' },
          gardenScene: { prompt: 'Dibuja una escena de jardín', hint: '¡Agrega flores y plantas!' },
        },
      },
      earlyPhonics: {
        instructions: 'Di el sonido, traza la letra y luego dibuja una imagen que comience con ella.',
        saySound: 'Di el sonido:',
        traceLetter: 'Traza la letra:',
        drawPicture: 'Dibuja una imagen:',
        words: 'Palabras:',
      },
      earlyPatterns: {
        instructions: 'Continúa cada patrón y crea el tuyo usando formas, colores o pegatinas.',
        pattern: 'Patrón',
        tryBuilding: 'Intenta construir el tuyo usando:',
      },
      earlyShapes: {
        instructions: 'Identifica cada forma, coloreala y luego clasifica las formas por tipo y color.',
        shape: 'Forma',
        color: 'Color:',
        drawMore: 'Dibuja 2 más {{shape}}s abajo:',
        sortingActivity: 'Actividad de Clasificación',
        sortByShape: 'Clasificar por forma:',
        sortByColor: 'Clasificar por color:',
      },
      earlyLetters: {
        instructions: 'Traza cada letra, luego escríbela 3 veces. Dibuja una imagen que comience con esa letra.',
        trace: 'Traza',
        write: 'Escribe',
        draw: 'Dibuja',
      },
      earlyNumbers: {
        trace: 'Traza',
        write: 'Escribe',
        draw: 'Dibuja',
        numberWord: 'Palabra del número:',
      },
      logicPrek: {
        instructions: 'Completa patrones simples y clasifica objetos por color, tamaño o tipo.',
        pattern: 'Patrón',
      },
      selPrek: {
        instructions: 'Identifica y expresa sentimientos a través de imágenes, palabras simples y actividades.',
        feeling: 'Sentimiento:',
        color: 'Color:',
        drawTimeFelt: 'Dibuja un momento en que te sentiste {{feeling}}',
        howIFeelToday: 'Cómo Me Siento Hoy',
        feelings: {
          happy: 'feliz',
          sad: 'triste',
          angry: 'enojado',
          excited: 'emocionado',
        },
      },
      mathRhythm: {
        instructions: 'Continúa cada ritmo de conteo saltado. Escribe los números faltantes en los espacios en blanco.',
      },
      logicRiddles: {
        instructions: 'Resuelve cada acertijo. Escribe tu suposición, luego revela la respuesta.',
        answer: 'Respuesta:',
      },
      logicDeduction: {
        instructions: 'Usa las pistas para determinar quién tomó prestado cada artículo y dónde se encontró.',
      },
      cognitiveMemory: {
        instructions: 'Intenta recordar las tres secuencias en orden. Escríbelas aquí:',
      },
      cognitiveAttention: {
        instructions: 'Practica enfocar tu atención con ejercicios de escaneo visual y busca las diferencias.',
        findAndCircle: 'Encuentra y encierra en un círculo todas las formas <span className="font-bold">{{items}}</span> en la cuadrícula a continuación:',
        countHowMany: 'Cuenta cuántas formas {{items}} encontraste: _______',
        compareImages: 'Compara las dos imágenes y encuentra las diferencias:',
      },
      cognitiveExecutive: {
        instructions: 'Practica planificar, organizar y completar tareas. ¡Esto desarrolla habilidades de función ejecutiva!',
        taskPlanning: 'Planificación de Tareas',
        planTasksToday: 'Planifica tus tareas para hoy. Divide cada tarea en pasos:',
      },
      cognitiveVisual: {
        visualPatternMatching: 'Coincidencia de Patrones Visuales',
        comparePatterns: 'Compara los dos patrones. Encierra en un círculo lo que es diferente:',
        match: 'Emparejar:',
        drawItemPosition: 'Dibuja cada elemento en la posición correcta:',
        drawItemText: 'Dibuja un {{item}} {{text}} la línea:',
        pattern: 'Patrón {{number}}:',
        original: 'Original:',
        whatsDifferent: '¿Qué es diferente? Posición: _______ Elemento: _______',
        spatialReasoning: 'Razonamiento Espacial',
        above: 'arriba',
        below: 'abajo',
        toTheLeftOf: 'a la izquierda de',
        toTheRightOf: 'a la derecha de',
      },
      cognitiveFlexibility: {
        instructions: 'Completa cada tarea, luego cambia a la nueva regla:',
        perspectiveTakingPractice: 'Práctica de Toma de Perspectiva',
        thinkAboutSituation: 'Piensa en cada situación desde diferentes puntos de vista:',
      },
      cognitiveProcessing: {
        instructions: 'Encierra en un círculo todas las ★ (estrellas) lo más rápido que puedas:',
      },
      selConflict: {
        instructions: 'Aprende estrategias para resolver conflictos pacíficamente. Piensa en cómo comunicarte efectivamente.',
      },
      selRegulation: {
        instructions: 'Practica estrategias de autorregulación. Estas técnicas te ayudan a manejar grandes sentimientos y tomar decisiones reflexivas.',
      },
      selKindness: {
        instructions: '¡Completa actos de bondad esta semana! Rastrea tu bondad y reflexiona sobre cómo te hace sentir a ti y a otros.',
      },
      selGrowthMindset: {
        instructions: '¡Transforma los pensamientos de mentalidad fija en pensamientos de mentalidad de crecimiento! Aprende a abrazar desafíos y aprender de errores.',
      },
      selStress: {
        instructions: 'Identifica desencadenantes del estrés y practica estrategias saludables de afrontamiento. Aprende a manejar la ansiedad y el estrés efectivamente.',
      },
      selCharacter: {
        instructions: 'Explora rasgos de carácter y valores importantes. Piensa en cómo estos rasgos te ayudan a ti y a otros.',
        traits: {
          honesty: { name: 'Honestidad', description: 'Decir la verdad incluso cuando es difícil' },
          respect: { name: 'Respeto', description: 'Tratar a otros con amabilidad y consideración' },
          responsibility: { name: 'Responsabilidad', description: 'Hacer lo que se supone que debes hacer' },
          integrity: { name: 'Integridad', description: 'Hacer lo correcto incluso cuando nadie está mirando' },
          courage: { name: 'Valentía', description: 'Enfrentar miedos y defender lo que es correcto' },
          compassion: { name: 'Compasión', description: 'Preocuparse por otros y sus sentimientos' },
        },
      },
      mathShapes: {
        instructions: 'Dibuja y cuenta cada forma. Luego clasifícala como "plana" o "sólida" y registra el número de lados.',
        shape: 'Forma',
        color: 'Color',
        howMany: '¿Cuántos?',
        flatOrSolid: '¿Plana o Sólida?',
        numberOfSides: 'Número de lados',
      },
      mathMoney: {
        instructions: 'Usa monedas para contar hasta el total. Dibuja las monedas que usarías y registra el valor.',
        costs: 'El {{item}} cuesta ${{amount}}. Paga usando {{coin}}. Dibuja tus monedas abajo y escribe el total.',
        total: 'Total:',
        change: 'Cambio:',
      },
      mathFractions: {
        instructions: 'Compara cada par de fracciones. Sombrea los modelos de barras para ayudarte a decidir, luego escribe <, >, o =.',
        shade: 'Sombrea {{num}} de {{den}} partes iguales.',
      },
      mathMeasurement: {
        instructions: 'Convierte cada medida. Muestra tu trabajo en el espacio proporcionado.',
        given: 'Dado',
        convertTo: 'Convertir a',
        workSpace: 'Espacio de trabajo',
      },
      readingAdventure: {
        story: '{{hero}} y {{partner}} llegan al {{setting}}. Deben {{quest}} antes de que se ponga la luna. En el camino conocen a un guía que solo habla en rimas. ¿Qué pistas reúnen? ¿Cómo trabajan juntos?',
        comprehensionChecks: 'Verificaciones de Comprensión',
        whatProblem: '¿Qué problema necesitan resolver {{hero}} y {{partner}}?',
        describeClue: 'Describe una pista del guía que habla en rimas.',
        howSetting: '¿Cómo el escenario ayuda o desafía a los personajes?',
        creativeExtension: 'Extensión Creativa',
        sketchScene: 'Dibuja una escena de la aventura y etiqueta los detalles importantes.',
      },
      earlyFoundations: {
        instructions: 'Revisa habilidades básicas: identifica letras, números y formas. Perfecto para remediación o revisión.',
        review: 'Revisar:',
        identify: 'Identificar:',
        practiceWriting: 'Practicar Escritura',
        writeName: 'Escribe tu nombre:',
        countTo10: 'Cuenta hasta 10:',
      },
      earlyBasics: {
        instructions: 'Revisión de habilidades esenciales de aprendizaje temprano. Practica sonidos de letras, conteo y patrones básicos.',
      },
      readingPrek: {
        instructions: 'Mira las imágenes y responde preguntas de sí/no sobre la historia.',
        yesNo: 'Sí / No',
        storyTitles: {
          redCar: 'El Auto Rojo',
          sunnyDay: 'El Día Soleado',
          bigTree: 'El Árbol Grande',
        },
        questions: {
          seeCar: '¿Ves un auto?',
          carOnRoad: '¿Está el auto en la carretera?',
          seeSun: '¿Ves el sol?',
          thereFlower: '¿Hay una flor?',
          treeBig: '¿Es grande el árbol?',
          seeHouse: '¿Ves una casa?',
        },
        objectNames: {
          sun: 'Sol',
          flower: 'Flor',
          ball: 'Pelota',
          tree: 'Árbol',
          house: 'Casa',
          car: 'Auto',
          road: 'Carretera',
        },
      },
      writingPrek: {
        instructions: 'Dibuja una imagen y etiquétala con la palabra. Perfecto para escritores principiantes.',
        word: 'Palabra:',
        label: 'Etiqueta:',
        drawPrompts: {
          cat: 'Dibuja un gato',
          dog: 'Dibuja un perro',
          sun: 'Dibuja el sol',
          car: 'Dibuja un auto',
          tree: 'Dibuja un árbol',
          flower: 'Dibuja una flor',
        },
      },
      readingSightwords: {
        instructions: 'Practica leyendo y escribiendo palabras comunes de vista con actividades divertidas.',
        writeIt3Times: 'Escríbelo 3 veces:',
        useInSentences: 'Usa palabras de vista en oraciones:',
        writeSentenceWith: 'Escribe una oración con "{{word}}":',
        words: ['el', 'la', 'y', 'es', 'un', 'una', 'en', 'de', 'que', 'con', 'por', 'para', 'son', 'las', 'los', 'del', 'se', 'le', 'te', 'me', 'nos', 'les', 'tiene', 'tiene', 'hacer', 'estar', 'ser', 'tener', 'poder', 'decir', 'ir', 'ver', 'dar', 'saber', 'querer'],
      },
      writingTrace: {
        practiceTracing: 'Practica trazar letras minúsculas con cuidado. Sigue las líneas punteadas, luego escribe cada letra 3 veces por tu cuenta.',
        letter: 'Letra:',
        traceTheLetter: 'Traza la letra:',
        traceHere: 'Traza aquí',
        write3Times: 'Escribe 3 veces:',
        practiceAllLetters: 'Practica Todas las Letras',
        writeEntireAlphabet: 'Escribe todo el alfabeto en minúsculas:',
        drawPicture: 'Dibuja la imagen',
        writeSentence: 'Escribe una oración:',
      },
      writingLowercase: {
        practiceTracing: 'Practica trazar letras minúsculas con cuidado. Sigue las líneas punteadas, luego escribe cada letra 3 veces por tu cuenta.',
        letter: 'Letra:',
        traceTheLetter: 'Traza la letra:',
        traceHere: 'Traza aquí',
        write3Times: 'Escribe 3 veces:',
        practiceAllLetters: 'Practica Todas las Letras',
        writeEntireAlphabet: 'Escribe todo el alfabeto en minúsculas:',
      },
      writingNarrative: {
        instructions: 'Escribe una historia corta con un inicio, medio y final. Usa la plantilla de planificación de historia a continuación.',
      },
      writingInformative: {
        instructions: 'Escribe un párrafo informativo sobre el tema a continuación. Incluye hechos, detalles y explicaciones.',
      },
      writingPictures: {
        instructions: 'Mira cada indicador de imagen y escribe oraciones simples o una historia corta sobre lo que ves.',
        drawPicture: 'Dibuja la imagen',
        writeSentence: 'Escribe una oración:',
      },
      writingNarrative: {
        instructions: 'Escribe una historia corta con un inicio, medio y final. Usa la plantilla de planificación de historia a continuación.',
        storyStarters: 'Inicios de Historia (elige uno):',
      },
      writingInformative: {
        instructions: 'Escribe un párrafo informativo sobre el tema a continuación. Incluye hechos, detalles y explicaciones.',
        topic: 'Tema:',
      },
      writingEssay: {
        writeStructuredEssay: 'Escribe un ensayo estructurado respondiendo al indicador a continuación.',
        prompt: 'Indicador:',
      },
      readingResearch: {
        researchTopic: 'Tema de Investigación:',
      },
      readingVocab: {
        topic: 'Tema:',
      },
      writingPrompts: {
        prompt: 'Indicador:',
      },
      cognitiveProcessing: {
        quickSymbolRecognition: 'Reconocimiento Rápido de Símbolos',
        circleAllStars: 'Encierra en un círculo todas las ★ (estrellas) lo más rápido que puedas:',
      },
      cognitiveFlexibility: {
        taskSwitchingChallenge: 'Desafío de Cambio de Tareas',
        completeEachTask: 'Completa cada tarea, luego cambia a la nueva regla:',
      },
      algebra: {
        solveEachEquation: 'Resuelve cada ecuación, evalúa cada expresión o simplifica como se indica.',
        solve: 'Resuelve:',
      },
      wordProblems: {
        solveEachMultiStep: 'Resuelve cada problema de palabras de varios pasos. Muestra tu trabajo.',
      },
      readingLiterary: {
        readAndAnalyze: 'Lee el pasaje y analiza los elementos literarios a continuación. Proporciona evidencia del texto.',
      },
      writingEssay: {
        writeStructuredEssay: 'Escribe un ensayo estructurado respondiendo al indicador a continuación.',
      },
      grammarAdvanced: {
        identifyClauses: 'Identifica cláusulas, frases y estructuras de oraciones avanzadas en cada oración.',
      },
      grammarRhyming: {
        instructions: 'Identifica y empareja palabras que riman a través de actividades divertidas.',
        word: 'Palabra:',
        rhymingWords: 'Palabras que riman:',
        writeAnotherWord: 'Escribe otra palabra que rime: ________',
      },
      grammarPrek: {
        instructions: 'Empareja palabras simples con imágenes e identifica tipos básicos de palabras.',
        word: 'Palabra:',
        match: 'Emparejar:',
        wordPractice: 'Práctica de Palabras',
        circleWordMatches: 'Encierra en un círculo la palabra que coincide con la imagen:',
      },
      answerKey: {
        acceptYesNo: 'Acepta respuestas de sí/no basadas en pistas de imágenes. Los estudiantes deben mirar las imágenes para responder.',
        studentsShould: 'Los estudiantes deben',
        drawPicture: 'dibujar una imagen',
        lookAtPictures: 'mirar las imágenes para responder',
        sightWordsAnswer: 'escribir correctamente las palabras de vista 3 veces cada una y usarlas en oraciones. Verifica la precisión ortográfica y la construcción apropiada de oraciones.',
        grammarRhymingAnswer: 'Los estudiantes deben identificar y emparejar correctamente las palabras que riman. Verifica la comprensión de familias de palabras y conciencia fonémica.',
        visualProcessingAnswer: 'identificar diferencias en patrones y demostrar razonamiento espacial dibujando elementos en posiciones correctas.',
        visualProcessingNote: 'Nota: Las diferencias de patrones son: Patrón 1 - posición 4 (verde vs azul), Patrón 2 - posición 3 (triángulo vs círculo), Patrón 3 - posición 4 (grande vs pequeño). Los dibujos de razonamiento espacial deben mostrar elementos en posiciones relativas correctas.',
        note: 'Nota:',
        answer: 'Respuesta:',
        task: 'Tarea {{number}}:',
        problem: 'Problema {{number}}',
        pattern: 'Patrón {{number}}:',
        answersWillVary: 'Las respuestas variarán.',
      },
      sciencePrek: {
        instructions: 'Actividades simples de observación de la naturaleza con imágenes y preguntas básicas.',
        drawOrPaste: 'Dibuja o pega una imagen',
        topics: {
          plants: 'Plantas',
          animals: 'Animales',
          weather: 'Clima',
          seasons: 'Estaciones',
        },
        questions: {
          whatPlantsNeed: '¿Qué necesitan las plantas?',
          whereAnimalsLive: '¿Dónde viven los animales?',
          whatWeatherLike: '¿Cómo está el clima?',
          whatSeason: '¿Qué estación es?',
        },
      },
      scienceSpace: {
        instructions: 'Aprende sobre planetas, estrellas y fenómenos espaciales con actividades interactivas.',
        fact: 'Hecho:',
        distanceFromSun: 'Distancia del sol:',
        spaceQuestions: 'Preguntas Espaciales',
        whatIsStar: '¿Qué es una estrella?',
        nameOnePlanet: 'Nombra un planeta:',
      },
      geographyPrek: {
        instructions: 'Aprende sobre lugares en la comunidad, el hogar y la escuela con mapas simples e imágenes.',
        drawSimpleMap: 'Dibuja un mapa simple',
        placeTypes: {
          whereILive: 'Donde vivo',
          whereILearn: 'Donde aprendo',
          whereIPlay: 'Donde juego',
        },
      },
    },
    ar: {
      countObjectsAndWriteNumber: 'عد الكائنات واكتب الرقم.',
      countThe: 'عد {{object}}',
      numberLabel: 'الرقم',
      objectNames: {
        stars: 'النجوم',
        hearts: 'القلوب',
        circles: 'الدوائر',
        apples: 'التفاح',
        balls: 'الكرات',
        flowers: 'الزهور',
        butterflies: 'الفراشات',
        fish: 'الأسماك',
      },
      mathPuzzle: {
        instructions: 'املأ الأرقام المفقودة لإكمال كل معادلة. أظهر استراتيجية مختلفة (خط الأعداد، الرسم، إطار العشرة) لاثنين على الأقل من الألغاز.',
        answerLabel: 'إجابة اللغز {{number}}',
      },
      mathRace: {
        instructions: 'اضبط مؤقتاً لمدة 60 ثانية. حل أكبر عدد ممكن من الحقائق، ثم ضع دائرة حول رقمك الشخصي.',
      },
      reflection: {
        title: 'التفكير',
        mathRaceQuestions: 'كم عدد الحقائق التي حللتها؟ ______ • ما الاستراتيجية التي ساعدتك أكثر؟ ____________________',
        generalQuestions: 'ما الذي ساعدك على إكمال مهامك؟ ماذا ستفعل بشكل مختلف في المرة القادمة؟',
        mandalaQuestion: 'التفكير: كيف جعلك إنشاء هذا الماندالا تشعر؟',
      },
      answerKeyAndNotes: 'مفتاح الإجابات وملاحظات المعلم',
      countingTeachingNote: 'ملاحظة تعليمية: يجب على الطلاب عد كل كائن واحداً تلو الآخر. شجع على الإشارة أو لمس كل كائن أثناء العد لتطوير المراسلة واحد لواحد.',
      placeValue: {
        instructions: 'حدد الرقم في كل قيمة منزلية.',
        placeValueChart: 'جدول القيمة المنزلية:',
        whatDigit: 'ما الرقم الموجود في منزلة {{place}}؟',
        expandedForm: 'الصيغة الموسعة:',
        ones: 'الآحاد',
        tens: 'العشرات',
        hundreds: 'المئات',
        thousands: 'الآلاف',
        explanation: 'في الرقم {{number}}، اقرأ من اليمين إلى اليسار: منزلة الآحاد، منزلة العشرات، منزلة المئات، إلخ. الرقم الموجود في منزلة {{place}} هو {{digit}}.',
      },
      circleThe: 'أحط دائرة حول {{letter}}',
      beginningSounds: 'الأصوات الأولية',
      says: 'يقول',
      circleWordsStart: 'أحط الكلمات التي تبدأ بـ',
      alphabetAnswerKey: 'يجب على الطلاب تحديد ومطابقة الأحرف الكبيرة/الصغيرة بشكل صحيح، والتعرف على الأصوات الأولية، وأحط الحروف المطابقة. تحقق من دقة التعرف على الحروف.',
      readingDetective: {
        caseFile: 'ملف القضية',
        detectiveNotes: 'ملاحظات المحقق: المشهد هو {{setting}}. سمع شاهد همهمة. الدليل الرئيسي هو {{clue}}. من أو ما هو المسؤول؟',
        writeThreeInferences: 'اكتب ثلاث استنتاجات باستخدام الأدلة.',
        explainWhy: 'اشرح لماذا قد يكون الجاني {{culprit}}.',
        proveOrDisprove: 'أثبت أو ا disprove نظريتك بأدلة نصية.',
        drawEvidenceBoard: 'ارسم لوحة الأدلة أدناه وضع علامة على كل دليل.',
      },
      storyMap: {
        beginning: 'البداية',
        beginningPrompt: 'من هم الشخصيات؟ أين هم؟',
        middle: 'الوسط',
        middlePrompt: 'ما المشكلة التي تظهر؟ ما الأدلة التي تساعد؟',
        ending: 'النهاية',
        endingPrompt: 'كيف يحلونها؟ ما الدرس؟',
        clueLog: 'سجل الأدلة',
        lookBackAtStory: 'ارجع إلى القصة',
        clue: 'دليل {{number}}',
        retellInOwnWords: 'أعد السرد بكلماتك الخاصة',
        retellPrompt: 'اكتب ثلاث جمل تغطي البداية والوسط والنهاية.',
        comprehensionChecks: 'فحوصات الفهم',
        whyDidVisit: 'لماذا زار {{hero}} و{{friend}} {{setting}}؟',
        whatProblem: 'ما المشكلة التي أبطأتهم في منتصف القصة؟',
        howDidHelper: 'كيف ساعدهم {{helper}} على إنهاء هدفهم؟ ما الدرس الذي تعلموه؟',
      },
      vocab: {
        instructions: 'استخدم أدلة السياق لمطابقة كل كلمة بمعناها. ثم اكتب جملة باستخدام الكلمة في سياق {{context}}.',
        word: 'الكلمة',
        matchMeaning: 'طابق المعنى',
        sentenceInContext: 'الجملة في السياق',
      },
      summary: {
        instructions: 'اقرأ الفقرة المعلوماتية حول {{topic}}. أبرز الفكرة الأكثر أهمية من كل قسم. ثم أكمل صندوق الملخص بثلاث نقاط رئيسية.',
        paragraph: 'الفقرة {{number}}',
        paragraph1Intro: 'تقدم {{topic}}. لماذا تم إنشاؤه؟ من يستفيد منه؟',
        paragraph2Intro: 'تصف كيف يعمل كل يوم. ما الخطوات المتضمنة؟ من يساعد؟',
        paragraph3Intro: 'تشارك تحدياً واحداً وخطة لتحسينه الشهر القادم.',
        summaryBox: 'صندوق الملخص',
        keyPoint: 'النقطة الرئيسية {{number}}',
        closingSentence: 'اكتب جملة ختامية واحدة تعيد صياغة الفكرة الرئيسية بكلماتك الخاصة.',
      },
      compare: {
        instructions: 'قارن واعقد بين النصين. سجل معلومات حول {{topicA}} و{{topicB}}، ثم اكتب فقرة تشرح كيف هما متشابهان ومختلفان.',
        text1: 'النص 1: {{topic}}',
        text2: 'النص 2: {{topic}}',
        keyDetails: 'التفاصيل الرئيسية:',
        whatProblem: 'ما المشكلة التي يحلها؟',
        compareContrastParagraph: 'فقرة المقارنة والتباين',
        alikeBecause: '{{topicA}} و{{topicB}} متشابهان لأن',
        differentBecause: 'هما مختلفان لأن',
      },
      writingPrompts: {
        instructions: 'اختر مؤشراً واكتب بداية ووسط ونهاية. أضف المشاعر والإجراءات والحوار.',
        prompt: 'المؤشر {{number}}',
        brainstorm: 'العصف الذهني:',
        beginning: 'البداية:',
        middle: 'الوسط:',
        end: 'النهاية:',
      },
      writingSentences: {
        instructions: 'أكمل كل جملة بأفعال حية وتفاصيل. ثم أعد كتابة جملة واحدة باستخدام بنية مركبة.',
        compoundSentenceChallenge: 'تحدي الجملة المركبة',
        combineWithConjunction: 'اجمع جملتين من جملك بحرف عطف:',
      },
      writingPoetry: {
        instructions: 'أنشئ قصيدة هايكو وبيتاً من الشعر الحر حول {{theme}}. استخدم ثلاث كلمات على الأقل من بنك الكلمات.',
        wordBank: 'بنك الكلمات',
        haiku: 'هايكو (5-7-5)',
        freeVerseStanza: 'بيت الشعر الحر',
        line: 'السطر {{number}}',
      },
      writingOpinion: {
        instructions: 'خطط لفقرة رأي حول:',
        reasonsAndEvidence: 'الأسباب والأدلة',
        reason: 'السبب #{{number}}',
        evidence: 'الدليل',
        paragraphPlanner: 'مخطط الفقرة',
        hookSentence: 'جملة الجذب:',
        opinionStatement: 'بيان الرأي:',
        closingSentence: 'جملة الختام:',
      },
      scienceObservation: {
        instructions: 'راقب وسجل البيانات حول {{focus}}. أضف الرسوم التخطيطية والقياسات والأسئلة المثيرة للاهتمام.',
        dateAndTime: 'التاريخ والوقت',
        observationSketch: 'رسم الملاحظة',
        whatINoticed: 'ما لاحظته',
        questionsNextSteps: 'الأسئلة / الخطوات التالية',
      },
      scienceLifecycle: {
        instructions: 'ضع علامة وارسم دورة حياة {{cycle}}. صف ما يحدث في كل مرحلة.',
        stage: 'المرحلة {{number}}',
        notes: 'الملاحظات:',
      },
      scienceStates: {
        instructions: 'حدد تغيير الحالة لكل سيناريو. ارسم الجسيمات قبل وبعد التغيير.',
        scenario: 'السيناريو',
        stateChange: 'تغيير الحالة',
        particleDiagram: 'رسم الجسيمات',
      },
      scienceWeather: {
        instructions: 'تتبع طقس الأسبوع. سجل درجة الحرارة، ارسم السماء، واكتب نصيحة سلامة واحدة.',
        day: 'اليوم',
        temperature: 'درجة الحرارة',
        skySketch: 'رسم السماء',
        safetyTip: 'نصيحة السلامة',
      },
      geographyMap: {
        instructions: 'ارسم كل موقع على الشبكة أدناه. ضع علامة وصف ما يوجد في كل مكان.',
        coordinate: 'الإحداثيات',
        place: 'المكان',
        whatDoYouNotice: 'ماذا تلاحظ هناك؟',
        exampleMap: 'خريطة المثال',
        yourMapGrid: 'شبكة الخريطة الخاصة بك',
        useSampleToCheck: 'استخدم هذه العينة للتحقق من الإحداثيات والمعالم.',
        drawLandmarks: 'ارسم المعالم، أنشئ وسيلة إيضاحية، وضع علامة على كل إحداثي.',
      },
      geographyCulture: {
        instructions: 'استكشف التقاليد من جميع أنحاء العالم. ابحث وسجل طعاماً واحتفالاً وحقيقة مثيرة للاهتمام لكل منطقة.',
        region: 'المنطقة',
        food: 'الطعام',
        celebration: 'الاحتفال',
        interestingFact: 'حقيقة مثيرة للاهتمام',
      },
      geographyHistory: {
        instructions: 'أنشئ جدولاً زمنياً حول {{theme}}. ضع الأحداث بالترتيب واشرح تأثير كل منها.',
        impact: 'التأثير:',
      },
      grammarParts: {
        instructions: 'ضع علامة على كل كلمة مسطرة كاسم أو فعل أو صفة أو ظرف. أضف كلمة أخرى لتوسيع الجملة.',
        label: 'العلامة:',
        extraWord: 'كلمة إضافية:',
      },
      grammarTenses: {
        instructions: 'صرف كل فعل في الماضي والحاضر والمستقبل. ثم استخدم الفعل في جملة.',
        verb: 'الفعل',
        past: 'الماضي',
        present: 'الحاضر',
        future: 'المستقبل',
        writeSentence: 'اكتب جملة واحدة باستخدام كل زمن أسفل الجدول.',
      },
      grammarAntonyms: {
        instructions: 'طابق كل كلمة مع عكسها واستخدم الزوج في جملة.',
        word: 'الكلمة',
        antonym: 'العكس',
        sentence: 'الجملة',
      },
      artDesign: {
        instructions: 'لون كل نمط! استخدم ألوانك المفضلة واجعله جميلاً.',
        colorInsideShape: 'لون داخل الشكل!',
        patterns: {
          geometricStar: { title: 'نجمة هندسية', description: 'لون نمط النجمة بألوانك المفضلة!' },
          flowerPattern: { title: 'نمط الزهرة', description: 'لون بتلات الزهرة: وردي وأصفر وبنفسجي' },
          rainbowPattern: { title: 'نمط قوس قزح', description: 'لون كل شريط: أحمر وبرتقالي وأصفر وأخضر وأزرق وبنفسجي' },
          heartDesign: { title: 'تصميم القلب', description: 'لون القلوب باللون الأحمر والوردي' },
          circleMandala: { title: 'ماندالا دائرية', description: 'لون الدوائر بألوان مختلفة' },
          leafPattern: { title: 'نمط الورقة', description: 'لون الأوراق باللون الأخضر' },
        },
      },
      artColorwheel: {
        instructions: 'لون كل عنصر باللون الصحيح. طابق اسم اللون مع الكائن.',
        item: 'العنصر',
        color: 'اللون',
        colorIt: 'لونه!',
      },
      artSketch: {
        instructions: 'ارسم كل صورة! خذ وقتك واستخدم خيالك.',
        drawHere: 'ارسم هنا!',
        prompts: {
          beautifulFlower: { prompt: 'ارسم زهرة جميلة', hint: 'أضف البتلات والساق!' },
          treeWithLeaves: { prompt: 'ارسم شجرة بأوراق', hint: 'اجعله كبيراً وأخضر!' },
          geometricShapes: { prompt: 'ارسم أشكالاً هندسية', hint: 'ارسم دوائر ومربعات ومثلثات!' },
          rainbow: { prompt: 'ارسم قوس قزح', hint: 'استخدم كل الألوان!' },
          pattern: { prompt: 'ارسم نمطاً', hint: 'أنشئ تصميمك الخاص!' },
          gardenScene: { prompt: 'ارسم مشهد حديقة', hint: 'أضف الزهور والنباتات!' },
        },
      },
      earlyPhonics: {
        instructions: 'قل الصوت، تتبع الحرف، ثم ارسم صورة تبدأ به.',
        saySound: 'قل الصوت:',
        traceLetter: 'تتبع الحرف:',
        drawPicture: 'ارسم صورة:',
        words: 'الكلمات:',
      },
      earlyPatterns: {
        instructions: 'تابع كل نمط وأنشئ نمطك الخاص باستخدام الأشكال أو الألوان أو الملصقات.',
        pattern: 'النمط',
        tryBuilding: 'جرب بناء نمطك الخاص باستخدام:',
      },
      earlyShapes: {
        instructions: 'حدد كل شكل، لونه، ثم صنف الأشكال حسب النوع واللون.',
        shape: 'الشكل',
        color: 'اللون:',
        drawMore: 'ارسم 2 {{shape}}s أخرى أدناه:',
        sortingActivity: 'نشاط التصنيف',
        sortByShape: 'صنف حسب الشكل:',
        sortByColor: 'صنف حسب اللون:',
      },
      earlyLetters: {
        instructions: 'تتبع كل حرف، ثم اكتبه 3 مرات. ارسم صورة تبدأ بهذا الحرف.',
        trace: 'تتبع',
        write: 'اكتب',
        draw: 'ارسم',
      },
      earlyNumbers: {
        trace: 'تتبع',
        write: 'اكتب',
        draw: 'ارسم',
        numberWord: 'كلمة الرقم:',
      },
      logicPrek: {
        instructions: 'أكمل الأنماط البسيطة وصنف الكائنات حسب اللون أو الحجم أو النوع.',
        pattern: 'النمط',
      },
      selPrek: {
        instructions: 'حدد وعبّر عن المشاعر من خلال الصور والكلمات البسيطة والأنشطة.',
        feeling: 'المشاعر:',
        color: 'اللون:',
        drawTimeFelt: 'ارسم وقتاً شعرت فيه بـ {{feeling}}',
        howIFeelToday: 'كيف أشعر اليوم',
        feelings: {
          happy: 'سعيد',
          sad: 'حزين',
          angry: 'غاضب',
          excited: 'متحمس',
        },
      },
      mathRhythm: {
        instructions: 'أكمل كل إيقاع عد بالقفز. اكتب الأرقام المفقودة في الفراغات.',
      },
      logicRiddles: {
        instructions: 'حل كل لغز. اكتب تخمينك، ثم كشف الإجابة.',
        answer: 'الإجابة:',
      },
      logicDeduction: {
        instructions: 'استخدم الأدلة لتحديد من استعار كل عنصر وأين تم العثور عليه.',
      },
      cognitiveMemory: {
        instructions: 'حاول تذكر التسلسلات الثلاثة بالترتيب. اكتبها هنا:',
      },
      cognitiveAttention: {
        instructions: 'تدرب على التركيز على انتباهك مع تمارين المسح البصري والبحث عن الاختلافات.',
        findAndCircle: 'ابحث وضع دائرة حول جميع الأشكال <span className="font-bold">{{items}}</span> في الشبكة أدناه:',
        countHowMany: 'عد كم عدد الأشكال {{items}} التي وجدتها: _______',
        compareImages: 'قارن الصورتين وابحث عن الاختلافات:',
      },
      cognitiveExecutive: {
        instructions: 'تدرب على التخطيط والتنظيم وإكمال المهام. هذا يبني مهارات الوظيفة التنفيذية!',
        taskPlanning: 'تخطيط المهام',
        planTasksToday: 'خطط مهامك لليوم. قسم كل مهمة إلى خطوات:',
      },
      cognitiveVisual: {
        visualPatternMatching: 'مطابقة الأنماط البصرية',
        comparePatterns: 'قارن النمطين. ضع دائرة حول ما يختلف:',
        match: 'مطابقة:',
        drawItemPosition: 'ارسم كل عنصر في الموضع الصحيح:',
        drawItemText: 'ارسم {{item}} {{text}} الخط:',
        pattern: 'النمط {{number}}:',
        original: 'الأصلي:',
        whatsDifferent: 'ما المختلف؟ الموضع: _______ العنصر: _______',
        spatialReasoning: 'الاستدلال المكاني',
        above: 'فوق',
        below: 'تحت',
        toTheLeftOf: 'على يسار',
        toTheRightOf: 'على يمين',
      },
      cognitiveFlexibility: {
        instructions: 'أكمل كل مهمة، ثم انتقل إلى القاعدة الجديدة:',
        perspectiveTakingPractice: 'ممارسة أخذ المنظور',
        thinkAboutSituation: 'فكر في كل موقف من وجهات نظر مختلفة:',
      },
      cognitiveProcessing: {
        instructions: 'ضع دائرة حول جميع ★ (النجوم) بأسرع ما يمكن:',
      },
      selConflict: {
        instructions: 'تعلم استراتيجيات حل النزاعات بسلام. فكر في كيفية التواصل الفعال.',
      },
      selRegulation: {
        instructions: 'تدرب على استراتيجيات التنظيم الذاتي. هذه التقنيات تساعدك على إدارة المشاعر الكبيرة واتخاذ خيارات مدروسة.',
      },
      selKindness: {
        instructions: 'أكمل أعمال لطف هذا الأسبوع! تتبع لطفك وتأمل في كيفية تأثيره على نفسك والآخرين.',
      },
      selGrowthMindset: {
        instructions: 'حوّل أفكار العقلية الثابتة إلى أفكار عقلية النمو! تعلم احتضان التحديات والتعلم من الأخطاء.',
      },
      selStress: {
        instructions: 'حدد محفزات التوتر ومارس استراتيجيات مواجهة صحية. تعلم إدارة القلق والتوتر بفعالية.',
      },
      selCharacter: {
        instructions: 'استكشف سمات الشخصية والقيم المهمة. فكر في كيفية مساعدة هذه السمات لك والآخرين.',
        traits: {
          honesty: { name: 'الصدق', description: 'قول الحقيقة حتى عندما يكون الأمر صعباً' },
          respect: { name: 'الاحترام', description: 'معاملة الآخرين بلطف واعتبار' },
          responsibility: { name: 'المسؤولية', description: 'فعل ما من المفترض أن تفعله' },
          integrity: { name: 'النزاهة', description: 'فعل الصواب حتى عندما لا أحد يراقب' },
          courage: { name: 'الشجاعة', description: 'مواجهة المخاوف والوقوف لما هو صحيح' },
          compassion: { name: 'الرحمة', description: 'الاهتمام بالآخرين ومشاعرهم' },
        },
      },
      mathShapes: {
        instructions: 'ارسم واحسب كل شكل. ثم صنفه كـ "مسطح" أو "مجسم" وسجل عدد الأضلاع.',
        shape: 'الشكل',
        color: 'اللون',
        howMany: 'كم عدد؟',
        flatOrSolid: 'مسطح أم مجسم؟',
        numberOfSides: 'عدد الأضلاع',
      },
      mathMoney: {
        instructions: 'استخدم العملات المعدنية للعد حتى المجموع. ارسم العملات التي ستستخدمها وسجل القيمة.',
        costs: '{{item}} يكلف ${{amount}}. ادفع باستخدام {{coin}}. ارسم عملاتك أدناه واكتب المجموع.',
        total: 'المجموع:',
        change: 'الباقي:',
      },
      mathFractions: {
        instructions: 'قارن كل زوج من الكسور. ظلل نماذج الأشرطة لمساعدتك في اتخاذ القرار، ثم اكتب < أو > أو =.',
        shade: 'ظلل {{num}} من {{den}} أجزاء متساوية.',
      },
      mathMeasurement: {
        instructions: 'حول كل قياس. أظهر عملك في المساحة الم provided.',
        given: 'المعطى',
        convertTo: 'حول إلى',
        workSpace: 'مساحة العمل',
      },
      readingAdventure: {
        story: '{{hero}} و{{partner}} يصلان إلى {{setting}}. يجب عليهما {{quest}} قبل غروب القمر. في الطريق يلتقيان بمرشد يتحدث فقط بقوافي. ما الأدلة التي يجمعانها؟ كيف يعملان معاً؟',
        comprehensionChecks: 'فحوصات الفهم',
        whatProblem: 'ما المشكلة التي يحتاج {{hero}} و{{partner}} إلى حلها؟',
        describeClue: 'صف دليلاً واحداً من المرشد الذي يتحدث بقوافي.',
        howSetting: 'كيف يساعد المشهد أو يتحدى الشخصيات؟',
        creativeExtension: 'امتداد إبداعي',
        sketchScene: 'ارسم مشهداً واحداً من المغامرة وضع علامة على التفاصيل المهمة.',
      },
      earlyFoundations: {
        instructions: 'راجع المهارات الأساسية: حدد الحروف والأرقام والأشكال. مثالي للمعالجة أو المراجعة.',
        review: 'مراجعة:',
        identify: 'تحديد:',
        practiceWriting: 'ممارسة الكتابة',
        writeName: 'اكتب اسمك:',
        countTo10: 'عد حتى 10:',
      },
      earlyBasics: {
        instructions: 'مراجعة المهارات الأساسية للتعلم المبكر. تدرب على أصوات الحروف والعد والأنماط الأساسية.',
      },
      readingPrek: {
        instructions: 'انظر إلى الصور وأجب على أسئلة نعم/لا حول القصة.',
        yesNo: 'نعم / لا',
        storyTitles: {
          redCar: 'السيارة الحمراء',
          sunnyDay: 'اليوم المشمس',
          bigTree: 'الشجرة الكبيرة',
        },
        questions: {
          seeCar: 'هل ترى سيارة؟',
          carOnRoad: 'هل السيارة على الطريق؟',
          seeSun: 'هل ترى الشمس؟',
          thereFlower: 'هل هناك زهرة؟',
          treeBig: 'هل الشجرة كبيرة؟',
          seeHouse: 'هل ترى منزلاً؟',
        },
        objectNames: {
          sun: 'الشمس',
          flower: 'زهرة',
          ball: 'كرة',
          tree: 'شجرة',
          house: 'منزل',
          car: 'سيارة',
          road: 'طريق',
        },
      },
      writingPrek: {
        instructions: 'ارسم صورة وضع عليها تسمية بالكلمة. مثالي للكتّاب المبتدئين.',
        word: 'الكلمة:',
        label: 'التسمية:',
        drawPrompts: {
          cat: 'ارسم قطة',
          dog: 'ارسم كلباً',
          sun: 'ارسم الشمس',
          car: 'ارسم سيارة',
          tree: 'ارسم شجرة',
          flower: 'ارسم زهرة',
        },
      },
      readingSightwords: {
        instructions: 'تدرب على قراءة وكتابة كلمات البصر الشائعة مع أنشطة ممتعة.',
        writeIt3Times: 'اكتبها 3 مرات:',
        useInSentences: 'استخدم كلمات البصر في الجمل:',
        writeSentenceWith: 'اكتب جملة مع "{{word}}":',
        words: ['في', 'من', 'إلى', 'على', 'هذا', 'ذلك', 'هذه', 'كان', 'كانت', 'يكون', 'كانوا', 'له', 'لها', 'لهم', 'لي', 'لك', 'لكم', 'مع', 'بدون', 'أو', 'لكن', 'إذا', 'عندما', 'حيث', 'كيف', 'ماذا', 'من', 'لماذا', 'كل', 'بعض', 'كثير', 'قليل', 'أول', 'آخر', 'جديد', 'قديم'],
      },
      writingTrace: {
        practiceTracing: 'تدرب على تتبع الأحرف الصغيرة بانتظام. اتبع الخطوط المنقطة، ثم اكتب كل حرف 3 مرات بنفسك.',
        letter: 'الحرف:',
        traceTheLetter: 'تتبع الحرف:',
        traceHere: 'تتبع هنا',
        write3Times: 'اكتب 3 مرات:',
        practiceAllLetters: 'تدرب على جميع الأحرف',
        writeEntireAlphabet: 'اكتب الأبجدية الصغيرة بالكامل:',
        drawPicture: 'ارسم الصورة',
        writeSentence: 'اكتب جملة:',
      },
      writingLowercase: {
        practiceTracing: 'تدرب على تتبع الأحرف الصغيرة بانتظام. اتبع الخطوط المنقطة، ثم اكتب كل حرف 3 مرات بنفسك.',
        letter: 'الحرف:',
        traceTheLetter: 'تتبع الحرف:',
        traceHere: 'تتبع هنا',
        write3Times: 'اكتب 3 مرات:',
        practiceAllLetters: 'تدرب على جميع الأحرف',
        writeEntireAlphabet: 'اكتب الأبجدية الصغيرة بالكامل:',
      },
      writingNarrative: {
        instructions: 'اكتب قصة قصيرة لها بداية ووسط ونهاية. استخدم قالب تخطيط القصة أدناه.',
      },
      writingInformative: {
        instructions: 'اكتب فقرة إعلامية حول الموضوع أدناه. أدرج الحقائق والتفاصيل والتفسيرات.',
      },
      writingPictures: {
        instructions: 'انظر إلى كل مطالبة صورة واكتب جمل بسيطة أو قصة قصيرة عما تراه.',
        drawPicture: 'ارسم الصورة',
        writeSentence: 'اكتب جملة:',
      },
      writingNarrative: {
        instructions: 'اكتب قصة قصيرة لها بداية ووسط ونهاية. استخدم قالب تخطيط القصة أدناه.',
        storyStarters: 'بدايات القصص (اختر واحدة):',
      },
      writingInformative: {
        instructions: 'اكتب فقرة إعلامية حول الموضوع أدناه. أدرج الحقائق والتفاصيل والتفسيرات.',
        topic: 'الموضوع:',
      },
      writingEssay: {
        writeStructuredEssay: 'اكتب مقالاً منظمًا يرد على المطالبة أدناه.',
        prompt: 'المطالبة:',
      },
      readingResearch: {
        researchTopic: 'موضوع البحث:',
      },
      readingVocab: {
        topic: 'الموضوع:',
      },
      writingPrompts: {
        prompt: 'المطالبة:',
      },
      cognitiveProcessing: {
        quickSymbolRecognition: 'التعرف السريع على الرموز',
        circleAllStars: 'ضع دائرة حول جميع ★ (النجوم) بأسرع ما يمكن:',
      },
      cognitiveFlexibility: {
        taskSwitchingChallenge: 'تحدي تبديل المهام',
        completeEachTask: 'أكمل كل مهمة، ثم انتقل إلى القاعدة الجديدة:',
      },
      algebra: {
        solveEachEquation: 'حل كل معادلة، قيّم كل تعبير، أو بسّط كما هو موضح.',
        solve: 'حل:',
      },
      wordProblems: {
        solveEachMultiStep: 'حل كل مسألة كلمات متعددة الخطوات. أظهر عملك.',
      },
      readingLiterary: {
        readAndAnalyze: 'اقرأ المقطع وحلل العناصر الأدبية أدناه. قدم أدلة من النص.',
      },
      writingEssay: {
        writeStructuredEssay: 'اكتب مقالاً منظمًا يرد على المطالبة أدناه.',
      },
      grammarAdvanced: {
        identifyClauses: 'حدد الجمل والعبارات وبنيات الجمل المتقدمة في كل جملة.',
      },
      grammarRhyming: {
        instructions: 'حدد وطابق الكلمات المقفاة من خلال أنشطة ممتعة.',
        word: 'الكلمة:',
        rhymingWords: 'الكلمات المقفاة:',
        writeAnotherWord: 'اكتب كلمة أخرى تقفا: ________',
      },
      grammarPrek: {
        instructions: 'طابق الكلمات البسيطة مع الصور وحدد أنواع الكلمات الأساسية.',
        word: 'الكلمة:',
        match: 'مطابقة:',
        wordPractice: 'ممارسة الكلمات',
        circleWordMatches: 'ضع دائرة حول الكلمة التي تطابق الصورة:',
      },
      answerKey: {
        acceptYesNo: 'اقبل إجابات نعم/لا بناءً على أدلة الصور. يجب على الطلاب النظر إلى الصور للإجابة.',
        studentsShould: 'يجب على الطلاب',
        drawPicture: 'رسم صورة',
        lookAtPictures: 'النظر إلى الصور للإجابة',
        sightWordsAnswer: 'كتابة كلمات البصر بشكل صحيح 3 مرات لكل كلمة واستخدامها في الجمل. تحقق من دقة الإملاء وبناء الجملة المناسب.',
        grammarRhymingAnswer: 'يجب على الطلاب تحديد ومطابقة الكلمات المقفاة بشكل صحيح. تحقق من فهم عائلات الكلمات والوعي الصوتي.',
        visualProcessingAnswer: 'تحديد الاختلافات في الأنماط وإظهار الاستدلال المكاني من خلال رسم العناصر في المواضع الصحيحة.',
        visualProcessingNote: 'ملاحظة: الاختلافات في الأنماط هي: النمط 1 - الموضع 4 (أخضر مقابل أزرق)، النمط 2 - الموضع 3 (مثلث مقابل دائرة)، النمط 3 - الموضع 4 (كبير مقابل صغير). يجب أن تظهر رسومات الاستدلال المكاني العناصر في المواضع النسبية الصحيحة.',
        note: 'ملاحظة:',
        answer: 'الإجابة:',
        task: 'المهمة {{number}}:',
        problem: 'المسألة {{number}}',
        pattern: 'النمط {{number}}:',
        answersWillVary: 'ستختلف الإجابات.',
      },
      sciencePrek: {
        instructions: 'أنشطة بسيطة لمراقبة الطبيعة مع الصور والأسئلة الأساسية.',
        drawOrPaste: 'ارسم أو الصق صورة',
        topics: {
          plants: 'النباتات',
          animals: 'الحيوانات',
          weather: 'الطقس',
          seasons: 'الفصول',
        },
        questions: {
          whatPlantsNeed: 'ماذا تحتاج النباتات؟',
          whereAnimalsLive: 'أين تعيش الحيوانات؟',
          whatWeatherLike: 'كيف الطقس؟',
          whatSeason: 'ما الفصل؟',
        },
      },
      scienceSpace: {
        instructions: 'تعلم عن الكواكب والنجوم وظواهر الفضاء مع الأنشطة التفاعلية.',
        fact: 'حقيقة:',
        distanceFromSun: 'المسافة من الشمس:',
        spaceQuestions: 'أسئلة الفضاء',
        whatIsStar: 'ما هي النجوم؟',
        nameOnePlanet: 'اذكر كوكباً واحداً:',
      },
      geographyPrek: {
        instructions: 'تعلم عن الأماكن في المجتمع والمنزل والمدرسة مع خرائط وصور بسيطة.',
        drawSimpleMap: 'ارسم خريطة بسيطة',
        placeTypes: {
          whereILive: 'حيث أعيش',
          whereILearn: 'حيث أتعلم',
          whereIPlay: 'حيث ألعب',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = interactiveKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys.countObjectsAndWriteNumber) {
        worksheets.countObjectsAndWriteNumber = keys.countObjectsAndWriteNumber
      }
      if (keys.countThe) {
        worksheets.countThe = keys.countThe
      }
      if (keys.numberLabel) {
        worksheets.numberLabel = keys.numberLabel
      }
      if (keys.objectNames) {
        worksheets.objectNames = keys.objectNames
      }
      if (keys.mathPuzzle) {
        worksheets.mathPuzzle = keys.mathPuzzle
      }
      if (keys.mathRace) {
        worksheets.mathRace = keys.mathRace
      }
      if (keys.reflection) {
        worksheets.reflection = keys.reflection
      }
      if (keys.answerKeyAndNotes) {
        worksheets.answerKeyAndNotes = keys.answerKeyAndNotes
      }
      if (keys.countingTeachingNote) {
        worksheets.countingTeachingNote = keys.countingTeachingNote
      }
      if (keys.placeValue) {
        worksheets.placeValue = keys.placeValue
      }
      if (keys.circleThe) {
        worksheets.circleThe = keys.circleThe
      }
      if (keys.beginningSounds) {
        worksheets.beginningSounds = keys.beginningSounds
      }
      if (keys.says) {
        worksheets.says = keys.says
      }
      if (keys.circleWordsStart) {
        worksheets.circleWordsStart = keys.circleWordsStart
      }
      if (keys.alphabetAnswerKey) {
        worksheets.alphabetAnswerKey = keys.alphabetAnswerKey
      }
      if (keys.readingDetective) {
        worksheets.readingDetective = keys.readingDetective
      }
      if (keys.storyMap) {
        worksheets.storyMap = keys.storyMap
      }
      if (keys.vocab) {
        worksheets.vocab = keys.vocab
      }
      if (keys.summary) {
        worksheets.summary = keys.summary
      }
      if (keys.compare) {
        worksheets.compare = keys.compare
      }
      if (keys.writingPrompts) {
        worksheets.writingPrompts = keys.writingPrompts
      }
      if (keys.writingSentences) {
        worksheets.writingSentences = keys.writingSentences
      }
      if (keys.writingPoetry) {
        worksheets.writingPoetry = keys.writingPoetry
      }
      if (keys.writingOpinion) {
        worksheets.writingOpinion = keys.writingOpinion
      }
      if (keys.scienceObservation) {
        worksheets.scienceObservation = keys.scienceObservation
      }
      if (keys.scienceLifecycle) {
        worksheets.scienceLifecycle = keys.scienceLifecycle
      }
      if (keys.scienceStates) {
        worksheets.scienceStates = keys.scienceStates
      }
      if (keys.scienceWeather) {
        worksheets.scienceWeather = keys.scienceWeather
      }
      if (keys.geographyMap) {
        worksheets.geographyMap = keys.geographyMap
      }
      if (keys.geographyCulture) {
        worksheets.geographyCulture = keys.geographyCulture
      }
      if (keys.geographyHistory) {
        worksheets.geographyHistory = keys.geographyHistory
      }
      if (keys.grammarParts) {
        worksheets.grammarParts = keys.grammarParts
      }
      if (keys.grammarTenses) {
        worksheets.grammarTenses = keys.grammarTenses
      }
      if (keys.grammarAntonyms) {
        worksheets.grammarAntonyms = keys.grammarAntonyms
      }
      if (keys.artDesign) {
        worksheets.artDesign = keys.artDesign
      }
      if (keys.artColorwheel) {
        worksheets.artColorwheel = keys.artColorwheel
      }
      if (keys.artSketch) {
        worksheets.artSketch = keys.artSketch
      }
      if (keys.earlyPhonics) {
        worksheets.earlyPhonics = keys.earlyPhonics
      }
      if (keys.earlyPatterns) {
        worksheets.earlyPatterns = keys.earlyPatterns
      }
      if (keys.earlyShapes) {
        worksheets.earlyShapes = keys.earlyShapes
      }
      if (keys.earlyLetters) {
        worksheets.earlyLetters = keys.earlyLetters
      }
      if (keys.earlyNumbers) {
        worksheets.earlyNumbers = keys.earlyNumbers
      }
      if (keys.mathShapes) {
        worksheets.mathShapes = keys.mathShapes
      }
      if (keys.mathMoney) {
        worksheets.mathMoney = keys.mathMoney
      }
      if (keys.mathFractions) {
        worksheets.mathFractions = keys.mathFractions
      }
      if (keys.mathMeasurement) {
        worksheets.mathMeasurement = keys.mathMeasurement
      }
      if (keys.readingAdventure) {
        worksheets.readingAdventure = keys.readingAdventure
      }
      if (keys.earlyFoundations) {
        worksheets.earlyFoundations = keys.earlyFoundations
      }
      if (keys.earlyBasics) {
        worksheets.earlyBasics = keys.earlyBasics
      }
      if (keys.readingPrek) {
        worksheets.readingPrek = keys.readingPrek
      }
      if (keys.writingPrek) {
        worksheets.writingPrek = keys.writingPrek
      }
      if (keys.answerKey) {
        worksheets.answerKey = keys.answerKey
      }
      if (keys.sciencePrek) {
        worksheets.sciencePrek = keys.sciencePrek
      }
      if (keys.scienceSpace) {
        worksheets.scienceSpace = keys.scienceSpace
      }
      if (keys.geographyPrek) {
        worksheets.geographyPrek = keys.geographyPrek
      }
      if (keys.readingSightwords) {
        worksheets.readingSightwords = keys.readingSightwords
      }
      if (keys.grammarRhyming) {
        worksheets.grammarRhyming = keys.grammarRhyming
      }
      if (keys.grammarPrek) {
        worksheets.grammarPrek = keys.grammarPrek
      }
      if (keys.logicPrek) {
        worksheets.logicPrek = keys.logicPrek
      }
      if (keys.selPrek) {
        worksheets.selPrek = keys.selPrek
      }
      if (keys.mathRhythm) {
        worksheets.mathRhythm = keys.mathRhythm
      }
      if (keys.logicRiddles) {
        worksheets.logicRiddles = keys.logicRiddles
      }
      if (keys.logicDeduction) {
        worksheets.logicDeduction = keys.logicDeduction
      }
      if (keys.cognitiveMemory) {
        worksheets.cognitiveMemory = keys.cognitiveMemory
      }
      if (keys.cognitiveAttention) {
        worksheets.cognitiveAttention = keys.cognitiveAttention
      }
      if (keys.cognitiveExecutive) {
        worksheets.cognitiveExecutive = keys.cognitiveExecutive
      }
      if (keys.cognitiveVisual) {
        worksheets.cognitiveVisual = keys.cognitiveVisual
      }
      if (keys.cognitiveFlexibility) {
        worksheets.cognitiveFlexibility = keys.cognitiveFlexibility
      }
      if (keys.cognitiveProcessing) {
        worksheets.cognitiveProcessing = keys.cognitiveProcessing
      }
      if (keys.selConflict) {
        worksheets.selConflict = keys.selConflict
      }
      if (keys.selRegulation) {
        worksheets.selRegulation = keys.selRegulation
      }
      if (keys.selKindness) {
        worksheets.selKindness = keys.selKindness
      }
      if (keys.selGrowthMindset) {
        worksheets.selGrowthMindset = keys.selGrowthMindset
      }
      if (keys.selStress) {
        worksheets.selStress = keys.selStress
      }
      if (keys.selCharacter) {
        worksheets.selCharacter = keys.selCharacter
      }
    }
  }
}

// Ensure place-value-hto worksheet keys are present
const ensurePlaceValueHtoKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const placeValueKeys = {
    en: {
      'place-value-hto': {
        title: 'Place Value – Tens and Ones (to 99)',
        description: 'Write how many tens and ones in each number. Then write the complete number in expanded form in the blank spaces.',
        learningObjectives: [
          'Understand place value: tens and ones',
          'Break numbers into tens and ones',
          'Write numbers in expanded form',
        ],
        parentTeacherTips: [
          'The tens place tells how many groups of 10',
          'The ones place tells how many extra ones',
          'Expanded form shows the value of each place',
          'Example: 47 = 4 tens + 7 ones = 40 + 7',
          'Extension: Try with 3-digit numbers (hundreds, tens, ones)',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          number: 'Number:',
          tensLabel: '4 tens = 40',
          onesLabel: '7 ones = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'Step 1: Find tens:',
          step1Text: '47 has 4 tens (40)',
          step2: 'Step 2: Find ones:',
          step2Text: '47 has 7 ones',
          step3: 'Step 3: Expanded form:',
          step3Text: '40 + 7',
          answer: 'Answer:',
          answerText: 'Tens: 4, Ones: 7, Expanded: 40 + 7',
          tip: '💡 Tip: The tens digit tells you how many groups of 10, the ones digit tells you how many extra ones!',
        },
        legend: {
          tenLabel: '= 1 Ten (10)',
          oneLabel: '= 1 One',
        },
        labels: {
          number: 'Number:',
          tens: 'Tens:',
          ones: 'Ones:',
          expanded: 'Expanded:',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Write 56 in expanded form: ___ + ___',
            'What number has 8 tens and 3 ones? ___',
            'Can you write a 3-digit number in expanded form? (hundreds, tens, ones)',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I understand tens and ones',
            'I can break numbers into tens and ones',
            'I can write numbers in expanded form',
          ],
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          tensLabel: 'Tens',
          onesLabel: 'Ones',
          expandedLabel: 'Expanded',
        },
        labels: {
          number: 'Number:',
          tens: 'Tens:',
          ones: 'Ones:',
          expanded: 'Expanded:',
          more: '+{count} more',
        },
      },
    },
    es: {
      'place-value-hto': {
        title: 'Valor Posicional – Decenas y Unidades (hasta 99)',
        description: 'Escribe cuántas decenas y unidades hay en cada número. Luego escribe el número completo en forma expandida en los espacios en blanco.',
        learningObjectives: [
          'Entender el valor posicional: decenas y unidades',
          'Descomponer números en decenas y unidades',
          'Escribir números en forma expandida',
        ],
        parentTeacherTips: [
          'El lugar de las decenas indica cuántos grupos de 10',
          'El lugar de las unidades indica cuántas unidades extra',
          'La forma expandida muestra el valor de cada posición',
          'Ejemplo: 47 = 4 decenas + 7 unidades = 40 + 7',
          'Extensión: Prueba con números de 3 dígitos (centenas, decenas, unidades)',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          number: 'Número:',
          tensLabel: '4 decenas = 40',
          onesLabel: '7 unidades = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'Paso 1: Encuentra las decenas:',
          step1Text: '47 tiene 4 decenas (40)',
          step2: 'Paso 2: Encuentra las unidades:',
          step2Text: '47 tiene 7 unidades',
          step3: 'Paso 3: Forma expandida:',
          step3Text: '40 + 7',
          answer: 'Respuesta:',
          answerText: 'Decenas: 4, Unidades: 7, Expandida: 40 + 7',
          tip: '💡 Consejo: ¡El dígito de las decenas te dice cuántos grupos de 10, el dígito de las unidades te dice cuántas unidades extra!',
        },
        legend: {
          tenLabel: '= 1 Decena (10)',
          oneLabel: '= 1 Unidad',
        },
        labels: {
          number: 'Número:',
          tens: 'Decenas:',
          ones: 'Unidades:',
          expanded: 'Expandida:',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Escribe 56 en forma expandida: ___ + ___',
            '¿Qué número tiene 8 decenas y 3 unidades? ___',
            '¿Puedes escribir un número de 3 dígitos en forma expandida? (centenas, decenas, unidades)',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Entiendo las decenas y unidades',
            'Puedo descomponer números en decenas y unidades',
            'Puedo escribir números en forma expandida',
          ],
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          tensLabel: 'Decenas',
          onesLabel: 'Unidades',
          expandedLabel: 'Expandida',
        },
        labels: {
          number: 'Número:',
          tens: 'Decenas:',
          ones: 'Unidades:',
          expanded: 'Expandida:',
          more: '+{count} más',
        },
      },
    },
    ar: {
      'place-value-hto': {
        title: 'القيمة المكانية – العشرات والآحاد (حتى 99)',
        description: 'اكتب كم عشرة وكم واحد في كل رقم. ثم اكتب الرقم الكامل في الصورة الموسعة في المسافات الفارغة.',
        learningObjectives: [
          'فهم القيمة المكانية: العشرات والآحاد',
          'تحليل الأرقام إلى عشرات وآحاد',
          'كتابة الأرقام في الصورة الموسعة',
        ],
        parentTeacherTips: [
          'مكان العشرات يخبرك بعدد مجموعات الـ 10',
          'مكان الآحاد يخبرك بعدد الآحاد الإضافية',
          'الصورة الموسعة تُظهر قيمة كل مكان',
          'مثال: 47 = 4 عشرات + 7 آحاد = 40 + 7',
          'التمديد: جرب مع أرقام من 3 أرقام (مئات، عشرات، آحاد)',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          number: 'الرقم:',
          tensLabel: '4 عشرات = 40',
          onesLabel: '7 آحاد = 7',
          expandedLabel: '47 = 40 + 7',
          step1: 'الخطوة 1: ابحث عن العشرات:',
          step1Text: '47 لديه 4 عشرات (40)',
          step2: 'الخطوة 2: ابحث عن الآحاد:',
          step2Text: '47 لديه 7 آحاد',
          step3: 'الخطوة 3: الصورة الموسعة:',
          step3Text: '40 + 7',
          answer: 'الإجابة:',
          answerText: 'العشرات: 4، الآحاد: 7، الموسعة: 40 + 7',
          tip: '💡 نصيحة: رقم العشرات يخبرك بعدد مجموعات الـ 10، رقم الآحاد يخبرك بعدد الآحاد الإضافية!',
        },
        legend: {
          tenLabel: '= عشرة واحدة (10)',
          oneLabel: '= واحد واحد',
        },
        labels: {
          number: 'الرقم:',
          tens: 'العشرات:',
          ones: 'الآحاد:',
          expanded: 'الموسعة:',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'اكتب 56 في الصورة الموسعة: ___ + ___',
            'ما الرقم الذي لديه 8 عشرات و 3 آحاد؟ ___',
            'هل يمكنك كتابة رقم من 3 أرقام في الصورة الموسعة؟ (مئات، عشرات، آحاد)',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'أفهم العشرات والآحاد',
            'يمكنني تحليل الأرقام إلى عشرات وآحاد',
            'يمكنني كتابة الأرقام في الصورة الموسعة',
          ],
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          tensLabel: 'العشرات',
          onesLabel: 'الآحاد',
          expandedLabel: 'الموسعة',
        },
        labels: {
          number: 'الرقم:',
          tens: 'العشرات:',
          ones: 'الآحاد:',
          expanded: 'الموسعة:',
          more: '+{count} أكثر',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = placeValueKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['place-value-hto']) {
        worksheets['place-value-hto'] = keys['place-value-hto']
      }
    }
  }
}

// Ensure count-circle-1-10 worksheet keys are present
const ensureCountCircleKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const countCircleKeys = {
    en: {
      'count-circle-1-10': {
        title: 'Count & Circle 1–10',
        description: 'Count the objects in each box. Circle the correct number.',
        learningObjectives: [
          'Count objects accurately up to 10',
          'Match quantities to numerals',
          'Develop one-to-one correspondence',
          'Build number recognition skills',
        ],
        parentTeacherTips: [
          'Encourage students to point to each object as they count',
          'Use one-to-one correspondence: one object = one number',
          'Help students recognize that the last number counted is the total',
          'Practice counting aloud: 1, 2, 3, 4, 5...',
          'Extension: Try counting larger groups or counting backwards',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: 'Count the circles and circle the correct number',
          step1: 'Step 1:',
          step1Text: 'Point to each circle and count: 1, 2, 3, 4, 5',
          step2: 'Step 2:',
          step2Text: 'The last number counted is 5, so there are 5 circles',
          step3: 'Step 3:',
          step3Text: 'Circle the number 5',
          answer: 'Answer:',
          answerText: 'Circle 5',
          tip: '💡 Tip: Count each object once, and the last number you say is the total!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Count objects around you: How many pencils? How many books?',
            'Draw your own group of objects and count them',
            'Try counting backwards from 10: 10, 9, 8, 7...',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can count objects accurately',
            'I can match quantities to numbers',
            'I circled all {count} correct numbers',
          ],
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
        },
      },
    },
    es: {
      'count-circle-1-10': {
        title: 'Contar y Encerrar 1–10',
        description: 'Cuenta los objetos en cada caja. Encierra el número correcto.',
        learningObjectives: [
          'Contar objetos con precisión hasta 10',
          'Hacer coincidir cantidades con numerales',
          'Desarrollar correspondencia uno a uno',
          'Desarrollar habilidades de reconocimiento de números',
        ],
        parentTeacherTips: [
          'Anima a los estudiantes a señalar cada objeto mientras cuentan',
          'Usa correspondencia uno a uno: un objeto = un número',
          'Ayuda a los estudiantes a reconocer que el último número contado es el total',
          'Practica contando en voz alta: 1, 2, 3, 4, 5...',
          'Extensión: Intenta contar grupos más grandes o contar hacia atrás',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: 'Cuenta los círculos y encierra el número correcto',
          step1: 'Paso 1:',
          step1Text: 'Señala cada círculo y cuenta: 1, 2, 3, 4, 5',
          step2: 'Paso 2:',
          step2Text: 'El último número contado es 5, así que hay 5 círculos',
          step3: 'Paso 3:',
          step3Text: 'Encierra el número 5',
          answer: 'Respuesta:',
          answerText: 'Encierra el 5',
          tip: '💡 Consejo: ¡Cuenta cada objeto una vez, y el último número que digas es el total!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Cuenta objetos a tu alrededor: ¿Cuántos lápices? ¿Cuántos libros?',
            'Dibuja tu propio grupo de objetos y cuéntalos',
            'Intenta contar hacia atrás desde 10: 10, 9, 8, 7...',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo contar objetos con precisión',
            'Puedo hacer coincidir cantidades con números',
            'Encerré todos los {count} números correctos',
          ],
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
        },
      },
    },
    ar: {
      'count-circle-1-10': {
        title: 'عد وأحط 1–10',
        description: 'عد الكائنات في كل صندوق. أحط الرقم الصحيح.',
        learningObjectives: [
          'عد الكائنات بدقة حتى 10',
          'مطابقة الكميات مع الأرقام',
          'تطوير المراسلة واحد لواحد',
          'بناء مهارات التعرف على الأرقام',
        ],
        parentTeacherTips: [
          'شجع الطلاب على الإشارة إلى كل كائن أثناء العد',
          'استخدم المراسلة واحد لواحد: كائن واحد = رقم واحد',
          'ساعد الطلاب على إدراك أن آخر رقم تم عدّه هو المجموع',
          'تدرب على العد بصوت عالٍ: 1، 2، 3، 4، 5...',
          'امتداد: جرب عد مجموعات أكبر أو العد للخلف',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: 'عد الدوائر وأحط الرقم الصحيح',
          step1: 'الخطوة 1:',
          step1Text: 'أشر إلى كل دائرة وعد: 1، 2، 3، 4، 5',
          step2: 'الخطوة 2:',
          step2Text: 'آخر رقم تم عدّه هو 5، إذن هناك 5 دوائر',
          step3: 'الخطوة 3:',
          step3Text: 'أحط الرقم 5',
          answer: 'الإجابة:',
          answerText: 'أحط 5',
          tip: '💡 نصيحة: عد كل كائن مرة واحدة، وآخر رقم تقوله هو المجموع!',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          items: [
            'عد الكائنات من حولك: كم قلم؟ كم كتاب؟',
            'ارسم مجموعة خاصة بك من الكائنات وعدها',
            'جرب العد للخلف من 10: 10، 9، 8، 7...',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني عد الكائنات بدقة',
            'يمكنني مطابقة الكميات مع الأرقام',
            'أحطت جميع الأرقام الصحيحة {count}',
          ],
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = countCircleKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['count-circle-1-10']) {
        worksheets['count-circle-1-10'] = keys['count-circle-1-10']
      }
    }
  }
}

// Ensure mult-facts-0-12 worksheet keys are present
const ensureMultFactsKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const multFactsKeys = {
    en: {
      'mult-facts-0-12': {
        title: 'Multiplication Facts 0–12',
        description: 'Practice all multiplication facts from 0×0 to 12×12. Build speed and accuracy.',
        learningObjectives: [
          'Master multiplication facts from 0×0 to 12×12',
          'Build speed and accuracy with multiplication facts',
          'Memorize multiplication tables',
          'Develop fact fluency for mental math',
        ],
        parentTeacherTips: [
          'Practice daily for 5-10 minutes for best results',
          'Use strategies: doubles (6×6), skip counting, or arrays',
          'Start with easier facts (0s, 1s, 2s, 5s, 10s) and work up',
          'Use flashcards or games to make practice fun',
          'Extension: Time yourself and try to beat your record',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '6 × 4 = ?',
          strategy1: 'Strategy 1 (Skip counting):',
          strategy1Text: 'Count by 4s: 4, 8, 12, 16, 20, 24 (6 times)',
          strategy2: 'Strategy 2 (Arrays):',
          strategy2Text: '6 rows of 4 = 24',
          strategy3: 'Strategy 3 (Doubles):',
          strategy3Text: '6 × 2 = 12, so 6 × 4 = 12 + 12 = 24',
          answer: 'Answer:',
          answerText: '24',
          tip: '💡 Tip: Use the strategy that works best for you! Practice helps you memorize facts faster!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Time yourself: How fast can you solve all 20 problems?',
            'Try solving: 13 × 5 = ? and 11 × 12 = ?',
            'Create your own multiplication problems and solve them',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can solve multiplication facts quickly',
            'I know my multiplication facts from 0-12',
            'I solved all {count} problems correctly',
          ],
          score: 'My score:',
          time: 'My time:',
          minutes: 'minutes',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          remember: '💡 Remember: Practice makes perfect! Keep practicing your multiplication facts daily to build speed and accuracy!',
        },
      },
    },
    es: {
      'mult-facts-0-12': {
        title: 'Operaciones de Multiplicación 0–12',
        description: 'Practica todas las operaciones de multiplicación del 0×0 al 12×12. Desarrolla velocidad y precisión.',
        learningObjectives: [
          'Dominar las operaciones de multiplicación del 0×0 al 12×12',
          'Desarrollar velocidad y precisión con operaciones de multiplicación',
          'Memorizar las tablas de multiplicar',
          'Desarrollar fluidez en operaciones para cálculo mental',
        ],
        parentTeacherTips: [
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Usa estrategias: dobles (6×6), conteo saltado o matrices',
          'Comienza con operaciones más fáciles (0s, 1s, 2s, 5s, 10s) y avanza',
          'Usa tarjetas o juegos para hacer la práctica divertida',
          'Extensión: Cronométrate e intenta superar tu récord',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '6 × 4 = ?',
          strategy1: 'Estrategia 1 (Conteo saltado):',
          strategy1Text: 'Cuenta de 4 en 4: 4, 8, 12, 16, 20, 24 (6 veces)',
          strategy2: 'Estrategia 2 (Matrices):',
          strategy2Text: '6 filas de 4 = 24',
          strategy3: 'Estrategia 3 (Dobles):',
          strategy3Text: '6 × 2 = 12, entonces 6 × 4 = 12 + 12 = 24',
          answer: 'Respuesta:',
          answerText: '24',
          tip: '💡 Consejo: ¡Usa la estrategia que mejor funcione para ti! ¡La práctica te ayuda a memorizar las operaciones más rápido!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Cronométrate: ¿Qué tan rápido puedes resolver los 20 problemas?',
            'Intenta resolver: 13 × 5 = ? y 11 × 12 = ?',
            'Crea tus propios problemas de multiplicación y resuélvelos',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo resolver operaciones de multiplicación rápidamente',
            'Conozco mis operaciones de multiplicación del 0-12',
            'Resolví correctamente todos los {count} problemas',
          ],
          score: 'Mi puntuación:',
          time: 'Mi tiempo:',
          minutes: 'minutos',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          remember: '💡 Recuerda: ¡La práctica hace la perfección! ¡Sigue practicando tus operaciones de multiplicación diariamente para desarrollar velocidad y precisión!',
        },
      },
    },
    ar: {
      'mult-facts-0-12': {
        title: 'حقائق الضرب 0–12',
        description: 'تدرب على جميع حقائق الضرب من 0×0 إلى 12×12. بناء السرعة والدقة.',
        learningObjectives: [
          'إتقان حقائق الضرب من 0×0 إلى 12×12',
          'بناء السرعة والدقة مع حقائق الضرب',
          'حفظ جداول الضرب',
          'تطوير الطلاقة في الحقائق للحساب الذهني',
        ],
        parentTeacherTips: [
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'استخدم الاستراتيجيات: المضاعفات (6×6)، العد المتخطي، أو المصفوفات',
          'ابدأ بحقائق أسهل (0s، 1s، 2s، 5s، 10s) واعمل حتى',
          'استخدم البطاقات التعليمية أو الألعاب لجعل الممارسة ممتعة',
          'التمديد: قم بتوقيت نفسك وحاول تحطيم رقمك القياسي',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: '6 × 4 = ?',
          strategy1: 'الاستراتيجية 1 (العد المتخطي):',
          strategy1Text: 'عد بالـ 4: 4، 8، 12، 16، 20، 24 (6 مرات)',
          strategy2: 'الاستراتيجية 2 (المصفوفات):',
          strategy2Text: '6 صفوف من 4 = 24',
          strategy3: 'الاستراتيجية 3 (المضاعفات):',
          strategy3Text: '6 × 2 = 12، إذن 6 × 4 = 12 + 12 = 24',
          answer: 'الإجابة:',
          answerText: '24',
          tip: '💡 نصيحة: استخدم الاستراتيجية التي تناسبك أكثر! الممارسة تساعدك على حفظ الحقائق بشكل أسرع!',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'قم بتوقيت نفسك: ما مدى سرعة حل جميع المشاكل الـ 20؟',
            'حاول حل: 13 × 5 = ? و 11 × 12 = ?',
            'أنشئ مشاكل الضرب الخاصة بك وحلها',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني حل حقائق الضرب بسرعة',
            'أعرف حقائق الضرب من 0-12',
            'حللت جميع المشاكل الـ {count} بشكل صحيح',
          ],
          score: 'نقاطي:',
          time: 'وقتي:',
          minutes: 'دقائق',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          remember: '💡 تذكر: الممارسة تصنع الكمال! استمر في ممارسة حقائق الضرب يومياً لبناء السرعة والدقة!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = multFactsKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['mult-facts-0-12']) {
        worksheets['mult-facts-0-12'] = keys['mult-facts-0-12']
      }
    }
  }
}

// Ensure math-maze worksheet keys are present
const ensureMathMazeKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const mathMazeKeys = {
    en: {
      'math-maze': {
        title: 'Math Maze Adventure',
        description: 'Start at S and reach F. Move up/down/left/right only onto tiles whose equation equals the target shown in that row. Circle your path!',
        learningObjectives: [
          'Solve addition and subtraction equations',
          'Navigate through a maze using math skills',
          'Apply problem-solving strategies',
          'Practice mental math and number recognition',
        ],
        parentTeacherTips: [
          'Choose a target number for each row before starting',
          'Only move onto tiles where the equation equals the row target',
          'Work backwards: start from F and find valid paths',
          'Encourage students to check their math as they go',
          'Extension: Create your own math maze with different equations',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: 'Find a path from S to F',
          step1: 'Step 1:',
          step1Text: 'Choose target numbers for each row (e.g., Row 1 = 6, Row 2 = 8, Row 3 = 10)',
          step2: 'Step 2:',
          step2Text: 'Find tiles in Row 1 that equal 6: 4+2=6, 8-2=6, etc.',
          step3: 'Step 3:',
          step3Text: 'Move to Row 2 and find tiles that equal 8: 6+2=8, 9-1=8, etc.',
          step4: 'Step 4:',
          step4Text: 'Continue to Row 3 and find tiles that equal 10: 7+3=10, 12-2=10, etc.',
          step5: 'Step 5:',
          step5Text: 'Draw your path from S to F following valid tiles',
          tip: '💡 Tip: Check each equation before moving onto that tile!',
        },
        howToPlay: {
          title: 'How to play',
          step1: 'Choose a target number per row (e.g., row 1 = 6).',
          step2: 'Step only on equations that equal that row\'s target.',
          step3: 'Draw your path from S to F without diagonal moves.',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Can you find a different path using different target numbers?',
            'Try using only addition equations (no subtraction)',
            'Create your own math maze with 3 rows and 5 columns',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can solve addition and subtraction equations',
            'I found a valid path from S to F',
            'I checked my math as I went',
          ],
          targetNumbers: 'My target numbers:',
          targetNumbersFormat: 'Row 1: ___, Row 2: ___, Row 3: ___',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          exampleTargetPlan: 'Example target plan:',
          row1: 'Row 1 target: 6 → valid tiles: 4+2, 8-2, 3+3, etc.',
          row2: 'Row 2 target: 8 → valid tiles: 6+2, 9-1, 5+3, etc.',
          row3: 'Row 3 target: 10 → valid tiles: 7+3, 12-2, 5+5, etc.',
          remember: '💡 Remember: Any path that follows the row targets is correct! Choose your own target numbers and find a valid path from S to F.',
        },
      },
    },
    es: {
      'math-maze': {
        title: 'Aventura de Laberinto Matemático',
        description: 'Comienza en S y llega a F. Muévete arriba/abajo/izquierda/derecha solo sobre casillas cuya ecuación sea igual al objetivo mostrado en esa fila. ¡Marca tu camino!',
        learningObjectives: [
          'Resolver ecuaciones de suma y resta',
          'Navegar por un laberinto usando habilidades matemáticas',
          'Aplicar estrategias de resolución de problemas',
          'Practicar cálculo mental y reconocimiento de números',
        ],
        parentTeacherTips: [
          'Elige un número objetivo para cada fila antes de comenzar',
          'Solo muévete sobre casillas donde la ecuación sea igual al objetivo de la fila',
          'Trabaja hacia atrás: comienza desde F y encuentra caminos válidos',
          'Anima a los estudiantes a verificar sus cálculos mientras avanzan',
          'Extensión: Crea tu propio laberinto matemático con diferentes ecuaciones',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: 'Encuentra un camino de S a F',
          step1: 'Paso 1:',
          step1Text: 'Elige números objetivo para cada fila (ej., Fila 1 = 6, Fila 2 = 8, Fila 3 = 10)',
          step2: 'Paso 2:',
          step2Text: 'Encuentra casillas en la Fila 1 que sean igual a 6: 4+2=6, 8-2=6, etc.',
          step3: 'Paso 3:',
          step3Text: 'Muévete a la Fila 2 y encuentra casillas que sean igual a 8: 6+2=8, 9-1=8, etc.',
          step4: 'Paso 4:',
          step4Text: 'Continúa a la Fila 3 y encuentra casillas que sean igual a 10: 7+3=10, 12-2=10, etc.',
          step5: 'Paso 5:',
          step5Text: 'Dibuja tu camino de S a F siguiendo casillas válidas',
          tip: '💡 Consejo: ¡Verifica cada ecuación antes de moverte a esa casilla!',
        },
        howToPlay: {
          title: 'Cómo jugar',
          step1: 'Elige un número objetivo por fila (ej., fila 1 = 6).',
          step2: 'Pisa solo ecuaciones que sean igual al objetivo de esa fila.',
          step3: 'Dibuja tu camino de S a F sin movimientos diagonales.',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            '¿Puedes encontrar un camino diferente usando diferentes números objetivo?',
            'Intenta usar solo ecuaciones de suma (sin resta)',
            'Crea tu propio laberinto matemático con 3 filas y 5 columnas',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo resolver ecuaciones de suma y resta',
            'Encontré un camino válido de S a F',
            'Verifiqué mis cálculos mientras avanzaba',
          ],
          targetNumbers: 'Mis números objetivo:',
          targetNumbersFormat: 'Fila 1: ___, Fila 2: ___, Fila 3: ___',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          exampleTargetPlan: 'Plan de objetivo de ejemplo:',
          row1: 'Fila 1 objetivo: 6 → casillas válidas: 4+2, 8-2, 3+3, etc.',
          row2: 'Fila 2 objetivo: 8 → casillas válidas: 6+2, 9-1, 5+3, etc.',
          row3: 'Fila 3 objetivo: 10 → casillas válidas: 7+3, 12-2, 5+5, etc.',
          remember: '💡 Recuerda: ¡Cualquier camino que siga los objetivos de las filas es correcto! Elige tus propios números objetivo y encuentra un camino válido de S a F.',
        },
      },
    },
    ar: {
      'math-maze': {
        title: 'مغامرة متاهة الرياضيات',
        description: 'ابدأ من S ووصل إلى F. تحرك لأعلى/لأسفل/يسار/يمين فقط على المربعات التي تساوي معادلتها الهدف الموضح في ذلك الصف. ضع دائرة حول مسارك!',
        learningObjectives: [
          'حل معادلات الجمع والطرح',
          'التنقل عبر متاهة باستخدام مهارات الرياضيات',
          'تطبيق استراتيجيات حل المشكلات',
          'ممارسة الحساب الذهني والتعرف على الأرقام',
        ],
        parentTeacherTips: [
          'اختر رقم هدف لكل صف قبل البدء',
          'تحرك فقط على المربعات حيث المعادلة تساوي هدف الصف',
          'اعمل للخلف: ابدأ من F وابحث عن مسارات صحيحة',
          'شجع الطلاب على التحقق من حساباتهم أثناء التقدم',
          'التمديد: أنشئ متاهة رياضية خاصة بك بمعادلات مختلفة',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: 'ابحث عن مسار من S إلى F',
          step1: 'الخطوة 1:',
          step1Text: 'اختر أرقام هدف لكل صف (مثلاً، الصف 1 = 6، الصف 2 = 8، الصف 3 = 10)',
          step2: 'الخطوة 2:',
          step2Text: 'ابحث عن مربعات في الصف 1 تساوي 6: 4+2=6، 8-2=6، إلخ.',
          step3: 'الخطوة 3:',
          step3Text: 'انتقل إلى الصف 2 وابحث عن مربعات تساوي 8: 6+2=8، 9-1=8، إلخ.',
          step4: 'الخطوة 4:',
          step4Text: 'تابع إلى الصف 3 وابحث عن مربعات تساوي 10: 7+3=10، 12-2=10، إلخ.',
          step5: 'الخطوة 5:',
          step5Text: 'ارسم مسارك من S إلى F متبعاً المربعات الصحيحة',
          tip: '💡 نصيحة: تحقق من كل معادلة قبل الانتقال إلى ذلك المربع!',
        },
        howToPlay: {
          title: 'كيفية اللعب',
          step1: 'اختر رقم هدف لكل صف (مثلاً، الصف 1 = 6).',
          step2: 'خطو فقط على المعادلات التي تساوي هدف ذلك الصف.',
          step3: 'ارسم مسارك من S إلى F بدون حركات قطرية.',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'هل يمكنك العثور على مسار مختلف باستخدام أرقام هدف مختلفة؟',
            'جرب استخدام معادلات الجمع فقط (بدون طرح)',
            'أنشئ متاهة رياضية خاصة بك بـ 3 صفوف و 5 أعمدة',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني حل معادلات الجمع والطرح',
            'وجدت مساراً صحيحاً من S إلى F',
            'تحققت من حساباتي أثناء التقدم',
          ],
          targetNumbers: 'أرقام الهدف الخاصة بي:',
          targetNumbersFormat: 'الصف 1: ___، الصف 2: ___، الصف 3: ___',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          exampleTargetPlan: 'خطة الهدف المثال:',
          row1: 'هدف الصف 1: 6 → مربعات صحيحة: 4+2، 8-2، 3+3، إلخ.',
          row2: 'هدف الصف 2: 8 → مربعات صحيحة: 6+2، 9-1، 5+3، إلخ.',
          row3: 'هدف الصف 3: 10 → مربعات صحيحة: 7+3، 12-2، 5+5، إلخ.',
          remember: '💡 تذكر: أي مسار يتبع أهداف الصفوف صحيح! اختر أرقام الهدف الخاصة بك وابحث عن مسار صحيح من S إلى F.',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = mathMazeKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['math-maze']) {
        worksheets['math-maze'] = keys['math-maze']
      }
    }
  }
}

// Ensure number-tracing-1-20 worksheet keys are present
const ensureNumberTracing120Keys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const numberTracingKeys = {
    en: {
      'number-tracing-1-20': {
        title: 'Trace Numbers 1–20',
        description: 'Start‑point arrows included. Say each number while tracing; then color one object for each number.',
        learningObjectives: [
          'Recognize and write numbers 1–20',
          'Practice fine motor skills (tracing)',
          'Follow directional arrows',
          'Build number recognition and formation',
        ],
        parentTeacherTips: [
          'Start at the red dot and follow the arrow',
          'Say the number name while tracing',
          'Encourage proper pencil grip',
          'Color one object for each number after tracing',
          'Extension: Practice writing numbers without tracing lines',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          number: 'Number:',
          numberValue: '15',
          step1: 'Step 1:',
          step1Text: 'Find the red dot (start point)',
          step2: 'Step 2:',
          step2Text: 'Follow the arrow direction',
          step3: 'Step 3:',
          step3Text: 'Trace along the dashed line',
          step4: 'Step 4:',
          step4Text: 'Say "fifteen" while tracing',
          answer: 'Answer:',
          answerText: 'Trace the number 15 following the dashed line, starting at the red dot',
          tip: '💡 Tip: Always start at the red dot and follow the arrow. Say the number name as you trace!',
        },
        challenge: {
          title: '🌟 More Fun (Optional):',
          items: [
            'Try writing the numbers 1–20 without tracing lines',
            'Count objects around you: How many can you find of each number?',
            'Draw your own numbers and trace them!',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can recognize numbers 1–20',
            'I can trace numbers following the lines',
            'I can say the number names',
          ],
          score: 'My score:',
          scoreFormat: '___ / 20',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          instruction: 'Trace each number following the dashed lines. Start at the red dot and follow the arrow direction.',
          numbersToTrace: 'Numbers to trace:',
          numbersList: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
          remember: '💡 Remember: Always start at the red dot, follow the arrow, and say the number name as you trace!',
        },
      },
    },
    es: {
      'number-tracing-1-20': {
        title: 'Trazar Números 1–20',
        description: 'Flechas de punto de inicio incluidas. Di cada número mientras trazas; luego colorea un objeto por cada número.',
        learningObjectives: [
          'Reconocer y escribir números del 1 al 20',
          'Practicar habilidades motoras finas (trazado)',
          'Seguir flechas direccionales',
          'Desarrollar reconocimiento y formación de números',
        ],
        parentTeacherTips: [
          'Comienza en el punto rojo y sigue la flecha',
          'Di el nombre del número mientras trazas',
          'Anima a usar el agarre correcto del lápiz',
          'Colorea un objeto por cada número después de trazar',
          'Extensión: Practica escribiendo números sin líneas de trazado',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          number: 'Número:',
          numberValue: '15',
          step1: 'Paso 1:',
          step1Text: 'Encuentra el punto rojo (punto de inicio)',
          step2: 'Paso 2:',
          step2Text: 'Sigue la dirección de la flecha',
          step3: 'Paso 3:',
          step3Text: 'Traza a lo largo de la línea punteada',
          step4: 'Paso 4:',
          step4Text: 'Di "quince" mientras trazas',
          answer: 'Respuesta:',
          answerText: 'Traza el número 15 siguiendo la línea punteada, comenzando en el punto rojo',
          tip: '💡 Consejo: ¡Siempre comienza en el punto rojo y sigue la flecha. Di el nombre del número mientras trazas!',
        },
        challenge: {
          title: '🌟 Más Diversión (Opcional):',
          items: [
            'Intenta escribir los números del 1 al 20 sin líneas de trazado',
            'Cuenta objetos a tu alrededor: ¿Cuántos puedes encontrar de cada número?',
            '¡Dibuja tus propios números y trázalos!',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo reconocer números del 1 al 20',
            'Puedo trazar números siguiendo las líneas',
            'Puedo decir los nombres de los números',
          ],
          score: 'Mi puntuación:',
          scoreFormat: '___ / 20',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          instruction: 'Traza cada número siguiendo las líneas punteadas. Comienza en el punto rojo y sigue la dirección de la flecha.',
          numbersToTrace: 'Números a trazar:',
          numbersList: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
          remember: '💡 Recuerda: ¡Siempre comienza en el punto rojo, sigue la flecha y di el nombre del número mientras trazas!',
        },
      },
    },
    ar: {
      'number-tracing-1-20': {
        title: 'تتبع الأرقام 1–20',
        description: 'أسهم نقطة البداية متضمنة. قل كل رقم أثناء التتبع؛ ثم لون كائناً واحداً لكل رقم.',
        learningObjectives: [
          'التعرف على الأرقام من 1 إلى 20 وكتابتها',
          'ممارسة المهارات الحركية الدقيقة (التتبع)',
          'اتباع الأسهم الاتجاهية',
          'بناء التعرف على الأرقام وتكوينها',
        ],
        parentTeacherTips: [
          'ابدأ من النقطة الحمراء واتبع السهم',
          'قل اسم الرقم أثناء التتبع',
          'شجع على الإمساك الصحيح بالقلم',
          'لون كائناً واحداً لكل رقم بعد التتبع',
          'التمديد: تدرب على كتابة الأرقام بدون خطوط التتبع',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          number: 'الرقم:',
          numberValue: '15',
          step1: 'الخطوة 1:',
          step1Text: 'ابحث عن النقطة الحمراء (نقطة البداية)',
          step2: 'الخطوة 2:',
          step2Text: 'اتبع اتجاه السهم',
          step3: 'الخطوة 3:',
          step3Text: 'تتبع على طول الخط المتقطع',
          step4: 'الخطوة 4:',
          step4Text: 'قل "خمسة عشر" أثناء التتبع',
          answer: 'الإجابة:',
          answerText: 'تتبع الرقم 15 متبعاً الخط المتقطع، بدءاً من النقطة الحمراء',
          tip: '💡 نصيحة: ابدأ دائماً من النقطة الحمراء واتبع السهم. قل اسم الرقم أثناء التتبع!',
        },
        challenge: {
          title: '🌟 المزيد من المرح (اختياري):',
          items: [
            'حاول كتابة الأرقام من 1 إلى 20 بدون خطوط التتبع',
            'عد الأشياء من حولك: كم يمكنك العثور على كل رقم؟',
            'ارسم أرقامك الخاصة وتتبعها!',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني التعرف على الأرقام من 1 إلى 20',
            'يمكنني تتبع الأرقام متبعاً الخطوط',
            'يمكنني قول أسماء الأرقام',
          ],
          score: 'نقاطي:',
          scoreFormat: '___ / 20',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          instruction: 'تتبع كل رقم متبعاً الخطوط المتقطعة. ابدأ من النقطة الحمراء واتبع اتجاه السهم.',
          numbersToTrace: 'الأرقام للتتبع:',
          numbersList: '1، 2، 3، 4، 5، 6، 7، 8، 9، 10، 11، 12، 13، 14، 15، 16، 17، 18، 19، 20',
          remember: '💡 تذكر: ابدأ دائماً من النقطة الحمراء، اتبع السهم، وقل اسم الرقم أثناء التتبع!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = numberTracingKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['number-tracing-1-20']) {
        worksheets['number-tracing-1-20'] = keys['number-tracing-1-20']
      }
    }
  }
}

// Ensure addition-subtraction-0-10 worksheet keys are present
const ensureAdditionSubtraction010Keys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const additionSubtractionKeys = {
    en: {
      'addition-subtraction-0-10': {
        title: 'Addition & Subtraction 0–10',
        description: 'Use the number line if needed to solve each addition problem. Write the correct answer in the blank space provided.',
        learningObjectives: [
          'Add numbers within 10',
          'Subtract numbers within 10',
          'Use a number line to solve problems',
          'Build fact fluency for addition and subtraction',
        ],
        parentTeacherTips: [
          'Use the number line: start at the first number, then move right for addition, left for subtraction',
          'Encourage counting on for addition (e.g., 5 + 3: start at 5, count 3 more)',
          'For subtraction, count backwards (e.g., 8 - 3: start at 8, count back 3)',
          'Practice makes perfect - try to solve without the number line as you get better',
          'Extension: Try solving problems mentally without using the number line',
        ],
        workedExample: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '5 + 3 = ?',
          countAll: 'Count all the circles: 5 + 3 = 8',
          step1: 'Step 1: Count the blue circles: 5',
          step2: 'Step 2: Count the green circles: 3',
          step3: 'Step 3: Count them all together: 8',
          answer: 'Answer:',
          answerText: '5 + 3 = 8',
          tip: '💡 Tip: You can also use the number line below - start at 5, move 3 steps right!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          problem1: 'Can you solve 7 + 2 without using the number line? ___',
          problem2: 'What is 9 - 4? Try solving it mentally! ___',
          problem3: 'Create your own problem: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 How did you do?',
          question1: 'I can add numbers within 10',
          question2: 'I can subtract numbers within 10',
          question3: 'I can use the number line to help me',
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answerKey: {
          title: '✅ Answer Key',
          note: 'Note: Problems are randomly generated. Use the number line to solve each problem.',
          tip: '💡 Remember: For addition, move right on the number line. For subtraction, move left. Start at the first number!',
        },
      },
    },
    es: {
      'addition-subtraction-0-10': {
        title: 'Suma y Resta 0–10',
        description: 'Usa la recta numérica si es necesario para resolver cada problema de suma. Escribe la respuesta correcta en el espacio en blanco proporcionado.',
        learningObjectives: [
          'Sumar números hasta 10',
          'Restar números hasta 10',
          'Usar la recta numérica para resolver problemas',
          'Desarrollar fluidez en las operaciones de suma y resta',
        ],
        parentTeacherTips: [
          'Usa la recta numérica: comienza en el primer número, luego muévete a la derecha para sumar, a la izquierda para restar',
          'Anima a contar para sumar (ejemplo: 5 + 3: comienza en 5, cuenta 3 más)',
          'Para la resta, cuenta hacia atrás (ejemplo: 8 - 3: comienza en 8, cuenta 3 hacia atrás)',
          'La práctica hace la perfección - intenta resolver sin usar la recta numérica a medida que mejoras',
          'Extensión: Intenta resolver problemas mentalmente sin usar la recta numérica',
        ],
        workedExample: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '5 + 3 = ?',
          countAll: 'Cuenta todos los círculos: 5 + 3 = 8',
          step1: 'Paso 1: Cuenta los círculos azules: 5',
          step2: 'Paso 2: Cuenta los círculos verdes: 3',
          step3: 'Paso 3: Cuéntalos todos juntos: 8',
          answer: 'Respuesta:',
          answerText: '5 + 3 = 8',
          tip: '💡 Consejo: También puedes usar la recta numérica de abajo - ¡comienza en 5, muévete 3 pasos a la derecha!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          problem1: '¿Puedes resolver 7 + 2 sin usar la recta numérica? ___',
          problem2: '¿Cuánto es 9 - 4? ¡Intenta resolverlo mentalmente! ___',
          problem3: 'Crea tu propio problema: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          question1: 'Puedo sumar números hasta 10',
          question2: 'Puedo restar números hasta 10',
          question3: 'Puedo usar la recta numérica para ayudarme',
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          note: 'Nota: Los problemas se generan aleatoriamente. Usa la recta numérica para resolver cada problema.',
          tip: '💡 Recuerda: Para sumar, muévete a la derecha en la recta numérica. Para restar, muévete a la izquierda. ¡Comienza en el primer número!',
        },
      },
    },
    ar: {
      'addition-subtraction-0-10': {
        title: 'الجمع والطرح 0–10',
        description: 'استخدم خط الأعداد إذا لزم الأمر لحل كل مسألة جمع. اكتب الإجابة الصحيحة في المساحة المقدمة.',
        learningObjectives: [
          'جمع الأرقام حتى 10',
          'طرح الأرقام حتى 10',
          'استخدام خط الأعداد لحل المسائل',
          'بناء الطلاقة في حقائق الجمع والطرح',
        ],
        parentTeacherTips: [
          'استخدم خط الأعداد: ابدأ من الرقم الأول، ثم انتقل إلى اليمين للجمع، وإلى اليسار للطرح',
          'شجع على العد للأمام في الجمع (مثال: 5 + 3: ابدأ من 5، عد 3 أخرى)',
          'للطرح، عد للخلف (مثال: 8 - 3: ابدأ من 8، عد للخلف 3)',
          'الممارسة تجعل الكمال - حاول الحل دون استخدام خط الأعداد كلما تحسنت',
          'التوسع: جرب حل المسائل ذهنياً دون استخدام خط الأعداد',
        ],
        workedExample: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: '5 + 3 = ?',
          countAll: 'عد جميع الدوائر: 5 + 3 = 8',
          step1: 'الخطوة 1: عد الدوائر الزرقاء: 5',
          step2: 'الخطوة 2: عد الدوائر الخضراء: 3',
          step3: 'الخطوة 3: عدهم جميعاً معاً: 8',
          answer: 'الإجابة:',
          answerText: '5 + 3 = 8',
          tip: '💡 نصيحة: يمكنك أيضاً استخدام خط الأعداد أدناه - ابدأ من 5، انتقل 3 خطوات إلى اليمين!',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          problem1: 'هل يمكنك حل 7 + 2 دون استخدام خط الأعداد؟ ___',
          problem2: 'ما هو 9 - 4؟ جرب حله ذهنياً! ___',
          problem3: 'أنشئ مسألتك الخاصة: ___ + ___ = ?',
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          question1: 'يمكنني جمع الأرقام حتى 10',
          question2: 'يمكنني طرح الأرقام حتى 10',
          question3: 'يمكنني استخدام خط الأعداد لمساعدتي',
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          note: 'ملاحظة: يتم إنشاء المسائل بشكل عشوائي. استخدم خط الأعداد لحل كل مسألة.',
          tip: '💡 تذكر: للجمع، انتقل إلى اليمين على خط الأعداد. للطرح، انتقل إلى اليسار. ابدأ من الرقم الأول!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = additionSubtractionKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['addition-subtraction-0-10']) {
        worksheets['addition-subtraction-0-10'] = keys['addition-subtraction-0-10']
      }
    }
  }
}

// Ensure number-id-1-10 worksheet keys are present
const ensureNumberId110Keys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const numberIdKeys = {
    en: {
      'number-id-1-10': {
        title: 'Number Identification 1–10',
        description: 'Find and circle all the number {{number}}s.',
        instruction: 'Find and circle all the {{number}}s',
        objective1: 'Identify and recognize numbers 1-10',
        objective2: 'Find specific numbers in a group',
        objective3: 'Develop visual discrimination skills',
        objective4: 'Build number recognition and attention to detail',
        tip1: 'Encourage students to look carefully at each number',
        tip2: 'Help students recognize the shape of the target number',
        tip3: 'Practice saying the number name as they find it',
        tip4: 'Extension: Try finding numbers in different fonts or sizes',
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: 'Find and circle all the {{number}}s',
          step1: 'Step 1:',
          step1Text: 'Look at each number carefully',
          step2: 'Step 2:',
          step2Text: 'Find numbers that look like the target number',
          step3: 'Step 3:',
          step3Text: 'Circle each matching number you find',
          answer: 'Answer:',
          answerText: 'Circle all the matching numbers',
          tip: '💡 Tip: Look carefully at each number and match it to the target number!',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          '1': 'Can you find numbers around your house? Look for numbers on clocks, calendars, or books',
          '2': 'Write your own number grid and have someone find a specific number',
          '3': 'Try finding numbers in different styles or fonts',
        },
        selfCheck: {
          title: '📊 How did you do?',
          canIdentify: 'I can identify numbers 1-10',
          found: 'I found all the {{number}}s',
          circled: 'I circled {{count}} {{number}}s correctly',
          score: 'My score:',
          hardest: 'What was hardest?',
        },
        answer: {
          text: 'Circle all {{number}}s.',
          found: 'Found: {{count}} instances.',
          remember: '💡 Remember: Look carefully at each number and match it to the target number {{number}}. Circle all instances you find!',
        },
      },
    },
    es: {
      'number-id-1-10': {
        title: 'Identificación de Números 1–10',
        description: 'Encuentra y encierra en un círculo todos los números {{number}}.',
        instruction: 'Encuentra y encierra en un círculo todos los {{number}}',
        objective1: 'Identificar y reconocer números 1-10',
        objective2: 'Encontrar números específicos en un grupo',
        objective3: 'Desarrollar habilidades de discriminación visual',
        objective4: 'Desarrollar reconocimiento de números y atención al detalle',
        tip1: 'Anima a los estudiantes a mirar cuidadosamente cada número',
        tip2: 'Ayuda a los estudiantes a reconocer la forma del número objetivo',
        tip3: 'Practica diciendo el nombre del número mientras lo encuentran',
        tip4: 'Extensión: Intenta encontrar números en diferentes fuentes o tamaños',
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: 'Encuentra y encierra en un círculo todos los {{number}}',
          step1: 'Paso 1:',
          step1Text: 'Mira cuidadosamente cada número',
          step2: 'Paso 2:',
          step2Text: 'Encuentra números que se parezcan al número objetivo',
          step3: 'Paso 3:',
          step3Text: 'Encierra en un círculo cada número coincidente que encuentres',
          answer: 'Respuesta:',
          answerText: 'Encierra en un círculo todos los números coincidentes',
          tip: '💡 Consejo: ¡Mira cuidadosamente cada número y compáralo con el número objetivo!',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          '1': '¿Puedes encontrar números alrededor de tu casa? Busca números en relojes, calendarios o libros',
          '2': 'Escribe tu propia cuadrícula de números y pídele a alguien que encuentre un número específico',
          '3': 'Intenta encontrar números en diferentes estilos o fuentes',
        },
        selfCheck: {
          title: '📊 ¿Cómo lo hiciste?',
          canIdentify: 'Puedo identificar números 1-10',
          found: 'Encontré todos los {{number}}',
          circled: 'Encerré en un círculo {{count}} {{number}} correctamente',
          score: 'Mi puntuación:',
          hardest: '¿Qué fue lo más difícil?',
        },
        answer: {
          text: 'Encierra en un círculo todos los {{number}}.',
          found: 'Encontrados: {{count}} instancias.',
          remember: '💡 Recuerda: ¡Mira cuidadosamente cada número y compáralo con el número objetivo {{number}}. Encierra en un círculo todas las instancias que encuentres!',
        },
      },
    },
    ar: {
      'number-id-1-10': {
        title: 'تحديد الأرقام ١–١٠',
        description: 'ابحث وأحط دائرة حول جميع الأرقام {{number}}.',
        instruction: 'ابحث وأحط دائرة حول جميع الأرقام {{number}}',
        objective1: 'تحديد والتعرف على الأرقام ١-١٠',
        objective2: 'العثور على أرقام محددة في مجموعة',
        objective3: 'تطوير مهارات التمييز البصري',
        objective4: 'بناء التعرف على الأرقام والانتباه للتفاصيل',
        tip1: 'شجع الطلاب على النظر بعناية إلى كل رقم',
        tip2: 'ساعد الطلاب على التعرف على شكل الرقم المستهدف',
        tip3: 'تدرب على نطق اسم الرقم أثناء العثور عليه',
        tip4: 'امتداد: جرب العثور على أرقام بخطوط أو أحجام مختلفة',
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: 'ابحث وأحط دائرة حول جميع الأرقام {{number}}',
          step1: 'الخطوة ١:',
          step1Text: 'انظر بعناية إلى كل رقم',
          step2: 'الخطوة ٢:',
          step2Text: 'ابحث عن أرقام تشبه الرقم المستهدف',
          step3: 'الخطوة ٣:',
          step3Text: 'أحط دائرة حول كل رقم مطابق تجده',
          answer: 'الإجابة:',
          answerText: 'أحط دائرة حول جميع الأرقام المطابقة',
          tip: '💡 نصيحة: انظر بعناية إلى كل رقم وطابقه مع الرقم المستهدف!',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          '1': 'هل يمكنك العثور على أرقام حول منزلك؟ ابحث عن أرقام على الساعات أو التقويمات أو الكتب',
          '2': 'اكتب شبكة أرقام خاصة بك واطلب من شخص ما العثور على رقم محدد',
          '3': 'جرب العثور على أرقام بخطوط أو أنماط مختلفة',
        },
        selfCheck: {
          title: '📊 كيف كان أداؤك؟',
          canIdentify: 'يمكنني تحديد الأرقام ١-١٠',
          found: 'وجدت جميع الأرقام {{number}}',
          circled: 'أحطت دائرة حول {{count}} رقم {{number}} بشكل صحيح',
          score: 'نقاطي:',
          hardest: 'ما كان الأصعب؟',
        },
        answer: {
          text: 'أحط دائرة حول جميع الأرقام {{number}}.',
          found: 'تم العثور على: {{count}} حالة.',
          remember: '💡 تذكر: انظر بعناية إلى كل رقم وطابقه مع الرقم المستهدف {{number}}. أحط دائرة حول جميع الحالات التي تجدها!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = numberIdKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['number-id-1-10']) {
        worksheets['number-id-1-10'] = keys['number-id-1-10']
      }
    }
  }
}

// Ensure times-table worksheet keys are present
const ensureTimesTableWorksheetKeys = () => {
  // Define the keys directly to prevent tree-shaking - hardcode the full structure
  const timesTableKeys = {
    en: {
      'times-table-horizontal-1-5': {
        title: 'Horizontal Times Table (1-5)',
        description: 'Practice times tables 1-5 in horizontal format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice.',
        learningObjectives: [
          'Memorize multiplication facts for numbers 1-5',
          'Practice multiplication in horizontal format',
          'Build speed and accuracy with basic facts',
        ],
        parentTeacherTips: [
          'Start with easier facts (1s, 2s) and work up to 5s',
          'Use skip counting to help: 3 × 4 means count by 3s four times',
          'Practice daily for 5-10 minutes for best results',
          'Extension: Time yourself and try to beat your record!',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '3 × 4 = ?',
          method1: 'Method 1 (Skip Counting):',
          method1Text: 'Count by 3s four times: 3, 6, 9, 12',
          method2: 'Method 2 (Repeated Addition):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Method 3 (Visual):',
          method3Text: '3 groups of 4 objects = 12 objects',
          answer: 'Answer:',
          answerText: '12',
          tip: '💡 Tip: You can also think of it as 4 × 3 = 12 (order doesn\'t matter!)',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Create your own multiplication problem: ___ × ___ = ?',
            'Solve: 5 × 5 = ? (the biggest fact in this worksheet!)',
            'Write all the facts that equal 12: ___ × ___ = 12',
            'Time yourself: Can you complete all {count} problems in under 2 minutes?',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can multiply numbers 1-5 easily',
            'I need more practice with some facts',
            'I can say the answers quickly (fluency)',
          ],
          score: 'My score:',
          timeTaken: 'Time taken:',
          minutes: 'minutes',
          factsToPractice: 'Facts I want to practice more:',
        },
        answerKey: {
          title: '✅ Answer Key',
          studyTip: '💡 Study Tip:',
          studyTipText: 'Practice saying these facts out loud daily. Try to answer faster each time!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'Vertical Times Table (1-5)',
        description: 'Practice times tables 1-5 in vertical format. Write the answer in each blank. Build confidence with simple, stress-free multiplication practice.',
        learningObjectives: [
          'Memorize multiplication facts for numbers 1-5',
          'Practice multiplication in vertical format',
          'Build speed and accuracy with basic facts',
        ],
        parentTeacherTips: [
          'Start with easier facts (1s, 2s) and work up to 5s',
          'Use skip counting to help: 3 × 4 means count by 3s four times',
          'Practice daily for 5-10 minutes for best results',
          'Extension: Time yourself and try to beat your record!',
        ],
        example: {
          title: '📚 Example - Let\'s solve this together:',
          problem: 'Problem:',
          problemText: '3 × 4 = ?',
          method1: 'Method 1 (Skip Counting):',
          method1Text: 'Count by 3s four times: 3, 6, 9, 12',
          method2: 'Method 2 (Repeated Addition):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Method 3 (Visual):',
          method3Text: '3 groups of 4 objects = 12 objects',
          answer: 'Answer:',
          answerText: '12',
          tip: '💡 Tip: You can also think of it as 4 × 3 = 12 (order doesn\'t matter!)',
        },
        challenge: {
          title: '🌟 Challenge Yourself (Optional):',
          items: [
            'Create your own multiplication problem: ___ × ___ = ?',
            'Solve: 5 × 5 = ? (the biggest fact in this worksheet!)',
            'Write all the facts that equal 12: ___ × ___ = 12',
            'Time yourself: Can you complete all {count} problems in under 2 minutes?',
          ],
        },
        selfAssessment: {
          title: '📊 How did you do?',
          items: [
            'I can multiply numbers 1-5 easily',
            'I need more practice with some facts',
            'I can say the answers quickly (fluency)',
          ],
          score: 'My score:',
          timeTaken: 'Time taken:',
          minutes: 'minutes',
          factsToPractice: 'Facts I want to practice more:',
        },
        answerKey: {
          title: '✅ Answer Key',
          studyTip: '💡 Study Tip:',
          studyTipText: 'Practice saying these facts out loud daily. Try to answer faster each time!',
        },
      },
    },
    es: {
      'times-table-horizontal-1-5': {
        title: 'Tabla de Multiplicar Horizontal (1-5)',
        description: 'Practica las tablas de multiplicar del 1 al 5 en formato horizontal. Escribe la respuesta en cada espacio en blanco. Desarrolla confianza con práctica de multiplicación simple y sin estrés.',
        learningObjectives: [
          'Memorizar las tablas de multiplicar para los números 1-5',
          'Practicar la multiplicación en formato horizontal',
          'Desarrollar velocidad y precisión con operaciones básicas',
        ],
        parentTeacherTips: [
          'Comienza con operaciones más fáciles (1s, 2s) y avanza hasta 5s',
          'Usa el conteo saltado para ayudar: 3 × 4 significa contar de 3 en 3 cuatro veces',
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Extensión: ¡Cronométrate e intenta superar tu récord!',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '3 × 4 = ?',
          method1: 'Método 1 (Conteo Saltado):',
          method1Text: 'Cuenta de 3 en 3 cuatro veces: 3, 6, 9, 12',
          method2: 'Método 2 (Suma Repetida):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Método 3 (Visual):',
          method3Text: '3 grupos de 4 objetos = 12 objetos',
          answer: 'Respuesta:',
          answerText: '12',
          tip: '💡 Consejo: ¡También puedes pensarlo como 4 × 3 = 12 (el orden no importa!)',
        },
        challenge: {
          title: '🌟 Desafíate (Opcional):',
          items: [
            'Crea tu propio problema de multiplicación: ___ × ___ = ?',
            'Resuelve: 5 × 5 = ? (¡la operación más grande en esta hoja de trabajo!)',
            'Escribe todas las operaciones que igualan 12: ___ × ___ = 12',
            'Cronométrate: ¿Puedes completar los {count} problemas en menos de 2 minutos?',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo multiplicar números del 1 al 5 fácilmente',
            'Necesito más práctica con algunas operaciones',
            'Puedo decir las respuestas rápidamente (fluidez)',
          ],
          score: 'Mi puntuación:',
          timeTaken: 'Tiempo tomado:',
          minutes: 'minutos',
          factsToPractice: 'Operaciones que quiero practicar más:',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          studyTip: '💡 Consejo de Estudio:',
          studyTipText: '¡Practica diciendo estas operaciones en voz alta diariamente. Intenta responder más rápido cada vez!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'Tabla de Multiplicar Vertical (1-5)',
        description: 'Practica las tablas de multiplicar 1-5 en formato vertical. Escribe la respuesta en cada espacio en blanco. Desarrolla confianza con práctica de multiplicación simple y sin estrés.',
        learningObjectives: [
          'Memorizar las operaciones de multiplicación para los números 1-5',
          'Practicar multiplicación en formato vertical',
          'Desarrollar velocidad y precisión con operaciones básicas',
        ],
        parentTeacherTips: [
          'Comienza con operaciones más fáciles (1s, 2s) y avanza hasta 5s',
          'Usa el conteo saltado para ayudar: 3 × 4 significa contar de 3 en 3 cuatro veces',
          'Practica diariamente durante 5-10 minutos para mejores resultados',
          'Extensión: ¡Cronométrate e intenta superar tu récord!',
        ],
        example: {
          title: '📚 Ejemplo - Resolvamos esto juntos:',
          problem: 'Problema:',
          problemText: '3 × 4 = ?',
          method1: 'Método 1 (Conteo Saltado):',
          method1Text: 'Cuenta de 3 en 3 cuatro veces: 3, 6, 9, 12',
          method2: 'Método 2 (Suma Repetida):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'Método 3 (Visual):',
          method3Text: '3 grupos de 4 objetos = 12 objetos',
          answer: 'Respuesta:',
          answerText: '12',
          tip: '💡 Consejo: También puedes pensarlo como 4 × 3 = 12 (¡el orden no importa!)',
        },
        challenge: {
          title: '🌟 Desafíate a Ti Mismo (Opcional):',
          items: [
            'Crea tu propio problema de multiplicación: ___ × ___ = ?',
            'Resuelve: 5 × 5 = ? (¡la operación más grande en esta hoja de trabajo!)',
            'Escribe todas las operaciones que igualan 12: ___ × ___ = 12',
            'Cronométrate: ¿Puedes completar los {count} problemas en menos de 2 minutos?',
          ],
        },
        selfAssessment: {
          title: '📊 ¿Cómo te fue?',
          items: [
            'Puedo multiplicar números 1-5 fácilmente',
            'Necesito más práctica con algunas operaciones',
            'Puedo decir las respuestas rápidamente (fluidez)',
          ],
          score: 'Mi puntuación:',
          timeTaken: 'Tiempo tomado:',
          minutes: 'minutos',
          factsToPractice: 'Operaciones que quiero practicar más:',
        },
        answerKey: {
          title: '✅ Clave de Respuestas',
          studyTip: '💡 Consejo de Estudio:',
          studyTipText: '¡Practica diciendo estas operaciones en voz alta diariamente. Intenta responder más rápido cada vez!',
        },
      },
    },
    ar: {
      'times-table-horizontal-1-5': {
        title: 'جدول الضرب الأفقي (1-5)',
        description: 'تدرب على جداول الضرب من 1 إلى 5 في التنسيق الأفقي. اكتب الإجابة في كل فراغ. بناء الثقة مع ممارسة الضرب البسيطة والخالية من الإجهاد.',
        learningObjectives: [
          'حفظ حقائق الضرب للأرقام 1-5',
          'ممارسة الضرب في التنسيق الأفقي',
          'بناء السرعة والدقة مع الحقائق الأساسية',
        ],
        parentTeacherTips: [
          'ابدأ بالحقائق الأسهل (1s، 2s) وتقدم حتى 5s',
          'استخدم العد المتخطي للمساعدة: 3 × 4 يعني العد بالثلاثات أربع مرات',
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'امتداد: قم بقياس وقتك وحاول تحطيم رقمك القياسي!',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المسألة:',
          problemText: '3 × 4 = ?',
          method1: 'الطريقة 1 (العد المتخطي):',
          method1Text: 'عد بالثلاثات أربع مرات: 3، 6، 9، 12',
          method2: 'الطريقة 2 (الجمع المتكرر):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'الطريقة 3 (البصري):',
          method3Text: '3 مجموعات من 4 أشياء = 12 شيئاً',
          answer: 'الإجابة:',
          answerText: '12',
          tip: '💡 نصيحة: يمكنك أيضاً التفكير فيها كـ 4 × 3 = 12 (الترتيب لا يهم!)',
        },
        challenge: {
          title: '🌟 تحدّ نفسك (اختياري):',
          items: [
            'أنشئ مسألة ضرب خاصة بك: ___ × ___ = ?',
            'حل: 5 × 5 = ? (أكبر حقيقة في هذه الورقة!)',
            'اكتب جميع الحقائق التي تساوي 12: ___ × ___ = 12',
            'قم بقياس وقتك: هل يمكنك إكمال جميع المسائل الـ {count} في أقل من دقيقتين؟',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني ضرب الأرقام 1-5 بسهولة',
            'أحتاج إلى مزيد من الممارسة مع بعض الحقائق',
            'يمكنني قول الإجابات بسرعة (الطلاقة)',
          ],
          score: 'نقاطي:',
          timeTaken: 'الوقت المستغرق:',
          minutes: 'دقائق',
          factsToPractice: 'الحقائق التي أريد ممارستها أكثر:',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          studyTip: '💡 نصيحة للدراسة:',
          studyTipText: 'تدرب على قول هذه الحقائق بصوت عالٍ يومياً. حاول الإجابة بشكل أسرع في كل مرة!',
        },
      },
      'times-table-vertical-1-5': {
        title: 'جدول الضرب العمودي (1-5)',
        description: 'تدرب على جداول الضرب 1-5 في التنسيق العمودي. اكتب الإجابة في كل فراغ. بناء الثقة مع ممارسة الضرب البسيطة والخالية من الإجهاد.',
        learningObjectives: [
          'حفظ حقائق الضرب للأرقام 1-5',
          'ممارسة الضرب في التنسيق العمودي',
          'بناء السرعة والدقة مع الحقائق الأساسية',
        ],
        parentTeacherTips: [
          'ابدأ بحقائق أسهل (1s، 2s) واعمل حتى 5s',
          'استخدم العد المتخطي للمساعدة: 3 × 4 يعني العد بالثلاثات أربع مرات',
          'تدرب يومياً لمدة 5-10 دقائق للحصول على أفضل النتائج',
          'التمديد: قم بتوقيت نفسك وحاول تحطيم رقمك القياسي!',
        ],
        example: {
          title: '📚 مثال - دعنا نحل هذا معاً:',
          problem: 'المشكلة:',
          problemText: '3 × 4 = ?',
          method1: 'الطريقة 1 (العد المتخطي):',
          method1Text: 'عد بالثلاثات أربع مرات: 3، 6، 9، 12',
          method2: 'الطريقة 2 (الجمع المتكرر):',
          method2Text: '3 + 3 + 3 + 3 = 12',
          method3: 'الطريقة 3 (البصري):',
          method3Text: '3 مجموعات من 4 أشياء = 12 شيئاً',
          answer: 'الإجابة:',
          answerText: '12',
          tip: '💡 نصيحة: يمكنك أيضاً التفكير في الأمر كـ 4 × 3 = 12 (الترتيب لا يهم!)',
        },
        challenge: {
          title: '🌟 تحدى نفسك (اختياري):',
          items: [
            'أنشئ مشكلة الضرب الخاصة بك: ___ × ___ = ?',
            'حل: 5 × 5 = ? (أكبر حقيقة في ورقة العمل هذه!)',
            'اكتب جميع الحقائق التي تساوي 12: ___ × ___ = 12',
            'قم بتوقيت نفسك: هل يمكنك إكمال جميع المشاكل الـ 15 في أقل من دقيقتين؟',
          ],
        },
        selfAssessment: {
          title: '📊 كيف كان أداؤك؟',
          items: [
            'يمكنني ضرب الأرقام 1-5 بسهولة',
            'أحتاج إلى مزيد من الممارسة مع بعض الحقائق',
            'يمكنني قول الإجابات بسرعة (الطلاقة)',
          ],
          score: 'نقاطي:',
          timeTaken: 'الوقت المستغرق:',
          minutes: 'دقائق',
          factsToPractice: 'الحقائق التي أريد ممارستها أكثر:',
        },
        answerKey: {
          title: '✅ مفتاح الإجابات',
          studyTip: '💡 نصيحة للدراسة:',
          studyTipText: 'تدرب على قول هذه الحقائق بصوت عالٍ يومياً. حاول الإجابة بشكل أسرع في كل مرة!',
        },
      },
    },
  }

  // Merge into translations object if keys are missing
  for (const lang of ['en', 'es', 'ar'] as const) {
    const langTranslations = (translations as any)[lang]
    if (langTranslations && langTranslations.worksheets) {
      const worksheets = langTranslations.worksheets
      const keys = timesTableKeys[lang]
      
      // Always merge to ensure complete translations (even if key exists, it might be incomplete due to tree-shaking)
      if (keys['times-table-horizontal-1-5']) {
        worksheets['times-table-horizontal-1-5'] = keys['times-table-horizontal-1-5']
      }
      if (keys['times-table-vertical-1-5']) {
        worksheets['times-table-vertical-1-5'] = keys['times-table-vertical-1-5']
      }
    }
  }
}

// Run the merge immediately
ensureWorksheetKeys()

// Helper function to get translation with fallback
// Returns string, array, or object depending on the translation value
export function getTranslation(language: Language, key: string): string | any {
  try {
    const keys = key.split('.')
    
    // For interactive translations, try the exported interactiveTranslations first (prevents tree-shaking issues)
    if (keys[0] === 'interactive' && keys.length >= 2) {
      // Try exported interactiveTranslations first
      if (interactiveTranslations && interactiveTranslations[language]) {
        const interactiveKey = keys[1]
        if (interactiveKey && interactiveKey in interactiveTranslations[language]) {
          let value: any = (interactiveTranslations[language] as any)[interactiveKey]
          // Navigate through remaining keys (starting from index 2)
          for (let j = 2; j < keys.length; j++) {
            if (value === null || value === undefined) break
            value = value[keys[j]]
          }
          if (value !== null && value !== undefined) {
            if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
              return value
            }
            if (typeof value === 'string') {
              return value
            }
          }
        }
      }
      // Fallback: try translations[language].interactive
      if (translations[language] && translations[language].interactive) {
        const interactiveKey = keys[1]
        if (interactiveKey && interactiveKey in translations[language].interactive) {
          let value: any = (translations[language].interactive as any)[interactiveKey]
          // Navigate through remaining keys (starting from index 2)
          for (let j = 2; j < keys.length; j++) {
            if (value === null || value === undefined) break
            value = value[keys[j]]
          }
          if (value !== null && value !== undefined) {
            if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
              return value
            }
            if (typeof value === 'string') {
              return value
            }
          }
        }
      }
    }
    
    let value: any = translations[language]
    
    // Debug logging for interactive translations
    if (typeof window !== 'undefined' && keys[0] === 'interactive' && process.env.NODE_ENV === 'development') {
      const debugKey = `translation-debug-interactive-${language}-${key}`
      if (!(window as any)[debugKey]) {
        (window as any)[debugKey] = true
        const langObj = translations[language]
        const interactiveObj = langObj && typeof langObj === 'object' ? langObj.interactive : undefined
        console.log(`[getTranslation] Looking for interactive key: ${key}, language: ${language}`, {
          hasInteractive: !!interactiveObj,
          hasExportedInteractive: !!interactiveTranslations[language],
          interactiveKeys: interactiveObj && typeof interactiveObj === 'object' ? Object.keys(interactiveObj).slice(0, 10) : 'N/A',
          exportedKeys: interactiveTranslations[language] && typeof interactiveTranslations[language] === 'object' ? Object.keys(interactiveTranslations[language]).slice(0, 10) : 'N/A',
          targetKey: keys.length > 1 ? keys[1] : 'N/A',
          hasTargetKey: interactiveObj && typeof interactiveObj === 'object' && keys.length > 1 ? keys[1] in interactiveObj : false,
          hasTargetInExported: interactiveTranslations[language] && typeof interactiveTranslations[language] === 'object' && keys.length > 1 ? keys[1] in interactiveTranslations[language] : false
        })
      }
    }
    
    // Debug logging removed - translations are working correctly
    if (false && typeof window !== 'undefined' && keys[0] === 'worksheets' && process.env.NODE_ENV === 'development') {
      const debugKey = `translation-debug-${language}`
      if (!(window as any)[debugKey]) {
        (window as any)[debugKey] = true
        const langObj = translations[language]
        const worksheetsObj = langObj && typeof langObj === 'object' ? langObj.worksheets : undefined
        const objectNamesObj = worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.objectNames : undefined
        
        console.log(`[getTranslation] Top-level translations structure for ${language}:`, {
          hasTranslations: !!translations,
          hasLanguage: !!langObj,
          languageType: typeof langObj,
          languageKeys: langObj && typeof langObj === 'object' ? Object.keys(langObj).slice(0, 20) : 'N/A',
          hasWorksheets: langObj && typeof langObj === 'object' ? 'worksheets' in langObj : false,
          worksheetsType: typeof worksheetsObj,
          worksheetsValue: worksheetsObj,
          worksheetsIsUndefined: worksheetsObj === undefined,
          worksheetsIsNull: worksheetsObj === null,
          worksheetsKeys: worksheetsObj && typeof worksheetsObj === 'object' ? Object.keys(worksheetsObj).slice(0, 30) : 'N/A',
          // Direct access to nested objects
          hasObjectNames: worksheetsObj && typeof worksheetsObj === 'object' ? 'objectNames' in worksheetsObj : false,
          objectNamesType: typeof objectNamesObj,
          objectNamesValue: objectNamesObj,
          objectNamesIsUndefined: objectNamesObj === undefined,
          objectNamesKeys: objectNamesObj && typeof objectNamesObj === 'object' ? Object.keys(objectNamesObj).slice(0, 10) : 'N/A',
          // Try direct access to specific keys
          directCountObjects: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countObjectsAndWriteNumber : 'N/A',
          directCountThe: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.countThe : 'N/A',
          directNumberLabel: worksheetsObj && typeof worksheetsObj === 'object' ? worksheetsObj.numberLabel : 'N/A',
          directObjectNamesBalls: objectNamesObj && typeof objectNamesObj === 'object' ? objectNamesObj.balls : 'N/A'
        })
      }
    }
    
    // Debug: Log if translations object is missing or malformed
    if (!value) {
      console.warn(`[getTranslation] Translation object not found for language: ${language}`, {
        availableLanguages: Object.keys(translations),
        translationsObject: translations,
        translationsType: typeof translations,
        hasEn: !!translations.en,
        hasAr: !!translations.ar,
        hasEs: !!translations.es,
        enType: typeof translations.en,
        arType: typeof translations.ar
      })
      // Fallback to English
      value = translations.en
      if (!value) {
        console.error(`[getTranslation] Even English fallback is missing!`, { translations })
        return key
      }
    }
    
    // Debug logging removed - translations are working correctly
    
    // Navigate through nested keys
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      // Debug: Log when looking for interactive translations
      if (typeof window !== 'undefined' && keys[0] === 'interactive' && process.env.NODE_ENV === 'development') {
        const debugKey = `translation-debug-interactive-nav-${language}-${key}-${i}`
        if (!(window as any)[debugKey]) {
          (window as any)[debugKey] = true
          console.log(`[getTranslation] Navigation step ${i}: key=${k}, value type=${typeof value}, isObject=${value && typeof value === 'object'}, hasKey=${value && typeof value === 'object' ? k in value : false}`, {
            availableKeys: value && typeof value === 'object' ? Object.keys(value).slice(0, 10) : 'N/A',
            currentValue: value
          })
        }
      }
      // Debug: Log when looking for number-id-1-10 translations
      if (typeof window !== 'undefined' && key.includes('number-id-1-10')) {
        const debugKey = `translation-debug-${key}-${language}-${i}`
        if (!(window as any)[debugKey]) {
          (window as any)[debugKey] = true
          const worksheetsObj = i === 0 ? value : (value && typeof value === 'object' ? value : undefined)
          if (i === 1) {
            console.log(`[getTranslation] Looking for key: ${key}, language: ${language}, at key[${i}]: ${k}, value type: ${typeof value}, hasKey: ${value && typeof value === 'object' ? k in value : false}, availableKeys:`, value && typeof value === 'object' ? Object.keys(value).filter(k => k.includes('number') || k.includes('id')).slice(0, 15) : 'N/A')
          }
          if (i === 2 && value && typeof value === 'object') {
            console.log(`[getTranslation] At final key: ${k}, value:`, value[k], 'type:', typeof value[k])
          }
        }
      }
      if (value === null || value === undefined) {
        // If we're looking for interactive translations and they're missing, try the exported interactiveTranslations
        if (keys[0] === 'interactive' && i >= 1 && interactiveTranslations[language]) {
          const interactiveKey = keys[1]
          if (interactiveKey && interactiveTranslations[language] && interactiveKey in interactiveTranslations[language]) {
            const interactiveValue = (interactiveTranslations[language] as any)[interactiveKey]
            if (interactiveValue !== undefined) {
              if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                console.log(`[getTranslation] Using interactiveTranslations fallback for: ${key}, language: ${language}, interactiveKey: ${interactiveKey}`)
              }
              // Continue navigation from the interactive value
              value = interactiveValue
              // Continue with remaining keys if any (starting from index 2, since we already handled 0 and 1)
              for (let j = 2; j < keys.length; j++) {
                if (value === null || value === undefined) break
                value = value[keys[j]]
              }
              if (value !== null && value !== undefined) {
                if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
                  return value
                }
                if (typeof value === 'string') {
                  return value
                }
              }
            }
          }
        }
        // If we're looking for interactive worksheet keys and they're missing,
        // try to get them from the exported interactiveWorksheetKeys
        // Only check interactiveWorksheetKeys for actual interactive keys (not regular worksheet keys)
        const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
        if (keys[0] === 'worksheets' && i >= 1) {
          const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
          // Only try interactiveWorksheetKeys fallback if this is actually an interactive key
          if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys[language] && interactiveKey in interactiveWorksheetKeys[language]) {
            const interactiveValue = (interactiveWorksheetKeys[language] as any)[interactiveKey]
            if (interactiveValue !== undefined) {
              if (typeof window !== 'undefined') {
                console.log(`[getTranslation] Using interactiveWorksheetKeys fallback for: ${key}, language: ${language}, interactiveKey: ${interactiveKey}`)
              }
              // Continue navigation from the interactive value
              value = interactiveValue
              // Continue with remaining keys if any (starting from index 2, since we already handled 0 and 1)
              for (let j = 2; j < keys.length; j++) {
                if (value === null || value === undefined) break
                value = value[keys[j]]
              }
              if (value !== null && value !== undefined) {
                if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
                  return value
                }
                if (typeof value === 'string') {
                  return value
                }
              }
            } else if (typeof window !== 'undefined') {
              console.warn(`[getTranslation] interactiveWorksheetKeys[${language}][${interactiveKey}] is undefined`)
            }
          }
          // Don't log warnings for non-interactive keys - they're just regular worksheet keys
        }
        
        // Debug logging removed - translations are working correctly
        break
      }
      value = value[k]
    }
    
    // If we got a valid value (string, array, or object), return it
    if (value !== null && value !== undefined) {
      // Return arrays and objects as-is
      if (Array.isArray(value) || (typeof value === 'object' && typeof value !== 'string')) {
        return value
      }
      // Return strings (including empty strings) - but check if it's actually a translation
      if (typeof value === 'string') {
        // If the value is the same as the key, it might be a missing translation
        // But we still return it since it's a valid string
        return value
      }
    }
    
    // Fallback to English if translation missing
    if (language !== 'en') {
      let fallbackValue: any = translations.en
      if (fallbackValue) {
        for (const k of keys) {
          if (fallbackValue === null || fallbackValue === undefined) break
          fallbackValue = fallbackValue[k]
        }
        if (fallbackValue !== null && fallbackValue !== undefined) {
          // Return arrays and objects as-is
          if (Array.isArray(fallbackValue) || (typeof fallbackValue === 'object' && typeof fallbackValue !== 'string')) {
            return fallbackValue
          }
          // Return strings
          if (typeof fallbackValue === 'string') {
            return fallbackValue
          }
        }
      }
      // Also try interactiveWorksheetKeys fallback for English
      // Only check for actual interactive keys
      const INTERACTIVE_KEYS = ['countObjectsAndWriteNumber', 'countThe', 'numberLabel', 'objectNames', 'mathPuzzle', 'mathRace', 'reflection']
      if (keys[0] === 'worksheets' && keys.length >= 2) {
        const interactiveKey = keys[1] as keyof typeof interactiveWorksheetKeys.en
        if (interactiveKey && INTERACTIVE_KEYS.includes(interactiveKey) && interactiveWorksheetKeys.en && interactiveKey in interactiveWorksheetKeys.en) {
          const interactiveValue = (interactiveWorksheetKeys.en as any)[interactiveKey]
          if (interactiveValue !== undefined) {
            let englishValue = interactiveValue
            // Continue with remaining keys if any
            for (let j = 2; j < keys.length; j++) {
              if (englishValue === null || englishValue === undefined) break
              englishValue = englishValue[keys[j]]
            }
            if (englishValue !== null && englishValue !== undefined) {
              if (Array.isArray(englishValue) || (typeof englishValue === 'object' && typeof englishValue !== 'string')) {
                return englishValue
              }
              if (typeof englishValue === 'string') {
                return englishValue
              }
            }
          }
        }
      }
    }
    
    // Final fallback: return the key itself (so it's visible if translation missing)
    // Only warn in development to avoid console spam
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
    }
    return key
  } catch (error) {
    // If anything goes wrong, just return the key
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn('Translation error for key:', key, 'language:', language, error)
    }
    return key
  }
}

// Check if language is RTL
export function isRTL(language: Language): boolean {
  return language === 'ar'
}

// Get all available languages
export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]
}
