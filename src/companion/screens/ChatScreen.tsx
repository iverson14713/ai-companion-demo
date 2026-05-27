import { AlertCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompanionChatError, sendCompanionChat, toApiMessages } from '../api/chat';
import { CharacterAvatar } from '../CharacterStage';
import { YUKI_PROFILE } from '../character/yukiProfile';
import { useCompanion } from '../context/CompanionContext';
import { extractMemoryFromUserMessage } from '../lib/extractMemory';
import { saveToMemoryPayload } from '../lib/memoryPayload';
import { MOCK_CHAT } from '../mockData';

export type ChatMessage = {
  id: string;
  from: 'user' | 'companion';
  text: string;
  time: string;
};

function formatTime() {
  return new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function greetingName(nickname: string, callsUser: string) {
  if (callsUser) return callsUser;
  if (nickname) return nickname;
  return '你';
}

export function ChatScreen() {
  const { save, applyUserMessageMemory, rewardChatAffection } = useCompanion();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [...MOCK_CHAT]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLLIElement>(null);

  const displayName = save.companionCallsUser || save.userNickname;

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: newId('u'),
      from: 'user',
      text,
      time: formatTime(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft('');
    setError(null);
    setLoading(true);

    const extracted = extractMemoryFromUserMessage(text, save);
    const mergedSave = {
      ...save,
      userNickname: extracted.userNickname ?? save.userNickname,
      preferences: extracted.preferences ?? save.preferences,
      importantEvents: extracted.importantEvents ?? save.importantEvents,
    };
    applyUserMessageMemory(text);

    try {
      const apiMessages = toApiMessages(nextMessages);
      const reply = await sendCompanionChat(apiMessages, saveToMemoryPayload(mergedSave));
      setMessages((prev) => [
        ...prev,
        {
          id: newId('c'),
          from: 'companion',
          text: reply,
          time: formatTime(),
        },
      ]);
      rewardChatAffection();
    } catch (e) {
      const msg =
        e instanceof CompanionChatError
          ? e.message
          : e instanceof Error
            ? e.message
            : '傳送失敗，請稍後再試';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [draft, loading, messages, save, applyUserMessageMemory, rewardChatAffection]);

  const canSend = draft.trim().length > 0 && !loading;

  return (
    <div className="page-tab-fade companion-chat flex h-full min-h-0 flex-col pb-28">
      <header className="companion-chat-header relative z-10 px-4 py-3">
        <div className="flex items-center gap-3">
          <CharacterAvatar size={48} />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-violet-50">{YUKI_PROFILE.name}</h1>
            <p className="flex items-center gap-1.5 text-[11px] text-violet-300/75">
              <span
                className={`h-1.5 w-1.5 rounded-full ${loading ? 'animate-pulse bg-amber-300' : 'bg-emerald-400/90'}`}
              />
              {loading
                ? '正在輸入…'
                : displayName
                  ? `陪著${greetingName(save.userNickname, save.companionCallsUser)}`
                  : '深夜線上'}
            </p>
          </div>
          <span className="companion-glass rounded-full px-2.5 py-1 text-[10px] text-violet-300/70">
            🌙 夜晚
          </span>
        </div>
      </header>

      <ul className="companion-chat-messages flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {m.from === 'companion' ? <CharacterAvatar size={32} /> : null}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 text-[14px] leading-relaxed ${
                m.from === 'user' ? 'companion-bubble-user' : 'companion-bubble-yuki'
              }`}
            >
              {m.text}
              <span
                className={`mt-1 block text-[10px] ${
                  m.from === 'user' ? 'text-white/60' : 'text-violet-400/65'
                }`}
              >
                {m.time}
              </span>
            </div>
          </li>
        ))}

        {loading ? (
          <li className="flex gap-2">
            <CharacterAvatar size={32} />
            <div className="companion-bubble-yuki flex items-center gap-2 px-3.5 py-2.5 text-sm text-violet-300/85">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" aria-hidden />
              小雪正在想怎麼回你…
            </div>
          </li>
        ) : null}

        <li ref={listEndRef} className="h-px" aria-hidden />
      </ul>

      {error ? (
        <div className="companion-error-banner mx-3 mb-2" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="flex-1 leading-snug">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-lg p-0.5 opacity-80 hover:opacity-100"
            aria-label="關閉錯誤訊息"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="companion-chat-composer px-3 py-3">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={loading ? '等待小雪回覆…' : '想對小雪說的話…'}
              disabled={loading}
              className="companion-chat-input w-full px-4 py-3 pr-10 text-sm outline-none disabled:opacity-50"
            />
            <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/35" />
          </div>
          <button
            type="button"
            onClick={() => void send()}
            disabled={!canSend}
            className="companion-send-btn flex h-11 w-11 shrink-0 items-center justify-center disabled:opacity-40"
            aria-label="傳送"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-violet-400/45">
          小雪 · 角色記憶 + 最近 10 則
        </p>
      </div>
    </div>
  );
}
