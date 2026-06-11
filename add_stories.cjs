const fs = require('fs');

const newScenarios = `
    // AGE 16: Chirag Falor
    'lvl_age_16_chirag': {
        title: "The YouTube Hole",
        source: "Source: Pune, 2015. JEE is 2 years away.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "Pune, 2015. JEE is 2 years away.\\n\\nChirag is brilliant. Everyone knows it. But for the last 11 days he hasn't opened a single textbook. It started with one MIT lecture video. Then physics documentaries. Then just... YouTube.\\n\\nHis Allen study material sits untouched. His friends are 3 chapters ahead.\\n\\nTonight his father asks how preparation is going. Chirag says \\"fine.\\"",
                choices: [
                    {
                        text: "A) Closes YouTube completely. Cold turkey. Sets a phone lock for 30 days.",
                        next: 'part1_reveal',
                        score: -5,
                        feedbackTitle: "Control vs Chaos",
                        feedback: "You chose control. Chirag chose chaos. Both can work — but only one is sustainable."
                    },
                    {
                        text: "B) Tells his father the truth — he's lost and needs help restructuring.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Pride",
                        feedback: "Vulnerability would have saved him two weeks. He chose pride instead."
                    },
                    {
                        text: "C) Gives himself 3 more days of \\"research\\" — convinces himself it's learning.",
                        next: 'part1_reveal',
                        score: -10,
                        feedbackTitle: "Slipping",
                        feedback: "Three more days became eleven. This is how months disappear."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "What Chirag actually did: He told no one. Stayed up until 4AM and finished the entire Mechanics chapter in one night. Then collapsed and slept through the next day.\\n\\nLESSON: The Binge Reset\\nSometimes the guilt of wasting time creates more waste. One brutal all-nighter isn't a strategy — but for some minds, it's the only reset that works.",
                choices: [
                    { text: "Three weeks later...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "Three weeks later.\\n\\nChirag recovered. He's back on track. But today his batch topper Rishi asked him to share notes from the chapters Chirag missed.\\n\\nRishi is friendly. But if Rishi gets his notes, Rishi stays ahead. There's a test tomorrow.",
                choices: [
                    {
                        text: "A) Shares everything. Tells himself competition doesn't matter yet.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "True Confidence",
                        feedback: "Chirag's choice. Confidence that your mind is the real asset."
                    },
                    {
                        text: "B) Says he hasn't finished his own notes yet. Technically not a lie.",
                        next: 'success',
                        score: -5,
                        feedbackTitle: "Small Dishonesty",
                        feedback: "Safe. Human. But you'll remember this small dishonesty longer than he will."
                    },
                    {
                        text: "C) Shares half — easy chapters only, not where he found shortcuts.",
                        next: 'success',
                        score: -10,
                        feedbackTitle: "The Worst of Both",
                        feedback: "Neither generous nor strategic. The worst of both."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-chirag-falor.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What Chirag actually did: He shared everything. Then studied twice as hard that night. He believed his edge was his mind, not his notes.\\n\\nLESSON: Abundance vs Scarcity\\nProtecting your notes protects nothing. Your real advantage is how you think, not what you've written down.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Mission Accomplished", feedback: "" }
                ]
            }
        ]
    },

    // AGE 16: Kota Kid
    'lvl_age_16_kota_kid': {
        title: "First Month in Kota",
        source: "Source: Kota, Rajasthan. September 2018.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "Kota, Rajasthan. September 2018.\\n\\nArjun left his home in Nagpur 28 days ago. His hostel room smells like instant noodles and anxiety. His roommate studies 14 hours a day and hasn't spoken a full sentence to him.\\n\\nIn his first Allen test he ranked 340 out of 400.\\n\\nTonight his mother calls: \\"Beta, should we bring you home?\\"",
                choices: [
                    {
                        text: "A) \\"Yes. I'm not okay. Come get me.\\"",
                        next: 'part1_reveal',
                        score: -5,
                        feedbackTitle: "The First Wall",
                        feedback: "Honest and brave. But Kota only works if you stay long enough to break through the first wall."
                    },
                    {
                        text: "B) \\"I'm fine Maa. Don't worry.\\" Hangs up. Cries quietly.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "The Common Pain",
                        feedback: "What most people do. The pain is real. The hiding is too."
                    },
                    {
                        text: "C) \\"Give me 30 more days. If nothing changes, I'll come home myself.\\"",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "A Dangerous Negotiation",
                        feedback: "A negotiation with yourself. The most dangerous and effective kind."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "What he actually did: He said he was fine. He wasn't. But those words kept him there — and that mattered.\\n\\nLESSON: The Lie That Saved Him\\nSometimes the commitment you make to someone else — even falsely — keeps you standing when nothing else does.",
                choices: [
                    { text: "Two weeks later...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "Two weeks later. Rank improved — 340 to 280.\\n\\nHis parents sent ₹500 extra \\"for something nice.\\" His roommate is going to a movie with batch friends. They invited Arjun.\\n\\nFirst real social moment in 6 weeks. Test is in 4 days. His Organic Chemistry is still weak.",
                choices: [
                    {
                        text: "A) Goes to the movie. Mental health is preparation too.",
                        next: 'success',
                        score: 5,
                        feedbackTitle: "Isolation is Dangerous",
                        feedback: "Valid. Isolation kills more JEE dreams than movies do."
                    },
                    {
                        text: "B) Stays in. Orders food with the ₹500. Studies Organic all night.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Trade",
                        feedback: "His choice. Biryani included. No regrets if the rank moves."
                    },
                    {
                        text: "C) Goes for 2 hours, leaves early, comes back and studies.",
                        next: 'success',
                        score: -5,
                        feedbackTitle: "The Illusion of Balance",
                        feedback: "Sounds balanced. Usually means you enjoy neither fully."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-kota-kid.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What he actually did: Stayed in. Ordered biryani. Studied. Ranked 198 in the next test.\\n\\nLESSON: The Trade\\nEvery choice in Kota is a trade. He didn't choose studying over fun — he chose his future self over his present one.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Moving Up", feedback: "" }
                ]
            }
        ]
    },

    // AGE 17: Kalpit Veerwal
    'lvl_age_17_kalpit': {
        title: "The Perfect Score Obsession",
        source: "Source: Udaipur, 2016.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-kalpit-veerwal-udaipur-study.png.jpg',
                text: "Udaipur, 2016.\\n\\nKalpit has decided he will score 360 out of 360. Not top rank. Perfect score. His teachers say it's impossible.\\n\\nIt's 1AM. He just found a mistake in his Chemistry revision — a concept he thought he knew perfectly. He's been awake 19 hours.",
                choices: [
                    {
                        text: "A) Fixes the concept now. Sleeps at 3AM. Wakes at 6AM as usual.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Disciplined",
                        feedback: "Disciplined. Sustainable. Almost what he did."
                    },
                    {
                        text: "B) Marks it, sleeps immediately, fixes it fresh in the morning.",
                        next: 'part1_reveal',
                        score: -5,
                        feedbackTitle: "The 'Tomorrow' Trap",
                        feedback: "Smart recovery. But 'I'll do it tomorrow' has killed more toppers than late nights."
                    },
                    {
                        text: "C) Stays up until the concept feels truly perfect. However long that takes.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "The Extremist",
                        feedback: "His actual choice. Works if your body can handle it. Most can't."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-kalpit-veerwal-udaipur-study.png.jpg',
                text: "What Kalpit actually did: Fixed it completely before sleeping — 3AM. Then woke at 6AM. He believed sleep-deprived mastery beat rested confusion.\\n\\nLESSON: The Perfectionist's Trap\\nPerfection has a cost. Kalpit paid it in sleep. The question isn't whether perfection is worth it — it's whether you can afford the price every single night.",
                choices: [
                    { text: "4 months later...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-kalpit-veerwal-udaipur-study.png.jpg',
                text: "4 months before JEE Mains.\\n\\nMock scores: 340, 347, 338, 351. Never 360.\\n\\nHis coaching teacher says: \\"Stop chasing 360. You're wasting energy on the last 10 marks that could secure your first 340.\\"\\n\\nHis father agrees. His best friend agrees. Everyone agrees except Kalpit.",
                choices: [
                    {
                        text: "A) Listens to them. Shifts focus to consistency over perfection.",
                        next: 'success',
                        score: 5,
                        feedbackTitle: "Reasonable",
                        feedback: "Reasonable. Would have gotten AIR 1 anyway. But not the 360."
                    },
                    {
                        text: "B) Nods, says nothing, keeps chasing 360 privately.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Unusual Certainty",
                        feedback: "His choice. Requires an unusual relationship with your own certainty."
                    },
                    {
                        text: "C) Explains his logic directly and asks them to trust him.",
                        next: 'success',
                        score: -5,
                        feedbackTitle: "Vulnerable to Doubt",
                        feedback: "Respectable. But some convictions don't survive explanation."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-kalpit-veerwal.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What Kalpit actually did: He smiled and said nothing. Then kept chasing 360. He scored 360 on JEE Mains 2017. First in history.\\n\\nLESSON: Lonely Conviction\\nThe people who love you give safe advice. Safe advice produces safe results. Know when your vision requires you to be alone in it.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "History Made", feedback: "" }
                ]
            }
        ]
    },

    // AGE 17: Kota Kid
    'lvl_age_17_kota_kid': {
        title: "The Comparison Spiral",
        source: "Source: Kota. January 2019.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "Kota. January 2019.\\n\\nSecond year. Arjun is consistently top 80. But his batchmate Shubham ranks top 5 every single test. Same hostel. Same coaching. Different universe.\\n\\nArjun starts timing himself against Shubham. Today he skipped his own weak chapter because Shubham was studying something different and Arjun panicked.",
                choices: [
                    {
                        text: "A) Writes down exactly what makes him different from Shubham. Stops measuring.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Self-Awareness",
                        feedback: "Self-aware and mature. Hard to do when you're 17 and scared."
                    },
                    {
                        text: "B) Asks Shubham directly how he studies. Turns obsession into information.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Bravery as Curiosity",
                        feedback: "His choice. Bravery disguised as curiosity."
                    },
                    {
                        text: "C) Nothing. Keeps going. Tells himself it's motivation not obsession.",
                        next: 'part1_reveal',
                        score: -10,
                        feedbackTitle: "The Collapse",
                        feedback: "Works until it doesn't — and then it collapses everything."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "What he actually did: He asked Shubham. Shubham showed him his entire schedule. It was completely different — and that was the answer. There was no secret.\\n\\nLESSON: The Comparison Cure\\nComparison is poison until it becomes conversation. The gap in your head is always bigger than the gap in reality.",
                choices: [
                    { text: "Three months later...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-kota-kid-hostel-room.png.jpg',
                text: "Three months later. Arjun is now top 40.\\n\\nSomething shifted — Shubham started coming to Arjun for help on Physics problems.\\n\\nNow Arjun feels something uncomfortable: he doesn't want to help. Helping Shubham might close the gap Arjun finally opened.",
                choices: [
                    {
                        text: "A) Helps fully. What goes around comes around.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "True Security",
                        feedback: "His choice. Requires genuine security in yourself."
                    },
                    {
                        text: "B) Helps a little — explains concept but not his specific approach.",
                        next: 'success',
                        score: 5,
                        feedbackTitle: "Calculated Generosity",
                        feedback: "Calculated generosity. Not wrong. But you'll feel the compromise."
                    },
                    {
                        text: "C) Says he's also struggling with that topic. Lies.",
                        next: 'success',
                        score: -10,
                        feedbackTitle: "Worst Trade",
                        feedback: "You keep the secret and lose your integrity. Worst trade."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-kota-kid.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What he actually did: Helped fully. Then went back and strengthened his own Physics even more. Teaching was his best revision.\\n\\nLESSON: The Boomerang\\nThe knowledge you give away comes back stronger. You don't lose your edge by sharing it — you sharpen it.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Mastery Through Sharing", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Chirag Falor
    'lvl_age_18_chirag': {
        title: "The Day Before JEE Advanced",
        source: "Source: Pune. May 2020. COVID year.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "Pune. May 2020. COVID year. JEE Advanced is tomorrow.\\n\\n3 years of preparation. Mocks averaging 310+.\\n\\nAt 9PM a group message arrives — three friends have decided not to appear tomorrow. They think the exam should be postponed. They're asking if Chirag agrees.",
                choices: [
                    {
                        text: "A) Agrees publicly. Posts in support. Doesn't appear tomorrow.",
                        next: 'part1_reveal',
                        score: -10,
                        feedbackTitle: "Costly Solidarity",
                        feedback: "Solidarity. But three years of preparation don't refund."
                    },
                    {
                        text: "B) Says nothing in the group. Appears tomorrow alone.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Quiet Conviction",
                        feedback: "His choice. Quiet. Lonely. Correct."
                    },
                    {
                        text: "C) Calls each friend privately. Tries to convince them to appear.",
                        next: 'part1_reveal',
                        score: -5,
                        feedbackTitle: "Not Your Burden",
                        feedback: "Noble. But you cannot be anyone's anchor the night before JEE Advanced."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "What Chirag actually did: Said nothing in the group. Appeared. Got AIR 1. His friends reattempted the following year.\\n\\nLESSON: Crowd vs Conviction\\nThe loudest voices the night before the exam are usually the most scared ones. Your preparation doesn't care about the group chat.",
                choices: [
                    { text: "Later that night...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-chirag-falor-pune-study.png.jpg',
                text: "Same night. 11PM.\\n\\nChirag can't sleep. Opens his notes. Every page feels unfamiliar suddenly — the exam-eve illusion where everything you know feels forgotten.\\n\\nHis father knocks. Sits beside him. Says nothing for a while. Then: \\"You don't have to go tomorrow if you're not ready.\\"",
                choices: [
                    {
                        text: "A) \\"I'm not ready. But I'm going anyway.\\"",
                        next: 'success',
                        score: 5,
                        feedbackTitle: "Open Eyes",
                        feedback: "Honest and powerful. Goes in with open eyes."
                    },
                    {
                        text: "B) \\"I'm ready. I just need to sleep.\\" Closes the notes. Lies down.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Hard Discipline",
                        feedback: "His choice. The discipline to stop is harder than the discipline to continue."
                    },
                    {
                        text: "C) Studies until 2AM. Sleeps 4 hours. Goes in exhausted but fully revised.",
                        next: 'success',
                        score: -10,
                        feedbackTitle: "Action Driven By Fear",
                        feedback: "What anxiety looks like in action. The 2AM revision never helps."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-chirag-falor.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What Chirag actually did: Closed the notes. Told his father he was ready. Slept 7 hours. Walked in the next morning like it was a mock test.\\n\\nLESSON: The Off Switch\\nThe last night is not for learning. It's for believing. The ones who crack it sleep — not revise.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "AIR 1", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: The Dropper
    'lvl_age_18_dropper': {
        title: "Starting Over",
        source: "Source: Delhi. November 2019.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-the-dropper-delhi-bedroom.png.jpg',
                text: "Delhi. November 2019.\\n\\nVikram scored 89 percentile in JEE Mains. Good enough for NITs. Not good enough for IIT. Not good enough for what he told everyone he would achieve.\\n\\nHis coaching teacher says: \\"You have the ability. Not the discipline.\\"\\n\\nThat last part stings because it's true.",
                choices: [
                    {
                        text: "A) Takes the NIT seat. Tells himself IIT was never the real dream.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Practical",
                        feedback: "Practical and valid. Many brilliant people built great lives from NITs."
                    },
                    {
                        text: "B) Drops. One year. All in. No backup plan.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "All In",
                        feedback: "His choice. Required confronting his family's silence."
                    },
                    {
                        text: "C) Takes the NIT seat but prepares for improvement exam simultaneously.",
                        next: 'part1_reveal',
                        score: -5,
                        feedbackTitle: "Half Commitment",
                        feedback: "Sounds smart. Usually means you're not fully committed to either."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                bg: '/assets/bg-the-dropper-delhi-bedroom.png.jpg',
                text: "What Vikram actually did: He dropped. Told his parents he needed one more year. His father didn't speak to him for two weeks.\\n\\nLESSON: The Uncomfortable Choice\\nThe choice that disappoints the most people is sometimes the most honest one. Vikram didn't drop for IIT — he dropped because he couldn't live with the question of what might have been.",
                choices: [
                    { text: "March 2020...", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/bg-the-dropper-delhi-bedroom.png.jpg',
                text: "Drop year. March 2020. 3 months before JEE.\\n\\nMock scores jumped from 89 to 97 percentile. On track.\\n\\nThen COVID hits. JEE postponed indefinitely. His NIT friends are doing online college, socializing, moving forward.\\n\\nVikram is stuck in his room. Goal intact. No exam date.",
                choices: [
                    {
                        text: "A) Maintains the full schedule. Treats every day like exam is tomorrow.",
                        next: 'success',
                        score: 5,
                        feedbackTitle: "Intense",
                        feedback: "Intense. Sustainable only if your mental health is solid."
                    },
                    {
                        text: "B) Takes one month off. Resumes when the date is announced.",
                        next: 'success',
                        score: -5,
                        feedbackTitle: "Risky",
                        feedback: "Risky. One month becomes two. Rest needs a hard end date."
                    },
                    {
                        text: "C) Uses the time to strengthen weak areas he never had time for.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Purposeful Pace",
                        feedback: "His actual approach. Purposeful without being punishing."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/portraits/portrait-the-dropper.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What Vikram actually did: Studied through lockdown — not at full intensity, but consistently. When JEE finally happened, he scored 99.4 percentile. Got into IIT Delhi.\\n\\nLESSON: The Long Game\\nThe drop year was never about one exam. It was about becoming someone who could handle uncertainty and keep going.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Redemption", feedback: "" }
                ]
            }
        ]
    }
`;

const newLevels = `
        // Age 16: Chirag Falor
        {
            id: 'lvl_16_chirag', title: 'The YouTube Hole', description: 'At 16, Chirag was brilliant, but found himself completely derailed by an internet addiction spiral.',
            requiredStars: 0, year: 2015, age: 16, theme: 'Education', age_mirror_text: 'distracted by endless YouTube loops while peers moved ahead', archetype: 'The Prodigy', personality: 'Chirag Falor',
            bio: 'A 16-year-old JEE aspirant who discovers that intelligence alone cannot outsmart the internet rabbit hole.',
            fame: 'AIR 1 in JEE Advanced 2020.',
            achievements: ['JEE Advanced AIR 1', 'MIT Graduate', 'Bal Shakti Puraskar Awardee'],
            lesson: 'RESETTING IS MESSY — sometimes you have to break your own rules to break a bad streak.',
            avatarUrl: '/portraits/portrait-chirag-falor.png', scenarioId: 'lvl_age_16_chirag',
            idolTraits: { discipline: 70, resilience: 90, risk: 85, leadership: 60, creativity: 85, empathy: 75, vision: 90 }
        },
        // Age 16: Kota Kid
        {
            id: 'lvl_16_kota_kid', title: 'First Month in Kota', description: 'At 16, Arjun faced the terrifying reality of the Kota pressure cooker.',
            requiredStars: 0, year: 2018, age: 16, theme: 'Education', age_mirror_text: 'sitting in a small room in Kota, missing home and doubting everything', archetype: 'The Aspirant', personality: 'Kota Kid',
            bio: 'A small-town boy adjusting to the ruthless, isolated ecosystem of India\\'s coaching capital.',
            fame: 'A successful engineering graduate.',
            achievements: ['Survived the first month in Kota', 'Cracked JEE', 'Mastered his own mind'],
            lesson: 'COMMITMENT IS A LIE YOU TELL YOURSELF UNTIL IT BECOMES TRUE.',
            avatarUrl: '/portraits/portrait-kota-kid.png', scenarioId: 'lvl_age_16_kota_kid',
            idolTraits: { discipline: 85, resilience: 95, risk: 60, leadership: 50, creativity: 60, empathy: 80, vision: 70 }
        },
        // Age 17: Kalpit Veerwal
        {
            id: 'lvl_17_kalpit', title: 'The Perfect Score Obsession', description: 'At 17, Kalpit decided a top rank wasn\\'t enough. He wanted a mathematically perfect score.',
            requiredStars: 0, year: 2016, age: 17, theme: 'Education', age_mirror_text: 'obsessing over a single chemistry concept at 3AM while everyone else slept', archetype: 'The Perfectionist', personality: 'Kalpit Veerwal',
            bio: 'A student from Udaipur who decided to chase a flawless score when his teachers said it was impossible.',
            fame: 'First ever perfect score in JEE Mains history.',
            achievements: ['360/360 in JEE Mains 2017', 'Limca Book of Records', 'Founder of AcadBoost'],
            lesson: 'LONELY CONVICTION — greatness requires a relationship with certainty that others will call crazy.',
            avatarUrl: '/portraits/portrait-kalpit-veerwal.png', scenarioId: 'lvl_age_17_kalpit',
            idolTraits: { discipline: 100, resilience: 90, risk: 80, leadership: 85, creativity: 70, empathy: 60, vision: 95 }
        },
        // Age 17: Kota Kid
        {
            id: 'lvl_17_kota_kid', title: 'The Comparison Spiral', description: 'At 17, Arjun realized the biggest battle in Kota wasn\\'t the syllabus, it was the student sitting next to him.',
            requiredStars: 0, year: 2019, age: 17, theme: 'Education', age_mirror_text: 'timing himself against his batchmate and losing his own rhythm', archetype: 'The Aspirant', personality: 'Kota Kid',
            bio: 'A second-year Kota student fighting the toxic urge to measure his self-worth against the batch topper.',
            fame: 'A successful engineering graduate.',
            achievements: ['Mastered internal focus', 'Improved his rank through teaching others', 'Cracked JEE'],
            lesson: 'THE BOOMERANG — knowledge given away comes back sharper.',
            avatarUrl: '/portraits/portrait-kota-kid.png', scenarioId: 'lvl_age_17_kota_kid',
            idolTraits: { discipline: 90, resilience: 90, risk: 70, leadership: 60, creativity: 65, empathy: 85, vision: 80 }
        },
        // Age 18: Chirag Falor
        {
            id: 'lvl_18_chirag', title: 'The Day Before JEE Advanced', description: 'At 18, on the night before the biggest exam of his life, Chirag faced a moment of absolute panic.',
            requiredStars: 0, year: 2020, age: 18, theme: 'Education', age_mirror_text: 'staring at unfamiliar notes at 11PM the night before JEE Advanced', archetype: 'The Prodigy', personality: 'Chirag Falor',
            bio: 'The night before the exam, navigating group-chat panic, self-doubt, and the hardest discipline of all: stopping.',
            fame: 'AIR 1 in JEE Advanced 2020.',
            achievements: ['JEE Advanced AIR 1', 'MIT Graduate', 'Bal Shakti Puraskar Awardee'],
            lesson: 'THE OFF SWITCH — the last night is not for learning, it is for believing.',
            avatarUrl: '/portraits/portrait-chirag-falor.png', scenarioId: 'lvl_age_18_chirag',
            idolTraits: { discipline: 95, resilience: 95, risk: 70, leadership: 80, creativity: 85, empathy: 80, vision: 90 }
        },
        // Age 18: The Dropper
        {
            id: 'lvl_18_dropper', title: 'Starting Over', description: 'At 18, Vikram realized he had to disappoint his parents to be honest with himself.',
            requiredStars: 0, year: 2019, age: 18, theme: 'Education', age_mirror_text: 'facing his father\\'s silence after choosing to drop a year for JEE', archetype: 'The Resilient', personality: 'Vikram (The Dropper)',
            bio: 'A student who scored well enough for a good college, but chose a brutal year of isolation to chase his true potential.',
            fame: 'IIT Delhi Graduate.',
            achievements: ['Scored 99.4 percentile after dropping', 'Survived COVID lockdown isolation', 'Graduated from IIT Delhi'],
            lesson: 'THE UNCOMFORTABLE CHOICE — sometimes disappointing others is the only way to not disappoint yourself.',
            avatarUrl: '/portraits/portrait-the-dropper.png', scenarioId: 'lvl_age_18_dropper',
            idolTraits: { discipline: 90, resilience: 100, risk: 85, leadership: 60, creativity: 65, empathy: 80, vision: 85 }
        },
`;

let scenariosContent = fs.readFileSync('src/data/scenarios.ts', 'utf8');
scenariosContent = scenariosContent.replace(/\n\};\s*$/, ',' + newScenarios + '\n};\n');
fs.writeFileSync('src/data/scenarios.ts', scenariosContent);
console.log('✅ Appended scenarios');

let levelsContent = fs.readFileSync('src/utils/levelGenerator.ts', 'utf8');
levelsContent = levelsContent.replace(/(\s*)\];\s*\/\/\s*Instead of isolating the user to only one age group,/, '$1' + newLevels + '$1];\n\n    // Instead of isolating the user to only one age group,');
fs.writeFileSync('src/utils/levelGenerator.ts', levelsContent);
console.log('✅ Appended levels');
