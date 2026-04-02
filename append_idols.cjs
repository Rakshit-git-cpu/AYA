const fs = require('fs');

const appendText = `,
    "P.V. Sindhu": {
        name: "P.V. Sindhu",
        archetypeTitle: "The Challenger",
        quote: "The greatest risk is not taking any at all.",
        voice: {
            tone: "Focused, Intense, Determined",
            intro: "Your mind is your fiercest weapon on the court of life."
        },
        missions: {
            discipline: { title: "Unbreakable Routine", desc: "Stick to your hardest habit for 3 days straight.", xp: "+50 Discipline" },
            resilience: { title: "Bouncing Back", desc: "Recover instantly from a minor failure today.", xp: "+50 Recovery" },
            risk: { title: "The Bold Smash", desc: "Take a calculated risk in a conversation.", xp: "+50 Boldness" },
            leadership: { title: "Lead by Example", desc: "Work harder than anyone else in your group today.", xp: "+50 Influence" },
            creativity: { title: "Court Vision", desc: "Find a new angle to approach a stubborn problem.", xp: "+50 Insight" },
            empathy: { title: "Silent Respect", desc: "Acknowledge a rival's strength without feeling inferior.", xp: "+50 Grace" },
            vision: { title: "The Finish Line", desc: "Visualize your ultimate victory before sleeping.", xp: "+50 Focus" }
        },
        profile: {
            motivation: 'Legacy',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Competitor',
            passion: 'Driven',
            coreValue: 'Excellence'
        },
        avatarUrl: '/assets/avatar_sindhu.jpg'
    },
    "A.R. Rahman": {
        name: "A.R. Rahman",
        archetypeTitle: "The Maestro",
        quote: "All my life I had a choice of hate and love. I chose love.",
        voice: {
            tone: "Calm, Spiritual, Soulful",
            intro: "Listen to the silence between the notes. That is where your path lies."
        },
        missions: {
            discipline: { title: "The Midnight Studio", desc: "Dedicate 2 hours of deep work late at night or early morning.", xp: "+50 Focus" },
            resilience: { title: "Endless Keys", desc: "Keep working on a project when you feel creatively empty.", xp: "+50 Endurance" },
            risk: { title: "New Sounds", desc: "Merge two completely opposing ideas together.", xp: "+50 Innovation" },
            leadership: { title: "Harmonic Leader", desc: "Bring two conflicting people into agreement.", xp: "+50 Harmony" },
            creativity: { title: "The Soundtrack", desc: "Create something beautiful out of a mundane thought.", xp: "+50 Artistry" },
            empathy: { title: "Universal Language", desc: "Connect with someone whose background is entirely different from yours.", xp: "+50 Connection" },
            vision: { title: "The Global Stage", desc: "Imagine your work being appreciated by millions.", xp: "+50 Grandeur" }
        },
        profile: {
            motivation: 'Art',
            risk: 'Balanced',
            emotional: 'Calm',
            social: 'Collaborator',
            passion: 'Creative',
            coreValue: 'Love'
        },
        avatarUrl: '/assets/avatar_rahman.jpg'
    },
    "Malala Yousafzai": {
        name: "Malala Yousafzai",
        archetypeTitle: "The Peacemaker",
        quote: "One child, one teacher, one book, one pen can change the world.",
        voice: {
            tone: "Brave, Compassionate, Unwavering",
            intro: "Your voice is more powerful than any weapon. Will you use it?"
        },
        missions: {
            discipline: { title: "The Power of Pages", desc: "Read something challenging outside your comfort zone.", xp: "+50 Intellect" },
            resilience: { title: "Unbreakable", desc: "Stand fast when someone tries to silence your opinion.", xp: "+50 Courage" },
            risk: { title: "Speak Truth", desc: "Speak out against a small injustice today.", xp: "+50 Bravery" },
            leadership: { title: "The Advocate", desc: "Stand up for someone who cannot stand up for themselves.", xp: "+50 Justice" },
            creativity: { title: "The Global Classroom", desc: "Teach someone a complex idea using an analogy.", xp: "+50 Wisdom" },
            empathy: { title: "Open Eyes", desc: "Listen deeply to the struggle of a stranger.", xp: "+50 Compassion" },
            vision: { title: "World Peace", desc: "Write out how you intend to leave the world a better place.", xp: "+50 Purpose" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Courageous',
            emotional: 'Resilient',
            social: 'Advocate',
            passion: 'Empathetic',
            coreValue: 'Equality'
        },
        avatarUrl: '/assets/avatar_malala.jpg'
    },
    "Steve Jobs": {
        name: "Steve Jobs",
        archetypeTitle: "The Visionary",
        quote: "Stay hungry, stay foolish.",
        voice: {
            tone: "Intense, Demanding, Brilliant",
            intro: "The people who are crazy enough to think they can change the world are the ones who do."
        },
        missions: {
            discipline: { title: "Relentless Polish", desc: "Refine a project until it is absolutely perfect.", xp: "+50 Excellence" },
            resilience: { title: "The Dropout's Grind", desc: "Recover from a public rejection.", xp: "+50 Grit" },
            risk: { title: "Think Different", desc: "Abandon a safe idea for a wildly ambitious one.", xp: "+50 Audacity" },
            leadership: { title: "Reality Distortion", desc: "Convince someone to believe in an 'impossible' timeline.", xp: "+50 Influence" },
            creativity: { title: "Connect the Dots", desc: "Apply a lesson from art to a logical problem.", xp: "+50 Genius" },
            empathy: { title: "User Experience", desc: "Anticipate someone else's unexpressed need.", xp: "+50 Intuition" },
            vision: { title: "Dent in the Universe", desc: "Dream up a product or service that changes an industry.", xp: "+50 Foresight" }
        },
        profile: {
            motivation: 'Innovation',
            risk: 'Reckless',
            emotional: 'Intense',
            social: 'Dictator',
            passion: 'Obsessive',
            coreValue: 'Perfection'
        },
        avatarUrl: '/assets/avatar_jobs.jpg'
    },
    "Indra Nooyi": {
        name: "Indra Nooyi",
        archetypeTitle: "The Executive",
        quote: "Leadership is hard to define and good leadership even harder. But if you can get people to follow you to the ends of the earth, you are a great leader.",
        voice: {
            tone: "Sharp, Pragmatic, Inspiring",
            intro: "Break the rules, but do it elegantly and with absolute competence."
        },
        missions: {
            discipline: { title: "The List", desc: "Plan out your entire week down to the hour.", xp: "+50 Efficiency" },
            resilience: { title: "Thick Skin", desc: "Accept harsh criticism without defending yourself, and extract the truth from it.", xp: "+50 Poise" },
            risk: { title: "The Rebel Pitch", desc: "Pitch a disruptive idea to someone in authority.", xp: "+50 Disruption" },
            leadership: { title: "The Conductor", desc: "Organize exactly who is doing what in a group task.", xp: "+50 Management" },
            creativity: { title: "Design Thinking", desc: "Merge the aesthetics of a product with its raw functionality.", xp: "+50 Strategy" },
            empathy: { title: "The Letter", desc: "Write a note of gratitude to the people who support you behind the scenes.", xp: "+50 Grace" },
            vision: { title: "Future Proof", desc: "Identify a trend that will dominate 10 years from now.", xp: "+50 Foresight" }
        },
        profile: {
            motivation: 'Power',
            risk: 'Calculated',
            emotional: 'Poised',
            social: 'Leader',
            passion: 'Strategic',
            coreValue: 'Performance'
        },
        avatarUrl: '/assets/avatar_nooyi.jpg'
    }`;

let content = fs.readFileSync('src/data/idolMindsets.ts', 'utf8');
content = content.replace(/\n\s*\}\s*;\s*$/, appendText + '\n};\n');
fs.writeFileSync('src/data/idolMindsets.ts', content);
console.log('Appended 5 idol mindsets');
