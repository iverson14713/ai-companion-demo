import { Home, MessageCircle, ListTodo, Settings } from 'lucide-react';
import type { CompanionTabId } from './theme';

const TABS: { id: CompanionTabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: '首頁', icon: Home },
  { id: 'chat', label: '聊天', icon: MessageCircle },
  { id: 'tasks', label: '任務', icon: ListTodo },
  { id: 'settings', label: '設定', icon: Settings },
];

type Props = {
  active: CompanionTabId;
  onChange: (tab: CompanionTabId) => void;
};

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[430px] border-t border-violet-500/20 bg-[#0a0614]/92 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
      aria-label="主要導覽"
    >
      <ul className="flex items-stretch justify-around gap-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-2xl px-2 py-2 transition ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-200'
                    : 'text-violet-300/55 hover:bg-white/5 hover:text-violet-200/90'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
