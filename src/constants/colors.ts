export interface CageColor {
  fill: string;
  border: string;
  glow: string;
  badge: string;
}

// 10 Distinct Transparent Pastel Colors for Cages (Cyber Dark Theme optimized)
export const CAGE_PALETTE: CageColor[] = [
  {
    fill: 'rgba(6, 182, 212, 0.16)', // Neon Cyan / Turquoise
    border: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    badge: '#22d3ee',
  },
  {
    fill: 'rgba(168, 85, 247, 0.16)', // Vivid Purple / Violet
    border: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    badge: '#c084fc',
  },
  {
    fill: 'rgba(245, 158, 11, 0.16)', // Warm Amber
    border: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    badge: '#fbbf24',
  },
  {
    fill: 'rgba(16, 185, 129, 0.16)', // Emerald Green
    border: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    badge: '#34d399',
  },
  {
    fill: 'rgba(244, 63, 94, 0.16)', // Rose / Coral Red
    border: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
    badge: '#fb7185',
  },
  {
    fill: 'rgba(99, 102, 241, 0.16)', // Indigo
    border: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    badge: '#818cf8',
  },
  {
    fill: 'rgba(249, 115, 22, 0.16)', // Tangerine Orange
    border: '#f97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    badge: '#fb923c',
  },
  {
    fill: 'rgba(132, 204, 22, 0.16)', // Electric Lime
    border: '#84cc16',
    glow: 'rgba(132, 204, 22, 0.4)',
    badge: '#a3e635',
  },
  {
    fill: 'rgba(217, 70, 239, 0.16)', // Fuchsia Magenta
    border: '#d946ef',
    glow: 'rgba(217, 70, 239, 0.4)',
    badge: '#e879f9',
  },
  {
    fill: 'rgba(14, 165, 233, 0.16)', // Sky Blue
    border: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.4)',
    badge: '#38bdf8',
  },
];

export const THEME = {
  bg: '#090d16',          // Deep AMOLED dark space
  bgElevated: '#111726',  // Card and surface background
  surface: '#182032',     // Sub-grid & numpad key background
  surfaceHover: '#232e48',
  border: '#2a3652',      // Grid fine borders
  borderThick: '#00f0ff', // Sub-grid section separation
  
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDim: '#475569',
  
  // Neon Cyber Accents
  neonCyan: '#00f0ff',
  neonPurple: '#d946ef',
  neonGold: '#facc15',
  neonGreen: '#4ade80',
  neonRed: '#f87171',

  // Interactive States
  selectedCell: '#00f0ff',
  selectedCellText: '#000000',
  
  // Luminous Electric Gold Spotlight for Same Number Matching (Ultra High Visibility on All Cages)
  sameNumberCell: 'rgba(250, 204, 21, 0.32)',
  sameNumberBorder: '#facc15',
  sameNumberText: '#fef08a',

  // Cross-Hatching Laser Elimination Track (Shows blocked rows and columns for matching numbers)
  crossHatchTrack: 'rgba(250, 204, 21, 0.09)',

  relatedRowCol: 'rgba(255, 255, 255, 0.04)',
  
  errorCell: '#ef4444',
  errorCellBg: 'rgba(239, 68, 68, 0.25)',
  
  fixedNumber: '#e2e8f0',
  userInputNumber: '#38bdf8',
  pencilNoteText: '#94a3b8',
};
