import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
export type AccentColor = 'violet' | 'emerald' | 'rose' | 'blue';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('habit-tracker-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accent, setAccent] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('habit-tracker-accent') as AccentColor;
    return saved || 'violet';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('habit-tracker-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('habit-tracker-accent', accent);
  }, [accent]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, accent, setAccent };
}
