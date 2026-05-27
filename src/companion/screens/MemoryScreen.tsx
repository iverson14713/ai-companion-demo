import { ArrowLeft, Brain, Calendar, Heart, Sparkles, Trash2, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCompanion } from '../context/CompanionContext';
import { COMPANION_PROFILE } from '../mockData';

type Props = {
  onBack: () => void;
};

export function MemoryScreen({ onBack }: Props) {
  const { save, removePreference, removeEvent } = useCompanion();
  const { userNickname, companionCallsUser, preferences, importantEvents } = save;

  const memoryCount = preferences.length + importantEvents.length + (userNickname ? 1 : 0);

  return (
    <div className="page-tab-fade flex min-h-[100dvh] flex-col bg-[#07050f]/95 pb-8">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-violet-500/15 bg-[#0a0614]/90 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-500/25 bg-white/5 text-violet-200"
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-violet-50">記憶卡片</h1>
          <p className="text-[11px] text-violet-400/65">{COMPANION_PROFILE.name} 目前記得的事</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-100">
            <Brain className="h-5 w-5 text-violet-300" />
            共 {memoryCount} 項記憶
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-violet-300/65">
            聊天時會一併送給 AI，讓小雪更懂您。可在設定中編輯稱呼或清除記憶。
          </p>
        </div>

        <MemorySection icon={User} title="你是誰">
          <MemoryRow label="你的暱稱" value={userNickname || '（尚未設定）'} empty={!userNickname} />
          <MemoryRow
            label="小雪怎麼叫你"
            value={companionCallsUser || '（尚未設定）'}
            empty={!companionCallsUser}
          />
        </MemorySection>

        <MemorySection icon={Heart} title="你的喜好">
          {preferences.length === 0 ? (
            <EmptyHint text="聊天時說「我喜歡…」會自動記住" />
          ) : (
            <ul className="space-y-2">
              {preferences.map((p) => (
                <li
                  key={p}
                  className="flex items-center justify-between rounded-xl border border-violet-500/15 bg-white/[0.04] px-3 py-2.5"
                >
                  <span className="text-sm text-violet-100">{p}</span>
                  <button
                    type="button"
                    onClick={() => removePreference(p)}
                    className="rounded-lg p-1.5 text-violet-400/50 hover:bg-rose-500/15 hover:text-rose-300"
                    aria-label={`刪除喜好 ${p}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </MemorySection>

        <MemorySection icon={Calendar} title="重要事件">
          {importantEvents.length === 0 ? (
            <EmptyHint text="說「記得…」或提到生日、紀念日會自動記錄" />
          ) : (
            <ul className="space-y-2">
              {importantEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-violet-500/15 bg-white/[0.04] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm text-violet-100">{e.text}</p>
                    <p className="mt-0.5 text-[10px] text-violet-400/55">{e.date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(e.id)}
                    className="shrink-0 rounded-lg p-1.5 text-violet-400/50 hover:bg-rose-500/15 hover:text-rose-300"
                    aria-label="刪除事件"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </MemorySection>

        <p className="flex items-center justify-center gap-1 text-center text-[10px] text-violet-400/45">
          <Sparkles className="h-3 w-3" />
          資料僅保存在本機瀏覽器
        </p>
      </div>
    </div>
  );
}

function MemorySection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.03]">
      <h2 className="flex items-center gap-2 border-b border-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-100">
        <Icon className="h-4 w-4 text-violet-400" />
        {title}
      </h2>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}

function MemoryRow({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-violet-400/70">{label}</span>
      <span className={`text-sm ${empty ? 'text-violet-500/50' : 'font-medium text-violet-100'}`}>
        {value}
      </span>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-[12px] text-violet-400/55">{text}</p>;
}
