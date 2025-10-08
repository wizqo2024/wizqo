import React, { useEffect, useMemo, useState } from 'react';
import { SEOMetaTags } from '../components/SEOMetaTags';
import { UnifiedNavigation } from '../components/UnifiedNavigation';
import { Footer } from '../components/Footer';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
}

// Default cover images per category + generic fallback
const CATEGORY_IMAGES: Record<string, string> = {
  'Learning Tips': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  'Mental Wellness': 'https://wizqo.com/og-image.jpg',
  'Creative Arts': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'
};
const GENERIC_BLOG_IMAGE = 'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1600&q=80';

function getPostImage(post: BlogPost): string {
  return post.imageUrl || CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE;
}

function getPostRating(post: BlogPost): string {
  const key = (post.id || post.title || '').toString();
  let hash = 0 >>> 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) >>> 0; // djb2 variant
  }
  const choices = [4.6, 4.7, 4.8, 4.9];
  const rating = choices[hash % choices.length];
  return rating.toFixed(1);
}

// Base posts (inline)
const basePosts: BlogPost[] = [
  {
    id: "easy-hobbies-that-make-you-smarter",
    title: "Easy Hobbies That Make You Smarter (Backed by Science)",
    excerpt: "Discover 10 simple, science-backed hobbies that boost memory, focus, creativity, and overall brain health—no fancy gear required.",
    content: `We usually think of hobbies as “just for fun,” right? Something to do when you’re bored, stressed, or trying to escape work. But here’s the cool part: some easy hobbies can actually make you smarter.

![Chess board with pieces in play](https://images.unsplash.com/photo-1542587228-2d9950b773df?auto=format&fit=crop&w=1600&q=80 "Strategic thinking with chess")

No, really — science backs this up. Whether it’s playing a quick game of chess, doodling in a notebook, or learning a few new words in another language, these little activities can give your brain the workout it craves.

Let’s dive into some simple, low-effort hobbies that not only keep you entertained but also boost your brainpower.

Why Easy Hobbies Are Brain Boosters

Think of your brain like a muscle — the more you use it in different ways, the stronger it gets. The right hobbies can:

• Sharpen your memory
• Improve focus and creativity
• Reduce stress (goodbye, burnout!)
• Even make problem-solving feel easier

And the best part? These hobbies are simple. You don’t need fancy equipment, years of training, or tons of money to get started.

10 Easy Hobbies That Make You Smarter
1. Playing Chess

Chess is like the ultimate brain gym. It makes you think ahead, plan strategies, and adapt quickly. Don’t worry if you’re a total beginner — free apps make it super easy to practice. Ten minutes a day can make a difference.

2. Journaling

Got a notebook? Then you’ve got everything you need. Writing a few lines about your day helps improve memory and emotional intelligence. Plus, it’s one of the most therapeutic hobbies out there.

3. Learning Music

Ever strummed a guitar or tried tapping out beats on a table? Music activates multiple parts of your brain at once. That’s why musicians often score higher in creativity and problem-solving tests. Bonus: it’s a stress-buster.

4. Reading

The oldest trick in the book (pun intended). Whether it’s novels, blogs, or even short articles, reading expands your vocabulary, keeps your mind sharp, and improves focus.

5. Solving Puzzles

Crosswords, Sudoku, Wordle — whatever tickles your brain. Puzzles are proven to improve memory and delay mental decline. Plus, that little “aha!” moment when you solve one? Pure dopamine.

6. Cooking New Recipes

Cooking isn’t just about food. It teaches patience, creativity, and problem-solving — especially when you don’t have all the ingredients. Trying something new in the kitchen is a fun way to challenge your brain (and your taste buds).

7. Gardening

It might seem like “just planting stuff,” but gardening improves focus, patience, and mindfulness. Studies show it reduces stress too. And hey, fresh herbs for dinner? Yes, please.

8. Meditation & Mindfulness

Meditation is like decluttering your brain. Just 10 minutes of mindful breathing can improve focus, memory, and decision-making. It’s one of those hobbies where you notice results in all areas of life.

9. Drawing or Painting

You don’t have to be Picasso to grab a pencil and doodle. Art stimulates creativity and helps your brain form new connections. It’s also ridiculously calming after a long day.

10. Learning a New Language

This one is a powerhouse. Even learning a few words daily in Spanish, French, or Japanese can boost memory and keep your brain sharp. Apps like Duolingo make it easy (and kinda addictive).

How to Pick the Right Hobby for You

Not every hobby will click with you, and that’s okay. Here’s a quick cheat sheet:

• Go for something you actually enjoy (not just “what sounds smart”).
• Start small — 10 minutes is enough.
• Pick hobbies that fit your lifestyle. Love being outside? Try gardening. Prefer indoors? Go with journaling or puzzles.
• Mix it up! Balance fun hobbies with productive ones.

Final Thoughts — Smarter Living Can Be Fun

The truth is, you don’t need expensive courses or complicated routines to boost your brain. Sometimes, the simplest hobbies — like doodling, playing chess, or reading a few pages — can give you the biggest long-term benefits.

![Open journal with pen on desk](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80 "Journaling boosts clarity and memory")

So, which one of these easy hobbies will you try first? Start small, stay consistent, and who knows — your “just for fun” activity might turn into your secret weapon for success.

👉 Share this with a friend who wants to get smarter while having fun!

FAQs About Easy Hobbies

1. What’s the easiest hobby to start at home?
Reading or journaling. All you need is a book or a notebook.

2. Do hobbies really make you smarter?
Yep! Science shows activities like chess, music, and puzzles improve memory and cognitive skills.

3. Which hobbies improve focus the most?
Meditation, reading, and playing strategy games like chess.

4. How long should I spend on a hobby each day?
Even 15 minutes a day can give your brain a solid workout.

5. Can hobbies help with stress?
Absolutely — hobbies like gardening, journaling, and art are proven stress relievers.`,
    author: "Wizqo Team",
    date: "October 2025",
    readTime: "6–7 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Books, chess, and sketchbook on a desk representing smart hobbies"
  },
  {
    id: "relaxing-hobbies",
    title: "🌿 Relaxing Hobbies to Calm Your Mind and Refresh Your Mood",
    excerpt: "Feeling stressed? Discover relaxing hobbies that calm your mind and refresh your mood — simple ideas anyone can start today.",
    content: `🧘 When Was the Last Time You Truly Relaxed?

If your brain feels like it’s running on 87 open tabs, these relaxing hobbies help you hit pause and reset — no special gear needed.

1. Slow Stitching — Mindfulness You Can Hold in Your Hands
✅ Therapy-like calm with needle and thread.
💡 Start with scrap fabric and random patterns.
![Slow stitching](https://images.unsplash.com/photo-1527254435198-6a952d2ed8c2?auto=format&fit=crop&w=1600&q=80 "Hands sewing colorful thread into fabric")

2. Sound Journaling — Your Ears Know Peace
✅ Record calming sounds; replay to soften stress.
💡 Make a “sound diary” on your phone.
![Sound journaling](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80 "Phone recording ambient sounds on a window ledge")

3. Mini Gardening — Tiny Plants, Big Calm
✅ Care builds patience and small wins.
💡 Start with basil or mint indoors.
![Mini gardening](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80 "Small jar with sprouting herbs")

4. Doodle Meditation — Draw Your Stress Away
✅ Move your hand, let your mind breathe.
💡 One-minute no‑lift line doodles; try Zentangle.
![Doodle meditation](https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80 "Notebook of abstract doodles")

5. Cloudspotting — The Lost Art of Doing Nothing
✅ Reconnect with stillness (free!).
💡 Watch the sky; breathe.
![Cloudspotting](https://images.unsplash.com/photo-1529336953121-ad5a0d43d0ee?auto=format&fit=crop&w=1600&q=80 "Watching the sky on the grass")

6. Candle Making — Melt Stress Away
✅ Grounding, sensory, peaceful.
💡 Try a kit or upcycle wax; add lavender.
![Candle making](https://images.unsplash.com/photo-1541961017774-2034504a1262?auto=format&fit=crop&w=1600&q=80 "Homemade candle cooling on a desk")

7. Puzzle Time — Solving Stress Piece by Piece
✅ Focus without screens; frame finished puzzles.
💡 Start with 300–500 pieces.
![Puzzle time](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80 "Jigsaw puzzle at a cozy table")

🔗 Internal Links
• Cheap Hobbies You Can Start at Home → [/blog/cheap-hobbies-at-home]
• Outdoor Hobbies to Refresh Your Mind → [/blog/outdoor-hobbies-for-students]
`,
    author: "Wizqo Team",
    date: "2025-10-06",
    readTime: "5–6 min read",
    category: "Mental Wellness",
    imageUrl: "https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Relaxing hobbies collage on a calm desk"
  },
  {
    id: "cheap-hobbies-at-home",
    title: "🎉 Bored? Try These Cheap Hobbies at Home for Instant Fun",
    excerpt: "Feeling bored? Discover cheap hobbies at home that are fun, unique, and productive — all without breaking the bank.",
    content: `😴 The Problem: Why We Get Bored So Easily

Let’s be honest. We’ve all been there — sitting at home, refreshing Instagram, scrolling TikTok, and thinking: “I’m so bored, but I don’t want to spend money.”

Here’s the truth: boredom isn’t a lack of things to do. It’s a lack of fun, fresh ideas. The good news? You don’t need to spend a fortune to enjoy yourself. All you need are some cheap hobbies that are fun, productive, and surprisingly rewarding.

Below are hobby ideas you may not have tried yet — quirky, creative, and guaranteed to make your free time way more exciting.

1. 🎨 Doodle Like a Scientist: Zentangle Drawing

Forget random scribbles — Zentangle is a type of structured doodling that’s part art, part stress relief. All you need is a pen and paper, and suddenly you’re creating complex-looking designs without being “good at drawing.”

✅ Why it’s awesome: Boosts focus, relaxes the mind, and looks super aesthetic.
💡 Extra tip: Post your creations on Instagram with #zentangle — you’ll be surprised how many people share the same hobby.

![Zentangle doodle drawing](https://source.unsplash.com/1600x900/?zentangle,pattern,black-and-white&sig=201 "Zentangle-style doodles for mindful drawing at home")

2. 🥬 Grow a Mini Salad Garden in a Jar

Think gardening is expensive? Not if you recycle jars and use seeds from your kitchen (like tomato, coriander, or even chickpeas). Watching tiny sprouts turn into food is strangely satisfying.

✅ Why it’s awesome: Teaches patience, responsibility, and gives you free herbs for your noodles.
💡 Extra tip: Track your plant’s growth with daily photos — turn it into a mini time-lapse project.

![Herbs growing in jars](https://source.unsplash.com/1600x900/?indoor-garden,jar,herbs&sig=202 "Growing herbs in jars on a desk")

3. 📖 Write Micro-Stories in 6 Words

Hemingway once wrote: “For sale: baby shoes, never worn.” Just six words, but a full story. Why not try your own? Micro-stories are quick, creative, and need zero equipment except your brain.

✅ Why it’s awesome: Sharpens creativity, storytelling, and writing skills.
💡 Challenge yourself: Write 5 different six-word stories in 10 minutes.

![Six-word story in a notebook](https://source.unsplash.com/1600x900/?notebook,writing,story&sig=203 "Six-word story writing as a creative hobby")

4. 🧩 Make Your Own Puzzle Challenges

No puzzles at home? No problem. Cut up an old magazine cover or a printed photo into random pieces and challenge yourself (or your family) to put it back together.

✅ Why it’s awesome: Improves problem-solving and memory while being ridiculously cheap.
💡 Extra twist: Make a puzzle exchange with friends — everyone creates one and swaps.

![DIY puzzle pieces](https://source.unsplash.com/1600x900/?puzzle,craft,magazine&sig=204 "DIY jigsaw puzzle pieces made from a magazine cover")

5. 🥁 Learn Rhythms on Everyday Objects

No drum kit? Use a table, box, or even pots and pans. Rhythm practice is a fun stress-buster and can secretly make you the star at group hangouts.

✅ Why it’s awesome: Improves coordination and brain timing — musicians call it “cross-training” for the mind.
💡 Extra tip: Try following free rhythm tutorials on YouTube.

![Tapping rhythms on a desk](https://source.unsplash.com/1600x900/?rhythm,drums,desk&sig=205 "Practicing rhythms with everyday objects at home")

6. 🎭 Lip-Sync Theater (Yes, Seriously)

Pick a famous speech, movie scene, or even a TED Talk and lip-sync it dramatically in front of a mirror. Sounds silly? It’s actually a killer exercise in confidence, expression, and memory.

✅ Why it’s awesome: Builds public speaking skills without the stress.
💡 Extra twist: Record a 30-second lip-sync performance and share it with friends for laughs.

![Practicing acting in a mirror](https://source.unsplash.com/1600x900/?acting,mirror,theatre&sig=206 "Lip-sync acting practice to boost confidence")

7. 🎮 Create Your Own Board Game

Got some cardboard, markers, and dice (or even a coin)? That’s all you need to design your own board game. Start simple, test it with friends, and see who gets hooked.

✅ Why it’s awesome: Sharpens creativity, logic, and storytelling.
💡 Extra tip: Make “house rules” that change every round for endless variety.

![DIY board game with markers and dice](https://source.unsplash.com/1600x900/?board-game,dice,markers&sig=207 "Designing a simple DIY board game at home")

🌟 Why Cheap Hobbies Work Better Than Expensive Ones

When you strip away fancy gear or costs, you’re left with pure creativity. Cheap hobbies force you to think outside the box, make do with what you already have, and have fun without pressure.

👉 Plus, research shows hobbies reduce stress, improve focus, and boost confidence — whether you spend AED 0 or AED 500.

📌 Key Takeaways

Boredom doesn’t mean you need money — it means you need ideas.

Cheap hobbies like zentangle drawing, gardening in jars, and six-word stories can be as rewarding as expensive ones.

The trick is to start small and just play. You’ll be surprised how much fun “cheap” can be.

❓ FAQs on Cheap Hobbies at Home

1. What is the cheapest hobby?
Writing, doodling, or exercising with bodyweight — all free.

2. Can cheap hobbies still be productive?
Yes! Many build skills, creativity, and even future careers.

3. What hobbies are free but fun?
Journaling, puzzles, stargazing, DIY crafts, and photography walks.

4. What cheap hobbies are good for students?
Zentangle, growing herbs, board game design, and rhythm practice.

5. How do I start a hobby without spending money?
Look around your home — paper, pens, boxes, or old magazines are all you need to start.

🔗 Related Reads on Wizqo

• Productive hobbies at home → [/blog?post=productive-hobbies-for-students]
• Outdoor hobbies for weekends → [/blog?post=outdoor-hobbies-for-students]
• Micro journaling guide → [/blog?post=micro-journaling-habit]
• Find a hobby that sticks → [/blog?post=find-hobby-that-sticks]
`,
    author: "Wizqo Team",
    date: "2025-10-06",
    readTime: "5–6 min read",
    category: "Learning Tips",
    imageUrl: "https://source.unsplash.com/1600x900/?creative,desk,hobbies&sig=200",
    imageAlt: "Cheap hobbies at home: creative desk with doodles, plants, and notebook"
  },
  {
    id: "productive-hobbies-for-students",
    title: "7 Productive Hobbies for Students That Actually Make You Smarter",
    excerpt: "7 fun, productive hobbies for students that boost creativity, focus, and confidence — backed by science and easy to start.",
    content: `🎯 Why Students Need Productive Hobbies
Let’s be real: after school, most of us end up scrolling TikTok or bingeing Netflix. Fun? Yes. Helpful? Not really. That’s where productive hobbies come in — hobbies that not only kill boredom but also make you smarter, calmer, and more creative.

Research even shows that hobbies improve mental health, memory, and problem-solving skills. So instead of wasting hours on random scrolling, why not try something fun and meaningful?

Here are 7 hobbies that students can start right away — no big budget or fancy equipment needed.

![Geocaching app with hidden points](https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1600&q=80 "Geocaching adventure for students — a productive hobby outdoors")

1. Geocaching: Tech-Powered Treasure Hunting 🗺️
Geocaching is like a real-world treasure hunt powered by GPS. Using your smartphone, you track down hidden “geocaches” left in parks, neighborhoods, or even cities.

✅ Why it’s productive: Sharpens map-reading, problem-solving, and teamwork skills — all while getting you outdoors.
✨ Mini story: A group of high school friends in Dubai turned weekends into mini expeditions, competing to see who could find caches the fastest. They said it felt like “Pokémon Go, but smarter.”
💡 How to start: Download a geocaching app, choose an easy beginner location, and head out with friends. Every find feels like a mini victory.

![Calligraphy notebook and brush pens](https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80 "Calligraphy hobby for students to boost focus and creativity")

2. Calligraphy & Hand Lettering: Art with Impact ✒️
Forget boring doodles — calligraphy is art with purpose. It trains focus, patience, and creativity, plus the results look amazing (think: cards, posters, or custom notebook covers).

✅ Why it’s productive: Improves fine motor skills, enhances mindfulness, and gives students a unique creative edge.
✨ Real-life example: A student started practicing hand lettering during study breaks — within 6 months, she was making custom notebook covers for friends and even selling designs on Instagram.
💡 How to start: Grab a pen and paper, follow a YouTube tutorial, and start with simple alphabet strokes.

![Tiny jars with herbs sprouting on a desk](https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80 "Micro-gardening as a productive hobby for students indoors")

3. Micro-Gardening: Green Thumbs in Small Spaces 🌱
No yard? No problem. With micro-gardening, students can grow herbs, succulents, or even microgreens right on a windowsill.

✅ Why it’s productive: Teaches responsibility, patience, and sustainable living — while rewarding you with fresh snacks.
✨ Mini story: A 14-year-old planted mint in a jar on her desk. Weeks later, she proudly brewed her own mint tea during exams, calling it her “study fuel.”
💡 How to start: Reuse jars or containers, start with easy herbs like basil or mint, and water lightly.

![Student coding a simple Scratch project](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80 "Coding projects as productive hobbies for students")

4. Coding Mini Projects 💻
Coding isn’t just for techies. From building a personal website to making a simple game, students can turn free time into a future-ready skill.

✅ Why it’s productive: Improves logical thinking, problem-solving, and digital literacy.
💡 How to start: Try free platforms like Scratch, Code.org, or Codecademy for beginner-friendly lessons.

![Student solving a jigsaw puzzle](https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1600&q=80 "Brain games and puzzles as productive hobbies for students")

5. Puzzle-Solving & Brain Games 🧩
From Sudoku to escape rooms, puzzles sharpen your brain while keeping boredom away.

✅ Why it’s productive: Boosts critical thinking, memory, and problem-solving — skills you’ll use in exams and life.

![Students cleaning a park together](https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=1600&q=80 "Volunteering as a productive hobby for students")

6. Volunteering: Give Back, Gain Skills 🤝
Helping others is one of the most rewarding hobbies. Students can tutor younger kids, help in community clean-ups, or assist in local events.

✅ Why it’s productive: Builds leadership, empathy, and teamwork — qualities universities and employers love.

![Journal, pen, and a calming study setup](https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=crop&w=1600&q=80 "Journaling as a simple productive hobby for students at home")

7. Journaling: Clarity in Minutes 📓
Short reflections each day help process thoughts, reduce stress, and sharpen focus — perfect for study breaks.

✅ Why it’s productive: Builds self-awareness, improves mood, and supports better decision-making.
💡 How to start: Try micro-journaling — write 1–3 sentences about your day or one win. Keep it easy and consistent.

📌 Key Takeaways
• Productive hobbies = fun + skill-building + confidence boost.
• Geocaching, calligraphy, and gardening make learning exciting.
• Coding, journaling, puzzles, and volunteering prepare you for school and beyond.

👉 Start small — pick one hobby this week. You’ll be surprised how fast it grows into a passion.

❓ FAQs About Productive Hobbies
1. What are the most productive hobbies for students?
Geocaching, calligraphy, gardening, coding, puzzles, journaling, and volunteering.
2. Which hobbies improve focus?
Calligraphy, journaling, and puzzles are excellent for concentration.
3. What hobbies are cheap to start?
Calligraphy and micro-gardening can be started with less than AED 10.
4. Can hobbies really improve grades?
Yes! They boost focus, creativity, and problem-solving skills — all useful in academics.
5. What is the easiest productive hobby to start at home?
Journaling or micro-gardening. Both need minimal setup.

🔗 Related Reads on Wizqo
• Boost creativity with simple daily habits → [/blog?post=find-hobby-that-sticks]
• Micro journaling guide for busy students → [/blog?post=micro-journaling-habit]
`,
    author: "Wizqo Team",
    date: "2025-10-02",
    readTime: "6–7 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Productive hobbies for students"
  },
  {
    id: "outdoor-hobbies-for-students",
    title: "9 Outdoor Hobbies for Students That Beat Boredom (and Make You Smarter)",
    excerpt: "Discover 9 fun and productive outdoor hobbies for students that boost focus, creativity, and health — perfect alternatives to screen time.",
    content: `🎯 The Problem: Why Students Need Outdoor Hobbies

If you’re a student, you probably know the routine: school → homework → phone → repeat. Most free time gets swallowed by endless scrolling or gaming marathons. Fun? Sure. But after hours online, you often feel more tired than before.

That’s the trap of passive hobbies. What you really need are outdoor hobbies — the kind that wake up your body, refresh your mind, and actually leave you happier. And the best part? Many of them solve real problems students face: stress, low energy, boredom, or even lack of focus in class.

Let’s explore 9 outdoor hobbies that not only keep boredom away but also make you sharper, healthier, and more confident.

![Teens smiling in a park](https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1600&q=80 "Outdoor hobbies for students in a park")

1. Geocaching: Modern-Day Treasure Hunting 🗺️

Think treasure maps, but powered by GPS. Geocaching turns any park into an adventure, where you search for hidden containers (“geocaches”).

✅ Problem it solves: Screen addiction → replaces endless scrolling with active exploration.
💡 How to start: Download a free geocaching app, choose a beginner location, and go treasure-hunting with friends.

![Students checking a geocaching app outside](https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1600&q=80 "Geocaching as a fun outdoor hobby for students")

2. Frisbee or Disc Golf 🥏

Forget the usual football or cricket. Frisbee (or its big brother, disc golf) is an easy-to-learn, active game you can play almost anywhere.

✅ Problem it solves: Lack of physical activity → keeps you moving without needing expensive gear.
💡 How to start: Grab a frisbee for less than AED 20 and hit the nearest park.

![Students tossing a frisbee](https://images.unsplash.com/photo-1512551980832-13fd66915f4a?auto=format&fit=crop&w=1600&q=80 "Outdoor frisbee hobby for students")

3. Urban Gardening 🌱

Yes, gardening counts as outdoor fun — even if it’s just pots on your balcony. Students can grow herbs, flowers, or even tiny veggies in recycled containers.

✅ Problem it solves: Stress & low patience → teaches mindfulness, responsibility, and the joy of nurturing life.
💡 How to start: Begin with easy plants like mint, basil, or succulents. Water lightly and watch them grow.

![Student watering herbs on a balcony](https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80 "Urban gardening outdoor hobby for kids and students")

4. Cycling Adventures 🚴

Cycling isn’t just exercise — it’s freedom. Exploring new routes, biking with friends, or even joining a cycling club can make weekends exciting.

✅ Problem it solves: Boredom with routine → adds adventure and fitness.
💡 How to start: Borrow or buy a basic bike, pick safe routes, and track your rides with apps like Strava.

![Group of students cycling](https://images.unsplash.com/photo-1495526968767-e49356d669fb?auto=format&fit=crop&w=1600&q=80 "Cycling as a productive outdoor hobby for students")

5. Photography Walks 📸

Combine art + outdoors by capturing interesting shots of parks, sunsets, or even street life. With smartphones, anyone can start.

✅ Problem it solves: Feeling uninspired → teaches you to look at your surroundings in new, creative ways.
💡 How to start: Set a theme (e.g., “things that are blue”) and take 10 photos on a short walk.

![Student photographing flowers outdoors](https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80 "Outdoor photography hobby for teenagers")

6. Team Sports with a Twist 🏀⚽

Not everyone enjoys formal PE or competitive matches. Try casual versions: 3‑on‑3 basketball, backyard cricket, or “no‑rules” football with friends.

✅ Problem it solves: Feeling isolated → builds teamwork, friendships, and confidence.
💡 How to start: Set small goals (like “first to 5 baskets”) to keep it fun and low‑pressure.

![Casual outdoor basketball](https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1600&q=80 "Team sports as fun outdoor hobbies for students")

7. Stargazing 🌌

Not all outdoor hobbies need daylight. Stargazing connects science and wonder — perfect for curious students.

✅ Problem it solves: Stress and overthinking → gives perspective, calm, and curiosity about the universe.
💡 How to start: Use a free stargazing app (like SkyView) and head to a dark spot at night.

![Teen looking at stars on a blanket](https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80 "Stargazing outdoor hobby for students")

8. Volunteer Clean‑Ups 🤝

Turn free time into impact. Park clean‑ups, beach cleaning, or helping plant trees all count as outdoor hobbies.

✅ Problem it solves: Feeling powerless or “just wasting time” → builds responsibility, purpose, and leadership.
💡 How to start: Join a local community initiative or create your own mini‑clean‑up with friends.

![Students cleaning a park](https://images.unsplash.com/photo-1520975682031-a4c2a0d43c66?auto=format&fit=crop&w=1600&q=80 "Park clean-up volunteering for students")

9. Hiking & Nature Trails 🌳

Exploring nature is the ultimate reset button. Hiking helps you escape routines, clear your head, and improve fitness.

✅ Problem it solves: Academic stress → hiking reduces cortisol (stress hormone) and boosts energy.
💡 How to start: Choose easy beginner trails, carry water/snacks, and invite a buddy.

![Students hiking a forest trail](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80 "Hiking as a productive outdoor hobby for students")

📌 Key Takeaways

• Outdoor hobbies = fun + problem‑solving + real benefits.

• From geocaching and frisbee to gardening and hiking, each activity builds skills while reducing stress.

• The best hobby isn’t the fanciest — it’s the one you’ll actually enjoy and stick with.

👉 Instead of asking “What should I do this weekend?” — pick one hobby, grab a friend, and start creating better memories than your phone screen ever could.

❓ FAQs on Outdoor Hobbies for Students

1. What are the best outdoor hobbies for students?
Geocaching, frisbee, gardening, cycling, and hiking are great starters.

2. Which outdoor hobbies are cheap?
Frisbee, photography walks, stargazing, and volunteering cost little to nothing.

3. Can outdoor hobbies improve school performance?
Yes — they reduce stress, improve focus, and build problem‑solving skills.

4. What outdoor hobbies are good for mental health?
Gardening, stargazing, hiking, and photography walks are excellent.

5. How often should students practice outdoor hobbies?
Even 1–2 hours per week makes a noticeable difference in mood and focus.

🔗 Related Reads on Wizqo

• Productive hobbies at home → [/blog?post=productive-hobbies-for-students]
• Find a hobby that sticks → [/blog?post=find-hobby-that-sticks]
• Micro journaling guide → [/blog?post=micro-journaling-habit]
`,
    author: "Wizqo Team",
    date: "2025-10-02",
    readTime: "7–8 min read",
    category: "Learning Tips",
    imageUrl: "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Group of students outside enjoying a park day"
  },
  
  {
    id: "find-hobby-that-sticks",
    title: "How to Find a Hobby That Sticks: A Simple 7-Day AI-Powered Plan",
    excerpt: "Ever picked up a hobby with excitement—only to drop it by the weekend? Learn how to find a hobby that truly fits your lifestyle with an easy, AI-powered 7-day plan.",
    content: `Ever picked up a hobby with excitement—only to drop it by the weekend?

You're not alone. Life gets chaotic. Motivation fades. And suddenly, that new guitar, journal, or watercolor kit is collecting dust.

Here's the truth: Sticking with a hobby isn't about discipline. It's about design—of your time, your energy, and your mindset. And in 2025, we finally have a tool to help: AI.

Why Most Hobbies Fail After a Few Days

• Too many options, not enough clarity
• No routine or structure  
• We chase the idea of a hobby—not the feeling it gives
• Life takes over. Again.

But what if you had a smart system that guided you step-by-step, based on your actual lifestyle? That's where AI flips the game.

How AI Makes Hobbies Stick (When Motivation Doesn't)

Platforms like Wizqo use AI to create personalized 7-day hobby plans—based on your:
• Available time
• Energy and attention levels
• Interests and goals
• Mood and mental space

Think of it as your smart hobby coach. You get daily mini-challenges, motivational nudges, and adaptive feedback—all designed to build rhythm and reduce overwhelm.

Your 7-Day Plan to Lock In a Hobby You Love

Day 1: Filter the Noise
Instead of choosing from 100 hobbies, let AI help you narrow it down. You might think you want to learn photography, but your lifestyle might point to mini journaling or cooking short recipes.

Day 2–3: Start with Just 10 Minutes
Small wins = big momentum. Ten focused minutes of sketching, dancing, or typing beats "waiting for the perfect mood" every time. Let the habit grow, not just the ambition.

Day 4–5: Get AI Feedback & Adjust
Struggling to stay consistent? The AI adapts. It might shorten your tasks, suggest a new medium, or remind you why you started. No guilt. Just guidance.

Day 6: Reflect—Don't Compare
Ask: What gave you joy? What moment made you proud? The right hobby lifts you up. It's not a performance—it's a personal recharge. Let AI prompt reflection, not perfection.

Day 7: Build the Ritual
You've made it a week—now it's time to anchor the habit. Use habit tracking, daily reminders, and small rewards. This isn't about finishing. It's about continuing.

The Science: Why Hobbies Rewire Your Brain

Modern research (Harvard, Stanford) shows that engaging hobbies can:
• Lower stress and cortisol levels
• Boost dopamine (motivation + joy)
• Strengthen memory, focus, and mental flexibility

A hobby is not a luxury. It's a low-key life upgrade.

What Hobby Have You Always Wanted to Try?

Is it drawing? Cooking? Writing stories? Woodworking? Coding mini games? Don't overthink it. Let AI match your energy, not drain it.

Ready to Find a Hobby That Sticks?

Stop waiting for motivation to magically appear. Let Wizqo build your free 7-day hobby plan—personalized by AI, based on your life and energy.`,
    author: "Wizqo Team",
    date: "January 2025",
    readTime: "5 min read",
    category: "Learning Tips"
  },
  {
    id: "micro-journaling-habit",
    title: "Micro Journaling: The 5-Minute Habit That's Changing Lives in 2025",
    excerpt: "Too busy to journal? Discover how micro journaling—just 5 minutes a day—can boost your mental clarity, reduce stress, and improve focus with AI-powered prompts.",
    content: `Too busy to journal? You're not alone.

In 2025, the world moves fast—so fast, we barely stop to think. But what if we told you that just 5 minutes of "micro journaling" could help you:
• Feel calmer
• Reduce decision fatigue
• Understand your emotions
• And even unlock creativity?

This isn't the bulky "dear diary" you tried in school. This is modern. Light. Digital. And it fits into the life you actually live.

What Is Micro Journaling?

Micro journaling is the habit of writing short reflections—just 1 to 5 sentences—every day. Instead of pouring out your soul for an hour, you ask yourself one meaningful question. You answer in under 2 minutes. You move on—with more clarity.

It's a micro habit that's exploding in popularity because it's:
• Low effort – takes 2–5 minutes
• Low pressure – no long essays or perfect grammar
• High return – measurable mental clarity and stress relief

Why It Works (Even When You're Burned Out)

According to psychologists, the brain loves short reflection loops. They build emotional regulation, increase self-awareness, and help declutter your mental space.

When you track a mood, name a thought, or celebrate a tiny win—you train your brain to feel safe, focused, and seen. And in 2025, tools like Wizqo let you do this with AI-powered journaling prompts—tailored to your mood and energy level.

5 Micro Journaling Prompts to Try Today

• What's one word to describe how I feel right now?
• What moment stood out to me today?
• What's one small thing I want to focus on tomorrow?
• What am I overthinking right now?
• What's something I'm quietly proud of?

These take less than 30 seconds each. But over a week, they build mental muscle that lasts.

Bonus: Pair Micro Journaling With AI

Platforms like Wizqo make micro journaling even easier by:
• Sending you 1 prompt per day based on your habits
• Tracking your responses and mood over time
• Helping you build a 7-day mental clarity plan

In just a few minutes a day, you can go from scattered to centered.

Micro Journaling = Micro Wins = Macro Peace

This isn't about becoming a productivity machine or writing a memoir. Micro journaling is about one small win a day:
• 1 idea captured
• 1 thought cleared
• 1 feeling named

It's a tiny anchor in a stormy day. And that's more than enough.

Ready to Try Micro Journaling?

Let AI do the heavy lifting. Get a 7-day guided journaling plan with Wizqo. All you do is answer 1 daily question—no overthinking, no stress.`,
    author: "Wizqo Team",
    date: "January 2025", 
    readTime: "4 min read",
    category: "Mental Wellness",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Notebook and pen for micro journaling"
  },
  {
    id: "easy-watercolor-paintings",
    title: "Easy Watercolor Paintings for Beginners – Inspiring Ideas You Can Try Today",
    excerpt: "Watercolor painting is one of the most accessible and calming creative hobbies you can start today. Discover 10 simple, fun watercolor painting ideas perfect for beginners.",
    content: `Watercolor painting is one of the most accessible and calming creative hobbies you can start today. Whether you're a complete beginner or just want a stress-free artistic escape, watercolor offers a gentle introduction with minimal supplies and big rewards.

Why Watercolor Is the Perfect Beginner Hobby

• Simple setup: All you need is water, paint, and paper. No fancy tools or studios required.
• Stress relief: Painting with watercolor is incredibly relaxing — perfect for unwinding after a busy day.
• Embrace imperfection: Mistakes don't ruin your work; they often add beautiful, unique effects.
• Creative freedom: Watercolor lets you experiment freely — no rigid rules, just flow.
• Social proof: According to a 2024 ArtHobby survey, over 80% of beginners found watercolor relaxing and easy to keep up during their first week of painting.

10 Easy Watercolor Painting Ideas to Try Today

1. Sunset Over Water
Use warm oranges, pinks, and purples to paint a soft sunset fading into the ocean. Add dark silhouettes of trees or boats for contrast.
Tip: Try wet-on-wet blending by moistening your paper before painting to get smooth color transitions.

2. Leaf Studies  
Paint simple leaf shapes in different greens. Focus on mixing colors rather than perfect details.
Time: 15-20 minutes — perfect for a quick creative break.

3. Abstract Color Blobs
Make fun, random color shapes. Once dry, add outlines or decorations with a fine brush or pen.
Great for: Playful experimentation!

4. Galaxy Sky
Blend deep blues, purples, and black to create a dreamy night sky. Flick white paint for stars.
Tip: Use wet-on-wet technique to let colors naturally blend and bleed.

5. Loose Florals
Paint soft, circular shapes for flowers like daisies or tulips, then add thin green stems and leaves.
Relaxing and rewarding!

6. Mountain Landscape
Layer light colors for distant mountains, then add darker tones in front to create depth.
Tip: Let each layer dry before painting the next.

7. Fruit Slices
Paint bright, bold shapes like watermelon or kiwi slices. Fun and simple!
Time: Just 10–15 minutes.

8. Floral Wreath
Paint a circular border of leaves and flowers, leaving space in the middle for a quote or design.
Tip: Lightly sketch your circle with pencil first.

9. Cactus in a Pot
Draw simple green cacti shapes and decorate a small pot underneath.
Great beginner project!

10. Cup of Tea or Coffee
Paint a warm-toned mug with curling steam lines, adding small details like a saucer or shadow.
Cozy and simple!

Beginner Watercolor Supplies and Costs

Getting started is easy and affordable. Here's a rough price guide for beginner supplies:
• Basic watercolor palette (12 colors): $5–$15
• Round brushes (medium and fine): $8–$20  
• Cold press watercolor paper (140gsm pad): $10–$25
• Extras (water jar, paper towels, pencil): $2–$5

Estimated total startup cost: $25–$65 — a small investment for a rewarding hobby!

Common Mistakes to Avoid (and How to Fix Them!)

• Using too much water: Can cause colors to puddle or paper to warp. Use less water or try blotting with a paper towel.
• Overworking the paper: Constant brushing can damage the surface. Let layers dry before adding more paint.
• Skipping pencil sketching: Light sketches can guide your painting and prevent frustration.
• Not experimenting: Fear of mistakes holds many back. Remember, watercolor loves happy accidents!
• Ignoring brush care: Clean brushes gently to keep them in good shape.

FREE 7-Day Watercolor Challenge — Stay Consistent and Inspired!

Need structure? Join a free 7-day watercolor challenge with:
• Daily painting prompts
• Beginner-friendly technique tips
• Easy projects to complete each day
• Encouragement to keep your creativity flowing

Just Start!

Don't wait until you're "ready" or think you need to be "good enough." Watercolor welcomes imperfection. Colors blend, lines blur, and each painting has its own unique beauty.

Take 15 minutes today. Grab your brush. See where the paint takes you. You don't have to be an artist — you just have to start.`,
    author: "Wizqo Team",
    date: "January 2025",
    readTime: "7 min read", 
    category: "Creative Arts"
  }
];

// Load Markdown posts from content folder (optional, SEO-safe)
function loadMarkdownPosts(): BlogPost[] {
  try {
    // Vite: import raw text
    // Resolve from Vite root (client): use absolute-from-root pattern
    // Try multiple roots to be robust across environments
    const modsA = import.meta.glob('/content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modsB = import.meta.glob('./content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modsC = import.meta.glob('../content/blog/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const modules = { ...modsA, ...modsB, ...modsC } as Record<string, string>;
    const posts: BlogPost[] = [];
    for (const [path, raw] of Object.entries(modules)) {
      const fmMatch = raw.match(/^---[\s\S]*?---/);
      const fmBlock = fmMatch ? fmMatch[0].replace(/^---|---$/g, '').trim() : '';
      const body = raw.replace(/^---[\s\S]*?---\s*/m, '');
      const meta: any = {};
      if (fmBlock) {
        for (const line of fmBlock.split('\n')) {
          const idx = line.indexOf(':');
          if (idx > -1) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
            meta[key] = value;
          }
        }
      }
      const fileSlug = path.split('/').pop()?.replace(/\.md$/, '') || `post-${Date.now()}`;
      const id = (meta.slug || fileSlug).toString();
      posts.push({
        id,
        title: meta.title || id,
        excerpt: meta.excerpt || '',
        content: body || '',
        author: meta.author || 'Wizqo Team',
        date: meta.date || new Date().toISOString().slice(0, 10),
        readTime: meta.readTime || '5 min read',
        category: meta.category || 'Learning Tips',
        imageUrl: meta.cover || undefined,
        imageAlt: meta.imageAlt || undefined,
      });
    }
    return posts;
  } catch {
    return [];
  }
}

export function BlogPage({ initialSlug, onNavigate }: { initialSlug?: string; onNavigate?: (path: string) => void }) {
  const mdPosts = useMemo(() => loadMarkdownPosts(), []);
  const allPosts: BlogPost[] = useMemo(() => {
    // Prefer Markdown posts when duplicates exist; then fallback to inline base posts
    const byId = new Map<string, BlogPost>();
    for (const p of basePosts) byId.set(p.id, p);
    for (const p of mdPosts) byId.set(p.id, p);
    const merged = Array.from(byId.values());
    merged.sort((a, b) => {
      const da = Date.parse(a.date || '') || 0;
      const db = Date.parse(b.date || '') || 0;
      return db - da;
    });
    return merged;
  }, [mdPosts]);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {}
  };
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  // Preselect post from URL query (?post=slug)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('post');
      if (!pid) return;
      const found = allPosts.find(p => p.id === pid);
      if (found) setSelectedPost(found);
    } catch {}
  }, [allPosts]);

  // Preselect post from pretty URL slug (/blog/:slug)
  useEffect(() => {
    if (!initialSlug) return;
    const found = allPosts.find(p => p.id === initialSlug);
    if (found) setSelectedPost(found);
  }, [initialSlug, allPosts]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call - in real implementation, this would integrate with email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive our latest hobby guides and AI insights in your inbox.",
        variant: "default"
      });
      
      setNewsletterEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (selectedPost) {
    const coverUrl = getPostImage(selectedPost) || GENERIC_BLOG_IMAGE;
    const usedImageUrls = new Set<string>([coverUrl]);
    const ALT_GENERIC_IMAGE = 'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0ee?auto=format&fit=crop&w=1600&q=80';
    const pickFallback = (primaryUrl?: string) => {
      const pool = [primaryUrl, CATEGORY_IMAGES[selectedPost.category], GENERIC_BLOG_IMAGE, ALT_GENERIC_IMAGE].filter(Boolean) as string[];
      for (const candidate of pool) {
        if (!usedImageUrls.has(candidate)) {
          usedImageUrls.add(candidate);
          return candidate;
        }
      }
      return pool[pool.length - 1];
    };
    return (
      <div className="min-h-screen bg-slate-50">
        <SEOMetaTags 
          title={selectedPost.title}
          description={selectedPost.excerpt}
          ogImage={selectedPost.imageUrl}
          canonicalUrl={`https://wizqo.com/blog/${selectedPost.id}`}
        />
        {/* SEO JSON-LD: Article and Breadcrumbs */}
        {(() => {
          const canonical = `https://wizqo.com/blog/${selectedPost.id}`;
          const image = selectedPost.imageUrl || CATEGORY_IMAGES[selectedPost.category] || GENERIC_BLOG_IMAGE;
          const articleLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: selectedPost.title,
            description: selectedPost.excerpt,
            image: [image],
            author: { "@type": "Organization", name: "Wizqo" },
            publisher: { "@type": "Organization", name: "Wizqo" },
            datePublished: selectedPost.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": canonical }
          } as any;
          const breadcrumbLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Blog", item: "https://wizqo.com/blog" },
              { "@type": "ListItem", position: 2, name: selectedPost.title, item: canonical }
            ]
          };
          return (
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            </>
          );
        })()}
        <UnifiedNavigation currentPage="blog" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => { setSelectedPost(null); navigateTo('/blog'); }}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
            >
              ← Back to Blog
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  try {
                    const url = `https://wizqo.com/blog/${selectedPost.id}`;
                    const title = selectedPost.title;
                    const text = selectedPost.excerpt || title;
                    if (navigator.share) {
                      await navigator.share({ title, text, url });
                      toast({ title: "Shared", description: "Thanks for sharing!" });
                    } else if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(url);
                      toast({ title: "Link copied", description: "Blog link copied to clipboard." });
                    } else {
                      window.open(url, '_blank');
                    }
                  } catch (e) {
                    toast({ title: "Share failed", description: "Please try again or copy the link.", variant: "destructive" });
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
          
          <article className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl">
            <div className="mb-8">
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {selectedPost.readTime}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {selectedPost.title}
              </h1>
              <figure className="mb-6">
                <img 
                  src={coverUrl} 
                  alt={selectedPost.imageAlt || selectedPost.title} 
                  width={1600}
                  height={640}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl border border-slate-200"
                  onError={(e) => {
                    const img = (e.currentTarget as HTMLImageElement);
                    const next = CATEGORY_IMAGES[selectedPost.category] || GENERIC_BLOG_IMAGE;
                    if (img.src !== next) {
                      img.src = next;
                    }
                  }}
                />
                {selectedPost.imageAlt && (
                  <figcaption className="text-sm text-slate-500 mt-2">{selectedPost.imageAlt}</figcaption>
                )}
              </figure>
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg text-slate-600">By {selectedPost.author}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">({getPostRating(selectedPost)})</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-slate-700 font-medium leading-relaxed">
                  {selectedPost.excerpt}
                </p>
              </div>
              
              {/* Table of Contents */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Table of Contents
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.content.split('\n')
                    .filter(paragraph => {
                      const p = paragraph.trim();
                      return (
                        /^\d+\./.test(p) || /\b\d+\./.test(p) || // supports emoji before number
                        p.includes('Why Students Need Productive Hobbies') ||
                        p.includes('Key Takeaways') ||
                        p.includes('FAQs About Productive Hobbies') ||
                        p.includes('Why Easy Hobbies Are Brain Boosters') ||
                        p.includes('10 Easy Hobbies') ||
                        p.includes('How to Pick the Right Hobby for You') ||
                        p.includes('Final Thoughts') ||
                        p.includes('FAQs About Easy Hobbies') ||
                        p.includes('Why Most Hobbies Fail') || p.includes('How AI Makes Hobbies') || p.includes('Your 7-Day Plan') || 
                        p.includes('What Is Micro Journaling') || p.includes('Why It Works') || p.includes('5 Micro Journaling Prompts') ||
                        p.includes('Why Watercolor Is') || p.includes('10 Easy Watercolor') || p.includes('Beginner Watercolor Supplies') ||
                        p.includes('Common Mistakes') || p.includes('FREE 7-Day') || p.includes('Just Start!') || 
                        p.includes('The Science:') || p.includes('What Hobby Have You') || p.includes('Ready to Find') || 
                        p.includes('Bonus: Pair Micro') || p.includes('Micro Journaling =') || p.includes('Ready to Try') ||
                        // Cheap hobbies article
                        p.includes('Why We Get Bored So Easily') ||
                        p.includes('Why Cheap Hobbies Work Better Than Expensive Ones') ||
                        p.includes('FAQs on Cheap Hobbies') || p.includes('FAQs on Cheap Hobbies at Home')
                      );
                    })
                    .map((paragraph, index) => {
                      const ptrim = paragraph.trim();
                      const headingId = ptrim.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      return (
                        <a 
                          key={index} 
                          href={`#${headingId}`}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          <span className="text-purple-400">→</span>
                          <span className="hover:underline">{ptrim}</span>
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {(() => {
                const lines = selectedPost.content.split('\n');
                let imageIdx = 0;

                const isMdImage = (s: string) => {
                  const raw = s.trim();
                  return /^!\[.*?\]\(.*\)$/.test(raw);
                };

                const isSectionHeading = (s: string) => {
                  return (
                    s.includes('Day 1:') || s.includes('Day 2') || s.includes('Day 3') || s.includes('Day 4') || s.includes('Day 5') || s.includes('Day 6') || s.includes('Day 7') ||
                    s.includes('Why Students Need Productive Hobbies') || s.includes('10 Easy Hobbies') || s.includes('How to Pick the Right Hobby for You') || s.includes('Final Thoughts') || s.includes('FAQs About Easy Hobbies') ||
                    s.includes('Why Most Hobbies Fail') || s.includes('How AI Makes Hobbies') || s.includes('Your 7-Day Plan') ||
                    s.includes('What Is Micro Journaling') || s.includes('Why It Works') || s.includes('5 Micro Journaling Prompts') ||
                    s.includes('Why Watercolor Is') || s.includes('10 Easy Watercolor') || s.includes('Beginner Watercolor Supplies') ||
                    s.includes('Common Mistakes') || s.includes('FREE 7-Day') || s.includes('Just Start!') ||
                    s.includes('The Science:') || s.includes('What Hobby Have You') || s.includes('Ready to Find') ||
                    s.includes('Bonus: Pair Micro') || s.includes('Micro Journaling =') || s.includes('Ready to Try') ||
                    // Cheap hobbies headings
                    s.includes('Why We Get Bored So Easily') || s.includes('Why Cheap Hobbies Work Better Than Expensive Ones') || s.includes('FAQs on Cheap Hobbies') || s.includes('FAQs on Cheap Hobbies at Home')
                  );
                };

                const convertInlineLinks = (text: string): string => {
                  let out = text;
                  // Pattern: Label → [/blog?post=slug] -> /blog/slug
                  out = out.replace(/([^\[]+?)\s*→\s*\[(\/blog\?post=([a-z0-9-]+))\]/gi, (_m, label, _url, slug) => {
                    const safeLabel = String(label).trim();
                    const pretty = `/blog/${slug}`;
                    return `<a href=\"${pretty}\" class=\"text-purple-600 hover:underline\">${safeLabel}</a>`;
                  });
                  // Pattern: [Label](/blog?post=slug) -> /blog/slug
                  out = out.replace(/\[(.*?)\]\((\/blog\?post=([a-z0-9-]+))\)/gi, (_m, label, _url, slug) => {
                    const pretty = `/blog/${slug}`;
                    return `<a href=\"${pretty}\" class=\"text-purple-600 hover:underline\">${label}</a>`;
                  });
                  // Pattern: [/blog?post=slug] -> /blog/slug
                  out = out.replace(/\[(\/blog\?post=([a-z0-9-]+))\]/gi, (_m, _url, slug) => {
                    const pretty = `/blog/${slug}`;
                    return `<a href=\"${pretty}\" class=\"text-purple-600 hover:underline\">${pretty}</a>`;
                  });
                  return out;
                };

                const elements: JSX.Element[] = [];
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];
                  const trimmed = line.trim();
                  if (trimmed === '') continue;

                  // Markdown image handling
                  if (isMdImage(line)) {
                    const raw = trimmed;
                    const mdStrict = raw.match(/^!\[(.*?)\]\((\S+?)(?:\s+\"(.*?)\")?\)$/);
                    let alt = selectedPost.title;
                    let url = '';
                    let caption = '';
                    if (mdStrict) {
                      alt = mdStrict[1] || alt;
                      url = mdStrict[2] || '';
                      caption = mdStrict[3] || '';
                    } else {
                      const altMatch = raw.match(/^!\[(.*?)\]/);
                      const urlMatch = raw.match(/\((.*?)\)/);
                      if (altMatch) alt = altMatch[1] || alt;
                      if (urlMatch) url = (urlMatch[1] || '').split(' "')[0].trim();
                    }
                    let finalUrl = url || undefined;
                    // Ensure uniqueness: avoid previously used URLs and avoid category/generic defaults for inline images
                    if (!finalUrl || (typeof usedImageUrls !== 'undefined' && usedImageUrls.has(finalUrl))) {
                      // try to perturb source.unsplash.com with a unique sig if applicable
                      if (finalUrl && finalUrl.includes('source.unsplash.com')) {
                        const hasSig = /[?&]sig=\d+/.test(finalUrl);
                        const baseIdx = imageIdx + 1;
                        finalUrl = hasSig ? finalUrl.replace(/sig=\d+/, `sig=${baseIdx}`) : (finalUrl + (finalUrl.includes('?') ? '&' : '?') + `sig=${baseIdx}`);
                      } else if (finalUrl && finalUrl.includes('images.unsplash.com')) {
                        // add query params to differentiate renders
                        const baseIdx = imageIdx + 1;
                        finalUrl = finalUrl + (finalUrl.includes('?') ? '&' : '?') + `uniq=${baseIdx}`;
                      }
                    }
                    // Final guard: always ensure unique per article
                    let guardCounter = 0;
                    while ((!finalUrl || (typeof usedImageUrls !== 'undefined' && usedImageUrls.has(finalUrl))) && guardCounter < 5) {
                      const baseIdx = imageIdx + 1 + guardCounter;
                      if (!finalUrl) finalUrl = GENERIC_BLOG_IMAGE + `?v=${baseIdx}`;
                      else if (finalUrl.includes('source.unsplash.com')) finalUrl = finalUrl.replace(/([?&]sig=)\d+/, `$1${baseIdx}`);
                      else finalUrl = finalUrl + (finalUrl.includes('?') ? '&' : '?') + `v=${baseIdx}`;
                      guardCounter++;
                    }
                    if (!finalUrl || (typeof usedImageUrls !== 'undefined' && usedImageUrls.has(finalUrl))) {
                      const fb = pickFallback(undefined);
                      finalUrl = fb && (!usedImageUrls || !usedImageUrls.has(fb)) ? fb : `${GENERIC_BLOG_IMAGE}?v=${Date.now()}-${imageIdx}`;
                    }
                    // Curated per-heading images for cheap-hobbies to guarantee unique, headline-relevant visuals
                    if (selectedPost.id === 'cheap-hobbies-at-home') {
                      const curated = [
                        'https://images.unsplash.com/photo-1527254435198-6a952d2ed8c2?auto=format&fit=crop&w=1600&q=80', // Zentangle
                        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80', // Herbs jar
                        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80', // Writing
                        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80', // Puzzle
                        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1600&q=80', // Rhythm desk
                        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80', // Acting mirror
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80'  // Board game
                      ];
                      if (imageIdx >= 0 && imageIdx < curated.length) {
                        finalUrl = curated[imageIdx];
                      }
                    }
                    if (selectedPost.id === 'easy-hobbies-that-make-you-smarter') {
                      const overrideA = 'https://images.unsplash.com/photo-1542587228-2d9950b773df?auto=format&fit=crop&w=1600&q=80';
                      const overrideB = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80';
                      if (imageIdx === 0) finalUrl = overrideA;
                      if (imageIdx === 1) finalUrl = overrideB;
                      if (typeof usedImageUrls !== 'undefined' && usedImageUrls.has(finalUrl)) {
                        const candidates = [overrideA, overrideB, CATEGORY_IMAGES[selectedPost.category], GENERIC_BLOG_IMAGE].filter(Boolean) as string[];
                        for (const c of candidates) { if (!usedImageUrls.has(c)) { finalUrl = c; break; } }
                      }
                    }
                    if (typeof usedImageUrls !== 'undefined') usedImageUrls.add(finalUrl);
                    imageIdx++;
                    elements.push(
                      <figure key={`img-${i}`} className="my-6">
                        <img src={finalUrl} alt={alt} loading="lazy" width={1600} height={720} className="w-full h-44 sm:h-52 md:h-64 lg:h-72 object-cover rounded-xl border border-slate-200" onError={(e) => {
                          const img = (e.currentTarget as HTMLImageElement);
                          const current = img.src;
                          const next = current === GENERIC_BLOG_IMAGE ? ALT_GENERIC_IMAGE : GENERIC_BLOG_IMAGE;
                          if (current !== next) img.src = next;
                        }} />
                        {caption && (<figcaption className="text-sm text-slate-500 mt-2">{caption}</figcaption>)}
                      </figure>
                    );
                    continue;
                  }

                  // Numbered item (1., 2., ...). Support optional leading emoji before number as long as line contains pattern "\d+."
                  const numMatch = trimmed.match(/\b\d+\./);
                  if (numMatch && /^\s*\d+\./.test(trimmed) || numMatch && trimmed.indexOf(numMatch[0]) <= 4) {
                    const headingText = trimmed;
                    const numHeadingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                    const contentLines: string[] = [];
                    let j = i + 1;
                    while (j < lines.length) {
                      const next = lines[j].trim();
                      if (next === '') { j++; continue; }
                      if (/^\s*\d+\./.test(next) || isSectionHeading(next) || isMdImage(lines[j])) break;
                      contentLines.push(lines[j]);
                      j++;
                    }

                    elements.push(
                      <div key={`num-${i}`} className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4 rounded-r-lg">
                        <h3 id={numHeadingId} className="font-bold text-purple-900 mb-2">{headingText}</h3>
                        {contentLines.map((ln, k) => {
                          const t = (ln || '').trim();
                          if (t.startsWith('•')) {
                            const bulletHtml = convertInlineLinks(t.slice(1).trim());
                            return (
                              <div key={`num-${i}-b-${k}`} className="flex items-start mb-3">
                                <span className="text-purple-500 text-xl mr-3 mt-1">•</span>
                                <p className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: bulletHtml }} />
                              </div>
                            );
                          }
                          const paraHtml = convertInlineLinks(ln);
                          return (
                            <p key={`num-${i}-p-${k}`} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: paraHtml }} />
                          );
                        })}
                      </div>
                    );
                    i = j - 1; // skip consumed lines
                    continue;
                  }

                  // Other section heading
                  if (isSectionHeading(line)) {
                    const headingId = line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const AUTOLINKS: { term: string; slug: string }[] = [
                      { term: 'journaling', slug: 'micro-journaling-habit' },
                      { term: 'watercolor', slug: 'easy-watercolor-paintings' },
                      { term: 'AI', slug: 'find-hobby-that-sticks' }
                    ];
                    let contentHtml = line;
                    for (const { term, slug } of AUTOLINKS) {
                      const re = new RegExp(`(\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b)`, 'gi');
                    contentHtml = contentHtml.replace(re, `<a href=\"/blog/${slug}\" class=\"text-purple-600 hover:underline\">$1</a>`);
                    }
                    elements.push(
                      <h2 key={`h-${i}`} id={headingId} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b-2 border-purple-200 pb-2 scroll-mt-8">
                        <span dangerouslySetInnerHTML={{ __html: contentHtml }} />
                      </h2>
                    );
                    continue;
                  }

                  // Bullet line
                  if (trimmed.startsWith('•')) {
                    const bulletHtml = convertInlineLinks(trimmed.slice(1).trim());
                    elements.push(
                      <div key={`b-${i}`} className="flex items-start mb-3">
                        <span className="text-purple-500 text-xl mr-3 mt-1">•</span>
                        <p className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: bulletHtml }} />
                      </div>
                    );
                    continue;
                  }

                  // CTA paragraph
                  if (line.includes('Ready to') || line.includes('Stop waiting') || line.includes('Let AI do') || line.includes('Don\'t wait')) {
                    elements.push(
                      <div key={`cta-${i}`} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-xl p-6 my-6 text-center">
                        <p className="text-lg font-semibold text-slate-900 mb-4">{line}</p>
                        <button onClick={(e) => { e.stopPropagation(); window.location.href = '/generate'; }} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                          Generate My Plan
                        </button>
                      </div>
                    );
                    continue;
                  }

                  // Default body paragraph with light autolinks
                  const AUTOLINKS_BODY: { term: string; slug: string }[] = [
                    { term: 'journaling', slug: 'micro-journaling-habit' },
                    { term: 'watercolor', slug: 'easy-watercolor-paintings' },
                    { term: 'AI', slug: 'find-hobby-that-sticks' }
                  ];
                  let bodyHtml = convertInlineLinks(line);
                  for (const { term, slug } of AUTOLINKS_BODY) {
                    const re = new RegExp(`(\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b)`, 'gi');
                  bodyHtml = bodyHtml.replace(re, `<a href=\"/blog/${slug}\" class=\"text-purple-600 hover:underline\">$1</a>`);
                  }
                  elements.push(
                    <p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                  );
                }

                return elements;
              })()}
            </div>
          </article>

          {/* Related Articles */}
          <aside className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Keep Reading</h3>
            <div className="grid md:grid-cols-2 gap-4">
                  {allPosts
                .filter(p => p.id !== selectedPost.id)
                .slice(0, 2)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPost(p)}
                    className="text-left bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">{p.category}</span>
                      <span className="text-xs text-slate-500">{p.readTime}</span>
                    </div>
                    <div className="font-semibold text-slate-900 line-clamp-2">{p.title}</div>
                    <div className="text-sm text-slate-600 line-clamp-2 mt-1">{p.excerpt}</div>
                  </button>
              ))}
            </div>
          </aside>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <UnifiedNavigation currentPage="blog" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 px-2">
            Wizqo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover learning tips, hobby guides, and success stories from our community of learners.
          </p>
        </div>

        {allPosts.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Post */}
            <article 
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all"
                  onClick={() => { setSelectedPost(allPosts[0]); navigateTo(`/blog/${allPosts[0].id}`); }}
            >
              <span className="bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full mb-4 inline-block">
                Featured Article
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                {allPosts[0].title}
              </h2>
              <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90 leading-relaxed">
                {allPosts[0].excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {allPosts[0].readTime}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {allPosts[0].date}
                </span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                  {allPosts[0].category}
                </span>
                <div className="flex items-center gap-1 text-yellow-300">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm ml-1">({getPostRating(allPosts[0])})</span>
                </div>
              </div>
            </article>

            {/* Other Posts - Clean List Style */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">More Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {allPosts.slice(1).map((post) => (
                  <article 
                    key={post.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-purple-300"
                  onClick={() => { setSelectedPost(post); navigateTo(`/blog/${post.id}`); }}
                  >
                    <img 
                      src={getPostImage(post)} 
                      alt={post.imageAlt || post.title} 
                      width={1200}
                      height={540}
                      className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover rounded-lg mb-4"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGES[post.category] || GENERIC_BLOG_IMAGE; }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({getPostRating(post)})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                      <span className="font-medium">{post.author}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {post.readTime}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Never Miss a New Article</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Get the latest hobby guides, learning tips, and AI insights delivered straight to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800 text-white placeholder-slate-400"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-8">📝</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Getting Ready to Share</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're preparing valuable content about hobby learning, AI-powered education, and success strategies. Our blog will soon feature:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="font-bold text-slate-900 mb-2">Learning Guides</h3>
                <p className="text-slate-600 text-sm">Step-by-step tutorials for popular hobbies</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="font-bold text-slate-900 mb-2">Success Stories</h3>
                <p className="text-slate-600 text-sm">Real experiences from our learners</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="font-bold text-slate-900 mb-2">AI Insights</h3>
                <p className="text-slate-600 text-sm">How AI enhances personalized learning</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-3">Want to be notified when we publish new content?</h3>
              <p className="text-slate-600 mb-4">Join our newsletter to get the latest learning tips and hobby guides.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}