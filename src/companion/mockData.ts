export const COMPANION_PROFILE = {
  name: '小雪',
  title: '你的 AI 伴侶',
  level: 12,
  affection: 78,
  mood: '開心',
  moodEmoji: '✨',
  outfit: '星夜禮服',
  tagline: '你今天辛苦了，我想聽你慢慢說。',
} as const;

export const MOCK_TASKS = [
  { id: '1', title: '和小雪聊 5 分鐘', reward: '+5 好感', done: true },
  { id: '2', title: '送一份小禮物', reward: '+8 好感', done: false },
  { id: '3', title: '完成今日心情打卡', reward: '+3 好感', done: false },
  { id: '4', title: '解鎖一則回憶', reward: '回憶碎片 ×1', done: false },
] as const;

export const MOCK_CHAT = [
  { id: 'm1', from: 'companion' as const, text: '你回來啦～今天過得還好嗎？', time: '09:12' },
  { id: 'm2', from: 'user' as const, text: '還行，就是有點累。', time: '09:14' },
  {
    id: 'm3',
    from: 'companion' as const,
    text: '辛苦了…先歇一下，我在這陪你聊。',
    time: '09:14',
  },
];

export const MOCK_MEMORIES = [
  { id: 'r1', title: '第一次相遇', date: '2026/03/14' },
  { id: 'r2', title: '星空下的約定', date: '2026/04/02' },
];
