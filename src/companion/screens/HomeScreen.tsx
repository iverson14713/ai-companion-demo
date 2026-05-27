import { Heart, MessageCircle } from 'lucide-react';
import { CharacterStage } from '../CharacterStage';
import { YUKI_PROFILE } from '../character/yukiProfile';
import { useCompanion } from '../context/CompanionContext';
import type { CompanionTabId } from '../theme';

type Props = {
  onNavigate: (tab: CompanionTabId) => void;
};

export function HomeScreen({ onNavigate }: Props) {
  const { save, affection } = useCompanion();

  const whisper = save.userNickname
    ? `${save.userNickname}，${YUKI_PROFILE.tagline}`
    : YUKI_PROFILE.tagline;

  const statusText = save.companionCallsUser
    ? `正在陪${save.companionCallsUser}`
    : save.userNickname
      ? `正在陪${save.userNickname}`
      : '深夜陪伴中';

  return (
    <div className="companion-home page-tab-fade flex min-h-0 flex-1 flex-col pb-28">
      <section className="companion-home-top">
        <h1 className="companion-home-name">{YUKI_PROFILE.name}</h1>
        <p className="companion-home-status">
          <span className="companion-presence-dot" aria-hidden />
          {statusText}
        </p>
        <CharacterStage variant="hero" />
      </section>

      <section className="companion-home-bottom">
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
            <div className="companion-home-affection-fill" style={{ width: `${affection}%` }} />
          </div>
        </div>

        <button type="button" onClick={() => onNavigate('chat')} className="companion-home-cta">
          <MessageCircle className="h-5 w-5" />
          和她聊聊
        </button>
      </section>
    </div>
  );
}
