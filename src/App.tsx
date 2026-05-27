import { useState } from 'react';
import { BottomNav } from './companion/BottomNav';
import { CompanionProvider } from './companion/context/CompanionContext';
import { OverlaySheet } from './companion/OverlaySheet';
import { YUKI_PROFILE } from './companion/character/yukiProfile';
import { ChatScreen } from './companion/screens/ChatScreen';
import { HomeScreen } from './companion/screens/HomeScreen';
import { MemoryScreen } from './companion/screens/MemoryScreen';
import { SettingsScreen } from './companion/screens/SettingsScreen';
import { TasksScreen } from './companion/screens/TasksScreen';
import type { CompanionTabId } from './companion/theme';

type HomePanel = 'gift' | 'outfit' | null;

const OUTFITS = ['夜色居家', '星夜禮服', '櫻花校園', '冬日圍巾', '賽博霓虹'] as const;

function CompanionApp() {
  const [tab, setTab] = useState<CompanionTabId>('home');
  const [panel, setPanel] = useState<HomePanel>(null);
  const [outfit, setOutfit] = useState(YUKI_PROFILE.outfitDefault);
  const [showMemory, setShowMemory] = useState(false);

  const openMemory = () => setShowMemory(true);
  const closeMemory = () => setShowMemory(false);

  if (showMemory) {
    return (
      <div className="companion-app relative min-h-[100dvh] overflow-x-hidden text-violet-50">
        <div className="companion-bg pointer-events-none fixed inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[430px]">
          <MemoryScreen onBack={closeMemory} />
        </div>
      </div>
    );
  }

  return (
    <div className="companion-app relative min-h-[100dvh] overflow-x-hidden text-violet-50">
      <div className="companion-bg pointer-events-none fixed inset-0" aria-hidden />
      <div className="companion-stars pointer-events-none fixed inset-0" aria-hidden />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col">
        <main className="flex min-h-0 flex-1 flex-col">
          {tab === 'home' && (
            <HomeScreen
              outfit={outfit}
              onNavigate={setTab}
              onOpenPanel={(p) => setPanel(p)}
              onOpenMemory={openMemory}
            />
          )}
          {tab === 'chat' && <ChatScreen />}
          {tab === 'tasks' && <TasksScreen />}
          {tab === 'settings' && <SettingsScreen onOpenMemory={openMemory} />}
        </main>

        <BottomNav active={tab} onChange={setTab} />
      </div>

      <OverlaySheet title="送禮物" open={panel === 'gift'} onClose={() => setPanel(null)}>
        <p className="mb-3 text-sm text-violet-300/70">選一份禮物表達心意（Demo 無實際扣款）</p>
        <div className="grid grid-cols-3 gap-2">
          {['🌸', '🍫', '🎀', '⭐', '🧸', '💌'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-violet-500/20 bg-white/5 text-2xl transition hover:border-pink-400/40 hover:bg-pink-500/10 active:scale-95"
              onClick={() => setPanel(null)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </OverlaySheet>

      <OverlaySheet title="換裝" open={panel === 'outfit'} onClose={() => setPanel(null)}>
        <p className="mb-3 text-sm text-violet-300/70">目前穿著：{outfit}</p>
        <ul className="space-y-2">
          {OUTFITS.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => {
                  setOutfit(name);
                  setPanel(null);
                }}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  outfit === name
                    ? 'border-violet-400/50 bg-violet-500/20 text-violet-50'
                    : 'border-violet-500/15 bg-white/[0.03] text-violet-200 hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-sm font-semibold">{name}</span>
                {outfit === name ? (
                  <span className="text-[11px] text-violet-300">使用中</span>
                ) : (
                  <span className="text-[11px] text-violet-400/50">試穿</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </OverlaySheet>
    </div>
  );
}

export default function App() {
  return (
    <CompanionProvider>
      <CompanionApp />
    </CompanionProvider>
  );
}
