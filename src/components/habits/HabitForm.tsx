import { useState } from 'react';
import type { Habit, FrequencyType } from '../../types';
import { HABIT_COLORS, HABIT_ICONS } from '../../lib/utils';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency_type: FrequencyType;
    target_count: number;
  }) => void;
  onCancel: () => void;
}

export function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [icon, setIcon] = useState(habit?.icon ?? '✨');
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0]);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(habit?.frequency_type ?? 'daily');
  const [targetCount, setTargetCount] = useState(habit?.target_count ?? 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() || undefined, icon, color, frequency_type: frequencyType, target_count: targetCount });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nombre del hábito</label>
        <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Meditar 10 minutos" required autoFocus id="habit-name-input" />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción (opcional)</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Por qué es importante este hábito?" rows={2} />
      </div>

      <div className="form-group">
        <label className="form-label">Icono</label>
        <div className="icon-picker">
          {HABIT_ICONS.map((ic) => (
            <button type="button" key={ic} className={`icon-option ${icon === ic ? 'selected' : ''}`}
              onClick={() => setIcon(ic)}>{ic}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Color</label>
        <div className="color-picker">
          {HABIT_COLORS.map((c) => (
            <button type="button" key={c} className={`color-swatch ${color === c ? 'selected' : ''}`}
              style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Frecuencia</label>
        <div className="freq-chips">
          {(['daily', 'weekly', 'monthly'] as FrequencyType[]).map((ft) => (
            <button type="button" key={ft} className={`freq-chip ${frequencyType === ft ? 'selected' : ''}`}
              onClick={() => setFrequencyType(ft)}>
              {ft === 'daily' ? '📅 Diario' : ft === 'weekly' ? '📆 Semanal' : '🗓️ Mensual'}
            </button>
          ))}
        </div>
      </div>

      {frequencyType !== 'daily' && (
        <div className="form-group">
          <label className="form-label">
            Meta: {targetCount} {targetCount === 1 ? 'vez' : 'veces'} por {frequencyType === 'weekly' ? 'semana' : 'mes'}
          </label>
          <input className="input" type="number" min={1} max={frequencyType === 'weekly' ? 7 : 31}
            value={targetCount} onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" id="habit-submit-btn">
          {habit ? 'Guardar cambios' : 'Crear hábito'}
        </button>
      </div>
    </form>
  );
}
