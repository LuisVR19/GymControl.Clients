import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface NotificationRow {
  id:         string;
  cat:        'critical' | 'warning' | 'info';
  sender:     string;
  title:      string;
  body:       string;
  read:       boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    return count ?? 0;
  }

  async getNotifications(): Promise<NotificationRow[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from('notifications')
      .select('id, cat, sender, title, body, read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return (data ?? []) as NotificationRow[];
  }

  async deleteOne(id: string): Promise<void> {
    await supabase.from('notifications').delete().eq('id', id);
  }

  async deleteAll(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').delete().eq('user_id', user.id);
  }
}
