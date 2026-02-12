import { BlogPost } from './types';

// Base posts (inline)
export const basePosts: BlogPost[] = [
  // Gentle parenting post is rendered with a purpose-built component instead of markdown content
  {
    id: "gentle-parenting-techniques",
    title: "Gentle Parenting Techniques That Actually Work",
    excerpt: "Learn gentle parenting techniques that actually work — real stories, science, and simple steps to replace punishment with connected, calm discipline.",
    content: "<GentleParentingFull />",
    author: "Wizqo Team",
    date: "2025-10-27T23:59:59Z",
    readTime: "7–8 min read",
    category: "Mental Wellness",
    imageUrl: "https://images.unsplash.com/photo-1628191013085-990d39ec25b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    imageAlt: "Parent and child sharing a calm, connected moment outdoors"
  },
  {
    id: "free-multiplication-worksheets-pdf",
    title: "Free Multiplication Worksheets (PDF) | Fun Printable Math Practice",
    excerpt: "Download free printable multiplication worksheets to make math simple and fun. Build confidence with times tables, word problems, and creative activities — ready to print and learn anywhere!",
    content: "<MultiplicationWorksheetsBlog />",
    author: "Wizqo Team",
    date: "2025-11-10T12:00:00Z",
    readTime: "6-7 min read",
    category: "Learning Tips",
    imageUrl: "https://images.pexels.com/photos/5412081/pexels-photo-5412081.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Child practicing multiplication on printable worksheet",
    keywords: "multiplication worksheets, free printable multiplication worksheets pdf, times tables worksheets for practice, math multiplication activities printable, multiplication facts worksheets download, printable math worksheets for beginners, classroom multiplication resources"
  },
  {
    id: "free-grade-2-math-worksheets-pdf",
    title: "Free Grade 2 Math Worksheets (PDF) – Build Confidence & Make Learning Fun!",
    excerpt: "Download free grade 2 math worksheets (PDF). Addition, subtraction, place value & word problems. Boost your child's confidence with fun, printable 2nd-grade worksheets.",
    content: "<Grade2MathWorksheetsBlog />",
    author: "Wizqo Team",
    date: "2025-01-15T12:00:00Z",
    readTime: "8-9 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Child working on grade 2 math worksheets with colorful pencils",
    keywords: "grade 2 math worksheets, free grade 2 math worksheets pdf, 2nd grade math worksheets, second grade math worksheets, printable grade 2 math worksheets, grade 2 math worksheets free, math worksheets for grade 2, addition worksheets grade 2, subtraction worksheets grade 2, place value worksheets grade 2, word problems grade 2"
  },

  {
    id: "what-are-cognitive-skills",
    title: "What Are Cognitive Skills? Strengthen Your Mind | Wizqo",
    excerpt: "Discover how cognitive skills shape focus, memory, and confidence — plus free printable brain games and a 7-day challenge to help you think sharper and feel stronger.",
    content: "<CognitiveSkillsBlog />",
    author: "Wizqo Team",
    date: "2025-11-10T12:00:00Z",
    readTime: "6–7 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1623908277264-f123c5d7d441?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    imageAlt: "Brain and cognitive skills visualization",
    keywords: "cognitive skills, what are cognitive skills, memory training, attention exercises, brain training, cognitive development, working memory, executive function, processing speed, visual processing, cognitive flexibility, brain games, printable brain exercises"
  },
  {
    id: "handwriting-without-tears-infographic",
    title: "Handwriting Without Tears: Science-Backed Method | Wizqo",
    excerpt: "Writing used to be an art — not an anxiety. Handwriting Without Tears turns handwriting into a calm, structured, evidence-based practice that rebuilds confidence one letter at a time.",
    content: "<HWTInfographic />",
    author: "Wizqo Team",
    date: "2025-10-15T12:00:00Z",
    readTime: "8–9 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1613289720033-c79deb7d3fca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    imageAlt: "Handwriting practice tools laid out for step-by-step learning",
    keywords: "handwriting without tears, handwriting practice, handwriting worksheets, handwriting improvement, handwriting for kids, handwriting instruction, handwriting method, handwriting curriculum"
  },
  {
    id: "why-custom-name-tracing-works",
    title: 'Why Custom Name Tracing is the "Secret Code" to Teaching Your Child to Write',
    excerpt: 'Struggling to get your kindergartener to practice writing? Discover why "Custom Name Tracing" builds confidence and motor skills faster than generic worksheets.',
    content: `<NameTracingInfographic />`,
    author: "Wizqo Team",
    date: "2026-01-14",
    readTime: "4 min read",
    category: "Learning Tips",
    imageUrl: "/images/blog/name-tracing-hero-image.png",
    imageAlt: "Child writing their name with focus",
    keywords: "custom name tracing, name tracing worksheets, teach child to write name, free name tracing generator, kindergarten writing practice, preschool handwriting, personalized worksheets"
  },
  {
    id: "how-to-improve-handwriting",
    title: "How to Improve Your Child's Handwriting: A Parent's Complete Guide | Wizqo",
    excerpt: "Struggling with messy handwriting? Learn expert tips, age-by-age milestones, and get free printable handwriting worksheets to help your child write better — from preschool tracing to full sentences.",
    content: "<HandwritingPracticeBlog />",
    author: "Wizqo Team",
    date: "2026-02-11T12:00:00Z",
    readTime: "7-8 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Child practicing handwriting on a worksheet with colorful pencils",
    keywords: "how to improve handwriting, handwriting practice for kids, free handwriting worksheets, preschool handwriting, kindergarten writing practice, letter tracing worksheets, handwriting worksheet generator, handwriting tips for kids, improve handwriting fast, free printable handwriting worksheets, name tracing worksheets, fine motor skills writing, handwriting worksheet maker free"
  },
  {
    id: "best-free-handwriting-worksheet-generators",
    title: "7 Best Free Handwriting Worksheet Generators (2026 Comparison)",
    excerpt: "We tested every major free handwriting worksheet generator so you don't have to. Here's our honest comparison — with pros, cons, and our top pick for parents and teachers.",
    content: "<HandwritingGeneratorComparisonBlog />",
    author: "Wizqo Team",
    date: "2026-02-12T12:00:00Z",
    readTime: "8-9 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Child writing on a worksheet with colorful markers and pencils",
    keywords: "best free handwriting worksheet generator, handwriting worksheet maker comparison, free handwriting generator 2026, handwriting practice generator free, tracing worksheet generator comparison, best worksheet maker for kids, free printable handwriting worksheets generator, custom handwriting worksheets free, name tracing generator free, handwriting worksheet generator no signup"
  },
  {
    id: "free-printable-name-tracing-worksheets-preschool",
    title: "10 Free Printable Name Tracing Worksheets for Preschool (PDF)",
    excerpt: "Teaching your child to write their name is one of the first big milestones. Here are 10 creative name tracing worksheet ideas — plus a free generator to make your own.",
    content: "<NameTracingWorksheetsBlog />",
    author: "Wizqo Team",
    date: "2026-02-12T14:00:00Z",
    readTime: "7-8 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Preschool child tracing their name on a worksheet with colorful crayons",
    keywords: "name tracing worksheets preschool free printable, free name tracing generator, printable name tracing worksheets for kindergarten, name writing practice sheets free, custom name tracing worksheets, preschool name writing worksheets pdf, free name tracing worksheets for preschoolers, personalized name tracing sheets free, name tracing practice for kids, toddler name writing worksheets free"
  }
];
