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
  const [isFinished, setIsFinished] = useState(false);
  const [focusedMinutes, setFocusedMinutes] = useState(0);

  // If the habit's goal is small (e.g. 10 mins), start the timer at that value instead of 25.
  useEffect(() => {
    if (habit.goal_value > 0 && habit.goal_value <= 60) {
      setTimeLeft(habit.goal_value * 60);
    }
  }, [habit.goal_value]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (timeLeft % 60 === 0 && timeLeft < 25 * 60) {
          setFocusedMinutes((m) => m + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      setFocusedMinutes((m) => m + 1);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const handleStop = () => {
    setIsActive(false);
    if (window.confirm('¿Detener la sesión de enfoque actual?')) {
      onComplete(focusedMinutes);
      onClose();
    }
  };

  const handleComplete = () => {
    // If they finish successfully, record the target minutes they set initially
    const targetMinutes = habit.goal_value > 0 && habit.goal_value <= 60 ? habit.goal_value : 25;
    onComplete(isFinished ? targetMinutes : focusedMinutes);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = 100 - (timeLeft / (habit.goal_value > 0 && habit.goal_value <= 60 ? habit.goal_value * 60 : 25 * 60)) * 100;

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

        {isFinished ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--success)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
              <CheckCircle2 /> ¡Sesión completada!
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleComplete} style={{ width: '100%' }}>
              Registrar {habit.goal_value > 0 && habit.goal_value <= 60 ? habit.goal_value : 25} minutos
            </button>
          </div>
        ) : (
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
              onClick={handleComplete}
              style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)' }}
              title="Completar anticipadamente"
            >
              <CheckCircle2 size={24} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
