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
    goal_value?: number;
    goal_unit?: string;
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
  const [isQuantitative, setIsQuantitative] = useState((habit?.goal_value ?? 1) > 1 || (habit?.goal_unit ?? 'vez') !== 'vez');
  const [goalValue, setGoalValue] = useState(habit?.goal_value ?? 1);
  const [goalUnit, setGoalUnit] = useState(habit?.goal_unit ?? 'vez');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      frequency_type: frequencyType,
      target_count: targetCount,
      goal_value: isQuantitative ? goalValue : 1,
      goal_unit: isQuantitative ? goalUnit.trim() || 'vez' : 'vez'
    });
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

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} onClick={() => setIsQuantitative(!isQuantitative)}>
        <input type="checkbox" checked={isQuantitative} readOnly style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Hábito medible</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Ej: Beber 2000 ml de agua, Leer 20 páginas</div>
        </div>
      </div>

      {isQuantitative && (
        <div className="form-row" style={{ marginTop: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Meta</label>
            <input className="input" type="number" min={1} value={goalValue} onChange={(e) => setGoalValue(Math.max(1, parseInt(e.target.value) || 1))} placeholder="Ej: 2000" required />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Unidad</label>
            <select className="input" value={goalUnit} onChange={(e) => setGoalUnit(e.target.value)} required style={{ appearance: 'none' }}>
              <option value="vez">Vez (veces)</option>
              <option value="minutos">Minutos</option>
              <option value="horas">Horas</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="páginas">Páginas</option>
            </select>
          </div>
        </div>
      )}

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
            Frecuencia: {targetCount} {targetCount === 1 ? 'vez' : 'veces'} por {frequencyType === 'weekly' ? 'semana' : 'mes'}
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
