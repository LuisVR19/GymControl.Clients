import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { MembershipPlan } from '../models';

const MS_PER_DAY = 86_400_000;

@Injectable({ providedIn: 'root' })
export class MembershipService {

  async getActiveMembership(): Promise<MembershipPlan | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_memberships')
      .select('*, gym_plans!user_memberships_plan_id_fkey(*)')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .maybeSingle();

    if (error || !data) return null;

    const plan = (data as any).gym_plans;

    const coverageEnd = (data as any).current_coverage_end_date ?? data.expiration_date;
    const expiry      = coverageEnd ? this.parseLocalDate(coverageEnd) : null;
    const now         = new Date();
    now.setHours(0, 0, 0, 0);

    const status: 'active' | 'expired' | 'pending' = expiry
      ? (expiry >= now ? 'active' : 'expired')
      : 'expired';

    const nextPaymentIso = (() => {
      if (!coverageEnd) return data.next_payment_date;
      const d = this.parseLocalDate(coverageEnd);
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();

    const daysRemaining = expiry
      ? Math.max(0, Math.round((expiry.getTime() - now.getTime()) / MS_PER_DAY))
      : 0;

    // Fetch all active/future payments to get accurate months paid and coverage start.
    // Uses coverage_end_date >= today to include all chained advance payments.
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const { data: activePmts } = await supabase
      .from('membership_payments')
      .select('coverage_start_date, months_paid')
      .eq('membership_id', data.id)
      .gte('coverage_end_date', todayStr);

    let monthsPaid = 1;
    let daysTotal  = Math.max(daysRemaining, plan?.duration_days ?? 30);

    if (activePmts?.length) {
      monthsPaid = activePmts.reduce((sum: number, p: any) => sum + (p.months_paid ?? 1), 0);

      const chainStart = activePmts.reduce(
        (min: string | null, p: any) => (!min || p.coverage_start_date < min ? p.coverage_start_date : min),
        null as string | null,
      );

      if (chainStart && coverageEnd) {
        const start = this.parseLocalDate(chainStart);
        const end   = this.parseLocalDate(coverageEnd);
        daysTotal   = Math.max(1, Math.round((end.getTime() - start.getTime()) / MS_PER_DAY));
      }
    }

    return {
      name:           plan?.name ?? 'Plan',
      price:          Number(plan?.price ?? 0),
      nextPayment:    this.formatDate(nextPaymentIso),
      status,
      expirationDate: this.formatDate(coverageEnd),
      daysRemaining,
      daysTotal,
      monthsPaid,
      features:       Array.isArray(plan?.features) ? plan.features : [],
    };
  }

  // Parse 'YYYY-MM-DD' as local midnight to avoid UTC offset shifting the date.
  private parseLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private formatDate(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-CR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
