import * as React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { WorksheetSectionWrapper } from './PrintableShared';
import { makeRng } from '@/utils/printableUtils';
import { ProblemBox, WorksheetHeader, WorksheetFooter } from '@/components/worksheet';

interface SpecificWorksheetProps {
    docId?: string;
    activeDocs?: string[];
    showAnswersForDoc: (docId: string, factory: () => ReactNode) => ReactNode;
    seed: string;
    variant: number;
}

interface PassageData {
    title: string;
    emoji: string;
    description: string;
    passage: string;
    questions: string[];
    answers: string[];
    example?: {
        q: string;
        s1: string;
        s2: string;
        s3: string;
        a: string;
    };
    challenge?: string[];
    objectives?: string[];
    tips?: string[];
    icon?: ReactNode;
}

function generateReadingStory(seed: string, grade: number) {
    const rng = makeRng(seed);
    const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];

    // Vocabulary banks
    const animals = ['ant', 'beetle', 'ladybug', 'butterfly', 'spider', 'bee'];
    const adjectives = ['tiny', 'busy', 'fast', 'brave', 'happy', 'red'];
    const places = ['garden', 'park', 'forest', 'playground', 'backyard'];
    const foods = ['crumb', 'leaf', 'seed', 'berry', 'cookie'];
    const actions = ['ran', 'crawled', 'flew', 'marched', 'climbed'];

    // Grade 1: Simple sentences
    if (grade === 1) {
        const mainChar = pick(animals);
        const name = pick(['Andy', 'Betty', 'Carl', 'Dora', 'Eddie', 'Fay']);
        const adj = pick(adjectives);
        const place = pick(places);
        const food = pick(foods);
        const action = pick(actions);

        const title = `The ${adj.charAt(0).toUpperCase() + adj.slice(1)} ${mainChar.charAt(0).toUpperCase() + mainChar.slice(1)}`;

        const story = `Once there was a ${adj} ${mainChar} named ${name}.
    ${name} lived in a big ${place}.
    One day, ${name} was very hungry.
    ${name} ${action} to find some food.
    Suddenly, ${name} found a big, yummy ${food}.
    ${name} was so happy to find the ${food}!`;

        const questions = [
            `What kind of animal was ${name}?`,
            `Where did ${name} live?`,
            `What did ${name} find to eat?`,
        ];

        const answers = [
            mainChar,
            place,
            food
        ];

        return { title, story, questions, answers, emoji: '📖' };
    }

    // Grade 2: More complex sentences, social themes
    if (grade === 2) {
        const friend1 = pick(['Sam', 'Mia', 'Leo', 'Zoe', 'Max', 'Ava']);
        const friend2 = pick(['Ben', 'Lily', 'Tom', 'Eva', 'Jay', 'Sky']);
        const activity = pick(['painting', 'soccer', 'baking', 'hiking', 'gardening']);
        const object = pick(['ball', 'brush', 'spoon', 'map', 'flower']);
        const setting = pick(['park', 'kitchen', 'studio', 'trail', 'backyard']);
        const emotion = pick(['excited', 'nervous', 'happy', 'proud', 'curious']);

        const title = `${friend1} and ${friend2}'s ${activity.charAt(0).toUpperCase() + activity.slice(1)} Day`;

        const story = `It was a beautiful Saturday morning. ${friend1} called ${friend2} on the phone.
    "Do you want to go ${activity} today?" asked ${friend1}.
    "Yes! I am so ${emotion}!" replied ${friend2}.
    They met at the ${setting}. ${friend1} brought a big ${object} to help them start.
    They spent the whole afternoon ${activity} together. Using the ${object} was very helpful.
    At the end of the day, they were tired but happy.`;

        const questions = [
            `What activity did the friends do?`,
            `Where did they meet?`,
            `How did ${friend2} feel about playing?`,
            `What item did ${friend1} bring?`,
        ];

        const answers = [
            activity,
            setting,
            emotion,
            object
        ];

        return { title, story, questions, answers, emoji: '👫' };
    }

    // Grade 3: Paragraphs, informative/science themes
    if (grade === 3) {
        const topics = [
            { t: 'Bees', f: 'pollinate flowers', h: 'hive', d: 'honey' },
            { t: 'Frogs', f: 'catch flies', h: 'pond', d: 'eggs' },
            { t: 'Volcanoes', f: 'erupt lava', h: 'mountain', d: 'magma' },
            { t: 'Trees', f: 'make oxygen', h: 'forest', d: 'wood' }
        ];
        const topic = pick(topics);
        const adjDoc = pick(['amazing', 'fascinating', 'important', 'incredible']);

        const title = `The ${adjDoc.charAt(0).toUpperCase() + adjDoc.slice(1)} World of ${topic.t}`;

        const story = `${topic.t} are truly ${adjDoc} parts of nature. Did you know that they ${topic.f}? This helps our world in many ways.
  
    Most ${topic.t.toLowerCase()} can be found in a ${topic.h}. This is their home where they allow themselves to grow and thrive.
  
    Another interesting fact is related to ${topic.d}. This plays a key role in the life of ${topic.t.toLowerCase()}. Scientists study them to learn more about our planet.`;

        const questions = [
            `What is the main topic of the passage?`,
            `Where can you usually find them?`,
            `What do they do according to the text?`,
            `What specific term was mentioned?`,
        ];

        const answers = [
            topic.t,
            topic.h,
            topic.f,
            topic.d
        ];

        return { title, story, questions, answers, emoji: '🌍' };
    }

    return null;
}

export const READING_PASSAGES: Record<string, PassageData> = {
    'reading-mini-1': {
        title: 'Mini Reading Passage: Growing Seeds',
        emoji: '🌱',
        description: 'Read the short passage, then answer the questions in full sentences.',
        passage: 'Sara planted a tiny seed in a cup by the window. Every day, she gave it a little water. One morning, she saw a green sprout peek out of the soil. Sara smiled and turned the cup so the sprout could see the sun.',
        questions: [
            'Where did Sara put the cup?',
            'What did she give the seed every day?',
            'What did Sara see in the soil?'
        ],
        answers: [
            'By the window (Sara planted a tiny seed in a cup by the window)',
            'A little water (Every day, she gave it a little water)',
            'A green sprout (she saw a green sprout peek out of the soil)'
        ],
        example: {
            q: 'Where did Sara put the cup?',
            s1: 'Read the passage carefully',
            s2: 'Look for where Sara put the cup',
            s3: 'Find: "Sara planted a tiny seed in a cup by the window"',
            a: 'Sara put the cup by the window.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'Why do you think Sara turned the cup toward the sun?',
            'Draw a picture of Sara\'s plant growing'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details (where, what)',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss plant growth and caring for living things with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M50 50 Q50 30 50 10" stroke="#16a34a" strokeWidth="4" fill="none" />
                <path d="M50 30 Q70 15 50 15 Q30 15 50 30" fill="#22c55e" />
                <path d="M50 40 Q65 30 50 30 Q35 30 50 40" fill="#16a34a" />
                <circle cx="50" cy="55" r="5" fill="#78350f" />
            </svg>
        )
    },
    'reading-g1-lost-hat': {
        title: 'Passage: The Lost Hat (Grade 1)',
        emoji: '👒',
        description: 'Short passage with 4 comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Mia ran to the park. The wind was strong. Her red hat flew off! She looked under the slide and behind a tree. A dog found the hat by the bench. Mia laughed and waved. "Thank you!"',
        questions: [
            'Where did Mia go?',
            'What color was the hat?',
            'Who found the hat?',
            'Why did the hat fly off?'
        ],
        answers: [
            'The park (Mia ran to the park)',
            'Red (Her red hat flew off)',
            'A dog (A dog found the hat by the bench)',
            'The wind was strong (The wind was strong, so the hat flew off)'
        ],
        example: {
            q: 'Where did Mia go?',
            s1: 'Read the passage carefully',
            s2: 'Look for the answer to "Where did Mia go?"',
            s3: 'Find: "Mia ran to the park"',
            a: 'Mia went to the park.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'What do you think happened after Mia said "Thank you"?',
            'Draw a picture of what happened in the story'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details (who, what, where, why)',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Have the child retell the story in their own words'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M10 50 Q50 55 90 50 L85 40 Q50 30 15 40 Z" fill="#ef4444" />
                <path d="M30 40 Q50 10 70 40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="50" cy="30" r="4" fill="#fee2e2" />
            </svg>
        )
    },
    'reading-g1-ants': {
        title: 'Passage: Lunch for the Ants (Grade 1)',
        emoji: '📖',
        description: 'Short passage with 4 comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Sam dropped a crumb. Ants marched in a line. They carried the crumb together. Sam watched quietly. He did not step near them. Soon, the ants were gone. The floor was clean!',
        questions: [
            'What did Sam drop?',
            'How did the ants move?',
            'What did Sam do while he watched?',
            'What happened to the floor?'
        ],
        answers: [
            'A crumb',
            'In a line',
            'He watched quietly',
            'It was clean'
        ],
        example: {
            q: 'What did Sam drop?',
            s1: 'Read the passage carefully',
            s2: 'Look for what Sam dropped',
            s3: 'Find: "Sam dropped a crumb"',
            a: 'Sam dropped a crumb.'
        },
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details (what, how, why)',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss what the child learned about ants from the story'
        ],
        icon: (
            <svg viewBox="0 0 100 40" className="w-40 h-16">
                {[20, 40, 60, 80].map(x => (
                    <g key={x} transform={`translate(${x}, 20)`}>
                        <circle cx="-5" cy="0" r="3" fill="#1e293b" />
                        <circle cx="0" cy="0" r="3" fill="#1e293b" />
                        <circle cx="5" cy="0" r="3" fill="#1e293b" />
                        <path d="M-2 -3 L-4 -6 M2 -3 L4 -6" stroke="#1e293b" strokeWidth="1" />
                    </g>
                ))}
            </svg>
        )
    },
    'reading-g1-bus-ride': {
        title: 'Passage: The Bus Ride (Grade 1)',
        emoji: '📖',
        description: 'Short passage with 4 comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Eli held his mom\'s hand. They waited for the yellow bus. "Climb up," said the driver. The seats were soft and blue. Eli waved to the people on the street. "This is our stop," Mom said. The doors opened with a hiss.',
        questions: [
            'What color were the seats?',
            'Who did Eli hold hands with?',
            'What sound did the driver make?',
            'Why did the doors open?'
        ],
        answers: [
            'Blue (The seats were soft and blue)',
            'His mom (Eli held his mom\'s hand)',
            'A bell (The driver rang a bell)',
            'It was their stop ("This is our stop," Mom said)'
        ],
        example: {
            q: 'What color were the seats?',
            s1: 'Read the passage carefully',
            s2: 'Look for information about the seats',
            s3: 'Find: "The seats were soft and blue"',
            a: 'The seats were blue.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'Why do you think Eli waved to the driver?',
            'Draw a picture of Eli and his mom on the bus'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details (what, who, why)',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss bus safety and manners with your child'
        ],
        icon: (
            <svg viewBox="0 0 120 60" className="w-40 h-16">
                <rect x="10" y="10" width="100" height="35" rx="5" fill="#facc15" />
                <rect x="15" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="40" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="65" y="15" width="20" height="15" fill="#bae6fd" />
                <rect x="90" y="15" width="15" height="15" fill="#bae6fd" />
                <circle cx="30" cy="45" r="8" fill="#1e293b" />
                <circle cx="90" cy="45" r="8" fill="#1e293b" />
                <rect x="10" y="35" width="100" height="5" fill="#1e293b" opacity="0.2" />
            </svg>
        )
    },
    'reading-g1-pet-fish': {
        title: 'Passage: The Pet Fish (Grade 1)',
        emoji: '📖',
        description: 'Short passage with 4 comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Tara had a tiny orange fish. She named it Dot. Every morning, she shook in two flakes of food. Dot swam in little circles. Tara drew a picture of Dot for her wall.',
        questions: [
            'What pet did Tara have?',
            'What was its name?',
            'How many flakes did she feed it?',
            'What did Tara put on her wall?'
        ],
        answers: [
            'A tiny orange fish (Tara had a tiny orange fish)',
            'Dot (She named it Dot)',
            'Two flakes (Every morning, she shook in two flakes of food)',
            'A picture of Dot (Tara drew a picture of Dot for her wall)'
        ],
        example: {
            q: 'What pet did Tara have?',
            s1: 'Read the passage carefully',
            s2: 'Look for what pet Tara had',
            s3: 'Find: "Tara had a tiny orange fish"',
            a: 'Tara had a tiny orange fish.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'Why do you think Tara named her fish Dot?',
            'Draw a picture of Tara\'s fish'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details (what, who, how many)',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss pet care and responsibility with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <circle cx="50" cy="30" r="25" fill="#ebf8ff" stroke="#93c5fd" strokeWidth="2" />
                <path d="M40 35 Q55 20 70 35 L75 30 Q75 40 70 35 Q55 50 40 35" fill="#f97316" />
                <circle cx="45" cy="32" r="1.5" fill="white" />
                <path d="M25 30 Q50 35 75 30" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
            </svg>
        )
    },
    'reading-g1-red-balloon': {
        title: 'Passage: The Red Balloon (Grade 1)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Sam saw a big red balloon in the grass. It was round and shiny. Sam held the string tight. The balloon went up, up, up!',
        questions: [
            'What did Sam find in the grass?',
            'What color was the balloon?',
            'Where did the balloon go?'
        ],
        answers: [
            'A red balloon',
            'Red',
            'Up into the air'
        ],
        example: {
            q: 'What did Sam find?',
            s1: 'Read the passage carefully',
            s2: 'Look for what Sam found',
            s3: 'Find: "Sam saw a big red balloon"',
            a: 'Sam found a red balloon.'
        },
        challenge: [
            'Can you draw Sam with his balloon?',
            'Where do you think the balloon went?'
        ],
        objectives: [
            'Read short, simple sentences',
            'Identify main character and key events',
            'Answer literal comprehension questions',
            'Build basic reading confidence'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "the", "he", "saw"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M50 45 L50 60" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <path d="M50 10 Q70 10 70 25 Q70 40 50 45 Q30 40 30 25 Q30 10 50 10" fill="#f43f5e" />
                <path d="M50 45 L45 50 L55 50 Z" fill="#f43f5e" />
                <circle cx="45" cy="20" r="3" fill="white" opacity="0.4" />
            </svg>
        )
    },
    'reading-g1-big-box': {
        title: 'Passage: The Big Box (Grade 1)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Mia found a big box in the garage. She opened it and saw old toys. There was a doll, a car, and a ball. Mia asked Mom, "Can I play with these?" Mom said yes. Mia played all afternoon.',
        questions: [
            'Where did Mia find the box?',
            'What was inside the box?',
            'What three things did she see?',
            'How long did Mia play?'
        ],
        answers: [
            'In the garage',
            'Old toys',
            'A doll, a car, and a ball',
            'All afternoon'
        ],
        example: {
            q: 'Where did Mia find the box?',
            s1: 'Read the passage carefully',
            s2: 'Look for the box location',
            s3: 'Find: "Mia found a big box in the garage"',
            a: 'Mia found the box in the garage.'
        },
        challenge: [
            'Can you draw Mia with her box?',
            'What would you put in a big box?'
        ],
        objectives: [
            'Read short, simple sentences',
            'Identify characters and settings',
            'Identify key details and objects',
            'Build basic reading confidence'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "the", "she", "saw"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="20" y="20" width="60" height="35" fill="#d97706" />
                <rect x="20" y="20" width="60" height="10" fill="#b45309" />
                <path d="M20 20 L10 10 L40 10 L50 20 Z" fill="#f59e0b" />
                <path d="M80 20 L90 10 L60 10 L50 20 Z" fill="#f59e0b" />
                <circle cx="50" cy="15" r="4" fill="#6366f1" />
            </svg>
        )
    },
    'reading-g1-garden-snail': {
        title: 'Passage: The Garden Snail (Grade 1)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Noah saw a snail in the garden. It had a brown shell. The snail moved very slowly. Noah watched it crawl on a leaf. The snail left a shiny trail. Noah smiled and said, "Hello, little snail!"',
        questions: [
            'Where did Noah see the snail?',
            'What color was the shell?',
            'How did the snail move?',
            'What did the snail leave behind?'
        ],
        answers: [
            'In the garden',
            'Brown',
            'Very slowly',
            'A shiny trail'
        ],
        example: {
            q: 'Where did Noah see the snail?',
            s1: 'Read the passage carefully',
            s2: 'Look for the snail location',
            s3: 'Find: "Noah saw a snail in the garden"',
            a: 'Noah saw the snail in the garden.'
        },
        challenge: [
            'Can you draw Noah with his snail?',
            'Why do you think snails move slowly?'
        ],
        objectives: [
            'Read short, simple sentences',
            'Identify main character and key events',
            'Identify key details and observations',
            'Build basic reading confidence'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "the", "he", "saw"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M10 50 Q50 60 90 50" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <path d="M20 45 Q30 20 60 20 Q80 20 80 45 Z" fill="#92400e" />
                <path d="M60 25 Q70 35 60 45" fill="none" stroke="#b45309" strokeWidth="1" />
                <path d="M15 45 Q40 50 70 45" fill="#fcd34d" />
                <circle cx="75" cy="40" r="1.5" fill="#1e293b" />
                <path d="M72 38 L75 32 M78 38 L81 32" stroke="#fcd34d" strokeWidth="1" />
            </svg>
        )
    },
    'reading-g1-birthday-cake': {
        title: 'Passage: The Birthday Cake (Grade 1)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'It was Emma\'s birthday. Mom made a chocolate cake. There were five candles on top. Emma closed her eyes and made a wish. Then she blew out all the candles. Everyone clapped and sang "Happy Birthday!"',
        questions: [
            'Whose birthday was it?',
            'What kind of cake did Mom make?',
            'How many candles were on the cake?',
            'What did everyone do after Emma blew out the candles?'
        ],
        answers: [
            'Emma\'s',
            'Chocolate cake',
            'Five',
            'Clapped and sang "Happy Birthday!"'
        ],
        example: {
            q: 'Whose birthday was it?',
            s1: 'Read the passage carefully',
            s2: 'Look for whose birthday it was',
            s3: 'Find: "It was Emma\'s birthday"',
            a: 'It was Emma\'s birthday.'
        },
        challenge: [
            'Can you draw Emma\'s birthday cake?',
            'What do you think Emma wished for?'
        ],
        objectives: [
            'Read short, simple sentences',
            'Identify main character and key events',
            'Identify key details and sequence of events',
            'Build basic reading confidence'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "the", "she", "made"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="25" y="30" width="50" height="25" rx="2" fill="#78350f" />
                <rect x="25" y="30" width="50" height="5" fill="#fbcfe8" />
                {[30, 40, 50, 60, 70].map(x => (
                    <g key={x}>
                        <rect x={x - 1} y="15" width="2" height="15" fill="#60a5fa" />
                        <path d={`M${x - 2} 15 Q${x} 5 ${x + 2} 15 Z`} fill="#facc15" />
                    </g>
                ))}
            </svg>
        )
    },
    'reading-g2-paper-bridge': {
        title: 'Passage: The Paper Bridge (Grade 2)',
        emoji: '📖',
        description: 'Short passage with comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Lena wanted a tiny bridge for her toy river. She folded strips of paper and taped them together. The first bridge bent and fell. She added more layers, tested again, and smiled. The paper bridge held three toy cars!',
        questions: [
            'What was Lena building?',
            'Why did the first bridge fail?',
            'What change helped it work?',
            'How many cars did it hold?'
        ],
        answers: [
            'A tiny paper bridge (Lena wanted a tiny bridge for her toy river)',
            'It bent and fell (too weak) (The first bridge bent and fell)',
            'More layers (She added more layers, tested again, and smiled)',
            'Three cars (The paper bridge held three toy cars!)'
        ],
        example: {
            q: 'What was Lena building?',
            s1: 'Read the passage carefully',
            s2: 'Look for what Lena was building',
            s3: 'Find: "Lena wanted a tiny bridge for her toy river"',
            a: 'Lena was building a tiny paper bridge.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'What lesson can we learn from Lena\'s story?',
            'Draw a picture of Lena\'s paper bridge'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details and main idea',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Try building your own paper bridge with your child'
        ],
        icon: (
            <svg viewBox="0 0 120 60" className="w-44 h-20">
                <path d="M10 50 Q60 10 110 50" stroke="#64748b" strokeWidth="4" fill="none" />
                <path d="M10 52 L110 52" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
                <rect x="50" y="30" width="20" height="15" fill="#e2e8f0" rx="1" />
            </svg>
        )
    },
    'reading-g2-rainy-garden': {
        title: 'Passage: Rainy Day Garden (Grade 2)',
        emoji: '📖',
        description: 'Short passage with comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Asha had a small garden. She kept a notebook about her plants. On rainy days, she drew a cloud symbol. She watched her green beans closely. After a week of rain and sun, they grew very fast! She wrote a lesson: "Plants need both rain and sun."',
        questions: [
            'What did Asha keep?',
            'What symbol did she draw on rainy days?',
            'What happened to her beans after a week?',
            'What lesson did she write?'
        ],
        answers: [
            'A notebook',
            'A cloud',
            'They grew fast',
            'Plants need rain and sun'
        ],
        example: {
            q: 'What did Asha keep?',
            s1: 'Read the passage carefully',
            s2: 'Look for what Asha kept',
            s3: 'Find: "Asha kept a notebook for her balcony garden"',
            a: 'Asha kept a notebook.'
        },
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details and observations',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss the importance of rain for plants with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="0" y="50" width="100" height="10" fill="#22c55e" />
                <path d="M20 50 Q25 30 30 50" fill="#16a34a" />
                <path d="M70 50 Q75 30 80 50" fill="#16a34a" />
                {[20, 40, 60, 80].map(x => (
                    <path key={x} d={`M${x} 5 L${x - 2} 15`} stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                ))}
            </svg>
        )
    },
    'reading-g2-library-card': {
        title: 'Passage: New Library Card (Grade 2)',
        emoji: '📖',
        description: 'Short passage with comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Jada visited the library with her uncle. She wanted to get her own library card. The librarian helped her fill out a blue form. Jada had to write her name and address clearly. After she signed it, the librarian handed her a shiny new card. Jada felt very grown up. She used her card to check out two mysteries and a book about space. "I can\'t wait to start reading!" she told her uncle.',
        questions: [
            'Where did Jada go?',
            'What did she receive from the librarian?',
            'What kinds of books did she choose?',
            'Why did she sign her name?'
        ],
        answers: [
            'The library',
            'A new library card',
            'Two mysteries and a science book',
            'To complete the form and get the card'
        ],
        example: {
            q: 'Where did Jada go?',
            s1: 'Read the passage carefully',
            s2: 'Look for where Jada go',
            s3: 'Find: "Jada visited the library with her uncle"',
            a: 'Jada went to the library.'
        },
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details and sequence of events',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Visit a library with your child and explore together'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="15" y="15" width="70" height="40" rx="3" fill="#3b82f6" />
                <rect x="20" y="20" width="20" height="20" fill="#eff6ff" opacity="0.5" />
                <rect x="45" y="25" width="30" height="3" fill="white" />
                <rect x="45" y="32" width="20" height="3" fill="white" />
                <circle cx="25" cy="50" r="10" fill="#2563eb" opacity="0.3" />
            </svg>
        )
    },
    'reading-g2-lost-and-found': {
        title: 'Passage: Lost and Found (Grade 2)',
        emoji: '🧸',
        description: 'Short passage with comprehension questions. Read carefully and answer in full sentences.',
        passage: 'Ben was playing on the playground after school. He noticed a small blue glove under the slide. "Someone must be looking for this," he thought. Ben picked up the glove and took it to the school office. He wrote a note that said, "Found at the slide." A few minutes later, a girl in his class came in. She was very happy to find her missing glove. Ben felt good that he could help.',
        questions: [
            'Where did Ben find the glove?',
            'Where did he take it?',
            'What did he write?',
            'Who came later, and what happened?'
        ],
        answers: [
            'Under the slide',
            'The office',
            'Found at the slide',
            'A classmate; she found her glove'
        ],
        example: {
            q: 'Where did Ben find the glove?',
            s1: 'Read the passage carefully',
            s2: 'Look for where Ben found the glove',
            s3: 'Find: "Ben noticed a glove under the slide"',
            a: 'Ben found the glove under the slide.'
        },
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify key details and problem-solving',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss what to do when something is lost with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="30" y="35" width="40" height="15" rx="5" fill="#ef4444" />
                <path d="M35 35 Q50 20 65 35 Z" fill="#ef4444" />
                <rect x="40" y="25" width="20" height="10" fill="#bae6fd" />
                <circle cx="40" cy="50" r="6" fill="#1e293b" />
                <circle cx="60" cy="50" r="6" fill="#1e293b" />
            </svg>
        )
    },
    'reading-g2-bird-feeder': {
        title: 'Passage: The Bird Feeder (Grade 2)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Carlos and his sister made a bird feeder from a milk carton. They cut a hole in the side and filled it with seeds. They hung it on a tree branch. The next morning, a blue jay came to eat. Carlos wrote in his journal, "Our feeder works!"',
        questions: [
            'What did they use to make the feeder?',
            'What did they put inside?',
            'Where did they hang it?',
            'What bird came to visit?'
        ],
        answers: [
            'A milk carton',
            'Seeds',
            'On a tree branch',
            'A blue jay'
        ],
        example: {
            q: 'What did they use to make the feeder?',
            s1: 'Read the passage carefully',
            s2: 'Look for what they used',
            s3: 'Find: "They used a milk carton"',
            a: 'They used a milk carton.'
        },
        challenge: [
            'Can you draw the bird feeder?',
            'Why do you think Carlos wrote in his journal?'
        ],
        objectives: [
            'Read and understand a slightly complex story',
            'Answer comprehension questions about the text',
            'Identify key details and sequence of events',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "works", "journal", "worksheet"'
        ],
        icon: (
            <svg viewBox="0 0 80 80" className="w-24 h-24">
                <path d="M40 10 L40 30" stroke="#94a3b8" strokeWidth="2" />
                <rect x="25" y="30" width="30" height="40" fill="#f1f5f9" stroke="#cbd5e1" />
                <rect x="30" y="45" width="20" height="15" fill="#1e293b" rx="10" />
                <path d="M25 30 L40 20 L55 30 Z" fill="#cbd5e1" />
                <circle cx="60" cy="50" r="8" fill="#3b82f6" />
                <path d="M68 50 L75 45" stroke="#3b82f6" strokeWidth="2" />
            </svg>
        )
    },
    'reading-g2-cookie-recipe': {
        title: 'Passage: The Cookie Recipe (Grade 2)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Ava wanted to bake cookies with her grandma. They read the recipe together. They needed flour, sugar, eggs, and butter. Ava measured the flour carefully. Grandma said, "Good job!" The cookies came out golden and sweet.',
        questions: [
            'Who did Ava bake with?',
            'What did they read together?',
            'What four things did they need?',
            'How did the cookies turn out?'
        ],
        answers: [
            'Her grandma',
            'The recipe',
            'Flour, sugar, eggs, and butter',
            'Golden and sweet'
        ],
        example: {
            q: 'Who did Ava bake with?',
            s1: 'Read the passage carefully',
            s2: 'Look for who Ava baked with',
            s3: 'Find: "Ava wanted to bake cookies with her grandma"',
            a: 'Ava baked with her grandma.'
        },
        challenge: [
            'Can you draw Ava baking with her grandma?',
            'Why do you think Grandma said "Good job!"?'
        ],
        objectives: [
            'Read and understand a slightly complex story',
            'Answer comprehension questions about the text',
            'Identify key details and ingredients',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "recipe", "measured", "grandma"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <circle cx="50" cy="30" r="25" fill="#d97706" />
                {[40, 50, 60, 45, 55].map((x, i) => (
                    <circle key={i} cx={x} cy={30 + (i % 2 ? 10 : -10)} r="3" fill="#451a03" />
                ))}
                <path d="M30 30 Q50 40 70 30" stroke="#fef3c7" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.3" />
            </svg>
        )
    },
    'reading-g2-tree-house': {
        title: 'Passage: The Tree House (Grade 2)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Jake\'s dad helped him build a tree house in the backyard. They used wood planks and strong nails. Jake climbed up the ladder first. He looked out the window and saw the whole yard. "This is my secret hideout!" he said.',
        questions: [
            'Who helped Jake build the tree house?',
            'What did they use to build it?',
            'What did Jake see from the window?',
            'What did Jake call the tree house?'
        ],
        answers: [
            'His dad',
            'Wood planks and strong nails',
            'The whole yard',
            'His secret hideout'
        ],
        example: {
            q: 'Who helped Jake build the tree house?',
            s1: 'Read the passage carefully',
            s2: 'Look for who helped Jake',
            s3: 'Find: "Jake\'s dad helped him build a tree house"',
            a: 'Jake\'s dad helped him build the tree house.'
        },
        challenge: [
            'Can you draw the tree house?',
            'Why do you think Jake called it his "secret hideout"?'
        ],
        objectives: [
            'Read and understand a slightly complex story',
            'Answer comprehension questions about the text',
            'Identify key details and sequence of events',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "backyard", "ladder", "hideout"'
        ],
        icon: (
            <svg viewBox="0 0 100 80" className="w-32 h-24">
                <path d="M50 80 L50 40" stroke="#78350f" strokeWidth="8" />
                <circle cx="50" cy="30" r="30" fill="#16a34a" />
                <rect x="35" y="35" width="30" height="25" fill="#92400e" rx="2" />
                <rect x="42" y="40" width="8" height="10" fill="#fef3c7" />
                <path d="M35 35 L50 25 L65 35 Z" fill="#451a03" />
            </svg>
        )
    },
    'reading-g2-magic-seeds': {
        title: 'Passage: The Magic Seeds (Grade 2)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Mia found a small packet of seeds in her garden. The packet said "Magic Seeds" on it. She planted them in a sunny spot and watered them every day. After one week, tiny green sprouts appeared. Two weeks later, beautiful flowers bloomed in red, yellow, and purple. Mia smiled and said, "These really are magic seeds!"',
        questions: [
            'What did Mia find in the garden?',
            'What did the packet say?',
            'What happened after one week?',
            'What colors were the flowers?'
        ],
        answers: [
            'A small packet of seeds',
            '"Magic Seeds"',
            'Tiny green sprouts appeared',
            'Red, yellow, and purple'
        ],
        example: {
            q: 'What did Mia find in the garden?',
            s1: 'Read the passage carefully',
            s2: 'Look for what Mia find',
            s3: 'Find: "Mia found a small packet of seeds"',
            a: 'Mia found a small packet of seeds.'
        },
        challenge: [
            'Can you draw Mia\'s magic garden?',
            'Why do you think Mia called them "magic seeds"?'
        ],
        objectives: [
            'Read and understand a slightly complex story',
            'Answer comprehension questions about the text',
            'Identify key details and sequence of events',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "magic", "flowers", "sprouts"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="30" y="20" width="40" height="30" rx="3" fill="#fde047" stroke="#ca8a04" />
                <path d="M15 50 Q50 55 85 50" stroke="#22c55e" strokeWidth="3" fill="none" />
                <path d="M50 50 Q55 35 65 30" stroke="#16a34a" strokeWidth="2" fill="none" />
                <circle cx="65" cy="30" r="5" fill="#f43f5e" />
            </svg>
        )
    },
    'reading-g3-lighthouse': {
        title: 'Passage: The Lighthouse Keeper\'s Trick (Grade 3)',
        emoji: '📖',
        description: 'Short passage with Q&A. Read carefully and answer in full sentences.',
        passage: 'A fishing boat was lost at sea. The fog was very thick. The captain could not see the shore. Suddenly, he heard a loud bell. It was the lighthouse warning! He steered away from the rocks and followed the sound to safety.',
        questions: [
            'What problem did the boat have?',
            'What stopped the captain from seeing?',
            'Why did the trick help the boat?',
            'What warned the captain?'
        ],
        answers: [
            'It drifted off course in thick fog',
            'The thick fog',
            'It guided the boat away from rocks',
            'A loud bell from the lighthouse'
        ],
        example: {
            q: 'What problem did the boat have?',
            s1: 'Read the passage carefully',
            s2: 'Look for the boat\'s problem',
            s3: 'Find: "a fishing boat was lost at sea"',
            a: 'The boat was lost at sea in thick fog.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'Why do you think the captain followed the sound?',
            'Draw a picture of the lighthouse in the fog'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify problem and solution',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss problem-solving and helping others with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 80" className="w-24 h-24">
                <path d="M40 70 L60 70 L55 20 L45 20 Z" fill="#ef4444" />
                <rect x="42" y="15" width="16" height="8" fill="#1e293b" />
                <path d="M50 18 L100 10 L100 26 Z" fill="#fef3c7" opacity="0.6" />
                <path d="M30 70 L70 70" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </svg>
        )
    },
    'reading-g3-science-fair': {
        title: 'Passage: The Science Fair Plan (Grade 3)',
        emoji: '📖',
        description: 'Short passage with Q&A. Read carefully and answer in full sentences.',
        passage: 'My team and I wanted to win the science fair. We chose a problem: sticky labels that won\'t peel cleanly. We planned to test two things: soaking time and natural oils. We predicted that warm oil would loosen the glue fastest. We wrote down every step so our test would be fair. By Friday, we hope to show our results to the judges.',
        questions: [
            'What problem did the team choose?',
            'What were two variables they planned to test?',
            'What did they predict?',
            'Why did they write a procedure?'
        ],
        answers: [
            'Sticky labels that won\'t peel cleanly',
            'Soaking time and natural oils',
            'Warm oil would loosen the glue fastest',
            'To follow steps consistently and fairly'
        ],
        example: {
            q: 'What problem did the team choose?',
            s1: 'Read the passage carefully',
            s2: 'Look for what problem the team chose',
            s3: 'Find: "We chose one: sticky labels that won\'t peel cleanly"',
            a: 'The team chose sticky labels that won\'t peel cleanly.'
        },
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify scientific method steps',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss the scientific method and experiments with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M40 20 L40 10 L60 10 L60 20 L75 50 L25 50 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" />
                <rect x="35" y="40" width="30" height="5" fill="#38bdf8" opacity="0.5" />
                <circle cx="45" cy="35" r="3" fill="white" opacity="0.6" />
                <circle cx="55" cy="25" r="3" fill="white" opacity="0.6" />
            </svg>
        )
    },
    'reading-g3-community-garden': {
        title: 'Passage: The Community Garden (Grade 3)',
        emoji: '📖',
        description: 'Short passage with Q&A. Read carefully and answer in full sentences.',
        passage: 'The empty lot near our school looked messy in spring. Families asked the town for permission to plant. We drew a map with paths, a tool shed, and a compost bin. By fall, we harvested tomatoes and herbs, and we sold bundles to raise money for books.',
        questions: [
            'What did families ask the town for?',
            'What three things were on the map?',
            'What did they harvest?',
            'How did they use the money they earned?'
        ],
        answers: [
            'Permission to plant a garden',
            'Paths, a tool shed, and a compost bin',
            'Tomatoes and herbs',
            'To buy books for the school'
        ],
        example: {
            q: 'What did families ask the town for?',
            s1: 'Read the passage carefully',
            s2: 'Look for what families asked the town for',
            s3: 'Find: "Families asked the town for permission to plant"',
            a: 'Families asked the town for permission to plant a garden.'
        },
        challenge: [
            'Can you retell the story in your own words?',
            'Why do you think they sold bundles to raise money?',
            'Draw a picture of the community garden'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Identify sequence of events and community action',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Read the passage aloud first, then have the child read it',
            'Ask questions to check understanding before answering',
            'Encourage full sentence answers',
            'Help identify key words in the questions that match the passage',
            'Extension: Discuss community projects and teamwork with your child'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-24 h-20">
                <path d="M10 50 Q50 60 90 50" stroke="#22c55e" strokeWidth="3" fill="none" />
                <path d="M50 50 L50 20" stroke="#16a34a" strokeWidth="2" />
                <path d="M50 35 Q30 25 50 30 Q70 25 50 35" fill="#22c55e" />
                <circle cx="50" cy="15" r="4" fill="#f43f5e" />
            </svg>
        )
    },
    'reading-g3-school-play': {
        title: 'Passage: The School Play (Grade 3)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Our class practiced a play about explorers for three weeks. On the big day, the gym was full of parents. I forgot one line, but I kept going. After the show, my teacher said, "You handled that mistake like a pro." I learned that making mistakes is okay if you keep trying.',
        questions: [
            'What was the play about?',
            'How long did they practice?',
            'What happened during the performance?',
            'What lesson did the narrator learn?'
        ],
        answers: [
            'Explorers',
            'Three weeks',
            'Narrator forgot a line but kept going',
            'Mistakes are okay if you keep trying'
        ],
        example: {
            q: 'What was the play about?',
            s1: 'Read the passage carefully',
            s2: 'Look for the play topic',
            s3: 'Find: "Our class practiced a play about explorers"',
            a: 'The play was about explorers.'
        },
        challenge: [
            'Can you retell the story?',
            'Why do you think the teacher said "like a pro"?'
        ],
        objectives: [
            'Read and understand a slightly complex story',
            'Answer comprehension questions about the text',
            'Identify theme and life lessons',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "explorers", "handled", "narrator"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <path d="M10 10 L10 50 L90 50 L90 10" fill="none" stroke="#78350f" strokeWidth="2" />
                <path d="M10 10 Q50 0 90 10 L90 50 Q50 60 10 50 Z" fill="#ef4444" />
                <path d="M30 10 L30 50 M70 10 L70 50" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="50" cy="30" r="5" fill="#fde047" />
            </svg>
        )
    },
    'reading-g3-art-project': {
        title: 'Passage: The Art Project (Grade 3)',
        emoji: '📖',
        description: 'Short story with Q&A. Read and answer the questions.',
        passage: 'Lily worked on her painting for two hours. She wanted to make a perfect sunset. Suddenly, her blue paint spilled. It left a big messy streak across the yellow sun. Lily felt sad at first. Then she turned the streak into a mountain. She proudly showed her teacher the new painting.',
        questions: [
            'What was Lily making?',
            'What happened when the blue paint spilled?',
            'How did Lily feel at first?',
            'What did Lily turn the blue streak into?'
        ],
        answers: [
            'A painting of a sunset',
            'It left a messy streak across the sun',
            'She felt sad',
            'A mountain'
        ],
        example: {
            q: 'What was Lily making?',
            s1: 'Read the passage carefully',
            s2: 'Look for the painting goal',
            s3: 'Find: "Lily worked on her painting... a perfect sunset"',
            a: 'Lily was making a painting of a sunset.'
        },
        challenge: [
            'Can you draw Lily\'s painting?',
            'Why was Lily proud of her painting?'
        ],
        objectives: [
            'Read and understand a short story',
            'Answer comprehension questions about the text',
            'Analyze character motivation and feelings',
            'Practice reading fluency and comprehension'
        ],
        tips: [
            'Have the child point to each word while reading',
            'Look at the picture together before reading the text',
            'Encourage the child to answer in complete sentences',
            'Practice recognizing sight words like "messy", "proudly", "mistake"'
        ],
        icon: (
            <svg viewBox="0 0 100 60" className="w-32 h-20">
                <rect x="20" y="10" width="60" height="40" fill="none" stroke="#64748b" strokeWidth="2" />
                <path d="M30 40 Q50 30 70 45" stroke="#3b82f6" strokeWidth="3" fill="none" />
                <circle cx="40" cy="20" r="5" fill="#ef4444" />
                <circle cx="65" cy="25" r="4" fill="#fde047" />
            </svg>
        )
    }
};

export function ReadingComprehension({ docId, activeDocs, showAnswersForDoc, seed }: SpecificWorksheetProps) {
    const { t } = useTranslation();

    if (activeDocs && docId && !activeDocs.includes(docId)) {
        return null;
    }

    let data: PassageData | null = null;

    if (docId && READING_PASSAGES[docId]) {
        data = READING_PASSAGES[docId];
    } else if (docId) {
        // Handle dynamic generation
        let grade = 1;
        if (docId.includes('g2')) grade = 2;
        if (docId.includes('g3')) grade = 3;

        const story = generateReadingStory(seed, grade);
        if (story) {
            data = {
                title: story.title,
                emoji: story.emoji,
                description: `Read the story and answer the questions. (Grade ${grade})`,
                passage: story.story,
                questions: story.questions,
                answers: story.answers,
                icon: <div className="text-6xl">{story.emoji}</div>
            };
        }
    }

    if (!data || !docId) return null;

    return (
        <WorksheetSectionWrapper
            docId={docId}
            title={data.title}
            emoji={data.emoji}
            description={data.description}
            problemCount={data.questions.length}
            learningObjectives={data.objectives}
            parentTeacherTips={data.tips}
        >
            <div className="print:hidden h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x mb-4" />

            <div className="flex flex-col items-center justify-center mb-8 print:mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-2">
                    {data.icon || (
                        <div className="text-5xl">{data.emoji}</div>
                    )}
                </div>
                <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">Reading Passage</div>
            </div>

            {/* Worked Example */}
            {data.example && (
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl print:border print:bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                    </div>
                    <div className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <span className="p-1 px-2 bg-blue-100 rounded text-xs uppercase tracking-wider">Example</span>
                        <span className="text-lg">How to Solve</span>
                    </div>
                    <div className="space-y-4">
                        <div className="font-bold text-slate-800 text-lg">
                            {data.example.q}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-white/60 rounded-lg border border-blue-100">
                                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Step 1</div>
                                <div className="text-sm text-slate-700">{data.example.s1}</div>
                            </div>
                            <div className="p-3 bg-white/60 rounded-lg border border-blue-100">
                                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Step 2</div>
                                <div className="text-sm text-slate-700">{data.example.s2}</div>
                            </div>
                            <div className="p-3 bg-white/60 rounded-lg border border-blue-100">
                                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Step 3</div>
                                <div className="text-sm text-slate-700">{data.example.s3}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200/50">
                            <div className="text-[10px] font-bold uppercase mb-1 opacity-80">Final Answer</div>
                            <div className="font-semibold">{data.example.a}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative mb-8 pt-4">
                <div className="absolute -top-1 left-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 shadow-sm">
                    The Story
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
                    <p className="text-slate-800 text-xl leading-relaxed font-serif whitespace-pre-line relative z-10">
                        {data.passage}
                    </p>
                </div>
            </div>

            <div className="relative pt-4 overflow-hidden">
                <div className="absolute -top-1 left-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 shadow-sm">
                    Comprehension Questions
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/20">
                    <ol className="space-y-8">
                        {data.questions.map((q, i) => (
                            <li key={i} className="group transition-all duration-300">
                                <div className="flex gap-4 items-start mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="text-slate-800 text-lg font-medium pt-0.5">{q}</div>
                                </div>
                                <div className="pl-12 space-y-4">
                                    <div className="border-b-2 border-dashed border-slate-200 h-10 w-full group-hover:border-blue-200 transition-colors" />
                                    <div className="border-b-2 border-dashed border-slate-200 h-10 w-full group-hover:border-blue-200 transition-colors" />
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Extension / Challenge */}
            {data.challenge && data.challenge.length > 0 && (
                <div className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-3xl print:bg-white print:border" style={{ pageBreakInside: 'avoid' }}>
                    <div className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <span className="p-1 px-2 bg-purple-100 rounded text-xs font-bold uppercase tracking-widest text-purple-600">Extra Credit</span>
                        <span className="text-lg">Think Bigger!</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.challenge.map((item, i) => (
                            <li key={i} className="bg-white/60 p-4 rounded-2xl border border-purple-100 flex gap-4 items-start shadow-sm">
                                <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">
                                    {String.fromCodePoint(0x2728)}
                                </div>
                                <span className="text-sm text-purple-900 leading-relaxed font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Self-Assessment */}
            <div className="mt-12 p-8 border-2 border-slate-100 rounded-3xl bg-slate-50/50 print:bg-white print:border" style={{ pageBreakInside: 'avoid' }}>
                <div className="font-bold text-slate-800 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg">
                        <span className="p-1.5 bg-slate-200 rounded-lg text-slate-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </span>
                        <span>My Progress</span>
                    </div>
                    <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-sm font-bold shadow-sm">
                        Score: ____ / {data.questions.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Read carefully', icon: '📖' },
                        { label: 'Answered all', icon: '✍️' },
                        { label: 'Full sentences', icon: '📝' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm group hover:border-blue-200 transition-all cursor-pointer">
                            <span className="text-sm font-bold text-slate-600">{item.label}</span>
                            <div className="w-6 h-6 border-2 border-slate-200 rounded-lg group-hover:border-blue-400" />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <span>Effort:</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className="text-lg opacity-30 hover:opacity-100 transition-opacity cursor-pointer">⭐</span>
                            ))}
                        </div>
                    </div>
                    <div className="font-mono opacity-60">ID: RC-{(docId || '').toUpperCase()}</div>
                </div>
            </div>

            {showAnswersForDoc(docId, () => (
                <div className="mt-12 p-8 border-4 border-emerald-100 bg-emerald-50 rounded-3xl print:border print:bg-white print:page-break-before-always relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full -mr-32 -mt-32 opacity-20" />

                    <div className="font-black text-emerald-900 mb-8 text-2xl flex items-center gap-3 relative z-10">
                        <span className="p-2 bg-emerald-200 rounded-xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </span>
                        Answer Key
                    </div>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {data.answers.map((answer, i) => {
                            const parts = String(answer).split(' (');
                            const main = parts[0];
                            const explanation = parts[1]?.replace(')', '');
                            return (
                                <div key={i} className="flex gap-4 p-4 bg-white/80 rounded-2xl border border-emerald-200 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-emerald-900 text-lg">{main}</div>
                                        {explanation && (
                                            <div className="text-emerald-600 italic text-sm mt-1 flex items-center gap-1">
                                                <span className="text-lg opacity-50">❝</span>
                                                {explanation}
                                                <span className="text-lg opacity-50">❞</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-emerald-200 flex justify-between items-center relative z-10">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            Official Wizqo Answer Key
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                            Verification: {docId.toUpperCase()}-{new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            ))}
        </WorksheetSectionWrapper>
    );
}
