export const WHEEL_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#f97316', // orange
  '#22c55e', // green
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#3b82f6', // blue
];

export const TEAM_CONFIG = {
  web: {
    name: 'Team Web',
    gradient: 'from-web-primary to-web-secondary',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
  devops: {
    name: 'Team DevOps',
    gradient: 'from-devops-primary to-devops-secondary',
    primaryColor: '#f97316',
    secondaryColor: '#22c55e',
  },
} as const;

export const NAV_ITEMS = [
  { href: '/play', label: 'Hjul', icon: '🎡' },
  { href: '/participants', label: 'Deltakere', icon: '👥' },
  { href: '/games', label: 'Spill', icon: '🎮' },
  { href: '/results', label: 'Resultater', icon: '🏆' },
] as const;
