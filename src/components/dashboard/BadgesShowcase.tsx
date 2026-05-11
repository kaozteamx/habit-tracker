import { motion } from 'framer-motion';
import { AVAILABLE_BADGES } from '../../lib/gamification';
import { Lock } from 'lucide-react';

interface BadgesShowcaseProps {
  unlockedIds: string[];
}

export function BadgesShowcase({ unlockedIds }: BadgesShowcaseProps) {
  return (
    <div style={{ marginTop: '48px', paddingBottom: '24px' }}>
      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Mis Medallas</h2>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '16px'
      }}>
        {AVAILABLE_BADGES.map(badge => {
          const isUnlocked = unlockedIds.includes(badge.id);
          
          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: isUnlocked ? -4 : 0 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity: isUnlocked ? 1 : 0.6,
                position: 'relative',
                overflow: 'hidden'
              }}
              title={badge.description}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
                background: isUnlocked ? `${badge.color}15` : 'var(--bg-input)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', marginBottom: '12px',
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                border: isUnlocked ? `2px solid ${badge.color}50` : '2px solid transparent'
              }}>
                {badge.icon}
              </div>
              
              <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2, marginBottom: '4px' }}>
                {badge.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
                {badge.description}
              </div>
              
              {!isUnlocked && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  color: 'var(--text-tertiary)'
                }}>
                  <Lock size={12} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
