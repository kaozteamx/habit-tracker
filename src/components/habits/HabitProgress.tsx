import type { Habit, HabitLog } from '../../types';
import { getCompletionsInPeriod } from '../../lib/utils';

interface HabitProgressProps {
  habit: Habit;
  logs: HabitLog[];
}

export function HabitProgress({ habit, logs }: HabitProgressProps) {
  const completions = getCompletionsInPeriod(logs, habit.frequency_type);
  const progress = Math.min((completions / habit.target_count) * 100, 100);
  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="24" cy="24" r="18" fill="none" stroke="var(--bg-input)" strokeWidth="4" />
        <circle cx="24" cy="24" r="18" fill="none" stroke={habit.color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700,
      }}>
        {completions}/{habit.target_count}
      </div>
    </div>
  );
}
