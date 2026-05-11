import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

export function LevelProgress({ level, currentXP, nextLevelXP, progress }: LevelProgressProps) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #FDE047 0%, #F59E0B 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '1.25rem',
          boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
        }}>
          {level}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Nivel {level}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {currentXP} / {nextLevelXP} XP
            </span>
          </div>
          <div className="habit-progress-bar">
            <motion.div 
              className="habit-progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg, #FDE047 0%, #F59E0B 100%)' }} 
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          color: 'var(--text-secondary)', fontSize: '0.75rem' 
        }}>
          <Star size={20} fill="#FDE047" color="#F59E0B" style={{ marginBottom: '4px' }} />
          <span>Faltan {nextLevelXP - currentXP} XP</span>
        </div>
      </div>
    </div>
  );
}
