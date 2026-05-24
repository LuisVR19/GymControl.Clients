import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { TodayWorkout, ScheduleEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  async getSchedule(): Promise<ScheduleEntry[]> {
    const { data, error } = await supabase
      .from('user_schedule')
      .select('id, day_of_week, routine_id, day_number, routines(name)')
      .order('day_of_week');

    if (error || !data) return [];

    return (data as any[]).map(s => ({
      id:          s.id,
      dayOfWeek:   s.day_of_week,
      routineId:   s.routine_id,
      dayNumber:   s.day_number,
      routineName: s.routines?.name ?? 'Rutina',
    }));
  }

  async assign(routineId: string, dayNumber: number, dayOfWeek: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const safeDayNumber = dayNumber ?? 1;
    await supabase
      .from('user_schedule')
      .upsert(
        { user_id: user.id, routine_id: routineId, day_number: safeDayNumber, day_of_week: dayOfWeek },
        { onConflict: 'user_id,day_of_week' }
      );
  }

  async remove(dayOfWeek: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_schedule')
      .delete()
      .eq('user_id', user.id)
      .eq('day_of_week', dayOfWeek);
  }

  async getTodaySchedule(): Promise<{ routineId: string; dayNumber: number } | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const todayDow = (() => { const d = new Date().getDay(); return d === 0 ? 7 : d; })();

    const { data } = await supabase
      .from('user_schedule')
      .select('routine_id, day_number')
      .eq('user_id', user.id)
      .eq('day_of_week', todayDow)
      .maybeSingle();

    if (!data) return null;
    return { routineId: data.routine_id, dayNumber: data.day_number ?? 1 };
  }

  async getTodayWorkout(): Promise<TodayWorkout | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const todayDow = (() => { const d = new Date().getDay(); return d === 0 ? 7 : d; })();

    const { data: schedule } = await supabase
      .from('user_schedule')
      .select(`
        routine_id,
        day_number,
        routines(
          name,
          routine_exercises(day_number, sets)
        )
      `)
      .eq('user_id', user.id)
      .eq('day_of_week', todayDow)
      .single();

    if (!schedule) return null;

    const s = schedule as any;
    const routineId   = s.routine_id;
    const dayNumber   = s.day_number ?? 1;
    const routineName = s.routines?.name ?? 'Rutina';

    const allExs: any[]  = s.routines?.routine_exercises ?? [];
    const totalDays      = new Set(allExs.map(e => e.day_number ?? 1)).size || 1;
    const todayExs       = allExs.filter(e => (e.day_number ?? 1) === dayNumber);
    const exercisesCount = todayExs.length;
    const setsCount      = todayExs.reduce((acc, e) => acc + (e.sets ?? 0), 0);
    const estimatedMins  = Math.max(10, Math.round((setsCount * 2.5) / 5) * 5);

    return { routineId, routineName, dayNumber, totalDays, exercisesCount, setsCount, estimatedMins };
  }
}
