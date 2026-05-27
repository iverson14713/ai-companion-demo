import { Brain, ChevronRight, Info, Moon, Trash2, Volume2, Vibrate } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CharacterAvatar } from '../CharacterStage';
import { YUKI_PROFILE } from '../character/yukiProfile';
import { GlassCard } from '../components/GlassCard';
import { useCompanion } from '../context/CompanionContext';
import { affectionToLevel } from '../storage/companionStore';

type Props = {
  onOpenMemory: () => void;
};

export function SettingsScreen({ onOpenMemory }: Props) {
  const {
    save,
    affection,
    setUserNickname,
    setCompanionCallsUser,
    clearMemories,
  } = useCompanion();

  const [nickname, setNickname] = useState(save.userNickname);
  const [callsUser, setCallsUser] = useState(save.companionCallsUser);
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setNickname(save.userNickname);
    setCallsUser(save.companionCallsUser);
  }, [save.userNickname, save.companionCallsUser]);

  const level = affectionToLevel(affection);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearMemories();
    setConfirmClear(false);
  };

  return (
    <div className="page-tab-fade px-4 pb-28 pt-2">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-violet-50">設定</h1>
        <p className="text-sm text-violet-300/65">個人化你的伴侶體驗</p>
      </header>

      <GlassCard className="mb-4 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4">
          <CharacterAvatar size={56} />
          <div>
            <p className="font-bold text-violet-50">{YUKI_PROFILE.name}</p>
            <p className="text-xs text-violet-300/60">
              Lv.{level} · 好感 {affection}%
            </p>
            <p className="mt-0.5 text-[10px] text-violet-400/50">{YUKI_PROFILE.about}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mb-4 overflow-hidden">
        <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-violet-400/70">
          稱呼
        </p>
        <label className="block border-t border-violet-500/10 px-4 py-3">
          <span className="text-[12px] text-violet-400/70">你的暱稱</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setUserNickname(nickname)}
            placeholder="例如：阿明"
            className="mt-1 w-full rounded-xl border border-violet-500/20 bg-white/[0.05] px-3 py-2 text-sm text-violet-50 outline-none focus:border-violet-400/45"
          />
        </label>
        <label className="block border-t border-violet-500/10 px-4 py-3">
          <span className="text-[12px] text-violet-400/70">小雪怎麼叫你</span>
          <input
            value={callsUser}
            onChange={(e) => setCallsUser(e.target.value)}
            onBlur={() => setCompanionCallsUser(callsUser)}
            placeholder="例如：寶貝、哥哥"
            className="mt-1 w-full rounded-xl border border-violet-500/20 bg-white/[0.05] px-3 py-2 text-sm text-violet-50 outline-none focus:border-violet-400/45"
          />
        </label>
      </GlassCard>

      <GlassCard className="mb-4 overflow-hidden">
        <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-violet-400/70">
          記憶
        </p>
        <button
          type="button"
          onClick={onOpenMemory}
          className="flex w-full items-center justify-between border-t border-violet-500/10 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
        >
          <span className="flex items-center gap-2 text-sm text-violet-100">
            <Brain className="h-4 w-4 text-violet-400" />
            記憶卡片
          </span>
          <span className="flex items-center gap-1 text-xs text-violet-400/70">
            查看
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>
        <button
          type="button"
          onClick={handleClear}
          className={`flex w-full items-center gap-2 border-t border-violet-500/10 px-4 py-3.5 text-left transition ${
            confirmClear
              ? 'bg-rose-500/15 text-rose-200'
              : 'text-rose-300/90 hover:bg-rose-500/10'
          }`}
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          <span className="text-sm">
            {confirmClear ? '再按一次確認清除喜好與事件' : '清除記憶（保留稱呼與好感）'}
          </span>
        </button>
      </GlassCard>

      <GlassCard className="mb-4 overflow-hidden">
        <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-violet-400/70">
          偏好
        </p>
        <ToggleRow icon={Volume2} label="音效" checked={soundOn} onChange={setSoundOn} />
        <ToggleRow icon={Vibrate} label="觸覺回饋" checked={hapticOn} onChange={setHapticOn} />
        <ToggleRow icon={Moon} label="深色介面" checked={nightMode} onChange={setNightMode} />
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="flex items-start gap-3 px-4 py-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <p className="text-sm font-semibold text-violet-100">AI 伴侶 Demo</p>
            <p className="mt-1 text-[12px] leading-relaxed text-violet-300/60">
              記憶與好感保存在本機 localStorage。聊天會帶入記憶送給 /api/chat（Key 僅在後端）。
            </p>
            <p className="mt-2 text-[11px] text-violet-400/45">v0.2.0 · {new Date().getFullYear()}</p>
          </div>
        </div>
      </GlassCard>
    </div>
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
