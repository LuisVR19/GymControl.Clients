import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { WeeklyStats } from '../models';

@Injectable({ providedIn: 'root' })
export class StatsService {

  async getWeeklyStats(): Promise<WeeklyStats> {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0, 0, 0, 0);

    const [scheduleRes, weekLogsRes, allLogsRes] = await Promise.all([
      supabase
        .from('user_schedule')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('workout_logs')
        .select('created_at')
        .gte('created_at', monday.toISOString()),
      supabase
        .from('workout_logs')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(60),
    ]);

    const total = scheduleRes.count ?? 0;

    const completedDays = new Set(
      (weekLogsRes.data ?? []).map(l => new Date(l.created_at).toDateString())
    );
    const completed = completedDays.size;

    const allDays = new Set(
      (allLogsRes.data ?? []).map(l => new Date(l.created_at).toDateString())
    );
    let streak = 0;
    const check = new Date(today);
    while (allDays.has(check.toDateString())) {
      streak++;
      check.setDate(check.getDate() - 1);
    }

    return { completed, total, streak };
  }
}
