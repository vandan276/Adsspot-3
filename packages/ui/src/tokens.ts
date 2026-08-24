/**
 * Adsspot Design System Tokens
 * Strict color palette, typography definitions, shadows, and radii
 */

export const colors = {
  // Brand Core
  spotBlue: '#4787F2',
  spotBlueHover: '#3373E0',
  spotBlueDark: '#1D53B8',
  spotBlueLight: '#EDF4FF',
  spotBlueSubtle: '#F4F8FF',

  // Accent & Actions
  festivalYellow: '#F2B604',
  festivalYellowHover: '#DEA400',
  festivalYellowLight: '#FFF8E6',

  trustGreen: '#35AB4E',
  trustGreenHover: '#2A9641',
  trustGreenLight: '#EBF9EE',

  deepCrimson: '#981837',
  deepCrimsonHover: '#82102C',
  deepCrimsonLight: '#FBECEF',

  // Neutrals & Ink
  ink: '#17181C',
  inkSecondary: '#4A5260',
  inkMuted: '#687182',
  inkLight: '#9AA4B2',
  inkSubtle: '#CDD5DF',

  // Canvas & Surfaces
  canvas: '#F4F6FB',
  card: '#FFFFFF',
  cardSubtle: '#FAFAFD',
  border: '#E3E8EF',
  borderLight: '#EEF2F6',

  // Overlays
  overlayDark: 'rgba(23, 24, 28, 0.65)',
  overlayLight: 'rgba(255, 255, 255, 0.85)',
} as const;

export const gradients = {
  // Signature Spot Ring Conic Gradient
  spotRingConic: 'conic-gradient(from 0deg, #4787F2, #35AB4E, #F2B604, #981837, #4787F2)',
  spotRingLinear: 'linear-gradient(135deg, #4787F2 0%, #35AB4E 33%, #F2B604 66%, #981837 100%)',
  spotRingHorizontal: 'linear-gradient(90deg, #4787F2 0%, #35AB4E 33%, #F2B604 66%, #981837 100%)',

  // Brand Gradients
  blueHero: 'linear-gradient(135deg, #4787F2 0%, #1D53B8 100%)',
  festivalGlow: 'linear-gradient(135deg, #F2B604 0%, #E69D00 100%)',
  trustGlow: 'linear-gradient(135deg, #35AB4E 0%, #208736 100%)',
  crimsonGlow: 'linear-gradient(135deg, #981837 0%, #700E24 100%)',
  cardGlass: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.75) 100%)',
} as const;

export const radii = {
  none: '0px',
  sm: '6px',
  md: '10px',
  avatar: '12px', // STRICT: Avatars are rounded squares (12px), never circles
  card: '16px',   // STRICT: Cards are 16px radius
  modal: '20px',
  full: '9999px', // STRICT: Buttons & Pill badges
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
  card: '0 2px 8px -2px rgba(16, 24, 40, 0.06), 0 1px 4px -1px rgba(16, 24, 40, 0.04)',
  cardHover: '0 12px 24px -6px rgba(16, 24, 40, 0.08), 0 4px 8px -2px rgba(16, 24, 40, 0.04)',
  dropdown: '0 10px 30px -4px rgba(16, 24, 40, 0.12), 0 4px 10px -2px rgba(16, 24, 40, 0.06)',
  modal: '0 20px 40px -10px rgba(16, 24, 40, 0.18)',
  spotRingGlow: '0 0 16px rgba(71, 135, 242, 0.25)',
} as const;

export const typography = {
  headingFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bodyFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extraBold: 800,
  },
} as const;
