import { Bell, Brain, Gift, MessageCircle, Moon, Shirt, Sparkles } from 'lucide-react';
import { CharacterStage } from '../CharacterStage';
import { AffectionCard } from '../components/AffectionCard';
import { GlassCard } from '../components/GlassCard';
import { YUKI_PROFILE } from '../character/yukiProfile';
import { useCompanion } from '../context/CompanionContext';
import { affectionToLevel } from '../storage/companionStore';
import type { CompanionTabId } from '../theme';

type Props = {
  outfit: string;
  onNavigate: (tab: CompanionTabId) => void;
  onOpenPanel: (panel: 'gift' | 'outfit') => void;
  onOpenMemory: () => void;
};

export function HomeScreen({ outfit, onNavigate, onOpenPanel, onOpenMemory }: Props) {
  const { save, affection } = useCompanion();
  const { name, title, mood, moodEmoji, tagline } = {
    name: YUKI_PROFILE.name,
    title: YUKI_PROFILE.title,
    mood: YUKI_PROFILE.mood,
    moodEmoji: YUKI_PROFILE.moodEmoji,
    tagline: YUKI_PROFILE.tagline,
  };
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
    <div className="page-tab-fade flex flex-col pb-28">
      {/* 主視覺區 */}
      <section className="relative">
        <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-4 pt-2">
          <div className="companion-glass rounded-2xl px-3 py-2 backdrop-blur-md">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-300/70">
              Night Companion
            </p>
            <h1 className="text-lg font-bold text-violet-50">
              {name}
              <span className="ml-1.5 text-xs font-semibold text-violet-300/75">Lv.{level}</span>
            </h1>
            <p className="text-[10px] text-violet-300/55">{title}</p>
          </div>
          <button
            type="button"
            className="companion-glass flex h-10 w-10 items-center justify-center rounded-2xl text-violet-200 transition hover:bg-white/10"
            aria-label="通知"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <CharacterStage outfit={outfit} variant="hero" />

        <div className="relative z-10 -mt-8 px-4">
          <AffectionCard affection={affection} />
        </div>
      </section>

      <div className="mt-3 flex flex-col gap-3 px-4">
        <div className="grid grid-cols-2 gap-2.5">
          <GlassCard className="p-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300/65">
              <Moon className="h-3 w-3" />
              今夜心情
            </span>
            <span className="mt-1 block text-base font-bold text-violet-50">
              {mood} {moodEmoji}
            </span>
          </GlassCard>
          <GlassCard className="flex flex-col justify-center p-3">
            <p className="text-[11px] leading-relaxed text-violet-200/80">
              &ldquo;{personalizedTagline}&rdquo;
            </p>
          </GlassCard>
        </div>

        <section>
          <h2 className="mb-2.5 flex items-center gap-1.5 px-0.5 text-sm font-semibold text-violet-100">
            <Sparkles className="h-4 w-4 text-violet-300" />
            快捷互動
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction
              icon={MessageCircle}
              label="聊天"
              sub="小雪在等你"
              onClick={() => onNavigate('chat')}
            />
            <QuickAction icon={Gift} label="禮物" sub="送心意" onClick={() => onOpenPanel('gift')} />
            <QuickAction
              icon={Brain}
              label="記憶"
              sub={memoryCount > 0 ? `${memoryCount} 項記得` : '看看記住什麼'}
              onClick={onOpenMemory}
            />
            <QuickAction icon={Shirt} label="換裝" sub={outfit} onClick={() => onOpenPanel('outfit')} />
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  sub,
  onClick,
}: {
  icon: typeof MessageCircle;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="companion-action-tile text-left">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-violet-100 ring-1 ring-white/10">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-violet-50">{label}</span>
        <span className="block text-[11px] text-violet-300/55">{sub}</span>
      </span>
    </button>
  );
}
