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

    const { data: memberships } = await supabase
      .from('user_memberships')
      .select('id, gym_plans!inner(name)')
      .eq('user_id', user.id);

    const membershipIds = (memberships ?? []).map((m: any) => m.id);
    if (!membershipIds.length) return [];

    const planByMembership: Record<string, string> = {};
    (memberships ?? []).forEach((m: any) => {
      planByMembership[m.id] = m.gym_plans?.name ?? '';
    });

    const { data, error } = await supabase
      .from('membership_payments')
      .select('id, amount, payment_date, status, method, membership_id')
      .in('membership_id', membershipIds)
      .order('payment_date', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map(p => {
      const raw = Number(p.amount);
      return {
        date: new Date(p.payment_date).toLocaleDateString('es-CR', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
        amount: raw.toLocaleString('es-CR'),
        rawAmount: raw,
        method: METHOD_LABELS[p.method] ?? p.method,
        status: p.status as 'paid' | 'pending' | 'overdue',
        plan: planByMembership[p.membership_id] ?? '',
        ref: 'TRX-' + String(p.id).replace(/-/g, '').slice(0, 12).toUpperCase(),
      };
    });
  }
}
