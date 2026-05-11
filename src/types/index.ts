export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency_type: FrequencyType;
  target_count: number;
  goal_value: number;
  goal_unit: string;
  created_at: string;
  archived_at: string | null;
  sort_order: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  progress_value: number;
  notes: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
  completedToday: boolean;
  currentStreak: number;
  completionRate: number;
}

export type ViewMode = 'today' | 'habits' | 'stats' | 'profile';
