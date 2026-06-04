import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { Payment } from '../models';

const METHOD_LABELS: Record<string, string> = {
  tarjeta:      'Tarjeta',
  transferencia: 'Transferencia',
  efectivo:     'Efectivo',
  sinpe:        'SINPE Móvil',
  otro:         'Otro',
};

export interface MembershipInfo {
  id: string;
  planName: string;
  pricePerMonth: number;
  nextPaymentDate: string | null; // 'YYYY-MM-DD' — mirrors v_clients.next_payment_date
}

export interface SubmitProofPayload {
  membershipId: string;
  monthsPaid:   number;
  amount:       number;
  method:       string;   // 'sinpe' | 'transferencia'
  paymentDate:  string;   // 'YYYY-MM-DD'
  notes:        string | null;
  proofFile:    File;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {

  async getMembershipInfo(): Promise<MembershipInfo | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_memberships')
      .select('id, current_coverage_end_date, next_payment_date, gym_plans!user_memberships_plan_id_fkey(name, price)')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .maybeSingle();

    if (error || !data) return null;
    const plan = (data as any).gym_plans;
    const coverageEnd: string | null = (data as any).current_coverage_end_date ?? null;
    const storedNext:  string | null = (data as any).next_payment_date          ?? null;

    // Mirror v_clients.next_payment_date logic exactly:
    // CASE WHEN current_coverage_end_date IS NOT NULL THEN coverage_end + 1 ELSE next_payment_date END
    const nextPaymentDate: string | null = coverageEnd
      ? (() => {
          const [y, m, d] = coverageEnd.split('-').map(Number);
          const dt = new Date(y, m - 1, d + 1);
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        })()
      : storedNext;

    return {
      id:             (data as any).id,
      planName:       plan?.name         ?? 'Plan',
      pricePerMonth:  Number(plan?.price ?? 0),
      nextPaymentDate,
    };
  }

  async submitPaymentProof(payload: SubmitProofPayload): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Upload proof image
    const ext  = payload.proofFile.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('payment-proofs')
      .upload(path, payload.proofFile, { upsert: false, contentType: payload.proofFile.type });

    if (uploadErr) throw uploadErr;

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(path);

    // Call RPC
    const { error: rpcErr } = await supabase.rpc('submit_payment_proof', {
      p_membership_id: payload.membershipId,
      p_months_paid:   payload.monthsPaid,
      p_amount:        payload.amount,
      p_method:        payload.method,
      p_payment_date:  payload.paymentDate,
      p_notes:         payload.notes,
      p_proof_url:     publicUrl,
    });

    if (rpcErr) throw rpcErr;
  }

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
      .select('id, amount, payment_date, status, payment_method_id, membership_id, group_id, coverage_start_date, coverage_end_date, months_paid, proof_url');

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
        method:       METHOD_LABELS[p.payment_method_id] ?? p.payment_method_id,
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
        proofUrl:   p.proof_url ?? undefined,
      };
    });
  }
}
