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
  }
];
