import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, CheckCircle2, X } from 'lucide-react';
import type { Habit } from '../../types';

interface FocusTimerProps {
  habit: Habit;
  onComplete: (minutesFocused: number) => void;
  onClose: () => void;
}

export function FocusTimer({ habit, onComplete, onClose }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [finalMinutes, setFinalMinutes] = useState(0);
  const [focusedMinutes, setFocusedMinutes] = useState(0);

  // If the habit's goal is small (e.g. 10 mins), start the timer at that value instead of 25.
  const targetMinutes = habit.goal_value > 0 && habit.goal_value <= 60 ? habit.goal_value : 25;

  useEffect(() => {
    setTimeLeft(targetMinutes * 60);
  }, [targetMinutes]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (timeLeft % 60 === 0 && timeLeft < targetMinutes * 60) {
          setFocusedMinutes((m) => m + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setFocusedMinutes((m) => m + 1);
      setFinalMinutes(targetMinutes);
      setShowReview(true);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, timeLeft, targetMinutes]);

  const toggleTimer = () => setIsActive(!isActive);

  const handleStop = () => {
    setIsActive(false);
    setFinalMinutes(focusedMinutes);
    setShowReview(true);
  };

  const handleCompleteEarly = () => {
    setIsActive(false);
    setFinalMinutes(targetMinutes);
    setShowReview(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = 100 - (timeLeft / (targetMinutes * 60)) * 100;

  if (showReview) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Sesión terminada</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Ajusta el tiempo si es necesario antes de registrar</p>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>Minutos de enfoque</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button className="btn btn-ghost" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} 
                onClick={() => setFinalMinutes(Math.max(0, finalMinutes - 5))}>-5</button>
              <input 
                type="number" 
                value={finalMinutes} 
                onChange={(e) => setFinalMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '100px', fontSize: '2.5rem', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700 }}
              />
              <button className="btn btn-ghost" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} 
                onClick={() => setFinalMinutes(finalMinutes + 5)}>+5</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)', flex: '1 1 100%' }} onClick={onClose}>Descartar sesión</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowReview(false)}>Reanudar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onComplete(finalMinutes); onClose(); }}>Guardar</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <button 
        className="btn btn-ghost btn-icon" 
        onClick={handleStop}
        style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px' }}
      >
        <X size={24} />
      </button>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{habit.icon}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Enfoque: {habit.name}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>Mantente concentrado en tu objetivo</p>

        <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto 48px' }}>
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="140" cy="140" r="130" fill="none" stroke="var(--bg-input)" strokeWidth="12" />
            <circle 
              cx="140" cy="140" r="130" fill="none" 
              stroke={habit.color} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progressPercent / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '4rem', fontWeight: 800,
            fontVariantNumeric: 'tabular-nums'
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            className="btn" 
            onClick={handleStop}
            style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          >
            <Square size={24} fill="currentColor" />
          </button>
          <button 
            className="btn" 
            onClick={toggleTimer}
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: habit.color, color: '#fff', boxShadow: `0 4px 20px ${habit.color}40` }}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={handleCompleteEarly}
            style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)' }}
            title="Completar anticipadamente"
          >
            <CheckCircle2 size={24} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
