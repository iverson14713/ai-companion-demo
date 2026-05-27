import { AlertCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompanionChatError, sendCompanionChat, toApiMessages } from '../api/chat';
import { COMPANION_PROFILE, MOCK_CHAT } from '../mockData';

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

export function ChatScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [...MOCK_CHAT]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLLIElement>(null);

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

    try {
      const apiMessages = toApiMessages(nextMessages);
      const reply = await sendCompanionChat(apiMessages);
      setMessages((prev) => [
        ...prev,
        {
          id: newId('c'),
          from: 'companion',
          text: reply,
          time: formatTime(),
        },
      ]);
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
  }, [draft, loading, messages]);

  const canSend = draft.trim().length > 0 && !loading;

  return (
    <div className="page-tab-fade flex h-full min-h-0 flex-col pb-28">
      <header className="border-b border-violet-500/15 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg">
            ✦
          </div>
          <div>
            <h1 className="text-base font-bold text-violet-50">{COMPANION_PROFILE.name}</h1>
            <p className="flex items-center gap-1 text-[11px] text-emerald-300/90">
              <span
                className={`h-1.5 w-1.5 rounded-full ${loading ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`}
              />
              {loading ? '小雪正在輸入…' : '線上'}
            </p>
          </div>
        </div>
      </header>

      <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                m.from === 'user'
                  ? 'rounded-br-md bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white'
                  : 'rounded-bl-md border border-violet-500/20 bg-white/[0.06] text-violet-100'
              }`}
            >
              {m.text}
              <span
                className={`mt-1 block text-[10px] ${
                  m.from === 'user' ? 'text-white/65' : 'text-violet-400/70'
                }`}
              >
                {m.time}
              </span>
            </div>
          </li>
        ))}

        {loading ? (
          <li className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-violet-500/20 bg-white/[0.06] px-3.5 py-2.5 text-sm text-violet-300/80">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" aria-hidden />
              小雪正在想怎麼回你…
            </div>
          </li>
        ) : null}

        <li ref={listEndRef} className="h-px" aria-hidden />
      </ul>

      {error ? (
        <div
          className="mx-3 mb-2 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[13px] text-rose-100"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden />
          <p className="flex-1 leading-snug">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-lg p-0.5 text-rose-200/80 hover:bg-rose-500/20"
            aria-label="關閉錯誤訊息"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="border-t border-violet-500/15 bg-[#0a0614]/90 px-3 py-3 backdrop-blur-md">
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
              placeholder={loading ? '等待小雪回覆…' : '輸入訊息…'}
              disabled={loading}
              className="w-full rounded-2xl border border-violet-500/25 bg-white/[0.06] px-4 py-3 pr-10 text-sm text-violet-50 placeholder:text-violet-400/45 outline-none focus:border-violet-400/50 disabled:opacity-50"
            />
            <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/40" />
          </div>
          <button
            type="button"
            onClick={() => void send()}
            disabled={!canSend}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition disabled:opacity-40"
            aria-label="傳送"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-violet-400/50">
          由伺服器代叫 OpenAI · 保留最近 10 則對話
        </p>
      </div>
    </div>
  );
}
