import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { MembershipService } from '../../core/services/membership.service';
import { MembershipPlan } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  plan: MembershipPlan | null = null;
  clientName = '';
  memberSince = '';
  loading = true;
  isAffiliated = false;
  avatarUrl: string | null = null;

  settingsItems = [
    'Historial de pagos',
    'Datos personales',
    'Métodos de pago',
    'Notificaciones',
    'Cerrar sesión',
  ];

  constructor(
    private auth: AuthService,
    private membership: MembershipService,
    private router: Router,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.auth.profile$.subscribe(p => {
      if (p) {
        this.clientName = p.name ?? '';
        this.isAffiliated = !!p.gym_id;
        this.avatarUrl = p.avatar_url ?? null;
        const date = p.created_at
          ? new Date(p.created_at).toLocaleDateString('es-CR', { month: 'short', year: 'numeric' })
          : '';
        this.memberSince = `Miembro desde ${date}`;
      }
    });
    this.load();
  }

  async doRefresh(event: Event) {
    await this.load();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async load() {
    this.loading = true;
    try {
      this.plan = await this.membership.getActiveMembership();
    } catch {
      this.showToast('Error al cargar perfil');
    } finally {
      this.loading = false;
    }
  }

  goAffiliate() {
    this.router.navigate(['/tabs/perfil/affiliate-gym']);
  }

  async onSettingsItem(item: string) {
    if (item === 'Historial de pagos') {
      this.router.navigate(['/tabs/perfil/payment-history']);
    } else if (item === 'Datos personales') {
      this.router.navigate(['/tabs/perfil/personal-info']);
    } else if (item === 'Cerrar sesión') {
      await this.auth.logout();
    }
  }

  isDestructive(label: string): boolean {
    return label === 'Cerrar sesión';
  }

  formatPrice(n: number): string {
    return n.toLocaleString('es-CR');
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
