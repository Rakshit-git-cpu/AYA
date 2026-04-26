const fs = require('fs');

const newScenarios = `
,
    // AGE 19: Billie Eilish
    'lvl_age_19_billie': {
        title: "Fame Is Eating Me Alive",
        source: "Source: Billie Eilish interviews, 2020-2021",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_billie_la.jpg',
                text: "Year: 2020. Los Angeles. You are 19. You just won 5 Grammy Awards in one night — the most by any artist your age in history. But you haven't slept properly in 6 months. You have body dysmorphia, depression and anxiety. Your management wants you to start your next album immediately. Your therapist says you need 6 months completely off.",
                choices: [
                    {
                        text: "A) Start the next album immediately — momentum in music is everything.",
                        next: 'momentum',
                        score: -5,
                        feedbackTitle: "Playing Empty",
                        feedback: "You chose momentum. Billie felt that pressure too. But she discovered that music made from an empty place sounds empty. What are you creating from right now — fullness or exhaustion?"
                    },
                    {
                        text: "B) Take 6 months completely off — mental health is the foundation of everything.",
                        next: 'rest',
                        score: 10,
                        feedbackTitle: "You Chose Yourself",
                        feedback: "Billie made this choice and it terrified her. The world kept moving without her for 6 months and she survived. So would you."
                    },
                    {
                        text: "C) Write music privately while publicly stepping back from appearances.",
                        next: 'middle',
                        score: 5,
                        feedbackTitle: "The Middle Path",
                        feedback: "Billie eventually did this too — she processed privately before sharing publicly. The question is whether you can truly rest while still creating."
                    }
                ]
            },
            {
                id: 'momentum',
                bg: '/assets/bg_billie_la.jpg',
                text: "The sessions start well, but the music feels hollow. Your collaborator Finneas notices you're not really present. The songs lack the raw honesty your fans love.",
                choices: [
                    {
                        text: "Pause. Be honest — you need to heal before you can create.",
                        next: 'rest',
                        score: 10,
                        feedbackTitle: "The Brave Pause",
                        feedback: "Stopping to heal takes more courage than pushing through."
                    }
                ]
            },
            {
                id: 'rest',
                bg: '/assets/bg_billie_la.jpg',
                text: "Six months pass. You speak publicly about your mental health struggles. The world doesn't abandon you — millions write that your honesty saved them. Now you return to the studio, full.",
                choices: [
                    {
                        text: "Channel everything you felt into the new album.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Vulnerability Is Strength",
                        feedback: "Stopping to heal wasn't weakness. It was the most courageous thing you could do."
                    }
                ]
            },
            {
                id: 'middle',
                bg: '/assets/bg_billie_la.jpg',
                text: "Writing privately helps. You process through lyrics what you can't say in interviews. Slowly the songs become honest again.",
                choices: [
                    {
                        text: "Share the music when you're truly ready.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Private Process, Public Impact",
                        feedback: "The authenticity you protected privately shines through publicly."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_billie.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Happier Than Ever becomes your most critically acclaimed album. You proved that stopping, healing, and being honest about struggle isn't weakness — it's the most courageous thing a 19-year-old can do in front of the entire world. LESSON: VULNERABILITY IS STRENGTH.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Happier Than Ever", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: MrBeast
    'lvl_age_19_mrbeast': {
        title: "Drop Out or Keep Uploading",
        source: "Source: MrBeast (Jimmy Donaldson) interviews, 2017",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "Year: 2017. North Carolina. You are 19. You've been making YouTube videos for 5 years with almost no success — 30,000 subscribers. Your mom is begging you to go to college. You just had an idea for a video counting to 100,000. It will take days. It's ridiculous. College applications are due tomorrow.",
                choices: [
                    {
                        text: "A) Apply to college — have a backup plan, YouTube is too uncertain.",
                        next: 'college',
                        score: -5,
                        feedbackTitle: "The Safe Plan",
                        feedback: "You chose safety. Jimmy's mom wanted that for him too. But he asked himself — if YouTube fails, can I handle knowing I never truly tried? Can you?"
                    },
                    {
                        text: "B) Make the counting video — bet everything on your instinct.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "Delusional Confidence",
                        feedback: "You think like MrBeast. The ability to believe in something absurd long enough for the world to catch up is genuinely rare."
                    },
                    {
                        text: "C) Apply to college but keep making videos — do both until one wins.",
                        next: 'both',
                        score: 0,
                        feedbackTitle: "Half Commitment",
                        feedback: "Many successful YouTubers did this. But MrBeast discovered that half-commitment produces half-results. Sometimes the backup plan is what's holding you back."
                    }
                ]
            },
            {
                id: 'college',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You enroll. Classes are fine. But every night you're watching YouTube analytics instead of studying. The idea for the counting video won't leave your head.",
                choices: [
                    {
                        text: "Drop out. Make the video you can't stop thinking about.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "The Itch You Can't Ignore",
                        feedback: "When an idea won't leave you alone, that's data."
                    }
                ]
            },
            {
                id: 'both',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You split your time. The videos are decent but not obsessive. You realize you're not giving either path everything.",
                choices: [
                    {
                        text: "Go all-in on YouTube. Make the absurd counting video.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "Full Send",
                        feedback: "Commitment is a prerequisite for breakthrough."
                    }
                ]
            },
            {
                id: 'count',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You film for 40+ hours straight, counting to 100,000 on camera. Your team thinks you've lost your mind. You upload it anyway.",
                choices: [
                    {
                        text: "Hit publish and go to sleep.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Absurd Idea",
                        feedback: "Every world-changing idea looks stupid before it works."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_mrbeast.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The video goes viral. He never went to college. He now has 200+ million subscribers and has given away over $100 million. LESSON: ABSURD IDEAS CHANGE THE WORLD. Nobody thought it would work. That's exactly why it did.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Counting to Greatness", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Ritesh Agarwal
    'lvl_age_19_ritesh': {
        title: "The Dropout Founder",
        source: "Source: Ritesh Agarwal, OYO Rooms origin story, 2012",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "Year: 2012. India. You are 19. You dropped out of college after one semester. You've been traveling across India staying in budget hotels — all terrible. You have an idea: standardize them. But you have no money, no MBA, no experience. Just ₹2,000 in your pocket. The Thiel Fellowship is offering $100,000 to young entrepreneurs to NOT go to college.",
                choices: [
                    {
                        text: "A) Go back to college — build credibility first, then start the business.",
                        next: 'college',
                        score: -5,
                        feedbackTitle: "The Credential Trap",
                        feedback: "Will a degree solve the problem you see? If not, what are you waiting for?"
                    },
                    {
                        text: "B) Apply for the Thiel Fellowship — bet on yourself against the world's best young minds.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Swing for the Biggest Opportunity",
                        feedback: "Ritesh won the fellowship but knew he'd find another way if he lost. The application itself forced him to clarify his vision."
                    },
                    {
                        text: "C) Start small immediately — begin with one hotel, don't wait for permission.",
                        next: 'start_small',
                        score: 8,
                        feedbackTitle: "Action Over Planning",
                        feedback: "This is actually closest to what Ritesh did before the fellowship — he had already started testing with real hotels. Beginning small is never small."
                    }
                ]
            },
            {
                id: 'college',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "Back in college, the problem you saw on the road keeps gnawing at you. Every semester feels like delay. The market won't wait.",
                choices: [
                    {
                        text: "Drop out again. Apply for the Thiel Fellowship.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Permission Is a Trap",
                        feedback: "The world gives permission to people who don't need it."
                    }
                ]
            },
            {
                id: 'start_small',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "You partner with one guesthouse owner. The results are promising. Now the Thiel Fellowship application is open — your real-world data makes your pitch stronger.",
                choices: [
                    {
                        text: "Apply to Thiel Fellowship with your proof of concept.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Data + Ambition",
                        feedback: "Action created the evidence. The fellowship will amplify it."
                    }
                ]
            },
            {
                id: 'thiel',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "You make it through the grueling interview rounds. The final round is tomorrow. You're the youngest applicant and the only one from India.",
                choices: [
                    {
                        text: "Walk in and pitch the pain you lived through personally.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Founder-Market Fit",
                        feedback: "Your personal experience of the problem is your unfair advantage."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_ritesh.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ritesh wins $100,000 and uses it to start OYO Rooms. By age 25 he became the world's youngest billionaire. LESSON: PERMISSION IS A TRAP. He had a problem he personally experienced and the audacity to solve it.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Youngest Billionaire", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Muhammad Ali
    'lvl_age_19_ali': {
        title: "Throw The Medal Away",
        source: "Source: Muhammad Ali, Rome Olympics 1960",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_ali_rome.jpg',
                text: "Year: 1960. Rome Olympics. You are 19. You just won the Olympic gold medal in boxing. You return home to Louisville as a hero. But at a restaurant, a white waiter refuses to serve you. You — an Olympic gold medalist — are told to use the back entrance. You are so disgusted you consider throwing your medal into the Ohio River.",
                choices: [
                    {
                        text: "A) Keep the medal — use your platform strategically to change things from inside.",
                        next: 'keep',
                        score: -5,
                        feedbackTitle: "Strategic Silence",
                        feedback: "Many great activists chose strategy over emotion and changed the world. But Ali believed that strategic silence in the face of humiliation becomes complicity over time."
                    },
                    {
                        text: "B) Throw it away — some symbols of a corrupt system should be rejected completely.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Refuse to Treasure It",
                        feedback: "Ali said 'I don't have to be what you want me to be.' Sometimes the most powerful statement is destruction of what no longer deserves to exist."
                    },
                    {
                        text: "C) Keep the medal but speak loudly and publicly about what happened.",
                        next: 'speak',
                        score: 7,
                        feedbackTitle: "Voice Over Symbol",
                        feedback: "Ali did this too — he never stopped speaking. But he felt the medal itself was a lie he couldn't hold in his hands."
                    }
                ]
            },
            {
                id: 'keep',
                bg: '/assets/bg_ali_rome.jpg',
                text: "You keep the medal for sponsorships. The money comes. But every time you hold it you think about that restaurant. The compromise eats at you.",
                choices: [
                    {
                        text: "Reject the lie. Throw it away and speak your truth.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Integrity Over Gold",
                        feedback: "What you refuse to accept defines you as much as what you achieve."
                    }
                ]
            },
            {
                id: 'speak',
                bg: '/assets/bg_ali_rome.jpg',
                text: "Your words reach millions. But the medal sits heavy. You realize symbols matter — what you hold says something about what you believe.",
                choices: [
                    {
                        text: "Let it go. Into the river.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Actions Louder Than Words",
                        feedback: "The act became the most powerful speech of all."
                    }
                ]
            },
            {
                id: 'throw',
                bg: '/assets/bg_ali_rome.jpg',
                text: "The medal hits the water. Your trainer calls you crazy. Your family says don't make trouble. But something inside you has never felt more free.",
                choices: [
                    {
                        text: "Stand by the decision. Your integrity is not negotiable.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Greatest",
                        feedback: "This act of defiance defined his entire identity."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_ali.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ali became the greatest boxer AND the greatest activist of his generation. The world remembers him not just for his fights in the ring but for the fights he picked outside it. LESSON: YOUR INTEGRITY IS WORTH MORE THAN ANY TROPHY.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Float Like a Butterfly", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Dhruv Rathee
    'lvl_age_20_dhruv': {
        title: "Germany or India",
        source: "Source: Dhruv Rathee interviews and YouTube journey, 2014",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_dhruv_germany.png',
                text: "Year: 2014. Germany. You are 20, studying mechanical engineering on a scholarship. You started making YouTube videos about Indian politics — nobody is watching. You have 500 subscribers. A German company offers you a prestigious internship. But you feel a burning rage about misinformation spreading in India. Someone needs to speak up.",
                choices: [
                    {
                        text: "A) Focus on engineering — finish your degree, build security, then use your platform.",
                        next: 'engineering',
                        score: 5,
                        feedbackTitle: "Build the Foundation",
                        feedback: "Dhruv did this too. He graduated first. The discipline of engineering sharpened his research skills."
                    },
                    {
                        text: "B) Go all in on YouTube — India needs honest voices more than one more engineer.",
                        next: 'youtube',
                        score: -5,
                        feedbackTitle: "Too Soon",
                        feedback: "Passion without patience collapses. Dhruv kept studying AND kept making videos. Both disciplines fed each other."
                    },
                    {
                        text: "C) Do both — keep studying but upload consistently, let the audience decide.",
                        next: 'both',
                        score: 10,
                        feedbackTitle: "Build the Bridge While Crossing It",
                        feedback: "This is exactly what Dhruv did. By the time he had to choose, the choice was obvious."
                    }
                ]
            },
            {
                id: 'youtube',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You quit your studies. Without credentials, your videos struggle to be taken seriously. You realize authority and research depth matter for this kind of content.",
                choices: [
                    {
                        text: "Go back. Finish the degree while continuing to upload.",
                        next: 'both',
                        score: 10,
                        feedbackTitle: "Patience Is Architecture",
                        feedback: "Patience in the building phase is not weakness."
                    }
                ]
            },
            {
                id: 'engineering',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You graduate. Your degree gives you credibility. Now you have the research skills AND the credentials. The YouTube channel is still small but growing steadily.",
                choices: [
                    {
                        text: "Go full-time on YouTube — the time is right.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Obvious Choice",
                        feedback: "By the time you had to choose, the choice was obvious."
                    }
                ]
            },
            {
                id: 'both',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You study by day and research-write by night. The videos are slow but consistent. Your engineering brain makes your research unusually rigorous.",
                choices: [
                    {
                        text: "Graduate, then go all-in.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Long Game",
                        feedback: "20 million subscribers are waiting on the other side of patience."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_dhruv.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Today Dhruv Rathee has 20+ million subscribers and is one of India's most influential voices on democracy and environment. LESSON: BUILD THE BRIDGE WHILE CROSSING IT. Patience in the building phase is not weakness — it's architecture.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "20 Million Strong", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (shown as 19 in-game): Falguni Nayar
    'lvl_age_19_falguni': {
        title: "Science or Business",
        source: "Source: Falguni Nayar, IIM Ahmedabad and Nykaa origin story, 1982",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "Year: 1982. Mumbai. You are 19, one of very few women at IIM Ahmedabad. Society expects you to get a safe job and marry. You have a burning desire to build something of your own someday. Everyone says: get experience first, build credentials. Your family wants a good job first.",
                choices: [
                    {
                        text: "A) Follow the conventional path — job, experience, credentials, then entrepreneurship later.",
                        next: 'conventional',
                        score: 10,
                        feedbackTitle: "The Best MBA She Ever Got",
                        feedback: "You and Falguni made the same choice. She called those 19 years at Kotak 'the best MBA I ever got.' Experience isn't delay — it's preparation disguised as patience."
                    },
                    {
                        text: "B) Start something immediately — youth and energy are your greatest assets.",
                        next: 'start_now',
                        score: 5,
                        feedbackTitle: "Starting Young Works Too",
                        feedback: "Some of India's greatest founders did exactly this — Ritesh Agarwal, Kunal Shah. The question is what you're starting with."
                    },
                    {
                        text: "C) Use your IIM network aggressively — build connections that will support your future venture.",
                        next: 'network',
                        score: 8,
                        feedbackTitle: "Networks Are Your Future",
                        feedback: "Falguni did this naturally — her Kotak connections became Nykaa's first investors. Networks aren't just contacts — they're your future."
                    }
                ]
            },
            {
                id: 'start_now',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "You start early but lack industry knowledge and connections. The venture struggles. You realize you needed more domain expertise.",
                choices: [
                    {
                        text: "Get corporate experience first. Build knowledge intentionally.",
                        next: 'conventional',
                        score: 10,
                        feedbackTitle: "The Long Game",
                        feedback: "There is no wrong time to begin — but preparation compounds."
                    }
                ]
            },
            {
                id: 'network',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "Your IIM connections open doors at Kotak Mahindra. You join. Over 19 years you build expertise AND relationships that will become Nykaa's backbone.",
                choices: [
                    {
                        text: "At 49, launch Nykaa using everything you built.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Network Pays Off",
                        feedback: "Every relationship you built was Nykaa's foundation."
                    }
                ]
            },
            {
                id: 'conventional',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "You join Kotak Mahindra. 19 years of investment banking builds your expertise, your network, and your understanding of capital markets — the exact skills Nykaa will need.",
                choices: [
                    {
                        text: "At 49, launch Nykaa. The window was never closed.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "49 and Just Beginning",
                        feedback: "India's first self-made female billionaire. And she started her company at 49."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_falguni.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Falguni Nayar became India's first self-made female billionaire in 2021. She founded Nykaa at 49. LESSON: THERE IS NO WRONG TIME TO BEGIN. The entrepreneurship window never closes.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Never Too Late", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Nikola Tesla
    'lvl_age_19_tesla': {
        title: "Trust Your Visions",
        source: "Source: Nikola Tesla autobiography, Graz Institute of Technology, 1875",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "Year: 1875. Austria. You are 19, studying electrical engineering. You are obsessed — studying 20 hours a day. You've started having visions: literal visualizations of electrical machines in your mind that you can mentally test. Your professors think you're having a mental crisis. You have a revolutionary idea about alternating current that contradicts everything they teach.",
                choices: [
                    {
                        text: "A) Trust your professors — they have decades of experience, your visions might be delusions.",
                        next: 'professors',
                        score: -10,
                        feedbackTitle: "The Safe Mind",
                        feedback: "Deference to authority killed the idea before it could become the modern world's power grid."
                    },
                    {
                        text: "B) Trust your visions — your mind is showing you something the world hasn't seen yet.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "The Mind That Sees Differently",
                        feedback: "Tesla later said those mental visualizations were more real to him than physical experiments."
                    },
                    {
                        text: "C) Document everything secretly — protect your ideas while appearing to conform.",
                        next: 'document',
                        score: 7,
                        feedbackTitle: "Hidden Fire",
                        feedback: "Strategic patience can protect a revolutionary idea until the moment is right."
                    }
                ]
            },
            {
                id: 'professors',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You follow the curriculum. Years pass. You work at a telegraph company. The vision of alternating current never leaves. You realize you suppressed your greatest insight.",
                choices: [
                    {
                        text: "Trust the vision. Document it. Pursue it.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "Reclaiming the Vision",
                        feedback: "Better late than never for a mind like yours."
                    }
                ]
            },
            {
                id: 'document',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You secretly fill notebooks with AC designs while passing your exams. You're building a double life — conformist by day, revolutionary by night.",
                choices: [
                    {
                        text: "The time has come. Reveal the alternating current system.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "From Hidden to Historic",
                        feedback: "The patience made the revelation more powerful."
                    }
                ]
            },
            {
                id: 'visions',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You trust the visions completely. Your professors call it a breakdown. But you can see the machine working in your mind with perfect clarity — every coil, every spark, every rotation.",
                choices: [
                    {
                        text: "Build it. Prove the vision was real.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Reality Distortion",
                        feedback: "The vision was more real than anything in the lab."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_tesla.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Tesla's alternating current system powers the entire modern world. LESSON: THE MIND THAT SEES DIFFERENTLY IS NOT BROKEN. The ability to see what doesn't exist yet — and trust that vision enough to fight for it — is the rarest human gift.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Current That Lights the World", feedback: "" }
                ]
            }
        ]
    }
`;

let content = fs.readFileSync('src/data/scenarios.ts', 'utf8');
// Insert before the closing };
content = content.replace(/\n\};\s*$/, newScenarios + '\n};\n');
fs.writeFileSync('src/data/scenarios.ts', content);
console.log('✅ Appended 7 new scenarios');
