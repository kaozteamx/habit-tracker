import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import type { Habit, HabitLog, FrequencyType } from '../../types';
import { HabitCard } from './HabitCard';
import { EmptyState } from '../ui/EmptyState';
import { getFrequencyLabel } from '../../lib/utils';

interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  isCompletedToday: (habitId: string) => boolean;
  getLogsForHabit: (habitId: string) => HabitLog[];
  onToggle: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onAdd: () => void;
  filterType?: FrequencyType | 'all';
}

export function HabitList({ habits, isCompletedToday, getLogsForHabit, onToggle, onEdit, onDelete, onAdd, filterType = 'all' }: HabitListProps) {
  const filtered = filterType === 'all' ? habits : habits.filter((h) => h.frequency_type === filterType);

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title="Sin hábitos aún"
        text="Crea tu primer hábito y comienza a construir una mejor rutina"
        action={{ label: 'Crear hábito', onClick: onAdd }}
      />
    );
  }

  const grouped = filterType === 'all';
  const groups: { type: FrequencyType; habits: Habit[] }[] = grouped
    ? (['daily', 'weekly', 'monthly'] as FrequencyType[])
        .map((type) => ({ type, habits: filtered.filter((h) => h.frequency_type === type) }))
        .filter((g) => g.habits.length > 0)
    : [{ type: filterType as FrequencyType, habits: filtered }];

  return (
    <div>
      {groups.map((group) => (
        <div key={group.type} className="section">
          {grouped && (
            <div className="section-header">
              <h3 className="section-title">{getFrequencyLabel(group.type)}s</h3>
              <span className="section-badge">{group.habits.length}</span>
            </div>
          )}
          <div className="habits-list">
            <AnimatePresence initial={false}>
              {group.habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  logs={getLogsForHabit(habit.id)}
                  isCompleted={isCompletedToday(habit.id)}
                  onToggle={() => onToggle(habit.id)}
                  onEdit={() => onEdit(habit)}
                  onDelete={() => onDelete(habit.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <button className="btn btn-secondary btn-sm" onClick={onAdd}>
          <Plus size={16} /> Agregar hábito
        </button>
      </div>
    </div>
  );
}
