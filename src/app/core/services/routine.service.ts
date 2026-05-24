import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { Exercise, ExerciseSet, Routine, UpcomingWorkout } from '../models';
import { DAY_NAMES, MONTHS } from '../utils/date.utils';

@Injectable({ providedIn: 'root' })
export class RoutineService {

  async getMyRoutines(): Promise<Routine[]> {
    const { data, error } = await supabase
      .from('user_routines')
      .select(`
        routine_id,
        assigned_at,
        routines(
          id, name, description,
          routine_exercises(day_number, day_label, sets, reps, order_number)
        )
      `)
      .order('assigned_at', { ascending: false });

    if (error || !data?.length) return [];

    const result: Routine[] = [];

    for (const ur of data as any[]) {
      const r = ur.routines;
      if (!r) continue;

      const exercises: any[] = r.routine_exercises ?? [];
      const dayNums = [...new Set<number>(exercises.map((e: any) => e.day_number ?? 1))].sort((a, b) => a - b);

      dayNums.forEach((dayNum, idx) => {
        const dayExs = exercises.filter((e: any) => (e.day_number ?? 1) === dayNum);
        const dayLabel = dayExs[0]?.day_label ?? `Día ${dayNum}`;
        const setsCount = dayExs.reduce((acc: number, e: any) => acc + (e.sets ?? 0), 0);

        result.push({
          id: `${r.id}-${dayNum}`,
          routineId: r.id,
          dayNumber: dayNum,
          name: `${r.name} · ${dayLabel}`,
          day: dayLabel,
          dayLabel,
          setsCount,
          exercisesCount: dayExs.length,
          active: false,
          program: r.description ?? r.name,
        });
      });
    }

    return result;
  }

  async getWorkoutExercises(routineId: string, dayNumber?: number): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('routine_exercises')
      .select('id, sets, reps, day_number, exercises(id, name, description, video_url, youtube_url, muscle_groups(id, name))')
      .eq('routine_id', routineId)
      .order('order_number', { ascending: true });

    if (error || !data?.length) return [];

    const rows = dayNumber != null
      ? (data as any[]).filter(re => (re.day_number ?? 1) === dayNumber)
      : (data as any[]);

    if (!rows.length) return [];

    const exerciseIds = rows.map((re: any) => re.exercises?.id).filter(Boolean);
    const lastPerfMap = await this.fetchLastPerformances(exerciseIds);

    return rows.map(re => {
      const ex = re.exercises;
      const setsArr: ExerciseSet[] = Array.from({ length: re.sets ?? 3 }, () => ({
        weight: 0, reps: re.reps ?? 10, done: false,
      }));
      return {
        id: ex?.id ?? re.id,
        name: ex?.name ?? 'Ejercicio',
        muscle: (ex?.muscle_groups as any)?.name ?? '',
        target: `${re.sets} × ${re.reps}`,
        lastPerformance: lastPerfMap.get(ex?.id) ?? '—',
        sets: setsArr,
        description: ex?.description ?? undefined,
        videoUrl: ex?.youtube_url || ex?.video_url || undefined,
      } as Exercise;
    });
  }

  private async fetchLastPerformances(exerciseIds: string[]): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    if (!exerciseIds.length) return map;

    const { data } = await supabase
      .from('workout_logs')
      .select('exercise_id, weight, reps, created_at')
      .in('exercise_id', exerciseIds)
      .gt('weight', 0)
      .order('created_at', { ascending: false });

    const seen = new Set<string>();
    for (const log of data ?? []) {
      if (!seen.has(log.exercise_id)) {
        seen.add(log.exercise_id);
        map.set(log.exercise_id, `${log.weight} kg × ${log.reps}`);
      }
    }
    return map;
  }

  async getRoutineName(routineId: string): Promise<string> {
    const { data } = await supabase
      .from('routines')
      .select('name')
      .eq('id', routineId)
      .single();
    return (data as any)?.name ?? 'Rutina';
  }

  async getUpcomingWorkouts(): Promise<UpcomingWorkout[]> {
    const { data } = await supabase
      .from('user_routines')
      .select(`
        routines(
          name,
          routine_exercises(day_number, day_label, order_number)
        )
      `)
      .order('assigned_at', { ascending: false })
      .limit(1);

    if (!data?.length) return [];
    const routine = (data[0] as any).routines;
    if (!routine) return [];

    const exercises: any[] = routine.routine_exercises ?? [];
    const dayNums = [...new Set<number>(exercises.map((e: any) => e.day_number ?? 1))].sort((a, b) => a - b);

    const today = new Date();
    const todayDow = today.getDay() === 0 ? 7 : today.getDay();

    return dayNums.slice(0, 3).map((dayNum: number) => {
      const dayExs = exercises.filter((e: any) => (e.day_number ?? 1) === dayNum);
      const diff = ((dayNum - todayDow) + 7) % 7 || 7;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + diff);
      return {
        day: String(nextDate.getDate()).padStart(2, '0'),
        month: MONTHS[nextDate.getMonth()],
        name: `${routine.name} · ${dayExs[0]?.day_label ?? 'Día ' + dayNum}`,
        time: '07:00',
      };
    });
  }
}
