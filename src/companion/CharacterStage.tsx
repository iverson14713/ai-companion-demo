import { YUKI_IMAGE, YUKI_PROFILE } from './character/yukiProfile';

type Props = {
  variant?: 'hero' | 'compact';
};

/**
 * 單一主角色圖 — 裁切掉設定集／表情列，僅保留陪伴構圖。
 * 動畫：微浮動、微呼吸、整體柔光（不切換圖片、不疊假眼皮）。
 */
export function CharacterStage({ variant = 'hero' }: Props) {
  const isHero = variant === 'hero';

  return (
    <div
      className={`companion-hero ${isHero ? 'companion-hero--large companion-hero--presence' : 'companion-hero--compact'}`}
      role="img"
      aria-label={`${YUKI_PROFILE.name}正在陪你`}
    >
      <div className="companion-hero-ambient" aria-hidden>
        <div className="companion-hero-glow" />
        <div className="companion-hero-moon" />
      </div>

      <div className="companion-hero-clip">
        <div className="companion-hero-motion">
          <img
            src={YUKI_IMAGE}
            alt=""
            className="companion-hero-img"
            width={640}
            height={800}
            decoding="async"
            fetchPriority={isHero ? 'high' : 'auto'}
            draggable={false}
          />
          <div className="companion-hero-face-light" aria-hidden />
        </div>
      </div>

      <div className="companion-hero-fade" aria-hidden />
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
        className="h-full w-full object-cover object-[center_15%]"
        width={size}
        height={size}
        draggable={false}
      />
    </div>
  );
}
