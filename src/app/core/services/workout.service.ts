import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class WorkoutService {

  async logWorkout(logs: { exerciseId: string; weight: number; reps: number }[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !logs.length) return;

    await supabase.from('workout_logs').insert(
      logs.map(l => ({ user_id: user.id, exercise_id: l.exerciseId, weight: l.weight, reps: l.reps }))
    );
  }

  async getBenchData(): Promise<number[]> {
    const { data: exData } = await supabase
      .from('exercises')
      .select('id')
      .ilike('name', '%banca%')
      .limit(1);

    if (!exData?.length) return [];

    const { data } = await supabase
      .from('workout_logs')
      .select('weight, created_at')
      .eq('exercise_id', exData[0].id)
      .order('created_at', { ascending: true })
      .limit(7);

    return (data ?? []).map(l => Number(l.weight));
  }

  async getVolumeData(): Promise<number[]> {
    const { data } = await supabase
      .from('workout_logs')
      .select('weight, reps, created_at')
      .order('created_at', { ascending: true })
      .limit(200);

    if (!data?.length) return [];

    const byDate = new Map<string, number>();
    for (const l of data) {
      const date = l.created_at.split('T')[0];
      byDate.set(date, (byDate.get(date) ?? 0) + Number(l.weight) * (l.reps ?? 0));
    }

    return Array.from(byDate.values()).slice(-8);
  }

  async checkIn(gymId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('attendance').insert({ user_id: user.id, gym_id: gymId });
  }
}
