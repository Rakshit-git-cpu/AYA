import type { Level } from '../types/gameTypes';



export function generateLevels(_age: number): Level[] {
    // Clamp age to available content range (18-25)
    // const targetAge = Math.max(18, Math.min(25, age)); // Not using age-based skipping anymore if linear

    // Master List of ALL Levels
    const levels: Omit<Level, 'status' | 'isLocked' | 'stars'>[] = [
        // Age 17: P.V. Sindhu
        {
            id: 'lvl_17_sindhu', title: 'The Olympic Prelude', description: 'At 17, Sindhu faced the seemingly invincible Olympic gold medalist.',
            requiredStars: 0, year: 2012, age: 17, theme: 'Sports', archetype: 'The Challenger', personality: 'P.V. Sindhu',
            bio: 'A 17-year-old badminton prodigy facing a brutal match against the reigning Olympic champion, Li Xuerui.',
            fame: 'India\'s badminton icon and two-time Olympic medalist.',
            achievements: ['First Indian woman to win two Olympic medals', 'World Champion 2019', 'Padma Bhushan Awardee'],
            lesson: 'RESPECT for your opponent does not mean fearing them.',
            avatarUrl: '/assets/avatar_sindhu.jpg', scenarioId: 'lvl_age_17_sindhu',
            idolTraits: { discipline: 100, resilience: 95, risk: 75, leadership: 70, creativity: 80, empathy: 85, vision: 90 }
        },
        // Age 17: A.R. Rahman
        {
            id: 'lvl_17_rahman', title: 'The Silent Melody', description: 'At 17, a grieving son drops out of school to support his family through music.',
            requiredStars: 0, year: 1984, age: 17, theme: 'Arts', archetype: 'The Maestro', personality: 'A.R. Rahman',
            bio: 'Forced to become the breadwinner after his father\'s death, playing keyboards endlessly in studios.',
            fame: 'Two-time Academy Award-winning composer.',
            achievements: ['2 Academy Awards', '2 Grammy Awards', 'Padma Shri & Padma Bhushan Awardee'],
            lesson: 'SACRIFICE can forge the greatest talent.',
            avatarUrl: '/assets/avatar_rahman.jpg', scenarioId: 'lvl_age_17_rahman',
            idolTraits: { discipline: 95, resilience: 90, risk: 85, leadership: 80, creativity: 100, empathy: 95, vision: 98 }
        },
        // Age 17: Malala Yousafzai
        {
            id: 'lvl_17_malala', title: 'The Price of Peace', description: 'At 17, Malala won the Nobel Prize. But was the global spotlight worth the trauma?',
            requiredStars: 0, year: 2014, age: 17, theme: 'Activism', archetype: 'The Peacemaker', personality: 'Malala Yousafzai',
            bio: 'Surviving an assassination attempt to become the global face of girls\' education while trying to finish high school.',
            fame: 'Youngest-ever Nobel Prize laureate.',
            achievements: ['Nobel Peace Prize', 'UN Messenger of Peace', 'Bestselling Author'],
            lesson: 'PURPOSE transcends personal comfort.',
            avatarUrl: '/assets/avatar_malala.jpg', scenarioId: 'lvl_age_17_malala',
            idolTraits: { discipline: 90, resilience: 100, risk: 95, leadership: 95, creativity: 80, empathy: 100, vision: 95 }
        },
        // Age 17: Steve Jobs
        {
            id: 'lvl_17_jobs', title: 'The Dropout\'s Intuition', description: 'At 17, Jobs dropped out of Harvard to audit calligraphy classes.',
            requiredStars: 0, year: 1972, age: 17, theme: 'Tech', archetype: 'The Visionary', personality: 'Steve Jobs',
            bio: 'A college freshman wasting his working-class parents\' savings on an education that feels meaningless.',
            fame: 'Co-founder of Apple Inc. and pioneer of the personal computer revolution.',
            achievements: ['Created iPhone, Mac, iPad', 'Transformed Pixar Animation', 'Changed multiple industries permanently'],
            lesson: 'INTUITION is the compass when the map fails.',
            avatarUrl: '/assets/avatar_jobs.jpg', scenarioId: 'lvl_age_17_jobs',
            idolTraits: { discipline: 75, resilience: 90, risk: 100, leadership: 90, creativity: 100, empathy: 60, vision: 100 }
        },
        // Age 17: Indra Nooyi
        {
            id: 'lvl_17_nooyi', title: 'The Rulebreaker', description: 'At 17, a young Indian woman played in an all-girls rock band and broke every conventional rule.',
            requiredStars: 0, year: 1972, age: 17, theme: 'Business', archetype: 'The Executive', personality: 'Indra Nooyi',
            bio: 'A college student in conservative Madras joining a rock band and playing cricket against societal norms.',
            fame: 'Former CEO and Chairperson of PepsiCo.',
            achievements: ['Ranked consistently among World\'s 100 Most Powerful Women', 'Increased PepsiCo\'s revenue by 80%', 'Padma Bhushan Awardee'],
            lesson: 'AUTHENTICITY requires braving societal friction.',
            avatarUrl: '/assets/avatar_nooyi.jpg', scenarioId: 'lvl_age_17_nooyi',
            idolTraits: { discipline: 95, resilience: 90, risk: 90, leadership: 100, creativity: 85, empathy: 85, vision: 95 }
        },
        {
            id: 'lvl_18', title: 'The Beginning (Country)', description: 'At 18, Taylor faced a choice: Security or Authenticity.',
            requiredStars: 0, year: 2008, age: 18, theme: 'Music', archetype: 'The Artist', personality: 'Taylor Swift',
            bio: 'A country singer on the verge of crossover fame. She faces pressure to stay in her lane.',
            fame: 'The biggest pop star in the world.',
            achievements: ['14 Grammy Awards', 'Only artist to win Album of the Year 4 times', 'Billionaire from music alone'],
            lesson: 'COURAGE to pivot when everyone tells you to stay safe.',
            avatarUrl: '/assets/avatar_taylor_swift.png', scenarioId: 'lvl_age_18',
            idolTraits: { discipline: 80, resilience: 85, risk: 70, leadership: 60, creativity: 90, empathy: 95, vision: 80 }
        },
        // Age 18: Virat Kohli
        {
            id: 'lvl_18_kohli', title: 'The King\'s Promise', description: 'At 18, Virat faced the ultimate test of duty and grief.',
            requiredStars: 0, year: 2006, age: 18, theme: 'Sports', archetype: 'The King', personality: 'Virat Kohli',
            bio: 'A rising cricketing star who loses his father in the middle of a crucial match.',
            fame: 'One of the greatest batsmen in cricket history.',
            achievements: ['Most runs in a single IPL season', 'Fastest to 10k ODI runs', 'World Cup Winner'],
            lesson: 'DUTY to team and self in the face of unimaginable grief.',
            avatarUrl: '/assets/avatar_virat_kohli.jpg', scenarioId: 'lvl_age_18_kohli',
            idolTraits: { discipline: 95, resilience: 100, risk: 85, leadership: 90, creativity: 75, empathy: 70, vision: 85 }
        },
        // Age 18: Dr. A.P.J. Abdul Kalam
        {
            id: 'lvl_18_kalam', title: 'The Big Leap', description: 'At 18, Kalam left his humble town for a prestigious college.',
            requiredStars: 0, year: 1949, age: 18, theme: 'Education', archetype: 'The Visionary', personality: 'Dr. A.P.J. Abdul Kalam',
            bio: 'A brilliant student from a modest background facing the intimidating world of city-bred prodigies.',
            fame: 'The Missile Man of India, 11th President of India.',
            achievements: ['Developed India\'s missile program', 'Bharat Ratna Awardee', 'Beloved People\'s President'],
            lesson: 'SELF-BELIEF is stronger than circumstances.',
            avatarUrl: '/assets/avatar_apj_kalam.jpg', scenarioId: 'lvl_age_18_kalam',
            idolTraits: { discipline: 98, resilience: 95, risk: 70, leadership: 90, creativity: 95, empathy: 100, vision: 100 }
        },
        // Age 18: Ratan Tata
        {
            id: 'lvl_18_tata', title: 'The Defiant Blueprint', description: 'At 18, Ratan chose architecture over his father\'s engineering dreams.',
            requiredStars: 0, year: 1955, age: 18, theme: 'Business', archetype: 'The Patriarch', personality: 'Ratan Tata',
            bio: 'A young heir who defies family pressure to study what he truly loves.',
            fame: 'Iconic leader of the Tata Group.',
            achievements: ['Grew Tata Group revenues 40X', 'Acquired Jaguar Land Rover & Tetley', 'Padma Vibhushan Awardee'],
            lesson: 'AUTHENTICITY over expectation.',
            avatarUrl: '/assets/avatar_ratan_tata.jpg', scenarioId: 'lvl_age_18_tata',
            idolTraits: { discipline: 90, resilience: 90, risk: 85, leadership: 100, creativity: 85, empathy: 95, vision: 98 }
        },
        {
            id: 'lvl_19', title: 'The Visionary', description: 'At 19, Mark had to choose between Harvard and his side project.',
            requiredStars: 3, year: 2004, age: 19, theme: 'Tech', archetype: 'The Founder', personality: 'Mark Zuckerberg',
            bio: 'A Harvard sophomore with a little website called "The Facebook".',
            fame: 'Connects 3 billion people daily.',
            achievements: ['Founder of Facebook', 'Youngest self-made billionaire', 'Revolutionized social media'],
            lesson: 'RISK taking when the "safe path" (Harvard) looks perfect.',
            avatarUrl: '/assets/avatar_zuck.jpg', scenarioId: 'lvl_age_19', // Placeholder avatar
            idolTraits: { discipline: 90, resilience: 80, risk: 95, leadership: 85, creativity: 75, empathy: 40, vision: 99 }
        },
        // Age 19: Sachin Tendulkar
        {
            id: 'lvl_19_sachin', title: 'The Trial of Fire', description: 'At 19, you must face the most lethal fast bowlers on Earth.',
            requiredStars: 0, year: 1992, age: 19, theme: 'Sports', archetype: 'The Prodigy', personality: 'Sachin Tendulkar',
            bio: 'A teenage prodigy entrusted with the hopes of a billion people on the fiercest cricket pitch in the world.',
            fame: 'The God of Cricket.',
            achievements: ['100 International Centuries', 'Bharat Ratna Awardee', 'Highest run-scorer in cricket history'],
            lesson: 'COURAGE to stand your ground when veterans fall.',
            avatarUrl: '/assets/avatar_sachin.jpg', scenarioId: 'lvl_age_19_sachin',
            idolTraits: { discipline: 100, resilience: 98, risk: 80, leadership: 85, creativity: 95, empathy: 85, vision: 90 }
        },
        // Age 19: Sundar Pichai
        {
            id: 'lvl_19_sundar', title: 'The Divided Mind', description: 'At 19, the pressure of IIT threatens to crush your curiosity.',
            requiredStars: 0, year: 1991, age: 19, theme: 'Tech', archetype: 'The Explorer', personality: 'Sundar Pichai',
            bio: 'An introverted student at IIT Kharagpur, fascinated by computers but drowning in metallurgical coursework.',
            fame: 'CEO of Google and Alphabet.',
            achievements: ['Led development of Google Chrome', 'Became CEO of Alphabet', 'Padma Bhushan Awardee'],
            lesson: 'CURIOSITY to explore outside the assigned path.',
            avatarUrl: '/assets/avatar_sundar.jpg', scenarioId: 'lvl_age_19_sundar',
            idolTraits: { discipline: 95, resilience: 90, risk: 70, leadership: 95, creativity: 85, empathy: 90, vision: 95 }
        },
        // Age 19: Shah Rukh Khan
        {
            id: 'lvl_19_srk', title: 'A Stage For Grief', description: 'At 19, you lose your father and immerse yourself in the chaotic world of theatre.',
            requiredStars: 0, year: 1984, age: 19, theme: 'Arts', archetype: 'The Entertainer', personality: 'Shah Rukh Khan',
            bio: 'A grieving economics student who finds solace and explosive energy under the lights of Delhi theatre.',
            fame: 'The King of Bollywood. Global Icon.',
            achievements: ['14 Filmfare Awards', 'Padma Shri Awardee', 'One of the most recognized actors internationally'],
            lesson: 'PASSION as the ultimate antidote to despair.',
            avatarUrl: '/assets/avatar_srk.jpg', scenarioId: 'lvl_age_19_srk',
            idolTraits: { discipline: 85, resilience: 100, risk: 90, leadership: 90, creativity: 98, empathy: 95, vision: 85 }
        },
        // Age 20: Kobe
        {
            id: 'lvl_20_kobe',
            title: 'The Mamba',
            description: 'At 20, Kobe chose the gym over the party.',
            requiredStars: 6, year: 1998, age: 20, theme: 'Sports', archetype: 'The Mamba', personality: 'Kobe Bryant',
            bio: 'A young NBA prodigy who realizes talent isnt enough.',
            fame: 'One of the greatest basketball players ever.',
            achievements: ['5-time NBA Champion', '18-time All-Star', 'Oscar Winner (Dear Basketball)'],
            lesson: 'DISCIPLINE to do the boring work when no one is watching.',
            avatarUrl: '/assets/avatar_kobe.png', scenarioId: 'lvl_age_20_sports',
            idolTraits: { discipline: 100, resilience: 100, risk: 75, leadership: 88, creativity: 70, empathy: 60, vision: 85 }
        },
        // Age 20: NV Sir
        {
            id: 'lvl_20_nv_sir',
            title: 'The Educator\'s Dilemma',
            description: 'At 20, NV Sir chose teaching over immediate financial relief.',
            requiredStars: 6, year: 2003, age: 20, theme: 'Education', archetype: 'The Mentor', personality: 'Nitin Vijay (NV Sir)',
            bio: 'An aspiring engineer whose family needs financial support NOW.',
            fame: 'One of the most loved Physics teachers in India.',
            achievements: ['Founder of Motion Education', 'Mentored thousands of IITians', 'Revolutionized online teaching'],
            lesson: 'LONG-TERM VISION beats short-term comfort.',
            avatarUrl: '/assets/avatar_nv_sir.jpg', scenarioId: 'lvl_age_20_nv_sir',
            idolTraits: { discipline: 90, resilience: 95, risk: 85, leadership: 90, creativity: 80, empathy: 95, vision: 100 }
        },
        // Age 20: Taylor (Soloist)
        {
            id: 'lvl_20_taylor',
            title: 'The Soloist',
            description: 'At 20, Taylor faced critics who said she had ghostwriters.',
            requiredStars: 6, year: 2010, age: 20, theme: 'Music', archetype: 'The Soloist', personality: 'Taylor Swift',
            bio: 'Already a star, but critics say shes a fake. She needs to prove her voice is hers.',
            fame: 'The biggest pop star in the world.',
            achievements: ['Wrote "Speak Now" album entirely alone', 'Highest-grossing tour in history', 'Time Person of the Year'],
            lesson: 'OWNERSHIP of your work and your narrative.',
            avatarUrl: '/assets/avatar_taylor_swift.png', scenarioId: 'lvl_age_20_music',
            idolTraits: { discipline: 88, resilience: 90, risk: 75, leadership: 80, creativity: 98, empathy: 95, vision: 85 }
        },
        // Age 20: Frida
        {
            id: 'lvl_20_frida',
            title: 'The Icon',
            description: 'At 20, Frida painted from her bed in pain.',
            requiredStars: 6, year: 1927, age: 20, theme: 'Art', archetype: 'The Icon', personality: 'Frida Kahlo',
            bio: 'Bedridden after a tragic bus accident. Her body is broken, but her spirit is vivid.',
            fame: 'Mexico\'s most famous artist.',
            achievements: ['First Mexican artist in the Louvre', 'Icon of feminism and LGBTQ+', 'Master of self-portraits'],
            lesson: 'RESILIENCE to turn pain into power and art.',
            avatarUrl: '/assets/avatar_frida.png', scenarioId: 'lvl_age_20_art',
            idolTraits: { discipline: 70, resilience: 100, risk: 80, leadership: 70, creativity: 99, empathy: 95, vision: 80 }
        },
        // Age 20: Arnold
        {
            id: 'lvl_20_arnold',
            title: 'The AWOL Gamble',
            description: 'At 20, Arnold escaped the army to chase a dream.',
            requiredStars: 6, year: 1967, age: 20, theme: 'Sports', archetype: 'The Terminator', personality: 'Arnold Schwarzenegger',
            bio: 'A tank driver in the Austrian Army who dreams of being the strongest man on Earth.',
            fame: 'Action Hero, Governor, Bodybuilder.',
            achievements: ['7-time Mr. Olympia', 'Highest paid actor of the 90s', 'Governor of California'],
            lesson: 'VISION that is so clear, defying authority becomes a necessity.',
            avatarUrl: '/assets/avatar_arnold.jpg', scenarioId: 'scenario_arnold_awol',
            idolTraits: { discipline: 95, resilience: 90, risk: 90, leadership: 90, creativity: 60, empathy: 60, vision: 100 }
        },
        // Age 20: Hawking
        {
            id: 'lvl_20_hawking',
            title: 'The Death Sentence',
            description: 'At 20, Stephen was given 2 years to live.',
            requiredStars: 6, year: 1962, age: 20, theme: 'Science', archetype: 'The Genius', personality: 'Stephen Hawking',
            bio: 'A brilliant PhD student whose own body becomes his prison.',
            fame: 'Solved the mysteries of the universe.',
            achievements: ['Discovered Hawking Radiation', 'Author of A Brief History of Time', 'Lived 55 years longer than predicted'],
            lesson: 'PURPOSE to find infinite space within a finite time.',
            avatarUrl: '/assets/avatar_hawking.png', scenarioId: 'scenario_hawking_diagnosis',
            idolTraits: { discipline: 95, resilience: 100, risk: 60, leadership: 85, creativity: 95, empathy: 75, vision: 100 }
        },
        // Age 20: Mary Shelley
        {
            id: 'lvl_20_shelley',
            title: 'The Monster\'s Birth',
            description: 'At 20, Mary wrote the first sci-fi novel during a storm.',
            requiredStars: 6, year: 1817, age: 20, theme: 'Writing', archetype: 'The Creator', personality: 'Mary Shelley',
            bio: 'The daughter of radicals who created a monster that outlived them all.',
            fame: 'Author of Frankenstein.',
            achievements: ['Invented Science Fiction', 'Wrote Frankenstein at 19', 'Literary Icon'],
            lesson: 'IMAGINATION to look into the darkness.',
            avatarUrl: '/assets/avatar_mary_shelley.jpg', scenarioId: 'lvl_age_20_literature',
            idolTraits: { discipline: 85, resilience: 90, risk: 85, leadership: 70, creativity: 100, empathy: 95, vision: 90 }
        },
        // Age 20: Steven Spielberg
        {
            id: 'lvl_20_spielberg',
            title: 'The Director',
            description: 'At 20, Steven sneaked into Universal Studios and pretended he worked there.',
            requiredStars: 6, year: 1966, age: 20, theme: 'Cinema', archetype: 'The Director', personality: 'Steven Spielberg',
            bio: 'A college reject who refused to take no for an answer.',
            fame: 'Most successful director in history.',
            achievements: ['3 Academy Awards', 'Creator of the Blockbuster', 'Co-founded DreamWorks'],
            lesson: 'AUDACITY to authorize yourself.',
            avatarUrl: '/assets/avatar_spielberg_young.jpg', scenarioId: 'lvl_age_20_cinema',
            idolTraits: { discipline: 90, resilience: 95, risk: 90, leadership: 95, creativity: 100, empathy: 85, vision: 100 }
        },
        // Age 20: Bill Gates (Default)
        {
            id: 'lvl_20_gate',
            title: 'The Architect',
            description: 'At 20, Bill saw the future and had to bluff his way into it.',
            requiredStars: 6, year: 1975, age: 20, theme: 'Tech', archetype: 'The Architect', personality: 'Bill Gates',
            bio: 'A dropout selling software he hasn\'t written yet to a company he\'s never visited.',
            fame: 'Founder of Microsoft.',
            achievements: ['The richest man in the world for 18 years', 'Revolutionized Personal Computing', 'Major Philanthropist'],
            lesson: 'CONFIDENCE to bet on yourself before you are ready.',
            avatarUrl: '/assets/avatar_bill_gates.png', scenarioId: 'lvl_age_20',
            idolTraits: { discipline: 92, resilience: 85, risk: 90, leadership: 95, creativity: 85, empathy: 70, vision: 98 }
        },
        // Age 21
        {
            id: 'lvl_21', title: 'The Rebel', description: 'At 21, Steve started a company in a garage with no money.',
            requiredStars: 9, year: 1976, age: 21, theme: 'Tech', archetype: 'The Rebel', personality: 'Steve Jobs',
            bio: 'Hippy, fruitarian, and dropout. He sees personal computers as a bicycle for the mind.',
            fame: 'Co-Founder of Apple.',
            achievements: ['Created iPhone, Mac, and Pixar', 'Changed 5 industries forever', 'Design genius'],
            lesson: 'SIMPLICITY in a world of clutter and noise.',
            avatarUrl: '/assets/avatar_steve_jobs.png', scenarioId: 'lvl_age_21',
            idolTraits: { discipline: 85, resilience: 90, risk: 95, leadership: 90, creativity: 100, empathy: 50, vision: 100 }
        },
        {
            id: 'lvl_22', title: 'The Dreamer', description: 'At 22, Walt lost everything and drew a mouse on a train.',
            requiredStars: 12, year: 1923, age: 22, theme: 'Art', archetype: 'The Dreamer', personality: 'Walt Disney',
            bio: 'Bankrupt cartoonist. He has a one-way ticket to Hollywood and $40 in his pocket.',
            fame: 'Creator of the Disney Magic.',
            achievements: ['Winner of 22 Academy Awards', 'Creator of Mickey Mouse', 'Built Disneyland'],
            lesson: 'IMAGINATION to see a kingdom where others see a blank page.',
            avatarUrl: '/assets/avatar_walt_disney.png', scenarioId: 'lvl_age_22',
            idolTraits: { discipline: 85, resilience: 95, risk: 90, leadership: 85, creativity: 100, empathy: 85, vision: 100 }
        },
        {
            id: 'lvl_23', title: 'The Voice', description: 'At 23, Oprah was fired for being too emotional. It was a gift.',
            requiredStars: 15, year: 1977, age: 23, theme: 'Media', archetype: 'The Voice', personality: 'Oprah Winfrey',
            bio: 'An evening news anchor who creates too much connection with the stories.',
            fame: 'Queen of Media.',
            achievements: ['First black female billionaire', 'Highest-rated talk show in history', 'Presidential Medal of Freedom'],
            lesson: 'AUTHENTICITY is your superpower, not your weakness.',
            avatarUrl: '/assets/avatar_oprah.png', scenarioId: 'lvl_age_23',
            idolTraits: { discipline: 88, resilience: 92, risk: 80, leadership: 90, creativity: 85, empathy: 100, vision: 90 }
        },
        // Age 24: Tina Dabi (Story 1)
        {
            id: 'lvl_24_tina_1', title: 'The College Sacrifice', description: 'At 21, Tina had to choose between social life and The Hindu.',
            requiredStars: 18, year: 2014, age: 24, theme: 'Civil Services', archetype: 'The Strategist', personality: 'Tina Dabi',
            bio: 'A college student with a singular goal: The hardest exam in the world.',
            fame: 'UPSC Topper (AIR 1, 2015).',
            achievements: ['Cleared UPSC at age 22', 'First attempt topper', 'Inspiration to millions of aspirants'],
            lesson: 'SACRIFICE of the good (fun) for the great (legacy).',
            avatarUrl: '/assets/avatar_tina_dabi.png', scenarioId: 'scenario_upsc_tina_college',
            idolTraits: { discipline: 98, resilience: 95, risk: 60, leadership: 85, creativity: 65, empathy: 80, vision: 90 }
        },
        {
            id: 'lvl_25', title: 'The Storyteller', description: 'At 25, J.K. Rowling got the idea for Harry Potter on a delayed train.',
            requiredStars: 21, year: 1990, age: 25, theme: 'Writing', archetype: 'The Storyteller', personality: 'J.K. Rowling',
            bio: 'A secretary day-dreaming about wizards on a 4-hour delayed train to London.',
            fame: 'Author of Harry Potter.',
            achievements: ['Best-selling book series in history', 'First billionaire author', 'Defined a generation of readers'],
            lesson: 'CREATIVITY strikes in the quiet moments of life.',
            avatarUrl: '/assets/avatar_jk_rowling.png', scenarioId: 'lvl_age_25',
            idolTraits: { discipline: 85, resilience: 98, risk: 85, leadership: 75, creativity: 100, empathy: 90, vision: 95 }
        }
    ];

    // Instead of isolating the user to only one age group,
    // we return the entire timeline of scenarios mapped together into a massive journey.
    return levels.map((l) => {
        // Unlock all levels initially for testing and immediate availability
        return {
            ...l,
            status: 'unlocked',
            isLocked: false,
            stars: 0
        } as Level;
    });
}
