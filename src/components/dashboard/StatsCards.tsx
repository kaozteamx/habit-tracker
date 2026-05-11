import { Target, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Habit, HabitLog } from '../../types';
import { calculateStreak } from '../../lib/utils';
import { format } from 'date-fns';

interface StatsCardsProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function StatsCards({ habits, logs }: StatsCardsProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLogs = logs.filter((l) => l.completed_at === today);
  const dailyHabits = habits.filter((h) => h.frequency_type === 'daily');
  const completedToday = todayLogs.length;
  const totalDaily = dailyHabits.length;
  const completionPct = totalDaily > 0 ? Math.round((completedToday / totalDaily) * 100) : 0;

  const bestStreak = habits.reduce((max, h) => {
    const habitLogs = logs.filter((l) => l.habit_id === h.id);
    return Math.max(max, calculateStreak(habitLogs));
  }, 0);

  const totalCompletions = logs.length;

  const stats = [
    { icon: <Target size={20} />, value: `${completionPct}%`, label: 'Hoy', color: 'var(--accent)', bg: 'var(--accent-subtle)' },
    { icon: <Flame size={20} />, value: bestStreak.toString(), label: 'Mejor racha', color: 'var(--warning)', bg: 'rgba(251,191,36,0.12)' },
    { icon: <CheckCircle2 size={20} />, value: `${completedToday}/${totalDaily}`, label: 'Completados', color: 'var(--success)', bg: 'var(--success-subtle)' },
    { icon: <TrendingUp size={20} />, value: totalCompletions.toString(), label: 'Total logs', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
