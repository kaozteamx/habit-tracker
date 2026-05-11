import { Check, Flame, MoreVertical, Trash2, Edit3, Play } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { Habit, HabitLog } from '../../types';
import { calculateStreak, getCompletionsInPeriod, getFrequencyTargetLabel, getDeadlineText } from '../../lib/utils';
import { FocusTimer } from '../focus/FocusTimer';

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog[];
  isCompleted: boolean;
  currentProgress?: number;
  onToggle: () => void;
  onUpdateProgress?: (value: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, logs, isCompleted, currentProgress = 0, onToggle, onUpdateProgress, onEdit, onDelete }: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const streak = calculateStreak(logs);
  const periodCompletions = getCompletionsInPeriod(logs, habit.frequency_type);
  const freqProgress = Math.min((periodCompletions / habit.target_count) * 100, 100);

  const isQuantitative = habit.goal_value > 1 || habit.goal_unit !== 'vez';
  const isTimeBased = isQuantitative && ['min', 'minuto', 'minutos', 'h', 'hora', 'horas', 'hr', 'hrs'].includes(habit.goal_unit.toLowerCase());
  
  const step = habit.goal_value >= 1000 ? 250 : habit.goal_value >= 100 ? 10 : habit.goal_value >= 20 ? 5 : 1;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress?.(Math.min(habit.goal_value, currentProgress + step));
  };
  const handleSub = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress?.(Math.max(0, currentProgress - step));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`habit-card ${isCompleted ? 'completed' : ''}`}
    >
      {isQuantitative ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {isCompleted ? (
            <div className="habit-checkbox checked" style={{ background: habit.color }} onClick={(e) => { e.stopPropagation(); onUpdateProgress?.(0); }}>
              <Check size={16} strokeWidth={3} />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', padding: '2px' }}>
              <button className="btn btn-ghost" style={{ width: '26px', height: '26px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-full)' }} onClick={handleSub}>-</button>
              <div style={{ width: '2px', height: '14px', background: 'var(--border-color)' }} />
              <button className="btn btn-ghost" style={{ width: '26px', height: '26px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-full)' }} onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      ) : (
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
      )}

      <div className="habit-icon" style={{ background: `${habit.color}18` }}>
        {habit.icon}
      </div>

      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        <div className="habit-meta">
          {isQuantitative ? (
            <span style={{ color: isCompleted ? habit.color : 'inherit', fontWeight: isCompleted ? 600 : 'normal' }}>
              {currentProgress} / {habit.goal_value} {habit.goal_unit}
            </span>
          ) : (
            <span>{getFrequencyTargetLabel(habit.frequency_type, habit.target_count)}</span>
          )}
          
          {!isCompleted && habit.frequency_type !== 'daily' && (
            <span style={{ marginLeft: '8px', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
              • {getDeadlineText(habit.frequency_type)}
            </span>
          )}

          {streak > 0 && (
            <span className="habit-streak" style={{ marginLeft: '8px' }}>
              <Flame size={12} /> {streak}
            </span>
          )}
        </div>
      </div>

      {!isQuantitative && habit.frequency_type !== 'daily' && (
        <div className="habit-progress-bar">
          <div className="habit-progress-fill" style={{ width: `${freqProgress}%`, background: habit.color }} />
        </div>
      )}
      
      {isQuantitative && (
        <div className="habit-progress-bar" style={{ width: '40px' }}>
          <div className="habit-progress-fill" style={{ width: `${Math.min(100, (currentProgress / habit.goal_value) * 100)}%`, background: habit.color }} />
        </div>
      )}

      <div className="habit-actions" style={{ position: 'relative', display: 'flex', gap: '4px' }}>
        {isTimeBased && !isCompleted && (
          <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setShowTimer(true); }}
            style={{ width: '32px', height: '32px', color: habit.color }} title="Modo Enfoque">
            <Play size={16} fill="currentColor" />
          </button>
        )}
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

      {showTimer && createPortal(
        <FocusTimer
          habit={habit}
          onComplete={(minutes) => {
            onUpdateProgress?.(Math.min(habit.goal_value, currentProgress + minutes));
          }}
          onClose={() => setShowTimer(false)}
        />,
        document.body
      )}
    </motion.div>
  );
}
