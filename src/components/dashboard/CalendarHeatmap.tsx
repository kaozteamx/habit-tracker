import { format } from 'date-fns';
import type { Habit, HabitLog } from '../../types';
import { getLast90Days } from '../../lib/utils';

interface CalendarHeatmapProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function CalendarHeatmap({ habits, logs }: CalendarHeatmapProps) {
  const days = getLast90Days();
  const totalHabits = habits.filter((h) => h.frequency_type === 'daily').length;

  const getLevel = (date: Date): number => {
    if (totalHabits === 0) return 0;
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = logs.filter((l) => l.completed_at === dateStr).length;
    const pct = count / totalHabits;
    if (pct === 0) return 0;
    if (pct <= 0.25) return 1;
    if (pct <= 0.5) return 2;
    if (pct <= 0.75) return 3;
    return 4;
  };

  // Group days by month for labels
  const months: { label: string; count: number }[] = [];
  let currentMonth = '';
  days.forEach((d) => {
    const m = format(d, 'MMM');
    if (m !== currentMonth) {
      months.push({ label: m, count: 1 });
      currentMonth = m;
    } else {
      months[months.length - 1].count++;
    }
  });

  return (
    <div className="card" style={{ padding: '20px' }}>
      <h3 className="section-title" style={{ marginBottom: '16px' }}>Actividad (90 días)</h3>
      <div className="heatmap-container">
        <div className="heatmap-grid">
          {days.map((day, i) => (
            <div
              key={i}
              className={`heatmap-cell level-${getLevel(day)}`}
              title={`${format(day, 'dd MMM yyyy')}: ${logs.filter((l) => l.completed_at === format(day, 'yyyy-MM-dd')).length} completados`}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Menos</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={`heatmap-cell level-${level}`} />
        ))}
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Más</span>
      </div>
    </div>
  );
}
