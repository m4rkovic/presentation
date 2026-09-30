export const eventConfig = {
  slug: 'arena-tehnologij-2026',
  campaignTitle: 'ASCALab @ Arena Tehnologij',
  eventName: 'Arena Tehnologij',
  heroTagline: 'Technology built around business',
  heroStatement: 'Clear thinking. Better software. Less corporate fog.',
  studentIntro:
    'Meet the team, explore student career paths and test your tech instincts in a fast-paced quiz built for the fair.',
  careers: ['Backend', 'Frontend', 'Embedded / Firmware', 'DevOps', 'QA', 'Data / AI'],
  quiz: {
    minQuestions: 5,
    maxQuestions: 8,
    defaultTimePerQuestion: 15,
    fastTrackThresholdSeconds: 55,
    kioskResetSeconds: 18,
  },
  prizes: {
    tier1: {
      label: 'Tier 1 contender',
      title: 'Top score + speed',
      description:
        'Perfect accuracy with a fast time. This is a provisional result; ASCALab staff confirms prize eligibility.',
      reward: 'ASCALab premium reward',
    },
    tier2: {
      label: 'Tier 2 unlocked',
      title: '100% accuracy',
      description: 'Perfect accuracy achieved. This is a provisional result; ASCALab staff confirms prize eligibility.',
      reward: 'ASCALab notebook or similar reward',
    },
    tier3: {
      label: 'Tier 3 unlocked',
      title: 'Participation reward',
      description: 'Thanks for taking part. This is a participation result; ASCALab staff confirms any giveaway eligibility.',
      reward: 'Stickers, pens or similar swag',
    },
  },
}
