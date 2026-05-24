# Base de datos — GymControl

## Tablas

### `profiles`
Datos del usuario autenticado (nombre, email, rol).
- **Relaciones:** ninguna
- **Usado en:** `auth.service.ts` → carga y guarda el perfil al login

---

### `gym_plans`
Planes de membresía disponibles en el gimnasio (nombre, precio, duración).
- **Relaciones:** ← `user_memberships.plan_id`
- **Usado en:** `membership.service.ts` → join automático al leer membresías

---

### `user_memberships`
Membresía activa de cada cliente (fechas, estado, plan asignado).
- **Relaciones:** → `gym_plans` (plan_id)
- **Usado en:** `membership.service.ts` → muestra plan activo en home y perfil

---

### `membership_payments`
Historial de pagos de membresía (monto, fecha, método, estado).
- **Relaciones:** ninguna explícita
- **Usado en:** `payment.service.ts` → listado de pagos en pantalla perfil

---

### `attendance`
Registro de asistencias al gimnasio (fecha/hora de entrada).
- **Relaciones:** ninguna explícita
- **Usado en:** `membership.service.ts` → cuenta asistencias semanales; `attendance.service.ts` → historial; `workout.service.ts` → registra entrada al iniciar entreno

---

### `exercises`
Catálogo de ejercicios disponibles (nombre, grupo muscular).
- **Relaciones:** ← `routine_exercises.exercise_id`; ← `workout_logs.exercise_id`
- **Usado en:** `workout.service.ts` → búsqueda de ejercicios

---

### `workout_logs`
Historial de series realizadas por el usuario (ejercicio, peso, reps, fecha).
- **Relaciones:** → `exercises` (exercise_id)
- **Usado en:** `workout.service.ts` → guarda series al finalizar; `routine.service.ts` → muestra última performance en detalle de rutina

---

### `routines`
Definición de cada rutina (nombre, descripción).
- **Relaciones:** ← `user_routines.routine_id`; ← `user_schedule.routine_id`; → `routine_exercises`
- **Usado en:** `routine.service.ts` → lista rutinas asignadas; `schedule.service.ts` → nombre de rutina del día

---

### `routine_exercises`
Ejercicios que componen cada rutina, con día, series, reps y orden.
- **Relaciones:** → `routines` (routine_id); → `exercises` (exercise_id)
- **Usado en:** `routine.service.ts` → carga ejercicios en detalle/entreno; `schedule.service.ts` → calcula stats del entreno de hoy

---

### `user_routines`
Rutinas asignadas a cada cliente por el entrenador.
- **Relaciones:** → `routines` (routine_id)
- **Usado en:** `routine.service.ts` → obtiene las rutinas del usuario para mostrar en pantalla Rutinas

---

### `user_schedule`
Horario semanal del cliente: qué rutina/día hace cada día de la semana.
- **Relaciones:** → `routines` (routine_id)
- **Conflicto único:** `(user_id, day_of_week)`
- **Usado en:** `schedule.service.ts` → asigna rutina a día de semana; calcula entreno de hoy para el home

---

### `client_progress`
Medidas corporales por fecha (peso, grasa, perímetros de torso, brazos y piernas).
- **Relaciones:** ninguna
- **Conflicto único:** `(user_id, date)` — upsert parcial por día
- **Usado en:** `progress.service.ts` → guarda medidas desde el modal; muestra gráficas en pantalla Progreso
