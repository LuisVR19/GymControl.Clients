import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class AttendanceService {

  async getAttendanceDays(year: number, month: number): Promise<Set<number>> {
    const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const end   = new Date(year, month, 0).toISOString().split('T')[0];

    const { data } = await supabase
      .from('attendance')
      .select('checked_in_at')
      .gte('checked_in_at', `${start}T00:00:00`)
      .lte('checked_in_at', `${end}T23:59:59`);

    const days = new Set<number>();
    (data ?? []).forEach(a => days.add(new Date(a.checked_in_at).getDate()));
    return days;
  }
}
