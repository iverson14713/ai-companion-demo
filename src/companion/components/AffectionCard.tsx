import { Heart, Sparkles } from 'lucide-react';
import { affectionToLevel } from '../storage/companionStore';
import { GlassCard } from './GlassCard';

type Props = {
  affection: number;
  className?: string;
};

export function AffectionCard({ affection, className = '' }: Props) {
  const level = affectionToLevel(affection);
  const nextMilestone = Math.min(100, Math.ceil(affection / 10) * 10) || 10;
  const toNext = nextMilestone - affection;

  return (
    <GlassCard glow className={`p-4 ${className}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/70">
            <Sparkles className="h-3 w-3" />
            羈絆
          </p>
          <h2 className="mt-0.5 flex items-center gap-2 text-lg font-bold text-violet-50">
            <Heart className="h-5 w-5 fill-rose-400/90 text-rose-400" />
            好感度
          </h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-rose-200">{affection}</p>
          <p className="text-[10px] text-violet-400/60">/ 100 · Lv.{level}</p>
        </div>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-[#0d0818]/80 ring-1 ring-white/10">
        <div
          className="companion-affection-bar absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${affection}%` }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40"
          aria-hidden
        />
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-violet-300/60">
        {toNext > 0 && affection < 100
          ? `再 ${toNext} 點解鎖更親密的回應`
          : affection >= 100
            ? '你們的羈絆已滿 · 小雪會更黏你一點'
            : '多聊聊天，好感會慢慢升溫'}
      </p>
    </GlassCard>
  );
}
