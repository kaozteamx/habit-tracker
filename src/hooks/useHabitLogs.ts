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
            progress_value: 1,
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

  const updateLogProgress = useCallback(
    async (habitId: string, progressValue: number, date: Date = new Date()) => {
      if (!user) return;

      const dateStr = format(date, 'yyyy-MM-dd');
      const existing = logs.find(
        (l) => l.habit_id === habitId && l.completed_at === dateStr
      );

      if (existing) {
        if (progressValue <= 0) {
          const { error } = await supabase.from('habit_logs').delete().eq('id', existing.id);
          if (error) { console.error('Error removing log:', error.message); return; }
          setLogs((prev) => prev.filter((l) => l.id !== existing.id));
        } else {
          const { data, error } = await supabase
            .from('habit_logs')
            .update({ progress_value: progressValue })
            .eq('id', existing.id)
            .select()
            .single();
          if (error) { console.error('Error updating log:', error.message); return; }
          setLogs((prev) => prev.map((l) => (l.id === existing.id ? data : l)));
        }
      } else if (progressValue > 0) {
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_at: dateStr,
            progress_value: progressValue,
          })
          .select()
          .single();
        if (error) { console.error('Error adding log:', error.message); return; }
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

  const getProgressToday = useCallback(
    (habitId: string) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const log = logs.find((l) => l.habit_id === habitId && l.completed_at === today);
      return log?.progress_value || 0;
    },
    [logs]
  );

  const isCompletedToday = useCallback(
    (habitId: string, goalValue: number = 1) => {
      return getProgressToday(habitId) >= goalValue;
    },
    [getProgressToday]
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
    updateLogProgress,
    getLogsForHabit,
    isCompletedToday,
    getProgressToday,
    getLogsForDate,
    refetch: fetchLogs,
  };
}
