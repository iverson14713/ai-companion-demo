import { MAX_EVENTS, MAX_PREFERENCES } from '../storage/companionStore';
import type { CompanionSave, ImportantEvent } from '../storage/types';

function newEventId() {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function addPreference(list: string[], item: string): string[] {
  const t = item.trim().replace(/[。！？!?.]+$/g, '');
  if (!t || t.length < 2 || t.length > 40) return list;
  if (list.some((p) => p === t || p.includes(t) || t.includes(p))) return list;
  return [t, ...list].slice(0, MAX_PREFERENCES);
}

function addEvent(list: ImportantEvent[], text: string): ImportantEvent[] {
  const t = text.trim().replace(/[。！？!?.]+$/g, '');
  if (!t || t.length < 4 || t.length > 80) return list;
  if (list.some((e) => e.text === t)) return list;
  const entry: ImportantEvent = {
    id: newEventId(),
    text: t,
    date: new Date().toLocaleDateString('zh-TW'),
  };
  return [entry, ...list].slice(0, MAX_EVENTS);
}

/** 從使用者訊息以規則擷取記憶（MVP，不接 AI） */
export function extractMemoryFromUserMessage(
  text: string,
  prev: CompanionSave
): Partial<Pick<CompanionSave, 'userNickname' | 'preferences' | 'importantEvents'>> {
  const out: Partial<Pick<CompanionSave, 'userNickname' | 'preferences' | 'importantEvents'>> = {};
  const t = text.trim();
  if (!t) return out;

  let preferences = [...prev.preferences];
  let importantEvents = [...prev.importantEvents];
  let userNickname = prev.userNickname;

  const nameMatch =
    t.match(/我(?:叫|名字是|的名字是)([^\s，。！？,!?.]{1,12})/) ??
    t.match(/^我是([^\s，。！？,!?.]{2,12})$/);
  if (nameMatch?.[1] && !prev.userNickname) {
    userNickname = nameMatch[1].trim();
    out.userNickname = userNickname;
  }

  const likeMatch =
    t.match(/我(?:最)?喜歡(?:吃|喝|看|聽|玩)?[：:]?(.{2,36})/) ??
    t.match(/我愛(?:吃|喝|看|聽|玩)?[：:]?(.{2,36})/);
  if (likeMatch?.[1]) {
    preferences = addPreference(preferences, likeMatch[1]);
    out.preferences = preferences;
  }

  const rememberMatch = t.match(/記得[：:]?(.{4,60})/);
  if (rememberMatch?.[1]) {
    importantEvents = addEvent(importantEvents, rememberMatch[1]);
    out.importantEvents = importantEvents;
  }

  const birthdayMatch = t.match(/我(?:的)?生日(?:是)?[：:]?(.{2,30})/);
  if (birthdayMatch?.[1]) {
    importantEvents = addEvent(importantEvents, `生日：${birthdayMatch[1].trim()}`);
    out.importantEvents = importantEvents;
  }

  if (/重要|特別|紀念/.test(t) && t.length >= 8 && t.length <= 60) {
    importantEvents = addEvent(importantEvents, t);
    out.importantEvents = importantEvents;
  }

  return out;
}
