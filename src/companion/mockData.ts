import { YUKI_PROFILE, YUKI_SPEECH_SAMPLES } from './character/yukiProfile';

export const COMPANION_PROFILE = {
  name: YUKI_PROFILE.name,
  title: YUKI_PROFILE.title,
  level: 12,
  affection: 78,
  mood: YUKI_PROFILE.mood,
  moodEmoji: YUKI_PROFILE.moodEmoji,
  outfit: YUKI_PROFILE.outfitDefault,
  tagline: YUKI_PROFILE.tagline,
} as const;

export const MOCK_TASKS = [
  { id: '1', title: '和小雪聊 5 分鐘', reward: '+5 好感', done: true },
  { id: '2', title: '送一份小禮物', reward: '+8 好感', done: false },
  { id: '3', title: '完成今日心情打卡', reward: '+3 好感', done: false },
  { id: '4', title: '解鎖一則回憶', reward: '回憶碎片 ×1', done: false },
] as const;

export const MOCK_CHAT = [
  {
    id: 'm1',
    from: 'companion' as const,
    text: '你回來啦…窗邊的夜色很美，但更想聽你說說今天。',
    time: '21:12',
  },
  { id: 'm2', from: 'user' as const, text: '還行，就是有點累。', time: '21:14' },
  {
    id: 'm3',
    from: 'companion' as const,
    text: YUKI_SPEECH_SAMPLES[0],
    time: '21:14',
  },
];

export const MOCK_MEMORIES = [
  { id: 'r1', title: '第一次深夜聊天', date: '2026/03/14' },
  { id: 'r2', title: '窗邊的約定', date: '2026/04/02' },
];
