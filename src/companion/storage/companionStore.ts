import { safeGetItem, safeParseJson, safeSetItem } from '../../safeStorage';
import type { CompanionSave, ImportantEvent } from './types';

export const STORAGE_KEY = 'ai-companion-demo-save-v1';

export const AFFECTION_MIN = 0;
export const AFFECTION_MAX = 100;
export const DEFAULT_AFFECTION = 78;
export const AFFECTION_PER_CHAT_MIN = 1;
export const AFFECTION_PER_CHAT_MAX = 3;
export const MAX_PREFERENCES = 8;
export const MAX_EVENTS = 10;

export function defaultSave(): CompanionSave {
  return {
    version: 1,
    userNickname: '',
    companionCallsUser: '',
    preferences: [],
    importantEvents: [],
    affection: DEFAULT_AFFECTION,
    updatedAt: new Date().toISOString(),
  };
}

function clampAffection(n: number): number {
  return Math.min(AFFECTION_MAX, Math.max(AFFECTION_MIN, Math.round(n)));
}

export function affectionToLevel(affection: number): number {
  return Math.min(99, Math.floor(affection / 8) + 1);
}

export function loadCompanionSave(): CompanionSave {
  const raw = safeGetItem(STORAGE_KEY);
  if (!raw) return defaultSave();

  const parsed = safeParseJson<Partial<CompanionSave>>(raw, {}, 'companion save');
  if (parsed.version !== 1) return defaultSave();

  return {
    version: 1,
    userNickname: typeof parsed.userNickname === 'string' ? parsed.userNickname.trim() : '',
    companionCallsUser:
      typeof parsed.companionCallsUser === 'string' ? parsed.companionCallsUser.trim() : '',
    preferences: Array.isArray(parsed.preferences)
      ? parsed.preferences.filter((p): p is string => typeof p === 'string' && p.trim()).slice(0, MAX_PREFERENCES)
      : [],
    importantEvents: Array.isArray(parsed.importantEvents)
      ? parsed.importantEvents
          .filter(
            (e): e is ImportantEvent =>
              !!e &&
              typeof e === 'object' &&
              typeof (e as ImportantEvent).id === 'string' &&
              typeof (e as ImportantEvent).text === 'string'
          )
          .slice(0, MAX_EVENTS)
      : [],
    affection: clampAffection(
      typeof parsed.affection === 'number' ? parsed.affection : DEFAULT_AFFECTION
    ),
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
  };
}

export function persistCompanionSave(save: CompanionSave): void {
  safeSetItem(STORAGE_KEY, JSON.stringify(save));
}

export function randomAffectionGain(): number {
  return (
    AFFECTION_PER_CHAT_MIN +
    Math.floor(Math.random() * (AFFECTION_PER_CHAT_MAX - AFFECTION_PER_CHAT_MIN + 1))
  );
}

export function bumpAffection(current: number): number {
  return clampAffection(current + randomAffectionGain());
}
