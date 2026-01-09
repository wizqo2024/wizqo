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
    'interactive-writing-prek'
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

  // MANUAL OVERRIDE for Match The Feeling (Premium SEO)
  WORKSHEET_SEO_MAP['match-the-feeling'] = {
    docId: 'match-the-feeling',
    slug: 'match-the-feeling',
    title: 'Match the Feeling to the Situation - Free SEL Worksheet | Wizqo',
    metaDescription: 'Free printable Social Emotional Learning (SEL) worksheet. Help kids identify feelings like sad, happy, bored, and friendly by matching them to real-life situations.',
    keywords: 'match the feeling worksheet, social emotional learning worksheets, sel worksheets for kids, feelings and emotions worksheets, kindergarten feelings activity, identifying emotions worksheet, preschool sel printables',
    h1: 'Match the Feeling to the Situation',
    intro: 'This interactive Social Emotional Learning (SEL) worksheet helps children develop emotional intelligence by matching feelings to real-world situations. Perfect for Kindergarten and 1st Grade students to practice empathy and self-awareness.',
    grade: ['Kindergarten', '1st Grade'],
    category: ['visual-perception', 'social-emotional-learning'],
    section: 'Shapes & Colors',
    learningObjectives: ['Identify core emotions', 'Connect feelings to causes', 'Build emotional vocabulary'],
    relatedDocIds: ['match-object-to-shadow', 'feelings-checkin', 'winter-kindness']
  }

  // MANUAL OVERRIDE for Reading Discovery (High Performance SEO)
  WORKSHEET_SEO_MAP['reading-discovery-interactive'] = {
    docId: 'reading-discovery-interactive',
    slug: 'reading-discovery-interactive',
    title: 'Reading Discovery: Interactive Comprehension Worksheet | Wizqo',
    metaDescription: 'Free interactive reading comprehension worksheet for kids. Practice reading with 3 original stories, colorful 3D illustrations, and instant "Show Answer" features. Perfect for Grade 1 and 2.',
    keywords: 'reading discovery worksheet, interactive reading comprehension, free reading worksheets for kids, reading passages with questions, grade 1 reading comprehension, grade 2 reading comprehension, interactive learning worksheets, printable reading pdf',
    h1: 'Reading Discovery: Interactive Comprehension',
    intro: 'Welcome to Reading Discovery! This interactive worksheet features three original stories—Leo\'s Space Adventure, The Helpful Robot, and Mia\'s Magic Garden—designed to build reading comprehension and critical thinking skills in young learners. Use the "Show Answer" feature for interactive classroom learning or print the worksheet for quiet practice.',
    grade: ['1st Grade', '2nd Grade'],
    category: ['reading', 'visual-perception'],
    section: 'Reading',
    learningObjectives: ['Improve text comprehension', 'Identify key details in stories', 'Connect visual aids to written context', 'Build vocabulary'],
    relatedDocIds: ['reading-g1-birthday-cake', 'reading-g2-magic-seeds', 'match-the-feeling']
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
