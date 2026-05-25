import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface NotificationRow {
  id:           string;
  cat:          'critical' | 'warning' | 'info';
  sender:       string;
  sender_avatar: string | null;
  title:        string;
  body:         string;
  read:         boolean;
  created_at:   string;
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

    const rows = (data ?? []) as Omit<NotificationRow, 'sender_avatar'>[];
    if (rows.length === 0) return [];

    const senderEmails = [...new Set(rows.map(r => r.sender))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email, name, avatar_url')
      .in('email', senderEmails);

    const profileMap = new Map<string, { name: string; avatar_url: string | null }>(
      (profiles ?? []).map(p => [p.email, { name: p.name, avatar_url: p.avatar_url ?? null }])
    );

    return rows.map(r => ({
      ...r,
      sender:        profileMap.get(r.sender)?.name ?? r.sender,
      sender_avatar: profileMap.get(r.sender)?.avatar_url ?? null,
    }));
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
