import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  eachDayOfInterval,
  subDays,
  differenceInDays,
  differenceInHours,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { HabitLog, FrequencyType } from '../types';

export function formatDate(date: Date | string, pattern: string = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
}

export function getDateRange(frequencyType: FrequencyType, referenceDate: Date = new Date()) {
  switch (frequencyType) {
    case 'daily':
      return { start: referenceDate, end: referenceDate };
    case 'weekly':
      return {
        start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
        end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
      };
    case 'monthly':
      return {
        start: startOfMonth(referenceDate),
        end: endOfMonth(referenceDate),
      };
  }
}

export function getCompletionsInPeriod(
  logs: HabitLog[],
  frequencyType: FrequencyType,
  referenceDate: Date = new Date()
): number {
  const { start, end } = getDateRange(frequencyType, referenceDate);
  return logs.filter((log) => {
    const logDate = parseISO(log.completed_at);
    return isWithinInterval(logDate, { start, end });
  }).length;
}

export function calculateStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  const sortedDates = logs
    .map((log) => log.completed_at)
    .sort()
    .reverse();

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // If not completed today or yesterday, streak is 0
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInDays(parseISO(sortedDates[i - 1]), parseISO(sortedDates[i]));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getCompletionRate(
  logs: HabitLog[],
  createdAt: string,
  frequencyType: FrequencyType,
  targetCount: number
): number {
  const start = parseISO(createdAt);
  const end = new Date();
  const totalDays = Math.max(differenceInDays(end, start), 1);

  switch (frequencyType) {
    case 'daily': {
      const completedDays = new Set(logs.map((l) => l.completed_at)).size;
      return Math.min(Math.round((completedDays / totalDays) * 100), 100);
    }
    case 'weekly': {
      const totalWeeks = Math.max(Math.ceil(totalDays / 7), 1);
      const completedWeeks = logs.length / targetCount;
      return Math.min(Math.round((completedWeeks / totalWeeks) * 100), 100);
    }
    case 'monthly': {
      const totalMonths = Math.max(Math.ceil(totalDays / 30), 1);
      const completedMonths = logs.length / targetCount;
      return Math.min(Math.round((completedMonths / totalMonths) * 100), 100);
    }
  }
}

export function getLast90Days(): Date[] {
  return eachDayOfInterval({
    start: subDays(new Date(), 89),
    end: new Date(),
  });
}

export function getFrequencyLabel(type: FrequencyType): string {
  switch (type) {
    case 'daily':
      return 'Diario';
    case 'weekly':
      return 'Semanal';
    case 'monthly':
      return 'Mensual';
  }
}

export function getFrequencyTargetLabel(type: FrequencyType, target: number): string {
  switch (type) {
    case 'daily':
      return target === 1 ? 'Cada día' : `${target}x al día`;
    case 'weekly':
      return target === 1 ? '1 vez por semana' : `${target}x por semana`;
    case 'monthly':
      return target === 1 ? '1 vez al mes' : `${target}x al mes`;
  }
}

export const HABIT_COLORS = [
  '#8B5CF6', // violeta
  '#EC4899', // rosa
  '#F59E0B', // ámbar
  '#10B981', // esmeralda
  '#3B82F6', // azul
  '#EF4444', // rojo
  '#06B6D4', // cyan
  '#F97316', // naranja
  '#84CC16', // lima
  '#6366F1', // índigo
];

export const HABIT_ICONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🧹', '💊', '🎵', '🌿', '🐕', '📱', '🧠',
  '☀️', '🌙', '❤️', '⭐', '🔥', '✨', '🎨', '💻',
];

export function getDeadlineText(frequencyType: FrequencyType): string | null {
  if (frequencyType === 'daily') return null;
  
  const now = new Date();
  let endDate: Date;
  
  if (frequencyType === 'weekly') {
    endDate = endOfWeek(now, { weekStartsOn: 1 });
  } else if (frequencyType === 'monthly') {
    endDate = endOfMonth(now);
  } else {
    return null;
  }
  
  const diffHours = differenceInHours(endDate, now);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `Quedan ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Quedan ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else {
    return 'Termina hoy';
  }
}
