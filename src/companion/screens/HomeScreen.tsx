import { Heart, MessageCircle } from 'lucide-react';
import { CharacterStage } from '../CharacterStage';
import { YUKI_PROFILE } from '../character/yukiProfile';
import { useCompanion } from '../context/CompanionContext';
import type { CompanionTabId } from '../theme';

type Props = {
  onNavigate: (tab: CompanionTabId) => void;
  onOpenMemory: () => void;
};

export function HomeScreen({ onNavigate, onOpenMemory }: Props) {
  const { save, affection } = useCompanion();

  const whisper = save.userNickname
    ? `${save.userNickname}，${YUKI_PROFILE.tagline}`
    : YUKI_PROFILE.tagline;

  const callsLabel = save.companionCallsUser || save.userNickname;

  return (
    <div className="companion-home page-tab-fade flex min-h-0 flex-1 flex-col pb-28">
      <header className="companion-home-header px-4 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-violet-50">
              {YUKI_PROFILE.name}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-violet-300/70">
              <span className="companion-presence-dot" aria-hidden />
              {callsLabel ? `正在陪${callsLabel}` : '深夜陪伴中'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenMemory}
            className="text-[11px] text-violet-400/60 underline-offset-2 hover:text-violet-300/90 hover:underline"
          >
            記憶
          </button>
        </div>
      </header>

      <div className="companion-home-stage flex-1">
        <CharacterStage variant="hero" />

        <div className="companion-home-overlay">
          <p className="companion-home-whisper">{whisper}</p>

          <div className="companion-home-affection">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-violet-300/75">
                <Heart className="h-3 w-3 fill-rose-400/70 text-rose-400/90" />
                好感
              </span>
              <span className="tabular-nums font-medium text-rose-200/90">{affection}</span>
            </div>
            <div className="companion-home-affection-track">
              <div
                className="companion-home-affection-fill"
                style={{ width: `${affection}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('chat')}
            className="companion-home-cta"
          >
            <MessageCircle className="h-5 w-5" />
            和她聊聊
          </button>
        </div>
      </div>
    </div>
  );
}
