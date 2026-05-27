import { useState } from 'react';
import { BottomNav } from './companion/BottomNav';
import { CompanionProvider } from './companion/context/CompanionContext';
import { ChatScreen } from './companion/screens/ChatScreen';
import { HomeScreen } from './companion/screens/HomeScreen';
import { MemoryScreen } from './companion/screens/MemoryScreen';
import { SettingsScreen } from './companion/screens/SettingsScreen';
import { TasksScreen } from './companion/screens/TasksScreen';
import type { CompanionTabId } from './companion/theme';

function CompanionApp() {
  const [tab, setTab] = useState<CompanionTabId>('home');
  const [showMemory, setShowMemory] = useState(false);

  if (showMemory) {
    return (
      <div className="companion-app relative min-h-[100dvh] overflow-x-hidden text-violet-50">
        <div className="companion-bg pointer-events-none fixed inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[430px]">
          <MemoryScreen onBack={() => setShowMemory(false)} />
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
              onNavigate={setTab}
              onOpenMemory={() => setShowMemory(true)}
            />
          )}
          {tab === 'chat' && <ChatScreen />}
          {tab === 'tasks' && <TasksScreen />}
          {tab === 'settings' && <SettingsScreen onOpenMemory={() => setShowMemory(true)} />}
        </main>

        <BottomNav active={tab} onChange={setTab} />
      </div>
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
