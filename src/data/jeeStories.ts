import type { Level } from '../types/gameTypes';
import { STORY_DATABASE } from './scenarios';

export const jeeStories: Level[] = [
    {
        id: 'jee-day-1',
        day_number: 1,
        placeholder: false,
        scenarioId: 'jee-day-1',
        personality: 'Chirag Falor',
        age: 16,
        title: 'The YouTube Hole',
        description: 'Chirag Falor scored AIR 1 in JEE Advanced 2020 — the first student to do so while studying independently using MIT OpenCourseWare. He was 18. This is his story at 16, when the distraction almost won.',
        location: 'Pune, 2015',
        portrait: 'portrait-chirag-falor.png',
        background: 'bg-chirag-pune-2015.png',
        part1: {
            setup: "JEE is 2 years away. Chirag is brilliant — everyone knows it. But for 11 days he hasn't opened a single textbook. It started with one MIT lecture. Then physics documentaries. Then just YouTube. His Allen material sits untouched. Tonight his father asks how preparation is going. Chirag says fine.",
            choices: [
                { id: 'A', text: 'Close YouTube completely. Cold turkey. Set a phone lock for 30 days.' },
                { id: 'B', text: 'Tell his father the truth — lost and needs help restructuring.' },
                { id: 'C', text: 'Give himself 3 more days of research — convince himself it is learning.' }
            ],
            actualChoice: 'He told no one. Stayed up until 4AM and finished the entire Mechanics chapter in one night.',
            lessonTitle: 'The Binge Reset',
            lesson: 'Sometimes the guilt of wasting time creates more waste. One brutal all-nighter is not a strategy — but for some minds, it is the only reset that works.',
            reflections: {
                A: 'You chose control. Chirag chose chaos. Both can work — but only one is sustainable.',
                B: 'Vulnerability would have saved him two weeks. He chose pride instead.',
                C: 'Three more days became eleven. This is how months disappear.'
            }
        },
        part2: {
            setup: "Three weeks later. Chirag recovered and is back on track. But today his batch topper Rishi asks for notes from the chapters Chirag missed. Rishi is friendly — but if he gets the notes, he stays ahead. There is a test tomorrow.",
            choices: [
                { id: 'A', text: 'Share everything. Tell himself competition does not matter at this stage.' },
                { id: 'B', text: 'Say he has not finished his own notes yet. Technically not a lie.' },
                { id: 'C', text: 'Share half — easy chapters only, not where he found shortcuts.' }
            ],
            actualChoice: 'He shared everything. Then studied twice as hard that night. He believed his edge was his mind, not his notes.',
            lessonTitle: 'Abundance vs Scarcity',
            lesson: 'Protecting your notes protects nothing. Your real advantage is how you think, not what you have written down.',
            reflections: {
                A: 'Chirag\'s choice. Confidence that your mind is the real asset.',
                B: 'Safe. Human. But you will remember this small dishonesty longer than he will.',
                C: 'Neither generous nor strategic. The worst of both.'
            }
        }
    } as any,
    ...Array.from({ length: 14 }, (_, i) => {
        const day = i + 2;
        return {
            id: `jee-day-${day}`,
            day_number: day,
            title: 'Coming Soon',
            description: 'This story will unlock soon.',
            personality: '',
            placeholder: true,
            requiredStars: 0,
            year: 2024,
            age: 18,
            theme: 'JEE',
            archetype: 'Student',
            status: 'locked',
            isLocked: true,
            stars: 0,
            scenarioId: `jee-day-${day}`,
            avatarUrl: '/assets/avatar_business.png'
        } as Level;
    })
];

// Dynamically populate STORY_DATABASE for JEE stories so ScenarioGame plays them
jeeStories.forEach((level: any) => {
    if (level.part1 && level.part2) {
        STORY_DATABASE[level.scenarioId] = {
            title: level.title,
            frames: [
                {
                    id: 'intro',
                    bg: `/portraits/${level.background}`,
                    text: level.part1.setup,
                    choices: level.part1.choices.map((c: any) => ({
                        text: c.text,
                        next: `part1_result_${c.id}`,
                        score: 0,
                        feedbackTitle: "Reflection",
                        feedback: level.part1.reflections[c.id],
                        trait_impacts: { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
                    }))
                },
                ...level.part1.choices.map((c: any) => ({
                    id: `part1_result_${c.id}`,
                    bg: `/portraits/${level.background}`,
                    text: level.part1.actualChoice + "\n\n" + level.part1.lessonTitle + "\n" + level.part1.lesson,
                    choices: [
                        { 
                            text: "Continue", 
                            next: "part2_intro", 
                            score: 0, 
                            feedbackTitle: "", 
                            feedback: "",
                            trait_impacts: { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
                        }
                    ]
                })),
                {
                    id: 'part2_intro',
                    bg: `/portraits/${level.background}`,
                    text: level.part2.setup,
                    choices: level.part2.choices.map((c: any) => ({
                        text: c.text,
                        next: `part2_result_${c.id}`,
                        score: 0,
                        feedbackTitle: "Reflection",
                        feedback: level.part2.reflections[c.id],
                        trait_impacts: { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
                    }))
                },
                ...level.part2.choices.map((c: any) => ({
                    id: `part2_result_${c.id}`,
                    bg: `/portraits/${level.background}`,
                    text: level.part2.actualChoice,
                    choices: [
                        { 
                            text: "View Insight", 
                            next: "lesson", 
                            score: 0, 
                            feedbackTitle: "", 
                            feedback: "",
                            trait_impacts: { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
                        }
                    ]
                })),
                {
                    id: 'lesson',
                    bg: `/portraits/${level.background}`,
                    text: `LESSON: ${level.part2.lessonTitle}. ${level.part2.lesson}`,
                    choices: [
                        {
                            text: "Complete Journey",
                            next: 'COMPLETE',
                            score: 10,
                            feedbackTitle: "Mission Accomplished",
                            feedback: "",
                            trait_impacts: { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
                        }
                    ]
                }
            ]
        };
    }
});
