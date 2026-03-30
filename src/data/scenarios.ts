export const STORY_DATABASE: Record<string, any> = {
    // AGE 19: Sachin Tendulkar
    'lvl_age_19_sachin': {
        title: "The Trial of Fire",
        source: "Source: Australia tour 1991-92, Perth Test",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "It is 1992. You are 19 years old. You are in Perth, Australia, facing the most terrifyingly fast bowling attack in the world on a pitch that bounces violently. Senior batters in your team are struggling. A bouncer just hit you flush on the helmet.",
                choices: [
                    {
                        text: "Show no emotion. Stare the bowler down and prepare to attack the next ball, risking your wicket to break their rhythm.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "The Lion's Heart",
                        feedback: "You hit the next ball for a boundary. The Australians are stunned by your absolute fearlessness. You seize the psychological advantage."
                    },
                    {
                        text: "Play defensively. Survive the spell, protect your wicket, and wait for the spinners to come on later.",
                        next: 'defend',
                        score: -5,
                        feedbackTitle: "Surviving is not Thriving",
                        feedback: "It's the logical, safe choice. But the fast bowlers smell blood. They pin you down, dot ball after dot ball, until you eventually edge one to the slips."
                    }
                ]
            },
            {
                id: 'defend',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You lost your wicket cheaply. The team is collapsing. You realize that against greatness, playing safe is the biggest risk of all.",
                choices: [
                    {
                        text: "Go to the nets. Face extreme pace without a helmet until you stop flinching.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "Confronting Fear",
                        feedback: "You force yourself to find comfort in the danger zone."
                    },
                    {
                        text: "Accept that Australian pitches are just too hostile and wait for the home series.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "The Comfort Zone",
                        feedback: "You become a good player at home, but never a global legend."
                    }
                ]
            },
            {
                id: 'attack',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You are dominating the world's best. You are nearing a historic century. But the tail-end batsmen are falling quickly. You might run out of partners before you reach 100.",
                choices: [
                    {
                        text: "Farm the strike. Take singles on the last ball to protect the tailenders, slowing your own scoring rate.",
                        next: 'century',
                        score: 10,
                        feedbackTitle: "The General",
                        feedback: "You take responsibility. You shield your weaker partners, slowly inching towards history while frustrating the opposition."
                    },
                    {
                        text: "Try to hit every ball for a boundary to get your 100 before the last man gets out.",
                        next: 'selfish',
                        score: -5,
                        feedbackTitle: "The Glory Shot",
                        feedback: "You play a rash shot and get caught in the deep on 98. The team gets bowled out in the same over."
                    }
                ]
            },
            {
                id: 'selfish',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You missed the milestone because you rushed the process. True mastery requires infinite patience in the final stretch.",
                choices: [
                    {
                        text: "Re-focus. Value the team's total over your personal milestone.",
                        next: 'century',
                        score: 10,
                        feedbackTitle: "Maturing",
                        feedback: "You learn that the milestones will come if you focus purely on the process of the game."
                    }
                ]
            },
            {
                id: 'century',
                bg: '/assets/avatar_sachin.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You score 114 at Perth, one of the greatest hundreds ever seen in Australia. The world realizes a 19-year-old boy is the best batsman on the planet.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_sachin.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You stepped back when history demanded you step up.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SACHIN',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "LESSON: Courage. When placed in an incredibly hostile environment, playing defensively guarantees failure. True greats attack their extreme fears.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Sundar Pichai
    'lvl_age_19_sundar': {
        title: "The Divided Mind",
        source: "Source: Days at IIT Kharagpur",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You are 19. You are a student at IIT Kharagpur studying Metallurgical Engineering. The academic pressure is suffocating. You are fascinated by computers, but there are only a few slow terminals on campus, and using them takes time away from your core coursework.",
                choices: [
                    {
                        text: "Focus entirely on Metallurgy. Maximize your GPA to ensure a safe, high-paying engineering job.",
                        next: 'metallurgy',
                        score: -5,
                        feedbackTitle: "The Safe Route",
                        feedback: "You graduate with top honors, but you enter a dying industrial field, completely missing the digital revolution."
                    },
                    {
                        text: "Sacrifice sleep and risk your grades. Spend nights in the computer lab reading about the nascent internet.",
                        next: 'computers',
                        score: 10,
                        feedbackTitle: "The Explorer",
                        feedback: "Your grades slip slightly, but you discover a profound, obsessive love for software and global connectivity."
                    }
                ]
            },
            {
                id: 'metallurgy',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You ace your tests, but you feel intellectually hollow. You see your friends discussing code and feel left behind.",
                choices: [
                    {
                        text: "Accept that your GPA is more important than a hobby.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Following the Herd",
                        feedback: "You play it safe. Your impact on the world remains limited."
                    },
                    {
                        text: "Pivot. Start balancing your required studies with self-taught computing.",
                        next: 'computers',
                        score: 10,
                        feedbackTitle: "The Pivot",
                        feedback: "It's exhausting, but learning a discipline outside your mandate expands your worldview."
                    }
                ]
            },
            {
                id: 'computers',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You want to study abroad to dive deeper into technology, but your family in Chennai cannot afford a plane ticket to America, let alone the tuition.",
                choices: [
                    {
                        text: "Take a loan, apply for scholarships, and endure the brutal uncertainty of the process.",
                        next: 'stanford',
                        score: 10,
                        feedbackTitle: "Skin in the Game",
                        feedback: "Your father withdraws his entire life savings just to buy your flight ticket. The sheer weight of that sacrifice fuels an unbreakable discipline in you."
                    },
                    {
                        text: "Stay in India. The financial burden and risk to your family are simply too high to justify.",
                        next: 'fail_india',
                        score: -5,
                        feedbackTitle: "Noble, but Limiting",
                        feedback: "You protect your family's finances short-term, but sacrifice the environment needed to maximize your potential."
                    }
                ]
            },
            {
                id: 'fail_india',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You take a local job. You do well, but you always wonder what if you had taken the leap.",
                choices: [
                    {
                        text: "Re-evaluate. Take the risk while you are young.",
                        next: 'stanford',
                        score: 10,
                        feedbackTitle: "Taking the Leap",
                        feedback: "You realize true growth lies on the other side of terrifying financial and geographical risks."
                    }
                ]
            },
            {
                id: 'stanford',
                bg: '/assets/avatar_sundar.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You make it to Stanford. Decades later, your quiet obsession with computing leads you to build Google Chrome, and eventually become the CEO of Alphabet.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_sundar.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You stayed safe. But the world belonged to the curious.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SUNDAR',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "LESSON: Curiosity. The system rewards those who follow the rules, but history rewards those who risk their comfort to explore what fascinates them outside the syllabus.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Shah Rukh Khan
    'lvl_age_19_srk': {
        title: "A Stage For Grief",
        source: "Source: Theatre Action Group (TAG) Delhi, early years",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "You are 19. You live in Delhi. Your father just passed away unexpectedly, leaving your family in a precarious financial state. Despite doing well in Economics at Hansraj College, all you want to do is perform in the local theatre.",
                choices: [
                    {
                        text: "Take a steady, boring office job to support your grieving mother and sister immediately.",
                        next: 'office',
                        score: -5,
                        feedbackTitle: "The Responsible Trap",
                        feedback: "It is the honorable thing to do. However, the soul-crushing routine quietly extinguishes your massive creative energy."
                    },
                    {
                        text: "Keep doing unpaid theatre. Channel your immense grief, anger, and manic energy entirely into your acting.",
                        next: 'theatre',
                        score: 10,
                        feedbackTitle: "The Alchemy of Pain",
                        feedback: "You have very little money, but on stage under Barry John's direction, your pain transforms into an electric, magnetic aura."
                    }
                ]
            },
            {
                id: 'office',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "You are making money, but you are miserable. You realize you can't protect your family if you are dead inside.",
                choices: [
                    {
                        text: "Accept this life as your duty.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Faded Lights",
                        feedback: "You become another anonymous worker in a massive city."
                    },
                    {
                        text: "Quit the job. Return to the theatre stage where you belong.",
                        next: 'theatre',
                        score: 10,
                        feedbackTitle: "The Rightful Place",
                        feedback: "You step back onto the stage. The energy returns immediately."
                    }
                ]
            },
            {
                id: 'theatre',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "Your performances are brilliant but unorthodox. A television director notices you and offers you a role in a show called 'Fauji'. The pay is okay, but television is looked down upon by pure theatre artists who want to do cinema.",
                choices: [
                    {
                        text: "Reject the TV role holding out for a glamorous cinema debut.",
                        next: 'cinema_wait',
                        score: -5,
                        feedbackTitle: "Ego Over Opportunity",
                        feedback: "You wait years for a film offer that never comes. You starve while waiting for the 'perfect' break."
                    },
                    {
                        text: "Take the TV role. Give it 200% effort, treating it like it's an Academy Award-winning film.",
                        next: 'tv_success',
                        score: 10,
                        feedbackTitle: "There Are No Small Roles",
                        feedback: "Your intense, manic performance as Abhimanyu Rai makes you a nationwide sensation overnight."
                    }
                ]
            },
            {
                id: 'cinema_wait',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "Waiting for the perfect launch vehicle is pointless if no one knows who you are.",
                choices: [
                    {
                        text: "Call the TV director back and swallow your pride.",
                        next: 'tv_success',
                        score: 10,
                        feedbackTitle: "Hustle",
                        feedback: "You take the opportunity in front of you instead of the one in your head."
                    }
                ]
            },
            {
                id: 'tv_success',
                bg: '/assets/avatar_srk.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your television success propels you to Mumbai. With zero film connections and immense hustle, you go on to conquer Bollywood and become its undisputed King.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_srk.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The fire inside you was put out by pragmatism.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SRK',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "LESSON: Passion. When dealing with immense pain, the logical choice is to seek safety. The extraordinary choice is to channel that devastation into an undeniable, obsessive drive for your craft.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
    // AGE 18: Virat Kohli
    'lvl_age_18_kohli': {
        title: "The King's Promise",
        source: "Source: Delhi vs Karnataka, Ranji Trophy 2006",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_virat_pavilion.jpg',
                text: "December 19, 2006. You are 18. You are batting overnight on 40 for Delhi in a crucial Ranji Trophy match against Karnataka. Your team is struggling and staring at a follow-on. At 3 AM, your father passes away from a stroke.",
                choices: [
                    {
                        text: "Stay home and mourn. Family first.",
                        next: 'stay_home',
                        score: -10,
                        feedbackTitle: "Understandable, but ordinary",
                        feedback: "Everyone expected you to stay. It's the normal thing to do. Your team loses the match, and cricket takes a back seat for years."
                    },
                    {
                        text: "Go to the stadium and bat. Save the team.",
                        next: 'go_bat',
                        score: 10,
                        feedbackTitle: "The Defining Moment",
                        feedback: "Your coach and teammates are shocked to see you. You pad up in silence. You know this is what your father wanted for you."
                    }
                ]
            },
            {
                id: 'stay_home',
                bg: '/assets/bg_virat_pavilion.jpg',
                text: "You stayed back. The grief is overwhelming. A month later, you return to the nets, but the fire isn't the same.",
                choices: [
                    {
                        text: "Push yourself harder to make him proud.",
                        next: 'go_bat',
                        score: 10,
                        feedbackTitle: "Redemption",
                        feedback: "You realize he wouldn't want you to quit. You get back to the grind."
                    },
                    {
                        text: "It's too much pressure. Focus on a normal job.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "A Faded Dream",
                        feedback: "Not everyone is built to absorb that kind of tragedy and turn it into fuel."
                    }
                ]
            },
            {
                id: 'go_bat',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "You walk out to the middle. The opposition is fierce, knowing your mental state. Every ball is a test of your focus.",
                choices: [
                    {
                        text: "Play aggressively. Let the anger out.",
                        next: 'aggressive',
                        score: -5,
                        feedbackTitle: "Lost Control",
                        feedback: "You hit a few boundaries but throw your wicket away in anger. The team still loses."
                    },
                    {
                        text: "Block the noise. Focus entirely on the ball. Play a disciplined innings.",
                        next: 'disciplined_90',
                        score: 10,
                        feedbackTitle: "The Anchor",
                        feedback: "You batted for almost 5 hours. You scored a match-saving 90 runs. The umpires called it off due to bad light."
                    }
                ]
            },
            {
                id: 'aggressive',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "Your anger clouded your judgment. But your resolve is noted by the selectors.",
                choices: [
                    {
                        text: "Accept the mistake and focus on control next time.",
                        next: 'disciplined_90',
                        score: 10,
                        feedbackTitle: "Growth Mindset",
                        feedback: "Channeling aggression into discipline is what separates the good from the great."
                    }
                ]
            },
            {
                id: 'disciplined_90',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "After you were controversially given out on 90, you saved Delhi from the follow-on. Only after the day's play did you go straight to your father's cremation.",
                choices: [
                    {
                        text: "Acknowledge the defining day of your life.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "A Boy Became a Man",
                        feedback: "That day changed you. The boy who loved to party became obsessed with fitness, discipline, and winning. You became The King."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_virat_kohli.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "From that day on, you never compromised on cricket. You went on to lead India to historic victories globally.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_virat_kohli.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your journey diverged from greatness. The pain was too great a burden.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_VIRAT',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "LESSON: Resilience. When personal tragedy strikes, the greats channel their pain into their craft, transforming grief into unwavering focus.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Dr. A.P.J. Abdul Kalam
    'lvl_age_18_kalam': {
        title: "The Big Leap",
        source: "Source: 'Wings of Fire', Autobiography",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_kalam_college.jpg',
                text: "It is 1949. You are 18. You've arrived at St. Joseph's College in Tiruchirappalli from the small temple town of Rameswaram. You used to deliver newspapers. Now, you are surrounded by wealthy, English-speaking, city-bred students.",
                choices: [
                    {
                        text: "Hide in your room. Try not to be noticed.",
                        next: 'hide',
                        score: -10,
                        feedbackTitle: "Inferiority Complex",
                        feedback: "You let your background dictate your worth. You pass your classes but remain unremarkable."
                    },
                    {
                        text: "Embrace the library. Your intellect is your true equalizer.",
                        next: 'library',
                        score: 10,
                        feedbackTitle: "The Seeker",
                        feedback: "You realize that physics doesn't care if you speak perfect English. You dive deep into textbooks."
                    }
                ]
            },
            {
                id: 'hide',
                bg: '/assets/bg_kalam_college.jpg',
                text: "You feel invisible. Your grades are suffering because you are too afraid to ask questions in class.",
                choices: [
                    {
                        text: "Gather courage and approach a professor for help.",
                        next: 'library',
                        score: 10,
                        feedbackTitle: "Breaking the Shell",
                        feedback: "Rev. Father Iyadurai is impressed by your curiosity and takes you under his wing."
                    },
                    {
                        text: "Give up and return to Rameswaram.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Retreat",
                        feedback: "You go back. India loses a visionary."
                    }
                ]
            },
            {
                id: 'library',
                bg: '/assets/bg_kalam_college.jpg',
                text: "Your dedication is absolute. Your roommate, reading a novel, asks you to take a break and go to town.",
                choices: [
                    {
                        text: "Go to town. Socializing is important too.",
                        next: 'distraction',
                        score: -5,
                        feedbackTitle: "Lost Focus",
                        feedback: "It's fine to relax, but you lose precious hours reviewing a complex aerodynamics concept."
                    },
                    {
                        text: "Politely decline. Let's finish this chapter on subatomic physics first.",
                        next: 'focus_physics',
                        score: 10,
                        feedbackTitle: "Laser Focus",
                        feedback: "Your professors notice your relentless curiosity. You aren't just memorizing; you are understanding the universe."
                    }
                ]
            },
            {
                id: 'distraction',
                bg: '/assets/bg_kalam_college.jpg',
                text: "You enjoyed the evening, but tomorrow's test hits you hard. You realize time is the only asset you have.",
                choices: [
                    {
                        text: "Double down on studying tonight to catch up.",
                        next: 'focus_physics',
                        score: 10,
                        feedbackTitle: "Correction",
                        feedback: "You bounce back. It's about how you recover."
                    }
                ]
            },
            {
                id: 'focus_physics',
                bg: '/assets/bg_kalam_college.jpg',
                text: "Through pure grit, you excel. A visiting professor talks about a new field: Aeronautics. Your eyes light up.",
                choices: [
                    {
                        text: "Decide right then that you will build planes.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Dream is Born",
                        feedback: "From a boy selling newspapers on a train platform, you set your sights on the sky."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_apj_kalam.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You eventually go to Madras Institute of Technology. You go on to build India's first satellite launch vehicle and serve as the People's President.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_apj_kalam.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The intimidation of the city was too much. The dream ended before it began.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_KALAM',
                bg: '/assets/bg_kalam_college.jpg',
                text: "LESSON: Self-Belief. Your current circumstances or background do not define your potential. Knowledge is the ultimate equalizer.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Ratan Tata
    'lvl_age_18_tata': {
        title: "The Defiant Blueprint",
        source: "Source: Ratan Tata's early life interviews",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "It is 1955. You are an 18-year-old Ratan Tata. You have just arrived at Cornell University in New York. Your father strongly expects you to study Engineering and join the family business.",
                choices: [
                    {
                        text: "Follow your father's wishes. Enroll in Engineering.",
                        next: 'engineering',
                        score: -10,
                        feedbackTitle: "Dutiful, but Hollow",
                        feedback: "You study engineering, but your heart isn't in it. You become a capable manager, but lack creative vision."
                    },
                    {
                        text: "Refuse. Enroll secretly in Architecture, your true passion.",
                        next: 'architecture',
                        score: 10,
                        feedbackTitle: "The Rebel Heir",
                        feedback: "You risk your father's wrath. You want to design, to build structures with empathy and aesthetic."
                    }
                ]
            },
            {
                id: 'engineering',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "Engineering classes feel like a chore. You find yourself sketching buildings in the margins of your thermodynamics notes.",
                choices: [
                    {
                        text: "Make the bold switch to Architecture now.",
                        next: 'architecture',
                        score: 10,
                        feedbackTitle: "Better Late",
                        feedback: "You finally gather the courage to follow your own path."
                    },
                    {
                        text: "Stay the course. Don't rocking the boat.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "A Life Unlived",
                        feedback: "You conform. The fire inside you slowly dies."
                    }
                ]
            },
            {
                id: 'architecture',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "You switch to architecture. When your father finds out, he is furious. He cuts off significant financial support.",
                choices: [
                    {
                        text: "Apologize and switch back to Engineering.",
                        next: 'engineering',
                        score: -10,
                        feedbackTitle: "Yielding to Pressure",
                        feedback: "You chose financial security over your passion."
                    },
                    {
                        text: "Work odd jobs in the US to support yourself. Stick to your choice.",
                        next: 'odd_jobs',
                        score: 10,
                        feedbackTitle: "Independence",
                        feedback: "You wash dishes. You learn the dignity of labor. You realize you don't need the Tata name to survive."
                    }
                ]
            },
            {
                id: 'odd_jobs',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "You graduate with a degree in Architecture. Your grandmother, Navajbai, is proud of your independence.",
                choices: [
                    {
                        text: "Now that you have your degree, chart your own path.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Authentic Leader",
                        feedback: "The design thinking and structural empathy you learned in architecture later became your superpower when leading the vast Tata conglomerate."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_ratan_tata.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You returned to India and eventually led the Tata Group, launching the Indica, acquiring JLR, and operating with deep empathy.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_ratan_tata.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You lived a comfortable life, but always wondered what you could have built.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_TATA',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "LESSON: Authenticity. Defying expectations to follow your true passion is painful, but it gives you a unique perspective that conformity never could.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
    // AGE 18: Taylor Swift (The Artist)
    'lvl_age_18': {
        title: "The Nashville Choice",
        source: "Source: 'Taylor Swift: The Life of a Songwriter' & Rolling Stone Interviews.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_taylor_cafe.png',
                text: "It's 2008. You are 15 (but let's say 18 for game flow). You're sitting in the Bluebird Cafe in Nashville. Scott Borchetta from a new indie label 'Big Machine' is watching you.",
                choices: [
                    {
                        text: "Play a cover of a popular hit.",
                        next: 'safe_route',
                        score: -10,
                        feedbackTitle: "Just Another Singer",
                        feedback: "Scott is looking for a unique voice, not a karaoke machine. Playing it safe gets you nowhere in art."
                    },
                    {
                        text: "Play your original song 'Tim McGraw'.",
                        next: 'risk_route',
                        score: 10,
                        feedbackTitle: "Bold Move",
                        feedback: "Yes! You bet on your own songwriting. Scott is captivated by your storytelling."
                    }
                ]
            },
            {
                id: 'safe_route',
                bg: '/assets/bg_taylor_studio.png',
                text: "You sound great, but you sound like everyone else. Scott leaves early. You finish high school and wonder 'what if'.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'risk_route',
                bg: '/assets/bg_taylor_studio.png',
                text: "Scott offers you a deal, but it's a tiny label with no money. RCA Records also wants you, but they want you to sing other people's songs.",
                choices: [
                    {
                        text: "Take the RCA deal. They have money!",
                        next: 'rca_fail',
                        score: -10,
                        feedbackTitle: "Golden Handcuffs",
                        feedback: "You sign with RCA. They shelf you for 2 years because they 'don't know what to do with you'. Authenticity matters more than budget."
                    },
                    {
                        text: "Sign with Scott/Big Machine.",
                        next: 'tour_grind',
                        score: 10,
                        feedbackTitle: "Creative Control",
                        feedback: "Smart. You chose the partner who let you write your own music, even if they had less cash."
                    }
                ]
            },
            {
                id: 'rca_fail',
                bg: '/assets/bg_taylor_studio.png',
                text: "You sign with RCA. They shelf you for 2 years because they 'don't know what to do with you'. Authenticity matters more than budget.",
                choices: [
                    { text: "Try Again", next: 'risk_route', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'tour_grind',
                bg: '/assets/bg_taylor_bus.png',
                text: "The album is out. It's doing okay, but you need more fans. Radio stations are the gatekeepers.",
                choices: [
                    {
                        text: "Send mass emails to DJs.",
                        next: 'email_fail',
                        score: -5,
                        feedbackTitle: "Impersonal",
                        feedback: "It's efficient, but easily ignored. In the ending of the day, people buy from people."
                    },
                    {
                        text: "Go on a 6-month radio tour. Bake cookies for DJs.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Hustle",
                        feedback: "Legendary. Taylor visited every single radio station, remembered their kids' names, and baked them cookies. They played her song because they loved HER."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Tim McGraw hits the Billboard Hot 100. You are on your way to becoming the biggest star in the world.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUTHENTICITY. Taylor Swift didn't have the best voice or the most money. She had her own stories and a relentless work ethic. Bet on your unique voice.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Mark Zuckerberg (The Visionary)
    'lvl_age_19': {
        title: "The Dropout Dilemma",
        source: "Source: 'The Facebook Effect' by David Kirkpatrick.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_zuck_dorm.png',
                text: "It's 2004. You are 19. Harvard classes are getting in the way of your side project, 'TheFacebook'. It's growing too fast.",
                choices: [
                    {
                        text: "Focus on grades. Harvard is prestigious!",
                        next: 'grades_fail',
                        score: -10,
                        feedbackTitle: "Missed the Wave",
                        feedback: "Friendster and MySpace would have crushed you. Timing is everything in tech."
                    },
                    {
                        text: "Move to Palo Alto for the summer.",
                        next: 'palo_alto',
                        score: 10,
                        feedbackTitle: "All In",
                        feedback: "Correct. Mark knew he needed to be where the investors and engineers were."
                    }
                ]
            },
            {
                id: 'palo_alto',
                bg: '/assets/bg_zuck_pool.png',
                text: "You're renting a house with Sean Parker. Yahoo offers to buy you for $1 Billion. Everyone tells you to take it.",
                choices: [
                    {
                        text: "Take the $1 Billion!",
                        next: 'sell_out',
                        score: -10,
                        feedbackTitle: "Short Term Thinking",
                        feedback: "You're rich, but you're not the King. Someone else builds the future of communication."
                    },
                    {
                        text: "Refuse. We're building a network, not a flip.",
                        next: 'growth',
                        score: 10,
                        feedbackTitle: "Conviction",
                        feedback: "History was made. Mark famously walked out of the meeting because he knew the potential was trillions, not billions."
                    }
                ]
            },
            {
                id: 'growth',
                bg: '/assets/scenario_office.jpg',
                text: "You kept control. Now you need to hire. A brilliant engineer comes in, but he's wearing pajamas to the interview.",
                choices: [
                    {
                        text: "Don't hire. Unprofessional.",
                        next: 'culture_fail',
                        score: -10,
                        feedbackTitle: "Old School",
                        feedback: "In Silicon Valley, code wins arguments, not suits. You missed a 10x engineer."
                    },
                    {
                        text: "Hire him. Check his code.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Meritocracy",
                        feedback: "You built a culture where ability mattered more than appearance. Facebook shipped faster than anyone else."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/zuck_happy.jpg',
                text: "The network hits 500 million users. You connected the world.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/zuck_happy.jpg',
                text: "LESSON: CONVICTION. When you have data that the world doesn't see yet, you have to trust it. Even when a billion dollars is on the table.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },



    // AGE 20 (Music): Taylor Swift (The Solo Experiment)
    'lvl_age_20_music': {
        title: "The Solo Experiment",
        source: "Source: 'Speak Now' Album Liner Notes & Rolling Stone.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_taylor_awards.png',
                bgPosition: 'object-right',
                text: "It's 2010. You are 20. Critics are saying you don't write your own songs and that you rely on Nashville pros.",
                choices: [
                    {
                        text: "Play it safe. Hire top co-writers.",
                        next: 'safe_bet',
                        score: -10,
                        feedbackTitle: "Safety Net",
                        feedback: "You make a great album, but the whispers never stop. 'She's just a puppet.'"
                    },
                    {
                        text: "Write the entire album 100% alone.",
                        next: 'solo_write',
                        score: 10,
                        feedbackTitle: "Bold Move",
                        feedback: "You lock yourself in your room. No co-writers. Just you and the guitar."
                    }
                ]
            },
            {
                id: 'safe_bet',
                bg: '/assets/bg_taylor_room.png',
                text: "The album travels well, but you feel like you haven't proved yourself.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'solo_write',
                bg: '/assets/bg_taylor_room.png',
                text: "It's lonely and hard. You have no one to bounce ideas off of. But the songs are brutally honest.",
                choices: [
                    {
                        text: "Ask a producer to tweak the lyrics.",
                        next: 'compromise',
                        score: -5,
                        feedbackTitle: "Doubt",
                        feedback: "It would help, but it ruins the point of the experiment."
                    },
                    {
                        text: "Trust your own pen. Submit it as is.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Self-Belief",
                        feedback: "'Speak Now' becomes a classic. Hand-written by Taylor Swift. The critics are silenced."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You win 2 Grammys for the album. You proved that your voice is yours alone.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUTONOMY. Sometimes the only way to kill impostor syndrome is to do the hard thing completely on your own.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Sports): Kobe Bryant (The Mamba)
    'lvl_age_20_sports': {
        title: "The 4 AM Club",
        source: "Source: 'The Mamba Mentality' by Kobe Bryant.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_kobe_court.png',
                bgPosition: 'object-left',
                text: "It's 1998. You are 20. You play for the Lakers. The team is going out to a club in LA to celebrate a win.",
                choices: [
                    {
                        text: "Go with them. Team bonding!",
                        next: 'party',
                        score: -10,
                        feedbackTitle: "Distraction",
                        feedback: "You had fun, but you missed practice the next morning. Greatness requires sacrifice."
                    },
                    {
                        text: "Go to the gym. 4 AM workout.",
                        next: 'gym',
                        score: 10,
                        feedbackTitle: "Discipline",
                        feedback: "While they slept, you worked. You made 400 shots before sunrise."
                    }
                ]
            },
            {
                id: 'party',
                bg: '/assets/bg_kobe_club.png',
                text: "You wake up hungover. Coach Del Harris benches you for being sluggish.",
                choices: [
                    { text: "Restart", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'gym',
                bg: '/assets/bg_kobe_gym.png',
                text: "Your teammates arrive at 10 AM, groggy. You've already done a full workout. A reporter asks why you work so hard.",
                choices: [
                    {
                        text: "To be better than Shaq.",
                        next: 'rivalry',
                        score: -5,
                        feedbackTitle: "Comparison",
                        feedback: "Competition is good, but the real battle is with yourself."
                    },
                    {
                        text: "To see what I'm capable of.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Mastery",
                        feedback: "You didn't cheat the grind. That's why you became a legend."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_kobe.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You win 5 Championships. The world calls it talent. You know it was the 4 AMs.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_kobe.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: DISCIPLINE. Talent is common. What separates the greats is the willingness to do the boring, hard work when no one is watching.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Education): NV Sir (The Mentor)
    'lvl_age_20_nv_sir': {
        title: "The Educator's Dilemma",
        source: "Source: NV Sir's Life Journey.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_nv_sir_family.jpg',
                bgPosition: 'object-center',
                text: "Your family needs financial support NOW. Your IIT degree is 2 years away. A relative offers you a part-time BPO night shift job — ₹8,000/month, stable. A local school offers you a teaching gig — ₹2,000/month, uncertain.",
                choices: [
                    {
                        text: "Take the BPO job — stable money, family relieved immediately.",
                        next: 'bpo_job',
                        score: -10,
                        feedbackTitle: "Responsible but Stagnant",
                        feedback: "You helped your family, but the night shifts drained your energy. You never finished IIT or pursued your true passion."
                    },
                    {
                        text: "Take the teaching job despite lower pay.",
                        next: 'teaching_job',
                        score: 10,
                        feedbackTitle: "Gut Feeling",
                        feedback: "You followed your passion for physics. The pay was low, but you discovered a natural gift for connecting with students."
                    },
                    {
                        text: "Ask family to manage 2 more years, focus 100% on degree.",
                        next: 'degree_only',
                        score: -5,
                        feedbackTitle: "Long-term bet",
                        feedback: "While practical, life doesn't always wait. Sometimes you need to build your skills while earning."
                    },
                    {
                        text: "Take both jobs + college — grind everything at once.",
                        next: 'burnout',
                        score: -5,
                        feedbackTitle: "Maximum hustle",
                        feedback: "Burnout hits hard within 3 months. Quality in teaching drops, and grades suffer."
                    }
                ]
            },
            {
                id: 'bpo_job',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "The stability feels good initially, but you realize you are sacrificing your long-term potential.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'degree_only',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "The financial strain is too much. You realize you have to do something now.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'burnout',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "You can't do it all. You have to choose where to focus your extra time.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'teaching_job',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "The only good coaching institute that'll hire you is 44 km away. Your friend says 'bro just tutor 5 kids at home, you'll earn the same with zero travel.' Your senior says 'that institute has 200 students — your career will explode if you crack it.'",
                choices: [
                    {
                        text: "Home tuitions — same money, zero commute, more sleep.",
                        next: 'home_tuition',
                        score: -5,
                        feedbackTitle: "Smart & Practical",
                        feedback: "Comfortable, but limits your growth. You never build the large-scale impact you were meant for."
                    },
                    {
                        text: "Do the 44 km daily — bet on the bigger stage.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Risk it",
                        feedback: "You endure the grueling commute. Standing in front of 200 students pushes you to become a master communicator. Your reputation skyrockets."
                    },
                    {
                        text: "Apply to closer institutes first, commute only if nothing works.",
                        next: 'delay',
                        score: -5,
                        feedbackTitle: "Logical Backup",
                        feedback: "The closer institutes don't have the same caliber of students or mentors. Your growth is slow."
                    },
                    {
                        text: "Delay teaching, focus on cracking campus placement instead.",
                        next: 'safe_exit',
                        score: -10,
                        feedbackTitle: "Safe Exit",
                        feedback: "You get a software job, but you always wonder what could have happened if you nurtured your teaching talent."
                    }
                ]
            },
            {
                id: 'home_tuition',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "You earn decent money, but your impact remains small.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'delay',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "The delay costs you valuable momentum and exposure.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'safe_exit',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "You chose safety over passion, missing out on your true calling.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_nv_sir.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black', // add black bg fill
                text: "Your dedication pays off. You become a legendary physics teacher, eventually founding your own massive education platform.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_nv_sir.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black', // add black bg fill
                text: "LESSON: LONG-TERM VISION. True growth often requires sacrificing short-term comfort for a larger platform and greater impact. Bet on your potential.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Art): Frida Kahlo (The Icon)
    'lvl_age_20_art': {
        title: "The Broken Column",
        source: "Source: 'Frida: A Biography of Frida Kahlo'.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_frida_bed.png',
                bgPosition: 'object-left',
                text: "It's 1927. You are 20. A bus accident shattered your spine. You are stuck in a body cast in bed for months.",
                choices: [
                    {
                        text: "Stare at the ceiling and cry.",
                        next: 'despair',
                        score: -10,
                        feedbackTitle: "Passive",
                        feedback: "The pain consumed you. You lost your spark."
                    },
                    {
                        text: "Ask for a mirror and paints.",
                        next: 'paint',
                        score: 10,
                        feedbackTitle: "Expression",
                        feedback: "Your mother installed a mirror above your bed. You became your own muse."
                    }
                ]
            },
            {
                id: 'despair',
                bg: '/assets/bg_frida_bed.png',
                bgPosition: 'object-right',
                text: "The days blend together. You lose hope.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'paint',
                bg: '/assets/bg_frida_painting.png',
                text: "You paint your pain. It's raw and weird. Critics might find it too personal.",
                choices: [
                    {
                        text: "Paint pretty flowers instead.",
                        next: 'safe_art',
                        score: -10,
                        feedbackTitle: "Conformity",
                        feedback: "Pretty pictures are forgettable. Your truth is what makes you Frida."
                    },
                    {
                        text: "Paint the blood and the tears.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Authenticity",
                        feedback: "You turned tragedy into art. The world had never seen anything so honest."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_frida.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your work shocks and amazes the world. You become an icon of strength.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_frida.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: RESILIENCE. You can't control what happens to you (the accident), but you can control what you create from it. Turn your pain into power.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Bill Gates (The Architect) - Default/Tech
    'lvl_age_20': {
        title: "The Software Gamble",
        source: "Source: 'Hard Drive: Bill Gates and the Making of the Microsoft Empire'.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_gates_dorm.png',
                bgPosition: 'object-left',
                text: "It's 1975. You are 20. You see the Altair 8800 on the cover of Popular Electronics. It's the first 'Personal Computer'.",
                choices: [
                    {
                        text: "Wait until you graduate Harvard.",
                        next: 'too_late',
                        score: -10,
                        feedbackTitle: "Hesitation",
                        feedback: "By the time you graduated, the OS market would have been cornered by CP/M."
                    },
                    {
                        text: "Call MITS and say you have an interpreter.",
                        next: 'bluff',
                        score: 10,
                        feedbackTitle: "Aggressive Action",
                        feedback: "You didn't actually have the software yet! But you committed, then worked day and night to build it."
                    }
                ]
            },
            {
                id: 'bluff',
                bg: '/assets/bg_gates_dorm.png',
                text: "They want a demo in 3 weeks. You have nothing written. You and Paul Allen ignore all your classes.",
                choices: [
                    {
                        text: "Sleep 8 hours a day to stay fresh.",
                        next: 'slow_fail',
                        score: -5,
                        feedbackTitle: "Balanced but Slow",
                        feedback: "Healthy, but start-up sprints sometimes require unhealthy bursts of intensity."
                    },
                    {
                        text: "Code until you pass out at the keyboard.",
                        next: 'ibm_deal',
                        score: 10,
                        feedbackTitle: "Obsession",
                        feedback: "Bill famously fell asleep on his keyboard, woke up, and kept typing. That intensity won the race."
                    }
                ]
            },
            {
                id: 'ibm_deal',
                bg: '/assets/bg_gates_boardroom.png',
                text: "Microsoft is growing. IBM comes knocking. They need an OS for their new PC. You don't have one.",
                choices: [
                    {
                        text: "Tell them you can't help.",
                        next: 'missed_boat',
                        score: -10,
                        feedbackTitle: "Honest but Poor",
                        feedback: "You missed the biggest deal in history."
                    },
                    {
                        text: "Buy 'Q-DOS' from another guy for $50k.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Leverage",
                        feedback: "You bought Q-DOS for $50k, licensed it to IBM for millions, and kept the rights to sell it to others. The smartest deal ever made."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_bill_gates.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "IBM PCs ship with MS-DOS. You own the standard for all computing software.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_bill_gates.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: LEVERAGE. Bill Gates didn't invent the OS. He acquired it and positioned himself as the gatekeeper. Speed and positioning beat invention.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 21: Steve Jobs (The Rebel)
    'lvl_age_21': {
        title: "The Garage Startup",
        source: "Source: 'Steve Jobs' by Walter Isaacson.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_jobs_garage.png',
                bgPosition: 'object-left',
                text: "It's 1976. You are 21. You and Wozniak built the Apple I circuit board in your parents' garage.",
                choices: [
                    {
                        text: "Sell the schematics to HP.",
                        next: 'employee',
                        score: -10,
                        feedbackTitle: "Employee Mindset",
                        feedback: "Wozniak wanted to do this. If you had, you'd be a mid-level manager at HP today."
                    },
                    {
                        text: "Start a company to sell the boards.",
                        next: 'byte_shop',
                        score: 10,
                        feedbackTitle: "Ownership",
                        feedback: "You realized the value wasn't just in the hobby, but in the product."
                    }
                ]
            },
            {
                id: 'byte_shop',
                bg: '/assets/bg_jobs_store.png',
                text: "The Byte Shop offers to buy 50 computers... giving you barely enough cash for parts.",
                choices: [
                    {
                        text: "Ask dad for a loan.",
                        next: 'slow_growth',
                        score: -5,
                        feedbackTitle: "Safe",
                        feedback: "It works, but you need credit specifically for parts inventory."
                    },
                    {
                        text: "Negotiate 30 days credit with suppliers.",
                        next: 'vision',
                        score: 10,
                        feedbackTitle: "Cash Flow Logic",
                        feedback: "You convinced suppliers to give you parts based on the purchase order. You funded the company on pure salesmanship."
                    }
                ]
            },
            {
                id: 'vision',
                bg: '/assets/scenario_office.jpg',
                text: "You are building the Apple II. Engineers want to add expansion slots for hackers. You want it sealed and beautiful.",
                choices: [
                    {
                        text: "Let the engineers decide.",
                        next: 'generic_pc',
                        score: -10,
                        feedbackTitle: "Design by Committee",
                        feedback: "The Apple II would have been just another ugly gray box."
                    },
                    {
                        text: "Demand perfection. It must handle smoothly.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Product Vision",
                        feedback: "You treated the computer like an appliance, not a toy for geeks. This opened the market to normal people."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_steve_jobs.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Apple goes public. You are worth $200 million at age 25.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_steve_jobs.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: PERFECTIONISM. Jobs didn't settle for 'good enough'. He insisted on end-to-end control and beauty, creating a brand that people loved, not just used.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Walt Disney (The Dreamer)
    'lvl_age_22': {
        title: "The Bankruptcy",
        source: "Source: 'Walt Disney: The Triumph of the American Imagination'.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_disney_studio_old.png',
                bgPosition: 'object-left',
                text: "It's 1923. You are 22. Your first animation studio 'Laugh-O-Gram' has gone bankrupt. You can't pay rent.",
                choices: [
                    {
                        text: "Get a job at a newspaper.",
                        next: 'normal_life',
                        score: -10,
                        feedbackTitle: "Giving Up",
                        feedback: "Safe choice, but no Mickey Mouse."
                    },
                    {
                        text: "Buy a train ticket to Hollywood.",
                        next: 'hollywood',
                        score: 10,
                        feedbackTitle: "Next Adventure",
                        feedback: "With $40 in his pocket, Walt left his failures in Kansas City and went where the movies were made."
                    }
                ]
            },
            {
                id: 'hollywood',
                bg: '/assets/bg_disney_train.png',
                text: "You lose the rights to your first hit character, 'Oswald the Rabbit'. Your partners betray you.",
                choices: [
                    {
                        text: "Sue them.",
                        next: 'legal_battle',
                        score: -10,
                        feedbackTitle: "Distraction",
                        feedback: "You don't have the money for lawyers. You need a new idea."
                    },
                    {
                        text: "Sketch a new mouse on the train ride home.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Creativity",
                        feedback: "Instead of panicking, Walt sketched Mickey Mouse. The rest is history."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_walt_disney.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Steamboat Willie premieres. It's the first cartoon with sound.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_walt_disney.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: RESILIENCE. Bankruptcy wasn't the end; it was just the prologue. When one door closes (Oswald), draw a door of your own (Mickey).",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 23: Oprah (The Voice)
    'lvl_age_23': {
        title: "The Demotion",
        source: "Source: 'Oprah: A Biography' by Kitty Kelley.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_oprah_newsroom.png',
                bgPosition: 'object-left',
                text: "It's 1977. You are 23. You land a huge job as a news anchor in Baltimore. But you get too emotional reading the stories.",
                choices: [
                    {
                        text: "Try to be colder and more serious.",
                        next: 'robot',
                        score: -10,
                        feedbackTitle: "Masking",
                        feedback: "You can't suppress your nature. Viewers see through the fake persona."
                    },
                    {
                        text: "Cry when the story is sad. Be you.",
                        next: 'fired',
                        score: 10,
                        feedbackTitle: "Empathy",
                        feedback: "The producer hates it. He fires you from the 6pm news. But your empathy is your superpower."
                    }
                ]
            },
            {
                id: 'fired',
                bg: '/assets/bg_oprah_talkshow.png',
                text: "They demote you to a low-rated morning talk show 'People Are Talking'. It feels like a failure.",
                choices: [
                    {
                        text: "Quit and move home.",
                        next: 'quit',
                        score: -10,
                        feedbackTitle: "Defeat",
                        feedback: "It looked like a demotion, but it was actually an alignment."
                    },
                    {
                        text: "Lean into the talk format.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Finding Flow",
                        feedback: "As soon as you sat in that chair, you realized: 'This is what I was born to do.'"
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_oprah.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The morning show beats Donahue in the ratings. Chicago comes calling.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_oprah.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: ALIGNMENT. Sometimes a 'failure' (getting fired from news) pushes you into your destiny (talk show). Your 'weakness' (emotion) was actually your greatest strength.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 24: Elon Musk (The Iron Man)
    'lvl_age_24': {
        title: "The Couch Surfer",
        source: "Source: 'Elon Musk' by Walter Isaacson.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_musk_office.png',
                bgPosition: 'object-left',
                text: "It's 1995. You are 24. You start Zip2. You have one computer and $2,000.",
                choices: [
                    {
                        text: "Rent an apartment.",
                        next: 'rent_poor',
                        score: -10,
                        feedbackTitle: "Burn Rate",
                        feedback: "You ran out of money. The company died before it started."
                    },
                    {
                        text: "Sleep in the office beanbag.",
                        next: 'grind',
                        score: 10,
                        feedbackTitle: "Sacrifice",
                        feedback: "Elon showered at the YMCA and coded at night. The website was up during the day."
                    }
                ]
            },
            {
                id: 'grind',
                bg: '/assets/bg_musk_coding.png',
                text: "An investor drops by unexpected at 7 AM. You are asleep on the floor.",
                choices: [
                    {
                        text: "Hide in the closet.",
                        next: 'shame',
                        score: -10,
                        feedbackTitle: "Insecurity",
                        feedback: "Don't be ashamed of the hustle."
                    },
                    {
                        text: "Wake up and pitch him.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Dedication",
                        feedback: "He saw how committed you were. He wrote a check for $3 million."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_elon_musk.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Compaq buys Zip2 for $300 Million. You buy a McLaren.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_elon_musk.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: INTENSITY. Extreme success usually requires a period of extreme imbalance. Elon didn't work 9-5; he worked every waking hour.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 25: J.K. Rowling (The Storyteller)
    'lvl_age_25': {
        title: "The Delayed Train",
        source: "Source: J.K. Rowling's Harvard Commencement Speech.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_rowling_train_window.png',
                bgPosition: 'object-left',
                text: "It's 1990. You are 25. You are stuck on a delayed train from Manchester to London for 4 hours.",
                choices: [
                    {
                        text: "Read a magazine/Nap.",
                        next: 'nap',
                        score: 0,
                        feedbackTitle: "Boredom",
                        feedback: "You killed time. The idea never came."
                    },
                    {
                        text: "Daydream out the window.",
                        next: 'idea',
                        score: 10,
                        feedbackTitle: "Space for Thought",
                        feedback: "In the silence, a boy wizard with glasses 'just fell into your head'."
                    }
                ]
            },
            {
                id: 'idea',
                bg: '/assets/bg_rowling_train_carriage.png',
                text: "You don't have a pen! The idea is flooding your brain.",
                choices: [
                    {
                        text: "Ask a stranger for a pen.",
                        next: 'shy',
                        score: 5,
                        feedbackTitle: "Too Shy",
                        feedback: "Rowling was too shy to ask. She just sat and composed the whole story in her mind perfectly."
                    },
                    {
                        text: "Memorize it all.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Mental Palace",
                        feedback: "By not writing immediately, the details grew richer in her imagination."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_jk_rowling.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You reach King's Cross. You start writing 'Philosopher's Stone'. It will take 7 years to finish.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_jk_rowling.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: PATIENCE. The biggest ideas often come in moments of stillness. And great work takes time—years of it.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },


    // --- ARNOLD SCHWARZENEGGER (Age 20 - The Gamble) ---
    'scenario_arnold_awol': {
        title: "The AWOL Gamble",
        source: "Source: Arnold's Autobiography.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_arnold_train.jpg',
                text: "You are 20. Private in the Austrian Army. The 'Mr. Universe' competition is tomorrow in Germany. You are forbidden to leave.",
                choices: [
                    {
                        text: "Stay at Base",
                        next: 'stay_regret',
                        score: 3,
                        feedbackTitle: "Good Soldier",
                        feedback: "You followed orders. You watched the winner on TV. You realized you valued obedience over your dream."
                    },
                    {
                        text: "Go AWOL",
                        next: 'escape_win',
                        score: 10,
                        feedbackTitle: "The Risk",
                        feedback: "You crawled under the fence, jumped a freight train, and won the trophy! You spent a week in military prison when you returned. Worth it."
                    },
                    {
                        text: "Ask for permission",
                        next: 'ask_fail',
                        score: 5,
                        feedbackTitle: "Bureaucracy",
                        feedback: "You filed the paperwork. The request was denied 3 weeks later. The competition was already over."
                    }
                ]
            },
            {
                id: 'stay_regret',
                bg: '/assets/bg_arnold_train.jpg',
                text: "The regret weighs heavier than the tank you drive.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'ask_fail',
                bg: '/assets/bg_arnold_train.jpg',
                text: "You followed the rules, but the rules weren't made for champions.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'escape_win',
                bg: '/assets/avatar_arnold.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "'Punish me,' you told the officers. 'But look at this trophy.' They put it on the mess hall wall.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_ARNOLD', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_ARNOLD',
                bg: '/assets/avatar_arnold.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: VISION. Rules are there to be broken if the vision is strong enough. 'I didn't want to be a soldier, I wanted to be a Star.'",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // --- STEPHEN HAWKING (Age 20 - The Defiance) ---
    'scenario_hawking_diagnosis': {
        title: "The Death Sentence",
        source: "Source: My Brief History.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_hawking_study.jpg',
                text: "You are 20. The doctors say you have ALS. Two years to live. Your body is failing.",
                choices: [
                    {
                        text: "Listen to Wagner",
                        next: 'give_up',
                        score: 2,
                        feedbackTitle: "Darkness",
                        feedback: "You drank and listened to sad opera. Why work on a PhD if you're going to die?"
                    },
                    {
                        text: "Focus on Work",
                        next: 'purpose_win',
                        score: 10,
                        feedbackTitle: "Mind Over Matter",
                        feedback: "You realized: 'Who knows if I have 2 years or 50? I have time NOW.' You poured your remaining energy into physics."
                    },
                    {
                        text: "Travel the world",
                        next: 'travel_fail',
                        score: 4,
                        feedbackTitle: "Running Away",
                        feedback: "You tried to see the world, but your body couldn't handle the travel. You returned exhausted and felt you wasted precious time."
                    }
                ]
            },
            {
                id: 'give_up',
                bg: '/assets/bg_hawking_study.jpg',
                text: "The universe remains unsolved.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'travel_fail',
                bg: '/assets/bg_hawking_study.jpg',
                text: "Searching for external beauty didn't solve the internal chaos.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'purpose_win',
                bg: '/assets/avatar_hawking.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You didn't die in 2 years. You lived for 55 more, decoding black holes.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_HAWKING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_HAWKING',
                bg: '/assets/avatar_hawking.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: TIME. 'However difficult life may seem, there is always something you can do and succeed at.'",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // --- TINA DABI (Age 24 - The Strategist) ---
    'scenario_upsc_tina_college': {
        title: "The College Sacrifice",
        source: "Source: Tina Dabi's Interviews (2015 Topper).",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_college_canteen.jpg',
                text: "It's your final year at LSR. Everyone is going on a 'Farewell Trip' to Goa. It's the last time to bond with friends.",
                choices: [
                    {
                        text: "Go to Goa",
                        next: 'trip',
                        score: 5,
                        feedbackTitle: "Memories vs Mission",
                        feedback: "You had a great time, but you missed a critical week of Current Affairs. The guilt distracted you for a month."
                    },
                    {
                        text: "Stay in Hostel",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Lonely Path",
                        feedback: "It was miserable watching their photos. But you finished 3 months of backlog newspapers. That discipline won you Rank 1."
                    },
                    {
                        text: "Go for 2 days then study",
                        next: 'balance_fail',
                        score: 6,
                        feedbackTitle: "Half-Hearted",
                        feedback: "You tried to balance both. You came back tired and still missed critical study time. You cleared the exam but missed the top rank."
                    }
                ]
            },
            {
                id: 'trip',
                bg: '/assets/bg_college_canteen.jpg',
                text: "You come back refreshed, but your mock test scores drop. Regulation is key.",
                choices: [
                    { text: "Try Again", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'balance_fail',
                bg: '/assets/bg_college_canteen.jpg',
                text: "'Balance' is for average people. Toppers are obsessed.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_tina_dabi.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your friends have memories. You have a vision. The foundation is set.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_TINA_1', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_TINA_1',
                bg: '/assets/avatar_tina_dabi.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: SACRIFICE. Success requires saying 'No' to good things (fun/friends) to say 'Yes' to great things (The Goal).",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },




    // AGE 20 (Literature): Mary Shelley (The Creator)
    'lvl_age_20_literature': {
        title: "The Monster's Birth",
        source: "Source: 'Mary Shelley: Her Life, Her Fiction, Her Monsters'.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_shelley_villa.jpg',
                bgPosition: 'object-left',
                text: "It's 1816. You are 19 (nearly 20). You are at Villa Diodati with Lord Byron. A storm traps you inside. Byron suggests a ghost story contest.",
                choices: [
                    {
                        text: "Write a typical ghost story about a haunted castle.",
                        next: 'safe_story',
                        score: -10,
                        feedbackTitle: "Cliché",
                        feedback: "It was forgotten. You followed the trend instead of your nightmares."
                    },
                    {
                        text: "Write about a man playing God with science.",
                        next: 'monster_idea',
                        score: 10,
                        feedbackTitle: "Originality",
                        feedback: "You tapped into the fears of the industrial age. Frankenstein was born."
                    }
                ]
            },
            {
                id: 'safe_story',
                bg: '/assets/bg_shelley_writing.jpg',
                text: "Byron yawns. Your story is polite, but it doesn't scare anyone.",
                choices: [
                    { text: "Try Deeper", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'monster_idea',
                bg: '/assets/bg_shelley_writing.jpg',
                text: "You have the idea, but it's terrifying. A reanimated corpse. People might call it blasphemy.",
                choices: [
                    {
                        text: "Soften it. Make it a moral lesson.",
                        next: 'diluted',
                        score: -5,
                        feedbackTitle: "Compromise",
                        feedback: "You lost the raw horror. The story loses its power."
                    },
                    {
                        text: "Write it raw. The horror is the point.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Bold Truth",
                        feedback: "You wrote the first Science Fiction novel in history. You changed literature forever."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_mary_shelley.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Frankenstein becomes a sensation. You are the mother of Science Fiction.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_mary_shelley.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: IMAGINATION. Mary Shelley took a simple prompt and looked into the darkest corners of science and humanity. Don't be afraid of your own dark ideas.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Cinema): Steven Spielberg (The Director)
    'lvl_age_20_cinema': {
        title: "The Universal Gate",
        source: "Source: 'Steven Spielberg: A Biography'.",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg_spielberg_universal.jpg',
                bgPosition: 'object-left',
                text: "It's 1966. You are 20. You've been rejected from USC film school 3 times. You are on a tour bus at Universal Studios.",
                choices: [
                    {
                        text: "Enjoy the tour. Apply again next year.",
                        next: 'wait',
                        score: -10,
                        feedbackTitle: "Waiting",
                        feedback: "You waited for permission. Hollywood doesn't give permission."
                    },
                    {
                        text: "Jump off the bus and hide in a bathroom.",
                        next: 'sneak',
                        score: 10,
                        feedbackTitle: "The Jump",
                        feedback: "You snuck onto the lot. You decided you belonged there, even if they didn't invite you."
                    }
                ]
            },
            {
                id: 'wait',
                bg: '/assets/bg_spielberg_universal.jpg',
                text: "You go home. Another year passes. You are still not a director.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'sneak',
                bg: '/assets/bg_spielberg_office.jpg',
                text: "You find an empty office in the editorial department. It's unlocked.",
                choices: [
                    {
                        text: "Hide in there until nightfall.",
                        next: 'hiding',
                        score: -5,
                        feedbackTitle: "Fear",
                        feedback: "You're just a trespasser. You need to be a director."
                    },
                    {
                        text: "Put your name on the door: 'Steven Spielberg, Director'.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Fake It 'Til You Make It",
                        feedback: "You wore a suit, carried a briefcase, and pretended you worked there. Security waved you in every day for months."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_spielberg_young.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Sid Sheinberg sees your short film 'Amblin' and offers you a 7-year contract. You are a director.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_spielberg_young.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUDACITY. Spielberg didn't wait for a degree. He claimed his spot. Sometimes you have to authorize yourself.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
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

};