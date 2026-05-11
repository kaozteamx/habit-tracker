import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { HabitLog } from '../types';

export function useHabitLogs(habitIds: string[]) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user || habitIds.length === 0) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .in('habit_id', habitIds)
      .gte('completed_at', startDate)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error.message);
    } else {
      setLogs(data ?? []);
    }
    setLoading(false);
  }, [user, habitIds]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleLog = useCallback(
    async (habitId: string, date: Date = new Date()) => {
      if (!user) return;

      const dateStr = format(date, 'yyyy-MM-dd');
      const existing = logs.find(
        (l) => l.habit_id === habitId && l.completed_at === dateStr
      );

      if (existing) {
        // Remove log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existing.id);

        if (error) {
          console.error('Error removing log:', error.message);
          return;
        }
        setLogs((prev) => prev.filter((l) => l.id !== existing.id));
      } else {
        // Add log
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_at: dateStr,
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding log:', error.message);
          return;
        }
        setLogs((prev) => [data, ...prev]);
      }
    },
    [user, logs]
  );

  const getLogsForHabit = useCallback(
    (habitId: string) => {
      return logs.filter((l) => l.habit_id === habitId);
    },
    [logs]
  );

  const isCompletedToday = useCallback(
    (habitId: string) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return logs.some((l) => l.habit_id === habitId && l.completed_at === today);
    },
    [logs]
  );

  const getLogsForDate = useCallback(
    (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return logs.filter((l) => l.completed_at === dateStr);
    },
    [logs]
  );

  return {
    logs,
    loading,
    toggleLog,
    getLogsForHabit,
    isCompletedToday,
    getLogsForDate,
    refetch: fetchLogs,
  };
}
