import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NotificationService } from '../../../core/services/notification.service';

export type NotifCategory = 'critical' | 'warning' | 'info';
export type NotifFilter   = 'all' | 'unread' | 'critical' | 'warning' | 'info';

export interface Notification {
  id:        string;
  cat:       NotifCategory;
  from:      string;
  avatarUrl: string | null;
  title:     string;
  desc:      string;
  t:         string;
  read:      boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.page.html',
  styleUrls:  ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  activeFilter: NotifFilter = 'all';
  loading = true;

  filters: { id: NotifFilter; label: string }[] = [
    { id: 'all',      label: 'Todas'     },
    { id: 'unread',   label: 'No leídas' },
    { id: 'critical', label: 'Críticas'  },
    { id: 'warning',  label: 'Avisos'    },
    { id: 'info',     label: 'Info'      },
  ];

  notifications: Notification[] = [];

  constructor(
    private notifService: NotificationService,
    private router: Router,
    private toast: ToastController,
  ) {}

  ngOnInit() { this.load(); }

  private async load() {
    this.loading = true;
    try {
      const rows = await this.notifService.getNotifications();
      this.notifications = rows.map(r => ({
        id:        r.id,
        cat:       r.cat,
        from:      r.sender,
        avatarUrl: r.sender_avatar,
        title:     r.title,
        desc:      r.body,
        t:         this.formatTime(r.created_at),
        read:      r.read,
      }));
    } catch {
      this.showToast('Error al cargar notificaciones');
    } finally {
      this.loading = false;
    }
  }

  private formatTime(iso: string): string {
    const now  = new Date();
    const d    = new Date(iso);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
    if (diff === 0) return 'Hoy ' + d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Ayer';
    return `${diff} d`;
  }

  get filtered(): Notification[] {
    if (this.activeFilter === 'all' || this.activeFilter === 'unread') return this.notifications;
    return this.notifications.filter(n => n.cat === this.activeFilter);
  }

  get unreadCount(): number { return this.notifications.length; }

  async markRead(id: string) {
    try {
      await this.notifService.deleteOne(id);
      this.notifications = this.notifications.filter(n => n.id !== id);
    } catch {
      this.showToast('Error al marcar como leída');
    }
  }

  async markAllRead() {
    try {
      await this.notifService.deleteAll();
      this.notifications = [];
    } catch {
      this.showToast('Error al marcar todas como leídas');
    }
  }

  catTone(cat: NotifCategory): { bg: string; dot: string; label: string } {
    const map = {
      critical: { bg: 'color-mix(in oklab, #E5484D 18%, transparent)', dot: '#E5484D',      label: 'Crítico' },
      warning:  { bg: 'color-mix(in oklab, #F5A524 22%, transparent)', dot: '#F5A524',      label: 'Aviso'   },
      info:     { bg: 'var(--bg-sunk)',                                 dot: 'var(--ink-3)', label: 'Info'    },
    };
    return map[cat];
  }

  goBack() { this.router.navigate(['/tabs/inicio']); }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 2500, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
