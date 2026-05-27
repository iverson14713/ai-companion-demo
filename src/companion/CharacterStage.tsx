import { YUKI_IMAGE, YUKI_PROFILE } from './character/yukiProfile';
import { useIdleBlink } from './hooks/useIdleBlink';

type Props = {
  outfit?: string;
  variant?: 'hero' | 'compact';
};

/** 小雪主視覺 — yuki-main.png + 柔和待機動畫 */
export function CharacterStage({ outfit, variant = 'hero' }: Props) {
  const outfitLabel = outfit ?? YUKI_PROFILE.outfitDefault;
  const isHero = variant === 'hero';
  const blinking = useIdleBlink(isHero);

  return (
    <div
      className={`companion-hero relative mx-auto w-full ${isHero ? 'companion-hero--large companion-hero--live' : 'companion-hero--compact'}`}
    >
      <div className="companion-hero-moon companion-hero-ambient-drift" aria-hidden />
      <div className="companion-hero-glow companion-hero-glow-pulse" aria-hidden />
      <div className="companion-hero-floor" aria-hidden />

      {isHero ? (
        <div className="companion-hero-shimmer" aria-hidden />
      ) : null}

      <div className="companion-hero-figure">
        <div className={isHero ? 'companion-hero-float' : undefined}>
          <div className={isHero ? 'companion-hero-breathe' : undefined}>
          <img
            src={YUKI_IMAGE}
            alt={`${YUKI_PROFILE.name} — AI 伴侶主視覺`}
            className="companion-hero-img"
            width={640}
            height={800}
            decoding="async"
            fetchPriority={isHero ? 'high' : 'auto'}
          />

          {isHero ? (
            <div className="companion-hero-eyes" aria-hidden>
              <span
                className={`companion-eye companion-eye--left${blinking ? ' companion-eye--blink' : ''}`}
              />
              <span
                className={`companion-eye companion-eye--right${blinking ? ' companion-eye--blink' : ''}`}
              />
            </div>
          ) : null}
          </div>
        </div>
      </div>

      <div className="companion-hero-vignette" aria-hidden />

      <div className="companion-hero-badge">
        <span className="companion-hero-badge-name">{YUKI_PROFILE.name}</span>
        <span className="companion-hero-badge-outfit">{outfitLabel}</span>
      </div>
    </div>
  );
}

/** 聊天／設定用小頭像（無待機動畫以節省效能） */
export function CharacterAvatar({ size = 44 }: { size?: number }) {
  return (
    <div
      className="companion-avatar-ring shrink-0 overflow-hidden rounded-2xl"
      style={{ width: size, height: size }}
    >
      <img
        src={YUKI_IMAGE}
        alt={YUKI_PROFILE.name}
        className="h-full w-full object-cover object-[center_20%]"
        width={size}
        height={size}
      />
    </div>
  );
}
