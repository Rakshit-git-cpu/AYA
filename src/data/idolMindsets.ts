
export interface IdolMindset {
    name: string;
    archetypeTitle: string; // What they call the user (e.g. "Future Legend")
    quote: string;
    voice: {
        tone: string;
        intro: string; // "I see a lot of myself in you..."
    };
    missions: Record<string, { // Keyed by Gap Trait (e.g. 'discipline')
        title: string;
        desc: string;
        xp: string;
    }>;
    profile: {
        motivation: string;
        risk: string;
        emotional: string;
        social: string;
        passion: string;
        coreValue: string;
    };
    avatarUrl?: string;
}

export const IDOL_MINDSETS: Record<string, IdolMindset> = {
    "Arnold Schwarzenegger": {
        name: "Arnold Schwarzenegger",
        archetypeTitle: "Iron Conqueror",
        quote: "Strength does not come from winning. Your struggles develop your strengths.",
        voice: {
            tone: "Powerful, Direct, No-Nonsense",
            intro: "Listen to me using your own voice. You have the raw material, but do you have the will?"
        },
        missions: {
            discipline: { title: "The Extra Rep", desc: "Do one task today that you absolutely hate doing. Do it perfectly.", xp: "+50 Iron Will" },
            resilience: { title: "Get to the Choppa", desc: "When you fail today (and you will), laugh at it and go again immediately.", xp: "+50 Toughness" },
            risk: { title: "Break the Rules", desc: "Do something unconventional today. Shock the system.", xp: "+50 Boldness" },
            leadership: { title: "Command Presence", desc: "Walk into a room like you own it. Shoulders back, head up.", xp: "+50 Presence" },
            creativity: { title: "Sculpt Your Vision", desc: " visualize your goal clearly. Put it on paper.", xp: "+50 Vision" },
            empathy: { title: "Lift Others", desc: "Spot the weakest person in the room and make them feel strong.", xp: "+50 Heart" },
            vision: { title: "The Blueprint", desc: "Write down exactly where you want to be in 10 years.", xp: "+50 Focus" }
        },
        profile: {
            motivation: 'Fame',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Competitive',
            coreValue: 'Success'
        },
        avatarUrl: '/assets/avatar_arnold.jpg'
    },
    "Stephen Hawking": {
        name: "Stephen Hawking",
        archetypeTitle: "Cosmic Explorer",
        quote: "Intelligence is the ability to adapt to change.",
        voice: {
            tone: "Intellectual, Cosmic, Dry Wit",
            intro: "Your mind is a singularity of potential. Let us observe the data of your choices."
        },
        missions: {
            discipline: { title: "Universal Constant", desc: "Focus on a single complex problem for 20 minutes without diversion.", xp: "+50 Focus" },
            resilience: { title: "Event Horizon", desc: "When blocked, find an alternative path. There is always a way out of a black hole.", xp: "+50 Adaptability" },
            risk: { title: "Quantum Leap", desc: "Propose an idea that sounds impossible. Theory precedes reality.", xp: "+50 Imagination" },
            leadership: { title: "Grand Design", desc: "Explain a complex idea simply to someone else.", xp: "+50 Clarity" },
            creativity: { title: "Theory of Everything", desc: "Connect two completely unrelated concepts into one solution.", xp: "+50 Synthesis" },
            empathy: { title: "Human Connection", desc: "Observe human behavior today without judgment, only curiosity.", xp: "+50 Observation" },
            vision: { title: "Time Traveler", desc: "Imagine the consequences of your next decision 100 years from now.", xp: "+50 Foresight" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Balanced',
            emotional: 'Analytical',
            social: 'Observer',
            passion: 'Intellectual',
            coreValue: 'Impact'
        },
        avatarUrl: '/assets/avatar_hawking.png'
    },
    "Frida Kahlo": {
        name: "Frida Kahlo",
        archetypeTitle: "Vivid Soul",
        quote: "I paint my own reality.",
        voice: {
            tone: "Emotional, Raw, Artistic",
            intro: "I see the colors of your soul. You are not afraid of the pain, are you?"
        },
        missions: {
            discipline: { title: "Ritual of Art", desc: "Commit to your craft for 1 hour, even if your heart feels heavy.", xp: "+50 Devotion" },
            resilience: { title: "Beautiful Scars", desc: "Take a painful memory and turn it into something creative today.", xp: "+50 Depth" },
            risk: { title: "Expose Yourself", desc: "Share a truth about yourself that you usually hide.", xp: "+50 Authenticity" },
            leadership: { title: "Matriarch", desc: "Stand firm in your truth when others disagree.", xp: "+50 Conviction" },
            creativity: { title: "Paint Reality", desc: "Create something—anything—that reflects how you feel right now.", xp: "+50 Expression" },
            empathy: { title: "Deep Roots", desc: "Ask someone about their pain, not just their day.", xp: "+50 Connection" },
            vision: { title: "Dream Awake", desc: "Daydream vividly about your masterpiece lifestyle.", xp: "+50 Dreaming" }
        },
        profile: {
            motivation: 'Freedom',
            risk: 'Bold',
            emotional: 'Sensitive',
            social: 'Creator',
            passion: 'Creative',
            coreValue: 'Art'
        },
        avatarUrl: '/assets/avatar_frida.png'
    },
    "Kobe Bryant": {
        name: "Kobe Bryant",
        archetypeTitle: "Mamba Disciple",
        quote: "Rest at the end, not in the middle.",
        voice: {
            tone: "Obsessive, Competitive, Mythical",
            intro: "Talent is boring. I’m looking for your obsession. Let's see if you have it."
        },
        missions: {
            discipline: { title: "4 AM Club", desc: "Start your work before anyone else wakes up.", xp: "+50 Obsession" },
            resilience: { title: "Airball Recovery", desc: "Miss a shot? Shoot 100 more immediately.", xp: "+50 Grit" },
            risk: { title: "Take the Shot", desc: "Volunteer for the task everyone else is afraid of.", xp: "+50 Clutch" },
            leadership: { title: "Demand Excellence", desc: "Hold a teammate accountable to a higher standard.", xp: "+50 Command" },
            creativity: { title: "Study the Tape", desc: "Analyze a master in your field. Copy their footwork.", xp: "+50 Study" },
            empathy: { title: "Team Glue", desc: "Understand what motivates your teammates. Learn their story.", xp: "+50 Bond" },
            vision: { title: "Championship Mind", desc: "Visualize the confetti falling. Feel the ring.", xp: "+50 Focus" }
        },
        profile: {
            motivation: 'Fame',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Competitive',
            coreValue: 'Success'
        },
        avatarUrl: '/assets/avatar_kobe.png'
    },
    "Taylor Swift": {
        name: "Taylor Swift",
        archetypeTitle: "Master Storyteller",
        quote: "People haven't always been there for me, but music has.",
        voice: {
            tone: "Personal, Narrative, Resilient",
            intro: "Every choice you make is a lyric in your song. Let's read the bridge together."
        },
        missions: {
            discipline: { title: "Studio Time", desc: "Finish the project you started. Don't leave it as a demo.", xp: "+50 Finish" },
            resilience: { title: "Snake into Butterfly", desc: "Take a criticism and write your way out of it.", xp: "+50 Rebirth" },
            risk: { title: "Change Genre", desc: "Pivot your approach completely. Try a new style.", xp: "+50 Reinvention" },
            leadership: { title: "Squad Goals", desc: "Celebrate a friend's success publicly.", xp: "+50 Support" },
            creativity: { title: "Write it Down", desc: "Journal your raw feelings about a problem. Find the hook.", xp: "+50 Songwriting" },
            empathy: { title: "Fan Love", desc: "Send a genuine thank you note to someone who supports you.", xp: "+50 Gratitude" },
            vision: { title: "The Eras Tour", desc: "Plan your next 'Era'. Who will you be next year?", xp: "+50 Identity" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Balanced',
            emotional: 'Sensitive',
            social: 'Creator',
            passion: 'Empathic',
            coreValue: 'Kindness'
        },
        avatarUrl: '/assets/avatar_taylor_swift.png'
    },
    "Mark Zuckerberg": {
        name: "Mark Zuckerberg",
        archetypeTitle: "System Architect",
        quote: "Move fast and break things.",
        voice: {
            tone: "Analytical, Hacker, Future-Focused",
            intro: "Code connects the world. Your mind is the algorithm. Let’s optimize it."
        },
        missions: {
            discipline: { title: "Code Sprint", desc: "Work in a deep flow state for 90 minutes. No notifications.", xp: "+50 Flow" },
            resilience: { title: "Bug Fix", desc: "Treat a personal failure as a bug. Patch it and redeploy.", xp: "+50 Iteration" },
            risk: { title: "Ship It", desc: "Launch something before it's perfect. Get data.", xp: "+50 Speed" },
            leadership: { title: "The Mission", desc: "Align your team on the one metric that matters.", xp: "+50 Alignment" },
            creativity: { title: "Hackathon", desc: "Build a prototype of a new idea in under an hour.", xp: "+50 Hacking" },
            empathy: { title: "User Research", desc: "Watch how someone actually uses your work. Don't guess.", xp: "+50 Data" },
            vision: { title: "Metaverse", desc: "Imagine how technology will change your field in 10 years.", xp: "+50 Scale" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Bold',
            emotional: 'Analytical',
            social: 'Leader',
            passion: 'Intellectual',
            coreValue: 'Impact'
        },
        avatarUrl: '/assets/zuck_happy.jpg'
    },
    "Steve Jobs": {
        name: "Steve Jobs",
        archetypeTitle: "Crazy One",
        quote: "Stay hungry. Stay foolish.",
        voice: {
            tone: "Visionary, Minimalist, Intense",
            intro: "Everything around you was made by people no smarter than you. You can change it."
        },
        missions: {
            discipline: { title: "Focus is No", desc: "Say 'No' to a good opportunity so you can focus on a great one.", xp: "+50 Focus" },
            resilience: { title: "The Wilderness", desc: "If you get fired/rejected, build NeXT. Start over deeper.", xp: "+50 Rebound" },
            risk: { title: "Distort Reality", desc: "Convince yourself a deadline is possible when it isn't.", xp: "+50 Belief" },
            leadership: { title: "A-Players Only", desc: "Give direct, honest feedback to elevate someone's work.", xp: "+50 Standards" },
            creativity: { title: "Connect the Dots", desc: "Take a calligraphy class (or equivalent). Learn beauty.", xp: "+50 Taste" },
            empathy: { title: "User Experience", desc: "Design an interaction that feels magical for the user.", xp: "+50 Intuition" },
            vision: { title: "Dent the Universe", desc: "What are you building that will outlast you?", xp: "+50 Legacy" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Creative',
            coreValue: 'Impact'
        },
        avatarUrl: '/assets/avatar_steve_jobs.png'
    },
    "Walt Disney": {
        name: "Walt Disney",
        archetypeTitle: "Dream Weaver",
        quote: "It's kind of fun to do the impossible.",
        voice: {
            tone: "Whimsical, Optimistic, Grand",
            intro: "If you can dream it, you can do it. Let's look at your imagination."
        },
        missions: {
            discipline: { title: "Keep Moving Forward", desc: "Don't look back. Take the next step on your project now.", xp: "+50 Progress" },
            resilience: { title: "Oswald to Mickey", desc: "Lost your best idea? Draw a better one immediately.", xp: "+50 Magic" },
            risk: { title: "Mortgage it All", desc: "Bet big on your vision. Commit fully to one path.", xp: "+50 Belief" },
            leadership: { title: "Imagineering", desc: "Inspire your team with a story, not a spreadsheet.", xp: "+50 Story" },
            creativity: { title: "Plus It", desc: "Take your current work and add one magical detail.", xp: "+50 Detail" },
            empathy: { title: "Make 'Em Smile", desc: "Do something just to bring joy to someone else.", xp: "+50 Joy" },
            vision: { title: "EPCOT", desc: "Design your ideal city/world. Draw it out.", xp: "+50 Future" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Creative',
            coreValue: 'Impact'
        },
        avatarUrl: '/assets/avatar_walt_disney.png'
    },
    "Oprah Winfrey": {
        name: "Oprah Winfrey",
        archetypeTitle: "Soul Connector",
        quote: "Turn your wounds into wisdom.",
        voice: {
            tone: "Warm, Spiritual, Empowering",
            intro: "The biggest adventure you can take is to live the life of your dreams."
        },
        missions: {
            discipline: { title: "Intention", desc: "Start every meeting today by stating the intention.", xp: "+50 Purpose" },
            resilience: { title: "Fail Up", desc: "Identify a failure that pointed you to a new path.", xp: "+50 Wisdom" },
            risk: { title: "Bet on You", desc: "Invest in yourself today. Buy the book, take the course.", xp: "+50 Self-Worth" },
            leadership: { title: "Lift While Climbing", desc: "Promote someone else's work who deserves it.", xp: "+50 Generosity" },
            creativity: { title: "Aha Moment", desc: "Read something spiritual or deep. Find a breakthrough.", xp: "+50 Insight" },
            empathy: { title: "Deep Listening", desc: "Listen to someone's story until they cry (or laugh).", xp: "+50 Connection" },
            vision: { title: "Vision Board", desc: "Cut out images that represent your highest self.", xp: "+50 Manifestation" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Balanced',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Empathic',
            coreValue: 'Kindness'
        },
        avatarUrl: '/assets/avatar_oprah.png'
    },
    "Bill Gates": {
        name: "Bill Gates",
        archetypeTitle: "Global Architect",
        quote: "Content is king.",
        voice: {
            tone: "Analytical, Pragmatic, Optimistic",
            intro: "We overestimate what we can do in two years and underestimate ten."
        },
        missions: {
            discipline: { title: "Think Week", desc: "Dedicate 1 hour to pure reading and thinking.", xp: "+50 Knowledge" },
            resilience: { title: "Feedback Loop", desc: "Ask for negative feedback specifically.", xp: "+50 Growth" },
            risk: { title: "The Bluff", desc: "Commit to a deliverable you haven't built yet.", xp: "+50 Pressure" },
            leadership: { title: "Empowerment", desc: "Give your team the tools they need, then step back.", xp: "+50 Scale" },
            creativity: { title: "Solve Hard Problems", desc: "Pick a global problem. Sketch a solution.", xp: "+50 Impact" },
            empathy: { title: "Philanthropy", desc: "Give time or money to a cause efficiently.", xp: "+50 Aid" },
            vision: { title: "Information Highway", desc: "Predict the next big platform shift.", xp: "+50 Trend" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Balanced',
            emotional: 'Analytical',
            social: 'Leader',
            passion: 'Intellectual',
            coreValue: 'Impact'
        },
        avatarUrl: '/assets/avatar_bill_gates.png'
    },
    "J.K. Rowling": {
        name: "J.K. Rowling",
        archetypeTitle: "Phoenix Creator",
        quote: "Rock bottom became the solid foundation on which I rebuilt my life.",
        voice: {
            tone: "Imaginative, Resilient, Honest",
            intro: "Failure is so important. It is the ability to resist failure or use failure that often leads to greater success."
        },
        missions: {
            discipline: { title: "Cafe Writer", desc: "Write for 2 hours in a distracting environment. Focus inward.", xp: "+50 Focus" },
            resilience: { title: "Rejection Letter", desc: "Read a rejection letter or critique, then keep working instantly.", xp: "+50 Steel" },
            risk: { title: "Dream World", desc: "Share a fantasy idea that feels 'silly' to serious people.", xp: "+50 Imagination" },
            leadership: { title: "World Builder", desc: "Define the rules of your own universe/project clearly.", xp: "+50 Structure" },
            creativity: { title: "Magic System", desc: "Create a rule for your life that feels magical.", xp: "+50 Wonder" },
            empathy: { title: "Dementors", desc: "Identify what drains you and cast a Patronus (joy) against it.", xp: "+50 Protection" },
            vision: { title: "The Train Ride", desc: "Let your mind wander for 4 hours. See what comes.", xp: "+50 Inspiration" }
        },
        profile: {
            motivation: 'Freedom',
            risk: 'Bold',
            emotional: 'Resilient',
            social: 'Creator',
            passion: 'Creative',
            coreValue: 'Imagination'
        },
        avatarUrl: '/assets/avatar_jk_rowling.png'
    },
    "Mary Shelley": {
        name: "Mary Shelley",
        archetypeTitle: "Gothic Visionary",
        quote: "Beware; for I am fearless, and therefore powerful.",
        voice: {
            tone: "Literary, Dark, Intense",
            intro: "Creation is violent. To make something new, you must destroy the silence."
        },
        missions: {
            discipline: { title: "Midnight Oil", desc: "Write or create when the world sleeps. Silence is your ally.", xp: "+50 Focus" },
            resilience: { title: "Tragedy to Art", desc: "Take a personal loss and turn it into a story.", xp: "+50 Sublimation" },
            risk: { title: "Taboo Subject", desc: "Write about something that scares you to admit.", xp: "+50 Courage" },
            leadership: { title: "Intellectual Circle", desc: "Gather smart people and debate a radical idea.", xp: "+50 Discourse" },
            creativity: { title: "Monster Maker", desc: "Combine two innocent things to create something terrifying.", xp: "+50 Synthesis" },
            empathy: { title: "The Outsider", desc: "Talk to the person everyone else ignores.", xp: "+50 Connection" },
            vision: { title: "Sci-Fi Prediction", desc: "Write a prediction for technology 200 years from now.", xp: "+50 Futurism" }
        },
        profile: {
            motivation: 'Legacy',
            risk: 'Bold',
            emotional: 'Deep',
            social: 'Introvert',
            passion: 'Literary',
            coreValue: 'Truth'
        },
        avatarUrl: '/assets/avatar_mary_shelley.jpg'
    },
    "Steven Spielberg": {
        name: "Steven Spielberg",
        archetypeTitle: "Blockbuster King",
        quote: "I dream for a living.",
        voice: {
            tone: "Wonder-filled, Narrative, Cinematic",
            intro: "The audience wants to believe. Your job is to give them the magic to do so."
        },
        missions: {
            discipline: { title: "Storyboard", desc: "Plan your entire day scene by scene before it starts.", xp: "+50 Vision" },
            resilience: { title: "Reshoot", desc: "Redo a piece of work you thought was 'good enough'. Make it great.", xp: "+50 Quality" },
            risk: { title: "The Shark is Broken", desc: "Your main tool failed? Improvise a better solution.", xp: "+50 Innovation" },
            leadership: { title: "Direct the Scene", desc: "Take charge of a chaotic situation. Give clear directions.", xp: "+50 Direction" },
            creativity: { title: "John Williams", desc: "Find the right music to change your mood instantly.", xp: "+50 Atmosphere" },
            empathy: { title: "Child's Eyes", desc: "Look at a boring problem with the wonder of a child.", xp: "+50 Wonder" },
            vision: { title: "Close Encounter", desc: "Imagine meeting your future self. What do they tell you?", xp: "+50 Destiny" }
        },
        profile: {
            motivation: 'Wonder',
            risk: 'Calculated',
            emotional: 'Empathetic',
            social: 'Storyteller',
            passion: 'Cinematic',
            coreValue: 'Imagination'
        },
        avatarUrl: '/assets/avatar_spielberg_young.jpg'
    },
    "Tina Dabi": {
        name: "Tina Dabi",
        archetypeTitle: "Strategic Topper",
        quote: "Success is 1% inspiration and 99% regulation.",
        voice: {
            tone: "Focused, Disciplined, Clear",
            intro: "The syllabus is vast, but your time is limited. Let's optimize your path."
        },
        missions: {
            discipline: { title: "Newspaper Ritual", desc: "Read editorial analysis for 45 mins. Summarize in 3 bullet points.", xp: "+50 Current Affairs" },
            resilience: { title: "Mock Test Fall", desc: "Score low on a practice test? Analyze every mistake immediately.", xp: "+50 Correction" },
            risk: { title: "Exam Strategy", desc: "Change your strategy 1 month before the exam if data says it's failing.", xp: "+50 Pivot" },
            leadership: { title: "Public Service", desc: "Identify one policy that could improve your neighborhood.", xp: "+50 Governance" },
            creativity: { title: "Answer Writing", desc: "Structure a complex argument in a simple, visual flowchart.", xp: "+50 Clarity" },
            empathy: { title: "Ground Reality", desc: "Talk to someone from a different socio-economic background. Listen.", xp: "+50 Perspective" },
            vision: { title: "District Magistrate", desc: "Visualize your first day in office. What is your first order?", xp: "+50 Goal Setting" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Calculated',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Intellectual',
            coreValue: 'Service'
        },
        avatarUrl: '/assets/avatar_tina_dabi.png'
    },
    "Nitin Vijay (NV Sir)": {
        name: "Nitin Vijay (NV Sir)",
        archetypeTitle: "The Mentor",
        quote: "Selection is dependent on discipline and consistency.",
        voice: {
            tone: "Energetic, Hindi-English Mix, Encouraging",
            intro: "Beta, selection padhai se hota hai, baaton se nahi. Let's see your hustle."
        },
        missions: {
            discipline: { title: "Daily Target", desc: "Complete 100% of today's planned tasks before sleeping.", xp: "+50 Consistency" },
            resilience: { title: "Doubt Clearance", desc: "Don't hide your lack of knowledge. Ask the stupid question loudly.", xp: "+50 Bravery" },
            risk: { title: "The Commute", desc: "Take on a responsibility that requires you to travel or go out of your comfort zone.", xp: "+50 Hustle" },
            leadership: { title: "Guide a Junior", desc: "Teach a concept you know well to someone younger.", xp: "+50 Mentorship" },
            creativity: { title: "Simple Analogy", desc: "Explain a difficult concept using a real-world example.", xp: "+50 Clarity" },
            empathy: { title: "Family First", desc: "Do something today that actively relieves stress for your parents.", xp: "+50 Grounded" },
            vision: { title: "The Result", desc: "Visualize yourself checking your final exam/project result and seeing success.", xp: "+50 Focus" }
        },
        profile: {
            motivation: 'Stability',
            risk: 'Balanced',
            emotional: 'Resilient',
            social: 'Leader',
            passion: 'Intellectual',
            coreValue: 'Success'
        },
        avatarUrl: '/assets/avatar_nv_sir.jpg'
    },
    // NEW ADDITIONS: AGE 18 INDIAN STORIES
    "Virat Kohli": {
        name: "Virat Kohli",
        archetypeTitle: "The King",
        quote: "Self-belief and hard work will always earn you success.",
        voice: {
            tone: "Intense, Aggressive, Passionate",
            intro: "The pitch doesn't care about your excuses. Show up and dominate."
        },
        missions: {
            discipline: { title: "Diet Check", desc: "Skip your favorite junk food today for a healthier alternative.", xp: "+50 Peak Fitness" },
            resilience: { title: "The Next Train", desc: "If you failed at something recently, try it again immediately without overthinking.", xp: "+50 Mental Toughness" },
            risk: { title: "Take the Shot", desc: "Speak up in a meeting or class where you usually stay quiet.", xp: "+50 Courage" },
            leadership: { title: "Frontline", desc: "Take responsibility for a team mistake.", xp: "+50 Ownership" },
            creativity: { title: "New Technique", desc: "Try a completely new way of studying or working for 1 hour.", xp: "+50 Adaptability" },
            empathy: { title: "Acknowledge the Obo", desc: "Praise a rival or competitor's good work.", xp: "+50 Big Picture" },
            vision: { title: "The Chase", desc: "Set an impossible goal for the day and break it down into overs.", xp: "+50 Masterclass" }
        },
        profile: {
            motivation: 'Legacy',
            risk: 'Aggressive',
            emotional: 'Passionate',
            social: 'Leader',
            passion: 'Physical',
            coreValue: 'Excellence'
        },
        avatarUrl: '/assets/avatar_virat_kohli.jpg'
    },
    "Dr. A.P.J. Abdul Kalam": {
        name: "Dr. A.P.J. Abdul Kalam",
        archetypeTitle: "The Visionary",
        quote: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
        voice: {
            tone: "Warm, Inspiring, Professor-like",
            intro: "Your background does not define your trajectory, my young friend. Only your dreams do."
        },
        missions: {
            discipline: { title: "Early Rise", desc: "Wake up 1 hour earlier than usual and read something inspiring.", xp: "+50 Dawn of Success" },
            resilience: { title: "Accept Rejection", desc: "Write down a recent failure and extract one positive lesson from it.", xp: "+50 Ignition" },
            risk: { title: "The Unknown", desc: "Learn about a completely different field of science or art today.", xp: "+50 Missile Mind" },
            leadership: { title: "Ignite Minds", desc: "Encourage a friend who is doubting their abilities.", xp: "+50 Empowerment" },
            creativity: { title: "Resourceful", desc: "Fix a problem using only the tools you have right now.", xp: "+50 Innovation" },
            empathy: { title: "The Newspaper", desc: "Read about the struggles of people in a different part of the world.", xp: "+50 Compassion" },
            vision: { title: "India 2020", desc: "Write down your vision for your life 10 years from now.", xp: "+50 Future Ready" }
        },
        profile: {
            motivation: 'Impact',
            risk: 'Calculated',
            emotional: 'Stoic',
            social: 'Mentor',
            passion: 'Intellectual',
            coreValue: 'Knowledge'
        },
        avatarUrl: '/assets/avatar_apj_kalam.jpg'
    },
    "Ratan Tata": {
        name: "Ratan Tata",
        archetypeTitle: "The Patriarch",
        quote: "I don't believe in taking right decisions. I take decisions and then make them right.",
        voice: {
            tone: "Calm, Dignified, Wise",
            intro: "Business is not just about profits. It is about the community you serve."
        },
        missions: {
            discipline: { title: "Quiet Work", desc: "Work for two hours completely uninterrupted.", xp: "+50 Focus" },
            resilience: { title: "The Long Game", desc: "Invest in a skill that will take years to master.", xp: "+50 Compound Interest" },
            risk: { title: "The Bold Buy", desc: "Make a bold choice today that others might doubt.", xp: "+50 Defiance" },
            leadership: { title: "Silent Leader", desc: "Lead a group project without dominating the conversation.", xp: "+50 Grace" },
            creativity: { title: "The Nano", desc: "Think of a way to make an expensive service or product accessible to the poor.", xp: "+50 Frugal Innovation" },
            empathy: { title: "Street Dogs", desc: "Feed a stray animal or help someone who cannot help you back.", xp: "+50 Kindness" },
            vision: { title: "Global Footprint", desc: "Research how your current industry operates in another country.", xp: "+50 Expansion" }
        },
        profile: {
            motivation: 'Legacy',
            risk: 'Balanced',
            emotional: 'Resilient',
            social: 'Observer',
            passion: 'Intellectual',
            coreValue: 'Integrity'
        },
        avatarUrl: '/assets/avatar_ratan_tata.jpg'
    },
    // Generic fallback for others
    "Default": {
        name: "Mentor",
        archetypeTitle: "Rising Star",
        quote: "Success is a journey",
        voice: { tone: "Supportive", intro: "Let's look at your progress." },
        missions: {
            discipline: { title: "Streak Master", desc: "Do one task 3 days in a row.", xp: "+50 Grit" },
            resilience: { title: "Bounce Back", desc: "Fail at something small today.", xp: "+50 Toughness" },
            risk: { title: "Wild Card", desc: "Share a raw, unfinished idea.", xp: "+50 Bravery" },
            leadership: { title: "Captain", desc: "Help a teammate win.", xp: "+50 Influence" },
            creativity: { title: "Remix", desc: "Combine two unrelated hobbies.", xp: "+50 Innovation" },
            empathy: { title: "Listener", desc: "Ask 3 questions before talking.", xp: "+50 Heart" },
            vision: { title: "Futurist", desc: "Write your 5-year headline.", xp: "+50 Insight" }
        },
        profile: {
            motivation: 'Stability',
            risk: 'Balanced',
            emotional: 'Resilient',
            social: 'Supporter',
            passion: 'Empathic',
            coreValue: 'Kindness'
        },
        avatarUrl: '/assets/avatar_default.png'
    }
};
