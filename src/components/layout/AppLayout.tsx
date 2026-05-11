import { useState } from 'react';
import { LayoutDashboard, ListChecks, BarChart3, User, Plus, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { ViewMode } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddHabit: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { view: ViewMode; icon: React.ReactNode; label: string }[] = [
  { view: 'today', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { view: 'habits', icon: <ListChecks size={20} />, label: 'Hábitos' },
  { view: 'stats', icon: <BarChart3 size={20} />, label: 'Estadísticas' },
  { view: 'profile', icon: <User size={20} />, label: 'Perfil' },
];

export function AppLayout({ children, currentView, onViewChange, onAddHabit, theme, onToggleTheme }: AppLayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar (desktop) */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎯</div>
          <span className="sidebar-logo-text">Habit Tracker</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.view} className={`sidebar-link ${currentView === item.view ? 'active' : ''}`}
              onClick={() => { onViewChange(item.view); setSidebarOpen(false); }}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="sidebar-link" onClick={onAddHabit} style={{ marginTop: '8px' }}>
            <span className="icon"><Plus size={20} /></span>
            Nuevo hábito
          </button>
        </nav>
        <div className="sidebar-footer">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {profile && (
            <div className="sidebar-user">
              {profile.avatar_url ? (
                <img className="sidebar-avatar" src={profile.avatar_url} alt="" />
              ) : (
                <div className="sidebar-avatar" style={{ background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                  {(profile.full_name || profile.email)?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{profile.full_name || 'Usuario'}</div>
                <div className="sidebar-user-email">{profile.email}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={signOut} title="Cerrar sesión" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <header className="mobile-header">
        <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={20} />
        </button>
        <span className="mobile-header-title">Habit Tracker</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="modal-overlay" style={{ zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <button key={item.view} className={`bottom-nav-item ${currentView === item.view ? 'active' : ''}`}
              onClick={() => onViewChange(item.view)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="bottom-nav-fab" onClick={onAddHabit} aria-label="Nuevo hábito">
            <Plus size={24} />
          </button>
          {NAV_ITEMS.slice(2).map((item) => (
            <button key={item.view} className={`bottom-nav-item ${currentView === item.view ? 'active' : ''}`}
              onClick={() => onViewChange(item.view)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
