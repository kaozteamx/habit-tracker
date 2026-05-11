import { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useHabits } from '../../hooks/useHabits';
import { useHabitLogs } from '../../hooks/useHabitLogs';
import { StatsCards } from './StatsCards';
import { CalendarHeatmap } from './CalendarHeatmap';
import { HabitList } from '../habits/HabitList';
import { HabitForm } from '../habits/HabitForm';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate } from '../../lib/utils';
import type { Habit, FrequencyType } from '../../types';

export function Dashboard() {
  const { habits, createHabit, updateHabit, deleteHabit } = useHabits();
  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);
  const { logs, toggleLog, isCompletedToday, getLogsForHabit, getProgressToday, updateLogProgress } = useHabitLogs(habitIds);
  const prevCompletedCountRef = useRef(0);

  useEffect(() => {
    if (habits.length === 0) return;
    const completedCount = habits.filter(h => isCompletedToday(h.id, h.goal_value)).length;
    
    // Si completamos todos los hábitos y antes no lo estaban, lanzar confeti
    if (completedCount === habits.length && prevCompletedCountRef.current < habits.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F43F5E', '#3B82F6', '#FBBF24']
      });
    }
    prevCompletedCountRef.current = completedCount;
  }, [logs, habits, isCompletedToday]);

  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const handleCreate = async (data: { name: string; description?: string; icon: string; color: string; frequency_type: FrequencyType; target_count: number; goal_value?: number; goal_unit?: string }) => {
    await createHabit(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: { name: string; description?: string; icon: string; color: string; frequency_type: FrequencyType; target_count: number; goal_value?: number; goal_unit?: string }) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, data);
      setEditingHabit(null);
    }
  };

  const handleDelete = async (id: string) => {
    setHabitToDelete(id);
  };

  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabit(habitToDelete);
      setHabitToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <h1 className="page-title">¡Hola! 👋</h1>
        <p className="page-subtitle">{formatDate(new Date(), "EEEE, d 'de' MMMM yyyy")}</p>
      </div>

      <StatsCards habits={habits} logs={logs} />
      <CalendarHeatmap habits={habits} logs={logs} />

      <div style={{ marginTop: '32px' }}>
        <div className="section-header">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Mis hábitos</h2>
        </div>
        <HabitList
          habits={habits}
          logs={logs}
          isCompletedToday={isCompletedToday}
          getProgressToday={getProgressToday}
          getLogsForHabit={getLogsForHabit}
          onToggle={(id) => toggleLog(id)}
          updateLogProgress={updateLogProgress}
          onEdit={(habit) => setEditingHabit(habit)}
          onDelete={handleDelete}
          onAdd={() => setShowForm(true)}
        />
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nuevo hábito">
        <HabitForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editingHabit} onClose={() => setEditingHabit(null)} title="Editar hábito">
        <HabitForm habit={editingHabit} onSubmit={handleUpdate} onCancel={() => setEditingHabit(null)} />
      </Modal>
      
      <ConfirmDialog
        isOpen={!!habitToDelete}
        title="Eliminar hábito"
        message="¿Estás seguro de que deseas eliminar este hábito? Esta acción no se puede deshacer y borrará todo el historial."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setHabitToDelete(null)}
      />
    </div>
  );
}
