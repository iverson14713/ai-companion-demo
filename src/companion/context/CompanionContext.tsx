import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { extractMemoryFromUserMessage } from '../lib/extractMemory';
import {
  bumpAffection,
  defaultSave,
  loadCompanionSave,
  persistCompanionSave,
} from '../storage/companionStore';
import type { CompanionSave } from '../storage/types';

type CompanionContextValue = {
  save: CompanionSave;
  affection: number;
  setUserNickname: (name: string) => void;
  setCompanionCallsUser: (name: string) => void;
  clearMemories: () => void;
  applyUserMessageMemory: (text: string) => void;
  rewardChatAffection: () => void;
  addPreference: (text: string) => void;
  removePreference: (text: string) => void;
  removeEvent: (id: string) => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<CompanionSave>(() => loadCompanionSave());

  useEffect(() => {
    persistCompanionSave(save);
  }, [save]);

  const patch = useCallback((fn: (s: CompanionSave) => CompanionSave) => {
    setSave((prev) => {
      const next = fn(prev);
      return { ...next, updatedAt: new Date().toISOString() };
    });
  }, []);

  const setUserNickname = useCallback(
    (name: string) => patch((s) => ({ ...s, userNickname: name.trim() })),
    [patch]
  );

  const setCompanionCallsUser = useCallback(
    (name: string) => patch((s) => ({ ...s, companionCallsUser: name.trim() })),
    [patch]
  );

  const clearMemories = useCallback(() => {
    patch((s) => ({
      ...s,
      preferences: [],
      importantEvents: [],
    }));
  }, [patch]);

  const applyUserMessageMemory = useCallback(
    (text: string) => {
      patch((s) => {
        const extracted = extractMemoryFromUserMessage(text, s);
        if (Object.keys(extracted).length === 0) return s;
        return {
          ...s,
          userNickname: extracted.userNickname ?? s.userNickname,
          preferences: extracted.preferences ?? s.preferences,
          importantEvents: extracted.importantEvents ?? s.importantEvents,
        };
      });
    },
    [patch]
  );

  const rewardChatAffection = useCallback(() => {
    patch((s) => ({ ...s, affection: bumpAffection(s.affection) }));
  }, [patch]);

  const addPreference = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      patch((s) => {
        if (s.preferences.includes(t)) return s;
        return { ...s, preferences: [t, ...s.preferences].slice(0, 8) };
      });
    },
    [patch]
  );

  const removePreference = useCallback(
    (text: string) => {
      patch((s) => ({ ...s, preferences: s.preferences.filter((p) => p !== text) }));
    },
    [patch]
  );

  const removeEvent = useCallback(
    (id: string) => {
      patch((s) => ({ ...s, importantEvents: s.importantEvents.filter((e) => e.id !== id) }));
    },
    [patch]
  );

  const value = useMemo<CompanionContextValue>(
    () => ({
      save,
      affection: save.affection,
      setUserNickname,
      setCompanionCallsUser,
      clearMemories,
      applyUserMessageMemory,
      rewardChatAffection,
      addPreference,
      removePreference,
      removeEvent,
    }),
    [
      save,
      setUserNickname,
      setCompanionCallsUser,
      clearMemories,
      applyUserMessageMemory,
      rewardChatAffection,
      addPreference,
      removePreference,
      removeEvent,
    ]
  );

  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion(): CompanionContextValue {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error('useCompanion must be used within CompanionProvider');
  return ctx;
}

export function useCompanionOptional(): CompanionContextValue | null {
  return useContext(CompanionContext);
}

/** 供測試或重置 */
export function resetCompanionSaveToDefault(): void {
  persistCompanionSave(defaultSave());
}
