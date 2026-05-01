export type StoryEmotion = 'triumph' | 'grief' | 'tension' | 'joy' | 'hope' | 'love' | 'mystery' | 'calm';

export interface EmotionTheme {
  emotion: StoryEmotion;
  cardOverlay: string;
  badgeColor: string;
  badgeGlow: string;
  choiceBorder: string;
  vignette: string;
  cardBorder: string;
}

export const EMOTION_THEMES: Record<StoryEmotion, EmotionTheme> = {
  triumph: {
    emotion: 'triumph',
    cardOverlay: 'rgba(180, 140, 0, 0.18)',
    badgeColor: '#ffd700',
    badgeGlow: '0 0 20px #ffd70088',
    choiceBorder: 'rgba(255, 215, 0, 0.4)',
    vignette: 'rgba(120, 90, 0, 0.25)',
    cardBorder: 'rgba(255, 215, 0, 0.3)',
  },
  grief: {
    emotion: 'grief',
    cardOverlay: 'rgba(60, 0, 20, 0.35)',
    badgeColor: '#ef4444',
    badgeGlow: '0 0 20px #ef444488',
    choiceBorder: 'rgba(239, 68, 68, 0.4)',
    vignette: 'rgba(80, 0, 0, 0.4)',
    cardBorder: 'rgba(239, 68, 68, 0.3)',
  },
  tension: {
    emotion: 'tension',
    cardOverlay: 'rgba(80, 35, 0, 0.25)',
    badgeColor: '#f97316',
    badgeGlow: '0 0 20px #f9731688',
    choiceBorder: 'rgba(249, 115, 22, 0.4)',
    vignette: 'rgba(80, 35, 0, 0.3)',
    cardBorder: 'rgba(249, 115, 22, 0.3)',
  },
  joy: {
    emotion: 'joy',
    cardOverlay: 'rgba(190, 24, 93, 0.15)',
    badgeColor: '#f472b6',
    badgeGlow: '0 0 20px #f472b688',
    choiceBorder: 'rgba(244, 114, 182, 0.4)',
    vignette: 'rgba(120, 20, 60, 0.2)',
    cardBorder: 'rgba(244, 114, 182, 0.3)',
  },
  hope: {
    emotion: 'hope',
    cardOverlay: 'rgba(180, 100, 0, 0.15)',
    badgeColor: '#fbbf24',
    badgeGlow: '0 0 20px #fbbf2488',
    choiceBorder: 'rgba(251, 191, 36, 0.4)',
    vignette: 'rgba(120, 70, 0, 0.2)',
    cardBorder: 'rgba(251, 191, 36, 0.3)',
  },
  love: {
    emotion: 'love',
    cardOverlay: 'rgba(150, 20, 80, 0.15)',
    badgeColor: '#ec4899',
    badgeGlow: '0 0 20px #ec489988',
    choiceBorder: 'rgba(236, 72, 153, 0.4)',
    vignette: 'rgba(120, 15, 60, 0.2)',
    cardBorder: 'rgba(236, 72, 153, 0.3)',
  },
  mystery: {
    emotion: 'mystery',
    cardOverlay: 'rgba(50, 20, 100, 0.2)',
    badgeColor: '#a78bfa',
    badgeGlow: '0 0 20px #a78bfa88',
    choiceBorder: 'rgba(167, 139, 250, 0.4)',
    vignette: 'rgba(40, 10, 80, 0.3)',
    cardBorder: 'rgba(167, 139, 250, 0.3)',
  },
  calm: {
    emotion: 'calm',
    cardOverlay: 'rgba(0, 60, 40, 0.15)',
    badgeColor: '#34d399',
    badgeGlow: '0 0 20px #34d39988',
    choiceBorder: 'rgba(52, 211, 153, 0.4)',
    vignette: 'rgba(0, 50, 30, 0.2)',
    cardBorder: 'rgba(52, 211, 153, 0.3)',
  }
};

export const detectEmotion = (text: string, badgeLabel: string): StoryEmotion => {
  // Step 1: Badge Override
  const badge = badgeLabel.toUpperCase();
  if (badge === 'DISTRACTION') return 'grief';
  if (badge === 'MASTERY') return 'triumph';

  // Step 2: Keyword Scan
  const t = text.toLowerCase();
  
  if (/missed|benched|hungover|failed|lost|regret|consequence|punishment|mistake|sluggish|fired|expelled|rejected/.test(t)) return 'grief';
  if (/legend|champion|won|victory|greatness|achieved|success|breakthrough|finally|celebrated|made it|proved|legendary/.test(t)) return 'triumph';
  if (/practice|gym|workout|grind|sacrifice|pressure|decide|must|deadline|critical|stakes|now or never|choice|risk/.test(t)) return 'tension';
  if (/celebrate|party|club|fun|team bonding|excited|happy|amazing|incredible|laugh|enjoy|win|together|night out/.test(t)) return 'joy';
  if (/dream|future|opportunity|chance|believe|start|beginning|one day|possible|vision|aspire|potential|imagine/.test(t)) return 'hope';
  if (/love|heart|relationship|together|marriage|girlfriend|boyfriend|family|care|support/.test(t)) return 'love';
  if (/secret|unknown|discover|hidden|curious|question|strange|wonder|investigate/.test(t)) return 'mystery';
  if (/rest|quiet|peace|reflect|think|alone|silent|breathe|still|wait/.test(t)) return 'calm';

  // Step 3: Fallback
  return 'tension';
};
