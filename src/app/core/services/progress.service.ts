import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { Measurement, MeasurementEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class ProgressService {

  async getBodyFatData(): Promise<number[]> {
    const { data } = await supabase
      .from('client_progress')
      .select('body_fat, date')
      .not('body_fat', 'is', null)
      .order('date', { ascending: false })
      .limit(7);
    return (data ?? []).map(r => Number(r.body_fat)).reverse();
  }

  async getWeightData(): Promise<number[]> {
    const { data } = await supabase
      .from('client_progress')
      .select('weight, date')
      .not('weight', 'is', null)
      .order('date', { ascending: false })
      .limit(7);
    return (data ?? []).map(r => Number(r.weight)).reverse();
  }

  async saveMeasurements(entry: MeasurementEntry): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('unauthenticated');

    const today = new Date().toISOString().split('T')[0];

    const payload: Record<string, number> = {};
    const set = (col: string, val: number | undefined) => {
      if (val != null && !Number.isNaN(val) && val > 0) payload[col] = val;
    };

    set('weight',          entry.weight);
    set('body_fat',        entry.bodyFat);
    set('neck_cm',         entry.neck);
    set('chest_cm',        entry.chest);
    set('waist_cm',        entry.waist);
    set('hips_cm',         entry.hip);
    set('biceps_left_cm',  entry.leftArm);
    set('biceps_right_cm', entry.rightArm);
    set('thigh_left_cm',   entry.thighLeft);
    set('thigh_right_cm',  entry.thighRight);
    set('calf_left_cm',    entry.calfLeft);
    set('calf_right_cm',   entry.calfRight);

    if (!Object.keys(payload).length) throw new Error('no_valid_values');

    const { error } = await supabase
      .from('client_progress')
      .upsert(
        { user_id: user.id, date: today, ...payload },
        { onConflict: 'user_id,date' }
      );

    if (error) throw error;
  }

  async getMeasurements(): Promise<Measurement[]> {
    const { data } = await supabase
      .from('client_progress')
      .select('chest_cm, waist_cm, biceps_left_cm, thigh_left_cm, date')
      .order('date', { ascending: false })
      .limit(2);

    if (!data?.length) return [];

    const latest = data[0];
    const prev = data[1] ?? null;

    const fmt = (v: number | null): string => v != null ? String(v) : '—';
    const delta = (curr: number | null, p: number | null): string => {
      if (curr == null || p == null) return '—';
      const d = curr - p;
      return (d >= 0 ? '+' : '') + d.toFixed(1);
    };

    return [
      { label: 'Pecho',   value: fmt(latest.chest_cm),       unit: 'cm', delta: delta(latest.chest_cm, prev?.chest_cm) },
      { label: 'Cintura', value: fmt(latest.waist_cm),        unit: 'cm', delta: delta(latest.waist_cm, prev?.waist_cm) },
      { label: 'Brazo',   value: fmt(latest.biceps_left_cm),  unit: 'cm', delta: delta(latest.biceps_left_cm, prev?.biceps_left_cm) },
      { label: 'Pierna',  value: fmt(latest.thigh_left_cm),   unit: 'cm', delta: delta(latest.thigh_left_cm, prev?.thigh_left_cm) },
    ];
  }
}
