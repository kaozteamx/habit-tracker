import { Check, Flame, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Habit, HabitLog } from '../../types';
import { calculateStreak, getCompletionsInPeriod, getFrequencyTargetLabel } from '../../lib/utils';

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog[];
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, logs, isCompleted, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const streak = calculateStreak(logs);
  const periodCompletions = getCompletionsInPeriod(logs, habit.frequency_type);
  const progress = Math.min((periodCompletions / habit.target_count) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`habit-card ${isCompleted ? 'completed' : ''}`}
    >
      <div
        className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
        style={{ background: isCompleted ? habit.color : 'transparent' }}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        role="checkbox"
        aria-checked={isCompleted}
        id={`habit-check-${habit.id}`}
      >
        {isCompleted && <Check size={16} strokeWidth={3} />}
      </div>

      <div className="habit-icon" style={{ background: `${habit.color}18` }}>
        {habit.icon}
      </div>

      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        <div className="habit-meta">
          <span>{getFrequencyTargetLabel(habit.frequency_type, habit.target_count)}</span>
          {streak > 0 && (
            <span className="habit-streak">
              <Flame size={12} /> {streak}
            </span>
          )}
        </div>
      </div>

      <div className="habit-progress-bar">
        <div className="habit-progress-fill" style={{ width: `${progress}%`, background: habit.color }} />
      </div>

      <div className="habit-actions" style={{ position: 'relative' }}>
        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          style={{ width: '32px', height: '32px' }}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', zIndex: 50,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', padding: '4px', minWidth: '140px',
            boxShadow: 'var(--shadow-lg)',
          }} onMouseLeave={() => setShowMenu(false)}>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(); }}>
              <Edit3 size={14} /> Editar
            </button>
            <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(); }}>
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
