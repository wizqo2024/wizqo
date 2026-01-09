/**
 * Complete SEO Mapping for All 254 Worksheets
 * 
 * This file provides SEO-friendly URLs, titles, meta descriptions, keywords,
 * and content for each worksheet to enable proper indexing.
 * 
 * SAFE: Does not affect existing category pages or /print routes
 */

export interface WorksheetSEO {
  docId: string
  slug: string
  title: string
  metaDescription: string
  keywords: string
  h1: string
  intro: string
  grade: string[]
  category: string[]
  section: string
  learningObjectives: string[]
  relatedDocIds: string[]
}

/**
 * Manual content overrides for specific worksheets to ensure uniqueness.
 * This helps resolve "Thin Content" and "Crawled - currently not indexed" issues.
 */
const WORKSHEET_MANUAL_CONTENT: Record<string, Partial<WorksheetSEO>> = {
  'sentence-building': {
    title: 'Sentence Building Worksheet - Creative Writing Practice | Wizqo',
    metaDescription: 'Boost early literacy with our Sentence Building worksheet. Students practice structure and grammar by arranging words into logical, descriptive sentences. PDF with answer key.',
    learningObjectives: ['Understand basic sentence structure', 'Identify subject and verb placement', 'Build descriptive writing skills'],
    intro: 'Help your students master English grammar and sentence structure with this engaging Sentence Building worksheet. By organizing scrambled words into meaningful sentences, children develop a natural feel for language flow, punctuation, and descriptive writing. This printable activity is perfect for Grade 1 and 2 literacy centers, providing a strong foundation for future creative writing.'
  },
  'doubles-facts': {
    title: 'Doubles Addition Facts Practice - Math Skills Mastery | Wizqo',
    metaDescription: 'Improve addition speed with our Doubles Facts worksheet. Mastering 1+1 through 10+10 builds mental math foundations for multi-digit addition. Free PDF download.',
    learningObjectives: ['Recall doubles addition facts instantly', 'Connect doubles to near-doubles', 'Improve mental math calculation speed'],
    intro: 'Mastering doubles addition facts is a critical milestone for young mathematicians. This worksheet focuses specifically on the "doubles" strategy (like 6+6 and 8+8), which serves as a powerful mental math anchor for more complex addition and subtraction problems. By developing instant recall of these pairs, students gain the confidence needed to tackle "near-doubles" and multi-digit operations with ease.'
  },
  'maze-focus': {
    title: 'Math Maze Focus - Logical Thinking & Multiplication | Wizqo',
    metaDescription: 'Keep kids engaged with our Math Maze Focus worksheet. Combine path-finding puzzles with multiplication practice to build concentration and math fluency. PDF included.',
    learningObjectives: ['Strengthen visual attention and focus', 'Practice multiplication facts through engagement', 'Build logical path-finding skills'],
    intro: 'Turn multiplication practice into a fun adventure! The Math Maze Focus worksheet combines specialized path-finding challenges with multiplication problems to keep students engaged while they learn. Unlike standard drills, this "focus" maze requires children to pay close attention to numerical patterns and logical routes, strengthening both their concentration and their multiplication fluency in a stress-free, printable format.'
  },
  'sub-2digit-100': {
    title: 'Subtracting 2-Digit Numbers within 100 - Multi-Step Practice | Wizqo',
    metaDescription: 'Download our 2-digit subtraction worksheet with regrouping focus. Practice subtracting numbers within 100 to build accuracy and place value understanding. Free PDF.',
    learningObjectives: ['Master 2-digit subtraction with regrouping', 'Understand place value in multi-digit operations', 'Verify results using addition'],
    intro: 'Subtraction within 100 is a core 2nd and 3rd-grade skill, and our Subtracting 2-Digit Numbers worksheet is designed to make it stick. This practice sheet focuses on both regrouping (borrowing) and place value alignment, helping students visualize how tens and ones interact during subtraction. With a clean layout and clear instructions, this printable PDF provides the rigorous practice needed for mathematical mastery.'
  },
  'times-table-confidence-6-12': {
    title: 'Times Table Confidence (6-12) - Advanced Multiplication Mastery | Wizqo',
    metaDescription: 'Focus on the "tough" multiplication facts from 6 to 12. Build confidence and accuracy with targeted practice sheets designed for Grade 3-5 math fluency.',
    learningObjectives: ['Master multiplication facts for numbers 6 through 12', 'Increase calculation speed for advanced math', 'Build confidence with challenging times tables'],
    intro: 'Break through the multiplication plateau! Many students find the 6-12 times tables to be the most challenging part of math class. Our Times Table Confidence worksheet is specifically designed to target these higher numbers, providing focused, repetitive practice that builds long-term memory. By mastering these "difficult" facts, students unlock their ability to handle long division and multi-step word problems with absolute confidence.'
  },
  'shapes-colors-sort': {
    title: 'Shapes and Colors Sorting - Early Geometry & Logic | Wizqo',
    metaDescription: 'Perfect for Pre-K and Kindergarten, this sorting worksheet helps kids identify and categorize 2D shapes by color and type. Free printable logic activity.',
    learningObjectives: ['Identify 2D shapes (Circle, Square, Triangle)', 'Categorize objects by multiple attributes', 'Strengthen logical reasoning and visual discrimination'],
    intro: 'Build a foundation for geometry and logic with our Shapes and Colors Sorting worksheet. This early learning activity encourages students to look beyond the surface and categorize items based on specific attributes like side count, corner type, and color. By sorting shapes into their correct groups, young learners develop critical visual discrimination skills that are essential for reading readiness and mathematical thinking.'
  },
  'reading-g1-lost-hat': {
    title: 'Reading Comprehension: The Lost Hat - Grade 1 Practice | Wizqo',
    metaDescription: 'Improve 1st grade reading skills with "The Lost Hat" passage. Includes comprehension questions to build inference and detail-finding skills. Download free PDF.',
    learningObjectives: ['Recall specific details from a short story', 'Identify the main character and setting', 'Practice basic inference skills'],
    intro: 'Engage young readers with "The Lost Hat," a charming short story designed specifically for 1st-grade reading comprehension. This worksheet presents a relatable narrative followed by targeted questions that encourage children to scan the text for details, identify characters, and draw simple conclusions. It is an excellent resource for building early fluency and a love for storytelling in the classroom or at home.'
  },
  'mult-arrays-2-5': {
    title: 'Multiplication Arrays (2-5) - Visual Math Practice | Wizqo',
    metaDescription: 'Master multiplication facts 2-5 with our Arrays worksheet. Use rows and columns to visualize multiplication concepts. Free printable PDF for grades 2-3.',
    learningObjectives: ['Connect arrays to multiplication equations', 'Identify rows and columns in a grid', 'Visualize multiplication facts 2-5'],
    intro: 'Visualization is a powerful tool for early multiplication. This Multiplications Arrays (2-5) worksheet helps students move beyond rote memorization by illustrating math problems as functional grids. By counting rows and columns, children develop a concrete understanding of what multiplication actually represents, making it easier to skip-count and solve basic equations with confidence.'
  },
  'patterns-rules': {
    title: 'Number Patterns and Rules - Logical Sequence Practice | Wizqo',
    metaDescription: 'Identify, extend, and describe number patterns with our Patterns and Rules worksheet. Practice finding the hidden rule in sequences. Perfect for grades 3-4 math.',
    learningObjectives: ['Identify arithmetic patterns in sequences', 'Use addition and subtraction to find pattern rules', 'Extend number sequences accurately'],
    intro: 'Developing a strong sense of patterns is the first step toward algebraic thinking. Our Number Patterns and Rules worksheet challenges students to become "math detectives" who find the hidden logic in numerical sequences. Whether the pattern involves adding five or doubling each step, this worksheet provides the perfect playground for building observation skills and mathematical reasoning.'
  },
  'ten-frames-1-10': {
    title: 'Ten-Frames (1-10) - Kindergarten Counting & Number Sense | Wizqo',
    metaDescription: 'Build strong number sense with our Ten-Frames 1-10 worksheet. Help early learners visualize numbers 1-10 using standard frames. Perfect for Pre-K and K.',
    learningObjectives: ['Recognize numbers 1-10 instantly on a ten-frame', 'Understand the "five-wise" and "pair-wise" structures', 'Build foundations for addition and place value'],
    intro: 'Ten-frames are one of the most effective tools for building "number sense" in early childhood. This Ten-Frames (1-10) worksheet helps Kindergarten students visualize how numbers are structured, showing them that "seven" is just a full row of five plus two more. This visual mapping is essential for future skills like "making ten" and understanding the base-ten system.'
  },
  'uppercase-lowercase-match': {
    title: 'Uppercase and Lowercase Letter Matching - Literacy Skills | Wizqo',
    metaDescription: 'Practice identifying alphabet pairs with our Letter Matching worksheet. Connect uppercase letters to their lowercase partners. Fun Pre-K and Kindergarten activity.',
    learningObjectives: ['Identify both uppercase and lowercase alphabet forms', 'Correctly pair big and small letters', 'Strengthen visual letter recognition'],
    intro: 'Mastery of the alphabet requires recognizing that every letter has two forms. This Uppercase and Lowercase Letter Matching worksheet provides a fun, low-stress way for early readers to connect "A" with "a" and "B" with "b." By using visual lines to match these pairs, children build the foundational literacy skills needed for both reading and writing their first words.'
  },
  'number-patterns-200': {
    title: 'Number Patterns to 200 - Advanced Skip Counting | Wizqo',
    metaDescription: 'Practice skip counting and pattern identification up to 200. Extend number sequences and find the rule. Perfect for 2nd and 3rd grade math.',
    learningObjectives: ['Identify and extend patterns beyond 100', 'Practice skip counting by various intervals', 'Build numerical fluency with 3-digit numbers'],
    intro: 'Once students master patterns within 100, it\'s time to expand their horizons. Our Number Patterns to 200 worksheet takes pattern-finding to the next level, challenging learners to apply their logic to 3-digit numbers. This worksheet helps bridge the gap between basic counting and more complex arithmetic, ensuring students feel comfortable navigating the entire number line up to 200.'
  },
  'cvc-words': {
    title: 'CVC Word Building - Phonics and Reading Practice | Wizqo',
    metaDescription: 'Practice Consonant-Vowel-Consonant (CVC) words with our phonics worksheet. Perfect for early readers learning to blend sounds and spell simple words.',
    learningObjectives: ['Blend individual sounds into CVC words', 'Identify middle vowel sounds (a, e, i, o, u)', 'Practice spelling 3-letter words'],
    intro: 'CVC words—like cat, hen, and pig—are the building blocks of early reading. This CVC Word Building worksheet focuses on phonemic awareness, helping students identify the beginning, middle, and ending sounds in simple three-letter words. By practicing these foundational blends, children gain the decoding skills necessary to read full sentences with confidence.'
  },
  'number-id-1-10': {
    title: 'Kindergarten Number Recognition (1-20) - Math Readiness | Wizqo',
    metaDescription: 'Help your child identify and write numbers 1-20 with this fun recognition worksheet. Perfect for preschool and kindergarten math foundations.',
    learningObjectives: ['Correctly identify written numerals 1-20', 'Practice proper number formation', 'Match written numbers to counted quantities'],
    intro: 'Identifying numbers on sight is a vital first step in every child\'s mathematical journey. Our Kindergarten Number Recognition worksheet provides a variety of activities—from tracing to counting—designed to help children become familiar with the shapes and values of numbers 1 through 20. This printable PDF ensures that students have a rock-solid foundation for addition and subtraction.'
  },
  'mean-median-mode-range': {
    title: 'Mean, Median, Mode, and Range - Data Analysis Practice | Wizqo',
    metaDescription: 'Master basic statistics with our Data Analysis worksheet. Practice calculating mean, median, mode, and range for simple data sets. Perfect for grades 4-6.',
    learningObjectives: ['Calculate the average (mean) of a data set', 'Find the middle value (median) and most frequent (mode)', 'Determine the range of a set of numbers'],
    intro: 'Data analysis starts with understanding the "center" and "spread" of a group of numbers. This Mean, Median, Mode, and Range worksheet provides clear, step-by-step practice for these essential statistical concepts. By working through diverse data sets, students learn how to summarize information accurately, a skill they will use in math, science, and everyday life.'
  },
  'line-graphs': {
    title: 'Interpreting and Creating Line Graphs - Data Visuals | Wizqo',
    metaDescription: 'Learn to read and draw line graphs with our Data Visualization worksheet. Practice tracking changes over time and plotting data points. Free PDF.',
    learningObjectives: ['Read and interpret data trends on a line graph', 'Plot data points accurately on a grid', 'Draw lines to connect data points and show trends'],
    intro: 'Line graphs are the best way to visualize how something changes over time. Our Line Graphs worksheet teaches students how to read the X and Y axes, identify trends (like a temperature rise), and plot their own data points from a table. This printable activity transforms abstract numbers into a visual story, building the graphing skills needed for upper elementary and middle school.'
  },
  'reading-g1-ants': {
    title: 'Reading Comprehension: All About Ants - Grade 1 Phonics | Wizqo',
    metaDescription: 'Download our 1st-grade reading passage "All About Ants." Includes simple facts and comprehension questions to build early literacy and science knowledge.',
    learningObjectives: ['Recall simple scientific facts from the text', 'Identify the main topic of a reading passage', 'Practice decoding informational text'],
    intro: 'Introduce young learners to the fascinating world of insects with our "All About Ants" reading comprehension worksheet. This passage is written specifically for 1st-grade readers, using simple vocabulary and engaging facts to build literacy while teaching basic science. After reading, students answer straightforward questions that confirm their understanding, helping them transition from "learning to read" to "reading to learn."'
  },
  'add-2digit-100': {
    title: 'Adding 2-Digit Numbers within 100 - Vertical Addition | Wizqo',
    metaDescription: 'Practice vertical addition within 100 without regrouping. Build accuracy and speed with our 2-digit addition worksheet. Free printable PDF for 1st-2nd grade.',
    learningObjectives: ['Align 2-digit numbers vertically by place value', 'Add tens and ones separately within 100', 'Solve addition problems without regrouping'],
    intro: 'Vertical addition is the standard way to handle larger sums, and our Adding 2-Digit Numbers within 100 worksheet makes it easy to learn. By focusing on problems that don\'t require regrouping (borrowing), students can concentrate on alignment and column addition, building the procedural fluency needed for more complex math. Perfect for classroom morning work or extra home practice.'
  },
  'add-2digit-regrouping': {
    title: 'Adding with Regrouping (2-Digit) - Carry Over Practice | Wizqo',
    metaDescription: 'Master 2-digit addition with regrouping (carrying). Targeted practice for students learning to move ones to the tens column. Free PDF with answer key.',
    learningObjectives: ['Master the concept of "carrying over" in addition', 'Perform 2-digit addition with regrouping', 'Understand place value transformation in sums > 10'],
    intro: 'Regrouping is often where young mathematicians hit their first major hurdle. Our Adding with Regrouping worksheet is designed to make the "carry over" process visual and intuitive. With clear spacing and guided examples, students learn how ten ones become one ten, transforming their understanding of place value and enabling them to tackle any 2-digit sum with total confidence.'
  },
  'add-sub-fractions': {
    title: 'Adding and Subtracting Fractions - Like Denominators | Wizqo',
    metaDescription: 'Practice basic fraction arithmetic with our Adding and Subtracting Fractions worksheet. Focus on fractions with the same denominator. Free printable PDF.',
    learningObjectives: ['Add and subtract fractions with common denominators', 'Understand that the denominator stays the same in basic operations', 'Visualize fraction addition using models'],
    intro: 'Fractions don\'t have to be intimidating! Our Adding and Subtracting Fractions worksheet focuses on "like denominators," teaching students that when the pieces are the same size, you simply add or subtract the top numbers (numerators). This printable practice sheet builds the foundational logic needed before moving on to unlike denominators, ensuring a smooth transition into more advanced fraction operations.'
  },
  'area-model-mult': {
    title: 'Area Model Multiplication - Visual Strategy Practice | Wizqo',
    metaDescription: 'Learn to multiply using the box method/area model. Break down large numbers for easier calculation. Perfect for 3rd-5th grade math mastery.',
    learningObjectives: ['Decompose numbers into expanded form for multiplication', 'Calculate partial products using the area model grid', 'Sum partial products to find the final total'],
    intro: 'Standard algorithms can feel like a "black box," but the Area Model Multiplication worksheet makes math transparent. By breaking numbers like 24 into 20 and 4, students can visualize multiplication as a physical area on a grid. This "box method" is a favorite among teachers for reducing calculation errors and building a deep, conceptual understanding of how multi-digit multiplication actually works.'
  },
  'bar-graphs-data': {
    title: 'Interpreting Bar Graphs and Data - Statistics for Kids | Wizqo',
    metaDescription: 'Practice reading and analyzing bar graphs with our Data Interpretation worksheet. Answer questions based on visual charts. Free printable for grades 2-4.',
    learningObjectives: ['Read and interpret data from a vertical bar graph', 'Compare quantities using visual chart scales', 'Draw conclusions based on statistical evidence'],
    intro: 'Information is everywhere, and being able to read a graph is a vital life skill. Our Interpreting Bar Graphs and Data worksheet presents students with colorful, relatable scenarios and challenges them to extract meaning from the bars. From comparing quantities to finding the total count, this worksheet transforms raw numbers into visual insights, strengthening both math and critical thinking skills.'
  },
  'beginning-sounds-az': {
    title: 'Beginning Sounds A-Z - Phonics & Letter Recognition | Wizqo',
    metaDescription: 'Help early readers identify starting letter sounds for objects A-Z. Perfect for Pre-K and Kindergarten phonemic awareness. Free printable PDF.',
    learningObjectives: ['Connect spoken sounds to written letters', 'Identify the starting sound of common objects', 'Enhance phonemic awareness through visual matching'],
    intro: 'Reading begins with the ear. Our Beginning Sounds A-Z worksheet helps young learners bridge the gap between spoken language and written symbols by identifying the "first sound" of familiar objects. Whether it\'s "A" for Apple or "Z" for Zebra, this phonics practice sheet provides the repetitive, joyful engagement needed to build a strong foundation for decoding and spelling.'
  },
  'comparing-fractions': {
    title: 'Comparing Fractions - Visual and Numerical Practice | Wizqo',
    metaDescription: 'Learn to compare fractions using models and common denominators. Practice using greater than, less than, and equal signs. Free PDF for grades 3-4.',
    learningObjectives: ['Use benchmark fractions (like 1/2) to compare values', 'Understand that larger denominators mean smaller pieces', 'Correctly use comparison symbols (<, >, =) with fractions'],
    intro: 'Is 1/3 really bigger than 1/4? Our Comparing Fractions worksheet helps students answer this common question using both visual models and logical reasoning. By seeing the physical difference in slice sizes and learning to find common denominators, children develop a "fraction sense" that prevents common errors. This printable resource is perfect for consolidating 3rd and 4th-grade math standards.'
  },
  'customary-conversion': {
    title: 'Customary Unit Conversion Practice - Length, Weight, Volume | Wizqo',
    metaDescription: 'Practice converting between inches, feet, yards, ounces, and pounds. Build measurement fluency with our Customary Units worksheet. Free PDF.',
    learningObjectives: ['Convert between standard units of length (inches, feet, yards)', 'Understand relationships between ounces and pounds', 'Identify the correct operation (multiplication/division) for unit changes'],
    intro: 'Navigating the customary measurement system requires a solid grasp of conversion factors. Our Customary Unit Conversion worksheet provides targeted practice for the most common units used in the United States, from measuring height in feet to weighing items in pounds. With clear reference charts and varied problems, students build the mathematical "fluidity" needed for real-world measurements and science experiments.'
  },
  'decimals-place-value': {
    title: 'Decimals Place Value - Tenths and Hundredths Mastery | Wizqo',
    metaDescription: 'Master the value of digits to the right of the decimal point. Practice identifying tenths and hundredths. Free printable for 4th and 5th grade.',
    learningObjectives: ['Identify the place value of digits in a decimal number', 'Read and write decimals in expanded and word form', 'Understand the relationship between fractions and decimals'],
    intro: 'What happens when a number is smaller than one? Our Decimals Place Value worksheet introduces students to the world of tenths and hundredths, showing them how the base-ten system extends beyond the decimal point. By mapping decimals to visual grids and place value charts, learners build the clarity needed for adding, subtracting, and comparing decimals with precision.'
  },
  'div-facts-1-12': {
    title: 'Division Facts 1-12 - Division Mastery & Speed Drills | Wizqo',
    metaDescription: 'Build instant recall of division facts from 1 to 12. Includes speed drills and targeted practice for 3rd-5th grade math fluency. Free PDF download.',
    learningObjectives: ['Recall division facts 1-12 with accuracy and speed', 'Connect division to its inverse multiplication facts', 'Strengthen mental math calculation foundations'],
    intro: 'True math fluency is built on a foundation of fast, accurate fact recall. Our Division Facts 1-12 worksheet offers a mix of repetition and speed challenges designed to move division into long-term memory. By mastering these basic facts, students remove the "mental tax" from complex problems like long division and simplifying fractions, allowing them to focus on new concepts without getting bogged down in basic arithmetic.'
  },
  'equivalent-fractions': {
    title: 'Finding Equivalent Fractions - Visual & Algebraic Practice | Wizqo',
    metaDescription: 'Learn how to find fractions that represent the same value. Use multiplication and division to simplify and expand fractions. Free printable PDF.',
    learningObjectives: ['Identify equivalent fractions using visual models', 'Use the "Identity Property" (multiplying by n/n) to find equivalents', 'Simplify fractions to their lowest terms'],
    intro: 'Why does 2/4 equal 1/2? Our Finding Equivalent Fractions worksheet turns this abstract concept into a concrete skill. By coloring in equivalent areas and using the "secret" of multiplying or dividing the top and bottom by the same number, students learn that fractions can look different while representing the same amount. This is a crucial "bridge" skill for adding fractions with unlike denominators.'
  },
  'factors-multiples': {
    title: 'Factors and Multiples - Number Theory Practice | Wizqo',
    metaDescription: 'Identify the factors and multiples of common numbers. Practice finding GCF and LCM with our clear, printable worksheet. Perfect for grades 4-6.',
    learningObjectives: ['List all factor pairs for a given number', 'Identify multiples and common multiples in a set', 'Distinguish between prime and composite numbers'],
    intro: 'Every number is built from factors! Our Factors and Multiples worksheet helps students peek "under the hood" of mathematics to see how numbers are constructed. By mastering these concepts, children build the foundations for Greatest Common Factor (GCF) and Least Common Multiple (LCM), making advanced fraction work and algebra much more intuitive. Perfect for building a strong number-sense foundation.'
  },
  'fractions-to-decimals': {
    title: 'Converting Fractions to Decimals - Math Skills Mastery | Wizqo',
    metaDescription: 'Learn to transform fractions into their decimal equivalents. Focus on tenths, hundredths, and division methods. Free PDF for 4th-6th grade.',
    learningObjectives: ['Convert fractions with denominators of 10 and 100 to decimals', 'Use long division to turn any fraction into a decimal', 'Recognize common fraction-decimal equivalents on sight'],
    intro: 'Math is a language with many dialects! Our Converting Fractions to Decimals worksheet helps students "translate" between these two essential forms. Whether it\'s recognizing that 1/2 is 0.5 or using division for more complex values, this practice sheet ensures learners are comfortable moving between systems—a skill that is used daily in money, measurement, and science.'
  },
  'long-division-1digit': {
    title: 'Long Division with 1-Digit Divisors - Step-by-Step | Wizqo',
    metaDescription: 'Master the long division algorithm (Does McDonald\'s Sell Cheese Burgers?). Practice 2 and 3-digit dividends with 1-digit divisors. Free PDF.',
    learningObjectives: ['Execute the Divide-Multiply-Subtract-Bring Down sequence', 'Correctly place the quotient in relation to the dividend', 'Manage remainders accurately in long division problems'],
    intro: 'Long division is a rite of passage for every math student. Our Long Division with 1-Digit Divisors worksheet breaks this complex multi-step process into manageable bites. Using the "DMSB" (Divide, Multiply, Subtract, Bring Down) mnemonic, students practice the rhythm of the algorithm on a clean, organized layout that prevents common alignment errors. Perfect for building confidence in 4th and 5th-grade math.'
  },
  'mult-word-problems': {
    title: 'Multiplication Word Problems - Real-World Math Mastery | Wizqo',
    metaDescription: 'Apply multiplication to real-life scenarios. Our word problems worksheet helps kids translate stories into math equations. Free PDF for grades 2-4.',
    learningObjectives: ['Identify "clue words" that signal a multiplication problem', 'Translate narrative scenarios into multiplication equations', 'Solve multi-step problems involving repetitive addition'],
    intro: 'Math is most powerful when it solves real problems. Our Multiplication Word Problems worksheet takes math out of the textbook and into the real world, asking students to calculate everything from total cookies at a party to rows of seats in a theater. By practicing the art of "translation"—turning words into numbers—children build the logic and reading comprehension skills needed for all future math success.'
  },
  'add-three-numbers': {
    title: 'Adding Three Numbers - Multi-Addend Calculation | Wizqo',
    metaDescription: 'Practice adding three single-digit numbers. Learn to find "friendly pairs" (making ten) to simplify arithmetic. Free PDF for 1st-2nd grade.',
    learningObjectives: ['Sum three single-digit numbers accurately', 'Use the associative property to group numbers', 'Identify "ten partners" within a set of three numbers'],
    intro: 'Moving from two addends to three is a major step in numerical fluency. Our Adding Three Numbers worksheet encourages students to look for shortcuts, like finding two numbers that make ten first. By learning to group numbers strategically, children build the mental flexibility needed for higher-level mental math and complex multi-step addition.'
  },
  'animal-pack': {
    title: 'Animal Themed Learning Pack - All-in-One Printable | Wizqo',
    metaDescription: 'Download our comprehensive Animal Pack! Includes coloring, counting, and letter recognition activities all centered around your favorite animals. Free PDF.',
    learningObjectives: ['Engage with cross-curricular animal themes', 'Practice early math and literacy in a thematic context', 'Strengthen fine motor skills through animal-themed art'],
    intro: 'Learning is always better with friends from the animal kingdom! Our Animal Themed Learning Pack combines math, literacy, and art into one engaging bundle. From counting kittens to coloring lions, this comprehensive printable resource is perfect for keeping Pre-K and Kindergarten learners excited about their "school work" while building essential foundational skills.'
  },
  'balance-equations-10': {
    title: 'Balancing Equations within 10 - Intro to Algebra | Wizqo',
    metaDescription: 'Understand the equal sign with our Balancing Equations worksheet. Find missing numbers to make both sides equal. Perfect for 1st grade math.',
    learningObjectives: ['Define the equal sign as "the same as"', 'Find missing addends to balance an equation', 'Verify equality through calculation on both sides'],
    intro: 'The equal sign isn\'t just an "answer" button—it\'s a balance scale! Our Balancing Equations within 10 worksheet introduces students to this core algebraic concept by asking them to make both sides of the equation match. By finding the missing number that solves the puzzle, children move beyond simple calculation and start thinking like future mathematicians.'
  },
  'big-small': {
    title: 'Big or Small? - Size Comparison & Logic | Wizqo',
    metaDescription: 'Practice identifying different sizes with our Big and Small worksheet. Compare objects and categorize them by scale. Fun early learning PDF for Pre-K.',
    learningObjectives: ['Identify differences in physical scale', 'Apply labels like "biggest" and "smallest" correctly', 'Develop visual discrimination and logical categorization'],
    intro: 'Size is one of the first ways children learn to categorize the world. Our Big or Small worksheet uses familiar objects to teach the concept of relative scale. By identifying which item is the largest or smallest in a group, young learners build the visual discrimination skills that are essential for everything from geometry to reading readiness.'
  },
  'classifying-angles': {
    title: 'Classifying Angles - Acute, Obtuse, and Right | Wizqo',
    metaDescription: 'Learn to identify and categorize angles based on their degrees. Includes practice for right, acute, and obtuse angles. Free PDF for 4th-5th grade.',
    learningObjectives: ['Identify right angles (exactly 90 degrees)', 'Distinguish between acute (under 90) and obtuse (over 90) angles', 'Use real-world examples to visualize angle types'],
    intro: 'Geometry is the study of shapes, and angles are the corners that define them. Our Classifying Angles worksheet teaches students how to use the 90-degree "right angle" as a benchmark to identify acute and obtuse turns. With clear diagrams and practice problems, this printable resource helps 4th and 5th graders master the vocabulary of geometry and build a foundation for trigonometry.'
  },
  'color-by-number': {
    title: 'Color by Number - Fun Math & Art Activity | Wizqo',
    metaDescription: 'Combine art and math with our Color by Number worksheets. Practice number recognition while creating beautiful pictures. Free printable for kids.',
    learningObjectives: ['Correlate numbers with specific color codes', 'Improve concentration and detail-oriented focus', 'Strengthen fine motor skills through precision coloring'],
    intro: 'Make math colorful! Our Color by Number worksheets turn number recognition and basic calculation into a creative masterpiece. By following the numerical code to fill in the image, students stay engaged longer than with traditional drills, building their concentration and manual dexterity while they "uncover" the hidden artwork.'
  },
  'compare-2digit': {
    title: 'Comparing 2-Digit Numbers - Greater Than & Less Than | Wizqo',
    metaDescription: 'Learn to use <, >, and = signs with 2-digit numbers. Focused practice on place value logic. Free printable PDF for 1st and 2nd grade math.',
    learningObjectives: ['Compare the tens digits of two numbers first', 'Use the ones digits as a tie-breaker for comparison', 'Correctly use the symbols for greater than, less than, and equal'],
    intro: 'Which number is larger: 42 or 24? Our Comparing 2-Digit Numbers worksheet teaches students the systematic way to compare values by looking at the tens place first. Using the classic "hungry alligator" signs (< and >), this printable practice sheet helps children master place value logic and feel confident comparing any numbers up to 100.'
  },
  'counting-objects-20': {
    title: 'Counting Objects to 20 - Number Sense Practice | Wizqo',
    metaDescription: 'Master counting with our Objects to 20 worksheet. Help early learners connect quantities to numerals. Perfect for Kindergarten math readiness.',
    learningObjectives: ['Accurately count groups of up to 20 objects', 'Write the correct numeral for a given quantity', 'Understand the concept of one-to-one correspondence'],
    intro: 'Counting isn\'t just reciting a sequence—it\'s understanding how much "twenty" actually is. Our Counting Objects to 20 worksheet provides diverse groups of items for students to count, helping them master one-to-one correspondence. This visual practice is vital for ensuring that kids don\'t just memorize the names of numbers, but actually understand the quantities they represent.'
  },
  'count-write-30': {
    title: 'Count and Write to 30 - Kindergarten Math Skills | Wizqo',
    metaDescription: 'Expand counting skills beyond 20! Practice counting and writing numbers up to 30 with our clear, printable worksheet. Free PDF download.',
    learningObjectives: ['Count fluently from 1 to 30', 'Practice proper formation of two-digit numbers', 'Transition from basic counting to higher numerical ranges'],
    intro: 'Once students are comfortable with numbers up to 20, it\'s time to break into the 20s and beyond. This Count and Write to 30 worksheet provides the perfect bridge, challenging learners to maintain their accuracy as the numbers get larger. Regular practice writing these digits helps cement their shape and order, preparing children for the 100-chart and basic addition.'
  },
  'decimal-word-problems': {
    title: 'Decimal Word Problems - Real-World Applications | Wizqo',
    metaDescription: 'Solve math stories involving decimals! Practice adding, subtracting, and multiplying decimals in context. Free PDF for 5th and 6th grade.',
    learningObjectives: ['Apply decimal arithmetic to money and measurement scenarios', 'Align decimals correctly when interpreting word problems', 'Determine the correct operation based on contextual clues'],
    intro: 'Decimals are most common in "real world" situations like shopping or measuring ingredients. Our Decimal Word Problems worksheet takes math concepts and applies them to relatable stories, helping students see the purpose of their calculations. Whether they are calculating change or dividing a piece of fabric, learners build the practical fluency needed for success in everyday life.'
  },
  'dividing-decimals': {
    title: 'Dividing Decimals by Whole Numbers - Precision Practice | Wizqo',
    metaDescription: 'Learn where to place the decimal point in division. Practice dividing decimals with accuracy. Free printable PDF for 5th grade math mastery.',
    learningObjectives: ['Correctly place the decimal point in the quotient', 'Execute the long division algorithm with decimal dividends', 'Check division results using multiplication'],
    intro: 'The most important part of dividing decimals is the decimal point! Our Dividing Decimals worksheet teaches students to "bring the point straight up" into the answer before they even start dividing. By practicing this specific step alongside standard long division, students avoid the most common errors and gain the precision needed for advanced sciences and financial math.'
  },
  'dot-to-dot-1-20': {
    title: 'Dot-to-Dot 1-20 - Fine Motor & Counting Fun | Wizqo',
    metaDescription: 'Connect the dots from 1 to 20 to reveal the hidden picture. Perfect for fine motor skills and number sequence practice. Free printable PDF.',
    learningObjectives: ['Follow a numerical sequence from 1 to 20', 'Strengthen hand-eye coordination and pencil control', 'Discover hidden patterns through sequential logic'],
    intro: 'Turn number practice into a game of discovery! Our Dot-to-Dot 1-20 worksheet challenges students to follow a logical path to reveal a hidden image. This classic activity is one of the best ways to build the fine motor control needed for writing, while simultaneously reinforcing the order of numbers in a fun, reward-driven format.'
  },
  'elapsed-time-4th': {
    title: 'Elapsed Time Practice - Calculating Duration | Wizqo',
    metaDescription: 'Learn to find the difference between start and end times. Includes "t-chart" strategies for easier calculation. Free PDF for 4th-5th grade.',
    learningObjectives: ['Calculate the duration between two specific times', 'Understand AM and PM transitions in time blocks', 'Use addition and subtraction to solve time-based problems'],
    intro: 'How long until lunch? Our Elapsed Time worksheet helps students answer this question by teaching them to calculate durations. From simple hour-long jumps to complex minute transitions, this printable resource provides the practice needed to master the clock. We include space for "time-line" or "t-chart" strategies, making these calculations visual and stress-free.'
  },
  'even-odd-100': {
    title: 'Even or Odd? - Number Property Identification | Wizqo',
    metaDescription: 'Identify even and odd numbers up to 100. Practice the "pairing" rule to understand parity. Free printable PDF for 2nd and 3rd grade.',
    learningObjectives: ['Identify even numbers ending in 0, 2, 4, 6, 8', 'Identify odd numbers ending in 1, 3, 5, 7, 9', 'Understand that even numbers can be partitioned into two equal groups'],
    intro: 'Every number has a "personality," and parity is the most basic one. Our Even or Odd worksheet helps students categorize numbers up to 100 by looking at the digit in the ones place. By learning to recognize these patterns, children build a foundational understanding of division and multiplication, making it easier to predict remainders and understand number relationships later on.'
  },
  'expanded-form-200': {
    title: 'Expanded Form to 200 - Place Value Visualized | Wizqo',
    metaDescription: 'Break down numbers into hundreds, tens, and ones. Practice writing 154 as 100 + 50 + 4. Free printable for 1st-2nd grade math.',
    learningObjectives: ['Decompose 3-digit numbers into their place value parts', 'Write numbers in mathematical expanded notation sums', 'Understand that the "value" of a digit depends on its position'],
    intro: 'Writing a number is just a shorthand for its total value. Our Expanded Form to 200 worksheet helps students see that "154" is actually just 100 plus 50 plus 4. By physically breaking numbers apart into their hundreds, tens, and ones, children develop a deep place-value intuition that is essential for regrouping in addition and subtraction.'
  },
  'ab-pattern': {
    title: 'AB Patterns - Early Logic & Sequencing Practice | Wizqo',
    metaDescription: 'Master the basics of sequencing with our AB Patterns worksheet. Identify and extend simple alternating patterns. Perfect for Preschool and Kindergarten.',
    learningObjectives: ['Identify the repeating unit in an AB pattern', 'Extend a sequences based on established logic', 'Create original alternating patterns using colors and shapes'],
    intro: 'Every complex scientific theory starts with a simple pattern. Our AB Patterns worksheet introduces young learners to the foundation of logic: predictable sequencing. By identifying and extending alternating "red-blue" or "circle-square" patterns, children build the observation skills needed for reading and advanced mathematics.'
  },
  'adding-decimals-challenge': {
    title: 'Adding Decimals Challenge - Advanced Decimal Practice | Wizqo',
    metaDescription: 'Take your decimal skills to the next level! Practice adding multi-digit decimals with precision. Free printable PDF for 5th-6th grade.',
    learningObjectives: ['Add multi-digit decimals with varying numbers of places', 'Practice regrouping across the decimal point', 'Apply estimation to verify decimal sums'],
    intro: 'Precision is the name of the game with our Adding Decimals Challenge. Designed for students who have mastered the basics, this worksheet features complex sums that require careful alignment and accurate regrouping. Whether calculating total costs or scientific measurements, this practice sheet builds the high-level fluency required for middle school math.'
  },
  'addition-subtraction-0-10': {
    title: 'Addition and Subtraction to 10 - Math Foundations | Wizqo',
    metaDescription: 'Build core math fluency with our facts to 10 worksheet. Targeted practice for kindergarten and 1st grade addition and subtraction. Free PDF.',
    learningObjectives: ['Fluently add and subtract within the number 10', 'Connect addition and subtraction as inverse operations', 'Strengthen mental math recall for small sums'],
    intro: 'The numbers 0 through 10 are the "alphabet" of mathematics. Our Addition and Subtraction to 10 worksheet provides the repetitive, focused practice needed to move these basic facts into long-term memory. By developing instant recall of these small sums and differences, students gain the confidence to tackle larger numbers and more complex operations later on.'
  },
  'add-sub-decimals': {
    title: 'Adding and Subtracting Decimals - Money & Measurement | Wizqo',
    metaDescription: 'Practice both adding and subtracting decimals in one comprehensive worksheet. Essential skill for 4th and 5th grade math. Free printable PDF.',
    learningObjectives: ['Switch between addition and subtraction strategies correctly', 'Maintain decimal alignment across different operations', 'Solve multi-digit decimal problems with a focus on precision'],
    intro: 'Real-world math doesn\'t just stick to one operation. Our Adding and Subtracting Decimals worksheet mixes problems to keep students on their toes, challenging them to identify the correct procedure for each calculation. This practice is essential for handling money, where adding prices and calculating change happen simultaneously.'
  },
  'add-sub-fractions-4th': {
    title: 'Adding & Subtracting Fractions (Grade 4) - Standard Prep | Wizqo',
    metaDescription: 'Targeted fraction practice for 4th-grade standards. Focus on like denominators and introductory mixed numbers. Free PDF with answer key.',
    learningObjectives: ['Add and subtract fractions with common denominators', 'Introduce the concept of decomposing fractions', 'Apply fraction arithmetic to simple word problems'],
    intro: 'Grade 4 is a pivotal year for fraction mastery. This worksheet is specifically tailored to 4th-grade standards, focusing on the core skill of adding and subtracting parts of a whole with like denominators. By practicing these foundational steps, students prepare for the more complex challenges of unlike denominators and fraction multiplication in the years ahead.'
  },
  'add-sub-mixed-numbers': {
    title: 'Adding and Subtracting Mixed Numbers - Advanced Fractions | Wizqo',
    metaDescription: 'Learn to handle whole numbers and fractions together. Practice regrouping with mixed number arithmetic. Perfect for 5th grade math.',
    learningObjectives: ['Convert between improper fractions and mixed numbers for calculation', 'Add and subtract mixed numbers with like denominators', 'Regroup "wholes" when subtracting or adding fractions'],
    intro: 'Adding 1 1/2 and 2 3/4 requires keeping track of two different worlds: wholes and parts. Our Adding and Subtracting Mixed Numbers worksheet teaches students how to manage these values simultaneously. With clear organizational space and guided examples, learners master the art of regrouping "wholes" into "parts" and vice-versa, making advanced fraction work feel like second nature.'
  },
  'area-perimeter-4th': {
    title: 'Area and Perimeter Practice - Grade 4 Geometry | Wizqo',
    metaDescription: 'Master the formulas for area and perimeter. Practice calculating space and boundary for rectangles and squares. Free printable for 4th grade.',
    learningObjectives: ['Calculate perimeter by summing all side lengths', 'Calculate area using the length x width formula', 'Distinguish between the "inside" and "outside" of a shape'],
    intro: 'Perimeter is the fence; area is the grass. Our Area and Perimeter worksheet uses this common analogy to help students distinguish between these two vital measurements. Focused on 4th-grade geometry standards, this printable resource Provides various rectangular and square shapes for students to measure and calculate, ensuring they never confuse "around" with "inside" again.'
  },
  'area-rectangles': {
    title: 'Calculating Area of Rectangles - Geometry Mastery | Wizqo',
    metaDescription: 'Focused practice on the L x W formula. Learn to find the area of standard and irregular rectangular figures. Free PDF for grades 3-5.',
    learningObjectives: ['Apply the area formula (A = L x W) to various rectangles', 'Identify missing dimensions given the total area', 'Understand area in terms of square units'],
    intro: 'Finding the area of a rectangle is one of the most practical skills in geometry. Whether you are tiling a floor or planting a garden, knowing how to multiply length by width is essential. This worksheet provides repetitive practice with different dimensions, building the procedural speed and accuracy needed for more complex composite shapes later on.'
  },
  'area-triangles-parallelograms': {
    title: 'Area of Triangles and Parallelograms - Advanced Geometry | Wizqo',
    metaDescription: 'Learn the specialized formulas for non-rectangular shapes. Practice finding area for triangles (1/2bh) and parallelograms (bh). Free PDF.',
    learningObjectives: ['Apply the formula for the area of a triangle', 'Apply the formula for the area of a parallelogram', 'Understand the relationship between rectangles and other polygons'],
    intro: 'Did you know a triangle is just half of a rectangle? Our Area of Triangles and Parallelograms worksheet reveals the "why" behind geometry formulas. By showing how these shapes relate to standard rectangles, students build a deeper conceptual understanding of area calculation, making it easier to remember formulas even for the most complex polygons.'
  },
  'arts-3-shape-creature': {
    title: 'Shape Creature Art - Geometry & Creativity | Wizqo',
    metaDescription: 'Create unique monsters using only geometric shapes! A fun art and math project for Kindergarten and 1st Grade. Free printable craft.',
    learningObjectives: ['Identify and use geometric shapes in creative design', 'Practice fine motor skills through drawing and coloring', 'Deconstruct complex images into simpler shapes'],
    intro: 'Art meets geometry in the Shape Creature worksheet! We challenge students to build their own unique monsters using only circles, squares, triangles, and rectangles. This "creative challenge" helps young learners see the geometric building blocks of the world around them, making math feel like a fun and expressive adventure rather than just a series of numbers.'
  },
  'bar-graphs-pictographs': {
    title: 'Bar Graphs and Pictographs - Visual Data Comparison | Wizqo',
    metaDescription: 'Learn to read and create both bar graphs and pictographs. Practice translating symbols into numerical data. Free PDF for grades 1-3.',
    learningObjectives: ['Interpret data from both bar and picture-based graphs', 'Create a graph based on a provided data table', 'Understand that a single symbol can represent multiple units (keys)'],
    intro: 'Graphs tell a story with pictures and bars. Our Bar Graphs and Pictographs worksheet helps students learn to read these visual "stories" accurately. By focusing on both standard bars and symbolic pictographs, children learn how data can be represented in different ways, building the critical thinking skills needed to analyze information in the media and in science.'
  },
  'bookmark-templates': {
    title: 'Printable Bookmark Templates - Literacy & Creativity | Wizqo',
    metaDescription: 'Get kids excited about reading with our customizable bookmark templates! Includes designs for coloring and blank spaces for drawings. Free PDF.',
    learningObjectives: ['Encourage a positive relationship with reading', 'Strengthen fine motor skills through precision coloring', 'Express personal creativity through functional art'],
    intro: 'The best way to encourage reading is to make it personal! Our Printable Bookmark Templates offer a variety of designs that students can color and customize for their favorite books. Whether used as a classroom craft or a rainy-day home activity, these functional art pieces help children take ownership of their literacy journey while practicing fine motor control.'
  },
  'brain-boost': {
    title: 'Brain Boost Challenge - Puzzles and Logic for Kids | Wizqo',
    metaDescription: 'Flex your mental muscles with our Brain Boost worksheet! Includes a mix of logic puzzles, riddles, and quick-thinking challenges. Free PDF.',
    learningObjectives: ['Apply diverse problem-solving strategies', 'Improve lateral thinking and creative logic', 'Build mental stamina through varied challenges'],
    intro: 'Your brain is like a muscle—it needs a workout! Our Brain Boost worksheet is a "cross-training" session for the mind, featuring a variety of riddles, logic puzzles, and pattern-finding games. Unlike standard math sheets, these challenges ask students to think "outside the box," building the resilience and creative problem-solving skills that are vital for success in all subjects.'
  },
  'classifying-quadrilaterals': {
    title: 'Classifying Quadrilaterals - Four-Sided Shape Mastery | Wizqo',
    metaDescription: 'Learn to distinguish between squares, rectangles, rhombuses, and trapezoids. Master quadrilateral properties. Free PDF for 3rd-5th grade.',
    learningObjectives: ['Identify properties of various four-sided shapes', 'Distinguish between rectangles, rhombuses, and squares', 'Understand the hierarchy of quadrilaterals'],
    intro: 'All squares are rectangles, but not all rectangles are squares! Our Classifying Quadrilaterals worksheet helps students navigate the complex world of four-sided shapes. By identifying parallel lines, right angles, and equal sides, learners build the geometric vocabulary needed to categorize shapes with precision and understand the logical relationships between them.'
  },
  'classifying-shapes': {
    title: 'Classifying 2D Shapes - Introductory Geometry | Wizqo',
    metaDescription: 'Practice identifying and grouping polygons by their attributes. Focus on sides, corners, and vertex count. Free printable for grades K-2.',
    learningObjectives: ['Group shapes by side and vertex count', 'Describe shapes using geometric terminology', 'Differentiate between regular and irregular polygons'],
    intro: 'The world is built of shapes, and geometry is the language we use to describe them. Our Classifying Shapes worksheet helps young learners move beyond "knowing" a circle from a square to understanding the properties that define them. By counting sides and vertices, students build a rigorous foundation for later geometry, making the transition to complex polygons smooth and intuitive.'
  },
  'classifying-triangles': {
    title: 'Classifying Triangles - Right, Acute, and Obtuse | Wizqo',
    metaDescription: 'Learn to identify triangles by their angles and side lengths. Practice distinguishing between scalene, isosceles, and equilateral. Free printable PDF.',
    learningObjectives: ['Identify triangles by angle type (acute, right, obtuse)', 'Classify triangles by side length (scalene, isosceles, equilateral)', 'Understand that all internal angles sum to 180 degrees'],
    intro: 'Not all triangles are created equal! Our Classifying Triangles worksheet teaches students the two different ways to categorize these three-sided shapes: by their angles and by their sides. From the perfect symmetry of an equilateral triangle to the sharp corner of a right triangle, learners master the vocabulary and properties that define this fundamental geometric building block.'
  },
  'color-patterns': {
    title: 'Advanced Color Patterns - Logic & Visual Perception | Wizqo',
    metaDescription: 'Challenge students with complex color sequences. Practice identifying and extending multi-step patterns. Free printable for grades K-2.',
    learningObjectives: ['Identify complex repeating units in color sequences', 'Extend patterns accurately using visual logic', 'Develop attention to detail and color discrimination'],
    intro: 'Go beyond the basics! Our Color Patterns worksheet takes sequencing to the next level with multi-color challenges. By identifying how shades and hues repeat across a line, students strengthen their visual perception and logical reasoning. This worksheet is perfect for transitional learners who have mastered simple AB patterns and are ready for more complex "ABC" or "AAB" logic.'
  },
  'color-recognition': {
    title: 'Color Recognition & Identification - Early Learning | Wizqo',
    metaDescription: 'Help toddlers and preschoolers identify primary and secondary colors. Fun coloring and matching activities. Free printable PDF.',
    learningObjectives: ['Identify core colors by name', 'Match objects to their corresponding color labels', 'Improve visual discrimination through thematic coloring'],
    intro: 'The world is a vibrant place! Our Color Recognition worksheet helps young explorers learn the names and looks of the colors they see every day. Through engaging "point and color" activities, children build their vocabulary and visual processing skills, providing a bright foundation for both art and early literacy.'
  },
  'color-shapes': {
    title: 'Coloring Shapes - Geometry & Fine Motor Practice | Wizqo',
    metaDescription: 'Identify geometric shapes and color them according to a code. Combines math recognition with artistic expression. Free printable for Pre-K.',
    learningObjectives: ['Connect geometric shapes to specific color instructions', 'Reinforce shape identification (circle, square, etc.)', 'Sharpen hand-eye coordination through precision coloring'],
    intro: 'Coloring is more than just fun—it\'s a way to learn! Our Color Shapes worksheet asks students to find specific geometric figures and fill them with designated colors. This activity bridges the gap between identification and application, helping preschoolers cement their knowledge of shapes while practicing the pencil control needed for writing.'
  },
  'coloring': {
    title: 'Free Creative Coloring Pages - Fun Art for Kids | Wizqo',
    metaDescription: 'Download our general-purpose coloring sheets. Encourage creativity with open-ended designs and blank spaces. Perfect for home or school.',
    learningObjectives: ['Exercise creative freedom and self-expression', 'Build focus and relaxation through art', 'Strengthen manual dexterity and grip'],
    intro: 'Sometimes, the best activity is simply creating something beautiful. Our Coloring worksheet provides a series of engaging, open-ended designs that allow students to express their personality through color choice. Beyond the fun, this activity serves as a peaceful "mindfulness" break that helps children build concentration and the fine motor strength used in daily writing.'
  },
  'coloring-animals': {
    title: 'Animal Coloring Fun - Creatures from Around the World | Wizqo',
    metaDescription: 'Explore the animal kingdom through art! Coloring pages featuring lions, elephants, birds, and more. Free printable animal PDFs.',
    learningObjectives: ['Identify different animals and their features', 'Learn about animal habitats through visual context', 'Practice precision coloring to improve fine motor skills'],
    intro: 'From the deepest oceans to the highest mountains, animals are fascinating! Our Animal Coloring Fun worksheet brings the zoo to your desk, featuring detailed illustrations for children to bring to life. As they color, students can learn about different species and their natural environments, making this a perfect supplemental resource for science and biology lessons.'
  },
  'coloring-letters-numbers': {
    title: 'Coloring Letters and Numbers - Alphabet & Math Prep | Wizqo',
    metaDescription: 'Learn the alphabet and numbers 1-10 through artistic coloring. Combines early literacy with fine motor practice. Free printable.',
    learningObjectives: ['Reinforce letter and numeral shape recognition', 'Connect phonetic sounds to colored symbols', 'Build excitement for reading and counting through art'],
    intro: 'Learning your ABCs and 123s has never been so colorful! Our Coloring Letters and Numbers worksheet transforms foundational symbols into artistic canvases. By spending time coloring the "curves" of an S or the "lines" of a 4, children build a visual memory of these shapes that makes future reading and math much easier to master.'
  },
  'coloring-nature': {
    title: 'Nature & Landscape Coloring - Outdoor Art for Kids | Wizqo',
    metaDescription: 'Color beautiful scenes of trees, flowers, and mountains. Perfect for teaching children about the environment. Free printable nature PDF.',
    learningObjectives: ['Identify elements of the natural world (trees, clouds, sun)', 'Practice realistic or creative color application', 'Develop an appreciation for environmental beauty'],
    intro: 'Bring the outdoors in with our Nature Coloring worksheet. Featuring serene landscapes and botanical details, this printable resource encourages students to observe the world around them. Whether they color the leaves green or purple, children develop a sense of wonder for the environment while practicing the focused, calm attention required for high-quality art.'
  },
  'coloring-space': {
    title: 'Outer Space Coloring - Planets and Stars Adventure | Wizqo',
    metaDescription: 'Blast off with our space-themed coloring pages! Features rockets, astronauts, and the solar system. Fun printable for future scientists.',
    learningObjectives: ['Identify astronomical objects like planets and stars', 'Excite interest in space exploration and science', 'Develop imaginative storytelling through cosmic art'],
    intro: 'Math and science meet the final frontier! Our Outer Space Coloring worksheet takes students on a journey through the galaxy, from the craters of the moon to the rings of Saturn. This activity is perfect for sparking conversations about astronomy and the solar system, providing a visual "anchor" for complex scientific concepts.'
  },
  'coloring-vehicles': {
    title: 'Things That Go! Vehicle Coloring Pages for Kids | Wizqo',
    metaDescription: 'Color cars, planes, trains, and boats! A fun transportation-themed coloring worksheet for high-energy learners. Free printable PDF.',
    learningObjectives: ['Identify types of transportation and vehicle features', 'Practice coloring large and small mechanical details', 'Strengthen motor planning through intricate designs'],
    intro: 'Rev your engines! Our Coloring Vehicles worksheet features all the ways we get around, from zooming race cars to soaring airplanes. This transportation-themed activity is a favorite for students who love machines, providing intricate details that challenge their precision while keeping them engaged with high-energy subjects.'
  },
  'comparing-decimals': {
    title: 'Comparing Decimals - Place Value Logic Practice | Wizqo',
    metaDescription: 'Learn to use <, >, and = with decimal numbers. Focus on tenths and hundredths comparisons. Free printable for 4th and 5th grade.',
    learningObjectives: ['Compare decimals by looking at the highest place value first', 'Master the use of "placeholder zeros" for easier comparison', 'Understand that "longer" decimals are not always "larger" values'],
    intro: 'Is 0.7 bigger than 0.09? Our Comparing Decimals worksheet helps students answer this common point of confusion by anchoring their logic in place value. By aligning the decimal points and comparing digit by digit, learners build the clarity needed to order decimals accurately—a skill that is crucial for everything from science measurements to comparing prices.'
  },
  'comparing-fractions-4th': {
    title: 'Comparing Fractions (Grade 4) - Numerator & Denominator | Wizqo',
    metaDescription: 'Master 4th-grade fraction comparison standards. Use common denominators and benchmark fractions. Free PDF with answer key.',
    learningObjectives: ['Compare fractions with different numerators and denominators', 'Use benchmarks like 1/2 to estimate relative values', 'Practice finding common denominators for precise comparison'],
    intro: 'Grade 4 fraction standards require students to move beyond simple visual models to logical reasoning. Our Comparing Fractions worksheet for 4th-graders focuses on teaching students how to "level the playing field" by finding common denominators. This worksheet provides the rigorous practice needed to feel confident using comparison symbols (<, >, =) with any fundamental fractions.'
  },
  'comparing-ordering-fractions-decimals': {
    title: 'Ordering Fractions and Decimals - Mixed Value Practice | Wizqo',
    metaDescription: 'Learn to sequence mixed sets of fractions and decimals. Practice converting for comparison. Advanced math worksheet for 5th-6th grade.',
    learningObjectives: ['Sequence values from least to greatest in mixed formats', 'Convert fractions to decimals (and vice-versa) for comparison', 'Develop a "number-sense" for values on a mixed number line'],
    intro: 'Which is smallest: 1/4, 0.3, or 1/5? Our Ordering Fractions and Decimals worksheet challenges students to navigate between different mathematical representations. By learning to convert all values into a single format (usually decimals), learners build the high-level comparison skills used in advanced algebra, physics, and financial analysis.'
  },
  'coordinate-graphing': {
    title: 'Coordinate Graphing First Quadrant - Path Finding Practice | Wizqo',
    metaDescription: 'Learn to plot points on an (x, y) axis. Practice identifying coordinates in the first quadrant. Free printable for 5th-6th grade.',
    learningObjectives: ['Identify the x and y coordinates of a plotted point', 'Plot ordered pairs accurately on a grid', 'Understand the origin (0,0) and the structure of an axis'],
    intro: 'Coordinate graphing is like a secret code for finding positions! Our Coordinate Graphing worksheet introduces students to the first quadrant, teaching them the "over and up" rule for (x, y) coordinates. From plotting simple dots to uncovering hidden shapes, this activity builds the spatial reasoning skills used in mapping, computer programming, and advanced geometry.'
  },
  'count-circle-1-10': {
    title: 'Count and Circle 1-10 - Kindergarten Math Readiness | Wizqo',
    metaDescription: 'Practice one-to-one correspondence by counting objects and circling the correct number. Fun early math activity for Pre-K.',
    learningObjectives: ['Accurately count groups of 1 to 10 objects', 'Correlate quantities with their specific written numeral', 'Strengthen one-to-one correspondence and visual tracking'],
    intro: 'Counting is the very first step of math! Our Count and Circle 1-10 worksheet helps early learners bridge the gap between "how many objects are there?" and "what does the number look like?". By counting colorful items and selecting the correct numeral from a choice of three, children build the confidence and accuracy needed for addition and subtraction.'
  },
  'count-color-1-10': {
    title: 'Count and Color 1-10 - Fun Early Math Activity | Wizqo',
    metaDescription: 'Practice counting to 10 by coloring the correct number of objects. A fun, hands-on math worksheet for Pre-K and Kindergarten learners. Free PDF.',
    learningObjectives: ['Determine the correct quantity to represent a given numeral', 'Practice one-to-one correspondence through active coloring', 'Strengthen fine motor skills and following multi-step directions'],
    intro: 'Counting is active with our Count and Color 1-10 worksheet! Instead of just identifying a number, students must demonstrate their understanding by coloring the exact number of objects specified. This "hands-on" approach cements the relationship between numerals and quantities, while providing a fun artistic outlet for young learners.'
  },
  'count-match-1-20': {
    title: 'Counting and Number Matching (1-20) - Math Readiness | Wizqo',
    metaDescription: 'Connect counted quantities to their written pair. Practice identifying numbers 1-20 with our clear, printable matching worksheet. Free PDF.',
    learningObjectives: ['Count larger groups of objects accurately up to 20', 'Identify written numerals from 1 to 20 on sight', 'Use visual lines to connect quantities to their numerical partners'],
    intro: 'Ready to go beyond ten? Our Count and Match 1-20 worksheet challenges students to maintain their focus and accuracy as quantities increase. By counting sets of objects and matching them to the correct numerals, children develop the numerical "stamina" needed for Kindergarten and 1st-grade math standards.'
  },
  'creative-challenge': {
    title: 'Daily Creative Challenge - Open-Ended Puzzles for Kids | Wizqo',
    metaDescription: 'Boost lateral thinking with our Daily Creative Challenge. Fun, open-ended prompts for drawing, writing, and problem-solving. Free printable PDF.',
    learningObjectives: ['Exercise convergent and divergent thinking skills', 'Practice creative self-expression through varied prompts', 'Build the confidence to iterate and improve on original ideas'],
    intro: 'There are no "wrong" answers in our Creative Challenge! This worksheet provides a series of open-ended prompts designed to spark imagination and lateral thinking. Whether it\'s "drawing what a secret smells like" or "designing a gadget for a squirrel," these challenges help children value their unique perspectives and build the unconventional problem-solving skills used by innovators.'
  },
  'customary-units': {
    title: 'Customary Measurement Units - Real-World Measurement | Wizqo',
    metaDescription: 'Learn to identify the correct tools and units for measurement. Practice with inches, feet, pounds, and gallons. Free printable PDF for grades 2-4.',
    learningObjectives: ['Select the appropriate customary unit for a given task', 'Understand the relative scale of inches vs. feet and ounces vs. pounds', 'Identify standard measurement tools used in the customary system'],
    intro: 'Should you measure a pencil in inches or feet? Our Customary Measurement Units worksheet helps students develop a "sense of scale" for the system used every day in the US. By identifying the correct units for various objects and scenarios, children build the practical logic needed for science experiments, construction projects, and cooking.'
  },
  'cut-and-paste-crafts': {
    title: 'Printable Cut and Paste Crafts - Fine Motor Fun | Wizqo',
    metaDescription: 'Build something amazing with our 2D paper crafts! Includes templates for cutting, folding, and gluing. Perfect for classroom hands-on learning.',
    learningObjectives: ['Master safe and accurate scissor use (cutting on lines)', 'Practice following multi-step assembly instructions', 'Strengthen spatial reasoning through 2D-to-3D construction'],
    intro: 'Turn a flat piece of paper into a 3D masterpiece! Our Cut and Paste Crafts worksheet provides everything students need to build creative characters or objects. This "tactile" learning activity is one of the most effective ways to build the manual dexterity and spatial awareness that are essential for both artistic expression and complex scientific modeling.'
  },
  'decimal-to-percent': {
    title: 'Converting Decimals to Percents - Percentages Practice | Wizqo',
    metaDescription: 'Master the "multiply by 100" rule. Learn to easily turn decimals into percentages with our clear, printable math worksheet for grades 5-6.',
    learningObjectives: ['Understand the relationship between decimals and the "per cent" (per 100) concept', 'Conform decimal values to percentages by shifting the decimal point', 'Apply conversions to real-world probability and statistics'],
    intro: 'A decimal is just a percent in disguise! Our Converting Decimals to Percents worksheet teaches students the simple logic of moving the decimal point two places to the right. By mastering this "shift," learners gain the ability to translate between different mathematical languages, a skill that is used daily in finance, taxes, and data science.'
  },
  'decimal-word-problems-5th': {
    title: '5th Grade Decimal Word Problems - Real-Life Scenarios | Wizqo',
    metaDescription: 'Advanced decimal practice for upper elementary. Solve complex stories involving money, distance, and multi-step calculations. Free PDF.',
    learningObjectives: ['Extract pertinent data from multi-sentence decimal narratives', 'Perform multi-step decimal operations in a specific logical order', 'Verify results using contextual clues and estimation'],
    intro: 'Math doesn\'t happen in a vacuum—it happens at the grocery store, the gas station, and the science lab. Our 5th Grade Decimal Word Problems worksheet presents students with complex, realistic scenarios that require the precise application of addition, subtraction, and multiplication. This practice builds the stamina and critical reading skills needed for middle school and beyond.'
  },
  'design-monster': {
    title: 'Design Your Own Monster - Creative Project for Kids | Wizqo',
    metaDescription: 'A fun, open-ended art and writing prompt. Describe and draw your unique monster. Free printable activity for elementary students.',
    learningObjectives: ['Use descriptive language to characterize an original creation', 'Plan and execute a multi-attribute visual design', 'Bridge the gap between imaginative thought and concrete expression'],
    intro: 'Unleash your inner mad scientist! Our Design Your Own Monster worksheet invites students to plan every detail of a unique creature, from its number of eyes to its favorite snack. By combining drawing with descriptive writing prompts, this activity encourages children to think structurally about their imagination and practice the vocabulary needed to describe complex ideas.'
  },
  'directed-drawing-animals': {
    title: 'Step-by-Step Animal Drawing - Art Skills for Kids | Wizqo',
    metaDescription: 'Learn to draw your favorite animals with our guided tutorials. Follow simple steps to create impressive sketches. Free printable art PDF.',
    learningObjectives: ['Follow a sequential series of visual instructions', 'Understand how to build complex images from simple shapes', 'Develop precision, patience, and visual-spatial awareness'],
    intro: 'Anyone can be an artist with the right roadmap! Our Directed Drawing Animals worksheet breaks down complex creatures into manageable, geometric steps. By following along, students learn the "building block" method of art, gaining the confidence to create their own sketches while strengthening the hand-eye coordination essential for refined writing.'
  },
  'div-by-10-100': {
    title: 'Dividing by 10 and 100 - Place Value Shift Practice | Wizqo',
    metaDescription: 'Master the "decimal shift" for division. Learn to divide whole numbers and decimals by 10 and 100 instantly. Free PDF for grades 4-5.',
    learningObjectives: ['Execute division by 10 and 100 by shifting decimals to the left', 'Understand the inverse relationship to multiplying by 10/100', 'Develop mental math speed for large-scale calculations'],
    intro: 'Dividing by 10 and 100 is like magic—you just move the point! This worksheet teaches students the shortcut for scaling numbers down by shifting the decimal one or two places to the left. By mastering this mental math trick, children build a deep intuition for our base-ten system and prepare themselves for the Metric system and scientific notation.'
  },
  'dividing-fractions': {
    title: 'Dividing Fractions - Keep, Change, Flip Mastery | Wizqo',
    metaDescription: 'Learn the algorithm for fraction division. Practice the reciprocal method (Keep-Change-Flip) with our clear, printable worksheet for 5th-6th grade.',
    learningObjectives: ['Apply the Reciprocal (Keep-Change-Flip) method accurately', 'Simplify the resulting fraction to its lowest terms', 'Understand division as the inverse of multiplication in a fraction context'],
    intro: 'Dividing by a fraction is the same as multiplying by its flip! Our Dividing Fractions worksheet turns this counter-intuitive concept into a step-by-step success story. Using the "Keep, Change, Flip" mnemonic, students practice the rhythm of fraction division on an organized layout that ensures they never forget to take the reciprocal. Perfect for building confidence in 5th and 6th-grade math.'
  },
  'div-with-remainders': {
    title: 'Division with Remainders - Introduction to Leftovers | Wizqo',
    metaDescription: 'What happens when numbers don\'t divide evenly? Practice division and identifying the remainder. Free printable PDF for grades 3-4.',
    learningObjectives: ['Calculate how many times a divisor fits into a dividend', 'Correctly identify and label the "leftover" value as a remainder', 'Understand the physical concept of items that cannot be grouped evenly'],
    intro: 'In the real world, things don\'t always divide perfectly. Our Division with Remainders worksheet introduces students to the concept of "leftovers." By using both visual grouping and the long division algorithm, children learn how to account for every piece of the dividend, building a foundation for decimals and fractions later in their math journey.'
  },
  'div-word-problems': {
    title: 'Division Word Problems - Real-World Sharing & Grouping | Wizqo',
    metaDescription: 'Apply division to daily scenarios. Practice "fair sharing" and grouping math stories. Free printable PDF for 2nd-4th grade students.',
    learningObjectives: ['Identify "division clue words" (share, group, each, split)', 'Determine the divisor and dividend from a narrative context', 'Translate real-world sharing scenarios into mathematical equations'],
    intro: 'Whether you\'re sharing apple slices with friends or grouping students for a game, you\'re using division. Our Division Word Problems worksheet takes math concepts and puts them into relatable stories, helping children see the practical power of "fair sharing." This practice builds critical reading skills along with mathematical fluency, preparing students for real-life problem solving.'
  },
  'doubles-near-doubles': {
    title: 'Doubles and Near-Doubles - Addition Strategy Practice | Wizqo',
    metaDescription: 'Learn the "doubles plus one" strategy for faster addition. Practice using known facts to solve new problems. Free PDF for 1st-2nd grade.',
    learningObjectives: ['Identify "near-doubles" (like 6+7) as a double plus one', 'Apply mental math shortcuts to increase addition speed', 'Strengthen the relationship between consecutive addition facts'],
    intro: 'If you know 6+6=12, then you already know 6+7! Our Doubles and Near-Doubles worksheet teaches students this powerful mental math shortcut. By identifying problems that are "just one away" from a known double, children build a network of connected math facts, making addition faster, more intuitive, and infinitely more confident.'
  },
  'draw-half': {
    title: 'Draw the Other Half - Symmetry & Art Challenge | Wizqo',
    metaDescription: 'Complete symmetric drawings by mirroring the provided half. A fun activity for spatial reasoning and art precision. Free printable PDF for kids.',
    learningObjectives: ['Identify the line of symmetry in various images', 'Practice mirroring details accurately across a central axis', 'Develop spatial reasoning and visual observation skills'],
    intro: 'Is your right thumb the same as your left? Our Draw the Other Half worksheet introduces students to the concept of bilateral symmetry. By carefully mirroring details to complete a drawing, children build the spatial reasoning skills used in geometry, biology, and advanced art. It\'s a fun, meditative challenge that rewards close observation and precise execution.'
  },
  'draw-shape': {
    title: 'Draw the Shape - Identifying and Drawing Polygons | Wizqo',
    metaDescription: 'Practice identifying and drawing standard geometric shapes. Help early learners master circles, squares, triangles, and rectangles. Free printable PDF.',
    learningObjectives: ['Accurately identify geometric shapes by name', 'Practice the manual motor skills needed to draw polygons', 'Understand the distinguishing features (sides, corners) of each shape'],
    intro: 'Every drawing starts with a shape. Our Draw the Shape worksheet helps children recognize and replicate the fundamental building blocks of geometry. By tracing and then free-hand drawing circles, squares, and triangles, young learners build the "visual library" and fine motor control needed for both art and mathematical diagrams.'
  },
  'elapsed-time-word-problems': {
    title: 'Elapsed Time Word Problems - Clock Logic Practice | Wizqo',
    metaDescription: 'Apply time calculation to real-world scenarios. Practice finding durations and end times in daily math stories. Free printable for grades 3-5.',
    learningObjectives: ['Determine the duration of events from narrative descriptions', 'Calculate end times given a start time and duration', 'Solve multi-step time problems involving AM and PM transitions'],
    intro: 'If a movie starts at 4:15 PM and lasts 1 hour and 45 minutes, when does it end? Our Elapsed Time Word Problems worksheet takes time calculation out of the abstract and into the real world. By solving scenarios related to travel, school schedules, and sports, students build the practical "clock logic" needed to manage their own time effectively.'
  },
  'equivalent-fractions-4th': {
    title: 'Equivalent Fractions (Grade 4) - Standard Mastery | Wizqo',
    metaDescription: 'Targeted practice for 4th-grade equivalent fraction standards. Use multiplication and division to find matching values. Free PDF download.',
    learningObjectives: ['Identify equivalent fractions using the "Fundamental Law of Fractions"', 'Use visual area models to prove fraction equality', 'Generate multiple equivalent forms for a single fraction (simplifying and expanding)'],
    intro: 'In 4th grade, students move beyond "looking" at equivalent fractions to "calculating" them. This worksheet focuses on the critical skill of multiplying or dividing the numerator and denominator by the same number to find equivalent values. It Provides a rigorous foundation for adding fractions with unlike denominators and simplifies the concept of "lowest terms."'
  },
  'estimating-sums-differences': {
    title: 'Estimating Sums and Differences - Mental Math Prep | Wizqo',
    metaDescription: 'Learn to round numbers to find "ballpark" answers. Practice estimation strategies for addition and subtraction. Free PDF for grades 3-5.',
    learningObjectives: ['Round numbers to the nearest ten or hundred before calculating', 'Compare estimated answers to exact answers to check for reasonableness', 'Understand when estimation is appropriate in real-world math'],
    intro: 'Is your answer "in the ballpark"? Our Estimating Sums and Differences worksheet teaches students that math isn\'t always about the exact number—it\'s often about finding a reliable approximation. By learning to round numbers before performing operations, children build a powerful "reasoning" skill that helps them catch errors and solve real-world problems quickly in their heads.'
  },
  'evaluating-expressions': {
    title: 'Evaluating Algebraic Expressions - Intro to Algebra | Wizqo',
    metaDescription: 'Learn to substitute numbers for variables. Practice solving equations by evaluating for x, y, and z. Free printable for 5th-6th grade.',
    learningObjectives: ['Understand the concept of a variable as a placeholder', 'Perform numerical substitution in basic algebraic equations', 'Apply the order of operations (PEMDAS) to evaluate complex expressions'],
    intro: 'Algebra is just a puzzle where some pieces are letters! Our Evaluating Expressions worksheet introduces students to the core concept of variables. By substituting specific numbers for x and y and then solving the equation, learners bridge the gap between basic arithmetic and high-level algebra, building the logical "if-then" thinking skills used in science and programming.'
  },
  'fact-families-20': {
    title: 'Fact Families to 20 - Addition & Subtraction Logic | Wizqo',
    metaDescription: 'Learn the relationship between three related numbers. Master all four facts in a family up to 20. Free printable for 1st and 2nd grade.',
    learningObjectives: ['Identify the three numbers that form a fact family', 'Write two addition and two subtraction equations for each family', 'Understand that addition and subtraction are inverse operations'],
    intro: 'Numbers like to hang out in families! Our Fact Families to 20 worksheet helps students see the deep connection between addition and subtraction. By understanding that "7, 8, and 15" always go together, children stop seeing math as isolated problems and start seeing the logical structure of numbers, making mental math faster and more accurate.'
  },
  'fact-families-mult-div': {
    title: 'Multiplication & Division Fact Families - Math Fluency | Wizqo',
    metaDescription: 'Connect inverse operations with our Fact Families worksheet. Master the relationship between multiplication and division. Free PDF for grades 3-4.',
    learningObjectives: ['Identify the "product" and "factors" in a multiplication/division family', 'Construct four related equations from three given numbers', 'Apply fact family logic to find missing numbers in equations'],
    intro: 'If you know 4 x 5 = 20, then you already know 20 ÷ 4 = 5! Our Multiplication and Division Fact Families worksheet reveals the dual nature of math operations. By practicing these "fact triangles," students build a robust mental model that makes learning division as easy as playing multiplication in reverse. This is a critical skill for building 3rd and 4th-grade math fluency.'
  },
  'feelings-checkin': {
    title: 'Daily Feelings Check-In - Social Emotional Wellness | Wizqo',
    metaDescription: 'Help kids identify and express their emotions with our daily check-in worksheet. Includes a "feelings wheel" and personal prompts. Free printable SEL.',
    learningObjectives: ['Identify and name current emotional states accurately', 'Track emotional patterns over time (days/weeks)', 'Develop a healthy vocabulary for self-expression and empathy'],
    intro: 'Checking in with your heart is just as important as checking in with your homework. Our Feelings Check-In worksheet provides a safe, structured space for students to identify their current mood and reflect on "the why" behind their emotions. This social-emotional learning tool helps build self-awareness and provides teachers and parents with a bridge for meaningful conversation.'
  },
  'find-number-1-10': {
    title: 'Find the Number (1-10) - Number Recognition Game | Wizqo',
    metaDescription: 'A fun "I Spy" style worksheet for identifying numerals 1-10. Strengthen visual tracking and number sense. Free printable for Pre-K and K.',
    learningObjectives: ['Identify numerals 1-10 on sight in a varied visual field', 'Differentiate between similar-looking numbers (like 6 and 9)', 'Build persistence and visual scanning skills through a game-like format'],
    intro: 'Can you find all the hidden number 3s? Our Find the Number worksheet turns number recognition into a fun "seek and find" adventure. By searching for specific numerals amidst a busy background, children strengthen their visual discrimination and tracking skills—the same skills they\'ll use to scan a line of text when they start reading.'
  },
  'fractions-decimals-percents': {
    title: 'Fractions, Decimals, and Percents - Triple Conversion | Wizqo',
    metaDescription: 'Learn to convert between the three "languages" of math. Practice identifying equivalent forms in our clear, printable worksheet. Free PDF.',
    learningObjectives: ['Translate a single value between fraction, decimal, and percent forms', 'Understand the common base of "100" for all three representations', 'Identify common equivalent sets (e.g., 1/2 = 0.5 = 50%) on sight'],
    intro: 'Whether you say "one-half," "point-five," or "fifty percent," you\'re talking about the same thing! Our Fractions, Decimals, and Percents worksheet helps students become "multi-lingual" in math. By practicing conversions between these three formats, learners gain the flexibility to choose the easiest form for any given problem, a hallmark of advanced mathematical thinking.'
  },
  'fractions-decimals-percents-advanced': {
    title: 'Advanced Fractions, Decimals, & Percents - Mastery Challenge | Wizqo',
    metaDescription: 'Complex conversions and real-world applications for 6th-8th grade math. Master non-standard fractions and repeating decimals. Free PDF.',
    learningObjectives: ['Convert non-standard fractions into their precise decimal and percent equivalents', 'Handle multi-step problems involving mixed formats', 'Apply conversion skills to complex real-world logic (interest rates, discounts, data)'],
    intro: 'Ready for a challenge? Our Advanced Fractions, Decimals, and Percents worksheet pushes students beyond the basics into non-standard values and multi-step logic. This mastery-level resource is designed to build the "fluency" needed for middle school algebra and high school sciences, ensuring students are comfortable handling any numerical representation with precision.'
  },
  'fractions-halves-thirds-fourths': {
    title: 'Understanding Halves, Thirds, and Fourths - Intro to Fractions | Wizqo',
    metaDescription: 'Identify basic parts of a whole with our introductory fraction worksheet. Perfect for 1st and 2nd grade. Free printable PDF.',
    learningObjectives: ['Partition shapes into equal parts (halves, thirds, fourths)', 'Identify shaded portions using basic fraction terminology', 'Understand that more parts mean smaller individual sizes'],
    intro: 'Sharing a pizza is the best way to learn math! Our Halves, Thirds, and Fourths worksheet introduces the foundational concept of a "fraction" as an equal part of a whole. By visually partitioning shapes and identifying sections, young learners build the vocabulary and spatial understanding that will support all their future work with numbers smaller than one.'
  },
  'fraction-mult': {
    title: 'Multiplying Fractions - Step-by-Step Practice | Wizqo',
    metaDescription: 'Learn the "across and across" rule for fraction multiplication. Practice with models and equations. Free printable PDF for 5th grade math.',
    learningObjectives: ['Multiply numerators and denominators accurately', 'Understand why multiplying fractions results in a smaller value', 'Simplify the resulting product to its lowest terms'],
    intro: 'Multiplying fractions is often easier than adding them! Our Multiplying Fractions worksheet teaches the simple "across and across" method—numerator times numerator, denominator times denominator. With visual models to show that "1/2 of 1/2" is actually 1/4, students gain both the procedural skill and the conceptual understanding needed for upper elementary math.'
  },
  'fraction-mult-whole': {
    title: 'Multiplying Fractions by Whole Numbers - Math Skills | Wizqo',
    metaDescription: 'Learn to scale whole numbers using fractions. Practice with repeated addition and multiplication models. Free PDF for 4th and 5th grade.',
    learningObjectives: ['Understand a whole number as a fraction with a denominator of 1', 'Scale whole numbers using fractional multipliers', 'Translate real-world "groups of fractions" scenarios into equations'],
    intro: 'What is 3 groups of 1/4? Our Multiplying Fractions by Whole Numbers worksheet bridges the gap between repeated addition and multiplication. By visualizing whole numbers as groups of parts, students learn to scale values accurately, a skill essential for understanding recipes, measurements, and scientific proportions.'
  },
  'fractions-number-line': {
    title: 'Fractions on a Number Line - Linear Place Value | Wizqo',
    metaDescription: 'Learn to plot and identify fractions between 0 and 1. Strengthen your "fraction sense" with our printable number line worksheet. Free PDF.',
    learningObjectives: ['Identify the location of specific fractions on a provided number line', 'Partition a number line into equal segments (tenths, eighths, etc.)', 'Understand the relative value of fractions by their physical proximity to 0 and 1'],
    intro: 'Fractions aren\'t just "parts of a circle"—they are real numbers with a specific place on the map. Our Fractions on a Number Line worksheet helps students visualize the "linear" value of numbers smaller than one. By plotting points between 0 and 1, learners develop a robust "number sense" that prevents common errors and prepares them for decimals and coordinate graphing.'
  },
  'fractions-of-group': {
    title: 'Fractions of a Group - Understanding Parts of a Whole | Wizqo',
    metaDescription: 'Learn to calculate fractions within a set of objects. Practice identifying 1/3 of a group of 9 and more. Free printable PDF for grades 2-4.',
    learningObjectives: ['Apply fraction concepts to discrete sets of objects', 'Calculate the fractional value of a specific group size', 'Understand that a "whole" can be made of multiple individual units'],
    intro: 'Fractions aren\'t just for pizzas! Our Fractions of a Group worksheet teaches students how to apply parts-of-a-whole logic to sets of objects like marbles, stars, or animals. By dividing a group into equal sections, children learn that 1/4 of 12 is just 3, building the foundation for multiplication and division in a fun, visual way.'
  },
  'fractions-parts-of-set': {
    title: 'Fractions as Parts of a Set - Discrete Math Practice | Wizqo',
    metaDescription: 'Identify the fractional representation of specific items in a set. Practice with colorful objects and shapes. Free PDF for 3rd and 4th grade.',
    learningObjectives: ['Identify the numerator as the specific subset and denominator as the total set', 'Create fraction representations based on visual data', 'Differentiate between continuous (area) and discrete (set) fraction models'],
    intro: 'What fraction of the birds are flying? Our Fractions as Parts of a Set worksheet challenges students to look at a group of objects and identify how many meet a certain criteria. This practice is essential for moving beyond simple "area models" and understanding how fractions represent real-world data and statistics in everyday life.'
  },
  'fractions-word-problems': {
    title: 'Fraction Word Problems - Real-World Sharing Scenarios | Wizqo',
    metaDescription: 'Apply fraction arithmetic to daily stories! Practice adding, subtracting, and comparing parts of a whole in context. Free printable for grades 3-5.',
    learningObjectives: ['Identify "fractional clue words" in narrative descriptions', 'Select the correct operation (addition/subtraction) for a fraction scenario', 'Simplify resulting fractional answers to their lowest terms'],
    intro: 'Math helps us share! Our Fraction Word Problems worksheet takes students through relatable scenarios involving cooking, sharing toys, and measuring distance. By translating these stories into mathematical equations, learners build the critical reading skills and "fraction sense" needed to solve complex problems with confidence and accuracy.'
  },
  'geometric-patterns': {
    title: 'Geometric Patterns - Logic and Visual Sequencing | Wizqo',
    metaDescription: 'Identify and extend patterns using geometric shapes. Build spatial reasoning and prediction skills. Free printable for grades K-2 math.',
    learningObjectives: ['Recognize repeating units in shape-based sequences', 'Predict upcoming shapes based on established geometric logic', 'Create original multi-attribute patterns using size, shape, and color'],
    intro: 'Geometry is the study of predictable shapes. Our Geometric Patterns worksheet helps young learners see the logic in how figures repeat and transform. By identifying and extending these sequences, students build the spatial reasoning and predictive thinking skills that are foundational for everything from computer coding to advanced trigonometry.'
  },
  'greater-than-less-than-100': {
    title: 'Greater Than & Less Than to 100 - Number Comparison | Wizqo',
    metaDescription: 'Practice comparing numbers up to 100. Master the use of <, >, and = symbols. Free printable for 1st and 2nd grade math readiness.',
    learningObjectives: ['Successfully use comparison symbols with numbers up to 100', 'Compare numbers by analyzing tens and ones place value digits', 'Identify numerical order and relative scale on a number line'],
    intro: 'Which number is bigger: 78 or 87? Our Greater Than and Less Than to 100 worksheet helps students navigate the "greater than" alligator and the "less than" bird. By focusing on place-value logic, children learn to quickly compare any two-digit numbers, building the numerical confidence needed for regrouping and multi-digit math.'
  },
  'intro-to-angles-for-kids': {
    title: 'Introduction to Angles - Geometry Basics for Kids | Wizqo',
    metaDescription: 'Learn what an angle is and how to identify right, acute, and obtuse corners. Fun and simple geometry for Kindergarten to 2nd grade. Free PDF.',
    learningObjectives: ['Understand an angle as a measure of "turn" or a corner', 'Identify "square" (right) angles in common objects', 'Distinguish between small (acute) and large (obtuse) rotations'],
    intro: 'Where two lines meet, an angle is born! Our Introduction to Angles worksheet makes geometry approachable for early learners. By looking at everyday corners—like the corner of a book or the hands of a clock—children build a foundational understanding of rotation and measurement, preparing them for more complex geometry in the years to come.'
  },
  'intro-to-fractions-4th': {
    title: 'Introduction to Fractions (Grade 4) - Concepts & Models | Wizqo',
    metaDescription: 'Master the basics of numerators and denominators. Practice representing fractions with models and on number lines. Free PDF for 4th-grade math.',
    learningObjectives: ['Define the roles of the numerator and denominator', 'Represent fractions using area models, sets, and linear measurements', 'Understand the concept of a "unit fraction" (1/n)'],
    intro: 'Fourth grade is when fractions become "official"! This introductory worksheet covers the core terminology and representations required by 4th-grade standards. From defining denominators to drawing area models, students build the rock-solid conceptual foundation needed to move into equivalent fractions and fraction arithmetic with absolute total confidence.'
  },
  'lattice-mult': {
    title: 'Lattice Multiplication - Alternative Visual Strategy | Wizqo',
    metaDescription: 'Learn to multiply using the lattice/diagonal method. A great visual tool for students who struggle with standard algorithms. Free printable PDF.',
    learningObjectives: ['Construct and fill a multiplication lattice grid accurately', 'Multiply single digits and record products in diagonal boxes', 'Sum diagonals to find the final multi-digit product'],
    intro: 'Standard algorithms aren\'t the only way to multiply! Our Lattice Multiplication worksheet introduces a fascinating visual method that breaks large products into simple single-digit steps. For many students, this "grid" approach reduces mental clutter and prevents alignment errors, making multi-digit multiplication feel like an organized and rewarding puzzle.'
  },
  'letter-recognition': {
    title: 'Alphabet Letter Recognition - Pre-K Literacy Skills | Wizqo',
    metaDescription: 'Practice identifying uppercase and lowercase letters. Fun "find and color" activities for early readers. Free printable PDF.',
    learningObjectives: ['Correctly identify all 26 letters of the alphabet on sight', 'Distinguish between similar-looking letters (like b, d, p, q)', 'Connect the visual shape of a letter to its spoken name'],
    intro: 'Naming the letters is the very first step in learning to read! Our Letter Recognition worksheet provides a variety of engaging activities—from find-and-color to letter mazes—designed to help children become fluent in the shapes of the alphabet. This practice ensures that when they start decoding words, they won\'t be slowed down by "letter confusion."'
  },
  'liquid-volume-word-problems': {
    title: 'Liquid Volume Word Problems - Capacity Practice | Wizqo',
    metaDescription: 'Solve math stories involving liters, milliliters, cups, and gallons. Practice capacity calculations in context. Free printable for grades 3-5.',
    learningObjectives: ['Apply addition and subtraction to liquid measurement scenarios', 'Understand the relative scale of common capacity units (e.g., cups vs. gallons)', 'Select the appropriate unit for different liquid containers'],
    intro: 'How much water is in the tank? Our Liquid Volume Word Problems worksheet takes students through scenarios involving cooking, science experiments, and daily life. By solving problems using standard and metric units of capacity, children build the practical math skills needed to follow recipes and understand scientific data involving liquids.'
  },
  'long-division-2digit': {
    title: 'Long Division with 2-Digit Divisors - Advanced Math | Wizqo',
    metaDescription: 'Master the complete long division algorithm with larger numbers. Practice estimating and dividing by two digits. Free PDF for 5th-6th grade.',
    learningObjectives: ['Use estimation to find plausible quotients for 2-digit divisors', 'Execute the DMSB (Divide-Multiply-Subtract-Bring Down) algorithm with precision', 'Check multi-digit division results using inverse multiplication'],
    intro: 'Breaking into 2-digit divisors is the ultimate division challenge! Our Long Division with 2-Digit Divisors worksheet provides the structured support students need to master this complex algorithm. By focusing on estimation and careful alignment, learners gain the stamina and accuracy required for middle school math and advanced financial calculations.'
  },
  'lowercase-alphabet': {
    title: 'Lowercase Letter Writing and Recognition - Literacy | Wizqo',
    metaDescription: 'Master the "small" letters of the alphabet. Practice writing and identifying lowercase a-z. Free printable for Preschool and Kindergarten.',
    learningObjectives: ['Correctly identify all 26 lowercase letter forms', 'Practice proper stroke order for lowercase letter formation', 'Distinguish between lowercase and uppercase "pairings"'],
    intro: 'Most of the words we read are in lowercase! Our Lowercase Alphabet worksheet focuses exclusively on the smaller letter forms, helping children develop the specific muscle memory and visual recognition needed for fluent reading and writing. This targeted practice is essential for building the foundational literacy skills that turn early learners into confident writers.'
  },
  'mascot-stickers': {
    title: 'Printable Mascot Stickers - Classroom Rewards & Fun | Wizqo',
    metaDescription: 'Download and color our official mascot designs! Perfect for classroom rewards, planners, and creative projects. Free printable PDF.',
    learningObjectives: ['Promote a positive and fun classroom learning environment', 'Encourage careful coloring and attention to detail', 'Foster a sense of belonging and "team spirit" through mascots'],
    intro: 'Meet the Wizqo mascots! Our Mascot Stickers worksheet provides 12 adorable designs that students can color and cut out. Whether used as rewards for "math mastery" or just for decorating a notebook, these characters help make the learning journey feel like a friendly and creative adventure. Simply print on sticker paper for the full effect!'
  },
  'mass-weight-word-problems': {
    title: 'Mass and Weight Word Problems - Measurement Math | Wizqo',
    metaDescription: 'Solve math stories involving grams, kilograms, ounces, and pounds. Practice weight calculations in context. Free printable for grades 3-5.',
    learningObjectives: ['Navigate between mass (metric) and weight (customary) scenarios', 'Perform addition and subtraction with various weight units', 'Apply measurement logic to real-world objects and animal weights'],
    intro: 'How heavy is a baby elephant? Our Mass and Weight Word Problems worksheet challenges students to use their math skills to solve realistic scenarios involving heavy and light objects. By working with both metric and customary systems, children build the foundational science and math logic needed to understand the world of physical measurement.'
  },
  'match-column': {
    title: 'Match the Column - Logical Association Practice | Wizqo',
    metaDescription: 'Connect related items across two columns. Practice logic, categorization, and vocabulary matching. Free printable for K-2 education.',
    learningObjectives: ['Identify logical relationships between disparate items', 'Practice visual-motor skills by drawing connecting lines', 'Categorize objects based on shared attributes or "pairs"'],
    intro: 'Matching is the foundation of logic. Our Match the Column worksheet asks students to find the "partner" for various items across a page. This classic activity strengthens categorization skills and visual tracking, helping children learn to see the patterns and relationships that connect everything from animals and their food to letters and their sounds.'
  },
  'match-number-1-10': {
    title: 'Match the Number (1-10) - Kindergarten Math Skills | Wizqo',
    metaDescription: 'Connect written numbers to their quantities. Practice identifying and matching 1-10 with our fun, printable math worksheet. Free PDF download.',
    learningObjectives: ['Connect numerical symbols (1-10) with visual quantities', 'Strengthen one-to-one correspondence for early learners', 'Build the visual-motor skills needed for matching and categorization'],
    intro: 'Numbers are all around us! Our Match the Number 1-10 worksheet helps early learners connect the "symbol" for a number with the "amount" it represents. By drawing lines between numerals and colorful groups of objects, children build a rock-solid foundation for counting and basic addition, making their transition into Kindergarten math smooth and successful.'
  },
  'match-picture-1-10': {
    title: 'Match the Pictures (1-10) - Visual Recognition & Logic | Wizqo',
    metaDescription: 'Identify identical groups of objects. Practice visual discrimination and counting 1-10 with our fun matching worksheet. Free PDF for kids.',
    learningObjectives: ['Identify identical quantities across different visual representations', 'Practice visual discrimination and pattern matching', 'Reinforce counting skills within a 1-10 range'],
    intro: 'Can you find the matching pairs? Our Match the Picture worksheet turns counting into a fun visual game. By identifying sets of objects that share the same quantity, children build their observation skills and numerical focus. This activity is perfect for preschoolers who are just starting to understand that numbers represent concrete amounts in the real world.'
  },
  'match-shape': {
    title: 'Match the Shape - Geometry & Visual Discrimination | Wizqo',
    metaDescription: 'Connect identical geometric figures. Practice identifying circles, squares, and triangles with our fun matching worksheet. Free printable for Pre-K.',
    learningObjectives: ['Identify and name basic 2D geometric shapes', 'Match shapes based on their visual properties (sides, corners)', 'Strengthen the fine motor control used in drawing lines'],
    intro: 'The world is full of shapes! Our Match the Shape worksheet helps young learners identify the "building blocks" of geometry by connecting identical figures. Whether it\'s matching a round circle or a pointy triangle, children build the visual discrimination skills needed for both reading readiness and mathematical thinking. A perfect low-stress activity for early childhood centers!'
  },
  'maze-logic': {
    title: 'Maze Logic - Problem Solving & Focus Challenge | Wizqo',
    metaDescription: 'Navigate through complex paths to build concentration and planning skills. Fun printable logic mazes for kids of all ages. Free PDF.',
    learningObjectives: ['Develop spatial planning and foresight with path-finding', 'Improve concentration and visual attention to detail', 'Strengthen fine motor control and pencil-line accuracy'],
    intro: 'Think ahead to find the way out! Our Maze Logic worksheet is a workout for the "planning" part of a child\'s brain. By navigating twists and turns to reach a goal, students build patience and persistence while sharpening their spatial reasoning. It\'s a fun, reward-driven way to improve the focus and precision needed for both art and academic subjects.'
  },
  'maze-mult': {
    title: 'Multiplication Maze - Math Facts Discovery Fun | Wizqo',
    metaDescription: 'Solve multiplication problems to find the path! Combine math practice with engaging maze puzzles. Free printable PDF for grades 2-4.',
    learningObjectives: ['Practice multiplication facts through an engaging game format', 'Identify correct math solutions to unlock a path', 'Build numerical fluency and concentration simultaneously'],
    intro: 'Who says multiplication is boring? Our Multiplication Maze turns math practice into a high-stakes adventure! To find the correct route through the puzzle, students must solve multiplication problems at every turn. Only the correct answers lead to the goal, making this a self-correcting and highly motivating way to master times tables without the stress of traditional drills.'
  },
  'measurement-word-problems': {
    title: 'Measurement Word Problems - Length, Area, & Volume | Wizqo',
    metaDescription: 'Apply measurement formulas to real-world stories! Practice calculating dimensions in context. Free printable for grades 3-5 math.',
    learningObjectives: ['Identify the correct measurement attribute (length, area, height) from a story', 'Apply appropriate units and formulas to solve multi-step scenarios', 'Verify results using estimation and real-world logic'],
    intro: 'Measuring the real world requires math! Our Measurement Word Problems worksheet takes students from the classroom into the backyard and the workshop. By solving stories about building fences, tiling floors, and filling containers, children learn the practical purpose behind geometry and arithmetic formulas, building the stamina needed for complex scientific and engineering tasks.'
  },
  'metric-conversion': {
    title: 'Metric Unit Conversion Practice - Meters, Grams, Liters | Wizqo',
    metaDescription: 'Master the powers of 10! Learn to convert between milli, centi, and kilo units with our clear metric worksheet. Free PDF for grades 4-6.',
    learningObjectives: ['Understand the base-ten structure of the metric system', 'Convert between units by shifting decimal points (powers of 10)', 'Apply metric logic to real-world science and medicine scenarios'],
    intro: 'The metric system is the language of science! Our Metric Unit Conversion worksheet teaches students the elegant logic of a system based entirely on powers of ten. By shifting decimals to move between millimeters and meters, or grams and kilograms, learners build the international mathematical fluency used by scientists, doctors, and engineers across the globe.'
  },
  'missing-addends-10': {
    title: 'Missing Addends within 10 - Intro to Algebraic Thinking | Wizqo',
    metaDescription: 'Find the hidden number to make ten! Practice part-part-whole relationships with our missing addends worksheet. Free PDF for K-1 math.',
    learningObjectives: ['Identify the missing part of a whole within 10', 'Develop an intuitive sense of "ten-partners" (e.g., 6+_=10)', 'Shift from simple calculation to solving equations'],
    intro: 'Math is like a puzzle with missing pieces! Our Missing Addends within 10 worksheet introduces students to the algebraic concept of finding an unknown value. By using ten-frames and numerical logic to find "the hidden number," children move beyond basic counting and start thinking about the relationships between numbers—the core of all future mathematical success.'
  },
  'missing-factors-mult': {
    title: 'Missing Factors - Multiplication & Algebra Prep | Wizqo',
    metaDescription: 'Master your times tables by finding the hidden factor. Practice 4 x _ = 12 and more. Free printable PDF for grades 2-4.',
    learningObjectives: ['Determine the missing factor in a multiplication equation', 'Connect multiplication to its inverse operation (division)', 'Strengthen mental math recall for multiplication facts'],
    intro: 'Take your multiplication to the next level! Our Missing Factors worksheet challenges students to work backwards to solve equations. By finding the "mystery multiplier," children build the logical bridge to algebra while reinforcing their times-table fluency. This practice is essential for mastering division and understanding the "why" behind the numbers.'
  },
  'missing-number-sequence': {
    title: 'Missing Number Sequences - Logical Patterns & Counting | Wizqo',
    metaDescription: 'Fill in the blanks to complete the number line. Practice skip counting and sequential logic. Free printable for Kindergarten and 1st Grade.',
    learningObjectives: ['Recall the correct order of numbers up to 100', 'Identify and apply skip-counting rules (by 2s, 5s, 10s)', 'Develop predictive thinking by extending established sequences'],
    intro: 'Every number has a special place in line! Our Missing Number Sequences worksheet helps students master the flow of counting by identifying where specific digits belong. From simple 1-20 strings to complex skip-counting patterns, this activity builds the "mental number line" that is essential for understanding addition, subtraction, and relative numerical scale.'
  },
  'money-identifying-coins': {
    title: 'Identifying Coins and Bills - Money Foundations | Wizqo',
    metaDescription: 'Learn to recognize pennies, nickels, dimes, quarters, and dollars. Practice matching names to values. Free PDF for K-2 math readiness.',
    learningObjectives: ['Visually distinguish between different denominations of US currency', 'Correctly associate coin and bill names with their numerical values', 'Understand the physical attributes (color, size, edges) of money'],
    intro: 'What makes a dime different from a penny? Our Identifying Coins and Bills worksheet introduces students to the visual and numerical world of currency. By learning to spot the distinct faces, sizes, and colors of money, children build the foundational "financial literacy" used for shopping, saving, and solving real-world math word problems.'
  },
  'money-word-problems': {
    title: 'Money Word Problems - Real-World Financial Math | Wizqo',
    metaDescription: 'Solve math stories involving shopping, change, and saving! Practice adding and subtracting money in context. Free PDF for grades 2-4.',
    learningObjectives: ['Apply addition and subtraction to monetary scenarios', 'Calculate "change back" from a transaction accurately', 'Interpret multi-step word problems involving several denominations'],
    intro: 'Math helps us shop! Our Money Word Problems worksheet takes students to the register, challenging them to calculate total costs and figure out change. By applying arithmetic to dollar signs and decimals, learners build the practical confidence needed to handle their own allowances and understand the value of money in a bustling marketplace.'
  },
  'mult-arrays': {
    title: 'Creating and Reading Multiplication Arrays - Visual Math | Wizqo',
    metaDescription: 'Master the rows and columns method for multiplication. Practice drawing and identifying arrays. Free printable for 2nd and 3rd grade.',
    learningObjectives: ['Visualize multiplication as a grid-based area model', 'Correctly identify the number of rows and columns in an array', 'Translate visual grids into multiplication and addition equations'],
    intro: 'You can see multiplication! Our Multiplication Arrays worksheet helps students move beyond rote memorization by illustrating math problems as functional patterns of dots or shapes. By counting "rows" and "columns," children develop a deep, concrete understanding of what multiplication actually represents, making it easier to solve equations and handle larger numbers with confidence.'
  },
  'multiplication-color-by-number': {
    title: 'Multiplication Color by Number - Math Facts & Art | Wizqo',
    metaDescription: 'Practice your times tables while creating beautiful artwork! Solve multiplication problems to reveal the hidden colors. Free PDF.',
    learningObjectives: ['Practice multiplication facts 1-12 in an engaging creative context', 'Improve concentration and precision through detail-oriented art', 'Increase motivation for repetitive math drill through artistic reward'],
    intro: 'Make your math facts pop with color! Our Multiplication Color by Number worksheet turns the challenge of learning times tables into a creative masterpiece. To uncover the image, students must solve multiplication problems and follow the color-coded guide. It\'s the perfect stress-free resource for building speed and accuracy while keeping students joyful and engaged.'
  },
  'mult-word-problems-4th': {
    title: '4th Grade Multiplication Word Problems - Mastery Practice | Wizqo',
    metaDescription: 'Advanced multiplication scenarios for 4th-grade standards. Solve multi-digit and multi-step stories. Free PDF with answer key.',
    learningObjectives: ['Extract pertinent math data from complex multi-sentence stories', 'Solve multi-digit multiplication problems within a real-world context', 'Select the appropriate strategy (Standard, Area Model) for each problem'],
    intro: 'Multiplication is more than just equations—it\'s a tool for solving big problems! Our 4th Grade Multiplication Word Problems worksheet presents students with complex, realistic scenarios that require the application of multi-digit math. This practice builds the stamina and critical thinking skills needed for 5th grade and middle school, ensuring learners can handle any "story" the world throws at them.'
  },
  'name-writing': {
    title: 'Name Writing Practice - Personalized Literacy Skills | Wizqo',
    metaDescription: 'Help your child master their most important word: their name! Practice letter formation and spelling with our printable name writing sheet. Free PDF.',
    learningObjectives: ['Learn the correct spelling and sequence of own name', 'Practice proper uppercase and lowercase letter formation', 'Develop the muscle memory and pencil control needed for refined writing'],
    intro: 'The most important word a child will ever learn to write is their own name. Our Name Writing Practice worksheet provides the structured support early learners need to master this vital literacy milestone. By tracing and then free-hand writing each letter, children build the foundational motor skills and self-confidence that turn "writing" from a challenge into a source of pride.'
  },
  'number-id-20': {
    title: 'Number Identification 1-20 - Math Fluency Prep | Wizqo',
    metaDescription: 'Identify numbers up to 20 on sight. Practice distinguishing between "teen" numbers with our fun, printable recognition worksheet. Free PDF.',
    learningObjectives: ['Accurately identify numerals 1-20 in isolation and groups', 'Correctly name each number from 1 to 20 on sight', 'Build the numerical speed needed for Kindergarten and 1st-grade math'],
    intro: 'Identifying the "teens" is a major step in every math journey! Our Number Identification 1-20 worksheet helps students navigate the tricky transition beyond ten. By identifying and naming numbers in a variety of visual formats, children build the sight-recognition skills needed for counting, addition, and base-ten understanding. A perfect resource for classroom centers and morning work!'
  },
  'number-line-id-20': {
    title: 'Missing Numbers on a 1-20 Number Line - Math Logic | Wizqo',
    metaDescription: 'Fill in the blanks on a 1-20 number line. Strengthen sequential counting and relative numerical scale. Free printable PDF for early learners.',
    learningObjectives: ['Recall the correct sequence of numbers from 1 to 20', 'Identify the numerical distance between specific points on a line', 'Understand the concepts of "before," "after," and "between"'],
    intro: 'Every number has a special neighbor! Our Missing Numbers on a 1-20 Number Line worksheet helps children visualize the order of the digits they use every day. By filling in the blanks on a linear map, students build a robust "mental number line" that makes addition and subtraction intuitive and prepares them for more complex multi-digit math later on.'
  },
  'number-line-skip-count': {
    title: 'Skip Counting on the Number Line - Pattern Practice | Wizqo',
    metaDescription: 'Practice counting by 2s, 5s, and 10s using a visual number line. Build the foundations for multiplication. Free printable for grades 1-2.',
    learningObjectives: ['Identify skip-counting patterns visually on a number line', 'Predict the next number in a sequence based on a specific interval', 'Understand that multiplication is just "jumps" of the same size'],
    intro: 'Skip counting is like taking giant steps on a map! Our Skip Counting on the Number Line worksheet turns pattern-finding into a visual adventure. By jumping across a number line in groups of 2, 5, or 10, students build the "multiplication sense" needed for times tables and division. It\'s a fun, rhythmic way to master the foundations of arithmetic.'
  },
  'number-line-sums-differences': {
    title: 'Sums and Differences on the Number Line - Visual Math | Wizqo',
    metaDescription: 'Use a number line to solve addition and subtraction problems. Practice "jumping" forward and backward. Free PDF for 1st grade math.',
    learningObjectives: ['Solve addition problems by counting forward on a number line', 'Solve subtraction problems by counting backward from a starting point', 'Visualize the abstract concepts of "+" and "-" as physical movement'],
    intro: 'Math is a journey! Our Sums and Differences on the Number Line worksheet helps young learners see addition and subtraction as physical steps. By "jumping" forward for more or backward for less, children gain a concrete understanding of how operations change a number\'s value. This visual tool is essential for students who are moving beyond finger-counting into mental math.'
  },
  'number-matching-1-10': {
    title: 'Number Matching 1-10 - Early Math & Logic Prep | Wizqo',
    metaDescription: 'Connect numerals to their visual quantity pairs. Fun "find and match" worksheet for Pre-K and Kindergarten. Free printable PDF download.',
    learningObjectives: ['Identify numerals 1-10 and their corresponding quantities', 'Match identical number sets across disparate visual fields', 'Build visual discrimination and tracking skills through a matching game'],
    intro: 'Matching symbols to amounts is where math begins! Our Number Matching 1-10 worksheet provides a series of engaging puzzles that ask students to connect written numbers with the groups they represent. This activity builds the "number sense" and visual focus needed for Kindergarten math, helping children feel confident and successful from their very first lesson.'
  },
  'number-order-1-20': {
    title: 'Number Ordering 1-20 - Sequential Counting Practice | Wizqo',
    metaDescription: 'Arrange scrambled numbers in the correct sequence. Master the 1-20 counting chain with our clear, printable worksheet. Free PDF download.',
    learningObjectives: ['Identify the correct hierarchical order of numbers up to 20', 'Sort scrambled numerical sets from least to greatest', 'Reinforce the "counting on" strategy for early addition'],
    intro: 'Can you put these numbers back in line? Our Number Ordering 1-20 worksheet challenges students to fix "scrambled" sequences. By identifying which number comes first, next, and last, children build the sequential logic needed for counting and basic comparison. This activity is a vital step in ensuring students don\'t just memorize number names, but actually understand how they relate to each other.'
  },
  'number-order-1-30': {
    title: 'Number Ordering 1-30 - Advanced Counting Sequence | Wizqo',
    metaDescription: 'Master counting and sequencing up to 30. Practice arranging numbers in their correct order. Free printable PDF for Kindergarten and 1st Grade.',
    learningObjectives: ['Maintain sequential accuracy in larger numerical ranges (1-30)', 'Identify and correct errors in provided number strings', 'Build the numerical stamina needed for 1st-grade math standards'],
    intro: 'Ready to go beyond twenty? Our Number Ordering 1-30 worksheet pushes students to maintain their sequential focus as the numbers get larger. Regular practice arranging these values helps cement their shape and order, preparing children for the 100-chart and basic addition. A perfect resource for bridging the gap between preschool and elementary school math!'
  },
  'number-patterns': {
    title: 'Identifying Number Patterns - Intro to Sequences | Wizqo',
    metaDescription: 'Find the rule and extend the sequence! Practice identifying patterns in addition and subtraction. Free printable for grades 2-4 math.',
    learningObjectives: ['Identify the arithmetic "rule" (e.g., +3) in a numerical sequence', 'Accurately extend patterns based on identified logic', 'Understand the relationship between consecutive numbers in a string'],
    intro: 'Patterns are the secret language of math! Our Identifying Number Patterns worksheet helps students become "math detectives" who find the hidden logic in numerical sequences. Whether the pattern involves adding two or five, this worksheet provides the perfect playground for building observation skills and mathematical reasoning—the core of all future success in algebra.'
  },
  'number-patterns-subtraction': {
    title: 'Subtraction Patterns - Decreasing Number Sequences | Wizqo',
    metaDescription: 'Identify and extend patterns that count backwards. Practice finding the "minus rule" in number strings. Free PDF for grades 2-4.',
    learningObjectives: ['Identify the "rule" for a decreasing numerical sequence', 'Accurately extend backwards-counting patterns', 'Strengthen mental math subtractive fluency'],
    intro: 'Math doesn\'t just go up—it goes down, too! Our Subtraction Patterns worksheet challenges students to find the logic in sequences that count backwards. By identifying the rule (like "minus 10" or "minus 3"), children build a deep intuition for subtraction and numerical scale, making mental calculations faster and more confident in any direction.'
  },
  'number-recognition-120': {
    title: 'Number Recognition to 120 - 1st Grade Math Standards | Wizqo',
    metaDescription: 'Master the full 120-chart! Practice identifying and writing numbers up to 120 with our clear, printable worksheet. Free PDF download.',
    learningObjectives: ['Confidently identify and name any number from 1 to 120', 'Understand the repeating structure of the base-ten system', 'Transition from basic counting to advanced 1st-grade standards'],
    intro: 'The 120-chart is the map for 1st-grade math. Our Number Recognition to 120 worksheet helps students master the bridge between one hundred and the "teens" that follow. By identifying numbers throughout the chart, learners build a rock-solid understanding of place value and the Repeating patterns of our base-ten system, ensuring they never feel "lost" in larger numbers.'
  },
  'number-tracing-1-10': {
    title: 'Number Tracing 1-10 - Fine Motor & Math Readiness | Wizqo',
    metaDescription: 'Learn to write numbers 1-10 properly! Guided tracing for preschoolers and kindergarteners. Free printable PDF for early writing.',
    learningObjectives: ['Apply proper stroke order for numeral formation (1-10)', 'Develop the fine motor control needed for legible writing', 'Reinforce the visual shape of foundational numbers'],
    intro: 'Every great mathematician starts by learning to hold a pencil! Our Number Tracing 1-10 worksheet provides the guided support early learners need to form their first digits. By following the dots and practicing with repetition, children build the muscle memory and "visual-motor" skills that make writing numbers feel natural and successful. A bright, fun start to any preschool day!'
  },
  'number-tracing-1-20': {
    title: 'Number Tracing 1-20 - Early Writing & Fluency | Wizqo',
    metaDescription: 'Practice writing numbers through the "teens"! Guided tracing for numerals 1-20. Free printable PDF for Kindergarten and 1st grade.',
    learningObjectives: ['Master the formation of two-digit numbers up to 20', 'Improve hand-eye coordination and spatial alignment on a line', 'Build writing stamina for multi-numeral math problems'],
    intro: 'Tracing moves into the double digits! Our Number Tracing 1-20 worksheet helps children master the tricky transition from single numbers to "teen" pairs. By practicing the formation of 11 through 20 with guided dots, students gain the confidence to write larger values cleanly and clearly, a vital skill for success in Kindergarten and 1st-grade math.'
  },
  'number-tracing-1-30': {
    title: 'Number Tracing 1-30 - Advanced Writing Practice | Wizqo',
    metaDescription: 'Expand writing skills beyond 20! Tracing practice for numbers up to 30. Free printable for parents and teachers. Free PDF download.',
    learningObjectives: ['Maintain writing accuracy and form for numbers through 30', 'Practice consistent numeral scale and alignment on a page', 'Reinforce sequential knowledge while building fine motor endurance'],
    intro: 'Ready for thirty? Our Number Tracing 1-30 worksheet pushes students to maintain their writing form as the numbers get larger. Regular practice writing these digits helps cement their shape and order, ensuring that when students start addition and subtraction with larger values, they can record their work with total confidence and clarity. A must-have for the 1st grade classroom!'
  },
  'number-words-1-10': {
    title: 'Number Words 1-10 - Literacy & Math Integration | Wizqo',
    metaDescription: 'Learn to read and write number names! Practice matching numerals to words like "one" and "ten." Free printable PDF for early readers.',
    learningObjectives: ['Connect written number names (one, two, etc.) to their numerals', 'Identify number words on sight in a variety of contexts', 'Bridge the gap between math symbols and literacy skills'],
    intro: 'Numbers are also words! Our Number Words 1-10 worksheet helps students learn the "literacy side" of math. By practicing how to read and write words like "one," "five," and "ten," children bridge the gap between their phonics lessons and their math skills. This integrated approach ensures that they are ready to tackle word problems and higher-level text-based mathematics.'
  },
  'number-words-11-20': {
    title: 'Number Words 11-20 - Literacy & Math Skills | Wizqo',
    metaDescription: 'Learn to read and spell the "teen" number names. Practice matching 11-20 with words like "eleven" and "twenty." Free printable PDF.',
    learningObjectives: ['Correctly spell and identify written number words from 11 to 20', 'Understand the linguistic patterns of "teen" numbers', 'Bridge the gap between numerical symbols and written English'],
    intro: 'Eleven, twelve, thirteen... the "teens" can be tricky! Our Number Words 11-20 worksheet helps students master the unique spelling and sound of these essential numbers. By practicing how to read and write these names, children build the foundational literacy skills needed for word problems and academic storytelling. A perfect resource for 1st and 2nd-grade integrated learning!'
  },
  'odd-even-sorting': {
    title: 'Odd or Even? Number Property Sorting - Math Logic | Wizqo',
    metaDescription: 'Categorize numbers by their parity. Practice the "pairing" rule to identify even and odd values up to 50. Free printable for grades 1-2.',
    learningObjectives: ['Distinguish between odd and even numbers based on the ones digit', 'Apply the mathematical concept of parity to diverse numerical sets', 'Understand that even numbers can be divided into two equal whole-number groups'],
    intro: 'Is it even Stevens or odd man out? Our Odd or Even Sorting worksheet helps students categorize numbers by looking for "partners." By identifying which values end in 0, 2, 4, 6, or 8, children gain a deep intuition for division and number relationships. This foundational sorting activity is the first step toward understanding remainders and advanced arithmetic patterns.'
  },
  'one-more-one-less': {
    title: 'One More, One Less - Early Math Relationship Practice | Wizqo',
    metaDescription: 'Identify the numbers immediately before and after. Practice numerical sequence logic with our fun, printable worksheet. Free PDF for Pre-K and K.',
    learningObjectives: ['Identify the number that is exactly +1 or -1 from a given starting point', 'Understand the hierarchical structure of the number line', 'Build speed in mental counting and basic subtraction/addition foundations'],
    intro: 'Every number has a neighbor! Our One More, One Less worksheet helps young learners visualize the "order" of math. By identifying what comes right before and right after a target number, children build the sequential logic needed for addition and subtraction. This activity turns a simple number line into a dynamic map of relationships, providing a bright start to early math fluency.'
  },
  'order-of-operations': {
    title: 'Order of Operations (PEMDAS) - Math Logic Mastery | Wizqo',
    metaDescription: 'Learn which operation comes first! Practice Parentheses, Exponents, Multiplication, Division, Addition, Subtraction. Free PDF for grades 5-6.',
    learningObjectives: ['Apply the PEMDAS/BODMAS rule to solve multi-step equations', 'Understand that mathematical operations follow a strict hierarchy', 'Develop precision and systematic thinking in complex arithmetic'],
    intro: 'Math has a "traffic law"! Our Order of Operations worksheet teaches students the rules of the road for solving complex equations. Using the PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction) mnemonic, learners practice the exact sequence needed to reach the corect answer every time. This is a critical skill for building the logical stamina needed for middle school algebra.'
  },
  'ordering-numbers-100': {
    title: 'Ordering Numbers to 100 - Least to Greatest Practice | Wizqo',
    metaDescription: 'Sequence three-digit and two-digit numbers up to 100. Practice place value comparison and logical sorting. Free PDF for grades 1-2.',
    learningObjectives: ['Sort a set of three or more numbers based on their relative scale', 'Compare digits in the tens and ones place to determine rank', 'Understand numerical hierarchy across the 0-100 range'],
    intro: 'Can you line these up from smallest to biggest? Our Ordering Numbers to 100 worksheet challenges students to compare several values at once. By analyzing the "tens" digit of each number to determine its rank, children build the comparative logic needed for data analysis and advanced arithmetic. A wonderful way to cement place-value understanding after years of simple counting.'
  },
  'perimeter-rectangles': {
    title: 'Perimeter of Rectangles - Measuring Boundaries | Wizqo',
    metaDescription: 'Learn to calculate the "distance around" a shape. Practice using the 2L + 2W perimeter formula. Free printable for grades 3-4 math.',
    learningObjectives: ['Accurately calculate the perimeter of various rectangular and square figures', 'Understand perimeter as a linear measurement of a boundary', 'Apply length and width formulas to real-world geometric problems'],
    intro: 'Perimeter is the length of the fence around the yard! Our Perimeter of Rectangles worksheet provides targeted practice for calculating the total distance around four-sided shapes. By adding all side lengths together, students build a concrete understanding of linear measurement and spatial boundaries—a skill they\'ll use daily in construction, art, and higher-level geometry.'
  },
  'phonics-short-a': {
    title: 'Phonics: Short "a" Vowel Sound - Reading Readiness | Wizqo',
    metaDescription: 'Master the "at," "ad," and "an" word families. Practice reading and writing short "a" CVC words with our fun phonics worksheet. Free PDF.',
    learningObjectives: ['Identify the short "a" vowel sound in spoken and written words', 'Read and spell CVC words like cat, dad, and ham', 'Distinguish short vowel sounds from long vowel counterparts'],
    intro: 'The short "a" sound—as in hat, bat, and apple—is a building block of English literacy. Our Phonics Short "a" worksheet focuses on helping students hear, identify, and write this foundational vowel sound. Through engaging activities like word-building and matching, early readers gain the decoding skills necessary to read their first full sentences with absolute confidence.'
  },
  'phonics-short-e': {
    title: 'Phonics: Short "e" Vowel Sound - CVC Word Practice | Wizqo',
    metaDescription: 'Master the "et," "ed," and "en" word families. Practice short "e" sounds with our clear, printable phonics worksheet. Free PDF for Kindergarten.',
    learningObjectives: ['Identify the short "e" vowel sound (as in "egg" or "hen")', 'Construct and decode simple three-letter "e" words', 'Improve phonemic awareness of middle-vowel sounds in English'],
    intro: 'Get ready for "ten red hens"! Our Phonics Short "e" worksheet helps young readers master the middle vowel sound in words like bed, net, and leg. By focusing on phonemic awareness and word-family recognition, children build the "sight-decoding" speed needed for fluent reading. This printable resource is a must-have for every early childhood literacy center.'
  },
  'phonics-short-i': {
    title: 'Phonics: Short "i" Vowel Sound - Literacy Fluency | Wizqo',
    metaDescription: 'Practice "it," "ig," and "in" word families. Learn to read and write short "i" words like pig, sit, and bin. Free printable PDF for readers.',
    learningObjectives: ['Recognize the short "i" sound in CVC words', 'Correctly pair written "i" words with their corresponding images', 'Build spelling patterns for the "it" and "ip" families'],
    intro: 'Is that a pig in a wig? Our Phonics Short "i" worksheet turns vowel practice into a fun adventure. By identifying and writing words like sit, pin, and rip, students learn to distinguish this "thin" vowel sound from its neighbors. This targeted phonics practice is essential for building the decoding accuracy that leads to a lifelong love of reading.'
  },
  'phonics-short-o': {
    title: 'Phonics: Short "o" Vowel Sound - Reading & Spelling | Wizqo',
    metaDescription: 'Master the "ot," "op," and "og" word families. Practice short "o" CVC words like dog, hot, and mop. Free printable PDF worksheet.',
    learningObjectives: ['Identify the short "o" sound in spoken and written vocabulary', 'Blend consonant sounds with the "o" vowel for CVC decoding', 'Strengthen phoneme-grapheme mapping for early readers'],
    intro: 'Hop on the bus! Our Phonics Short "o" worksheet helps students master the core vowel sound in words like log, pot, and box. By practicing how to blend this "open" sound with different beginning and ending consonants, children build the foundational skills needed for spelling and reading. A perfect, printable addition to any Kindergarten or 1st-grade literacy lesson.'
  },
  'phonics-short-u': {
    title: 'Phonics: Short "u" Vowel Sound - Kindergarten Literacy | Wizqo',
    metaDescription: 'Practice "ut," "ug," and "un" word families. Master short "u" words like bug, sun, and cup. Free printable phonics worksheet for kids.',
    learningObjectives: ['Identify the short "u" sound in initial and medial positions', 'Construct CVC words within the "ub" and "ud" families', 'Distinguish vowel sounds to prevent common reading errors'],
    intro: 'Fun in the sun! Our Phonics Short "u" worksheet focuses on the vowel sound in words like tub, mug, and gum. These three-letter building blocks are essential for helping students transition from "learning letters" to "reading words." With clear images and guided tracing, early readers gain the confidence and speed needed to handle their first books with joy.'
  },
  'place-value-blocks-100': {
    title: 'Place Value Blocks to 100 - Visual Base-Ten Math | Wizqo',
    metaDescription: 'Learn to use base-ten blocks (flats, rods, and units). Practice counting values up to 100 with our printable visual math worksheet. Free PDF.',
    learningObjectives: ['Represent numbers 1-100 using virtual or physical base-ten blocks', 'Verify that ten "ones" equals one "ten"', 'Interpret numerical values from visual block-based models'],
    intro: 'See the numbers! Our Place Value Blocks to 100 worksheet turns abstract digits into physical lengths. By identifying how many "tens rods" and "ones cubes" make up a value like 42, children build a deep, intuitive understanding of the base-ten system. This visual strategy is one of the most effective ways to prepare students for regrouping in addition and subtraction.'
  },
  'place-value-expansion-100': {
    title: 'Place Value Expansion to 100 - Base-Ten Breakdown | Wizqo',
    metaDescription: 'Break down numbers into tens and ones. Practice writing 54 as 50 + 4. Free printable PDF for 1st-2nd grade math foundations.',
    learningObjectives: ['Decompose 2-digit numbers into their constituent place value parts', 'Write numbers in expanded notation format (e.g., 80 + 2 = 82)', 'Reinforce the "value" of a digit based on its specific column'],
    intro: 'What is a number made of? Our Place Value Expansion to 100 worksheet helps students peek "under the hood" of math. By physically breaking numbers like 63 into 60 and 3, children see that a digit\'s position determines its total value. This "expansion" logic is the key to mastering mental math and understanding how multi-digit operations actually work.'
  },
  'place-value-hundreds': {
    title: 'Place Value: Hundreds, Tens, and Ones - 2nd Grade Math | Wizqo',
    metaDescription: 'Learn to identify digit values in the hundreds column. Master 3-digit number structure with our clear, printable worksheet. Free PDF.',
    learningObjectives: ['Identify the value of a digit in the hundreds, tens, or ones place', 'Read and write 3-digit numbers in standard, word, and expanded form', 'Understand the relationship between place value columns (100 = 10 tens)'],
    intro: 'Move into the big leagues! Our Place Value Hundreds worksheet expands the base-ten system into three columns. By identifying how hundreds, tens, and ones interact, students build the "stamina" needed to handle numbers up to 999. This worksheet provides the rigorous practice needed for the transition from 1st to 2nd-grade standards, ensuring no student feels "small" around big numbers.'
  },
  'place-value-tens-ones': {
    title: 'Place Value: Tens and Ones - Early Base-Ten Logic | Wizqo',
    metaDescription: 'Master the foundation of 2-digit numbers. Practice counting tens and ones with our fun, printable math worksheet. Free PDF for K-1 math.',
    learningObjectives: ['Identify the value of digits in the tens and ones places of a 2-digit number', 'Successfully group ones into sets of ten', 'Apply base-ten logic to basic addition and comparison problems'],
    intro: 'Ten ones make one ten! Our Place Value Tens and Ones worksheet introduces students to the most important rule of math: our base-ten system. By identifying how these two columns work together, early learners stop seeing "24" as just two digits and start seeing it as two groups of ten and four extras. This is the "Aha!" moment that makes all future math possible.'
  },
  'reading-comprehension-grade-1': {
    title: '1st Grade Reading Comprehension - Fluency Practice | Wizqo',
    metaDescription: 'Improve early literacy with our Grade 1 reading passages. Includes simple stories and targeted comprehension questions. Free printable PDF.',
    learningObjectives: ['Recall specific details from a short, grade-level passage', 'Identify main characters and settings in a story', 'Build reading stamina and phonemic decoding fluency'],
    intro: 'Transitioning from letters to stories is an exciting milestone! Our 1st Grade Reading Comprehension worksheet provides engaging, short-form narratives designed to build confidence in early readers. By answering focused questions about the text, students learn to "read for meaning," strengthening both their vocabulary and their ability to recall details—a vital foundation for all future academic success.'
  },
  'reading-comprehension-grade-2': {
    title: '2nd Grade Reading Comprehension - Vocabulary & Detail | Wizqo',
    metaDescription: 'Enhance literacy skills with Grade 2 reading passages. Focus on inference, sequence, and vocabulary development. Free printable PDF.',
    learningObjectives: ['Identify the sequence of events in a narrative text', 'Use context clues to determine the meaning of new words', 'Answer "how" and "why" questions to demonstrate deep comprehension'],
    intro: 'Good readers are detail detectives! Our 2nd Grade Reading Comprehension worksheet challenges students to go beyond the surface of a story. With more complex sentence structures and varied vocabulary, these passages encourage learners to think critically about "what happens next" and "why characters act as they do." Perfect for building the reading stamina needed for 3rd-grade standardized testing.'
  },
  'reading-comprehension-grade-3': {
    title: '3rd Grade Reading Comprehension - Critical Thinking | Wizqo',
    metaDescription: 'Master 3rd-grade reading standards with our informational and narrative passages. Focus on main idea and evidence. Free PDF download.',
    learningObjectives: ['Identify the main idea and supporting details of a text', 'Draw logical inferences based on textual evidence', 'Distinguish between fact and opinion in informational writing'],
    intro: 'In 3rd grade, students start "reading to learn"! Our Grade 3 Reading Comprehension worksheet features a mix of fiction and non-fiction passages designed to build high-level literacy skills. By asking students to cite evidence for their answers, we help them develop the rigorous critical thinking required to navigate more complex subjects like science and social studies with ease.'
  },
  'reading-comprehension-grade-4': {
    title: '4th Grade Reading Comprehension - Analysis & Summary | Wizqo',
    metaDescription: 'Analyze complex texts with our 4th-grade reading passages. Focus on theme, character development, and narrative structure. Free PDF.',
    learningObjectives: ['Summarize a story or informational text accurately', 'Analyze character traits and motivations based on dialogue and action', 'Identify the theme or central message of a complex narrative'],
    intro: 'Deepen your daughter or son\'s literary analysis! Our 4th Grade Reading Comprehension worksheet pushes students to summarize text, analyze themes, and understand character growth. These passages are specifically designed to align with upper-elementary standards, ensuring learners have the reading "muscle" to handle diverse genres and multi-layered narratives in middle school and beyond.'
  },
  'reading-comprehension-grade-5': {
    title: '5th Grade Reading Comprehension - Mastery & Logic | Wizqo',
    metaDescription: 'Master 5th-grade literacy with our most advanced passages. Focus on tone, structure, and complex evidence-based answers. Free PDF.',
    learningObjectives: ['Synthesize information from multiple parts of a text', 'Analyze how a narrator\'s point of view influences a story', 'Interpret figurative language and its impact on meaning and tone'],
    intro: 'Mastery is the goal! Our 5th Grade Reading Comprehension worksheet features our most challenging passages, designed to prepare students for the rigors of middle school English. By analyzing tone, structure, and figurative language, learners build a sophisticated understanding of how authors craft meaning. This is the ultimate tool for turning "good readers" into "literary thinkers."'
  },
  'reading-kindergarten': {
    title: 'Kindergarten Reading Readiness - Phonics & Sight Words | Wizqo',
    metaDescription: 'Build early literacy foundations with our Kindergarten reading worksheet. Focus on simple text and CVC word decoding. Free printable PDF.',
    learningObjectives: ['Recognize common Kindergarten sight words in context', 'Decode simple CVC words to read short, repetitive sentences', 'Demonstrate basic understanding by matching text to images'],
    intro: 'It only takes a few words to start a big adventure! Our Kindergarten Reading worksheet provides the repetitive, predictable text that early decoders need to feel successful. By combining high-frequency "sight words" with simple phonics blends, children gain the excitement of reading their very first full sentences, providing a joyful start to a lifetime of literacy.'
  },
  'rounding-decimals-5th': {
    title: 'Rounding Decimals (Grade 5) - Precision & Scale | Wizqo',
    metaDescription: 'Master the rules for rounding to the nearest tenth and hundredth. Practice precision with our 5th-grade math worksheet. Free printable PDF.',
    learningObjectives: ['Round decimals to a specified place value (tenths, hundredths)', 'Determine the "closest" value using number line logic', 'Understand how rounding changes the precision of a measurement'],
    intro: 'Math helps us find a "good enough" number! Our Rounding Decimals worksheet teaches students the rules for scaling values to the nearest tenth or hundredth. Whether it\'s calculating prices or scientific measurements, knowing when to "round up" or "round down" is an essential skill for accuracy and practicality. This practice sheet provides the repetition needed to make decimal rounding second nature.'
  },
  'rounding-nearest-10-100': {
    title: 'Rounding to the Nearest 10 and 100 - Number Sense | Wizqo',
    metaDescription: 'Learn to simplify numbers for faster mental math. Practice rounding multi-digit values with our clear, printable worksheet. Free PDF.',
    learningObjectives: ['Round 2 and 3-digit numbers to the nearest ten or hundred', 'Apply the "5 or higher, round up" rule accurately', 'Use a number line to visualize "neighborhood" rounding'],
    intro: 'Is 67 closer to 60 or 70? Our Rounding to 10 and 100 worksheet helps students master the art of simplification. By learning to look at the "neighbor" digit, children develop a powerful mental math shortcut that makes estimation and large-scale calculation much faster and more accurate. A vital "bridge" skill for 2nd and 3rd-grade math success!'
  },
  'school-survival-kit': {
    title: 'Student Survival Kit - Organization & SEL Skills | Wizqo',
    metaDescription: 'Help students stay focused and organized. Includes checklists, goal trackers, and growth mindset prompts. Free printable for kids.',
    learningObjectives: ['Develop independent organization and time-management habits', 'Practice setting and tracking personal academic goals', 'Foster a "growth mindset" through self-reflection prompts'],
    intro: 'Success in the classroom starts with the right tools! Our Student Survival Kit worksheet isn\'t just about math or reading—it\'s about the "soft skills" that make learning possible. From habit-tracking checklists to growth-mindset reflections, this printable resource helps children take ownership of their education, building the resilience and organization needed for a lifetime of achievement.'
  },
  'sentence-scramble': {
    title: 'Sentence Scramble - Grammar and Structure Practice | Wizqo',
    metaDescription: 'Arrange mixed-up words into logical sentences. Practice syntax, grammar, and punctuation with our fun literacy worksheet. Free PDF.',
    learningObjectives: ['Recognize proper sentence structure (Subject-Verb-Object)', 'Practice correct capitalization and punctuation placement', 'Improve reading comprehension by finding meaning in scrambled sets'],
    intro: 'Un-jumble the logic! Our Sentence Scramble worksheet challenges students to become grammar detectives who restore order to "messy" sentences. By arranging words into their correct sequence, children build a natural "feel" for English syntax and punctuation. This activity is a fun, hands-on way to strengthen the writing skills needed for creative storytelling and clear communication.'
  },
  'shapes-all-around': {
    title: 'Shapes All Around Us - Real-World Geometry Logic | Wizqo',
    metaDescription: 'Identify geometric figures in everyday objects. Find circles, squares, and triangles in the world. Free printable for Kindergarten and Grade 1.',
    learningObjectives: ['Translate abstract geometric shapes to real-world objects', 'Identify "hidden" shapes in complex visual environments', 'Strengthen the connection between classroom math and daily life'],
    intro: 'Math is everywhere! Our Shapes All Around Us worksheet encourages students to look at the world through geometric eyes. By identifying the "rectangle" in a door or the "circle" in a clock, children learn that geometry isn\'t just in a textbook—it\'s the building block of everything they see. This activity is perfect for building spatial awareness and visual-spatial logic in early learners.'
  },
  'shapes-az': {
    title: 'Shapes A-Z - Alphabet and Geometry Integration | Wizqo',
    metaDescription: 'Learn shapes that start with every letter! A fun vocabulary-building worksheet for early geometry. Free printable PDF for Kindergarten.',
    learningObjectives: ['Build a diverse geometric vocabulary (A is for Arch, C is for Circle)', 'Reinforce alphabet letter sounds through thematic categories', 'Identify unique and non-standard geometric figures'],
    intro: 'From Arches to Zig-Zags! Our Shapes A-Z worksheet takes students on an alphabetical tour of geometry. By matching shapes to their starting letter sounds, children build both their vocabulary and their visual recognition of geometric forms. This integrated approach ensures that they develop a rich, diverse understanding of the world\'s "corners and curves" while practicing their ABCs.'
  },
  'shapes-coloring': {
    title: 'Shape Coloring Challenge - Fine Motor & Recognition | Wizqo',
    metaDescription: 'Follow the shape code to reveal a colorful picture. Combines geometry identification with artistic precision. Free printable PDF.',
    learningObjectives: ['Correctly identify geometric shapes based on multiple attributes', 'Strengthen focus and pencil control through precision coloring', 'Develop persistence and detail-oriented observation'],
    intro: 'Coloring with a purpose! Our Shape Coloring worksheet asks students to identify specific geometric figures and fill them with designated colors. This activity bridges the gap between recognition and application, helping preschoolers cement their knowledge of shapes while practicing the hand-eye coordination needed for writing. A perfect, printable reward for any early math lesson!'
  },
  'skip-count-2': {
    title: 'Skip Counting by 2 - Early Multiplication Readiness | Wizqo',
    metaDescription: 'Master the patterns of 2, 4, 6, 8... Practice counting even numbers with our clear, printable math worksheet. Free PDF for K-1 math.',
    learningObjectives: ['Fluently skip-count by 2s up to 50', 'Identify even number patterns in a sequence', 'Build the conceptual foundation for the 2-times table'],
    intro: 'Two, four, six, eight... who do we appreciate? Patterns! Our Skip Counting by 2 worksheet helps children master the rhythm of even numbers. By skipping every other digit, students build the mental speed needed for multiplication and a deep intuition for parity. This rhythmic practice is a vital milestone in moving from simple counting toward advanced arithmetic and times-table mastery.'
  },
  'skip-count-5': {
    title: 'Skip Counting by 5 - Telling Time & Money Prep | Wizqo',
    metaDescription: 'Learn the "5s" pattern for clocks and nickels. Practice skip-count patterns with our fun, printable math worksheet. Free PDF download.',
    learningObjectives: ['Fluently skip-count by 5s up to 100', 'Connect the "5s" pattern to analog clock reading', 'Prepare for counting nickels and calculating money in groups'],
    intro: 'Counting by fives is a math superpower! Our Skip Counting by 5 worksheet helps students master the pattern used for everything from telling time on a clock to counting nickels in a piggy bank. By practicing this "high-frequency" sequence, children build the numerical fluency needed for a lifetime of practical math, making larger values feel approachable and fun.'
  },
  'skip-count-10': {
    title: 'Skip Counting by 10 - Base-Ten Fluency Practice | Wizqo',
    metaDescription: 'Master the "10s" pattern for base-ten math. Practice counting by tens to 100 with our clear, printable worksheet. Free PDF for Kindergarten.',
    learningObjectives: ['Fluently skip-count by 10s up to 120', 'Understand the "constant tens" pattern (all numbers end in 0)', 'Build a rock-solid foundation for multi-digit addition and place value'],
    intro: 'The tens are the backbone of our number system! Our Skip Counting by 10 worksheet helps students internalize the rhythmic pattern that defines our base-ten logic. By counting from 10 to 120, children develop the numerical "skeleton" that supports all their future work with addition, subtraction, and place value. A must-have resource for mastering the bridge to larger numbers!'
  },
  'skip-count-2-10': {
    title: 'Skip Counting by 2 and 10 - Multiple Pattern Mastery | Wizqo',
    metaDescription: 'Practice both the 2s and 10s patterns in one worksheet. Build numerical fluency and flexibility for early math. Free printable PDF.',
    learningObjectives: ['Differentiate between 2s and 10s skip-counting patterns', 'Fluently extend number sequences using diverse interval rules', 'Strengthen mental math flexibility in shifting between counting models'],
    intro: 'Switch your brain into high gear! Our Skip Counting by 2 and 10 worksheet asks students to alternate between two of the most important patterns in math. By mastering these different rhythms on a single page, children build the cognitive flexibility and numerical speed needed for multi-digit addition and times-table readiness. A wonderful "refresher" for the 1st and 2nd-grade classroom!'
  },
  'skip-counting-by-2s-to-50': {
    title: 'Skip Counting by 2s to 50 - Fluency Challenge | Wizqo',
    metaDescription: 'Master the even number sequence up to 50. Practice skip-counting by 2 with our clear, printable math worksheet. Free PDF download.',
    learningObjectives: ['Fluently recall the even number sequence from 2 to 50', 'Identify and fill in missing values in a 2s string', 'Reinforce the "skip-one" logic for foundational math'],
    intro: 'Halfway to a hundred! Our Skip Counting by 2s to 50 worksheet provides the targeted repetition students need to internalize the even number sequence. By practicing this pattern in a larger range, children build the "numerical stamina" required for 2nd-grade standards and multiplication. This printable resource is designed to make math feel like a predictable and rewarding rhythmic game.'
  },
  'skip-counting-by-5s-to-100': {
    title: 'Skip Counting by 5s to 100 - Level Up Practice | Wizqo',
    metaDescription: 'Master the full 5s sequence all the way to 100. Essential prep for time and money math. Free printable PDF for grades 1-2.',
    learningObjectives: ['Fluently recall the 5s sequence (5, 10, 15...) up to 100', 'Connect the pattern to the "tens and five" visual layout of a 100-chart', 'Build the speed needed for counting nickel sets and reading clocks'],
    intro: 'Go the distance! Our Skip Counting by 5s to 100 worksheet pushes students to master one of math\'s most useful patterns in its full 0-100 range. This fluency is the secret weapon for reading analog clocks, counting US nickels, and understanding 5-minute intervals. With clear, guided paths, children gain the absolute confidence needed for upper-level arithmetic and practical daily math.'
  },
  'skip-counting-missing': {
    title: 'Missing Numbers in Skip Counting Patterns - Logic | Wizqo',
    metaDescription: 'Identify the rule and fill in the blanks! Practice finding missing numbers in 2s, 5s, and 10s sequences. Free printable for K-2 math.',
    learningObjectives: ['Identify the hidden rule (+2, +5, or +10) in a sequence', 'Correctly fill in missing numerical "links" in a chain', 'Develop predictive thinking and logical deduction skills'],
    intro: 'Math is a detective story! Our Missing Numbers in Skip Counting Patterns worksheet asks students to identify the rule and find the "mystery digits" in a sequence. By analyzing gaps in 2s, 5s, and 10s strings, children move beyond simple memorization and start thinking about the logical delta between numbers. This "pattern logic" is a vital bridge to algebraic thinking and advanced multiplication.'
  },
  'spatial-awareness': {
    title: 'Spatial Awareness Skills - Above, Below, Left, & Right | Wizqo',
    metaDescription: 'Master positional vocabulary and spatial logic. Practice Identifying objects in relation to each other. Free printable for Pre-K and K.',
    learningObjectives: ['Identify and use positional words (on, under, between, beside)', 'Practice following complex spatial directions in a visual field', 'Develop the "mental map" skills needed for geometry and navigation'],
    intro: 'Where did it go? Our Spatial Awareness worksheet helps early learners master the language of "where." By identifying objects based on their position—like the cat *under* the table or the ball *beside* the box—children build the spatial reasoning and vocabulary needed for geometry, reading directions, and navigating their daily world. A fundamental building block for early childhood development!'
  },
  'spatial-logic-blocks': {
    title: 'Spatial Logic with 3D Blocks - Geometry Visualization | Wizqo',
    metaDescription: 'Improve 3D visualization skills by identifying block arrangements. Practice "seeing" hidden objects in a stack. Free printable for grades 1-3.',
    learningObjectives: ['Visualize 3D structures from 2D representations', 'Count total blocks in a stack, including "hidden" foundation blocks', 'Identify perspective shifts in geometric arrangements'],
    intro: 'Seeing around corners! Our Spatial Logic with Blocks worksheet challenges students to visualize three-dimensional stacks in a two-dimensional world. By counting how many blocks it takes to build a structure—even those they can\'t see at the bottom—children build the high-level spatial reasoning used by architects, engineers, and artists. It\'s a fun, brain-bending workout for young geometric thinkers!'
  },
  'telling-time-5min': {
    title: 'Telling Time to 5 Minutes - Analog Clock Mastery | Wizqo',
    metaDescription: 'Master the "5-minute" increments! Practice reading analog clocks with high precision. Free printable PDF for grades 2-3 math.',
    learningObjectives: ['Read analog clocks with 5-minute precision', 'Correctly identify the position of the minute hand for all 12 intervals', 'Record time in digital format based on analog representations'],
    intro: 'Don\'t be late! Our Telling Time to 5 Minutes worksheet bridges the gap between basic "quarter-hour" reading and master-level clock logic. By using skip-counting by 5s to identify the minute hand\'s position, students build the practical precision needed for managing their own schedules. This printable resource is the ultimate tool for turning "clock-watchers" into "time-masters."'
  },
  'telling-time-analog-clocks': {
    title: 'Reading Analog Clocks - Standard Time Foundations | Wizqo',
    metaDescription: 'Practice reading hour and minute hands. A comprehensive time-telling worksheet for early learners. Free printable PDF for 1st and 2nd grade.',
    learningObjectives: ['Distinguish between the hour hand and the minute hand', 'Understand the circular number line of a clock face', 'Read and record time in "hour:minute" digital format'],
    intro: 'The clock is a round number line! Our Reading Analog Clocks worksheet helps students master the interface of time. By identifying the specific roles of the big hand and the little hand, children build a concrete understanding of how minutes and hours flow. This practice is essential for building the independence and organizational skills that students use every day in school and at home.'
  },
  'telling-time-half-hour': {
    title: 'Telling Time to the Half-Hour - Clock Logic Practice | Wizqo',
    metaDescription: 'Learn to read "half-past" the hour. Practice identifying the 30-minute position on an analog clock. Free printable PDF for K-1 math.',
    learningObjectives: ['Identify the "half-past" (30 min) position on an analog clock', 'Correctly read hour hands that are "between" two numbers', 'Record time as X:30 in digital format'],
    intro: 'Halfway there! Our Telling Time to the Half-Hour worksheet introduces the tricky "half-past" concept. Students learn that when the minute hand points to the 6, the hour hand is also moving between numbers. By mastering this milestone, learners build the spatial awareness and counting skills needed for 2nd-grade time standards. A perfect, printable addition to any math circle time!'
  },
  'telling-time-quarter-hour': {
    title: 'Telling Time to the Quarter Hour - 15 and 45 Logic | Wizqo',
    metaDescription: 'Learn "quarter-past" and "quarter-to" the hour. Practice reading 15 and 45-minute increments. Free printable for 2nd grade math.',
    learningObjectives: ['Identify "quarter-past" (15 min) and "quarter-to" (45 min) positions', 'Partition the clock face into four equal quadrants', 'Differentiate between 15, 30, and 45 minute marks on sight'],
    intro: 'Time is divided into parts! Our Telling Time to the Quarter Hour worksheet applies fraction logic to the clock face. By visualizing the clock in four quarters, students learn to identify the :15 and :45 marks with ease. This conceptual approach makes time-telling more intuitive and prepares students for the higher precision of 5-minute increments in the years to come.'
  },
  'telling-time-to-the-hour': {
    title: 'Telling Time to the Hour - Intro to Analog Clocks | Wizqo',
    metaDescription: 'Master the "o\'clock" position! The perfect first clock worksheet for preschoolers and kindergarteners. Free printable PDF download.',
    learningObjectives: ['Identify the "o\'clock" (12) position of the minute hand', 'Read the hour hand accurately when pointing directly at a numeral', 'Identify the parts of the clock face (numbers, hands, ticks)'],
    intro: 'It\'s math o\'clock! Our Telling Time to the Hour worksheet provides the perfect introduction to the world of analog clocks. By identifying where the hands point when an hour is just beginning, young learners build the foundation of time-management. With large, clear clock faces and guided practice, this is the most student-friendly way to start the journey of time-telling.'
  },
  'ten-frames-11-20': {
    title: 'Ten-Frames 11-20 - Base-Ten & Teen Number Math | Wizqo',
    metaDescription: 'Identify numbers 11-20 using double ten-frames. Practice "ten and some more" logic. Free printable PDF for Kindergarten and 1st grade.',
    learningObjectives: ['Represent numbers 11-20 as "one full ten plus some ones"', 'Identify quantities 11-20 on sight using double ten-frame models', 'Build the conceptual foundation for regrouping and addition'],
    intro: 'Eleven is just "ten and one more"! Our Ten-Frames 11-20 worksheet helps students visualize the structure of teen numbers. By seeing one full frame and one partial frame, children internalize the base-ten logic that makes multi-digit math possible. This visual strategy is one of the most powerful tools for preventing "number confusion" and building a rock-solid mathematical foundation.'
  },
  'thickness-heavy-light': {
    title: 'Measurement: Heavy vs. Light - Intro to Mass & Logic | Wizqo',
    metaDescription: 'Compare the relative weights of everyday objects. Practice identifying heavy and light items with our fun matching worksheet. Free PDF.',
    learningObjectives: ['Identify objects as "heavy" or "light" based on real-world knowledge', 'Sort items into relative weight categories', 'Develop the sensory vocabulary needed for physical science and measurement'],
    intro: 'Is an elephant heavier than a mouse? Our Heavy vs. Light worksheet helps early learners explore the concept of mass. By identifying which objects take "more work" to lift, children build the foundational vocabulary and observational skills needed for physics and measurement. It\'s a fun, low-stress way to connect classroom lessons to the physical sensations of the real world!'
  },
  'tracing-alphabet': {
    title: 'Complete Alphabet Tracing (A-Z) - Literacy Foundations | Wizqo',
    metaDescription: 'Practice both uppercase and lowercase letters on one page. The ultimate alphabet mastery sheet for early writers. Free printable PDF.',
    learningObjectives: ['Master the stroke order for all 26 letters of the English alphabet', 'Practice consistent letter height and alignment on a baseline', 'Reinforce the visual identity of every letter from A to Z'],
    intro: 'The whole alphabet at your fingertips! Our Complete Alphabet Tracing worksheet provides a comprehensive workout for early writers. By practicing both uppercase and lowercase forms from A to Z, children build the muscle memory and visual skills needed for fluent reading and writing. This "all-in-one" resource is perfect for daily practice, morning work, or literacy centers!'
  },
  'tracing-letters': {
    title: 'Letter Tracing Practice - Individual Character Writing | Wizqo',
    metaDescription: 'Refine your handwriting skills with guided letter tracing. Practice specific characters for better legibility. Free printable PDF for kids.',
    learningObjectives: ['Develop precision and fine motor control in letter formation', 'Identify and correct common letter-construction errors', 'Maintain handwriting legibility through repetitive muscle-memory practice'],
    intro: 'Practice makes perfect! Our Letter Tracing Practice worksheet provides the targeted, repetitive support needed to turn wobbly lines into confident letters. By focusing on the smooth flow and proper height of each character, students build the handwriting stamina that will support them in everything from creative writing to science reports. A must-have for the 1st and 2nd-grade classroom!'
  },
  'tracing-lowercase': {
    title: 'Lowercase Letter Tracing - Literacy Readiness | Wizqo',
    metaDescription: 'Master the "small" letters of the alphabet. Guided tracing for lowercase a-z to build writing fluency. Free printable PDF for Kindergarten.',
    learningObjectives: ['Practice proper stroke order for all lowercase letter forms', 'Develop consistent letter size and spacing in handwriting', 'Increase writing speed and legibility for early literacy'],
    intro: 'Most of what we read is in lowercase! Our Lowercase Letter Tracing worksheet helps young learners master the smaller character forms that make up the bulk of English text. By following the guided dots for a through z, children build the specific muscle memory and spatial awareness needed for fluent, legible writing. A fundametal resource for every preschool and Kindergarten student!'
  },
  'tracing-numbers-1-10': {
    title: 'Number Tracing 1-10 - Early Math Hand-Eye Coordination | Wizqo',
    metaDescription: 'Learn to write numbers properly with our guided tracing worksheet. Perfect for Pre-K and K math readiness. Free printable PDF.',
    learningObjectives: ['Master the correct formation of single-digit numbers', 'Build hand-eye coordination through repetitive precision work', 'Reinforce the visual-numerical identity of digits 1-10'],
    intro: 'Start your math journey with a steady hand! Our Number Tracing 1-10 worksheet provides the guided support early learners need to form their first mathematical symbols. By practicing the curves of a 3 and the straight lines of a 7, children build the fine motor control used for all future calculations. It\'s a fun, low-stress way to turn numbers from abstract shapes into familiar friends.'
  },
  'tracing-numbers-1-20': {
    title: 'Number Tracing 1-20 - Teen Number Writing Practice | Wizqo',
    metaDescription: 'Guided writing practice for numbers up to 20. Master the "teens" with our clear, printable tracing worksheet. Free PDF for Kindergarten.',
    learningObjectives: ['Master the formation of two-digit numbers in the 10-20 range', 'Practice consistent numeral scale and alignment on a baseline', 'Reinforce sequential knowledge of numbers through twenty'],
    intro: 'Double digits are an exciting milestone! Our Number Tracing 1-20 worksheet helps students master the bridge between single numbers and the "teens." By practicing how to write 11 through 20 with guided dots, children gain the precision and confidence needed to record their math work cleanly and clearly. A perfect, printable tool for building 1st-grade writing stamina and numerical fluency.'
  },
  'tracing-uppercase': {
    title: 'Uppercase Letter Tracing - Alphabet Foundations | Wizqo',
    metaDescription: 'Master the Capital Letters! Guided tracing for uppercase A-Z to build writing confidence. Free printable PDF for preschoolers.',
    learningObjectives: ['Practice proper stroke order for all 26 uppercase letters', 'Maintain consistent letter height and scale on a page', 'Identify the visual differences between capital and lowercase forms'],
    intro: 'Big letters for big ideas! Our Uppercase Letter Tracing worksheet focuses on the bold, foundational shapes of the English alphabet. By tracing the capital forms of A through Z, young writers build the hand strength and coordination needed for all their future schoolwork. This guided practice is the perfect way to start every literacy lesson with success and clarity.'
  },
  'two-digit-addition-no-regrouping': {
    title: '2-Digit Addition (No Regrouping) - Math Fluency | Wizqo',
    metaDescription: 'Learn the "column" method for addition. Simple two-digit problems without carrying. Free printable PDF for 1st-2nd grade math.',
    learningObjectives: ['Master the vertical alignment method for addition', 'Correctly sum tens and ones columns independently', 'Build the confidence needed for multi-digit arithmetic'],
    intro: 'Numbers are getting bigger! Our 2-Digit Addition (No Regrouping) worksheet introduces students to the elegance of column-based math. By adding tens to tens and ones to ones without the complexity of "carrying," children build a rock-solid understanding of place-value structure. This essential practice sheet turns larger math problems into simple, manageable steps for every 1st and 2nd-grade learner.'
  },
  'two-digit-addition-with-regrouping': {
    title: '2-Digit Addition with Regrouping - Carrying Practice | Wizqo',
    metaDescription: 'Master the "carry the one" method! Challenging two-digit addition for 2nd and 3rd-grade math standards. Free printable PDF.',
    learningObjectives: ['Successfully regroup ten "ones" into one "ten"', 'Master the vertical algorithm for complex addition', 'Apply place-value logic to solve multi-digit equations'],
    intro: 'When the ones column hits ten, it\'s time to regroup! Our 2-Digit Addition with Regrouping worksheet teaches the "carry the one" strategy that is fundamental to all higher-level math. By visualizing how ten single units become one ten-rod, students gain a deep understanding of the base-ten system while building the accuracy needed for 3rd-grade standards and beyond. A true math mastery challenge!'
  },
  'two-digit-subtraction-no-regrouping': {
    title: '2-Digit Subtraction (No Regrouping) - Logic Practice | Wizqo',
    metaDescription: 'Learn simple multi-digit subtraction. Clear vertical problems without borrowing. Free printable PDF for 1st and 2nd grade math.',
    learningObjectives: ['Apply the column-subtraction method to two-digit numbers', 'Subtract ones and tens independently with precision', 'Reinforce place-value alignment for future math success'],
    intro: 'Taking away in columns! Our 2-Digit Subtraction (No Regrouping) worksheet helps students transition from basic subtraction to multi-digit logic. By focusing on problems where "borrowing" isn\'t yet needed, learners can master the vertical algorithm and column alignment with total confidence. This practice builds the stamina and focus required for the more complex subtractive challenges of 2nd and 3rd grade.'
  },
  'two-digit-subtraction-with-regrouping': {
    title: '2-Digit Subtraction with Regrouping - Borrowing Skills | Wizqo',
    metaDescription: 'Master "borrowing" from the tens column! Vertical subtraction practice for 2nd-4th grade standards. Free printable PDF.',
    learningObjectives: ['Decompose one "ten" into ten "ones" to solve subtraction', 'Apply the vertical subtraction algorithm with borrowing across columns', 'Check results using inverse addition for total accuracy'],
    intro: 'Not enough in the ones column? Time to borrow! Our 2-Digit Subtraction with Regrouping worksheet provides the structured support students need to master the tricky "borrowing" concept. By visualizing the transition of a ten-rod into ten individual units, learners unlock the secret to solving any subtraction problem. This is a critical skill for 2nd and 3rdnd-grade math standards and real-world financial calculations.'
  },
  'unitary-method-5th': {
    title: 'The Unitary Method - Unit Rate and Proportion | Wizqo',
    metaDescription: 'Learn to find the value of "one" to solve for "many." Essential 5th-grade math for pricing and ratios. Free printable PDF.',
    learningObjectives: ['Calculate the "unit price" or "unit rate" from a given total', 'Use the value of one unit to solve for any specified quantity', 'Apply proportional reasoning to real-world shopping and science scenarios'],
    intro: 'If five apples cost ten dollars, how much is one? Our Unitary Method worksheet teaches students the most practical "shortcut" in math. By learning to find the value of a single unit first, learners gain the power to solve complex proportional problems with ease. This is the foundation of ratio logic, unit pricing, and the mathematical thinking used every day in the marketplace and the lab.'
  },
  'uppercase-alphabet': {
    title: 'Uppercase Alphabet Mastery - Capital Letter Practice | Wizqo',
    metaDescription: 'Learn to identify and write the "big" letters from A to Z. Focus on proper formation and alignment. Free printable PDF download.',
    learningObjectives: ['Correctly identify and name all 26 uppercase letter forms', 'Practice proper stroke order for capital letters in handwriting', 'Understand when and where to use uppercase letters in sentences'],
    intro: 'Capitals are for important things! Our Uppercase Alphabet worksheet helps young learners master the strong, elegant shapes of the A-Z capital set. By practicing these letters in isolation and in alphabetical strings, children build the foundational motor skills and literacy logic used for names, proper nouns, and the starts of every sentence they will ever write. A bright, bold start to every reader\'s journey!'
  },
  'uppercase-lowercase-sorting': {
    title: 'Uppercase vs. Lowercase Sorting - Literacy Logic | Wizqo',
    metaDescription: 'Categorize letters into "big" and "small" groups. Fun sorting activity for early reading and writing readiness. Free printable PDF.',
    learningObjectives: ['Visually distinguish between uppercase and lowercase character pairs', 'Categorize letters based on their typographical case', 'Strengthen observation and sorting skills for literacy development'],
    intro: 'Do the big A and little a go together? Our Uppercase vs. Lowercase Sorting worksheet turns alphabet practice into a fun categorization game. By identifying and grouping letters based on their case, children build the visual discrimination skills needed for fluent reading. This activity is a wonderful way to cement the "big/small" logic that early learners use to navigate their first books with confidence.'
  },
  'vowel-recognition': {
    title: 'Vowel Recognition: A, E, I, O, U - Phonics Foundations | Wizqo',
    metaDescription: 'Identify the "sticky" letters that make every word work! Fun vowel-focused phonics activity for early readers. Free printable PDF.',
    learningObjectives: ['Identify A, E, I, O, U as a distinct category of letters', 'Recognize vowel sounds in initial and medial positions of words', 'Understand the vital role vowels play in reading and spelling'],
    intro: 'Vowels are the glue that holds words together! Our Vowel Recognition worksheet helps children identify the special group of five letters—a, e, i, o, and u—that appear in nearly every word they read. By focusing on these high-frequency sounds, early readers build the "phonological awareness" needed to decode sentences and spell their first vocabulary lists. A bright, foundational tool for every early literacy center!'
  },
  'word-problems-addition-subtraction': {
    title: 'Addition & Subtraction Word Problems - Logic Practice | Wizqo',
    metaDescription: 'Solve real-world math stories! Practice identifying "clue words" for adding and taking away. Free printable PDF for grades 1-3.',
    learningObjectives: ['Identify "action words" (altogether, left, remain) in math stories', 'Select the correct operation (+ or -) to solve narrative scenarios', 'Verify numerical answers using real-world reasoning and estimation'],
    intro: 'Translating stories into math! Our Addition and Subtraction Word Problems worksheet takes students through relatable scenarios involving toys, friends, and snacks. By finding the "clue words" that tell them whether to add or subtract, learners build the critical reading and logic skills needed for academic success. This practice turns abstract arithmetic into a useful tool for navigating daily life.'
  },
  'writing-numbers-1-100': {
    title: 'Writing Numbers to 100 - Full 100-Chart Practice | Wizqo',
    metaDescription: 'Master the complete 1-100 sequence! Practice writing and identifying numbers on a full grid. Free printable PDF for 1st-2nd grade.',
    learningObjectives: ['Fluently write all numbers in sequence from 1 to 100', 'Identify and apply place-value patterns on a 100-chart grid', 'Maintain numerical accuracy and alignment in large-scale writing'],
    intro: 'The ultimate number marathon! Our Writing Numbers to 100 worksheet provides the rigorous practice needed to master the full century of digits. By filling in the 100-chart, students internalize the repeating base-ten patterns that define our number system. This foundational activity is essential for building the stamina and clarity needed for multi-digit addition, subtraction, and 2nd-grade math standards.'
  },
  'writing-prompts-creative': {
    title: 'Creative Writing Prompts - Storytelling & Literacy | Wizqo',
    metaDescription: 'Spark your imagination with our fun, open-ended writing prompts! Includes space for drawing and storytelling. Free printable PDF for kids.',
    learningObjectives: ['Develop original narrative ideas based on themed prompts', 'Practice sentence structure and creative vocabulary in writing', 'Express complex ideas through a combination of text and illustration'],
    intro: 'What if you could fly? Our Creative Writing Prompts worksheet provides the "spark" for your student\'s next great story. From magical adventures to funny "what if" scenarios, these prompts encourage children to use their vocabulary and imagination to build unique words and worlds. With plenty of space for both writing and drawing, this resource is a favorite for developing literacy and self-expression!'
  },
  'fractions-out-of-100': {
    title: 'Fractions Out of 100 - Base-Ten & Percent Prep | Wizqo',
    metaDescription: 'Master fractions with a denominator of 100. Practice identifying hundredths and connecting them to decimals and percents. Free PDF for grades 4-5.',
    learningObjectives: ['Identify and represent fractions with denominators of 100', 'Connect hundredths to decimal place value', 'Build foundations for percentage understanding'],
    intro: 'What does "out of 100" really mean? This worksheet focuses on fractions where the denominator is exactly one hundred, helping students visualize these "hundredths" using grids and numerical models. By mastering these specific fractions, children build a direct bridge to decimals and percentages, making advanced math concepts feel intuitive and manageable.'
  },
  'fractions-to-decimals-basic-tenths': {
    title: 'Converting Tenths to Decimals - Basic Math Fluency | Wizqo',
    metaDescription: 'Learn to turn fractions like 3/10 into decimals like 0.3. Master the "tenths" place value with our clear, printable worksheet. Free PDF.',
    learningObjectives: ['Convert fractions with a denominator of 10 to decimals', 'Identify the tenths place value column', 'Understand that 10/10 equals one whole (1.0)'],
    intro: 'Decimal fractions are just another way to write the same number! Our Converting Tenths to Decimals worksheet focuses on the very first place value after the decimal point. By seeing how three-tenths (3/10) becomes 0.3, students learn the rhythmic logic of the base-ten system, providing a solid foundation for more complex conversions and measurement math.'
  },
  'fractions-to-decimals-division': {
    title: 'Converting Fractions using Division - Advanced Strategy | Wizqo',
    metaDescription: 'Learn to turn any fraction into a decimal by dividing the numerator by the denominator. Perfect for non-base-10 fractions. Free printable PDF.',
    learningObjectives: ['Apply long division to convert any fraction into a decimal', 'Understand the relationship between the fraction bar and the division symbol', 'Identify repeating and terminating decimal patterns'],
    intro: 'Every fraction is really just a division problem waiting to happen! Our Fractions to Decimals using Division worksheet teaches students the "universal" method of conversion: dividing the top number by the bottom. This strategy works for any fraction—not just those with 10 or 100 at the bottom—giving learners the power to handle any numerical representation they encounter in science and higher math.'
  },
  'fractions-whole': {
    title: 'Fractions and Wholes - Understanding "n/n" Equality | Wizqo',
    metaDescription: 'Master the concept that a fraction is one whole when the top and bottom numbers match. Practice identifying wholes in models. Free PDF.',
    learningObjectives: ['Identify that a fraction equals 1 when the numerator matches the denominator', 'Visualize whole units partitioned into equal segments', 'Connect fractional representations to integer values'],
    intro: 'Why does 4/4 equal 1? Our Fractions and Wholes worksheet helps students visualize the concept of completeness. By shading in all the parts of a partitioned shape, children learn that when you have every piece, you have the entire thing. This foundational "fraction sense" is essential for understanding improper fractions, mixed numbers, and basic arithmetic operations.'
  },
  'fraction-word-problems-5th': {
    title: '5th Grade Fraction Word Problems - Advanced Application | Wizqo',
    metaDescription: 'Solve complex math stories involving mixed numbers and unlike denominators. Targeted practice for 5th-grade standards. Free PDF with answers.',
    learningObjectives: ['Perform multi-step fraction operations within a narrative context', 'Find common denominators to solve real-world addition and subtraction', 'Interpret "fractions of a total" in complex sharing scenarios'],
    intro: 'Take your fraction skills into the real world! Our 5th Grade Fraction Word Problems worksheet presents students with complex scenarios involving cooking, distance, and time. By requiring learners to find common denominators and manage mixed numbers within a story, this practice builds the critical reading and mathematical stamina needed for middle school and competitive math.'
  },
  'div-fractions': {
    title: 'Dividing Fractions Practice - Reciprocal Method mastery | Wizqo',
    metaDescription: 'Master fraction division with the "Keep, Change, Flip" strategy. Practice dividing fractions by whole numbers and other fractions. Free PDF.',
    learningObjectives: ['Execute the Keep-Change-Flip (reciprocal) division algorithm', 'Simplify resulting fractional quotients', 'Visualize fraction division using area and number line models'],
    intro: 'Dividing fractions is simpler than it looks! Our Dividing Fractions worksheet focuses on the "reciprocal" method, teaching students to transform a division problem into a multiplication one by flipping the second fraction. With clear examples and plenty of practice space, this resource ensures that students master the algorithm while understanding the underlying logic of "how many parts fit into a whole."'
  },
  'geo-compass-rose': {
    title: 'The Compass Rose - Learning Cardinal Directions | Wizqo',
    metaDescription: 'N, S, E, W! Master the directions with our Compass Rose worksheet. Learn to navigate maps and identify orientations. Free printable for grades K-2.',
    learningObjectives: ['Identify the four cardinal directions (North, South, East, West)', 'Correctly label a compass rose on a map', 'Use directional vocabulary to describe relative locations'],
    intro: 'Which way to the playground? Our Compass Rose worksheet introduces early explorers to the fundamental language of navigation. By learning to identify North, South, East, and West, children build the spatial awareness needed to read maps and understand the world around them. It\'s a fun, foundational geography lesson that turns everyday movement into a scientific adventure!'
  },
  'geo-continents-k2': {
    title: 'The Seven Continents - World Geography for Kids | Wizqo',
    metaDescription: 'Identify Africa, Antarctica, Asia, Australia, Europe, North America, and South America. Fun map-matching and labeling activity. Free PDF.',
    learningObjectives: ['Correctly name each of the seven continents', 'Identify continent shapes and locations on a global map', 'Learn basic facts about each world region'],
    intro: 'Our world is huge and diverse! Our Seven Continents worksheet takes students on a global tour, teaching them to recognize the giant landmasses that make up our planet. From the ice of Antarctica to the vastness of Asia, children build the foundational geography knowledge needed to understand world history, science, and current events. A perfect start for any young global citizen!'
  },
  'geo-landforms': {
    title: 'Identifying Landforms - Earth\'s Physical Features | Wizqo',
    metaDescription: 'Learn about mountains, valleys, plains, and plateaus. Practice matching names to physical descriptions of Earth\'s surface. Free printable PDF.',
    learningObjectives: ['Identify common physical features of the Earth (mountains, islands, valleys)', 'Distinguish between different land and water formations', 'Build scientific vocabulary for physical geography and geology'],
    intro: 'Earth has many shapes! Our Identifying Landforms worksheet helps students recognize the different physical features that define our landscape. By matching terms like "peninsula," "mountain," and "isthmus" to their visual representations, children gain the scientific vocabulary needed to describe the world\'s geography. This activity is a wonderful way to spark interest in geology and environmental science.'
  },
  'geo-latlong': {
    title: 'Longitude and Latitude - Global Coordinate Systems | Wizqo',
    metaDescription: 'Learn how to use "invisible lines" to find any spot on Earth. Introduction to the global grid system. Free PDF for grades 4-6 geography.',
    learningObjectives: ['Define the roles of the Equator and Prime Meridian', 'Understand latitude as "horizontal" and longitude as "vertical"', 'Use coordinates to locate specific points on a world map'],
    intro: 'Every place on Earth has an address—but it\'s not made of streets! Our Longitude and Latitude worksheet introduces the global grid system, teaching students how to use degrees to pinpoint any location on the planet. By understanding the "lines that go across" and the "lines that go up and down," learners build the advanced spatial reasoning used by pilots, captains, and GPS engineers.'
  },
  'geometry-word-problems': {
    title: 'Geometry Word Problems - Shapes in the Real World | Wizqo',
    metaDescription: 'Apply area, perimeter, and shape logic to daily stories! Practice solving geometry problems in context. Free printable PDF for grades 3-5.',
    learningObjectives: ['Translate narrative scenarios into geometric diagrams or formulas', 'Calculate dimensions based on descriptive textual clues', 'Select the appropriate measurement tool (Area vs. Perimeter) for a task'],
    intro: 'How much paint do you need for a wall? How long is the fence around the pool? Our Geometry Word Problems worksheet takes math formulas and puts them into action. By solving realistic scenarios involving construction, design, and travel, students learn that geometry is a vital tool for building and measuring the world we live in. Perfect for strengthening both math and reading skills!'
  },
  'grammar-detective': {
    title: 'Grammar Detective - Finding & Fixing Writing Errors | Wizqo',
    metaDescription: 'Become a language investigator! Identify and correct errors in punctuation, capitalization, and spelling. Free printable PDF for grades 2-4.',
    learningObjectives: ['Identify common grammatical errors in a variety of sentences', 'Apply rules of capitalization and punctuation to "broken" text', 'Improve self-editing skills for more polished writing'],
    intro: 'Something is wrong with these sentences—can you find the clues? Our Grammar Detective worksheet turn proofreading into a fun investigation. By searching for missing periods, misplaced capitals, and misspelled words, students build the "copy-editing" brain needed for high-quality writing. This practice makes grammar feel like a rewarding puzzle rather than just a series of rules to memorize.'
  },
  'gratitude-jar': {
    title: 'The Gratitude Jar - Social Emotional Learning Activity | Wizqo',
    metaDescription: 'Focus on the positive! Use our "Gratitude Jar" worksheet to identify things you are thankful for today. Free printable SEL resource for kids.',
    learningObjectives: ['Identify and reflect on positive personal experiences and relationships', 'Practice mindfulness and "positive focus" as a mental health tool', 'Express emotions through drawing and descriptive writing'],
    intro: 'What makes your heart happy? Our Gratitude Jar worksheet provides a peaceful, creative space for students to reflect on the good things in their lives. By "filling" their jar with people, things, and moments they are thankful for, children build a positive mindset and emotional resilience. This social-emotional learning tool is a wonderful way to start or end a busy school day with a sense of peace.'
  },
  'halloween-pack': {
    title: 'Halloween Learning Pack - Spooky Fun Activities | Wizqo',
    metaDescription: 'Download our Halloween-themed bundle! Includes spooky math, literacy, and art activities for a fun October lesson. Free printable PDF.',
    learningObjectives: ['Engage with academic concepts through seasonal themes', 'Practice counting, spelling, and fine motor skills with holiday imagery', 'Bridge the gap between "play" and "learning" during festivities'],
    intro: 'No tricks, just treats for the brain! Our Halloween Learning Pack combines math, literacy, and art with a fun, spooky twist. From counting ghosts to writing about a magic potion, this comprehensive resource keeps students engaged during the October season. It\'s the perfect way to maintain academic focus while celebrating a favorite holiday with creative and "frightfully" fun activities.'
  },
  'heavy-light': {
    title: 'Measurements: Heavy and Light - Early Comparison | Wizqo',
    metaDescription: 'Which one is harder to lift? Practice comparing weight with our elementary mass worksheet. Free printable for Preschool and Kindergarten.',
    learningObjectives: ['Distinguish between objects of significantly different weights', 'Use the vocabulary words "heavier" and "lighter" correctly', 'Develop the observational skills needed for early physical science'],
    intro: 'Is a feather heavier than a brick? Our Heavy and Light worksheet helps young scientists explore the world of mass and gravity. By looking at pairs of familiar objects and identifying which one takes "more muscle" to move, children build the foundational comparison skills needed for everything from cooking to physics. A simple, hands-on way to start measuring the physical world around us!'
  },
  'hidden-object': {
    title: 'Hidden Objects Challenge - Visual Perception Game | Wizqo',
    metaDescription: 'Can you find the secret items? Build focus, patience, and visual tracking with our fun "Hidden Objects" worksheet. Free printable PDF.',
    learningObjectives: ['Strengthen visual attention and detail-oriented focus', 'Improve visual tracking and scanning skills', 'Build persistence and concentration through a game-like format'],
    intro: 'Look closer! Our Hidden Objects Challenge turns concentration into a fun game of discovery. By searching for specific items in a detailed scene, students strengthen their visual processing and attention to detail—the same skills they\'ll need to scan a page for information when reading or to find errors in a math problem. It\'s a rewarding way to build the "focus muscle" that supports all academic learning.'
  },
  'identify-polygons': {
    title: 'Identifying Polygons - Geometry Shape Recognition | Wizqo',
    metaDescription: 'Is it a pentagon or a hexagon? Master polygon names and properties with our clear, printable geometry worksheet. Free PDF for grades 2-4.',
    learningObjectives: ['Define a polygon as a closed plane figure with straight sides', 'Identify shapes based on the number of sides (3 to 10)', 'Distinguish between regular and irregular polygons'],
    intro: 'The world is built of many sides! Our Identifying Polygons worksheet helps students move beyond basic squares and circles to master the names of multi-sided shapes. By counting sides and vertices to identify pentagons, octagons, and more, children build the precise geometric vocabulary needed for advanced math and architectural thinking.'
  },
  'letter-tracing-az': {
    title: 'A-Z Letter Tracing - Complete Handwriting Practice | Wizqo',
    metaDescription: 'Master every letter from A to Z! Practice uppercase and lowercase formation with our comprehensive handwriting guide. Free printable PDF.',
    learningObjectives: ['Develop proper stroke order for all 26 letters of the alphabet', 'Distinguish between uppercase and lowercase character forms', 'Build fine motor control and consistent letter sizing'],
    intro: 'Mastering the alphabet starts with the right strokes! Our A-Z Letter Tracing worksheet provides a complete roadmap for early writers to practice every letter in the English language. With clear directional guides and plenty of space for repetition, this resource helps children build the muscle memory and confidence needed for clear, legible handwriting.'
  },
  'line-plots': {
    title: 'Creating and Reading Line Plots - Data Analysis | Wizqo',
    metaDescription: 'Learn to represent data with Xs on a number line. Practice creating and interpreting line plots with our printable math worksheet. Free PDF.',
    learningObjectives: ['Organize a raw data set into a frequency table', 'Correctly plot data points as marks on a scaled number line', 'Analyze horizontal distribution to find clusters and outliers'],
    intro: 'Data tells a story, and line plots make it easy to see! Our Line Plots worksheet teaches students how to organize information by placing marks along a number line. From measuring plant growth to counting pets, children learn how to visualize "how many" of each item exists in a set, building the foundational data analysis skills used in science and statistics.'
  },
  'lines-angles-4th': {
    title: '4th Grade Lines and Angles - Geometry Mastery | Wizqo',
    metaDescription: 'Master points, lines, rays, and segments. Practice identifying acute, obtuse, and right angles with our 4th-grade geometry worksheet. Free PDF.',
    learningObjectives: ['Differentiate between lines, rays, and line segments', 'Identify and draw parallel, perpendicular, and intersecting lines', 'Classify angles as acute, obtuse, right, or straight'],
    intro: 'Geometry is all about the connections! Our 4th Grade Lines and Angles worksheet dives deep into the building blocks of shapes. By practicing the identification of rays and the measurement of various angle types, students gain the precision needed to describe complex figures and solve advanced spatial problems in middle school math.'
  },
  'lines-rays-angles': {
    title: 'Introduction to Lines, Rays, and Angles | Wizqo',
    metaDescription: 'Learn the fundamental "building blocks" of geometry. Practice identifying different line types and angle basics. Free printable PDF.',
    learningObjectives: ['Identify points, lines, rays, and segments by their endpoint symbols', 'Recognize the vertex as the meeting point of two rays', 'Understand basic angle nomenclature for early geometry'],
    intro: 'Before we build shapes, we must understand the lines that create them! Our Introduction to Lines, Rays, and Angles worksheet explains the essential "vocabulary" of the geometric world. By seeing the difference between a line that goes forever and a ray with a starting point, children build a rock-solid foundation for understanding how every shape in our world is constructed.'
  },
  'liquid-measurement': {
    title: 'Liquid Measurement - Understanding Cups to Gallons | Wizqo',
    metaDescription: 'How much water is in the jar? Learn about liquid volume (capacity) and standard units like cups, pints, and quarts. Free printable for kids.',
    learningObjectives: ['Identify standard units of liquid measurement (cup, pint, quart, gallon)', 'Compare relative capacities of common household containers', 'Estimate the volume of liquids using standard units'],
    intro: 'Is it a drop or a gallon? Our Liquid Measurement worksheet introduces students to the essential concepts of volume and capacity. By exploring how many cups fit in a pint and how many quarts make a gallon, children build the practical math skills used every day in the kitchen, the garden, and the science lab.'
  },
  'liquid-measurement-4th': {
    title: '4th Grade Liquid Capacity - Advanced Conversion | Wizqo',
    metaDescription: 'Master complex liquid measurement conversions. Solve multi-step problems involving gallons, quarts, and pints. Free printable PDF.',
    learningObjectives: ['Convert between various liquid units (e.g., gallons to cups)', 'Solve multi-step word problems involving liquid volume', 'Apply fractional concepts to capacity measurements'],
    intro: 'Take your measurement skills to the next level! Our 4th Grade Liquid Capacity worksheet challenges students to navigate the relationships between different units of volume. By performing conversions and solving real-world sharing problems, learners develop the numerical fluency needed for advanced science experiments and culinary arts.'
  },
  'long-division-multidigit': {
    title: 'Multidigit Long Division - Advanced Arithmetic | Wizqo',
    metaDescription: 'Master division with 3 and 4-digit dividends. Practice the step-by-step long division algorithm with our printable math worksheet. Free PDF.',
    learningObjectives: ['Execute the long division algorithm (DMSB) with large numbers', 'Manage multi-digit dividends and single or double-digit divisors', 'Correctly identify quotients and remainders in complex problems'],
    intro: 'Big numbers are no match for a great strategy! Our Multidigit Long Division worksheet helps students master the rhythm of Divide, Multiply, Subtract, and Bring Down with 3 and 4-digit numbers. By breaking large division problems into manageable steps, children build the mathematical stamina and accuracy required for higher-level algebra and real-world budgeting.'
  },
  'long-short': {
    title: 'Comparing Lengths: Long and Short - Early Prep | Wizqo',
    metaDescription: 'Which one is longer? Practice comparing object lengths with our fun "Long and Short" worksheet. Free printable for Preschool and Kindergarten.',
    learningObjectives: ['Visually distinguish between objects of different lengths', 'Use the comparative words "longer" and "shorter" correctly', 'Develop the observation skills needed for linear measurement'],
    intro: 'Which snake is the longest? Our Long and Short worksheet helps early learners explore the world of linear measurement through simple comparison. By looking at pairs of objects and identifying which one stretches further, children build the foundational spatial reasoning and vocabulary needed before they ever pick up a ruler!'
  },
  'mandalas': {
    title: 'Geometry Mandalas - Art, Symmetry & Focus | Wizqo',
    metaDescription: 'Combine math and art! Explore radial symmetry and geometric patterns with our beautiful mandala coloring worksheet. Free printable PDF.',
    learningObjectives: ['Identify radial symmetry and repeating geometric patterns', 'Explore the relationship between geometry and artistic design', 'Strengthen focus and fine motor control through detailed coloring'],
    intro: 'Math can be beautiful! Our Geometry Mandalas worksheet blends the precision of shapes with the creativity of art. By exploring radial symmetry—where patterns repeat in a circle—students see math in a whole new light. It\'s a relaxing, meditative way to build fine motor skills while reinforcing concepts of balance, rotation, and pattern recognition.'
  },
  'mass-weight': {
    title: 'Introduction to Mass and Weight - Measurement | Wizqo',
    metaDescription: 'Learn how we measure "how heavy" something is. Introduction to grams, kilograms, and pounds for elementary students. Free printable PDF.',
    learningObjectives: ['Understand the basic difference between mass and weight', 'Identify common units of weight (ounces, pounds, grams)', 'Compare the relative weights of everyday objects'],
    intro: 'How much does it weigh? Our Introduction to Mass and Weight worksheet helps students understand how we quantify the heaviness of objects. By exploring grams for light things and kilograms or pounds for heavier ones, children build the scientific understanding of matter and the practical skills needed for grocery shopping and post-office visits.'
  },
  'mass-weight-4th': {
    title: '4th Grade Mass and Weight - Unit Conversions | Wizqo',
    metaDescription: 'Master converting between units of mass and weight. Solve word problems involving pounds, ounces, and grams. Free printable for 4th Grade.',
    learningObjectives: ['Convert between standard units of weight (pounds to ounces)', 'Solve word problems involving mass and weight in a real-world context', 'Compare weights using different unit systems'],
    intro: 'Can you turn pounds into ounces? Our 4th Grade Mass and Weight worksheet challenges students to master the conversions that scientists and chefs use every day. By solving complex word problems and managing unit changes, learners build the computational accuracy and "number sense" needed for physical science and advanced measurement math.'
  },
  'math-maze': {
    title: 'Arithmetic Math Maze - Fun Operation Practice | Wizqo',
    metaDescription: 'Solve math problems to find the right path! A fun way to practice addition, subtraction, and multiplication. Free printable math puzzle PDF.',
    learningObjectives: ['Apply mental math fluency to navigate a puzzle path', 'Execute a series of operations in correct sequence', 'Strengthen persistence and problem-solving through a game format'],
    intro: 'Find your way out with numbers! Our Arithmetic Math Maze turns standard operation practice into an exciting puzzle adventure. To reach the finish line, students must solve their way through a grid of equations, choosing the path with the correct answers. It\'s a high-engagement way to build mental math speed and logical thinking without it ever feeling like "work".'
  },
  'mean-median-mode': {
    title: 'Introduction to Mean, Median, and Mode | Wizqo',
    metaDescription: 'Learn the three ways to find the "middle" of data. Practice calculating averages with our clear, printable statistics worksheet. Free PDF.',
    learningObjectives: ['Calculate the mean (average) of a small data set', 'Find the median (middle number) by ordering data', 'Identify the mode (most frequent number) in a set'],
    intro: 'What is "typical" in a group of numbers? Our Mean, Median, and Mode worksheet introduces students to the three essential tools of statistics. By learning to find the average, the middle, and the most common number, children gain the power to analyze everything from sports scores to weather patterns, building the critical thinking skills used by data scientists around the world.'
  },
  'measurement-length': {
    title: 'Measuring Length - Using Rulers and Standard Units | Wizqo',
    metaDescription: 'How long is the pencil? Practice using a ruler to measure in inches and centimeters with our printable math worksheet. Free PDF.',
    learningObjectives: ['Accurately use a ruler starting from the zero mark', 'Measure objects to the nearest whole or half unit (inch/cm)', 'Compare lengths using standard linear measurement units'],
    intro: 'Measure it exactly! Our Measuring Length worksheet takes students from estimating to precision. By practicing with real-world objects and standard units like inches and centimeters, children learn how to use the ruler correctly and understand the importance of standard scales. It\'s a fundamental life skill that bridges the gap between the classroom and the real world of building and creating!'
  },
  'mental-math-20': {
    title: 'Mental Math Within 20 - Speed & Accuracy Practice | Wizqo',
    metaDescription: 'Build fast "head math" skills! Practice adding and subtracting within 20 without using fingers or paper. Free printable PDF.',
    learningObjectives: ['Develop speed and accuracy in basic arithmetic facts', 'Strengthen working memory and numerical visualization', 'Identify number bonds and patterns within the 0-20 range'],
    intro: 'Put away the pencil and trust your brain! Our Mental Math Within 20 worksheet focuses on building "number sense" and calculation speed. By practicing these foundational facts until they become second nature, students free up their cognitive energy for the more complex math challenges they\'ll face in higher grades.'
  },
  'metric-units': {
    title: 'Introduction to Metric Units - Liters, Grams & Meters | Wizqo',
    metaDescription: 'Learn the primary units of the metric system. Practice choosing the right unit for mass, volume, and length. Free printable PDF.',
    learningObjectives: ['Identify grams, liters, and meters as standard units', 'Match specific units to their physical properties (mass vs volume)', 'Develop a baseline "sense" for metric quantities in daily life'],
    intro: 'How do you measure a mountain versus a mosquito? Our Introduction to Metric Units worksheet helps students pick the right tool for the job. By exploring the roles of grams for weight, liters for liquid, and meters for length, children build a universal scientific vocabulary that works in any country and any lab.'
  },
  'missing-addends': {
    title: 'Missing Addends - Solving for the Unknown Number | Wizqo',
    metaDescription: 'Find the secret number! Practice solving addition problems where one part is missing (e.g., 5 + ? = 12). Perfect for early algebra prep. Free PDF.',
    learningObjectives: ['Identify the missing component in an addition equation', 'Understand the relationship between addition and subtraction', 'Build foundations for solving algebraic variables'],
    intro: 'Equations are like puzzles with a missing piece! Our Missing Addends worksheet teaches students how to find the "unknown" number that makes a math statement true. This practice isn\'t just about addition—it\'s the very first step toward algebra, helping children think flexibly about how numbers fit together.'
  },
  'missing-numbers-50': {
    title: 'Missing Numbers to 50 - Counting & Sequence Mastery | Wizqo',
    metaDescription: 'Fill in the blanks! Complete number sequences and grids up to 50 to build counting fluency. Free printable PDF for Kindergarten and 1st Grade.',
    learningObjectives: ['Develop fluency in the 1-50 number sequence', 'Identify "one more" and "one less" within a series', 'Strengthen number recognition and writing accuracy'],
    intro: 'Our number line has some gaps—can you fix them? Our Missing Numbers to 50 worksheet provides vital practice for children mastering the rhythmic order of numbers. By identifying what comes before, after, and in-between, students build the deep familiarity with the 0-50 range that supports all future arithmetic.'
  },
  'missing-shape': {
    title: 'Missing Shape Patterns - Logic & Visual Perception | Wizqo',
    metaDescription: 'Identify the next shape in the sequence! Build logical reasoning and visual tracking with our fun pattern worksheet. Free printable PDF.',
    learningObjectives: ['Analyze geometric sequences to identify repeating rules', 'Predict the next element in a visual pattern', 'Develop detail-oriented scanning and focus skills'],
    intro: 'What comes next? Our Missing Shape Patterns worksheet challenges students to become "pattern detectives." By analyzing sequences of circles, squares, and triangles, children sharpen the logical reasoning skills used in both computer programming and higher-level mathematics. It\'s a visual brain-teaser that makes logic feel like a game!'
  },
  'mixed-improper-fractions': {
    title: 'Converting Mixed Numbers & Improper Fractions | Wizqo',
    metaDescription: 'Master the relationship between 1 1/2 and 3/2. Practice switching between fraction formats with our clear math worksheet. Free PDF.',
    learningObjectives: ['Convert mixed numbers into improper fractions', 'Simplify improper fractions back into mixed numbers', 'Visualize the equivalence using area models and number lines'],
    intro: 'Two ways to say the same thing! Our Mixed Numbers and Improper Fractions worksheet helps students bridge the gap between whole numbers and parts. By learning the "multiply and add" strategy to convert formats, children gain the flexibility needed to perform advanced fraction multiplication and division with ease.'
  },
  'money-coins-bills': {
    title: 'Identifying Money: Coins and Bills - US Currency | Wizqo',
    metaDescription: 'Pennies, nickels, dimes, and dollars! Practice identifying and naming US currency with our clear, printable worksheet. Free PDF.',
    learningObjectives: ['Identify the names and values of common US coins and bills', 'Differentiate between physical currency based on color and size', 'Calculate simple total values for small groups of money'],
    intro: 'It\'s time to talk about cents! Our Coins and Bills worksheet introduces students to the physical currency we use every day. From the copper penny to the green dollar bill, children build the foundational financial literacy needed to understand prices, savings, and the value of a job well done.'
  },
  'mood-tracker': {
    title: 'Daily Mood Tracker - Social Emotional Learning Tool | Wizqo',
    metaDescription: 'Check in with your feelings! Use our daily mood log to identify and express emotions. Free printable SEL activity for classroom or home.',
    learningObjectives: ['Identify and name personal emotional states over time', 'Practice mindfulness and self-reflection as a daily habit', 'Connect moods to external events or internal thoughts'],
    intro: 'How are you feeling today? Our Daily Mood Tracker provides a colorful, safe space for students to explore their emotional landscape. By identifying their feelings each day, children build the self-awareness and emotional intelligence needed to manage stress and build healthy relationships with themselves and others.'
  },
  'more-less': {
    title: 'Comparing Amounts: More and Less - Early Math | Wizqo',
    metaDescription: 'Identify the bigger group! Practice basic comparison concepts with our fun, visual "More or Less" worksheet. Free printable for Pre-K.',
    learningObjectives: ['Visually distinguish between groups of different sizes', 'Use the quantitative words "more" and "less" correctly', 'Develop foundational number sense before formal counting'],
    intro: 'Which pile of cookies is bigger? Our More or Less worksheet helps early learners understand the concept of quantity without needing to count every single item. By focusing on the visual "size" of groups, children build the primary mathematical intuition that underpins all future work with numbers and sets.'
  },
  'more-less-equal-10': {
    title: 'Comparing Numbers to 10 - Greater, Less, or Equal | Wizqo',
    metaDescription: 'Master the <, >, and = symbols! Practice comparing single-digit numbers with our clear, printable math worksheet. Free PDF.',
    learningObjectives: ['Correctly use the comparison symbols <, >, and =', 'Analyze the relative value of digits within the 1-10 range', 'Strengthen number-line visualization and numeric order'],
    intro: 'Which way does the "alligator" mouth point? Our Comparing Numbers to 10 worksheet introduces the classic symbols of math comparison. By deciding if 7 is bigger, smaller, or equal to 3, students build the analytical brain needed to handle complex inequalities and logical proofs in later years.'
  },
  'mult-2x1': {
    title: '2-Digit by 1-Digit Multiplication - Step-by-Step | Wizqo',
    metaDescription: 'Learn to multiply larger numbers! Master the standard algorithm for 2x1 multiplication with our clear math worksheet. Free printable PDF.',
    learningObjectives: ['Execute the vertical multiplication algorithm for 2-digit numbers', 'Manage regrouping (carrying) from the ones to the tens place', 'Identify the relationship between partial products and the final total'],
    intro: 'Ready to go beyond the basic times tables? Our 2-Digit by 1-Digit Multiplication worksheet teaches students the classical algorithm for handling larger numbers. By breaking the process into "bottom times ones" and "bottom times tens," children gain the confidence to tackle any multi-digit problem with precision and speed.'
  },
  'mult-2x1-digit': {
    title: 'Intensive 2x1 Digit Multiplication Practice | Wizqo',
    metaDescription: 'Master the rhythm of multi-digit multiplication! Targeted practice for 2x1 digit problems with plenty of workspace. Free PDF.',
    learningObjectives: ['Strengthen fluency with the 2-digit multiplication algorithm', 'Improve accuracy in carrying and adding regrouped digits', 'Build the mathematical stamina needed for multi-step arithmetic'],
    intro: 'Consistency is the key to math mastery! This intensive 2x1 Digit Multiplication worksheet provides the repetition needed to turn a new skill into an automatic habit. With clear grids and ample space for "carrying," students can focus on the rhythmic steps of the algorithm until they can solve two-digit problems with their eyes closed!'
  },
  'mult-2x2': {
    title: '2-Digit by 2-Digit Multiplication - The Standard Algorithm | Wizqo',
    metaDescription: 'Step up to 2x2 multiplication! Master the double-digit vertical method with our clear, structured math worksheet. Free printable PDF.',
    learningObjectives: ['Multiply by a two-digit number using regrouping', 'Understand the role of the "zero placeholder" in the tens-place step', 'Correctly sum partial products for the final answer'],
    intro: 'You\'ve mastered the basics, now let\'s double up! Our 2-Digit by 2-Digit Multiplication worksheet guides students through the "double-decker" vertical algorithm. By learning where to place the placeholder zero and how to manage multiple rounds of carrying, children build the precision and patience required for real-world algebra and advanced engineering math.'
  },
  'mult-2x2-digit': {
    title: 'Double-Digit Multiplication Intensive Practice | Wizqo',
    metaDescription: 'Build stamina with 2x2 digit multiplication. Structured practice sheets for mastering the vertical algorithm. Free PDF for grades 4-5.',
    learningObjectives: ['Improve fluency and speed in 2x2 digit vertical multiplication', 'Strengthen mental accuracy in regrouping and partial sums', 'Identify and correct common errors in placeholder placement'],
    intro: 'Repetition is the path to expertise! This Intensive 2x2 Digit Multiplication worksheet provides a rigorous workout for students who know the steps but need more practice to achieve total accuracy. With plenty of workspace and a clean grid layout, learners can focus on the rhythmic repetition of "multiply, carry, and add" until the standard algorithm becomes second nature.'
  },
  'mult-3x2-digit': {
    title: '3-Digit by 2-Digit Multiplication Mastery | Wizqo',
    metaDescription: 'Take on bigger numbers! Practice multiplying 3-digit numbers by 2-digit factors with our advanced arithmetic worksheet. Free PDF.',
    learningObjectives: ['Extend the vertical multiplication algorithm to 3-digit numbers', 'Manage complex regrouping across hundreds and thousands places', 'Develop organizational skills for large multi-step math problems'],
    intro: 'Are you ready for a challenge? Our 3-Digit by 2-Digit Multiplication worksheet is for students who have mastered the basics and are ready for professional-grade arithmetic. By managing larger partial products and tracking complex carries across multiple place values, children build the mathematical stamina and organizational discipline used by architects and computer scientists.'
  },
  'mult-area-model': {
    title: 'Multiplication Area Model - Visualizing Partial Products | Wizqo',
    metaDescription: 'See the math behind the numbers! Use box models to break down multiplication into manageable chunks. Free printable for grades 3-5.',
    learningObjectives: ['Decompose numbers into expanded form (tens and ones)', 'Visualize multiplication as the area of a rectangle', 'Connect partial products in a grid to the final solution'],
    intro: 'Multiplication isn\'t just a set of rules—it\'s a map! Our Area Model Multiplication worksheet teaches students how to break large numbers into friendly "chunks" using expanded form. By calculating the area of each box in the grid, children see exactly how partial products contribute to the final answer. It\'s the perfect bridge for visual learners moving toward the standard vertical algorithm.'
  },
  'mult-arrays-models': {
    title: 'Multiplication Arrays and Visual Models Practice | Wizqo',
    metaDescription: 'Connect pictures to equations! Master multiplication using rows and columns with our visual math worksheet. Free printable PDF.',
    learningObjectives: ['Translate visual arrays into multiplication number sentences', 'Identify rows and columns as factors in an equation', 'Strengthen commutative property awareness through visual rotation'],
    intro: 'Math is all about patterns! Our Multiplication Arrays and Models worksheet helps students see the logic behind the "times" sign. By representing equations as rows and columns of objects, children build a concrete understanding of quantity and group-size. This visual foundation makes it much easier to memorize facts and understand how multiplication scale works in geometry!'
  },
  'mult-by-10-100': {
    title: 'Multiplying by 10 and 100 - Mental Math Shortcuts | Wizqo',
    metaDescription: 'Master the "add a zero" trick! Learn to multiply large numbers by 10, 100, and 1000 with speed and accuracy. Free printable PDF.',
    learningObjectives: ['Identify the place-value shift when multiplying by powers of 10', 'Apply decimal-shifting shortcuts for rapid mental calculation', 'Understand the relationship between base-10 and scientific notation'],
    intro: 'Why work harder when you can work faster? Our Multiplying by 10 and 100 worksheet teaches students the most powerful shortcut in the math world. By learning how zeroes move digits to the left on the place-value chart, children gain the ability to multiply massive numbers in their heads, building the numerical confidence used by rocket scientists and financial analysts!'
  },
  'mult-complex-word': {
    title: 'Complex Multiplication Word Problems - Multi-Step Math | Wizqo',
    metaDescription: 'Solve real-world math mysteries! Apply multiplication to multi-step stories involving logic and reasoning. Free PDF for grades 4-5.',
    learningObjectives: ['Extract relevant data from complex narrative contexts', 'Sequentially apply multiplication to multi-step scenarios', 'Verify real-world logic and plausibility of mathematical results'],
    intro: 'The real world doesn\'t just give you a list of numbers—it tells you a story! Our Complex Multiplication Word Problems worksheet challenges students to be "math investigators." From planning a school carnival budget to calculating resources for a space station, these problems require children to think critically, step-by-step, to find the right solution to a tricky problem.'
  },
  'mult-fact-families': {
    title: 'Multiplication Fact Families - The Inverse Connection | Wizqo',
    metaDescription: 'Link multiplication and division! Understand the relationship between factors and quotients with our fact family worksheet. Free PDF.',
    learningObjectives: ['Identify the "three-number" relationship in fact families', 'Write four related equations (2 multiplication, 2 division) for a set', 'Reinforce the commutative property of multiplication'],
    intro: 'Multiplication and division are two sides of the same coin! Our Fact Families worksheet helps students see the deep connection between inverse operations. By discovering that 4x5=20 and 20÷5=4 belong to the same number house, children build the algebraic flexibility needed to solve for variables and master their basic calculation facts with half the effort!'
  },
  'mult-fact-fluency': {
    title: 'Multiplication Fact Fluency - Speed & Accuracy Drills | Wizqo',
    metaDescription: 'Build instant recall of times tables! High-engagement drills for mastering multiplication facts 0-12. Free printable math worksheet.',
    learningObjectives: ['Develop automaticity and instant recall for basic facts', 'Identify personal "tough spots" in the times tables', 'Improve calculation speed under low-stakes practice conditions'],
    intro: 'Turn your math into a reflex! Our Multiplication Fact Fluency worksheet is designed to build "automaticity"—the ability to answer a problem without even having to think about it. By practicing these core facts until they are as fast as saying your own name, students free up their brains to tackle the exciting logic of geometry, fractions, and algebra in the years ahead!'
  },
  'mult-mixed-review': {
    title: 'Multiplication Mixed Review - The Ultimate Challenge | Wizqo',
    metaDescription: 'Switch gears! Practice varied multiplication types from basic facts to area models in one comprehensive worksheet. Free PDF.',
    learningObjectives: ['Identify and apply different strategies for varied problem types', 'Flexibly move between algorithms, models, and word problems', 'Demonstrate comprehensive mastery of multiplication concepts'],
    intro: 'Are you a multiplication master? Our Mixed Review worksheet is the ultimate test of your skills! Instead of doing the same thing over and over, you\'ll have to switch gears between vertical problems, area models, and tricky word problems on a single page. It\'s the perfect way to prove that you don\'t just know the rules—you truly understand the power of multiplication!'
  },
  'mult-multi-step-word': {
    title: 'Multi-Step Multiplication Word Problems - Real-World Logic | Wizqo',
    metaDescription: 'Solve complex math stories! Apply multiplication in multiple steps to find solutions for realistic scenarios. Free printable PDF for grades 4-5.',
    learningObjectives: ['Deconstruct complex narratives into sequential math operations', 'Apply advanced multiplication algorithms to multi-part problems', 'Verify the logical consistency of multi-step numerical results'],
    intro: 'Real-world math is rarely a single step! Our Multi-Step Multiplication Word Problems worksheet teaches students how to break down complex stories into a logical series of calculations. From managing a farm\'s harvest to planning global shipping routes, these problems build the analytical stamina and critical thinking skills needed for success in science, business, and beyond.'
  },
  'mult-patterns': {
    title: 'Multiplication Number Patterns - Sequence and Logic | Wizqo',
    metaDescription: 'Discover the rhythm of numbers! Identify and extend patterns based on multiplication rules. Free printable math worksheet for grades 3-5.',
    learningObjectives: ['Identify recursive multiplication rules in a number sequence', 'Extend geometric and numerical patterns accurately', 'Connect multiplication facts to the growth of sequences'],
    intro: 'Numbers have a secret rhythm! Our Multiplication Number Patterns worksheet challenges students to become "math detectives" who find the rules that make a sequence grow. Whether it\'s doubling, tripling, or following a complex multiplicative skip-count, this practice builds the predictive logic and algebraic intuition that underpins higher-level computer science and mathematical theory.'
  },
  'mult-properties': {
    title: 'Properties of Multiplication - Commutative, Associative & More | Wizqo',
    metaDescription: 'Learn the rules of the game! Practice applying the properties that make multiplication work. Free printable math worksheet for grades 3-5.',
    learningObjectives: ['Identify and apply the Commutative, Associative, and Distributive properties', 'Understand how regrouping factors can simplify mental math', 'Explain "why" multiplication equations work through property definitions'],
    intro: 'Math has universal laws! Our Properties of Multiplication worksheet helps students move beyond "how" to calculate and start understanding "why" multiplication behaves the way it does. By exploring concepts like the flipped order of the Commutative property or the breaking-apart power of the Distributive property, children gain the flexible thinking tools used by professional mathematicians to simplify even the largest problems.'
  },
  'mult-strategies': {
    title: 'Effective Multiplication Strategies - Beyond the Algorithms | Wizqo',
    metaDescription: 'Learn diverse ways to multiply! Explore doubling, halving, partial products, and more. Free printable for flexible math thinking.',
    learningObjectives: ['Apply diverse mental math strategies like doubling and halving', 'Use partial products to simplify complex multi-digit calculations', 'Select the most efficient multiplication method for a given problem'],
    intro: 'There is more than one way to find an answer! Our Multiplication Strategies worksheet introduces students to a toolbox of mental math techniques. From breaking numbers apart into friendly chunks to using the "doubles" method for rapid calculation, this practice encourages flexible thinking and numerical creativity, ensuring that students never feel "stuck" when they encounter a challenging problem.'
  },
  'mult-word-problems-2-3': {
    title: 'Multiplication Word Problems - Grades 2 and 3 Practice | Wizqo',
    metaDescription: 'Start solving math stories! Introductory multiplication word problems tailored for early elementary readers. Free printable PDF.',
    learningObjectives: ['Identify multiplication scenarios in simple reading passages', 'Connect "groups of" language in text to the times (x) symbol', 'Solve introductory multiplication problems within familiar real-world contexts'],
    intro: 'Let\'s turn stories into math! Our Multiplication Word Problems for Grades 2-3 are specifically written for younger learners who are just beginning to see how groups of objects work in the real world. By solving relatable problems about toy collections, classroom snacks, and playground games, children build the foundational "translation" skills that bridge the gap between reading and arithmetic.'
  },
  'nets-3d-shapes': {
    title: '3D Shape Nets - From 2D Foldouts to 3D Figures | Wizqo',
    metaDescription: 'Make geometry tactile! Fold 2D "nets" into cubes, prisms, and pyramids. Free printable geometry craft and learning worksheet.',
    learningObjectives: ['Identify the 2D layout (net) that corresponds to a 3D solid', 'Analyze the number of faces, edges, and vertices on a geometric figure', 'Strengthen spatial visualization by mentally "folding" a 2D shape'],
    intro: 'Geometry is something you can touch! Our 3D Shape Nets worksheet provides foldable templates for cubes, rectangular prisms, and pyramids. By cutting, folding, and gluing these 2D layouts into 3D objects, students gain an intuitive understanding of surface area and spatial logic that no textbook diagram can match. It\'s a hands-on exploration of the building blocks of our physical world!'
  },
  'number-bonds-10': {
    title: 'Number Bonds to 10 - Part-Part-Whole Relationships | Wizqo',
    metaDescription: 'Master the "friends of ten"! Practice finding pairs that add up to 10 with our visual number bond worksheet. Free PDF for K-1st grade.',
    learningObjectives: ['Identify the missing addend in "sum of ten" pairs', 'Visualize the part-part-whole structure of the number 10', 'Build foundational mental math recall for basic addition facts'],
    intro: 'Ten is the most important number in our math system! Our Number Bonds to 10 worksheet helps early learners master the "friends of ten"—pairs like 7 and 3, or 6 and 4. By visualizing these relationships through "bond bubbles," children build the rock-solid base-ten foundation needed for regrouping, multi-digit addition, and efficient mental calculation in the future.'
  },
  'number-line-200': {
    title: 'Number Line to 200 - Navigating 3-Digit Numbers | Wizqo',
    metaDescription: 'Extend your math horizons! Practice identifying and ordering numbers up to 200 on a visual number line. Free printable PDF for 2nd grade.',
    learningObjectives: ['Accurately place 2 and 3-digit numbers on a linear scale', 'Identify "one more" and "one less" within the 100-200 range', 'Strengthen the mental number line for larger numbers'],
    intro: 'How big is 200? Our Number Line to 200 worksheet takes students beyond the basic 100-chart and into the world of three-digit numbers. By visualizing where numbers "live" relative to one another, children build the spatial sense and interval-counting skills needed to handle addition and subtraction with hundreds. It\'s a vital tool for making large numbers feel manageable!'
  },
  'number-line-add': {
    title: 'Adding on a Number Line - The Jump Method | Wizqo',
    metaDescription: 'Jump your way to the answer! Practice the visual addition strategy with our number line worksheet. Free printable PDF for grades 1-2.',
    learningObjectives: ['Apply the "jump" method to solve addition equations visually', 'Understand addition as movement to the right on a number line', 'Decompose addends into "friendly jumps" (like jumps of 5 or 10)'],
    intro: 'Let\'s take a math walk! Our Adding on a Number Line worksheet teaches students how to use "jumps" to solve addition problems. Instead of just memorizing facts, children learn to move step-by-step along a visual path, seeing exactly how sums grow. This strategy is particularly powerful for learning how to group numbers and "make ten" during mental math.'
  },
  'number-matching-1-15': {
    title: 'Number Matching (1-15) - Digits and Quantity | Wizqo',
    metaDescription: 'Connect numbers to objects! Practice counting and identifying quantities from 1 to 15. Free early learning math worksheet for Pre-K and K.',
    learningObjectives: ['Correctly match written numerals (1-15) to sets of illustrated objects', 'Strengthen one-to-one correspondence during counting', 'Build recognition and naming speed for 2-digit numbers up to 15'],
    intro: 'Counting is more than saying words—it\'s about understanding how many! Our Number Matching (1-15) worksheet helps early learners connect the "symbol" (the written number) with the "reality" (a group of objects). By drawing lines to match numbers like 12 or 15 to their equivalent groups, children build the foundational number sense and one-to-one correspondence needed for all future arithmetic.'
  },
  'ordering-fractions-decimals': {
    title: 'Ordering Fractions and Decimals - Mixed Value Sequencing | Wizqo',
    metaDescription: 'Put numbers in their place! Practice sequencing fractions and decimals on a single number line. Free printable math worksheet for grades 4-6.',
    learningObjectives: ['Convert between fractions and decimals for easier comparison', 'Compare mixed numerical formats using a common number line', 'Sequence diverse rational numbers from least to greatest'],
    intro: 'Is 0.5 bigger than 1/4? Our Ordering Fractions and Decimals worksheet helps students solve this puzzle by teaching them how to compare different "dialects" of the same math language. By converting values to a common format and plotting them on a single scale, learners build the flexible numerical reasoning needed for advanced science and financial math.'
  },
  'partial-products': {
    title: 'Multiplication via Partial Products - Area Model Method | Wizqo',
    metaDescription: 'Break it down! Master multi-digit multiplication by solving simpler partial products. Free printable math worksheet for grades 3-5.',
    learningObjectives: ['Decompose multi-digit factors into place-value components', 'Calculate individual partial products before summing for the total', 'Visualize the distributive property in action during multiplication'],
    intro: 'Big numbers are just groups of small numbers! Our Partial Products worksheet teaches students how to multiply by breaking problems into manageable pieces. By solving for each place value separately and then adding the results, children build a deep, conceptual understanding of the distributive property that makes the standard algorithm much easier to master.'
  },
  'pattern-complete': {
    title: 'Completing Complex Patterns - Logical Reasoning Prep | Wizqo',
    metaDescription: 'Find the missing piece! Practice identifying and extending complex numerical and visual patterns. Free printable PDF for grades 2-4.',
    learningObjectives: ['Analyze sequences to identify underlying mathematical rules', 'Predict and fill in missing terms in complex patterns', 'Strengthen deductive reasoning and predictive thinking skills'],
    intro: 'Can you see the rule? Our Pattern Complete worksheet challenges students to be "math detectives." By analyzing sequences that grow, shrink, or repeat in complex ways, children sharpen the logical brain needed for both computer coding and high-level geometry. It\'s a fun, puzzle-based way to build mathematical foresight!'
  },
  'pemdas-advanced': {
    title: 'Advanced PEMDAS - Nesting, Exponents & Roots | Wizqo',
    metaDescription: 'Order of operations for experts! Master complex equations with nested parentheses and exponents. Free PDF for grades 5-7.',
    learningObjectives: ['Apply the full PEMDAS hierarchy to multi-layered equations', 'Correctly manage nested parentheses (bracket within brackets)', 'Execute calculations involving exponents and multiple operational tiers'],
    intro: 'Ready for the professional league of arithmetic? Advanced PEMDAS takes the standard hierarchy and adds layers of complexity with nested parentheses and power operations. By following the "order of operations" through intricate, multi-step equations, students build the rigorous discipline and procedural accuracy required for college-level algebra and physics.'
  },
  'pemdas-basic': {
    title: 'Basic PEMDAS - Introduction to Order of Operations | Wizqo',
    metaDescription: 'Start with the rules! Practice simple expression evaluation with addition, subtraction, and multiplication. Free printable for grades 3-4.',
    learningObjectives: ['Identify the priority of multiplication over addition and subtraction', 'Use the left-to-right rule for operations of the same tier', 'Evaluate simple numerical expressions with 2 or 3 steps'],
    intro: 'Why do we multiply before we add? Our Basic PEMDAS worksheet introduces students to the "laws of math." By practicing simple equations that require a specific order to reach the correct answer, children learn that math isn\'t just about the numbers—it\'s about the sequence. It\'s the first step toward understanding the grammar of mathematics!'
  },
  'pemdas-complex': {
    title: 'Complex PEMDAS - Challenge Equations for Mastery | Wizqo',
    metaDescription: 'Tackle the big ones! Challenging order of operations problems involving all four tiers. Free printable PDF for grades 5-6.',
    learningObjectives: ['Navigate complex equations with competing operational priorities', 'Maintain accuracy through 5+ step mathematical evaluations', 'Identify and avoid common order-of-operation pifalls'],
    intro: 'It\'s time to put your skills to the test! Our Complex PEMDAS worksheet features equations with a "twist"—multiple groups of parentheses, exponents, and competing multiplications. By working through these brain-teasers, students develop the mathematical stamina and focus needed to ensure that even the most cluttered expressions result in the perfect answer.'
  },
  'pemdas-exponents': {
    title: 'PEMDAS with Exponents - Power and Priority | Wizqo',
    metaDescription: 'Master the "E" in PEMDAS! Practice order of operations with squares and cubes. Free printable math worksheet for grades 5-6.',
    learningObjectives: ['Correctly prioritize exponents after parentheses and before multiplication', 'Calculate squares and cubes within multi-step numerical expressions', 'Understand how exponents impact the growth of an equation\'s value'],
    intro: 'Exponents add "power" to your math! This targeted PEMDAS worksheet focuses on the critical second step of the hierarchy: Exponents. By practicing how to handle squared and cubed numbers before moving on to multiplication and division, students build the foundational skills needed for scientific notation and advanced algebraic modeling.'
  },
  'pemdas-fluency': {
    title: 'PEMDAS Fluency - Rapid Order of Operations Drills | Wizqo',
    metaDescription: 'Turn the rules into a reflex! Speed and accuracy practice for standard order of operations. Free PDF for grades 4-6.',
    learningObjectives: ['Develop automaticity in identifying operational priorities', 'Improve calculation speed for multi-step arithmetic', 'Recall the PEMDAS hierarchy instantly under drill conditions'],
    intro: 'Don\'t think—just calculate! Our PEMDAS Fluency worksheet is designed to turn the order of operations into a second-nature habit. By practicing these rules through high-repetition drills, students free up their cognitive energy for the logic of the problem itself, rather than getting stuck on "which step comes next." Speed and accuracy start here!'
  },
  'pemdas-mixed-review': {
    title: 'PEMDAS Mixed Review - The Ultimate Rules Test | Wizqo',
    metaDescription: 'Switch tiers! varied order of operations problems from basic to advanced on one page. Free printable for grades 4-6 math.',
    learningObjectives: ['Identify the specific tier of PEMDAS required for varied problems', 'Flexibly apply different rules across a diverse set of equations', 'Demonstrate comprehensive mastery of the operational hierarchy'],
    intro: 'Can you handle anything the math world throws at you? This Mixed Review worksheet features a random assortment of PEMDAS problems, from simple two-step additions to complex equations with markers and exponents. It\'s the perfect final check to ensure that you\'ve truly mastered the laws of math and can apply them anywhere!'
  },
  'pemdas-multistep': {
    title: 'Multi-Step PEMDAS - Advanced Sequential Calculation | Wizqo',
    metaDescription: 'Track your steps! Lengthy order of operations problems requiring careful organization. Free printable PDF for grades 5-6.',
    learningObjectives: ['Organize complex calculations into distinct, sequential steps', 'Maintain accuracy over long strings of mathematical operations', 'Identify "inner" and "outer" priorities in complex strings'],
    intro: 'Math is a marathon, not a sprint! Our Multi-Step PEMDAS worksheet features "long" equations that can have seven or eight different operations in a row. By learning how to carefully peel back the layers of a long expression—one step at a time—students build the organizational discipline and patience used by accountants, engineers, and programmers.'
  },
  'pemdas-parentheses': {
    title: 'PEMDAS Parentheses Practice - The Power of Grouping | Wizqo',
    metaDescription: 'Master the first step of order of operations! Practice evaluating math expressions where parentheses change everything. Free printable PDF.',
    learningObjectives: ['Identify and prioritize calculations inside parentheses', 'Understand how grouping symbols change the value of an equation', 'Maintain operational order through multi-layered grouping'],
    intro: 'Parentheses always come first! Our PEMDAS Parentheses worksheet focuses on the critical first step of the math hierarchy. By practicing how grouping symbols "jump the line" in front of multiplication and addition, students learn the foundational rules of algebraic syntax. It\'s the secret to solving complex formulas with total accuracy!'
  },
  'pemdas-practice': {
    title: 'PEMDAS Order of Operations - Comprehensive Practice | Wizqo',
    metaDescription: 'Master the rules of math! A varied collection of order of operations problems for all skill levels. Free printable PDF for grades 4-6.',
    learningObjectives: ['Apply the full PEMDAS hierarchy to varied arithmetic expressions', 'Identify operational priorities across multiple tiers (P-E-MD-AS)', 'Strengthen mental math accuracy in sequential calculation'],
    intro: 'Math follows a specific set of laws, and our PEMDAS Practice worksheet helps you master them all! From simple three-step addition to complex multi-operator equations, this practice sheet provides the repetition needed to make the "order of operations" an automatic habit. Perfect for establishing a strong foundation before moving on to pre-algebra!'
  },
  'pemdas-rules': {
    title: 'Mastering PEMDAS Rules - Order of Operations Guide | Wizqo',
    metaDescription: 'Remember the mnemonic! Targeted practice for identifying which math step comes next. Free printable worksheet for grades 4-5.',
    learningObjectives: ['Define the meaning of each letter in the PEMDAS acronym', 'Differentiate between the priority levels of MD (Multiplication/Division) and AS (Addition/Subtraction)', 'Correctly identify the next step in a provided math expression'],
    intro: 'Please Excuse My Dear Aunt Sally! Our PEMDAS Rules worksheet helps students go beyond just memorizing the acronym and start understanding the hierarchy. By analyzing equations and labeling which step "goes first," children build the logical clarity needed to ensure every math challenge they meet results in the right answer.'
  },
  'pemdas-step-by-step': {
    title: 'Step-by-Step PEMDAS - Guided Operational Reduction | Wizqo',
    metaDescription: 'Slow down and get it right! Guided practice for reducing complex math equations one step at a time. Free printable PDF.',
    learningObjectives: ['Break complex expressions into single, manageable operational steps', 'Demonstrate the reduction process through clear, line-by-line workspace', 'Avoid common errors by focusing on one priority tier at a time'],
    intro: 'Don\'t rush the math! Our Step-by-Step PEMDAS worksheet is designed to teach students organizational discipline. With dedicated workspace for each reduction in the equation, children learn to solve one part at a time, bringing the whole expression closer to its final answer with every line. It\'s the best way to build confidence and stop calculation mistakes before they happen!'
  },
  'pemdas-word-problems': {
    title: 'PEMDAS Word Problems - Translating Stories to Equations | Wizqo',
    metaDescription: 'Apply the rules to real life! Solve story problems that require correct order of operations. Free printable PDF for grades 5-6.',
    learningObjectives: ['Translate complex narrative scenarios into PEMDAS-ready math expressions', 'Identify real-world grouping and priority scenarios in text', 'Solve multi-part story problems with sequential mathematical accuracy'],
    intro: 'The real world is multi-step! Our PEMDAS Word Problems worksheet challenges students to take a story and turn it into a perfect math formula. Whether you\'re calculating the total cost of a group trip or planning resources for a space voyage, these problems teach you how to organize data and follow the rules of math to solve real-life mysteries.'
  },
  'percent-to-decimal': {
    title: 'Converting Percents to Decimals - Place Value Mastery | Wizqo',
    metaDescription: 'Learn the two-step shift! practice converting percentages into decimal values and vice versa. Free printable math worksheet.',
    learningObjectives: ['Master the "shift by two" decimal point movement', 'Understand that percent means "per one hundred"', 'Flexibly move between hundredths, decimals, and percent symbols'],
    intro: 'Percentage is just a different dialect of decimal! Our Percent to Decimal worksheet teaches students the simple logic of the decimal-point shift. By understanding that "75%" is just a faster way of saying "0.75," children gain the numerical flexibility needed for calculating taxes, reading scientific data, and mastering middle school math.'
  },
  'percent-word-problems': {
    title: 'Real-World Percent Word Problems - Finance & Logic | Wizqo',
    metaDescription: 'Calculate taxes, tips, and discounts! Apply percentage math to realistic shopping and data scenarios. Free printable PDF.',
    learningObjectives: ['Calculate "percent of" in practical shopping and financial contexts', 'Understand the impact of discounts and taxes on total price', 'Apply decimal and percentage logic to real-world narrative data'],
    intro: 'Math is how you manage your money! Our Percent Word Problems worksheet takes abstract numbers and puts them in the shopping mall. From calculating a 20% discount on a new game to figuring out the tax on a school lunch, these problems teach students the essential financial literacy skills they\'ll use for the rest of their lives.'
  },
  'perimeter-area-word-problems': {
    title: 'Perimeter and Area Word Problems - Geometry in Context | Wizqo',
    metaDescription: 'Solve for space! Apply geometric formulas to real-world stories about fences, gardens, and rooms. Free printable PDF for grades 4-5.',
    learningObjectives: ['Distinguish between the "boundary" concept (perimeter) and the "space" concept (area)', 'Apply formulas correctly in a varied narrative context', 'Solve for missing dimensions given a total perimeter or area'],
    intro: 'How much fence do you need for a yard? How much rug do you need for a room? Our Perimeter and Area Word Problems worksheet turns geometry into a practical tool for designers, architects, and gardeners. By solving these real-world scenarios, students learn to visualize physical space and apply math formulas to solve structural challenges.'
  },
  'perimeter-shapes': {
    title: 'Calculating Perimeter of Polygons - Boundary Practice | Wizqo',
    metaDescription: 'Walk around the edge! Practice summing side lengths for squares, rectangles, and irregular shapes. Free printable PDF for grades 3-4.',
    learningObjectives: ['Define perimeter as the total distance around a 2D shape', 'Sum the side lengths of various polygons with accuracy', 'Calculate perimeter for irregular shapes with missing or implied labels'],
    intro: 'Perimeter is simply "the long way around"! Our Perimeter of Shapes worksheet teaches students how to measure the boundary of any polygon. From perfect squares to tricky irregular shapes, this practice builds the foundational geometry skills and addition accuracy needed to understand our three-dimensional world.'
  },
  'picture-addition-10': {
    title: 'Picture Addition within 10 - Visual Math Early Learning | Wizqo',
    metaDescription: 'Count and add! Use fun icons and images to find sums within 10. Perfect for Pre-K and Kindergarten math readiness. Free PDF.',
    learningObjectives: ['Translate groups of physical objects into numerical addends', 'Complete simple addition equations using visual cues', 'Develop one-to-one correspondence while finding sums'],
    intro: 'Math is all around us! Our Picture Addition within 10 worksheet helps early learners see that numbers represent real things. By counting groups of cute animals, colorful toys, and delicious snacks, children build the foundational "part-part-whole" understanding that turns counting into calculation. It\'s the perfect, low-stress bridge to formal arithmetic!'
  },
  'place-value-hto': {
    title: 'Place Value: Hundreds, Tens, and Ones - Base-10 Mastery | Wizqo',
    metaDescription: 'Understand the building blocks of numbers! Practice identifying HTO values (Hundreds, Tens, Ones) with our visual place value worksheet. Free PDF.',
    learningObjectives: ['Identify the value of digits in the hundreds, tens, and ones places', 'Decompose three-digit numbers into expanded form', 'Understand the power-of-10 relationship between adjacent place values'],
    intro: 'Every large number is just a collection of smaller groups! Our Hundreds, Tens, and Ones (HTO) worksheet helps students peek behind the curtain of the base-10 system. By breaking down 3-digit numbers into their component parts, children build the mental model needed for regrouping, multi-digit addition, and complex mental math. It\'s the key to making big numbers feel small!'
  },
  'powers-of-10': {
    title: 'Powers of 10 - Multiplying and Dividing by 10/100/1000 | Wizqo',
    metaDescription: 'Master the decimal shift! Learn to scale numbers up and down using powers of ten. Free printable math worksheet for grades 4-6.',
    learningObjectives: ['Identify the pattern of zeroes when multiplying by powers of 10', 'Efficiently shift decimal points to the right or left based on markers', 'Understand the relationship between base-10 and exponential growth'],
    intro: 'How fast can you multiply by a million? Our Powers of 10 worksheet teaches students the secret shortcuts of the decimal system. By learning how zeroes act as place-value signals, children gain the ability to scale numbers up or down in their heads, building the numerical speed needed for scientific notation and advanced engineering formulas.'
  },
  'prime-composite': {
    title: 'Prime and Composite Numbers - Factorization Mastery | Wizqo',
    metaDescription: 'Identify the "unbreakable" numbers! Practice categorizing numbers as prime or composite based on their factors. Free printable PDF.',
    learningObjectives: ['Distinguish between numbers with exactly two factors (prime) and more (composite)', 'Identify common prime numbers within the 1-100 range', 'Understand the role of primes as the building blocks of number theory'],
    intro: 'Some numbers simply cannot be broken! Our Prime and Composite Numbers worksheet helps students explore the fundamental architecture of math. By testing which numbers can be divided into equal groups and which remain "indivisible," children build the number-sense foundation needed for simplifying fractions, finding least common multiples, and understanding secure digital encryption.'
  },
  'probability': {
    title: 'Introduction to Probability - Chance and Likelihood | Wizqo',
    metaDescription: 'Will it happen? Learn about likely, unlikely, and certain outcomes with our introductory probability worksheet. Free printable for grades 3-5.',
    learningObjectives: ['Define probability as the measure of chance for an event', 'Identify outcomes as certain, likely, unlikely, or impossible', 'Calculate simple probabilities using fractions and visual data'],
    intro: 'Is it a sure thing? Our Introduction to Probability worksheet teaches students how to measure the "maybe." From flipping coins to pulling marbles from a bag, children learn the language of chance and how to use math to predict the world around them. It\'s a vital tool for understanding everything from weather reports to game strategy!'
  },
  'ratio-proportion-word-problems': {
    title: 'Ratio and Proportion Word Problems - Real-World Balancing | Wizqo',
    metaDescription: 'Keep things in balance! Apply ratio and proportion logic to real-life stories like recipes and maps. Free printable PDF for grades 5-6.',
    learningObjectives: ['Identify the fixed relationship between two quantities in a narrative', 'Use cross-multiplication or scaling to solve for missing proportions', 'Apply ratio logic to practical scenarios like scaling recipes or distances'],
    intro: 'Math is all about balance! Our Ratio and Proportion Word Problems worksheet shows students how to keep relationships steady even when the numbers change. Whether you\'re doubling a cake recipe or calculating the scale of a map, these problems build the algebraic reasoning and proportional thinking skills used every day by chefs, artists, and architects.'
  },
  'reading-g1-big-box': {
    title: 'Reading Comprehension: The Big Box - Grade 1 Story | Wizqo',
    metaDescription: 'A tale of imagination! Read the 1st-grade story "The Big Box" and answer questions to build literacy and inference skills. Free PDF.',
    learningObjectives: ['Recall key plot points from an imaginative narrative', 'Identify the main character\'s creative use of an object', 'Practice decoding simple descriptive sentences'],
    intro: 'To a child, a cardboard box is never just a box! "The Big Box" is a delightful 1st-grade reading passage that celebrates the power of imagination. By reading about how a simple object becomes a spaceship or a castle, students build their literacy skills through a story they can truly relate to. After reading, targeted questions help confirm their understanding and detail-finding abilities.'
  },
  'reading-g1-birthday-cake': {
    title: 'Reading Comprehension: The Birthday Cake - G1 Phonics | Wizqo',
    metaDescription: 'Celebrate and learn! Download our 1st-grade reading passage "The Birthday Cake" with comprehension questions for early literacy. Free printable.',
    learningObjectives: ['Sequence the events of a party preparation story', 'Identify nouns and verbs related to a birthday celebration', 'Answer "who, what, and where" questions based on the text'],
    intro: 'It\'s time for a party! Our "The Birthday Cake" reading comprehension worksheet is designed specifically for emerging 1st-grade readers. This engaging story uses familiar vocabulary to describe the excitement of preparing for a special day. By answering simple questions after the passage, children gain confidence in their ability to extract meaning from text while enjoying a joyful narrative.'
  },
  'reading-g1-bus-ride': {
    title: 'Reading Comprehension: The Bus Ride - 1st Grade Literacy | Wizqo',
    metaDescription: 'Practice morning routines! Read "The Bus Ride" and complete questions to build 1st-grade comprehension and vocabulary. Free PDF.',
    learningObjectives: ['Recall details about a daily morning routine', 'Identify the chronological order of events in the story', 'Practice environmental reading by recognizing bus-related vocabulary'],
    intro: 'The school day starts with a journey! "The Bus Ride" is a relatable short story for 1st-grade students that focuses on the sights and sounds of the morning commute. By reading about meeting the driver and finding a seat, children build their situational vocabulary and reading stamina. The included questions encourage them to look back at the text to verify facts—a vital skill for all future reading success.'
  },
  'reading-g1-garden-snail': {
    title: 'Reading Comprehension: The Garden Snail - Grade 1 Science | Wizqo',
    metaDescription: 'Learn about backyard biology! An informational passage for 1st grade about garden snails with simple facts and questions. Free printable.',
    learningObjectives: ['Differentiate between informational (non-fiction) and narrative text', 'Recall scientific facts about snail movement and shells', 'Identify the main topic of a descriptive passage'],
    intro: 'Who is that hiding under the leaf? Our "Garden Snail" reading passage introduces 1st-grade students to the world of informational text. This non-fiction worksheet provides simple, fascinating facts about how snails move and protect themselves. It\'s the perfect resource for blending science and literacy, helping children learn "how things work" while they master new vocabulary.'
  },
  'reading-g1-pet-fish': {
    title: 'Reading Comprehension: My Pet Fish - G1 Responsibility | Wizqo',
    metaDescription: 'Learn about pet care! Read the 1st-grade story "My Pet Fish" and answer questions about care and responsibility. Free printable PDF.',
    learningObjectives: ['Identify the steps of simple pet care mentioned in the story', 'Express empathy for a character\'s responsibility', 'Practice answering complete sentence questions about a passage'],
    intro: 'Having a pet is a big responsibility! "My Pet Fish" is a 1st-grade reading comprehension story that teaches children about caring for a living creature. By reading about feeding and cleaning the tank, students build their vocabulary while reflecting on the importance of chores and empathy. This printable resource is excellent for both literacy centers and social-emotional learning discussions.'
  },
  'reading-g1-red-balloon': {
    title: 'Reading Comprehension: The Red Balloon - G1 Phonics | Wizqo',
    metaDescription: 'Follow the journey! Read the 1st-grade story "The Red Balloon" and answer questions to build early literacy and color recognition. Free PDF.',
    learningObjectives: ['Trace the chronological path of a moving object in a story', 'Identify adjectives (colors/sizes) used in the narrative', 'Answering descriptive questions based on the text'],
    intro: 'Up, up, and away! "The Red Balloon" is a charming 1st-grade reading passage that follows the journey of a bright red balloon through a neighborhood. By tracking where the balloon goes and who it meets, children build their sequencing skills and descriptive vocabulary. This printable worksheet is a great way to make reading practice feel like a joyful adventure!'
  },
  'reading-g2-bird-feeder': {
    title: 'Reading Comprehension: Making a Bird Feeder - G2 Science | Wizqo',
    metaDescription: 'Help the birds! Read this informational 2nd-grade passage about bird feeders and wildlife care. Includes facts and questions. Free PDF.',
    learningObjectives: ['Identify the steps and materials needed for a simple project', 'Understand the ecological benefit of feeding local birds', 'Apply context clues to define new vocabulary words'],
    intro: 'How can we help our feathered friends? Our "Making a Bird Feeder" reading passage for 2nd grade combines practical "how-to" information with backyard science. By reading about common bird species and what they eat, students build their informational literacy while learning about environmental responsibility. It\'s a perfect resource for young naturalists!'
  },
  'reading-g2-cookie-recipe': {
    title: 'Reading Comprehension: The Cookie Recipe - G2 Functional Reading | Wizqo',
    metaDescription: 'Read the instructions! Practice sequencing and measurement vocabulary with our "Cookie Recipe" 2nd-grade reading worksheet. Free PDF.',
    learningObjectives: ['Sequence the chronological steps of a recipe', 'Identify specific measurements and units in a functional text', 'Understand the importance of following directions in order'],
    intro: 'Cooking is math and reading in action! "The Cookie Recipe" is a functional reading worksheet for 2nd-grade students that uses a delicious scenario to teach sequencing and measurement vocabulary. By reading the steps to bake a batch of cookies, children learn how to extract specific information from a "technical" text—a vital life skill that goes beyond standard storytelling.'
  },
  'reading-g2-library-card': {
    title: 'Reading Comprehension: Getting a Library Card - G2 Community | Wizqo',
    metaDescription: 'A world of books! Read the 2nd-grade story about visiting the library and build community awareness and literacy. Free printable.',
    learningObjectives: ['Identify the civic role of the library in a community', 'Summarize the steps required to receive a library card', 'Practice inferring characters\' feelings from their actions'],
    intro: 'The library is a gateway to every world imaginable! This 2nd-grade reading comprehension story follows a child’s first trip to get their very own library card. By reading about the shelves, the librarian, and the responsibility of borrowing books, students build their community awareness while strengthening their inference and detail-finding skills.'
  },
  'reading-g2-lost-and-found': {
    title: 'Reading Comprehension: The Lost and Found - G2 SEL | Wizqo',
    metaDescription: 'A lesson in honesty! Read the 2nd-grade story "The Lost and Found" and answer questions about character and community. Free printable.',
    learningObjectives: ['Identify the central conflict and resolution of a narrative', 'Discuss the character trait of honesty as presented in the text', 'Apply lesson-based inference to real-world social scenarios'],
    intro: 'What would you do if you found something that didn\'t belong to you? "The Lost and Found" is a 2nd-grade reading passage that blends literacy with social-emotional learning. By following a character who finds a lost item and decides to do the right thing, students practice identification of plot points while reflecting on values like honesty and empathy.'
  },
  'reading-g2-paper-bridge': {
    title: 'Reading Comprehension: The Paper Bridge - G2 STEM | Wizqo',
    metaDescription: 'Build and learn! An informational 2nd-grade reading passage about engineering and testing bridges. Includes comprehension questions. Free PDF.',
    learningObjectives: ['Understand the basic principles of structural engineering and support', 'Identify the variables used in a scientific experiment described in text', 'Analyze how different shapes provide different levels of strength'],
    intro: 'Can a piece of paper hold up a heavy toy? Our "Paper Bridge" reading comprehension worksheet for 2nd grade introduces students to the exciting world of STEM and engineering. By reading about a classroom experiment with folds, triangles, and weight-testing, children build their informational reading skills while learning the logic of structural design.'
  },
  'reading-g2-rainy-garden': {
    title: 'Reading Comprehension: The Rainy Garden - G2 Science | Wizqo',
    metaDescription: 'Explore the weather! An informational 2nd-grade passage about how gardens grow and change in the rain. Free printable math and literacy.',
    learningObjectives: ['Recall facts about the water cycle and plant growth', 'Identify cause-and-effect relationships in a nature-based text', 'Categorize various garden animals and their reactions to weather'],
    intro: 'What happens to the garden when it rains? This 2nd-grade informational text takes a scientific look at a rainy day. From worms coming to the surface to plants getting a much-needed drink, students learn about backyard biology through clear, descriptive prose. It\'s a wonderful resource for building academic vocabulary and a love for the natural world.'
  },
  'reading-g2-tree-house': {
    title: 'Reading Comprehension: The Tree House - G2 Teamwork | Wizqo',
    metaDescription: 'Work together! Read the 2nd-grade story "The Tree House" and answer questions about cooperation and construction. Free printable PDF.',
    learningObjectives: ['Identify the roles of different characters in a collaborative project', 'Summarize the steps involved in building a structure in the story', 'Connect the theme of teamwork to personal classroom experiences'],
    intro: 'Building something big takes a team! "The Tree House" is a 2nd-grade reading comprehension passage that celebrates cooperation and creativity. By reading about a group of friends who work together to design and build their perfect hangout, students practice identifying character traits and plot details while reflecting on the importance of working with others to reach a goal.'
  },
  'reading-g2-magic-seeds': {
    title: 'Reading Comprehension: The Magic Seeds - G2 Imagination | Wizqo',
    metaDescription: 'A tale of wonder! Read the 2nd-grade imaginative story "The Magic Seeds" and build inference and vocabulary skills. Free printable PDF.',
    learningObjectives: ['Identify elements of fantasy vs. reality in a narrative', 'Predict future story events based on magical plot clues', 'Describe the setting and its transformation throughout the story'],
    intro: 'What would you plant in a magical garden? "The Magic Seeds" is an enchanting 2nd-grade reading passage that encourages students to think outside the box. By following a character who plants mysterious seeds that grow into impossible things, children build their inference skills and creative vocabulary. It\'s the perfect spark for a follow-up creative writing session!'
  },
  'reading-g3-art-project': {
    title: 'Reading Comprehension: The Big Art Project - G3 Literacy | Wizqo',
    metaDescription: 'Express yourself! Read the 3rd-grade story about creativity and personal expression. Includes advanced comprehension questions. Free PDF.',
    learningObjectives: ['Identify the internal motivation of a character in the story', 'Analyze how a character overcomes a creative block', 'Evaluate the theme of personal expression vs. following the rules'],
    intro: 'Art is more than just drawing—it\'s a way to tell the world who you are! "The Big Art Project" is a 3rd-grade reading comprehension story that explores the emotional side of creativity. By following a student who struggles to find their own style for a class assignment, readers build their ability to analyze character motivations and complex themes. It\'s an excellent bridge to upper-elementary literary analysis.'
  },
  'reading-g3-community-garden': {
    title: 'Reading Comprehension: The Community Garden - G3 Teamwork | Wizqo',
    metaDescription: 'Grow together! Read the 3rd-grade story about urban gardening and cooperation. Includes detail-finding questions. Free printable PDF.',
    learningObjectives: ['Identify the benefits of community projects for a neighborhood', 'Analyze how different characters contribute to a shared goal', 'Recall specific botanical and gardening vocabulary from the text'],
    intro: 'It takes many hands to make a garden grow! "The Community Garden" is a 3rd-grade reading passage that highlights the power of working together. By reading about how neighbors transform a vacant lot into a beautiful green space, students practice identifying main ideas and supporting details while reflecting on community and environmental care.'
  },
  'reading-g3-lighthouse': {
    title: 'Reading Comprehension: The Coastal Lighthouse - G3 Narrative | Wizqo',
    metaDescription: 'A light in the dark! Read the descriptive 3rd-grade story about lighthouses and coastal life. Free printable math and literacy. PDF included.',
    learningObjectives: ['Analyze descriptive language used to establish a coastal setting', 'Understand the historical and functional role of lighthouses', 'Practice summarizing a narrative with a strong focus on setting'],
    intro: 'Standing tall against the waves, the lighthouse has a story to tell! This 3rd-grade reading comprehension worksheet uses rich sensory details to bring a coastal setting to life. By reading about the history and purpose of these maritime beacons, students build their descriptive vocabulary and their ability to visualize a story\'s location while confirming facts through targeted questions.'
  },
  'reading-g3-school-play': {
    title: 'Reading Comprehension: The School Play - G3 Performance | Wizqo',
    metaDescription: 'Take the stage! Read the 3rd-grade story about overcoming stage fright and the performing arts. Free printable literacy worksheet.',
    learningObjectives: ['Trace the internal emotional growth of a character from start to finish', 'Identify the climax and resolution in a performance-based narrative', 'Connect the story\'s theme of bravery to personal school experiences'],
    intro: 'Spotlight on! "The School Play" is an engaging 3rd-grade reading passage that explores the excitement—and the nerves—of performing. By following a character from the first rehearsal to the final bow, readers build their empathy and character analysis skills. It\'s a relatable narrative that encourages children to see the value of practice and the thrill of overcoming a fear.'
  },
  'reading-g3-science-fair': {
    title: 'Reading Comprehension: The Science Fair - G3 Innovation | Wizqo',
    metaDescription: 'Test your hypothesis! Read the 3rd-grade story about curiosity and the scientific method. Includes comprehension questions. Free PDF.',
    learningObjectives: ['Identify the steps of the scientific method as presented in the story', 'Analyze how a character uses logical thinking to solve a problem', 'Recall specific scientific vocabulary used in the narrative'],
    intro: 'Curiosity is the start of every great discovery! "The Science Fair" is a 3rd-grade reading comprehension story that introduces students to the logic of experimentation. By following a character as they develop a project and test their ideas, children learn about the scientific method in a fun, narrative context. After reading, use the included questions to check for understanding of both plot and procedure.'
  },
  'reading-mini-1': {
    title: 'Mini Reading Comprehension (Set 1) - Quick Drill | Wizqo',
    metaDescription: 'Fast-track literacy skills! Concise reading passage with targeted questions for a quick comprehension check. Free printable for grades 1-3.',
    learningObjectives: ['Efficiently extract the main idea from a short, dense text', 'Identify key supporting details with high speed and accuracy', 'Practice focused reading for quick information retrieval'],
    intro: 'Big learning in a small package! Our Mini Reading Comprehension (Set 1) is designed for quick, focused literacy drills. Whether you\'re looking for a fast classroom warm-up or a targeted assessment tool, this concise passage and question set helps students practice the essential skill of finding the "who, what, and where" without the fatigue of a long story.'
  },
  'rhyming-words': {
    title: 'Rhyming Words Practice - Phonics & Sound Patterns | Wizqo',
    metaDescription: 'Hear the beat! Practice identifying and generating rhyming words to build phonics and reading fluency. Free printable for K-2nd grade.',
    learningObjectives: ['Identify words with the same ending sound (rhyme)', 'Sort words into "families" based on their auditory patterns', 'Strengthen phonological awareness for early reading success'],
    intro: 'Cat, bat, hat—can you hear the match? Our Rhyming Words worksheet is a fundamental phonics tool for early readers. By practicing how to identify and group words with similar ending sounds, children build the auditory recognition and word-family knowledge needed for fluent decoding and creative poetry writing. It\'s a fun, musical way to master the sounds of English!'
  },
  'rounding-nearest-10': {
    title: 'Rounding to the Nearest 10 - Estimation Skills | Wizqo',
    metaDescription: 'Find the nearest landmark! Master the 0-4 / 5-9 rule for rounding two-digit numbers. Free printable math worksheet for grades 2-3.',
    learningObjectives: ['Apply the standard rounding rules (0-4 down, 5-9 up)', 'Identify the nearest "multiple of 10" for any provided number', 'Understand the practical role of rounding in estimation and mental math'],
    intro: 'Rounding is like finding the closest "rest stop" on the number line! Our Rounding to the Nearest 10 worksheet helps students master the basic rules of estimation. By learning when to "stay" and when to "round up," children gain the ability to make fast, accurate guesses in math and real life. It\'s an essential skill for grocery shopping, time management, and mental arithmetic!'
  },
  'same-different': {
    title: 'Same vs. Different - Early Logic & Discrimination | Wizqo',
    metaDescription: 'Spot the pattern! Build visual discrimination and comparison skills with our early learning logic worksheet. Perfect for Pre-K and K.',
    learningObjectives: ['Identify similarities and differences in shape, color, and size', 'Analyze groups of objects to find the one that doesn\'t belong', 'Clearly articulate the reasoning behind a comparison'],
    intro: 'Math begins with observation! Our Same vs. Different worksheet helps the youngest learners build the visual discrimination skills they need for both geometry and reading. By comparing groups of fun icons and identifying what makes them unique, children sharpen their focus and their ability to categorize the world around them. It\'s the first step in logical thinking!'
  },
  'science-lifecycle': {
    title: 'Plant and Animal Lifecycles - Nature\'s Timeline | Wizqo',
    metaDescription: 'Watch them grow! Practice sequencing the stages of life for butterflies, frogs, and sunflowers. Free printable science worksheet.',
    learningObjectives: ['Sequence the chronological stages of a specific lifecycle', 'Identify key biological terms like "larva," "pupa," or "seedling"', 'Understand the repetitive, cyclical nature of life in the natural world'],
    intro: 'Every living thing has a story that repeats! Our Science Lifecycles worksheet takes students on a journey from "seed to sunflower" and "egg to frog." By practicing how to order the stages of growth, children develop a deep understanding of transformation and biology. This visual sequencing activity is a great way to bring the wonders of nature into the classroom or home library.'
  },
  'science-match': {
    title: 'General Science Matching - Tools and Functions | Wizqo',
    metaDescription: 'Connect the dots in science! Link tools to their uses and organs to their jobs. Free printable science worksheet for grades 1-3.',
    learningObjectives: ['Connect scientific tools (like thermometers) to their specific functions', 'Match biological organs to the body systems they support', 'Strengthen associative logic and scientific vocabulary'],
    intro: 'Science is all about how things work together! Our Science Match worksheet challenges students to connect the "tool" to the "task." Whether it\'s matching a magnifying glass to the act of observation or a heart to the circulatory system, this associative logic practice builds a strong foundation of scientific knowledge and vocabulary. It\'s a great way to reinforce concepts from various science units in one fun activity!'
  },
  'shape-identification': {
    title: 'Geometric Shape Identification - Early Geometry Mastery | Wizqo',
    metaDescription: 'Is it a hexagon or a pentagon? Practice identifying and naming 2D geometric shapes with our visual geometry worksheet. Free printable PDF.',
    learningObjectives: ['Correctly name common 2D shapes based on their visual properties', 'Identify the specific number of sides and corners for each shape', 'Build foundations for geometric classification and spatial reasoning'],
    intro: 'Geometric shapes are the puzzle pieces of our world! Our Shape Identification worksheet helps students move beyond "ball" and "box" to formal math terms like "sphere" and "rectangle." By learning the names and properties of varied polygons, children build the spatial reasoning and vocabulary needed for advanced geometry and architectural design. It\'s a vital first step in seeing the world through a mathematical lens!'
  },
  'shape-patterns': {
    title: 'Completing Geometric Shape Patterns - Logic Practice | Wizqo',
    metaDescription: 'Predict the next piece! Strengthen logical reasoning with our geometric shape pattern worksheet. Perfect for Pre-K and K math readiness.',
    learningObjectives: ['Complete repeating (ABAB) and growing patterns of geometric shapes', 'Identify the underlying logical rule of a visual sequence', 'Strengthen predictive thinking and visual attention to detail'],
    intro: 'Patterns are everywhere in nature and in math! Our Shape Patterns worksheet challenges early learners to be "shape detectives." By identifying the rules of repeating sequences, children develop the predictive thinking and logical processing used in computer programming and high-level algebra. It\'s a fun, visual way to build a brain that looks for order in the world!'
  },
  'shape-sorting': {
    title: 'Geometric Shape Sorting - Attribute Logic | Wizqo',
    metaDescription: 'Sort by sides and corners! practice categorizing 2D shapes with our visual sorting worksheet. Free printable for Kindergarten and 1st grade.',
    learningObjectives: ['Categorize shapes based on shared physical attributes (sides, corners)', 'Identify common properties among diverse geometric figures', 'Differentiate between shapes that look similar but have different names'],
    intro: 'What makes a square a square? Our Shape Sorting worksheet teaches students to look past the surface and analyze the "blueprint" of a shape. By organizing diverse figures into groups based on their attributes, children build the critical thinking and classification skills used by scientists and engineers. It\'s more than just a game—it\'s an introduction to logical taxonomy!'
  },
  'sight-words-pre-primer': {
    title: 'Pre-Primer Sight Words - Early Literacy Fluency | Wizqo',
    metaDescription: 'Master the "hidden" words! Practice high-frequency sight words for emerging readers. Free printable PDF for Pre-K and Kindergarten.',
    learningObjectives: ['Identify and read high-frequency "sight words" by rote recognition', 'Increase reading speed for the most common words in early narratives', 'Build confidence and stamina for independent reading activities'],
    intro: 'Some words don\'t follow the rules! Our Pre-Primer Sight Words worksheet helps early readers master the "building blocks" of English sentences. These high-frequency words often appear unexpectedly and can\'t always be sounded out phonetically. By practicing recognition and repetition, children build the fluency and confidence they need to move from "decoding" to truly enjoying their first stories.'
  },
  'size-comparison': {
    title: 'Scale and Size Comparison - Early Measurement Logic | Wizqo',
    metaDescription: 'Biggest vs. Smallest! Practice comparing relative scale and size with our visual measurement worksheet. Free printable for Pre-K and K.',
    learningObjectives: ['Identify relative scale using terms like "bigger," "smaller," and "same"', 'Sequence a group of objects from shortest to tallest or vice versa', 'Develop the visual discrimination needed for physical measurement concepts'],
    intro: 'Which one is the giant? Our Size Comparison worksheet helps young learners understand the relationship between objects in physical space. By comparing animals, plants, and toys, children build the observational logic and vocabulary (like "longest" and "shortest") used in everyday life and future science experiments. It\'s a wonderful way to help kids start measuring the world without needing a ruler!'
  },
  'skip-count-mult': {
    title: 'Skip-Counting for Multiplication mastery - Math Patterns | Wizqo',
    metaDescription: 'Turn counting into calculating! Practice skip-counting patterns to build multiplication table fluency. Free printable PDF for grades 2-3.',
    learningObjectives: ['Connect rhythmic skip-counting patterns to multiplication facts', 'Identify intervals of 2, 5, 10, and more on a standard number scale', 'Build mental math speed for repetitive addition and division prep'],
    intro: 'Counting by ones is good, but skip-counting is faster! Our Skip-Count for Multiplication worksheet bridge the gap between simple counting and advanced arithmetic. By learning how numbers "jump" in patterns of 3, 4, or 6, students build the mental pathways used for the multiplication table and early division. It\'s rhythmic, logical, and the secret to mathematical speed!'
  },
  'solving-one-step-equations': {
    title: 'Solving One-Step Equations - Intro to Algebra | Wizqo',
    metaDescription: 'Find the hidden value! Practice isolating variables in basic addition and subtraction equations. Free printable for grades 5-6.',
    learningObjectives: ['Understand the concept of a variable (x) as a placeholder for a value', 'Apply inverse operations (addition/subtraction) to isolate a variable', 'Verify equation balance by substituting results back into the problem'],
    intro: 'Algebra is like a math mystery! Our Solving One-Step Equations worksheet introduces students to the concept of the "variable." By learning how to work backwards to solve for "x," children build the logical discipline and procedural accuracy needed for all of high school math. It\'s the perfect, low-stress bridge from basic arithmetic to the world of algebraic reasoning!'
  },
  'spelling': {
    title: 'Targeted Spelling Practice - Phonics and Word Patterns | Wizqo',
    metaDescription: 'Master the patterns! Practice spelling common words to build literacy and writing fluency. Free printable PDF for early elementary.',
    learningObjectives: ['Correctly spell high-frequency and phonics-based words', 'Identify common letter clusters and auditory patterns (blends/digraphs)', 'Strengthen the connection between written form and verbal sound'],
    intro: 'Spelling is the bridge between thinking and writing! our Targeted Spelling worksheet helps students master the core patterns of the English language. By focusing on both phonetic rules and those "tricky" exceptions, children build the confidence to express their own ideas clearly on paper. It\'s a vital literacy tool that turns students into powerful communicators for the classroom and beyond.'
  },
  'spot-difference': {
    title: 'Spot the Difference Puzzle - Visual Attention Drill | Wizqo',
    metaDescription: 'Look closer! Build visual discrimination and attention to detail with our fun "Spot the Difference" challenge. Free printable for kids.',
    learningObjectives: ['Strengthen visual attention and sustained concentration', 'Identify subtle differences in shape, color, position, and detail', 'Develop the visual scanning habits used in reading and data analysis'],
    intro: 'Good observers see what others miss! Our Spot the Difference worksheet is a fun "workout" for the eyes and the brain. By scanning two similar images for subtle "hidden" changes, children develop the sustained focus and visual discrimination habits used in proofreading, map navigation, and scientific observation. It\'s a puzzle that builds the foundation for academic accuracy!'
  },
  'stem-leaf-plots': {
    title: 'Stem-and-Leaf Plots - Data Analysis and Stats | Wizqo',
    metaDescription: 'Organize your data! Practice creating and interpreting stem-and-leaf plots for statistical sets. Free printable math worksheet for grades 4-6.',
    learningObjectives: ['Organize raw data into a functional stem-and-leaf structure', 'Identify the range, median, and mode of a dataset using the plot', 'Understand how to read and interpret vertical place-value data maps'],
    intro: 'Data is just a mess until you organize it! Our Stem-and-Leaf Plots worksheet teaches students one of the most powerful tools in basic statistics. By splitting numbers into "stems" (tens) and "leaves" (ones), learners can quickly see patterns, outliers, and averages in large datasets. It\'s a vital skill for future scientists, economists, and anyone who wants to understand the world through numbers!'
  },
  'sub-2digit-regrouping': {
    title: '2-Digit Subtraction with Regrouping - Mastering Borrowing | Wizqo',
    metaDescription: 'Step up your subtraction! Practice 2-digit "borrowing" with our regrouping worksheet. Free printable math PDF for grades 2-3.',
    learningObjectives: ['Master the process of "borrowing" or regrouping from the tens place', 'Correctly align multi-digit numbers for subtraction accuracy', 'Verify subtraction results using inverse addition operations'],
    intro: 'Sometimes you have to borrow to move forward! Our 2-Digit Subtraction with Regrouping worksheet focuses on the critical shift from basic arithmetic to multi-digit logic. By learning how to transform one ten into ten ones, students build the place-value foundation needed for complex subtraction and mental math. It\'s a major milestone in every young mathematician\'s journey!'
  },
  'sudoku4': {
    title: 'Introductory 4x4 Sudoku - Early Logic Puzzles | Wizqo',
    metaDescription: 'A brain workout for beginners! Solve 4x4 Sudoku puzzles to build deductive reasoning and concentration. Free printable for kids.',
    learningObjectives: ['Complete 4x4 grids by ensuring no numbers repeat in any row, column, or block', 'Develop early deductive reasoning and "process of elimination" skills', 'Strengthen visual attention and sustained focus through logic'],
    intro: 'Math can be a game! Our 4x4 Sudoku worksheet is the perfect introduction to the world of logic puzzles. By using numbers 1-4 to fill in the grid without repeats, children learn the "process of elimination" and deductive thinking habits used in coding and advanced geometry. It\'s a fun, stress-free way to build a powerful brain!'
  },
  'sudoku6': {
    title: 'Intermediate 6x6 Sudoku - Logical Thinking Challenge | Wizqo',
    metaDescription: 'Level up the logic! 6x6 Sudoku puzzles for increasing concentration and deductive skills. Free printable PDF for grades 2-5.',
    learningObjectives: ['Analyze a 6x6 grid to identify missing numerical values in rows and blocks', 'Manage multiple logical constraints simultaneously during problem-solving', 'Build the mathematical stamina needed for more complex 9x9 puzzles'],
    intro: 'Ready for a bigger challenge? Our 6x6 Sudoku worksheet takes logic to the next level. With more numbers and more blocks to track, students must sharpen their focus and use advanced deductive strategies to solve the puzzle. It\'s an excellent way to bridge the gap between simple games and the high-level critical thinking used in pre-algebra and beyond!'
  },
  'subtraction-stories': {
    title: 'Subtraction Word Problems - Real-World Story Math | Wizqo',
    metaDescription: 'Take it away! Practice solving subtraction in narrative contexts like shopping and sharing. Free printable PDF for grades 1-3.',
    learningObjectives: ['Identify subtraction "clue words" in narrative text (e.g., "left," "remains")', 'Translate story situations into formal numerical equations', 'Differentiate between simple subtraction and "compare" scenarios'],
    intro: 'Math isn\'t just numbers—it\'s stories! Our Subtraction Stories worksheet takes abstract equations and puts them in real-world situations like spending money, sharing snacks, and losing balloons. By learning how to "find the math" in a story, children build the situational literacy and problem-solving skills they need for life outside the classroom.'
  },
  'summer-pack': {
    title: 'Summer Learning Fun Pack - Seasonal Skills Review | Wizqo',
    metaDescription: 'Keep the brain active! A varied collection of summer-themed math, logic, and visual puzzles. Free printable PDF for Grades K-3.',
    learningObjectives: ['Review core arithmetic and logic skills in a low-stress format', 'Strengthen visual-perception through seasonal puzzles and drawing', 'Maintain educational momentum during the long summer break'],
    intro: 'School might be out, but the learning never stops! Our Summer Fun Pack is a joyful mix of sunshine-themed math, logic puzzles, and creative drawing challenges. From counting seashells to solving summer mazes, this pack is designed to keep young minds sharp and curious while they enjoy their vacation. It\'s the perfect companion for a rainy beach day or a quiet afternoon at home!'
  },
  'symmetry': {
    title: 'Introduction to Symmetry - Mirror Image Practice | Wizqo',
    metaDescription: 'Find the balance! Identify and draw lines of symmetry in shapes and objects. Free printable geometry worksheet for grades 1-3.',
    learningObjectives: ['Define symmetry as a balanced and proportionate similarity between two sides', 'Correctly identify and draw lines of symmetry in geometric figures', 'Recognize symmetrical patterns in the natural and architectural world'],
    intro: 'Math is beautiful! Our symmetry worksheet introduces students to the concept of "balance." By finding where a shape can be folded into two identical halves, children build the visual discrimination and geometric awareness used in art, biology, and advanced physics. It\'s the secret to understanding why a butterfly or a snowflake looks so perfect!'
  },
  'symmetry-transformations': {
    title: 'Symmetry and Transformations - Positional Geometry | Wizqo',
    metaDescription: 'Flip it and fold it! Advanced practice with mirrored reflections and geometric symmetry. Free printable PDF for grades 4-5.',
    learningObjectives: ['Execute mirrored reflections of complex shapes across an axis', 'Identify vertical, horizontal, and diagonal lines of symmetry', 'Understand how transformations impact the orientation of geometric figures'],
    intro: 'Geometry is on the move! Our Symmetry and Transformations worksheet challenges older students to think about how shapes interact with space. By practicing mirrored reflections and identifying multiple axes of symmetry, learners build the advanced spatial reasoning and visualization skills used by computer animators, architects, and engineers.'
  },
  'tangram-animals': {
    title: 'Tangram Animal Puzzles - Geometric Art & Logic | Wizqo',
    metaDescription: 'Build a bird or a cat! Solve ancient Chinese geometric puzzles with our tangram animals worksheet. Free printable for all ages.',
    learningObjectives: ['Identify and manipulate the seven standard tangram shapes (tans)', 'Compose complex animal figures using basic geometric building blocks', 'Strengthen spatial visualization and "part-whole" structural reasoning'],
    intro: 'What can you make with seven simple shapes? Our Tangram Animals worksheet uses an ancient Chinese puzzle to teach modern geometry. By arranging triangles, squares, and parallelograms into the shapes of foxes, birds, and fish, kids build the spatial intelligence and creative problem-solving skills that are the foundation of high-level architecture and design.'
  },
  'ten-frames-1-20': {
    title: 'Ten-Frames 1-20 - Advanced Number Sense Visualization | Wizqo',
    metaDescription: 'Master the "teen" numbers! Practice visualizing sums up to 20 using dual ten-frames. Free printable for Kindergarten and 1st Grade.',
    learningObjectives: ['Recognize and name "teen" numbers as 10 plus some more', 'Understand place value foundations by filling a full frame (ten)', 'Instantly recognize quantities up to 20 without counting by ones'],
    intro: 'Once you master 10, it\'s time to grow! Our Ten-Frames (1-20) worksheet uses two side-by-side frames to help students visualize the "teen" numbers. By seeing 14 as one "full" ten and four "extra" ones, children build the base-10 mental model that makes multi-digit addition and place value second nature. It\'s the ultimate tool for early math fluency!'
  },
  'time-5min': {
    title: 'Telling Time to 5 Minutes - Analog Clock Master | Wizqo',
    metaDescription: 'Read the hidden minutes! Practice telling time with 5-minute precision. Free printable math worksheet for grades 2-3.',
    learningObjectives: ['Identify the hour and minute hands with 5-minute interval accuracy', 'Practice skip-counting by 5s around the clock face', 'Translate analog clock positions into digital numerical format'],
    intro: 'The clock has a secret code! Our Telling Time to 5 Minutes worksheet teaches students how to read between the numbers. By skip-counting by fives and tracking the slow crawl of the hour hand, children gain the precision they need to manage their own schedules and understand the flow of the day. It\'s a vital "grown-up" skill that builds numerical fluency and self-reliance!'
  },
  'mult-facts-0-12': {
    title: 'Multiplication Facts 0-12 - Fluency and Speed Drill | Wizqo',
    metaDescription: 'Master the tables! Practice multiplication facts from 0-12 with our comprehensive speed drill. Free printable PDF for grades 3-5.',
    learningObjectives: ['Recall basic multiplication facts (0x0 to 12x12) with high speed and accuracy', 'Identify patterns in multiplication tables (e.g., identity property of 0 and 1)', 'Build the mathematical stamina required for multi-digit multiplication'],
    intro: 'The multiplication table is the engine of arithmetic! Our Multiplication Facts 0-12 worksheet is designed for pure fluency. By practicing these foundational "math facts" until they become second nature, students clear the mental space needed for long division, fractions, and algebra. It\'s the ultimate "workout" for building a fast, accurate, and confident mathematical mind!'
  },
  'fraction-word-problems': {
    title: 'Fraction Word Problems - Real-World Applications | Wizqo',
    metaDescription: 'Math in context! Solve story-based problems involving halves, thirds, and fourths. Free printable PDF for grades 3-4.',
    learningObjectives: ['Identify fraction "clue words" in narrative text (e.g., "half of," "share equally")', 'Translate sharing scenarios into formal fraction notation', 'Visualize fractional parts within a real-world story context'],
    intro: 'How do you split a pizza with 3 friends? How much of your book is left to read? Our Fraction Word Problems worksheet brings math out of the textbook and into real life. By solving stories about sharing, measuring, and dividing, students build a concrete understanding of what fractions actually represent. It\'s not just numbers—it\'s practical logic for everyday life!'
  },
  'how-many-1-15': {
    title: 'How Many? - Counting Objects 1-15 | Wizqo',
    metaDescription: 'Practice basic counting! Identify and write the total number of objects in a set (1-15). Free printable PDF for preschool-K.',
    learningObjectives: ['Develop one-to-one correspondence by counting distinct objects', 'Accurately identify and write numbers between 1 and 15', 'Build early numeracy and subitizing skills for small groups'],
    intro: 'Counting is where the math adventure begins! Our How Many? (1-15) worksheet helps young learners master the art of 1-to-1 correspondence. By pointing to and counting fun illustrations, children build the foundational "number sense" they need for future addition and subtraction. It\'s a colorful, engaging way to turn "how many" into "I know the answer!"'
  },
  'logic-grid': {
    title: 'Logic Grid Puzzles - Deductive Reasoning for Kids | Wizqo',
    metaDescription: 'Boost critical thinking! Solve deductive logic puzzles using grids and clues. Free printable math worksheet for grades 3-5.',
    learningObjectives: ['Use a process of elimination to solve deductive puzzles', 'Interpret logical clues and translate them into a grid format', 'Strengthen critical thinking, patience, and attention to detail'],
    intro: 'Put on your detective hat! Our Logic Grid Puzzles worksheet teaches students the power of deductive reasoning. By using a grid to track clues and eliminate impossible options, children learn how to "think about their thinking." It\'s a brain-boosting challenge that builds the same logical pathways used in coding, legal analysis, and advanced problem-solving!'
  },
  'mult-lattice': {
    title: 'Lattice Multiplication Method - Visual Calculations | Wizqo',
    metaDescription: 'Try a new way to multiply! Master multi-digit multiplication using the lattice method. Free printable PDF for grades 4-5.',
    learningObjectives: ['Understand the procedural steps of the lattice multiplication grid', 'Compare and contrast the lattice method with standard algorithms', 'Reduce calculation errors in multi-digit problems through organized layout'],
    intro: 'Break free from the standard algorithm! Our Lattice Multiplication worksheet introduces a fun, visual way to handle big numbers. By organizing digits into a diagonal grid, students can focus on one basic fact at a time without getting lost in "carries" and "placeholders." It\'s the perfect strategy for visual learners who want an organized, foolproof way to master long multiplication!'
  },
  'multiplying-decimals': {
    title: 'Multiplying Decimals - Place Value and Precision | Wizqo',
    metaDescription: 'Don\'t fear the point! Practice multiplying decimals with accuracy and ease. Free printable math worksheet for grades 5-6.',
    learningObjectives: ['Correctly place the decimal point in the final product', 'Multiply multi-digit decimals using both standard and mental strategies', 'Understand how decimal multiplication scales quantities down (e.g., 0.5 x 10)'],
    intro: 'Decimals are just "shrunken" numbers! Our Multiplying Decimals worksheet takes the mystery out of the floating point. By learning how to count place values and manage precision, students build the accuracy needed for science experiments and financial math. Master the decimal, and you\'ll master the measurement of the world around you!'
  },
  'multiplying-fractions': {
    title: 'Multiplying Fractions - Parts of Parts | Wizqo',
    metaDescription: 'Multiply fractions with ease! Practice multiplying numerators and denominators. Free printable PDF for grades 4-6.',
    learningObjectives: ['Apply the (Numerator x Numerator) / (Denominator x Denominator) rule', 'Simplify products using greatest common factors (GCF)', 'Understand the conceptual meaning of taking a fraction "of" another fraction'],
    intro: 'What is half of a half? Our Multiplying Fractions worksheet helps students visualize why multiplying fractions often results in a smaller number! By mastering the simple rule of "multiply across" and then simplifying their results, children gain the tools they need for advanced cooking, engineering, and algebra. It\'s about understanding the "parts of parts" in our world!'
  },
  'multi-step-word-4th': {
    title: '4th Grade Multi-Step Word Problems - Logic & Review | Wizqo',
    metaDescription: 'Grade 4 math challenge! Solve complex word problems requiring multiple operations. Free printable PDF.',
    learningObjectives: ['Identify multiple hidden steps within a single story problem', 'Select and apply the correct sequence of operations (add, sub, mult, div)', 'Build the analytical stamina needed for standardized testing and real-life logic'],
    intro: 'One step isn\'t enough! Our 4th Grade Multi-Step Word Problems worksheet challenges students to think like engineers. From budgeting for a class party to calculating travel distances, these problems require kids to plan their route before they start calculating. It\'s the ultimate "math mixer" for building true operational mastery and critical thinking.'
  },
  'multi-step-word-5th': {
    title: '5th Grade Multi-Step Word Problems - Advanced Logic | Wizqo',
    metaDescription: 'Math for the real world! Solve advanced multi-step problems involving decimals and fractions. Free printable PDF for Grade 5.',
    learningObjectives: ['Deconstruct complex narrative data into sequential mathematical steps', 'Integrate decimals, fractions, and whole numbers into a single solution', 'Verify the plausibility of results in the context of advanced story scenarios'],
    intro: 'Level up your logic! Our 5th Grade Multi-Step Word Problems worksheet is designed for the transition to middle school math. By tackling scenarios that involve mixed operations, decimals, and budget-style reasoning, students build the "big picture" thinking needed for algebra. This isn\'t just math practice—it\'s training for real-world decision-making!'
  },
  'multi-step-word-problems': {
    title: 'Multi-Step Math Word Problems - Operation Mixer | Wizqo',
    metaDescription: 'The ultimate math challenge! Practice solving problems with multiple operations in context. Free printable PDF for grades 3-6.',
    learningObjectives: ['Distinguish between relevant and irrelevant data in complex prompts', 'Map out a multi-step solution path before beginning calculations', 'Build confidence in switching between addition, subtraction, multiplication, and division'],
    intro: 'Are you ready for the math marathon? Our Multi-Step Word Problems worksheet is the final boss of arithmetic! Instead of focusing on one skill, you\'ll have to use everything you\'ve learned—adding, subtracting, multiplying, and dividing—in a single problem. It\'s the perfect way to build the mental flexibility and problem-solving grit that will last a lifetime!'
  },
  'word-search': {
    title: 'Educational Word Search Puzzles - Vocabulary Fun | Wizqo',
    metaDescription: 'Boost spelling and focus! Find thematic words in our engaging word search puzzles. Free printable PDF for all grades.',
    learningObjectives: ['Strengthen word recognition and spelling through visual pattern matching', 'Improve concentration and scan-speed across a letter grid', 'Build thematic vocabulary (e.g., seasons, science, animals) in a playful context'],
    intro: 'Math needs letters too! Our Word Search puzzles turn vocabulary building into a high-stakes scavenger hunt. By scanning grids for hidden terms, students sharpen their focus and spelling skills while exploring new themes like ocean life, space, or seasonal holidays. It\'s the perfect "brain break" that keeps the learning moving forward!'
  },
  'reward-chart': {
    title: 'Printable Reward Charts - Positive Habit Tracking | Wizqo',
    metaDescription: 'Celebrate progress! Track student achievements and positive behaviors with our fun reward charts. Free printable PDF.',
    learningObjectives: ['Set and track specific, achievable goals over a week or month', 'Visualize personal progress and build intrinsic motivation', 'Establish a positive routines for homework, chores, or classroom behavior'],
    intro: 'Small wins lead to big success! Our Printable Reward Charts help students visualize their journey toward a goal. Whether it\'s finishing 10 math worksheets or practicing a musical instrument, these charts provide the positive reinforcement needed to turn effort into a lifestyle. Perfect for parents and teachers looking to build confidence one star at a time!'
  },
  'rounding-decimals': {
    title: 'Rounding Decimals - Precision and Rules Practice | Wizqo',
    metaDescription: 'Round with confidence! Master the rules for rounding decimals to the nearest tenth or hundredth. Free printable PDF for grades 4-6.',
    learningObjectives: ['Identify the "neighbor" digit to determine if a decimal rounds up or down', 'Round numbers with precision to the nearest whole, tenth, and hundredth', 'Understand the practical use of rounding in estimation and currency'],
    intro: 'Sometimes near enough is good enough! Our Rounding Decimals worksheet teaches students how to "simplify" complex numbers without losing their value. By mastering the rules of 5-and-up or 4-and-below, children gain the estimation skills needed for quick mental math, science reporting, and handling money. It\'s the secret to making math feel manageable and real!'
  },
  'skip-count-2s': {
    title: 'Skip Counting by 2s - Foundational Number Patterns | Wizqo',
    metaDescription: 'Count by twos! Build early multiplication skills and even number recognition. Free printable math worksheet for grades K-2.',
    learningObjectives: ['Fluently count by 2s up to 100 with accuracy', 'Demonstrate an understanding of even vs. odd number patterns', 'Build the conceptual "on-ramp" for the 2s multiplication table'],
    intro: 'Math is full of shortcuts! Skip-counting by 2s is the first step in moving beyond counting by ones. Our engaging worksheet helps young learners see the "jump" between numbers, building the pattern-recognition skills needed for multiplication and time-telling. It\'s fun, fast, and the foundation of everything that follows!'
  },
  'skip-count-5-10-120': {
    title: 'Skip Counting by 5s & 10s - Rhythmic Math | Wizqo',
    metaDescription: 'Jump to 120! Master skip-counting by 5s and 10s to build time and money skills. Free printable PDF for grades 1-3.',
    learningObjectives: ['Fluently count by 5s and 10s up to 120 starting from any number', 'Identify patterns in the ones place (0 and 5 repeats)', 'Apply skip-counting logic to counting nickels, dimes, and analog clock minutes'],
    intro: '5, 10, 15, 20... Math has a beat! Our Skip Counting by 5s and 10s worksheet turns numerical patterns into a rhythmic exercise. Mastering these increments is the secret key to counting money and telling time with ease. By practicing up to 120, students build the "big number" confidence they need for higher-level addition and subtraction.'
  },
  'spring-scavenger': {
    title: 'Spring Nature Scavenger Hunt - Outdoor Exploration | Wizqo',
    metaDescription: 'Explore the season! Find flowers, birds, and signs of spring with our outdoor scavenger hunt. Free printable activity for kids.',
    learningObjectives: ['Observe and identify seasonal changes in the local environment', 'Practice descriptive observation and scientific inquiry outdoors', 'Build a connection to nature through active, play-based exploration'],
    intro: 'Take the classroom outside! Our Spring Scavenger Hunt is designed to turn a walk in the park into a scientific expedition. By searching for specific signs of renewal—like budding trees, chirping birds, and blooming flowers—kids develop their observational skills and appreciation for the natural world. It\'s the perfect way to welcome the sun and learn on the move!'
  },
  'stem-balloon-rocket': {
    title: 'STEM: Balloon Rocket Experiment - Forces & Motion | Wizqo',
    metaDescription: 'Blast off with physics! Learn about thrust and Newton\'s Third Law with a balloon rocket. Free printable STEM activity guide.',
    learningObjectives: ['Define thrust and explain how air pressure creates propulsion', 'Apply Newton\'s Third Law (Action/Reaction) to a physical experiment', 'Practice the scientific method by varying air volume and measuring distance'],
    intro: 'Ready for liftoff? Our Balloon Rocket STEM worksheet guides students through a high-speed physics experiment! By building their own simple rocket using a balloon and string, children witness Newton\'s laws of motion in action. This hands-on activity turns abstract concepts like force and thrust into a thrilling, tangible experience that sparks a lifelong love of engineering.'
  },
  'stem-walking-water': {
    title: 'STEM: Walking Water Experiment - Capillary Action | Wizqo',
    metaDescription: 'See water defy gravity! Explore capillary action and color-mixing with this simple STEM experiment. Free printable guide.',
    learningObjectives: ['Explain capillary action and how liquid moves through porous materials', 'Observe and record the process of color-mixing to create secondary colors', 'Develop patience and record-keeping skills through long-form observation'],
    intro: 'Can water walk? Yes, it can! Our Walking Water experiment takes students on a colorful journey into the world of capillary action. By watching water "climb" through paper towels to mix and create new colors, children see the same physics that allows trees to pull water from the soil. It\'s a beautiful, slow-motion look at the invisible forces of nature!'
  },
  'time-to-minute': {
    title: 'Telling Time to the Minute - Precision Clock Reading | Wizqo',
    metaDescription: 'Master the clock! Practice reading analog time with 1-minute precision. Free printable math worksheet for grades 3-4.',
    learningObjectives: ['Identify exact minutes on an analog clock with 1-minute accuracy', 'Understand that 60 minutes equals one full rotation of the hour hand', 'Solve elapsed time problems using minute-by-minute calculations'],
    intro: 'Every minute counts! Our Telling Time to the Minute worksheet is for students who are ready to master the full cycle of the clock. By moving beyond 5-minute intervals to exact precision, children gain the independence and time-management skills they need for a busy day. It\'s the final step in becoming a true time-keeping pro!'
  },
  'transformations-5th': {
    title: '5th Grade Geometric Transformations - Slide, Flip, & Turn | Wizqo',
    metaDescription: 'Master coordinate geometry! Practice translations, reflections, and rotations. Free printable PDF for Grade 5.',
    learningObjectives: ['Identify and perform translations (slides) on a coordinate plane', 'Understand reflections (flips) and rotations (turns) of 2D shapes', 'Maintain the congruence of shapes throughout geometric movement'],
    intro: 'Geometry is on the move! Our 5th Grade Transformations worksheet teaches students how to manipulate shapes in space. Whether they are sliding across a grid (translation), flipping over an axis (reflection), or turning around a point (rotation), kids build the spatial reasoning skills used in architecture, video game design, and bridge engineering!'
  },
  'times-table-blank-1-12': {
    title: 'Blank Multiplication Table 1-12 - Practice Grid | Wizqo',
    metaDescription: 'Test your memory! Fill in our 12x12 blank multiplication grid to master basic facts and building fluency. Free printable PDF.',
    learningObjectives: ['Recall and record multiplication facts from 1x1 to 12x12 accurately', 'Identify symmetry and patterns within a 144-square multiplication grid', 'Build mathematical stamina and self-correction skills through grid completion'],
    intro: 'Can you fill in the blanks? Our 1-12 Blank Multiplication Table is the ultimate test of mathematical recall. By filling in the grid from scratch, students engage their "muscle memory" for numbers, helping these core facts stick for life. It\'s a high-impact, low-stress way to build the numerical foundation needed for algebra and beyond!'
  },
  'times-table-blank-1-5': {
    title: 'Blank Multiplication Table 1-5 - Early Practice | Wizqo',
    metaDescription: 'Perfect for beginners! Fill in the 5x5 blank multiplication table to build starting numeracy skills. Free printable PDF.',
    learningObjectives: ['Accurately recall multiplication facts for the numbers 1 through 5', 'Understand the relationship between factors and products in a simple grid', 'Build initial confidence with tabular data and multiplication patterns'],
    intro: 'Every expert starts as a beginner! Our 1-5 Blank Multiplication Table is designed for young learners who are just discovering the magic of "groups." By mastering this smaller grid first, students build the confidence and accuracy they need before moving on to larger numbers. It\'s the perfect "warm-up" for a lifetime of math success!'
  },
  'times-table-blank-6-12': {
    title: 'Blank Multiplication Table 6-12 - Advanced Drill | Wizqo',
    metaDescription: 'Target the tough ones! Master upper-level multiplication with our 6-12 blank grid. Free printable math worksheet.',
    learningObjectives: ['Master the most challenging multiplication facts from the 6s to the 12s', 'Strengthen recall for "hard-to-remember" products like 7x8 and 9x7', 'Improve overall calculation speed for advanced arithmetic tasks'],
    intro: 'Mastering the tables is a journey, and the 6s-12s are the peaks! Our 6-12 Blank Multiplication Table focuses specifically on the "tougher" half of the multiplication charts. By eliminating the easy early numbers, students can focus their mental energy on the facts that require the most practice, ensuring total mastery of the entire 12x12 system.'
  },
  'times-table-color-1-12': {
    title: 'Color-Coded Multiplication Table 1-12 - Learning Aid | Wizqo',
    metaDescription: 'See the patterns! Master the 12x12 table with our high-contrast, color-coded multiplication guide. Free printable PDF.',
    learningObjectives: ['Identify numerical patterns (e.g., evens vs. odds) through visual color cues', 'Use a color-coded reference to memorize multiplication facts more effectively', 'Build visual scanning skills for finding products on a large grid'],
    intro: 'Math is a language of patterns, and color makes them pop! Our Color-Coded 1-12 Multiplication Table uses visual cues to help students see the hidden rhythms of numbers. Whether it\'s tracking a specific factor or noticing squares like 25, 36, and 49, this high-contrast guide turns memorization into a visual experience that stays in the mind long after the page is turned!'
  },
  'times-table-color-1-5': {
    title: 'Color-Coded Multiplication Table 1-5 - Visual Guide | Wizqo',
    metaDescription: 'Early math made colorful! Learn the 1-5 multiplication tables with our easy-to-read, color-coded guide. Free printable PDF.',
    learningObjectives: ['Build initial familiarity with simple multiplication facts through color', 'Connect specific numbers to colors for better long-term recall', 'Gain confidence in reading and using a mathematical reference chart'],
    intro: 'Learning math should be as vibrant as a rainbow! Our 1-5 Color-Coded Multiplication Table is the perfect introductory reference for early learners. By grouping facts by color, we help young students transition from counting objects to understanding the structure of a multiplication grid. it\'s a friendly, engaging first step into the world of "big" math!'
  },
  'times-table-color-6-12': {
    title: 'Color-Coded Multiplication Table 6-12 - Advanced Guide | Wizqo',
    metaDescription: 'Master the hard tables! Use our 6-12 color-coded guide to memorize advanced multiplication facts easily. Free printable PDF.',
    learningObjectives: ['Strengthen visual recall for advanced multiplication facts (6-12)', 'Use color-coded patterns to differentiate between similar products', 'Increase the speed of looking up and verifying large multiplication results'],
    intro: 'Don\'t let the big numbers intimidate you! Our 6-12 Color-Coded Multiplication Table is a high-utility map for the most challenging part of the math curriculum. By using distinct colors to highlight the relationships between factors, we make the "scary" tables feel organized and approachable. It\'s the ultimate tool for turning "I don\'t know" into "I can see it!"'
  },
  'times-table-confidence-1-5': {
    title: '1-5 Multiplication Confidence Tracker - Mastery Drill | Wizqo',
    metaDescription: 'Self-assess your skills! Track your mastery of basic multiplication tables 1-5. Free printable math worksheet.',
    learningObjectives: ['Assess personal speed and accuracy for basic multiplication facts', 'Identify specific facts that require more practice or reinforcement', 'Build intrinsic motivation through measurable progress and check-offs'],
    intro: 'How well do you know your 2s? Your 5s? Our 1-5 Multiplication Confidence Tracker is about more than just finding an answer—it\'s about knowing that you know it! This worksheet allows students to rate their own comfort level with basic facts, helping them target their study time where they need it most. It\'s math practice with a self-improvement twist!'
  },
  'times-table-fluency-1-12': {
    title: 'Multiplication Fluency 1-12 - Speed and Recall Drill | Wizqo',
    metaDescription: 'Time to shine! Build instant recall for the 1-12 tables with our high-speed fluency workout. Free printable PDF.',
    learningObjectives: ['Develop automaticity (answer recall in <2 seconds) for all facts 1-12', 'Increase mental calculation speed for use in long division and fractions', 'Reduce cognitive load for advanced math by making multiplication second nature'],
    intro: 'Turn your math into a reflex! Our 1-12 Multiplication Fluency drill is designed for students who want to move beyond "figuring it out" to "just knowing it." By practicing for speed and accuracy, children build the mathematical automaticity used by engineers and scientists. When you master your fluency, the rest of math starts to feel like a breeze!'
  },
  'times-table-horizontal-1-12': {
    title: 'Horizontal Multiplication Table 1-12 - Linear Mastery | Wizqo',
    metaDescription: 'Master the tables in a row! Practice multiplication facts 1-12 in a linear, horizontal format. Free printable math PDF.',
    learningObjectives: ['Read and solve multiplication equations in a standard horizontal format', 'Improve linear scanning and data entry skills for mathematical records', 'Build the pattern-recognition skills needed for number sequences and series'],
    intro: 'Math moves from left to right! Our Horizontal Multiplication Table 1-12 provides a different perspective on the classic grid. By presenting facts in a linear, organized sequence, we help students build the reading and logic skills used in standard equations and computer programming. It\'s a clean, efficient layout for students who like their math oragnized and clear!'
  },
  'times-table-horizontal-1-5': {
    title: 'Horizontal Multiplication Table 1-5 - Early Success | Wizqo',
    metaDescription: 'Linear math for beginners! Practice basic multiplication facts 1-5 in a horizontal format. Free printable PDF.',
    learningObjectives: ['Master foundational multiplication facts (1-5) in a horizontal layout', 'Build early confidence with linear mathematical notation', 'Prepare for symbolic math by recognizing factors and products in a row'],
    intro: 'Simple, clear, and effective! Our 1-5 Horizontal Multiplication Table is the perfect starting point for students transitioning to symbolic math. By laying out the basic facts in a straightforward row-by-row format, we make it easy for young minds to focus on one table at a time without the distraction of a larger grid. It\'s the foundational step to becoming a math pro!'
  },
  'times-table-horizontal-6-12': {
    title: 'Horizontal Multiplication Table 6-12 - Advanced Practice | Wizqo',
    metaDescription: 'Master the upper tables! Practice multiplication facts 6-12 in a linear, horizontal format. Free printable math PDF for grades 4-6.',
    learningObjectives: ['Fluently recall advanced multiplication facts (6-12) in horizontal notation', 'Identify linear number patterns in higher-level multiplication tables', 'Strengthen mental math speed for multi-digit multiplication and division'],
    intro: 'Ready for the big leagues? Our Horizontal Multiplication Table 6-12 targets the most challenging part of the multiplication curriculum. By presenting advanced facts in a clean, linear layout, we help students move beyond basic grids to the symbolic math used in algebra. It\'s the perfect workout for building the mental stamina needed for middle school math!'
  },
  'times-table-missing-1-5': {
    title: 'Missing Number Multiplication 1-5 - Early Algebra | Wizqo',
    metaDescription: 'Find the secret factor! Solve missing-number multiplication puzzles for tables 1-5. Free printable PDF for grades 2-3.',
    learningObjectives: ['Solve for an unknown factor using basic multiplication knowledge', 'Understand the inverse relationship between multiplication and division', 'Develop foundational algebraic thinking and problem-solving skills'],
    intro: 'Math is a puzzle waiting to be solved! Our 1-5 Missing Number Multiplication worksheet turns simple facts into exciting brain-teasers. By asking "What number times 3 equals 12?", we help young learners build the logic needed for algebra and the ability to work "backwards" through an equation. It\'s the perfect bridge from basic arithmetic to creative problem-solving!'
  },
  'times-table-missing-6-12': {
    title: 'Missing Number Multiplication 6-12 - Advanced Puzzles | Wizqo',
    metaDescription: 'Think like an algebra pro! Solve for unknown factors in the 6-12 multiplication tables. Free printable math worksheet.',
    learningObjectives: ['Determine missing factors in advanced 6-12 multiplication equations', 'Strengthen the mental connection between products and their factor pairs', 'Build the analytical speed required for high-stakes math testing'],
    intro: 'Level up your logic! Our 6-12 Missing Number Multiplication worksheet focuses on the most challenging factor pairs in the math world. By identifying the "missing piece" in advanced equations, students develop a deeper numerical intuition and the algebraic flexibility used in science and engineering. It\'s the ultimate workout for a sharp, mathematical mind!'
  },
  'times-table-missing-mixed': {
    title: 'Mixed Missing Number Multiplication - Algebra Prep | Wizqo',
    metaDescription: 'The ultimate factor challenge! Solve randomized missing-number puzzles across all 1-12 tables. Free printable PDF.',
    learningObjectives: ['Solve for unknown factors across a wide range of multiplication facts (1-12)', 'Flexibly switch between different factor families in a single workspace', 'Demonstrate comprehensive mastery of multiplication and division inverse logic'],
    intro: 'Are you ready for the great factor hunt? Our Mixed Missing Number Multiplication worksheet is the ultimate test of your flexible thinking. Instead of focusing on one group of numbers, you\'ll have to jump between 1s and 12s, solving for unknowns in every direction. It\'s the perfect way to prove that you don\'t just know your facts—you truly understand how they work together!'
  },
  'times-table-mixed-review': {
    title: 'Multiplication Mixed Review - Comprehensive Mastery | Wizqo',
    metaDescription: 'prove your skills! A varied review of multiplication types from basic facts to complex problems. Free printable PDF for grades 3-6.',
    learningObjectives: ['Demonstrate consistent accuracy across a diverse set of multiplication types', 'Apply different strategies (algorithms, mental math, properties) to varied problems', 'Build confidence in comprehensive multiplication mastery before moving to division'],
    intro: 'You\'ve learned the rules, now show your stuff! Our Multiplication Mixed Review is the final victory lap of the arithmetic unit. By switching between different factors, formats, and difficulty levels, students prove they have the versatile "math muscles" needed for real-world success. This is where practice turns into true proficiency!'
  },
  'times-table-timed-1-12': {
    title: '1-12 Timed Multiplication Test - Ultimate Fluency | Wizqo',
    metaDescription: 'Beat the clock! Build instant recall for all tables 1-12 with our high-speed timed test. Free printable PDF for grades 3-5.',
    learningObjectives: ['Recall all multiplication facts 1-12 with 100% accuracy under time pressure', 'Build the automaticity needed for higher-level mental math and division', 'Personalize speed goals to improve calculation rate over repeated attempts'],
    intro: 'Ready, set, math! Our 1-12 Timed Multiplication Test is designed for the high-intensity practice that leads to "automaticity." By testing their recall under the clock, students learn how to think fast and trust their instincts. Mastering this drill means you\'ll never have to pause during long division or fractions again—the answers will simply be there!'
  },
  'times-table-timed-1-5': {
    title: '1-5 Timed Multiplication Test - Early Fluency Drill | Wizqo',
    metaDescription: 'Speed practice for beginners! Build rapid recall for the 1-5 tables with our timed worksheet. Free printable PDF.',
    learningObjectives: ['Recall basic multiplication facts (1-5) quickly and accurately', 'Develop the mental "stamina" for timed mathematical assessments', 'Transition from skip-counting to instant number recall'],
    intro: 'Fast math is fun math! Our 1-5 Timed Multiplication Test helps young learners move beyond counting on their fingers to instant recall. By practicing these foundational facts against the clock, children build the "math reflex" that makes all future arithmetic easier. It\'s a high-energy way to celebrate how much they\'ve learned!'
  },
  'times-table-timed-6-12': {
    title: '6-12 Timed Multiplication Test - Advanced Speed Drill | Wizqo',
    metaDescription: 'Master the tough ones fast! Develop instant recall for the 6-12 tables under time pressure. Free printable math PDF.',
    learningObjectives: ['Recall challenging 6-12 multiplication facts with high speed and precision', 'Overcome "hesitation points" in advanced times tables', 'Prepare for middle school math requirements through rapid factor recall'],
    intro: 'Don\'t let the clock stop you! Our 6-12 Timed Multiplication Test targets the facts that students often find the most difficult. By practicing those "hard" numbers under time pressure, we help kids build the confidence and speed used by top mathematical thinkers. Once you can beat this clock, you\'re ready for any math challenge the world throws at you!'
  },
  'times-table-vertical-1-12': {
    title: 'Vertical Multiplication Practice 1-12 - Standard Method | Wizqo',
    metaDescription: 'Master the standard algorithm! Practice multiplication facts 1-12 in a traditional vertical format. Free printable PDF.',
    learningObjectives: ['Execute multiplication facts accurately using vertical notation', 'Build the spacing and alignment habits needed for multi-digit multiplication', 'Reinforce the relationship between factor pairs and vertical products'],
    intro: 'Numbers look better stacked! Our Vertical Multiplication 1-12 worksheet teaches students the classical "standard" way of writing math. By organizing equations vertically, children build the neatness and precision they need for future long multiplication and division. it\'s the clean, professional layout used by mathematicians everywhere to keep their calculations organized and accurate!'
  },
  'times-table-vertical-1-5': {
    title: 'Vertical Multiplication Practice 1-5 - Beginner Layout | Wizqo',
    metaDescription: 'Stack and solve! Learn vertical multiplication for the 1-5 tables with our clear, simple practice sheet. Free printable PDF.',
    learningObjectives: ['Correctly align factors and products in a vertical multiplication format', 'Master basic facts (1-5) using standard mathematical notation', 'Develop the organizational skills needed for more complex multi-step math'],
    intro: 'Let\'s stack the facts! Our 1-5 Vertical Multiplication worksheet introduces early learners to the standard way we write "big" math. By practicing simple problems in a vertical format, students get used to the layout they\'ll use for the rest of their school years. It\'s a simple, effective way to build the foundations of numerical organization!'
  },
  'times-table-vertical-6-12': {
    title: 'Vertical Multiplication Practice 6-12 - Advanced Layout | Wizqo',
    metaDescription: 'Level up your algorithm! Practice multiplication facts 6-12 in a traditional vertical format. Free printable PDF for grades 4-6.',
    learningObjectives: ['Master the vertical algorithm for advanced multiplication facts (6-12)', 'Maintain numerical alignment and precision in complex calculations', 'Prepare for multi-digit multiplication by practicing vertical factor pairs'],
    intro: 'Stacking up the challenge! Our 6-12 Vertical Multiplication worksheet is designed for students who are ready to handle the most important facts in the math curriculum. By practicing advanced factor pairs in a clean, vertical layout, children build the procedural habits needed for long multiplication and algebra. It\'s the professional way to master the tables!'
  },
  'volume-rectangular-prisms': {
    title: 'Volume of Rectangular Prisms - 3D Space & Capacity | Wizqo',
    metaDescription: 'Calculate the space inside! Learn the Volume = L x W x H formula for rectangular prisms. Free printable PDF for grades 5-6.',
    learningObjectives: ['Apply the (Length x Width x Height) formula to find the volume of 3D shapes', 'Understand the concept of cubic units as a measurement of internal space', 'Solve real-world capacity problems involving boxes, containers, and architecture'],
    intro: 'How much can it hold? Our Volume of Rectangular Prisms worksheet takes math into the third dimension! By exploring the relationship between length, width, and height, students learn how to measure the "inside" of a shape. This foundational skill is essential for everything from shipping and logistics to building the next great architectural marvel!'
  },
  'weekly-goals': {
    title: 'Student Weekly Goals - Planning and Achievement Tracker | Wizqo',
    metaDescription: 'Plan for success! Set and track your weekly learning goals with our motivational student organizer. Free printable PDF.',
    learningObjectives: ['Define 3-5 specific, measurable goals for the upcoming week', 'Track progress daily to build consistency and self-accountability', 'Reflect on achievements and challenges to improve future planning'],
    intro: 'A goal without a plan is just a wish! Our Student Weekly Goals worksheet helps children take charge of their own learning journey. By breaking down big dreams into small, actionable steps, students build the time-management and self-discipline skills that lead to lifelong success. It\'s a powerful tool for turning effort into achievement, star by star!'
  },
  'what-comes-next': {
    title: 'What Comes Next? - Logical Patterns and Sequences | Wizqo',
    metaDescription: 'Predict the pattern! Complete logical sequences of shapes and numbers. Free printable math worksheet for preschool-K.',
    learningObjectives: ['Identify the recursive rule in a repeating visual or numerical pattern', 'Predict the next item in a sequence based on logical observation', 'Develop the critical thinking foundations needed for coding and algebra'],
    intro: 'Math is the science of prediction! Our What Comes Next? worksheet challenges young minds to find the "hidden rhythm" in a sequence. By observing shapes, colors, and numbers to see what follows, children build the pattern-recognition skills that are at the core of all advanced mathematical and scientific thinking. It\'s a fun, visual way to start thinking like a scientist!'
  },
  'writing-expressions': {
    title: 'Writing Algebraic Expressions - Translating Math Phrases | Wizqo',
    metaDescription: 'Translate words into math! Practice converting verbal phrases into algebraic expressions. Free printable PDF for grades 5-7.',
    learningObjectives: ['Identify mathematical operations from "clue words" (e.g., "sum," "less than," "product")', 'Translate sentence-based scenarios into formal symbolic expressions (e.g., "3 more than x" to x+3)', 'Understand the role of variables as placeholders for unknown quantities'],
    intro: 'Math is a language—let\'s learn how to speak it! Our Writing Algebraic Expressions worksheet teaches students how to turn everyday words into elegant equations. By learning the "clue words" for addition, subtraction, multiplication, and division, children gain the ability to translate a story into a solution. It\'s the essential first step in mastering the logic of algebra!'
  },
  'match-object-to-shadow': {
    title: 'Match the Shadow - Visual Perception and Spatial Logic | Wizqo',
    metaDescription: 'Find the match! Connect common objects to their silhouettes in this fun visual logic activity. Free printable for preschool-K.',
    learningObjectives: ['Develop spatial reasoning by comparing 3D objects to 2D silhouettes', 'Improve visual discrimination and attention to detail', 'Strengthen fine motor skills through matching-line drawing'],
    intro: 'Every object has a secret silhouette! Our Match the Shadow worksheet turns visual perception into a fun detective game. By looking closely at outlines and matching them to their real-world counterparts, young learners sharpen their observational skills and spatial awareness. It\'s a playful, high-interest way to build the "pre-math" logic needed for geometry!'
  },
  'interactive-math-rhythm': {
    title: 'Interactive Math Rhythm - Musical Numeracy Game | Wizqo',
    metaDescription: 'Feel the beat of the numbers! Practice math in a rhythmic, musical environment with our interactive digital activity.',
    learningObjectives: ['Sync mathematical calculations with a rhythmic pulse or beat', 'Understand the connection between fractions, time signatures, and numerical patterns', 'Build focus and coordination through multi-sensory math engagement'],
    intro: 'Math has a beat! Our Interactive Math Rhythm experience turns arithmetic into a musical performance. By solving problems in time with the music, students develop a visceral sense of numerical flow and timing. It\'s a multi-sensory way to learn that makes math feel as natural as a heartbeat!'
  },
  'interactive-math-race': {
    title: 'Interactive Math Race - Competitive Speed Challenge | Wizqo',
    metaDescription: 'Race to the finish! Test your math speed and accuracy in our high-energy interactive digital game.',
    learningObjectives: ['Increase calculation speed through gamified time-pressure scenarios', 'Engage in healthy competition to drive mathematical motivation', 'Reduce hesitation when solving core arithmetic facts (add/sub/mult/div)'],
    intro: 'Start your engines! Our Interactive Math Race turns fluency practice into a high-stakes competition. By solving problems quickly to move ahead, students build the instant recall and focus needed for advanced math in a high-energy, digital environment. It\'s the most fun you can have while becoming a math pro!'
  },
  'interactive-math-puzzle': {
    title: 'Interactive Math Puzzle - Logic and Critical Thinking | Wizqo',
    metaDescription: 'Crack the code! Solve complex mathematical puzzles in our engaging interactive digital environment.',
    learningObjectives: ['Apply multi-step logical reasoning to solve gamified math mysteries', 'Integrate diverse math skills (geometry, logic, arithmetic) in a single puzzle', 'Develop persistence and trial-and-error problem-solving strategies'],
    intro: 'Are you a master codebreaker? Our Interactive Math Puzzle challenges you to think outside the box! This isn\'t just about finding an answer—it\'s about navigating a world of logic, where every number is a clue. Engage your brain in a digital playground where critical thinking is the key to unlocking the next level!'
  },
  'interactive-math-shapes': {
    title: 'Interactive Math Shapes - Geometric Exploration Game | Wizqo',
    metaDescription: 'Manipulate the world! Learn about 2D and 3D shapes through our interactive digital geometry experience.',
    learningObjectives: ['Identify and classify shapes based on their interactive properties (sides, vertices)', 'Visualize 3D rotations and spatial relationships in a digital space', 'Build a conceptual understanding of geometry through direct manipulation'],
    intro: 'Geometry literally comes to life! Our Interactive Math Shapes game lets students touch, turn, and transform the building blocks of the world. By manipulating shapes in a digital environment, children build the spatial intuition and geometric logic needed for architecture and design. It\'s math history in the making—one shape at a time!'
  },
  'mult-facts-1-5': {
    title: 'Multiplication Facts 1-5 - Early Math Drills | Wizqo',
    metaDescription: 'Master the basics! Practice multiplication tables 1-5 with our clear, structured drills. Free printable PDF for grades 2-3.',
    learningObjectives: ['Fluently recall multiplication facts for numbers 1 through 5', 'Understand the concept of repeated addition through basic factors', 'Build numerical confidence before moving to advanced tables'],
    intro: 'Foundation first! Our Multiplication Facts 1-5 worksheet focuses on the critical starting point of the arithmetic journey. By mastering these smaller factor pairs, students build the "math reflex" needed for more complex operations. It\'s the perfect, low-stress way to ensure every young learner feels like a math superstar!'
  },
  'mult-facts-6-12': {
    title: 'Multiplication Facts 6-12 - Mastery Drills | Wizqo',
    metaDescription: 'Conquer the tough tables! Practice advanced multiplication facts 6-12 to build total numerical fluency. Free printable math PDF.',
    learningObjectives: ['Master the most challenging multiplication facts from 6x6 to 12x12', 'Improve mental calculation speed for division and multi-step problems', 'Develop total automaticity across the entire 12x12 multiplication grid'],
    intro: 'The mastery challenge! Our Multiplication Facts 6-12 worksheet targets the "power tables" that students often find most difficult. By providing focused, high-repetition practice for factors 6 through 12, we help children eliminate hesitation and build the rapid recall used by scientists and engineers. Turn those "hard" numbers into second nature!'
  },
  'ws-world': {
    title: 'Worksheet World Multi-Skill Challenge - Comprehensive Review | Wizqo',
    metaDescription: 'Explore the world of math! A diverse collection of problems covering arithmetic, logic, and geometry. Free printable PDF.',
    learningObjectives: ['Apply diverse mathematical skills to a variety of problem types', 'Improve versatility by switching between different math domains', 'Demonstrate comprehensive mastery of primary-grade math concepts'],
    intro: 'Welcome to Worksheet World! This special multi-skill challenge isn\'t just about one topic—it\'s an adventure through the entire math curriculum. From arithmetic puzzles to geometric logic, students will travel through different "zones" of learning, proving their versatility and building the well-rounded expertise of a true math explorer!'
  },
  'match-the-feeling': {
    title: 'Match the Feeling to the Situation - Free SEL Worksheet | Wizqo',
    metaDescription: 'Free printable Social Emotional Learning (SEL) worksheet. Help kids identify feelings like sad, happy, bored, and friendly by matching them to real-life situations.',
    learningObjectives: ['Identify core emotions', 'Connect feelings to causes', 'Build emotional vocabulary'],
    intro: 'This interactive Social Emotional Learning (SEL) worksheet helps children develop emotional intelligence by matching feelings to real-world situations. Perfect for Kindergarten and 1st Grade students to practice empathy and self-awareness.'
  },
  'reading-discovery-interactive': {
    title: 'Reading Discovery: Interactive Comprehension Worksheet | Wizqo',
    metaDescription: 'Free interactive reading comprehension worksheet for kids. Practice reading with 3 original stories, colorful 3D illustrations, and instant "Show Answer" features. Perfect for Grade 1 and 2.',
    learningObjectives: ['Improve text comprehension', 'Identify key details in stories', 'Connect visual aids to written context', 'Build vocabulary'],
    intro: 'Welcome to Reading Discovery! This interactive worksheet features three original stories—Leo\'s Space Adventure, The Helpful Robot, and Mia\'s Magic Garden—designed to build reading comprehension and critical thinking skills in young learners. Use the "Show Answer" feature for interactive classroom learning or print the worksheet for quiet practice.'
  },
  'interactive-math-money': {
    title: 'Interactive Math Money - Digital Financial Literacy Game | Wizqo',
    metaDescription: 'Learn to earn and spend! Practice coin counting and currency math in our engaging interactive digital economy. Free to play online.',
    learningObjectives: ['Accurately count and combine various coin and bill denominations', 'Solve real-world transaction problems including making change', 'Develop foundational financial literacy and money-management skills'],
    intro: 'Math makes cents! Our Interactive Math Money experience turns financial literacy into a fun digital market. By managing virtual currency, counting coins, and making change, students build the practical life skills needed for the real world. Engage with money in a safe, interactive environment where every calculation helps you master the art of the shop!'
  },
  'interactive-math-fractions': {
    title: 'Interactive Math Fractions - Gamified Parts and Wholes | Wizqo',
    metaDescription: 'Slice and solve! Explore fraction equivalence and comparison through our dynamic interactive digital tools.',
    learningObjectives: ['Visualize fractions as parts of a whole through interactive slicing and shading', 'Compare and order fractions with like and unlike denominators', 'Identify equivalent fractions using dynamic visual representations'],
    intro: 'Don\'t fear the fraction! Our Interactive Math Fractions game turns abstract numbers into a hands-on exploration of parts and wholes. By slicing shapes, shading grids, and moving pieces in a digital space, students see the logic behind fraction equivalence and comparison. It\'s a colorful, intuitive way to make fractions feel as easy as pie!'
  },
  'interactive-math-measurement': {
    title: 'Interactive Math Measurement - Digital Precision Tools | Wizqo',
    metaDescription: 'Measure the world! Practice length, weight, and volume calculations with our interactive digital measurement lab.',
    learningObjectives: ['Use digital rulers and scales to measure objects with precision', 'Convert between different units of measurement in an interactive context', 'Apply measurement logic to solve multi-step problems and experiments'],
    intro: 'Measurement comes to life! Our Interactive Math Measurement lab gives students the digital tools to explore the physical world. From measuring virtual objects with high-precision rulers to balancing scales and calculating volume, children learn that math is the key to describing everything around us. Step into the lab and start measuring your way to discovery!'
  },
  'interactive-reading-adventure': {
    title: 'Interactive Reading Adventure - Branching Story Choices | Wizqo',
    metaDescription: 'You choose the path! Improve reading comprehension with our interactive adventure where your choices change the story.',
    learningObjectives: ['Improve reading comprehension through active narrative participation', 'Analyze character motivations to make logical story choices', 'Understand cause-and-effect relationships within a branching plot'],
    intro: 'The story is in your hands! Our Interactive Reading Adventure turns reading into a quest where every choice you make shaped the outcome. By analyzing clues and choosing the path, students become active participants in the narrative, boosting their engagement and comprehension. Will you be the hero of your own reading journey? Start the adventure to find out!'
  },
  'interactive-reading-detective': {
    title: 'Interactive Reading Detective - Evidence-Based Investigation | Wizqo',
    metaDescription: 'Solve the mystery! Practice inference and detail-finding with our interactive digital reading detective game.',
    learningObjectives: ['Cite specific evidence from a digital text to solve a mystery', 'Develop advanced inference skills by connecting subtle narrative clues', 'Improve attention to detail and critical reading speed'],
    intro: 'Get your magnifying glass ready! Our Interactive Reading Detective game turns comprehension practice into a high-stakes mystery. Instead of just reading, students must scan the text for clues, cross-reference evidence, and solve the case. It\'s a rigorous, engaging way to build the investigative skills used by real-world researchers and analysts. The case is open—can you solve it?'
  },
  'interactive-reading-vocab': {
    title: 'Interactive Reading Vocabulary - Word Mastery Game | Wizqo',
    metaDescription: 'Boost your word power! Master new vocabulary through our interactive digital reading game featuring context clues and definitions. Free to play online.',
    learningObjectives: ['Identify the meaning of new words using surrounding context clues', 'Distinguish between synonyms and antonyms in a narrative setting', 'Improve reading fluency by building a robust digital vocabulary'],
    intro: 'Words are the keys to the world! Our Interactive Reading Vocabulary game turns word-learning into an engaging digital quest. By exploring stories and identifying "power words," students learn how to unlock meaning from context and build the expressive language skills needed for advanced writing. Dive in and start growing your word power today!'
  },
  'interactive-reading-summary': {
    title: 'Interactive Reading Summary - Main Idea & Synthesis Tool | Wizqo',
    metaDescription: 'Get the big picture! Learn how to summarize stories and identify main ideas with our interactive digital reading tool.',
    learningObjectives: ['Identify the "Who, What, Where, When, and Why" of a reading passage', 'Synthesize complex narratives into concise, accurate summaries', 'Differentiate between central themes and supporting details'],
    intro: 'What\'s the big idea? Our Interactive Reading Summary tool helps students distill long stories into their most important points. By using digital organizers to group key events and identify main themes, readers learn how to process information efficiently and communicate clearly. Mastering the art of the summary is a superpower for school and beyond!'
  },
  'interactive-reading-compare': {
    title: 'Interactive Reading Compare - Comparative Analysis Tool | Wizqo',
    metaDescription: 'Spot the difference! Compare characters, settings, and plots using our interactive digital Venn diagrams and analysis tools.',
    learningObjectives: ['Compare and contrast two or more narrative elements using text evidence', 'Use digital Venn diagrams to visualize similarities and differences', 'Develop critical thinking skills by analyzing multiple perspectives in reading'],
    intro: 'Every story has a twin—or an opposite! Our Interactive Reading Compare activity teaches students how to look at two things at once. Whether comparing two characters\' choices or two different settings, this tool uses dynamic visuals to help readers see patterns and contrasts. It\'s a high-level thinking exercise that turns reading into deep analysis!'
  },
  'interactive-writing-prompts': {
    title: 'Interactive Writing Prompts - Creative Story Generator | Wizqo',
    metaDescription: 'Spark your imagination! Generate unique story ideas and start writing with our dynamic, interactive prompt engine.',
    learningObjectives: ['Initiate creative writing projects using randomized or targeted prompts', 'Develop narrative structures based on specific character and setting cues', 'Overcome "writer\'s block" through interactive brainstorming and idea generation'],
    intro: 'Your next great story starts here! Our Interactive Writing Prompts engine is a digital spark for your imagination. With thousands of possible combinations of characters, conflicts, and settings, students will never run out of ideas. It\'s the perfect playground for young authors to find their voice and start their journey into creative writing!'
  },
  'interactive-writing-sentences': {
    title: 'Interactive Writing Sentences - Structure & Expansion Lab | Wizqo',
    metaDescription: 'Build better sentences! Practice sentence expansion and grammar with our engaging interactive digital writing lab.',
    learningObjectives: ['Expand simple sentences into complex, descriptive statements', 'Master the use of adjectives, adverbs, and conjunctions in a digital workspace', 'Identify and correct common sentence-structure errors through interactive feedback'],
    intro: 'Build your writing, brick by brick! Our Interactive Writing Sentences lab turns grammar into a construction project. By taking simple ideas and "leveling them up" with descriptive language and proper structure, students learn the mechanics of great prose. It\'s a hands-on way to master the building blocks of the English language!'
  },
  'interactive-writing-poetry': {
    title: 'Interactive Writing Poetry - Rhyme & Rhythm Workshop | Wizqo',
    metaDescription: 'Find your rhythm! Explore poetic structures, rhymes, and styles in our engaging interactive digital poetry workshop.',
    learningObjectives: ['Identify and apply various poetic structures (Acrostic, Haiku, Rhyme)', 'Understand the role of rhythm and meter in poetic expression', 'Use digital tools to explore word sounds and emotional imagery'],
    intro: 'Let your words sing! Our Interactive Writing Poetry workshop is a digital stage for your creative expressions. Whether you\'re writing a rhythmic rhyme or a thoughtful haiku, this tool guides you through the patterns and sounds that make poetry powerful. It\'s a beautiful, interactive way to find the music in your writing!'
  },
  'interactive-writing-opinion': {
    title: 'Interactive Writing Opinion - Persuasion & Reasoning | Wizqo',
    metaDescription: 'Make your case! Learn persuasive writing and evidence-based reasoning with our interactive digital writing tool.',
    learningObjectives: ['Formulate clear opinion statements on high-interest topics', 'Support arguments with logical reasoning and credible evidence', 'Structure persuasive essays using an effective beginning, middle, and end'],
    intro: 'Speak your mind and change the world! Our Interactive Writing Opinion workshop teaches students how to turn their thoughts into powerful arguments. By learning how to state a position and back it up with evidence, writers develop the critical thinking and communication skills used by leaders and activists. What do YOU think? Let\'s write it down!'
  },
  'interactive-science-observation': {
    title: 'Interactive Science Observation - Digital Lab Notebook | Wizqo',
    metaDescription: 'Observe like a scientist! Record data and analyze results in our engaging interactive digital science lab.',
    learningObjectives: ['Observe and record physical phenomena using digital scientific tools', 'Differentiate between objective observations and subjective inferences', 'Develop the habit of detailed and accurate data collection in science'],
    intro: 'Step into the lab! Our Interactive Science Observation tool turns your device into a scientific field journal. By observing experiments, recording data, and analyzing patterns, students learn the fundamental skills of the scientific method. Every great discovery starts with a careful observation—what will you find today?'
  },
  'interactive-science-lifecycle': {
    title: 'Interactive Science Lifecycle - Biotic Growth Simulator | Wizqo',
    metaDescription: 'Watch it grow! Explore the life cycles of plants and animals through our dynamic interactive digital simulator.',
    learningObjectives: ['Identify and sequence the stages of various plant and animal life cycles', 'Understand the environmental factors that influence growth and development', 'Visualize the cyclical nature of life through interactive growth animations'],
    intro: 'The circle of life is interactive! Our Science Lifecycle simulator lets students "fast-forward" through months of growth in seconds. By manipulating the environment and watching how organisms develop from seeds to adults, children gain a deep, visual understanding of biology. Witness the miracle of growth in a hands-on, digital world!'
  },
  'interactive-science-states': {
    title: 'Interactive Science States of Matter - Virtual Lab | Wizqo',
    metaDescription: 'Solid, liquid, or gas? Explore the states of matter through our engaging interactive digital virtual lab.',
    learningObjectives: ['Distinguish between the properties of solids, liquids, and gases', 'Visualize molecular movement under different temperature conditions', 'Understand the processes of melting, freezing, and evaporation through simulation'],
    intro: 'Matter matters! Our Interactive Science States lab lets students shrink down to the size of a molecule to see how things really work. By changing temperatures and pressures, you can watch solids melt into liquids and liquids evaporate into gases. It\'s a virtual experiment that makes chemistry feel like magic!'
  },
  'interactive-science-weather': {
    title: 'Interactive Science Weather - Virtual Weather Station | Wizqo',
    metaDescription: 'Become a meteorologist! Predict and track weather patterns with our engaging interactive digital science lab. Free to play online.',
    learningObjectives: ['Identify and measure weather variables (temperature, precipitation, wind speed)', 'Understand the water cycle and its role in creating daily weather patterns', 'Analyze scientific data to make simple short-term weather predictions'],
    intro: 'Whats the forecast today? Our Interactive Science Weather station puts you in control of the atmosphere! By monitoring changes in pressure, humidity, and temperature, students learn how the building blocks of the sky create everything from light breezes to major storms. Step into the shoes of a meteorologist and start charting the skies!'
  },
  'interactive-geography-map': {
    title: 'Interactive Geography Map - Digital Cartography Adventure | Wizqo',
    metaDescription: 'Explore the globe! Master map skills and world landmarks with our engaging interactive geography game. Free online learning.',
    learningObjectives: ['Identify continents, oceans, and major mountain ranges on a digital map', 'Understand map features including compass roses, scales, and legends', 'Develop spatial reasoning skills by navigating a virtual world map'],
    intro: 'The world is at your fingertips! Our Interactive Geography Map turns cartography into an exploration game. By navigating through continents and zooming into world wonders, students build a mental map of our planet that lasts a lifetime. Whether you\'re finding the Equator or the Eiffel Tower, every click is a step toward global mastery!'
  },
  'interactive-geography-culture': {
    title: 'Interactive Geography Culture - Global Traditions Journey | Wizqo',
    metaDescription: 'Meet the world! Explore traditions, languages, and foods from different cultures in our engaging interactive digital game.',
    learningObjectives: ['Recognize and respect the diversity of human traditions and lifestyles', 'Identify key cultural symbols and practices from various global regions', 'Develop global awareness and empathy through cross-cultural exploration'],
    intro: 'Pack your virtual bags! Our Interactive Geography Culture journey takes you on a tour of the human family. From the festivals of Asia to the music of Africa, students learn how people around the world live, celebrate, and speak. It\'s a beautiful, engaging way to build the empathy and curiosity needed for a connected global future!'
  },
  'interactive-geography-history': {
    title: 'Interactive Geography History - Time-Traveling Map Quest | Wizqo',
    metaDescription: 'Journey through time! Explore historical eras and events on our engaging interactive digital history map.',
    learningObjectives: ['Connect historical events to their specific geographic locations', 'Understand how physical geography has influenced the course of world history', 'Analyze how borders and societies have changed over different historical eras'],
    intro: 'History isn\'t just a date—it\'s a place! Our Interactive Geography History quest turns the world map into a time machine. By exploring how civilizations grew and changed across the land, students see the "where" behind the "when" of famous events. Trace the paths of explorers and the rise of empires in a story that spans the ages!'
  },
  'interactive-grammar-parts': {
    title: 'Interactive Grammar Parts of Speech - Digital Word Sort | Wizqo',
    metaDescription: 'Master English grammar! Practice identifying nouns, verbs, and adjectives with our engaging interactive digital word sort game.',
    learningObjectives: ['Correctly classify words as nouns, verbs, adjectives, or adverbs', 'Understand the functional role of each part of speech in a sentence', 'Strengthen vocabulary by exploring varied word types in a digital workspace'],
    intro: 'Let\'s get sorted! Our Interactive Grammar Parts of Speech game turns sentence mechanics into a playful challenge. By dragging and dropping words into their correct categories, students build the foundational grammar "muscles" needed for clear and expressive writing. It\'s the fun, hands-on way to make the rules of English stick!'
  },
  'interactive-grammar-tenses': {
    title: 'Interactive Grammar Tenses - Dynamic Verb Timeline | Wizqo',
    metaDescription: 'Past, present, or future? Master verb tenses with our engaging interactive digital timeline game. Free online grammar practice.',
    learningObjectives: ['Identify and apply correct verb conjugations for past, present, and future time', 'Understand how tense markers change the meaning of a narrative', 'Improve writing accuracy by maintaining consistent tenses across sentences'],
    intro: 'Take control of time! Our Interactive Grammar Tenses workshop uses a dynamic timeline to show how verbs move the world. By shifting actions from the past to the future, students see the immediate impact of grammar on meaning. It\'s an intuitive, visual way to master the tricky rhythms of English verbs!'
  },
  'interactive-grammar-antonyms': {
    title: 'Interactive Grammar Antonyms - Opposites Matching Game | Wizqo',
    metaDescription: 'Find the opposite! Master antonyms and expand your vocabulary with our engaging interactive digital matching game.',
    learningObjectives: ['Identify antonym pairs for common adjectives, verbs, and nouns', 'Expand vocabulary by recognizing contrasting word meanings', 'Improve linguistic flexibility and precision in writing and speech'],
    intro: 'Stop and go! High and low! Our Interactive Grammar Antonyms game turns vocabulary building into a high-energy matching challenge. By connecting words with their opposites, students sharpen their mental word maps and learn how to choose the "just right" term for any situation. It\'s a fun, fast-paced way to see that every word has its flip side!'
  },
  'interactive-art-design': {
    title: 'Interactive Art Design - Digital Graphic Creator | Wizqo',
    metaDescription: 'Unleash your inner designer! Explore layout, composition, and shape-design in our engaging interactive digital art studio.',
    learningObjectives: ['Understand the principles of good design including balance, contrast, and alignment', 'Create original digital compositions using various shapes and tools', 'Develop aesthetic judgment and visual communication skills'],
    intro: 'Design your world! Our Interactive Art Design studio is a playground for your visual ideas. By arranging shapes, colors, and textures on a digital canvas, students learn the building blocks of graphic arts used by professional designers and architects. Whether you\'re making a poster or a masterpiece, this room is yours to create in!'
  },
  'interactive-art-colorwheel': {
    title: 'Interactive Art Color Wheel - Color Theory Lab | Wizqo',
    metaDescription: 'Master the rainbow! Explore primary, secondary, and tertiary colors in our engaging interactive digital color lab.',
    learningObjectives: ['Identify primary, secondary, and tertiary colors on a standard scale', 'Understand the principles of color mixing and complementary hues', 'Apply color theory to create harmonious and impactful digital art'],
    intro: 'Dive into the spectrum! Our Interactive Art Color Wheel is a hands-on lab for the science of sight. By mixing digital hues and exploring how different colors interact, students discover the secrets behind every great painting and photograph. From warm tones to cool shades, learn how to paint with the full power of the rainbow!'
  },
  'interactive-art-sketch': {
    title: 'Interactive Art Sketch - Free-Form Digital Studio | Wizqo',
    metaDescription: 'Draw your dreams! Explore digital sketching with dynamic brush tools and textures in our engaging interactive art room.',
    learningObjectives: ['Master digital drawing tools and basic artistic techniques (lines, shading, texture)', 'Express creative ideas through free-form visual storytelling', 'Build confidence in artistic self-expression and motor skill coordination'],
    intro: 'If you can dream it, you can draw it! Our Interactive Art Sketch studio is a wide-open space for your creativity. With a variety of digital brushes, markers, and textures, students can explore the joy of drawing without ever running out of ink. From simple doodles to detailed sketches, this is where your imagination takes shape!'
  }
}

/**
 * Convert docId to SEO-friendly slug
 */
function createSlug(docId: string): string {
  // Special mappings for better SEO
  const slugMap: Record<string, string> = {
    'mult-facts-0-12': 'multiplication-facts-0-12',
    'mult-arrays': 'multiplication-arrays',
    'mult-word-problems': 'multiplication-word-problems',
    'mult-by-10-100': 'multiplying-by-10-and-100',
    'mult-properties': 'properties-of-multiplication',
    'div-facts-1-12': 'division-facts-1-12',
    'div-with-remainders': 'division-with-remainders',
    'div-word-problems': 'division-word-problems',
    'fact-families-mult-div': 'multiplication-division-fact-families',
    'div-by-10-100': 'dividing-by-10-and-100',
    'fractions-whole': 'fractions-parts-of-whole',
    'comparing-fractions': 'comparing-fractions',
    'equivalent-fractions': 'equivalent-fractions',
    'fractions-number-line': 'fractions-on-number-line',
    'add-sub-fractions': 'adding-subtracting-fractions',
    'count-circle-1-10': 'count-circles-1-10',
    'count-match-1-20': 'count-and-match-1-20',
    'how-many-1-15': 'how-many-objects-1-15',
    'count-color-1-10': 'count-and-color-1-10',
    'counting-objects-20': 'counting-objects-to-20',
    'addition-subtraction-0-10': 'addition-subtraction-within-10',
    'ten-frames-1-10': 'ten-frames-1-10',
    'number-tracing-1-20': 'number-tracing-1-20',
    'number-bonds-10': 'number-bonds-to-10',
    'count-write-30': 'count-and-write-to-30',
    'missing-numbers-50': 'missing-numbers-to-50',
    'skip-count-2s': 'skip-counting-by-2s',
    'skip-count-5-10-120': 'skip-counting-by-5s-and-10s-to-120',
    'order-of-operations': 'order-of-operations-pemdas',
    'fractions-to-decimals': 'converting-fractions-to-decimals',
    'mult-lattice': 'multiplication-lattice-method',
  }

  if (slugMap[docId]) {
    return slugMap[docId]
  }

  // Auto-generate from docId
  return docId
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Generate human-readable title from docId
 */
function createTitle(docId: string): string {
  const titleMap: Record<string, string> = {
    'mult-facts-0-12': 'Multiplication Facts 0-12',
    'mult-arrays': 'Multiplication Arrays',
    'mult-word-problems': 'Multiplication Word Problems',
    'mult-by-10-100': 'Multiplying by 10 and 100',
    'mult-properties': 'Properties of Multiplication',
    'div-facts-1-12': 'Division Facts 1-12',
    'div-with-remainders': 'Division with Remainders',
    'div-word-problems': 'Division Word Problems',
    'fact-families-mult-div': 'Multiplication and Division Fact Families',
    'div-by-10-100': 'Dividing by 10 and 100',
    'fractions-whole': 'Fractions Parts of a Whole',
    'comparing-fractions': 'Comparing Fractions',
    'equivalent-fractions': 'Equivalent Fractions',
    'fractions-number-line': 'Fractions on a Number Line',
    'add-sub-fractions': 'Adding and Subtracting Fractions',
    'count-circle-1-10': 'Count Circles 1-10',
    'count-match-1-20': 'Count and Match 1-20',
    'how-many-1-15': 'How Many Objects 1-15',
    'count-color-1-10': 'Count and Color 1-10',
    'counting-objects-20': 'Counting Objects to 20',
    'addition-subtraction-0-10': 'Addition and Subtraction Within 10',
    'ten-frames-1-10': 'Ten Frames 1-10',
    'number-tracing-1-20': 'Number Tracing 1-20',
    'number-bonds-10': 'Number Bonds to 10',
    'count-write-30': 'Count and Write to 30',
    'missing-numbers-50': 'Missing Numbers to 50',
    'skip-count-2s': 'Skip Counting by 2s',
    'skip-count-5-10-120': 'Skip Counting by 5s and 10s to 120',
    'order-of-operations': 'Order of Operations (PEMDAS)',
    'fractions-to-decimals': 'Converting Fractions to Decimals',
    'mult-lattice': 'Lattice Multiplication',
    'factors-multiples': 'Factors and Multiples',
    'prime-composite': 'Prime and Composite Numbers',
    'div-fractions': 'Dividing Fractions',
    'fraction-mult': 'Multiplying Fractions',
    'fraction-mult-whole': 'Multiplying Fractions by Whole Numbers',
    'rounding-decimals': 'Rounding Decimals',
    'estimating-sums-differences': 'Estimating Sums and Differences',
    'reward-chart': 'Weekly Reward / Sticker Chart',
    'spring-scavenger': 'Spring Scavenger Hunt',
    'summer-pack': 'Summer Fun Pack',
    'animal-pack': 'Animal Activity Pack',
    'stem-balloon-rocket': 'STEM: Balloon Rocket',
    'stem-walking-water': 'STEM: Walking Water',
    'arts-3-shape-creature': 'Arts: 3-Shape Creature',
    'ws-world': 'Word Search: World Geography',
  }

  if (titleMap[docId]) {
    return titleMap[docId]
  }

  // Auto-generate from docId
  return docId
    .split('-')
    .map(word => {
      // Handle numbers
      if (/^\d+$/.test(word)) return word
      if (word === 'mult') return 'Multiplication'
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Infer grade from docId
 */
function inferGrade(docId: string): string[] {
  if (docId.includes('kindergarten') || docId.includes('prek') || docId.includes('pre-k') || docId === 'match-object-to-shadow') {
    return ['Kindergarten', 'Pre-K']
  }
  if (docId.includes('1st-grade') || docId.includes('first-grade') || docId.includes('g1')) {
    return ['1st Grade']
  }
  if (docId.includes('2nd-grade') || docId.includes('second-grade') || docId.includes('g2')) {
    return ['2nd Grade']
  }
  if (docId.includes('3rd-grade') || docId.includes('third-grade') || docId.includes('g3')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('4th-grade') || docId.includes('fourth-grade') || docId.includes('g4')) {
    return ['4th Grade', '5th Grade']
  }
  if (docId.includes('5th-grade') || docId.includes('fifth-grade') || docId.includes('g5') || docId === 'adding-decimals-challenge') {
    return ['5th Grade']
  }

  // Default based on content
  if (docId.includes('mult') || docId.includes('div') || docId.includes('fractions') || docId.includes('decimals')) {
    return ['3rd Grade', '4th Grade']
  }
  if (docId.includes('count') || docId.includes('number') || docId.includes('shape') || docId.includes('pattern')) {
    return ['Kindergarten', '1st Grade']
  }
  if (docId.includes('pemdas') || docId.includes('order-of-operations') || docId.includes('algebra')) {
    return ['4th Grade', '5th Grade', '6th Grade']
  }

  return ['Elementary']
}

/**
 * Infer category from docId
 */
function inferCategory(docId: string): string[] {
  const categories: string[] = []

  if (docId.includes('mult')) categories.push('multiplication')
  if (docId.includes('div')) categories.push('division')
  if (docId.includes('fraction')) categories.push('fractions')
  if (docId.includes('decimal')) categories.push('decimals')
  if (docId.includes('add') || docId.includes('sub')) categories.push('addition-subtraction')
  if (docId.includes('count')) categories.push('counting')
  if (docId.includes('number')) categories.push('number-sense')
  if (docId.includes('word-problem')) categories.push('word-problems')
  if (docId.includes('geometry') || docId.includes('shape') || docId.includes('area') || docId.includes('perimeter') || docId.includes('angle')) {
    categories.push('geometry')
  }
  if (docId.includes('measurement') || docId.includes('time') || docId.includes('money') || docId.includes('length') || docId.includes('weight') || docId.includes('liquid')) {
    categories.push('measurement')
  }
  if (docId.includes('reading') || docId.includes('comprehension')) {
    categories.push('reading')
  }
  if (docId.includes('pemdas') || docId.includes('order-of-operations')) {
    categories.push('order-of-operations')
  }
  if (docId.includes('lattice')) {
    categories.push('multiplication')
    categories.push('logic')
  }
  if (docId.includes('pattern')) {
    categories.push('patterns')
  }
  if (docId === 'match-object-to-shadow') {
    categories.push('visual-perception')
    categories.push('logic')
  }

  return categories.length > 0 ? categories : ['math']
}

/**
 * Generate SEO title (60-70 chars)
 */
function generateSEOTitle(name: string, grade?: string[]): string {
  const gradeText = grade && grade.length > 0 ? ` for ${grade[0]}` : ''
  return `${name} Worksheet${gradeText} - Free Printable PDF | Wizqo`
}

/**
 * Generate meta description (150-160 chars)
 */
function generateMetaDescription(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0 ? `Perfect for ${grade.join(' and ')}. ` : ''
  const categoryText = category.length > 0 ? `${category[0]} practice. ` : ''
  const benefits = ['Build math skills', 'Master key concepts', 'Practice with answer key']
  return `Download free printable ${name.toLowerCase()} worksheet with answer key. ${gradeText}${categoryText}${benefits[0]}. Instant PDF download.`
}

/**
 * Generate keywords
 */
function generateKeywords(name: string, category: string[], grade: string[]): string {
  const base = [
    name.toLowerCase(),
    `${name.toLowerCase()} worksheet`,
    `free ${name.toLowerCase()} worksheet`,
    `printable ${name.toLowerCase()}`,
    `${name.toLowerCase()} PDF`,
  ]

  const cat = category.flatMap(c => [`${c} worksheet`, `${c} worksheets`])
  const grd = grade.flatMap(g => [`${g} ${name.toLowerCase()}`, `${g} math worksheet`])

  return [...base, ...cat, ...grd].slice(0, 15).join(', ')
}

/**
 * Generate intro content (120-200 words)
 */
function generateIntro(name: string, grade: string[], category: string[]): string {
  const gradeText = grade.length > 0
    ? `This ${name.toLowerCase()} worksheet is designed for ${grade.join(' and ')} students. `
    : `This ${name.toLowerCase()} worksheet helps students `

  const categoryText = category.length > 0
    ? `practice ${category[0]} skills and build confidence. `
    : 'build essential math skills. '

  return `${gradeText}${categoryText}This printable worksheet includes an answer key for easy checking and is perfect for classroom use, homework, or extra practice at home. Download the free PDF instantly and start practicing today!`
}

/**
 * Generate learning objectives
 */
function generateLearningObjectives(name: string, category: string[]): string[] {
  const base = [
    `Master ${name.toLowerCase()} skills`,
    `Practice ${category[0] || 'math'} concepts`,
    `Build confidence with ${name.toLowerCase()}`,
  ]

  // Add category-specific objectives
  if (category.includes('multiplication')) {
    base.push('Build multiplication fluency')
  }
  if (category.includes('division')) {
    base.push('Master division facts')
  }
  if (category.includes('fractions')) {
    base.push('Understand fraction concepts')
  }
  if (category.includes('counting')) {
    base.push('Develop number recognition')
  }

  return base.slice(0, 4)
}

/**
 * Generate visual examples based on worksheet type
 */
function generateVisualExamples(docId: string, name: string, category: string[]): string {
  const lowerDocId = docId.toLowerCase()
  const lowerName = name.toLowerCase()

  // Multiplication worksheets
  if (category.includes('multiplication') || lowerDocId.includes('mult')) {
    if (lowerDocId.includes('array') || lowerDocId.includes('arrays')) {
      return `📊 Visual Example (Arrays):
   Array:  ⬛⬛⬛
           ⬛⬛⬛
           ⬛⬛⬛
           
   This shows: 3 rows × 3 columns = 9

📝 Example Problems:
   [⬛⬛⬛]     = ? × ? = ?
   [⬛⬛⬛]
   [⬛⬛⬛]
   
   [⬛⬛⬛⬛]   = 2 × 4 = ?
   [⬛⬛⬛⬛]`
    } else if (lowerDocId.includes('times-table') || lowerDocId.includes('facts') || lowerDocId === 'mult-facts-0-12' || lowerDocId === 'mult-facts-1-5' || lowerDocId === 'mult-facts-6-12') {
      return `📝 Preview - Problems in this worksheet:
     6         7         9         5         8
   × 4      × 6      × 4      × 3      × 7
   ----     ----     ----     ----     ----
     ?        ?        ?        ?        ?

✨ Includes 20 multiplication problems (0×0 to 12×12)
   Each worksheet includes a worked example with strategies
   and a complete answer key.`
    } else if (lowerDocId.includes('word-problem')) {
      return `📝 Example Problem:
   "Sarah has 4 boxes. Each box has 6 apples. 
   How many apples does Sarah have in total?"
   
   Solution:
   • Draw:  [6] [6] [6] [6]
   • Count: 6 + 6 + 6 + 6 = 24
   • Or multiply: 4 × 6 = 24
   • Answer: 24 apples`
    }
  }

  // Addition/Subtraction worksheets
  if (category.includes('addition-subtraction') || lowerDocId.includes('add') || lowerDocId.includes('sub')) {
    if (lowerDocId === 'add-2digit-100' || lowerDocId === 'add-2digit-regrouping' || lowerDocId === 'sub-2digit-100' || lowerDocId === 'sub-2digit-regrouping') {
      if (lowerDocId === 'add-2digit-100') {
        return `📝 Preview - Problems in this worksheet:
    23        45        67        38        52
  + 15     + 32     + 28     + 41     + 26
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes 10 addition problems (no regrouping)
   Each worksheet includes a worked example with visual
   place value blocks and step-by-step solution.`
      } else if (lowerDocId === 'add-2digit-regrouping') {
        return `📝 Preview - Problems in this worksheet:
    27        38        49        56        63
  + 15     + 26     + 37     + 28     + 19
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes problems WITH regrouping (carrying)
   Each worksheet includes a worked example showing
   regrouping steps and visual place value blocks.`
      } else if (lowerDocId === 'sub-2digit-100') {
        return `📝 Preview - Problems in this worksheet:
    45        67        89        56        73
  - 23     - 35     - 42     - 24     - 31
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes 10 subtraction problems (no regrouping)
   Each worksheet includes a worked example with
   step-by-step solution and visual strategies.`
      } else {
        return `📝 Preview - Problems in this worksheet:
    52        63        74        81        95
  - 28     - 39     - 46     - 47     - 58
  ----     ----     ----     ----     ----
    ?        ?        ?        ?        ?

✨ Includes problems WITH regrouping (borrowing)
   Each worksheet includes a worked example showing
   regrouping steps and visual place value strategies.`
      }
    } else {
      return `📝 Example Problems:
   8 + 5 = ?     12 + 7 = ?     15 - 4 = ?

🔢 Visual Strategy (Number Line):
   0---5---10---15---20
   8 + 5 = 13
   
   Or use ten frames:
   [●●●●●●●●] [●●]  = 8 + 5 = 13
   [●●●●●] [●●●●●]`
    }
  }

  // Fractions worksheets
  if (category.includes('fractions') || lowerDocId.includes('fraction')) {
    if (lowerDocId === 'fractions-halves-thirds-fourths') {
      return `🍕 Visual Example:
   Whole Circle:  [████████]
   
   Halves:        [████] [████]     = 1/2, 2/2
   Thirds:        [███] [███] [███] = 1/3, 2/3, 3/3
   Fourths:       [██] [██] [██] [██] = 1/4, 2/4, 3/4, 4/4

📝 Example Problems:
   1. Color 1/2 of the circle
   2. Shade 2/3 of the rectangle
   3. Circle 3/4 of the objects

✨ This worksheet helps students understand fractions 
   as parts of a whole. Answer key included.`
    } else if (lowerDocId === 'adding-subtracting-fractions' || lowerDocId === 'add-sub-fractions') {
      return `📝 Preview - Problems in this worksheet:
   1/4 + 1/4 = ?     3/5 - 1/5 = ?     2/3 + 1/3 = ?
   4/6 + 1/6 = ?     5/8 - 2/8 = ?

✨ Includes problems with same denominators
   Each worksheet includes visual examples and
   step-by-step solutions in the answer key.`
    } else {
      return `🍕 Visual Example:
   Whole Circle:  [████████]
   
   Halves:        [████] [████]     = 1/2, 2/2
   Thirds:        [███] [███] [███] = 1/3, 2/3, 3/3
   Fourths:       [██] [██] [██] [██] = 1/4, 2/4, 3/4, 4/4

📝 Example Problems:
   1. Shade 3/4 of the shape
   2. Which is larger: 1/2 or 1/4?
   3. Color 2 parts out of 6 parts`
    }
  }

  // Place value worksheets
  if (lowerDocId.includes('place-value') || lowerDocId === 'place-value-hto' || lowerDocId === 'expanded-form-200') {
    if (lowerDocId === 'expanded-form-200') {
      return `📝 Preview - Problems in this worksheet:
   1. Write 247 in expanded form: ?
   2. Write 182 in expanded form: ?
   3. What is 300 + 50 + 6?  ?
   4. Write 156 in expanded form: ?

✨ Includes place value and expanded form practice
   Each worksheet includes visual place value charts
   and complete answer key.`
    } else {
      return `🔢 Visual Example:
   Number: 247
   
   Hundreds | Tens | Ones
   ---------|------|-----
      2     |  4   |  7
   (200)    | (40) | (7)
   
   Expanded form: 200 + 40 + 7 = 247

📝 Example Problems:
   1. What is the value of 5 in 357?  (Answer: 50)
   2. Write 482 in expanded form: 400 + 80 + 2
   3. Which digit is in the tens place in 129?  (Answer: 2)`
    }
  }

  // Counting worksheets
  if (category.includes('counting') || lowerDocId.includes('count')) {
    return `🔢 Visual Example:
   Count the objects:
   
   ⭐⭐⭐⭐⭐
   ⭐⭐⭐⭐⭐
   ⭐⭐⭐
   
   Total: 13 stars

📝 Example Problems:
   1. Count and write: How many circles? ○○○○○○○○
   2. Count by 2s: 2, 4, 6, 8, __, __
   3. Count by 5s: 5, 10, 15, __, __`
  }

  // Patterns worksheets
  if (category.includes('patterns') || lowerDocId.includes('pattern')) {
    return `🔢 Visual Example (AB Pattern):
   Pattern: ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
   
   Continue: ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ __ __

📝 Example Problems:
   1. Complete the pattern: 🔴 🔵 🔴 🔵 __ __
   2. What comes next? 2, 4, 6, 8, __, __
   3. Create your own pattern`
  }

  // Word problems
  if (category.includes('word-problems') || lowerDocId.includes('word-problem')) {
    return `📝 Example Problem:
   "Emma has 15 stickers. She gives away 7 stickers. 
   How many stickers does Emma have left?"
   
   Solution:
   • What we know: Start with 15, give away 7
   • Operation: Subtraction
   • Solve: 15 - 7 = 8
   • Answer: 8 stickers left`
  }

  if (docId === 'adding-decimals-challenge') {
    return `📝 Example Problem:
   1.25 + 3.40 = ?
   
   Step 1: Line up the decimal points!
      1.25
    + 3.40
    ------
    
   Step 2: Add from right to left
      1.25
    + 3.40
    ------
      4.65
      
   Answer: 4.65`;
  }


  // Decimals worksheets
  if (category.includes('decimals') || lowerDocId.includes('decimal')) {
    return `🔢 Visual Example:
   Decimal: 0.75
   
   Ones | Tenths | Hundredths
   -----|--------|------------
    0   |   7    |     5
        | (0.7)  |  (0.05)
   
   0.75 = 7/10 + 5/100 = 75/100

📝 Example Problems:
   1. Write 0.5 as a fraction: 5/10 = 1/2
   2. Compare: 0.3 ___ 0.30  (Answer: =)
   3. Add: 0.4 + 0.2 = ?`;
  }



  // Order of operations (PEMDAS)
  if (lowerDocId.includes('pemdas') || lowerDocId.includes('order-of-operations')) {
    return `📝 Example Problem:
   2 + 3 × 4 = ?
   
   Step 1: Multiplication first (PEMDAS)
           3 × 4 = 12
   
   Step 2: Then addition
           2 + 12 = 14
   
   Answer: 14

📝 Another Example:
   (5 + 3) × 2 = ?
   
   Step 1: Parentheses first
           (5 + 3) = 8
   
   Step 2: Then multiplication
           8 × 2 = 16
   
   Answer: 16`
  }

  // Default fallback
  return `📝 Example Problems:
   This worksheet includes practice problems to help students 
   master ${name.toLowerCase()} skills.
   
   ✨ Students will practice:
   • Problem-solving
   • Building confidence
   • Mastering key concepts`
}

/**
 * Complete SEO mapping for all 254 worksheets
 * This is a comprehensive mapping - we'll generate the rest programmatically
 */
export const WORKSHEET_SEO_MAP: Record<string, WorksheetSEO> = {}

/**
 * Initialize SEO map with all worksheets
 * This function generates SEO data for all 254 worksheets
 */
export function initializeWorksheetSEO() {
  // List of all 254 worksheet docIds
  const allDocIds = [
    'ab-pattern', 'add-2digit-100', 'add-2digit-regrouping', 'adding-decimals-challenge', 'addition-subtraction-0-10',
    'add-sub-decimals', 'add-sub-fractions', 'add-sub-fractions-4th', 'add-sub-mixed-numbers',
    'add-three-numbers', 'animal-pack', 'area-model-mult', 'area-perimeter-4th', 'area-rectangles',
    'area-triangles-parallelograms', 'arts-3-shape-creature', 'balance-equations-10', 'bar-graphs-data',
    'bar-graphs-pictographs', 'beginning-sounds-az', 'big-small', 'bookmark-templates',
    'brain-boost', 'classifying-angles', 'classifying-quadrilaterals',
    'classifying-shapes', 'classifying-triangles', 'color-by-number', 'color-patterns',
    'color-recognition', 'color-shapes', 'coloring', 'coloring-animals', 'coloring-letters-numbers',
    'coloring-nature', 'coloring-space', 'coloring-vehicles', 'compare-2digit', 'comparing-decimals',
    'comparing-fractions', 'comparing-fractions-4th', 'comparing-ordering-fractions-decimals',
    'coordinate-graphing', 'count-circle-1-10', 'count-color-1-10', 'counting-objects-20',
    'count-match-1-20', 'count-write-30', 'creative-challenge', 'customary-conversion',
    'customary-units', 'cut-and-paste-crafts', 'cvc-words', 'decimals-place-value', 'decimal-to-percent',
    'decimal-word-problems', 'decimal-word-problems-5th', 'design-monster', 'directed-drawing-animals',
    'div-by-10-100', 'div-facts-1-12', 'dividing-decimals', 'dividing-fractions',
    'div-with-remainders', 'div-word-problems', 'dot-to-dot-1-20', 'doubles-facts',
    'doubles-near-doubles', 'draw-half', 'draw-shape',
    'elapsed-time-4th', 'elapsed-time-word-problems', 'equivalent-fractions',
    'equivalent-fractions-4th', 'estimating-sums-differences', 'evaluating-expressions',
    'even-odd-100', 'expanded-form-200', 'fact-families-20', 'fact-families-mult-div',
    'feelings-checkin', 'find-number-1-10', 'factors-multiples', 'fractions-decimals-percents', 'fractions-decimals-percents-advanced',
    'fractions-halves-thirds-fourths', 'fraction-mult', 'fraction-mult-whole', 'fractions-number-line', 'fractions-out-of-100',
    'fractions-to-decimals', 'fractions-to-decimals-basic-tenths', 'fractions-to-decimals-division',
    'fractions-whole', 'fraction-word-problems', 'fraction-word-problems-5th', 'div-fractions',
    'geo-compass-rose', 'geo-continents-k2', 'geo-landforms', 'geo-latlong',
    'geometry-word-problems', 'grammar-detective', 'gratitude-jar', 'halloween-pack',
    'heavy-light', 'hidden-object', 'how-many-1-15', 'identify-polygons',
    'identify-polygons',
    'letter-tracing-az', 'line-graphs', 'line-plots', 'lines-angles-4th',
    'lines-rays-angles', 'liquid-measurement', 'liquid-measurement-4th',
    'logic-grid', 'long-division-1digit', 'long-division-2digit', 'long-division-multidigit',
    'long-short', 'mandalas', 'mass-weight', 'mass-weight-4th', 'math-maze', 'maze-focus',
    'mean-median-mode', 'mean-median-mode-range', 'measurement-length', 'measurement-word-problems',
    'mental-math-20', 'metric-conversion', 'metric-units', 'missing-addends',
    'missing-numbers-50', 'missing-shape', 'mixed-improper-fractions', 'money-coins-bills',
    'money-word-problems', 'mood-tracker', 'more-less', 'more-less-equal-10', 'mult-2x1', 'mult-2x1-digit',
    'mult-2x2', 'mult-2x2-digit', 'mult-3x2-digit', 'mult-area-model', 'mult-arrays',
    'mult-arrays-2-5', 'mult-arrays-models', 'mult-by-10-100', 'mult-complex-word',
    'mult-fact-families', 'mult-fact-fluency', 'mult-facts-0-12', 'mult-facts-1-5',
    'mult-facts-6-12', 'mult-lattice', 'multiplying-decimals', 'multiplying-fractions', 'multi-step-word-4th',
    'multi-step-word-5th', 'multi-step-word-problems', 'mult-mixed-review',
    'mult-multi-step-word', 'mult-patterns', 'mult-properties', 'mult-strategies',
    'mult-word-problems', 'mult-word-problems-2-3', 'nets-3d-shapes', 'number-bonds-10',
    'number-id-1-10', 'number-line-200', 'number-line-add', 'number-matching-1-15',
    'number-order-1-20', 'number-patterns-200', 'number-tracing-1-10', 'number-tracing-1-20',
    'ordering-fractions-decimals', 'order-of-operations', 'partial-products',
    'pattern-complete', 'patterns-rules', 'pemdas-advanced', 'pemdas-basic', 'pemdas-complex',
    'pemdas-exponents', 'pemdas-fluency', 'pemdas-mixed-review', 'pemdas-multistep',
    'pemdas-parentheses', 'pemdas-practice', 'pemdas-rules', 'pemdas-step-by-step',
    'pemdas-word-problems', 'percent-to-decimal', 'percent-word-problems',
    'perimeter-area-word-problems', 'perimeter-shapes', 'picture-addition-10',
    'place-value-hto', 'powers-of-10', 'prime-composite', 'probability', 'ratio-proportion-word-problems',
    'color-by-number', 'logic-grid', 'maze-focus', 'word-search',
    'reading-g1-ants', 'reading-g1-big-box', 'reading-g1-birthday-cake', 'reading-g1-bus-ride',
    'reading-g1-garden-snail', 'reading-g1-lost-hat', 'reading-g1-pet-fish',
    'reading-g1-red-balloon', 'reading-g2-bird-feeder', 'reading-g2-cookie-recipe',
    'reading-g2-library-card', 'reading-g2-lost-and-found', 'reading-g2-paper-bridge',
    'reading-g2-rainy-garden', 'reading-g2-tree-house', 'reading-g2-magic-seeds', 'reading-g3-art-project',
    'reading-g3-community-garden', 'reading-g3-lighthouse', 'reading-g3-school-play',
    'reading-g3-science-fair', 'reading-mini-1', 'reward-chart', 'rhyming-words', 'rounding-decimals', 'rounding-nearest-10',
    'same-different', 'science-lifecycle', 'science-match', 'sentence-building', 'shape-identification', 'shape-patterns',
    'shapes-colors-sort', 'shape-sorting', 'sight-words-pre-primer', 'size-comparison',
    'skip-count-2s', 'skip-count-5-10-120', 'skip-count-mult', 'solving-one-step-equations',
    'spelling', 'spot-difference', 'spring-scavenger', 'stem-balloon-rocket', 'stem-leaf-plots',
    'stem-walking-water', 'sub-2digit-100', 'sub-2digit-regrouping', 'sudoku4', 'sudoku6',
    'subtraction-stories', 'summer-pack', 'symmetry', 'symmetry-transformations', 'tangram-animals',
    'ten-frames-1-10', 'ten-frames-1-20', 'time-5min', 'times-table-blank-1-12', 'times-table-blank-1-5', 'times-table-blank-6-12',
    'times-table-color-1-12', 'times-table-color-1-5', 'times-table-color-6-12',
    'times-table-confidence-1-5', 'times-table-confidence-6-12', 'times-table-fluency-1-12',
    'times-table-horizontal-1-12', 'times-table-horizontal-1-5', 'times-table-horizontal-6-12',
    'times-table-missing-1-5', 'times-table-missing-6-12', 'times-table-missing-mixed',
    'times-table-mixed-review', 'times-table-timed-1-12', 'times-table-timed-1-5',
    'times-table-timed-6-12', 'times-table-vertical-1-12', 'times-table-vertical-1-5',
    'times-table-vertical-6-12', 'time-to-minute', 'transformations-5th',
    'uppercase-lowercase-match', 'volume-rectangular-prisms', 'weekly-goals', 'what-comes-next',
    'writing-expressions', 'ws-world',
    'match-object-to-shadow', 'match-the-feeling', 'reading-discovery-interactive',
    // Interactive Worksheets
    'interactive-math-rhythm', 'interactive-math-race', 'interactive-math-puzzle',
    'interactive-math-shapes', 'interactive-math-money', 'interactive-math-fractions',
    'interactive-math-measurement', 'interactive-reading-adventure', 'interactive-reading-detective',
    'interactive-reading-vocab', 'interactive-reading-summary', 'interactive-reading-compare',
    'interactive-writing-prompts', 'interactive-writing-sentences', 'interactive-writing-poetry',
    'interactive-writing-opinion', 'interactive-science-observation', 'interactive-science-lifecycle',
    'interactive-science-states', 'interactive-science-weather', 'interactive-geography-map',
    'interactive-geography-culture', 'interactive-geography-history', 'interactive-grammar-parts',
    'interactive-grammar-tenses', 'interactive-grammar-antonyms', 'interactive-art-design',
    'interactive-art-colorwheel', 'interactive-art-sketch', 'interactive-early-phonics',
    'interactive-early-counting', 'interactive-early-patterns', 'interactive-logic-sequence',
    'interactive-logic-riddles', 'interactive-logic-deduction', 'interactive-sel-mindfulness',
    'interactive-sel-empathy', 'interactive-sel-goals', 'interactive-early-basics',
    'interactive-early-foundations', 'interactive-early-letters', 'interactive-early-numbers',
    'interactive-early-shapes', 'interactive-geography-prek', 'interactive-grammar-prek',
    'interactive-logic-prek', 'interactive-reading-prek', 'interactive-reading-storymap',
    'interactive-science-prek', 'interactive-science-space', 'interactive-sel-prek',
    'interactive-writing-prek',
    'fractions-of-group', 'fractions-parts-of-set', 'fractions-word-problems', 'geometric-patterns',
    'greater-than-less-than-100', 'intro-to-angles-for-kids', 'intro-to-fractions-4th', 'lattice-mult',
    'letter-recognition', 'liquid-volume-word-problems', 'lowercase-alphabet', 'mascot-stickers',
    'mass-weight-word-problems', 'match-column', 'match-number-1-10', 'match-picture-1-10',
    'match-shape', 'maze-logic', 'maze-mult', 'missing-addends-10', 'missing-factors-mult',
    'missing-number-sequence', 'money-identifying-coins', 'multiplication-color-by-number',
    'mult-word-problems-4th', 'name-writing', 'number-id-20', 'number-line-id-20',
    'number-line-skip-count', 'number-line-sums-differences', 'number-matching-1-10',
    'number-order-1-30', 'number-patterns', 'number-patterns-subtraction', 'number-recognition-120',
    'number-tracing-1-30', 'number-words-1-10', 'number-words-11-20', 'odd-even-sorting',
    'one-more-one-less', 'ordering-numbers-100', 'perimeter-rectangles', 'phonics-short-a',
    'phonics-short-e', 'phonics-short-i', 'phonics-short-o', 'phonics-short-u',
    'place-value-blocks-100', 'place-value-expansion-100', 'place-value-hundreds', 'place-value-tens-ones',
    'reading-comprehension-grade-1', 'reading-comprehension-grade-2', 'reading-comprehension-grade-3',
    'reading-comprehension-grade-4', 'reading-comprehension-grade-5', 'reading-kindergarten',
    'rounding-decimals-5th', 'rounding-nearest-10-100', 'school-survival-kit', 'sentence-scramble',
    'shapes-all-around', 'shapes-az', 'shapes-coloring', 'skip-count-10', 'skip-count-2',
    'skip-count-2-10', 'skip-count-5', 'skip-counting-by-2s-to-50', 'skip-counting-by-5s-to-100',
    'skip-counting-missing', 'spatial-awareness', 'spatial-logic-blocks', 'telling-time-5min',
    'telling-time-analog-clocks', 'telling-time-half-hour', 'telling-time-quarter-hour',
    'telling-time-to-the-hour', 'ten-frames-11-20', 'thickness-heavy-light', 'tracing-alphabet',
    'tracing-letters', 'tracing-lowercase', 'tracing-numbers-1-10', 'tracing-numbers-1-20',
    'tracing-uppercase', 'two-digit-addition-no-regrouping', 'two-digit-addition-with-regrouping',
    'two-digit-subtraction-no-regrouping', 'two-digit-subtraction-with-regrouping', 'unitary-method-5th',
    'uppercase-alphabet', 'uppercase-lowercase-sorting', 'vowel-recognition',
    'word-problems-addition-subtraction', 'writing-numbers-1-100', 'writing-prompts-creative'
  ]

  // Generate SEO data for each worksheet
  for (const docId of allDocIds) {
    const name = createTitle(docId)
    const slug = createSlug(docId)
    const grade = inferGrade(docId)
    const category = inferCategory(docId)

    const overrides = WORKSHEET_MANUAL_CONTENT[docId] || {}

    WORKSHEET_SEO_MAP[docId] = {
      docId,
      slug,
      title: overrides.title || generateSEOTitle(name, grade),
      metaDescription: overrides.metaDescription || generateMetaDescription(name, grade, category),
      keywords: overrides.keywords || generateKeywords(name, category, grade),
      h1: overrides.h1 || `${name} Worksheet`,
      intro: overrides.intro || generateIntro(name, grade, category),
      grade,
      category,
      section: category[0] || 'Math',
      learningObjectives: overrides.learningObjectives || generateLearningObjectives(name, category),
      relatedDocIds: [], // Will be populated based on category/grade
    }
  }

  // Populate related worksheets
  for (const docId in WORKSHEET_SEO_MAP) {
    const seo = WORKSHEET_SEO_MAP[docId]
    const related = Object.values(WORKSHEET_SEO_MAP)
      .filter(w =>
        w.docId !== docId &&
        (w.category.some(c => seo.category.includes(c)) ||
          w.grade.some(g => seo.grade.includes(g)))
      )
      .slice(0, 5)
      .map(w => w.docId)
    seo.relatedDocIds = related
  }
}

// Initialize on module load
initializeWorksheetSEO()

/**
 * Get SEO data for a worksheet by docId
 */
export function getWorksheetSEO(docId: string): WorksheetSEO | undefined {
  return WORKSHEET_SEO_MAP[docId]
}

/**
 * Get SEO data for a worksheet by slug
 */
export function getWorksheetSEOBySlug(slug: string): WorksheetSEO | undefined {
  return Object.values(WORKSHEET_SEO_MAP).find(seo => seo.slug === slug)
}

/**
 * Get all worksheet SEO data
 */
export function getAllWorksheetSEO(): WorksheetSEO[] {
  return Object.values(WORKSHEET_SEO_MAP)
}
