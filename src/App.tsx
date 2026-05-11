import { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useHabits } from './hooks/useHabits';
import { useHabitLogs } from './hooks/useHabitLogs';
import { LoginPage } from './components/auth/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { HabitList } from './components/habits/HabitList';
import { HabitForm } from './components/habits/HabitForm';
import { StatsCards } from './components/dashboard/StatsCards';
import { CalendarHeatmap } from './components/dashboard/CalendarHeatmap';
import { Modal } from './components/ui/Modal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import type { ViewMode, Habit, FrequencyType } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [showForm, setShowForm] = useState(false);


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onAddHabit={() => setShowForm(true)}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {currentView === 'today' && <DashboardView />}
      {currentView === 'habits' && <HabitsView onAddHabit={() => setShowForm(true)} />}
      {currentView === 'stats' && <StatsView />}
      {currentView === 'profile' && <ProfileView accent={accent} onAccentChange={setAccent} />}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nuevo hábito">
        <NewHabitFormWrapper onClose={() => setShowForm(false)} />
      </Modal>
    </AppLayout>
  );
}

function DashboardView() {
  return <Dashboard />;
}

function HabitsView({ onAddHabit }: { onAddHabit: () => void }) {
  const { habits, updateHabit, deleteHabit } = useHabits();
  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);
  const { logs, toggleLog, isCompletedToday, getLogsForHabit, getProgressToday, updateLogProgress } = useHabitLogs(habitIds);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setHabitToDelete(id);
  };

  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabit(habitToDelete);
      setHabitToDelete(null);
    }
  };

  const handleUpdate = async (data: { name: string; description?: string; icon: string; color: string; frequency_type: FrequencyType; target_count: number; goal_value?: number; goal_unit?: string }) => {
    if (editingHabit) { await updateHabit(editingHabit.id, data); setEditingHabit(null); }
  };

  return (
    <div>
      <h1 className="page-title">Mis Hábitos</h1>
      <p className="page-subtitle">Gestiona todos tus hábitos</p>
      <HabitList habits={habits} logs={logs} isCompletedToday={isCompletedToday} getLogsForHabit={getLogsForHabit}
        getProgressToday={getProgressToday} updateLogProgress={updateLogProgress}
        onToggle={(id) => toggleLog(id)} onEdit={(h) => setEditingHabit(h)} onDelete={handleDelete} onAdd={onAddHabit} />
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

function StatsView() {
  const { habits } = useHabits();
  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);
  const { logs } = useHabitLogs(habitIds);

  return (
    <div>
      <h1 className="page-title">Estadísticas</h1>
      <p className="page-subtitle">Tu progreso en números</p>
      <StatsCards habits={habits} logs={logs} />
      <div style={{ marginTop: '24px' }}>
        <CalendarHeatmap habits={habits} logs={logs} />
      </div>
    </div>
  );
}

import type { AccentColor } from './hooks/useTheme';

function ProfileView({ accent, onAccentChange }: { accent: AccentColor; onAccentChange: (a: AccentColor) => void }) {
  const { profile, signOut } = useAuth();
  
  const ACCENT_COLORS: { id: AccentColor; name: string; hex: string }[] = [
    { id: 'violet', name: 'Violeta', hex: '#8B5CF6' },
    { id: 'emerald', name: 'Esmeralda', hex: '#10B981' },
    { id: 'rose', name: 'Rosa', hex: '#F43F5E' },
    { id: 'blue', name: 'Azul', hex: '#3B82F6' }
  ];

  return (
    <div>
      <h1 className="page-title">Perfil</h1>
      <p className="page-subtitle">Tu cuenta</p>
      <div className="card profile-card" style={{ marginBottom: '24px' }}>
        {profile?.avatar_url ? (
          <img className="profile-avatar" src={profile.avatar_url} alt="" />
        ) : (
          <div className="profile-avatar" style={{ background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
            {(profile?.full_name || profile?.email)?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="profile-name">{profile?.full_name || 'Usuario'}</div>
        <div className="profile-email">{profile?.email}</div>
        <button className="btn btn-danger" onClick={signOut} style={{ marginTop: '16px' }}>
          Cerrar sesión
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Personalización</h3>
        <p className="form-label" style={{ marginBottom: '12px' }}>Color de Acento</p>
        <div className="color-picker" style={{ gap: '12px' }}>
          {ACCENT_COLORS.map((c) => (
            <div 
              key={c.id} 
              className={`color-swatch ${accent === c.id ? 'selected' : ''}`}
              style={{ background: c.hex, width: '40px', height: '40px' }}
              onClick={() => onAccentChange(c.id)}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewHabitFormWrapper({ onClose }: { onClose: () => void }) {
  const { createHabit } = useHabits();
  const handleSubmit = async (data: { name: string; description?: string; icon: string; color: string; frequency_type: FrequencyType; target_count: number; goal_value?: number; goal_unit?: string }) => {
    await createHabit(data);
    onClose();
  };
  return <HabitForm onSubmit={handleSubmit} onCancel={onClose} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
