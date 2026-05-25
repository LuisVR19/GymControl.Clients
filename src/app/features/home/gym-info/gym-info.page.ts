import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { supabase } from '../../../core/supabase.client';
import { GymHour, GymInfo } from '../../../core/models';

@Component({
  selector: 'app-gym-info',
  standalone: false,
  templateUrl: './gym-info.page.html',
  styleUrls: ['./gym-info.page.scss'],
})
export class GymInfoPage implements OnInit {
  gymName    = '';
  gymLogoUrl: string | null = null;
  address:    string | null = null;
  phone:      string | null = null;
  whatsapp:   string | null = null;
  website:    string | null = null;
  instagram:  string | null = null;
  about:      string | null = null;
  hours:      GymHour[]     = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.applyGym(this.auth.currentGym);
    this.auth.gym$.subscribe(g => {
      this.applyGym(g);
      if (g?.id) this.loadHours(g.id);
    });
    const gymId = this.auth.currentGym?.id;
    if (gymId) this.loadHours(gymId);
  }

  private applyGym(g: GymInfo | null) {
    this.gymName    = g?.name      ?? 'Mi gimnasio';
    this.gymLogoUrl = g?.logo_url  ?? null;
    this.address    = g?.address   ?? null;
    this.phone      = g?.phone     ?? null;
    this.whatsapp   = g?.whatsapp  ?? null;
    this.website    = g?.website   ?? null;
    this.instagram  = g?.instagram ?? null;
    this.about      = g?.about     ?? null;
  }

  private async loadHours(gymId: string) {
    const { data } = await supabase
      .from('gym_hours')
      .select('id, gym_id, name, hours, sort_order')
      .eq('gym_id', gymId)
      .order('sort_order', { ascending: true });
    this.hours = (data ?? []) as GymHour[];
  }

  isClosed(hours: string): boolean {
    return hours.toLowerCase().includes('cerrado') || hours.toLowerCase().includes('closed');
  }

  get hasContact(): boolean {
    return !!(this.address || this.phone || this.whatsapp || this.website || this.instagram);
  }

  get whatsappHref(): string {
    return 'https://wa.me/' + (this.whatsapp ?? '').replace(/\D/g, '');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  goBack() { this.router.navigate(['/tabs/inicio']); }
}
