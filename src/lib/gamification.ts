import type { Habit, HabitLog } from '../types';
import { calculateStreak } from './utils';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'first_step', name: 'Primer Paso', description: 'Completa tu primer hábito', icon: '🎯', color: '#10B981' },
  { id: 'collector', name: 'Coleccionista', description: 'Crea 5 hábitos diferentes', icon: '📦', color: '#8B5CF6' },
  { id: 'streak_3', name: 'Buena Racha', description: 'Consigue una racha de 3 días', icon: '🔥', color: '#F59E0B' },
  { id: 'streak_7', name: 'Imparable', description: 'Consigue una racha de 7 días', icon: '⚡', color: '#F43F5E' },
  { id: 'focus_master', name: 'Maestro del Tiempo', description: 'Utiliza el modo enfoque', icon: '⏳', color: '#3B82F6' },
  { id: 'veteran', name: 'Veterano', description: 'Alcanza el Nivel 5', icon: '👑', color: '#EAB308' },
];

export function calculateXP(habits: Habit[], logs: HabitLog[]): number {
  let xp = 0;
  
  logs.forEach(log => {
    const habit = habits.find(h => h.id === log.habit_id);
    if (!habit) return;

    if (log.progress_value >= habit.goal_value) {
      xp += 10; // 10 XP por completarlo al 100%
    } else if (log.progress_value > 0) {
      xp += 5; // 5 XP por progreso parcial
    }
  });

  return xp;
}

export function calculateLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number; progress: number } {
  // Formula: Level = floor(sqrt(XP / 25)) + 1
  // Level 1: 0 XP
  // Level 2: 25 XP
  // Level 3: 100 XP
  // Level 4: 225 XP
  // Level 5: 400 XP
  
  if (xp < 0) xp = 0;
  const level = Math.floor(Math.sqrt(xp / 25)) + 1;
  
  const currentLevelBaseXP = 25 * Math.pow(level - 1, 2);
  const nextLevelBaseXP = 25 * Math.pow(level, 2);
  
  const xpIntoCurrentLevel = xp - currentLevelBaseXP;
  const xpNeededForNextLevel = nextLevelBaseXP - currentLevelBaseXP;
  const progress = Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100));

  return {
    level,
    currentXP: xp,
    nextLevelXP: nextLevelBaseXP,
    progress
  };
}

export function getUnlockedBadges(habits: Habit[], logs: HabitLog[], level: number): string[] {
  const unlockedIds: string[] = [];
  
  // First step: At least 1 log with progress >= goal
  const hasCompletedOne = logs.some(log => {
    const habit = habits.find(h => h.id === log.habit_id);
    return habit && log.progress_value >= habit.goal_value;
  });
  if (hasCompletedOne) unlockedIds.push('first_step');
  
  // Collector: 5 or more habits
  if (habits.length >= 5) unlockedIds.push('collector');
  
  // Streaks
  let maxStreak = 0;
  habits.forEach(habit => {
    const habitLogs = logs.filter(l => l.habit_id === habit.id);
    const streak = calculateStreak(habitLogs);
    if (streak > maxStreak) maxStreak = streak;
  });
  
  if (maxStreak >= 3) unlockedIds.push('streak_3');
  if (maxStreak >= 7) unlockedIds.push('streak_7');
  
  // Focus master: Any log on a time-based habit
  const hasFocused = logs.some(log => {
    const habit = habits.find(h => h.id === log.habit_id);
    if (!habit) return false;
    const isQuantitative = habit.goal_value > 1 || habit.goal_unit !== 'vez';
    const isTimeBased = isQuantitative && ['min', 'minuto', 'minutos', 'h', 'hora', 'horas', 'hr', 'hrs'].includes(habit.goal_unit.toLowerCase());
    return isTimeBased && log.progress_value > 0;
  });
  if (hasFocused) unlockedIds.push('focus_master');
  
  // Veteran: Level 5
  if (level >= 5) unlockedIds.push('veteran');

  return unlockedIds;
}
