import { YUKI_IMAGE, YUKI_PROFILE } from './character/yukiProfile';

type Props = {
  outfit?: string;
  variant?: 'hero' | 'compact';
};

/** 小雪主視覺 — yuki-main.png */
export function CharacterStage({ outfit, variant = 'hero' }: Props) {
  const outfitLabel = outfit ?? YUKI_PROFILE.outfitDefault;
  const isHero = variant === 'hero';

  return (
    <div
      className={`companion-hero relative mx-auto w-full ${isHero ? 'companion-hero--large' : 'companion-hero--compact'}`}
    >
      <div className="companion-hero-moon" aria-hidden />
      <div className="companion-hero-glow" aria-hidden />
      <div className="companion-hero-floor" aria-hidden />

      <img
        src={YUKI_IMAGE}
        alt={`${YUKI_PROFILE.name} — AI 伴侶主視覺`}
        className="companion-hero-img"
        width={640}
        height={800}
        decoding="async"
        fetchPriority={isHero ? 'high' : 'auto'}
      />

      <div className="companion-hero-vignette" aria-hidden />

      <div className="companion-hero-badge">
        <span className="companion-hero-badge-name">{YUKI_PROFILE.name}</span>
        <span className="companion-hero-badge-outfit">{outfitLabel}</span>
      </div>
    </div>
  );
}

/** 聊天／設定用小頭像 */
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
