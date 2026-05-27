import type { CompanionMemoryPayload } from '../storage/types';
import type { CompanionSave } from '../storage/types';

export function saveToMemoryPayload(save: CompanionSave): CompanionMemoryPayload {
  const payload: CompanionMemoryPayload = {};

  if (save.userNickname) payload.userNickname = save.userNickname;
  if (save.companionCallsUser) payload.companionCallsUser = save.companionCallsUser;
  if (save.preferences.length > 0) payload.preferences = [...save.preferences];
  if (save.importantEvents.length > 0) {
    payload.importantEvents = save.importantEvents.map((e) => ({
      text: e.text,
      date: e.date,
    }));
  }

  return payload;
}

export function hasMemoryPayload(payload: CompanionMemoryPayload): boolean {
  return !!(
    payload.userNickname ||
    payload.companionCallsUser ||
    (payload.preferences && payload.preferences.length > 0) ||
    (payload.importantEvents && payload.importantEvents.length > 0)
  );
}
