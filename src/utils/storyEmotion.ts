export type StoryEmotion = 
  | 'hope' 
  | 'joy' 
  | 'grief' 
  | 'fear' 
  | 'love' 
  | 'anger' 
  | 'mystery' 
  | 'calm'
  | 'tension'
  | 'triumph'

export interface EmotionTheme {
  emotion: StoryEmotion
  // Background gradient
  bgGradient: string
  // Card/overlay color
  cardColor: string
  // Text highlight color
  accentColor: string
  // Vignette color
  vignetteColor: string
  // Narrator badge color
  narratorColor: string
  // Music mood
  musicMood: string
}

export const EMOTION_THEMES: Record<StoryEmotion, EmotionTheme> = {
  hope: {
    emotion: 'hope',
    bgGradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #f59e0b22 100%)',
    cardColor: 'rgba(245, 158, 11, 0.08)',
    accentColor: '#f59e0b',
    vignetteColor: 'rgba(245, 158, 11, 0.15)',
    narratorColor: '#fbbf24',
    musicMood: 'hopeful'
  },
  joy: {
    emotion: 'joy',
    bgGradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #06b6d422 100%)',
    cardColor: 'rgba(6, 182, 212, 0.08)',
    accentColor: '#06b6d4',
    vignetteColor: 'rgba(6, 182, 212, 0.15)',
    narratorColor: '#22d3ee',
    musicMood: 'joyful'
  },
  grief: {
    emotion: 'grief',
    bgGradient: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #1e1b4b22 100%)',
    cardColor: 'rgba(30, 27, 75, 0.15)',
    accentColor: '#6366f1',
    vignetteColor: 'rgba(15, 10, 30, 0.6)',
    narratorColor: '#818cf8',
    musicMood: 'grief'
  },
  fear: {
    emotion: 'fear',
    bgGradient: 'linear-gradient(180deg, #0a0000 0%, #1a0000 50%, #7f1d1d22 100%)',
    cardColor: 'rgba(127, 29, 29, 0.1)',
    accentColor: '#ef4444',
    vignetteColor: 'rgba(127, 29, 29, 0.3)',
    narratorColor: '#f87171',
    musicMood: 'tense'
  },
  love: {
    emotion: 'love',
    bgGradient: 'linear-gradient(180deg, #0f0a0f 0%, #1a0f1a 50%, #be185d22 100%)',
    cardColor: 'rgba(190, 24, 93, 0.08)',
    accentColor: '#ec4899',
    vignetteColor: 'rgba(190, 24, 93, 0.15)',
    narratorColor: '#f472b6',
    musicMood: 'romantic'
  },
  anger: {
    emotion: 'anger',
    bgGradient: 'linear-gradient(180deg, #0a0000 0%, #150000 50%, #991b1b33 100%)',
    cardColor: 'rgba(153, 27, 27, 0.12)',
    accentColor: '#dc2626',
    vignetteColor: 'rgba(153, 27, 27, 0.4)',
    narratorColor: '#fca5a5',
    musicMood: 'intense'
  },
  mystery: {
    emotion: 'mystery',
    bgGradient: 'linear-gradient(180deg, #050510 0%, #0a0520 50%, #4c1d9533 100%)',
    cardColor: 'rgba(76, 29, 149, 0.1)',
    accentColor: '#8b5cf6',
    vignetteColor: 'rgba(76, 29, 149, 0.25)',
    narratorColor: '#a78bfa',
    musicMood: 'mysterious'
  },
  calm: {
    emotion: 'calm',
    bgGradient: 'linear-gradient(180deg, #071014 0%, #0d1f1a 50%, #06553322 100%)',
    cardColor: 'rgba(6, 85, 51, 0.08)',
    accentColor: '#10b981',
    vignetteColor: 'rgba(6, 85, 51, 0.15)',
    narratorColor: '#34d399',
    musicMood: 'calm'
  },
  tension: {
    emotion: 'tension',
    bgGradient: 'linear-gradient(180deg, #050505 0%, #0f0800 50%, #78350f33 100%)',
    cardColor: 'rgba(120, 53, 15, 0.1)',
    accentColor: '#f97316',
    vignetteColor: 'rgba(120, 53, 15, 0.3)',
    narratorColor: '#fb923c',
    musicMood: 'tense'
  },
  triumph: {
    emotion: 'triumph',
    bgGradient: 'linear-gradient(180deg, #050a00 0%, #0f1500 50%, #365314aa 100%)',
    cardColor: 'rgba(54, 83, 20, 0.1)',
    accentColor: '#84cc16',
    vignetteColor: 'rgba(54, 83, 20, 0.2)',
    narratorColor: '#bef264',
    musicMood: 'triumphant'
  }
}

// Detect emotion from story text using keywords
export const detectEmotion = (text: string): StoryEmotion => {
  const t = text.toLowerCase()
  
  if (/died|death|funeral|lost|grief|tears|mourn|passed away|tragedy/.test(t)) 
    return 'grief'
  if (/won|champion|victory|success|achieved|breakthrough|finally|celebrated/.test(t)) 
    return 'triumph'
  if (/love|heart|relationship|marriage|girlfriend|boyfriend|together/.test(t)) 
    return 'love'
  if (/afraid|fear|scared|terrified|nervous|anxiety|danger|threat/.test(t)) 
    return 'fear'
  if (/angry|rage|furious|unfair|injustice|fight|rebel|refused/.test(t)) 
    return 'anger'
  if (/dream|hope|future|opportunity|chance|beginning|start|believe/.test(t)) 
    return 'hope'
  if (/happy|joy|laugh|celebrate|excited|amazing|incredible|wonderful/.test(t)) 
    return 'joy'
  if (/secret|unknown|mystery|strange|curious|discover|hidden|question/.test(t)) 
    return 'mystery'
  if (/pressure|deadline|decide|choice|stakes|critical|must|now/.test(t)) 
    return 'tension'
  
  return 'calm' // default
}
