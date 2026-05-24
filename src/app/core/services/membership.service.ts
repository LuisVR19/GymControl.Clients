import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { MembershipPlan } from '../models';


const MS_PER_DAY = 86_400_000;

@Injectable({ providedIn: 'root' })
export class MembershipService {

  async getActiveMembership(): Promise<MembershipPlan | null> {
    const { data, error } = await supabase
      .from('user_memberships')
      .select('*, gym_plans!user_memberships_plan_id_fkey(*)')
      .eq('is_current', true)
      .maybeSingle();

    if (error || !data) return null;

    const plan = (data as any).gym_plans;

    const start  = data.start_date      ? new Date(data.start_date)      : null;
    const expiry = data.expiration_date ? new Date(data.expiration_date) : null;
    const now    = new Date();

    const daysTotal     = (start && expiry) ? Math.round((expiry.getTime() - start.getTime()) / MS_PER_DAY) : 0;
    const daysRemaining = expiry ? Math.max(0, Math.ceil((expiry.getTime() - now.getTime())  / MS_PER_DAY)) : 0;

    return {
      name:           plan?.name ?? 'Plan',
      price:          Number(plan?.price ?? 0),
      nextPayment:    this.formatDate(data.next_payment_date),
      status:         data.payment_status as 'active' | 'expired' | 'pending',
      expirationDate: this.formatDate(data.expiration_date),
      daysRemaining,
      daysTotal,
      features:       Array.isArray(plan?.features) ? plan.features : [],
    };
  }

  private formatDate(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-CR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
