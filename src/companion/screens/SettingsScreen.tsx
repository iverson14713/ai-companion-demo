import { ChevronRight, Info, Moon, Volume2, Vibrate } from 'lucide-react';
import { useState } from 'react';
import { COMPANION_PROFILE } from '../mockData';

export function SettingsScreen() {
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);
  const [nightMode, setNightMode] = useState(true);

  return (
    <div className="page-tab-fade px-4 pb-28 pt-2">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-violet-50">設定</h1>
        <p className="text-sm text-violet-300/65">個人化你的伴侶體驗</p>
      </header>

      <section className="mb-4 overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.04]">
        <div className="flex items-center gap-3 border-b border-violet-500/10 px-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl">
            ✦
          </div>
          <div>
            <p className="font-bold text-violet-50">{COMPANION_PROFILE.name}</p>
            <p className="text-xs text-violet-300/60">Lv.{COMPANION_PROFILE.level} · Demo 帳號</p>
          </div>
        </div>
        <Row label="編輯稱呼" hint="即將推出" />
        <Row label="角色個性" hint="溫柔型" />
      </section>

      <section className="mb-4 overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.04]">
        <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-violet-400/70">
          偏好
        </p>
        <ToggleRow
          icon={Volume2}
          label="音效"
          checked={soundOn}
          onChange={setSoundOn}
        />
        <ToggleRow
          icon={Vibrate}
          label="觸覺回饋"
          checked={hapticOn}
          onChange={setHapticOn}
        />
        <ToggleRow
          icon={Moon}
          label="深色介面"
          checked={nightMode}
          onChange={setNightMode}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.04]">
        <div className="flex items-start gap-3 px-4 py-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <p className="text-sm font-semibold text-violet-100">AI 伴侶 Demo</p>
            <p className="mt-1 text-[12px] leading-relaxed text-violet-300/60">
              第一版僅前端 UI，未連接 Supabase、OpenAI 或後端 API。資料皆保存在本機記憶體中。
            </p>
            <p className="mt-2 text-[11px] text-violet-400/45">v0.1.0 · {new Date().getFullYear()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, hint }: { label: string; hint: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between border-t border-violet-500/10 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
    >
      <span className="text-sm text-violet-100">{label}</span>
      <span className="flex items-center gap-1 text-xs text-violet-400/70">
        {hint}
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Volume2;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-violet-500/10 px-4 py-3.5">
      <span className="flex items-center gap-2 text-sm text-violet-100">
        <Icon className="h-4 w-4 text-violet-400" />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-violet-500' : 'bg-violet-950/80'
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
