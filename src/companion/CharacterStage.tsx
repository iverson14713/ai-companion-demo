type Props = {
  name: string;
  outfit: string;
};

/** 純 CSS 二次元角色占位 — 不接圖片資源 */
export function CharacterStage({ name, outfit }: Props) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px]">
      <div
        className="pointer-events-none absolute inset-0 rounded-[3rem] opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 72%, rgba(167,139,250,0.55) 0%, transparent 68%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[8%] h-32 w-32 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(244, 114, 182, 0.35)' }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col items-center justify-end pb-4">
        {/* 髮型 */}
        <div
          className="absolute left-1/2 top-[12%] z-20 h-[38%] w-[72%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-[#2d1b4e] via-[#4c1d95] to-[#6d28d9]"
          style={{ boxShadow: '0 0 40px rgba(167,139,250,0.35)' }}
        />
        <div className="absolute left-1/2 top-[18%] z-10 h-8 w-[88%] -translate-x-1/2 rounded-full bg-[#1e1035]/80" />

        {/* 臉 */}
        <div className="relative z-30 mt-[22%] h-[28%] w-[52%] rounded-[48%] bg-gradient-to-b from-[#fde7f3] to-[#f5d0e6] shadow-[inset_0_-8px_20px_rgba(190,24,93,0.12)]">
          <span className="absolute left-[28%] top-[42%] h-2.5 w-2.5 rounded-full bg-[#312e81]" />
          <span className="absolute right-[28%] top-[42%] h-2.5 w-2.5 rounded-full bg-[#312e81]" />
          <span className="absolute left-1/2 top-[52%] h-1 w-3 -translate-x-1/2 rounded-full bg-rose-300/70" />
          <span className="absolute left-[22%] top-[48%] h-3 w-5 rounded-full bg-rose-200/40 blur-[1px]" />
          <span className="absolute right-[22%] top-[48%] h-3 w-5 rounded-full bg-rose-200/40 blur-[1px]" />
        </div>

        {/* 身體 / 禮服 */}
        <div className="relative z-10 -mt-2 h-[46%] w-[78%] overflow-hidden rounded-t-[40%] rounded-b-[28%] bg-gradient-to-b from-[#4c1d95] via-[#5b21b6] to-[#1e1035]">
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent" />
          <div className="absolute left-1/2 top-[18%] h-16 w-16 -translate-x-1/2 rounded-full border border-violet-300/30 bg-violet-400/10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f0820] to-transparent" />
        </div>

        {/* 底座光環 */}
        <div
          className="absolute bottom-2 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-[100%] bg-violet-400/30 blur-md"
          aria-hidden
        />
      </div>

      <p className="pointer-events-none absolute bottom-0 left-0 right-0 text-center text-[11px] font-medium text-violet-300/70">
        {name} · {outfit}
      </p>
    </div>
  );
}
