import { Bell, Brain, Gift, Heart, MessageCircle, Shirt, Sparkles } from 'lucide-react';
import { CharacterStage } from '../CharacterStage';
import { useCompanion } from '../context/CompanionContext';
import { affectionToLevel } from '../storage/companionStore';
import { COMPANION_PROFILE } from '../mockData';
import type { CompanionTabId } from '../theme';

type Props = {
  outfit: string;
  onNavigate: (tab: CompanionTabId) => void;
  onOpenPanel: (panel: 'gift' | 'outfit') => void;
  onOpenMemory: () => void;
};

export function HomeScreen({ outfit, onNavigate, onOpenPanel, onOpenMemory }: Props) {
  const { save, affection } = useCompanion();
  const { name, title, mood, moodEmoji, tagline } = COMPANION_PROFILE;
  const level = affectionToLevel(affection);
  const memoryCount =
    save.preferences.length +
    save.importantEvents.length +
    (save.userNickname ? 1 : 0) +
    (save.companionCallsUser ? 1 : 0);

  const personalizedTagline = save.userNickname
    ? `${save.userNickname}，${tagline}`
    : tagline;

  return (
    <div className="page-tab-fade flex flex-col gap-4 px-4 pb-28 pt-2">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/80">
            AI Companion
          </p>
          <h1 className="text-xl font-bold text-violet-50">
            {name}
            <span className="ml-2 text-sm font-semibold text-violet-300/80">Lv.{level}</span>
          </h1>
          <p className="text-xs text-violet-300/60">{title}</p>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-500/25 bg-white/5 text-violet-200 transition hover:bg-white/10"
          aria-label="通知"
        >
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <CharacterStage name={name} outfit={outfit} />

      <section className="rounded-3xl border border-violet-500/20 bg-white/[0.04] p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-100">
            <Heart className="h-4 w-4 fill-pink-400/80 text-pink-400" />
            好感度
          </span>
          <span className="text-sm font-bold text-pink-300">{affection}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-violet-950/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400 transition-all duration-700"
            style={{ width: `${affection}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-violet-300/55">多聊聊天，好感會慢慢提升</p>
      </section>

      <section className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300/70">
            今日心情
          </span>
          <span className="text-lg font-bold text-cyan-100">
            {mood} {moodEmoji}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-violet-500/15 bg-white/[0.03] px-3 py-3">
          <p className="text-[11px] leading-relaxed text-violet-200/75">
            &ldquo;{personalizedTagline}&rdquo;
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-violet-100">
          <Sparkles className="h-4 w-4 text-violet-300" />
          快捷互動
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <QuickAction
            icon={MessageCircle}
            label="聊天"
            sub="繼續對話"
            accent="from-violet-600/40 to-fuchsia-600/30"
            onClick={() => onNavigate('chat')}
          />
          <QuickAction
            icon={Gift}
            label="禮物"
            sub="送心意"
            accent="from-pink-600/35 to-rose-600/25"
            onClick={() => onOpenPanel('gift')}
          />
          <QuickAction
            icon={Brain}
            label="記憶"
            sub={memoryCount > 0 ? `${memoryCount} 項記得` : '看看記住什麼'}
            accent="from-indigo-600/35 to-violet-600/25"
            onClick={onOpenMemory}
          />
          <QuickAction
            icon={Shirt}
            label="換裝"
            sub={outfit}
            accent="from-sky-600/30 to-violet-600/25"
            onClick={() => onOpenPanel('outfit')}
          />
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  sub,
  accent,
  onClick,
}: {
  icon: typeof MessageCircle;
  label: string;
  sub: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br ${accent} px-3.5 py-3.5 text-left transition active:scale-[0.98] hover:border-violet-400/30`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/25 text-violet-100">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-violet-50">{label}</span>
        <span className="block text-[11px] text-violet-200/60">{sub}</span>
      </span>
    </button>
  );
}
