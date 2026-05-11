import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Habit, FrequencyType } from '../types';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching habits:', error.message);
    } else {
      setHabits(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const createHabit = useCallback(
    async (habit: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      frequency_type: FrequencyType;
      target_count?: number;
    }) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habit,
          user_id: user.id,
          sort_order: habits.length,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating habit:', error.message);
        return null;
      }
      setHabits((prev) => [...prev, data]);
      return data;
    },
    [user, habits.length]
  );

  const updateHabit = useCallback(
    async (id: string, updates: Partial<Habit>) => {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating habit:', error.message);
        return null;
      }
      setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
      return data;
    },
    []
  );

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) {
      console.error('Error deleting habit:', error.message);
      return false;
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    return true;
  }, []);

  const archiveHabit = useCallback(
    async (id: string) => {
      return updateHabit(id, { archived_at: new Date().toISOString() });
    },
    [updateHabit]
  );

  const getHabitsByFrequency = useCallback(
    (type: FrequencyType) => {
      return habits.filter((h) => h.frequency_type === type);
    },
    [habits]
  );

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    archiveHabit,
    getHabitsByFrequency,
    refetch: fetchHabits,
  };
}
