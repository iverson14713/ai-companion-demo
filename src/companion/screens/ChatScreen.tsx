import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { COMPANION_PROFILE, MOCK_CHAT } from '../mockData';

export function ChatScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(MOCK_CHAT);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        from: 'user' as const,
        text,
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `c-${Date.now()}`,
        from: 'companion' as const,
        text: '（Demo）收到啦～之後會接上真正的 AI 回覆。',
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setDraft('');
  };

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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              線上 · 本地 Demo
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
      </ul>

      <div className="border-t border-violet-500/15 bg-[#0a0614]/90 px-3 py-3 backdrop-blur-md">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="輸入訊息…"
              className="w-full rounded-2xl border border-violet-500/25 bg-white/[0.06] px-4 py-3 pr-10 text-sm text-violet-50 placeholder:text-violet-400/45 outline-none focus:border-violet-400/50"
            />
            <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/40" />
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition disabled:opacity-40"
            aria-label="傳送"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-violet-400/50">尚未連接 OpenAI · 僅本地示意</p>
      </div>
    </div>
  );
}
