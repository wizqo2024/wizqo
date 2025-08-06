import React, { useState } from 'react';
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
}

const blogPosts: BlogPost[] = [
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
    category: "Mental Wellness"
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

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

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
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavigation currentPage="blog" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
            >
              ← Back to Blog
            </button>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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
                  <span className="text-sm text-slate-500">(4.9)</span>
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
                <div className="space-y-2 text-sm">
                  {selectedPost.content.split('\n')
                    .filter(paragraph => 
                      paragraph.includes('Day 1:') || paragraph.includes('Day 2') || paragraph.includes('Day 3') || paragraph.includes('Day 4') || paragraph.includes('Day 5') || paragraph.includes('Day 6') || paragraph.includes('Day 7') || 
                      paragraph.includes('Why Most Hobbies Fail') || paragraph.includes('How AI Makes Hobbies') || paragraph.includes('Your 7-Day Plan') || 
                      paragraph.includes('What Is Micro Journaling') || paragraph.includes('Why It Works') || paragraph.includes('5 Micro Journaling Prompts') || 
                      paragraph.includes('Why Watercolor Is') || paragraph.includes('10 Easy Watercolor') || paragraph.includes('Beginner Watercolor Supplies') ||
                      paragraph.includes('Common Mistakes') || paragraph.includes('FREE 7-Day') || paragraph.includes('Just Start!') || 
                      paragraph.includes('The Science:') || paragraph.includes('What Hobby Have You') || paragraph.includes('Ready to Find') || 
                      paragraph.includes('Bonus: Pair Micro') || paragraph.includes('Micro Journaling =') || paragraph.includes('Ready to Try')
                    )
                    .map((heading, index) => {
                      const headingId = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
                          <span className="hover:underline">{heading}</span>
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {selectedPost.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Check if it's a heading
                if (paragraph.includes('Day 1:') || paragraph.includes('Day 2') || paragraph.includes('Day 3') || paragraph.includes('Day 4') || paragraph.includes('Day 5') || paragraph.includes('Day 6') || paragraph.includes('Day 7') || 
                    paragraph.includes('Why Most Hobbies Fail') || paragraph.includes('How AI Makes Hobbies') || paragraph.includes('Your 7-Day Plan') || 
                    paragraph.includes('What Is Micro Journaling') || paragraph.includes('Why It Works') || paragraph.includes('5 Micro Journaling Prompts') || 
                    paragraph.includes('Why Watercolor Is') || paragraph.includes('10 Easy Watercolor') || paragraph.includes('Beginner Watercolor Supplies') ||
                    paragraph.includes('Common Mistakes') || paragraph.includes('FREE 7-Day') || paragraph.includes('Just Start!') || 
                    paragraph.includes('The Science:') || paragraph.includes('What Hobby Have You') || paragraph.includes('Ready to Find') || 
                    paragraph.includes('Bonus: Pair Micro') || paragraph.includes('Micro Journaling =') || paragraph.includes('Ready to Try')) {
                  const headingId = paragraph.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <h2 key={index} id={headingId} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b-2 border-purple-200 pb-2 scroll-mt-8">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Check if it's a numbered item (1., 2., etc.)
                if (/^\d+\./.test(paragraph.trim())) {
                  return (
                    <div key={index} className="bg-purple-50 border-l-4 border-purple-400 p-4 my-4 rounded-r-lg">
                      <h3 className="font-bold text-purple-900 mb-2">{paragraph.split('\n')[0]}</h3>
                      {paragraph.split('\n').slice(1).map((line, lineIndex) => (
                        <p key={lineIndex} className="text-slate-700 leading-relaxed">{line}</p>
                      ))}
                    </div>
                  );
                }
                
                // Check if it's a bullet point
                if (paragraph.startsWith('•')) {
                  return (
                    <div key={index} className="flex items-start mb-3">
                      <span className="text-purple-500 text-xl mr-3 mt-1">•</span>
                      <p className="text-slate-700 leading-relaxed flex-1">{paragraph.slice(1).trim()}</p>
                    </div>
                  );
                }
                
                // Check if it's a call-to-action paragraph
                if (paragraph.includes('Ready to') || paragraph.includes('Stop waiting') || paragraph.includes('Let AI do') || paragraph.includes('Don\'t wait')) {
                  return (
                    <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-xl p-6 my-6 text-center">
                      <p className="text-lg font-semibold text-slate-900 mb-4">{paragraph}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.hash = '#/generate';
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        Generate My Plan
                      </button>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-4 text-slate-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
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

        {blogPosts.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Post */}
            <article 
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all"
              onClick={() => setSelectedPost(blogPosts[0])}
            >
              <span className="bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full mb-4 inline-block">
                Featured Article
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                {blogPosts[0].title}
              </h2>
              <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {blogPosts[0].readTime}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {blogPosts[0].date}
                </span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center gap-1 text-yellow-300">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm ml-1">(4.9)</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.hash = '#/generate';
                }}
                className="bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto border border-purple-200 hover:border-purple-300"
              >
                Generate My Plan →
              </button>
            </article>

            {/* Other Posts - Clean List Style */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">More Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.slice(1).map((post) => (
                  <article 
                    key={post.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-purple-300"
                    onClick={() => setSelectedPost(post)}
                  >
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
                        <span className="text-xs text-slate-500 ml-1">(4.9)</span>
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