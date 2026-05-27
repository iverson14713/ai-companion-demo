import { YUKI_IMAGE, YUKI_PROFILE } from './character/yukiProfile';

type Props = {
  variant?: 'hero' | 'compact';
};

/** 單一人像 — 僅 yuki-portrait.png，無多圖、無表情庫 */
export function CharacterStage({ variant = 'hero' }: Props) {
  const isHero = variant === 'hero';

  return (
    <div
      className={`companion-hero ${isHero ? 'companion-hero--large' : 'companion-hero--compact'}`}
    >
      <div className="companion-hero-ambient" aria-hidden>
        <div className="companion-hero-glow" />
      </div>

      <div className="companion-hero-motion">
        <img
          src={YUKI_IMAGE}
          alt={YUKI_PROFILE.name}
          className="companion-hero-img"
          width={606}
          height={757}
          decoding="async"
          fetchPriority={isHero ? 'high' : 'auto'}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function CharacterAvatar({ size = 44 }: { size?: number }) {
  return (
    <div
      className="companion-avatar-ring shrink-0 overflow-hidden rounded-2xl"
      style={{ width: size, height: size }}
    >
      <img
        src={YUKI_IMAGE}
        alt={YUKI_PROFILE.name}
        className="h-full w-full object-cover object-[center_22%]"
        width={size}
        height={size}
        draggable={false}
      />
    </div>
  );
}
