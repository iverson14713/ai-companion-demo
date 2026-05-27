/** 二次元深色系 — 伴侶 App 設計 token */
export const companionTheme = {
  bg: '#07050f',
  bgElevated: '#120c22',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceHover: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(167, 139, 250, 0.22)',
  text: '#f5f3ff',
  textMuted: '#a8a3c4',
  accent: '#c4b5fd',
  accentPink: '#f9a8d4',
  accentCyan: '#67e8f9',
  glow: 'rgba(167, 139, 250, 0.45)',
} as const;

export type CompanionTabId = 'home' | 'chat' | 'tasks' | 'settings';
