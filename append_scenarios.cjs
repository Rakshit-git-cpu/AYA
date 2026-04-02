const fs = require('fs');

const appendText = `
    // AGE 17: P.V. Sindhu
    'lvl_age_17_sindhu': {
        title: "The Olympic Prelude",
        source: "Source: Various Interviews, 2012 Journey",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_sindhu.jpg',
                text: "It is 2012. You are 17. You are facing Li Xuerui, the reigning Olympic gold medalist. She is older, stronger, and seemingly invincible. Your body is exhausted from the tournament. The pressure is immense.",
                choices: [
                    {
                        text: "Focus entirely on defense. Try to outlast her rallies and wait for her to make unforced errors.",
                        next: 'defend',
                        score: -5,
                        feedbackTitle: "Playing Safe is Playing to Lose",
                        feedback: "Li Xuerui is too experienced. She realizes you are playing not to lose, rather than playing to win, and she systematically dismantles your defense."
                    },
                    {
                        text: "Play aggressively. Attack her serves and dictate the pace, even if it burns your remaining stamina.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "The Challenger's Mindset",
                        feedback: "You surprise her with your sheer aggression. You take control of the net, forcing her to play your game."
                    }
                ]
            },
            {
                id: 'defend',
                bg: '/assets/bg_sindhu.jpg',
                text: "You lost the game, but learned a crucial lesson: against greatness, you cannot survive by waiting. You must strike.",
                choices: [
                    {
                        text: "Re-focus. Accept the risk of exhaustion and switch to an aggressive attack strategy.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "Adaptation",
                        feedback: "You reset your mindset."
                    }
                ]
            },
            {
                id: 'attack',
                bg: '/assets/bg_sindhu.jpg',
                text: "You win the first set. But your stamina is dropping dangerously low. The coach warns you to slow down, but Li is turning up the pressure.",
                choices: [
                    {
                        text: "Trust your physical conditioning. Push through the pain and maintain the aggressive tempo.",
                        next: 'push',
                        score: 10,
                        feedbackTitle: "Breaking Limits",
                        feedback: "You push your body beyond what you thought was possible. The sheer willpower breaks your opponent's rhythm."
                    },
                    {
                        text: "Listen to the coach. Slow down the game to recover stamina for the final set.",
                        next: 'slow',
                        score: -5,
                        feedbackTitle: "Lost Momentum",
                        feedback: "Slowing down gives Li exactly what she needs. She recovers, takes the second set, and crushes you in the third."
                    }
                ]
            },
            {
                id: 'slow',
                bg: '/assets/bg_sindhu.jpg',
                text: "You lost the momentum and the match. You realize that sometimes, momentum is more important than energy.",
                choices: [
                    {
                        text: "Learn from it. Trust your instincts on the court.",
                        next: 'push',
                        score: 10,
                        feedbackTitle: "A Hard Lesson",
                        feedback: "You vow never to give up dominance when you have it."
                    }
                ]
            },
            {
                id: 'push',
                bg: '/assets/avatar_sindhu.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You defeat the Olympic Champion. At 17, you announce your arrival on the world stage, proving that no giant is invincible.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Giant Killer", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: A.R. Rahman
    'lvl_age_17_rahman': {
        title: "The Silent Melody",
        source: "Source: Biography of A.R. Rahman",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_rahman.jpg',
                text: "It is 1984. You are 17. Your father has passed away, leaving your family in deep financial trouble. You are gifted at the keyboard, but your mother urges you to drop out of school to become a full-time session musician for film composers.",
                choices: [
                    {
                        text: "Refuse. Education is the only safe path out of poverty. Try to find a part-time job outside of music.",
                        next: 'school',
                        score: -5,
                        feedbackTitle: "The Safe Illusion",
                        feedback: "You struggle to balance part-time work and school. Your family slips further into debt, and you lose touch with your greatest gift."
                    },
                    {
                        text: "Accept the burden. Drop out of school and immerse yourself completely in music to support your family.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Embracing Destiny",
                        feedback: "You sacrifice your childhood, playing 12 hours a day across multiple studios. The grueling schedule forces you to master every genre."
                    }
                ]
            },
            {
                id: 'school',
                bg: '/assets/bg_rahman.jpg',
                text: "Safety isn't saving your family. You realize your music is the only true leverage you have.",
                choices: [
                    {
                        text: "Leave school. Commit to the studios.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "The Necessary Sacrifice",
                        feedback: "You make the hardest choice of your life."
                    }
                ]
            },
            {
                id: 'drop',
                bg: '/assets/bg_rahman.jpg',
                text: "You are working endlessly for other composers. They take the credit, and you just get a daily wage. You are exhausted and feeling creatively stifled.",
                choices: [
                    {
                        text: "Start composing your own jingles at night, sacrificing what little sleep you have to build your own identity.",
                        next: 'jingles',
                        score: 10,
                        feedbackTitle: "The Midnight Hustle",
                        feedback: "You work 18-hour days. But your private jingles catch the attention of ad agencies, carving out a space that is truly yours."
                    },
                    {
                        text: "Accept your lot. Being a top session player is good money and keeps the family fed.",
                        next: 'complacent',
                        score: -5,
                        feedbackTitle: "The Golden Cage",
                        feedback: "You become the most sought-after keyboardist in Chennai, but completely lose your unique voice. You remain a background player forever."
                    }
                ]
            },
            {
                id: 'complacent',
                bg: '/assets/bg_rahman.jpg',
                text: "You feel hollow. Playing other people's music isn't why you were given this gift.",
                choices: [
                    {
                        text: "Wake up. Start writing your own music at night.",
                        next: 'jingles',
                        score: 10,
                        feedbackTitle: "Finding Your Voice",
                        feedback: "You reclaim your creative soul."
                    }
                ]
            },
            {
                id: 'jingles',
                bg: '/assets/avatar_rahman.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your ad jingles become legendary. Soon, a director named Mani Ratnam will hear your work, and the rest is history.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Mozart of Madras", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Malala Yousafzai
    'lvl_age_17_malala': {
        title: "The Price of Peace",
        source: "Source: 'I Am Malala'",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_malala.jpg',
                text: "It is 2014. You are 17. You survived a horrific assassination attempt by the Taliban. Now, you have just been awarded the Nobel Peace Prize. The world wants you to be their spokesperson, but you just want to pass your high school exams.",
                choices: [
                    {
                        text: "Embrace the global platform immediately. Drop out of regular school to tour the world and advocate for girls' rights full-time.",
                        next: 'tour',
                        score: -5,
                        feedbackTitle: "Losing the Anchor",
                        feedback: "You become a powerful figurehead, but you feel disconnected from the very identity of being a 'student' that you fought so hard for."
                    },
                    {
                        text: "Protect your normalcy. Balance your global advocacy with strict, unwavering dedication to finishing your high school education.",
                        next: 'balance',
                        score: 10,
                        feedbackTitle: "Walking the Talk",
                        feedback: "You prove that education isn't just a talking point—it's your actual priority. You ground yourself, maintaining your authenticity."
                    }
                ]
            },
            {
                id: 'tour',
                bg: '/assets/bg_malala.jpg',
                text: "The speeches are inspiring, but you feel like a politician, not a girl fighting for education. You need your books.",
                choices: [
                    {
                        text: "Cancel the tour. Go back to class.",
                        next: 'balance',
                        score: 10,
                        feedbackTitle: "Returning to Roots",
                        feedback: "You remember what you were fighting for in the first place."
                    }
                ]
            },
            {
                id: 'balance',
                bg: '/assets/bg_malala.jpg',
                text: "Balancing schoolwork and meeting world leaders is exhausting. Politicians try to use your image for their own agendas.",
                choices: [
                    {
                        text: "Speak your unvarnished truth, even if it makes powerful politicians and donors uncomfortable.",
                        next: 'truth',
                        score: 10,
                        feedbackTitle: "Uncompromising Peace",
                        feedback: "You confront world leaders on their hypocrisy regarding war and education. Your bravery cements your legacy."
                    },
                    {
                        text: "Stick to safe, polished PR scripts to ensure you don't alienate major international donors.",
                        next: 'safe',
                        score: -5,
                        feedbackTitle: "The PR Trap",
                        feedback: "You become a safe, sanitized symbol. The impact of your voice diminishes as you blend into political bureaucracy."
                    }
                ]
            },
            {
                id: 'safe',
                bg: '/assets/bg_malala.jpg',
                text: "You realize you didn't survive a bullet just to read safe PR scripts.",
                choices: [
                    {
                        text: "Tear up the script. Speak from the heart.",
                        next: 'truth',
                        score: 10,
                        feedbackTitle: "Finding the Courage Again",
                        feedback: "You reclaim your voice."
                    }
                ]
            },
            {
                id: 'truth',
                bg: '/assets/avatar_malala.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You pass your exams, head to Oxford, and change the world on your own terms. You proved the pen is mightier than the sword.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Unbreakable Pen", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Steve Jobs
    'lvl_age_17_jobs': {
        title: "The Dropout's Intuition",
        source: "Source: Steve Jobs' Stanford Commencement Address",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_jobs.jpg',
                text: "It is 1972. You are 17. You are enrolled at Reed College, an expensive private school. Your working-class parents are draining their life savings to pay for it, but you have no idea what you want to do with your life, and the required classes bore you.",
                choices: [
                    {
                        text: "Stay in school out of guilt. Force yourself to get a generic degree so your parents' money isn't wasted.",
                        next: 'stay',
                        score: -5,
                        feedbackTitle: "The Path of Regret",
                        feedback: "You graduate, but you are miserable. You take a safe corporate job and never discover the intersection of art and technology."
                    },
                    {
                        text: "Drop out. Stop spending their money, sleep on friends' floors, and only audit the classes that genuinely interest you.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Trusting Intuition",
                        feedback: "It is terrifying, but incredibly freeing. You stop taking required courses and start following your curiosity."
                    }
                ]
            },
            {
                id: 'stay',
                bg: '/assets/bg_jobs.jpg',
                text: "The guilt is eating you alive, but the boredom is worse. You realize you are wasting both time AND money.",
                choices: [
                    {
                        text: "Find the courage to drop out.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Taking the Leap",
                        feedback: "You cut the safety net."
                    }
                ]
            },
            {
                id: 'drop',
                bg: '/assets/bg_jobs.jpg',
                text: "You are auditing classes for free. One of them is Calligraphy. It has zero practical application in your life, but you find it beautiful.",
                choices: [
                    {
                        text: "Immerse yourself in typography. Learn about serif and sans-serif typefaces, purely for the artistry of it.",
                        next: 'fonts',
                        score: 10,
                        feedbackTitle: "Connecting the Dots",
                        feedback: "You learn what makes great typography great. It seems useless now, but it is laying the foundation for the future."
                    },
                    {
                        text: "Quit the calligraphy class. You need to focus on finding a practical job to feed yourself.",
                        next: 'practical',
                        score: -5,
                        feedbackTitle: "Trading Vision for Survival",
                        feedback: "You get a job repairing TVs. It pays the bills, but you lose the artistic edge that makes you special."
                    }
                ]
            },
            {
                id: 'practical',
                bg: '/assets/bg_jobs.jpg',
                text: "Repairing TVs is fine, but you feel empty without the art.",
                choices: [
                    {
                        text: "Go back to the calligraphy classes.",
                        next: 'fonts',
                        score: 10,
                        feedbackTitle: "Embracing Art",
                        feedback: "You return to your true passion."
                    }
                ]
            },
            {
                id: 'fonts',
                bg: '/assets/avatar_jobs.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ten years later, you will design the first Macintosh computer. Because of that calligraphy class, it will be the first computer with beautiful typography. You couldn't connect the dots looking forward, only looking backward.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Intersection", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Indra Nooyi
    'lvl_age_17_nooyi': {
        title: "The Rulebreaker",
        source: "Source: 'My Life in Full' by Indra Nooyi",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_nooyi.jpg',
                text: "It is 1972. You are 17, studying at Madras Christian College in conservative Chennai. Society expects you to be quiet, demure, and prepare for an arranged marriage. Instead, you want to join an all-girls rock band and play guitar.",
                choices: [
                    {
                        text: "Join the rock band. Play guitar, sing loud, and defy every expectation of what a 'good Indian girl' should do.",
                        next: 'rebel',
                        score: 10,
                        feedbackTitle: "The Disruptor",
                        feedback: "You face massive criticism from neighborhood aunties, but you discover a fierce confidence and leadership style that will define your life."
                    },
                    {
                        text: "Conform. Focus quietly on your studies so you don't bring 'shame' or unwanted attention to your family.",
                        next: 'conform',
                        score: -5,
                        feedbackTitle: "The Invisible Girl",
                        feedback: "You get good grades, but you internalize the idea that you should make yourself smaller to please others. Your leadership potential Withers."
                    }
                ]
            },
            {
                id: 'conform',
                bg: '/assets/bg_nooyi.jpg',
                text: "Holding back your personality makes you miserable. You realize that true leadership requires standing out.",
                choices: [
                    {
                        text: "Pick up the guitar. Join the band.",
                        next: 'rebel',
                        score: 10,
                        feedbackTitle: "Taking the Stage",
                        feedback: "You decide to be seen on your own terms."
                    }
                ]
            },
            {
                id: 'rebel',
                bg: '/assets/bg_nooyi.jpg',
                text: "You are rocking out on stage, but now the college has formed a women's cricket team. It's rough, physical, and even more controversial than the band.",
                choices: [
                    {
                        text: "Focus entirely on the band. You've broken enough rules for one year.",
                        next: 'safe',
                        score: -5,
                        feedbackTitle: "Half Measures",
                        feedback: "You enjoy the band, but miss out on the incredible team-building and strategic dynamics of competitive sports."
                    },
                    {
                        text: "Join the cricket team too. Embrace every unconventional opportunity to lead and compete.",
                        next: 'compete',
                        score: 10,
                        feedbackTitle: "The Ultimate Competitor",
                        feedback: "You excel on the pitch. You learn how to lead a diverse team under pressure, a skill that will one day help you run a Fortune 50 company."
                    }
                ]
            },
            {
                id: 'safe',
                bg: '/assets/bg_nooyi.jpg',
                text: "You realize you shouldn't limit yourself just because society thinks you've 'done enough'.",
                choices: [
                    {
                        text: "Grab a bat. Join the team.",
                        next: 'compete',
                        score: 10,
                        feedbackTitle: "Diving In",
                        feedback: "You embrace the competition."
                    }
                ]
            },
            {
                id: 'compete',
                bg: '/assets/avatar_nooyi.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You broke every mold in Madras. Decades later, that same defiant confidence will make you the CEO of PepsiCo.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Ceiling Smasher", feedback: "" }
                ]
            }
        ]
    }
`;

let content = fs.readFileSync('src/data/scenarios.ts', 'utf8');
content = content.replace(/    \},\s*\};\s*$/, '    },' + appendText + '\n};');
fs.writeFileSync('src/data/scenarios.ts', content);
console.log('Appended 5 scenarios');
