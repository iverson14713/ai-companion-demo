import { CheckCircle2, Circle, Coins } from 'lucide-react';
import { useState } from 'react';
import { MOCK_TASKS } from '../mockData';

export function TasksScreen() {
  const [tasks, setTasks] = useState(() => MOCK_TASKS.map((t) => ({ ...t })));

  const doneCount = tasks.filter((t) => t.done).length;

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="page-tab-fade px-4 pb-28 pt-2">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-violet-50">每日任務</h1>
        <p className="text-sm text-violet-300/65">完成任務提升好感，解鎖更多互動</p>
      </header>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
        <Coins className="h-8 w-8 text-amber-300" />
        <div>
          <p className="text-sm font-semibold text-amber-100">今日進度 {doneCount}/{tasks.length}</p>
          <p className="text-[11px] text-amber-200/60">全部完成可獲得限定對話（Demo）</p>
        </div>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggle(task.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                task.done
                  ? 'border-emerald-500/25 bg-emerald-500/10'
                  : 'border-violet-500/20 bg-white/[0.04] hover:bg-white/[0.07]'
              }`}
            >
              {task.done ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-6 w-6 shrink-0 text-violet-400/50" />
              )}
              <span className="flex-1">
                <span
                  className={`block text-sm font-semibold ${
                    task.done ? 'text-emerald-100/80 line-through' : 'text-violet-50'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[11px] text-violet-300/55">{task.reward}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
