import type { Level } from '../types/gameTypes';

export const jeeStories: Level[] = Array.from({ length: 15 }, (_, i) => {
    const day = i + 1;
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
    };
});
