# Changelog - Habit Tracker

Este documento detalla todas las características, mejoras y correciones implementadas en el proyecto.

## [1.2.0] - Fase 3: Gamificación y Retención (Mayo 2026)

### Añadido
- **Sistema de Experiencia (XP):** Cálculo dinámico de puntos basado en el historial de hábitos (10 XP por hábito completado al 100%, 5 XP por progreso parcial).
- **Sistema de Niveles:** Curva de progresión estilo RPG para subir de nivel a medida que se acumula XP.
- **Componente `LevelProgress`:** Barra de progreso visual en el Dashboard que muestra el nivel actual, XP total y cuánto falta para el siguiente nivel.
- **Vitrina de Medallas (`BadgesShowcase`):** Sistema de logros que evalúa dinámicamente las acciones del usuario.
- **Nuevas Medallas:** 
  - *Primer Paso:* Por completar el primer hábito.
  - *Coleccionista:* Por crear 5 hábitos distintos.
  - *Buena Racha:* Por conseguir 3 días consecutivos en un hábito.
  - *Imparable:* Por conseguir 7 días consecutivos.
  - *Maestro del Tiempo:* Por registrar una sesión de enfoque.
  - *Veterano:* Por alcanzar el Nivel 5.
- **Celebración Visual:** Animación de confeti al subir de nivel.

## [1.1.0] - Fase 2: Hábitos Cuantitativos y Modo Enfoque (Mayo 2026)

### Añadido
- **Hábitos Medibles:** Soporte en base de datos (`goal_value`, `goal_unit`, `progress_value`) e interfaz para hábitos cuantitativos.
- **Unidades Personalizadas:** Selector de unidades (Vez, Minutos, Horas, Mililitros, Páginas) en el formulario de creación.
- **Controles de Progreso:** Botones interactivos `+` y `-` en las tarjetas de hábitos para aumentar/disminuir el progreso según la meta establecida (ajuste inteligente de saltos/steps).
- **Modo Enfoque (Pomodoro):** Temporizador circular a pantalla completa para hábitos basados en tiempo. Permite registrar minutos precisos automáticamente al finalizar la sesión.
- **Revisión de Sesión:** Pantalla final tras el modo enfoque que permite ajustar los minutos enfocados antes de guardarlos en la base de datos.
- **Soporte PWA:** Integración de `vite-plugin-pwa` para instalar la aplicación en dispositivos móviles y de escritorio.
- **Diálogos Nativos:** Creación del componente `ConfirmDialog` para reemplazar las alertas feas del navegador (`window.confirm`) por modales limpios de la app al eliminar hábitos o descartar sesiones.

### Corregido
- Solucionado el "flash" visual que ocurría al abrir el temporizador Pomodoro debido a conflictos de renderizado con las animaciones de `framer-motion` (solucionado usando `createPortal`).

## [1.0.0] - Fase 1: Infraestructura y Funciones Base

### Añadido
- Interfaz moderna y dinámica utilizando `framer-motion` y paletas de colores llamativos.
- Integración completa con Supabase (Autenticación y Base de Datos).
- Mapa de calor estilo GitHub (`CalendarHeatmap`) para visualizar el historial general.
- Tarjetas de estadísticas de alto nivel (`StatsCards`).
- Seguimiento de "Rachas" (Streaks).
- Arquitectura de componentes escalable en React (Vite).
