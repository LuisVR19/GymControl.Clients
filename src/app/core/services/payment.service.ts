import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { Payment } from '../models';

const METHOD_LABELS: Record<string, string> = {
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  efectivo: 'Efectivo',
  otro: 'Otro',
};

@Injectable({ providedIn: 'root' })
export class PaymentService {

  async getPayments(): Promise<Payment[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: memberships, error: mErr } = await supabase
      .from('user_memberships')
      .select('id, group_id, plan_id')
      .eq('user_id', user.id);

    if (mErr || !memberships?.length) return [];

    const membershipIds = memberships.map((m: any) => m.id);
    const groupIds      = memberships.map((m: any) => m.group_id).filter(Boolean) as string[];
    const planIds       = [...new Set(memberships.map((m: any) => m.plan_id).filter(Boolean) as string[])];

    const { data: plans } = planIds.length
      ? await supabase.from('gym_plans').select('id, name').in('id', planIds)
      : { data: [] as any[] };

    const planNameById: Record<string, string> = {};
    (plans ?? []).forEach((p: any) => { planNameById[p.id] = p.name ?? ''; });

    const planByMembership: Record<string, string> = {};
    const planByGroup:      Record<string, string> = {};
    memberships.forEach((m: any) => {
      planByMembership[m.id] = planNameById[m.plan_id] ?? '';
      if (m.group_id) planByGroup[m.group_id] = planNameById[m.plan_id] ?? '';
    });

    let query = supabase
      .from('membership_payments')
      .select('id, amount, payment_date, status, method, membership_id, group_id, coverage_start_date, coverage_end_date, months_paid');

    if (groupIds.length > 0) {
      query = query.or(
        `membership_id.in.(${membershipIds.join(',')}),group_id.in.(${groupIds.join(',')})`
      );
    } else {
      query = query.in('membership_id', membershipIds);
    }

    const { data, error } = await query
      .order('payment_date', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map(p => {
      const raw      = Number(p.amount);
      const planName = p.membership_id
        ? (planByMembership[p.membership_id] ?? '')
        : (planByGroup[p.group_id]           ?? '');
      return {
        date: new Date(p.payment_date).toLocaleDateString('es-CR', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
        amount:       raw.toLocaleString('es-CR'),
        rawAmount:    raw,
        method:       METHOD_LABELS[p.method] ?? p.method,
        status:       p.status as 'paid' | 'pending' | 'overdue',
        plan:         planName,
        ref:          'TRX-' + String(p.id).replace(/-/g, '').slice(0, 12).toUpperCase(),
        isGroup:      !p.membership_id && !!p.group_id,
        coverageStart: p.coverage_start_date
          ? new Date(p.coverage_start_date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })
          : undefined,
        coverageEnd: p.coverage_end_date
          ? new Date(p.coverage_end_date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })
          : undefined,
        monthsPaid: p.months_paid ?? undefined,
      };
    });
  }
}
